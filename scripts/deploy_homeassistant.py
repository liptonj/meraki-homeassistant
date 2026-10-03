"""Deploy exact versions through HA and its authenticated Supervisor bridge."""
import argparse
import asyncio
import json
import os
import re
from typing import Any
from urllib.parse import urlsplit

import aiohttp


class DeploymentError(RuntimeError):
    """A deployment could not be verified."""


def version(value: str) -> str:
    value = value.removeprefix("v")
    if not re.fullmatch(r"\d+\.\d+\.\d+[.a-zA-Z0-9-]*", value) or len(value) > 64:
        raise DeploymentError("Supply an explicit release version")
    return value


def repository_matches(value: str, repository: str) -> bool:
    try:
        parsed = urlsplit(value)
        return (parsed.scheme == "https" and parsed.hostname == "github.com"
                and not parsed.username and not parsed.password
                and parsed.path.strip("/").split("/")[:2] == repository.split("/"))
    except ValueError:
        return False


def meraki_entity(states: list[dict[str, Any]]) -> dict[str, Any]:
    candidates = [state for state in states
        if state.get("entity_id", "").startswith("update.")
        and repository_matches(state.get("attributes", {}).get("release_url") or "",
                               "liptonj/meraki-homeassistant")]
    if len(candidates) != 1:
        raise DeploymentError("Expected one Meraki integration update entity with its repository URL")
    return candidates[0]


def step_ca_addon(addons: list[dict[str, Any]]) -> dict[str, Any]:
    candidates = [addon for addon in addons
        if re.fullmatch(r"[a-zA-Z0-9]+_step-ca-scep", addon.get("slug", ""))
        and repository_matches(addon.get("url") or "", "liptonj/hassio-addons")]
    if len(candidates) != 1:
        raise DeploymentError("Expected one Step CA add-on from liptonj/hassio-addons")
    return candidates[0]


def job_failed(job: dict[str, Any]) -> bool:
    return bool(job.get("errors")) or any(job_failed(child) for child in job.get("child_jobs", []))


class HomeAssistant:
    def __init__(self, base: str, token: str, session: aiohttp.ClientSession):
        parsed = urlsplit(base)
        if (parsed.scheme not in ("https", "http") or not parsed.hostname
                or parsed.username or parsed.password or parsed.query or parsed.fragment):
            raise DeploymentError("HA_URL must be a Home Assistant base URL")
        token = token.strip()
        if not token or any(char.isspace() for char in token):
            raise DeploymentError("HA_TOKEN is missing or malformed")
        self.base, self.token, self.session = base.rstrip("/"), token, session

    async def rest(self, path: str, method: str = "GET", data: Any = None) -> Any:
        try:
            async with self.session.request(method, self.base + path,
                    headers={"Authorization": "Bearer " + self.token},
                    json=data, allow_redirects=False) as response:
                if response.status != 200:
                    raise DeploymentError(f"Home Assistant request failed (HTTP {response.status})")
                return await response.json()
        except (aiohttp.ClientError, TimeoutError, ValueError):
            raise DeploymentError("Home Assistant request failed; response details withheld") from None

    async def supervisor(self, endpoint: str, method: str = "get", data: Any = None,
                         timeout: int = 120) -> Any:
        print("Supervisor operation:", method.upper(), endpoint, flush=True)
        return await self.websocket({"type": "supervisor/api", "endpoint": endpoint,
                                     "method": method, "data": data or {}, "timeout": timeout}, timeout)

    async def websocket(self, command: dict[str, Any], timeout: int = 120) -> Any:
        ws_url = self.base.replace("https://", "wss://", 1).replace("http://", "ws://", 1) + "/api/websocket"
        try:
            async with asyncio.timeout(timeout + 20):
                async with self.session.ws_connect(ws_url, max_msg_size=4 * 1024 * 1024) as socket:
                    if (await socket.receive_json()).get("type") != "auth_required":
                        raise DeploymentError("Unexpected Home Assistant authentication handshake")
                    await socket.send_json({"type": "auth", "access_token": self.token})
                    if (await socket.receive_json()).get("type") != "auth_ok":
                        raise DeploymentError("Home Assistant authentication failed")
                    await socket.send_json({"id": 1, **command})
                    for _ in range(50):
                        result = await socket.receive_json()
                        if result.get("id") == 1:
                            if not result.get("success"):
                                error = result.get("error", {})
                                code = error.get("code", "unknown")
                                if code not in ("unknown_error", "unauthorized", "invalid_format", "not_found"):
                                    code = "unknown"
                                message = str(error.get("message", "")).lower()
                                clues = [word for word in ("404", "403", "405", "unhealthy", "blocked", "not found", "not ready", "not supported")
                                         if word in message]
                                raise DeploymentError(f"Home Assistant operation failed ({code}; {', '.join(clues) or 'details withheld'}); check its local logs")
                            return result.get("result", {})
                    raise DeploymentError("Home Assistant returned no matching result")
        except (aiohttp.ClientError, TimeoutError, ValueError):
            raise DeploymentError("Home Assistant connection failed; response details withheld") from None

    async def wait_job(self, result: dict[str, Any]) -> None:
        job_id = result.get("job_id")
        if not job_id:
            return
        if not re.fullmatch(r"[a-zA-Z0-9-]+", job_id):
            raise DeploymentError("Unexpected Supervisor job identifier")
        for _ in range(180):
            job = await self.supervisor("/jobs/" + job_id)
            if job_failed(job):
                raise DeploymentError("Supervisor job failed; check its local logs")
            if job.get("done"):
                return
            await asyncio.sleep(10)
        raise DeploymentError("Supervisor job has not completed; inspect it before retrying")

    async def wait_online(self) -> None:
        for _ in range(60):
            try:
                await self.rest("/api/")
                return
            except DeploymentError:
                await asyncio.sleep(5)
        raise DeploymentError("Home Assistant did not come back online")

    async def restart(self) -> None:
        await self.supervisor("/core/check", "post", timeout=120)
        try:
            await self.rest("/api/services/homeassistant/restart", "POST", {})
        except DeploymentError:
            pass  # Shutdown can close the HTTP connection before returning.
        await asyncio.sleep(45)
        await self.wait_online()

    async def inspect(self) -> None:
        config = await self.rest("/api/config")
        print("Core version:", config.get("version", "unknown"))
        entries = await self.rest("/api/config/config_entries/entry")
        print("Relevant integrations:", json.dumps([{key: row.get(key) for key in
                ("domain", "state", "disabled_by")}
                for row in entries if row.get("domain") in ("meraki_ha", "step_ca_scep")]))
        states = await self.rest("/api/states")
        updates = [{"entity_id": row["entity_id"],
                    **{key: row.get("attributes", {}).get(key) for key in
                       ("title", "installed_version", "latest_version", "release_url")}}
                   for row in states if row.get("entity_id", "").startswith("update.")
                   and any(word in row.get("entity_id", "") for word in ("meraki", "step_ca", "mariadb"))]
        print("Relevant updates:", json.dumps(updates))
        data = await self.supervisor("/addons")
        print("Relevant add-ons:", json.dumps([{key: row.get(key) for key in
                ("slug", "name", "version", "state", "url")}
                for row in data.get("addons", []) if any(word in row.get("slug", "")
                for word in ("step-ca", "mariadb"))]))

    async def deploy_meraki(self, expected: str) -> None:
        expected = version(expected)
        entity = meraki_entity(await self.rest("/api/states"))
        identity = entity["entity_id"]
        print("Verified Meraki integration entity:", identity)
        await self.rest("/api/services/homeassistant/update_entity", "POST", {"entity_id": identity})
        if str(entity.get("attributes", {}).get("installed_version", "")).removeprefix("v") != expected:
            await self.rest("/api/services/update/install", "POST", {"entity_id": identity, "version": "v" + expected})
        for _ in range(60):
            state = await self.rest("/api/states/" + identity)
            if str(state.get("attributes", {}).get("installed_version", "")).removeprefix("v") == expected and not state.get("attributes", {}).get("in_progress"):
                break
            await asyncio.sleep(5)
        else:
            raise DeploymentError("Meraki download did not reach the requested version")
        await self.restart()
        state = meraki_entity(await self.rest("/api/states"))
        if str(state.get("attributes", {}).get("installed_version", "")).removeprefix("v") != expected:
            raise DeploymentError("Meraki installed version differs from the requested version")
        print("Verified installed Meraki integration:", expected)

    async def verify_step_ca_companion(self) -> None:
        for _ in range(20):
            entries = await self.rest("/api/config/config_entries/entry?domain=step_ca_scep")
            if len(entries) == 1 and entries[0].get("state") == "loaded":
                print("Verified Step CA companion loaded")
                return
            if len(entries) > 1:
                raise DeploymentError("Expected one Step CA companion configuration")
            if not entries:
                flows = await self.websocket({"type": "config_entries/flow/progress"})
                candidates = [flow for flow in flows if flow.get("handler") == "step_ca_scep"
                              and flow.get("context", {}).get("source") == "hassio"]
                if len(candidates) == 1:
                    flow_id = candidates[0].get("flow_id", "")
                    if not re.fullmatch(r"[a-zA-Z0-9-]+", flow_id):
                        raise DeploymentError("Unexpected Step CA discovery identifier")
                    path = "/api/config/config_entries/flow/" + flow_id
                    form = await self.rest(path)
                    if form.get("type") == "form" and form.get("step_id") == "hassio_confirm":
                        result = await self.rest(path, "POST", {})
                        if result.get("type") != "create_entry":
                            raise DeploymentError("Step CA discovery could not be completed")
                        print("Completed Step CA add-on discovery")
            await asyncio.sleep(3)
        raise DeploymentError("Step CA companion did not load; inspect its integration status")

    async def deploy_step_ca(self, expected: str) -> None:
        expected = version(expected)
        await self.supervisor("/store/reload", "post")
        store = await self.supervisor("/store/addons")
        addon = step_ca_addon(store.get("addons", []))
        slug = addon["slug"]
        if str(addon.get("version_latest") or addon.get("version")) != expected:
            raise DeploymentError("Step CA store version differs from the requested version")
        installed = next((row for row in (await self.supervisor("/addons")).get("addons", []) if row.get("slug") == slug), None)
        services = await self.supervisor("/services")
        mysql = next((row for row in services.get("services", []) if row.get("slug") == "mysql"), {})
        if not mysql.get("available"):
            raise DeploymentError("MariaDB service must be configured and running before Step CA deployment")
        if installed:
            info = await self.supervisor("/addons/" + slug + "/info")
            if info.get("options", {}).get("database", "mariadb") != "mariadb":
                raise DeploymentError("Existing Step CA must use MariaDB; deployment does not migrate its CA")
            if info.get("version") != expected:
                addons = (await self.supervisor("/addons")).get("addons", [])
                backup_addons = [slug] + [row["slug"] for row in addons if row.get("slug") == "core_mariadb"]
                backup = await self.supervisor("/backups/new/partial", "post",
                    {"name": "Before Step CA " + expected, "addons": backup_addons, "homeassistant": True,
                     "homeassistant_exclude_database": True, "background": True})
                await self.wait_job(backup)
                print("Step CA and local MariaDB backup completed")
                await self.wait_job(await self.supervisor("/store/addons/" + slug + "/update", "post", {"background": True}))
        else:
            await self.wait_job(await self.supervisor("/store/addons/" + slug + "/install", "post", {"background": True}))
        info = await self.supervisor("/addons/" + slug + "/info")
        if info.get("version") != expected:
            raise DeploymentError("Step CA installed version differs from the requested version")
        if info.get("state") != "started":
            await self.supervisor("/addons/" + slug + "/start", "post", timeout=180)
        await asyncio.sleep(30)
        info = await self.supervisor("/addons/" + slug + "/info")
        if info.get("state") != "started" or info.get("version") != expected:
            raise DeploymentError("Step CA did not stay started on the requested version")
        await self.restart()
        await self.verify_step_ca_companion()
        print("Verified installed/running Step CA:", expected, "Core restarted")


async def reject_redirect(*args: Any) -> None:
    raise DeploymentError("Deployment endpoint redirected; credentials withheld")


async def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--inspect", action="store_true")
    parser.add_argument("--meraki-version", default="")
    parser.add_argument("--step-ca-version", default="")
    args = parser.parse_args()
    trace = aiohttp.TraceConfig()
    trace.on_request_redirect.append(reject_redirect)
    async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=30), trace_configs=[trace]) as session:
        client = HomeAssistant(os.environ.get("HA_URL", ""), os.environ.get("HA_TOKEN", ""), session)
        if args.inspect:
            await client.inspect()
        if args.meraki_version:
            await client.deploy_meraki(args.meraki_version)
        if args.step_ca_version:
            await client.deploy_step_ca(args.step_ca_version)
        if not any((args.inspect, args.meraki_version, args.step_ca_version)):
            raise DeploymentError("Choose inspection or an explicit version to deploy")


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except DeploymentError as error:
        raise SystemExit(str(error)) from None
    except Exception:
        raise SystemExit("Deployment failed; response details withheld") from None

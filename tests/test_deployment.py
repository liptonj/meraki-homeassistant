"""Check exact deployment targets and credential-safe verification failures."""

from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from scripts.deploy_homeassistant import (
    DeploymentError,
    HomeAssistant,
    job_failed,
    meraki_entity,
    repository_matches,
    step_ca_addon,
    version,
)


def meraki_state() -> dict:
    """Return the integration update fixture."""
    return {
        "entity_id": "update.meraki_integration",
        "attributes": {
            "release_url": "https://github.com/liptonj/meraki-homeassistant/releases",
            "installed_version": "3.2.9-beta.2",
        },
    }


def test_integration_target_cannot_select_wpn_portal() -> None:
    """Select by repository rather than the first Meraki name."""
    wpn = {
        "entity_id": "update.meraki_wpn_portal_update",
        "attributes": {"release_url": "https://github.com/liptonj/hassio-addons"},
    }
    integration = meraki_state()
    assert meraki_entity([wpn, integration]) == integration
    for states in ([wpn], [integration, integration]):
        with pytest.raises(DeploymentError):
            meraki_entity(states)


def test_repository_identity_requires_exact_github_owner_and_name() -> None:
    """Reject lookalike URLs and embedded credentials."""
    for url in (
        "https://github.com.evil.example/liptonj/meraki-homeassistant",
        "https://github.com/liptonj/meraki-homeassistant-other",
        "https://user@github.com/liptonj/meraki-homeassistant",
    ):
        assert not repository_matches(url, "liptonj/meraki-homeassistant")


def test_addon_target_is_step_ca_in_the_correct_repository() -> None:
    """Require both the exact slug suffix and the repository."""
    addon = {
        "slug": "abcd1234_step-ca-scep",
        "url": "https://github.com/liptonj/hassio-addons/tree/master/step-ca",
    }
    assert step_ca_addon([addon]) == addon
    with pytest.raises(DeploymentError):
        step_ca_addon([{**addon, "slug": "abcd1234_meraki-wpn-portal"}])


def test_version_is_explicit_and_job_failures_include_children() -> None:
    """Reject arbitrary version input and failed child jobs."""
    assert version("v3.2.9-beta.2") == "3.2.9-beta.2"
    for value in ("latest", "3.2.9;echo", "3.2.9\nsecret"):
        with pytest.raises(DeploymentError):
            version(value)
    assert job_failed({"child_jobs": [{"errors": [{"message": "secret"}]}]})
    assert not job_failed({"done": True, "errors": []})


def test_configuration_rejects_credential_urls_and_header_injection() -> None:
    """Validate credentials without logging their values."""
    for url, token in (
        ("https://user:secret@ha.example.org", "fixture"),
        ("https://ha.example.org", "fixture\nsecret"),
    ):
        with pytest.raises(DeploymentError) as caught:
            HomeAssistant(url, token, MagicMock())
        assert "secret" not in str(caught.value)


@pytest.mark.asyncio
async def test_meraki_mismatch_is_a_failed_deployment() -> None:
    """A restart returning online does not excuse a version mismatch."""
    client = HomeAssistant("https://ha.example.org", "fixture", MagicMock())
    current = meraki_state()
    old = {
        **current,
        "attributes": {**current["attributes"], "installed_version": "old"},
    }
    client.rest = AsyncMock(side_effect=[[current], {}, current, [old]])
    client.restart = AsyncMock()
    with pytest.raises(DeploymentError, match="differs"):
        await client.deploy_meraki("3.2.9-beta.2")
    client.restart.assert_awaited_once()


@pytest.mark.asyncio
async def test_inspection_does_not_issue_mutations() -> None:
    """Inspection only fetches public status metadata."""
    client = HomeAssistant("https://ha.example.org", "fixture", MagicMock())
    client.rest = AsyncMock(side_effect=[{"version": "2026.10"}, [], [meraki_state()]])
    client.supervisor = AsyncMock(return_value={"addons": []})
    with patch("builtins.print"):
        await client.inspect()
    assert all(len(call.args) == 1 for call in client.rest.call_args_list)
    client.supervisor.assert_awaited_once_with("/addons")


@pytest.mark.asyncio
async def test_companion_verification_completes_only_addon_discovery() -> None:
    """Complete the existing Supervisor confirmation and verify actual loading."""
    client = HomeAssistant("https://ha.example.org", "fixture", MagicMock())
    client.rest = AsyncMock(
        side_effect=[
            [],
            {"type": "form", "step_id": "hassio_confirm"},
            {"type": "create_entry"},
            [{"state": "loaded"}],
        ]
    )
    client.websocket = AsyncMock(
        return_value=[
            {
                "handler": "step_ca_scep",
                "flow_id": "abc123",
                "context": {"source": "hassio"},
            }
        ]
    )
    with patch("asyncio.sleep", new_callable=AsyncMock), patch("builtins.print"):
        await client.verify_step_ca_companion()
    client.rest.assert_any_await("/api/config/config_entries/flow/abc123", "POST", {})


@pytest.mark.asyncio
async def test_companion_verification_rejects_broken_entry_and_user_flow() -> None:
    """Fail a broken import without accepting arbitrary configuration flows."""
    client = HomeAssistant("https://ha.example.org", "fixture", MagicMock())
    for entries in ([{"state": "setup_error"}], []):
        client.rest = AsyncMock(return_value=entries)
        client.websocket = AsyncMock(
            return_value=[
                {
                    "handler": "step_ca_scep",
                    "flow_id": "abc123",
                    "context": {"source": "user"},
                }
            ]
        )
        with (
            patch("asyncio.sleep", new_callable=AsyncMock),
            pytest.raises(DeploymentError, match="did not load"),
        ):
            await client.verify_step_ca_companion()
        assert all(len(call.args) == 1 for call in client.rest.call_args_list)


@pytest.mark.asyncio
async def test_step_ca_checks_service_availability_without_reading_credentials() -> (
    None
):
    """The Core proxy can inspect service availability but cannot read its secrets."""
    client = HomeAssistant("https://ha.example.org", "fixture", MagicMock())
    addon = {
        "slug": "abcd1234_step-ca-scep",
        "url": "https://github.com/liptonj/hassio-addons/tree/master/step-ca",
        "version": "0.30.2.47",
    }
    client.supervisor = AsyncMock(
        side_effect=[{}, {"addons": [addon]}, {"addons": [addon]}, {"services": []}]
    )
    with pytest.raises(DeploymentError, match="MariaDB"):
        await client.deploy_step_ca("0.30.2.47")
    client.supervisor.assert_any_await("/services")
    assert not any(
        call.args[0] == "/services/mysql" for call in client.supervisor.call_args_list
    )

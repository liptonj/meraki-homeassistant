"""Webhook management for the Meraki Home Assistant integration."""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant
from meraki_sdk.exceptions import APIError

from .core.api.client import MerakiAPIClient
from .helpers.logging_helper import MerakiLoggers


class WebhookManager:
    """Manages Meraki webhooks."""

    def __init__(
        self, hass: HomeAssistant, api_client: MerakiAPIClient, network_id: str
    ):
        """Initialize the webhook manager."""
        self.hass = hass
        self.api_client = api_client
        self.network_id = network_id
        self.http_server_id: str | None = None

    async def async_register_webhooks(
        self, webhook_url: str, shared_secret: str, alert_types: list[str]
    ) -> dict[str, Any]:
        """Register webhooks for a network."""
        status = {"success": False, "error": None, "manual_setup_required": False}
        server_name = "Home Assistant Meraki Integration"

        try:
            webhooks_api = self.api_client.dashboard.webhooks

            # Step 1: Find or Create HTTP Server
            existing_servers = await webhooks_api.getNetworkWebhooksHttpServers(
                self.network_id
            )
            server = next(
                (s for s in existing_servers if s["name"] == server_name), None
            )

            if server:
                self.http_server_id = server["id"]
                if (
                    server.get("url") != webhook_url
                    or server.get("sharedSecret") != shared_secret
                ):
                    await webhooks_api.updateNetworkWebhooksHttpServer(
                        networkId=self.network_id,
                        httpServerId=self.http_server_id,
                        url=webhook_url,
                        sharedSecret=shared_secret,
                    )
                    MerakiLoggers.ALERTS.info(
                        "Updated existing webhook HTTP server for network %s",
                        self.network_id,
                    )
            else:
                new_server = await webhooks_api.createNetworkWebhooksHttpServer(
                    networkId=self.network_id,
                    url=webhook_url,
                    sharedSecret=shared_secret,
                    name=server_name,
                )
                self.http_server_id = new_server["id"]
                MerakiLoggers.ALERTS.info(
                    "Created new webhook HTTP server for network %s", self.network_id
                )

            # Step 2: Subscribe to Alert Types
            if self.http_server_id:
                current_settings = (
                    await self.api_client.dashboard.alerts.getNetworkAlertsSettings(
                        self.network_id
                    )
                )
                alerts_to_update = [
                    {
                        "type": alert_type,
                        "enabled": True,
                        "alertDestinations": {"httpServerIds": [self.http_server_id]},
                        "filters": {},
                    }
                    for alert_type in alert_types
                ]
                new_alerts_dict = {alert["type"]: alert for alert in alerts_to_update}
                existing_alerts = current_settings.get("alerts", [])
                final_alerts = []
                for existing_alert in existing_alerts:
                    if existing_alert["type"] in new_alerts_dict:
                        final_alerts.append(new_alerts_dict.pop(existing_alert["type"]))
                    else:
                        final_alerts.append(existing_alert)
                final_alerts.extend(new_alerts_dict.values())

                await self.api_client.dashboard.alerts.updateNetworkAlertsSettings(
                    networkId=self.network_id,
                    defaultDestinations=current_settings["defaultDestinations"],
                    alerts=final_alerts,
                )
                MerakiLoggers.ALERTS.info(
                    "Updated alert subscriptions for network %s", self.network_id
                )
            status["success"] = True
        except APIError as e:
            MerakiLoggers.ALERTS.error(
                "API error registering webhook for network %s: %s", self.network_id, e
            )
            if e.response.status == 403:
                status["error"] = "Read-only API key. Manual setup required."
                status["manual_setup_required"] = True
            else:
                status["error"] = f"An API error occurred: {e}"
        except Exception as e:
            MerakiLoggers.ALERTS.error(
                "Unexpected error registering webhook for network %s: %s",
                self.network_id,
                e,
            )
            status["error"] = f"An unexpected error occurred: {e}"
        return status

    async def async_unregister_webhooks(self) -> None:
        """Unregister webhooks for a network."""
        server_name = "Home Assistant Meraki Integration"
        try:
            existing_servers = (
                await self.api_client.dashboard.webhooks.getNetworkWebhooksHttpServers(
                    self.network_id
                )
            )
            server = next(
                (s for s in existing_servers if s["name"] == server_name), None
            )
            if server and server.get("id"):
                await (
                    self.api_client.dashboard.webhooks.deleteNetworkWebhooksHttpServer(
                        networkId=self.network_id,
                        httpServerId=server["id"],
                    )
                )
                MerakiLoggers.ALERTS.info(
                    "Successfully unregistered webhooks for network %s", self.network_id
                )
        except APIError as e:
            MerakiLoggers.ALERTS.warning(
                "Could not unregister webhook for network %s: %s", self.network_id, e
            )
        except Exception as e:
            MerakiLoggers.ALERTS.error(
                "Unexpected error unregistering webhook for network %s: %s",
                self.network_id,
                e,
            )

    async def async_check_webhook_status(self) -> dict[str, Any]:
        """Check the status of webhooks for a network."""
        # TODO: Implement webhook status check logic
        pass

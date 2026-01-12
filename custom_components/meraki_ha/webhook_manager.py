"""Manages Meraki webhook registration and unregistration."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..const import CONF_WEBHOOK_SHARED_SECRET
from ..core.errors import MerakiApiClientError
from ..helpers.logging_helper import MerakiLoggers
from .webhook import get_webhook_url

if TYPE_CHECKING:
    from homeassistant.config_entries import ConfigEntry
    from homeassistant.core import HomeAssistant

    from ..core.api import MerakiAPIClient


_LOGGER = MerakiLoggers.ALERTS


class WebhookManager:
    """Manages the lifecycle of Meraki webhooks."""

    def __init__(
        self,
        hass: HomeAssistant,
        api_client: MerakiAPIClient,
        config_entry: ConfigEntry,
    ) -> None:
        """Initialize the WebhookManager.

        Args:
        ----
            hass: The Home Assistant instance.
            api_client: The Meraki API client.
            config_entry: The config entry for the integration.

        """
        self.hass = hass
        self.api = api_client
        self.entry = config_entry
        self._http_server_id: str | None = None

    async def async_register_webhooks(self) -> bool:
        """Register webhooks with the Meraki Dashboard.

        This performs two main actions:
        1. Creates an HTTP server in the Meraki Dashboard to receive webhooks.
        2. Subscribes to the selected alert types and points them to the new server.

        Returns
        -------
            True if registration was successful, False otherwise.

        """
        webhook_url = self._get_ha_webhook_url()
        if not webhook_url:
            return False

        secret = self.entry.options.get(CONF_WEBHOOK_SHARED_SECRET)
        if not secret:
            _LOGGER.error("Cannot register webhook without a shared secret.")
            return False

        # TODO: Get enabled networks from config entry
        enabled_networks: list[str] = []

        for network_id in enabled_networks:
            try:
                # Step 1: Create HTTP Server
                server = (
                    await self.api.dashboard.networks.createNetworkWebhooksHttpServer(
                        networkId=network_id,
                        url=webhook_url,
                        sharedSecret=secret,
                        name="Home Assistant Meraki Integration",
                    )
                )
                self._http_server_id = server.get("id")
                if not self._http_server_id:
                    _LOGGER.error(
                        "Failed to create webhook HTTP server for network %s: "
                        "No ID returned",
                        network_id,
                    )
                    continue

                # Step 2: Subscribe to alerts
                # TODO: Get alert types from config entry
                alert_types_to_enable: list[str] = []
                alerts = [
                    {"type": alert_type, "enabled": True}
                    for alert_type in alert_types_to_enable
                ]

                await self.api.dashboard.networks.updateNetworkAlertsSettings(
                    networkId=network_id,
                    defaultDestinations={"httpServerIds": [self._http_server_id]},
                    alerts=alerts,
                )
                _LOGGER.info(
                    "Successfully registered webhooks for network %s", network_id
                )

            except MerakiApiClientError as e:
                if e.status == 403:
                    _LOGGER.warning(
                        "Read-only API key: Could not auto-register webhooks for "
                        "network %s. Please configure manually.",
                        network_id,
                    )
                else:
                    _LOGGER.error(
                        "Failed to register webhooks for network %s: %s", network_id, e
                    )
                return False
            except Exception as e:
                _LOGGER.error(
                    "An unexpected error occurred during webhook registration "
                    "for network %s: %s",
                    network_id,
                    e,
                )
                return False

        return True

    async def async_unregister_webhooks(self) -> None:
        """Unregister and clean up webhooks from the Meraki Dashboard."""
        if not self._http_server_id:
            _LOGGER.debug("No HTTP server ID found, skipping webhook unregistration.")
            return

        # TODO: Get enabled networks from config entry
        enabled_networks: list[str] = []
        for network_id in enabled_networks:
            try:
                await self.api.dashboard.networks.deleteNetworkWebhooksHttpServer(
                    networkId=network_id,
                    httpServerId=self._http_server_id,
                )
                _LOGGER.info(
                    "Successfully unregistered webhooks for network %s", network_id
                )
            except MerakiApiClientError as e:
                _LOGGER.error(
                    "Failed to unregister webhooks for network %s: %s", network_id, e
                )
            except Exception as e:
                _LOGGER.error(
                    "An unexpected error occurred during webhook unregistration "
                    "for network %s: %s",
                    network_id,
                    e,
                )
        self._http_server_id = None

    def _get_ha_webhook_url(self) -> str | None:
        """Get the webhook URL for Home Assistant."""
        try:
            return get_webhook_url(self.hass, self.entry.entry_id)
        except Exception as e:
            _LOGGER.error("Could not determine Home Assistant webhook URL: %s", e)
            return None

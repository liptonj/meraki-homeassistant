"""Manages Meraki Dashboard webhook configuration."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..const import (
    CONF_WEBHOOK_AUTO_REGISTER,
    CONF_WEBHOOK_EXTERNAL_URL,
    CONF_WEBHOOK_SHARED_SECRET,
    DEFAULT_WEBHOOK_AUTO_REGISTER,
    DEFAULT_WEBHOOK_EXTERNAL_URL,
)
from ..helpers.logging_helper import MerakiLoggers
from .errors import MerakiApiClientError, MerakiConnectionError
from .utils.webhook_utils import get_webhook_url

if TYPE_CHECKING:
    from homeassistant.config_entries import ConfigEntry
    from homeassistant.core import HomeAssistant

    from .api import MerakiAPIClient

_LOGGER = MerakiLoggers.ALERTS


class WebhookManager:
    """Class to manage webhook registration and unregistration."""

    def __init__(
        self,
        hass: HomeAssistant,
        api_client: MerakiAPIClient,
        config_entry: ConfigEntry,
    ) -> None:
        """Initialize the webhook manager."""
        self.hass = hass
        self.api = api_client
        self.config_entry = config_entry
        self._http_server_ids: dict[str, str] = {}

    async def async_register_webhooks(self) -> bool:
        """
        Register webhooks with the Meraki Dashboard.

        Returns
        -------
            True if registration was successful or not needed, False otherwise.
        """
        if not self.config_entry.options.get(
            CONF_WEBHOOK_AUTO_REGISTER, DEFAULT_WEBHOOK_AUTO_REGISTER
        ):
            _LOGGER.info("Webhook auto-registration is disabled, skipping.")
            return True

        webhook_url = self._get_webhook_url()
        if not webhook_url:
            return False

        shared_secret = self.config_entry.options.get(CONF_WEBHOOK_SHARED_SECRET)
        if not shared_secret:
            _LOGGER.error("Webhook shared secret is not configured.")
            return False

        network_ids = self.api.get_enabled_network_ids()
        if not network_ids:
            _LOGGER.warning("No enabled networks found for webhook registration.")
            return True

        success = True
        for network_id in network_ids:
            try:
                server_id = await self._async_register_http_server(
                    network_id, webhook_url, shared_secret
                )
                if server_id:
                    self._http_server_ids[network_id] = server_id
                    await self._async_subscribe_to_alerts(network_id, server_id)
            except MerakiApiClientError as err:
                _LOGGER.error(
                    "Failed to register webhook for network %s: %s", network_id, err
                )
                success = False
        return success

    async def _async_register_http_server(
        self, network_id: str, url: str, secret: str
    ) -> str | None:
        """
        Register an HTTP server for webhooks in a network.

        Args:
        ----
            network_id: The ID of the network.
            url: The webhook URL.
            secret: The shared secret.

        Returns
        -------
            The ID of the created or existing HTTP server, or None on failure.
        """
        try:
            # Check if a server with the same URL already exists
            servers = await self.api.get_network_webhooks_http_servers(network_id)
            for server in servers:
                if server.get("url") == url:
                    _LOGGER.info(
                        "HTTP server for URL %s already exists in network %s (ID: %s)",
                        url,
                        network_id,
                        server["id"],
                    )
                    return server["id"]

            # If not, create a new one
            _LOGGER.info("Creating new HTTP server for webhooks in network %s", network_id)
            response = await self.api.create_network_webhooks_http_server(
                network_id=network_id,
                url=url,
                shared_secret=secret,
                name="Home Assistant Meraki Integration",
            )
            return response.get("id")
        except MerakiApiClientError as err:
            _LOGGER.error("Failed to register HTTP server in network %s: %s", network_id, err)
            return None

    async def _async_subscribe_to_alerts(
        self, network_id: str, server_id: str
    ) -> None:
        """
        Subscribe to webhook alerts for a network.

        Args:
        ----
            network_id: The ID of the network.
            server_id: The ID of the HTTP server.
        """
        selected_alerts = self.config_entry.options.get(CONF_WEBHOOK_ALERT_TYPES, [])
        if not selected_alerts:
            _LOGGER.info("No webhook alert types selected, skipping subscription.")
            return

        alert_payload = [{"type": alert_type, "enabled": True} for alert_type in selected_alerts]

        alert_settings = {
            "defaultDestinations": {"httpServerIds": [server_id]},
            "alerts": alert_payload,
        }
        try:
            await self.api.update_network_alerts_settings(
                network_id, default_destinations=alert_settings["defaultDestinations"], alerts=alert_settings["alerts"]
            )
            _LOGGER.info(
                "Successfully subscribed to %d alerts for network %s",
                len(selected_alerts),
                network_id,
            )
        except MerakiApiClientError as err:
            _LOGGER.error(
                "Failed to subscribe to alerts in network %s: %s", network_id, err
            )

    async def async_unregister_webhooks(self) -> None:
        """Unregister webhooks from the Meraki Dashboard."""
        if not self._http_server_ids:
            _LOGGER.info("No HTTP server IDs found, cannot unregister webhooks.")
            return

        for network_id, server_id in self._http_server_ids.items():
            try:
                await self.api.delete_network_webhooks_http_server(
                    network_id, server_id
                )
                _LOGGER.info(
                    "Successfully unregistered HTTP server %s from network %s",
                    server_id,
                    network_id,
                )
            except MerakiApiClientError as err:
                _LOGGER.error(
                    "Failed to unregister HTTP server %s from network %s: %s",
                    server_id,
                    network_id,
                    err,
                )

    def _get_webhook_url(self) -> str | None:
        """
        Get the full webhook URL.

        Returns
        -------
            The webhook URL, or None if it cannot be determined.
        """
        try:
            custom_url = self.config_entry.options.get(CONF_WEBHOOK_EXTERNAL_URL)
            return get_webhook_url(
                self.hass,
                self.config_entry.entry_id,
                custom_url or None,
            )
        except MerakiConnectionError as err:
            _LOGGER.error("Cannot determine webhook URL: %s", err)
            return None

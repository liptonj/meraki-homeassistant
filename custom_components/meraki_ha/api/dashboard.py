"""WebSocket API for Meraki dashboard configuration."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback

from ..const import DOMAIN
from ..helpers.logging_helper import MerakiLoggers

_LOGGER = MerakiLoggers.API


@callback
def async_setup(hass: HomeAssistant) -> None:
    """Set up the Meraki dashboard WebSocket API."""
    websocket_api.async_register_command(hass, ws_get_dashboard_config)
    websocket_api.async_register_command(hass, ws_regenerate_dashboard)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "meraki_ha/get_dashboard_config",
        vol.Optional("config_entry_id"): str,
    }
)
@websocket_api.async_response
async def ws_get_dashboard_config(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Handle get dashboard config command.

    This generates the Meraki dashboard configuration dynamically
    using the MerakiDashboardStrategy class.
    """
    config_entry_id = msg.get("config_entry_id")

    # If no config_entry_id provided, use the first available entry
    if not config_entry_id:
        if DOMAIN not in hass.data or not hass.data[DOMAIN]:
            connection.send_error(
                msg["id"],
                "not_found",
                "No Meraki config entries found",
            )
            return
        # Get the first config entry
        config_entry_id = next(iter(hass.data[DOMAIN].keys()))

    # Check if the config entry exists
    if DOMAIN not in hass.data or config_entry_id not in hass.data[DOMAIN]:
        connection.send_error(
            msg["id"],
            "not_found",
            f"Config entry '{config_entry_id}' not found",
        )
        return

    _LOGGER.debug("Getting dashboard config for entry: %s", config_entry_id)

    # Check if we have a cached dashboard config
    entry_data = hass.data[DOMAIN][config_entry_id]
    if "dashboard_config" not in entry_data:
        _LOGGER.warning("Dashboard config not available for entry: %s", config_entry_id)
        connection.send_error(
            msg["id"],
            "not_available",
            "Dashboard configuration has not been generated yet. "
            "Use meraki_ha/regenerate_dashboard to create it.",
        )
        return

    dashboard_config = entry_data["dashboard_config"]
    _LOGGER.debug("Returning cached dashboard config")
    connection.send_result(msg["id"], {"config": dashboard_config})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "meraki_ha/regenerate_dashboard",
        vol.Required("config_entry_id"): str,
    }
)
@websocket_api.async_response
async def ws_regenerate_dashboard(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Handle regenerate dashboard command.

    This regenerates the Meraki dashboard configuration dynamically
    using the MerakiDashboardStrategy class.
    """
    config_entry_id = msg["config_entry_id"]

    # Check if the config entry exists
    if DOMAIN not in hass.data or config_entry_id not in hass.data[DOMAIN]:
        connection.send_error(
            msg["id"],
            "not_found",
            f"Config entry '{config_entry_id}' not found",
        )
        return

    _LOGGER.debug("Regenerating dashboard config for entry: %s", config_entry_id)

    try:
        # pylint: disable-next=import-outside-toplevel
        from ..dashboard import MerakiDashboardStrategy

        strategy = MerakiDashboardStrategy()
        dashboard_config = await strategy.async_generate(hass, config_entry_id)

        if dashboard_config:
            # Store the regenerated config
            hass.data[DOMAIN][config_entry_id]["dashboard_config"] = dashboard_config

            _LOGGER.debug(
                "Regenerated dashboard with %d views",
                len(dashboard_config.get("views", [])),
            )

            connection.send_result(
                msg["id"], {"success": True, "config": dashboard_config}
            )
        else:
            _LOGGER.error("Dashboard strategy returned None during regeneration!")
            connection.send_error(
                msg["id"],
                "generation_failed",
                "Failed to generate dashboard configuration",
            )
    except Exception as err:
        _LOGGER.error("Error regenerating dashboard config: %s", err, exc_info=True)
        connection.send_error(
            msg["id"], websocket_api.const.ERR_UNKNOWN_ERROR, str(err)
        )

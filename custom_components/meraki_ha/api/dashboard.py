"""Dashboard WebSocket API for the Meraki Home Assistant integration."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback

from ..const import DOMAIN
from ..helpers.logging_helper import MerakiLoggers

if TYPE_CHECKING:
    from homeassistant.components.websocket_api import ActiveConnection

_LOGGER = MerakiLoggers.FRONTEND


def async_setup(hass: HomeAssistant) -> None:
    """Set up the Dashboard WebSocket API."""
    websocket_api.async_register_command(hass, ws_get_dashboard_config)
    websocket_api.async_register_command(hass, ws_regenerate_dashboard)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "meraki_ha/get_dashboard_config",
        vol.Optional("config_entry_id"): str,
    }
)
@callback
def ws_get_dashboard_config(
    hass: HomeAssistant,
    connection: ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Get the generated dashboard configuration.

    This returns the Lovelace dashboard configuration that was auto-generated
    based on the user's Meraki network configuration. Users can import this
    configuration into their Lovelace dashboards.
    """
    config_entry_id = msg.get("config_entry_id")

    if DOMAIN not in hass.data:
        connection.send_error(msg["id"], "not_found", "Meraki integration not loaded")
        return

    # If no config_entry_id specified, use the first one
    if config_entry_id is None:
        entries = list(hass.data[DOMAIN].keys())
        if not entries:
            connection.send_error(
                msg["id"], "not_found", "No Meraki config entries found"
            )
            return
        config_entry_id = entries[0]

    entry_data = hass.data[DOMAIN].get(config_entry_id)
    if not entry_data:
        connection.send_error(
            msg["id"], "not_found", f"Config entry {config_entry_id} not found"
        )
        return

    dashboard_config = entry_data.get("dashboard_config")
    if not dashboard_config:
        connection.send_error(
            msg["id"],
            "not_available",
            "Dashboard configuration not generated. "
            "Ensure UI mode is set to 'Native Lovelace Dashboard'.",
        )
        return

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
    connection: ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Regenerate the dashboard configuration.

    This allows users to regenerate the dashboard configuration after
    making changes to their Meraki network (adding/removing devices, etc.).
    """
    config_entry_id = msg["config_entry_id"]

    if DOMAIN not in hass.data:
        connection.send_error(msg["id"], "not_found", "Meraki integration not loaded")
        return

    entry_data = hass.data[DOMAIN].get(config_entry_id)
    if not entry_data:
        connection.send_error(
            msg["id"], "not_found", f"Config entry {config_entry_id} not found"
        )
        return

    # Import here to avoid circular imports
    # pylint: disable=import-outside-toplevel
    from ..dashboard import MerakiDashboardStrategy

    try:
        strategy = MerakiDashboardStrategy()
        dashboard_config = await strategy.async_generate(hass, config_entry_id)

        if dashboard_config:
            entry_data["dashboard_config"] = dashboard_config
            _LOGGER.info(
                "Regenerated Meraki Lovelace dashboard with %d views",
                len(dashboard_config.get("views", [])),
            )
            connection.send_result(
                msg["id"],
                {
                    "success": True,
                    "config": dashboard_config,
                },
            )
        else:
            connection.send_error(
                msg["id"],
                "generation_failed",
                "Failed to generate dashboard - no coordinator data available",
            )
    except (KeyError, TypeError, ValueError) as err:
        _LOGGER.exception("Error regenerating dashboard: %s", err)
        connection.send_error(
            msg["id"],
            "error",
            f"Error regenerating dashboard: {err}",
        )

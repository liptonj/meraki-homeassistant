"""Card diagnostic service for Meraki custom cards troubleshooting.

This service provides diagnostic information for debugging
Meraki Lovelace card connectivity and configuration issues.
"""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback

from ..const import DOMAIN
from ..helpers.logging_helper import MerakiLoggers

_LOGGER = MerakiLoggers.FRONTEND


@callback
def async_register_card_diagnostics(hass: HomeAssistant) -> None:
    """Register WebSocket commands for card diagnostics."""
    websocket_api.async_register_command(hass, websocket_card_diagnostics)
    _LOGGER.info("Registered meraki/card_diagnostics WebSocket command")


@websocket_api.websocket_command(
    {
        "type": "meraki/card_diagnostics",
        vol.Optional("config_entry_id"): str,
    }
)
@callback
def websocket_card_diagnostics(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Handle card diagnostics WebSocket request.

    This provides diagnostic information for debugging card issues,
    including coordinator status, available data, and configuration.
    """
    config_entry_id = msg.get("config_entry_id")

    # Get all Meraki config entries
    all_entries = hass.config_entries.async_entries(DOMAIN)
    available_entries = [
        {"entry_id": entry.entry_id, "title": entry.title, "state": entry.state.name}
        for entry in all_entries
    ]

    # If no config_entry_id provided, return list of available entries
    if not config_entry_id:
        connection.send_result(
            msg["id"],
            {
                "status": "info",
                "message": "No config_entry_id provided. Available entries listed.",
                "available_entries": available_entries,
            },
        )
        return

    # Check if the config entry exists
    if config_entry_id not in hass.data.get(DOMAIN, {}):
        connection.send_result(
            msg["id"],
            {
                "status": "error",
                "message": f"Config entry '{config_entry_id}' not found",
                "available_entries": available_entries,
            },
        )
        return

    # Get the coordinator for this config entry
    entry_data = hass.data[DOMAIN][config_entry_id]
    coordinator = entry_data.get("coordinator")

    if not coordinator:
        connection.send_result(
            msg["id"],
            {
                "status": "error",
                "message": "Coordinator not found for this config entry",
                "config_entry_id": config_entry_id,
            },
        )
        return

    # Build diagnostic response
    coordinator_data = coordinator.data or {}

    # Count entities by type
    devices = coordinator_data.get("devices", [])
    clients = coordinator_data.get("clients", [])
    ssids = coordinator_data.get("ssids", [])
    networks = coordinator_data.get("networks", [])

    # Device status breakdown
    device_status = {
        "online": len([d for d in devices if d.get("status") == "online"]),
        "alerting": len([d for d in devices if d.get("status") == "alerting"]),
        "offline": len([d for d in devices if d.get("status") == "offline"]),
        "total": len(devices),
    }

    # Build response
    diagnostics = {
        "status": "ok",
        "config_entry_id": config_entry_id,
        "coordinator": {
            "ready": coordinator.last_update_success,
            "last_update_success": coordinator.last_update_success,
            "update_interval_seconds": (
                coordinator.update_interval.total_seconds()
                if coordinator.update_interval
                else None
            ),
        },
        "data_summary": {
            "devices": len(devices),
            "device_status": device_status,
            "clients": len(clients),
            "ssids": len(ssids),
            "networks": len(networks),
            "data_keys": list(coordinator_data.keys()),
        },
        "services": {
            "mqtt_enabled": entry_data.get("mqtt_service") is not None,
            "camera_service": entry_data.get("camera_service") is not None,
            "device_control_service": (
                entry_data.get("device_control_service") is not None
            ),
        },
    }

    # Add last update time if available
    if hasattr(coordinator, "last_update_success_time"):
        last_time = coordinator.last_update_success_time
        if last_time:
            diagnostics["coordinator"]["last_update_time"] = last_time.isoformat()

    _LOGGER.debug(
        "Card diagnostics requested for config_entry_id=%s, devices=%d, clients=%d",
        config_entry_id,
        len(devices),
        len(clients),
    )

    connection.send_result(msg["id"], diagnostics)

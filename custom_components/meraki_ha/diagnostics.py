"""Diagnostics support for Meraki."""

from __future__ import annotations

from typing import Any

from homeassistant.components.diagnostics import async_redact_data
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import CONF_ENABLE_MQTT, CONF_ENABLE_PUSH_API, DOMAIN
from .meraki_data_coordinator import MerakiDataCoordinator

TO_REDACT = {
    "access_token",
    "refresh_token",
    "meraki_api_key",
    "client_secret",
    "client_id",
}


async def async_get_config_entry_diagnostics(
    hass: HomeAssistant,
    entry: ConfigEntry,
) -> dict[str, Any]:
    """
    Return diagnostics for a config entry.

    Args:
    ----
        hass: The Home Assistant instance.
        entry: The config entry.

    Returns
    -------
        A dictionary of diagnostics.

    """
    coordinator: MerakiDataCoordinator = hass.data[DOMAIN][entry.entry_id][
        "coordinator"
    ]

    diagnostics: dict[str, Any] = {
        "config_entry": async_redact_data(entry.as_dict(), TO_REDACT),
        "coordinator_data": coordinator.data,
    }

    mqtt_enabled = entry.options.get(CONF_ENABLE_MQTT, False)
    diagnostics["mqtt"] = {
        "enabled": mqtt_enabled,
    }

    if mqtt_enabled:
        mqtt_service = hass.data[DOMAIN][entry.entry_id].get("mqtt_service")
        if mqtt_service:
            diagnostics["mqtt"]["service_running"] = True

        relay_manager = hass.data[DOMAIN][entry.entry_id].get("mqtt_relay_manager")
        if relay_manager:
            diagnostics["mqtt"]["relay_destinations"] = (
                relay_manager.get_health_status()
            )
        else:
            diagnostics["mqtt"]["relay_destinations"] = {}

    push_enabled = entry.options.get(CONF_ENABLE_PUSH_API, False)
    diagnostics["push_api"] = {"enabled": push_enabled}
    push_manager = hass.data[DOMAIN][entry.entry_id].get("push_api_manager")
    if push_manager:
        diagnostics["push_api"]["status"] = push_manager.status

    return diagnostics

"""Dashboard strategy for the Meraki Home Assistant integration."""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr

from .const import DOMAIN


class MerakiDashboardStrategy:
    """Generate a dashboard for Meraki devices."""

    async def async_generate(
        self, hass: HomeAssistant, config_entry_id: str
    ) -> dict[str, Any] | None:
        """Generate a dashboard configuration."""
        coordinator = hass.data[DOMAIN][config_entry_id].get("coordinator")
        if not coordinator or not coordinator.data:
            return None

        devices = coordinator.data.get("devices", [])
        device_registry = dr.async_get(hass)

        # Create cards for each Meraki device
        device_cards = []
        for device in sorted(devices, key=lambda d: d.get("name", "")):
            ha_device = device_registry.async_get_device(
                identifiers={(DOMAIN, device["mac"])}
            )
            if ha_device:
                device_cards.append(
                    {
                        "type": "custom:meraki-device-card",
                        "device_id": ha_device.id,
                    }
                )

        return {
            "title": "Meraki Network",
            "views": [
                {
                    "title": "Overview",
                    "path": "overview",
                    "badges": [
                        {"type": "custom:meraki-status-badge"},
                        {"type": "custom:meraki-clients-badge"},
                        {"type": "custom:meraki-alerts-badge"},
                    ],
                    "cards": [
                        {"type": "custom:meraki-overview-card"},
                        {"type": "custom:meraki-clients-card", "limit": 10},
                        {"type": "custom:meraki-ssids-list-card"},
                    ],
                },
                {
                    "title": "Devices",
                    "path": "devices",
                    "cards": device_cards,
                },
                {
                    "title": "Events",
                    "path": "events",
                    "cards": [{"type": "custom:meraki-events-card"}],
                },
                {
                    "title": "Guest Access",
                    "path": "guest",
                    "cards": [{"type": "custom:meraki-guest-access-card"}],
                },
            ],
        }

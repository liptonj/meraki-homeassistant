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

        # Create a devices card that groups devices by type with collapsible tables
        # This replaces individual device cards with a unified table view
        devices_card = {
            "type": "custom:meraki-devices-by-type-card",
            "title": "Meraki Devices",
            "show_switches": True,
            "show_wireless": True,
            "show_cameras": True,
            "show_sensors": True,
            "show_appliances": True,
            "devices_per_page": 2,  # Low number to show pagination in screenshots
        }

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
                    "cards": [devices_card],
                },
                {
                    "title": "Clients",
                    "path": "clients",
                    "cards": [
                        {
                            "type": "custom:meraki-clients-card",
                            "title": "Network Clients",
                            "limit": 50,
                            "show_offline": False,
                        },
                        {
                            "type": "custom:meraki-client-card",
                            "title": "Featured Client: Living Room Sonos",
                            "client_mac": "5c:aa:fd:11:22:33",
                            "default_collapsed": False,
                        },
                    ],
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
                {
                    "title": "Settings",
                    "path": "settings",
                    "cards": [
                        {
                            "type": "custom:meraki-mqtt-status-card",
                            "title": "MQTT Integration",
                            "show_relay_destinations": True,
                            "show_message_stats": True,
                            "show_sensor_count": True,
                            "collapsible": True,
                            "default_collapsed": False,
                        }
                    ],
                },
            ],
        }

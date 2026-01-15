"""Dashboard strategy for the Meraki Home Assistant integration."""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant

from .const import DOMAIN


class MerakiDashboardStrategy:
    """Generate a dashboard for Meraki devices."""

    def _generate_device_detail_page(
        self, device: dict[str, Any], device_serial: str, config_entry_id: str
    ) -> dict[str, Any]:
        """Generate a detail page for a specific device."""
        device_name = device.get("name", "Unknown Device")
        device_model = device.get("model", "")
        product_type = device_model[:2] if device_model else ""

        # Base cards all devices have
        cards = [
            {
                "type": "custom:meraki-device-card",
                "config_entry_id": config_entry_id,
                "device_serial": device_serial,
                "show_details": True,
            }
        ]

        # Add type-specific cards
        if product_type == "MS":  # Switch
            cards.append(
                {
                    "type": "custom:meraki-switch-ports-card",
                    "config_entry_id": config_entry_id,
                    "device_serial": device_serial,
                    "title": "Switch Ports",
                }
            )
        elif product_type == "MV":  # Camera
            cards.append(
                {
                    "type": "custom:meraki-camera-card",
                    "config_entry_id": config_entry_id,
                    "device_serial": device_serial,
                    "title": "Camera Feed",
                    "show_snapshot": True,
                    "show_controls": True,
                }
            )
        elif product_type == "MT":  # Sensor
            cards.append(
                {
                    "type": "custom:meraki-sensor-readings-card",
                    "config_entry_id": config_entry_id,
                    "device_serial": device_serial,
                    "title": "Sensor Readings",
                }
            )

        # Add connected clients card for network devices
        if product_type in ["MS", "MR", "MX"]:
            cards.append(
                {
                    "type": "custom:meraki-clients-card",
                    "config_entry_id": config_entry_id,
                    "device_serial": device_serial,
                    "title": "Connected Clients",
                    "limit": 20,
                }
            )

        # Add recent events card
        cards.append(
            {
                "type": "custom:meraki-events-card",
                "config_entry_id": config_entry_id,
                "device_serial": device_serial,
                "title": "Recent Events",
                "limit": 10,
                "events_per_page": 5,
            }
        )

        return {
            "title": device_name,
            "path": f"device_{device_serial.lower()}",
            "icon": self._get_device_icon(product_type),
            "badges": [
                {
                    "type": "custom:meraki-device-status-badge",
                    "config_entry_id": config_entry_id,
                    "device_serial": device_serial,
                },
                {
                    "type": "custom:meraki-device-uptime-badge",
                    "config_entry_id": config_entry_id,
                    "device_serial": device_serial,
                },
            ],
            "cards": cards,
        }

    def _generate_client_detail_page(
        self, client: dict[str, Any], client_mac: str, config_entry_id: str
    ) -> dict[str, Any]:
        """Generate a detail page for a specific client."""
        client_name = client.get("description") or client.get(
            "hostname", "Unknown Client"
        )

        cards = [
            {
                "type": "custom:meraki-client-card",
                "config_entry_id": config_entry_id,
                "client_mac": client_mac,
                "show_details": True,
            }
        ]

        # If client has HA device ID, show HA entities
        if client.get("ha_device_id"):
            cards.append(
                {
                    "type": "custom:meraki-ha-entities-card",
                    "config_entry_id": config_entry_id,
                    "ha_device_id": client["ha_device_id"],
                    "title": "Home Assistant Entities",
                }
            )

        # Add client history
        cards.append(
            {
                "type": "custom:meraki-client-history-card",
                "config_entry_id": config_entry_id,
                "client_mac": client_mac,
                "title": "Connection History",
                "limit": 10,
            }
        )

        # Add usage statistics
        cards.append(
            {
                "type": "custom:meraki-client-usage-card",
                "client_mac": client_mac,
                "title": "Usage Statistics",
            }
        )

        return {
            "title": client_name,
            "path": f"client_{client_mac.replace(':', '').lower()}",
            "icon": "mdi:devices",
            "badges": [
                {
                    "type": "custom:meraki-client-status-badge",
                    "client_mac": client_mac,
                }
            ],
            "cards": cards,
        }

    def _get_device_icon(self, product_type: str) -> str:
        """Get the appropriate icon for a device type."""
        icon_map = {
            "MS": "mdi:switch",
            "MR": "mdi:access-point",
            "MV": "mdi:cctv",
            "MT": "mdi:thermometer",
            "MX": "mdi:router",
            "MG": "mdi:cellphone-wireless",
        }
        return icon_map.get(product_type, "mdi:devices")

    async def async_generate(
        self, hass: HomeAssistant, config_entry_id: str
    ) -> dict[str, Any] | None:
        """Generate a dashboard configuration."""
        coordinator = hass.data[DOMAIN][config_entry_id].get("coordinator")
        if not coordinator or not coordinator.data:
            return None

        devices = coordinator.data.get("devices", [])
        clients = coordinator.data.get("clients", [])

        # Base views
        views = [
            {
                "title": "Overview",
                "path": "overview",
                "badges": [
                    {
                        "type": "custom:meraki-status-badge",
                        "config_entry_id": config_entry_id,
                    },
                    {
                        "type": "custom:meraki-clients-badge",
                        "config_entry_id": config_entry_id,
                    },
                    {
                        "type": "custom:meraki-alerts-badge",
                        "config_entry_id": config_entry_id,
                    },
                ],
                "cards": [
                    {
                        "type": "custom:meraki-overview-card",
                        "config_entry_id": config_entry_id,
                    },
                    {
                        "type": "custom:meraki-clients-card",
                        "config_entry_id": config_entry_id,
                        "limit": 10,
                    },
                    {
                        "type": "custom:meraki-ssids-list-card",
                        "config_entry_id": config_entry_id,
                    },
                ],
            },
            {
                "title": "Devices",
                "path": "devices",
                "cards": [
                    {
                        "type": "custom:meraki-devices-by-type-card",
                        "config_entry_id": config_entry_id,
                        "title": "Meraki Devices",
                        "show_switches": True,
                        "show_wireless": True,
                        "show_cameras": True,
                        "show_sensors": True,
                        "show_appliances": True,
                        "devices_per_page": 10,
                    }
                ],
            },
            {
                "title": "Clients",
                "path": "clients",
                "cards": [
                    {
                        "type": "custom:meraki-clients-card",
                        "config_entry_id": config_entry_id,
                        "title": "Network Clients",
                        "limit": 50,
                        "show_offline": False,
                    },
                ],
            },
            {
                "title": "Events",
                "path": "events",
                "cards": [
                    {
                        "type": "custom:meraki-events-card",
                        "config_entry_id": config_entry_id,
                        "events_per_page": 10,
                    }
                ],
            },
            {
                "title": "Guest Access",
                "path": "guest",
                "cards": [
                    {
                        "type": "custom:meraki-guest-access-card",
                        "config_entry_id": config_entry_id,
                    }
                ],
            },
            {
                "title": "Settings",
                "path": "settings",
                "cards": [
                    {
                        "type": "custom:meraki-mqtt-status-card",
                        "config_entry_id": config_entry_id,
                        "title": "MQTT Integration",
                        "show_relay_destinations": True,
                        "show_message_stats": True,
                        "show_sensor_count": True,
                        "collapsible": True,
                        "default_collapsed": False,
                    }
                ],
            },
        ]

        # Add example device detail pages (for screenshot generation and demos)
        # In production, these would be dynamically created via navigation
        if devices:
            # Find one device of each type for examples
            switch = next(
                (d for d in devices if d.get("model", "").startswith("MS")), None
            )
            camera = next(
                (d for d in devices if d.get("model", "").startswith("MV")), None
            )
            ap = next((d for d in devices if d.get("model", "").startswith("MR")), None)
            sensor = next(
                (d for d in devices if d.get("model", "").startswith("MT")), None
            )

            if switch:
                views.append(
                    self._generate_device_detail_page(
                        switch, switch.get("serial"), config_entry_id
                    )
                )
            if camera:
                views.append(
                    self._generate_device_detail_page(
                        camera, camera.get("serial"), config_entry_id
                    )
                )
            if ap:
                views.append(
                    self._generate_device_detail_page(
                        ap, ap.get("serial"), config_entry_id
                    )
                )
            if sensor:
                views.append(
                    self._generate_device_detail_page(
                        sensor, sensor.get("serial"), config_entry_id
                    )
                )

        # Add example client detail pages
        if clients:
            # Find a Sonos or other HA-integrated client
            ha_client = next((c for c in clients if c.get("ha_device_id")), None)
            if ha_client:
                views.append(
                    self._generate_client_detail_page(
                        ha_client, ha_client.get("mac"), config_entry_id
                    )
                )

            # Add one more example client
            if len(clients) > 1:
                other_client = next(
                    (c for c in clients if not c.get("ha_device_id")), None
                )
                if other_client:
                    views.append(
                        self._generate_client_detail_page(
                            other_client, other_client.get("mac"), config_entry_id
                        )
                    )

        return {
            "title": "Meraki Network",
            "views": views,
        }

"""Webhook handlers for device-related alerts."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..helpers.logging_helper import MerakiLoggers

if TYPE_CHECKING:
    from ..meraki_data_coordinator import MerakiDataCoordinator


_LOGGER = MerakiLoggers.ALERTS


async def async_handle_device_alert(
    coordinator: MerakiDataCoordinator,
    data: dict,
) -> None:
    """Handle a device-related webhook alert."""
    alert_type = data.get("alertType")
    _LOGGER.debug("Handling device alert of type: %s", alert_type)

    if alert_type in ("APs went down", "APs came up"):
        device_serial = data.get("deviceSerial")
        if not device_serial:
            return

        device = coordinator.devices_by_serial.get(device_serial)
        if device:
            new_status = "online" if data["alertType"] == "APs came up" else "offline"
            _LOGGER.info(
                "Device %s reported as %s via webhook", device_serial, new_status
            )
            device["status"] = new_status

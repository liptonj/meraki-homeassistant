"""Handles device-related webhook alerts from the Meraki Dashboard."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..helpers.logging_helper import MerakiLoggers

if TYPE_CHECKING:
    from ..meraki_data_coordinator import MerakiDataCoordinator

_LOGGER = MerakiLoggers.ALERTS


async def async_handle_device_alert(
    coordinator: MerakiDataCoordinator, alert_data: dict
) -> None:
    """
    Process a device-related webhook alert.

    Args:
    ----
        coordinator: The Meraki data coordinator.
        alert_data: The data from the webhook alert.
    """
    alert_type = alert_data.get("alertType")
    device_serial = alert_data.get("deviceSerial")

    if not device_serial:
        _LOGGER.warning("Received device alert with no serial: %s", alert_data)
        return

    device = coordinator.get_device(device_serial)
    if not device:
        _LOGGER.debug(
            "Received webhook for unknown device serial: %s", device_serial
        )
        return

    if alert_type in ("APs went down", "Switches went down", "Gateways went down"):
        _LOGGER.info("Device %s reported as down via webhook", device_serial)
        device["status"] = "offline"
    elif alert_type in ("APs came up", "Switches came up", "Gateways came up"):
        _LOGGER.info("Device %s reported as up via webhook", device_serial)
        device["status"] = "online"
    else:
        _LOGGER.debug("Ignoring unhandled device alert type: %s", alert_type)
        return

    # Notify listeners that the device data has changed
    coordinator.async_update_listeners()

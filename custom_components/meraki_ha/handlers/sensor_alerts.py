"""Handles environmental sensor webhook alerts from the Meraki Dashboard."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..helpers.logging_helper import MerakiLoggers

if TYPE_CHECKING:
    from ..meraki_data_coordinator import MerakiDataCoordinator

_LOGGER = MerakiLoggers.ALERTS


async def async_handle_sensor_alert(
    coordinator: MerakiDataCoordinator, alert_data: dict
) -> None:
    """
    Process an environmental sensor-related webhook alert.

    This will update the coordinator with the latest sensor readings
    from the webhook alert.

    Args:
    ----
        coordinator: The Meraki data coordinator.
        alert_data: The data from the webhook alert.
    """
    alert_type = alert_data.get("alertType")
    device_serial = alert_data.get("deviceSerial")
    alert_info = alert_data.get("alertData", {})

    if not device_serial:
        _LOGGER.warning("Received sensor alert with no serial: %s", alert_data)
        return

    device = coordinator.get_device(device_serial)
    if not device:
        _LOGGER.debug(
            "Received webhook for unknown device serial: %s", device_serial
        )
        return

    _LOGGER.info(
        "Received sensor alert for device %s: %s", device_serial, alert_type
    )

    # The alertData contains a list of "triggeredReadings" that we can
    # use to update the device's sensor values in the coordinator.
    triggered_readings = alert_info.get("triggeredReadings", [])
    if not triggered_readings:
        return

    # Update the device's readings with the data from the webhook
    # This assumes the format of triggeredReadings is similar to the
    # getNetworkSensorAlertsProfile endpoint.
    for reading in triggered_readings:
        metric = reading.get("metric")
        if not metric:
            continue

        # Update or add the reading to the device's raw readings
        updated = False
        for i, existing_reading in enumerate(device.get("readings_raw", [])):
            if existing_reading.get("metric") == metric:
                device["readings_raw"][i] = reading
                updated = True
                break
        if not updated:
            device.setdefault("readings_raw", []).append(reading)

    # Reprocess the readings for the frontend
    device["readings"] = coordinator._process_sensor_readings_for_frontend(
        device["readings_raw"]
    )

    coordinator.async_update_listeners()

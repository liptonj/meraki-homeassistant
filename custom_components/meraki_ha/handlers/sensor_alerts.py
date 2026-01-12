"""Handles sensor-related webhook alerts."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

from ..helpers.logging_helper import MerakiLoggers

if TYPE_CHECKING:
    from ..meraki_data_coordinator import MerakiDataCoordinator

_LOGGER = MerakiLoggers.ALERTS


async def async_handle_sensor_alert(
    coordinator: MerakiDataCoordinator,
    alert_type: str,
    data: dict[str, Any],
) -> None:
    """Handle MT sensor alerts.

    Args:
    ----
        coordinator: The Meraki data coordinator.
        alert_type: The type of alert.
        data: The alert data from the webhook.

    """
    _LOGGER.info("Sensor alert received: %s", alert_type)
    serial = data.get("deviceSerial")
    if not serial:
        _LOGGER.warning("Sensor alert missing 'deviceSerial': %s", data)
        return

    coordinator.hass.async_create_task(coordinator._targeted_device_refresh(serial))

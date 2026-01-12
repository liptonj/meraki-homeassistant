"""Handles network-related webhook alerts from the Meraki Dashboard."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..helpers.logging_helper import MerakiLoggers

if TYPE_CHECKING:
    from ..meraki_data_coordinator import MerakiDataCoordinator

_LOGGER = MerakiLoggers.ALERTS


async def async_handle_network_alert(
    coordinator: MerakiDataCoordinator, alert_data: dict
) -> None:
    """
    Process a network-related webhook alert.

    For now, this handler will log the event and trigger a targeted refresh
    of the coordinator data.

    Args:
    ----
        coordinator: The Meraki data coordinator.
        alert_data: The data from the webhook alert.
    """
    alert_type = alert_data.get("alertType")
    _LOGGER.info("Received network configuration alert: %s", alert_type)

    # In a more advanced implementation, we could parse the alertData
    # to perform a more targeted update. For now, we'll trigger a
    # full refresh to ensure the data is up-to-date.
    await coordinator.async_request_refresh()

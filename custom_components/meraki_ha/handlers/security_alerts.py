"""Handles security-related webhook alerts from the Meraki Dashboard."""

from __future__ in annotations

from typing import TYPE_CHECKING

from ..helpers.logging_helper import MerakiLoggers

if TYPE_CHECKING:
    from ..meraki_data_coordinator import MerakiDataCoordinator

_LOGGER = MerakiLoggers.ALERTS


async def async_handle_security_alert(
    coordinator: MerakiDataCoordinator, alert_data: dict
) -> None:
    """
    Process a security-related webhook alert.

    For now, this handler will log the event. In the future, it could
    create persistent notifications or trigger automations.

    Args:
    ----
        coordinator: The Meraki data coordinator.
        alert_data: The data from the webhook alert.
    """
    alert_type = alert_data.get("alertType")
    _LOGGER.warning("Received security alert: %s", alert_type)

    # In a future implementation, we could create a persistent notification
    # hass.components.persistent_notification.async_create(
    #     f"Meraki Security Alert: {alert_type}",
    #     title="Meraki Security Alert",
    #     notification_id=f"meraki_security_{alert_data.get('alertId')}",
    # )

    # For now, we don't need to update the coordinator state, just log it.
    pass

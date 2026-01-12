"""Handles client-related webhook alerts from the Meraki Dashboard."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..helpers.logging_helper import MerakiLoggers

if TYPE_CHECKING:
    from ..meraki_data_coordinator import MerakiDataCoordinator

_LOGGER = MerakiLoggers.ALERTS


async def async_handle_client_alert(
    coordinator: MerakiDataCoordinator, alert_data: dict
) -> None:
    """
    Process a client-related webhook alert.

    Args:
    ----
        coordinator: The Meraki data coordinator.
        alert_data: The data from the webhook alert.
    """
    alert_type = alert_data.get("alertType")
    alert_info = alert_data.get("alertData", {})
    client_mac = alert_info.get("mac")

    if not client_mac:
        _LOGGER.warning("Received client alert with no MAC address: %s", alert_data)
        return

    # Find the client in the coordinator data
    client = next(
        (c for c in coordinator.data.get("clients", []) if c.get("mac") == client_mac),
        None,
    )

    if not client:
        _LOGGER.debug(
            "Received webhook for unknown client MAC: %s", client_mac
        )
        # In a future implementation, we might want to add new clients
        # that are discovered via webhooks. For now, we only update existing ones.
        return

    if alert_type == "Client connectivity changed":
        new_status = "Online" if alert_info.get("connected") else "Offline"
        if client.get("status") != new_status:
            _LOGGER.info(
                "Client %s connectivity changed to %s via webhook",
                client_mac,
                new_status,
            )
            client["status"] = new_status
            coordinator.async_update_listeners()
    else:
        _LOGGER.debug("Ignoring unhandled client alert type: %s", alert_type)
        return

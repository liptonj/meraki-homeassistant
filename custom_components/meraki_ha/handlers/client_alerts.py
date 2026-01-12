"""Handles client-related webhook alerts."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

from ..helpers.logging_helper import MerakiLoggers

if TYPE_CHECKING:
    from ..meraki_data_coordinator import MerakiDataCoordinator

_LOGGER = MerakiLoggers.ALERTS


async def async_handle_client_alert(
    coordinator: MerakiDataCoordinator,
    alert_type: str,
    data: dict[str, Any],
) -> None:
    """Handle client connectivity alerts.

    Args:
    ----
        coordinator: The Meraki data coordinator.
        alert_type: The type of alert (e.g., "Client connectivity changed").
        data: The alert data from the webhook.

    """
    _LOGGER.debug("Handling client alert: %s", alert_type)
    alert_data = data.get("alertData", {})
    client_mac = alert_data.get("mac")
    if not client_mac:
        _LOGGER.warning("Client alert missing 'mac': %s", data)
        return

    is_connected = alert_data.get("connected")
    if is_connected is None:
        _LOGGER.warning("Client alert missing 'connected' status: %s", data)
        return

    status = "Online" if is_connected else "Offline"
    _LOGGER.info(
        "Client %s changed status to %s via webhook (%s)",
        client_mac,
        status,
        alert_type,
    )
    coordinator._update_client_status_immediate(client_mac, is_connected)
    coordinator.async_update_listeners()

    network_id = data.get("networkId")
    if network_id:
        coordinator.hass.async_create_task(
            coordinator._targeted_client_refresh(
                network_id=network_id,
                client_mac=client_mac,
                delay=5,
            )
        )

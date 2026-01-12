"""Webhook handlers for client-related alerts."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..helpers.logging_helper import MerakiLoggers

if TYPE_CHECKING:
    from ..meraki_data_coordinator import MerakiDataCoordinator


_LOGGER = MerakiLoggers.ALERTS


async def async_handle_client_alert(
    coordinator: MerakiDataCoordinator,
    data: dict,
) -> None:
    """Handle a client-related webhook alert."""
    alert_type = data.get("alertType")
    _LOGGER.debug("Handling client alert of type: %s", alert_type)

    if alert_type == "Client connectivity changed":
        alert_data = data.get("alertData", {})
        client_mac = alert_data.get("mac")
        if client_mac and coordinator.data and "clients" in coordinator.data:
            for i, client in enumerate(coordinator.data["clients"]):
                if client.get("mac") == client_mac:
                    _LOGGER.info(
                        "Client %s connectivity changed via webhook",
                        client_mac,
                    )
                    coordinator.data["clients"][i]["status"] = (
                        "Online" if alert_data.get("connected") else "Offline"
                    )
                    break

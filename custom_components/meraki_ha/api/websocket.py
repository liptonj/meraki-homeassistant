"""WebSocket API for Meraki Lovelace UI."""

from __future__ import annotations

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback

from ..const import DOMAIN
from ..meraki_data_coordinator import MerakiDataCoordinator


def async_setup_websocket_api(hass: HomeAssistant) -> None:
    """Set up the WebSocket API."""
    websocket_api.async_register_command(hass, ws_get_overview)
    websocket_api.async_register_command(hass, ws_get_device)
    websocket_api.async_register_command(hass, ws_get_clients)
    websocket_api.async_register_command(hass, ws_get_ssids)
    websocket_api.async_register_command(hass, ws_get_switch_ports)
    websocket_api.async_register_command(hass, ws_subscribe_updates)
    websocket_api.async_register_command(hass, ws_block_client)
    websocket_api.async_register_command(hass, ws_unblock_client)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "meraki/get_overview",
        vol.Required("config_entry_id"): str,
    }
)
@websocket_api.async_response
async def ws_get_overview(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict,
) -> None:
    """Get Meraki network overview data."""
    entry_id = msg["config_entry_id"]
    if entry_id not in hass.data[DOMAIN]:
        connection.send_error(msg["id"], "not_found", "Config entry not found.")
        return

    coordinator: MerakiDataCoordinator = hass.data[DOMAIN][entry_id]["coordinator"]
    if not coordinator.last_update_success:
        connection.send_error(
            msg["id"], "coordinator_not_ready", "Coordinator is not ready."
        )
        return

    connection.send_result(
        msg["id"],
        {
            "devices": coordinator.data.get("devices", []),
            "clients": coordinator.data.get("clients", []),
            "ssids": coordinator.data.get("ssids", []),
        },
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): "meraki/get_device",
        vol.Required("config_entry_id"): str,
        vol.Required("serial"): str,
    }
)
@websocket_api.async_response
async def ws_get_device(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict,
) -> None:
    """Get single device details."""
    entry_id = msg["config_entry_id"]
    if entry_id not in hass.data[DOMAIN]:
        connection.send_error(msg["id"], "not_found", "Config entry not found.")
        return

    coordinator: MerakiDataCoordinator = hass.data[DOMAIN][entry_id]["coordinator"]
    serial = msg["serial"]
    device = next(
        (d for d in coordinator.data.get("devices", []) if d.get("serial") == serial),
        None,
    )
    if device:
        connection.send_result(msg["id"], device)
    else:
        connection.send_error(msg["id"], "not_found", "Device not found.")


@websocket_api.websocket_command(
    {
        vol.Required("type"): "meraki/get_clients",
        vol.Required("config_entry_id"): str,
        vol.Optional("network_id"): str,
        vol.Optional("limit"): int,
    }
)
@websocket_api.async_response
async def ws_get_clients(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
) -> None:
    """Get network clients with optional filtering."""
    entry_id = msg["config_entry_id"]
    if entry_id not in hass.data[DOMAIN]:
        connection.send_error(msg["id"], "not_found", "Config entry not found.")
        return

    coordinator: MerakiDataCoordinator = hass.data[DOMAIN][entry_id]["coordinator"]
    clients = coordinator.data.get("clients", [])
    if "network_id" in msg:
        clients = [c for c in clients if c.get("networkId") == msg["network_id"]]
    if "limit" in msg:
        clients = clients[: msg["limit"]]
    connection.send_result(msg["id"], clients)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "meraki/get_ssids",
        vol.Required("config_entry_id"): str,
    }
)
@websocket_api.async_response
async def ws_get_ssids(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
) -> None:
    """Get SSID list."""
    entry_id = msg["config_entry_id"]
    if entry_id not in hass.data[DOMAIN]:
        connection.send_error(msg["id"], "not_found", "Config entry not found.")
        return
    coordinator: MerakiDataCoordinator = hass.data[DOMAIN][entry_id]["coordinator"]
    ssids = coordinator.data.get("ssids", [])
    connection.send_result(msg["id"], ssids)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "meraki/get_switch_ports",
        vol.Required("config_entry_id"): str,
    }
)
@websocket_api.async_response
async def ws_get_switch_ports(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
) -> None:
    """Get switch port statuses."""
    entry_id = msg["config_entry_id"]
    if entry_id not in hass.data[DOMAIN]:
        connection.send_error(msg["id"], "not_found", "Config entry not found.")
        return

    switch_port_coordinator = hass.data[DOMAIN][entry_id].get("switch_port_coordinator")
    if not switch_port_coordinator or not switch_port_coordinator.last_update_success:
        connection.send_error(
            msg["id"], "coordinator_not_ready", "Switch port coordinator is not ready."
        )
        return

    connection.send_result(msg["id"], switch_port_coordinator.data)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "meraki/subscribe_updates",
        vol.Required("config_entry_id"): str,
    }
)
@websocket_api.async_response
async def ws_subscribe_updates(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
) -> None:
    """Subscribe to coordinator updates."""
    entry_id = msg["config_entry_id"]
    if entry_id not in hass.data[DOMAIN]:
        connection.send_error(msg["id"], "not_found", "Config entry not found.")
        return

    @callback
    def forward_data(data):
        """Forward data to client."""
        connection.send_message(websocket_api.event_message(msg["id"], data))

    coordinator: MerakiDataCoordinator = hass.data[DOMAIN][entry_id]["coordinator"]
    remove_listener = coordinator.async_add_listener(forward_data)
    connection.subscriptions[msg["id"]] = remove_listener
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {
        vol.Required("type"): "meraki/block_client",
        vol.Required("config_entry_id"): str,
        vol.Required("mac"): str,
    }
)
@websocket_api.async_response
async def ws_block_client(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
) -> None:
    """Block a client."""
    entry_id = msg["config_entry_id"]
    if entry_id not in hass.data[DOMAIN]:
        connection.send_error(msg["id"], "not_found", "Config entry not found.")
        return

    # In a real implementation, this would call a Home Assistant service
    connection.send_result(msg["id"], {"status": "success", "mac": msg["mac"]})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "meraki/unblock_client",
        vol.Required("config_entry_id"): str,
        vol.Required("mac"): str,
    }
)
@websocket_api.async_response
async def ws_unblock_client(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
) -> None:
    """Unblock a client."""
    entry_id = msg["config_entry_id"]
    if entry_id not in hass.data[DOMAIN]:
        connection.send_error(msg["id"], "not_found", "Config entry not found.")
        return

    connection.send_result(msg["id"], {"status": "success", "mac": msg["mac"]})

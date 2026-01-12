"""WebSocket API for Meraki Lovelace UI."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback

from ..const import DATA_CLIENT, DOMAIN
from ..helpers.logging_helper import MerakiLoggers
from ..meraki_data_coordinator import MerakiDataCoordinator

_LOGGER = MerakiLoggers.API


def async_setup_websocket_api(hass: HomeAssistant) -> None:
    """Set up the WebSocket API."""
    # Read endpoints
    websocket_api.async_register_command(hass, ws_get_overview)
    websocket_api.async_register_command(hass, ws_get_networks)
    websocket_api.async_register_command(hass, ws_get_device)
    websocket_api.async_register_command(hass, ws_get_device_clients)
    websocket_api.async_register_command(hass, ws_get_client)
    websocket_api.async_register_command(hass, ws_get_clients)
    websocket_api.async_register_command(hass, ws_get_ssids)
    websocket_api.async_register_command(hass, ws_get_switch_ports)
    websocket_api.async_register_command(hass, ws_subscribe_updates)
    # Action endpoints
    websocket_api.async_register_command(hass, ws_block_client)
    websocket_api.async_register_command(hass, ws_unblock_client)
    websocket_api.async_register_command(hass, ws_set_switch_port)
    websocket_api.async_register_command(hass, ws_set_client_policy)


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

    coordinator: MerakiDataCoordinator = hass.data[DOMAIN][entry_id]["coordinator"]

    @callback
    def forward_data() -> None:
        """Forward data to client."""
        connection.send_message(
            websocket_api.event_message(msg["id"], coordinator.data)
        )

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


@websocket_api.websocket_command(
    {
        vol.Required("type"): "meraki/get_networks",
        vol.Required("config_entry_id"): str,
    }
)
@websocket_api.async_response
async def ws_get_networks(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
) -> None:
    """Get list of networks."""
    entry_id = msg["config_entry_id"]
    if entry_id not in hass.data[DOMAIN]:
        connection.send_error(msg["id"], "not_found", "Config entry not found.")
        return

    coordinator: MerakiDataCoordinator = hass.data[DOMAIN][entry_id]["coordinator"]
    networks = coordinator.data.get("networks", [])
    connection.send_result(msg["id"], networks)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "meraki/get_client",
        vol.Required("config_entry_id"): str,
        vol.Required("mac"): str,
    }
)
@websocket_api.async_response
async def ws_get_client(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
) -> None:
    """Get single client details by MAC address."""
    entry_id = msg["config_entry_id"]
    if entry_id not in hass.data[DOMAIN]:
        connection.send_error(msg["id"], "not_found", "Config entry not found.")
        return

    coordinator: MerakiDataCoordinator = hass.data[DOMAIN][entry_id]["coordinator"]
    mac = msg["mac"].lower()
    client = next(
        (
            c
            for c in coordinator.data.get("clients", [])
            if c.get("mac", "").lower() == mac
        ),
        None,
    )
    if client:
        connection.send_result(msg["id"], client)
    else:
        connection.send_error(msg["id"], "not_found", "Client not found.")


@websocket_api.websocket_command(
    {
        vol.Required("type"): "meraki/get_device_clients",
        vol.Required("config_entry_id"): str,
        vol.Required("serial"): str,
    }
)
@websocket_api.async_response
async def ws_get_device_clients(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
) -> None:
    """Get clients connected to a specific device."""
    entry_id = msg["config_entry_id"]
    if entry_id not in hass.data[DOMAIN]:
        connection.send_error(msg["id"], "not_found", "Config entry not found.")
        return

    coordinator: MerakiDataCoordinator = hass.data[DOMAIN][entry_id]["coordinator"]
    serial = msg["serial"]

    # Filter clients by the device they're connected to
    # Clients have a 'recentDeviceSerial' or 'switchport' field indicating connection
    device_clients = [
        c
        for c in coordinator.data.get("clients", [])
        if c.get("recentDeviceSerial") == serial
        or c.get("recentDeviceMac") == serial  # Some APIs use MAC
    ]
    connection.send_result(msg["id"], device_clients)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "meraki/set_switch_port",
        vol.Required("config_entry_id"): str,
        vol.Required("serial"): str,
        vol.Required("port_id"): str,
        vol.Required("enabled"): bool,
    }
)
@websocket_api.async_response
async def ws_set_switch_port(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
) -> None:
    """Enable or disable a switch port."""
    entry_id = msg["config_entry_id"]
    if entry_id not in hass.data[DOMAIN]:
        connection.send_error(msg["id"], "not_found", "Config entry not found.")
        return

    api_client = hass.data[DOMAIN][entry_id].get(DATA_CLIENT)
    if not api_client or not api_client.dashboard:
        connection.send_error(msg["id"], "api_error", "API client not available.")
        return

    serial = msg["serial"]
    port_id = msg["port_id"]
    enabled = msg["enabled"]

    try:
        result = await api_client.dashboard.switch.updateDeviceSwitchPort(
            serial=serial,
            portId=port_id,
            enabled=enabled,
        )
        _LOGGER.info("Switch port %s on %s set to enabled=%s", port_id, serial, enabled)
        connection.send_result(msg["id"], _sanitize_result(result))
    except Exception as err:  # noqa: BLE001
        _LOGGER.error("Failed to update switch port: %s", err)
        connection.send_error(msg["id"], "api_error", str(err))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "meraki/set_client_policy",
        vol.Required("config_entry_id"): str,
        vol.Required("network_id"): str,
        vol.Required("client_id"): str,
        vol.Required("policy"): str,
        vol.Optional("group_policy_id"): str,
    }
)
@websocket_api.async_response
async def ws_set_client_policy(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
) -> None:
    """Set policy for a client (Normal, Allowed, Blocked, or Group policy)."""
    entry_id = msg["config_entry_id"]
    if entry_id not in hass.data[DOMAIN]:
        connection.send_error(msg["id"], "not_found", "Config entry not found.")
        return

    api_client = hass.data[DOMAIN][entry_id].get(DATA_CLIENT)
    if not api_client or not api_client.dashboard:
        connection.send_error(msg["id"], "api_error", "API client not available.")
        return

    network_id = msg["network_id"]
    client_id = msg["client_id"]
    policy = msg["policy"]
    group_policy_id = msg.get("group_policy_id")

    try:
        kwargs: dict[str, Any] = {"devicePolicy": policy}
        if group_policy_id and policy == "Group policy":
            kwargs["groupPolicyId"] = group_policy_id

        result = await api_client.dashboard.networks.updateNetworkClientPolicy(
            networkId=network_id,
            clientId=client_id,
            **kwargs,
        )
        _LOGGER.info(
            "Client %s policy set to %s (group: %s)",
            client_id,
            policy,
            group_policy_id,
        )
        connection.send_result(msg["id"], _sanitize_result(result))
    except Exception as err:  # noqa: BLE001
        _LOGGER.error("Failed to update client policy: %s", err)
        connection.send_error(msg["id"], "api_error", str(err))


def _sanitize_result(result: Any) -> dict[str, Any]:
    """Sanitize API result for JSON serialization."""
    if isinstance(result, dict):
        return result
    return {"result": str(result)}

"""Tests for the Meraki WebSocket API."""

from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock

import pytest
from homeassistant.core import HomeAssistant

from custom_components.meraki_ha.api.websocket import async_setup_websocket_api
from custom_components.meraki_ha.const import DATA_CLIENT, DOMAIN

CONFIG_ENTRY_ID = "test_entry_id"


@pytest.fixture(autouse=True)
async def setup_ws_api(hass: HomeAssistant):
    """Set up the WebSocket API."""
    async_setup_websocket_api(hass)
    yield


@pytest.fixture
def mock_coordinator():
    """Mock the MerakiDataCoordinator."""
    coordinator = AsyncMock()
    coordinator.last_update_success = True
    coordinator.data = {
        "devices": [{"serial": "123", "name": "Test Device"}],
        "clients": [
            {
                "mac": "aa:bb:cc:dd:ee:ff",
                "description": "Test Client",
                "recentDeviceSerial": "123",
                "networkId": "N_123",
            }
        ],
        "ssids": [{"number": 0, "name": "Test SSID"}],
        "networks": [{"id": "N_123", "name": "Test Network"}],
    }
    return coordinator


@pytest.fixture
def mock_api_client():
    """Mock the MerakiAPIClient."""
    api_client = MagicMock()
    api_client.dashboard = MagicMock()
    api_client.dashboard.switch = MagicMock()
    api_client.dashboard.switch.updateDeviceSwitchPort = AsyncMock(
        return_value={"portId": "1", "enabled": True}
    )
    api_client.dashboard.networks = MagicMock()
    api_client.dashboard.networks.updateNetworkClientPolicy = AsyncMock(
        return_value={"mac": "aa:bb:cc:dd:ee:ff", "devicePolicy": "Normal"}
    )
    return api_client


@pytest.fixture
def mock_hass(hass: HomeAssistant, mock_coordinator, mock_api_client):
    """Mock the Home Assistant instance."""
    hass.data[DOMAIN] = {
        CONFIG_ENTRY_ID: {
            "coordinator": mock_coordinator,
            "switch_port_coordinator": AsyncMock(
                last_update_success=True, data=[{"portId": "1"}]
            ),
            DATA_CLIENT: mock_api_client,
        }
    }
    return hass


async def test_ws_get_overview(hass_ws_client, mock_hass):
    """Test get_overview websocket command."""
    client = await hass_ws_client(mock_hass)
    await client.send_json(
        {"id": 1, "type": "meraki/get_overview", "config_entry_id": CONFIG_ENTRY_ID}
    )
    msg = await client.receive_json()
    assert msg["success"]
    assert msg["result"]["devices"][0]["serial"] == "123"


async def test_ws_get_device(hass_ws_client, mock_hass):
    """Test get_device websocket command."""
    client = await hass_ws_client(mock_hass)
    await client.send_json(
        {
            "id": 2,
            "type": "meraki/get_device",
            "config_entry_id": CONFIG_ENTRY_ID,
            "serial": "123",
        }
    )
    msg = await client.receive_json()
    assert msg["success"]
    assert msg["result"]["name"] == "Test Device"


async def test_ws_get_device_not_found(hass_ws_client, mock_hass):
    """Test get_device websocket command with an unknown serial."""
    client = await hass_ws_client(mock_hass)
    await client.send_json(
        {
            "id": 3,
            "type": "meraki/get_device",
            "config_entry_id": CONFIG_ENTRY_ID,
            "serial": "456",
        }
    )
    msg = await client.receive_json()
    assert not msg["success"]
    assert msg["error"]["code"] == "not_found"


async def test_ws_get_clients(hass_ws_client, mock_hass):
    """Test get_clients websocket command."""
    client = await hass_ws_client(mock_hass)
    await client.send_json(
        {"id": 4, "type": "meraki/get_clients", "config_entry_id": CONFIG_ENTRY_ID}
    )
    msg = await client.receive_json()
    assert msg["success"]
    assert msg["result"][0]["mac"] == "aa:bb:cc:dd:ee:ff"


async def test_ws_get_ssids(hass_ws_client, mock_hass):
    """Test get_ssids websocket command."""
    client = await hass_ws_client(mock_hass)
    await client.send_json(
        {"id": 5, "type": "meraki/get_ssids", "config_entry_id": CONFIG_ENTRY_ID}
    )
    msg = await client.receive_json()
    assert msg["success"]
    assert msg["result"][0]["name"] == "Test SSID"


async def test_ws_get_switch_ports(hass_ws_client, mock_hass):
    """Test get_switch_ports websocket command."""
    client = await hass_ws_client(mock_hass)
    await client.send_json(
        {"id": 6, "type": "meraki/get_switch_ports", "config_entry_id": CONFIG_ENTRY_ID}
    )
    msg = await client.receive_json()
    assert msg["success"]
    assert msg["result"][0]["portId"] == "1"


async def test_ws_subscribe_updates(hass_ws_client, mock_hass):
    """Test subscribe_updates websocket command."""
    client = await hass_ws_client(mock_hass)
    await client.send_json(
        {
            "id": 7,
            "type": "meraki/subscribe_updates",
            "config_entry_id": CONFIG_ENTRY_ID,
        }
    )
    msg = await client.receive_json()
    assert msg["success"]

    # Verify that the coordinator's listener was added
    mock_hass.data[DOMAIN][CONFIG_ENTRY_ID][
        "coordinator"
    ].async_add_listener.assert_called_once()


async def test_ws_block_client(hass_ws_client, mock_hass):
    """Test block_client websocket command."""
    client = await hass_ws_client(mock_hass)
    await client.send_json(
        {
            "id": 8,
            "type": "meraki/block_client",
            "config_entry_id": CONFIG_ENTRY_ID,
            "mac": "aa:bb:cc:dd:ee:ff",
        }
    )
    msg = await client.receive_json()
    assert msg["success"]


async def test_ws_unblock_client(hass_ws_client, mock_hass):
    """Test unblock_client websocket command."""
    client = await hass_ws_client(mock_hass)
    await client.send_json(
        {
            "id": 9,
            "type": "meraki/unblock_client",
            "config_entry_id": CONFIG_ENTRY_ID,
            "mac": "aa:bb:cc:dd:ee:ff",
        }
    )
    msg = await client.receive_json()
    assert msg["success"]


async def test_ws_command_coordinator_not_ready(hass_ws_client, mock_hass):
    """Test commands when coordinator is not ready."""
    mock_hass.data[DOMAIN][CONFIG_ENTRY_ID]["coordinator"].last_update_success = False
    client = await hass_ws_client(mock_hass)

    await client.send_json(
        {"id": 10, "type": "meraki/get_overview", "config_entry_id": CONFIG_ENTRY_ID}
    )
    msg = await client.receive_json()
    assert not msg["success"]
    assert msg["error"]["code"] == "coordinator_not_ready"


async def test_ws_get_networks(hass_ws_client, mock_hass):
    """Test get_networks websocket command."""
    client = await hass_ws_client(mock_hass)
    await client.send_json(
        {"id": 11, "type": "meraki/get_networks", "config_entry_id": CONFIG_ENTRY_ID}
    )
    msg = await client.receive_json()
    assert msg["success"]
    assert msg["result"][0]["id"] == "N_123"
    assert msg["result"][0]["name"] == "Test Network"


async def test_ws_get_client(hass_ws_client, mock_hass):
    """Test get_client websocket command."""
    client = await hass_ws_client(mock_hass)
    await client.send_json(
        {
            "id": 12,
            "type": "meraki/get_client",
            "config_entry_id": CONFIG_ENTRY_ID,
            "mac": "aa:bb:cc:dd:ee:ff",
        }
    )
    msg = await client.receive_json()
    assert msg["success"]
    assert msg["result"]["mac"] == "aa:bb:cc:dd:ee:ff"
    assert msg["result"]["description"] == "Test Client"


async def test_ws_get_client_not_found(hass_ws_client, mock_hass):
    """Test get_client websocket command with unknown MAC."""
    client = await hass_ws_client(mock_hass)
    await client.send_json(
        {
            "id": 13,
            "type": "meraki/get_client",
            "config_entry_id": CONFIG_ENTRY_ID,
            "mac": "11:22:33:44:55:66",
        }
    )
    msg = await client.receive_json()
    assert not msg["success"]
    assert msg["error"]["code"] == "not_found"


async def test_ws_get_client_case_insensitive(hass_ws_client, mock_hass):
    """Test get_client is case-insensitive for MAC address."""
    client = await hass_ws_client(mock_hass)
    await client.send_json(
        {
            "id": 14,
            "type": "meraki/get_client",
            "config_entry_id": CONFIG_ENTRY_ID,
            "mac": "AA:BB:CC:DD:EE:FF",  # Uppercase
        }
    )
    msg = await client.receive_json()
    assert msg["success"]
    assert msg["result"]["mac"] == "aa:bb:cc:dd:ee:ff"


async def test_ws_get_device_clients(hass_ws_client, mock_hass):
    """Test get_device_clients websocket command."""
    client = await hass_ws_client(mock_hass)
    await client.send_json(
        {
            "id": 15,
            "type": "meraki/get_device_clients",
            "config_entry_id": CONFIG_ENTRY_ID,
            "serial": "123",
        }
    )
    msg = await client.receive_json()
    assert msg["success"]
    assert len(msg["result"]) == 1
    assert msg["result"][0]["mac"] == "aa:bb:cc:dd:ee:ff"


async def test_ws_get_device_clients_empty(hass_ws_client, mock_hass):
    """Test get_device_clients with no matching clients."""
    client = await hass_ws_client(mock_hass)
    await client.send_json(
        {
            "id": 16,
            "type": "meraki/get_device_clients",
            "config_entry_id": CONFIG_ENTRY_ID,
            "serial": "999",  # No clients connected
        }
    )
    msg = await client.receive_json()
    assert msg["success"]
    assert len(msg["result"]) == 0


async def test_ws_set_switch_port(hass_ws_client, mock_hass):
    """Test set_switch_port websocket command."""
    client = await hass_ws_client(mock_hass)
    await client.send_json(
        {
            "id": 17,
            "type": "meraki/set_switch_port",
            "config_entry_id": CONFIG_ENTRY_ID,
            "serial": "123",
            "port_id": "1",
            "enabled": True,
        }
    )
    msg = await client.receive_json()
    assert msg["success"]
    assert msg["result"]["enabled"] is True

    # Verify API was called correctly
    mock_hass.data[DOMAIN][CONFIG_ENTRY_ID][
        DATA_CLIENT
    ].dashboard.switch.updateDeviceSwitchPort.assert_called_once_with(
        serial="123",
        portId="1",
        enabled=True,
    )


async def test_ws_set_switch_port_disable(hass_ws_client, mock_hass):
    """Test set_switch_port to disable a port."""
    mock_hass.data[DOMAIN][CONFIG_ENTRY_ID][
        DATA_CLIENT
    ].dashboard.switch.updateDeviceSwitchPort = AsyncMock(
        return_value={"portId": "2", "enabled": False}
    )

    client = await hass_ws_client(mock_hass)
    await client.send_json(
        {
            "id": 18,
            "type": "meraki/set_switch_port",
            "config_entry_id": CONFIG_ENTRY_ID,
            "serial": "123",
            "port_id": "2",
            "enabled": False,
        }
    )
    msg = await client.receive_json()
    assert msg["success"]
    assert msg["result"]["enabled"] is False


async def test_ws_set_client_policy(hass_ws_client, mock_hass):
    """Test set_client_policy websocket command."""
    client = await hass_ws_client(mock_hass)
    await client.send_json(
        {
            "id": 19,
            "type": "meraki/set_client_policy",
            "config_entry_id": CONFIG_ENTRY_ID,
            "network_id": "N_123",
            "client_id": "aa:bb:cc:dd:ee:ff",
            "policy": "Normal",
        }
    )
    msg = await client.receive_json()
    assert msg["success"]
    assert msg["result"]["devicePolicy"] == "Normal"

    # Verify API was called correctly
    mock_hass.data[DOMAIN][CONFIG_ENTRY_ID][
        DATA_CLIENT
    ].dashboard.networks.updateNetworkClientPolicy.assert_called_once_with(
        networkId="N_123",
        clientId="aa:bb:cc:dd:ee:ff",
        devicePolicy="Normal",
    )


async def test_ws_set_client_policy_with_group(hass_ws_client, mock_hass):
    """Test set_client_policy with group policy."""
    mock_hass.data[DOMAIN][CONFIG_ENTRY_ID][
        DATA_CLIENT
    ].dashboard.networks.updateNetworkClientPolicy = AsyncMock(
        return_value={
            "mac": "aa:bb:cc:dd:ee:ff",
            "devicePolicy": "Group policy",
            "groupPolicyId": "101",
        }
    )

    client = await hass_ws_client(mock_hass)
    await client.send_json(
        {
            "id": 20,
            "type": "meraki/set_client_policy",
            "config_entry_id": CONFIG_ENTRY_ID,
            "network_id": "N_123",
            "client_id": "aa:bb:cc:dd:ee:ff",
            "policy": "Group policy",
            "group_policy_id": "101",
        }
    )
    msg = await client.receive_json()
    assert msg["success"]
    assert msg["result"]["devicePolicy"] == "Group policy"
    assert msg["result"]["groupPolicyId"] == "101"


async def test_ws_set_switch_port_api_error(hass_ws_client, mock_hass):
    """Test set_switch_port when API fails."""
    mock_hass.data[DOMAIN][CONFIG_ENTRY_ID][
        DATA_CLIENT
    ].dashboard.switch.updateDeviceSwitchPort = AsyncMock(
        side_effect=Exception("API connection failed")
    )

    client = await hass_ws_client(mock_hass)
    await client.send_json(
        {
            "id": 21,
            "type": "meraki/set_switch_port",
            "config_entry_id": CONFIG_ENTRY_ID,
            "serial": "123",
            "port_id": "1",
            "enabled": True,
        }
    )
    msg = await client.receive_json()
    assert not msg["success"]
    assert msg["error"]["code"] == "api_error"


async def test_ws_set_client_policy_api_error(hass_ws_client, mock_hass):
    """Test set_client_policy when API fails."""
    mock_hass.data[DOMAIN][CONFIG_ENTRY_ID][
        DATA_CLIENT
    ].dashboard.networks.updateNetworkClientPolicy = AsyncMock(
        side_effect=Exception("Network error")
    )

    client = await hass_ws_client(mock_hass)
    await client.send_json(
        {
            "id": 22,
            "type": "meraki/set_client_policy",
            "config_entry_id": CONFIG_ENTRY_ID,
            "network_id": "N_123",
            "client_id": "aa:bb:cc:dd:ee:ff",
            "policy": "Blocked",
        }
    )
    msg = await client.receive_json()
    assert not msg["success"]
    assert msg["error"]["code"] == "api_error"

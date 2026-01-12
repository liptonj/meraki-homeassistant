"""Tests for the Meraki WebSocket API."""
from __future__ import annotations

from unittest.mock import AsyncMock

import pytest
from homeassistant.core import HomeAssistant

from custom_components.meraki_ha.api.websocket import async_setup_websocket_api
from custom_components.meraki_ha.const import DOMAIN

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
        "clients": [{"mac": "aa:bb:cc:dd:ee:ff", "description": "Test Client"}],
        "ssids": [{"number": 0, "name": "Test SSID"}],
    }
    return coordinator


@pytest.fixture
def mock_hass(hass: HomeAssistant, mock_coordinator):
    """Mock the Home Assistant instance."""
    hass.data[DOMAIN] = {
        CONFIG_ENTRY_ID: {
            "coordinator": mock_coordinator,
            "switch_port_coordinator": AsyncMock(last_update_success=True, data=[{"portId": "1"}]),
        }
    }
    return hass


async def test_ws_get_overview(hass_ws_client, mock_hass):
    """Test get_overview websocket command."""
    client = await hass_ws_client(mock_hass)
    await client.send_json({"id": 1, "type": "meraki/get_overview", "config_entry_id": CONFIG_ENTRY_ID})
    msg = await client.receive_json()
    assert msg["success"]
    assert msg["result"]["devices"][0]["serial"] == "123"


async def test_ws_get_device(hass_ws_client, mock_hass):
    """Test get_device websocket command."""
    client = await hass_ws_client(mock_hass)
    await client.send_json(
        {"id": 2, "type": "meraki/get_device", "config_entry_id": CONFIG_ENTRY_ID, "serial": "123"}
    )
    msg = await client.receive_json()
    assert msg["success"]
    assert msg["result"]["name"] == "Test Device"


async def test_ws_get_device_not_found(hass_ws_client, mock_hass):
    """Test get_device websocket command with an unknown serial."""
    client = await hass_ws_client(mock_hass)
    await client.send_json(
        {"id": 3, "type": "meraki/get_device", "config_entry_id": CONFIG_ENTRY_ID, "serial": "456"}
    )
    msg = await client.receive_json()
    assert not msg["success"]
    assert msg["error"]["code"] == "not_found"


async def test_ws_get_clients(hass_ws_client, mock_hass):
    """Test get_clients websocket command."""
    client = await hass_ws_client(mock_hass)
    await client.send_json({"id": 4, "type": "meraki/get_clients", "config_entry_id": CONFIG_ENTRY_ID})
    msg = await client.receive_json()
    assert msg["success"]
    assert msg["result"][0]["mac"] == "aa:bb:cc:dd:ee:ff"


async def test_ws_get_ssids(hass_ws_client, mock_hass):
    """Test get_ssids websocket command."""
    client = await hass_ws_client(mock_hass)
    await client.send_json({"id": 5, "type": "meraki/get_ssids", "config_entry_id": CONFIG_ENTRY_ID})
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
        {"id": 7, "type": "meraki/subscribe_updates", "config_entry_id": CONFIG_ENTRY_ID}
    )
    msg = await client.receive_json()
    assert msg["success"]

    # Verify that the coordinator's listener was added
    mock_hass.data[DOMAIN][CONFIG_ENTRY_ID]["coordinator"].async_add_listener.assert_called_once()


async def test_ws_block_client(hass_ws_client, mock_hass):
    """Test block_client websocket command."""
    client = await hass_ws_client(mock_hass)
    await client.send_json(
        {"id": 8, "type": "meraki/block_client", "config_entry_id": CONFIG_ENTRY_ID, "mac": "aa:bb:cc:dd:ee:ff"}
    )
    msg = await client.receive_json()
    assert msg["success"]


async def test_ws_unblock_client(hass_ws_client, mock_hass):
    """Test unblock_client websocket command."""
    client = await hass_ws_client(mock_hass)
    await client.send_json(
        {"id": 9, "type": "meraki/unblock_client", "config_entry_id": CONFIG_ENTRY_ID, "mac": "aa:bb:cc:dd:ee:ff"}
    )
    msg = await client.receive_json()
    assert msg["success"]

async def test_ws_command_coordinator_not_ready(hass_ws_client, mock_hass):
    """Test commands when coordinator is not ready."""
    mock_hass.data[DOMAIN][CONFIG_ENTRY_ID]["coordinator"].last_update_success = False
    client = await hass_ws_client(mock_hass)

    await client.send_json({"id": 10, "type": "meraki/get_overview", "config_entry_id": CONFIG_ENTRY_ID})
    msg = await client.receive_json()
    assert not msg["success"]
    assert msg["error"]["code"] == "coordinator_not_ready"

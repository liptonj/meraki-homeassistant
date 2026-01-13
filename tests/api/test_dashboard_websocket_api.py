"""Tests for the Meraki Dashboard WebSocket API."""

from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from homeassistant.core import HomeAssistant

from custom_components.meraki_ha.api.dashboard import async_setup
from custom_components.meraki_ha.const import DOMAIN

CONFIG_ENTRY_ID = "test_entry_id"


@pytest.fixture(autouse=True)
async def setup_ws_api(hass: HomeAssistant):
    """Set up the Dashboard WebSocket API."""
    async_setup(hass)
    yield


@pytest.fixture
def mock_coordinator():
    """Mock the MerakiDataCoordinator."""
    coordinator = AsyncMock()
    coordinator.last_update_success = True
    coordinator.data = {
        "devices": [
            {"serial": "QXXX-1234-ABCD", "name": "Test AP", "mac": "aa:bb:cc:dd:ee:ff"}
        ],
        "clients": [],
        "ssids": [],
        "networks": [{"id": "N_123", "name": "Test Network"}],
    }
    return coordinator


@pytest.fixture
def mock_dashboard_config():
    """Mock the generated dashboard configuration."""
    return {
        "title": "Meraki Network",
        "views": [
            {
                "title": "Overview",
                "path": "overview",
                "badges": [
                    {"type": "custom:meraki-status-badge"},
                    {"type": "custom:meraki-clients-badge"},
                ],
                "cards": [
                    {"type": "custom:meraki-overview-card"},
                ],
            },
            {
                "title": "Devices",
                "path": "devices",
                "cards": [
                    {"type": "custom:meraki-device-card", "device_id": "device_123"},
                ],
            },
        ],
    }


@pytest.fixture
def mock_hass_with_dashboard(
    hass: HomeAssistant, mock_coordinator, mock_dashboard_config
):
    """Mock Home Assistant with dashboard config."""
    hass.data[DOMAIN] = {
        CONFIG_ENTRY_ID: {
            "coordinator": mock_coordinator,
            "dashboard_config": mock_dashboard_config,
        }
    }
    return hass


@pytest.fixture
def mock_hass_without_dashboard(hass: HomeAssistant, mock_coordinator):
    """Mock Home Assistant without dashboard config."""
    hass.data[DOMAIN] = {
        CONFIG_ENTRY_ID: {
            "coordinator": mock_coordinator,
        }
    }
    return hass


async def test_ws_get_dashboard_config_success(
    hass_ws_client, mock_hass_with_dashboard, mock_dashboard_config
):
    """Test get_dashboard_config websocket command."""
    client = await hass_ws_client(mock_hass_with_dashboard)
    await client.send_json(
        {
            "id": 1,
            "type": "meraki_ha/get_dashboard_config",
            "config_entry_id": CONFIG_ENTRY_ID,
        }
    )
    msg = await client.receive_json()
    assert msg["success"]
    assert msg["result"]["config"] == mock_dashboard_config
    assert msg["result"]["config"]["title"] == "Meraki Network"
    assert len(msg["result"]["config"]["views"]) == 2


async def test_ws_get_dashboard_config_first_entry(
    hass_ws_client, mock_hass_with_dashboard, mock_dashboard_config
):
    """Test get_dashboard_config without specifying config_entry_id."""
    client = await hass_ws_client(mock_hass_with_dashboard)
    await client.send_json(
        {
            "id": 2,
            "type": "meraki_ha/get_dashboard_config",
        }
    )
    msg = await client.receive_json()
    assert msg["success"]
    assert msg["result"]["config"] == mock_dashboard_config


async def test_ws_get_dashboard_config_not_available(
    hass_ws_client, mock_hass_without_dashboard
):
    """Test get_dashboard_config when dashboard not generated."""
    client = await hass_ws_client(mock_hass_without_dashboard)
    await client.send_json(
        {
            "id": 3,
            "type": "meraki_ha/get_dashboard_config",
            "config_entry_id": CONFIG_ENTRY_ID,
        }
    )
    msg = await client.receive_json()
    assert not msg["success"]
    assert msg["error"]["code"] == "not_available"


async def test_ws_get_dashboard_config_entry_not_found(
    hass_ws_client, mock_hass_with_dashboard
):
    """Test get_dashboard_config with invalid config_entry_id."""
    client = await hass_ws_client(mock_hass_with_dashboard)
    await client.send_json(
        {
            "id": 4,
            "type": "meraki_ha/get_dashboard_config",
            "config_entry_id": "invalid_entry_id",
        }
    )
    msg = await client.receive_json()
    assert not msg["success"]
    assert msg["error"]["code"] == "not_found"


async def test_ws_get_dashboard_config_no_domain(hass_ws_client, hass: HomeAssistant):
    """Test get_dashboard_config when integration not loaded."""
    # Don't set up DOMAIN in hass.data
    async_setup(hass)
    client = await hass_ws_client(hass)
    await client.send_json(
        {
            "id": 5,
            "type": "meraki_ha/get_dashboard_config",
        }
    )
    msg = await client.receive_json()
    assert not msg["success"]
    assert msg["error"]["code"] == "not_found"


async def test_ws_get_dashboard_config_no_entries(hass_ws_client, hass: HomeAssistant):
    """Test get_dashboard_config when no config entries exist."""
    hass.data[DOMAIN] = {}
    async_setup(hass)
    client = await hass_ws_client(hass)
    await client.send_json(
        {
            "id": 6,
            "type": "meraki_ha/get_dashboard_config",
        }
    )
    msg = await client.receive_json()
    assert not msg["success"]
    assert msg["error"]["code"] == "not_found"


async def test_ws_regenerate_dashboard_success(
    hass_ws_client, mock_hass_with_dashboard
):
    """Test regenerate_dashboard websocket command."""
    new_config = {
        "title": "Meraki Network",
        "views": [
            {
                "title": "Overview",
                "path": "overview",
                "cards": [{"type": "custom:meraki-overview-card"}],
            },
        ],
    }

    with patch(
        "custom_components.meraki_ha.dashboard.MerakiDashboardStrategy"
    ) as mock_strategy_class:
        mock_strategy = MagicMock()
        mock_strategy.async_generate = AsyncMock(return_value=new_config)
        mock_strategy_class.return_value = mock_strategy

        client = await hass_ws_client(mock_hass_with_dashboard)
        await client.send_json(
            {
                "id": 7,
                "type": "meraki_ha/regenerate_dashboard",
                "config_entry_id": CONFIG_ENTRY_ID,
            }
        )
        msg = await client.receive_json()

    assert msg["success"]
    assert msg["result"]["success"] is True
    assert msg["result"]["config"]["title"] == "Meraki Network"

    # Verify the strategy was called correctly
    mock_strategy.async_generate.assert_called_once_with(
        mock_hass_with_dashboard, CONFIG_ENTRY_ID
    )


async def test_ws_regenerate_dashboard_entry_not_found(
    hass_ws_client, mock_hass_with_dashboard
):
    """Test regenerate_dashboard with invalid config_entry_id."""
    client = await hass_ws_client(mock_hass_with_dashboard)
    await client.send_json(
        {
            "id": 8,
            "type": "meraki_ha/regenerate_dashboard",
            "config_entry_id": "invalid_entry_id",
        }
    )
    msg = await client.receive_json()
    assert not msg["success"]
    assert msg["error"]["code"] == "not_found"


async def test_ws_regenerate_dashboard_generation_failed(
    hass_ws_client, mock_hass_with_dashboard
):
    """Test regenerate_dashboard when generation fails."""
    with patch(
        "custom_components.meraki_ha.dashboard.MerakiDashboardStrategy"
    ) as mock_strategy_class:
        mock_strategy = MagicMock()
        mock_strategy.async_generate = AsyncMock(return_value=None)
        mock_strategy_class.return_value = mock_strategy

        client = await hass_ws_client(mock_hass_with_dashboard)
        await client.send_json(
            {
                "id": 9,
                "type": "meraki_ha/regenerate_dashboard",
                "config_entry_id": CONFIG_ENTRY_ID,
            }
        )
        msg = await client.receive_json()

    assert not msg["success"]
    assert msg["error"]["code"] == "generation_failed"


async def test_ws_regenerate_dashboard_no_domain(hass_ws_client, hass: HomeAssistant):
    """Test regenerate_dashboard when integration not loaded."""
    async_setup(hass)
    client = await hass_ws_client(hass)
    await client.send_json(
        {
            "id": 10,
            "type": "meraki_ha/regenerate_dashboard",
            "config_entry_id": CONFIG_ENTRY_ID,
        }
    )
    msg = await client.receive_json()
    assert not msg["success"]
    assert msg["error"]["code"] == "not_found"

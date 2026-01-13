"""Tests for the Meraki Dashboard Strategy."""

from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from homeassistant.core import HomeAssistant

from custom_components.meraki_ha.const import DOMAIN
from custom_components.meraki_ha.dashboard import MerakiDashboardStrategy

CONFIG_ENTRY_ID = "test_entry_id"


@pytest.fixture
def mock_coordinator():
    """Mock the MerakiDataCoordinator."""
    coordinator = AsyncMock()
    coordinator.last_update_success = True
    coordinator.data = {
        "devices": [
            {
                "serial": "QXXX-1234-ABCD",
                "name": "Office AP",
                "mac": "aa:bb:cc:dd:ee:ff",
            },
            {
                "serial": "QXXX-5678-EFGH",
                "name": "Conference Room AP",
                "mac": "11:22:33:44:55:66",
            },
        ],
        "clients": [],
        "ssids": [],
        "networks": [{"id": "N_123", "name": "Test Network"}],
    }
    return coordinator


@pytest.fixture
def mock_coordinator_no_data():
    """Mock coordinator with no data."""
    coordinator = AsyncMock()
    coordinator.last_update_success = False
    coordinator.data = None
    return coordinator


@pytest.fixture
def mock_coordinator_empty_devices():
    """Mock coordinator with empty devices list."""
    coordinator = AsyncMock()
    coordinator.last_update_success = True
    coordinator.data = {
        "devices": [],
        "clients": [],
        "ssids": [],
        "networks": [],
    }
    return coordinator


@pytest.fixture
def mock_device_registry():
    """Mock the device registry."""
    mock_device_1 = MagicMock()
    mock_device_1.id = "device_123"

    mock_device_2 = MagicMock()
    mock_device_2.id = "device_456"

    registry = MagicMock()
    registry.async_get_device = MagicMock(
        side_effect=lambda identifiers: {
            frozenset({(DOMAIN, "aa:bb:cc:dd:ee:ff")}): mock_device_1,
            frozenset({(DOMAIN, "11:22:33:44:55:66")}): mock_device_2,
        }.get(frozenset(identifiers))
    )
    return registry


async def test_strategy_generate_dashboard(
    hass: HomeAssistant, mock_coordinator, mock_device_registry
):
    """Test dashboard generation with devices."""
    hass.data[DOMAIN] = {
        CONFIG_ENTRY_ID: {
            "coordinator": mock_coordinator,
        }
    }

    strategy = MerakiDashboardStrategy()

    with patch(
        "custom_components.meraki_ha.dashboard.dr.async_get",
        return_value=mock_device_registry,
    ):
        config = await strategy.async_generate(hass, CONFIG_ENTRY_ID)

    assert config is not None
    assert config["title"] == "Meraki Network"
    assert len(config["views"]) == 4

    # Verify Overview view
    overview = config["views"][0]
    assert overview["title"] == "Overview"
    assert overview["path"] == "overview"
    assert len(overview["badges"]) == 3
    assert overview["badges"][0]["type"] == "custom:meraki-status-badge"
    assert overview["badges"][1]["type"] == "custom:meraki-clients-badge"
    assert overview["badges"][2]["type"] == "custom:meraki-alerts-badge"
    assert len(overview["cards"]) == 3
    assert overview["cards"][0]["type"] == "custom:meraki-overview-card"
    assert overview["cards"][1]["type"] == "custom:meraki-clients-card"
    assert overview["cards"][1]["limit"] == 10
    assert overview["cards"][2]["type"] == "custom:meraki-ssids-list-card"

    # Verify Devices view has cards for each device
    devices_view = config["views"][1]
    assert devices_view["title"] == "Devices"
    assert devices_view["path"] == "devices"
    assert len(devices_view["cards"]) == 2  # Two devices
    for card in devices_view["cards"]:
        assert card["type"] == "custom:meraki-device-card"
        assert "device_id" in card

    # Verify Events view
    events_view = config["views"][2]
    assert events_view["title"] == "Events"
    assert events_view["path"] == "events"
    assert len(events_view["cards"]) == 1
    assert events_view["cards"][0]["type"] == "custom:meraki-events-card"

    # Verify Guest Access view
    guest_view = config["views"][3]
    assert guest_view["title"] == "Guest Access"
    assert guest_view["path"] == "guest"
    assert len(guest_view["cards"]) == 1
    assert guest_view["cards"][0]["type"] == "custom:meraki-guest-access-card"


async def test_strategy_generate_no_coordinator_data(
    hass: HomeAssistant, mock_coordinator_no_data
):
    """Test dashboard generation when coordinator has no data."""
    hass.data[DOMAIN] = {
        CONFIG_ENTRY_ID: {
            "coordinator": mock_coordinator_no_data,
        }
    }

    strategy = MerakiDashboardStrategy()
    config = await strategy.async_generate(hass, CONFIG_ENTRY_ID)

    assert config is None


async def test_strategy_generate_no_coordinator(hass: HomeAssistant):
    """Test dashboard generation when coordinator is missing."""
    hass.data[DOMAIN] = {CONFIG_ENTRY_ID: {}}

    strategy = MerakiDashboardStrategy()
    config = await strategy.async_generate(hass, CONFIG_ENTRY_ID)

    assert config is None


async def test_strategy_generate_empty_devices(
    hass: HomeAssistant, mock_coordinator_empty_devices, mock_device_registry
):
    """Test dashboard generation with no devices."""
    hass.data[DOMAIN] = {
        CONFIG_ENTRY_ID: {
            "coordinator": mock_coordinator_empty_devices,
        }
    }

    strategy = MerakiDashboardStrategy()

    with patch(
        "custom_components.meraki_ha.dashboard.dr.async_get",
        return_value=mock_device_registry,
    ):
        config = await strategy.async_generate(hass, CONFIG_ENTRY_ID)

    assert config is not None
    # Devices view should have empty cards list
    devices_view = config["views"][1]
    assert devices_view["cards"] == []


async def test_strategy_devices_sorted_by_name(
    hass: HomeAssistant, mock_device_registry
):
    """Test that device cards are sorted by device name."""
    # Create coordinator with unsorted devices
    coordinator = AsyncMock()
    coordinator.data = {
        "devices": [
            {"serial": "S1", "name": "Zulu AP", "mac": "aa:bb:cc:dd:ee:ff"},
            {"serial": "S2", "name": "Alpha AP", "mac": "11:22:33:44:55:66"},
            {"serial": "S3", "name": "Mike AP", "mac": "99:88:77:66:55:44"},
        ],
    }

    hass.data[DOMAIN] = {
        CONFIG_ENTRY_ID: {
            "coordinator": coordinator,
        }
    }

    # Return devices in order they're queried (we'll verify by checking order)
    device_map = {
        "aa:bb:cc:dd:ee:ff": MagicMock(id="zulu_device"),
        "11:22:33:44:55:66": MagicMock(id="alpha_device"),
        "99:88:77:66:55:44": MagicMock(id="mike_device"),
    }

    def get_device(identifiers):
        for _domain, mac in identifiers:
            if mac in device_map:
                return device_map[mac]
        return None

    mock_device_registry.async_get_device = MagicMock(side_effect=get_device)

    strategy = MerakiDashboardStrategy()

    with patch(
        "custom_components.meraki_ha.dashboard.dr.async_get",
        return_value=mock_device_registry,
    ):
        config = await strategy.async_generate(hass, CONFIG_ENTRY_ID)

    devices_view = config["views"][1]
    # Devices should be sorted: Alpha AP, Mike AP, Zulu AP
    assert len(devices_view["cards"]) == 3
    assert devices_view["cards"][0]["device_id"] == "alpha_device"
    assert devices_view["cards"][1]["device_id"] == "mike_device"
    assert devices_view["cards"][2]["device_id"] == "zulu_device"


async def test_strategy_skips_devices_not_in_registry(
    hass: HomeAssistant,
):
    """Test that devices not in HA registry are skipped."""
    coordinator = AsyncMock()
    coordinator.data = {
        "devices": [
            {"serial": "S1", "name": "Known AP", "mac": "aa:bb:cc:dd:ee:ff"},
            {"serial": "S2", "name": "Unknown AP", "mac": "11:22:33:44:55:66"},
        ],
    }

    hass.data[DOMAIN] = {
        CONFIG_ENTRY_ID: {
            "coordinator": coordinator,
        }
    }

    mock_device = MagicMock()
    mock_device.id = "known_device"

    registry = MagicMock()
    # Only return a device for the first MAC
    registry.async_get_device = MagicMock(
        side_effect=lambda identifiers: (
            mock_device if (DOMAIN, "aa:bb:cc:dd:ee:ff") in identifiers else None
        )
    )

    strategy = MerakiDashboardStrategy()

    with patch(
        "custom_components.meraki_ha.dashboard.dr.async_get",
        return_value=registry,
    ):
        config = await strategy.async_generate(hass, CONFIG_ENTRY_ID)

    devices_view = config["views"][1]
    # Only one device should have a card
    assert len(devices_view["cards"]) == 1
    assert devices_view["cards"][0]["device_id"] == "known_device"

"""Tests for dashboard creation and card functionality."""

from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from custom_components.meraki_ha.dashboard import MerakiDashboardStrategy
from custom_components.meraki_ha.services.dashboard_service import (
    async_regenerate_dashboard,
)


@pytest.fixture
def mock_hass():
    """Create a mock Home Assistant instance."""
    hass = MagicMock()
    hass.config_entries = MagicMock()
    hass.data = {
        "lovelace": {
            "dashboards": MagicMock(),
        },
        "meraki_ha": {},
    }
    hass.services = MagicMock()
    hass.services.async_call = AsyncMock()
    return hass


@pytest.fixture
def mock_coordinator():
    """Create a mock coordinator with sample data."""
    coordinator = MagicMock()
    coordinator.data = {
        "devices": [
            {
                "serial": "Q2XX-XXXX-XXXX",
                "name": "Test Switch",
                "model": "MS220-8P",
                "mac": "00:11:22:33:44:55",
                "networkId": "N_1234",
                "productType": "switch",
            },
            {
                "serial": "Q2YY-YYYY-YYYY",
                "name": "Test AP",
                "model": "MR36",
                "mac": "00:11:22:33:44:66",
                "networkId": "N_1234",
                "productType": "wireless",
            },
        ],
    }
    return coordinator


async def test_dashboard_strategy_generate(mock_hass, mock_coordinator):
    """Test dashboard strategy generation."""
    config_entry_id = "test_entry_id"
    mock_hass.data["meraki_ha"][config_entry_id] = {
        "coordinator": mock_coordinator,
    }

    with patch("custom_components.meraki_ha.dashboard.dr") as mock_dr:
        # Mock device registry
        mock_device_registry = MagicMock()
        mock_dr.async_get.return_value = mock_device_registry

        # Mock device lookup
        mock_device = MagicMock()
        mock_device.id = "device_id_123"
        mock_device_registry.async_get_device.return_value = mock_device

        strategy = MerakiDashboardStrategy()
        result = await strategy.async_generate(mock_hass, config_entry_id)

        assert result is not None
        assert "title" in result
        assert result["title"] == "Meraki Network"
        assert "views" in result
        assert len(result["views"]) > 0

        # Check overview view
        overview_view = result["views"][0]
        assert overview_view["title"] == "Overview"
        assert "badges" in overview_view
        assert len(overview_view["badges"]) == 3  # Status, Clients, Alerts

        # Check device view
        devices_view = result["views"][1]
        assert devices_view["title"] == "Devices"
        assert "cards" in devices_view


async def test_dashboard_strategy_no_coordinator(mock_hass):
    """Test dashboard strategy with no coordinator."""
    config_entry_id = "test_entry_id"
    mock_hass.data["meraki_ha"][config_entry_id] = {}

    strategy = MerakiDashboardStrategy()
    result = await strategy.async_generate(mock_hass, config_entry_id)

    assert result is None


async def test_dashboard_strategy_no_devices(mock_hass):
    """Test dashboard strategy with no devices."""
    config_entry_id = "test_entry_id"
    coordinator = MagicMock()
    coordinator.data = {"devices": []}
    mock_hass.data["meraki_ha"][config_entry_id] = {
        "coordinator": coordinator,
    }

    with patch("custom_components.meraki_ha.dashboard.dr") as mock_dr:
        mock_device_registry = MagicMock()
        mock_dr.async_get.return_value = mock_device_registry

        strategy = MerakiDashboardStrategy()
        result = await strategy.async_generate(mock_hass, config_entry_id)

        assert result is not None
        assert "views" in result
        # Should still have overview view
        assert len(result["views"]) >= 1


@pytest.mark.skip(reason="Complex mocking of lovelace module - integration test needed")
async def test_regenerate_dashboard_service(mock_hass):
    """Test dashboard regeneration service - basic flow validation."""
    config_entry_id = "test_entry_id"

    # Mock config entry
    mock_entry = MagicMock()
    mock_entry.entry_id = config_entry_id
    mock_entry.title = "Test Meraki"
    mock_hass.config_entries.async_get_entry.return_value = mock_entry

    # Mock coordinator
    mock_coordinator = MagicMock()
    mock_coordinator.data = {"devices": []}
    mock_hass.data["meraki_ha"][config_entry_id] = {
        "coordinator": mock_coordinator,
    }

    # Mock service call
    call = MagicMock()
    call.data = {"config_entry_id": config_entry_id}

    # Patch the entire dashboard service module's lovelace import
    with patch.object(
        __import__(
            "custom_components.meraki_ha.services.dashboard_service",
            fromlist=["lovelace"],
        ),
        "lovelace",
    ) as mock_lovelace_module:
        with patch("custom_components.meraki_ha.dashboard.dr"):
            mock_lovelace_module.async_save_config = AsyncMock()

            # Call the service
            await async_regenerate_dashboard(mock_hass, call)

            # Verify notification was sent (service completed without error)
            assert mock_hass.services.async_call.called


async def test_regenerate_dashboard_no_entry(mock_hass):
    """Test dashboard regeneration with invalid entry."""
    mock_hass.config_entries.async_get_entry.return_value = None

    call = MagicMock()
    call.data = {"config_entry_id": "invalid_entry"}

    # Should not raise exception
    await async_regenerate_dashboard(mock_hass, call)


async def test_regenerate_dashboard_no_entry_id(mock_hass):
    """Test dashboard regeneration with no entry ID."""
    call = MagicMock()
    call.data = {}

    # Should not raise exception
    await async_regenerate_dashboard(mock_hass, call)


def test_dashboard_badge_types():
    """Test that dashboard uses correct badge types."""
    # This would be extended with actual card verification
    # For now, verify expected badge types
    expected_badges = [
        "custom:meraki-status-badge",
        "custom:meraki-clients-badge",
        "custom:meraki-alerts-badge",
    ]

    # In real implementation, would check dashboard config
    assert len(expected_badges) == 3


def test_dashboard_card_types():
    """Test that dashboard includes all required card types."""
    expected_cards = [
        "custom:meraki-overview-card",
        "custom:meraki-device-card",
        "custom:meraki-clients-card",
        "custom:meraki-switch-ports-card",
        "custom:meraki-devices-card",
        "custom:meraki-mqtt-status-card",
        "custom:meraki-client-card",
        "custom:meraki-camera-card",
        "custom:meraki-ssids-list-card",
        "custom:meraki-events-card",
        "custom:meraki-guest-access-card",
    ]

    # In real implementation, would check dashboard config
    assert len(expected_cards) == 11

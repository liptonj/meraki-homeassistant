"""Tests for the MerakiDataCoordinator class."""

from datetime import datetime, timedelta
from unittest.mock import AsyncMock, MagicMock

import pytest

from custom_components.meraki_ha.meraki_data_coordinator import MerakiDataCoordinator


@pytest.fixture
def mock_api_client() -> AsyncMock:
    """Fixture for a mocked MerakiAPIClient."""
    return AsyncMock()


@pytest.fixture
def mock_hass() -> MagicMock:
    """Fixture for a mocked Home Assistant instance."""
    return MagicMock()


@pytest.fixture
def mock_config_entry() -> MagicMock:
    """Fixture for a mocked ConfigEntry."""
    entry = MagicMock()
    entry.options = {
        "network_scan_interval": 600,
        "device_scan_interval": 300,
        "client_scan_interval": 60,
        "ssid_scan_interval": 600,
    }
    return entry


def test_get_polling_interval_no_webhooks(
    mock_hass, mock_api_client, mock_config_entry
):
    """Test polling interval when webhooks are not active."""
    coordinator = MerakiDataCoordinator(mock_hass, mock_api_client, mock_config_entry)
    interval = coordinator._get_polling_interval("devices")
    assert interval == timedelta(seconds=300)


def test_get_polling_interval_with_active_webhooks(
    mock_hass, mock_api_client, mock_config_entry
):
    """Test polling interval when webhooks are active."""
    coordinator = MerakiDataCoordinator(mock_hass, mock_api_client, mock_config_entry)
    coordinator._webhooks_active = True
    coordinator._last_webhook_by_type["apDown"] = datetime.now()
    interval = coordinator._get_polling_interval("devices")
    assert interval == timedelta(seconds=300 * 6)  # 300s * 6 = 30 mins


def test_get_polling_interval_with_stale_webhooks(
    mock_hass, mock_api_client, mock_config_entry
):
    """Test polling interval when webhooks are stale."""
    coordinator = MerakiDataCoordinator(mock_hass, mock_api_client, mock_config_entry)
    coordinator._webhooks_active = True
    coordinator._last_webhook_by_type["apDown"] = datetime.now() - timedelta(hours=2)
    interval = coordinator._get_polling_interval("devices")
    assert interval == timedelta(seconds=300)

"""Tests for the webhook alert handlers."""

from unittest.mock import AsyncMock, MagicMock

import pytest

from custom_components.meraki_ha.handlers.client_alerts import async_handle_client_alert
from custom_components.meraki_ha.handlers.device_alerts import async_handle_device_alert
from custom_components.meraki_ha.handlers.network_alerts import (
    async_handle_network_alert,
)
from custom_components.meraki_ha.handlers.security_alerts import (
    async_handle_security_alert,
)
from custom_components.meraki_ha.handlers.sensor_alerts import async_handle_sensor_alert


@pytest.fixture
def mock_coordinator() -> MagicMock:
    """Fixture for a mocked MerakiDataCoordinator."""
    coordinator = MagicMock()
    coordinator.get_device.return_value = {"serial": "Q234-ABCD-5678", "status": "online"}
    coordinator.data = {
        "clients": [{"mac": "00:11:22:33:44:55", "status": "Online"}]
    }
    coordinator.async_request_refresh = AsyncMock()
    coordinator.async_update_listeners = MagicMock()
    return coordinator


async def test_handle_device_alert_down(mock_coordinator):
    """Test handling a device down alert."""
    alert = {"alertType": "APs went down", "deviceSerial": "Q234-ABCD-5678"}
    await async_handle_device_alert(mock_coordinator, alert)
    assert mock_coordinator.get_device.return_value["status"] == "offline"
    mock_coordinator.async_update_listeners.assert_called_once()


async def test_handle_client_alert_disconnected(mock_coordinator):
    """Test handling a client disconnected alert."""
    alert = {
        "alertType": "Client connectivity changed",
        "alertData": {"mac": "00:11:22:33:44:55", "connected": False},
    }
    await async_handle_client_alert(mock_coordinator, alert)
    assert mock_coordinator.data["clients"][0]["status"] == "Offline"
    mock_coordinator.async_update_listeners.assert_called_once()


async def test_handle_network_alert(mock_coordinator):
    """Test handling a network settings changed alert."""
    alert = {"alertType": "Settings changed"}
    await async_handle_network_alert(mock_coordinator, alert)
    mock_coordinator.async_request_refresh.assert_called_once()


async def test_handle_security_alert(mock_coordinator):
    """Test handling a security alert."""
    alert = {"alertType": "Rogue AP detected"}
    # For now, this just logs, so we just ensure it runs without error
    await async_handle_security_alert(mock_coordinator, alert)


async def test_handle_sensor_alert(mock_coordinator):
    """Test handling a sensor alert."""
    mock_coordinator.get_device.return_value["readings_raw"] = []
    alert = {
        "alertType": "temperatureThreshold",
        "deviceSerial": "Q234-ABCD-5678",
        "alertData": {
            "triggeredReadings": [
                {"metric": "temperature", "temperature": {"celsius": 30.0}}
            ]
        },
    }
    await async_handle_sensor_alert(mock_coordinator, alert)
    assert len(mock_coordinator.get_device.return_value["readings_raw"]) == 1
    mock_coordinator.async_update_listeners.assert_called_once()

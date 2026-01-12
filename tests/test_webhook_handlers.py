"""Tests for the webhook alert handlers."""

from __future__ import annotations

from unittest.mock import AsyncMock

import pytest

from custom_components.meraki_ha.meraki_data_coordinator import MerakiDataCoordinator
from custom_components.meraki_ha.webhook_handlers.client_alerts import (
    async_handle_client_alert,
)
from custom_components.meraki_ha.webhook_handlers.device_alerts import (
    async_handle_device_alert,
)


@pytest.fixture
def mock_coordinator() -> MerakiDataCoordinator:
    """Fixture for a mock MerakiDataCoordinator."""
    coordinator = AsyncMock(spec=MerakiDataCoordinator)
    coordinator.devices_by_serial = {}
    coordinator.data = {"clients": []}
    return coordinator


async def test_handle_ap_down_alert(mock_coordinator: MerakiDataCoordinator) -> None:
    """Test handling of an 'APs went down' alert."""
    mock_coordinator.devices_by_serial = {
        "Q234-ABCD-5678": {"serial": "Q234-ABCD-5678", "status": "online"}
    }
    alert_data = {
        "alertType": "APs went down",
        "deviceSerial": "Q234-ABCD-5678",
    }
    await async_handle_device_alert(mock_coordinator, alert_data)
    assert mock_coordinator.devices_by_serial["Q234-ABCD-5678"]["status"] == "offline"


async def test_handle_ap_up_alert(mock_coordinator: MerakiDataCoordinator) -> None:
    """Test handling of an 'APs came up' alert."""
    mock_coordinator.devices_by_serial = {
        "Q234-ABCD-5678": {"serial": "Q234-ABCD-5678", "status": "offline"}
    }
    alert_data = {
        "alertType": "APs came up",
        "deviceSerial": "Q234-ABCD-5678",
    }
    await async_handle_device_alert(mock_coordinator, alert_data)
    assert mock_coordinator.devices_by_serial["Q234-ABCD-5678"]["status"] == "online"


async def test_client_connectivity_changed_alert(
    mock_coordinator: MerakiDataCoordinator,
) -> None:
    """Test handling of a 'Client connectivity changed' alert."""
    mock_coordinator.data = {
        "clients": [{"mac": "00:11:22:33:44:55", "status": "Offline"}]
    }
    alert_data = {
        "alertType": "Client connectivity changed",
        "alertData": {"mac": "00:11:22:33:44:55", "connected": True},
    }
    await async_handle_client_alert(mock_coordinator, alert_data)
    assert mock_coordinator.data["clients"][0]["status"] == "Online"

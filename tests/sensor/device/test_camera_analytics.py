"""Tests for the Meraki camera analytics sensors."""

from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from custom_components.meraki_ha.sensor.device.camera_analytics import (
    MerakiPersonCountSensor,
    MerakiVehicleCountSensor,
)
from tests.const import MOCK_DEVICE


@pytest.fixture
def mock_coordinator():
    """Fixture for a mocked MerakiDataCoordinator."""
    return MagicMock()


@pytest.fixture
def mock_camera_service():
    """Fixture for a mocked CameraService."""
    service = AsyncMock()
    service.get_analytics_data = AsyncMock(return_value=[{"person": 5, "vehicle": 2}])
    return service


@pytest.mark.asyncio
async def test_person_count_sensor(mock_coordinator, mock_camera_service):
    """Test the person count sensor."""
    # Arrange
    device = MOCK_DEVICE.copy()
    sensor = MerakiPersonCountSensor(mock_coordinator, device, mock_camera_service)

    # Act
    await sensor.async_update()

    # Assert
    assert sensor.native_value == 5
    assert sensor.extra_state_attributes["raw_data"] == [{"person": 5, "vehicle": 2}]


@pytest.mark.asyncio
async def test_vehicle_count_sensor(mock_coordinator, mock_camera_service):
    """Test the vehicle count sensor."""
    # Arrange
    device = MOCK_DEVICE.copy()
    sensor = MerakiVehicleCountSensor(mock_coordinator, device, mock_camera_service)

    # Act
    await sensor.async_update()

    # Assert
    assert sensor.native_value == 2
    assert sensor.extra_state_attributes["raw_data"] == [{"person": 5, "vehicle": 2}]


def test_analytics_sensor_does_not_self_poll(mock_coordinator, mock_camera_service):
    """Analytics sensors follow the coordinator rather than HA's 30s poll."""
    sensor = MerakiPersonCountSensor(
        mock_coordinator, MOCK_DEVICE.copy(), mock_camera_service
    )
    assert sensor.should_poll is False


@pytest.mark.asyncio
async def test_coordinator_update_refreshes_only_when_stale(
    mock_coordinator, mock_camera_service
):
    """Coordinator ticks fetch analytics at most once per refresh interval."""
    device = MOCK_DEVICE.copy()
    mock_coordinator.data = {"devices": [device]}
    sensor = MerakiPersonCountSensor(mock_coordinator, device, mock_camera_service)
    sensor.hass = MagicMock()
    sensor.async_write_ha_state = MagicMock()
    scheduled = []
    sensor.hass.async_create_background_task = MagicMock(
        side_effect=lambda coro, name: scheduled.append(coro)
    )

    # A new process can have a monotonic clock below the 300-second interval.
    with patch(
        "custom_components.meraki_ha.sensor.device.camera_analytics.time.monotonic",
        return_value=50,
    ):
        sensor._handle_coordinator_update()
        assert len(scheduled) == 1
        await scheduled.pop()
        assert sensor.native_value == 5
        sensor._handle_coordinator_update()
    assert scheduled == []
    assert mock_camera_service.get_analytics_data.await_count == 1

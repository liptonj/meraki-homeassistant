"""Tests for the unified camera WebSocket pairing API."""

from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock

import pytest
from homeassistant.core import HomeAssistant

from custom_components.meraki_ha.api.camera import async_setup as camera_api_setup
from custom_components.meraki_ha.const import DOMAIN
from custom_components.meraki_ha.web_api import async_setup_api

CONFIG_ENTRY_ID = "test_entry_id"


@pytest.fixture(autouse=True)
async def setup_camera_api(hass: HomeAssistant):
    """Register web_api commands, then the camera API no-op.

    Pairing previously broke because camera.async_setup overwrote the panel
    commands. Registering both in the same order as production is the
    regression check.
    """
    async_setup_api(hass)
    camera_api_setup(hass)
    yield


@pytest.fixture
def mock_coordinator():
    """Mock the MerakiDataCoordinator."""
    coordinator = MagicMock()
    coordinator.get_device.return_value = {
        "serial": "Q234-CAM1",
        "name": "Office Camera",
        "rtsp_url": "rtsp://192.168.1.100/live",
    }
    coordinator.data = {
        "devices": [
            {
                "serial": "Q234-CAM1",
                "name": "Office Camera",
                "rtsp_url": "rtsp://192.168.1.100/live",
            }
        ],
    }
    return coordinator


@pytest.fixture
def mock_camera_service():
    """Mock CameraService."""
    service = MagicMock()
    service.get_camera_snapshot = AsyncMock(return_value="https://snapshot.url/image")
    service.get_rtsp_stream_url = AsyncMock(return_value="rtsp://192.168.1.100/live")
    service.get_cloud_video_url = AsyncMock(
        return_value="https://dashboard.example/video"
    )
    service.get_video_stream_url = AsyncMock(
        return_value="https://dashboard.example/video"
    )
    return service


@pytest.fixture
def mock_hass(hass: HomeAssistant, mock_coordinator, mock_camera_service):
    """Attach integration data in the production dict shape."""
    hass.data[DOMAIN] = {
        CONFIG_ENTRY_ID: {
            "coordinator": mock_coordinator,
            "camera_service": mock_camera_service,
        }
    }
    return hass


async def test_ws_set_and_get_camera_mapping_panel_schema(hass_ws_client, mock_hass):
    """Test DeviceView pairing payload saves and reloads by serial."""
    client = await hass_ws_client(mock_hass)
    await client.send_json(
        {
            "id": 1,
            "type": "meraki_ha/set_camera_mapping",
            "config_entry_id": CONFIG_ENTRY_ID,
            "serial": "Q234-CAM1",
            "linked_entity_id": "camera.blue_iris_office",
        }
    )
    msg = await client.receive_json()
    assert msg["success"]
    assert msg["result"]["success"] is True
    assert msg["result"]["mappings"]["Q234-CAM1"] == "camera.blue_iris_office"

    await client.send_json(
        {
            "id": 2,
            "type": "meraki_ha/get_camera_mappings",
            "config_entry_id": CONFIG_ENTRY_ID,
        }
    )
    msg = await client.receive_json()
    assert msg["success"]
    assert msg["result"]["mappings"]["Q234-CAM1"] == "camera.blue_iris_office"


async def test_ws_get_available_cameras_returns_object(hass_ws_client, mock_hass):
    """Test available cameras use the panel `{cameras: [...]}` envelope."""
    mock_hass.states.async_set(
        "camera.blue_iris_office",
        "idle",
        {"friendly_name": "Blue Iris Office"},
    )
    mock_hass.states.async_set(
        "camera.meraki_office",
        "idle",
        {"friendly_name": "Meraki Office"},
    )

    client = await hass_ws_client(mock_hass)
    await client.send_json({"id": 3, "type": "meraki_ha/get_available_cameras"})
    msg = await client.receive_json()
    assert msg["success"]
    assert "cameras" in msg["result"]
    entity_ids = [camera["entity_id"] for camera in msg["result"]["cameras"]]
    assert "camera.blue_iris_office" in entity_ids
    assert "camera.meraki_office" not in entity_ids
    assert msg["result"]["cameras"][0]["name"] == "Blue Iris Office"


async def test_ws_get_rtsp_url_by_serial(hass_ws_client, mock_hass):
    """Test DeviceView RTSP lookup by serial after both APIs are set up."""
    client = await hass_ws_client(mock_hass)
    await client.send_json(
        {
            "id": 4,
            "type": "meraki_ha/get_rtsp_url",
            "config_entry_id": CONFIG_ENTRY_ID,
            "serial": "Q234-CAM1",
        }
    )
    msg = await client.receive_json()
    assert msg["success"]
    assert msg["result"]["rtsp_url"] == "rtsp://192.168.1.100/live"


async def test_ws_get_camera_snapshot_by_serial(hass_ws_client, mock_hass):
    """Test DeviceView snapshot lookup by serial."""
    client = await hass_ws_client(mock_hass)
    await client.send_json(
        {
            "id": 5,
            "type": "meraki_ha/get_camera_snapshot",
            "config_entry_id": CONFIG_ENTRY_ID,
            "serial": "Q234-CAM1",
        }
    )
    msg = await client.receive_json()
    assert msg["success"]
    assert msg["result"]["url"] == "https://snapshot.url/image"


async def test_camera_api_setup_is_noop(hass: HomeAssistant) -> None:
    """Test the leftover camera API module does not register commands."""
    from unittest.mock import patch

    with patch(
        "homeassistant.components.websocket_api.async_register_command"
    ) as mock_register:
        camera_api_setup(hass)
        mock_register.assert_not_called()

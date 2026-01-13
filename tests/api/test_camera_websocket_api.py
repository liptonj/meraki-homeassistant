"""Tests for the Meraki Camera WebSocket API."""

from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from homeassistant.core import HomeAssistant

from custom_components.meraki_ha.api.camera import async_setup
from custom_components.meraki_ha.const import DOMAIN

CONFIG_ENTRY_ID = "test_entry_id"


@pytest.fixture(autouse=True)
async def setup_camera_api(hass: HomeAssistant):
    """Set up the Camera WebSocket API."""
    async_setup(hass)
    yield


@pytest.fixture
def mock_coordinator():
    """Mock the MerakiDataCoordinator."""
    coordinator = AsyncMock()
    coordinator.api = MagicMock()
    coordinator.api.camera = MagicMock()
    coordinator.api.camera.get_device_camera_video_link = AsyncMock(
        return_value={"url": "https://example.com/snapshot.jpg"}
    )
    coordinator.data = {
        "devices": [
            {
                "serial": "CAMERA-123",
                "name": "Office Camera",
                "rtspUrl": "rtsp://192.168.1.100/live",
            },
            {"serial": "CAMERA-456", "name": "Lobby Camera"},
        ],
    }
    return coordinator


@pytest.fixture
def mock_entity_registry():
    """Mock the entity registry."""
    entity = MagicMock()
    entity.entity_id = "camera.meraki_office_camera"
    entity.unique_id = "CAMERA-123"
    entity.config_entry_id = CONFIG_ENTRY_ID
    entity.platform = "camera"
    entity.name = "Office Camera"
    entity.original_name = "Office Camera"

    entity2 = MagicMock()
    entity2.entity_id = "camera.blue_iris_office"
    entity2.unique_id = "blueiris-123"
    entity2.config_entry_id = "other_entry"
    entity2.platform = "camera"
    entity2.name = "Blue Iris Office"
    entity2.original_name = "Blue Iris Office"

    registry = MagicMock()
    registry.async_get.side_effect = lambda eid: {
        "camera.meraki_office_camera": entity,
        "camera.blue_iris_office": entity2,
    }.get(eid)
    registry.entities = MagicMock()
    registry.entities.values.return_value = [entity, entity2]

    return registry


@pytest.fixture
def mock_hass(hass: HomeAssistant, mock_coordinator, mock_entity_registry):
    """Mock the Home Assistant instance."""
    hass.data[DOMAIN] = {
        CONFIG_ENTRY_ID: mock_coordinator,
    }
    return hass


@pytest.fixture
def mock_config_entry():
    """Mock a config entry."""
    entry = MagicMock()
    entry.entry_id = CONFIG_ENTRY_ID
    entry.options = {"camera_mappings": {}}
    return entry


async def test_ws_get_camera_snapshot(hass_ws_client, mock_hass, mock_entity_registry):
    """Test get_camera_snapshot websocket command."""
    with patch(
        "custom_components.meraki_ha.api.camera.er.async_get",
        return_value=mock_entity_registry,
        autospec=False,
    ):
        client = await hass_ws_client(mock_hass)
        await client.send_json(
            {
                "id": 1,
                "type": "meraki_ha/get_camera_snapshot",
                "entity_id": "camera.meraki_office_camera",
            }
        )
        msg = await client.receive_json()
        assert msg["success"]
        assert "url" in msg["result"]


async def test_ws_get_camera_snapshot_entity_not_found(
    hass_ws_client, mock_hass, mock_entity_registry
):
    """Test get_camera_snapshot with unknown entity."""
    with patch(
        "custom_components.meraki_ha.api.camera.er.async_get",
        return_value=mock_entity_registry,
        autospec=False,
    ):
        client = await hass_ws_client(mock_hass)
        await client.send_json(
            {
                "id": 2,
                "type": "meraki_ha/get_camera_snapshot",
                "entity_id": "camera.unknown",
            }
        )
        msg = await client.receive_json()
        assert not msg["success"]
        assert msg["error"]["code"] == "not_found"


async def test_ws_get_available_cameras(
    hass_ws_client, mock_hass, mock_entity_registry
):
    """Test get_available_cameras websocket command."""
    with patch(
        "custom_components.meraki_ha.api.camera.er.async_get",
        return_value=mock_entity_registry,
        autospec=False,
    ):
        client = await hass_ws_client(mock_hass)
        await client.send_json(
            {
                "id": 4,
                "type": "meraki_ha/get_available_cameras",
            }
        )
        msg = await client.receive_json()
        assert msg["success"]
        assert isinstance(msg["result"], list)
        assert len(msg["result"]) == 2


async def test_ws_get_camera_mappings(hass_ws_client, mock_hass, mock_config_entry):
    """Test get_camera_mappings websocket command."""
    mock_hass.config_entries.async_get_entry = MagicMock(return_value=mock_config_entry)

    client = await hass_ws_client(mock_hass)
    await client.send_json(
        {
            "id": 5,
            "type": "meraki_ha/get_camera_mappings",
            "config_entry_id": CONFIG_ENTRY_ID,
        }
    )
    msg = await client.receive_json()
    assert msg["success"]
    assert isinstance(msg["result"], dict)


async def test_ws_get_camera_mappings_not_found(hass_ws_client, mock_hass):
    """Test get_camera_mappings with unknown config entry."""
    mock_hass.config_entries.async_get_entry = MagicMock(return_value=None)

    client = await hass_ws_client(mock_hass)
    await client.send_json(
        {
            "id": 6,
            "type": "meraki_ha/get_camera_mappings",
            "config_entry_id": "unknown_entry",
        }
    )
    msg = await client.receive_json()
    assert not msg["success"]
    assert msg["error"]["code"] == "not_found"


async def test_ws_set_camera_mapping(hass_ws_client, mock_hass, mock_config_entry):
    """Test set_camera_mapping websocket command."""
    mock_hass.config_entries.async_get_entry = MagicMock(return_value=mock_config_entry)
    mock_hass.config_entries.async_update_entry = MagicMock()

    client = await hass_ws_client(mock_hass)
    await client.send_json(
        {
            "id": 7,
            "type": "meraki_ha/set_camera_mapping",
            "config_entry_id": CONFIG_ENTRY_ID,
            "meraki_camera_entity_id": "camera.meraki_office_camera",
            "linked_camera_entity_id": "camera.blue_iris_office",
        }
    )
    msg = await client.receive_json()
    assert msg["success"]
    assert msg["result"]["success"] is True

    # Verify the config entry was updated
    mock_hass.config_entries.async_update_entry.assert_called_once()


async def test_ws_get_rtsp_url(
    hass_ws_client, mock_hass, mock_entity_registry, mock_coordinator
):
    """Test get_rtsp_url websocket command."""
    with patch(
        "custom_components.meraki_ha.api.camera.er.async_get",
        return_value=mock_entity_registry,
        autospec=False,
    ):
        client = await hass_ws_client(mock_hass)
        await client.send_json(
            {
                "id": 8,
                "type": "meraki_ha/get_rtsp_url",
                "entity_id": "camera.meraki_office_camera",
            }
        )
        msg = await client.receive_json()
        assert msg["success"]
        assert msg["result"]["rtsp_url"] == "rtsp://192.168.1.100/live"

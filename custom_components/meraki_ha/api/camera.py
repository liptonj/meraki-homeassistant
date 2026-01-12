"""WebSocket API for Meraki Camera Card."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import entity_registry as er

from ..const import DOMAIN
from ..helpers.logging_helper import MerakiLoggers
from ..meraki_data_coordinator import MerakiDataCoordinator

_LOGGER = MerakiLoggers.CAMERA


@callback
def async_setup(hass: HomeAssistant) -> None:
    """Set up the camera WebSocket API."""
    websocket_api.async_register_command(hass, ws_get_camera_snapshot)
    websocket_api.async_register_command(hass, ws_get_camera_stream_url)
    websocket_api.async_register_command(hass, ws_get_available_cameras)
    websocket_api.async_register_command(hass, ws_get_camera_mappings)
    websocket_api.async_register_command(hass, ws_set_camera_mapping)
    websocket_api.async_register_command(hass, ws_get_rtsp_url)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "meraki_ha/get_camera_snapshot",
        vol.Required("entity_id"): str,
    }
)
@websocket_api.async_response
async def ws_get_camera_snapshot(
    hass: HomeAssistant,
    connection: websocket_api.connection.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Get a camera snapshot."""
    entity_id = msg["entity_id"]
    entity_registry = er.async_get(hass)
    entity = entity_registry.async_get(entity_id)
    if not entity:
        connection.send_error(msg["id"], "not_found", f"Entity not found: {entity_id}")
        return

    config_entry_id = entity.config_entry_id
    if not config_entry_id:
        connection.send_error(
            msg["id"], "not_found", f"Entity {entity_id} has no config entry"
        )
        return

    coordinator: MerakiDataCoordinator = hass.data[DOMAIN][config_entry_id]
    try:
        snapshot = await coordinator.api.camera.get_device_camera_video_link(
            serial=entity.unique_id,
        )
        connection.send_result(msg["id"], snapshot)
    except Exception as e:  # noqa: BLE001
        _LOGGER.error("Failed to get camera snapshot for %s: %s", entity_id, e)
        connection.send_error(msg["id"], "error", str(e))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "meraki_ha/get_camera_stream_url",
        vol.Required("entity_id"): str,
    }
)
@websocket_api.async_response
async def ws_get_camera_stream_url(
    hass: HomeAssistant,
    connection: websocket_api.connection.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Get a camera stream URL."""
    entity_id = msg["entity_id"]
    entity_registry = er.async_get(hass)
    entity = entity_registry.async_get(entity_id)
    if not entity:
        connection.send_error(msg["id"], "not_found", f"Entity not found: {entity_id}")
        return

    config_entry_id = entity.config_entry_id
    if not config_entry_id:
        connection.send_error(
            msg["id"], "not_found", f"Entity {entity_id} has no config entry"
        )
        return

    coordinator: MerakiDataCoordinator = hass.data[DOMAIN][config_entry_id]
    try:
        stream_url = await coordinator.api.camera.get_device_camera_video_link(
            serial=entity.unique_id,
        )
        connection.send_result(msg["id"], stream_url)
    except Exception as e:  # noqa: BLE001
        _LOGGER.error("Failed to get camera stream URL for %s: %s", entity_id, e)
        connection.send_error(msg["id"], "error", str(e))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "meraki_ha/get_available_cameras",
    }
)
@websocket_api.async_response
async def ws_get_available_cameras(
    hass: HomeAssistant,
    connection: websocket_api.connection.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Get a list of available camera entities."""
    entity_registry = er.async_get(hass)
    cameras = [
        {"entity_id": entity.entity_id, "name": entity.name or entity.original_name}
        for entity in entity_registry.entities.values()
        if entity.platform == "camera"
    ]
    connection.send_result(msg["id"], cameras)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "meraki_ha/get_camera_mappings",
        vol.Required("config_entry_id"): str,
    }
)
@websocket_api.async_response
async def ws_get_camera_mappings(
    hass: HomeAssistant,
    connection: websocket_api.connection.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Get camera mappings."""
    config_entry_id = msg["config_entry_id"]
    config_entry = hass.config_entries.async_get_entry(config_entry_id)
    if not config_entry:
        connection.send_error(
            msg["id"], "not_found", f"Config entry not found: {config_entry_id}"
        )
        return
    mappings = config_entry.options.get("camera_mappings", {})
    connection.send_result(msg["id"], mappings)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "meraki_ha/set_camera_mapping",
        vol.Required("config_entry_id"): str,
        vol.Required("meraki_camera_entity_id"): str,
        vol.Required("linked_camera_entity_id"): str,
    }
)
@websocket_api.async_response
async def ws_set_camera_mapping(
    hass: HomeAssistant,
    connection: websocket_api.connection.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Set a camera mapping."""
    config_entry_id = msg["config_entry_id"]
    config_entry = hass.config_entries.async_get_entry(config_entry_id)
    if not config_entry:
        connection.send_error(
            msg["id"], "not_found", f"Config entry not found: {config_entry_id}"
        )
        return

    meraki_camera_entity_id = msg["meraki_camera_entity_id"]
    linked_camera_entity_id = msg["linked_camera_entity_id"]

    current_options = dict(config_entry.options)
    mappings = current_options.get("camera_mappings", {})
    mappings[meraki_camera_entity_id] = linked_camera_entity_id
    current_options["camera_mappings"] = mappings

    hass.config_entries.async_update_entry(config_entry, options=current_options)
    connection.send_result(msg["id"], {"success": True})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "meraki_ha/get_rtsp_url",
        vol.Required("entity_id"): str,
    }
)
@websocket_api.async_response
async def ws_get_rtsp_url(
    hass: HomeAssistant,
    connection: websocket_api.connection.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Get the RTSP URL for a camera."""
    entity_id = msg["entity_id"]
    entity_registry = er.async_get(hass)
    entity = entity_registry.async_get(entity_id)
    if not entity:
        connection.send_error(msg["id"], "not_found", f"Entity not found: {entity_id}")
        return

    config_entry_id = entity.config_entry_id
    if not config_entry_id:
        connection.send_error(
            msg["id"], "not_found", f"Entity {entity_id} has no config entry"
        )
        return

    coordinator: MerakiDataCoordinator = hass.data[DOMAIN][config_entry_id]
    try:
        # Assuming the coordinator has access to the device data
        device = next(
            (
                d
                for d in coordinator.data.get("devices", [])
                if d.get("serial") == entity.unique_id
            ),
            None,
        )
        if device and "rtspUrl" in device:
            connection.send_result(msg["id"], {"rtsp_url": device["rtspUrl"]})
        else:
            _LOGGER.debug("RTSP URL not found for device %s", entity_id)
            connection.send_error(
                msg["id"], "not_found", "RTSP URL not found for this device."
            )
    except Exception as e:  # noqa: BLE001
        _LOGGER.error("Failed to get RTSP URL for %s: %s", entity_id, e)
        connection.send_error(msg["id"], "error", str(e))

"""REST API for the Meraki Home Assistant integration's Web UI."""

from __future__ import annotations

import json
import os
from collections.abc import Mapping
from typing import Any

import aiofiles
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from voluptuous import ALLOW_EXTRA, All, Optional, Required, Schema

from .const import (
    CONF_CAMERA_LINK_INTEGRATION,
    CONF_DASHBOARD_DEVICE_TYPE_FILTER,
    CONF_DASHBOARD_STATUS_FILTER,
    CONF_DASHBOARD_VIEW_MODE,
    CONF_ENABLE_MQTT,
    CONF_ENABLED_NETWORKS,
    CONF_SCAN_INTERVAL,
    CONF_TEMPERATURE_UNIT,
    DATA_CLIENT,
    DEFAULT_CAMERA_LINK_INTEGRATION,
    DEFAULT_DASHBOARD_DEVICE_TYPE_FILTER,
    DEFAULT_DASHBOARD_STATUS_FILTER,
    DEFAULT_DASHBOARD_VIEW_MODE,
    DEFAULT_ENABLE_MQTT,
    DEFAULT_SCAN_INTERVAL,
    DEFAULT_TEMPERATURE_UNIT,
    DOMAIN,
)
from .core.errors import MerakiError
from .core.timed_access_manager import TimedAccessManager
from .helpers.camera_mappings import (
    async_set_camera_pairing,
    list_linkable_cameras,
    mappings_as_entity_ids,
    resolve_camera_identity,
)
from .helpers.camera_mappings import (
    load_camera_mappings as _load_camera_mappings,
)
from .helpers.logging_helper import MerakiLoggers
from .meraki_data_coordinator import MerakiDataCoordinator
from .services.camera_service import CameraService

_LOGGER = MerakiLoggers.FRONTEND


def async_setup_api(hass: HomeAssistant) -> None:
    """
    Set up the Meraki Web UI API.

    Args:
    ----
        hass: The Home Assistant instance.

    """
    websocket_api.async_register_command(
        hass,
        "meraki_ha/get_config",
        handle_get_config,
        Schema(
            {
                Required("type"): All(str, "meraki_ha/get_config"),
                Required("config_entry_id"): str,
            },
            extra=ALLOW_EXTRA,
        ),
    )
    websocket_api.async_register_command(
        hass,
        "meraki_ha/subscribe_meraki_data",
        handle_subscribe_meraki_data,
        Schema(
            {
                Required("type"): All(str, "meraki_ha/subscribe_meraki_data"),
                Required("config_entry_id"): str,
            },
            extra=ALLOW_EXTRA,
        ),
    )
    websocket_api.async_register_command(
        hass,
        "meraki_ha/get_camera_stream_url",
        handle_get_camera_stream_url,
        Schema(
            {
                Required("type"): All(str, "meraki_ha/get_camera_stream_url"),
                Optional("config_entry_id"): str,
                Optional("serial"): str,
                Optional("entity_id"): str,
                Optional("stream_source"): str,  # "rtsp" or "cloud"
            },
            extra=ALLOW_EXTRA,
        ),
    )
    websocket_api.async_register_command(
        hass,
        "meraki_ha/get_camera_snapshot",
        handle_get_camera_snapshot,
        Schema(
            {
                Required("type"): All(str, "meraki_ha/get_camera_snapshot"),
                Optional("config_entry_id"): str,
                Optional("serial"): str,
                Optional("entity_id"): str,
            },
            extra=ALLOW_EXTRA,
        ),
    )
    websocket_api.async_register_command(
        hass,
        "meraki_ha/update_enabled_networks",
        handle_update_enabled_networks,
        Schema(
            {
                Required("type"): All(str, "meraki_ha/update_enabled_networks"),
                Required("config_entry_id"): str,
                Required("enabled_networks"): [str],
            },
            extra=ALLOW_EXTRA,
        ),
    )
    websocket_api.async_register_command(
        hass,
        "meraki_ha/create_timed_access_key",
        handle_create_timed_access_key,
        Schema(
            {
                Required("type"): All(str, "meraki_ha/create_timed_access_key"),
                Required("config_entry_id"): str,
                Required("network_id"): str,
                Required("ssid_number"): str,
                Required("name"): str,
                Required("passphrase"): str,
                Required("duration_hours"): int,
                Optional("group_policy_id"): str,
            },
            extra=ALLOW_EXTRA,
        ),
    )
    websocket_api.async_register_command(
        hass,
        "meraki_ha/get_camera_mappings",
        handle_get_camera_mappings,
        Schema(
            {
                Required("type"): All(str, "meraki_ha/get_camera_mappings"),
                Required("config_entry_id"): str,
            },
            extra=ALLOW_EXTRA,
        ),
    )
    websocket_api.async_register_command(
        hass,
        "meraki_ha/set_camera_mapping",
        handle_set_camera_mapping,
        Schema(
            {
                Required("type"): All(str, "meraki_ha/set_camera_mapping"),
                Optional("config_entry_id"): str,
                Optional("serial"): str,
                Optional("linked_entity_id"): str,  # Empty string to remove mapping
                Optional("meraki_camera_entity_id"): str,
                Optional("linked_camera_entity_id"): str,
            },
            extra=ALLOW_EXTRA,
        ),
    )
    websocket_api.async_register_command(
        hass,
        "meraki_ha/get_available_cameras",
        handle_get_available_cameras,
        Schema(
            {
                Required("type"): All(str, "meraki_ha/get_available_cameras"),
                Optional("integration_filter"): str,
            },
            extra=ALLOW_EXTRA,
        ),
    )
    websocket_api.async_register_command(
        hass,
        "meraki_ha/get_rtsp_url",
        handle_get_rtsp_url,
        Schema(
            {
                Required("type"): All(str, "meraki_ha/get_rtsp_url"),
                Optional("config_entry_id"): str,
                Optional("serial"): str,
                Optional("entity_id"): str,
            },
            extra=ALLOW_EXTRA,
        ),
    )


def _get_entry_data(hass: HomeAssistant, config_entry_id: str) -> dict[str, Any] | None:
    """Return integration entry data if it is a mapping."""
    entry_data = hass.data.get(DOMAIN, {}).get(config_entry_id)
    if isinstance(entry_data, dict):
        return entry_data
    return None


def _device_rtsp_url(device: Mapping[str, Any] | None) -> str | None:
    """Extract an RTSP URL from coordinator device data."""
    if not device:
        return None
    rtsp_url = device.get("rtsp_url") or device.get("rtspUrl")
    if isinstance(rtsp_url, str) and rtsp_url.startswith("rtsp://"):
        return rtsp_url
    video_settings = device.get("video_settings") or {}
    settings_url = video_settings.get("rtspUrl") or video_settings.get("rtsp_url")
    if isinstance(settings_url, str) and settings_url.startswith("rtsp://"):
        return settings_url
    return None


async def _async_frontend_payload(
    hass: HomeAssistant,
    config_entry_id: str,
) -> dict[str, Any] | None:
    """Build the panel payload including the enabled-network filter."""
    if config_entry_id not in hass.data[DOMAIN]:
        return None

    coordinator: MerakiDataCoordinator = hass.data[DOMAIN][config_entry_id][
        "coordinator"
    ]
    config_entry = hass.config_entries.async_get_entry(config_entry_id)
    if not config_entry:
        return None
    coordinator_data = coordinator.data or {}
    enabled_networks = config_entry.options.get(CONF_ENABLED_NETWORKS)
    if enabled_networks is None:
        enabled_networks = [
            n["id"] for n in coordinator_data.get("networks", []) if "id" in n
        ]

    manifest_path = os.path.join(os.path.dirname(__file__), "manifest.json")
    async with aiofiles.open(manifest_path) as f:
        contents = await f.read()
    manifest = json.loads(contents)
    version = manifest.get("version")

    dashboard_settings = {
        "dashboard_view_mode": config_entry.options.get(
            CONF_DASHBOARD_VIEW_MODE, DEFAULT_DASHBOARD_VIEW_MODE
        ),
        "dashboard_device_type_filter": config_entry.options.get(
            CONF_DASHBOARD_DEVICE_TYPE_FILTER, DEFAULT_DASHBOARD_DEVICE_TYPE_FILTER
        ),
        "dashboard_status_filter": config_entry.options.get(
            CONF_DASHBOARD_STATUS_FILTER, DEFAULT_DASHBOARD_STATUS_FILTER
        ),
        "camera_link_integration": config_entry.options.get(
            CONF_CAMERA_LINK_INTEGRATION, DEFAULT_CAMERA_LINK_INTEGRATION
        ),
        "temperature_unit": config_entry.options.get(
            CONF_TEMPERATURE_UNIT, DEFAULT_TEMPERATURE_UNIT
        ),
    }

    scan_interval = (
        int(coordinator.update_interval.total_seconds())
        if coordinator.update_interval
        else config_entry.options.get(CONF_SCAN_INTERVAL, DEFAULT_SCAN_INTERVAL)
    )
    last_updated = (
        coordinator.last_successful_update.isoformat()
        if coordinator.last_successful_update
        else None
    )

    mqtt_data: dict[str, Any] = {
        "enabled": config_entry.options.get(CONF_ENABLE_MQTT, DEFAULT_ENABLE_MQTT),
    }
    if mqtt_data["enabled"]:
        mqtt_service = hass.data[DOMAIN][config_entry_id].get("mqtt_service")
        mqtt_relay_manager = hass.data[DOMAIN][config_entry_id].get(
            "mqtt_relay_manager"
        )
        if mqtt_service:
            mqtt_data["stats"] = mqtt_service.get_statistics()
        if mqtt_relay_manager:
            mqtt_data["relay_destinations"] = mqtt_relay_manager.get_health_status()

    return {
        **coordinator_data,
        "enabled_networks": enabled_networks,
        "config_entry_id": config_entry_id,
        "version": version,
        "scan_interval": scan_interval,
        "last_updated": last_updated,
        "mqtt": mqtt_data,
        **dashboard_settings,
    }


@websocket_api.async_response
async def handle_get_config(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """
    Handle get_config command.

    Args:
    ----
        hass: The Home Assistant instance.
        connection: The WebSocket connection.
        msg: The WebSocket message.

    """
    payload = await _async_frontend_payload(hass, msg["config_entry_id"])
    if payload is None:
        connection.send_error(msg["id"], "not_found", "Config entry not found")
        return
    connection.send_result(msg["id"], payload)


@websocket_api.async_response
async def handle_subscribe_meraki_data(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Subscribe the panel to coordinator updates with network filtering."""
    config_entry_id = msg["config_entry_id"]
    payload = await _async_frontend_payload(hass, config_entry_id)
    if payload is None:
        connection.send_error(msg["id"], "not_found", "Config entry not found")
        return

    coordinator: MerakiDataCoordinator = hass.data[DOMAIN][config_entry_id][
        "coordinator"
    ]

    @callback
    def forward_data() -> None:
        """Push filtered coordinator data to the panel."""
        hass.async_create_task(_async_forward_data())

    async def _async_forward_data() -> None:
        """Send the latest filtered payload as a websocket event."""
        latest = await _async_frontend_payload(hass, config_entry_id)
        if latest is None:
            return
        connection.send_message(websocket_api.event_message(msg["id"], latest))

    connection.subscriptions[msg["id"]] = coordinator.async_add_listener(forward_data)
    connection.send_result(msg["id"])
    connection.send_message(websocket_api.event_message(msg["id"], payload))


@websocket_api.async_response
async def handle_get_camera_stream_url(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """
    Handle get_camera_stream_url command.

    Args:
    ----
        hass: The Home Assistant instance.
        connection: The WebSocket connection.
        msg: The WebSocket message containing:
            - config_entry_id: The config entry ID
            - serial: The camera serial number
            - stream_source (optional): "rtsp" or "cloud" to specify the stream type

    Note: Cloud URLs are Meraki Dashboard links meant for browser viewing.
    They cannot be used directly in Home Assistant's stream component.
    RTSP URLs can be used for direct video streaming if enabled on the camera.

    """
    config_entry_id, serial = resolve_camera_identity(
        hass,
        config_entry_id=msg.get("config_entry_id"),
        serial=msg.get("serial"),
        entity_id=msg.get("entity_id"),
    )
    stream_source = msg.get("stream_source")
    entry_data = _get_entry_data(hass, config_entry_id) if config_entry_id else None
    if not config_entry_id or entry_data is None or not serial:
        connection.send_error(msg["id"], "not_found", "Config entry not found")
        return

    camera_service: CameraService = entry_data["camera_service"]

    # If a specific stream source is requested, use that
    if stream_source == "cloud":
        stream_url = await camera_service.get_cloud_video_url(serial)
    elif stream_source == "rtsp":
        stream_url = await camera_service.get_rtsp_stream_url(serial)
    else:
        # Default: try cloud first, then fall back to RTSP
        stream_url = await camera_service.get_video_stream_url(serial)

    connection.send_result(msg["id"], {"url": stream_url})


@websocket_api.async_response
async def handle_get_camera_snapshot(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """
    Handle get_camera_snapshot command.

    Args:
    ----
        hass: The Home Assistant instance.
        connection: The WebSocket connection.
        msg: The WebSocket message.

    """
    config_entry_id, serial = resolve_camera_identity(
        hass,
        config_entry_id=msg.get("config_entry_id"),
        serial=msg.get("serial"),
        entity_id=msg.get("entity_id"),
    )
    entry_data = _get_entry_data(hass, config_entry_id) if config_entry_id else None
    if not config_entry_id or entry_data is None or not serial:
        connection.send_error(msg["id"], "not_found", "Config entry not found")
        return

    camera_service: CameraService = entry_data["camera_service"]
    snapshot_url = await camera_service.get_camera_snapshot(serial)
    connection.send_result(msg["id"], {"url": snapshot_url})


@websocket_api.async_response
async def handle_update_enabled_networks(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """
    Handle update_enabled_networks command.

    Args:
    ----
        hass: The Home Assistant instance.
        connection: The WebSocket connection.
        msg: The WebSocket message.

    """
    config_entry_id = msg["config_entry_id"]
    enabled_networks = msg["enabled_networks"]
    if config_entry_id not in hass.data[DOMAIN]:
        connection.send_error(msg["id"], "not_found", "Config entry not found")
        return

    config_entry = hass.config_entries.async_get_entry(config_entry_id)
    if not config_entry:
        connection.send_error(msg["id"], "not_found", "Config entry not found")
        return

    hass.config_entries.async_update_entry(
        config_entry,
        options={
            **config_entry.options,
            CONF_ENABLED_NETWORKS: enabled_networks,
        },
    )
    connection.send_result(msg["id"], {"success": True})


@websocket_api.async_response
async def handle_create_timed_access_key(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """
    Handle create_timed_access_key command.

    Args:
    ----
        hass: The Home Assistant instance.
        connection: The WebSocket connection.
        msg: The WebSocket message.

    """
    config_entry_id = msg["config_entry_id"]
    if config_entry_id not in hass.data[DOMAIN]:
        connection.send_error(msg["id"], "not_found", "Config entry not found")
        return

    api_client = hass.data[DOMAIN][config_entry_id][DATA_CLIENT]
    manager = TimedAccessManager(api_client)

    try:
        result = await manager.create_timed_access_key(
            network_id=msg["network_id"],
            ssid_number=msg["ssid_number"],
            name=msg["name"],
            passphrase=msg["passphrase"],
            duration_hours=msg["duration_hours"],
            group_policy_id=msg.get("group_policy_id"),
        )
        connection.send_result(msg["id"], result)
    except (ValueError, KeyError, TypeError) as e:
        _LOGGER.error("Invalid input for timed access key: %s", e)
        connection.send_error(msg["id"], "invalid_input", str(e))
    except MerakiError as e:
        _LOGGER.error("Meraki API error creating timed access key: %s", e)
        connection.send_error(msg["id"], "api_error", str(e))


@websocket_api.async_response
async def handle_get_camera_mappings(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """
    Get camera entity mappings (Meraki serial -> linked HA entity_id).

    This allows users to link Meraki cameras to other camera entities
    (e.g., Blue Iris cameras that receive the RTSP stream).
    """
    config_entry_id = msg["config_entry_id"]
    all_mappings = await _load_camera_mappings(hass)
    mappings = mappings_as_entity_ids(all_mappings.get(config_entry_id, {}))
    connection.send_result(msg["id"], {"mappings": mappings})


@websocket_api.async_response
async def handle_set_camera_mapping(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """
    Set a camera entity mapping (link Meraki camera to another HA camera).

    Args:
        serial: The Meraki camera serial number
        linked_entity_id: The HA entity_id to link to (e.g., camera.blue_iris_front)
                         Pass empty string to remove the mapping.
    """
    linked_entity_id = msg.get("linked_entity_id")
    if linked_entity_id is None:
        linked_entity_id = msg.get("linked_camera_entity_id", "")
    if not isinstance(linked_entity_id, str):
        linked_entity_id = ""
    meraki_camera_entity_id = msg.get("meraki_camera_entity_id")
    config_entry_id, serial = resolve_camera_identity(
        hass,
        config_entry_id=msg.get("config_entry_id"),
        serial=msg.get("serial"),
        entity_id=meraki_camera_entity_id,
    )

    if not serial:
        connection.send_error(
            msg["id"],
            "invalid_input",
            "serial or meraki_camera_entity_id is required",
        )
        return
    if not config_entry_id:
        connection.send_error(
            msg["id"],
            "invalid_input",
            "config_entry_id could not be resolved",
        )
        return

    mappings = await async_set_camera_pairing(
        hass, config_entry_id, serial, linked_entity_id
    )

    connection.send_result(
        msg["id"],
        {"success": True, "mappings": mappings},
    )


@websocket_api.async_response
async def handle_get_available_cameras(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """
    Get all available camera entities in Home Assistant.

    Returns a list of camera entities that can be linked to Meraki cameras.
    Excludes Meraki cameras themselves to avoid circular links.

    Args:
        integration_filter: Optional integration domain to filter cameras by
                           (e.g., 'blue_iris', 'generic'). Empty string shows all.
    """
    integration_filter = msg.get("integration_filter", "").lower().strip()
    camera_entities = list_linkable_cameras(hass, integration_filter)
    connection.send_result(msg["id"], {"cameras": camera_entities})


@websocket_api.async_response
async def handle_get_rtsp_url(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return the RTSP URL for a Meraki camera.

    Accepts either ``config_entry_id`` + ``serial`` (panel) or ``entity_id``
    (Lovelace camera card).
    """
    config_entry_id, serial = resolve_camera_identity(
        hass,
        config_entry_id=msg.get("config_entry_id"),
        serial=msg.get("serial"),
        entity_id=msg.get("entity_id"),
    )
    entry_data = _get_entry_data(hass, config_entry_id) if config_entry_id else None
    if not config_entry_id or entry_data is None or not serial:
        connection.send_error(msg["id"], "not_found", "Camera not found")
        return

    coordinator: MerakiDataCoordinator = entry_data["coordinator"]
    device = coordinator.get_device(serial)
    rtsp_url = _device_rtsp_url(device)
    if rtsp_url:
        connection.send_result(msg["id"], {"rtsp_url": rtsp_url})
        return

    _LOGGER.debug("RTSP URL not found for camera %s", serial)
    connection.send_error(msg["id"], "not_found", "RTSP URL not found for this device.")

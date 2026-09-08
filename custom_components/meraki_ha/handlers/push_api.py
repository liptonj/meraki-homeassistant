"""Handlers for Meraki Push API messages."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

from ..const import (
    PUSH_TOPIC_CONFIG_CHANGES,
    PUSH_TOPIC_DEVICE_AVAILABILITY,
)
from ..helpers.logging_helper import MerakiLoggers

if TYPE_CHECKING:
    from ..meraki_data_coordinator import MerakiDataCoordinator


_LOGGER = MerakiLoggers.ALERTS

_OFFLINE_STATUSES = {"offline", "down", "unreachable", "disconnected"}


def _profile_iname(data: dict[str, Any]) -> str | None:
    """Return the push profile iname from a message envelope."""
    meta = data.get("meta")
    if not isinstance(meta, dict):
        return None
    source = meta.get("source")
    if not isinstance(source, dict):
        return None
    profile = source.get("profile")
    if isinstance(profile, dict):
        iname = profile.get("iname")
        if isinstance(iname, str):
            return iname
    return None


def _infer_topic(data: dict[str, Any]) -> str | None:
    """Infer which Push topic a message belongs to."""
    explicit = data.get("topic")
    if isinstance(explicit, str) and explicit and explicit != "heartbeat":
        return explicit

    iname = _profile_iname(data) or ""
    iname_lower = iname.lower()
    if "configurationchanges" in iname_lower or "config" in iname_lower:
        return PUSH_TOPIC_CONFIG_CHANGES
    if "availabilit" in iname_lower:
        return PUSH_TOPIC_DEVICE_AVAILABILITY
    return None


def _item_serial(item: dict[str, Any]) -> str | None:
    """Extract a device serial from a Push API item."""
    serial = item.get("serial") or item.get("deviceSerial")
    if isinstance(serial, str) and serial:
        return serial
    device = item.get("device")
    if isinstance(device, dict):
        nested = device.get("serial")
        if isinstance(nested, str) and nested:
            return nested
    return None


def _item_status(item: dict[str, Any]) -> str | None:
    """Extract an availability status string from a Push API item."""
    status = item.get("status") or item.get("availability")
    if isinstance(status, dict):
        nested = status.get("status") or status.get("value")
        return str(nested) if nested is not None else None
    if status is not None:
        return str(status)
    details = item.get("details")
    if isinstance(details, list):
        for detail in details:
            if isinstance(detail, dict) and detail.get("name") in {
                "status",
                "availability",
            }:
                value = detail.get("value")
                if value is not None:
                    return str(value)
    return None


def _item_network_id(item: dict[str, Any]) -> str | None:
    """Extract a network ID from a Push API item."""
    network_id = item.get("networkId")
    if isinstance(network_id, str) and network_id:
        return network_id
    network = item.get("network")
    if isinstance(network, dict):
        nested = network.get("id")
        if isinstance(nested, str) and nested:
            return nested
    return None


async def async_handle_push_message(
    coordinator: MerakiDataCoordinator,
    data: dict[str, Any],
) -> None:
    """Handle a Push API data message (not a heartbeat).

    Parameters
    ----------
    coordinator : MerakiDataCoordinator
        Integration data coordinator.
    data : dict[str, Any]
        Parsed Push API JSON body.

    """
    if data.get("topic") == "heartbeat":
        _LOGGER.debug("Push API heartbeat received")
        return

    items = data.get("items")
    if not isinstance(items, list):
        _LOGGER.debug("Push API message had no items: %s", data)
        return

    topic = _infer_topic(data)
    _LOGGER.debug(
        "Handling Push API message topic=%s items=%d",
        topic,
        len(items),
    )

    for item in items:
        if not isinstance(item, dict):
            continue
        item_topic = _extract_topic_id(item) or topic
        if item_topic == PUSH_TOPIC_DEVICE_AVAILABILITY:
            await _handle_availability_item(coordinator, item)
        elif item_topic == PUSH_TOPIC_CONFIG_CHANGES:
            await _handle_config_change_item(coordinator, item)
        else:
            await _handle_generic_item(coordinator, item)


def _extract_topic_id(item: dict[str, Any]) -> str | None:
    """Return a topic id if an item carries one."""
    topic = item.get("topic") or item.get("topicId")
    if isinstance(topic, str) and topic:
        return topic
    return None


async def _handle_availability_item(
    coordinator: MerakiDataCoordinator,
    item: dict[str, Any],
) -> None:
    """Update device online/offline state from an availability item."""
    serial = _item_serial(item)
    if not serial:
        _LOGGER.debug("Availability item missing serial: %s", item)
        return

    status = _item_status(item)
    is_online = True
    if status:
        is_online = status.lower() not in _OFFLINE_STATUSES

    coordinator.add_alert_to_history(
        alert_type="Device availability changed",
        category="device",
        data={
            "deviceSerial": serial,
            "deviceName": item.get("name") or serial,
            "networkId": _item_network_id(item),
            "occurredAt": item.get("ts") or item.get("occurredAt"),
            "status": status,
        },
    )
    coordinator._update_device_status_immediate(serial, is_online)
    coordinator.async_update_listeners()
    coordinator.hass.async_create_task(
        coordinator._targeted_device_refresh(serial, delay=5)
    )


async def _handle_config_change_item(
    coordinator: MerakiDataCoordinator,
    item: dict[str, Any],
) -> None:
    """Refresh network/SSID data after a configuration change."""
    network_id = _item_network_id(item)
    page = str(item.get("page") or item.get("label") or "").lower()

    coordinator.add_alert_to_history(
        alert_type="Configuration changed",
        category="network",
        data={
            "networkId": network_id,
            "networkName": item.get("networkName"),
            "page": item.get("page"),
            "label": item.get("label"),
            "occurredAt": item.get("ts") or item.get("occurredAt"),
            "adminName": item.get("adminName"),
        },
    )

    if not network_id:
        _LOGGER.debug("Config change item missing network id: %s", item)
        return

    if "ssid" in page or "wireless" in page:
        coordinator.hass.async_create_task(
            coordinator._targeted_ssid_refresh(network_id)
        )
    else:
        coordinator.hass.async_create_task(
            coordinator._targeted_network_refresh(network_id)
        )


async def _handle_generic_item(
    coordinator: MerakiDataCoordinator,
    item: dict[str, Any],
) -> None:
    """Best-effort refresh for topics we do not map yet."""
    serial = _item_serial(item)
    network_id = _item_network_id(item)
    if serial:
        coordinator.hass.async_create_task(
            coordinator._targeted_device_refresh(serial, delay=5)
        )
        return
    if network_id:
        coordinator.hass.async_create_task(
            coordinator._targeted_network_refresh(network_id)
        )

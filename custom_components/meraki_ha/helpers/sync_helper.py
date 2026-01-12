"""Helpers for bidirectional data synchronization."""

from __future__ import annotations

from typing import TYPE_CHECKING

from homeassistant.helpers import device_registry as dr
from homeassistant.helpers.device_registry import CONNECTION_NETWORK_MAC

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant


def find_root_device(
    device_registry: dr.DeviceRegistry,
    device: dr.DeviceEntry,
) -> dr.DeviceEntry:
    """Find the root/parent device in a hierarchy."""
    current = device
    visited = set()  # Prevent infinite loops

    while current.via_device_id and current.id not in visited:
        visited.add(current.id)
        parent = device_registry.async_get(current.via_device_id)
        if parent:
            current = parent
        else:
            break
    return current


def build_client_description(
    hass: HomeAssistant,
    client_mac: str,
) -> str | None:
    """Build a description from a Home Assistant device."""
    device_registry = dr.async_get(hass)
    ha_device = None
    for device in device_registry.devices.values():
        for conn_type, conn_id in device.connections:
            if (
                conn_type == CONNECTION_NETWORK_MAC
                and conn_id.lower() == client_mac.lower()
            ):
                ha_device = device
                break
    if not ha_device:
        return None

    root_device = find_root_device(device_registry, ha_device)
    parts = []
    if root_device.name:
        parts.append(root_device.name)
    if root_device.model:
        parts.append(f"({root_device.model})")
    if root_device.sw_version:
        parts.append(f"[{root_device.sw_version}]")

    return " ".join(parts) if parts else None

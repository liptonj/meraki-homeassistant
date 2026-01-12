"""Helpers for bidirectional data synchronization."""

from __future__ import annotations

from typing import TYPE_CHECKING

from homeassistant.helpers import device_registry as dr
from homeassistant.helpers.device_registry import CONNECTION_NETWORK_MAC

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant


def _find_root_device(
    device_registry: dr.DeviceRegistry,
    device: dr.DeviceEntry,
) -> dr.DeviceEntry:
    """Find the root/parent device in a hierarchy."""
    current = device
    visited = set()
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
    include_model: bool,
    include_version: bool,
) -> str | None:
    """Build description from HA device, using root device for hierarchies."""
    device_registry = dr.async_get(hass)
    ha_device = device_registry.async_get_device(
        connections={(CONNECTION_NETWORK_MAC, client_mac)}
    )

    if not ha_device:
        return None

    root_device = _find_root_device(device_registry, ha_device)

    parts = []
    if root_device.name:
        parts.append(root_device.name)
    if include_model and root_device.model:
        parts.append(f"({root_device.model})")
    if include_version and root_device.sw_version:
        parts.append(f"[{root_device.sw_version}]")

    return " ".join(parts) if parts else None

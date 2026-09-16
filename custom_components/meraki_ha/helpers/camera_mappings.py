"""Helpers for Meraki camera pairing mappings.

Camera pairing links a Meraki MV camera (by serial) to another Home Assistant
camera entity such as Blue Iris. The linked camera becomes the visible camera
on the Meraki device so Home Assistant does not show duplicate feeds.
Mappings are stored in a dedicated file so updates do not reload the config
entry.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import TYPE_CHECKING, Any, cast

import aiofiles
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.entity_registry import RegistryEntryHider

from ..const import CAMERA_MAPPINGS_STORAGE, CAMERA_UNIQUE_ID_SUFFIX, DOMAIN
from .logging_helper import MerakiLoggers

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

_LOGGER = MerakiLoggers.MAIN

CameraMappingValue = str | dict[str, Any]
CameraMappings = dict[str, dict[str, CameraMappingValue]]


def camera_serial_from_unique_id(unique_id: str | None) -> str | None:
    """Extract the device serial from a Meraki camera unique ID.

    Parameters
    ----------
    unique_id : str or None
        Entity unique ID, typically ``{serial}-camera``.

    Returns
    -------
    str or None
        The device serial, or the original unique ID if it has no suffix.
    """
    if not unique_id:
        return None
    if unique_id.endswith(CAMERA_UNIQUE_ID_SUFFIX):
        return unique_id[: -len(CAMERA_UNIQUE_ID_SUFFIX)]
    return unique_id


def get_camera_mappings_path(hass: HomeAssistant) -> Path:
    """Return the path to the camera mappings storage file."""
    return Path(hass.config.path(".storage")) / CAMERA_MAPPINGS_STORAGE


async def load_camera_mappings(hass: HomeAssistant) -> CameraMappings:
    """Load camera mappings from storage.

    Returns
    -------
    dict
        Mapping of config entry ID to ``{serial: linked entity or pairing record}``.
    """
    storage_path = get_camera_mappings_path(hass)
    if not storage_path.exists():
        return {}
    try:
        async with aiofiles.open(storage_path) as f:
            content = await f.read()
            loaded = json.loads(content) if content else {}
    except (json.JSONDecodeError, OSError) as e:
        _LOGGER.warning("Failed to load camera mappings: %s", e)
        return {}
    if not isinstance(loaded, dict):
        _LOGGER.warning("Camera mappings file is not a JSON object")
        return {}
    return cast(CameraMappings, loaded)


async def save_camera_mappings(hass: HomeAssistant, mappings: CameraMappings) -> None:
    """Save camera mappings to storage."""
    storage_path = get_camera_mappings_path(hass)
    try:
        storage_path.parent.mkdir(parents=True, exist_ok=True)
        async with aiofiles.open(storage_path, "w") as f:
            await f.write(json.dumps(mappings, indent=2))
    except OSError as e:
        _LOGGER.error("Failed to save camera mappings: %s", e)


def mapping_entity_id(value: object) -> str | None:
    """Return the linked camera entity ID from a stored mapping value."""
    if isinstance(value, str):
        return value or None
    if isinstance(value, dict):
        entity_id = value.get("entity_id")
        if isinstance(entity_id, str) and entity_id:
            return entity_id
    return None


def mapping_original_device_id(value: object) -> str | None:
    """Return the original device ID stored with a pairing record."""
    if isinstance(value, dict):
        original = value.get("original_device_id")
        if isinstance(original, str) and original:
            return original
    return None


def mappings_as_entity_ids(
    entry_mappings: dict[str, CameraMappingValue],
) -> dict[str, str]:
    """Normalize stored pairings to ``{serial: linked_entity_id}``."""
    result: dict[str, str] = {}
    for serial, value in entry_mappings.items():
        entity_id = mapping_entity_id(value)
        if entity_id:
            result[serial] = entity_id
    return result


def pairing_record(
    linked_entity_id: str, original_device_id: str | None
) -> dict[str, str]:
    """Build a pairing record for storage."""
    record = {"entity_id": linked_entity_id}
    if original_device_id:
        record["original_device_id"] = original_device_id
    return record


def resolve_camera_identity(
    hass: HomeAssistant,
    *,
    config_entry_id: str | None = None,
    serial: str | None = None,
    entity_id: str | None = None,
) -> tuple[str | None, str | None]:
    """Resolve ``(config_entry_id, serial)`` from pairing identifiers.

    Accepts the panel schema (``config_entry_id`` + ``serial``) and the
    Lovelace camera-card schema (``entity_id`` / ``meraki_camera_entity_id``).

    Parameters
    ----------
    hass : HomeAssistant
        Home Assistant instance.
    config_entry_id : str, optional
        Config entry ID if already known.
    serial : str, optional
        Meraki device serial if already known.
    entity_id : str, optional
        Meraki camera entity ID used to look up serial and config entry.

    Returns
    -------
    tuple
        ``(config_entry_id, serial)``, either of which may still be None.
    """
    if entity_id and (not serial or not config_entry_id):
        entity = er.async_get(hass).async_get(entity_id)
        if entity:
            if not serial:
                serial = camera_serial_from_unique_id(entity.unique_id)
            if not config_entry_id:
                config_entry_id = entity.config_entry_id
    return config_entry_id, serial


def _meraki_camera_entity_id(hass: HomeAssistant, serial: str) -> str | None:
    """Return the Meraki camera entity ID for a device serial."""
    return er.async_get(hass).async_get_entity_id(
        "camera", DOMAIN, f"{serial}{CAMERA_UNIQUE_ID_SUFFIX}"
    )


def apply_camera_pairing(
    hass: HomeAssistant,
    serial: str,
    linked_entity_id: str,
) -> str | None:
    """Make the linked camera the only visible camera for this Meraki device.

    Hides the native Meraki camera entity and attaches the linked camera to
    the Meraki device so Home Assistant shows a single feed.

    Returns
    -------
    str or None
        The linked camera's previous device ID, used to restore on unpair.
    """
    entity_registry = er.async_get(hass)
    meraki_entity_id = _meraki_camera_entity_id(hass, serial)
    if meraki_entity_id:
        meraki_entity = entity_registry.async_get(meraki_entity_id)
        if meraki_entity is not None and meraki_entity.hidden_by is None:
            entity_registry.async_update_entity(
                meraki_entity_id,
                hidden_by=RegistryEntryHider.INTEGRATION,
            )

    original_device_id: str | None = None
    linked_entity = entity_registry.async_get(linked_entity_id)
    meraki_device = dr.async_get(hass).async_get_device(identifiers={(DOMAIN, serial)})
    if linked_entity is not None:
        original_device_id = linked_entity.device_id
        if meraki_device is not None and linked_entity.device_id != meraki_device.id:
            entity_registry.async_update_entity(
                linked_entity_id,
                device_id=meraki_device.id,
            )
    _LOGGER.debug(
        "Paired Meraki camera %s to %s (device %s)",
        serial,
        linked_entity_id,
        meraki_device.id if meraki_device is not None else "unknown",
    )
    return original_device_id


def clear_camera_pairing(
    hass: HomeAssistant,
    serial: str,
    linked_entity_id: str | None,
    original_device_id: str | None,
) -> None:
    """Undo pairing so the Meraki camera is visible again."""
    entity_registry = er.async_get(hass)
    meraki_entity_id = _meraki_camera_entity_id(hass, serial)
    if meraki_entity_id:
        meraki_entity = entity_registry.async_get(meraki_entity_id)
        if (
            meraki_entity is not None
            and meraki_entity.hidden_by == RegistryEntryHider.INTEGRATION
        ):
            entity_registry.async_update_entity(meraki_entity_id, hidden_by=None)

    if linked_entity_id:
        linked_entity = entity_registry.async_get(linked_entity_id)
        if linked_entity is not None:
            entity_registry.async_update_entity(
                linked_entity_id,
                device_id=original_device_id,
            )
    _LOGGER.debug("Cleared camera pairing for Meraki camera %s", serial)


async def apply_stored_camera_pairings(
    hass: HomeAssistant, config_entry_id: str
) -> None:
    """Re-apply saved pairings after Home Assistant starts or reloads."""
    all_mappings = await load_camera_mappings(hass)
    entry_mappings = all_mappings.get(config_entry_id, {})
    for serial, value in entry_mappings.items():
        linked_entity_id = mapping_entity_id(value)
        if linked_entity_id:
            apply_camera_pairing(hass, serial, linked_entity_id)

"""Helpers for Meraki camera pairing mappings.

Camera pairing links a Meraki MV camera (by serial) to another Home Assistant
camera entity such as Blue Iris. Mappings are stored in a dedicated file so
updates do not reload the config entry.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import TYPE_CHECKING

import aiofiles
from homeassistant.helpers import entity_registry as er

from ..const import CAMERA_MAPPINGS_STORAGE, CAMERA_UNIQUE_ID_SUFFIX
from .logging_helper import MerakiLoggers

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

_LOGGER = MerakiLoggers.MAIN


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


async def load_camera_mappings(hass: HomeAssistant) -> dict[str, dict[str, str]]:
    """Load camera mappings from storage.

    Returns
    -------
    dict
        Mapping of config entry ID to ``{serial: linked_entity_id}``.
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
    return loaded


async def save_camera_mappings(
    hass: HomeAssistant, mappings: dict[str, dict[str, str]]
) -> None:
    """Save camera mappings to storage."""
    storage_path = get_camera_mappings_path(hass)
    try:
        storage_path.parent.mkdir(parents=True, exist_ok=True)
        async with aiofiles.open(storage_path, "w") as f:
            await f.write(json.dumps(mappings, indent=2))
    except OSError as e:
        _LOGGER.error("Failed to save camera mappings: %s", e)


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

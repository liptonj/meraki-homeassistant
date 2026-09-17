"""The select platform for the Meraki integration."""

from __future__ import annotations

import asyncio
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity import Entity
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from ..const import DOMAIN, ENTITY_CHUNK_DELAY, ENTITY_CHUNK_SIZE
from ..helpers.logging_helper import MerakiLoggers
from .camera_link import MerakiCameraLinkSelect

_LOGGER = MerakiLoggers.SWITCH


def _is_camera_device(device: dict[str, Any]) -> bool:
    """Return True when coordinator device data represents an MV camera."""
    product_type = str(device.get("productType", "")).lower()
    model = str(device.get("model", "")).upper()
    return product_type.startswith("camera") or model.startswith("MV")


async def async_setup_entry(
    hass: HomeAssistant,
    config_entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the Meraki select entities."""
    entry_data = hass.data[DOMAIN][config_entry.entry_id]
    coordinator = entry_data["coordinator"]

    if coordinator.data:
        select_entities: list[Entity] = []
        for device in coordinator.data.get("devices", []):
            if _is_camera_device(device):
                select_entities.append(
                    MerakiCameraLinkSelect(coordinator, config_entry, device)
                )

        if select_entities:
            _LOGGER.debug("Adding %d select entities", len(select_entities))
            for i in range(0, len(select_entities), ENTITY_CHUNK_SIZE):
                chunk = select_entities[i : i + ENTITY_CHUNK_SIZE]
                async_add_entities(chunk)
                if len(select_entities) > ENTITY_CHUNK_SIZE:
                    await asyncio.sleep(ENTITY_CHUNK_DELAY)

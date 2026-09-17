"""Select entity for pairing a Meraki MV camera to another HA camera."""

from __future__ import annotations

from collections.abc import Mapping
from typing import Any

from homeassistant.components.select import SelectEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import EntityCategory
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from ..const import CAMERA_LINK_NONE, CAMERA_LINK_UNIQUE_ID_SUFFIX
from ..helpers.camera_mappings import (
    async_set_camera_pairing,
    list_linkable_cameras,
    load_camera_mappings,
    mapping_entity_id,
)
from ..helpers.device_info_helpers import resolve_device_info
from ..helpers.logging_helper import MerakiLoggers
from ..meraki_data_coordinator import MerakiDataCoordinator

_LOGGER = MerakiLoggers.SWITCH


class MerakiCameraLinkSelect(CoordinatorEntity, SelectEntity):  # type: ignore[type-arg,misc]
    """Configuration select that links an MV camera to another HA camera."""

    coordinator: MerakiDataCoordinator
    _attr_has_entity_name = True
    _attr_entity_category = EntityCategory.CONFIG
    _attr_icon = "mdi:video-switch"
    _attr_name = "Linked camera"
    _attr_translation_key = "linked_camera"

    def __init__(
        self,
        coordinator: MerakiDataCoordinator,
        config_entry: ConfigEntry,
        device_data: Mapping[str, Any],
    ) -> None:
        """Initialize the linked-camera select."""
        super().__init__(coordinator)
        self._config_entry = config_entry
        self._device_data = device_data
        self._serial = str(device_data["serial"])
        self._attr_unique_id = f"{self._serial}{CAMERA_LINK_UNIQUE_ID_SUFFIX}"
        self._current_linked: str | None = None

    @property
    def device_info(self) -> DeviceInfo | None:
        """Return device information for the Meraki camera."""
        return resolve_device_info(
            entity_data=self._device_data,
            config_entry=self._config_entry,
            hass=self.hass,
        )

    @property
    def available(self) -> bool:
        """Return True when the coordinator has device data."""
        return super().available and self.coordinator.data is not None

    @property
    def options(self) -> list[str]:
        """Return pairing choices, including Blue Iris cameras."""
        cameras = list_linkable_cameras(self.hass)
        entity_ids = [camera["entity_id"] for camera in cameras]
        if self._current_linked and self._current_linked not in entity_ids:
            entity_ids.insert(0, self._current_linked)
        return [CAMERA_LINK_NONE, *entity_ids]

    @property
    def current_option(self) -> str | None:
        """Return the currently paired camera, or Not linked."""
        return self._current_linked or CAMERA_LINK_NONE

    async def async_added_to_hass(self) -> None:
        """Load the stored pairing when the entity is added."""
        await super().async_added_to_hass()
        await self._async_refresh_current()

    async def async_select_option(self, option: str) -> None:
        """Pair or unpair the MV camera."""
        linked_entity_id = "" if option == CAMERA_LINK_NONE else option
        await async_set_camera_pairing(
            self.hass,
            self._config_entry.entry_id,
            self._serial,
            linked_entity_id,
        )
        self._current_linked = linked_entity_id or None
        _LOGGER.debug(
            "Linked camera for %s set to %s",
            self._serial,
            linked_entity_id or CAMERA_LINK_NONE,
        )
        self.async_write_ha_state()

    def apply_linked_state(self, linked_entity_id: str | None) -> None:
        """Update current option after a pairing change from any UI."""
        self._current_linked = linked_entity_id or None
        self.async_write_ha_state()

    async def _async_refresh_current(self) -> None:
        """Load the current pairing from storage."""
        mappings = await load_camera_mappings(self.hass)
        entry_mappings = mappings.get(self._config_entry.entry_id, {})
        self._current_linked = mapping_entity_id(entry_mappings.get(self._serial))

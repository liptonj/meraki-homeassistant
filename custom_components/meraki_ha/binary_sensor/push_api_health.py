"""Push API health diagnostic binary sensor."""

from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING, Any

from homeassistant.components.binary_sensor import (
    BinarySensorDeviceClass,
    BinarySensorEntity,
)
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.entity import EntityCategory
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from ..const import DOMAIN

if TYPE_CHECKING:
    from homeassistant.config_entries import ConfigEntry

    from ..meraki_data_coordinator import MerakiDataCoordinator
    from ..services.push_api import PushApiManager


class MerakiPushApiHealthSensor(CoordinatorEntity, BinarySensorEntity):
    """Binary sensor showing Push API registration and heartbeat health."""

    _attr_device_class = BinarySensorDeviceClass.CONNECTIVITY
    _attr_entity_category = EntityCategory.DIAGNOSTIC
    _attr_has_entity_name = True
    coordinator: MerakiDataCoordinator

    def __init__(
        self,
        coordinator: MerakiDataCoordinator,
        config_entry: ConfigEntry,
        push_manager: PushApiManager,
    ) -> None:
        """Initialize the Push API health sensor.

        Parameters
        ----------
        coordinator : MerakiDataCoordinator
            Data coordinator.
        config_entry : ConfigEntry
            Config entry.
        push_manager : PushApiManager
            Push API manager.

        """
        super().__init__(coordinator)
        self._config_entry = config_entry
        self._push_manager = push_manager
        self._attr_unique_id = f"{config_entry.entry_id}_push_api_health"
        self._attr_name = "Push API health"

    @property
    def is_on(self) -> bool:
        """Return True if Push API is registered and recently received data."""
        status = self._push_manager.status.get("status")
        return status == "active"

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Return diagnostic attributes."""
        info = self._push_manager.status
        last_received = info.get("last_received")
        last_dt = None
        if isinstance(last_received, str):
            try:
                last_dt = datetime.fromisoformat(last_received)
            except ValueError:
                last_dt = None
        freshness = None
        if last_dt is not None:
            freshness = int((datetime.now() - last_dt).total_seconds())
        return {
            "status": info.get("status"),
            "status_message": info.get("message"),
            "subscribed_topics": info.get("subscribed_topics", []),
            "available_topics": info.get("available_topics", []),
            "skipped_topics": info.get("skipped_topics", []),
            "messages_received": info.get("messages_received", 0),
            "last_received": last_received,
            "freshness_seconds": freshness,
            "errors": info.get("errors", []),
        }

    @property
    def device_info(self) -> DeviceInfo:
        """Return device info for the organization."""
        org_id = self.coordinator.api.organization_id
        return DeviceInfo(
            identifiers={(DOMAIN, f"org_{org_id}")},
            name=self._config_entry.data.get("org_name", f"Meraki Org {org_id}"),
            manufacturer="Cisco Meraki",
            model="Organization",
        )

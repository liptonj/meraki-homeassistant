"""Tests for Meraki camera pairing helpers."""

from unittest.mock import MagicMock, patch

from homeassistant.core import HomeAssistant

from custom_components.meraki_ha.helpers.camera_mappings import (
    camera_serial_from_unique_id,
    resolve_camera_identity,
)


def test_camera_serial_from_unique_id_strips_suffix() -> None:
    """Test serial is extracted from the camera unique ID suffix."""
    assert camera_serial_from_unique_id("Q2GV-XXXX-camera") == "Q2GV-XXXX"


def test_camera_serial_from_unique_id_passthrough() -> None:
    """Test unique IDs without the suffix are returned unchanged."""
    assert camera_serial_from_unique_id("Q2GV-XXXX") == "Q2GV-XXXX"


def test_camera_serial_from_unique_id_none() -> None:
    """Test None unique IDs return None."""
    assert camera_serial_from_unique_id(None) is None


def test_resolve_camera_identity_from_entity(hass: HomeAssistant) -> None:
    """Test entity ID resolves both config entry and serial."""
    entity = MagicMock()
    entity.unique_id = "Q234-CAM1-camera"
    entity.config_entry_id = "entry-1"
    registry = MagicMock()
    registry.async_get.return_value = entity

    with patch(
        "custom_components.meraki_ha.helpers.camera_mappings.er.async_get",
        return_value=registry,
    ):
        config_entry_id, serial = resolve_camera_identity(
            hass, entity_id="camera.meraki_office"
        )

    assert config_entry_id == "entry-1"
    assert serial == "Q234-CAM1"


def test_resolve_camera_identity_prefers_explicit_values(
    hass: HomeAssistant,
) -> None:
    """Test explicit serial and entry ID are not overwritten."""
    config_entry_id, serial = resolve_camera_identity(
        hass,
        config_entry_id="entry-1",
        serial="Q234-CAM1",
    )
    assert config_entry_id == "entry-1"
    assert serial == "Q234-CAM1"

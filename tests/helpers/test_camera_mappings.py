"""Tests for Meraki camera pairing helpers."""

from unittest.mock import MagicMock, patch

from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_registry import RegistryEntryHider

from custom_components.meraki_ha.helpers.camera_mappings import (
    apply_camera_pairing,
    apply_stored_camera_pairings,
    async_set_camera_pairing,
    camera_serial_from_unique_id,
    clear_camera_pairing,
    list_linkable_cameras,
    mapping_entity_id,
    mappings_as_entity_ids,
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


def test_mapping_entity_id_accepts_legacy_string() -> None:
    """Test legacy serial→entity_id strings still resolve."""
    assert mapping_entity_id("camera.blue_iris_front") == "camera.blue_iris_front"
    assert mapping_entity_id("") is None


def test_mapping_entity_id_accepts_pairing_object() -> None:
    """Test pairing records store entity ID plus original device."""
    assert (
        mapping_entity_id(
            {
                "entity_id": "camera.blue_iris_front",
                "original_device_id": "dev-1",
            }
        )
        == "camera.blue_iris_front"
    )


def test_mappings_as_entity_ids_normalizes_mixed_storage() -> None:
    """Test websocket payloads stay serial→entity_id maps."""
    assert mappings_as_entity_ids(
        {
            "Q2GV-1": "camera.legacy",
            "Q2GV-2": {
                "entity_id": "camera.blue_iris",
                "original_device_id": "dev-1",
            },
            "Q2GV-3": {"entity_id": ""},
        }
    ) == {
        "Q2GV-1": "camera.legacy",
        "Q2GV-2": "camera.blue_iris",
    }


def test_apply_camera_pairing_hides_meraki_and_moves_linked(
    hass: HomeAssistant,
) -> None:
    """Test pairing hides the Meraki camera and attaches the linked camera."""
    meraki_entity = MagicMock()
    meraki_entity.hidden_by = None
    linked_entity = MagicMock()
    linked_entity.device_id = "blue-iris-device"
    meraki_device = MagicMock()
    meraki_device.id = "meraki-device"

    entity_registry = MagicMock()
    entity_registry.async_get_entity_id.return_value = "camera.meraki_front"
    entity_registry.async_get.side_effect = lambda entity_id: {
        "camera.meraki_front": meraki_entity,
        "camera.blue_iris_front": linked_entity,
    }.get(entity_id)

    device_registry = MagicMock()
    device_registry.async_get_device.return_value = meraki_device

    with (
        patch(
            "custom_components.meraki_ha.helpers.camera_mappings.er.async_get",
            return_value=entity_registry,
        ),
        patch(
            "custom_components.meraki_ha.helpers.camera_mappings.dr.async_get",
            return_value=device_registry,
        ),
    ):
        original = apply_camera_pairing(hass, "Q2GV-XXXX", "camera.blue_iris_front")

    assert original == "blue-iris-device"
    entity_registry.async_update_entity.assert_any_call(
        "camera.meraki_front",
        hidden_by=RegistryEntryHider.INTEGRATION,
    )
    entity_registry.async_update_entity.assert_any_call(
        "camera.blue_iris_front",
        device_id="meraki-device",
    )


def test_clear_camera_pairing_restores_meraki_and_linked_device(
    hass: HomeAssistant,
) -> None:
    """Test unpairing unhides the Meraki camera and restores the linked device."""
    meraki_entity = MagicMock()
    meraki_entity.hidden_by = RegistryEntryHider.INTEGRATION
    linked_entity = MagicMock()
    linked_entity.device_id = "meraki-device"

    entity_registry = MagicMock()
    entity_registry.async_get_entity_id.return_value = "camera.meraki_front"
    entity_registry.async_get.side_effect = lambda entity_id: {
        "camera.meraki_front": meraki_entity,
        "camera.blue_iris_front": linked_entity,
    }.get(entity_id)

    with patch(
        "custom_components.meraki_ha.helpers.camera_mappings.er.async_get",
        return_value=entity_registry,
    ):
        clear_camera_pairing(
            hass,
            "Q2GV-XXXX",
            "camera.blue_iris_front",
            "blue-iris-device",
        )

    entity_registry.async_update_entity.assert_any_call(
        "camera.meraki_front",
        hidden_by=None,
    )
    entity_registry.async_update_entity.assert_any_call(
        "camera.blue_iris_front",
        device_id="blue-iris-device",
    )


async def test_apply_stored_camera_pairings_uses_saved_links(
    hass: HomeAssistant,
) -> None:
    """Test startup reapplies stored pairings for a config entry."""
    with (
        patch(
            "custom_components.meraki_ha.helpers.camera_mappings.load_camera_mappings",
            return_value={
                "entry-1": {
                    "Q2GV-1": "camera.legacy",
                    "Q2GV-2": {
                        "entity_id": "camera.blue_iris",
                        "original_device_id": "dev-old",
                    },
                }
            },
        ),
        patch(
            "custom_components.meraki_ha.helpers.camera_mappings.apply_camera_pairing"
        ) as apply_pairing,
    ):
        await apply_stored_camera_pairings(hass, "entry-1")

    apply_pairing.assert_any_call(hass, "Q2GV-1", "camera.legacy")
    apply_pairing.assert_any_call(hass, "Q2GV-2", "camera.blue_iris")


def test_list_linkable_cameras_includes_blue_iris_and_skips_meraki(
    hass: HomeAssistant,
) -> None:
    """Test pairing choices include Blue Iris cameras and exclude Meraki feeds."""
    hass.states.async_set(
        "camera.blue_iris_front",
        "idle",
        {"friendly_name": "Blue Iris Front"},
    )
    hass.states.async_set(
        "camera.meraki_front_door",
        "idle",
        {"friendly_name": "Meraki Front Door"},
    )
    hass.states.async_set(
        "camera.garage",
        "recording",
        {"friendly_name": "Garage Camera"},
    )

    entity_ids = [camera["entity_id"] for camera in list_linkable_cameras(hass)]

    assert "camera.blue_iris_front" in entity_ids
    assert "camera.garage" in entity_ids
    assert "camera.meraki_front_door" not in entity_ids


def test_list_linkable_cameras_falls_back_when_filter_matches_nothing(
    hass: HomeAssistant,
) -> None:
    """Test Blue Iris filter still returns cameras created as generic entities."""
    hass.states.async_set(
        "camera.front_porch",
        "idle",
        {"friendly_name": "Front Porch"},
    )
    mock_registry = MagicMock()
    generic_entry = MagicMock()
    generic_entry.platform = "generic"
    mock_registry.async_get.return_value = generic_entry

    with patch(
        "custom_components.meraki_ha.helpers.camera_mappings.er.async_get",
        return_value=mock_registry,
    ):
        cameras = list_linkable_cameras(hass, integration_filter="blue_iris")

    assert [camera["entity_id"] for camera in cameras] == ["camera.front_porch"]


async def test_async_set_camera_pairing_saves_blue_iris_link(
    hass: HomeAssistant,
) -> None:
    """Test pairing persistence applies and stores a Blue Iris camera."""
    with (
        patch(
            "custom_components.meraki_ha.helpers.camera_mappings.load_camera_mappings",
            return_value={},
        ),
        patch(
            "custom_components.meraki_ha.helpers.camera_mappings.save_camera_mappings",
        ) as save_mappings,
        patch(
            "custom_components.meraki_ha.helpers.camera_mappings.apply_camera_pairing",
            return_value="old-device",
        ) as apply_pairing,
    ):
        mappings = await async_set_camera_pairing(
            hass, "entry-1", "Q2GV-XXXX", "camera.blue_iris_front"
        )

    apply_pairing.assert_called_once_with(hass, "Q2GV-XXXX", "camera.blue_iris_front")
    save_mappings.assert_awaited_once()
    assert mappings == {"Q2GV-XXXX": "camera.blue_iris_front"}

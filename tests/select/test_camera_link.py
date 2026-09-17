"""Tests for the MV camera linked-camera select entity."""

from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from homeassistant.const import EntityCategory
from homeassistant.core import HomeAssistant
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from custom_components.meraki_ha.const import CAMERA_LINK_NONE, DOMAIN
from custom_components.meraki_ha.select import async_setup_entry
from custom_components.meraki_ha.select.camera_link import MerakiCameraLinkSelect


@pytest.fixture
def mock_camera_device() -> dict[str, str]:
    """Return a Meraki MV camera device payload."""
    return {
        "serial": "Q2GV-XXXX",
        "name": "Front Door",
        "model": "MV12",
        "productType": "camera",
        "networkId": "N_123",
    }


@pytest.fixture
def mock_camera_coordinator(mock_camera_device: dict[str, str]) -> MagicMock:
    """Create a coordinator that exposes one MV camera."""
    coordinator = MagicMock()
    coordinator.data = {"networks": [], "devices": [mock_camera_device]}
    coordinator.api = MagicMock()
    coordinator.last_update_success = True
    coordinator.config_entry = MagicMock()
    coordinator.config_entry.entry_id = "entry-1"
    coordinator.config_entry.options = {}
    return coordinator


def test_linked_camera_select_is_config_entity_on_camera_device(
    mock_camera_coordinator: MagicMock,
    mock_camera_device: dict[str, str],
    mock_config_entry: MagicMock,
) -> None:
    """Test the select appears as a config control on the MV device."""
    mock_config_entry.entry_id = "entry-1"
    select = MerakiCameraLinkSelect(
        mock_camera_coordinator, mock_config_entry, mock_camera_device
    )

    assert select.unique_id == "Q2GV-XXXX-linked-camera"
    assert select.entity_category == EntityCategory.CONFIG
    assert select.name == "Linked camera"


def test_linked_camera_select_options_include_blue_iris(
    hass: HomeAssistant,
    mock_camera_coordinator: MagicMock,
    mock_camera_device: dict[str, str],
    mock_config_entry: MagicMock,
) -> None:
    """Test the select lists Blue Iris cameras as pairing targets."""
    mock_config_entry.entry_id = "entry-1"
    hass.states.async_set(
        "camera.blue_iris_front",
        "idle",
        {"friendly_name": "Blue Iris Front"},
    )
    select = MerakiCameraLinkSelect(
        mock_camera_coordinator, mock_config_entry, mock_camera_device
    )
    select.hass = hass

    assert CAMERA_LINK_NONE in select.options
    assert "camera.blue_iris_front" in select.options
    assert select.current_option == CAMERA_LINK_NONE


def test_apply_linked_state_updates_current_option(
    hass: HomeAssistant,
    mock_camera_coordinator: MagicMock,
    mock_camera_device: dict[str, str],
    mock_config_entry: MagicMock,
) -> None:
    """Test external pairing updates the select without a local option change."""
    mock_config_entry.entry_id = "entry-1"
    select = MerakiCameraLinkSelect(
        mock_camera_coordinator, mock_config_entry, mock_camera_device
    )
    select.hass = hass

    with patch.object(select, "async_write_ha_state"):
        select.apply_linked_state("camera.blue_iris_front")

    assert select.current_option == "camera.blue_iris_front"

    with patch.object(select, "async_write_ha_state"):
        select.apply_linked_state("")

    assert select.current_option == CAMERA_LINK_NONE


def test_device_info_links_select_to_mv(
    mock_camera_coordinator: MagicMock,
    mock_camera_device: dict[str, str],
    mock_config_entry: MagicMock,
) -> None:
    """Test the select is attached to the Meraki camera device."""
    mock_config_entry.entry_id = "entry-1"
    mock_config_entry.options = {}
    select = MerakiCameraLinkSelect(
        mock_camera_coordinator, mock_config_entry, mock_camera_device
    )

    device_info = select.device_info

    assert device_info is not None
    assert (DOMAIN, "Q2GV-XXXX") in device_info["identifiers"]


def test_available_requires_coordinator_data(
    mock_camera_coordinator: MagicMock,
    mock_camera_device: dict[str, str],
    mock_config_entry: MagicMock,
) -> None:
    """Test the select is unavailable when coordinator data is missing."""
    mock_config_entry.entry_id = "entry-1"
    mock_camera_coordinator.last_update_success = True
    select = MerakiCameraLinkSelect(
        mock_camera_coordinator, mock_config_entry, mock_camera_device
    )

    assert select.available is True
    mock_camera_coordinator.last_update_success = False
    assert select.available is False
    mock_camera_coordinator.last_update_success = True
    mock_camera_coordinator.data = None
    assert select.available is False


def test_options_keep_current_pairing_when_camera_missing(
    hass: HomeAssistant,
    mock_camera_coordinator: MagicMock,
    mock_camera_device: dict[str, str],
    mock_config_entry: MagicMock,
) -> None:
    """Test a stored pairing stays selectable if that camera disappears."""
    mock_config_entry.entry_id = "entry-1"
    select = MerakiCameraLinkSelect(
        mock_camera_coordinator, mock_config_entry, mock_camera_device
    )
    select.hass = hass
    select._current_linked = "camera.stale_blue_iris"

    assert "camera.stale_blue_iris" in select.options


async def test_async_added_to_hass_loads_stored_pairing(
    hass: HomeAssistant,
    mock_camera_coordinator: MagicMock,
    mock_camera_device: dict[str, str],
    mock_config_entry: MagicMock,
) -> None:
    """Test startup restores the current Blue Iris pairing from storage."""
    mock_config_entry.entry_id = "entry-1"
    select = MerakiCameraLinkSelect(
        mock_camera_coordinator, mock_config_entry, mock_camera_device
    )
    select.hass = hass

    with (
        patch.object(CoordinatorEntity, "async_added_to_hass", new_callable=AsyncMock),
        patch(
            "custom_components.meraki_ha.select.camera_link.load_camera_mappings",
            new_callable=AsyncMock,
            return_value={"entry-1": {"Q2GV-XXXX": "camera.blue_iris_front"}},
        ),
    ):
        await select.async_added_to_hass()

    assert select.current_option == "camera.blue_iris_front"


async def test_async_added_to_hass_without_stored_pairing(
    hass: HomeAssistant,
    mock_camera_coordinator: MagicMock,
    mock_camera_device: dict[str, str],
    mock_config_entry: MagicMock,
) -> None:
    """Test startup leaves the select unlinked when storage has no pairing."""
    mock_config_entry.entry_id = "entry-1"
    select = MerakiCameraLinkSelect(
        mock_camera_coordinator, mock_config_entry, mock_camera_device
    )
    select.hass = hass

    with (
        patch.object(CoordinatorEntity, "async_added_to_hass", new_callable=AsyncMock),
        patch(
            "custom_components.meraki_ha.select.camera_link.load_camera_mappings",
            new_callable=AsyncMock,
            return_value={},
        ),
    ):
        await select.async_added_to_hass()

    assert select.current_option == CAMERA_LINK_NONE


async def test_selecting_blue_iris_camera_saves_pairing(
    hass: HomeAssistant,
    mock_camera_coordinator: MagicMock,
    mock_camera_device: dict[str, str],
    mock_config_entry: MagicMock,
) -> None:
    """Test choosing a Blue Iris camera persists the MV pairing."""
    mock_config_entry.entry_id = "entry-1"
    select = MerakiCameraLinkSelect(
        mock_camera_coordinator, mock_config_entry, mock_camera_device
    )
    select.hass = hass

    with (
        patch.object(select, "async_write_ha_state"),
        patch(
            "custom_components.meraki_ha.select.camera_link.async_set_camera_pairing",
            new_callable=AsyncMock,
        ) as set_pairing,
    ):
        await select.async_select_option("camera.blue_iris_front")

    set_pairing.assert_awaited_once_with(
        hass, "entry-1", "Q2GV-XXXX", "camera.blue_iris_front"
    )
    assert select.current_option == "camera.blue_iris_front"


async def test_selecting_not_linked_clears_pairing(
    hass: HomeAssistant,
    mock_camera_coordinator: MagicMock,
    mock_camera_device: dict[str, str],
    mock_config_entry: MagicMock,
) -> None:
    """Test choosing Not linked removes the stored pairing."""
    mock_config_entry.entry_id = "entry-1"
    select = MerakiCameraLinkSelect(
        mock_camera_coordinator, mock_config_entry, mock_camera_device
    )
    select.hass = hass
    select._current_linked = "camera.blue_iris_front"

    with (
        patch.object(select, "async_write_ha_state"),
        patch(
            "custom_components.meraki_ha.select.camera_link.async_set_camera_pairing",
            new_callable=AsyncMock,
        ) as set_pairing,
    ):
        await select.async_select_option(CAMERA_LINK_NONE)

    set_pairing.assert_awaited_once_with(hass, "entry-1", "Q2GV-XXXX", "")
    assert select.current_option == CAMERA_LINK_NONE


@pytest.mark.asyncio
async def test_async_setup_entry_creates_camera_link_select(
    hass: HomeAssistant,
    mock_config_entry: MagicMock,
) -> None:
    """Test select setup creates a Linked camera entity for each MV."""
    mock_config_entry.entry_id = "test_entry"
    coordinator = MagicMock()
    coordinator.api = MagicMock()
    coordinator.data = {
        "networks": [],
        "devices": [
            {
                "serial": "Q2GV-XXXX",
                "name": "Front Door",
                "model": "MV12",
                "productType": "camera",
            }
        ],
    }
    hass.data[DOMAIN] = {
        "test_entry": {"coordinator": coordinator},
    }
    async_add_entities = MagicMock()

    await async_setup_entry(hass, mock_config_entry, async_add_entities)

    async_add_entities.assert_called()
    created = async_add_entities.call_args[0][0]
    assert any(isinstance(entity, MerakiCameraLinkSelect) for entity in created)

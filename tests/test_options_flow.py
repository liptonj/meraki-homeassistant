"""Tests for the options flow module."""

from unittest.mock import MagicMock

import pytest
from homeassistant.config_entries import ConfigFlowResult

from custom_components.meraki_ha.const import (
    CONF_ENABLED_NETWORKS,
    CONF_MQTT_RELAY_DESTINATIONS,
    DOMAIN,
)
from custom_components.meraki_ha.options_flow import MerakiOptionsFlowHandler


@pytest.fixture
def mock_options_config_entry() -> MagicMock:
    """Create a mock config entry for options flow."""
    entry = MagicMock()
    entry.entry_id = "test_entry_id"
    entry.options = {
        "scan_interval": 30,
    }
    return entry


@pytest.fixture
def mock_hass_with_coordinator() -> MagicMock:
    """Create a mock hass with coordinator data."""
    hass = MagicMock()
    mock_coordinator = MagicMock()
    mock_coordinator.data = {
        "networks": [
            {"id": "N_123", "name": "Main Office"},
            {"id": "N_456", "name": "Branch Office"},
        ]
    }
    hass.data = {
        DOMAIN: {
            "test_entry_id": {
                "coordinator": mock_coordinator,
            }
        }
    }
    return hass


def test_options_flow_init(mock_options_config_entry: MagicMock) -> None:
    """Test options flow initialization."""
    handler = MerakiOptionsFlowHandler(mock_options_config_entry)
    assert handler.options == mock_options_config_entry.options
    assert handler.options["scan_interval"] == 30


@pytest.mark.asyncio
async def test_async_step_init_shows_menu(
    mock_options_config_entry: MagicMock,
) -> None:
    """Test the init step shows the main menu."""
    handler = MerakiOptionsFlowHandler(mock_options_config_entry)
    result: ConfigFlowResult = await handler.async_step_init()

    assert result["type"].value == "menu"
    assert result["step_id"] == "init"


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "menu_option, expected_step_id",
    [
        ("network_selection", "network_selection"),
        ("polling", "polling"),
        ("camera", "camera"),
        ("mqtt", "mqtt"),
        ("display_preferences", "display_preferences"),
    ],
)
async def test_menu_options_navigate_to_correct_step(
    mock_options_config_entry: MagicMock,
    mock_hass_with_coordinator: MagicMock,
    menu_option: str,
    expected_step_id: str,
) -> None:
    """Test that menu options navigate to the correct form."""
    handler = MerakiOptionsFlowHandler(mock_options_config_entry)
    handler.hass = mock_hass_with_coordinator

    result: ConfigFlowResult = await getattr(handler, f"async_step_{menu_option}")()

    assert result["type"].value == "form"
    assert result["step_id"] == expected_step_id


@pytest.mark.asyncio
async def test_network_selection_step(
    mock_options_config_entry: MagicMock,
    mock_hass_with_coordinator: MagicMock,
) -> None:
    """Test the network selection step saves data and creates entry."""
    handler = MerakiOptionsFlowHandler(mock_options_config_entry)
    handler.hass = mock_hass_with_coordinator

    user_input = {
        CONF_ENABLED_NETWORKS: ["N_123"],
        "enable_device_tracker": False,
    }

    result: ConfigFlowResult = await handler.async_step_network_selection(user_input)

    assert result["type"].value == "create_entry"
    assert handler.options[CONF_ENABLED_NETWORKS] == ["N_123"]
    assert handler.options["enable_device_tracker"] is False


@pytest.mark.asyncio
async def test_polling_step(
    mock_options_config_entry: MagicMock,
) -> None:
    """Test the polling step saves data and creates entry."""
    handler = MerakiOptionsFlowHandler(mock_options_config_entry)

    user_input = {
        "scan_interval": 120,
        "network_scan_interval": 600,
    }
    result: ConfigFlowResult = await handler.async_step_polling(user_input)
    assert result["type"].value == "create_entry"
    assert handler.options["scan_interval"] == 120
    assert handler.options["network_scan_interval"] == 600


@pytest.mark.asyncio
async def test_camera_step(
    mock_options_config_entry: MagicMock,
) -> None:
    """Test the camera step saves data and creates entry."""
    handler = MerakiOptionsFlowHandler(mock_options_config_entry)

    user_input = {"camera_snapshot_interval": 60}
    result: ConfigFlowResult = await handler.async_step_camera(user_input)

    assert result["type"].value == "create_entry"
    assert handler.options["camera_snapshot_interval"] == 60


@pytest.mark.asyncio
async def test_display_preferences_step(
    mock_options_config_entry: MagicMock,
) -> None:
    """Test the display preferences step saves data and creates entry."""
    handler = MerakiOptionsFlowHandler(mock_options_config_entry)

    user_input = {"dashboard_view_mode": "type"}
    result: ConfigFlowResult = await handler.async_step_display_preferences(user_input)

    assert result["type"].value == "create_entry"
    assert handler.options["dashboard_view_mode"] == "type"


@pytest.mark.asyncio
async def test_notifications_step_shows_progress(
    mock_options_config_entry: MagicMock,
) -> None:
    """Test the notifications step shows a progress indicator."""
    handler = MerakiOptionsFlowHandler(mock_options_config_entry)

    result: ConfigFlowResult = await handler.async_step_notifications()

    assert result["type"].value == "progress"
    assert result["step_id"] == "notifications"


# --- MQTT Destination Management ---


@pytest.mark.asyncio
async def test_mqtt_add_destination_action(
    mock_options_config_entry: MagicMock,
) -> None:
    """Test MQTT 'add' action navigates to the destination form."""
    handler = MerakiOptionsFlowHandler(mock_options_config_entry)
    result: ConfigFlowResult = await handler.async_step_mqtt(
        {"enable_mqtt": True, "action": "add"}
    )
    assert result["type"].value == "form"
    assert result["step_id"] == "mqtt_destination"
    assert handler._editing_destination_index is None


@pytest.mark.asyncio
async def test_mqtt_edit_destination_action_with_destinations(
    mock_options_config_entry: MagicMock,
) -> None:
    """Test MQTT 'edit' action navigates to destination selection."""
    mock_options_config_entry.options[CONF_MQTT_RELAY_DESTINATIONS] = [
        {"name": "Test Broker", "host": "mqtt.test.com"}
    ]
    handler = MerakiOptionsFlowHandler(mock_options_config_entry)

    result: ConfigFlowResult = await handler.async_step_mqtt(
        {"enable_mqtt": True, "action": "edit"}
    )

    assert result["type"].value == "form"
    assert result["step_id"] == "mqtt_select_destination"
    assert handler._destination_action == "edit"


@pytest.mark.asyncio
async def test_mqtt_delete_destination_action(
    mock_options_config_entry: MagicMock,
) -> None:
    """Test MQTT 'delete' action and removal of destinations."""
    mock_options_config_entry.options[CONF_MQTT_RELAY_DESTINATIONS] = [
        {"name": "Broker A", "host": "a.test.com"},
        {"name": "Broker B", "host": "b.test.com"},
    ]
    handler = MerakiOptionsFlowHandler(mock_options_config_entry)

    # Trigger delete action
    result: ConfigFlowResult = await handler.async_step_mqtt(
        {"enable_mqtt": True, "action": "delete"}
    )
    assert result["step_id"] == "mqtt_select_destination"

    # Select and submit the destination to delete
    result = await handler.async_step_mqtt_select_destination({"destinations": ["0"]})

    assert result["step_id"] == "mqtt"
    remaining = handler.options[CONF_MQTT_RELAY_DESTINATIONS]
    assert len(remaining) == 1
    assert remaining[0]["name"] == "Broker B"


@pytest.mark.asyncio
async def test_mqtt_select_destination_with_empty_list_returns_to_mqtt(
    mock_options_config_entry: MagicMock,
) -> None:
    """Test selecting a destination when none exist returns to the MQTT menu."""
    handler = MerakiOptionsFlowHandler(mock_options_config_entry)
    handler._destination_action = "edit"
    result: ConfigFlowResult = await handler.async_step_mqtt_select_destination()

    assert result["step_id"] == "mqtt"


@pytest.mark.asyncio
async def test_mqtt_add_new_destination_and_save(
    mock_options_config_entry: MagicMock,
) -> None:
    """Test adding a new MQTT destination via the form and saving."""
    handler = MerakiOptionsFlowHandler(mock_options_config_entry)
    handler._editing_destination_index = None  # Add mode

    destination_data = {
        "name": "New Broker",
        "host": "new.mqtt.com",
        "port": 1883,
    }
    result: ConfigFlowResult = await handler.async_step_mqtt_destination(
        destination_data
    )

    assert result["step_id"] == "mqtt"
    destinations = handler.options.get(CONF_MQTT_RELAY_DESTINATIONS, [])
    assert len(destinations) == 1
    assert destinations[0]["name"] == "New Broker"
    assert destinations[0]["host"] == "new.mqtt.com"

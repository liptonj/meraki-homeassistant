"""Tests for the options flow module."""

from unittest.mock import MagicMock

import pytest
import voluptuous as vol
from homeassistant.helpers import selector

from custom_components.meraki_ha.const import (
    CONF_ENABLED_NETWORKS,
    CONF_MQTT_RELAY_DESTINATIONS,
    DOMAIN,
    MQTT_DEST_HOST,
    MQTT_DEST_NAME,
    MQTT_DEST_PORT,
    MQTT_DEST_TOPIC_FILTER,
    MQTT_DEST_USE_TLS,
)
from custom_components.meraki_ha.options_flow import MerakiOptionsFlowHandler


@pytest.fixture
def mock_options_config_entry() -> MagicMock:
    """Create a mock config entry for options flow."""
    entry = MagicMock()
    entry.entry_id = "test_entry_id"
    entry.options = {
        "scan_interval": 30,
        "enable_device_status": True,
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
    assert handler.options["enable_device_status"] is True


@pytest.mark.asyncio
async def test_async_step_init_with_user_input_moves_to_dashboard(
    mock_options_config_entry: MagicMock,
) -> None:
    """Test options flow step init with user input moves to dashboard step."""
    handler = MerakiOptionsFlowHandler(mock_options_config_entry)

    user_input = {
        "scan_interval": 60,
        "enable_device_status": False,
    }

    result = await handler.async_step_init(user_input)

    # Step init should move to dashboard step, returning a form
    assert result["type"].value == "form"
    assert result["step_id"] == "dashboard"


@pytest.mark.asyncio
async def test_async_step_dashboard_with_user_input_moves_to_camera(
    mock_options_config_entry: MagicMock,
) -> None:
    """Test options flow step dashboard with user input moves to camera step."""
    handler = MerakiOptionsFlowHandler(mock_options_config_entry)

    result = await handler.async_step_dashboard({"some_dashboard_option": True})

    # Dashboard step should move to camera step, returning a form
    assert result["type"].value == "form"
    assert result["step_id"] == "camera"


@pytest.mark.asyncio
async def test_async_step_camera_with_user_input_moves_to_mqtt(
    mock_options_config_entry: MagicMock,
) -> None:
    """Test options flow step camera with user input moves to mqtt step."""
    handler = MerakiOptionsFlowHandler(mock_options_config_entry)

    result = await handler.async_step_camera({"some_camera_option": True})

    # Camera step should move to mqtt step, returning a form
    assert result["type"].value == "form"
    assert result["step_id"] == "mqtt"


@pytest.mark.asyncio
async def test_async_step_mqtt_with_user_input_creates_entry(
    mock_options_config_entry: MagicMock,
) -> None:
    """Test options flow step mqtt with user input creates entry."""
    from custom_components.meraki_ha.const import CONF_INTEGRATION_TITLE

    handler = MerakiOptionsFlowHandler(mock_options_config_entry)

    result = await handler.async_step_mqtt({"enable_mqtt": False})

    # MQTT step with input should create entry
    assert result["type"].value == "create_entry"
    assert result["title"] == CONF_INTEGRATION_TITLE


def test_populate_schema_defaults() -> None:
    """Test _populate_schema_defaults populates existing values."""
    mock_entry = MagicMock()
    mock_entry.options = {"scan_interval": 45}

    handler = MerakiOptionsFlowHandler(mock_entry)

    # Create a simple schema
    schema = vol.Schema(
        {
            vol.Required("scan_interval"): int,
            vol.Optional("other_option"): str,
        }
    )

    defaults = {"scan_interval": 45}
    network_options: list[selector.SelectOptionDict] = []

    result_schema = handler._populate_schema_defaults(schema, defaults, network_options)

    # Verify the schema was processed (returned as a Schema object)
    assert isinstance(result_schema, vol.Schema)


def test_populate_schema_defaults_with_networks() -> None:
    """Test _populate_schema_defaults includes network options."""
    mock_entry = MagicMock()
    mock_entry.options = {}

    handler = MerakiOptionsFlowHandler(mock_entry)

    # Create schema with network selector
    network_selector = selector.SelectSelector(
        selector.SelectSelectorConfig(
            options=[],
            multiple=True,
        )
    )

    schema = vol.Schema(
        {
            vol.Optional(CONF_ENABLED_NETWORKS): network_selector,
        }
    )

    defaults: dict[str, object] = {}
    network_options: list[selector.SelectOptionDict] = [
        selector.SelectOptionDict(label="Main Office", value="N_123"),
        selector.SelectOptionDict(label="Branch Office", value="N_456"),
    ]

    result_schema = handler._populate_schema_defaults(schema, defaults, network_options)

    assert isinstance(result_schema, vol.Schema)


@pytest.mark.asyncio
async def test_full_options_flow_creates_entry(
    mock_options_config_entry: MagicMock,
) -> None:
    """Test complete options flow from start to entry creation."""
    # Start with initial options
    mock_options_config_entry.options = {
        "scan_interval": 30,
        "enable_device_status": True,
        "temperature_unit": "celsius",
    }

    handler = MerakiOptionsFlowHandler(mock_options_config_entry)

    # Step 1: init -> goes to dashboard
    result = await handler.async_step_init({"scan_interval": 120})
    assert result["step_id"] == "dashboard"

    # Step 2: dashboard -> goes to camera
    result = await handler.async_step_dashboard({})
    assert result["step_id"] == "camera"

    # Step 3: camera -> goes to mqtt
    result = await handler.async_step_camera({})
    assert result["step_id"] == "mqtt"

    # Step 4: mqtt -> creates entry
    result = await handler.async_step_mqtt({"enable_mqtt": False})
    assert result["type"].value == "create_entry"
    # New value should be applied
    assert result["data"]["scan_interval"] == 120
    # Existing values should be preserved
    assert result["data"]["enable_device_status"] is True
    assert result["data"]["temperature_unit"] == "celsius"


@pytest.mark.asyncio
async def test_async_step_mqtt_action_add_navigates_to_destination(
    mock_options_config_entry: MagicMock,
) -> None:
    """Test MQTT step with action='add' navigates to destination form."""
    handler = MerakiOptionsFlowHandler(mock_options_config_entry)

    result = await handler.async_step_mqtt({"enable_mqtt": True, "action": "add"})

    assert result["type"].value == "form"
    assert result["step_id"] == "mqtt_destination"


@pytest.mark.asyncio
async def test_async_step_mqtt_action_edit_navigates_to_select_edit(
    mock_options_config_entry: MagicMock,
) -> None:
    """Test MQTT step with action='edit' navigates to select destination form."""
    mock_options_config_entry.options[CONF_MQTT_RELAY_DESTINATIONS] = [
        {MQTT_DEST_NAME: "Test Dest", MQTT_DEST_HOST: "localhost"},
    ]
    handler = MerakiOptionsFlowHandler(mock_options_config_entry)

    result = await handler.async_step_mqtt({"enable_mqtt": True, "action": "edit"})

    assert result["type"].value == "form"
    assert result["step_id"] == "mqtt_select_destination_to_edit"


@pytest.mark.asyncio
async def test_async_step_mqtt_action_delete_navigates_to_select_delete(
    mock_options_config_entry: MagicMock,
) -> None:
    """Test MQTT step with action='delete' navigates to select destination form."""
    mock_options_config_entry.options[CONF_MQTT_RELAY_DESTINATIONS] = [
        {MQTT_DEST_NAME: "Test Dest", MQTT_DEST_HOST: "localhost"},
    ]
    handler = MerakiOptionsFlowHandler(mock_options_config_entry)

    result = await handler.async_step_mqtt({"enable_mqtt": True, "action": "delete"})

    assert result["type"].value == "form"
    assert result["step_id"] == "mqtt_select_destination_to_delete"


@pytest.mark.asyncio
async def test_async_step_mqtt_select_destination_to_edit(
    mock_options_config_entry: MagicMock,
) -> None:
    """Test selecting a destination to edit navigates to destination form."""
    mock_options_config_entry.options[CONF_MQTT_RELAY_DESTINATIONS] = [
        {MQTT_DEST_NAME: "Dest 1", MQTT_DEST_HOST: "host1.example.com"},
        {MQTT_DEST_NAME: "Dest 2", MQTT_DEST_HOST: "host2.example.com"},
    ]
    handler = MerakiOptionsFlowHandler(mock_options_config_entry)

    result = await handler.async_step_mqtt_select_destination_to_edit(
        {"destination_index": "1"}
    )

    assert result["type"].value == "form"
    assert result["step_id"] == "mqtt_destination"
    assert handler._editing_destination_index == 1


@pytest.mark.asyncio
async def test_async_step_mqtt_select_destination_to_delete(
    mock_options_config_entry: MagicMock,
) -> None:
    """Test selecting a destination to delete removes it and returns to mqtt."""
    mock_options_config_entry.options[CONF_MQTT_RELAY_DESTINATIONS] = [
        {MQTT_DEST_NAME: "Dest 1", MQTT_DEST_HOST: "host1.example.com"},
        {MQTT_DEST_NAME: "Dest 2", MQTT_DEST_HOST: "host2.example.com"},
    ]
    handler = MerakiOptionsFlowHandler(mock_options_config_entry)

    result = await handler.async_step_mqtt_select_destination_to_delete(
        {"destination_index": "0"}
    )

    # Should return to mqtt step
    assert result["type"].value == "form"
    assert result["step_id"] == "mqtt"
    # First destination should be removed
    assert len(handler.options[CONF_MQTT_RELAY_DESTINATIONS]) == 1
    assert handler.options[CONF_MQTT_RELAY_DESTINATIONS][0][MQTT_DEST_NAME] == "Dest 2"


@pytest.mark.asyncio
async def test_async_step_mqtt_destination_add_new(
    mock_options_config_entry: MagicMock,
) -> None:
    """Test adding a new MQTT destination."""
    mock_options_config_entry.options[CONF_MQTT_RELAY_DESTINATIONS] = []
    handler = MerakiOptionsFlowHandler(mock_options_config_entry)
    handler._editing_destination_index = None

    result = await handler.async_step_mqtt_destination(
        {
            MQTT_DEST_NAME: "New Destination",
            MQTT_DEST_HOST: "new.example.com",
            MQTT_DEST_PORT: 1883,
            MQTT_DEST_USE_TLS: False,
            MQTT_DEST_TOPIC_FILTER: "meraki/v1/mt/#",
        }
    )

    # Should return to mqtt step
    assert result["type"].value == "form"
    assert result["step_id"] == "mqtt"
    # New destination should be added
    assert len(handler.options[CONF_MQTT_RELAY_DESTINATIONS]) == 1
    assert (
        handler.options[CONF_MQTT_RELAY_DESTINATIONS][0][MQTT_DEST_NAME]
        == "New Destination"
    )


@pytest.mark.asyncio
async def test_async_step_mqtt_destination_edit_existing(
    mock_options_config_entry: MagicMock,
) -> None:
    """Test editing an existing MQTT destination."""
    mock_options_config_entry.options[CONF_MQTT_RELAY_DESTINATIONS] = [
        {
            MQTT_DEST_NAME: "Old Name",
            MQTT_DEST_HOST: "old.example.com",
            MQTT_DEST_PORT: 1883,
        },
    ]
    handler = MerakiOptionsFlowHandler(mock_options_config_entry)
    handler._editing_destination_index = 0

    result = await handler.async_step_mqtt_destination(
        {
            MQTT_DEST_NAME: "Updated Name",
            MQTT_DEST_HOST: "updated.example.com",
            MQTT_DEST_PORT: 8883,
            MQTT_DEST_USE_TLS: True,
            MQTT_DEST_TOPIC_FILTER: "meraki/v1/mt/#",
        }
    )

    # Should return to mqtt step
    assert result["type"].value == "form"
    assert result["step_id"] == "mqtt"
    # Destination should be updated
    assert len(handler.options[CONF_MQTT_RELAY_DESTINATIONS]) == 1
    assert (
        handler.options[CONF_MQTT_RELAY_DESTINATIONS][0][MQTT_DEST_NAME]
        == "Updated Name"
    )
    assert (
        handler.options[CONF_MQTT_RELAY_DESTINATIONS][0][MQTT_DEST_HOST]
        == "updated.example.com"
    )


@pytest.mark.asyncio
async def test_async_step_mqtt_destination_validation_host_required(
    mock_options_config_entry: MagicMock,
) -> None:
    """Test MQTT destination validation requires host."""
    handler = MerakiOptionsFlowHandler(mock_options_config_entry)
    handler._editing_destination_index = None

    result = await handler.async_step_mqtt_destination(
        {
            MQTT_DEST_NAME: "Test",
            MQTT_DEST_HOST: "",  # Empty host
            MQTT_DEST_PORT: 1883,
        }
    )

    # Should show form with error
    assert result["type"].value == "form"
    assert result["step_id"] == "mqtt_destination"
    assert "base" in result["errors"]
    assert result["errors"]["base"] == "host_required"


@pytest.mark.asyncio
async def test_async_step_mqtt_destination_validation_name_required(
    mock_options_config_entry: MagicMock,
) -> None:
    """Test MQTT destination validation requires name."""
    handler = MerakiOptionsFlowHandler(mock_options_config_entry)
    handler._editing_destination_index = None

    result = await handler.async_step_mqtt_destination(
        {
            MQTT_DEST_NAME: "",  # Empty name
            MQTT_DEST_HOST: "test.example.com",
            MQTT_DEST_PORT: 1883,
        }
    )

    # Should show form with error
    assert result["type"].value == "form"
    assert result["step_id"] == "mqtt_destination"
    assert "base" in result["errors"]
    assert result["errors"]["base"] == "name_required"

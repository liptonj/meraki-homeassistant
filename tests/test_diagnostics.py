"""Tests for the diagnostics module."""

import json
from unittest.mock import MagicMock

import pytest

from custom_components.meraki_ha.const import DOMAIN
from custom_components.meraki_ha.diagnostics import async_get_config_entry_diagnostics
from tests.const import MOCK_ALL_DATA


@pytest.mark.asyncio
async def test_diagnostics_redacts_nested_wifi_and_relay_secrets(
    mock_hass: MagicMock,
    mock_config_entry_for_diagnostics: MagicMock,
) -> None:
    """Remove secrets from all sections without mutating runtime data."""
    secret_fields = {
        "psk": "fixture-wifi-key",
        "passphrase": "fixture-device-key",
        "secret": "fixture-radius-key",
        "password": "fixture-relay-password",
        "api_key": "fixture-api-key",
        "Authorization": "Bearer fixture-token",
        "radiusSecret": "fixture-radius-legacy",
    }
    coordinator = MagicMock()
    coordinator.data = {"ssids": [{"name": "Residents", **secret_fields}]}
    relay = MagicMock()
    relay.get_health_status.return_value = {"nested": dict(secret_fields)}
    mock_config_entry_for_diagnostics.options = {"enable_mqtt": True}
    mock_hass.data = {
        DOMAIN: {
            mock_config_entry_for_diagnostics.entry_id: {
                "coordinator": coordinator,
                "mqtt_relay_manager": relay,
            }
        }
    }

    result = await async_get_config_entry_diagnostics(
        mock_hass, mock_config_entry_for_diagnostics
    )
    exported = json.dumps(result)
    for key, value in secret_fields.items():
        assert value not in exported
        assert coordinator.data["ssids"][0][key] == value
    assert result["coordinator_data"]["ssids"][0]["name"] == "Residents"


@pytest.fixture
def mock_hass() -> MagicMock:
    """Create a mock Home Assistant instance."""
    hass = MagicMock()
    return hass


@pytest.fixture
def mock_config_entry_for_diagnostics() -> MagicMock:
    """Create a mock config entry for diagnostics."""
    entry = MagicMock()
    entry.entry_id = "test_entry_id"
    entry.as_dict.return_value = {
        "entry_id": "test_entry_id",
        "domain": DOMAIN,
        "title": "Meraki Integration",
        "data": {
            "token": {
                "access_token": "secret-access",
                "refresh_token": "secret-refresh",
            },
            "meraki_org_id": "123",
        },
        "options": {"scan_interval": 30},
    }
    return entry


@pytest.mark.asyncio
async def test_async_get_config_entry_diagnostics(
    mock_hass: MagicMock,
    mock_config_entry_for_diagnostics: MagicMock,
) -> None:
    """Test that diagnostics returns config_entry and coordinator_data."""
    # Setup mock coordinator
    mock_coordinator = MagicMock()
    mock_coordinator.data = MOCK_ALL_DATA

    # Setup hass.data structure
    mock_hass.data = {
        DOMAIN: {
            mock_config_entry_for_diagnostics.entry_id: {
                "coordinator": mock_coordinator,
            }
        }
    }

    # Call the diagnostics function
    result = await async_get_config_entry_diagnostics(
        mock_hass,
        mock_config_entry_for_diagnostics,
    )

    # Verify the result structure
    assert "config_entry" in result
    assert "coordinator_data" in result

    # Verify config entry data
    assert result["config_entry"]["entry_id"] == "test_entry_id"
    assert result["config_entry"]["domain"] == DOMAIN
    token = result["config_entry"]["data"]["token"]
    assert token["access_token"] != "secret-access"
    assert token["refresh_token"] != "secret-refresh"

    # Verify coordinator data
    assert result["coordinator_data"]["networks"] == MOCK_ALL_DATA["networks"]
    assert result["coordinator_data"]["devices"] == MOCK_ALL_DATA["devices"]
    assert result["coordinator_data"]["ssids"][0]["psk"] == "**REDACTED**"


@pytest.mark.asyncio
async def test_diagnostics_includes_networks(
    mock_hass: MagicMock,
    mock_config_entry_for_diagnostics: MagicMock,
) -> None:
    """Test that diagnostics includes network data from coordinator."""
    mock_coordinator = MagicMock()
    mock_coordinator.data = {
        "networks": [{"id": "N_123", "name": "Test Network"}],
        "devices": [],
        "ssids": [],
    }

    mock_hass.data = {
        DOMAIN: {
            mock_config_entry_for_diagnostics.entry_id: {
                "coordinator": mock_coordinator,
            }
        }
    }

    result = await async_get_config_entry_diagnostics(
        mock_hass,
        mock_config_entry_for_diagnostics,
    )

    assert "networks" in result["coordinator_data"]
    assert len(result["coordinator_data"]["networks"]) == 1
    assert result["coordinator_data"]["networks"][0]["name"] == "Test Network"


@pytest.mark.asyncio
async def test_diagnostics_includes_devices(
    mock_hass: MagicMock,
    mock_config_entry_for_diagnostics: MagicMock,
) -> None:
    """Test that diagnostics includes device data from coordinator."""
    mock_coordinator = MagicMock()
    mock_coordinator.data = {
        "networks": [],
        "devices": [{"serial": "ABC-123", "name": "Test Device", "model": "MR33"}],
        "ssids": [],
    }

    mock_hass.data = {
        DOMAIN: {
            mock_config_entry_for_diagnostics.entry_id: {
                "coordinator": mock_coordinator,
            }
        }
    }

    result = await async_get_config_entry_diagnostics(
        mock_hass,
        mock_config_entry_for_diagnostics,
    )

    assert "devices" in result["coordinator_data"]
    assert len(result["coordinator_data"]["devices"]) == 1
    assert result["coordinator_data"]["devices"][0]["serial"] == "ABC-123"

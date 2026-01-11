"""Tests for the Meraki Scanning API."""

from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock

import pytest
from homeassistant.core import HomeAssistant

from custom_components.meraki_ha.const import (
    CONF_ENABLE_SCANNING_API,
    CONF_SCANNING_API_SECRET,
    CONF_SCANNING_API_VALIDATOR,
)
from custom_components.meraki_ha.webhook import async_handle_scanning_api


@pytest.fixture
def mock_request():
    """Create a mock aiohttp request."""
    request = AsyncMock()
    request.method = "POST"
    request.json = AsyncMock(
        return_value={
            "secret": "test_secret",
            "type": "DevicesSeen",
            "data": {
                "apMac": "00:11:22:33:44:55",
                "observations": [
                    {
                        "clientMac": "aa:bb:cc:dd:ee:ff",
                        "seenTime": "2024-01-15T12:00:00Z",
                        "rssi": -45,
                        "location": {"lat": 37.7749, "lng": -122.4194},
                    }
                ],
            },
        }
    )
    return request


async def test_scanning_api_get_validator(hass: HomeAssistant, mock_config_entry):
    """Test the GET validator for the Scanning API."""
    mock_config_entry.options = {
        CONF_ENABLE_SCANNING_API: True,
        CONF_SCANNING_API_VALIDATOR: "test_validator",
    }
    request = AsyncMock()
    request.method = "GET"
    hass.config_entries.async_get_entry = MagicMock(return_value=mock_config_entry)
    response = await async_handle_scanning_api(
        hass, mock_config_entry.entry_id, request
    )
    assert response.text == "test_validator"


async def test_scanning_api_post_invalid_secret(
    hass: HomeAssistant, mock_config_entry, mock_request
):
    """Test the POST data processing with an invalid secret."""
    mock_config_entry.options = {
        CONF_ENABLE_SCANNING_API: True,
        CONF_SCANNING_API_SECRET: "wrong_secret",
    }
    hass.config_entries.async_get_entry = MagicMock(return_value=mock_config_entry)
    response = await async_handle_scanning_api(
        hass, mock_config_entry.entry_id, mock_request
    )
    assert response.status == 401


async def test_scanning_api_post_valid_data(
    hass: HomeAssistant, mock_config_entry, mock_request, mock_coordinator
):
    """Test the POST data processing with valid data."""
    mock_config_entry.options = {
        CONF_ENABLE_SCANNING_API: True,
        CONF_SCANNING_API_SECRET: "test_secret",
    }
    hass.data["meraki_ha"] = {
        mock_config_entry.entry_id: {"coordinator": mock_coordinator}
    }
    mock_coordinator.async_handle_scanning_api_data = AsyncMock()
    hass.config_entries.async_get_entry = MagicMock(return_value=mock_config_entry)
    response = await async_handle_scanning_api(
        hass, mock_config_entry.entry_id, mock_request
    )
    assert response.status == 200
    mock_coordinator.async_handle_scanning_api_data.assert_called_once()

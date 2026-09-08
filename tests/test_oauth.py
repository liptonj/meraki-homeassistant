"""Tests for OAuth session helpers."""

from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from homeassistant.exceptions import ConfigEntryAuthFailed, ConfigEntryNotReady

from custom_components.meraki_ha.const import CONF_MERAKI_ORG_ID
from custom_components.meraki_ha.oauth import (
    async_create_oauth_session,
    oauth_access_token,
    redact_oauth_data,
)
from tests.const import MOCK_OAUTH_TOKEN


def test_oauth_access_token_present() -> None:
    """Test extracting an access token from entry data."""
    entry = MagicMock()
    entry.data = {"token": MOCK_OAUTH_TOKEN}
    assert oauth_access_token(entry) == "test-access-token"


def test_oauth_access_token_missing() -> None:
    """Test missing token returns None."""
    entry = MagicMock()
    entry.data = {CONF_MERAKI_ORG_ID: "123"}
    assert oauth_access_token(entry) is None


def test_redact_oauth_data() -> None:
    """Test token values are redacted."""
    redacted = redact_oauth_data(
        {
            "token": dict(MOCK_OAUTH_TOKEN),
            "meraki_api_key": "legacy-key",
            "meraki_org_id": "123",
        }
    )
    assert redacted["token"]["access_token"] == "**REDACTED**"
    assert redacted["token"]["refresh_token"] == "**REDACTED**"
    assert redacted["meraki_api_key"] == "**REDACTED**"
    assert redacted["meraki_org_id"] == "123"


@pytest.mark.asyncio
async def test_create_oauth_session_requires_token() -> None:
    """Test setup fails closed without an OAuth token."""
    hass = MagicMock()
    entry = MagicMock()
    entry.entry_id = "abcdef123456"
    entry.data = {CONF_MERAKI_ORG_ID: "123"}

    with pytest.raises(ConfigEntryAuthFailed):
        await async_create_oauth_session(hass, entry)


@pytest.mark.asyncio
async def test_create_oauth_session_unavailable() -> None:
    """Test missing Application Credentials become ConfigEntryNotReady."""
    hass = MagicMock()
    entry = MagicMock()
    entry.data = {
        "token": MOCK_OAUTH_TOKEN,
        CONF_MERAKI_ORG_ID: "123",
        "auth_implementation": "meraki_ha",
    }

    with (
        patch(
            "custom_components.meraki_ha.oauth.async_get_config_entry_implementation",
            side_effect=ValueError("Implementation not available"),
        ),
        pytest.raises(ConfigEntryNotReady),
    ):
        await async_create_oauth_session(hass, entry)


@pytest.mark.asyncio
async def test_create_oauth_session_success() -> None:
    """Test an OAuth2Session is created when credentials exist."""
    hass = MagicMock()
    entry = MagicMock()
    entry.data = {
        "token": MOCK_OAUTH_TOKEN,
        CONF_MERAKI_ORG_ID: "123",
        "auth_implementation": "meraki_ha",
    }
    implementation = MagicMock()

    with (
        patch(
            "custom_components.meraki_ha.oauth.async_get_config_entry_implementation",
            new=AsyncMock(return_value=implementation),
        ),
        patch(
            "custom_components.meraki_ha.oauth.OAuth2Session",
        ) as mock_session,
    ):
        session = await async_create_oauth_session(hass, entry)

    mock_session.assert_called_once_with(hass, entry, implementation)
    assert session is mock_session.return_value

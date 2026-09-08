"""OAuth2 session helpers for the Meraki integration."""

from __future__ import annotations

from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ConfigEntryAuthFailed, ConfigEntryNotReady
from homeassistant.helpers.config_entry_oauth2_flow import (
    OAuth2Session,
    async_get_config_entry_implementation,
)

from .const import CONF_MERAKI_ORG_ID
from .helpers.logging_helper import MerakiLoggers

_LOGGER = MerakiLoggers.MAIN


def oauth_access_token(entry: ConfigEntry) -> str | None:
    """Return the current access token from a config entry, if present."""
    token = entry.data.get("token")
    if not isinstance(token, dict):
        return None
    access_token = token.get("access_token")
    if isinstance(access_token, str) and access_token:
        return access_token
    return None


async def async_create_oauth_session(
    hass: HomeAssistant, entry: ConfigEntry
) -> OAuth2Session:
    """
    Create an OAuth2 session for a config entry.

    Raises
    ------
        ConfigEntryAuthFailed: If the entry has no OAuth token.
        ConfigEntryNotReady: If Application Credentials are unavailable.

    """
    if oauth_access_token(entry) is None:
        _LOGGER.warning(
            "Config entry %s is missing OAuth tokens; reauthentication required",
            entry.entry_id[:8],
        )
        raise ConfigEntryAuthFailed(
            "Meraki now requires OAuth2. Reauthenticate this integration."
        )

    if CONF_MERAKI_ORG_ID not in entry.data:
        raise ConfigEntryAuthFailed("Meraki organization ID is missing.")

    try:
        implementation = await async_get_config_entry_implementation(hass, entry)
    except ValueError as err:
        raise ConfigEntryNotReady(
            "Meraki Application Credentials are unavailable"
        ) from err

    return OAuth2Session(hass, entry, implementation)


def redact_oauth_data(data: dict[str, Any]) -> dict[str, Any]:
    """Return a copy of config-entry-like data with secrets removed."""
    redacted = dict(data)
    token = redacted.get("token")
    if isinstance(token, dict):
        token_copy = dict(token)
        for key in ("access_token", "refresh_token"):
            if key in token_copy:
                token_copy[key] = "**REDACTED**"
        redacted["token"] = token_copy
    if "meraki_api_key" in redacted:
        redacted["meraki_api_key"] = "**REDACTED**"
    return redacted

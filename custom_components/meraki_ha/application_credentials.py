"""Application credentials platform for Meraki OAuth2."""

from __future__ import annotations

from json import JSONDecodeError
from typing import Any, cast

from aiohttp import BasicAuth, ClientError
from homeassistant.components.application_credentials import (
    AuthImplementation,
    AuthorizationServer,
    ClientCredential,
)
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.config_entry_oauth2_flow import AbstractOAuth2Implementation

from .const import (
    OAUTH2_AUTHORIZE,
    OAUTH2_TOKEN,
    OAUTH_CONSOLE_URL,
    OAUTH_REDIRECT_URI,
    OAUTH_SCOPES,
)
from .helpers.logging_helper import MerakiLoggers

_LOGGER = MerakiLoggers.MAIN


class MerakiOAuth2Implementation(AuthImplementation):
    """OAuth2 implementation that authenticates the token endpoint with HTTP Basic."""

    @property
    def extra_authorize_data(self) -> dict[str, str]:
        """Request the scopes this integration needs."""
        return {"scope": " ".join(OAUTH_SCOPES)}

    async def _token_request(self, data: dict[str, Any]) -> dict[str, Any]:
        """Exchange or refresh tokens using HTTP Basic client authentication."""
        session = async_get_clientsession(self.hass)
        request_data = dict(data)
        request_data.pop("client_id", None)
        request_data.pop("client_secret", None)

        resp = await session.post(
            self.token_url,
            data=request_data,
            auth=BasicAuth(self.client_id, self.client_secret),
        )
        if resp.status >= 400:
            try:
                error_response = await resp.json()
            except (ClientError, JSONDecodeError):
                error_response = {}
            error_code = error_response.get("error", "unknown")
            error_description = error_response.get("error_description", "unknown error")
            _LOGGER.error(
                "Meraki token request failed (%s): %s",
                error_code,
                error_description,
            )
        resp.raise_for_status()
        return cast(dict[str, Any], await resp.json())


async def async_get_auth_implementation(
    hass: HomeAssistant, auth_domain: str, credential: ClientCredential
) -> AbstractOAuth2Implementation:
    """Return the Meraki OAuth2 implementation for Application Credentials."""
    return MerakiOAuth2Implementation(
        hass,
        auth_domain,
        credential,
        AuthorizationServer(
            authorize_url=OAUTH2_AUTHORIZE,
            token_url=OAUTH2_TOKEN,
        ),
    )


async def async_get_description_placeholders(hass: HomeAssistant) -> dict[str, str]:
    """Return placeholders for the Application Credentials dialog."""
    return {
        "oauth_console_url": OAUTH_CONSOLE_URL,
        "redirect_url": OAUTH_REDIRECT_URI,
    }

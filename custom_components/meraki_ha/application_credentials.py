"""Application credentials platform for Meraki OAuth2."""

from __future__ import annotations

from json import JSONDecodeError
from typing import Any, cast
from urllib.parse import quote

from aiohttp import ClientError, encode_basic_auth
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


def oauth_basic_auth_header(client_id: str, client_secret: str) -> str:
    """Build the Authorization header value for the Meraki token endpoint.

    RFC 6749 section 2.3.1 requires application/x-www-form-urlencoded encoding
    of the client id and secret before HTTP Basic. Meraki's authorization
    server (Ory Hydra) query-unescapes those values; sending them raw turns
    ``+`` in a Cisco client secret into a space and yields ``invalid_client``.
    """
    return encode_basic_auth(quote(client_id, safe=""), quote(client_secret, safe=""))


class MerakiOAuth2Implementation(AuthImplementation):
    """OAuth2 implementation that authenticates the token endpoint with HTTP Basic."""

    @property
    def extra_authorize_data(self) -> dict[str, str]:
        """Request the scopes this integration needs."""
        return {"scope": " ".join(OAUTH_SCOPES)}

    @property
    def extra_token_resolve_data(self) -> dict[str, str]:
        """Include scopes on the authorization-code token request."""
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
            headers={
                "Authorization": oauth_basic_auth_header(
                    self.client_id, self.client_secret
                )
            },
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

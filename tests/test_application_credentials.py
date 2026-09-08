"""Tests for Meraki OAuth2 application credentials."""

from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from aiohttp import BasicAuth
from homeassistant.components.application_credentials import (
    AuthorizationServer,
    ClientCredential,
)

from custom_components.meraki_ha.application_credentials import (
    MerakiOAuth2Implementation,
    async_get_auth_implementation,
    async_get_description_placeholders,
)
from custom_components.meraki_ha.const import (
    OAUTH2_AUTHORIZE,
    OAUTH2_TOKEN,
    OAUTH_CONSOLE_URL,
    OAUTH_REDIRECT_URI,
    OAUTH_SCOPES,
)


@pytest.mark.asyncio
async def test_async_get_description_placeholders() -> None:
    """Test Application Credentials dialog placeholders."""
    placeholders = await async_get_description_placeholders(MagicMock())
    assert placeholders["oauth_console_url"] == OAUTH_CONSOLE_URL
    assert placeholders["redirect_url"] == OAUTH_REDIRECT_URI


@pytest.mark.asyncio
async def test_async_get_auth_implementation() -> None:
    """Test custom auth implementation is returned."""
    credential = ClientCredential("client-id", "client-secret", name="Meraki")
    impl = await async_get_auth_implementation(MagicMock(), "meraki_ha", credential)
    assert isinstance(impl, MerakiOAuth2Implementation)
    assert impl.extra_authorize_data["scope"] == " ".join(OAUTH_SCOPES)


@pytest.mark.asyncio
async def test_token_request_uses_http_basic() -> None:
    """Test token POST uses HTTP Basic and omits client secret from the body."""
    credential = ClientCredential("client-id", "client-secret")
    impl = MerakiOAuth2Implementation(
        MagicMock(),
        "meraki_ha",
        credential,
        AuthorizationServer(OAUTH2_AUTHORIZE, OAUTH2_TOKEN),
    )
    mock_resp = MagicMock()
    mock_resp.status = 200
    mock_resp.json = AsyncMock(
        return_value={
            "access_token": "access",
            "refresh_token": "refresh",
            "expires_in": 3600,
        }
    )
    mock_resp.raise_for_status = MagicMock()
    mock_session = MagicMock()
    mock_session.post = AsyncMock(return_value=mock_resp)

    with patch(
        "custom_components.meraki_ha.application_credentials.async_get_clientsession",
        return_value=mock_session,
    ):
        token = await impl._token_request(
            {
                "grant_type": "authorization_code",
                "code": "abc",
                "client_id": "client-id",
                "client_secret": "client-secret",
            }
        )

    assert token["access_token"] == "access"
    posted_call = mock_session.post.await_args
    assert posted_call is not None
    assert posted_call.args[0] == OAUTH2_TOKEN
    posted = posted_call.kwargs["data"]
    assert "client_secret" not in posted
    assert "client_id" not in posted
    assert posted["grant_type"] == "authorization_code"
    auth = posted_call.kwargs["auth"]
    assert isinstance(auth, BasicAuth)
    assert auth.login == "client-id"
    assert auth.password == "client-secret"


@pytest.mark.asyncio
async def test_token_request_logs_error_and_raises() -> None:
    """Test failed token exchange does not leak the client secret."""
    credential = ClientCredential("client-id", "client-secret")
    impl = MerakiOAuth2Implementation(
        MagicMock(),
        "meraki_ha",
        credential,
        AuthorizationServer(OAUTH2_AUTHORIZE, OAUTH2_TOKEN),
    )
    mock_resp = MagicMock()
    mock_resp.status = 401
    mock_resp.json = AsyncMock(
        return_value={"error": "invalid_client", "error_description": "bad secret"}
    )
    mock_resp.raise_for_status = MagicMock(side_effect=Exception("401"))
    mock_session = MagicMock()
    mock_session.post = AsyncMock(return_value=mock_resp)

    with (
        patch(
            "custom_components.meraki_ha.application_credentials.async_get_clientsession",
            return_value=mock_session,
        ),
        pytest.raises(Exception, match="401"),
    ):
        await impl._token_request({"grant_type": "authorization_code", "code": "abc"})

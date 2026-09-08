"""Tests for OAuth reauthentication on the config flow."""

from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from homeassistant.config_entries import SOURCE_REAUTH

from custom_components.meraki_ha.config_flow import MerakiConfigFlow
from custom_components.meraki_ha.const import CONF_MERAKI_API_KEY, CONF_MERAKI_ORG_ID
from tests.const import MOCK_OAUTH_TOKEN


@pytest.mark.asyncio
async def test_reauth_starts_confirm_form() -> None:
    """Test reauth entry point shows the confirm form."""
    flow = MerakiConfigFlow()
    reauth_entry = MagicMock()
    reauth_entry.data = {CONF_MERAKI_ORG_ID: "123456", "org_name": "Test Org"}
    object.__setattr__(flow, "_get_reauth_entry", MagicMock(return_value=reauth_entry))
    object.__setattr__(
        flow,
        "async_show_form",
        MagicMock(return_value={"type": "form", "step_id": "reauth_confirm"}),
    )

    result = await flow.async_step_reauth({CONF_MERAKI_ORG_ID: "123456"})

    assert result["step_id"] == "reauth_confirm"


@pytest.mark.asyncio
async def test_reauth_confirm_continues_to_user() -> None:
    """Test confirming reauth continues the OAuth user step."""
    flow = MerakiConfigFlow()
    object.__setattr__(
        flow,
        "async_step_user",
        AsyncMock(return_value={"type": "form", "step_id": "pick_implementation"}),
    )

    result = await flow.async_step_reauth_confirm({"confirm": True})

    assert result["step_id"] == "pick_implementation"


@pytest.mark.asyncio
async def test_reauth_drops_legacy_api_key() -> None:
    """Test successful reauth removes meraki_api_key from entry data."""
    flow = MerakiConfigFlow()
    flow.context = {"source": SOURCE_REAUTH}
    reauth_entry = MagicMock()
    reauth_entry.data = {
        CONF_MERAKI_API_KEY: "old-key",
        CONF_MERAKI_ORG_ID: "123456",
        "org_name": "Test Org",
    }
    object.__setattr__(flow, "_get_reauth_entry", MagicMock(return_value=reauth_entry))
    object.__setattr__(
        flow,
        "async_update_reload_and_abort",
        MagicMock(return_value={"type": "abort", "reason": "reauth_successful"}),
    )

    with patch(
        "custom_components.meraki_ha.config_flow.async_list_organizations",
        new=AsyncMock(return_value=[{"id": "123456", "name": "Test Org"}]),
    ):
        await flow.async_oauth_create_entry(
            {"auth_implementation": "meraki_ha", "token": MOCK_OAUTH_TOKEN}
        )

    data = flow.async_update_reload_and_abort.call_args.kwargs["data"]
    assert CONF_MERAKI_API_KEY not in data
    assert data["token"]["access_token"] == "test-access-token"

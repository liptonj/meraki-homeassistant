"""Tests for the OAuth2 config flow."""

from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from homeassistant.config_entries import SOURCE_REAUTH
from homeassistant.data_entry_flow import AbortFlow

from custom_components.meraki_ha.config_flow import MerakiConfigFlow
from custom_components.meraki_ha.const import CONF_MERAKI_API_KEY, CONF_MERAKI_ORG_ID
from tests.const import MOCK_OAUTH_TOKEN


@pytest.fixture
def mock_hass() -> MagicMock:
    """Create a mock hass instance."""
    hass = MagicMock()
    hass.data = {}
    return hass


def test_config_flow_initialization() -> None:
    """Test config flow initializes with empty data."""
    flow = MerakiConfigFlow()
    assert flow.data == {}
    assert flow.options == {}
    assert flow.VERSION == 2


@pytest.mark.asyncio
async def test_async_step_user_missing_credentials(mock_hass: MagicMock) -> None:
    """Test user step aborts when Application Credentials are missing."""
    flow = MerakiConfigFlow()
    flow.hass = mock_hass

    with (
        patch(
            "homeassistant.helpers.config_entry_oauth2_flow.async_get_implementations",
            new=AsyncMock(return_value={}),
        ),
        patch(
            "homeassistant.helpers.config_entry_oauth2_flow.async_get_application_credentials",
            new=AsyncMock(return_value={"meraki_ha"}),
        ),
    ):
        result = await flow.async_step_user(None)

    assert result["type"] == "abort"
    assert result["reason"] == "missing_credentials"


@pytest.mark.asyncio
async def test_async_oauth_create_entry_single_org(mock_hass: MagicMock) -> None:
    """Test a single organization skips the picker."""
    flow = MerakiConfigFlow()
    flow.hass = mock_hass
    object.__setattr__(flow, "async_set_unique_id", AsyncMock())
    object.__setattr__(flow, "_abort_if_unique_id_configured", MagicMock())
    object.__setattr__(
        flow,
        "async_step_init",
        AsyncMock(return_value={"type": "form", "step_id": "init"}),
    )

    with patch(
        "custom_components.meraki_ha.config_flow.async_list_organizations",
        new=AsyncMock(return_value=[{"id": "123456", "name": "Test Org"}]),
    ):
        result = await flow.async_oauth_create_entry(
            {"auth_implementation": "meraki_ha", "token": MOCK_OAUTH_TOKEN}
        )

    assert flow.data[CONF_MERAKI_ORG_ID] == "123456"
    assert flow.data["org_name"] == "Test Org"
    assert result["step_id"] == "init"


@pytest.mark.asyncio
async def test_async_oauth_create_entry_multiple_orgs(mock_hass: MagicMock) -> None:
    """Test multiple organizations show a picker."""
    flow = MerakiConfigFlow()
    flow.hass = mock_hass
    object.__setattr__(
        flow,
        "async_show_form",
        MagicMock(return_value={"type": "form", "step_id": "pick_org"}),
    )

    with patch(
        "custom_components.meraki_ha.config_flow.async_list_organizations",
        new=AsyncMock(
            return_value=[
                {"id": "1", "name": "Org 1"},
                {"id": "2", "name": "Org 2"},
            ]
        ),
    ):
        result = await flow.async_oauth_create_entry(
            {"auth_implementation": "meraki_ha", "token": MOCK_OAUTH_TOKEN}
        )

    assert result["step_id"] == "pick_org"


@pytest.mark.asyncio
async def test_async_oauth_create_entry_no_orgs(mock_hass: MagicMock) -> None:
    """Test abort when the token has no organizations."""
    flow = MerakiConfigFlow()
    flow.hass = mock_hass
    object.__setattr__(
        flow, "async_abort", MagicMock(return_value={"type": "abort", "reason": "none"})
    )

    with patch(
        "custom_components.meraki_ha.config_flow.async_list_organizations",
        new=AsyncMock(return_value=[]),
    ):
        result = await flow.async_oauth_create_entry(
            {"auth_implementation": "meraki_ha", "token": MOCK_OAUTH_TOKEN}
        )

    flow.async_abort.assert_called_with(reason="no_organizations")
    assert result["type"] == "abort"


@pytest.mark.asyncio
async def test_pick_org_sets_unique_id(mock_hass: MagicMock) -> None:
    """Test picking an organization continues to network selection."""
    flow = MerakiConfigFlow()
    flow.hass = mock_hass
    flow._organizations = [
        {"id": "1", "name": "Org 1"},
        {"id": "2", "name": "Org 2"},
    ]
    object.__setattr__(flow, "async_set_unique_id", AsyncMock())
    object.__setattr__(flow, "_abort_if_unique_id_configured", MagicMock())
    object.__setattr__(
        flow,
        "async_step_init",
        AsyncMock(return_value={"type": "form", "step_id": "init"}),
    )

    result = await flow.async_step_pick_org({CONF_MERAKI_ORG_ID: "2"})

    assert flow.data[CONF_MERAKI_ORG_ID] == "2"
    assert flow.data["org_name"] == "Org 2"
    assert result["step_id"] == "init"


@pytest.mark.asyncio
async def test_async_step_init_creates_entry() -> None:
    """Test step init creates entry with valid input."""
    flow = MerakiConfigFlow()
    flow.data = {
        "org_name": "Test Org",
        "auth_implementation": "meraki_ha",
        "token": MOCK_OAUTH_TOKEN,
        CONF_MERAKI_ORG_ID: "123456",
    }
    flow.options = {}
    mock_async_create_entry = MagicMock(
        return_value={"type": "create_entry", "title": "Test Org"}
    )
    object.__setattr__(flow, "async_create_entry", mock_async_create_entry)

    await flow.async_step_init({"scan_interval": 60})

    assert flow.options["scan_interval"] == 60
    mock_async_create_entry.assert_called_once()


@pytest.mark.asyncio
async def test_async_step_init_fetches_networks(mock_hass: MagicMock) -> None:
    """Test step init fetches networks for selection."""
    flow = MerakiConfigFlow()
    flow.hass = mock_hass
    flow.data = {
        "token": MOCK_OAUTH_TOKEN,
        CONF_MERAKI_ORG_ID: "123456",
    }
    object.__setattr__(
        flow,
        "async_show_form",
        MagicMock(return_value={"type": "form", "step_id": "init"}),
    )

    mock_client = MagicMock()
    mock_client.async_setup = AsyncMock()
    mock_client.async_close = AsyncMock()
    mock_client.organization.get_organization_networks = AsyncMock(
        return_value=[
            {"id": "net_1", "name": "Network 1"},
            {"id": "net_2", "name": "Network 2"},
        ]
    )

    with patch(
        "custom_components.meraki_ha.config_flow.MerakiAPIClient",
        return_value=mock_client,
    ):
        result = await flow.async_step_init(None)

    assert result["type"] == "form"
    mock_client.async_setup.assert_called_once()
    mock_client.organization.get_organization_networks.assert_called_once()
    mock_client.async_close.assert_called_once()


def test_async_get_options_flow() -> None:
    """Test options flow is returned correctly."""
    mock_entry = MagicMock()
    mock_entry.options = {}

    options_flow = MerakiConfigFlow.async_get_options_flow(mock_entry)

    assert options_flow is not None


@pytest.mark.asyncio
async def test_reauth_confirm_shows_form(mock_hass: MagicMock) -> None:
    """Test reauth confirm form."""
    flow = MerakiConfigFlow()
    flow.hass = mock_hass
    reauth_entry = MagicMock()
    reauth_entry.data = {CONF_MERAKI_ORG_ID: "123456", "org_name": "Test Org"}
    object.__setattr__(flow, "_get_reauth_entry", MagicMock(return_value=reauth_entry))
    object.__setattr__(
        flow,
        "async_show_form",
        MagicMock(return_value={"type": "form", "step_id": "reauth_confirm"}),
    )

    result = await flow.async_step_reauth_confirm(None)

    assert result["step_id"] == "reauth_confirm"


@pytest.mark.asyncio
async def test_reauth_success_removes_api_key(mock_hass: MagicMock) -> None:
    """Test reauth stores tokens and drops the legacy API key."""
    flow = MerakiConfigFlow()
    flow.hass = mock_hass
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

    updated = flow.async_update_reload_and_abort.call_args.kwargs["data"]
    assert CONF_MERAKI_API_KEY not in updated
    assert updated["token"] == MOCK_OAUTH_TOKEN
    assert updated[CONF_MERAKI_ORG_ID] == "123456"


@pytest.mark.asyncio
async def test_reauth_org_mismatch(mock_hass: MagicMock) -> None:
    """Test reauth aborts when the token cannot see the configured org."""
    flow = MerakiConfigFlow()
    flow.hass = mock_hass
    flow.context = {"source": SOURCE_REAUTH}
    reauth_entry = MagicMock()
    reauth_entry.data = {CONF_MERAKI_ORG_ID: "123456"}
    object.__setattr__(flow, "_get_reauth_entry", MagicMock(return_value=reauth_entry))
    object.__setattr__(
        flow,
        "async_abort",
        MagicMock(return_value={"type": "abort", "reason": "org_mismatch"}),
    )

    with patch(
        "custom_components.meraki_ha.config_flow.async_list_organizations",
        new=AsyncMock(return_value=[{"id": "999", "name": "Other"}]),
    ):
        result = await flow.async_oauth_create_entry(
            {"auth_implementation": "meraki_ha", "token": MOCK_OAUTH_TOKEN}
        )

    flow.async_abort.assert_called_with(reason="org_mismatch")
    assert result["reason"] == "org_mismatch"


@pytest.mark.asyncio
async def test_async_step_reconfigure_no_entry(mock_hass: MagicMock) -> None:
    """Test reconfigure step aborts if entry not found."""
    flow = MerakiConfigFlow()
    flow.hass = mock_hass
    flow.hass.config_entries.async_get_entry = MagicMock(return_value=None)
    flow.context = {"entry_id": "test_entry"}
    mock_async_abort = MagicMock(return_value={"type": "abort"})
    object.__setattr__(flow, "async_abort", mock_async_abort)

    await flow.async_step_reconfigure(None)

    mock_async_abort.assert_called_once_with(reason="unknown_entry")


@pytest.mark.asyncio
async def test_already_configured_unique_id(mock_hass: MagicMock) -> None:
    """Test unique ID abort when the org is already configured."""
    flow = MerakiConfigFlow()
    flow.hass = mock_hass
    object.__setattr__(flow, "async_set_unique_id", AsyncMock())
    object.__setattr__(
        flow,
        "_abort_if_unique_id_configured",
        MagicMock(side_effect=AbortFlow("already_configured")),
    )

    with (
        patch(
            "custom_components.meraki_ha.config_flow.async_list_organizations",
            new=AsyncMock(return_value=[{"id": "123456", "name": "Test Org"}]),
        ),
        pytest.raises(AbortFlow),
    ):
        await flow.async_oauth_create_entry(
            {"auth_implementation": "meraki_ha", "token": MOCK_OAUTH_TOKEN}
        )

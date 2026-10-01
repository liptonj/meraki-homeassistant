"""Tests for the main __init__.py module."""

from collections.abc import Generator
from typing import Any
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from homeassistant.exceptions import ConfigEntryNotReady

from custom_components.meraki_ha import (
    _RELOAD_SNAPSHOT_KEY,
    _should_show_setup_notifications,
    async_reload_entry,
    async_remove_entry,
    async_setup_entry,
    async_unload_entry,
)
from custom_components.meraki_ha.const import (
    CONF_ENABLE_PUSH_API,
    CONF_ENABLE_SCANNING_API,
    CONF_ENABLE_WEBHOOKS,
    CONF_MERAKI_ORG_ID,
    CONF_SCANNING_API_VALIDATOR,
    CONF_SETUP_NOTIFICATION_SHOWN,
    DATA_CLIENT,
    DOMAIN,
)
from custom_components.meraki_ha.services.push_api import push_iname
from tests.const import MOCK_OAUTH_CONFIG_DATA


@pytest.fixture
def mock_hass() -> MagicMock:
    """Create a mock hass instance."""
    hass = MagicMock()
    hass.data = {}
    hass.config_entries = MagicMock()
    hass.config_entries.async_forward_entry_setups = AsyncMock()
    hass.config_entries.async_unload_platforms = AsyncMock(return_value=True)
    hass.states = MagicMock()
    hass.http = AsyncMock()
    hass.services = MagicMock()
    hass.services.async_call = AsyncMock()
    return hass


@pytest.fixture
def mock_config_entry() -> MagicMock:
    """Create a mock config entry."""
    entry = MagicMock()
    entry.entry_id = "test_entry"
    entry.data = dict(MOCK_OAUTH_CONFIG_DATA)
    entry.options = {}
    entry.domain = DOMAIN
    return entry


@pytest.fixture
def mock_oauth_session() -> Generator[MagicMock]:
    """Patch OAuth session creation during setup."""
    session = MagicMock()
    session.async_ensure_token_valid = AsyncMock()
    session.token = {"access_token": "test-access-token"}
    with patch(
        "custom_components.meraki_ha.async_create_oauth_session",
        new=AsyncMock(return_value=session),
    ):
        yield session


@pytest.mark.asyncio
async def test_async_setup_entry_missing_token(
    mock_hass: MagicMock,
) -> None:
    """Test setup fails closed when OAuth tokens are missing."""
    from homeassistant.exceptions import ConfigEntryAuthFailed

    mock_entry = MagicMock()
    mock_entry.entry_id = "test_entry"
    mock_entry.data = {CONF_MERAKI_ORG_ID: "test_org_id"}
    mock_entry.options = {}

    with pytest.raises(ConfigEntryAuthFailed):
        await async_setup_entry(mock_hass, mock_entry)


@pytest.mark.asyncio
async def test_async_setup_entry_success(
    mock_hass: MagicMock,
    mock_config_entry: MagicMock,
    mock_oauth_session: MagicMock,
) -> None:
    """Test successful setup entry."""
    mock_api_client = MagicMock()
    mock_api_client.async_setup = AsyncMock()

    mock_coordinator = MagicMock()
    mock_coordinator.async_config_entry_first_refresh = AsyncMock()
    mock_coordinator.data = {"networks": [], "devices": []}

    with (
        patch(
            "custom_components.meraki_ha.MerakiAPIClient",
            return_value=mock_api_client,
        ),
        patch(
            "custom_components.meraki_ha.meraki_data_coordinator.MerakiDataCoordinator",
            return_value=mock_coordinator,
        ),
        patch("homeassistant.core.HomeAssistant.http", new_callable=AsyncMock),
        patch(
            "custom_components.meraki_ha.MerakiRepository",
        ),
        patch(
            "custom_components.meraki_ha.CameraRepository",
        ),
        patch(
            "custom_components.meraki_ha.CameraService",
        ),
        patch(
            "custom_components.meraki_ha.DeviceControlService",
        ),
        patch(
            "custom_components.meraki_ha.NetworkControlService",
        ),
        patch(
            "custom_components.meraki_ha.DeviceDiscoveryService",
        ) as mock_discovery,
        patch("custom_components.meraki_ha.api.async_setup"),
        patch(
            "custom_components.meraki_ha.async_register_static_path",
        ),
        patch(
            "custom_components.meraki_ha.async_register_webhook",
        ),
        patch(
            "custom_components.meraki_ha.ha_webhook.async_register",
        ),
        patch(
            "custom_components.meraki_ha.ha_webhook.async_unregister",
        ),
    ):
        mock_discovery_instance = MagicMock()
        mock_discovery_instance.discover_entities = AsyncMock(return_value=[])
        mock_discovery.return_value = mock_discovery_instance

        result = await async_setup_entry(mock_hass, mock_config_entry)

    assert result is True
    assert DOMAIN in mock_hass.data
    assert mock_config_entry.entry_id in mock_hass.data[DOMAIN]


@pytest.mark.asyncio
async def test_async_setup_entry_coordinator_not_ready(
    mock_hass: MagicMock,
    mock_config_entry: MagicMock,
    mock_oauth_session: MagicMock,
) -> None:
    """Test setup raises ConfigEntryNotReady on coordinator failure."""
    mock_api_client = MagicMock()
    mock_api_client.async_setup = AsyncMock()

    mock_coordinator = MagicMock()
    mock_coordinator.async_config_entry_first_refresh = AsyncMock(
        side_effect=ConfigEntryNotReady("Failed to fetch data")
    )

    with (
        patch(
            "custom_components.meraki_ha.MerakiAPIClient",
            return_value=mock_api_client,
        ),
        patch(
            "custom_components.meraki_ha.meraki_data_coordinator.MerakiDataCoordinator",
            return_value=mock_coordinator,
        ),
        pytest.raises(ConfigEntryNotReady),
    ):
        await async_setup_entry(mock_hass, mock_config_entry)


@pytest.mark.asyncio
async def test_async_setup_entry_existing_coordinator(
    mock_hass: MagicMock,
    mock_config_entry: MagicMock,
) -> None:
    """Test setup entry uses existing coordinator if present."""
    mock_api_client = MagicMock()
    mock_api_client.async_setup = AsyncMock()

    mock_coordinator = MagicMock()
    mock_coordinator.async_refresh = AsyncMock()
    mock_coordinator.data = {"networks": [], "devices": []}

    # Pre-populate entry data
    mock_hass.data = {
        DOMAIN: {
            mock_config_entry.entry_id: {
                DATA_CLIENT: mock_api_client,
                "coordinator": mock_coordinator,
            }
        }
    }

    with (
        patch(
            "custom_components.meraki_ha.MerakiRepository",
        ),
        patch(
            "custom_components.meraki_ha.CameraRepository",
        ),
        patch(
            "custom_components.meraki_ha.CameraService",
        ),
        patch(
            "custom_components.meraki_ha.DeviceControlService",
        ),
        patch(
            "custom_components.meraki_ha.NetworkControlService",
        ),
        patch(
            "custom_components.meraki_ha.DeviceDiscoveryService",
        ) as mock_discovery,
        patch("custom_components.meraki_ha.api.async_setup"),
        patch(
            "custom_components.meraki_ha.async_register_static_path",
        ),
        patch(
            "custom_components.meraki_ha.async_register_webhook",
        ),
        patch(
            "custom_components.meraki_ha.ha_webhook.async_register",
        ),
        patch(
            "custom_components.meraki_ha.ha_webhook.async_unregister",
        ),
    ):
        mock_discovery_instance = MagicMock()
        mock_discovery_instance.discover_entities = AsyncMock(return_value=[])
        mock_discovery.return_value = mock_discovery_instance

        result = await async_setup_entry(mock_hass, mock_config_entry)

    assert result is True
    mock_coordinator.async_refresh.assert_called_once()


@pytest.mark.asyncio
async def test_async_unload_entry(
    mock_hass: MagicMock,
    mock_config_entry: MagicMock,
) -> None:
    """Test unload entry."""
    mock_coordinator = MagicMock()
    mock_web_server = MagicMock()
    mock_web_server.stop = AsyncMock()

    mock_hass.data = {
        DOMAIN: {
            mock_config_entry.entry_id: {
                "coordinator": mock_coordinator,
                "web_server": mock_web_server,
                "timed_access_manager": MagicMock(),
            }
        }
    }

    with (
        patch(
            "custom_components.meraki_ha.async_unregister_webhook",
        ),
        patch(
            "custom_components.meraki_ha.async_unregister_frontend",
        ),
    ):
        result = await async_unload_entry(mock_hass, mock_config_entry)

    assert result is True
    mock_web_server.stop.assert_called_once()


@pytest.mark.asyncio
async def test_async_unload_entry_no_web_server(
    mock_hass: MagicMock,
    mock_config_entry: MagicMock,
) -> None:
    """Test unload entry when no web server is present."""
    mock_coordinator = MagicMock()

    mock_hass.data = {
        DOMAIN: {
            mock_config_entry.entry_id: {
                "coordinator": mock_coordinator,
            }
        }
    }

    with (
        patch(
            "custom_components.meraki_ha.async_unregister_webhook",
        ),
        patch(
            "custom_components.meraki_ha.async_unregister_frontend",
        ),
        patch(
            "custom_components.meraki_ha.ha_webhook.async_unregister",
        ),
    ):
        result = await async_unload_entry(mock_hass, mock_config_entry)

    assert result is True


def _unload_entry_data() -> dict[str, Any]:
    client = MagicMock()
    client.async_close = AsyncMock()
    push_manager = MagicMock()
    push_manager.async_unregister = AsyncMock()
    webhook_manager = MagicMock()
    webhook_manager.async_unregister_webhooks = AsyncMock()
    return {
        DATA_CLIENT: client,
        "push_api_manager": push_manager,
        "webhook_manager": webhook_manager,
        "webhook_id": "alerts-hook",
    }


@pytest.mark.asyncio
@pytest.mark.parametrize("enabled", [True, False])
async def test_unload_keeps_dashboard_registrations_while_enabled(
    mock_hass: MagicMock,
    mock_config_entry: MagicMock,
    enabled: bool,
) -> None:
    """A reload keeps Push and alert registrations; disabling removes them."""
    mock_config_entry.options = {
        CONF_ENABLE_PUSH_API: enabled,
        CONF_ENABLE_WEBHOOKS: enabled,
    }
    entry_data = _unload_entry_data()
    mock_hass.data = {DOMAIN: {mock_config_entry.entry_id: entry_data}}

    with (
        patch("custom_components.meraki_ha.async_unregister_frontend"),
        patch("custom_components.meraki_ha.ha_webhook.async_unregister"),
    ):
        assert await async_unload_entry(mock_hass, mock_config_entry)

    push_calls = entry_data["push_api_manager"].async_unregister.await_count
    hook_calls = entry_data["webhook_manager"].async_unregister_webhooks.await_count
    assert push_calls == (0 if enabled else 1)
    assert hook_calls == (0 if enabled else 1)
    entry_data[DATA_CLIENT].async_close.assert_awaited_once()


@pytest.mark.asyncio
async def test_remove_entry_deletes_registrations_by_name(
    mock_hass: MagicMock,
    mock_config_entry: MagicMock,
    mock_oauth_session: MagicMock,
) -> None:
    """Removing the entry deletes only the registrations it named."""
    prefix = push_iname(mock_config_entry.entry_id, "")
    receiver = push_iname(mock_config_entry.entry_id, "receiver")
    short_id = mock_config_entry.entry_id[:8]

    client = MagicMock()
    client.async_setup = AsyncMock()
    client.async_close = AsyncMock()
    client.push.get_push_profiles = AsyncMock(
        return_value=[{"iname": f"{prefix}avail"}, {"iname": "other_profile"}]
    )
    client.push.get_receiver_profiles = AsyncMock(
        return_value=[{"iname": receiver}, {"iname": "other_receiver"}]
    )
    client.push.get_http_servers = AsyncMock(
        return_value=[
            {"id": "s1", "name": f"Home Assistant Push API - {short_id}"},
            {"id": "s2", "name": "Someone else"},
        ]
    )
    client.push.delete_push_profile = AsyncMock()
    client.push.delete_receiver_profile = AsyncMock()
    client.push.delete_http_server = AsyncMock()
    client.organization.get_organization_networks = AsyncMock(
        return_value=[{"id": "N_1"}]
    )
    client.network.find_webhook_by_name = AsyncMock(return_value={"id": "w1"})
    client.network.delete_webhook = AsyncMock()

    with patch("custom_components.meraki_ha.MerakiAPIClient", return_value=client):
        await async_remove_entry(mock_hass, mock_config_entry)

    client.push.delete_push_profile.assert_awaited_once_with(f"{prefix}avail")
    client.push.delete_receiver_profile.assert_awaited_once_with(receiver)
    client.push.delete_http_server.assert_awaited_once_with("s1")
    client.network.find_webhook_by_name.assert_awaited_once_with(
        "N_1", f"Home Assistant - {short_id}"
    )
    client.network.delete_webhook.assert_awaited_once_with("N_1", "w1")
    client.async_close.assert_awaited_once()


# =============================================================================
# Scanning API Webhook Registration Tests
# =============================================================================


@pytest.mark.asyncio
async def test_scanning_api_webhook_registered_when_enabled(
    mock_hass: MagicMock,
    mock_config_entry: MagicMock,
    mock_oauth_session: MagicMock,
) -> None:
    """Test HA webhook is registered when Scanning API is enabled with validator."""
    mock_api_client = MagicMock()
    mock_api_client.async_setup = AsyncMock()

    mock_coordinator = MagicMock()
    mock_coordinator.async_config_entry_first_refresh = AsyncMock()
    mock_coordinator.data = {"networks": [], "devices": []}

    # Enable Scanning API with a validator
    mock_config_entry.options = {
        CONF_ENABLE_SCANNING_API: True,
        CONF_SCANNING_API_VALIDATOR: "test_validator_12345",
    }

    mock_ha_webhook_register = MagicMock()

    with (
        patch(
            "custom_components.meraki_ha.MerakiAPIClient",
            return_value=mock_api_client,
        ),
        patch(
            "custom_components.meraki_ha.meraki_data_coordinator.MerakiDataCoordinator",
            return_value=mock_coordinator,
        ),
        patch("custom_components.meraki_ha.MerakiRepository"),
        patch("custom_components.meraki_ha.CameraRepository"),
        patch("custom_components.meraki_ha.CameraService"),
        patch("custom_components.meraki_ha.DeviceControlService"),
        patch("custom_components.meraki_ha.NetworkControlService"),
        patch("custom_components.meraki_ha.DeviceDiscoveryService") as mock_discovery,
        patch("custom_components.meraki_ha.api.async_setup"),
        patch("custom_components.meraki_ha.async_register_static_path"),
        patch("custom_components.meraki_ha.async_register_webhook"),
        patch(
            "custom_components.meraki_ha.ha_webhook.async_register",
            mock_ha_webhook_register,
        ),
        patch("custom_components.meraki_ha.ha_webhook.async_unregister"),
    ):
        mock_discovery_instance = MagicMock()
        mock_discovery_instance.discover_entities = AsyncMock(return_value=[])
        mock_discovery.return_value = mock_discovery_instance

        await async_setup_entry(mock_hass, mock_config_entry)

    # Verify HA webhook was registered with correct unique ID
    mock_ha_webhook_register.assert_called_once()
    call_args = mock_ha_webhook_register.call_args
    assert call_args[0][0] == mock_hass  # hass
    assert call_args[0][1] == DOMAIN  # domain
    assert call_args[0][2] == "Meraki Scanning API"  # name
    # Webhook ID should be entry_id + "_scanning" to prevent conflicts
    expected_webhook_id = f"{mock_config_entry.entry_id}_scanning"
    assert call_args[0][3] == expected_webhook_id


@pytest.mark.asyncio
async def test_scanning_api_webhook_not_registered_when_disabled(
    mock_hass: MagicMock,
    mock_config_entry: MagicMock,
    mock_oauth_session: MagicMock,
) -> None:
    """Test that Scanning API webhook is NOT registered when disabled."""
    mock_api_client = MagicMock()
    mock_api_client.async_setup = AsyncMock()

    mock_coordinator = MagicMock()
    mock_coordinator.async_config_entry_first_refresh = AsyncMock()
    mock_coordinator.data = {"networks": [], "devices": []}

    # Scanning API disabled (default)
    mock_config_entry.options = {
        CONF_ENABLE_SCANNING_API: False,
    }

    mock_ha_webhook_register = MagicMock()

    with (
        patch(
            "custom_components.meraki_ha.MerakiAPIClient",
            return_value=mock_api_client,
        ),
        patch(
            "custom_components.meraki_ha.meraki_data_coordinator.MerakiDataCoordinator",
            return_value=mock_coordinator,
        ),
        patch("custom_components.meraki_ha.MerakiRepository"),
        patch("custom_components.meraki_ha.CameraRepository"),
        patch("custom_components.meraki_ha.CameraService"),
        patch("custom_components.meraki_ha.DeviceControlService"),
        patch("custom_components.meraki_ha.NetworkControlService"),
        patch("custom_components.meraki_ha.DeviceDiscoveryService") as mock_discovery,
        patch("custom_components.meraki_ha.api.async_setup"),
        patch("custom_components.meraki_ha.async_register_static_path"),
        patch("custom_components.meraki_ha.async_register_webhook"),
        patch(
            "custom_components.meraki_ha.ha_webhook.async_register",
            mock_ha_webhook_register,
        ),
        patch("custom_components.meraki_ha.ha_webhook.async_unregister"),
    ):
        mock_discovery_instance = MagicMock()
        mock_discovery_instance.discover_entities = AsyncMock(return_value=[])
        mock_discovery.return_value = mock_discovery_instance

        await async_setup_entry(mock_hass, mock_config_entry)

    # Verify HA webhook was NOT registered for Scanning API
    # (may be called for legacy alerts, but not with "Meraki Scanning API" name)
    for call in mock_ha_webhook_register.call_args_list:
        assert call[0][2] != "Meraki Scanning API"


@pytest.mark.asyncio
async def test_scanning_api_webhook_not_registered_without_validator(
    mock_hass: MagicMock,
    mock_config_entry: MagicMock,
    mock_oauth_session: MagicMock,
) -> None:
    """Test that webhook is NOT registered when enabled but validator is missing."""
    mock_api_client = MagicMock()
    mock_api_client.async_setup = AsyncMock()

    mock_coordinator = MagicMock()
    mock_coordinator.async_config_entry_first_refresh = AsyncMock()
    mock_coordinator.data = {"networks": [], "devices": []}

    # Scanning API enabled but NO validator
    mock_config_entry.options = {
        CONF_ENABLE_SCANNING_API: True,
        CONF_SCANNING_API_VALIDATOR: "",  # Empty validator
    }

    mock_ha_webhook_register = MagicMock()

    with (
        patch(
            "custom_components.meraki_ha.MerakiAPIClient",
            return_value=mock_api_client,
        ),
        patch(
            "custom_components.meraki_ha.meraki_data_coordinator.MerakiDataCoordinator",
            return_value=mock_coordinator,
        ),
        patch("custom_components.meraki_ha.MerakiRepository"),
        patch("custom_components.meraki_ha.CameraRepository"),
        patch("custom_components.meraki_ha.CameraService"),
        patch("custom_components.meraki_ha.DeviceControlService"),
        patch("custom_components.meraki_ha.NetworkControlService"),
        patch("custom_components.meraki_ha.DeviceDiscoveryService") as mock_discovery,
        patch("custom_components.meraki_ha.api.async_setup"),
        patch("custom_components.meraki_ha.api.legacy.async_setup_websocket_api"),
        patch("custom_components.meraki_ha.async_register_static_path"),
        patch("custom_components.meraki_ha.async_register_webhook"),
        patch(
            "custom_components.meraki_ha.ha_webhook.async_register",
            mock_ha_webhook_register,
        ),
        patch("custom_components.meraki_ha.ha_webhook.async_unregister"),
    ):
        mock_discovery_instance = MagicMock()
        mock_discovery_instance.discover_entities = AsyncMock(return_value=[])
        mock_discovery.return_value = mock_discovery_instance

        await async_setup_entry(mock_hass, mock_config_entry)

    # Verify Scanning API webhook was NOT registered (no validator)
    for call in mock_ha_webhook_register.call_args_list:
        assert call[0][2] != "Meraki Scanning API"


# =============================================================================
# Reload-on-token-refresh regression tests
# =============================================================================


@pytest.fixture
def mock_reload_entry() -> MagicMock:
    """Create a mock config entry for update-listener tests."""
    entry = MagicMock()
    entry.entry_id = "test_entry"
    entry.data = dict(MOCK_OAUTH_CONFIG_DATA)
    entry.options = {}
    entry.domain = DOMAIN
    return entry


def _snapshot_for(entry: MagicMock) -> dict:
    """Build the reload snapshot `async_setup_entry` would have stored."""
    return {
        "options": dict(entry.options),
        "data": {k: v for k, v in dict(entry.data).items() if k != "token"},
    }


@pytest.mark.asyncio
async def test_no_reload_on_token_only_data_change(
    mock_hass: MagicMock, mock_reload_entry: MagicMock
) -> None:
    """A token-only `entry.data` change (an OAuth refresh) must not reload."""
    mock_hass.data = {
        DOMAIN: {
            mock_reload_entry.entry_id: {
                _RELOAD_SNAPSHOT_KEY: _snapshot_for(mock_reload_entry),
            }
        }
    }
    mock_hass.config_entries.async_reload = AsyncMock()

    # Simulate HA's OAuth2Session refreshing the access token.
    mock_reload_entry.data = {
        **mock_reload_entry.data,
        "token": {"access_token": "new-refreshed-token"},
    }

    await async_reload_entry(mock_hass, mock_reload_entry)

    mock_hass.config_entries.async_reload.assert_not_called()


@pytest.mark.asyncio
async def test_reload_on_options_change(
    mock_hass: MagicMock, mock_reload_entry: MagicMock
) -> None:
    """A change to `entry.options` must still trigger a reload."""
    mock_hass.data = {
        DOMAIN: {
            mock_reload_entry.entry_id: {
                _RELOAD_SNAPSHOT_KEY: _snapshot_for(mock_reload_entry),
            }
        }
    }
    mock_hass.config_entries.async_reload = AsyncMock()

    mock_reload_entry.options = {"scan_interval": 120}

    await async_reload_entry(mock_hass, mock_reload_entry)

    mock_hass.config_entries.async_reload.assert_called_once_with(
        mock_reload_entry.entry_id
    )


@pytest.mark.asyncio
async def test_reload_on_relevant_data_change(
    mock_hass: MagicMock, mock_reload_entry: MagicMock
) -> None:
    """A change to config data outside the ignored keys must still reload."""
    mock_hass.data = {
        DOMAIN: {
            mock_reload_entry.entry_id: {
                _RELOAD_SNAPSHOT_KEY: _snapshot_for(mock_reload_entry),
            }
        }
    }
    mock_hass.config_entries.async_reload = AsyncMock()

    mock_reload_entry.data = {**mock_reload_entry.data, CONF_MERAKI_ORG_ID: "new-org"}

    await async_reload_entry(mock_hass, mock_reload_entry)

    mock_hass.config_entries.async_reload.assert_called_once_with(
        mock_reload_entry.entry_id
    )


@pytest.mark.asyncio
async def test_reload_defaults_to_reload_without_snapshot(
    mock_hass: MagicMock, mock_reload_entry: MagicMock
) -> None:
    """With no snapshot recorded yet, reload defensively rather than skip."""
    mock_hass.data = {DOMAIN: {mock_reload_entry.entry_id: {}}}
    mock_hass.config_entries.async_reload = AsyncMock()

    await async_reload_entry(mock_hass, mock_reload_entry)

    mock_hass.config_entries.async_reload.assert_called_once_with(
        mock_reload_entry.entry_id
    )


# =============================================================================
# One-time setup notification tests
# =============================================================================


def test_should_show_notifications_for_fresh_entry() -> None:
    """A freshly created entry (marker False) should show notifications."""
    entry = MagicMock()
    entry.data = {CONF_SETUP_NOTIFICATION_SHOWN: False}
    assert _should_show_setup_notifications(entry) is True


def test_should_not_show_notifications_once_marked_shown() -> None:
    """An entry already marked as notified must not be notified again."""
    entry = MagicMock()
    entry.data = {CONF_SETUP_NOTIFICATION_SHOWN: True}
    assert _should_show_setup_notifications(entry) is False


def test_should_not_show_notifications_for_existing_install() -> None:
    """An entry that predates the marker (existing install) is not renotified."""
    entry = MagicMock()
    entry.data = dict(MOCK_OAUTH_CONFIG_DATA)  # No marker key at all.
    assert CONF_SETUP_NOTIFICATION_SHOWN not in entry.data
    assert _should_show_setup_notifications(entry) is False


@pytest.mark.asyncio
async def test_notifications_shown_once_on_first_setup(
    mock_hass: MagicMock,
    mock_oauth_session: MagicMock,
) -> None:
    """A brand-new entry gets its setup notifications on first setup only."""
    mock_entry = MagicMock()
    mock_entry.entry_id = "test_entry"
    mock_entry.data = {**MOCK_OAUTH_CONFIG_DATA, CONF_SETUP_NOTIFICATION_SHOWN: False}
    mock_entry.options = {}
    mock_entry.domain = DOMAIN

    mock_api_client = MagicMock()
    mock_api_client.async_setup = AsyncMock()

    mock_coordinator = MagicMock()
    mock_coordinator.async_config_entry_first_refresh = AsyncMock()
    mock_coordinator.data = {"networks": [], "devices": []}

    with (
        patch(
            "custom_components.meraki_ha.MerakiAPIClient",
            return_value=mock_api_client,
        ),
        patch(
            "custom_components.meraki_ha.meraki_data_coordinator.MerakiDataCoordinator",
            return_value=mock_coordinator,
        ),
        patch("custom_components.meraki_ha.MerakiRepository"),
        patch("custom_components.meraki_ha.CameraRepository"),
        patch("custom_components.meraki_ha.CameraService"),
        patch("custom_components.meraki_ha.DeviceControlService"),
        patch("custom_components.meraki_ha.NetworkControlService"),
        patch("custom_components.meraki_ha.DeviceDiscoveryService") as mock_discovery,
        patch("custom_components.meraki_ha.api.async_setup"),
        patch("custom_components.meraki_ha.async_register_static_path"),
        patch("custom_components.meraki_ha.async_register_webhook"),
        patch("custom_components.meraki_ha.ha_webhook.async_register"),
        patch("custom_components.meraki_ha.ha_webhook.async_unregister"),
    ):
        mock_discovery_instance = MagicMock()
        mock_discovery_instance.discover_entities = AsyncMock(return_value=[])
        mock_discovery.return_value = mock_discovery_instance

        await async_setup_entry(mock_hass, mock_entry)

    notification_titles = [
        call.args[2]["title"]
        for call in mock_hass.services.async_call.call_args_list
        if call.args[0] == "persistent_notification" and call.args[1] == "create"
    ]
    assert "🚀 Meraki Integration Ready" in notification_titles
    assert "📊 Create Your Meraki Dashboard" in notification_titles

    # The marker must be persisted so a later reload does not renotify.
    update_calls = mock_hass.config_entries.async_update_entry.call_args_list
    marker_updates = [
        call
        for call in update_calls
        if call.kwargs.get("data", {}).get(CONF_SETUP_NOTIFICATION_SHOWN) is True
    ]
    assert marker_updates, "Expected the setup-notification marker to be persisted"


@pytest.mark.asyncio
async def test_notifications_not_shown_for_existing_install(
    mock_hass: MagicMock,
    mock_config_entry: MagicMock,
    mock_oauth_session: MagicMock,
) -> None:
    """An existing install upgrading to this version is not renotified."""
    # mock_config_entry.data has no CONF_SETUP_NOTIFICATION_SHOWN key at all,
    # simulating an entry created before this marker existed.
    assert CONF_SETUP_NOTIFICATION_SHOWN not in mock_config_entry.data

    mock_api_client = MagicMock()
    mock_api_client.async_setup = AsyncMock()

    mock_coordinator = MagicMock()
    mock_coordinator.async_config_entry_first_refresh = AsyncMock()
    mock_coordinator.data = {"networks": [], "devices": []}

    with (
        patch(
            "custom_components.meraki_ha.MerakiAPIClient",
            return_value=mock_api_client,
        ),
        patch(
            "custom_components.meraki_ha.meraki_data_coordinator.MerakiDataCoordinator",
            return_value=mock_coordinator,
        ),
        patch("custom_components.meraki_ha.MerakiRepository"),
        patch("custom_components.meraki_ha.CameraRepository"),
        patch("custom_components.meraki_ha.CameraService"),
        patch("custom_components.meraki_ha.DeviceControlService"),
        patch("custom_components.meraki_ha.NetworkControlService"),
        patch("custom_components.meraki_ha.DeviceDiscoveryService") as mock_discovery,
        patch("custom_components.meraki_ha.api.async_setup"),
        patch("custom_components.meraki_ha.async_register_static_path"),
        patch("custom_components.meraki_ha.async_register_webhook"),
        patch("custom_components.meraki_ha.ha_webhook.async_register"),
        patch("custom_components.meraki_ha.ha_webhook.async_unregister"),
    ):
        mock_discovery_instance = MagicMock()
        mock_discovery_instance.discover_entities = AsyncMock(return_value=[])
        mock_discovery.return_value = mock_discovery_instance

        await async_setup_entry(mock_hass, mock_config_entry)

    notification_titles = [
        call.args[2]["title"]
        for call in mock_hass.services.async_call.call_args_list
        if call.args[0] == "persistent_notification" and call.args[1] == "create"
    ]
    assert "🚀 Meraki Integration Ready" not in notification_titles
    assert "📊 Create Your Meraki Dashboard" not in notification_titles

    # Still migrated to carry the marker going forward.
    update_calls = mock_hass.config_entries.async_update_entry.call_args_list
    marker_updates = [
        call
        for call in update_calls
        if call.kwargs.get("data", {}).get(CONF_SETUP_NOTIFICATION_SHOWN) is True
    ]
    assert marker_updates, "Expected the setup-notification marker to be persisted"


@pytest.mark.asyncio
async def test_scanning_api_webhook_unregistered_on_unload(
    mock_hass: MagicMock,
    mock_config_entry: MagicMock,
) -> None:
    """Test that Scanning API webhook is unregistered on entry unload."""
    mock_coordinator = MagicMock()

    # Simulate that scanning webhook was registered during setup
    scanning_webhook_id = mock_config_entry.entry_id
    mock_hass.data = {
        DOMAIN: {
            mock_config_entry.entry_id: {
                "coordinator": mock_coordinator,
                "scanning_webhook_id": scanning_webhook_id,
            }
        }
    }

    mock_ha_webhook_unregister = MagicMock()

    with (
        patch("custom_components.meraki_ha.async_unregister_webhook"),
        patch("custom_components.meraki_ha.async_unregister_frontend"),
        patch(
            "custom_components.meraki_ha.ha_webhook.async_unregister",
            mock_ha_webhook_unregister,
        ),
    ):
        result = await async_unload_entry(mock_hass, mock_config_entry)

    assert result is True
    # Verify webhook was unregistered with the correct ID
    mock_ha_webhook_unregister.assert_called_once_with(mock_hass, scanning_webhook_id)

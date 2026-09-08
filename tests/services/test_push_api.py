"""Tests for Push API topic auto-creation."""

from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from aiohttp.web import Response

from custom_components.meraki_ha.const import (
    CONF_ENABLE_PUSH_API,
    CONF_PUSH_API_AUTO_REGISTER,
    CONF_PUSH_API_TOPICS,
    CONF_WEBHOOK_SHARED_SECRET,
    PUSH_TOPIC_CONFIG_CHANGES,
    PUSH_TOPIC_DEVICE_AVAILABILITY,
)
from custom_components.meraki_ha.core.api.endpoints.push import (
    PushApiEndpoints,
    _unwrap_items,
)
from custom_components.meraki_ha.handlers.push_api import async_handle_push_message
from custom_components.meraki_ha.services.push_api import (
    PushApiManager,
    push_iname,
    topic_profile_iname,
)
from custom_components.meraki_ha.webhook import async_handle_push_webhook


def test_unwrap_items_list() -> None:
    """Unwrap a bare list response."""
    assert _unwrap_items([{"topicId": "a"}]) == [{"topicId": "a"}]


def test_unwrap_items_wrapped() -> None:
    """Unwrap an items envelope."""
    assert _unwrap_items({"items": [{"topicId": "a"}]}) == [{"topicId": "a"}]


def test_iname_helpers_are_stable() -> None:
    """Inames are lowercase, durable, and unique per entry."""
    assert push_iname("ABC-123", "receiver") == "ha_abc123_receiver"
    assert "organizationconfigurationchanges" in topic_profile_iname(
        "ABC-123", PUSH_TOPIC_CONFIG_CHANGES
    )


@pytest.fixture
def mock_api() -> MagicMock:
    """Create a mock API client with Push endpoints."""
    api = MagicMock()
    api.push = MagicMock()
    api.push.get_push_topics = AsyncMock(
        return_value=[
            {"topicId": PUSH_TOPIC_DEVICE_AVAILABILITY},
            {"topicId": PUSH_TOPIC_CONFIG_CHANGES},
        ]
    )
    api.push.get_http_servers = AsyncMock(return_value=[])
    api.push.create_http_server = AsyncMock(return_value={"id": "http_1"})
    api.push.get_receiver_profiles = AsyncMock(return_value=[])
    api.push.create_receiver_profile = AsyncMock(
        return_value={"iname": "ha_testentryid_receiver"}
    )
    api.push.get_push_profiles = AsyncMock(return_value=[])
    api.push.create_push_profile = AsyncMock(
        side_effect=lambda **kwargs: {"iname": kwargs["iname"]}
    )
    return api


@pytest.fixture
def mock_entry() -> MagicMock:
    """Create a config entry with Push API enabled."""
    entry = MagicMock()
    entry.entry_id = "test_entry_id"
    entry.options = {
        CONF_ENABLE_PUSH_API: True,
        CONF_PUSH_API_AUTO_REGISTER: True,
        CONF_PUSH_API_TOPICS: [
            PUSH_TOPIC_DEVICE_AVAILABILITY,
            PUSH_TOPIC_CONFIG_CHANGES,
        ],
        CONF_WEBHOOK_SHARED_SECRET: "secret",
    }
    entry.data = {"secret": "secret"}
    return entry


async def test_push_manager_creates_both_topic_profiles(
    mock_api: MagicMock, mock_entry: MagicMock
) -> None:
    """Auto-register creates a push profile for each available requested topic."""
    hass = MagicMock()
    manager = PushApiManager(hass, mock_api, mock_entry)

    with patch(
        "custom_components.meraki_ha.services.push_api.get_webhook_url",
        return_value="https://ha.example.com/api/webhook/test_entry_id_push",
    ):
        result = await manager.async_register()

    assert result is True
    assert PUSH_TOPIC_DEVICE_AVAILABILITY in manager.status["subscribed_topics"]
    assert PUSH_TOPIC_CONFIG_CHANGES in manager.status["subscribed_topics"]
    assert mock_api.push.create_push_profile.await_count == 2


async def test_push_manager_skips_unavailable_topics(
    mock_api: MagicMock, mock_entry: MagicMock
) -> None:
    """Topics not returned by the org are skipped, not created."""
    mock_api.push.get_push_topics = AsyncMock(
        return_value=[{"topicId": PUSH_TOPIC_DEVICE_AVAILABILITY}]
    )
    hass = MagicMock()
    manager = PushApiManager(hass, mock_api, mock_entry)

    with patch(
        "custom_components.meraki_ha.services.push_api.get_webhook_url",
        return_value="https://ha.example.com/api/webhook/test_entry_id_push",
    ):
        result = await manager.async_register()

    assert result is True
    assert manager.status["subscribed_topics"] == [PUSH_TOPIC_DEVICE_AVAILABILITY]
    assert PUSH_TOPIC_CONFIG_CHANGES in manager.status["skipped_topics"]
    assert mock_api.push.create_push_profile.await_count == 1


async def test_push_manager_reuses_existing_topic_profile(
    mock_api: MagicMock, mock_entry: MagicMock
) -> None:
    """Existing inames are reused instead of creating duplicates."""
    avail_iname = topic_profile_iname("test_entry_id", PUSH_TOPIC_DEVICE_AVAILABILITY)
    config_iname = topic_profile_iname("test_entry_id", PUSH_TOPIC_CONFIG_CHANGES)
    mock_api.push.get_push_profiles = AsyncMock(
        return_value=[{"iname": avail_iname}, {"iname": config_iname}]
    )
    hass = MagicMock()
    manager = PushApiManager(hass, mock_api, mock_entry)

    with patch(
        "custom_components.meraki_ha.services.push_api.get_webhook_url",
        return_value="https://ha.example.com/api/webhook/test_entry_id_push",
    ):
        result = await manager.async_register()

    assert result is True
    mock_api.push.create_push_profile.assert_not_called()


async def test_push_endpoints_create_profile_uses_sdk() -> None:
    """Endpoint wrapper forwards create profile to the Meraki SDK."""
    client = MagicMock()
    client.organization_id = "org1"
    client.dashboard = MagicMock()
    client.dashboard.organizations.createOrganizationApiPushProfile = AsyncMock(
        return_value={"iname": "ha_profile"}
    )
    endpoints = PushApiEndpoints(client)
    result = await endpoints.create_push_profile(
        iname="ha_profile",
        name="Home Assistant configuration changes",
        topic_id=PUSH_TOPIC_CONFIG_CHANGES,
        receiver_iname="ha_receiver",
    )
    assert result["iname"] == "ha_profile"
    client.dashboard.organizations.createOrganizationApiPushProfile.assert_awaited_once()


async def test_availability_item_updates_device() -> None:
    """Availability items update device status immediately."""
    coordinator = MagicMock()
    coordinator.hass = MagicMock()
    coordinator.hass.async_create_task = MagicMock()
    coordinator._targeted_device_refresh = AsyncMock()

    await async_handle_push_message(
        coordinator,
        {
            "topic": PUSH_TOPIC_DEVICE_AVAILABILITY,
            "items": [{"serial": "Q2XX-AAAA-BBBB", "status": "offline"}],
            "meta": {"source": {"profile": {"iname": "ha_avail"}}},
        },
    )
    coordinator._update_device_status_immediate.assert_called_once_with(
        "Q2XX-AAAA-BBBB", False
    )
    coordinator.async_update_listeners.assert_called_once()


async def test_config_change_item_refreshes_ssid() -> None:
    """SSID configuration changes trigger a targeted SSID refresh."""
    coordinator = MagicMock()
    coordinator.hass = MagicMock()
    coordinator.hass.async_create_task = MagicMock()
    coordinator._targeted_ssid_refresh = AsyncMock()

    await async_handle_push_message(
        coordinator,
        {
            "items": [
                {
                    "networkId": "N_123",
                    "page": "SSID",
                    "label": "Name",
                }
            ],
            "meta": {
                "source": {
                    "profile": {"iname": "ha_x_organizationconfigurationchanges"}
                }
            },
        },
    )
    coordinator.hass.async_create_task.assert_called_once()


async def test_heartbeat_is_ignored() -> None:
    """Heartbeat messages do not update devices."""
    coordinator = MagicMock()
    await async_handle_push_message(
        coordinator, {"topic": "heartbeat", "items": [], "meta": {}}
    )
    coordinator._update_device_status_immediate.assert_not_called()


async def test_push_webhook_routes_valid_payload() -> None:
    """HA webhook handler validates secret and marks the manager."""
    hass = MagicMock()
    entry = MagicMock()
    entry.entry_id = "abc"
    entry.options = {CONF_WEBHOOK_SHARED_SECRET: "secret"}
    entry.data = {}
    hass.config_entries.async_get_entry.return_value = entry
    manager = MagicMock()
    coordinator = MagicMock()
    coordinator.mark_push_received = MagicMock()
    hass.data = {
        "meraki_ha": {
            "abc": {"push_api_manager": manager, "coordinator": coordinator},
        }
    }
    request = MagicMock()
    request.json = AsyncMock(
        return_value={"topic": "heartbeat", "items": [], "sharedSecret": "secret"}
    )

    with patch(
        "custom_components.meraki_ha.webhook.async_handle_push_message",
        new_callable=AsyncMock,
    ) as handle:
        response = await async_handle_push_webhook(hass, "abc_push", request)

    assert isinstance(response, Response)
    assert response.status == 200
    manager.mark_message_received.assert_called_once()
    coordinator.mark_push_received.assert_called_once()
    handle.assert_awaited_once()

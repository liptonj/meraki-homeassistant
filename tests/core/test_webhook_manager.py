"""Tests for the WebhookManager class."""

from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from custom_components.meraki_ha.core.webhook_manager import WebhookManager


@pytest.fixture
def mock_api_client() -> AsyncMock:
    """Fixture for a mocked MerakiAPIClient."""
    client = AsyncMock()
    client.get_enabled_network_ids.return_value = ["N_12345"]
    client.get_network_webhooks_http_servers.return_value = []
    client.create_network_webhooks_http_server.return_value = {"id": "httpserver_1"}
    return client


@pytest.fixture
def mock_hass() -> MagicMock:
    """Fixture for a mocked Home Assistant instance."""
    hass = MagicMock()
    hass.config_entries.async_get_entry.return_value = MagicMock()
    return hass


@pytest.fixture
def mock_config_entry() -> MagicMock:
    """Fixture for a mocked ConfigEntry."""
    entry = MagicMock()
    entry.entry_id = "test_entry"
    entry.options = {
        "webhook_auto_register": True,
        "webhook_shared_secret": "test_secret",
        "webhook_alert_types": ["gatewayDown", "switchDown"],
    }
    return entry


async def test_register_webhooks_success(
    mock_hass, mock_api_client, mock_config_entry
):
    """Test successful webhook registration."""
    with patch(
        "custom_components.meraki_ha.core.webhook_manager.get_webhook_url",
        return_value="https://example.com/webhook",
    ):
        manager = WebhookManager(mock_hass, mock_api_client, mock_config_entry)
        result = await manager.async_register_webhooks()

        assert result is True
        mock_api_client.create_network_webhooks_http_server.assert_called_once()
        mock_api_client.update_network_alerts_settings.assert_called_once()


async def test_register_webhooks_auto_register_disabled(
    mock_hass, mock_api_client, mock_config_entry
):
    """Test webhook registration when auto-register is disabled."""
    mock_config_entry.options["webhook_auto_register"] = False
    manager = WebhookManager(mock_hass, mock_api_client, mock_config_entry)
    result = await manager.async_register_webhooks()

    assert result is True
    mock_api_client.create_network_webhooks_http_server.assert_not_called()


async def test_unregister_webhooks_multiple_networks(
    mock_hass, mock_api_client, mock_config_entry
):
    """Test successful webhook unregistration across multiple networks."""
    manager = WebhookManager(mock_hass, mock_api_client, mock_config_entry)
    manager._http_server_ids = {
        "N_12345": "httpserver_1",
        "N_67890": "httpserver_2",
    }
    await manager.async_unregister_webhooks()

    assert mock_api_client.delete_network_webhooks_http_server.call_count == 2
    mock_api_client.delete_network_webhooks_http_server.assert_any_call(
        "N_12345", "httpserver_1"
    )
    mock_api_client.delete_network_webhooks_http_server.assert_any_call(
        "N_67890", "httpserver_2"
    )

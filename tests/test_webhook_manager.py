"""Tests for the WebhookManager."""

from unittest.mock import AsyncMock, MagicMock

import pytest
from meraki_sdk.exceptions import APIError

from custom_components.meraki_ha.webhook_manager import WebhookManager


@pytest.fixture
def mock_hass():
    """Fixture for a mocked Home Assistant instance."""
    return MagicMock()


@pytest.fixture
def mock_api_client():
    """Fixture for a mocked MerakiAPIClient."""
    client = MagicMock()
    client.dashboard.webhooks.getNetworkWebhooksHttpServers = AsyncMock(return_value=[])
    client.dashboard.webhooks.createNetworkWebhooksHttpServer = AsyncMock(
        return_value={"id": "123"}
    )
    client.dashboard.alerts.getNetworkAlertsSettings = AsyncMock(
        return_value={"defaultDestinations": {}, "alerts": []}
    )
    client.dashboard.alerts.updateNetworkAlertsSettings = AsyncMock()
    return client


@pytest.mark.asyncio
async def test_register_webhooks_create_new(mock_hass, mock_api_client):
    """Test webhook registration creates a new server."""
    manager = WebhookManager(mock_hass, mock_api_client, "N_123")
    result = await manager.async_register_webhooks(
        "http://test.com", "secret", ["gatewayDown"]
    )

    assert result["success"] is True
    mock_api_client.dashboard.webhooks.createNetworkWebhooksHttpServer.assert_called_once()
    mock_api_client.dashboard.alerts.updateNetworkAlertsSettings.assert_called_once()


@pytest.mark.asyncio
async def test_register_webhooks_update_existing(mock_hass, mock_api_client):
    """Test webhook registration updates an existing server."""
    mock_api_client.dashboard.webhooks.getNetworkWebhooksHttpServers.return_value = [
        {"id": "456", "name": "Home Assistant Meraki Integration"}
    ]
    manager = WebhookManager(mock_hass, mock_api_client, "N_123")
    await manager.async_register_webhooks("http://test.com", "secret", ["gatewayDown"])

    mock_api_client.dashboard.webhooks.updateNetworkWebhooksHttpServer.assert_called_once()


@pytest.mark.asyncio
async def test_register_webhooks_read_only_key(mock_hass, mock_api_client):
    """Test webhook registration with a read-only API key."""
    mock_api_client.dashboard.webhooks.createNetworkWebhooksHttpServer.side_effect = (
        APIError(MagicMock(status=403), "Forbidden")
    )
    manager = WebhookManager(mock_hass, mock_api_client, "N_123")
    result = await manager.async_register_webhooks(
        "http://test.com", "secret", ["gatewayDown"]
    )

    assert result["success"] is False
    assert result["manual_setup_required"] is True


@pytest.mark.asyncio
async def test_unregister_webhooks(mock_hass, mock_api_client):
    """Test webhook unregistration."""
    mock_api_client.dashboard.webhooks.getNetworkWebhooksHttpServers.return_value = [
        {"id": "456", "name": "Home Assistant Meraki Integration"}
    ]
    manager = WebhookManager(mock_hass, mock_api_client, "N_123")
    await manager.async_unregister_webhooks()

    mock_api_client.dashboard.webhooks.deleteNetworkWebhooksHttpServer.assert_called_once_with(
        networkId="N_123", httpServerId="456"
    )

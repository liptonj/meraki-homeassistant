"""Tests for the Network Endpoints."""

from unittest.mock import AsyncMock, MagicMock

import pytest

from custom_components.meraki_ha.core.api.endpoints.network import NetworkEndpoints


@pytest.fixture
def mock_client():
    """Mock the Meraki API client."""
    client = MagicMock()
    client.dashboard = MagicMock()
    client.dashboard.networks.getNetworkGroupPolicies = AsyncMock()
    return client


@pytest.fixture
def network(mock_client):
    """Fixture for the NetworkEndpoints."""
    return NetworkEndpoints(mock_client)


async def test_get_group_policies(network, mock_client):
    """Test get_group_policies."""
    mock_data = [{"groupPolicyId": "gp1"}]
    mock_client.dashboard.networks.getNetworkGroupPolicies = AsyncMock(
        return_value=mock_data
    )

    result = await network.get_group_policies("net1")

    assert result == mock_data
    mock_client.dashboard.networks.getNetworkGroupPolicies.assert_called_once_with(
        networkId="net1"
    )


async def test_get_network_clients_requests_large_pages(network, mock_client) -> None:
    """Client lookups use max page size so Meraki is not paged 10 at a time."""
    from custom_components.meraki_ha.const import (
        NETWORK_CLIENTS_PAGE_SIZE,
        NETWORK_CLIENTS_TIMESPAN,
    )

    mock_client.dashboard.networks.getNetworkClients = AsyncMock(
        return_value=[{"id": "c1"}]
    )

    result = await network.get_network_clients("N_123")

    assert result == [{"id": "c1"}]
    mock_client.dashboard.networks.getNetworkClients.assert_called_once_with(
        networkId="N_123",
        total_pages="all",
        perPage=NETWORK_CLIENTS_PAGE_SIZE,
        timespan=NETWORK_CLIENTS_TIMESPAN,
    )

"""Tests for select platform init."""

from unittest.mock import MagicMock

import pytest

from custom_components.meraki_ha.const import DOMAIN
from custom_components.meraki_ha.select import async_setup_entry


@pytest.fixture
def mock_hass() -> MagicMock:
    """Create a mock hass instance."""
    hass = MagicMock()
    hass.data = {}
    return hass


@pytest.fixture
def mock_config_entry() -> MagicMock:
    """Create a mock config entry."""
    entry = MagicMock()
    entry.entry_id = "test_entry"
    entry.options = {}
    return entry


@pytest.fixture
def mock_add_entities() -> MagicMock:
    """Create a mock add entities callback."""
    return MagicMock()


@pytest.mark.asyncio
async def test_async_setup_entry_no_networks(
    mock_hass: MagicMock,
    mock_config_entry: MagicMock,
    mock_add_entities: MagicMock,
) -> None:
    """Test setup with no networks creates no entities."""
    mock_coordinator = MagicMock()
    mock_coordinator.data = {"networks": []}
    mock_coordinator.api = MagicMock()

    mock_hass.data = {
        DOMAIN: {
            "test_entry": {
                "coordinator": mock_coordinator,
            }
        }
    }

    await async_setup_entry(mock_hass, mock_config_entry, mock_add_entities)

    mock_add_entities.assert_not_called()


@pytest.mark.asyncio
async def test_async_setup_entry_with_networks_skips_content_filtering(
    mock_hass: MagicMock,
    mock_config_entry: MagicMock,
    mock_add_entities: MagicMock,
) -> None:
    """Test network-only setup does not activate dormant content filtering."""
    mock_coordinator = MagicMock()
    mock_coordinator.data = {
        "networks": [
            {"id": "N_123", "name": "Test Network"},
        ]
    }
    mock_coordinator.api = MagicMock()

    mock_hass.data = {
        DOMAIN: {
            "test_entry": {
                "coordinator": mock_coordinator,
            }
        }
    }

    await async_setup_entry(mock_hass, mock_config_entry, mock_add_entities)

    mock_add_entities.assert_not_called()


@pytest.mark.asyncio
async def test_async_setup_entry_no_coordinator_data(
    mock_hass: MagicMock,
    mock_config_entry: MagicMock,
    mock_add_entities: MagicMock,
) -> None:
    """Test setup handles missing coordinator data."""
    mock_coordinator = MagicMock()
    mock_coordinator.data = None
    mock_coordinator.api = MagicMock()

    mock_hass.data = {
        DOMAIN: {
            "test_entry": {
                "coordinator": mock_coordinator,
            }
        }
    }

    await async_setup_entry(mock_hass, mock_config_entry, mock_add_entities)

    mock_add_entities.assert_not_called()


@pytest.mark.asyncio
async def test_async_setup_entry_skips_non_camera_devices(
    mock_hass: MagicMock,
    mock_config_entry: MagicMock,
    mock_add_entities: MagicMock,
) -> None:
    """Test MX appliances do not get a Linked camera select."""
    mock_coordinator = MagicMock()
    mock_coordinator.data = {
        "networks": [],
        "devices": [
            {
                "serial": "Q2KN-XXXX",
                "name": "Firewall",
                "model": "MX64",
                "productType": "appliance",
            }
        ],
    }
    mock_coordinator.api = MagicMock()
    mock_hass.data = {
        DOMAIN: {
            "test_entry": {
                "coordinator": mock_coordinator,
            }
        }
    }

    await async_setup_entry(mock_hass, mock_config_entry, mock_add_entities)

    mock_add_entities.assert_not_called()


@pytest.mark.asyncio
async def test_async_setup_entry_creates_select_for_mv_model(
    mock_hass: MagicMock,
    mock_config_entry: MagicMock,
    mock_add_entities: MagicMock,
) -> None:
    """Test MV models are treated as cameras even without productType."""
    mock_coordinator = MagicMock()
    mock_coordinator.data = {
        "networks": [],
        "devices": [
            {
                "serial": "Q2GV-XXXX",
                "name": "Front Door",
                "model": "MV12",
            }
        ],
    }
    mock_coordinator.api = MagicMock()
    mock_hass.data = {
        DOMAIN: {
            "test_entry": {
                "coordinator": mock_coordinator,
            }
        }
    }

    await async_setup_entry(mock_hass, mock_config_entry, mock_add_entities)

    mock_add_entities.assert_called()
    created = mock_add_entities.call_args[0][0]
    assert created
    assert created[0].unique_id == "Q2GV-XXXX-linked-camera"

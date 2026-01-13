import sys
from unittest.mock import MagicMock


# --- Start of new mocking logic ---
class MockEntity:
    """A mock base class for Home Assistant entities."""

    pass


class MockSensorEntity(MockEntity):
    """Mock for SensorEntity."""

    pass


class MockBinarySensorEntity(MockEntity):
    """Mock for BinarySensorEntity."""

    pass


class MockCoordinatorEntity(MockEntity):
    """Mock for CoordinatorEntity."""

    pass


class MockRestoreEntity(MockEntity):
    """Mock for RestoreEntity."""

    pass


class MockButtonEntity(MockEntity):
    """Mock for ButtonEntity."""

    pass


class MockCamera(MockEntity):
    """Mock for Camera."""

    pass


class MockSwitchEntity(MockEntity):
    """Mock for SwitchEntity."""

    pass


class MockTextEntity(MockEntity):
    """Mock for TextEntity."""

    pass


class MockNumberEntity(MockEntity):
    """Mock for NumberEntity."""

    pass


class MockSelectEntity(MockEntity):
    """Mock for SelectEntity."""

    pass


# Mock the Home Assistant modules to allow for standalone testing
# Create a dictionary of mocks
# For most, a simple MagicMock is fine.
# For modules with base classes that cause metaclass conflicts,
# we create a MagicMock and then assign our mock *classes* to the
# appropriate attributes.

# Default mock for all modules
mock_modules = {
    module: MagicMock()
    for module in [
        "homeassistant.components",
        "homeassistant.components.binary_sensor",
        "homeassistant.components.button",
        "homeassistant.components.camera",
        "homeassistant.components.lovelace",
        "homeassistant.components.lovelace.dashboard",
        "homeassistant.components.number",
        "homeassistant.components.select",
        "homeassistant.components.sensor",
        "homeassistant.components.switch",
        "homeassistant.components.text",
        "homeassistant.components.webhook",
        "homeassistant.config_entries",
        "homeassistant.const",
        "homeassistant.core",
        "homeassistant.exceptions",
        "homeassistant.helpers",
        "homeassistant.helpers.device_registry",
        "homeassistant.helpers.entity",
        "homeassistant.helpers.entity_platform",
        "homeassistant.helpers.entity_registry",
        "homeassistant.helpers.restore_state",
        "homeassistant.helpers.storage",
        "homeassistant.helpers.update_coordinator",
    ]
}

# Overwrite specific modules/classes that need custom class mocks
mock_modules["homeassistant.helpers.entity"].Entity = MockEntity
mock_modules["homeassistant.components.sensor"].SensorEntity = MockSensorEntity
mock_modules[
    "homeassistant.components.binary_sensor"
].BinarySensorEntity = MockBinarySensorEntity
mock_modules[
    "homeassistant.helpers.update_coordinator"
].CoordinatorEntity = MockCoordinatorEntity
mock_modules["homeassistant.components.camera"].Camera = MockCamera
mock_modules["homeassistant.components.text"].TextEntity = MockTextEntity
mock_modules["homeassistant.components.number"].NumberEntity = MockNumberEntity
mock_modules["homeassistant.components.select"].SelectEntity = MockSelectEntity
mock_modules["homeassistant.components.switch"].SwitchEntity = MockSwitchEntity
mock_modules["homeassistant.components.button"].ButtonEntity = MockButtonEntity
mock_modules["homeassistant.helpers.restore_state"].RestoreEntity = MockRestoreEntity
# Add attributes to the dashboard mock to satisfy mypy
dashboard_mock = mock_modules["homeassistant.components.lovelace.dashboard"]
dashboard_mock.async_register_strategy = MagicMock()
dashboard_mock.async_unregister_strategy = MagicMock()

# Apply all mocks to sys.modules
sys.modules.update(mock_modules)
# --- End of new mocking logic ---


"""Global fixtures for meraki_ha integration."""

from collections.abc import Generator
from unittest.mock import AsyncMock, MagicMock

import pytest

from tests.const import MOCK_ALL_DATA


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(
    enable_custom_integrations: None,
) -> Generator[None]:
    """
    Enable custom integrations defined in the test dir.

    Args:
        enable_custom_integrations: The fixture to enable custom integrations.

    """
    yield


@pytest.fixture
def mock_coordinator() -> MagicMock:
    """Fixture for a mocked MerakiDataCoordinator."""
    coordinator = MagicMock()
    coordinator.config_entry.options = {}
    coordinator.data = MOCK_ALL_DATA
    coordinator.async_request_refresh = AsyncMock()
    coordinator.async_write_ha_state = MagicMock()
    coordinator.is_update_pending = MagicMock(return_value=False)
    coordinator.register_pending_update = MagicMock()
    coordinator.async_request_refresh = AsyncMock()
    return coordinator


@pytest.fixture
def mock_config_entry() -> MagicMock:
    """Fixture for a mocked ConfigEntry."""
    entry = MagicMock()
    entry.options = {}
    return entry


@pytest.fixture
def prevent_socket_and_camera_load() -> Generator[None]:
    """Patch asyncio to prevent opening a real socket."""
    from unittest.mock import MagicMock, patch

    with (
        patch(
            "asyncio.base_events.BaseEventLoop.create_server", new_callable=AsyncMock
        ),
        patch("turbojpeg.TurboJPEG", MagicMock()),
    ):
        yield


# ===== Device Fixtures =====


@pytest.fixture
def mock_mg_device() -> dict:
    """Mock MG cellular gateway device."""
    return {
        "serial": "MG-001",
        "model": "MG21",
        "name": "MG Gateway",
        "networkId": "N_123",
        "productType": "cellularGateway",
        "status": "online",
    }


@pytest.fixture
def mock_cellular_uplinks() -> list:
    """Mock cellular uplink data."""
    return [
        {
            "status": "connected",
            "connectionType": "LTE",
            "provider": "Verizon",
            "signalStat": {"rsrp": "-85", "rsrq": "-10"},
        }
    ]


@pytest.fixture
def mock_camera_sense_settings() -> dict:
    """Mock camera sense settings."""
    return {
        "senseEnabled": True,
        "audioDetection": {"enabled": True},
    }


# ===== Network Fixtures =====


@pytest.fixture
def mock_vpn_status() -> dict:
    """Mock VPN status data."""
    return {
        "mode": "hub",
        "subnets": [{"localSubnet": "192.168.1.0/24"}],
    }


@pytest.fixture
def mock_traffic_shaping_data() -> dict:
    """Mock traffic shaping data."""
    return {
        "bandwidthLimits": {
            "wan1": {"limitUp": 1000, "limitDown": 5000},
            "wan2": {"limitUp": 2000, "limitDown": 10000},
        }
    }


@pytest.fixture
def mock_content_filtering_data() -> dict:
    """Mock content filtering data."""
    return {
        "urlCategoryListSize": "topSites",
        "blockedUrlCategories": [],
    }


# ===== Client Fixtures =====


@pytest.fixture
def mock_client_data() -> dict:
    """Mock client data."""
    return {
        "id": "client123",
        "mac": "00:11:22:33:44:55",
        "ip": "192.168.1.100",
        "description": "Test Client",
        "status": "Online",
    }


@pytest.fixture
def mock_firewall_rules() -> list:
    """Mock L3 firewall rules."""
    return [
        {
            "comment": "Allow HTTP",
            "policy": "allow",
            "protocol": "tcp",
            "destPort": "80",
            "destCidr": "any",
            "srcCidr": "any",
        },
        {
            "comment": "Block SSH",
            "policy": "deny",
            "protocol": "tcp",
            "destPort": "22",
            "destCidr": "any",
            "srcCidr": "any",
        },
    ]

"""Global fixtures for meraki_ha integration."""

import sys
from unittest.mock import MagicMock

# -- START Metaclass Conflict Fix --
# The original code mocked entire Home Assistant modules with a single MagicMock
# instance. This causes a `TypeError: metaclass conflict` when a class in the
# integration inherits from two different Home Assistant base classes (e.g.,
# SensorEntity and CoordinatorEntity), because both base classes resolve to
# MagicMock instances, which have incompatible metaclasses for multiple inheritance.
#
# The solution is to create mock *classes* with a shared, compatible base class
# and then inject them into the mocked modules. This ensures that the base
# classes are actual types, allowing Python's multiple inheritance to work
# correctly during test collection.


# 1. Define mock classes with a compatible inheritance structure.
class MockEntity:
    """Mock base class for HA entities to resolve metaclass conflicts."""

    pass


class MockSensorEntity(MockEntity):
    """Mock SensorEntity that inherits from the common mock base."""

    pass


class MockCoordinatorEntity:
    """Mock CoordinatorEntity. It's a mixin, so it doesn't need the base."""

    def __init__(self, coordinator):
        """Init."""
        self.coordinator = coordinator


# 2. Mock the modules, but then assign the mock classes to them.
MOCK_MODULES = [
    "homeassistant",
    "homeassistant.components",
    "homeassistant.components.http",
    "homeassistant.components.http.view",
    "homeassistant.components.sensor",  # Add sensor component
    "homeassistant.components.webhook",
    "homeassistant.config_entries",
    "homeassistant.const",
    "homeassistant.core",
    "homeassistant.exceptions",
    "homeassistant.helpers",
    "homeassistant.helpers.aiohttp_client",
    "homeassistant.helpers.device_registry",
    "homeassistant.helpers.entity",
    "homeassistant.helpers.entity_platform",
    "homeassistant.helpers.entity_registry",
    "homeassistant.helpers.storage",
    "homeassistant.helpers.typing",
    "homeassistant.helpers.update_coordinator",
]
for module in MOCK_MODULES:
    sys.modules[module] = MagicMock()

# 3. Inject the mock classes into the mocked modules.
sys.modules["homeassistant.helpers.entity"].Entity = MockEntity  # type: ignore[attr-defined]
sys.modules["homeassistant.components.sensor"].SensorEntity = MockSensorEntity  # type: ignore[attr-defined]
sys.modules[
    "homeassistant.helpers.update_coordinator"
].CoordinatorEntity = MockCoordinatorEntity  # type: ignore[attr-defined]

# -- END Metaclass Conflict Fix --

from collections.abc import Generator  # noqa: E402
from unittest.mock import AsyncMock, MagicMock  # noqa: E402

import pytest  # noqa: E402

from tests.const import MOCK_ALL_DATA  # noqa: E402


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

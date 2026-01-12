"""Tests for the sync_helper."""

from unittest.mock import MagicMock

import pytest
from homeassistant.helpers.device_registry import (
    DeviceEntry,
)

from custom_components.meraki_ha.helpers.sync_helper import (
    _find_root_device,
    build_client_description,
)


@pytest.fixture
def mock_hass():
    """Fixture for a mocked Home Assistant instance."""
    hass = MagicMock()
    hass.helpers.device_registry.async_get.return_value = MagicMock()
    return hass


@pytest.fixture
def mock_device_registry():
    """Fixture for a mocked DeviceRegistry."""
    return MagicMock()


def test_find_root_device_no_hierarchy(mock_device_registry):
    """Test _find_root_device with a standalone device."""
    device = DeviceEntry(id="1", via_device_id=None)
    assert _find_root_device(mock_device_registry, device) == device


def test_find_root_device_simple_hierarchy(mock_device_registry):
    """Test _find_root_device with a simple parent-child hierarchy."""
    parent = DeviceEntry(id="parent", via_device_id=None)
    child = DeviceEntry(id="child", via_device_id="parent")
    mock_device_registry.async_get.side_effect = lambda did: {
        "parent": parent,
        "child": child,
    }.get(did)
    assert _find_root_device(mock_device_registry, child) == parent


def test_find_root_device_multi_level(mock_device_registry):
    """Test _find_root_device with multiple levels of hierarchy."""
    root = DeviceEntry(id="root", via_device_id=None)
    level1 = DeviceEntry(id="level1", via_device_id="root")
    level2 = DeviceEntry(id="level2", via_device_id="level1")
    mock_device_registry.async_get.side_effect = lambda did: {
        "root": root,
        "level1": level1,
        "level2": level2,
    }.get(did)
    assert _find_root_device(mock_device_registry, level2) == root


def test_build_client_description_simple(mock_hass):
    """Test build_client_description with a simple device."""
    device_registry = mock_hass.helpers.device_registry.async_get()
    device = DeviceEntry(
        id="1",
        name="Living Room Apple TV",
        model="Apple TV 4K",
        sw_version="tvOS 17.2",
    )
    device_registry.async_get_device.return_value = device

    desc = build_client_description(
        mock_hass, "aa:bb:cc:dd:ee:ff", include_model=True, include_version=True
    )
    assert desc == "Living Room Apple TV (Apple TV 4K) [tvOS 17.2]"

    desc_no_version = build_client_description(
        mock_hass, "aa:bb:cc:dd:ee:ff", include_model=True, include_version=False
    )
    assert desc_no_version == "Living Room Apple TV (Apple TV 4K)"


def test_build_client_description_hierarchy(mock_hass):
    """Test build_client_description with a device hierarchy."""
    device_registry = mock_hass.helpers.device_registry.async_get()
    root = DeviceEntry(id="root", name="SunPower Gateway")
    child = DeviceEntry(id="child", name="Inverter 1", via_device_id="root")
    device_registry.async_get_device.return_value = child
    device_registry.async_get.side_effect = lambda did: {"root": root}.get(did)

    desc = build_client_description(
        mock_hass, "aa:bb:cc:dd:ee:ff", include_model=False, include_version=False
    )
    assert desc == "SunPower Gateway"

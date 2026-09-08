"""Tests for the device_info_helpers module."""

from unittest.mock import MagicMock, patch

import pytest
from homeassistant.helpers.device_registry import DeviceInfo

from custom_components.meraki_ha.const import (
    DOMAIN,
)
from custom_components.meraki_ha.helpers.device_info_helpers import (
    apply_via_identifier,
    resolve_device_info,
)


@pytest.fixture
def mock_config_entry():
    """Fixture for a mocked config entry."""
    return MagicMock()


def test_resolve_device_info_ssid_naming(mock_config_entry):
    """Test that SSID device names are formatted correctly."""
    ssid_data = {"number": 1, "name": "My Test SSID", "networkId": "net1"}

    device_info = resolve_device_info(
        entity_data=ssid_data, config_entry=mock_config_entry
    )
    assert device_info["name"] == "[SSID] My Test SSID"
    # SSID identifiers use ssid_{network_id}_{ssid_number} format
    assert device_info["identifiers"] == {(DOMAIN, "ssid_net1_1")}


def test_resolve_device_info_physical_device(mock_config_entry):
    """Test that physical device info is resolved correctly."""
    device_data = {
        "serial": "Q234-ABCD-5678",
        "model": "MR33",
        "name": "Living Room AP",
        "firmware": "29.1.1",
        "productType": "wireless",
    }
    device_info = resolve_device_info(
        entity_data=device_data, config_entry=mock_config_entry
    )
    # Wireless devices use [MR] prefix (Meraki model prefix)
    assert device_info["name"] == "[MR] Living Room AP"
    assert device_info["identifiers"] == {(DOMAIN, "Q234-ABCD-5678")}
    assert device_info["model"] == "MR33"
    assert device_info["sw_version"] == "29.1.1"


def test_apply_via_identifier_sets_via_device_id() -> None:
    """HA 2026.9 parent links use via_device_id from the device registry."""
    device_info = DeviceInfo(
        identifiers={(DOMAIN, "client_aa")},
        name="Client",
    )
    with patch(
        "custom_components.meraki_ha.helpers.device_info_helpers."
        "async_get_device_id_by_identifier",
        return_value="parent-device-id",
    ):
        result = apply_via_identifier(
            device_info,
            hass=MagicMock(),
            config_entry_id="entry-1",
            identifier=(DOMAIN, "network_N_12345"),
        )

    assert result["via_device_id"] == "parent-device-id"
    assert "via_device" not in result


def test_apply_via_identifier_skips_non_string_ids() -> None:
    """Ignore registry lookups that return mocks instead of device ids."""
    device_info = DeviceInfo(
        identifiers={(DOMAIN, "client_aa")},
        name="Client",
    )
    result = apply_via_identifier(
        device_info,
        hass=MagicMock(),
        config_entry_id="entry-1",
        identifier=(DOMAIN, "network_N_12345"),
    )
    assert "via_device_id" not in result
    assert "via_device" not in result

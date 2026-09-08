"""Tests for client tracking allowlist helpers."""

from unittest.mock import MagicMock

from homeassistant.config_entries import ConfigEntry

from custom_components.meraki_ha.const import (
    CONF_ENABLE_DEVICE_TRACKER,
    CONF_MANUAL_CLIENT_ASSOCIATIONS,
    CONF_TRACK_ALL_CLIENTS,
)
from custom_components.meraki_ha.helpers.client_tracking import (
    is_client_tracked,
    normalize_client_mac,
)


def test_normalize_client_mac() -> None:
    """MACs with mixed delimiters normalize to lowercase colon form."""
    assert normalize_client_mac("00-11-22-33-44-55") == "00:11:22:33:44:55"
    assert normalize_client_mac("AA.BB.CC.DD.EE.FF") == "aa:bb:cc:dd:ee:ff"


def test_default_does_not_track_unassociated_clients() -> None:
    """With tracker on and track-all off, only associated MACs are tracked."""
    entry = MagicMock(spec=ConfigEntry)
    entry.options = {CONF_ENABLE_DEVICE_TRACKER: True}

    assert is_client_tracked(entry, "00:11:22:33:44:55") is False


def test_associated_client_is_tracked() -> None:
    """Device Association is the allowlist when track-all is off."""
    entry = MagicMock(spec=ConfigEntry)
    entry.options = {
        CONF_ENABLE_DEVICE_TRACKER: True,
        CONF_MANUAL_CLIENT_ASSOCIATIONS: {"00-11-22-33-44-55": "icloud_device"},
    }

    assert is_client_tracked(entry, "00:11:22:33:44:55") is True
    assert is_client_tracked(entry, "aa:bb:cc:dd:ee:ff") is False


def test_track_all_clients_tracks_everyone() -> None:
    """Track-all opt-in restores the previous all-clients behavior."""
    entry = MagicMock(spec=ConfigEntry)
    entry.options = {
        CONF_ENABLE_DEVICE_TRACKER: True,
        CONF_TRACK_ALL_CLIENTS: True,
    }

    assert is_client_tracked(entry, "00:11:22:33:44:55") is True


def test_disabled_tracker_tracks_nobody() -> None:
    """Disabling client tracker skips even associated clients."""
    entry = MagicMock(spec=ConfigEntry)
    entry.options = {
        CONF_ENABLE_DEVICE_TRACKER: False,
        CONF_TRACK_ALL_CLIENTS: True,
        CONF_MANUAL_CLIENT_ASSOCIATIONS: {"00:11:22:33:44:55": "device"},
    }

    assert is_client_tracked(entry, "00:11:22:33:44:55") is False

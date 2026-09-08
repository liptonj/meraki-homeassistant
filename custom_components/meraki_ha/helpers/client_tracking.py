"""Helpers for deciding which Meraki clients get Home Assistant entities."""

from __future__ import annotations

from collections.abc import Mapping
from typing import Any

from homeassistant.config_entries import ConfigEntry

from ..const import (
    CONF_ENABLE_DEVICE_TRACKER,
    CONF_MANUAL_CLIENT_ASSOCIATIONS,
    CONF_TRACK_ALL_CLIENTS,
    DEFAULT_TRACK_ALL_CLIENTS,
)


def normalize_client_mac(mac: str) -> str:
    """Normalize a client MAC for comparison and storage.

    Parameters
    ----------
    mac : str
        MAC address in any common delimiter format.

    Returns
    -------
    str
        Lowercase colon-separated MAC.

    """
    return mac.lower().replace("-", ":").replace(".", ":")


def associated_client_macs(options: Mapping[str, Any]) -> set[str]:
    """Return normalized MACs that have a Device Association.

    Parameters
    ----------
    options : Mapping[str, Any]
        Config entry options.

    Returns
    -------
    set[str]
        Normalized MAC addresses.

    """
    associations = options.get(CONF_MANUAL_CLIENT_ASSOCIATIONS, {}) or {}
    if not isinstance(associations, dict):
        return set()
    return {normalize_client_mac(str(mac)) for mac in associations}


def is_client_tracked(config_entry: ConfigEntry, mac: str | None) -> bool:
    """Return True if this client should get tracker and per-client sensors.

    By default only clients linked under Device Association are tracked, so
    they can attach to an existing Home Assistant device (for example an iCloud
    iPhone) instead of creating a second device.

    Parameters
    ----------
    config_entry : ConfigEntry
        Integration config entry.
    mac : str | None
        Client MAC from Meraki.

    Returns
    -------
    bool
        True when entities should be created for this client.

    """
    if not mac:
        return False
    options = config_entry.options
    if not options.get(CONF_ENABLE_DEVICE_TRACKER, True):
        return False
    if options.get(CONF_TRACK_ALL_CLIENTS, DEFAULT_TRACK_ALL_CLIENTS):
        return True
    return normalize_client_mac(mac) in associated_client_macs(options)

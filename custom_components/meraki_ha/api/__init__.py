"""Meraki API for frontend."""

from __future__ import annotations

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant


def async_setup(hass: HomeAssistant) -> None:
    """Set up the Meraki API for the frontend."""
    from . import camera, dashboard, legacy

    camera.async_setup(hass)
    dashboard.async_setup(hass)
    legacy.async_setup_websocket_api(hass)

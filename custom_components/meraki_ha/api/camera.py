"""WebSocket API for Meraki Camera Card.

Camera pairing, snapshot, stream, and RTSP commands are registered in
``web_api.py``. This module used to re-register the same command types with
incompatible schemas and storage, which overwrote the working panel handlers
and broke camera pairing.

``api.async_setup`` still calls ``camera.async_setup``; keep this as a no-op
so startup stays compatible without duplicate registrations.
"""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..helpers.logging_helper import MerakiLoggers

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

_LOGGER = MerakiLoggers.CAMERA


def async_setup(_hass: HomeAssistant) -> None:
    """Camera WebSocket commands are registered by ``web_api.async_setup_api``."""
    _LOGGER.debug(
        "Skipping duplicate camera WebSocket registration; commands live in web_api"
    )

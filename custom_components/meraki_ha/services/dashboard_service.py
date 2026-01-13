"""Dashboard service for the Meraki Home Assistant integration."""

from __future__ import annotations

from typing import TYPE_CHECKING

import voluptuous as vol
from homeassistant.core import HomeAssistant, ServiceCall

from ..const import DOMAIN
from ..helpers.logging_helper import MerakiLoggers

if TYPE_CHECKING:
    from homeassistant.config_entries import ConfigEntry

_LOGGER = MerakiLoggers.MAIN


async def async_regenerate_dashboard(hass: HomeAssistant, call: ServiceCall) -> None:
    """Regenerate the Lovelace dashboard from current device state.

    Parameters
    ----------
    hass : HomeAssistant
        The Home Assistant instance.
    call : ServiceCall
        The service call with parameters.
    """
    config_entry_id = call.data.get("config_entry_id")

    if not config_entry_id:
        _LOGGER.error("No config_entry_id provided to regenerate_dashboard service")
        return

    # Get the config entry
    entry: ConfigEntry | None = hass.config_entries.async_get_entry(config_entry_id)
    if not entry:
        _LOGGER.error("Config entry %s not found", config_entry_id)
        return

    try:
        # Generate new dashboard config
        from ..dashboard import (
            MerakiDashboardStrategy,  # pylint: disable=import-outside-toplevel
        )

        strategy = MerakiDashboardStrategy()
        dashboard_config = await strategy.async_generate(hass, config_entry_id)

        if not dashboard_config:
            _LOGGER.error("Failed to generate dashboard configuration")
            return

        # Update the dashboard
        dashboard_id = f"meraki_{config_entry_id[:8]}"

        # Defer import to avoid blocking startup
        from homeassistant.components import (
            lovelace,  # pylint: disable=import-outside-toplevel
        )

        # Save new configuration
        await lovelace.async_save_config(hass, dashboard_id, dashboard_config)  # type: ignore[attr-defined]

        _LOGGER.info("Regenerated dashboard %s successfully", dashboard_id)

        # Show notification
        await hass.services.async_call(
            "persistent_notification",
            "create",
            {
                "message": (
                    f"Your Meraki dashboard has been regenerated!\n\n"
                    f"[Open Dashboard](/{dashboard_id})\n\n"
                    f"All cards and views have been updated based on "
                    f"your current devices."
                ),
                "title": "Meraki Dashboard Regenerated",
                "notification_id": f"meraki_dashboard_regen_{config_entry_id}",
            },
            blocking=False,
        )

    except Exception as err:  # pylint: disable=broad-except
        _LOGGER.error(
            "Failed to regenerate dashboard: %s",
            err,
            exc_info=True,
        )


# Service schema
SERVICE_REGENERATE_DASHBOARD_SCHEMA = vol.Schema(
    {
        vol.Required("config_entry_id"): str,
    }
)


def async_register_services(hass: HomeAssistant) -> None:
    """Register dashboard services.

    Parameters
    ----------
    hass : HomeAssistant
        The Home Assistant instance.
    """
    hass.services.async_register(
        DOMAIN,
        "regenerate_dashboard",
        async_regenerate_dashboard,
        schema=SERVICE_REGENERATE_DASHBOARD_SCHEMA,
    )

    _LOGGER.info("Dashboard services registered")

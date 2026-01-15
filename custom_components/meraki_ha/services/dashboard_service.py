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


async def async_create_editable_dashboard(
    hass: HomeAssistant, call: ServiceCall
) -> None:
    """Create a new editable static Lovelace dashboard.

    This creates a fully editable dashboard that you can customize in the UI,
    unlike the strategy-based dashboard which is read-only.

    Parameters
    ----------
    hass : HomeAssistant
        The Home Assistant instance.
    call : ServiceCall
        The service call with parameters.
    """
    config_entry_id = call.data.get("config_entry_id")
    dashboard_id = call.data.get("dashboard_id")

    # Auto-detect config_entry_id if not provided
    if not config_entry_id:
        _LOGGER.debug("No config_entry_id provided, auto-detecting...")
        entries = hass.config_entries.async_entries(DOMAIN)
        if not entries:
            _LOGGER.error("No Meraki integration found")
            return
        if len(entries) == 1:
            config_entry_id = entries[0].entry_id
            _LOGGER.info("Auto-detected config_entry_id: %s", config_entry_id[:8])
        else:
            _LOGGER.error(
                "Multiple Meraki integrations found (%d). "
                "Please specify config_entry_id",
                len(entries),
            )
            return

    # Get the config entry
    entry: ConfigEntry | None = hass.config_entries.async_get_entry(config_entry_id)
    if not entry:
        _LOGGER.error("Config entry %s not found", config_entry_id)
        return

    # Use provided dashboard_id or generate one
    if not dashboard_id:
        dashboard_id = f"meraki_{config_entry_id[:8]}_editable"

    try:
        # Generate dashboard config
        from ..dashboard import (
            MerakiDashboardStrategy,  # pylint: disable=import-outside-toplevel
        )

        strategy = MerakiDashboardStrategy()
        dashboard_config = await strategy.async_generate(hass, config_entry_id)

        if not dashboard_config:
            _LOGGER.error("Failed to generate dashboard configuration")
            return

        # Find the dashboards collection using duck typing
        # We look for an object with async_create_item method
        dashboards_collection = None

        # Debug: Log what's in hass.data
        _LOGGER.debug("Available hass.data keys: %s", list(hass.data.keys()))

        # Check if lovelace data exists
        lovelace_data = hass.data.get("lovelace")
        if lovelace_data:
            _LOGGER.debug("lovelace_data type: %s", type(lovelace_data).__name__)
            _LOGGER.debug("lovelace_data attributes: %s", dir(lovelace_data))

            if hasattr(lovelace_data, "dashboards"):
                _LOGGER.debug(
                    "lovelace.dashboards type: %s",
                    type(lovelace_data.dashboards).__name__,
                )
                _LOGGER.debug(
                    "lovelace.dashboards has async_create_item: %s",
                    hasattr(lovelace_data.dashboards, "async_create_item"),
                )

                potential_collection = lovelace_data.dashboards
                if hasattr(potential_collection, "async_create_item"):
                    dashboards_collection = potential_collection
                    _LOGGER.info("Found dashboards collection via lovelace.dashboards")
            else:
                _LOGGER.debug("lovelace_data does not have 'dashboards' attribute")
        else:
            _LOGGER.debug("No 'lovelace' key in hass.data")

        if not dashboards_collection:
            _LOGGER.error(
                "Dashboards collection not found. "
                "This feature requires direct access to Lovelace internals "
                "which may not be available. "
                "Please create your dashboard manually: "
                "Settings → Dashboards → Add Dashboard → "
                "Use the 'meraki-dashboard-strategy' as the strategy type"
            )
            return

        # Check if dashboard already exists
        existing_dashboard = None
        try:
            items = dashboards_collection.async_items()
            for item in items:
                if item.get("id") == dashboard_id:
                    existing_dashboard = item
                    _LOGGER.info(
                        "Dashboard %s already exists, will update it", dashboard_id
                    )
                    break
        except (AttributeError, TypeError) as check_err:
            _LOGGER.debug("Could not check existing dashboards: %s", check_err)

        # Create dashboard data structure
        dashboard_data = {
            "id": dashboard_id,
            "url_path": dashboard_id,
            "title": f"Meraki Network - {entry.title}",
            "icon": "mdi:router-network",
            "show_in_sidebar": True,
            "require_admin": False,
            "mode": "storage",
        }

        if existing_dashboard:
            # Update existing dashboard
            dashboard_data["views"] = dashboard_config.get("views", [])
            await dashboards_collection.async_update_item(dashboard_id, dashboard_data)
            _LOGGER.info("Updated existing dashboard: %s", dashboard_id)
        else:
            # Create new dashboard with views
            dashboard_data["views"] = dashboard_config.get("views", [])
            await dashboards_collection.async_create_item(dashboard_data)
            _LOGGER.info("Created editable dashboard: %s", dashboard_id)

        # Show success notification
        await hass.services.async_call(
            "persistent_notification",
            "create",
            {
                "message": (
                    f"✅ **Editable Meraki Dashboard Created!**\n\n"
                    f"📊 Dashboard ID: `{dashboard_id}`\n"
                    f"🔗 [Open Dashboard](/{dashboard_id})\n\n"
                    f"This dashboard is **fully editable** in the Lovelace UI.\n\n"
                    f"**Features:**\n"
                    f"- 10 organized views by device type\n"
                    f"- All Meraki devices, networks, and clients\n"
                    f"- Fully customizable - add, remove, or rearrange cards\n"
                    f"- Edit in UI: click ⋮ → Edit Dashboard\n\n"
                    f"**Note:** This is a snapshot of your current setup. "
                    f"Run the service again to regenerate with updated devices."
                ),
                "title": "📊 Meraki Dashboard Created",
                "notification_id": f"meraki_dashboard_created_{config_entry_id}",
            },
            blocking=False,
        )

    except Exception as err:  # pylint: disable=broad-except
        _LOGGER.error(
            "Failed to create editable dashboard: %s",
            err,
            exc_info=True,
        )


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

        # The dashboard ID for regeneration
        dashboard_id = f"meraki_{config_entry_id[:8]}"

        # Find the dashboards collection using duck typing
        dashboards_collection = None

        # Check if lovelace data exists
        lovelace_data = hass.data.get("lovelace")
        if lovelace_data and hasattr(lovelace_data, "dashboards"):
            # The dashboards dict is the collection
            potential_collection = lovelace_data.dashboards
            if hasattr(potential_collection, "async_update_item"):
                dashboards_collection = potential_collection
                _LOGGER.debug("Found dashboards collection via lovelace.dashboards")

        if not dashboards_collection:
            _LOGGER.error(
                "Dashboards collection not found. Cannot regenerate dashboard."
            )
            return

        # Update existing dashboard
        dashboard_data = {
            "id": dashboard_id,
            "url_path": dashboard_id,
            "title": f"Meraki Network - {entry.title}",
            "icon": "mdi:router-network",
            "show_in_sidebar": True,
            "require_admin": False,
            "mode": "storage",
            "views": dashboard_config.get("views", []),
        }

        await dashboards_collection.async_update_item(dashboard_id, dashboard_data)

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


# Service schemas
SERVICE_CREATE_EDITABLE_DASHBOARD_SCHEMA = vol.Schema(
    {
        vol.Optional("config_entry_id"): str,  # Auto-detect if not provided
        vol.Optional("dashboard_id"): str,
    }
)

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

    async def create_editable_dashboard_wrapper(call: ServiceCall) -> None:
        """Wrap create_editable_dashboard for service registration."""
        await async_create_editable_dashboard(hass, call)

    async def regenerate_dashboard_wrapper(call: ServiceCall) -> None:
        """Wrap regenerate_dashboard for service registration."""
        await async_regenerate_dashboard(hass, call)

    hass.services.async_register(
        DOMAIN,
        "create_editable_dashboard",
        create_editable_dashboard_wrapper,
        schema=SERVICE_CREATE_EDITABLE_DASHBOARD_SCHEMA,
    )

    hass.services.async_register(
        DOMAIN,
        "regenerate_dashboard",
        regenerate_dashboard_wrapper,
        schema=SERVICE_REGENERATE_DASHBOARD_SCHEMA,
    )

    _LOGGER.info("Dashboard services registered")

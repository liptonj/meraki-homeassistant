"""Starting setup task: Frontend."""

from __future__ import annotations

import asyncio
import json
from pathlib import Path

import aiofiles
from homeassistant.components import frontend
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import DOMAIN
from .helpers.logging_helper import MerakiLoggers

_LOGGER = MerakiLoggers.FRONTEND


async def async_register_static_path(hass: HomeAssistant) -> None:
    """Register the static path for the frontend."""
    try:
        _LOGGER.info("Registering static path for Meraki HA frontend")
        static_path = str(Path(__file__).parent / "www")
        _LOGGER.info("Frontend static path: %s", static_path)

        # Verify the path exists
        www_path = Path(__file__).parent / "www"
        if not www_path.exists():
            _LOGGER.error("Frontend www directory does not exist: %s", www_path)
            return

        # Check for required files
        js_file = www_path / "meraki-panel.js"
        if not js_file.exists():
            _LOGGER.error("meraki-panel.js not found at: %s", js_file)
            return

        _LOGGER.info("Found meraki-panel.js (%d bytes)", js_file.stat().st_size)

        await hass.http.async_register_static_paths(
            [
                StaticPathConfig(
                    url_path=f"/api/panel_custom/{DOMAIN}",
                    path=static_path,
                    cache_headers=False,
                ),
            ],
        )

        _LOGGER.info(
            "Successfully registered static path: /api/panel_custom/%s -> %s",
            DOMAIN,
            static_path,
        )

        # Also register cards at /local/community/ for HACS compatibility
        await hass.http.async_register_static_paths(
            [
                StaticPathConfig(
                    url_path=f"/local/community/{DOMAIN}",
                    path=static_path,
                    cache_headers=False,
                ),
            ],
        )
        _LOGGER.info(
            "Successfully registered cards static path: /local/community/%s -> %s",
            DOMAIN,
            static_path,
        )

        # IMPORTANT: Don't await this! It can hang if Lovelace isn't ready yet.
        # Register cards as a background task instead.
        asyncio.create_task(_async_register_cards_resource(hass))

    except Exception as err:
        _LOGGER.error(
            "Failed to register static path: %s (type: %s)",
            err,
            type(err).__name__,
            exc_info=True,
        )


async def async_register_panel(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Register the panel for the frontend."""
    try:
        # Register panel
        manifest_path = Path(__file__).parent / "manifest.json"
        _LOGGER.info("Reading manifest from: %s", manifest_path)

        async with aiofiles.open(manifest_path, encoding="utf-8") as f:
            manifest_data = await f.read()
            manifest = json.loads(manifest_data)

        version = manifest.get("version", "0.0.0")
        # Add a random query parameter for aggressive cache-busting (for debugging)
        module_url = f"/api/panel_custom/{DOMAIN}/meraki-panel.js?v={version}"

        _LOGGER.info(
            "Registering Meraki panel: title='%s', url_path='%s', module='%s'",
            entry.title,
            "meraki",
            module_url,
        )

        frontend.async_register_built_in_panel(
            hass,
            component_name="custom",
            sidebar_title=entry.title,
            sidebar_icon="mdi:router-network",
            frontend_url_path="meraki",
            config={
                "_panel_custom": {
                    "name": "meraki-panel",
                    "module_url": module_url,
                    "embed_iframe": False,
                    "trust_external_script": True,
                },
                "config_entry_id": entry.entry_id,
            },
            require_admin=True,
            # Allow updating the panel registration to prevent conflicts on reload
            update=True,
        )

        _LOGGER.info(
            "Successfully registered Meraki panel at /meraki (admin only, entry: %s)",
            entry.entry_id,
        )
    except Exception as err:
        _LOGGER.error(
            "Failed to register Meraki panel: %s (type: %s)",
            err,
            type(err).__name__,
            exc_info=True,
        )


def async_unregister_frontend(hass: HomeAssistant) -> None:
    """
    Unregister the Meraki panel from the Home Assistant frontend.

    Args:
    ----
        hass: The Home Assistant instance.

    """
    try:
        frontend.async_remove_panel(hass, "meraki")
    except (KeyError, ValueError):
        _LOGGER.debug("Meraki panel was not registered, skipping unregister")


async def _async_register_cards_resource(hass: HomeAssistant) -> None:
    """Register Meraki cards as a Lovelace resource."""
    cards_url = f"/local/community/{DOMAIN}/meraki-cards-loader.js"
    _LOGGER.info("Attempting to auto-register cards resource: %s", cards_url)

    try:
        # pylint: disable=import-outside-toplevel
        from homeassistant.components.lovelace.resources import (
            ResourceStorageCollection,
        )

        # Access lovelace resources via hass.data
        lovelace_data = hass.data.get("lovelace")
        if not lovelace_data:
            _LOGGER.info("Lovelace not initialized yet - cards must be added manually")
            return

        # Try to get resources - could be attribute or dict key
        resources = None
        if hasattr(lovelace_data, "resources"):
            resources = lovelace_data.resources
        elif isinstance(lovelace_data, dict) and "resources" in lovelace_data:
            resources = lovelace_data["resources"]

        if not resources:
            _LOGGER.info(
                "Lovelace resources not available - cards must be added manually"
            )
            return

        if not isinstance(resources, ResourceStorageCollection):
            _LOGGER.info(
                "Lovelace using YAML mode - add cards manually to configuration.yaml"
            )
            return

        # Check if resource already exists
        existing = False
        items = resources.async_items()
        for item in items:
            if item.get("url") == cards_url:
                existing = True
                break

        if not existing:
            await resources.async_create_item({"res_type": "module", "url": cards_url})
            _LOGGER.info(
                "✅ Successfully registered Meraki cards as Lovelace resource: %s",
                cards_url,
            )
        else:
            _LOGGER.info("Meraki cards resource already registered")

    except ImportError:
        _LOGGER.info(
            "Lovelace resources API not available - cards must be added manually"
        )
    except Exception as err:
        _LOGGER.warning(
            "Could not auto-register cards resource: %s - add manually at %s",
            err,
            cards_url,
        )

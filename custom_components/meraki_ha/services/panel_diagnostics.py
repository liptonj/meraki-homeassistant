"""Diagnostic service for Meraki panel troubleshooting."""

from __future__ import annotations

from pathlib import Path

from homeassistant.core import HomeAssistant, ServiceCall

from ..const import DOMAIN
from ..helpers.logging_helper import MerakiLoggers

_LOGGER = MerakiLoggers.FRONTEND


async def async_diagnose_panel(hass: HomeAssistant, call: ServiceCall) -> None:
    """Service to diagnose panel registration issues."""
    _LOGGER.info("=" * 60)
    _LOGGER.info("MERAKI PANEL DIAGNOSTICS")
    _LOGGER.info("=" * 60)

    # Check files
    _LOGGER.info("Checking panel files...")
    base_path = Path(__file__).parent.parent / "www"

    files_to_check = {
        "meraki-panel.js": base_path / "meraki-panel.js",
        "style.css": base_path / "style.css",
        "manifest.json": base_path.parent / "manifest.json",
    }

    files_ok = True
    for name, file_path in files_to_check.items():
        if file_path.exists():
            size = file_path.stat().st_size
            _LOGGER.info("✓ %s: %d bytes", name, size)
        else:
            _LOGGER.error("✗ %s: NOT FOUND at %s", name, file_path)
            files_ok = False

    # Check panel registration
    _LOGGER.info("Checking panel registration...")

    try:
        # Access the frontend panels (internal HA structure)
        panels = hass.data.get("frontend_panels", {})

        if "meraki" in panels:
            panel_info = panels["meraki"]
            _LOGGER.info("✓ Panel 'meraki' is registered")
            _LOGGER.info("  Component: %s", panel_info.get("component_name"))
            _LOGGER.info("  URL Path: %s", panel_info.get("url_path"))
            _LOGGER.info("  Title: %s", panel_info.get("title"))
            _LOGGER.info("  Require Admin: %s", panel_info.get("require_admin"))
        else:
            _LOGGER.error("✗ Panel 'meraki' is NOT registered")
            _LOGGER.error("  Available panels: %s", list(panels.keys()))
    except Exception as err:
        _LOGGER.error("✗ Error checking panel registration: %s", err)

    # Check config entries
    _LOGGER.info("Checking Meraki config entries...")
    entries = hass.config_entries.async_entries(DOMAIN)

    if entries:
        for entry in entries:
            _LOGGER.info(
                "✓ Config entry: %s (ID: %s, State: %s)",
                entry.title,
                entry.entry_id,
                entry.state.name,
            )
    else:
        _LOGGER.error("✗ No Meraki config entries found")

    # Check HTTP routes
    _LOGGER.info("Checking static paths...")
    try:
        # Note: This is implementation-specific and may change
        static_paths = getattr(hass.http, "_static_paths", {})

        panel_path = f"/api/panel_custom/{DOMAIN}"
        if panel_path in static_paths:
            _LOGGER.info("✓ Static path registered: %s", panel_path)
        else:
            _LOGGER.error("✗ Static path NOT registered: %s", panel_path)
            _LOGGER.error("  Registered paths: %s", list(static_paths.keys()))
    except Exception as err:
        _LOGGER.warning("Could not check static paths: %s", err)

    _LOGGER.info("=" * 60)
    _LOGGER.info("DIAGNOSTICS COMPLETE")
    _LOGGER.info("=" * 60)

    if files_ok:
        _LOGGER.info(
            "All files present. Check the logs above for panel registration status."
        )
    else:
        _LOGGER.error(
            "Missing files! Run 'cd custom_components/meraki_ha/www && npm run build'"
        )


def async_register_diagnostic_service(hass: HomeAssistant) -> None:
    """Register the diagnostic service."""
    hass.services.async_register(
        DOMAIN,
        "diagnose_panel",
        async_diagnose_panel,
    )
    _LOGGER.info("Registered meraki_ha.diagnose_panel service")

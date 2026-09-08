#!/usr/bin/env python3
"""Diagnostic script to check Meraki panel registration in Home Assistant."""

import json
import sys
from pathlib import Path


def check_panel_files():
    """Check if all required panel files exist."""
    print("=" * 60)
    print("Checking Meraki Panel Files")
    print("=" * 60)

    base_path = Path(__file__).parent / "custom_components" / "meraki_ha" / "www"

    required_files = {
        "meraki-panel.js": base_path / "meraki-panel.js",
        "style.css": base_path / "style.css",
        "manifest.json": base_path.parent / "manifest.json",
    }

    all_exist = True
    for name, file_path in required_files.items():
        exists = file_path.exists()
        size = file_path.stat().st_size if exists else 0
        status = "✓" if exists else "✗"

        if exists:
            print(f"{status} {name}: {size:,} bytes")
        else:
            print(f"{status} {name}: NOT FOUND")
            all_exist = False

    return all_exist


def check_manifest():
    """Check manifest.json configuration."""
    print("\n" + "=" * 60)
    print("Checking Manifest Configuration")
    print("=" * 60)

    manifest_path = (
        Path(__file__).parent / "custom_components" / "meraki_ha" / "manifest.json"
    )

    try:
        with open(manifest_path, encoding="utf-8") as f:
            manifest = json.load(f)

        print(f"Domain: {manifest.get('domain')}")
        print(f"Version: {manifest.get('version')}")
        print(f"Dependencies: {', '.join(manifest.get('dependencies', []))}")

        required_deps = ["frontend", "panel_custom", "http"]
        has_all_deps = all(
            dep in manifest.get("dependencies", []) for dep in required_deps
        )

        if has_all_deps:
            print("✓ All required dependencies present")
        else:
            print("✗ Missing required dependencies")
            return False

        return True
    except Exception as e:
        print(f"✗ Error reading manifest: {e}")
        return False


def check_frontend_code():
    """Check frontend registration code."""
    print("\n" + "=" * 60)
    print("Checking Frontend Registration")
    print("=" * 60)

    frontend_path = (
        Path(__file__).parent / "custom_components" / "meraki_ha" / "frontend.py"
    )

    try:
        with open(frontend_path, encoding="utf-8") as f:
            content = f.read()

        checks = {
            "async_register_panel": "async_register_panel" in content,
            "async_register_built_in_panel": "async_register_built_in_panel" in content,
            "frontend_url_path": "frontend_url_path" in content,
            "sidebar_title": "sidebar_title" in content,
        }

        for check_name, result in checks.items():
            status = "✓" if result else "✗"
            print(f"{status} {check_name}: {'Found' if result else 'Missing'}")

        return all(checks.values())
    except Exception as e:
        print(f"✗ Error reading frontend.py: {e}")
        return False


def print_instructions():
    """Print troubleshooting instructions."""
    print("\n" + "=" * 60)
    print("Troubleshooting Steps")
    print("=" * 60)
    print("""
1. RELOAD THE INTEGRATION:
   - Go to Settings > Devices & Services
   - Find "Meraki for Home Assistant"
   - Click the 3-dot menu > Reload

2. CLEAR BROWSER CACHE:
   - Press Ctrl+F5 (Windows/Linux) or Cmd+Shift+R (Mac)
   - Or use your browser's cache clearing function

3. CHECK USER PERMISSIONS:
   - Ensure you're logged in as an admin user
   - The panel requires admin privileges (require_admin=True)

4. VERIFY THE PANEL URL:
   - Try accessing directly: http://your-ha-ip:8123/meraki
   - Check browser console for JavaScript errors (F12)

5. CHECK HOME ASSISTANT LOGS:
   - Go to Settings > System > Logs
   - Filter by "meraki" or "frontend"
   - Look for any errors related to panel registration

6. RESTART HOME ASSISTANT (if above steps fail):
   - Settings > System > Restart

7. CHECK SIDEBAR:
   - The panel should appear as "Meraki" (or your config entry title)
   - With icon: mdi:router-network

8. VERIFY PANEL REGISTRATION IN LOGS:
   - Look for log messages like:
     * "Registering static path for Meraki HA frontend"
     * "Frontend module URL: /api/panel_custom/meraki_ha/meraki-panel.js"
""")


def main():
    """Run all diagnostic checks."""
    print("\nMeraki Home Assistant Panel Diagnostics")
    print("=" * 60)

    files_ok = check_panel_files()
    manifest_ok = check_manifest()
    frontend_ok = check_frontend_code()

    print("\n" + "=" * 60)
    print("Summary")
    print("=" * 60)

    if files_ok and manifest_ok and frontend_ok:
        print("✓ All checks passed!")
        print("\nIf the panel still doesn't appear:")
        print_instructions()
        return 0
    else:
        print("✗ Some checks failed. Please review the errors above.")
        return 1


if __name__ == "__main__":
    sys.exit(main())

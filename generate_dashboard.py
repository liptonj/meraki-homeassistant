#!/usr/bin/env python3
"""Generate a ready-to-use Meraki dashboard YAML.

This script reads your Home Assistant configuration, finds your Meraki config_entry_id,
and generates a dashboard YAML file ready to paste into the HA UI.
"""

import json
import os
import sys


def find_config_entry_id():
    """Try to find the Meraki config entry ID from HA config."""
    # Try to find .storage/core.config_entries
    possible_paths = [
        "/config/.storage/core.config_entries",
        "../.storage/core.config_entries",
        "../../.storage/core.config_entries",
        os.path.expanduser("~/.homeassistant/.storage/core.config_entries"),
    ]

    for path in possible_paths:
        if os.path.exists(path):
            try:
                with open(path) as f:
                    data = json.load(f)

                # Find meraki_ha entries
                for entry in data.get("data", {}).get("entries", []):
                    if entry.get("domain") == "meraki_ha":
                        return entry.get("entry_id")
            except Exception as e:
                print(f"Error reading {path}: {e}", file=sys.stderr)
                continue

    return None


def generate_dashboard_yaml(config_entry_id):
    """Generate the dashboard YAML with the config_entry_id filled in."""
    yaml_content = f"""# Meraki Home Assistant Dashboard - Ready to Use!
# Your config_entry_id has been automatically filled in: {config_entry_id}

title: Meraki Network
icon: mdi:router-network

views:
  # ============================================================================
  # OVERVIEW VIEW
  # ============================================================================
  - title: Overview
    path: overview
    icon: mdi:view-dashboard
    badges:
      - type: custom:meraki-status-badge
        config_entry_id: {config_entry_id}
      - type: custom:meraki-clients-badge
        config_entry_id: {config_entry_id}
      - type: custom:meraki-alerts-badge
        config_entry_id: {config_entry_id}

    cards:
      # Main overview card - full width
      - type: custom:meraki-overview-card
        config_entry_id: {config_entry_id}

      # Two cards side-by-side
      - type: horizontal-stack
        cards:
          - type: custom:meraki-clients-card
            config_entry_id: {config_entry_id}
            limit: 10

          - type: custom:meraki-ssids-list-card
            config_entry_id: {config_entry_id}

  # ============================================================================
  # DEVICES VIEW
  # ============================================================================
  - title: Devices
    path: devices
    icon: mdi:devices
    cards:
      - type: custom:meraki-devices-by-type-card
        config_entry_id: {config_entry_id}
        title: Meraki Devices
        show_switches: true
        show_wireless: true
        show_cameras: true
        show_sensors: true
        show_appliances: true
        devices_per_page: 10

  # ============================================================================
  # CLIENTS VIEW
  # ============================================================================
  - title: Clients
    path: clients
    icon: mdi:account-multiple
    cards:
      - type: custom:meraki-clients-card
        config_entry_id: {config_entry_id}
        title: Network Clients
        limit: 50
        show_offline: false

  # ============================================================================
  # EVENTS VIEW
  # ============================================================================
  - title: Events
    path: events
    icon: mdi:history
    cards:
      - type: custom:meraki-events-card
        config_entry_id: {config_entry_id}
        events_per_page: 10

  # ============================================================================
  # GUEST ACCESS VIEW
  # ============================================================================
  - title: Guest Access
    path: guest
    icon: mdi:account-key
    cards:
      - type: custom:meraki-guest-access-card
        config_entry_id: {config_entry_id}

  # ============================================================================
  # SETTINGS VIEW
  # ============================================================================
  - title: Settings
    path: settings
    icon: mdi:cog
    cards:
      - type: custom:meraki-mqtt-status-card
        config_entry_id: {config_entry_id}
        title: MQTT Integration
        show_relay_destinations: true
        show_message_stats: true
        show_sensor_count: true
        collapsible: true
        default_collapsed: false
"""

    return yaml_content


def main():
    """Generate the Meraki dashboard YAML file."""
    print("🔍 Looking for your Meraki config_entry_id...")

    config_entry_id = find_config_entry_id()

    if not config_entry_id:
        print("\n❌ Could not auto-detect config_entry_id")
        print("\nPlease provide it manually:")
        print("1. Open Home Assistant")
        print("2. Press F12 for Developer Console")
        print("3. Run: Object.keys(hass.data.meraki_ha)[0]")
        print("4. Run this script again with: python generate_dashboard.py YOUR_ID")

        if len(sys.argv) > 1:
            config_entry_id = sys.argv[1]
            print(f"\n✅ Using provided config_entry_id: {config_entry_id}")
        else:
            sys.exit(1)
    else:
        print(f"✅ Found config_entry_id: {config_entry_id}")

    # Generate YAML
    yaml_content = generate_dashboard_yaml(config_entry_id)

    # Write to file
    output_file = "meraki_dashboard_ready.yaml"
    with open(output_file, "w") as f:
        f.write(yaml_content)

    print(f"\n📄 Generated dashboard YAML: {output_file}")
    print("\n📋 Next steps:")
    print("1. Go to Settings → Dashboards → + Add Dashboard")
    print("2. Choose 'New dashboard from scratch'")
    print("3. Name: 'Meraki Network', URL: 'meraki_editable'")
    print("4. Click ⋮ → Edit Dashboard → Raw configuration editor")
    print(f"5. Copy content from {output_file} and paste it")
    print("6. Click Save")
    print("\n✨ Done! Your dashboard will be fully editable.")


if __name__ == "__main__":
    main()

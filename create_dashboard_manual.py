#!/usr/bin/env python3
"""Manual Meraki Dashboard Creator.

Run this script to manually create the Meraki dashboard in Home Assistant.
This bypasses the auto-creation issues in __init__.py.
"""

import asyncio
import sys
from pathlib import Path

# Add custom_components to path
sys.path.insert(0, str(Path(__file__).parent))


async def create_dashboard():
    """Create the Meraki dashboard manually."""
    print("🔧 Starting manual Meraki dashboard creation...")

    # You'll need to get these from your HA instance
    # Go to Developer Tools > States and find a meraki_ha sensor
    # to get the config_entry_id
    CONFIG_ENTRY_ID = "01KEWXQN207AMKWPF72B4R62CN"  # Update this if needed

    print(f"📋 Using config entry ID: {CONFIG_ENTRY_ID}")

    # Create a mock hass object with minimal data needed for dashboard generation
    # In production, you'd use the real hass instance from inside HA
    print("❌ ERROR: This script must be run from inside Home Assistant!")
    print("\n📝 Alternative: Use the REST API to create the dashboard")
    print("\n1. Get a Long-Lived Access Token:")
    print("   - Go to http://localhost:8123/profile")
    print("   - Scroll to 'Long-Lived Access Tokens'")
    print("   - Create token, copy it")
    print("\n2. Run this command (replace YOUR_TOKEN):")
    print("""
curl -X POST http://localhost:8123/api/services/lovelace/create_dashboard \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url_path": "meraki",
    "title": "Meraki Network",
    "icon": "mdi:router-network",
    "show_in_sidebar": true,
    "require_admin": false
  }'
""")

    print("\n3. Then manually add cards from the card picker!")
    print("   - Edit the dashboard")
    print("   - Click '+ ADD CARD'")
    print("   - Search for 'Meraki'")
    print("   - Add: Overview, Devices, Clients, Events, Guest Access, SSIDs, etc.")


if __name__ == "__main__":
    asyncio.run(create_dashboard())

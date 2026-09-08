"""
Generate screenshots of the Meraki Lovelace Dashboard.

This script:
1. Uses the actual MerakiDashboardStrategy to generate dashboard config
2. Creates screenshots of each view
3. Creates a full dashboard screenshot with tabs
"""

import asyncio
import http.server
import importlib.util
import json
import socketserver
import sys
import threading
import types
from functools import partial
from pathlib import Path
from unittest.mock import MagicMock

from playwright.sync_api import sync_playwright

# Configuration
TEST_PORT = 9988
REPO_ROOT = Path(__file__).parent.parent
SCREENSHOT_DIR = REPO_ROOT / "docs" / "images" / "lovelace"
WWW_DIR = REPO_ROOT / "custom_components" / "meraki_ha" / "www"

# Add to path
sys.path.insert(0, str(REPO_ROOT))


def _load_dashboard_strategy(repo_root: Path) -> tuple[str, type]:
    """
    Load DOMAIN and MerakiDashboardStrategy without Home Assistant installed.

    Importing ``custom_components.meraki_ha`` runs package ``__init__.py``, which
    requires Home Assistant, the Meraki SDK, and other integration deps. Screenshot
    CI only installs Playwright, so load ``const`` and ``dashboard`` as isolated
    submodules instead.
    """
    pkg_name = "custom_components.meraki_ha"
    pkg_dir = repo_root / "custom_components" / "meraki_ha"

    if "custom_components" not in sys.modules:
        custom_components = types.ModuleType("custom_components")
        custom_components.__path__ = [str(repo_root / "custom_components")]
        sys.modules["custom_components"] = custom_components

    package = types.ModuleType(pkg_name)
    package.__path__ = [str(pkg_dir)]
    package.__file__ = str(pkg_dir / "__init__.py")
    sys.modules[pkg_name] = package
    sys.modules["custom_components"].meraki_ha = package

    def ensure_module(name: str) -> types.ModuleType:
        existing = sys.modules.get(name)
        if isinstance(existing, types.ModuleType) and not isinstance(
            existing, MagicMock
        ):
            return existing
        module = types.ModuleType(name)
        sys.modules[name] = module
        parent_name, _, attr = name.rpartition(".")
        if parent_name:
            setattr(ensure_module(parent_name), attr, module)
        return module

    for ha_name in (
        "homeassistant",
        "homeassistant.core",
        "homeassistant.helpers",
        "homeassistant.helpers.device_registry",
    ):
        ensure_module(ha_name)
    sys.modules["homeassistant.core"].HomeAssistant = object

    def load_submodule(name: str, filename: str) -> types.ModuleType:
        full_name = f"{pkg_name}.{name}"
        spec = importlib.util.spec_from_file_location(full_name, pkg_dir / filename)
        if spec is None or spec.loader is None:
            raise ImportError(f"Cannot load {full_name} from {filename}")
        module = importlib.util.module_from_spec(spec)
        sys.modules[full_name] = module
        spec.loader.exec_module(module)
        setattr(package, name, module)
        return module

    const = load_submodule("const", "const.py")
    dashboard = load_submodule("dashboard", "dashboard.py")
    return const.DOMAIN, dashboard.MerakiDashboardStrategy


DOMAIN, MerakiDashboardStrategy = _load_dashboard_strategy(REPO_ROOT)

# Mock data
MOCK_DEVICES = [
    {
        "serial": "Q234-ABCD-SW1",
        "name": "Office Switch 1",
        "model": "MS225-24P",
        "mac": "00:11:22:33:44:55",
        "productType": "switch",
        "status": "alerting",
        "statusMessage": "High CPU usage detected",
        "firmware": "switch-15-21",
        "lanIp": "192.168.1.2",
    },
    {
        "serial": "Q234-ABCD-SW2",
        "name": "Office Switch 2",
        "model": "MS225-24P",
        "mac": "00:11:22:33:44:66",
        "productType": "switch",
        "status": "online",
        "firmware": "switch-15-21",
        "lanIp": "192.168.1.3",
    },
    {
        "serial": "Q234-ABCD-SW3",
        "name": "Warehouse Switch",
        "model": "MS120-8",
        "mac": "00:11:22:33:44:67",
        "productType": "switch",
        "status": "online",
        "firmware": "switch-15-21",
        "lanIp": "192.168.1.4",
    },
    {
        "serial": "Q234-ABCD-AP1",
        "name": "Lobby AP",
        "model": "MR46",
        "mac": "00:11:22:33:44:57",
        "productType": "wireless",
        "status": "online",
        "firmware": "wireless-29-5",
        "lanIp": "192.168.1.10",
    },
    {
        "serial": "Q234-ABCD-CAM1",
        "name": "Front Door Camera",
        "model": "MV12WE",
        "mac": "00:11:22:33:44:56",
        "productType": "camera",
        "status": "online",
        "firmware": "camera-4-18",
        "lanIp": "192.168.1.50",
    },
    {
        "serial": "Q234-ABCD-MT1",
        "name": "Server Room Sensor",
        "model": "MT10",
        "mac": "00:11:22:33:44:58",
        "productType": "sensor",
        "status": "online",
        "firmware": "sensor-1-12",
    },
]

MOCK_CLIENTS = [
    {
        "id": "k12345",
        "mac": "a4:83:e7:12:34:56",
        "description": "John's MacBook Pro",
        "ip": "192.168.1.101",
        "manufacturer": "Apple",
        "os": "macOS",
        "status": "Online",
        "vlan": 100,
        "ssid": "Corporate WiFi",
        "usage": {"sent": 1524288000, "recv": 3048576000},
        "firstSeen": "2026-01-10T08:00:00Z",
        "lastSeen": "2026-01-13T14:00:00Z",
    },
    {
        "id": "k12346",
        "mac": "f0:18:98:aa:bb:cc",
        "description": "Sarah's iPhone",
        "ip": "192.168.1.150",
        "manufacturer": "Apple",
        "os": "iOS",
        "status": "Online",
        "vlan": 100,
        "ssid": "Corporate WiFi",
        "usage": {"sent": 524288000, "recv": 1048576000},
        "firstSeen": "2026-01-12T09:00:00Z",
        "lastSeen": "2026-01-13T14:05:00Z",
    },
    {
        "id": "k12347",
        "mac": "5c:aa:fd:11:22:33",
        "description": "Living Room Sonos",
        "ip": "192.168.1.205",
        "manufacturer": "Sonos",
        "os": "",
        "status": "Online",
        "vlan": 100,
        "ssid": "Corporate WiFi",
        "usage": {"sent": 104857600, "recv": 209715200},
        "firstSeen": "2026-01-08T10:00:00Z",
        "lastSeen": "2026-01-13T14:10:00Z",
        "ha_device_id": "sonos_living_room",  # Links to HA device
    },
    {
        "id": "k12348",
        "mac": "a0:99:88:77:66:55",
        "description": "Guest Laptop",
        "ip": "192.168.2.50",
        "manufacturer": "Dell",
        "os": "Windows",
        "status": "Online",
        "vlan": 200,
        "ssid": "Guest Network",
        "usage": {"sent": 52428800, "recv": 104857600},
        "firstSeen": "2026-01-13T13:00:00Z",
        "lastSeen": "2026-01-13T14:00:00Z",
    },
]

MOCK_SSIDS = [
    {"number": 0, "name": "Corporate WiFi", "enabled": True},
    {"number": 1, "name": "Guest Network", "enabled": True},
]

MOCK_EVENTS = [
    {
        "type": "device_status",
        "description": "Office Switch 1 went offline",
        "timestamp": "2026-01-13T10:45:00Z",
        "severity": "critical",
        "network": "Main Office",
        "device": "Office Switch 1",
    },
    {
        "type": "client_connected",
        "description": "John's MacBook Pro connected to Corporate WiFi",
        "timestamp": "2026-01-13T11:30:00Z",
        "severity": "info",
        "network": "Main Office",
    },
    {
        "type": "ssid_change",
        "description": "Guest Network SSID was disabled",
        "timestamp": "2026-01-13T09:15:00Z",
        "severity": "warning",
        "network": "Main Office",
    },
]

MOCK_ALERTS = [
    {
        "type": "connectivity",
        "message": "Switch offline: Office Switch 1",
        "severity": "critical",
        "timestamp": "2026-01-13T10:45:00Z",
    },
    {
        "type": "usage",
        "message": "High bandwidth usage on Lobby AP",
        "severity": "warning",
        "timestamp": "2026-01-13T11:20:00Z",
    },
]

# MQTT status entity
MOCK_MQTT_STATUS = {
    "binary_sensor.meraki_mqtt_status": {
        "entity_id": "binary_sensor.meraki_mqtt_status",
        "state": "on",
        "attributes": {
            "friendly_name": "MQTT Connection",
            "device_class": "connectivity",
            "connected_topics": 4,
            "last_message": "2026-01-13T14:20:00Z",
        },
    },
}


class ReuseAddrTCPServer(socketserver.TCPServer):
    """TCP Server that allows address reuse."""

    allow_reuse_address = True


async def generate_dashboard_config():
    """Generate dashboard config using MerakiDashboardStrategy."""
    mock_hass = MagicMock()
    mock_hass.data = {
        DOMAIN: {
            "test_entry": {
                "coordinator": MagicMock(
                    data={
                        "devices": MOCK_DEVICES,
                        "clients": MOCK_CLIENTS,
                        "ssids": MOCK_SSIDS,
                    }
                )
            }
        }
    }

    # Mock device registry
    from homeassistant.helpers import device_registry as dr

    original_get = dr.async_get

    def mock_async_get(hass):
        mock_registry = MagicMock()
        mock_registry.async_get_device = (
            lambda **kwargs: None
        )  # Forces fallback to device_serial
        return mock_registry

    dr.async_get = mock_async_get

    try:
        strategy = MerakiDashboardStrategy()
        config = await strategy.async_generate(mock_hass, "test_entry")
        return config
    finally:
        dr.async_get = original_get


def create_full_dashboard_html(dashboard_config):
    """Create HTML showing full dashboard with working tabs."""
    views = dashboard_config.get("views", [])

    # Build tabs
    tabs_html = "\n".join(
        [
            f'<button class="tab {("active" if i == 0 else "")}" onclick="showView({i})">{view["title"]}</button>'
            for i, view in enumerate(views)
        ]
    )

    return f"""<!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
    <title>Meraki Dashboard</title>
    <script type="importmap">
    {{
        "imports": {{
            "lit": "https://cdn.jsdelivr.net/npm/lit@3.1.0/+esm",
            "lit/": "https://cdn.jsdelivr.net/npm/lit@3.1.0/"
        }}
    }}
    </script>
                <style>
        :root {{
            --primary-color: #03a9f4;
            --primary-background-color: #0f172a;
            --secondary-background-color: #1e293b;
            --divider-color: #334155;
            --primary-text-color: #f1f5f9;
        }}
        body {{
            margin: 0;
            padding: 0;
            font-family: Roboto, sans-serif;
            background: var(--primary-background-color);
            color: var(--primary-text-color);
        }}
        .header {{
            background: var(--secondary-background-color);
            padding: 16px 24px;
            font-size: 24px;
            font-weight: 500;
            border-bottom: 1px solid var(--divider-color);
        }}
        .tabs {{
            display: flex;
            gap: 4px;
            padding: 12px 24px 0;
            border-bottom: 2px solid var(--divider-color);
        }}
        .tab {{
            padding: 12px 24px;
            background: transparent;
            border: none;
            color: #94a3b8;
            cursor: pointer;
            font-size: 16px;
            font-weight: 500;
            border-radius: 8px 8px 0 0;
            transition: all 0.2s;
        }}
        .tab:hover {{
            background: var(--secondary-background-color);
            color: var(--primary-text-color);
        }}
        .tab.active {{
            background: var(--secondary-background-color);
            color: var(--primary-color);
            border-bottom: 2px solid var(--primary-color);
        }}
        .view-content {{
            padding: 24px;
            min-height: 800px;
        }}
        .placeholder {{
            text-align: center;
            padding: 48px;
            color: #64748b;
            font-size: 18px;
        }}
        iframe {{
            width: 100%;
            height: 1000px;
            border: none;
        }}
                </style>
            </head>
            <body>
    <div class="header">🔷 {dashboard_config.get("title", "Meraki Dashboard")}</div>
    <div class="tabs">{tabs_html}</div>
    <div class="view-content">
        <iframe id="content-frame" src="/screenshot_view_0.html"></iframe>
    </div>
    <script>
        function showView(index) {{
            // Update tabs
            document.querySelectorAll('.tab').forEach((t, i) => {{
                t.classList.toggle('active', i === index);
            }});

            // Load view in iframe
            document.getElementById('content-frame').src = `/screenshot_view_${{index}}.html`;
        }}

        // Wait for iframe to load, then signal ready
            setTimeout(() => {{
            window.__DASHBOARD_READY__ = true;
            console.log('Dashboard ready');
        }}, 6000);
    </script>
            </body>
</html>"""


def run_server(port, directory):
    """Start HTTP server."""
    handler = partial(http.server.SimpleHTTPRequestHandler, directory=str(directory))
    server = ReuseAddrTCPServer(("", port), handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    return server


def main():
    """Main function."""
    print("=" * 70)
    print("MERAKI DASHBOARD SCREENSHOT GENERATOR")
    print("=" * 70)

    # Ensure directories exist
    SCREENSHOT_DIR.mkdir(parents=True, exist_ok=True)

    # Generate dashboard config
    print("\n📋 Generating dashboard configuration...")
    dashboard_config = asyncio.run(generate_dashboard_config())

    if not dashboard_config:
        print("❌ Failed to generate dashboard")
        return 1

    views = dashboard_config.get("views", [])
    print(f"✓ Generated {len(views)} views:")
    for view in views:
        print(f"  - {view['title']}: {len(view['cards'])} cards")

    # Start server
    print(f"\n🌐 Starting server on port {TEST_PORT}...")
    server = run_server(TEST_PORT, WWW_DIR)

    # Import the working script's functions for individual views
    sys.path.insert(0, str(Path(__file__).parent))

    # We need the full create_view_html function - let me inline a simplified version
    def create_view_html_with_data(view, view_index):
        """Create HTML for view with proper mock data."""
        # Create proper SSID entities
        entities_json = json.dumps(
            {
                "switch.main_office_corporate_wifi_enabled_switch": {
                    "entity_id": "switch.main_office_corporate_wifi_enabled_switch",
                    "state": "on",
                    "attributes": {
                        "friendly_name": "Corporate WiFi Enabled",
                        "entity_category": "config",
                        "network_id": "N_12345",
                        "network_name": "Main Office",
                        "ssid_number": 0,
                        "ssid_name": "Corporate WiFi",
                        "auth_mode": "psk",
                        "vlan_id": 100,
                    },
                },
                "switch.main_office_guest_network_enabled_switch": {
                    "entity_id": "switch.main_office_guest_network_enabled_switch",
                    "state": "on",
                    "attributes": {
                        "friendly_name": "Guest Network Enabled",
                        "entity_category": "config",
                        "network_id": "N_12345",
                        "network_name": "Main Office",
                        "ssid_number": 1,
                        "ssid_name": "Guest Network",
                        "auth_mode": "open",
                        "vlan_id": 200,
                    },
                },
                "sensor.main_office_ssid_0_client_count": {
                    "entity_id": "sensor.main_office_ssid_0_client_count",
                    "state": "12",
                    "attributes": {"friendly_name": "Corporate WiFi Clients"},
                },
                "sensor.main_office_ssid_1_client_count": {
                    "entity_id": "sensor.main_office_ssid_1_client_count",
                    "state": "3",
                    "attributes": {"friendly_name": "Guest Network Clients"},
                },
                "binary_sensor.meraki_mqtt_status": {
                    "entity_id": "binary_sensor.meraki_mqtt_status",
                    "state": "on",
                    "attributes": {
                        "friendly_name": "MQTT Connection",
                        "device_class": "connectivity",
                        "connected": True,
                    },
                },
                # Sonos HA entities (linked to Meraki client)
                "media_player.living_room_sonos": {
                    "entity_id": "media_player.living_room_sonos",
                    "state": "playing",
                    "attributes": {
                        "friendly_name": "Living Room Sonos",
                        "volume_level": 0.35,
                        "media_title": "Jazz Vibes",
                        "media_artist": "Various Artists",
                        "device_class": "speaker",
                    },
                },
                "switch.living_room_sonos_shuffle": {
                    "entity_id": "switch.living_room_sonos_shuffle",
                    "state": "off",
                    "attributes": {"friendly_name": "Shuffle"},
                },
                "sensor.living_room_sonos_battery": {
                    "entity_id": "sensor.living_room_sonos_battery",
                    "state": "95",
                    "attributes": {
                        "friendly_name": "Battery",
                        "unit_of_measurement": "%",
                    },
                },
            }
        )

        events_json = json.dumps(MOCK_EVENTS)
        alerts_json = json.dumps(MOCK_ALERTS)
        devices_json = json.dumps(MOCK_DEVICES)
        clients_json = json.dumps(MOCK_CLIENTS)
        ssids_json = json.dumps(MOCK_SSIDS)

        # Build cards HTML
        cards_html = ""
        for i, card in enumerate(view.get("cards", [])):
            card_type = card["type"].replace("custom:", "")
            card_config = {**card, "config_entry_id": "test_entry"}

            # Handle device serial mapping
            if card_type == "meraki-device-card" and "device_id" in card_config:
                if i < len(MOCK_DEVICES):
                    card_config["device_serial"] = MOCK_DEVICES[i]["serial"]
                    card_config.pop("device_id", None)

            cards_html += f"<{card_type} id=\"card_{i}\" data-config='{json.dumps(card_config)}'></{card_type}>\n"

        # Build badges HTML if present
        badges_html = ""
        if view.get("badges"):
            badges_section = '<div class="badges-container">\n'
            for i, badge in enumerate(view["badges"]):
                badge_type = badge["type"].replace("custom:", "")
                badge_config = {**badge, "config_entry_id": "test_entry"}
                badges_section += f"<{badge_type} id=\"badge_{i}\" data-config='{json.dumps(badge_config)}'></{badge_type}>\n"
            badges_section += "</div>\n"
            badges_html = badges_section

        return f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{view["title"]}</title>
    <script type="importmap">
    {{"imports": {{"lit": "https://cdn.jsdelivr.net/npm/lit@3.1.0/+esm", "lit/": "https://cdn.jsdelivr.net/npm/lit@3.1.0/"}}}}
    </script>
    <style>
        :root {{
            --primary-color: #03a9f4;
            --primary-background-color: #0f172a;
            --secondary-background-color: #1e293b;
            --card-background-color: #1e293b;
            --divider-color: #334155;
            --primary-text-color: #f1f5f9;
            --secondary-text-color: #94a3b8;
            --meraki-success: #10b981;
            --meraki-warning: #f59e0b;
            --meraki-error: #ef4444;
            --ha-card-border-radius: 12px;
            --ha-card-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }}
        body {{ margin: 0; padding: 24px; background: var(--primary-background-color); color: var(--primary-text-color); font-family: Roboto, sans-serif; }}
        .view-header {{ font-size: 24px; font-weight: 500; margin-bottom: 16px; }}
        .badges-container {{ display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }}
        .cards-container {{ display: grid; grid-template-columns: 1fr; gap: 16px; max-width: 1200px; }}
    </style>
</head>
<body>
    <div class="view-header">{view["title"]}</div>
    {badges_html}
    <div class="cards-container">{cards_html}</div>
    <script type="module" src="/local/community/meraki_ha/shared/meraki-card-base.js"></script>
    <script type="module">
        import '/local/community/meraki_ha/meraki-overview-card.js';
        import '/local/community/meraki_ha/meraki-device-card.js';
        import '/local/community/meraki_ha/meraki-devices-by-type-card.js';
        import '/local/community/meraki_ha/meraki-clients-card.js';
        import '/local/community/meraki_ha/meraki-client-card/meraki-client-card.js';
        import '/local/community/meraki_ha/meraki-ssids-list-card.js';
        import '/local/community/meraki_ha/meraki-events-card.js';
        import '/local/community/meraki_ha/meraki-guest-access-card.js';
        import '/local/community/meraki_ha/meraki-mqtt-status-card.js';
        import '/local/community/meraki_ha/badges/meraki-status-badge.js';
        import '/local/community/meraki_ha/badges/meraki-clients-badge.js';
        import '/local/community/meraki_ha/badges/meraki-alerts-badge.js';

        // Wait for card elements
        await Promise.all(['meraki-overview-card', 'meraki-devices-by-type-card', 'meraki-clients-card', 'meraki-client-card', 'meraki-ssids-list-card', 'meraki-events-card', 'meraki-guest-access-card', 'meraki-mqtt-status-card', 'meraki-status-badge', 'meraki-clients-badge', 'meraki-alerts-badge'].map(t => customElements.whenDefined(t)));

        const mockHass = {{
            connection: {{
                sendMessagePromise: async (msg) => {{
                    if (msg.type === 'meraki/get_overview') return {{ devices: {devices_json}, clients: {clients_json}, ssids: {ssids_json}, alerts: {alerts_json} }};
                    if (msg.type === 'meraki/get_events') return {{ events: {events_json} }};
                    if (msg.type === 'meraki/get_device' && msg.serial) return {devices_json}.find(d => d.serial === msg.serial) || null;
                    if (msg.type === 'meraki/get_clients') return {clients_json};  // Return array directly
                    if (msg.type === 'meraki/get_client' && msg.client_id) return {clients_json}.find(c => c.id === msg.client_id) || null;
                    if (msg.type === 'meraki/get_client' && msg.mac) return {clients_json}.find(c => c.mac.toLowerCase() === msg.mac.toLowerCase()) || null;
                    if (msg.type === 'meraki/get_mqtt_status') return {{
                        enabled: true,
                        connected: true,
                        messages_received: 1247,
                        messages_sent: 893,
                        sensors_monitored: 4,
                        relay_destinations: [
                            {{ host: 'mqtt.local', port: 1883, connected: true }},
                            {{ host: 'backup.mqtt.local', port: 1883, connected: false }}
                        ]
                    }};
                    return {{}};
                }},
                subscribeMessage: (cb, params) => (setTimeout(() => cb({{}}), 100), () => {{}})
            }},
            states: {entities_json},
            callService: async () => ({{}}),
            language: 'en',
            locale: {{ language: 'en' }}
        }};

        // Initialize all cards
        document.querySelectorAll('[data-config]').forEach((el, i) => {{
            const config = JSON.parse(el.dataset.config);
            el.hass = mockHass;
            if (el.setConfig) el.setConfig(config);
        }});

        setTimeout(() => {{ window.__VIEW_READY__ = true; }}, 4000);
    </script>
</body>
</html>"""

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page(viewport={"width": 1600, "height": 1200})

            # Generate individual view screenshots
            print("\n📸 Generating view screenshots...")

            for i, view in enumerate(views):
                view_path = view.get("path", f"view_{i}")
                view_title = view.get("title", "View")

                # Skip full dashboard for individual views
                if view_path == "full":
                    continue

                # Create HTML using our inline function
                html_content = create_view_html_with_data(view, i)
                html_path = WWW_DIR / f"screenshot_view_{i}.html"
                html_path.write_text(html_content)

                # Load and capture
                page.goto(f"http://localhost:{TEST_PORT}/screenshot_view_{i}.html")
                page.wait_for_timeout(5000)

                try:
                    page.wait_for_function(
                        "window.__VIEW_READY__ === true", timeout=45000
                    )
                except:
                    pass

                page.wait_for_timeout(3000)

                # Get page height for screenshot
                height = page.evaluate("document.body.scrollHeight")
                page.set_viewport_size({"width": 1270, "height": max(height + 50, 900)})
                page.wait_for_timeout(1000)

                filename = f"view_{view_path}.png"
                screenshot_path = SCREENSHOT_DIR / filename
                page.screenshot(path=str(screenshot_path), full_page=True)
                print(f"  ✓ {filename} ({view_title})")

            # Generate full dashboard
            print("\n📸 Generating full dashboard screenshot...")
            html_content = create_full_dashboard_html(dashboard_config)
            html_path = WWW_DIR / "full_dashboard.html"
            html_path.write_text(html_content)

            page.set_viewport_size({"width": 1600, "height": 1400})
            page.goto(f"http://localhost:{TEST_PORT}/full_dashboard.html")
            page.wait_for_timeout(7000)

            try:
                page.wait_for_function(
                    "window.__DASHBOARD_READY__ === true", timeout=10000
                )
            except:
                pass

                page.wait_for_timeout(2000)

            screenshot_path = SCREENSHOT_DIR / "full_dashboard.png"
            page.screenshot(path=str(screenshot_path))
            print("  ✓ full_dashboard.png")

            browser.close()

        print("\n" + "=" * 70)
        print("✅ All screenshots generated successfully!")
        print(f"📁 Location: {SCREENSHOT_DIR}")
        print("=" * 70)

    finally:
        server.shutdown()
        # Cleanup temp files
        for i in range(len(views)):
            temp_file = WWW_DIR / f"screenshot_view_{i}.html"
            if temp_file.exists():
                temp_file.unlink()
        temp_file = WWW_DIR / "full_dashboard.html"
        if temp_file.exists():
            temp_file.unlink()

    return 0


if __name__ == "__main__":
    sys.exit(main())

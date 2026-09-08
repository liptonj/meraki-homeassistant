"""
Generate screenshots of the Meraki Lovelace Dashboard.

This script:
1. Uses the actual MerakiDashboardStrategy to generate dashboard config
2. Creates screenshots of each view
3. Creates a full dashboard screenshot with tabs
"""

import asyncio
import http.server
import socketserver
import sys
import threading
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
sys.path.insert(0, str(Path(__file__).parent))

from generate_screenshots import DOMAIN, MerakiDashboardStrategy

# Mock data
MOCK_DEVICES = [
    {
        "serial": "Q234-ABCD-SW1",
        "name": "Office Switch 1",
        "model": "MS225-24P",
        "mac": "00:11:22:33:44:55",
        "productType": "switch",
        "status": "online",
        "firmware": "switch-15-21",
        "lanIp": "192.168.1.2",
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
    {"id": "k12345", "mac": "a4:83:e7:12:34:56", "description": "John's MacBook Pro"},
    {"id": "k12346", "mac": "f0:18:98:aa:bb:cc", "description": "Sarah's iPhone"},
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
]


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
    from generate_screenshots import create_view_html

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page(viewport={"width": 1600, "height": 1200})

            # Generate individual view screenshots
            print("\n📸 Generating view screenshots...")
            for i, view in enumerate(views):
                # Create HTML
                html_content = create_view_html(view, i)
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

                filename = f"view_{view['path']}.png"
                screenshot_path = SCREENSHOT_DIR / filename
                page.screenshot(path=str(screenshot_path), full_page=True)
                print(f"  ✓ {filename}")

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

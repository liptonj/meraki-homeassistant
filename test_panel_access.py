#!/usr/bin/env python3
"""
Quick test to verify Meraki panel is accessible in Home Assistant.

Usage:
    python3 test_panel_access.py [homeassistant_url]

Example:
    python3 test_panel_access.py http://homeassistant.local:8123
"""

import sys
import urllib.error
import urllib.request


def test_panel_access(base_url: str) -> bool:
    """Test if the Meraki panel resources are accessible."""
    print(f"\nTesting Meraki Panel Access on: {base_url}")
    print("=" * 60)

    # Test endpoints
    endpoints = {
        "Panel URL (direct)": f"{base_url}/meraki",
        "Panel JS (static)": f"{base_url}/api/panel_custom/meraki_ha/meraki-panel.js",
        "Panel CSS (static)": f"{base_url}/api/panel_custom/meraki_ha/style.css",
    }

    all_ok = True

    for name, url in endpoints.items():
        try:
            print(f"\nTesting: {name}")
            print(f"URL: {url}")

            req = urllib.request.Request(url, method="HEAD")
            with urllib.request.urlopen(req, timeout=5) as response:
                status = response.status
                content_type = response.headers.get("Content-Type", "unknown")

                if status == 200:
                    print(f"✓ Status: {status} (OK)")
                    print(f"  Content-Type: {content_type}")
                else:
                    print(f"✗ Status: {status}")
                    all_ok = False

        except urllib.error.HTTPError as e:
            print(f"✗ HTTP Error: {e.code} - {e.reason}")
            if e.code == 401:
                print("  → Authentication required (this is expected)")
                print("  → Panel is registered but requires login")
            elif e.code == 404:
                print("  → Not found - panel may not be registered")
                all_ok = False
            else:
                all_ok = False

        except urllib.error.URLError as e:
            print(f"✗ Connection Error: {e.reason}")
            print("  → Is Home Assistant running?")
            all_ok = False

        except Exception as e:
            print(f"✗ Unexpected Error: {e}")
            all_ok = False

    print("\n" + "=" * 60)
    if all_ok:
        print("✓ All tests passed!")
    else:
        print("✗ Some tests failed")
        print("\nCommon fixes:")
        print("1. Reload the Meraki integration")
        print("2. Restart Home Assistant")
        print("3. Check that you're logged in as an admin")
    print()

    return all_ok


def main():
    """Run the panel access test."""
    if len(sys.argv) > 1:
        base_url = sys.argv[1].rstrip("/")
    else:
        base_url = input(
            "Enter your Home Assistant URL (e.g., http://homeassistant.local:8123): "
        ).rstrip("/")

    if not base_url.startswith("http"):
        print("Error: URL must start with http:// or https://")
        return 1

    success = test_panel_access(base_url)
    return 0 if success else 1


if __name__ == "__main__":
    sys.exit(main())

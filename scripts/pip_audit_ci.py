#!/usr/bin/env python3
"""Fail CI only for vulnerabilities in packages this integration ships.

Home Assistant 2025.11 pins packages such as ``zeroconf==0.148.0`` exactly.
Those advisories belong to Core's dependency set, not this custom component.
The local project name ``meraki-homeassistant`` is also not on PyPI, so
pip-audit skips it; that skip is not a failure.
"""

from __future__ import annotations

import json
import subprocess
import sys
from typing import Any

# Packages listed in manifest.json that this repo can bump independently.
# aiohttp is required at runtime but Home Assistant pins the installed version.
INTEGRATION_PACKAGES = frozenset(
    {
        "meraki",
        "diskcache",
        "aiofiles",
        "aiomqtt",
    }
)


def _run_pip_audit() -> dict[str, Any]:
    """Return the pip-audit JSON report for the current environment."""
    result = subprocess.run(
        [sys.executable, "-m", "pip_audit", "--format", "json"],
        check=False,
        capture_output=True,
        text=True,
    )
    if not result.stdout.strip():
        print(result.stderr, file=sys.stderr)
        raise SystemExit(result.returncode or 1)
    return json.loads(result.stdout)


def main() -> int:
    """Run pip-audit and fail only on integration-owned findings."""
    report = _run_pip_audit()
    blocking: list[str] = []
    ignored = 0
    skipped = 0

    for dep in report.get("dependencies", []):
        name = str(dep.get("name", ""))
        skip_reason = dep.get("skip_reason")
        if skip_reason:
            skipped += 1
            print(f"SKIP {name}: {skip_reason}")
            continue

        vulns = dep.get("vulns") or []
        if not vulns:
            continue

        ids = ", ".join(str(v.get("id")) for v in vulns)
        if name in INTEGRATION_PACKAGES:
            blocking.append(f"{name} {dep.get('version')}: {ids}")
        else:
            ignored += len(vulns)
            print(f"IGNORE {name} {dep.get('version')}: {ids}")

    if blocking:
        print("\nBlocking vulnerabilities in integration packages:")
        for line in blocking:
            print(f"  {line}")
        return 1

    print(
        f"\nNo blocking findings. Ignored {ignored} advisories in "
        f"Home Assistant / toolchain packages; skipped {skipped} unauditable "
        "dependencies."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

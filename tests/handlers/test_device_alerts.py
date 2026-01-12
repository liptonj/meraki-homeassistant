"""Tests for the device alert handler."""

from __future__ import annotations

from unittest.mock import MagicMock

import pytest

from custom_components.meraki_ha.handlers.device_alerts import (
    async_handle_device_alert,
)


@pytest.mark.asyncio
async def test_async_handle_device_alert():
    """Test the async_handle_device_alert function."""
    coordinator = MagicMock()
    coordinator._targeted_device_refresh = MagicMock(return_value="refresh_task")
    alert_type = "APs came up"
    data = {"deviceSerial": "Q234-ABCD-5678"}

    await async_handle_device_alert(coordinator, alert_type, data)

    # Verify the device status was updated immediately
    coordinator._update_device_status_immediate.assert_called_once_with(
        "Q234-ABCD-5678", True
    )
    # Verify listeners were updated
    coordinator.async_update_listeners.assert_called_once()
    # Verify a targeted refresh task was created
    coordinator._targeted_device_refresh.assert_called_once_with(
        "Q234-ABCD-5678", delay=5
    )
    coordinator.hass.async_create_task.assert_called_once()

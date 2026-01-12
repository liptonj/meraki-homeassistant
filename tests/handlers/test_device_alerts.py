from __future__ import annotations

"""Tests for the device alert handler."""


import asyncio
from unittest.mock import AsyncMock, patch

import pytest

from custom_components.meraki_ha.handlers.device_alerts import (
    async_handle_device_alert,
)


@pytest.mark.asyncio
async def test_async_handle_device_alert():
    """Test the async_handle_device_alert function."""
    coordinator = AsyncMock()
    alert_type = "APs came up"
    data = {"deviceSerial": "Q234-ABCD-5678"}

    with patch(
        "custom_components.meraki_ha.meraki_data_coordinator.MerakiDataCoordinator._targeted_device_refresh",
        new_callable=AsyncMock,
    ) as mock_refresh:
        await async_handle_device_alert(coordinator, alert_type, data)
        await asyncio.sleep(0)  # Allow the task to be created
        coordinator.hass.async_create_task.assert_called_once()
        mock_refresh.assert_called_once_with("Q234-ABCD-5678", delay=5)

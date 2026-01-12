"""Tests for the webhook options flow."""

from __future__ import annotations

from unittest.mock import MagicMock

import pytest
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from custom_components.meraki_ha.options_flow import MerakiOptionsFlowHandler


@pytest.fixture
def mock_config_entry() -> ConfigEntry:
    """Fixture for a mock ConfigEntry."""
    return MagicMock(spec=ConfigEntry, options={})


@pytest.fixture
def mock_options_flow(mock_config_entry: ConfigEntry) -> MerakiOptionsFlowHandler:
    """Fixture for a MerakiOptionsFlowHandler."""
    flow = MerakiOptionsFlowHandler(mock_config_entry)
    flow.hass = MagicMock(spec=HomeAssistant)
    return flow


async def test_show_webhook_form(mock_options_flow: MerakiOptionsFlowHandler) -> None:
    """Test that the webhook form is shown."""
    result = await mock_options_flow.async_step_webhooks()
    assert result["type"] == "form"
    assert result["step_id"] == "webhooks"

"""Tests for the card diagnostics WebSocket service."""

from __future__ import annotations

from typing import Any
from unittest.mock import MagicMock, patch

import pytest

from custom_components.meraki_ha.const import DOMAIN
from custom_components.meraki_ha.services.card_diagnostics import (
    async_register_card_diagnostics,
    websocket_card_diagnostics,
)


class MockConnection:
    """Mock WebSocket connection that matches ActiveConnection interface."""

    def __init__(self) -> None:
        """Initialize mock connection."""
        self.results: list[tuple[int, dict[str, Any]]] = []

    def send_result(self, msg_id: int, result: dict[str, Any]) -> None:
        """Record sent result."""
        self.results.append((msg_id, result))

    # Additional ActiveConnection methods (not used but needed for typing)
    def send_message(self, msg: dict[str, Any]) -> None:
        """Mock send_message method."""
        pass

    def send_error(self, msg_id: int, code: str, message: str) -> None:
        """Mock send_error method."""
        pass


@pytest.fixture
def mock_hass() -> MagicMock:
    """Create a mock Home Assistant instance."""
    hass = MagicMock()
    hass.data = {}
    hass.config_entries = MagicMock()
    hass.config_entries.async_entries = MagicMock(return_value=[])
    return hass


@pytest.fixture
def mock_connection() -> MockConnection:
    """Create a mock WebSocket connection."""
    return MockConnection()


class TestCardDiagnostics:
    """Tests for card diagnostics WebSocket command."""

    def test_register_command(self, mock_hass: MagicMock) -> None:
        """Test that the command is registered."""
        with patch(
            "custom_components.meraki_ha.services.card_diagnostics.websocket_api"
        ) as mock_ws_api:
            async_register_card_diagnostics(mock_hass)
            mock_ws_api.async_register_command.assert_called_once()

    def test_no_config_entry_id_returns_available_entries(
        self, mock_hass: MagicMock, mock_connection: MockConnection
    ) -> None:
        """Test that missing config_entry_id returns available entries."""
        mock_entry = MagicMock()
        mock_entry.entry_id = "test_entry_123"
        mock_entry.title = "Test Meraki"
        mock_entry.state = MagicMock()
        mock_entry.state.name = "LOADED"
        mock_hass.config_entries.async_entries.return_value = [mock_entry]

        msg = {"id": 1, "type": "meraki/card_diagnostics"}

        websocket_card_diagnostics(mock_hass, mock_connection, msg)  # type: ignore[arg-type]

        assert len(mock_connection.results) == 1
        msg_id, result = mock_connection.results[0]
        assert msg_id == 1
        assert result["status"] == "info"
        assert len(result["available_entries"]) == 1
        assert result["available_entries"][0]["entry_id"] == "test_entry_123"

    def test_invalid_config_entry_id_returns_error(
        self, mock_hass: MagicMock, mock_connection: MockConnection
    ) -> None:
        """Test that an invalid config_entry_id returns an error."""
        mock_hass.data = {DOMAIN: {}}  # Empty domain data
        mock_hass.config_entries.async_entries.return_value = []

        msg = {
            "id": 1,
            "type": "meraki/card_diagnostics",
            "config_entry_id": "invalid_id",
        }

        websocket_card_diagnostics(mock_hass, mock_connection, msg)  # type: ignore[arg-type]

        assert len(mock_connection.results) == 1
        msg_id, result = mock_connection.results[0]
        assert msg_id == 1
        assert result["status"] == "error"
        assert "not found" in result["message"]

    def test_valid_config_entry_returns_diagnostics(
        self, mock_hass: MagicMock, mock_connection: MockConnection
    ) -> None:
        """Test that a valid config_entry_id returns diagnostics."""
        mock_coordinator = MagicMock()
        mock_coordinator.data = {
            "devices": [
                {"status": "online", "name": "AP-1"},
                {"status": "online", "name": "AP-2"},
                {"status": "alerting", "name": "SW-1"},
                {"status": "offline", "name": "CAM-1"},
            ],
            "clients": [{"mac": "aa:bb:cc:dd:ee:ff"}],
            "ssids": [{"name": "Corp"}, {"name": "Guest"}],
            "networks": [{"id": "L_123", "name": "Office"}],
        }
        mock_coordinator.last_update_success = True
        mock_coordinator.update_interval = MagicMock()
        mock_coordinator.update_interval.total_seconds = MagicMock(return_value=60)

        mock_hass.data = {
            DOMAIN: {
                "test_entry_123": {
                    "coordinator": mock_coordinator,
                    "mqtt_service": None,
                    "camera_service": MagicMock(),
                    "device_control_service": MagicMock(),
                }
            }
        }
        mock_hass.config_entries.async_entries.return_value = []

        msg = {
            "id": 1,
            "type": "meraki/card_diagnostics",
            "config_entry_id": "test_entry_123",
        }

        websocket_card_diagnostics(mock_hass, mock_connection, msg)  # type: ignore[arg-type]

        assert len(mock_connection.results) == 1
        msg_id, result = mock_connection.results[0]
        assert msg_id == 1
        assert result["status"] == "ok"
        assert result["config_entry_id"] == "test_entry_123"
        assert result["data_summary"]["devices"] == 4
        assert result["data_summary"]["device_status"]["online"] == 2
        assert result["data_summary"]["device_status"]["alerting"] == 1
        assert result["data_summary"]["device_status"]["offline"] == 1
        assert result["data_summary"]["clients"] == 1
        assert result["data_summary"]["ssids"] == 2
        assert result["data_summary"]["networks"] == 1
        assert result["coordinator"]["ready"] is True
        assert result["services"]["mqtt_enabled"] is False
        assert result["services"]["camera_service"] is True
        assert result["services"]["device_control_service"] is True

    def test_missing_coordinator_returns_error(
        self, mock_hass: MagicMock, mock_connection: MockConnection
    ) -> None:
        """Test that a missing coordinator returns an error."""
        mock_hass.data = {
            DOMAIN: {
                "test_entry_123": {
                    # No coordinator
                }
            }
        }
        mock_hass.config_entries.async_entries.return_value = []

        msg = {
            "id": 1,
            "type": "meraki/card_diagnostics",
            "config_entry_id": "test_entry_123",
        }

        websocket_card_diagnostics(mock_hass, mock_connection, msg)  # type: ignore[arg-type]

        assert len(mock_connection.results) == 1
        msg_id, result = mock_connection.results[0]
        assert msg_id == 1
        assert result["status"] == "error"
        assert "Coordinator not found" in result["message"]

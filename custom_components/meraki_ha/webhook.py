"""Webhook handling for the Meraki integration."""

from __future__ import annotations

from typing import TYPE_CHECKING

from aiohttp import web
from homeassistant.core import HomeAssistant

from .const import (
    CONF_SCANNING_API_SECRET,
    CONF_SCANNING_API_VALIDATOR,
    DOMAIN,
)
from .core.errors import MerakiConnectionError
from .core.utils.webhook_utils import get_webhook_url
from .helpers.logging_helper import MerakiLoggers

if TYPE_CHECKING:
    from homeassistant.config_entries import ConfigEntry

    from .core.api import MerakiAPIClient
    from .meraki_data_coordinator import MerakiDataCoordinator


# Use feature-specific loggers - can be configured independently via:
# logger:
#   logs:
#     custom_components.meraki_ha.alerts: debug
#     custom_components.meraki_ha.scanning_api: debug
_LOGGER_ALERTS = MerakiLoggers.ALERTS
_LOGGER_SCANNING = MerakiLoggers.SCANNING_API


async def async_handle_scanning_api(
    hass: HomeAssistant,
    config_entry_id: str,
    request: web.Request,
) -> web.Response:
    """Handle a webhook from the Meraki Scanning API.

    This is the direct endpoint handler for Scanning API webhooks.
    It handles both GET (validation) and POST (data) requests.

    URL format: /api/webhook/{config_entry_id}/{validator}
    HA only matches on config_entry_id, so we extract the validator from the path.
    """
    # Extract validator from URL path (format: /api/webhook/{entry_id}/{validator})
    path_parts = request.path.strip("/").split("/")
    url_validator = path_parts[-1] if len(path_parts) >= 4 else None

    _LOGGER_SCANNING.debug(
        "Scanning API webhook received: method=%s, entry=%s, path=%s, url_validator=%s",
        request.method,
        config_entry_id,
        request.path,
        url_validator[:16] + "..." if url_validator else None,
    )

    config_entry = hass.config_entries.async_get_entry(config_entry_id)
    if not config_entry:
        _LOGGER_SCANNING.warning(
            "Scanning API webhook: config entry %s not found", config_entry_id
        )
        return web.Response(status=404)

    configured_validator = config_entry.options.get(CONF_SCANNING_API_VALIDATOR)

    # Verify the validator in the URL matches our configured validator
    if url_validator and configured_validator and url_validator != configured_validator:
        _LOGGER_SCANNING.warning(
            "Scanning API: URL validator mismatch (url=%s, configured=%s)",
            url_validator[:16] + "..." if url_validator else None,
            configured_validator[:16] + "..." if configured_validator else None,
        )
        return web.Response(status=404)

    if request.method == "GET":
        if configured_validator:
            _LOGGER_SCANNING.debug("Scanning API GET validation - returning validator")
            return web.Response(text=configured_validator)
        _LOGGER_SCANNING.warning("Scanning API GET: no validator configured")
        return web.Response(status=404)

    if request.method == "POST":
        try:
            data = await request.json()
        except ValueError:
            _LOGGER_SCANNING.warning("Received invalid JSON in Scanning API webhook")
            return web.Response(status=400)

        _LOGGER_SCANNING.debug(
            "Scanning API POST received, type=%s", data.get("type", "unknown")
        )
        return await _handle_scanning_api_data(hass, config_entry_id, data)

    _LOGGER_SCANNING.warning("Scanning API: unsupported method %s", request.method)
    return web.Response(status=405)


async def _handle_scanning_api_data(
    hass: HomeAssistant,
    config_entry_id: str,
    data: dict,
) -> web.Response:
    """Process Scanning API data.

    This is a helper function that processes already-parsed JSON data.
    It handles secret verification and forwards data to the coordinator.

    Args:
    ----
        hass: The Home Assistant instance.
        config_entry_id: The config entry ID.
        data: The parsed JSON data from the Scanning API.

    Returns
    -------
        An aiohttp web.Response object.

    """
    config_entry = hass.config_entries.async_get_entry(config_entry_id)
    if not config_entry:
        _LOGGER_SCANNING.warning(
            "Scanning API data handler: config entry %s not found", config_entry_id
        )
        return web.Response(status=404)

    secret = config_entry.options.get(CONF_SCANNING_API_SECRET)
    received_secret = data.get("secret")
    if not secret:
        _LOGGER_SCANNING.warning(
            "Scanning API: no secret configured in integration options"
        )
        return web.Response(status=401)
    if received_secret != secret:
        _LOGGER_SCANNING.warning(
            "Scanning API: secret mismatch (received=%s, expected=%s)",
            received_secret[:8] + "..." if received_secret else "None",
            secret[:8] + "...",
        )
        return web.Response(status=401)

    if data.get("type") == "DevicesSeen":
        _LOGGER_SCANNING.debug(
            "Scanning API: processing DevicesSeen with %d observations",
            len(data.get("data", {}).get("observations", [])),
        )
        coordinator: MerakiDataCoordinator = hass.data[DOMAIN][config_entry_id][
            "coordinator"
        ]
        await coordinator.async_handle_scanning_api_data(data["data"])
    else:
        _LOGGER_SCANNING.debug(
            "Scanning API: ignoring message type=%s", data.get("type")
        )

    return web.Response(status=200)


from .const import CONF_WEBHOOK_SHARED_SECRET
from .handlers.client_alerts import async_handle_client_alert
from .handlers.device_alerts import async_handle_device_alert
from .handlers.network_alerts import async_handle_network_alert
from .handlers.security_alerts import async_handle_security_alert
from .handlers.sensor_alerts import async_handle_sensor_alert

async def async_handle_webhook(
    hass: HomeAssistant,
    webhook_id: str,
    request: web.Request,
) -> web.Response:
    """
    Handle a webhook from the Meraki API.

    This function acts as a router for different webhook types. It determines
    whether the request is for the legacy alerts webhook or the new Scanning API
    based on the presence of a "type" field in the JSON payload, which is
    unique to the Scanning API.

    Args:
    ----
        hass: The Home Assistant instance.
        webhook_id: The ID of the webhook, which corresponds to the config entry ID.
        request: The request object from aiohttp.

    Returns
    -------
        An aiohttp web.Response object.

    """
    try:
        data = await request.json()
    except ValueError:
        _LOGGER_ALERTS.warning("Received invalid JSON in webhook %s", webhook_id)
        return web.Response(status=400)

    # Differentiate between Scanning API and legacy alerts webhook
    # The Scanning API payload has a "type" field (e.g., "DevicesSeen")
    # and a "secret" field, whereas legacy alerts have "sharedSecret".
    if "type" in data and "secret" in data:
        _LOGGER_SCANNING.debug("Scanning API webhook %s received: %s", webhook_id, data)
        # Handle Scanning API data directly (request already parsed above)
        return await _handle_scanning_api_data(hass, webhook_id, data)

    # --- Alerts Webhook Handling ---
    _LOGGER_ALERTS.debug("Alerts webhook %s received: %s", webhook_id, data)

    config_entry = hass.config_entries.async_get_entry(webhook_id)
    if not config_entry:
        _LOGGER_ALERTS.warning(
            "Received webhook for unknown config entry: %s", webhook_id
        )
        return web.Response(status=404)

    secret = config_entry.options.get(CONF_WEBHOOK_SHARED_SECRET)
    if not secret or data.get("sharedSecret") != secret:
        _LOGGER_ALERTS.warning("Received webhook with invalid secret: %s", webhook_id)
        return web.Response(status=401)

    coordinator: MerakiDataCoordinator = hass.data[DOMAIN][webhook_id]["coordinator"]
    if not coordinator:
        _LOGGER_ALERTS.warning("Coordinator not found for webhook: %s", webhook_id)
        return web.Response(status=500)

    alert_type = data.get("alertType")
    if alert_type:
        coordinator._last_webhook_by_type[alert_type] = datetime.now()

    if alert_type in ("APs went down", "APs came up", "Switches went down", "Switches came up", "Gateways went down", "Gateways came up"):
        await async_handle_device_alert(coordinator, data)
    elif alert_type == "Client connectivity changed":
        await async_handle_client_alert(coordinator, data)
    elif alert_type in ("Settings changed", "SSID settings changed", "VLAN settings changed"):
        await async_handle_network_alert(coordinator, data)
    elif alert_type in ("Rogue AP detected", "Intrusion detected", "Malware detected"):
        await async_handle_security_alert(coordinator, data)
    elif alert_type in (
        "temperatureThreshold",
        "humidityThreshold",
        "waterDetected",
        "doorChanged",
        "powerOutageDetected",
    ):
        await async_handle_sensor_alert(coordinator, data)
    else:
        _LOGGER_ALERTS.debug("Ignoring webhook alert type: %s", alert_type)

    return web.Response(status=200)

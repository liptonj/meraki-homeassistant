# Meraki WebSocket API for Lovelace Cards

This document describes the WebSocket API endpoints available for Meraki Lovelace UI cards and other frontend integrations.

## Overview

The Meraki integration exposes WebSocket commands that allow frontend components (Lovelace cards, panels, etc.) to communicate with the backend coordinator and Meraki API. These endpoints follow the [Home Assistant WebSocket API pattern](https://developers.home-assistant.io/docs/frontend/extending/websocket-api).

## Setup

The WebSocket API is automatically registered when the integration loads. No additional configuration is required.

## Authentication

All WebSocket commands require a valid Home Assistant WebSocket connection. The `config_entry_id` parameter identifies which Meraki integration instance to use (for users with multiple Meraki organizations).

## Available Commands

### Read Endpoints

| Command | Description |
|---------|-------------|
| `meraki/get_overview` | Get summary of devices, clients, and SSIDs |
| `meraki/get_networks` | Get list of all networks |
| `meraki/get_device` | Get single device by serial |
| `meraki/get_device_clients` | Get clients connected to a device |
| `meraki/get_client` | Get single client by MAC (case-insensitive) |
| `meraki/get_clients` | Get client list with optional filters |
| `meraki/get_ssids` | Get all SSIDs |
| `meraki/get_switch_ports` | Get switch port statuses |

### Subscription Endpoints

| Command | Description |
|---------|-------------|
| `meraki/subscribe_updates` | Subscribe to real-time coordinator updates |

### Action Endpoints

| Command | Description |
|---------|-------------|
| `meraki/block_client` | Block a client (placeholder) |
| `meraki/unblock_client` | Unblock a client (placeholder) |
| `meraki/set_switch_port` | Enable/disable a switch port |
| `meraki/set_client_policy` | Set client policy (Normal, Allowed, Blocked, Group policy) |

---

## Detailed Command Reference

### meraki/get_overview

Get a summary of devices, clients, and SSIDs.

**Request:**
```json
{
  "id": 1,
  "type": "meraki/get_overview",
  "config_entry_id": "abc123"
}
```

**Response:**
```json
{
  "id": 1,
  "type": "result",
  "success": true,
  "result": {
    "devices": [...],
    "clients": [...],
    "ssids": [...]
  }
}
```

---

### meraki/get_networks

Get list of all networks in the organization.

**Request:**
```json
{
  "id": 2,
  "type": "meraki/get_networks",
  "config_entry_id": "abc123"
}
```

---

### meraki/get_device

Get details for a single device by serial number.

**Request:**
```json
{
  "id": 3,
  "type": "meraki/get_device",
  "config_entry_id": "abc123",
  "serial": "Q2AB-CDEF-1234"
}
```

**Errors:** `not_found` if device doesn't exist.

---

### meraki/get_device_clients

Get all clients currently connected to a specific device.

**Request:**
```json
{
  "id": 4,
  "type": "meraki/get_device_clients",
  "config_entry_id": "abc123",
  "serial": "Q2AB-CDEF-1234"
}
```

---

### meraki/get_client

Get details for a single client by MAC address. MAC matching is case-insensitive.

**Request:**
```json
{
  "id": 5,
  "type": "meraki/get_client",
  "config_entry_id": "abc123",
  "mac": "AA:BB:CC:DD:EE:FF"
}
```

**Errors:** `not_found` if client doesn't exist.

---

### meraki/get_clients

Get list of clients with optional filtering.

**Request:**
```json
{
  "id": 6,
  "type": "meraki/get_clients",
  "config_entry_id": "abc123",
  "network_id": "N_123",
  "limit": 50
}
```

| Parameter | Required | Description |
|-----------|----------|-------------|
| `network_id` | No | Filter by network ID |
| `limit` | No | Maximum number of clients |

---

### meraki/get_ssids

Get list of all SSIDs.

**Request:**
```json
{
  "id": 7,
  "type": "meraki/get_ssids",
  "config_entry_id": "abc123"
}
```

---

### meraki/get_switch_ports

Get switch port statuses from all switches.

**Request:**
```json
{
  "id": 8,
  "type": "meraki/get_switch_ports",
  "config_entry_id": "abc123"
}
```

---

### meraki/subscribe_updates

Subscribe to real-time coordinator updates. After subscribing, the connection receives event messages when data refreshes.

**Request:**
```json
{
  "id": 9,
  "type": "meraki/subscribe_updates",
  "config_entry_id": "abc123"
}
```

**Events:** Received as `type: "event"` messages with updated data.

---

### meraki/set_switch_port

Enable or disable a switch port.

**Request:**
```json
{
  "id": 10,
  "type": "meraki/set_switch_port",
  "config_entry_id": "abc123",
  "serial": "Q2AB-CDEF-5678",
  "port_id": "1",
  "enabled": false
}
```

| Parameter | Required | Description |
|-----------|----------|-------------|
| `serial` | Yes | Switch serial number |
| `port_id` | Yes | Port ID (e.g., "1", "2") |
| `enabled` | Yes | `true` to enable, `false` to disable |

---

### meraki/set_client_policy

Set the policy for a client.

**Request:**
```json
{
  "id": 11,
  "type": "meraki/set_client_policy",
  "config_entry_id": "abc123",
  "network_id": "N_123",
  "client_id": "aa:bb:cc:dd:ee:ff",
  "policy": "Group policy",
  "group_policy_id": "101"
}
```

| Parameter | Required | Description |
|-----------|----------|-------------|
| `network_id` | Yes | Network ID |
| `client_id` | Yes | Client MAC address |
| `policy` | Yes | `Normal`, `Allowed`, `Blocked`, or `Group policy` |
| `group_policy_id` | No | Required when policy is `Group policy` |

---

## Error Handling

All endpoints return errors in standard HA format:

```json
{
  "id": 1,
  "type": "result",
  "success": false,
  "error": {
    "code": "error_code",
    "message": "Human-readable error message"
  }
}
```

### Common Error Codes

| Code | Description |
|------|-------------|
| `not_found` | Config entry, device, or client not found |
| `coordinator_not_ready` | Coordinator hasn't completed initial fetch |
| `api_error` | Failed to communicate with Meraki API |

---

## Frontend Usage Example

```javascript
// In a LitElement-based card
async fetchDevices() {
  const result = await this.hass.connection.sendMessagePromise({
    type: 'meraki/get_overview',
    config_entry_id: this.config.config_entry_id,
  });
  this.devices = result.devices;
}

// Subscribe to updates
this.hass.connection.subscribeMessage(
  (message) => this.handleUpdate(message),
  {
    type: 'meraki/subscribe_updates',
    config_entry_id: this.config.config_entry_id,
  }
);
```

---

## Source Code

- **Implementation**: `custom_components/meraki_ha/api/websocket.py`
- **Tests**: `tests/api/test_websocket_api.py`
- **Frontend Base Class**: `custom_components/meraki_ha/www/cards/shared/meraki-card-base.js`

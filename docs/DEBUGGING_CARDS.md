# Meraki Cards - Debug Guide 🐛

## How to Enable Debug Mode

Debug mode adds comprehensive logging to the browser console and shows a debug panel on each card.

### Method 1: localStorage (Recommended - Persists Across Reloads)

Open browser console (F12) and run:

```javascript
localStorage.setItem('meraki_debug', 'true');
```

Then reload the page. Debug mode will stay enabled until you disable it.

**To disable:**

```javascript
localStorage.removeItem('meraki_debug');
```

### Method 2: Card Configuration (Per-Card Debugging)

Add `debug: true` to any card's YAML configuration:

```yaml
- type: custom:meraki-overview-card
  config_entry_id: YOUR_ID
  debug: true # Only this card will show debug output
```

### Method 3: Browser Console (Temporary)

```javascript
window.merakiDebug = true;
```

This enables debug mode until you reload the page.

---

## What Debug Mode Shows

### 1. Console Output

Debug mode logs everything with color-coded messages:

- **🔵 Blue** = Info messages
- **🟢 Green** = Success messages
- **🟡 Yellow** = Warnings
- **🔴 Red** = Errors

#### Lifecycle Events

```
⚙️  MerakiOverviewCard.setConfig { config_entry_id: "abc123", ... }
🏠 MerakiOverviewCard.hassSet { connected: true, states: 245 }
📻 MerakiOverviewCard.subscribed
📡 MerakiOverviewCard.fetchData { command: "meraki/get_overview" }
📥 MerakiOverviewCard.dataReceived { devices: 32, clients: 159 }
🎨 MerakiOverviewCard.render { loading: false, error: false, hasData: true }
```

#### API Calls

```
🌐 MerakiOverviewCard → meraki_ha/get_overview
  📤 Request: { command: "meraki_ha/get_overview", config_entry_id: "abc123" }
  ⏱️  Duration: 245ms
  ✅ Response: { devices: [...], clients: [...] }
  📊 Data summary: { devices: 32, clients: 159, ssids: 3, networks: 1 }
```

#### Errors

```
❌ Error: { message: "Connection failed", code: "ERR_CONNECTION" }
Stack trace: ...
```

### 2. Debug Panel (In Each Card)

When debug mode is enabled, each card shows a collapsible debug panel at the bottom:

```
┌──────────────────────────────────────┐
│ 🐛 Debug Info ▼                      │
├──────────────────────────────────────┤
│ Card: MerakiOverviewCard             │
│ Config Entry ID: 01KEWXQN207...      │
│ Has hass: true                       │
│ Has data: true                       │
│ Loading: false                       │
│ Error: None                          │
│ Subscribed: true                     │
│ Last update: 3:45:23 PM              │
│ [🔄 Force Refresh] [📊 Log State]    │
└──────────────────────────────────────┘
```

#### Debug Panel Buttons

- **🔄 Force Refresh** - Manually trigger a data fetch
- **📊 Log State** - Dumps the entire card state to console for inspection

---

## Common Debug Scenarios

### Scenario 1: Card Shows "Loading..." Forever

**Enable debug mode and check console for:**

```
⚠️  MerakiOverviewCard hass not available yet, waiting...
```

**If after 10 seconds you see:**

```
❌ TIMEOUT: hass object never received after 10 seconds!
```

**Solution:**

- Check that the card is properly registered
- Verify dashboard YAML syntax is correct
- Try removing and re-adding the card

---

### Scenario 2: Card Shows "No SSIDs Found"

**Check console for:**

```
🌐 MerakiSSIDsListCard → meraki_ha/get_ssids
  ✅ Response: { ssids: [] }  ← Empty array!
```

**Or:**

```
📊 Data summary: { ssids: 0 }
```

**Solution:**

- Check if SSID switches exist in HA (Settings → Devices & Services → Meraki)
- Verify the coordinator is fetching SSIDs from the API
- Check if `ssid_number` and `network_id` attributes are set on SSID entities

---

### Scenario 3: Card Shows Error

**Check console for detailed error:**

```
❌ MerakiOverviewCard.fetchData failed
{
  message: "Unknown command: meraki_ha/get_overview",
  code: "unknown_command",
  command: "meraki_ha/get_overview",
  config_entry_id: "01KEWXQN207...",
  timestamp: "2026-01-14T20:15:30.123Z"
}
```

**Solution:**

- Verify the WebSocket API endpoint exists
- Check if the integration is loaded properly
- Reload the Meraki integration

---

### Scenario 4: Data Not Updating

**Check console for subscription messages:**

```
📻 MerakiOverviewCard.subscribed  ← Should see this once
📥 MerakiOverviewCard.dataReceived { devices: 32 }  ← Should see this when data changes
```

**If you see subscribed but no dataReceived:**

- The subscription is working but no updates are being published
- Check if the coordinator is updating
- Try Force Refresh button in debug panel

---

## Interpreting Debug Output

### Healthy Card Lifecycle

```
1. ⚙️  setConfig          ← Card receives configuration
2. 🏠 hassSet             ← Home Assistant object received
3. 📻 subscribed          ← Subscribed to real-time updates
4. 📡 fetchData           ← Initial data fetch
5. 🌐 API call (230ms)    ← API responds quickly
6. 📥 dataReceived        ← Data successfully received
7. 🎨 render              ← Card renders with data
```

### Problem Card Lifecycle

```
1. ⚙️  setConfig
2. ⚠️  hass not available yet, waiting...
3. [NOTHING HAPPENS]
4. ❌ TIMEOUT after 10 seconds
```

**Or:**

```
1. ⚙️  setConfig
2. 🏠 hassSet
3. 📻 subscribed
4. 📡 fetchData
5. ❌ Error: config_entry_id is required but not set
```

---

## Advanced Debugging

### Inspect Full Card State

```javascript
// Enable debug mode
localStorage.setItem('meraki_debug', 'true');

// Find the card element
const card = document.querySelector('meraki-overview-card');

// Log everything
console.log('Card element:', card);
console.log('Config:', card.config);
console.log('Has hass:', !!card.hass);
console.log('Data:', card._data);
console.log('Loading:', card._loading);
console.log('Error:', card._error);
```

### Monitor All API Calls

```javascript
// Intercept WebSocket messages
const originalSend = WebSocket.prototype.send;
WebSocket.prototype.send = function (data) {
  console.log('📤 WS Send:', JSON.parse(data));
  return originalSend.call(this, data);
};
```

### Check SSID Entity Attributes

```javascript
// Find all SSID switches
const ssidSwitches = Object.keys(hass.states)
  .filter(
    (e) => e.includes('enabled_control') || e.includes('broadcast_control')
  )
  .map((id) => ({
    id,
    ...hass.states[id].attributes,
  }));

console.table(ssidSwitches);
```

---

## Disabling Debug Mode

### Method 1: localStorage

```javascript
localStorage.removeItem('meraki_debug');
```

### Method 2: Card Config

Remove `debug: true` from YAML

### Method 3: Browser Console

Reload the page (Method 3 is temporary)

---

## Debug Performance Impact

Debug mode has minimal performance impact:

- Console logging: ~0.1ms per log
- Debug panel rendering: ~1ms
- No impact when debug mode is off

**It's safe to leave debug mode on during development!**

---

## Reporting Issues

When reporting bugs, **always enable debug mode first** and include:

1. **Console output** (copy/paste the relevant logs)
2. **Debug panel screenshot** (shows card state)
3. **Card configuration** (your YAML)
4. **Browser** (Chrome/Firefox/Safari + version)
5. **Home Assistant version**

### Example Bug Report:

```
**Problem:** SSID card shows "No SSIDs found"

**Debug Output:**
```

📊 Data summary: { ssids: 0 }
⚠️ SSIDs array is empty

````

**Debug Panel:**
- Has hass: true
- Has data: true
- Loading: false
- Error: None

**Card Config:**
```yaml
type: custom:meraki-ssids-list-card
config_entry_id: 01KEWXQN207AMKWPF72B4R62CN
````

**HA Version:** 2024.1.0
**Browser:** Chrome 120

````

This gives us everything we need to diagnose the issue!

---

## Card Diagnostics WebSocket Command

You can call the card diagnostics WebSocket command to get detailed information about the integration state:

```javascript
// In browser console
await hass.connection.sendMessagePromise({
  type: 'meraki/card_diagnostics',
  config_entry_id: 'YOUR_CONFIG_ENTRY_ID'
});
````

This returns:

- Coordinator status (ready, last update time, update interval)
- Data summary (device/client/SSID/network counts)
- Device status breakdown (online/alerting/offline)
- Active services (MQTT, camera, device control)

If you don't know your config_entry_id, call without it to get a list of available entries:

```javascript
await hass.connection.sendMessagePromise({
  type: 'meraki/card_diagnostics',
});
```

---

## Quick Reference

| Command                                        | Purpose                     |
| ---------------------------------------------- | --------------------------- |
| `localStorage.setItem('meraki_debug', 'true')` | Enable debug mode           |
| `localStorage.removeItem('meraki_debug')`      | Disable debug mode          |
| `window.merakiDebug = true`                    | Enable temporarily          |
| `meraki/card_diagnostics` WebSocket            | Get integration diagnostics |
| Debug panel → 🔄 Force Refresh                 | Manually fetch data         |
| Debug panel → 📊 Log State                     | Dump card state to console  |
| F12                                            | Open browser console        |
| Ctrl+Shift+R                                   | Hard refresh (clear cache)  |

---

**Happy debugging!** 🐛✨

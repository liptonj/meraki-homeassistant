# Creating Editable Meraki Dashboards

This guide explains how to create **fully editable** Meraki dashboards that you can customize in the Lovelace UI.

---

## Strategy vs. Editable Dashboard

### Strategy-Based Dashboard (Read-Only)

```yaml
strategy:
  type: custom:meraki-dashboard-strategy
  config_entry_id: YOUR_CONFIG_ENTRY_ID
```

**Pros:**

- ✅ Always reflects current device state
- ✅ Automatically updates when you add/remove devices
- ✅ Minimal configuration

**Cons:**

- ❌ **Read-only** - can't edit in UI
- ❌ Can't add custom cards
- ❌ Can't rearrange views

---

### Editable Dashboard (Static Snapshot)

Created via the `meraki_ha.create_editable_dashboard` service.

**Pros:**

- ✅ **Fully editable** in Lovelace UI
- ✅ Add, remove, or rearrange any cards
- ✅ Customize layout and styling
- ✅ Mix Meraki cards with other HA cards

**Cons:**

- ❌ Doesn't auto-update when devices change
- ❌ Need to run service again to regenerate

---

## Creating an Editable Dashboard

### Step 1: Find Your Config Entry ID

**Option A: From Integration Page**

1. Go to **Settings** → **Devices & Services**
2. Find **Meraki** integration
3. Look at the URL: `config/integrations/integration/meraki_ha`
4. Click on the integration, look at the URL again: it will have your entry ID

**Option B: From Developer Tools**

1. Go to **Developer Tools** → **Template**
2. Paste this template:

```jinja
{% set entities = integration_entities('meraki_ha') %}
{% if entities %}
  {% set first = entities[0] %}
  {% set dev_id = device_id(first) %}
  Config Entry ID: {{ config_entry_id(dev_id) }}
{% endif %}
```

3. Copy the ID that appears

---

### Step 2: Call the Service

**Option A: Developer Tools (Easiest)**

1. Go to **Developer Tools** → **Services**
2. Select service: `meraki_ha.create_editable_dashboard`
3. Enter your config entry ID:

```yaml
service: meraki_ha.create_editable_dashboard
data:
  config_entry_id: '01KEWXQN207AMKWPF72B4R62CN' # Your ID here
  dashboard_id: 'meraki_main' # Optional - custom URL
```

4. Click **CALL SERVICE**

**Option B: Automation**

Create an automation to regenerate on startup:

```yaml
automation:
  - alias: 'Regenerate Meraki Dashboard on Startup'
    trigger:
      - platform: homeassistant
        event: start
    action:
      - service: meraki_ha.create_editable_dashboard
        data:
          config_entry_id: 'YOUR_CONFIG_ENTRY_ID'
          dashboard_id: 'meraki_main'
```

---

### Step 3: Access Your Dashboard

After calling the service, you'll get a notification with:

- ✅ Dashboard created confirmation
- 🔗 Direct link to open it
- 📋 Summary of views and cards

The dashboard will be available in your sidebar under the URL you specified (e.g., `/meraki_main`).

---

## Customizing Your Dashboard

Once created, edit like any Lovelace dashboard:

1. Open the dashboard from the sidebar
2. Click **⋮** (three dots) → **Edit Dashboard**
3. Now you can:
   - **Add cards:** Click **+ ADD CARD**
   - **Rearrange:** Drag and drop cards
   - **Edit cards:** Click card → **Edit**
   - **Delete cards:** Click card → **Delete**
   - **Add views:** Click **+ ADD VIEW**

---

## Regenerating When Devices Change

When you add/remove Meraki devices, regenerate the dashboard:

```yaml
service: meraki_ha.regenerate_dashboard
data:
  config_entry_id: 'YOUR_CONFIG_ENTRY_ID'
```

This will **update the dashboard** with new devices while **preserving manual edits** where possible.

---

## Service Reference

### `meraki_ha.create_editable_dashboard`

Create a new editable dashboard.

**Parameters:**

| Field             | Required | Description                                       | Example                      |
| ----------------- | -------- | ------------------------------------------------- | ---------------------------- |
| `config_entry_id` | ✅ Yes   | Your Meraki integration config entry ID           | `01KEWXQN207AMKWPF72B4R62CN` |
| `dashboard_id`    | ❌ No    | Custom URL identifier (auto-generated if omitted) | `meraki_main`                |

**Example:**

```yaml
service: meraki_ha.create_editable_dashboard
data:
  config_entry_id: '01KEWXQN207AMKWPF72B4R62CN'
  dashboard_id: 'meraki_network'
```

---

### `meraki_ha.regenerate_dashboard`

Regenerate an existing dashboard to reflect current device state.

**Parameters:**

| Field             | Required | Description                             | Example                      |
| ----------------- | -------- | --------------------------------------- | ---------------------------- |
| `config_entry_id` | ✅ Yes   | Your Meraki integration config entry ID | `01KEWXQN207AMKWPF72B4R62CN` |

**Example:**

```yaml
service: meraki_ha.regenerate_dashboard
data:
  config_entry_id: '01KEWXQN207AMKWPF72B4R62CN'
```

---

## Dashboard Structure

The generated dashboard includes **10 views**:

1. **Overview** - Organization summary, top clients, network status
2. **Switches** - All switch devices with port status
3. **Access Points** - WiFi access points with client counts
4. **Cameras** - Security cameras with live feeds
5. **Sensors** - Environmental sensors (temperature, humidity, etc.)
6. **Appliances** - Security appliances and gateways
7. **Networks & SSIDs** - Network configuration and WiFi SSIDs
8. **Clients** - Connected devices and client tracking
9. **Events** - Recent events and alerts
10. **Guest Access** - Guest WiFi management

Each view is pre-populated with relevant Meraki custom cards.

---

## Troubleshooting

### "Dashboard already exists"

The service will **update** existing dashboards. If you want a fresh start:

1. Go to **Settings** → **Dashboards**
2. Find your Meraki dashboard
3. Click **⋮** → **Delete**
4. Run the service again

### "Config entry not found"

Double-check your `config_entry_id`. It should:

- Be a long alphanumeric string
- Match your integration's entry ID
- Not include any extra spaces or quotes

### Cards Not Showing Data

1. Enable debug mode: Open browser console and run:
   ```javascript
   localStorage.setItem('meraki_debug', 'true');
   ```
2. Reload the page
3. Check console for debug logs
4. See `docs/DEBUGGING_CARDS.md` for details

---

## Next Steps

- **Add custom cards:** Mix Meraki cards with standard HA cards
- **Create automations:** Trigger actions based on Meraki events
- **Customize styling:** Use card-mod for advanced styling
- **Share your dashboard:** Export and share with the community

---

**Need help?** Open an issue: https://github.com/liptonj/meraki-homeassistant/issues

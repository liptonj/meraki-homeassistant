# Implementation Plan: Complete Lovelace Dashboard

## Status: UI Mode Reverted ✅

- Changed `DEFAULT_UI_MODE` back to `UI_MODE_LOVELACE`

## Remaining Tasks

### 1. Create Missing Cards (6 cards)

Each card needs:

- Main card JavaScript file
- Editor JavaScript file
- Registration in `meraki-cards.js`
- Add to `CARD_TYPES` in `constants.js`
- Add to `CARD_DEFINITIONS` in `constants.js`

#### A. meraki-ssids-list-card

**Purpose:** Display all SSIDs across networks
**Data Needed:** SSIDs list from coordinator
**Features:**

- Group by network
- Show SSID name, number, enabled status
- Show client count per SSID
- Click to navigate (if possible)

**Files to Create:**

- `www/cards/meraki-ssids-list-card.js`
- `www/cards/meraki-ssids-list-card-editor.js`

#### B. meraki-events-card

**Purpose:** Show recent network events/alerts
**Data Needed:** Events from API/coordinator
**Features:**

- List recent events with timestamps
- Event type icons
- Severity indicators
- Auto-refresh

**Files to Create:**

- `www/cards/meraki-events-card.js`
- `www/cards/meraki-events-card-editor.js`

#### C. meraki-guest-access-card

**Purpose:** Manage guest WiFi access
**Data Needed:** Guest SSIDs, timed access keys
**Features:**

- Show guest SSIDs
- Create timed access keys
- QR code generation
- Key expiration

**Files to Create:**

- `www/cards/meraki-guest-access-card.js`
- `www/cards/meraki-guest-access-card-editor.js`

### 2. Create Missing Badges (3 badges)

Badges are simpler than cards - just show a value and icon.

#### A. meraki-status-badge

**Purpose:** Overall network health indicator
**Data:** Network status (online/offline/warning)
**Display:** Icon + status text

**File to Create:**

- `www/cards/badges/meraki-status-badge.js`

#### B. meraki-clients-badge

**Purpose:** Total client count
**Data:** Number of connected clients
**Display:** Client icon + count

**File to Create:**

- `www/cards/badges/meraki-clients-badge.js`

#### C. meraki-alerts-badge

**Purpose:** Active alerts count
**Data:** Number of unresolved alerts
**Display:** Alert icon + count (with severity color)

**File to Create:**

- `www/cards/badges/meraki-alerts-badge.js`

### 3. Auto-Create Dashboard on Install

**Challenge:** Home Assistant doesn't provide a simple API to programmatically create dashboards.

**Solutions:**

#### Option A: Use Storage API (Recommended)

```python
from homeassistant.components.lovelace import dashboard

async def async_create_meraki_dashboard(hass, entry, config):
    """Create a Lovelace dashboard for Meraki."""
    dashboard_id = f"meraki_{entry.entry_id[:8]}"

    # Create dashboard via storage
    await hass.data["lovelace"]["dashboards"].async_create_item({
        "id": dashboard_id,
        "url_path": dashboard_id,
        "title": "Meraki Network",
        "icon": "mdi:router-network",
        "show_in_sidebar": True,
        "require_admin": False,
    })

    # Save configuration
    await dashboard.async_save_config(hass, dashboard_id, config)
```

#### Option B: Notification + Manual Import

```python
# Show persistent notification with dashboard YAML
hass.components.persistent_notification.async_create(
    f"Meraki dashboard configuration ready!\n\n"
    f"Go to Settings > Dashboards > Add Dashboard\n"
    f"Paste the configuration from Developer Tools > Services > "
    f"meraki_ha.get_dashboard_config",
    title="Meraki Dashboard Ready",
    notification_id=f"meraki_dashboard_{entry.entry_id}",
)
```

#### Option C: Service to Create Dashboard

```python
# Add service for user to call
hass.services.async_register(
    DOMAIN,
    "create_dashboard",
    handle_create_dashboard,
)
```

### 4. Update Dashboard Strategy

Ensure the TypeScript dashboard strategy matches the Python one:

- Same card types
- Same view structure
- Same badges

### 5. Register Everything

Update `www/cards/meraki-cards.js`:

```javascript
import './meraki-ssids-list-card.js';
import './meraki-events-card.js';
import './meraki-guest-access-card.js';
import './badges/meraki-status-badge.js';
import './badges/meraki-clients-badge.js';
import './badges/meraki-alerts-badge.js';
```

### 6. Build and Test

```bash
cd custom_components/meraki_ha/www
npm run build
```

## Estimated Effort

- **SSIDs List Card:** 2-3 hours
- **Events Card:** 2-3 hours
- **Guest Access Card:** 3-4 hours (complex)
- **3 Badges:** 1-2 hours each = 3-6 hours
- **Auto-Dashboard Creation:** 2-4 hours
- **Testing & Integration:** 2-3 hours

**Total:** 14-23 hours of development

## Recommendation

Given the scope, I suggest:

1. **Create cards in this order:**

   - Badges first (quickest wins)
   - SSIDs List Card (most important)
   - Events Card
   - Guest Access Card (most complex, can be v2)

2. **For auto-dashboard:**

   - Start with Option B (notification)
   - Upgrade to Option A (full auto-creation) later

3. **MVP vs Full:**
   - **MVP:** Badges + SSIDs Card + notification = Can ship quickly
   - **Full:** All cards + auto-creation = Takes 2-3 days

## Next Steps

Would you like me to:

1. **Create all cards now** (will take remainder of context window)
2. **Create badges + SSIDs card only** (MVP, faster)
3. **Provide templates** for you to complete
4. **Hand off with this plan** for implementation

The current context has the fix reverted and plan documented. Ready to proceed with your choice!

# Meraki Panel Not Showing - Troubleshooting Guide

## ✅ Configuration Status

All panel files and configuration are correct:

- ✓ `meraki-panel.js` exists (265 KB)
- ✓ `style.css` exists (18 KB)
- ✓ Manifest has correct dependencies
- ✓ Frontend registration code is correct

## 🚨 Getting a 404 Error on /meraki

If you're getting a **404 error** when trying to access `http://your-ha:8123/meraki`, this means **the panel is not registered at all**. This is different from a cache issue.

### Quick Diagnosis

**NEW: Use the built-in diagnostic service!**

1. Go to **Developer Tools** → **Services**
2. Select **`meraki_ha.diagnose_panel`**
3. Click **"Call Service"**
4. Check the **Home Assistant logs** (Settings → System → Logs)

This will show you exactly what's wrong with the panel registration.

## 🔍 Why Isn't the Panel Showing?

The most common reasons the panel doesn't appear:

### 1. Integration Setup Failed or Incomplete

If the integration setup failed during the file fix, the panel won't be registered.

**Solution:**

1. Go to **Settings** → **Devices & Services**
2. Find **"Meraki for Home Assistant"**
3. Check if it shows any **errors** (red exclamation mark)
4. Click the **three-dot menu (⋮)** → **Reload**
5. Wait 10-15 seconds and check the logs

**Check the logs:**

- Go to Settings → System → Logs
- Filter by "meraki"
- Look for:
  - ✅ "Registering Meraki frontend panel and static paths"
  - ✅ "Successfully registered Meraki panel at /meraki"
  - ❌ Any errors during setup

### 2. Panel Registration Failed Silently

The panel registration might be failing without showing an error.

**Solution:**

1. **Enable debug logging** in `configuration.yaml`:

   ```yaml
   logger:
     default: info
     logs:
       custom_components.meraki_ha: debug
       custom_components.meraki_ha.frontend: debug
   ```

2. **Restart Home Assistant**

3. **Reload the integration** (Settings → Devices & Services → Meraki → ⋮ → Reload)

4. **Check the logs** for detailed error messages

### 3. Files Missing or Corrupted

The panel JavaScript file might be missing or corrupted.

**Solution:**

```bash
cd /path/to/your/config/custom_components/meraki_ha/www
ls -lh meraki-panel.js style.css

# Should show:
# meraki-panel.js  (about 260-270 KB)
# style.css        (about 17-18 KB)
```

If files are missing or 0 bytes, rebuild the frontend:

```bash
cd custom_components/meraki_ha/www
npm install
npm run build
```

### 4. Static Path Not Registered

The static file path might not be registered with HA's HTTP server.

**Solution:**

1. Try accessing the JS file directly:

   ```
   http://your-ha:8123/api/panel_custom/meraki_ha/meraki-panel.js
   ```

2. If you get a **404**, the static path registration failed

   - Check logs for errors during setup
   - Ensure the `www` directory exists
   - Reload the integration

3. If you get **JavaScript code** (or download), the static path works!
   - The issue is with panel registration, not file serving
   - Check if you're logged in as an **admin user**

### 5. Admin User Required

The panel is configured with `require_admin=True`.

**Solution:**

- Verify you're logged in as an **admin user**
- Check: Settings → People → [Your User] → **"Administrator"** toggle must be ON

### 6. Browser Cache (Less Likely with 404)

If you're getting a 404, cache isn't the main issue, but clear it anyway:

**Solution:**

- **Hard refresh:** Press `Ctrl+F5` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- **Try incognito mode** to rule out cache completely

## 🔄 Quick Fix Checklist (In Order)

Try these steps systematically:

- [ ] 1. **Run diagnostic service**: `meraki_ha.diagnose_panel` and check logs
- [ ] 2. **Check integration status**: Settings → Devices & Services → Look for errors
- [ ] 3. **Reload the integration**: Settings → Devices & Services → Meraki → ⋮ → Reload
- [ ] 4. **Check you're an admin user**: Settings → People → [Your User]
- [ ] 5. **Verify files exist**: Run `python3 check_panel.py` from project root
- [ ] 6. **Enable debug logging**: Add to configuration.yaml (see below)
- [ ] 7. **Restart Home Assistant**: Settings → System → Restart
- [ ] 8. **Check logs again**: Settings → System → Logs → Filter by "meraki"

## 📋 Debug Logging Configuration

Add this to your `configuration.yaml`:

```yaml
logger:
  default: info
  logs:
    custom_components.meraki_ha: debug
    custom_components.meraki_ha.frontend: debug
```

Then restart HA and reload the integration. Check logs for:

- "Registering Meraki frontend panel and static paths"
- "Found meraki-panel.js (X bytes)"
- "Successfully registered static path"
- "Successfully registered Meraki panel at /meraki"

## 🔗 Direct Access Tests

### Test 1: Static Files

```
http://your-ha:8123/api/panel_custom/meraki_ha/meraki-panel.js
```

**Expected:** JavaScript code or file download
**If 404:** Static path registration failed

### Test 2: Panel Route

```
http://your-ha:8123/meraki
```

**Expected:** Panel loads or authentication prompt
**If 404:** Panel not registered

## 🧪 Command-Line Diagnostics

From your project directory:

```bash
# Check all files exist
python3 check_panel.py

# Test panel accessibility (requires HA running)
python3 test_panel_access.py http://your-homeassistant:8123
```

## 🛠️ Common Fixes

### Fix 1: Rebuild Frontend

```bash
cd custom_components/meraki_ha/www
npm install
npm run build
```

### Fix 2: Force Re-registration

1. Delete integration (Settings → Devices & Services → Meraki → Delete)
2. Restart Home Assistant
3. Re-add integration

### Fix 3: Check Permissions

```bash
cd custom_components/meraki_ha/www
ls -la meraki-panel.js

# Should be readable by HA user (usually homeassistant)
```

## 📝 What the Logs Should Show

**Successful registration looks like:**

```
[custom_components.meraki_ha] Registering Meraki frontend panel and static paths
[custom_components.meraki_ha.frontend] Registering static path for Meraki HA frontend
[custom_components.meraki_ha.frontend] Frontend static path: /path/to/www
[custom_components.meraki_ha.frontend] Found meraki-panel.js (265489 bytes)
[custom_components.meraki_ha.frontend] Successfully registered static path: /api/panel_custom/meraki_ha -> /path/to/www
[custom_components.meraki_ha.frontend] Registering Meraki panel: title='Meraki', url_path='meraki', module='/api/panel_custom/meraki_ha/meraki-panel.js?v=3.1.0-beta.5'
[custom_components.meraki_ha.frontend] Successfully registered Meraki panel at /meraki (admin only, entry: abc123...)
[custom_components.meraki_ha] Frontend panel registration completed
```

**Failed registration shows errors:**

```
[custom_components.meraki_ha.frontend] ERROR Failed to register Meraki panel: ...
[custom_components.meraki_ha.frontend] ERROR meraki-panel.js not found at: ...
```

## 🎯 Most Likely Solution for 404

Since you're getting a **404 on /meraki**:

1. **Run the diagnostic service** first:

   - Developer Tools → Services
   - Service: `meraki_ha.diagnose_panel`
   - Click "Call Service"
   - Check logs immediately after

2. **Check integration state**:

   - Settings → Devices & Services
   - Is Meraki showing any errors?

3. **Enable debug logging** and reload:

   ```yaml
   logger:
     logs:
       custom_components.meraki_ha.frontend: debug
   ```

4. **Look for the error** in the logs - with debug logging enabled, you'll see exactly why registration is failing.

## 🐛 Still Not Working?

If nothing above works:

1. **Check Home Assistant version**: Requires HA 2024.1 or newer
2. **Check custom_components path**: Must be in HA config directory
3. **Check file permissions**: HA user must be able to read the files
4. **Try a different browser**: Rule out browser-specific issues
5. **Check for conflicting integrations**: Other integrations using `/meraki` path

---

**Last Updated:** Jan 12, 2026
**Version:** 3.1.0-beta.5
**Added:** Diagnostic service, debug logging, 404 troubleshooting

**Solution:**

1. Go to **Settings** → **System** → **Restart**
2. Wait for Home Assistant to come back online
3. Clear browser cache and refresh

## 🔗 Direct Access Test

Try accessing the panel directly via URL:

```
http://your-ha-ip:8123/meraki
```

Replace `your-ha-ip` with your actual Home Assistant IP address.

**Expected result:**

- ✅ Panel loads correctly → The panel exists, check sidebar visibility
- ❌ 404 error → Panel not registered, reload integration
- ❌ JavaScript error → Check browser console (F12)

## 🔍 Check Home Assistant Logs

1. Go to **Settings** → **System** → **Logs**
2. Click **"Full logs"** button
3. Search for `meraki` or `frontend`
4. Look for:
   - ✅ `"Registering static path for Meraki HA frontend"`
   - ✅ `"Frontend module URL: /api/panel_custom/meraki_ha/meraki-panel.js"`
   - ❌ Any error messages about panel registration

## 🐛 Check Browser Console

1. Open Home Assistant
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Look for any errors related to:
   - `meraki-panel`
   - Failed to fetch
   - Custom element errors
   - JavaScript syntax errors

## ✨ Expected Appearance

Once working, you should see in the sidebar:

- **Title:** "Meraki" (or your custom integration title)
- **Icon:** 📡 Network router icon (`mdi:router-network`)
- **Location:** In the main sidebar (left side)

## 🔄 Quick Fix Checklist

Try these steps in order:

- [ ] 1. **Reload the integration** (Settings → Devices & Services → Meraki → ⋮ → Reload)
- [ ] 2. **Clear browser cache** (Ctrl+F5 / Cmd+Shift+R)
- [ ] 3. **Check you're an admin user**
- [ ] 4. **Try direct URL access**: `http://your-ha:8123/meraki`
- [ ] 5. **Check HA logs** for errors (Settings → System → Logs)
- [ ] 6. **Restart Home Assistant** (Settings → System → Restart)
- [ ] 7. **Try different browser** or incognito mode

## 📝 Still Not Working?

If the panel still doesn't appear after trying all steps above:

1. **Enable debug logging** for the integration:

   Add to `configuration.yaml`:

   ```yaml
   logger:
     default: info
     logs:
       custom_components.meraki_ha: debug
       custom_components.meraki_ha.frontend: debug
   ```

   Restart HA and check the logs again.

2. **Check the frontend module is accessible**:

   Visit this URL directly:

   ```
   http://your-ha-ip:8123/api/panel_custom/meraki_ha/meraki-panel.js?v=3.1.0-beta.5
   ```

   You should see JavaScript code, not a 404 error.

3. **Verify the panel registration in Developer Tools**:

   In Home Assistant, go to:

   - Developer Tools → States
   - Look for any `panel.*` entities

   Or open browser DevTools console and type:

   ```javascript
   window.panels;
   ```

   This should show all registered panels including `meraki`.

## 🎯 Most Likely Solution

**90% of the time, this is the fix:**

1. **Reload the integration** from Settings → Devices & Services
2. **Hard refresh your browser** with Ctrl+F5 or Cmd+Shift+R

The panel registration happens during integration setup, so if it was broken before and you just fixed it, you need to reload the integration for HA to run the registration code again.

---

**Last Updated:** Jan 12, 2026
**Version:** 3.1.0-beta.5

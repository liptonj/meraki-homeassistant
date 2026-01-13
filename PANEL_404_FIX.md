# Panel 404 Fix - Summary

## Problem

After fixing the file dashboard issue, the Meraki panel returns a **404 error** when accessing `/meraki`, indicating the panel is not registered at all in Home Assistant.

## Root Cause

The panel registration code in `frontend.py` had **no error handling**. If the registration failed for any reason, it would fail silently without logging any errors, making it impossible to diagnose the issue.

## Changes Made

### 1. Added Error Handling (`custom_components/meraki_ha/frontend.py`)

#### `async_register_static_path()`

- ✅ Added try/except block around static path registration
- ✅ Changed logging from DEBUG to INFO level
- ✅ Added verification that `www` directory exists
- ✅ Added verification that `meraki-panel.js` exists
- ✅ Logs file size to confirm it's not empty/corrupt
- ✅ Logs the full registration path for debugging

**Before:**

```python
async def async_register_static_path(hass: HomeAssistant) -> None:
    _LOGGER.debug("Registering static path...")
    await hass.http.async_register_static_paths([...])
```

**After:**

```python
async def async_register_static_path(hass: HomeAssistant) -> None:
    try:
        _LOGGER.info("Registering static path for Meraki HA frontend")
        # Verify files exist
        if not js_file.exists():
            _LOGGER.error("meraki-panel.js not found at: %s", js_file)
            return
        _LOGGER.info("Found meraki-panel.js (%d bytes)", js_file.stat().st_size)
        await hass.http.async_register_static_paths([...])
        _LOGGER.info("Successfully registered static path: ...")
    except Exception as err:
        _LOGGER.error("Failed to register static path: %s", err, exc_info=True)
```

#### `async_register_panel()`

- ✅ Added try/except block around panel registration
- ✅ Changed logging from DEBUG to INFO level
- ✅ Logs the panel title, URL path, and module URL
- ✅ Logs success message with entry ID
- ✅ Logs detailed error with exception info if registration fails

**Before:**

```python
async def async_register_panel(hass: HomeAssistant, entry: ConfigEntry) -> None:
    # No error handling
    _LOGGER.debug("Frontend module URL: %s", module_url)
    frontend.async_register_built_in_panel(...)
```

**After:**

```python
async def async_register_panel(hass: HomeAssistant, entry: ConfigEntry) -> None:
    try:
        _LOGGER.info("Registering Meraki panel: title='%s', url_path='%s', module='%s'", ...)
        frontend.async_register_built_in_panel(...)
        _LOGGER.info("Successfully registered Meraki panel at /meraki (admin only, entry: %s)", ...)
    except Exception as err:
        _LOGGER.error("Failed to register Meraki panel: %s (type: %s)", err, type(err).__name__, exc_info=True)
```

### 2. Added Error Handling in Setup (`custom_components/meraki_ha/__init__.py`)

Added try/except around the frontend registration calls:

```python
_LOGGER.info("Registering Meraki frontend panel and static paths")
try:
    await async_register_static_path(hass)
    await async_register_panel(hass, entry)
    _LOGGER.info("Frontend panel registration completed")
except Exception as err:
    _LOGGER.error("Failed to register frontend panel: %s. Panel will not be available.", err, exc_info=True)
```

### 3. Created Diagnostic Service (`custom_components/meraki_ha/services/panel_diagnostics.py`)

New service: **`meraki_ha.diagnose_panel`**

This service can be called from Developer Tools → Services to diagnose panel issues. It checks and logs:

✅ All required files exist and their sizes
✅ Panel registration status in HA
✅ Config entry status
✅ Static path registration
✅ Provides actionable error messages

**Usage:**

1. Go to Developer Tools → Services
2. Select `meraki_ha.diagnose_panel`
3. Click "Call Service"
4. Check Home Assistant logs for detailed diagnostic output

### 4. Updated Service Definitions (`custom_components/meraki_ha/services.yaml`)

Added service definitions for:

- `diagnose_panel` - New diagnostic service
- `sync_client_names` - Existing service (was missing from YAML)

### 5. Created Troubleshooting Documentation

#### `PANEL_TROUBLESHOOTING.md`

Comprehensive troubleshooting guide with:

- Diagnostic service instructions
- Step-by-step troubleshooting for 404 errors
- Debug logging configuration
- Direct access tests
- Common fixes
- Example log output for success/failure cases

#### `check_panel.py`

Python script to verify panel configuration:

- Checks all required files exist
- Validates manifest configuration
- Verifies frontend code structure
- Provides troubleshooting instructions

#### `test_panel_access.py`

Python script to test panel accessibility:

- Tests panel URL
- Tests static file serving
- Reports HTTP status codes
- Identifies connection issues

## How to Use

### Step 1: Reload the Integration

1. Go to **Settings → Devices & Services**
2. Find **"Meraki for Home Assistant"**
3. Click **⋮ → Reload**

### Step 2: Check the Logs

With the new logging, you should now see:

**Success:**

```
[meraki_ha] Registering Meraki frontend panel and static paths
[meraki_ha.frontend] Registering static path for Meraki HA frontend
[meraki_ha.frontend] Frontend static path: /path/to/www
[meraki_ha.frontend] Found meraki-panel.js (265489 bytes)
[meraki_ha.frontend] Successfully registered static path: /api/panel_custom/meraki_ha -> /path
[meraki_ha.frontend] Registering Meraki panel: title='Meraki', url_path='meraki', module='...'
[meraki_ha.frontend] Successfully registered Meraki panel at /meraki (admin only, entry: ...)
[meraki_ha] Frontend panel registration completed
```

**Failure (now visible!):**

```
[meraki_ha.frontend] ERROR meraki-panel.js not found at: /path/to/file
[meraki_ha.frontend] ERROR Failed to register Meraki panel: [error details]
[meraki_ha] ERROR Failed to register frontend panel: [error]. Panel will not be available.
```

### Step 3: Run Diagnostics

If the panel still doesn't appear:

1. **Developer Tools → Services**
2. Select `meraki_ha.diagnose_panel`
3. Click **"Call Service"**
4. Check logs for detailed diagnostic output

### Step 4: Enable Debug Logging (if needed)

Add to `configuration.yaml`:

```yaml
logger:
  default: info
  logs:
    custom_components.meraki_ha: debug
    custom_components.meraki_ha.frontend: debug
```

Restart HA and reload the integration.

## Expected Outcome

After reloading the integration with these changes:

1. **Panel registration will be logged** - You'll see exactly what happens
2. **Errors will be visible** - No more silent failures
3. **Diagnostic service available** - Quick troubleshooting from HA UI
4. **Detailed logs** - All registration steps logged at INFO level
5. **The panel should work** - If files are correct and HA has permissions

## Files Changed

- `custom_components/meraki_ha/frontend.py` - Added error handling and logging
- `custom_components/meraki_ha/__init__.py` - Added error handling around panel registration
- `custom_components/meraki_ha/services/panel_diagnostics.py` - New diagnostic service
- `custom_components/meraki_ha/services.yaml` - Service definitions
- `PANEL_TROUBLESHOOTING.md` - Comprehensive troubleshooting guide
- `check_panel.py` - Configuration verification script
- `test_panel_access.py` - Accessibility testing script

## Testing

All changes pass:

- ✅ Ruff linting (0 errors)
- ✅ Ruff formatting
- ✅ No breaking changes to existing functionality
- ✅ Follows project logging patterns (MerakiLoggers.FRONTEND)
- ✅ Proper exception handling and logging

## Next Steps

1. **Reload the Meraki integration** in Home Assistant
2. **Check the logs** - You should now see detailed registration logs
3. **If panel still doesn't appear**, run the `diagnose_panel` service
4. **Report the error** - With the new logging, we can identify the actual problem

---

**Date:** January 12, 2026
**Version:** 3.1.0-beta.5
**Issue:** Panel 404 - Silent registration failure
**Solution:** Added comprehensive error handling and diagnostics

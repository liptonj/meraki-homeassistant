# Meraki OAuth2 Implementation Plan

> **For agentic workers:** Inline execution in this session. User asked to build now. Do not commit unless the user asks.

**Goal:** Replace Dashboard API keys with Cisco Meraki OAuth 2.0 via Home Assistant Application Credentials, forcing existing installs to re-auth.

**Architecture:** `AbstractOAuth2FlowHandler` + Fitbit/SmartThings-style HTTP Basic token client. Config entries store `auth_implementation` + `token` + `meraki_org_id`. `OAuth2Session` refreshes 60-minute tokens. `meraki.aio.AsyncDashboardAPI` already sends `Authorization: Bearer {api_key}`, so the access token is passed as `api_key`.

**Tech Stack:** Home Assistant 2025.11 `application_credentials` + `config_entry_oauth2_flow`, `meraki>=2.1.0`, aiohttp BasicAuth.

## Global Constraints

- Never ship or log Client ID, Client Secret, access tokens, or refresh tokens.
- Use `MerakiLoggers.MAIN` / `MerakiLoggers.API`, never `logging.getLogger(__name__)`.
- No API-key fallback. Missing `token` → `ConfigEntryAuthFailed`.
- Redirect URI documented as `https://my.home-assistant.io/redirect/oauth`.
- Config flow VERSION = 2. Unique ID remains organization ID.
- `./run_checks.sh` must pass. No secrets in git.

## File map

- Create: `custom_components/meraki_ha/application_credentials.py`
- Create: `custom_components/meraki_ha/oauth.py`
- Create: `tests/test_application_credentials.py`
- Create: `tests/test_oauth.py`
- Modify: `manifest.json`, `const.py`, `config_flow.py`, `__init__.py`, `core/api/client.py`, `authentication.py`, `diagnostics.py`, `schemas.py`, `meraki_data_coordinator.py`, `strings.json`, `translations/{en,es,fr}.json`, `README.md`
- Delete: `custom_components/meraki_ha/reauth_flow.py`
- Rewrite tests: `tests/test_config_flow.py`, `tests/test_reauth_flow.py`, `tests/test_main_init.py`, `tests/test_translations_sync.py`, plus fixtures that still put `meraki_api_key` in entry data.

## Tasks

1. Constants, manifest, Application Credentials + Basic token client
2. API client Bearer + token refresh; diagnostics redaction
3. OAuth config flow (org picker, reauth, network step)
4. Setup/unload wiring and coordinator 401 → reauth
5. Strings, translations, README
6. Tests + `./run_checks.sh`

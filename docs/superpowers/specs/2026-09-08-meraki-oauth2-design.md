# Meraki OAuth2 for Home Assistant

**Date:** 2026-09-08
**Status:** Approved for implementation (Application Credentials; no shipped secret)
**Branch intent:** New work from `beta`. Do not mix with unrelated Push API commits if they can be split.

## Goal

Replace Dashboard API keys with Cisco Meraki OAuth 2.0. Each Home Assistant user registers their own Cisco app, stores Client ID and Client Secret in Home Assistant Application Credentials, and signs in through Meraki. Existing API-key installs must re-authenticate with OAuth on upgrade. After success, entities keep the same unique IDs (organization ID).

## Non-goals

- Do not embed Client ID or Client Secret in this repository or the HACS package.
- Do not keep an API-key fallback or dual auth path.
- Do not use Nabu Casa Cloud account linking (core/partner only).
- Do not use PKCE unless Meraki documents public-client support. Token exchange is a confidential client with HTTP Basic.
- Do not use the Meraki SDK `meraki_app_bearer_token` / `X-MerakiApp-Authorization` headers. Those identify a Meraki app, they are not Dashboard OAuth.

## User setup

1. Register an application at [integrate.cisco.com](https://integrate.cisco.com) (Cisco.com login).
2. Set the authorized redirect URI to exactly:
   `https://my.home-assistant.io/redirect/oauth`
3. Enable the scopes listed below on that Cisco app (authorize fails if the app cannot grant a requested scope).
4. In Home Assistant: Settings → Devices & services → three-dot menu → Application credentials → add Meraki Client ID and Secret.
5. Add the Meraki integration. Home Assistant opens Cisco/Meraki consent. The user picks organization(s) on Meraki’s screen.
6. If the token can see more than one org, Home Assistant shows an org picker. Unique ID is that org ID.
7. Existing network-selection options step runs as today.

**Why Application credentials is empty today:** the integration has not declared `application_credentials` yet. Meraki appears in that list only after this change is installed.

**Why the My Home Assistant URL:** Cisco requires a pre-registered redirect URI. Every HA instance has a different address. With `my:` loaded (default_config), HA always sends the shared callback `https://my.home-assistant.io/redirect/oauth`. That page does not exchange tokens.

The browser returns to `{instance}/auth/external/callback`. Token exchange happens on the user’s Home Assistant using Application Credentials. If `my:` is disabled, HA uses `{frontend origin}/auth/external/callback` instead; that exact URL would have to be registered on the Cisco app. Document the My URL as the supported path.

## OAuth endpoints and token rules

| Item                      | Value                                                      |
| ------------------------- | ---------------------------------------------------------- |
| Authorize                 | `https://as.meraki.com/oauth/authorize`                    |
| Token                     | `POST https://as.meraki.com/oauth/token`                   |
| Revoke (optional, unload) | `POST https://as.meraki.com/oauth/revoke`                  |
| Grant                     | `authorization_code`, then `refresh_token`                 |
| Token auth                | HTTP Basic `(client_id, client_secret)`                    |
| Body                      | `application/x-www-form-urlencoded`                        |
| API auth                  | `Authorization: Bearer <access_token>`                     |
| Access token lifetime     | 60 minutes                                                 |
| Refresh token             | Rotated on each refresh; previous refresh token is revoked |
| Idle refresh              | Revoked after 90 days of inactivity                        |

Never log access tokens, refresh tokens, or client secrets. Diagnostics must redact `token`, `access_token`, `refresh_token`, leftover `meraki_api_key`, and Application Credential fields.

## Scopes

Request space-separated scopes covering current integration capabilities (config writes plus telemetry). Do not request IAM, licensing, or Systems Manager.

```text
dashboard:general:config:read
dashboard:general:config:write
dashboard:general:telemetry:read
dashboard:general:telemetry:write
wireless:config:read
wireless:config:write
wireless:telemetry:read
wireless:telemetry:write
switch:config:read
switch:config:write
switch:telemetry:read
switch:telemetry:write
sdwan:config:read
sdwan:config:write
sdwan:telemetry:read
sdwan:telemetry:write
camera:config:read
camera:config:write
camera:telemetry:read
camera:telemetry:write
sensor:config:read
sensor:config:write
sensor:telemetry:read
sensor:telemetry:write
```

Cisco does not publish a cellular/MG scope. MG uplink continues to use existing client calls and already degrades on failure.

## Architecture

```text
User  →  Config flow (AbstractOAuth2FlowHandler)
      →  Cisco authorize (as.meraki.com)
      →  my.home-assistant.io/redirect/oauth
      →  HA /auth/external/callback
      →  MerakiOAuth2Implementation token POST (HTTP Basic)
      →  Config entry data: {auth_implementation, token, meraki_org_id, org_name}

Setup →  OAuth2Session.async_ensure_token_valid()
      →  MerakiAPIClient(access_token=..., org_id=...)
      →  Dashboard API with Authorization: Bearer
```

### New / changed units

| Unit                                            | Responsibility                                                                                                                                                       |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `application_credentials.py`                    | Authorization server URLs, custom `AuthImplementation` with Basic token auth, extra authorize `scope`, description placeholders (Cisco registry URL + redirect URI). |
| `config_flow.py`                                | Subclass `AbstractOAuth2FlowHandler`. After tokens: list orgs, pick org, then existing network-selection step. Reauth is OAuth, not an API-key form.                 |
| `core/api/client.py`                            | Accept a current access token (not a Dashboard API key). Send Bearer on SDK calls. Refresh happens before calls via `OAuth2Session`, not inside the SDK.             |
| `__init__.py`                                   | Require `token` in entry data. Raise `ConfigEntryAuthFailed` if missing or refresh fails. Wire session + client. Config entry VERSION 2.                             |
| `authentication.py`                             | Validate by listing organizations with a Bearer token, not an API key.                                                                                               |
| `reauth_flow.py`                                | Remove API-key reauth; OAuth handler owns reauth.                                                                                                                    |
| `schemas.py`                                    | Drop `CONFIG_SCHEMA` API-key fields used by the user step.                                                                                                           |
| `strings.json` + `translations/{en,es,fr}.json` | Application credentials description, OAuth steps, missing credentials, reauth, migrate copy.                                                                         |
| `manifest.json`                                 | Add `application_credentials` to `dependencies`.                                                                                                                     |
| `diagnostics.py`                                | Redact token material.                                                                                                                                               |
| `repairs.py`                                    | Replace invalid-API-key repair copy with OAuth reauth if still used.                                                                                                 |

### Config entry data (version 2)

```json
{
  "auth_implementation": "<application_credentials domain id>",
  "token": {
    "access_token": "<redacted>",
    "refresh_token": "<redacted>",
    "expires_in": 3600,
    "expires_at": 0,
    "token_type": "Bearer",
    "scope": "<granted scopes>"
  },
  "meraki_org_id": "<org id>",
  "org_name": "<org name>"
}
```

Do not store Client Secret on the config entry. It stays in Application Credentials.

Unique ID remains `meraki_org_id`. One config entry per org. The same Application Credential can back multiple org entries.

### Config flow steps

1. `user` / `pick_implementation` — HA built-in. Abort `missing_credentials` if none exist (HA then points at Application credentials).
2. External Cisco authorize (built-in `auth` step).
3. `pick_org` — if exactly one org, skip the form. On reauth, keep the existing org; abort if that org is not in the token’s org list.
4. `init` — existing network selection / options (unchanged).

### Token refresh and 401

- Before API work (setup and coordinator refresh), call `OAuth2Session.async_ensure_token_valid()`.
- Persist rotated tokens with `config_entry.data` updates (HA OAuth helper pattern). Always store the new refresh token; Meraki revokes the old one.
- HTTP 401 or `invalid_grant` → `ConfigEntryAuthFailed` → reauth.
- Do not retry forever on 401.

### Meraki SDK Bearer

Installed constraint: `meraki>=2.1.0` (`pyproject.toml`). Dashboard API v1 accepts `Authorization: Bearer <access_token>`.

Implementation rule, in order:

1. Inspect how `meraki.aio.AsyncDashboardAPI` authenticates in the pinned SDK.
2. If `api_key=` is sent as `Authorization: Bearer`, pass the OAuth access token as `api_key`.
3. If the SDK still sends `X-Cisco-Meraki-API-Key`, do not rely on that for OAuth. Inject or wrap the session so Dashboard calls use `Authorization: Bearer <access_token>` only.
4. Confirm with a unit test that the outgoing header is Bearer, not the legacy API-key header.

Refresh is owned by Home Assistant’s `OAuth2Session`, not by creating a new SDK client on every 60-minute expiry unless the token actually changed.

## Forced migration (API key → OAuth)

Config flow `VERSION` becomes `2`. There is no `async_migrate_entry` conversion of an API key into a token.

On setup of a version-1 entry or any entry without `token`:

1. Raise `ConfigEntryAuthFailed` with a translation that OAuth is now required.
2. Home Assistant starts reauth.
3. Reauth completes OAuth for the **existing** `meraki_org_id`.
4. Update entry data: write `auth_implementation` + `token`; **delete** `meraki_api_key`. Keep `meraki_org_id`, `org_name`, and all options.
5. Reload. Unique ID unchanged, so entities are not recreated.

New installs never accept an API key field.

## Error handling (user-visible)

| Situation                                    | Result                                                    |
| -------------------------------------------- | --------------------------------------------------------- |
| No Application Credentials                   | Abort `missing_credentials`                               |
| Cisco redirect mismatch                      | Document exact My URL; user must fix the Cisco app        |
| Invalid client / secret                      | Token step fails; show `invalid_auth` / `oauth_error`     |
| User denies consent                          | Abort `user_rejected_authorize` (HA default if available) |
| Org not in token (reauth)                    | Abort `org_mismatch`                                      |
| Duplicate org unique ID                      | Abort `already_configured`                                |
| Cannot reach as.meraki.com or api.meraki.com | `cannot_connect`                                          |

## Testing

- Mock Cisco authorize/token; never call real Meraki or store real secrets.
- Config flow: missing credentials, successful OAuth + single org, multi-org picker, already configured, reauth success, reauth org mismatch.
- Setup: missing `token` raises `ConfigEntryAuthFailed`.
- Client: Bearer header; 401 surfaces as auth failed.
- Token refresh: new refresh token persisted.
- Translations sync still passes.
- Diagnostics redacts token keys.
- `./run_checks.sh` must pass.

## Logging

Use `MerakiLoggers.MAIN` for flow/setup and `MerakiLoggers.API` for the client. Log org ID and HTTP status, never tokens.

## Security

- No hardcoded credentials (Application Credentials + config entry token storage only).
- No MD5/SHA-1; we use Meraki’s TLS endpoints and HA’s OAuth helpers.
- Bandit must stay clean.

## Implementation notes for the follow-on plan

- Follow Home Assistant `AbstractOAuth2FlowHandler` + Fitbit-style custom `AuthImplementation` for Basic token auth.
- Keep network options flow as-is.
- Update README / user-facing setup docs in the same change set as the flow strings so HACS users can register the Cisco app.
- Logger: never `logging.getLogger(__name__)`.

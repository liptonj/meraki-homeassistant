# Meraki Home Assistant Integration Documentation

Welcome to the central documentation for the Meraki Home Assistant Integration. This collection of documents provides information on the requirements, design, and architecture of the integration.

## Documentation Sections

Please explore the different sections to find the information you need:

- **[Requirements](./requirements/README.md)**
  Functional and technical requirements for the integration across device types.

- **[Design](./design/README.md)**
  High-level design documents (event log viewer, guest Wi‑Fi, more).

- **[Architecture & Development](./architecture/README.md)**
  Architecture overviews, refactoring plans, and developer setup guides.

- **[Testing](./testing/testing_plan.md)**
  Testing strategy and plans to ensure quality and reliability.

## Webhooks & Scanning API (beta)

- Enable webhooks in Options → Webhooks. Scanning API can be used alongside webhooks.
- Auto-register creates Meraki Dashboard HTTP servers per enabled network with your selected alert types. If your API key is read-only, use the manual instructions shown in the options step (URL, shared secret, alert types).
- Scanning API and alerts coexist on the same handler; if Scanning API is enabled, the validator path is registered alongside alerts.
- When webhooks are active, polling intervals are reduced automatically (network/device/SSID/client).
- Alerts trigger debounced targeted refreshes (device/client/SSID) and deduplicate by alertId.
- Webhooks must use HTTPS and a public URL; the shared secret is required for validation.

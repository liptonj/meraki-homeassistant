/**
 * Meraki Overview Card
 *
 * Displays network health summary for dashboard overview.
 * Features: Device counts by status, client count, SSID count, recent alerts.
 */

import { html, css } from 'lit';
import { MerakiCardBase } from './shared/meraki-card-base.js';
import { MerakiEditorBase } from './shared/meraki-editor-base.js';
import { merakiCardStyles } from './shared/styles.js';

export class MerakiOverviewCard extends MerakiCardBase {
  static get properties() {
    return {
      ...super.properties,
      _deviceCounts: { type: Object, state: true },
    };
  }

  static get styles() {
    return [
      merakiCardStyles,
      css`
        .overview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 16px;
          padding: 16px;
        }

        .stat-card {
          background: var(--secondary-background-color);
          border-radius: 8px;
          padding: 16px;
          text-align: center;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-2px);
        }

        .stat-value {
          font-size: 2rem;
          font-weight: bold;
          color: var(--primary-color);
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--secondary-text-color);
          margin-top: 4px;
        }

        .status-online {
          color: var(--meraki-success);
        }

        .status-alerting {
          color: var(--meraki-warning);
        }

        .status-offline {
          color: var(--meraki-error);
        }

        .alerts-section {
          padding: 0 16px 16px;
        }

        .alerts-header {
          font-weight: 500;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .alert-item {
          padding: 8px 12px;
          background: var(--secondary-background-color);
          border-radius: 4px;
          margin-bottom: 4px;
          font-size: 0.875rem;
          border-left: 3px solid var(--meraki-warning);
        }

        .no-alerts {
          color: var(--secondary-text-color);
          font-style: italic;
        }
      `,
    ];
  }

  static getStubConfig() {
    return {
      title: 'Meraki Overview',
      show_devices: true,
      show_clients: true,
      show_ssids: true,
      show_alerts: true,
    };
  }

  static getConfigForm() {
    return {
      schema: [
        { name: 'title', selector: { text: {} } },
        { name: 'config_entry_id', required: true, selector: { text: {} } },
        { name: 'show_devices', selector: { boolean: {} } },
        { name: 'show_clients', selector: { boolean: {} } },
        { name: 'show_ssids', selector: { boolean: {} } },
        { name: 'show_alerts', selector: { boolean: {} } },
      ],
    };
  }

  constructor() {
    super();
    this._deviceCounts = { online: 0, alerting: 0, offline: 0 };
  }

  getCardSize() {
    return 3;
  }

  getGridOptions() {
    return { rows: 3, columns: 6, min_rows: 2 };
  }

  async fetchData() {
    try {
      this._data = await this._callMerakiApi('meraki/get_overview');
      this._calculateDeviceCounts();
    } catch (err) {
      // Error already handled by base class
    }
  }

  _calculateDeviceCounts() {
    const devices = this._data?.devices || [];
    this._deviceCounts = {
      online: devices.filter((d) => d.status === 'online').length,
      alerting: devices.filter((d) => d.status === 'alerting').length,
      offline: devices.filter((d) => d.status === 'offline' || !d.status).length,
      total: devices.length,
    };
  }

  handleUpdate(message) {
    if (message.devices || message.clients || message.ssids) {
      this._data = {
        ...this._data,
        ...message,
      };
      this._calculateDeviceCounts();
    }
  }

  _handleStatClick(type) {
    const event = new CustomEvent('hass-more-info', {
      bubbles: true,
      composed: true,
      detail: { entityId: null, type: `meraki-${type}` },
    });
    this.dispatchEvent(event);
  }

  renderCard() {
    const config = this.config || {};
    const showDevices = config.show_devices !== false;
    const showClients = config.show_clients !== false;
    const showSsids = config.show_ssids !== false;
    const showAlerts = config.show_alerts !== false;

    const clients = this._data?.clients || [];
    const ssids = this._data?.ssids || [];
    const activeSSIDs = ssids.filter((s) => s.enabled).length;

    return html`
      <ha-card>
        <div class="card-header">
          <span>${config.title || 'Meraki Overview'}</span>
        </div>
        <div class="overview-grid">
          ${showDevices
            ? html`
                <div
                  class="stat-card"
                  @click=${() => this._handleStatClick('devices')}
                  role="button"
                  tabindex="0"
                  aria-label="View devices"
                >
                  <div class="stat-value status-online">${this._deviceCounts.online}</div>
                  <div class="stat-label">
                    <ha-icon icon="mdi:check-circle"></ha-icon>
                    Online
                  </div>
                </div>
                <div
                  class="stat-card"
                  @click=${() => this._handleStatClick('devices')}
                  role="button"
                  tabindex="0"
                  aria-label="View alerting devices"
                >
                  <div class="stat-value status-alerting">${this._deviceCounts.alerting}</div>
                  <div class="stat-label">
                    <ha-icon icon="mdi:alert"></ha-icon>
                    Alerting
                  </div>
                </div>
                <div
                  class="stat-card"
                  @click=${() => this._handleStatClick('devices')}
                  role="button"
                  tabindex="0"
                  aria-label="View offline devices"
                >
                  <div class="stat-value status-offline">${this._deviceCounts.offline}</div>
                  <div class="stat-label">
                    <ha-icon icon="mdi:close-circle"></ha-icon>
                    Offline
                  </div>
                </div>
              `
            : ''}
          ${showClients
            ? html`
                <div
                  class="stat-card"
                  @click=${() => this._handleStatClick('clients')}
                  role="button"
                  tabindex="0"
                  aria-label="View clients"
                >
                  <div class="stat-value">${clients.length}</div>
                  <div class="stat-label">
                    <ha-icon icon="mdi:devices"></ha-icon>
                    Clients
                  </div>
                </div>
              `
            : ''}
          ${showSsids
            ? html`
                <div
                  class="stat-card"
                  @click=${() => this._handleStatClick('ssids')}
                  role="button"
                  tabindex="0"
                  aria-label="View SSIDs"
                >
                  <div class="stat-value">${activeSSIDs}</div>
                  <div class="stat-label">
                    <ha-icon icon="mdi:wifi"></ha-icon>
                    Active SSIDs
                  </div>
                </div>
              `
            : ''}
        </div>
        ${showAlerts ? this._renderAlerts() : ''}
      </ha-card>
    `;
  }

  _renderAlerts() {
    // Extract alerts from devices with status messages
    const devices = this._data?.devices || [];
    const alerts = devices
      .filter((d) => d.status === 'alerting' && d.statusMessage)
      .slice(0, 5)
      .map((d) => ({
        device: d.name || d.serial,
        message: d.statusMessage,
      }));

    return html`
      <div class="alerts-section">
        <div class="alerts-header">
          <ha-icon icon="mdi:bell-alert"></ha-icon>
          Recent Alerts
        </div>
        ${alerts.length === 0
          ? html`<div class="no-alerts">No active alerts</div>`
          : alerts.map(
              (alert) => html`
                <div class="alert-item">${alert.device}: ${alert.message}</div>
              `
            )}
      </div>
    `;
  }
}

export class MerakiOverviewCardEditor extends MerakiEditorBase {
  static get styles() {
    return css`
      .form-row {
        display: flex;
        flex-direction: column;
        margin-bottom: 16px;
      }

      label {
        margin-bottom: 4px;
        font-weight: 500;
      }

      ha-textfield,
      ha-switch {
        width: 100%;
      }

      .switch-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 0;
      }
    `;
  }

  renderForm() {
    const config = this.config || {};

    return html`
      <div class="form-row">
        <label for="title">Title</label>
        <ha-textfield
          id="title"
          .value=${config.title || ''}
          .configValue=${'title'}
          @input=${this._valueChanged}
        ></ha-textfield>
      </div>
      <div class="form-row">
        <label for="config_entry_id">Config Entry ID (required)</label>
        <ha-textfield
          id="config_entry_id"
          .value=${config.config_entry_id || ''}
          .configValue=${'config_entry_id'}
          @input=${this._valueChanged}
          required
        ></ha-textfield>
      </div>
      <div class="switch-row">
        <label>Show Devices</label>
        <ha-switch
          .checked=${config.show_devices !== false}
          .configValue=${'show_devices'}
          @change=${this._valueChanged}
        ></ha-switch>
      </div>
      <div class="switch-row">
        <label>Show Clients</label>
        <ha-switch
          .checked=${config.show_clients !== false}
          .configValue=${'show_clients'}
          @change=${this._valueChanged}
        ></ha-switch>
      </div>
      <div class="switch-row">
        <label>Show SSIDs</label>
        <ha-switch
          .checked=${config.show_ssids !== false}
          .configValue=${'show_ssids'}
          @change=${this._valueChanged}
        ></ha-switch>
      </div>
      <div class="switch-row">
        <label>Show Alerts</label>
        <ha-switch
          .checked=${config.show_alerts !== false}
          .configValue=${'show_alerts'}
          @change=${this._valueChanged}
        ></ha-switch>
      </div>
    `;
  }
}

customElements.define('meraki-overview-card', MerakiOverviewCard);
customElements.define('meraki-overview-card-editor', MerakiOverviewCardEditor);

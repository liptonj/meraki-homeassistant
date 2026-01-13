/**
 * Meraki Device Card
 *
 * Displays single device status and details.
 * Features: Status indicator, model, firmware, IP, client count, reboot button.
 */

import { html, css } from 'lit';
import { MerakiCardBase } from './shared/meraki-card-base.js';
import { MerakiEditorBase } from './shared/meraki-editor-base.js';
import { merakiCardStyles } from './shared/styles.js';

export class MerakiDeviceCard extends MerakiCardBase {
  static get properties() {
    return {
      ...super.properties,
      _device: { type: Object, state: true },
      _clients: { type: Array, state: true },
    };
  }

  static get styles() {
    return [
      merakiCardStyles,
      css`
        .device-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
        }

        .device-icon {
          --mdc-icon-size: 40px;
        }

        .device-icon.online {
          color: var(--meraki-success);
        }

        .device-icon.alerting {
          color: var(--meraki-warning);
        }

        .device-icon.offline {
          color: var(--meraki-error);
        }

        .device-info {
          flex: 1;
        }

        .device-name {
          font-size: 1.25rem;
          font-weight: 500;
        }

        .device-model {
          color: var(--secondary-text-color);
          font-size: 0.875rem;
        }

        .device-details {
          padding: 0 16px 16px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid var(--divider-color);
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .detail-label {
          color: var(--secondary-text-color);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .detail-value {
          font-weight: 500;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
        }

        .status-badge.online {
          background: rgba(76, 175, 80, 0.1);
          color: var(--meraki-success);
        }

        .status-badge.alerting {
          background: rgba(255, 152, 0, 0.1);
          color: var(--meraki-warning);
        }

        .status-badge.offline {
          background: rgba(244, 67, 54, 0.1);
          color: var(--meraki-error);
        }

        .card-actions {
          display: flex;
          gap: 8px;
          padding: 16px;
          border-top: 1px solid var(--divider-color);
        }

        .compact .device-header {
          padding: 12px;
        }

        .compact .device-icon {
          --mdc-icon-size: 24px;
        }

        .compact .device-name {
          font-size: 1rem;
        }

        .compact .device-details {
          display: none;
        }

        .compact .card-actions {
          display: none;
        }

        .status-message {
          color: var(--meraki-warning);
          font-size: 0.875rem;
          padding: 8px 16px;
          background: rgba(255, 152, 0, 0.1);
          border-radius: 4px;
          margin: 0 16px 16px;
        }
      `,
    ];
  }

  static getStubConfig() {
    return {
      device_serial: '',
      show_clients: true,
      show_firmware: true,
      show_ip: true,
      compact: false,
    };
  }

  static getConfigForm() {
    return {
      schema: [
        { name: 'config_entry_id', required: true, selector: { text: {} } },
        { name: 'device_serial', selector: { text: {} } },
        { name: 'entity_id', selector: { entity: { domain: 'sensor' } } },
        { name: 'show_clients', selector: { boolean: {} } },
        { name: 'show_firmware', selector: { boolean: {} } },
        { name: 'show_ip', selector: { boolean: {} } },
        { name: 'compact', selector: { boolean: {} } },
      ],
    };
  }

  constructor() {
    super();
    this._device = null;
    this._clients = [];
  }

  getCardSize() {
    return this.config?.compact ? 1 : 3;
  }

  getGridOptions() {
    return this.config?.compact
      ? { rows: 1, columns: 3, min_rows: 1 }
      : { rows: 3, columns: 6, min_rows: 2 };
  }

  setConfig(config) {
    if (!config.device_serial && !config.entity_id) {
      throw new Error('Either device_serial or entity_id must be specified');
    }
    super.setConfig(config);
  }

  async fetchData() {
    try {
      const serial = this._getSerial();
      if (!serial) {
        this._error = 'No device serial available';
        return;
      }

      this._device = await this._callMerakiApi('meraki/get_device', { serial });

      if (this.config.show_clients !== false) {
        this._clients = await this._callMerakiApi('meraki/get_device_clients', { serial });
      }
    } catch (err) {
      // Error handled by base class
    }
  }

  _getSerial() {
    if (this.config.device_serial) {
      return this.config.device_serial;
    }
    if (this.config.entity_id && this.hass) {
      const state = this.hass.states[this.config.entity_id];
      return state?.attributes?.serial;
    }
    return null;
  }

  _getDeviceIcon() {
    const model = this._device?.model?.toLowerCase() || '';
    if (model.includes('mr') || model.includes('ap')) return 'mdi:access-point';
    if (model.includes('ms') || model.includes('switch')) return 'mdi:lan';
    if (model.includes('mx') || model.includes('appliance')) return 'mdi:router-network';
    if (model.includes('mv') || model.includes('camera')) return 'mdi:video';
    if (model.includes('mt') || model.includes('sensor')) return 'mdi:thermometer';
    return 'mdi:devices';
  }

  handleUpdate(message) {
    if (message.devices) {
      const serial = this._getSerial();
      const device = message.devices.find((d) => d.serial === serial);
      if (device) {
        this._device = device;
      }
    }
  }

  async _handleReboot() {
    if (!confirm('Are you sure you want to reboot this device?')) {
      return;
    }
    // Reboot functionality would call a service here
    const event = new CustomEvent('hass-notification', {
      bubbles: true,
      composed: true,
      detail: { message: 'Reboot requested' },
    });
    this.dispatchEvent(event);
  }

  renderCard() {
    if (!this._device) {
      return html`
        <ha-card>
          <div class="card-content">Device not found</div>
        </ha-card>
      `;
    }

    const config = this.config || {};
    const status = this._device.status || 'offline';
    const isCompact = config.compact === true;

    return html`
      <ha-card class="${isCompact ? 'compact' : ''}">
        <div class="device-header">
          <ha-icon class="device-icon ${status}" icon="${this._getDeviceIcon()}"></ha-icon>
          <div class="device-info">
            <div class="device-name">${this._device.name || this._device.serial}</div>
            <div class="device-model">${this._device.model || 'Unknown model'}</div>
          </div>
          <span class="status-badge ${status}">${status}</span>
        </div>

        ${this._device.statusMessage
          ? html`<div class="status-message">${this._device.statusMessage}</div>`
          : ''}

        <div class="device-details">
          ${config.show_ip !== false && this._device.lanIp
            ? html`
                <div class="detail-row">
                  <span class="detail-label">
                    <ha-icon icon="mdi:ip-network"></ha-icon>
                    IP Address
                  </span>
                  <span class="detail-value">${this._device.lanIp}</span>
                </div>
              `
            : ''}
          ${this._device.mac
            ? html`
                <div class="detail-row">
                  <span class="detail-label">
                    <ha-icon icon="mdi:ethernet"></ha-icon>
                    MAC Address
                  </span>
                  <span class="detail-value">${this._device.mac}</span>
                </div>
              `
            : ''}
          ${config.show_firmware !== false && this._device.firmware
            ? html`
                <div class="detail-row">
                  <span class="detail-label">
                    <ha-icon icon="mdi:update"></ha-icon>
                    Firmware
                  </span>
                  <span class="detail-value">${this._device.firmware}</span>
                </div>
              `
            : ''}
          ${config.show_clients !== false
            ? html`
                <div class="detail-row">
                  <span class="detail-label">
                    <ha-icon icon="mdi:devices"></ha-icon>
                    Connected Clients
                  </span>
                  <span class="detail-value">${this._clients.length}</span>
                </div>
              `
            : ''}
        </div>

        ${this._canReboot()
          ? html`
              <div class="card-actions">
                <ha-button @click=${this._handleReboot}>
                  <ha-icon icon="mdi:restart"></ha-icon>
                  Reboot
                </ha-button>
              </div>
            `
          : ''}
      </ha-card>
    `;
  }

  _canReboot() {
    // MR, MS, MX devices typically support reboot
    const model = this._device?.model?.toLowerCase() || '';
    return model.includes('mr') || model.includes('ms') || model.includes('mx');
  }
}

export class MerakiDeviceCardEditor extends MerakiEditorBase {
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

      ha-textfield {
        width: 100%;
      }

      .switch-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 0;
      }

      .helper-text {
        color: var(--secondary-text-color);
        font-size: 0.75rem;
        margin-top: 4px;
      }
    `;
  }

  renderForm() {
    const config = this.config || {};

    return html`
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
      <div class="form-row">
        <label for="device_serial">Device Serial</label>
        <ha-textfield
          id="device_serial"
          .value=${config.device_serial || ''}
          .configValue=${'device_serial'}
          @input=${this._valueChanged}
          placeholder="XXXX-XXXX-XXXX"
        ></ha-textfield>
        <span class="helper-text">Or use entity_id below</span>
      </div>
      <div class="form-row">
        <label for="entity_id">Entity ID</label>
        <ha-textfield
          id="entity_id"
          .value=${config.entity_id || ''}
          .configValue=${'entity_id'}
          @input=${this._valueChanged}
          placeholder="sensor.meraki_device_status"
        ></ha-textfield>
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
        <label>Show Firmware</label>
        <ha-switch
          .checked=${config.show_firmware !== false}
          .configValue=${'show_firmware'}
          @change=${this._valueChanged}
        ></ha-switch>
      </div>
      <div class="switch-row">
        <label>Show IP Address</label>
        <ha-switch
          .checked=${config.show_ip !== false}
          .configValue=${'show_ip'}
          @change=${this._valueChanged}
        ></ha-switch>
      </div>
      <div class="switch-row">
        <label>Compact Mode</label>
        <ha-switch
          .checked=${config.compact === true}
          .configValue=${'compact'}
          @change=${this._valueChanged}
        ></ha-switch>
      </div>
    `;
  }
}

customElements.define('meraki-device-card', MerakiDeviceCard);
customElements.define('meraki-device-card-editor', MerakiDeviceCardEditor);

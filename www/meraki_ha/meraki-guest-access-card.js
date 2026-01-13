/**
 * Meraki Guest Access Card
 *
 * Manage guest WiFi access with timed keys.
 * Features: Guest SSID list, create timed keys, QR codes, key management.
 */

import { html, css } from 'lit';
import { MerakiCardBase } from './shared/meraki-card-base.js';
import { merakiCardStyles } from './shared/styles.js';

export class MerakiGuestAccessCard extends MerakiCardBase {
  static get properties() {
    return {
      ...super.properties,
      _guestSSIDs: { type: Array, state: true },
      _activeKeys: { type: Array, state: true },
      _showCreateForm: { type: Boolean, state: true },
      _selectedSSID: { type: Object, state: true },
      _formData: { type: Object, state: true },
      _creating: { type: Boolean, state: true },
    };
  }

  static get styles() {
    return [
      merakiCardStyles,
      css`
        .guest-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid var(--divider-color);
        }

        .guest-title {
          font-size: 1.25rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .create-button {
          padding: 8px 16px;
          background: var(--primary-color);
          color: var(--text-primary-color);
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .create-button:hover {
          opacity: 0.9;
        }

        .ssid-list {
          padding: 16px;
        }

        .ssid-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px;
          border: 1px solid var(--divider-color);
          border-radius: 8px;
          margin-bottom: 8px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .ssid-item:hover {
          background: var(
            --secondary-background-color,
            rgba(127, 127, 127, 0.05)
          );
        }

        .ssid-item.selected {
          background: rgba(var(--rgb-primary-color), 0.1);
          border-color: var(--primary-color);
        }

        .ssid-info {
          flex: 1;
        }

        .ssid-name {
          font-weight: 500;
          margin-bottom: 4px;
        }

        .ssid-details {
          font-size: 0.75rem;
          color: var(--secondary-text-color);
        }

        .ssid-clients {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          background: var(
            --secondary-background-color,
            rgba(127, 127, 127, 0.1)
          );
          border-radius: 12px;
          font-size: 0.875rem;
        }

        .form-container {
          padding: 16px;
          border-bottom: 1px solid var(--divider-color);
          background: var(
            --secondary-background-color,
            rgba(127, 127, 127, 0.05)
          );
        }

        .form-title {
          font-weight: 500;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-label {
          display: block;
          margin-bottom: 4px;
          font-size: 0.875rem;
          color: var(--secondary-text-color);
        }

        .form-input,
        .form-select {
          width: 100%;
          padding: 8px;
          border: 1px solid var(--divider-color);
          border-radius: 4px;
          font-size: 0.875rem;
          background: var(--card-background-color);
          color: var(--primary-text-color);
        }

        .form-actions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        .form-button {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.875rem;
        }

        .form-button.primary {
          background: var(--primary-color);
          color: var(--text-primary-color);
        }

        .form-button.secondary {
          background: var(--divider-color);
          color: var(--primary-text-color);
        }

        .form-button:hover {
          opacity: 0.9;
        }

        .form-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .keys-list {
          padding: 16px;
        }

        .keys-title {
          font-weight: 500;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .key-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border: 1px solid var(--divider-color);
          border-radius: 8px;
          margin-bottom: 8px;
        }

        .key-icon {
          --mdc-icon-size: 24px;
          color: var(--meraki-success);
        }

        .key-icon.expired {
          color: var(--meraki-offline);
        }

        .key-info {
          flex: 1;
        }

        .key-name {
          font-weight: 500;
          margin-bottom: 4px;
        }

        .key-details {
          font-size: 0.75rem;
          color: var(--secondary-text-color);
        }

        .key-passphrase {
          font-family: monospace;
          padding: 4px 8px;
          background: var(
            --secondary-background-color,
            rgba(127, 127, 127, 0.1)
          );
          border-radius: 4px;
          font-size: 0.875rem;
          cursor: pointer;
        }

        .key-actions {
          display: flex;
          gap: 4px;
        }

        .key-action-button {
          padding: 4px;
          background: none;
          border: none;
          cursor: pointer;
          border-radius: 4px;
        }

        .key-action-button:hover {
          background: var(
            --secondary-background-color,
            rgba(127, 127, 127, 0.1)
          );
        }

        .empty-state {
          text-align: center;
          padding: 48px 16px;
          color: var(--secondary-text-color);
        }

        .empty-state ha-icon {
          --mdc-icon-size: 64px;
          opacity: 0.3;
          margin-bottom: 16px;
        }

        .qr-code-container {
          text-align: center;
          padding: 16px;
        }

        .qr-code {
          width: 200px;
          height: 200px;
          margin: 0 auto;
        }

        .success-message {
          padding: 12px;
          margin: 16px;
          background: rgba(76, 175, 80, 0.1);
          color: var(--meraki-success);
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
      `,
    ];
  }

  static getStubConfig() {
    return {
      show_all_ssids: false,
      default_duration: 24,
    };
  }

  constructor() {
    super();
    this._guestSSIDs = [];
    this._activeKeys = [];
    this._showCreateForm = false;
    this._selectedSSID = null;
    this._formData = {
      name: '',
      passphrase: '',
      duration: 24,
    };
    this._creating = false;
  }

  getCardSize() {
    return this._showCreateForm ? 5 : 3;
  }

  async fetchData() {
    if (!this.hass || !this.config) return;

    try {
      this._loading = true;
      this._error = null;

      // Get all SSID entities
      const allSSIDs = Object.values(this.hass.states).filter(
        (entity) =>
          entity.entity_id.startsWith('switch.') &&
          entity.attributes.device_class === 'outlet' &&
          entity.attributes.meraki_device_type === 'ssid'
      );

      // Filter to guest SSIDs (typically open or PSK with guest in name)
      this._guestSSIDs = allSSIDs.filter((entity) => {
        const name = (entity.attributes.friendly_name || '').toLowerCase();
        const authMode = (entity.attributes.auth_mode || '').toLowerCase();

        // Show all SSIDs if configured, otherwise filter for guest
        if (this.config.show_all_ssids) {
          return true;
        }

        return (
          name.includes('guest') ||
          name.includes('visitor') ||
          authMode === 'open' ||
          authMode === 'psk'
        );
      });

      // Get active keys (mock data - would need real API integration)
      // In production, this would call the Meraki API to get Identity PSKs
      this._activeKeys = [];

      this._loading = false;
    } catch (err) {
      console.error('Failed to fetch guest SSIDs:', err);
      this._error = err.message || 'Failed to load guest access';
      this._loading = false;
    }
  }

  handleUpdate(message) {
    this.fetchData();
  }

  _selectSSID(ssid) {
    this._selectedSSID = ssid;
    this._showCreateForm = true;
  }

  _cancelCreate() {
    this._showCreateForm = false;
    this._selectedSSID = null;
    this._formData = {
      name: '',
      passphrase: '',
      duration: this.config.default_duration || 24,
    };
  }

  async _createKey() {
    if (
      !this._selectedSSID ||
      !this._formData.name ||
      !this._formData.passphrase
    ) {
      return;
    }

    this._creating = true;

    try {
      // Call WebSocket API to create timed access key
      await this._callMerakiApi('meraki_ha/create_timed_access_key', {
        network_id: this._selectedSSID.attributes.network_id,
        ssid_number: this._selectedSSID.attributes.ssid_number,
        name: this._formData.name,
        passphrase: this._formData.passphrase,
        duration_hours: parseInt(this._formData.duration, 10),
      });

      // Show success message
      this._showSuccessMessage();

      // Reset form
      this._cancelCreate();

      // Refresh data
      await this.fetchData();
    } catch (err) {
      console.error('Failed to create timed access key:', err);
      this._error = err.message || 'Failed to create access key';
    } finally {
      this._creating = false;
    }
  }

  _showSuccessMessage() {
    // Trigger a notification
    const event = new CustomEvent('hass-notification', {
      bubbles: true,
      composed: true,
      detail: {
        message: 'Guest access key created successfully',
      },
    });
    this.dispatchEvent(event);
  }

  _copyPassphrase(passphrase) {
    navigator.clipboard.writeText(passphrase).then(() => {
      this._showSuccessMessage();
    });
  }

  async _revokeKey(key) {
    // In production, would call Meraki API to delete the IPSK
    console.log('Revoke key:', key);
  }

  _generateQRCode(ssid, passphrase) {
    // QR code for WiFi in format: WIFI:T:WPA;S:ssid;P:password;;
    const qrData = `WIFI:T:WPA;S:${ssid};P:${passphrase};;`;
    // Would need to integrate QR code generation library
    return qrData;
  }

  _formatExpiration(expiresAt) {
    if (!expiresAt) return 'Never';
    const date = new Date(expiresAt);
    const now = new Date();

    if (date < now) {
      return 'Expired';
    }

    const diff = date - now;
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d remaining`;
    }
    return `${hours}h remaining`;
  }

  renderCard() {
    if (this._guestSSIDs.length === 0) {
      return html`
        <ha-card>
          <div class="guest-header">
            <div class="guest-title">
              <ha-icon icon="mdi:account-key"></ha-icon>
              <span>Guest Access</span>
            </div>
          </div>
          <div class="empty-state">
            <ha-icon icon="mdi:wifi-off"></ha-icon>
            <div>No guest SSIDs found</div>
            <div style="font-size: 0.875rem; margin-top: 8px;">
              Configure a guest SSID to enable timed access keys
            </div>
          </div>
        </ha-card>
      `;
    }

    return html`
      <ha-card>
        <div class="guest-header">
          <div class="guest-title">
            <ha-icon icon="mdi:account-key"></ha-icon>
            <span>Guest Access</span>
          </div>
          ${!this._showCreateForm
            ? html`
                <button
                  class="create-button"
                  @click=${() => (this._showCreateForm = true)}
                >
                  <ha-icon icon="mdi:plus"></ha-icon>
                  <span>Create Access Key</span>
                </button>
              `
            : ''}
        </div>

        ${this._showCreateForm
          ? html`
              <div class="form-container">
                <div class="form-title">
                  <span>Create Timed Access Key</span>
                  <ha-icon
                    icon="mdi:close"
                    @click=${this._cancelCreate}
                    style="cursor: pointer;"
                  ></ha-icon>
                </div>

                <div class="form-group">
                  <label class="form-label">Select Guest SSID</label>
                  <select
                    class="form-select"
                    @change=${(e) => {
                      const ssid = this._guestSSIDs.find(
                        (s) => s.entity_id === e.target.value
                      );
                      this._selectedSSID = ssid;
                    }}
                  >
                    <option value="">Choose SSID...</option>
                    ${this._guestSSIDs.map(
                      (ssid) => html`
                        <option
                          value="${ssid.entity_id}"
                          ?selected=${this._selectedSSID?.entity_id ===
                          ssid.entity_id}
                        >
                          ${ssid.attributes.friendly_name}
                          (${ssid.attributes.network_name})
                        </option>
                      `
                    )}
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">Guest Name</label>
                  <input
                    type="text"
                    class="form-input"
                    placeholder="e.g., John Doe"
                    .value=${this._formData.name}
                    @input=${(e) => {
                      this._formData.name = e.target.value;
                    }}
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">Passphrase</label>
                  <input
                    type="text"
                    class="form-input"
                    placeholder="Minimum 8 characters"
                    .value=${this._formData.passphrase}
                    @input=${(e) => {
                      this._formData.passphrase = e.target.value;
                    }}
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">Duration (hours)</label>
                  <select
                    class="form-select"
                    .value=${this._formData.duration}
                    @change=${(e) => {
                      this._formData.duration = e.target.value;
                    }}
                  >
                    <option value="1">1 hour</option>
                    <option value="4">4 hours</option>
                    <option value="8">8 hours</option>
                    <option value="24">24 hours (1 day)</option>
                    <option value="72">72 hours (3 days)</option>
                    <option value="168">168 hours (1 week)</option>
                  </select>
                </div>

                <div class="form-actions">
                  <button
                    class="form-button secondary"
                    @click=${this._cancelCreate}
                  >
                    Cancel
                  </button>
                  <button
                    class="form-button primary"
                    @click=${this._createKey}
                    ?disabled=${this._creating ||
                    !this._selectedSSID ||
                    !this._formData.name ||
                    !this._formData.passphrase ||
                    this._formData.passphrase.length < 8}
                  >
                    ${this._creating ? 'Creating...' : 'Create Key'}
                  </button>
                </div>
              </div>
            `
          : html`
              <div class="ssid-list">
                ${this._guestSSIDs.map(
                  (ssid) => html`
                    <div
                      class="ssid-item ${this._selectedSSID?.entity_id ===
                      ssid.entity_id
                        ? 'selected'
                        : ''}"
                      @click=${() => this._selectSSID(ssid)}
                    >
                      <div class="ssid-info">
                        <div class="ssid-name">
                          ${ssid.attributes.friendly_name}
                        </div>
                        <div class="ssid-details">
                          ${ssid.attributes.network_name} ·
                          ${ssid.attributes.auth_mode}
                        </div>
                      </div>
                      <ha-icon icon="mdi:chevron-right"></ha-icon>
                    </div>
                  `
                )}
              </div>
            `}
        ${this._activeKeys.length > 0
          ? html`
              <div class="keys-list">
                <div class="keys-title">
                  <ha-icon icon="mdi:key"></ha-icon>
                  <span>Active Access Keys</span>
                </div>
                ${this._activeKeys.map(
                  (key) => html`
                    <div class="key-item">
                      <ha-icon
                        icon="mdi:key"
                        class="key-icon ${key.expired ? 'expired' : ''}"
                      ></ha-icon>
                      <div class="key-info">
                        <div class="key-name">${key.name}</div>
                        <div class="key-details">
                          ${key.ssid} ·
                          ${this._formatExpiration(key.expiresAt)}
                        </div>
                      </div>
                      <div class="key-actions">
                        <button
                          class="key-action-button"
                          @click=${() => this._copyPassphrase(key.passphrase)}
                          title="Copy passphrase"
                        >
                          <ha-icon icon="mdi:content-copy"></ha-icon>
                        </button>
                        <button
                          class="key-action-button"
                          @click=${() => this._revokeKey(key)}
                          title="Revoke access"
                        >
                          <ha-icon icon="mdi:delete"></ha-icon>
                        </button>
                      </div>
                    </div>
                  `
                )}
              </div>
            `
          : ''}
      </ha-card>
    `;
  }
}

customElements.define('meraki-guest-access-card', MerakiGuestAccessCard);

// Register card with Home Assistant
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'meraki-guest-access-card',
  name: 'Meraki Guest Access',
  description: 'Manage guest WiFi access with timed keys',
  preview: true,
});

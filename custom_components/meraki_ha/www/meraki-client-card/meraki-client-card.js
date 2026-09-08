import { html, css } from 'lit';
import { MerakiCardBase } from '../shared/meraki-card-base.js';
import { merakiCardStyles } from '../shared/styles.js';

/**
 * Format bytes into human-readable units (B, KB, MB, GB, TB)
 * @param {number} bytes - The number of bytes
 * @returns {string} - Formatted string with appropriate unit
 */
const formatBytes = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format date string into localized date/time
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date string
 */
const formatDate = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleString();
};

/**
 * Calculate relative time from now (e.g., "2 minutes ago")
 * @param {string} dateString - ISO date string
 * @returns {string} - Relative time string
 */
const getRelativeTime = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24)
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return formatDate(dateString);
};

/**
 * Get icon for client based on OS/manufacturer
 * @param {Object} client - Client data object
 * @returns {string} - Emoji icon
 */
const getClientIcon = (client) => {
  const os = (client.os || '').toLowerCase();
  const manufacturer = (client.manufacturer || '').toLowerCase();

  if (os.includes('ios') || manufacturer.includes('apple')) return '📱';
  if (os.includes('android')) return '📱';
  if (os.includes('windows')) return '💻';
  if (os.includes('mac') && !os.includes('android')) return '🖥️';
  if (os.includes('linux')) return '🐧';
  if (manufacturer.includes('amazon')) return '📺';
  if (manufacturer.includes('roku')) return '📺';
  if (manufacturer.includes('samsung') && !os) return '📺';
  if (manufacturer.includes('sonos')) return '🔊';
  return '🔌';
};

/**
 * Meraki Client Card - displays detailed information about a single network client
 * Complements the meraki-clients-card (list view) by providing a focused detail view.
 */
export class MerakiClientCard extends MerakiCardBase {
  static get properties() {
    return {
      ...super.properties,
      _collapsed: { type: Boolean, state: true },
    };
  }

  static get styles() {
    return [
      merakiCardStyles,
      css`
        .client-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          cursor: pointer;
        }

        .client-icon {
          font-size: 2rem;
          flex-shrink: 0;
        }

        .client-info {
          flex: 1;
          min-width: 0;
        }

        .header-name {
          font-size: 1.1rem;
          font-weight: 500;
          margin: 0 0 4px 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .header-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: var(--secondary-text-color);
          flex-wrap: wrap;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .status-online {
          background: rgba(76, 175, 80, 0.15);
          color: var(--meraki-success);
        }

        .status-offline {
          background: rgba(158, 158, 158, 0.15);
          color: var(--meraki-offline);
        }

        .status-blocked {
          background: rgba(244, 67, 54, 0.15);
          color: var(--meraki-error);
        }

        .connection-badge {
          padding: 2px 8px;
          border-radius: 12px;
          background: rgba(33, 150, 243, 0.15);
          color: var(--primary-color);
          font-size: 0.75rem;
        }

        .collapse-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          font-size: 1rem;
          color: var(--secondary-text-color);
          transition: transform 0.2s ease;
        }

        .collapse-button.collapsed {
          transform: rotate(-90deg);
        }

        .card-body {
          padding: 0 16px 16px;
          overflow: hidden;
          transition:
            max-height 0.3s ease,
            opacity 0.3s ease;
        }

        .card-body.collapsed {
          max-height: 0;
          opacity: 0;
          padding: 0 16px;
        }

        .section {
          margin-bottom: 16px;
        }

        .section:last-child {
          margin-bottom: 0;
        }

        .section-title {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--secondary-text-color);
          margin: 0 0 8px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .detail-table {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 8px 12px;
          background: var(--card-background-color, var(--ha-card-background));
          border-radius: 8px;
          padding: 12px;
          border: 1px solid var(--divider-color);
        }

        .detail-label {
          font-size: 0.85rem;
          color: var(--secondary-text-color);
        }

        .detail-value {
          font-size: 0.85rem;
          color: var(--primary-text-color);
          word-break: break-word;
        }

        .detail-value.mono {
          font-family: var(--paper-font-code1_-_font-family, monospace);
          font-size: 0.8rem;
        }

        .action-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding-top: 8px;
          border-top: 1px solid var(--divider-color);
          margin-top: 8px;
        }

        .action-button {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 8px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 500;
          transition: background 0.2s ease;
        }

        .action-button.primary {
          background: var(--primary-color);
          color: var(--text-primary-color);
        }

        .action-button.secondary {
          background: var(--secondary-background-color, rgba(0, 0, 0, 0.05));
          color: var(--primary-text-color);
        }

        .action-button.danger {
          background: rgba(244, 67, 54, 0.15);
          color: var(--meraki-error);
        }

        .action-button:hover {
          opacity: 0.85;
        }

        .not-found {
          padding: 24px;
          text-align: center;
          color: var(--secondary-text-color);
        }

        .not-found-icon {
          font-size: 3rem;
          margin-bottom: 12px;
        }

        .text-success {
          color: var(--meraki-success);
        }

        .text-info {
          color: var(--primary-color);
        }
      `,
    ];
  }

  constructor() {
    super();
    this._collapsed = false;
  }

  setConfig(config) {
    if (!config.client_mac && !config.entity_id) {
      throw new Error('You must specify either client_mac or entity_id');
    }
    this.config = {
      show_usage: true,
      show_connection_info: true,
      show_timestamps: true,
      show_block_button: true,
      collapsible: true,
      default_collapsed: false,
      ...config,
    };
    this._collapsed = this.config.default_collapsed;
  }

  async fetchData() {
    if (!this.hass) {
      return;
    }

    try {
      this._loading = true;
      this._error = null;

      // Determine MAC address from config
      let mac = this.config.client_mac;
      if (!mac && this.config.entity_id) {
        // Extract MAC from entity_id (format: device_tracker.meraki_client_aa_bb_cc_dd_ee_ff)
        const parts = this.config.entity_id.split('_');
        if (parts.length >= 6) {
          mac = parts.slice(-6).join(':');
        }
      }

      if (!mac) {
        throw new Error('Could not determine client MAC address');
      }

      const result = await this.hass.connection.sendMessagePromise({
        type: 'meraki/get_client',
        config_entry_id: this.config.config_entry_id,
        mac: mac.toLowerCase(),
      });

      this._data = result || {};
      this._loading = false;
    } catch (err) {
      this._loading = false;
      this._error = err.message || 'Failed to fetch client data';
    }
  }

  handleUpdate(message) {
    // Handle real-time updates if applicable
    if (message.type === 'client_update' && message.mac === this._data.mac) {
      this._data = { ...this._data, ...message.data };
    }
  }

  _toggleCollapse() {
    if (this.config.collapsible) {
      this._collapsed = !this._collapsed;
    }
  }

  _handleBlockClient() {
    if (!this.hass || !this._data.mac) return;

    // Find the block switch entity for this client
    const mac = this._data.mac.replace(/:/g, '_');
    const entityId = `switch.meraki_client_${mac}_block`;

    // Toggle the block state
    const isBlocked = this._data.is_blocked;
    this.hass.callService('switch', isBlocked ? 'turn_off' : 'turn_on', {
      entity_id: entityId,
    });
  }

  _handleNavigateToDevice() {
    if (!this._data.ha_device_id) return;

    const event = new CustomEvent('hass-navigate', {
      bubbles: true,
      composed: true,
      detail: { path: `/config/devices/device/${this._data.ha_device_id}` },
    });
    this.dispatchEvent(event);
  }

  _handleRefresh() {
    this.fetchData();
  }

  renderCard() {
    const client = this._data;

    // Handle case when client is not found
    if (!client || !client.mac) {
      return html`
        <ha-card>
          <div class="not-found">
            <div class="not-found-icon">❓</div>
            <div>Client not found</div>
            <div style="font-size: 0.85rem; margin-top: 8px;">
              ${this.config.client_mac || this.config.entity_id}
            </div>
          </div>
        </ha-card>
      `;
    }

    const isOnline = client.status === 'Online';
    const isBlocked = client.is_blocked;
    const connectionType = client.ssid
      ? 'wireless'
      : client.switchport
      ? 'wired'
      : 'unknown';

    return html`
      <ha-card>
        <div class="client-header" @click=${this._toggleCollapse}>
          <div class="client-icon">${getClientIcon(client)}</div>
          <div class="client-info">
            <div class="header-name">${client.description || client.mac}</div>
            <div class="header-meta">
              <span
                class="status-badge ${isOnline
                  ? 'status-online'
                  : 'status-offline'}"
              >
                ${isOnline ? '🟢' : '⚪'} ${client.status || 'Unknown'}
              </span>
              ${isBlocked
                ? html`<span class="status-badge status-blocked"
                    >🚫 Blocked</span
                  >`
                : ''}
              ${client.os || client.manufacturer
                ? html`<span
                    >${client.manufacturer || ''} ${client.os || ''}</span
                  >`
                : ''}
            </div>
          </div>
          ${this.config.collapsible
            ? html`
                <button
                  class="collapse-button ${this._collapsed ? 'collapsed' : ''}"
                  @click=${(e) => {
                    e.stopPropagation();
                    this._toggleCollapse();
                  }}
                >
                  ▼
                </button>
              `
            : ''}
        </div>

        <div class="card-body ${this._collapsed ? 'collapsed' : ''}">
          <!-- Network Information Section -->
          <div class="section">
            <h3 class="section-title">📡 Network Information</h3>
            <div class="detail-table">
              <span class="detail-label">IP Address</span>
              <span class="detail-value mono">${client.ip || '—'}</span>

              ${client.ip6
                ? html`
                    <span class="detail-label">IPv6</span>
                    <span class="detail-value mono">${client.ip6}</span>
                  `
                : ''}

              <span class="detail-label">MAC Address</span>
              <span class="detail-value mono">${client.mac}</span>

              ${client.manufacturer
                ? html`
                    <span class="detail-label">Manufacturer</span>
                    <span class="detail-value">${client.manufacturer}</span>
                  `
                : ''}
            </div>
          </div>

          <!-- Connection Section -->
          ${this.config.show_connection_info
            ? html`
                <div class="section">
                  <h3 class="section-title">🔗 Connection</h3>
                  <div class="detail-table">
                    <span class="detail-label">Connected To</span>
                    <span class="detail-value"
                      >${client.recentDeviceName || '—'}</span
                    >

                    ${client.recentDeviceSerial
                      ? html`
                          <span class="detail-label">Device Serial</span>
                          <span class="detail-value mono"
                            >${client.recentDeviceSerial}</span
                          >
                        `
                      : ''}
                    ${client.ssid
                      ? html`
                          <span class="detail-label">SSID</span>
                          <span class="detail-value">${client.ssid}</span>
                        `
                      : ''}
                    ${client.switchport
                      ? html`
                          <span class="detail-label">Switchport</span>
                          <span class="detail-value"
                            >Port ${client.switchport}</span
                          >
                        `
                      : ''}
                    ${client.vlan !== undefined
                      ? html`
                          <span class="detail-label">VLAN</span>
                          <span class="detail-value">${client.vlan}</span>
                        `
                      : ''}

                    <span class="detail-label">Type</span>
                    <span class="detail-value">
                      <span class="connection-badge">
                        ${connectionType === 'wireless'
                          ? '📶 Wireless'
                          : '🔌 Wired'}
                      </span>
                    </span>
                  </div>
                </div>
              `
            : ''}

          <!-- Usage Section -->
          ${this.config.show_usage && client.usage
            ? html`
                <div class="section">
                  <h3 class="section-title">📊 Usage</h3>
                  <div class="detail-table">
                    <span class="detail-label">↑ Sent</span>
                    <span class="detail-value">
                      <span class="text-success"
                        >${formatBytes(client.usage.sent)}</span
                      >
                    </span>

                    <span class="detail-label">↓ Received</span>
                    <span class="detail-value">
                      <span class="text-info"
                        >${formatBytes(client.usage.recv)}</span
                      >
                    </span>

                    <span class="detail-label">Total</span>
                    <span class="detail-value">
                      ${formatBytes(
                        (client.usage.sent || 0) + (client.usage.recv || 0)
                      )}
                    </span>
                  </div>
                </div>
              `
            : ''}

          <!-- Timestamps Section -->
          ${this.config.show_timestamps
            ? html`
                <div class="section">
                  <h3 class="section-title">🕐 Timestamps</h3>
                  <div class="detail-table">
                    <span class="detail-label">First Seen</span>
                    <span class="detail-value"
                      >${formatDate(client.firstSeen)}</span
                    >

                    <span class="detail-label">Last Seen</span>
                    <span class="detail-value"
                      >${getRelativeTime(client.lastSeen)}</span
                    >
                  </div>
                </div>
              `
            : ''}

          <!-- Action Buttons -->
          <div class="action-buttons">
            ${this.config.show_block_button
              ? html`
                  <button
                    class="action-button ${isBlocked ? 'secondary' : 'danger'}"
                    @click=${this._handleBlockClient}
                  >
                    ${isBlocked ? '✅ Unblock Client' : '🚫 Block Client'}
                  </button>
                `
              : ''}
            ${client.ha_device_id
              ? html`
                  <button
                    class="action-button primary"
                    @click=${this._handleNavigateToDevice}
                  >
                    📱 View in HA
                  </button>
                `
              : ''}

            <button
              class="action-button secondary"
              @click=${this._handleRefresh}
            >
              🔄 Refresh
            </button>
          </div>

          ${this._renderHomeAssistantEntities(client)}
        </div>
        ${this._renderDebugPanel()}
      </ha-card>
    `;
  }

  _renderHomeAssistantEntities(client) {
    if (!client.ha_device_id || !this.hass) return '';

    // Find HA entities for this device
    const deviceEntities = Object.values(this.hass.states).filter((entity) => {
      const deviceId = entity.attributes?.device_id;
      return (
        deviceId === client.ha_device_id ||
        entity.entity_id.includes(client.ha_device_id.replace(/_/g, '-'))
      );
    });

    if (deviceEntities.length === 0) return '';

    return html`
      <div class="info-section">
        <div class="section-title">
          🏠 Home Assistant Entities (${deviceEntities.length})
        </div>
        <div class="info-grid">
          ${deviceEntities.map(
            (entity) => html`
              <div class="info-item">
                <div class="info-label">
                  ${entity.attributes?.friendly_name || entity.entity_id}
                </div>
                <div class="info-value">
                  ${entity.state}
                  ${entity.attributes?.unit_of_measurement || ''}
                </div>
              </div>
            `
          )}
        </div>
      </div>
    `;
  }

  getCardSize() {
    return this._collapsed ? 1 : 5;
  }

  static getConfigElement() {
    return document.createElement('meraki-client-card-editor');
  }

  static getStubConfig() {
    return {
      client_mac: '',
      show_usage: true,
      show_connection_info: true,
      show_timestamps: true,
      show_block_button: true,
      collapsible: true,
      default_collapsed: false,
    };
  }
}

// Register the custom element
customElements.define('meraki-client-card', MerakiClientCard);

// Register with Lovelace
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'meraki-client-card',
  name: 'Meraki Client Card',
  description:
    'Displays detailed information about a single Meraki network client',
  preview: true,
  documentationURL: 'https://github.com/liptonj/meraki-homeassistant',
});

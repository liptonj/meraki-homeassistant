/**
 * Meraki SSIDs List Card
 *
 * Display all SSIDs grouped by network with status, client count, and quick toggles.
 * Features: Network grouping, status indicators, client counts, filtering.
 */

import { html, css } from 'lit';
import { MerakiCardBase } from './shared/meraki-card-base.js';
import { merakiCardStyles } from './shared/styles.js';

export class MerakiSSIDsListCard extends MerakiCardBase {
  static get properties() {
    return {
      ...super.properties,
      _ssids: { type: Array, state: true },
      _networks: { type: Object, state: true },
      _expandedNetworks: { type: Set, state: true },
      _filterText: { type: String, state: true },
    };
  }

  static get styles() {
    return [
      merakiCardStyles,
      css`
        .ssid-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid var(--divider-color);
        }

        .ssid-title {
          font-size: 1.25rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .filter-container {
          padding: 16px;
          border-bottom: 1px solid var(--divider-color);
        }

        .filter-input {
          width: 100%;
          padding: 8px;
          border: 1px solid var(--divider-color);
          border-radius: 4px;
          font-size: 0.875rem;
          background: var(--card-background-color);
          color: var(--primary-text-color);
        }

        .network-section {
          border-bottom: 1px solid var(--divider-color);
        }

        .network-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          cursor: pointer;
          background: var(
            --secondary-background-color,
            rgba(127, 127, 127, 0.05)
          );
        }

        .network-header:hover {
          background: var(
            --secondary-background-color,
            rgba(127, 127, 127, 0.1)
          );
        }

        .network-name {
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .network-stats {
          font-size: 0.875rem;
          color: var(--secondary-text-color);
        }

        .ssid-list {
          padding: 8px 0;
        }

        .ssid-item {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid var(--divider-color);
          transition: background 0.2s;
        }

        .ssid-item:hover {
          background: var(
            --secondary-background-color,
            rgba(127, 127, 127, 0.05)
          );
        }

        .ssid-item:last-child {
          border-bottom: none;
        }

        .ssid-status-icon {
          --mdc-icon-size: 24px;
          margin-right: 12px;
        }

        .ssid-status-icon.enabled {
          color: var(--meraki-success);
        }

        .ssid-status-icon.disabled {
          color: var(--meraki-offline);
        }

        .ssid-status-icon.hidden {
          color: var(--meraki-warning);
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
          display: flex;
          gap: 12px;
        }

        .ssid-clients {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 12px;
          background: var(
            --secondary-background-color,
            rgba(127, 127, 127, 0.1)
          );
          border-radius: 12px;
          font-size: 0.875rem;
        }

        .ssid-clients ha-icon {
          --mdc-icon-size: 16px;
        }

        .ssid-toggle {
          margin-left: 8px;
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

        .collapse-icon {
          transition: transform 0.2s;
        }

        .collapse-icon.expanded {
          transform: rotate(180deg);
        }
      `,
    ];
  }

  static getStubConfig() {
    return {
      title: 'SSIDs',
      show_filter: true,
      show_client_count: true,
      show_toggle: true,
      collapsed_by_default: false,
    };
  }

  static getConfigElement() {
    return document.createElement('meraki-ssids-list-card-editor');
  }

  constructor() {
    super();
    this._ssids = [];
    this._networks = {};
    this._expandedNetworks = new Set();
    this._filterText = '';
  }

  getCardSize() {
    return 4;
  }

  async fetchData() {
    if (!this.hass || !this.config) return;

    try {
      this._loading = true;
      this._error = null;

      // Fetch SSIDs and organize by network
      this._ssids = [];
      this._networks = {};

      // Get all SSID switch entities
      // SSID switches have entity_category = 'config' and unique_id pattern:
      // ssid-{networkId}-{ssidNumber}-enabled-switch or -broadcast-switch
      // Entity names are "Enabled Control" or "Broadcast Control"
      const ssidEntities = Object.values(this.hass.states).filter((entity) => {
        // Must be a switch with config category
        if (
          !entity.entity_id.startsWith('switch.') ||
          entity.attributes.entity_category !== 'config'
        ) {
          return false;
        }

        // Check for SSID-related switches by friendly_name or entity_id patterns
        const friendlyName = entity.attributes.friendly_name || '';
        const hasSSIDName =
          friendlyName.includes('Enabled Control') ||
          friendlyName.includes('Broadcast Control');

        // Also check for entity_id patterns as fallback
        const hasSSIDPattern =
          entity.entity_id.includes('enabled_switch') ||
          entity.entity_id.includes('broadcast_switch') ||
          entity.entity_id.includes('ssid');

        // Must have network_id and ssid_number attributes
        const hasRequiredAttrs =
          entity.attributes.network_id &&
          entity.attributes.ssid_number !== undefined;

        return (hasSSIDName || hasSSIDPattern) && hasRequiredAttrs;
      });

      // Get client count sensors
      const clientSensors = {};
      Object.values(this.hass.states).forEach((entity) => {
        if (entity.entity_id.includes('_client_count')) {
          const ssidMatch = entity.entity_id.match(/ssid_(\d+)_client_count/);
          if (ssidMatch) {
            clientSensors[ssidMatch[1]] = parseInt(entity.state, 10) || 0;
          }
        }
      });

      // Build SSID list with network grouping
      ssidEntities.forEach((entity) => {
        const attrs = entity.attributes;
        const networkId = attrs.network_id;
        const networkName = attrs.network_name || networkId;
        const ssidNumber = attrs.ssid_number;

        const ssid = {
          entity_id: entity.entity_id,
          name: attrs.friendly_name || entity.entity_id,
          network_id: networkId,
          network_name: networkName,
          number: ssidNumber,
          enabled: entity.state === 'on',
          status: attrs.ssid_status || 'unknown',
          auth_mode: attrs.auth_mode || 'Unknown',
          vlan: attrs.vlan_id || 'Default',
          client_count: clientSensors[ssidNumber] || 0,
        };

        this._ssids.push(ssid);

        // Group by network
        if (!this._networks[networkId]) {
          this._networks[networkId] = {
            id: networkId,
            name: networkName,
            ssids: [],
          };

          // Expand by default if configured
          if (!this.config.collapsed_by_default) {
            this._expandedNetworks.add(networkId);
          }
        }

        this._networks[networkId].ssids.push(ssid);
      });

      // Sort SSIDs within each network by number
      Object.values(this._networks).forEach((network) => {
        network.ssids.sort((a, b) => a.number - b.number);
      });

      this._loading = false;
    } catch (err) {
      console.error('Failed to fetch SSIDs:', err);
      this._error = err.message || 'Failed to load SSIDs';
      this._loading = false;
    }
  }

  handleUpdate(message) {
    // Re-fetch data when updates are received
    this.fetchData();
  }

  _toggleNetwork(networkId) {
    if (this._expandedNetworks.has(networkId)) {
      this._expandedNetworks.delete(networkId);
    } else {
      this._expandedNetworks.add(networkId);
    }
    this.requestUpdate();
  }

  _filterSSIDs(ssid) {
    if (!this._filterText) return true;
    const filter = this._filterText.toLowerCase();
    return (
      ssid.name.toLowerCase().includes(filter) ||
      ssid.network_name.toLowerCase().includes(filter)
    );
  }

  async _toggleSSID(ssid, event) {
    event.stopPropagation();

    try {
      const service = ssid.enabled ? 'turn_off' : 'turn_on';
      await this.hass.callService('switch', service, {
        entity_id: ssid.entity_id,
      });
    } catch (err) {
      console.error('Failed to toggle SSID:', err);
    }
  }

  _openSSIDDetails(ssid) {
    const event = new CustomEvent('hass-more-info', {
      bubbles: true,
      composed: true,
      detail: { entityId: ssid.entity_id },
    });
    this.dispatchEvent(event);
  }

  _getStatusIcon(ssid) {
    if (ssid.status === 'hidden') return 'mdi:wifi-lock';
    return ssid.enabled ? 'mdi:wifi' : 'mdi:wifi-off';
  }

  _getStatusClass(ssid) {
    if (ssid.status === 'hidden') return 'hidden';
    return ssid.enabled ? 'enabled' : 'disabled';
  }

  renderCard() {
    const filteredNetworks = Object.values(this._networks)
      .map((network) => ({
        ...network,
        ssids: network.ssids.filter((s) => this._filterSSIDs(s)),
      }))
      .filter((n) => n.ssids.length > 0);

    if (this._ssids.length === 0) {
      return html`
        <ha-card>
          <div class="empty-state">
            <ha-icon icon="mdi:wifi-off"></ha-icon>
            <div>No SSIDs found</div>
          </div>
        </ha-card>
      `;
    }

    return html`
      <ha-card>
        <div class="ssid-header">
          <div class="ssid-title">
            <ha-icon icon="mdi:wifi"></ha-icon>
            <span>Wireless Networks</span>
          </div>
          <div class="ssid-title">${this._ssids.length} SSIDs</div>
        </div>

        ${this.config.show_filter
          ? html`
              <div class="filter-container">
                <input
                  type="text"
                  class="filter-input"
                  placeholder="Filter SSIDs..."
                  .value=${this._filterText}
                  @input=${(e) => {
                    this._filterText = e.target.value;
                  }}
                />
              </div>
            `
          : ''}
        ${filteredNetworks.map((network) => {
          const isExpanded = this._expandedNetworks.has(network.id);
          const totalClients = network.ssids.reduce(
            (sum, s) => sum + s.client_count,
            0
          );
          const enabledCount = network.ssids.filter((s) => s.enabled).length;

          return html`
            <div class="network-section">
              <div
                class="network-header"
                @click=${() => this._toggleNetwork(network.id)}
              >
                <div class="network-name">
                  <ha-icon icon="mdi:lan"></ha-icon>
                  <span>${network.name}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 16px;">
                  <div class="network-stats">
                    ${enabledCount}/${network.ssids.length} enabled
                    ${this.config.show_client_count
                      ? html`· ${totalClients} clients`
                      : ''}
                  </div>
                  <ha-icon
                    icon="mdi:chevron-down"
                    class="collapse-icon ${isExpanded ? 'expanded' : ''}"
                  ></ha-icon>
                </div>
              </div>

              ${isExpanded
                ? html`
                    <div class="ssid-list">
                      ${network.ssids.map(
                        (ssid) => html`
                          <div class="ssid-item">
                            <ha-icon
                              icon="${this._getStatusIcon(ssid)}"
                              class="ssid-status-icon ${this._getStatusClass(
                                ssid
                              )}"
                            ></ha-icon>
                            <div
                              class="ssid-info"
                              @click=${() => this._openSSIDDetails(ssid)}
                              style="cursor: pointer;"
                            >
                              <div class="ssid-name">${ssid.name}</div>
                              <div class="ssid-details">
                                <span>SSID ${ssid.number}</span>
                                <span>${ssid.auth_mode}</span>
                                ${ssid.vlan !== 'Default'
                                  ? html`<span>VLAN ${ssid.vlan}</span>`
                                  : ''}
                              </div>
                            </div>
                            ${this.config.show_client_count
                              ? html`
                                  <div class="ssid-clients">
                                    <ha-icon
                                      icon="mdi:account-multiple"
                                    ></ha-icon>
                                    <span>${ssid.client_count}</span>
                                  </div>
                                `
                              : ''}
                            ${this.config.show_toggle
                              ? html`
                                  <ha-switch
                                    class="ssid-toggle"
                                    .checked=${ssid.enabled}
                                    @change=${(e) => this._toggleSSID(ssid, e)}
                                  ></ha-switch>
                                `
                              : ''}
                          </div>
                        `
                      )}
                    </div>
                  `
                : ''}
            </div>
          `;
        })}
        ${filteredNetworks.length === 0 && this._filterText
          ? html`
              <div class="empty-state">
                <div>No SSIDs match your filter</div>
              </div>
            `
          : ''}
        ${this._renderDebugPanel()}
      </ha-card>
    `;
  }
}

customElements.define('meraki-ssids-list-card', MerakiSSIDsListCard);

// Register card with Home Assistant
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'meraki-ssids-list-card',
  name: 'Meraki SSIDs List',
  description:
    'Display all SSIDs across networks with status and client counts',
  preview: true,
});

/**
 * Meraki Devices By Type Card
 *
 * Displays all devices grouped by type with collapsible sections.
 * Each device type shows a table similar to the original React dashboard.
 */

import { html, css } from 'lit';
import { MerakiCardBase } from './shared/meraki-card-base.js';
import { merakiCardStyles } from './shared/styles.js';

export class MerakiDevicesByTypeCard extends MerakiCardBase {
  static get properties() {
    return {
      ...super.properties,
      _devices: { type: Array, state: true },
      _collapsedSections: { type: Object, state: true },
      _currentPages: { type: Object, state: true }, // Track current page per device type
    };
  }

  static get styles() {
    return [
      merakiCardStyles,
      css`
        .device-type-section {
          margin-bottom: 16px;
        }

        .section-header {
          background: var(--secondary-background-color);
          padding: 12px 16px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: 8px;
          transition: background 0.2s;
        }

        .section-header:hover {
          background: var(--divider-color);
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
          font-size: 1rem;
        }

        .device-count {
          background: var(--primary-color);
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.875rem;
        }

        .collapse-icon {
          transition: transform 0.3s;
        }

        .collapse-icon.collapsed {
          transform: rotate(-90deg);
        }

        .devices-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 8px;
        }

        .devices-table thead {
          background: var(--secondary-background-color);
        }

        .devices-table th {
          padding: 12px;
          text-align: left;
          font-weight: 500;
          font-size: 0.875rem;
          color: var(--secondary-text-color);
        }

        .devices-table td {
          padding: 12px;
          border-bottom: 1px solid var(--divider-color);
        }

        .devices-table tr:hover {
          background: var(--secondary-background-color);
        }

        .device-name {
          font-weight: 500;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
        }

        .status-online {
          background: var(--meraki-success);
          color: white;
        }

        .status-offline {
          background: var(--meraki-error);
          color: white;
        }

        .status-alerting {
          background: var(--meraki-warning);
          color: white;
        }

        .empty-state {
          text-align: center;
          padding: 32px;
          color: var(--secondary-text-color);
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          padding: 12px 16px;
          margin-top: 8px;
          background: var(--card-background-color);
          border-top: 1px solid var(--divider-color);
        }

        .pagination-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .pagination-button:hover:not(:disabled) {
          background: var(--secondary-background-color);
        }

        .pagination-button:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .pagination-info {
          font-size: 0.875rem;
          color: var(--secondary-text-color);
        }
      `,
    ];
  }

  constructor() {
    super();
    this._devices = [];
    this._collapsedSections = {};
    this._currentPages = {}; // Initialize page tracking
  }

  setConfig(config) {
    this.config = {
      title: 'Meraki Devices',
      show_switches: true,
      show_wireless: true,
      show_cameras: true,
      show_sensors: true,
      show_appliances: true,
      devices_per_page: 20, // New config option
      ...config,
    };
  }

  static getStubConfig() {
    return {
      title: 'Meraki Devices',
      show_switches: true,
      show_wireless: true,
      show_cameras: true,
      show_sensors: true,
      show_appliances: true,
    };
  }

  async fetchData() {
    try {
      // Get devices from the overview API
      const data = await this._callMerakiApi('meraki/get_overview');
      this._devices = data.devices || [];
    } catch (err) {
      // Error already handled by base class
    }
  }

  handleUpdate(message) {
    if (message.devices) {
      this._devices = message.devices;
    }
  }

  _getDeviceIcon(type) {
    const icons = {
      switch: '🔀',
      wireless: '📶',
      camera: '📹',
      sensor: '📡',
      appliance: '🛡️',
    };
    return icons[type] || '📱';
  }

  _getDeviceTypeName(type) {
    const names = {
      switch: 'Switches',
      wireless: 'Access Points',
      camera: 'Cameras',
      sensor: 'Sensors',
      appliance: 'Security Appliances',
    };
    return names[type] || type;
  }

  _groupDevicesByType() {
    const groups = {};
    const config = this.config || {};

    this._devices.forEach((device) => {
      const type = device.productType || 'unknown';

      // Check if this type should be shown
      const showKey = `show_${type === 'wireless' ? 'wireless' : type + 's'}`;
      if (config[showKey] === false) return;

      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(device);
    });

    return groups;
  }

  _toggleSection(type) {
    this._collapsedSections = {
      ...this._collapsedSections,
      [type]: !this._collapsedSections[type],
    };
  }

  _changePage(type, delta) {
    const currentPage = this._currentPages[type] || 0;
    this._currentPages = {
      ...this._currentPages,
      [type]: currentPage + delta,
    };
  }

  _renderDeviceTable(devices, type) {
    const devicesPerPage = this.config.devices_per_page || 20;
    const currentPage = this._currentPages[type] || 0;
    const totalPages = Math.ceil(devices.length / devicesPerPage);
    const startIdx = currentPage * devicesPerPage;
    const pageDevices = devices.slice(startIdx, startIdx + devicesPerPage);

    return html`
      <table class="devices-table">
        <thead>
          <tr>
            <th>Device</th>
            <th>Model</th>
            <th>Status</th>
            <th>IP Address</th>
            <th>Firmware</th>
          </tr>
        </thead>
        <tbody>
          ${pageDevices.map(
            (device) => html`
              <tr>
                <td class="device-name">${device.name || device.serial}</td>
                <td>${device.model || 'N/A'}</td>
                <td>
                  <span
                    class="status-badge status-${device.status || 'offline'}"
                  >
                    ${device.status || 'offline'}
                  </span>
                </td>
                <td>${device.lanIp || '—'}</td>
                <td>${device.firmware || 'N/A'}</td>
              </tr>
            `
          )}
        </tbody>
      </table>
      ${totalPages > 1
        ? this._renderPagination(type, currentPage, totalPages)
        : ''}
    `;
  }

  _renderPagination(type, currentPage, totalPages) {
    return html`
      <div class="pagination">
        <button
          class="pagination-button"
          ?disabled=${currentPage === 0}
          @click=${() => this._changePage(type, -1)}
          aria-label="Previous page"
        >
          <ha-icon icon="mdi:chevron-left"></ha-icon>
        </button>
        <span class="pagination-info"
          >Page ${currentPage + 1} of ${totalPages}</span
        >
        <button
          class="pagination-button"
          ?disabled=${currentPage >= totalPages - 1}
          @click=${() => this._changePage(type, 1)}
          aria-label="Next page"
        >
          <ha-icon icon="mdi:chevron-right"></ha-icon>
        </button>
      </div>
    `;
  }

  renderCard() {
    const groups = this._groupDevicesByType();
    const groupKeys = Object.keys(groups).sort();

    if (groupKeys.length === 0) {
      return html`
        <ha-card>
          <div class="card-header">
            <div class="name">${this.config?.title || 'Meraki Devices'}</div>
          </div>
          <div class="card-content">
            <div class="empty-state">
              <ha-icon icon="mdi:devices"></ha-icon>
              <div>No devices found</div>
            </div>
          </div>
        </ha-card>
      `;
    }

    return html`
      <ha-card>
        <div class="card-header">
          <div class="name">${this.config?.title || 'Meraki Devices'}</div>
        </div>
        <div class="card-content">
          ${groupKeys.map((type) => {
            const devices = groups[type];
            const isCollapsed = this._collapsedSections[type];

            return html`
              <div class="device-type-section">
                <div
                  class="section-header"
                  @click=${() => this._toggleSection(type)}
                >
                  <div class="section-title">
                    <span>${this._getDeviceIcon(type)}</span>
                    <span>${this._getDeviceTypeName(type)}</span>
                    <span class="device-count">${devices.length}</span>
                  </div>
                  <ha-icon
                    icon="mdi:chevron-down"
                    class="collapse-icon ${isCollapsed ? 'collapsed' : ''}"
                  ></ha-icon>
                </div>
                ${!isCollapsed ? this._renderDeviceTable(devices, type) : ''}
              </div>
            `;
          })}
        </div>
      </ha-card>
    `;
  }

  getCardSize() {
    const groups = this._groupDevicesByType();
    const deviceCount = Object.values(groups).reduce(
      (sum, arr) => sum + arr.length,
      0
    );
    return Math.max(3, Math.ceil(deviceCount / 3));
  }
}

customElements.define('meraki-devices-by-type-card', MerakiDevicesByTypeCard);

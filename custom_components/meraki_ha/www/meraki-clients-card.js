/**
 * Meraki Clients Card
 *
 * Displays client list with filtering and sorting.
 * Features: Paginated list, search, sort, block/unblock actions.
 */

import { html, css } from 'lit';
import { MerakiCardBase } from './shared/meraki-card-base.js';
import { MerakiEditorBase } from './shared/meraki-editor-base.js';
import { merakiCardStyles } from './shared/styles.js';
import {
  renderConfigEntrySelector,
  renderPaginationSelector,
} from './shared/editor-helpers.js';

export class MerakiClientsCard extends MerakiCardBase {
  static get properties() {
    return {
      ...super.properties,
      _clients: { type: Array, state: true },
      _filteredClients: { type: Array, state: true },
      _searchQuery: { type: String, state: true },
      _sortBy: { type: String, state: true },
      _sortAsc: { type: Boolean, state: true },
      _currentPage: { type: Number, state: true },
      _expandedClient: { type: String, state: true },
    };
  }

  static get styles() {
    return [
      merakiCardStyles,
      css`
        .search-bar {
          display: flex;
          gap: 8px;
          padding: 16px;
          align-items: center;
        }

        .search-input {
          flex: 1;
          padding: 8px 12px;
          border: 1px solid var(--divider-color);
          border-radius: 4px;
          background: var(--card-background-color);
          color: var(--primary-text-color);
          font-size: 0.875rem;
        }

        .search-input:focus {
          outline: none;
          border-color: var(--primary-color);
        }

        .client-count {
          color: var(--secondary-text-color);
          font-size: 0.875rem;
          white-space: nowrap;
        }

        .clients-table {
          width: 100%;
          border-collapse: collapse;
        }

        .clients-table th {
          text-align: left;
          padding: 8px 16px;
          background: var(--secondary-background-color);
          color: var(--secondary-text-color);
          font-size: 0.75rem;
          text-transform: uppercase;
          cursor: pointer;
          user-select: none;
        }

        .clients-table th:hover {
          background: var(--primary-color);
          color: var(--text-primary-color);
        }

        .clients-table th.sorted {
          color: var(--primary-color);
        }

        .clients-table td {
          padding: 12px 16px;
          border-bottom: 1px solid var(--divider-color);
        }

        .clients-table tr:hover {
          background: var(--secondary-background-color);
        }

        .client-row {
          cursor: pointer;
        }

        .client-name {
          font-weight: 500;
        }

        .client-mac {
          color: var(--secondary-text-color);
          font-size: 0.75rem;
          font-family: monospace;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
          margin-right: 8px;
        }

        .status-dot.online {
          background-color: var(--meraki-success);
        }

        .status-dot.offline {
          background-color: var(--meraki-offline);
        }

        .usage-bar {
          width: 60px;
          height: 6px;
          background: var(--divider-color);
          border-radius: 3px;
          overflow: hidden;
        }

        .usage-fill {
          height: 100%;
          background: var(--primary-color);
          border-radius: 3px;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          padding: 16px;
        }

        .pagination span {
          color: var(--secondary-text-color);
        }

        .expanded-details {
          background: var(--secondary-background-color);
          padding: 16px;
          border-bottom: 1px solid var(--divider-color);
        }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 12px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
        }

        .detail-item .label {
          color: var(--secondary-text-color);
          font-size: 0.75rem;
        }

        .detail-item .value {
          font-weight: 500;
        }

        .actions-row {
          margin-top: 12px;
          display: flex;
          gap: 8px;
        }

        .empty-state {
          text-align: center;
          padding: 32px;
          color: var(--secondary-text-color);
        }
      `,
    ];
  }

  static getStubConfig() {
    return {
      title: 'Network Clients',
      limit: 10,
      show_offline: false,
      sort_by: 'last_seen',
      columns: ['name', 'ip', 'status', 'usage'],
    };
  }

  static getConfigForm() {
    return {
      schema: [
        { name: 'title', selector: { text: {} } },
        { name: 'config_entry_id', required: true, selector: { text: {} } },
        { name: 'network_id', selector: { text: {} } },
        { name: 'limit', selector: { number: { min: 5, max: 100, step: 5 } } },
        { name: 'show_offline', selector: { boolean: {} } },
        {
          name: 'sort_by',
          selector: {
            select: {
              options: [
                { value: 'last_seen', label: 'Last Seen' },
                { value: 'name', label: 'Name' },
                { value: 'ip', label: 'IP Address' },
                { value: 'usage', label: 'Usage' },
              ],
            },
          },
        },
      ],
    };
  }

  constructor() {
    super();
    this._clients = [];
    this._filteredClients = [];
    this._searchQuery = '';
    this._sortBy = 'last_seen';
    this._sortAsc = false;
    this._currentPage = 0;
    this._expandedClient = null;
  }

  getCardSize() {
    return 4;
  }

  getGridOptions() {
    return { rows: 4, columns: 6, min_rows: 3 };
  }

  async fetchData() {
    try {
      const params = {};
      if (this.config.network_id) {
        params.network_id = this.config.network_id;
      }
      this._clients = await this._callMerakiApi('meraki/get_clients', params);
      this._applyFiltersAndSort();
    } catch (err) {
      // Error handled by base class
    }
  }

  handleUpdate(message) {
    if (message.clients) {
      this._clients = message.clients;
      this._applyFiltersAndSort();
    }
  }

  _applyFiltersAndSort() {
    let clients = [...this._clients];

    // Filter by online status if not showing offline
    if (!this.config.show_offline) {
      clients = clients.filter(
        (c) => c.status === 'Online' || c.recentDeviceSerial
      );
    }

    // Search filter
    if (this._searchQuery) {
      const query = this._searchQuery.toLowerCase();
      clients = clients.filter(
        (c) =>
          (c.description || '').toLowerCase().includes(query) ||
          (c.ip || '').toLowerCase().includes(query) ||
          (c.mac || '').toLowerCase().includes(query)
      );
    }

    // Sort
    clients.sort((a, b) => {
      let aVal, bVal;
      switch (this._sortBy) {
        case 'name':
          aVal = a.description || a.mac || '';
          bVal = b.description || b.mac || '';
          break;
        case 'ip':
          aVal = a.ip || '';
          bVal = b.ip || '';
          break;
        case 'usage':
          aVal = (a.usage?.sent || 0) + (a.usage?.recv || 0);
          bVal = (b.usage?.sent || 0) + (b.usage?.recv || 0);
          break;
        case 'last_seen':
        default:
          aVal = a.lastSeen || '';
          bVal = b.lastSeen || '';
      }

      if (aVal < bVal) return this._sortAsc ? -1 : 1;
      if (aVal > bVal) return this._sortAsc ? 1 : -1;
      return 0;
    });

    this._filteredClients = clients;
  }

  _handleSearch(e) {
    this._searchQuery = e.target.value;
    this._currentPage = 0;
    this._applyFiltersAndSort();
  }

  _handleSort(column) {
    if (this._sortBy === column) {
      this._sortAsc = !this._sortAsc;
    } else {
      this._sortBy = column;
      this._sortAsc = true;
    }
    this._applyFiltersAndSort();
  }

  _toggleExpand(mac) {
    this._expandedClient = this._expandedClient === mac ? null : mac;
  }

  _navigateToClient(mac) {
    // Navigate to client detail page
    const path = `client_${mac.replace(/:/g, '').toLowerCase()}`;
    window.history.pushState(null, '', `#${path}`);
    // Fire event to trigger view change
    this.dispatchEvent(
      new CustomEvent('location-changed', {
        bubbles: true,
        composed: true,
      })
    );
  }

  async _handleBlock(client) {
    try {
      await this._callMerakiApi('meraki/block_client', { mac: client.mac });
      this.fetchData();
    } catch (err) {
      // Error shown by base class
    }
  }

  async _handleUnblock(client) {
    try {
      await this._callMerakiApi('meraki/unblock_client', { mac: client.mac });
      this.fetchData();
    } catch (err) {
      // Error shown by base class
    }
  }

  _formatBytes(bytes) {
    if (!bytes) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let i = 0;
    while (bytes >= 1024 && i < units.length - 1) {
      bytes /= 1024;
      i++;
    }
    return `${bytes.toFixed(1)} ${units[i]}`;
  }

  _getMaxUsage() {
    return Math.max(
      ...this._clients.map((c) => (c.usage?.sent || 0) + (c.usage?.recv || 0)),
      1
    );
  }

  renderCard() {
    const config = this.config || {};
    const limit = config.limit || 10;
    const totalPages = Math.ceil(this._filteredClients.length / limit);
    const startIdx = this._currentPage * limit;
    const pageClients = this._filteredClients.slice(
      startIdx,
      startIdx + limit
    );
    const maxUsage = this._getMaxUsage();

    return html`
      <ha-card>
        <div class="card-header">
          <span>${config.title || 'Network Clients'}</span>
        </div>

        <div class="search-bar">
          <input
            type="text"
            class="search-input"
            placeholder="Search by name, IP, or MAC..."
            .value=${this._searchQuery}
            @input=${this._handleSearch}
            aria-label="Search clients"
          />
          <span class="client-count"
            >${this._filteredClients.length} clients</span
          >
        </div>

        ${pageClients.length === 0
          ? html`<div class="empty-state">No clients found</div>`
          : html`
              <table class="clients-table">
                <thead>
                  <tr>
                    <th
                      class="${this._sortBy === 'name' ? 'sorted' : ''}"
                      @click=${() => this._handleSort('name')}
                    >
                      Name
                      ${this._sortBy === 'name'
                        ? this._sortAsc
                          ? '↑'
                          : '↓'
                        : ''}
                    </th>
                    <th
                      class="${this._sortBy === 'ip' ? 'sorted' : ''}"
                      @click=${() => this._handleSort('ip')}
                    >
                      IP
                      ${this._sortBy === 'ip'
                        ? this._sortAsc
                          ? '↑'
                          : '↓'
                        : ''}
                    </th>
                    <th>Status</th>
                    <th
                      class="${this._sortBy === 'usage' ? 'sorted' : ''}"
                      @click=${() => this._handleSort('usage')}
                    >
                      Usage
                      ${this._sortBy === 'usage'
                        ? this._sortAsc
                          ? '↑'
                          : '↓'
                        : ''}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  ${pageClients.map((client) =>
                    this._renderClientRow(client, maxUsage)
                  )}
                </tbody>
              </table>
            `}
        ${totalPages > 1 ? this._renderPagination(totalPages) : ''}
        ${this._renderDebugPanel()}
      </ha-card>
    `;
  }

  _renderClientRow(client, maxUsage) {
    const isOnline = client.status === 'Online' || client.recentDeviceSerial;
    const usage = (client.usage?.sent || 0) + (client.usage?.recv || 0);
    const usagePercent = (usage / maxUsage) * 100;

    return html`
      <tr
        class="client-row"
        @click=${() => this._toggleExpand(client.mac)}
        role="button"
        tabindex="0"
        aria-expanded=${this._expandedClient === client.mac}
      >
        <td>
          <div class="client-name">${client.description || 'Unknown'}</div>
          <div class="client-mac">${client.mac}</div>
        </td>
        <td>${client.ip || '-'}</td>
        <td>
          <span class="status-dot ${isOnline ? 'online' : 'offline'}"></span>
          ${isOnline ? 'Online' : 'Offline'}
        </td>
        <td>
          <div class="usage-bar">
            <div class="usage-fill" style="width: ${usagePercent}%"></div>
          </div>
        </td>
      </tr>
      ${this._expandedClient === client.mac
        ? this._renderExpandedDetails(client)
        : ''}
    `;
  }

  _renderExpandedDetails(client) {
    return html`
      <tr>
        <td colspan="4">
          <div class="expanded-details">
            <div class="detail-grid">
              <div class="detail-item">
                <span class="label">MAC Address</span>
                <span class="value">${client.mac}</span>
              </div>
              <div class="detail-item">
                <span class="label">IP Address</span>
                <span class="value">${client.ip || 'N/A'}</span>
              </div>
              <div class="detail-item">
                <span class="label">VLAN</span>
                <span class="value">${client.vlan || 'N/A'}</span>
              </div>
              <div class="detail-item">
                <span class="label">Last Seen</span>
                <span class="value">${client.lastSeen || 'N/A'}</span>
              </div>
              <div class="detail-item">
                <span class="label">Sent</span>
                <span class="value"
                  >${this._formatBytes(client.usage?.sent)}</span
                >
              </div>
              <div class="detail-item">
                <span class="label">Received</span>
                <span class="value"
                  >${this._formatBytes(client.usage?.recv)}</span
                >
              </div>
            </div>
            <div class="actions-row">
              <ha-button @click=${() => this._navigateToClient(client.mac)}>
                <ha-icon icon="mdi:open-in-new"></ha-icon>
                View Full Details
              </ha-button>
              <ha-button @click=${() => this._handleBlock(client)}>
                <ha-icon icon="mdi:block-helper"></ha-icon>
                Block
              </ha-button>
              <ha-button @click=${() => this._handleUnblock(client)}>
                <ha-icon icon="mdi:check-circle"></ha-icon>
                Unblock
              </ha-button>
            </div>
          </div>
        </td>
      </tr>
    `;
  }

  _renderPagination(totalPages) {
    return html`
      <div class="pagination">
        <ha-icon-button
          .disabled=${this._currentPage === 0}
          @click=${() => this._currentPage--}
        >
          <ha-icon icon="mdi:chevron-left"></ha-icon>
        </ha-icon-button>
        <span>Page ${this._currentPage + 1} of ${totalPages}</span>
        <ha-icon-button
          .disabled=${this._currentPage >= totalPages - 1}
          @click=${() => this._currentPage++}
        >
          <ha-icon icon="mdi:chevron-right"></ha-icon>
        </ha-icon-button>
      </div>
    `;
  }
}

export class MerakiClientsCardEditor extends MerakiEditorBase {
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
      ha-select {
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

      ${renderConfigEntrySelector(
        this.hass,
        config.config_entry_id,
        this._handleConfigEntryChanged.bind(this)
      )}

      <div class="form-row">
        <label for="network_id">Network ID (optional)</label>
        <ha-textfield
          id="network_id"
          .value=${config.network_id || ''}
          .configValue=${'network_id'}
          @input=${this._valueChanged}
          placeholder="L_123456789"
        ></ha-textfield>
      </div>

      ${renderPaginationSelector(
        this.hass,
        'Clients per page',
        config.limit || 10,
        this._handleLimitChanged.bind(this),
        { min: 5, max: 100, step: 5 }
      )}

      <div class="switch-row">
        <label>Show Offline Clients</label>
        <ha-switch
          .checked=${config.show_offline === true}
          .configValue=${'show_offline'}
          @change=${this._valueChanged}
        ></ha-switch>
      </div>
    `;
  }

  _handleConfigEntryChanged(ev) {
    if (!this.config || !this.hass) return;
    const newConfig = { ...this.config };
    newConfig.config_entry_id = ev.detail.value;
    this._configChanged(newConfig);
  }

  _handleLimitChanged(ev) {
    if (!this.config || !this.hass) return;
    const newConfig = { ...this.config };
    newConfig.limit = ev.detail.value;
    this._configChanged(newConfig);
  }
}

customElements.define('meraki-clients-card', MerakiClientsCard);
customElements.define('meraki-clients-card-editor', MerakiClientsCardEditor);

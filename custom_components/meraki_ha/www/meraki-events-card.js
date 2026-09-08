/**
 * Meraki Events Card
 *
 * Display recent network events and alerts with filtering.
 * Features: Real-time feed, severity indicators, filtering, auto-refresh.
 */

import { html, css } from 'lit';
import { MerakiCardBase } from './shared/meraki-card-base.js';
import { merakiCardStyles } from './shared/styles.js';

export class MerakiEventsCard extends MerakiCardBase {
  static get properties() {
    return {
      ...super.properties,
      _events: { type: Array, state: true },
      _filterType: { type: String, state: true },
      _filterSeverity: { type: String, state: true },
      _limit: { type: Number, state: true },
      _currentPage: { type: Number, state: true },
    };
  }

  static get styles() {
    return [
      merakiCardStyles,
      css`
        .events-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid var(--divider-color);
        }

        .events-title {
          font-size: 1.25rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .refresh-button {
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
        }

        .refresh-button:hover {
          background: var(
            --secondary-background-color,
            rgba(127, 127, 127, 0.1)
          );
        }

        .filters {
          display: flex;
          gap: 8px;
          padding: 16px;
          border-bottom: 1px solid var(--divider-color);
          flex-wrap: wrap;
        }

        .filter-select {
          padding: 8px 12px;
          border: 1px solid var(--divider-color);
          border-radius: 4px;
          background: var(--card-background-color);
          color: var(--primary-text-color);
          font-size: 0.875rem;
          cursor: pointer;
        }

        .events-list {
          max-height: 500px;
          overflow-y: auto;
        }

        .event-item {
          display: flex;
          gap: 12px;
          padding: 12px 16px;
          border-bottom: 1px solid var(--divider-color);
          transition: background 0.2s;
        }

        .event-item:hover {
          background: var(
            --secondary-background-color,
            rgba(127, 127, 127, 0.05)
          );
        }

        .event-item:last-child {
          border-bottom: none;
        }

        .event-icon {
          --mdc-icon-size: 24px;
          flex-shrink: 0;
        }

        .event-icon.critical {
          color: var(--meraki-error);
        }

        .event-icon.warning {
          color: var(--meraki-warning);
        }

        .event-icon.info {
          color: var(--meraki-success);
        }

        .event-content {
          flex: 1;
          min-width: 0;
        }

        .event-type {
          font-weight: 500;
          margin-bottom: 4px;
        }

        .event-description {
          font-size: 0.875rem;
          color: var(--secondary-text-color);
          margin-bottom: 4px;
          word-wrap: break-word;
        }

        .event-meta {
          display: flex;
          gap: 12px;
          font-size: 0.75rem;
          color: var(--secondary-text-color);
        }

        .event-timestamp {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .severity-badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.625rem;
          font-weight: 500;
          text-transform: uppercase;
        }

        .severity-badge.critical {
          background: rgba(244, 67, 54, 0.1);
          color: var(--meraki-error);
        }

        .severity-badge.warning {
          background: rgba(255, 152, 0, 0.1);
          color: var(--meraki-warning);
        }

        .severity-badge.info {
          background: rgba(76, 175, 80, 0.1);
          color: var(--meraki-success);
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

        .load-more {
          padding: 16px;
          text-align: center;
          border-top: 1px solid var(--divider-color);
        }

        .load-more-button {
          padding: 8px 16px;
          background: var(--primary-color);
          color: var(--text-primary-color);
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.875rem;
        }

        .load-more-button:hover {
          opacity: 0.9;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          padding: 12px 16px;
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

  static getStubConfig() {
    return {
      title: 'Events',
      show_filters: true,
      auto_refresh: true,
      refresh_interval: 30,
      limit: 50,
      events_per_page: 10,
    };
  }

  static getConfigElement() {
    return document.createElement('meraki-events-card-editor');
  }

  constructor() {
    super();
    this._events = [];
    this._filterType = 'all';
    this._filterSeverity = 'all';
    this._limit = 50;
    this._currentPage = 0;
    this._refreshInterval = null;
  }

  getCardSize() {
    return 4;
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.config?.auto_refresh) {
      this._startAutoRefresh();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._stopAutoRefresh();
  }

  _startAutoRefresh() {
    this._stopAutoRefresh();
    const interval = (this.config?.refresh_interval || 30) * 1000;
    this._refreshInterval = setInterval(() => this.fetchData(), interval);
  }

  _stopAutoRefresh() {
    if (this._refreshInterval) {
      clearInterval(this._refreshInterval);
      this._refreshInterval = null;
    }
  }

  async fetchData() {
    if (!this.hass || !this.config) return;

    try {
      this._loading = true;
      this._error = null;

      // Build parameters for the API call
      const params = {
        limit: this._limit || this.config?.limit || 50,
      };

      // Add category filter if not 'all'
      if (this._filterType && this._filterType !== 'all') {
        params.category = this._filterType;
      }

      // Add severity filter if not 'all'
      if (this._filterSeverity && this._filterSeverity !== 'all') {
        params.severity = this._filterSeverity;
      }

      // Fetch events from WebSocket API
      const result = await this._callMerakiApi('meraki/get_events', params);

      this._events = result.events || [];

      this._loading = false;
    } catch (err) {
      console.error('Failed to fetch events:', err);

      // Provide helpful error message based on the error type
      if (err.message && err.message.includes('not_found')) {
        this._error =
          'Configuration not found. Please reload the integration.';
      } else if (err.message && err.message.includes('webhook')) {
        this._error =
          'No events available. Enable webhooks in integration options to receive network events and alerts.';
      } else {
        this._error =
          err.message ||
          'No events available. Enable webhooks in integration options to receive network events and alerts.';
      }

      this._events = [];
      this._loading = false;
    }
  }

  handleUpdate(message) {
    // Re-fetch data when updates are received
    this.fetchData();
  }

  _getEventIcon(event) {
    const iconMap = {
      device_status: 'mdi:server-network',
      ssid_change: 'mdi:wifi',
      client_connected: 'mdi:account-plus',
      client_disconnected: 'mdi:account-minus',
      firmware_update: 'mdi:update',
      alert: 'mdi:alert',
      security: 'mdi:shield-alert',
    };
    return iconMap[event.type] || 'mdi:information';
  }

  _getSeverityClass(severity) {
    return severity || 'info';
  }

  _formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    // Less than a minute
    if (diff < 60000) {
      return 'Just now';
    }

    // Less than an hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes}m ago`;
    }

    // Less than a day
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours}h ago`;
    }

    // Less than a week
    if (diff < 604800000) {
      const days = Math.floor(diff / 86400000);
      return `${days}d ago`;
    }

    // Format as date
    return date.toLocaleDateString();
  }

  _filterEvents() {
    let filtered = this._events;

    if (this._filterType !== 'all') {
      filtered = filtered.filter((e) => e.type === this._filterType);
    }

    if (this._filterSeverity !== 'all') {
      filtered = filtered.filter((e) => e.severity === this._filterSeverity);
    }

    return filtered;
  }

  _loadMore() {
    this._limit += 50;
    this.requestUpdate();
  }

  _changePage(delta) {
    this._currentPage += delta;
  }

  renderCard() {
    const filteredEvents = this._filterEvents();
    const eventsPerPage = this.config.events_per_page || 10;
    const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
    const startIdx = this._currentPage * eventsPerPage;
    const pageEvents = filteredEvents.slice(
      startIdx,
      startIdx + eventsPerPage
    );

    return html`
      <ha-card>
        <div class="events-header">
          <div class="events-title">
            <ha-icon icon="mdi:timeline-text"></ha-icon>
            <span>Network Events</span>
          </div>
          <div
            class="refresh-button"
            @click=${() => this.fetchData()}
            title="Refresh"
          >
            <ha-icon icon="mdi:refresh"></ha-icon>
          </div>
        </div>

        ${this.config.show_filters
          ? html`
              <div class="filters">
                <select
                  class="filter-select"
                  .value=${this._filterType}
                  @change=${(e) => {
                    this._filterType = e.target.value;
                    this._currentPage = 0;
                  }}
                >
                  <option value="all">All Types</option>
                  <option value="device_status">Device Status</option>
                  <option value="ssid_change">SSID Changes</option>
                  <option value="client_connected">Client Connected</option>
                  <option value="client_disconnected">
                    Client Disconnected
                  </option>
                  <option value="firmware_update">Firmware</option>
                  <option value="alert">Alerts</option>
                  <option value="security">Security</option>
                </select>

                <select
                  class="filter-select"
                  .value=${this._filterSeverity}
                  @change=${(e) => {
                    this._filterSeverity = e.target.value;
                    this._currentPage = 0;
                  }}
                >
                  <option value="all">All Severities</option>
                  <option value="critical">Critical</option>
                  <option value="warning">Warning</option>
                  <option value="info">Info</option>
                </select>
              </div>
            `
          : ''}
        ${filteredEvents.length === 0
          ? html`
              <div class="empty-state">
                <ha-icon icon="mdi:timeline-text-outline"></ha-icon>
                <div>No recent events</div>
                <div
                  style="font-size: 0.875rem; margin-top: 8px; color: var(--secondary-text-color);"
                >
                  Enable webhooks in the integration options to start receiving
                  network events and alerts.
                </div>
              </div>
            `
          : html`
              <div class="events-list">
                ${pageEvents.map(
                  (event) => html`
                    <div class="event-item">
                      <ha-icon
                        icon="${this._getEventIcon(event)}"
                        class="event-icon ${this._getSeverityClass(
                          event.severity
                        )}"
                      ></ha-icon>
                      <div class="event-content">
                        <div class="event-type">
                          ${event.type
                            .split('_')
                            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                            .join(' ')}
                        </div>
                        <div class="event-description">
                          ${event.description}
                        </div>
                        <div class="event-meta">
                          <div class="event-timestamp">
                            <ha-icon
                              icon="mdi:clock-outline"
                              style="--mdc-icon-size: 12px;"
                            ></ha-icon>
                            <span
                              >${this._formatTimestamp(event.timestamp)}</span
                            >
                          </div>
                          ${event.network
                            ? html`<span>· ${event.network}</span>`
                            : ''}
                          ${event.device
                            ? html`<span>· ${event.device}</span>`
                            : ''}
                          <span
                            class="severity-badge ${this._getSeverityClass(
                              event.severity
                            )}"
                          >
                            ${event.severity}
                          </span>
                        </div>
                      </div>
                    </div>
                  `
                )}
              </div>
              ${totalPages > 1
                ? html`
                    <div class="pagination">
                      <button
                        class="pagination-button"
                        ?disabled=${this._currentPage === 0}
                        @click=${() => this._changePage(-1)}
                        aria-label="Previous page"
                      >
                        <ha-icon icon="mdi:chevron-left"></ha-icon>
                      </button>
                      <span class="pagination-info"
                        >Page ${this._currentPage + 1} of ${totalPages}</span
                      >
                      <button
                        class="pagination-button"
                        ?disabled=${this._currentPage >= totalPages - 1}
                        @click=${() => this._changePage(1)}
                        aria-label="Next page"
                      >
                        <ha-icon icon="mdi:chevron-right"></ha-icon>
                      </button>
                    </div>
                  `
                : ''}
            `}
        ${this._renderDebugPanel()}
      </ha-card>
    `;
  }
}

customElements.define('meraki-events-card', MerakiEventsCard);

// Register card with Home Assistant
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'meraki-events-card',
  name: 'Meraki Events',
  description: 'Display recent network events and alerts with filtering',
  preview: true,
});

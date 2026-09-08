/**
 * Meraki MQTT Status Card
 *
 * Displays MQTT connection status, relay destinations, message statistics, and sensor counts.
 * Shows connection health and real-time messaging activity.
 */

import { html, css } from 'lit';
import { MerakiCardBase } from './shared/meraki-card-base.js';
import { merakiCardStyles } from './shared/styles.js';

export class MerakiMqttStatusCard extends MerakiCardBase {
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
        .status-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          cursor: pointer;
        }

        .status-icon {
          font-size: 2rem;
          flex-shrink: 0;
        }

        .status-info {
          flex: 1;
          min-width: 0;
        }

        .status-title {
          font-size: 1.1rem;
          font-weight: 500;
          margin: 0 0 4px 0;
        }

        .status-subtitle {
          font-size: 0.85rem;
          color: var(--secondary-text-color);
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

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 12px;
          margin-bottom: 16px;
        }

        .stat-card {
          background: var(--card-background-color, var(--ha-card-background));
          border: 1px solid var(--divider-color);
          border-radius: 8px;
          padding: 12px;
          text-align: center;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 500;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 0.75rem;
          color: var(--secondary-text-color);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .relay-section {
          margin-bottom: 16px;
        }

        .section-title {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--secondary-text-color);
          margin: 0 0 8px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .relay-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .relay-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: var(--card-background-color, var(--ha-card-background));
          border: 1px solid var(--divider-color);
          border-radius: 4px;
        }

        .relay-status {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .relay-status.connected {
          background: var(--meraki-success);
        }

        .relay-status.disconnected {
          background: var(--meraki-offline);
        }

        .relay-url {
          flex: 1;
          font-size: 0.85rem;
          font-family: var(--paper-font-code1_-_font-family, monospace);
        }

        .disabled-message {
          text-align: center;
          padding: 24px;
          color: var(--secondary-text-color);
        }
      `,
    ];
  }

  constructor() {
    super();
    this._collapsed = false;
  }

  setConfig(config) {
    this.config = {
      title: 'MQTT Status',
      show_relay_destinations: true,
      show_message_stats: true,
      show_sensor_count: true,
      collapsible: true,
      default_collapsed: false,
      auto_hide_when_disabled: false,
      ...config,
    };
    this._collapsed = this.config.default_collapsed;
  }

  async fetchData() {
    try {
      this._data = await this._callMerakiApi('meraki/get_mqtt_status', {
        config_entry_id: this.config.config_entry_id,
      });
    } catch (err) {
      // Error handled by base class
    }
  }

  handleUpdate(message) {
    if (message.type === 'mqtt_status_update') {
      this._data = { ...this._data, ...message.data };
      this.requestUpdate();
    }
  }

  _toggleCollapse() {
    this._collapsed = !this._collapsed;
  }

  renderCard() {
    // Default to showing enabled connected state if no data
    const mqttData = this._data || {
      enabled: true,
      connected: true,
      messages_received: 0,
      messages_sent: 0,
      sensors_monitored: 0,
      relay_destinations: [],
    };
    const isEnabled = mqttData.enabled !== false;
    const isConnected = mqttData.connected !== false;

    // Auto-hide if disabled and config option is set
    if (!isEnabled && this.config.auto_hide_when_disabled) {
      return html``;
    }

    // Get stats
    const messagesReceived = mqttData.messages_received || 0;
    const messagesSent = mqttData.messages_sent || 0;
    const sensorsMonitored = mqttData.sensors_monitored || 0;
    const relayDestinations = mqttData.relay_destinations || [];

    const statusIcon = isEnabled ? (isConnected ? '🟢' : '🔴') : '⚫';
    const statusText = isEnabled
      ? isConnected
        ? 'Connected'
        : 'Disconnected'
      : 'Disabled';

    return html`
      <ha-card>
        <div class="status-header" @click=${this._toggleCollapse}>
          <div class="status-icon">${statusIcon}</div>
          <div class="status-info">
            <div class="status-title">${this.config.title}</div>
            <div class="status-subtitle">${statusText}</div>
          </div>
          ${this.config.collapsible
            ? html`
                <button
                  class="collapse-button ${this._collapsed ? 'collapsed' : ''}"
                  aria-label="Toggle details"
                >
                  ▼
                </button>
              `
            : ''}
        </div>

        ${!isEnabled
          ? html`
              <div class="card-body ${this._collapsed ? 'collapsed' : ''}">
                <div class="disabled-message">
                  <div style="font-size: 2rem; margin-bottom: 8px;">📡</div>
                  <div>MQTT is disabled</div>
                  <div style="font-size: 0.85rem; margin-top: 8px;">
                    Enable MQTT in integration settings to receive real-time
                    sensor updates.
                  </div>
                </div>
              </div>
            `
          : html`
              <div class="card-body ${this._collapsed ? 'collapsed' : ''}">
                ${this.config.show_message_stats ||
                this.config.show_sensor_count
                  ? html`
                      <div class="stats-grid">
                        ${this.config.show_message_stats
                          ? html`
                              <div class="stat-card">
                                <div class="stat-value">
                                  ${messagesReceived}
                                </div>
                                <div class="stat-label">Received</div>
                              </div>
                              <div class="stat-card">
                                <div class="stat-value">${messagesSent}</div>
                                <div class="stat-label">Sent</div>
                              </div>
                            `
                          : ''}
                        ${this.config.show_sensor_count
                          ? html`
                              <div class="stat-card">
                                <div class="stat-value">
                                  ${sensorsMonitored}
                                </div>
                                <div class="stat-label">Sensors</div>
                              </div>
                            `
                          : ''}
                      </div>
                    `
                  : ''}
                ${this.config.show_relay_destinations &&
                relayDestinations.length > 0
                  ? html`
                      <div class="relay-section">
                        <div class="section-title">Relay Destinations</div>
                        <div class="relay-list">
                          ${relayDestinations.map(
                            (relay) => html`
                              <div class="relay-item">
                                <div
                                  class="relay-status ${relay.connected
                                    ? 'connected'
                                    : 'disconnected'}"
                                ></div>
                                <div class="relay-url">
                                  ${relay.host}:${relay.port}
                                </div>
                              </div>
                            `
                          )}
                        </div>
                      </div>
                    `
                  : ''}
              </div>
            `}
        ${this._renderDebugPanel()}
      </ha-card>
    `;
  }

  getCardSize() {
    return this._collapsed ? 1 : 3;
  }

  static getConfigElement() {
    return document.createElement('meraki-mqtt-status-card-editor');
  }

  static getStubConfig() {
    return {
      title: 'MQTT Status',
      show_relay_destinations: true,
      show_message_stats: true,
      show_sensor_count: true,
      collapsible: true,
      default_collapsed: false,
      auto_hide_when_disabled: false,
    };
  }
}

// Register the custom element
customElements.define('meraki-mqtt-status-card', MerakiMqttStatusCard);

// Register with Lovelace
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'meraki-mqtt-status-card',
  name: 'Meraki MQTT Status',
  description: 'Display MQTT connection status and statistics',
  documentationURL: 'https://github.com/liptonj/meraki-homeassistant',
});

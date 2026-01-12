/**
 * Meraki Switch Ports Card
 *
 * Visual switch port status grid.
 * Features: Port grid layout, status colors, PoE indicators, tooltips.
 */

import { html, css } from 'lit';
import { MerakiCardBase } from './shared/meraki-card-base.js';
import { MerakiEditorBase } from './shared/meraki-editor-base.js';
import { merakiCardStyles } from './shared/styles.js';

export class MerakiSwitchPortsCard extends MerakiCardBase {
  static get properties() {
    return {
      ...super.properties,
      _ports: { type: Array, state: true },
      _device: { type: Object, state: true },
      _hoveredPort: { type: String, state: true },
    };
  }

  static get styles() {
    return [
      merakiCardStyles,
      css`
        .switch-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          border-bottom: 1px solid var(--divider-color);
        }

        .switch-name {
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .switch-model {
          color: var(--secondary-text-color);
          font-size: 0.875rem;
        }

        .ports-container {
          padding: 16px;
        }

        .ports-grid {
          display: grid;
          gap: 4px;
        }

        .ports-grid.ports-24 {
          grid-template-columns: repeat(12, 1fr);
        }

        .ports-grid.ports-48 {
          grid-template-columns: repeat(12, 1fr);
        }

        .port {
          position: relative;
          aspect-ratio: 1;
          min-width: 24px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s;
          font-size: 0.625rem;
          font-weight: 500;
          color: white;
        }

        .port:hover {
          transform: scale(1.1);
          z-index: 1;
        }

        .port.connected {
          background: var(--meraki-success);
        }

        .port.disconnected {
          background: var(--divider-color);
          color: var(--secondary-text-color);
        }

        .port.disabled {
          background: var(--meraki-offline);
          color: var(--secondary-text-color);
        }

        .port.error {
          background: var(--meraki-error);
        }

        .port.uplink {
          border: 2px solid var(--primary-color);
        }

        .poe-indicator {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 8px;
          height: 8px;
          background: var(--meraki-warning);
          border-radius: 50%;
          border: 1px solid var(--card-background-color);
        }

        .tooltip {
          position: fixed;
          background: var(--primary-background-color);
          border: 1px solid var(--divider-color);
          border-radius: 8px;
          padding: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          min-width: 200px;
          pointer-events: none;
        }

        .tooltip-header {
          font-weight: 500;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .tooltip-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
          padding: 4px 0;
        }

        .tooltip-label {
          color: var(--secondary-text-color);
        }

        .legend {
          display: flex;
          gap: 16px;
          padding: 16px;
          border-top: 1px solid var(--divider-color);
          flex-wrap: wrap;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          color: var(--secondary-text-color);
        }

        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 2px;
        }

        .legend-color.connected {
          background: var(--meraki-success);
        }

        .legend-color.disconnected {
          background: var(--divider-color);
        }

        .legend-color.disabled {
          background: var(--meraki-offline);
        }

        .legend-color.uplink {
          background: transparent;
          border: 2px solid var(--primary-color);
        }

        .compact .switch-header {
          padding: 12px;
        }

        .compact .ports-container {
          padding: 8px;
        }

        .compact .port {
          min-width: 16px;
          font-size: 0;
        }

        .compact .legend {
          display: none;
        }

        .port-row-label {
          grid-column: 1 / -1;
          font-size: 0.75rem;
          color: var(--secondary-text-color);
          padding: 8px 0 4px;
        }
      `,
    ];
  }

  static getStubConfig() {
    return {
      device_serial: '',
      show_poe: true,
      show_speed: true,
      show_labels: true,
      compact: false,
    };
  }

  static getConfigForm() {
    return {
      schema: [
        { name: 'config_entry_id', required: true, selector: { text: {} } },
        { name: 'device_serial', required: true, selector: { text: {} } },
        { name: 'show_poe', selector: { boolean: {} } },
        { name: 'show_speed', selector: { boolean: {} } },
        { name: 'show_labels', selector: { boolean: {} } },
        { name: 'compact', selector: { boolean: {} } },
      ],
    };
  }

  constructor() {
    super();
    this._ports = [];
    this._device = null;
    this._hoveredPort = null;
    this._tooltipPosition = { x: 0, y: 0 };
  }

  getCardSize() {
    return this.config?.compact ? 2 : 4;
  }

  getGridOptions() {
    return this.config?.compact
      ? { rows: 2, columns: 6, min_rows: 2 }
      : { rows: 4, columns: 6, min_rows: 3 };
  }

  setConfig(config) {
    if (!config.device_serial) {
      throw new Error('device_serial is required');
    }
    super.setConfig(config);
  }

  async fetchData() {
    try {
      this._device = await this._callMerakiApi('meraki/get_device', {
        serial: this.config.device_serial,
      });

      const portsData = await this._callMerakiApi('meraki/get_switch_ports');

      this._ports = (portsData || []).filter(
        (p) => p.serial === this.config.device_serial || !p.serial
      );

      if (this._ports.length === 0) {
        this._ports = this._generateMockPorts();
      }
    } catch (err) {
      // Error handled by base class
    }
  }

  _generateMockPorts() {
    const model = this._device?.model?.toUpperCase() || '';
    let portCount = 24;

    if (model.includes('48')) {
      portCount = 48;
    } else if (model.includes('12')) {
      portCount = 12;
    } else if (model.includes('8')) {
      portCount = 8;
    }

    return Array.from({ length: portCount }, (_, i) => ({
      portId: String(i + 1),
      name: `Port ${i + 1}`,
      enabled: true,
      status: i % 3 === 0 ? 'Connected' : 'Disconnected',
      poeEnabled: i % 2 === 0,
      speed: '1 Gbps',
      duplex: 'full',
      isUplink: i >= portCount - 2,
    }));
  }

  handleUpdate(message) {
    if (message) {
      this.fetchData();
    }
  }

  _getPortClass(port) {
    const classes = ['port'];

    if (!port.enabled) {
      classes.push('disabled');
    } else if (port.errors && port.errors.length > 0) {
      classes.push('error');
    } else if (port.status === 'Connected' || port.status === 'connected') {
      classes.push('connected');
    } else {
      classes.push('disconnected');
    }

    if (port.isUplink || port.type === 'uplink') {
      classes.push('uplink');
    }

    return classes.join(' ');
  }

  _handlePortHover(e, port) {
    this._hoveredPort = port;
    const rect = e.target.getBoundingClientRect();
    this._tooltipPosition = {
      x: rect.left + rect.width / 2,
      y: rect.bottom + 8,
    };
    this.requestUpdate();
  }

  _handlePortLeave() {
    this._hoveredPort = null;
  }

  async _handlePortClick(port) {
    const enabled = !port.enabled;
    try {
      await this._callMerakiApi('meraki/set_switch_port', {
        serial: this.config.device_serial,
        port_id: port.portId,
        enabled,
      });
      const portIndex = this._ports.findIndex((p) => p.portId === port.portId);
      if (portIndex >= 0) {
        this._ports = [
          ...this._ports.slice(0, portIndex),
          { ...this._ports[portIndex], enabled },
          ...this._ports.slice(portIndex + 1),
        ];
      }
    } catch (err) {
      // Error shown by base class
    }
  }

  _getPortCount() {
    return this._ports.length;
  }

  renderCard() {
    if (!this._device) {
      return html`
        <ha-card>
          <div class="card-content">Switch not found</div>
        </ha-card>
      `;
    }

    const config = this.config || {};
    const isCompact = config.compact === true;
    const showLabels = config.show_labels !== false && !isCompact;
    const showPoe = config.show_poe !== false;
    const portCount = this._getPortCount();

    return html`
      <ha-card class="${isCompact ? 'compact' : ''}">
        <div class="switch-header">
          <div class="switch-name">
            <ha-icon icon="mdi:lan"></ha-icon>
            ${this._device.name || this._device.serial}
          </div>
          <span class="switch-model">${this._device.model || 'Switch'}</span>
        </div>

        <div class="ports-container">
          ${this._renderPortGrid(portCount, showLabels, showPoe)}
        </div>

        ${!isCompact ? this._renderLegend() : ''}
        ${this._hoveredPort ? this._renderTooltip() : ''}
      </ha-card>
    `;
  }

  _renderPortGrid(portCount, showLabels, showPoe) {
    const gridClass = portCount > 24 ? 'ports-48' : 'ports-24';

    if (portCount > 24) {
      const row1 = this._ports.filter((_, i) => i < 24);
      const row2 = this._ports.filter((_, i) => i >= 24);

      return html`
        <div class="ports-grid ${gridClass}">
          ${showLabels ? html`<div class="port-row-label">Ports 1-24</div>` : ''}
          ${row1.map((port) => this._renderPort(port, showLabels, showPoe))}
          ${showLabels ? html`<div class="port-row-label">Ports 25-48</div>` : ''}
          ${row2.map((port) => this._renderPort(port, showLabels, showPoe))}
        </div>
      `;
    }

    return html`
      <div class="ports-grid ${gridClass}">
        ${this._ports.map((port) => this._renderPort(port, showLabels, showPoe))}
      </div>
    `;
  }

  _renderPort(port, showLabels, showPoe) {
    const hasPoe = showPoe && (port.poeEnabled || port.poe?.isAllocated);

    return html`
      <div
        class="${this._getPortClass(port)}"
        @mouseenter=${(e) => this._handlePortHover(e, port)}
        @mouseleave=${this._handlePortLeave}
        @click=${() => this._handlePortClick(port)}
        role="button"
        tabindex="0"
        aria-label="Port ${port.portId}: ${port.status || 'Unknown'}"
      >
        ${showLabels ? port.portId : ''}
        ${hasPoe ? html`<div class="poe-indicator" title="PoE Active"></div>` : ''}
      </div>
    `;
  }

  _renderLegend() {
    return html`
      <div class="legend">
        <div class="legend-item">
          <div class="legend-color connected"></div>
          Connected
        </div>
        <div class="legend-item">
          <div class="legend-color disconnected"></div>
          Disconnected
        </div>
        <div class="legend-item">
          <div class="legend-color disabled"></div>
          Disabled
        </div>
        <div class="legend-item">
          <div class="legend-color uplink"></div>
          Uplink
        </div>
      </div>
    `;
  }

  _renderTooltip() {
    const port = this._hoveredPort;
    const config = this.config || {};
    const showSpeed = config.show_speed !== false;
    const showPoe = config.show_poe !== false;

    return html`
      <div
        class="tooltip"
        style="left: ${this._tooltipPosition.x}px; top: ${this._tooltipPosition.y}px; transform: translateX(-50%);"
      >
        <div class="tooltip-header">
          <ha-icon icon="mdi:ethernet"></ha-icon>
          Port ${port.portId}
        </div>
        <div class="tooltip-row">
          <span class="tooltip-label">Name</span>
          <span>${port.name || `Port ${port.portId}`}</span>
        </div>
        <div class="tooltip-row">
          <span class="tooltip-label">Status</span>
          <span>${port.status || 'Unknown'}</span>
        </div>
        ${port.enabled !== undefined
          ? html`
              <div class="tooltip-row">
                <span class="tooltip-label">Enabled</span>
                <span>${port.enabled ? 'Yes' : 'No'}</span>
              </div>
            `
          : ''}
        ${showSpeed && port.speed
          ? html`
              <div class="tooltip-row">
                <span class="tooltip-label">Speed</span>
                <span>${port.speed}</span>
              </div>
            `
          : ''}
        ${port.duplex
          ? html`
              <div class="tooltip-row">
                <span class="tooltip-label">Duplex</span>
                <span>${port.duplex}</span>
              </div>
            `
          : ''}
        ${showPoe
          ? html`
              <div class="tooltip-row">
                <span class="tooltip-label">PoE</span>
                <span>${port.poeEnabled ? 'Enabled' : 'Disabled'}</span>
              </div>
            `
          : ''}
        ${port.clientMac
          ? html`
              <div class="tooltip-row">
                <span class="tooltip-label">Client</span>
                <span>${port.clientMac}</span>
              </div>
            `
          : ''}
      </div>
    `;
  }
}

export class MerakiSwitchPortsCardEditor extends MerakiEditorBase {
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
        <label for="device_serial">Switch Serial (required)</label>
        <ha-textfield
          id="device_serial"
          .value=${config.device_serial || ''}
          .configValue=${'device_serial'}
          @input=${this._valueChanged}
          placeholder="XXXX-XXXX-XXXX"
          required
        ></ha-textfield>
      </div>
      <div class="switch-row">
        <label>Show PoE Indicators</label>
        <ha-switch
          .checked=${config.show_poe !== false}
          .configValue=${'show_poe'}
          @change=${this._valueChanged}
        ></ha-switch>
      </div>
      <div class="switch-row">
        <label>Show Speed Info</label>
        <ha-switch
          .checked=${config.show_speed !== false}
          .configValue=${'show_speed'}
          @change=${this._valueChanged}
        ></ha-switch>
      </div>
      <div class="switch-row">
        <label>Show Port Labels</label>
        <ha-switch
          .checked=${config.show_labels !== false}
          .configValue=${'show_labels'}
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

customElements.define('meraki-switch-ports-card', MerakiSwitchPortsCard);
customElements.define('meraki-switch-ports-card-editor', MerakiSwitchPortsCardEditor);

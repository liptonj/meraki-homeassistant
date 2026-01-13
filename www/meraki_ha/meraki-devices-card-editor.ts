
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';

@customElement('meraki-devices-card-editor')
export class MerakiDevicesCardEditor extends LitElement {
  @property({ attribute: false })
  private hass!: HomeAssistant;

  @property({ attribute: false })
  private config!: any;

  static styles = css`
    .card-config {
      display: flex;
      flex-direction: column;
    }
    .card-config > * {
      margin-bottom: 10px;
    }
  `;

  public setConfig(config: any): void {
    this.config = config;
  }

  protected render(): unknown {
    if (!this.hass || !this.config) {
      return html``;
    }

    const deviceTypes = ['switch', 'wireless', 'camera', 'sensor', 'appliance'];

    return html`
      <div class="card-config">
        <paper-input
          label="Title"
          .value="${this.config.title}"
          .configValue="${'title'}"
          @value-changed="${this._valueChanged}"
        ></paper-input>
        <paper-input
          label="Network ID"
          .value="${this.config.network_id}"
          .configValue="${'network_id'}"
          @value-changed="${this._valueChanged}"
        ></paper-input>
        <paper-dropdown-menu label="View Mode">
          <paper-listbox
            slot="dropdown-content"
            .selected="${this.config.view_mode}"
            .configValue="${'view_mode'}"
            @iron-select="${this._valueChanged}"
          >
            <paper-item>network</paper-item>
            <paper-item>type</paper-item>
          </paper-listbox>
        </paper-dropdown-menu>
        <paper-dropdown-menu label="Status Filter">
          <paper-listbox
            slot="dropdown-content"
            .selected="${this.config.status_filter}"
            .configValue="${'status_filter'}"
            @iron-select="${this._valueChanged}"
          >
            <paper-item>all</paper-item>
            <paper-item>online</paper-item>
            <paper-item>offline</paper-item>
            <paper-item>alerting</paper-item>
            <paper-item>dormant</paper-item>
          </paper-listbox>
        </paper-dropdown-menu>
        <div>
          Device Types:
          ${deviceTypes.map(
            (type) => html`
              <ha-checkbox
                .checked="${this.config.device_types.includes(type)}"
                .value="${type}"
                @change="${this._deviceTypesChanged}"
              >${type}</ha-checkbox>
            `
          )}
        </div>
        <ha-switch
          .checked="${this.config.collapsible}"
          .configValue="${'collapsible'}"
          @change="${this._valueChanged}"
        >Collapsible</ha-switch>
        <ha-switch
          .checked="${this.config.default_collapsed}"
          .configValue="${'default_collapsed'}"
          @change="${this._valueChanged}"
        >Default Collapsed</ha-switch>
        <ha-switch
          .checked="${this.config.show_filters}"
          .configValue="${'show_filters'}"
          @change="${this._valueChanged}"
        >Show Filters</ha-switch>
        <ha-switch
          .checked="${this.config.compact}"
          .configValue="${'compact'}"
          @change="${this._valueChanged}"
        >Compact</ha-switch>
      </div>
    `;
  }

  private _deviceTypesChanged(e: any): void {
    if (!this.config || !this.hass) {
      return;
    }
    const { target } = e;
    let deviceTypes = this.config.device_types || [];
    if (target.checked) {
      deviceTypes.push(target.value);
    } else {
      deviceTypes = deviceTypes.filter((type: string) => type !== target.value);
    }
    this.config = {
      ...this.config,
      device_types: deviceTypes,
    };
    const event = new CustomEvent('config-changed', {
      bubbles: true,
      composed: true,
      detail: { config: this.config },
    });
    this.dispatchEvent(event);
  }

  private _valueChanged(e: any): void {
    if (!this.config || !this.hass) {
      return;
    }
    const { target } = e;
    if (this[target.configValue] === target.value) {
      return;
    }
    if (target.configValue) {
      if (target.value === '') {
        delete this.config[target.configValue];
      } else {
        this.config = {
          ...this.config,
          [target.configValue]: target.value,
        };
      }
    }
    const event = new CustomEvent('config-changed', {
      bubbles: true,
      composed: true,
      detail: { config: this.config },
    });
    this.dispatchEvent(event);
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, LovelaceCardEditor, fireEvent } from 'custom-card-helpers';

@customElement('meraki-ssid-card')
export class MerakiSSIDCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config?: any;
  @state() private _showPsk = false;

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import('./meraki-ssid-card-editor');
    return document.createElement('meraki-ssid-card-editor');
  }

  public static getStubConfig(): any {
    return {
      network_id: '',
      ssid_number: 0,
      show_psk: true,
      show_clients: true,
      show_toggle: true,
    };
  }

  public setConfig(config: any): void {
    if (!config.network_id || config.ssid_number === undefined) {
      throw new Error('You need to define network_id and ssid_number');
    }
    this._config = config;
  }

  private _togglePsk(): void {
    this._showPsk = !this._showPsk;
  }

  private _toggleSSID(e: any): void {
    const entityId = e.target.entityId;
    this.hass.callService('switch', 'toggle', {
      entity_id: entityId,
    });
  }

  protected render() {
    if (!this._config || !this.hass) {
      return html``;
    }

    const { network_id, ssid_number } = this._config;
    const ssidPrefix = `sensor.meraki_${network_id.replace(/-/g, '_')}_ssid_${ssid_number}`;

    const name = this.hass.states[`${ssidPrefix}_name`]?.state || 'Unknown SSID';
    const enabled = this.hass.states[`switch.meraki_${network_id.replace(/-/g, '_')}_ssid_${ssid_number}_enabled`];
    const clientCount = this.hass.states[`${ssidPrefix}_client_count`]?.state || '0';
    const psk = this.hass.states[`${ssidPrefix}_psk`]?.state || '********';
    const authMode = this.hass.states[`${ssidPrefix}_auth_mode`]?.state || 'Unknown';
    const vlan = this.hass.states[`${ssidPrefix}_vlan`]?.state || 'Unknown';
    const band = this.hass.states[`${ssidPrefix}_band`]?.state || 'Unknown';


    return html`
      <ha-card .header=${name}>
        <div class="card-content">
          ${this._config.show_toggle ? html`
            <div class="row">
              <ha-switch
                .checked=${enabled?.state === 'on'}
                .entityId=${enabled?.entity_id}
                @change=${this._toggleSSID}
              ></ha-switch>
              <span>${enabled?.state === 'on' ? 'Enabled' : 'Disabled'}</span>
            </div>
          ` : ''}
          ${this._config.show_clients ? html`<div class="row"><span>Clients:</span> <span>${clientCount}</span></div>` : ''}
          <div class="row"><span>Auth Mode:</span> <span>${authMode}</span></div>
          <div class="row"><span>VLAN:</span> <span>${vlan}</span></div>
          <div class="row"><span>Band:</span> <span>${band}</span></div>
          ${this._config.show_psk ? html`
            <div class="row">
              <span>PSK:</span>
              <span>${this._showPsk ? psk : '********'}</span>
              <ha-icon-button @click=${this._togglePsk} .icon=${this._showPsk ? 'mdi:eye-off' : 'mdi:eye'}></ha-icon-button>
            </div>
          ` : ''}
        </div>
      </ha-card>
    `;
  }

  static styles = css`
    .row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
    }
  `;
}

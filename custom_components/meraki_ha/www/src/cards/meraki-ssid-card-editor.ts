/* eslint-disable @typescript-eslint/no-explicit-any */
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, LovelaceCardEditor, fireEvent } from 'custom-card-helpers';

@customElement('meraki-ssid-card-editor')
export class MerakiSSIDCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: any;

  public setConfig(config: any): void {
    this._config = config;
  }

  get _network_id(): string {
    return this._config?.network_id || '';
  }

  get _ssid_number(): number {
    return this._config?.ssid_number ?? 0;
  }

  get _show_psk(): boolean {
    return this._config?.show_psk ?? true;
  }

  get _show_clients(): boolean {
    return this._config?.show_clients ?? true;
  }

  get _show_toggle(): boolean {
    return this._config?.show_toggle ?? true;
  }

  protected render() {
    if (!this.hass || !this._config) {
      return html``;
    }

    const schema = [
      { name: 'network_id', selector: { text: {} } },
      { name: 'ssid_number', selector: { number: { min: 0, max: 14, mode: 'slider' } } },
      { name: 'show_psk', selector: { boolean: {} } },
      { name: 'show_clients', selector: { boolean: {} } },
      { name: 'show_toggle', selector: { boolean: {} } },
    ];

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${schema}
        .computeLabel=${(s: { name: string }) => s.name}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  private _valueChanged(ev: CustomEvent): void {
    const config = ev.detail.value;
    fireEvent(this, 'config-changed', { config });
  }

  static styles = css`
    :host {
      display: block;
    }
  `;
}

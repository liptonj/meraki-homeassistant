
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import React from 'react';
import ReactDOM from 'react-dom';
import MerakiMqttStatusCardComponent from '../src/components/cards/MerakiMqttStatusCard';
import MerakiMqttStatusCardEditor from '../src/components/card_editors/MerakiMqttStatusCardEditor';


@customElement('meraki-mqtt-status-card')
export class MerakiMqttStatusCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) private _config: any;

  public setConfig(config: any): void {
    if (!config) {
      throw new Error('Invalid configuration');
    }
    this._config = config;
  }

  public static async getConfigElement() {
    return document.createElement('meraki-mqtt-status-card-editor');
  }

  protected updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);
    if (changedProperties.has('hass') || changedProperties.has('_config')) {
      this._renderReact();
    }
  }

  private _renderReact() {
    if (!this._config || !this.hass) {
      return;
    }
    const mqttDataEntity = this._config.entity ? this.hass.states[this._config.entity] : undefined;
    const mqttData = mqttDataEntity ? mqttDataEntity.attributes : { enabled: false };

    const props = {
      hass: this.hass,
      config: this._config,
      mqttData: mqttData,
    };

    ReactDOM.render(React.createElement(MerakiMqttStatusCardComponent, props), this.shadowRoot.getElementById('react-root'));
  }

  protected render() {
    return html`<div id="react-root"></div>`;
  }
}

@customElement('meraki-mqtt-status-card-editor')
export class MerakiMqttStatusCardEditorElement extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) private _config: any;

  public setConfig(config: any): void {
    this._config = config;
  }

  protected updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);
    if (changedProperties.has('_config')) {
      this._renderReact();
    }
  }

  private _renderReact() {
    const props = {
      hass: this.hass,
      config: this._config,
      setConfig: (config: any) => {
        this._config = config;
        this.dispatchEvent(new CustomEvent('config-changed', { detail: { config } }));
      },
    };

    ReactDOM.render(React.createElement(MerakiMqttStatusCardEditor, props), this.shadowRoot.getElementById('react-root'));
  }

  protected render() {
    return html`<div id="react-root"></div>`;
  }
}

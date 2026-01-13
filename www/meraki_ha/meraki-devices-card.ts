
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import React from 'react';
import ReactDOM from 'react-dom';
import MerakiDevicesCard from '../src/components/MerakiDevicesCard';
import { HomeAssistant } from 'custom-card-helpers';

import './meraki-devices-card-editor';

@customElement('meraki-devices-card')
export class MerakiDevicesCard extends LitElement {
  @property({ attribute: false })
  private hass!: HomeAssistant;

  @property({ attribute: false })
  private config!: any;

  static styles = css`
    :host {
      display: block;
    }
  `;

  public static async getConfigElement() {
    return document.createElement('meraki-devices-card-editor');
  }

  public static getStubConfig() {
    return {
      title: 'Meraki Devices',
      view_mode: 'network',
      device_types: ['switch', 'wireless', 'camera', 'sensor', 'appliance'],
      status_filter: 'all',
      collapsible: true,
      default_collapsed: false,
      show_filters: true,
      compact: false,
    };
  }

  public setConfig(config: any): void {
    if (!config) {
      throw new Error('Invalid configuration');
    }
    this.config = config;
  }

  protected render(): unknown {
    if (!this.hass || !this.config) {
      return html``;
    }

    return html`<div id="root"></div>`;
  }

  updated(changedProperties: any) {
    super.updated(changedProperties);
    if (this.shadowRoot) {
        const root = this.shadowRoot.getElementById('root');
        if (root) {
            ReactDOM.render(React.createElement(MerakiDevicesCard, { hass: this.hass, config: this.config }), root);
        }
    }
  }
}

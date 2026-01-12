
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import React from 'react';
import ReactDOM from 'react-dom';
import MerakiCameraCard from './meraki-camera-card';
import MerakiCameraCardEditor from './meraki-camera-card-editor';

@customElement('meraki-camera-card')
export class MerakiCameraCard extends LitElement {
  @property({ attribute: false }) private hass: any;
  @property({ attribute: false }) private config: any;

  static getConfigElement() {
    return document.createElement('meraki-camera-card-editor');
  }

  static getStubConfig() {
    return { entity_id: 'camera.meraki_camera' };
  }

  setConfig(config: any) {
    if (!config.entity_id) {
      throw new Error('You need to define an entity_id');
    }
    this.config = config;
  }

  render() {
    return html`<div id="root"></div>`;
  }

  updated(changedProperties: any) {
    if (changedProperties.has('hass') || changedProperties.has('config')) {
      this.renderReact();
    }
  }

  private renderReact() {
    ReactDOM.render(
      React.createElement(MerakiCameraCard, { hass: this.hass, config: this.config }),
      this.shadowRoot.getElementById('root')
    );
  }

  static styles = css`
    :host {
      display: block;
    }
  `;
}

@customElement('meraki-camera-card-editor')
export class MerakiCameraCardEditor extends LitElement {
  @property({ attribute: false }) private hass: any;
  @property({ attribute: false }) private config: any;

  setConfig(config: any) {
    this.config = config;
  }

  configChanged(newConfig: any) {
    const event = new Event('config-changed', {
      bubbles: true,
      composed: true,
    });
    (event as any).detail = { config: newConfig };
    this.dispatchEvent(event);
  }

  render() {
    return html`<div id="root"></div>`;
  }

  updated(changedProperties: any) {
    if (changedProperties.has('hass') || changedProperties.has('config')) {
      this.renderReact();
    }
  }

  private renderReact() {
    ReactDOM.render(
      React.createElement(MerakiCameraCardEditor, {
        hass: this.hass,
        config: this.config,
        setConfig: this.configChanged.bind(this),
      }),
      this.shadowRoot.getElementById('root')
    );
  }
}

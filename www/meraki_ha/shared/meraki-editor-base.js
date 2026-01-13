import { LitElement, html } from 'lit';

export class MerakiEditorBase extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      config: { type: Object },
    };
  }

  setConfig(config) {
    this.config = config;
  }

  _valueChanged(ev) {
    if (!this.config || !this.hass) {
      return;
    }
    const { target } = ev;
    const newConfig = { ...this.config };

    if (target.configValue) {
      if (target.value === "") {
        delete newConfig[target.configValue];
      } else {
        newConfig[target.configValue] = target.checked !== undefined ? target.checked : target.value;
      }
    }

    this._configChanged(newConfig);
  }

  _configChanged(newConfig) {
    const event = new Event('config-changed', {
      bubbles: true,
      composed: true,
    });
    event.detail = { config: newConfig };
    this.dispatchEvent(event);
  }

  render() {
    if (!this.hass) {
      return html``;
    }

    return this.renderForm();
  }

  renderForm() {
    // To be implemented by subclasses
    return html``;
  }
}

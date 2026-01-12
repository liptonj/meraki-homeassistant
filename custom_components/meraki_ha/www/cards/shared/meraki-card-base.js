import { LitElement, html } from 'lit';
import { merakiCardStyles } from './styles.js';

export class MerakiCardBase extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      config: { type: Object },
      _data: { type: Object, state: true },
      _loading: { type:Boolean, state: true },
      _error: { type: String, state: true },
    };
  }

  static get styles() {
    return merakiCardStyles;
  }

  constructor() {
    super();
    this._loading = true;
    this._error = null;
    this._data = {};
  }

  setConfig(config) {
    if (!config.config_entry_id) {
      throw new Error("config_entry_id must be specified");
    }
    this.config = config;
    this.fetchData();
  }

  get hass() {
    return this._hass;
  }

  set hass(hass) {
    this._hass = hass;
    if (this.config && !this.subscription) {
      this._subscribeToUpdates();
    }
  }

  async _callMerakiApi(command, params = {}) {
    if (!this.hass) {
      throw new Error("Home Assistant connection not available.");
    }
    try {
      this._loading = true;
      this._error = null;
      const result = await this.hass.connection.sendMessagePromise({
        type: command,
        config_entry_id: this.config.config_entry_id,
        ...params,
      });
      this._loading = false;
      return result;
    } catch (err) {
      this._loading = false;
      this._error = err.message || 'Unknown error';
      throw err;
    }
  }

  _subscribeToUpdates() {
    if (this.subscription) {
      this.subscription(); // Unsubscribe
    }
    this.subscription = this.hass.connection.subscribeMessage(
      (message) => this.handleUpdate(message),
      {
        type: 'meraki/subscribe_updates',
        config_entry_id: this.config.config_entry_id,
      }
    );
  }

  handleUpdate(message) {
    // To be implemented by subclasses
  }

  fetchData() {
    // To be implemented by subclasses
  }

  render() {
    if (this._loading) {
      return html`
        <ha-card>
          <div class="loading">
            <ha-circular-progress active></ha-circular-progress>
          </div>
        </ha-card>
      `;
    }

    if (this._error) {
      return html`
        <ha-card>
          <div class="error">
            Error: ${this._error}
          </div>
        </ha-card>
      `;
    }

    return this.renderCard();
  }

  renderCard() {
    // To be implemented by subclasses
    return html``;
  }

  getCardSize() {
    return 3;
  }
}

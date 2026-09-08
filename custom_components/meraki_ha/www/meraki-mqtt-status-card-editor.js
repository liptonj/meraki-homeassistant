/**
 * Meraki MQTT Status Card Editor
 *
 * Configuration editor for the MQTT Status Card
 */

import { html, css } from 'lit';
import { MerakiEditorBase } from './shared/meraki-editor-base.js';
import {
  renderConfigEntrySelector,
  renderToggleOption,
} from './shared/editor-helpers.js';

export class MerakiMqttStatusCardEditor extends MerakiEditorBase {
  static get styles() {
    return css`
      .form-container {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 16px;
      }

      .section {
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        padding: 16px;
      }

      .section-title {
        font-weight: 500;
        margin: 0 0 12px 0;
        color: var(--primary-text-color);
        font-size: 1rem;
      }

      .form-row {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 12px;
      }

      .toggle-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid var(--divider-color);
      }

      .toggle-row:last-child {
        border-bottom: none;
      }

      ha-textfield {
        width: 100%;
      }

      ha-selector {
        width: 100%;
      }
    `;
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
  }

  renderForm() {
    const config = this.config || {};

    return html`
      <div class="form-container">
        <!-- Basic Configuration -->
        <div class="section">
          <h3 class="section-title">Basic Configuration</h3>

          <div class="form-row">
            <label for="title">Title</label>
            <ha-textfield
              id="title"
              .value=${config.title || ''}
              .configValue=${'title'}
              @input=${this._valueChanged}
              placeholder="MQTT Status"
            ></ha-textfield>
          </div>

          ${renderConfigEntrySelector(
            this.hass,
            config.config_entry_id,
            this._handleConfigEntryChanged.bind(this)
          )}
        </div>

        <!-- Display Options -->
        <div class="section">
          <h3 class="section-title">Display Options</h3>

          ${renderToggleOption(
            'Show Relay Destinations',
            config.show_relay_destinations !== false,
            'show_relay_destinations',
            this._valueChanged.bind(this),
            'Display list of MQTT relay destinations'
          )}
          ${renderToggleOption(
            'Show Message Statistics',
            config.show_message_stats !== false,
            'show_message_stats',
            this._valueChanged.bind(this),
            'Display message count statistics'
          )}
          ${renderToggleOption(
            'Show Sensor Count',
            config.show_sensor_count !== false,
            'show_sensor_count',
            this._valueChanged.bind(this),
            'Display number of monitored sensors'
          )}
          ${renderToggleOption(
            'Collapsible',
            config.collapsible !== false,
            'collapsible',
            this._valueChanged.bind(this),
            'Allow collapsing the card details'
          )}
          ${renderToggleOption(
            'Default Collapsed',
            config.default_collapsed === true,
            'default_collapsed',
            this._valueChanged.bind(this),
            'Start with details collapsed'
          )}
          ${renderToggleOption(
            'Auto Hide When Disabled',
            config.auto_hide_when_disabled === true,
            'auto_hide_when_disabled',
            this._valueChanged.bind(this),
            'Automatically hide card when MQTT is disabled'
          )}
        </div>
      </div>
    `;
  }

  _handleConfigEntryChanged(ev) {
    if (!this.config || !this.hass) return;
    const newConfig = { ...this.config };
    newConfig.config_entry_id = ev.detail.value;
    this._configChanged(newConfig);
  }
}

// Register the custom element
customElements.define(
  'meraki-mqtt-status-card-editor',
  MerakiMqttStatusCardEditor
);

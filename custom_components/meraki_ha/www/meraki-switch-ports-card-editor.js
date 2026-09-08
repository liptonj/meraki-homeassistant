/**
 * Meraki Switch Ports Card Editor
 *
 * Configuration editor for the Switch Ports Card
 */

import { html, css } from 'lit';
import { MerakiEditorBase } from './shared/meraki-editor-base.js';
import {
  renderConfigEntrySelector,
  renderToggleOption,
  renderTextInput,
} from './shared/editor-helpers.js';

export class MerakiSwitchPortsCardEditor extends MerakiEditorBase {
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

      .help-text {
        font-size: 0.75rem;
        color: var(--secondary-text-color);
        line-height: 1.4;
      }
    `;
  }

  setConfig(config) {
    this.config = {
      title: 'Switch Ports',
      show_poe_status: true,
      compact_view: false,
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
              placeholder="Switch Ports"
            ></ha-textfield>
          </div>

          ${renderConfigEntrySelector(
            this.hass,
            config.config_entry_id,
            this._handleConfigEntryChanged.bind(this)
          )}

          <div class="form-row">
            <label for="device_serial">Device Serial</label>
            <ha-textfield
              id="device_serial"
              .value=${config.device_serial || ''}
              .configValue=${'device_serial'}
              @input=${this._valueChanged}
              placeholder="XXXX-XXXX-XXXX"
            ></ha-textfield>
            <div class="help-text">
              Serial number of the switch device to display ports for
            </div>
          </div>
        </div>

        <!-- Display Options -->
        <div class="section">
          <h3 class="section-title">Display Options</h3>

          ${renderToggleOption(
            'Show PoE Status',
            config.show_poe_status !== false,
            'show_poe_status',
            this._valueChanged.bind(this),
            'Display PoE power status for each port'
          )}
          ${renderToggleOption(
            'Compact View',
            config.compact_view === true,
            'compact_view',
            this._valueChanged.bind(this),
            'Show smaller port display for better overview'
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
  'meraki-switch-ports-card-editor',
  MerakiSwitchPortsCardEditor
);

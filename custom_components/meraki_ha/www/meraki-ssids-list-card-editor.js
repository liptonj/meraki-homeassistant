/**
 * Meraki SSID List Card Editor
 *
 * Configuration editor for the SSID List Card
 */

import { html, css } from 'lit';
import { MerakiEditorBase } from './shared/meraki-editor-base.js';
import {
  renderConfigEntrySelector,
  renderToggleOption,
} from './shared/editor-helpers.js';

export class MerakiSSIDsListCardEditor extends MerakiEditorBase {
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

      .toggle-label {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .toggle-label span {
        font-weight: 500;
        font-size: 0.875rem;
        color: var(--primary-text-color);
      }

      .help-text {
        font-size: 0.75rem;
        color: var(--secondary-text-color);
        line-height: 1.4;
      }

      ha-textfield {
        width: 100%;
      }

      ha-selector {
        width: 100%;
      }

      ha-switch {
        flex-shrink: 0;
      }
    `;
  }

  setConfig(config) {
    this.config = {
      title: 'SSIDs',
      show_filter: true,
      show_client_count: true,
      show_toggle: true,
      collapsed_by_default: false,
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
              placeholder="SSIDs"
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
            'Show Search Filter',
            config.show_filter !== false,
            'show_filter',
            this._valueChanged.bind(this),
            'Display search/filter bar at the top'
          )}
          ${renderToggleOption(
            'Show Client Count',
            config.show_client_count !== false,
            'show_client_count',
            this._valueChanged.bind(this),
            'Display number of connected clients per SSID'
          )}
          ${renderToggleOption(
            'Show Enable/Disable Toggle',
            config.show_toggle !== false,
            'show_toggle',
            this._valueChanged.bind(this),
            'Allow enabling/disabling SSIDs from the card'
          )}
          ${renderToggleOption(
            'Start Networks Collapsed',
            config.collapsed_by_default === true,
            'collapsed_by_default',
            this._valueChanged.bind(this),
            'Collapse all networks by default (user can expand)'
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
  'meraki-ssids-list-card-editor',
  MerakiSSIDsListCardEditor
);

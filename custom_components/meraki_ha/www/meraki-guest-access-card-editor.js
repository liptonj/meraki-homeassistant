/**
 * Meraki Guest Access Card Editor
 *
 * Configuration editor for the Guest Access Card
 */

import { html, css } from 'lit';
import { MerakiEditorBase } from './shared/meraki-editor-base.js';
import {
  renderConfigEntrySelector,
  renderToggleOption,
  renderTextInput,
} from './shared/editor-helpers.js';

export class MerakiGuestAccessCardEditor extends MerakiEditorBase {
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
      title: 'Guest Access',
      show_qr_code: true,
      default_duration: 24,
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
              placeholder="Guest Access"
            ></ha-textfield>
          </div>

          ${renderConfigEntrySelector(
            this.hass,
            config.config_entry_id,
            this._handleConfigEntryChanged.bind(this)
          )}

          <div class="form-row">
            <label for="default_duration"
              >Default Access Duration (hours)</label
            >
            <ha-selector
              .hass=${this.hass}
              .selector=${{
                number: {
                  min: 1,
                  max: 168, // 1 week
                  step: 1,
                  mode: 'box',
                },
              }}
              .value=${config.default_duration || 24}
              @value-changed=${this._handleDurationChanged}
            ></ha-selector>
            <div class="help-text">
              Default duration when creating new guest access (1-168 hours)
            </div>
          </div>
        </div>

        <!-- Display Options -->
        <div class="section">
          <h3 class="section-title">Display Options</h3>

          ${renderToggleOption(
            'Show QR Code',
            config.show_qr_code !== false,
            'show_qr_code',
            this._valueChanged.bind(this),
            'Display QR code for easy guest network access'
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

  _handleDurationChanged(ev) {
    if (!this.config || !this.hass) return;
    const newConfig = { ...this.config };
    newConfig.default_duration = ev.detail.value;
    this._configChanged(newConfig);
  }
}

// Register the custom element
customElements.define(
  'meraki-guest-access-card-editor',
  MerakiGuestAccessCardEditor
);

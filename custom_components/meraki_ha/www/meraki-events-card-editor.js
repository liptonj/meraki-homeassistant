/**
 * Meraki Events Card Editor
 *
 * Configuration editor for the Events Card
 */

import { html, css } from 'lit';
import { MerakiEditorBase } from './shared/meraki-editor-base.js';
import {
  renderConfigEntrySelector,
  renderPaginationSelector,
  renderToggleOption,
} from './shared/editor-helpers.js';

export class MerakiEventsCardEditor extends MerakiEditorBase {
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
      title: 'Events',
      events_per_page: 10,
      show_filters: true,
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
              placeholder="Events"
            ></ha-textfield>
          </div>

          ${renderConfigEntrySelector(
            this.hass,
            config.config_entry_id,
            this._handleConfigEntryChanged.bind(this)
          )}
          ${renderPaginationSelector(
            this.hass,
            'Events per page',
            config.events_per_page || 10,
            this._handleEventsPerPageChanged.bind(this),
            { min: 5, max: 50, step: 5 }
          )}
        </div>

        <!-- Display Options -->
        <div class="section">
          <h3 class="section-title">Display Options</h3>

          ${renderToggleOption(
            'Show Filter Controls',
            config.show_filters !== false,
            'show_filters',
            this._valueChanged.bind(this),
            'Display event type and time range filters'
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

  _handleEventsPerPageChanged(ev) {
    if (!this.config || !this.hass) return;
    const newConfig = { ...this.config };
    newConfig.events_per_page = ev.detail.value;
    this._configChanged(newConfig);
  }
}

// Register the custom element
customElements.define('meraki-events-card-editor', MerakiEventsCardEditor);

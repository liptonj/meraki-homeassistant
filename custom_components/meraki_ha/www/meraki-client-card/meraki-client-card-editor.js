import { html, css } from 'lit';
import { MerakiEditorBase } from '../shared/meraki-editor-base.js';
import { renderConfigEntrySelector } from '../shared/editor-helpers.js';

/**
 * Configuration editor for the Meraki Client Card
 * Provides a visual interface for configuring the card in the Lovelace UI editor
 */
export class MerakiClientCardEditor extends MerakiEditorBase {
  static get properties() {
    return {
      ...super.properties,
    };
  }

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
      }

      .field-group {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .row {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
      }

      .row > * {
        flex: 1;
        min-width: 150px;
      }

      ha-textfield {
        width: 100%;
      }

      .checkbox-group {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 8px;
      }

      .checkbox-item {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .help-text {
        font-size: 0.85rem;
        color: var(--secondary-text-color);
        margin-top: 4px;
      }
    `;
  }

  setConfig(config) {
    this.config = {
      client_mac: '',
      entity_id: '',
      show_usage: true,
      show_connection_info: true,
      show_timestamps: true,
      show_block_button: true,
      collapsible: true,
      default_collapsed: false,
      ...config,
    };
  }

  renderForm() {
    return html`
      <div class="form-container">
        <!-- Client Selection Section -->
        <div class="section">
          <h3 class="section-title">Client Selection</h3>
          <div class="field-group">
            <ha-textfield
              label="Client MAC Address"
              .value=${this.config.client_mac || ''}
              .configValue=${'client_mac'}
              @input=${this._valueChanged}
              helper="Format: aa:bb:cc:dd:ee:ff"
            ></ha-textfield>

            <div class="help-text">— OR —</div>

            <ha-textfield
              label="Entity ID"
              .value=${this.config.entity_id || ''}
              .configValue=${'entity_id'}
              @input=${this._valueChanged}
              helper="e.g., device_tracker.meraki_client_aa_bb_cc_dd_ee_ff"
            ></ha-textfield>

            ${renderConfigEntrySelector(
              this.hass,
              this.config.config_entry_id,
              this._handleConfigEntryChanged.bind(this)
            )}
          </div>
        </div>

        <!-- Display Options Section -->
        <div class="section">
          <h3 class="section-title">Display Options</h3>
          <div class="checkbox-group">
            <label class="checkbox-item">
              <ha-checkbox
                .checked=${this.config.show_usage !== false}
                .configValue=${'show_usage'}
                @change=${this._valueChanged}
              ></ha-checkbox>
              <span>Show Usage Statistics</span>
            </label>

            <label class="checkbox-item">
              <ha-checkbox
                .checked=${this.config.show_connection_info !== false}
                .configValue=${'show_connection_info'}
                @change=${this._valueChanged}
              ></ha-checkbox>
              <span>Show Connection Info</span>
            </label>

            <label class="checkbox-item">
              <ha-checkbox
                .checked=${this.config.show_timestamps !== false}
                .configValue=${'show_timestamps'}
                @change=${this._valueChanged}
              ></ha-checkbox>
              <span>Show Timestamps</span>
            </label>

            <label class="checkbox-item">
              <ha-checkbox
                .checked=${this.config.show_block_button !== false}
                .configValue=${'show_block_button'}
                @change=${this._valueChanged}
              ></ha-checkbox>
              <span>Show Block Button</span>
            </label>
          </div>
        </div>

        <!-- Collapsible Options Section -->
        <div class="section">
          <h3 class="section-title">Collapse Behavior</h3>
          <div class="checkbox-group">
            <label class="checkbox-item">
              <ha-checkbox
                .checked=${this.config.collapsible !== false}
                .configValue=${'collapsible'}
                @change=${this._valueChanged}
              ></ha-checkbox>
              <span>Allow Collapse</span>
            </label>

            <label class="checkbox-item">
              <ha-checkbox
                .checked=${this.config.default_collapsed === true}
                .configValue=${'default_collapsed'}
                @change=${this._valueChanged}
              ></ha-checkbox>
              <span>Start Collapsed</span>
            </label>
          </div>
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

  _configChanged(newConfig) {
    const event = new Event('config-changed', {
      bubbles: true,
      composed: true,
    });
    event.detail = { config: newConfig };
    this.dispatchEvent(event);
  }
}

// Register the custom element
customElements.define('meraki-client-card-editor', MerakiClientCardEditor);

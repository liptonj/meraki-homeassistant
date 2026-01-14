import { html } from 'lit';
import { MerakiEditorBase } from '../shared/meraki-editor-base.js';

/**
 * Meraki Camera Card Editor - visual configuration for the camera card.
 */
export class MerakiCameraCardEditor extends MerakiEditorBase {
  static get properties() {
    return {
      ...super.properties,
      _availableCameras: { type: Array, state: true },
    };
  }

  constructor() {
    super();
    this._availableCameras = [];
  }

  async firstUpdated() {
    await super.firstUpdated();
    await this._fetchAvailableCameras();
  }

  async _fetchAvailableCameras() {
    if (!this.hass) return;

    try {
      const cameras = await this.hass.connection.sendMessagePromise({
        type: 'meraki_ha/get_available_cameras',
      });
      this._availableCameras = cameras || [];
    } catch (err) {
      console.error('Failed to fetch available cameras.', err);
      this._availableCameras = [];
    }
  }

  _handleChange(e) {
    const target = e.target;
    const name = target.name || target.getAttribute('name');
    let value = target.value;

    // Handle checkbox values
    if (target.type === 'checkbox') {
      value = target.checked;
    }

    this._updateConfig(name, value);
  }

  _updateConfig(key, value) {
    const newConfig = { ...this.config, [key]: value };

    const event = new CustomEvent('config-changed', {
      detail: { config: newConfig },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  render() {
    if (!this.config) {
      return html`<div>Loading...</div>`;
    }

    return html`
      <div class="card-config">
        <div class="form-group">
          <label for="entity_id">Entity ID *</label>
          <input
            type="text"
            id="entity_id"
            name="entity_id"
            .value=${this.config.entity_id || ''}
            @input=${this._handleChange}
            placeholder="camera.meraki_camera"
          />
        </div>

        <div class="form-group">
          <label for="device_serial">Device Serial (optional)</label>
          <input
            type="text"
            id="device_serial"
            name="device_serial"
            .value=${this.config.device_serial || ''}
            @input=${this._handleChange}
            placeholder="XXXX-XXXX-XXXX"
          />
        </div>

        <div class="form-group">
          <label for="linked_camera_id">Linked Camera (for live view)</label>
          <select
            id="linked_camera_id"
            name="linked_camera_id"
            .value=${this.config.linked_camera_id || ''}
            @change=${this._handleChange}
          >
            <option value="">None (use RTSP/snapshot)</option>
            ${this._availableCameras.map(
              (camera) => html`
                <option
                  value=${camera.entity_id}
                  ?selected=${this.config.linked_camera_id === camera.entity_id}
                >
                  ${camera.name || camera.entity_id}
                </option>
              `
            )}
          </select>
        </div>

        <div class="form-group">
          <label for="aspect_ratio">Aspect Ratio</label>
          <select
            id="aspect_ratio"
            name="aspect_ratio"
            .value=${this.config.aspect_ratio || '16:9'}
            @change=${this._handleChange}
          >
            <option value="16:9">16:9 (Widescreen)</option>
            <option value="4:3">4:3 (Standard)</option>
            <option value="1:1">1:1 (Square)</option>
          </select>
        </div>

        <div class="form-group checkbox">
          <label>
            <input
              type="checkbox"
              name="show_controls"
              .checked=${this.config.show_controls !== false}
              @change=${this._handleChange}
            />
            Show Controls
          </label>
        </div>

        <div class="form-group checkbox">
          <label>
            <input
              type="checkbox"
              name="show_snapshot_button"
              .checked=${this.config.show_snapshot_button !== false}
              @change=${this._handleChange}
            />
            Show Snapshot Button
          </label>
        </div>

        <div class="form-group checkbox">
          <label>
            <input
              type="checkbox"
              name="show_dashboard_link"
              .checked=${this.config.show_dashboard_link !== false}
              @change=${this._handleChange}
            />
            Show Dashboard Link
          </label>
        </div>

        <div class="form-group checkbox">
          <label>
            <input
              type="checkbox"
              name="collapsible"
              .checked=${this.config.collapsible !== false}
              @change=${this._handleChange}
            />
            Collapsible
          </label>
        </div>

        <div class="form-group checkbox">
          <label>
            <input
              type="checkbox"
              name="default_collapsed"
              .checked=${this.config.default_collapsed || false}
              @change=${this._handleChange}
            />
            Start Collapsed
          </label>
        </div>
      </div>

      <style>
        .card-config {
          padding: 16px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          margin-bottom: 4px;
          font-size: 0.9rem;
          color: var(--primary-text-color);
        }

        .form-group input[type='text'],
        .form-group select {
          width: 100%;
          padding: 8px;
          border: 1px solid var(--divider-color);
          border-radius: 4px;
          background: var(--card-background-color, white);
          color: var(--primary-text-color);
          box-sizing: border-box;
        }

        .form-group.checkbox label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .form-group.checkbox input {
          width: auto;
        }
      </style>
    `;
  }
}

// Register the custom element
customElements.define('meraki-camera-card-editor', MerakiCameraCardEditor);

import { html, css } from 'lit';
import { MerakiCardBase } from '../shared/meraki-card-base.js';
import { merakiCardStyles } from '../shared/styles.js';

/**
 * Meraki Camera Card - displays live video, RTSP fallback, and snapshots
 * for Meraki MV cameras with camera linking support.
 */
export class MerakiCameraCard extends MerakiCardBase {
  static get properties() {
    return {
      ...super.properties,
      _collapsed: { type: Boolean, state: true },
      _streamUrl: { type: String, state: true },
      _streamType: { type: String, state: true },
      _showLinkPanel: { type: Boolean, state: true },
      _availableCameras: { type: Array, state: true },
      _selectedCamera: { type: String, state: true },
    };
  }

  static get styles() {
    return [
      merakiCardStyles,
      css`
        .camera-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          cursor: pointer;
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1.1rem;
          font-weight: 500;
        }

        .collapse-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          font-size: 1rem;
          color: var(--secondary-text-color);
          transition: transform 0.2s ease;
        }

        .collapse-button.collapsed {
          transform: rotate(-90deg);
        }

        .card-body {
          padding: 0 16px 16px;
          overflow: hidden;
          transition: max-height 0.3s ease, opacity 0.3s ease;
        }

        .card-body.collapsed {
          max-height: 0;
          opacity: 0;
          padding: 0 16px;
        }

        .video-container {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          background: #000;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 16px;
        }

        .video-container img,
        .video-container video {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .stream-badge {
          position: absolute;
          top: 8px;
          left: 8px;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .stream-badge.live {
          color: #4caf50;
        }

        .stream-badge.rtsp {
          color: #2196f3;
        }

        .stream-badge.snapshot {
          color: #ff9800;
        }

        .loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.5);
          color: white;
        }

        .error-message {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          color: var(--error-color, #f44336);
        }

        .action-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 8px;
        }

        .action-button {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 8px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 500;
          background: var(--secondary-background-color, rgba(0, 0, 0, 0.05));
          color: var(--primary-text-color);
          transition: background 0.2s ease;
        }

        .action-button:hover {
          opacity: 0.85;
        }

        .action-button.primary {
          background: var(--primary-color);
          color: var(--text-primary-color);
        }

        .link-panel {
          margin-top: 16px;
          padding: 16px;
          background: var(--secondary-background-color, rgba(0, 0, 0, 0.05));
          border-radius: 8px;
        }

        .link-panel h4 {
          margin: 0 0 12px 0;
          font-size: 0.95rem;
        }

        .link-panel p {
          margin: 0 0 12px 0;
          font-size: 0.85rem;
          color: var(--secondary-text-color);
        }

        .link-panel select {
          width: 100%;
          padding: 8px;
          border: 1px solid var(--divider-color);
          border-radius: 4px;
          background: var(--card-background-color, white);
          color: var(--primary-text-color);
          margin-bottom: 12px;
        }

        .stream-source {
          font-size: 0.85rem;
          color: var(--secondary-text-color);
          margin-top: 8px;
        }

        .status-indicators {
          display: flex;
          gap: 12px;
          margin-bottom: 12px;
          font-size: 0.85rem;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .status-dot.online {
          background: #4caf50;
        }

        .status-dot.offline {
          background: #9e9e9e;
        }

        .status-dot.recording {
          background: #f44336;
        }

        .status-dot.motion {
          background: #ff9800;
        }
      `,
    ];
  }

  constructor() {
    super();
    this._collapsed = false;
    this._streamUrl = null;
    this._streamType = null;
    this._showLinkPanel = false;
    this._availableCameras = [];
    this._selectedCamera = '';
  }

  setConfig(config) {
    if (!config.entity_id && !config.device_serial) {
      throw new Error('You must specify entity_id or device_serial');
    }
    this.config = {
      show_controls: true,
      show_snapshot_button: true,
      show_dashboard_link: true,
      aspect_ratio: '16:9',
      collapsible: true,
      default_collapsed: false,
      ...config,
    };
    this._collapsed = this.config.default_collapsed;
    this._selectedCamera = this.config.linked_camera_id || '';
  }

  async fetchData() {
    if (!this.hass) {
      return;
    }

    try {
      this._loading = true;
      this._error = null;

      // Fetch the stream using fallback chain
      await this._fetchStream();

      // Fetch available cameras for linking
      await this._fetchAvailableCameras();

      this._loading = false;
    } catch (err) {
      this._loading = false;
      this._error = err.message || 'Failed to fetch camera data';
    }
  }

  async _fetchStream() {
    // 1. Try linked camera first
    if (this.config.linked_camera_id) {
      try {
        const stream = await this.hass.connection.sendMessagePromise({
          type: 'camera/stream',
          entity_id: this.config.linked_camera_id,
        });
        if (stream && stream.url) {
          this._streamUrl = stream.url;
          this._streamType = 'Live';
          return;
        }
      } catch (err) {
        console.warn('Failed to get linked camera stream, falling back.', err);
      }
    }

    // 2. Try RTSP
    try {
      const rtsp = await this.hass.connection.sendMessagePromise({
        type: 'meraki_ha/get_rtsp_url',
        entity_id: this.config.entity_id,
      });
      if (rtsp && rtsp.rtsp_url) {
        this._streamUrl = rtsp.rtsp_url;
        this._streamType = 'RTSP';
        return;
      }
    } catch (err) {
      console.warn('Failed to get RTSP URL, falling back.', err);
    }

    // 3. Fallback to snapshot
    try {
      const snapshot = await this.hass.connection.sendMessagePromise({
        type: 'meraki_ha/get_camera_snapshot',
        entity_id: this.config.entity_id,
      });
      if (snapshot && snapshot.url) {
        this._streamUrl = snapshot.url;
        this._streamType = 'Snapshot';
        return;
      }
    } catch (err) {
      console.error('Failed to get snapshot.', err);
      throw new Error('Failed to fetch any camera stream or snapshot');
    }
  }

  async _fetchAvailableCameras() {
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

  handleUpdate(message) {
    // Handle real-time updates if applicable
  }

  _toggleCollapse() {
    if (this.config.collapsible) {
      this._collapsed = !this._collapsed;
    }
  }

  _handleRefresh() {
    this.fetchData();
  }

  _handleFullScreen() {
    if (this._streamUrl && this._streamType === 'Live') {
      window.open(this._streamUrl, '_blank', 'noopener,noreferrer');
    }
  }

  async _handleSnapshot() {
    try {
      const snapshot = await this.hass.connection.sendMessagePromise({
        type: 'meraki_ha/get_camera_snapshot',
        entity_id: this.config.entity_id,
      });
      if (snapshot && snapshot.url) {
        this._streamUrl = snapshot.url;
        this._streamType = 'Snapshot';
      }
    } catch (err) {
      console.error('Failed to fetch snapshot.', err);
    }
  }

  _handleToggleLinkPanel() {
    this._showLinkPanel = !this._showLinkPanel;
  }

  async _handleSaveLink() {
    if (!this._selectedCamera) return;

    try {
      await this.hass.connection.sendMessagePromise({
        type: 'meraki_ha/set_camera_mapping',
        config_entry_id: this.config.config_entry_id,
        meraki_camera_entity_id: this.config.entity_id,
        linked_camera_entity_id: this._selectedCamera,
      });
      this._showLinkPanel = false;
      // Refresh to use the new linked camera
      await this.fetchData();
    } catch (err) {
      console.error('Failed to save camera mapping.', err);
    }
  }

  _handleDashboard() {
    if (!this.hass || !this.config.entity_id) return;
    const entity = this.hass.states[this.config.entity_id];
    if (entity && entity.attributes.meraki_dashboard_url) {
      window.open(entity.attributes.meraki_dashboard_url, '_blank', 'noopener,noreferrer');
    }
  }

  _getCameraName() {
    if (!this.hass || !this.config.entity_id) return 'Camera';
    const entity = this.hass.states[this.config.entity_id];
    return entity?.attributes?.friendly_name || this.config.entity_id;
  }

  _getCameraStatus() {
    if (!this.hass || !this.config.entity_id) return { online: false, recording: false, motion: false };
    const entity = this.hass.states[this.config.entity_id];
    return {
      online: entity?.state !== 'unavailable',
      recording: entity?.attributes?.is_recording || false,
      motion: entity?.attributes?.motion_detected || false,
    };
  }

  renderCard() {
    const name = this._getCameraName();
    const status = this._getCameraStatus();

    return html`
      <ha-card>
        <div class="camera-header" @click=${this._toggleCollapse}>
          <div class="header-title">
            <span>📹</span>
            <span>${name}</span>
          </div>
          ${this.config.collapsible
            ? html`
                <button
                  class="collapse-button ${this._collapsed ? 'collapsed' : ''}"
                  @click=${(e) => {
                    e.stopPropagation();
                    this._toggleCollapse();
                  }}
                >
                  ▼
                </button>
              `
            : ''}
        </div>

        <div class="card-body ${this._collapsed ? 'collapsed' : ''}">
          <!-- Status Indicators -->
          <div class="status-indicators">
            <div class="status-indicator">
              <span class="status-dot ${status.online ? 'online' : 'offline'}"></span>
              <span>${status.online ? 'Online' : 'Offline'}</span>
            </div>
            ${status.recording
              ? html`
                  <div class="status-indicator">
                    <span class="status-dot recording"></span>
                    <span>Recording</span>
                  </div>
                `
              : ''}
            ${status.motion
              ? html`
                  <div class="status-indicator">
                    <span class="status-dot motion"></span>
                    <span>Motion</span>
                  </div>
                `
              : ''}
          </div>

          <!-- Video Container -->
          <div class="video-container">
            ${this._loading
              ? html`<div class="loading-overlay">Loading...</div>`
              : ''}
            ${this._error
              ? html`
                  <div class="error-message">
                    <div>❌ ${this._error}</div>
                    <button class="action-button" @click=${this._handleRefresh} style="margin-top: 8px;">
                      🔄 Retry
                    </button>
                  </div>
                `
              : ''}
            ${this._streamUrl && !this._loading && !this._error
              ? html`
                  <div class="stream-badge ${this._streamType?.toLowerCase()}">
                    ● ${this._streamType}
                  </div>
                  ${this._streamType === 'Live'
                    ? html`<video src=${this._streamUrl} autoplay muted playsinline></video>`
                    : html`<img src=${this._streamUrl} alt="Camera view" />`}
                `
              : ''}
          </div>

          <!-- Action Buttons -->
          ${this.config.show_controls
            ? html`
                <div class="action-buttons">
                  <button class="action-button" @click=${this._handleRefresh}>
                    🔄 Refresh
                  </button>
                  <button class="action-button" @click=${this._handleFullScreen}>
                    📺 Full Screen
                  </button>
                  ${this.config.show_snapshot_button
                    ? html`
                        <button class="action-button" @click=${this._handleSnapshot}>
                          📷 Snapshot
                        </button>
                      `
                    : ''}
                  <button class="action-button" @click=${this._handleToggleLinkPanel}>
                    ⚙️ Link
                  </button>
                  ${this.config.show_dashboard_link
                    ? html`
                        <button class="action-button" @click=${this._handleDashboard}>
                          🌐 Dashboard
                        </button>
                      `
                    : ''}
                </div>
              `
            : ''}

          <!-- Stream Source Info -->
          ${this.config.linked_camera_id
            ? html`
                <div class="stream-source">
                  Streaming from: ${this.config.linked_camera_id}
                </div>
              `
            : ''}

          <!-- Link Panel -->
          ${this._showLinkPanel
            ? html`
                <div class="link-panel">
                  <h4>🔗 Link to Camera Stream</h4>
                  <p>Select a camera entity to display live video.</p>
                  <select
                    .value=${this._selectedCamera}
                    @change=${(e) => (this._selectedCamera = e.target.value)}
                  >
                    <option value="">Select a camera</option>
                    ${this._availableCameras.map(
                      (camera) => html`
                        <option value=${camera.entity_id}>
                          ${camera.name || camera.entity_id}
                        </option>
                      `
                    )}
                  </select>
                  <button class="action-button primary" @click=${this._handleSaveLink}>
                    Save
                  </button>
                </div>
              `
            : ''}
        </div>
      </ha-card>
    `;
  }

  getCardSize() {
    return this._collapsed ? 1 : 6;
  }

  static getConfigElement() {
    return document.createElement('meraki-camera-card-editor');
  }

  static getStubConfig() {
    return {
      entity_id: 'camera.meraki_camera',
      show_controls: true,
      show_snapshot_button: true,
      show_dashboard_link: true,
      aspect_ratio: '16:9',
      collapsible: true,
      default_collapsed: false,
    };
  }
}

// Register the custom element
customElements.define('meraki-camera-card', MerakiCameraCard);

// Register with Lovelace
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'meraki-camera-card',
  name: 'Meraki Camera Card',
  description: 'Displays live video, RTSP streams, and snapshots from Meraki MV cameras',
  preview: true,
  documentationURL: 'https://github.com/liptonj/meraki-homeassistant',
});

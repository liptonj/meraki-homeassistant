import { LitElement, html } from 'lit';
import { merakiCardStyles } from './styles.js';

export class MerakiCardBase extends LitElement {
  static get properties() {
    return {
      // NOTE: Do NOT include 'hass' here!
      // Home Assistant sets hass as a plain property from outside Lit's system.
      // We handle it with a custom getter/setter below.
      config: { type: Object },
      _data: { type: Object, state: true },
      _loading: { type: Boolean, state: true },
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
    this._hassWaitTimeout = null;
  }

  /**
   * Check if debug mode is enabled via config, localStorage, or window.
   */
  _getDebugMode() {
    return (
      this.config?.debug ||
      localStorage.getItem('meraki_debug') === 'true' ||
      window.merakiDebug === true
    );
  }

  /**
   * Log a message with color-coded styling (only in debug mode).
   */
  _log(level, message, data = null) {
    if (!this._getDebugMode()) return;

    const styles = {
      info: 'background: #2980b9; color: white; padding: 2px 6px; border-radius: 3px;',
      success:
        'background: #27ae60; color: white; padding: 2px 6px; border-radius: 3px;',
      warn: 'background: #f39c12; color: white; padding: 2px 6px; border-radius: 3px;',
      error:
        'background: #e74c3c; color: white; padding: 2px 6px; border-radius: 3px;',
    };

    console.log(
      `%c ${this.constructor.name} `,
      styles[level],
      message,
      data !== null ? data : ''
    );
  }

  /**
   * Log API call details with timing and response summary.
   */
  _logAPI(command, params, result, error, duration) {
    if (!this._getDebugMode()) return;

    console.group(`🌐 ${this.constructor.name} → ${command}`);
    console.log('📤 Request:', {
      command,
      params,
      config_entry_id: this.config?.config_entry_id,
    });
    console.log('⏱️ Duration:', duration + 'ms');

    if (error) {
      console.error('❌ Error:', error);
      console.trace('Stack trace:');
    } else {
      console.log('✅ Response:', result);
      console.log('📊 Data summary:', {
        devices: result?.devices?.length,
        clients: result?.clients?.length,
        ssids: result?.ssids?.length,
        networks: result?.networks?.length,
      });
    }
    console.groupEnd();
  }

  /**
   * Log lifecycle events with icons.
   */
  _logLifecycle(event, data = null) {
    if (!this._getDebugMode()) return;

    const icons = {
      setConfig: '⚙️',
      hassSet: '🏠',
      connected: '🔌',
      disconnected: '🔌',
      fetchData: '📡',
      dataReceived: '📥',
      subscribed: '📻',
      render: '🎨',
    };

    console.log(
      `${icons[event] || '📍'} ${this.constructor.name}.${event}`,
      data !== null ? data : ''
    );
  }

  setConfig(config) {
    this._logLifecycle('setConfig', config);

    if (!config.config_entry_id) {
      this._log('error', 'Missing required config_entry_id', config);
      throw new Error('config_entry_id must be specified');
    }

    this.config = config;
    this._log('info', 'Config validated successfully');

    if (this.hass) {
      this._log('info', 'hass already available, fetching data');
      this.fetchData();
    } else {
      this._log('warn', 'hass not available yet, waiting...');

      // Set a timeout to warn if hass is never provided
      this._hassWaitTimeout = setTimeout(() => {
        if (!this.hass) {
          this._log(
            'error',
            '⚠️ TIMEOUT: hass object never received after 10 seconds!'
          );
          this._log(
            'error',
            'This usually means Home Assistant is not passing hass to the card element.'
          );
          this._log(
            'error',
            'Check if the card is being created properly in the dashboard.'
          );
          console.error(
            `${this.constructor.name}: hass object not provided after 10 seconds. The card will not function.`
          );
        }
      }, 10000);
    }
  }

  set hass(hass) {
    const oldHass = this._hass;
    this._hass = hass;

    // Request an update when hass changes
    this.requestUpdate('hass', oldHass);

    // DEBUG: Log element state to verify it's in the DOM
    if (this._getDebugMode()) {
      console.log(`🔍 ${this.constructor.name}.hass setter called:`, {
        elementInDOM: document.contains(this),
        tagName: this.tagName,
        parentElement: this.parentElement?.tagName,
        grandparentElement: this.parentElement?.parentElement?.tagName,
        hassConnected: !!hass?.connection,
        statesCount: Object.keys(hass?.states || {}).length,
      });
    }

    // Clear the timeout warning if we finally got hass
    if (this._hassWaitTimeout) {
      clearTimeout(this._hassWaitTimeout);
      this._hassWaitTimeout = null;
    }

    this._logLifecycle('hassSet', {
      connected: !!hass?.connection,
      states: Object.keys(hass?.states || {}).length,
    });

    if (this.config && !this.subscription) {
      this._log('info', 'Subscribing to updates');
      this._subscribeToUpdates();
      // Fetch data now that we have both config and hass
      if (!this._data || Object.keys(this._data).length === 0) {
        this._log('info', 'Fetching initial data');
        this.fetchData();
      }
    }
  }

  get hass() {
    return this._hass;
  }

  async _callMerakiApi(command, params = {}) {
    const startTime = performance.now();

    this._logLifecycle('fetchData', { command, params });

    if (!this.hass) {
      const error = 'Home Assistant connection not available';
      this._log('error', error);
      this._error = error;
      throw new Error(error);
    }

    if (!this.config.config_entry_id) {
      const error = 'config_entry_id is required but not set';
      this._log('error', error);
      this._error = error;
      throw new Error(error);
    }

    try {
      this._loading = true;
      this._error = null;

      const result = await this.hass.connection.sendMessagePromise({
        type: command,
        config_entry_id: this.config.config_entry_id,
        ...params,
      });

      const duration = Math.round(performance.now() - startTime);
      this._loading = false;
      this._logAPI(command, params, result, null, duration);

      return result;
    } catch (err) {
      const duration = Math.round(performance.now() - startTime);
      this._loading = false;

      // Enhanced error details
      const errorDetails = {
        message: err.message || 'Unknown error',
        code: err.code,
        type: err.constructor.name,
        command,
        params,
        config_entry_id: this.config.config_entry_id,
        hassConnection: !!this.hass?.connection,
        timestamp: new Date().toISOString(),
      };

      this._error = JSON.stringify(errorDetails, null, 2);
      this._logAPI(command, params, null, errorDetails, duration);

      throw err;
    }
  }

  _subscribeToUpdates() {
    if (this.subscription) {
      this.subscription(); // Unsubscribe
    }

    this._log('info', 'Creating subscription');

    this.subscription = this.hass.connection.subscribeMessage(
      (message) => {
        this._logLifecycle('dataReceived', {
          devices: message?.devices?.length,
          clients: message?.clients?.length,
        });
        this.handleUpdate(message);
      },
      {
        type: 'meraki/subscribe_updates',
        config_entry_id: this.config.config_entry_id,
      }
    );

    this._logLifecycle('subscribed');
  }

  handleUpdate(message) {
    // To be implemented by subclasses
  }

  fetchData() {
    // To be implemented by subclasses
  }

  render() {
    this._logLifecycle('render', {
      loading: this._loading,
      error: !!this._error,
      hasData: !!this._data && Object.keys(this._data).length > 0,
    });

    if (this._loading) {
      return html`
        <ha-card>
          <div class="loading">
            <ha-circular-progress active></ha-circular-progress>
            ${this._getDebugMode()
              ? html`<div style="margin-top: 8px; font-size: 12px;">
                  Loading data from coordinator...
                </div>`
              : ''}
          </div>
        </ha-card>
      `;
    }

    if (this._error) {
      return html`
        <ha-card>
          <div class="error">
            <strong>Error:</strong> ${this._error}
            ${this._getDebugMode()
              ? html`
                  <div
                    style="margin-top: 12px; font-size: 11px; font-family: monospace; white-space: pre-wrap; background: rgba(0,0,0,0.1); padding: 8px; border-radius: 4px;"
                  >
                    ${this._error}
                  </div>
                  <button
                    @click=${() => this.fetchData()}
                    style="margin-top: 8px; padding: 4px 8px; cursor: pointer;"
                  >
                    🔄 Retry
                  </button>
                `
              : ''}
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

  /**
   * Render a collapsible debug panel (only visible in debug mode).
   */
  _renderDebugPanel() {
    if (!this._getDebugMode()) return '';

    return html`
      <div
        style="border-top: 2px solid #f39c12; padding: 12px; background: rgba(243, 156, 18, 0.1); font-size: 11px; font-family: monospace;"
      >
        <details>
          <summary style="cursor: pointer; font-weight: bold;">
            🐛 Debug Info
          </summary>
          <div style="margin-top: 8px;">
            <div><strong>Card:</strong> ${this.constructor.name}</div>
            <div>
              <strong>Config Entry ID:</strong> ${this.config
                ?.config_entry_id || 'NOT SET'}
            </div>
            <div><strong>Has hass:</strong> ${!!this.hass}</div>
            <div>
              <strong>Has data:</strong> ${!!this._data &&
              Object.keys(this._data).length > 0}
            </div>
            <div><strong>Loading:</strong> ${this._loading}</div>
            <div><strong>Error:</strong> ${this._error || 'None'}</div>
            <div><strong>Subscribed:</strong> ${!!this.subscription}</div>
            <div>
              <strong>Last update:</strong> ${new Date().toLocaleTimeString()}
            </div>
            <button
              @click=${() => this.fetchData()}
              style="margin-top: 8px; padding: 4px 8px; cursor: pointer;"
            >
              🔄 Force Refresh
            </button>
            <button
              @click=${() => console.log('Card state:', this)}
              style="margin-top: 8px; margin-left: 4px; padding: 4px 8px; cursor: pointer;"
            >
              📊 Log State
            </button>
          </div>
        </details>
      </div>
    `;
  }

  getCardSize() {
    return 3;
  }
}

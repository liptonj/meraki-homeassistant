/**
 * Shared Editor Helpers
 *
 * Reusable components and utilities for Meraki card editors.
 * Ensures consistency across all card configuration UIs.
 */

import { html } from 'lit';

/**
 * Renders a Home Assistant integration selector for config_entry_id
 * This provides a dropdown of Meraki integrations instead of manual UUID entry
 *
 * @param {Object} hass - Home Assistant object
 * @param {string} value - Current config_entry_id value
 * @param {Function} onChange - Callback when value changes
 * @returns {TemplateResult} ha-selector element
 */
export function renderConfigEntrySelector(hass, value, onChange) {
  return html`
    <div class="form-row">
      <label for="config_entry_id">Meraki Integration</label>
      <ha-selector
        .hass=${hass}
        .selector=${{
          config_entry: {
            integration: 'meraki_ha',
          },
        }}
        .value=${value || ''}
        .label=${'Integration'}
        @value-changed=${onChange}
      ></ha-selector>
      <div class="help-text">Select your Meraki integration instance</div>
    </div>
  `;
}

/**
 * Renders a number slider for pagination configuration
 *
 * @param {Object} hass - Home Assistant object
 * @param {string} label - Label for the slider
 * @param {number} value - Current value
 * @param {number} min - Minimum value (default: 5)
 * @param {number} max - Maximum value (default: 50)
 * @param {number} step - Step size (default: 5)
 * @param {Function} onChange - Callback when value changes
 * @returns {TemplateResult} ha-selector element
 */
export function renderPaginationSelector(
  hass,
  label,
  value,
  onChange,
  { min = 5, max = 50, step = 5 } = {}
) {
  return html`
    <div class="form-row">
      <label>${label}</label>
      <ha-selector
        .hass=${hass}
        .selector=${{
          number: {
            min,
            max,
            step,
            mode: 'slider',
          },
        }}
        .value=${value || 10}
        @value-changed=${onChange}
      ></ha-selector>
      <div class="help-text">
        Number of items to display per page (${min}-${max})
      </div>
    </div>
  `;
}

/**
 * Renders a toggle switch option
 *
 * @param {string} label - Label for the toggle
 * @param {boolean} checked - Current checked state
 * @param {string} configValue - Config key name
 * @param {Function} onChange - Callback when value changes
 * @param {string} helpText - Optional help text
 * @returns {TemplateResult} Toggle switch element
 */
export function renderToggleOption(
  label,
  checked,
  configValue,
  onChange,
  helpText = ''
) {
  return html`
    <div class="toggle-row">
      <label class="toggle-label">
        <span>${label}</span>
        ${helpText ? html`<div class="help-text">${helpText}</div>` : ''}
      </label>
      <ha-switch
        .checked=${checked !== false}
        .configValue=${configValue}
        @change=${onChange}
      ></ha-switch>
    </div>
  `;
}

/**
 * Renders a text input field
 *
 * @param {string} label - Label for the input
 * @param {string} value - Current value
 * @param {string} configValue - Config key name
 * @param {Function} onChange - Callback when value changes
 * @param {string} placeholder - Placeholder text
 * @param {string} helpText - Optional help text
 * @returns {TemplateResult} Text input element
 */
export function renderTextInput(
  label,
  value,
  configValue,
  onChange,
  placeholder = '',
  helpText = ''
) {
  return html`
    <div class="form-row">
      <ha-textfield
        label=${label}
        .value=${value || ''}
        .configValue=${configValue}
        @input=${onChange}
        placeholder=${placeholder}
        helper=${helpText}
      ></ha-textfield>
    </div>
  `;
}

/**
 * Standard CSS styles for editor forms
 * Include this in your editor's styles
 */
export const editorStyles = `
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

  .form-row label {
    font-weight: 500;
    font-size: 0.875rem;
    color: var(--primary-text-color);
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

/**
 * Helper to create a config changed event handler
 * Use this in your editor to handle value changes
 *
 * @param {Object} currentConfig - Current configuration object
 * @param {Function} dispatchEvent - Function to dispatch the config-changed event
 * @returns {Function} Event handler function
 */
export function createConfigChangeHandler(currentConfig, dispatchEvent) {
  return (ev) => {
    if (!currentConfig) return;

    const { target } = ev;
    const newConfig = { ...currentConfig };

    // Handle ha-selector value-changed events
    if (ev.detail && ev.detail.value !== undefined) {
      const configKey =
        target.getAttribute('data-config-key') ||
        target.configValue ||
        ev.detail.key;
      if (configKey) {
        if (ev.detail.value === '') {
          delete newConfig[configKey];
        } else {
          newConfig[configKey] = ev.detail.value;
        }
      }
    }
    // Handle ha-switch and ha-textfield change/input events
    else if (target.configValue) {
      if (target.value === '') {
        delete newConfig[target.configValue];
      } else {
        newConfig[target.configValue] =
          target.checked !== undefined ? target.checked : target.value;
      }
    }

    const event = new Event('config-changed', {
      bubbles: true,
      composed: true,
    });
    event.detail = { config: newConfig };
    dispatchEvent(event);
  };
}

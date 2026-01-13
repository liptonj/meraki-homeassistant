/**
 * Meraki Alerts Badge
 *
 * Display active alerts count badge.
 */

import { html, LitElement } from 'lit';

export class MerakiAlertsBadge extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      config: { type: Object },
    };
  }

  setConfig(config) {
    this.config = config;
  }

  _countAlerts() {
    if (!this.hass) {
      return 0;
    }

    // Try to find alert count sensor
    const alertEntityId = `sensor.meraki_alerts_${
      this.config?.severity || 'all'
    }`;
    const entity = this.hass.states[alertEntityId];

    if (entity && entity.state) {
      return parseInt(entity.state, 10) || 0;
    }

    // Fallback: Count offline devices as alerts
    return Object.values(this.hass.states).filter((entity) => {
      return (
        entity.attributes.meraki_device_status === 'offline' &&
        !entity.entity_id.startsWith('sensor.meraki_client_')
      );
    }).length;
  }

  _getIcon() {
    switch (this.config?.severity) {
      case 'critical':
        return '🔥';
      case 'warning':
        return '⚠️';
      case 'info':
      default:
        return 'ℹ️';
    }
  }

  render() {
    if (!this.hass) {
      return html``;
    }

    const alertCount = this._countAlerts();
    const icon = this._getIcon();
    const severity = this.config?.severity || '';

    return html`<span
      >${icon} ${alertCount} ${severity}
      ${alertCount === 1 ? 'alert' : 'alerts'}</span
    >`;
  }

  getCardSize() {
    return 1;
  }
}

customElements.define('meraki-alerts-badge', MerakiAlertsBadge);

// Register badge
if (!window.customBadges) {
  window.customBadges = [];
}

window.customBadges.push({
  type: 'meraki-alerts-badge',
  name: 'Meraki Alerts Badge',
  description: 'A badge to display the number of active Meraki alerts.',
  preview: true,
});

/**
 * Meraki Status Badge
 *
 * Display network health status badge.
 */

import { html, LitElement } from 'lit';

export class MerakiStatusBadge extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      config: { type: Object },
    };
  }

  setConfig(config) {
    this.config = config;
  }

  _countDevicesByStatus(status) {
    if (!this.hass) {
      return 0;
    }

    return Object.values(this.hass.states).filter((entity) => {
      return (
        entity.attributes.meraki_device_status === status &&
        !entity.entity_id.startsWith('sensor.meraki_client_')
      );
    }).length;
  }

  render() {
    if (!this.hass) {
      return html``;
    }

    const online = this._countDevicesByStatus('online');
    const offline = this._countDevicesByStatus('offline');
    const icon = offline > 0 ? '🟡' : '🟢';

    return html`
      <span
        >${icon}
        ${this.config?.title || 'Network'}${this.config?.show_count
          ? `: ${online} online`
          : ''}</span
      >
    `;
  }

  getCardSize() {
    return 1;
  }
}

customElements.define('meraki-status-badge', MerakiStatusBadge);

// Register badge
if (!window.customBadges) {
  window.customBadges = [];
}

window.customBadges.push({
  type: 'meraki-status-badge',
  name: 'Meraki Status Badge',
  description: 'A badge to display the status of Meraki devices.',
  preview: true,
});

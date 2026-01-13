/**
 * Meraki Clients Badge
 *
 * Display connected client count badge.
 */

import { html, LitElement } from 'lit';

export class MerakiClientsBadge extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      config: { type: Object },
    };
  }

  setConfig(config) {
    this.config = config;
  }

  _countClients() {
    if (!this.hass) {
      return 0;
    }

    return Object.values(this.hass.states).filter((entity) => {
      const isClient = entity.entity_id.startsWith(
        'device_tracker.meraki_client_'
      );
      if (!isClient) {
        return false;
      }
      if (
        this.config?.network_id &&
        entity.attributes.network_id !== this.config.network_id
      ) {
        return false;
      }
      return entity.state === 'home';
    }).length;
  }

  render() {
    if (!this.hass) {
      return html``;
    }

    const clientCount = this._countClients();
    return html`<span
      >👥 ${this.config?.title || 'Clients'}: ${clientCount}</span
    >`;
  }

  getCardSize() {
    return 1;
  }
}

customElements.define('meraki-clients-badge', MerakiClientsBadge);

// Register badge
if (!window.customBadges) {
  window.customBadges = [];
}

window.customBadges.push({
  type: 'meraki-clients-badge',
  name: 'Meraki Clients Badge',
  description: 'A badge to display the number of connected clients.',
  preview: true,
});

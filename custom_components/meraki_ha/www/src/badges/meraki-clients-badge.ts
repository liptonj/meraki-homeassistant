
import { HomeAssistant } from "custom-card-helpers";

class MerakiClientsBadge extends HTMLElement {
  private _hass: HomeAssistant | undefined;
  private config: any;

  set hass(hass: HomeAssistant) {
    this._hass = hass;
    this.updateContent();
  }

  setConfig(config: any) {
    this.config = config;
  }

  private _countClients(): number {
    if (!this._hass) {
      return 0;
    }

    return Object.values(this._hass.states).filter((entity) => {
      const isClient = entity.entity_id.startsWith("device_tracker.meraki_client_");
      if (!isClient) {
        return false;
      }
      if (this.config.network_id && entity.attributes.network_id !== this.config.network_id) {
        return false;
      }
      return entity.state === 'home';
    }).length;
  }

  private updateContent() {
    if (!this._hass) {
      return;
    }

    const clientCount = this._countClients();
    this.innerHTML = `<span>👥 ${this.config.title || 'Clients'}: ${clientCount}</span>`;
  }

  getCardSize() {
    return 1;
  }
}

customElements.define("meraki-clients-badge", MerakiClientsBadge);

if (!window.customBadges) {
  window.customBadges = [];
}

window.customBadges.push({
  type: "meraki-clients-badge",
  name: "Meraki Clients Badge",
  description: "A badge to display the number of connected clients.",
  preview: true,
});

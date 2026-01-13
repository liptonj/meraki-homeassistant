
import { HomeAssistant } from "custom-card-helpers";

class MerakiStatusBadge extends HTMLElement {
  private _hass: HomeAssistant | undefined;
  private config: any;

  set hass(hass: HomeAssistant) {
    this._hass = hass;
    this.updateContent();
  }

  setConfig(config: any) {
    this.config = config;
  }

  private _countDevicesByStatus(status: string): number {
    if (!this._hass) {
      return 0;
    }

    return Object.values(this._hass.states).filter((entity) => {
      return (
        entity.attributes.meraki_device_status === status &&
        !entity.entity_id.startsWith("sensor.meraki_client_")
      );
    }).length;
  }

  private updateContent() {
    if (!this._hass) {
      return;
    }

    const online = this._countDevicesByStatus("online");
    const offline = this._countDevicesByStatus("offline");
    const icon = offline > 0 ? "🟡" : "🟢";

    let content = `<span>${icon} ${this.config.title || 'Network'}`;
    if (this.config.show_count) {
      content += `: ${online} online`;
    }
    content += `</span>`;

    this.innerHTML = content;
  }

  getCardSize() {
    return 1;
  }
}

customElements.define("meraki-status-badge", MerakiStatusBadge);

if (!window.customBadges) {
  window.customBadges = [];
}

window.customBadges.push({
  type: "meraki-status-badge",
  name: "Meraki Status Badge",
  description: "A badge to display the status of Meraki devices.",
  preview: true,
});

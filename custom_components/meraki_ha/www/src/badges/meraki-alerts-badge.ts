
import { HomeAssistant } from "custom-card-helpers";

class MerakiAlertsBadge extends HTMLElement {
  private _hass: HomeAssistant | undefined;
  private config: any;

  set hass(hass: HomeAssistant) {
    this._hass = hass;
    this.updateContent();
  }

  setConfig(config: any) {
    this.config = config;
  }

  private _countAlerts(): number {
    if (!this._hass) {
      return 0;
    }
    // This is a placeholder. A real implementation would need a way to fetch alerts.
    // We'll simulate this by looking for a sensor that provides the alert count.
    const alertEntityId = `sensor.meraki_alerts_${this.config.severity || 'all'}`;
    const entity = this._hass.states[alertEntityId];
    return entity ? parseInt(entity.state, 10) : 0;
  }

  private _getIcon(): string {
    switch (this.config.severity) {
      case 'critical':
        return '🔥';
      case 'warning':
        return '⚠️';
      case 'info':
      default:
        return 'ℹ️';
    }
  }

  private updateContent() {
    if (!this._hass) {
      return;
    }

    const alertCount = this._countAlerts();
    const icon = this._getIcon();
    this.innerHTML = `<span>${icon} ${alertCount} ${this.config.severity || ''} alerts</span>`;
  }

  getCardSize() {
    return 1;
  }
}

customElements.define("meraki-alerts-badge", MerakiAlertsBadge);

if (!window.customBadges) {
  window.customBadges = [];
}

window.customBadges.push({
  type: "meraki-alerts-badge",
  name: "Meraki Alerts Badge",
  description: "A badge to display the number of active Meraki alerts.",
  preview: true,
});

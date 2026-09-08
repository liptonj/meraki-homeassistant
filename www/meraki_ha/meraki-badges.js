var r = Object.defineProperty;
var o = (i, e, t) => e in i ? r(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[e] = t;
var n = (i, e, t) => o(i, typeof e != "symbol" ? e + "" : e, t);
class c extends HTMLElement {
  constructor() {
    super(...arguments);
    n(this, "_hass");
    n(this, "config");
  }
  set hass(t) {
    this._hass = t, this.updateContent();
  }
  setConfig(t) {
    this.config = t;
  }
  _countDevicesByStatus(t) {
    return this._hass ? Object.values(this._hass.states).filter((s) => s.attributes.meraki_device_status === t && !s.entity_id.startsWith("sensor.meraki_client_")).length : 0;
  }
  updateContent() {
    if (!this._hass)
      return;
    const t = this._countDevicesByStatus("online");
    let a = `<span>${this._countDevicesByStatus("offline") > 0 ? "🟡" : "🟢"} ${this.config.title || "Network"}`;
    this.config.show_count && (a += `: ${t} online`), a += "</span>", this.innerHTML = a;
  }
  getCardSize() {
    return 1;
  }
}
customElements.define("meraki-status-badge", c);
window.customBadges || (window.customBadges = []);
window.customBadges.push({
  type: "meraki-status-badge",
  name: "Meraki Status Badge",
  description: "A badge to display the status of Meraki devices.",
  preview: !0
});
class u extends HTMLElement {
  constructor() {
    super(...arguments);
    n(this, "_hass");
    n(this, "config");
  }
  set hass(t) {
    this._hass = t, this.updateContent();
  }
  setConfig(t) {
    this.config = t;
  }
  _countClients() {
    return this._hass ? Object.values(this._hass.states).filter((t) => !t.entity_id.startsWith("device_tracker.meraki_client_") || this.config.network_id && t.attributes.network_id !== this.config.network_id ? !1 : t.state === "home").length : 0;
  }
  updateContent() {
    if (!this._hass)
      return;
    const t = this._countClients();
    this.innerHTML = `<span>👥 ${this.config.title || "Clients"}: ${t}</span>`;
  }
  getCardSize() {
    return 1;
  }
}
customElements.define("meraki-clients-badge", u);
window.customBadges || (window.customBadges = []);
window.customBadges.push({
  type: "meraki-clients-badge",
  name: "Meraki Clients Badge",
  description: "A badge to display the number of connected clients.",
  preview: !0
});
class d extends HTMLElement {
  constructor() {
    super(...arguments);
    n(this, "_hass");
    n(this, "config");
  }
  set hass(t) {
    this._hass = t, this.updateContent();
  }
  setConfig(t) {
    this.config = t;
  }
  _countAlerts() {
    if (!this._hass)
      return 0;
    const t = `sensor.meraki_alerts_${this.config.severity || "all"}`, s = this._hass.states[t];
    return s ? parseInt(s.state, 10) : 0;
  }
  _getIcon() {
    switch (this.config.severity) {
      case "critical":
        return "🔥";
      case "warning":
        return "⚠️";
      case "info":
      default:
        return "ℹ️";
    }
  }
  updateContent() {
    if (!this._hass)
      return;
    const t = this._countAlerts(), s = this._getIcon();
    this.innerHTML = `<span>${s} ${t} ${this.config.severity || ""} alerts</span>`;
  }
  getCardSize() {
    return 1;
  }
}
customElements.define("meraki-alerts-badge", d);
window.customBadges || (window.customBadges = []);
window.customBadges.push({
  type: "meraki-alerts-badge",
  name: "Meraki Alerts Badge",
  description: "A badge to display the number of active Meraki alerts.",
  preview: !0
});

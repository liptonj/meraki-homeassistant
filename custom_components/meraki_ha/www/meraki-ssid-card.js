var R = Object.create;
var j = Object.defineProperty;
var T = Object.getOwnPropertyDescriptor;
var Y = (s, n) => (n = Symbol[s]) ? n : Symbol.for("Symbol." + s), y = (s) => {
  throw TypeError(s);
};
var q = (s, n, t) => n in s ? j(s, n, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[n] = t;
var K = (s, n) => j(s, "name", { value: n, configurable: !0 });
var z = (s) => [, , , R((s == null ? void 0 : s[Y("metadata")]) ?? null)], F = ["class", "method", "getter", "setter", "accessor", "field", "value", "get", "set"], v = (s) => s !== void 0 && typeof s != "function" ? y("Function expected") : s, W = (s, n, t, c, i) => ({ kind: F[s], name: n, metadata: c, addInitializer: (o) => t._ ? y("Already initialized") : i.push(v(o || null)) }), X = (s, n) => q(n, Y("metadata"), s[3]), l = (s, n, t, c) => {
  for (var i = 0, o = s[n >> 1], a = o && o.length; i < a; i++) n & 1 ? o[i].call(t) : c = o[i].call(t, c);
  return c;
}, b = (s, n, t, c, i, o) => {
  var a, h, x, w, u, e = n & 7, m = !!(n & 8), d = !!(n & 16), $ = e > 3 ? s.length + 1 : e ? m ? 1 : 2 : 0, f = F[e + 5], k = e > 3 && (s[$ - 1] = []), U = s[$] || (s[$] = []), p = e && (!d && !m && (i = i.prototype), e < 5 && (e > 3 || !d) && T(e < 4 ? i : { get [t]() {
    return N(this, o);
  }, set [t](_) {
    return V(this, o, _);
  } }, t));
  e ? d && e < 4 && K(o, (e > 2 ? "set " : e > 1 ? "get " : "") + t) : K(i, t);
  for (var A = c.length - 1; A >= 0; A--)
    w = W(e, t, x = {}, s[3], U), e && (w.static = m, w.private = d, u = w.access = { has: d ? (_) => Z(i, _) : (_) => t in _ }, e ^ 3 && (u.get = d ? (_) => (e ^ 1 ? N : C)(_, i, e ^ 4 ? o : p.get) : (_) => _[t]), e > 2 && (u.set = d ? (_, L) => V(_, i, L, e ^ 4 ? o : p.set) : (_, L) => _[t] = L)), h = (0, c[A])(e ? e < 4 ? d ? o : p[f] : e > 4 ? void 0 : { get: p.get, set: p.set } : i, w), x._ = 1, e ^ 4 || h === void 0 ? v(h) && (e > 4 ? k.unshift(h) : e ? d ? o = h : p[f] = h : i = h) : typeof h != "object" || h === null ? y("Object expected") : (v(a = h.get) && (p.get = a), v(a = h.set) && (p.set = a), v(a = h.init) && k.unshift(a));
  return e || X(s, i), p && j(i, t, p), d ? e ^ 4 ? o : p : i;
}, P = (s, n, t) => q(s, typeof n != "symbol" ? n + "" : n, t), B = (s, n, t) => n.has(s) || y("Cannot " + t), Z = (s, n) => Object(n) !== n ? y('Cannot use the "in" operator on this value') : s.has(n), N = (s, n, t) => (B(s, n, "read from private field"), t ? t.call(s) : n.get(s));
var V = (s, n, t, c) => (B(s, n, "write to private field"), c ? c.call(s, t) : n.set(s, t), t), C = (s, n, t) => (B(s, n, "access private method"), t);
import { LitElement as D, html as E, css as S } from "lit";
import { property as M, state as G, customElement as ss } from "lit/decorators.js";
var H, I, J, O, Q, r;
Q = [ss("meraki-ssid-card")];
class g extends (O = D, J = [M({ attribute: !1 })], I = [G()], H = [G()], O) {
  constructor() {
    super(...arguments);
    P(this, "hass", l(r, 8, this)), l(r, 11, this);
    P(this, "_config", l(r, 12, this)), l(r, 15, this);
    P(this, "_showPsk", l(r, 16, this, !1)), l(r, 19, this);
  }
  static async getConfigElement() {
    return await import("./meraki-ssid-card-editor.js"), document.createElement("meraki-ssid-card-editor");
  }
  static getStubConfig() {
    return {
      network_id: "",
      ssid_number: 0,
      show_psk: !0,
      show_clients: !0,
      show_toggle: !0
    };
  }
  setConfig(t) {
    if (!t.network_id || t.ssid_number === void 0)
      throw new Error("You need to define network_id and ssid_number");
    this._config = t;
  }
  _togglePsk() {
    this._showPsk = !this._showPsk;
  }
  _toggleSSID(t) {
    const c = t.target.entityId;
    this.hass.callService("switch", "toggle", {
      entity_id: c
    });
  }
  render() {
    var m, d, $, f, k, U;
    if (!this._config || !this.hass)
      return E``;
    const { network_id: t, ssid_number: c } = this._config, i = `sensor.meraki_${t.replace(/-/g, "_")}_ssid_${c}`, o = ((m = this.hass.states[`${i}_name`]) == null ? void 0 : m.state) || "Unknown SSID", a = this.hass.states[`switch.meraki_${t.replace(/-/g, "_")}_ssid_${c}_enabled`], h = ((d = this.hass.states[`${i}_client_count`]) == null ? void 0 : d.state) || "0", x = (($ = this.hass.states[`${i}_psk`]) == null ? void 0 : $.state) || "********", w = ((f = this.hass.states[`${i}_auth_mode`]) == null ? void 0 : f.state) || "Unknown", u = ((k = this.hass.states[`${i}_vlan`]) == null ? void 0 : k.state) || "Unknown", e = ((U = this.hass.states[`${i}_band`]) == null ? void 0 : U.state) || "Unknown";
    return E`
      <ha-card .header=${o}>
        <div class="card-content">
          ${this._config.show_toggle ? E`
            <div class="row">
              <ha-switch
                .checked=${(a == null ? void 0 : a.state) === "on"}
                .entityId=${a == null ? void 0 : a.entity_id}
                @change=${this._toggleSSID}
              ></ha-switch>
              <span>${(a == null ? void 0 : a.state) === "on" ? "Enabled" : "Disabled"}</span>
            </div>
          ` : ""}
          ${this._config.show_clients ? E`<div class="row"><span>Clients:</span> <span>${h}</span></div>` : ""}
          <div class="row"><span>Auth Mode:</span> <span>${w}</span></div>
          <div class="row"><span>VLAN:</span> <span>${u}</span></div>
          <div class="row"><span>Band:</span> <span>${e}</span></div>
          ${this._config.show_psk ? E`
            <div class="row">
              <span>PSK:</span>
              <span>${this._showPsk ? x : "********"}</span>
              <ha-icon-button @click=${this._togglePsk} .icon=${this._showPsk ? "mdi:eye-off" : "mdi:eye"}></ha-icon-button>
            </div>
          ` : ""}
        </div>
      </ha-card>
    `;
  }
}
r = z(O), b(r, 5, "hass", J, g), b(r, 5, "_config", I, g), b(r, 5, "_showPsk", H, g), g = b(r, 0, "MerakiSSIDCard", Q, g), P(g, "styles", S`
    .row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
    }
  `), l(r, 1, g);
export {
  g as MerakiSSIDCard
};

var X = Object.create;
var L = Object.defineProperty;
var Y = Object.getOwnPropertyDescriptor;
var H = (e, t) => (t = Symbol[e]) ? t : Symbol.for("Symbol." + e), d = (e) => {
  throw TypeError(e);
};
var J = (e, t, s) => t in e ? L(e, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : e[t] = s;
var A = (e, t) => L(e, "name", { value: t, configurable: !0 });
var K = (e) => [, , , X((e == null ? void 0 : e[H("metadata")]) ?? null)], N = ["class", "method", "getter", "setter", "accessor", "field", "value", "get", "set"], b = (e) => e !== void 0 && typeof e != "function" ? d("Function expected") : e, Z = (e, t, s, n, a) => ({ kind: N[e], name: t, metadata: n, addInitializer: (c) => s._ ? d("Already initialized") : a.push(b(c || null)) }), E = (e, t) => J(t, H("metadata"), e[3]), r = (e, t, s, n) => {
  for (var a = 0, c = e[t >> 1], g = c && c.length; a < g; a++) t & 1 ? c[a].call(s) : n = c[a].call(s, n);
  return n;
}, p = (e, t, s, n, a, c) => {
  var g, i, j, f, v, o = t & 7, y = !!(t & 8), _ = !!(t & 16), $ = o > 3 ? e.length + 1 : o ? y ? 1 : 2 : 0, q = N[o + 5], z = o > 3 && (e[$ - 1] = []), W = e[$] || (e[$] = []), l = o && (!_ && !y && (a = a.prototype), o < 5 && (o > 3 || !_) && Y(o < 4 ? a : { get [s]() {
    return F(this, c);
  }, set [s](m) {
    return G(this, c, m);
  } }, s));
  o ? _ && o < 4 && A(c, (o > 2 ? "set " : o > 1 ? "get " : "") + s) : A(a, s);
  for (var x = n.length - 1; x >= 0; x--)
    f = Z(o, s, j = {}, e[3], W), o && (f.static = y, f.private = _, v = f.access = { has: _ ? (m) => C(a, m) : (m) => s in m }, o ^ 3 && (v.get = _ ? (m) => (o ^ 1 ? F : D)(m, a, o ^ 4 ? c : l.get) : (m) => m[s]), o > 2 && (v.set = _ ? (m, k) => G(m, a, k, o ^ 4 ? c : l.set) : (m, k) => m[s] = k)), i = (0, n[x])(o ? o < 4 ? _ ? c : l[q] : o > 4 ? void 0 : { get: l.get, set: l.set } : a, f), j._ = 1, o ^ 4 || i === void 0 ? b(i) && (o > 4 ? z.unshift(i) : o ? _ ? c = i : l[q] = i : a = i) : typeof i != "object" || i === null ? d("Object expected") : (b(g = i.get) && (l.get = g), b(g = i.set) && (l.set = g), b(g = i.init) && z.unshift(g));
  return o || E(e, a), l && L(a, s, l), _ ? o ^ 4 ? c : l : a;
}, w = (e, t, s) => J(e, typeof t != "symbol" ? t + "" : t, s), B = (e, t, s) => t.has(e) || d("Cannot " + s), C = (e, t) => Object(t) !== t ? d('Cannot use the "in" operator on this value') : e.has(t), F = (e, t, s) => (B(e, t, "read from private field"), s ? s.call(e) : t.get(e));
var G = (e, t, s, n) => (B(e, t, "write to private field"), n ? n.call(e, s) : t.set(e, s), s), D = (e, t, s) => (B(e, t, "access private method"), s);
import { LitElement as I, html as O, css as M } from "lit";
import { property as S, state as ee, customElement as se } from "lit/decorators.js";
var P, Q;
(function(e) {
  e.language = "language", e.system = "system", e.comma_decimal = "comma_decimal", e.decimal_comma = "decimal_comma", e.space_comma = "space_comma", e.none = "none";
})(P || (P = {})), function(e) {
  e.language = "language", e.system = "system", e.am_pm = "12", e.twenty_four = "24";
}(Q || (Q = {}));
var te = function(e, t, s, n) {
  n = n || {}, s = s ?? {};
  var a = new Event(t, { bubbles: n.bubbles === void 0 || n.bubbles, cancelable: !!n.cancelable, composed: n.composed === void 0 || n.composed });
  return a.detail = s, e.dispatchEvent(a), a;
}, R, T, U, V, h;
V = [se("meraki-ssid-card-editor")];
class u extends (U = I, T = [S({ attribute: !1 })], R = [ee()], U) {
  constructor() {
    super(...arguments);
    w(this, "hass", r(h, 8, this)), r(h, 11, this);
    w(this, "_config", r(h, 12, this)), r(h, 15, this);
  }
  setConfig(s) {
    this._config = s;
  }
  get _network_id() {
    var s;
    return ((s = this._config) == null ? void 0 : s.network_id) || "";
  }
  get _ssid_number() {
    var s;
    return ((s = this._config) == null ? void 0 : s.ssid_number) ?? 0;
  }
  get _show_psk() {
    var s;
    return ((s = this._config) == null ? void 0 : s.show_psk) ?? !0;
  }
  get _show_clients() {
    var s;
    return ((s = this._config) == null ? void 0 : s.show_clients) ?? !0;
  }
  get _show_toggle() {
    var s;
    return ((s = this._config) == null ? void 0 : s.show_toggle) ?? !0;
  }
  render() {
    if (!this.hass || !this._config)
      return O``;
    const s = [
      { name: "network_id", selector: { text: {} } },
      { name: "ssid_number", selector: { number: { min: 0, max: 14, mode: "slider" } } },
      { name: "show_psk", selector: { boolean: {} } },
      { name: "show_clients", selector: { boolean: {} } },
      { name: "show_toggle", selector: { boolean: {} } }
    ];
    return O`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${s}
        .computeLabel=${(n) => n.name}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }
  _valueChanged(s) {
    const n = s.detail.value;
    te(this, "config-changed", { config: n });
  }
}
h = K(U), p(h, 5, "hass", T, u), p(h, 5, "_config", R, u), u = p(h, 0, "MerakiSSIDCardEditor", V, u), w(u, "styles", M`
    :host {
      display: block;
    }
  `), r(h, 1, u);
export {
  u as MerakiSSIDCardEditor
};

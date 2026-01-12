var Y = Object.create;
var L = Object.defineProperty;
var Z = Object.getOwnPropertyDescriptor;
var J = (e, t) => (t = Symbol[e]) ? t : Symbol.for("Symbol." + e), f = (e) => {
  throw TypeError(e);
};
var K = (e, t, s) => t in e ? L(e, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : e[t] = s;
var F = (e, t) => L(e, "name", { value: t, configurable: !0 });
var N = (e) => [, , , Y((e == null ? void 0 : e[J("metadata")]) ?? null)], O = ["class", "method", "getter", "setter", "accessor", "field", "value", "get", "set"], d = (e) => e !== void 0 && typeof e != "function" ? f("Function expected") : e, E = (e, t, s, n, a) => ({ kind: O[e], name: t, metadata: n, addInitializer: (c) => s._ ? f("Already initialized") : a.push(d(c || null)) }), C = (e, t) => K(t, J("metadata"), e[3]), g = (e, t, s, n) => {
  for (var a = 0, c = e[t >> 1], h = c && c.length; a < h; a++) t & 1 ? c[a].call(s) : n = c[a].call(s, n);
  return n;
}, p = (e, t, s, n, a, c) => {
  var h, i, q, b, v, o = t & 7, y = !!(t & 8), _ = !!(t & 16), k = o > 3 ? e.length + 1 : o ? y ? 1 : 2 : 0, z = O[o + 5], A = o > 3 && (e[k - 1] = []), X = e[k] || (e[k] = []), l = o && (!_ && !y && (a = a.prototype), o < 5 && (o > 3 || !_) && Z(o < 4 ? a : { get [s]() {
    return G(this, c);
  }, set [s](m) {
    return H(this, c, m);
  } }, s));
  o ? _ && o < 4 && F(c, (o > 2 ? "set " : o > 1 ? "get " : "") + s) : F(a, s);
  for (var $ = n.length - 1; $ >= 0; $--)
    b = E(o, s, q = {}, e[3], X), o && (b.static = y, b.private = _, v = b.access = { has: _ ? (m) => D(a, m) : (m) => s in m }, o ^ 3 && (v.get = _ ? (m) => (o ^ 1 ? G : I)(m, a, o ^ 4 ? c : l.get) : (m) => m[s]), o > 2 && (v.set = _ ? (m, x) => H(m, a, x, o ^ 4 ? c : l.set) : (m, x) => m[s] = x)), i = (0, n[$])(o ? o < 4 ? _ ? c : l[z] : o > 4 ? void 0 : { get: l.get, set: l.set } : a, b), q._ = 1, o ^ 4 || i === void 0 ? d(i) && (o > 4 ? A.unshift(i) : o ? _ ? c = i : l[z] = i : a = i) : typeof i != "object" || i === null ? f("Object expected") : (d(h = i.get) && (l.get = h), d(h = i.set) && (l.set = h), d(h = i.init) && A.unshift(h));
  return o || C(e, a), l && L(a, s, l), _ ? o ^ 4 ? c : l : a;
}, w = (e, t, s) => K(e, typeof t != "symbol" ? t + "" : t, s), j = (e, t, s) => t.has(e) || f("Cannot " + s), D = (e, t) => Object(t) !== t ? f('Cannot use the "in" operator on this value') : e.has(t), G = (e, t, s) => (j(e, t, "read from private field"), s ? s.call(e) : t.get(e));
var H = (e, t, s, n) => (j(e, t, "write to private field"), n ? n.call(e, s) : t.set(e, s), s), I = (e, t, s) => (j(e, t, "access private method"), s);
import { LitElement as M, html as P, css as S } from "lit";
import { property as ee, state as se, customElement as te } from "lit/decorators.js";
import { object as oe, boolean as B, number as ne, string as ae } from "superstruct";
var Q, R;
(function(e) {
  e.language = "language", e.system = "system", e.comma_decimal = "comma_decimal", e.decimal_comma = "decimal_comma", e.space_comma = "space_comma", e.none = "none";
})(Q || (Q = {})), function(e) {
  e.language = "language", e.system = "system", e.am_pm = "12", e.twenty_four = "24";
}(R || (R = {}));
var ce = function(e, t, s, n) {
  n = n || {}, s = s ?? {};
  var a = new Event(t, { bubbles: n.bubbles === void 0 || n.bubbles, cancelable: !!n.cancelable, composed: n.composed === void 0 || n.composed });
  return a.detail = s, e.dispatchEvent(a), a;
};
oe({
  network_id: ae(),
  ssid_number: ne(),
  show_psk: B(),
  show_clients: B(),
  show_toggle: B()
});
var T, U, V, W, r;
W = [te("meraki-ssid-card-editor")];
class u extends (V = M, U = [ee({ attribute: !1 })], T = [se()], V) {
  constructor() {
    super(...arguments);
    w(this, "hass", g(r, 8, this)), g(r, 11, this);
    w(this, "_config", g(r, 12, this)), g(r, 15, this);
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
      return P``;
    const s = [
      { name: "network_id", selector: { text: {} } },
      { name: "ssid_number", selector: { number: { min: 0, max: 14, mode: "slider" } } },
      { name: "show_psk", selector: { boolean: {} } },
      { name: "show_clients", selector: { boolean: {} } },
      { name: "show_toggle", selector: { boolean: {} } }
    ];
    return P`
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
    ce(this, "config-changed", { config: n });
  }
}
r = N(V), p(r, 5, "hass", U, u), p(r, 5, "_config", T, u), u = p(r, 0, "MerakiSSIDCardEditor", W, u), w(u, "styles", S`
    :host {
      display: block;
    }
  `), g(r, 1, u);
export {
  u as MerakiSSIDCardEditor
};

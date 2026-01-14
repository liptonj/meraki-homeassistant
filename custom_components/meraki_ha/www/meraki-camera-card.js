var pb = Object.create;
var d0 = Object.defineProperty;
var vb = Object.getOwnPropertyDescriptor;
var tR = (U, $) => ($ = Symbol[U]) ? $ : Symbol.for("Symbol." + U), Mp = (U) => {
  throw TypeError(U);
};
var nR = (U, $, x) => $ in U ? d0(U, $, { enumerable: !0, configurable: !0, writable: !0, value: x }) : U[$] = x;
var ZT = (U, $) => d0(U, "name", { value: $, configurable: !0 });
var p0 = (U) => [, , , pb((U == null ? void 0 : U[tR("metadata")]) ?? null)], rR = ["class", "method", "getter", "setter", "accessor", "field", "value", "get", "set"], Op = (U) => U !== void 0 && typeof U != "function" ? Mp("Function expected") : U, hb = (U, $, x, Je, we) => ({ kind: rR[U], name: $, metadata: Je, addInitializer: (Ue) => x._ ? Mp("Already initialized") : we.push(Op(Ue || null)) }), mb = (U, $) => nR($, tR("metadata"), U[3]), li = (U, $, x, Je) => {
  for (var we = 0, Ue = U[$ >> 1], g = Ue && Ue.length; we < g; we++) $ & 1 ? Ue[we].call(x) : Je = Ue[we].call(x, Je);
  return Je;
}, cs = (U, $, x, Je, we, Ue) => {
  var g, it, ge, le, Dt, P = $ & 7, me = !!($ & 8), J = !!($ & 16), Oe = P > 3 ? U.length + 1 : P ? me ? 1 : 2 : 0, Ge = rR[P + 5], et = P > 3 && (U[Oe - 1] = []), Pn = U[Oe] || (U[Oe] = []), lt = P && (!J && !me && (we = we.prototype), P < 5 && (P > 3 || !J) && vb(P < 4 ? we : { get [x]() {
    return JT(this, Ue);
  }, set [x](be) {
    return eR(this, Ue, be);
  } }, x));
  P ? J && P < 4 && ZT(Ue, (P > 2 ? "set " : P > 1 ? "get " : "") + x) : ZT(we, x);
  for (var De = Je.length - 1; De >= 0; De--)
    le = hb(P, x, ge = {}, U[3], Pn), P && (le.static = me, le.private = J, Dt = le.access = { has: J ? (be) => yb(we, be) : (be) => x in be }, P ^ 3 && (Dt.get = J ? (be) => (P ^ 1 ? JT : gb)(be, we, P ^ 4 ? Ue : lt.get) : (be) => be[x]), P > 2 && (Dt.set = J ? (be, _e) => eR(be, we, _e, P ^ 4 ? Ue : lt.set) : (be, _e) => be[x] = _e)), it = (0, Je[De])(P ? P < 4 ? J ? Ue : lt[Ge] : P > 4 ? void 0 : { get: lt.get, set: lt.set } : we, le), ge._ = 1, P ^ 4 || it === void 0 ? Op(it) && (P > 4 ? et.unshift(it) : P ? J ? Ue = it : lt[Ge] = it : we = it) : typeof it != "object" || it === null ? Mp("Object expected") : (Op(g = it.get) && (lt.get = g), Op(g = it.set) && (lt.set = g), Op(g = it.init) && et.unshift(g));
  return P || mb(U, we), lt && d0(we, x, lt), J ? P ^ 4 ? Ue : lt : we;
}, of = (U, $, x) => nR(U, typeof $ != "symbol" ? $ + "" : $, x), v0 = (U, $, x) => $.has(U) || Mp("Cannot " + x), yb = (U, $) => Object($) !== $ ? Mp('Cannot use the "in" operator on this value') : U.has($), JT = (U, $, x) => (v0(U, $, "read from private field"), x ? x.call(U) : $.get(U));
var eR = (U, $, x, Je) => (v0(U, $, "write to private field"), Je ? Je.call(U, x) : $.set(U, x), x), gb = (U, $, x) => (v0(U, $, "access private method"), x);
import { LitElement as SR, html as ER, css as Sb } from "lit";
import { property as Hm, customElement as CR } from "lit/decorators.js";
import { r as TR, g as Eb, R as RR } from "./index-3xPyZM5Y.js";
var y0 = { exports: {} }, $r = {}, Am = { exports: {} }, h0 = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var aR;
function Cb() {
  return aR || (aR = 1, function(U) {
    function $(Q, he) {
      var te = Q.length;
      Q.push(he);
      e: for (; 0 < te; ) {
        var We = te - 1 >>> 1, tt = Q[We];
        if (0 < we(tt, he)) Q[We] = he, Q[te] = tt, te = We;
        else break e;
      }
    }
    function x(Q) {
      return Q.length === 0 ? null : Q[0];
    }
    function Je(Q) {
      if (Q.length === 0) return null;
      var he = Q[0], te = Q.pop();
      if (te !== he) {
        Q[0] = te;
        e: for (var We = 0, tt = Q.length, Wr = tt >>> 1; We < Wr; ) {
          var kn = 2 * (We + 1) - 1, Yi = Q[kn], Yn = kn + 1, Qn = Q[Yn];
          if (0 > we(Yi, te)) Yn < tt && 0 > we(Qn, Yi) ? (Q[We] = Qn, Q[Yn] = te, We = Yn) : (Q[We] = Yi, Q[kn] = te, We = kn);
          else if (Yn < tt && 0 > we(Qn, te)) Q[We] = Qn, Q[Yn] = te, We = Yn;
          else break e;
        }
      }
      return he;
    }
    function we(Q, he) {
      var te = Q.sortIndex - he.sortIndex;
      return te !== 0 ? te : Q.id - he.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var Ue = performance;
      U.unstable_now = function() {
        return Ue.now();
      };
    } else {
      var g = Date, it = g.now();
      U.unstable_now = function() {
        return g.now() - it;
      };
    }
    var ge = [], le = [], Dt = 1, P = null, me = 3, J = !1, Oe = !1, Ge = !1, et = typeof setTimeout == "function" ? setTimeout : null, Pn = typeof clearTimeout == "function" ? clearTimeout : null, lt = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function De(Q) {
      for (var he = x(le); he !== null; ) {
        if (he.callback === null) Je(le);
        else if (he.startTime <= Q) Je(le), he.sortIndex = he.expirationTime, $(ge, he);
        else break;
        he = x(le);
      }
    }
    function be(Q) {
      if (Ge = !1, De(Q), !Oe) if (x(ge) !== null) Oe = !0, Nt(_e);
      else {
        var he = x(le);
        he !== null && Na(be, he.startTime - Q);
      }
    }
    function _e(Q, he) {
      Oe = !1, Ge && (Ge = !1, Pn(wn), wn = -1), J = !0;
      var te = me;
      try {
        for (De(he), P = x(ge); P !== null && (!(P.expirationTime > he) || Q && !It()); ) {
          var We = P.callback;
          if (typeof We == "function") {
            P.callback = null, me = P.priorityLevel;
            var tt = We(P.expirationTime <= he);
            he = U.unstable_now(), typeof tt == "function" ? P.callback = tt : P === x(ge) && Je(ge), De(he);
          } else Je(ge);
          P = x(ge);
        }
        if (P !== null) var Wr = !0;
        else {
          var kn = x(le);
          kn !== null && Na(be, kn.startTime - he), Wr = !1;
        }
        return Wr;
      } finally {
        P = null, me = te, J = !1;
      }
    }
    var mt = !1, Me = null, wn = -1, Ct = 5, Kt = -1;
    function It() {
      return !(U.unstable_now() - Kt < Ct);
    }
    function ft() {
      if (Me !== null) {
        var Q = U.unstable_now();
        Kt = Q;
        var he = !0;
        try {
          he = Me(!0, Q);
        } finally {
          he ? Le() : (mt = !1, Me = null);
        }
      } else mt = !1;
    }
    var Le;
    if (typeof lt == "function") Le = function() {
      lt(ft);
    };
    else if (typeof MessageChannel < "u") {
      var gn = new MessageChannel(), Dn = gn.port2;
      gn.port1.onmessage = ft, Le = function() {
        Dn.postMessage(null);
      };
    } else Le = function() {
      et(ft, 0);
    };
    function Nt(Q) {
      Me = Q, mt || (mt = !0, Le());
    }
    function Na(Q, he) {
      wn = et(function() {
        Q(U.unstable_now());
      }, he);
    }
    U.unstable_IdlePriority = 5, U.unstable_ImmediatePriority = 1, U.unstable_LowPriority = 4, U.unstable_NormalPriority = 3, U.unstable_Profiling = null, U.unstable_UserBlockingPriority = 2, U.unstable_cancelCallback = function(Q) {
      Q.callback = null;
    }, U.unstable_continueExecution = function() {
      Oe || J || (Oe = !0, Nt(_e));
    }, U.unstable_forceFrameRate = function(Q) {
      0 > Q || 125 < Q ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : Ct = 0 < Q ? Math.floor(1e3 / Q) : 5;
    }, U.unstable_getCurrentPriorityLevel = function() {
      return me;
    }, U.unstable_getFirstCallbackNode = function() {
      return x(ge);
    }, U.unstable_next = function(Q) {
      switch (me) {
        case 1:
        case 2:
        case 3:
          var he = 3;
          break;
        default:
          he = me;
      }
      var te = me;
      me = he;
      try {
        return Q();
      } finally {
        me = te;
      }
    }, U.unstable_pauseExecution = function() {
    }, U.unstable_requestPaint = function() {
    }, U.unstable_runWithPriority = function(Q, he) {
      switch (Q) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          Q = 3;
      }
      var te = me;
      me = Q;
      try {
        return he();
      } finally {
        me = te;
      }
    }, U.unstable_scheduleCallback = function(Q, he, te) {
      var We = U.unstable_now();
      switch (typeof te == "object" && te !== null ? (te = te.delay, te = typeof te == "number" && 0 < te ? We + te : We) : te = We, Q) {
        case 1:
          var tt = -1;
          break;
        case 2:
          tt = 250;
          break;
        case 5:
          tt = 1073741823;
          break;
        case 4:
          tt = 1e4;
          break;
        default:
          tt = 5e3;
      }
      return tt = te + tt, Q = { id: Dt++, callback: he, priorityLevel: Q, startTime: te, expirationTime: tt, sortIndex: -1 }, te > We ? (Q.sortIndex = te, $(le, Q), x(ge) === null && Q === x(le) && (Ge ? (Pn(wn), wn = -1) : Ge = !0, Na(be, te - We))) : (Q.sortIndex = tt, $(ge, Q), Oe || J || (Oe = !0, Nt(_e))), Q;
    }, U.unstable_shouldYield = It, U.unstable_wrapCallback = function(Q) {
      var he = me;
      return function() {
        var te = me;
        me = he;
        try {
          return Q.apply(this, arguments);
        } finally {
          me = te;
        }
      };
    };
  }(h0)), h0;
}
var m0 = {};
/**
 * @license React
 * scheduler.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var iR;
function Tb() {
  return iR || (iR = 1, function(U) {
    process.env.NODE_ENV !== "production" && function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var $ = !1, x = 5;
      function Je(I, de) {
        var Ne = I.length;
        I.push(de), g(I, de, Ne);
      }
      function we(I) {
        return I.length === 0 ? null : I[0];
      }
      function Ue(I) {
        if (I.length === 0)
          return null;
        var de = I[0], Ne = I.pop();
        return Ne !== de && (I[0] = Ne, it(I, Ne, 0)), de;
      }
      function g(I, de, Ne) {
        for (var ut = Ne; ut > 0; ) {
          var Tt = ut - 1 >>> 1, $n = I[Tt];
          if (ge($n, de) > 0)
            I[Tt] = de, I[ut] = $n, ut = Tt;
          else
            return;
        }
      }
      function it(I, de, Ne) {
        for (var ut = Ne, Tt = I.length, $n = Tt >>> 1; ut < $n; ) {
          var zt = (ut + 1) * 2 - 1, Gn = I[zt], Ut = zt + 1, Rt = I[Ut];
          if (ge(Gn, de) < 0)
            Ut < Tt && ge(Rt, Gn) < 0 ? (I[ut] = Rt, I[Ut] = de, ut = Ut) : (I[ut] = Gn, I[zt] = de, ut = zt);
          else if (Ut < Tt && ge(Rt, de) < 0)
            I[ut] = Rt, I[Ut] = de, ut = Ut;
          else
            return;
        }
      }
      function ge(I, de) {
        var Ne = I.sortIndex - de.sortIndex;
        return Ne !== 0 ? Ne : I.id - de.id;
      }
      var le = 1, Dt = 2, P = 3, me = 4, J = 5;
      function Oe(I, de) {
      }
      var Ge = typeof performance == "object" && typeof performance.now == "function";
      if (Ge) {
        var et = performance;
        U.unstable_now = function() {
          return et.now();
        };
      } else {
        var Pn = Date, lt = Pn.now();
        U.unstable_now = function() {
          return Pn.now() - lt;
        };
      }
      var De = 1073741823, be = -1, _e = 250, mt = 5e3, Me = 1e4, wn = De, Ct = [], Kt = [], It = 1, ft = null, Le = P, gn = !1, Dn = !1, Nt = !1, Na = typeof setTimeout == "function" ? setTimeout : null, Q = typeof clearTimeout == "function" ? clearTimeout : null, he = typeof setImmediate < "u" ? setImmediate : null;
      typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
      function te(I) {
        for (var de = we(Kt); de !== null; ) {
          if (de.callback === null)
            Ue(Kt);
          else if (de.startTime <= I)
            Ue(Kt), de.sortIndex = de.expirationTime, Je(Ct, de);
          else
            return;
          de = we(Kt);
        }
      }
      function We(I) {
        if (Nt = !1, te(I), !Dn)
          if (we(Ct) !== null)
            Dn = !0, pr(tt);
          else {
            var de = we(Kt);
            de !== null && da(We, de.startTime - I);
          }
      }
      function tt(I, de) {
        Dn = !1, Nt && (Nt = !1, Ii()), gn = !0;
        var Ne = Le;
        try {
          var ut;
          if (!$) return Wr(I, de);
        } finally {
          ft = null, Le = Ne, gn = !1;
        }
      }
      function Wr(I, de) {
        var Ne = de;
        for (te(Ne), ft = we(Ct); ft !== null && !(ft.expirationTime > Ne && (!I || Pu())); ) {
          var ut = ft.callback;
          if (typeof ut == "function") {
            ft.callback = null, Le = ft.priorityLevel;
            var Tt = ft.expirationTime <= Ne, $n = ut(Tt);
            Ne = U.unstable_now(), typeof $n == "function" ? ft.callback = $n : ft === we(Ct) && Ue(Ct), te(Ne);
          } else
            Ue(Ct);
          ft = we(Ct);
        }
        if (ft !== null)
          return !0;
        var zt = we(Kt);
        return zt !== null && da(We, zt.startTime - Ne), !1;
      }
      function kn(I, de) {
        switch (I) {
          case le:
          case Dt:
          case P:
          case me:
          case J:
            break;
          default:
            I = P;
        }
        var Ne = Le;
        Le = I;
        try {
          return de();
        } finally {
          Le = Ne;
        }
      }
      function Yi(I) {
        var de;
        switch (Le) {
          case le:
          case Dt:
          case P:
            de = P;
            break;
          default:
            de = Le;
            break;
        }
        var Ne = Le;
        Le = de;
        try {
          return I();
        } finally {
          Le = Ne;
        }
      }
      function Yn(I) {
        var de = Le;
        return function() {
          var Ne = Le;
          Le = de;
          try {
            return I.apply(this, arguments);
          } finally {
            Le = Ne;
          }
        };
      }
      function Qn(I, de, Ne) {
        var ut = U.unstable_now(), Tt;
        if (typeof Ne == "object" && Ne !== null) {
          var $n = Ne.delay;
          typeof $n == "number" && $n > 0 ? Tt = ut + $n : Tt = ut;
        } else
          Tt = ut;
        var zt;
        switch (I) {
          case le:
            zt = be;
            break;
          case Dt:
            zt = _e;
            break;
          case J:
            zt = wn;
            break;
          case me:
            zt = Me;
            break;
          case P:
          default:
            zt = mt;
            break;
        }
        var Gn = Tt + zt, Ut = {
          id: It++,
          callback: de,
          priorityLevel: I,
          startTime: Tt,
          expirationTime: Gn,
          sortIndex: -1
        };
        return Tt > ut ? (Ut.sortIndex = Tt, Je(Kt, Ut), we(Ct) === null && Ut === we(Kt) && (Nt ? Ii() : Nt = !0, da(We, Tt - ut))) : (Ut.sortIndex = Gn, Je(Ct, Ut), !Dn && !gn && (Dn = !0, pr(tt))), Ut;
      }
      function wr() {
      }
      function sa() {
        !Dn && !gn && (Dn = !0, pr(tt));
      }
      function ui() {
        return we(Ct);
      }
      function Sn(I) {
        I.callback = null;
      }
      function ca() {
        return Le;
      }
      var In = !1, fr = null, Dr = -1, fa = x, Ql = -1;
      function Pu() {
        var I = U.unstable_now() - Ql;
        return !(I < fa);
      }
      function Yu() {
      }
      function Qi(I) {
        if (I < 0 || I > 125) {
          console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported");
          return;
        }
        I > 0 ? fa = Math.floor(1e3 / I) : fa = x;
      }
      var dr = function() {
        if (fr !== null) {
          var I = U.unstable_now();
          Ql = I;
          var de = !0, Ne = !0;
          try {
            Ne = fr(de, I);
          } finally {
            Ne ? kr() : (In = !1, fr = null);
          }
        } else
          In = !1;
      }, kr;
      if (typeof he == "function")
        kr = function() {
          he(dr);
        };
      else if (typeof MessageChannel < "u") {
        var Xr = new MessageChannel(), Il = Xr.port2;
        Xr.port1.onmessage = dr, kr = function() {
          Il.postMessage(null);
        };
      } else
        kr = function() {
          Na(dr, 0);
        };
      function pr(I) {
        fr = I, In || (In = !0, kr());
      }
      function da(I, de) {
        Dr = Na(function() {
          I(U.unstable_now());
        }, de);
      }
      function Ii() {
        Q(Dr), Dr = -1;
      }
      var $i = Yu, Qu = null;
      U.unstable_IdlePriority = J, U.unstable_ImmediatePriority = le, U.unstable_LowPriority = me, U.unstable_NormalPriority = P, U.unstable_Profiling = Qu, U.unstable_UserBlockingPriority = Dt, U.unstable_cancelCallback = Sn, U.unstable_continueExecution = sa, U.unstable_forceFrameRate = Qi, U.unstable_getCurrentPriorityLevel = ca, U.unstable_getFirstCallbackNode = ui, U.unstable_next = Yi, U.unstable_pauseExecution = wr, U.unstable_requestPaint = $i, U.unstable_runWithPriority = kn, U.unstable_scheduleCallback = Qn, U.unstable_shouldYield = Pu, U.unstable_wrapCallback = Yn, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    }();
  }(m0)), m0;
}
var lR;
function xR() {
  return lR || (lR = 1, process.env.NODE_ENV === "production" ? Am.exports = Cb() : Am.exports = Tb()), Am.exports;
}
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var uR;
function Rb() {
  if (uR) return $r;
  uR = 1;
  var U = TR, $ = xR();
  function x(n) {
    for (var r = "https://reactjs.org/docs/error-decoder.html?invariant=" + n, l = 1; l < arguments.length; l++) r += "&args[]=" + encodeURIComponent(arguments[l]);
    return "Minified React error #" + n + "; visit " + r + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var Je = /* @__PURE__ */ new Set(), we = {};
  function Ue(n, r) {
    g(n, r), g(n + "Capture", r);
  }
  function g(n, r) {
    for (we[n] = r, n = 0; n < r.length; n++) Je.add(r[n]);
  }
  var it = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), ge = Object.prototype.hasOwnProperty, le = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, Dt = {}, P = {};
  function me(n) {
    return ge.call(P, n) ? !0 : ge.call(Dt, n) ? !1 : le.test(n) ? P[n] = !0 : (Dt[n] = !0, !1);
  }
  function J(n, r, l, o) {
    if (l !== null && l.type === 0) return !1;
    switch (typeof r) {
      case "function":
      case "symbol":
        return !0;
      case "boolean":
        return o ? !1 : l !== null ? !l.acceptsBooleans : (n = n.toLowerCase().slice(0, 5), n !== "data-" && n !== "aria-");
      default:
        return !1;
    }
  }
  function Oe(n, r, l, o) {
    if (r === null || typeof r > "u" || J(n, r, l, o)) return !0;
    if (o) return !1;
    if (l !== null) switch (l.type) {
      case 3:
        return !r;
      case 4:
        return r === !1;
      case 5:
        return isNaN(r);
      case 6:
        return isNaN(r) || 1 > r;
    }
    return !1;
  }
  function Ge(n, r, l, o, c, d, h) {
    this.acceptsBooleans = r === 2 || r === 3 || r === 4, this.attributeName = o, this.attributeNamespace = c, this.mustUseProperty = l, this.propertyName = n, this.type = r, this.sanitizeURL = d, this.removeEmptyString = h;
  }
  var et = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n) {
    et[n] = new Ge(n, 0, !1, n, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(n) {
    var r = n[0];
    et[r] = new Ge(r, 1, !1, n[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(n) {
    et[n] = new Ge(n, 2, !1, n.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(n) {
    et[n] = new Ge(n, 2, !1, n, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n) {
    et[n] = new Ge(n, 3, !1, n.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(n) {
    et[n] = new Ge(n, 3, !0, n, null, !1, !1);
  }), ["capture", "download"].forEach(function(n) {
    et[n] = new Ge(n, 4, !1, n, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(n) {
    et[n] = new Ge(n, 6, !1, n, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(n) {
    et[n] = new Ge(n, 5, !1, n.toLowerCase(), null, !1, !1);
  });
  var Pn = /[\-:]([a-z])/g;
  function lt(n) {
    return n[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n) {
    var r = n.replace(
      Pn,
      lt
    );
    et[r] = new Ge(r, 1, !1, n, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n) {
    var r = n.replace(Pn, lt);
    et[r] = new Ge(r, 1, !1, n, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(n) {
    var r = n.replace(Pn, lt);
    et[r] = new Ge(r, 1, !1, n, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(n) {
    et[n] = new Ge(n, 1, !1, n.toLowerCase(), null, !1, !1);
  }), et.xlinkHref = new Ge("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(n) {
    et[n] = new Ge(n, 1, !1, n.toLowerCase(), null, !0, !0);
  });
  function De(n, r, l, o) {
    var c = et.hasOwnProperty(r) ? et[r] : null;
    (c !== null ? c.type !== 0 : o || !(2 < r.length) || r[0] !== "o" && r[0] !== "O" || r[1] !== "n" && r[1] !== "N") && (Oe(r, l, c, o) && (l = null), o || c === null ? me(r) && (l === null ? n.removeAttribute(r) : n.setAttribute(r, "" + l)) : c.mustUseProperty ? n[c.propertyName] = l === null ? c.type === 3 ? !1 : "" : l : (r = c.attributeName, o = c.attributeNamespace, l === null ? n.removeAttribute(r) : (c = c.type, l = c === 3 || c === 4 && l === !0 ? "" : "" + l, o ? n.setAttributeNS(o, r, l) : n.setAttribute(r, l))));
  }
  var be = U.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, _e = Symbol.for("react.element"), mt = Symbol.for("react.portal"), Me = Symbol.for("react.fragment"), wn = Symbol.for("react.strict_mode"), Ct = Symbol.for("react.profiler"), Kt = Symbol.for("react.provider"), It = Symbol.for("react.context"), ft = Symbol.for("react.forward_ref"), Le = Symbol.for("react.suspense"), gn = Symbol.for("react.suspense_list"), Dn = Symbol.for("react.memo"), Nt = Symbol.for("react.lazy"), Na = Symbol.for("react.offscreen"), Q = Symbol.iterator;
  function he(n) {
    return n === null || typeof n != "object" ? null : (n = Q && n[Q] || n["@@iterator"], typeof n == "function" ? n : null);
  }
  var te = Object.assign, We;
  function tt(n) {
    if (We === void 0) try {
      throw Error();
    } catch (l) {
      var r = l.stack.trim().match(/\n( *(at )?)/);
      We = r && r[1] || "";
    }
    return `
` + We + n;
  }
  var Wr = !1;
  function kn(n, r) {
    if (!n || Wr) return "";
    Wr = !0;
    var l = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      if (r) if (r = function() {
        throw Error();
      }, Object.defineProperty(r.prototype, "props", { set: function() {
        throw Error();
      } }), typeof Reflect == "object" && Reflect.construct) {
        try {
          Reflect.construct(r, []);
        } catch (L) {
          var o = L;
        }
        Reflect.construct(n, [], r);
      } else {
        try {
          r.call();
        } catch (L) {
          o = L;
        }
        n.call(r.prototype);
      }
      else {
        try {
          throw Error();
        } catch (L) {
          o = L;
        }
        n();
      }
    } catch (L) {
      if (L && o && typeof L.stack == "string") {
        for (var c = L.stack.split(`
`), d = o.stack.split(`
`), h = c.length - 1, S = d.length - 1; 1 <= h && 0 <= S && c[h] !== d[S]; ) S--;
        for (; 1 <= h && 0 <= S; h--, S--) if (c[h] !== d[S]) {
          if (h !== 1 || S !== 1)
            do
              if (h--, S--, 0 > S || c[h] !== d[S]) {
                var E = `
` + c[h].replace(" at new ", " at ");
                return n.displayName && E.includes("<anonymous>") && (E = E.replace("<anonymous>", n.displayName)), E;
              }
            while (1 <= h && 0 <= S);
          break;
        }
      }
    } finally {
      Wr = !1, Error.prepareStackTrace = l;
    }
    return (n = n ? n.displayName || n.name : "") ? tt(n) : "";
  }
  function Yi(n) {
    switch (n.tag) {
      case 5:
        return tt(n.type);
      case 16:
        return tt("Lazy");
      case 13:
        return tt("Suspense");
      case 19:
        return tt("SuspenseList");
      case 0:
      case 2:
      case 15:
        return n = kn(n.type, !1), n;
      case 11:
        return n = kn(n.type.render, !1), n;
      case 1:
        return n = kn(n.type, !0), n;
      default:
        return "";
    }
  }
  function Yn(n) {
    if (n == null) return null;
    if (typeof n == "function") return n.displayName || n.name || null;
    if (typeof n == "string") return n;
    switch (n) {
      case Me:
        return "Fragment";
      case mt:
        return "Portal";
      case Ct:
        return "Profiler";
      case wn:
        return "StrictMode";
      case Le:
        return "Suspense";
      case gn:
        return "SuspenseList";
    }
    if (typeof n == "object") switch (n.$$typeof) {
      case It:
        return (n.displayName || "Context") + ".Consumer";
      case Kt:
        return (n._context.displayName || "Context") + ".Provider";
      case ft:
        var r = n.render;
        return n = n.displayName, n || (n = r.displayName || r.name || "", n = n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef"), n;
      case Dn:
        return r = n.displayName || null, r !== null ? r : Yn(n.type) || "Memo";
      case Nt:
        r = n._payload, n = n._init;
        try {
          return Yn(n(r));
        } catch {
        }
    }
    return null;
  }
  function Qn(n) {
    var r = n.type;
    switch (n.tag) {
      case 24:
        return "Cache";
      case 9:
        return (r.displayName || "Context") + ".Consumer";
      case 10:
        return (r._context.displayName || "Context") + ".Provider";
      case 18:
        return "DehydratedFragment";
      case 11:
        return n = r.render, n = n.displayName || n.name || "", r.displayName || (n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef");
      case 7:
        return "Fragment";
      case 5:
        return r;
      case 4:
        return "Portal";
      case 3:
        return "Root";
      case 6:
        return "Text";
      case 16:
        return Yn(r);
      case 8:
        return r === wn ? "StrictMode" : "Mode";
      case 22:
        return "Offscreen";
      case 12:
        return "Profiler";
      case 21:
        return "Scope";
      case 13:
        return "Suspense";
      case 19:
        return "SuspenseList";
      case 25:
        return "TracingMarker";
      case 1:
      case 0:
      case 17:
      case 2:
      case 14:
      case 15:
        if (typeof r == "function") return r.displayName || r.name || null;
        if (typeof r == "string") return r;
    }
    return null;
  }
  function wr(n) {
    switch (typeof n) {
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return n;
      case "object":
        return n;
      default:
        return "";
    }
  }
  function sa(n) {
    var r = n.type;
    return (n = n.nodeName) && n.toLowerCase() === "input" && (r === "checkbox" || r === "radio");
  }
  function ui(n) {
    var r = sa(n) ? "checked" : "value", l = Object.getOwnPropertyDescriptor(n.constructor.prototype, r), o = "" + n[r];
    if (!n.hasOwnProperty(r) && typeof l < "u" && typeof l.get == "function" && typeof l.set == "function") {
      var c = l.get, d = l.set;
      return Object.defineProperty(n, r, { configurable: !0, get: function() {
        return c.call(this);
      }, set: function(h) {
        o = "" + h, d.call(this, h);
      } }), Object.defineProperty(n, r, { enumerable: l.enumerable }), { getValue: function() {
        return o;
      }, setValue: function(h) {
        o = "" + h;
      }, stopTracking: function() {
        n._valueTracker = null, delete n[r];
      } };
    }
  }
  function Sn(n) {
    n._valueTracker || (n._valueTracker = ui(n));
  }
  function ca(n) {
    if (!n) return !1;
    var r = n._valueTracker;
    if (!r) return !0;
    var l = r.getValue(), o = "";
    return n && (o = sa(n) ? n.checked ? "true" : "false" : n.value), n = o, n !== l ? (r.setValue(n), !0) : !1;
  }
  function In(n) {
    if (n = n || (typeof document < "u" ? document : void 0), typeof n > "u") return null;
    try {
      return n.activeElement || n.body;
    } catch {
      return n.body;
    }
  }
  function fr(n, r) {
    var l = r.checked;
    return te({}, r, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: l ?? n._wrapperState.initialChecked });
  }
  function Dr(n, r) {
    var l = r.defaultValue == null ? "" : r.defaultValue, o = r.checked != null ? r.checked : r.defaultChecked;
    l = wr(r.value != null ? r.value : l), n._wrapperState = { initialChecked: o, initialValue: l, controlled: r.type === "checkbox" || r.type === "radio" ? r.checked != null : r.value != null };
  }
  function fa(n, r) {
    r = r.checked, r != null && De(n, "checked", r, !1);
  }
  function Ql(n, r) {
    fa(n, r);
    var l = wr(r.value), o = r.type;
    if (l != null) o === "number" ? (l === 0 && n.value === "" || n.value != l) && (n.value = "" + l) : n.value !== "" + l && (n.value = "" + l);
    else if (o === "submit" || o === "reset") {
      n.removeAttribute("value");
      return;
    }
    r.hasOwnProperty("value") ? Yu(n, r.type, l) : r.hasOwnProperty("defaultValue") && Yu(n, r.type, wr(r.defaultValue)), r.checked == null && r.defaultChecked != null && (n.defaultChecked = !!r.defaultChecked);
  }
  function Pu(n, r, l) {
    if (r.hasOwnProperty("value") || r.hasOwnProperty("defaultValue")) {
      var o = r.type;
      if (!(o !== "submit" && o !== "reset" || r.value !== void 0 && r.value !== null)) return;
      r = "" + n._wrapperState.initialValue, l || r === n.value || (n.value = r), n.defaultValue = r;
    }
    l = n.name, l !== "" && (n.name = ""), n.defaultChecked = !!n._wrapperState.initialChecked, l !== "" && (n.name = l);
  }
  function Yu(n, r, l) {
    (r !== "number" || In(n.ownerDocument) !== n) && (l == null ? n.defaultValue = "" + n._wrapperState.initialValue : n.defaultValue !== "" + l && (n.defaultValue = "" + l));
  }
  var Qi = Array.isArray;
  function dr(n, r, l, o) {
    if (n = n.options, r) {
      r = {};
      for (var c = 0; c < l.length; c++) r["$" + l[c]] = !0;
      for (l = 0; l < n.length; l++) c = r.hasOwnProperty("$" + n[l].value), n[l].selected !== c && (n[l].selected = c), c && o && (n[l].defaultSelected = !0);
    } else {
      for (l = "" + wr(l), r = null, c = 0; c < n.length; c++) {
        if (n[c].value === l) {
          n[c].selected = !0, o && (n[c].defaultSelected = !0);
          return;
        }
        r !== null || n[c].disabled || (r = n[c]);
      }
      r !== null && (r.selected = !0);
    }
  }
  function kr(n, r) {
    if (r.dangerouslySetInnerHTML != null) throw Error(x(91));
    return te({}, r, { value: void 0, defaultValue: void 0, children: "" + n._wrapperState.initialValue });
  }
  function Xr(n, r) {
    var l = r.value;
    if (l == null) {
      if (l = r.children, r = r.defaultValue, l != null) {
        if (r != null) throw Error(x(92));
        if (Qi(l)) {
          if (1 < l.length) throw Error(x(93));
          l = l[0];
        }
        r = l;
      }
      r == null && (r = ""), l = r;
    }
    n._wrapperState = { initialValue: wr(l) };
  }
  function Il(n, r) {
    var l = wr(r.value), o = wr(r.defaultValue);
    l != null && (l = "" + l, l !== n.value && (n.value = l), r.defaultValue == null && n.defaultValue !== l && (n.defaultValue = l)), o != null && (n.defaultValue = "" + o);
  }
  function pr(n) {
    var r = n.textContent;
    r === n._wrapperState.initialValue && r !== "" && r !== null && (n.value = r);
  }
  function da(n) {
    switch (n) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function Ii(n, r) {
    return n == null || n === "http://www.w3.org/1999/xhtml" ? da(r) : n === "http://www.w3.org/2000/svg" && r === "foreignObject" ? "http://www.w3.org/1999/xhtml" : n;
  }
  var $i, Qu = function(n) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(r, l, o, c) {
      MSApp.execUnsafeLocalFunction(function() {
        return n(r, l, o, c);
      });
    } : n;
  }(function(n, r) {
    if (n.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in n) n.innerHTML = r;
    else {
      for ($i = $i || document.createElement("div"), $i.innerHTML = "<svg>" + r.valueOf().toString() + "</svg>", r = $i.firstChild; n.firstChild; ) n.removeChild(n.firstChild);
      for (; r.firstChild; ) n.appendChild(r.firstChild);
    }
  });
  function I(n, r) {
    if (r) {
      var l = n.firstChild;
      if (l && l === n.lastChild && l.nodeType === 3) {
        l.nodeValue = r;
        return;
      }
    }
    n.textContent = r;
  }
  var de = {
    animationIterationCount: !0,
    aspectRatio: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridArea: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0
  }, Ne = ["Webkit", "ms", "Moz", "O"];
  Object.keys(de).forEach(function(n) {
    Ne.forEach(function(r) {
      r = r + n.charAt(0).toUpperCase() + n.substring(1), de[r] = de[n];
    });
  });
  function ut(n, r, l) {
    return r == null || typeof r == "boolean" || r === "" ? "" : l || typeof r != "number" || r === 0 || de.hasOwnProperty(n) && de[n] ? ("" + r).trim() : r + "px";
  }
  function Tt(n, r) {
    n = n.style;
    for (var l in r) if (r.hasOwnProperty(l)) {
      var o = l.indexOf("--") === 0, c = ut(l, r[l], o);
      l === "float" && (l = "cssFloat"), o ? n.setProperty(l, c) : n[l] = c;
    }
  }
  var $n = te({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function zt(n, r) {
    if (r) {
      if ($n[n] && (r.children != null || r.dangerouslySetInnerHTML != null)) throw Error(x(137, n));
      if (r.dangerouslySetInnerHTML != null) {
        if (r.children != null) throw Error(x(60));
        if (typeof r.dangerouslySetInnerHTML != "object" || !("__html" in r.dangerouslySetInnerHTML)) throw Error(x(61));
      }
      if (r.style != null && typeof r.style != "object") throw Error(x(62));
    }
  }
  function Gn(n, r) {
    if (n.indexOf("-") === -1) return typeof r.is == "string";
    switch (n) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var Ut = null;
  function Rt(n) {
    return n = n.target || n.srcElement || window, n.correspondingUseElement && (n = n.correspondingUseElement), n.nodeType === 3 ? n.parentNode : n;
  }
  var $t = null, $l = null, oi = null;
  function fs(n) {
    if (n = se(n)) {
      if (typeof $t != "function") throw Error(x(280));
      var r = n.stateNode;
      r && (r = yt(r), $t(n.stateNode, n.type, r));
    }
  }
  function Np(n) {
    $l ? oi ? oi.push(n) : oi = [n] : $l = n;
  }
  function zp() {
    if ($l) {
      var n = $l, r = oi;
      if (oi = $l = null, fs(n), r) for (n = 0; n < r.length; n++) fs(r[n]);
    }
  }
  function sf(n, r) {
    return n(r);
  }
  function cf() {
  }
  var ff = !1;
  function df(n, r, l) {
    if (ff) return n(r, l);
    ff = !0;
    try {
      return sf(n, r, l);
    } finally {
      ff = !1, ($l !== null || oi !== null) && (cf(), zp());
    }
  }
  function Gi(n, r) {
    var l = n.stateNode;
    if (l === null) return null;
    var o = yt(l);
    if (o === null) return null;
    l = o[r];
    e: switch (r) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (o = !o.disabled) || (n = n.type, o = !(n === "button" || n === "input" || n === "select" || n === "textarea")), n = !o;
        break e;
      default:
        n = !1;
    }
    if (n) return null;
    if (l && typeof l != "function") throw Error(x(231, r, typeof l));
    return l;
  }
  var si = !1;
  if (it) try {
    var qr = {};
    Object.defineProperty(qr, "passive", { get: function() {
      si = !0;
    } }), window.addEventListener("test", qr, qr), window.removeEventListener("test", qr, qr);
  } catch {
    si = !1;
  }
  function Gl(n, r, l, o, c, d, h, S, E) {
    var L = Array.prototype.slice.call(arguments, 3);
    try {
      r.apply(l, L);
    } catch (F) {
      this.onError(F);
    }
  }
  var Wi = !1, Wl = null, Xl = !1, Iu = null, ql = { onError: function(n) {
    Wi = !0, Wl = n;
  } };
  function ds(n, r, l, o, c, d, h, S, E) {
    Wi = !1, Wl = null, Gl.apply(ql, arguments);
  }
  function ps(n, r, l, o, c, d, h, S, E) {
    if (ds.apply(this, arguments), Wi) {
      if (Wi) {
        var L = Wl;
        Wi = !1, Wl = null;
      } else throw Error(x(198));
      Xl || (Xl = !0, Iu = L);
    }
  }
  function Kr(n) {
    var r = n, l = n;
    if (n.alternate) for (; r.return; ) r = r.return;
    else {
      n = r;
      do
        r = n, r.flags & 4098 && (l = r.return), n = r.return;
      while (n);
    }
    return r.tag === 3 ? l : null;
  }
  function En(n) {
    if (n.tag === 13) {
      var r = n.memoizedState;
      if (r === null && (n = n.alternate, n !== null && (r = n.memoizedState)), r !== null) return r.dehydrated;
    }
    return null;
  }
  function Up(n) {
    if (Kr(n) !== n) throw Error(x(188));
  }
  function Fm(n) {
    var r = n.alternate;
    if (!r) {
      if (r = Kr(n), r === null) throw Error(x(188));
      return r !== n ? null : n;
    }
    for (var l = n, o = r; ; ) {
      var c = l.return;
      if (c === null) break;
      var d = c.alternate;
      if (d === null) {
        if (o = c.return, o !== null) {
          l = o;
          continue;
        }
        break;
      }
      if (c.child === d.child) {
        for (d = c.child; d; ) {
          if (d === l) return Up(c), n;
          if (d === o) return Up(c), r;
          d = d.sibling;
        }
        throw Error(x(188));
      }
      if (l.return !== o.return) l = c, o = d;
      else {
        for (var h = !1, S = c.child; S; ) {
          if (S === l) {
            h = !0, l = c, o = d;
            break;
          }
          if (S === o) {
            h = !0, o = c, l = d;
            break;
          }
          S = S.sibling;
        }
        if (!h) {
          for (S = d.child; S; ) {
            if (S === l) {
              h = !0, l = d, o = c;
              break;
            }
            if (S === o) {
              h = !0, o = d, l = c;
              break;
            }
            S = S.sibling;
          }
          if (!h) throw Error(x(189));
        }
      }
      if (l.alternate !== o) throw Error(x(190));
    }
    if (l.tag !== 3) throw Error(x(188));
    return l.stateNode.current === l ? n : r;
  }
  function pf(n) {
    return n = Fm(n), n !== null ? Ap(n) : null;
  }
  function Ap(n) {
    if (n.tag === 5 || n.tag === 6) return n;
    for (n = n.child; n !== null; ) {
      var r = Ap(n);
      if (r !== null) return r;
      n = n.sibling;
    }
    return null;
  }
  var Hp = $.unstable_scheduleCallback, Fp = $.unstable_cancelCallback, jp = $.unstable_shouldYield, jm = $.unstable_requestPaint, ot = $.unstable_now, Ae = $.unstable_getCurrentPriorityLevel, Xi = $.unstable_ImmediatePriority, vf = $.unstable_UserBlockingPriority, $u = $.unstable_NormalPriority, Vp = $.unstable_LowPriority, hf = $.unstable_IdlePriority, Gu = null, Zr = null;
  function Bp(n) {
    if (Zr && typeof Zr.onCommitFiberRoot == "function") try {
      Zr.onCommitFiberRoot(Gu, n, void 0, (n.current.flags & 128) === 128);
    } catch {
    }
  }
  var br = Math.clz32 ? Math.clz32 : mf, Vm = Math.log, Bm = Math.LN2;
  function mf(n) {
    return n >>>= 0, n === 0 ? 32 : 31 - (Vm(n) / Bm | 0) | 0;
  }
  var Kl = 64, Jr = 4194304;
  function qi(n) {
    switch (n & -n) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return n & 4194240;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return n & 130023424;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 1073741824;
      default:
        return n;
    }
  }
  function Ki(n, r) {
    var l = n.pendingLanes;
    if (l === 0) return 0;
    var o = 0, c = n.suspendedLanes, d = n.pingedLanes, h = l & 268435455;
    if (h !== 0) {
      var S = h & ~c;
      S !== 0 ? o = qi(S) : (d &= h, d !== 0 && (o = qi(d)));
    } else h = l & ~c, h !== 0 ? o = qi(h) : d !== 0 && (o = qi(d));
    if (o === 0) return 0;
    if (r !== 0 && r !== o && !(r & c) && (c = o & -o, d = r & -r, c >= d || c === 16 && (d & 4194240) !== 0)) return r;
    if (o & 4 && (o |= l & 16), r = n.entangledLanes, r !== 0) for (n = n.entanglements, r &= o; 0 < r; ) l = 31 - br(r), c = 1 << l, o |= n[l], r &= ~c;
    return o;
  }
  function Pm(n, r) {
    switch (n) {
      case 1:
      case 2:
      case 4:
        return r + 250;
      case 8:
      case 16:
      case 32:
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return r + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return -1;
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function yf(n, r) {
    for (var l = n.suspendedLanes, o = n.pingedLanes, c = n.expirationTimes, d = n.pendingLanes; 0 < d; ) {
      var h = 31 - br(d), S = 1 << h, E = c[h];
      E === -1 ? (!(S & l) || S & o) && (c[h] = Pm(S, r)) : E <= r && (n.expiredLanes |= S), d &= ~S;
    }
  }
  function gf(n) {
    return n = n.pendingLanes & -1073741825, n !== 0 ? n : n & 1073741824 ? 1073741824 : 0;
  }
  function vs() {
    var n = Kl;
    return Kl <<= 1, !(Kl & 4194240) && (Kl = 64), n;
  }
  function Sf(n) {
    for (var r = [], l = 0; 31 > l; l++) r.push(n);
    return r;
  }
  function Zi(n, r, l) {
    n.pendingLanes |= r, r !== 536870912 && (n.suspendedLanes = 0, n.pingedLanes = 0), n = n.eventTimes, r = 31 - br(r), n[r] = l;
  }
  function Ym(n, r) {
    var l = n.pendingLanes & ~r;
    n.pendingLanes = r, n.suspendedLanes = 0, n.pingedLanes = 0, n.expiredLanes &= r, n.mutableReadLanes &= r, n.entangledLanes &= r, r = n.entanglements;
    var o = n.eventTimes;
    for (n = n.expirationTimes; 0 < l; ) {
      var c = 31 - br(l), d = 1 << c;
      r[c] = 0, o[c] = -1, n[c] = -1, l &= ~d;
    }
  }
  function hs(n, r) {
    var l = n.entangledLanes |= r;
    for (n = n.entanglements; l; ) {
      var o = 31 - br(l), c = 1 << o;
      c & r | n[o] & r && (n[o] |= r), l &= ~c;
    }
  }
  var Ke = 0;
  function Ef(n) {
    return n &= -n, 1 < n ? 4 < n ? n & 268435455 ? 16 : 536870912 : 4 : 1;
  }
  var Ze, Cf, Tf, Re, Rf, bn = !1, ci = [], _r = null, fi = null, xt = null, dt = /* @__PURE__ */ new Map(), Wu = /* @__PURE__ */ new Map(), rn = [], Lr = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function za(n, r) {
    switch (n) {
      case "focusin":
      case "focusout":
        _r = null;
        break;
      case "dragenter":
      case "dragleave":
        fi = null;
        break;
      case "mouseover":
      case "mouseout":
        xt = null;
        break;
      case "pointerover":
      case "pointerout":
        dt.delete(r.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Wu.delete(r.pointerId);
    }
  }
  function Xu(n, r, l, o, c, d) {
    return n === null || n.nativeEvent !== d ? (n = { blockedOn: r, domEventName: l, eventSystemFlags: o, nativeEvent: d, targetContainers: [c] }, r !== null && (r = se(r), r !== null && Cf(r)), n) : (n.eventSystemFlags |= o, r = n.targetContainers, c !== null && r.indexOf(c) === -1 && r.push(c), n);
  }
  function xf(n, r, l, o, c) {
    switch (r) {
      case "focusin":
        return _r = Xu(_r, n, r, l, o, c), !0;
      case "dragenter":
        return fi = Xu(fi, n, r, l, o, c), !0;
      case "mouseover":
        return xt = Xu(xt, n, r, l, o, c), !0;
      case "pointerover":
        var d = c.pointerId;
        return dt.set(d, Xu(dt.get(d) || null, n, r, l, o, c)), !0;
      case "gotpointercapture":
        return d = c.pointerId, Wu.set(d, Xu(Wu.get(d) || null, n, r, l, o, c)), !0;
    }
    return !1;
  }
  function wf(n) {
    var r = ol(n.target);
    if (r !== null) {
      var l = Kr(r);
      if (l !== null) {
        if (r = l.tag, r === 13) {
          if (r = En(l), r !== null) {
            n.blockedOn = r, Rf(n.priority, function() {
              Tf(l);
            });
            return;
          }
        } else if (r === 3 && l.stateNode.current.memoizedState.isDehydrated) {
          n.blockedOn = l.tag === 3 ? l.stateNode.containerInfo : null;
          return;
        }
      }
    }
    n.blockedOn = null;
  }
  function qu(n) {
    if (n.blockedOn !== null) return !1;
    for (var r = n.targetContainers; 0 < r.length; ) {
      var l = ys(n.domEventName, n.eventSystemFlags, r[0], n.nativeEvent);
      if (l === null) {
        l = n.nativeEvent;
        var o = new l.constructor(l.type, l);
        Ut = o, l.target.dispatchEvent(o), Ut = null;
      } else return r = se(l), r !== null && Cf(r), n.blockedOn = l, !1;
      r.shift();
    }
    return !0;
  }
  function Pp(n, r, l) {
    qu(n) && l.delete(r);
  }
  function Qm() {
    bn = !1, _r !== null && qu(_r) && (_r = null), fi !== null && qu(fi) && (fi = null), xt !== null && qu(xt) && (xt = null), dt.forEach(Pp), Wu.forEach(Pp);
  }
  function Ku(n, r) {
    n.blockedOn === r && (n.blockedOn = null, bn || (bn = !0, $.unstable_scheduleCallback($.unstable_NormalPriority, Qm)));
  }
  function di(n) {
    function r(c) {
      return Ku(c, n);
    }
    if (0 < ci.length) {
      Ku(ci[0], n);
      for (var l = 1; l < ci.length; l++) {
        var o = ci[l];
        o.blockedOn === n && (o.blockedOn = null);
      }
    }
    for (_r !== null && Ku(_r, n), fi !== null && Ku(fi, n), xt !== null && Ku(xt, n), dt.forEach(r), Wu.forEach(r), l = 0; l < rn.length; l++) o = rn[l], o.blockedOn === n && (o.blockedOn = null);
    for (; 0 < rn.length && (l = rn[0], l.blockedOn === null); ) wf(l), l.blockedOn === null && rn.shift();
  }
  var Ji = be.ReactCurrentBatchConfig, el = !0;
  function Yp(n, r, l, o) {
    var c = Ke, d = Ji.transition;
    Ji.transition = null;
    try {
      Ke = 1, ms(n, r, l, o);
    } finally {
      Ke = c, Ji.transition = d;
    }
  }
  function Qp(n, r, l, o) {
    var c = Ke, d = Ji.transition;
    Ji.transition = null;
    try {
      Ke = 4, ms(n, r, l, o);
    } finally {
      Ke = c, Ji.transition = d;
    }
  }
  function ms(n, r, l, o) {
    if (el) {
      var c = ys(n, r, l, o);
      if (c === null) Us(n, r, o, Zu, l), za(n, o);
      else if (xf(c, n, r, l, o)) o.stopPropagation();
      else if (za(n, o), r & 4 && -1 < Lr.indexOf(n)) {
        for (; c !== null; ) {
          var d = se(c);
          if (d !== null && Ze(d), d = ys(n, r, l, o), d === null && Us(n, r, o, Zu, l), d === c) break;
          c = d;
        }
        c !== null && o.stopPropagation();
      } else Us(n, r, o, null, l);
    }
  }
  var Zu = null;
  function ys(n, r, l, o) {
    if (Zu = null, n = Rt(o), n = ol(n), n !== null) if (r = Kr(n), r === null) n = null;
    else if (l = r.tag, l === 13) {
      if (n = En(r), n !== null) return n;
      n = null;
    } else if (l === 3) {
      if (r.stateNode.current.memoizedState.isDehydrated) return r.tag === 3 ? r.stateNode.containerInfo : null;
      n = null;
    } else r !== n && (n = null);
    return Zu = n, null;
  }
  function gs(n) {
    switch (n) {
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 1;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "toggle":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 4;
      case "message":
        switch (Ae()) {
          case Xi:
            return 1;
          case vf:
            return 4;
          case $u:
          case Vp:
            return 16;
          case hf:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var Ua = null, Ss = null, Zl = null;
  function Df() {
    if (Zl) return Zl;
    var n, r = Ss, l = r.length, o, c = "value" in Ua ? Ua.value : Ua.textContent, d = c.length;
    for (n = 0; n < l && r[n] === c[n]; n++) ;
    var h = l - n;
    for (o = 1; o <= h && r[l - o] === c[d - o]; o++) ;
    return Zl = c.slice(n, 1 < o ? 1 - o : void 0);
  }
  function Es(n) {
    var r = n.keyCode;
    return "charCode" in n ? (n = n.charCode, n === 0 && r === 13 && (n = 13)) : n = r, n === 10 && (n = 13), 32 <= n || n === 13 ? n : 0;
  }
  function Cs() {
    return !0;
  }
  function Ts() {
    return !1;
  }
  function Wn(n) {
    function r(l, o, c, d, h) {
      this._reactName = l, this._targetInst = c, this.type = o, this.nativeEvent = d, this.target = h, this.currentTarget = null;
      for (var S in n) n.hasOwnProperty(S) && (l = n[S], this[S] = l ? l(d) : d[S]);
      return this.isDefaultPrevented = (d.defaultPrevented != null ? d.defaultPrevented : d.returnValue === !1) ? Cs : Ts, this.isPropagationStopped = Ts, this;
    }
    return te(r.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var l = this.nativeEvent;
      l && (l.preventDefault ? l.preventDefault() : typeof l.returnValue != "unknown" && (l.returnValue = !1), this.isDefaultPrevented = Cs);
    }, stopPropagation: function() {
      var l = this.nativeEvent;
      l && (l.stopPropagation ? l.stopPropagation() : typeof l.cancelBubble != "unknown" && (l.cancelBubble = !0), this.isPropagationStopped = Cs);
    }, persist: function() {
    }, isPersistent: Cs }), r;
  }
  var tl = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(n) {
    return n.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, Rs = Wn(tl), Jl = te({}, tl, { view: 0, detail: 0 }), Im = Wn(Jl), kf, an, nl, Ju = te({}, Jl, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: Mf, button: 0, buttons: 0, relatedTarget: function(n) {
    return n.relatedTarget === void 0 ? n.fromElement === n.srcElement ? n.toElement : n.fromElement : n.relatedTarget;
  }, movementX: function(n) {
    return "movementX" in n ? n.movementX : (n !== nl && (nl && n.type === "mousemove" ? (kf = n.screenX - nl.screenX, an = n.screenY - nl.screenY) : an = kf = 0, nl = n), kf);
  }, movementY: function(n) {
    return "movementY" in n ? n.movementY : an;
  } }), bf = Wn(Ju), $m = te({}, Ju, { dataTransfer: 0 }), eu = Wn($m), _f = te({}, Jl, { relatedTarget: 0 }), xs = Wn(_f), Gm = te({}, tl, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Wm = Wn(Gm), Xm = te({}, tl, { clipboardData: function(n) {
    return "clipboardData" in n ? n.clipboardData : window.clipboardData;
  } }), Ip = Wn(Xm), Lf = te({}, tl, { data: 0 }), Of = Wn(Lf), $p = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, Gp = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, qm = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Aa(n) {
    var r = this.nativeEvent;
    return r.getModifierState ? r.getModifierState(n) : (n = qm[n]) ? !!r[n] : !1;
  }
  function Mf() {
    return Aa;
  }
  var Nf = te({}, Jl, { key: function(n) {
    if (n.key) {
      var r = $p[n.key] || n.key;
      if (r !== "Unidentified") return r;
    }
    return n.type === "keypress" ? (n = Es(n), n === 13 ? "Enter" : String.fromCharCode(n)) : n.type === "keydown" || n.type === "keyup" ? Gp[n.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: Mf, charCode: function(n) {
    return n.type === "keypress" ? Es(n) : 0;
  }, keyCode: function(n) {
    return n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  }, which: function(n) {
    return n.type === "keypress" ? Es(n) : n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  } }), zf = Wn(Nf), Uf = te({}, Ju, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Wp = Wn(Uf), ws = te({}, Jl, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: Mf }), Xp = Wn(ws), Xn = te({}, tl, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Ha = Wn(Xn), At = te({}, Ju, {
    deltaX: function(n) {
      return "deltaX" in n ? n.deltaX : "wheelDeltaX" in n ? -n.wheelDeltaX : 0;
    },
    deltaY: function(n) {
      return "deltaY" in n ? n.deltaY : "wheelDeltaY" in n ? -n.wheelDeltaY : "wheelDelta" in n ? -n.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Fa = Wn(At), Af = [9, 13, 27, 32], tu = it && "CompositionEvent" in window, eo = null;
  it && "documentMode" in document && (eo = document.documentMode);
  var to = it && "TextEvent" in window && !eo, qp = it && (!tu || eo && 8 < eo && 11 >= eo), Kp = " ", Ds = !1;
  function Zp(n, r) {
    switch (n) {
      case "keyup":
        return Af.indexOf(r.keyCode) !== -1;
      case "keydown":
        return r.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function Jp(n) {
    return n = n.detail, typeof n == "object" && "data" in n ? n.data : null;
  }
  var nu = !1;
  function ev(n, r) {
    switch (n) {
      case "compositionend":
        return Jp(r);
      case "keypress":
        return r.which !== 32 ? null : (Ds = !0, Kp);
      case "textInput":
        return n = r.data, n === Kp && Ds ? null : n;
      default:
        return null;
    }
  }
  function Km(n, r) {
    if (nu) return n === "compositionend" || !tu && Zp(n, r) ? (n = Df(), Zl = Ss = Ua = null, nu = !1, n) : null;
    switch (n) {
      case "paste":
        return null;
      case "keypress":
        if (!(r.ctrlKey || r.altKey || r.metaKey) || r.ctrlKey && r.altKey) {
          if (r.char && 1 < r.char.length) return r.char;
          if (r.which) return String.fromCharCode(r.which);
        }
        return null;
      case "compositionend":
        return qp && r.locale !== "ko" ? null : r.data;
      default:
        return null;
    }
  }
  var Zm = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function tv(n) {
    var r = n && n.nodeName && n.nodeName.toLowerCase();
    return r === "input" ? !!Zm[n.type] : r === "textarea";
  }
  function Hf(n, r, l, o) {
    Np(o), r = uo(r, "onChange"), 0 < r.length && (l = new Rs("onChange", "change", null, l, o), n.push({ event: l, listeners: r }));
  }
  var pa = null, rl = null;
  function nv(n) {
    ll(n, 0);
  }
  function no(n) {
    var r = ta(n);
    if (ca(r)) return n;
  }
  function Jm(n, r) {
    if (n === "change") return r;
  }
  var rv = !1;
  if (it) {
    var Ff;
    if (it) {
      var jf = "oninput" in document;
      if (!jf) {
        var av = document.createElement("div");
        av.setAttribute("oninput", "return;"), jf = typeof av.oninput == "function";
      }
      Ff = jf;
    } else Ff = !1;
    rv = Ff && (!document.documentMode || 9 < document.documentMode);
  }
  function iv() {
    pa && (pa.detachEvent("onpropertychange", lv), rl = pa = null);
  }
  function lv(n) {
    if (n.propertyName === "value" && no(rl)) {
      var r = [];
      Hf(r, rl, n, Rt(n)), df(nv, r);
    }
  }
  function ey(n, r, l) {
    n === "focusin" ? (iv(), pa = r, rl = l, pa.attachEvent("onpropertychange", lv)) : n === "focusout" && iv();
  }
  function uv(n) {
    if (n === "selectionchange" || n === "keyup" || n === "keydown") return no(rl);
  }
  function ty(n, r) {
    if (n === "click") return no(r);
  }
  function ov(n, r) {
    if (n === "input" || n === "change") return no(r);
  }
  function ny(n, r) {
    return n === r && (n !== 0 || 1 / n === 1 / r) || n !== n && r !== r;
  }
  var ea = typeof Object.is == "function" ? Object.is : ny;
  function ro(n, r) {
    if (ea(n, r)) return !0;
    if (typeof n != "object" || n === null || typeof r != "object" || r === null) return !1;
    var l = Object.keys(n), o = Object.keys(r);
    if (l.length !== o.length) return !1;
    for (o = 0; o < l.length; o++) {
      var c = l[o];
      if (!ge.call(r, c) || !ea(n[c], r[c])) return !1;
    }
    return !0;
  }
  function sv(n) {
    for (; n && n.firstChild; ) n = n.firstChild;
    return n;
  }
  function ks(n, r) {
    var l = sv(n);
    n = 0;
    for (var o; l; ) {
      if (l.nodeType === 3) {
        if (o = n + l.textContent.length, n <= r && o >= r) return { node: l, offset: r - n };
        n = o;
      }
      e: {
        for (; l; ) {
          if (l.nextSibling) {
            l = l.nextSibling;
            break e;
          }
          l = l.parentNode;
        }
        l = void 0;
      }
      l = sv(l);
    }
  }
  function pi(n, r) {
    return n && r ? n === r ? !0 : n && n.nodeType === 3 ? !1 : r && r.nodeType === 3 ? pi(n, r.parentNode) : "contains" in n ? n.contains(r) : n.compareDocumentPosition ? !!(n.compareDocumentPosition(r) & 16) : !1 : !1;
  }
  function ao() {
    for (var n = window, r = In(); r instanceof n.HTMLIFrameElement; ) {
      try {
        var l = typeof r.contentWindow.location.href == "string";
      } catch {
        l = !1;
      }
      if (l) n = r.contentWindow;
      else break;
      r = In(n.document);
    }
    return r;
  }
  function bs(n) {
    var r = n && n.nodeName && n.nodeName.toLowerCase();
    return r && (r === "input" && (n.type === "text" || n.type === "search" || n.type === "tel" || n.type === "url" || n.type === "password") || r === "textarea" || n.contentEditable === "true");
  }
  function ru(n) {
    var r = ao(), l = n.focusedElem, o = n.selectionRange;
    if (r !== l && l && l.ownerDocument && pi(l.ownerDocument.documentElement, l)) {
      if (o !== null && bs(l)) {
        if (r = o.start, n = o.end, n === void 0 && (n = r), "selectionStart" in l) l.selectionStart = r, l.selectionEnd = Math.min(n, l.value.length);
        else if (n = (r = l.ownerDocument || document) && r.defaultView || window, n.getSelection) {
          n = n.getSelection();
          var c = l.textContent.length, d = Math.min(o.start, c);
          o = o.end === void 0 ? d : Math.min(o.end, c), !n.extend && d > o && (c = o, o = d, d = c), c = ks(l, d);
          var h = ks(
            l,
            o
          );
          c && h && (n.rangeCount !== 1 || n.anchorNode !== c.node || n.anchorOffset !== c.offset || n.focusNode !== h.node || n.focusOffset !== h.offset) && (r = r.createRange(), r.setStart(c.node, c.offset), n.removeAllRanges(), d > o ? (n.addRange(r), n.extend(h.node, h.offset)) : (r.setEnd(h.node, h.offset), n.addRange(r)));
        }
      }
      for (r = [], n = l; n = n.parentNode; ) n.nodeType === 1 && r.push({ element: n, left: n.scrollLeft, top: n.scrollTop });
      for (typeof l.focus == "function" && l.focus(), l = 0; l < r.length; l++) n = r[l], n.element.scrollLeft = n.left, n.element.scrollTop = n.top;
    }
  }
  var ry = it && "documentMode" in document && 11 >= document.documentMode, au = null, Vf = null, io = null, Bf = !1;
  function Pf(n, r, l) {
    var o = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    Bf || au == null || au !== In(o) || (o = au, "selectionStart" in o && bs(o) ? o = { start: o.selectionStart, end: o.selectionEnd } : (o = (o.ownerDocument && o.ownerDocument.defaultView || window).getSelection(), o = { anchorNode: o.anchorNode, anchorOffset: o.anchorOffset, focusNode: o.focusNode, focusOffset: o.focusOffset }), io && ro(io, o) || (io = o, o = uo(Vf, "onSelect"), 0 < o.length && (r = new Rs("onSelect", "select", null, r, l), n.push({ event: r, listeners: o }), r.target = au)));
  }
  function _s(n, r) {
    var l = {};
    return l[n.toLowerCase()] = r.toLowerCase(), l["Webkit" + n] = "webkit" + r, l["Moz" + n] = "moz" + r, l;
  }
  var al = { animationend: _s("Animation", "AnimationEnd"), animationiteration: _s("Animation", "AnimationIteration"), animationstart: _s("Animation", "AnimationStart"), transitionend: _s("Transition", "TransitionEnd") }, ln = {}, Yf = {};
  it && (Yf = document.createElement("div").style, "AnimationEvent" in window || (delete al.animationend.animation, delete al.animationiteration.animation, delete al.animationstart.animation), "TransitionEvent" in window || delete al.transitionend.transition);
  function Ls(n) {
    if (ln[n]) return ln[n];
    if (!al[n]) return n;
    var r = al[n], l;
    for (l in r) if (r.hasOwnProperty(l) && l in Yf) return ln[n] = r[l];
    return n;
  }
  var cv = Ls("animationend"), fv = Ls("animationiteration"), dv = Ls("animationstart"), pv = Ls("transitionend"), Qf = /* @__PURE__ */ new Map(), Os = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function Or(n, r) {
    Qf.set(n, r), Ue(r, [n]);
  }
  for (var If = 0; If < Os.length; If++) {
    var il = Os[If], ay = il.toLowerCase(), iy = il[0].toUpperCase() + il.slice(1);
    Or(ay, "on" + iy);
  }
  Or(cv, "onAnimationEnd"), Or(fv, "onAnimationIteration"), Or(dv, "onAnimationStart"), Or("dblclick", "onDoubleClick"), Or("focusin", "onFocus"), Or("focusout", "onBlur"), Or(pv, "onTransitionEnd"), g("onMouseEnter", ["mouseout", "mouseover"]), g("onMouseLeave", ["mouseout", "mouseover"]), g("onPointerEnter", ["pointerout", "pointerover"]), g("onPointerLeave", ["pointerout", "pointerover"]), Ue("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), Ue("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), Ue("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), Ue("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), Ue("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), Ue("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var lo = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), $f = new Set("cancel close invalid load scroll toggle".split(" ").concat(lo));
  function Ms(n, r, l) {
    var o = n.type || "unknown-event";
    n.currentTarget = l, ps(o, r, void 0, n), n.currentTarget = null;
  }
  function ll(n, r) {
    r = (r & 4) !== 0;
    for (var l = 0; l < n.length; l++) {
      var o = n[l], c = o.event;
      o = o.listeners;
      e: {
        var d = void 0;
        if (r) for (var h = o.length - 1; 0 <= h; h--) {
          var S = o[h], E = S.instance, L = S.currentTarget;
          if (S = S.listener, E !== d && c.isPropagationStopped()) break e;
          Ms(c, S, L), d = E;
        }
        else for (h = 0; h < o.length; h++) {
          if (S = o[h], E = S.instance, L = S.currentTarget, S = S.listener, E !== d && c.isPropagationStopped()) break e;
          Ms(c, S, L), d = E;
        }
      }
    }
    if (Xl) throw n = Iu, Xl = !1, Iu = null, n;
  }
  function Xe(n, r) {
    var l = r[co];
    l === void 0 && (l = r[co] = /* @__PURE__ */ new Set());
    var o = n + "__bubble";
    l.has(o) || (vv(r, n, 2, !1), l.add(o));
  }
  function Ns(n, r, l) {
    var o = 0;
    r && (o |= 4), vv(l, n, o, r);
  }
  var zs = "_reactListening" + Math.random().toString(36).slice(2);
  function iu(n) {
    if (!n[zs]) {
      n[zs] = !0, Je.forEach(function(l) {
        l !== "selectionchange" && ($f.has(l) || Ns(l, !1, n), Ns(l, !0, n));
      });
      var r = n.nodeType === 9 ? n : n.ownerDocument;
      r === null || r[zs] || (r[zs] = !0, Ns("selectionchange", !1, r));
    }
  }
  function vv(n, r, l, o) {
    switch (gs(r)) {
      case 1:
        var c = Yp;
        break;
      case 4:
        c = Qp;
        break;
      default:
        c = ms;
    }
    l = c.bind(null, r, l, n), c = void 0, !si || r !== "touchstart" && r !== "touchmove" && r !== "wheel" || (c = !0), o ? c !== void 0 ? n.addEventListener(r, l, { capture: !0, passive: c }) : n.addEventListener(r, l, !0) : c !== void 0 ? n.addEventListener(r, l, { passive: c }) : n.addEventListener(r, l, !1);
  }
  function Us(n, r, l, o, c) {
    var d = o;
    if (!(r & 1) && !(r & 2) && o !== null) e: for (; ; ) {
      if (o === null) return;
      var h = o.tag;
      if (h === 3 || h === 4) {
        var S = o.stateNode.containerInfo;
        if (S === c || S.nodeType === 8 && S.parentNode === c) break;
        if (h === 4) for (h = o.return; h !== null; ) {
          var E = h.tag;
          if ((E === 3 || E === 4) && (E = h.stateNode.containerInfo, E === c || E.nodeType === 8 && E.parentNode === c)) return;
          h = h.return;
        }
        for (; S !== null; ) {
          if (h = ol(S), h === null) return;
          if (E = h.tag, E === 5 || E === 6) {
            o = d = h;
            continue e;
          }
          S = S.parentNode;
        }
      }
      o = o.return;
    }
    df(function() {
      var L = d, F = Rt(l), V = [];
      e: {
        var H = Qf.get(n);
        if (H !== void 0) {
          var q = Rs, ne = n;
          switch (n) {
            case "keypress":
              if (Es(l) === 0) break e;
            case "keydown":
            case "keyup":
              q = zf;
              break;
            case "focusin":
              ne = "focus", q = xs;
              break;
            case "focusout":
              ne = "blur", q = xs;
              break;
            case "beforeblur":
            case "afterblur":
              q = xs;
              break;
            case "click":
              if (l.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              q = bf;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              q = eu;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              q = Xp;
              break;
            case cv:
            case fv:
            case dv:
              q = Wm;
              break;
            case pv:
              q = Ha;
              break;
            case "scroll":
              q = Im;
              break;
            case "wheel":
              q = Fa;
              break;
            case "copy":
            case "cut":
            case "paste":
              q = Ip;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              q = Wp;
          }
          var ie = (r & 4) !== 0, Ot = !ie && n === "scroll", w = ie ? H !== null ? H + "Capture" : null : H;
          ie = [];
          for (var T = L, b; T !== null; ) {
            b = T;
            var j = b.stateNode;
            if (b.tag === 5 && j !== null && (b = j, w !== null && (j = Gi(T, w), j != null && ie.push(lu(T, j, b)))), Ot) break;
            T = T.return;
          }
          0 < ie.length && (H = new q(H, ne, null, l, F), V.push({ event: H, listeners: ie }));
        }
      }
      if (!(r & 7)) {
        e: {
          if (H = n === "mouseover" || n === "pointerover", q = n === "mouseout" || n === "pointerout", H && l !== Ut && (ne = l.relatedTarget || l.fromElement) && (ol(ne) || ne[ja])) break e;
          if ((q || H) && (H = F.window === F ? F : (H = F.ownerDocument) ? H.defaultView || H.parentWindow : window, q ? (ne = l.relatedTarget || l.toElement, q = L, ne = ne ? ol(ne) : null, ne !== null && (Ot = Kr(ne), ne !== Ot || ne.tag !== 5 && ne.tag !== 6) && (ne = null)) : (q = null, ne = L), q !== ne)) {
            if (ie = bf, j = "onMouseLeave", w = "onMouseEnter", T = "mouse", (n === "pointerout" || n === "pointerover") && (ie = Wp, j = "onPointerLeave", w = "onPointerEnter", T = "pointer"), Ot = q == null ? H : ta(q), b = ne == null ? H : ta(ne), H = new ie(j, T + "leave", q, l, F), H.target = Ot, H.relatedTarget = b, j = null, ol(F) === L && (ie = new ie(w, T + "enter", ne, l, F), ie.target = b, ie.relatedTarget = Ot, j = ie), Ot = j, q && ne) t: {
              for (ie = q, w = ne, T = 0, b = ie; b; b = vi(b)) T++;
              for (b = 0, j = w; j; j = vi(j)) b++;
              for (; 0 < T - b; ) ie = vi(ie), T--;
              for (; 0 < b - T; ) w = vi(w), b--;
              for (; T--; ) {
                if (ie === w || w !== null && ie === w.alternate) break t;
                ie = vi(ie), w = vi(w);
              }
              ie = null;
            }
            else ie = null;
            q !== null && hv(V, H, q, ie, !1), ne !== null && Ot !== null && hv(V, Ot, ne, ie, !0);
          }
        }
        e: {
          if (H = L ? ta(L) : window, q = H.nodeName && H.nodeName.toLowerCase(), q === "select" || q === "input" && H.type === "file") var re = Jm;
          else if (tv(H)) if (rv) re = ov;
          else {
            re = uv;
            var pe = ey;
          }
          else (q = H.nodeName) && q.toLowerCase() === "input" && (H.type === "checkbox" || H.type === "radio") && (re = ty);
          if (re && (re = re(n, L))) {
            Hf(V, re, l, F);
            break e;
          }
          pe && pe(n, H, L), n === "focusout" && (pe = H._wrapperState) && pe.controlled && H.type === "number" && Yu(H, "number", H.value);
        }
        switch (pe = L ? ta(L) : window, n) {
          case "focusin":
            (tv(pe) || pe.contentEditable === "true") && (au = pe, Vf = L, io = null);
            break;
          case "focusout":
            io = Vf = au = null;
            break;
          case "mousedown":
            Bf = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Bf = !1, Pf(V, l, F);
            break;
          case "selectionchange":
            if (ry) break;
          case "keydown":
          case "keyup":
            Pf(V, l, F);
        }
        var ve;
        if (tu) e: {
          switch (n) {
            case "compositionstart":
              var Ee = "onCompositionStart";
              break e;
            case "compositionend":
              Ee = "onCompositionEnd";
              break e;
            case "compositionupdate":
              Ee = "onCompositionUpdate";
              break e;
          }
          Ee = void 0;
        }
        else nu ? Zp(n, l) && (Ee = "onCompositionEnd") : n === "keydown" && l.keyCode === 229 && (Ee = "onCompositionStart");
        Ee && (qp && l.locale !== "ko" && (nu || Ee !== "onCompositionStart" ? Ee === "onCompositionEnd" && nu && (ve = Df()) : (Ua = F, Ss = "value" in Ua ? Ua.value : Ua.textContent, nu = !0)), pe = uo(L, Ee), 0 < pe.length && (Ee = new Of(Ee, n, null, l, F), V.push({ event: Ee, listeners: pe }), ve ? Ee.data = ve : (ve = Jp(l), ve !== null && (Ee.data = ve)))), (ve = to ? ev(n, l) : Km(n, l)) && (L = uo(L, "onBeforeInput"), 0 < L.length && (F = new Of("onBeforeInput", "beforeinput", null, l, F), V.push({ event: F, listeners: L }), F.data = ve));
      }
      ll(V, r);
    });
  }
  function lu(n, r, l) {
    return { instance: n, listener: r, currentTarget: l };
  }
  function uo(n, r) {
    for (var l = r + "Capture", o = []; n !== null; ) {
      var c = n, d = c.stateNode;
      c.tag === 5 && d !== null && (c = d, d = Gi(n, l), d != null && o.unshift(lu(n, d, c)), d = Gi(n, r), d != null && o.push(lu(n, d, c))), n = n.return;
    }
    return o;
  }
  function vi(n) {
    if (n === null) return null;
    do
      n = n.return;
    while (n && n.tag !== 5);
    return n || null;
  }
  function hv(n, r, l, o, c) {
    for (var d = r._reactName, h = []; l !== null && l !== o; ) {
      var S = l, E = S.alternate, L = S.stateNode;
      if (E !== null && E === o) break;
      S.tag === 5 && L !== null && (S = L, c ? (E = Gi(l, d), E != null && h.unshift(lu(l, E, S))) : c || (E = Gi(l, d), E != null && h.push(lu(l, E, S)))), l = l.return;
    }
    h.length !== 0 && n.push({ event: r, listeners: h });
  }
  var mv = /\r\n?/g, ly = /\u0000|\uFFFD/g;
  function yv(n) {
    return (typeof n == "string" ? n : "" + n).replace(mv, `
`).replace(ly, "");
  }
  function As(n, r, l) {
    if (r = yv(r), yv(n) !== r && l) throw Error(x(425));
  }
  function hi() {
  }
  var oo = null, ul = null;
  function Hs(n, r) {
    return n === "textarea" || n === "noscript" || typeof r.children == "string" || typeof r.children == "number" || typeof r.dangerouslySetInnerHTML == "object" && r.dangerouslySetInnerHTML !== null && r.dangerouslySetInnerHTML.__html != null;
  }
  var Fs = typeof setTimeout == "function" ? setTimeout : void 0, Gf = typeof clearTimeout == "function" ? clearTimeout : void 0, gv = typeof Promise == "function" ? Promise : void 0, uu = typeof queueMicrotask == "function" ? queueMicrotask : typeof gv < "u" ? function(n) {
    return gv.resolve(null).then(n).catch(js);
  } : Fs;
  function js(n) {
    setTimeout(function() {
      throw n;
    });
  }
  function ou(n, r) {
    var l = r, o = 0;
    do {
      var c = l.nextSibling;
      if (n.removeChild(l), c && c.nodeType === 8) if (l = c.data, l === "/$") {
        if (o === 0) {
          n.removeChild(c), di(r);
          return;
        }
        o--;
      } else l !== "$" && l !== "$?" && l !== "$!" || o++;
      l = c;
    } while (l);
    di(r);
  }
  function va(n) {
    for (; n != null; n = n.nextSibling) {
      var r = n.nodeType;
      if (r === 1 || r === 3) break;
      if (r === 8) {
        if (r = n.data, r === "$" || r === "$!" || r === "$?") break;
        if (r === "/$") return null;
      }
    }
    return n;
  }
  function Sv(n) {
    n = n.previousSibling;
    for (var r = 0; n; ) {
      if (n.nodeType === 8) {
        var l = n.data;
        if (l === "$" || l === "$!" || l === "$?") {
          if (r === 0) return n;
          r--;
        } else l === "/$" && r++;
      }
      n = n.previousSibling;
    }
    return null;
  }
  var mi = Math.random().toString(36).slice(2), ha = "__reactFiber$" + mi, so = "__reactProps$" + mi, ja = "__reactContainer$" + mi, co = "__reactEvents$" + mi, su = "__reactListeners$" + mi, uy = "__reactHandles$" + mi;
  function ol(n) {
    var r = n[ha];
    if (r) return r;
    for (var l = n.parentNode; l; ) {
      if (r = l[ja] || l[ha]) {
        if (l = r.alternate, r.child !== null || l !== null && l.child !== null) for (n = Sv(n); n !== null; ) {
          if (l = n[ha]) return l;
          n = Sv(n);
        }
        return r;
      }
      n = l, l = n.parentNode;
    }
    return null;
  }
  function se(n) {
    return n = n[ha] || n[ja], !n || n.tag !== 5 && n.tag !== 6 && n.tag !== 13 && n.tag !== 3 ? null : n;
  }
  function ta(n) {
    if (n.tag === 5 || n.tag === 6) return n.stateNode;
    throw Error(x(33));
  }
  function yt(n) {
    return n[so] || null;
  }
  var He = [], Mr = -1;
  function Nr(n) {
    return { current: n };
  }
  function ct(n) {
    0 > Mr || (n.current = He[Mr], He[Mr] = null, Mr--);
  }
  function oe(n, r) {
    Mr++, He[Mr] = n.current, n.current = r;
  }
  var Cn = {}, wt = Nr(Cn), Gt = Nr(!1), qn = Cn;
  function Kn(n, r) {
    var l = n.type.contextTypes;
    if (!l) return Cn;
    var o = n.stateNode;
    if (o && o.__reactInternalMemoizedUnmaskedChildContext === r) return o.__reactInternalMemoizedMaskedChildContext;
    var c = {}, d;
    for (d in l) c[d] = r[d];
    return o && (n = n.stateNode, n.__reactInternalMemoizedUnmaskedChildContext = r, n.__reactInternalMemoizedMaskedChildContext = c), c;
  }
  function Ht(n) {
    return n = n.childContextTypes, n != null;
  }
  function cu() {
    ct(Gt), ct(wt);
  }
  function Ev(n, r, l) {
    if (wt.current !== Cn) throw Error(x(168));
    oe(wt, r), oe(Gt, l);
  }
  function fo(n, r, l) {
    var o = n.stateNode;
    if (r = r.childContextTypes, typeof o.getChildContext != "function") return l;
    o = o.getChildContext();
    for (var c in o) if (!(c in r)) throw Error(x(108, Qn(n) || "Unknown", c));
    return te({}, l, o);
  }
  function Zt(n) {
    return n = (n = n.stateNode) && n.__reactInternalMemoizedMergedChildContext || Cn, qn = wt.current, oe(wt, n), oe(Gt, Gt.current), !0;
  }
  function Vs(n, r, l) {
    var o = n.stateNode;
    if (!o) throw Error(x(169));
    l ? (n = fo(n, r, qn), o.__reactInternalMemoizedMergedChildContext = n, ct(Gt), ct(wt), oe(wt, n)) : ct(Gt), oe(Gt, l);
  }
  var ma = null, fu = !1, Va = !1;
  function Bs(n) {
    ma === null ? ma = [n] : ma.push(n);
  }
  function yi(n) {
    fu = !0, Bs(n);
  }
  function ya() {
    if (!Va && ma !== null) {
      Va = !0;
      var n = 0, r = Ke;
      try {
        var l = ma;
        for (Ke = 1; n < l.length; n++) {
          var o = l[n];
          do
            o = o(!0);
          while (o !== null);
        }
        ma = null, fu = !1;
      } catch (c) {
        throw ma !== null && (ma = ma.slice(n + 1)), Hp(Xi, ya), c;
      } finally {
        Ke = r, Va = !1;
      }
    }
    return null;
  }
  var gi = [], Si = 0, Ei = null, Ba = 0, Ft = [], zr = 0, vr = null, ga = 1, Sa = "";
  function sl(n, r) {
    gi[Si++] = Ba, gi[Si++] = Ei, Ei = n, Ba = r;
  }
  function Cv(n, r, l) {
    Ft[zr++] = ga, Ft[zr++] = Sa, Ft[zr++] = vr, vr = n;
    var o = ga;
    n = Sa;
    var c = 32 - br(o) - 1;
    o &= ~(1 << c), l += 1;
    var d = 32 - br(r) + c;
    if (30 < d) {
      var h = c - c % 5;
      d = (o & (1 << h) - 1).toString(32), o >>= h, c -= h, ga = 1 << 32 - br(r) + c | l << c | o, Sa = d + n;
    } else ga = 1 << d | l << c | o, Sa = n;
  }
  function Ps(n) {
    n.return !== null && (sl(n, 1), Cv(n, 1, 0));
  }
  function Ys(n) {
    for (; n === Ei; ) Ei = gi[--Si], gi[Si] = null, Ba = gi[--Si], gi[Si] = null;
    for (; n === vr; ) vr = Ft[--zr], Ft[zr] = null, Sa = Ft[--zr], Ft[zr] = null, ga = Ft[--zr], Ft[zr] = null;
  }
  var Zn = null, Jn = null, vt = !1, Ur = null;
  function Wf(n, r) {
    var l = Vr(5, null, null, 0);
    l.elementType = "DELETED", l.stateNode = r, l.return = n, r = n.deletions, r === null ? (n.deletions = [l], n.flags |= 16) : r.push(l);
  }
  function Tv(n, r) {
    switch (n.tag) {
      case 5:
        var l = n.type;
        return r = r.nodeType !== 1 || l.toLowerCase() !== r.nodeName.toLowerCase() ? null : r, r !== null ? (n.stateNode = r, Zn = n, Jn = va(r.firstChild), !0) : !1;
      case 6:
        return r = n.pendingProps === "" || r.nodeType !== 3 ? null : r, r !== null ? (n.stateNode = r, Zn = n, Jn = null, !0) : !1;
      case 13:
        return r = r.nodeType !== 8 ? null : r, r !== null ? (l = vr !== null ? { id: ga, overflow: Sa } : null, n.memoizedState = { dehydrated: r, treeContext: l, retryLane: 1073741824 }, l = Vr(18, null, null, 0), l.stateNode = r, l.return = n, n.child = l, Zn = n, Jn = null, !0) : !1;
      default:
        return !1;
    }
  }
  function Xf(n) {
    return (n.mode & 1) !== 0 && (n.flags & 128) === 0;
  }
  function qf(n) {
    if (vt) {
      var r = Jn;
      if (r) {
        var l = r;
        if (!Tv(n, r)) {
          if (Xf(n)) throw Error(x(418));
          r = va(l.nextSibling);
          var o = Zn;
          r && Tv(n, r) ? Wf(o, l) : (n.flags = n.flags & -4097 | 2, vt = !1, Zn = n);
        }
      } else {
        if (Xf(n)) throw Error(x(418));
        n.flags = n.flags & -4097 | 2, vt = !1, Zn = n;
      }
    }
  }
  function Wt(n) {
    for (n = n.return; n !== null && n.tag !== 5 && n.tag !== 3 && n.tag !== 13; ) n = n.return;
    Zn = n;
  }
  function Qs(n) {
    if (n !== Zn) return !1;
    if (!vt) return Wt(n), vt = !0, !1;
    var r;
    if ((r = n.tag !== 3) && !(r = n.tag !== 5) && (r = n.type, r = r !== "head" && r !== "body" && !Hs(n.type, n.memoizedProps)), r && (r = Jn)) {
      if (Xf(n)) throw po(), Error(x(418));
      for (; r; ) Wf(n, r), r = va(r.nextSibling);
    }
    if (Wt(n), n.tag === 13) {
      if (n = n.memoizedState, n = n !== null ? n.dehydrated : null, !n) throw Error(x(317));
      e: {
        for (n = n.nextSibling, r = 0; n; ) {
          if (n.nodeType === 8) {
            var l = n.data;
            if (l === "/$") {
              if (r === 0) {
                Jn = va(n.nextSibling);
                break e;
              }
              r--;
            } else l !== "$" && l !== "$!" && l !== "$?" || r++;
          }
          n = n.nextSibling;
        }
        Jn = null;
      }
    } else Jn = Zn ? va(n.stateNode.nextSibling) : null;
    return !0;
  }
  function po() {
    for (var n = Jn; n; ) n = va(n.nextSibling);
  }
  function Ci() {
    Jn = Zn = null, vt = !1;
  }
  function Pa(n) {
    Ur === null ? Ur = [n] : Ur.push(n);
  }
  var oy = be.ReactCurrentBatchConfig;
  function cl(n, r, l) {
    if (n = l.ref, n !== null && typeof n != "function" && typeof n != "object") {
      if (l._owner) {
        if (l = l._owner, l) {
          if (l.tag !== 1) throw Error(x(309));
          var o = l.stateNode;
        }
        if (!o) throw Error(x(147, n));
        var c = o, d = "" + n;
        return r !== null && r.ref !== null && typeof r.ref == "function" && r.ref._stringRef === d ? r.ref : (r = function(h) {
          var S = c.refs;
          h === null ? delete S[d] : S[d] = h;
        }, r._stringRef = d, r);
      }
      if (typeof n != "string") throw Error(x(284));
      if (!l._owner) throw Error(x(290, n));
    }
    return n;
  }
  function Is(n, r) {
    throw n = Object.prototype.toString.call(r), Error(x(31, n === "[object Object]" ? "object with keys {" + Object.keys(r).join(", ") + "}" : n));
  }
  function Rv(n) {
    var r = n._init;
    return r(n._payload);
  }
  function fl(n) {
    function r(w, T) {
      if (n) {
        var b = w.deletions;
        b === null ? (w.deletions = [T], w.flags |= 16) : b.push(T);
      }
    }
    function l(w, T) {
      if (!n) return null;
      for (; T !== null; ) r(w, T), T = T.sibling;
      return null;
    }
    function o(w, T) {
      for (w = /* @__PURE__ */ new Map(); T !== null; ) T.key !== null ? w.set(T.key, T) : w.set(T.index, T), T = T.sibling;
      return w;
    }
    function c(w, T) {
      return w = _i(w, T), w.index = 0, w.sibling = null, w;
    }
    function d(w, T, b) {
      return w.index = b, n ? (b = w.alternate, b !== null ? (b = b.index, b < T ? (w.flags |= 2, T) : b) : (w.flags |= 2, T)) : (w.flags |= 1048576, T);
    }
    function h(w) {
      return n && w.alternate === null && (w.flags |= 2), w;
    }
    function S(w, T, b, j) {
      return T === null || T.tag !== 6 ? (T = kd(b, w.mode, j), T.return = w, T) : (T = c(T, b), T.return = w, T);
    }
    function E(w, T, b, j) {
      var re = b.type;
      return re === Me ? F(w, T, b.props.children, j, b.key) : T !== null && (T.elementType === re || typeof re == "object" && re !== null && re.$$typeof === Nt && Rv(re) === T.type) ? (j = c(T, b.props), j.ref = cl(w, T, b), j.return = w, j) : (j = Yo(b.type, b.key, b.props, null, w.mode, j), j.ref = cl(w, T, b), j.return = w, j);
    }
    function L(w, T, b, j) {
      return T === null || T.tag !== 4 || T.stateNode.containerInfo !== b.containerInfo || T.stateNode.implementation !== b.implementation ? (T = xc(b, w.mode, j), T.return = w, T) : (T = c(T, b.children || []), T.return = w, T);
    }
    function F(w, T, b, j, re) {
      return T === null || T.tag !== 7 ? (T = Wa(b, w.mode, j, re), T.return = w, T) : (T = c(T, b), T.return = w, T);
    }
    function V(w, T, b) {
      if (typeof T == "string" && T !== "" || typeof T == "number") return T = kd("" + T, w.mode, b), T.return = w, T;
      if (typeof T == "object" && T !== null) {
        switch (T.$$typeof) {
          case _e:
            return b = Yo(T.type, T.key, T.props, null, w.mode, b), b.ref = cl(w, null, T), b.return = w, b;
          case mt:
            return T = xc(T, w.mode, b), T.return = w, T;
          case Nt:
            var j = T._init;
            return V(w, j(T._payload), b);
        }
        if (Qi(T) || he(T)) return T = Wa(T, w.mode, b, null), T.return = w, T;
        Is(w, T);
      }
      return null;
    }
    function H(w, T, b, j) {
      var re = T !== null ? T.key : null;
      if (typeof b == "string" && b !== "" || typeof b == "number") return re !== null ? null : S(w, T, "" + b, j);
      if (typeof b == "object" && b !== null) {
        switch (b.$$typeof) {
          case _e:
            return b.key === re ? E(w, T, b, j) : null;
          case mt:
            return b.key === re ? L(w, T, b, j) : null;
          case Nt:
            return re = b._init, H(
              w,
              T,
              re(b._payload),
              j
            );
        }
        if (Qi(b) || he(b)) return re !== null ? null : F(w, T, b, j, null);
        Is(w, b);
      }
      return null;
    }
    function q(w, T, b, j, re) {
      if (typeof j == "string" && j !== "" || typeof j == "number") return w = w.get(b) || null, S(T, w, "" + j, re);
      if (typeof j == "object" && j !== null) {
        switch (j.$$typeof) {
          case _e:
            return w = w.get(j.key === null ? b : j.key) || null, E(T, w, j, re);
          case mt:
            return w = w.get(j.key === null ? b : j.key) || null, L(T, w, j, re);
          case Nt:
            var pe = j._init;
            return q(w, T, b, pe(j._payload), re);
        }
        if (Qi(j) || he(j)) return w = w.get(b) || null, F(T, w, j, re, null);
        Is(T, j);
      }
      return null;
    }
    function ne(w, T, b, j) {
      for (var re = null, pe = null, ve = T, Ee = T = 0, tn = null; ve !== null && Ee < b.length; Ee++) {
        ve.index > Ee ? (tn = ve, ve = null) : tn = ve.sibling;
        var Qe = H(w, ve, b[Ee], j);
        if (Qe === null) {
          ve === null && (ve = tn);
          break;
        }
        n && ve && Qe.alternate === null && r(w, ve), T = d(Qe, T, Ee), pe === null ? re = Qe : pe.sibling = Qe, pe = Qe, ve = tn;
      }
      if (Ee === b.length) return l(w, ve), vt && sl(w, Ee), re;
      if (ve === null) {
        for (; Ee < b.length; Ee++) ve = V(w, b[Ee], j), ve !== null && (T = d(ve, T, Ee), pe === null ? re = ve : pe.sibling = ve, pe = ve);
        return vt && sl(w, Ee), re;
      }
      for (ve = o(w, ve); Ee < b.length; Ee++) tn = q(ve, w, Ee, b[Ee], j), tn !== null && (n && tn.alternate !== null && ve.delete(tn.key === null ? Ee : tn.key), T = d(tn, T, Ee), pe === null ? re = tn : pe.sibling = tn, pe = tn);
      return n && ve.forEach(function(Mi) {
        return r(w, Mi);
      }), vt && sl(w, Ee), re;
    }
    function ie(w, T, b, j) {
      var re = he(b);
      if (typeof re != "function") throw Error(x(150));
      if (b = re.call(b), b == null) throw Error(x(151));
      for (var pe = re = null, ve = T, Ee = T = 0, tn = null, Qe = b.next(); ve !== null && !Qe.done; Ee++, Qe = b.next()) {
        ve.index > Ee ? (tn = ve, ve = null) : tn = ve.sibling;
        var Mi = H(w, ve, Qe.value, j);
        if (Mi === null) {
          ve === null && (ve = tn);
          break;
        }
        n && ve && Mi.alternate === null && r(w, ve), T = d(Mi, T, Ee), pe === null ? re = Mi : pe.sibling = Mi, pe = Mi, ve = tn;
      }
      if (Qe.done) return l(
        w,
        ve
      ), vt && sl(w, Ee), re;
      if (ve === null) {
        for (; !Qe.done; Ee++, Qe = b.next()) Qe = V(w, Qe.value, j), Qe !== null && (T = d(Qe, T, Ee), pe === null ? re = Qe : pe.sibling = Qe, pe = Qe);
        return vt && sl(w, Ee), re;
      }
      for (ve = o(w, ve); !Qe.done; Ee++, Qe = b.next()) Qe = q(ve, w, Ee, Qe.value, j), Qe !== null && (n && Qe.alternate !== null && ve.delete(Qe.key === null ? Ee : Qe.key), T = d(Qe, T, Ee), pe === null ? re = Qe : pe.sibling = Qe, pe = Qe);
      return n && ve.forEach(function(ih) {
        return r(w, ih);
      }), vt && sl(w, Ee), re;
    }
    function Ot(w, T, b, j) {
      if (typeof b == "object" && b !== null && b.type === Me && b.key === null && (b = b.props.children), typeof b == "object" && b !== null) {
        switch (b.$$typeof) {
          case _e:
            e: {
              for (var re = b.key, pe = T; pe !== null; ) {
                if (pe.key === re) {
                  if (re = b.type, re === Me) {
                    if (pe.tag === 7) {
                      l(w, pe.sibling), T = c(pe, b.props.children), T.return = w, w = T;
                      break e;
                    }
                  } else if (pe.elementType === re || typeof re == "object" && re !== null && re.$$typeof === Nt && Rv(re) === pe.type) {
                    l(w, pe.sibling), T = c(pe, b.props), T.ref = cl(w, pe, b), T.return = w, w = T;
                    break e;
                  }
                  l(w, pe);
                  break;
                } else r(w, pe);
                pe = pe.sibling;
              }
              b.type === Me ? (T = Wa(b.props.children, w.mode, j, b.key), T.return = w, w = T) : (j = Yo(b.type, b.key, b.props, null, w.mode, j), j.ref = cl(w, T, b), j.return = w, w = j);
            }
            return h(w);
          case mt:
            e: {
              for (pe = b.key; T !== null; ) {
                if (T.key === pe) if (T.tag === 4 && T.stateNode.containerInfo === b.containerInfo && T.stateNode.implementation === b.implementation) {
                  l(w, T.sibling), T = c(T, b.children || []), T.return = w, w = T;
                  break e;
                } else {
                  l(w, T);
                  break;
                }
                else r(w, T);
                T = T.sibling;
              }
              T = xc(b, w.mode, j), T.return = w, w = T;
            }
            return h(w);
          case Nt:
            return pe = b._init, Ot(w, T, pe(b._payload), j);
        }
        if (Qi(b)) return ne(w, T, b, j);
        if (he(b)) return ie(w, T, b, j);
        Is(w, b);
      }
      return typeof b == "string" && b !== "" || typeof b == "number" ? (b = "" + b, T !== null && T.tag === 6 ? (l(w, T.sibling), T = c(T, b), T.return = w, w = T) : (l(w, T), T = kd(b, w.mode, j), T.return = w, w = T), h(w)) : l(w, T);
    }
    return Ot;
  }
  var kt = fl(!0), G = fl(!1), hr = Nr(null), er = null, du = null, Kf = null;
  function Zf() {
    Kf = du = er = null;
  }
  function Jf(n) {
    var r = hr.current;
    ct(hr), n._currentValue = r;
  }
  function ed(n, r, l) {
    for (; n !== null; ) {
      var o = n.alternate;
      if ((n.childLanes & r) !== r ? (n.childLanes |= r, o !== null && (o.childLanes |= r)) : o !== null && (o.childLanes & r) !== r && (o.childLanes |= r), n === l) break;
      n = n.return;
    }
  }
  function gt(n, r) {
    er = n, Kf = du = null, n = n.dependencies, n !== null && n.firstContext !== null && (n.lanes & r && (Vt = !0), n.firstContext = null);
  }
  function Ar(n) {
    var r = n._currentValue;
    if (Kf !== n) if (n = { context: n, memoizedValue: r, next: null }, du === null) {
      if (er === null) throw Error(x(308));
      du = n, er.dependencies = { lanes: 0, firstContext: n };
    } else du = du.next = n;
    return r;
  }
  var dl = null;
  function td(n) {
    dl === null ? dl = [n] : dl.push(n);
  }
  function nd(n, r, l, o) {
    var c = r.interleaved;
    return c === null ? (l.next = l, td(r)) : (l.next = c.next, c.next = l), r.interleaved = l, mr(n, o);
  }
  function mr(n, r) {
    n.lanes |= r;
    var l = n.alternate;
    for (l !== null && (l.lanes |= r), l = n, n = n.return; n !== null; ) n.childLanes |= r, l = n.alternate, l !== null && (l.childLanes |= r), l = n, n = n.return;
    return l.tag === 3 ? l.stateNode : null;
  }
  var yr = !1;
  function rd(n) {
    n.updateQueue = { baseState: n.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function xv(n, r) {
    n = n.updateQueue, r.updateQueue === n && (r.updateQueue = { baseState: n.baseState, firstBaseUpdate: n.firstBaseUpdate, lastBaseUpdate: n.lastBaseUpdate, shared: n.shared, effects: n.effects });
  }
  function Ya(n, r) {
    return { eventTime: n, lane: r, tag: 0, payload: null, callback: null, next: null };
  }
  function Ti(n, r, l) {
    var o = n.updateQueue;
    if (o === null) return null;
    if (o = o.shared, Fe & 2) {
      var c = o.pending;
      return c === null ? r.next = r : (r.next = c.next, c.next = r), o.pending = r, mr(n, l);
    }
    return c = o.interleaved, c === null ? (r.next = r, td(o)) : (r.next = c.next, c.next = r), o.interleaved = r, mr(n, l);
  }
  function $s(n, r, l) {
    if (r = r.updateQueue, r !== null && (r = r.shared, (l & 4194240) !== 0)) {
      var o = r.lanes;
      o &= n.pendingLanes, l |= o, r.lanes = l, hs(n, l);
    }
  }
  function wv(n, r) {
    var l = n.updateQueue, o = n.alternate;
    if (o !== null && (o = o.updateQueue, l === o)) {
      var c = null, d = null;
      if (l = l.firstBaseUpdate, l !== null) {
        do {
          var h = { eventTime: l.eventTime, lane: l.lane, tag: l.tag, payload: l.payload, callback: l.callback, next: null };
          d === null ? c = d = h : d = d.next = h, l = l.next;
        } while (l !== null);
        d === null ? c = d = r : d = d.next = r;
      } else c = d = r;
      l = { baseState: o.baseState, firstBaseUpdate: c, lastBaseUpdate: d, shared: o.shared, effects: o.effects }, n.updateQueue = l;
      return;
    }
    n = l.lastBaseUpdate, n === null ? l.firstBaseUpdate = r : n.next = r, l.lastBaseUpdate = r;
  }
  function vo(n, r, l, o) {
    var c = n.updateQueue;
    yr = !1;
    var d = c.firstBaseUpdate, h = c.lastBaseUpdate, S = c.shared.pending;
    if (S !== null) {
      c.shared.pending = null;
      var E = S, L = E.next;
      E.next = null, h === null ? d = L : h.next = L, h = E;
      var F = n.alternate;
      F !== null && (F = F.updateQueue, S = F.lastBaseUpdate, S !== h && (S === null ? F.firstBaseUpdate = L : S.next = L, F.lastBaseUpdate = E));
    }
    if (d !== null) {
      var V = c.baseState;
      h = 0, F = L = E = null, S = d;
      do {
        var H = S.lane, q = S.eventTime;
        if ((o & H) === H) {
          F !== null && (F = F.next = {
            eventTime: q,
            lane: 0,
            tag: S.tag,
            payload: S.payload,
            callback: S.callback,
            next: null
          });
          e: {
            var ne = n, ie = S;
            switch (H = r, q = l, ie.tag) {
              case 1:
                if (ne = ie.payload, typeof ne == "function") {
                  V = ne.call(q, V, H);
                  break e;
                }
                V = ne;
                break e;
              case 3:
                ne.flags = ne.flags & -65537 | 128;
              case 0:
                if (ne = ie.payload, H = typeof ne == "function" ? ne.call(q, V, H) : ne, H == null) break e;
                V = te({}, V, H);
                break e;
              case 2:
                yr = !0;
            }
          }
          S.callback !== null && S.lane !== 0 && (n.flags |= 64, H = c.effects, H === null ? c.effects = [S] : H.push(S));
        } else q = { eventTime: q, lane: H, tag: S.tag, payload: S.payload, callback: S.callback, next: null }, F === null ? (L = F = q, E = V) : F = F.next = q, h |= H;
        if (S = S.next, S === null) {
          if (S = c.shared.pending, S === null) break;
          H = S, S = H.next, H.next = null, c.lastBaseUpdate = H, c.shared.pending = null;
        }
      } while (!0);
      if (F === null && (E = V), c.baseState = E, c.firstBaseUpdate = L, c.lastBaseUpdate = F, r = c.shared.interleaved, r !== null) {
        c = r;
        do
          h |= c.lane, c = c.next;
        while (c !== r);
      } else d === null && (c.shared.lanes = 0);
      xa |= h, n.lanes = h, n.memoizedState = V;
    }
  }
  function ad(n, r, l) {
    if (n = r.effects, r.effects = null, n !== null) for (r = 0; r < n.length; r++) {
      var o = n[r], c = o.callback;
      if (c !== null) {
        if (o.callback = null, o = l, typeof c != "function") throw Error(x(191, c));
        c.call(o);
      }
    }
  }
  var ho = {}, Ea = Nr(ho), mo = Nr(ho), yo = Nr(ho);
  function pl(n) {
    if (n === ho) throw Error(x(174));
    return n;
  }
  function id(n, r) {
    switch (oe(yo, r), oe(mo, n), oe(Ea, ho), n = r.nodeType, n) {
      case 9:
      case 11:
        r = (r = r.documentElement) ? r.namespaceURI : Ii(null, "");
        break;
      default:
        n = n === 8 ? r.parentNode : r, r = n.namespaceURI || null, n = n.tagName, r = Ii(r, n);
    }
    ct(Ea), oe(Ea, r);
  }
  function vl() {
    ct(Ea), ct(mo), ct(yo);
  }
  function Dv(n) {
    pl(yo.current);
    var r = pl(Ea.current), l = Ii(r, n.type);
    r !== l && (oe(mo, n), oe(Ea, l));
  }
  function Gs(n) {
    mo.current === n && (ct(Ea), ct(mo));
  }
  var St = Nr(0);
  function Ws(n) {
    for (var r = n; r !== null; ) {
      if (r.tag === 13) {
        var l = r.memoizedState;
        if (l !== null && (l = l.dehydrated, l === null || l.data === "$?" || l.data === "$!")) return r;
      } else if (r.tag === 19 && r.memoizedProps.revealOrder !== void 0) {
        if (r.flags & 128) return r;
      } else if (r.child !== null) {
        r.child.return = r, r = r.child;
        continue;
      }
      if (r === n) break;
      for (; r.sibling === null; ) {
        if (r.return === null || r.return === n) return null;
        r = r.return;
      }
      r.sibling.return = r.return, r = r.sibling;
    }
    return null;
  }
  var go = [];
  function ce() {
    for (var n = 0; n < go.length; n++) go[n]._workInProgressVersionPrimary = null;
    go.length = 0;
  }
  var ke = be.ReactCurrentDispatcher, Pe = be.ReactCurrentBatchConfig, nt = 0, Ye = null, jt = null, Jt = null, Xs = !1, So = !1, hl = 0, A = 0;
  function Be() {
    throw Error(x(321));
  }
  function ye(n, r) {
    if (r === null) return !1;
    for (var l = 0; l < r.length && l < n.length; l++) if (!ea(n[l], r[l])) return !1;
    return !0;
  }
  function Ri(n, r, l, o, c, d) {
    if (nt = d, Ye = r, r.memoizedState = null, r.updateQueue = null, r.lanes = 0, ke.current = n === null || n.memoizedState === null ? cc : wo, n = l(o, c), So) {
      d = 0;
      do {
        if (So = !1, hl = 0, 25 <= d) throw Error(x(301));
        d += 1, Jt = jt = null, r.updateQueue = null, ke.current = fc, n = l(o, c);
      } while (So);
    }
    if (ke.current = El, r = jt !== null && jt.next !== null, nt = 0, Jt = jt = Ye = null, Xs = !1, r) throw Error(x(300));
    return n;
  }
  function na() {
    var n = hl !== 0;
    return hl = 0, n;
  }
  function Tn() {
    var n = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return Jt === null ? Ye.memoizedState = Jt = n : Jt = Jt.next = n, Jt;
  }
  function bt() {
    if (jt === null) {
      var n = Ye.alternate;
      n = n !== null ? n.memoizedState : null;
    } else n = jt.next;
    var r = Jt === null ? Ye.memoizedState : Jt.next;
    if (r !== null) Jt = r, jt = n;
    else {
      if (n === null) throw Error(x(310));
      jt = n, n = { memoizedState: jt.memoizedState, baseState: jt.baseState, baseQueue: jt.baseQueue, queue: jt.queue, next: null }, Jt === null ? Ye.memoizedState = Jt = n : Jt = Jt.next = n;
    }
    return Jt;
  }
  function Qa(n, r) {
    return typeof r == "function" ? r(n) : r;
  }
  function xi(n) {
    var r = bt(), l = r.queue;
    if (l === null) throw Error(x(311));
    l.lastRenderedReducer = n;
    var o = jt, c = o.baseQueue, d = l.pending;
    if (d !== null) {
      if (c !== null) {
        var h = c.next;
        c.next = d.next, d.next = h;
      }
      o.baseQueue = c = d, l.pending = null;
    }
    if (c !== null) {
      d = c.next, o = o.baseState;
      var S = h = null, E = null, L = d;
      do {
        var F = L.lane;
        if ((nt & F) === F) E !== null && (E = E.next = { lane: 0, action: L.action, hasEagerState: L.hasEagerState, eagerState: L.eagerState, next: null }), o = L.hasEagerState ? L.eagerState : n(o, L.action);
        else {
          var V = {
            lane: F,
            action: L.action,
            hasEagerState: L.hasEagerState,
            eagerState: L.eagerState,
            next: null
          };
          E === null ? (S = E = V, h = o) : E = E.next = V, Ye.lanes |= F, xa |= F;
        }
        L = L.next;
      } while (L !== null && L !== d);
      E === null ? h = o : E.next = S, ea(o, r.memoizedState) || (Vt = !0), r.memoizedState = o, r.baseState = h, r.baseQueue = E, l.lastRenderedState = o;
    }
    if (n = l.interleaved, n !== null) {
      c = n;
      do
        d = c.lane, Ye.lanes |= d, xa |= d, c = c.next;
      while (c !== n);
    } else c === null && (l.lanes = 0);
    return [r.memoizedState, l.dispatch];
  }
  function ml(n) {
    var r = bt(), l = r.queue;
    if (l === null) throw Error(x(311));
    l.lastRenderedReducer = n;
    var o = l.dispatch, c = l.pending, d = r.memoizedState;
    if (c !== null) {
      l.pending = null;
      var h = c = c.next;
      do
        d = n(d, h.action), h = h.next;
      while (h !== c);
      ea(d, r.memoizedState) || (Vt = !0), r.memoizedState = d, r.baseQueue === null && (r.baseState = d), l.lastRenderedState = d;
    }
    return [d, o];
  }
  function qs() {
  }
  function Ks(n, r) {
    var l = Ye, o = bt(), c = r(), d = !ea(o.memoizedState, c);
    if (d && (o.memoizedState = c, Vt = !0), o = o.queue, Eo(ec.bind(null, l, o, n), [n]), o.getSnapshot !== r || d || Jt !== null && Jt.memoizedState.tag & 1) {
      if (l.flags |= 2048, yl(9, Js.bind(null, l, o, c, r), void 0, null), Xt === null) throw Error(x(349));
      nt & 30 || Zs(l, r, c);
    }
    return c;
  }
  function Zs(n, r, l) {
    n.flags |= 16384, n = { getSnapshot: r, value: l }, r = Ye.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, Ye.updateQueue = r, r.stores = [n]) : (l = r.stores, l === null ? r.stores = [n] : l.push(n));
  }
  function Js(n, r, l, o) {
    r.value = l, r.getSnapshot = o, tc(r) && nc(n);
  }
  function ec(n, r, l) {
    return l(function() {
      tc(r) && nc(n);
    });
  }
  function tc(n) {
    var r = n.getSnapshot;
    n = n.value;
    try {
      var l = r();
      return !ea(n, l);
    } catch {
      return !0;
    }
  }
  function nc(n) {
    var r = mr(n, 1);
    r !== null && Mn(r, n, 1, -1);
  }
  function rc(n) {
    var r = Tn();
    return typeof n == "function" && (n = n()), r.memoizedState = r.baseState = n, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Qa, lastRenderedState: n }, r.queue = n, n = n.dispatch = Sl.bind(null, Ye, n), [r.memoizedState, n];
  }
  function yl(n, r, l, o) {
    return n = { tag: n, create: r, destroy: l, deps: o, next: null }, r = Ye.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, Ye.updateQueue = r, r.lastEffect = n.next = n) : (l = r.lastEffect, l === null ? r.lastEffect = n.next = n : (o = l.next, l.next = n, n.next = o, r.lastEffect = n)), n;
  }
  function ac() {
    return bt().memoizedState;
  }
  function pu(n, r, l, o) {
    var c = Tn();
    Ye.flags |= n, c.memoizedState = yl(1 | r, l, void 0, o === void 0 ? null : o);
  }
  function vu(n, r, l, o) {
    var c = bt();
    o = o === void 0 ? null : o;
    var d = void 0;
    if (jt !== null) {
      var h = jt.memoizedState;
      if (d = h.destroy, o !== null && ye(o, h.deps)) {
        c.memoizedState = yl(r, l, d, o);
        return;
      }
    }
    Ye.flags |= n, c.memoizedState = yl(1 | r, l, d, o);
  }
  function ic(n, r) {
    return pu(8390656, 8, n, r);
  }
  function Eo(n, r) {
    return vu(2048, 8, n, r);
  }
  function lc(n, r) {
    return vu(4, 2, n, r);
  }
  function Co(n, r) {
    return vu(4, 4, n, r);
  }
  function gl(n, r) {
    if (typeof r == "function") return n = n(), r(n), function() {
      r(null);
    };
    if (r != null) return n = n(), r.current = n, function() {
      r.current = null;
    };
  }
  function uc(n, r, l) {
    return l = l != null ? l.concat([n]) : null, vu(4, 4, gl.bind(null, r, n), l);
  }
  function To() {
  }
  function oc(n, r) {
    var l = bt();
    r = r === void 0 ? null : r;
    var o = l.memoizedState;
    return o !== null && r !== null && ye(r, o[1]) ? o[0] : (l.memoizedState = [n, r], n);
  }
  function sc(n, r) {
    var l = bt();
    r = r === void 0 ? null : r;
    var o = l.memoizedState;
    return o !== null && r !== null && ye(r, o[1]) ? o[0] : (n = n(), l.memoizedState = [n, r], n);
  }
  function ld(n, r, l) {
    return nt & 21 ? (ea(l, r) || (l = vs(), Ye.lanes |= l, xa |= l, n.baseState = !0), r) : (n.baseState && (n.baseState = !1, Vt = !0), n.memoizedState = l);
  }
  function Ro(n, r) {
    var l = Ke;
    Ke = l !== 0 && 4 > l ? l : 4, n(!0);
    var o = Pe.transition;
    Pe.transition = {};
    try {
      n(!1), r();
    } finally {
      Ke = l, Pe.transition = o;
    }
  }
  function ud() {
    return bt().memoizedState;
  }
  function xo(n, r, l) {
    var o = wa(n);
    if (l = { lane: o, action: l, hasEagerState: !1, eagerState: null, next: null }, tr(n)) kv(r, l);
    else if (l = nd(n, r, l, o), l !== null) {
      var c = Yt();
      Mn(l, n, o, c), st(l, r, o);
    }
  }
  function Sl(n, r, l) {
    var o = wa(n), c = { lane: o, action: l, hasEagerState: !1, eagerState: null, next: null };
    if (tr(n)) kv(r, c);
    else {
      var d = n.alternate;
      if (n.lanes === 0 && (d === null || d.lanes === 0) && (d = r.lastRenderedReducer, d !== null)) try {
        var h = r.lastRenderedState, S = d(h, l);
        if (c.hasEagerState = !0, c.eagerState = S, ea(S, h)) {
          var E = r.interleaved;
          E === null ? (c.next = c, td(r)) : (c.next = E.next, E.next = c), r.interleaved = c;
          return;
        }
      } catch {
      } finally {
      }
      l = nd(n, r, c, o), l !== null && (c = Yt(), Mn(l, n, o, c), st(l, r, o));
    }
  }
  function tr(n) {
    var r = n.alternate;
    return n === Ye || r !== null && r === Ye;
  }
  function kv(n, r) {
    So = Xs = !0;
    var l = n.pending;
    l === null ? r.next = r : (r.next = l.next, l.next = r), n.pending = r;
  }
  function st(n, r, l) {
    if (l & 4194240) {
      var o = r.lanes;
      o &= n.pendingLanes, l |= o, r.lanes = l, hs(n, l);
    }
  }
  var El = { readContext: Ar, useCallback: Be, useContext: Be, useEffect: Be, useImperativeHandle: Be, useInsertionEffect: Be, useLayoutEffect: Be, useMemo: Be, useReducer: Be, useRef: Be, useState: Be, useDebugValue: Be, useDeferredValue: Be, useTransition: Be, useMutableSource: Be, useSyncExternalStore: Be, useId: Be, unstable_isNewReconciler: !1 }, cc = { readContext: Ar, useCallback: function(n, r) {
    return Tn().memoizedState = [n, r === void 0 ? null : r], n;
  }, useContext: Ar, useEffect: ic, useImperativeHandle: function(n, r, l) {
    return l = l != null ? l.concat([n]) : null, pu(
      4194308,
      4,
      gl.bind(null, r, n),
      l
    );
  }, useLayoutEffect: function(n, r) {
    return pu(4194308, 4, n, r);
  }, useInsertionEffect: function(n, r) {
    return pu(4, 2, n, r);
  }, useMemo: function(n, r) {
    var l = Tn();
    return r = r === void 0 ? null : r, n = n(), l.memoizedState = [n, r], n;
  }, useReducer: function(n, r, l) {
    var o = Tn();
    return r = l !== void 0 ? l(r) : r, o.memoizedState = o.baseState = r, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: n, lastRenderedState: r }, o.queue = n, n = n.dispatch = xo.bind(null, Ye, n), [o.memoizedState, n];
  }, useRef: function(n) {
    var r = Tn();
    return n = { current: n }, r.memoizedState = n;
  }, useState: rc, useDebugValue: To, useDeferredValue: function(n) {
    return Tn().memoizedState = n;
  }, useTransition: function() {
    var n = rc(!1), r = n[0];
    return n = Ro.bind(null, n[1]), Tn().memoizedState = n, [r, n];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(n, r, l) {
    var o = Ye, c = Tn();
    if (vt) {
      if (l === void 0) throw Error(x(407));
      l = l();
    } else {
      if (l = r(), Xt === null) throw Error(x(349));
      nt & 30 || Zs(o, r, l);
    }
    c.memoizedState = l;
    var d = { value: l, getSnapshot: r };
    return c.queue = d, ic(ec.bind(
      null,
      o,
      d,
      n
    ), [n]), o.flags |= 2048, yl(9, Js.bind(null, o, d, l, r), void 0, null), l;
  }, useId: function() {
    var n = Tn(), r = Xt.identifierPrefix;
    if (vt) {
      var l = Sa, o = ga;
      l = (o & ~(1 << 32 - br(o) - 1)).toString(32) + l, r = ":" + r + "R" + l, l = hl++, 0 < l && (r += "H" + l.toString(32)), r += ":";
    } else l = A++, r = ":" + r + "r" + l.toString(32) + ":";
    return n.memoizedState = r;
  }, unstable_isNewReconciler: !1 }, wo = {
    readContext: Ar,
    useCallback: oc,
    useContext: Ar,
    useEffect: Eo,
    useImperativeHandle: uc,
    useInsertionEffect: lc,
    useLayoutEffect: Co,
    useMemo: sc,
    useReducer: xi,
    useRef: ac,
    useState: function() {
      return xi(Qa);
    },
    useDebugValue: To,
    useDeferredValue: function(n) {
      var r = bt();
      return ld(r, jt.memoizedState, n);
    },
    useTransition: function() {
      var n = xi(Qa)[0], r = bt().memoizedState;
      return [n, r];
    },
    useMutableSource: qs,
    useSyncExternalStore: Ks,
    useId: ud,
    unstable_isNewReconciler: !1
  }, fc = { readContext: Ar, useCallback: oc, useContext: Ar, useEffect: Eo, useImperativeHandle: uc, useInsertionEffect: lc, useLayoutEffect: Co, useMemo: sc, useReducer: ml, useRef: ac, useState: function() {
    return ml(Qa);
  }, useDebugValue: To, useDeferredValue: function(n) {
    var r = bt();
    return jt === null ? r.memoizedState = n : ld(r, jt.memoizedState, n);
  }, useTransition: function() {
    var n = ml(Qa)[0], r = bt().memoizedState;
    return [n, r];
  }, useMutableSource: qs, useSyncExternalStore: Ks, useId: ud, unstable_isNewReconciler: !1 };
  function ra(n, r) {
    if (n && n.defaultProps) {
      r = te({}, r), n = n.defaultProps;
      for (var l in n) r[l] === void 0 && (r[l] = n[l]);
      return r;
    }
    return r;
  }
  function od(n, r, l, o) {
    r = n.memoizedState, l = l(o, r), l = l == null ? r : te({}, r, l), n.memoizedState = l, n.lanes === 0 && (n.updateQueue.baseState = l);
  }
  var dc = { isMounted: function(n) {
    return (n = n._reactInternals) ? Kr(n) === n : !1;
  }, enqueueSetState: function(n, r, l) {
    n = n._reactInternals;
    var o = Yt(), c = wa(n), d = Ya(o, c);
    d.payload = r, l != null && (d.callback = l), r = Ti(n, d, c), r !== null && (Mn(r, n, c, o), $s(r, n, c));
  }, enqueueReplaceState: function(n, r, l) {
    n = n._reactInternals;
    var o = Yt(), c = wa(n), d = Ya(o, c);
    d.tag = 1, d.payload = r, l != null && (d.callback = l), r = Ti(n, d, c), r !== null && (Mn(r, n, c, o), $s(r, n, c));
  }, enqueueForceUpdate: function(n, r) {
    n = n._reactInternals;
    var l = Yt(), o = wa(n), c = Ya(l, o);
    c.tag = 2, r != null && (c.callback = r), r = Ti(n, c, o), r !== null && (Mn(r, n, o, l), $s(r, n, o));
  } };
  function bv(n, r, l, o, c, d, h) {
    return n = n.stateNode, typeof n.shouldComponentUpdate == "function" ? n.shouldComponentUpdate(o, d, h) : r.prototype && r.prototype.isPureReactComponent ? !ro(l, o) || !ro(c, d) : !0;
  }
  function pc(n, r, l) {
    var o = !1, c = Cn, d = r.contextType;
    return typeof d == "object" && d !== null ? d = Ar(d) : (c = Ht(r) ? qn : wt.current, o = r.contextTypes, d = (o = o != null) ? Kn(n, c) : Cn), r = new r(l, d), n.memoizedState = r.state !== null && r.state !== void 0 ? r.state : null, r.updater = dc, n.stateNode = r, r._reactInternals = n, o && (n = n.stateNode, n.__reactInternalMemoizedUnmaskedChildContext = c, n.__reactInternalMemoizedMaskedChildContext = d), r;
  }
  function _v(n, r, l, o) {
    n = r.state, typeof r.componentWillReceiveProps == "function" && r.componentWillReceiveProps(l, o), typeof r.UNSAFE_componentWillReceiveProps == "function" && r.UNSAFE_componentWillReceiveProps(l, o), r.state !== n && dc.enqueueReplaceState(r, r.state, null);
  }
  function Do(n, r, l, o) {
    var c = n.stateNode;
    c.props = l, c.state = n.memoizedState, c.refs = {}, rd(n);
    var d = r.contextType;
    typeof d == "object" && d !== null ? c.context = Ar(d) : (d = Ht(r) ? qn : wt.current, c.context = Kn(n, d)), c.state = n.memoizedState, d = r.getDerivedStateFromProps, typeof d == "function" && (od(n, r, d, l), c.state = n.memoizedState), typeof r.getDerivedStateFromProps == "function" || typeof c.getSnapshotBeforeUpdate == "function" || typeof c.UNSAFE_componentWillMount != "function" && typeof c.componentWillMount != "function" || (r = c.state, typeof c.componentWillMount == "function" && c.componentWillMount(), typeof c.UNSAFE_componentWillMount == "function" && c.UNSAFE_componentWillMount(), r !== c.state && dc.enqueueReplaceState(c, c.state, null), vo(n, l, c, o), c.state = n.memoizedState), typeof c.componentDidMount == "function" && (n.flags |= 4194308);
  }
  function Cl(n, r) {
    try {
      var l = "", o = r;
      do
        l += Yi(o), o = o.return;
      while (o);
      var c = l;
    } catch (d) {
      c = `
Error generating stack: ` + d.message + `
` + d.stack;
    }
    return { value: n, source: r, stack: c, digest: null };
  }
  function sd(n, r, l) {
    return { value: n, source: null, stack: l ?? null, digest: r ?? null };
  }
  function cd(n, r) {
    try {
      console.error(r.value);
    } catch (l) {
      setTimeout(function() {
        throw l;
      });
    }
  }
  var vc = typeof WeakMap == "function" ? WeakMap : Map;
  function Lv(n, r, l) {
    l = Ya(-1, l), l.tag = 3, l.payload = { element: null };
    var o = r.value;
    return l.callback = function() {
      Eu || (Eu = !0, xl = o), cd(n, r);
    }, l;
  }
  function fd(n, r, l) {
    l = Ya(-1, l), l.tag = 3;
    var o = n.type.getDerivedStateFromError;
    if (typeof o == "function") {
      var c = r.value;
      l.payload = function() {
        return o(c);
      }, l.callback = function() {
        cd(n, r);
      };
    }
    var d = n.stateNode;
    return d !== null && typeof d.componentDidCatch == "function" && (l.callback = function() {
      cd(n, r), typeof o != "function" && (ki === null ? ki = /* @__PURE__ */ new Set([this]) : ki.add(this));
      var h = r.stack;
      this.componentDidCatch(r.value, { componentStack: h !== null ? h : "" });
    }), l;
  }
  function dd(n, r, l) {
    var o = n.pingCache;
    if (o === null) {
      o = n.pingCache = new vc();
      var c = /* @__PURE__ */ new Set();
      o.set(r, c);
    } else c = o.get(r), c === void 0 && (c = /* @__PURE__ */ new Set(), o.set(r, c));
    c.has(l) || (c.add(l), n = hy.bind(null, n, r, l), r.then(n, n));
  }
  function Ov(n) {
    do {
      var r;
      if ((r = n.tag === 13) && (r = n.memoizedState, r = r !== null ? r.dehydrated !== null : !0), r) return n;
      n = n.return;
    } while (n !== null);
    return null;
  }
  function wi(n, r, l, o, c) {
    return n.mode & 1 ? (n.flags |= 65536, n.lanes = c, n) : (n === r ? n.flags |= 65536 : (n.flags |= 128, l.flags |= 131072, l.flags &= -52805, l.tag === 1 && (l.alternate === null ? l.tag = 17 : (r = Ya(-1, 1), r.tag = 2, Ti(l, r, 1))), l.lanes |= 1), n);
  }
  var ko = be.ReactCurrentOwner, Vt = !1;
  function un(n, r, l, o) {
    r.child = n === null ? G(r, null, l, o) : kt(r, n.child, l, o);
  }
  function nr(n, r, l, o, c) {
    l = l.render;
    var d = r.ref;
    return gt(r, c), o = Ri(n, r, l, o, d, c), l = na(), n !== null && !Vt ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~c, Fr(n, r, c)) : (vt && l && Ps(r), r.flags |= 1, un(n, r, o, c), r.child);
  }
  function Tl(n, r, l, o, c) {
    if (n === null) {
      var d = l.type;
      return typeof d == "function" && !Dd(d) && d.defaultProps === void 0 && l.compare === null && l.defaultProps === void 0 ? (r.tag = 15, r.type = d, xe(n, r, d, o, c)) : (n = Yo(l.type, null, o, r, r.mode, c), n.ref = r.ref, n.return = r, r.child = n);
    }
    if (d = n.child, !(n.lanes & c)) {
      var h = d.memoizedProps;
      if (l = l.compare, l = l !== null ? l : ro, l(h, o) && n.ref === r.ref) return Fr(n, r, c);
    }
    return r.flags |= 1, n = _i(d, o), n.ref = r.ref, n.return = r, r.child = n;
  }
  function xe(n, r, l, o, c) {
    if (n !== null) {
      var d = n.memoizedProps;
      if (ro(d, o) && n.ref === r.ref) if (Vt = !1, r.pendingProps = o = d, (n.lanes & c) !== 0) n.flags & 131072 && (Vt = !0);
      else return r.lanes = n.lanes, Fr(n, r, c);
    }
    return Mv(n, r, l, o, c);
  }
  function bo(n, r, l) {
    var o = r.pendingProps, c = o.children, d = n !== null ? n.memoizedState : null;
    if (o.mode === "hidden") if (!(r.mode & 1)) r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, oe(yu, gr), gr |= l;
    else {
      if (!(l & 1073741824)) return n = d !== null ? d.baseLanes | l : l, r.lanes = r.childLanes = 1073741824, r.memoizedState = { baseLanes: n, cachePool: null, transitions: null }, r.updateQueue = null, oe(yu, gr), gr |= n, null;
      r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, o = d !== null ? d.baseLanes : l, oe(yu, gr), gr |= o;
    }
    else d !== null ? (o = d.baseLanes | l, r.memoizedState = null) : o = l, oe(yu, gr), gr |= o;
    return un(n, r, c, l), r.child;
  }
  function pd(n, r) {
    var l = r.ref;
    (n === null && l !== null || n !== null && n.ref !== l) && (r.flags |= 512, r.flags |= 2097152);
  }
  function Mv(n, r, l, o, c) {
    var d = Ht(l) ? qn : wt.current;
    return d = Kn(r, d), gt(r, c), l = Ri(n, r, l, o, d, c), o = na(), n !== null && !Vt ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~c, Fr(n, r, c)) : (vt && o && Ps(r), r.flags |= 1, un(n, r, l, c), r.child);
  }
  function Nv(n, r, l, o, c) {
    if (Ht(l)) {
      var d = !0;
      Zt(r);
    } else d = !1;
    if (gt(r, c), r.stateNode === null) Hr(n, r), pc(r, l, o), Do(r, l, o, c), o = !0;
    else if (n === null) {
      var h = r.stateNode, S = r.memoizedProps;
      h.props = S;
      var E = h.context, L = l.contextType;
      typeof L == "object" && L !== null ? L = Ar(L) : (L = Ht(l) ? qn : wt.current, L = Kn(r, L));
      var F = l.getDerivedStateFromProps, V = typeof F == "function" || typeof h.getSnapshotBeforeUpdate == "function";
      V || typeof h.UNSAFE_componentWillReceiveProps != "function" && typeof h.componentWillReceiveProps != "function" || (S !== o || E !== L) && _v(r, h, o, L), yr = !1;
      var H = r.memoizedState;
      h.state = H, vo(r, o, h, c), E = r.memoizedState, S !== o || H !== E || Gt.current || yr ? (typeof F == "function" && (od(r, l, F, o), E = r.memoizedState), (S = yr || bv(r, l, S, o, H, E, L)) ? (V || typeof h.UNSAFE_componentWillMount != "function" && typeof h.componentWillMount != "function" || (typeof h.componentWillMount == "function" && h.componentWillMount(), typeof h.UNSAFE_componentWillMount == "function" && h.UNSAFE_componentWillMount()), typeof h.componentDidMount == "function" && (r.flags |= 4194308)) : (typeof h.componentDidMount == "function" && (r.flags |= 4194308), r.memoizedProps = o, r.memoizedState = E), h.props = o, h.state = E, h.context = L, o = S) : (typeof h.componentDidMount == "function" && (r.flags |= 4194308), o = !1);
    } else {
      h = r.stateNode, xv(n, r), S = r.memoizedProps, L = r.type === r.elementType ? S : ra(r.type, S), h.props = L, V = r.pendingProps, H = h.context, E = l.contextType, typeof E == "object" && E !== null ? E = Ar(E) : (E = Ht(l) ? qn : wt.current, E = Kn(r, E));
      var q = l.getDerivedStateFromProps;
      (F = typeof q == "function" || typeof h.getSnapshotBeforeUpdate == "function") || typeof h.UNSAFE_componentWillReceiveProps != "function" && typeof h.componentWillReceiveProps != "function" || (S !== V || H !== E) && _v(r, h, o, E), yr = !1, H = r.memoizedState, h.state = H, vo(r, o, h, c);
      var ne = r.memoizedState;
      S !== V || H !== ne || Gt.current || yr ? (typeof q == "function" && (od(r, l, q, o), ne = r.memoizedState), (L = yr || bv(r, l, L, o, H, ne, E) || !1) ? (F || typeof h.UNSAFE_componentWillUpdate != "function" && typeof h.componentWillUpdate != "function" || (typeof h.componentWillUpdate == "function" && h.componentWillUpdate(o, ne, E), typeof h.UNSAFE_componentWillUpdate == "function" && h.UNSAFE_componentWillUpdate(o, ne, E)), typeof h.componentDidUpdate == "function" && (r.flags |= 4), typeof h.getSnapshotBeforeUpdate == "function" && (r.flags |= 1024)) : (typeof h.componentDidUpdate != "function" || S === n.memoizedProps && H === n.memoizedState || (r.flags |= 4), typeof h.getSnapshotBeforeUpdate != "function" || S === n.memoizedProps && H === n.memoizedState || (r.flags |= 1024), r.memoizedProps = o, r.memoizedState = ne), h.props = o, h.state = ne, h.context = E, o = L) : (typeof h.componentDidUpdate != "function" || S === n.memoizedProps && H === n.memoizedState || (r.flags |= 4), typeof h.getSnapshotBeforeUpdate != "function" || S === n.memoizedProps && H === n.memoizedState || (r.flags |= 1024), o = !1);
    }
    return _o(n, r, l, o, d, c);
  }
  function _o(n, r, l, o, c, d) {
    pd(n, r);
    var h = (r.flags & 128) !== 0;
    if (!o && !h) return c && Vs(r, l, !1), Fr(n, r, d);
    o = r.stateNode, ko.current = r;
    var S = h && typeof l.getDerivedStateFromError != "function" ? null : o.render();
    return r.flags |= 1, n !== null && h ? (r.child = kt(r, n.child, null, d), r.child = kt(r, null, S, d)) : un(n, r, S, d), r.memoizedState = o.state, c && Vs(r, l, !0), r.child;
  }
  function hu(n) {
    var r = n.stateNode;
    r.pendingContext ? Ev(n, r.pendingContext, r.pendingContext !== r.context) : r.context && Ev(n, r.context, !1), id(n, r.containerInfo);
  }
  function zv(n, r, l, o, c) {
    return Ci(), Pa(c), r.flags |= 256, un(n, r, l, o), r.child;
  }
  var hc = { dehydrated: null, treeContext: null, retryLane: 0 };
  function vd(n) {
    return { baseLanes: n, cachePool: null, transitions: null };
  }
  function mc(n, r, l) {
    var o = r.pendingProps, c = St.current, d = !1, h = (r.flags & 128) !== 0, S;
    if ((S = h) || (S = n !== null && n.memoizedState === null ? !1 : (c & 2) !== 0), S ? (d = !0, r.flags &= -129) : (n === null || n.memoizedState !== null) && (c |= 1), oe(St, c & 1), n === null)
      return qf(r), n = r.memoizedState, n !== null && (n = n.dehydrated, n !== null) ? (r.mode & 1 ? n.data === "$!" ? r.lanes = 8 : r.lanes = 1073741824 : r.lanes = 1, null) : (h = o.children, n = o.fallback, d ? (o = r.mode, d = r.child, h = { mode: "hidden", children: h }, !(o & 1) && d !== null ? (d.childLanes = 0, d.pendingProps = h) : d = Li(h, o, 0, null), n = Wa(n, o, l, null), d.return = r, n.return = r, d.sibling = n, r.child = d, r.child.memoizedState = vd(l), r.memoizedState = hc, n) : hd(r, h));
    if (c = n.memoizedState, c !== null && (S = c.dehydrated, S !== null)) return Uv(n, r, h, o, S, c, l);
    if (d) {
      d = o.fallback, h = r.mode, c = n.child, S = c.sibling;
      var E = { mode: "hidden", children: o.children };
      return !(h & 1) && r.child !== c ? (o = r.child, o.childLanes = 0, o.pendingProps = E, r.deletions = null) : (o = _i(c, E), o.subtreeFlags = c.subtreeFlags & 14680064), S !== null ? d = _i(S, d) : (d = Wa(d, h, l, null), d.flags |= 2), d.return = r, o.return = r, o.sibling = d, r.child = o, o = d, d = r.child, h = n.child.memoizedState, h = h === null ? vd(l) : { baseLanes: h.baseLanes | l, cachePool: null, transitions: h.transitions }, d.memoizedState = h, d.childLanes = n.childLanes & ~l, r.memoizedState = hc, o;
    }
    return d = n.child, n = d.sibling, o = _i(d, { mode: "visible", children: o.children }), !(r.mode & 1) && (o.lanes = l), o.return = r, o.sibling = null, n !== null && (l = r.deletions, l === null ? (r.deletions = [n], r.flags |= 16) : l.push(n)), r.child = o, r.memoizedState = null, o;
  }
  function hd(n, r) {
    return r = Li({ mode: "visible", children: r }, n.mode, 0, null), r.return = n, n.child = r;
  }
  function Lo(n, r, l, o) {
    return o !== null && Pa(o), kt(r, n.child, null, l), n = hd(r, r.pendingProps.children), n.flags |= 2, r.memoizedState = null, n;
  }
  function Uv(n, r, l, o, c, d, h) {
    if (l)
      return r.flags & 256 ? (r.flags &= -257, o = sd(Error(x(422))), Lo(n, r, h, o)) : r.memoizedState !== null ? (r.child = n.child, r.flags |= 128, null) : (d = o.fallback, c = r.mode, o = Li({ mode: "visible", children: o.children }, c, 0, null), d = Wa(d, c, h, null), d.flags |= 2, o.return = r, d.return = r, o.sibling = d, r.child = o, r.mode & 1 && kt(r, n.child, null, h), r.child.memoizedState = vd(h), r.memoizedState = hc, d);
    if (!(r.mode & 1)) return Lo(n, r, h, null);
    if (c.data === "$!") {
      if (o = c.nextSibling && c.nextSibling.dataset, o) var S = o.dgst;
      return o = S, d = Error(x(419)), o = sd(d, o, void 0), Lo(n, r, h, o);
    }
    if (S = (h & n.childLanes) !== 0, Vt || S) {
      if (o = Xt, o !== null) {
        switch (h & -h) {
          case 4:
            c = 2;
            break;
          case 16:
            c = 8;
            break;
          case 64:
          case 128:
          case 256:
          case 512:
          case 1024:
          case 2048:
          case 4096:
          case 8192:
          case 16384:
          case 32768:
          case 65536:
          case 131072:
          case 262144:
          case 524288:
          case 1048576:
          case 2097152:
          case 4194304:
          case 8388608:
          case 16777216:
          case 33554432:
          case 67108864:
            c = 32;
            break;
          case 536870912:
            c = 268435456;
            break;
          default:
            c = 0;
        }
        c = c & (o.suspendedLanes | h) ? 0 : c, c !== 0 && c !== d.retryLane && (d.retryLane = c, mr(n, c), Mn(o, n, c, -1));
      }
      return wd(), o = sd(Error(x(421))), Lo(n, r, h, o);
    }
    return c.data === "$?" ? (r.flags |= 128, r.child = n.child, r = my.bind(null, n), c._reactRetry = r, null) : (n = d.treeContext, Jn = va(c.nextSibling), Zn = r, vt = !0, Ur = null, n !== null && (Ft[zr++] = ga, Ft[zr++] = Sa, Ft[zr++] = vr, ga = n.id, Sa = n.overflow, vr = r), r = hd(r, o.children), r.flags |= 4096, r);
  }
  function md(n, r, l) {
    n.lanes |= r;
    var o = n.alternate;
    o !== null && (o.lanes |= r), ed(n.return, r, l);
  }
  function _n(n, r, l, o, c) {
    var d = n.memoizedState;
    d === null ? n.memoizedState = { isBackwards: r, rendering: null, renderingStartTime: 0, last: o, tail: l, tailMode: c } : (d.isBackwards = r, d.rendering = null, d.renderingStartTime = 0, d.last = o, d.tail = l, d.tailMode = c);
  }
  function Ca(n, r, l) {
    var o = r.pendingProps, c = o.revealOrder, d = o.tail;
    if (un(n, r, o.children, l), o = St.current, o & 2) o = o & 1 | 2, r.flags |= 128;
    else {
      if (n !== null && n.flags & 128) e: for (n = r.child; n !== null; ) {
        if (n.tag === 13) n.memoizedState !== null && md(n, l, r);
        else if (n.tag === 19) md(n, l, r);
        else if (n.child !== null) {
          n.child.return = n, n = n.child;
          continue;
        }
        if (n === r) break e;
        for (; n.sibling === null; ) {
          if (n.return === null || n.return === r) break e;
          n = n.return;
        }
        n.sibling.return = n.return, n = n.sibling;
      }
      o &= 1;
    }
    if (oe(St, o), !(r.mode & 1)) r.memoizedState = null;
    else switch (c) {
      case "forwards":
        for (l = r.child, c = null; l !== null; ) n = l.alternate, n !== null && Ws(n) === null && (c = l), l = l.sibling;
        l = c, l === null ? (c = r.child, r.child = null) : (c = l.sibling, l.sibling = null), _n(r, !1, c, l, d);
        break;
      case "backwards":
        for (l = null, c = r.child, r.child = null; c !== null; ) {
          if (n = c.alternate, n !== null && Ws(n) === null) {
            r.child = c;
            break;
          }
          n = c.sibling, c.sibling = l, l = c, c = n;
        }
        _n(r, !0, l, null, d);
        break;
      case "together":
        _n(r, !1, null, null, void 0);
        break;
      default:
        r.memoizedState = null;
    }
    return r.child;
  }
  function Hr(n, r) {
    !(r.mode & 1) && n !== null && (n.alternate = null, r.alternate = null, r.flags |= 2);
  }
  function Fr(n, r, l) {
    if (n !== null && (r.dependencies = n.dependencies), xa |= r.lanes, !(l & r.childLanes)) return null;
    if (n !== null && r.child !== n.child) throw Error(x(153));
    if (r.child !== null) {
      for (n = r.child, l = _i(n, n.pendingProps), r.child = l, l.return = r; n.sibling !== null; ) n = n.sibling, l = l.sibling = _i(n, n.pendingProps), l.return = r;
      l.sibling = null;
    }
    return r.child;
  }
  function Oo(n, r, l) {
    switch (r.tag) {
      case 3:
        hu(r), Ci();
        break;
      case 5:
        Dv(r);
        break;
      case 1:
        Ht(r.type) && Zt(r);
        break;
      case 4:
        id(r, r.stateNode.containerInfo);
        break;
      case 10:
        var o = r.type._context, c = r.memoizedProps.value;
        oe(hr, o._currentValue), o._currentValue = c;
        break;
      case 13:
        if (o = r.memoizedState, o !== null)
          return o.dehydrated !== null ? (oe(St, St.current & 1), r.flags |= 128, null) : l & r.child.childLanes ? mc(n, r, l) : (oe(St, St.current & 1), n = Fr(n, r, l), n !== null ? n.sibling : null);
        oe(St, St.current & 1);
        break;
      case 19:
        if (o = (l & r.childLanes) !== 0, n.flags & 128) {
          if (o) return Ca(n, r, l);
          r.flags |= 128;
        }
        if (c = r.memoizedState, c !== null && (c.rendering = null, c.tail = null, c.lastEffect = null), oe(St, St.current), o) break;
        return null;
      case 22:
      case 23:
        return r.lanes = 0, bo(n, r, l);
    }
    return Fr(n, r, l);
  }
  var jr, Bt, Av, Hv;
  jr = function(n, r) {
    for (var l = r.child; l !== null; ) {
      if (l.tag === 5 || l.tag === 6) n.appendChild(l.stateNode);
      else if (l.tag !== 4 && l.child !== null) {
        l.child.return = l, l = l.child;
        continue;
      }
      if (l === r) break;
      for (; l.sibling === null; ) {
        if (l.return === null || l.return === r) return;
        l = l.return;
      }
      l.sibling.return = l.return, l = l.sibling;
    }
  }, Bt = function() {
  }, Av = function(n, r, l, o) {
    var c = n.memoizedProps;
    if (c !== o) {
      n = r.stateNode, pl(Ea.current);
      var d = null;
      switch (l) {
        case "input":
          c = fr(n, c), o = fr(n, o), d = [];
          break;
        case "select":
          c = te({}, c, { value: void 0 }), o = te({}, o, { value: void 0 }), d = [];
          break;
        case "textarea":
          c = kr(n, c), o = kr(n, o), d = [];
          break;
        default:
          typeof c.onClick != "function" && typeof o.onClick == "function" && (n.onclick = hi);
      }
      zt(l, o);
      var h;
      l = null;
      for (L in c) if (!o.hasOwnProperty(L) && c.hasOwnProperty(L) && c[L] != null) if (L === "style") {
        var S = c[L];
        for (h in S) S.hasOwnProperty(h) && (l || (l = {}), l[h] = "");
      } else L !== "dangerouslySetInnerHTML" && L !== "children" && L !== "suppressContentEditableWarning" && L !== "suppressHydrationWarning" && L !== "autoFocus" && (we.hasOwnProperty(L) ? d || (d = []) : (d = d || []).push(L, null));
      for (L in o) {
        var E = o[L];
        if (S = c != null ? c[L] : void 0, o.hasOwnProperty(L) && E !== S && (E != null || S != null)) if (L === "style") if (S) {
          for (h in S) !S.hasOwnProperty(h) || E && E.hasOwnProperty(h) || (l || (l = {}), l[h] = "");
          for (h in E) E.hasOwnProperty(h) && S[h] !== E[h] && (l || (l = {}), l[h] = E[h]);
        } else l || (d || (d = []), d.push(
          L,
          l
        )), l = E;
        else L === "dangerouslySetInnerHTML" ? (E = E ? E.__html : void 0, S = S ? S.__html : void 0, E != null && S !== E && (d = d || []).push(L, E)) : L === "children" ? typeof E != "string" && typeof E != "number" || (d = d || []).push(L, "" + E) : L !== "suppressContentEditableWarning" && L !== "suppressHydrationWarning" && (we.hasOwnProperty(L) ? (E != null && L === "onScroll" && Xe("scroll", n), d || S === E || (d = [])) : (d = d || []).push(L, E));
      }
      l && (d = d || []).push("style", l);
      var L = d;
      (r.updateQueue = L) && (r.flags |= 4);
    }
  }, Hv = function(n, r, l, o) {
    l !== o && (r.flags |= 4);
  };
  function Mo(n, r) {
    if (!vt) switch (n.tailMode) {
      case "hidden":
        r = n.tail;
        for (var l = null; r !== null; ) r.alternate !== null && (l = r), r = r.sibling;
        l === null ? n.tail = null : l.sibling = null;
        break;
      case "collapsed":
        l = n.tail;
        for (var o = null; l !== null; ) l.alternate !== null && (o = l), l = l.sibling;
        o === null ? r || n.tail === null ? n.tail = null : n.tail.sibling = null : o.sibling = null;
    }
  }
  function en(n) {
    var r = n.alternate !== null && n.alternate.child === n.child, l = 0, o = 0;
    if (r) for (var c = n.child; c !== null; ) l |= c.lanes | c.childLanes, o |= c.subtreeFlags & 14680064, o |= c.flags & 14680064, c.return = n, c = c.sibling;
    else for (c = n.child; c !== null; ) l |= c.lanes | c.childLanes, o |= c.subtreeFlags, o |= c.flags, c.return = n, c = c.sibling;
    return n.subtreeFlags |= o, n.childLanes = l, r;
  }
  function Fv(n, r, l) {
    var o = r.pendingProps;
    switch (Ys(r), r.tag) {
      case 2:
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return en(r), null;
      case 1:
        return Ht(r.type) && cu(), en(r), null;
      case 3:
        return o = r.stateNode, vl(), ct(Gt), ct(wt), ce(), o.pendingContext && (o.context = o.pendingContext, o.pendingContext = null), (n === null || n.child === null) && (Qs(r) ? r.flags |= 4 : n === null || n.memoizedState.isDehydrated && !(r.flags & 256) || (r.flags |= 1024, Ur !== null && (wl(Ur), Ur = null))), Bt(n, r), en(r), null;
      case 5:
        Gs(r);
        var c = pl(yo.current);
        if (l = r.type, n !== null && r.stateNode != null) Av(n, r, l, o, c), n.ref !== r.ref && (r.flags |= 512, r.flags |= 2097152);
        else {
          if (!o) {
            if (r.stateNode === null) throw Error(x(166));
            return en(r), null;
          }
          if (n = pl(Ea.current), Qs(r)) {
            o = r.stateNode, l = r.type;
            var d = r.memoizedProps;
            switch (o[ha] = r, o[so] = d, n = (r.mode & 1) !== 0, l) {
              case "dialog":
                Xe("cancel", o), Xe("close", o);
                break;
              case "iframe":
              case "object":
              case "embed":
                Xe("load", o);
                break;
              case "video":
              case "audio":
                for (c = 0; c < lo.length; c++) Xe(lo[c], o);
                break;
              case "source":
                Xe("error", o);
                break;
              case "img":
              case "image":
              case "link":
                Xe(
                  "error",
                  o
                ), Xe("load", o);
                break;
              case "details":
                Xe("toggle", o);
                break;
              case "input":
                Dr(o, d), Xe("invalid", o);
                break;
              case "select":
                o._wrapperState = { wasMultiple: !!d.multiple }, Xe("invalid", o);
                break;
              case "textarea":
                Xr(o, d), Xe("invalid", o);
            }
            zt(l, d), c = null;
            for (var h in d) if (d.hasOwnProperty(h)) {
              var S = d[h];
              h === "children" ? typeof S == "string" ? o.textContent !== S && (d.suppressHydrationWarning !== !0 && As(o.textContent, S, n), c = ["children", S]) : typeof S == "number" && o.textContent !== "" + S && (d.suppressHydrationWarning !== !0 && As(
                o.textContent,
                S,
                n
              ), c = ["children", "" + S]) : we.hasOwnProperty(h) && S != null && h === "onScroll" && Xe("scroll", o);
            }
            switch (l) {
              case "input":
                Sn(o), Pu(o, d, !0);
                break;
              case "textarea":
                Sn(o), pr(o);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof d.onClick == "function" && (o.onclick = hi);
            }
            o = c, r.updateQueue = o, o !== null && (r.flags |= 4);
          } else {
            h = c.nodeType === 9 ? c : c.ownerDocument, n === "http://www.w3.org/1999/xhtml" && (n = da(l)), n === "http://www.w3.org/1999/xhtml" ? l === "script" ? (n = h.createElement("div"), n.innerHTML = "<script><\/script>", n = n.removeChild(n.firstChild)) : typeof o.is == "string" ? n = h.createElement(l, { is: o.is }) : (n = h.createElement(l), l === "select" && (h = n, o.multiple ? h.multiple = !0 : o.size && (h.size = o.size))) : n = h.createElementNS(n, l), n[ha] = r, n[so] = o, jr(n, r, !1, !1), r.stateNode = n;
            e: {
              switch (h = Gn(l, o), l) {
                case "dialog":
                  Xe("cancel", n), Xe("close", n), c = o;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  Xe("load", n), c = o;
                  break;
                case "video":
                case "audio":
                  for (c = 0; c < lo.length; c++) Xe(lo[c], n);
                  c = o;
                  break;
                case "source":
                  Xe("error", n), c = o;
                  break;
                case "img":
                case "image":
                case "link":
                  Xe(
                    "error",
                    n
                  ), Xe("load", n), c = o;
                  break;
                case "details":
                  Xe("toggle", n), c = o;
                  break;
                case "input":
                  Dr(n, o), c = fr(n, o), Xe("invalid", n);
                  break;
                case "option":
                  c = o;
                  break;
                case "select":
                  n._wrapperState = { wasMultiple: !!o.multiple }, c = te({}, o, { value: void 0 }), Xe("invalid", n);
                  break;
                case "textarea":
                  Xr(n, o), c = kr(n, o), Xe("invalid", n);
                  break;
                default:
                  c = o;
              }
              zt(l, c), S = c;
              for (d in S) if (S.hasOwnProperty(d)) {
                var E = S[d];
                d === "style" ? Tt(n, E) : d === "dangerouslySetInnerHTML" ? (E = E ? E.__html : void 0, E != null && Qu(n, E)) : d === "children" ? typeof E == "string" ? (l !== "textarea" || E !== "") && I(n, E) : typeof E == "number" && I(n, "" + E) : d !== "suppressContentEditableWarning" && d !== "suppressHydrationWarning" && d !== "autoFocus" && (we.hasOwnProperty(d) ? E != null && d === "onScroll" && Xe("scroll", n) : E != null && De(n, d, E, h));
              }
              switch (l) {
                case "input":
                  Sn(n), Pu(n, o, !1);
                  break;
                case "textarea":
                  Sn(n), pr(n);
                  break;
                case "option":
                  o.value != null && n.setAttribute("value", "" + wr(o.value));
                  break;
                case "select":
                  n.multiple = !!o.multiple, d = o.value, d != null ? dr(n, !!o.multiple, d, !1) : o.defaultValue != null && dr(
                    n,
                    !!o.multiple,
                    o.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof c.onClick == "function" && (n.onclick = hi);
              }
              switch (l) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  o = !!o.autoFocus;
                  break e;
                case "img":
                  o = !0;
                  break e;
                default:
                  o = !1;
              }
            }
            o && (r.flags |= 4);
          }
          r.ref !== null && (r.flags |= 512, r.flags |= 2097152);
        }
        return en(r), null;
      case 6:
        if (n && r.stateNode != null) Hv(n, r, n.memoizedProps, o);
        else {
          if (typeof o != "string" && r.stateNode === null) throw Error(x(166));
          if (l = pl(yo.current), pl(Ea.current), Qs(r)) {
            if (o = r.stateNode, l = r.memoizedProps, o[ha] = r, (d = o.nodeValue !== l) && (n = Zn, n !== null)) switch (n.tag) {
              case 3:
                As(o.nodeValue, l, (n.mode & 1) !== 0);
                break;
              case 5:
                n.memoizedProps.suppressHydrationWarning !== !0 && As(o.nodeValue, l, (n.mode & 1) !== 0);
            }
            d && (r.flags |= 4);
          } else o = (l.nodeType === 9 ? l : l.ownerDocument).createTextNode(o), o[ha] = r, r.stateNode = o;
        }
        return en(r), null;
      case 13:
        if (ct(St), o = r.memoizedState, n === null || n.memoizedState !== null && n.memoizedState.dehydrated !== null) {
          if (vt && Jn !== null && r.mode & 1 && !(r.flags & 128)) po(), Ci(), r.flags |= 98560, d = !1;
          else if (d = Qs(r), o !== null && o.dehydrated !== null) {
            if (n === null) {
              if (!d) throw Error(x(318));
              if (d = r.memoizedState, d = d !== null ? d.dehydrated : null, !d) throw Error(x(317));
              d[ha] = r;
            } else Ci(), !(r.flags & 128) && (r.memoizedState = null), r.flags |= 4;
            en(r), d = !1;
          } else Ur !== null && (wl(Ur), Ur = null), d = !0;
          if (!d) return r.flags & 65536 ? r : null;
        }
        return r.flags & 128 ? (r.lanes = l, r) : (o = o !== null, o !== (n !== null && n.memoizedState !== null) && o && (r.child.flags |= 8192, r.mode & 1 && (n === null || St.current & 1 ? Lt === 0 && (Lt = 3) : wd())), r.updateQueue !== null && (r.flags |= 4), en(r), null);
      case 4:
        return vl(), Bt(n, r), n === null && iu(r.stateNode.containerInfo), en(r), null;
      case 10:
        return Jf(r.type._context), en(r), null;
      case 17:
        return Ht(r.type) && cu(), en(r), null;
      case 19:
        if (ct(St), d = r.memoizedState, d === null) return en(r), null;
        if (o = (r.flags & 128) !== 0, h = d.rendering, h === null) if (o) Mo(d, !1);
        else {
          if (Lt !== 0 || n !== null && n.flags & 128) for (n = r.child; n !== null; ) {
            if (h = Ws(n), h !== null) {
              for (r.flags |= 128, Mo(d, !1), o = h.updateQueue, o !== null && (r.updateQueue = o, r.flags |= 4), r.subtreeFlags = 0, o = l, l = r.child; l !== null; ) d = l, n = o, d.flags &= 14680066, h = d.alternate, h === null ? (d.childLanes = 0, d.lanes = n, d.child = null, d.subtreeFlags = 0, d.memoizedProps = null, d.memoizedState = null, d.updateQueue = null, d.dependencies = null, d.stateNode = null) : (d.childLanes = h.childLanes, d.lanes = h.lanes, d.child = h.child, d.subtreeFlags = 0, d.deletions = null, d.memoizedProps = h.memoizedProps, d.memoizedState = h.memoizedState, d.updateQueue = h.updateQueue, d.type = h.type, n = h.dependencies, d.dependencies = n === null ? null : { lanes: n.lanes, firstContext: n.firstContext }), l = l.sibling;
              return oe(St, St.current & 1 | 2), r.child;
            }
            n = n.sibling;
          }
          d.tail !== null && ot() > Su && (r.flags |= 128, o = !0, Mo(d, !1), r.lanes = 4194304);
        }
        else {
          if (!o) if (n = Ws(h), n !== null) {
            if (r.flags |= 128, o = !0, l = n.updateQueue, l !== null && (r.updateQueue = l, r.flags |= 4), Mo(d, !0), d.tail === null && d.tailMode === "hidden" && !h.alternate && !vt) return en(r), null;
          } else 2 * ot() - d.renderingStartTime > Su && l !== 1073741824 && (r.flags |= 128, o = !0, Mo(d, !1), r.lanes = 4194304);
          d.isBackwards ? (h.sibling = r.child, r.child = h) : (l = d.last, l !== null ? l.sibling = h : r.child = h, d.last = h);
        }
        return d.tail !== null ? (r = d.tail, d.rendering = r, d.tail = r.sibling, d.renderingStartTime = ot(), r.sibling = null, l = St.current, oe(St, o ? l & 1 | 2 : l & 1), r) : (en(r), null);
      case 22:
      case 23:
        return xd(), o = r.memoizedState !== null, n !== null && n.memoizedState !== null !== o && (r.flags |= 8192), o && r.mode & 1 ? gr & 1073741824 && (en(r), r.subtreeFlags & 6 && (r.flags |= 8192)) : en(r), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(x(156, r.tag));
  }
  function yc(n, r) {
    switch (Ys(r), r.tag) {
      case 1:
        return Ht(r.type) && cu(), n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 3:
        return vl(), ct(Gt), ct(wt), ce(), n = r.flags, n & 65536 && !(n & 128) ? (r.flags = n & -65537 | 128, r) : null;
      case 5:
        return Gs(r), null;
      case 13:
        if (ct(St), n = r.memoizedState, n !== null && n.dehydrated !== null) {
          if (r.alternate === null) throw Error(x(340));
          Ci();
        }
        return n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 19:
        return ct(St), null;
      case 4:
        return vl(), null;
      case 10:
        return Jf(r.type._context), null;
      case 22:
      case 23:
        return xd(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var No = !1, Rn = !1, sy = typeof WeakSet == "function" ? WeakSet : Set, ee = null;
  function mu(n, r) {
    var l = n.ref;
    if (l !== null) if (typeof l == "function") try {
      l(null);
    } catch (o) {
      ht(n, r, o);
    }
    else l.current = null;
  }
  function gc(n, r, l) {
    try {
      l();
    } catch (o) {
      ht(n, r, o);
    }
  }
  var jv = !1;
  function Vv(n, r) {
    if (oo = el, n = ao(), bs(n)) {
      if ("selectionStart" in n) var l = { start: n.selectionStart, end: n.selectionEnd };
      else e: {
        l = (l = n.ownerDocument) && l.defaultView || window;
        var o = l.getSelection && l.getSelection();
        if (o && o.rangeCount !== 0) {
          l = o.anchorNode;
          var c = o.anchorOffset, d = o.focusNode;
          o = o.focusOffset;
          try {
            l.nodeType, d.nodeType;
          } catch {
            l = null;
            break e;
          }
          var h = 0, S = -1, E = -1, L = 0, F = 0, V = n, H = null;
          t: for (; ; ) {
            for (var q; V !== l || c !== 0 && V.nodeType !== 3 || (S = h + c), V !== d || o !== 0 && V.nodeType !== 3 || (E = h + o), V.nodeType === 3 && (h += V.nodeValue.length), (q = V.firstChild) !== null; )
              H = V, V = q;
            for (; ; ) {
              if (V === n) break t;
              if (H === l && ++L === c && (S = h), H === d && ++F === o && (E = h), (q = V.nextSibling) !== null) break;
              V = H, H = V.parentNode;
            }
            V = q;
          }
          l = S === -1 || E === -1 ? null : { start: S, end: E };
        } else l = null;
      }
      l = l || { start: 0, end: 0 };
    } else l = null;
    for (ul = { focusedElem: n, selectionRange: l }, el = !1, ee = r; ee !== null; ) if (r = ee, n = r.child, (r.subtreeFlags & 1028) !== 0 && n !== null) n.return = r, ee = n;
    else for (; ee !== null; ) {
      r = ee;
      try {
        var ne = r.alternate;
        if (r.flags & 1024) switch (r.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (ne !== null) {
              var ie = ne.memoizedProps, Ot = ne.memoizedState, w = r.stateNode, T = w.getSnapshotBeforeUpdate(r.elementType === r.type ? ie : ra(r.type, ie), Ot);
              w.__reactInternalSnapshotBeforeUpdate = T;
            }
            break;
          case 3:
            var b = r.stateNode.containerInfo;
            b.nodeType === 1 ? b.textContent = "" : b.nodeType === 9 && b.documentElement && b.removeChild(b.documentElement);
            break;
          case 5:
          case 6:
          case 4:
          case 17:
            break;
          default:
            throw Error(x(163));
        }
      } catch (j) {
        ht(r, r.return, j);
      }
      if (n = r.sibling, n !== null) {
        n.return = r.return, ee = n;
        break;
      }
      ee = r.return;
    }
    return ne = jv, jv = !1, ne;
  }
  function zo(n, r, l) {
    var o = r.updateQueue;
    if (o = o !== null ? o.lastEffect : null, o !== null) {
      var c = o = o.next;
      do {
        if ((c.tag & n) === n) {
          var d = c.destroy;
          c.destroy = void 0, d !== void 0 && gc(r, l, d);
        }
        c = c.next;
      } while (c !== o);
    }
  }
  function Uo(n, r) {
    if (r = r.updateQueue, r = r !== null ? r.lastEffect : null, r !== null) {
      var l = r = r.next;
      do {
        if ((l.tag & n) === n) {
          var o = l.create;
          l.destroy = o();
        }
        l = l.next;
      } while (l !== r);
    }
  }
  function yd(n) {
    var r = n.ref;
    if (r !== null) {
      var l = n.stateNode;
      switch (n.tag) {
        case 5:
          n = l;
          break;
        default:
          n = l;
      }
      typeof r == "function" ? r(n) : r.current = n;
    }
  }
  function Sc(n) {
    var r = n.alternate;
    r !== null && (n.alternate = null, Sc(r)), n.child = null, n.deletions = null, n.sibling = null, n.tag === 5 && (r = n.stateNode, r !== null && (delete r[ha], delete r[so], delete r[co], delete r[su], delete r[uy])), n.stateNode = null, n.return = null, n.dependencies = null, n.memoizedProps = null, n.memoizedState = null, n.pendingProps = null, n.stateNode = null, n.updateQueue = null;
  }
  function Ao(n) {
    return n.tag === 5 || n.tag === 3 || n.tag === 4;
  }
  function Ia(n) {
    e: for (; ; ) {
      for (; n.sibling === null; ) {
        if (n.return === null || Ao(n.return)) return null;
        n = n.return;
      }
      for (n.sibling.return = n.return, n = n.sibling; n.tag !== 5 && n.tag !== 6 && n.tag !== 18; ) {
        if (n.flags & 2 || n.child === null || n.tag === 4) continue e;
        n.child.return = n, n = n.child;
      }
      if (!(n.flags & 2)) return n.stateNode;
    }
  }
  function Ta(n, r, l) {
    var o = n.tag;
    if (o === 5 || o === 6) n = n.stateNode, r ? l.nodeType === 8 ? l.parentNode.insertBefore(n, r) : l.insertBefore(n, r) : (l.nodeType === 8 ? (r = l.parentNode, r.insertBefore(n, l)) : (r = l, r.appendChild(n)), l = l._reactRootContainer, l != null || r.onclick !== null || (r.onclick = hi));
    else if (o !== 4 && (n = n.child, n !== null)) for (Ta(n, r, l), n = n.sibling; n !== null; ) Ta(n, r, l), n = n.sibling;
  }
  function Ra(n, r, l) {
    var o = n.tag;
    if (o === 5 || o === 6) n = n.stateNode, r ? l.insertBefore(n, r) : l.appendChild(n);
    else if (o !== 4 && (n = n.child, n !== null)) for (Ra(n, r, l), n = n.sibling; n !== null; ) Ra(n, r, l), n = n.sibling;
  }
  var _t = null, Ln = !1;
  function On(n, r, l) {
    for (l = l.child; l !== null; ) Bv(n, r, l), l = l.sibling;
  }
  function Bv(n, r, l) {
    if (Zr && typeof Zr.onCommitFiberUnmount == "function") try {
      Zr.onCommitFiberUnmount(Gu, l);
    } catch {
    }
    switch (l.tag) {
      case 5:
        Rn || mu(l, r);
      case 6:
        var o = _t, c = Ln;
        _t = null, On(n, r, l), _t = o, Ln = c, _t !== null && (Ln ? (n = _t, l = l.stateNode, n.nodeType === 8 ? n.parentNode.removeChild(l) : n.removeChild(l)) : _t.removeChild(l.stateNode));
        break;
      case 18:
        _t !== null && (Ln ? (n = _t, l = l.stateNode, n.nodeType === 8 ? ou(n.parentNode, l) : n.nodeType === 1 && ou(n, l), di(n)) : ou(_t, l.stateNode));
        break;
      case 4:
        o = _t, c = Ln, _t = l.stateNode.containerInfo, Ln = !0, On(n, r, l), _t = o, Ln = c;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!Rn && (o = l.updateQueue, o !== null && (o = o.lastEffect, o !== null))) {
          c = o = o.next;
          do {
            var d = c, h = d.destroy;
            d = d.tag, h !== void 0 && (d & 2 || d & 4) && gc(l, r, h), c = c.next;
          } while (c !== o);
        }
        On(n, r, l);
        break;
      case 1:
        if (!Rn && (mu(l, r), o = l.stateNode, typeof o.componentWillUnmount == "function")) try {
          o.props = l.memoizedProps, o.state = l.memoizedState, o.componentWillUnmount();
        } catch (S) {
          ht(l, r, S);
        }
        On(n, r, l);
        break;
      case 21:
        On(n, r, l);
        break;
      case 22:
        l.mode & 1 ? (Rn = (o = Rn) || l.memoizedState !== null, On(n, r, l), Rn = o) : On(n, r, l);
        break;
      default:
        On(n, r, l);
    }
  }
  function Pv(n) {
    var r = n.updateQueue;
    if (r !== null) {
      n.updateQueue = null;
      var l = n.stateNode;
      l === null && (l = n.stateNode = new sy()), r.forEach(function(o) {
        var c = Kv.bind(null, n, o);
        l.has(o) || (l.add(o), o.then(c, c));
      });
    }
  }
  function aa(n, r) {
    var l = r.deletions;
    if (l !== null) for (var o = 0; o < l.length; o++) {
      var c = l[o];
      try {
        var d = n, h = r, S = h;
        e: for (; S !== null; ) {
          switch (S.tag) {
            case 5:
              _t = S.stateNode, Ln = !1;
              break e;
            case 3:
              _t = S.stateNode.containerInfo, Ln = !0;
              break e;
            case 4:
              _t = S.stateNode.containerInfo, Ln = !0;
              break e;
          }
          S = S.return;
        }
        if (_t === null) throw Error(x(160));
        Bv(d, h, c), _t = null, Ln = !1;
        var E = c.alternate;
        E !== null && (E.return = null), c.return = null;
      } catch (L) {
        ht(c, r, L);
      }
    }
    if (r.subtreeFlags & 12854) for (r = r.child; r !== null; ) gd(r, n), r = r.sibling;
  }
  function gd(n, r) {
    var l = n.alternate, o = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (aa(r, n), rr(n), o & 4) {
          try {
            zo(3, n, n.return), Uo(3, n);
          } catch (ie) {
            ht(n, n.return, ie);
          }
          try {
            zo(5, n, n.return);
          } catch (ie) {
            ht(n, n.return, ie);
          }
        }
        break;
      case 1:
        aa(r, n), rr(n), o & 512 && l !== null && mu(l, l.return);
        break;
      case 5:
        if (aa(r, n), rr(n), o & 512 && l !== null && mu(l, l.return), n.flags & 32) {
          var c = n.stateNode;
          try {
            I(c, "");
          } catch (ie) {
            ht(n, n.return, ie);
          }
        }
        if (o & 4 && (c = n.stateNode, c != null)) {
          var d = n.memoizedProps, h = l !== null ? l.memoizedProps : d, S = n.type, E = n.updateQueue;
          if (n.updateQueue = null, E !== null) try {
            S === "input" && d.type === "radio" && d.name != null && fa(c, d), Gn(S, h);
            var L = Gn(S, d);
            for (h = 0; h < E.length; h += 2) {
              var F = E[h], V = E[h + 1];
              F === "style" ? Tt(c, V) : F === "dangerouslySetInnerHTML" ? Qu(c, V) : F === "children" ? I(c, V) : De(c, F, V, L);
            }
            switch (S) {
              case "input":
                Ql(c, d);
                break;
              case "textarea":
                Il(c, d);
                break;
              case "select":
                var H = c._wrapperState.wasMultiple;
                c._wrapperState.wasMultiple = !!d.multiple;
                var q = d.value;
                q != null ? dr(c, !!d.multiple, q, !1) : H !== !!d.multiple && (d.defaultValue != null ? dr(
                  c,
                  !!d.multiple,
                  d.defaultValue,
                  !0
                ) : dr(c, !!d.multiple, d.multiple ? [] : "", !1));
            }
            c[so] = d;
          } catch (ie) {
            ht(n, n.return, ie);
          }
        }
        break;
      case 6:
        if (aa(r, n), rr(n), o & 4) {
          if (n.stateNode === null) throw Error(x(162));
          c = n.stateNode, d = n.memoizedProps;
          try {
            c.nodeValue = d;
          } catch (ie) {
            ht(n, n.return, ie);
          }
        }
        break;
      case 3:
        if (aa(r, n), rr(n), o & 4 && l !== null && l.memoizedState.isDehydrated) try {
          di(r.containerInfo);
        } catch (ie) {
          ht(n, n.return, ie);
        }
        break;
      case 4:
        aa(r, n), rr(n);
        break;
      case 13:
        aa(r, n), rr(n), c = n.child, c.flags & 8192 && (d = c.memoizedState !== null, c.stateNode.isHidden = d, !d || c.alternate !== null && c.alternate.memoizedState !== null || (Cd = ot())), o & 4 && Pv(n);
        break;
      case 22:
        if (F = l !== null && l.memoizedState !== null, n.mode & 1 ? (Rn = (L = Rn) || F, aa(r, n), Rn = L) : aa(r, n), rr(n), o & 8192) {
          if (L = n.memoizedState !== null, (n.stateNode.isHidden = L) && !F && n.mode & 1) for (ee = n, F = n.child; F !== null; ) {
            for (V = ee = F; ee !== null; ) {
              switch (H = ee, q = H.child, H.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  zo(4, H, H.return);
                  break;
                case 1:
                  mu(H, H.return);
                  var ne = H.stateNode;
                  if (typeof ne.componentWillUnmount == "function") {
                    o = H, l = H.return;
                    try {
                      r = o, ne.props = r.memoizedProps, ne.state = r.memoizedState, ne.componentWillUnmount();
                    } catch (ie) {
                      ht(o, l, ie);
                    }
                  }
                  break;
                case 5:
                  mu(H, H.return);
                  break;
                case 22:
                  if (H.memoizedState !== null) {
                    Ho(V);
                    continue;
                  }
              }
              q !== null ? (q.return = H, ee = q) : Ho(V);
            }
            F = F.sibling;
          }
          e: for (F = null, V = n; ; ) {
            if (V.tag === 5) {
              if (F === null) {
                F = V;
                try {
                  c = V.stateNode, L ? (d = c.style, typeof d.setProperty == "function" ? d.setProperty("display", "none", "important") : d.display = "none") : (S = V.stateNode, E = V.memoizedProps.style, h = E != null && E.hasOwnProperty("display") ? E.display : null, S.style.display = ut("display", h));
                } catch (ie) {
                  ht(n, n.return, ie);
                }
              }
            } else if (V.tag === 6) {
              if (F === null) try {
                V.stateNode.nodeValue = L ? "" : V.memoizedProps;
              } catch (ie) {
                ht(n, n.return, ie);
              }
            } else if ((V.tag !== 22 && V.tag !== 23 || V.memoizedState === null || V === n) && V.child !== null) {
              V.child.return = V, V = V.child;
              continue;
            }
            if (V === n) break e;
            for (; V.sibling === null; ) {
              if (V.return === null || V.return === n) break e;
              F === V && (F = null), V = V.return;
            }
            F === V && (F = null), V.sibling.return = V.return, V = V.sibling;
          }
        }
        break;
      case 19:
        aa(r, n), rr(n), o & 4 && Pv(n);
        break;
      case 21:
        break;
      default:
        aa(
          r,
          n
        ), rr(n);
    }
  }
  function rr(n) {
    var r = n.flags;
    if (r & 2) {
      try {
        e: {
          for (var l = n.return; l !== null; ) {
            if (Ao(l)) {
              var o = l;
              break e;
            }
            l = l.return;
          }
          throw Error(x(160));
        }
        switch (o.tag) {
          case 5:
            var c = o.stateNode;
            o.flags & 32 && (I(c, ""), o.flags &= -33);
            var d = Ia(n);
            Ra(n, d, c);
            break;
          case 3:
          case 4:
            var h = o.stateNode.containerInfo, S = Ia(n);
            Ta(n, S, h);
            break;
          default:
            throw Error(x(161));
        }
      } catch (E) {
        ht(n, n.return, E);
      }
      n.flags &= -3;
    }
    r & 4096 && (n.flags &= -4097);
  }
  function cy(n, r, l) {
    ee = n, Sd(n);
  }
  function Sd(n, r, l) {
    for (var o = (n.mode & 1) !== 0; ee !== null; ) {
      var c = ee, d = c.child;
      if (c.tag === 22 && o) {
        var h = c.memoizedState !== null || No;
        if (!h) {
          var S = c.alternate, E = S !== null && S.memoizedState !== null || Rn;
          S = No;
          var L = Rn;
          if (No = h, (Rn = E) && !L) for (ee = c; ee !== null; ) h = ee, E = h.child, h.tag === 22 && h.memoizedState !== null ? Ed(c) : E !== null ? (E.return = h, ee = E) : Ed(c);
          for (; d !== null; ) ee = d, Sd(d), d = d.sibling;
          ee = c, No = S, Rn = L;
        }
        Yv(n);
      } else c.subtreeFlags & 8772 && d !== null ? (d.return = c, ee = d) : Yv(n);
    }
  }
  function Yv(n) {
    for (; ee !== null; ) {
      var r = ee;
      if (r.flags & 8772) {
        var l = r.alternate;
        try {
          if (r.flags & 8772) switch (r.tag) {
            case 0:
            case 11:
            case 15:
              Rn || Uo(5, r);
              break;
            case 1:
              var o = r.stateNode;
              if (r.flags & 4 && !Rn) if (l === null) o.componentDidMount();
              else {
                var c = r.elementType === r.type ? l.memoizedProps : ra(r.type, l.memoizedProps);
                o.componentDidUpdate(c, l.memoizedState, o.__reactInternalSnapshotBeforeUpdate);
              }
              var d = r.updateQueue;
              d !== null && ad(r, d, o);
              break;
            case 3:
              var h = r.updateQueue;
              if (h !== null) {
                if (l = null, r.child !== null) switch (r.child.tag) {
                  case 5:
                    l = r.child.stateNode;
                    break;
                  case 1:
                    l = r.child.stateNode;
                }
                ad(r, h, l);
              }
              break;
            case 5:
              var S = r.stateNode;
              if (l === null && r.flags & 4) {
                l = S;
                var E = r.memoizedProps;
                switch (r.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    E.autoFocus && l.focus();
                    break;
                  case "img":
                    E.src && (l.src = E.src);
                }
              }
              break;
            case 6:
              break;
            case 4:
              break;
            case 12:
              break;
            case 13:
              if (r.memoizedState === null) {
                var L = r.alternate;
                if (L !== null) {
                  var F = L.memoizedState;
                  if (F !== null) {
                    var V = F.dehydrated;
                    V !== null && di(V);
                  }
                }
              }
              break;
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
            case 25:
              break;
            default:
              throw Error(x(163));
          }
          Rn || r.flags & 512 && yd(r);
        } catch (H) {
          ht(r, r.return, H);
        }
      }
      if (r === n) {
        ee = null;
        break;
      }
      if (l = r.sibling, l !== null) {
        l.return = r.return, ee = l;
        break;
      }
      ee = r.return;
    }
  }
  function Ho(n) {
    for (; ee !== null; ) {
      var r = ee;
      if (r === n) {
        ee = null;
        break;
      }
      var l = r.sibling;
      if (l !== null) {
        l.return = r.return, ee = l;
        break;
      }
      ee = r.return;
    }
  }
  function Ed(n) {
    for (; ee !== null; ) {
      var r = ee;
      try {
        switch (r.tag) {
          case 0:
          case 11:
          case 15:
            var l = r.return;
            try {
              Uo(4, r);
            } catch (E) {
              ht(r, l, E);
            }
            break;
          case 1:
            var o = r.stateNode;
            if (typeof o.componentDidMount == "function") {
              var c = r.return;
              try {
                o.componentDidMount();
              } catch (E) {
                ht(r, c, E);
              }
            }
            var d = r.return;
            try {
              yd(r);
            } catch (E) {
              ht(r, d, E);
            }
            break;
          case 5:
            var h = r.return;
            try {
              yd(r);
            } catch (E) {
              ht(r, h, E);
            }
        }
      } catch (E) {
        ht(r, r.return, E);
      }
      if (r === n) {
        ee = null;
        break;
      }
      var S = r.sibling;
      if (S !== null) {
        S.return = r.return, ee = S;
        break;
      }
      ee = r.return;
    }
  }
  var fy = Math.ceil, Di = be.ReactCurrentDispatcher, Rl = be.ReactCurrentOwner, on = be.ReactCurrentBatchConfig, Fe = 0, Xt = null, Pt = null, sn = 0, gr = 0, yu = Nr(0), Lt = 0, Fo = null, xa = 0, gu = 0, Ec = 0, jo = null, ar = null, Cd = 0, Su = 1 / 0, Sr = null, Eu = !1, xl = null, ki = null, Cc = !1, $a = null, Vo = 0, bi = 0, Cu = null, Bo = -1, xn = 0;
  function Yt() {
    return Fe & 6 ? ot() : Bo !== -1 ? Bo : Bo = ot();
  }
  function wa(n) {
    return n.mode & 1 ? Fe & 2 && sn !== 0 ? sn & -sn : oy.transition !== null ? (xn === 0 && (xn = vs()), xn) : (n = Ke, n !== 0 || (n = window.event, n = n === void 0 ? 16 : gs(n.type)), n) : 1;
  }
  function Mn(n, r, l, o) {
    if (50 < bi) throw bi = 0, Cu = null, Error(x(185));
    Zi(n, l, o), (!(Fe & 2) || n !== Xt) && (n === Xt && (!(Fe & 2) && (gu |= l), Lt === 4 && ia(n, sn)), ir(n, o), l === 1 && Fe === 0 && !(r.mode & 1) && (Su = ot() + 500, fu && ya()));
  }
  function ir(n, r) {
    var l = n.callbackNode;
    yf(n, r);
    var o = Ki(n, n === Xt ? sn : 0);
    if (o === 0) l !== null && Fp(l), n.callbackNode = null, n.callbackPriority = 0;
    else if (r = o & -o, n.callbackPriority !== r) {
      if (l != null && Fp(l), r === 1) n.tag === 0 ? yi(Td.bind(null, n)) : Bs(Td.bind(null, n)), uu(function() {
        !(Fe & 6) && ya();
      }), l = null;
      else {
        switch (Ef(o)) {
          case 1:
            l = Xi;
            break;
          case 4:
            l = vf;
            break;
          case 16:
            l = $u;
            break;
          case 536870912:
            l = hf;
            break;
          default:
            l = $u;
        }
        l = Jv(l, Tc.bind(null, n));
      }
      n.callbackPriority = r, n.callbackNode = l;
    }
  }
  function Tc(n, r) {
    if (Bo = -1, xn = 0, Fe & 6) throw Error(x(327));
    var l = n.callbackNode;
    if (Tu() && n.callbackNode !== l) return null;
    var o = Ki(n, n === Xt ? sn : 0);
    if (o === 0) return null;
    if (o & 30 || o & n.expiredLanes || r) r = Rc(n, o);
    else {
      r = o;
      var c = Fe;
      Fe |= 2;
      var d = Iv();
      (Xt !== n || sn !== r) && (Sr = null, Su = ot() + 500, Ga(n, r));
      do
        try {
          $v();
          break;
        } catch (S) {
          Qv(n, S);
        }
      while (!0);
      Zf(), Di.current = d, Fe = c, Pt !== null ? r = 0 : (Xt = null, sn = 0, r = Lt);
    }
    if (r !== 0) {
      if (r === 2 && (c = gf(n), c !== 0 && (o = c, r = Po(n, c))), r === 1) throw l = Fo, Ga(n, 0), ia(n, o), ir(n, ot()), l;
      if (r === 6) ia(n, o);
      else {
        if (c = n.current.alternate, !(o & 30) && !dy(c) && (r = Rc(n, o), r === 2 && (d = gf(n), d !== 0 && (o = d, r = Po(n, d))), r === 1)) throw l = Fo, Ga(n, 0), ia(n, o), ir(n, ot()), l;
        switch (n.finishedWork = c, n.finishedLanes = o, r) {
          case 0:
          case 1:
            throw Error(x(345));
          case 2:
            kl(n, ar, Sr);
            break;
          case 3:
            if (ia(n, o), (o & 130023424) === o && (r = Cd + 500 - ot(), 10 < r)) {
              if (Ki(n, 0) !== 0) break;
              if (c = n.suspendedLanes, (c & o) !== o) {
                Yt(), n.pingedLanes |= n.suspendedLanes & c;
                break;
              }
              n.timeoutHandle = Fs(kl.bind(null, n, ar, Sr), r);
              break;
            }
            kl(n, ar, Sr);
            break;
          case 4:
            if (ia(n, o), (o & 4194240) === o) break;
            for (r = n.eventTimes, c = -1; 0 < o; ) {
              var h = 31 - br(o);
              d = 1 << h, h = r[h], h > c && (c = h), o &= ~d;
            }
            if (o = c, o = ot() - o, o = (120 > o ? 120 : 480 > o ? 480 : 1080 > o ? 1080 : 1920 > o ? 1920 : 3e3 > o ? 3e3 : 4320 > o ? 4320 : 1960 * fy(o / 1960)) - o, 10 < o) {
              n.timeoutHandle = Fs(kl.bind(null, n, ar, Sr), o);
              break;
            }
            kl(n, ar, Sr);
            break;
          case 5:
            kl(n, ar, Sr);
            break;
          default:
            throw Error(x(329));
        }
      }
    }
    return ir(n, ot()), n.callbackNode === l ? Tc.bind(null, n) : null;
  }
  function Po(n, r) {
    var l = jo;
    return n.current.memoizedState.isDehydrated && (Ga(n, r).flags |= 256), n = Rc(n, r), n !== 2 && (r = ar, ar = l, r !== null && wl(r)), n;
  }
  function wl(n) {
    ar === null ? ar = n : ar.push.apply(ar, n);
  }
  function dy(n) {
    for (var r = n; ; ) {
      if (r.flags & 16384) {
        var l = r.updateQueue;
        if (l !== null && (l = l.stores, l !== null)) for (var o = 0; o < l.length; o++) {
          var c = l[o], d = c.getSnapshot;
          c = c.value;
          try {
            if (!ea(d(), c)) return !1;
          } catch {
            return !1;
          }
        }
      }
      if (l = r.child, r.subtreeFlags & 16384 && l !== null) l.return = r, r = l;
      else {
        if (r === n) break;
        for (; r.sibling === null; ) {
          if (r.return === null || r.return === n) return !0;
          r = r.return;
        }
        r.sibling.return = r.return, r = r.sibling;
      }
    }
    return !0;
  }
  function ia(n, r) {
    for (r &= ~Ec, r &= ~gu, n.suspendedLanes |= r, n.pingedLanes &= ~r, n = n.expirationTimes; 0 < r; ) {
      var l = 31 - br(r), o = 1 << l;
      n[l] = -1, r &= ~o;
    }
  }
  function Td(n) {
    if (Fe & 6) throw Error(x(327));
    Tu();
    var r = Ki(n, 0);
    if (!(r & 1)) return ir(n, ot()), null;
    var l = Rc(n, r);
    if (n.tag !== 0 && l === 2) {
      var o = gf(n);
      o !== 0 && (r = o, l = Po(n, o));
    }
    if (l === 1) throw l = Fo, Ga(n, 0), ia(n, r), ir(n, ot()), l;
    if (l === 6) throw Error(x(345));
    return n.finishedWork = n.current.alternate, n.finishedLanes = r, kl(n, ar, Sr), ir(n, ot()), null;
  }
  function Rd(n, r) {
    var l = Fe;
    Fe |= 1;
    try {
      return n(r);
    } finally {
      Fe = l, Fe === 0 && (Su = ot() + 500, fu && ya());
    }
  }
  function Dl(n) {
    $a !== null && $a.tag === 0 && !(Fe & 6) && Tu();
    var r = Fe;
    Fe |= 1;
    var l = on.transition, o = Ke;
    try {
      if (on.transition = null, Ke = 1, n) return n();
    } finally {
      Ke = o, on.transition = l, Fe = r, !(Fe & 6) && ya();
    }
  }
  function xd() {
    gr = yu.current, ct(yu);
  }
  function Ga(n, r) {
    n.finishedWork = null, n.finishedLanes = 0;
    var l = n.timeoutHandle;
    if (l !== -1 && (n.timeoutHandle = -1, Gf(l)), Pt !== null) for (l = Pt.return; l !== null; ) {
      var o = l;
      switch (Ys(o), o.tag) {
        case 1:
          o = o.type.childContextTypes, o != null && cu();
          break;
        case 3:
          vl(), ct(Gt), ct(wt), ce();
          break;
        case 5:
          Gs(o);
          break;
        case 4:
          vl();
          break;
        case 13:
          ct(St);
          break;
        case 19:
          ct(St);
          break;
        case 10:
          Jf(o.type._context);
          break;
        case 22:
        case 23:
          xd();
      }
      l = l.return;
    }
    if (Xt = n, Pt = n = _i(n.current, null), sn = gr = r, Lt = 0, Fo = null, Ec = gu = xa = 0, ar = jo = null, dl !== null) {
      for (r = 0; r < dl.length; r++) if (l = dl[r], o = l.interleaved, o !== null) {
        l.interleaved = null;
        var c = o.next, d = l.pending;
        if (d !== null) {
          var h = d.next;
          d.next = c, o.next = h;
        }
        l.pending = o;
      }
      dl = null;
    }
    return n;
  }
  function Qv(n, r) {
    do {
      var l = Pt;
      try {
        if (Zf(), ke.current = El, Xs) {
          for (var o = Ye.memoizedState; o !== null; ) {
            var c = o.queue;
            c !== null && (c.pending = null), o = o.next;
          }
          Xs = !1;
        }
        if (nt = 0, Jt = jt = Ye = null, So = !1, hl = 0, Rl.current = null, l === null || l.return === null) {
          Lt = 1, Fo = r, Pt = null;
          break;
        }
        e: {
          var d = n, h = l.return, S = l, E = r;
          if (r = sn, S.flags |= 32768, E !== null && typeof E == "object" && typeof E.then == "function") {
            var L = E, F = S, V = F.tag;
            if (!(F.mode & 1) && (V === 0 || V === 11 || V === 15)) {
              var H = F.alternate;
              H ? (F.updateQueue = H.updateQueue, F.memoizedState = H.memoizedState, F.lanes = H.lanes) : (F.updateQueue = null, F.memoizedState = null);
            }
            var q = Ov(h);
            if (q !== null) {
              q.flags &= -257, wi(q, h, S, d, r), q.mode & 1 && dd(d, L, r), r = q, E = L;
              var ne = r.updateQueue;
              if (ne === null) {
                var ie = /* @__PURE__ */ new Set();
                ie.add(E), r.updateQueue = ie;
              } else ne.add(E);
              break e;
            } else {
              if (!(r & 1)) {
                dd(d, L, r), wd();
                break e;
              }
              E = Error(x(426));
            }
          } else if (vt && S.mode & 1) {
            var Ot = Ov(h);
            if (Ot !== null) {
              !(Ot.flags & 65536) && (Ot.flags |= 256), wi(Ot, h, S, d, r), Pa(Cl(E, S));
              break e;
            }
          }
          d = E = Cl(E, S), Lt !== 4 && (Lt = 2), jo === null ? jo = [d] : jo.push(d), d = h;
          do {
            switch (d.tag) {
              case 3:
                d.flags |= 65536, r &= -r, d.lanes |= r;
                var w = Lv(d, E, r);
                wv(d, w);
                break e;
              case 1:
                S = E;
                var T = d.type, b = d.stateNode;
                if (!(d.flags & 128) && (typeof T.getDerivedStateFromError == "function" || b !== null && typeof b.componentDidCatch == "function" && (ki === null || !ki.has(b)))) {
                  d.flags |= 65536, r &= -r, d.lanes |= r;
                  var j = fd(d, S, r);
                  wv(d, j);
                  break e;
                }
            }
            d = d.return;
          } while (d !== null);
        }
        Wv(l);
      } catch (re) {
        r = re, Pt === l && l !== null && (Pt = l = l.return);
        continue;
      }
      break;
    } while (!0);
  }
  function Iv() {
    var n = Di.current;
    return Di.current = El, n === null ? El : n;
  }
  function wd() {
    (Lt === 0 || Lt === 3 || Lt === 2) && (Lt = 4), Xt === null || !(xa & 268435455) && !(gu & 268435455) || ia(Xt, sn);
  }
  function Rc(n, r) {
    var l = Fe;
    Fe |= 2;
    var o = Iv();
    (Xt !== n || sn !== r) && (Sr = null, Ga(n, r));
    do
      try {
        py();
        break;
      } catch (c) {
        Qv(n, c);
      }
    while (!0);
    if (Zf(), Fe = l, Di.current = o, Pt !== null) throw Error(x(261));
    return Xt = null, sn = 0, Lt;
  }
  function py() {
    for (; Pt !== null; ) Gv(Pt);
  }
  function $v() {
    for (; Pt !== null && !jp(); ) Gv(Pt);
  }
  function Gv(n) {
    var r = Zv(n.alternate, n, gr);
    n.memoizedProps = n.pendingProps, r === null ? Wv(n) : Pt = r, Rl.current = null;
  }
  function Wv(n) {
    var r = n;
    do {
      var l = r.alternate;
      if (n = r.return, r.flags & 32768) {
        if (l = yc(l, r), l !== null) {
          l.flags &= 32767, Pt = l;
          return;
        }
        if (n !== null) n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null;
        else {
          Lt = 6, Pt = null;
          return;
        }
      } else if (l = Fv(l, r, gr), l !== null) {
        Pt = l;
        return;
      }
      if (r = r.sibling, r !== null) {
        Pt = r;
        return;
      }
      Pt = r = n;
    } while (r !== null);
    Lt === 0 && (Lt = 5);
  }
  function kl(n, r, l) {
    var o = Ke, c = on.transition;
    try {
      on.transition = null, Ke = 1, vy(n, r, l, o);
    } finally {
      on.transition = c, Ke = o;
    }
    return null;
  }
  function vy(n, r, l, o) {
    do
      Tu();
    while ($a !== null);
    if (Fe & 6) throw Error(x(327));
    l = n.finishedWork;
    var c = n.finishedLanes;
    if (l === null) return null;
    if (n.finishedWork = null, n.finishedLanes = 0, l === n.current) throw Error(x(177));
    n.callbackNode = null, n.callbackPriority = 0;
    var d = l.lanes | l.childLanes;
    if (Ym(n, d), n === Xt && (Pt = Xt = null, sn = 0), !(l.subtreeFlags & 2064) && !(l.flags & 2064) || Cc || (Cc = !0, Jv($u, function() {
      return Tu(), null;
    })), d = (l.flags & 15990) !== 0, l.subtreeFlags & 15990 || d) {
      d = on.transition, on.transition = null;
      var h = Ke;
      Ke = 1;
      var S = Fe;
      Fe |= 4, Rl.current = null, Vv(n, l), gd(l, n), ru(ul), el = !!oo, ul = oo = null, n.current = l, cy(l), jm(), Fe = S, Ke = h, on.transition = d;
    } else n.current = l;
    if (Cc && (Cc = !1, $a = n, Vo = c), d = n.pendingLanes, d === 0 && (ki = null), Bp(l.stateNode), ir(n, ot()), r !== null) for (o = n.onRecoverableError, l = 0; l < r.length; l++) c = r[l], o(c.value, { componentStack: c.stack, digest: c.digest });
    if (Eu) throw Eu = !1, n = xl, xl = null, n;
    return Vo & 1 && n.tag !== 0 && Tu(), d = n.pendingLanes, d & 1 ? n === Cu ? bi++ : (bi = 0, Cu = n) : bi = 0, ya(), null;
  }
  function Tu() {
    if ($a !== null) {
      var n = Ef(Vo), r = on.transition, l = Ke;
      try {
        if (on.transition = null, Ke = 16 > n ? 16 : n, $a === null) var o = !1;
        else {
          if (n = $a, $a = null, Vo = 0, Fe & 6) throw Error(x(331));
          var c = Fe;
          for (Fe |= 4, ee = n.current; ee !== null; ) {
            var d = ee, h = d.child;
            if (ee.flags & 16) {
              var S = d.deletions;
              if (S !== null) {
                for (var E = 0; E < S.length; E++) {
                  var L = S[E];
                  for (ee = L; ee !== null; ) {
                    var F = ee;
                    switch (F.tag) {
                      case 0:
                      case 11:
                      case 15:
                        zo(8, F, d);
                    }
                    var V = F.child;
                    if (V !== null) V.return = F, ee = V;
                    else for (; ee !== null; ) {
                      F = ee;
                      var H = F.sibling, q = F.return;
                      if (Sc(F), F === L) {
                        ee = null;
                        break;
                      }
                      if (H !== null) {
                        H.return = q, ee = H;
                        break;
                      }
                      ee = q;
                    }
                  }
                }
                var ne = d.alternate;
                if (ne !== null) {
                  var ie = ne.child;
                  if (ie !== null) {
                    ne.child = null;
                    do {
                      var Ot = ie.sibling;
                      ie.sibling = null, ie = Ot;
                    } while (ie !== null);
                  }
                }
                ee = d;
              }
            }
            if (d.subtreeFlags & 2064 && h !== null) h.return = d, ee = h;
            else e: for (; ee !== null; ) {
              if (d = ee, d.flags & 2048) switch (d.tag) {
                case 0:
                case 11:
                case 15:
                  zo(9, d, d.return);
              }
              var w = d.sibling;
              if (w !== null) {
                w.return = d.return, ee = w;
                break e;
              }
              ee = d.return;
            }
          }
          var T = n.current;
          for (ee = T; ee !== null; ) {
            h = ee;
            var b = h.child;
            if (h.subtreeFlags & 2064 && b !== null) b.return = h, ee = b;
            else e: for (h = T; ee !== null; ) {
              if (S = ee, S.flags & 2048) try {
                switch (S.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Uo(9, S);
                }
              } catch (re) {
                ht(S, S.return, re);
              }
              if (S === h) {
                ee = null;
                break e;
              }
              var j = S.sibling;
              if (j !== null) {
                j.return = S.return, ee = j;
                break e;
              }
              ee = S.return;
            }
          }
          if (Fe = c, ya(), Zr && typeof Zr.onPostCommitFiberRoot == "function") try {
            Zr.onPostCommitFiberRoot(Gu, n);
          } catch {
          }
          o = !0;
        }
        return o;
      } finally {
        Ke = l, on.transition = r;
      }
    }
    return !1;
  }
  function Xv(n, r, l) {
    r = Cl(l, r), r = Lv(n, r, 1), n = Ti(n, r, 1), r = Yt(), n !== null && (Zi(n, 1, r), ir(n, r));
  }
  function ht(n, r, l) {
    if (n.tag === 3) Xv(n, n, l);
    else for (; r !== null; ) {
      if (r.tag === 3) {
        Xv(r, n, l);
        break;
      } else if (r.tag === 1) {
        var o = r.stateNode;
        if (typeof r.type.getDerivedStateFromError == "function" || typeof o.componentDidCatch == "function" && (ki === null || !ki.has(o))) {
          n = Cl(l, n), n = fd(r, n, 1), r = Ti(r, n, 1), n = Yt(), r !== null && (Zi(r, 1, n), ir(r, n));
          break;
        }
      }
      r = r.return;
    }
  }
  function hy(n, r, l) {
    var o = n.pingCache;
    o !== null && o.delete(r), r = Yt(), n.pingedLanes |= n.suspendedLanes & l, Xt === n && (sn & l) === l && (Lt === 4 || Lt === 3 && (sn & 130023424) === sn && 500 > ot() - Cd ? Ga(n, 0) : Ec |= l), ir(n, r);
  }
  function qv(n, r) {
    r === 0 && (n.mode & 1 ? (r = Jr, Jr <<= 1, !(Jr & 130023424) && (Jr = 4194304)) : r = 1);
    var l = Yt();
    n = mr(n, r), n !== null && (Zi(n, r, l), ir(n, l));
  }
  function my(n) {
    var r = n.memoizedState, l = 0;
    r !== null && (l = r.retryLane), qv(n, l);
  }
  function Kv(n, r) {
    var l = 0;
    switch (n.tag) {
      case 13:
        var o = n.stateNode, c = n.memoizedState;
        c !== null && (l = c.retryLane);
        break;
      case 19:
        o = n.stateNode;
        break;
      default:
        throw Error(x(314));
    }
    o !== null && o.delete(r), qv(n, l);
  }
  var Zv;
  Zv = function(n, r, l) {
    if (n !== null) if (n.memoizedProps !== r.pendingProps || Gt.current) Vt = !0;
    else {
      if (!(n.lanes & l) && !(r.flags & 128)) return Vt = !1, Oo(n, r, l);
      Vt = !!(n.flags & 131072);
    }
    else Vt = !1, vt && r.flags & 1048576 && Cv(r, Ba, r.index);
    switch (r.lanes = 0, r.tag) {
      case 2:
        var o = r.type;
        Hr(n, r), n = r.pendingProps;
        var c = Kn(r, wt.current);
        gt(r, l), c = Ri(null, r, o, n, c, l);
        var d = na();
        return r.flags |= 1, typeof c == "object" && c !== null && typeof c.render == "function" && c.$$typeof === void 0 ? (r.tag = 1, r.memoizedState = null, r.updateQueue = null, Ht(o) ? (d = !0, Zt(r)) : d = !1, r.memoizedState = c.state !== null && c.state !== void 0 ? c.state : null, rd(r), c.updater = dc, r.stateNode = c, c._reactInternals = r, Do(r, o, n, l), r = _o(null, r, o, !0, d, l)) : (r.tag = 0, vt && d && Ps(r), un(null, r, c, l), r = r.child), r;
      case 16:
        o = r.elementType;
        e: {
          switch (Hr(n, r), n = r.pendingProps, c = o._init, o = c(o._payload), r.type = o, c = r.tag = gy(o), n = ra(o, n), c) {
            case 0:
              r = Mv(null, r, o, n, l);
              break e;
            case 1:
              r = Nv(null, r, o, n, l);
              break e;
            case 11:
              r = nr(null, r, o, n, l);
              break e;
            case 14:
              r = Tl(null, r, o, ra(o.type, n), l);
              break e;
          }
          throw Error(x(
            306,
            o,
            ""
          ));
        }
        return r;
      case 0:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : ra(o, c), Mv(n, r, o, c, l);
      case 1:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : ra(o, c), Nv(n, r, o, c, l);
      case 3:
        e: {
          if (hu(r), n === null) throw Error(x(387));
          o = r.pendingProps, d = r.memoizedState, c = d.element, xv(n, r), vo(r, o, null, l);
          var h = r.memoizedState;
          if (o = h.element, d.isDehydrated) if (d = { element: o, isDehydrated: !1, cache: h.cache, pendingSuspenseBoundaries: h.pendingSuspenseBoundaries, transitions: h.transitions }, r.updateQueue.baseState = d, r.memoizedState = d, r.flags & 256) {
            c = Cl(Error(x(423)), r), r = zv(n, r, o, l, c);
            break e;
          } else if (o !== c) {
            c = Cl(Error(x(424)), r), r = zv(n, r, o, l, c);
            break e;
          } else for (Jn = va(r.stateNode.containerInfo.firstChild), Zn = r, vt = !0, Ur = null, l = G(r, null, o, l), r.child = l; l; ) l.flags = l.flags & -3 | 4096, l = l.sibling;
          else {
            if (Ci(), o === c) {
              r = Fr(n, r, l);
              break e;
            }
            un(n, r, o, l);
          }
          r = r.child;
        }
        return r;
      case 5:
        return Dv(r), n === null && qf(r), o = r.type, c = r.pendingProps, d = n !== null ? n.memoizedProps : null, h = c.children, Hs(o, c) ? h = null : d !== null && Hs(o, d) && (r.flags |= 32), pd(n, r), un(n, r, h, l), r.child;
      case 6:
        return n === null && qf(r), null;
      case 13:
        return mc(n, r, l);
      case 4:
        return id(r, r.stateNode.containerInfo), o = r.pendingProps, n === null ? r.child = kt(r, null, o, l) : un(n, r, o, l), r.child;
      case 11:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : ra(o, c), nr(n, r, o, c, l);
      case 7:
        return un(n, r, r.pendingProps, l), r.child;
      case 8:
        return un(n, r, r.pendingProps.children, l), r.child;
      case 12:
        return un(n, r, r.pendingProps.children, l), r.child;
      case 10:
        e: {
          if (o = r.type._context, c = r.pendingProps, d = r.memoizedProps, h = c.value, oe(hr, o._currentValue), o._currentValue = h, d !== null) if (ea(d.value, h)) {
            if (d.children === c.children && !Gt.current) {
              r = Fr(n, r, l);
              break e;
            }
          } else for (d = r.child, d !== null && (d.return = r); d !== null; ) {
            var S = d.dependencies;
            if (S !== null) {
              h = d.child;
              for (var E = S.firstContext; E !== null; ) {
                if (E.context === o) {
                  if (d.tag === 1) {
                    E = Ya(-1, l & -l), E.tag = 2;
                    var L = d.updateQueue;
                    if (L !== null) {
                      L = L.shared;
                      var F = L.pending;
                      F === null ? E.next = E : (E.next = F.next, F.next = E), L.pending = E;
                    }
                  }
                  d.lanes |= l, E = d.alternate, E !== null && (E.lanes |= l), ed(
                    d.return,
                    l,
                    r
                  ), S.lanes |= l;
                  break;
                }
                E = E.next;
              }
            } else if (d.tag === 10) h = d.type === r.type ? null : d.child;
            else if (d.tag === 18) {
              if (h = d.return, h === null) throw Error(x(341));
              h.lanes |= l, S = h.alternate, S !== null && (S.lanes |= l), ed(h, l, r), h = d.sibling;
            } else h = d.child;
            if (h !== null) h.return = d;
            else for (h = d; h !== null; ) {
              if (h === r) {
                h = null;
                break;
              }
              if (d = h.sibling, d !== null) {
                d.return = h.return, h = d;
                break;
              }
              h = h.return;
            }
            d = h;
          }
          un(n, r, c.children, l), r = r.child;
        }
        return r;
      case 9:
        return c = r.type, o = r.pendingProps.children, gt(r, l), c = Ar(c), o = o(c), r.flags |= 1, un(n, r, o, l), r.child;
      case 14:
        return o = r.type, c = ra(o, r.pendingProps), c = ra(o.type, c), Tl(n, r, o, c, l);
      case 15:
        return xe(n, r, r.type, r.pendingProps, l);
      case 17:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : ra(o, c), Hr(n, r), r.tag = 1, Ht(o) ? (n = !0, Zt(r)) : n = !1, gt(r, l), pc(r, o, c), Do(r, o, c, l), _o(null, r, o, !0, n, l);
      case 19:
        return Ca(n, r, l);
      case 22:
        return bo(n, r, l);
    }
    throw Error(x(156, r.tag));
  };
  function Jv(n, r) {
    return Hp(n, r);
  }
  function yy(n, r, l, o) {
    this.tag = n, this.key = l, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = r, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = o, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Vr(n, r, l, o) {
    return new yy(n, r, l, o);
  }
  function Dd(n) {
    return n = n.prototype, !(!n || !n.isReactComponent);
  }
  function gy(n) {
    if (typeof n == "function") return Dd(n) ? 1 : 0;
    if (n != null) {
      if (n = n.$$typeof, n === ft) return 11;
      if (n === Dn) return 14;
    }
    return 2;
  }
  function _i(n, r) {
    var l = n.alternate;
    return l === null ? (l = Vr(n.tag, r, n.key, n.mode), l.elementType = n.elementType, l.type = n.type, l.stateNode = n.stateNode, l.alternate = n, n.alternate = l) : (l.pendingProps = r, l.type = n.type, l.flags = 0, l.subtreeFlags = 0, l.deletions = null), l.flags = n.flags & 14680064, l.childLanes = n.childLanes, l.lanes = n.lanes, l.child = n.child, l.memoizedProps = n.memoizedProps, l.memoizedState = n.memoizedState, l.updateQueue = n.updateQueue, r = n.dependencies, l.dependencies = r === null ? null : { lanes: r.lanes, firstContext: r.firstContext }, l.sibling = n.sibling, l.index = n.index, l.ref = n.ref, l;
  }
  function Yo(n, r, l, o, c, d) {
    var h = 2;
    if (o = n, typeof n == "function") Dd(n) && (h = 1);
    else if (typeof n == "string") h = 5;
    else e: switch (n) {
      case Me:
        return Wa(l.children, c, d, r);
      case wn:
        h = 8, c |= 8;
        break;
      case Ct:
        return n = Vr(12, l, r, c | 2), n.elementType = Ct, n.lanes = d, n;
      case Le:
        return n = Vr(13, l, r, c), n.elementType = Le, n.lanes = d, n;
      case gn:
        return n = Vr(19, l, r, c), n.elementType = gn, n.lanes = d, n;
      case Na:
        return Li(l, c, d, r);
      default:
        if (typeof n == "object" && n !== null) switch (n.$$typeof) {
          case Kt:
            h = 10;
            break e;
          case It:
            h = 9;
            break e;
          case ft:
            h = 11;
            break e;
          case Dn:
            h = 14;
            break e;
          case Nt:
            h = 16, o = null;
            break e;
        }
        throw Error(x(130, n == null ? n : typeof n, ""));
    }
    return r = Vr(h, l, r, c), r.elementType = n, r.type = o, r.lanes = d, r;
  }
  function Wa(n, r, l, o) {
    return n = Vr(7, n, o, r), n.lanes = l, n;
  }
  function Li(n, r, l, o) {
    return n = Vr(22, n, o, r), n.elementType = Na, n.lanes = l, n.stateNode = { isHidden: !1 }, n;
  }
  function kd(n, r, l) {
    return n = Vr(6, n, null, r), n.lanes = l, n;
  }
  function xc(n, r, l) {
    return r = Vr(4, n.children !== null ? n.children : [], n.key, r), r.lanes = l, r.stateNode = { containerInfo: n.containerInfo, pendingChildren: null, implementation: n.implementation }, r;
  }
  function eh(n, r, l, o, c) {
    this.tag = r, this.containerInfo = n, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = Sf(0), this.expirationTimes = Sf(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Sf(0), this.identifierPrefix = o, this.onRecoverableError = c, this.mutableSourceEagerHydrationData = null;
  }
  function wc(n, r, l, o, c, d, h, S, E) {
    return n = new eh(n, r, l, S, E), r === 1 ? (r = 1, d === !0 && (r |= 8)) : r = 0, d = Vr(3, null, null, r), n.current = d, d.stateNode = n, d.memoizedState = { element: o, isDehydrated: l, cache: null, transitions: null, pendingSuspenseBoundaries: null }, rd(d), n;
  }
  function Sy(n, r, l) {
    var o = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: mt, key: o == null ? null : "" + o, children: n, containerInfo: r, implementation: l };
  }
  function bd(n) {
    if (!n) return Cn;
    n = n._reactInternals;
    e: {
      if (Kr(n) !== n || n.tag !== 1) throw Error(x(170));
      var r = n;
      do {
        switch (r.tag) {
          case 3:
            r = r.stateNode.context;
            break e;
          case 1:
            if (Ht(r.type)) {
              r = r.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        r = r.return;
      } while (r !== null);
      throw Error(x(171));
    }
    if (n.tag === 1) {
      var l = n.type;
      if (Ht(l)) return fo(n, l, r);
    }
    return r;
  }
  function th(n, r, l, o, c, d, h, S, E) {
    return n = wc(l, o, !0, n, c, d, h, S, E), n.context = bd(null), l = n.current, o = Yt(), c = wa(l), d = Ya(o, c), d.callback = r ?? null, Ti(l, d, c), n.current.lanes = c, Zi(n, c, o), ir(n, o), n;
  }
  function Dc(n, r, l, o) {
    var c = r.current, d = Yt(), h = wa(c);
    return l = bd(l), r.context === null ? r.context = l : r.pendingContext = l, r = Ya(d, h), r.payload = { element: n }, o = o === void 0 ? null : o, o !== null && (r.callback = o), n = Ti(c, r, h), n !== null && (Mn(n, c, h, d), $s(n, c, h)), h;
  }
  function kc(n) {
    if (n = n.current, !n.child) return null;
    switch (n.child.tag) {
      case 5:
        return n.child.stateNode;
      default:
        return n.child.stateNode;
    }
  }
  function _d(n, r) {
    if (n = n.memoizedState, n !== null && n.dehydrated !== null) {
      var l = n.retryLane;
      n.retryLane = l !== 0 && l < r ? l : r;
    }
  }
  function bc(n, r) {
    _d(n, r), (n = n.alternate) && _d(n, r);
  }
  function nh() {
    return null;
  }
  var bl = typeof reportError == "function" ? reportError : function(n) {
    console.error(n);
  };
  function Ld(n) {
    this._internalRoot = n;
  }
  _c.prototype.render = Ld.prototype.render = function(n) {
    var r = this._internalRoot;
    if (r === null) throw Error(x(409));
    Dc(n, r, null, null);
  }, _c.prototype.unmount = Ld.prototype.unmount = function() {
    var n = this._internalRoot;
    if (n !== null) {
      this._internalRoot = null;
      var r = n.containerInfo;
      Dl(function() {
        Dc(null, n, null, null);
      }), r[ja] = null;
    }
  };
  function _c(n) {
    this._internalRoot = n;
  }
  _c.prototype.unstable_scheduleHydration = function(n) {
    if (n) {
      var r = Re();
      n = { blockedOn: null, target: n, priority: r };
      for (var l = 0; l < rn.length && r !== 0 && r < rn[l].priority; l++) ;
      rn.splice(l, 0, n), l === 0 && wf(n);
    }
  };
  function Od(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11);
  }
  function Lc(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11 && (n.nodeType !== 8 || n.nodeValue !== " react-mount-point-unstable "));
  }
  function rh() {
  }
  function Ey(n, r, l, o, c) {
    if (c) {
      if (typeof o == "function") {
        var d = o;
        o = function() {
          var L = kc(h);
          d.call(L);
        };
      }
      var h = th(r, o, n, 0, null, !1, !1, "", rh);
      return n._reactRootContainer = h, n[ja] = h.current, iu(n.nodeType === 8 ? n.parentNode : n), Dl(), h;
    }
    for (; c = n.lastChild; ) n.removeChild(c);
    if (typeof o == "function") {
      var S = o;
      o = function() {
        var L = kc(E);
        S.call(L);
      };
    }
    var E = wc(n, 0, !1, null, null, !1, !1, "", rh);
    return n._reactRootContainer = E, n[ja] = E.current, iu(n.nodeType === 8 ? n.parentNode : n), Dl(function() {
      Dc(r, E, l, o);
    }), E;
  }
  function Qo(n, r, l, o, c) {
    var d = l._reactRootContainer;
    if (d) {
      var h = d;
      if (typeof c == "function") {
        var S = c;
        c = function() {
          var E = kc(h);
          S.call(E);
        };
      }
      Dc(r, h, n, c);
    } else h = Ey(l, r, n, c, o);
    return kc(h);
  }
  Ze = function(n) {
    switch (n.tag) {
      case 3:
        var r = n.stateNode;
        if (r.current.memoizedState.isDehydrated) {
          var l = qi(r.pendingLanes);
          l !== 0 && (hs(r, l | 1), ir(r, ot()), !(Fe & 6) && (Su = ot() + 500, ya()));
        }
        break;
      case 13:
        Dl(function() {
          var o = mr(n, 1);
          if (o !== null) {
            var c = Yt();
            Mn(o, n, 1, c);
          }
        }), bc(n, 1);
    }
  }, Cf = function(n) {
    if (n.tag === 13) {
      var r = mr(n, 134217728);
      if (r !== null) {
        var l = Yt();
        Mn(r, n, 134217728, l);
      }
      bc(n, 134217728);
    }
  }, Tf = function(n) {
    if (n.tag === 13) {
      var r = wa(n), l = mr(n, r);
      if (l !== null) {
        var o = Yt();
        Mn(l, n, r, o);
      }
      bc(n, r);
    }
  }, Re = function() {
    return Ke;
  }, Rf = function(n, r) {
    var l = Ke;
    try {
      return Ke = n, r();
    } finally {
      Ke = l;
    }
  }, $t = function(n, r, l) {
    switch (r) {
      case "input":
        if (Ql(n, l), r = l.name, l.type === "radio" && r != null) {
          for (l = n; l.parentNode; ) l = l.parentNode;
          for (l = l.querySelectorAll("input[name=" + JSON.stringify("" + r) + '][type="radio"]'), r = 0; r < l.length; r++) {
            var o = l[r];
            if (o !== n && o.form === n.form) {
              var c = yt(o);
              if (!c) throw Error(x(90));
              ca(o), Ql(o, c);
            }
          }
        }
        break;
      case "textarea":
        Il(n, l);
        break;
      case "select":
        r = l.value, r != null && dr(n, !!l.multiple, r, !1);
    }
  }, sf = Rd, cf = Dl;
  var Cy = { usingClientEntryPoint: !1, Events: [se, ta, yt, Np, zp, Rd] }, Io = { findFiberByHostInstance: ol, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, ah = { bundleType: Io.bundleType, version: Io.version, rendererPackageName: Io.rendererPackageName, rendererConfig: Io.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: be.ReactCurrentDispatcher, findHostInstanceByFiber: function(n) {
    return n = pf(n), n === null ? null : n.stateNode;
  }, findFiberByHostInstance: Io.findFiberByHostInstance || nh, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Oi = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Oi.isDisabled && Oi.supportsFiber) try {
      Gu = Oi.inject(ah), Zr = Oi;
    } catch {
    }
  }
  return $r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Cy, $r.createPortal = function(n, r) {
    var l = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!Od(r)) throw Error(x(200));
    return Sy(n, r, null, l);
  }, $r.createRoot = function(n, r) {
    if (!Od(n)) throw Error(x(299));
    var l = !1, o = "", c = bl;
    return r != null && (r.unstable_strictMode === !0 && (l = !0), r.identifierPrefix !== void 0 && (o = r.identifierPrefix), r.onRecoverableError !== void 0 && (c = r.onRecoverableError)), r = wc(n, 1, !1, null, null, l, !1, o, c), n[ja] = r.current, iu(n.nodeType === 8 ? n.parentNode : n), new Ld(r);
  }, $r.findDOMNode = function(n) {
    if (n == null) return null;
    if (n.nodeType === 1) return n;
    var r = n._reactInternals;
    if (r === void 0)
      throw typeof n.render == "function" ? Error(x(188)) : (n = Object.keys(n).join(","), Error(x(268, n)));
    return n = pf(r), n = n === null ? null : n.stateNode, n;
  }, $r.flushSync = function(n) {
    return Dl(n);
  }, $r.hydrate = function(n, r, l) {
    if (!Lc(r)) throw Error(x(200));
    return Qo(null, n, r, !0, l);
  }, $r.hydrateRoot = function(n, r, l) {
    if (!Od(n)) throw Error(x(405));
    var o = l != null && l.hydratedSources || null, c = !1, d = "", h = bl;
    if (l != null && (l.unstable_strictMode === !0 && (c = !0), l.identifierPrefix !== void 0 && (d = l.identifierPrefix), l.onRecoverableError !== void 0 && (h = l.onRecoverableError)), r = th(r, null, n, 1, l ?? null, c, !1, d, h), n[ja] = r.current, iu(n), o) for (n = 0; n < o.length; n++) l = o[n], c = l._getVersion, c = c(l._source), r.mutableSourceEagerHydrationData == null ? r.mutableSourceEagerHydrationData = [l, c] : r.mutableSourceEagerHydrationData.push(
      l,
      c
    );
    return new _c(r);
  }, $r.render = function(n, r, l) {
    if (!Lc(r)) throw Error(x(200));
    return Qo(null, n, r, !1, l);
  }, $r.unmountComponentAtNode = function(n) {
    if (!Lc(n)) throw Error(x(40));
    return n._reactRootContainer ? (Dl(function() {
      Qo(null, null, n, !1, function() {
        n._reactRootContainer = null, n[ja] = null;
      });
    }), !0) : !1;
  }, $r.unstable_batchedUpdates = Rd, $r.unstable_renderSubtreeIntoContainer = function(n, r, l, o) {
    if (!Lc(l)) throw Error(x(200));
    if (n == null || n._reactInternals === void 0) throw Error(x(38));
    return Qo(n, r, l, !1, o);
  }, $r.version = "18.3.1-next-f1338f8080-20240426", $r;
}
var Gr = {};
/**
 * @license React
 * react-dom.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var oR;
function xb() {
  return oR || (oR = 1, process.env.NODE_ENV !== "production" && function() {
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
    var U = TR, $ = xR(), x = U.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, Je = !1;
    function we(e) {
      Je = e;
    }
    function Ue(e) {
      if (!Je) {
        for (var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
          a[i - 1] = arguments[i];
        it("warn", e, a);
      }
    }
    function g(e) {
      if (!Je) {
        for (var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
          a[i - 1] = arguments[i];
        it("error", e, a);
      }
    }
    function it(e, t, a) {
      {
        var i = x.ReactDebugCurrentFrame, u = i.getStackAddendum();
        u !== "" && (t += "%s", a = a.concat([u]));
        var s = a.map(function(f) {
          return String(f);
        });
        s.unshift("Warning: " + t), Function.prototype.apply.call(console[e], console, s);
      }
    }
    var ge = 0, le = 1, Dt = 2, P = 3, me = 4, J = 5, Oe = 6, Ge = 7, et = 8, Pn = 9, lt = 10, De = 11, be = 12, _e = 13, mt = 14, Me = 15, wn = 16, Ct = 17, Kt = 18, It = 19, ft = 21, Le = 22, gn = 23, Dn = 24, Nt = 25, Na = !0, Q = !1, he = !1, te = !1, We = !1, tt = !0, Wr = !0, kn = !0, Yi = !0, Yn = /* @__PURE__ */ new Set(), Qn = {}, wr = {};
    function sa(e, t) {
      ui(e, t), ui(e + "Capture", t);
    }
    function ui(e, t) {
      Qn[e] && g("EventRegistry: More than one plugin attempted to publish the same registration name, `%s`.", e), Qn[e] = t;
      {
        var a = e.toLowerCase();
        wr[a] = e, e === "onDoubleClick" && (wr.ondblclick = e);
      }
      for (var i = 0; i < t.length; i++)
        Yn.add(t[i]);
    }
    var Sn = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u", ca = Object.prototype.hasOwnProperty;
    function In(e) {
      {
        var t = typeof Symbol == "function" && Symbol.toStringTag, a = t && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return a;
      }
    }
    function fr(e) {
      try {
        return Dr(e), !1;
      } catch {
        return !0;
      }
    }
    function Dr(e) {
      return "" + e;
    }
    function fa(e, t) {
      if (fr(e))
        return g("The provided `%s` attribute is an unsupported type %s. This value must be coerced to a string before before using it here.", t, In(e)), Dr(e);
    }
    function Ql(e) {
      if (fr(e))
        return g("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", In(e)), Dr(e);
    }
    function Pu(e, t) {
      if (fr(e))
        return g("The provided `%s` prop is an unsupported type %s. This value must be coerced to a string before before using it here.", t, In(e)), Dr(e);
    }
    function Yu(e, t) {
      if (fr(e))
        return g("The provided `%s` CSS property is an unsupported type %s. This value must be coerced to a string before before using it here.", t, In(e)), Dr(e);
    }
    function Qi(e) {
      if (fr(e))
        return g("The provided HTML markup uses a value of unsupported type %s. This value must be coerced to a string before before using it here.", In(e)), Dr(e);
    }
    function dr(e) {
      if (fr(e))
        return g("Form field values (value, checked, defaultValue, or defaultChecked props) must be strings, not %s. This value must be coerced to a string before before using it here.", In(e)), Dr(e);
    }
    var kr = 0, Xr = 1, Il = 2, pr = 3, da = 4, Ii = 5, $i = 6, Qu = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD", I = Qu + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040", de = new RegExp("^[" + Qu + "][" + I + "]*$"), Ne = {}, ut = {};
    function Tt(e) {
      return ca.call(ut, e) ? !0 : ca.call(Ne, e) ? !1 : de.test(e) ? (ut[e] = !0, !0) : (Ne[e] = !0, g("Invalid attribute name: `%s`", e), !1);
    }
    function $n(e, t, a) {
      return t !== null ? t.type === kr : a ? !1 : e.length > 2 && (e[0] === "o" || e[0] === "O") && (e[1] === "n" || e[1] === "N");
    }
    function zt(e, t, a, i) {
      if (a !== null && a.type === kr)
        return !1;
      switch (typeof t) {
        case "function":
        case "symbol":
          return !0;
        case "boolean": {
          if (i)
            return !1;
          if (a !== null)
            return !a.acceptsBooleans;
          var u = e.toLowerCase().slice(0, 5);
          return u !== "data-" && u !== "aria-";
        }
        default:
          return !1;
      }
    }
    function Gn(e, t, a, i) {
      if (t === null || typeof t > "u" || zt(e, t, a, i))
        return !0;
      if (i)
        return !1;
      if (a !== null)
        switch (a.type) {
          case pr:
            return !t;
          case da:
            return t === !1;
          case Ii:
            return isNaN(t);
          case $i:
            return isNaN(t) || t < 1;
        }
      return !1;
    }
    function Ut(e) {
      return $t.hasOwnProperty(e) ? $t[e] : null;
    }
    function Rt(e, t, a, i, u, s, f) {
      this.acceptsBooleans = t === Il || t === pr || t === da, this.attributeName = i, this.attributeNamespace = u, this.mustUseProperty = a, this.propertyName = e, this.type = t, this.sanitizeURL = s, this.removeEmptyString = f;
    }
    var $t = {}, $l = [
      "children",
      "dangerouslySetInnerHTML",
      // TODO: This prevents the assignment of defaultValue to regular
      // elements (not just inputs). Now that ReactDOMInput assigns to the
      // defaultValue property -- do we need this?
      "defaultValue",
      "defaultChecked",
      "innerHTML",
      "suppressContentEditableWarning",
      "suppressHydrationWarning",
      "style"
    ];
    $l.forEach(function(e) {
      $t[e] = new Rt(
        e,
        kr,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
      var t = e[0], a = e[1];
      $t[t] = new Rt(
        t,
        Xr,
        !1,
        // mustUseProperty
        a,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
      $t[e] = new Rt(
        e,
        Il,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
      $t[e] = new Rt(
        e,
        Il,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "allowFullScreen",
      "async",
      // Note: there is a special case that prevents it from being written to the DOM
      // on the client side because the browsers are inconsistent. Instead we call focus().
      "autoFocus",
      "autoPlay",
      "controls",
      "default",
      "defer",
      "disabled",
      "disablePictureInPicture",
      "disableRemotePlayback",
      "formNoValidate",
      "hidden",
      "loop",
      "noModule",
      "noValidate",
      "open",
      "playsInline",
      "readOnly",
      "required",
      "reversed",
      "scoped",
      "seamless",
      // Microdata
      "itemScope"
    ].forEach(function(e) {
      $t[e] = new Rt(
        e,
        pr,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "checked",
      // Note: `option.selected` is not updated if `select.multiple` is
      // disabled with `removeAttribute`. We have special logic for handling this.
      "multiple",
      "muted",
      "selected"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      $t[e] = new Rt(
        e,
        pr,
        !0,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "capture",
      "download"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      $t[e] = new Rt(
        e,
        da,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "cols",
      "rows",
      "size",
      "span"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      $t[e] = new Rt(
        e,
        $i,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), ["rowSpan", "start"].forEach(function(e) {
      $t[e] = new Rt(
        e,
        Ii,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    });
    var oi = /[\-\:]([a-z])/g, fs = function(e) {
      return e[1].toUpperCase();
    };
    [
      "accent-height",
      "alignment-baseline",
      "arabic-form",
      "baseline-shift",
      "cap-height",
      "clip-path",
      "clip-rule",
      "color-interpolation",
      "color-interpolation-filters",
      "color-profile",
      "color-rendering",
      "dominant-baseline",
      "enable-background",
      "fill-opacity",
      "fill-rule",
      "flood-color",
      "flood-opacity",
      "font-family",
      "font-size",
      "font-size-adjust",
      "font-stretch",
      "font-style",
      "font-variant",
      "font-weight",
      "glyph-name",
      "glyph-orientation-horizontal",
      "glyph-orientation-vertical",
      "horiz-adv-x",
      "horiz-origin-x",
      "image-rendering",
      "letter-spacing",
      "lighting-color",
      "marker-end",
      "marker-mid",
      "marker-start",
      "overline-position",
      "overline-thickness",
      "paint-order",
      "panose-1",
      "pointer-events",
      "rendering-intent",
      "shape-rendering",
      "stop-color",
      "stop-opacity",
      "strikethrough-position",
      "strikethrough-thickness",
      "stroke-dasharray",
      "stroke-dashoffset",
      "stroke-linecap",
      "stroke-linejoin",
      "stroke-miterlimit",
      "stroke-opacity",
      "stroke-width",
      "text-anchor",
      "text-decoration",
      "text-rendering",
      "underline-position",
      "underline-thickness",
      "unicode-bidi",
      "unicode-range",
      "units-per-em",
      "v-alphabetic",
      "v-hanging",
      "v-ideographic",
      "v-mathematical",
      "vector-effect",
      "vert-adv-y",
      "vert-origin-x",
      "vert-origin-y",
      "word-spacing",
      "writing-mode",
      "xmlns:xlink",
      "x-height"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      var t = e.replace(oi, fs);
      $t[t] = new Rt(
        t,
        Xr,
        !1,
        // mustUseProperty
        e,
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "xlink:actuate",
      "xlink:arcrole",
      "xlink:role",
      "xlink:show",
      "xlink:title",
      "xlink:type"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      var t = e.replace(oi, fs);
      $t[t] = new Rt(
        t,
        Xr,
        !1,
        // mustUseProperty
        e,
        "http://www.w3.org/1999/xlink",
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "xml:base",
      "xml:lang",
      "xml:space"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      var t = e.replace(oi, fs);
      $t[t] = new Rt(
        t,
        Xr,
        !1,
        // mustUseProperty
        e,
        "http://www.w3.org/XML/1998/namespace",
        !1,
        // sanitizeURL
        !1
      );
    }), ["tabIndex", "crossOrigin"].forEach(function(e) {
      $t[e] = new Rt(
        e,
        Xr,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    });
    var Np = "xlinkHref";
    $t[Np] = new Rt(
      "xlinkHref",
      Xr,
      !1,
      // mustUseProperty
      "xlink:href",
      "http://www.w3.org/1999/xlink",
      !0,
      // sanitizeURL
      !1
    ), ["src", "href", "action", "formAction"].forEach(function(e) {
      $t[e] = new Rt(
        e,
        Xr,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !0,
        // sanitizeURL
        !0
      );
    });
    var zp = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*\:/i, sf = !1;
    function cf(e) {
      !sf && zp.test(e) && (sf = !0, g("A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML try using dangerouslySetInnerHTML instead. React was passed %s.", JSON.stringify(e)));
    }
    function ff(e, t, a, i) {
      if (i.mustUseProperty) {
        var u = i.propertyName;
        return e[u];
      } else {
        fa(a, t), i.sanitizeURL && cf("" + a);
        var s = i.attributeName, f = null;
        if (i.type === da) {
          if (e.hasAttribute(s)) {
            var p = e.getAttribute(s);
            return p === "" ? !0 : Gn(t, a, i, !1) ? p : p === "" + a ? a : p;
          }
        } else if (e.hasAttribute(s)) {
          if (Gn(t, a, i, !1))
            return e.getAttribute(s);
          if (i.type === pr)
            return a;
          f = e.getAttribute(s);
        }
        return Gn(t, a, i, !1) ? f === null ? a : f : f === "" + a ? a : f;
      }
    }
    function df(e, t, a, i) {
      {
        if (!Tt(t))
          return;
        if (!e.hasAttribute(t))
          return a === void 0 ? void 0 : null;
        var u = e.getAttribute(t);
        return fa(a, t), u === "" + a ? a : u;
      }
    }
    function Gi(e, t, a, i) {
      var u = Ut(t);
      if (!$n(t, u, i)) {
        if (Gn(t, a, u, i) && (a = null), i || u === null) {
          if (Tt(t)) {
            var s = t;
            a === null ? e.removeAttribute(s) : (fa(a, t), e.setAttribute(s, "" + a));
          }
          return;
        }
        var f = u.mustUseProperty;
        if (f) {
          var p = u.propertyName;
          if (a === null) {
            var v = u.type;
            e[p] = v === pr ? !1 : "";
          } else
            e[p] = a;
          return;
        }
        var m = u.attributeName, y = u.attributeNamespace;
        if (a === null)
          e.removeAttribute(m);
        else {
          var R = u.type, C;
          R === pr || R === da && a === !0 ? C = "" : (fa(a, m), C = "" + a, u.sanitizeURL && cf(C.toString())), y ? e.setAttributeNS(y, m, C) : e.setAttribute(m, C);
        }
      }
    }
    var si = Symbol.for("react.element"), qr = Symbol.for("react.portal"), Gl = Symbol.for("react.fragment"), Wi = Symbol.for("react.strict_mode"), Wl = Symbol.for("react.profiler"), Xl = Symbol.for("react.provider"), Iu = Symbol.for("react.context"), ql = Symbol.for("react.forward_ref"), ds = Symbol.for("react.suspense"), ps = Symbol.for("react.suspense_list"), Kr = Symbol.for("react.memo"), En = Symbol.for("react.lazy"), Up = Symbol.for("react.scope"), Fm = Symbol.for("react.debug_trace_mode"), pf = Symbol.for("react.offscreen"), Ap = Symbol.for("react.legacy_hidden"), Hp = Symbol.for("react.cache"), Fp = Symbol.for("react.tracing_marker"), jp = Symbol.iterator, jm = "@@iterator";
    function ot(e) {
      if (e === null || typeof e != "object")
        return null;
      var t = jp && e[jp] || e[jm];
      return typeof t == "function" ? t : null;
    }
    var Ae = Object.assign, Xi = 0, vf, $u, Vp, hf, Gu, Zr, Bp;
    function br() {
    }
    br.__reactDisabledLog = !0;
    function Vm() {
      {
        if (Xi === 0) {
          vf = console.log, $u = console.info, Vp = console.warn, hf = console.error, Gu = console.group, Zr = console.groupCollapsed, Bp = console.groupEnd;
          var e = {
            configurable: !0,
            enumerable: !0,
            value: br,
            writable: !0
          };
          Object.defineProperties(console, {
            info: e,
            log: e,
            warn: e,
            error: e,
            group: e,
            groupCollapsed: e,
            groupEnd: e
          });
        }
        Xi++;
      }
    }
    function Bm() {
      {
        if (Xi--, Xi === 0) {
          var e = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: Ae({}, e, {
              value: vf
            }),
            info: Ae({}, e, {
              value: $u
            }),
            warn: Ae({}, e, {
              value: Vp
            }),
            error: Ae({}, e, {
              value: hf
            }),
            group: Ae({}, e, {
              value: Gu
            }),
            groupCollapsed: Ae({}, e, {
              value: Zr
            }),
            groupEnd: Ae({}, e, {
              value: Bp
            })
          });
        }
        Xi < 0 && g("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var mf = x.ReactCurrentDispatcher, Kl;
    function Jr(e, t, a) {
      {
        if (Kl === void 0)
          try {
            throw Error();
          } catch (u) {
            var i = u.stack.trim().match(/\n( *(at )?)/);
            Kl = i && i[1] || "";
          }
        return `
` + Kl + e;
      }
    }
    var qi = !1, Ki;
    {
      var Pm = typeof WeakMap == "function" ? WeakMap : Map;
      Ki = new Pm();
    }
    function yf(e, t) {
      if (!e || qi)
        return "";
      {
        var a = Ki.get(e);
        if (a !== void 0)
          return a;
      }
      var i;
      qi = !0;
      var u = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var s;
      s = mf.current, mf.current = null, Vm();
      try {
        if (t) {
          var f = function() {
            throw Error();
          };
          if (Object.defineProperty(f.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(f, []);
            } catch (O) {
              i = O;
            }
            Reflect.construct(e, [], f);
          } else {
            try {
              f.call();
            } catch (O) {
              i = O;
            }
            e.call(f.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (O) {
            i = O;
          }
          e();
        }
      } catch (O) {
        if (O && i && typeof O.stack == "string") {
          for (var p = O.stack.split(`
`), v = i.stack.split(`
`), m = p.length - 1, y = v.length - 1; m >= 1 && y >= 0 && p[m] !== v[y]; )
            y--;
          for (; m >= 1 && y >= 0; m--, y--)
            if (p[m] !== v[y]) {
              if (m !== 1 || y !== 1)
                do
                  if (m--, y--, y < 0 || p[m] !== v[y]) {
                    var R = `
` + p[m].replace(" at new ", " at ");
                    return e.displayName && R.includes("<anonymous>") && (R = R.replace("<anonymous>", e.displayName)), typeof e == "function" && Ki.set(e, R), R;
                  }
                while (m >= 1 && y >= 0);
              break;
            }
        }
      } finally {
        qi = !1, mf.current = s, Bm(), Error.prepareStackTrace = u;
      }
      var C = e ? e.displayName || e.name : "", _ = C ? Jr(C) : "";
      return typeof e == "function" && Ki.set(e, _), _;
    }
    function gf(e, t, a) {
      return yf(e, !0);
    }
    function vs(e, t, a) {
      return yf(e, !1);
    }
    function Sf(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function Zi(e, t, a) {
      if (e == null)
        return "";
      if (typeof e == "function")
        return yf(e, Sf(e));
      if (typeof e == "string")
        return Jr(e);
      switch (e) {
        case ds:
          return Jr("Suspense");
        case ps:
          return Jr("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case ql:
            return vs(e.render);
          case Kr:
            return Zi(e.type, t, a);
          case En: {
            var i = e, u = i._payload, s = i._init;
            try {
              return Zi(s(u), t, a);
            } catch {
            }
          }
        }
      return "";
    }
    function Ym(e) {
      switch (e._debugOwner && e._debugOwner.type, e._debugSource, e.tag) {
        case J:
          return Jr(e.type);
        case wn:
          return Jr("Lazy");
        case _e:
          return Jr("Suspense");
        case It:
          return Jr("SuspenseList");
        case ge:
        case Dt:
        case Me:
          return vs(e.type);
        case De:
          return vs(e.type.render);
        case le:
          return gf(e.type);
        default:
          return "";
      }
    }
    function hs(e) {
      try {
        var t = "", a = e;
        do
          t += Ym(a), a = a.return;
        while (a);
        return t;
      } catch (i) {
        return `
Error generating stack: ` + i.message + `
` + i.stack;
      }
    }
    function Ke(e, t, a) {
      var i = e.displayName;
      if (i)
        return i;
      var u = t.displayName || t.name || "";
      return u !== "" ? a + "(" + u + ")" : a;
    }
    function Ef(e) {
      return e.displayName || "Context";
    }
    function Ze(e) {
      if (e == null)
        return null;
      if (typeof e.tag == "number" && g("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
        return e.displayName || e.name || null;
      if (typeof e == "string")
        return e;
      switch (e) {
        case Gl:
          return "Fragment";
        case qr:
          return "Portal";
        case Wl:
          return "Profiler";
        case Wi:
          return "StrictMode";
        case ds:
          return "Suspense";
        case ps:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case Iu:
            var t = e;
            return Ef(t) + ".Consumer";
          case Xl:
            var a = e;
            return Ef(a._context) + ".Provider";
          case ql:
            return Ke(e, e.render, "ForwardRef");
          case Kr:
            var i = e.displayName || null;
            return i !== null ? i : Ze(e.type) || "Memo";
          case En: {
            var u = e, s = u._payload, f = u._init;
            try {
              return Ze(f(s));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    function Cf(e, t, a) {
      var i = t.displayName || t.name || "";
      return e.displayName || (i !== "" ? a + "(" + i + ")" : a);
    }
    function Tf(e) {
      return e.displayName || "Context";
    }
    function Re(e) {
      var t = e.tag, a = e.type;
      switch (t) {
        case Dn:
          return "Cache";
        case Pn:
          var i = a;
          return Tf(i) + ".Consumer";
        case lt:
          var u = a;
          return Tf(u._context) + ".Provider";
        case Kt:
          return "DehydratedFragment";
        case De:
          return Cf(a, a.render, "ForwardRef");
        case Ge:
          return "Fragment";
        case J:
          return a;
        case me:
          return "Portal";
        case P:
          return "Root";
        case Oe:
          return "Text";
        case wn:
          return Ze(a);
        case et:
          return a === Wi ? "StrictMode" : "Mode";
        case Le:
          return "Offscreen";
        case be:
          return "Profiler";
        case ft:
          return "Scope";
        case _e:
          return "Suspense";
        case It:
          return "SuspenseList";
        case Nt:
          return "TracingMarker";
        case le:
        case ge:
        case Ct:
        case Dt:
        case mt:
        case Me:
          if (typeof a == "function")
            return a.displayName || a.name || null;
          if (typeof a == "string")
            return a;
          break;
      }
      return null;
    }
    var Rf = x.ReactDebugCurrentFrame, bn = null, ci = !1;
    function _r() {
      {
        if (bn === null)
          return null;
        var e = bn._debugOwner;
        if (e !== null && typeof e < "u")
          return Re(e);
      }
      return null;
    }
    function fi() {
      return bn === null ? "" : hs(bn);
    }
    function xt() {
      Rf.getCurrentStack = null, bn = null, ci = !1;
    }
    function dt(e) {
      Rf.getCurrentStack = e === null ? null : fi, bn = e, ci = !1;
    }
    function Wu() {
      return bn;
    }
    function rn(e) {
      ci = e;
    }
    function Lr(e) {
      return "" + e;
    }
    function za(e) {
      switch (typeof e) {
        case "boolean":
        case "number":
        case "string":
        case "undefined":
          return e;
        case "object":
          return dr(e), e;
        default:
          return "";
      }
    }
    var Xu = {
      button: !0,
      checkbox: !0,
      image: !0,
      hidden: !0,
      radio: !0,
      reset: !0,
      submit: !0
    };
    function xf(e, t) {
      Xu[t.type] || t.onChange || t.onInput || t.readOnly || t.disabled || t.value == null || g("You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`."), t.onChange || t.readOnly || t.disabled || t.checked == null || g("You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.");
    }
    function wf(e) {
      var t = e.type, a = e.nodeName;
      return a && a.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
    }
    function qu(e) {
      return e._valueTracker;
    }
    function Pp(e) {
      e._valueTracker = null;
    }
    function Qm(e) {
      var t = "";
      return e && (wf(e) ? t = e.checked ? "true" : "false" : t = e.value), t;
    }
    function Ku(e) {
      var t = wf(e) ? "checked" : "value", a = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
      dr(e[t]);
      var i = "" + e[t];
      if (!(e.hasOwnProperty(t) || typeof a > "u" || typeof a.get != "function" || typeof a.set != "function")) {
        var u = a.get, s = a.set;
        Object.defineProperty(e, t, {
          configurable: !0,
          get: function() {
            return u.call(this);
          },
          set: function(p) {
            dr(p), i = "" + p, s.call(this, p);
          }
        }), Object.defineProperty(e, t, {
          enumerable: a.enumerable
        });
        var f = {
          getValue: function() {
            return i;
          },
          setValue: function(p) {
            dr(p), i = "" + p;
          },
          stopTracking: function() {
            Pp(e), delete e[t];
          }
        };
        return f;
      }
    }
    function di(e) {
      qu(e) || (e._valueTracker = Ku(e));
    }
    function Ji(e) {
      if (!e)
        return !1;
      var t = qu(e);
      if (!t)
        return !0;
      var a = t.getValue(), i = Qm(e);
      return i !== a ? (t.setValue(i), !0) : !1;
    }
    function el(e) {
      if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u")
        return null;
      try {
        return e.activeElement || e.body;
      } catch {
        return e.body;
      }
    }
    var Yp = !1, Qp = !1, ms = !1, Zu = !1;
    function ys(e) {
      var t = e.type === "checkbox" || e.type === "radio";
      return t ? e.checked != null : e.value != null;
    }
    function gs(e, t) {
      var a = e, i = t.checked, u = Ae({}, t, {
        defaultChecked: void 0,
        defaultValue: void 0,
        value: void 0,
        checked: i ?? a._wrapperState.initialChecked
      });
      return u;
    }
    function Ua(e, t) {
      xf("input", t), t.checked !== void 0 && t.defaultChecked !== void 0 && !Qp && (g("%s contains an input of type %s with both checked and defaultChecked props. Input elements must be either controlled or uncontrolled (specify either the checked prop, or the defaultChecked prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", _r() || "A component", t.type), Qp = !0), t.value !== void 0 && t.defaultValue !== void 0 && !Yp && (g("%s contains an input of type %s with both value and defaultValue props. Input elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", _r() || "A component", t.type), Yp = !0);
      var a = e, i = t.defaultValue == null ? "" : t.defaultValue;
      a._wrapperState = {
        initialChecked: t.checked != null ? t.checked : t.defaultChecked,
        initialValue: za(t.value != null ? t.value : i),
        controlled: ys(t)
      };
    }
    function Ss(e, t) {
      var a = e, i = t.checked;
      i != null && Gi(a, "checked", i, !1);
    }
    function Zl(e, t) {
      var a = e;
      {
        var i = ys(t);
        !a._wrapperState.controlled && i && !Zu && (g("A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), Zu = !0), a._wrapperState.controlled && !i && !ms && (g("A component is changing a controlled input to be uncontrolled. This is likely caused by the value changing from a defined to undefined, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), ms = !0);
      }
      Ss(e, t);
      var u = za(t.value), s = t.type;
      if (u != null)
        s === "number" ? (u === 0 && a.value === "" || // We explicitly want to coerce to number here if possible.
        // eslint-disable-next-line
        a.value != u) && (a.value = Lr(u)) : a.value !== Lr(u) && (a.value = Lr(u));
      else if (s === "submit" || s === "reset") {
        a.removeAttribute("value");
        return;
      }
      t.hasOwnProperty("value") ? Ts(a, t.type, u) : t.hasOwnProperty("defaultValue") && Ts(a, t.type, za(t.defaultValue)), t.checked == null && t.defaultChecked != null && (a.defaultChecked = !!t.defaultChecked);
    }
    function Df(e, t, a) {
      var i = e;
      if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
        var u = t.type, s = u === "submit" || u === "reset";
        if (s && (t.value === void 0 || t.value === null))
          return;
        var f = Lr(i._wrapperState.initialValue);
        a || f !== i.value && (i.value = f), i.defaultValue = f;
      }
      var p = i.name;
      p !== "" && (i.name = ""), i.defaultChecked = !i.defaultChecked, i.defaultChecked = !!i._wrapperState.initialChecked, p !== "" && (i.name = p);
    }
    function Es(e, t) {
      var a = e;
      Zl(a, t), Cs(a, t);
    }
    function Cs(e, t) {
      var a = t.name;
      if (t.type === "radio" && a != null) {
        for (var i = e; i.parentNode; )
          i = i.parentNode;
        fa(a, "name");
        for (var u = i.querySelectorAll("input[name=" + JSON.stringify("" + a) + '][type="radio"]'), s = 0; s < u.length; s++) {
          var f = u[s];
          if (!(f === e || f.form !== e.form)) {
            var p = Th(f);
            if (!p)
              throw new Error("ReactDOMInput: Mixing React and non-React radio inputs with the same `name` is not supported.");
            Ji(f), Zl(f, p);
          }
        }
      }
    }
    function Ts(e, t, a) {
      // Focused number inputs synchronize on blur. See ChangeEventPlugin.js
      (t !== "number" || el(e.ownerDocument) !== e) && (a == null ? e.defaultValue = Lr(e._wrapperState.initialValue) : e.defaultValue !== Lr(a) && (e.defaultValue = Lr(a)));
    }
    var Wn = !1, tl = !1, Rs = !1;
    function Jl(e, t) {
      t.value == null && (typeof t.children == "object" && t.children !== null ? U.Children.forEach(t.children, function(a) {
        a != null && (typeof a == "string" || typeof a == "number" || tl || (tl = !0, g("Cannot infer the option value of complex children. Pass a `value` prop or use a plain string as children to <option>.")));
      }) : t.dangerouslySetInnerHTML != null && (Rs || (Rs = !0, g("Pass a `value` prop if you set dangerouslyInnerHTML so React knows which value should be selected.")))), t.selected != null && !Wn && (g("Use the `defaultValue` or `value` props on <select> instead of setting `selected` on <option>."), Wn = !0);
    }
    function Im(e, t) {
      t.value != null && e.setAttribute("value", Lr(za(t.value)));
    }
    var kf = Array.isArray;
    function an(e) {
      return kf(e);
    }
    var nl;
    nl = !1;
    function Ju() {
      var e = _r();
      return e ? `

Check the render method of \`` + e + "`." : "";
    }
    var bf = ["value", "defaultValue"];
    function $m(e) {
      {
        xf("select", e);
        for (var t = 0; t < bf.length; t++) {
          var a = bf[t];
          if (e[a] != null) {
            var i = an(e[a]);
            e.multiple && !i ? g("The `%s` prop supplied to <select> must be an array if `multiple` is true.%s", a, Ju()) : !e.multiple && i && g("The `%s` prop supplied to <select> must be a scalar value if `multiple` is false.%s", a, Ju());
          }
        }
      }
    }
    function eu(e, t, a, i) {
      var u = e.options;
      if (t) {
        for (var s = a, f = {}, p = 0; p < s.length; p++)
          f["$" + s[p]] = !0;
        for (var v = 0; v < u.length; v++) {
          var m = f.hasOwnProperty("$" + u[v].value);
          u[v].selected !== m && (u[v].selected = m), m && i && (u[v].defaultSelected = !0);
        }
      } else {
        for (var y = Lr(za(a)), R = null, C = 0; C < u.length; C++) {
          if (u[C].value === y) {
            u[C].selected = !0, i && (u[C].defaultSelected = !0);
            return;
          }
          R === null && !u[C].disabled && (R = u[C]);
        }
        R !== null && (R.selected = !0);
      }
    }
    function _f(e, t) {
      return Ae({}, t, {
        value: void 0
      });
    }
    function xs(e, t) {
      var a = e;
      $m(t), a._wrapperState = {
        wasMultiple: !!t.multiple
      }, t.value !== void 0 && t.defaultValue !== void 0 && !nl && (g("Select elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled select element and remove one of these props. More info: https://reactjs.org/link/controlled-components"), nl = !0);
    }
    function Gm(e, t) {
      var a = e;
      a.multiple = !!t.multiple;
      var i = t.value;
      i != null ? eu(a, !!t.multiple, i, !1) : t.defaultValue != null && eu(a, !!t.multiple, t.defaultValue, !0);
    }
    function Wm(e, t) {
      var a = e, i = a._wrapperState.wasMultiple;
      a._wrapperState.wasMultiple = !!t.multiple;
      var u = t.value;
      u != null ? eu(a, !!t.multiple, u, !1) : i !== !!t.multiple && (t.defaultValue != null ? eu(a, !!t.multiple, t.defaultValue, !0) : eu(a, !!t.multiple, t.multiple ? [] : "", !1));
    }
    function Xm(e, t) {
      var a = e, i = t.value;
      i != null && eu(a, !!t.multiple, i, !1);
    }
    var Ip = !1;
    function Lf(e, t) {
      var a = e;
      if (t.dangerouslySetInnerHTML != null)
        throw new Error("`dangerouslySetInnerHTML` does not make sense on <textarea>.");
      var i = Ae({}, t, {
        value: void 0,
        defaultValue: void 0,
        children: Lr(a._wrapperState.initialValue)
      });
      return i;
    }
    function Of(e, t) {
      var a = e;
      xf("textarea", t), t.value !== void 0 && t.defaultValue !== void 0 && !Ip && (g("%s contains a textarea with both value and defaultValue props. Textarea elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled textarea and remove one of these props. More info: https://reactjs.org/link/controlled-components", _r() || "A component"), Ip = !0);
      var i = t.value;
      if (i == null) {
        var u = t.children, s = t.defaultValue;
        if (u != null) {
          g("Use the `defaultValue` or `value` props instead of setting children on <textarea>.");
          {
            if (s != null)
              throw new Error("If you supply `defaultValue` on a <textarea>, do not pass children.");
            if (an(u)) {
              if (u.length > 1)
                throw new Error("<textarea> can only have at most one child.");
              u = u[0];
            }
            s = u;
          }
        }
        s == null && (s = ""), i = s;
      }
      a._wrapperState = {
        initialValue: za(i)
      };
    }
    function $p(e, t) {
      var a = e, i = za(t.value), u = za(t.defaultValue);
      if (i != null) {
        var s = Lr(i);
        s !== a.value && (a.value = s), t.defaultValue == null && a.defaultValue !== s && (a.defaultValue = s);
      }
      u != null && (a.defaultValue = Lr(u));
    }
    function Gp(e, t) {
      var a = e, i = a.textContent;
      i === a._wrapperState.initialValue && i !== "" && i !== null && (a.value = i);
    }
    function qm(e, t) {
      $p(e, t);
    }
    var Aa = "http://www.w3.org/1999/xhtml", Mf = "http://www.w3.org/1998/Math/MathML", Nf = "http://www.w3.org/2000/svg";
    function zf(e) {
      switch (e) {
        case "svg":
          return Nf;
        case "math":
          return Mf;
        default:
          return Aa;
      }
    }
    function Uf(e, t) {
      return e == null || e === Aa ? zf(t) : e === Nf && t === "foreignObject" ? Aa : e;
    }
    var Wp = function(e) {
      return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, a, i, u) {
        MSApp.execUnsafeLocalFunction(function() {
          return e(t, a, i, u);
        });
      } : e;
    }, ws, Xp = Wp(function(e, t) {
      if (e.namespaceURI === Nf && !("innerHTML" in e)) {
        ws = ws || document.createElement("div"), ws.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>";
        for (var a = ws.firstChild; e.firstChild; )
          e.removeChild(e.firstChild);
        for (; a.firstChild; )
          e.appendChild(a.firstChild);
        return;
      }
      e.innerHTML = t;
    }), Xn = 1, Ha = 3, At = 8, Fa = 9, Af = 11, tu = function(e, t) {
      if (t) {
        var a = e.firstChild;
        if (a && a === e.lastChild && a.nodeType === Ha) {
          a.nodeValue = t;
          return;
        }
      }
      e.textContent = t;
    }, eo = {
      animation: ["animationDelay", "animationDirection", "animationDuration", "animationFillMode", "animationIterationCount", "animationName", "animationPlayState", "animationTimingFunction"],
      background: ["backgroundAttachment", "backgroundClip", "backgroundColor", "backgroundImage", "backgroundOrigin", "backgroundPositionX", "backgroundPositionY", "backgroundRepeat", "backgroundSize"],
      backgroundPosition: ["backgroundPositionX", "backgroundPositionY"],
      border: ["borderBottomColor", "borderBottomStyle", "borderBottomWidth", "borderImageOutset", "borderImageRepeat", "borderImageSlice", "borderImageSource", "borderImageWidth", "borderLeftColor", "borderLeftStyle", "borderLeftWidth", "borderRightColor", "borderRightStyle", "borderRightWidth", "borderTopColor", "borderTopStyle", "borderTopWidth"],
      borderBlockEnd: ["borderBlockEndColor", "borderBlockEndStyle", "borderBlockEndWidth"],
      borderBlockStart: ["borderBlockStartColor", "borderBlockStartStyle", "borderBlockStartWidth"],
      borderBottom: ["borderBottomColor", "borderBottomStyle", "borderBottomWidth"],
      borderColor: ["borderBottomColor", "borderLeftColor", "borderRightColor", "borderTopColor"],
      borderImage: ["borderImageOutset", "borderImageRepeat", "borderImageSlice", "borderImageSource", "borderImageWidth"],
      borderInlineEnd: ["borderInlineEndColor", "borderInlineEndStyle", "borderInlineEndWidth"],
      borderInlineStart: ["borderInlineStartColor", "borderInlineStartStyle", "borderInlineStartWidth"],
      borderLeft: ["borderLeftColor", "borderLeftStyle", "borderLeftWidth"],
      borderRadius: ["borderBottomLeftRadius", "borderBottomRightRadius", "borderTopLeftRadius", "borderTopRightRadius"],
      borderRight: ["borderRightColor", "borderRightStyle", "borderRightWidth"],
      borderStyle: ["borderBottomStyle", "borderLeftStyle", "borderRightStyle", "borderTopStyle"],
      borderTop: ["borderTopColor", "borderTopStyle", "borderTopWidth"],
      borderWidth: ["borderBottomWidth", "borderLeftWidth", "borderRightWidth", "borderTopWidth"],
      columnRule: ["columnRuleColor", "columnRuleStyle", "columnRuleWidth"],
      columns: ["columnCount", "columnWidth"],
      flex: ["flexBasis", "flexGrow", "flexShrink"],
      flexFlow: ["flexDirection", "flexWrap"],
      font: ["fontFamily", "fontFeatureSettings", "fontKerning", "fontLanguageOverride", "fontSize", "fontSizeAdjust", "fontStretch", "fontStyle", "fontVariant", "fontVariantAlternates", "fontVariantCaps", "fontVariantEastAsian", "fontVariantLigatures", "fontVariantNumeric", "fontVariantPosition", "fontWeight", "lineHeight"],
      fontVariant: ["fontVariantAlternates", "fontVariantCaps", "fontVariantEastAsian", "fontVariantLigatures", "fontVariantNumeric", "fontVariantPosition"],
      gap: ["columnGap", "rowGap"],
      grid: ["gridAutoColumns", "gridAutoFlow", "gridAutoRows", "gridTemplateAreas", "gridTemplateColumns", "gridTemplateRows"],
      gridArea: ["gridColumnEnd", "gridColumnStart", "gridRowEnd", "gridRowStart"],
      gridColumn: ["gridColumnEnd", "gridColumnStart"],
      gridColumnGap: ["columnGap"],
      gridGap: ["columnGap", "rowGap"],
      gridRow: ["gridRowEnd", "gridRowStart"],
      gridRowGap: ["rowGap"],
      gridTemplate: ["gridTemplateAreas", "gridTemplateColumns", "gridTemplateRows"],
      listStyle: ["listStyleImage", "listStylePosition", "listStyleType"],
      margin: ["marginBottom", "marginLeft", "marginRight", "marginTop"],
      marker: ["markerEnd", "markerMid", "markerStart"],
      mask: ["maskClip", "maskComposite", "maskImage", "maskMode", "maskOrigin", "maskPositionX", "maskPositionY", "maskRepeat", "maskSize"],
      maskPosition: ["maskPositionX", "maskPositionY"],
      outline: ["outlineColor", "outlineStyle", "outlineWidth"],
      overflow: ["overflowX", "overflowY"],
      padding: ["paddingBottom", "paddingLeft", "paddingRight", "paddingTop"],
      placeContent: ["alignContent", "justifyContent"],
      placeItems: ["alignItems", "justifyItems"],
      placeSelf: ["alignSelf", "justifySelf"],
      textDecoration: ["textDecorationColor", "textDecorationLine", "textDecorationStyle"],
      textEmphasis: ["textEmphasisColor", "textEmphasisStyle"],
      transition: ["transitionDelay", "transitionDuration", "transitionProperty", "transitionTimingFunction"],
      wordWrap: ["overflowWrap"]
    }, to = {
      animationIterationCount: !0,
      aspectRatio: !0,
      borderImageOutset: !0,
      borderImageSlice: !0,
      borderImageWidth: !0,
      boxFlex: !0,
      boxFlexGroup: !0,
      boxOrdinalGroup: !0,
      columnCount: !0,
      columns: !0,
      flex: !0,
      flexGrow: !0,
      flexPositive: !0,
      flexShrink: !0,
      flexNegative: !0,
      flexOrder: !0,
      gridArea: !0,
      gridRow: !0,
      gridRowEnd: !0,
      gridRowSpan: !0,
      gridRowStart: !0,
      gridColumn: !0,
      gridColumnEnd: !0,
      gridColumnSpan: !0,
      gridColumnStart: !0,
      fontWeight: !0,
      lineClamp: !0,
      lineHeight: !0,
      opacity: !0,
      order: !0,
      orphans: !0,
      tabSize: !0,
      widows: !0,
      zIndex: !0,
      zoom: !0,
      // SVG-related properties
      fillOpacity: !0,
      floodOpacity: !0,
      stopOpacity: !0,
      strokeDasharray: !0,
      strokeDashoffset: !0,
      strokeMiterlimit: !0,
      strokeOpacity: !0,
      strokeWidth: !0
    };
    function qp(e, t) {
      return e + t.charAt(0).toUpperCase() + t.substring(1);
    }
    var Kp = ["Webkit", "ms", "Moz", "O"];
    Object.keys(to).forEach(function(e) {
      Kp.forEach(function(t) {
        to[qp(t, e)] = to[e];
      });
    });
    function Ds(e, t, a) {
      var i = t == null || typeof t == "boolean" || t === "";
      return i ? "" : !a && typeof t == "number" && t !== 0 && !(to.hasOwnProperty(e) && to[e]) ? t + "px" : (Yu(t, e), ("" + t).trim());
    }
    var Zp = /([A-Z])/g, Jp = /^ms-/;
    function nu(e) {
      return e.replace(Zp, "-$1").toLowerCase().replace(Jp, "-ms-");
    }
    var ev = function() {
    };
    {
      var Km = /^(?:webkit|moz|o)[A-Z]/, Zm = /^-ms-/, tv = /-(.)/g, Hf = /;\s*$/, pa = {}, rl = {}, nv = !1, no = !1, Jm = function(e) {
        return e.replace(tv, function(t, a) {
          return a.toUpperCase();
        });
      }, rv = function(e) {
        pa.hasOwnProperty(e) && pa[e] || (pa[e] = !0, g(
          "Unsupported style property %s. Did you mean %s?",
          e,
          // As Andi Smith suggests
          // (http://www.andismith.com/blog/2012/02/modernizr-prefixed/), an `-ms` prefix
          // is converted to lowercase `ms`.
          Jm(e.replace(Zm, "ms-"))
        ));
      }, Ff = function(e) {
        pa.hasOwnProperty(e) && pa[e] || (pa[e] = !0, g("Unsupported vendor-prefixed style property %s. Did you mean %s?", e, e.charAt(0).toUpperCase() + e.slice(1)));
      }, jf = function(e, t) {
        rl.hasOwnProperty(t) && rl[t] || (rl[t] = !0, g(`Style property values shouldn't contain a semicolon. Try "%s: %s" instead.`, e, t.replace(Hf, "")));
      }, av = function(e, t) {
        nv || (nv = !0, g("`NaN` is an invalid value for the `%s` css style property.", e));
      }, iv = function(e, t) {
        no || (no = !0, g("`Infinity` is an invalid value for the `%s` css style property.", e));
      };
      ev = function(e, t) {
        e.indexOf("-") > -1 ? rv(e) : Km.test(e) ? Ff(e) : Hf.test(t) && jf(e, t), typeof t == "number" && (isNaN(t) ? av(e, t) : isFinite(t) || iv(e, t));
      };
    }
    var lv = ev;
    function ey(e) {
      {
        var t = "", a = "";
        for (var i in e)
          if (e.hasOwnProperty(i)) {
            var u = e[i];
            if (u != null) {
              var s = i.indexOf("--") === 0;
              t += a + (s ? i : nu(i)) + ":", t += Ds(i, u, s), a = ";";
            }
          }
        return t || null;
      }
    }
    function uv(e, t) {
      var a = e.style;
      for (var i in t)
        if (t.hasOwnProperty(i)) {
          var u = i.indexOf("--") === 0;
          u || lv(i, t[i]);
          var s = Ds(i, t[i], u);
          i === "float" && (i = "cssFloat"), u ? a.setProperty(i, s) : a[i] = s;
        }
    }
    function ty(e) {
      return e == null || typeof e == "boolean" || e === "";
    }
    function ov(e) {
      var t = {};
      for (var a in e)
        for (var i = eo[a] || [a], u = 0; u < i.length; u++)
          t[i[u]] = a;
      return t;
    }
    function ny(e, t) {
      {
        if (!t)
          return;
        var a = ov(e), i = ov(t), u = {};
        for (var s in a) {
          var f = a[s], p = i[s];
          if (p && f !== p) {
            var v = f + "," + p;
            if (u[v])
              continue;
            u[v] = !0, g("%s a style property during rerender (%s) when a conflicting property is set (%s) can lead to styling bugs. To avoid this, don't mix shorthand and non-shorthand properties for the same value; instead, replace the shorthand with separate values.", ty(e[f]) ? "Removing" : "Updating", f, p);
          }
        }
      }
    }
    var ea = {
      area: !0,
      base: !0,
      br: !0,
      col: !0,
      embed: !0,
      hr: !0,
      img: !0,
      input: !0,
      keygen: !0,
      link: !0,
      meta: !0,
      param: !0,
      source: !0,
      track: !0,
      wbr: !0
      // NOTE: menuitem's close tag should be omitted, but that causes problems.
    }, ro = Ae({
      menuitem: !0
    }, ea), sv = "__html";
    function ks(e, t) {
      if (t) {
        if (ro[e] && (t.children != null || t.dangerouslySetInnerHTML != null))
          throw new Error(e + " is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
        if (t.dangerouslySetInnerHTML != null) {
          if (t.children != null)
            throw new Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
          if (typeof t.dangerouslySetInnerHTML != "object" || !(sv in t.dangerouslySetInnerHTML))
            throw new Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://reactjs.org/link/dangerously-set-inner-html for more information.");
        }
        if (!t.suppressContentEditableWarning && t.contentEditable && t.children != null && g("A component is `contentEditable` and contains `children` managed by React. It is now your responsibility to guarantee that none of those nodes are unexpectedly modified or duplicated. This is probably not intentional."), t.style != null && typeof t.style != "object")
          throw new Error("The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.");
      }
    }
    function pi(e, t) {
      if (e.indexOf("-") === -1)
        return typeof t.is == "string";
      switch (e) {
        case "annotation-xml":
        case "color-profile":
        case "font-face":
        case "font-face-src":
        case "font-face-uri":
        case "font-face-format":
        case "font-face-name":
        case "missing-glyph":
          return !1;
        default:
          return !0;
      }
    }
    var ao = {
      // HTML
      accept: "accept",
      acceptcharset: "acceptCharset",
      "accept-charset": "acceptCharset",
      accesskey: "accessKey",
      action: "action",
      allowfullscreen: "allowFullScreen",
      alt: "alt",
      as: "as",
      async: "async",
      autocapitalize: "autoCapitalize",
      autocomplete: "autoComplete",
      autocorrect: "autoCorrect",
      autofocus: "autoFocus",
      autoplay: "autoPlay",
      autosave: "autoSave",
      capture: "capture",
      cellpadding: "cellPadding",
      cellspacing: "cellSpacing",
      challenge: "challenge",
      charset: "charSet",
      checked: "checked",
      children: "children",
      cite: "cite",
      class: "className",
      classid: "classID",
      classname: "className",
      cols: "cols",
      colspan: "colSpan",
      content: "content",
      contenteditable: "contentEditable",
      contextmenu: "contextMenu",
      controls: "controls",
      controlslist: "controlsList",
      coords: "coords",
      crossorigin: "crossOrigin",
      dangerouslysetinnerhtml: "dangerouslySetInnerHTML",
      data: "data",
      datetime: "dateTime",
      default: "default",
      defaultchecked: "defaultChecked",
      defaultvalue: "defaultValue",
      defer: "defer",
      dir: "dir",
      disabled: "disabled",
      disablepictureinpicture: "disablePictureInPicture",
      disableremoteplayback: "disableRemotePlayback",
      download: "download",
      draggable: "draggable",
      enctype: "encType",
      enterkeyhint: "enterKeyHint",
      for: "htmlFor",
      form: "form",
      formmethod: "formMethod",
      formaction: "formAction",
      formenctype: "formEncType",
      formnovalidate: "formNoValidate",
      formtarget: "formTarget",
      frameborder: "frameBorder",
      headers: "headers",
      height: "height",
      hidden: "hidden",
      high: "high",
      href: "href",
      hreflang: "hrefLang",
      htmlfor: "htmlFor",
      httpequiv: "httpEquiv",
      "http-equiv": "httpEquiv",
      icon: "icon",
      id: "id",
      imagesizes: "imageSizes",
      imagesrcset: "imageSrcSet",
      innerhtml: "innerHTML",
      inputmode: "inputMode",
      integrity: "integrity",
      is: "is",
      itemid: "itemID",
      itemprop: "itemProp",
      itemref: "itemRef",
      itemscope: "itemScope",
      itemtype: "itemType",
      keyparams: "keyParams",
      keytype: "keyType",
      kind: "kind",
      label: "label",
      lang: "lang",
      list: "list",
      loop: "loop",
      low: "low",
      manifest: "manifest",
      marginwidth: "marginWidth",
      marginheight: "marginHeight",
      max: "max",
      maxlength: "maxLength",
      media: "media",
      mediagroup: "mediaGroup",
      method: "method",
      min: "min",
      minlength: "minLength",
      multiple: "multiple",
      muted: "muted",
      name: "name",
      nomodule: "noModule",
      nonce: "nonce",
      novalidate: "noValidate",
      open: "open",
      optimum: "optimum",
      pattern: "pattern",
      placeholder: "placeholder",
      playsinline: "playsInline",
      poster: "poster",
      preload: "preload",
      profile: "profile",
      radiogroup: "radioGroup",
      readonly: "readOnly",
      referrerpolicy: "referrerPolicy",
      rel: "rel",
      required: "required",
      reversed: "reversed",
      role: "role",
      rows: "rows",
      rowspan: "rowSpan",
      sandbox: "sandbox",
      scope: "scope",
      scoped: "scoped",
      scrolling: "scrolling",
      seamless: "seamless",
      selected: "selected",
      shape: "shape",
      size: "size",
      sizes: "sizes",
      span: "span",
      spellcheck: "spellCheck",
      src: "src",
      srcdoc: "srcDoc",
      srclang: "srcLang",
      srcset: "srcSet",
      start: "start",
      step: "step",
      style: "style",
      summary: "summary",
      tabindex: "tabIndex",
      target: "target",
      title: "title",
      type: "type",
      usemap: "useMap",
      value: "value",
      width: "width",
      wmode: "wmode",
      wrap: "wrap",
      // SVG
      about: "about",
      accentheight: "accentHeight",
      "accent-height": "accentHeight",
      accumulate: "accumulate",
      additive: "additive",
      alignmentbaseline: "alignmentBaseline",
      "alignment-baseline": "alignmentBaseline",
      allowreorder: "allowReorder",
      alphabetic: "alphabetic",
      amplitude: "amplitude",
      arabicform: "arabicForm",
      "arabic-form": "arabicForm",
      ascent: "ascent",
      attributename: "attributeName",
      attributetype: "attributeType",
      autoreverse: "autoReverse",
      azimuth: "azimuth",
      basefrequency: "baseFrequency",
      baselineshift: "baselineShift",
      "baseline-shift": "baselineShift",
      baseprofile: "baseProfile",
      bbox: "bbox",
      begin: "begin",
      bias: "bias",
      by: "by",
      calcmode: "calcMode",
      capheight: "capHeight",
      "cap-height": "capHeight",
      clip: "clip",
      clippath: "clipPath",
      "clip-path": "clipPath",
      clippathunits: "clipPathUnits",
      cliprule: "clipRule",
      "clip-rule": "clipRule",
      color: "color",
      colorinterpolation: "colorInterpolation",
      "color-interpolation": "colorInterpolation",
      colorinterpolationfilters: "colorInterpolationFilters",
      "color-interpolation-filters": "colorInterpolationFilters",
      colorprofile: "colorProfile",
      "color-profile": "colorProfile",
      colorrendering: "colorRendering",
      "color-rendering": "colorRendering",
      contentscripttype: "contentScriptType",
      contentstyletype: "contentStyleType",
      cursor: "cursor",
      cx: "cx",
      cy: "cy",
      d: "d",
      datatype: "datatype",
      decelerate: "decelerate",
      descent: "descent",
      diffuseconstant: "diffuseConstant",
      direction: "direction",
      display: "display",
      divisor: "divisor",
      dominantbaseline: "dominantBaseline",
      "dominant-baseline": "dominantBaseline",
      dur: "dur",
      dx: "dx",
      dy: "dy",
      edgemode: "edgeMode",
      elevation: "elevation",
      enablebackground: "enableBackground",
      "enable-background": "enableBackground",
      end: "end",
      exponent: "exponent",
      externalresourcesrequired: "externalResourcesRequired",
      fill: "fill",
      fillopacity: "fillOpacity",
      "fill-opacity": "fillOpacity",
      fillrule: "fillRule",
      "fill-rule": "fillRule",
      filter: "filter",
      filterres: "filterRes",
      filterunits: "filterUnits",
      floodopacity: "floodOpacity",
      "flood-opacity": "floodOpacity",
      floodcolor: "floodColor",
      "flood-color": "floodColor",
      focusable: "focusable",
      fontfamily: "fontFamily",
      "font-family": "fontFamily",
      fontsize: "fontSize",
      "font-size": "fontSize",
      fontsizeadjust: "fontSizeAdjust",
      "font-size-adjust": "fontSizeAdjust",
      fontstretch: "fontStretch",
      "font-stretch": "fontStretch",
      fontstyle: "fontStyle",
      "font-style": "fontStyle",
      fontvariant: "fontVariant",
      "font-variant": "fontVariant",
      fontweight: "fontWeight",
      "font-weight": "fontWeight",
      format: "format",
      from: "from",
      fx: "fx",
      fy: "fy",
      g1: "g1",
      g2: "g2",
      glyphname: "glyphName",
      "glyph-name": "glyphName",
      glyphorientationhorizontal: "glyphOrientationHorizontal",
      "glyph-orientation-horizontal": "glyphOrientationHorizontal",
      glyphorientationvertical: "glyphOrientationVertical",
      "glyph-orientation-vertical": "glyphOrientationVertical",
      glyphref: "glyphRef",
      gradienttransform: "gradientTransform",
      gradientunits: "gradientUnits",
      hanging: "hanging",
      horizadvx: "horizAdvX",
      "horiz-adv-x": "horizAdvX",
      horizoriginx: "horizOriginX",
      "horiz-origin-x": "horizOriginX",
      ideographic: "ideographic",
      imagerendering: "imageRendering",
      "image-rendering": "imageRendering",
      in2: "in2",
      in: "in",
      inlist: "inlist",
      intercept: "intercept",
      k1: "k1",
      k2: "k2",
      k3: "k3",
      k4: "k4",
      k: "k",
      kernelmatrix: "kernelMatrix",
      kernelunitlength: "kernelUnitLength",
      kerning: "kerning",
      keypoints: "keyPoints",
      keysplines: "keySplines",
      keytimes: "keyTimes",
      lengthadjust: "lengthAdjust",
      letterspacing: "letterSpacing",
      "letter-spacing": "letterSpacing",
      lightingcolor: "lightingColor",
      "lighting-color": "lightingColor",
      limitingconeangle: "limitingConeAngle",
      local: "local",
      markerend: "markerEnd",
      "marker-end": "markerEnd",
      markerheight: "markerHeight",
      markermid: "markerMid",
      "marker-mid": "markerMid",
      markerstart: "markerStart",
      "marker-start": "markerStart",
      markerunits: "markerUnits",
      markerwidth: "markerWidth",
      mask: "mask",
      maskcontentunits: "maskContentUnits",
      maskunits: "maskUnits",
      mathematical: "mathematical",
      mode: "mode",
      numoctaves: "numOctaves",
      offset: "offset",
      opacity: "opacity",
      operator: "operator",
      order: "order",
      orient: "orient",
      orientation: "orientation",
      origin: "origin",
      overflow: "overflow",
      overlineposition: "overlinePosition",
      "overline-position": "overlinePosition",
      overlinethickness: "overlineThickness",
      "overline-thickness": "overlineThickness",
      paintorder: "paintOrder",
      "paint-order": "paintOrder",
      panose1: "panose1",
      "panose-1": "panose1",
      pathlength: "pathLength",
      patterncontentunits: "patternContentUnits",
      patterntransform: "patternTransform",
      patternunits: "patternUnits",
      pointerevents: "pointerEvents",
      "pointer-events": "pointerEvents",
      points: "points",
      pointsatx: "pointsAtX",
      pointsaty: "pointsAtY",
      pointsatz: "pointsAtZ",
      prefix: "prefix",
      preservealpha: "preserveAlpha",
      preserveaspectratio: "preserveAspectRatio",
      primitiveunits: "primitiveUnits",
      property: "property",
      r: "r",
      radius: "radius",
      refx: "refX",
      refy: "refY",
      renderingintent: "renderingIntent",
      "rendering-intent": "renderingIntent",
      repeatcount: "repeatCount",
      repeatdur: "repeatDur",
      requiredextensions: "requiredExtensions",
      requiredfeatures: "requiredFeatures",
      resource: "resource",
      restart: "restart",
      result: "result",
      results: "results",
      rotate: "rotate",
      rx: "rx",
      ry: "ry",
      scale: "scale",
      security: "security",
      seed: "seed",
      shaperendering: "shapeRendering",
      "shape-rendering": "shapeRendering",
      slope: "slope",
      spacing: "spacing",
      specularconstant: "specularConstant",
      specularexponent: "specularExponent",
      speed: "speed",
      spreadmethod: "spreadMethod",
      startoffset: "startOffset",
      stddeviation: "stdDeviation",
      stemh: "stemh",
      stemv: "stemv",
      stitchtiles: "stitchTiles",
      stopcolor: "stopColor",
      "stop-color": "stopColor",
      stopopacity: "stopOpacity",
      "stop-opacity": "stopOpacity",
      strikethroughposition: "strikethroughPosition",
      "strikethrough-position": "strikethroughPosition",
      strikethroughthickness: "strikethroughThickness",
      "strikethrough-thickness": "strikethroughThickness",
      string: "string",
      stroke: "stroke",
      strokedasharray: "strokeDasharray",
      "stroke-dasharray": "strokeDasharray",
      strokedashoffset: "strokeDashoffset",
      "stroke-dashoffset": "strokeDashoffset",
      strokelinecap: "strokeLinecap",
      "stroke-linecap": "strokeLinecap",
      strokelinejoin: "strokeLinejoin",
      "stroke-linejoin": "strokeLinejoin",
      strokemiterlimit: "strokeMiterlimit",
      "stroke-miterlimit": "strokeMiterlimit",
      strokewidth: "strokeWidth",
      "stroke-width": "strokeWidth",
      strokeopacity: "strokeOpacity",
      "stroke-opacity": "strokeOpacity",
      suppresscontenteditablewarning: "suppressContentEditableWarning",
      suppresshydrationwarning: "suppressHydrationWarning",
      surfacescale: "surfaceScale",
      systemlanguage: "systemLanguage",
      tablevalues: "tableValues",
      targetx: "targetX",
      targety: "targetY",
      textanchor: "textAnchor",
      "text-anchor": "textAnchor",
      textdecoration: "textDecoration",
      "text-decoration": "textDecoration",
      textlength: "textLength",
      textrendering: "textRendering",
      "text-rendering": "textRendering",
      to: "to",
      transform: "transform",
      typeof: "typeof",
      u1: "u1",
      u2: "u2",
      underlineposition: "underlinePosition",
      "underline-position": "underlinePosition",
      underlinethickness: "underlineThickness",
      "underline-thickness": "underlineThickness",
      unicode: "unicode",
      unicodebidi: "unicodeBidi",
      "unicode-bidi": "unicodeBidi",
      unicoderange: "unicodeRange",
      "unicode-range": "unicodeRange",
      unitsperem: "unitsPerEm",
      "units-per-em": "unitsPerEm",
      unselectable: "unselectable",
      valphabetic: "vAlphabetic",
      "v-alphabetic": "vAlphabetic",
      values: "values",
      vectoreffect: "vectorEffect",
      "vector-effect": "vectorEffect",
      version: "version",
      vertadvy: "vertAdvY",
      "vert-adv-y": "vertAdvY",
      vertoriginx: "vertOriginX",
      "vert-origin-x": "vertOriginX",
      vertoriginy: "vertOriginY",
      "vert-origin-y": "vertOriginY",
      vhanging: "vHanging",
      "v-hanging": "vHanging",
      videographic: "vIdeographic",
      "v-ideographic": "vIdeographic",
      viewbox: "viewBox",
      viewtarget: "viewTarget",
      visibility: "visibility",
      vmathematical: "vMathematical",
      "v-mathematical": "vMathematical",
      vocab: "vocab",
      widths: "widths",
      wordspacing: "wordSpacing",
      "word-spacing": "wordSpacing",
      writingmode: "writingMode",
      "writing-mode": "writingMode",
      x1: "x1",
      x2: "x2",
      x: "x",
      xchannelselector: "xChannelSelector",
      xheight: "xHeight",
      "x-height": "xHeight",
      xlinkactuate: "xlinkActuate",
      "xlink:actuate": "xlinkActuate",
      xlinkarcrole: "xlinkArcrole",
      "xlink:arcrole": "xlinkArcrole",
      xlinkhref: "xlinkHref",
      "xlink:href": "xlinkHref",
      xlinkrole: "xlinkRole",
      "xlink:role": "xlinkRole",
      xlinkshow: "xlinkShow",
      "xlink:show": "xlinkShow",
      xlinktitle: "xlinkTitle",
      "xlink:title": "xlinkTitle",
      xlinktype: "xlinkType",
      "xlink:type": "xlinkType",
      xmlbase: "xmlBase",
      "xml:base": "xmlBase",
      xmllang: "xmlLang",
      "xml:lang": "xmlLang",
      xmlns: "xmlns",
      "xml:space": "xmlSpace",
      xmlnsxlink: "xmlnsXlink",
      "xmlns:xlink": "xmlnsXlink",
      xmlspace: "xmlSpace",
      y1: "y1",
      y2: "y2",
      y: "y",
      ychannelselector: "yChannelSelector",
      z: "z",
      zoomandpan: "zoomAndPan"
    }, bs = {
      "aria-current": 0,
      // state
      "aria-description": 0,
      "aria-details": 0,
      "aria-disabled": 0,
      // state
      "aria-hidden": 0,
      // state
      "aria-invalid": 0,
      // state
      "aria-keyshortcuts": 0,
      "aria-label": 0,
      "aria-roledescription": 0,
      // Widget Attributes
      "aria-autocomplete": 0,
      "aria-checked": 0,
      "aria-expanded": 0,
      "aria-haspopup": 0,
      "aria-level": 0,
      "aria-modal": 0,
      "aria-multiline": 0,
      "aria-multiselectable": 0,
      "aria-orientation": 0,
      "aria-placeholder": 0,
      "aria-pressed": 0,
      "aria-readonly": 0,
      "aria-required": 0,
      "aria-selected": 0,
      "aria-sort": 0,
      "aria-valuemax": 0,
      "aria-valuemin": 0,
      "aria-valuenow": 0,
      "aria-valuetext": 0,
      // Live Region Attributes
      "aria-atomic": 0,
      "aria-busy": 0,
      "aria-live": 0,
      "aria-relevant": 0,
      // Drag-and-Drop Attributes
      "aria-dropeffect": 0,
      "aria-grabbed": 0,
      // Relationship Attributes
      "aria-activedescendant": 0,
      "aria-colcount": 0,
      "aria-colindex": 0,
      "aria-colspan": 0,
      "aria-controls": 0,
      "aria-describedby": 0,
      "aria-errormessage": 0,
      "aria-flowto": 0,
      "aria-labelledby": 0,
      "aria-owns": 0,
      "aria-posinset": 0,
      "aria-rowcount": 0,
      "aria-rowindex": 0,
      "aria-rowspan": 0,
      "aria-setsize": 0
    }, ru = {}, ry = new RegExp("^(aria)-[" + I + "]*$"), au = new RegExp("^(aria)[A-Z][" + I + "]*$");
    function Vf(e, t) {
      {
        if (ca.call(ru, t) && ru[t])
          return !0;
        if (au.test(t)) {
          var a = "aria-" + t.slice(4).toLowerCase(), i = bs.hasOwnProperty(a) ? a : null;
          if (i == null)
            return g("Invalid ARIA attribute `%s`. ARIA attributes follow the pattern aria-* and must be lowercase.", t), ru[t] = !0, !0;
          if (t !== i)
            return g("Invalid ARIA attribute `%s`. Did you mean `%s`?", t, i), ru[t] = !0, !0;
        }
        if (ry.test(t)) {
          var u = t.toLowerCase(), s = bs.hasOwnProperty(u) ? u : null;
          if (s == null)
            return ru[t] = !0, !1;
          if (t !== s)
            return g("Unknown ARIA attribute `%s`. Did you mean `%s`?", t, s), ru[t] = !0, !0;
        }
      }
      return !0;
    }
    function io(e, t) {
      {
        var a = [];
        for (var i in t) {
          var u = Vf(e, i);
          u || a.push(i);
        }
        var s = a.map(function(f) {
          return "`" + f + "`";
        }).join(", ");
        a.length === 1 ? g("Invalid aria prop %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", s, e) : a.length > 1 && g("Invalid aria props %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", s, e);
      }
    }
    function Bf(e, t) {
      pi(e, t) || io(e, t);
    }
    var Pf = !1;
    function _s(e, t) {
      {
        if (e !== "input" && e !== "textarea" && e !== "select")
          return;
        t != null && t.value === null && !Pf && (Pf = !0, e === "select" && t.multiple ? g("`value` prop on `%s` should not be null. Consider using an empty array when `multiple` is set to `true` to clear the component or `undefined` for uncontrolled components.", e) : g("`value` prop on `%s` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.", e));
      }
    }
    var al = function() {
    };
    {
      var ln = {}, Yf = /^on./, Ls = /^on[^A-Z]/, cv = new RegExp("^(aria)-[" + I + "]*$"), fv = new RegExp("^(aria)[A-Z][" + I + "]*$");
      al = function(e, t, a, i) {
        if (ca.call(ln, t) && ln[t])
          return !0;
        var u = t.toLowerCase();
        if (u === "onfocusin" || u === "onfocusout")
          return g("React uses onFocus and onBlur instead of onFocusIn and onFocusOut. All React events are normalized to bubble, so onFocusIn and onFocusOut are not needed/supported by React."), ln[t] = !0, !0;
        if (i != null) {
          var s = i.registrationNameDependencies, f = i.possibleRegistrationNames;
          if (s.hasOwnProperty(t))
            return !0;
          var p = f.hasOwnProperty(u) ? f[u] : null;
          if (p != null)
            return g("Invalid event handler property `%s`. Did you mean `%s`?", t, p), ln[t] = !0, !0;
          if (Yf.test(t))
            return g("Unknown event handler property `%s`. It will be ignored.", t), ln[t] = !0, !0;
        } else if (Yf.test(t))
          return Ls.test(t) && g("Invalid event handler property `%s`. React events use the camelCase naming convention, for example `onClick`.", t), ln[t] = !0, !0;
        if (cv.test(t) || fv.test(t))
          return !0;
        if (u === "innerhtml")
          return g("Directly setting property `innerHTML` is not permitted. For more information, lookup documentation on `dangerouslySetInnerHTML`."), ln[t] = !0, !0;
        if (u === "aria")
          return g("The `aria` attribute is reserved for future use in React. Pass individual `aria-` attributes instead."), ln[t] = !0, !0;
        if (u === "is" && a !== null && a !== void 0 && typeof a != "string")
          return g("Received a `%s` for a string attribute `is`. If this is expected, cast the value to a string.", typeof a), ln[t] = !0, !0;
        if (typeof a == "number" && isNaN(a))
          return g("Received NaN for the `%s` attribute. If this is expected, cast the value to a string.", t), ln[t] = !0, !0;
        var v = Ut(t), m = v !== null && v.type === kr;
        if (ao.hasOwnProperty(u)) {
          var y = ao[u];
          if (y !== t)
            return g("Invalid DOM property `%s`. Did you mean `%s`?", t, y), ln[t] = !0, !0;
        } else if (!m && t !== u)
          return g("React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.", t, u), ln[t] = !0, !0;
        return typeof a == "boolean" && zt(t, a, v, !1) ? (a ? g('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.', a, t, t, a, t) : g('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.', a, t, t, a, t, t, t), ln[t] = !0, !0) : m ? !0 : zt(t, a, v, !1) ? (ln[t] = !0, !1) : ((a === "false" || a === "true") && v !== null && v.type === pr && (g("Received the string `%s` for the boolean attribute `%s`. %s Did you mean %s={%s}?", a, t, a === "false" ? "The browser will interpret it as a truthy value." : 'Although this works, it will not work as expected if you pass the string "false".', t, a), ln[t] = !0), !0);
      };
    }
    var dv = function(e, t, a) {
      {
        var i = [];
        for (var u in t) {
          var s = al(e, u, t[u], a);
          s || i.push(u);
        }
        var f = i.map(function(p) {
          return "`" + p + "`";
        }).join(", ");
        i.length === 1 ? g("Invalid value for prop %s on <%s> tag. Either remove it from the element, or pass a string or number value to keep it in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", f, e) : i.length > 1 && g("Invalid values for props %s on <%s> tag. Either remove them from the element, or pass a string or number value to keep them in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", f, e);
      }
    };
    function pv(e, t, a) {
      pi(e, t) || dv(e, t, a);
    }
    var Qf = 1, Os = 2, Or = 4, If = Qf | Os | Or, il = null;
    function ay(e) {
      il !== null && g("Expected currently replaying event to be null. This error is likely caused by a bug in React. Please file an issue."), il = e;
    }
    function iy() {
      il === null && g("Expected currently replaying event to not be null. This error is likely caused by a bug in React. Please file an issue."), il = null;
    }
    function lo(e) {
      return e === il;
    }
    function $f(e) {
      var t = e.target || e.srcElement || window;
      return t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === Ha ? t.parentNode : t;
    }
    var Ms = null, ll = null, Xe = null;
    function Ns(e) {
      var t = wu(e);
      if (t) {
        if (typeof Ms != "function")
          throw new Error("setRestoreImplementation() needs to be called to handle a target for controlled events. This error is likely caused by a bug in React. Please file an issue.");
        var a = t.stateNode;
        if (a) {
          var i = Th(a);
          Ms(t.stateNode, t.type, i);
        }
      }
    }
    function zs(e) {
      Ms = e;
    }
    function iu(e) {
      ll ? Xe ? Xe.push(e) : Xe = [e] : ll = e;
    }
    function vv() {
      return ll !== null || Xe !== null;
    }
    function Us() {
      if (ll) {
        var e = ll, t = Xe;
        if (ll = null, Xe = null, Ns(e), t)
          for (var a = 0; a < t.length; a++)
            Ns(t[a]);
      }
    }
    var lu = function(e, t) {
      return e(t);
    }, uo = function() {
    }, vi = !1;
    function hv() {
      var e = vv();
      e && (uo(), Us());
    }
    function mv(e, t, a) {
      if (vi)
        return e(t, a);
      vi = !0;
      try {
        return lu(e, t, a);
      } finally {
        vi = !1, hv();
      }
    }
    function ly(e, t, a) {
      lu = e, uo = a;
    }
    function yv(e) {
      return e === "button" || e === "input" || e === "select" || e === "textarea";
    }
    function As(e, t, a) {
      switch (e) {
        case "onClick":
        case "onClickCapture":
        case "onDoubleClick":
        case "onDoubleClickCapture":
        case "onMouseDown":
        case "onMouseDownCapture":
        case "onMouseMove":
        case "onMouseMoveCapture":
        case "onMouseUp":
        case "onMouseUpCapture":
        case "onMouseEnter":
          return !!(a.disabled && yv(t));
        default:
          return !1;
      }
    }
    function hi(e, t) {
      var a = e.stateNode;
      if (a === null)
        return null;
      var i = Th(a);
      if (i === null)
        return null;
      var u = i[t];
      if (As(t, e.type, i))
        return null;
      if (u && typeof u != "function")
        throw new Error("Expected `" + t + "` listener to be a function, instead got a value of `" + typeof u + "` type.");
      return u;
    }
    var oo = !1;
    if (Sn)
      try {
        var ul = {};
        Object.defineProperty(ul, "passive", {
          get: function() {
            oo = !0;
          }
        }), window.addEventListener("test", ul, ul), window.removeEventListener("test", ul, ul);
      } catch {
        oo = !1;
      }
    function Hs(e, t, a, i, u, s, f, p, v) {
      var m = Array.prototype.slice.call(arguments, 3);
      try {
        t.apply(a, m);
      } catch (y) {
        this.onError(y);
      }
    }
    var Fs = Hs;
    if (typeof window < "u" && typeof window.dispatchEvent == "function" && typeof document < "u" && typeof document.createEvent == "function") {
      var Gf = document.createElement("react");
      Fs = function(t, a, i, u, s, f, p, v, m) {
        if (typeof document > "u" || document === null)
          throw new Error("The `document` global was defined when React was initialized, but is not defined anymore. This can happen in a test environment if a component schedules an update from an asynchronous callback, but the test has already finished running. To solve this, you can either unmount the component at the end of your test (and ensure that any asynchronous operations get canceled in `componentWillUnmount`), or you can change the test itself to be asynchronous.");
        var y = document.createEvent("Event"), R = !1, C = !0, _ = window.event, O = Object.getOwnPropertyDescriptor(window, "event");
        function M() {
          Gf.removeEventListener(N, fe, !1), typeof window.event < "u" && window.hasOwnProperty("event") && (window.event = _);
        }
        var W = Array.prototype.slice.call(arguments, 3);
        function fe() {
          R = !0, M(), a.apply(i, W), C = !1;
        }
        var ue, Ve = !1, ze = !1;
        function D(k) {
          if (ue = k.error, Ve = !0, ue === null && k.colno === 0 && k.lineno === 0 && (ze = !0), k.defaultPrevented && ue != null && typeof ue == "object")
            try {
              ue._suppressLogging = !0;
            } catch {
            }
        }
        var N = "react-" + (t || "invokeguardedcallback");
        if (window.addEventListener("error", D), Gf.addEventListener(N, fe, !1), y.initEvent(N, !1, !1), Gf.dispatchEvent(y), O && Object.defineProperty(window, "event", O), R && C && (Ve ? ze && (ue = new Error("A cross-origin error was thrown. React doesn't have access to the actual error object in development. See https://reactjs.org/link/crossorigin-error for more information.")) : ue = new Error(`An error was thrown inside one of your components, but React doesn't know what it was. This is likely due to browser flakiness. React does its best to preserve the "Pause on exceptions" behavior of the DevTools, which requires some DEV-mode only tricks. It's possible that these don't work in your browser. Try triggering the error in production mode, or switching to a modern browser. If you suspect that this is actually an issue with React, please file an issue.`), this.onError(ue)), window.removeEventListener("error", D), !R)
          return M(), Hs.apply(this, arguments);
      };
    }
    var gv = Fs, uu = !1, js = null, ou = !1, va = null, Sv = {
      onError: function(e) {
        uu = !0, js = e;
      }
    };
    function mi(e, t, a, i, u, s, f, p, v) {
      uu = !1, js = null, gv.apply(Sv, arguments);
    }
    function ha(e, t, a, i, u, s, f, p, v) {
      if (mi.apply(this, arguments), uu) {
        var m = co();
        ou || (ou = !0, va = m);
      }
    }
    function so() {
      if (ou) {
        var e = va;
        throw ou = !1, va = null, e;
      }
    }
    function ja() {
      return uu;
    }
    function co() {
      if (uu) {
        var e = js;
        return uu = !1, js = null, e;
      } else
        throw new Error("clearCaughtError was called but no error was captured. This error is likely caused by a bug in React. Please file an issue.");
    }
    function su(e) {
      return e._reactInternals;
    }
    function uy(e) {
      return e._reactInternals !== void 0;
    }
    function ol(e, t) {
      e._reactInternals = t;
    }
    var se = (
      /*                      */
      0
    ), ta = (
      /*                */
      1
    ), yt = (
      /*                    */
      2
    ), He = (
      /*                       */
      4
    ), Mr = (
      /*                */
      16
    ), Nr = (
      /*                 */
      32
    ), ct = (
      /*                     */
      64
    ), oe = (
      /*                   */
      128
    ), Cn = (
      /*            */
      256
    ), wt = (
      /*                          */
      512
    ), Gt = (
      /*                     */
      1024
    ), qn = (
      /*                      */
      2048
    ), Kn = (
      /*                    */
      4096
    ), Ht = (
      /*                   */
      8192
    ), cu = (
      /*             */
      16384
    ), Ev = (
      /*               */
      32767
    ), fo = (
      /*                   */
      32768
    ), Zt = (
      /*                */
      65536
    ), Vs = (
      /* */
      131072
    ), ma = (
      /*                       */
      1048576
    ), fu = (
      /*                    */
      2097152
    ), Va = (
      /*                 */
      4194304
    ), Bs = (
      /*                */
      8388608
    ), yi = (
      /*               */
      16777216
    ), ya = (
      /*              */
      33554432
    ), gi = (
      // TODO: Remove Update flag from before mutation phase by re-landing Visibility
      // flag logic (see #20043)
      He | Gt | 0
    ), Si = yt | He | Mr | Nr | wt | Kn | Ht, Ei = He | ct | wt | Ht, Ba = qn | Mr, Ft = Va | Bs | fu, zr = x.ReactCurrentOwner;
    function vr(e) {
      var t = e, a = e;
      if (e.alternate)
        for (; t.return; )
          t = t.return;
      else {
        var i = t;
        do
          t = i, (t.flags & (yt | Kn)) !== se && (a = t.return), i = t.return;
        while (i);
      }
      return t.tag === P ? a : null;
    }
    function ga(e) {
      if (e.tag === _e) {
        var t = e.memoizedState;
        if (t === null) {
          var a = e.alternate;
          a !== null && (t = a.memoizedState);
        }
        if (t !== null)
          return t.dehydrated;
      }
      return null;
    }
    function Sa(e) {
      return e.tag === P ? e.stateNode.containerInfo : null;
    }
    function sl(e) {
      return vr(e) === e;
    }
    function Cv(e) {
      {
        var t = zr.current;
        if (t !== null && t.tag === le) {
          var a = t, i = a.stateNode;
          i._warnedAboutRefsInRender || g("%s is accessing isMounted inside its render() function. render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", Re(a) || "A component"), i._warnedAboutRefsInRender = !0;
        }
      }
      var u = su(e);
      return u ? vr(u) === u : !1;
    }
    function Ps(e) {
      if (vr(e) !== e)
        throw new Error("Unable to find node on an unmounted component.");
    }
    function Ys(e) {
      var t = e.alternate;
      if (!t) {
        var a = vr(e);
        if (a === null)
          throw new Error("Unable to find node on an unmounted component.");
        return a !== e ? null : e;
      }
      for (var i = e, u = t; ; ) {
        var s = i.return;
        if (s === null)
          break;
        var f = s.alternate;
        if (f === null) {
          var p = s.return;
          if (p !== null) {
            i = u = p;
            continue;
          }
          break;
        }
        if (s.child === f.child) {
          for (var v = s.child; v; ) {
            if (v === i)
              return Ps(s), e;
            if (v === u)
              return Ps(s), t;
            v = v.sibling;
          }
          throw new Error("Unable to find node on an unmounted component.");
        }
        if (i.return !== u.return)
          i = s, u = f;
        else {
          for (var m = !1, y = s.child; y; ) {
            if (y === i) {
              m = !0, i = s, u = f;
              break;
            }
            if (y === u) {
              m = !0, u = s, i = f;
              break;
            }
            y = y.sibling;
          }
          if (!m) {
            for (y = f.child; y; ) {
              if (y === i) {
                m = !0, i = f, u = s;
                break;
              }
              if (y === u) {
                m = !0, u = f, i = s;
                break;
              }
              y = y.sibling;
            }
            if (!m)
              throw new Error("Child was not found in either parent set. This indicates a bug in React related to the return pointer. Please file an issue.");
          }
        }
        if (i.alternate !== u)
          throw new Error("Return fibers should always be each others' alternates. This error is likely caused by a bug in React. Please file an issue.");
      }
      if (i.tag !== P)
        throw new Error("Unable to find node on an unmounted component.");
      return i.stateNode.current === i ? e : t;
    }
    function Zn(e) {
      var t = Ys(e);
      return t !== null ? Jn(t) : null;
    }
    function Jn(e) {
      if (e.tag === J || e.tag === Oe)
        return e;
      for (var t = e.child; t !== null; ) {
        var a = Jn(t);
        if (a !== null)
          return a;
        t = t.sibling;
      }
      return null;
    }
    function vt(e) {
      var t = Ys(e);
      return t !== null ? Ur(t) : null;
    }
    function Ur(e) {
      if (e.tag === J || e.tag === Oe)
        return e;
      for (var t = e.child; t !== null; ) {
        if (t.tag !== me) {
          var a = Ur(t);
          if (a !== null)
            return a;
        }
        t = t.sibling;
      }
      return null;
    }
    var Wf = $.unstable_scheduleCallback, Tv = $.unstable_cancelCallback, Xf = $.unstable_shouldYield, qf = $.unstable_requestPaint, Wt = $.unstable_now, Qs = $.unstable_getCurrentPriorityLevel, po = $.unstable_ImmediatePriority, Ci = $.unstable_UserBlockingPriority, Pa = $.unstable_NormalPriority, oy = $.unstable_LowPriority, cl = $.unstable_IdlePriority, Is = $.unstable_yieldValue, Rv = $.unstable_setDisableYieldValue, fl = null, kt = null, G = null, hr = !1, er = typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u";
    function du(e) {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u")
        return !1;
      var t = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (t.isDisabled)
        return !0;
      if (!t.supportsFiber)
        return g("The installed version of React DevTools is too old and will not work with the current version of React. Please update React DevTools. https://reactjs.org/link/react-devtools"), !0;
      try {
        Wr && (e = Ae({}, e, {
          getLaneLabelMap: dl,
          injectProfilingHooks: Ar
        })), fl = t.inject(e), kt = t;
      } catch (a) {
        g("React instrumentation encountered an error: %s.", a);
      }
      return !!t.checkDCE;
    }
    function Kf(e, t) {
      if (kt && typeof kt.onScheduleFiberRoot == "function")
        try {
          kt.onScheduleFiberRoot(fl, e, t);
        } catch (a) {
          hr || (hr = !0, g("React instrumentation encountered an error: %s", a));
        }
    }
    function Zf(e, t) {
      if (kt && typeof kt.onCommitFiberRoot == "function")
        try {
          var a = (e.current.flags & oe) === oe;
          if (kn) {
            var i;
            switch (t) {
              case _n:
                i = po;
                break;
              case Ca:
                i = Ci;
                break;
              case Hr:
                i = Pa;
                break;
              case Fr:
                i = cl;
                break;
              default:
                i = Pa;
                break;
            }
            kt.onCommitFiberRoot(fl, e, i, a);
          }
        } catch (u) {
          hr || (hr = !0, g("React instrumentation encountered an error: %s", u));
        }
    }
    function Jf(e) {
      if (kt && typeof kt.onPostCommitFiberRoot == "function")
        try {
          kt.onPostCommitFiberRoot(fl, e);
        } catch (t) {
          hr || (hr = !0, g("React instrumentation encountered an error: %s", t));
        }
    }
    function ed(e) {
      if (kt && typeof kt.onCommitFiberUnmount == "function")
        try {
          kt.onCommitFiberUnmount(fl, e);
        } catch (t) {
          hr || (hr = !0, g("React instrumentation encountered an error: %s", t));
        }
    }
    function gt(e) {
      if (typeof Is == "function" && (Rv(e), we(e)), kt && typeof kt.setStrictMode == "function")
        try {
          kt.setStrictMode(fl, e);
        } catch (t) {
          hr || (hr = !0, g("React instrumentation encountered an error: %s", t));
        }
    }
    function Ar(e) {
      G = e;
    }
    function dl() {
      {
        for (var e = /* @__PURE__ */ new Map(), t = 1, a = 0; a < hl; a++) {
          var i = kv(t);
          e.set(t, i), t *= 2;
        }
        return e;
      }
    }
    function td(e) {
      G !== null && typeof G.markCommitStarted == "function" && G.markCommitStarted(e);
    }
    function nd() {
      G !== null && typeof G.markCommitStopped == "function" && G.markCommitStopped();
    }
    function mr(e) {
      G !== null && typeof G.markComponentRenderStarted == "function" && G.markComponentRenderStarted(e);
    }
    function yr() {
      G !== null && typeof G.markComponentRenderStopped == "function" && G.markComponentRenderStopped();
    }
    function rd(e) {
      G !== null && typeof G.markComponentPassiveEffectMountStarted == "function" && G.markComponentPassiveEffectMountStarted(e);
    }
    function xv() {
      G !== null && typeof G.markComponentPassiveEffectMountStopped == "function" && G.markComponentPassiveEffectMountStopped();
    }
    function Ya(e) {
      G !== null && typeof G.markComponentPassiveEffectUnmountStarted == "function" && G.markComponentPassiveEffectUnmountStarted(e);
    }
    function Ti() {
      G !== null && typeof G.markComponentPassiveEffectUnmountStopped == "function" && G.markComponentPassiveEffectUnmountStopped();
    }
    function $s(e) {
      G !== null && typeof G.markComponentLayoutEffectMountStarted == "function" && G.markComponentLayoutEffectMountStarted(e);
    }
    function wv() {
      G !== null && typeof G.markComponentLayoutEffectMountStopped == "function" && G.markComponentLayoutEffectMountStopped();
    }
    function vo(e) {
      G !== null && typeof G.markComponentLayoutEffectUnmountStarted == "function" && G.markComponentLayoutEffectUnmountStarted(e);
    }
    function ad() {
      G !== null && typeof G.markComponentLayoutEffectUnmountStopped == "function" && G.markComponentLayoutEffectUnmountStopped();
    }
    function ho(e, t, a) {
      G !== null && typeof G.markComponentErrored == "function" && G.markComponentErrored(e, t, a);
    }
    function Ea(e, t, a) {
      G !== null && typeof G.markComponentSuspended == "function" && G.markComponentSuspended(e, t, a);
    }
    function mo(e) {
      G !== null && typeof G.markLayoutEffectsStarted == "function" && G.markLayoutEffectsStarted(e);
    }
    function yo() {
      G !== null && typeof G.markLayoutEffectsStopped == "function" && G.markLayoutEffectsStopped();
    }
    function pl(e) {
      G !== null && typeof G.markPassiveEffectsStarted == "function" && G.markPassiveEffectsStarted(e);
    }
    function id() {
      G !== null && typeof G.markPassiveEffectsStopped == "function" && G.markPassiveEffectsStopped();
    }
    function vl(e) {
      G !== null && typeof G.markRenderStarted == "function" && G.markRenderStarted(e);
    }
    function Dv() {
      G !== null && typeof G.markRenderYielded == "function" && G.markRenderYielded();
    }
    function Gs() {
      G !== null && typeof G.markRenderStopped == "function" && G.markRenderStopped();
    }
    function St(e) {
      G !== null && typeof G.markRenderScheduled == "function" && G.markRenderScheduled(e);
    }
    function Ws(e, t) {
      G !== null && typeof G.markForceUpdateScheduled == "function" && G.markForceUpdateScheduled(e, t);
    }
    function go(e, t) {
      G !== null && typeof G.markStateUpdateScheduled == "function" && G.markStateUpdateScheduled(e, t);
    }
    var ce = (
      /*                         */
      0
    ), ke = (
      /*                 */
      1
    ), Pe = (
      /*                    */
      2
    ), nt = (
      /*               */
      8
    ), Ye = (
      /*              */
      16
    ), jt = Math.clz32 ? Math.clz32 : So, Jt = Math.log, Xs = Math.LN2;
    function So(e) {
      var t = e >>> 0;
      return t === 0 ? 32 : 31 - (Jt(t) / Xs | 0) | 0;
    }
    var hl = 31, A = (
      /*                        */
      0
    ), Be = (
      /*                          */
      0
    ), ye = (
      /*                        */
      1
    ), Ri = (
      /*    */
      2
    ), na = (
      /*             */
      4
    ), Tn = (
      /*            */
      8
    ), bt = (
      /*                     */
      16
    ), Qa = (
      /*                */
      32
    ), xi = (
      /*                       */
      4194240
    ), ml = (
      /*                        */
      64
    ), qs = (
      /*                        */
      128
    ), Ks = (
      /*                        */
      256
    ), Zs = (
      /*                        */
      512
    ), Js = (
      /*                        */
      1024
    ), ec = (
      /*                        */
      2048
    ), tc = (
      /*                        */
      4096
    ), nc = (
      /*                        */
      8192
    ), rc = (
      /*                        */
      16384
    ), yl = (
      /*                       */
      32768
    ), ac = (
      /*                       */
      65536
    ), pu = (
      /*                       */
      131072
    ), vu = (
      /*                       */
      262144
    ), ic = (
      /*                       */
      524288
    ), Eo = (
      /*                       */
      1048576
    ), lc = (
      /*                       */
      2097152
    ), Co = (
      /*                            */
      130023424
    ), gl = (
      /*                             */
      4194304
    ), uc = (
      /*                             */
      8388608
    ), To = (
      /*                             */
      16777216
    ), oc = (
      /*                             */
      33554432
    ), sc = (
      /*                             */
      67108864
    ), ld = gl, Ro = (
      /*          */
      134217728
    ), ud = (
      /*                          */
      268435455
    ), xo = (
      /*               */
      268435456
    ), Sl = (
      /*                        */
      536870912
    ), tr = (
      /*                   */
      1073741824
    );
    function kv(e) {
      {
        if (e & ye)
          return "Sync";
        if (e & Ri)
          return "InputContinuousHydration";
        if (e & na)
          return "InputContinuous";
        if (e & Tn)
          return "DefaultHydration";
        if (e & bt)
          return "Default";
        if (e & Qa)
          return "TransitionHydration";
        if (e & xi)
          return "Transition";
        if (e & Co)
          return "Retry";
        if (e & Ro)
          return "SelectiveHydration";
        if (e & xo)
          return "IdleHydration";
        if (e & Sl)
          return "Idle";
        if (e & tr)
          return "Offscreen";
      }
    }
    var st = -1, El = ml, cc = gl;
    function wo(e) {
      switch (wi(e)) {
        case ye:
          return ye;
        case Ri:
          return Ri;
        case na:
          return na;
        case Tn:
          return Tn;
        case bt:
          return bt;
        case Qa:
          return Qa;
        case ml:
        case qs:
        case Ks:
        case Zs:
        case Js:
        case ec:
        case tc:
        case nc:
        case rc:
        case yl:
        case ac:
        case pu:
        case vu:
        case ic:
        case Eo:
        case lc:
          return e & xi;
        case gl:
        case uc:
        case To:
        case oc:
        case sc:
          return e & Co;
        case Ro:
          return Ro;
        case xo:
          return xo;
        case Sl:
          return Sl;
        case tr:
          return tr;
        default:
          return g("Should have found matching lanes. This is a bug in React."), e;
      }
    }
    function fc(e, t) {
      var a = e.pendingLanes;
      if (a === A)
        return A;
      var i = A, u = e.suspendedLanes, s = e.pingedLanes, f = a & ud;
      if (f !== A) {
        var p = f & ~u;
        if (p !== A)
          i = wo(p);
        else {
          var v = f & s;
          v !== A && (i = wo(v));
        }
      } else {
        var m = a & ~u;
        m !== A ? i = wo(m) : s !== A && (i = wo(s));
      }
      if (i === A)
        return A;
      if (t !== A && t !== i && // If we already suspended with a delay, then interrupting is fine. Don't
      // bother waiting until the root is complete.
      (t & u) === A) {
        var y = wi(i), R = wi(t);
        if (
          // Tests whether the next lane is equal or lower priority than the wip
          // one. This works because the bits decrease in priority as you go left.
          y >= R || // Default priority updates should not interrupt transition updates. The
          // only difference between default updates and transition updates is that
          // default updates do not support refresh transitions.
          y === bt && (R & xi) !== A
        )
          return t;
      }
      (i & na) !== A && (i |= a & bt);
      var C = e.entangledLanes;
      if (C !== A)
        for (var _ = e.entanglements, O = i & C; O > 0; ) {
          var M = Vt(O), W = 1 << M;
          i |= _[M], O &= ~W;
        }
      return i;
    }
    function ra(e, t) {
      for (var a = e.eventTimes, i = st; t > 0; ) {
        var u = Vt(t), s = 1 << u, f = a[u];
        f > i && (i = f), t &= ~s;
      }
      return i;
    }
    function od(e, t) {
      switch (e) {
        case ye:
        case Ri:
        case na:
          return t + 250;
        case Tn:
        case bt:
        case Qa:
        case ml:
        case qs:
        case Ks:
        case Zs:
        case Js:
        case ec:
        case tc:
        case nc:
        case rc:
        case yl:
        case ac:
        case pu:
        case vu:
        case ic:
        case Eo:
        case lc:
          return t + 5e3;
        case gl:
        case uc:
        case To:
        case oc:
        case sc:
          return st;
        case Ro:
        case xo:
        case Sl:
        case tr:
          return st;
        default:
          return g("Should have found matching lanes. This is a bug in React."), st;
      }
    }
    function dc(e, t) {
      for (var a = e.pendingLanes, i = e.suspendedLanes, u = e.pingedLanes, s = e.expirationTimes, f = a; f > 0; ) {
        var p = Vt(f), v = 1 << p, m = s[p];
        m === st ? ((v & i) === A || (v & u) !== A) && (s[p] = od(v, t)) : m <= t && (e.expiredLanes |= v), f &= ~v;
      }
    }
    function bv(e) {
      return wo(e.pendingLanes);
    }
    function pc(e) {
      var t = e.pendingLanes & ~tr;
      return t !== A ? t : t & tr ? tr : A;
    }
    function _v(e) {
      return (e & ye) !== A;
    }
    function Do(e) {
      return (e & ud) !== A;
    }
    function Cl(e) {
      return (e & Co) === e;
    }
    function sd(e) {
      var t = ye | na | bt;
      return (e & t) === A;
    }
    function cd(e) {
      return (e & xi) === e;
    }
    function vc(e, t) {
      var a = Ri | na | Tn | bt;
      return (t & a) !== A;
    }
    function Lv(e, t) {
      return (t & e.expiredLanes) !== A;
    }
    function fd(e) {
      return (e & xi) !== A;
    }
    function dd() {
      var e = El;
      return El <<= 1, (El & xi) === A && (El = ml), e;
    }
    function Ov() {
      var e = cc;
      return cc <<= 1, (cc & Co) === A && (cc = gl), e;
    }
    function wi(e) {
      return e & -e;
    }
    function ko(e) {
      return wi(e);
    }
    function Vt(e) {
      return 31 - jt(e);
    }
    function un(e) {
      return Vt(e);
    }
    function nr(e, t) {
      return (e & t) !== A;
    }
    function Tl(e, t) {
      return (e & t) === t;
    }
    function xe(e, t) {
      return e | t;
    }
    function bo(e, t) {
      return e & ~t;
    }
    function pd(e, t) {
      return e & t;
    }
    function Mv(e) {
      return e;
    }
    function Nv(e, t) {
      return e !== Be && e < t ? e : t;
    }
    function _o(e) {
      for (var t = [], a = 0; a < hl; a++)
        t.push(e);
      return t;
    }
    function hu(e, t, a) {
      e.pendingLanes |= t, t !== Sl && (e.suspendedLanes = A, e.pingedLanes = A);
      var i = e.eventTimes, u = un(t);
      i[u] = a;
    }
    function zv(e, t) {
      e.suspendedLanes |= t, e.pingedLanes &= ~t;
      for (var a = e.expirationTimes, i = t; i > 0; ) {
        var u = Vt(i), s = 1 << u;
        a[u] = st, i &= ~s;
      }
    }
    function hc(e, t, a) {
      e.pingedLanes |= e.suspendedLanes & t;
    }
    function vd(e, t) {
      var a = e.pendingLanes & ~t;
      e.pendingLanes = t, e.suspendedLanes = A, e.pingedLanes = A, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t;
      for (var i = e.entanglements, u = e.eventTimes, s = e.expirationTimes, f = a; f > 0; ) {
        var p = Vt(f), v = 1 << p;
        i[p] = A, u[p] = st, s[p] = st, f &= ~v;
      }
    }
    function mc(e, t) {
      for (var a = e.entangledLanes |= t, i = e.entanglements, u = a; u; ) {
        var s = Vt(u), f = 1 << s;
        // Is this one of the newly entangled lanes?
        f & t | // Is this lane transitively entangled with the newly entangled lanes?
        i[s] & t && (i[s] |= t), u &= ~f;
      }
    }
    function hd(e, t) {
      var a = wi(t), i;
      switch (a) {
        case na:
          i = Ri;
          break;
        case bt:
          i = Tn;
          break;
        case ml:
        case qs:
        case Ks:
        case Zs:
        case Js:
        case ec:
        case tc:
        case nc:
        case rc:
        case yl:
        case ac:
        case pu:
        case vu:
        case ic:
        case Eo:
        case lc:
        case gl:
        case uc:
        case To:
        case oc:
        case sc:
          i = Qa;
          break;
        case Sl:
          i = xo;
          break;
        default:
          i = Be;
          break;
      }
      return (i & (e.suspendedLanes | t)) !== Be ? Be : i;
    }
    function Lo(e, t, a) {
      if (er)
        for (var i = e.pendingUpdatersLaneMap; a > 0; ) {
          var u = un(a), s = 1 << u, f = i[u];
          f.add(t), a &= ~s;
        }
    }
    function Uv(e, t) {
      if (er)
        for (var a = e.pendingUpdatersLaneMap, i = e.memoizedUpdaters; t > 0; ) {
          var u = un(t), s = 1 << u, f = a[u];
          f.size > 0 && (f.forEach(function(p) {
            var v = p.alternate;
            (v === null || !i.has(v)) && i.add(p);
          }), f.clear()), t &= ~s;
        }
    }
    function md(e, t) {
      return null;
    }
    var _n = ye, Ca = na, Hr = bt, Fr = Sl, Oo = Be;
    function jr() {
      return Oo;
    }
    function Bt(e) {
      Oo = e;
    }
    function Av(e, t) {
      var a = Oo;
      try {
        return Oo = e, t();
      } finally {
        Oo = a;
      }
    }
    function Hv(e, t) {
      return e !== 0 && e < t ? e : t;
    }
    function Mo(e, t) {
      return e > t ? e : t;
    }
    function en(e, t) {
      return e !== 0 && e < t;
    }
    function Fv(e) {
      var t = wi(e);
      return en(_n, t) ? en(Ca, t) ? Do(t) ? Hr : Fr : Ca : _n;
    }
    function yc(e) {
      var t = e.current.memoizedState;
      return t.isDehydrated;
    }
    var No;
    function Rn(e) {
      No = e;
    }
    function sy(e) {
      No(e);
    }
    var ee;
    function mu(e) {
      ee = e;
    }
    var gc;
    function jv(e) {
      gc = e;
    }
    var Vv;
    function zo(e) {
      Vv = e;
    }
    var Uo;
    function yd(e) {
      Uo = e;
    }
    var Sc = !1, Ao = [], Ia = null, Ta = null, Ra = null, _t = /* @__PURE__ */ new Map(), Ln = /* @__PURE__ */ new Map(), On = [], Bv = [
      "mousedown",
      "mouseup",
      "touchcancel",
      "touchend",
      "touchstart",
      "auxclick",
      "dblclick",
      "pointercancel",
      "pointerdown",
      "pointerup",
      "dragend",
      "dragstart",
      "drop",
      "compositionend",
      "compositionstart",
      "keydown",
      "keypress",
      "keyup",
      "input",
      "textInput",
      // Intentionally camelCase
      "copy",
      "cut",
      "paste",
      "click",
      "change",
      "contextmenu",
      "reset",
      "submit"
    ];
    function Pv(e) {
      return Bv.indexOf(e) > -1;
    }
    function aa(e, t, a, i, u) {
      return {
        blockedOn: e,
        domEventName: t,
        eventSystemFlags: a,
        nativeEvent: u,
        targetContainers: [i]
      };
    }
    function gd(e, t) {
      switch (e) {
        case "focusin":
        case "focusout":
          Ia = null;
          break;
        case "dragenter":
        case "dragleave":
          Ta = null;
          break;
        case "mouseover":
        case "mouseout":
          Ra = null;
          break;
        case "pointerover":
        case "pointerout": {
          var a = t.pointerId;
          _t.delete(a);
          break;
        }
        case "gotpointercapture":
        case "lostpointercapture": {
          var i = t.pointerId;
          Ln.delete(i);
          break;
        }
      }
    }
    function rr(e, t, a, i, u, s) {
      if (e === null || e.nativeEvent !== s) {
        var f = aa(t, a, i, u, s);
        if (t !== null) {
          var p = wu(t);
          p !== null && ee(p);
        }
        return f;
      }
      e.eventSystemFlags |= i;
      var v = e.targetContainers;
      return u !== null && v.indexOf(u) === -1 && v.push(u), e;
    }
    function cy(e, t, a, i, u) {
      switch (t) {
        case "focusin": {
          var s = u;
          return Ia = rr(Ia, e, t, a, i, s), !0;
        }
        case "dragenter": {
          var f = u;
          return Ta = rr(Ta, e, t, a, i, f), !0;
        }
        case "mouseover": {
          var p = u;
          return Ra = rr(Ra, e, t, a, i, p), !0;
        }
        case "pointerover": {
          var v = u, m = v.pointerId;
          return _t.set(m, rr(_t.get(m) || null, e, t, a, i, v)), !0;
        }
        case "gotpointercapture": {
          var y = u, R = y.pointerId;
          return Ln.set(R, rr(Ln.get(R) || null, e, t, a, i, y)), !0;
        }
      }
      return !1;
    }
    function Sd(e) {
      var t = Wo(e.target);
      if (t !== null) {
        var a = vr(t);
        if (a !== null) {
          var i = a.tag;
          if (i === _e) {
            var u = ga(a);
            if (u !== null) {
              e.blockedOn = u, Uo(e.priority, function() {
                gc(a);
              });
              return;
            }
          } else if (i === P) {
            var s = a.stateNode;
            if (yc(s)) {
              e.blockedOn = Sa(a);
              return;
            }
          }
        }
      }
      e.blockedOn = null;
    }
    function Yv(e) {
      for (var t = Vv(), a = {
        blockedOn: null,
        target: e,
        priority: t
      }, i = 0; i < On.length && en(t, On[i].priority); i++)
        ;
      On.splice(i, 0, a), i === 0 && Sd(a);
    }
    function Ho(e) {
      if (e.blockedOn !== null)
        return !1;
      for (var t = e.targetContainers; t.length > 0; ) {
        var a = t[0], i = gu(e.domEventName, e.eventSystemFlags, a, e.nativeEvent);
        if (i === null) {
          var u = e.nativeEvent, s = new u.constructor(u.type, u);
          ay(s), u.target.dispatchEvent(s), iy();
        } else {
          var f = wu(i);
          return f !== null && ee(f), e.blockedOn = i, !1;
        }
        t.shift();
      }
      return !0;
    }
    function Ed(e, t, a) {
      Ho(e) && a.delete(t);
    }
    function fy() {
      Sc = !1, Ia !== null && Ho(Ia) && (Ia = null), Ta !== null && Ho(Ta) && (Ta = null), Ra !== null && Ho(Ra) && (Ra = null), _t.forEach(Ed), Ln.forEach(Ed);
    }
    function Di(e, t) {
      e.blockedOn === t && (e.blockedOn = null, Sc || (Sc = !0, $.unstable_scheduleCallback($.unstable_NormalPriority, fy)));
    }
    function Rl(e) {
      if (Ao.length > 0) {
        Di(Ao[0], e);
        for (var t = 1; t < Ao.length; t++) {
          var a = Ao[t];
          a.blockedOn === e && (a.blockedOn = null);
        }
      }
      Ia !== null && Di(Ia, e), Ta !== null && Di(Ta, e), Ra !== null && Di(Ra, e);
      var i = function(p) {
        return Di(p, e);
      };
      _t.forEach(i), Ln.forEach(i);
      for (var u = 0; u < On.length; u++) {
        var s = On[u];
        s.blockedOn === e && (s.blockedOn = null);
      }
      for (; On.length > 0; ) {
        var f = On[0];
        if (f.blockedOn !== null)
          break;
        Sd(f), f.blockedOn === null && On.shift();
      }
    }
    var on = x.ReactCurrentBatchConfig, Fe = !0;
    function Xt(e) {
      Fe = !!e;
    }
    function Pt() {
      return Fe;
    }
    function sn(e, t, a) {
      var i = Ec(t), u;
      switch (i) {
        case _n:
          u = gr;
          break;
        case Ca:
          u = yu;
          break;
        case Hr:
        default:
          u = Lt;
          break;
      }
      return u.bind(null, t, a, e);
    }
    function gr(e, t, a, i) {
      var u = jr(), s = on.transition;
      on.transition = null;
      try {
        Bt(_n), Lt(e, t, a, i);
      } finally {
        Bt(u), on.transition = s;
      }
    }
    function yu(e, t, a, i) {
      var u = jr(), s = on.transition;
      on.transition = null;
      try {
        Bt(Ca), Lt(e, t, a, i);
      } finally {
        Bt(u), on.transition = s;
      }
    }
    function Lt(e, t, a, i) {
      Fe && Fo(e, t, a, i);
    }
    function Fo(e, t, a, i) {
      var u = gu(e, t, a, i);
      if (u === null) {
        by(e, t, i, xa, a), gd(e, i);
        return;
      }
      if (cy(u, e, t, a, i)) {
        i.stopPropagation();
        return;
      }
      if (gd(e, i), t & Or && Pv(e)) {
        for (; u !== null; ) {
          var s = wu(u);
          s !== null && sy(s);
          var f = gu(e, t, a, i);
          if (f === null && by(e, t, i, xa, a), f === u)
            break;
          u = f;
        }
        u !== null && i.stopPropagation();
        return;
      }
      by(e, t, i, null, a);
    }
    var xa = null;
    function gu(e, t, a, i) {
      xa = null;
      var u = $f(i), s = Wo(u);
      if (s !== null) {
        var f = vr(s);
        if (f === null)
          s = null;
        else {
          var p = f.tag;
          if (p === _e) {
            var v = ga(f);
            if (v !== null)
              return v;
            s = null;
          } else if (p === P) {
            var m = f.stateNode;
            if (yc(m))
              return Sa(f);
            s = null;
          } else f !== s && (s = null);
        }
      }
      return xa = s, null;
    }
    function Ec(e) {
      switch (e) {
        case "cancel":
        case "click":
        case "close":
        case "contextmenu":
        case "copy":
        case "cut":
        case "auxclick":
        case "dblclick":
        case "dragend":
        case "dragstart":
        case "drop":
        case "focusin":
        case "focusout":
        case "input":
        case "invalid":
        case "keydown":
        case "keypress":
        case "keyup":
        case "mousedown":
        case "mouseup":
        case "paste":
        case "pause":
        case "play":
        case "pointercancel":
        case "pointerdown":
        case "pointerup":
        case "ratechange":
        case "reset":
        case "resize":
        case "seeked":
        case "submit":
        case "touchcancel":
        case "touchend":
        case "touchstart":
        case "volumechange":
        case "change":
        case "selectionchange":
        case "textInput":
        case "compositionstart":
        case "compositionend":
        case "compositionupdate":
        case "beforeblur":
        case "afterblur":
        case "beforeinput":
        case "blur":
        case "fullscreenchange":
        case "focus":
        case "hashchange":
        case "popstate":
        case "select":
        case "selectstart":
          return _n;
        case "drag":
        case "dragenter":
        case "dragexit":
        case "dragleave":
        case "dragover":
        case "mousemove":
        case "mouseout":
        case "mouseover":
        case "pointermove":
        case "pointerout":
        case "pointerover":
        case "scroll":
        case "toggle":
        case "touchmove":
        case "wheel":
        case "mouseenter":
        case "mouseleave":
        case "pointerenter":
        case "pointerleave":
          return Ca;
        case "message": {
          var t = Qs();
          switch (t) {
            case po:
              return _n;
            case Ci:
              return Ca;
            case Pa:
            case oy:
              return Hr;
            case cl:
              return Fr;
            default:
              return Hr;
          }
        }
        default:
          return Hr;
      }
    }
    function jo(e, t, a) {
      return e.addEventListener(t, a, !1), a;
    }
    function ar(e, t, a) {
      return e.addEventListener(t, a, !0), a;
    }
    function Cd(e, t, a, i) {
      return e.addEventListener(t, a, {
        capture: !0,
        passive: i
      }), a;
    }
    function Su(e, t, a, i) {
      return e.addEventListener(t, a, {
        passive: i
      }), a;
    }
    var Sr = null, Eu = null, xl = null;
    function ki(e) {
      return Sr = e, Eu = Vo(), !0;
    }
    function Cc() {
      Sr = null, Eu = null, xl = null;
    }
    function $a() {
      if (xl)
        return xl;
      var e, t = Eu, a = t.length, i, u = Vo(), s = u.length;
      for (e = 0; e < a && t[e] === u[e]; e++)
        ;
      var f = a - e;
      for (i = 1; i <= f && t[a - i] === u[s - i]; i++)
        ;
      var p = i > 1 ? 1 - i : void 0;
      return xl = u.slice(e, p), xl;
    }
    function Vo() {
      return "value" in Sr ? Sr.value : Sr.textContent;
    }
    function bi(e) {
      var t, a = e.keyCode;
      return "charCode" in e ? (t = e.charCode, t === 0 && a === 13 && (t = 13)) : t = a, t === 10 && (t = 13), t >= 32 || t === 13 ? t : 0;
    }
    function Cu() {
      return !0;
    }
    function Bo() {
      return !1;
    }
    function xn(e) {
      function t(a, i, u, s, f) {
        this._reactName = a, this._targetInst = u, this.type = i, this.nativeEvent = s, this.target = f, this.currentTarget = null;
        for (var p in e)
          if (e.hasOwnProperty(p)) {
            var v = e[p];
            v ? this[p] = v(s) : this[p] = s[p];
          }
        var m = s.defaultPrevented != null ? s.defaultPrevented : s.returnValue === !1;
        return m ? this.isDefaultPrevented = Cu : this.isDefaultPrevented = Bo, this.isPropagationStopped = Bo, this;
      }
      return Ae(t.prototype, {
        preventDefault: function() {
          this.defaultPrevented = !0;
          var a = this.nativeEvent;
          a && (a.preventDefault ? a.preventDefault() : typeof a.returnValue != "unknown" && (a.returnValue = !1), this.isDefaultPrevented = Cu);
        },
        stopPropagation: function() {
          var a = this.nativeEvent;
          a && (a.stopPropagation ? a.stopPropagation() : typeof a.cancelBubble != "unknown" && (a.cancelBubble = !0), this.isPropagationStopped = Cu);
        },
        /**
         * We release all dispatched `SyntheticEvent`s after each event loop, adding
         * them back into the pool. This allows a way to hold onto a reference that
         * won't be added back into the pool.
         */
        persist: function() {
        },
        /**
         * Checks if this event should be released back into the pool.
         *
         * @return {boolean} True if this should not be released, false otherwise.
         */
        isPersistent: Cu
      }), t;
    }
    var Yt = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function(e) {
        return e.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0
    }, wa = xn(Yt), Mn = Ae({}, Yt, {
      view: 0,
      detail: 0
    }), ir = xn(Mn), Tc, Po, wl;
    function dy(e) {
      e !== wl && (wl && e.type === "mousemove" ? (Tc = e.screenX - wl.screenX, Po = e.screenY - wl.screenY) : (Tc = 0, Po = 0), wl = e);
    }
    var ia = Ae({}, Mn, {
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      getModifierState: ht,
      button: 0,
      buttons: 0,
      relatedTarget: function(e) {
        return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
      },
      movementX: function(e) {
        return "movementX" in e ? e.movementX : (dy(e), Tc);
      },
      movementY: function(e) {
        return "movementY" in e ? e.movementY : Po;
      }
    }), Td = xn(ia), Rd = Ae({}, ia, {
      dataTransfer: 0
    }), Dl = xn(Rd), xd = Ae({}, Mn, {
      relatedTarget: 0
    }), Ga = xn(xd), Qv = Ae({}, Yt, {
      animationName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), Iv = xn(Qv), wd = Ae({}, Yt, {
      clipboardData: function(e) {
        return "clipboardData" in e ? e.clipboardData : window.clipboardData;
      }
    }), Rc = xn(wd), py = Ae({}, Yt, {
      data: 0
    }), $v = xn(py), Gv = $v, Wv = {
      Esc: "Escape",
      Spacebar: " ",
      Left: "ArrowLeft",
      Up: "ArrowUp",
      Right: "ArrowRight",
      Down: "ArrowDown",
      Del: "Delete",
      Win: "OS",
      Menu: "ContextMenu",
      Apps: "ContextMenu",
      Scroll: "ScrollLock",
      MozPrintableKey: "Unidentified"
    }, kl = {
      8: "Backspace",
      9: "Tab",
      12: "Clear",
      13: "Enter",
      16: "Shift",
      17: "Control",
      18: "Alt",
      19: "Pause",
      20: "CapsLock",
      27: "Escape",
      32: " ",
      33: "PageUp",
      34: "PageDown",
      35: "End",
      36: "Home",
      37: "ArrowLeft",
      38: "ArrowUp",
      39: "ArrowRight",
      40: "ArrowDown",
      45: "Insert",
      46: "Delete",
      112: "F1",
      113: "F2",
      114: "F3",
      115: "F4",
      116: "F5",
      117: "F6",
      118: "F7",
      119: "F8",
      120: "F9",
      121: "F10",
      122: "F11",
      123: "F12",
      144: "NumLock",
      145: "ScrollLock",
      224: "Meta"
    };
    function vy(e) {
      if (e.key) {
        var t = Wv[e.key] || e.key;
        if (t !== "Unidentified")
          return t;
      }
      if (e.type === "keypress") {
        var a = bi(e);
        return a === 13 ? "Enter" : String.fromCharCode(a);
      }
      return e.type === "keydown" || e.type === "keyup" ? kl[e.keyCode] || "Unidentified" : "";
    }
    var Tu = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey"
    };
    function Xv(e) {
      var t = this, a = t.nativeEvent;
      if (a.getModifierState)
        return a.getModifierState(e);
      var i = Tu[e];
      return i ? !!a[i] : !1;
    }
    function ht(e) {
      return Xv;
    }
    var hy = Ae({}, Mn, {
      key: vy,
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: ht,
      // Legacy Interface
      charCode: function(e) {
        return e.type === "keypress" ? bi(e) : 0;
      },
      keyCode: function(e) {
        return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      },
      which: function(e) {
        return e.type === "keypress" ? bi(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      }
    }), qv = xn(hy), my = Ae({}, ia, {
      pointerId: 0,
      width: 0,
      height: 0,
      pressure: 0,
      tangentialPressure: 0,
      tiltX: 0,
      tiltY: 0,
      twist: 0,
      pointerType: 0,
      isPrimary: 0
    }), Kv = xn(my), Zv = Ae({}, Mn, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: ht
    }), Jv = xn(Zv), yy = Ae({}, Yt, {
      propertyName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), Vr = xn(yy), Dd = Ae({}, ia, {
      deltaX: function(e) {
        return "deltaX" in e ? e.deltaX : (
          // Fallback to `wheelDeltaX` for Webkit and normalize (right is positive).
          "wheelDeltaX" in e ? -e.wheelDeltaX : 0
        );
      },
      deltaY: function(e) {
        return "deltaY" in e ? e.deltaY : (
          // Fallback to `wheelDeltaY` for Webkit and normalize (down is positive).
          "wheelDeltaY" in e ? -e.wheelDeltaY : (
            // Fallback to `wheelDelta` for IE<9 and normalize (down is positive).
            "wheelDelta" in e ? -e.wheelDelta : 0
          )
        );
      },
      deltaZ: 0,
      // Browsers without "deltaMode" is reporting in raw wheel delta where one
      // notch on the scroll is always +/- 120, roughly equivalent to pixels.
      // A good approximation of DOM_DELTA_LINE (1) is 5% of viewport size or
      // ~40 pixels, for DOM_DELTA_SCREEN (2) it is 87.5% of viewport size.
      deltaMode: 0
    }), gy = xn(Dd), _i = [9, 13, 27, 32], Yo = 229, Wa = Sn && "CompositionEvent" in window, Li = null;
    Sn && "documentMode" in document && (Li = document.documentMode);
    var kd = Sn && "TextEvent" in window && !Li, xc = Sn && (!Wa || Li && Li > 8 && Li <= 11), eh = 32, wc = String.fromCharCode(eh);
    function Sy() {
      sa("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), sa("onCompositionEnd", ["compositionend", "focusout", "keydown", "keypress", "keyup", "mousedown"]), sa("onCompositionStart", ["compositionstart", "focusout", "keydown", "keypress", "keyup", "mousedown"]), sa("onCompositionUpdate", ["compositionupdate", "focusout", "keydown", "keypress", "keyup", "mousedown"]);
    }
    var bd = !1;
    function th(e) {
      return (e.ctrlKey || e.altKey || e.metaKey) && // ctrlKey && altKey is equivalent to AltGr, and is not a command.
      !(e.ctrlKey && e.altKey);
    }
    function Dc(e) {
      switch (e) {
        case "compositionstart":
          return "onCompositionStart";
        case "compositionend":
          return "onCompositionEnd";
        case "compositionupdate":
          return "onCompositionUpdate";
      }
    }
    function kc(e, t) {
      return e === "keydown" && t.keyCode === Yo;
    }
    function _d(e, t) {
      switch (e) {
        case "keyup":
          return _i.indexOf(t.keyCode) !== -1;
        case "keydown":
          return t.keyCode !== Yo;
        case "keypress":
        case "mousedown":
        case "focusout":
          return !0;
        default:
          return !1;
      }
    }
    function bc(e) {
      var t = e.detail;
      return typeof t == "object" && "data" in t ? t.data : null;
    }
    function nh(e) {
      return e.locale === "ko";
    }
    var bl = !1;
    function Ld(e, t, a, i, u) {
      var s, f;
      if (Wa ? s = Dc(t) : bl ? _d(t, i) && (s = "onCompositionEnd") : kc(t, i) && (s = "onCompositionStart"), !s)
        return null;
      xc && !nh(i) && (!bl && s === "onCompositionStart" ? bl = ki(u) : s === "onCompositionEnd" && bl && (f = $a()));
      var p = sh(a, s);
      if (p.length > 0) {
        var v = new $v(s, t, null, i, u);
        if (e.push({
          event: v,
          listeners: p
        }), f)
          v.data = f;
        else {
          var m = bc(i);
          m !== null && (v.data = m);
        }
      }
    }
    function _c(e, t) {
      switch (e) {
        case "compositionend":
          return bc(t);
        case "keypress":
          var a = t.which;
          return a !== eh ? null : (bd = !0, wc);
        case "textInput":
          var i = t.data;
          return i === wc && bd ? null : i;
        default:
          return null;
      }
    }
    function Od(e, t) {
      if (bl) {
        if (e === "compositionend" || !Wa && _d(e, t)) {
          var a = $a();
          return Cc(), bl = !1, a;
        }
        return null;
      }
      switch (e) {
        case "paste":
          return null;
        case "keypress":
          if (!th(t)) {
            if (t.char && t.char.length > 1)
              return t.char;
            if (t.which)
              return String.fromCharCode(t.which);
          }
          return null;
        case "compositionend":
          return xc && !nh(t) ? null : t.data;
        default:
          return null;
      }
    }
    function Lc(e, t, a, i, u) {
      var s;
      if (kd ? s = _c(t, i) : s = Od(t, i), !s)
        return null;
      var f = sh(a, "onBeforeInput");
      if (f.length > 0) {
        var p = new Gv("onBeforeInput", "beforeinput", null, i, u);
        e.push({
          event: p,
          listeners: f
        }), p.data = s;
      }
    }
    function rh(e, t, a, i, u, s, f) {
      Ld(e, t, a, i, u), Lc(e, t, a, i, u);
    }
    var Ey = {
      color: !0,
      date: !0,
      datetime: !0,
      "datetime-local": !0,
      email: !0,
      month: !0,
      number: !0,
      password: !0,
      range: !0,
      search: !0,
      tel: !0,
      text: !0,
      time: !0,
      url: !0,
      week: !0
    };
    function Qo(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t === "input" ? !!Ey[e.type] : t === "textarea";
    }
    /**
     * Checks if an event is supported in the current execution environment.
     *
     * NOTE: This will not work correctly for non-generic events such as `change`,
     * `reset`, `load`, `error`, and `select`.
     *
     * Borrows from Modernizr.
     *
     * @param {string} eventNameSuffix Event name, e.g. "click".
     * @return {boolean} True if the event is supported.
     * @internal
     * @license Modernizr 3.0.0pre (Custom Build) | MIT
     */
    function Cy(e) {
      if (!Sn)
        return !1;
      var t = "on" + e, a = t in document;
      if (!a) {
        var i = document.createElement("div");
        i.setAttribute(t, "return;"), a = typeof i[t] == "function";
      }
      return a;
    }
    function Io() {
      sa("onChange", ["change", "click", "focusin", "focusout", "input", "keydown", "keyup", "selectionchange"]);
    }
    function ah(e, t, a, i) {
      iu(i);
      var u = sh(t, "onChange");
      if (u.length > 0) {
        var s = new wa("onChange", "change", null, a, i);
        e.push({
          event: s,
          listeners: u
        });
      }
    }
    var Oi = null, n = null;
    function r(e) {
      var t = e.nodeName && e.nodeName.toLowerCase();
      return t === "select" || t === "input" && e.type === "file";
    }
    function l(e) {
      var t = [];
      ah(t, n, e, $f(e)), mv(o, t);
    }
    function o(e) {
      _0(e, 0);
    }
    function c(e) {
      var t = Ac(e);
      if (Ji(t))
        return e;
    }
    function d(e, t) {
      if (e === "change")
        return t;
    }
    var h = !1;
    Sn && (h = Cy("input") && (!document.documentMode || document.documentMode > 9));
    function S(e, t) {
      Oi = e, n = t, Oi.attachEvent("onpropertychange", L);
    }
    function E() {
      Oi && (Oi.detachEvent("onpropertychange", L), Oi = null, n = null);
    }
    function L(e) {
      e.propertyName === "value" && c(n) && l(e);
    }
    function F(e, t, a) {
      e === "focusin" ? (E(), S(t, a)) : e === "focusout" && E();
    }
    function V(e, t) {
      if (e === "selectionchange" || e === "keyup" || e === "keydown")
        return c(n);
    }
    function H(e) {
      var t = e.nodeName;
      return t && t.toLowerCase() === "input" && (e.type === "checkbox" || e.type === "radio");
    }
    function q(e, t) {
      if (e === "click")
        return c(t);
    }
    function ne(e, t) {
      if (e === "input" || e === "change")
        return c(t);
    }
    function ie(e) {
      var t = e._wrapperState;
      !t || !t.controlled || e.type !== "number" || Ts(e, "number", e.value);
    }
    function Ot(e, t, a, i, u, s, f) {
      var p = a ? Ac(a) : window, v, m;
      if (r(p) ? v = d : Qo(p) ? h ? v = ne : (v = V, m = F) : H(p) && (v = q), v) {
        var y = v(t, a);
        if (y) {
          ah(e, y, i, u);
          return;
        }
      }
      m && m(t, p, a), t === "focusout" && ie(p);
    }
    function w() {
      ui("onMouseEnter", ["mouseout", "mouseover"]), ui("onMouseLeave", ["mouseout", "mouseover"]), ui("onPointerEnter", ["pointerout", "pointerover"]), ui("onPointerLeave", ["pointerout", "pointerover"]);
    }
    function T(e, t, a, i, u, s, f) {
      var p = t === "mouseover" || t === "pointerover", v = t === "mouseout" || t === "pointerout";
      if (p && !lo(i)) {
        var m = i.relatedTarget || i.fromElement;
        if (m && (Wo(m) || Id(m)))
          return;
      }
      if (!(!v && !p)) {
        var y;
        if (u.window === u)
          y = u;
        else {
          var R = u.ownerDocument;
          R ? y = R.defaultView || R.parentWindow : y = window;
        }
        var C, _;
        if (v) {
          var O = i.relatedTarget || i.toElement;
          if (C = a, _ = O ? Wo(O) : null, _ !== null) {
            var M = vr(_);
            (_ !== M || _.tag !== J && _.tag !== Oe) && (_ = null);
          }
        } else
          C = null, _ = a;
        if (C !== _) {
          var W = Td, fe = "onMouseLeave", ue = "onMouseEnter", Ve = "mouse";
          (t === "pointerout" || t === "pointerover") && (W = Kv, fe = "onPointerLeave", ue = "onPointerEnter", Ve = "pointer");
          var ze = C == null ? y : Ac(C), D = _ == null ? y : Ac(_), N = new W(fe, Ve + "leave", C, i, u);
          N.target = ze, N.relatedTarget = D;
          var k = null, B = Wo(u);
          if (B === a) {
            var Z = new W(ue, Ve + "enter", _, i, u);
            Z.target = D, Z.relatedTarget = ze, k = Z;
          }
          IR(e, N, k, C, _);
        }
      }
    }
    function b(e, t) {
      return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
    }
    var j = typeof Object.is == "function" ? Object.is : b;
    function re(e, t) {
      if (j(e, t))
        return !0;
      if (typeof e != "object" || e === null || typeof t != "object" || t === null)
        return !1;
      var a = Object.keys(e), i = Object.keys(t);
      if (a.length !== i.length)
        return !1;
      for (var u = 0; u < a.length; u++) {
        var s = a[u];
        if (!ca.call(t, s) || !j(e[s], t[s]))
          return !1;
      }
      return !0;
    }
    function pe(e) {
      for (; e && e.firstChild; )
        e = e.firstChild;
      return e;
    }
    function ve(e) {
      for (; e; ) {
        if (e.nextSibling)
          return e.nextSibling;
        e = e.parentNode;
      }
    }
    function Ee(e, t) {
      for (var a = pe(e), i = 0, u = 0; a; ) {
        if (a.nodeType === Ha) {
          if (u = i + a.textContent.length, i <= t && u >= t)
            return {
              node: a,
              offset: t - i
            };
          i = u;
        }
        a = pe(ve(a));
      }
    }
    function tn(e) {
      var t = e.ownerDocument, a = t && t.defaultView || window, i = a.getSelection && a.getSelection();
      if (!i || i.rangeCount === 0)
        return null;
      var u = i.anchorNode, s = i.anchorOffset, f = i.focusNode, p = i.focusOffset;
      try {
        u.nodeType, f.nodeType;
      } catch {
        return null;
      }
      return Qe(e, u, s, f, p);
    }
    function Qe(e, t, a, i, u) {
      var s = 0, f = -1, p = -1, v = 0, m = 0, y = e, R = null;
      e: for (; ; ) {
        for (var C = null; y === t && (a === 0 || y.nodeType === Ha) && (f = s + a), y === i && (u === 0 || y.nodeType === Ha) && (p = s + u), y.nodeType === Ha && (s += y.nodeValue.length), (C = y.firstChild) !== null; )
          R = y, y = C;
        for (; ; ) {
          if (y === e)
            break e;
          if (R === t && ++v === a && (f = s), R === i && ++m === u && (p = s), (C = y.nextSibling) !== null)
            break;
          y = R, R = y.parentNode;
        }
        y = C;
      }
      return f === -1 || p === -1 ? null : {
        start: f,
        end: p
      };
    }
    function Mi(e, t) {
      var a = e.ownerDocument || document, i = a && a.defaultView || window;
      if (i.getSelection) {
        var u = i.getSelection(), s = e.textContent.length, f = Math.min(t.start, s), p = t.end === void 0 ? f : Math.min(t.end, s);
        if (!u.extend && f > p) {
          var v = p;
          p = f, f = v;
        }
        var m = Ee(e, f), y = Ee(e, p);
        if (m && y) {
          if (u.rangeCount === 1 && u.anchorNode === m.node && u.anchorOffset === m.offset && u.focusNode === y.node && u.focusOffset === y.offset)
            return;
          var R = a.createRange();
          R.setStart(m.node, m.offset), u.removeAllRanges(), f > p ? (u.addRange(R), u.extend(y.node, y.offset)) : (R.setEnd(y.node, y.offset), u.addRange(R));
        }
      }
    }
    function ih(e) {
      return e && e.nodeType === Ha;
    }
    function g0(e, t) {
      return !e || !t ? !1 : e === t ? !0 : ih(e) ? !1 : ih(t) ? g0(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1;
    }
    function kR(e) {
      return e && e.ownerDocument && g0(e.ownerDocument.documentElement, e);
    }
    function bR(e) {
      try {
        return typeof e.contentWindow.location.href == "string";
      } catch {
        return !1;
      }
    }
    function S0() {
      for (var e = window, t = el(); t instanceof e.HTMLIFrameElement; ) {
        if (bR(t))
          e = t.contentWindow;
        else
          return t;
        t = el(e.document);
      }
      return t;
    }
    function Ty(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
    }
    function _R() {
      var e = S0();
      return {
        focusedElem: e,
        selectionRange: Ty(e) ? OR(e) : null
      };
    }
    function LR(e) {
      var t = S0(), a = e.focusedElem, i = e.selectionRange;
      if (t !== a && kR(a)) {
        i !== null && Ty(a) && MR(a, i);
        for (var u = [], s = a; s = s.parentNode; )
          s.nodeType === Xn && u.push({
            element: s,
            left: s.scrollLeft,
            top: s.scrollTop
          });
        typeof a.focus == "function" && a.focus();
        for (var f = 0; f < u.length; f++) {
          var p = u[f];
          p.element.scrollLeft = p.left, p.element.scrollTop = p.top;
        }
      }
    }
    function OR(e) {
      var t;
      return "selectionStart" in e ? t = {
        start: e.selectionStart,
        end: e.selectionEnd
      } : t = tn(e), t || {
        start: 0,
        end: 0
      };
    }
    function MR(e, t) {
      var a = t.start, i = t.end;
      i === void 0 && (i = a), "selectionStart" in e ? (e.selectionStart = a, e.selectionEnd = Math.min(i, e.value.length)) : Mi(e, t);
    }
    var NR = Sn && "documentMode" in document && document.documentMode <= 11;
    function zR() {
      sa("onSelect", ["focusout", "contextmenu", "dragend", "focusin", "keydown", "keyup", "mousedown", "mouseup", "selectionchange"]);
    }
    var Oc = null, Ry = null, Md = null, xy = !1;
    function UR(e) {
      if ("selectionStart" in e && Ty(e))
        return {
          start: e.selectionStart,
          end: e.selectionEnd
        };
      var t = e.ownerDocument && e.ownerDocument.defaultView || window, a = t.getSelection();
      return {
        anchorNode: a.anchorNode,
        anchorOffset: a.anchorOffset,
        focusNode: a.focusNode,
        focusOffset: a.focusOffset
      };
    }
    function AR(e) {
      return e.window === e ? e.document : e.nodeType === Fa ? e : e.ownerDocument;
    }
    function E0(e, t, a) {
      var i = AR(a);
      if (!(xy || Oc == null || Oc !== el(i))) {
        var u = UR(Oc);
        if (!Md || !re(Md, u)) {
          Md = u;
          var s = sh(Ry, "onSelect");
          if (s.length > 0) {
            var f = new wa("onSelect", "select", null, t, a);
            e.push({
              event: f,
              listeners: s
            }), f.target = Oc;
          }
        }
      }
    }
    function HR(e, t, a, i, u, s, f) {
      var p = a ? Ac(a) : window;
      switch (t) {
        case "focusin":
          (Qo(p) || p.contentEditable === "true") && (Oc = p, Ry = a, Md = null);
          break;
        case "focusout":
          Oc = null, Ry = null, Md = null;
          break;
        case "mousedown":
          xy = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          xy = !1, E0(e, i, u);
          break;
        case "selectionchange":
          if (NR)
            break;
        case "keydown":
        case "keyup":
          E0(e, i, u);
      }
    }
    function lh(e, t) {
      var a = {};
      return a[e.toLowerCase()] = t.toLowerCase(), a["Webkit" + e] = "webkit" + t, a["Moz" + e] = "moz" + t, a;
    }
    var Mc = {
      animationend: lh("Animation", "AnimationEnd"),
      animationiteration: lh("Animation", "AnimationIteration"),
      animationstart: lh("Animation", "AnimationStart"),
      transitionend: lh("Transition", "TransitionEnd")
    }, wy = {}, C0 = {};
    Sn && (C0 = document.createElement("div").style, "AnimationEvent" in window || (delete Mc.animationend.animation, delete Mc.animationiteration.animation, delete Mc.animationstart.animation), "TransitionEvent" in window || delete Mc.transitionend.transition);
    function uh(e) {
      if (wy[e])
        return wy[e];
      if (!Mc[e])
        return e;
      var t = Mc[e];
      for (var a in t)
        if (t.hasOwnProperty(a) && a in C0)
          return wy[e] = t[a];
      return e;
    }
    var T0 = uh("animationend"), R0 = uh("animationiteration"), x0 = uh("animationstart"), w0 = uh("transitionend"), D0 = /* @__PURE__ */ new Map(), k0 = ["abort", "auxClick", "cancel", "canPlay", "canPlayThrough", "click", "close", "contextMenu", "copy", "cut", "drag", "dragEnd", "dragEnter", "dragExit", "dragLeave", "dragOver", "dragStart", "drop", "durationChange", "emptied", "encrypted", "ended", "error", "gotPointerCapture", "input", "invalid", "keyDown", "keyPress", "keyUp", "load", "loadedData", "loadedMetadata", "loadStart", "lostPointerCapture", "mouseDown", "mouseMove", "mouseOut", "mouseOver", "mouseUp", "paste", "pause", "play", "playing", "pointerCancel", "pointerDown", "pointerMove", "pointerOut", "pointerOver", "pointerUp", "progress", "rateChange", "reset", "resize", "seeked", "seeking", "stalled", "submit", "suspend", "timeUpdate", "touchCancel", "touchEnd", "touchStart", "volumeChange", "scroll", "toggle", "touchMove", "waiting", "wheel"];
    function Ru(e, t) {
      D0.set(e, t), sa(t, [e]);
    }
    function FR() {
      for (var e = 0; e < k0.length; e++) {
        var t = k0[e], a = t.toLowerCase(), i = t[0].toUpperCase() + t.slice(1);
        Ru(a, "on" + i);
      }
      Ru(T0, "onAnimationEnd"), Ru(R0, "onAnimationIteration"), Ru(x0, "onAnimationStart"), Ru("dblclick", "onDoubleClick"), Ru("focusin", "onFocus"), Ru("focusout", "onBlur"), Ru(w0, "onTransitionEnd");
    }
    function jR(e, t, a, i, u, s, f) {
      var p = D0.get(t);
      if (p !== void 0) {
        var v = wa, m = t;
        switch (t) {
          case "keypress":
            if (bi(i) === 0)
              return;
          case "keydown":
          case "keyup":
            v = qv;
            break;
          case "focusin":
            m = "focus", v = Ga;
            break;
          case "focusout":
            m = "blur", v = Ga;
            break;
          case "beforeblur":
          case "afterblur":
            v = Ga;
            break;
          case "click":
            if (i.button === 2)
              return;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            v = Td;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            v = Dl;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            v = Jv;
            break;
          case T0:
          case R0:
          case x0:
            v = Iv;
            break;
          case w0:
            v = Vr;
            break;
          case "scroll":
            v = ir;
            break;
          case "wheel":
            v = gy;
            break;
          case "copy":
          case "cut":
          case "paste":
            v = Rc;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            v = Kv;
            break;
        }
        var y = (s & Or) !== 0;
        {
          var R = !y && // TODO: ideally, we'd eventually add all events from
          // nonDelegatedEvents list in DOMPluginEventSystem.
          // Then we can remove this special list.
          // This is a breaking change that can wait until React 18.
          t === "scroll", C = YR(a, p, i.type, y, R);
          if (C.length > 0) {
            var _ = new v(p, m, null, i, u);
            e.push({
              event: _,
              listeners: C
            });
          }
        }
      }
    }
    FR(), w(), Io(), zR(), Sy();
    function VR(e, t, a, i, u, s, f) {
      jR(e, t, a, i, u, s);
      var p = (s & If) === 0;
      p && (T(e, t, a, i, u), Ot(e, t, a, i, u), HR(e, t, a, i, u), rh(e, t, a, i, u));
    }
    var Nd = ["abort", "canplay", "canplaythrough", "durationchange", "emptied", "encrypted", "ended", "error", "loadeddata", "loadedmetadata", "loadstart", "pause", "play", "playing", "progress", "ratechange", "resize", "seeked", "seeking", "stalled", "suspend", "timeupdate", "volumechange", "waiting"], Dy = new Set(["cancel", "close", "invalid", "load", "scroll", "toggle"].concat(Nd));
    function b0(e, t, a) {
      var i = e.type || "unknown-event";
      e.currentTarget = a, ha(i, t, void 0, e), e.currentTarget = null;
    }
    function BR(e, t, a) {
      var i;
      if (a)
        for (var u = t.length - 1; u >= 0; u--) {
          var s = t[u], f = s.instance, p = s.currentTarget, v = s.listener;
          if (f !== i && e.isPropagationStopped())
            return;
          b0(e, v, p), i = f;
        }
      else
        for (var m = 0; m < t.length; m++) {
          var y = t[m], R = y.instance, C = y.currentTarget, _ = y.listener;
          if (R !== i && e.isPropagationStopped())
            return;
          b0(e, _, C), i = R;
        }
    }
    function _0(e, t) {
      for (var a = (t & Or) !== 0, i = 0; i < e.length; i++) {
        var u = e[i], s = u.event, f = u.listeners;
        BR(s, f, a);
      }
      so();
    }
    function PR(e, t, a, i, u) {
      var s = $f(a), f = [];
      VR(f, e, i, a, s, t), _0(f, t);
    }
    function Et(e, t) {
      Dy.has(e) || g('Did not expect a listenToNonDelegatedEvent() call for "%s". This is a bug in React. Please file an issue.', e);
      var a = !1, i = gx(t), u = $R(e);
      i.has(u) || (L0(t, e, Os, a), i.add(u));
    }
    function ky(e, t, a) {
      Dy.has(e) && !t && g('Did not expect a listenToNativeEvent() call for "%s" in the bubble phase. This is a bug in React. Please file an issue.', e);
      var i = 0;
      t && (i |= Or), L0(a, e, i, t);
    }
    var oh = "_reactListening" + Math.random().toString(36).slice(2);
    function zd(e) {
      if (!e[oh]) {
        e[oh] = !0, Yn.forEach(function(a) {
          a !== "selectionchange" && (Dy.has(a) || ky(a, !1, e), ky(a, !0, e));
        });
        var t = e.nodeType === Fa ? e : e.ownerDocument;
        t !== null && (t[oh] || (t[oh] = !0, ky("selectionchange", !1, t)));
      }
    }
    function L0(e, t, a, i, u) {
      var s = sn(e, t, a), f = void 0;
      oo && (t === "touchstart" || t === "touchmove" || t === "wheel") && (f = !0), e = e, i ? f !== void 0 ? Cd(e, t, s, f) : ar(e, t, s) : f !== void 0 ? Su(e, t, s, f) : jo(e, t, s);
    }
    function O0(e, t) {
      return e === t || e.nodeType === At && e.parentNode === t;
    }
    function by(e, t, a, i, u) {
      var s = i;
      if (!(t & Qf) && !(t & Os)) {
        var f = u;
        if (i !== null) {
          var p = i;
          e: for (; ; ) {
            if (p === null)
              return;
            var v = p.tag;
            if (v === P || v === me) {
              var m = p.stateNode.containerInfo;
              if (O0(m, f))
                break;
              if (v === me)
                for (var y = p.return; y !== null; ) {
                  var R = y.tag;
                  if (R === P || R === me) {
                    var C = y.stateNode.containerInfo;
                    if (O0(C, f))
                      return;
                  }
                  y = y.return;
                }
              for (; m !== null; ) {
                var _ = Wo(m);
                if (_ === null)
                  return;
                var O = _.tag;
                if (O === J || O === Oe) {
                  p = s = _;
                  continue e;
                }
                m = m.parentNode;
              }
            }
            p = p.return;
          }
        }
      }
      mv(function() {
        return PR(e, t, a, s);
      });
    }
    function Ud(e, t, a) {
      return {
        instance: e,
        listener: t,
        currentTarget: a
      };
    }
    function YR(e, t, a, i, u, s) {
      for (var f = t !== null ? t + "Capture" : null, p = i ? f : t, v = [], m = e, y = null; m !== null; ) {
        var R = m, C = R.stateNode, _ = R.tag;
        if (_ === J && C !== null && (y = C, p !== null)) {
          var O = hi(m, p);
          O != null && v.push(Ud(m, O, y));
        }
        if (u)
          break;
        m = m.return;
      }
      return v;
    }
    function sh(e, t) {
      for (var a = t + "Capture", i = [], u = e; u !== null; ) {
        var s = u, f = s.stateNode, p = s.tag;
        if (p === J && f !== null) {
          var v = f, m = hi(u, a);
          m != null && i.unshift(Ud(u, m, v));
          var y = hi(u, t);
          y != null && i.push(Ud(u, y, v));
        }
        u = u.return;
      }
      return i;
    }
    function Nc(e) {
      if (e === null)
        return null;
      do
        e = e.return;
      while (e && e.tag !== J);
      return e || null;
    }
    function QR(e, t) {
      for (var a = e, i = t, u = 0, s = a; s; s = Nc(s))
        u++;
      for (var f = 0, p = i; p; p = Nc(p))
        f++;
      for (; u - f > 0; )
        a = Nc(a), u--;
      for (; f - u > 0; )
        i = Nc(i), f--;
      for (var v = u; v--; ) {
        if (a === i || i !== null && a === i.alternate)
          return a;
        a = Nc(a), i = Nc(i);
      }
      return null;
    }
    function M0(e, t, a, i, u) {
      for (var s = t._reactName, f = [], p = a; p !== null && p !== i; ) {
        var v = p, m = v.alternate, y = v.stateNode, R = v.tag;
        if (m !== null && m === i)
          break;
        if (R === J && y !== null) {
          var C = y;
          if (u) {
            var _ = hi(p, s);
            _ != null && f.unshift(Ud(p, _, C));
          } else if (!u) {
            var O = hi(p, s);
            O != null && f.push(Ud(p, O, C));
          }
        }
        p = p.return;
      }
      f.length !== 0 && e.push({
        event: t,
        listeners: f
      });
    }
    function IR(e, t, a, i, u) {
      var s = i && u ? QR(i, u) : null;
      i !== null && M0(e, t, i, s, !1), u !== null && a !== null && M0(e, a, u, s, !0);
    }
    function $R(e, t) {
      return e + "__bubble";
    }
    var Br = !1, Ad = "dangerouslySetInnerHTML", ch = "suppressContentEditableWarning", xu = "suppressHydrationWarning", N0 = "autoFocus", $o = "children", Go = "style", fh = "__html", _y, dh, Hd, z0, ph, U0, A0;
    _y = {
      // There are working polyfills for <dialog>. Let people use it.
      dialog: !0,
      // Electron ships a custom <webview> tag to display external web content in
      // an isolated frame and process.
      // This tag is not present in non Electron environments such as JSDom which
      // is often used for testing purposes.
      // @see https://electronjs.org/docs/api/webview-tag
      webview: !0
    }, dh = function(e, t) {
      Bf(e, t), _s(e, t), pv(e, t, {
        registrationNameDependencies: Qn,
        possibleRegistrationNames: wr
      });
    }, U0 = Sn && !document.documentMode, Hd = function(e, t, a) {
      if (!Br) {
        var i = vh(a), u = vh(t);
        u !== i && (Br = !0, g("Prop `%s` did not match. Server: %s Client: %s", e, JSON.stringify(u), JSON.stringify(i)));
      }
    }, z0 = function(e) {
      if (!Br) {
        Br = !0;
        var t = [];
        e.forEach(function(a) {
          t.push(a);
        }), g("Extra attributes from the server: %s", t);
      }
    }, ph = function(e, t) {
      t === !1 ? g("Expected `%s` listener to be a function, instead got `false`.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.", e, e, e) : g("Expected `%s` listener to be a function, instead got a value of `%s` type.", e, typeof t);
    }, A0 = function(e, t) {
      var a = e.namespaceURI === Aa ? e.ownerDocument.createElement(e.tagName) : e.ownerDocument.createElementNS(e.namespaceURI, e.tagName);
      return a.innerHTML = t, a.innerHTML;
    };
    var GR = /\r\n?/g, WR = /\u0000|\uFFFD/g;
    function vh(e) {
      Qi(e);
      var t = typeof e == "string" ? e : "" + e;
      return t.replace(GR, `
`).replace(WR, "");
    }
    function hh(e, t, a, i) {
      var u = vh(t), s = vh(e);
      if (s !== u && (i && (Br || (Br = !0, g('Text content did not match. Server: "%s" Client: "%s"', s, u))), a && Na))
        throw new Error("Text content does not match server-rendered HTML.");
    }
    function H0(e) {
      return e.nodeType === Fa ? e : e.ownerDocument;
    }
    function XR() {
    }
    function mh(e) {
      e.onclick = XR;
    }
    function qR(e, t, a, i, u) {
      for (var s in i)
        if (i.hasOwnProperty(s)) {
          var f = i[s];
          if (s === Go)
            f && Object.freeze(f), uv(t, f);
          else if (s === Ad) {
            var p = f ? f[fh] : void 0;
            p != null && Xp(t, p);
          } else if (s === $o)
            if (typeof f == "string") {
              var v = e !== "textarea" || f !== "";
              v && tu(t, f);
            } else typeof f == "number" && tu(t, "" + f);
          else s === ch || s === xu || s === N0 || (Qn.hasOwnProperty(s) ? f != null && (typeof f != "function" && ph(s, f), s === "onScroll" && Et("scroll", t)) : f != null && Gi(t, s, f, u));
        }
    }
    function KR(e, t, a, i) {
      for (var u = 0; u < t.length; u += 2) {
        var s = t[u], f = t[u + 1];
        s === Go ? uv(e, f) : s === Ad ? Xp(e, f) : s === $o ? tu(e, f) : Gi(e, s, f, i);
      }
    }
    function ZR(e, t, a, i) {
      var u, s = H0(a), f, p = i;
      if (p === Aa && (p = zf(e)), p === Aa) {
        if (u = pi(e, t), !u && e !== e.toLowerCase() && g("<%s /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.", e), e === "script") {
          var v = s.createElement("div");
          v.innerHTML = "<script><\/script>";
          var m = v.firstChild;
          f = v.removeChild(m);
        } else if (typeof t.is == "string")
          f = s.createElement(e, {
            is: t.is
          });
        else if (f = s.createElement(e), e === "select") {
          var y = f;
          t.multiple ? y.multiple = !0 : t.size && (y.size = t.size);
        }
      } else
        f = s.createElementNS(p, e);
      return p === Aa && !u && Object.prototype.toString.call(f) === "[object HTMLUnknownElement]" && !ca.call(_y, e) && (_y[e] = !0, g("The tag <%s> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.", e)), f;
    }
    function JR(e, t) {
      return H0(t).createTextNode(e);
    }
    function e1(e, t, a, i) {
      var u = pi(t, a);
      dh(t, a);
      var s;
      switch (t) {
        case "dialog":
          Et("cancel", e), Et("close", e), s = a;
          break;
        case "iframe":
        case "object":
        case "embed":
          Et("load", e), s = a;
          break;
        case "video":
        case "audio":
          for (var f = 0; f < Nd.length; f++)
            Et(Nd[f], e);
          s = a;
          break;
        case "source":
          Et("error", e), s = a;
          break;
        case "img":
        case "image":
        case "link":
          Et("error", e), Et("load", e), s = a;
          break;
        case "details":
          Et("toggle", e), s = a;
          break;
        case "input":
          Ua(e, a), s = gs(e, a), Et("invalid", e);
          break;
        case "option":
          Jl(e, a), s = a;
          break;
        case "select":
          xs(e, a), s = _f(e, a), Et("invalid", e);
          break;
        case "textarea":
          Of(e, a), s = Lf(e, a), Et("invalid", e);
          break;
        default:
          s = a;
      }
      switch (ks(t, s), qR(t, e, i, s, u), t) {
        case "input":
          di(e), Df(e, a, !1);
          break;
        case "textarea":
          di(e), Gp(e);
          break;
        case "option":
          Im(e, a);
          break;
        case "select":
          Gm(e, a);
          break;
        default:
          typeof s.onClick == "function" && mh(e);
          break;
      }
    }
    function t1(e, t, a, i, u) {
      dh(t, i);
      var s = null, f, p;
      switch (t) {
        case "input":
          f = gs(e, a), p = gs(e, i), s = [];
          break;
        case "select":
          f = _f(e, a), p = _f(e, i), s = [];
          break;
        case "textarea":
          f = Lf(e, a), p = Lf(e, i), s = [];
          break;
        default:
          f = a, p = i, typeof f.onClick != "function" && typeof p.onClick == "function" && mh(e);
          break;
      }
      ks(t, p);
      var v, m, y = null;
      for (v in f)
        if (!(p.hasOwnProperty(v) || !f.hasOwnProperty(v) || f[v] == null))
          if (v === Go) {
            var R = f[v];
            for (m in R)
              R.hasOwnProperty(m) && (y || (y = {}), y[m] = "");
          } else v === Ad || v === $o || v === ch || v === xu || v === N0 || (Qn.hasOwnProperty(v) ? s || (s = []) : (s = s || []).push(v, null));
      for (v in p) {
        var C = p[v], _ = f != null ? f[v] : void 0;
        if (!(!p.hasOwnProperty(v) || C === _ || C == null && _ == null))
          if (v === Go)
            if (C && Object.freeze(C), _) {
              for (m in _)
                _.hasOwnProperty(m) && (!C || !C.hasOwnProperty(m)) && (y || (y = {}), y[m] = "");
              for (m in C)
                C.hasOwnProperty(m) && _[m] !== C[m] && (y || (y = {}), y[m] = C[m]);
            } else
              y || (s || (s = []), s.push(v, y)), y = C;
          else if (v === Ad) {
            var O = C ? C[fh] : void 0, M = _ ? _[fh] : void 0;
            O != null && M !== O && (s = s || []).push(v, O);
          } else v === $o ? (typeof C == "string" || typeof C == "number") && (s = s || []).push(v, "" + C) : v === ch || v === xu || (Qn.hasOwnProperty(v) ? (C != null && (typeof C != "function" && ph(v, C), v === "onScroll" && Et("scroll", e)), !s && _ !== C && (s = [])) : (s = s || []).push(v, C));
      }
      return y && (ny(y, p[Go]), (s = s || []).push(Go, y)), s;
    }
    function n1(e, t, a, i, u) {
      a === "input" && u.type === "radio" && u.name != null && Ss(e, u);
      var s = pi(a, i), f = pi(a, u);
      switch (KR(e, t, s, f), a) {
        case "input":
          Zl(e, u);
          break;
        case "textarea":
          $p(e, u);
          break;
        case "select":
          Wm(e, u);
          break;
      }
    }
    function r1(e) {
      {
        var t = e.toLowerCase();
        return ao.hasOwnProperty(t) && ao[t] || null;
      }
    }
    function a1(e, t, a, i, u, s, f) {
      var p, v;
      switch (p = pi(t, a), dh(t, a), t) {
        case "dialog":
          Et("cancel", e), Et("close", e);
          break;
        case "iframe":
        case "object":
        case "embed":
          Et("load", e);
          break;
        case "video":
        case "audio":
          for (var m = 0; m < Nd.length; m++)
            Et(Nd[m], e);
          break;
        case "source":
          Et("error", e);
          break;
        case "img":
        case "image":
        case "link":
          Et("error", e), Et("load", e);
          break;
        case "details":
          Et("toggle", e);
          break;
        case "input":
          Ua(e, a), Et("invalid", e);
          break;
        case "option":
          Jl(e, a);
          break;
        case "select":
          xs(e, a), Et("invalid", e);
          break;
        case "textarea":
          Of(e, a), Et("invalid", e);
          break;
      }
      ks(t, a);
      {
        v = /* @__PURE__ */ new Set();
        for (var y = e.attributes, R = 0; R < y.length; R++) {
          var C = y[R].name.toLowerCase();
          switch (C) {
            case "value":
              break;
            case "checked":
              break;
            case "selected":
              break;
            default:
              v.add(y[R].name);
          }
        }
      }
      var _ = null;
      for (var O in a)
        if (a.hasOwnProperty(O)) {
          var M = a[O];
          if (O === $o)
            typeof M == "string" ? e.textContent !== M && (a[xu] !== !0 && hh(e.textContent, M, s, f), _ = [$o, M]) : typeof M == "number" && e.textContent !== "" + M && (a[xu] !== !0 && hh(e.textContent, M, s, f), _ = [$o, "" + M]);
          else if (Qn.hasOwnProperty(O))
            M != null && (typeof M != "function" && ph(O, M), O === "onScroll" && Et("scroll", e));
          else if (f && // Convince Flow we've calculated it (it's DEV-only in this method.)
          typeof p == "boolean") {
            var W = void 0, fe = Ut(O);
            if (a[xu] !== !0) {
              if (!(O === ch || O === xu || // Controlled attributes are not validated
              // TODO: Only ignore them on controlled tags.
              O === "value" || O === "checked" || O === "selected")) {
                if (O === Ad) {
                  var ue = e.innerHTML, Ve = M ? M[fh] : void 0;
                  if (Ve != null) {
                    var ze = A0(e, Ve);
                    ze !== ue && Hd(O, ue, ze);
                  }
                } else if (O === Go) {
                  if (v.delete(O), U0) {
                    var D = ey(M);
                    W = e.getAttribute("style"), D !== W && Hd(O, W, D);
                  }
                } else if (p && !We)
                  v.delete(O.toLowerCase()), W = df(e, O, M), M !== W && Hd(O, W, M);
                else if (!$n(O, fe, p) && !Gn(O, M, fe, p)) {
                  var N = !1;
                  if (fe !== null)
                    v.delete(fe.attributeName), W = ff(e, O, M, fe);
                  else {
                    var k = i;
                    if (k === Aa && (k = zf(t)), k === Aa)
                      v.delete(O.toLowerCase());
                    else {
                      var B = r1(O);
                      B !== null && B !== O && (N = !0, v.delete(B)), v.delete(O);
                    }
                    W = df(e, O, M);
                  }
                  var Z = We;
                  !Z && M !== W && !N && Hd(O, W, M);
                }
              }
            }
          }
        }
      switch (f && // $FlowFixMe - Should be inferred as not undefined.
      v.size > 0 && a[xu] !== !0 && z0(v), t) {
        case "input":
          di(e), Df(e, a, !0);
          break;
        case "textarea":
          di(e), Gp(e);
          break;
        case "select":
        case "option":
          break;
        default:
          typeof a.onClick == "function" && mh(e);
          break;
      }
      return _;
    }
    function i1(e, t, a) {
      var i = e.nodeValue !== t;
      return i;
    }
    function Ly(e, t) {
      {
        if (Br)
          return;
        Br = !0, g("Did not expect server HTML to contain a <%s> in <%s>.", t.nodeName.toLowerCase(), e.nodeName.toLowerCase());
      }
    }
    function Oy(e, t) {
      {
        if (Br)
          return;
        Br = !0, g('Did not expect server HTML to contain the text node "%s" in <%s>.', t.nodeValue, e.nodeName.toLowerCase());
      }
    }
    function My(e, t, a) {
      {
        if (Br)
          return;
        Br = !0, g("Expected server HTML to contain a matching <%s> in <%s>.", t, e.nodeName.toLowerCase());
      }
    }
    function Ny(e, t) {
      {
        if (t === "" || Br)
          return;
        Br = !0, g('Expected server HTML to contain a matching text node for "%s" in <%s>.', t, e.nodeName.toLowerCase());
      }
    }
    function l1(e, t, a) {
      switch (t) {
        case "input":
          Es(e, a);
          return;
        case "textarea":
          qm(e, a);
          return;
        case "select":
          Xm(e, a);
          return;
      }
    }
    var Fd = function() {
    }, jd = function() {
    };
    {
      var u1 = ["address", "applet", "area", "article", "aside", "base", "basefont", "bgsound", "blockquote", "body", "br", "button", "caption", "center", "col", "colgroup", "dd", "details", "dir", "div", "dl", "dt", "embed", "fieldset", "figcaption", "figure", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "iframe", "img", "input", "isindex", "li", "link", "listing", "main", "marquee", "menu", "menuitem", "meta", "nav", "noembed", "noframes", "noscript", "object", "ol", "p", "param", "plaintext", "pre", "script", "section", "select", "source", "style", "summary", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "title", "tr", "track", "ul", "wbr", "xmp"], F0 = [
        "applet",
        "caption",
        "html",
        "table",
        "td",
        "th",
        "marquee",
        "object",
        "template",
        // https://html.spec.whatwg.org/multipage/syntax.html#html-integration-point
        // TODO: Distinguish by namespace here -- for <title>, including it here
        // errs on the side of fewer warnings
        "foreignObject",
        "desc",
        "title"
      ], o1 = F0.concat(["button"]), s1 = ["dd", "dt", "li", "option", "optgroup", "p", "rp", "rt"], j0 = {
        current: null,
        formTag: null,
        aTagInScope: null,
        buttonTagInScope: null,
        nobrTagInScope: null,
        pTagInButtonScope: null,
        listItemTagAutoclosing: null,
        dlItemTagAutoclosing: null
      };
      jd = function(e, t) {
        var a = Ae({}, e || j0), i = {
          tag: t
        };
        return F0.indexOf(t) !== -1 && (a.aTagInScope = null, a.buttonTagInScope = null, a.nobrTagInScope = null), o1.indexOf(t) !== -1 && (a.pTagInButtonScope = null), u1.indexOf(t) !== -1 && t !== "address" && t !== "div" && t !== "p" && (a.listItemTagAutoclosing = null, a.dlItemTagAutoclosing = null), a.current = i, t === "form" && (a.formTag = i), t === "a" && (a.aTagInScope = i), t === "button" && (a.buttonTagInScope = i), t === "nobr" && (a.nobrTagInScope = i), t === "p" && (a.pTagInButtonScope = i), t === "li" && (a.listItemTagAutoclosing = i), (t === "dd" || t === "dt") && (a.dlItemTagAutoclosing = i), a;
      };
      var c1 = function(e, t) {
        switch (t) {
          case "select":
            return e === "option" || e === "optgroup" || e === "#text";
          case "optgroup":
            return e === "option" || e === "#text";
          case "option":
            return e === "#text";
          case "tr":
            return e === "th" || e === "td" || e === "style" || e === "script" || e === "template";
          case "tbody":
          case "thead":
          case "tfoot":
            return e === "tr" || e === "style" || e === "script" || e === "template";
          case "colgroup":
            return e === "col" || e === "template";
          case "table":
            return e === "caption" || e === "colgroup" || e === "tbody" || e === "tfoot" || e === "thead" || e === "style" || e === "script" || e === "template";
          case "head":
            return e === "base" || e === "basefont" || e === "bgsound" || e === "link" || e === "meta" || e === "title" || e === "noscript" || e === "noframes" || e === "style" || e === "script" || e === "template";
          case "html":
            return e === "head" || e === "body" || e === "frameset";
          case "frameset":
            return e === "frame";
          case "#document":
            return e === "html";
        }
        switch (e) {
          case "h1":
          case "h2":
          case "h3":
          case "h4":
          case "h5":
          case "h6":
            return t !== "h1" && t !== "h2" && t !== "h3" && t !== "h4" && t !== "h5" && t !== "h6";
          case "rp":
          case "rt":
            return s1.indexOf(t) === -1;
          case "body":
          case "caption":
          case "col":
          case "colgroup":
          case "frameset":
          case "frame":
          case "head":
          case "html":
          case "tbody":
          case "td":
          case "tfoot":
          case "th":
          case "thead":
          case "tr":
            return t == null;
        }
        return !0;
      }, f1 = function(e, t) {
        switch (e) {
          case "address":
          case "article":
          case "aside":
          case "blockquote":
          case "center":
          case "details":
          case "dialog":
          case "dir":
          case "div":
          case "dl":
          case "fieldset":
          case "figcaption":
          case "figure":
          case "footer":
          case "header":
          case "hgroup":
          case "main":
          case "menu":
          case "nav":
          case "ol":
          case "p":
          case "section":
          case "summary":
          case "ul":
          case "pre":
          case "listing":
          case "table":
          case "hr":
          case "xmp":
          case "h1":
          case "h2":
          case "h3":
          case "h4":
          case "h5":
          case "h6":
            return t.pTagInButtonScope;
          case "form":
            return t.formTag || t.pTagInButtonScope;
          case "li":
            return t.listItemTagAutoclosing;
          case "dd":
          case "dt":
            return t.dlItemTagAutoclosing;
          case "button":
            return t.buttonTagInScope;
          case "a":
            return t.aTagInScope;
          case "nobr":
            return t.nobrTagInScope;
        }
        return null;
      }, V0 = {};
      Fd = function(e, t, a) {
        a = a || j0;
        var i = a.current, u = i && i.tag;
        t != null && (e != null && g("validateDOMNesting: when childText is passed, childTag should be null"), e = "#text");
        var s = c1(e, u) ? null : i, f = s ? null : f1(e, a), p = s || f;
        if (p) {
          var v = p.tag, m = !!s + "|" + e + "|" + v;
          if (!V0[m]) {
            V0[m] = !0;
            var y = e, R = "";
            if (e === "#text" ? /\S/.test(t) ? y = "Text nodes" : (y = "Whitespace text nodes", R = " Make sure you don't have any extra whitespace between tags on each line of your source code.") : y = "<" + e + ">", s) {
              var C = "";
              v === "table" && e === "tr" && (C += " Add a <tbody>, <thead> or <tfoot> to your code to match the DOM tree generated by the browser."), g("validateDOMNesting(...): %s cannot appear as a child of <%s>.%s%s", y, v, R, C);
            } else
              g("validateDOMNesting(...): %s cannot appear as a descendant of <%s>.", y, v);
          }
        }
      };
    }
    var yh = "suppressHydrationWarning", gh = "$", Sh = "/$", Vd = "$?", Bd = "$!", d1 = "style", zy = null, Uy = null;
    function p1(e) {
      var t, a, i = e.nodeType;
      switch (i) {
        case Fa:
        case Af: {
          t = i === Fa ? "#document" : "#fragment";
          var u = e.documentElement;
          a = u ? u.namespaceURI : Uf(null, "");
          break;
        }
        default: {
          var s = i === At ? e.parentNode : e, f = s.namespaceURI || null;
          t = s.tagName, a = Uf(f, t);
          break;
        }
      }
      {
        var p = t.toLowerCase(), v = jd(null, p);
        return {
          namespace: a,
          ancestorInfo: v
        };
      }
    }
    function v1(e, t, a) {
      {
        var i = e, u = Uf(i.namespace, t), s = jd(i.ancestorInfo, t);
        return {
          namespace: u,
          ancestorInfo: s
        };
      }
    }
    function Db(e) {
      return e;
    }
    function h1(e) {
      zy = Pt(), Uy = _R();
      var t = null;
      return Xt(!1), t;
    }
    function m1(e) {
      LR(Uy), Xt(zy), zy = null, Uy = null;
    }
    function y1(e, t, a, i, u) {
      var s;
      {
        var f = i;
        if (Fd(e, null, f.ancestorInfo), typeof t.children == "string" || typeof t.children == "number") {
          var p = "" + t.children, v = jd(f.ancestorInfo, e);
          Fd(null, p, v);
        }
        s = f.namespace;
      }
      var m = ZR(e, t, a, s);
      return Qd(u, m), Yy(m, t), m;
    }
    function g1(e, t) {
      e.appendChild(t);
    }
    function S1(e, t, a, i, u) {
      switch (e1(e, t, a, i), t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          return !!a.autoFocus;
        case "img":
          return !0;
        default:
          return !1;
      }
    }
    function E1(e, t, a, i, u, s) {
      {
        var f = s;
        if (typeof i.children != typeof a.children && (typeof i.children == "string" || typeof i.children == "number")) {
          var p = "" + i.children, v = jd(f.ancestorInfo, t);
          Fd(null, p, v);
        }
      }
      return t1(e, t, a, i);
    }
    function Ay(e, t) {
      return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
    }
    function C1(e, t, a, i) {
      {
        var u = a;
        Fd(null, e, u.ancestorInfo);
      }
      var s = JR(e, t);
      return Qd(i, s), s;
    }
    function T1() {
      var e = window.event;
      return e === void 0 ? Hr : Ec(e.type);
    }
    var Hy = typeof setTimeout == "function" ? setTimeout : void 0, R1 = typeof clearTimeout == "function" ? clearTimeout : void 0, Fy = -1, B0 = typeof Promise == "function" ? Promise : void 0, x1 = typeof queueMicrotask == "function" ? queueMicrotask : typeof B0 < "u" ? function(e) {
      return B0.resolve(null).then(e).catch(w1);
    } : Hy;
    function w1(e) {
      setTimeout(function() {
        throw e;
      });
    }
    function D1(e, t, a, i) {
      switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          a.autoFocus && e.focus();
          return;
        case "img": {
          a.src && (e.src = a.src);
          return;
        }
      }
    }
    function k1(e, t, a, i, u, s) {
      n1(e, t, a, i, u), Yy(e, u);
    }
    function P0(e) {
      tu(e, "");
    }
    function b1(e, t, a) {
      e.nodeValue = a;
    }
    function _1(e, t) {
      e.appendChild(t);
    }
    function L1(e, t) {
      var a;
      e.nodeType === At ? (a = e.parentNode, a.insertBefore(t, e)) : (a = e, a.appendChild(t));
      var i = e._reactRootContainer;
      i == null && a.onclick === null && mh(a);
    }
    function O1(e, t, a) {
      e.insertBefore(t, a);
    }
    function M1(e, t, a) {
      e.nodeType === At ? e.parentNode.insertBefore(t, a) : e.insertBefore(t, a);
    }
    function N1(e, t) {
      e.removeChild(t);
    }
    function z1(e, t) {
      e.nodeType === At ? e.parentNode.removeChild(t) : e.removeChild(t);
    }
    function jy(e, t) {
      var a = t, i = 0;
      do {
        var u = a.nextSibling;
        if (e.removeChild(a), u && u.nodeType === At) {
          var s = u.data;
          if (s === Sh)
            if (i === 0) {
              e.removeChild(u), Rl(t);
              return;
            } else
              i--;
          else (s === gh || s === Vd || s === Bd) && i++;
        }
        a = u;
      } while (a);
      Rl(t);
    }
    function U1(e, t) {
      e.nodeType === At ? jy(e.parentNode, t) : e.nodeType === Xn && jy(e, t), Rl(e);
    }
    function A1(e) {
      e = e;
      var t = e.style;
      typeof t.setProperty == "function" ? t.setProperty("display", "none", "important") : t.display = "none";
    }
    function H1(e) {
      e.nodeValue = "";
    }
    function F1(e, t) {
      e = e;
      var a = t[d1], i = a != null && a.hasOwnProperty("display") ? a.display : null;
      e.style.display = Ds("display", i);
    }
    function j1(e, t) {
      e.nodeValue = t;
    }
    function V1(e) {
      e.nodeType === Xn ? e.textContent = "" : e.nodeType === Fa && e.documentElement && e.removeChild(e.documentElement);
    }
    function B1(e, t, a) {
      return e.nodeType !== Xn || t.toLowerCase() !== e.nodeName.toLowerCase() ? null : e;
    }
    function P1(e, t) {
      return t === "" || e.nodeType !== Ha ? null : e;
    }
    function Y1(e) {
      return e.nodeType !== At ? null : e;
    }
    function Y0(e) {
      return e.data === Vd;
    }
    function Vy(e) {
      return e.data === Bd;
    }
    function Q1(e) {
      var t = e.nextSibling && e.nextSibling.dataset, a, i, u;
      return t && (a = t.dgst, i = t.msg, u = t.stck), {
        message: i,
        digest: a,
        stack: u
      };
    }
    function I1(e, t) {
      e._reactRetry = t;
    }
    function Eh(e) {
      for (; e != null; e = e.nextSibling) {
        var t = e.nodeType;
        if (t === Xn || t === Ha)
          break;
        if (t === At) {
          var a = e.data;
          if (a === gh || a === Bd || a === Vd)
            break;
          if (a === Sh)
            return null;
        }
      }
      return e;
    }
    function Pd(e) {
      return Eh(e.nextSibling);
    }
    function $1(e) {
      return Eh(e.firstChild);
    }
    function G1(e) {
      return Eh(e.firstChild);
    }
    function W1(e) {
      return Eh(e.nextSibling);
    }
    function X1(e, t, a, i, u, s, f) {
      Qd(s, e), Yy(e, a);
      var p;
      {
        var v = u;
        p = v.namespace;
      }
      var m = (s.mode & ke) !== ce;
      return a1(e, t, a, p, i, m, f);
    }
    function q1(e, t, a, i) {
      return Qd(a, e), a.mode & ke, i1(e, t);
    }
    function K1(e, t) {
      Qd(t, e);
    }
    function Z1(e) {
      for (var t = e.nextSibling, a = 0; t; ) {
        if (t.nodeType === At) {
          var i = t.data;
          if (i === Sh) {
            if (a === 0)
              return Pd(t);
            a--;
          } else (i === gh || i === Bd || i === Vd) && a++;
        }
        t = t.nextSibling;
      }
      return null;
    }
    function Q0(e) {
      for (var t = e.previousSibling, a = 0; t; ) {
        if (t.nodeType === At) {
          var i = t.data;
          if (i === gh || i === Bd || i === Vd) {
            if (a === 0)
              return t;
            a--;
          } else i === Sh && a++;
        }
        t = t.previousSibling;
      }
      return null;
    }
    function J1(e) {
      Rl(e);
    }
    function ex(e) {
      Rl(e);
    }
    function tx(e) {
      return e !== "head" && e !== "body";
    }
    function nx(e, t, a, i) {
      var u = !0;
      hh(t.nodeValue, a, i, u);
    }
    function rx(e, t, a, i, u, s) {
      if (t[yh] !== !0) {
        var f = !0;
        hh(i.nodeValue, u, s, f);
      }
    }
    function ax(e, t) {
      t.nodeType === Xn ? Ly(e, t) : t.nodeType === At || Oy(e, t);
    }
    function ix(e, t) {
      {
        var a = e.parentNode;
        a !== null && (t.nodeType === Xn ? Ly(a, t) : t.nodeType === At || Oy(a, t));
      }
    }
    function lx(e, t, a, i, u) {
      (u || t[yh] !== !0) && (i.nodeType === Xn ? Ly(a, i) : i.nodeType === At || Oy(a, i));
    }
    function ux(e, t, a) {
      My(e, t);
    }
    function ox(e, t) {
      Ny(e, t);
    }
    function sx(e, t, a) {
      {
        var i = e.parentNode;
        i !== null && My(i, t);
      }
    }
    function cx(e, t) {
      {
        var a = e.parentNode;
        a !== null && Ny(a, t);
      }
    }
    function fx(e, t, a, i, u, s) {
      (s || t[yh] !== !0) && My(a, i);
    }
    function dx(e, t, a, i, u) {
      (u || t[yh] !== !0) && Ny(a, i);
    }
    function px(e) {
      g("An error occurred during hydration. The server HTML was replaced with client content in <%s>.", e.nodeName.toLowerCase());
    }
    function vx(e) {
      zd(e);
    }
    var zc = Math.random().toString(36).slice(2), Uc = "__reactFiber$" + zc, By = "__reactProps$" + zc, Yd = "__reactContainer$" + zc, Py = "__reactEvents$" + zc, hx = "__reactListeners$" + zc, mx = "__reactHandles$" + zc;
    function yx(e) {
      delete e[Uc], delete e[By], delete e[Py], delete e[hx], delete e[mx];
    }
    function Qd(e, t) {
      t[Uc] = e;
    }
    function Ch(e, t) {
      t[Yd] = e;
    }
    function I0(e) {
      e[Yd] = null;
    }
    function Id(e) {
      return !!e[Yd];
    }
    function Wo(e) {
      var t = e[Uc];
      if (t)
        return t;
      for (var a = e.parentNode; a; ) {
        if (t = a[Yd] || a[Uc], t) {
          var i = t.alternate;
          if (t.child !== null || i !== null && i.child !== null)
            for (var u = Q0(e); u !== null; ) {
              var s = u[Uc];
              if (s)
                return s;
              u = Q0(u);
            }
          return t;
        }
        e = a, a = e.parentNode;
      }
      return null;
    }
    function wu(e) {
      var t = e[Uc] || e[Yd];
      return t && (t.tag === J || t.tag === Oe || t.tag === _e || t.tag === P) ? t : null;
    }
    function Ac(e) {
      if (e.tag === J || e.tag === Oe)
        return e.stateNode;
      throw new Error("getNodeFromInstance: Invalid argument.");
    }
    function Th(e) {
      return e[By] || null;
    }
    function Yy(e, t) {
      e[By] = t;
    }
    function gx(e) {
      var t = e[Py];
      return t === void 0 && (t = e[Py] = /* @__PURE__ */ new Set()), t;
    }
    var $0 = {}, G0 = x.ReactDebugCurrentFrame;
    function Rh(e) {
      if (e) {
        var t = e._owner, a = Zi(e.type, e._source, t ? t.type : null);
        G0.setExtraStackFrame(a);
      } else
        G0.setExtraStackFrame(null);
    }
    function Xa(e, t, a, i, u) {
      {
        var s = Function.call.bind(ca);
        for (var f in e)
          if (s(e, f)) {
            var p = void 0;
            try {
              if (typeof e[f] != "function") {
                var v = Error((i || "React class") + ": " + a + " type `" + f + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof e[f] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw v.name = "Invariant Violation", v;
              }
              p = e[f](t, f, i, a, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (m) {
              p = m;
            }
            p && !(p instanceof Error) && (Rh(u), g("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", i || "React class", a, f, typeof p), Rh(null)), p instanceof Error && !(p.message in $0) && ($0[p.message] = !0, Rh(u), g("Failed %s type: %s", a, p.message), Rh(null));
          }
      }
    }
    var Qy = [], xh;
    xh = [];
    var _l = -1;
    function Du(e) {
      return {
        current: e
      };
    }
    function lr(e, t) {
      if (_l < 0) {
        g("Unexpected pop.");
        return;
      }
      t !== xh[_l] && g("Unexpected Fiber popped."), e.current = Qy[_l], Qy[_l] = null, xh[_l] = null, _l--;
    }
    function ur(e, t, a) {
      _l++, Qy[_l] = e.current, xh[_l] = a, e.current = t;
    }
    var Iy;
    Iy = {};
    var la = {};
    Object.freeze(la);
    var Ll = Du(la), Ni = Du(!1), $y = la;
    function Hc(e, t, a) {
      return a && zi(t) ? $y : Ll.current;
    }
    function W0(e, t, a) {
      {
        var i = e.stateNode;
        i.__reactInternalMemoizedUnmaskedChildContext = t, i.__reactInternalMemoizedMaskedChildContext = a;
      }
    }
    function Fc(e, t) {
      {
        var a = e.type, i = a.contextTypes;
        if (!i)
          return la;
        var u = e.stateNode;
        if (u && u.__reactInternalMemoizedUnmaskedChildContext === t)
          return u.__reactInternalMemoizedMaskedChildContext;
        var s = {};
        for (var f in i)
          s[f] = t[f];
        {
          var p = Re(e) || "Unknown";
          Xa(i, s, "context", p);
        }
        return u && W0(e, t, s), s;
      }
    }
    function wh() {
      return Ni.current;
    }
    function zi(e) {
      {
        var t = e.childContextTypes;
        return t != null;
      }
    }
    function Dh(e) {
      lr(Ni, e), lr(Ll, e);
    }
    function Gy(e) {
      lr(Ni, e), lr(Ll, e);
    }
    function X0(e, t, a) {
      {
        if (Ll.current !== la)
          throw new Error("Unexpected context found on stack. This error is likely caused by a bug in React. Please file an issue.");
        ur(Ll, t, e), ur(Ni, a, e);
      }
    }
    function q0(e, t, a) {
      {
        var i = e.stateNode, u = t.childContextTypes;
        if (typeof i.getChildContext != "function") {
          {
            var s = Re(e) || "Unknown";
            Iy[s] || (Iy[s] = !0, g("%s.childContextTypes is specified but there is no getChildContext() method on the instance. You can either define getChildContext() on %s or remove childContextTypes from it.", s, s));
          }
          return a;
        }
        var f = i.getChildContext();
        for (var p in f)
          if (!(p in u))
            throw new Error((Re(e) || "Unknown") + '.getChildContext(): key "' + p + '" is not defined in childContextTypes.');
        {
          var v = Re(e) || "Unknown";
          Xa(u, f, "child context", v);
        }
        return Ae({}, a, f);
      }
    }
    function kh(e) {
      {
        var t = e.stateNode, a = t && t.__reactInternalMemoizedMergedChildContext || la;
        return $y = Ll.current, ur(Ll, a, e), ur(Ni, Ni.current, e), !0;
      }
    }
    function K0(e, t, a) {
      {
        var i = e.stateNode;
        if (!i)
          throw new Error("Expected to have an instance by this point. This error is likely caused by a bug in React. Please file an issue.");
        if (a) {
          var u = q0(e, t, $y);
          i.__reactInternalMemoizedMergedChildContext = u, lr(Ni, e), lr(Ll, e), ur(Ll, u, e), ur(Ni, a, e);
        } else
          lr(Ni, e), ur(Ni, a, e);
      }
    }
    function Sx(e) {
      {
        if (!sl(e) || e.tag !== le)
          throw new Error("Expected subtree parent to be a mounted class component. This error is likely caused by a bug in React. Please file an issue.");
        var t = e;
        do {
          switch (t.tag) {
            case P:
              return t.stateNode.context;
            case le: {
              var a = t.type;
              if (zi(a))
                return t.stateNode.__reactInternalMemoizedMergedChildContext;
              break;
            }
          }
          t = t.return;
        } while (t !== null);
        throw new Error("Found unexpected detached subtree parent. This error is likely caused by a bug in React. Please file an issue.");
      }
    }
    var ku = 0, bh = 1, Ol = null, Wy = !1, Xy = !1;
    function Z0(e) {
      Ol === null ? Ol = [e] : Ol.push(e);
    }
    function Ex(e) {
      Wy = !0, Z0(e);
    }
    function J0() {
      Wy && bu();
    }
    function bu() {
      if (!Xy && Ol !== null) {
        Xy = !0;
        var e = 0, t = jr();
        try {
          var a = !0, i = Ol;
          for (Bt(_n); e < i.length; e++) {
            var u = i[e];
            do
              u = u(a);
            while (u !== null);
          }
          Ol = null, Wy = !1;
        } catch (s) {
          throw Ol !== null && (Ol = Ol.slice(e + 1)), Wf(po, bu), s;
        } finally {
          Bt(t), Xy = !1;
        }
      }
      return null;
    }
    var jc = [], Vc = 0, _h = null, Lh = 0, Da = [], ka = 0, Xo = null, Ml = 1, Nl = "";
    function Cx(e) {
      return Ko(), (e.flags & ma) !== se;
    }
    function Tx(e) {
      return Ko(), Lh;
    }
    function Rx() {
      var e = Nl, t = Ml, a = t & ~xx(t);
      return a.toString(32) + e;
    }
    function qo(e, t) {
      Ko(), jc[Vc++] = Lh, jc[Vc++] = _h, _h = e, Lh = t;
    }
    function eE(e, t, a) {
      Ko(), Da[ka++] = Ml, Da[ka++] = Nl, Da[ka++] = Xo, Xo = e;
      var i = Ml, u = Nl, s = Oh(i) - 1, f = i & ~(1 << s), p = a + 1, v = Oh(t) + s;
      if (v > 30) {
        var m = s - s % 5, y = (1 << m) - 1, R = (f & y).toString(32), C = f >> m, _ = s - m, O = Oh(t) + _, M = p << _, W = M | C, fe = R + u;
        Ml = 1 << O | W, Nl = fe;
      } else {
        var ue = p << s, Ve = ue | f, ze = u;
        Ml = 1 << v | Ve, Nl = ze;
      }
    }
    function qy(e) {
      Ko();
      var t = e.return;
      if (t !== null) {
        var a = 1, i = 0;
        qo(e, a), eE(e, a, i);
      }
    }
    function Oh(e) {
      return 32 - jt(e);
    }
    function xx(e) {
      return 1 << Oh(e) - 1;
    }
    function Ky(e) {
      for (; e === _h; )
        _h = jc[--Vc], jc[Vc] = null, Lh = jc[--Vc], jc[Vc] = null;
      for (; e === Xo; )
        Xo = Da[--ka], Da[ka] = null, Nl = Da[--ka], Da[ka] = null, Ml = Da[--ka], Da[ka] = null;
    }
    function wx() {
      return Ko(), Xo !== null ? {
        id: Ml,
        overflow: Nl
      } : null;
    }
    function Dx(e, t) {
      Ko(), Da[ka++] = Ml, Da[ka++] = Nl, Da[ka++] = Xo, Ml = t.id, Nl = t.overflow, Xo = e;
    }
    function Ko() {
      zn() || g("Expected to be hydrating. This is a bug in React. Please file an issue.");
    }
    var Nn = null, ba = null, qa = !1, Zo = !1, _u = null;
    function kx() {
      qa && g("We should not be hydrating here. This is a bug in React. Please file a bug.");
    }
    function tE() {
      Zo = !0;
    }
    function bx() {
      return Zo;
    }
    function _x(e) {
      var t = e.stateNode.containerInfo;
      return ba = G1(t), Nn = e, qa = !0, _u = null, Zo = !1, !0;
    }
    function Lx(e, t, a) {
      return ba = W1(t), Nn = e, qa = !0, _u = null, Zo = !1, a !== null && Dx(e, a), !0;
    }
    function nE(e, t) {
      switch (e.tag) {
        case P: {
          ax(e.stateNode.containerInfo, t);
          break;
        }
        case J: {
          var a = (e.mode & ke) !== ce;
          lx(
            e.type,
            e.memoizedProps,
            e.stateNode,
            t,
            // TODO: Delete this argument when we remove the legacy root API.
            a
          );
          break;
        }
        case _e: {
          var i = e.memoizedState;
          i.dehydrated !== null && ix(i.dehydrated, t);
          break;
        }
      }
    }
    function rE(e, t) {
      nE(e, t);
      var a = zk();
      a.stateNode = t, a.return = e;
      var i = e.deletions;
      i === null ? (e.deletions = [a], e.flags |= Mr) : i.push(a);
    }
    function Zy(e, t) {
      {
        if (Zo)
          return;
        switch (e.tag) {
          case P: {
            var a = e.stateNode.containerInfo;
            switch (t.tag) {
              case J:
                var i = t.type;
                t.pendingProps, ux(a, i);
                break;
              case Oe:
                var u = t.pendingProps;
                ox(a, u);
                break;
            }
            break;
          }
          case J: {
            var s = e.type, f = e.memoizedProps, p = e.stateNode;
            switch (t.tag) {
              case J: {
                var v = t.type, m = t.pendingProps, y = (e.mode & ke) !== ce;
                fx(
                  s,
                  f,
                  p,
                  v,
                  m,
                  // TODO: Delete this argument when we remove the legacy root API.
                  y
                );
                break;
              }
              case Oe: {
                var R = t.pendingProps, C = (e.mode & ke) !== ce;
                dx(
                  s,
                  f,
                  p,
                  R,
                  // TODO: Delete this argument when we remove the legacy root API.
                  C
                );
                break;
              }
            }
            break;
          }
          case _e: {
            var _ = e.memoizedState, O = _.dehydrated;
            if (O !== null) switch (t.tag) {
              case J:
                var M = t.type;
                t.pendingProps, sx(O, M);
                break;
              case Oe:
                var W = t.pendingProps;
                cx(O, W);
                break;
            }
            break;
          }
          default:
            return;
        }
      }
    }
    function aE(e, t) {
      t.flags = t.flags & ~Kn | yt, Zy(e, t);
    }
    function iE(e, t) {
      switch (e.tag) {
        case J: {
          var a = e.type;
          e.pendingProps;
          var i = B1(t, a);
          return i !== null ? (e.stateNode = i, Nn = e, ba = $1(i), !0) : !1;
        }
        case Oe: {
          var u = e.pendingProps, s = P1(t, u);
          return s !== null ? (e.stateNode = s, Nn = e, ba = null, !0) : !1;
        }
        case _e: {
          var f = Y1(t);
          if (f !== null) {
            var p = {
              dehydrated: f,
              treeContext: wx(),
              retryLane: tr
            };
            e.memoizedState = p;
            var v = Uk(f);
            return v.return = e, e.child = v, Nn = e, ba = null, !0;
          }
          return !1;
        }
        default:
          return !1;
      }
    }
    function Jy(e) {
      return (e.mode & ke) !== ce && (e.flags & oe) === se;
    }
    function eg(e) {
      throw new Error("Hydration failed because the initial UI does not match what was rendered on the server.");
    }
    function tg(e) {
      if (qa) {
        var t = ba;
        if (!t) {
          Jy(e) && (Zy(Nn, e), eg()), aE(Nn, e), qa = !1, Nn = e;
          return;
        }
        var a = t;
        if (!iE(e, t)) {
          Jy(e) && (Zy(Nn, e), eg()), t = Pd(a);
          var i = Nn;
          if (!t || !iE(e, t)) {
            aE(Nn, e), qa = !1, Nn = e;
            return;
          }
          rE(i, a);
        }
      }
    }
    function Ox(e, t, a) {
      var i = e.stateNode, u = !Zo, s = X1(i, e.type, e.memoizedProps, t, a, e, u);
      return e.updateQueue = s, s !== null;
    }
    function Mx(e) {
      var t = e.stateNode, a = e.memoizedProps, i = q1(t, a, e);
      if (i) {
        var u = Nn;
        if (u !== null)
          switch (u.tag) {
            case P: {
              var s = u.stateNode.containerInfo, f = (u.mode & ke) !== ce;
              nx(
                s,
                t,
                a,
                // TODO: Delete this argument when we remove the legacy root API.
                f
              );
              break;
            }
            case J: {
              var p = u.type, v = u.memoizedProps, m = u.stateNode, y = (u.mode & ke) !== ce;
              rx(
                p,
                v,
                m,
                t,
                a,
                // TODO: Delete this argument when we remove the legacy root API.
                y
              );
              break;
            }
          }
      }
      return i;
    }
    function Nx(e) {
      var t = e.memoizedState, a = t !== null ? t.dehydrated : null;
      if (!a)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      K1(a, e);
    }
    function zx(e) {
      var t = e.memoizedState, a = t !== null ? t.dehydrated : null;
      if (!a)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      return Z1(a);
    }
    function lE(e) {
      for (var t = e.return; t !== null && t.tag !== J && t.tag !== P && t.tag !== _e; )
        t = t.return;
      Nn = t;
    }
    function Mh(e) {
      if (e !== Nn)
        return !1;
      if (!qa)
        return lE(e), qa = !0, !1;
      if (e.tag !== P && (e.tag !== J || tx(e.type) && !Ay(e.type, e.memoizedProps))) {
        var t = ba;
        if (t)
          if (Jy(e))
            uE(e), eg();
          else
            for (; t; )
              rE(e, t), t = Pd(t);
      }
      return lE(e), e.tag === _e ? ba = zx(e) : ba = Nn ? Pd(e.stateNode) : null, !0;
    }
    function Ux() {
      return qa && ba !== null;
    }
    function uE(e) {
      for (var t = ba; t; )
        nE(e, t), t = Pd(t);
    }
    function Bc() {
      Nn = null, ba = null, qa = !1, Zo = !1;
    }
    function oE() {
      _u !== null && (tT(_u), _u = null);
    }
    function zn() {
      return qa;
    }
    function ng(e) {
      _u === null ? _u = [e] : _u.push(e);
    }
    var Ax = x.ReactCurrentBatchConfig, Hx = null;
    function Fx() {
      return Ax.transition;
    }
    var Ka = {
      recordUnsafeLifecycleWarnings: function(e, t) {
      },
      flushPendingUnsafeLifecycleWarnings: function() {
      },
      recordLegacyContextWarning: function(e, t) {
      },
      flushLegacyContextWarning: function() {
      },
      discardPendingWarnings: function() {
      }
    };
    {
      var jx = function(e) {
        for (var t = null, a = e; a !== null; )
          a.mode & nt && (t = a), a = a.return;
        return t;
      }, Jo = function(e) {
        var t = [];
        return e.forEach(function(a) {
          t.push(a);
        }), t.sort().join(", ");
      }, $d = [], Gd = [], Wd = [], Xd = [], qd = [], Kd = [], es = /* @__PURE__ */ new Set();
      Ka.recordUnsafeLifecycleWarnings = function(e, t) {
        es.has(e.type) || (typeof t.componentWillMount == "function" && // Don't warn about react-lifecycles-compat polyfilled components.
        t.componentWillMount.__suppressDeprecationWarning !== !0 && $d.push(e), e.mode & nt && typeof t.UNSAFE_componentWillMount == "function" && Gd.push(e), typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps.__suppressDeprecationWarning !== !0 && Wd.push(e), e.mode & nt && typeof t.UNSAFE_componentWillReceiveProps == "function" && Xd.push(e), typeof t.componentWillUpdate == "function" && t.componentWillUpdate.__suppressDeprecationWarning !== !0 && qd.push(e), e.mode & nt && typeof t.UNSAFE_componentWillUpdate == "function" && Kd.push(e));
      }, Ka.flushPendingUnsafeLifecycleWarnings = function() {
        var e = /* @__PURE__ */ new Set();
        $d.length > 0 && ($d.forEach(function(C) {
          e.add(Re(C) || "Component"), es.add(C.type);
        }), $d = []);
        var t = /* @__PURE__ */ new Set();
        Gd.length > 0 && (Gd.forEach(function(C) {
          t.add(Re(C) || "Component"), es.add(C.type);
        }), Gd = []);
        var a = /* @__PURE__ */ new Set();
        Wd.length > 0 && (Wd.forEach(function(C) {
          a.add(Re(C) || "Component"), es.add(C.type);
        }), Wd = []);
        var i = /* @__PURE__ */ new Set();
        Xd.length > 0 && (Xd.forEach(function(C) {
          i.add(Re(C) || "Component"), es.add(C.type);
        }), Xd = []);
        var u = /* @__PURE__ */ new Set();
        qd.length > 0 && (qd.forEach(function(C) {
          u.add(Re(C) || "Component"), es.add(C.type);
        }), qd = []);
        var s = /* @__PURE__ */ new Set();
        if (Kd.length > 0 && (Kd.forEach(function(C) {
          s.add(Re(C) || "Component"), es.add(C.type);
        }), Kd = []), t.size > 0) {
          var f = Jo(t);
          g(`Using UNSAFE_componentWillMount in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.

Please update the following components: %s`, f);
        }
        if (i.size > 0) {
          var p = Jo(i);
          g(`Using UNSAFE_componentWillReceiveProps in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state

Please update the following components: %s`, p);
        }
        if (s.size > 0) {
          var v = Jo(s);
          g(`Using UNSAFE_componentWillUpdate in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.

Please update the following components: %s`, v);
        }
        if (e.size > 0) {
          var m = Jo(e);
          Ue(`componentWillMount has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.
* Rename componentWillMount to UNSAFE_componentWillMount to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, m);
        }
        if (a.size > 0) {
          var y = Jo(a);
          Ue(`componentWillReceiveProps has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state
* Rename componentWillReceiveProps to UNSAFE_componentWillReceiveProps to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, y);
        }
        if (u.size > 0) {
          var R = Jo(u);
          Ue(`componentWillUpdate has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* Rename componentWillUpdate to UNSAFE_componentWillUpdate to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, R);
        }
      };
      var Nh = /* @__PURE__ */ new Map(), sE = /* @__PURE__ */ new Set();
      Ka.recordLegacyContextWarning = function(e, t) {
        var a = jx(e);
        if (a === null) {
          g("Expected to find a StrictMode component in a strict mode tree. This error is likely caused by a bug in React. Please file an issue.");
          return;
        }
        if (!sE.has(e.type)) {
          var i = Nh.get(a);
          (e.type.contextTypes != null || e.type.childContextTypes != null || t !== null && typeof t.getChildContext == "function") && (i === void 0 && (i = [], Nh.set(a, i)), i.push(e));
        }
      }, Ka.flushLegacyContextWarning = function() {
        Nh.forEach(function(e, t) {
          if (e.length !== 0) {
            var a = e[0], i = /* @__PURE__ */ new Set();
            e.forEach(function(s) {
              i.add(Re(s) || "Component"), sE.add(s.type);
            });
            var u = Jo(i);
            try {
              dt(a), g(`Legacy context API has been detected within a strict-mode tree.

The old API will be supported in all 16.x releases, but applications using it should migrate to the new version.

Please update the following components: %s

Learn more about this warning here: https://reactjs.org/link/legacy-context`, u);
            } finally {
              xt();
            }
          }
        });
      }, Ka.discardPendingWarnings = function() {
        $d = [], Gd = [], Wd = [], Xd = [], qd = [], Kd = [], Nh = /* @__PURE__ */ new Map();
      };
    }
    var rg, ag, ig, lg, ug, cE = function(e, t) {
    };
    rg = !1, ag = !1, ig = {}, lg = {}, ug = {}, cE = function(e, t) {
      if (!(e === null || typeof e != "object") && !(!e._store || e._store.validated || e.key != null)) {
        if (typeof e._store != "object")
          throw new Error("React Component in warnForMissingKey should have a _store. This error is likely caused by a bug in React. Please file an issue.");
        e._store.validated = !0;
        var a = Re(t) || "Component";
        lg[a] || (lg[a] = !0, g('Each child in a list should have a unique "key" prop. See https://reactjs.org/link/warning-keys for more information.'));
      }
    };
    function Vx(e) {
      return e.prototype && e.prototype.isReactComponent;
    }
    function Zd(e, t, a) {
      var i = a.ref;
      if (i !== null && typeof i != "function" && typeof i != "object") {
        if ((e.mode & nt || tt) && // We warn in ReactElement.js if owner and self are equal for string refs
        // because these cannot be automatically converted to an arrow function
        // using a codemod. Therefore, we don't have to warn about string refs again.
        !(a._owner && a._self && a._owner.stateNode !== a._self) && // Will already throw with "Function components cannot have string refs"
        !(a._owner && a._owner.tag !== le) && // Will already warn with "Function components cannot be given refs"
        !(typeof a.type == "function" && !Vx(a.type)) && // Will already throw with "Element ref was specified as a string (someStringRef) but no owner was set"
        a._owner) {
          var u = Re(e) || "Component";
          ig[u] || (g('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. We recommend using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', u, i), ig[u] = !0);
        }
        if (a._owner) {
          var s = a._owner, f;
          if (s) {
            var p = s;
            if (p.tag !== le)
              throw new Error("Function components cannot have string refs. We recommend using useRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref");
            f = p.stateNode;
          }
          if (!f)
            throw new Error("Missing owner for string ref " + i + ". This error is likely caused by a bug in React. Please file an issue.");
          var v = f;
          Pu(i, "ref");
          var m = "" + i;
          if (t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === m)
            return t.ref;
          var y = function(R) {
            var C = v.refs;
            R === null ? delete C[m] : C[m] = R;
          };
          return y._stringRef = m, y;
        } else {
          if (typeof i != "string")
            throw new Error("Expected ref to be a function, a string, an object returned by React.createRef(), or null.");
          if (!a._owner)
            throw new Error("Element ref was specified as a string (" + i + `) but no owner was set. This could happen for one of the following reasons:
1. You may be adding a ref to a function component
2. You may be adding a ref to a component that was not created inside a component's render method
3. You have multiple copies of React loaded
See https://reactjs.org/link/refs-must-have-owner for more information.`);
        }
      }
      return i;
    }
    function zh(e, t) {
      var a = Object.prototype.toString.call(t);
      throw new Error("Objects are not valid as a React child (found: " + (a === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : a) + "). If you meant to render a collection of children, use an array instead.");
    }
    function Uh(e) {
      {
        var t = Re(e) || "Component";
        if (ug[t])
          return;
        ug[t] = !0, g("Functions are not valid as a React child. This may happen if you return a Component instead of <Component /> from render. Or maybe you meant to call this function rather than return it.");
      }
    }
    function fE(e) {
      var t = e._payload, a = e._init;
      return a(t);
    }
    function dE(e) {
      function t(D, N) {
        if (e) {
          var k = D.deletions;
          k === null ? (D.deletions = [N], D.flags |= Mr) : k.push(N);
        }
      }
      function a(D, N) {
        if (!e)
          return null;
        for (var k = N; k !== null; )
          t(D, k), k = k.sibling;
        return null;
      }
      function i(D, N) {
        for (var k = /* @__PURE__ */ new Map(), B = N; B !== null; )
          B.key !== null ? k.set(B.key, B) : k.set(B.index, B), B = B.sibling;
        return k;
      }
      function u(D, N) {
        var k = ss(D, N);
        return k.index = 0, k.sibling = null, k;
      }
      function s(D, N, k) {
        if (D.index = k, !e)
          return D.flags |= ma, N;
        var B = D.alternate;
        if (B !== null) {
          var Z = B.index;
          return Z < N ? (D.flags |= yt, N) : Z;
        } else
          return D.flags |= yt, N;
      }
      function f(D) {
        return e && D.alternate === null && (D.flags |= yt), D;
      }
      function p(D, N, k, B) {
        if (N === null || N.tag !== Oe) {
          var Z = n0(k, D.mode, B);
          return Z.return = D, Z;
        } else {
          var X = u(N, k);
          return X.return = D, X;
        }
      }
      function v(D, N, k, B) {
        var Z = k.type;
        if (Z === Gl)
          return y(D, N, k.props.children, B, k.key);
        if (N !== null && (N.elementType === Z || // Keep this check inline so it only runs on the false path:
        yT(N, k) || // Lazy types should reconcile their resolved type.
        // We need to do this after the Hot Reloading check above,
        // because hot reloading has different semantics than prod because
        // it doesn't resuspend. So we can't let the call below suspend.
        typeof Z == "object" && Z !== null && Z.$$typeof === En && fE(Z) === N.type)) {
          var X = u(N, k.props);
          return X.ref = Zd(D, N, k), X.return = D, X._debugSource = k._source, X._debugOwner = k._owner, X;
        }
        var Se = t0(k, D.mode, B);
        return Se.ref = Zd(D, N, k), Se.return = D, Se;
      }
      function m(D, N, k, B) {
        if (N === null || N.tag !== me || N.stateNode.containerInfo !== k.containerInfo || N.stateNode.implementation !== k.implementation) {
          var Z = r0(k, D.mode, B);
          return Z.return = D, Z;
        } else {
          var X = u(N, k.children || []);
          return X.return = D, X;
        }
      }
      function y(D, N, k, B, Z) {
        if (N === null || N.tag !== Ge) {
          var X = Vu(k, D.mode, B, Z);
          return X.return = D, X;
        } else {
          var Se = u(N, k);
          return Se.return = D, Se;
        }
      }
      function R(D, N, k) {
        if (typeof N == "string" && N !== "" || typeof N == "number") {
          var B = n0("" + N, D.mode, k);
          return B.return = D, B;
        }
        if (typeof N == "object" && N !== null) {
          switch (N.$$typeof) {
            case si: {
              var Z = t0(N, D.mode, k);
              return Z.ref = Zd(D, null, N), Z.return = D, Z;
            }
            case qr: {
              var X = r0(N, D.mode, k);
              return X.return = D, X;
            }
            case En: {
              var Se = N._payload, Te = N._init;
              return R(D, Te(Se), k);
            }
          }
          if (an(N) || ot(N)) {
            var at = Vu(N, D.mode, k, null);
            return at.return = D, at;
          }
          zh(D, N);
        }
        return typeof N == "function" && Uh(D), null;
      }
      function C(D, N, k, B) {
        var Z = N !== null ? N.key : null;
        if (typeof k == "string" && k !== "" || typeof k == "number")
          return Z !== null ? null : p(D, N, "" + k, B);
        if (typeof k == "object" && k !== null) {
          switch (k.$$typeof) {
            case si:
              return k.key === Z ? v(D, N, k, B) : null;
            case qr:
              return k.key === Z ? m(D, N, k, B) : null;
            case En: {
              var X = k._payload, Se = k._init;
              return C(D, N, Se(X), B);
            }
          }
          if (an(k) || ot(k))
            return Z !== null ? null : y(D, N, k, B, null);
          zh(D, k);
        }
        return typeof k == "function" && Uh(D), null;
      }
      function _(D, N, k, B, Z) {
        if (typeof B == "string" && B !== "" || typeof B == "number") {
          var X = D.get(k) || null;
          return p(N, X, "" + B, Z);
        }
        if (typeof B == "object" && B !== null) {
          switch (B.$$typeof) {
            case si: {
              var Se = D.get(B.key === null ? k : B.key) || null;
              return v(N, Se, B, Z);
            }
            case qr: {
              var Te = D.get(B.key === null ? k : B.key) || null;
              return m(N, Te, B, Z);
            }
            case En:
              var at = B._payload, Ie = B._init;
              return _(D, N, k, Ie(at), Z);
          }
          if (an(B) || ot(B)) {
            var qt = D.get(k) || null;
            return y(N, qt, B, Z, null);
          }
          zh(N, B);
        }
        return typeof B == "function" && Uh(N), null;
      }
      function O(D, N, k) {
        {
          if (typeof D != "object" || D === null)
            return N;
          switch (D.$$typeof) {
            case si:
            case qr:
              cE(D, k);
              var B = D.key;
              if (typeof B != "string")
                break;
              if (N === null) {
                N = /* @__PURE__ */ new Set(), N.add(B);
                break;
              }
              if (!N.has(B)) {
                N.add(B);
                break;
              }
              g("Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.", B);
              break;
            case En:
              var Z = D._payload, X = D._init;
              O(X(Z), N, k);
              break;
          }
        }
        return N;
      }
      function M(D, N, k, B) {
        for (var Z = null, X = 0; X < k.length; X++) {
          var Se = k[X];
          Z = O(Se, Z, D);
        }
        for (var Te = null, at = null, Ie = N, qt = 0, $e = 0, Qt = null; Ie !== null && $e < k.length; $e++) {
          Ie.index > $e ? (Qt = Ie, Ie = null) : Qt = Ie.sibling;
          var sr = C(D, Ie, k[$e], B);
          if (sr === null) {
            Ie === null && (Ie = Qt);
            break;
          }
          e && Ie && sr.alternate === null && t(D, Ie), qt = s(sr, qt, $e), at === null ? Te = sr : at.sibling = sr, at = sr, Ie = Qt;
        }
        if ($e === k.length) {
          if (a(D, Ie), zn()) {
            var Bn = $e;
            qo(D, Bn);
          }
          return Te;
        }
        if (Ie === null) {
          for (; $e < k.length; $e++) {
            var oa = R(D, k[$e], B);
            oa !== null && (qt = s(oa, qt, $e), at === null ? Te = oa : at.sibling = oa, at = oa);
          }
          if (zn()) {
            var Rr = $e;
            qo(D, Rr);
          }
          return Te;
        }
        for (var xr = i(D, Ie); $e < k.length; $e++) {
          var cr = _(xr, D, $e, k[$e], B);
          cr !== null && (e && cr.alternate !== null && xr.delete(cr.key === null ? $e : cr.key), qt = s(cr, qt, $e), at === null ? Te = cr : at.sibling = cr, at = cr);
        }
        if (e && xr.forEach(function(uf) {
          return t(D, uf);
        }), zn()) {
          var Vl = $e;
          qo(D, Vl);
        }
        return Te;
      }
      function W(D, N, k, B) {
        var Z = ot(k);
        if (typeof Z != "function")
          throw new Error("An object is not an iterable. This error is likely caused by a bug in React. Please file an issue.");
        {
          typeof Symbol == "function" && // $FlowFixMe Flow doesn't know about toStringTag
          k[Symbol.toStringTag] === "Generator" && (ag || g("Using Generators as children is unsupported and will likely yield unexpected results because enumerating a generator mutates it. You may convert it to an array with `Array.from()` or the `[...spread]` operator before rendering. Keep in mind you might need to polyfill these features for older browsers."), ag = !0), k.entries === Z && (rg || g("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), rg = !0);
          var X = Z.call(k);
          if (X)
            for (var Se = null, Te = X.next(); !Te.done; Te = X.next()) {
              var at = Te.value;
              Se = O(at, Se, D);
            }
        }
        var Ie = Z.call(k);
        if (Ie == null)
          throw new Error("An iterable object provided no iterator.");
        for (var qt = null, $e = null, Qt = N, sr = 0, Bn = 0, oa = null, Rr = Ie.next(); Qt !== null && !Rr.done; Bn++, Rr = Ie.next()) {
          Qt.index > Bn ? (oa = Qt, Qt = null) : oa = Qt.sibling;
          var xr = C(D, Qt, Rr.value, B);
          if (xr === null) {
            Qt === null && (Qt = oa);
            break;
          }
          e && Qt && xr.alternate === null && t(D, Qt), sr = s(xr, sr, Bn), $e === null ? qt = xr : $e.sibling = xr, $e = xr, Qt = oa;
        }
        if (Rr.done) {
          if (a(D, Qt), zn()) {
            var cr = Bn;
            qo(D, cr);
          }
          return qt;
        }
        if (Qt === null) {
          for (; !Rr.done; Bn++, Rr = Ie.next()) {
            var Vl = R(D, Rr.value, B);
            Vl !== null && (sr = s(Vl, sr, Bn), $e === null ? qt = Vl : $e.sibling = Vl, $e = Vl);
          }
          if (zn()) {
            var uf = Bn;
            qo(D, uf);
          }
          return qt;
        }
        for (var Lp = i(D, Qt); !Rr.done; Bn++, Rr = Ie.next()) {
          var Pi = _(Lp, D, Bn, Rr.value, B);
          Pi !== null && (e && Pi.alternate !== null && Lp.delete(Pi.key === null ? Bn : Pi.key), sr = s(Pi, sr, Bn), $e === null ? qt = Pi : $e.sibling = Pi, $e = Pi);
        }
        if (e && Lp.forEach(function(db) {
          return t(D, db);
        }), zn()) {
          var fb = Bn;
          qo(D, fb);
        }
        return qt;
      }
      function fe(D, N, k, B) {
        if (N !== null && N.tag === Oe) {
          a(D, N.sibling);
          var Z = u(N, k);
          return Z.return = D, Z;
        }
        a(D, N);
        var X = n0(k, D.mode, B);
        return X.return = D, X;
      }
      function ue(D, N, k, B) {
        for (var Z = k.key, X = N; X !== null; ) {
          if (X.key === Z) {
            var Se = k.type;
            if (Se === Gl) {
              if (X.tag === Ge) {
                a(D, X.sibling);
                var Te = u(X, k.props.children);
                return Te.return = D, Te._debugSource = k._source, Te._debugOwner = k._owner, Te;
              }
            } else if (X.elementType === Se || // Keep this check inline so it only runs on the false path:
            yT(X, k) || // Lazy types should reconcile their resolved type.
            // We need to do this after the Hot Reloading check above,
            // because hot reloading has different semantics than prod because
            // it doesn't resuspend. So we can't let the call below suspend.
            typeof Se == "object" && Se !== null && Se.$$typeof === En && fE(Se) === X.type) {
              a(D, X.sibling);
              var at = u(X, k.props);
              return at.ref = Zd(D, X, k), at.return = D, at._debugSource = k._source, at._debugOwner = k._owner, at;
            }
            a(D, X);
            break;
          } else
            t(D, X);
          X = X.sibling;
        }
        if (k.type === Gl) {
          var Ie = Vu(k.props.children, D.mode, B, k.key);
          return Ie.return = D, Ie;
        } else {
          var qt = t0(k, D.mode, B);
          return qt.ref = Zd(D, N, k), qt.return = D, qt;
        }
      }
      function Ve(D, N, k, B) {
        for (var Z = k.key, X = N; X !== null; ) {
          if (X.key === Z)
            if (X.tag === me && X.stateNode.containerInfo === k.containerInfo && X.stateNode.implementation === k.implementation) {
              a(D, X.sibling);
              var Se = u(X, k.children || []);
              return Se.return = D, Se;
            } else {
              a(D, X);
              break;
            }
          else
            t(D, X);
          X = X.sibling;
        }
        var Te = r0(k, D.mode, B);
        return Te.return = D, Te;
      }
      function ze(D, N, k, B) {
        var Z = typeof k == "object" && k !== null && k.type === Gl && k.key === null;
        if (Z && (k = k.props.children), typeof k == "object" && k !== null) {
          switch (k.$$typeof) {
            case si:
              return f(ue(D, N, k, B));
            case qr:
              return f(Ve(D, N, k, B));
            case En:
              var X = k._payload, Se = k._init;
              return ze(D, N, Se(X), B);
          }
          if (an(k))
            return M(D, N, k, B);
          if (ot(k))
            return W(D, N, k, B);
          zh(D, k);
        }
        return typeof k == "string" && k !== "" || typeof k == "number" ? f(fe(D, N, "" + k, B)) : (typeof k == "function" && Uh(D), a(D, N));
      }
      return ze;
    }
    var Pc = dE(!0), pE = dE(!1);
    function Bx(e, t) {
      if (e !== null && t.child !== e.child)
        throw new Error("Resuming work not yet implemented.");
      if (t.child !== null) {
        var a = t.child, i = ss(a, a.pendingProps);
        for (t.child = i, i.return = t; a.sibling !== null; )
          a = a.sibling, i = i.sibling = ss(a, a.pendingProps), i.return = t;
        i.sibling = null;
      }
    }
    function Px(e, t) {
      for (var a = e.child; a !== null; )
        _k(a, t), a = a.sibling;
    }
    var og = Du(null), sg;
    sg = {};
    var Ah = null, Yc = null, cg = null, Hh = !1;
    function Fh() {
      Ah = null, Yc = null, cg = null, Hh = !1;
    }
    function vE() {
      Hh = !0;
    }
    function hE() {
      Hh = !1;
    }
    function mE(e, t, a) {
      ur(og, t._currentValue, e), t._currentValue = a, t._currentRenderer !== void 0 && t._currentRenderer !== null && t._currentRenderer !== sg && g("Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported."), t._currentRenderer = sg;
    }
    function fg(e, t) {
      var a = og.current;
      lr(og, t), e._currentValue = a;
    }
    function dg(e, t, a) {
      for (var i = e; i !== null; ) {
        var u = i.alternate;
        if (Tl(i.childLanes, t) ? u !== null && !Tl(u.childLanes, t) && (u.childLanes = xe(u.childLanes, t)) : (i.childLanes = xe(i.childLanes, t), u !== null && (u.childLanes = xe(u.childLanes, t))), i === a)
          break;
        i = i.return;
      }
      i !== a && g("Expected to find the propagation root when scheduling context work. This error is likely caused by a bug in React. Please file an issue.");
    }
    function Yx(e, t, a) {
      Qx(e, t, a);
    }
    function Qx(e, t, a) {
      var i = e.child;
      for (i !== null && (i.return = e); i !== null; ) {
        var u = void 0, s = i.dependencies;
        if (s !== null) {
          u = i.child;
          for (var f = s.firstContext; f !== null; ) {
            if (f.context === t) {
              if (i.tag === le) {
                var p = ko(a), v = zl(st, p);
                v.tag = Vh;
                var m = i.updateQueue;
                if (m !== null) {
                  var y = m.shared, R = y.pending;
                  R === null ? v.next = v : (v.next = R.next, R.next = v), y.pending = v;
                }
              }
              i.lanes = xe(i.lanes, a);
              var C = i.alternate;
              C !== null && (C.lanes = xe(C.lanes, a)), dg(i.return, a, e), s.lanes = xe(s.lanes, a);
              break;
            }
            f = f.next;
          }
        } else if (i.tag === lt)
          u = i.type === e.type ? null : i.child;
        else if (i.tag === Kt) {
          var _ = i.return;
          if (_ === null)
            throw new Error("We just came from a parent so we must have had a parent. This is a bug in React.");
          _.lanes = xe(_.lanes, a);
          var O = _.alternate;
          O !== null && (O.lanes = xe(O.lanes, a)), dg(_, a, e), u = i.sibling;
        } else
          u = i.child;
        if (u !== null)
          u.return = i;
        else
          for (u = i; u !== null; ) {
            if (u === e) {
              u = null;
              break;
            }
            var M = u.sibling;
            if (M !== null) {
              M.return = u.return, u = M;
              break;
            }
            u = u.return;
          }
        i = u;
      }
    }
    function Qc(e, t) {
      Ah = e, Yc = null, cg = null;
      var a = e.dependencies;
      if (a !== null) {
        var i = a.firstContext;
        i !== null && (nr(a.lanes, t) && pp(), a.firstContext = null);
      }
    }
    function nn(e) {
      Hh && g("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      var t = e._currentValue;
      if (cg !== e) {
        var a = {
          context: e,
          memoizedValue: t,
          next: null
        };
        if (Yc === null) {
          if (Ah === null)
            throw new Error("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
          Yc = a, Ah.dependencies = {
            lanes: A,
            firstContext: a
          };
        } else
          Yc = Yc.next = a;
      }
      return t;
    }
    var ts = null;
    function pg(e) {
      ts === null ? ts = [e] : ts.push(e);
    }
    function Ix() {
      if (ts !== null) {
        for (var e = 0; e < ts.length; e++) {
          var t = ts[e], a = t.interleaved;
          if (a !== null) {
            t.interleaved = null;
            var i = a.next, u = t.pending;
            if (u !== null) {
              var s = u.next;
              u.next = i, a.next = s;
            }
            t.pending = a;
          }
        }
        ts = null;
      }
    }
    function yE(e, t, a, i) {
      var u = t.interleaved;
      return u === null ? (a.next = a, pg(t)) : (a.next = u.next, u.next = a), t.interleaved = a, jh(e, i);
    }
    function $x(e, t, a, i) {
      var u = t.interleaved;
      u === null ? (a.next = a, pg(t)) : (a.next = u.next, u.next = a), t.interleaved = a;
    }
    function Gx(e, t, a, i) {
      var u = t.interleaved;
      return u === null ? (a.next = a, pg(t)) : (a.next = u.next, u.next = a), t.interleaved = a, jh(e, i);
    }
    function Pr(e, t) {
      return jh(e, t);
    }
    var Wx = jh;
    function jh(e, t) {
      e.lanes = xe(e.lanes, t);
      var a = e.alternate;
      a !== null && (a.lanes = xe(a.lanes, t)), a === null && (e.flags & (yt | Kn)) !== se && pT(e);
      for (var i = e, u = e.return; u !== null; )
        u.childLanes = xe(u.childLanes, t), a = u.alternate, a !== null ? a.childLanes = xe(a.childLanes, t) : (u.flags & (yt | Kn)) !== se && pT(e), i = u, u = u.return;
      if (i.tag === P) {
        var s = i.stateNode;
        return s;
      } else
        return null;
    }
    var gE = 0, SE = 1, Vh = 2, vg = 3, Bh = !1, hg, Ph;
    hg = !1, Ph = null;
    function mg(e) {
      var t = {
        baseState: e.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: {
          pending: null,
          interleaved: null,
          lanes: A
        },
        effects: null
      };
      e.updateQueue = t;
    }
    function EE(e, t) {
      var a = t.updateQueue, i = e.updateQueue;
      if (a === i) {
        var u = {
          baseState: i.baseState,
          firstBaseUpdate: i.firstBaseUpdate,
          lastBaseUpdate: i.lastBaseUpdate,
          shared: i.shared,
          effects: i.effects
        };
        t.updateQueue = u;
      }
    }
    function zl(e, t) {
      var a = {
        eventTime: e,
        lane: t,
        tag: gE,
        payload: null,
        callback: null,
        next: null
      };
      return a;
    }
    function Lu(e, t, a) {
      var i = e.updateQueue;
      if (i === null)
        return null;
      var u = i.shared;
      if (Ph === u && !hg && (g("An update (setState, replaceState, or forceUpdate) was scheduled from inside an update function. Update functions should be pure, with zero side-effects. Consider using componentDidUpdate or a callback."), hg = !0), $D()) {
        var s = u.pending;
        return s === null ? t.next = t : (t.next = s.next, s.next = t), u.pending = t, Wx(e, a);
      } else
        return Gx(e, u, t, a);
    }
    function Yh(e, t, a) {
      var i = t.updateQueue;
      if (i !== null) {
        var u = i.shared;
        if (fd(a)) {
          var s = u.lanes;
          s = pd(s, e.pendingLanes);
          var f = xe(s, a);
          u.lanes = f, mc(e, f);
        }
      }
    }
    function yg(e, t) {
      var a = e.updateQueue, i = e.alternate;
      if (i !== null) {
        var u = i.updateQueue;
        if (a === u) {
          var s = null, f = null, p = a.firstBaseUpdate;
          if (p !== null) {
            var v = p;
            do {
              var m = {
                eventTime: v.eventTime,
                lane: v.lane,
                tag: v.tag,
                payload: v.payload,
                callback: v.callback,
                next: null
              };
              f === null ? s = f = m : (f.next = m, f = m), v = v.next;
            } while (v !== null);
            f === null ? s = f = t : (f.next = t, f = t);
          } else
            s = f = t;
          a = {
            baseState: u.baseState,
            firstBaseUpdate: s,
            lastBaseUpdate: f,
            shared: u.shared,
            effects: u.effects
          }, e.updateQueue = a;
          return;
        }
      }
      var y = a.lastBaseUpdate;
      y === null ? a.firstBaseUpdate = t : y.next = t, a.lastBaseUpdate = t;
    }
    function Xx(e, t, a, i, u, s) {
      switch (a.tag) {
        case SE: {
          var f = a.payload;
          if (typeof f == "function") {
            vE();
            var p = f.call(s, i, u);
            {
              if (e.mode & nt) {
                gt(!0);
                try {
                  f.call(s, i, u);
                } finally {
                  gt(!1);
                }
              }
              hE();
            }
            return p;
          }
          return f;
        }
        case vg:
          e.flags = e.flags & ~Zt | oe;
        case gE: {
          var v = a.payload, m;
          if (typeof v == "function") {
            vE(), m = v.call(s, i, u);
            {
              if (e.mode & nt) {
                gt(!0);
                try {
                  v.call(s, i, u);
                } finally {
                  gt(!1);
                }
              }
              hE();
            }
          } else
            m = v;
          return m == null ? i : Ae({}, i, m);
        }
        case Vh:
          return Bh = !0, i;
      }
      return i;
    }
    function Qh(e, t, a, i) {
      var u = e.updateQueue;
      Bh = !1, Ph = u.shared;
      var s = u.firstBaseUpdate, f = u.lastBaseUpdate, p = u.shared.pending;
      if (p !== null) {
        u.shared.pending = null;
        var v = p, m = v.next;
        v.next = null, f === null ? s = m : f.next = m, f = v;
        var y = e.alternate;
        if (y !== null) {
          var R = y.updateQueue, C = R.lastBaseUpdate;
          C !== f && (C === null ? R.firstBaseUpdate = m : C.next = m, R.lastBaseUpdate = v);
        }
      }
      if (s !== null) {
        var _ = u.baseState, O = A, M = null, W = null, fe = null, ue = s;
        do {
          var Ve = ue.lane, ze = ue.eventTime;
          if (Tl(i, Ve)) {
            if (fe !== null) {
              var N = {
                eventTime: ze,
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: Be,
                tag: ue.tag,
                payload: ue.payload,
                callback: ue.callback,
                next: null
              };
              fe = fe.next = N;
            }
            _ = Xx(e, u, ue, _, t, a);
            var k = ue.callback;
            if (k !== null && // If the update was already committed, we should not queue its
            // callback again.
            ue.lane !== Be) {
              e.flags |= ct;
              var B = u.effects;
              B === null ? u.effects = [ue] : B.push(ue);
            }
          } else {
            var D = {
              eventTime: ze,
              lane: Ve,
              tag: ue.tag,
              payload: ue.payload,
              callback: ue.callback,
              next: null
            };
            fe === null ? (W = fe = D, M = _) : fe = fe.next = D, O = xe(O, Ve);
          }
          if (ue = ue.next, ue === null) {
            if (p = u.shared.pending, p === null)
              break;
            var Z = p, X = Z.next;
            Z.next = null, ue = X, u.lastBaseUpdate = Z, u.shared.pending = null;
          }
        } while (!0);
        fe === null && (M = _), u.baseState = M, u.firstBaseUpdate = W, u.lastBaseUpdate = fe;
        var Se = u.shared.interleaved;
        if (Se !== null) {
          var Te = Se;
          do
            O = xe(O, Te.lane), Te = Te.next;
          while (Te !== Se);
        } else s === null && (u.shared.lanes = A);
        wp(O), e.lanes = O, e.memoizedState = _;
      }
      Ph = null;
    }
    function qx(e, t) {
      if (typeof e != "function")
        throw new Error("Invalid argument passed as callback. Expected a function. Instead " + ("received: " + e));
      e.call(t);
    }
    function CE() {
      Bh = !1;
    }
    function Ih() {
      return Bh;
    }
    function TE(e, t, a) {
      var i = t.effects;
      if (t.effects = null, i !== null)
        for (var u = 0; u < i.length; u++) {
          var s = i[u], f = s.callback;
          f !== null && (s.callback = null, qx(f, a));
        }
    }
    var Jd = {}, Ou = Du(Jd), ep = Du(Jd), $h = Du(Jd);
    function Gh(e) {
      if (e === Jd)
        throw new Error("Expected host context to exist. This error is likely caused by a bug in React. Please file an issue.");
      return e;
    }
    function RE() {
      var e = Gh($h.current);
      return e;
    }
    function gg(e, t) {
      ur($h, t, e), ur(ep, e, e), ur(Ou, Jd, e);
      var a = p1(t);
      lr(Ou, e), ur(Ou, a, e);
    }
    function Ic(e) {
      lr(Ou, e), lr(ep, e), lr($h, e);
    }
    function Sg() {
      var e = Gh(Ou.current);
      return e;
    }
    function xE(e) {
      Gh($h.current);
      var t = Gh(Ou.current), a = v1(t, e.type);
      t !== a && (ur(ep, e, e), ur(Ou, a, e));
    }
    function Eg(e) {
      ep.current === e && (lr(Ou, e), lr(ep, e));
    }
    var Kx = 0, wE = 1, DE = 1, tp = 2, Za = Du(Kx);
    function Cg(e, t) {
      return (e & t) !== 0;
    }
    function $c(e) {
      return e & wE;
    }
    function Tg(e, t) {
      return e & wE | t;
    }
    function Zx(e, t) {
      return e | t;
    }
    function Mu(e, t) {
      ur(Za, t, e);
    }
    function Gc(e) {
      lr(Za, e);
    }
    function Jx(e, t) {
      var a = e.memoizedState;
      return a !== null ? a.dehydrated !== null : (e.memoizedProps, !0);
    }
    function Wh(e) {
      for (var t = e; t !== null; ) {
        if (t.tag === _e) {
          var a = t.memoizedState;
          if (a !== null) {
            var i = a.dehydrated;
            if (i === null || Y0(i) || Vy(i))
              return t;
          }
        } else if (t.tag === It && // revealOrder undefined can't be trusted because it don't
        // keep track of whether it suspended or not.
        t.memoizedProps.revealOrder !== void 0) {
          var u = (t.flags & oe) !== se;
          if (u)
            return t;
        } else if (t.child !== null) {
          t.child.return = t, t = t.child;
          continue;
        }
        if (t === e)
          return null;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e)
            return null;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
      return null;
    }
    var Yr = (
      /*   */
      0
    ), cn = (
      /* */
      1
    ), Ui = (
      /*  */
      2
    ), fn = (
      /*    */
      4
    ), Un = (
      /*   */
      8
    ), Rg = [];
    function xg() {
      for (var e = 0; e < Rg.length; e++) {
        var t = Rg[e];
        t._workInProgressVersionPrimary = null;
      }
      Rg.length = 0;
    }
    function ew(e, t) {
      var a = t._getVersion, i = a(t._source);
      e.mutableSourceEagerHydrationData == null ? e.mutableSourceEagerHydrationData = [t, i] : e.mutableSourceEagerHydrationData.push(t, i);
    }
    var K = x.ReactCurrentDispatcher, np = x.ReactCurrentBatchConfig, wg, Wc;
    wg = /* @__PURE__ */ new Set();
    var ns = A, rt = null, dn = null, pn = null, Xh = !1, rp = !1, ap = 0, tw = 0, nw = 25, z = null, _a = null, Nu = -1, Dg = !1;
    function qe() {
      {
        var e = z;
        _a === null ? _a = [e] : _a.push(e);
      }
    }
    function Y() {
      {
        var e = z;
        _a !== null && (Nu++, _a[Nu] !== e && rw(e));
      }
    }
    function Xc(e) {
      e != null && !an(e) && g("%s received a final argument that is not an array (instead, received `%s`). When specified, the final argument must be an array.", z, typeof e);
    }
    function rw(e) {
      {
        var t = Re(rt);
        if (!wg.has(t) && (wg.add(t), _a !== null)) {
          for (var a = "", i = 30, u = 0; u <= Nu; u++) {
            for (var s = _a[u], f = u === Nu ? e : s, p = u + 1 + ". " + s; p.length < i; )
              p += " ";
            p += f + `
`, a += p;
          }
          g(`React has detected a change in the order of Hooks called by %s. This will lead to bugs and errors if not fixed. For more information, read the Rules of Hooks: https://reactjs.org/link/rules-of-hooks

   Previous render            Next render
   ------------------------------------------------------
%s   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
`, t, a);
        }
      }
    }
    function or() {
      throw new Error(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.`);
    }
    function kg(e, t) {
      if (Dg)
        return !1;
      if (t === null)
        return g("%s received a final argument during this render, but not during the previous render. Even though the final argument is optional, its type cannot change between renders.", z), !1;
      e.length !== t.length && g(`The final argument passed to %s changed size between renders. The order and size of this array must remain constant.

Previous: %s
Incoming: %s`, z, "[" + t.join(", ") + "]", "[" + e.join(", ") + "]");
      for (var a = 0; a < t.length && a < e.length; a++)
        if (!j(e[a], t[a]))
          return !1;
      return !0;
    }
    function qc(e, t, a, i, u, s) {
      ns = s, rt = t, _a = e !== null ? e._debugHookTypes : null, Nu = -1, Dg = e !== null && e.type !== t.type, t.memoizedState = null, t.updateQueue = null, t.lanes = A, e !== null && e.memoizedState !== null ? K.current = WE : _a !== null ? K.current = GE : K.current = $E;
      var f = a(i, u);
      if (rp) {
        var p = 0;
        do {
          if (rp = !1, ap = 0, p >= nw)
            throw new Error("Too many re-renders. React limits the number of renders to prevent an infinite loop.");
          p += 1, Dg = !1, dn = null, pn = null, t.updateQueue = null, Nu = -1, K.current = XE, f = a(i, u);
        } while (rp);
      }
      K.current = om, t._debugHookTypes = _a;
      var v = dn !== null && dn.next !== null;
      if (ns = A, rt = null, dn = null, pn = null, z = null, _a = null, Nu = -1, e !== null && (e.flags & Ft) !== (t.flags & Ft) && // Disable this warning in legacy mode, because legacy Suspense is weird
      // and creates false positives. To make this work in legacy mode, we'd
      // need to mark fibers that commit in an incomplete state, somehow. For
      // now I'll disable the warning that most of the bugs that would trigger
      // it are either exclusive to concurrent mode or exist in both.
      (e.mode & ke) !== ce && g("Internal React error: Expected static flag was missing. Please notify the React team."), Xh = !1, v)
        throw new Error("Rendered fewer hooks than expected. This may be caused by an accidental early return statement.");
      return f;
    }
    function Kc() {
      var e = ap !== 0;
      return ap = 0, e;
    }
    function kE(e, t, a) {
      t.updateQueue = e.updateQueue, (t.mode & Ye) !== ce ? t.flags &= -50333701 : t.flags &= -2053, e.lanes = bo(e.lanes, a);
    }
    function bE() {
      if (K.current = om, Xh) {
        for (var e = rt.memoizedState; e !== null; ) {
          var t = e.queue;
          t !== null && (t.pending = null), e = e.next;
        }
        Xh = !1;
      }
      ns = A, rt = null, dn = null, pn = null, _a = null, Nu = -1, z = null, BE = !1, rp = !1, ap = 0;
    }
    function Ai() {
      var e = {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null
      };
      return pn === null ? rt.memoizedState = pn = e : pn = pn.next = e, pn;
    }
    function La() {
      var e;
      if (dn === null) {
        var t = rt.alternate;
        t !== null ? e = t.memoizedState : e = null;
      } else
        e = dn.next;
      var a;
      if (pn === null ? a = rt.memoizedState : a = pn.next, a !== null)
        pn = a, a = pn.next, dn = e;
      else {
        if (e === null)
          throw new Error("Rendered more hooks than during the previous render.");
        dn = e;
        var i = {
          memoizedState: dn.memoizedState,
          baseState: dn.baseState,
          baseQueue: dn.baseQueue,
          queue: dn.queue,
          next: null
        };
        pn === null ? rt.memoizedState = pn = i : pn = pn.next = i;
      }
      return pn;
    }
    function _E() {
      return {
        lastEffect: null,
        stores: null
      };
    }
    function bg(e, t) {
      return typeof t == "function" ? t(e) : t;
    }
    function _g(e, t, a) {
      var i = Ai(), u;
      a !== void 0 ? u = a(t) : u = t, i.memoizedState = i.baseState = u;
      var s = {
        pending: null,
        interleaved: null,
        lanes: A,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: u
      };
      i.queue = s;
      var f = s.dispatch = uw.bind(null, rt, s);
      return [i.memoizedState, f];
    }
    function Lg(e, t, a) {
      var i = La(), u = i.queue;
      if (u === null)
        throw new Error("Should have a queue. This is likely a bug in React. Please file an issue.");
      u.lastRenderedReducer = e;
      var s = dn, f = s.baseQueue, p = u.pending;
      if (p !== null) {
        if (f !== null) {
          var v = f.next, m = p.next;
          f.next = m, p.next = v;
        }
        s.baseQueue !== f && g("Internal error: Expected work-in-progress queue to be a clone. This is a bug in React."), s.baseQueue = f = p, u.pending = null;
      }
      if (f !== null) {
        var y = f.next, R = s.baseState, C = null, _ = null, O = null, M = y;
        do {
          var W = M.lane;
          if (Tl(ns, W)) {
            if (O !== null) {
              var ue = {
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: Be,
                action: M.action,
                hasEagerState: M.hasEagerState,
                eagerState: M.eagerState,
                next: null
              };
              O = O.next = ue;
            }
            if (M.hasEagerState)
              R = M.eagerState;
            else {
              var Ve = M.action;
              R = e(R, Ve);
            }
          } else {
            var fe = {
              lane: W,
              action: M.action,
              hasEagerState: M.hasEagerState,
              eagerState: M.eagerState,
              next: null
            };
            O === null ? (_ = O = fe, C = R) : O = O.next = fe, rt.lanes = xe(rt.lanes, W), wp(W);
          }
          M = M.next;
        } while (M !== null && M !== y);
        O === null ? C = R : O.next = _, j(R, i.memoizedState) || pp(), i.memoizedState = R, i.baseState = C, i.baseQueue = O, u.lastRenderedState = R;
      }
      var ze = u.interleaved;
      if (ze !== null) {
        var D = ze;
        do {
          var N = D.lane;
          rt.lanes = xe(rt.lanes, N), wp(N), D = D.next;
        } while (D !== ze);
      } else f === null && (u.lanes = A);
      var k = u.dispatch;
      return [i.memoizedState, k];
    }
    function Og(e, t, a) {
      var i = La(), u = i.queue;
      if (u === null)
        throw new Error("Should have a queue. This is likely a bug in React. Please file an issue.");
      u.lastRenderedReducer = e;
      var s = u.dispatch, f = u.pending, p = i.memoizedState;
      if (f !== null) {
        u.pending = null;
        var v = f.next, m = v;
        do {
          var y = m.action;
          p = e(p, y), m = m.next;
        } while (m !== v);
        j(p, i.memoizedState) || pp(), i.memoizedState = p, i.baseQueue === null && (i.baseState = p), u.lastRenderedState = p;
      }
      return [p, s];
    }
    function kb(e, t, a) {
    }
    function bb(e, t, a) {
    }
    function Mg(e, t, a) {
      var i = rt, u = Ai(), s, f = zn();
      if (f) {
        if (a === void 0)
          throw new Error("Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.");
        s = a(), Wc || s !== a() && (g("The result of getServerSnapshot should be cached to avoid an infinite loop"), Wc = !0);
      } else {
        if (s = t(), !Wc) {
          var p = t();
          j(s, p) || (g("The result of getSnapshot should be cached to avoid an infinite loop"), Wc = !0);
        }
        var v = km();
        if (v === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        vc(v, ns) || LE(i, t, s);
      }
      u.memoizedState = s;
      var m = {
        value: s,
        getSnapshot: t
      };
      return u.queue = m, em(ME.bind(null, i, m, e), [e]), i.flags |= qn, ip(cn | Un, OE.bind(null, i, m, s, t), void 0, null), s;
    }
    function qh(e, t, a) {
      var i = rt, u = La(), s = t();
      if (!Wc) {
        var f = t();
        j(s, f) || (g("The result of getSnapshot should be cached to avoid an infinite loop"), Wc = !0);
      }
      var p = u.memoizedState, v = !j(p, s);
      v && (u.memoizedState = s, pp());
      var m = u.queue;
      if (up(ME.bind(null, i, m, e), [e]), m.getSnapshot !== t || v || // Check if the susbcribe function changed. We can save some memory by
      // checking whether we scheduled a subscription effect above.
      pn !== null && pn.memoizedState.tag & cn) {
        i.flags |= qn, ip(cn | Un, OE.bind(null, i, m, s, t), void 0, null);
        var y = km();
        if (y === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        vc(y, ns) || LE(i, t, s);
      }
      return s;
    }
    function LE(e, t, a) {
      e.flags |= cu;
      var i = {
        getSnapshot: t,
        value: a
      }, u = rt.updateQueue;
      if (u === null)
        u = _E(), rt.updateQueue = u, u.stores = [i];
      else {
        var s = u.stores;
        s === null ? u.stores = [i] : s.push(i);
      }
    }
    function OE(e, t, a, i) {
      t.value = a, t.getSnapshot = i, NE(t) && zE(e);
    }
    function ME(e, t, a) {
      var i = function() {
        NE(t) && zE(e);
      };
      return a(i);
    }
    function NE(e) {
      var t = e.getSnapshot, a = e.value;
      try {
        var i = t();
        return !j(a, i);
      } catch {
        return !0;
      }
    }
    function zE(e) {
      var t = Pr(e, ye);
      t !== null && yn(t, e, ye, st);
    }
    function Kh(e) {
      var t = Ai();
      typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e;
      var a = {
        pending: null,
        interleaved: null,
        lanes: A,
        dispatch: null,
        lastRenderedReducer: bg,
        lastRenderedState: e
      };
      t.queue = a;
      var i = a.dispatch = ow.bind(null, rt, a);
      return [t.memoizedState, i];
    }
    function Ng(e) {
      return Lg(bg);
    }
    function zg(e) {
      return Og(bg);
    }
    function ip(e, t, a, i) {
      var u = {
        tag: e,
        create: t,
        destroy: a,
        deps: i,
        // Circular
        next: null
      }, s = rt.updateQueue;
      if (s === null)
        s = _E(), rt.updateQueue = s, s.lastEffect = u.next = u;
      else {
        var f = s.lastEffect;
        if (f === null)
          s.lastEffect = u.next = u;
        else {
          var p = f.next;
          f.next = u, u.next = p, s.lastEffect = u;
        }
      }
      return u;
    }
    function Ug(e) {
      var t = Ai();
      {
        var a = {
          current: e
        };
        return t.memoizedState = a, a;
      }
    }
    function Zh(e) {
      var t = La();
      return t.memoizedState;
    }
    function lp(e, t, a, i) {
      var u = Ai(), s = i === void 0 ? null : i;
      rt.flags |= e, u.memoizedState = ip(cn | t, a, void 0, s);
    }
    function Jh(e, t, a, i) {
      var u = La(), s = i === void 0 ? null : i, f = void 0;
      if (dn !== null) {
        var p = dn.memoizedState;
        if (f = p.destroy, s !== null) {
          var v = p.deps;
          if (kg(s, v)) {
            u.memoizedState = ip(t, a, f, s);
            return;
          }
        }
      }
      rt.flags |= e, u.memoizedState = ip(cn | t, a, f, s);
    }
    function em(e, t) {
      return (rt.mode & Ye) !== ce ? lp(ya | qn | Bs, Un, e, t) : lp(qn | Bs, Un, e, t);
    }
    function up(e, t) {
      return Jh(qn, Un, e, t);
    }
    function Ag(e, t) {
      return lp(He, Ui, e, t);
    }
    function tm(e, t) {
      return Jh(He, Ui, e, t);
    }
    function Hg(e, t) {
      var a = He;
      return a |= Va, (rt.mode & Ye) !== ce && (a |= yi), lp(a, fn, e, t);
    }
    function nm(e, t) {
      return Jh(He, fn, e, t);
    }
    function UE(e, t) {
      if (typeof t == "function") {
        var a = t, i = e();
        return a(i), function() {
          a(null);
        };
      } else if (t != null) {
        var u = t;
        u.hasOwnProperty("current") || g("Expected useImperativeHandle() first argument to either be a ref callback or React.createRef() object. Instead received: %s.", "an object with keys {" + Object.keys(u).join(", ") + "}");
        var s = e();
        return u.current = s, function() {
          u.current = null;
        };
      }
    }
    function Fg(e, t, a) {
      typeof t != "function" && g("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t !== null ? typeof t : "null");
      var i = a != null ? a.concat([e]) : null, u = He;
      return u |= Va, (rt.mode & Ye) !== ce && (u |= yi), lp(u, fn, UE.bind(null, t, e), i);
    }
    function rm(e, t, a) {
      typeof t != "function" && g("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t !== null ? typeof t : "null");
      var i = a != null ? a.concat([e]) : null;
      return Jh(He, fn, UE.bind(null, t, e), i);
    }
    function aw(e, t) {
    }
    var am = aw;
    function jg(e, t) {
      var a = Ai(), i = t === void 0 ? null : t;
      return a.memoizedState = [e, i], e;
    }
    function im(e, t) {
      var a = La(), i = t === void 0 ? null : t, u = a.memoizedState;
      if (u !== null && i !== null) {
        var s = u[1];
        if (kg(i, s))
          return u[0];
      }
      return a.memoizedState = [e, i], e;
    }
    function Vg(e, t) {
      var a = Ai(), i = t === void 0 ? null : t, u = e();
      return a.memoizedState = [u, i], u;
    }
    function lm(e, t) {
      var a = La(), i = t === void 0 ? null : t, u = a.memoizedState;
      if (u !== null && i !== null) {
        var s = u[1];
        if (kg(i, s))
          return u[0];
      }
      var f = e();
      return a.memoizedState = [f, i], f;
    }
    function Bg(e) {
      var t = Ai();
      return t.memoizedState = e, e;
    }
    function AE(e) {
      var t = La(), a = dn, i = a.memoizedState;
      return FE(t, i, e);
    }
    function HE(e) {
      var t = La();
      if (dn === null)
        return t.memoizedState = e, e;
      var a = dn.memoizedState;
      return FE(t, a, e);
    }
    function FE(e, t, a) {
      var i = !sd(ns);
      if (i) {
        if (!j(a, t)) {
          var u = dd();
          rt.lanes = xe(rt.lanes, u), wp(u), e.baseState = !0;
        }
        return t;
      } else
        return e.baseState && (e.baseState = !1, pp()), e.memoizedState = a, a;
    }
    function iw(e, t, a) {
      var i = jr();
      Bt(Hv(i, Ca)), e(!0);
      var u = np.transition;
      np.transition = {};
      var s = np.transition;
      np.transition._updatedFibers = /* @__PURE__ */ new Set();
      try {
        e(!1), t();
      } finally {
        if (Bt(i), np.transition = u, u === null && s._updatedFibers) {
          var f = s._updatedFibers.size;
          f > 10 && Ue("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), s._updatedFibers.clear();
        }
      }
    }
    function Pg() {
      var e = Kh(!1), t = e[0], a = e[1], i = iw.bind(null, a), u = Ai();
      return u.memoizedState = i, [t, i];
    }
    function jE() {
      var e = Ng(), t = e[0], a = La(), i = a.memoizedState;
      return [t, i];
    }
    function VE() {
      var e = zg(), t = e[0], a = La(), i = a.memoizedState;
      return [t, i];
    }
    var BE = !1;
    function lw() {
      return BE;
    }
    function Yg() {
      var e = Ai(), t = km(), a = t.identifierPrefix, i;
      if (zn()) {
        var u = Rx();
        i = ":" + a + "R" + u;
        var s = ap++;
        s > 0 && (i += "H" + s.toString(32)), i += ":";
      } else {
        var f = tw++;
        i = ":" + a + "r" + f.toString(32) + ":";
      }
      return e.memoizedState = i, i;
    }
    function um() {
      var e = La(), t = e.memoizedState;
      return t;
    }
    function uw(e, t, a) {
      typeof arguments[3] == "function" && g("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var i = Fu(e), u = {
        lane: i,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (PE(e))
        YE(t, u);
      else {
        var s = yE(e, t, u, i);
        if (s !== null) {
          var f = Tr();
          yn(s, e, i, f), QE(s, t, i);
        }
      }
      IE(e, i);
    }
    function ow(e, t, a) {
      typeof arguments[3] == "function" && g("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var i = Fu(e), u = {
        lane: i,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (PE(e))
        YE(t, u);
      else {
        var s = e.alternate;
        if (e.lanes === A && (s === null || s.lanes === A)) {
          var f = t.lastRenderedReducer;
          if (f !== null) {
            var p;
            p = K.current, K.current = Ja;
            try {
              var v = t.lastRenderedState, m = f(v, a);
              if (u.hasEagerState = !0, u.eagerState = m, j(m, v)) {
                $x(e, t, u, i);
                return;
              }
            } catch {
            } finally {
              K.current = p;
            }
          }
        }
        var y = yE(e, t, u, i);
        if (y !== null) {
          var R = Tr();
          yn(y, e, i, R), QE(y, t, i);
        }
      }
      IE(e, i);
    }
    function PE(e) {
      var t = e.alternate;
      return e === rt || t !== null && t === rt;
    }
    function YE(e, t) {
      rp = Xh = !0;
      var a = e.pending;
      a === null ? t.next = t : (t.next = a.next, a.next = t), e.pending = t;
    }
    function QE(e, t, a) {
      if (fd(a)) {
        var i = t.lanes;
        i = pd(i, e.pendingLanes);
        var u = xe(i, a);
        t.lanes = u, mc(e, u);
      }
    }
    function IE(e, t, a) {
      go(e, t);
    }
    var om = {
      readContext: nn,
      useCallback: or,
      useContext: or,
      useEffect: or,
      useImperativeHandle: or,
      useInsertionEffect: or,
      useLayoutEffect: or,
      useMemo: or,
      useReducer: or,
      useRef: or,
      useState: or,
      useDebugValue: or,
      useDeferredValue: or,
      useTransition: or,
      useMutableSource: or,
      useSyncExternalStore: or,
      useId: or,
      unstable_isNewReconciler: Q
    }, $E = null, GE = null, WE = null, XE = null, Hi = null, Ja = null, sm = null;
    {
      var Qg = function() {
        g("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      }, Ce = function() {
        g("Do not call Hooks inside useEffect(...), useMemo(...), or other built-in Hooks. You can only call Hooks at the top level of your React function. For more information, see https://reactjs.org/link/rules-of-hooks");
      };
      $E = {
        readContext: function(e) {
          return nn(e);
        },
        useCallback: function(e, t) {
          return z = "useCallback", qe(), Xc(t), jg(e, t);
        },
        useContext: function(e) {
          return z = "useContext", qe(), nn(e);
        },
        useEffect: function(e, t) {
          return z = "useEffect", qe(), Xc(t), em(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return z = "useImperativeHandle", qe(), Xc(a), Fg(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return z = "useInsertionEffect", qe(), Xc(t), Ag(e, t);
        },
        useLayoutEffect: function(e, t) {
          return z = "useLayoutEffect", qe(), Xc(t), Hg(e, t);
        },
        useMemo: function(e, t) {
          z = "useMemo", qe(), Xc(t);
          var a = K.current;
          K.current = Hi;
          try {
            return Vg(e, t);
          } finally {
            K.current = a;
          }
        },
        useReducer: function(e, t, a) {
          z = "useReducer", qe();
          var i = K.current;
          K.current = Hi;
          try {
            return _g(e, t, a);
          } finally {
            K.current = i;
          }
        },
        useRef: function(e) {
          return z = "useRef", qe(), Ug(e);
        },
        useState: function(e) {
          z = "useState", qe();
          var t = K.current;
          K.current = Hi;
          try {
            return Kh(e);
          } finally {
            K.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return z = "useDebugValue", qe(), void 0;
        },
        useDeferredValue: function(e) {
          return z = "useDeferredValue", qe(), Bg(e);
        },
        useTransition: function() {
          return z = "useTransition", qe(), Pg();
        },
        useMutableSource: function(e, t, a) {
          return z = "useMutableSource", qe(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return z = "useSyncExternalStore", qe(), Mg(e, t, a);
        },
        useId: function() {
          return z = "useId", qe(), Yg();
        },
        unstable_isNewReconciler: Q
      }, GE = {
        readContext: function(e) {
          return nn(e);
        },
        useCallback: function(e, t) {
          return z = "useCallback", Y(), jg(e, t);
        },
        useContext: function(e) {
          return z = "useContext", Y(), nn(e);
        },
        useEffect: function(e, t) {
          return z = "useEffect", Y(), em(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return z = "useImperativeHandle", Y(), Fg(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return z = "useInsertionEffect", Y(), Ag(e, t);
        },
        useLayoutEffect: function(e, t) {
          return z = "useLayoutEffect", Y(), Hg(e, t);
        },
        useMemo: function(e, t) {
          z = "useMemo", Y();
          var a = K.current;
          K.current = Hi;
          try {
            return Vg(e, t);
          } finally {
            K.current = a;
          }
        },
        useReducer: function(e, t, a) {
          z = "useReducer", Y();
          var i = K.current;
          K.current = Hi;
          try {
            return _g(e, t, a);
          } finally {
            K.current = i;
          }
        },
        useRef: function(e) {
          return z = "useRef", Y(), Ug(e);
        },
        useState: function(e) {
          z = "useState", Y();
          var t = K.current;
          K.current = Hi;
          try {
            return Kh(e);
          } finally {
            K.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return z = "useDebugValue", Y(), void 0;
        },
        useDeferredValue: function(e) {
          return z = "useDeferredValue", Y(), Bg(e);
        },
        useTransition: function() {
          return z = "useTransition", Y(), Pg();
        },
        useMutableSource: function(e, t, a) {
          return z = "useMutableSource", Y(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return z = "useSyncExternalStore", Y(), Mg(e, t, a);
        },
        useId: function() {
          return z = "useId", Y(), Yg();
        },
        unstable_isNewReconciler: Q
      }, WE = {
        readContext: function(e) {
          return nn(e);
        },
        useCallback: function(e, t) {
          return z = "useCallback", Y(), im(e, t);
        },
        useContext: function(e) {
          return z = "useContext", Y(), nn(e);
        },
        useEffect: function(e, t) {
          return z = "useEffect", Y(), up(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return z = "useImperativeHandle", Y(), rm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return z = "useInsertionEffect", Y(), tm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return z = "useLayoutEffect", Y(), nm(e, t);
        },
        useMemo: function(e, t) {
          z = "useMemo", Y();
          var a = K.current;
          K.current = Ja;
          try {
            return lm(e, t);
          } finally {
            K.current = a;
          }
        },
        useReducer: function(e, t, a) {
          z = "useReducer", Y();
          var i = K.current;
          K.current = Ja;
          try {
            return Lg(e, t, a);
          } finally {
            K.current = i;
          }
        },
        useRef: function(e) {
          return z = "useRef", Y(), Zh();
        },
        useState: function(e) {
          z = "useState", Y();
          var t = K.current;
          K.current = Ja;
          try {
            return Ng(e);
          } finally {
            K.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return z = "useDebugValue", Y(), am();
        },
        useDeferredValue: function(e) {
          return z = "useDeferredValue", Y(), AE(e);
        },
        useTransition: function() {
          return z = "useTransition", Y(), jE();
        },
        useMutableSource: function(e, t, a) {
          return z = "useMutableSource", Y(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return z = "useSyncExternalStore", Y(), qh(e, t);
        },
        useId: function() {
          return z = "useId", Y(), um();
        },
        unstable_isNewReconciler: Q
      }, XE = {
        readContext: function(e) {
          return nn(e);
        },
        useCallback: function(e, t) {
          return z = "useCallback", Y(), im(e, t);
        },
        useContext: function(e) {
          return z = "useContext", Y(), nn(e);
        },
        useEffect: function(e, t) {
          return z = "useEffect", Y(), up(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return z = "useImperativeHandle", Y(), rm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return z = "useInsertionEffect", Y(), tm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return z = "useLayoutEffect", Y(), nm(e, t);
        },
        useMemo: function(e, t) {
          z = "useMemo", Y();
          var a = K.current;
          K.current = sm;
          try {
            return lm(e, t);
          } finally {
            K.current = a;
          }
        },
        useReducer: function(e, t, a) {
          z = "useReducer", Y();
          var i = K.current;
          K.current = sm;
          try {
            return Og(e, t, a);
          } finally {
            K.current = i;
          }
        },
        useRef: function(e) {
          return z = "useRef", Y(), Zh();
        },
        useState: function(e) {
          z = "useState", Y();
          var t = K.current;
          K.current = sm;
          try {
            return zg(e);
          } finally {
            K.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return z = "useDebugValue", Y(), am();
        },
        useDeferredValue: function(e) {
          return z = "useDeferredValue", Y(), HE(e);
        },
        useTransition: function() {
          return z = "useTransition", Y(), VE();
        },
        useMutableSource: function(e, t, a) {
          return z = "useMutableSource", Y(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return z = "useSyncExternalStore", Y(), qh(e, t);
        },
        useId: function() {
          return z = "useId", Y(), um();
        },
        unstable_isNewReconciler: Q
      }, Hi = {
        readContext: function(e) {
          return Qg(), nn(e);
        },
        useCallback: function(e, t) {
          return z = "useCallback", Ce(), qe(), jg(e, t);
        },
        useContext: function(e) {
          return z = "useContext", Ce(), qe(), nn(e);
        },
        useEffect: function(e, t) {
          return z = "useEffect", Ce(), qe(), em(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return z = "useImperativeHandle", Ce(), qe(), Fg(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return z = "useInsertionEffect", Ce(), qe(), Ag(e, t);
        },
        useLayoutEffect: function(e, t) {
          return z = "useLayoutEffect", Ce(), qe(), Hg(e, t);
        },
        useMemo: function(e, t) {
          z = "useMemo", Ce(), qe();
          var a = K.current;
          K.current = Hi;
          try {
            return Vg(e, t);
          } finally {
            K.current = a;
          }
        },
        useReducer: function(e, t, a) {
          z = "useReducer", Ce(), qe();
          var i = K.current;
          K.current = Hi;
          try {
            return _g(e, t, a);
          } finally {
            K.current = i;
          }
        },
        useRef: function(e) {
          return z = "useRef", Ce(), qe(), Ug(e);
        },
        useState: function(e) {
          z = "useState", Ce(), qe();
          var t = K.current;
          K.current = Hi;
          try {
            return Kh(e);
          } finally {
            K.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return z = "useDebugValue", Ce(), qe(), void 0;
        },
        useDeferredValue: function(e) {
          return z = "useDeferredValue", Ce(), qe(), Bg(e);
        },
        useTransition: function() {
          return z = "useTransition", Ce(), qe(), Pg();
        },
        useMutableSource: function(e, t, a) {
          return z = "useMutableSource", Ce(), qe(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return z = "useSyncExternalStore", Ce(), qe(), Mg(e, t, a);
        },
        useId: function() {
          return z = "useId", Ce(), qe(), Yg();
        },
        unstable_isNewReconciler: Q
      }, Ja = {
        readContext: function(e) {
          return Qg(), nn(e);
        },
        useCallback: function(e, t) {
          return z = "useCallback", Ce(), Y(), im(e, t);
        },
        useContext: function(e) {
          return z = "useContext", Ce(), Y(), nn(e);
        },
        useEffect: function(e, t) {
          return z = "useEffect", Ce(), Y(), up(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return z = "useImperativeHandle", Ce(), Y(), rm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return z = "useInsertionEffect", Ce(), Y(), tm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return z = "useLayoutEffect", Ce(), Y(), nm(e, t);
        },
        useMemo: function(e, t) {
          z = "useMemo", Ce(), Y();
          var a = K.current;
          K.current = Ja;
          try {
            return lm(e, t);
          } finally {
            K.current = a;
          }
        },
        useReducer: function(e, t, a) {
          z = "useReducer", Ce(), Y();
          var i = K.current;
          K.current = Ja;
          try {
            return Lg(e, t, a);
          } finally {
            K.current = i;
          }
        },
        useRef: function(e) {
          return z = "useRef", Ce(), Y(), Zh();
        },
        useState: function(e) {
          z = "useState", Ce(), Y();
          var t = K.current;
          K.current = Ja;
          try {
            return Ng(e);
          } finally {
            K.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return z = "useDebugValue", Ce(), Y(), am();
        },
        useDeferredValue: function(e) {
          return z = "useDeferredValue", Ce(), Y(), AE(e);
        },
        useTransition: function() {
          return z = "useTransition", Ce(), Y(), jE();
        },
        useMutableSource: function(e, t, a) {
          return z = "useMutableSource", Ce(), Y(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return z = "useSyncExternalStore", Ce(), Y(), qh(e, t);
        },
        useId: function() {
          return z = "useId", Ce(), Y(), um();
        },
        unstable_isNewReconciler: Q
      }, sm = {
        readContext: function(e) {
          return Qg(), nn(e);
        },
        useCallback: function(e, t) {
          return z = "useCallback", Ce(), Y(), im(e, t);
        },
        useContext: function(e) {
          return z = "useContext", Ce(), Y(), nn(e);
        },
        useEffect: function(e, t) {
          return z = "useEffect", Ce(), Y(), up(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return z = "useImperativeHandle", Ce(), Y(), rm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return z = "useInsertionEffect", Ce(), Y(), tm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return z = "useLayoutEffect", Ce(), Y(), nm(e, t);
        },
        useMemo: function(e, t) {
          z = "useMemo", Ce(), Y();
          var a = K.current;
          K.current = Ja;
          try {
            return lm(e, t);
          } finally {
            K.current = a;
          }
        },
        useReducer: function(e, t, a) {
          z = "useReducer", Ce(), Y();
          var i = K.current;
          K.current = Ja;
          try {
            return Og(e, t, a);
          } finally {
            K.current = i;
          }
        },
        useRef: function(e) {
          return z = "useRef", Ce(), Y(), Zh();
        },
        useState: function(e) {
          z = "useState", Ce(), Y();
          var t = K.current;
          K.current = Ja;
          try {
            return zg(e);
          } finally {
            K.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return z = "useDebugValue", Ce(), Y(), am();
        },
        useDeferredValue: function(e) {
          return z = "useDeferredValue", Ce(), Y(), HE(e);
        },
        useTransition: function() {
          return z = "useTransition", Ce(), Y(), VE();
        },
        useMutableSource: function(e, t, a) {
          return z = "useMutableSource", Ce(), Y(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return z = "useSyncExternalStore", Ce(), Y(), qh(e, t);
        },
        useId: function() {
          return z = "useId", Ce(), Y(), um();
        },
        unstable_isNewReconciler: Q
      };
    }
    var zu = $.unstable_now, qE = 0, cm = -1, op = -1, fm = -1, Ig = !1, dm = !1;
    function KE() {
      return Ig;
    }
    function sw() {
      dm = !0;
    }
    function cw() {
      Ig = !1, dm = !1;
    }
    function fw() {
      Ig = dm, dm = !1;
    }
    function ZE() {
      return qE;
    }
    function JE() {
      qE = zu();
    }
    function $g(e) {
      op = zu(), e.actualStartTime < 0 && (e.actualStartTime = zu());
    }
    function eC(e) {
      op = -1;
    }
    function pm(e, t) {
      if (op >= 0) {
        var a = zu() - op;
        e.actualDuration += a, t && (e.selfBaseDuration = a), op = -1;
      }
    }
    function Fi(e) {
      if (cm >= 0) {
        var t = zu() - cm;
        cm = -1;
        for (var a = e.return; a !== null; ) {
          switch (a.tag) {
            case P:
              var i = a.stateNode;
              i.effectDuration += t;
              return;
            case be:
              var u = a.stateNode;
              u.effectDuration += t;
              return;
          }
          a = a.return;
        }
      }
    }
    function Gg(e) {
      if (fm >= 0) {
        var t = zu() - fm;
        fm = -1;
        for (var a = e.return; a !== null; ) {
          switch (a.tag) {
            case P:
              var i = a.stateNode;
              i !== null && (i.passiveEffectDuration += t);
              return;
            case be:
              var u = a.stateNode;
              u !== null && (u.passiveEffectDuration += t);
              return;
          }
          a = a.return;
        }
      }
    }
    function ji() {
      cm = zu();
    }
    function Wg() {
      fm = zu();
    }
    function Xg(e) {
      for (var t = e.child; t; )
        e.actualDuration += t.actualDuration, t = t.sibling;
    }
    function ei(e, t) {
      if (e && e.defaultProps) {
        var a = Ae({}, t), i = e.defaultProps;
        for (var u in i)
          a[u] === void 0 && (a[u] = i[u]);
        return a;
      }
      return t;
    }
    var qg = {}, Kg, Zg, Jg, eS, tS, tC, vm, nS, rS, aS, sp;
    {
      Kg = /* @__PURE__ */ new Set(), Zg = /* @__PURE__ */ new Set(), Jg = /* @__PURE__ */ new Set(), eS = /* @__PURE__ */ new Set(), nS = /* @__PURE__ */ new Set(), tS = /* @__PURE__ */ new Set(), rS = /* @__PURE__ */ new Set(), aS = /* @__PURE__ */ new Set(), sp = /* @__PURE__ */ new Set();
      var nC = /* @__PURE__ */ new Set();
      vm = function(e, t) {
        if (!(e === null || typeof e == "function")) {
          var a = t + "_" + e;
          nC.has(a) || (nC.add(a), g("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e));
        }
      }, tC = function(e, t) {
        if (t === void 0) {
          var a = Ze(e) || "Component";
          tS.has(a) || (tS.add(a), g("%s.getDerivedStateFromProps(): A valid state object (or null) must be returned. You have returned undefined.", a));
        }
      }, Object.defineProperty(qg, "_processChildContext", {
        enumerable: !1,
        value: function() {
          throw new Error("_processChildContext is not available in React 16+. This likely means you have multiple copies of React and are attempting to nest a React 15 tree inside a React 16 tree using unstable_renderSubtreeIntoContainer, which isn't supported. Try to make sure you have only one copy of React (and ideally, switch to ReactDOM.createPortal).");
        }
      }), Object.freeze(qg);
    }
    function iS(e, t, a, i) {
      var u = e.memoizedState, s = a(i, u);
      {
        if (e.mode & nt) {
          gt(!0);
          try {
            s = a(i, u);
          } finally {
            gt(!1);
          }
        }
        tC(t, s);
      }
      var f = s == null ? u : Ae({}, u, s);
      if (e.memoizedState = f, e.lanes === A) {
        var p = e.updateQueue;
        p.baseState = f;
      }
    }
    var lS = {
      isMounted: Cv,
      enqueueSetState: function(e, t, a) {
        var i = su(e), u = Tr(), s = Fu(i), f = zl(u, s);
        f.payload = t, a != null && (vm(a, "setState"), f.callback = a);
        var p = Lu(i, f, s);
        p !== null && (yn(p, i, s, u), Yh(p, i, s)), go(i, s);
      },
      enqueueReplaceState: function(e, t, a) {
        var i = su(e), u = Tr(), s = Fu(i), f = zl(u, s);
        f.tag = SE, f.payload = t, a != null && (vm(a, "replaceState"), f.callback = a);
        var p = Lu(i, f, s);
        p !== null && (yn(p, i, s, u), Yh(p, i, s)), go(i, s);
      },
      enqueueForceUpdate: function(e, t) {
        var a = su(e), i = Tr(), u = Fu(a), s = zl(i, u);
        s.tag = Vh, t != null && (vm(t, "forceUpdate"), s.callback = t);
        var f = Lu(a, s, u);
        f !== null && (yn(f, a, u, i), Yh(f, a, u)), Ws(a, u);
      }
    };
    function rC(e, t, a, i, u, s, f) {
      var p = e.stateNode;
      if (typeof p.shouldComponentUpdate == "function") {
        var v = p.shouldComponentUpdate(i, s, f);
        {
          if (e.mode & nt) {
            gt(!0);
            try {
              v = p.shouldComponentUpdate(i, s, f);
            } finally {
              gt(!1);
            }
          }
          v === void 0 && g("%s.shouldComponentUpdate(): Returned undefined instead of a boolean value. Make sure to return true or false.", Ze(t) || "Component");
        }
        return v;
      }
      return t.prototype && t.prototype.isPureReactComponent ? !re(a, i) || !re(u, s) : !0;
    }
    function dw(e, t, a) {
      var i = e.stateNode;
      {
        var u = Ze(t) || "Component", s = i.render;
        s || (t.prototype && typeof t.prototype.render == "function" ? g("%s(...): No `render` method found on the returned component instance: did you accidentally return an object from the constructor?", u) : g("%s(...): No `render` method found on the returned component instance: you may have forgotten to define `render`.", u)), i.getInitialState && !i.getInitialState.isReactClassApproved && !i.state && g("getInitialState was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Did you mean to define a state property instead?", u), i.getDefaultProps && !i.getDefaultProps.isReactClassApproved && g("getDefaultProps was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Use a static property to define defaultProps instead.", u), i.propTypes && g("propTypes was defined as an instance property on %s. Use a static property to define propTypes instead.", u), i.contextType && g("contextType was defined as an instance property on %s. Use a static property to define contextType instead.", u), t.childContextTypes && !sp.has(t) && // Strict Mode has its own warning for legacy context, so we can skip
        // this one.
        (e.mode & nt) === ce && (sp.add(t), g(`%s uses the legacy childContextTypes API which is no longer supported and will be removed in the next major release. Use React.createContext() instead

.Learn more about this warning here: https://reactjs.org/link/legacy-context`, u)), t.contextTypes && !sp.has(t) && // Strict Mode has its own warning for legacy context, so we can skip
        // this one.
        (e.mode & nt) === ce && (sp.add(t), g(`%s uses the legacy contextTypes API which is no longer supported and will be removed in the next major release. Use React.createContext() with static contextType instead.

Learn more about this warning here: https://reactjs.org/link/legacy-context`, u)), i.contextTypes && g("contextTypes was defined as an instance property on %s. Use a static property to define contextTypes instead.", u), t.contextType && t.contextTypes && !rS.has(t) && (rS.add(t), g("%s declares both contextTypes and contextType static properties. The legacy contextTypes property will be ignored.", u)), typeof i.componentShouldUpdate == "function" && g("%s has a method called componentShouldUpdate(). Did you mean shouldComponentUpdate()? The name is phrased as a question because the function is expected to return a value.", u), t.prototype && t.prototype.isPureReactComponent && typeof i.shouldComponentUpdate < "u" && g("%s has a method called shouldComponentUpdate(). shouldComponentUpdate should not be used when extending React.PureComponent. Please extend React.Component if shouldComponentUpdate is used.", Ze(t) || "A pure component"), typeof i.componentDidUnmount == "function" && g("%s has a method called componentDidUnmount(). But there is no such lifecycle method. Did you mean componentWillUnmount()?", u), typeof i.componentDidReceiveProps == "function" && g("%s has a method called componentDidReceiveProps(). But there is no such lifecycle method. If you meant to update the state in response to changing props, use componentWillReceiveProps(). If you meant to fetch data or run side-effects or mutations after React has updated the UI, use componentDidUpdate().", u), typeof i.componentWillRecieveProps == "function" && g("%s has a method called componentWillRecieveProps(). Did you mean componentWillReceiveProps()?", u), typeof i.UNSAFE_componentWillRecieveProps == "function" && g("%s has a method called UNSAFE_componentWillRecieveProps(). Did you mean UNSAFE_componentWillReceiveProps()?", u);
        var f = i.props !== a;
        i.props !== void 0 && f && g("%s(...): When calling super() in `%s`, make sure to pass up the same props that your component's constructor was passed.", u, u), i.defaultProps && g("Setting defaultProps as an instance property on %s is not supported and will be ignored. Instead, define defaultProps as a static property on %s.", u, u), typeof i.getSnapshotBeforeUpdate == "function" && typeof i.componentDidUpdate != "function" && !Jg.has(t) && (Jg.add(t), g("%s: getSnapshotBeforeUpdate() should be used with componentDidUpdate(). This component defines getSnapshotBeforeUpdate() only.", Ze(t))), typeof i.getDerivedStateFromProps == "function" && g("%s: getDerivedStateFromProps() is defined as an instance method and will be ignored. Instead, declare it as a static method.", u), typeof i.getDerivedStateFromError == "function" && g("%s: getDerivedStateFromError() is defined as an instance method and will be ignored. Instead, declare it as a static method.", u), typeof t.getSnapshotBeforeUpdate == "function" && g("%s: getSnapshotBeforeUpdate() is defined as a static method and will be ignored. Instead, declare it as an instance method.", u);
        var p = i.state;
        p && (typeof p != "object" || an(p)) && g("%s.state: must be set to an object or null", u), typeof i.getChildContext == "function" && typeof t.childContextTypes != "object" && g("%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().", u);
      }
    }
    function aC(e, t) {
      t.updater = lS, e.stateNode = t, ol(t, e), t._reactInternalInstance = qg;
    }
    function iC(e, t, a) {
      var i = !1, u = la, s = la, f = t.contextType;
      if ("contextType" in t) {
        var p = (
          // Allow null for conditional declaration
          f === null || f !== void 0 && f.$$typeof === Iu && f._context === void 0
        );
        if (!p && !aS.has(t)) {
          aS.add(t);
          var v = "";
          f === void 0 ? v = " However, it is set to undefined. This can be caused by a typo or by mixing up named and default imports. This can also happen due to a circular dependency, so try moving the createContext() call to a separate file." : typeof f != "object" ? v = " However, it is set to a " + typeof f + "." : f.$$typeof === Xl ? v = " Did you accidentally pass the Context.Provider instead?" : f._context !== void 0 ? v = " Did you accidentally pass the Context.Consumer instead?" : v = " However, it is set to an object with keys {" + Object.keys(f).join(", ") + "}.", g("%s defines an invalid contextType. contextType should point to the Context object returned by React.createContext().%s", Ze(t) || "Component", v);
        }
      }
      if (typeof f == "object" && f !== null)
        s = nn(f);
      else {
        u = Hc(e, t, !0);
        var m = t.contextTypes;
        i = m != null, s = i ? Fc(e, u) : la;
      }
      var y = new t(a, s);
      if (e.mode & nt) {
        gt(!0);
        try {
          y = new t(a, s);
        } finally {
          gt(!1);
        }
      }
      var R = e.memoizedState = y.state !== null && y.state !== void 0 ? y.state : null;
      aC(e, y);
      {
        if (typeof t.getDerivedStateFromProps == "function" && R === null) {
          var C = Ze(t) || "Component";
          Zg.has(C) || (Zg.add(C), g("`%s` uses `getDerivedStateFromProps` but its initial state is %s. This is not recommended. Instead, define the initial state by assigning an object to `this.state` in the constructor of `%s`. This ensures that `getDerivedStateFromProps` arguments have a consistent shape.", C, y.state === null ? "null" : "undefined", C));
        }
        if (typeof t.getDerivedStateFromProps == "function" || typeof y.getSnapshotBeforeUpdate == "function") {
          var _ = null, O = null, M = null;
          if (typeof y.componentWillMount == "function" && y.componentWillMount.__suppressDeprecationWarning !== !0 ? _ = "componentWillMount" : typeof y.UNSAFE_componentWillMount == "function" && (_ = "UNSAFE_componentWillMount"), typeof y.componentWillReceiveProps == "function" && y.componentWillReceiveProps.__suppressDeprecationWarning !== !0 ? O = "componentWillReceiveProps" : typeof y.UNSAFE_componentWillReceiveProps == "function" && (O = "UNSAFE_componentWillReceiveProps"), typeof y.componentWillUpdate == "function" && y.componentWillUpdate.__suppressDeprecationWarning !== !0 ? M = "componentWillUpdate" : typeof y.UNSAFE_componentWillUpdate == "function" && (M = "UNSAFE_componentWillUpdate"), _ !== null || O !== null || M !== null) {
            var W = Ze(t) || "Component", fe = typeof t.getDerivedStateFromProps == "function" ? "getDerivedStateFromProps()" : "getSnapshotBeforeUpdate()";
            eS.has(W) || (eS.add(W), g(`Unsafe legacy lifecycles will not be called for components using new component APIs.

%s uses %s but also contains the following legacy lifecycles:%s%s%s

The above lifecycles should be removed. Learn more about this warning here:
https://reactjs.org/link/unsafe-component-lifecycles`, W, fe, _ !== null ? `
  ` + _ : "", O !== null ? `
  ` + O : "", M !== null ? `
  ` + M : ""));
          }
        }
      }
      return i && W0(e, u, s), y;
    }
    function pw(e, t) {
      var a = t.state;
      typeof t.componentWillMount == "function" && t.componentWillMount(), typeof t.UNSAFE_componentWillMount == "function" && t.UNSAFE_componentWillMount(), a !== t.state && (g("%s.componentWillMount(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", Re(e) || "Component"), lS.enqueueReplaceState(t, t.state, null));
    }
    function lC(e, t, a, i) {
      var u = t.state;
      if (typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(a, i), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(a, i), t.state !== u) {
        {
          var s = Re(e) || "Component";
          Kg.has(s) || (Kg.add(s), g("%s.componentWillReceiveProps(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", s));
        }
        lS.enqueueReplaceState(t, t.state, null);
      }
    }
    function uS(e, t, a, i) {
      dw(e, t, a);
      var u = e.stateNode;
      u.props = a, u.state = e.memoizedState, u.refs = {}, mg(e);
      var s = t.contextType;
      if (typeof s == "object" && s !== null)
        u.context = nn(s);
      else {
        var f = Hc(e, t, !0);
        u.context = Fc(e, f);
      }
      {
        if (u.state === a) {
          var p = Ze(t) || "Component";
          nS.has(p) || (nS.add(p), g("%s: It is not recommended to assign props directly to state because updates to props won't be reflected in state. In most cases, it is better to use props directly.", p));
        }
        e.mode & nt && Ka.recordLegacyContextWarning(e, u), Ka.recordUnsafeLifecycleWarnings(e, u);
      }
      u.state = e.memoizedState;
      var v = t.getDerivedStateFromProps;
      if (typeof v == "function" && (iS(e, t, v, a), u.state = e.memoizedState), typeof t.getDerivedStateFromProps != "function" && typeof u.getSnapshotBeforeUpdate != "function" && (typeof u.UNSAFE_componentWillMount == "function" || typeof u.componentWillMount == "function") && (pw(e, u), Qh(e, a, u, i), u.state = e.memoizedState), typeof u.componentDidMount == "function") {
        var m = He;
        m |= Va, (e.mode & Ye) !== ce && (m |= yi), e.flags |= m;
      }
    }
    function vw(e, t, a, i) {
      var u = e.stateNode, s = e.memoizedProps;
      u.props = s;
      var f = u.context, p = t.contextType, v = la;
      if (typeof p == "object" && p !== null)
        v = nn(p);
      else {
        var m = Hc(e, t, !0);
        v = Fc(e, m);
      }
      var y = t.getDerivedStateFromProps, R = typeof y == "function" || typeof u.getSnapshotBeforeUpdate == "function";
      !R && (typeof u.UNSAFE_componentWillReceiveProps == "function" || typeof u.componentWillReceiveProps == "function") && (s !== a || f !== v) && lC(e, u, a, v), CE();
      var C = e.memoizedState, _ = u.state = C;
      if (Qh(e, a, u, i), _ = e.memoizedState, s === a && C === _ && !wh() && !Ih()) {
        if (typeof u.componentDidMount == "function") {
          var O = He;
          O |= Va, (e.mode & Ye) !== ce && (O |= yi), e.flags |= O;
        }
        return !1;
      }
      typeof y == "function" && (iS(e, t, y, a), _ = e.memoizedState);
      var M = Ih() || rC(e, t, s, a, C, _, v);
      if (M) {
        if (!R && (typeof u.UNSAFE_componentWillMount == "function" || typeof u.componentWillMount == "function") && (typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount()), typeof u.componentDidMount == "function") {
          var W = He;
          W |= Va, (e.mode & Ye) !== ce && (W |= yi), e.flags |= W;
        }
      } else {
        if (typeof u.componentDidMount == "function") {
          var fe = He;
          fe |= Va, (e.mode & Ye) !== ce && (fe |= yi), e.flags |= fe;
        }
        e.memoizedProps = a, e.memoizedState = _;
      }
      return u.props = a, u.state = _, u.context = v, M;
    }
    function hw(e, t, a, i, u) {
      var s = t.stateNode;
      EE(e, t);
      var f = t.memoizedProps, p = t.type === t.elementType ? f : ei(t.type, f);
      s.props = p;
      var v = t.pendingProps, m = s.context, y = a.contextType, R = la;
      if (typeof y == "object" && y !== null)
        R = nn(y);
      else {
        var C = Hc(t, a, !0);
        R = Fc(t, C);
      }
      var _ = a.getDerivedStateFromProps, O = typeof _ == "function" || typeof s.getSnapshotBeforeUpdate == "function";
      !O && (typeof s.UNSAFE_componentWillReceiveProps == "function" || typeof s.componentWillReceiveProps == "function") && (f !== v || m !== R) && lC(t, s, i, R), CE();
      var M = t.memoizedState, W = s.state = M;
      if (Qh(t, i, s, u), W = t.memoizedState, f === v && M === W && !wh() && !Ih() && !he)
        return typeof s.componentDidUpdate == "function" && (f !== e.memoizedProps || M !== e.memoizedState) && (t.flags |= He), typeof s.getSnapshotBeforeUpdate == "function" && (f !== e.memoizedProps || M !== e.memoizedState) && (t.flags |= Gt), !1;
      typeof _ == "function" && (iS(t, a, _, i), W = t.memoizedState);
      var fe = Ih() || rC(t, a, p, i, M, W, R) || // TODO: In some cases, we'll end up checking if context has changed twice,
      // both before and after `shouldComponentUpdate` has been called. Not ideal,
      // but I'm loath to refactor this function. This only happens for memoized
      // components so it's not that common.
      he;
      return fe ? (!O && (typeof s.UNSAFE_componentWillUpdate == "function" || typeof s.componentWillUpdate == "function") && (typeof s.componentWillUpdate == "function" && s.componentWillUpdate(i, W, R), typeof s.UNSAFE_componentWillUpdate == "function" && s.UNSAFE_componentWillUpdate(i, W, R)), typeof s.componentDidUpdate == "function" && (t.flags |= He), typeof s.getSnapshotBeforeUpdate == "function" && (t.flags |= Gt)) : (typeof s.componentDidUpdate == "function" && (f !== e.memoizedProps || M !== e.memoizedState) && (t.flags |= He), typeof s.getSnapshotBeforeUpdate == "function" && (f !== e.memoizedProps || M !== e.memoizedState) && (t.flags |= Gt), t.memoizedProps = i, t.memoizedState = W), s.props = i, s.state = W, s.context = R, fe;
    }
    function rs(e, t) {
      return {
        value: e,
        source: t,
        stack: hs(t),
        digest: null
      };
    }
    function oS(e, t, a) {
      return {
        value: e,
        source: null,
        stack: a ?? null,
        digest: t ?? null
      };
    }
    function mw(e, t) {
      return !0;
    }
    function sS(e, t) {
      try {
        var a = mw(e, t);
        if (a === !1)
          return;
        var i = t.value, u = t.source, s = t.stack, f = s !== null ? s : "";
        if (i != null && i._suppressLogging) {
          if (e.tag === le)
            return;
          console.error(i);
        }
        var p = u ? Re(u) : null, v = p ? "The above error occurred in the <" + p + "> component:" : "The above error occurred in one of your React components:", m;
        if (e.tag === P)
          m = `Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.`;
        else {
          var y = Re(e) || "Anonymous";
          m = "React will try to recreate this component tree from scratch " + ("using the error boundary you provided, " + y + ".");
        }
        var R = v + `
` + f + `

` + ("" + m);
        console.error(R);
      } catch (C) {
        setTimeout(function() {
          throw C;
        });
      }
    }
    var yw = typeof WeakMap == "function" ? WeakMap : Map;
    function uC(e, t, a) {
      var i = zl(st, a);
      i.tag = vg, i.payload = {
        element: null
      };
      var u = t.value;
      return i.callback = function() {
        sk(u), sS(e, t);
      }, i;
    }
    function cS(e, t, a) {
      var i = zl(st, a);
      i.tag = vg;
      var u = e.type.getDerivedStateFromError;
      if (typeof u == "function") {
        var s = t.value;
        i.payload = function() {
          return u(s);
        }, i.callback = function() {
          gT(e), sS(e, t);
        };
      }
      var f = e.stateNode;
      return f !== null && typeof f.componentDidCatch == "function" && (i.callback = function() {
        gT(e), sS(e, t), typeof u != "function" && uk(this);
        var v = t.value, m = t.stack;
        this.componentDidCatch(v, {
          componentStack: m !== null ? m : ""
        }), typeof u != "function" && (nr(e.lanes, ye) || g("%s: Error boundaries should implement getDerivedStateFromError(). In that method, return a state update to display an error message or fallback UI.", Re(e) || "Unknown"));
      }), i;
    }
    function oC(e, t, a) {
      var i = e.pingCache, u;
      if (i === null ? (i = e.pingCache = new yw(), u = /* @__PURE__ */ new Set(), i.set(t, u)) : (u = i.get(t), u === void 0 && (u = /* @__PURE__ */ new Set(), i.set(t, u))), !u.has(a)) {
        u.add(a);
        var s = ck.bind(null, e, t, a);
        er && Dp(e, a), t.then(s, s);
      }
    }
    function gw(e, t, a, i) {
      var u = e.updateQueue;
      if (u === null) {
        var s = /* @__PURE__ */ new Set();
        s.add(a), e.updateQueue = s;
      } else
        u.add(a);
    }
    function Sw(e, t) {
      var a = e.tag;
      if ((e.mode & ke) === ce && (a === ge || a === De || a === Me)) {
        var i = e.alternate;
        i ? (e.updateQueue = i.updateQueue, e.memoizedState = i.memoizedState, e.lanes = i.lanes) : (e.updateQueue = null, e.memoizedState = null);
      }
    }
    function sC(e) {
      var t = e;
      do {
        if (t.tag === _e && Jx(t))
          return t;
        t = t.return;
      } while (t !== null);
      return null;
    }
    function cC(e, t, a, i, u) {
      if ((e.mode & ke) === ce) {
        if (e === t)
          e.flags |= Zt;
        else {
          if (e.flags |= oe, a.flags |= Vs, a.flags &= -52805, a.tag === le) {
            var s = a.alternate;
            if (s === null)
              a.tag = Ct;
            else {
              var f = zl(st, ye);
              f.tag = Vh, Lu(a, f, ye);
            }
          }
          a.lanes = xe(a.lanes, ye);
        }
        return e;
      }
      return e.flags |= Zt, e.lanes = u, e;
    }
    function Ew(e, t, a, i, u) {
      if (a.flags |= fo, er && Dp(e, u), i !== null && typeof i == "object" && typeof i.then == "function") {
        var s = i;
        Sw(a), zn() && a.mode & ke && tE();
        var f = sC(t);
        if (f !== null) {
          f.flags &= ~Cn, cC(f, t, a, e, u), f.mode & ke && oC(e, s, u), gw(f, e, s);
          return;
        } else {
          if (!_v(u)) {
            oC(e, s, u), YS();
            return;
          }
          var p = new Error("A component suspended while responding to synchronous input. This will cause the UI to be replaced with a loading indicator. To fix, updates that suspend should be wrapped with startTransition.");
          i = p;
        }
      } else if (zn() && a.mode & ke) {
        tE();
        var v = sC(t);
        if (v !== null) {
          (v.flags & Zt) === se && (v.flags |= Cn), cC(v, t, a, e, u), ng(rs(i, a));
          return;
        }
      }
      i = rs(i, a), JD(i);
      var m = t;
      do {
        switch (m.tag) {
          case P: {
            var y = i;
            m.flags |= Zt;
            var R = ko(u);
            m.lanes = xe(m.lanes, R);
            var C = uC(m, y, R);
            yg(m, C);
            return;
          }
          case le:
            var _ = i, O = m.type, M = m.stateNode;
            if ((m.flags & oe) === se && (typeof O.getDerivedStateFromError == "function" || M !== null && typeof M.componentDidCatch == "function" && !sT(M))) {
              m.flags |= Zt;
              var W = ko(u);
              m.lanes = xe(m.lanes, W);
              var fe = cS(m, _, W);
              yg(m, fe);
              return;
            }
            break;
        }
        m = m.return;
      } while (m !== null);
    }
    function Cw() {
      return null;
    }
    var cp = x.ReactCurrentOwner, ti = !1, fS, fp, dS, pS, vS, as, hS, hm, dp;
    fS = {}, fp = {}, dS = {}, pS = {}, vS = {}, as = !1, hS = {}, hm = {}, dp = {};
    function Er(e, t, a, i) {
      e === null ? t.child = pE(t, null, a, i) : t.child = Pc(t, e.child, a, i);
    }
    function Tw(e, t, a, i) {
      t.child = Pc(t, e.child, null, i), t.child = Pc(t, null, a, i);
    }
    function fC(e, t, a, i, u) {
      if (t.type !== t.elementType) {
        var s = a.propTypes;
        s && Xa(
          s,
          i,
          // Resolved props
          "prop",
          Ze(a)
        );
      }
      var f = a.render, p = t.ref, v, m;
      Qc(t, u), mr(t);
      {
        if (cp.current = t, rn(!0), v = qc(e, t, f, i, p, u), m = Kc(), t.mode & nt) {
          gt(!0);
          try {
            v = qc(e, t, f, i, p, u), m = Kc();
          } finally {
            gt(!1);
          }
        }
        rn(!1);
      }
      return yr(), e !== null && !ti ? (kE(e, t, u), Ul(e, t, u)) : (zn() && m && qy(t), t.flags |= ta, Er(e, t, v, u), t.child);
    }
    function dC(e, t, a, i, u) {
      if (e === null) {
        var s = a.type;
        if (kk(s) && a.compare === null && // SimpleMemoComponent codepath doesn't resolve outer props either.
        a.defaultProps === void 0) {
          var f = s;
          return f = lf(s), t.tag = Me, t.type = f, gS(t, s), pC(e, t, f, i, u);
        }
        {
          var p = s.propTypes;
          if (p && Xa(
            p,
            i,
            // Resolved props
            "prop",
            Ze(s)
          ), a.defaultProps !== void 0) {
            var v = Ze(s) || "Unknown";
            dp[v] || (g("%s: Support for defaultProps will be removed from memo components in a future major release. Use JavaScript default parameters instead.", v), dp[v] = !0);
          }
        }
        var m = e0(a.type, null, i, t, t.mode, u);
        return m.ref = t.ref, m.return = t, t.child = m, m;
      }
      {
        var y = a.type, R = y.propTypes;
        R && Xa(
          R,
          i,
          // Resolved props
          "prop",
          Ze(y)
        );
      }
      var C = e.child, _ = xS(e, u);
      if (!_) {
        var O = C.memoizedProps, M = a.compare;
        if (M = M !== null ? M : re, M(O, i) && e.ref === t.ref)
          return Ul(e, t, u);
      }
      t.flags |= ta;
      var W = ss(C, i);
      return W.ref = t.ref, W.return = t, t.child = W, W;
    }
    function pC(e, t, a, i, u) {
      if (t.type !== t.elementType) {
        var s = t.elementType;
        if (s.$$typeof === En) {
          var f = s, p = f._payload, v = f._init;
          try {
            s = v(p);
          } catch {
            s = null;
          }
          var m = s && s.propTypes;
          m && Xa(
            m,
            i,
            // Resolved (SimpleMemoComponent has no defaultProps)
            "prop",
            Ze(s)
          );
        }
      }
      if (e !== null) {
        var y = e.memoizedProps;
        if (re(y, i) && e.ref === t.ref && // Prevent bailout if the implementation changed due to hot reload.
        t.type === e.type)
          if (ti = !1, t.pendingProps = i = y, xS(e, u))
            (e.flags & Vs) !== se && (ti = !0);
          else return t.lanes = e.lanes, Ul(e, t, u);
      }
      return mS(e, t, a, i, u);
    }
    function vC(e, t, a) {
      var i = t.pendingProps, u = i.children, s = e !== null ? e.memoizedState : null;
      if (i.mode === "hidden" || te)
        if ((t.mode & ke) === ce) {
          var f = {
            baseLanes: A,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = f, bm(t, a);
        } else if (nr(a, tr)) {
          var R = {
            baseLanes: A,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = R;
          var C = s !== null ? s.baseLanes : a;
          bm(t, C);
        } else {
          var p = null, v;
          if (s !== null) {
            var m = s.baseLanes;
            v = xe(m, a);
          } else
            v = a;
          t.lanes = t.childLanes = tr;
          var y = {
            baseLanes: v,
            cachePool: p,
            transitions: null
          };
          return t.memoizedState = y, t.updateQueue = null, bm(t, v), null;
        }
      else {
        var _;
        s !== null ? (_ = xe(s.baseLanes, a), t.memoizedState = null) : _ = a, bm(t, _);
      }
      return Er(e, t, u, a), t.child;
    }
    function Rw(e, t, a) {
      var i = t.pendingProps;
      return Er(e, t, i, a), t.child;
    }
    function xw(e, t, a) {
      var i = t.pendingProps.children;
      return Er(e, t, i, a), t.child;
    }
    function ww(e, t, a) {
      {
        t.flags |= He;
        {
          var i = t.stateNode;
          i.effectDuration = 0, i.passiveEffectDuration = 0;
        }
      }
      var u = t.pendingProps, s = u.children;
      return Er(e, t, s, a), t.child;
    }
    function hC(e, t) {
      var a = t.ref;
      (e === null && a !== null || e !== null && e.ref !== a) && (t.flags |= wt, t.flags |= fu);
    }
    function mS(e, t, a, i, u) {
      if (t.type !== t.elementType) {
        var s = a.propTypes;
        s && Xa(
          s,
          i,
          // Resolved props
          "prop",
          Ze(a)
        );
      }
      var f;
      {
        var p = Hc(t, a, !0);
        f = Fc(t, p);
      }
      var v, m;
      Qc(t, u), mr(t);
      {
        if (cp.current = t, rn(!0), v = qc(e, t, a, i, f, u), m = Kc(), t.mode & nt) {
          gt(!0);
          try {
            v = qc(e, t, a, i, f, u), m = Kc();
          } finally {
            gt(!1);
          }
        }
        rn(!1);
      }
      return yr(), e !== null && !ti ? (kE(e, t, u), Ul(e, t, u)) : (zn() && m && qy(t), t.flags |= ta, Er(e, t, v, u), t.child);
    }
    function mC(e, t, a, i, u) {
      {
        switch (Pk(t)) {
          case !1: {
            var s = t.stateNode, f = t.type, p = new f(t.memoizedProps, s.context), v = p.state;
            s.updater.enqueueSetState(s, v, null);
            break;
          }
          case !0: {
            t.flags |= oe, t.flags |= Zt;
            var m = new Error("Simulated error coming from DevTools"), y = ko(u);
            t.lanes = xe(t.lanes, y);
            var R = cS(t, rs(m, t), y);
            yg(t, R);
            break;
          }
        }
        if (t.type !== t.elementType) {
          var C = a.propTypes;
          C && Xa(
            C,
            i,
            // Resolved props
            "prop",
            Ze(a)
          );
        }
      }
      var _;
      zi(a) ? (_ = !0, kh(t)) : _ = !1, Qc(t, u);
      var O = t.stateNode, M;
      O === null ? (ym(e, t), iC(t, a, i), uS(t, a, i, u), M = !0) : e === null ? M = vw(t, a, i, u) : M = hw(e, t, a, i, u);
      var W = yS(e, t, a, M, _, u);
      {
        var fe = t.stateNode;
        M && fe.props !== i && (as || g("It looks like %s is reassigning its own `this.props` while rendering. This is not supported and can lead to confusing bugs.", Re(t) || "a component"), as = !0);
      }
      return W;
    }
    function yS(e, t, a, i, u, s) {
      hC(e, t);
      var f = (t.flags & oe) !== se;
      if (!i && !f)
        return u && K0(t, a, !1), Ul(e, t, s);
      var p = t.stateNode;
      cp.current = t;
      var v;
      if (f && typeof a.getDerivedStateFromError != "function")
        v = null, eC();
      else {
        mr(t);
        {
          if (rn(!0), v = p.render(), t.mode & nt) {
            gt(!0);
            try {
              p.render();
            } finally {
              gt(!1);
            }
          }
          rn(!1);
        }
        yr();
      }
      return t.flags |= ta, e !== null && f ? Tw(e, t, v, s) : Er(e, t, v, s), t.memoizedState = p.state, u && K0(t, a, !0), t.child;
    }
    function yC(e) {
      var t = e.stateNode;
      t.pendingContext ? X0(e, t.pendingContext, t.pendingContext !== t.context) : t.context && X0(e, t.context, !1), gg(e, t.containerInfo);
    }
    function Dw(e, t, a) {
      if (yC(t), e === null)
        throw new Error("Should have a current fiber. This is a bug in React.");
      var i = t.pendingProps, u = t.memoizedState, s = u.element;
      EE(e, t), Qh(t, i, null, a);
      var f = t.memoizedState;
      t.stateNode;
      var p = f.element;
      if (u.isDehydrated) {
        var v = {
          element: p,
          isDehydrated: !1,
          cache: f.cache,
          pendingSuspenseBoundaries: f.pendingSuspenseBoundaries,
          transitions: f.transitions
        }, m = t.updateQueue;
        if (m.baseState = v, t.memoizedState = v, t.flags & Cn) {
          var y = rs(new Error("There was an error while hydrating. Because the error happened outside of a Suspense boundary, the entire root will switch to client rendering."), t);
          return gC(e, t, p, a, y);
        } else if (p !== s) {
          var R = rs(new Error("This root received an early update, before anything was able hydrate. Switched the entire root to client rendering."), t);
          return gC(e, t, p, a, R);
        } else {
          _x(t);
          var C = pE(t, null, p, a);
          t.child = C;
          for (var _ = C; _; )
            _.flags = _.flags & ~yt | Kn, _ = _.sibling;
        }
      } else {
        if (Bc(), p === s)
          return Ul(e, t, a);
        Er(e, t, p, a);
      }
      return t.child;
    }
    function gC(e, t, a, i, u) {
      return Bc(), ng(u), t.flags |= Cn, Er(e, t, a, i), t.child;
    }
    function kw(e, t, a) {
      xE(t), e === null && tg(t);
      var i = t.type, u = t.pendingProps, s = e !== null ? e.memoizedProps : null, f = u.children, p = Ay(i, u);
      return p ? f = null : s !== null && Ay(i, s) && (t.flags |= Nr), hC(e, t), Er(e, t, f, a), t.child;
    }
    function bw(e, t) {
      return e === null && tg(t), null;
    }
    function _w(e, t, a, i) {
      ym(e, t);
      var u = t.pendingProps, s = a, f = s._payload, p = s._init, v = p(f);
      t.type = v;
      var m = t.tag = bk(v), y = ei(v, u), R;
      switch (m) {
        case ge:
          return gS(t, v), t.type = v = lf(v), R = mS(null, t, v, y, i), R;
        case le:
          return t.type = v = WS(v), R = mC(null, t, v, y, i), R;
        case De:
          return t.type = v = XS(v), R = fC(null, t, v, y, i), R;
        case mt: {
          if (t.type !== t.elementType) {
            var C = v.propTypes;
            C && Xa(
              C,
              y,
              // Resolved for outer only
              "prop",
              Ze(v)
            );
          }
          return R = dC(
            null,
            t,
            v,
            ei(v.type, y),
            // The inner type can have defaults too
            i
          ), R;
        }
      }
      var _ = "";
      throw v !== null && typeof v == "object" && v.$$typeof === En && (_ = " Did you wrap a component in React.lazy() more than once?"), new Error("Element type is invalid. Received a promise that resolves to: " + v + ". " + ("Lazy element type must resolve to a class or function." + _));
    }
    function Lw(e, t, a, i, u) {
      ym(e, t), t.tag = le;
      var s;
      return zi(a) ? (s = !0, kh(t)) : s = !1, Qc(t, u), iC(t, a, i), uS(t, a, i, u), yS(null, t, a, !0, s, u);
    }
    function Ow(e, t, a, i) {
      ym(e, t);
      var u = t.pendingProps, s;
      {
        var f = Hc(t, a, !1);
        s = Fc(t, f);
      }
      Qc(t, i);
      var p, v;
      mr(t);
      {
        if (a.prototype && typeof a.prototype.render == "function") {
          var m = Ze(a) || "Unknown";
          fS[m] || (g("The <%s /> component appears to have a render method, but doesn't extend React.Component. This is likely to cause errors. Change %s to extend React.Component instead.", m, m), fS[m] = !0);
        }
        t.mode & nt && Ka.recordLegacyContextWarning(t, null), rn(!0), cp.current = t, p = qc(null, t, a, u, s, i), v = Kc(), rn(!1);
      }
      if (yr(), t.flags |= ta, typeof p == "object" && p !== null && typeof p.render == "function" && p.$$typeof === void 0) {
        var y = Ze(a) || "Unknown";
        fp[y] || (g("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", y, y, y), fp[y] = !0);
      }
      if (
        // Run these checks in production only if the flag is off.
        // Eventually we'll delete this branch altogether.
        typeof p == "object" && p !== null && typeof p.render == "function" && p.$$typeof === void 0
      ) {
        {
          var R = Ze(a) || "Unknown";
          fp[R] || (g("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", R, R, R), fp[R] = !0);
        }
        t.tag = le, t.memoizedState = null, t.updateQueue = null;
        var C = !1;
        return zi(a) ? (C = !0, kh(t)) : C = !1, t.memoizedState = p.state !== null && p.state !== void 0 ? p.state : null, mg(t), aC(t, p), uS(t, a, u, i), yS(null, t, a, !0, C, i);
      } else {
        if (t.tag = ge, t.mode & nt) {
          gt(!0);
          try {
            p = qc(null, t, a, u, s, i), v = Kc();
          } finally {
            gt(!1);
          }
        }
        return zn() && v && qy(t), Er(null, t, p, i), gS(t, a), t.child;
      }
    }
    function gS(e, t) {
      {
        if (t && t.childContextTypes && g("%s(...): childContextTypes cannot be defined on a function component.", t.displayName || t.name || "Component"), e.ref !== null) {
          var a = "", i = _r();
          i && (a += `

Check the render method of \`` + i + "`.");
          var u = i || "", s = e._debugSource;
          s && (u = s.fileName + ":" + s.lineNumber), vS[u] || (vS[u] = !0, g("Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?%s", a));
        }
        if (t.defaultProps !== void 0) {
          var f = Ze(t) || "Unknown";
          dp[f] || (g("%s: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.", f), dp[f] = !0);
        }
        if (typeof t.getDerivedStateFromProps == "function") {
          var p = Ze(t) || "Unknown";
          pS[p] || (g("%s: Function components do not support getDerivedStateFromProps.", p), pS[p] = !0);
        }
        if (typeof t.contextType == "object" && t.contextType !== null) {
          var v = Ze(t) || "Unknown";
          dS[v] || (g("%s: Function components do not support contextType.", v), dS[v] = !0);
        }
      }
    }
    var SS = {
      dehydrated: null,
      treeContext: null,
      retryLane: Be
    };
    function ES(e) {
      return {
        baseLanes: e,
        cachePool: Cw(),
        transitions: null
      };
    }
    function Mw(e, t) {
      var a = null;
      return {
        baseLanes: xe(e.baseLanes, t),
        cachePool: a,
        transitions: e.transitions
      };
    }
    function Nw(e, t, a, i) {
      if (t !== null) {
        var u = t.memoizedState;
        if (u === null)
          return !1;
      }
      return Cg(e, tp);
    }
    function zw(e, t) {
      return bo(e.childLanes, t);
    }
    function SC(e, t, a) {
      var i = t.pendingProps;
      Yk(t) && (t.flags |= oe);
      var u = Za.current, s = !1, f = (t.flags & oe) !== se;
      if (f || Nw(u, e) ? (s = !0, t.flags &= ~oe) : (e === null || e.memoizedState !== null) && (u = Zx(u, DE)), u = $c(u), Mu(t, u), e === null) {
        tg(t);
        var p = t.memoizedState;
        if (p !== null) {
          var v = p.dehydrated;
          if (v !== null)
            return jw(t, v);
        }
        var m = i.children, y = i.fallback;
        if (s) {
          var R = Uw(t, m, y, a), C = t.child;
          return C.memoizedState = ES(a), t.memoizedState = SS, R;
        } else
          return CS(t, m);
      } else {
        var _ = e.memoizedState;
        if (_ !== null) {
          var O = _.dehydrated;
          if (O !== null)
            return Vw(e, t, f, i, O, _, a);
        }
        if (s) {
          var M = i.fallback, W = i.children, fe = Hw(e, t, W, M, a), ue = t.child, Ve = e.child.memoizedState;
          return ue.memoizedState = Ve === null ? ES(a) : Mw(Ve, a), ue.childLanes = zw(e, a), t.memoizedState = SS, fe;
        } else {
          var ze = i.children, D = Aw(e, t, ze, a);
          return t.memoizedState = null, D;
        }
      }
    }
    function CS(e, t, a) {
      var i = e.mode, u = {
        mode: "visible",
        children: t
      }, s = TS(u, i);
      return s.return = e, e.child = s, s;
    }
    function Uw(e, t, a, i) {
      var u = e.mode, s = e.child, f = {
        mode: "hidden",
        children: t
      }, p, v;
      return (u & ke) === ce && s !== null ? (p = s, p.childLanes = A, p.pendingProps = f, e.mode & Pe && (p.actualDuration = 0, p.actualStartTime = -1, p.selfBaseDuration = 0, p.treeBaseDuration = 0), v = Vu(a, u, i, null)) : (p = TS(f, u), v = Vu(a, u, i, null)), p.return = e, v.return = e, p.sibling = v, e.child = p, v;
    }
    function TS(e, t, a) {
      return ET(e, t, A, null);
    }
    function EC(e, t) {
      return ss(e, t);
    }
    function Aw(e, t, a, i) {
      var u = e.child, s = u.sibling, f = EC(u, {
        mode: "visible",
        children: a
      });
      if ((t.mode & ke) === ce && (f.lanes = i), f.return = t, f.sibling = null, s !== null) {
        var p = t.deletions;
        p === null ? (t.deletions = [s], t.flags |= Mr) : p.push(s);
      }
      return t.child = f, f;
    }
    function Hw(e, t, a, i, u) {
      var s = t.mode, f = e.child, p = f.sibling, v = {
        mode: "hidden",
        children: a
      }, m;
      if (
        // In legacy mode, we commit the primary tree as if it successfully
        // completed, even though it's in an inconsistent state.
        (s & ke) === ce && // Make sure we're on the second pass, i.e. the primary child fragment was
        // already cloned. In legacy mode, the only case where this isn't true is
        // when DevTools forces us to display a fallback; we skip the first render
        // pass entirely and go straight to rendering the fallback. (In Concurrent
        // Mode, SuspenseList can also trigger this scenario, but this is a legacy-
        // only codepath.)
        t.child !== f
      ) {
        var y = t.child;
        m = y, m.childLanes = A, m.pendingProps = v, t.mode & Pe && (m.actualDuration = 0, m.actualStartTime = -1, m.selfBaseDuration = f.selfBaseDuration, m.treeBaseDuration = f.treeBaseDuration), t.deletions = null;
      } else
        m = EC(f, v), m.subtreeFlags = f.subtreeFlags & Ft;
      var R;
      return p !== null ? R = ss(p, i) : (R = Vu(i, s, u, null), R.flags |= yt), R.return = t, m.return = t, m.sibling = R, t.child = m, R;
    }
    function mm(e, t, a, i) {
      i !== null && ng(i), Pc(t, e.child, null, a);
      var u = t.pendingProps, s = u.children, f = CS(t, s);
      return f.flags |= yt, t.memoizedState = null, f;
    }
    function Fw(e, t, a, i, u) {
      var s = t.mode, f = {
        mode: "visible",
        children: a
      }, p = TS(f, s), v = Vu(i, s, u, null);
      return v.flags |= yt, p.return = t, v.return = t, p.sibling = v, t.child = p, (t.mode & ke) !== ce && Pc(t, e.child, null, u), v;
    }
    function jw(e, t, a) {
      return (e.mode & ke) === ce ? (g("Cannot hydrate Suspense in legacy mode. Switch from ReactDOM.hydrate(element, container) to ReactDOMClient.hydrateRoot(container, <App />).render(element) or remove the Suspense components from the server rendered components."), e.lanes = ye) : Vy(t) ? e.lanes = Tn : e.lanes = tr, null;
    }
    function Vw(e, t, a, i, u, s, f) {
      if (a)
        if (t.flags & Cn) {
          t.flags &= ~Cn;
          var D = oS(new Error("There was an error while hydrating this Suspense boundary. Switched to client rendering."));
          return mm(e, t, f, D);
        } else {
          if (t.memoizedState !== null)
            return t.child = e.child, t.flags |= oe, null;
          var N = i.children, k = i.fallback, B = Fw(e, t, N, k, f), Z = t.child;
          return Z.memoizedState = ES(f), t.memoizedState = SS, B;
        }
      else {
        if (kx(), (t.mode & ke) === ce)
          return mm(
            e,
            t,
            f,
            // TODO: When we delete legacy mode, we should make this error argument
            // required — every concurrent mode path that causes hydration to
            // de-opt to client rendering should have an error message.
            null
          );
        if (Vy(u)) {
          var p, v, m;
          {
            var y = Q1(u);
            p = y.digest, v = y.message, m = y.stack;
          }
          var R;
          v ? R = new Error(v) : R = new Error("The server could not finish this Suspense boundary, likely due to an error during server rendering. Switched to client rendering.");
          var C = oS(R, p, m);
          return mm(e, t, f, C);
        }
        var _ = nr(f, e.childLanes);
        if (ti || _) {
          var O = km();
          if (O !== null) {
            var M = hd(O, f);
            if (M !== Be && M !== s.retryLane) {
              s.retryLane = M;
              var W = st;
              Pr(e, M), yn(O, e, M, W);
            }
          }
          YS();
          var fe = oS(new Error("This Suspense boundary received an update before it finished hydrating. This caused the boundary to switch to client rendering. The usual way to fix this is to wrap the original update in startTransition."));
          return mm(e, t, f, fe);
        } else if (Y0(u)) {
          t.flags |= oe, t.child = e.child;
          var ue = fk.bind(null, e);
          return I1(u, ue), null;
        } else {
          Lx(t, u, s.treeContext);
          var Ve = i.children, ze = CS(t, Ve);
          return ze.flags |= Kn, ze;
        }
      }
    }
    function CC(e, t, a) {
      e.lanes = xe(e.lanes, t);
      var i = e.alternate;
      i !== null && (i.lanes = xe(i.lanes, t)), dg(e.return, t, a);
    }
    function Bw(e, t, a) {
      for (var i = t; i !== null; ) {
        if (i.tag === _e) {
          var u = i.memoizedState;
          u !== null && CC(i, a, e);
        } else if (i.tag === It)
          CC(i, a, e);
        else if (i.child !== null) {
          i.child.return = i, i = i.child;
          continue;
        }
        if (i === e)
          return;
        for (; i.sibling === null; ) {
          if (i.return === null || i.return === e)
            return;
          i = i.return;
        }
        i.sibling.return = i.return, i = i.sibling;
      }
    }
    function Pw(e) {
      for (var t = e, a = null; t !== null; ) {
        var i = t.alternate;
        i !== null && Wh(i) === null && (a = t), t = t.sibling;
      }
      return a;
    }
    function Yw(e) {
      if (e !== void 0 && e !== "forwards" && e !== "backwards" && e !== "together" && !hS[e])
        if (hS[e] = !0, typeof e == "string")
          switch (e.toLowerCase()) {
            case "together":
            case "forwards":
            case "backwards": {
              g('"%s" is not a valid value for revealOrder on <SuspenseList />. Use lowercase "%s" instead.', e, e.toLowerCase());
              break;
            }
            case "forward":
            case "backward": {
              g('"%s" is not a valid value for revealOrder on <SuspenseList />. React uses the -s suffix in the spelling. Use "%ss" instead.', e, e.toLowerCase());
              break;
            }
            default:
              g('"%s" is not a supported revealOrder on <SuspenseList />. Did you mean "together", "forwards" or "backwards"?', e);
              break;
          }
        else
          g('%s is not a supported value for revealOrder on <SuspenseList />. Did you mean "together", "forwards" or "backwards"?', e);
    }
    function Qw(e, t) {
      e !== void 0 && !hm[e] && (e !== "collapsed" && e !== "hidden" ? (hm[e] = !0, g('"%s" is not a supported value for tail on <SuspenseList />. Did you mean "collapsed" or "hidden"?', e)) : t !== "forwards" && t !== "backwards" && (hm[e] = !0, g('<SuspenseList tail="%s" /> is only valid if revealOrder is "forwards" or "backwards". Did you mean to specify revealOrder="forwards"?', e)));
    }
    function TC(e, t) {
      {
        var a = an(e), i = !a && typeof ot(e) == "function";
        if (a || i) {
          var u = a ? "array" : "iterable";
          return g("A nested %s was passed to row #%s in <SuspenseList />. Wrap it in an additional SuspenseList to configure its revealOrder: <SuspenseList revealOrder=...> ... <SuspenseList revealOrder=...>{%s}</SuspenseList> ... </SuspenseList>", u, t, u), !1;
        }
      }
      return !0;
    }
    function Iw(e, t) {
      if ((t === "forwards" || t === "backwards") && e !== void 0 && e !== null && e !== !1)
        if (an(e)) {
          for (var a = 0; a < e.length; a++)
            if (!TC(e[a], a))
              return;
        } else {
          var i = ot(e);
          if (typeof i == "function") {
            var u = i.call(e);
            if (u)
              for (var s = u.next(), f = 0; !s.done; s = u.next()) {
                if (!TC(s.value, f))
                  return;
                f++;
              }
          } else
            g('A single row was passed to a <SuspenseList revealOrder="%s" />. This is not useful since it needs multiple rows. Did you mean to pass multiple children or an array?', t);
        }
    }
    function RS(e, t, a, i, u) {
      var s = e.memoizedState;
      s === null ? e.memoizedState = {
        isBackwards: t,
        rendering: null,
        renderingStartTime: 0,
        last: i,
        tail: a,
        tailMode: u
      } : (s.isBackwards = t, s.rendering = null, s.renderingStartTime = 0, s.last = i, s.tail = a, s.tailMode = u);
    }
    function RC(e, t, a) {
      var i = t.pendingProps, u = i.revealOrder, s = i.tail, f = i.children;
      Yw(u), Qw(s, u), Iw(f, u), Er(e, t, f, a);
      var p = Za.current, v = Cg(p, tp);
      if (v)
        p = Tg(p, tp), t.flags |= oe;
      else {
        var m = e !== null && (e.flags & oe) !== se;
        m && Bw(t, t.child, a), p = $c(p);
      }
      if (Mu(t, p), (t.mode & ke) === ce)
        t.memoizedState = null;
      else
        switch (u) {
          case "forwards": {
            var y = Pw(t.child), R;
            y === null ? (R = t.child, t.child = null) : (R = y.sibling, y.sibling = null), RS(
              t,
              !1,
              // isBackwards
              R,
              y,
              s
            );
            break;
          }
          case "backwards": {
            var C = null, _ = t.child;
            for (t.child = null; _ !== null; ) {
              var O = _.alternate;
              if (O !== null && Wh(O) === null) {
                t.child = _;
                break;
              }
              var M = _.sibling;
              _.sibling = C, C = _, _ = M;
            }
            RS(
              t,
              !0,
              // isBackwards
              C,
              null,
              // last
              s
            );
            break;
          }
          case "together": {
            RS(
              t,
              !1,
              // isBackwards
              null,
              // tail
              null,
              // last
              void 0
            );
            break;
          }
          default:
            t.memoizedState = null;
        }
      return t.child;
    }
    function $w(e, t, a) {
      gg(t, t.stateNode.containerInfo);
      var i = t.pendingProps;
      return e === null ? t.child = Pc(t, null, i, a) : Er(e, t, i, a), t.child;
    }
    var xC = !1;
    function Gw(e, t, a) {
      var i = t.type, u = i._context, s = t.pendingProps, f = t.memoizedProps, p = s.value;
      {
        "value" in s || xC || (xC = !0, g("The `value` prop is required for the `<Context.Provider>`. Did you misspell it or forget to pass it?"));
        var v = t.type.propTypes;
        v && Xa(v, s, "prop", "Context.Provider");
      }
      if (mE(t, u, p), f !== null) {
        var m = f.value;
        if (j(m, p)) {
          if (f.children === s.children && !wh())
            return Ul(e, t, a);
        } else
          Yx(t, u, a);
      }
      var y = s.children;
      return Er(e, t, y, a), t.child;
    }
    var wC = !1;
    function Ww(e, t, a) {
      var i = t.type;
      i._context === void 0 ? i !== i.Consumer && (wC || (wC = !0, g("Rendering <Context> directly is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?"))) : i = i._context;
      var u = t.pendingProps, s = u.children;
      typeof s != "function" && g("A context consumer was rendered with multiple children, or a child that isn't a function. A context consumer expects a single child that is a function. If you did pass a function, make sure there is no trailing or leading whitespace around it."), Qc(t, a);
      var f = nn(i);
      mr(t);
      var p;
      return cp.current = t, rn(!0), p = s(f), rn(!1), yr(), t.flags |= ta, Er(e, t, p, a), t.child;
    }
    function pp() {
      ti = !0;
    }
    function ym(e, t) {
      (t.mode & ke) === ce && e !== null && (e.alternate = null, t.alternate = null, t.flags |= yt);
    }
    function Ul(e, t, a) {
      return e !== null && (t.dependencies = e.dependencies), eC(), wp(t.lanes), nr(a, t.childLanes) ? (Bx(e, t), t.child) : null;
    }
    function Xw(e, t, a) {
      {
        var i = t.return;
        if (i === null)
          throw new Error("Cannot swap the root fiber.");
        if (e.alternate = null, t.alternate = null, a.index = t.index, a.sibling = t.sibling, a.return = t.return, a.ref = t.ref, t === i.child)
          i.child = a;
        else {
          var u = i.child;
          if (u === null)
            throw new Error("Expected parent to have a child.");
          for (; u.sibling !== t; )
            if (u = u.sibling, u === null)
              throw new Error("Expected to find the previous sibling.");
          u.sibling = a;
        }
        var s = i.deletions;
        return s === null ? (i.deletions = [e], i.flags |= Mr) : s.push(e), a.flags |= yt, a;
      }
    }
    function xS(e, t) {
      var a = e.lanes;
      return !!nr(a, t);
    }
    function qw(e, t, a) {
      switch (t.tag) {
        case P:
          yC(t), t.stateNode, Bc();
          break;
        case J:
          xE(t);
          break;
        case le: {
          var i = t.type;
          zi(i) && kh(t);
          break;
        }
        case me:
          gg(t, t.stateNode.containerInfo);
          break;
        case lt: {
          var u = t.memoizedProps.value, s = t.type._context;
          mE(t, s, u);
          break;
        }
        case be:
          {
            var f = nr(a, t.childLanes);
            f && (t.flags |= He);
            {
              var p = t.stateNode;
              p.effectDuration = 0, p.passiveEffectDuration = 0;
            }
          }
          break;
        case _e: {
          var v = t.memoizedState;
          if (v !== null) {
            if (v.dehydrated !== null)
              return Mu(t, $c(Za.current)), t.flags |= oe, null;
            var m = t.child, y = m.childLanes;
            if (nr(a, y))
              return SC(e, t, a);
            Mu(t, $c(Za.current));
            var R = Ul(e, t, a);
            return R !== null ? R.sibling : null;
          } else
            Mu(t, $c(Za.current));
          break;
        }
        case It: {
          var C = (e.flags & oe) !== se, _ = nr(a, t.childLanes);
          if (C) {
            if (_)
              return RC(e, t, a);
            t.flags |= oe;
          }
          var O = t.memoizedState;
          if (O !== null && (O.rendering = null, O.tail = null, O.lastEffect = null), Mu(t, Za.current), _)
            break;
          return null;
        }
        case Le:
        case gn:
          return t.lanes = A, vC(e, t, a);
      }
      return Ul(e, t, a);
    }
    function DC(e, t, a) {
      if (t._debugNeedsRemount && e !== null)
        return Xw(e, t, e0(t.type, t.key, t.pendingProps, t._debugOwner || null, t.mode, t.lanes));
      if (e !== null) {
        var i = e.memoizedProps, u = t.pendingProps;
        if (i !== u || wh() || // Force a re-render if the implementation changed due to hot reload:
        t.type !== e.type)
          ti = !0;
        else {
          var s = xS(e, a);
          if (!s && // If this is the second pass of an error or suspense boundary, there
          // may not be work scheduled on `current`, so we check for this flag.
          (t.flags & oe) === se)
            return ti = !1, qw(e, t, a);
          (e.flags & Vs) !== se ? ti = !0 : ti = !1;
        }
      } else if (ti = !1, zn() && Cx(t)) {
        var f = t.index, p = Tx();
        eE(t, p, f);
      }
      switch (t.lanes = A, t.tag) {
        case Dt:
          return Ow(e, t, t.type, a);
        case wn: {
          var v = t.elementType;
          return _w(e, t, v, a);
        }
        case ge: {
          var m = t.type, y = t.pendingProps, R = t.elementType === m ? y : ei(m, y);
          return mS(e, t, m, R, a);
        }
        case le: {
          var C = t.type, _ = t.pendingProps, O = t.elementType === C ? _ : ei(C, _);
          return mC(e, t, C, O, a);
        }
        case P:
          return Dw(e, t, a);
        case J:
          return kw(e, t, a);
        case Oe:
          return bw(e, t);
        case _e:
          return SC(e, t, a);
        case me:
          return $w(e, t, a);
        case De: {
          var M = t.type, W = t.pendingProps, fe = t.elementType === M ? W : ei(M, W);
          return fC(e, t, M, fe, a);
        }
        case Ge:
          return Rw(e, t, a);
        case et:
          return xw(e, t, a);
        case be:
          return ww(e, t, a);
        case lt:
          return Gw(e, t, a);
        case Pn:
          return Ww(e, t, a);
        case mt: {
          var ue = t.type, Ve = t.pendingProps, ze = ei(ue, Ve);
          if (t.type !== t.elementType) {
            var D = ue.propTypes;
            D && Xa(
              D,
              ze,
              // Resolved for outer only
              "prop",
              Ze(ue)
            );
          }
          return ze = ei(ue.type, ze), dC(e, t, ue, ze, a);
        }
        case Me:
          return pC(e, t, t.type, t.pendingProps, a);
        case Ct: {
          var N = t.type, k = t.pendingProps, B = t.elementType === N ? k : ei(N, k);
          return Lw(e, t, N, B, a);
        }
        case It:
          return RC(e, t, a);
        case ft:
          break;
        case Le:
          return vC(e, t, a);
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function Zc(e) {
      e.flags |= He;
    }
    function kC(e) {
      e.flags |= wt, e.flags |= fu;
    }
    var bC, wS, _C, LC;
    bC = function(e, t, a, i) {
      for (var u = t.child; u !== null; ) {
        if (u.tag === J || u.tag === Oe)
          g1(e, u.stateNode);
        else if (u.tag !== me) {
          if (u.child !== null) {
            u.child.return = u, u = u.child;
            continue;
          }
        }
        if (u === t)
          return;
        for (; u.sibling === null; ) {
          if (u.return === null || u.return === t)
            return;
          u = u.return;
        }
        u.sibling.return = u.return, u = u.sibling;
      }
    }, wS = function(e, t) {
    }, _C = function(e, t, a, i, u) {
      var s = e.memoizedProps;
      if (s !== i) {
        var f = t.stateNode, p = Sg(), v = E1(f, a, s, i, u, p);
        t.updateQueue = v, v && Zc(t);
      }
    }, LC = function(e, t, a, i) {
      a !== i && Zc(t);
    };
    function vp(e, t) {
      if (!zn())
        switch (e.tailMode) {
          case "hidden": {
            for (var a = e.tail, i = null; a !== null; )
              a.alternate !== null && (i = a), a = a.sibling;
            i === null ? e.tail = null : i.sibling = null;
            break;
          }
          case "collapsed": {
            for (var u = e.tail, s = null; u !== null; )
              u.alternate !== null && (s = u), u = u.sibling;
            s === null ? !t && e.tail !== null ? e.tail.sibling = null : e.tail = null : s.sibling = null;
            break;
          }
        }
    }
    function An(e) {
      var t = e.alternate !== null && e.alternate.child === e.child, a = A, i = se;
      if (t) {
        if ((e.mode & Pe) !== ce) {
          for (var v = e.selfBaseDuration, m = e.child; m !== null; )
            a = xe(a, xe(m.lanes, m.childLanes)), i |= m.subtreeFlags & Ft, i |= m.flags & Ft, v += m.treeBaseDuration, m = m.sibling;
          e.treeBaseDuration = v;
        } else
          for (var y = e.child; y !== null; )
            a = xe(a, xe(y.lanes, y.childLanes)), i |= y.subtreeFlags & Ft, i |= y.flags & Ft, y.return = e, y = y.sibling;
        e.subtreeFlags |= i;
      } else {
        if ((e.mode & Pe) !== ce) {
          for (var u = e.actualDuration, s = e.selfBaseDuration, f = e.child; f !== null; )
            a = xe(a, xe(f.lanes, f.childLanes)), i |= f.subtreeFlags, i |= f.flags, u += f.actualDuration, s += f.treeBaseDuration, f = f.sibling;
          e.actualDuration = u, e.treeBaseDuration = s;
        } else
          for (var p = e.child; p !== null; )
            a = xe(a, xe(p.lanes, p.childLanes)), i |= p.subtreeFlags, i |= p.flags, p.return = e, p = p.sibling;
        e.subtreeFlags |= i;
      }
      return e.childLanes = a, t;
    }
    function Kw(e, t, a) {
      if (Ux() && (t.mode & ke) !== ce && (t.flags & oe) === se)
        return uE(t), Bc(), t.flags |= Cn | fo | Zt, !1;
      var i = Mh(t);
      if (a !== null && a.dehydrated !== null)
        if (e === null) {
          if (!i)
            throw new Error("A dehydrated suspense component was completed without a hydrated node. This is probably a bug in React.");
          if (Nx(t), An(t), (t.mode & Pe) !== ce) {
            var u = a !== null;
            if (u) {
              var s = t.child;
              s !== null && (t.treeBaseDuration -= s.treeBaseDuration);
            }
          }
          return !1;
        } else {
          if (Bc(), (t.flags & oe) === se && (t.memoizedState = null), t.flags |= He, An(t), (t.mode & Pe) !== ce) {
            var f = a !== null;
            if (f) {
              var p = t.child;
              p !== null && (t.treeBaseDuration -= p.treeBaseDuration);
            }
          }
          return !1;
        }
      else
        return oE(), !0;
    }
    function OC(e, t, a) {
      var i = t.pendingProps;
      switch (Ky(t), t.tag) {
        case Dt:
        case wn:
        case Me:
        case ge:
        case De:
        case Ge:
        case et:
        case be:
        case Pn:
        case mt:
          return An(t), null;
        case le: {
          var u = t.type;
          return zi(u) && Dh(t), An(t), null;
        }
        case P: {
          var s = t.stateNode;
          if (Ic(t), Gy(t), xg(), s.pendingContext && (s.context = s.pendingContext, s.pendingContext = null), e === null || e.child === null) {
            var f = Mh(t);
            if (f)
              Zc(t);
            else if (e !== null) {
              var p = e.memoizedState;
              // Check if this is a client root
              (!p.isDehydrated || // Check if we reverted to client rendering (e.g. due to an error)
              (t.flags & Cn) !== se) && (t.flags |= Gt, oE());
            }
          }
          return wS(e, t), An(t), null;
        }
        case J: {
          Eg(t);
          var v = RE(), m = t.type;
          if (e !== null && t.stateNode != null)
            _C(e, t, m, i, v), e.ref !== t.ref && kC(t);
          else {
            if (!i) {
              if (t.stateNode === null)
                throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
              return An(t), null;
            }
            var y = Sg(), R = Mh(t);
            if (R)
              Ox(t, v, y) && Zc(t);
            else {
              var C = y1(m, i, v, y, t);
              bC(C, t, !1, !1), t.stateNode = C, S1(C, m, i, v) && Zc(t);
            }
            t.ref !== null && kC(t);
          }
          return An(t), null;
        }
        case Oe: {
          var _ = i;
          if (e && t.stateNode != null) {
            var O = e.memoizedProps;
            LC(e, t, O, _);
          } else {
            if (typeof _ != "string" && t.stateNode === null)
              throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
            var M = RE(), W = Sg(), fe = Mh(t);
            fe ? Mx(t) && Zc(t) : t.stateNode = C1(_, M, W, t);
          }
          return An(t), null;
        }
        case _e: {
          Gc(t);
          var ue = t.memoizedState;
          if (e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
            var Ve = Kw(e, t, ue);
            if (!Ve)
              return t.flags & Zt ? t : null;
          }
          if ((t.flags & oe) !== se)
            return t.lanes = a, (t.mode & Pe) !== ce && Xg(t), t;
          var ze = ue !== null, D = e !== null && e.memoizedState !== null;
          if (ze !== D && ze) {
            var N = t.child;
            if (N.flags |= Ht, (t.mode & ke) !== ce) {
              var k = e === null && (t.memoizedProps.unstable_avoidThisFallback !== !0 || !0);
              k || Cg(Za.current, DE) ? ZD() : YS();
            }
          }
          var B = t.updateQueue;
          if (B !== null && (t.flags |= He), An(t), (t.mode & Pe) !== ce && ze) {
            var Z = t.child;
            Z !== null && (t.treeBaseDuration -= Z.treeBaseDuration);
          }
          return null;
        }
        case me:
          return Ic(t), wS(e, t), e === null && vx(t.stateNode.containerInfo), An(t), null;
        case lt:
          var X = t.type._context;
          return fg(X, t), An(t), null;
        case Ct: {
          var Se = t.type;
          return zi(Se) && Dh(t), An(t), null;
        }
        case It: {
          Gc(t);
          var Te = t.memoizedState;
          if (Te === null)
            return An(t), null;
          var at = (t.flags & oe) !== se, Ie = Te.rendering;
          if (Ie === null)
            if (at)
              vp(Te, !1);
            else {
              var qt = ek() && (e === null || (e.flags & oe) === se);
              if (!qt)
                for (var $e = t.child; $e !== null; ) {
                  var Qt = Wh($e);
                  if (Qt !== null) {
                    at = !0, t.flags |= oe, vp(Te, !1);
                    var sr = Qt.updateQueue;
                    return sr !== null && (t.updateQueue = sr, t.flags |= He), t.subtreeFlags = se, Px(t, a), Mu(t, Tg(Za.current, tp)), t.child;
                  }
                  $e = $e.sibling;
                }
              Te.tail !== null && Wt() > ZC() && (t.flags |= oe, at = !0, vp(Te, !1), t.lanes = ld);
            }
          else {
            if (!at) {
              var Bn = Wh(Ie);
              if (Bn !== null) {
                t.flags |= oe, at = !0;
                var oa = Bn.updateQueue;
                if (oa !== null && (t.updateQueue = oa, t.flags |= He), vp(Te, !0), Te.tail === null && Te.tailMode === "hidden" && !Ie.alternate && !zn())
                  return An(t), null;
              } else // The time it took to render last row is greater than the remaining
              // time we have to render. So rendering one more row would likely
              // exceed it.
              Wt() * 2 - Te.renderingStartTime > ZC() && a !== tr && (t.flags |= oe, at = !0, vp(Te, !1), t.lanes = ld);
            }
            if (Te.isBackwards)
              Ie.sibling = t.child, t.child = Ie;
            else {
              var Rr = Te.last;
              Rr !== null ? Rr.sibling = Ie : t.child = Ie, Te.last = Ie;
            }
          }
          if (Te.tail !== null) {
            var xr = Te.tail;
            Te.rendering = xr, Te.tail = xr.sibling, Te.renderingStartTime = Wt(), xr.sibling = null;
            var cr = Za.current;
            return at ? cr = Tg(cr, tp) : cr = $c(cr), Mu(t, cr), xr;
          }
          return An(t), null;
        }
        case ft:
          break;
        case Le:
        case gn: {
          PS(t);
          var Vl = t.memoizedState, uf = Vl !== null;
          if (e !== null) {
            var Lp = e.memoizedState, Pi = Lp !== null;
            Pi !== uf && // LegacyHidden doesn't do any hiding — it only pre-renders.
            !te && (t.flags |= Ht);
          }
          return !uf || (t.mode & ke) === ce ? An(t) : nr(Bi, tr) && (An(t), t.subtreeFlags & (yt | He) && (t.flags |= Ht)), null;
        }
        case Dn:
          return null;
        case Nt:
          return null;
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function Zw(e, t, a) {
      switch (Ky(t), t.tag) {
        case le: {
          var i = t.type;
          zi(i) && Dh(t);
          var u = t.flags;
          return u & Zt ? (t.flags = u & ~Zt | oe, (t.mode & Pe) !== ce && Xg(t), t) : null;
        }
        case P: {
          t.stateNode, Ic(t), Gy(t), xg();
          var s = t.flags;
          return (s & Zt) !== se && (s & oe) === se ? (t.flags = s & ~Zt | oe, t) : null;
        }
        case J:
          return Eg(t), null;
        case _e: {
          Gc(t);
          var f = t.memoizedState;
          if (f !== null && f.dehydrated !== null) {
            if (t.alternate === null)
              throw new Error("Threw in newly mounted dehydrated component. This is likely a bug in React. Please file an issue.");
            Bc();
          }
          var p = t.flags;
          return p & Zt ? (t.flags = p & ~Zt | oe, (t.mode & Pe) !== ce && Xg(t), t) : null;
        }
        case It:
          return Gc(t), null;
        case me:
          return Ic(t), null;
        case lt:
          var v = t.type._context;
          return fg(v, t), null;
        case Le:
        case gn:
          return PS(t), null;
        case Dn:
          return null;
        default:
          return null;
      }
    }
    function MC(e, t, a) {
      switch (Ky(t), t.tag) {
        case le: {
          var i = t.type.childContextTypes;
          i != null && Dh(t);
          break;
        }
        case P: {
          t.stateNode, Ic(t), Gy(t), xg();
          break;
        }
        case J: {
          Eg(t);
          break;
        }
        case me:
          Ic(t);
          break;
        case _e:
          Gc(t);
          break;
        case It:
          Gc(t);
          break;
        case lt:
          var u = t.type._context;
          fg(u, t);
          break;
        case Le:
        case gn:
          PS(t);
          break;
      }
    }
    var NC = null;
    NC = /* @__PURE__ */ new Set();
    var gm = !1, Hn = !1, Jw = typeof WeakSet == "function" ? WeakSet : Set, ae = null, Jc = null, ef = null;
    function eD(e) {
      mi(null, function() {
        throw e;
      }), co();
    }
    var tD = function(e, t) {
      if (t.props = e.memoizedProps, t.state = e.memoizedState, e.mode & Pe)
        try {
          ji(), t.componentWillUnmount();
        } finally {
          Fi(e);
        }
      else
        t.componentWillUnmount();
    };
    function zC(e, t) {
      try {
        Uu(fn, e);
      } catch (a) {
        pt(e, t, a);
      }
    }
    function DS(e, t, a) {
      try {
        tD(e, a);
      } catch (i) {
        pt(e, t, i);
      }
    }
    function nD(e, t, a) {
      try {
        a.componentDidMount();
      } catch (i) {
        pt(e, t, i);
      }
    }
    function UC(e, t) {
      try {
        HC(e);
      } catch (a) {
        pt(e, t, a);
      }
    }
    function tf(e, t) {
      var a = e.ref;
      if (a !== null)
        if (typeof a == "function") {
          var i;
          try {
            if (kn && Yi && e.mode & Pe)
              try {
                ji(), i = a(null);
              } finally {
                Fi(e);
              }
            else
              i = a(null);
          } catch (u) {
            pt(e, t, u);
          }
          typeof i == "function" && g("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", Re(e));
        } else
          a.current = null;
    }
    function Sm(e, t, a) {
      try {
        a();
      } catch (i) {
        pt(e, t, i);
      }
    }
    var AC = !1;
    function rD(e, t) {
      h1(e.containerInfo), ae = t, aD();
      var a = AC;
      return AC = !1, a;
    }
    function aD() {
      for (; ae !== null; ) {
        var e = ae, t = e.child;
        (e.subtreeFlags & gi) !== se && t !== null ? (t.return = e, ae = t) : iD();
      }
    }
    function iD() {
      for (; ae !== null; ) {
        var e = ae;
        dt(e);
        try {
          lD(e);
        } catch (a) {
          pt(e, e.return, a);
        }
        xt();
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, ae = t;
          return;
        }
        ae = e.return;
      }
    }
    function lD(e) {
      var t = e.alternate, a = e.flags;
      if ((a & Gt) !== se) {
        switch (dt(e), e.tag) {
          case ge:
          case De:
          case Me:
            break;
          case le: {
            if (t !== null) {
              var i = t.memoizedProps, u = t.memoizedState, s = e.stateNode;
              e.type === e.elementType && !as && (s.props !== e.memoizedProps && g("Expected %s props to match memoized props before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", Re(e) || "instance"), s.state !== e.memoizedState && g("Expected %s state to match memoized state before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", Re(e) || "instance"));
              var f = s.getSnapshotBeforeUpdate(e.elementType === e.type ? i : ei(e.type, i), u);
              {
                var p = NC;
                f === void 0 && !p.has(e.type) && (p.add(e.type), g("%s.getSnapshotBeforeUpdate(): A snapshot value (or null) must be returned. You have returned undefined.", Re(e)));
              }
              s.__reactInternalSnapshotBeforeUpdate = f;
            }
            break;
          }
          case P: {
            {
              var v = e.stateNode;
              V1(v.containerInfo);
            }
            break;
          }
          case J:
          case Oe:
          case me:
          case Ct:
            break;
          default:
            throw new Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
        }
        xt();
      }
    }
    function ni(e, t, a) {
      var i = t.updateQueue, u = i !== null ? i.lastEffect : null;
      if (u !== null) {
        var s = u.next, f = s;
        do {
          if ((f.tag & e) === e) {
            var p = f.destroy;
            f.destroy = void 0, p !== void 0 && ((e & Un) !== Yr ? Ya(t) : (e & fn) !== Yr && vo(t), (e & Ui) !== Yr && kp(!0), Sm(t, a, p), (e & Ui) !== Yr && kp(!1), (e & Un) !== Yr ? Ti() : (e & fn) !== Yr && ad());
          }
          f = f.next;
        } while (f !== s);
      }
    }
    function Uu(e, t) {
      var a = t.updateQueue, i = a !== null ? a.lastEffect : null;
      if (i !== null) {
        var u = i.next, s = u;
        do {
          if ((s.tag & e) === e) {
            (e & Un) !== Yr ? rd(t) : (e & fn) !== Yr && $s(t);
            var f = s.create;
            (e & Ui) !== Yr && kp(!0), s.destroy = f(), (e & Ui) !== Yr && kp(!1), (e & Un) !== Yr ? xv() : (e & fn) !== Yr && wv();
            {
              var p = s.destroy;
              if (p !== void 0 && typeof p != "function") {
                var v = void 0;
                (s.tag & fn) !== se ? v = "useLayoutEffect" : (s.tag & Ui) !== se ? v = "useInsertionEffect" : v = "useEffect";
                var m = void 0;
                p === null ? m = " You returned null. If your effect does not require clean up, return undefined (or nothing)." : typeof p.then == "function" ? m = `

It looks like you wrote ` + v + `(async () => ...) or returned a Promise. Instead, write the async function inside your effect and call it immediately:

` + v + `(() => {
  async function fetchData() {
    // You can await here
    const response = await MyAPI.getData(someId);
    // ...
  }
  fetchData();
}, [someId]); // Or [] if effect doesn't need props or state

Learn more about data fetching with Hooks: https://reactjs.org/link/hooks-data-fetching` : m = " You returned: " + p, g("%s must not return anything besides a function, which is used for clean-up.%s", v, m);
              }
            }
          }
          s = s.next;
        } while (s !== u);
      }
    }
    function uD(e, t) {
      if ((t.flags & He) !== se)
        switch (t.tag) {
          case be: {
            var a = t.stateNode.passiveEffectDuration, i = t.memoizedProps, u = i.id, s = i.onPostCommit, f = ZE(), p = t.alternate === null ? "mount" : "update";
            KE() && (p = "nested-update"), typeof s == "function" && s(u, p, a, f);
            var v = t.return;
            e: for (; v !== null; ) {
              switch (v.tag) {
                case P:
                  var m = v.stateNode;
                  m.passiveEffectDuration += a;
                  break e;
                case be:
                  var y = v.stateNode;
                  y.passiveEffectDuration += a;
                  break e;
              }
              v = v.return;
            }
            break;
          }
        }
    }
    function oD(e, t, a, i) {
      if ((a.flags & Ei) !== se)
        switch (a.tag) {
          case ge:
          case De:
          case Me: {
            if (!Hn)
              if (a.mode & Pe)
                try {
                  ji(), Uu(fn | cn, a);
                } finally {
                  Fi(a);
                }
              else
                Uu(fn | cn, a);
            break;
          }
          case le: {
            var u = a.stateNode;
            if (a.flags & He && !Hn)
              if (t === null)
                if (a.type === a.elementType && !as && (u.props !== a.memoizedProps && g("Expected %s props to match memoized props before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", Re(a) || "instance"), u.state !== a.memoizedState && g("Expected %s state to match memoized state before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", Re(a) || "instance")), a.mode & Pe)
                  try {
                    ji(), u.componentDidMount();
                  } finally {
                    Fi(a);
                  }
                else
                  u.componentDidMount();
              else {
                var s = a.elementType === a.type ? t.memoizedProps : ei(a.type, t.memoizedProps), f = t.memoizedState;
                if (a.type === a.elementType && !as && (u.props !== a.memoizedProps && g("Expected %s props to match memoized props before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", Re(a) || "instance"), u.state !== a.memoizedState && g("Expected %s state to match memoized state before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", Re(a) || "instance")), a.mode & Pe)
                  try {
                    ji(), u.componentDidUpdate(s, f, u.__reactInternalSnapshotBeforeUpdate);
                  } finally {
                    Fi(a);
                  }
                else
                  u.componentDidUpdate(s, f, u.__reactInternalSnapshotBeforeUpdate);
              }
            var p = a.updateQueue;
            p !== null && (a.type === a.elementType && !as && (u.props !== a.memoizedProps && g("Expected %s props to match memoized props before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", Re(a) || "instance"), u.state !== a.memoizedState && g("Expected %s state to match memoized state before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", Re(a) || "instance")), TE(a, p, u));
            break;
          }
          case P: {
            var v = a.updateQueue;
            if (v !== null) {
              var m = null;
              if (a.child !== null)
                switch (a.child.tag) {
                  case J:
                    m = a.child.stateNode;
                    break;
                  case le:
                    m = a.child.stateNode;
                    break;
                }
              TE(a, v, m);
            }
            break;
          }
          case J: {
            var y = a.stateNode;
            if (t === null && a.flags & He) {
              var R = a.type, C = a.memoizedProps;
              D1(y, R, C);
            }
            break;
          }
          case Oe:
            break;
          case me:
            break;
          case be: {
            {
              var _ = a.memoizedProps, O = _.onCommit, M = _.onRender, W = a.stateNode.effectDuration, fe = ZE(), ue = t === null ? "mount" : "update";
              KE() && (ue = "nested-update"), typeof M == "function" && M(a.memoizedProps.id, ue, a.actualDuration, a.treeBaseDuration, a.actualStartTime, fe);
              {
                typeof O == "function" && O(a.memoizedProps.id, ue, W, fe), ik(a);
                var Ve = a.return;
                e: for (; Ve !== null; ) {
                  switch (Ve.tag) {
                    case P:
                      var ze = Ve.stateNode;
                      ze.effectDuration += W;
                      break e;
                    case be:
                      var D = Ve.stateNode;
                      D.effectDuration += W;
                      break e;
                  }
                  Ve = Ve.return;
                }
              }
            }
            break;
          }
          case _e: {
            mD(e, a);
            break;
          }
          case It:
          case Ct:
          case ft:
          case Le:
          case gn:
          case Nt:
            break;
          default:
            throw new Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
        }
      Hn || a.flags & wt && HC(a);
    }
    function sD(e) {
      switch (e.tag) {
        case ge:
        case De:
        case Me: {
          if (e.mode & Pe)
            try {
              ji(), zC(e, e.return);
            } finally {
              Fi(e);
            }
          else
            zC(e, e.return);
          break;
        }
        case le: {
          var t = e.stateNode;
          typeof t.componentDidMount == "function" && nD(e, e.return, t), UC(e, e.return);
          break;
        }
        case J: {
          UC(e, e.return);
          break;
        }
      }
    }
    function cD(e, t) {
      for (var a = null, i = e; ; ) {
        if (i.tag === J) {
          if (a === null) {
            a = i;
            try {
              var u = i.stateNode;
              t ? A1(u) : F1(i.stateNode, i.memoizedProps);
            } catch (f) {
              pt(e, e.return, f);
            }
          }
        } else if (i.tag === Oe) {
          if (a === null)
            try {
              var s = i.stateNode;
              t ? H1(s) : j1(s, i.memoizedProps);
            } catch (f) {
              pt(e, e.return, f);
            }
        } else if (!((i.tag === Le || i.tag === gn) && i.memoizedState !== null && i !== e)) {
          if (i.child !== null) {
            i.child.return = i, i = i.child;
            continue;
          }
        }
        if (i === e)
          return;
        for (; i.sibling === null; ) {
          if (i.return === null || i.return === e)
            return;
          a === i && (a = null), i = i.return;
        }
        a === i && (a = null), i.sibling.return = i.return, i = i.sibling;
      }
    }
    function HC(e) {
      var t = e.ref;
      if (t !== null) {
        var a = e.stateNode, i;
        switch (e.tag) {
          case J:
            i = a;
            break;
          default:
            i = a;
        }
        if (typeof t == "function") {
          var u;
          if (e.mode & Pe)
            try {
              ji(), u = t(i);
            } finally {
              Fi(e);
            }
          else
            u = t(i);
          typeof u == "function" && g("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", Re(e));
        } else
          t.hasOwnProperty("current") || g("Unexpected ref object provided for %s. Use either a ref-setter function or React.createRef().", Re(e)), t.current = i;
      }
    }
    function fD(e) {
      var t = e.alternate;
      t !== null && (t.return = null), e.return = null;
    }
    function FC(e) {
      var t = e.alternate;
      t !== null && (e.alternate = null, FC(t));
      {
        if (e.child = null, e.deletions = null, e.sibling = null, e.tag === J) {
          var a = e.stateNode;
          a !== null && yx(a);
        }
        e.stateNode = null, e._debugOwner = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
      }
    }
    function dD(e) {
      for (var t = e.return; t !== null; ) {
        if (jC(t))
          return t;
        t = t.return;
      }
      throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
    }
    function jC(e) {
      return e.tag === J || e.tag === P || e.tag === me;
    }
    function VC(e) {
      var t = e;
      e: for (; ; ) {
        for (; t.sibling === null; ) {
          if (t.return === null || jC(t.return))
            return null;
          t = t.return;
        }
        for (t.sibling.return = t.return, t = t.sibling; t.tag !== J && t.tag !== Oe && t.tag !== Kt; ) {
          if (t.flags & yt || t.child === null || t.tag === me)
            continue e;
          t.child.return = t, t = t.child;
        }
        if (!(t.flags & yt))
          return t.stateNode;
      }
    }
    function pD(e) {
      var t = dD(e);
      switch (t.tag) {
        case J: {
          var a = t.stateNode;
          t.flags & Nr && (P0(a), t.flags &= ~Nr);
          var i = VC(e);
          bS(e, i, a);
          break;
        }
        case P:
        case me: {
          var u = t.stateNode.containerInfo, s = VC(e);
          kS(e, s, u);
          break;
        }
        default:
          throw new Error("Invalid host parent fiber. This error is likely caused by a bug in React. Please file an issue.");
      }
    }
    function kS(e, t, a) {
      var i = e.tag, u = i === J || i === Oe;
      if (u) {
        var s = e.stateNode;
        t ? M1(a, s, t) : L1(a, s);
      } else if (i !== me) {
        var f = e.child;
        if (f !== null) {
          kS(f, t, a);
          for (var p = f.sibling; p !== null; )
            kS(p, t, a), p = p.sibling;
        }
      }
    }
    function bS(e, t, a) {
      var i = e.tag, u = i === J || i === Oe;
      if (u) {
        var s = e.stateNode;
        t ? O1(a, s, t) : _1(a, s);
      } else if (i !== me) {
        var f = e.child;
        if (f !== null) {
          bS(f, t, a);
          for (var p = f.sibling; p !== null; )
            bS(p, t, a), p = p.sibling;
        }
      }
    }
    var Fn = null, ri = !1;
    function vD(e, t, a) {
      {
        var i = t;
        e: for (; i !== null; ) {
          switch (i.tag) {
            case J: {
              Fn = i.stateNode, ri = !1;
              break e;
            }
            case P: {
              Fn = i.stateNode.containerInfo, ri = !0;
              break e;
            }
            case me: {
              Fn = i.stateNode.containerInfo, ri = !0;
              break e;
            }
          }
          i = i.return;
        }
        if (Fn === null)
          throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
        BC(e, t, a), Fn = null, ri = !1;
      }
      fD(a);
    }
    function Au(e, t, a) {
      for (var i = a.child; i !== null; )
        BC(e, t, i), i = i.sibling;
    }
    function BC(e, t, a) {
      switch (ed(a), a.tag) {
        case J:
          Hn || tf(a, t);
        case Oe: {
          {
            var i = Fn, u = ri;
            Fn = null, Au(e, t, a), Fn = i, ri = u, Fn !== null && (ri ? z1(Fn, a.stateNode) : N1(Fn, a.stateNode));
          }
          return;
        }
        case Kt: {
          Fn !== null && (ri ? U1(Fn, a.stateNode) : jy(Fn, a.stateNode));
          return;
        }
        case me: {
          {
            var s = Fn, f = ri;
            Fn = a.stateNode.containerInfo, ri = !0, Au(e, t, a), Fn = s, ri = f;
          }
          return;
        }
        case ge:
        case De:
        case mt:
        case Me: {
          if (!Hn) {
            var p = a.updateQueue;
            if (p !== null) {
              var v = p.lastEffect;
              if (v !== null) {
                var m = v.next, y = m;
                do {
                  var R = y, C = R.destroy, _ = R.tag;
                  C !== void 0 && ((_ & Ui) !== Yr ? Sm(a, t, C) : (_ & fn) !== Yr && (vo(a), a.mode & Pe ? (ji(), Sm(a, t, C), Fi(a)) : Sm(a, t, C), ad())), y = y.next;
                } while (y !== m);
              }
            }
          }
          Au(e, t, a);
          return;
        }
        case le: {
          if (!Hn) {
            tf(a, t);
            var O = a.stateNode;
            typeof O.componentWillUnmount == "function" && DS(a, t, O);
          }
          Au(e, t, a);
          return;
        }
        case ft: {
          Au(e, t, a);
          return;
        }
        case Le: {
          if (
            // TODO: Remove this dead flag
            a.mode & ke
          ) {
            var M = Hn;
            Hn = M || a.memoizedState !== null, Au(e, t, a), Hn = M;
          } else
            Au(e, t, a);
          break;
        }
        default: {
          Au(e, t, a);
          return;
        }
      }
    }
    function hD(e) {
      e.memoizedState;
    }
    function mD(e, t) {
      var a = t.memoizedState;
      if (a === null) {
        var i = t.alternate;
        if (i !== null) {
          var u = i.memoizedState;
          if (u !== null) {
            var s = u.dehydrated;
            s !== null && ex(s);
          }
        }
      }
    }
    function PC(e) {
      var t = e.updateQueue;
      if (t !== null) {
        e.updateQueue = null;
        var a = e.stateNode;
        a === null && (a = e.stateNode = new Jw()), t.forEach(function(i) {
          var u = dk.bind(null, e, i);
          if (!a.has(i)) {
            if (a.add(i), er)
              if (Jc !== null && ef !== null)
                Dp(ef, Jc);
              else
                throw Error("Expected finished root and lanes to be set. This is a bug in React.");
            i.then(u, u);
          }
        });
      }
    }
    function yD(e, t, a) {
      Jc = a, ef = e, dt(t), YC(t, e), dt(t), Jc = null, ef = null;
    }
    function ai(e, t, a) {
      var i = t.deletions;
      if (i !== null)
        for (var u = 0; u < i.length; u++) {
          var s = i[u];
          try {
            vD(e, t, s);
          } catch (v) {
            pt(s, t, v);
          }
        }
      var f = Wu();
      if (t.subtreeFlags & Si)
        for (var p = t.child; p !== null; )
          dt(p), YC(p, e), p = p.sibling;
      dt(f);
    }
    function YC(e, t, a) {
      var i = e.alternate, u = e.flags;
      switch (e.tag) {
        case ge:
        case De:
        case mt:
        case Me: {
          if (ai(t, e), Vi(e), u & He) {
            try {
              ni(Ui | cn, e, e.return), Uu(Ui | cn, e);
            } catch (Se) {
              pt(e, e.return, Se);
            }
            if (e.mode & Pe) {
              try {
                ji(), ni(fn | cn, e, e.return);
              } catch (Se) {
                pt(e, e.return, Se);
              }
              Fi(e);
            } else
              try {
                ni(fn | cn, e, e.return);
              } catch (Se) {
                pt(e, e.return, Se);
              }
          }
          return;
        }
        case le: {
          ai(t, e), Vi(e), u & wt && i !== null && tf(i, i.return);
          return;
        }
        case J: {
          ai(t, e), Vi(e), u & wt && i !== null && tf(i, i.return);
          {
            if (e.flags & Nr) {
              var s = e.stateNode;
              try {
                P0(s);
              } catch (Se) {
                pt(e, e.return, Se);
              }
            }
            if (u & He) {
              var f = e.stateNode;
              if (f != null) {
                var p = e.memoizedProps, v = i !== null ? i.memoizedProps : p, m = e.type, y = e.updateQueue;
                if (e.updateQueue = null, y !== null)
                  try {
                    k1(f, y, m, v, p, e);
                  } catch (Se) {
                    pt(e, e.return, Se);
                  }
              }
            }
          }
          return;
        }
        case Oe: {
          if (ai(t, e), Vi(e), u & He) {
            if (e.stateNode === null)
              throw new Error("This should have a text node initialized. This error is likely caused by a bug in React. Please file an issue.");
            var R = e.stateNode, C = e.memoizedProps, _ = i !== null ? i.memoizedProps : C;
            try {
              b1(R, _, C);
            } catch (Se) {
              pt(e, e.return, Se);
            }
          }
          return;
        }
        case P: {
          if (ai(t, e), Vi(e), u & He && i !== null) {
            var O = i.memoizedState;
            if (O.isDehydrated)
              try {
                J1(t.containerInfo);
              } catch (Se) {
                pt(e, e.return, Se);
              }
          }
          return;
        }
        case me: {
          ai(t, e), Vi(e);
          return;
        }
        case _e: {
          ai(t, e), Vi(e);
          var M = e.child;
          if (M.flags & Ht) {
            var W = M.stateNode, fe = M.memoizedState, ue = fe !== null;
            if (W.isHidden = ue, ue) {
              var Ve = M.alternate !== null && M.alternate.memoizedState !== null;
              Ve || KD();
            }
          }
          if (u & He) {
            try {
              hD(e);
            } catch (Se) {
              pt(e, e.return, Se);
            }
            PC(e);
          }
          return;
        }
        case Le: {
          var ze = i !== null && i.memoizedState !== null;
          if (
            // TODO: Remove this dead flag
            e.mode & ke
          ) {
            var D = Hn;
            Hn = D || ze, ai(t, e), Hn = D;
          } else
            ai(t, e);
          if (Vi(e), u & Ht) {
            var N = e.stateNode, k = e.memoizedState, B = k !== null, Z = e;
            if (N.isHidden = B, B && !ze && (Z.mode & ke) !== ce) {
              ae = Z;
              for (var X = Z.child; X !== null; )
                ae = X, SD(X), X = X.sibling;
            }
            cD(Z, B);
          }
          return;
        }
        case It: {
          ai(t, e), Vi(e), u & He && PC(e);
          return;
        }
        case ft:
          return;
        default: {
          ai(t, e), Vi(e);
          return;
        }
      }
    }
    function Vi(e) {
      var t = e.flags;
      if (t & yt) {
        try {
          pD(e);
        } catch (a) {
          pt(e, e.return, a);
        }
        e.flags &= ~yt;
      }
      t & Kn && (e.flags &= ~Kn);
    }
    function gD(e, t, a) {
      Jc = a, ef = t, ae = e, QC(e, t, a), Jc = null, ef = null;
    }
    function QC(e, t, a) {
      for (var i = (e.mode & ke) !== ce; ae !== null; ) {
        var u = ae, s = u.child;
        if (u.tag === Le && i) {
          var f = u.memoizedState !== null, p = f || gm;
          if (p) {
            _S(e, t, a);
            continue;
          } else {
            var v = u.alternate, m = v !== null && v.memoizedState !== null, y = m || Hn, R = gm, C = Hn;
            gm = p, Hn = y, Hn && !C && (ae = u, ED(u));
            for (var _ = s; _ !== null; )
              ae = _, QC(
                _,
                // New root; bubble back up to here and stop.
                t,
                a
              ), _ = _.sibling;
            ae = u, gm = R, Hn = C, _S(e, t, a);
            continue;
          }
        }
        (u.subtreeFlags & Ei) !== se && s !== null ? (s.return = u, ae = s) : _S(e, t, a);
      }
    }
    function _S(e, t, a) {
      for (; ae !== null; ) {
        var i = ae;
        if ((i.flags & Ei) !== se) {
          var u = i.alternate;
          dt(i);
          try {
            oD(t, u, i, a);
          } catch (f) {
            pt(i, i.return, f);
          }
          xt();
        }
        if (i === e) {
          ae = null;
          return;
        }
        var s = i.sibling;
        if (s !== null) {
          s.return = i.return, ae = s;
          return;
        }
        ae = i.return;
      }
    }
    function SD(e) {
      for (; ae !== null; ) {
        var t = ae, a = t.child;
        switch (t.tag) {
          case ge:
          case De:
          case mt:
          case Me: {
            if (t.mode & Pe)
              try {
                ji(), ni(fn, t, t.return);
              } finally {
                Fi(t);
              }
            else
              ni(fn, t, t.return);
            break;
          }
          case le: {
            tf(t, t.return);
            var i = t.stateNode;
            typeof i.componentWillUnmount == "function" && DS(t, t.return, i);
            break;
          }
          case J: {
            tf(t, t.return);
            break;
          }
          case Le: {
            var u = t.memoizedState !== null;
            if (u) {
              IC(e);
              continue;
            }
            break;
          }
        }
        a !== null ? (a.return = t, ae = a) : IC(e);
      }
    }
    function IC(e) {
      for (; ae !== null; ) {
        var t = ae;
        if (t === e) {
          ae = null;
          return;
        }
        var a = t.sibling;
        if (a !== null) {
          a.return = t.return, ae = a;
          return;
        }
        ae = t.return;
      }
    }
    function ED(e) {
      for (; ae !== null; ) {
        var t = ae, a = t.child;
        if (t.tag === Le) {
          var i = t.memoizedState !== null;
          if (i) {
            $C(e);
            continue;
          }
        }
        a !== null ? (a.return = t, ae = a) : $C(e);
      }
    }
    function $C(e) {
      for (; ae !== null; ) {
        var t = ae;
        dt(t);
        try {
          sD(t);
        } catch (i) {
          pt(t, t.return, i);
        }
        if (xt(), t === e) {
          ae = null;
          return;
        }
        var a = t.sibling;
        if (a !== null) {
          a.return = t.return, ae = a;
          return;
        }
        ae = t.return;
      }
    }
    function CD(e, t, a, i) {
      ae = t, TD(t, e, a, i);
    }
    function TD(e, t, a, i) {
      for (; ae !== null; ) {
        var u = ae, s = u.child;
        (u.subtreeFlags & Ba) !== se && s !== null ? (s.return = u, ae = s) : RD(e, t, a, i);
      }
    }
    function RD(e, t, a, i) {
      for (; ae !== null; ) {
        var u = ae;
        if ((u.flags & qn) !== se) {
          dt(u);
          try {
            xD(t, u, a, i);
          } catch (f) {
            pt(u, u.return, f);
          }
          xt();
        }
        if (u === e) {
          ae = null;
          return;
        }
        var s = u.sibling;
        if (s !== null) {
          s.return = u.return, ae = s;
          return;
        }
        ae = u.return;
      }
    }
    function xD(e, t, a, i) {
      switch (t.tag) {
        case ge:
        case De:
        case Me: {
          if (t.mode & Pe) {
            Wg();
            try {
              Uu(Un | cn, t);
            } finally {
              Gg(t);
            }
          } else
            Uu(Un | cn, t);
          break;
        }
      }
    }
    function wD(e) {
      ae = e, DD();
    }
    function DD() {
      for (; ae !== null; ) {
        var e = ae, t = e.child;
        if ((ae.flags & Mr) !== se) {
          var a = e.deletions;
          if (a !== null) {
            for (var i = 0; i < a.length; i++) {
              var u = a[i];
              ae = u, _D(u, e);
            }
            {
              var s = e.alternate;
              if (s !== null) {
                var f = s.child;
                if (f !== null) {
                  s.child = null;
                  do {
                    var p = f.sibling;
                    f.sibling = null, f = p;
                  } while (f !== null);
                }
              }
            }
            ae = e;
          }
        }
        (e.subtreeFlags & Ba) !== se && t !== null ? (t.return = e, ae = t) : kD();
      }
    }
    function kD() {
      for (; ae !== null; ) {
        var e = ae;
        (e.flags & qn) !== se && (dt(e), bD(e), xt());
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, ae = t;
          return;
        }
        ae = e.return;
      }
    }
    function bD(e) {
      switch (e.tag) {
        case ge:
        case De:
        case Me: {
          e.mode & Pe ? (Wg(), ni(Un | cn, e, e.return), Gg(e)) : ni(Un | cn, e, e.return);
          break;
        }
      }
    }
    function _D(e, t) {
      for (; ae !== null; ) {
        var a = ae;
        dt(a), OD(a, t), xt();
        var i = a.child;
        i !== null ? (i.return = a, ae = i) : LD(e);
      }
    }
    function LD(e) {
      for (; ae !== null; ) {
        var t = ae, a = t.sibling, i = t.return;
        if (FC(t), t === e) {
          ae = null;
          return;
        }
        if (a !== null) {
          a.return = i, ae = a;
          return;
        }
        ae = i;
      }
    }
    function OD(e, t) {
      switch (e.tag) {
        case ge:
        case De:
        case Me: {
          e.mode & Pe ? (Wg(), ni(Un, e, t), Gg(e)) : ni(Un, e, t);
          break;
        }
      }
    }
    function MD(e) {
      switch (e.tag) {
        case ge:
        case De:
        case Me: {
          try {
            Uu(fn | cn, e);
          } catch (a) {
            pt(e, e.return, a);
          }
          break;
        }
        case le: {
          var t = e.stateNode;
          try {
            t.componentDidMount();
          } catch (a) {
            pt(e, e.return, a);
          }
          break;
        }
      }
    }
    function ND(e) {
      switch (e.tag) {
        case ge:
        case De:
        case Me: {
          try {
            Uu(Un | cn, e);
          } catch (t) {
            pt(e, e.return, t);
          }
          break;
        }
      }
    }
    function zD(e) {
      switch (e.tag) {
        case ge:
        case De:
        case Me: {
          try {
            ni(fn | cn, e, e.return);
          } catch (a) {
            pt(e, e.return, a);
          }
          break;
        }
        case le: {
          var t = e.stateNode;
          typeof t.componentWillUnmount == "function" && DS(e, e.return, t);
          break;
        }
      }
    }
    function UD(e) {
      switch (e.tag) {
        case ge:
        case De:
        case Me:
          try {
            ni(Un | cn, e, e.return);
          } catch (t) {
            pt(e, e.return, t);
          }
      }
    }
    if (typeof Symbol == "function" && Symbol.for) {
      var hp = Symbol.for;
      hp("selector.component"), hp("selector.has_pseudo_class"), hp("selector.role"), hp("selector.test_id"), hp("selector.text");
    }
    var AD = [];
    function HD() {
      AD.forEach(function(e) {
        return e();
      });
    }
    var FD = x.ReactCurrentActQueue;
    function jD(e) {
      {
        var t = (
          // $FlowExpectedError – Flow doesn't know about IS_REACT_ACT_ENVIRONMENT global
          typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0
        ), a = typeof jest < "u";
        return a && t !== !1;
      }
    }
    function GC() {
      {
        var e = (
          // $FlowExpectedError – Flow doesn't know about IS_REACT_ACT_ENVIRONMENT global
          typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0
        );
        return !e && FD.current !== null && g("The current testing environment is not configured to support act(...)"), e;
      }
    }
    var VD = Math.ceil, LS = x.ReactCurrentDispatcher, OS = x.ReactCurrentOwner, jn = x.ReactCurrentBatchConfig, ii = x.ReactCurrentActQueue, vn = (
      /*             */
      0
    ), WC = (
      /*               */
      1
    ), Vn = (
      /*                */
      2
    ), Oa = (
      /*                */
      4
    ), Al = 0, mp = 1, is = 2, Em = 3, yp = 4, XC = 5, MS = 6, je = vn, Cr = null, Mt = null, hn = A, Bi = A, NS = Du(A), mn = Al, gp = null, Cm = A, Sp = A, Tm = A, Ep = null, Qr = null, zS = 0, qC = 500, KC = 1 / 0, BD = 500, Hl = null;
    function Cp() {
      KC = Wt() + BD;
    }
    function ZC() {
      return KC;
    }
    var Rm = !1, US = null, nf = null, ls = !1, Hu = null, Tp = A, AS = [], HS = null, PD = 50, Rp = 0, FS = null, jS = !1, xm = !1, YD = 50, rf = 0, wm = null, xp = st, Dm = A, JC = !1;
    function km() {
      return Cr;
    }
    function Tr() {
      return (je & (Vn | Oa)) !== vn ? Wt() : (xp !== st || (xp = Wt()), xp);
    }
    function Fu(e) {
      var t = e.mode;
      if ((t & ke) === ce)
        return ye;
      if ((je & Vn) !== vn && hn !== A)
        return ko(hn);
      var a = Fx() !== Hx;
      if (a) {
        if (jn.transition !== null) {
          var i = jn.transition;
          i._updatedFibers || (i._updatedFibers = /* @__PURE__ */ new Set()), i._updatedFibers.add(e);
        }
        return Dm === Be && (Dm = dd()), Dm;
      }
      var u = jr();
      if (u !== Be)
        return u;
      var s = T1();
      return s;
    }
    function QD(e) {
      var t = e.mode;
      return (t & ke) === ce ? ye : Ov();
    }
    function yn(e, t, a, i) {
      vk(), JC && g("useInsertionEffect must not schedule updates."), jS && (xm = !0), hu(e, a, i), (je & Vn) !== A && e === Cr ? yk(t) : (er && Lo(e, t, a), gk(t), e === Cr && ((je & Vn) === vn && (Sp = xe(Sp, a)), mn === yp && ju(e, hn)), Ir(e, i), a === ye && je === vn && (t.mode & ke) === ce && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
      !ii.isBatchingLegacy && (Cp(), J0()));
    }
    function ID(e, t, a) {
      var i = e.current;
      i.lanes = t, hu(e, t, a), Ir(e, a);
    }
    function $D(e) {
      return (
        // TODO: Remove outdated deferRenderPhaseUpdateToNextBatch experiment. We
        // decided not to enable it.
        (je & Vn) !== vn
      );
    }
    function Ir(e, t) {
      var a = e.callbackNode;
      dc(e, t);
      var i = fc(e, e === Cr ? hn : A);
      if (i === A) {
        a !== null && hT(a), e.callbackNode = null, e.callbackPriority = Be;
        return;
      }
      var u = wi(i), s = e.callbackPriority;
      if (s === u && // Special case related to `act`. If the currently scheduled task is a
      // Scheduler task, rather than an `act` task, cancel it and re-scheduled
      // on the `act` queue.
      !(ii.current !== null && a !== $S)) {
        a == null && s !== ye && g("Expected scheduled callback to exist. This error is likely caused by a bug in React. Please file an issue.");
        return;
      }
      a != null && hT(a);
      var f;
      if (u === ye)
        e.tag === ku ? (ii.isBatchingLegacy !== null && (ii.didScheduleLegacyUpdate = !0), Ex(nT.bind(null, e))) : Z0(nT.bind(null, e)), ii.current !== null ? ii.current.push(bu) : x1(function() {
          (je & (Vn | Oa)) === vn && bu();
        }), f = null;
      else {
        var p;
        switch (Fv(i)) {
          case _n:
            p = po;
            break;
          case Ca:
            p = Ci;
            break;
          case Hr:
            p = Pa;
            break;
          case Fr:
            p = cl;
            break;
          default:
            p = Pa;
            break;
        }
        f = GS(p, eT.bind(null, e));
      }
      e.callbackPriority = u, e.callbackNode = f;
    }
    function eT(e, t) {
      if (cw(), xp = st, Dm = A, (je & (Vn | Oa)) !== vn)
        throw new Error("Should not already be working.");
      var a = e.callbackNode, i = jl();
      if (i && e.callbackNode !== a)
        return null;
      var u = fc(e, e === Cr ? hn : A);
      if (u === A)
        return null;
      var s = !vc(e, u) && !Lv(e, u) && !t, f = s ? nk(e, u) : _m(e, u);
      if (f !== Al) {
        if (f === is) {
          var p = pc(e);
          p !== A && (u = p, f = VS(e, p));
        }
        if (f === mp) {
          var v = gp;
          throw us(e, A), ju(e, u), Ir(e, Wt()), v;
        }
        if (f === MS)
          ju(e, u);
        else {
          var m = !vc(e, u), y = e.current.alternate;
          if (m && !WD(y)) {
            if (f = _m(e, u), f === is) {
              var R = pc(e);
              R !== A && (u = R, f = VS(e, R));
            }
            if (f === mp) {
              var C = gp;
              throw us(e, A), ju(e, u), Ir(e, Wt()), C;
            }
          }
          e.finishedWork = y, e.finishedLanes = u, GD(e, f, u);
        }
      }
      return Ir(e, Wt()), e.callbackNode === a ? eT.bind(null, e) : null;
    }
    function VS(e, t) {
      var a = Ep;
      if (yc(e)) {
        var i = us(e, t);
        i.flags |= Cn, px(e.containerInfo);
      }
      var u = _m(e, t);
      if (u !== is) {
        var s = Qr;
        Qr = a, s !== null && tT(s);
      }
      return u;
    }
    function tT(e) {
      Qr === null ? Qr = e : Qr.push.apply(Qr, e);
    }
    function GD(e, t, a) {
      switch (t) {
        case Al:
        case mp:
          throw new Error("Root did not complete. This is a bug in React.");
        case is: {
          os(e, Qr, Hl);
          break;
        }
        case Em: {
          if (ju(e, a), Cl(a) && // do not delay if we're inside an act() scope
          !mT()) {
            var i = zS + qC - Wt();
            if (i > 10) {
              var u = fc(e, A);
              if (u !== A)
                break;
              var s = e.suspendedLanes;
              if (!Tl(s, a)) {
                Tr(), hc(e, s);
                break;
              }
              e.timeoutHandle = Hy(os.bind(null, e, Qr, Hl), i);
              break;
            }
          }
          os(e, Qr, Hl);
          break;
        }
        case yp: {
          if (ju(e, a), cd(a))
            break;
          if (!mT()) {
            var f = ra(e, a), p = f, v = Wt() - p, m = pk(v) - v;
            if (m > 10) {
              e.timeoutHandle = Hy(os.bind(null, e, Qr, Hl), m);
              break;
            }
          }
          os(e, Qr, Hl);
          break;
        }
        case XC: {
          os(e, Qr, Hl);
          break;
        }
        default:
          throw new Error("Unknown root exit status.");
      }
    }
    function WD(e) {
      for (var t = e; ; ) {
        if (t.flags & cu) {
          var a = t.updateQueue;
          if (a !== null) {
            var i = a.stores;
            if (i !== null)
              for (var u = 0; u < i.length; u++) {
                var s = i[u], f = s.getSnapshot, p = s.value;
                try {
                  if (!j(f(), p))
                    return !1;
                } catch {
                  return !1;
                }
              }
          }
        }
        var v = t.child;
        if (t.subtreeFlags & cu && v !== null) {
          v.return = t, t = v;
          continue;
        }
        if (t === e)
          return !0;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e)
            return !0;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
      return !0;
    }
    function ju(e, t) {
      t = bo(t, Tm), t = bo(t, Sp), zv(e, t);
    }
    function nT(e) {
      if (fw(), (je & (Vn | Oa)) !== vn)
        throw new Error("Should not already be working.");
      jl();
      var t = fc(e, A);
      if (!nr(t, ye))
        return Ir(e, Wt()), null;
      var a = _m(e, t);
      if (e.tag !== ku && a === is) {
        var i = pc(e);
        i !== A && (t = i, a = VS(e, i));
      }
      if (a === mp) {
        var u = gp;
        throw us(e, A), ju(e, t), Ir(e, Wt()), u;
      }
      if (a === MS)
        throw new Error("Root did not complete. This is a bug in React.");
      var s = e.current.alternate;
      return e.finishedWork = s, e.finishedLanes = t, os(e, Qr, Hl), Ir(e, Wt()), null;
    }
    function XD(e, t) {
      t !== A && (mc(e, xe(t, ye)), Ir(e, Wt()), (je & (Vn | Oa)) === vn && (Cp(), bu()));
    }
    function BS(e, t) {
      var a = je;
      je |= WC;
      try {
        return e(t);
      } finally {
        je = a, je === vn && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
        !ii.isBatchingLegacy && (Cp(), J0());
      }
    }
    function qD(e, t, a, i, u) {
      var s = jr(), f = jn.transition;
      try {
        return jn.transition = null, Bt(_n), e(t, a, i, u);
      } finally {
        Bt(s), jn.transition = f, je === vn && Cp();
      }
    }
    function Fl(e) {
      Hu !== null && Hu.tag === ku && (je & (Vn | Oa)) === vn && jl();
      var t = je;
      je |= WC;
      var a = jn.transition, i = jr();
      try {
        return jn.transition = null, Bt(_n), e ? e() : void 0;
      } finally {
        Bt(i), jn.transition = a, je = t, (je & (Vn | Oa)) === vn && bu();
      }
    }
    function rT() {
      return (je & (Vn | Oa)) !== vn;
    }
    function bm(e, t) {
      ur(NS, Bi, e), Bi = xe(Bi, t);
    }
    function PS(e) {
      Bi = NS.current, lr(NS, e);
    }
    function us(e, t) {
      e.finishedWork = null, e.finishedLanes = A;
      var a = e.timeoutHandle;
      if (a !== Fy && (e.timeoutHandle = Fy, R1(a)), Mt !== null)
        for (var i = Mt.return; i !== null; ) {
          var u = i.alternate;
          MC(u, i), i = i.return;
        }
      Cr = e;
      var s = ss(e.current, null);
      return Mt = s, hn = Bi = t, mn = Al, gp = null, Cm = A, Sp = A, Tm = A, Ep = null, Qr = null, Ix(), Ka.discardPendingWarnings(), s;
    }
    function aT(e, t) {
      do {
        var a = Mt;
        try {
          if (Fh(), bE(), xt(), OS.current = null, a === null || a.return === null) {
            mn = mp, gp = t, Mt = null;
            return;
          }
          if (kn && a.mode & Pe && pm(a, !0), Wr)
            if (yr(), t !== null && typeof t == "object" && typeof t.then == "function") {
              var i = t;
              Ea(a, i, hn);
            } else
              ho(a, t, hn);
          Ew(e, a.return, a, t, hn), oT(a);
        } catch (u) {
          t = u, Mt === a && a !== null ? (a = a.return, Mt = a) : a = Mt;
          continue;
        }
        return;
      } while (!0);
    }
    function iT() {
      var e = LS.current;
      return LS.current = om, e === null ? om : e;
    }
    function lT(e) {
      LS.current = e;
    }
    function KD() {
      zS = Wt();
    }
    function wp(e) {
      Cm = xe(e, Cm);
    }
    function ZD() {
      mn === Al && (mn = Em);
    }
    function YS() {
      (mn === Al || mn === Em || mn === is) && (mn = yp), Cr !== null && (Do(Cm) || Do(Sp)) && ju(Cr, hn);
    }
    function JD(e) {
      mn !== yp && (mn = is), Ep === null ? Ep = [e] : Ep.push(e);
    }
    function ek() {
      return mn === Al;
    }
    function _m(e, t) {
      var a = je;
      je |= Vn;
      var i = iT();
      if (Cr !== e || hn !== t) {
        if (er) {
          var u = e.memoizedUpdaters;
          u.size > 0 && (Dp(e, hn), u.clear()), Uv(e, t);
        }
        Hl = md(), us(e, t);
      }
      vl(t);
      do
        try {
          tk();
          break;
        } catch (s) {
          aT(e, s);
        }
      while (!0);
      if (Fh(), je = a, lT(i), Mt !== null)
        throw new Error("Cannot commit an incomplete root. This error is likely caused by a bug in React. Please file an issue.");
      return Gs(), Cr = null, hn = A, mn;
    }
    function tk() {
      for (; Mt !== null; )
        uT(Mt);
    }
    function nk(e, t) {
      var a = je;
      je |= Vn;
      var i = iT();
      if (Cr !== e || hn !== t) {
        if (er) {
          var u = e.memoizedUpdaters;
          u.size > 0 && (Dp(e, hn), u.clear()), Uv(e, t);
        }
        Hl = md(), Cp(), us(e, t);
      }
      vl(t);
      do
        try {
          rk();
          break;
        } catch (s) {
          aT(e, s);
        }
      while (!0);
      return Fh(), lT(i), je = a, Mt !== null ? (Dv(), Al) : (Gs(), Cr = null, hn = A, mn);
    }
    function rk() {
      for (; Mt !== null && !Xf(); )
        uT(Mt);
    }
    function uT(e) {
      var t = e.alternate;
      dt(e);
      var a;
      (e.mode & Pe) !== ce ? ($g(e), a = QS(t, e, Bi), pm(e, !0)) : a = QS(t, e, Bi), xt(), e.memoizedProps = e.pendingProps, a === null ? oT(e) : Mt = a, OS.current = null;
    }
    function oT(e) {
      var t = e;
      do {
        var a = t.alternate, i = t.return;
        if ((t.flags & fo) === se) {
          dt(t);
          var u = void 0;
          if ((t.mode & Pe) === ce ? u = OC(a, t, Bi) : ($g(t), u = OC(a, t, Bi), pm(t, !1)), xt(), u !== null) {
            Mt = u;
            return;
          }
        } else {
          var s = Zw(a, t);
          if (s !== null) {
            s.flags &= Ev, Mt = s;
            return;
          }
          if ((t.mode & Pe) !== ce) {
            pm(t, !1);
            for (var f = t.actualDuration, p = t.child; p !== null; )
              f += p.actualDuration, p = p.sibling;
            t.actualDuration = f;
          }
          if (i !== null)
            i.flags |= fo, i.subtreeFlags = se, i.deletions = null;
          else {
            mn = MS, Mt = null;
            return;
          }
        }
        var v = t.sibling;
        if (v !== null) {
          Mt = v;
          return;
        }
        t = i, Mt = t;
      } while (t !== null);
      mn === Al && (mn = XC);
    }
    function os(e, t, a) {
      var i = jr(), u = jn.transition;
      try {
        jn.transition = null, Bt(_n), ak(e, t, a, i);
      } finally {
        jn.transition = u, Bt(i);
      }
      return null;
    }
    function ak(e, t, a, i) {
      do
        jl();
      while (Hu !== null);
      if (hk(), (je & (Vn | Oa)) !== vn)
        throw new Error("Should not already be working.");
      var u = e.finishedWork, s = e.finishedLanes;
      if (td(s), u === null)
        return nd(), null;
      if (s === A && g("root.finishedLanes should not be empty during a commit. This is a bug in React."), e.finishedWork = null, e.finishedLanes = A, u === e.current)
        throw new Error("Cannot commit the same tree as before. This error is likely caused by a bug in React. Please file an issue.");
      e.callbackNode = null, e.callbackPriority = Be;
      var f = xe(u.lanes, u.childLanes);
      vd(e, f), e === Cr && (Cr = null, Mt = null, hn = A), ((u.subtreeFlags & Ba) !== se || (u.flags & Ba) !== se) && (ls || (ls = !0, HS = a, GS(Pa, function() {
        return jl(), null;
      })));
      var p = (u.subtreeFlags & (gi | Si | Ei | Ba)) !== se, v = (u.flags & (gi | Si | Ei | Ba)) !== se;
      if (p || v) {
        var m = jn.transition;
        jn.transition = null;
        var y = jr();
        Bt(_n);
        var R = je;
        je |= Oa, OS.current = null, rD(e, u), JE(), yD(e, u, s), m1(e.containerInfo), e.current = u, mo(s), gD(u, e, s), yo(), qf(), je = R, Bt(y), jn.transition = m;
      } else
        e.current = u, JE();
      var C = ls;
      if (ls ? (ls = !1, Hu = e, Tp = s) : (rf = 0, wm = null), f = e.pendingLanes, f === A && (nf = null), C || dT(e.current, !1), Zf(u.stateNode, i), er && e.memoizedUpdaters.clear(), HD(), Ir(e, Wt()), t !== null)
        for (var _ = e.onRecoverableError, O = 0; O < t.length; O++) {
          var M = t[O], W = M.stack, fe = M.digest;
          _(M.value, {
            componentStack: W,
            digest: fe
          });
        }
      if (Rm) {
        Rm = !1;
        var ue = US;
        throw US = null, ue;
      }
      return nr(Tp, ye) && e.tag !== ku && jl(), f = e.pendingLanes, nr(f, ye) ? (sw(), e === FS ? Rp++ : (Rp = 0, FS = e)) : Rp = 0, bu(), nd(), null;
    }
    function jl() {
      if (Hu !== null) {
        var e = Fv(Tp), t = Mo(Hr, e), a = jn.transition, i = jr();
        try {
          return jn.transition = null, Bt(t), lk();
        } finally {
          Bt(i), jn.transition = a;
        }
      }
      return !1;
    }
    function ik(e) {
      AS.push(e), ls || (ls = !0, GS(Pa, function() {
        return jl(), null;
      }));
    }
    function lk() {
      if (Hu === null)
        return !1;
      var e = HS;
      HS = null;
      var t = Hu, a = Tp;
      if (Hu = null, Tp = A, (je & (Vn | Oa)) !== vn)
        throw new Error("Cannot flush passive effects while already rendering.");
      jS = !0, xm = !1, pl(a);
      var i = je;
      je |= Oa, wD(t.current), CD(t, t.current, a, e);
      {
        var u = AS;
        AS = [];
        for (var s = 0; s < u.length; s++) {
          var f = u[s];
          uD(t, f);
        }
      }
      id(), dT(t.current, !0), je = i, bu(), xm ? t === wm ? rf++ : (rf = 0, wm = t) : rf = 0, jS = !1, xm = !1, Jf(t);
      {
        var p = t.current.stateNode;
        p.effectDuration = 0, p.passiveEffectDuration = 0;
      }
      return !0;
    }
    function sT(e) {
      return nf !== null && nf.has(e);
    }
    function uk(e) {
      nf === null ? nf = /* @__PURE__ */ new Set([e]) : nf.add(e);
    }
    function ok(e) {
      Rm || (Rm = !0, US = e);
    }
    var sk = ok;
    function cT(e, t, a) {
      var i = rs(a, t), u = uC(e, i, ye), s = Lu(e, u, ye), f = Tr();
      s !== null && (hu(s, ye, f), Ir(s, f));
    }
    function pt(e, t, a) {
      if (eD(a), kp(!1), e.tag === P) {
        cT(e, e, a);
        return;
      }
      var i = null;
      for (i = t; i !== null; ) {
        if (i.tag === P) {
          cT(i, e, a);
          return;
        } else if (i.tag === le) {
          var u = i.type, s = i.stateNode;
          if (typeof u.getDerivedStateFromError == "function" || typeof s.componentDidCatch == "function" && !sT(s)) {
            var f = rs(a, e), p = cS(i, f, ye), v = Lu(i, p, ye), m = Tr();
            v !== null && (hu(v, ye, m), Ir(v, m));
            return;
          }
        }
        i = i.return;
      }
      g(`Internal React error: Attempted to capture a commit phase error inside a detached tree. This indicates a bug in React. Likely causes include deleting the same fiber more than once, committing an already-finished tree, or an inconsistent return pointer.

Error message:

%s`, a);
    }
    function ck(e, t, a) {
      var i = e.pingCache;
      i !== null && i.delete(t);
      var u = Tr();
      hc(e, a), Sk(e), Cr === e && Tl(hn, a) && (mn === yp || mn === Em && Cl(hn) && Wt() - zS < qC ? us(e, A) : Tm = xe(Tm, a)), Ir(e, u);
    }
    function fT(e, t) {
      t === Be && (t = QD(e));
      var a = Tr(), i = Pr(e, t);
      i !== null && (hu(i, t, a), Ir(i, a));
    }
    function fk(e) {
      var t = e.memoizedState, a = Be;
      t !== null && (a = t.retryLane), fT(e, a);
    }
    function dk(e, t) {
      var a = Be, i;
      switch (e.tag) {
        case _e:
          i = e.stateNode;
          var u = e.memoizedState;
          u !== null && (a = u.retryLane);
          break;
        case It:
          i = e.stateNode;
          break;
        default:
          throw new Error("Pinged unknown suspense boundary type. This is probably a bug in React.");
      }
      i !== null && i.delete(t), fT(e, a);
    }
    function pk(e) {
      return e < 120 ? 120 : e < 480 ? 480 : e < 1080 ? 1080 : e < 1920 ? 1920 : e < 3e3 ? 3e3 : e < 4320 ? 4320 : VD(e / 1960) * 1960;
    }
    function vk() {
      if (Rp > PD)
        throw Rp = 0, FS = null, new Error("Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.");
      rf > YD && (rf = 0, wm = null, g("Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."));
    }
    function hk() {
      Ka.flushLegacyContextWarning(), Ka.flushPendingUnsafeLifecycleWarnings();
    }
    function dT(e, t) {
      dt(e), Lm(e, yi, zD), t && Lm(e, ya, UD), Lm(e, yi, MD), t && Lm(e, ya, ND), xt();
    }
    function Lm(e, t, a) {
      for (var i = e, u = null; i !== null; ) {
        var s = i.subtreeFlags & t;
        i !== u && i.child !== null && s !== se ? i = i.child : ((i.flags & t) !== se && a(i), i.sibling !== null ? i = i.sibling : i = u = i.return);
      }
    }
    var Om = null;
    function pT(e) {
      {
        if ((je & Vn) !== vn || !(e.mode & ke))
          return;
        var t = e.tag;
        if (t !== Dt && t !== P && t !== le && t !== ge && t !== De && t !== mt && t !== Me)
          return;
        var a = Re(e) || "ReactComponent";
        if (Om !== null) {
          if (Om.has(a))
            return;
          Om.add(a);
        } else
          Om = /* @__PURE__ */ new Set([a]);
        var i = bn;
        try {
          dt(e), g("Can't perform a React state update on a component that hasn't mounted yet. This indicates that you have a side-effect in your render function that asynchronously later calls tries to update the component. Move this work to useEffect instead.");
        } finally {
          i ? dt(e) : xt();
        }
      }
    }
    var QS;
    {
      var mk = null;
      QS = function(e, t, a) {
        var i = CT(mk, t);
        try {
          return DC(e, t, a);
        } catch (s) {
          if (bx() || s !== null && typeof s == "object" && typeof s.then == "function")
            throw s;
          if (Fh(), bE(), MC(e, t), CT(t, i), t.mode & Pe && $g(t), mi(null, DC, null, e, t, a), ja()) {
            var u = co();
            typeof u == "object" && u !== null && u._suppressLogging && typeof s == "object" && s !== null && !s._suppressLogging && (s._suppressLogging = !0);
          }
          throw s;
        }
      };
    }
    var vT = !1, IS;
    IS = /* @__PURE__ */ new Set();
    function yk(e) {
      if (ci && !lw())
        switch (e.tag) {
          case ge:
          case De:
          case Me: {
            var t = Mt && Re(Mt) || "Unknown", a = t;
            if (!IS.has(a)) {
              IS.add(a);
              var i = Re(e) || "Unknown";
              g("Cannot update a component (`%s`) while rendering a different component (`%s`). To locate the bad setState() call inside `%s`, follow the stack trace as described in https://reactjs.org/link/setstate-in-render", i, t, t);
            }
            break;
          }
          case le: {
            vT || (g("Cannot update during an existing state transition (such as within `render`). Render methods should be a pure function of props and state."), vT = !0);
            break;
          }
        }
    }
    function Dp(e, t) {
      if (er) {
        var a = e.memoizedUpdaters;
        a.forEach(function(i) {
          Lo(e, i, t);
        });
      }
    }
    var $S = {};
    function GS(e, t) {
      {
        var a = ii.current;
        return a !== null ? (a.push(t), $S) : Wf(e, t);
      }
    }
    function hT(e) {
      if (e !== $S)
        return Tv(e);
    }
    function mT() {
      return ii.current !== null;
    }
    function gk(e) {
      {
        if (e.mode & ke) {
          if (!GC())
            return;
        } else if (!jD() || je !== vn || e.tag !== ge && e.tag !== De && e.tag !== Me)
          return;
        if (ii.current === null) {
          var t = bn;
          try {
            dt(e), g(`An update to %s inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`, Re(e));
          } finally {
            t ? dt(e) : xt();
          }
        }
      }
    }
    function Sk(e) {
      e.tag !== ku && GC() && ii.current === null && g(`A suspended resource finished loading inside a test, but the event was not wrapped in act(...).

When testing, code that resolves suspended data should be wrapped into act(...):

act(() => {
  /* finish loading suspended data */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`);
    }
    function kp(e) {
      JC = e;
    }
    var Ma = null, af = null, Ek = function(e) {
      Ma = e;
    };
    function lf(e) {
      {
        if (Ma === null)
          return e;
        var t = Ma(e);
        return t === void 0 ? e : t.current;
      }
    }
    function WS(e) {
      return lf(e);
    }
    function XS(e) {
      {
        if (Ma === null)
          return e;
        var t = Ma(e);
        if (t === void 0) {
          if (e != null && typeof e.render == "function") {
            var a = lf(e.render);
            if (e.render !== a) {
              var i = {
                $$typeof: ql,
                render: a
              };
              return e.displayName !== void 0 && (i.displayName = e.displayName), i;
            }
          }
          return e;
        }
        return t.current;
      }
    }
    function yT(e, t) {
      {
        if (Ma === null)
          return !1;
        var a = e.elementType, i = t.type, u = !1, s = typeof i == "object" && i !== null ? i.$$typeof : null;
        switch (e.tag) {
          case le: {
            typeof i == "function" && (u = !0);
            break;
          }
          case ge: {
            (typeof i == "function" || s === En) && (u = !0);
            break;
          }
          case De: {
            (s === ql || s === En) && (u = !0);
            break;
          }
          case mt:
          case Me: {
            (s === Kr || s === En) && (u = !0);
            break;
          }
          default:
            return !1;
        }
        if (u) {
          var f = Ma(a);
          if (f !== void 0 && f === Ma(i))
            return !0;
        }
        return !1;
      }
    }
    function gT(e) {
      {
        if (Ma === null || typeof WeakSet != "function")
          return;
        af === null && (af = /* @__PURE__ */ new WeakSet()), af.add(e);
      }
    }
    var Ck = function(e, t) {
      {
        if (Ma === null)
          return;
        var a = t.staleFamilies, i = t.updatedFamilies;
        jl(), Fl(function() {
          qS(e.current, i, a);
        });
      }
    }, Tk = function(e, t) {
      {
        if (e.context !== la)
          return;
        jl(), Fl(function() {
          bp(t, e, null, null);
        });
      }
    };
    function qS(e, t, a) {
      {
        var i = e.alternate, u = e.child, s = e.sibling, f = e.tag, p = e.type, v = null;
        switch (f) {
          case ge:
          case Me:
          case le:
            v = p;
            break;
          case De:
            v = p.render;
            break;
        }
        if (Ma === null)
          throw new Error("Expected resolveFamily to be set during hot reload.");
        var m = !1, y = !1;
        if (v !== null) {
          var R = Ma(v);
          R !== void 0 && (a.has(R) ? y = !0 : t.has(R) && (f === le ? y = !0 : m = !0));
        }
        if (af !== null && (af.has(e) || i !== null && af.has(i)) && (y = !0), y && (e._debugNeedsRemount = !0), y || m) {
          var C = Pr(e, ye);
          C !== null && yn(C, e, ye, st);
        }
        u !== null && !y && qS(u, t, a), s !== null && qS(s, t, a);
      }
    }
    var Rk = function(e, t) {
      {
        var a = /* @__PURE__ */ new Set(), i = new Set(t.map(function(u) {
          return u.current;
        }));
        return KS(e.current, i, a), a;
      }
    };
    function KS(e, t, a) {
      {
        var i = e.child, u = e.sibling, s = e.tag, f = e.type, p = null;
        switch (s) {
          case ge:
          case Me:
          case le:
            p = f;
            break;
          case De:
            p = f.render;
            break;
        }
        var v = !1;
        p !== null && t.has(p) && (v = !0), v ? xk(e, a) : i !== null && KS(i, t, a), u !== null && KS(u, t, a);
      }
    }
    function xk(e, t) {
      {
        var a = wk(e, t);
        if (a)
          return;
        for (var i = e; ; ) {
          switch (i.tag) {
            case J:
              t.add(i.stateNode);
              return;
            case me:
              t.add(i.stateNode.containerInfo);
              return;
            case P:
              t.add(i.stateNode.containerInfo);
              return;
          }
          if (i.return === null)
            throw new Error("Expected to reach root first.");
          i = i.return;
        }
      }
    }
    function wk(e, t) {
      for (var a = e, i = !1; ; ) {
        if (a.tag === J)
          i = !0, t.add(a.stateNode);
        else if (a.child !== null) {
          a.child.return = a, a = a.child;
          continue;
        }
        if (a === e)
          return i;
        for (; a.sibling === null; ) {
          if (a.return === null || a.return === e)
            return i;
          a = a.return;
        }
        a.sibling.return = a.return, a = a.sibling;
      }
      return !1;
    }
    var ZS;
    {
      ZS = !1;
      try {
        var ST = Object.preventExtensions({});
      } catch {
        ZS = !0;
      }
    }
    function Dk(e, t, a, i) {
      this.tag = e, this.key = a, this.elementType = null, this.type = null, this.stateNode = null, this.return = null, this.child = null, this.sibling = null, this.index = 0, this.ref = null, this.pendingProps = t, this.memoizedProps = null, this.updateQueue = null, this.memoizedState = null, this.dependencies = null, this.mode = i, this.flags = se, this.subtreeFlags = se, this.deletions = null, this.lanes = A, this.childLanes = A, this.alternate = null, this.actualDuration = Number.NaN, this.actualStartTime = Number.NaN, this.selfBaseDuration = Number.NaN, this.treeBaseDuration = Number.NaN, this.actualDuration = 0, this.actualStartTime = -1, this.selfBaseDuration = 0, this.treeBaseDuration = 0, this._debugSource = null, this._debugOwner = null, this._debugNeedsRemount = !1, this._debugHookTypes = null, !ZS && typeof Object.preventExtensions == "function" && Object.preventExtensions(this);
    }
    var ua = function(e, t, a, i) {
      return new Dk(e, t, a, i);
    };
    function JS(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function kk(e) {
      return typeof e == "function" && !JS(e) && e.defaultProps === void 0;
    }
    function bk(e) {
      if (typeof e == "function")
        return JS(e) ? le : ge;
      if (e != null) {
        var t = e.$$typeof;
        if (t === ql)
          return De;
        if (t === Kr)
          return mt;
      }
      return Dt;
    }
    function ss(e, t) {
      var a = e.alternate;
      a === null ? (a = ua(e.tag, t, e.key, e.mode), a.elementType = e.elementType, a.type = e.type, a.stateNode = e.stateNode, a._debugSource = e._debugSource, a._debugOwner = e._debugOwner, a._debugHookTypes = e._debugHookTypes, a.alternate = e, e.alternate = a) : (a.pendingProps = t, a.type = e.type, a.flags = se, a.subtreeFlags = se, a.deletions = null, a.actualDuration = 0, a.actualStartTime = -1), a.flags = e.flags & Ft, a.childLanes = e.childLanes, a.lanes = e.lanes, a.child = e.child, a.memoizedProps = e.memoizedProps, a.memoizedState = e.memoizedState, a.updateQueue = e.updateQueue;
      var i = e.dependencies;
      switch (a.dependencies = i === null ? null : {
        lanes: i.lanes,
        firstContext: i.firstContext
      }, a.sibling = e.sibling, a.index = e.index, a.ref = e.ref, a.selfBaseDuration = e.selfBaseDuration, a.treeBaseDuration = e.treeBaseDuration, a._debugNeedsRemount = e._debugNeedsRemount, a.tag) {
        case Dt:
        case ge:
        case Me:
          a.type = lf(e.type);
          break;
        case le:
          a.type = WS(e.type);
          break;
        case De:
          a.type = XS(e.type);
          break;
      }
      return a;
    }
    function _k(e, t) {
      e.flags &= Ft | yt;
      var a = e.alternate;
      if (a === null)
        e.childLanes = A, e.lanes = t, e.child = null, e.subtreeFlags = se, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null, e.selfBaseDuration = 0, e.treeBaseDuration = 0;
      else {
        e.childLanes = a.childLanes, e.lanes = a.lanes, e.child = a.child, e.subtreeFlags = se, e.deletions = null, e.memoizedProps = a.memoizedProps, e.memoizedState = a.memoizedState, e.updateQueue = a.updateQueue, e.type = a.type;
        var i = a.dependencies;
        e.dependencies = i === null ? null : {
          lanes: i.lanes,
          firstContext: i.firstContext
        }, e.selfBaseDuration = a.selfBaseDuration, e.treeBaseDuration = a.treeBaseDuration;
      }
      return e;
    }
    function Lk(e, t, a) {
      var i;
      return e === bh ? (i = ke, t === !0 && (i |= nt, i |= Ye)) : i = ce, er && (i |= Pe), ua(P, null, null, i);
    }
    function e0(e, t, a, i, u, s) {
      var f = Dt, p = e;
      if (typeof e == "function")
        JS(e) ? (f = le, p = WS(p)) : p = lf(p);
      else if (typeof e == "string")
        f = J;
      else
        e: switch (e) {
          case Gl:
            return Vu(a.children, u, s, t);
          case Wi:
            f = et, u |= nt, (u & ke) !== ce && (u |= Ye);
            break;
          case Wl:
            return Ok(a, u, s, t);
          case ds:
            return Mk(a, u, s, t);
          case ps:
            return Nk(a, u, s, t);
          case pf:
            return ET(a, u, s, t);
          case Ap:
          case Up:
          case Hp:
          case Fp:
          case Fm:
          default: {
            if (typeof e == "object" && e !== null)
              switch (e.$$typeof) {
                case Xl:
                  f = lt;
                  break e;
                case Iu:
                  f = Pn;
                  break e;
                case ql:
                  f = De, p = XS(p);
                  break e;
                case Kr:
                  f = mt;
                  break e;
                case En:
                  f = wn, p = null;
                  break e;
              }
            var v = "";
            {
              (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (v += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
              var m = i ? Re(i) : null;
              m && (v += `

Check the render method of \`` + m + "`.");
            }
            throw new Error("Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) " + ("but got: " + (e == null ? e : typeof e) + "." + v));
          }
        }
      var y = ua(f, a, t, u);
      return y.elementType = e, y.type = p, y.lanes = s, y._debugOwner = i, y;
    }
    function t0(e, t, a) {
      var i = null;
      i = e._owner;
      var u = e.type, s = e.key, f = e.props, p = e0(u, s, f, i, t, a);
      return p._debugSource = e._source, p._debugOwner = e._owner, p;
    }
    function Vu(e, t, a, i) {
      var u = ua(Ge, e, i, t);
      return u.lanes = a, u;
    }
    function Ok(e, t, a, i) {
      typeof e.id != "string" && g('Profiler must specify an "id" of type `string` as a prop. Received the type `%s` instead.', typeof e.id);
      var u = ua(be, e, i, t | Pe);
      return u.elementType = Wl, u.lanes = a, u.stateNode = {
        effectDuration: 0,
        passiveEffectDuration: 0
      }, u;
    }
    function Mk(e, t, a, i) {
      var u = ua(_e, e, i, t);
      return u.elementType = ds, u.lanes = a, u;
    }
    function Nk(e, t, a, i) {
      var u = ua(It, e, i, t);
      return u.elementType = ps, u.lanes = a, u;
    }
    function ET(e, t, a, i) {
      var u = ua(Le, e, i, t);
      u.elementType = pf, u.lanes = a;
      var s = {
        isHidden: !1
      };
      return u.stateNode = s, u;
    }
    function n0(e, t, a) {
      var i = ua(Oe, e, null, t);
      return i.lanes = a, i;
    }
    function zk() {
      var e = ua(J, null, null, ce);
      return e.elementType = "DELETED", e;
    }
    function Uk(e) {
      var t = ua(Kt, null, null, ce);
      return t.stateNode = e, t;
    }
    function r0(e, t, a) {
      var i = e.children !== null ? e.children : [], u = ua(me, i, e.key, t);
      return u.lanes = a, u.stateNode = {
        containerInfo: e.containerInfo,
        pendingChildren: null,
        // Used by persistent updates
        implementation: e.implementation
      }, u;
    }
    function CT(e, t) {
      return e === null && (e = ua(Dt, null, null, ce)), e.tag = t.tag, e.key = t.key, e.elementType = t.elementType, e.type = t.type, e.stateNode = t.stateNode, e.return = t.return, e.child = t.child, e.sibling = t.sibling, e.index = t.index, e.ref = t.ref, e.pendingProps = t.pendingProps, e.memoizedProps = t.memoizedProps, e.updateQueue = t.updateQueue, e.memoizedState = t.memoizedState, e.dependencies = t.dependencies, e.mode = t.mode, e.flags = t.flags, e.subtreeFlags = t.subtreeFlags, e.deletions = t.deletions, e.lanes = t.lanes, e.childLanes = t.childLanes, e.alternate = t.alternate, e.actualDuration = t.actualDuration, e.actualStartTime = t.actualStartTime, e.selfBaseDuration = t.selfBaseDuration, e.treeBaseDuration = t.treeBaseDuration, e._debugSource = t._debugSource, e._debugOwner = t._debugOwner, e._debugNeedsRemount = t._debugNeedsRemount, e._debugHookTypes = t._debugHookTypes, e;
    }
    function Ak(e, t, a, i, u) {
      this.tag = t, this.containerInfo = e, this.pendingChildren = null, this.current = null, this.pingCache = null, this.finishedWork = null, this.timeoutHandle = Fy, this.context = null, this.pendingContext = null, this.callbackNode = null, this.callbackPriority = Be, this.eventTimes = _o(A), this.expirationTimes = _o(st), this.pendingLanes = A, this.suspendedLanes = A, this.pingedLanes = A, this.expiredLanes = A, this.mutableReadLanes = A, this.finishedLanes = A, this.entangledLanes = A, this.entanglements = _o(A), this.identifierPrefix = i, this.onRecoverableError = u, this.mutableSourceEagerHydrationData = null, this.effectDuration = 0, this.passiveEffectDuration = 0;
      {
        this.memoizedUpdaters = /* @__PURE__ */ new Set();
        for (var s = this.pendingUpdatersLaneMap = [], f = 0; f < hl; f++)
          s.push(/* @__PURE__ */ new Set());
      }
      switch (t) {
        case bh:
          this._debugRootType = a ? "hydrateRoot()" : "createRoot()";
          break;
        case ku:
          this._debugRootType = a ? "hydrate()" : "render()";
          break;
      }
    }
    function TT(e, t, a, i, u, s, f, p, v, m) {
      var y = new Ak(e, t, a, p, v), R = Lk(t, s);
      y.current = R, R.stateNode = y;
      {
        var C = {
          element: i,
          isDehydrated: a,
          cache: null,
          // not enabled yet
          transitions: null,
          pendingSuspenseBoundaries: null
        };
        R.memoizedState = C;
      }
      return mg(R), y;
    }
    var a0 = "18.3.1";
    function Hk(e, t, a) {
      var i = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : null;
      return Ql(i), {
        // This tag allow us to uniquely identify this as a React Portal
        $$typeof: qr,
        key: i == null ? null : "" + i,
        children: e,
        containerInfo: t,
        implementation: a
      };
    }
    var i0, l0;
    i0 = !1, l0 = {};
    function RT(e) {
      if (!e)
        return la;
      var t = su(e), a = Sx(t);
      if (t.tag === le) {
        var i = t.type;
        if (zi(i))
          return q0(t, i, a);
      }
      return a;
    }
    function Fk(e, t) {
      {
        var a = su(e);
        if (a === void 0) {
          if (typeof e.render == "function")
            throw new Error("Unable to find node on an unmounted component.");
          var i = Object.keys(e).join(",");
          throw new Error("Argument appears to not be a ReactComponent. Keys: " + i);
        }
        var u = Zn(a);
        if (u === null)
          return null;
        if (u.mode & nt) {
          var s = Re(a) || "Component";
          if (!l0[s]) {
            l0[s] = !0;
            var f = bn;
            try {
              dt(u), a.mode & nt ? g("%s is deprecated in StrictMode. %s was passed an instance of %s which is inside StrictMode. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, s) : g("%s is deprecated in StrictMode. %s was passed an instance of %s which renders StrictMode children. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, s);
            } finally {
              f ? dt(f) : xt();
            }
          }
        }
        return u.stateNode;
      }
    }
    function xT(e, t, a, i, u, s, f, p) {
      var v = !1, m = null;
      return TT(e, t, v, m, a, i, u, s, f);
    }
    function wT(e, t, a, i, u, s, f, p, v, m) {
      var y = !0, R = TT(a, i, y, e, u, s, f, p, v);
      R.context = RT(null);
      var C = R.current, _ = Tr(), O = Fu(C), M = zl(_, O);
      return M.callback = t ?? null, Lu(C, M, O), ID(R, O, _), R;
    }
    function bp(e, t, a, i) {
      Kf(t, e);
      var u = t.current, s = Tr(), f = Fu(u);
      St(f);
      var p = RT(a);
      t.context === null ? t.context = p : t.pendingContext = p, ci && bn !== null && !i0 && (i0 = !0, g(`Render methods should be a pure function of props and state; triggering nested component updates from render is not allowed. If necessary, trigger nested updates in componentDidUpdate.

Check the render method of %s.`, Re(bn) || "Unknown"));
      var v = zl(s, f);
      v.payload = {
        element: e
      }, i = i === void 0 ? null : i, i !== null && (typeof i != "function" && g("render(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", i), v.callback = i);
      var m = Lu(u, v, f);
      return m !== null && (yn(m, u, f, s), Yh(m, u, f)), f;
    }
    function Mm(e) {
      var t = e.current;
      if (!t.child)
        return null;
      switch (t.child.tag) {
        case J:
          return t.child.stateNode;
        default:
          return t.child.stateNode;
      }
    }
    function jk(e) {
      switch (e.tag) {
        case P: {
          var t = e.stateNode;
          if (yc(t)) {
            var a = bv(t);
            XD(t, a);
          }
          break;
        }
        case _e: {
          Fl(function() {
            var u = Pr(e, ye);
            if (u !== null) {
              var s = Tr();
              yn(u, e, ye, s);
            }
          });
          var i = ye;
          u0(e, i);
          break;
        }
      }
    }
    function DT(e, t) {
      var a = e.memoizedState;
      a !== null && a.dehydrated !== null && (a.retryLane = Nv(a.retryLane, t));
    }
    function u0(e, t) {
      DT(e, t);
      var a = e.alternate;
      a && DT(a, t);
    }
    function Vk(e) {
      if (e.tag === _e) {
        var t = Ro, a = Pr(e, t);
        if (a !== null) {
          var i = Tr();
          yn(a, e, t, i);
        }
        u0(e, t);
      }
    }
    function Bk(e) {
      if (e.tag === _e) {
        var t = Fu(e), a = Pr(e, t);
        if (a !== null) {
          var i = Tr();
          yn(a, e, t, i);
        }
        u0(e, t);
      }
    }
    function kT(e) {
      var t = vt(e);
      return t === null ? null : t.stateNode;
    }
    var bT = function(e) {
      return null;
    };
    function Pk(e) {
      return bT(e);
    }
    var _T = function(e) {
      return !1;
    };
    function Yk(e) {
      return _T(e);
    }
    var LT = null, OT = null, MT = null, NT = null, zT = null, UT = null, AT = null, HT = null, FT = null;
    {
      var jT = function(e, t, a) {
        var i = t[a], u = an(e) ? e.slice() : Ae({}, e);
        return a + 1 === t.length ? (an(u) ? u.splice(i, 1) : delete u[i], u) : (u[i] = jT(e[i], t, a + 1), u);
      }, VT = function(e, t) {
        return jT(e, t, 0);
      }, BT = function(e, t, a, i) {
        var u = t[i], s = an(e) ? e.slice() : Ae({}, e);
        if (i + 1 === t.length) {
          var f = a[i];
          s[f] = s[u], an(s) ? s.splice(u, 1) : delete s[u];
        } else
          s[u] = BT(
            // $FlowFixMe number or string is fine here
            e[u],
            t,
            a,
            i + 1
          );
        return s;
      }, PT = function(e, t, a) {
        if (t.length !== a.length) {
          Ue("copyWithRename() expects paths of the same length");
          return;
        } else
          for (var i = 0; i < a.length - 1; i++)
            if (t[i] !== a[i]) {
              Ue("copyWithRename() expects paths to be the same except for the deepest key");
              return;
            }
        return BT(e, t, a, 0);
      }, YT = function(e, t, a, i) {
        if (a >= t.length)
          return i;
        var u = t[a], s = an(e) ? e.slice() : Ae({}, e);
        return s[u] = YT(e[u], t, a + 1, i), s;
      }, QT = function(e, t, a) {
        return YT(e, t, 0, a);
      }, o0 = function(e, t) {
        for (var a = e.memoizedState; a !== null && t > 0; )
          a = a.next, t--;
        return a;
      };
      LT = function(e, t, a, i) {
        var u = o0(e, t);
        if (u !== null) {
          var s = QT(u.memoizedState, a, i);
          u.memoizedState = s, u.baseState = s, e.memoizedProps = Ae({}, e.memoizedProps);
          var f = Pr(e, ye);
          f !== null && yn(f, e, ye, st);
        }
      }, OT = function(e, t, a) {
        var i = o0(e, t);
        if (i !== null) {
          var u = VT(i.memoizedState, a);
          i.memoizedState = u, i.baseState = u, e.memoizedProps = Ae({}, e.memoizedProps);
          var s = Pr(e, ye);
          s !== null && yn(s, e, ye, st);
        }
      }, MT = function(e, t, a, i) {
        var u = o0(e, t);
        if (u !== null) {
          var s = PT(u.memoizedState, a, i);
          u.memoizedState = s, u.baseState = s, e.memoizedProps = Ae({}, e.memoizedProps);
          var f = Pr(e, ye);
          f !== null && yn(f, e, ye, st);
        }
      }, NT = function(e, t, a) {
        e.pendingProps = QT(e.memoizedProps, t, a), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var i = Pr(e, ye);
        i !== null && yn(i, e, ye, st);
      }, zT = function(e, t) {
        e.pendingProps = VT(e.memoizedProps, t), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var a = Pr(e, ye);
        a !== null && yn(a, e, ye, st);
      }, UT = function(e, t, a) {
        e.pendingProps = PT(e.memoizedProps, t, a), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var i = Pr(e, ye);
        i !== null && yn(i, e, ye, st);
      }, AT = function(e) {
        var t = Pr(e, ye);
        t !== null && yn(t, e, ye, st);
      }, HT = function(e) {
        bT = e;
      }, FT = function(e) {
        _T = e;
      };
    }
    function Qk(e) {
      var t = Zn(e);
      return t === null ? null : t.stateNode;
    }
    function Ik(e) {
      return null;
    }
    function $k() {
      return bn;
    }
    function Gk(e) {
      var t = e.findFiberByHostInstance, a = x.ReactCurrentDispatcher;
      return du({
        bundleType: e.bundleType,
        version: e.version,
        rendererPackageName: e.rendererPackageName,
        rendererConfig: e.rendererConfig,
        overrideHookState: LT,
        overrideHookStateDeletePath: OT,
        overrideHookStateRenamePath: MT,
        overrideProps: NT,
        overridePropsDeletePath: zT,
        overridePropsRenamePath: UT,
        setErrorHandler: HT,
        setSuspenseHandler: FT,
        scheduleUpdate: AT,
        currentDispatcherRef: a,
        findHostInstanceByFiber: Qk,
        findFiberByHostInstance: t || Ik,
        // React Refresh
        findHostInstancesForRefresh: Rk,
        scheduleRefresh: Ck,
        scheduleRoot: Tk,
        setRefreshHandler: Ek,
        // Enables DevTools to append owner stacks to error messages in DEV mode.
        getCurrentFiber: $k,
        // Enables DevTools to detect reconciler version rather than renderer version
        // which may not match for third party renderers.
        reconcilerVersion: a0
      });
    }
    var IT = typeof reportError == "function" ? (
      // In modern browsers, reportError will dispatch an error event,
      // emulating an uncaught JavaScript error.
      reportError
    ) : function(e) {
      console.error(e);
    };
    function s0(e) {
      this._internalRoot = e;
    }
    Nm.prototype.render = s0.prototype.render = function(e) {
      var t = this._internalRoot;
      if (t === null)
        throw new Error("Cannot update an unmounted root.");
      {
        typeof arguments[1] == "function" ? g("render(...): does not support the second callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().") : zm(arguments[1]) ? g("You passed a container to the second argument of root.render(...). You don't need to pass it again since you already passed it to create the root.") : typeof arguments[1] < "u" && g("You passed a second argument to root.render(...) but it only accepts one argument.");
        var a = t.containerInfo;
        if (a.nodeType !== At) {
          var i = kT(t.current);
          i && i.parentNode !== a && g("render(...): It looks like the React-rendered content of the root container was removed without using React. This is not supported and will cause errors. Instead, call root.unmount() to empty a root's container.");
        }
      }
      bp(e, t, null, null);
    }, Nm.prototype.unmount = s0.prototype.unmount = function() {
      typeof arguments[0] == "function" && g("unmount(...): does not support a callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().");
      var e = this._internalRoot;
      if (e !== null) {
        this._internalRoot = null;
        var t = e.containerInfo;
        rT() && g("Attempted to synchronously unmount a root while React was already rendering. React cannot finish unmounting the root until the current render has completed, which may lead to a race condition."), Fl(function() {
          bp(null, e, null, null);
        }), I0(t);
      }
    };
    function Wk(e, t) {
      if (!zm(e))
        throw new Error("createRoot(...): Target container is not a DOM element.");
      $T(e);
      var a = !1, i = !1, u = "", s = IT;
      t != null && (t.hydrate ? Ue("hydrate through createRoot is deprecated. Use ReactDOMClient.hydrateRoot(container, <App />) instead.") : typeof t == "object" && t !== null && t.$$typeof === si && g(`You passed a JSX element to createRoot. You probably meant to call root.render instead. Example usage:

  let root = createRoot(domContainer);
  root.render(<App />);`), t.unstable_strictMode === !0 && (a = !0), t.identifierPrefix !== void 0 && (u = t.identifierPrefix), t.onRecoverableError !== void 0 && (s = t.onRecoverableError), t.transitionCallbacks !== void 0 && t.transitionCallbacks);
      var f = xT(e, bh, null, a, i, u, s);
      Ch(f.current, e);
      var p = e.nodeType === At ? e.parentNode : e;
      return zd(p), new s0(f);
    }
    function Nm(e) {
      this._internalRoot = e;
    }
    function Xk(e) {
      e && Yv(e);
    }
    Nm.prototype.unstable_scheduleHydration = Xk;
    function qk(e, t, a) {
      if (!zm(e))
        throw new Error("hydrateRoot(...): Target container is not a DOM element.");
      $T(e), t === void 0 && g("Must provide initial children as second argument to hydrateRoot. Example usage: hydrateRoot(domContainer, <App />)");
      var i = a ?? null, u = a != null && a.hydratedSources || null, s = !1, f = !1, p = "", v = IT;
      a != null && (a.unstable_strictMode === !0 && (s = !0), a.identifierPrefix !== void 0 && (p = a.identifierPrefix), a.onRecoverableError !== void 0 && (v = a.onRecoverableError));
      var m = wT(t, null, e, bh, i, s, f, p, v);
      if (Ch(m.current, e), zd(e), u)
        for (var y = 0; y < u.length; y++) {
          var R = u[y];
          ew(m, R);
        }
      return new Nm(m);
    }
    function zm(e) {
      return !!(e && (e.nodeType === Xn || e.nodeType === Fa || e.nodeType === Af));
    }
    function _p(e) {
      return !!(e && (e.nodeType === Xn || e.nodeType === Fa || e.nodeType === Af || e.nodeType === At && e.nodeValue === " react-mount-point-unstable "));
    }
    function $T(e) {
      e.nodeType === Xn && e.tagName && e.tagName.toUpperCase() === "BODY" && g("createRoot(): Creating roots directly with document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try using a container element created for your app."), Id(e) && (e._reactRootContainer ? g("You are calling ReactDOMClient.createRoot() on a container that was previously passed to ReactDOM.render(). This is not supported.") : g("You are calling ReactDOMClient.createRoot() on a container that has already been passed to createRoot() before. Instead, call root.render() on the existing root instead if you want to update it."));
    }
    var Kk = x.ReactCurrentOwner, GT;
    GT = function(e) {
      if (e._reactRootContainer && e.nodeType !== At) {
        var t = kT(e._reactRootContainer.current);
        t && t.parentNode !== e && g("render(...): It looks like the React-rendered content of this container was removed without using React. This is not supported and will cause errors. Instead, call ReactDOM.unmountComponentAtNode to empty a container.");
      }
      var a = !!e._reactRootContainer, i = c0(e), u = !!(i && wu(i));
      u && !a && g("render(...): Replacing React-rendered children with a new root component. If you intended to update the children of this node, you should instead have the existing children update their state and render the new components instead of calling ReactDOM.render."), e.nodeType === Xn && e.tagName && e.tagName.toUpperCase() === "BODY" && g("render(): Rendering components directly into document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try rendering into a container element created for your app.");
    };
    function c0(e) {
      return e ? e.nodeType === Fa ? e.documentElement : e.firstChild : null;
    }
    function WT() {
    }
    function Zk(e, t, a, i, u) {
      if (u) {
        if (typeof i == "function") {
          var s = i;
          i = function() {
            var C = Mm(f);
            s.call(C);
          };
        }
        var f = wT(
          t,
          i,
          e,
          ku,
          null,
          // hydrationCallbacks
          !1,
          // isStrictMode
          !1,
          // concurrentUpdatesByDefaultOverride,
          "",
          // identifierPrefix
          WT
        );
        e._reactRootContainer = f, Ch(f.current, e);
        var p = e.nodeType === At ? e.parentNode : e;
        return zd(p), Fl(), f;
      } else {
        for (var v; v = e.lastChild; )
          e.removeChild(v);
        if (typeof i == "function") {
          var m = i;
          i = function() {
            var C = Mm(y);
            m.call(C);
          };
        }
        var y = xT(
          e,
          ku,
          null,
          // hydrationCallbacks
          !1,
          // isStrictMode
          !1,
          // concurrentUpdatesByDefaultOverride,
          "",
          // identifierPrefix
          WT
        );
        e._reactRootContainer = y, Ch(y.current, e);
        var R = e.nodeType === At ? e.parentNode : e;
        return zd(R), Fl(function() {
          bp(t, y, a, i);
        }), y;
      }
    }
    function Jk(e, t) {
      e !== null && typeof e != "function" && g("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e);
    }
    function Um(e, t, a, i, u) {
      GT(a), Jk(u === void 0 ? null : u, "render");
      var s = a._reactRootContainer, f;
      if (!s)
        f = Zk(a, t, e, u, i);
      else {
        if (f = s, typeof u == "function") {
          var p = u;
          u = function() {
            var v = Mm(f);
            p.call(v);
          };
        }
        bp(t, f, e, u);
      }
      return Mm(f);
    }
    var XT = !1;
    function eb(e) {
      {
        XT || (XT = !0, g("findDOMNode is deprecated and will be removed in the next major release. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node"));
        var t = Kk.current;
        if (t !== null && t.stateNode !== null) {
          var a = t.stateNode._warnedAboutRefsInRender;
          a || g("%s is accessing findDOMNode inside its render(). render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", Ze(t.type) || "A component"), t.stateNode._warnedAboutRefsInRender = !0;
        }
      }
      return e == null ? null : e.nodeType === Xn ? e : Fk(e, "findDOMNode");
    }
    function tb(e, t, a) {
      if (g("ReactDOM.hydrate is no longer supported in React 18. Use hydrateRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !_p(t))
        throw new Error("Target container is not a DOM element.");
      {
        var i = Id(t) && t._reactRootContainer === void 0;
        i && g("You are calling ReactDOM.hydrate() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call hydrateRoot(container, element)?");
      }
      return Um(null, e, t, !0, a);
    }
    function nb(e, t, a) {
      if (g("ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !_p(t))
        throw new Error("Target container is not a DOM element.");
      {
        var i = Id(t) && t._reactRootContainer === void 0;
        i && g("You are calling ReactDOM.render() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.render(element)?");
      }
      return Um(null, e, t, !1, a);
    }
    function rb(e, t, a, i) {
      if (g("ReactDOM.unstable_renderSubtreeIntoContainer() is no longer supported in React 18. Consider using a portal instead. Until you switch to the createRoot API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !_p(a))
        throw new Error("Target container is not a DOM element.");
      if (e == null || !uy(e))
        throw new Error("parentComponent must be a valid React Component");
      return Um(e, t, a, !1, i);
    }
    var qT = !1;
    function ab(e) {
      if (qT || (qT = !0, g("unmountComponentAtNode is deprecated and will be removed in the next major release. Switch to the createRoot API. Learn more: https://reactjs.org/link/switch-to-createroot")), !_p(e))
        throw new Error("unmountComponentAtNode(...): Target container is not a DOM element.");
      {
        var t = Id(e) && e._reactRootContainer === void 0;
        t && g("You are calling ReactDOM.unmountComponentAtNode() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.unmount()?");
      }
      if (e._reactRootContainer) {
        {
          var a = c0(e), i = a && !wu(a);
          i && g("unmountComponentAtNode(): The node you're attempting to unmount was rendered by another copy of React.");
        }
        return Fl(function() {
          Um(null, null, e, !1, function() {
            e._reactRootContainer = null, I0(e);
          });
        }), !0;
      } else {
        {
          var u = c0(e), s = !!(u && wu(u)), f = e.nodeType === Xn && _p(e.parentNode) && !!e.parentNode._reactRootContainer;
          s && g("unmountComponentAtNode(): The node you're attempting to unmount was rendered by React and is not a top-level container. %s", f ? "You may have accidentally passed in a React root node instead of its container." : "Instead, have the parent component update its state and rerender in order to remove this component.");
        }
        return !1;
      }
    }
    Rn(jk), mu(Vk), jv(Bk), zo(jr), yd(Av), (typeof Map != "function" || // $FlowIssue Flow incorrectly thinks Map has no prototype
    Map.prototype == null || typeof Map.prototype.forEach != "function" || typeof Set != "function" || // $FlowIssue Flow incorrectly thinks Set has no prototype
    Set.prototype == null || typeof Set.prototype.clear != "function" || typeof Set.prototype.forEach != "function") && g("React depends on Map and Set built-in types. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills"), zs(l1), ly(BS, qD, Fl);
    function ib(e, t) {
      var a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null;
      if (!zm(t))
        throw new Error("Target container is not a DOM element.");
      return Hk(e, t, null, a);
    }
    function lb(e, t, a, i) {
      return rb(e, t, a, i);
    }
    var f0 = {
      usingClientEntryPoint: !1,
      // Keep in sync with ReactTestUtils.js.
      // This is an array for better minification.
      Events: [wu, Ac, Th, iu, Us, BS]
    };
    function ub(e, t) {
      return f0.usingClientEntryPoint || g('You are importing createRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), Wk(e, t);
    }
    function ob(e, t, a) {
      return f0.usingClientEntryPoint || g('You are importing hydrateRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), qk(e, t, a);
    }
    function sb(e) {
      return rT() && g("flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task."), Fl(e);
    }
    var cb = Gk({
      findFiberByHostInstance: Wo,
      bundleType: 1,
      version: a0,
      rendererPackageName: "react-dom"
    });
    if (!cb && Sn && window.top === window.self && (navigator.userAgent.indexOf("Chrome") > -1 && navigator.userAgent.indexOf("Edge") === -1 || navigator.userAgent.indexOf("Firefox") > -1)) {
      var KT = window.location.protocol;
      /^(https?|file):$/.test(KT) && console.info("%cDownload the React DevTools for a better development experience: https://reactjs.org/link/react-devtools" + (KT === "file:" ? `
You might need to use a local HTTP server (instead of file://): https://reactjs.org/link/react-devtools-faq` : ""), "font-weight:bold");
    }
    Gr.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = f0, Gr.createPortal = ib, Gr.createRoot = ub, Gr.findDOMNode = eb, Gr.flushSync = sb, Gr.hydrate = tb, Gr.hydrateRoot = ob, Gr.render = nb, Gr.unmountComponentAtNode = ab, Gr.unstable_batchedUpdates = BS, Gr.unstable_renderSubtreeIntoContainer = lb, Gr.version = a0, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
  }()), Gr;
}
function wR() {
  if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) {
    if (process.env.NODE_ENV !== "production")
      throw new Error("^_^");
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(wR);
    } catch (U) {
      console.error(U);
    }
  }
}
process.env.NODE_ENV === "production" ? (wR(), y0.exports = Rb()) : y0.exports = xb();
var wb = y0.exports;
const DR = /* @__PURE__ */ Eb(wb);
var fR, dR, pR, vR, Bl;
vR = [CR("meraki-camera-card")];
let Yl = class Yl extends (pR = SR, dR = [Hm({ attribute: !1 })], fR = [Hm({ attribute: !1 })], pR) {
  constructor() {
    super(...arguments);
    of(this, "hass", li(Bl, 8, this)), li(Bl, 11, this);
    of(this, "config", li(Bl, 12, this)), li(Bl, 15, this);
  }
  static getConfigElement() {
    return document.createElement("meraki-camera-card-editor");
  }
  static getStubConfig() {
    return { entity_id: "camera.meraki_camera" };
  }
  setConfig(x) {
    if (!x.entity_id)
      throw new Error("You need to define an entity_id");
    this.config = x;
  }
  render() {
    return ER`<div id="root"></div>`;
  }
  updated(x) {
    (x.has("hass") || x.has("config")) && this.renderReact();
  }
  renderReact() {
    DR.render(
      RR.createElement(Yl, { hass: this.hass, config: this.config }),
      this.shadowRoot.getElementById("root")
    );
  }
};
Bl = p0(pR), cs(Bl, 5, "hass", dR, Yl), cs(Bl, 5, "config", fR, Yl), Yl = cs(Bl, 0, "MerakiCameraCard", vR, Yl), of(Yl, "styles", Sb`
    :host {
      display: block;
    }
  `), li(Bl, 1, Yl);
let sR = Yl;
var hR, mR, yR, gR, Pl;
gR = [CR("meraki-camera-card-editor")];
let Bu = class Bu extends (yR = SR, mR = [Hm({ attribute: !1 })], hR = [Hm({ attribute: !1 })], yR) {
  constructor() {
    super(...arguments);
    of(this, "hass", li(Pl, 8, this)), li(Pl, 11, this);
    of(this, "config", li(Pl, 12, this)), li(Pl, 15, this);
  }
  setConfig(x) {
    this.config = x;
  }
  configChanged(x) {
    const Je = new Event("config-changed", {
      bubbles: !0,
      composed: !0
    });
    Je.detail = { config: x }, this.dispatchEvent(Je);
  }
  render() {
    return ER`<div id="root"></div>`;
  }
  updated(x) {
    (x.has("hass") || x.has("config")) && this.renderReact();
  }
  renderReact() {
    DR.render(
      RR.createElement(Bu, {
        hass: this.hass,
        config: this.config,
        setConfig: this.configChanged.bind(this)
      }),
      this.shadowRoot.getElementById("root")
    );
  }
};
Pl = p0(yR), cs(Pl, 5, "hass", mR, Bu), cs(Pl, 5, "config", hR, Bu), Bu = cs(Pl, 0, "MerakiCameraCardEditor", gR, Bu), li(Pl, 1, Bu);
let cR = Bu;
export {
  sR as MerakiCameraCard,
  cR as MerakiCameraCardEditor
};

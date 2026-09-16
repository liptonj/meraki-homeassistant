var Or = Object.defineProperty;
var Pr = (r, a, i) => a in r ? Or(r, a, { enumerable: !0, configurable: !0, writable: !0, value: i }) : r[a] = i;
var ze = (r, a, i) => Pr(r, typeof a != "symbol" ? a + "" : a, i);
import de, { memo as ee, useState as ue, useRef as Te, useEffect as Le, useCallback as xe, useMemo as Ie } from "react";
import Fr from "react-dom";
var xr = { exports: {} }, Ye = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var br;
function Ur() {
  if (br) return Ye;
  br = 1;
  var r = de, a = Symbol.for("react.element"), i = Symbol.for("react.fragment"), s = Object.prototype.hasOwnProperty, l = r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, n = { key: !0, ref: !0, __self: !0, __source: !0 };
  function x(g, m, M) {
    var o, h = {}, y = null, f = null;
    M !== void 0 && (y = "" + M), m.key !== void 0 && (y = "" + m.key), m.ref !== void 0 && (f = m.ref);
    for (o in m) s.call(m, o) && !n.hasOwnProperty(o) && (h[o] = m[o]);
    if (g && g.defaultProps) for (o in m = g.defaultProps, m) h[o] === void 0 && (h[o] = m[o]);
    return { $$typeof: a, type: g, key: y, ref: f, props: h, _owner: l.current };
  }
  return Ye.Fragment = i, Ye.jsx = x, Ye.jsxs = x, Ye;
}
var Ge = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var yr;
function Br() {
  return yr || (yr = 1, process.env.NODE_ENV !== "production" && function() {
    var r = de, a = Symbol.for("react.element"), i = Symbol.for("react.portal"), s = Symbol.for("react.fragment"), l = Symbol.for("react.strict_mode"), n = Symbol.for("react.profiler"), x = Symbol.for("react.provider"), g = Symbol.for("react.context"), m = Symbol.for("react.forward_ref"), M = Symbol.for("react.suspense"), o = Symbol.for("react.suspense_list"), h = Symbol.for("react.memo"), y = Symbol.for("react.lazy"), f = Symbol.for("react.offscreen"), C = Symbol.iterator, L = "@@iterator";
    function P(t) {
      if (t === null || typeof t != "object")
        return null;
      var u = C && t[C] || t[L];
      return typeof u == "function" ? u : null;
    }
    var z = r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function W(t) {
      {
        for (var u = arguments.length, v = new Array(u > 1 ? u - 1 : 0), D = 1; D < u; D++)
          v[D - 1] = arguments[D];
        K("error", t, v);
      }
    }
    function K(t, u, v) {
      {
        var D = z.ReactDebugCurrentFrame, V = D.getStackAddendum();
        V !== "" && (u += "%s", v = v.concat([V]));
        var G = v.map(function(F) {
          return String(F);
        });
        G.unshift("Warning: " + u), Function.prototype.apply.call(console[t], console, G);
      }
    }
    var J = !1, U = !1, ie = !1, re = !1, pe = !1, ye;
    ye = Symbol.for("react.module.reference");
    function ge(t) {
      return !!(typeof t == "string" || typeof t == "function" || t === s || t === n || pe || t === l || t === M || t === o || re || t === f || J || U || ie || typeof t == "object" && t !== null && (t.$$typeof === y || t.$$typeof === h || t.$$typeof === x || t.$$typeof === g || t.$$typeof === m || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      t.$$typeof === ye || t.getModuleId !== void 0));
    }
    function N(t, u, v) {
      var D = t.displayName;
      if (D)
        return D;
      var V = u.displayName || u.name || "";
      return V !== "" ? v + "(" + V + ")" : v;
    }
    function R(t) {
      return t.displayName || "Context";
    }
    function q(t) {
      if (t == null)
        return null;
      if (typeof t.tag == "number" && W("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof t == "function")
        return t.displayName || t.name || null;
      if (typeof t == "string")
        return t;
      switch (t) {
        case s:
          return "Fragment";
        case i:
          return "Portal";
        case n:
          return "Profiler";
        case l:
          return "StrictMode";
        case M:
          return "Suspense";
        case o:
          return "SuspenseList";
      }
      if (typeof t == "object")
        switch (t.$$typeof) {
          case g:
            var u = t;
            return R(u) + ".Consumer";
          case x:
            var v = t;
            return R(v._context) + ".Provider";
          case m:
            return N(t, t.render, "ForwardRef");
          case h:
            var D = t.displayName || null;
            return D !== null ? D : q(t.type) || "Memo";
          case y: {
            var V = t, G = V._payload, F = V._init;
            try {
              return q(F(G));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var H = Object.assign, ce = 0, k, T, j, Q, w, $, B;
    function A() {
    }
    A.__reactDisabledLog = !0;
    function Y() {
      {
        if (ce === 0) {
          k = console.log, T = console.info, j = console.warn, Q = console.error, w = console.group, $ = console.groupCollapsed, B = console.groupEnd;
          var t = {
            configurable: !0,
            enumerable: !0,
            value: A,
            writable: !0
          };
          Object.defineProperties(console, {
            info: t,
            log: t,
            warn: t,
            error: t,
            group: t,
            groupCollapsed: t,
            groupEnd: t
          });
        }
        ce++;
      }
    }
    function ne() {
      {
        if (ce--, ce === 0) {
          var t = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: H({}, t, {
              value: k
            }),
            info: H({}, t, {
              value: T
            }),
            warn: H({}, t, {
              value: j
            }),
            error: H({}, t, {
              value: Q
            }),
            group: H({}, t, {
              value: w
            }),
            groupCollapsed: H({}, t, {
              value: $
            }),
            groupEnd: H({}, t, {
              value: B
            })
          });
        }
        ce < 0 && W("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var te = z.ReactCurrentDispatcher, he;
    function le(t, u, v) {
      {
        if (he === void 0)
          try {
            throw Error();
          } catch (V) {
            var D = V.stack.trim().match(/\n( *(at )?)/);
            he = D && D[1] || "";
          }
        return `
` + he + t;
      }
    }
    var d = !1, b;
    {
      var S = typeof WeakMap == "function" ? WeakMap : Map;
      b = new S();
    }
    function I(t, u) {
      if (!t || d)
        return "";
      {
        var v = b.get(t);
        if (v !== void 0)
          return v;
      }
      var D;
      d = !0;
      var V = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var G;
      G = te.current, te.current = null, Y();
      try {
        if (u) {
          var F = function() {
            throw Error();
          };
          if (Object.defineProperty(F.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(F, []);
            } catch (be) {
              D = be;
            }
            Reflect.construct(t, [], F);
          } else {
            try {
              F.call();
            } catch (be) {
              D = be;
            }
            t.call(F.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (be) {
            D = be;
          }
          t();
        }
      } catch (be) {
        if (be && D && typeof be.stack == "string") {
          for (var O = be.stack.split(`
`), ve = D.stack.split(`
`), se = O.length - 1, oe = ve.length - 1; se >= 1 && oe >= 0 && O[se] !== ve[oe]; )
            oe--;
          for (; se >= 1 && oe >= 0; se--, oe--)
            if (O[se] !== ve[oe]) {
              if (se !== 1 || oe !== 1)
                do
                  if (se--, oe--, oe < 0 || O[se] !== ve[oe]) {
                    var we = `
` + O[se].replace(" at new ", " at ");
                    return t.displayName && we.includes("<anonymous>") && (we = we.replace("<anonymous>", t.displayName)), typeof t == "function" && b.set(t, we), we;
                  }
                while (se >= 1 && oe >= 0);
              break;
            }
        }
      } finally {
        d = !1, te.current = G, ne(), Error.prepareStackTrace = V;
      }
      var Pe = t ? t.displayName || t.name : "", Ee = Pe ? le(Pe) : "";
      return typeof t == "function" && b.set(t, Ee), Ee;
    }
    function X(t, u, v) {
      return I(t, !1);
    }
    function me(t) {
      var u = t.prototype;
      return !!(u && u.isReactComponent);
    }
    function Z(t, u, v) {
      if (t == null)
        return "";
      if (typeof t == "function")
        return I(t, me(t));
      if (typeof t == "string")
        return le(t);
      switch (t) {
        case M:
          return le("Suspense");
        case o:
          return le("SuspenseList");
      }
      if (typeof t == "object")
        switch (t.$$typeof) {
          case m:
            return X(t.render);
          case h:
            return Z(t.type, u, v);
          case y: {
            var D = t, V = D._payload, G = D._init;
            try {
              return Z(G(V), u, v);
            } catch {
            }
          }
        }
      return "";
    }
    var E = Object.prototype.hasOwnProperty, _ = {}, fe = z.ReactDebugCurrentFrame;
    function _e(t) {
      if (t) {
        var u = t._owner, v = Z(t.type, t._source, u ? u.type : null);
        fe.setExtraStackFrame(v);
      } else
        fe.setExtraStackFrame(null);
    }
    function $e(t, u, v, D, V) {
      {
        var G = Function.call.bind(E);
        for (var F in t)
          if (G(t, F)) {
            var O = void 0;
            try {
              if (typeof t[F] != "function") {
                var ve = Error((D || "React class") + ": " + v + " type `" + F + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof t[F] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw ve.name = "Invariant Violation", ve;
              }
              O = t[F](u, F, D, v, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (se) {
              O = se;
            }
            O && !(O instanceof Error) && (_e(V), W("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", D || "React class", v, F, typeof O), _e(null)), O instanceof Error && !(O.message in _) && (_[O.message] = !0, _e(V), W("Failed %s type: %s", v, O.message), _e(null));
          }
      }
    }
    var We = Array.isArray;
    function Ce(t) {
      return We(t);
    }
    function Je(t) {
      {
        var u = typeof Symbol == "function" && Symbol.toStringTag, v = u && t[Symbol.toStringTag] || t.constructor.name || "Object";
        return v;
      }
    }
    function qe(t) {
      try {
        return Fe(t), !1;
      } catch {
        return !0;
      }
    }
    function Fe(t) {
      return "" + t;
    }
    function Xe(t) {
      if (qe(t))
        return W("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Je(t)), Fe(t);
    }
    var Ze = z.ReactCurrentOwner, Ue = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, Ae, Oe;
    function or(t) {
      if (E.call(t, "ref")) {
        var u = Object.getOwnPropertyDescriptor(t, "ref").get;
        if (u && u.isReactWarning)
          return !1;
      }
      return t.ref !== void 0;
    }
    function er(t) {
      if (E.call(t, "key")) {
        var u = Object.getOwnPropertyDescriptor(t, "key").get;
        if (u && u.isReactWarning)
          return !1;
      }
      return t.key !== void 0;
    }
    function rr(t, u) {
      typeof t.ref == "string" && Ze.current;
    }
    function lr(t, u) {
      {
        var v = function() {
          Ae || (Ae = !0, W("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", u));
        };
        v.isReactWarning = !0, Object.defineProperty(t, "key", {
          get: v,
          configurable: !0
        });
      }
    }
    function cr(t, u) {
      {
        var v = function() {
          Oe || (Oe = !0, W("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", u));
        };
        v.isReactWarning = !0, Object.defineProperty(t, "ref", {
          get: v,
          configurable: !0
        });
      }
    }
    var dr = function(t, u, v, D, V, G, F) {
      var O = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: a,
        // Built-in properties that belong on the element
        type: t,
        key: u,
        ref: v,
        props: F,
        // Record the component responsible for creating this element.
        _owner: G
      };
      return O._store = {}, Object.defineProperty(O._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(O, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: D
      }), Object.defineProperty(O, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: V
      }), Object.freeze && (Object.freeze(O.props), Object.freeze(O)), O;
    };
    function ur(t, u, v, D, V) {
      {
        var G, F = {}, O = null, ve = null;
        v !== void 0 && (Xe(v), O = "" + v), er(u) && (Xe(u.key), O = "" + u.key), or(u) && (ve = u.ref, rr(u, V));
        for (G in u)
          E.call(u, G) && !Ue.hasOwnProperty(G) && (F[G] = u[G]);
        if (t && t.defaultProps) {
          var se = t.defaultProps;
          for (G in se)
            F[G] === void 0 && (F[G] = se[G]);
        }
        if (O || ve) {
          var oe = typeof t == "function" ? t.displayName || t.name || "Unknown" : t;
          O && lr(F, oe), ve && cr(F, oe);
        }
        return dr(t, O, ve, V, D, Ze.current, F);
      }
    }
    var Be = z.ReactCurrentOwner, tr = z.ReactDebugCurrentFrame;
    function Se(t) {
      if (t) {
        var u = t._owner, v = Z(t.type, t._source, u ? u.type : null);
        tr.setExtraStackFrame(v);
      } else
        tr.setExtraStackFrame(null);
    }
    var Re;
    Re = !1;
    function Ve(t) {
      return typeof t == "object" && t !== null && t.$$typeof === a;
    }
    function He() {
      {
        if (Be.current) {
          var t = q(Be.current.type);
          if (t)
            return `

Check the render method of \`` + t + "`.";
        }
        return "";
      }
    }
    function c(t) {
      return "";
    }
    var p = {};
    function ae(t) {
      {
        var u = He();
        if (!u) {
          var v = typeof t == "string" ? t : t.displayName || t.name;
          v && (u = `

Check the top-level render call using <` + v + ">.");
        }
        return u;
      }
    }
    function je(t, u) {
      {
        if (!t._store || t._store.validated || t.key != null)
          return;
        t._store.validated = !0;
        var v = ae(u);
        if (p[v])
          return;
        p[v] = !0;
        var D = "";
        t && t._owner && t._owner !== Be.current && (D = " It was passed a child from " + q(t._owner.type) + "."), Se(t), W('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', v, D), Se(null);
      }
    }
    function gr(t, u) {
      {
        if (typeof t != "object")
          return;
        if (Ce(t))
          for (var v = 0; v < t.length; v++) {
            var D = t[v];
            Ve(D) && je(D, u);
          }
        else if (Ve(t))
          t._store && (t._store.validated = !0);
        else if (t) {
          var V = P(t);
          if (typeof V == "function" && V !== t.entries)
            for (var G = V.call(t), F; !(F = G.next()).done; )
              Ve(F.value) && je(F.value, u);
        }
      }
    }
    function Tr(t) {
      {
        var u = t.type;
        if (u == null || typeof u == "string")
          return;
        var v;
        if (typeof u == "function")
          v = u.propTypes;
        else if (typeof u == "object" && (u.$$typeof === m || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        u.$$typeof === h))
          v = u.propTypes;
        else
          return;
        if (v) {
          var D = q(u);
          $e(v, t.props, "prop", D, t);
        } else if (u.PropTypes !== void 0 && !Re) {
          Re = !0;
          var V = q(u);
          W("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", V || "Unknown");
        }
        typeof u.getDefaultProps == "function" && !u.getDefaultProps.isReactClassApproved && W("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function Er(t) {
      {
        for (var u = Object.keys(t.props), v = 0; v < u.length; v++) {
          var D = u[v];
          if (D !== "children" && D !== "key") {
            Se(t), W("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", D), Se(null);
            break;
          }
        }
        t.ref !== null && (Se(t), W("Invalid attribute `ref` supplied to `React.Fragment`."), Se(null));
      }
    }
    var fr = {};
    function vr(t, u, v, D, V, G) {
      {
        var F = ge(t);
        if (!F) {
          var O = "";
          (t === void 0 || typeof t == "object" && t !== null && Object.keys(t).length === 0) && (O += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var ve = c();
          ve ? O += ve : O += He();
          var se;
          t === null ? se = "null" : Ce(t) ? se = "array" : t !== void 0 && t.$$typeof === a ? (se = "<" + (q(t.type) || "Unknown") + " />", O = " Did you accidentally export a JSX literal instead of a component?") : se = typeof t, W("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", se, O);
        }
        var oe = ur(t, u, v, V, G);
        if (oe == null)
          return oe;
        if (F) {
          var we = u.children;
          if (we !== void 0)
            if (D)
              if (Ce(we)) {
                for (var Pe = 0; Pe < we.length; Pe++)
                  gr(we[Pe], t);
                Object.freeze && Object.freeze(we);
              } else
                W("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              gr(we, t);
        }
        if (E.call(u, "key")) {
          var Ee = q(t), be = Object.keys(u).filter(function(Ar) {
            return Ar !== "key";
          }), pr = be.length > 0 ? "{key: someKey, " + be.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!fr[Ee + pr]) {
            var Wr = be.length > 0 ? "{" + be.join(": ..., ") + ": ...}" : "{}";
            W(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, pr, Ee, Wr, Ee), fr[Ee + pr] = !0;
          }
        }
        return t === s ? Er(oe) : Tr(oe), oe;
      }
    }
    function Mr(t, u, v) {
      return vr(t, u, v, !0);
    }
    function Ir(t, u, v) {
      return vr(t, u, v, !1);
    }
    var Lr = Ir, $r = Mr;
    Ge.Fragment = s, Ge.jsx = Lr, Ge.jsxs = $r;
  }()), Ge;
}
process.env.NODE_ENV === "production" ? xr.exports = Ur() : xr.exports = Br();
var e = xr.exports, Qe = {}, Ke = Fr;
if (process.env.NODE_ENV === "production")
  Qe.createRoot = Ke.createRoot, Qe.hydrateRoot = Ke.hydrateRoot;
else {
  var ar = Ke.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  Qe.createRoot = function(r, a) {
    ar.usingClientEntryPoint = !0;
    try {
      return Ke.createRoot(r, a);
    } finally {
      ar.usingClientEntryPoint = !1;
    }
  }, Qe.hydrateRoot = function(r, a, i) {
    ar.usingClientEntryPoint = !0;
    try {
      return Ke.hydrateRoot(r, a, i);
    } finally {
      ar.usingClientEntryPoint = !1;
    }
  };
}
const Vr = ({
  title: r,
  value: a,
  icon: i,
  variant: s = "default",
  onClick: l,
  clickable: n = !1
}) => {
  const x = s === "default" ? "" : s, g = l || n;
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: `stat-card ${g ? "clickable" : ""}`,
      onClick: l,
      children: [
        /* @__PURE__ */ e.jsx("div", { className: "label", children: r }),
        /* @__PURE__ */ e.jsxs("div", { className: `value ${x}`, children: [
          i && /* @__PURE__ */ e.jsx("span", { className: "stat-icon", children: i }),
          a
        ] })
      ]
    }
  );
}, sr = ee(Vr), hr = ee(({ status: r }) => {
  const a = (i) => {
    switch (i) {
      case "connected":
        return { backgroundColor: "#22c55e", color: "#fff" };
      case "connecting":
        return { backgroundColor: "#f59e0b", color: "#fff" };
      case "disconnected":
        return { backgroundColor: "#6b7280", color: "#fff" };
      case "error":
        return { backgroundColor: "#ef4444", color: "#fff" };
      default:
        return { backgroundColor: "#6b7280", color: "#fff" };
    }
  };
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      style: {
        ...a(r),
        padding: "2px 8px",
        borderRadius: "12px",
        fontSize: "11px",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.5px"
      },
      children: r
    }
  );
});
hr.displayName = "StatusBadge";
const nr = (r) => {
  if (!r) return "Never";
  const a = new Date(r), s = (/* @__PURE__ */ new Date()).getTime() - a.getTime();
  return s < 6e4 ? "Just now" : s < 36e5 ? `${Math.floor(s / 6e4)}m ago` : s < 864e5 ? `${Math.floor(s / 36e5)}h ago` : a.toLocaleDateString();
}, De = ee(
  ({ label: r, value: a }) => /* @__PURE__ */ e.jsxs(
    "div",
    {
      style: {
        display: "flex",
        justifyContent: "space-between",
        padding: "4px 0"
      },
      children: [
        /* @__PURE__ */ e.jsx("span", { style: { color: "var(--secondary-text-color, #888)" }, children: r }),
        /* @__PURE__ */ e.jsx("span", { style: { fontWeight: 500 }, children: a })
      ]
    }
  )
);
De.displayName = "StatItem";
const Cr = ee(
  ({ name: r, dest: a }) => {
    const i = {
      backgroundColor: "var(--primary-background-color, #f5f5f5)",
      borderRadius: "8px",
      padding: "12px",
      marginBottom: "8px"
    };
    return /* @__PURE__ */ e.jsxs("div", { style: i, children: [
      /* @__PURE__ */ e.jsxs(
        "div",
        {
          style: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px"
          },
          children: [
            /* @__PURE__ */ e.jsx("span", { style: { fontWeight: 600 }, children: r }),
            /* @__PURE__ */ e.jsx(hr, { status: a.status })
          ]
        }
      ),
      /* @__PURE__ */ e.jsxs(
        "div",
        {
          style: {
            fontSize: "12px",
            color: "var(--secondary-text-color, #888)"
          },
          children: [
            /* @__PURE__ */ e.jsxs("div", { children: [
              a.host,
              ":",
              a.port
            ] }),
            /* @__PURE__ */ e.jsx("div", { style: { fontFamily: "monospace", marginTop: "4px" }, children: a.topic_filter })
          ]
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { style: { marginTop: "8px", fontSize: "12px" }, children: [
        /* @__PURE__ */ e.jsx(
          De,
          {
            label: "Messages Relayed",
            value: a.messages_relayed.toLocaleString()
          }
        ),
        /* @__PURE__ */ e.jsx(
          De,
          {
            label: "Last Relay",
            value: nr(a.last_relay_time)
          }
        ),
        a.last_error && /* @__PURE__ */ e.jsxs(
          "div",
          {
            style: {
              marginTop: "4px",
              padding: "6px",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              borderRadius: "4px"
            },
            children: [
              /* @__PURE__ */ e.jsx("div", { style: { color: "#ef4444", fontWeight: 500 }, children: "Last Error" }),
              /* @__PURE__ */ e.jsx("div", { style: { fontSize: "11px", marginTop: "2px" }, children: a.last_error }),
              /* @__PURE__ */ e.jsx(
                "div",
                {
                  style: {
                    fontSize: "10px",
                    color: "var(--secondary-text-color)"
                  },
                  children: nr(a.last_error_time)
                }
              )
            ]
          }
        )
      ] })
    ] });
  },
  (r, a) => {
    const i = r.dest, s = a.dest;
    return !(r.name !== a.name || i.status !== s.status || i.messages_relayed !== s.messages_relayed || i.last_relay_time !== s.last_relay_time || i.last_error !== s.last_error);
  }
);
Cr.displayName = "RelayDestinationCard";
const Hr = ({
  mqttStats: r,
  relayDestinations: a
}) => {
  if (!r && Object.keys(a).length === 0)
    return null;
  const i = {
    backgroundColor: "var(--ha-card-background, var(--card-background-color, #fff))",
    borderRadius: "12px",
    padding: "16px",
    marginBottom: "16px",
    boxShadow: "var(--ha-card-box-shadow, 0 2px 4px rgba(0,0,0,0.1))"
  }, s = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
    paddingBottom: "12px",
    borderBottom: "1px solid var(--divider-color, #e0e0e0)"
  }, l = {
    marginBottom: "16px"
  };
  return /* @__PURE__ */ e.jsxs("div", { style: i, children: [
    /* @__PURE__ */ e.jsxs("div", { style: s, children: [
      /* @__PURE__ */ e.jsx(
        "svg",
        {
          viewBox: "0 0 24 24",
          width: "24",
          height: "24",
          fill: r != null && r.is_running ? "#22c55e" : "#ef4444",
          children: /* @__PURE__ */ e.jsx("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" })
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { style: { flex: 1 }, children: [
        /* @__PURE__ */ e.jsx("h3", { style: { margin: 0, fontSize: "16px", fontWeight: 600 }, children: "MQTT Status" }),
        /* @__PURE__ */ e.jsx(
          "span",
          {
            style: {
              fontSize: "12px",
              color: "var(--secondary-text-color, #888)"
            },
            children: "Real-time sensor data"
          }
        )
      ] }),
      /* @__PURE__ */ e.jsx(
        hr,
        {
          status: r != null && r.is_running ? "connected" : "disconnected"
        }
      )
    ] }),
    r && /* @__PURE__ */ e.jsxs("div", { style: l, children: [
      /* @__PURE__ */ e.jsx(
        "h4",
        {
          style: {
            margin: "0 0 8px 0",
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--primary-text-color)"
          },
          children: "Service Statistics"
        }
      ),
      /* @__PURE__ */ e.jsx(
        De,
        {
          label: "Messages Received",
          value: r.messages_received.toLocaleString()
        }
      ),
      /* @__PURE__ */ e.jsx(
        De,
        {
          label: "Messages Processed",
          value: r.messages_processed.toLocaleString()
        }
      ),
      /* @__PURE__ */ e.jsx(De, { label: "Sensors Mapped", value: r.sensors_mapped }),
      /* @__PURE__ */ e.jsx(
        De,
        {
          label: "Last Message",
          value: nr(r.last_message_time)
        }
      ),
      /* @__PURE__ */ e.jsx(
        De,
        {
          label: "Uptime Since",
          value: nr(r.start_time)
        }
      )
    ] }),
    Object.keys(a).length > 0 && /* @__PURE__ */ e.jsxs("div", { style: l, children: [
      /* @__PURE__ */ e.jsxs(
        "h4",
        {
          style: {
            margin: "0 0 12px 0",
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--primary-text-color)"
          },
          children: [
            "Relay Destinations (",
            Object.keys(a).length,
            ")"
          ]
        }
      ),
      Object.entries(a).map(([n, x]) => /* @__PURE__ */ e.jsx(Cr, { name: n, dest: x }, n))
    ] })
  ] });
}, Yr = ee(
  Hr,
  (r, a) => {
    const i = r.mqttStats, s = a.mqttStats;
    if ((i == null ? void 0 : i.is_running) !== (s == null ? void 0 : s.is_running) || (i == null ? void 0 : i.messages_received) !== (s == null ? void 0 : s.messages_received) || (i == null ? void 0 : i.messages_processed) !== (s == null ? void 0 : s.messages_processed) || (i == null ? void 0 : i.last_message_time) !== (s == null ? void 0 : s.last_message_time))
      return !1;
    const l = Object.keys(r.relayDestinations), n = Object.keys(a.relayDestinations);
    if (l.length !== n.length) return !1;
    for (const x of n) {
      const g = r.relayDestinations[x], m = a.relayDestinations[x];
      if (!g || g.status !== m.status || g.messages_relayed !== m.messages_relayed || g.last_relay_time !== m.last_relay_time || g.last_error !== m.last_error) return !1;
    }
    return !0;
  }
), jr = [
  { value: "all", label: "All Types", icon: "📱" },
  { value: "switch", label: "Switches", icon: "🔀" },
  { value: "camera", label: "Cameras", icon: "📹" },
  { value: "wireless", label: "Wireless", icon: "📶" },
  { value: "sensor", label: "Sensors", icon: "📡" },
  { value: "appliance", label: "Firewalls", icon: "🛡️" }
], Gr = [
  { value: "all", label: "All Status" },
  { value: "online", label: "Online" },
  { value: "offline", label: "Offline" },
  { value: "alerting", label: "Alerting" },
  { value: "dormant", label: "Dormant" }
], Sr = ee(
  ({
    device: r,
    onClick: a,
    getDeviceIcon: i,
    getDeviceTypeClass: s,
    getDeviceDetail: l
  }) => {
    var n;
    return /* @__PURE__ */ e.jsxs("tr", { className: "device-row", onClick: a, children: [
      /* @__PURE__ */ e.jsx("td", { children: /* @__PURE__ */ e.jsxs("div", { className: "device-name-cell", children: [
        /* @__PURE__ */ e.jsx("div", { className: `device-icon ${s(r)}`, children: i(r) }),
        /* @__PURE__ */ e.jsx("span", { className: "name", children: r.name || r.serial })
      ] }) }),
      /* @__PURE__ */ e.jsx("td", { className: "device-model", children: r.model || "—" }),
      /* @__PURE__ */ e.jsx("td", { className: "device-model cell-mono", children: r.serial }),
      /* @__PURE__ */ e.jsx("td", { children: /* @__PURE__ */ e.jsxs("div", { className: `status-badge ${(n = r.status) == null ? void 0 : n.toLowerCase()}`, children: [
        /* @__PURE__ */ e.jsx("div", { className: "status-dot" }),
        /* @__PURE__ */ e.jsx("span", { children: r.status || "Unknown" })
      ] }) }),
      /* @__PURE__ */ e.jsx("td", { className: "device-model", children: r.lanIp || "—" }),
      /* @__PURE__ */ e.jsx("td", { children: /* @__PURE__ */ e.jsx("span", { className: "detail-badge", children: l(r) || "—" }) })
    ] });
  },
  (r, a) => {
    var x, g, m, M, o, h;
    const i = r.device, s = a.device;
    if (i.serial !== s.serial || i.status !== s.status || i.name !== s.name || i.lanIp !== s.lanIp || i.model !== s.model || ((x = i.readings) == null ? void 0 : x.temperature) !== ((g = s.readings) == null ? void 0 : g.temperature) || ((m = i.readings) == null ? void 0 : m.humidity) !== ((M = s.readings) == null ? void 0 : M.humidity)) return !1;
    const l = (o = i.ports_statuses) == null ? void 0 : o.filter(
      (y) => y.status === "Connected"
    ).length, n = (h = s.ports_statuses) == null ? void 0 : h.filter(
      (y) => y.status === "Connected"
    ).length;
    return l === n;
  }
);
Sr.displayName = "DeviceRow";
const Kr = ({
  setActiveView: r,
  data: a,
  hass: i,
  defaultViewMode: s = "network",
  defaultDeviceTypeFilter: l = ["all"],
  defaultStatusFilter: n = "all",
  temperatureUnit: x = "celsius"
}) => {
  const [g, m] = ue(
    /* @__PURE__ */ new Set()
  ), [M, o] = ue(
    /* @__PURE__ */ new Set(["switch", "camera", "wireless", "sensor", "appliance"])
  ), [h, y] = ue(
    (Array.isArray(l) ? l : [l]).map((d) => d)
  ), [f, C] = ue(
    n || "all"
  ), [L, P] = ue(
    s || "network"
  ), z = Te(!1);
  if (Le(() => {
    s && P(s);
  }, [s]), Le(() => {
    if (!z.current && (a != null && a.networks)) {
      const d = a.networks.map((b) => b.id);
      d.length > 0 && d.length <= 3 && (m(new Set(d)), z.current = !0);
    }
  }, [a == null ? void 0 : a.networks]), !a)
    return /* @__PURE__ */ e.jsxs("div", { className: "loading-container", children: [
      /* @__PURE__ */ e.jsx("div", { className: "loading-spinner" }),
      /* @__PURE__ */ e.jsx("div", { className: "loading-text", children: "Loading dashboard..." })
    ] });
  const {
    devices: W = [],
    networks: K = [],
    ssids: J = [],
    clients: U = [],
    scan_interval: ie = 90,
    last_updated: re,
    mqtt: pe
  } = a, [ye, ge] = ue(null), N = Te(null);
  Le(() => {
    if (!re || !ie) {
      console.log("[Meraki] Countdown disabled - missing data:", {
        last_updated: re,
        scan_interval: ie
      }), ge(null);
      return;
    }
    console.log("[Meraki] Countdown reset - new data received:", {
      last_updated: re,
      scan_interval: ie
    });
    const d = () => {
      const S = new Date(re).getTime() + ie * 1e3, I = Date.now(), X = Math.max(0, Math.floor((S - I) / 1e3));
      ge(X);
    };
    return d(), N.current = setInterval(d, 1e3), () => {
      N.current && clearInterval(N.current);
    };
  }, [re, ie]);
  const R = (d) => {
    const b = new Date(d), S = /* @__PURE__ */ new Date();
    return b.toDateString() === S.toDateString() ? b.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }) : b.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }, q = (d) => d <= 0 ? "refreshing..." : d < 60 ? `${d}s` : `${Math.floor(d / 60)}m ${d % 60}s`, H = (d) => {
    var I, X;
    const b = ((I = d.model) == null ? void 0 : I.toUpperCase()) || "", S = ((X = d.productType) == null ? void 0 : X.toLowerCase()) || "";
    return b.startsWith("MS") || S === "switch" ? "switch" : b.startsWith("MV") || S === "camera" ? "camera" : b.startsWith("MR") || S === "wireless" ? "wireless" : b.startsWith("MT") || S === "sensor" ? "sensor" : b.startsWith("MX") || b.startsWith("Z") || S === "appliance" ? "appliance" : "all";
  }, k = ((d) => d.filter((b) => {
    var S;
    return !(!h.includes("all") && !h.includes(H(b)) || f !== "all" && ((S = b.status) == null ? void 0 : S.toLowerCase()) !== f);
  }))(W), T = W.filter(
    (d) => {
      var b;
      return ((b = d.status) == null ? void 0 : b.toLowerCase()) === "online";
    }
  ).length, j = U.length || 0, Q = J.filter((d) => d.enabled).length, w = (d) => {
    m((b) => {
      const S = new Set(b);
      return S.has(d) ? S.delete(d) : S.add(d), S;
    });
  }, $ = (d) => {
    o((b) => {
      const S = new Set(b);
      return S.has(d) ? S.delete(d) : S.add(d), S;
    });
  }, B = xe((d) => {
    var X;
    const b = H(d), S = ((X = d.model) == null ? void 0 : X.toUpperCase()) || "";
    return b === "sensor" ? S.startsWith("MT10") || S.startsWith("MT11") || S.startsWith("MT15") ? "🌡️" : S.startsWith("MT12") ? "🚪" : S.startsWith("MT14") ? "💨" : S.startsWith("MT20") ? "🔘" : S.startsWith("MT30") ? "⚡" : "📡" : {
      switch: "🔀",
      // Network switch
      camera: "📹",
      // Camera
      wireless: "📶",
      // Wireless AP
      sensor: "📡",
      // Default sensor (fallback)
      appliance: "🛡️",
      // Security appliance/firewall
      all: "📱"
    }[b];
  }, []), A = xe((d) => H(d), []), Y = xe(
    (d) => {
      var S, I, X;
      const b = H(d);
      if (b === "switch")
        return `${((S = d.ports_statuses) == null ? void 0 : S.filter(
          (Z) => {
            var E;
            return ((E = Z.status) == null ? void 0 : E.toLowerCase()) === "connected";
          }
        ).length) || 0} ports active`;
      if (b === "camera")
        return ((I = d.status) == null ? void 0 : I.toLowerCase()) === "online" ? "Recording" : "Offline";
      if (b === "wireless")
        return `${U.filter(
          (Z) => Z.recentDeviceSerial === d.serial
        ).length} clients`;
      if (b === "sensor") {
        if (((X = d.readings) == null ? void 0 : X.temperature) != null) {
          const me = d.readings.temperature, Z = x === "fahrenheit" ? (me * 9 / 5 + 32).toFixed(1) : me.toFixed(1), E = x === "fahrenheit" ? "°F" : "°C", _ = d.readings.humidity ?? "--";
          return `${Z}${E} / ${_}%`;
        }
        return "Active";
      }
      return "";
    },
    [U, x]
  ), ne = xe(
    (d) => {
      r({ view: "device", deviceId: d });
    },
    [r]
  ), te = (d) => k.filter((b) => b.networkId === d), he = (d) => k.filter((b) => H(b) === d), le = (d) => /* @__PURE__ */ e.jsxs("table", { className: "device-table", children: [
    /* @__PURE__ */ e.jsx("thead", { children: /* @__PURE__ */ e.jsxs("tr", { children: [
      /* @__PURE__ */ e.jsx("th", { children: "Device" }),
      /* @__PURE__ */ e.jsx("th", { children: "Model" }),
      /* @__PURE__ */ e.jsx("th", { children: "Serial" }),
      /* @__PURE__ */ e.jsx("th", { children: "Status" }),
      /* @__PURE__ */ e.jsx("th", { children: "IP Address" }),
      /* @__PURE__ */ e.jsx("th", { children: "Details" })
    ] }) }),
    /* @__PURE__ */ e.jsxs("tbody", { children: [
      d.map((b) => /* @__PURE__ */ e.jsx(
        Sr,
        {
          device: b,
          onClick: () => ne(b.serial),
          getDeviceIcon: B,
          getDeviceTypeClass: A,
          getDeviceDetail: Y
        },
        b.serial
      )),
      d.length === 0 && /* @__PURE__ */ e.jsx("tr", { children: /* @__PURE__ */ e.jsx("td", { colSpan: 6, className: "empty-table-message", children: "No devices match your filters" }) })
    ] })
  ] });
  return /* @__PURE__ */ e.jsxs("div", { children: [
    re && /* @__PURE__ */ e.jsxs("div", { className: "refresh-indicator", children: [
      /* @__PURE__ */ e.jsxs("span", { className: "refresh-indicator-item", children: [
        /* @__PURE__ */ e.jsx("span", { className: "refresh-indicator-icon", children: "🔄" }),
        "Last: ",
        R(re)
      ] }),
      ye !== null && /* @__PURE__ */ e.jsxs("span", { className: "refresh-indicator-item", children: [
        /* @__PURE__ */ e.jsx("span", { className: "refresh-indicator-icon", children: "⏱️" }),
        "Next: ",
        q(ye)
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "stats-grid", children: [
      /* @__PURE__ */ e.jsx(sr, { title: "Total Devices", value: W.length }),
      /* @__PURE__ */ e.jsx(sr, { title: "Online", value: T, variant: "success" }),
      /* @__PURE__ */ e.jsx(
        sr,
        {
          title: "Connected Clients",
          value: j,
          onClick: () => r({ view: "clients" }),
          clickable: !0
        }
      ),
      /* @__PURE__ */ e.jsx(
        sr,
        {
          title: "Active SSIDs",
          value: Q,
          onClick: () => r({ view: "ssids" }),
          clickable: !0
        }
      )
    ] }),
    (pe == null ? void 0 : pe.enabled) && /* @__PURE__ */ e.jsx(
      Yr,
      {
        mqttStats: pe.stats || null,
        relayDestinations: pe.relay_destinations || {}
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "filter-controls", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "view-mode-toggle", children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            onClick: () => P("network"),
            className: `view-mode-btn ${L === "network" ? "active" : ""}`,
            children: "🌐 By Network"
          }
        ),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            onClick: () => P("type"),
            className: `view-mode-btn ${L === "type" ? "active" : ""}`,
            children: "📦 By Type"
          }
        )
      ] }),
      /* @__PURE__ */ e.jsx(
        "select",
        {
          value: h.length > 1 ? "all" : h[0] || "all",
          onChange: (d) => y([d.target.value]),
          className: "filter-select",
          children: jr.map((d) => /* @__PURE__ */ e.jsxs("option", { value: d.value, children: [
            d.icon,
            " ",
            d.label
          ] }, d.value))
        }
      ),
      /* @__PURE__ */ e.jsx(
        "select",
        {
          value: f,
          onChange: (d) => C(d.target.value),
          className: "filter-select",
          children: Gr.map((d) => /* @__PURE__ */ e.jsx("option", { value: d.value, children: d.label }, d.value))
        }
      ),
      (!(h.length === 1 && h[0] === "all") || f !== "all") && /* @__PURE__ */ e.jsxs(
        "button",
        {
          onClick: () => {
            y(["all"]), C("all");
          },
          className: "clear-filters-btn",
          children: [
            "✕ Clear Filters (",
            k.length,
            "/",
            W.length,
            ")"
          ]
        }
      )
    ] }),
    L === "network" && K.map((d) => {
      const b = te(d.id), S = b.filter(
        (X) => {
          var me;
          return ((me = X.status) == null ? void 0 : me.toLowerCase()) === "online";
        }
      ).length, I = g.has(d.id);
      return /* @__PURE__ */ e.jsxs("div", { className: "network-card", children: [
        /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: "network-header",
            onClick: () => w(d.id),
            children: [
              /* @__PURE__ */ e.jsxs("div", { className: "title", children: [
                /* @__PURE__ */ e.jsx("span", { className: "network-icon", children: "🌐" }),
                /* @__PURE__ */ e.jsx("h2", { children: d.name }),
                /* @__PURE__ */ e.jsxs("span", { className: "badge", children: [
                  S,
                  "/",
                  b.length,
                  " online"
                ] })
              ] }),
              /* @__PURE__ */ e.jsx(
                "span",
                {
                  className: `expand-icon ${I ? "expanded" : ""}`,
                  children: "▼"
                }
              )
            ]
          }
        ),
        I && le(b)
      ] }, d.id);
    }),
    L === "type" && jr.filter((d) => d.value !== "all").map((d) => {
      const b = he(d.value);
      if (b.length === 0 && !(h.length === 1 && h[0] === "all"))
        return null;
      const S = b.filter(
        (X) => {
          var me;
          return ((me = X.status) == null ? void 0 : me.toLowerCase()) === "online";
        }
      ).length, I = M.has(d.value);
      return /* @__PURE__ */ e.jsxs("div", { className: "network-card", children: [
        /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: "network-header",
            onClick: () => $(d.value),
            children: [
              /* @__PURE__ */ e.jsxs("div", { className: "title", children: [
                /* @__PURE__ */ e.jsx("span", { className: "network-icon", children: d.icon }),
                /* @__PURE__ */ e.jsx("h2", { children: d.label }),
                /* @__PURE__ */ e.jsxs("span", { className: "badge", children: [
                  S,
                  "/",
                  b.length,
                  " online"
                ] })
              ] }),
              /* @__PURE__ */ e.jsx(
                "span",
                {
                  className: `expand-icon ${I ? "expanded" : ""}`,
                  children: "▼"
                }
              )
            ]
          }
        ),
        I && le(b)
      ] }, d.value);
    }),
    L === "network" && K.length === 0 && k.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "network-card", children: [
      /* @__PURE__ */ e.jsx("div", { className: "network-header", children: /* @__PURE__ */ e.jsxs("div", { className: "title", children: [
        /* @__PURE__ */ e.jsx("span", { className: "network-icon", children: "🌐" }),
        /* @__PURE__ */ e.jsx("h2", { children: "All Devices" }),
        /* @__PURE__ */ e.jsxs("span", { className: "badge", children: [
          T,
          " online"
        ] })
      ] }) }),
      le(k)
    ] }),
    k.length === 0 && /* @__PURE__ */ e.jsxs("div", { className: "empty-state", children: [
      /* @__PURE__ */ e.jsx("div", { className: "icon", children: "📡" }),
      /* @__PURE__ */ e.jsx("h3", { children: "No Devices Found" }),
      /* @__PURE__ */ e.jsx("p", { children: !(h.length === 1 && h[0] === "all") || f !== "all" ? "No devices match your current filters." : "Your Meraki devices will appear here once discovered." })
    ] })
  ] });
}, Qr = ee(Kr, (r, a) => {
  var x, g, m, M, o, h, y, f, C, L, P, z, W, K;
  if (r.defaultViewMode !== a.defaultViewMode)
    return !1;
  if (r.data === a.data)
    return !0;
  const i = r.data, s = a.data;
  if (((x = i.devices) == null ? void 0 : x.length) !== ((g = s.devices) == null ? void 0 : g.length) || ((m = i.networks) == null ? void 0 : m.length) !== ((M = s.networks) == null ? void 0 : M.length) || ((o = i.clients) == null ? void 0 : o.length) !== ((h = s.clients) == null ? void 0 : h.length))
    return !1;
  const l = (y = i.devices) == null ? void 0 : y.map((J) => `${J.serial}:${J.status}`).join("|"), n = (f = s.devices) == null ? void 0 : f.map((J) => `${J.serial}:${J.status}`).join("|");
  return !(l !== n || i.last_updated !== s.last_updated || ((C = i.mqtt) == null ? void 0 : C.enabled) !== ((L = s.mqtt) == null ? void 0 : L.enabled) || ((z = (P = i.mqtt) == null ? void 0 : P.stats) == null ? void 0 : z.messages_received) !== ((K = (W = s.mqtt) == null ? void 0 : W.stats) == null ? void 0 : K.messages_received));
}), Rr = ee(
  ({ port: r, isSelected: a, onClick: i }) => {
    var n, x, g;
    const s = ((n = r.status) == null ? void 0 : n.toLowerCase()) === "connected", l = ((x = r.poe) == null ? void 0 : x.isAllocated) === !0 || ((g = r.poe) == null ? void 0 : g.enabled) === !0;
    return /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: `port ${s ? "connected" : ""} ${a ? "selected" : ""}`,
        onClick: i,
        title: `Port ${r.portId}${r.clientName ? ` - ${r.clientName}` : ""}`,
        children: [
          /* @__PURE__ */ e.jsx("span", { className: "num", children: r.portId }),
          l && /* @__PURE__ */ e.jsx("span", { className: "poe", children: "⚡" })
        ]
      }
    );
  },
  (r, a) => {
    var l, n, x, g;
    const i = r.port, s = a.port;
    return !(r.isSelected !== a.isSelected || i.status !== s.status || ((l = i.poe) == null ? void 0 : l.isAllocated) !== ((n = s.poe) == null ? void 0 : n.isAllocated) || ((x = i.poe) == null ? void 0 : x.enabled) !== ((g = s.poe) == null ? void 0 : g.enabled) || i.clientName !== s.clientName);
  }
);
Rr.displayName = "PortIcon";
const Jr = ({
  deviceName: r,
  model: a,
  ports: i,
  clients: s = [],
  onClientClick: l
}) => {
  var P, z, W, K, J, U, ie, re, pe, ye, ge;
  const [n, x] = ue(null), g = xe((N) => {
    x(N);
  }, []), m = (N) => {
    let R = N.trim();
    return R = R.replace(/^port\s*/i, ""), R = R.replace(
      /^(TenGigabit|Gigabit|Fast|Hundred)?Ethernet/i,
      ""
    ), R = R.replace(/^(Te|Gi|Fa|Eth?)\s*/i, ""), R.toLowerCase();
  }, M = (N) => {
    const R = m(N);
    return s.filter((q) => {
      if (!q.switchport) return !1;
      const H = m(q.switchport);
      if (H === R) return !0;
      const ce = R.split("/"), k = H.split("/");
      return ce.length === 1 && k.length > 1 ? k[k.length - 1] === R : ce.length === k.length ? H === R : !1;
    });
  }, o = (N) => N >= 1e6 ? `${(N / 1e6).toFixed(1)} GB` : N >= 1e3 ? `${(N / 1e3).toFixed(1)} MB` : `${N} KB`, h = (N) => N >= 1e3 ? `${(N / 1e3).toFixed(1)} Mbps` : `${N.toFixed(1)} Kbps`, y = (N) => {
    var R;
    return ((R = N.status) == null ? void 0 : R.toLowerCase()) === "connected";
  }, f = (N) => {
    var R, q;
    return ((R = N.poe) == null ? void 0 : R.isAllocated) === !0 || ((q = N.poe) == null ? void 0 : q.enabled) === !0;
  }, C = i.filter(y).length, L = i.filter(f).length;
  return /* @__PURE__ */ e.jsxs("div", { className: "info-card", children: [
    /* @__PURE__ */ e.jsxs("h3", { children: [
      /* @__PURE__ */ e.jsx("span", { children: "⚡" }),
      " Port Status"
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "port-visualization", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "switch-chassis", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "switch-label", children: [
          /* @__PURE__ */ e.jsxs("span", { children: [
            "Cisco Meraki ",
            a
          ] }),
          /* @__PURE__ */ e.jsxs("span", { children: [
            C,
            " of ",
            i.length,
            " connected"
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "ports-row", children: i.map((N) => /* @__PURE__ */ e.jsx(
          Rr,
          {
            port: N,
            isSelected: (n == null ? void 0 : n.portId) === N.portId,
            onClick: () => g(N)
          },
          N.portId
        )) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "port-legend", children: [
        /* @__PURE__ */ e.jsxs("span", { children: [
          /* @__PURE__ */ e.jsx("div", { className: "dot connected" }),
          "Connected (",
          C,
          ")"
        ] }),
        /* @__PURE__ */ e.jsxs("span", { children: [
          /* @__PURE__ */ e.jsx("div", { className: "dot disconnected" }),
          "Disconnected (",
          i.length - C,
          ")"
        ] }),
        /* @__PURE__ */ e.jsxs("span", { children: [
          "⚡ PoE Active (",
          L,
          ")"
        ] })
      ] })
    ] }),
    n && /* @__PURE__ */ e.jsxs("div", { className: "port-details", children: [
      /* @__PURE__ */ e.jsxs("h4", { className: "port-details-header", children: [
        /* @__PURE__ */ e.jsx(
          "span",
          {
            className: `port-status-icon ${y(n) ? "connected" : "disconnected"}`,
            children: "🔌"
          }
        ),
        "Port ",
        n.portId,
        " - ",
        n.status || "Unknown",
        n.isUplink && /* @__PURE__ */ e.jsx("span", { className: "port-uplink-badge", children: "↑ Uplink" })
      ] }),
      (((P = n.errors) == null ? void 0 : P.length) || ((z = n.warnings) == null ? void 0 : z.length)) && /* @__PURE__ */ e.jsxs("div", { className: "port-alerts", children: [
        (W = n.errors) == null ? void 0 : W.map((N, R) => /* @__PURE__ */ e.jsxs("div", { className: "port-alert error", children: [
          /* @__PURE__ */ e.jsx("span", { children: "🚨" }),
          " ",
          N
        ] }, `err-${R}`)),
        (K = n.warnings) == null ? void 0 : K.map((N, R) => /* @__PURE__ */ e.jsxs("div", { className: "port-alert warning", children: [
          /* @__PURE__ */ e.jsx("span", { children: "⚠️" }),
          " ",
          N
        ] }, `warn-${R}`))
      ] }),
      y(n) && (() => {
        const N = M(n.portId);
        return N.length === 0 ? n.clientName || n.clientMac ? /* @__PURE__ */ e.jsxs("div", { className: "client-info", children: [
          /* @__PURE__ */ e.jsx("div", { className: "client-avatar", children: "💻" }),
          /* @__PURE__ */ e.jsxs("div", { className: "client-details", children: [
            /* @__PURE__ */ e.jsx("div", { className: "name", children: n.clientName || "Connected Device" }),
            n.clientMac && /* @__PURE__ */ e.jsx("div", { className: "mac", children: n.clientMac })
          ] })
        ] }) : null : /* @__PURE__ */ e.jsxs("div", { className: "port-clients", children: [
          /* @__PURE__ */ e.jsxs("h5", { className: "port-clients-header", children: [
            "👥 Connected Clients (",
            N.length,
            ")"
          ] }),
          /* @__PURE__ */ e.jsx("div", { className: "port-clients-list", children: N.map((R) => {
            var q, H, ce;
            return /* @__PURE__ */ e.jsxs(
              "div",
              {
                className: `port-client-item ${l ? "clickable" : ""}`,
                onClick: () => l == null ? void 0 : l(R.id),
                children: [
                  /* @__PURE__ */ e.jsx("div", { className: "port-client-icon", children: (q = R.os) != null && q.toLowerCase().includes("ios") || (H = R.manufacturer) != null && H.toLowerCase().includes("apple") ? "📱" : (ce = R.os) != null && ce.toLowerCase().includes("windows") ? "💻" : "🔌" }),
                  /* @__PURE__ */ e.jsxs("div", { className: "port-client-info", children: [
                    /* @__PURE__ */ e.jsx("div", { className: "port-client-name", children: R.description || R.mac }),
                    /* @__PURE__ */ e.jsxs("div", { className: "port-client-meta", children: [
                      R.ip && /* @__PURE__ */ e.jsx("span", { className: "port-client-ip", children: R.ip }),
                      R.manufacturer && /* @__PURE__ */ e.jsx("span", { className: "port-client-manufacturer", children: R.manufacturer })
                    ] })
                  ] }),
                  R.vlan != null && /* @__PURE__ */ e.jsxs("div", { className: "port-client-vlan", children: [
                    "VLAN ",
                    R.vlan
                  ] })
                ]
              },
              R.id || R.mac
            );
          }) })
        ] });
      })(),
      /* @__PURE__ */ e.jsxs("div", { className: "port-stats", children: [
        n.vlan != null && /* @__PURE__ */ e.jsxs("div", { className: "port-stat", children: [
          /* @__PURE__ */ e.jsx("div", { className: "label", children: "VLAN" }),
          /* @__PURE__ */ e.jsx("div", { className: "value", children: n.vlan })
        ] }),
        n.speed && /* @__PURE__ */ e.jsxs("div", { className: "port-stat", children: [
          /* @__PURE__ */ e.jsx("div", { className: "label", children: "Speed" }),
          /* @__PURE__ */ e.jsx("div", { className: "value", children: n.speed })
        ] }),
        n.duplex && /* @__PURE__ */ e.jsxs("div", { className: "port-stat", children: [
          /* @__PURE__ */ e.jsx("div", { className: "label", children: "Duplex" }),
          /* @__PURE__ */ e.jsx("div", { className: "value", children: n.duplex })
        ] }),
        n.clientCount != null && n.clientCount > 0 && /* @__PURE__ */ e.jsxs("div", { className: "port-stat", children: [
          /* @__PURE__ */ e.jsx("div", { className: "label", children: "Clients" }),
          /* @__PURE__ */ e.jsx("div", { className: "value", children: n.clientCount })
        ] }),
        ((J = n.trafficInKbps) == null ? void 0 : J.total) != null && /* @__PURE__ */ e.jsxs("div", { className: "port-stat", children: [
          /* @__PURE__ */ e.jsx("div", { className: "label", children: "Live Traffic" }),
          /* @__PURE__ */ e.jsx("div", { className: "value", children: h(n.trafficInKbps.total) })
        ] }),
        ((U = n.usageInKb) == null ? void 0 : U.total) != null && /* @__PURE__ */ e.jsxs("div", { className: "port-stat", children: [
          /* @__PURE__ */ e.jsx("div", { className: "label", children: "Total Usage" }),
          /* @__PURE__ */ e.jsx("div", { className: "value", children: o(n.usageInKb.total) })
        ] }),
        f(n) && /* @__PURE__ */ e.jsxs("div", { className: "port-stat", children: [
          /* @__PURE__ */ e.jsx("div", { className: "label", children: "PoE Energy" }),
          /* @__PURE__ */ e.jsx("div", { className: "value value-poe", children: n.powerUsageInWh != null ? `${n.powerUsageInWh.toFixed(1)} Wh` : "Active" })
        ] })
      ] }),
      !y(n) && /* @__PURE__ */ e.jsx("div", { className: "port-empty-state", children: n.enabled === !1 ? "🔒 Port is disabled" : "📴 No device connected to this port" }),
      (((ie = n.lldp) == null ? void 0 : ie.systemName) || ((re = n.cdp) == null ? void 0 : re.deviceId)) && /* @__PURE__ */ e.jsxs("div", { className: "neighbor-discovery", children: [
        /* @__PURE__ */ e.jsx("h5", { className: "neighbor-discovery-header", children: "🔗 Neighbor Discovery" }),
        ((pe = n.lldp) == null ? void 0 : pe.systemName) && /* @__PURE__ */ e.jsxs("div", { className: "neighbor-protocol", children: [
          /* @__PURE__ */ e.jsx("div", { className: "neighbor-protocol-label", children: "LLDP" }),
          /* @__PURE__ */ e.jsx("div", { className: "neighbor-protocol-name", children: n.lldp.systemName }),
          n.lldp.portId && /* @__PURE__ */ e.jsxs("div", { className: "neighbor-protocol-detail", children: [
            "Port: ",
            n.lldp.portId,
            " ",
            n.lldp.portDescription && `(${n.lldp.portDescription})`
          ] }),
          n.lldp.managementAddress && /* @__PURE__ */ e.jsx("div", { className: "neighbor-protocol-address", children: n.lldp.managementAddress })
        ] }),
        ((ye = n.cdp) == null ? void 0 : ye.deviceId) && /* @__PURE__ */ e.jsxs("div", { className: "neighbor-protocol", children: [
          /* @__PURE__ */ e.jsx("div", { className: "neighbor-protocol-label", children: "CDP" }),
          /* @__PURE__ */ e.jsx("div", { className: "neighbor-protocol-name", children: n.cdp.deviceId }),
          n.cdp.platform && /* @__PURE__ */ e.jsx("div", { className: "neighbor-protocol-detail", children: n.cdp.platform }),
          n.cdp.portId && /* @__PURE__ */ e.jsxs("div", { className: "neighbor-protocol-detail", children: [
            "Port: ",
            n.cdp.portId
          ] }),
          n.cdp.managementAddress && /* @__PURE__ */ e.jsx("div", { className: "neighbor-protocol-address", children: n.cdp.managementAddress })
        ] })
      ] }),
      ((ge = n.securePort) == null ? void 0 : ge.enabled) && /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: `secure-port-status ${n.securePort.active ? "active" : "inactive"}`,
          children: [
            /* @__PURE__ */ e.jsx("span", { children: "🔒" }),
            /* @__PURE__ */ e.jsxs("span", { children: [
              "SecurePort:",
              " ",
              n.securePort.authenticationStatus || (n.securePort.active ? "Active" : "Inactive")
            ] })
          ]
        }
      )
    ] }),
    !n && /* @__PURE__ */ e.jsx("div", { className: "port-select-prompt", children: "Click a port to view details" })
  ] });
}, qr = ee(
  Jr,
  (r, a) => {
    var l, n;
    if (r.ports.length !== a.ports.length || ((l = r.clients) == null ? void 0 : l.length) !== ((n = a.clients) == null ? void 0 : n.length)) return !1;
    const i = r.ports.filter(
      (x) => {
        var g;
        return ((g = x.status) == null ? void 0 : g.toLowerCase()) === "connected";
      }
    ).length, s = a.ports.filter(
      (x) => {
        var g;
        return ((g = x.status) == null ? void 0 : g.toLowerCase()) === "connected";
      }
    ).length;
    return i === s;
  }
), Xr = (r) => {
  if (!r) return "";
  const a = new Date(r), s = (/* @__PURE__ */ new Date()).getTime() - a.getTime();
  return s < 0 ? "Just now" : s < 6e4 ? `${Math.floor(s / 1e3)}s ago` : s < 36e5 ? `${Math.floor(s / 6e4)}m ago` : s < 864e5 ? `${Math.floor(s / 36e5)}h ago` : a.toLocaleDateString();
}, Zr = ({
  type: r,
  value: a,
  unit: i,
  min: s,
  max: l,
  status: n = "normal",
  temperatureUnit: x = "celsius",
  lastUpdated: g,
  dataSource: m
}) => {
  const M = () => {
    switch (r) {
      case "temperature":
        return "🌡️";
      case "humidity":
        return "💧";
      case "water":
        return "🌊";
      case "door":
        return "🚪";
      case "tvoc":
        return "🌬️";
      case "pm25":
        return "🌫️";
      case "noise":
        return "🔊";
      case "battery":
        return "🔋";
      case "co2":
        return "💨";
      case "indoorAirQuality":
        return "🍃";
      default:
        return "📊";
    }
  }, o = () => {
    switch (r) {
      case "temperature":
        return "Temperature";
      case "humidity":
        return "Humidity";
      case "water":
        return "Water Detection";
      case "door":
        return "Door Status";
      case "tvoc":
        return "TVOC";
      case "pm25":
        return "PM2.5";
      case "noise":
        return "Noise Level";
      case "battery":
        return "Battery";
      case "co2":
        return "CO₂";
      case "indoorAirQuality":
        return "Air Quality";
      default:
        return r;
    }
  }, h = () => {
    switch (r) {
      case "temperature":
        return x === "fahrenheit" ? "°F" : "°C";
      case "humidity":
        return "%";
      case "tvoc":
        return "ppb";
      case "pm25":
        return "µg/m³";
      case "noise":
        return "dB";
      case "battery":
        return "%";
      case "co2":
        return "ppm";
      case "indoorAirQuality":
        return "";
      default:
        return "";
    }
  }, y = () => r === "temperature" && x === "fahrenheit" ? a * 9 / 5 + 32 : a, f = () => {
    if (s !== void 0 && l !== void 0)
      return r === "temperature" && x === "fahrenheit" ? { min: s * 9 / 5 + 32, max: l * 9 / 5 + 32 } : { min: s, max: l };
    switch (r) {
      case "temperature":
        return x === "fahrenheit" ? { min: 32, max: 122 } : { min: 0, max: 50 };
      case "humidity":
      case "battery":
        return { min: 0, max: 100 };
      case "tvoc":
        return { min: 0, max: 1e3 };
      case "pm25":
        return { min: 0, max: 150 };
      case "noise":
        return { min: 20, max: 100 };
      case "co2":
        return { min: 400, max: 2e3 };
      case "indoorAirQuality":
        return { min: 0, max: 100 };
      default:
        return { min: 0, max: 100 };
    }
  }, C = () => {
    switch (n) {
      case "normal":
        return r === "humidity" ? "Optimal humidity" : r === "indoorAirQuality" ? "Good air quality" : r === "co2" ? "Normal CO₂" : "Within normal range";
      case "warning":
        return "Above threshold";
      case "critical":
        return "Critical level!";
      default:
        return "";
    }
  }, L = () => {
    const U = f(), ie = y();
    return U.max === U.min ? 0 : Math.min(
      100,
      Math.max(0, (ie - U.min) / (U.max - U.min) * 100)
    );
  }, P = () => {
    switch (r) {
      case "temperature":
        return "temp";
      case "humidity":
        return "humidity";
      case "tvoc":
      case "pm25":
      case "co2":
      case "indoorAirQuality":
        return "air-quality";
      case "noise":
        return "noise";
      case "battery":
        return "battery";
      default:
        return "default";
    }
  }, z = i || h(), W = L(), K = y(), J = f();
  return /* @__PURE__ */ e.jsxs("div", { className: `reading-card ${r}`, style: { position: "relative" }, children: [
    /* @__PURE__ */ e.jsx("div", { className: "icon-wrapper", children: /* @__PURE__ */ e.jsx("span", { className: "reading-icon", children: M() }) }),
    /* @__PURE__ */ e.jsx("div", { className: "reading-label", children: o() }),
    /* @__PURE__ */ e.jsxs("div", { className: "reading-value", children: [
      typeof K == "number" ? K.toFixed(1) : K,
      /* @__PURE__ */ e.jsx("span", { className: "reading-unit", children: z })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "reading-status", children: [
      n === "normal" && /* @__PURE__ */ e.jsx("span", { children: "✅" }),
      n === "warning" && /* @__PURE__ */ e.jsx("span", { children: "⚠️" }),
      n === "critical" && /* @__PURE__ */ e.jsx("span", { children: "🚨" }),
      C()
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "gauge-wrapper", children: /* @__PURE__ */ e.jsx(
      "div",
      {
        className: `gauge-fill ${P()}`,
        style: { width: `${W}%` }
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "gauge-labels", children: [
      /* @__PURE__ */ e.jsxs("span", { children: [
        J.min.toFixed(0),
        z
      ] }),
      /* @__PURE__ */ e.jsxs("span", { children: [
        ((J.max + J.min) / 2).toFixed(0),
        z
      ] }),
      /* @__PURE__ */ e.jsxs("span", { children: [
        J.max.toFixed(0),
        z
      ] })
    ] }),
    g && /* @__PURE__ */ e.jsxs(
      "div",
      {
        style: {
          position: "absolute",
          bottom: "6px",
          right: "8px",
          fontSize: "10px",
          color: "var(--secondary-text-color, #888)",
          display: "flex",
          alignItems: "center",
          gap: "4px"
        },
        title: `Last updated: ${new Date(g).toLocaleString()}${m ? ` (via ${m.toUpperCase()})` : ""}`,
        children: [
          m === "mqtt" && /* @__PURE__ */ e.jsx("span", { style: { color: "#22c55e", fontSize: "8px" }, children: "●" }),
          m === "api" && /* @__PURE__ */ e.jsx("span", { style: { color: "#3b82f6", fontSize: "8px" }, children: "●" }),
          Xr(g)
        ]
      }
    )
  ] });
}, et = (r, a) => {
  if (r.type !== a.type || r.value !== a.value || r.status !== a.status || r.unit !== a.unit || r.temperatureUnit !== a.temperatureUnit || r.dataSource !== a.dataSource) return !1;
  if (r.lastUpdated !== a.lastUpdated) {
    if (!r.lastUpdated || !a.lastUpdated) return !1;
    const i = new Date(r.lastUpdated).getTime(), s = new Date(a.lastUpdated).getTime();
    if (Math.abs(s - i) > 3e4) return !1;
  }
  return !0;
}, Me = ee(Zr, et), rt = ({
  icon: r,
  label: a,
  value: i,
  unit: s = "",
  secondaryValue: l,
  gauge: n,
  status: x = "normal",
  statusMessage: g,
  onClick: m
}) => {
  const M = () => {
    switch (x) {
      case "normal":
        return "✅";
      case "warning":
        return "⚠️";
      case "critical":
        return "🚨";
      case "inactive":
        return "⏸️";
      default:
        return "";
    }
  }, o = () => {
    if (!n || typeof i != "number") return 0;
    const { min: P, max: z } = n;
    return z === P ? 0 : Math.min(100, Math.max(0, (i - P) / (z - P) * 100));
  }, h = () => {
    if (!(n != null && n.color))
      switch (x) {
        case "normal":
          return "success";
        case "warning":
          return "warning";
        case "critical":
          return "error";
        default:
          return "primary";
      }
    return n.color;
  }, y = () => `metric-icon-wrapper metric-icon-${h()}`, f = () => typeof i == "number" ? Number.isInteger(i) ? i.toString() : i.toFixed(1) : i, C = o(), L = (n == null ? void 0 : n.showLabels) !== !1 && n;
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: `metric-card ${m ? "clickable" : ""}`,
      onClick: m,
      role: m ? "button" : void 0,
      tabIndex: m ? 0 : void 0,
      children: [
        /* @__PURE__ */ e.jsx("div", { className: y(), children: /* @__PURE__ */ e.jsx("span", { className: "metric-icon", children: r }) }),
        /* @__PURE__ */ e.jsx("div", { className: "metric-label", children: a }),
        /* @__PURE__ */ e.jsxs("div", { className: "metric-value", children: [
          f(),
          s && /* @__PURE__ */ e.jsx("span", { className: "metric-unit", children: s })
        ] }),
        l && /* @__PURE__ */ e.jsx("div", { className: "metric-secondary", children: l }),
        g && /* @__PURE__ */ e.jsxs("div", { className: `metric-status metric-status-${x}`, children: [
          /* @__PURE__ */ e.jsx("span", { children: M() }),
          g
        ] }),
        n && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsx("div", { className: "metric-gauge-wrapper", children: /* @__PURE__ */ e.jsx(
            "div",
            {
              className: `metric-gauge-fill metric-gauge-${h()}`,
              style: { width: `${C}%` }
            }
          ) }),
          L && /* @__PURE__ */ e.jsxs("div", { className: "metric-gauge-labels", children: [
            /* @__PURE__ */ e.jsxs("span", { children: [
              n.min,
              s
            ] }),
            /* @__PURE__ */ e.jsxs("span", { children: [
              n.max,
              s
            ] })
          ] })
        ] })
      ]
    }
  );
}, ke = ee(rt), tt = ee(
  ({ entity: r, onClick: a }) => /* @__PURE__ */ e.jsxs("tr", { className: "device-row", onClick: a, children: [
    /* @__PURE__ */ e.jsx("td", { children: r.name }),
    /* @__PURE__ */ e.jsx("td", { className: "text-mono text-sm text-muted", children: r.entity_id }),
    /* @__PURE__ */ e.jsx("td", { children: /* @__PURE__ */ e.jsx("span", { className: "detail-badge", children: r.state }) })
  ] }),
  (r, a) => r.entity.entity_id === a.entity.entity_id && r.entity.name === a.entity.name && r.entity.state === a.entity.state
), at = ee(
  ({ client: r, onClick: a }) => {
    var i, s, l;
    return /* @__PURE__ */ e.jsxs("tr", { className: "device-row clickable", onClick: a, children: [
      /* @__PURE__ */ e.jsx("td", { children: /* @__PURE__ */ e.jsxs("div", { className: "client-row-cell", children: [
        /* @__PURE__ */ e.jsx("span", { className: "client-row-icon", children: (i = r.os) != null && i.toLowerCase().includes("ios") || (s = r.manufacturer) != null && s.toLowerCase().includes("apple") ? "📱" : (l = r.os) != null && l.toLowerCase().includes("windows") ? "💻" : "🔌" }),
        /* @__PURE__ */ e.jsxs("div", { className: "client-row-info", children: [
          /* @__PURE__ */ e.jsx("div", { className: "font-medium", children: r.description || r.mac }),
          r.manufacturer && /* @__PURE__ */ e.jsx("div", { className: "text-sm text-muted", children: r.manufacturer })
        ] })
      ] }) }),
      r.ip && /* @__PURE__ */ e.jsx("td", { className: "text-mono text-sm", children: r.ip }),
      !r.ip && /* @__PURE__ */ e.jsx("td", {}),
      /* @__PURE__ */ e.jsx("td", { children: (r.ssid || r.switchport) && /* @__PURE__ */ e.jsx("span", { className: "detail-badge", children: r.ssid || r.switchport }) })
    ] });
  },
  (r, a) => r.client.id === a.client.id && r.client.mac === a.client.mac && r.client.description === a.client.description && r.client.ip === a.client.ip && r.client.manufacturer === a.client.manufacturer && r.client.os === a.client.os && r.client.ssid === a.client.ssid && r.client.switchport === a.client.switchport
), st = ee(
  ({ bss: r }) => {
    var a;
    return /* @__PURE__ */ e.jsxs("tr", { children: [
      /* @__PURE__ */ e.jsxs("td", { children: [
        /* @__PURE__ */ e.jsx("div", { className: "font-medium", children: r.ssidName || `SSID ${r.ssidNumber}` }),
        r.bssid && /* @__PURE__ */ e.jsx("div", { className: "bssid-text", children: r.bssid })
      ] }),
      /* @__PURE__ */ e.jsx("td", { children: /* @__PURE__ */ e.jsx(
        "span",
        {
          className: `band-badge ${(a = r.band) != null && a.includes("2.4") ? "band-2_4" : "band-5"}`,
          children: r.band
        }
      ) }),
      /* @__PURE__ */ e.jsx("td", { children: r.channel }),
      /* @__PURE__ */ e.jsx("td", { children: r.channelWidth }),
      /* @__PURE__ */ e.jsx("td", { className: "text-warning", children: r.power }),
      /* @__PURE__ */ e.jsx("td", { children: /* @__PURE__ */ e.jsxs(
        "span",
        {
          className: `broadcast-status ${r.broadcasting ? "active" : "inactive"}`,
          children: [
            /* @__PURE__ */ e.jsx("span", { className: "broadcast-dot" }),
            r.broadcasting ? "Broadcasting" : "Off"
          ]
        }
      ) })
    ] });
  },
  (r, a) => r.bss.ssidName === a.bss.ssidName && r.bss.ssidNumber === a.bss.ssidNumber && r.bss.bssid === a.bss.bssid && r.bss.band === a.bss.band && r.bss.channel === a.bss.channel && r.bss.channelWidth === a.bss.channelWidth && r.bss.power === a.bss.power && r.bss.broadcasting === a.bss.broadcasting
), it = ({
  activeView: r,
  setActiveView: a,
  data: i,
  clients: s,
  haDevices: l,
  hass: n,
  configEntryId: x,
  cameraLinkIntegration: g,
  configEntryOptions: m
}) => {
  const M = (m == null ? void 0 : m.temperature_unit) || "celsius", o = i.devices.find((c) => c.serial === r.deviceId), h = l.find(
    (c) => c.identifiers.some((p) => p[0] === "meraki_ha" && p[1] === (o == null ? void 0 : o.serial))
  ), y = s.filter(
    (c) => c.via_device_id === (h == null ? void 0 : h.id)
  ), [f, C] = de.useState(null), [L, P] = de.useState(!1), [z, W] = de.useState(
    null
  ), [K, J] = de.useState([]), [U, ie] = de.useState(""), [re, pe] = de.useState(!1), [ye, ge] = de.useState(
    null
  ), [N, R] = de.useState(!1), [q, H] = de.useState(!1), [ce, k] = de.useState(
    null
  ), [T, j] = de.useState(!1), [Q, w] = de.useState(!1), [$, B] = de.useState("none"), A = Te(n);
  A.current = n;
  const Y = Te(null);
  if (!o)
    return /* @__PURE__ */ e.jsxs("div", { children: [
      /* @__PURE__ */ e.jsx(
        "button",
        {
          onClick: () => a({ view: "dashboard" }),
          className: "back-button",
          children: "← Back to Dashboard"
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { className: "empty-state", children: [
        /* @__PURE__ */ e.jsx("div", { className: "icon", children: "❓" }),
        /* @__PURE__ */ e.jsx("h3", { children: "Device Not Found" }),
        /* @__PURE__ */ e.jsx("p", { children: "The requested device could not be found." })
      ] })
    ] });
  const {
    name: ne,
    model: te = "",
    serial: he,
    firmware: le,
    status: d,
    lanIp: b,
    mac: S,
    productType: I,
    status_messages: X = [],
    entities: me = [],
    ports_statuses: Z = [],
    readings: E,
    readings_meta: _,
    uptime: fe,
    lastReportedAt: _e
  } = o, $e = () => {
    const c = te.toUpperCase(), p = (I == null ? void 0 : I.toLowerCase()) || "";
    return c.startsWith("MS") || p === "switch" ? "🔀" : c.startsWith("MV") || p === "camera" ? "📹" : c.startsWith("MR") || p === "wireless" ? "📶" : c.startsWith("MT") || p === "sensor" ? c.startsWith("MT10") || c.startsWith("MT11") || c.startsWith("MT15") ? "🌡️" : c.startsWith("MT12") ? "🚪" : c.startsWith("MT14") ? "💨" : c.startsWith("MT20") ? "🔘" : c.startsWith("MT30") ? "⚡" : "📡" : c.startsWith("MX") || c.startsWith("Z") || p === "appliance" ? "🛡️" : "📱";
  }, We = () => {
    const c = te.toUpperCase(), p = (I == null ? void 0 : I.toLowerCase()) || "";
    return c.startsWith("MS") || p === "switch" ? "switch" : c.startsWith("MV") || p === "camera" ? "camera" : c.startsWith("MR") || p === "wireless" ? "wireless" : c.startsWith("MT") || p === "sensor" ? "sensor" : c.startsWith("MX") || c.startsWith("Z") || p === "appliance" ? "appliance" : "";
  }, Ce = te.toUpperCase().startsWith("MS") || I === "switch", Je = te.toUpperCase().startsWith("MT") || I === "sensor", qe = te.toUpperCase().startsWith("MV") || I === "camera", Fe = te.toUpperCase().startsWith("MR") || I === "wireless", Xe = te.toUpperCase().startsWith("MX") || te.toUpperCase().startsWith("Z") || I === "appliance", Ze = [
    "temperature",
    "humidity",
    "battery",
    "tvoc",
    "pm25",
    "pm2_5",
    "co2",
    "noise",
    "indoor_air_quality",
    "air_quality",
    "voc"
  ], Ue = me.filter((c) => {
    const p = c.name.toLowerCase(), ae = c.entity_id.toLowerCase();
    return !Ze.some(
      (je) => p.includes(je) || ae.includes(je)
    );
  }), Ae = (c) => {
    if (!c) return null;
    const p = Math.floor(c / 86400), ae = Math.floor(c % 86400 / 3600);
    if (p > 0)
      return `${p}d ${ae}h`;
    const je = Math.floor(c % 3600 / 60);
    return `${ae}h ${je}m`;
  }, Oe = (c) => c ? Math.floor(c / 86400) : 0, or = (c) => {
    if (!c) return "Just now";
    const p = new Date(c), ae = /* @__PURE__ */ new Date();
    return p.toDateString() === ae.toDateString() ? p.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }) : p.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }, er = (c) => {
    const p = new CustomEvent("hass-more-info", {
      bubbles: !0,
      composed: !0,
      detail: { entityId: c }
    });
    document.body.dispatchEvent(p);
  }, rr = async () => {
    const c = A.current;
    if (!(!c || !x || !o)) {
      P(!0);
      try {
        const p = await c.callWS({
          type: "meraki_ha/get_camera_snapshot",
          config_entry_id: x,
          serial: o.serial
        });
        p != null && p.url && C(p.url);
      } catch (p) {
        console.error("Failed to fetch snapshot:", p);
      } finally {
        P(!1);
      }
    }
  }, lr = async () => {
    const c = A.current;
    if (!(!c || !x || !o))
      try {
        const p = await c.callWS({
          type: "meraki_ha/get_camera_stream_url",
          config_entry_id: x,
          serial: o.serial,
          stream_source: "cloud"
        });
        p != null && p.url && W(p.url);
      } catch (p) {
        console.error("Failed to fetch cloud video URL:", p);
      }
  }, cr = () => {
    z && window.open(z, "_blank", "noopener,noreferrer");
  }, dr = async () => {
    const c = A.current;
    if (c)
      try {
        const p = await c.callWS({
          type: "meraki_ha/get_available_cameras",
          integration_filter: g || ""
        }), ae = (p == null ? void 0 : p.cameras) || [];
        J(
          ae.map((je) => ({
            entity_id: je.entity_id,
            friendly_name: je.friendly_name || je.name || je.entity_id
          }))
        );
      } catch (p) {
        console.error("Failed to fetch available cameras:", p);
      }
  }, ur = async () => {
    const c = A.current;
    if (!(!c || !x || !o))
      try {
        const p = await c.callWS({
          type: "meraki_ha/get_camera_mappings",
          config_entry_id: x
        }), ae = (p == null ? void 0 : p.mappings) || {};
        ie(ae[o.serial] || "");
      } catch (p) {
        console.error("Failed to fetch camera mappings:", p);
      }
  }, Be = async (c) => {
    const p = A.current;
    if (!(!p || !x || !o))
      try {
        await p.callWS({
          type: "meraki_ha/set_camera_mapping",
          config_entry_id: x,
          serial: o.serial,
          linked_entity_id: c
        }), ie(c), pe(!1), ge(null), B("none"), c && setTimeout(() => Re(), 100);
      } catch (ae) {
        console.error("Failed to save camera mapping:", ae);
      }
  }, tr = async () => {
    const c = A.current;
    if (!c || !U) return !1;
    R(!0), H(!1);
    try {
      const p = await c.callWS({
        type: "auth/sign_path",
        path: `/api/camera_proxy_stream/${U}`,
        expires: 300
        // URL valid for 5 minutes for continuous streaming
      });
      return p != null && p.path ? (ge(p.path), B("linked"), !0) : (H(!0), !1);
    } catch (p) {
      return console.error("Failed to get signed camera stream URL:", p), ge(null), H(!0), !1;
    } finally {
      R(!1);
    }
  }, Se = async () => {
    const c = A.current;
    if (!c || !(o != null && o.serial) || !x) return !1;
    j(!0), w(!1);
    try {
      const p = await c.callWS({
        type: "meraki_ha/get_rtsp_url",
        config_entry_id: x,
        serial: o.serial
      });
      return p != null && p.rtsp_url ? (k(p.rtsp_url), B("rtsp"), !0) : (w(!0), !1);
    } catch (p) {
      return console.error("Failed to get RTSP stream URL:", p), k(null), w(!0), !1;
    } finally {
      j(!1);
    }
  }, Re = async () => {
    U && await tr() || (o != null && o.rtsp_url || o != null && o.rtspEnabled) && await Se() || B(f ? "snapshot" : "none");
  };
  de.useEffect(() => {
    var ae;
    const c = o && (((ae = o.model) == null ? void 0 : ae.toUpperCase().startsWith("MV")) || o.productType === "camera"), p = o == null ? void 0 : o.serial;
    c && p && x && A.current && Y.current !== p && (Y.current = p, ge(null), k(null), B("none"), rr(), lr(), ur(), dr());
  }, [o == null ? void 0 : o.serial, x]), de.useEffect(() => {
    var p;
    o && (((p = o.model) == null ? void 0 : p.toUpperCase().startsWith("MV")) || o.productType === "camera") && A.current && Re();
  }, [U, o == null ? void 0 : o.serial, f]);
  const Ve = Z.reduce(
    (c, p) => c + (p.powerUsageInWh || 0),
    0
  ), He = Z.reduce(
    (c, p) => c + (p.clientCount || 0),
    0
  );
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx(
      "button",
      {
        onClick: () => a({ view: "dashboard" }),
        className: "back-button",
        children: "← Back to Dashboard"
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "device-header", children: [
      /* @__PURE__ */ e.jsx("div", { className: `device-icon ${We()}`, children: $e() }),
      /* @__PURE__ */ e.jsxs("div", { className: "device-info", children: [
        /* @__PURE__ */ e.jsx("h1", { children: ne || he }),
        /* @__PURE__ */ e.jsxs("div", { className: "meta", children: [
          /* @__PURE__ */ e.jsxs("span", { children: [
            /* @__PURE__ */ e.jsx("strong", { children: "Model:" }),
            " ",
            te
          ] }),
          /* @__PURE__ */ e.jsxs("span", { children: [
            /* @__PURE__ */ e.jsx("strong", { children: "Serial:" }),
            " ",
            he
          ] }),
          le && /* @__PURE__ */ e.jsxs("span", { children: [
            /* @__PURE__ */ e.jsx("strong", { children: "Firmware:" }),
            " ",
            le
          ] }),
          b && /* @__PURE__ */ e.jsxs("span", { children: [
            /* @__PURE__ */ e.jsx("strong", { children: "IP:" }),
            " ",
            b
          ] }),
          S && /* @__PURE__ */ e.jsxs("span", { children: [
            /* @__PURE__ */ e.jsx("strong", { children: "MAC:" }),
            " ",
            /* @__PURE__ */ e.jsx("span", { style: { fontFamily: "monospace" }, children: S })
          ] }),
          Je && (E == null ? void 0 : E.battery) != null && /* @__PURE__ */ e.jsxs("span", { children: [
            /* @__PURE__ */ e.jsx("strong", { children: "Battery:" }),
            " ",
            /* @__PURE__ */ e.jsxs(
              "span",
              {
                style: {
                  color: E.battery > 20 ? "var(--success)" : "var(--warning)"
                },
                children: [
                  E.battery,
                  "%"
                ]
              }
            )
          ] })
        ] }),
        _e && /* @__PURE__ */ e.jsx(
          "div",
          {
            className: "meta",
            style: { marginTop: "4px", fontSize: "12px" },
            children: /* @__PURE__ */ e.jsxs("span", { style: { color: "var(--text-muted)" }, children: [
              "Last updated: ",
              or(_e)
            ] })
          }
        )
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: `status-pill ${d == null ? void 0 : d.toLowerCase()}`, children: [
        /* @__PURE__ */ e.jsx("div", { className: "dot" }),
        d || "Unknown"
      ] })
    ] }),
    Ce && Z.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "metric-cards-grid", children: [
      /* @__PURE__ */ e.jsx(
        ke,
        {
          icon: "⚡",
          label: "PoE Energy",
          value: Ve,
          unit: "Wh",
          gauge: { min: 0, max: 500, color: "warning" },
          status: "normal",
          statusMessage: "Active"
        }
      ),
      /* @__PURE__ */ e.jsx(
        ke,
        {
          icon: "👥",
          label: "Connected Clients",
          value: He,
          gauge: {
            min: 0,
            max: Math.max(50, He),
            color: "info"
          },
          status: "normal"
        }
      ),
      fe != null && /* @__PURE__ */ e.jsx(
        ke,
        {
          icon: "⏱️",
          label: "Uptime",
          value: Oe(fe),
          unit: " days",
          secondaryValue: Ae(fe) || void 0,
          status: "normal",
          statusMessage: "Running"
        }
      ),
      /* @__PURE__ */ e.jsx(
        ke,
        {
          icon: "🔌",
          label: "Connected Ports",
          value: Z.filter(
            (c) => {
              var p;
              return ((p = c.status) == null ? void 0 : p.toLowerCase()) === "connected";
            }
          ).length,
          secondaryValue: `of ${Z.length} total`,
          gauge: {
            min: 0,
            max: Z.length,
            color: "success"
          },
          status: "normal"
        }
      )
    ] }),
    Fe && /* @__PURE__ */ e.jsxs("div", { className: "metric-cards-grid", children: [
      /* @__PURE__ */ e.jsx(
        ke,
        {
          icon: "👥",
          label: "Connected Clients",
          value: y.length,
          gauge: {
            min: 0,
            max: Math.max(50, y.length),
            color: "info"
          },
          status: "normal"
        }
      ),
      o.basicServiceSets && /* @__PURE__ */ e.jsx(
        ke,
        {
          icon: "📶",
          label: "Active SSIDs",
          value: o.basicServiceSets.filter((c) => c.enabled).length,
          secondaryValue: `of ${o.basicServiceSets.length} total`,
          gauge: {
            min: 0,
            max: o.basicServiceSets.length || 1,
            color: "success"
          },
          status: "normal"
        }
      ),
      fe != null && /* @__PURE__ */ e.jsx(
        ke,
        {
          icon: "⏱️",
          label: "Uptime",
          value: Oe(fe),
          unit: " days",
          secondaryValue: Ae(fe) || void 0,
          status: "normal",
          statusMessage: "Running"
        }
      )
    ] }),
    Xe && /* @__PURE__ */ e.jsxs("div", { className: "metric-cards-grid", children: [
      /* @__PURE__ */ e.jsx(
        ke,
        {
          icon: "🌐",
          label: "WAN Status",
          value: d === "online" ? "Online" : "Offline",
          status: d === "online" ? "normal" : "critical",
          statusMessage: d === "online" ? "Connected" : "Disconnected"
        }
      ),
      fe != null && /* @__PURE__ */ e.jsx(
        ke,
        {
          icon: "⏱️",
          label: "Uptime",
          value: Oe(fe),
          unit: " days",
          secondaryValue: Ae(fe) || void 0,
          status: "normal",
          statusMessage: "Running"
        }
      )
    ] }),
    qe && /* @__PURE__ */ e.jsxs("div", { className: "metric-cards-grid", children: [
      /* @__PURE__ */ e.jsx(
        ke,
        {
          icon: "🔴",
          label: "Recording",
          value: d === "online" ? "Active" : "Inactive",
          status: d === "online" ? "normal" : "inactive",
          statusMessage: d === "online" ? "Recording to cloud" : "Camera offline"
        }
      ),
      /* @__PURE__ */ e.jsx(
        ke,
        {
          icon: "👁️",
          label: "Motion Detection",
          value: "Enabled",
          status: "normal",
          statusMessage: "Monitoring"
        }
      )
    ] }),
    qe && /* @__PURE__ */ e.jsxs("div", { className: "info-card", style: { marginTop: "24px" }, children: [
      /* @__PURE__ */ e.jsxs(
        "div",
        {
          style: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px"
          },
          children: [
            /* @__PURE__ */ e.jsx("h3", { style: { margin: 0 }, children: "📹 Live View" }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                onClick: () => pe(!re),
                style: {
                  padding: "6px 12px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--card-border)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  fontSize: "13px"
                },
                children: "⚙️ Configure"
              }
            )
          ]
        }
      ),
      re && /* @__PURE__ */ e.jsxs(
        "div",
        {
          style: {
            background: "var(--bg-tertiary)",
            borderRadius: "var(--radius-md)",
            padding: "16px",
            marginBottom: "16px",
            border: "1px solid var(--card-border)"
          },
          children: [
            /* @__PURE__ */ e.jsx("h4", { style: { margin: "0 0 12px 0", fontSize: "14px" }, children: "🔗 Link to Camera Stream" }),
            /* @__PURE__ */ e.jsx(
              "p",
              {
                style: {
                  fontSize: "13px",
                  color: "var(--text-secondary)",
                  marginBottom: "12px"
                },
                children: "Select a camera entity to display live video. This can be the Meraki camera's RTSP stream via an NVR (like Blue Iris) or any other camera in Home Assistant."
              }
            ),
            /* @__PURE__ */ e.jsxs("div", { style: { display: "flex", gap: "8px", flexWrap: "wrap" }, children: [
              /* @__PURE__ */ e.jsxs(
                "select",
                {
                  value: U,
                  onChange: (c) => ie(c.target.value),
                  style: {
                    flex: 1,
                    minWidth: "200px",
                    padding: "8px 12px",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--card-border)",
                    background: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                    fontSize: "14px"
                  },
                  children: [
                    /* @__PURE__ */ e.jsx("option", { value: "", children: "-- Select camera entity --" }),
                    K.map((c) => /* @__PURE__ */ e.jsx("option", { value: c.entity_id, children: c.friendly_name }, c.entity_id))
                  ]
                }
              ),
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  onClick: () => Be(U),
                  style: {
                    padding: "8px 16px",
                    borderRadius: "var(--radius-sm)",
                    border: "none",
                    background: "var(--primary)",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: 500
                  },
                  children: "Save"
                }
              )
            ] }),
            U && /* @__PURE__ */ e.jsxs(
              "p",
              {
                style: {
                  fontSize: "12px",
                  color: "var(--success)",
                  marginTop: "8px",
                  marginBottom: 0
                },
                children: [
                  "✓ Linked to: ",
                  U
                ]
              }
            ),
            o.rtsp_url && /* @__PURE__ */ e.jsxs(
              "div",
              {
                style: {
                  marginTop: "12px",
                  padding: "8px 12px",
                  background: "var(--bg-secondary)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "12px"
                },
                children: [
                  /* @__PURE__ */ e.jsx("strong", { children: "RTSP URL:" }),
                  " ",
                  /* @__PURE__ */ e.jsx(
                    "code",
                    {
                      style: {
                        fontFamily: "monospace",
                        color: "var(--text-secondary)"
                      },
                      children: o.rtsp_url
                    }
                  )
                ]
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ e.jsxs(
        "div",
        {
          style: {
            background: "#000",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            position: "relative",
            width: "100%",
            maxWidth: "100%",
            aspectRatio: "16/9",
            marginBottom: "16px"
          },
          children: [
            (N || T) && /* @__PURE__ */ e.jsxs(
              "div",
              {
                style: {
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-muted)",
                  zIndex: 10
                },
                children: [
                  "⏳ Loading",
                  " ",
                  N ? "linked camera" : "RTSP stream",
                  "..."
                ]
              }
            ),
            $ === "linked" && ye && /* @__PURE__ */ e.jsx(
              "img",
              {
                src: ye,
                alt: `Live view: ${ne || he}`,
                style: {
                  width: "100%",
                  height: "100%",
                  objectFit: "contain"
                },
                onError: () => {
                  console.error(
                    "Linked camera stream failed, trying fallback"
                  ), ge(null), H(!0), o != null && o.rtsp_url || o != null && o.rtspEnabled ? Se() : B(f ? "snapshot" : "none");
                }
              }
            ),
            $ === "rtsp" && ce && /* @__PURE__ */ e.jsxs(
              "div",
              {
                style: {
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-muted)",
                  gap: "12px"
                },
                children: [
                  /* @__PURE__ */ e.jsx("span", { style: { fontSize: "48px" }, children: "🎥" }),
                  /* @__PURE__ */ e.jsx("span", { children: "RTSP Stream Available" }),
                  /* @__PURE__ */ e.jsx(
                    "code",
                    {
                      style: {
                        fontSize: "11px",
                        padding: "8px 12px",
                        background: "rgba(255,255,255,0.1)",
                        borderRadius: "var(--radius-sm)",
                        maxWidth: "90%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      },
                      children: ce
                    }
                  ),
                  /* @__PURE__ */ e.jsx("span", { style: { fontSize: "12px", opacity: 0.7 }, children: "Open this URL in VLC or a compatible player" })
                ]
              }
            ),
            $ === "snapshot" && f && /* @__PURE__ */ e.jsx(
              "img",
              {
                src: f,
                alt: `${ne || he} snapshot`,
                style: {
                  width: "100%",
                  height: "100%",
                  objectFit: "contain"
                }
              }
            ),
            $ === "none" && !N && !T && /* @__PURE__ */ e.jsxs(
              "div",
              {
                style: {
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-muted)",
                  gap: "12px"
                },
                children: [
                  /* @__PURE__ */ e.jsx("span", { style: { fontSize: "48px" }, children: "📹" }),
                  /* @__PURE__ */ e.jsx("span", { children: "No live stream available" }),
                  /* @__PURE__ */ e.jsxs(
                    "div",
                    {
                      style: { display: "flex", gap: "8px", flexWrap: "wrap" },
                      children: [
                        /* @__PURE__ */ e.jsx(
                          "button",
                          {
                            onClick: () => Re(),
                            style: {
                              padding: "8px 16px",
                              borderRadius: "var(--radius-sm)",
                              border: "none",
                              background: "var(--primary)",
                              color: "white",
                              cursor: "pointer",
                              fontSize: "13px"
                            },
                            children: "🔄 Retry"
                          }
                        ),
                        /* @__PURE__ */ e.jsx(
                          "button",
                          {
                            onClick: () => pe(!0),
                            style: {
                              padding: "8px 16px",
                              borderRadius: "var(--radius-sm)",
                              border: "1px solid var(--border)",
                              background: "transparent",
                              color: "var(--text-primary)",
                              cursor: "pointer",
                              fontSize: "13px"
                            },
                            children: "⚙️ Link Camera"
                          }
                        )
                      ]
                    }
                  )
                ]
              }
            ),
            $ !== "none" && !N && !T && /* @__PURE__ */ e.jsxs(
              "div",
              {
                style: {
                  position: "absolute",
                  top: "8px",
                  left: "8px",
                  padding: "4px 8px",
                  borderRadius: "var(--radius-sm)",
                  background: "rgba(0,0,0,0.6)",
                  color: "white",
                  fontSize: "11px",
                  fontWeight: 500,
                  textTransform: "uppercase"
                },
                children: [
                  $ === "linked" && "● Live",
                  $ === "rtsp" && "● RTSP",
                  $ === "snapshot" && "📷 Snapshot"
                ]
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ e.jsxs(
        "div",
        {
          style: {
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            flexWrap: "wrap"
          },
          children: [
            /* @__PURE__ */ e.jsx(
              "button",
              {
                onClick: () => Re(),
                disabled: N || T,
                style: {
                  padding: "10px 20px",
                  borderRadius: "var(--radius-md)",
                  border: "none",
                  background: "var(--primary)",
                  color: "white",
                  cursor: N || T ? "wait" : "pointer",
                  fontWeight: 500
                },
                children: N || T ? "⏳ Loading..." : "🔄 Refresh Stream"
              }
            ),
            $ === "linked" && U && /* @__PURE__ */ e.jsx(
              "button",
              {
                onClick: () => er(U),
                style: {
                  padding: "10px 20px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--card-border)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                  fontWeight: 500
                },
                children: "📺 Full Screen"
              }
            ),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                onClick: rr,
                disabled: L,
                style: {
                  padding: "10px 20px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--card-border)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  cursor: L ? "wait" : "pointer",
                  fontWeight: 500
                },
                children: L ? "⏳..." : "📷 Snapshot"
              }
            ),
            /* @__PURE__ */ e.jsxs(
              "button",
              {
                onClick: () => pe(!0),
                style: {
                  padding: "10px 20px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--card-border)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                  fontWeight: 500
                },
                children: [
                  "⚙️ ",
                  U ? "Change" : "Link",
                  " Camera"
                ]
              }
            ),
            z && /* @__PURE__ */ e.jsx(
              "button",
              {
                onClick: cr,
                style: {
                  padding: "10px 20px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--card-border)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                  fontWeight: 500
                },
                children: "🌐 Meraki Dashboard"
              }
            )
          ]
        }
      ),
      U && /* @__PURE__ */ e.jsxs(
        "div",
        {
          style: {
            marginTop: "12px",
            textAlign: "center",
            fontSize: "12px",
            color: "var(--text-muted)"
          },
          children: [
            "Streaming from: ",
            U
          ]
        }
      )
    ] }),
    Ce && Z.length > 0 && /* @__PURE__ */ e.jsx(
      qr,
      {
        deviceName: ne || he,
        model: te,
        ports: Z,
        clients: y,
        onClientClick: (c) => {
          const p = `/config/devices/device/${c}`, ae = new CustomEvent("hass-navigate", {
            detail: { path: p },
            bubbles: !0,
            composed: !0
          });
          window.dispatchEvent(ae);
        }
      }
    ),
    Je && E && /* @__PURE__ */ e.jsxs("div", { className: "readings-grid", children: [
      E.temperature != null && /* @__PURE__ */ e.jsx(
        Me,
        {
          type: "temperature",
          value: E.temperature,
          temperatureUnit: M,
          status: "normal",
          lastUpdated: _ == null ? void 0 : _.last_updated,
          dataSource: _ == null ? void 0 : _.data_source
        }
      ),
      E.humidity != null && /* @__PURE__ */ e.jsx(
        Me,
        {
          type: "humidity",
          value: E.humidity,
          status: "normal",
          lastUpdated: _ == null ? void 0 : _.last_updated,
          dataSource: _ == null ? void 0 : _.data_source
        }
      ),
      E.indoorAirQuality != null && /* @__PURE__ */ e.jsx(
        Me,
        {
          type: "indoorAirQuality",
          value: E.indoorAirQuality,
          status: E.indoorAirQuality >= 70 ? "normal" : E.indoorAirQuality >= 50 ? "warning" : "critical",
          lastUpdated: _ == null ? void 0 : _.last_updated,
          dataSource: _ == null ? void 0 : _.data_source
        }
      ),
      E.tvoc != null && /* @__PURE__ */ e.jsx(
        Me,
        {
          type: "tvoc",
          value: E.tvoc,
          status: E.tvoc <= 400 ? "normal" : E.tvoc <= 800 ? "warning" : "critical",
          lastUpdated: _ == null ? void 0 : _.last_updated,
          dataSource: _ == null ? void 0 : _.data_source
        }
      ),
      E.pm25 != null && /* @__PURE__ */ e.jsx(
        Me,
        {
          type: "pm25",
          value: E.pm25,
          status: E.pm25 <= 35 ? "normal" : E.pm25 <= 75 ? "warning" : "critical",
          lastUpdated: _ == null ? void 0 : _.last_updated,
          dataSource: _ == null ? void 0 : _.data_source
        }
      ),
      E.co2 != null && /* @__PURE__ */ e.jsx(
        Me,
        {
          type: "co2",
          value: E.co2,
          status: E.co2 <= 1e3 ? "normal" : E.co2 <= 2e3 ? "warning" : "critical",
          lastUpdated: _ == null ? void 0 : _.last_updated,
          dataSource: _ == null ? void 0 : _.data_source
        }
      ),
      E.noise != null && /* @__PURE__ */ e.jsx(
        Me,
        {
          type: "noise",
          value: E.noise,
          status: E.noise <= 60 ? "normal" : E.noise <= 80 ? "warning" : "critical",
          lastUpdated: _ == null ? void 0 : _.last_updated,
          dataSource: _ == null ? void 0 : _.data_source
        }
      )
    ] }),
    X.length > 0 && /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "info-card",
        style: { borderLeft: "4px solid var(--warning)" },
        children: [
          /* @__PURE__ */ e.jsx("h3", { children: "⚠️ Status Messages" }),
          /* @__PURE__ */ e.jsx(
            "ul",
            {
              style: {
                margin: 0,
                paddingLeft: "20px",
                color: "var(--text-secondary)"
              },
              children: X.map((c, p) => /* @__PURE__ */ e.jsx("li", { style: { marginBottom: "8px" }, children: c }, p))
            }
          )
        ]
      }
    ),
    Ue.length > 0 && !Ce && /* @__PURE__ */ e.jsxs("div", { className: "info-card", children: [
      /* @__PURE__ */ e.jsxs("h3", { children: [
        "🔗 Entities (",
        Ue.length,
        ")"
      ] }),
      /* @__PURE__ */ e.jsxs("table", { className: "device-table", children: [
        /* @__PURE__ */ e.jsx("thead", { children: /* @__PURE__ */ e.jsxs("tr", { children: [
          /* @__PURE__ */ e.jsx("th", { children: "Name" }),
          /* @__PURE__ */ e.jsx("th", { children: "Entity ID" }),
          /* @__PURE__ */ e.jsx("th", { children: "State" })
        ] }) }),
        /* @__PURE__ */ e.jsx("tbody", { children: Ue.map((c) => /* @__PURE__ */ e.jsx(
          tt,
          {
            entity: c,
            onClick: () => er(c.entity_id)
          },
          c.entity_id
        )) })
      ] })
    ] }),
    y.length > 0 && !Ce && /* @__PURE__ */ e.jsxs("div", { className: "info-card", children: [
      /* @__PURE__ */ e.jsxs("h3", { children: [
        "👥 Connected Clients (",
        y.length,
        ")"
      ] }),
      /* @__PURE__ */ e.jsxs("table", { className: "device-table", children: [
        /* @__PURE__ */ e.jsx("thead", { children: /* @__PURE__ */ e.jsxs("tr", { children: [
          /* @__PURE__ */ e.jsx("th", { children: "Client" }),
          /* @__PURE__ */ e.jsx("th", { children: "IP Address" }),
          /* @__PURE__ */ e.jsx("th", { children: "Connection" })
        ] }) }),
        /* @__PURE__ */ e.jsx("tbody", { children: y.slice(0, 10).map((c) => /* @__PURE__ */ e.jsx(
          at,
          {
            client: c,
            onClick: () => {
              if (c.ha_device_id) {
                const p = `/config/devices/device/${c.ha_device_id}`, ae = new CustomEvent("hass-navigate", {
                  detail: { path: p },
                  bubbles: !0,
                  composed: !0
                });
                window.dispatchEvent(ae);
              }
            }
          },
          c.id || c.mac
        )) })
      ] }),
      y.length > 10 && /* @__PURE__ */ e.jsxs(
        "div",
        {
          style: {
            textAlign: "center",
            padding: "12px",
            color: "var(--text-muted)",
            fontSize: "13px"
          },
          children: [
            "Showing 10 of ",
            y.length,
            " clients •",
            " ",
            /* @__PURE__ */ e.jsx(
              "button",
              {
                onClick: () => a({ view: "clients" }),
                style: {
                  background: "none",
                  border: "none",
                  color: "var(--primary)",
                  cursor: "pointer",
                  fontWeight: 500,
                  fontSize: "13px"
                },
                children: "View All Clients"
              }
            )
          ]
        }
      )
    ] }),
    Fe && /* @__PURE__ */ e.jsxs("div", { className: "info-card", children: [
      /* @__PURE__ */ e.jsx("h3", { children: "📶 Wireless Access Point" }),
      o.basicServiceSets && o.basicServiceSets.length > 0 ? /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsxs("table", { className: "device-table", style: { marginTop: "16px" }, children: [
          /* @__PURE__ */ e.jsx("thead", { children: /* @__PURE__ */ e.jsxs("tr", { children: [
            /* @__PURE__ */ e.jsx("th", { children: "SSID" }),
            /* @__PURE__ */ e.jsx("th", { children: "Band" }),
            /* @__PURE__ */ e.jsx("th", { children: "Channel" }),
            /* @__PURE__ */ e.jsx("th", { children: "Width" }),
            /* @__PURE__ */ e.jsx("th", { children: "Power" }),
            /* @__PURE__ */ e.jsx("th", { children: "Status" })
          ] }) }),
          /* @__PURE__ */ e.jsx("tbody", { children: o.basicServiceSets.filter((c) => c.enabled).map((c, p) => /* @__PURE__ */ e.jsx(st, { bss: c, index: p }, `bss-${p}`)) })
        ] }),
        o.basicServiceSets.filter((c) => !c.enabled).length > 0 && /* @__PURE__ */ e.jsxs(
          "div",
          {
            style: {
              marginTop: "12px",
              fontSize: "13px",
              color: "var(--text-muted)"
            },
            children: [
              o.basicServiceSets.filter((c) => !c.enabled).length,
              " ",
              "disabled SSIDs not shown"
            ]
          }
        )
      ] }) : /* @__PURE__ */ e.jsxs("div", { className: "info-grid", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "info-item", children: [
          /* @__PURE__ */ e.jsx("div", { className: "label", children: "Connected Clients" }),
          /* @__PURE__ */ e.jsx("div", { className: "value primary", children: y.length })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "info-item", children: [
          /* @__PURE__ */ e.jsx("div", { className: "label", children: "Radio Bands" }),
          /* @__PURE__ */ e.jsx("div", { className: "value", children: "2.4 GHz / 5 GHz" })
        ] })
      ] })
    ] })
  ] });
}, nt = ee(it, (r, a) => {
  var l, n, x, g;
  if (r.activeView.deviceId !== a.activeView.deviceId)
    return !1;
  const i = r.data.devices.find(
    (m) => m.serial === r.activeView.deviceId
  ), s = a.data.devices.find(
    (m) => m.serial === a.activeView.deviceId
  );
  return !((i == null ? void 0 : i.status) !== (s == null ? void 0 : s.status) || ((l = i == null ? void 0 : i.ports_statuses) == null ? void 0 : l.length) !== ((n = s == null ? void 0 : s.ports_statuses) == null ? void 0 : n.length) || ((x = r.clients) == null ? void 0 : x.length) !== ((g = a.clients) == null ? void 0 : g.length));
}), mr = (r) => {
  if (r === 0) return "0 B";
  const a = 1024, i = ["B", "KB", "MB", "GB", "TB"], s = Math.floor(Math.log(r) / Math.log(a));
  return parseFloat((r / Math.pow(a, s)).toFixed(2)) + " " + i[s];
}, wr = (r) => r ? new Date(r).toLocaleString() : "—", ot = (r) => {
  var s, l;
  const a = ((s = r.os) == null ? void 0 : s.toLowerCase()) || "", i = ((l = r.manufacturer) == null ? void 0 : l.toLowerCase()) || "";
  return a.includes("ios") || i.includes("apple") || a.includes("android") ? "📱" : a.includes("windows") ? "💻" : a.includes("mac") ? "🖥️" : a.includes("linux") ? "🐧" : i.includes("amazon") || i.includes("roku") || i.includes("samsung") ? "📺" : i.includes("sonos") ? "🔊" : "🔌";
}, lt = ({
  client: r,
  onBack: a,
  onNavigateToDevice: i
}) => {
  const s = r.ssid ? "wireless" : r.switchport ? "wired" : "unknown";
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("button", { onClick: a, className: "back-button", children: "← Back to Clients" }),
    /* @__PURE__ */ e.jsxs("div", { className: "device-header", children: [
      /* @__PURE__ */ e.jsx("div", { className: "device-icon device-icon-gradient text-4xl", children: ot(r) }),
      /* @__PURE__ */ e.jsxs("div", { className: "device-info", children: [
        /* @__PURE__ */ e.jsx("h1", { children: r.description || r.mac }),
        /* @__PURE__ */ e.jsxs("div", { className: "meta", children: [
          /* @__PURE__ */ e.jsx(
            "span",
            {
              className: `status-badge ${r.status === "Online" ? "status-online" : "status-offline"}`,
              children: r.status || "Unknown"
            }
          ),
          r.is_blocked && /* @__PURE__ */ e.jsx("span", { className: "status-badge status-alerting", children: "Blocked" }),
          /* @__PURE__ */ e.jsx("span", { className: "detail-badge", children: s === "wireless" ? "📶 Wireless" : "🔌 Wired" })
        ] })
      ] }),
      i && r.ha_device_id && /* @__PURE__ */ e.jsx(
        "button",
        {
          onClick: i,
          className: "btn btn-primary",
          style: { marginLeft: "auto" },
          children: "View in Home Assistant →"
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "detail-grid",
        style: {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1rem",
          marginTop: "1.5rem"
        },
        children: [
          /* @__PURE__ */ e.jsxs("div", { className: "network-card", children: [
            /* @__PURE__ */ e.jsx("h3", { className: "section-title", children: "📡 Network Information" }),
            /* @__PURE__ */ e.jsxs("div", { className: "detail-list", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "detail-item", children: [
                /* @__PURE__ */ e.jsx("span", { className: "detail-label", children: "IP Address" }),
                /* @__PURE__ */ e.jsx("span", { className: "detail-value text-mono", children: r.ip || "—" })
              ] }),
              r.ip6 && /* @__PURE__ */ e.jsxs("div", { className: "detail-item", children: [
                /* @__PURE__ */ e.jsx("span", { className: "detail-label", children: "IPv6 Address" }),
                /* @__PURE__ */ e.jsx("span", { className: "detail-value text-mono text-sm", children: r.ip6 })
              ] }),
              /* @__PURE__ */ e.jsxs("div", { className: "detail-item", children: [
                /* @__PURE__ */ e.jsx("span", { className: "detail-label", children: "MAC Address" }),
                /* @__PURE__ */ e.jsx("span", { className: "detail-value text-mono", children: r.mac })
              ] }),
              r.vlan !== void 0 && /* @__PURE__ */ e.jsxs("div", { className: "detail-item", children: [
                /* @__PURE__ */ e.jsx("span", { className: "detail-label", children: "VLAN" }),
                /* @__PURE__ */ e.jsx("span", { className: "detail-value", children: r.vlan })
              ] }),
              r.networkId && /* @__PURE__ */ e.jsxs("div", { className: "detail-item", children: [
                /* @__PURE__ */ e.jsx("span", { className: "detail-label", children: "Network ID" }),
                /* @__PURE__ */ e.jsx("span", { className: "detail-value text-mono text-sm", children: r.networkId })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "network-card", children: [
            /* @__PURE__ */ e.jsx("h3", { className: "section-title", children: "🔗 Connection" }),
            /* @__PURE__ */ e.jsxs("div", { className: "detail-list", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "detail-item", children: [
                /* @__PURE__ */ e.jsx("span", { className: "detail-label", children: "Connection Type" }),
                /* @__PURE__ */ e.jsx("span", { className: "detail-value", children: s === "wireless" ? "📶 Wireless" : s === "wired" ? "🔌 Wired" : "—" })
              ] }),
              r.ssid && /* @__PURE__ */ e.jsxs("div", { className: "detail-item", children: [
                /* @__PURE__ */ e.jsx("span", { className: "detail-label", children: "SSID" }),
                /* @__PURE__ */ e.jsx("span", { className: "detail-value", children: r.ssid })
              ] }),
              r.switchport && /* @__PURE__ */ e.jsxs("div", { className: "detail-item", children: [
                /* @__PURE__ */ e.jsx("span", { className: "detail-label", children: "Switchport" }),
                /* @__PURE__ */ e.jsxs("span", { className: "detail-value", children: [
                  "Port ",
                  r.switchport
                ] })
              ] }),
              r.recentDeviceName && /* @__PURE__ */ e.jsxs("div", { className: "detail-item", children: [
                /* @__PURE__ */ e.jsx("span", { className: "detail-label", children: "Connected To" }),
                /* @__PURE__ */ e.jsx("span", { className: "detail-value", children: r.recentDeviceName })
              ] }),
              r.recentDeviceSerial && /* @__PURE__ */ e.jsxs("div", { className: "detail-item", children: [
                /* @__PURE__ */ e.jsx("span", { className: "detail-label", children: "Device Serial" }),
                /* @__PURE__ */ e.jsx("span", { className: "detail-value text-mono", children: r.recentDeviceSerial })
              ] }),
              r.recentDeviceMac && /* @__PURE__ */ e.jsxs("div", { className: "detail-item", children: [
                /* @__PURE__ */ e.jsx("span", { className: "detail-label", children: "Device MAC" }),
                /* @__PURE__ */ e.jsx("span", { className: "detail-value text-mono", children: r.recentDeviceMac })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "network-card", children: [
            /* @__PURE__ */ e.jsx("h3", { className: "section-title", children: "📋 Device Information" }),
            /* @__PURE__ */ e.jsxs("div", { className: "detail-list", children: [
              r.manufacturer && /* @__PURE__ */ e.jsxs("div", { className: "detail-item", children: [
                /* @__PURE__ */ e.jsx("span", { className: "detail-label", children: "Manufacturer" }),
                /* @__PURE__ */ e.jsx("span", { className: "detail-value", children: r.manufacturer })
              ] }),
              r.os && /* @__PURE__ */ e.jsxs("div", { className: "detail-item", children: [
                /* @__PURE__ */ e.jsx("span", { className: "detail-label", children: "Operating System" }),
                /* @__PURE__ */ e.jsx("span", { className: "detail-value", children: r.os })
              ] }),
              r.user && /* @__PURE__ */ e.jsxs("div", { className: "detail-item", children: [
                /* @__PURE__ */ e.jsx("span", { className: "detail-label", children: "User" }),
                /* @__PURE__ */ e.jsx("span", { className: "detail-value", children: r.user })
              ] }),
              r.description && r.description !== r.mac && /* @__PURE__ */ e.jsxs("div", { className: "detail-item", children: [
                /* @__PURE__ */ e.jsx("span", { className: "detail-label", children: "Hostname" }),
                /* @__PURE__ */ e.jsx("span", { className: "detail-value", children: r.description })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "network-card", children: [
            /* @__PURE__ */ e.jsx("h3", { className: "section-title", children: "📊 Usage Statistics" }),
            /* @__PURE__ */ e.jsxs("div", { className: "detail-list", children: [
              r.usage && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                /* @__PURE__ */ e.jsxs("div", { className: "detail-item", children: [
                  /* @__PURE__ */ e.jsx("span", { className: "detail-label", children: "Data Sent" }),
                  /* @__PURE__ */ e.jsxs("span", { className: "detail-value", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-success", children: "↑" }),
                    " ",
                    mr(r.usage.sent)
                  ] })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "detail-item", children: [
                  /* @__PURE__ */ e.jsx("span", { className: "detail-label", children: "Data Received" }),
                  /* @__PURE__ */ e.jsxs("span", { className: "detail-value", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-info", children: "↓" }),
                    " ",
                    mr(r.usage.recv)
                  ] })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "detail-item", children: [
                  /* @__PURE__ */ e.jsx("span", { className: "detail-label", children: "Total Usage" }),
                  /* @__PURE__ */ e.jsx("span", { className: "detail-value", children: mr(r.usage.sent + r.usage.recv) })
                ] })
              ] }),
              !r.usage && /* @__PURE__ */ e.jsxs("div", { className: "detail-item", children: [
                /* @__PURE__ */ e.jsx("span", { className: "detail-label", children: "Usage" }),
                /* @__PURE__ */ e.jsx("span", { className: "detail-value text-muted", children: "No data available" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "network-card", children: [
            /* @__PURE__ */ e.jsx("h3", { className: "section-title", children: "🕐 Timeline" }),
            /* @__PURE__ */ e.jsxs("div", { className: "detail-list", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "detail-item", children: [
                /* @__PURE__ */ e.jsx("span", { className: "detail-label", children: "First Seen" }),
                /* @__PURE__ */ e.jsx("span", { className: "detail-value", children: wr(r.firstSeen) })
              ] }),
              /* @__PURE__ */ e.jsxs("div", { className: "detail-item", children: [
                /* @__PURE__ */ e.jsx("span", { className: "detail-label", children: "Last Seen" }),
                /* @__PURE__ */ e.jsx("span", { className: "detail-value", children: wr(r.lastSeen) })
              ] })
            ] })
          ] })
        ]
      }
    )
  ] });
}, ct = ee(lt), zr = ee(
  ({ client: r, onClick: a, getClientIcon: i, formatBytes: s }) => /* @__PURE__ */ e.jsxs("tr", { className: "device-row", onClick: a, children: [
    /* @__PURE__ */ e.jsx("td", { children: /* @__PURE__ */ e.jsxs("div", { className: "device-name-cell", children: [
      /* @__PURE__ */ e.jsx("div", { className: "device-icon text-xl", children: i(r) }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("span", { className: "name", children: r.description || r.mac }),
        r.os && /* @__PURE__ */ e.jsx("div", { className: "text-sm text-muted", children: r.os })
      ] })
    ] }) }),
    /* @__PURE__ */ e.jsx("td", { className: "device-model", children: r.ip || "—" }),
    /* @__PURE__ */ e.jsx("td", { className: "device-model text-mono text-sm", children: r.mac }),
    /* @__PURE__ */ e.jsx("td", { className: "device-model", children: r.manufacturer || "—" }),
    /* @__PURE__ */ e.jsx("td", { children: /* @__PURE__ */ e.jsx("span", { className: "detail-badge", children: r.ssid || r.switchport || "—" }) }),
    /* @__PURE__ */ e.jsx("td", { children: r.usage ? /* @__PURE__ */ e.jsxs("span", { className: "text-sm", children: [
      "↑",
      s(r.usage.sent),
      " ↓",
      s(r.usage.recv)
    ] }) : "—" })
  ] }),
  (r, a) => {
    var l, n, x, g;
    const i = r.client, s = a.client;
    return !(i.id !== s.id || i.mac !== s.mac || i.ip !== s.ip || i.description !== s.description || i.status !== s.status || i.ssid !== s.ssid || i.switchport !== s.switchport || ((l = i.usage) == null ? void 0 : l.sent) !== ((n = s.usage) == null ? void 0 : n.sent) || ((x = i.usage) == null ? void 0 : x.recv) !== ((g = s.usage) == null ? void 0 : g.recv));
  }
);
zr.displayName = "ClientRow";
const dt = ({
  clients: r,
  onBack: a,
  initialClientId: i
}) => {
  const [s, l] = ue(""), [n, x] = ue(
    i || null
  ), g = n && r.find(
    (f) => f.id === n || f.mac === n
  ) || null, m = xe((f) => {
    x(f.id || f.mac);
  }, []), M = xe((f) => {
    if (f.ha_device_id) {
      const C = `/config/devices/device/${f.ha_device_id}`, L = new CustomEvent("hass-navigate", {
        detail: { path: C },
        bubbles: !0,
        composed: !0
      });
      window.dispatchEvent(L);
    } else
      console.warn("Cannot navigate: client is missing ha_device_id", f);
  }, []), o = r.filter((f) => {
    var L, P, z, W, K, J;
    const C = s.toLowerCase();
    return ((L = f.description) == null ? void 0 : L.toLowerCase().includes(C)) || ((P = f.mac) == null ? void 0 : P.toLowerCase().includes(C)) || ((z = f.ip) == null ? void 0 : z.toLowerCase().includes(C)) || ((W = f.manufacturer) == null ? void 0 : W.toLowerCase().includes(C)) || ((K = f.user) == null ? void 0 : K.toLowerCase().includes(C)) || ((J = f.os) == null ? void 0 : J.toLowerCase().includes(C));
  }), h = xe((f) => {
    if (f === 0) return "0 B";
    const C = 1024, L = ["B", "KB", "MB", "GB", "TB"], P = Math.floor(Math.log(f) / Math.log(C));
    return parseFloat((f / Math.pow(C, P)).toFixed(2)) + " " + L[P];
  }, []);
  xe((f) => f ? new Date(f).toLocaleString() : "—", []);
  const y = xe((f) => {
    var P, z;
    const C = ((P = f.os) == null ? void 0 : P.toLowerCase()) || "", L = ((z = f.manufacturer) == null ? void 0 : z.toLowerCase()) || "";
    return C.includes("ios") || L.includes("apple") || C.includes("android") ? "📱" : C.includes("windows") ? "💻" : C.includes("mac") ? "🖥️" : C.includes("linux") ? "🐧" : L.includes("amazon") || L.includes("roku") || L.includes("samsung") ? "📺" : "🔌";
  }, []);
  return g ? /* @__PURE__ */ e.jsx(
    ct,
    {
      client: g,
      onBack: () => x(null),
      onNavigateToDevice: () => M(g)
    }
  ) : /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("button", { onClick: a, className: "back-button", children: "← Back to Dashboard" }),
    /* @__PURE__ */ e.jsxs("div", { className: "device-header", children: [
      /* @__PURE__ */ e.jsx("div", { className: "device-icon device-icon-gradient", children: "👥" }),
      /* @__PURE__ */ e.jsxs("div", { className: "device-info", children: [
        /* @__PURE__ */ e.jsx("h1", { children: "Connected Clients" }),
        /* @__PURE__ */ e.jsx("div", { className: "meta", children: /* @__PURE__ */ e.jsxs("span", { children: [
          r.length,
          " total clients"
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "mb-5", children: /* @__PURE__ */ e.jsx(
      "input",
      {
        type: "text",
        placeholder: "Search clients by name, MAC, IP, manufacturer...",
        value: s,
        onChange: (f) => l(f.target.value),
        className: "search-input"
      }
    ) }),
    /* @__PURE__ */ e.jsx("div", { className: "network-card", children: /* @__PURE__ */ e.jsxs("table", { className: "device-table", children: [
      /* @__PURE__ */ e.jsx("thead", { children: /* @__PURE__ */ e.jsxs("tr", { children: [
        /* @__PURE__ */ e.jsx("th", { children: "Client" }),
        /* @__PURE__ */ e.jsx("th", { children: "IP Address" }),
        /* @__PURE__ */ e.jsx("th", { children: "MAC Address" }),
        /* @__PURE__ */ e.jsx("th", { children: "Manufacturer" }),
        /* @__PURE__ */ e.jsx("th", { children: "SSID / Port" }),
        /* @__PURE__ */ e.jsx("th", { children: "Usage" })
      ] }) }),
      /* @__PURE__ */ e.jsxs("tbody", { children: [
        o.map((f) => /* @__PURE__ */ e.jsx(
          zr,
          {
            client: f,
            onClick: () => m(f),
            getClientIcon: y,
            formatBytes: h
          },
          f.id || f.mac
        )),
        o.length === 0 && /* @__PURE__ */ e.jsx("tr", { children: /* @__PURE__ */ e.jsx("td", { colSpan: 6, className: "empty-state-message", children: s ? "No clients match your search" : "No clients found" }) })
      ] })
    ] }) })
  ] });
}, ut = ee(dt, (r, a) => {
  if (r.clients.length !== a.clients.length)
    return !1;
  const i = r.clients.map((l) => l.id).join("|"), s = a.clients.map((l) => l.id).join("|");
  return i === s;
}), Dr = ee(
  ({ ssid: r, clientCount: a, onClick: i }) => /* @__PURE__ */ e.jsxs(
    "tr",
    {
      onClick: i,
      className: "device-row",
      children: [
        /* @__PURE__ */ e.jsx("td", { children: /* @__PURE__ */ e.jsxs("div", { className: "ssid-name-cell", children: [
          /* @__PURE__ */ e.jsx("span", { className: "ssid-icon", children: r.enabled ? "🔒" : "📶" }),
          /* @__PURE__ */ e.jsx("span", { className: "ssid-name", children: r.name })
        ] }) }),
        /* @__PURE__ */ e.jsx("td", { children: /* @__PURE__ */ e.jsxs("span", { className: "number-badge", children: [
          "#",
          r.number
        ] }) }),
        /* @__PURE__ */ e.jsx("td", { children: /* @__PURE__ */ e.jsxs(
          "span",
          {
            className: `status-badge ${r.enabled ? "enabled" : "disabled"}`,
            children: [
              /* @__PURE__ */ e.jsx("span", { className: "dot" }),
              r.enabled ? "Broadcasting" : "Disabled"
            ]
          }
        ) }),
        /* @__PURE__ */ e.jsx("td", { children: a > 0 ? /* @__PURE__ */ e.jsxs("span", { className: "client-count text-primary", children: [
          a,
          " ",
          a === 1 ? "client" : "clients"
        ] }) : /* @__PURE__ */ e.jsx("span", { className: "text-muted", children: "No clients" }) }),
        /* @__PURE__ */ e.jsx("td", { className: "arrow-cell", children: /* @__PURE__ */ e.jsx("span", { className: "arrow-indicator", children: "→" }) })
      ]
    },
    `${r.networkId}-${r.number}`
  ),
  (r, a) => !(r.ssid.number !== a.ssid.number || r.ssid.networkId !== a.ssid.networkId || r.ssid.enabled !== a.ssid.enabled || r.ssid.name !== a.ssid.name || r.clientCount !== a.clientCount)
);
Dr.displayName = "SSIDRow";
const pt = ({
  ssids: r,
  clients: a,
  networks: i,
  onBack: s,
  onSSIDClick: l
}) => {
  const n = r.reduce(
    (o, h) => {
      const y = h.networkId || "unknown";
      return o[y] || (o[y] = []), o[y].push(h), o;
    },
    {}
  ), x = xe(
    (o) => {
      const h = i.find((y) => y.id === o);
      return (h == null ? void 0 : h.name) || o;
    },
    [i]
  ), g = xe(
    (o) => a.filter((h) => h.ssid === o).length,
    [a]
  ), m = r.filter((o) => o.enabled).length, M = r.reduce(
    (o, h) => o + g(h.name),
    0
  );
  return /* @__PURE__ */ e.jsxs("div", { className: "ssids-list-view", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "view-header", children: [
      /* @__PURE__ */ e.jsx("button", { className: "back-button", onClick: s, children: "← Back" }),
      /* @__PURE__ */ e.jsx("div", { className: "view-header-content", children: /* @__PURE__ */ e.jsxs("div", { className: "view-header-title", children: [
        /* @__PURE__ */ e.jsx("span", { className: "view-header-icon", children: "📶" }),
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("h2", { children: "Wireless Networks" }),
          /* @__PURE__ */ e.jsxs("div", { className: "meta-info view-header-stats", children: [
            /* @__PURE__ */ e.jsxs("span", { children: [
              r.length,
              " SSIDs"
            ] }),
            /* @__PURE__ */ e.jsx("span", { className: "separator", children: "•" }),
            /* @__PURE__ */ e.jsxs("span", { className: "text-success", children: [
              m,
              " active"
            ] }),
            /* @__PURE__ */ e.jsx("span", { className: "separator", children: "•" }),
            /* @__PURE__ */ e.jsxs("span", { children: [
              M,
              " connected clients"
            ] })
          ] })
        ] })
      ] }) })
    ] }),
    Object.entries(n).map(([o, h]) => /* @__PURE__ */ e.jsxs("div", { className: "card ssid-network-card", children: [
      /* @__PURE__ */ e.jsx("div", { className: "card-header", children: /* @__PURE__ */ e.jsxs("h3", { children: [
        /* @__PURE__ */ e.jsx("span", { children: "🌐" }),
        x(o),
        /* @__PURE__ */ e.jsxs("span", { className: "text-muted ssid-count", children: [
          "(",
          h.length,
          " SSIDs)"
        ] })
      ] }) }),
      /* @__PURE__ */ e.jsx("div", { className: "card-content", children: /* @__PURE__ */ e.jsxs("table", { className: "device-table", children: [
        /* @__PURE__ */ e.jsx("thead", { children: /* @__PURE__ */ e.jsxs("tr", { children: [
          /* @__PURE__ */ e.jsx("th", { children: "SSID" }),
          /* @__PURE__ */ e.jsx("th", { children: "Number" }),
          /* @__PURE__ */ e.jsx("th", { children: "Status" }),
          /* @__PURE__ */ e.jsx("th", { children: "Connected Clients" }),
          /* @__PURE__ */ e.jsx("th", {})
        ] }) }),
        /* @__PURE__ */ e.jsx("tbody", { children: h.map((y) => /* @__PURE__ */ e.jsx(
          Dr,
          {
            ssid: y,
            clientCount: g(y.name),
            onClick: () => l(y)
          },
          `${y.networkId}-${y.number}`
        )) })
      ] }) })
    ] }, o)),
    r.length === 0 && /* @__PURE__ */ e.jsxs("div", { className: "empty-state-message", children: [
      /* @__PURE__ */ e.jsx("div", { className: "empty-icon", children: "📶" }),
      /* @__PURE__ */ e.jsx("h3", { children: "No SSIDs Found" }),
      /* @__PURE__ */ e.jsx("p", { children: "No wireless networks are configured in your Meraki organization." })
    ] })
  ] });
}, mt = ee(pt, (r, a) => {
  if (r.ssids.length !== a.ssids.length || r.clients.length !== a.clients.length) return !1;
  const i = r.ssids.filter((l) => l.enabled).length, s = a.ssids.filter((l) => l.enabled).length;
  return i === s;
}), xt = ee(
  ({ client: r, onClick: a, formatLastSeen: i, formatBytes: s }) => {
    var l, n, x, g;
    return /* @__PURE__ */ e.jsxs(
      "tr",
      {
        className: a ? "device-row clickable" : "device-row",
        onClick: a,
        children: [
          /* @__PURE__ */ e.jsx("td", { children: /* @__PURE__ */ e.jsxs("div", { className: "device-name-cell", children: [
            /* @__PURE__ */ e.jsx("span", { className: "text-xl", children: (l = r.os) != null && l.toLowerCase().includes("android") ? "📱" : (n = r.os) != null && n.toLowerCase().includes("ios") || (x = r.os) != null && x.toLowerCase().includes("apple") ? "🍎" : (g = r.os) != null && g.toLowerCase().includes("windows") ? "💻" : "📱" }),
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("div", { className: "name", children: r.description || r.mac }),
              r.description && /* @__PURE__ */ e.jsx("div", { className: "text-xs text-muted text-mono", children: r.mac })
            ] })
          ] }) }),
          /* @__PURE__ */ e.jsx("td", { className: "text-mono text-sm", children: r.ip || "—" }),
          /* @__PURE__ */ e.jsx("td", { children: r.manufacturer || "—" }),
          /* @__PURE__ */ e.jsx("td", { children: i(r.lastSeen) }),
          /* @__PURE__ */ e.jsx("td", { children: r.usage ? /* @__PURE__ */ e.jsxs("span", { className: "text-sm", children: [
            "↓",
            s(r.usage.recv),
            " ↑",
            s(r.usage.sent)
          ] }) : "—" })
        ]
      }
    );
  },
  (r, a) => {
    var i, s, l, n;
    return r.client.id === a.client.id && r.client.mac === a.client.mac && r.client.description === a.client.description && r.client.ip === a.client.ip && r.client.manufacturer === a.client.manufacturer && r.client.os === a.client.os && r.client.lastSeen === a.client.lastSeen && ((i = r.client.usage) == null ? void 0 : i.sent) === ((s = a.client.usage) == null ? void 0 : s.sent) && ((l = r.client.usage) == null ? void 0 : l.recv) === ((n = a.client.usage) == null ? void 0 : n.recv);
  }
), ht = ({
  ssid: r,
  clients: a,
  network: i,
  hass: s,
  onBack: l,
  onClientClick: n
}) => {
  const x = a.filter((h) => h.ssid === r.name), g = async () => {
    if (!r.entity_id || !s) {
      console.error("Cannot toggle SSID: missing entity_id or hass");
      return;
    }
    try {
      const h = r.enabled ? "turn_off" : "turn_on";
      await s.callService("switch", h, {
        entity_id: r.entity_id
      }), setTimeout(() => window.location.reload(), 1500);
    } catch (h) {
      console.error("Failed to toggle SSID:", h);
    }
  }, m = xe((h) => {
    if (h === 0) return "0 B";
    const y = 1024, f = ["B", "KB", "MB", "GB", "TB"], C = Math.floor(Math.log(h) / Math.log(y));
    return parseFloat((h / Math.pow(y, C)).toFixed(1)) + " " + f[C];
  }, []), M = xe((h) => {
    if (!h) return "Unknown";
    const y = new Date(h), C = (/* @__PURE__ */ new Date()).getTime() - y.getTime(), L = Math.floor(C / 6e4), P = Math.floor(C / 36e5), z = Math.floor(C / 864e5);
    return L < 1 ? "Just now" : L < 60 ? `${L}m ago` : P < 24 ? `${P}h ago` : `${z}d ago`;
  }, []), o = x.reduce(
    (h, y) => {
      var f, C;
      return {
        sent: h.sent + (((f = y.usage) == null ? void 0 : f.sent) || 0),
        recv: h.recv + (((C = y.usage) == null ? void 0 : C.recv) || 0)
      };
    },
    { sent: 0, recv: 0 }
  );
  return /* @__PURE__ */ e.jsxs("div", { className: "ssid-view", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "device-header", children: [
      /* @__PURE__ */ e.jsx("button", { className: "back-button", onClick: l, children: "← Back" }),
      /* @__PURE__ */ e.jsx("div", { className: "device-icon wireless", children: "📶" }),
      /* @__PURE__ */ e.jsxs("div", { className: "device-info", children: [
        /* @__PURE__ */ e.jsx("h1", { children: r.name }),
        /* @__PURE__ */ e.jsxs("div", { className: "meta", children: [
          i && /* @__PURE__ */ e.jsxs("span", { children: [
            "Network: ",
            i.name
          ] }),
          /* @__PURE__ */ e.jsxs("span", { children: [
            "SSID #",
            r.number
          ] }),
          /* @__PURE__ */ e.jsx("span", { className: r.enabled ? "text-success" : "text-muted", children: r.enabled ? "● Broadcasting" : "○ Disabled" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "info-card", children: [
      /* @__PURE__ */ e.jsx("h3", { children: "🎛️ SSID Control" }),
      /* @__PURE__ */ e.jsxs("div", { className: `ssid-control-panel ${r.enabled ? "enabled" : ""}`, children: [
        /* @__PURE__ */ e.jsxs("div", { className: "ssid-control-info", children: [
          /* @__PURE__ */ e.jsx(
            "div",
            {
              className: `ssid-control-status ${r.enabled ? "text-success" : "text-muted"}`,
              children: r.enabled ? "● SSID is Enabled" : "○ SSID is Disabled"
            }
          ),
          /* @__PURE__ */ e.jsx("div", { className: "ssid-control-desc text-muted text-sm", children: r.enabled ? "Clients can connect to this wireless network" : "This network is not broadcasting" })
        ] }),
        /* @__PURE__ */ e.jsx(
          "div",
          {
            className: `toggle ${r.enabled ? "active" : ""} clickable`,
            onClick: g,
            title: r.enabled ? "Click to disable SSID" : "Click to enable SSID"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "info-card", children: [
      /* @__PURE__ */ e.jsx("h3", { children: "📊 Statistics" }),
      /* @__PURE__ */ e.jsxs("div", { className: "stats-grid", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "stat-card", children: [
          /* @__PURE__ */ e.jsx("div", { className: "label", children: "Connected Clients" }),
          /* @__PURE__ */ e.jsx("div", { className: "value", children: x.length })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "stat-card", children: [
          /* @__PURE__ */ e.jsx("div", { className: "label", children: "Data Sent" }),
          /* @__PURE__ */ e.jsx("div", { className: "value success", children: m(o.sent) })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "stat-card", children: [
          /* @__PURE__ */ e.jsx("div", { className: "label", children: "Data Received" }),
          /* @__PURE__ */ e.jsx("div", { className: "value", children: m(o.recv) })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "stat-card", children: [
          /* @__PURE__ */ e.jsx("div", { className: "label", children: "Total Traffic" }),
          /* @__PURE__ */ e.jsx("div", { className: "value", children: m(o.sent + o.recv) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "info-card", children: [
      /* @__PURE__ */ e.jsxs("h3", { children: [
        "👥 Connected Clients (",
        x.length,
        ")"
      ] }),
      x.length > 0 ? /* @__PURE__ */ e.jsxs("table", { className: "device-table", children: [
        /* @__PURE__ */ e.jsx("thead", { children: /* @__PURE__ */ e.jsxs("tr", { children: [
          /* @__PURE__ */ e.jsx("th", { children: "Client" }),
          /* @__PURE__ */ e.jsx("th", { children: "IP Address" }),
          /* @__PURE__ */ e.jsx("th", { children: "Manufacturer" }),
          /* @__PURE__ */ e.jsx("th", { children: "Last Seen" }),
          /* @__PURE__ */ e.jsx("th", { children: "Usage" })
        ] }) }),
        /* @__PURE__ */ e.jsx("tbody", { children: x.map((h) => /* @__PURE__ */ e.jsx(
          xt,
          {
            client: h,
            onClick: n && h.ha_device_id ? () => n(h.ha_device_id) : void 0,
            formatLastSeen: M,
            formatBytes: m
          },
          h.id || h.mac
        )) })
      ] }) : /* @__PURE__ */ e.jsxs("div", { className: "empty-state", children: [
        /* @__PURE__ */ e.jsx("div", { className: "icon", children: "📴" }),
        /* @__PURE__ */ e.jsx("p", { children: "No clients connected to this SSID" })
      ] })
    ] })
  ] });
}, gt = ee(ht, (r, a) => {
  if (r.ssid.number !== a.ssid.number || r.ssid.networkId !== a.ssid.networkId || r.ssid.enabled !== a.ssid.enabled) return !1;
  const i = r.clients.filter(
    (l) => l.ssid === r.ssid.name
  ).length, s = a.clients.filter(
    (l) => l.ssid === a.ssid.name
  ).length;
  return i === s;
}), ft = "meraki_ha_theme_mode";
function Ne(r) {
  try {
    const a = getComputedStyle(document.documentElement).getPropertyValue(r).trim();
    if (a) return a;
  } catch {
  }
  return null;
}
function Nr(r) {
  if (!r) return 0.5;
  if (r.startsWith("#")) {
    const i = r.slice(1);
    let s, l, n;
    return i.length === 3 ? (s = parseInt(i[0] + i[0], 16), l = parseInt(i[1] + i[1], 16), n = parseInt(i[2] + i[2], 16)) : (s = parseInt(i.slice(0, 2), 16), l = parseInt(i.slice(2, 4), 16), n = parseInt(i.slice(4, 6), 16)), (0.299 * s + 0.587 * l + 0.114 * n) / 255;
  }
  const a = r.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (a) {
    const [, i, s, l] = a.map(Number);
    return (0.299 * i + 0.587 * s + 0.114 * l) / 255;
  }
  return r.includes("fff") || r.includes("fafafa") || r.includes("f5f5f5") ? 0.95 : r.includes("000") || r.includes("1c1c") || r.includes("111") ? 0.05 : 0.5;
}
function vt(r, a) {
  const i = Nr(r);
  return i > 0.6 ? !0 : i < 0.4 ? !1 : Nr(a) < 0.5;
}
function bt() {
  return {
    // Read HA's variables directly
    "--primary-color": Ne("--primary-color") || "#03a9f4",
    "--accent-color": Ne("--accent-color") || "#ff9800",
    "--primary-text-color": Ne("--primary-text-color") || "#212121",
    "--secondary-text-color": Ne("--secondary-text-color") || "#727272",
    "--disabled-text-color": Ne("--disabled-text-color") || "#bdbdbd",
    "--primary-background-color": Ne("--primary-background-color") || "#fafafa",
    "--secondary-background-color": Ne("--secondary-background-color") || "#e5e5e5",
    "--card-background-color": Ne("--card-background-color") || "#ffffff",
    "--divider-color": Ne("--divider-color") || "rgba(0, 0, 0, 0.12)",
    "--success-color": Ne("--success-color") || "#43a047",
    "--warning-color": Ne("--warning-color") || "#ffa600",
    "--error-color": Ne("--error-color") || "#db4437"
  };
}
function yt() {
  try {
    const r = localStorage.getItem(ft);
    if (r && ["auto", "dark", "light"].includes(r))
      return r;
  } catch {
  }
  return "auto";
}
function jt(r) {
  const a = Te(null), [i, s] = ue(yt);
  Le(() => {
    const m = (M) => {
      s(M.detail);
    };
    return window.addEventListener(
      "meraki-theme-change",
      m
    ), () => {
      window.removeEventListener(
        "meraki-theme-change",
        m
      );
    };
  }, []);
  const l = Ie(() => bt(), [r == null ? void 0 : r.themes]), n = Ie(() => {
    if (i === "dark") return !0;
    if (i === "light") return !1;
    const m = l["--primary-text-color"], M = l["--primary-background-color"];
    return vt(m, M);
  }, [l, i]), x = Ie(() => n ? "#2c2c2e" : "#f2f2f7", [n]), g = Ie(() => {
    const m = {};
    return m["--text-primary"] = l["--primary-text-color"], m["--text-secondary"] = l["--secondary-text-color"], m["--text-muted"] = l["--disabled-text-color"], m["--bg-primary"] = l["--primary-background-color"], m["--bg-secondary"] = l["--secondary-background-color"], m["--bg-tertiary"] = x, m["--card-bg"] = l["--card-background-color"], m["--card-border"] = l["--divider-color"], m["--primary"] = l["--primary-color"], m["--primary-light"] = n ? "rgba(10, 132, 255, 0.15)" : "rgba(0, 122, 255, 0.1)", m["--success"] = l["--success-color"], m["--success-light"] = n ? "rgba(48, 209, 88, 0.2)" : "rgba(52, 199, 89, 0.15)", m["--warning"] = l["--warning-color"], m["--warning-light"] = n ? "rgba(255, 159, 10, 0.2)" : "rgba(255, 149, 0, 0.15)", m["--error"] = l["--error-color"], m["--error-light"] = n ? "rgba(255, 69, 58, 0.2)" : "rgba(255, 59, 48, 0.15)", m;
  }, [l, x, n]);
  return Le(() => {
    const m = document.documentElement;
    m.setAttribute("data-theme", n ? "dark" : "light");
    for (const [o, h] of Object.entries(g))
      m.style.setProperty(o, h);
    const M = document.querySelector(".meraki-panel");
    if (M && M instanceof HTMLElement) {
      a.current = M;
      for (const [o, h] of Object.entries(g))
        M.style.setProperty(o, h);
    }
  }, [g, n]), { isDarkMode: n, themeVars: l, style: g, themeMode: i };
}
const kr = () => /* @__PURE__ */ e.jsxs("div", { className: "loading-container", children: [
  /* @__PURE__ */ e.jsx("div", { className: "loading-spinner" }),
  /* @__PURE__ */ e.jsx("span", { className: "loading-text", children: "Loading Meraki data..." })
] }), wt = ({
  message: r,
  onRetry: a
}) => /* @__PURE__ */ e.jsxs("div", { className: "error-container", children: [
  /* @__PURE__ */ e.jsx("span", { className: "error-icon", children: "⚠️" }),
  /* @__PURE__ */ e.jsxs("div", { className: "error-content", children: [
    /* @__PURE__ */ e.jsx("h3", { children: "Error Loading Data" }),
    /* @__PURE__ */ e.jsx("p", { children: r }),
    a && /* @__PURE__ */ e.jsx("button", { onClick: a, className: "retry-button", children: "Retry" })
  ] })
] }), ir = ({ version: r, onSettingsClick: a }) => /* @__PURE__ */ e.jsxs("div", { className: "meraki-header", children: [
  /* @__PURE__ */ e.jsx("div", { className: "logo", children: "🌐" }),
  /* @__PURE__ */ e.jsx("h1", { children: "Meraki Dashboard" }),
  r && /* @__PURE__ */ e.jsxs("span", { className: "version", children: [
    "v",
    r
  ] }),
  /* @__PURE__ */ e.jsx("div", { className: "header-actions", children: a && /* @__PURE__ */ e.jsx(
    "button",
    {
      onClick: a,
      className: "settings-btn",
      title: "Settings",
      children: "⚙️ Settings"
    }
  ) })
] }), Nt = ({ hass: r, panel: a, narrow: i }) => {
  var ce;
  const [s, l] = ue(null), [n, x] = ue(!0), [g, m] = ue(null), [M, o] = ue({ view: "dashboard" }), [h, y] = ue(0), [f, C] = ue([]), [L, P] = ue([]), [z, W] = ue({}), { style: K } = jt(r), J = xe(() => {
    ie.current = !1, y((k) => k + 1);
  }, []), U = Te(r);
  U.current = r, Le(() => {
    const k = U.current;
    if (!k) return;
    (async () => {
      try {
        const [w, $, B] = await Promise.all([
          k.callWS({
            type: "config/device_registry/list"
          }),
          k.callWS({
            type: "config/entity_registry/list"
          }),
          k.callWS({ type: "get_states" })
        ]);
        C(w), P($);
        const A = B.reduce(
          (Y, ne) => (Y[ne.entity_id] = ne, Y),
          {}
        );
        W(A), console.log("[Meraki] Fetched HA registries:", {
          devices: w.length,
          entities: $.length,
          states: B.length
        });
      } catch (w) {
        console.error("Failed to fetch HA device/entity registries:", w), m("Could not load device and entity data from Home Assistant.");
      }
    })();
    const Q = (async () => {
      try {
        return await k.connection.subscribeMessage(
          (w) => {
            if (w.event_type === "state_changed") {
              const { entity_id: $, new_state: B } = w.data;
              W(B ? (A) => ({
                ...A,
                [$]: B
              }) : (A) => {
                const Y = { ...A };
                return delete Y[$], Y;
              });
            }
          },
          { type: "subscribe_events", event_type: "state_changed" }
        );
      } catch (w) {
        return console.error("Failed to subscribe to state changes:", w), () => {
        };
      }
    })();
    return () => {
      Q.then((w) => w());
    };
  }, [U, h]);
  const ie = Te(!1), re = (ce = a == null ? void 0 : a.config) == null ? void 0 : ce.config_entry_id, pe = xe((k) => {
    if (k.networks && k.enabled_networks) {
      const T = k.networks.map((j) => ({
        ...j,
        is_enabled: k.enabled_networks.includes(j.id)
      }));
      return { ...k, networks: T };
    }
    return k;
  }, []), ye = xe(
    (k, T) => {
      var B, A, Y, ne, te, he, le, d, b, S;
      if (!k || ((B = k.devices) == null ? void 0 : B.length) !== ((A = T.devices) == null ? void 0 : A.length) || ((Y = k.networks) == null ? void 0 : Y.length) !== ((ne = T.networks) == null ? void 0 : ne.length) || ((te = k.ssids) == null ? void 0 : te.length) !== ((he = T.ssids) == null ? void 0 : he.length))
        return !0;
      const j = (le = k.devices) == null ? void 0 : le.map((I) => `${I.serial}:${I.status}`).sort().join("|"), Q = (d = T.devices) == null ? void 0 : d.map((I) => `${I.serial}:${I.status}`).sort().join("|");
      if (j !== Q)
        return !0;
      const w = (b = k.clients) == null ? void 0 : b.map((I) => I.recentDeviceSerial).sort().join("|"), $ = (S = T.clients) == null ? void 0 : S.map((I) => I.recentDeviceSerial).sort().join("|");
      return w !== $;
    },
    []
  ), ge = Te(null), N = Ie(() => s != null && s.clients && s.clients.length > 0 ? s.clients.map((T) => {
    const j = T.mac.replace(/:/g, "_").toLowerCase(), Q = `device_tracker.meraki_client_${j}`, w = z[Q], $ = L.find(
      (ne) => ne.entity_id === Q
    ), B = $ != null && $.device_id ? f.find((ne) => ne.id === $.device_id) : null, A = `switch.meraki_client_${j}_block`, Y = z[A];
    return {
      ...T,
      id: T.id || ($ == null ? void 0 : $.device_id) || T.mac,
      ha_device_id: ($ == null ? void 0 : $.device_id) || "",
      status: (w == null ? void 0 : w.state) === "home" ? "Online" : (w == null ? void 0 : w.state) === "not_home" ? "Offline" : T.status || "Unknown",
      via_device_id: B == null ? void 0 : B.via_device_id,
      is_blocked: (Y == null ? void 0 : Y.state) === "on"
    };
  }) : !L.length || !Object.keys(z).length ? [] : L.filter(
    (T) => T.entity_id.startsWith("device_tracker.meraki_client_")
  ).map((T) => {
    var I, X, me, Z, E, _, fe, _e, $e, We;
    const j = z[T.entity_id], Q = f.find((Ce) => Ce.id === T.device_id), w = T.entity_id.replace(
      "device_tracker.meraki_client_",
      ""
    ), $ = w.replace(/_/g, ":"), B = `switch.meraki_client_${w}_block`, A = z[B], Y = `sensor.meraki_client_${w}_vlan`, ne = `sensor.meraki_client_${w}_ssid`, te = `sensor.meraki_client_${w}_connected_device`, he = `sensor.meraki_client_${w}_switchport`, le = z[Y], d = z[ne], b = z[te], S = z[he];
    return {
      id: T.device_id || T.entity_id,
      mac: $,
      ha_device_id: T.device_id || "",
      description: (Q == null ? void 0 : Q.name) || ((I = j == null ? void 0 : j.attributes) == null ? void 0 : I.friendly_name) || $,
      ip: ((X = j == null ? void 0 : j.attributes) == null ? void 0 : X.ip_address) || "",
      manufacturer: (Q == null ? void 0 : Q.manufacturer) || ((me = j == null ? void 0 : j.attributes) == null ? void 0 : me.manufacturer) || "Unknown",
      os: ((Z = j == null ? void 0 : j.attributes) == null ? void 0 : Z.os) || "",
      status: (j == null ? void 0 : j.state) === "home" ? "Online" : "Offline",
      // Use sensor entities if available, fall back to device_tracker attributes
      ssid: (d == null ? void 0 : d.state) || ((E = j == null ? void 0 : j.attributes) == null ? void 0 : E.ssid) || "",
      switchport: (S == null ? void 0 : S.state) || ((_ = j == null ? void 0 : j.attributes) == null ? void 0 : _.switchport),
      vlan: (le != null && le.state ? parseInt(le.state, 10) : void 0) || ((fe = j == null ? void 0 : j.attributes) == null ? void 0 : fe.vlan),
      recentDeviceSerial: ((_e = b == null ? void 0 : b.attributes) == null ? void 0 : _e.device_serial) || (($e = j == null ? void 0 : j.attributes) == null ? void 0 : $e.connected_to_serial) || "",
      recentDeviceName: (b == null ? void 0 : b.state) || ((We = j == null ? void 0 : j.attributes) == null ? void 0 : We.connected_to_device),
      via_device_id: Q == null ? void 0 : Q.via_device_id,
      is_blocked: (A == null ? void 0 : A.state) === "on"
    };
  }), [s == null ? void 0 : s.clients, f, L, z]);
  Le(() => {
    const k = U.current;
    if (!k || !re)
      return;
    let T = null, j = !0;
    return (async () => {
      try {
        ie.current || x(!0), m(null), T = await k.connection.subscribeMessage(
          (w) => {
            var $, B;
            if (j && w) {
              console.log("[Meraki] Received data update:", {
                last_updated: w.last_updated,
                scan_interval: w.scan_interval,
                networks: ($ = w.networks) == null ? void 0 : $.length,
                devices: (B = w.devices) == null ? void 0 : B.length
              });
              const A = pe(w);
              ge.current = w.last_updated || null, l((Y) => ye(Y, A) ? (console.log(
                "[Meraki] Data changed, updating state",
                A.last_updated
              ), A) : Y && Y.last_updated !== A.last_updated ? (console.log(
                "[Meraki] Only timestamp changed, light update"
              ), { ...Y, ...A }) : (console.log("[Meraki] No changes detected, skipping update"), Y)), x(!1), ie.current = !0;
            }
          },
          {
            type: "meraki_ha/subscribe_meraki_data",
            config_entry_id: re
          }
        );
      } catch (w) {
        console.error("Failed to subscribe to Meraki data:", w), j && (m(
          w instanceof Error ? w.message : "Failed to connect to Meraki integration"
        ), x(!1));
      }
    })(), () => {
      j = !1, T && T();
    };
  }, [re, h]);
  const R = Ie(
    () => {
      var k;
      return ((k = s == null ? void 0 : s.networks) == null ? void 0 : k.filter((T) => T.is_enabled)) || [];
    },
    [s == null ? void 0 : s.networks]
  ), q = Ie(
    () => s ? {
      ...s,
      networks: R
    } : null,
    [s, R]
  );
  if (!r)
    return /* @__PURE__ */ e.jsxs("div", { className: "meraki-panel", style: K, children: [
      /* @__PURE__ */ e.jsx(kr, {}),
      /* @__PURE__ */ e.jsx("p", { className: "loading-message", children: "Waiting for Home Assistant connection..." })
    ] });
  if (n)
    return /* @__PURE__ */ e.jsxs("div", { className: "meraki-panel", style: K, children: [
      /* @__PURE__ */ e.jsx(ir, {}),
      /* @__PURE__ */ e.jsx(kr, {})
    ] });
  if (g)
    return /* @__PURE__ */ e.jsxs("div", { className: "meraki-panel", style: K, children: [
      /* @__PURE__ */ e.jsx(ir, {}),
      /* @__PURE__ */ e.jsx(wt, { message: g, onRetry: J })
    ] });
  if (!s || !q)
    return /* @__PURE__ */ e.jsxs("div", { className: "meraki-panel", style: K, children: [
      /* @__PURE__ */ e.jsx(ir, {}),
      /* @__PURE__ */ e.jsxs("div", { className: "empty-state", children: [
        /* @__PURE__ */ e.jsx("div", { className: "icon", children: "📡" }),
        /* @__PURE__ */ e.jsx("h3", { children: "No Data Available" }),
        /* @__PURE__ */ e.jsx("p", { children: "Could not load Meraki data. Please try again." })
      ] })
    ] });
  const H = () => {
    var k, T;
    switch (M.view) {
      case "clients":
        return /* @__PURE__ */ e.jsx(
          ut,
          {
            clients: N,
            onBack: () => o({ view: "dashboard" }),
            initialClientId: M.clientId
          }
        );
      case "device":
        return /* @__PURE__ */ e.jsx(
          nt,
          {
            activeView: M,
            setActiveView: o,
            data: s,
            clients: N,
            haDevices: f,
            hass: r,
            configEntryId: re,
            cameraLinkIntegration: s.camera_link_integration,
            configEntryOptions: {
              temperature_unit: s.temperature_unit
            }
          }
        );
      case "ssids":
        return /* @__PURE__ */ e.jsx(
          mt,
          {
            ssids: s.ssids || [],
            clients: s.clients || [],
            networks: s.networks || [],
            onBack: () => o({ view: "dashboard" }),
            onSSIDClick: (j) => o({
              view: "ssid",
              ssidNetworkId: j.networkId,
              ssidNumber: j.number
            })
          }
        );
      case "ssid": {
        const j = (k = s.ssids) == null ? void 0 : k.find(
          (w) => w.networkId === M.ssidNetworkId && w.number === M.ssidNumber
        );
        if (!j)
          return /* @__PURE__ */ e.jsxs("div", { className: "error-container", children: [
            /* @__PURE__ */ e.jsx("span", { className: "error-icon", children: "⚠️" }),
            /* @__PURE__ */ e.jsx("p", { children: "SSID not found" }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                onClick: () => o({ view: "ssids" }),
                className: "retry-button",
                children: "Back to SSIDs"
              }
            )
          ] });
        const Q = (T = s.networks) == null ? void 0 : T.find(
          (w) => w.id === j.networkId
        );
        return /* @__PURE__ */ e.jsx(
          gt,
          {
            ssid: j,
            clients: N,
            network: Q,
            hass: r,
            onBack: () => o({ view: "ssids" }),
            onClientClick: (w) => {
              if (w) {
                const $ = `/config/devices/device/${w}`, B = new CustomEvent("hass-navigate", {
                  detail: { path: $ },
                  bubbles: !0,
                  composed: !0
                });
                window.dispatchEvent(B);
              }
            }
          }
        );
      }
      default:
        return /* @__PURE__ */ e.jsx(
          Qr,
          {
            data: q,
            setActiveView: o,
            hass: r,
            defaultViewMode: s.dashboard_view_mode,
            defaultDeviceTypeFilter: s.dashboard_device_type_filter,
            defaultStatusFilter: s.dashboard_status_filter,
            temperatureUnit: s.temperature_unit
          }
        );
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "meraki-panel", style: K, children: [
    /* @__PURE__ */ e.jsx(
      ir,
      {
        version: s.version,
        onSettingsClick: () => r == null ? void 0 : r.showOptionsFlow(re || "", null, {
          step_id: "init"
        })
      }
    ),
    H()
  ] });
}, _r = '@import"https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap";:root{--primary: var(--primary-color, #03a9f4);--primary-dark: #0288d1;--primary-light: rgba(3, 169, 244, .1);--success: var(--success-color, #43a047);--success-light: rgba(67, 160, 71, .15);--warning: var(--warning-color, #ffa600);--warning-light: rgba(255, 166, 0, .15);--error: var(--error-color, #db4437);--error-light: rgba(219, 68, 55, .15);--bg-primary: var(--primary-background-color, #fafafa);--bg-secondary: var(--secondary-background-color, #ffffff);--bg-tertiary: #f1f5f9;--card-bg: var(--card-background-color, #ffffff);--card-border: var(--divider-color, rgba(0, 0, 0, .12));--text-primary: var(--primary-text-color, #212121);--text-secondary: var(--secondary-text-color, #727272);--text-muted: #8e8e93;--radius-sm: 8px;--radius-md: 12px;--radius-lg: 16px;--radius-xl: 20px;--shadow-sm: 0 1px 2px rgba(0, 0, 0, .08);--shadow-md: 0 4px 6px rgba(0, 0, 0, .1);--shadow-lg: 0 10px 25px rgba(0, 0, 0, .15);--transition: all .2s ease;--switch-color: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);--camera-color: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%);--wireless-color: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);--sensor-color: linear-gradient(135deg, #10b981 0%, #059669 100%);--appliance-color: linear-gradient(135deg, #f59e0b 0%, #d97706 100%)}:root[data-theme=dark]{--bg-tertiary: #2c2c2e;--text-muted: rgba(255, 255, 255, .5);--text-secondary: rgba(255, 255, 255, .6);--primary-light: rgba(3, 169, 244, .2);--success-light: rgba(67, 160, 71, .2);--warning-light: rgba(255, 166, 0, .2);--error-light: rgba(219, 68, 55, .2);--shadow-sm: 0 1px 2px rgba(0, 0, 0, .3);--shadow-md: 0 4px 6px rgba(0, 0, 0, .3);--shadow-lg: 0 10px 25px rgba(0, 0, 0, .4)}.text-primary{color:var(--text-primary)}.text-secondary{color:var(--text-secondary)}.text-mono{font-family:monospace}.flex{display:flex}.flex-col{flex-direction:column}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-2{gap:8px}.gap-3{gap:12px}.client-row-cell{display:flex;align-items:center;gap:10px}.client-row-icon{font-size:18px}.client-row-info{display:flex;flex-direction:column}.band-badge{display:inline-block;padding:4px 10px;border-radius:6px;font-size:13px;font-weight:500}.band-badge.band-2_4{background:#f59e0b26;color:var(--warning)}.band-badge.band-5{background:#06b6d426;color:var(--primary)}.broadcast-status{display:inline-flex;align-items:center;gap:6px}.broadcast-status.active{color:var(--success)}.broadcast-status.inactive{color:var(--text-muted)}.broadcast-dot{width:8px;height:8px;border-radius:50%;background:currentColor}.broadcast-status.active .broadcast-dot{box-shadow:0 0 8px var(--success)}.bssid-text{font-size:11px;color:var(--text-muted);font-family:monospace}.status-badge{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:500}.status-badge.enabled,.status-badge.online,.status-badge.success{background:var(--success-light);color:var(--success)}.status-badge.disabled,.status-badge.offline,.status-badge.inactive{background:var(--bg-tertiary);color:var(--text-secondary)}.status-badge .dot{width:6px;height:6px;border-radius:50%;background:currentColor}.number-badge{display:inline-block;background:var(--bg-tertiary);padding:2px 8px;border-radius:var(--radius-sm);font-size:12px;font-weight:500;color:var(--text-secondary)}.section-label{font-size:14px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:16px}.field-label{font-size:10px;color:var(--text-muted);text-transform:uppercase}.description{font-size:12px;color:var(--text-muted)}.empty-state-message{text-align:center;padding:40px 20px;color:var(--text-muted)}.arrow-indicator{color:var(--text-muted)}.meta-info{font-size:12px;color:var(--text-muted)}.refresh-indicator{display:flex;justify-content:flex-end;align-items:center;gap:16px;margin-bottom:12px;font-size:12px;color:var(--text-muted);opacity:.8}.refresh-indicator-item{display:flex;align-items:center;gap:4px}.refresh-indicator-icon{font-size:10px}.view-mode-toggle{display:flex;gap:4px;background:var(--card-bg);border:1px solid var(--card-border);border-radius:var(--radius-md);padding:4px}.view-mode-btn{padding:8px 16px;border-radius:var(--radius-sm);border:none;background:transparent;color:var(--text-primary);cursor:pointer;font-weight:500;font-size:13px;transition:var(--transition)}.view-mode-btn.active{background:var(--primary);color:#fff}.filter-select{padding:8px 12px;border-radius:var(--radius-md);border:1px solid var(--card-border);background:var(--card-bg);color:var(--text-primary);font-size:13px;cursor:pointer}.clear-filters-btn{padding:8px 12px;border-radius:var(--radius-md);border:none;background:var(--warning);color:#fff;font-size:12px;cursor:pointer;font-weight:500}.cell-mono{font-family:monospace;font-size:11px}.empty-table-message{text-align:center;color:var(--text-muted);padding:20px}.usage-stats-row{display:flex;gap:32px;margin-bottom:20px;padding:16px;background:var(--bg-primary);border-radius:var(--radius-md)}.usage-stat{flex:1;text-align:center}.usage-stat-label{font-size:12px;color:var(--text-muted);margin-bottom:4px}.usage-stat-value{font-size:24px;font-weight:600}.usage-stat-value.upload{color:var(--success)}.usage-stat-value.download{color:var(--primary)}.usage-stat-value.total{color:var(--text-primary)}.usage-divider{width:1px;background:var(--card-border)}.search-input{width:100%;padding:12px 16px;border-radius:var(--radius-md);border:1px solid var(--card-border);background:var(--bg-secondary);color:var(--text-primary);font-size:14px}.search-input::-moz-placeholder{color:var(--text-muted)}.search-input::placeholder{color:var(--text-muted)}.btn-primary{padding:10px 20px;border-radius:var(--radius-md);border:none;background:var(--primary);color:#fff;cursor:pointer;font-weight:500;display:inline-flex;align-items:center;gap:8px}.btn-primary:hover{opacity:.9}.btn-secondary{padding:10px 20px;border-radius:var(--radius-md);border:1px solid var(--card-border);background:var(--bg-secondary);color:var(--text-primary);cursor:pointer;font-weight:500;display:inline-flex;align-items:center;gap:8px}.device-icon-gradient{background:linear-gradient(135deg,#667eea,#764ba2)}.text-xs{font-size:10px}.text-sm{font-size:12px}.text-lg{font-size:16px}.text-xl{font-size:20px}.mt-4{margin-top:16px}.mb-5{margin-bottom:20px}.settings-overlay{position:fixed;top:0;right:0;bottom:0;left:0;background:#000000b3;display:flex;align-items:center;justify-content:center;z-index:1000;padding:20px}.settings-modal{background:var(--card-bg);border:1px solid var(--card-border);border-radius:var(--radius-lg);width:100%;max-width:800px;max-height:90vh;display:flex;flex-direction:column;box-shadow:var(--shadow-lg)}.settings-header{display:flex;justify-content:space-between;align-items:center;padding:20px 24px;border-bottom:1px solid var(--card-border)}.settings-header h2{margin:0;font-size:18px;font-weight:600;color:var(--text-primary)}.settings-close-btn{background:none;border:none;font-size:20px;cursor:pointer;color:var(--text-muted);padding:4px 8px;transition:color .2s}.settings-close-btn:hover{color:var(--text-primary)}.settings-content{flex:1;overflow-y:auto;padding:24px}.settings-section{margin-bottom:32px}.settings-row{display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--card-border)}.settings-row-info{flex:1}.settings-row-label{font-weight:500;margin-bottom:2px;color:var(--text-primary)}.settings-row-description{font-size:12px;color:var(--text-muted)}.theme-toggle-group{display:flex;gap:4px;background:var(--bg-tertiary);border-radius:var(--radius-md);padding:4px;margin-left:16px}.theme-toggle-btn{padding:6px 12px;border-radius:var(--radius-sm);border:none;background:transparent;color:var(--text-secondary);cursor:pointer;font-weight:500;font-size:12px;transition:all .2s}.theme-toggle-btn.active{background:var(--primary);color:#fff}.theme-toggle-btn:hover:not(.active){background:var(--bg-secondary)}.toggle-switch{width:44px;height:24px;border-radius:12px;cursor:pointer;position:relative;transition:background .2s;margin-left:16px;flex-shrink:0}.toggle-switch.on{background:var(--success)}.toggle-switch.off{background:var(--bg-tertiary)}.toggle-knob{position:absolute;top:2px;width:20px;height:20px;border-radius:50%;background:#fff;transition:left .2s;box-shadow:0 1px 3px #0000004d}.toggle-switch.on .toggle-knob{left:22px}.toggle-switch.off .toggle-knob{left:2px}.sensor-ranges-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-top:16px}.sensor-range-card{padding:12px;background:var(--bg-secondary);border-radius:var(--radius-sm)}.sensor-range-label{font-weight:500;margin-bottom:8px;font-size:13px;color:var(--text-primary)}.sensor-range-inputs{display:flex;gap:8px}.sensor-range-input{flex:1}.sensor-range-input input{width:100%;padding:6px 8px;border-radius:var(--radius-sm);border:1px solid var(--card-border);background:var(--bg-primary);color:var(--text-primary);font-size:13px}.sensor-range-input input::-moz-placeholder{color:var(--text-muted)}.sensor-range-input input::placeholder{color:var(--text-muted)}.settings-footer{display:flex;justify-content:flex-end;gap:12px;padding:16px 24px}.timed-access-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px}@media (max-width: 768px){.timed-access-grid{grid-template-columns:1fr}}.timed-access-create{padding-right:24px;border-right:1px solid var(--card-border)}@media (max-width: 768px){.timed-access-create{padding-right:0;border-right:none;padding-bottom:24px;border-bottom:1px solid var(--card-border)}}.timed-access-list{display:flex;flex-direction:column;gap:16px}.guest-keys-list{display:flex;flex-direction:column;gap:12px}.guest-key-card{background:var(--bg-secondary);border:1px solid var(--card-border);border-radius:var(--radius-md);padding:16px}.guest-key-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px}.guest-key-name{font-weight:600;color:var(--text-primary)}.guest-key-passphrase{background:var(--bg-tertiary);padding:12px;border-radius:var(--radius-sm);font-family:monospace;font-size:18px;text-align:center;-webkit-user-select:all;-moz-user-select:all;user-select:all;margin-bottom:12px}.guest-key-footer{display:flex;justify-content:space-between;align-items:flex-end}.guest-key-expiry{font-size:13px;color:var(--primary)}.guest-key-qr{background:#fff;padding:4px;border-radius:var(--radius-sm)}.btn-revoke{background:transparent;border:1px solid var(--error);color:var(--error);padding:4px 12px;border-radius:var(--radius-sm);font-size:12px;cursor:pointer}.btn-revoke:hover{background:var(--error);color:#fff;border-top:1px solid var(--card-border)}.btn{padding:10px 20px;border-radius:var(--radius-md);cursor:pointer;font-weight:500;font-size:14px;transition:all .2s}.btn:disabled{opacity:.7;cursor:not-allowed}.btn-primary{border:none;background:var(--primary);color:#fff}.btn-primary:hover:not(:disabled){background:var(--primary-dark)}.btn-secondary{border:1px solid var(--card-border);background:var(--bg-secondary);color:var(--text-primary)}.btn-secondary:hover:not(:disabled){background:var(--bg-tertiary)}*{box-sizing:border-box;margin:0;padding:0}#meraki-panel-root{height:100%;width:100%}.meraki-panel{font-family:var( --paper-font-body1_-_font-family, "Inter", -apple-system, BlinkMacSystemFont, sans-serif );background:var(--bg-primary);min-height:100vh;color:var(--text-primary);padding:24px;max-width:1600px;margin:0 auto;width:100%}.meraki-header{display:flex;align-items:center;gap:16px;margin-bottom:32px}.meraki-header .logo{width:48px;height:48px;background:linear-gradient(135deg,var(--primary) 0%,#06b6d4 100%);border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;font-size:24px;box-shadow:var(--shadow-md)}.meraki-header h1{font-size:28px;font-weight:600;color:var(--text-primary)}.meraki-header .version{font-size:12px;color:var(--text-secondary);background:var(--card-bg);border:1px solid var(--card-border);padding:4px 10px;border-radius:12px}.meraki-header .header-actions{margin-left:auto;display:flex;gap:8px}.settings-btn{background:var(--card-bg);border:1px solid var(--card-border);border-radius:var(--radius-sm);padding:8px 16px;color:var(--text-primary);cursor:pointer;font-size:14px;font-weight:500;display:flex;align-items:center;gap:6px;transition:var(--transition);box-shadow:var(--shadow-sm)}.settings-btn:hover{background:var(--bg-tertiary);border-color:var(--primary)}.loading-message{text-align:center;color:var(--text-secondary);margin-top:16px}.nav-tabs{display:flex;gap:8px;margin-bottom:24px;background:var(--card-bg);padding:6px;border-radius:var(--radius-lg);border:1px solid var(--card-border)}.nav-tab{padding:10px 20px;border:none;background:transparent;color:var(--text-secondary);font-size:14px;font-weight:500;border-radius:var(--radius-sm);cursor:pointer;transition:var(--transition);font-family:inherit}.nav-tab:hover{color:var(--text-primary);background:var(--bg-tertiary)}.nav-tab.active{background:var(--primary);color:#fff}.stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:16px;margin-bottom:24px}.stat-card{background:var(--card-bg);border:1px solid var(--card-border);border-radius:var(--radius-lg);padding:20px;transition:var(--transition)}.stat-card:hover{border-color:var(--primary);transform:translateY(-2px);box-shadow:var(--shadow-lg)}.stat-card.clickable{cursor:pointer}.stat-card .stat-icon{margin-right:8px}.stat-card .label{font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px;font-weight:500;opacity:.7}.stat-card .value{font-size:32px;font-weight:700;color:var(--primary);text-shadow:0 0 1px currentColor}.stat-card .value.success{color:var(--success)!important}.stat-card .value.warning{color:var(--warning)!important}.stat-card .value.error{color:var(--error)!important}.stat-card .value.default{color:var(--text-primary)!important;font-weight:600}.network-card{background:var(--card-bg);border:1px solid var(--card-border);border-radius:var(--radius-lg);overflow:hidden;margin-bottom:24px}.network-header{display:flex;align-items:center;justify-content:space-between;padding:20px 24px;border-bottom:1px solid var(--card-border);background:var(--bg-secondary);cursor:pointer;transition:var(--transition)}.network-header:hover{background:var(--bg-tertiary)}.network-header .title{display:flex;align-items:center;gap:12px}.network-header .network-icon{color:var(--primary);font-size:24px}.network-header h2{font-size:20px;font-weight:600;margin:0}.network-header .badge{background:var(--success);color:#fff;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:500}.network-header .expand-icon{color:var(--text-secondary);transition:transform .2s}.network-header .expand-icon.expanded{transform:rotate(180deg)}.device-table{width:100%;border-collapse:collapse}.device-table th{text-align:left;padding:16px 24px;font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;border-bottom:1px solid var(--card-border)}.device-table td{padding:16px 24px;border-bottom:1px solid var(--card-border);vertical-align:middle}.device-table tr:last-child td{border-bottom:none}.device-table tr:hover td{background:var(--bg-secondary)}.device-table th:first-child,.device-table td:first-child{position:sticky;left:0;background:var(--card-bg);z-index:1}.device-row{cursor:pointer;transition:var(--transition)}.device-name-cell{display:flex;align-items:center;gap:12px}.device-icon{width:40px;height:40px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}.device-icon.switch{background:var(--switch-color)}.device-icon.camera{background:var(--camera-color)}.device-icon.wireless{background:var(--wireless-color)}.device-icon.sensor{background:var(--sensor-color)}.device-icon.appliance{background:var(--appliance-color)}.device-name-cell .name{font-weight:500;color:var(--text-primary)}.device-model{color:var(--text-secondary);font-size:14px}.status-badge{display:inline-flex;align-items:center;gap:6px;font-weight:500;font-size:14px}.status-dot{width:8px;height:8px;border-radius:50%}.status-badge.online .status-dot{background:var(--success);box-shadow:0 0 8px var(--success)}.status-badge.online{color:var(--success)}.status-badge.offline .status-dot{background:var(--error);box-shadow:0 0 8px var(--error)}.status-badge.offline{color:var(--error)}.status-badge.alerting .status-dot{background:var(--warning);box-shadow:0 0 8px var(--warning)}.status-badge.alerting{color:var(--warning)}.detail-badge{background:var(--bg-tertiary);color:var(--text-primary);border:1px solid var(--card-border);padding:4px 10px;border-radius:6px;font-size:13px;font-weight:500}.ssid-section{padding:20px 24px;border-top:1px solid var(--card-border)}.ssid-section h3{font-size:14px;color:var(--text-muted);margin-bottom:16px;display:flex;align-items:center;gap:8px;font-weight:500}.ssid-list{display:flex;gap:12px;flex-wrap:wrap}.ssid-item{background:var(--bg-secondary);border:1px solid var(--card-border);border-radius:var(--radius-sm);padding:12px 16px;display:flex;align-items:center;gap:10px;transition:var(--transition)}.ssid-item:hover{border-color:var(--primary);background:var(--bg-tertiary)}.ssid-item .icon{color:var(--primary);font-size:20px}.ssid-item .name{font-weight:500}.ssid-item .clients{color:var(--text-muted);font-size:13px}.ssid-control-panel{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;background:var(--bg-secondary);border-radius:var(--radius-md)}.ssid-control-panel.enabled{background:var(--success-light)}.ssid-control-info{flex:1}.ssid-control-status{font-size:16px;font-weight:500}.ssid-control-desc{margin-top:4px}.toggle{width:44px;height:24px;background:var(--bg-tertiary);border-radius:12px;position:relative;cursor:pointer;transition:var(--transition)}.toggle.active{background:var(--success)}.toggle:after{content:"";position:absolute;width:20px;height:20px;background:#fff;border-radius:50%;top:2px;left:2px;box-shadow:var(--shadow-sm);transition:left .2s}.toggle.active:after{left:22px}.back-button{display:inline-flex;align-items:center;gap:8px;color:var(--text-primary);font-weight:500;margin-bottom:24px;background:var(--card-bg);border:1px solid var(--card-border);border-radius:var(--radius-sm);font-size:14px;cursor:pointer;padding:8px 16px;font-family:inherit;box-shadow:var(--shadow-sm);transition:var(--transition)}.back-button:hover{background:var(--bg-secondary);border-color:var(--primary);color:var(--primary)}.device-header{display:flex;align-items:flex-start;gap:24px;margin-bottom:32px}.device-header .device-icon{width:72px;height:72px;border-radius:var(--radius-xl);display:flex;align-items:center;justify-content:center;font-size:32px;flex-shrink:0}.device-header .device-info h1{font-size:28px;font-weight:600;margin-bottom:8px;color:var(--text-primary)}.device-header .device-info .meta{display:flex;gap:24px;color:var(--text-secondary);font-size:14px;flex-wrap:wrap}.device-header .device-info .meta span strong{color:var(--text-muted);font-weight:400;margin-right:4px}.device-header .status-pill{display:inline-flex;align-items:center;gap:6px;background:var(--success-light);color:var(--success);padding:6px 14px;border-radius:20px;font-weight:500;font-size:14px;margin-left:auto}.device-header .status-pill .dot{width:8px;height:8px;background:var(--success);border-radius:50%;box-shadow:0 0 8px var(--success)}.cards-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:24px;margin-bottom:24px}.info-card{background:var(--card-bg);border:1px solid var(--card-border);border-radius:var(--radius-lg);padding:24px}.info-card h3{font-size:14px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:20px;display:flex;align-items:center;gap:8px;font-weight:600}.info-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}.info-item .label{font-size:11px;color:var(--text-muted);margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px;font-weight:500;opacity:.7}.info-item .value{font-size:16px;font-weight:600;color:var(--text-primary);opacity:1}.info-item .value.primary{color:var(--primary)!important}.info-item .value.success{color:var(--success)!important}.info-item .value.warning{color:var(--warning)!important}.info-item .value.error{color:var(--error)!important}.info-item .value.mono{font-family:SF Mono,Monaco,Consolas,monospace;font-size:14px}.card{background:var(--card-bg);border:1px solid var(--card-border);border-radius:var(--radius-lg);overflow:hidden}.card-header{padding:16px 24px;border-bottom:1px solid var(--card-border)}.card-header h3{margin:0;font-size:15px;font-weight:600;color:var(--text-primary)}.card-content{padding:24px}.ssids-list-view .view-header{display:flex;align-items:center;margin-bottom:24px}.ssids-list-view .view-header-content{flex:1;margin-left:16px}.ssids-list-view .view-header-title{display:flex;align-items:center;gap:12px}.ssids-list-view .view-header-icon{font-size:24px}.ssids-list-view .view-header-title h2{margin:0;font-size:20px}.ssids-list-view .view-header-stats{display:flex;align-items:center;gap:12px;margin-top:4px;font-size:13px}.ssids-list-view .separator{color:var(--text-muted)}.ssids-list-view .ssid-network-card{margin-bottom:16px}.ssids-list-view .ssid-network-card .card-content{padding:0}.ssids-list-view .ssid-network-card .card-header h3{display:flex;align-items:center;gap:8px}.ssids-list-view .ssid-count{font-size:12px;font-weight:400}.ssids-list-view .ssid-name-cell{display:flex;align-items:center;gap:10px}.ssids-list-view .ssid-icon{font-size:18px}.ssids-list-view .ssid-name,.ssids-list-view .client-count{font-weight:500}.ssids-list-view .arrow-cell{text-align:right}.ssids-list-view .empty-icon{font-size:48px;margin-bottom:16px}.ssids-list-view .empty-state-message h3{margin-bottom:8px}.ssid-view{padding:0}.ssid-view .view-header{display:flex;align-items:center;margin-bottom:16px}.ssid-view .back-button:hover{background:var(--bg-secondary);border-color:var(--primary);color:var(--primary)}.port-visualization{background:var(--bg-primary);border-radius:var(--radius-md);padding:24px;margin-bottom:24px}.switch-chassis{background:var(--bg-tertiary);border-radius:var(--radius-sm);padding:16px 20px;display:flex;flex-direction:column;gap:12px;border:2px solid var(--card-border)}.switch-label{display:flex;justify-content:space-between;align-items:center;font-size:12px;color:var(--text-secondary)}.ports-row{display:flex;gap:6px;flex-wrap:wrap}.port{width:40px;height:32px;background:var(--bg-primary);border-radius:4px;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;position:relative;border:2px solid var(--card-border);transition:var(--transition)}.port:hover{transform:translateY(-2px);border-color:var(--primary)}.port.connected{background:#10b98133;border-color:var(--success)}.port.connected:before{content:"";width:6px;height:6px;background:var(--success);border-radius:50%;box-shadow:0 0 6px var(--success)}.port.selected{border-color:var(--primary);box-shadow:0 0 12px var(--primary)}.port .num{font-size:9px;color:var(--text-muted);position:absolute;bottom:2px}.port .poe{position:absolute;top:-8px;right:-4px;font-size:12px;color:var(--warning);text-shadow:0 0 4px var(--warning)}.port-legend{display:flex;gap:24px;margin-top:16px;font-size:13px;color:var(--text-muted)}.port-legend span{display:flex;align-items:center;gap:6px}.port-legend .dot{width:10px;height:10px;border-radius:50%}.port-legend .dot.connected{background:var(--success)}.port-legend .dot.disconnected{background:var(--text-muted)}.port-details{background:var(--card-bg);border:1px solid var(--card-border);border-radius:var(--radius-lg);padding:20px;margin-top:16px}.port-details h4{font-size:16px;margin-bottom:16px;display:flex;align-items:center;gap:8px}.client-info{background:var(--primary-light);border-radius:var(--radius-sm);padding:16px;display:flex;align-items:center;gap:16px}.client-avatar{width:48px;height:48px;background:linear-gradient(135deg,var(--primary) 0%,#06b6d4 100%);border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;font-size:24px}.client-details .name{font-weight:600;margin-bottom:4px}.client-details .mac{font-size:13px;color:var(--text-muted);font-family:monospace}.port-clients{margin-top:16px}.port-clients-header{margin:0 0 12px;font-size:14px;font-weight:600;color:var(--text-secondary)}.port-clients-list{display:flex;flex-direction:column;gap:8px}.port-client-item{display:flex;align-items:center;gap:12px;padding:12px;background:var(--bg-tertiary);border-radius:var(--radius-sm);transition:var(--transition)}.port-client-item:hover{background:var(--primary-alpha-10, rgba(3, 169, 244, .1))}.port-client-icon{font-size:20px;width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:var(--bg-secondary);border-radius:var(--radius-sm)}.port-client-info{flex:1;min-width:0}.port-client-name{font-weight:500;color:var(--text-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.port-client-meta{display:flex;gap:8px;font-size:12px;color:var(--text-muted);margin-top:2px}.port-client-ip{font-family:monospace}.port-client-manufacturer{opacity:.8}.port-client-vlan{padding:4px 8px;background:var(--bg-secondary);border-radius:var(--radius-sm);font-size:11px;font-weight:500;color:var(--text-secondary)}.port-details-header{font-size:16px;margin-bottom:16px;display:flex;align-items:center;gap:8px}.port-status-icon{display:inline}.port-status-icon.connected{color:var(--success)}.port-status-icon.disconnected{color:var(--text-muted)}.port-uplink-badge{margin-left:8px;font-size:12px;color:var(--primary)}.port-alerts{margin-bottom:12px}.port-alert{font-size:13px;display:flex;align-items:center;gap:6px;margin-bottom:4px}.port-alert.error{color:var(--error)}.port-alert.warning{color:var(--warning)}.port-empty-state{padding:16px;background:var(--bg-primary);border-radius:var(--radius-sm);text-align:center;color:var(--text-muted);font-size:14px;margin-top:8px}.neighbor-discovery{margin-top:16px;padding:12px;background:var(--bg-primary);border-radius:var(--radius-sm)}.neighbor-discovery-header{margin:0 0 8px;font-size:13px;color:var(--text-muted)}.neighbor-protocol{margin-bottom:8px}.neighbor-protocol:last-child{margin-bottom:0}.neighbor-protocol-label{font-size:11px;color:var(--text-muted);text-transform:uppercase}.neighbor-protocol-name{font-size:14px;font-weight:500;color:var(--text-primary)}.neighbor-protocol-detail{font-size:12px;color:var(--text-secondary)}.neighbor-protocol-address{font-size:12px;color:var(--text-secondary);font-family:monospace}.secure-port-status{margin-top:12px;font-size:13px;display:flex;align-items:center;gap:6px}.secure-port-status.active{color:var(--success)}.secure-port-status.inactive{color:var(--text-muted)}.port-select-prompt{text-align:center;padding:20px;color:var(--text-muted);font-size:14px}.value-poe{color:var(--warning)}.clickable{cursor:pointer}.port-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:16px;margin-top:16px}.port-stat .label{font-size:11px;color:var(--text-muted);text-transform:uppercase}.port-stat .value{font-size:18px;font-weight:600;color:var(--text-primary)}.readings-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:24px;margin-bottom:24px}.reading-card{background:var(--card-bg);border:1px solid var(--card-border);border-radius:var(--radius-lg);padding:32px;text-align:center}.reading-card .icon-wrapper{width:80px;height:80px;border-radius:50%}.reading-card .reading-icon{display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:36px}.reading-card.temperature .icon-wrapper{background:#f9731626;color:#f97316}.reading-card.humidity .icon-wrapper{background:#06b6d426;color:#06b6d4}.reading-card.tvoc .icon-wrapper,.reading-card.pm25 .icon-wrapper,.reading-card.co2 .icon-wrapper{background:#84cc1626;color:#84cc16}.reading-card.indoorAirQuality .icon-wrapper{background:#22c55e26;color:#22c55e}.reading-card.noise .icon-wrapper{background:#8b5cf626;color:#8b5cf6}.reading-card .reading-label{font-size:14px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:12px}.reading-card .reading-value{font-size:48px;font-weight:700;line-height:1;margin-bottom:8px}.reading-card.temperature .reading-value{color:#f97316}.reading-card.humidity .reading-value{color:#06b6d4}.reading-card.tvoc .reading-value,.reading-card.pm25 .reading-value,.reading-card.co2 .reading-value{color:#84cc16}.reading-card.indoorAirQuality .reading-value{color:#22c55e}.reading-card.noise .reading-value{color:#8b5cf6}.reading-card .reading-unit{font-size:24px;font-weight:400;opacity:.7}.reading-card .reading-status{font-size:14px;color:var(--success);display:flex;align-items:center;justify-content:center;gap:6px;margin-top:16px}.gauge-wrapper{width:100%;height:8px;background:var(--bg-tertiary);border-radius:4px;margin-top:20px;overflow:hidden}.gauge-fill{height:100%;border-radius:4px;transition:width .5s ease}.gauge-fill.temp{background:linear-gradient(90deg,#22c55e,#eab308,#ef4444)}.gauge-fill.humidity{background:#06b6d4}.gauge-fill.air-quality{background:linear-gradient(90deg,#22c55e,#84cc16,#eab308,#f97316,#ef4444)}.gauge-fill.noise{background:linear-gradient(90deg,#22c55e,#06b6d4,#8b5cf6)}.gauge-fill.battery{background:linear-gradient(90deg,#ef4444,#eab308,#22c55e 50%,#22c55e)}.gauge-fill.default{background:var(--text-muted)}.gauge-labels{display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted);margin-top:6px}.loading-container{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:64px}.loading-spinner{width:48px;height:48px;border:3px solid var(--card-border);border-top-color:var(--primary);border-radius:50%;animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}.loading-text{margin-top:16px;color:var(--text-secondary);font-size:14px}.error-container{background:var(--error-light);border:1px solid rgba(239,68,68,.3);border-radius:var(--radius-md);padding:20px;display:flex;align-items:flex-start;gap:16px}.error-icon{color:var(--error);font-size:24px;flex-shrink:0}.error-content h3{margin:0 0 8px;font-size:16px;color:var(--error)}.error-content p{margin:0;font-size:14px;color:var(--text-primary)}.retry-button{margin-top:16px;padding:10px 20px;background:var(--error);color:#fff;border:none;border-radius:var(--radius-sm);font-size:14px;font-weight:500;cursor:pointer;transition:var(--transition);font-family:inherit}.retry-button:hover{background:#dc2626;transform:translateY(-1px)}.empty-state{text-align:center;padding:64px 24px;color:var(--text-secondary)}.empty-state .icon{font-size:64px;opacity:.3;margin-bottom:16px}.empty-state h3{font-size:18px;margin-bottom:8px;color:var(--text-primary)}.empty-state p{font-size:14px}.metric-card{background:var(--card-bg);border:1px solid var(--card-border);border-radius:var(--radius-lg);padding:24px;text-align:center;transition:var(--transition)}.metric-card.clickable{cursor:pointer}.metric-card.clickable:hover{border-color:var(--primary);transform:translateY(-2px);box-shadow:var(--shadow-lg)}.metric-icon-wrapper{width:64px;height:64px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px}.metric-icon{font-size:28px}.metric-icon-primary{background:var(--primary-light);color:var(--primary)}.metric-icon-success{background:var(--success-light);color:var(--success)}.metric-icon-warning{background:var(--warning-light);color:var(--warning)}.metric-icon-error{background:var(--error-light);color:var(--error)}.metric-icon-info{background:#06b6d426;color:#06b6d4}.metric-icon-purple{background:#8b5cf626;color:#8b5cf6}.metric-label{font-size:12px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;font-weight:500}.metric-value{font-size:36px;font-weight:700;line-height:1;margin-bottom:4px;color:var(--text-primary)}.metric-unit{font-size:18px;font-weight:400;opacity:.7;margin-left:2px}.metric-secondary{font-size:14px;color:var(--text-secondary);margin-bottom:8px}.metric-status{font-size:13px;display:flex;align-items:center;justify-content:center;gap:6px;margin-top:12px}.metric-status-normal{color:var(--success)}.metric-status-warning{color:var(--warning)}.metric-status-critical{color:var(--error)}.metric-status-inactive{color:var(--text-muted)}.metric-gauge-wrapper{width:100%;height:6px;background:var(--bg-tertiary);border-radius:3px;margin-top:16px;overflow:hidden}.metric-gauge-fill{height:100%;border-radius:3px;transition:width .5s ease}.metric-gauge-primary{background:var(--primary)}.metric-gauge-success{background:var(--success)}.metric-gauge-warning{background:linear-gradient(90deg,var(--success) 0%,var(--warning) 100%)}.metric-gauge-error{background:linear-gradient(90deg,var(--warning) 0%,var(--error) 100%)}.metric-gauge-info{background:#06b6d4}.metric-gauge-purple{background:#8b5cf6}.metric-gauge-labels{display:flex;justify-content:space-between;font-size:10px;color:var(--text-muted);margin-top:4px}.metric-cards-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px;margin-bottom:24px}@media (max-width: 768px){.metric-cards-grid{grid-template-columns:repeat(2,1fr)}.metric-card{padding:16px}.metric-icon-wrapper{width:48px;height:48px;margin-bottom:12px}.metric-icon{font-size:22px}.metric-value{font-size:28px}.metric-unit{font-size:14px}}@media (max-width: 480px){.metric-cards-grid{grid-template-columns:1fr 1fr;gap:12px}.metric-card{padding:12px}.metric-value{font-size:24px}.metric-label{font-size:10px}}.text-primary{color:var(--primary)}.text-success{color:var(--success)}.text-warning{color:var(--warning)}.text-error{color:var(--error)}.text-muted{color:var(--text-muted)}.font-mono{font-family:monospace}.font-medium{font-weight:500}.font-semibold{font-weight:600}.font-bold{font-weight:700}.table-wrapper{width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch}.filter-controls{display:flex;gap:12px;margin-bottom:20px;flex-wrap:wrap;align-items:center}@media (max-width: 640px){.filter-controls{flex-direction:column;align-items:stretch;gap:8px}.filter-controls select,.filter-controls button{width:100%}.view-mode-toggle{order:-1;width:100%}.view-mode-toggle button{flex:1}}@media (max-width: 1024px){.info-grid{grid-template-columns:1fr 1fr}.port-stats{grid-template-columns:repeat(3,1fr)}}@media (max-width: 768px){.meraki-panel{padding:16px}.meraki-header h1{font-size:22px}.meraki-header .version{display:none}.stats-grid{grid-template-columns:repeat(2,1fr)}.info-card{overflow-x:auto}.device-table{min-width:500px}.device-table th,.device-table td{padding:12px 16px;font-size:13px;white-space:nowrap}.device-table th:first-child,.device-table td:first-child{white-space:normal;min-width:150px}.device-header{flex-direction:column;gap:16px}.device-header .status-pill{margin-left:0}.cards-grid,.info-grid{grid-template-columns:1fr}.port-stats{grid-template-columns:repeat(2,1fr)}.port-details{padding:16px}.client-info{flex-direction:column;text-align:center;gap:12px}.readings-grid{grid-template-columns:1fr}.reading-card{padding:24px}.reading-card .reading-value{font-size:36px}.nav-tabs{flex-wrap:wrap}.nav-tab{padding:8px 14px;font-size:13px}}@media (max-width: 480px){.meraki-panel{padding:12px}.meraki-header{gap:12px}.meraki-header .logo{width:40px;height:40px;font-size:20px}.meraki-header h1{font-size:18px}.stats-grid{grid-template-columns:1fr 1fr;gap:12px}.stat-card{padding:16px}.stat-card .value{font-size:24px}.device-table th,.device-table td{padding:10px 12px;font-size:12px}.device-icon{width:32px;height:32px;font-size:14px}.device-name-cell{gap:8px}.device-name-cell .name{font-size:14px}.device-model{font-size:12px}.info-card{padding:16px}.info-card h3{font-size:13px;margin-bottom:16px}.port-stats{grid-template-columns:1fr 1fr;gap:12px}.port-stat .value{font-size:16px}.switch-chassis{padding:12px 16px}.port{width:32px;height:28px}.port .num{font-size:8px}.port-legend{flex-wrap:wrap;gap:12px;font-size:12px}.back-button{font-size:13px}}';
class kt extends HTMLElement {
  constructor() {
    super(...arguments);
    ze(this, "_hass", null);
    ze(this, "_panel", null);
    ze(this, "_narrow", !1);
    ze(this, "_route", null);
    ze(this, "_root", null);
    ze(this, "_mountPoint", null);
    ze(this, "_styleEl", null);
  }
  /**
   * Called when the element is added to the DOM.
   */
  connectedCallback() {
    if (this._styleEl = document.createElement("style"), this._styleEl.textContent = _r, this.appendChild(this._styleEl), !document.getElementById("meraki-panel-styles")) {
      const i = document.createElement("style");
      i.id = "meraki-panel-styles", i.textContent = _r, document.head.appendChild(i);
    }
    this._mountPoint = document.createElement("div"), this._mountPoint.id = "meraki-panel-root", this.appendChild(this._mountPoint), this._root = Qe.createRoot(this._mountPoint), this._render();
  }
  /**
   * Called when the element is removed from the DOM.
   */
  disconnectedCallback() {
    this._root && (this._root.unmount(), this._root = null), this._mountPoint && (this._mountPoint.remove(), this._mountPoint = null), this._styleEl && (this._styleEl.remove(), this._styleEl = null);
  }
  /**
   * Home Assistant sets this property with the hass object.
   * This is called frequently as state changes.
   */
  set hass(i) {
    this._hass = i, this._render();
  }
  get hass() {
    return this._hass;
  }
  /**
   * Home Assistant sets this property with panel configuration.
   * This is called once when the panel is loaded.
   */
  set panel(i) {
    this._panel = i, this._render();
  }
  get panel() {
    return this._panel;
  }
  /**
   * Home Assistant sets this to indicate narrow/mobile mode.
   */
  set narrow(i) {
    this._narrow = i, this._render();
  }
  get narrow() {
    return this._narrow;
  }
  /**
   * Home Assistant sets this with route information.
   */
  set route(i) {
    this._route = i, this._render();
  }
  get route() {
    return this._route;
  }
  /**
   * Render the React application with current props.
   */
  _render() {
    !this._root || !this._hass || this._root.render(
      /* @__PURE__ */ e.jsx(de.StrictMode, { children: /* @__PURE__ */ e.jsx(
        Nt,
        {
          hass: this._hass,
          panel: this._panel,
          narrow: this._narrow,
          route: this._route
        }
      ) })
    );
  }
}
customElements.get("meraki-panel") || customElements.define("meraki-panel", kt);

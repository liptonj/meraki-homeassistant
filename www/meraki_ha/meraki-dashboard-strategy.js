class m {
  static async generate(t, r) {
    const i = t.options || {};
    let e;
    try {
      e = await r.connection.sendMessagePromise({
        type: "meraki_ha/get_overview"
      });
    } catch {
      e = { networks: [], devices: [], ssids: [], clients: [] };
    }
    const c = (e == null ? void 0 : e.networks) || [], s = (e == null ? void 0 : e.devices) || [], o = (e == null ? void 0 : e.ssids) || [];
    e != null && e.clients;
    const a = [];
    if (a.push({
      title: "Overview",
      path: "overview",
      badges: [
        { type: "custom:meraki-status-badge" },
        { type: "custom:meraki-clients-badge" }
      ],
      cards: [
        { type: "custom:meraki-overview-card" },
        { type: "custom:meraki-clients-card", limit: 10 }
      ]
    }), i.group_by === "network")
      for (const n of c)
        a.push({
          title: n.name,
          path: n.id,
          cards: this._generateNetworkCards(n, { devices: s, ssids: o })
        });
    if (i.group_by === "device_type") {
      const n = [...new Set(s.map((d) => d.productType))];
      for (const d of n) {
        const p = s.filter((l) => l.productType === d);
        a.push({
          title: this._formatDeviceTypeName(d),
          path: d,
          cards: this._generateDeviceTypeCards(p)
        });
      }
    }
    return i.include_ssids && o.length > 0 && a.push({
      title: "SSIDs",
      path: "ssids",
      cards: this._generateSSIDCards(o, c)
    }), i.include_clients && a.push({
      title: "Clients",
      path: "clients",
      cards: [
        { type: "custom:meraki-clients-card", limit: 50 }
      ]
    }), i.include_devices && a.push({
      title: "Devices",
      path: "devices",
      cards: this._generateDeviceCards(s)
    }), { views: a };
  }
  static _formatDeviceTypeName(t) {
    return {
      switch: "Switches",
      wireless: "Wireless APs",
      appliance: "Appliances",
      camera: "Cameras",
      sensor: "Sensors",
      cellularGateway: "Cellular Gateways"
    }[t] || t.charAt(0).toUpperCase() + t.slice(1);
  }
  static _generateNetworkCards(t, r) {
    const i = [];
    r.ssids.filter((s) => s.networkId === t.id).length > 0 && i.push({
      type: "custom:meraki-ssids-list-card",
      network_id: t.id
    });
    const c = r.devices.filter((s) => s.networkId === t.id);
    for (const s of c)
      s.productType === "switch" ? i.push({
        type: "custom:meraki-switch-ports-card",
        device_serial: s.serial
      }) : i.push({
        type: "custom:meraki-device-card",
        device_serial: s.serial,
        compact: !0
      });
    return i;
  }
  static _generateDeviceTypeCards(t) {
    return [{
      type: "grid",
      columns: 3,
      cards: t.map((r) => ({
        type: "custom:meraki-device-card",
        device_serial: r.serial,
        compact: !0
      }))
    }];
  }
  static _generateSSIDCards(t, r) {
    const i = [], e = /* @__PURE__ */ new Map();
    for (const c of t) {
      const s = e.get(c.networkId) || [];
      s.push(c), e.set(c.networkId, s);
    }
    for (const [c] of e) {
      const s = r.find((o) => o.id === c);
      i.push({
        type: "custom:meraki-ssids-list-card",
        network_id: c,
        title: s == null ? void 0 : s.name
      });
    }
    return i;
  }
  static _generateDeviceCards(t) {
    return !t || t.length === 0 ? [{ type: "markdown", content: "No devices found." }] : [{
      type: "grid",
      columns: 3,
      cards: t.map((r) => ({
        type: "custom:meraki-device-card",
        device_serial: r.serial,
        compact: !0
      }))
    }];
  }
}
customElements.define("ll-strategy-meraki-dashboard", m);
export {
  m as MerakiDashboardStrategy,
  m as default
};

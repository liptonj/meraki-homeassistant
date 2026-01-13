class c {
  static async generate(s, i) {
    const t = s.options || {}, a = await i.connection.sendMessagePromise({
      type: "meraki_ha/get_overview"
    }), r = [];
    if (r.push({
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
    }), t.group_by === "network")
      for (const e of a.networks)
        r.push({
          title: e.name,
          path: e.id,
          cards: this._generateNetworkCards(e, a)
        });
    return t.include_devices && r.push({
      title: "Devices",
      path: "devices",
      cards: this._generateDeviceCards(a.devices)
    }), { views: r };
  }
  static _generateNetworkCards(s, i) {
    const t = [];
    i.ssids.filter((e) => e.networkId === s.id).length > 0 && t.push({
      type: "custom:meraki-ssids-list-card",
      network_id: s.id
    });
    const r = i.devices.filter((e) => e.networkId === s.id);
    for (const e of r)
      e.productType === "switch" ? t.push({
        type: "custom:meraki-switch-ports-card",
        device_serial: e.serial
      }) : t.push({
        type: "custom:meraki-device-card",
        device_serial: e.serial,
        compact: !0
      });
    return t;
  }
  static _generateDeviceCards(s) {
    return [{
      type: "grid",
      columns: 3,
      cards: s.map((i) => ({
        type: "custom:meraki-device-card",
        device_serial: i.serial,
        compact: !0
      }))
    }];
  }
}
customElements.define("ll-strategy-meraki-dashboard", c);

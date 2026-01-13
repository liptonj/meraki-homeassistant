
import { HomeAssistant } from 'custom-card-helpers';

class MerakiDashboardStrategy {
  static async generate(config: any, hass: HomeAssistant) {
    const options = config.options || {};

    // Fetch Meraki data from Home Assistant
    const data = await hass.connection.sendMessagePromise({
      type: 'meraki_ha/get_overview',
    });

    const views = [];

    // Overview view
    views.push({
      title: 'Overview',
      path: 'overview',
      badges: [
        { type: 'custom:meraki-status-badge' },
        { type: 'custom:meraki-clients-badge' },
      ],
      cards: [
        { type: 'custom:meraki-overview-card' },
        { type: 'custom:meraki-clients-card', limit: 10 },
      ],
    });

    // Group by network
    if (options.group_by === 'network') {
      for (const network of data.networks) {
        views.push({
          title: network.name,
          path: network.id,
          cards: this._generateNetworkCards(network, data),
        });
      }
    }

    // Devices view
    if (options.include_devices) {
      views.push({
        title: 'Devices',
        path: 'devices',
        cards: this._generateDeviceCards(data.devices),
      });
    }

    return { views };
  }

  static _generateNetworkCards(network: any, data: any) {
    const cards = [];

    const ssids = data.ssids.filter((s: any) => s.networkId === network.id);
    if (ssids.length > 0) {
      cards.push({
        type: 'custom:meraki-ssids-list-card',
        network_id: network.id,
      });
    }

    const devices = data.devices.filter((d: any) => d.networkId === network.id);
    for (const device of devices) {
      if (device.productType === 'switch') {
        cards.push({
          type: 'custom:meraki-switch-ports-card',
          device_serial: device.serial,
        });
      } else {
        cards.push({
          type: 'custom:meraki-device-card',
          device_serial: device.serial,
          compact: true,
        });
      }
    }

    return cards;
  }

  static _generateDeviceCards(devices: any) {
    return [{
      type: 'grid',
      columns: 3,
      cards: devices.map((device: any) => ({
        type: 'custom:meraki-device-card',
        device_serial: device.serial,
        compact: true,
      }))
    }];
  }
}

customElements.define('ll-strategy-meraki-dashboard', MerakiDashboardStrategy as any);

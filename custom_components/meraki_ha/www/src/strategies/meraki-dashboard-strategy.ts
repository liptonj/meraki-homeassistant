import { HomeAssistant } from 'custom-card-helpers';

interface MerakiDevice {
  serial: string;
  networkId: string;
  productType: string;
  name?: string;
}

interface MerakiNetwork {
  id: string;
  name: string;
}

interface MerakiSSID {
  networkId: string;
  name: string;
}

interface MerakiData {
  networks?: MerakiNetwork[];
  devices?: MerakiDevice[];
  ssids?: MerakiSSID[];
  clients?: any[];
}

interface StrategyOptions {
  include_devices?: boolean;
  include_clients?: boolean;
  include_ssids?: boolean;
  group_by?: 'network' | 'device_type' | 'none';
}

interface LovelaceCard {
  type: string;
  [key: string]: any;
}

interface LovelaceView {
  title: string;
  path: string;
  badges?: LovelaceCard[];
  cards: LovelaceCard[];
}

export class MerakiDashboardStrategy {
  static async generate(config: any, hass: HomeAssistant): Promise<{ views: LovelaceView[] }> {
    const options: StrategyOptions = config.options || {};

    // Fetch Meraki data from Home Assistant with error handling
    let data: MerakiData;
    try {
      data = await hass.connection.sendMessagePromise({
        type: 'meraki_ha/get_overview',
      }) as MerakiData;
    } catch {
      // Return minimal dashboard on error
      data = { networks: [], devices: [], ssids: [], clients: [] };
    }

    // Ensure arrays exist to prevent undefined access
    const networks = data?.networks || [];
    const devices = data?.devices || [];
    const ssids = data?.ssids || [];
    const clients = data?.clients || [];

    const views: LovelaceView[] = [];

    // Overview view (always created)
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
      for (const network of networks) {
        views.push({
          title: network.name,
          path: network.id,
          cards: this._generateNetworkCards(network, { devices, ssids }),
        });
      }
    }

    // Group by device type
    if (options.group_by === 'device_type') {
      const deviceTypes = [...new Set(devices.map((d) => d.productType))];
      for (const deviceType of deviceTypes) {
        const typeDevices = devices.filter((d) => d.productType === deviceType);
        views.push({
          title: this._formatDeviceTypeName(deviceType),
          path: deviceType,
          cards: this._generateDeviceTypeCards(typeDevices),
        });
      }
    }

    // SSIDs view
    if (options.include_ssids && ssids.length > 0) {
      views.push({
        title: 'SSIDs',
        path: 'ssids',
        cards: this._generateSSIDCards(ssids, networks),
      });
    }

    // Clients view
    if (options.include_clients) {
      views.push({
        title: 'Clients',
        path: 'clients',
        cards: [
          { type: 'custom:meraki-clients-card', limit: 50 },
        ],
      });
    }

    // Devices view
    if (options.include_devices) {
      views.push({
        title: 'Devices',
        path: 'devices',
        cards: this._generateDeviceCards(devices),
      });
    }

    return { views };
  }

  static _formatDeviceTypeName(deviceType: string): string {
    const typeNames: Record<string, string> = {
      'switch': 'Switches',
      'wireless': 'Wireless APs',
      'appliance': 'Appliances',
      'camera': 'Cameras',
      'sensor': 'Sensors',
      'cellularGateway': 'Cellular Gateways',
    };
    return typeNames[deviceType] || deviceType.charAt(0).toUpperCase() + deviceType.slice(1);
  }

  static _generateNetworkCards(network: MerakiNetwork, data: { devices: MerakiDevice[]; ssids: MerakiSSID[] }): LovelaceCard[] {
    const cards: LovelaceCard[] = [];

    const ssids = data.ssids.filter((s) => s.networkId === network.id);
    if (ssids.length > 0) {
      cards.push({
        type: 'custom:meraki-ssids-list-card',
        network_id: network.id,
      });
    }

    const devices = data.devices.filter((d) => d.networkId === network.id);
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

  static _generateDeviceTypeCards(devices: MerakiDevice[]): LovelaceCard[] {
    return [{
      type: 'grid',
      columns: 3,
      cards: devices.map((device) => ({
        type: 'custom:meraki-device-card',
        device_serial: device.serial,
        compact: true,
      })),
    }];
  }

  static _generateSSIDCards(ssids: MerakiSSID[], networks: MerakiNetwork[]): LovelaceCard[] {
    const cards: LovelaceCard[] = [];
    
    // Group SSIDs by network
    const ssidsByNetwork = new Map<string, MerakiSSID[]>();
    for (const ssid of ssids) {
      const existing = ssidsByNetwork.get(ssid.networkId) || [];
      existing.push(ssid);
      ssidsByNetwork.set(ssid.networkId, existing);
    }

    for (const [networkId] of ssidsByNetwork) {
      const network = networks.find((n) => n.id === networkId);
      cards.push({
        type: 'custom:meraki-ssids-list-card',
        network_id: networkId,
        title: network?.name,
      });
    }

    return cards;
  }

  static _generateDeviceCards(devices: MerakiDevice[]): LovelaceCard[] {
    if (!devices || devices.length === 0) {
      return [{ type: 'markdown', content: 'No devices found.' }];
    }
    
    return [{
      type: 'grid',
      columns: 3,
      cards: devices.map((device) => ({
        type: 'custom:meraki-device-card',
        device_serial: device.serial,
        compact: true,
      })),
    }];
  }
}

customElements.define('ll-strategy-meraki-dashboard', MerakiDashboardStrategy as any);

export default MerakiDashboardStrategy;

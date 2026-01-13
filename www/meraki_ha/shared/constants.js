/**
 * Card type constants for Meraki Lovelace cards.
 */

export const CARD_TYPES = {
  OVERVIEW: 'meraki-overview-card',
  // From cursor-review branch
  DEVICE: 'meraki-device-card',
  CLIENTS: 'meraki-clients-card',
  SWITCH_PORTS: 'meraki-switch-ports-card',
  // From feature branch
  DEVICE_LIST: 'meraki-device-list-card',
  CLIENT_LIST: 'meraki-client-list-card',
  CLIENT: 'meraki-client-card',
  DEVICES: 'meraki-devices-card',
  MQTT_STATUS: 'meraki-mqtt-status-card',
  CAMERA: 'meraki-camera-card',
  // New cards
  SSIDS_LIST: 'meraki-ssids-list-card',
  EVENTS: 'meraki-events-card',
  GUEST_ACCESS: 'meraki-guest-access-card',
};

export const EDITOR_TYPES = {
  [CARD_TYPES.OVERVIEW]: 'meraki-overview-card-editor',
  // From cursor-review branch
  [CARD_TYPES.DEVICE]: 'meraki-device-card-editor',
  [CARD_TYPES.CLIENTS]: 'meraki-clients-card-editor',
  [CARD_TYPES.SWITCH_PORTS]: 'meraki-switch-ports-card-editor',
  // From feature branch
  [CARD_TYPES.DEVICE_LIST]: 'meraki-device-list-card-editor',
  [CARD_TYPES.CLIENT_LIST]: 'meraki-client-list-card-editor',
  [CARD_TYPES.CLIENT]: 'meraki-client-card-editor',
  [CARD_TYPES.CAMERA]: 'meraki-camera-card-editor',
};

export const CARD_DEFINITIONS = [
  {
    type: CARD_TYPES.OVERVIEW,
    name: 'Meraki Overview',
    description:
      'Overview of your Meraki network health with device counts, clients, and alerts',
    preview: true,
  },
  {
    type: CARD_TYPES.DEVICE,
    name: 'Meraki Device',
    description:
      'Single device status card showing details, firmware, and client count',
    preview: true,
  },
  {
    type: CARD_TYPES.CLIENTS,
    name: 'Meraki Clients',
    description: 'Client list with filtering, sorting, and pagination',
    preview: true,
  },
  {
    type: CARD_TYPES.SWITCH_PORTS,
    name: 'Meraki Switch Ports',
    description:
      'Visual switch port status grid with PoE indicators and tooltips',
    preview: true,
  },
  {
    type: CARD_TYPES.DEVICES,
    name: 'Meraki Devices Card',
    description: 'A card to display Meraki network devices.',
    preview: true,
  },
  {
    type: CARD_TYPES.MQTT_STATUS,
    name: 'Meraki MQTT Status Card',
    description: 'A card to display the status of the Meraki MQTT service.',
    preview: true,
  },
  {
    type: CARD_TYPES.CLIENT,
    name: 'Meraki Client Card',
    description: 'A card to display details for a single Meraki client.',
    preview: true,
  },
  {
    type: CARD_TYPES.CAMERA,
    name: 'Meraki Camera Card',
    description: 'A card to display Meraki camera snapshots and controls.',
    preview: true,
  },
  {
    type: CARD_TYPES.SSIDS_LIST,
    name: 'Meraki SSIDs List',
    description:
      'Display all SSIDs across networks with status and client counts',
    preview: true,
  },
  {
    type: CARD_TYPES.EVENTS,
    name: 'Meraki Events',
    description: 'Display recent network events and alerts with filtering',
    preview: true,
  },
  {
    type: CARD_TYPES.GUEST_ACCESS,
    name: 'Meraki Guest Access',
    description: 'Manage guest WiFi access with timed keys',
    preview: true,
  },
];

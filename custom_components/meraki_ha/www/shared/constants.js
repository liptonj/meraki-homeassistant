/**
 * Card type constants for Meraki Lovelace cards.
 */

export const CARD_TYPES = {
  OVERVIEW: 'custom:meraki-overview-card',
  DEVICE: 'custom:meraki-device-card',
  DEVICES_BY_TYPE: 'custom:meraki-devices-by-type-card',
  CLIENTS: 'custom:meraki-clients-card',
  SWITCH_PORTS: 'custom:meraki-switch-ports-card',
  CLIENT: 'custom:meraki-client-card',
  MQTT_STATUS: 'custom:meraki-mqtt-status-card',
  CAMERA: 'custom:meraki-camera-card',
  SSIDS_LIST: 'custom:meraki-ssids-list-card',
  EVENTS: 'custom:meraki-events-card',
  GUEST_ACCESS: 'custom:meraki-guest-access-card',
};

export const EDITOR_TYPES = {
  [CARD_TYPES.OVERVIEW]: 'meraki-overview-card-editor',
  [CARD_TYPES.DEVICE]: 'meraki-device-card-editor',
  [CARD_TYPES.DEVICES_BY_TYPE]: 'meraki-devices-by-type-card-editor',
  [CARD_TYPES.CLIENTS]: 'meraki-clients-card-editor',
  [CARD_TYPES.SWITCH_PORTS]: 'meraki-switch-ports-card-editor',
  [CARD_TYPES.CLIENT]: 'meraki-client-card-editor',
  [CARD_TYPES.MQTT_STATUS]: 'meraki-mqtt-status-card-editor',
  [CARD_TYPES.CAMERA]: 'meraki-camera-card-editor',
  [CARD_TYPES.SSIDS_LIST]: 'meraki-ssids-list-card-editor',
  [CARD_TYPES.EVENTS]: 'meraki-events-card-editor',
  [CARD_TYPES.GUEST_ACCESS]: 'meraki-guest-access-card-editor',
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
    type: CARD_TYPES.DEVICES_BY_TYPE,
    name: 'Meraki Devices by Type',
    description: 'Display devices grouped by type with tables and pagination',
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
    type: CARD_TYPES.CLIENT,
    name: 'Meraki Client Card',
    description: 'A card to display details for a single Meraki client.',
    preview: true,
  },
  {
    type: CARD_TYPES.MQTT_STATUS,
    name: 'Meraki MQTT Status',
    description: 'Display the status of the Meraki MQTT service.',
    preview: true,
  },
  {
    type: CARD_TYPES.CAMERA,
    name: 'Meraki Camera',
    description: 'Display Meraki camera snapshots and controls.',
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

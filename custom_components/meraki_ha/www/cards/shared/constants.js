/**
 * Card type constants for Meraki Lovelace cards.
 */

export const CARD_TYPES = {
  OVERVIEW: 'meraki-overview-card',
  DEVICE: 'meraki-device-card',
  CLIENTS: 'meraki-clients-card',
  SWITCH_PORTS: 'meraki-switch-ports-card',
};

export const EDITOR_TYPES = {
  [CARD_TYPES.OVERVIEW]: 'meraki-overview-card-editor',
  [CARD_TYPES.DEVICE]: 'meraki-device-card-editor',
  [CARD_TYPES.CLIENTS]: 'meraki-clients-card-editor',
  [CARD_TYPES.SWITCH_PORTS]: 'meraki-switch-ports-card-editor',
};

export const CARD_DEFINITIONS = [
  {
    type: CARD_TYPES.OVERVIEW,
    name: 'Meraki Overview',
    description: 'Overview of your Meraki network health with device counts, clients, and alerts',
    preview: true,
  },
  {
    type: CARD_TYPES.DEVICE,
    name: 'Meraki Device',
    description: 'Single device status card showing details, firmware, and client count',
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
    description: 'Visual switch port status grid with PoE indicators and tooltips',
    preview: true,
  },
];

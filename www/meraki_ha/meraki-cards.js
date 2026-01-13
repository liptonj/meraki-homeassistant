/**
 * Meraki Lovelace Cards
 *
 * This file is the main entry point for all Meraki Lovelace cards.
 * It imports and registers all cards with Home Assistant.
 */

import { CARD_DEFINITIONS } from './shared/constants.js';

// Import shared components (from feature branch)
import './shared/meraki-card-base.js';
import './shared/meraki-editor-base.js';

// Import all card components (from cursor-review branch)
import './meraki-overview-card.js';
import './meraki-device-card.js';
import './meraki-devices-by-type-card.js'; // NEW: Grouped devices card
import './meraki-clients-card.js';
import './meraki-switch-ports-card.js';

// Import card components (from feature branch)
import './meraki-devices-card';
import './meraki-mqtt-status-card';
import './meraki-client-card/meraki-client-card.js';
import './meraki-client-card/meraki-client-card-editor.js';
import './meraki-camera-card/meraki-camera-card.js';
import './meraki-camera-card/meraki-camera-card-editor.js';

// Import new cards
import './meraki-ssids-list-card.js';
import './meraki-events-card.js';
import './meraki-guest-access-card.js';
import './meraki-mqtt-status-card.js'; // JavaScript version

// Register cards with Home Assistant's custom cards registry
window.customCards = window.customCards || [];

CARD_DEFINITIONS.forEach((card) => {
  // Avoid duplicate registrations
  if (!window.customCards.some((c) => c.type === card.type)) {
    window.customCards.push(card);
  }
});

console.info(
  '%c MERAKI CARDS v2.0 ',
  'color: #fff; background: #2980b9; font-weight: 700; padding: 4px 8px; border-radius: 4px;',
  `Loaded ${CARD_DEFINITIONS.length} cards: ${CARD_DEFINITIONS.map(
    (c) => c.type
  ).join(', ')}`
);

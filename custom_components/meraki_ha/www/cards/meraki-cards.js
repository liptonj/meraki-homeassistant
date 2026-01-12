/**
 * Meraki Lovelace Cards
 *
 * This file is the main entry point for all Meraki Lovelace cards.
 * It imports and registers all cards with Home Assistant.
 */

import { CARD_DEFINITIONS } from './shared/constants.js';

// Import all card components
import './meraki-overview-card.js';
import './meraki-device-card.js';
import './meraki-clients-card.js';
import './meraki-switch-ports-card.js';

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
  `Loaded ${CARD_DEFINITIONS.length} cards: ${CARD_DEFINITIONS.map((c) => c.type).join(', ')}`
);

// This file is the main entry point for all Meraki Lovelace cards.
// It registers all cards with Lovelace.

// Import card components
import './meraki-mqtt-status-card';
import './meraki-client-card/meraki-client-card.js';
import './meraki-client-card/meraki-client-card-editor.js';

console.info(
  '%c MERAKI CARDS LOADED ',
  'color: #2980b9; background: #fff; font-weight: 700;'
);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'meraki-mqtt-status-card',
  name: 'Meraki MQTT Status Card',
  preview: true,
  description: 'A card to display the status of the Meraki MQTT service.',
});

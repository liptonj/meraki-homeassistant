import './meraki-mqtt-status-card';

console.info(
  `%c MERAKI-MQTT-STATUS-CARD %c LOADED `,
  'color: #2980b9; background: #fff; font-weight: 700;',
  'color: #2980b9; background: #fff; font-weight: 700;'
);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'meraki-mqtt-status-card',
  name: 'Meraki MQTT Status Card',
  preview: true,
  description: 'A card to display the status of the Meraki MQTT service.',
});

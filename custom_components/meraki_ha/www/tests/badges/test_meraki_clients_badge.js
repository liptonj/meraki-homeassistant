import { html, fixture, expect } from '@open-wc/testing';
import '../../src/badges/meraki-clients-badge';

describe('MerakiClientsBadge', () => {
  let element;
  const hass = {
    states: {
      'device_tracker.meraki_client_1': { entity_id: 'device_tracker.meraki_client_1', state: 'home', attributes: { network_id: 'L_123' } },
      'device_tracker.meraki_client_2': { entity_id: 'device_tracker.meraki_client_2', state: 'home', attributes: { network_id: 'L_123' } },
      'device_tracker.meraki_client_3': { entity_id: 'device_tracker.meraki_client_3', state: 'not_home', attributes: { network_id: 'L_123' } },
      'device_tracker.meraki_client_4': { entity_id: 'device_tracker.meraki_client_4', state: 'home', attributes: { network_id: 'L_456' } },
    },
  };

  beforeEach(async () => {
    element = await fixture(html`<meraki-clients-badge></meraki-clients-badge>`);
  });

  it('shows client count', () => {
    element.setConfig({ title: 'Clients' });
    element.hass = hass;
    expect(element.innerHTML).to.include('Clients: 3');
  });

  it('filters by network_id', () => {
    element.setConfig({ title: 'Clients', network_id: 'L_123' });
    element.hass = hass;
    expect(element.innerHTML).to.include('Clients: 2');
  });

  it('updates on state change', () => {
    element.setConfig({ title: 'Clients' });
    element.hass = hass;
    const newHass = JSON.parse(JSON.stringify(hass));
    newHass.states['device_tracker.meraki_client_5'] = { entity_id: 'device_tracker.meraki_client_5', state: 'home', attributes: { network_id: 'L_123' } };
    element.hass = newHass;
    expect(element.innerHTML).to.include('Clients: 4');
  });
});


import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';
import '../src/badges/meraki-clients-badge';

describe('MerakiClientsBadge', () => {
  let element;
  const hass = {
    states: {
      'device_tracker.meraki_client_1': { state: 'home', attributes: { network_id: 'L_123' } },
      'device_tracker.meraki_client_2': { state: 'home', attributes: { network_id: 'L_123' } },
      'device_tracker.meraki_client_3': { state: 'not_home', attributes: { network_id: 'L_123' } },
      'device_tracker.meraki_client_4': { state: 'home', attributes: { network_id: 'L_456' } },
    },
  };

  beforeEach(async () => {
    element = await fixture(html`<meraki-clients-badge .hass=${hass}></meraki-clients-badge>`);
  });

  it('shows client count', async () => {
    element.setConfig({ title: 'Clients' });
    await element.updateComplete;
    expect(element.innerHTML).to.include('Clients: 3');
  });

  it('filters by network_id', async () => {
    element.setConfig({ title: 'Clients', network_id: 'L_123' });
    await element.updateComplete;
    expect(element.innerHTML).to.include('Clients: 2');
  });

  it('updates on state change', async () => {
    element.setConfig({ title: 'Clients' });
    const newHass = JSON.parse(JSON.stringify(hass));
    newHass.states['device_tracker.meraki_client_5'] = { state: 'home', attributes: { network_id: 'L_123' } };
    element.hass = newHass;
    await element.updateComplete;
    expect(element.innerHTML).to.include('Clients: 4');
  });
});


import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';
import '../src/badges/meraki-status-badge';

describe('MerakiStatusBadge', () => {
  let element;
  const hass = {
    states: {
      'sensor.meraki_device_1': { state: 'online', attributes: { meraki_device_status: 'online' } },
      'sensor.meraki_device_2': { state: 'online', attributes: { meraki_device_status: 'online' } },
      'sensor.meraki_device_3': { state: 'offline', attributes: { meraki_device_status: 'offline' } },
      'sensor.meraki_client_1': { state: 'online', attributes: { meraki_device_status: 'online' } },
    },
  };

  beforeEach(async () => {
    element = await fixture(html`<meraki-status-badge .hass=${hass}></meraki-status-badge>`);
    element.setConfig({ title: 'Network', show_count: true });
  });

  it('renders with config', () => {
    expect(element.shadowRoot).to.exist;
  });

  it('shows correct status icon', () => {
    expect(element.innerHTML).to.include('🟡');
    const newHass = JSON.parse(JSON.stringify(hass));
    delete newHass.states['sensor.meraki_device_3'];
    element.hass = newHass;
    expect(element.innerHTML).to.include('🟢');
  });

  it('counts devices correctly', () => {
    expect(element.innerHTML).to.include('2 online');
  });

  it('updates on hass change', async () => {
    const newHass = {
      states: {
        'sensor.meraki_device_1': { state: 'online', attributes: { meraki_device_status: 'online' } },
      },
    };
    element.hass = newHass;
    await element.updateComplete;
    expect(element.innerHTML).to.include('1 online');
  });

  it('handles no devices gracefully', async () => {
    element.hass = { states: {} };
    await element.updateComplete;
    expect(element.innerHTML).to.include('0 online');
  });
});

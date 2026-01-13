import { html, fixture, expect } from '@open-wc/testing';
import '../../src/badges/meraki-alerts-badge';

describe('MerakiAlertsBadge', () => {
  let element;
  const hass = {
    states: {
      'sensor.meraki_alerts_warning': { entity_id: 'sensor.meraki_alerts_warning', state: '3' },
      'sensor.meraki_alerts_critical': { entity_id: 'sensor.meraki_alerts_critical', state: '1' },
      'sensor.meraki_alerts_info': { entity_id: 'sensor.meraki_alerts_info', state: '5' },
    },
  };

  beforeEach(async () => {
    element = await fixture(html`<meraki-alerts-badge></meraki-alerts-badge>`);
  });

  it('shows alert count', () => {
    element.setConfig({ severity: 'warning' });
    element.hass = hass;
    expect(element.innerHTML).to.include('3 warning alerts');
  });

  it('filters by severity', () => {
    element.setConfig({ severity: 'critical' });
    element.hass = hass;
    expect(element.innerHTML).to.include('1 critical alerts');
  });

  it('correct icon for severity', () => {
    element.setConfig({ severity: 'warning' });
    element.hass = hass;
    expect(element.innerHTML).to.include('⚠️');

    element.setConfig({ severity: 'critical' });
    element.hass = hass;
    expect(element.innerHTML).to.include('🔥');

    element.setConfig({ severity: 'info' });
    element.hass = hass;
    expect(element.innerHTML).to.include('ℹ️');
  });
});

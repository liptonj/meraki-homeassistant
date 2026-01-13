
import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';
import '../src/badges/meraki-alerts-badge';

describe('MerakiAlertsBadge', () => {
  let element;
  const hass = {
    states: {
      'sensor.meraki_alerts_warning': { state: '3' },
      'sensor.meraki_alerts_critical': { state: '1' },
    },
  };

  beforeEach(async () => {
    element = await fixture(html`<meraki-alerts-badge .hass=${hass}></meraki-alerts-badge>`);
  });

  it('shows alert count', async () => {
    element.setConfig({ severity: 'warning' });
    await element.updateComplete;
    expect(element.innerHTML).to.include('3 warning alerts');
  });

  it('filters by severity', async () => {
    element.setConfig({ severity: 'critical' });
    await element.updateComplete;
    expect(element.innerHTML).to.include('1 critical alerts');
  });

  it('correct icon for severity', async () => {
    element.setConfig({ severity: 'warning' });
    await element.updateComplete;
    expect(element.innerHTML).to.include('⚠️');

    element.setConfig({ severity: 'critical' });
    await element.updateComplete;
    expect(element.innerHTML).to.include('🔥');

    element.setConfig({ severity: 'info' });
    await element.updateComplete;
    expect(element.innerHTML).to.include('ℹ️');
  });
});

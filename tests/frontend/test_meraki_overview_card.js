import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';
import { MerakiOverviewCard, MerakiOverviewCardEditor } from '../../www/meraki_ha/meraki-overview-card.js';

describe('MerakiOverviewCard', () => {
  let element;
  let hass;

  beforeEach(async () => {
    hass = {
      connection: {
        sendMessagePromise: sinon.stub().resolves({
          devices: [
            { serial: '123', name: 'AP1', status: 'online' },
            { serial: '456', name: 'Switch1', status: 'alerting', statusMessage: 'High CPU' },
            { serial: '789', name: 'AP2', status: 'offline' },
          ],
          clients: [{ mac: 'aa:bb:cc:dd:ee:ff' }, { mac: '11:22:33:44:55:66' }],
          ssids: [
            { number: 0, name: 'Corp', enabled: true },
            { number: 1, name: 'Guest', enabled: true },
            { number: 2, name: 'IoT', enabled: false },
          ],
        }),
        subscribeMessage: sinon.stub().returns(() => {}),
      },
    };

    element = await fixture(html`<meraki-overview-card .hass=${hass}></meraki-overview-card>`);
    element.setConfig({ config_entry_id: 'test-entry' });
    await element.updateComplete;
  });

  it('renders with default config', async () => {
    await element._callMerakiApi('meraki/get_overview');
    await element.updateComplete;
    expect(element.shadowRoot.querySelector('ha-card')).to.exist;
  });

  it('getStubConfig returns valid default config', () => {
    const config = MerakiOverviewCard.getStubConfig();
    expect(config).to.have.property('title');
    expect(config).to.have.property('show_devices');
    expect(config).to.have.property('show_clients');
  });

  it('getConfigForm returns valid schema', () => {
    const form = MerakiOverviewCard.getConfigForm();
    expect(form).to.have.property('schema');
    expect(form.schema).to.be.an('array');
  });

  it('getCardSize returns a number', () => {
    expect(element.getCardSize()).to.be.a('number');
    expect(element.getCardSize()).to.equal(3);
  });

  it('getGridOptions returns valid grid config', () => {
    const options = element.getGridOptions();
    expect(options).to.have.property('rows');
    expect(options).to.have.property('columns');
    expect(options.columns % 3).to.equal(0);
  });

  it('calculates device counts correctly', async () => {
    await element.fetchData();
    await element.updateComplete;
    expect(element._deviceCounts.online).to.equal(1);
    expect(element._deviceCounts.alerting).to.equal(1);
    expect(element._deviceCounts.offline).to.equal(1);
  });

  it('displays client count', async () => {
    await element.fetchData();
    await element.updateComplete;
    const clientCard = element.shadowRoot.querySelector('.stat-card:nth-child(4)');
    expect(clientCard).to.exist;
  });

  it('displays active SSID count', async () => {
    await element.fetchData();
    await element.updateComplete;
    // 2 SSIDs are enabled
    const text = element.shadowRoot.textContent;
    expect(text).to.include('2');
  });

  it('renders alert list', async () => {
    await element.fetchData();
    await element.updateComplete;
    const alertSection = element.shadowRoot.querySelector('.alerts-section');
    expect(alertSection).to.exist;
  });

  it('handles empty state', async () => {
    hass.connection.sendMessagePromise.resolves({
      devices: [],
      clients: [],
      ssids: [],
    });
    await element.fetchData();
    await element.updateComplete;
    expect(element._deviceCounts.total).to.equal(0);
  });
});

describe('MerakiOverviewCardEditor', () => {
  let editor;

  beforeEach(async () => {
    editor = await fixture(html`<meraki-overview-card-editor></meraki-overview-card-editor>`);
    editor.hass = {};
    editor.setConfig({ config_entry_id: 'test', title: 'Test' });
    await editor.updateComplete;
  });

  it('renders form fields', () => {
    expect(editor.shadowRoot.querySelector('ha-textfield')).to.exist;
    expect(editor.shadowRoot.querySelector('ha-switch')).to.exist;
  });

  it('dispatches config-changed event', async () => {
    const spy = sinon.spy();
    editor.addEventListener('config-changed', spy);
    editor._configChanged({ test: 'value' });
    expect(spy.calledOnce).to.be.true;
  });
});

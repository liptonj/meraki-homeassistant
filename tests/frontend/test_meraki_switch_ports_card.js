import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';
import { MerakiSwitchPortsCard, MerakiSwitchPortsCardEditor } from '../../www/meraki_ha/meraki-switch-ports-card.js';

describe('MerakiSwitchPortsCard', () => {
  let element;
  let hass;

  beforeEach(async () => {
    hass = {
      connection: {
        sendMessagePromise: sinon.stub(),
        subscribeMessage: sinon.stub().returns(() => {}),
      },
    };

    hass.connection.sendMessagePromise.resolves({
      serial: 'SWITCH-123',
      name: 'Core Switch',
      model: 'MS225-24P',
      status: 'online',
    });

    element = await fixture(html`<meraki-switch-ports-card .hass=${hass}></meraki-switch-ports-card>`);
  });

  it('setConfig throws on missing device_serial', () => {
    expect(() => element.setConfig({ config_entry_id: 'test' })).to.throw('device_serial is required');
  });

  it('setConfig accepts valid config', () => {
    expect(() =>
      element.setConfig({ config_entry_id: 'test', device_serial: 'SWITCH-123' })
    ).to.not.throw();
  });

  it('port grid renders', async () => {
    element.setConfig({ config_entry_id: 'test', device_serial: 'SWITCH-123' });
    await element.fetchData();
    await element.updateComplete;

    const grid = element.shadowRoot.querySelector('.ports-grid');
    expect(grid).to.exist;
  });

  it('compact mode reduces size', () => {
    element.setConfig({ config_entry_id: 'test', device_serial: 'SWITCH-123', compact: true });
    expect(element.getCardSize()).to.equal(2);
  });

  it('getGridOptions returns valid config', () => {
    element.setConfig({ config_entry_id: 'test', device_serial: 'SWITCH-123' });
    const options = element.getGridOptions();
    expect(options).to.have.property('rows');
    expect(options).to.have.property('columns');
    expect(options.columns % 3).to.equal(0);
  });

  it('getStubConfig returns valid default config', () => {
    const config = MerakiSwitchPortsCard.getStubConfig();
    expect(config).to.have.property('device_serial');
  });

  it('getConfigForm returns valid schema', () => {
    const form = MerakiSwitchPortsCard.getConfigForm();
    expect(form).to.have.property('schema');
    expect(form.schema).to.be.an('array');
  });
});

describe('MerakiSwitchPortsCardEditor', () => {
  let editor;

  beforeEach(async () => {
    editor = await fixture(html`<meraki-switch-ports-card-editor></meraki-switch-ports-card-editor>`);
    editor.hass = {};
    editor.setConfig({ config_entry_id: 'test', device_serial: 'SWITCH-123' });
    await editor.updateComplete;
  });

  it('renders form fields', () => {
    expect(editor.shadowRoot.querySelector('ha-textfield')).to.exist;
  });

  it('renders switch toggles for options', () => {
    const switches = editor.shadowRoot.querySelectorAll('ha-switch');
    expect(switches.length).to.be.greaterThan(0);
  });
});

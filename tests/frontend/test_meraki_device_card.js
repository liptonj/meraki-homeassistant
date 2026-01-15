import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';
import {
  MerakiDeviceCard,
  MerakiDeviceCardEditor,
} from '../../custom_components/meraki_ha/www/meraki-device-card.js';

describe('MerakiDeviceCard', () => {
  let element;
  let hass;

  beforeEach(async () => {
    hass = {
      connection: {
        sendMessagePromise: sinon.stub(),
        subscribeMessage: sinon.stub().returns(() => {}),
      },
      states: {
        'sensor.meraki_device': {
          attributes: { serial: 'ABC-123-DEF' },
        },
      },
    };

    hass.connection.sendMessagePromise.resolves({
      serial: 'ABC-123-DEF',
      name: 'Office AP',
      model: 'MR46',
      status: 'online',
      lanIp: '192.168.1.100',
      mac: 'aa:bb:cc:dd:ee:ff',
      firmware: '28.6',
    });

    element = await fixture(
      html`<meraki-device-card .hass=${hass}></meraki-device-card>`
    );
  });

  it('setConfig throws on missing device_serial and entity_id', () => {
    expect(() => element.setConfig({ config_entry_id: 'test' })).to.throw();
  });

  it('setConfig accepts device_serial', () => {
    expect(() =>
      element.setConfig({ config_entry_id: 'test', device_serial: 'ABC-123' })
    ).to.not.throw();
  });

  it('setConfig accepts entity_id', () => {
    expect(() =>
      element.setConfig({
        config_entry_id: 'test',
        entity_id: 'sensor.device',
      })
    ).to.not.throw();
  });

  it('fetches device by serial', async () => {
    element.setConfig({
      config_entry_id: 'test',
      device_serial: 'ABC-123-DEF',
    });
    await element.fetchData();
    await element.updateComplete;
    expect(element._device).to.exist;
    expect(element._device.name).to.equal('Office AP');
  });

  it('compact mode reduces card size', async () => {
    element.setConfig({
      config_entry_id: 'test',
      device_serial: 'ABC-123-DEF',
      compact: true,
    });
    expect(element.getCardSize()).to.equal(1);
  });

  it('non-compact mode has larger card size', async () => {
    element.setConfig({
      config_entry_id: 'test',
      device_serial: 'ABC-123-DEF',
      compact: false,
    });
    expect(element.getCardSize()).to.equal(3);
  });

  it('getGridOptions returns valid config', () => {
    element.setConfig({
      config_entry_id: 'test',
      device_serial: 'ABC-123-DEF',
    });
    const options = element.getGridOptions();
    expect(options).to.have.property('rows');
    expect(options).to.have.property('columns');
  });

  it('getStubConfig returns valid default config', () => {
    const config = MerakiDeviceCard.getStubConfig();
    expect(config).to.have.property('device_serial');
  });

  it('getConfigForm returns valid schema', () => {
    const form = MerakiDeviceCard.getConfigForm();
    expect(form).to.have.property('schema');
    expect(form.schema).to.be.an('array');
  });
});

describe('MerakiDeviceCardEditor', () => {
  let editor;

  beforeEach(async () => {
    editor = await fixture(
      html`<meraki-device-card-editor></meraki-device-card-editor>`
    );
    editor.hass = {};
    editor.setConfig({ config_entry_id: 'test', device_serial: 'ABC-123' });
    await editor.updateComplete;
  });

  it('renders form fields', () => {
    expect(editor.shadowRoot.querySelector('ha-textfield')).to.exist;
  });

  it('renders switch toggles', () => {
    expect(editor.shadowRoot.querySelector('ha-switch')).to.exist;
  });
});

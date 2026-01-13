import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';

// Note: This is a TypeScript card that wraps a React component
// We test the Lit wrapper and basic functionality
describe('MerakiDevicesCard', () => {
  let element;
  let hass;

  beforeEach(async () => {
    // Import the card dynamically to handle TS/JS interop
    await import(
      '../../www/meraki_ha/meraki-devices-card.ts'
    );

    hass = {
      connection: {
        sendMessagePromise: sinon.stub().resolves({
          devices: [
            {
              serial: 'Q2XX-XXXX-XXXX',
              name: 'Office Switch',
              model: 'MS120-8',
              productType: 'switch',
              networkId: 'N_12345',
              status: 'online',
              firmware: '15.21',
              publicIp: '192.168.1.1',
              lanIp: '10.0.0.1',
              mac: 'AA:BB:CC:DD:EE:FF',
            },
            {
              serial: 'Q2YY-YYYY-YYYY',
              name: 'Office AP',
              model: 'MR46',
              productType: 'wireless',
              networkId: 'N_12345',
              status: 'online',
              firmware: '28.7',
              publicIp: '192.168.1.2',
              lanIp: '10.0.0.2',
              mac: '11:22:33:44:55:66',
            },
            {
              serial: 'Q2ZZ-ZZZZ-ZZZZ',
              name: 'Offline Camera',
              model: 'MV22',
              productType: 'camera',
              networkId: 'N_12345',
              status: 'offline',
              firmware: '4.17',
              publicIp: null,
              lanIp: '10.0.0.3',
              mac: 'AA:11:BB:22:CC:33',
            },
          ],
        }),
        subscribeMessage: sinon.stub().returns(() => {}),
      },
      states: {},
    };

    element = await fixture(
      html`<meraki-devices-card .hass=${hass}></meraki-devices-card>`
    );
  });

  describe('Initialization', () => {
    it('creates element', () => {
      expect(element).to.exist;
      expect(element.tagName.toLowerCase()).to.equal('meraki-devices-card');
    });

    it('requires configuration', () => {
      expect(() => element.setConfig(null)).to.throw('Invalid configuration');
    });

    it('accepts valid configuration', () => {
      const config = {
        title: 'Test Devices',
        view_mode: 'network',
        device_types: ['switch', 'wireless'],
      };
      element.setConfig(config);
      expect(element.config).to.deep.equal(config);
    });

    it('getStubConfig returns valid default config', () => {
      const config = element.constructor.getStubConfig();
      expect(config).to.have.property('title');
      expect(config).to.have.property('view_mode');
      expect(config).to.have.property('device_types');
      expect(config).to.have.property('status_filter');
      expect(config).to.have.property('collapsible');
      expect(config).to.have.property('default_collapsed');
      expect(config).to.have.property('show_filters');
      expect(config).to.have.property('compact');
    });

    it('has expected default values in stub config', () => {
      const config = element.constructor.getStubConfig();
      expect(config.title).to.equal('Meraki Devices');
      expect(config.view_mode).to.equal('network');
      expect(config.status_filter).to.equal('all');
      expect(config.collapsible).to.be.true;
      expect(config.default_collapsed).to.be.false;
      expect(config.show_filters).to.be.true;
      expect(config.compact).to.be.false;
    });

    it('includes all device types in stub config', () => {
      const config = element.constructor.getStubConfig();
      expect(config.device_types).to.include('switch');
      expect(config.device_types).to.include('wireless');
      expect(config.device_types).to.include('camera');
      expect(config.device_types).to.include('sensor');
      expect(config.device_types).to.include('appliance');
    });
  });

  describe('Rendering', () => {
    it('renders root div when hass and config are set', async () => {
      element.setConfig({
        title: 'Test',
        view_mode: 'network',
      });
      await element.updateComplete;

      const root = element.shadowRoot.getElementById('root');
      expect(root).to.exist;
    });

    it('renders empty when hass is not set', async () => {
      element.hass = null;
      element.setConfig({ title: 'Test' });
      await element.updateComplete;

      const root = element.shadowRoot.getElementById('root');
      expect(root).to.not.exist;
    });

    it('renders empty when config is not set', async () => {
      element.config = null;
      await element.updateComplete;

      const root = element.shadowRoot.getElementById('root');
      expect(root).to.not.exist;
    });
  });

  describe('Configuration Options', () => {
    it('accepts network view mode', () => {
      element.setConfig({
        view_mode: 'network',
      });
      expect(element.config.view_mode).to.equal('network');
    });

    it('accepts list view mode', () => {
      element.setConfig({
        view_mode: 'list',
      });
      expect(element.config.view_mode).to.equal('list');
    });

    it('accepts device type filters', () => {
      element.setConfig({
        device_types: ['switch', 'wireless'],
      });
      expect(element.config.device_types).to.deep.equal([
        'switch',
        'wireless',
      ]);
    });

    it('accepts status filter', () => {
      element.setConfig({
        status_filter: 'online',
      });
      expect(element.config.status_filter).to.equal('online');
    });

    it('accepts collapsible setting', () => {
      element.setConfig({
        collapsible: false,
      });
      expect(element.config.collapsible).to.be.false;
    });

    it('accepts default_collapsed setting', () => {
      element.setConfig({
        default_collapsed: true,
      });
      expect(element.config.default_collapsed).to.be.true;
    });

    it('accepts show_filters setting', () => {
      element.setConfig({
        show_filters: false,
      });
      expect(element.config.show_filters).to.be.false;
    });

    it('accepts compact mode setting', () => {
      element.setConfig({
        compact: true,
      });
      expect(element.config.compact).to.be.true;
    });
  });

  describe('Config Element', () => {
    it('returns editor element', async () => {
      const editor = await element.constructor.getConfigElement();
      expect(editor).to.exist;
      expect(editor.tagName.toLowerCase()).to.equal(
        'meraki-devices-card-editor'
      );
    });
  });

  describe('React Component Integration', () => {
    it('has updated method that renders React component', () => {
      expect(element.updated).to.be.a('function');
    });

    it('calls updated on property changes', async () => {
      const spy = sinon.spy(element, 'updated');
      element.setConfig({ title: 'New Title' });
      await element.updateComplete;

      expect(spy.called).to.be.true;
    });
  });

  describe('Styles', () => {
    it('has display block style', () => {
      const styles = element.constructor.styles;
      expect(styles).to.exist;
    });
  });

  describe('Property Decorators', () => {
    it('has hass property', () => {
      expect(element).to.have.property('hass');
    });

    it('has config property', () => {
      expect(element).to.have.property('config');
    });

    it('updates when hass changes', async () => {
      const oldHass = element.hass;
      element.hass = { ...hass, states: { test: 'new' } };
      await element.updateComplete;

      expect(element.hass).to.not.equal(oldHass);
    });

    it('updates when config changes', async () => {
      const oldConfig = element.config;
      element.setConfig({ title: 'Changed', view_mode: 'list' });
      await element.updateComplete;

      expect(element.config).to.not.equal(oldConfig);
    });
  });
});

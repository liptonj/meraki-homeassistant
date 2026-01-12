import { MerakiClientCard } from '../cards/meraki-client-card/meraki-client-card.js';
import { MerakiClientCardEditor } from '../cards/meraki-client-card/meraki-client-card-editor.js';

describe('MerakiClientCard', () => {
  let element;

  beforeEach(() => {
    element = document.createElement('meraki-client-card');
  });

  afterEach(() => {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  });

  describe('Configuration', () => {
    it('should throw an error if no config is provided', () => {
      expect(() => element.setConfig({})).toThrow('You must specify either client_mac or entity_id');
    });

    it('should set config with client_mac', () => {
      element.setConfig({ client_mac: 'aa:bb:cc:dd:ee:ff', config_entry_id: 'test' });
      expect(element.config.client_mac).toBe('aa:bb:cc:dd:ee:ff');
    });

    it('should set config with entity_id', () => {
      element.setConfig({ entity_id: 'device_tracker.meraki_client_aa_bb_cc_dd_ee_ff', config_entry_id: 'test' });
      expect(element.config.entity_id).toBe('device_tracker.meraki_client_aa_bb_cc_dd_ee_ff');
    });

    it('should set default config values', () => {
      element.setConfig({ client_mac: 'aa:bb:cc:dd:ee:ff' });
      expect(element.config.show_usage).toBe(true);
      expect(element.config.show_connection_info).toBe(true);
      expect(element.config.show_timestamps).toBe(true);
      expect(element.config.show_block_button).toBe(true);
      expect(element.config.collapsible).toBe(true);
      expect(element.config.default_collapsed).toBe(false);
    });

    it('should respect custom config values', () => {
      element.setConfig({
        client_mac: 'aa:bb:cc:dd:ee:ff',
        show_usage: false,
        collapsible: false,
        default_collapsed: true
      });
      expect(element.config.show_usage).toBe(false);
      expect(element.config.collapsible).toBe(false);
      expect(element.config.default_collapsed).toBe(true);
    });
  });

  describe('Data Fetching', () => {
    it('should render the card with fetched data', async () => {
      element.hass = {
        connection: {
          sendMessagePromise: () => Promise.resolve({
            mac: 'aa:bb:cc:dd:ee:ff',
            description: 'Test Client',
            status: 'Online',
            ip: '192.168.1.100',
            os: 'iOS'
          })
        }
      };
      element.setConfig({ client_mac: 'aa:bb:cc:dd:ee:ff', config_entry_id: 'test' });
      await element.fetchData();
      element.requestUpdate();
      await element.updateComplete;

      const card = element.shadowRoot.querySelector('ha-card');
      expect(card).toBeTruthy();
      const header = card.querySelector('.header-name');
      expect(header.textContent.trim()).toContain('Test Client');
    });

    it('should show online status for online clients', async () => {
      element.hass = {
        connection: {
          sendMessagePromise: () => Promise.resolve({
            mac: 'aa:bb:cc:dd:ee:ff',
            description: 'Test Client',
            status: 'Online'
          })
        }
      };
      element.setConfig({ client_mac: 'aa:bb:cc:dd:ee:ff', config_entry_id: 'test' });
      await element.fetchData();
      element.requestUpdate();
      await element.updateComplete;

      const statusBadge = element.shadowRoot.querySelector('.status-online');
      expect(statusBadge).toBeTruthy();
    });

    it('should handle missing client gracefully', async () => {
      element.hass = {
        connection: {
          sendMessagePromise: () => Promise.resolve(null)
        }
      };
      element.setConfig({ client_mac: 'aa:bb:cc:dd:ee:ff', config_entry_id: 'test' });
      await element.fetchData();
      element.requestUpdate();
      await element.updateComplete;

      const notFound = element.shadowRoot.querySelector('.not-found');
      expect(notFound).toBeTruthy();
    });
  });

  describe('Collapsible Behavior', () => {
    it('should start expanded by default', () => {
      element.setConfig({ client_mac: 'aa:bb:cc:dd:ee:ff' });
      expect(element._collapsed).toBe(false);
    });

    it('should start collapsed when default_collapsed is true', () => {
      element.setConfig({ client_mac: 'aa:bb:cc:dd:ee:ff', default_collapsed: true });
      expect(element._collapsed).toBe(true);
    });

    it('should not toggle when collapsible is false', () => {
      element.setConfig({ client_mac: 'aa:bb:cc:dd:ee:ff', collapsible: false });
      expect(element._collapsed).toBe(false);
      element._toggleCollapse();
      expect(element._collapsed).toBe(false);
    });
  });

  describe('Card Size', () => {
    it('should return 5 when expanded', () => {
      element.setConfig({ client_mac: 'aa:bb:cc:dd:ee:ff' });
      element._collapsed = false;
      expect(element.getCardSize()).toBe(5);
    });

    it('should return 1 when collapsed', () => {
      element.setConfig({ client_mac: 'aa:bb:cc:dd:ee:ff' });
      element._collapsed = true;
      expect(element.getCardSize()).toBe(1);
    });
  });

  describe('Static Methods', () => {
    it('should return config element', () => {
      const configElement = MerakiClientCard.getConfigElement();
      expect(configElement.tagName.toLowerCase()).toBe('meraki-client-card-editor');
    });

    it('should return stub config', () => {
      const stubConfig = MerakiClientCard.getStubConfig();
      expect(stubConfig).toHaveProperty('client_mac');
      expect(stubConfig).toHaveProperty('show_usage');
      expect(stubConfig).toHaveProperty('collapsible');
    });
  });
});

describe('MerakiClientCardEditor', () => {
  let element;

  beforeEach(() => {
    element = document.createElement('meraki-client-card-editor');
  });

  afterEach(() => {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  });

  it('should set default config values', () => {
    element.setConfig({});
    expect(element.config.show_usage).toBe(true);
    expect(element.config.show_connection_info).toBe(true);
    expect(element.config.show_timestamps).toBe(true);
    expect(element.config.collapsible).toBe(true);
  });

  it('should render the editor form', async () => {
    element.hass = {};
    element.setConfig({ client_mac: 'aa:bb:cc:dd:ee:ff' });
    element.requestUpdate();
    await element.updateComplete;

    const textfield = element.shadowRoot.querySelector('ha-textfield');
    expect(textfield).toBeTruthy();
    expect(textfield.label).toBe('Client MAC Address');
  });

  it('should dispatch config-changed event on value change', async () => {
    element.hass = {};
    element.setConfig({ client_mac: 'aa:bb:cc:dd:ee:ff' });

    const configChangedSpy = jest.fn();
    element.addEventListener('config-changed', configChangedSpy);

    element._configChanged({ client_mac: 'bb:cc:dd:ee:ff:00' });

    expect(configChangedSpy).toHaveBeenCalled();
    expect(configChangedSpy.mock.calls[0][0].detail.config.client_mac).toBe('bb:cc:dd:ee:ff:00');
  });
});

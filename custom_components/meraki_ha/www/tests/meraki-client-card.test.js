import { MerakiClientCard } from '../cards/meraki-client-card/meraki-client-card.js';
import { MerakiClientCardEditor } from '../cards/meraki-client-card/meraki-client-card-editor.js';

describe('MerakiClientCard', () => {
  let element;

  beforeEach(() => {
    element = document.createElement('meraki-client-card');
  });

  it('should throw an error if no config is provided', () => {
    expect(() => element.setConfig({})).toThrow('You must specify either client_mac or entity_id');
  });

  it('should set config', () => {
    element.setConfig({ client_mac: 'aa:bb:cc:dd:ee:ff' });
    expect(element.config.client_mac).toBe('aa:bb:cc:dd:ee:ff');
  });

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
    element.setConfig({ client_mac: 'aa:bb:cc:dd:ee:ff' });
    await element.fetchData();
    element.requestUpdate();
    await element.updateComplete;

    const card = element.shadowRoot.querySelector('ha-card');
    expect(card).toBeTruthy();
    const header = card.querySelector('.header-name');
    expect(header.textContent.trim()).toContain('Test Client');
  });
});

describe('MerakiClientCardEditor', () => {
    let element;

    beforeEach(() => {
        element = document.createElement('meraki-client-card-editor');
    });

    it('should render the editor form', async () => {
        element.hass = {};
        element.config = { client_mac: 'aa:bb:cc:dd:ee:ff' };
        await element.requestUpdate();

        const textfield = element.shadowRoot.querySelector('ha-textfield');
        expect(textfield).toBeTruthy();
        expect(textfield.label).toBe('Client MAC Address');
    });
});

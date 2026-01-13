import { expect } from '@open-wc/testing';
import sinon from 'sinon';
import { MerakiDashboardStrategy } from '../../src/strategies/meraki-dashboard-strategy';

describe('MerakiDashboardStrategy', () => {
  let hass;

  beforeEach(() => {
    hass = {
      connection: {
        sendMessagePromise: sinon.stub().resolves({
          networks: [{ id: 'L_123', name: 'Main Office' }],
          devices: [
            { serial: 'Q234-ABCD-5678', networkId: 'L_123', productType: 'switch' },
            { serial: 'Q234-ABCD-9999', networkId: 'L_123', productType: 'wireless' },
          ],
          ssids: [{ networkId: 'L_123', name: 'WiFi' }],
          clients: [{ mac: '00:11:22:33:44:55' }],
        }),
      },
    };
  });

  it('generate() returns valid dashboard config', async () => {
    const config = await MerakiDashboardStrategy.generate({ options: {} }, hass);
    expect(config).to.have.property('views');
    expect(config.views).to.be.an('array');
  });

  it('Overview view always created', async () => {
    const config = await MerakiDashboardStrategy.generate({ options: {} }, hass);
    const overviewView = config.views.find(v => v.path === 'overview');
    expect(overviewView).to.exist;
    expect(overviewView.cards).to.have.lengthOf(2);
  });

  it('Network grouping works', async () => {
    const config = await MerakiDashboardStrategy.generate({ options: { group_by: 'network' } }, hass);
    const networkView = config.views.find(v => v.path === 'L_123');
    expect(networkView).to.exist;
    expect(networkView.title).to.equal('Main Office');
  });

  it('Device type grouping works', async () => {
    const config = await MerakiDashboardStrategy.generate({ options: { group_by: 'device_type' } }, hass);
    const switchView = config.views.find(v => v.path === 'switch');
    const wirelessView = config.views.find(v => v.path === 'wireless');
    expect(switchView).to.exist;
    expect(switchView.title).to.equal('Switches');
    expect(wirelessView).to.exist;
    expect(wirelessView.title).to.equal('Wireless APs');
  });

  it('Handles empty data gracefully', async () => {
    hass.connection.sendMessagePromise.resolves({ networks: [], devices: [], ssids: [] });
    const config = await MerakiDashboardStrategy.generate({ options: {} }, hass);
    expect(config.views.length).to.equal(1); // Just the overview
  });

  it('Handles API error gracefully', async () => {
    hass.connection.sendMessagePromise.rejects(new Error('API Error'));
    const config = await MerakiDashboardStrategy.generate({ options: {} }, hass);
    expect(config.views.length).to.equal(1); // Just the overview
  });

  it('Cards have correct config', async () => {
    const config = await MerakiDashboardStrategy.generate({ options: { group_by: 'network', include_devices: true } }, hass);
    const networkView = config.views.find(v => v.path === 'L_123');
    const switchCard = networkView.cards.find(c => c.type === 'custom:meraki-switch-ports-card');
    expect(switchCard).to.exist;
    expect(switchCard.device_serial).to.equal('Q234-ABCD-5678');
  });

  it('Badges included in overview', async () => {
    const config = await MerakiDashboardStrategy.generate({ options: {} }, hass);
    const overviewView = config.views.find(v => v.path === 'overview');
    expect(overviewView.badges).to.have.lengthOf(2);
  });

  it('include_clients option creates clients view', async () => {
    const config = await MerakiDashboardStrategy.generate({ options: { include_clients: true } }, hass);
    const clientsView = config.views.find(v => v.path === 'clients');
    expect(clientsView).to.exist;
    expect(clientsView.title).to.equal('Clients');
  });

  it('include_ssids option creates SSIDs view', async () => {
    const config = await MerakiDashboardStrategy.generate({ options: { include_ssids: true } }, hass);
    const ssidsView = config.views.find(v => v.path === 'ssids');
    expect(ssidsView).to.exist;
    expect(ssidsView.title).to.equal('SSIDs');
  });
});

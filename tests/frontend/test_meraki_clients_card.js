import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';
import {
  MerakiClientsCard,
  MerakiClientsCardEditor,
} from '../../custom_components/meraki_ha/www/meraki-clients-card.js';

describe('MerakiClientsCard', () => {
  let element;
  let hass;

  beforeEach(async () => {
    hass = {
      connection: {
        sendMessagePromise: sinon.stub().resolves([
          {
            mac: 'aa:bb:cc:dd:ee:ff',
            description: 'iPhone',
            ip: '192.168.1.100',
            status: 'Online',
            lastSeen: '2024-01-01T12:00:00Z',
            usage: { sent: 1024000, recv: 2048000 },
            vlan: 10,
            recentDeviceSerial: '123',
          },
          {
            mac: '11:22:33:44:55:66',
            description: 'MacBook',
            ip: '192.168.1.101',
            status: 'Online',
            lastSeen: '2024-01-01T11:00:00Z',
            usage: { sent: 512000, recv: 1024000 },
            vlan: 10,
            recentDeviceSerial: '123',
          },
          {
            mac: '22:33:44:55:66:77',
            description: 'Printer',
            ip: '192.168.1.102',
            status: 'Offline',
            lastSeen: '2024-01-01T10:00:00Z',
            usage: { sent: 0, recv: 0 },
            vlan: 20,
          },
        ]),
        subscribeMessage: sinon.stub().returns(() => {}),
      },
    };

    element = await fixture(
      html`<meraki-clients-card .hass=${hass}></meraki-clients-card>`
    );
    element.setConfig({ config_entry_id: 'test-entry' });
    await element.updateComplete;
  });

  it('renders with default config', async () => {
    await element.fetchData();
    await element.updateComplete;
    expect(element.shadowRoot.querySelector('ha-card')).to.exist;
  });

  it('client list renders', async () => {
    await element.fetchData();
    await element.updateComplete;
    const table = element.shadowRoot.querySelector('.clients-table');
    expect(table).to.exist;
  });

  it('search filters list', async () => {
    await element.fetchData();
    await element.updateComplete;

    element._searchQuery = 'iPhone';
    element._applyFiltersAndSort();
    await element.updateComplete;

    expect(element._filteredClients.length).to.equal(1);
    expect(element._filteredClients[0].description).to.equal('iPhone');
  });

  it('sort by column works', async () => {
    await element.fetchData();
    await element.updateComplete;

    element._handleSort('name');
    expect(element._sortBy).to.equal('name');
    expect(element._sortAsc).to.be.true;

    // Sort again to reverse
    element._handleSort('name');
    expect(element._sortAsc).to.be.false;
  });

  it('limit config is respected', async () => {
    element.setConfig({
      config_entry_id: 'test',
      limit: 1,
      show_offline: true,
    });
    await element.fetchData();
    await element.updateComplete;

    const rows = element.shadowRoot.querySelectorAll('.client-row');
    expect(rows.length).to.equal(1);
  });

  it('pagination controls work', async () => {
    element.setConfig({
      config_entry_id: 'test',
      limit: 1,
      show_offline: true,
    });
    await element.fetchData();
    await element.updateComplete;

    expect(element._currentPage).to.equal(0);
    element._currentPage = 1;
    await element.updateComplete;
    expect(element._currentPage).to.equal(1);
  });

  it('block action calls API', async () => {
    await element.fetchData();
    await element.updateComplete;

    const client = { mac: 'aa:bb:cc:dd:ee:ff' };
    hass.connection.sendMessagePromise
      .withArgs(sinon.match({ type: 'meraki/block_client' }))
      .resolves({ status: 'success' });

    await element._handleBlock(client);
    expect(
      hass.connection.sendMessagePromise.calledWith(
        sinon.match({ type: 'meraki/block_client', mac: 'aa:bb:cc:dd:ee:ff' })
      )
    ).to.be.true;
  });

  it('getCardSize returns a number', () => {
    expect(element.getCardSize()).to.be.a('number');
  });

  it('getGridOptions returns valid config', () => {
    const options = element.getGridOptions();
    expect(options).to.have.property('rows');
    expect(options).to.have.property('columns');
  });

  it('getStubConfig returns valid default config', () => {
    const config = MerakiClientsCard.getStubConfig();
    expect(config).to.have.property('limit');
  });

  it('getConfigForm returns valid schema', () => {
    const form = MerakiClientsCard.getConfigForm();
    expect(form).to.have.property('schema');
  });

  it('handles empty client list', async () => {
    hass.connection.sendMessagePromise.resolves([]);
    await element.fetchData();
    await element.updateComplete;

    const emptyState = element.shadowRoot.querySelector('.empty-state');
    expect(emptyState).to.exist;
  });

  it('filters offline clients when show_offline is false', async () => {
    element.setConfig({ config_entry_id: 'test', show_offline: false });
    await element.fetchData();
    await element.updateComplete;

    // Only 2 online clients should be shown
    expect(element._filteredClients.length).to.equal(2);
  });
});

describe('MerakiClientsCardEditor', () => {
  let editor;

  beforeEach(async () => {
    editor = await fixture(
      html`<meraki-clients-card-editor></meraki-clients-card-editor>`
    );
    editor.hass = {};
    editor.setConfig({ config_entry_id: 'test' });
    await editor.updateComplete;
  });

  it('renders form fields', () => {
    expect(editor.shadowRoot.querySelector('ha-textfield')).to.exist;
  });

  it('renders show_offline switch', () => {
    expect(editor.shadowRoot.querySelector('ha-switch')).to.exist;
  });
});

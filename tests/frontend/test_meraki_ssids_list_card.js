import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';
import { MerakiSSIDsListCard } from '../../custom_components/meraki_ha/www/meraki-ssids-list-card.js';

describe('MerakiSSIDsListCard', () => {
  let element;
  let hass;
  let mockSSIDEntities;

  beforeEach(async () => {
    // Mock SSID switch entities with proper structure
    mockSSIDEntities = {
      'switch.network1_corp_enabled_switch': {
        entity_id: 'switch.network1_corp_enabled_switch',
        state: 'on',
        attributes: {
          friendly_name: 'Corporate WiFi Enabled Control',
          entity_category: 'config',
          network_id: 'N_12345',
          network_name: 'Main Office',
          ssid_number: 0,
          ssid_status: 'enabled',
          auth_mode: 'psk',
          vlan_id: 10,
        },
      },
      'switch.network1_guest_enabled_switch': {
        entity_id: 'switch.network1_guest_enabled_switch',
        state: 'off',
        attributes: {
          friendly_name: 'Guest WiFi Enabled Control',
          entity_category: 'config',
          network_id: 'N_12345',
          network_name: 'Main Office',
          ssid_number: 1,
          ssid_status: 'disabled',
          auth_mode: 'open',
          vlan_id: 20,
        },
      },
      'switch.network2_iot_enabled_switch': {
        entity_id: 'switch.network2_iot_enabled_switch',
        state: 'on',
        attributes: {
          friendly_name: 'IoT Network Enabled Control',
          entity_category: 'config',
          network_id: 'N_67890',
          network_name: 'Branch Office',
          ssid_number: 2,
          ssid_status: 'hidden',
          auth_mode: 'psk',
          vlan_id: 30,
        },
      },
      // Non-SSID switch (should be filtered out)
      'switch.some_other_device': {
        entity_id: 'switch.some_other_device',
        state: 'on',
        attributes: {
          friendly_name: 'Other Device',
          entity_category: null,
        },
      },
    };

    // Mock client count sensors
    mockSSIDEntities['sensor.network1_ssid_0_client_count'] = {
      entity_id: 'sensor.network1_ssid_0_client_count',
      state: '5',
      attributes: {},
    };
    mockSSIDEntities['sensor.network1_ssid_1_client_count'] = {
      entity_id: 'sensor.network1_ssid_1_client_count',
      state: '0',
      attributes: {},
    };
    mockSSIDEntities['sensor.network2_ssid_2_client_count'] = {
      entity_id: 'sensor.network2_ssid_2_client_count',
      state: '3',
      attributes: {},
    };

    hass = {
      connection: {
        sendMessagePromise: sinon.stub().resolves({}),
        subscribeMessage: sinon.stub().returns(() => {}),
      },
      states: mockSSIDEntities,
      callService: sinon.stub().resolves(),
    };

    element = await fixture(
      html`<meraki-ssids-list-card .hass=${hass}></meraki-ssids-list-card>`
    );
    element.setConfig({
      config_entry_id: 'test-entry',
      show_filter: true,
      show_client_count: true,
      show_toggle: true,
      collapsed_by_default: false,
    });
    await element.updateComplete;
  });

  describe('Initialization', () => {
    it('renders with default config', async () => {
      await element.fetchData();
      await element.updateComplete;
      expect(element.shadowRoot.querySelector('ha-card')).to.exist;
    });

    it('getStubConfig returns valid default config', () => {
      const config = MerakiSSIDsListCard.getStubConfig();
      expect(config).to.have.property('show_filter');
      expect(config).to.have.property('show_client_count');
      expect(config).to.have.property('show_toggle');
      expect(config).to.have.property('collapsed_by_default');
    });

    it('getCardSize returns correct size', () => {
      expect(element.getCardSize()).to.equal(4);
    });
  });

  describe('Entity Filtering', () => {
    it('correctly filters SSID switch entities', async () => {
      await element.fetchData();
      await element.updateComplete;

      // Should find 3 SSID switches, not the other device
      expect(element._ssids).to.have.lengthOf(3);
    });

    it('filters entities by entity_category config', async () => {
      await element.fetchData();
      await element.updateComplete;

      // All SSIDs should have entity_category: 'config'
      const ssidEntityIds = element._ssids.map((s) => s.entity_id);
      expect(ssidEntityIds).to.not.include('switch.some_other_device');
    });

    it('extracts network_id and ssid_number from attributes', async () => {
      await element.fetchData();
      await element.updateComplete;

      const corpSSID = element._ssids.find(
        (s) => s.entity_id === 'switch.network1_corp_enabled_switch'
      );
      expect(corpSSID).to.exist;
      expect(corpSSID.network_id).to.equal('N_12345');
      expect(corpSSID.number).to.equal(0);
    });

    it('associates client counts with SSIDs', async () => {
      await element.fetchData();
      await element.updateComplete;

      const corpSSID = element._ssids.find((s) => s.number === 0);
      expect(corpSSID.client_count).to.equal(5);

      const guestSSID = element._ssids.find((s) => s.number === 1);
      expect(guestSSID.client_count).to.equal(0);
    });
  });

  describe('Network Grouping', () => {
    it('groups SSIDs by network', async () => {
      await element.fetchData();
      await element.updateComplete;

      expect(element._networks).to.have.property('N_12345');
      expect(element._networks).to.have.property('N_67890');
    });

    it('assigns SSIDs to correct networks', async () => {
      await element.fetchData();
      await element.updateComplete;

      const network1 = element._networks['N_12345'];
      expect(network1.ssids).to.have.lengthOf(2);
      expect(network1.name).to.equal('Main Office');

      const network2 = element._networks['N_67890'];
      expect(network2.ssids).to.have.lengthOf(1);
      expect(network2.name).to.equal('Branch Office');
    });

    it('sorts SSIDs within networks by number', async () => {
      await element.fetchData();
      await element.updateComplete;

      const network1 = element._networks['N_12345'];
      expect(network1.ssids[0].number).to.be.lessThan(
        network1.ssids[1].number
      );
    });

    it('expands networks by default when configured', async () => {
      await element.fetchData();
      await element.updateComplete;

      expect(element._expandedNetworks.has('N_12345')).to.be.true;
      expect(element._expandedNetworks.has('N_67890')).to.be.true;
    });

    it('collapses networks by default when configured', async () => {
      // Create a fresh element to test collapsed_by_default behavior
      const collapsedElement = await fixture(
        html`<meraki-ssids-list-card .hass=${hass}></meraki-ssids-list-card>`
      );
      collapsedElement.setConfig({
        config_entry_id: 'test-entry',
        collapsed_by_default: true,
      });
      await collapsedElement.fetchData();
      await collapsedElement.updateComplete;

      // When collapsed_by_default is true, no networks should be in the expanded set
      expect(collapsedElement._expandedNetworks.size).to.equal(0);
    });
  });

  describe('Expand/Collapse Functionality', () => {
    it('toggles network expansion state', async () => {
      await element.fetchData();
      await element.updateComplete;

      const networkId = 'N_12345';
      const wasExpanded = element._expandedNetworks.has(networkId);

      element._toggleNetwork(networkId);
      await element.updateComplete;

      expect(element._expandedNetworks.has(networkId)).to.equal(!wasExpanded);
    });

    it('renders collapse icon with correct state', async () => {
      await element.fetchData();
      await element.updateComplete;

      const collapseIcon = element.shadowRoot.querySelector('.collapse-icon');
      expect(collapseIcon).to.exist;
    });
  });

  describe('Filter Functionality', () => {
    it('filters SSIDs by name', async () => {
      await element.fetchData();
      await element.updateComplete;

      element._filterText = 'corp';
      await element.updateComplete;

      const corpSSID = {
        name: 'Corporate WiFi Enabled Control',
        network_name: 'Main Office',
      };
      const guestSSID = {
        name: 'Guest WiFi Enabled Control',
        network_name: 'Main Office',
      };

      expect(element._filterSSIDs(corpSSID)).to.be.true;
      expect(element._filterSSIDs(guestSSID)).to.be.false;
    });

    it('filters SSIDs by network name', async () => {
      await element.fetchData();
      await element.updateComplete;

      element._filterText = 'branch';
      await element.updateComplete;

      const mainSSID = { name: 'Test', network_name: 'Main Office' };
      const branchSSID = { name: 'Test', network_name: 'Branch Office' };

      expect(element._filterSSIDs(mainSSID)).to.be.false;
      expect(element._filterSSIDs(branchSSID)).to.be.true;
    });

    it('filter is case insensitive', async () => {
      element._filterText = 'GUEST';
      const ssid = { name: 'guest wifi', network_name: 'Office' };
      expect(element._filterSSIDs(ssid)).to.be.true;
    });

    it('shows all SSIDs when filter is empty', async () => {
      element._filterText = '';
      const ssid = { name: 'Any SSID', network_name: 'Any Network' };
      expect(element._filterSSIDs(ssid)).to.be.true;
    });

    it('renders filter input when configured', async () => {
      await element.fetchData();
      await element.updateComplete;

      const filterInput = element.shadowRoot.querySelector('.filter-input');
      expect(filterInput).to.exist;
    });

    it('hides filter input when not configured', async () => {
      element.setConfig({
        config_entry_id: 'test-entry',
        show_filter: false,
      });
      await element.fetchData();
      await element.updateComplete;

      const filterInput = element.shadowRoot.querySelector('.filter-input');
      expect(filterInput).to.not.exist;
    });
  });

  describe('SSID Toggle Actions', () => {
    it('calls turn_on service when toggling off SSID', async () => {
      await element.fetchData();
      await element.updateComplete;

      const disabledSSID = element._ssids.find((s) => s.enabled === false);
      await element._toggleSSID(disabledSSID, { stopPropagation: () => {} });

      expect(hass.callService.calledOnce).to.be.true;
      expect(hass.callService.firstCall.args[0]).to.equal('switch');
      expect(hass.callService.firstCall.args[1]).to.equal('turn_on');
      expect(hass.callService.firstCall.args[2].entity_id).to.equal(
        disabledSSID.entity_id
      );
    });

    it('calls turn_off service when toggling on SSID', async () => {
      await element.fetchData();
      await element.updateComplete;

      const enabledSSID = element._ssids.find((s) => s.enabled === true);
      await element._toggleSSID(enabledSSID, { stopPropagation: () => {} });

      expect(hass.callService.calledOnce).to.be.true;
      expect(hass.callService.firstCall.args[1]).to.equal('turn_off');
    });

    it('stops event propagation on toggle', async () => {
      await element.fetchData();
      await element.updateComplete;

      const event = { stopPropagation: sinon.spy() };
      const ssid = element._ssids[0];

      await element._toggleSSID(ssid, event);
      expect(event.stopPropagation.calledOnce).to.be.true;
    });

    it('handles toggle errors gracefully', async () => {
      hass.callService.rejects(new Error('Service call failed'));

      await element.fetchData();
      await element.updateComplete;

      const ssid = element._ssids[0];
      // Should not throw
      await element._toggleSSID(ssid, { stopPropagation: () => {} });
    });
  });

  describe('Status Indicators', () => {
    it('returns correct icon for enabled SSID', () => {
      const enabledSSID = { enabled: true, status: 'enabled' };
      expect(element._getStatusIcon(enabledSSID)).to.equal('mdi:wifi');
    });

    it('returns correct icon for disabled SSID', () => {
      const disabledSSID = { enabled: false, status: 'disabled' };
      expect(element._getStatusIcon(disabledSSID)).to.equal('mdi:wifi-off');
    });

    it('returns correct icon for hidden SSID', () => {
      const hiddenSSID = { enabled: true, status: 'hidden' };
      expect(element._getStatusIcon(hiddenSSID)).to.equal('mdi:wifi-lock');
    });

    it('returns correct CSS class for enabled SSID', () => {
      const enabledSSID = { enabled: true, status: 'enabled' };
      expect(element._getStatusClass(enabledSSID)).to.equal('enabled');
    });

    it('returns correct CSS class for disabled SSID', () => {
      const disabledSSID = { enabled: false, status: 'disabled' };
      expect(element._getStatusClass(disabledSSID)).to.equal('disabled');
    });

    it('returns correct CSS class for hidden SSID', () => {
      const hiddenSSID = { enabled: true, status: 'hidden' };
      expect(element._getStatusClass(hiddenSSID)).to.equal('hidden');
    });
  });

  describe('More Info Dialog', () => {
    it('dispatches hass-more-info event when clicking SSID', async () => {
      await element.fetchData();
      await element.updateComplete;

      const eventSpy = sinon.spy();
      element.addEventListener('hass-more-info', eventSpy);

      const ssid = element._ssids[0];
      element._openSSIDDetails(ssid);

      expect(eventSpy.calledOnce).to.be.true;
      expect(eventSpy.firstCall.args[0].detail.entityId).to.equal(
        ssid.entity_id
      );
    });
  });

  describe('Empty State', () => {
    it('renders empty state when no SSIDs found', async () => {
      hass.states = {};
      await element.fetchData();
      await element.updateComplete;

      const emptyState = element.shadowRoot.querySelector('.empty-state');
      expect(emptyState).to.exist;
      expect(emptyState.textContent).to.include('No SSIDs found');
    });

    it('renders empty state when filter has no matches', async () => {
      await element.fetchData();
      await element.updateComplete;

      element._filterText = 'nonexistent';
      await element.updateComplete;

      const emptyState = element.shadowRoot.querySelector('.empty-state');
      expect(emptyState).to.exist;
      expect(emptyState.textContent).to.include('No SSIDs match your filter');
    });
  });

  describe('Real-time Updates', () => {
    it('refreshes data when handleUpdate is called', async () => {
      await element.fetchData();
      const originalCount = element._ssids.length;

      // Add a new SSID entity
      hass.states['switch.new_ssid_enabled_switch'] = {
        entity_id: 'switch.new_ssid_enabled_switch',
        state: 'on',
        attributes: {
          friendly_name: 'New SSID Enabled Control',
          entity_category: 'config',
          network_id: 'N_12345',
          network_name: 'Main Office',
          ssid_number: 3,
        },
      };

      element.handleUpdate({});
      await element.updateComplete;

      expect(element._ssids.length).to.be.greaterThan(originalCount);
    });
  });

  describe('Configuration Options', () => {
    it('shows client count when configured', async () => {
      await element.fetchData();
      await element.updateComplete;

      const clientCountElement =
        element.shadowRoot.querySelector('.ssid-clients');
      expect(clientCountElement).to.exist;
    });

    it('hides client count when not configured', async () => {
      element.setConfig({
        config_entry_id: 'test-entry',
        show_client_count: false,
      });
      await element.fetchData();
      await element.updateComplete;

      const clientCountElement =
        element.shadowRoot.querySelector('.ssid-clients');
      expect(clientCountElement).to.not.exist;
    });

    it('shows toggle switch when configured', async () => {
      await element.fetchData();
      await element.updateComplete;

      const toggleElement = element.shadowRoot.querySelector('.ssid-toggle');
      expect(toggleElement).to.exist;
    });

    it('hides toggle switch when not configured', async () => {
      element.setConfig({
        config_entry_id: 'test-entry',
        show_toggle: false,
      });
      await element.fetchData();
      await element.updateComplete;

      const toggleElement = element.shadowRoot.querySelector('.ssid-toggle');
      expect(toggleElement).to.not.exist;
    });
  });

  describe('Error Handling', () => {
    it('handles missing network_id gracefully', async () => {
      hass.states['switch.broken_ssid'] = {
        entity_id: 'switch.broken_ssid',
        state: 'on',
        attributes: {
          friendly_name: 'Broken SSID Enabled Control',
          entity_category: 'config',
          ssid_number: 99,
        },
      };

      await element.fetchData();
      await element.updateComplete;

      // Should not crash, just skip the broken entity
      expect(element._ssids).to.exist;
    });

    it('handles missing hass gracefully', async () => {
      // The card should handle missing hass gracefully without crashing
      const errorElement = await fixture(
        html`<meraki-ssids-list-card></meraki-ssids-list-card>`
      );
      // Set config but no hass
      errorElement.setConfig({ config_entry_id: 'test-entry' });
      // fetchData returns early if no hass is set
      await errorElement.fetchData();
      // Element should still exist and not crash
      expect(errorElement).to.exist;
      expect(errorElement.config).to.have.property('config_entry_id');
    });
  });
});

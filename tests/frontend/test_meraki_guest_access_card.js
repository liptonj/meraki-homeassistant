import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';
import { MerakiGuestAccessCard } from '../../custom_components/meraki_ha/www/cards/meraki-guest-access-card.js';

describe('MerakiGuestAccessCard', () => {
  let element;
  let hass;
  let mockGuestSSIDs;

  beforeEach(async () => {
    // Mock guest SSID entities
    mockGuestSSIDs = {
      'switch.guest_wifi_enabled_switch': {
        entity_id: 'switch.guest_wifi_enabled_switch',
        state: 'on',
        attributes: {
          friendly_name: 'Guest WiFi Enabled Control',
          entity_category: 'config',
          network_id: 'N_12345',
          network_name: 'Main Office',
          ssid_number: 1,
          auth_mode: 'psk',
          device_class: 'outlet',
          meraki_device_type: 'ssid',
        },
      },
      'switch.visitor_network_enabled_switch': {
        entity_id: 'switch.visitor_network_enabled_switch',
        state: 'on',
        attributes: {
          friendly_name: 'Visitor Network Enabled Control',
          entity_category: 'config',
          network_id: 'N_12345',
          network_name: 'Main Office',
          ssid_number: 2,
          auth_mode: 'open',
          device_class: 'outlet',
          meraki_device_type: 'ssid',
        },
      },
      'switch.corporate_wifi_enabled_switch': {
        entity_id: 'switch.corporate_wifi_enabled_switch',
        state: 'on',
        attributes: {
          friendly_name: 'Corporate WiFi Enabled Control',
          entity_category: 'config',
          network_id: 'N_12345',
          network_name: 'Main Office',
          ssid_number: 0,
          auth_mode: '8021x',
          device_class: 'outlet',
          meraki_device_type: 'ssid',
        },
      },
    };

    hass = {
      connection: {
        sendMessagePromise: sinon.stub().resolves({ success: true }),
        subscribeMessage: sinon.stub().returns(() => {}),
      },
      states: mockGuestSSIDs,
      callService: sinon.stub().resolves(),
    };

    element = await fixture(
      html`<meraki-guest-access-card .hass=${hass}></meraki-guest-access-card>`
    );
    element.setConfig({
      config_entry_id: 'test-entry',
      show_all_ssids: false,
      default_duration: 24,
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
      const config = MerakiGuestAccessCard.getStubConfig();
      expect(config).to.have.property('show_all_ssids');
      expect(config).to.have.property('default_duration');
      expect(config.show_all_ssids).to.be.false;
      expect(config.default_duration).to.equal(24);
    });

    it('getCardSize returns dynamic size based on form state', () => {
      expect(element.getCardSize()).to.equal(3);
      element._showCreateForm = true;
      expect(element.getCardSize()).to.equal(5);
    });

    it('initializes with default form data', () => {
      expect(element._formData).to.deep.equal({
        name: '',
        passphrase: '',
        duration: 24,
      });
      expect(element._showCreateForm).to.be.false;
      expect(element._creating).to.be.false;
    });
  });

  describe('SSID Filtering', () => {
    it('filters for guest SSIDs by name', async () => {
      await element.fetchData();
      await element.updateComplete;

      // Should find 2 guest SSIDs (guest and visitor)
      expect(element._guestSSIDs).to.have.lengthOf(2);

      const ssidNames = element._guestSSIDs.map(
        (s) => s.attributes.friendly_name
      );
      expect(ssidNames).to.include('Guest WiFi Enabled Control');
      expect(ssidNames).to.include('Visitor Network Enabled Control');
      expect(ssidNames).to.not.include('Corporate WiFi Enabled Control');
    });

    it('filters for open auth mode SSIDs', async () => {
      // Remove guest names, should still find open auth
      hass.states[
        'switch.visitor_network_enabled_switch'
      ].attributes.friendly_name = 'Public Network';

      await element.fetchData();
      await element.updateComplete;

      const hasOpenAuth = element._guestSSIDs.some(
        (s) => s.attributes.auth_mode === 'open'
      );
      expect(hasOpenAuth).to.be.true;
    });

    it('filters for PSK auth mode SSIDs', async () => {
      await element.fetchData();
      await element.updateComplete;

      const hasPSK = element._guestSSIDs.some(
        (s) => s.attributes.auth_mode === 'psk'
      );
      expect(hasPSK).to.be.true;
    });

    it('shows all SSIDs when configured', async () => {
      element.setConfig({
        config_entry_id: 'test-entry',
        show_all_ssids: true,
      });
      await element.fetchData();
      await element.updateComplete;

      // Should now include corporate WiFi
      expect(element._guestSSIDs).to.have.lengthOf(3);
    });

    it('excludes SSIDs without required attributes', async () => {
      hass.states['switch.broken_ssid'] = {
        entity_id: 'switch.broken_ssid',
        state: 'on',
        attributes: {
          entity_category: 'config',
          // Missing device_class and meraki_device_type
        },
      };

      await element.fetchData();
      await element.updateComplete;

      const brokenSSID = element._guestSSIDs.find(
        (s) => s.entity_id === 'switch.broken_ssid'
      );
      expect(brokenSSID).to.be.undefined;
    });
  });

  describe('SSID Selection', () => {
    beforeEach(async () => {
      await element.fetchData();
      await element.updateComplete;
    });

    it('shows create form when SSID is selected', () => {
      const ssid = hass.states['switch.guest_wifi_enabled_switch'];
      element._selectSSID(ssid);

      expect(element._showCreateForm).to.be.true;
      expect(element._selectedSSID).to.equal(ssid);
    });

    it('resets form when cancelled', () => {
      const ssid = hass.states['switch.guest_wifi_enabled_switch'];
      element._selectSSID(ssid);
      element._formData.name = 'Test Guest';
      element._formData.passphrase = 'testpass123';

      element._cancelCreate();

      expect(element._showCreateForm).to.be.false;
      expect(element._selectedSSID).to.be.null;
      expect(element._formData.name).to.equal('');
      expect(element._formData.passphrase).to.equal('');
      expect(element._formData.duration).to.equal(24);
    });

    it('shows create button in header when form not shown', async () => {
      const createButton = element.shadowRoot.querySelector('.create-button');
      expect(createButton).to.exist;
    });

    it('hides create button when form is shown', async () => {
      element._showCreateForm = true;
      await element.updateComplete;

      const createButton = element.shadowRoot.querySelector('.create-button');
      expect(createButton).to.not.exist;
    });
  });

  describe('Form Validation', () => {
    beforeEach(async () => {
      await element.fetchData();
      await element.updateComplete;
      const ssid = hass.states['switch.guest_wifi_enabled_switch'];
      element._selectSSID(ssid);
      await element.updateComplete;
    });

    it('requires SSID selection', async () => {
      element._selectedSSID = null;
      element._formData.name = 'Test Guest';
      element._formData.passphrase = 'testpass123';

      await element._createKey();

      // Should not call API
      expect(hass.connection.sendMessagePromise.called).to.be.false;
    });

    it('requires guest name', async () => {
      element._formData.name = '';
      element._formData.passphrase = 'testpass123';

      await element._createKey();

      expect(hass.connection.sendMessagePromise.called).to.be.false;
    });

    it('requires passphrase', async () => {
      element._formData.name = 'Test Guest';
      element._formData.passphrase = '';

      await element._createKey();

      expect(hass.connection.sendMessagePromise.called).to.be.false;
    });

    it('enforces minimum passphrase length in UI', async () => {
      element._formData.name = 'Test Guest';
      element._formData.passphrase = 'short';
      await element.updateComplete;

      const submitButton = element.shadowRoot.querySelector(
        '.form-button.primary'
      );
      expect(submitButton.disabled).to.be.true;
    });

    it('enables submit button with valid input', async () => {
      element._formData.name = 'Test Guest';
      element._formData.passphrase = 'validpass123';
      await element.updateComplete;

      const submitButton = element.shadowRoot.querySelector(
        '.form-button.primary'
      );
      expect(submitButton.disabled).to.be.false;
    });
  });

  describe('Timed Access Key Creation', () => {
    beforeEach(async () => {
      await element.fetchData();
      await element.updateComplete;
      const ssid = hass.states['switch.guest_wifi_enabled_switch'];
      element._selectSSID(ssid);
      element._formData.name = 'Test Guest';
      element._formData.passphrase = 'testpass123';
      element._formData.duration = 24;
    });

    it('calls WebSocket API with correct parameters', async () => {
      await element._createKey();

      expect(hass.connection.sendMessagePromise.calledOnce).to.be.true;
      const callArgs = hass.connection.sendMessagePromise.firstCall.args[0];

      expect(callArgs.type).to.equal('meraki_ha/create_timed_access_key');
      expect(callArgs.config_entry_id).to.equal('test-entry');
      expect(callArgs.network_id).to.equal('N_12345');
      expect(callArgs.ssid_number).to.equal(1);
      expect(callArgs.name).to.equal('Test Guest');
      expect(callArgs.passphrase).to.equal('testpass123');
      expect(callArgs.duration_hours).to.equal(24);
    });

    it('parses duration as integer', async () => {
      element._formData.duration = '48'; // String value
      await element._createKey();

      const callArgs = hass.connection.sendMessagePromise.firstCall.args[0];
      expect(callArgs.duration_hours).to.equal(48);
      expect(typeof callArgs.duration_hours).to.equal('number');
    });

    it('sets creating state during API call', async () => {
      let creatingDuringCall = false;
      hass.connection.sendMessagePromise = sinon.stub().callsFake(async () => {
        creatingDuringCall = element._creating;
        return { success: true };
      });

      await element._createKey();

      expect(creatingDuringCall).to.be.true;
      expect(element._creating).to.be.false; // Reset after completion
    });

    it('disables submit button while creating', async () => {
      element._creating = true;
      await element.updateComplete;

      const submitButton = element.shadowRoot.querySelector(
        '.form-button.primary'
      );
      expect(submitButton.disabled).to.be.true;
      expect(submitButton.textContent.trim()).to.equal('Creating...');
    });

    it('resets form after successful creation', async () => {
      await element._createKey();

      expect(element._showCreateForm).to.be.false;
      expect(element._selectedSSID).to.be.null;
      expect(element._formData.name).to.equal('');
      expect(element._formData.passphrase).to.equal('');
    });

    it('refreshes data after successful creation', async () => {
      const fetchSpy = sinon.spy(element, 'fetchData');
      await element._createKey();

      expect(fetchSpy.calledOnce).to.be.true;
    });

    it('handles API errors gracefully', async () => {
      hass.connection.sendMessagePromise.rejects(new Error('API Error'));
      await element._createKey();

      expect(element._error).to.include('API Error');
      expect(element._creating).to.be.false;
    });

    it('shows default error message for unknown errors', async () => {
      hass.connection.sendMessagePromise.rejects(new Error());
      await element._createKey();

      expect(element._error).to.include('Failed to create access key');
    });
  });

  describe('Form Fields', () => {
    beforeEach(async () => {
      await element.fetchData();
      await element.updateComplete;
      element._showCreateForm = true;
      await element.updateComplete;
    });

    it('renders SSID selection dropdown', () => {
      const ssidSelect = element.shadowRoot.querySelector(
        'select.form-select'
      );
      expect(ssidSelect).to.exist;
    });

    it('renders guest name input', () => {
      const nameInput = element.shadowRoot.querySelector(
        'input[placeholder*="John Doe"]'
      );
      expect(nameInput).to.exist;
    });

    it('renders passphrase input', () => {
      const passphraseInput = element.shadowRoot.querySelector(
        'input[placeholder*="8 characters"]'
      );
      expect(passphraseInput).to.exist;
    });

    it('renders duration dropdown with preset options', () => {
      const durationSelect = element.shadowRoot.querySelectorAll(
        'select.form-select'
      )[1];
      expect(durationSelect).to.exist;

      const options = Array.from(durationSelect.querySelectorAll('option'));
      const durations = options.map((o) => o.value);

      expect(durations).to.include('1');
      expect(durations).to.include('4');
      expect(durations).to.include('8');
      expect(durations).to.include('24');
      expect(durations).to.include('72');
      expect(durations).to.include('168');
    });

    it('uses default duration from config', async () => {
      element.setConfig({
        config_entry_id: 'test-entry',
        default_duration: 48,
      });
      element._cancelCreate(); // Reset form with new config

      expect(element._formData.duration).to.equal(48);
    });
  });

  describe('Expiration Formatting', () => {
    it('formats future expiration as days remaining', () => {
      const expiresAt = new Date(Date.now() + 86400000 * 3).toISOString(); // 3 days
      expect(element._formatExpiration(expiresAt)).to.equal('3d remaining');
    });

    it('formats future expiration as hours remaining', () => {
      const expiresAt = new Date(Date.now() + 3600000 * 5).toISOString(); // 5 hours
      expect(element._formatExpiration(expiresAt)).to.equal('5h remaining');
    });

    it('formats past expiration as "Expired"', () => {
      const expiresAt = new Date(Date.now() - 3600000).toISOString(); // 1 hour ago
      expect(element._formatExpiration(expiresAt)).to.equal('Expired');
    });

    it('handles null expiration', () => {
      expect(element._formatExpiration(null)).to.equal('Never');
    });

    it('handles undefined expiration', () => {
      expect(element._formatExpiration(undefined)).to.equal('Never');
    });
  });

  describe('Active Keys Display', () => {
    it('shows active keys section when keys exist', async () => {
      element._activeKeys = [
        {
          name: 'John Doe',
          ssid: 'Guest WiFi',
          passphrase: 'guestpass123',
          expiresAt: new Date(Date.now() + 86400000).toISOString(),
          expired: false,
        },
      ];
      await element.updateComplete;

      const keysSection = element.shadowRoot.querySelector('.keys-list');
      expect(keysSection).to.exist;
    });

    it('hides active keys section when no keys', async () => {
      await element.fetchData();
      await element.updateComplete;

      const keysSection = element.shadowRoot.querySelector('.keys-list');
      expect(keysSection).to.not.exist;
    });

    it('displays key information correctly', async () => {
      element._activeKeys = [
        {
          name: 'John Doe',
          ssid: 'Guest WiFi',
          passphrase: 'guestpass123',
          expiresAt: new Date(Date.now() + 86400000).toISOString(),
          expired: false,
        },
      ];
      await element.updateComplete;

      const keyItem = element.shadowRoot.querySelector('.key-item');
      expect(keyItem).to.exist;
      expect(keyItem.textContent).to.include('John Doe');
      expect(keyItem.textContent).to.include('Guest WiFi');
    });

    it('styles expired keys differently', async () => {
      element._activeKeys = [
        {
          name: 'Jane Doe',
          ssid: 'Guest WiFi',
          passphrase: 'oldpass123',
          expiresAt: new Date(Date.now() - 3600000).toISOString(),
          expired: true,
        },
      ];
      await element.updateComplete;

      const keyIcon = element.shadowRoot.querySelector('.key-icon');
      expect(keyIcon.classList.contains('expired')).to.be.true;
    });
  });

  describe('Passphrase Copy Function', () => {
    let clipboardStub;

    beforeEach(() => {
      clipboardStub = sinon.stub(navigator.clipboard, 'writeText').resolves();
    });

    afterEach(() => {
      clipboardStub.restore();
    });

    it('copies passphrase to clipboard', async () => {
      await element._copyPassphrase('testpass123');
      expect(clipboardStub.calledWith('testpass123')).to.be.true;
    });
  });

  describe('QR Code Generation', () => {
    it('generates WiFi QR code data in correct format', () => {
      const qrData = element._generateQRCode('Guest WiFi', 'guestpass123');
      expect(qrData).to.equal('WIFI:T:WPA;S:Guest WiFi;P:guestpass123;;');
    });
  });

  describe('Empty State', () => {
    it('renders empty state when no guest SSIDs found', async () => {
      hass.states = {};
      await element.fetchData();
      await element.updateComplete;

      const emptyState = element.shadowRoot.querySelector('.empty-state');
      expect(emptyState).to.exist;
      expect(emptyState.textContent).to.include('No guest SSIDs found');
    });

    it('provides helpful message in empty state', async () => {
      hass.states = {};
      await element.fetchData();
      await element.updateComplete;

      const emptyState = element.shadowRoot.querySelector('.empty-state');
      expect(emptyState.textContent).to.include('Configure a guest SSID');
    });
  });

  describe('Real-time Updates', () => {
    it('refreshes data when handleUpdate is called', async () => {
      await element.fetchData();
      const originalCount = element._guestSSIDs.length;

      // Add a new guest SSID
      hass.states['switch.new_guest_enabled_switch'] = {
        entity_id: 'switch.new_guest_enabled_switch',
        state: 'on',
        attributes: {
          friendly_name: 'New Guest Network Enabled Control',
          entity_category: 'config',
          network_id: 'N_12345',
          network_name: 'Main Office',
          ssid_number: 3,
          auth_mode: 'open',
          device_class: 'outlet',
          meraki_device_type: 'ssid',
        },
      };

      element.handleUpdate({});
      await element.updateComplete;

      expect(element._guestSSIDs.length).to.be.greaterThan(originalCount);
    });
  });

  describe('Error Handling', () => {
    it('handles fetch errors gracefully', async () => {
      Object.defineProperty(hass, 'states', {
        get: () => {
          throw new Error('States unavailable');
        },
      });

      await element.fetchData();

      expect(element._error).to.exist;
      expect(element._loading).to.be.false;
    });
  });

  describe('Success Notification', () => {
    it('dispatches notification event on success', () => {
      const eventSpy = sinon.spy();
      element.addEventListener('hass-notification', eventSpy);

      element._showSuccessMessage();

      expect(eventSpy.calledOnce).to.be.true;
      expect(eventSpy.firstCall.args[0].detail.message).to.include('success');
    });
  });
});

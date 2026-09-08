import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';
import { MerakiCameraCard } from '../../custom_components/meraki_ha/www/meraki-camera-card/meraki-camera-card.js';

describe('MerakiCameraCard', () => {
  let element;
  let hass;

  beforeEach(async () => {
    // Per HA docs, hass object provides states and connection
    hass = {
      states: {
        'camera.meraki_camera': {
          entity_id: 'camera.meraki_camera',
          state: 'idle',
          attributes: {
            friendly_name: 'Meraki Camera',
            meraki_dashboard_url: 'https://dashboard.meraki.com',
          },
        },
      },
      connection: {
        subscribeMessage: sinon.stub().returns(() => {}),
        sendMessagePromise: sinon.stub().resolves({
          cameras: [],
        }),
      },
      callWS: sinon.stub().resolves({}),
    };

    element = await fixture(html`<meraki-camera-card></meraki-camera-card>`);
    element.setConfig({
      config_entry_id: 'test-entry',
      entity_id: 'camera.meraki_camera',
    });
    element.hass = hass;
    await element.updateComplete;
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('Card Registration', () => {
    it('is registered as a custom element', () => {
      expect(customElements.get('meraki-camera-card')).to.exist;
    });

    it('creates element instance', () => {
      expect(element).to.exist;
      expect(element.tagName.toLowerCase()).to.equal('meraki-camera-card');
    });
  });

  describe('Configuration (per HA docs)', () => {
    it('setConfig stores the configuration', () => {
      element.setConfig({
        config_entry_id: 'test-entry',
        entity_id: 'camera.test',
        show_controls: true,
      });
      expect(element.config).to.have.property('entity_id', 'camera.test');
      expect(element.config).to.have.property('show_controls', true);
    });

    it('getStubConfig returns default config structure', () => {
      const stubConfig = MerakiCameraCard.getStubConfig();
      expect(stubConfig).to.have.property('entity_id');
      expect(stubConfig).to.have.property('show_controls');
      expect(stubConfig).to.have.property('show_snapshot_button');
    });

    it('getConfigElement returns editor element', () => {
      const editor = MerakiCameraCard.getConfigElement();
      expect(editor).to.exist;
      expect(editor.tagName.toLowerCase()).to.equal(
        'meraki-camera-card-editor'
      );
    });
  });

  describe('hass Property', () => {
    it('receives and stores hass object', () => {
      expect(element.hass).to.exist;
      expect(element.hass.states).to.exist;
    });

    it('subscribes to updates when hass is set', () => {
      expect(hass.connection.subscribeMessage.called).to.be.true;
    });
  });

  describe('Rendering', () => {
    it('renders with shadowRoot', () => {
      expect(element.shadowRoot).to.exist;
    });

    it('renders card structure', async () => {
      element._loading = false;
      await element.updateComplete;
      const card = element.shadowRoot.querySelector('ha-card');
      expect(card).to.exist;
    });
  });

  describe('Properties', () => {
    it('has _collapsed property for collapsible behavior', () => {
      expect(element).to.have.property('_collapsed');
    });

    it('has _streamUrl property for video source', () => {
      expect(element).to.have.property('_streamUrl');
    });

    it('has _streamType property', () => {
      expect(element).to.have.property('_streamType');
    });
  });

  describe('Camera Linking', () => {
    it('has _showLinkPanel property for camera linking UI', () => {
      expect(element).to.have.property('_showLinkPanel');
    });

    it('has _availableCameras property', () => {
      expect(element).to.have.property('_availableCameras');
    });
  });
});

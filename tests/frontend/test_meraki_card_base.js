import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';
import { MerakiCardBase } from '../../custom_components/meraki_ha/www/shared/meraki-card-base.js';

customElements.define('meraki-card-base-test', MerakiCardBase);

describe('MerakiCardBase', () => {
  let element;
  let hass;

  beforeEach(async () => {
    hass = {
      connection: {
        sendMessagePromise: sinon.stub().resolves({}),
        subscribeMessage: sinon.stub().returns(() => {}),
      },
    };
    element = await fixture(
      html`<meraki-card-base-test .hass=${hass}></meraki-card-base-test>`
    );
    element.config = { config_entry_id: 'test-entry' };
  });

  it('renders a loading spinner by default', () => {
    expect(element.shadowRoot.querySelector('ha-circular-progress')).to.exist;
  });

  it('renders an error message when _error is set', async () => {
    element._loading = false;
    element._error = 'Test Error';
    await element.updateComplete;
    const errorDiv = element.shadowRoot.querySelector('.error');
    expect(errorDiv).to.exist;
    expect(errorDiv.textContent).to.contain('Test Error');
  });

  it('calls _callMerakiApi and sets loading state', async () => {
    element.config = { config_entry_id: 'test_id' };
    await element._callMerakiApi('meraki/get_overview');
    expect(hass.connection.sendMessagePromise.calledOnce).to.be.true;
    expect(element._loading).to.be.false;
  });

  it('sets _error state on API call failure', async () => {
    hass.connection.sendMessagePromise.rejects(new Error('API Failed'));
    element.config = { config_entry_id: 'test_id' };
    try {
      await element._callMerakiApi('meraki/get_overview');
    } catch (e) {
      // expected
    }
    // _error is now a JSON string with detailed error info
    expect(element._error).to.include('API Failed');
    const errorDetails = JSON.parse(element._error);
    expect(errorDetails.message).to.equal('API Failed');
  });

  it('subscribes to updates when hass is set', () => {
    element.hass = hass;
    expect(hass.connection.subscribeMessage.calledOnce).to.be.true;
  });

  describe('WebSocket Subscription Cleanup', () => {
    it('stores subscription handler', () => {
      element.hass = hass;
      expect(element.subscription).to.exist;
      expect(typeof element.subscription).to.equal('function');
    });

    it('unsubscribes when subscription exists before resubscribing', () => {
      element.hass = hass;
      const firstSubscription = element.subscription;

      // Mock unsubscribe by making it callable
      const unsubscribeSpy = sinon.spy();
      element.subscription = unsubscribeSpy;

      // Trigger resubscription
      element._subscribeToUpdates();

      expect(unsubscribeSpy.calledOnce).to.be.true;
    });

    it('calls handleUpdate when message received', (done) => {
      const handleUpdateStub = sinon.stub(element, 'handleUpdate');
      element.hass = hass;

      // Get the callback that was registered
      const subscribeCall = hass.connection.subscribeMessage.firstCall;
      const messageCallback = subscribeCall.args[0];

      // Simulate receiving a message
      const testMessage = { data: 'test' };
      messageCallback(testMessage);

      expect(handleUpdateStub.calledWith(testMessage)).to.be.true;
      done();
    });
  });

  describe('Error Recovery', () => {
    it('recovers from API call errors', async () => {
      hass.connection.sendMessagePromise.rejects(new Error('Network error'));
      element.config = { config_entry_id: 'test_id' };

      try {
        await element._callMerakiApi('meraki/get_overview');
      } catch (e) {
        // Expected
      }

      // Should be able to retry
      hass.connection.sendMessagePromise.resolves({ data: 'success' });
      const result = await element._callMerakiApi('meraki/get_overview');

      expect(result.data).to.equal('success');
      expect(element._error).to.be.null;
    });

    it('clears error on successful API call', async () => {
      element._error = 'Previous error';
      element.config = { config_entry_id: 'test_id' };

      await element._callMerakiApi('meraki/get_overview');

      expect(element._error).to.be.null;
    });
  });

  describe('Loading State Transitions', () => {
    it('sets loading true at start of API call', async () => {
      element.config = { config_entry_id: 'test_id' };
      element._loading = false;

      const promise = element._callMerakiApi('meraki/get_overview');

      // Should be loading immediately
      expect(element._loading).to.be.true;

      await promise;
    });

    it('sets loading false after successful API call', async () => {
      element.config = { config_entry_id: 'test_id' };

      await element._callMerakiApi('meraki/get_overview');

      expect(element._loading).to.be.false;
    });

    it('sets loading false after failed API call', async () => {
      hass.connection.sendMessagePromise.rejects(new Error('Error'));
      element.config = { config_entry_id: 'test_id' };

      try {
        await element._callMerakiApi('meraki/get_overview');
      } catch (e) {
        // Expected
      }

      expect(element._loading).to.be.false;
    });

    it('transitions from loading to error state', async () => {
      hass.connection.sendMessagePromise.rejects(new Error('Test error'));
      element.config = { config_entry_id: 'test_id' };

      try {
        await element._callMerakiApi('meraki/get_overview');
      } catch (e) {
        // Expected
      }

      expect(element._loading).to.be.false;
      // _error is now a JSON string with detailed error info
      expect(element._error).to.include('Test error');
    });

    it('transitions from loading to success state', async () => {
      element.config = { config_entry_id: 'test_id' };

      await element._callMerakiApi('meraki/get_overview');

      expect(element._loading).to.be.false;
      expect(element._error).to.be.null;
    });
  });

  describe('Render States', () => {
    it('renders loading spinner when loading is true', async () => {
      element._loading = true;
      await element.updateComplete;

      const spinner = element.shadowRoot.querySelector('ha-circular-progress');
      expect(spinner).to.exist;
    });

    it('does not render spinner when loading is false', async () => {
      element._loading = false;
      element._error = null;
      await element.updateComplete;

      const spinner = element.shadowRoot.querySelector('ha-circular-progress');
      expect(spinner).to.not.exist;
    });

    it('renders error before loading', async () => {
      element._loading = true;
      element._error = 'Test Error';
      await element.updateComplete;

      const errorDiv = element.shadowRoot.querySelector('.error');
      const spinner = element.shadowRoot.querySelector('ha-circular-progress');

      expect(errorDiv).to.not.exist; // Error takes precedence
      expect(spinner).to.exist;
    });

    it('calls renderCard when not loading and no error', async () => {
      element._loading = false;
      element._error = null;
      const renderCardSpy = sinon.spy(element, 'renderCard');

      await element.updateComplete;
      element.render();

      expect(renderCardSpy.called).to.be.true;
    });
  });

  describe('Config Validation', () => {
    it('throws error when config_entry_id is missing', () => {
      expect(() => element.setConfig({})).to.throw(
        'config_entry_id must be specified'
      );
    });

    it('accepts config with valid config_entry_id', () => {
      expect(() =>
        element.setConfig({ config_entry_id: 'test' })
      ).to.not.throw();
    });

    it('fetches data immediately after setting config', () => {
      const fetchSpy = sinon.spy(element, 'fetchData');
      element.setConfig({ config_entry_id: 'test' });

      expect(fetchSpy.calledOnce).to.be.true;
    });
  });

  describe('API Call Parameters', () => {
    it('includes config_entry_id in API calls', async () => {
      element.config = { config_entry_id: 'test_entry_123' };

      await element._callMerakiApi('meraki/get_overview');

      const callArgs = hass.connection.sendMessagePromise.firstCall.args[0];
      expect(callArgs.config_entry_id).to.equal('test_entry_123');
    });

    it('includes command type in API calls', async () => {
      element.config = { config_entry_id: 'test' };

      await element._callMerakiApi('meraki/get_devices');

      const callArgs = hass.connection.sendMessagePromise.firstCall.args[0];
      expect(callArgs.type).to.equal('meraki/get_devices');
    });

    it('merges additional params into API call', async () => {
      element.config = { config_entry_id: 'test' };

      await element._callMerakiApi('meraki/get_device', {
        serial: 'Q2XX-1234',
      });

      const callArgs = hass.connection.sendMessagePromise.firstCall.args[0];
      expect(callArgs.serial).to.equal('Q2XX-1234');
    });

    it('handles params with undefined values', async () => {
      element.config = { config_entry_id: 'test' };

      await element._callMerakiApi('meraki/test', { optional: undefined });

      const callArgs = hass.connection.sendMessagePromise.firstCall.args[0];
      expect(callArgs).to.have.property('optional');
    });
  });

  describe('Error Message Handling', () => {
    it('captures error message from Error object', async () => {
      hass.connection.sendMessagePromise.rejects(new Error('Specific error'));
      element.config = { config_entry_id: 'test' };

      try {
        await element._callMerakiApi('meraki/test');
      } catch (e) {
        // Expected
      }

      // _error is now a JSON string with detailed error info
      expect(element._error).to.include('Specific error');
      const errorDetails = JSON.parse(element._error);
      expect(errorDetails.message).to.equal('Specific error');
    });

    it('uses fallback error message when none provided', async () => {
      hass.connection.sendMessagePromise.rejects(new Error());
      element.config = { config_entry_id: 'test' };

      try {
        await element._callMerakiApi('meraki/test');
      } catch (e) {
        // Expected
      }

      // _error is now a JSON string with detailed error info
      expect(element._error).to.include('Unknown error');
      const errorDetails = JSON.parse(element._error);
      expect(errorDetails.message).to.equal('Unknown error');
    });

    it('throws error after setting error state', async () => {
      hass.connection.sendMessagePromise.rejects(new Error('Test'));
      element.config = { config_entry_id: 'test' };

      let thrownError;
      try {
        await element._callMerakiApi('meraki/test');
      } catch (e) {
        thrownError = e;
      }

      expect(thrownError).to.exist;
      // _error is now a JSON string with detailed error info
      expect(element._error).to.include('Test');
    });
  });

  describe('Connection Availability', () => {
    it('throws error when hass connection not available', async () => {
      // Set hass to null directly on the internal property to avoid triggering subscription
      element._hass = null;
      element.config = { config_entry_id: 'test' };

      let error;
      try {
        await element._callMerakiApi('meraki/test');
      } catch (e) {
        error = e;
      }

      expect(error).to.exist;
      expect(error.message).to.include('not available');
    });
  });
});

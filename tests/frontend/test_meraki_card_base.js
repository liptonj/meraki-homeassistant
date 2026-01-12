import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';
import { MerakiCardBase } from '../../custom_components/meraki_ha/www/cards/shared/meraki-card-base.js';

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
    element = await fixture(html`<meraki-card-base-test .hass=${hass}></meraki-card-base-test>`);
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
    expect(element._error).to.equal('API Failed');
  });

  it('subscribes to updates when hass is set', () => {
    element.hass = hass;
    expect(hass.connection.subscribeMessage.calledOnce).to.be.true;
  });
});

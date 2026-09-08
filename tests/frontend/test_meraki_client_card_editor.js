import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';
import { MerakiClientCardEditor } from '../../custom_components/meraki_ha/www/meraki-client-card/meraki-client-card-editor.js';

describe('MerakiClientCardEditor', () => {
  let editor;

  beforeEach(async () => {
    editor = await fixture(
      html`<meraki-client-card-editor></meraki-client-card-editor>`
    );
    editor.hass = {};
    editor.setConfig({
      config_entry_id: 'test-entry',
      client_mac: 'aa:bb:cc:dd:ee:ff',
      show_usage: true,
      show_connection_info: true,
    });
    await editor.updateComplete;
  });

  it('renders form sections', () => {
    const sections = editor.shadowRoot.querySelectorAll('.section');
    expect(sections.length).to.be.at.least(2);
  });

  it('renders integration selector for config_entry_id', () => {
    const selector = editor.shadowRoot.querySelector('ha-selector');
    expect(selector).to.exist;
  });

  it('renders client mac textfield', () => {
    // Select by label attribute which is a valid DOM attribute
    const textfield = editor.shadowRoot.querySelector(
      'ha-textfield[label="Client MAC Address"]'
    );
    expect(textfield).to.exist;
  });

  it('renders entity_id textfield', () => {
    // Select by label attribute which is a valid DOM attribute
    const textfield = editor.shadowRoot.querySelector(
      'ha-textfield[label="Entity ID"]'
    );
    expect(textfield).to.exist;
  });

  it('renders display option checkboxes', () => {
    const checkboxes = editor.shadowRoot.querySelectorAll('ha-checkbox');
    expect(checkboxes.length).to.be.at.least(4);
  });

  it('handles config entry changed event', async () => {
    const spy = sinon.spy();
    editor.addEventListener('config-changed', spy);
    editor._handleConfigEntryChanged({ detail: { value: 'new-entry-id' } });
    expect(spy.calledOnce).to.be.true;
    expect(spy.firstCall.args[0].detail.config.config_entry_id).to.equal(
      'new-entry-id'
    );
  });

  it('preserves other config values when changing config_entry_id', () => {
    const spy = sinon.spy();
    editor.addEventListener('config-changed', spy);
    editor._handleConfigEntryChanged({ detail: { value: 'new-entry-id' } });
    const newConfig = spy.firstCall.args[0].detail.config;
    expect(newConfig.client_mac).to.equal('aa:bb:cc:dd:ee:ff');
    expect(newConfig.show_usage).to.be.true;
  });

  it('dispatches config-changed on value change', async () => {
    const spy = sinon.spy();
    editor.addEventListener('config-changed', spy);
    // Select by label attribute which is a valid DOM attribute
    const textfield = editor.shadowRoot.querySelector(
      'ha-textfield[label="Client MAC Address"]'
    );
    textfield.value = '11:22:33:44:55:66';
    textfield.dispatchEvent(
      new Event('input', { bubbles: true, composed: true })
    );
    // Wait for event to propagate
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(spy.called).to.be.true;
  });
});

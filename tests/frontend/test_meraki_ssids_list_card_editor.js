import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';
import { MerakiSSIDsListCardEditor } from '../../custom_components/meraki_ha/www/meraki-ssids-list-card-editor.js';

describe('MerakiSSIDsListCardEditor', () => {
  let editor;

  beforeEach(async () => {
    editor = await fixture(
      html`<meraki-ssids-list-card-editor></meraki-ssids-list-card-editor>`
    );
    editor.hass = {};
    editor.setConfig({
      config_entry_id: 'test-entry',
      show_filter: true,
      show_client_count: true,
      show_toggle: true,
      collapsed_by_default: false,
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

  it('renders title textfield', () => {
    const textfield = editor.shadowRoot.querySelector('ha-textfield#title');
    expect(textfield).to.exist;
  });

  it('renders display option toggles', () => {
    const toggles = editor.shadowRoot.querySelectorAll('.toggle-row');
    expect(toggles.length).to.be.at.least(3);
  });

  it('sets default config values', () => {
    editor.setConfig({});
    expect(editor.config.show_filter).to.be.true;
    expect(editor.config.show_client_count).to.be.true;
    expect(editor.config.show_toggle).to.be.true;
    expect(editor.config.collapsed_by_default).to.be.false;
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
    expect(newConfig.show_filter).to.be.true;
    expect(newConfig.show_client_count).to.be.true;
  });

  it('dispatches config-changed on toggle change', async () => {
    const spy = sinon.spy();
    editor.addEventListener('config-changed', spy);
    const toggle = editor.shadowRoot.querySelector('ha-switch');
    if (toggle) {
      toggle.checked = false;
      toggle.dispatchEvent(
        new Event('change', { bubbles: true, composed: true })
      );
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(spy.called).to.be.true;
    }
  });
});

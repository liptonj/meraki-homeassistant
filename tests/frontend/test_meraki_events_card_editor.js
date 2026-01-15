import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';
import { MerakiEventsCardEditor } from '../../custom_components/meraki_ha/www/meraki-events-card-editor.js';

describe('MerakiEventsCardEditor', () => {
  let editor;

  beforeEach(async () => {
    editor = await fixture(
      html`<meraki-events-card-editor></meraki-events-card-editor>`
    );
    editor.hass = {};
    editor.setConfig({
      config_entry_id: 'test-entry',
      events_per_page: 10,
      show_filters: true,
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

  it('renders pagination selector', () => {
    // Pagination selector should be present
    const text = editor.shadowRoot.textContent;
    expect(text).to.include('Events per page');
  });

  it('sets default config values', () => {
    editor.setConfig({});
    expect(editor.config.events_per_page).to.equal(10);
    expect(editor.config.show_filters).to.be.true;
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

  it('handles events per page changed event', async () => {
    const spy = sinon.spy();
    editor.addEventListener('config-changed', spy);
    editor._handleEventsPerPageChanged({ detail: { value: 20 } });
    expect(spy.calledOnce).to.be.true;
    expect(spy.firstCall.args[0].detail.config.events_per_page).to.equal(20);
  });

  it('preserves other config values when changing events_per_page', () => {
    const spy = sinon.spy();
    editor.addEventListener('config-changed', spy);
    editor._handleEventsPerPageChanged({ detail: { value: 25 } });
    const newConfig = spy.firstCall.args[0].detail.config;
    expect(newConfig.show_filters).to.be.true;
    expect(newConfig.config_entry_id).to.equal('test-entry');
  });
});

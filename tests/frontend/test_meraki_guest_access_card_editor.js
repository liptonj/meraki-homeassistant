import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';
import { MerakiGuestAccessCardEditor } from '../../custom_components/meraki_ha/www/meraki-guest-access-card-editor.js';

describe('MerakiGuestAccessCardEditor', () => {
  let editor;

  beforeEach(async () => {
    editor = await fixture(
      html`<meraki-guest-access-card-editor></meraki-guest-access-card-editor>`
    );
    editor.hass = {};
    editor.setConfig({
      config_entry_id: 'test-entry',
      show_qr_code: true,
      default_duration: 24,
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

  it('renders default duration selector', () => {
    const text = editor.shadowRoot.textContent;
    expect(text).to.include('Default Access Duration');
  });

  it('sets default config values', () => {
    editor.setConfig({});
    expect(editor.config.show_qr_code).to.be.true;
    expect(editor.config.default_duration).to.equal(24);
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

  it('handles duration changed event', async () => {
    const spy = sinon.spy();
    editor.addEventListener('config-changed', spy);
    editor._handleDurationChanged({ detail: { value: 48 } });
    expect(spy.calledOnce).to.be.true;
    expect(spy.firstCall.args[0].detail.config.default_duration).to.equal(48);
  });

  it('preserves other config values when changing duration', () => {
    const spy = sinon.spy();
    editor.addEventListener('config-changed', spy);
    editor._handleDurationChanged({ detail: { value: 72 } });
    const newConfig = spy.firstCall.args[0].detail.config;
    expect(newConfig.show_qr_code).to.be.true;
    expect(newConfig.config_entry_id).to.equal('test-entry');
  });
});

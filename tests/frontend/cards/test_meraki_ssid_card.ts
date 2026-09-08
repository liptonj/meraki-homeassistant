import { html, fixture, expect } from '@open-wc/testing';
import { MerakiSSIDCard } from '../custom_components/meraki_ha/www/src/cards/meraki-ssid-card';

customElements.define('meraki-ssid-card', MerakiSSIDCard);

describe('MerakiSSIDCard', () => {
  it('renders a default card', async () => {
    const card = await fixture(html`<meraki-ssid-card></meraki-ssid-card>`);
    expect(card).to.exist;
  });
});

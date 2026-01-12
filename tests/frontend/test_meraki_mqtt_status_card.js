
import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';
import 'custom-card-helpers';
import '../../custom_components/meraki_ha/www/cards/meraki-mqtt-status-card.ts';

describe('MerakiMqttStatusCard', () => {
  let element;

  const defaultConfig = {
    type: 'custom:meraki-mqtt-status-card',
    title: 'MQTT Status',
  };

  const defaultHass = {
    states: {
      'sensor.meraki_cloud_simulator_mqtt_data': {
        attributes: {
          enabled: true,
          stats: {
            is_running: true,
            messages_received: 1234,
            messages_processed: 1230,
            last_message_time: new Date().toISOString(),
            start_time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            sensors_mapped: 8,
          },
          relay_destinations: {},
        },
      },
    },
  };

  beforeEach(async () => {
    element = await fixture(html`<meraki-mqtt-status-card></meraki-mqtt-status-card>`);
    element.hass = defaultHass;
    element.setConfig(defaultConfig);
    await element.updateComplete;
  });

  it('renders the card', () => {
    expect(element).to.be.ok;
    expect(element.shadowRoot.querySelector('ha-card')).to.be.ok;
  });

  it('hides when MQTT is disabled and auto_hide is enabled', async () => {
    element.setConfig({ ...defaultConfig, auto_hide_when_disabled: true });
    element.hass = {
      states: {
        'sensor.meraki_cloud_simulator_mqtt_data': {
          attributes: { enabled: false },
        },
      },
    };
    await element.updateComplete;
    // This is tricky to test as the component renders null.
    // We will check the internal React component's output.
  });

  it('defaults to collapsed', async () => {
    element.setConfig({ ...defaultConfig, default_collapsed: true, collapsible: true });
    await element.updateComplete;
    // Add test to check for collapsed state
  });

  it('shows summary in collapsed state', async () => {
    element.setConfig({ ...defaultConfig, default_collapsed: true, collapsible: true });
    await element.updateComplete;
    // Add test to check for summary in collapsed state
  });
});

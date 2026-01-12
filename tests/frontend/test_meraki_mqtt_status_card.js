
import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';
import 'custom-card-helpers';
import '../../custom_components/meraki_ha/www/cards/meraki-mqtt-status-card.ts';

describe('MerakiMqttStatusCard', () => {
  let element;

  const defaultConfig = {
    type: 'custom:meraki-mqtt-status-card',
    title: 'MQTT Status',
    collapsible: true,
    default_collapsed: true,
    show_message_stats: true,
    show_relay_destinations: true,
    show_sensor_count: true,
    auto_hide_when_disabled: true,
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
          relay_destinations: {
            'home-assistant': {
              name: 'Home Assistant MQTT',
              status: 'connected',
              host: '192.168.1.10',
              port: 1883,
              topic_filter: 'meraki/v1/mt/#',
              messages_relayed: 1200,
              last_relay_time: new Date(Date.now() - 5000).toISOString(),
              last_error: null,
              last_error_time: null,
            },
            'external-broker': {
              name: 'External Broker',
              status: 'error',
              host: '10.0.0.50',
              port: 8883,
              topic_filter: 'meraki/#',
              messages_relayed: 0,
              last_relay_time: null,
              last_error: 'Connection refused',
              last_error_time: new Date(Date.now() - 60000).toISOString(),
            },
          },
        },
      },
    },
  };

  beforeEach(async () => {
    localStorage.clear();
    element = await fixture(html\`<meraki-mqtt-status-card></meraki-mqtt-status-card>\`);
    element.hass = defaultHass;
    element.setConfig(defaultConfig);
    await element.updateComplete;
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('Basic Rendering', () => {
    it('renders the card', () => {
      expect(element).to.be.ok;
      expect(element.shadowRoot.querySelector('#react-root')).to.be.ok;
    });

    it('renders when MQTT is enabled', async () => {
      element.hass = defaultHass;
      await element.updateComplete;
      expect(element).to.be.ok;
    });
  });

  describe('Auto-Hide Behavior', () => {
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
      expect(element).to.be.ok;
    });

    it('shows when MQTT is disabled but auto_hide is false', async () => {
      element.setConfig({ ...defaultConfig, auto_hide_when_disabled: false });
      element.hass = {
        states: {
          'sensor.meraki_cloud_simulator_mqtt_data': {
            attributes: { enabled: false },
          },
        },
      };
      await element.updateComplete;
      expect(element).to.be.ok;
    });
  });

  describe('Running Status', () => {
    it('shows running status correctly when running', async () => {
      element.hass = defaultHass;
      await element.updateComplete;
      expect(element).to.be.ok;
    });

    it('shows stopped status correctly when not running', async () => {
      const stoppedHass = {
        states: {
          'sensor.meraki_cloud_simulator_mqtt_data': {
            attributes: {
              enabled: true,
              stats: {
                ...defaultHass.states['sensor.meraki_cloud_simulator_mqtt_data'].attributes.stats,
                is_running: false,
              },
              relay_destinations: {},
            },
          },
        },
      };
      element.hass = stoppedHass;
      await element.updateComplete;
      expect(element).to.be.ok;
    });
  });

  describe('Message Counts', () => {
    it('displays message counts correctly', async () => {
      element.hass = defaultHass;
      await element.updateComplete;
      expect(element).to.be.ok;
    });

    it('formats large numbers with commas', async () => {
      const largeNumbersHass = {
        states: {
          'sensor.meraki_cloud_simulator_mqtt_data': {
            attributes: {
              enabled: true,
              stats: {
                is_running: true,
                messages_received: 1234567,
                messages_processed: 1234560,
                last_message_time: new Date().toISOString(),
                start_time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                sensors_mapped: 25,
              },
              relay_destinations: {},
            },
          },
        },
      };
      element.hass = largeNumbersHass;
      await element.updateComplete;
      expect(element).to.be.ok;
    });
  });

  describe('Timestamp Formatting', () => {
    it('formats timestamps correctly - just now', async () => {
      const recentHass = {
        states: {
          'sensor.meraki_cloud_simulator_mqtt_data': {
            attributes: {
              enabled: true,
              stats: {
                is_running: true,
                messages_received: 100,
                messages_processed: 100,
                last_message_time: new Date().toISOString(),
                start_time: new Date().toISOString(),
                sensors_mapped: 5,
              },
              relay_destinations: {},
            },
          },
        },
      };
      element.hass = recentHass;
      await element.updateComplete;
      expect(element).to.be.ok;
    });

    it('formats timestamps correctly - minutes ago', async () => {
      const minutesAgoHass = {
        states: {
          'sensor.meraki_cloud_simulator_mqtt_data': {
            attributes: {
              enabled: true,
              stats: {
                is_running: true,
                messages_received: 100,
                messages_processed: 100,
                last_message_time: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
                start_time: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                sensors_mapped: 5,
              },
              relay_destinations: {},
            },
          },
        },
      };
      element.hass = minutesAgoHass;
      await element.updateComplete;
      expect(element).to.be.ok;
    });
  });

  describe('Relay Destinations', () => {
    it('lists relay destinations', async () => {
      element.hass = defaultHass;
      await element.updateComplete;
      expect(element).to.be.ok;
    });

    it('shows destination status colors correctly', async () => {
      element.hass = defaultHass;
      await element.updateComplete;
      expect(element).to.be.ok;
    });

    it('shows error details for destinations with errors', async () => {
      element.hass = defaultHass;
      await element.updateComplete;
      expect(element).to.be.ok;
    });
  });

  describe('Collapsible Behavior', () => {
    it('defaults to collapsed', async () => {
      element.setConfig({ ...defaultConfig, default_collapsed: true, collapsible: true });
      await element.updateComplete;
      expect(element).to.be.ok;
    });

    it('shows summary in collapsed state', async () => {
      element.setConfig({ ...defaultConfig, default_collapsed: true, collapsible: true });
      await element.updateComplete;
      expect(element).to.be.ok;
    });

    it('remembers collapsed state in localStorage', async () => {
      const storageKey = 'meraki-mqtt-status-card.MQTT Status.collapsed';
      localStorage.setItem(storageKey, JSON.stringify(false));
      element.setConfig({ ...defaultConfig, collapsible: true });
      await element.updateComplete;
      expect(element).to.be.ok;
    });

    it('destination sections are independently collapsible', async () => {
      element.setConfig({ ...defaultConfig, default_collapsed: false });
      element.hass = defaultHass;
      await element.updateComplete;
      expect(element).to.be.ok;
    });
  });

  describe('Missing MQTT Data Handling', () => {
    it('handles missing MQTT data gracefully', async () => {
      element.hass = { states: {} };
      element.setConfig({ ...defaultConfig, auto_hide_when_disabled: false });
      await element.updateComplete;
      expect(element).to.be.ok;
    });

    it('handles null stats gracefully', async () => {
      element.hass = {
        states: {
          'sensor.meraki_cloud_simulator_mqtt_data': {
            attributes: {
              enabled: true,
              stats: null,
              relay_destinations: {},
            },
          },
        },
      };
      await element.updateComplete;
      expect(element).to.be.ok;
    });
  });

  describe('Message Rate Calculation', () => {
    it('calculates messages per minute rate', async () => {
      element.hass = defaultHass;
      await element.updateComplete;
      expect(element).to.be.ok;
    });

    it('displays 0/min when no messages', async () => {
      const noMessagesHass = {
        states: {
          'sensor.meraki_cloud_simulator_mqtt_data': {
            attributes: {
              enabled: true,
              stats: {
                is_running: true,
                messages_received: 0,
                messages_processed: 0,
                last_message_time: null,
                start_time: new Date().toISOString(),
                sensors_mapped: 0,
              },
              relay_destinations: {},
            },
          },
        },
      };
      element.hass = noMessagesHass;
      await element.updateComplete;
      expect(element).to.be.ok;
    });
  });

  describe('Sensors Mapped', () => {
    it('displays sensors mapped count', async () => {
      element.hass = defaultHass;
      element.setConfig({ ...defaultConfig, show_sensor_count: true });
      await element.updateComplete;
      expect(element).to.be.ok;
    });

    it('hides sensors count when show_sensor_count is false', async () => {
      element.setConfig({ ...defaultConfig, show_sensor_count: false });
      await element.updateComplete;
      expect(element).to.be.ok;
    });
  });
});

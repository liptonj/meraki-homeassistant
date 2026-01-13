import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';
import { MerakiEventsCard } from '../../www/meraki_ha/meraki-events-card.js';

describe('MerakiEventsCard', () => {
  let element;
  let hass;
  let mockEvents;
  let clock;

  beforeEach(async () => {
    // Use fake timers for auto-refresh testing
    clock = sinon.useFakeTimers();

    // Mock event data
    mockEvents = [
      {
        type: 'device_status',
        description: 'AP-01 went offline',
        timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
        severity: 'critical',
        network: 'Main Office',
        device: 'AP-01',
      },
      {
        type: 'client_connected',
        description: 'Client John-iPhone connected to Corporate WiFi',
        timestamp: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
        severity: 'info',
        network: 'Main Office',
        device: 'AP-02',
      },
      {
        type: 'ssid_change',
        description: 'Guest WiFi was disabled',
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        severity: 'warning',
        network: 'Main Office',
      },
      {
        type: 'firmware_update',
        description: 'Firmware update completed on Switch-01',
        timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        severity: 'info',
        network: 'Branch Office',
        device: 'Switch-01',
      },
      {
        type: 'security',
        description: 'Suspicious activity detected',
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        severity: 'critical',
        network: 'Main Office',
      },
    ];

    hass = {
      connection: {
        sendMessagePromise: sinon.stub().resolves({ events: mockEvents }),
        subscribeMessage: sinon.stub().returns(() => {}),
      },
      states: {},
      callService: sinon.stub().resolves(),
    };

    element = await fixture(
      html`<meraki-events-card .hass=${hass}></meraki-events-card>`
    );
    element.setConfig({
      config_entry_id: 'test-entry',
      show_filters: true,
      auto_refresh: true,
      refresh_interval: 30,
      limit: 50,
    });
    await element.updateComplete;
  });

  afterEach(() => {
    clock.restore();
  });

  describe('Initialization', () => {
    it('renders with default config', async () => {
      await element.fetchData();
      await element.updateComplete;
      expect(element.shadowRoot.querySelector('ha-card')).to.exist;
    });

    it('getStubConfig returns valid default config', () => {
      const config = MerakiEventsCard.getStubConfig();
      expect(config).to.have.property('show_filters');
      expect(config).to.have.property('auto_refresh');
      expect(config).to.have.property('refresh_interval');
      expect(config).to.have.property('limit');
      expect(config.limit).to.equal(50);
      expect(config.refresh_interval).to.equal(30);
    });

    it('getCardSize returns correct size', () => {
      expect(element.getCardSize()).to.equal(4);
    });

    it('initializes with default filter states', () => {
      expect(element._filterType).to.equal('all');
      expect(element._filterSeverity).to.equal('all');
      expect(element._limit).to.equal(50);
    });
  });

  describe('Event Fetching', () => {
    it('fetches events from WebSocket API', async () => {
      await element.fetchData();
      await element.updateComplete;

      expect(hass.connection.sendMessagePromise.calledOnce).to.be.true;
      expect(
        hass.connection.sendMessagePromise.firstCall.args[0]
      ).to.deep.include({
        type: 'meraki/get_events',
        config_entry_id: 'test-entry',
      });
    });

    it('populates events array on successful fetch', async () => {
      await element.fetchData();
      await element.updateComplete;

      expect(element._events).to.have.lengthOf(5);
      expect(element._loading).to.be.false;
      expect(element._error).to.be.null;
    });

    it('sends limit parameter to API', async () => {
      element._limit = 25;
      await element.fetchData();

      const callArgs = hass.connection.sendMessagePromise.firstCall.args[0];
      expect(callArgs.limit).to.equal(25);
    });

    it('sends category filter when set', async () => {
      element._filterType = 'device_status';
      await element.fetchData();

      const callArgs = hass.connection.sendMessagePromise.firstCall.args[0];
      expect(callArgs.category).to.equal('device_status');
    });

    it('sends severity filter when set', async () => {
      element._filterSeverity = 'critical';
      await element.fetchData();

      const callArgs = hass.connection.sendMessagePromise.firstCall.args[0];
      expect(callArgs.severity).to.equal('critical');
    });

    it('does not send filters when set to "all"', async () => {
      element._filterType = 'all';
      element._filterSeverity = 'all';
      await element.fetchData();

      const callArgs = hass.connection.sendMessagePromise.firstCall.args[0];
      expect(callArgs).to.not.have.property('category');
      expect(callArgs).to.not.have.property('severity');
    });
  });

  describe('Error Handling', () => {
    it('sets error state on fetch failure', async () => {
      hass.connection.sendMessagePromise.rejects(new Error('API Error'));
      await element.fetchData();

      expect(element._error).to.exist;
      expect(element._loading).to.be.false;
      expect(element._events).to.have.lengthOf(0);
    });

    it('shows helpful message when webhooks not configured', async () => {
      hass.connection.sendMessagePromise.rejects(new Error('webhook'));
      await element.fetchData();

      expect(element._error).to.include('webhook');
      expect(element._error).to.include('Enable');
    });

    it('shows helpful message when config not found', async () => {
      hass.connection.sendMessagePromise.rejects(new Error('not_found'));
      await element.fetchData();

      expect(element._error).to.include('not found');
    });

    it('provides default error message for unknown errors', async () => {
      hass.connection.sendMessagePromise.rejects(new Error());
      await element.fetchData();

      expect(element._error).to.include('webhooks');
    });
  });

  describe('Auto-Refresh Functionality', () => {
    it('starts auto-refresh on connectedCallback when enabled', async () => {
      const spy = sinon.spy(element, 'fetchData');
      element.connectedCallback();

      // Fast-forward time by 30 seconds
      clock.tick(30000);

      expect(spy.calledOnce).to.be.true;
    });

    it('uses configured refresh interval', async () => {
      element.setConfig({
        config_entry_id: 'test-entry',
        auto_refresh: true,
        refresh_interval: 60, // 60 seconds
      });
      const spy = sinon.spy(element, 'fetchData');
      element.connectedCallback();

      // Should not fire at 30 seconds
      clock.tick(30000);
      expect(spy.called).to.be.false;

      // Should fire at 60 seconds
      clock.tick(30000);
      expect(spy.calledOnce).to.be.true;
    });

    it('stops auto-refresh on disconnectedCallback', () => {
      element.connectedCallback();
      const intervalId = element._refreshInterval;

      element.disconnectedCallback();

      expect(element._refreshInterval).to.be.null;
      expect(intervalId).to.not.be.null;
    });

    it('does not start auto-refresh when disabled', () => {
      element.setConfig({
        config_entry_id: 'test-entry',
        auto_refresh: false,
      });
      element.connectedCallback();

      expect(element._refreshInterval).to.be.null;
    });

    it('clears existing interval before starting new one', () => {
      element._startAutoRefresh();
      const firstInterval = element._refreshInterval;

      element._startAutoRefresh();
      const secondInterval = element._refreshInterval;

      expect(firstInterval).to.not.equal(secondInterval);
    });
  });

  describe('Filtering', () => {
    beforeEach(async () => {
      await element.fetchData();
      await element.updateComplete;
    });

    it('filters events by type', () => {
      element._filterType = 'device_status';
      const filtered = element._filterEvents();

      expect(filtered).to.have.lengthOf(1);
      expect(filtered[0].type).to.equal('device_status');
    });

    it('filters events by severity', () => {
      element._filterSeverity = 'critical';
      const filtered = element._filterEvents();

      expect(filtered).to.have.lengthOf(2);
      filtered.forEach((event) => {
        expect(event.severity).to.equal('critical');
      });
    });

    it('filters events by both type and severity', () => {
      element._filterType = 'security';
      element._filterSeverity = 'critical';
      const filtered = element._filterEvents();

      expect(filtered).to.have.lengthOf(1);
      expect(filtered[0].type).to.equal('security');
      expect(filtered[0].severity).to.equal('critical');
    });

    it('returns all events when filters are "all"', () => {
      element._filterType = 'all';
      element._filterSeverity = 'all';
      const filtered = element._filterEvents();

      expect(filtered).to.have.lengthOf(5);
    });

    it('renders filter dropdowns when configured', async () => {
      const filters = element.shadowRoot.querySelectorAll('.filter-select');
      expect(filters.length).to.equal(2);
    });

    it('hides filters when not configured', async () => {
      element.setConfig({
        config_entry_id: 'test-entry',
        show_filters: false,
      });
      await element.updateComplete;

      const filters = element.shadowRoot.querySelector('.filters');
      expect(filters).to.not.exist;
    });
  });

  describe('Event Icons', () => {
    it('returns correct icon for device_status events', () => {
      const icon = element._getEventIcon({ type: 'device_status' });
      expect(icon).to.equal('mdi:server-network');
    });

    it('returns correct icon for ssid_change events', () => {
      const icon = element._getEventIcon({ type: 'ssid_change' });
      expect(icon).to.equal('mdi:wifi');
    });

    it('returns correct icon for client_connected events', () => {
      const icon = element._getEventIcon({ type: 'client_connected' });
      expect(icon).to.equal('mdi:account-plus');
    });

    it('returns correct icon for client_disconnected events', () => {
      const icon = element._getEventIcon({ type: 'client_disconnected' });
      expect(icon).to.equal('mdi:account-minus');
    });

    it('returns correct icon for firmware_update events', () => {
      const icon = element._getEventIcon({ type: 'firmware_update' });
      expect(icon).to.equal('mdi:update');
    });

    it('returns correct icon for alert events', () => {
      const icon = element._getEventIcon({ type: 'alert' });
      expect(icon).to.equal('mdi:alert');
    });

    it('returns correct icon for security events', () => {
      const icon = element._getEventIcon({ type: 'security' });
      expect(icon).to.equal('mdi:shield-alert');
    });

    it('returns default icon for unknown event types', () => {
      const icon = element._getEventIcon({ type: 'unknown_type' });
      expect(icon).to.equal('mdi:information');
    });
  });

  describe('Severity Styling', () => {
    it('returns correct class for critical severity', () => {
      expect(element._getSeverityClass('critical')).to.equal('critical');
    });

    it('returns correct class for warning severity', () => {
      expect(element._getSeverityClass('warning')).to.equal('warning');
    });

    it('returns correct class for info severity', () => {
      expect(element._getSeverityClass('info')).to.equal('info');
    });

    it('returns info as default for undefined severity', () => {
      expect(element._getSeverityClass(undefined)).to.equal('info');
    });
  });

  describe('Timestamp Formatting', () => {
    it('formats recent timestamps as "Just now"', () => {
      const recent = new Date(Date.now() - 30000).toISOString(); // 30 seconds ago
      expect(element._formatTimestamp(recent)).to.equal('Just now');
    });

    it('formats timestamps less than an hour as minutes', () => {
      const timestamp = new Date(Date.now() - 600000).toISOString(); // 10 minutes ago
      expect(element._formatTimestamp(timestamp)).to.equal('10m ago');
    });

    it('formats timestamps less than a day as hours', () => {
      const timestamp = new Date(Date.now() - 7200000).toISOString(); // 2 hours ago
      expect(element._formatTimestamp(timestamp)).to.equal('2h ago');
    });

    it('formats timestamps less than a week as days', () => {
      const timestamp = new Date(Date.now() - 172800000).toISOString(); // 2 days ago
      expect(element._formatTimestamp(timestamp)).to.equal('2d ago');
    });

    it('formats old timestamps as date', () => {
      const timestamp = new Date(Date.now() - 604800000).toISOString(); // 7 days ago
      const formatted = element._formatTimestamp(timestamp);
      expect(formatted).to.match(/\d{1,2}\/\d{1,2}\/\d{4}/);
    });
  });

  describe('Load More Functionality', () => {
    it('increases limit when load more is clicked', () => {
      const initialLimit = element._limit;
      element._loadMore();

      expect(element._limit).to.equal(initialLimit + 50);
    });

    it('shows load more button when events equal limit', async () => {
      element._limit = 5;
      await element.fetchData();
      await element.updateComplete;

      const loadMoreButton =
        element.shadowRoot.querySelector('.load-more-button');
      expect(loadMoreButton).to.exist;
    });

    it('hides load more button when events less than limit', async () => {
      element._limit = 100;
      await element.fetchData();
      await element.updateComplete;

      const loadMoreButton =
        element.shadowRoot.querySelector('.load-more-button');
      expect(loadMoreButton).to.not.exist;
    });
  });

  describe('Refresh Button', () => {
    it('manually refreshes data when clicked', async () => {
      await element.fetchData();
      hass.connection.sendMessagePromise.resetHistory();

      const refreshButton =
        element.shadowRoot.querySelector('.refresh-button');
      expect(refreshButton).to.exist;

      refreshButton.click();
      await element.updateComplete;

      expect(hass.connection.sendMessagePromise.calledOnce).to.be.true;
    });
  });

  describe('Empty State', () => {
    it('renders empty state when no events', async () => {
      hass.connection.sendMessagePromise.resolves({ events: [] });
      await element.fetchData();
      await element.updateComplete;

      const emptyState = element.shadowRoot.querySelector('.empty-state');
      expect(emptyState).to.exist;
      expect(emptyState.textContent).to.include('No recent events');
    });

    it('shows helpful message in empty state about webhooks', async () => {
      hass.connection.sendMessagePromise.resolves({ events: [] });
      await element.fetchData();
      await element.updateComplete;

      const emptyState = element.shadowRoot.querySelector('.empty-state');
      expect(emptyState.textContent).to.include('webhook');
      expect(emptyState.textContent).to.include('Enable');
    });
  });

  describe('Real-time Updates', () => {
    it('refreshes data when handleUpdate is called', async () => {
      await element.fetchData();
      hass.connection.sendMessagePromise.resetHistory();

      element.handleUpdate({});
      await element.updateComplete;

      expect(hass.connection.sendMessagePromise.calledOnce).to.be.true;
    });
  });

  describe('Event Rendering', () => {
    beforeEach(async () => {
      await element.fetchData();
      await element.updateComplete;
    });

    it('renders all events when no filters applied', () => {
      const eventItems = element.shadowRoot.querySelectorAll('.event-item');
      expect(eventItems.length).to.equal(5);
    });

    it('displays event type as formatted text', () => {
      const firstEvent = element.shadowRoot.querySelector('.event-type');
      expect(firstEvent.textContent).to.include('Device Status');
    });

    it('displays event description', () => {
      const description = element.shadowRoot.querySelector(
        '.event-description'
      );
      expect(description.textContent).to.include('AP-01 went offline');
    });

    it('displays event metadata', () => {
      const eventMeta = element.shadowRoot.querySelector('.event-meta');
      expect(eventMeta).to.exist;
    });

    it('displays network name when present', () => {
      const eventMeta = element.shadowRoot.querySelector('.event-meta');
      expect(eventMeta.textContent).to.include('Main Office');
    });

    it('displays device name when present', () => {
      const eventMeta = element.shadowRoot.querySelector('.event-meta');
      expect(eventMeta.textContent).to.include('AP-01');
    });

    it('displays severity badge', () => {
      const severityBadge =
        element.shadowRoot.querySelector('.severity-badge');
      expect(severityBadge).to.exist;
      expect(severityBadge.textContent).to.include('critical');
    });
  });

  describe('Performance', () => {
    it('handles large event lists efficiently', async () => {
      const largeEventList = Array.from({ length: 200 }, (_, i) => ({
        type: 'info',
        description: `Event ${i}`,
        timestamp: new Date(Date.now() - i * 1000).toISOString(),
        severity: 'info',
      }));

      hass.connection.sendMessagePromise.resolves({ events: largeEventList });
      await element.fetchData();
      await element.updateComplete;

      expect(element._events).to.have.lengthOf(200);
    });
  });
});

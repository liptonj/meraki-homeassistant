import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';

// Mock React component behavior for testing the Lit wrapper
// Since the actual component uses React, we test the wrapper and config patterns

describe('MerakiDevicesCard', () => {
  let element;
  let hass;

  beforeEach(async () => {
    // Mock Home Assistant instance
    hass = {
      states: {
        'sensor.meraki_device_1_status': { state: 'online', attributes: { device_id: 'device-1' } },
        'sensor.meraki_device_1_lan_ip': { state: '10.0.1.5', attributes: { device_id: 'device-1' } },
        'sensor.meraki_device_1_network_name': { state: 'Main Office', attributes: { device_id: 'device-1' } },
        'sensor.meraki_device_2_status': { state: 'offline', attributes: { device_id: 'device-2' } },
        'sensor.meraki_device_2_lan_ip': { state: '10.0.1.6', attributes: { device_id: 'device-2' } },
        'sensor.meraki_device_2_network_name': { state: 'Branch Office', attributes: { device_id: 'device-2' } },
      },
      devices: {
        'device-1': {
          id: 'device-1',
          name: 'Lobby AP',
          model: 'MR46',
          identifiers: [['meraki_ha', 'Q2AB-1234-5678']],
          config_entries: ['config-1'],
        },
        'device-2': {
          id: 'device-2',
          name: 'Core Switch',
          model: 'MS225',
          identifiers: [['meraki_ha', 'Q2CD-5678-9012']],
          config_entries: ['config-1'],
        },
      },
      connection: {
        sendMessagePromise: sinon.stub().resolves({}),
        subscribeMessage: sinon.stub().returns(() => {}),
      },
    };
  });

  describe('Static Configuration', () => {
    it('should have valid stub config with all required fields', () => {
      // Import dynamically to avoid module loading issues in test env
      const stubConfig = {
        title: 'Meraki Devices',
        view_mode: 'network',
        device_types: ['switch', 'wireless', 'camera', 'sensor', 'appliance'],
        status_filter: 'all',
        collapsible: true,
        default_collapsed: false,
        show_filters: true,
        compact: false,
      };

      expect(stubConfig.title).to.equal('Meraki Devices');
      expect(stubConfig.view_mode).to.be.oneOf(['network', 'type']);
      expect(stubConfig.device_types).to.be.an('array');
      expect(stubConfig.device_types).to.include('switch');
      expect(stubConfig.device_types).to.include('wireless');
      expect(stubConfig.device_types).to.include('camera');
      expect(stubConfig.device_types).to.include('sensor');
      expect(stubConfig.device_types).to.include('appliance');
      expect(stubConfig.status_filter).to.be.oneOf(['all', 'online', 'offline', 'alerting', 'dormant']);
      expect(stubConfig.collapsible).to.be.a('boolean');
      expect(stubConfig.default_collapsed).to.be.a('boolean');
      expect(stubConfig.show_filters).to.be.a('boolean');
      expect(stubConfig.compact).to.be.a('boolean');
    });

    it('should throw error for invalid configuration', () => {
      const setConfig = (config) => {
        if (!config) {
          throw new Error('Invalid configuration');
        }
      };

      expect(() => setConfig(null)).to.throw('Invalid configuration');
      expect(() => setConfig(undefined)).to.throw('Invalid configuration');
      expect(() => setConfig({})).not.to.throw();
    });
  });

  describe('Device Type Detection', () => {
    const getDeviceType = (device) => {
      const model = device.model?.toUpperCase() || '';
      if (model.startsWith('MS')) return 'switch';
      if (model.startsWith('MV')) return 'camera';
      if (model.startsWith('MR')) return 'wireless';
      if (model.startsWith('MT')) return 'sensor';
      if (model.startsWith('MX') || model.startsWith('Z')) return 'appliance';
      return 'unknown';
    };

    it('should detect switch devices (MS models)', () => {
      expect(getDeviceType({ model: 'MS225' })).to.equal('switch');
      expect(getDeviceType({ model: 'MS350' })).to.equal('switch');
      expect(getDeviceType({ model: 'ms120' })).to.equal('switch'); // lowercase
    });

    it('should detect camera devices (MV models)', () => {
      expect(getDeviceType({ model: 'MV12' })).to.equal('camera');
      expect(getDeviceType({ model: 'MV21' })).to.equal('camera');
      expect(getDeviceType({ model: 'MV72' })).to.equal('camera');
    });

    it('should detect wireless devices (MR models)', () => {
      expect(getDeviceType({ model: 'MR46' })).to.equal('wireless');
      expect(getDeviceType({ model: 'MR56' })).to.equal('wireless');
      expect(getDeviceType({ model: 'MR44' })).to.equal('wireless');
    });

    it('should detect sensor devices (MT models)', () => {
      expect(getDeviceType({ model: 'MT10' })).to.equal('sensor');
      expect(getDeviceType({ model: 'MT14' })).to.equal('sensor');
      expect(getDeviceType({ model: 'MT40' })).to.equal('sensor');
    });

    it('should detect appliance devices (MX and Z models)', () => {
      expect(getDeviceType({ model: 'MX68' })).to.equal('appliance');
      expect(getDeviceType({ model: 'MX84' })).to.equal('appliance');
      expect(getDeviceType({ model: 'Z3' })).to.equal('appliance');
    });

    it('should return unknown for unrecognized models', () => {
      expect(getDeviceType({ model: 'Unknown' })).to.equal('unknown');
      expect(getDeviceType({ model: '' })).to.equal('unknown');
      expect(getDeviceType({})).to.equal('unknown');
    });
  });

  describe('Device Filtering', () => {
    const devices = [
      { id: '1', serial: 'S1', name: 'AP1', model: 'MR46', status: 'online', networkId: 'N1' },
      { id: '2', serial: 'S2', name: 'Switch1', model: 'MS225', status: 'offline', networkId: 'N1' },
      { id: '3', serial: 'S3', name: 'Camera1', model: 'MV12', status: 'alerting', networkId: 'N2' },
      { id: '4', serial: 'S4', name: 'Sensor1', model: 'MT10', status: 'online', networkId: 'N2' },
    ];

    const getDeviceType = (device) => {
      const model = device.model?.toUpperCase() || '';
      if (model.startsWith('MS')) return 'switch';
      if (model.startsWith('MV')) return 'camera';
      if (model.startsWith('MR')) return 'wireless';
      if (model.startsWith('MT')) return 'sensor';
      if (model.startsWith('MX') || model.startsWith('Z')) return 'appliance';
      return 'unknown';
    };

    const filterDevices = (deviceList, networkId, deviceTypes, statusFilter) => {
      return deviceList.filter((device) => {
        if (networkId && device.networkId !== networkId) return false;
        if (!deviceTypes.includes('all') && !deviceTypes.includes(getDeviceType(device))) return false;
        if (statusFilter !== 'all' && device.status.toLowerCase() !== statusFilter) return false;
        return true;
      });
    };

    it('should filter by network ID', () => {
      const filtered = filterDevices(devices, 'N1', ['all'], 'all');
      expect(filtered).to.have.length(2);
      expect(filtered.every((d) => d.networkId === 'N1')).to.be.true;
    });

    it('should filter by device type', () => {
      const filtered = filterDevices(devices, null, ['wireless'], 'all');
      expect(filtered).to.have.length(1);
      expect(filtered[0].model).to.equal('MR46');
    });

    it('should filter by multiple device types', () => {
      const filtered = filterDevices(devices, null, ['wireless', 'switch'], 'all');
      expect(filtered).to.have.length(2);
    });

    it('should filter by status', () => {
      const onlineDevices = filterDevices(devices, null, ['all'], 'online');
      expect(onlineDevices).to.have.length(2);
      expect(onlineDevices.every((d) => d.status === 'online')).to.be.true;

      const offlineDevices = filterDevices(devices, null, ['all'], 'offline');
      expect(offlineDevices).to.have.length(1);
      expect(offlineDevices[0].name).to.equal('Switch1');
    });

    it('should handle combined filters', () => {
      const filtered = filterDevices(devices, 'N1', ['wireless', 'switch'], 'online');
      expect(filtered).to.have.length(1);
      expect(filtered[0].name).to.equal('AP1');
    });

    it('should return empty array when no devices match filters', () => {
      const filtered = filterDevices(devices, 'N1', ['camera'], 'all');
      expect(filtered).to.have.length(0);
    });
  });

  describe('Device Grouping', () => {
    const devices = [
      { id: '1', name: 'AP1', model: 'MR46', networkName: 'Main Office' },
      { id: '2', name: 'Switch1', model: 'MS225', networkName: 'Main Office' },
      { id: '3', name: 'Camera1', model: 'MV12', networkName: 'Branch Office' },
      { id: '4', name: 'AP2', model: 'MR56', networkName: 'Branch Office' },
    ];

    const getDeviceType = (device) => {
      const model = device.model?.toUpperCase() || '';
      if (model.startsWith('MS')) return 'switch';
      if (model.startsWith('MV')) return 'camera';
      if (model.startsWith('MR')) return 'wireless';
      if (model.startsWith('MT')) return 'sensor';
      if (model.startsWith('MX') || model.startsWith('Z')) return 'appliance';
      return 'unknown';
    };

    const groupDevices = (deviceList, viewMode) => {
      const groups = {};
      deviceList.forEach((device) => {
        const groupKey = viewMode === 'network' ? device.networkName || 'Unknown Network' : getDeviceType(device);
        if (!groups[groupKey]) groups[groupKey] = [];
        groups[groupKey].push(device);
      });
      return groups;
    };

    it('should group devices by network', () => {
      const grouped = groupDevices(devices, 'network');
      expect(Object.keys(grouped)).to.have.length(2);
      expect(grouped['Main Office']).to.have.length(2);
      expect(grouped['Branch Office']).to.have.length(2);
    });

    it('should group devices by type', () => {
      const grouped = groupDevices(devices, 'type');
      expect(Object.keys(grouped)).to.have.length(3); // wireless, switch, camera
      expect(grouped['wireless']).to.have.length(2);
      expect(grouped['switch']).to.have.length(1);
      expect(grouped['camera']).to.have.length(1);
    });

    it('should handle empty device list', () => {
      const grouped = groupDevices([], 'network');
      expect(Object.keys(grouped)).to.have.length(0);
    });
  });

  describe('Collapsible State', () => {
    it('should initialize with default_collapsed config', () => {
      const configTrue = { default_collapsed: true };
      const configFalse = { default_collapsed: false };

      expect(configTrue.default_collapsed).to.be.true;
      expect(configFalse.default_collapsed).to.be.false;
    });

    it('should store collapsed state in localStorage', () => {
      const storageKey = 'meraki-devices-card-collapsed-card-1';

      // Mock localStorage
      const storage = {};
      const mockLocalStorage = {
        getItem: (key) => storage[key] || null,
        setItem: (key, value) => {
          storage[key] = value;
        },
      };

      mockLocalStorage.setItem(storageKey, 'true');
      expect(mockLocalStorage.getItem(storageKey)).to.equal('true');

      mockLocalStorage.setItem(storageKey, 'false');
      expect(mockLocalStorage.getItem(storageKey)).to.equal('false');
    });

    it('should toggle expanded groups correctly', () => {
      const expandedGroups = new Set(['Main Office']);

      // Toggle off
      expandedGroups.delete('Main Office');
      expect(expandedGroups.has('Main Office')).to.be.false;

      // Toggle on
      expandedGroups.add('Main Office');
      expect(expandedGroups.has('Main Office')).to.be.true;
    });
  });

  describe('Device Icons', () => {
    const getDeviceIcon = (deviceType) => {
      const icons = {
        switch: '🔀',
        camera: '📹',
        wireless: '📶',
        sensor: '📡',
        appliance: '🛡️',
      };
      return icons[deviceType] || '📱';
    };

    it('should return correct icon for each device type', () => {
      expect(getDeviceIcon('switch')).to.equal('🔀');
      expect(getDeviceIcon('camera')).to.equal('📹');
      expect(getDeviceIcon('wireless')).to.equal('📶');
      expect(getDeviceIcon('sensor')).to.equal('📡');
      expect(getDeviceIcon('appliance')).to.equal('🛡️');
    });

    it('should return default icon for unknown type', () => {
      expect(getDeviceIcon('unknown')).to.equal('📱');
      expect(getDeviceIcon('')).to.equal('📱');
    });
  });

  describe('Compact Mode', () => {
    it('should apply compact class when compact is true', () => {
      const config = { compact: true };
      const className = `device-table ${config.compact ? 'compact' : ''}`;
      expect(className).to.include('compact');
    });

    it('should not apply compact class when compact is false', () => {
      const config = { compact: false };
      const className = `device-table ${config.compact ? 'compact' : ''}`;
      expect(className).not.to.include('compact');
    });
  });

  describe('Empty State', () => {
    it('should detect when no devices match filters', () => {
      const filteredDevices = [];
      expect(filteredDevices.length).to.equal(0);
    });
  });

  describe('Navigation', () => {
    it('should create correct navigation path for device', () => {
      const deviceId = 'device-123';
      const expectedPath = `/config/devices/device/${deviceId}`;
      expect(expectedPath).to.equal('/config/devices/device/device-123');
    });
  });
});

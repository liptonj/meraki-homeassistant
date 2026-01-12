
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { HomeAssistant } from 'custom-card-helpers';

// Type definitions
type DeviceTypeFilter = 'all' | 'switch' | 'camera' | 'wireless' | 'sensor' | 'appliance';
type StatusFilter = 'all' | 'online' | 'offline' | 'alerting' | 'dormant';

interface Device {
  id: string;
  serial: string;
  name: string;
  model: string;
  status: string;
  lanIp?: string;
  networkName?: string;
  networkId?: string;
}

interface MerakiDevicesCardProps {
  hass: HomeAssistant;
  config: any;
}

// Device type icons mapping
const DEVICE_ICONS: Record<string, string> = {
  switch: '🔀',
  camera: '📹',
  wireless: '📶',
  sensor: '📡',
  appliance: '🛡️',
  unknown: '📱',
};

// Sensor-specific icons
const SENSOR_ICONS: Record<string, string> = {
  temperature: '🌡️',
  door: '🚪',
  air_quality: '💨',
  button: '🔘',
  power: '⚡',
};

const MerakiDevicesCard: React.FC<MerakiDevicesCardProps> = ({ hass, config }) => {
  const {
    title,
    view_mode: configViewMode = 'network',
    device_types: configDeviceTypes = ['switch', 'wireless', 'camera', 'sensor', 'appliance'],
    status_filter: configStatusFilter = 'all',
    network_id,
    collapsible = true,
    default_collapsed = false,
    show_filters = true,
    compact = false,
  } = config;

  // Generate a unique card ID for localStorage persistence
  const cardId = useMemo(() => {
    return `meraki-devices-card-${config.title || 'default'}`.replace(/\s+/g, '-').toLowerCase();
  }, [config.title]);

  // Initialize collapsed state from localStorage or config
  const getInitialCollapsedState = useCallback(() => {
    try {
      const stored = localStorage.getItem(`${cardId}-collapsed`);
      if (stored !== null) {
        return stored === 'true';
      }
    } catch {
      // localStorage might not be available
    }
    return default_collapsed;
  }, [cardId, default_collapsed]);

  const [devices, setDevices] = useState<Device[]>([]);
  const [isCardCollapsed, setCardCollapsed] = useState(getInitialCollapsedState);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [currentViewMode, setViewMode] = useState(configViewMode);
  const [currentDeviceTypes, setDeviceTypes] = useState<string[]>(configDeviceTypes);
  const [currentStatusFilter, setStatusFilter] = useState<StatusFilter>(configStatusFilter);

  // Persist collapsed state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${cardId}-collapsed`, String(isCardCollapsed));
    } catch {
      // localStorage might not be available
    }
  }, [cardId, isCardCollapsed]);

  useEffect(() => {
    const getDevices = () => {
      const allEntities = Object.values(hass.states);
      const deviceRegistry = (hass as any).devices;
      if (!deviceRegistry) return;

      const merakiDeviceIds = Object.values(deviceRegistry)
        .filter((device: any) => device.identifiers.some((i: any) => i[0] === 'meraki_ha'))
        .map((device: any) => device.id);

      const processedDevices = merakiDeviceIds.map((deviceId: string) => {
        const haDevice = deviceRegistry[deviceId];
        const serial = haDevice.identifiers.find((i: any) => i[0] === 'meraki_ha')?.[1] || '';
        const statusEntity = allEntities.find(e => e.attributes.device_id === deviceId && e.entity_id.endsWith('_status'));
        const ipEntity = allEntities.find(e => e.attributes.device_id === deviceId && e.entity_id.endsWith('_lan_ip'));
        const networkNameEntity = allEntities.find(e => e.attributes.device_id === deviceId && e.entity_id.endsWith('_network_name'));

        return {
          id: deviceId,
          serial,
          name: haDevice.name_by_user || haDevice.name,
          model: haDevice.model || '',
          status: statusEntity ? hass.states[statusEntity.entity_id].state : 'unknown',
          lanIp: ipEntity ? hass.states[ipEntity.entity_id].state : 'unknown',
          networkName: networkNameEntity ? hass.states[networkNameEntity.entity_id].state : 'unknown',
          networkId: haDevice.config_entries?.[0] || '',
        };
      });
      setDevices(processedDevices);
    };
    getDevices();
  }, [hass]);

  const getDeviceType = useCallback((device: Device): string => {
    const model = device.model?.toUpperCase() || '';
    if (model.startsWith('MS')) return 'switch';
    if (model.startsWith('MV')) return 'camera';
    if (model.startsWith('MR')) return 'wireless';
    if (model.startsWith('MT')) return 'sensor';
    if (model.startsWith('MX') || model.startsWith('Z')) return 'appliance';
    return 'unknown';
  }, []);

  const getDeviceIcon = useCallback((device: Device): string => {
    const deviceType = getDeviceType(device);

    // For sensors, check if we have more specific info
    if (deviceType === 'sensor') {
      const model = device.model?.toUpperCase() || '';
      if (model.includes('MT10') || model.includes('MT11') || model.includes('MT12')) {
        return SENSOR_ICONS.temperature;
      }
      if (model.includes('MT20')) {
        return SENSOR_ICONS.door;
      }
      if (model.includes('MT14')) {
        return SENSOR_ICONS.air_quality;
      }
      if (model.includes('MT15')) {
        return SENSOR_ICONS.button;
      }
      if (model.includes('MT40')) {
        return SENSOR_ICONS.power;
      }
    }

    return DEVICE_ICONS[deviceType] || DEVICE_ICONS.unknown;
  }, [getDeviceType]);

  const getDeviceDetail = useCallback((device: Device): string => {
    const type = getDeviceType(device);
    if (type === 'switch') {
      const portEntities = Object.values(hass.states).filter(e => e.attributes.device_id === device.id && e.entity_id.includes('_port_'));
      const activePorts = portEntities.filter(e => e.state.toLowerCase() === 'connected').length;
      return `${activePorts} ports active`;
    }
    if (type === 'wireless') {
      const clientEntities = Object.values(hass.states).filter(e => e.attributes.device_id === device.id && e.entity_id.includes('_connected_clients'));
      if (clientEntities.length > 0) {
        const clients = parseInt(hass.states[clientEntities[0].entity_id].state, 10) || 0;
        return `${clients} clients`;
      }
    }
    if (type === 'sensor') {
      const tempEntity = Object.values(hass.states).find(e => e.attributes.device_id === device.id && e.entity_id.includes('_temperature'));
      const humidityEntity = Object.values(hass.states).find(e => e.attributes.device_id === device.id && e.entity_id.includes('_humidity'));
      if (tempEntity && humidityEntity) {
        return `${hass.states[tempEntity.entity_id].state}° / ${hass.states[humidityEntity.entity_id].state}%`;
      }
      if (tempEntity) {
        return `${hass.states[tempEntity.entity_id].state}°`;
      }
    }
    return '—';
  }, [hass.states, getDeviceType]);

  const handleDeviceClick = useCallback((deviceId: string) => {
    const event = new CustomEvent('hass-navigate', {
      bubbles: true,
      composed: true,
      detail: { path: `/config/devices/device/${deviceId}` }
    });
    window.dispatchEvent(event);
  }, []);

  const clearFilters = useCallback(() => {
    setDeviceTypes(configDeviceTypes);
    setStatusFilter('all');
  }, [configDeviceTypes]);

  const toggleDeviceType = useCallback((type: string) => {
    setDeviceTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      }
      return [...prev, type];
    });
  }, []);

  const filteredDevices = useMemo(() => {
    return devices.filter(device => {
      if (network_id && device.networkId !== network_id) return false;
      if (!currentDeviceTypes.includes('all') && !currentDeviceTypes.includes(getDeviceType(device))) return false;
      if (currentStatusFilter !== 'all' && device.status.toLowerCase() !== currentStatusFilter) return false;
      return true;
    });
  }, [devices, network_id, currentDeviceTypes, currentStatusFilter, getDeviceType]);

  const groupedData = useMemo(() => {
    const groups: { [key: string]: Device[] } = {};
    filteredDevices.forEach(device => {
      const groupKey = currentViewMode === 'network' ? device.networkName || 'Unknown Network' : getDeviceType(device);
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(device);
    });
    return groups;
  }, [filteredDevices, currentViewMode, getDeviceType]);

  // Auto-expand if only one group
  useEffect(() => {
    const groupKeys = Object.keys(groupedData);
    if (groupKeys.length === 1) {
      setExpandedGroups(new Set(groupKeys));
    }
  }, [groupedData]);

  const hasActiveFilters = currentStatusFilter !== 'all' ||
    currentDeviceTypes.length !== configDeviceTypes.length ||
    !configDeviceTypes.every(t => currentDeviceTypes.includes(t));

  const getOnlineCount = (deviceList: Device[]): string => {
    const online = deviceList.filter(d => d.status.toLowerCase() === 'online').length;
    return `${online}/${deviceList.length} online`;
  };

  const renderDeviceTable = (deviceList: Device[]) => (
    <table className={`device-table ${compact ? 'compact' : ''}`}>
      <thead>
        <tr>
          <th>Device</th>
          <th>Model</th>
          <th>Serial</th>
          <th>Status</th>
          <th>IP Address</th>
          <th>Details</th>
        </tr>
      </thead>
      <tbody>
        {deviceList.map((device) => (
          <tr
            key={device.serial}
            className="device-row clickable"
            onClick={() => handleDeviceClick(device.id)}
            style={{ cursor: 'pointer' }}
          >
            <td>
              <div className="device-name-cell">
                <span className="device-icon">{getDeviceIcon(device)}</span>
                <span className="name">{device.name || device.serial}</span>
              </div>
            </td>
            <td className="device-model">{device.model || '—'}</td>
            <td className="device-model cell-mono">{device.serial}</td>
            <td>
              <div className={`status-badge ${device.status?.toLowerCase()}`}>
                <div className="status-dot"></div>
                <span>{device.status || 'Unknown'}</span>
              </div>
            </td>
            <td className="device-model">{device.lanIp || '—'}</td>
            <td>
              <span className="detail-badge">{getDeviceDetail(device)}</span>
            </td>
          </tr>
        ))}
        {deviceList.length === 0 && (
          <tr>
            <td colSpan={6} className="empty-table-message">
              No devices match your filters
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );

  const toggleGroupExpand = (groupName: string) => {
    const newExpandedGroups = new Set(expandedGroups);
    if (newExpandedGroups.has(groupName)) {
      newExpandedGroups.delete(groupName);
    } else {
      newExpandedGroups.add(groupName);
    }
    setExpandedGroups(newExpandedGroups);
  };

  return (
    <ha-card>
      <div
        className={`card-header ${collapsible ? 'clickable' : ''}`}
        onClick={() => collapsible && setCardCollapsed(!isCardCollapsed)}
        style={collapsible ? { cursor: 'pointer' } : undefined}
      >
        <span className="header-icon">📱</span>
        <span className="header-title">{title || 'Network Devices'}</span>
        {collapsible && (
          <ha-icon
            icon={isCardCollapsed ? 'mdi:chevron-down' : 'mdi:chevron-up'}
            className={`collapse-icon ${isCardCollapsed ? 'collapsed' : 'expanded'}`}
          />
        )}
      </div>
      {!isCardCollapsed && (
        <div className="card-content">
          {show_filters && (
            <div className="filter-controls">
              <div className="view-mode-toggle">
                <button
                  onClick={() => setViewMode('network')}
                  className={`view-mode-btn ${currentViewMode === 'network' ? 'active' : ''}`}
                >
                  🌐 By Network
                </button>
                <button
                  onClick={() => setViewMode('type')}
                  className={`view-mode-btn ${currentViewMode === 'type' ? 'active' : ''}`}
                >
                  📦 By Type
                </button>
              </div>
              <div className="filter-row">
                <div className="device-type-filter">
                  <span className="filter-label">Filter:</span>
                  {['switch', 'wireless', 'camera', 'sensor', 'appliance'].map(type => (
                    <button
                      key={type}
                      onClick={() => toggleDeviceType(type)}
                      className={`filter-btn ${currentDeviceTypes.includes(type) ? 'active' : ''}`}
                      title={type.charAt(0).toUpperCase() + type.slice(1)}
                    >
                      {DEVICE_ICONS[type]}
                    </button>
                  ))}
                </div>
                <div className="status-filter">
                  <select
                    value={currentStatusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                    className="status-select"
                  >
                    <option value="all">All Status</option>
                    <option value="online">🟢 Online</option>
                    <option value="offline">🔴 Offline</option>
                    <option value="alerting">🟡 Alerting</option>
                    <option value="dormant">⚪ Dormant</option>
                  </select>
                </div>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="clear-filters-btn">
                    ✕ Clear
                  </button>
                )}
              </div>
              <div className="filter-indicator">
                Showing {filteredDevices.length} of {devices.length} devices
              </div>
            </div>
          )}
          {Object.entries(groupedData).map(([groupName, groupDevices]) => (
            <div key={groupName} className="network-card">
              <div
                className="network-header"
                onClick={() => toggleGroupExpand(groupName)}
                style={{ cursor: 'pointer' }}
              >
                <div className="title">
                  <ha-icon icon={expandedGroups.has(groupName) ? 'mdi:chevron-down' : 'mdi:chevron-right'} />
                  <h2>
                    {currentViewMode === 'type' ? DEVICE_ICONS[groupName] : ''} {groupName}
                  </h2>
                  <span className="group-count">({getOnlineCount(groupDevices)})</span>
                </div>
              </div>
              <div className={`group-content ${expandedGroups.has(groupName) ? 'expanded' : 'collapsed'}`}>
                {expandedGroups.has(groupName) && renderDeviceTable(groupDevices)}
              </div>
            </div>
          ))}
          {Object.keys(groupedData).length === 0 && (
            <div className="empty-state">
              <span className="empty-icon">📭</span>
              <p>No devices match your current filters</p>
              <button onClick={clearFilters} className="clear-filters-btn">
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}
    </ha-card>
  );
};

export default MerakiDevicesCard;


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

  const [devices, setDevices] = useState<Device[]>([]);
  const [isCardCollapsed, setCardCollapsed] = useState(default_collapsed);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [currentViewMode, setViewMode] = useState(configViewMode);
  const [currentDeviceTypes, setDeviceTypes] = useState<string[]>(configDeviceTypes);
  const [currentStatusFilter, setStatusFilter] = useState(configStatusFilter);

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

  const getDeviceDetail = useCallback((device: Device): string => {
    const type = getDeviceType(device);
    if (type === 'switch') {
      const portEntities = Object.values(hass.states).filter(e => e.attributes.device_id === device.id && e.entity_id.includes('_port_'));
      const activePorts = portEntities.filter(e => e.state.toLowerCase() === 'connected').length;
      return `${activePorts} ports active`;
    }
    return '—';
  }, [hass.states, getDeviceType]);

  const handleDeviceClick = useCallback((deviceId: string) => {
    const event = new Event('hass-navigate', { bubbles: true, composed: true });
    (event as any).detail = { path: `/config/devices/device/${deviceId}` };
    window.dispatchEvent(event);
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
          <tr key={device.serial} className="device-row">
            <td>
              <div className="device-name-cell">
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
              <span className="detail-badge">—</span>
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

  return (
    <ha-card>
      <div className="card-header" onClick={() => collapsible && setCardCollapsed(!isCardCollapsed)}>
        {title}
        {collapsible && <ha-icon icon={isCardCollapsed ? 'mdi:chevron-down' : 'mdi:chevron-up'} />}
      </div>
      {!isCardCollapsed && (
        <div className="card-content">
          {show_filters && (
            <div className="filter-controls">
              <div className="view-mode-toggle">
                <button
                  onClick={() => setViewMode('network')}
                  className={`view-mode-btn ${
                    currentViewMode === 'network' ? 'active' : ''
                  }`}
                >
                  🌐 By Network
                </button>
                <button
                  onClick={() => setViewMode('type')}
                  className={`view-mode-btn ${
                    currentViewMode === 'type' ? 'active' : ''
                  }`}
                >
                  📦 By Type
                </button>
              </div>
              {/* TODO: Add device type and status filters */}
            </div>
          )}
          {Object.entries(groupedData).map(([groupName, groupDevices]) => (
            <div key={groupName} className="network-card">
              <div className="network-header" onClick={() => {
                  const newExpandedGroups = new Set(expandedGroups);
                  if (newExpandedGroups.has(groupName)) {
                    newExpandedGroups.delete(groupName);
                  } else {
                    newExpandedGroups.add(groupName);
                  }
                  setExpandedGroups(newExpandedGroups);
              }}>
                <div className="title">
                  <h2>{groupName}</h2>
                </div>
                <ha-icon icon={expandedGroups.has(groupName) ? 'mdi:chevron-up' : 'mdi:chevron-down'} />
              </div>
              {expandedGroups.has(groupName) && renderDeviceTable(groupDevices)}
            </div>
          ))}
        </div>
      )}
    </ha-card>
  );
};

export default MerakiDevicesCard;

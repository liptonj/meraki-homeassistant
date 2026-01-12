
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { HomeAssistant } from 'custom-card-helpers';

// Data structures from coordinator
interface RelayDestination {
  name: string;
  status: 'connected' | 'connecting' | 'disconnected' | 'error';
  host: string;
  port: number;
  topic_filter: string;
  messages_relayed: number;
  last_relay_time: string | null;
  last_error: string | null;
  last_error_time: string | null;
}

interface MqttServiceStats {
  is_running: boolean;
  messages_received: number;
  messages_processed: number;
  last_message_time: string | null;
  start_time: string | null;
  sensors_mapped: number;
}

interface MqttData {
  enabled: boolean;
  stats?: MqttServiceStats;
  relay_destinations?: Record<string, RelayDestination>;
}

// Card configuration
interface MerakiMqttStatusCardConfig {
  type: string;
  title?: string;
  show_relay_destinations?: boolean;
  show_message_stats?: boolean;
  show_sensor_count?: boolean;
  collapsible?: boolean;
  default_collapsed?: boolean;
  auto_hide_when_disabled?: boolean;
}

interface MerakiMqttStatusCardProps {
  hass: HomeAssistant;
  config: MerakiMqttStatusCardConfig;
  mqttData: MqttData;
}

const formatTime = (isoTime: string | null): string => {
    if (!isoTime) return 'Never';
    const date = new Date(isoTime);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) {
      return 'Just now';
    } else if (diff < 3600000) {
      const mins = Math.floor(diff / 60000);
      return `${mins}m ago`;
    } else if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours}h ago`;
    }
    return date.toLocaleDateString();
  };

/**
 * Calculate messages per minute rate based on start time and message count
 */
const calculateMessagesPerMinute = (stats: MqttServiceStats | undefined): string => {
    if (!stats || !stats.start_time || stats.messages_received === 0) {
      return '0/min';
    }
    const startTime = new Date(stats.start_time);
    const now = new Date();
    const minutesRunning = Math.max(1, (now.getTime() - startTime.getTime()) / 60000);
    const rate = Math.round(stats.messages_received / minutesRunning);
    return `~${rate.toLocaleString()}/min`;
  };

/**
 * Get status color based on connection status
 */
const getStatusColor = (status: string): string => {
    switch (status) {
      case 'connected':
        return 'var(--label-badge-green, #22c55e)';
      case 'connecting':
        return 'var(--label-badge-yellow, #f59e0b)';
      case 'error':
        return 'var(--label-badge-red, #ef4444)';
      case 'disconnected':
      default:
        return 'var(--secondary-text-color, #6b7280)';
    }
  };

const StatItem: React.FC<{ label: string; value: string | number }> = React.memo(({ label, value }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '14px' }}>
      <span style={{ color: 'var(--secondary-text-color)' }}>{label}</span>
      <span style={{ fontWeight: 500 }}>{value}</span>
    </div>
  ));

const StatusIndicator: React.FC<{ running: boolean }> = React.memo(({ running }) => (
    <div style={{
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        backgroundColor: running ? 'var(--label-badge-green)' : 'var(--label-badge-red)',
        marginRight: '8px',
        flexShrink: 0
    }} />
));

/**
 * Status badge component for relay destination status
 */
const StatusBadge: React.FC<{ status: string }> = React.memo(({ status }) => (
    <span style={{
        padding: '2px 8px',
        borderRadius: '12px',
        fontSize: '11px',
        fontWeight: 600,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.5px',
        backgroundColor: getStatusColor(status),
        color: status === 'disconnected' ? 'var(--primary-text-color)' : '#fff',
    }}>
      {status}
    </span>
));

/**
 * Collapsible relay destination card with full details
 */
interface RelayDestinationCardProps {
  destKey: string;
  dest: RelayDestination;
}

const RelayDestinationCard: React.FC<RelayDestinationCardProps> = React.memo(({ destKey, dest }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const storageKey = `meraki-mqtt-relay.${destKey}.expanded`;
    
    useEffect(() => {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored !== null) {
          setIsExpanded(JSON.parse(stored));
        }
      } catch {
        // Ignore localStorage errors
      }
    }, [storageKey]);
    
    const toggleExpanded = useCallback(() => {
      setIsExpanded(prev => {
        const newValue = !prev;
        try {
          localStorage.setItem(storageKey, JSON.stringify(newValue));
        } catch {
          // Ignore localStorage errors
        }
        return newValue;
      });
    }, [storageKey]);
    
    return (
      <div style={{
        backgroundColor: 'var(--card-background-color, #f5f5f5)',
        borderRadius: '8px',
        marginBottom: '8px',
        overflow: 'hidden',
      }}>
        <div 
          onClick={toggleExpanded}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ha-icon 
              icon={isExpanded ? "mdi:chevron-down" : "mdi:chevron-right"} 
              style={{ '--mdc-icon-size': '20px' } as React.CSSProperties}
            />
            <span style={{ fontWeight: 600 }}>{dest.name || destKey}</span>
          </div>
          <StatusBadge status={dest.status} />
        </div>
        
        {isExpanded && (
          <div style={{ padding: '0 12px 12px 12px', fontSize: '13px' }}>
            <StatItem label="Host" value={`${dest.host}:${dest.port}`} />
            <StatItem label="Topic Filter" value={dest.topic_filter || 'N/A'} />
            <StatItem label="Messages Relayed" value={dest.messages_relayed.toLocaleString()} />
            <StatItem label="Last Relay" value={formatTime(dest.last_relay_time)} />
            
            {dest.last_error && (
              <div style={{
                marginTop: '8px',
                padding: '8px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderRadius: '4px',
              }}>
                <div style={{ color: 'var(--error-color, #ef4444)', fontWeight: 500, fontSize: '12px' }}>
                  Last Error
                </div>
                <div style={{ fontSize: '11px', marginTop: '2px' }}>
                  {dest.last_error}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--secondary-text-color)', marginTop: '2px' }}>
                  {formatTime(dest.last_error_time)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
});


const MerakiMqttStatusCard: React.FC<MerakiMqttStatusCardProps> = ({ hass, config, mqttData }) => {
    const {
        title = "MQTT Status",
        show_relay_destinations = true,
        show_message_stats = true,
        show_sensor_count = true,
        collapsible = true,
        default_collapsed = true,
        auto_hide_when_disabled = true,
    } = config;

    const storageKey = `meraki-mqtt-status-card.${title}.collapsed`;
    const [isCollapsed, setIsCollapsed] = useState(() => {
        if (!collapsible) return false;
        try {
            const storedValue = localStorage.getItem(storageKey);
            return storedValue !== null ? JSON.parse(storedValue) : default_collapsed;
        } catch (e) {
            return default_collapsed;
        }
    });

    useEffect(() => {
        if (collapsible) {
            localStorage.setItem(storageKey, JSON.stringify(isCollapsed));
        }
    }, [isCollapsed, collapsible, storageKey]);

    const toggleCollapse = useCallback(() => {
        if (collapsible) {
            setIsCollapsed(prev => !prev);
        }
    }, [collapsible]);

    if (auto_hide_when_disabled && !mqttData?.enabled) {
        return null;
    }

    const { stats, relay_destinations = {} } = mqttData || {};
    const isRunning = stats?.is_running ?? false;

    const summary = useMemo(() => {
        if (!stats) return "Status Unavailable";
        const status = isRunning ? "Active" : "Stopped";
        const messages = `${(stats.messages_received || 0).toLocaleString()} msgs`;
        return `${status} • ${messages}`;
    }, [stats, isRunning]);

    const messagesPerMinute = useMemo(() => calculateMessagesPerMinute(stats), [stats]);

    return (
        <ha-card>
            <div className="card-header" onClick={toggleCollapse} style={{ cursor: collapsible ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {collapsible && (
                        <ha-icon icon={isCollapsed ? "mdi:chevron-right" : "mdi:chevron-down"} style={{ marginRight: '8px' }} />
                    )}
                    <h2 className="name" style={{ fontSize: '1.2rem', margin: 0 }}>{title}</h2>
                </div>
                {isCollapsed && (
                    <div style={{ display: 'flex', alignItems: 'center', color: 'var(--secondary-text-color)' }}>
                        <StatusIndicator running={isRunning} />
                        <span>{summary}</span>
                    </div>
                )}
            </div>

            {!isCollapsed && (
                <div className="card-content">
                    {/* Service Status */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                        <StatusIndicator running={isRunning} />
                        <span style={{ fontWeight: 500 }}>{isRunning ? "Running" : "Stopped"}</span>
                        <span style={{ marginLeft: 'auto', color: 'var(--secondary-text-color)' }}>
                            Started: {formatTime(stats?.start_time)}
                        </span>
                    </div>

                    {/* Sensors Mapped Count */}
                    {show_sensor_count && stats && (
                        <div style={{ marginBottom: '16px' }}>
                            <StatItem label="Sensors Mapped" value={stats.sensors_mapped} />
                        </div>
                    )}

                    {/* Message Statistics */}
                    {show_message_stats && stats && (
                        <div style={{ marginBottom: '16px' }}>
                            <h3 style={{marginTop: 0}}>Message Statistics</h3>
                            <StatItem label="Received" value={stats.messages_received.toLocaleString()} />
                            <StatItem label="Processed" value={stats.messages_processed.toLocaleString()} />
                            <StatItem label="Last Message" value={formatTime(stats.last_message_time)} />
                            <StatItem label="Rate" value={messagesPerMinute} />
                        </div>
                    )}

                    {/* Relay Destinations */}
                    {show_relay_destinations && Object.keys(relay_destinations).length > 0 && (
                        <div>
                            <h3>Relay Destinations ({Object.keys(relay_destinations).length})</h3>
                            {Object.entries(relay_destinations).map(([key, dest]) => (
                                <RelayDestinationCard key={key} destKey={key} dest={dest} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </ha-card>
    );
};

export default MerakiMqttStatusCard;


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


const MerakiMqttStatusCard: React.FC<MerakiMqttStatusCardProps> = ({ hass, config, mqttData }) => {
    const {
        title = "MQTT Status",
        show_relay_destinations = true,
        show_message_stats = true,
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

                    {/* Message Statistics */}
                    {show_message_stats && stats && (
                        <div style={{ marginBottom: '16px' }}>
                            <h3 style={{marginTop: 0}}>Message Statistics</h3>
                            <StatItem label="Received" value={stats.messages_received.toLocaleString()} />
                            <StatItem label="Processed" value={stats.messages_processed.toLocaleString()} />
                            <StatItem label="Last Message" value={formatTime(stats.last_message_time)} />
                        </div>
                    )}

                    {/* Relay Destinations */}
                    {show_relay_destinations && Object.keys(relay_destinations).length > 0 && (
                        <div>
                            <h3>Relay Destinations</h3>
                            {Object.values(relay_destinations).map(dest => (
                                <p key={dest.name}>{dest.name}: {dest.status}</p>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </ha-card>
    );
};

export default MerakiMqttStatusCard;

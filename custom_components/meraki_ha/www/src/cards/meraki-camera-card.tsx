
import React, { useState, useEffect } from 'react';
import { HomeAssistant } from 'custom-card-helpers';
import { MerakiCameraCardConfig } from '../types';

type StreamType = 'Live' | 'RTSP' | 'Snapshot';

interface MerakiCameraCardProps {
  hass: HomeAssistant;
  config: MerakiCameraCardConfig;
}

const MerakiCameraCard: React.FC<MerakiCameraCardProps> = ({ hass, config }) => {
  const [isCollapsed, setIsCollapsed] = useState(config.default_collapsed || false);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [streamType, setStreamType] = useState<StreamType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStream = async () => {
      setLoading(true);
      setError(null);

      // 1. Try linked camera
      if (config.linked_camera_id) {
        try {
          const stream = await hass.callWS<{ url: string }>({
            type: 'camera/stream',
            entity_id: config.linked_camera_id,
          });
          setStreamUrl(stream.url);
          setStreamType('Live');
          setLoading(false);
          return;
        } catch (err) {
          console.warn('Failed to get linked camera stream, falling back.', err);
        }
      }

      // 2. Try RTSP
      try {
        const rtsp = await hass.callWS<{ rtsp_url: string }>({
          type: 'meraki_ha/get_rtsp_url',
          entity_id: config.entity_id,
        });
        // This is a placeholder; actual RTSP streaming requires a more complex setup
        setStreamUrl(rtsp.rtsp_url);
        setStreamType('RTSP');
        setLoading(false);
        return;
      } catch (err) {
        console.warn('Failed to get RTSP URL, falling back.', err);
      }

      // 3. Fallback to snapshot
      try {
        const snapshot = await hass.callWS<{ url: string }>({
          type: 'meraki_ha/get_camera_snapshot',
          entity_id: config.entity_id,
        });
        setStreamUrl(snapshot.url);
        setStreamType('Snapshot');
      } catch (err) {
        setError('Failed to fetch any camera stream or snapshot.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (config.entity_id) {
      fetchStream();
    }
  }, [hass, config.entity_id, config.linked_camera_id]);

  if (!config || !config.entity_id) {
    return (
      <ha-card>
        <div className="card-content">Please define an entity_id in your card configuration.</div>
      </ha-card>
    );
  }

  const entity = hass.states[config.entity_id];

  if (!entity) {
    return (
      <ha-card>
        <div className="card-content">Entity not found: {config.entity_id}</div>
      </ha-card>
    );
  }

  const fetchStream = async () => {
    setLoading(true);
    setError(null);

    // 1. Try linked camera
    if (config.linked_camera_id) {
      try {
        const stream = await hass.callWS<{ url: string }>({
          type: 'camera/stream',
          entity_id: config.linked_camera_id,
        });
        setStreamUrl(stream.url);
        setStreamType('Live');
        setLoading(false);
        return;
      } catch (err) {
        console.warn('Failed to get linked camera stream, falling back.', err);
      }
    }

    // 2. Try RTSP
    try {
      const rtsp = await hass.callWS<{ rtsp_url: string }>({
        type: 'meraki_ha/get_rtsp_url',
        entity_id: config.entity_id,
      });
      // This is a placeholder; actual RTSP streaming requires a more complex setup
      setStreamUrl(rtsp.rtsp_url);
      setStreamType('RTSP');
      setLoading(false);
      return;
    } catch (err) {
      console.warn('Failed to get RTSP URL, falling back.', err);
    }

    // 3. Fallback to snapshot
    try {
      const snapshot = await hass.callWS<{ url: string }>({
        type: 'meraki_ha/get_camera_snapshot',
        entity_id: config.entity_id,
      });
      setStreamUrl(snapshot.url);
      setStreamType('Snapshot');
    } catch (err) {
      setError('Failed to fetch any camera stream or snapshot.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchStream();
  };

  const handleFullScreen = () => {
    if (streamUrl && streamType === 'Live') {
      const newWindow = window.open(streamUrl, '_blank', 'noopener,noreferrer');
      if (newWindow) newWindow.opener = null;
    }
  };

  const handleSnapshot = async () => {
    try {
      const snapshot = await hass.callWS<{ url: string }>({
        type: 'meraki_ha/get_camera_snapshot',
        entity_id: config.entity_id,
      });
      setStreamUrl(snapshot.url);
      setStreamType('Snapshot');
    } catch (err) {
      setError('Failed to fetch snapshot.');
      console.error(err);
    }
  };

  const [showLinkPanel, setShowLinkPanel] = useState(false);
  const [availableCameras, setAvailableCameras] = useState<{ entity_id: string; name: string }[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>(config.linked_camera_id || '');

  useEffect(() => {
    const fetchAvailableCameras = async () => {
      try {
        const cameras = await hass.callWS<{ entity_id: string; name: string }[]>({
          type: 'meraki_ha/get_available_cameras',
        });
        setAvailableCameras(cameras);
      } catch (err) {
        console.error('Failed to fetch available cameras.', err);
      }
    };
    fetchAvailableCameras();
  }, [hass]);

  const handleLink = () => {
    setShowLinkPanel(!showLinkPanel);
  };

  const handleSaveLink = async () => {
    try {
      await hass.callWS({
        type: 'meraki_ha/set_camera_mapping',
        config_entry_id: hass.config.config_entry_id,
        meraki_camera_entity_id: config.entity_id,
        linked_camera_entity_id: selectedCamera,
      });
      // This should trigger a config update and re-render
      setShowLinkPanel(false);
    } catch (err) {
      console.error('Failed to save camera mapping.', err);
    }
  };

  const handleDashboard = () => {
    const entity = hass.states[config.entity_id];
    if (entity && entity.attributes.meraki_dashboard_url) {
      window.open(entity.attributes.meraki_dashboard_url, '_blank', 'noopener,noreferrer');
    }
  };

  const toggleCollapse = () => {
    if (config.collapsible) {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <ha-card>
      <div className="card-header" onClick={toggleCollapse} style={{ cursor: config.collapsible ? 'pointer' : 'default', display: 'flex', justifyContent: 'space-between' }}>
        <span>{entity.attributes.friendly_name || config.entity_id}</span>
        {config.collapsible && <span>{isCollapsed ? '▼' : '▲'}</span>}
      </div>
      {!isCollapsed && (
        <>
          <div className="card-content" style={{ position: 'relative' }}>
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error}</div>}
        {streamUrl && !loading && !error && (
          <>
            <div
              style={{
                position: 'absolute',
                top: '8px',
                left: '8px',
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
              }}
            >
              ● {streamType}
            </div>
            {streamType === 'Snapshot' || streamType === 'RTSP' ? (
              <img src={streamUrl} style={{ width: '100%' }} alt="Camera Snapshot" />
            ) : (
              <video src={streamUrl} style={{ width: '100%' }} autoPlay muted playsInline />
            )}
          </>
        )}
      </div>
      <div className="card-actions">
        <mwc-button onClick={handleRefresh}>Refresh</mwc-button>
        <mwc-button onClick={handleFullScreen}>Full Screen</mwc-button>
        <mwc-button onClick={handleSnapshot}>Snapshot</mwc-button>
        <mwc-button onClick={handleLink}>Link</mwc-button>
        <mwc-button onClick={handleDashboard}>Dashboard</mwc-button>
      </div>
      {showLinkPanel && (
        <div className="card-content">
          <h4>Link to Camera Stream</h4>
          <select
            value={selectedCamera}
            onChange={(e) => setSelectedCamera(e.target.value)}
          >
            <option value="">Select a camera</option>
            {availableCameras.map((camera) => (
              <option key={camera.entity_id} value={camera.entity_id}>
                {camera.name}
              </option>
            ))}
          </select>
          <mwc-button onClick={handleSaveLink}>Save</mwc-button>
        </div>
      )}
      </>
      )}
    </ha-card>
  );
};

export default MerakiCameraCard;


import React, { useCallback, useEffect, useRef } from 'react';
import { HomeAssistant } from 'custom-card-helpers';

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

interface MerakiMqttStatusCardEditorProps {
  hass: HomeAssistant;
  config: MerakiMqttStatusCardConfig;
  setConfig: (config: MerakiMqttStatusCardConfig) => void;
}

const MerakiMqttStatusCardEditor: React.FC<MerakiMqttStatusCardEditorProps> = ({ config, setConfig }) => {
  const titleRef = useRef<any>(null);
  const collapsibleRef = useRef<any>(null);
  const defaultCollapsedRef = useRef<any>(null);
  const autoHideRef = useRef<any>(null);
  const showStatsRef = useRef<any>(null);
  const showRelayRef = useRef<any>(null);
  const showSensorCountRef = useRef<any>(null);

  const handleConfigChanged = useCallback((e: any) => {
    const target = e.target;
    const newConfig = { ...config };

    if (e.detail && typeof e.detail.value !== 'undefined') {
        // Handle paper-input, which has no 'name' on target for this event
        newConfig.title = e.detail.value;
    } else if (target && target.name) {
        // Handle ha-switch
        newConfig[target.name] = target.checked;
    }

    setConfig(newConfig);
  }, [config, setConfig]);

  useEffect(() => {
    const elements = [
      { ref: titleRef, event: 'value-changed' },
      { ref: collapsibleRef, event: 'change' },
      { ref: defaultCollapsedRef, event: 'change' },
      { ref: autoHideRef, event: 'change' },
      { ref: showStatsRef, event: 'change' },
      { ref: showRelayRef, event: 'change' },
      { ref: showSensorCountRef, event: 'change' },
    ];

    elements.forEach(({ ref, event }) => {
      const element = ref.current;
      if (element) {
        element.addEventListener(event, handleConfigChanged);
      }
    });

    return () => {
      elements.forEach(({ ref, event }) => {
        const element = ref.current;
        if (element) {
          element.removeEventListener(event, handleConfigChanged);
        }
      });
    };
  }, [handleConfigChanged]);

  useEffect(() => {
    if (titleRef.current) {
        titleRef.current.value = config.title || '';
    }
    if (collapsibleRef.current) {
        collapsibleRef.current.checked = config.collapsible !== false;
    }
    if (defaultCollapsedRef.current) {
        defaultCollapsedRef.current.checked = config.default_collapsed !== false;
        defaultCollapsedRef.current.disabled = config.collapsible === false;
    }
    if (autoHideRef.current) {
        autoHideRef.current.checked = config.auto_hide_when_disabled !== false;
    }
    if (showStatsRef.current) {
        showStatsRef.current.checked = config.show_message_stats !== false;
    }
    if (showRelayRef.current) {
        showRelayRef.current.checked = config.show_relay_destinations !== false;
    }
    if (showSensorCountRef.current) {
        showSensorCountRef.current.checked = config.show_sensor_count !== false;
    }
  }, [config]);


  return (
    <div className="card-config">
        <paper-input
            ref={titleRef}
            label="Title"
            name="title"
        ></paper-input>

        <ha-formfield label="Collapsible">
            <ha-switch
                ref={collapsibleRef}
                name="collapsible"
            ></ha-switch>
        </ha-formfield>

        <ha-formfield label="Default to Collapsed">
            <ha-switch
                ref={defaultCollapsedRef}
                name="default_collapsed"
            ></ha-switch>
        </ha-formfield>

        <ha-formfield label="Auto-hide when MQTT is disabled">
            <ha-switch
                ref={autoHideRef}
                name="auto_hide_when_disabled"
            ></ha-switch>
        </ha-formfield>

        <ha-formfield label="Show Message Statistics">
            <ha-switch
                ref={showStatsRef}
                name="show_message_stats"
            ></ha-switch>
        </ha-formfield>

        <ha-formfield label="Show Relay Destinations">
            <ha-switch
                ref={showRelayRef}
                name="show_relay_destinations"
            ></ha-switch>
        </ha-formfield>

        <ha-formfield label="Show Sensor Count">
            <ha-switch
                ref={showSensorCountRef}
                name="show_sensor_count"
            ></ha-switch>
        </ha-formfield>
    </div>
  );
};

export default MerakiMqttStatusCardEditor;

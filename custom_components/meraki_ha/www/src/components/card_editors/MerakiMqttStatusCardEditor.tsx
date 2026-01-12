
import React, { useCallback } from 'react';
import { HomeAssistant } from 'custom-card-helpers';

interface MerakiMqttStatusCardConfig {
  type: string;
  title?: string;
  show_relay_destinations?: boolean;
  show_message_stats?: boolean;
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

  const handleConfigChanged = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newConfig = { ...config };

    if (type === 'checkbox') {
        newConfig[name] = checked;
    } else {
        newConfig[name] = value;
    }

    setConfig(newConfig);
  }, [config, setConfig]);


  return (
    <div className="card-config">
        <paper-input
            label="Title"
            name="title"
            .value=${config.title || ''}
            @value-changed=${handleConfigChanged}
        ></paper-input>

        <ha-formfield label="Collapsible">
            <ha-switch
                name="collapsible"
                .checked=${config.collapsible !== false}
                @change=${handleConfigChanged}
            ></ha-switch>
        </ha-formfield>

        <ha-formfield label="Default to Collapsed">
            <ha-switch
                name="default_collapsed"
                .checked=${config.default_collapsed !== false}
                @change=${handleConfigChanged}
                .disabled=${config.collapsible === false}
            ></ha-switch>
        </ha-formfield>

        <ha-formfield label="Auto-hide when MQTT is disabled">
            <ha-switch
                name="auto_hide_when_disabled"
                .checked=${config.auto_hide_when_disabled !== false}
                @change=${handleConfigChanged}
            ></ha-switch>
        </ha-formfield>

        <ha-formfield label="Show Message Statistics">
            <ha-switch
                name="show_message_stats"
                .checked=${config.show_message_stats !== false}
                @change=${handleConfigChanged}
            ></ha-switch>
        </ha-formfield>

        <ha-formfield label="Show Relay Destinations">
            <ha-switch
                name="show_relay_destinations"
                .checked=${config.show_relay_destinations !== false}
                @change=${handleConfigChanged}
            ></ha-switch>
        </ha-formfield>
    </div>
  );
};

export default MerakiMqttStatusCardEditor;

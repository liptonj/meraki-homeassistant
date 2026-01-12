
import React from 'react';
import { HomeAssistant } from 'custom-card-helpers';
import { MerakiCameraCardConfig } from '../types';

interface MerakiCameraCardEditorProps {
  hass: HomeAssistant;
  config: MerakiCameraCardConfig;
  setConfig: (config: MerakiCameraCardConfig) => void;
}

const MerakiCameraCardEditor: React.FC<MerakiCameraCardEditorProps> = ({ hass, config, setConfig }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="card-config">
        <paper-input
          label="Entity ID"
          name="entity_id"
          value={config.entity_id || ''}
          onChange={handleChange}
        ></paper-input>
      </div>
    </div>
  );
};

export default MerakiCameraCardEditor;

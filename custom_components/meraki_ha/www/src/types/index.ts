
import { LovelaceCardConfig } from 'custom-card-helpers';

export interface MerakiCameraCardConfig extends LovelaceCardConfig {
  entity_id?: string;
  device_serial?: string;
  linked_camera_id?: string;
  show_controls?: boolean;
  show_snapshot_button?: boolean;
  show_dashboard_link?: boolean;
  aspect_ratio?: string;
  collapsible?: boolean;
  default_collapsed?: boolean;
}

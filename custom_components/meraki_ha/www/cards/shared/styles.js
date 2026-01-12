import { css } from 'lit';

export const merakiCardStyles = css`
  :host {
    --meraki-primary: var(--primary-color);
    --meraki-success: var(--success-color, #4caf50);
    --meraki-warning: var(--warning-color, #ff9800);
    --meraki-error: var(--error-color, #f44336);
    --meraki-offline: var(--disabled-text-color, #bdbdbd);
  }

  ha-card {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
  }

  .card-content {
    flex: 1;
    padding: 16px;
  }

  .card-actions {
    padding: 8px;
    border-top: 1px solid var(--divider-color);
  }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px;
  }

  .error {
    color: var(--meraki-error);
    padding: 16px;
  }
`;

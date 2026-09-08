import { merakiCardStyles } from '../../custom_components/meraki_ha/www/shared/styles.js';
import { expect } from '@open-wc/testing';

describe('merakiCardStyles', () => {
  it('is a CSSResult object', () => {
    // The `css` tag function in lit returns a specific object type.
    // This is a basic check to ensure the import is working and it's valid CSS.
    expect(merakiCardStyles).to.be.an.instanceOf(Object);
    expect(merakiCardStyles.cssText).to.be.a('string');
  });

  it('contains expected CSS variables with fallbacks', () => {
    const css = merakiCardStyles.cssText;
    expect(css).to.include('--meraki-success: var(--success-color, #4caf50)');
    expect(css).to.include('--meraki-warning: var(--warning-color, #ff9800)');
    expect(css).to.include('--meraki-error: var(--error-color, #f44336)');
    expect(css).to.include(
      '--meraki-offline: var(--disabled-text-color, #bdbdbd)'
    );
  });
});

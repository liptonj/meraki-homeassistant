/**
 * Meraki Cards Loader
 * 
 * This file sets up the import map for lit and then loads the main cards bundle.
 * Use THIS file as your Lovelace resource instead of meraki-cards.js directly.
 */

// Add import map for lit if it doesn't exist
if (!document.querySelector('script[type="importmap"]')) {
  const importMap = document.createElement('script');
  importMap.type = 'importmap';
  importMap.textContent = JSON.stringify({
    imports: {
      'lit': 'https://cdn.jsdelivr.net/npm/lit@3.1.0/index.js',
      'lit/': 'https://cdn.jsdelivr.net/npm/lit@3.1.0/',
      'lit-element': 'https://cdn.jsdelivr.net/npm/lit-element@4.0.2/lit-element.js',
      'lit-element/': 'https://cdn.jsdelivr.net/npm/lit-element@4.0.2/',
      'lit-html': 'https://cdn.jsdelivr.net/npm/lit-html@3.1.0/lit-html.js',
      'lit-html/': 'https://cdn.jsdelivr.net/npm/lit-html@3.1.0/',
      '@lit/reactive-element': 'https://cdn.jsdelivr.net/npm/@lit/reactive-element@2.0.2/reactive-element.js',
      '@lit/reactive-element/': 'https://cdn.jsdelivr.net/npm/@lit/reactive-element@2.0.2/'
    }
  });
  document.head.prepend(importMap);
  
  console.info(
    '%c MERAKI CARDS LOADER ',
    'color: #fff; background: #27ae60; font-weight: 700; padding: 4px 8px; border-radius: 4px;',
    'Import map added for lit dependencies'
  );
}

// Now import the main cards bundle
import('./meraki-cards.js').then(() => {
  console.info(
    '%c MERAKI CARDS ',
    'color: #fff; background: #2980b9; font-weight: 700; padding: 4px 8px; border-radius: 4px;',
    'All cards loaded successfully'
  );
}).catch(err => {
  console.error('Failed to load Meraki cards:', err);
});

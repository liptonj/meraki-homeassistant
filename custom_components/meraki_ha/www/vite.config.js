import { defineConfig } from 'vite';
import { resolve } from 'path';

// Output directory for built cards - inside custom_components for HACS packaging
// This directory gets packaged with the integration
const CARDS_OUTPUT_DIR = resolve(__dirname, '../www');

export default defineConfig({
  build: {
    lib: {
      entry: {
        'ssid-card': resolve(__dirname, 'src/cards/meraki-ssid-card.ts'),
        'ssid-card-editor': resolve(__dirname, 'src/cards/meraki-ssid-card-editor.ts'),
        'camera-card': resolve(__dirname, 'src/cards/meraki-camera-card.ts'),
        'camera-card-editor': resolve(__dirname, 'src/cards/meraki-camera-card-editor.tsx'),
        'badges': resolve(__dirname, 'src/badges.ts'),
        'dashboard-strategy': resolve(__dirname, 'src/strategies/meraki-dashboard-strategy.ts'),
      },
      formats: ['es'],
    },
    // Output built cards inside custom_components/meraki_ha/www/
    outDir: CARDS_OUTPUT_DIR,
    emptyOutDir: false, // Don't delete existing vanilla JS cards
    rollupOptions: {
      external: [/^lit/, /^home-assistant-js-websocket/, /^@lit/, /^lit-element/, /^lit-html/, /^superstruct/],
      output: {
        entryFileNames: 'meraki-[name].js',
      }
    },
  },
});

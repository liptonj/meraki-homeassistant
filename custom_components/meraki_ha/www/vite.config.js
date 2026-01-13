import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: {
        'ssid-card': resolve(__dirname, 'src/cards/meraki-ssid-card.ts'),
        'ssid-card-editor': resolve(__dirname, 'src/cards/meraki-ssid-card-editor.ts'),
        'badges': resolve(__dirname, 'src/badges.ts'),
        'dashboard-strategy': resolve(__dirname, 'src/strategies/meraki-dashboard-strategy.ts'),
      },
      formats: ['es'],
    },
    outDir: './',
    rollupOptions: {
      external: [/^lit/, /^home-assistant-js-websocket/, /^@lit/, /^lit-element/, /^lit-html/, /^superstruct/],
      output: {
        entryFileNames: 'meraki-[name].js',
      }
    },
  },
});

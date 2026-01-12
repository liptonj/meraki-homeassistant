import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'cards/meraki-cards.js',
      formats: ['es'],
      fileName: 'meraki-cards',
    },
    outDir: 'dist/cards',
    rollupOptions: {
      external: [/^lit/, /^home-assistant-js-websocket/],
    },
  },
});

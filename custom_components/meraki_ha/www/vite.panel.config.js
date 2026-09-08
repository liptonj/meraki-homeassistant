import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

// Panel build configuration - outputs to custom_components/meraki_ha/www/
// This is separate from the cards which go to www/meraki_ha/ at repo root
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.tsx'),
      name: 'MerakiPanel',
      formats: ['es'],
      fileName: () => 'meraki-panel.js',
    },
    outDir: './',
    emptyOutDir: false,
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});

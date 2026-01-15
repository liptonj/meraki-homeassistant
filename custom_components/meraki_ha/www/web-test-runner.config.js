import { esbuildPlugin } from '@web/dev-server-esbuild';
import { fromRollup } from '@web/dev-server-rollup';
import rollupNodeResolve from '@rollup/plugin-node-resolve';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const nodeResolve = fromRollup(rollupNodeResolve);

export default {
  files: '../../../tests/frontend/**/*.js',
  rootDir: '../../..',
  nodeResolve: false, // Disable built-in nodeResolve, we'll use the rollup plugin
  plugins: [
    nodeResolve({
      // Tell rollup where to find node_modules
      modulePaths: [resolve(__dirname, 'node_modules')],
      browser: true,
      exportConditions: ['browser', 'development'],
    }),
    esbuildPlugin({
      ts: true,
      target: 'auto',
    }),
  ],
  testFramework: {
    config: {
      timeout: 10000,
    },
  },
  coverage: false,
  browserLogs: true,
};

import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'es2022',
    minify: 'esbuild',
    sourcemap: false
  },
  esbuild: {
    drop: ['console', 'debugger']
  },
  server: {
    port: 3000
  }
});

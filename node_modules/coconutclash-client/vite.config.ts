import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Use relative paths for assets in production
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
});

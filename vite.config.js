import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'ads',
  server: {
    host: true,
    port: 5173,
    open: false,
    strictPort: false,
    allowedHosts: true,
    hmr: {
      clientPort: 443,
      protocol: 'wss'
    },
    cors: true
  },
  preview: {
    host: true,
    port: 4173,
    allowedHosts: true,
    cors: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});

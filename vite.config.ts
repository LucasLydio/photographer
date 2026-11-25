import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, 'index.html'),
        services: resolve(import.meta.dirname, 'services.html'),
        gallery: resolve(import.meta.dirname, 'gallery.html'),
        admin: resolve(import.meta.dirname, 'admin.html'),
      },
    },
  },
});

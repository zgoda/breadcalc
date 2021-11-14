import { defineConfig } from 'vite';
import { resolve } from 'path';
import preact from '@preact/preset-vite';
import { VitePWA } from 'vite-plugin-pwa';
import handlebars from 'vite-plugin-handlebars';

export default defineConfig({
  plugins: [
    handlebars({
      partialDirectory: resolve(__dirname, 'partials'),
    }),
    preact(),
    VitePWA({
      base: '/',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Kalkulator ciasta chlebowego',
        short_name: 'Kalkulator ciasta chlebowego',
        description: 'Kalkulator ciasta do pieczywa na zakwasie wg J. Hamelmana',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        // about: resolve(__dirname, 'about/index.html'),
        // privacy: resolve(__dirname, 'privacy/index.html'),
        // contact: resolve(__dirname, 'contact/index.html'),
      },
    },
  },
  server: {
    port: 8080,
  },
});

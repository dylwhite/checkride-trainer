import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { VitePWA } from 'vite-plugin-pwa';

// The app is served from https://<user>.github.io/checkride-trainer/
// so all paths are relative to that folder.
export default defineConfig({
  base: '/checkride-trainer/',
  plugins: [
    preact(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png'],
      manifest: {
        name: 'Checkride Trainer',
        short_name: 'Checkride',
        description: 'Private Pilot oral exam trainer — Cessna 152, KHIO',
        theme_color: '#0B1220',
        background_color: '#0B1220',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/checkride-trainer/',
        scope: '/checkride-trainer/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        // Cache everything the app needs so it works with no signal
        globPatterns: ['**/*.{js,css,html,png,svg,json,webp,jpg}'],
        maximumFileSizeToCacheInBytes: 15 * 1024 * 1024,
        navigateFallback: 'index.html',
        globIgnores: ['splash/**', 'icons/icon-1024.png']
      }
    })
  ]
});

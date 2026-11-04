import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

// Backend routes the local dev server proxies (and a production proxy may
// one day serve from this origin): the service worker never answers them.
const BACKEND_PATHS = [
  '/auth',
  '/users',
  '/graphql',
  '/google-calendar',
  '/ai',
  '/socket.io',
  '/media',
  '/uploads',
];

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Cargar variables de entorno según el modo (development, production, etc.)
  // El tercer parámetro '' carga todas las variables sin importar el prefijo VITE_
  const env = loadEnv(mode, process.cwd(), '');

  const BACKEND_TARGET =
    env.VITE_BACKEND_TARGET || env.VITE_API_URL || 'http://localhost:8000';
  const IS_SECURE = BACKEND_TARGET.startsWith('https');

  return {
    plugins: [
      react(),
      // Installable app (Chrome/Edge "Install", Safari "Add to Dock"): the
      // manifest plus a service worker that keeps the app shell offline and
      // updates itself on every deploy.
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        includeAssets: [
          'favicon.ico',
          'logo.svg',
          'apple-touch-icon-180x180.png',
        ],
        manifest: {
          id: '/',
          name: 'Focusly',
          short_name: 'Focusly',
          description: 'Tareas, calendario, notas e IA en un solo lugar.',
          lang: 'es',
          dir: 'ltr',
          // The installed app opens on the app itself (signed out, that
          // sends to /login), not on the marketing home.
          start_url: '/dashboard',
          scope: '/',
          display: 'standalone',
          // Dark is the default theme; documentMode.ts recolors the title
          // bar at runtime through the theme-color meta.
          background_color: '#111215',
          theme_color: '#111215',
          categories: ['productivity', 'business'],
          icons: [
            { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
            { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
            {
              src: 'maskable-icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
          shortcuts: [
            {
              name: 'Calendario',
              url: '/dashboard',
              icons: [{ src: 'pwa-192x192.png', sizes: '192x192' }],
            },
            {
              name: 'Tareas',
              url: '/tasks',
              icons: [{ src: 'pwa-192x192.png', sizes: '192x192' }],
            },
          ],
        },
        workbox: {
          // Precache only the app shell: the page, its entry code and styles,
          // the icons (about what any visit downloads anyway). The lazy
          // chunks (editor, canvas, PDF...) are cached the first time they're
          // used, below, so a landing visit doesn't pull 20 MB of app code.
          globPatterns: [
            'index.html',
            'assets/index-*.{js,css}',
            '*.{svg,png,ico}',
          ],
          globIgnores: ['videos/**', 'images/**', 'Focusly.png', 'vite.svg'],
          maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: true,
          navigateFallback: '/index.html',
          navigateFallbackDenylist: BACKEND_PATHS.map(
            (p) => new RegExp(`^${p}(/|$)`),
          ),
          runtimeCaching: [
            {
              // Hashed build files never change: cache each on first use
              urlPattern: ({ sameOrigin, url }) =>
                sameOrigin && url.pathname.startsWith('/assets/'),
              handler: 'CacheFirst',
              options: {
                cacheName: 'app-chunks',
                expiration: {
                  maxEntries: 400,
                  maxAgeSeconds: 60 * 60 * 24 * 60,
                },
                cacheableResponse: { statuses: [200] },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'StaleWhileRevalidate',
              options: { cacheName: 'google-fonts-css' },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-files',
                expiration: {
                  maxEntries: 40,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      },
      proxy: {
        '/auth': {
          target: BACKEND_TARGET,
          changeOrigin: true,
          secure: IS_SECURE,
        },
        '/users': {
          target: BACKEND_TARGET,
          changeOrigin: true,
          secure: IS_SECURE,
        },
        '/graphql': {
          target: BACKEND_TARGET,
          changeOrigin: true,
          secure: IS_SECURE,
        },
        '/google-calendar': {
          target: BACKEND_TARGET,
          changeOrigin: true,
          secure: IS_SECURE,
        },
        '/ai': {
          target: BACKEND_TARGET,
          changeOrigin: true,
          secure: IS_SECURE,
        },
        '/socket.io': {
          target: BACKEND_TARGET,
          changeOrigin: true,
          ws: true,
          secure: IS_SECURE,
        },
      },
    },
  };
});

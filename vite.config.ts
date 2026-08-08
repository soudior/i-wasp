import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    // Optimized for Capacitor/Xcode export
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tooltip'],
          motion: ['framer-motion'],
          supabase: ['@supabase/supabase-js'],
          i18n: ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Manifest unique : on utilise public/manifest.json (lié dans index.html)
      // pour éviter deux manifests concurrents. Le plugin ne gère que le service worker.
      manifest: false,
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icons/icon-192x192.png', 'icons/icon-512x512.png'],
      workbox: {
        // Précache = APP SHELL uniquement (code, styles, polices auto-hébergées,
        // icônes). Les images (photos produits, visuels marketing…) ne sont PAS
        // précachées : elles pesaient ~68 Mo téléchargés d'office à la 1ère visite.
        // Elles passent par le runtime cache « images-cache-v2 » ci-dessous,
        // rempli à la demande, page par page.
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        globPatterns: ['**/*.{js,css,html,ico,woff2}'],
        runtimeCaching: [
          // NB : plus de règles fonts.googleapis/gstatic — toutes les polices sont
          // auto-hébergées (@fontsource) et précachées via woff2.
          {
            // Cache NFC card pages - always fetch fresh content first
            urlPattern: /\/card\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'nfc-cards-cache-v2',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 1 day only
              },
              cacheableResponse: {
                statuses: [0, 200]
              },
              networkTimeoutSeconds: 2
            }
          },
          {
            // Cache API responses for offline mode
            urlPattern: /\/rest\/v1\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 // 1 hour
              },
              cacheableResponse: {
                statuses: [0, 200]
              },
              networkTimeoutSeconds: 5
            }
          },
          {
            // Cache images - StaleWhileRevalidate for faster updates
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'images-cache-v2',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

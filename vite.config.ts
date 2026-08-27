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
    target: 'es2020' as const,
    minify: 'terser' as const,
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
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024, // 8 MB for large bundles
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,jpg,jpeg,webp}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
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

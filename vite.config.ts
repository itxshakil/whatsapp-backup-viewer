import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      devOptions: {
        enabled: true,
        type: 'module'
      },
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      registerType: 'autoUpdate',
      injectManifest: {
        injectionPoint: 'self.__WB_MANIFEST'
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,png}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
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
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      includeAssets: ['favicon.png', 'wa-bg.png', 'screenshots/*.png'],
      manifest: {
        name: 'WhatsApp Backup Viewer',
        short_name: 'WA Viewer',
        description: 'Private and secure WhatsApp chat backup viewer and analyzer. Explore your chat memories with a full media gallery, deep analytics, and smart search - all while keeping your data 100% local and private.',
        theme_color: '#075e54',
        background_color: '#ffffff',
        display: 'standalone',
        display_override: ['window-controls-overlay', 'standalone'],
        orientation: 'portrait',
        categories: ['productivity', 'utilities'],
        scope: '/',
        start_url: '/',
        icons: [
          {
            "src": "/icons/icon-16x16.png",
            "sizes": "16x16",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "/icons/icon-32x32.png",
            "sizes": "32x32",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "/icons/icon-48x48.png",
            "sizes": "48x48",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "/icons/icon-64x64.png",
            "sizes": "64x64",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "/icons/icon-96x96.png",
            "sizes": "96x96",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "/icons/icon-128x128.png",
            "sizes": "128x128",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "/icons/icon-144x144.png",
            "sizes": "144x144",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "/icons/icon-152x152.png",
            "sizes": "152x152",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "/icons/icon-180x180.png",
            "sizes": "180x180",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "/icons/icon-192x192.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "/icons/icon-192x192-maskable.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "maskable"
          },
          {
            "src": "/icons/icon-384x384.png",
            "sizes": "384x384",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "/icons/icon-512x512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "/icons/icon-512x512-maskable.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "maskable"
          }
        ],
        screenshots: [
          {
            src: "/screenshots/homepage-mobile.png",
            sizes: "800×1624",
            type: "image/png",
            form_factor: "narrow",
            label: "WhatsApp Backup Viewer - Homepage"
          },
          {
            src: "/screenshots/homepage-wide.png",
            sizes: "800×581",
            type: "image/png",
            form_factor: "wide",
            label: "WhatsApp Backup Viewer - Homepage"
          },
          {
            src: "/screenshots/chat-mobile.png",
            sizes: "800×1624",
            type: "image/png",
            form_factor: "narrow",
            label: "WhatsApp Chat View"
          },
          {
            src: "/screenshots/chat-wide.png",
            sizes: "800×581",
            type: "image/png",
            form_factor: "wide",
            label: "WhatsApp Chat View"
          },
          {
            src: "/screenshots/analytics-mobile.png",
            sizes: "800×1624",
            type: "image/png",
            form_factor: "narrow",
            label: "WhatsApp Analytics Dashboard"
          },
          {
            src: "/screenshots/analytics-wide.png",
            sizes: "800×581",
            type: "image/png",
            form_factor: "wide",
            label: "WhatsApp Analytics Dashboard"
          }
        ],
        shortcuts: [
          {
            name: "Recent Chats",
            short_name: "Recent",
            description: "View your recently opened WhatsApp chats",
            url: "/?action=recent",
            icons: [{ "src": "/icons/icon-192x192.png", "sizes": "192x192" }]
          }
        ],
        share_target: {
          action: "/",
          method: "POST",
          enctype: "multipart/form-data",
          params: {
            files: [
              {
                name: "file",
                accept: [".zip", ".txt"]
              }
            ]
          }
        }
      }
    })
  ],
})

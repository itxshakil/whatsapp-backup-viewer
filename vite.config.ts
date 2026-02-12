import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'wa-bg.png'],
      manifest: {
        name: 'WhatsApp Viewer',
        short_name: 'WA Viewer',
        description: 'Local-first WhatsApp backup viewer and analyzer',
        theme_color: '#075e54',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ],
        shortcuts: [
          {
            name: "Recent Chats",
            short_name: "Recent",
            description: "View your recently opened WhatsApp chats",
            url: "/?action=recent",
            icons: [{ "src": "icon-192.png", "sizes": "192x192" }]
          }
        ]
      }
    })
  ],
})

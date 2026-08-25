import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
   plugins: [
      react(),
      VitePWA({
         registerType: 'autoUpdate',
         includeAssets: [
            'favicon.ico',
            'apple-touch-icon.png',
            'masked-icon.svg',
         ],
         manifest: {
            name: 'Undercover Social Game',
            short_name: 'Undercover',
            description: 'Game Potong Kata & Deteksi Sosial Satu Perangkat',
            theme_color: '#020617', // slate-950
            background_color: '#020617',
            display: 'standalone',
            orientation: 'portrait',
            icons: [
               {
                  src: '/vite.svg',
                  sizes: '192x192',
                  type: 'image/svg+xml',
                  purpose: 'any maskable',
               },
               {
                  src: '/vite.svg',
                  sizes: '512x512',
                  type: 'image/svg+xml',
                  purpose: 'any maskable',
               },
            ],
         },
      }),
   ],
   test: {
      globals: true,
      environment: 'node',
   },
})

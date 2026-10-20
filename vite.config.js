import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      // Local dev: forward /api/* to the LIVE backend (https://shivimanufacturer.com/api/*)
      // so no local Laravel setup is needed and there are no CORS issues.
      '/api': {
        target: 'https://shivimanufacturer.com',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})

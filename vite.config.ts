import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true, // Exit if port is already in use instead of trying new ports
    host: true
  },
  preview: {
    port: 4173,
    strictPort: true, // Exit if port is already in use instead of trying new ports
    host: true
  }
})
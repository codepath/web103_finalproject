import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // The server serves its API under /api, so requests pass through unchanged.
      '/api': 'http://localhost:3001',
    },
  },
})

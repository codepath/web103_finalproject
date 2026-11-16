import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    // Render sets production for the build; React's DOM tests require its test runtime.
    env: { NODE_ENV: 'test' },
  },
  server: {
    proxy: {
      // The server serves its API under /api, so requests pass through unchanged.
      '/api': 'http://localhost:3001',
    },
  },
})

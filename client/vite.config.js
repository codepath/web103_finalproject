import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Forwards API calls to the Express server during `npm run dev`
    proxy: { '/api': 'http://localhost:3000' },
  },
})

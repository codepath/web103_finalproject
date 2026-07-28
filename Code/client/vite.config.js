import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const apiUrl = env.VITE_API_URL || 'http://localhost:3000'

  return {
    plugins: [react()],
    build: {
      outDir: '../server/public',
      emptyOutDir: true
    },
    server: {
      proxy: {
        // dev only — never ships. Follows VITE_API_URL so changing the API port
        // doesn't mean editing this file.
        //
        // Only /api is proxied. /auth is deliberately left off: the GitHub
        // OAuth round trip has to land back on the API's own origin for the
        // session cookie to be set, so the client calls it absolutely instead
        // (see src/config/api.js).
        '/api': {
          target: apiUrl
        }
      }
    }
  }
})

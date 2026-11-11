import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    server: {
      // In development, forward /api requests to the local Express backend so
      // the browser sees a single origin and no CORS setup is needed.
      proxy: {
        "/api": env.VITE_DEV_API_TARGET || "http://localhost:3000",
      },
    },
  };
});

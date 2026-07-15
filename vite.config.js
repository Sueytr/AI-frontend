import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Forwards /api requests to the Express backend during development
      // so the client can use relative URLs (see src/services/api.js).
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});

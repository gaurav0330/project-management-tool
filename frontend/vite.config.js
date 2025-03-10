import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/graphql": {
        target: "https://backend-proxy.gauravjikar070806.workers.dev",
        changeOrigin: true,
        secure: true,
      },
      "/ws": {
        target: "https://backend-proxy.gauravjikar070806.workers.dev",
        changeOrigin: true,
        ws: true,
      },
    },
  },
});

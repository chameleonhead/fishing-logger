import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://9gvmx4p0y3.execute-api.us-east-1.amazonaws.com",
        changeOrigin: true,
      },
    },
  },
});

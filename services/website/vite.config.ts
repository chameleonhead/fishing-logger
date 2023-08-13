import { defineConfig, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), splitVendorChunkPlugin()],
  server: {
    proxy: {
      "/api": {
        target: "https://7i11vuoghc.execute-api.ap-northeast-1.amazonaws.com",
        changeOrigin: true,
      },
    },
  },
});

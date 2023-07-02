import { defineConfig } from 'vite'
import { resolve } from "path";

import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8081",
        changeOrigin: true,
      }
    }
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src")
      // Add more aliases as needed
    }
  },
  plugins: [vue()]
});

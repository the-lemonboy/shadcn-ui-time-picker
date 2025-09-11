import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), createSvgIconsPlugin({
    iconDirs: [path.resolve(__dirname, "./src/assets/icons")],
    symbolId: "icon-[dir]-[name]",
  })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

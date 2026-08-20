import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import path from "node:path"
import { defineConfig } from "vite"
import {
  figurePngBuildExportPlugin,
  figurePngExportPlugin,
} from "./scripts/vite-figure-export-plugin.mjs"

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    tailwindcss(),
    figurePngExportPlugin(),
    figurePngBuildExportPlugin(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: parseInt(process.env.PORT || "8443"),
    strictPort: true,
  },
  preview: {
    host: "0.0.0.0",
    port: parseInt(process.env.PORT || "8443"),
  },
})

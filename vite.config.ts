import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Ensure GLB/GLTF model files are treated as assets so Vite doesn't try to
  // parse them as JS during import-analysis.
  assetsInclude: ['**/*.glb', '**/*.gltf'],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

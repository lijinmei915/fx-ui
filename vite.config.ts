import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { createDevInspectorServerPlugin } from "@lijinmei-810/dev-inspector-vite";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    createDevInspectorServerPlugin({
      projectRoot: process.cwd(),
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => id.includes("node_modules/recharts") ? "vendor-recharts" : undefined,
      },
    },
  },
});

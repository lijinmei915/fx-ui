import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { createDevInspectorServerPlugin } from "@lijinmei-810/dev-inspector-vite";
import fs from "node:fs";
import path from "path";

export default defineConfig(({ mode }) => {
  const isFoundationPublication = mode === "foundation"
  const foundationDesignTokensId = "\0fx-ui:foundation-design-tokens"
  const foundationComponentTokensId = "\0fx-ui:foundation-component-tokens"
  const publicationAliases = isFoundationPublication
    ? [
        { find: "@/lib/page-registry-config", replacement: path.resolve(__dirname, "./src/publications/foundation/page-registry-config.tsx") },
        { find: "@/lib/site-navigation", replacement: path.resolve(__dirname, "./src/publications/foundation/site-navigation.ts") },
        { find: "@/lib/document-sources", replacement: path.resolve(__dirname, "./src/publications/foundation/document-sources.ts") },
        { find: "@/lib/design-tokens-manifest-source", replacement: foundationDesignTokensId },
        { find: "@/lib/component-tokens-manifest-source", replacement: foundationComponentTokensId },
        { find: "@/pages/docs/getting-started/getting-started-page-adapter", replacement: path.resolve(__dirname, "./src/publications/foundation/getting-started-page-adapter.tsx") },
      ]
    : []

  return {
  base: isFoundationPublication ? "./" : "/",
  publicDir: isFoundationPublication ? false : "public",
  plugins: [
    ...(isFoundationPublication ? [{
      name: "fx-ui-foundation-design-token-projection",
      resolveId(id: string) {
        return id === foundationDesignTokensId || id === foundationComponentTokensId ? id : null
      },
      load(id: string) {
        if (id === foundationComponentTokensId) {
          return `export const componentManifestRaw = ${JSON.stringify(JSON.stringify({ admissions: [], tokens: [] }))}`
        }
        if (id !== foundationDesignTokensId) return null
        const source = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./docs/data/design-tokens.json"), "utf8"))
        const projection = {
          updatedAt: source.updatedAt,
          foundation: source.foundation,
          primitive: [],
          semantic: [],
          componentUsage: [],
          typography: source.typography,
        }
        return `export const designTokensManifestRaw = ${JSON.stringify(JSON.stringify(projection))}`
      },
    }] : []),
    react(),
    tailwindcss(),
    createDevInspectorServerPlugin({
      projectRoot: process.cwd(),
    }),
  ],
  resolve: {
    alias: [...publicationAliases, { find: "@", replacement: path.resolve(__dirname, "./src") }],
  },
  define: {
    "import.meta.env.VITE_FX_DOCS_SCOPE": JSON.stringify(isFoundationPublication ? "foundation" : "full"),
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => id.includes("node_modules/recharts") ? "vendor-recharts" : undefined,
      },
    },
  },
  }
});

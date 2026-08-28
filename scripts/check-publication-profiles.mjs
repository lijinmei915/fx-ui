#!/usr/bin/env node
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const manifest = JSON.parse(fs.readFileSync(path.join(root, "docs/data/publication-profiles.manifest.json"), "utf8"))
const foundation = manifest.profiles?.foundation
const errors = []

if (manifest.format !== "fx-ui/publication-profiles" || manifest.schemaVersion !== 1 || manifest.truthSource !== "docs/data/publication-profiles.manifest.json") {
  errors.push("发布配置 manifest 的 format/schemaVersion/truthSource 不正确")
}
if (!foundation || foundation.contentPolicy === "all-registered-pages") {
  errors.push("Foundation 发布配置必须使用显式白名单")
}
if (foundation?.outputDirectory !== "dist-foundation" || foundation?.defaultPage !== "tokens" || foundation?.sourceMaps !== false) {
  errors.push("Foundation 输出目录、默认页或 source map 边界漂移")
}

const publicationRoot = path.join(root, "src/publications/foundation")
const registrySource = fs.readFileSync(path.join(publicationRoot, "page-registry-config.tsx"), "utf8")
const navigationSource = fs.readFileSync(path.join(publicationRoot, "site-navigation.ts"), "utf8")
const documentsSource = fs.readFileSync(path.join(publicationRoot, "document-sources.ts"), "utf8")
const viteSource = fs.readFileSync(path.join(root, "vite.config.ts"), "utf8")
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"))

const registryObjectSource = registrySource.slice(registrySource.indexOf("  return {"), registrySource.lastIndexOf("\n  }"))
const registryPages = new Set([...registryObjectSource.matchAll(/^    (?:(?:"([^"]+)")|([a-z][\w-]*)):\s*\{/gm)].map((match) => match[1] ?? match[2]))
const allowedPages = new Set(foundation?.allowedPages ?? [])
if (JSON.stringify([...registryPages].sort()) !== JSON.stringify([...allowedPages].sort())) {
  errors.push(`Foundation 页面注册表与白名单不一致: registry=${[...registryPages].sort().join(",")} manifest=${[...allowedPages].sort().join(",")}`)
}

for (const slug of allowedPages) {
  if (!navigationSource.includes(`href: "#${slug}"`)) errors.push(`Foundation 导航缺少白名单页面: ${slug}`)
}
for (const match of navigationSource.matchAll(/href: "#([^"]+)"/g)) {
  if (!allowedPages.has(match[1])) errors.push(`Foundation 导航包含白名单外页面: ${match[1]}`)
}

const documentPaths = new Set([...documentsSource.matchAll(/path: "([^"]+)"/g)].map((match) => match[1]).filter(Boolean))
const allowedMarkdown = new Set(foundation?.allowedMarkdown ?? [])
if (JSON.stringify([...documentPaths].sort()) !== JSON.stringify([...allowedMarkdown].sort())) {
  errors.push("Foundation Markdown 投影与 allowedMarkdown 不一致")
}
for (const docPath of allowedMarkdown) {
  if (!fs.existsSync(path.join(root, docPath))) errors.push(`Foundation Markdown 不存在: ${docPath}`)
}

const forbiddenSourceMarkers = ["@/pages/docs/components/", "@/pages/docs/governance/", "@/pages/templates/", "@/reports/", "docs/components/"]
for (const [name, source] of [["registry", registrySource], ["navigation", navigationSource], ["documents", documentsSource]]) {
  for (const marker of forbiddenSourceMarkers) {
    if (source.includes(marker)) errors.push(`Foundation ${name} 包含禁止来源: ${marker}`)
  }
}

for (const alias of ["page-registry-config", "site-navigation", "document-sources", "getting-started-page-adapter", "design-tokens-manifest-source", "component-tokens-manifest-source"]) {
  if (!viteSource.includes(alias)) errors.push(`Vite Foundation 构建缺少别名: ${alias}`)
}
if (!packageJson.scripts?.["build:foundation"]?.includes("--mode foundation") || !packageJson.scripts?.["preview:foundation"]) {
  errors.push("package.json 缺少 Foundation 独立构建或预览命令")
}

if (process.argv.includes("--artifact")) {
  const outputRoot = path.join(root, foundation.outputDirectory)
  if (!fs.existsSync(path.join(outputRoot, "index.html"))) {
    errors.push("Foundation 构建产物不存在，请先运行 npm run build:foundation")
  } else {
    const files = fs.readdirSync(outputRoot, { recursive: true }).map(String)
    if (files.some((file) => file.endsWith(".map"))) errors.push("Foundation 构建不得发布 source map")
    const bundle = files
      .filter((file) => /\.(?:html|js)$/.test(file))
      .map((file) => fs.readFileSync(path.join(outputRoot, file), "utf8"))
      .join("\n")
    const forbiddenArtifactMarkers = ["docs/components/", "component-playgrounds.manifest", "page-builder.manifest", "docs/pages/", "docs/data/governance"]
    for (const marker of forbiddenArtifactMarkers) {
      if (bundle.includes(marker)) errors.push(`Foundation 构建产物泄露禁止内容: ${marker}`)
    }
    for (const docPath of allowedMarkdown) {
      if (!bundle.includes(docPath)) errors.push(`Foundation 构建产物缺少 Markdown 入口: ${docPath}`)
    }
  }
}

if (errors.length) {
  console.error(`Foundation 发布配置发现 ${errors.length} 处问题：`)
  errors.forEach((error) => console.error(`ERROR: ${error}`))
  process.exit(1)
}

console.log(`publication profiles check passed: foundation=${allowedPages.size} pages / ${allowedMarkdown.size} Markdown documents${process.argv.includes("--artifact") ? " / artifact clean" : ""}`)

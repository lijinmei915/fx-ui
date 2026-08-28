#!/usr/bin/env node
// 从 FDS Foundation/Semantic portable contracts 自动生成 docs/data/design-tokens.json。
// 分工：本脚本负责"产出"，scripts/check-tokens-sync.sh 负责"校验"。
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const foundationPath = path.join(root, "theme/foundation.css")
const semanticPath = path.join(root, "theme/fds-semantic.css")
const entryPath = path.join(root, "theme/fx-theme.css")
const foundationContractPath = path.join(root, "docs/data/fds-foundation.manifest.json")
const semanticContractPath = path.join(root, "docs/data/fds-semantic.manifest.json")
const componentContractPath = path.join(root, "docs/data/fds-components.manifest.json")
const jsonPath = path.join(root, "docs/data/design-tokens.json")
const presetPath = path.join(root, "docs/data/theme-presets.manifest.json")

const foundationCss = fs.readFileSync(foundationPath, "utf8")
const semanticCss = fs.readFileSync(semanticPath, "utf8")
const entryCss = fs.readFileSync(entryPath, "utf8")
const foundationContract = JSON.parse(fs.readFileSync(foundationContractPath, "utf8"))
const semanticContract = JSON.parse(fs.readFileSync(semanticContractPath, "utf8"))
const componentContract = JSON.parse(fs.readFileSync(componentContractPath, "utf8"))
const manifest = JSON.parse(fs.readFileSync(jsonPath, "utf8"))
const presets = JSON.parse(fs.readFileSync(presetPath, "utf8"))

function rootBody(css, source) {
  const match = css.match(/:root\s*\{([\s\S]*?)\n\}/)
  if (match) return match[1]
  console.error(`ERROR: ${source} 找不到 :root token 块。`)
  process.exit(1)
}

const semanticRoot = rootBody(semanticCss, "theme/fds-semantic.css")
const entryRoot = rootBody(entryCss, "theme/fx-theme.css")

const normalize = (v) => String(v ?? "").trim().replace(/\s+/g, " ")

const colorFoundationPattern = /^--fx-(?:brand|brand-vivid|neutral-dark|seed-[\w-]+|(?:brand|red|green|amber|blue)-solid(?:-hover|-active)?|brand-(?:0[1-9]|1[0-2])|(?:orange|deep-orange|amber|yellow|lime|yellow-green|green|teal|cyan|light-blue|blue|indigo|purple|pink|magenta|red)-(?:0[1-9]|1[0-2])|neutrals-(?:0[1-9]|1\d|20))$/
const foundationGroups = [
  { id: "color", label: "Color", match: (name) => colorFoundationPattern.test(name) },
  { id: "spacing", label: "Spacing", prefix: "--fx-space-" },
  { id: "size", label: "Size", prefix: "--fx-size-" },
  { id: "font-family", label: "Font family", prefix: "--fx-font-family-" },
  { id: "font-size", label: "Font size", prefix: "--fx-font-size-" },
  { id: "line-height", label: "Line height", prefix: "--fx-line-height-" },
  { id: "font-weight", label: "Font weight", prefix: "--fx-font-weight-" },
  { id: "radius", label: "Radius", prefix: "--fx-radius-" },
  { id: "border-width", label: "Border width", prefix: "--fx-border-width-" },
  { id: "icon-stroke", label: "Icon stroke", prefix: "--fx-icon-stroke-" },
  { id: "opacity", label: "Opacity", prefix: "--fx-opacity-" },
  { id: "blur", label: "Blur", prefix: "--fx-blur-" },
  { id: "duration", label: "Duration", prefix: "--fx-duration-" },
  { id: "easing", label: "Easing", prefix: "--fx-ease-" },
  { id: "z-index", label: "Z-index", prefix: "--fx-z-" },
]

function foundationGroupFor(name) {
  return foundationGroups.find((group) => group.match?.(name) || group.prefix && name.startsWith(group.prefix))
}

// 保留旧 manifest 里已有的 category / usage 人工标注（按 name 匹配）
const meta = new Map()
for (const sec of ["primitive", "semantic"]) {
  for (const it of manifest[sec] || []) {
    meta.set(it.name, { category: it.category, usage: it.usage })
  }
}

const mk = (name, value, extra = {}) => {
  const m = meta.get(name) || {}
  const foundationGroup = foundationGroupFor(name)
  return {
    name,
    value,
    category: foundationGroup ? `foundation.${foundationGroup.id}` : m.category || (name.startsWith("--fx-") ? "alias" : "shadcn-semantic"),
    usage: m.usage || "",
    ...extra,
  }
}

const primitive = (foundationContract.tokens ?? []).map((token) => mk(token.name, token.value, {
  ...(token.legacyName ? { legacyName: token.legacyName } : {}),
  category: token.name.startsWith("--fds-g-color-")
    ? "foundation.color"
    : `foundation.${foundationGroupFor(token.legacyName)?.id ?? token.layer}`,
  resolvedValue: token.legacyValue ?? token.value,
  layer: token.layer,
  type: token.type,
  visibility: token.visibility,
  stability: token.stability,
}))
const semantic = []
for (const token of semanticContract.tokens ?? []) {
  semantic.push(mk(token.name, token.value, {
    id: token.id,
    layer: "semantic",
    type: token.type,
    visibility: token.visibility,
    stability: token.stability,
  }))
  for (const alias of token.aliases ?? []) {
    semantic.push(mk(alias, `var(${token.name})`, {
      fdsName: token.name,
      layer: "compatibility",
      type: token.type,
    }))
  }
}
const semanticByName = new Map((semanticContract.tokens ?? []).map((token) => [token.name, token]))
const semanticAliasToFds = new Map(
  (semanticContract.tokens ?? []).flatMap((token) =>
    (token.aliases ?? []).map((alias) => [alias, token.name])
  )
)
for (const alias of semanticContract.compatibility?.aliases ?? []) {
  const target = semanticByName.get(alias.target)
  semantic.push(mk(alias.name, `var(${alias.target})`, {
    fdsName: alias.target,
    layer: "compatibility",
    type: target?.type ?? "color",
  }))
}
for (const line of entryRoot.split("\n")) {
  const match = line.match(/^\s*(--[\w-]+):\s*([^;]+);/)
  if (!match || semantic.some((token) => token.name === match[1])) continue
  semantic.push(mk(match[1], normalize(match[2]), { layer: "runtime-structural" }))
}

manifest.primitive = primitive
manifest.semantic = semantic
manifest.interactionLadder = presets.interactionLadder
manifest.truthSource = "tokens/source/semantic.tokens.json"
manifest.truthSources = {
  primitive: "tokens/source/primitive.tokens.json",
  map: "tokens/source/map.tokens.json",
  foundationRuntime: "theme/foundation.css",
  semantic: "tokens/source/semantic.tokens.json",
  semanticRuntime: "theme/fds-semantic.css",
  component: "tokens/source/component.tokens.json",
  componentRuntime: "theme/fds-components.css",
  publicEntry: "theme/fx-theme.css",
}
manifest.componentHooks = {
  truthSource: "tokens/source/component.tokens.json",
  generatedRuntime: "theme/fds-components.css",
  portableContract: "docs/data/fds-components.manifest.json",
  access: "admission-required",
  count: componentContract.counts.tokens,
  admissions: componentContract.admissions,
  tokens: componentContract.tokens,
}
manifest.semanticContract = {
  truthSource: "tokens/source/semantic.tokens.json",
  generatedRuntime: "theme/fds-semantic.css",
  portableContract: "docs/data/fds-semantic.manifest.json",
  migrationPhase: foundationContract.migrationPhase,
  fdsTokenCount: semanticContract.counts.tokens,
  compatibilityAliasCount: semanticContract.counts.compatibilityAliases,
}
if (Array.isArray(manifest.typography?.componentOnlySizes)) {
  manifest.typography.componentOnlySizes = manifest.typography.componentOnlySizes.map((size) => ({
    ...size,
    fontSizeToken: semanticAliasToFds.get(size.fontSizeToken) ?? size.fontSizeToken,
    lineHeightToken: semanticAliasToFds.get(size.lineHeightToken) ?? size.lineHeightToken,
  }))
}
manifest.foundation = {
  truthSource: "tokens/source/primitive.tokens.json",
  mapTruthSource: "tokens/source/map.tokens.json",
  generatedRuntime: "theme/foundation.css",
  portableContract: "docs/data/fds-foundation.manifest.json",
  publicEntry: "theme/fx-theme.css",
  access: "maintainer-only",
  mutationPolicy: "Collaborators and agents may read foundation tokens but may not add, edit, or upload values. Changes require foundation-owner review.",
  consumptionPolicy: "Pages and product runtimes consume semantic roles or governed component APIs, never foundation tokens directly.",
  groups: foundationGroups.map(({ id, label }) => {
    const tokens = primitive.filter((token) => token.category === `foundation.${id}`)
    return { id, label, count: tokens.length, tokens: tokens.map((token) => token.name) }
  }),
  excluded: [
    "semantic roles and interaction intent",
    "component variants and component-specific measurements",
    "page-type and product-runtime roles",
    "breakpoints, grids, and runtime layout engines",
  ],
}
manifest.updatedAt = new Date().toISOString().slice(0, 10)

fs.writeFileSync(jsonPath, JSON.stringify(manifest, null, 2) + "\n")
console.log(`✅ 已重建 docs/data/design-tokens.json：primitive ${primitive.length}，semantic ${semantic.length}`)

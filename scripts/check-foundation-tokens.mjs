#!/usr/bin/env node
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const foundationPath = path.join(root, "theme/foundation.css")
const semanticPath = path.join(root, "theme/fds-semantic.css")
const entryPath = path.join(root, "theme/fx-theme.css")
const foundationContractPath = path.join(root, "docs/data/fds-foundation.manifest.json")
const manifestPath = path.join(root, "docs/data/design-tokens.json")
const mapSourcePath = path.join(root, "tokens/source/map.tokens.json")
const foundationCss = fs.readFileSync(foundationPath, "utf8")
const semanticCss = fs.readFileSync(semanticPath, "utf8")
const entryCss = fs.readFileSync(entryPath, "utf8")
const foundationContract = JSON.parse(fs.readFileSync(foundationContractPath, "utf8"))
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"))
const mapSource = JSON.parse(fs.readFileSync(mapSourcePath, "utf8"))
const errors = []

const parseRoot = (css) => new Map(
  [...(css.match(/:root\s*\{([\s\S]*?)\n\}/)?.[1] ?? "").matchAll(/^\s*(--[\w-]+):\s*([^;]+);/gm)]
    .map((match) => [match[1], match[2].trim().replace(/\s+/g, " ")])
)
const foundationVars = parseRoot(foundationCss)
const semanticVars = parseRoot(semanticCss)
const entryVars = parseRoot(entryCss)
const cssVars = new Map([...foundationVars, ...semanticVars, ...entryVars])

const expectedScales = {
  "--fds-g-spacing-": [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 80, 96],
  "--fds-g-sizing-": [12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 40, 42, 48, 56, 64],
  "--fds-g-font-size-": [12, 13, 14, 15, 16, 18, 20, 22, 24, 28, 30, 36, 44],
  "--fds-g-font-line-height-": [18, 20, 22, 24, 28, 30, 32, 36, 38, 40, 44, 52],
  "--fds-g-font-weight-": [400, 500, 600, 700],
  "--fds-g-radius-": [0, 2, 4, 6, 8, 12, 16],
  "--fds-g-border-width-": [0, 1, 2],
  "--fds-g-icon-stroke-": [150, 175, 200],
  "--fds-g-opacity-": [0, 3, 5, 6, 8, 10, 12, 18, 20, 22, 25, 40, 50, 60, 75, 80, 90, 100],
  "--fds-g-blur-": [0, 2, 4, 8, 12, 16, 24, 40],
  "--fds-g-motion-duration-": [0, 75, 100, 150, 200, 300, 500, 700, 1000],
  "--fds-g-z-index-": [0, 10, 20, 30, 40, 50],
}

for (const [prefix, steps] of Object.entries(expectedScales)) {
  const expected = steps.map((step) => `${prefix}${step}`)
  const actual = [...foundationVars.keys()].filter((name) => expected.includes(name)).sort()
  const sortedExpected = [...expected].sort()
  if (JSON.stringify(actual) !== JSON.stringify(sortedExpected)) {
    errors.push(`${prefix} 刻度不完整：expected ${sortedExpected.join(", ")}；actual ${actual.join(", ")}`)
  }
}

const foundationTokenByName = new Map((foundationContract.tokens ?? []).map((token) => [token.name, token]))
if (mapSource.brand?.base?.stepsSource !== "palette.steps" || mapSource.brand?.base?.seed !== "color.seed.brand") {
  errors.push("Brand Base 必须从 color.seed.brand 复用 palette.steps，不得维护第二套色阶公式")
}
for (const step of mapSource.palette?.steps ?? []) {
  const brand = foundationTokenByName.get(`--fds-g-color-brand-base-${step.range}`)?.value
  const orange = foundationTokenByName.get(`--fds-g-color-orange-base-${step.range}`)?.value
  const normalizeSeed = (value) => value
    ?.replaceAll("var(--fds-g-color-seed-brand)", "{seed}")
    .replaceAll("var(--fds-g-color-seed-orange)", "{seed}")
  if (!brand || normalizeSeed(brand) !== normalizeSeed(orange)) {
    errors.push(`Brand Base ${step.range} 必须与通用 Base 公式一致`)
  }
}
const radiusExpectedValues = new Map([
  ["--fds-g-radius-0", "0px"],
  ["--fds-g-radius-2", "2px"],
  ["--fds-g-radius-4", "4px"],
  ["--fds-g-radius-6", "6px"],
  ["--fds-g-radius-8", "8px"],
  ["--fds-g-radius-12", "12px"],
  ["--fds-g-radius-16", "16px"],
])
const radiusSeed = foundationTokenByName.get("--fds-g-radius-seed-base")
if (radiusSeed?.layer !== "primitive" || radiusSeed?.value !== "8px") errors.push("圆角 Seed 必须是 8px Primitive")
for (const [name, value] of radiusExpectedValues) {
  const token = foundationTokenByName.get(name)
  if (token?.layer !== "map" || token?.value !== value || token?.type !== "dimension" || token?.derivation?.seed !== "radius.seed.base") {
    errors.push(`${name} 必须是由 radius.seed.base 生成的 ${value} Dimension Map`)
  }
}
const radiusFull = foundationTokenByName.get("--fds-g-radius-full")
if (radiusFull?.layer !== "primitive" || radiusFull?.value !== "9999px") errors.push("radius-full 必须保持 9999px 固定 Primitive")

for (const name of ["--fds-g-font-family-sans", "--fds-g-font-family-serif", "--fds-g-font-family-mono", "--fds-g-font-family-geometric", "--fds-g-radius-seed-base", "--fds-g-radius-full", "--fds-g-motion-easing-linear", "--fds-g-motion-easing-in", "--fds-g-motion-easing-out", "--fds-g-motion-easing-in-out"]) {
  if (!cssVars.has(name)) errors.push(`缺少基础 Token ${name}`)
}

const foundationNames = new Set((manifest.foundation?.groups ?? []).flatMap((group) => group.tokens ?? []))
const manifestNames = new Set((manifest.primitive ?? []).filter((token) => token.category?.startsWith("foundation.")).map((token) => token.name))
if (manifest.foundation?.access !== "maintainer-only") errors.push("foundation.access 必须是 maintainer-only")
if (manifest.foundation?.truthSource !== "tokens/source/primitive.tokens.json") errors.push("foundation.truthSource 必须指向 DTCG Primitive source")
if (manifest.foundation?.mapTruthSource !== "tokens/source/map.tokens.json") errors.push("foundation.mapTruthSource 必须指向 Map contract")
if (manifest.foundation?.generatedRuntime !== "theme/foundation.css") errors.push("foundation.generatedRuntime 必须指向生成后的 theme/foundation.css")
if (manifest.foundation?.portableContract !== "docs/data/fds-foundation.manifest.json") errors.push("foundation.portableContract 必须指向 FDS Foundation contract")
if (manifest.foundation?.publicEntry !== "theme/fx-theme.css") errors.push("foundation.publicEntry 必须指向 theme/fx-theme.css")
if (JSON.stringify([...foundationNames].sort()) !== JSON.stringify([...manifestNames].sort())) {
  errors.push("foundation.groups 与 primitive 的 foundation.* 分类不一致，请运行 npm run build:tokens")
}

const forbiddenIntent = /(?:dashboard|report|workbench|button|input|table|sidebar|topbar|control|primary|danger|success|warning|info)/
const contractLegacyNames = new Set((foundationContract.tokens ?? []).map((token) => token.legacyName).filter(Boolean))
const contractFdsNames = new Set((foundationContract.tokens ?? []).map((token) => token.name))
for (const name of foundationNames) {
  if (forbiddenIntent.test(name)) errors.push(`基础 Token 含用途语义：${name}`)
  if (!foundationVars.has(name)) errors.push(`基础 Token 未声明在 theme/foundation.css：${name}`)
  if (semanticVars.has(name)) errors.push(`基础 Token 不得在 theme/fx-theme.css 重复定义：${name}`)
}
for (const name of foundationVars.keys()) {
  if (!contractLegacyNames.has(name) && !contractFdsNames.has(name)) errors.push(`theme/foundation.css 混入非 Foundation Token：${name}`)
}

if (!entryCss.includes('@import "./foundation.css";')) errors.push("theme/fx-theme.css 必须通过固定入口导入 ./foundation.css")
if (!entryCss.includes('@import "./fds-semantic.css";')) errors.push("theme/fx-theme.css 必须通过固定入口导入 ./fds-semantic.css")

const requiredMappings = {
  "--radius": "var(--fds-g-radius-8)",
  "--radius-inner": "var(--fds-g-radius-4)",
  "--radius-element": "var(--fds-g-radius-6)",
  "--radius-container": "var(--fds-g-radius-12)",
  "--radius-page": "var(--fds-g-radius-16)",
  "--overlay-blur": "var(--fds-g-blur-overlay)",
  "--font-sans": "var(--fds-g-font-family-sans)",
  "--fx-text-control-sm": "var(--fds-g-font-size-control-sm)",
  "--fx-text-control-sm--line-height": "var(--fds-g-font-line-height-control-sm)",
}
for (const [name, expected] of Object.entries(requiredMappings)) {
  if (cssVars.get(name) !== expected) errors.push(`${name} 应等值映射 ${expected}，当前为 ${cssVars.get(name) ?? "missing"}`)
}

const directUsePattern = /var\(--(?:fx-(?:space|size|font-size|line-height|font-weight|radius|border-width|icon-stroke|opacity|blur|duration|ease|z)|fds-g-(?:spacing|sizing|font-size|font-line-height|font-weight|radius|border-width|icon-stroke|opacity|blur|motion-duration|motion-easing|z-index))-/g
for (const relativeDir of ["src/pages", "src/reports", "src/components/recipes"]) {
  const directory = path.join(root, relativeDir)
  if (!fs.existsSync(directory)) continue
  const stack = [directory]
  while (stack.length) {
    const current = stack.pop()
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const file = path.join(current, entry.name)
      if (entry.isDirectory()) stack.push(file)
      else if (/\.(?:ts|tsx|css)$/.test(entry.name)) {
        const content = fs.readFileSync(file, "utf8")
        if (directUsePattern.test(content)) errors.push(`${path.relative(root, file)} 直接消费无语义基础 Token；请改用语义角色或受治理 API`)
        directUsePattern.lastIndex = 0
      }
    }
  }
}

if (errors.length) {
  console.error(`Result: foundation-tokens 发现 ${errors.length} 处问题：`)
  for (const error of errors) console.error(`ERROR: ${error}`)
  process.exit(1)
}

console.log(`foundation-tokens check passed: ${foundationNames.size} 个只读基础 Token，15 个类别。`)

#!/usr/bin/env node
// 校验右侧目录(TOC)与内容「双向」关联：
//  ① 正向：每个 *Anchors 数组里的 href:"#xxx" 必须有真实 id（防死链）
//  ② 反向：每个模块标题（<h2 className="text-2xl font-semibold">）必须挂在带 id 的容器上（防漏进目录）
// id 来源：字面 id="xxx"、数据里的 id:"xxx"（如 id={group.id}）、StandardDocPage 由 slug 生成的小节 id。
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
function collectPageModuleSources(directory) {
  if (!fs.existsSync(directory)) return []
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const sourcePath = path.join(directory, entry.name)
    if (entry.isDirectory()) return collectPageModuleSources(sourcePath)
    return entry.name.endsWith("-page.tsx") ? [fs.readFileSync(sourcePath, "utf8")] : []
  })
}

const pageModuleSources = [
  ...collectPageModuleSources(path.join(root, "src/lib")),
  ...collectPageModuleSources(path.join(root, "src/pages/docs")),
]
const src = [fs.readFileSync(path.join(root, "src/App.tsx"), "utf8"), ...pageModuleSources].join("\n")
const lines = src.split("\n")
const errors = []

// 1) 收集真实 id：字面 id="..."、数据 id:"..."
const knownIds = new Set([
  ...[...src.matchAll(/id="([^"]+)"/g)].map((m) => m[1]),
  ...[...src.matchAll(/\bid:\s*"([^"]+)"/g)].map((m) => m[1]),
])
// 2) StandardDocPage 由 slug 生成的 id：{slug} 及固定小节（-playground 为可选槽，传 playground 时才渲染）
const stdSuffixes = ["", "-playground", "-overview", "-preview", "-usage", "-props", "-semantic-dom", "-do-dont"]
for (const m of src.matchAll(/slug="([^"]+)"/g)) {
  for (const suf of stdSuffixes) knownIds.add(m[1] + suf)
}

// ① 正向：anchors → id
const anchorBlocks = [...src.matchAll(/const\s+(\w*Anchors)\s*=\s*\[([\s\S]*?)\]/g)]
let checked = 0
for (const [, name, body] of anchorBlocks) {
  for (const h of body.matchAll(/href:\s*"#([^"]+)"/g)) {
    checked++
    if (!knownIds.has(h[1])) {
      errors.push(`正向：${name} 的锚点 #${h[1]} 没有对应内容 id（死链）——给目标小节加 id 或修正 href`)
    }
  }
}

// ② 反向：多模块页的「目录 = 模块」对账（curated，避免动态渲染误报）。
// 每个列出的页面：其 *Anchors 的 href 目标集合，必须与下面声明的模块 id 集合完全一致。
// 新增模块/页面时，既要在页面加 id，又要更新 *Anchors 和这张表，三者对齐才过。
const pageModules = {
  tokenTypographyAnchors: ["tokens-typography-roles", "tokens-typography-size", "tokens-typography-weight", "tokens-typography-family"],
  tokenRadiusAnchors: ["tokens-radius-scale", "tokens-radius-compute"],
  tokenShadowAnchors: ["tokens-shadow-scale", "tokens-shadow-compute"],
  tokenSpacingAnchors: ["tokens-spacing-scale", "tokens-spacing-compute"],
  tokenMotionAnchors: ["tokens-motion-duration", "tokens-motion-primitives"],
  tokenLayerAnchors: ["tokens-layer-scale", "tokens-layer-logic"],
  gridAnchors: ["grid-system", "grid-breakpoints"],
  layoutAnchors: ["layout-containers"],
}
for (const [name, expected] of Object.entries(pageModules)) {
  const block = anchorBlocks.find(([, n]) => n === name)
  if (!block) {
    errors.push(`反向：找不到目录数组 ${name}`)
    continue
  }
  const got = [...block[2].matchAll(/href:\s*"#([^"]+)"/g)].map((m) => m[1])
  const missingInToc = expected.filter((id) => !got.includes(id))
  const extraInToc = got.filter((id) => !expected.includes(id))
  const missingId = expected.filter((id) => !knownIds.has(id))
  if (missingInToc.length) errors.push(`反向：${name} 漏了模块 ${missingInToc.join(", ")}（页面有该模块、目录里没有）`)
  if (extraInToc.length) errors.push(`反向：${name} 多了锚点 ${extraInToc.join(", ")}（目录有、模块清单未声明）`)
  if (missingId.length) errors.push(`反向：${name} 的模块 id 在页面不存在：${missingId.join(", ")}（请给对应 section/div 加 id）`)
}

if (errors.length > 0) {
  console.error(`Result: toc-anchors 发现 ${errors.length} 处问题：`)
  for (const e of errors) console.error(`ERROR: ${e}`)
  process.exit(1)
}
console.log(`toc-anchors check passed: ${anchorBlocks.length} 组目录 / ${checked} 个锚点正向关联，${Object.keys(pageModules).length} 个多模块页目录=模块对账一致。`)

#!/usr/bin/env node
// 从 theme/fx-theme.css 的 :root 块自动生成 docs/data/design-tokens.json。
// fx-theme.css 是唯一真相源——改完 CSS 跑 `npm run build:tokens` 重新生成，不要手抄 JSON。
// 分工：本脚本负责"产出"，scripts/check-tokens-sync.sh 负责"校验"。
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const cssPath = path.join(root, "theme/fx-theme.css")
const jsonPath = path.join(root, "docs/data/design-tokens.json")

const css = fs.readFileSync(cssPath, "utf8")
const manifest = JSON.parse(fs.readFileSync(jsonPath, "utf8"))

const rootMatch = css.match(/:root\s*\{([\s\S]*?)\n\}/)
if (!rootMatch) {
  console.error("ERROR: theme/fx-theme.css 找不到 :root token 块。")
  process.exit(1)
}

const normalize = (v) => String(v ?? "").trim().replace(/\s+/g, " ")

// 解析 :root 里所有 --var: value;
const vars = []
for (const line of rootMatch[1].split("\n")) {
  const m = line.match(/^\s*(--[\w-]+):\s*([^;]+);/)
  if (m) vars.push([m[1], normalize(m[2])])
}

// 保留旧 manifest 里已有的 category / usage 人工标注（按 name 匹配）
const meta = new Map()
for (const sec of ["primitive", "semantic"]) {
  for (const it of manifest[sec] || []) {
    meta.set(it.name, { category: it.category, usage: it.usage })
  }
}

const mk = (name, value) => {
  const m = meta.get(name) || {}
  return {
    name,
    value,
    category: m.category || (name.startsWith("--fx-") ? "palette" : "shadcn-semantic"),
    usage: m.usage || "",
  }
}

const primitive = []
const semantic = []
for (const [name, value] of vars) {
  if (name.startsWith("--color-")) continue   // @theme inline 映射不在 :root，跳过
  if (name.startsWith("--fx-")) primitive.push(mk(name, value))
  else semantic.push(mk(name, value))
}

manifest.primitive = primitive
manifest.semantic = semantic
manifest.updatedAt = new Date().toISOString().slice(0, 10)

fs.writeFileSync(jsonPath, JSON.stringify(manifest, null, 2) + "\n")
console.log(`✅ 已重建 docs/data/design-tokens.json：primitive ${primitive.length}，semantic ${semantic.length}`)

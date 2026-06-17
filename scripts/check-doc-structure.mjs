#!/usr/bin/env node
// 校验治理文档的「章节契约 + 职责唯一」，真相源 docs/data/doc-structure.manifest.json。
// ① 覆盖：每个治理文档（docs/*.md + AGENTS/PROJECT/HANDOFF/PRODUCT）必须在 manifest 里，且仅一条
// ② 职责唯一：responsibility 不得重复（路由打架）
// ③ 章节完整：requiredSections 必须作为 "## ..." 标题出现（防 AI 产出残缺）
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const manifestPath = path.join(root, "docs/data/doc-structure.manifest.json")
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"))
const errors = []

if (manifest.format !== "fx-ui/doc-structure") {
  errors.push(`format 应为 fx-ui/doc-structure，当前 ${manifest.format}`)
}

const entries = manifest.docs ?? []
const byPath = new Map()
const responsibilities = new Map()

for (const e of entries) {
  if (!e.path || typeof e.responsibility !== "string" || !e.responsibility.trim()) {
    errors.push(`doc 条目缺少 path 或 responsibility：${JSON.stringify(e)}`)
    continue
  }
  if (byPath.has(e.path)) errors.push(`${e.path} 在 manifest 中重复声明`)
  byPath.set(e.path, e)

  if (responsibilities.has(e.responsibility)) {
    errors.push(`responsibility 重复（路由打架）："${e.responsibility}" 同时属于 ${responsibilities.get(e.responsibility)} 和 ${e.path}`)
  } else {
    responsibilities.set(e.responsibility, e.path)
  }

  const abs = path.join(root, e.path)
  if (!fs.existsSync(abs)) {
    errors.push(`${e.path} 在 manifest 里声明，但文件不存在`)
    continue
  }
  const headings = fs.readFileSync(abs, "utf8")
    .split("\n").filter(l => l.startsWith("## ")).map(l => l.slice(3).trim())
  for (const sec of e.requiredSections ?? []) {
    if (!headings.some(h => h.includes(sec))) {
      errors.push(`${e.path} 缺少必备章节（## 标题需含 "${sec}"）`)
    }
  }
}

// 覆盖：实际治理文档都要登记（避免漏登记 = 孤岛）
const govDocs = [
  ...fs.readdirSync(path.join(root, "docs")).filter(f => f.endsWith(".md")).map(f => `docs/${f}`),
  ...["AGENTS.md", "PROJECT.md", "HANDOFF.md", "PRODUCT.md"].filter(f => fs.existsSync(path.join(root, f))),
]
for (const d of govDocs) {
  if (!byPath.has(d)) errors.push(`${d} 没有在 doc-structure.manifest.json 里声明职责和章节（孤岛/漏登记）`)
}

if (errors.length > 0) {
  console.error(`Result: doc-structure 发现 ${errors.length} 处问题：`)
  for (const e of errors) console.error(`ERROR: ${e}`)
  process.exit(1)
}
console.log(`doc-structure check passed: ${entries.length} 个治理文档，章节齐全、职责唯一。`)

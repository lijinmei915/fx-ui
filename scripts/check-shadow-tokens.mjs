#!/usr/bin/env node
// 校验浮层阴影只用公司档，不用 Tailwind 内置浮层档。
// 规则（见 docs/TOKENS.md 阴影、docs/DOC_SITE_DESIGN.md）：
//  - 浮层/弹层必须用 shadow-l1 / shadow-l2 / shadow-l3 / shadow-l1-up（映射 FDS Semantic shadow，跟随主题）
//  - 禁用 Tailwind 内置浮层档 shadow-md / shadow-lg / shadow-xl / shadow-2xl（另一套数值、不跟随公司变量，会漂）
//  - 允许 shadow-sm / shadow-none（非浮层的微抬升）和 shadow-[...]（一次性自定义）
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const banned = ["shadow-md", "shadow-lg", "shadow-xl", "shadow-2xl"]
const errors = []

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name)
    const stat = fs.statSync(p)
    if (stat.isDirectory()) walk(p)
    else if (/\.(tsx?|jsx?)$/.test(name)) scan(p)
  }
}

function scan(file) {
  const lines = fs.readFileSync(file, "utf8").split("\n")
  lines.forEach((line, i) => {
    // 跳过注释行，避免文档性提及被误报
    const trimmed = line.trim()
    if (trimmed.startsWith("//") || trimmed.startsWith("*")) return
    for (const cls of banned) {
      // 作为完整 class（前后是边界）出现才算
      const re = new RegExp(`(^|[\\s"'\`])${cls}([\\s"'\`:]|$)`)
      if (re.test(line)) {
        errors.push(`${path.relative(root, file)}:${i + 1} 使用了禁用的浮层阴影 ${cls} —— 浮层请改用 shadow-l1/l2/l3/l1-up`)
      }
    }
  })
}

walk(path.join(root, "src"))

if (errors.length > 0) {
  console.error(`Result: shadow-tokens 发现 ${errors.length} 处问题：`)
  for (const e of errors) console.error(`ERROR: ${e}`)
  process.exit(1)
}
console.log("shadow-tokens check passed: 浮层阴影全部使用公司档（无 Tailwind md/lg/xl/2xl）。")

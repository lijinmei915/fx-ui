#!/usr/bin/env node
// 校验组件交互态颜色走色板/语义 token，不靠 /透明度 或 color-mix（DEC-005）。
// 禁：浅色态的 bg-{色}/N、border-{色}/N、color-mix。
// 允许：dark:（暗色以后另定）、focus-visible:/aria-invalid:（无障碍焦点环，惯例用透明度）、ring-*。
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const dirs = ["src/components/ui", "src/components/fx"]
const allowVariants = new Set(["dark", "focus-visible", "aria-invalid"])
const errors = []

function scan(file) {
  const text = fs.readFileSync(file, "utf8")
  // 按空白和引号切出 class token
  for (const raw of text.split(/[\s"'`]+/)) {
    if (raw.includes("color-mix")) {
      errors.push(`${path.relative(root, file)}: 用了 color-mix「${raw}」——交互态请取色板阶/语义 token`)
      continue
    }
    const parts = raw.split(":")
    const util = parts.pop()
    const variants = parts
    if (!/^(bg|border)-[a-z]+\/[0-9]+$/.test(util)) continue
    if (variants.some((v) => allowVariants.has(v))) continue
    errors.push(`${path.relative(root, file)}: 浅色态透明度填充「${raw}」——请改用实心 token（如 bg-muted / bg-destructive-light / border-border-subtle）`)
  }
}

for (const d of dirs) {
  const abs = path.join(root, d)
  if (!fs.existsSync(abs)) continue
  for (const f of fs.readdirSync(abs)) {
    if (/\.(tsx?|jsx?)$/.test(f)) scan(path.join(abs, f))
  }
}

if (errors.length > 0) {
  console.error(`Result: interaction-tokens 发现 ${errors.length} 处问题：`)
  for (const e of errors) console.error(`ERROR: ${e}`)
  process.exit(1)
}
console.log("interaction-tokens check passed: 组件浅色交互态无 /透明度、无 color-mix。")

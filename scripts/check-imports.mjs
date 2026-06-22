#!/usr/bin/env node
// 通用「导入约定」守卫：集中管理"禁止/受限 import"的清单，一个脚本管一类。
// 以后再有别的禁用 import，往 banned 里加一条即可，不要再单独造脚本。
// 当前规则：
//  - 图标必须从 @/lib/icons 导入（底层 Tabler），不许业务/组件直连 @tabler/icons-react（shim 自己除外）。
//  - 旧图标库 lucide-react / @phosphor-icons/react 已迁走，禁止任何残留 import。
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

const banned = [
  { module: "@tabler/icons-react", allow: ["src/lib/icons.ts"], reason: "图标统一从 @/lib/icons 导入（见 DEC-009 / AGENTS）" },
  { module: "lucide-react", allow: [], reason: "已迁移 Tabler，禁止残留" },
  { module: "@phosphor-icons/react", allow: [], reason: "已迁移 Tabler，禁止残留" },
]

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
  const rel = path.relative(root, file)
  const text = fs.readFileSync(file, "utf8")
  // 只匹配真实 import 语句的来源（import ... from "mod" / import "mod"），不碰字符串里提到的包名
  const sources = [...text.matchAll(/^\s*import\b[^\n]*?["']([^"']+)["']/gm)].map((m) => m[1])
  for (const b of banned) {
    if (sources.includes(b.module) && !b.allow.includes(rel)) {
      errors.push(`${rel}: 禁止 import "${b.module}" —— ${b.reason}`)
    }
  }
}
walk(path.join(root, "src"))

if (errors.length > 0) {
  console.error(`Result: imports 发现 ${errors.length} 处违规导入：`)
  for (const e of errors) console.error(`ERROR: ${e}`)
  process.exit(1)
}
console.log(`imports check passed: 无违规导入（图标走 @/lib/icons，无旧图标库残留）。`)

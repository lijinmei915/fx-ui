#!/usr/bin/env node
// 校验组件文档页的 API 属性表「有属性、且每个属性带类型」。
// 组件页和 token 页的核心区别：组件必须讲清可配置 prop 及其 type（见 docs/DOC_SITE_DESIGN.md「组件文档页结构」）。
// 规则：App 装配文件和页面模块里的每个 const xxxPropRows = [...]——
//   ① 非空；② prop 条数 == type 条数（不能有属性名却没类型）。
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
function collectSourceFiles(directory) {
  if (!fs.existsSync(directory)) return []
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const sourcePath = path.join(directory, entry.name)
    if (entry.isDirectory()) return collectSourceFiles(sourcePath)
    return /\.(ts|tsx)$/.test(entry.name) ? [sourcePath] : []
  })
}

const sourceFiles = [
  path.join(root, "src/App.tsx"),
  ...collectSourceFiles(path.join(root, "src/lib")),
  ...collectSourceFiles(path.join(root, "src/pages/docs")),
]
const src = sourceFiles.map((file) => fs.readFileSync(file, "utf8")).join("\n")
const errors = []

// 抓 const ...propRows = [ ... ];，允许格式化后数组结尾变成 `}]` / `}];`。
const blocks = [...src.matchAll(/(?:const|export\s+const)\s+(\w*[Pp]ropRows)\s*(?::[^=]+)?=\s*\[([\s\S]*?)\]\s*;?/g)]
let checked = 0
for (const [, name, body] of blocks) {
  const props = (body.match(/\bprop:/g) || []).length
  const types = (body.match(/\btype:/g) || []).length
  checked++
  if (props === 0) {
    errors.push(`${name} 是空的 API 表——组件页必须列出可配置属性`)
  } else if (types !== props) {
    errors.push(`${name} 有 ${props} 个属性但只有 ${types} 个 type——每个属性都要带类型`)
  }
}

if (blocks.length === 0) {
  errors.push("没找到任何 *PropRows API 表，检查可能失效")
}

if (errors.length > 0) {
  console.error(`Result: component-docs 发现 ${errors.length} 处问题：`)
  for (const e of errors) console.error(`ERROR: ${e}`)
  process.exit(1)
}
console.log(`component-docs check passed: ${checked} 张组件 API 表均非空且属性都带类型。`)

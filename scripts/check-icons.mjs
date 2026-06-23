// 图标注册表校验：保证 docs/data/icons.manifest.json 与 @/lib/icons 出口一致，
// 这样 AI 才能"按名字+keywords 检索 → import 取用"而不至于引用到不存在的图标。
import { readFile } from "node:fs/promises"

const root = new URL("../", import.meta.url)
const read = (p) => readFile(new URL(p, root), "utf8")
const errors = []

const manifest = JSON.parse(await read("docs/data/icons.manifest.json"))
const iconsSource = await read("src/lib/icons.ts")
const customSource = await read("src/lib/icons-custom.tsx")

if (manifest.format !== "fx-ui/icons-manifest") {
  errors.push("icons manifest format must be fx-ui/icons-manifest")
}

// @/lib/icons 出口的全部名字：Tabler 别名（`as XxxIcon,`）+ 自定义 re-export（`export { A, B } from "@/lib/icons-custom"`）。
const exportedNames = new Set()
for (const m of iconsSource.matchAll(/as\s+(\w+Icon)\s*,/g)) exportedNames.add(m[1])
for (const m of iconsSource.matchAll(/export\s*\{([^}]*)\}\s*from\s*"@\/lib\/icons-custom"/g)) {
  for (const name of m[1].split(",").map((s) => s.trim()).filter(Boolean)) exportedNames.add(name)
}

// 自定义图标在 icons-custom.tsx 里实际定义的组件名。
const customDefined = new Set([...customSource.matchAll(/export\s+const\s+(\w+Icon)\s*=/g)].map((m) => m[1]))

const sourceIds = new Set((manifest.sources ?? []).map((s) => s.id))
const styles = new Set(manifest.styles ?? [])
const seen = new Set()

for (const icon of manifest.icons ?? []) {
  const where = icon.name ?? "(unnamed)"
  for (const field of ["name", "source", "style", "category", "keywords"]) {
    if (icon[field] === undefined || (Array.isArray(icon[field]) && icon[field].length === 0)) {
      errors.push(`icon "${where}" 缺少字段：${field}`)
    }
  }
  if (icon.name && !/^[A-Z]\w*Icon$/.test(icon.name)) errors.push(`icon "${where}" 命名应为 PascalCase + Icon 结尾`)
  if (icon.name && seen.has(icon.name)) errors.push(`icon name 重复：${icon.name}`)
  if (icon.name) seen.add(icon.name)

  if (icon.style && !styles.has(icon.style)) errors.push(`icon "${where}" style 非法：${icon.style}`)

  const baseSource = (icon.source ?? "").split(":")[0]
  if (baseSource && !sourceIds.has(baseSource)) errors.push(`icon "${where}" source 未在 sources 声明：${icon.source}`)

  // 每个登记的图标都必须能从 @/lib/icons 解析出来。
  if (icon.name && !exportedNames.has(icon.name)) {
    errors.push(`icon "${icon.name}" 未从 @/lib/icons 出口（注册表与源码漂移）`)
  }
  // 自定义图标必须真的在 icons-custom.tsx 里定义。
  if (icon.source === "custom" && icon.name && !customDefined.has(icon.name)) {
    errors.push(`自定义 icon "${icon.name}" 未在 src/lib/icons-custom.tsx 中定义`)
  }
}

// 自定义图标必须用 currentColor（颜色跟随 token），且不得写死十六进制色值。
if (/fill="#|stroke="#|fill:\s*#|stroke:\s*#/.test(customSource)) {
  errors.push("src/lib/icons-custom.tsx 含写死色值（#xxxxxx）——自定义图标必须用 currentColor")
}
if (!/currentColor/.test(customSource)) {
  errors.push("src/lib/icons-custom.tsx 未使用 currentColor")
}

if (errors.length > 0) {
  console.error("icons manifest check FAILED:")
  for (const e of errors) console.error("  - " + e)
  process.exit(1)
}

console.log(`icons manifest check passed: ${manifest.icons.length} icons registered（${[...sourceIds].join(" / ")} 来源），名字均能从 @/lib/icons 解析，自定义图标用 currentColor。`)

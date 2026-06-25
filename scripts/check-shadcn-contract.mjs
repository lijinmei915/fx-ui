import { readFile } from "node:fs/promises"

const root = new URL("../", import.meta.url)

async function read(path) {
  return readFile(new URL(path, root), "utf8")
}

function extractVariantKeys(source, groupName) {
  const groupStart = source.indexOf(`${groupName}: {`)
  if (groupStart === -1) {
    throw new Error(`Cannot find ${groupName} variants`)
  }

  const nextGroup = source.indexOf("\n      },", groupStart)
  const groupSource = source.slice(groupStart, nextGroup)

  return [...groupSource.matchAll(/^\s{8}(?:"([^"]+)"|([a-z][\w-]*)):\s/mg)].map(
    (match) => match[1] ?? match[2]
  )
}

function assertIncludes(source, values, label, errors) {
  for (const value of values) {
    if (!source.includes(value)) {
      errors.push(`${label} is missing "${value}"`)
    }
  }
}

const [buttonSource, appSource, buttonDocs] = await Promise.all([
  read("src/components/ui/button.tsx"),
  read("src/App.tsx"),
  read("docs/components/button.md"),
])

const errors = []
const variants = extractVariantKeys(buttonSource, "variant")
const sizes = extractVariantKeys(buttonSource, "size")

assertIncludes(
  appSource,
  variants.map((variant) => (variant === "default" ? "<Button>{lang === \"en\" ? \"Save\" : \"保存\"}</Button>" : `variant="${variant}"`)),
  "Button overview",
  errors
)
assertIncludes(
  appSource,
  sizes.filter((size) => size !== "default").map((size) => `size="${size}"`),
  "Button overview",
  errors
)
assertIncludes(buttonDocs, variants, "Button Markdown variants", errors)
assertIncludes(buttonDocs, sizes, "Button Markdown sizes", errors)

const requiredStateContracts = [
  ["Button source", buttonSource, "focus-visible"],
  ["Button source", buttonSource, "active:"],
  ["Button source", buttonSource, "aria-expanded"],
  ["Button source", buttonSource, "disabled:"],
  ["Button source", buttonSource, "aria-invalid"],
  ["Button overview", appSource, "交互状态"],
  ["Button overview", appSource, "<Spinner"],
  ["Button overview", appSource, "禁用"],
  ["Button Markdown", buttonDocs, "disabled"],
  ["Button Markdown", buttonDocs, "Spinner"],
  ["Button Markdown", buttonDocs, "aria-invalid"],
]

for (const [label, source, value] of requiredStateContracts) {
  if (!source.includes(value)) {
    errors.push(`${label} is missing "${value}"`)
  }
}

// 组件总览小标题 ↔ 场景示例 tab 一一对应（DOC_SITE_DESIGN「组件总览」规则）。
// 以 Button 为标杆校验：ButtonOverview 的 h3 小标题集合 == buttonScenarioFilters 的 tab 集合（带别名）。
{
  const ovStart = appSource.indexOf("function ButtonOverview(")
  const ovEnd = appSource.indexOf("\nfunction ", ovStart + 1)
  const ovSource = appSource.slice(ovStart, ovEnd)
  // 取每个 h3 的中文标题（"En" : "中文" 形式）
  const ovHeaders = [...ovSource.matchAll(/<h3[^>]*>\{lang === "en" \? "[^"]+" : "([^"]+)"\}<\/h3>/g)].map((m) => m[1])

  const filterStart = appSource.indexOf("const buttonScenarioFilters")
  const arrStart = appSource.indexOf("= [", filterStart)
  const filterEnd = appSource.indexOf("\n]", arrStart)
  const filterSource = appSource.slice(arrStart, filterEnd)
  const tabLabels = [...filterSource.matchAll(/label:\s*"([^"]+)"/g)].map((m) => m[1])

  // 别名：总览用「交互状态」，tab 用「状态」，视为同一概念
  const norm = (s) => (s === "交互状态" ? "状态" : s)
  const ovSet = new Set(ovHeaders.map(norm))
  const tabSet = new Set(tabLabels.map(norm))
  for (const t of tabSet) if (!ovSet.has(t)) errors.push(`Button 总览缺少与场景 tab「${t}」对应的小标题块`)
  for (const h of ovSet) if (!tabSet.has(h)) errors.push(`Button 总览小标题「${h}」在场景示例里没有对应 tab`)
}

// 「用法」列场景名同组同格式：Button「类型」tab(group: "category") 的中文 title 须全部以「操作」结尾。
{
  const exStart = appSource.indexOf("const buttonScenarioExamples")
  const exEnd = appSource.indexOf("\n] as const", exStart)
  const exSource = appSource.slice(exStart, exEnd)
  // 拆成各场景对象，取 group=category 的 title
  for (const block of exSource.split(/\n  \{/)) {
    if (!/group:\s*"category"/.test(block)) continue
    const m = block.match(/title:\s*"([^"]+)"/)
    if (m && !m[1].endsWith("操作")) {
      errors.push(`Button「类型」tab 场景名「${m[1]}」格式不统一（同组应以「操作」结尾）`)
    }
  }
}

if (errors.length > 0) {
  console.error("shadcn contract check failed:\n")
  for (const error of errors) {
    console.error(`- ${error}`)
  }
  process.exitCode = 1
} else {
  console.log(
    `shadcn contract check passed: Button has ${variants.length} variants, ${sizes.length} sizes, source interaction feedback, and documented interaction states.`
  )
}

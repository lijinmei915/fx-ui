// 组件体检硬伤检查（DESIGN_STANDARDS「组件体检清单」第 6/7 条的机器化）。
// 精确抓确定违规，baseline 豁免存量，行内 `hygiene-ignore` 放行合法例外。
// 新增/改动若引入清单外的违规 → ❌ fail；存量按体检节奏从 baseline 移除。
import { readFile, readdir } from "node:fs/promises"
import { join } from "node:path"

const UI_DIR = "src/components/ui"
const rules = [
  { id: "disabled-opacity", re: /disabled:opacity-\d/, fix: "禁用态改用语义 token（bg-muted / text-foreground-disabled），不要 opacity 伪装（DEC-020）" },
  { id: "disabled-pointer-events", re: /disabled:pointer-events-none/, fix: "去掉 disabled:pointer-events-none（它屏蔽光标，让 cursor-not-allowed 失效）（DEC-011）" },
  { id: "hardcoded-hex", re: /#[0-9a-fA-F]{6}\b/, fix: "颜色走语义 token，不要在组件里写死 hex（DEC-005）" },
]

const baseline = JSON.parse(await readFile("docs/data/component-hygiene-baseline.json", "utf8"))
const allow = new Set(baseline.allow ?? [])
const seen = new Set()
const errors = []

const files = (await readdir(UI_DIR)).filter((f) => f.endsWith(".tsx"))
for (const file of files) {
  const text = await readFile(join(UI_DIR, file), "utf8")
  const lines = text.split("\n")
  lines.forEach((line, i) => {
    if (line.includes("hygiene-ignore")) return
    for (const rule of rules) {
      if (!rule.re.test(line)) continue
      const key = `${file}::${rule.id}`
      if (allow.has(key)) { seen.add(key); continue }
      errors.push(`${file}:${i + 1}  [${rule.id}] ${rule.fix}`)
    }
  })
}

// 提示：baseline 里已不存在的条目（修过了），可清掉
const stale = [...allow].filter((k) => !seen.has(k))

if (errors.length > 0) {
  console.error("component-hygiene check failed（清单外的新增硬伤）：\n")
  for (const e of errors) console.error(`- ${e}`)
  console.error("\n合法例外可在该行加 `// hygiene-ignore: 原因`；存量请走体检后从 baseline 移除。")
  process.exitCode = 1
} else {
  console.log(`component-hygiene check passed：无清单外硬伤；baseline 剩 ${allow.size} 条待体检清理。`)
  if (stale.length) {
    console.log(`💡 baseline 可清理（已不再命中）：${stale.join(", ")}`)
  }
}

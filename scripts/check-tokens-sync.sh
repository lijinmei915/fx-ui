#!/usr/bin/env bash
set -euo pipefail

# 校验 docs/TOKENS.md 和 docs/data/design-tokens.json 是否和 theme/fx-theme.css 保持一致。
# fx-theme.css 是唯一真相源；本脚本只检查有没有抄漏/抄错，不生成内容。

root="$(cd "$(dirname "$0")/.." && pwd)"
css="$root/theme/fx-theme.css"
doc="$root/docs/TOKENS.md"
json="$root/docs/data/design-tokens.json"

if [ ! -f "$css" ]; then
  echo "ERROR: not found: $css"
  exit 2
fi
if [ ! -f "$doc" ]; then
  echo "ERROR: not found: $doc"
  exit 2
fi
if [ ! -f "$json" ]; then
  echo "ERROR: not found: $json"
  exit 2
fi

warnings=0

# 提取 :root 块里 "--变量名: 值;" 形式、值是十六进制颜色的条目
while IFS= read -r line; do
  name="$(echo "$line" | sed -E 's/^[[:space:]]*--([a-zA-Z0-9-]+):.*/\1/')"
  value="$(echo "$line" | grep -oE '#[0-9A-Fa-f]{6}' | head -n1)"

  [ -z "$value" ] && continue

  if ! grep -qiF "$value" "$doc"; then
    warnings=$((warnings + 1))
    echo "WARN: --$name: $value 在 fx-theme.css 中存在，但 docs/TOKENS.md 里找不到这个值（可能漏抄或改漂了）"
  fi
done < <(sed -n '/:root {/,/^}/p' "$css" | grep -E '^\s*--[a-zA-Z0-9-]+:.*#[0-9A-Fa-f]{6}')

if [ "$warnings" -gt 0 ]; then
  echo ""
  echo "Result: 发现 $warnings 处可能的漂移。请检查 docs/TOKENS.md 是否需要同步 theme/fx-theme.css 的最新值。"
  exit 1
fi

CSS_PATH="$css" JSON_PATH="$json" PROJECT_ROOT="$root" node --input-type=module <<'NODE'
import fs from "node:fs"
import path from "node:path"

const cssPath = process.env.CSS_PATH
const jsonPath = process.env.JSON_PATH
const projectRoot = process.env.PROJECT_ROOT

const css = fs.readFileSync(cssPath, "utf8")
const manifest = JSON.parse(fs.readFileSync(jsonPath, "utf8"))
const rootMatch = css.match(/:root\s*\{([\s\S]*?)\n\}/)
const errors = []

if (!rootMatch) {
  errors.push("theme/fx-theme.css 找不到 :root token 块。")
}

const normalize = (value) => String(value ?? "").trim().replace(/\s+/g, " ")
const cssVars = new Map()

for (const line of (rootMatch?.[1] ?? "").split("\n")) {
  const match = line.match(/^\s*(--[\w-]+):\s*([^;]+);/)

  if (match) {
    cssVars.set(match[1], normalize(match[2]))
  }
}

if (manifest.format !== "fx-ui/design-tokens") {
  errors.push(`docs/data/design-tokens.json format 应为 fx-ui/design-tokens，当前是 ${manifest.format}`)
}

for (const section of ["primitive", "semantic"]) {
  const items = manifest[section]

  if (!Array.isArray(items) || items.length === 0) {
    errors.push(`design-tokens.json 的 ${section} 必须是非空数组。`)
    continue
  }

  const seen = new Set()

  for (const item of items) {
    if (!item.name || !item.value) {
      errors.push(`${section} 中存在缺少 name/value 的 token。`)
      continue
    }

    if (seen.has(item.name)) {
      errors.push(`${section} 中重复声明 ${item.name}。`)
    }

    seen.add(item.name)

    if (!cssVars.has(item.name)) {
      errors.push(`${section}.${item.name} 在 docs/data/design-tokens.json 中存在，但 theme/fx-theme.css 没有。`)
      continue
    }

    const cssValue = cssVars.get(item.name)
    const jsonValue = normalize(item.value)

    if (cssValue !== jsonValue) {
      errors.push(`${section}.${item.name} 值不一致：JSON=${jsonValue}，CSS=${cssValue}`)
    }
  }
}

const componentUsage = manifest.componentUsage

if (!Array.isArray(componentUsage) || componentUsage.length === 0) {
  errors.push("design-tokens.json 的 componentUsage 必须是非空数组。")
} else {
  for (const item of componentUsage) {
    if (!item.component || !item.source) {
      errors.push("componentUsage 中存在缺少 component/source 的条目。")
      continue
    }

    const sourcePath = path.join(projectRoot, item.source)

    if (!fs.existsSync(sourcePath)) {
      errors.push(`componentUsage.${item.component} 指向的源码不存在：${item.source}`)
    }

    if (!Array.isArray(item.tokens) || item.tokens.length === 0) {
      errors.push(`componentUsage.${item.component} 必须声明 tokens。`)
    } else {
      for (const token of item.tokens) {
        if (!cssVars.has(token)) {
          errors.push(`componentUsage.${item.component} 使用的 ${token} 不存在于 theme/fx-theme.css。`)
        }
      }
    }

    if (!Array.isArray(item.rules) || item.rules.length === 0) {
      errors.push(`componentUsage.${item.component} 必须声明 rules。`)
    }
  }
}

// 交互色状态阶梯校验：hover/active/disabled 必须按 interactionLadder 取阶
const ladder = manifest.interactionLadder
if (ladder) {
  const steps = ladder.solid
  for (const c of ladder.colors ?? []) {
    const colorSteps = c.steps ?? {}
    const checks = [
      ["default", c.default, colorSteps.default ?? steps.default],
      ["hover", c.hover, colorSteps.hover ?? steps.hover],
      ["active", c.active, colorSteps.active ?? steps.active],
      ["disabled", c.disabled, colorSteps.disabled ?? steps.disabled],
    ]
    for (const [state, tokenName, step] of checks) {
      if (!tokenName) continue
      const expected = `var(--fx-${c.scale}-${step})`
      const actual = cssVars.get(tokenName)
      if (actual === undefined) {
        errors.push(`interactionLadder: ${c.name}.${state} 的 token ${tokenName} 在 CSS 中不存在。`)
      } else if (normalize(actual) !== expected) {
        errors.push(`interactionLadder: ${c.name}.${state} 应为 ${expected}（${step}阶），实际 ${tokenName}=${actual}`)
      }
    }
  }
}

if (errors.length > 0) {
  console.error("")
  console.error(`Result: docs/data/design-tokens.json 发现 ${errors.length} 处漂移：`)

  for (const error of errors) {
    console.error(`ERROR: ${error}`)
  }

  process.exit(1)
}

console.log("OK: docs/data/design-tokens.json 与 theme/fx-theme.css 保持一致，组件 token 用法也已核对。")
NODE

echo "OK: docs/TOKENS.md 中的色值均能在 theme/fx-theme.css 找到，未发现漂移。"
echo "Result: completed with 0 warning(s)."

#!/usr/bin/env bash
set -euo pipefail

# 校验 Token 总览/Foundation 专题文档和 docs/data/design-tokens.json 是否和生成后的 Foundation + Semantic 保持一致。
# 本脚本只检查有没有抄漏/抄错，不生成内容。

root="$(cd "$(dirname "$0")/.." && pwd)"
css="$root/theme/fx-theme.css"
foundation="$root/theme/foundation.css"
semantic="$root/theme/fds-semantic.css"
docs=("$root/docs/TOKENS.md" "$root"/docs/foundations/*.md)
json="$root/docs/data/design-tokens.json"

if [ ! -f "$css" ]; then
  echo "ERROR: not found: $css"
  exit 2
fi
if [ ! -f "$foundation" ]; then
  echo "ERROR: not found: $foundation"
  exit 2
fi
if [ ! -f "$semantic" ]; then
  echo "ERROR: not found: $semantic"
  exit 2
fi
for doc in "${docs[@]}"; do
  if [ ! -f "$doc" ]; then
    echo "ERROR: not found: $doc"
    exit 2
  fi
done
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

  if ! grep -qiF "$value" "${docs[@]}"; then
    warnings=$((warnings + 1))
    echo "WARN: --$name: $value 在 fx-theme.css 中存在，但 Token 总览/Foundation 专题文档里找不到这个值（可能漏抄或改漂了）"
  fi
done < <(sed -n '/:root {/,/^}/p' "$foundation" "$semantic" "$css" | grep -E '^\s*--[a-zA-Z0-9-]+:.*#[0-9A-Fa-f]{6}')

if [ "$warnings" -gt 0 ]; then
  echo ""
  echo "Result: 发现 $warnings 处可能的漂移。请检查 docs/TOKENS.md 或 docs/foundations/*.md 是否需要同步生成后的 Token 值。"
  exit 1
fi

FOUNDATION_PATH="$foundation" SEMANTIC_PATH="$semantic" CSS_PATH="$css" JSON_PATH="$json" PROJECT_ROOT="$root" node --input-type=module <<'NODE'
import fs from "node:fs"
import path from "node:path"

const cssPath = process.env.CSS_PATH
const foundationPath = process.env.FOUNDATION_PATH
const semanticPath = process.env.SEMANTIC_PATH
const jsonPath = process.env.JSON_PATH
const projectRoot = process.env.PROJECT_ROOT

const css = [foundationPath, semanticPath, cssPath].map((file) => fs.readFileSync(file, "utf8")).join("\n")
const manifest = JSON.parse(fs.readFileSync(jsonPath, "utf8"))
const rootMatches = [...css.matchAll(/:root\s*\{([\s\S]*?)\n\}/g)]
const errors = []

if (rootMatches.length !== 3) {
  errors.push("theme/foundation.css、theme/fds-semantic.css 与 theme/fx-theme.css 必须各有一个 :root token 块。")
}

const normalize = (value) => String(value ?? "").trim().replace(/\s+/g, " ")
const cssVars = new Map()

for (const rootMatch of rootMatches) {
  for (const line of rootMatch[1].split("\n")) {
    const match = line.match(/^\s*(--[\w-]+):\s*([^;]+);/)

    if (match) {
      cssVars.set(match[1], normalize(match[2]))
    }
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
const semanticNames = new Set((manifest.semantic ?? []).map((token) => token.name))
const allowedStateNames = new Set(["default", "hover", "focus", "active", "disabled", "invalid", "placeholder"])

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

    const requiredTypographyMappings = {
      Input: new Map([["value", "body"], ["placeholder", "inherits-value"]]),
      Table: new Map([["header", "label"], ["cell", "data-or-body"]]),
    }
    const requiredMappings = requiredTypographyMappings[item.component]
    if (requiredMappings) {
      if (!Array.isArray(item.typographyMappings) || item.typographyMappings.length !== requiredMappings.size) {
        errors.push(`componentUsage.${item.component}.typographyMappings 必须完整声明组件排版映射。`)
      } else {
        const mappedElements = new Set()
        for (const mapping of item.typographyMappings) {
          if (!mapping.element || !mapping.role || !mapping.implementation || !mapping.usage) {
            errors.push(`componentUsage.${item.component}.typographyMappings 存在缺少 element/role/implementation/usage 的条目。`)
            continue
          }
          mappedElements.add(mapping.element)
          if (requiredMappings.get(mapping.element) !== mapping.role) {
            errors.push(`componentUsage.${item.component}.typographyMappings.${mapping.element} 的角色不符合契约。`)
          }
        }
        for (const element of requiredMappings.keys()) if (!mappedElements.has(element)) errors.push(`componentUsage.${item.component}.typographyMappings 缺少 ${element}。`)
      }
    }

    if (item.stateMappings !== undefined) {
      if (!Array.isArray(item.stateMappings) || item.stateMappings.length === 0) {
        errors.push(`componentUsage.${item.component}.stateMappings 如声明则必须是非空数组。`)
        continue
      }

      const states = new Set()
      for (const mapping of item.stateMappings) {
        if (!mapping.element || !mapping.state || !mapping.token || !mapping.description) {
          errors.push(`componentUsage.${item.component}.stateMappings 存在缺少 element/state/token/description 的条目。`)
          continue
        }
        if (!allowedStateNames.has(mapping.state)) {
          errors.push(`componentUsage.${item.component}.stateMappings 的 state 不受支持：${mapping.state}`)
        }
        if (!semanticNames.has(mapping.token)) {
          errors.push(`componentUsage.${item.component}.stateMappings 的 ${mapping.token} 必须是已声明的 semantic token。`)
        }
        if (!item.tokens.includes(mapping.token)) {
          errors.push(`componentUsage.${item.component}.stateMappings 的 ${mapping.token} 必须同时列在 tokens。`)
        }
        const key = `${mapping.element}:${mapping.state}`
        if (states.has(key)) {
          errors.push(`componentUsage.${item.component}.stateMappings 重复声明 ${key}。`)
        }
        states.add(key)
      }
    }
  }
}

const shape = manifest.shape
if (!shape || !Array.isArray(shape.scale) || !shape.concentricRule) {
  errors.push("design-tokens.json 的 shape 必须声明 scale 与 concentricRule。")
} else {
  for (const item of shape.scale) {
    if (!item.role || !item.token || !item.usage) {
      errors.push("shape.scale 存在缺少 role/token/usage 的条目。")
    } else if (!cssVars.has(item.token)) {
      errors.push(`shape.scale 的 ${item.token} 不存在于 theme/fx-theme.css。`)
    }
  }
}

const typography = manifest.typography
const allowedTypographyClasses = new Set(["text-xl", "text-lg", "text-base", "text-sm", "text-xs", "font-normal", "font-medium", "font-semibold", "font-bold"])
const componentOnlySizes = typography?.componentOnlySizes
if (!Array.isArray(componentOnlySizes) || componentOnlySizes.length === 0) {
  errors.push("typography.componentOnlySizes 必须声明受控的组件内部字号。")
} else {
  for (const size of componentOnlySizes) {
    if (!size.id || !size.utility || !size.fontSizeToken || !size.lineHeightToken || !size.value || !size.usage || !size.avoid) {
      errors.push("typography.componentOnlySizes 存在缺少 id/utility/token/value/usage/avoid 的条目。")
      continue
    }
    if (!cssVars.has(size.fontSizeToken) || !cssVars.has(size.lineHeightToken)) {
      errors.push(`typography.componentOnlySizes.${size.id} 引用了不存在的字号或行高 token。`)
    }
    const utilityToken = `--${size.utility}`
    if (!css.includes(`${utilityToken}: var(${size.fontSizeToken})`) || !css.includes(`${utilityToken}--line-height: var(${size.lineHeightToken})`)) {
      errors.push(`typography.componentOnlySizes.${size.id} 未在 @theme 映射 ${size.utility}。`)
    }
  }
}
if (!typography || !Array.isArray(typography.roles) || typography.roles.length === 0) {
  errors.push("design-tokens.json 的 typography.roles 必须是非空数组。")
} else {
  const roleIds = new Set()
  const utilities = new Set()
  for (const role of typography.roles) {
    if (!role.id || !role.utility || !role.usage || !role.avoid || !Array.isArray(role.tailwind) || role.tailwind.length !== 2) {
      errors.push("typography.roles 存在缺少 id/utility/tailwind/usage/avoid 的条目。")
      continue
    }
    if (roleIds.has(role.id)) errors.push(`typography.roles 重复声明 ${role.id}。`)
    roleIds.add(role.id)
    if (role.utility !== `text-${role.id}`) {
      errors.push(`typography.roles.${role.id}.utility 必须为 text-${role.id}。`)
    }
    if (utilities.has(role.utility)) errors.push(`typography.roles 重复声明 utility ${role.utility}。`)
    utilities.add(role.utility)
    if (!new RegExp(`@utility\\s+${role.utility}\\s*\\{`).test(css)) {
      errors.push(`theme/fx-theme.css 缺少 typography.roles.${role.id} 对应的 @utility ${role.utility}。`)
    }
    if (!role.tailwind.every((item) => allowedTypographyClasses.has(item))) {
      errors.push(`typography.roles.${role.id} 只能引用已声明的 text-* / font-* 工具类。`)
    }
    if (!role.tailwind.some((item) => item.startsWith("text-")) || !role.tailwind.some((item) => item.startsWith("font-"))) {
      errors.push(`typography.roles.${role.id} 必须各声明一个 text-* 与 font-* 工具类。`)
    }
  }
}

const requiredTypographyConventionIds = new Set(["mixed-language", "letter-spacing", "uppercase", "code", "truncation"])
const allowedConventionClasses = new Set(["font-sans", "font-mono", "truncate"])
if (!Array.isArray(typography?.conventions) || typography.conventions.length !== requiredTypographyConventionIds.size) {
  errors.push("typography.conventions 必须完整声明 5 条混排、代码与编号约定。")
} else {
  const conventionIds = new Set()
  for (const convention of typography.conventions) {
    if (!convention.id || !convention.rule || !convention.usage) {
      errors.push("typography.conventions 存在缺少 id/rule/usage 的条目。")
      continue
    }
    conventionIds.add(convention.id)
    if (!requiredTypographyConventionIds.has(convention.id)) {
      errors.push(`typography.conventions 不支持 ${convention.id}。`)
    }
    if (convention.tailwind !== undefined && (!Array.isArray(convention.tailwind) || !convention.tailwind.every((item) => allowedConventionClasses.has(item)))) {
      errors.push(`typography.conventions.${convention.id} 只能引用 font-sans / font-mono / truncate。`)
    }
    if (convention.id === "letter-spacing" && JSON.stringify(convention.prohibited) !== JSON.stringify(["tracking-tight", "tracking-tighter"])) {
      errors.push("typography.conventions.letter-spacing 必须禁止 tracking-tight 与 tracking-tighter。")
    }
    if (convention.id === "uppercase" && (!Array.isArray(convention.examples) || convention.examples.length === 0)) {
      errors.push("typography.conventions.uppercase 必须提供短缩写示例。")
    }
  }
  for (const id of requiredTypographyConventionIds) if (!conventionIds.has(id)) errors.push(`typography.conventions 缺少 ${id}。`)
}

const allowedDataClasses = new Set(["tabular-nums", "whitespace-nowrap"])
const allowedDataTypes = new Set(["text", "number", "currency", "percentage", "date", "identifier", "status"])
if (!Array.isArray(typography?.dataRules) || typography.dataRules.length !== allowedDataTypes.size) {
  errors.push("typography.dataRules 必须完整声明 7 种数据字段类型。")
} else {
  const dataIds = new Set()
  for (const rule of typography.dataRules) {
    if (!rule.id || !rule.align || !rule.usage || !Array.isArray(rule.classes)) {
      errors.push("typography.dataRules 存在缺少 id/align/classes/usage 的条目。")
      continue
    }
    dataIds.add(rule.id)
    if (!allowedDataTypes.has(rule.id) || !["left", "center", "right"].includes(rule.align)) {
      errors.push(`typography.dataRules.${rule.id} 的类型或对齐值不受支持。`)
    }
    if (!rule.classes.every((item) => allowedDataClasses.has(item))) {
      errors.push(`typography.dataRules.${rule.id} 只能引用 tabular-nums / whitespace-nowrap。`)
    }
  }
  for (const id of allowedDataTypes) if (!dataIds.has(id)) errors.push(`typography.dataRules 缺少 ${id}。`)
}

// 交互色状态阶梯校验：hover/active/disabled 必须按 interactionLadder 取阶
const ladder = manifest.interactionLadder
if (ladder) {
  const fdsStepName = (scale, step) => {
    return `--fds-g-color-${scale}-base-${Number(step) * 10}`
  }
  const referenceChain = (name) => {
    const chain = []
    const seen = new Set()
    let current = name
    while (!seen.has(current)) {
      seen.add(current)
      const value = cssVars.get(current)
      const reference = value?.match(/^var\((--[\w-]+)\)$/)?.[1]
      if (!reference) break
      chain.push(reference)
      current = reference
    }
    return chain
  }
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
      const expected = fdsStepName(c.scale, step)
      const actual = cssVars.get(tokenName)
      if (actual === undefined) {
        errors.push(`interactionLadder: ${c.name}.${state} 的 token ${tokenName} 在 CSS 中不存在。`)
      } else if (!referenceChain(tokenName).includes(expected)) {
        errors.push(`interactionLadder: ${c.name}.${state} 应解析到 ${expected}（${step}阶），实际 ${tokenName}=${actual}`)
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

console.log("OK: docs/data/design-tokens.json 与 Foundation / Semantic CSS 真相源保持一致，组件 token 用法也已核对。")
NODE

echo "OK: docs/TOKENS.md 中的色值均能在 Foundation / Semantic CSS 真相源找到，未发现漂移。"
echo "Result: completed with 0 warning(s)."

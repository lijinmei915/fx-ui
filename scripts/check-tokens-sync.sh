#!/usr/bin/env bash
set -euo pipefail

# 校验 docs/TOKENS.md 里记录的色值是否和 theme/fx-theme.css 的真相源保持一致。
# fx-theme.css 是唯一真相源；本脚本只检查 TOKENS.md 有没有抄漏/抄错，不生成内容。

root="$(cd "$(dirname "$0")/.." && pwd)"
css="$root/theme/fx-theme.css"
doc="$root/docs/TOKENS.md"

if [ ! -f "$css" ]; then
  echo "ERROR: not found: $css"
  exit 2
fi
if [ ! -f "$doc" ]; then
  echo "ERROR: not found: $doc"
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

echo "OK: docs/TOKENS.md 中的色值均能在 theme/fx-theme.css 找到，未发现漂移。"
echo "Result: completed with 0 warning(s)."

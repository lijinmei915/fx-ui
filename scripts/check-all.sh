#!/usr/bin/env bash
set -uo pipefail

# 统一检查入口（路由）：依次跑 fx-ui 实际适用的检查项，汇总结果。
# 单项检查脚本各自独立、可单独跑；本脚本只负责按顺序调用 + 汇总。

root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"

fail=0

run_check() {
  local name="$1"
  shift
  echo ""
  echo "── $name ──────────────────────────"
  if "$@"; then
    echo "✅ $name 通过"
  else
    echo "❌ $name 未通过"
    fail=1
  fi
}

run_check "shadcn 组件契约检查"   node scripts/check-shadcn-contract.mjs
run_check "token 漂移检查"        bash scripts/check-tokens-sync.sh
run_check "文档路由登记检查"      bash scripts/check-docs-routing.sh
run_check "密钥扫描"              bash scripts/check-secrets.sh .

echo ""
echo "── 文档同步提醒（弱提示，不计入失败）──────────"
bash scripts/check-docs-reminder.sh
bash scripts/check-handoff-freshness.sh

echo ""
if [ "$fail" -ne 0 ]; then
  echo "Result: 存在未通过的检查项，见上方 ❌ 标记。"
  exit 1
fi
echo "Result: 全部检查项通过。"

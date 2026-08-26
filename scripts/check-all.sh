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
run_check "治理页面数据重建"      node scripts/build-governance-pages.mjs
run_check "token 漂移检查"        bash scripts/check-tokens-sync.sh
run_check "Theme Contract 检查"    node scripts/check-theme-contract.mjs
run_check "Agent Token 合约检查"   node scripts/build-agent-token-contract.mjs --check
run_check "Agent 组件合约检查"      node scripts/build-agent-components.mjs --check
run_check "Agent 查询边界检查"      node scripts/check-agent-query-contract.mjs
run_check "Agent 示例来源检查"      node scripts/check-agent-examples.mjs
run_check "Agent 场景配方检查"      node scripts/check-agent-recipes.mjs
run_check "Agent 快速上下文检查"    node scripts/build-agent-context.mjs --check
run_check "页面 Build Kit 检查"     node scripts/check-page-build-kit.mjs
run_check "页面语义 contract 检查"  node scripts/check-page-semantics.mjs
run_check "页面搭建器 schema 检查" node scripts/check-page-builder.mjs
run_check "分层资产契约检查"      node scripts/check-layered-assets.mjs
run_check "浮层阴影 token 检查"    node scripts/check-shadow-tokens.mjs
run_check "网站卡片容器检查"      node scripts/check-website-card-contract.mjs
run_check "目录锚点关联检查"      node scripts/check-toc-anchors.mjs
run_check "组件文档 API 检查"     node scripts/check-component-docs.mjs
run_check "交互态 token 检查"     node scripts/check-interaction-tokens.mjs
run_check "组件体检硬伤检查"      node scripts/check-component-hygiene.mjs
run_check "列表页来源检查"        node scripts/check-list-page-source.mjs
run_check "导入约定检查"          node scripts/check-imports.mjs
run_check "文档站骨架契约检查"    node scripts/check-doc-site-contract.mjs
run_check "组件 manifest 检查"    node scripts/check-components-manifest.mjs
run_check "组件质量矩阵检查"    node scripts/build-component-quality.mjs --check
run_check "Playground 来源契约检查" node scripts/check-playground-contract.mjs
run_check "图标注册表检查"        node scripts/check-icons.mjs
run_check "Agent UI 协议检查"     node scripts/check-agent-ui-contract.mjs
run_check "文档路由登记检查"      bash scripts/check-docs-routing.sh
run_check "文档章节/职责契约检查"  node scripts/check-doc-structure.mjs
run_check "文档 frontmatter 检查"  bash scripts/check-frontmatter.sh .
run_check "密钥扫描"              bash scripts/check-secrets.sh .

echo ""
echo "── 文档同步提醒（弱提示，不计入失败）──────────"
bash scripts/check-docs-reminder.sh
bash scripts/check-handoff-freshness.sh
bash scripts/check-doc-freshness.sh

echo ""
if [ "$fail" -ne 0 ]; then
  echo "Result: 存在未通过的检查项，见上方 ❌ 标记。"
  exit 1
fi
echo "Result: 全部检查项通过。"

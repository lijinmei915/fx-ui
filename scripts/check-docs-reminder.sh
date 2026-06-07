#!/usr/bin/env bash
set -uo pipefail

# 弱提醒：本次提交改了 src/ 但没碰 docs/ 时，提示"是否需要同步文档"。
# 这是粗粒度的文件名匹配，判断不了改动语义，所以只提醒、不拦截提交，
# 让人自己决定要不要同步——细粒度的判断仍然靠 AGENTS.md 的收尾 checklist。

root="$(git rev-parse --show-toplevel)"
cd "$root"

# 只在有暂存改动时检查（pre-commit 场景）；脱离 commit 单独跑则跳过。
staged="$(git diff --cached --name-only)"
if [ -z "$staged" ]; then
  echo "（无暂存改动，跳过文档同步提醒）"
  exit 0
fi

touched_src=0
touched_docs=0

while IFS= read -r f; do
  case "$f" in
    src/*) touched_src=1 ;;
    docs/*|HANDOFF.md|PROJECT.md|PRODUCT.md|AGENTS.md) touched_docs=1 ;;
  esac
done <<< "$staged"

if [ "$touched_src" -eq 1 ] && [ "$touched_docs" -eq 0 ]; then
  echo "💡 提醒：本次提交改了 src/ 下的文件，但没有改动任何文档（docs/、HANDOFF.md、PROJECT.md...）。"
  echo "   不是所有代码改动都需要同步文档——按 AGENTS.md 的收尾 checklist 自行判断要不要补一条。"
  echo "   （这只是提醒，不会阻止提交）"
fi

exit 0

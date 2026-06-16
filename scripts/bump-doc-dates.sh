#!/usr/bin/env bash
set -o pipefail

# 自动更新文档日期：凡是本次提交里有内容变更的文档（docs/*.md + 根目录治理文档），
# 把 frontmatter 的 last_verified 自动 bump 到当天，并重新加入暂存区。
# 规则：last_verified = "最后内容变更日"，由本脚本在 pre-commit 自动维护，不靠人手填。
# 仅处理已暂存（git add 过、将进入本次提交）的文件。

root="$(git rev-parse --show-toplevel)"
cd "$root"

git rev-parse --is-inside-work-tree >/dev/null 2>&1 || exit 0

today="$(date +%F)"
bumped=0

# 已暂存且在治理范围内的 .md
staged="$(git diff --cached --name-only --diff-filter=ACM -- 'docs/*.md' 'AGENTS.md' 'PROJECT.md' 'PRODUCT.md' 2>/dev/null)"

[ -z "$staged" ] && exit 0

while IFS= read -r f; do
  [ -f "$f" ] || continue
  # 只处理顶部带 frontmatter 且有 last_verified 的文件
  grep -q '^last_verified:' "$f" || continue
  current="$(grep -m1 '^last_verified:' "$f" | sed 's/last_verified:[[:space:]]*//' | tr -d '[:space:]')"
  [ "$current" = "$today" ] && continue
  sed -i '' -E "s/^last_verified:.*/last_verified: ${today}/" "$f"
  git add "$f"
  printf '%s\n' "🗓  ${f} | last_verified -> ${today}"
  bumped=$((bumped + 1))
done <<< "$staged"

[ "$bumped" -gt 0 ] && echo "   （已自动更新 ${bumped} 个文档的 last_verified 到 ${today}）"
exit 0

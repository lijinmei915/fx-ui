#!/usr/bin/env bash
set -o pipefail

# 弱提醒：文档正文改了，但 frontmatter 的 last_verified 没跟着更新 → 日期过期。
# 比对每个 doc 的「git 最后提交日期」和「last_verified」，前者更新就提醒。
# 只提醒、不自动改日期（last_verified 语义是"人/AI 核实过"，不该机器盖章），不阻断提交。

root="$(git rev-parse --show-toplevel)"
cd "$root"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  exit 0
fi

stale=0

check_file() {
  local f="$1"
  [ -f "$f" ] || return
  local lv
  lv="$(grep -m1 '^last_verified:' "$f" 2>/dev/null | sed 's/last_verified:[[:space:]]*//' | tr -d '[:space:]')"
  [ -z "$lv" ] && return   # 无 frontmatter 的文件跳过（README/CLAUDE/HANDOFF 等）

  # 该文件最后一次提交的日期（YYYY-MM-DD）
  local commit_date
  commit_date="$(git log -1 --format=%cs -- "$f" 2>/dev/null)"
  [ -z "$commit_date" ] && return   # 还没进 git 历史，跳过

  # 工作区有未提交改动也算"动过"
  if ! git diff --quiet -- "$f" 2>/dev/null || ! git diff --cached --quiet -- "$f" 2>/dev/null; then
    commit_date="$(date +%F)"
  fi

  if [[ "$commit_date" > "$lv" ]]; then
    printf '%s\n' "💡 ${f} | 内容 ${commit_date} > last_verified ${lv} （日期过期）"
    stale=$((stale + 1))
  fi
}

for f in docs/*.md AGENTS.md PROJECT.md PRODUCT.md; do
  check_file "$f"
done

if [ "$stale" -gt 0 ]; then
  echo "   共 $stale 个文档日期过期——确认内容仍准确后，把 last_verified 更到对应日期（这只是提醒，不阻断）。"
fi

exit 0

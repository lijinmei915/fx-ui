#!/usr/bin/env bash
set -uo pipefail

# 弱提醒：HANDOFF.md 已经好几轮提交没更新了，提醒"是不是该写交接了"。
# 机器写不出有价值的交接总结（那是语义判断），只能提醒"该做这件事了"，
# 真正动笔总结仍然要靠人/AI——所以本脚本只提醒、不生成内容、不阻断提交。

root="$(git rev-parse --show-toplevel)"
cd "$root"

threshold=5

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  exit 0
fi

# 上一次改动 HANDOFF.md 的提交
last_handoff_commit="$(git log -1 --format=%H -- HANDOFF.md 2>/dev/null || true)"

if [ -z "$last_handoff_commit" ]; then
  echo "💡 提醒：HANDOFF.md 在 git 历史里还没有任何提交记录，建议先写一份交接快照。"
  exit 0
fi

# 自那次提交以来，又有多少次提交动过 src/ 或 docs/
since_count="$(git log --oneline "${last_handoff_commit}..HEAD" -- src/ docs/ | wc -l | tr -d ' ')"

if [ "$since_count" -ge "$threshold" ]; then
  echo "💡 提醒：自上次更新 HANDOFF.md 以来，已经有 $since_count 次涉及 src/ 或 docs/ 的提交了。"
  echo "   交接记录可能已经过期——内容是"这轮做了什么/风险/下一步"，需要人/AI 当场总结，"
  echo "   建议找个收尾点更新一下 HANDOFF.md（这只是提醒，不会阻止提交）。"
fi

exit 0

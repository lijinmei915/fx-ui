#!/usr/bin/env bash
set -euo pipefail

# 把 scripts/pre-commit 装进本地 .git/hooks/pre-commit。
# .git/hooks 不进版本库，每个 clone 下来的人都要手动跑一次本脚本。

root="$(git rev-parse --show-toplevel)"
src="$root/scripts/pre-commit"
dest="$root/.git/hooks/pre-commit"

cp "$src" "$dest"
chmod +x "$dest"

echo "✅ 已安装 pre-commit 钩子：$dest"
echo "   以后 git commit 前会自动跑 npm run check:all"

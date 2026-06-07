#!/usr/bin/env bash
set -uo pipefail

# 兜底检查：docs/*.md 是不是都登记进了 docs/DOCUMENTATION.md 的 SSOT 路由表。
# 只做机械的"文件名字符串有没有出现"匹配——判断不了"该归到哪类问题"，
# 那一步是建文档时人/AI 必须当场做的事（见 DOCUMENTATION.md 的强制步骤）。
# 本脚本只负责兜住"忘了登记"的漏网之鱼。

root="$(git rev-parse --show-toplevel)"
cd "$root"

routing_doc="docs/DOCUMENTATION.md"
# 明确不需要进路由表的文件：
# - DOCUMENTATION.md 自身
# - SETUP.md 已转为"历史记录"，在自身文件里写明了去处，不归路由表管
# - CLAUDE.md / AGENTS.md 等工具入口文件不在此列豁免——它们也代表一类"信息该写哪"的问题，要能在表里查到
exempt="DOCUMENTATION.md SETUP.md"

missing=0

check_one() {
  local path="$1"
  local name
  name="$(basename "$path")"

  case " $exempt " in
    *" $name "*) return ;;
  esac

  if ! grep -qF "$name" "$routing_doc"; then
    missing=$((missing + 1))
    echo "WARN: $path 没有出现在 $routing_doc 的 SSOT 路由表里——可能是孤岛文档"
  fi
}

for f in docs/*.md; do
  check_one "$f"
done

# 根目录治理文档同样要在路由表里能查到"该写去哪"
for f in *.md; do
  check_one "$f"
done

if [ "$missing" -gt 0 ]; then
  echo ""
  echo "Result: 发现 $missing 份文档未登记进路由表。新建文档时记得同步加一行（见 DOCUMENTATION.md 的强制步骤）。"
  exit 1
fi

echo "OK: docs/ 和根目录的治理文档均已登记进 SSOT 路由表，没有孤岛。"
echo "Result: completed with 0 warning(s)."

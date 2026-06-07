#!/usr/bin/env bash
set -uo pipefail

# 兜底检查：docs/*.md 是不是都登记进了 docs/DOCUMENTATION.md 的 SSOT 路由表。
# 只做机械的"文件名字符串有没有出现"匹配——判断不了"该归到哪类问题"，
# 那一步是建文档时人/AI 必须当场做的事（见 DOCUMENTATION.md 的强制步骤）。
# 本脚本只负责兜住"忘了登记"的漏网之鱼。

root="$(git rev-parse --show-toplevel)"
cd "$root"

routing_doc="docs/DOCUMENTATION.md"
# 明确不需要进路由表的文件（自身 / 已转为历史记录且在自身文件里说明了去处）
exempt="DOCUMENTATION.md"

missing=0

for f in docs/*.md; do
  name="$(basename "$f")"

  case " $exempt " in
    *" $name "*) continue ;;
  esac

  if ! grep -qF "$name" "$routing_doc"; then
    missing=$((missing + 1))
    echo "WARN: docs/$name 没有出现在 $routing_doc 的 SSOT 路由表里——可能是孤岛文档"
  fi
done

if [ "$missing" -gt 0 ]; then
  echo ""
  echo "Result: 发现 $missing 份文档未登记进路由表。新建文档时记得同步加一行（见 DOCUMENTATION.md 的强制步骤）。"
  exit 1
fi

echo "OK: docs/ 下所有文档均已登记进 SSOT 路由表，没有孤岛。"
echo "Result: completed with 0 warning(s)."

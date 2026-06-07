#!/usr/bin/env bash
set -euo pipefail

target="${1:-.}"

if [ ! -d "$target" ]; then
  echo "ERROR: target directory not found: $target"
  exit 2
fi

cd "$target"

warnings=0
errors=0
secret_scan_tmp="$(mktemp)"

cleanup() {
  rm -f "$secret_scan_tmp"
}
trap cleanup EXIT

warn() {
  warnings=$((warnings + 1))
  echo "WARN: $*"
}

error() {
  errors=$((errors + 1))
  echo "ERROR: $*"
}

# fx-ui 目前没有 .env 文件（见 docs/ENVIRONMENT.md）。
# 如果以后引入了，确认它没被提交进 git。
for envfile in .env .env.local .env.production; do
  if [ -f "$envfile" ]; then
    if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
      if ! git check-ignore -q "$envfile"; then
        error "$envfile exists and is NOT ignored by git"
      else
        echo "OK: $envfile exists and is gitignored"
      fi
    fi
  fi
done

# 扫描已追踪文件里看起来像密钥/token 的字符串
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  if git grep -n -I -E \
    'sk-[A-Za-z0-9_-]{20,}|ghp_[A-Za-z0-9]{30,}|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----' \
    -- ':!*.png' ':!*.jpg' ':!*.jpeg' ':!*.gif' ':!*.webp' ':!scripts/check-secrets.sh' \
    >"$secret_scan_tmp" 2>/dev/null; then
    cat "$secret_scan_tmp"
    error "possible secret found in tracked files"
  else
    echo "OK: no obvious secret patterns found in tracked files"
  fi
fi

if [ "$errors" -gt 0 ]; then
  echo "Result: failed with $errors error(s), $warnings warning(s)."
  exit 1
fi

echo "Result: completed with $warnings warning(s)."

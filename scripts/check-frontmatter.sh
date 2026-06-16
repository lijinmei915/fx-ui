#!/usr/bin/env bash
# 校验 docs/ 顶层治理/知识文档的 YAML frontmatter：
#   - 必填 layer / type / last_verified
#   - layer / type 取值在 KNOWLEDGE_SCHEMA 枚举内
#   - last_verified 是 YYYY-MM-DD
#   - depends_on 指向的文件真实存在
# 不检查 docs/components/*.md（用的是另一套 category/title frontmatter）
set -euo pipefail

root="${1:-.}"

if ! command -v node >/dev/null 2>&1; then
  echo "WARN: node 未安装，跳过 frontmatter 校验"
  exit 0
fi

node - "$root" <<'NODE'
const fs = require("fs");
const path = require("path");
const root = process.argv[2];

// KNOWLEDGE_SCHEMA.md 定义的合法枚举
const allowedLayers = new Set(["entry", "knowledge", "governance"]);
const allowedTypes = new Set(["spec", "status", "log", "guide"]);
const requiredFields = ["layer", "type", "last_verified"];
let errors = 0;
const fail = (m) => { errors += 1; console.error(`ERROR: ${m}`); };

function docsTopLevel() {
  const dir = path.join(root, "docs");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(e => e.isFile() && e.name.endsWith(".md"))
    .map(e => path.join("docs", e.name));
}

function parseFrontmatter(text) {
  if (!text.startsWith("---\n")) return null;
  const end = text.indexOf("\n---", 4);
  if (end === -1) return null;
  const data = {};
  for (const line of text.slice(4, end).trim().split(/\n/)) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_-]*):\s*(.*)$/);
    if (m) data[m[1]] = m[2].trim();
  }
  return data;
}

const clean = (v) => String(v || "").replace(/^["']|["']$/g, "");
function deps(v) {
  if (!v) return [];
  const raw = clean(v);
  if (raw.startsWith("[") && raw.endsWith("]")) {
    return raw.slice(1, -1).split(",").map(s => clean(s.trim())).filter(Boolean);
  }
  return [clean(raw)].filter(Boolean);
}

// 根目录里确实带 frontmatter 的核心文件也一起查
const rootFiles = ["AGENTS.md", "PROJECT.md", "PRODUCT.md"]
  .filter(f => fs.existsSync(path.join(root, f)));

const files = [...rootFiles, ...docsTopLevel()];

for (const rel of files) {
  const fm = parseFrontmatter(fs.readFileSync(path.join(root, rel), "utf8"));
  if (!fm) { fail(`${rel}: 缺少 YAML frontmatter`); continue; }
  for (const f of requiredFields) if (!fm[f]) fail(`${rel}: 缺少字段 ${f}`);
  const layer = clean(fm.layer), type = clean(fm.type), lv = clean(fm.last_verified);
  // 允许 "knowledge | governance" 这种声明双归属，逐个校验
  if (fm.layer && !layer.split("|").map(s => s.trim()).every(l => allowedLayers.has(l)))
    fail(`${rel}: 非法 layer "${layer}"`);
  if (fm.type && !type.split("|").map(s => s.trim()).every(t => allowedTypes.has(t)))
    fail(`${rel}: 非法 type "${type}"`);
  if (fm.last_verified && !/^\d{4}-\d{2}-\d{2}$/.test(lv))
    fail(`${rel}: last_verified 格式应为 YYYY-MM-DD，当前 "${lv}"`);
  if (fm.depends_on) for (const d of deps(fm.depends_on))
    if (!fs.existsSync(path.join(root, d))) fail(`${rel}: depends_on 指向不存在的文件 ${d}`);
}

if (errors) { console.error(`\nfrontmatter 校验失败：${errors} 处`); process.exit(1); }
console.log(`Frontmatter 校验通过：${files.length} 个文件`);
NODE

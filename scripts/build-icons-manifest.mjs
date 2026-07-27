#!/usr/bin/env node
// 图标出口是唯一代码真相源；注册表由它派生，保留既有的人工关键词与分类。
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const iconsPath = path.join(root, "src/lib/icons.ts")
const manifestPath = path.join(root, "docs/data/icons.manifest.json")
const iconsSource = fs.readFileSync(iconsPath, "utf8")
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"))
const existing = new Map(manifest.icons.map((icon) => [icon.name, icon]))

const exported = []
for (const match of iconsSource.matchAll(/Icon\w+\s+as\s+(\w+Icon)\s*,/g)) exported.push({ name: match[1], source: "tabler" })
for (const match of iconsSource.matchAll(/export\s*\{([^}]*)\}\s*from\s*"@\/lib\/icons-custom"/g)) {
  for (const name of match[1].split(",").map((value) => value.trim()).filter(Boolean)) exported.push({ name, source: "custom" })
}

const categoryFor = (name) => {
  if (/^(Arrow|Caret|Chevron|Chevrons|Home|Layout|PanelLeft|Navigation|Link|BookOpen|Sitemap)/.test(name)) return "navigation"
  if (/^(Alert|Bell|Check|Circle|Help|Info|Loader|Star)/.test(name)) return "status"
  if (/^(Bold|Code|Italic|Text|Typography|Underline)/.test(name)) return "editor"
  if (/^(Building|Briefcase|Calendar|Chart|Contract|CreditCard|Database|File|Folder|Inbox|Mail|Map|Package|Report|School|Target|User)/.test(name)) return "object"
  return "action"
}

const keywordsFor = (name) => name
  .replace(/Icon$/, "")
  .replace(/Filled$/, " selected")
  .replace(/([a-z])([A-Z])/g, "$1 $2")
  .toLowerCase()
  .split(/\s+/)
  .filter(Boolean)

manifest.icons = exported.map(({ name, source }) => {
  const current = existing.get(name)
  return current ?? {
    name,
    source,
    style: name.endsWith("FilledIcon") ? "fill" : "line",
    category: categoryFor(name),
    keywords: keywordsFor(name),
  }
})
manifest.updatedAt = new Date().toISOString().slice(0, 10)
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n")
console.log(`built docs/data/icons.manifest.json: ${manifest.icons.length} icons registered`)

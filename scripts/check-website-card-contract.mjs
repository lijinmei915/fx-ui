import fs from "node:fs"
import path from "node:path"

const root = process.cwd()
const scanRoots = ["src/lib", "src/reports", "src/components/fx"]
const allowedDirectCardFiles = new Set([
  path.join(root, "src/pages/docs/components/card-page.tsx"),
  path.join(root, "src/components/fx/website-card-container.tsx"),
])

function collectFiles(directory) {
  if (!fs.existsSync(directory)) return []
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name)
    return entry.isDirectory() ? collectFiles(file) : file.endsWith(".tsx") ? [file] : []
  })
}

const violations = []
for (const relativeRoot of scanRoots) {
  for (const file of collectFiles(path.join(root, relativeRoot))) {
    const source = fs.readFileSync(file, "utf8")
    if (/<Card(?:\s|>)/.test(source) && !allowedDirectCardFiles.has(file)) {
      violations.push(`${path.relative(root, file)}: direct <Card> must use WebsiteCardContainer`)
    }
    if (/WebsiteCardContainer[^\n]*shadow-(?:none|sm|md|lg|xl|2xl)/.test(source)) {
      violations.push(`${path.relative(root, file)}: WebsiteCardContainer call overrides the shared shadow token`)
    }
  }
}

const containerSource = fs.readFileSync(path.join(root, "src/components/fx/website-card-container.tsx"), "utf8")
const cardSource = fs.readFileSync(path.join(root, "src/components/ui/card.tsx"), "utf8")
if (!/variant="elevated"/.test(containerSource)) {
  violations.push("src/components/fx/website-card-container.tsx: Card elevated variant delegation is missing")
}
if (!/elevated:\s*\n?\s*"[^"]*shadow-l1/.test(cardSource)) {
  violations.push("src/components/ui/card.tsx: elevated variant must own the shared shadow-l1 token")
}
if (/className=\{cn\([\s\S]*"shadow-l1"\)/.test(containerSource)) {
  violations.push("src/components/fx/website-card-container.tsx: shadow-l1 must come from Card variant, not a wrapper override")
}

if (violations.length) {
  console.error(`website card contract check failed:\n- ${violations.join("\n- ")}`)
  process.exit(1)
}

console.log("website card contract check passed: page cards use WebsiteCardContainer -> Card elevated -> shadow-l1")

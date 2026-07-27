#!/usr/bin/env node
// Verify Agent example pointers against the real documentation-page source.
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const contract = JSON.parse(fs.readFileSync(path.join(root, "docs/data/agent-components.manifest.json"), "utf8"))
const errors = []

for (const component of contract.components) {
  const examples = component.examples
  if (!examples) continue
  const sourceFile = examples.sourceFile
  const sourcePath = path.join(root, sourceFile ?? "")
  if (!sourceFile || !fs.existsSync(sourcePath)) {
    errors.push(`${component.name}: example source is missing (${sourceFile ?? "none"})`)
    continue
  }
  const sourceParts = [fs.readFileSync(sourcePath, "utf8")]
  if (examples.pageSlug || sourceFile === "src/App.tsx") {
    const sharedPageSource = path.join(root, "src/pages/docs/components/standard-doc-page.tsx")
    if (fs.existsSync(sharedPageSource)) sourceParts.push(fs.readFileSync(sharedPageSource, "utf8"))
  }
  if (sourceFile === "src/App.tsx") {
    const pageModuleSource = path.join(root, "src/pages/docs/components/date-picker-page.tsx")
    if (fs.existsSync(pageModuleSource)) sourceParts.push(fs.readFileSync(pageModuleSource, "utf8"))
    const topBarPageSource = path.join(root, "src/pages/docs/components/top-bar-page.tsx")
    if (fs.existsSync(topBarPageSource)) sourceParts.push(fs.readFileSync(topBarPageSource, "utf8"))
    const inputPageSource = path.join(root, "src/pages/docs/components/input-page.tsx")
    if (fs.existsSync(inputPageSource)) sourceParts.push(fs.readFileSync(inputPageSource, "utf8"))
    const selectPageSource = path.join(root, "src/pages/docs/components/select-page.tsx")
    if (fs.existsSync(selectPageSource)) sourceParts.push(fs.readFileSync(selectPageSource, "utf8"))
  }
  const source = sourceParts.join("\n")
  for (const key of ["pageSymbol", "playground", "importCode", "scenarios", "usageCode"]) {
    if (examples[key] && !source.includes(examples[key])) errors.push(`${component.name}: ${key} is not found in ${sourceFile}`)
  }
  for (const anchor of examples.anchors ?? []) {
    const id = anchor.replace(/^#/, "")
    const usesStandardDocPage = examples.pageSlug && anchor.startsWith(`#${examples.pageSlug}-`) && source.includes(`slug="${examples.pageSlug}"`) && source.includes("id={`${slug}-")
    if (!source.includes(`id="${id}"`) && !usesStandardDocPage) errors.push(`${component.name}: anchor ${anchor} is not found in ${sourceFile}`)
  }
  if (component.doc && !fs.existsSync(path.join(root, component.doc))) errors.push(`${component.name}: component doc is missing (${component.doc})`)
}

if (errors.length) {
  console.error("agent examples check failed")
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}
console.log("agent examples check passed")

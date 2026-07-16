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
  const source = fs.readFileSync(sourcePath, "utf8")
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

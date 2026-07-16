#!/usr/bin/env node
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const kit = JSON.parse(fs.readFileSync(path.join(root, "docs/data/page-build-kit.manifest.json"), "utf8"))
const errors = []

if (kit.format !== "fx-ui/page-build-kit") errors.push("page build kit format is invalid")
for (const archetype of kit.archetypes ?? []) {
  if (!archetype.id || !archetype.name || !archetype.status || !Array.isArray(archetype.intent)) {
    errors.push(`incomplete archetype: ${JSON.stringify(archetype)}`)
    continue
  }
  if (archetype.status === "ready") {
    if (!archetype.generator || !archetype.source || !Array.isArray(archetype.frame) || !Array.isArray(archetype.constraints)) {
      errors.push(`${archetype.id} must declare generator, source, frame and constraints`)
    } else if (!fs.existsSync(path.join(root, archetype.source))) {
      errors.push(`${archetype.id} source is missing: ${archetype.source}`)
    }
  }
  if (archetype.status === "needs-block" && !archetype.constraint) errors.push(`${archetype.id} must explain its block boundary`)
}
if (errors.length) {
  console.error("page build kit check failed")
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}
console.log(`page build kit check passed: ${kit.archetypes.length} archetypes`)

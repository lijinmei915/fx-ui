import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const manifestPath = path.join(root, "docs/data/layered-assets.manifest.json")
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"))
const requiredLayers = ["components", "hooks", "patterns", "blocks", "page-templates"]
const errors = []

if (manifest.format !== "fx-ui/layered-assets") errors.push("invalid format")
for (const layer of requiredLayers) if (!manifest.layers.includes(layer)) errors.push(`missing layer: ${layer}`)
for (const source of manifest.components?.sources ?? []) {
  if (!fs.existsSync(path.join(root, source.path))) errors.push(`missing component source: ${source.path}`)
}
for (const item of [...(manifest.hooks ?? []), ...(manifest.blocks ?? [])]) {
  const [file, anchor] = item.source.split("#")
  const sourcePath = path.join(root, file)
  if (!fs.existsSync(sourcePath)) errors.push(`missing source: ${file}`)
  if (anchor && fs.existsSync(sourcePath) && !fs.readFileSync(sourcePath, "utf8").includes(`function ${anchor}(`) && !fs.readFileSync(sourcePath, "utf8").includes(`function ${anchor} `)) {
    errors.push(`source symbol not found: ${item.source}`)
  }
  for (const evidence of item.evidence ?? []) if (!fs.existsSync(path.join(root, evidence))) errors.push(`missing block evidence: ${evidence}`)
}
for (const block of manifest.blocks ?? []) {
  if (!Array.isArray(block.components) || block.components.length === 0) errors.push(`${block.id} must declare components`)
  if (!Array.isArray(block.dataContract) || block.dataContract.length === 0) errors.push(`${block.id} must declare dataContract`)
  if (!Array.isArray(block.acceptanceCriteria) || block.acceptanceCriteria.length === 0) errors.push(`${block.id} must declare acceptanceCriteria`)
  if (block.dataContractSource) {
    const [file, anchor] = block.dataContractSource.split("#")
    const contractPath = path.join(root, file)
    if (!fs.existsSync(contractPath)) errors.push(`missing data contract: ${block.dataContractSource}`)
    else if (anchor) {
      const contract = JSON.parse(fs.readFileSync(contractPath, "utf8"))
      const collection = contract.recipes ?? contract.archetypes ?? []
      if (!collection.some((entry) => entry.id === anchor)) errors.push(`missing data contract anchor: ${block.dataContractSource}`)
    }
  }
  if (block.visualEvidence) {
    if (!block.visualEvidence.file || !fs.existsSync(path.join(root, block.visualEvidence.file))) {
      errors.push(`missing visual evidence: ${block.id}`)
    }
    if (!block.visualEvidence.testName) errors.push(`${block.id} visualEvidence must declare testName`)
  }
}
for (const item of [...(manifest.patterns ?? []), ...(manifest.pageTemplates ?? [])]) {
  const [file, anchor] = item.source.split("#")
  if (!fs.existsSync(path.join(root, file))) errors.push(`missing contract: ${file}`)
  if (anchor) {
    const contract = JSON.parse(fs.readFileSync(path.join(root, file), "utf8"))
    const collection = contract.recipes ?? contract.archetypes ?? []
    if (!collection.some((entry) => entry.id === anchor)) errors.push(`missing contract anchor: ${item.source}`)
  }
}
for (const template of manifest.pageTemplates ?? []) {
  if (template.status === "needs-block") {
    if (!template.constraint) errors.push(`${template.id} must explain its block boundary`)
    if (!Array.isArray(template.evidence) || template.evidence.length === 0) errors.push(`${template.id} must declare evidence for its boundary`)
    for (const evidence of template.evidence ?? []) {
      if (!fs.existsSync(path.join(root, evidence))) errors.push(`${template.id} evidence is missing: ${evidence}`)
    }
    if (!Array.isArray(template.missingCapabilities) || template.missingCapabilities.length === 0) errors.push(`${template.id} must declare missingCapabilities`)
  }
}

for (const hook of manifest.hooks ?? []) {
  for (const evidence of hook.evidence ?? []) {
    const evidencePath = path.join(root, evidence)
    if (!fs.existsSync(evidencePath)) errors.push(`missing hook evidence: ${evidence}`)
    else if (evidence === hook.source && !fs.readFileSync(evidencePath, "utf8").includes(`function ${hook.name}(`)) errors.push(`hook export not found: ${hook.name}`)
  }
}

const hooksDirectory = path.join(root, "src/hooks")
if (fs.existsSync(hooksDirectory)) {
  const declaredHookSources = new Set((manifest.hooks ?? []).map((hook) => hook.source))
  for (const entry of fs.readdirSync(hooksDirectory)) {
    if (!/\.(ts|tsx)$/.test(entry)) continue
    const source = `src/hooks/${entry}`
    if (!declaredHookSources.has(source)) errors.push(`hook source is not registered: ${source}`)
  }
}

const ids = []
for (const list of [manifest.hooks, manifest.patterns, manifest.blocks, manifest.pageTemplates]) {
  for (const item of list ?? []) {
    if (!item.id || ids.includes(item.id)) errors.push(`duplicate or empty id: ${item.id ?? ""}`)
    ids.push(item.id)
    if (!["ready", "needs-block", "needs-review"].includes(item.status)) errors.push(`invalid status: ${item.id}`)
  }
}
if (errors.length) {
  console.error(`layered assets check failed:\n- ${errors.join("\n- ")}`)
  process.exit(1)
}
console.log(`layered assets check passed: ${ids.length} declared behavior/pattern/block/template assets`)

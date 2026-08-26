#!/usr/bin/env node
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const file = path.join(root, "docs/data/page-semantics.manifest.json")
const manifest = JSON.parse(fs.readFileSync(file, "utf8"))
const buildKit = JSON.parse(fs.readFileSync(path.join(root, "docs/data/page-build-kit.manifest.json"), "utf8"))
const tokens = JSON.parse(fs.readFileSync(path.join(root, "docs/data/design-tokens.json"), "utf8"))
const errors = []
const pageTypes = manifest.pageTypes ?? []
const globalSemantics = new Set(manifest.globalSemantics ?? [])
const semanticLayer = tokens.semantic ?? tokens.semantics ?? []
const semanticTokenIds = new Set(
  Array.isArray(semanticLayer)
    ? semanticLayer.map((item) => item.name?.replace(/^--/, "")).filter(Boolean)
    : Object.keys(semanticLayer)
)
const declaredSources = new Set([
  ...(buildKit.archetypes ?? []).map((item) => `docs/data/page-build-kit.manifest.json#${item.id}`),
  "docs/data/page-builder.manifest.json#component-create",
])
const readyBuildKitProfiles = new Map(
  (buildKit.archetypes ?? []).map((item) => [item.id, item.semanticsProfile])
)

if (manifest.format !== "fx-ui/page-semantics") errors.push("invalid page semantics format")
if (!manifest.foundationSource || !manifest.globalSemanticSource) errors.push("foundationSource and globalSemanticSource are required")
for (const page of pageTypes) {
  if (!page.id || !page.label || !page.status || !page.source || !Array.isArray(page.roles)) errors.push(`incomplete page type: ${page.id ?? "unknown"}`)
  if (page.status === "ready" && !declaredSources.has(page.source)) errors.push(`${page.id} source is not a declared page/build-kit source: ${page.source}`)
  if (page.status === "ready" && page.source.includes("page-build-kit.manifest.json#") && readyBuildKitProfiles.get(page.id) !== page.id) errors.push(`${page.id} ready Build Kit must declare semanticsProfile: ${page.id}`)
  const roleIds = new Set()
  for (const role of page.roles ?? []) {
    for (const key of ["id", "label", "semanticToken", "intent"]) if (!role[key]) errors.push(`${page.id} role is missing ${key}`)
    if (roleIds.has(role.id)) errors.push(`${page.id} has duplicate role: ${role.id}`)
    roleIds.add(role.id)
    if (!globalSemantics.has(role.semanticToken)) errors.push(`${page.id}.${role.id} uses undeclared global semantic: ${role.semanticToken}`)
    for (const forbidden of ["hex", "rgb", "hsl", "spacingValue", "radiusValue", "fontSize"]) if (forbidden in role) errors.push(`${page.id}.${role.id} declares forbidden page-local value: ${forbidden}`)
    if (semanticTokenIds.size && !semanticTokenIds.has(role.semanticToken)) errors.push(`${page.id}.${role.id} semantic token is absent from design-tokens.json: ${role.semanticToken}`)
  }
  if (page.status === "ready" && page.roles.length === 0) errors.push(`${page.id} is ready but has no page roles`)
  if (page.status === "planned" && !page.nextStep) errors.push(`${page.id} planned type needs nextStep`)
}
if (errors.length) {
  console.error("page semantics check failed")
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}
console.log(`page semantics check passed: ${pageTypes.length} page types, ${pageTypes.reduce((sum, page) => sum + page.roles.length, 0)} roles`)

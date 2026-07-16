#!/usr/bin/env node
// Validate recipe facts against declared component/token contracts and real evidence sources.
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), "utf8"))
const recipes = read("docs/data/agent-recipes.manifest.json")
const components = read("docs/data/agent-components.manifest.json")
const tokens = read("docs/data/agent-tokens.manifest.json")
const errors = []
const componentNames = new Set(components.components.map((component) => component.name))
const tokenNames = new Set(tokens.semanticTokens.map((token) => token.cssVar))

if (recipes.format !== "fx-ui/agent-recipes") errors.push("agent recipe format is invalid")
for (const recipe of recipes.recipes ?? []) {
  for (const key of ["id", "name", "status", "composition"]) if (!recipe[key]) errors.push(`recipe is missing ${key}: ${JSON.stringify(recipe)}`)
  for (const key of ["intent", "components", "tokenRefs", "behavior", "acceptance", "forbidden", "evidence"]) {
    if (!Array.isArray(recipe[key]) || recipe[key].length === 0) errors.push(`${recipe.id}: ${key} must be a non-empty array`)
  }
  for (const component of recipe.components ?? []) if (!componentNames.has(component)) errors.push(`${recipe.id}: unknown declared component ${component}`)
  for (const token of recipe.tokenRefs ?? []) if (!tokenNames.has(token)) errors.push(`${recipe.id}: unknown semantic token ${token}`)
  for (const evidence of recipe.evidence ?? []) {
    const sourcePath = path.join(root, evidence.file ?? "")
    if (!evidence.file || !fs.existsSync(sourcePath)) {
      errors.push(`${recipe.id}: missing evidence file ${evidence.file ?? "none"}`)
      continue
    }
    const source = fs.readFileSync(sourcePath, "utf8")
    for (const symbol of evidence.symbols ?? []) if (!source.includes(symbol)) errors.push(`${recipe.id}: evidence symbol ${symbol} is missing from ${evidence.file}`)
  }
}

if (errors.length) {
  console.error("agent recipe check failed")
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}
console.log(`agent recipe check passed: ${recipes.recipes.length} recipes`)

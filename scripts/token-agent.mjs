#!/usr/bin/env node
// Agent-friendly, read-only token query interface.
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const contractPath = path.join(root, "docs/data/agent-tokens.manifest.json")
const contract = JSON.parse(fs.readFileSync(contractPath, "utf8"))
const [command, ...rawArgs] = process.argv.slice(2)
const json = rawArgs.includes("--json")
const args = rawArgs.filter((arg) => arg !== "--json")

function print(value) {
  if (json) {
    console.log(JSON.stringify(value, null, 2))
    return
  }
  console.log(JSON.stringify(value, null, 2))
}

function fail(message) {
  console.error(message)
  process.exit(1)
}

function search(query) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (!terms.length) fail("Usage: npm run tokens -- search <query> [--json]")
  const score = (value) => terms.reduce((total, term) => total + (value.includes(term) ? 1 : 0), 0)
  const tokens = contract.semanticTokens
    .map((token) => ({ token, score: score(JSON.stringify(token).toLowerCase()) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.token.id.localeCompare(b.token.id))
    .map(({ token }) => token)
  const components = contract.componentMappings
    .map((component) => ({ component, score: score(JSON.stringify(component).toLowerCase()) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.component.component.localeCompare(b.component.component))
    .map(({ component }) => component)
  const typographyRoles = (contract.typography?.roles ?? [])
    .map((role) => ({ role, score: score(JSON.stringify(role).toLowerCase()) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.role.id.localeCompare(b.role.id))
    .map(({ role }) => role)
  const typographyRules = [
    ...(contract.typography?.conventions ?? []).map((rule) => ({ kind: "convention", ...rule })),
    ...(contract.typography?.dataRules ?? []).map((rule) => ({ kind: "data", ...rule })),
  ]
    .map((rule) => ({ rule, score: score(JSON.stringify(rule).toLowerCase()) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.rule.id.localeCompare(b.rule.id))
    .map(({ rule }) => rule)
  print({ query, tokens, components, typographyRoles, typographyRules })
}

function resolve(identifier) {
  if (!identifier) fail("Usage: npm run tokens -- resolve <semantic.id|--css-var> [--json]")
  const token = contract.semanticTokens.find((item) => item.id === identifier || item.cssVar === identifier)
  if (!token) fail(`No semantic token found for: ${identifier}`)
  print(token)
}

function component(name) {
  if (!name) fail("Usage: npm run tokens -- component <name> [--json]")
  const mapping = contract.componentMappings.find((item) => item.component.toLowerCase() === name.toLowerCase())
  if (!mapping) fail(`No component token mapping found for: ${name}`)
  print(mapping)
}

switch (command) {
  case "search":
    search(args.join(" "))
    break
  case "resolve":
    resolve(args[0])
    break
  case "component":
    component(args[0])
    break
  default:
    console.log("Token Agent CLI\n  npm run tokens -- search <query> [--json]\n  npm run tokens -- resolve <semantic.id|--css-var> [--json]\n  npm run tokens -- component <name> [--json]")
}

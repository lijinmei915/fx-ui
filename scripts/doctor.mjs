#!/usr/bin/env node
import fs from "node:fs"
import path from "node:path"
import { execFileSync } from "node:child_process"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const json = process.argv.includes("--json")
const checks = [
  { code: "FX_TOKEN_SOURCE_DRIFT", name: "Token source and state mappings", executable: "bash", args: ["scripts/check-tokens-sync.sh"], fix: "npm run build:tokens && npm run check:tokens" },
  { code: "FX_THEME_CONTRACT", name: "Theme contract", executable: process.execPath, args: ["scripts/check-theme-contract.mjs"], fix: "npm run build:tokens && npm run check:theme" },
  { code: "FX_TOKEN_CONTRACT_STALE", name: "Token contract", executable: process.execPath, args: ["scripts/build-agent-token-contract.mjs", "--check"], fix: "npm run build:tokens" },
  { code: "FX_COMPONENT_CONTRACT_STALE", name: "Component contract", executable: process.execPath, args: ["scripts/build-agent-components.mjs", "--check"], fix: "npm run build:agent" },
  { code: "FX_AGENT_QUERY_CONTRACT", name: "Agent query boundary", executable: process.execPath, args: ["scripts/check-agent-query-contract.mjs"], fix: "npm run build:agent && npm run check:agent-query" },
  { code: "FX_AGENT_EXAMPLE_DRIFT", name: "Agent example sources", executable: process.execPath, args: ["scripts/check-agent-examples.mjs"], fix: "Update the source pointer, then run npm run build:agent" },
  { code: "FX_AGENT_RECIPE_DRIFT", name: "Agent scenario recipes", executable: process.execPath, args: ["scripts/check-agent-recipes.mjs"], fix: "Update docs/data/agent-recipes.manifest.json evidence and run npm run check:agent-recipes" },
  { code: "FX_AGENT_CONTEXT_STALE", name: "Agent quick context", executable: process.execPath, args: ["scripts/build-agent-context.mjs", "--check"], fix: "npm run build:agent" },
  { code: "FX_PAGE_BUILD_KIT_INVALID", name: "Page build kit", executable: process.execPath, args: ["scripts/check-page-build-kit.mjs"], fix: "检查 docs/data/page-build-kit.manifest.json 的 block/generator 来源" },
  { code: "FX_COMPONENT_API_DRIFT", name: "Component source, API and document contract", executable: process.execPath, args: ["scripts/check-components-manifest.mjs"], fix: "npm run check:components" },
  { code: "FX_COMPONENT_DOC_DRIFT", name: "Component documentation API tables", executable: process.execPath, args: ["scripts/check-component-docs.mjs"], fix: "node scripts/check-component-docs.mjs" },
  { code: "FX_DOC_SITE_DRIFT", name: "Documentation examples and site contract", executable: process.execPath, args: ["scripts/check-doc-site-contract.mjs"], fix: "npm run check:doc-site" },
  { code: "FX_AGENT_UI_CONTRACT", name: "Agent UI contract", executable: process.execPath, args: ["scripts/check-agent-ui-contract.mjs"], fix: "npm run check:agent-ui" },
]
const results = checks.map(({ code, name, executable, args, fix }) => {
  try {
    const output = execFileSync(executable, args.map((arg) => arg.startsWith("scripts/") ? path.join(root, arg) : arg), { cwd: root, stdio: "pipe", encoding: "utf8" }).trim()
    return { code, name, status: "pass", detail: output.split("\n").at(-1) }
  } catch (error) {
    const output = `${error.stdout ?? ""}\n${error.stderr ?? ""}`.trim()
    return { code, name, status: "fail", fix, detail: output.split("\n").filter(Boolean).at(-1) ?? "Check failed" }
  }
})
for (const [file, code] of [["docs/data/agent-context.md", "FX_AGENT_CONTEXT_MISSING"], ["docs/data/agent-components.manifest.json", "FX_COMPONENT_CONTRACT_MISSING"], ["docs/data/agent-tokens.manifest.json", "FX_TOKEN_CONTRACT_MISSING"]]) {
  const exists = fs.existsSync(path.join(root, file))
  results.push({ code, name: file, status: exists ? "pass" : "fail", ...(exists ? {} : { fix: file.includes("agent-tokens") ? "npm run build:tokens" : "npm run build:agent" }) })
}
const result = { status: results.every((item) => item.status === "pass") ? "ready" : "repair-needed", checks: results, next: "npm run check:all" }
if (json) console.log(JSON.stringify(result, null, 2)); else {
  console.log(`fx-ui doctor: ${result.status}`)
  for (const item of results) console.log(`${item.status === "pass" ? "PASS" : "FAIL"} [${item.code}] ${item.name}${item.fix && item.status === "fail" ? ` -> ${item.fix}` : ""}${item.detail ? `\n  ${item.detail}` : ""}`)
  console.log(`Next: ${result.next}`)
}
if (result.status !== "ready") process.exit(1)

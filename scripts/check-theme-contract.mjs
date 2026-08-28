#!/usr/bin/env node
// Validate the derived Theme Contract without creating or applying a new theme.
import fs from "node:fs"
import path from "node:path"
import { execFileSync } from "node:child_process"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const json = process.argv.includes("--json")
const contract = JSON.parse(fs.readFileSync(path.join(root, "docs/data/agent-tokens.manifest.json"), "utf8"))
const registry = JSON.parse(fs.readFileSync(path.join(root, "registry/fx-theme.json"), "utf8"))
const presets = JSON.parse(fs.readFileSync(path.join(root, "docs/data/theme-presets.manifest.json"), "utf8"))
const theme = contract.themeContract
const checks = []

function add(code, name, passed, detail, fix) {
  checks.push({ code, name, status: passed ? "pass" : "fail", detail, ...(passed ? {} : { fix }) })
}

const semanticIds = new Set(contract.semanticTokens?.map((token) => token.id))
const replaceable = theme?.replaceableTokens ?? []
const protectedTokens = theme?.protectedTokens ?? []
const replaceableIds = new Set(replaceable.map((token) => token.id))
const protectedIds = new Set(protectedTokens.map((token) => token.id))
add("FX_THEME_CONTRACT_SHAPE", "Theme contract shape", theme?.status === "published-multi-mode" && theme?.truthSource === presets.truthSource && JSON.stringify(theme?.supportedModes) === JSON.stringify(presets.publication.publishedModes) && theme.protectedStructuralSources?.length === 2 && theme.qualityEvidence === presets.publication.qualityEvidence, "Theme contract declares the audited published modes and protected structural boundary.", "Run npm run build:tokens and review the Theme Preset contract / audit evidence.")
add("FX_THEME_TOKEN_SCOPE", "Theme token scope", replaceable.length > 0 && protectedTokens.length > 0 && [...replaceableIds, ...protectedIds].every((id) => semanticIds.has(id)) && ![...replaceableIds].some((id) => protectedIds.has(id)), "Replaceable and protected token sets are disjoint semantic-token subsets.", "Run npm run build:tokens; then fix token categories or the Theme Contract derivation.")
add("FX_THEME_INTERACTION_STATES", "Theme interaction state groups", (theme?.requiredInteractionGroups ?? []).every((group) => semanticIds.has(group.semanticRoleTokenId) && Object.keys(group.states ?? {}).length > 0), "Every declared interaction group has a semantic default token and state ladder.", "Update interactionLadder in docs/data/design-tokens.json after changing theme states.")
add("FX_THEME_REGISTRY_SCOPE", "Theme registry scope", JSON.stringify(Object.keys(registry.cssVars ?? {}).sort()) === JSON.stringify((theme?.supportedModes ?? []).slice().sort()), "The distributable registry exposes exactly the modes declared by the Theme Contract.", "Remove undeclared modes from registry/fx-theme.json or update the Theme Contract through the token SSOT flow.")

for (const [code, executable, args, fix] of [
  ["FX_TOKEN_SOURCE_DRIFT", "bash", ["scripts/check-tokens-sync.sh"], "Sync docs/data/design-tokens.json and Foundation topic docs from generated Token CSS."],
  ["FX_TOKEN_CONTRACT_STALE", process.execPath, ["scripts/build-agent-token-contract.mjs", "--check"], "Run npm run build:tokens."],
  ["FX_THEME_INTERACTION_DRIFT", process.execPath, ["scripts/check-interaction-tokens.mjs"], "Use semantic token state values instead of color-mix or opacity."],
]) {
  try {
    const output = execFileSync(executable, args.map((arg) => arg.startsWith("scripts/") ? path.join(root, arg) : arg), { cwd: root, encoding: "utf8", stdio: "pipe" }).trim()
    add(code, "Existing theme governance", true, output.split("\n").at(-1), fix)
  } catch (error) {
    const output = `${error.stdout ?? ""}\n${error.stderr ?? ""}`.trim().split("\n").filter(Boolean).at(-1) ?? "Check failed"
    add(code, "Existing theme governance", false, output, fix)
  }
}

const result = { status: checks.every((item) => item.status === "pass") ? "ready" : "repair-needed", themeStatus: theme?.status, checks }
if (json) console.log(JSON.stringify(result, null, 2)); else {
  console.log(`theme contract: ${result.status}`)
  for (const item of checks) console.log(`${item.status === "pass" ? "PASS" : "FAIL"} [${item.code}] ${item.name}${item.status === "fail" ? ` -> ${item.fix}` : ""}`)
}
if (result.status !== "ready") process.exit(1)

#!/usr/bin/env node
// Guard the stable Agent-query boundary; aliases and ranking remain implementation details.
import fs from "node:fs"
import path from "node:path"
import { execFileSync } from "node:child_process"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const contract = JSON.parse(fs.readFileSync(path.join(root, "docs/data/agent-components.manifest.json"), "utf8"))
const requiredPolicy = [
  "explainMatches",
  "componentBeforeToken",
  "apiSourceRequiredBeforeImplementation",
  "playgroundControlsAreNotComponentApi",
  "examplesAreSourcePointersOnly",
  "plansUseVerifiedPathsOnly",
  "impactUsesDeclaredReferencesOnly",
  "examplesAreVerifiable",
  "recipesUseProvenCompositionsOnly",
]

for (const key of requiredPolicy) {
  if (contract.queryPolicy?.[key] !== true) throw new Error(`Missing Agent query policy: ${key}`)
}

for (const component of contract.components) {
  if (!component.apiSource) throw new Error(`${component.name} is missing apiSource`)
  if (component.playgroundControls && component.playgroundControls.notComponentApi !== true) {
    throw new Error(`${component.name} playground controls must be marked as non-API`)
  }
  if (component.examples && !component.examples.sourceFile) {
    throw new Error(`${component.name} examples must point to a real source file`)
  }
}

const result = JSON.parse(execFileSync(process.execPath, ["scripts/fx-agent.mjs", "search", "邮箱输入", "--detail", "brief", "--json"], { cwd: root, encoding: "utf8" }))
const input = result.components.find((component) => component.name === "Input")
if (!input?.matchedBy?.length || result.components[0]?.name !== "Input") {
  throw new Error("Intent search must return Input first with explainable match evidence")
}

for (const agent of ["codex", "claude", "cursor"]) {
  const init = JSON.parse(execFileSync(process.execPath, ["scripts/fx-agent.mjs", "init", "--agent", agent, "--json"], { cwd: root, encoding: "utf8" }))
  if (init.agent !== agent || init.mode !== "copy-snippet-only" || !init.snippet?.some((line) => line.includes("AGENTS.md"))) {
    throw new Error(`Agent init contract is invalid for ${agent}`)
  }
}

const listPlan = JSON.parse(execFileSync(process.execPath, ["scripts/fx-agent.mjs", "plan", "客户列表页 搜索 筛选 分页", "--name", "客户", "--slug", "customer", "--json"], { cwd: root, encoding: "utf8" }))
if (listPlan.status !== "ready" || listPlan.archetype?.id !== "list" || !listPlan.archetype.generator.includes("--slug customer") || !listPlan.forbidden?.length) {
  throw new Error("List-page intent must resolve to the verified generator path with constraints")
}

const formPlan = JSON.parse(execFileSync(process.execPath, ["scripts/fx-agent.mjs", "plan", "新建客户表单", "--json"], { cwd: root, encoding: "utf8" }))
if (formPlan.status !== "blocked" || formPlan.archetype?.id !== "form") {
  throw new Error("Unverified form intent must stop at the needs-block boundary")
}

const componentImpact = JSON.parse(execFileSync(process.execPath, ["scripts/fx-agent.mjs", "impact", "component", "Input", "--json"], { cwd: root, encoding: "utf8" }))
if (componentImpact.truthSource?.file !== "src/components/ui/input.tsx" || !componentImpact.declaredReferences?.examples?.length || !componentImpact.requiredChecks?.includes("npm run check:agent-examples")) {
  throw new Error("Component impact must report its declared source, example, and validation path")
}

const tokenImpact = JSON.parse(execFileSync(process.execPath, ["scripts/fx-agent.mjs", "impact", "token", "semantic.destructive", "--json"], { cwd: root, encoding: "utf8" }))
if (tokenImpact.truthSource?.file !== "theme/fx-theme.css" || !tokenImpact.declaredReferences?.declaredConsumers?.includes("Input")) {
  throw new Error("Token impact must report the CSS truth source and declared consumers")
}

const emailRecipe = JSON.parse(execFileSync(process.execPath, ["scripts/fx-agent.mjs", "recipe", "邮箱字段校验", "--json"], { cwd: root, encoding: "utf8" }))
if (emailRecipe.recipe?.id !== "email-field-validation" || !emailRecipe.recipe.components.includes("Field") || !emailRecipe.requiredChecks?.includes("npm run check:agent-recipes")) {
  throw new Error("Recipe query must return the declared email validation composition and its validation path")
}

console.log("agent query contract check passed")

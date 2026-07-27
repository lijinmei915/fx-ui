import { access, readFile } from "node:fs/promises"

const root = new URL("../", import.meta.url)

async function readText(path) {
  return readFile(new URL(path, root), "utf8")
}

async function readJson(path) {
  return JSON.parse(await readText(path))
}

async function fileExists(path) {
  try {
    await access(new URL(path, root))
    return true
  } catch {
    return false
  }
}

function assertIncludes(source, value, label, errors) {
  if (!source.includes(value)) {
    errors.push(`${label} is missing: ${value}`)
  }
}

const manifest = await readJson("docs/data/agent-ui.manifest.json")
const visualManifest = await readJson("docs/data/agent-ui-visual.manifest.json")
const errors = []

if (manifest.format !== "fx-ui/agent-ui-manifest") {
  errors.push("agent-ui manifest format must be fx-ui/agent-ui-manifest")
}

if (visualManifest.format !== "fx-ui/agent-ui-visual-manifest") {
  errors.push("agent-ui visual manifest format must be fx-ui/agent-ui-visual-manifest")
}

for (const path of [manifest.truthSource, manifest.humanDoc, manifest.componentDoc, visualManifest.truthSource]) {
  if (!(await fileExists(path))) {
    errors.push(`agent-ui manifest references missing path: ${path}`)
  }
}

const [source, humanDoc, componentDoc, visualDoc, appSource, agentPageSource, packageJsonText] = await Promise.all([
  readText(manifest.truthSource),
  readText(manifest.humanDoc),
  readText(manifest.componentDoc),
  readText(visualManifest.truthSource),
  readText(visualManifest.page),
  readText("src/pages/docs/components/agent-surface-page.tsx"),
  readText("package.json"),
])
const packageJson = JSON.parse(packageJsonText)
const packageScripts = packageJson.scripts ?? {}

if (!("check:agent-ui" in packageScripts)) {
  errors.push("package.json must expose check:agent-ui")
}

for (const snippet of [
  "type AgentSurfaceSchema",
  "type AgentSurfaceEvent",
  "function AgentSurface",
  "function AgentSurfaceBlockView",
  "function AgentActionButtons",
  "onAction?.({ surfaceId, event: action.event, payload: action.payload })",
]) {
  assertIncludes(source, snippet, "AgentSurface source", errors)
}

for (const slot of [
  manifest.surface?.rootSlot,
  manifest.safety?.unsupportedSlot,
  "data-slot=\"agent-surface-actions\"",
]) {
  assertIncludes(source, slot, "AgentSurface source slot", errors)
  assertIncludes(componentDoc, slot, "AgentSurface component doc slot", errors)
}

const blockTypes = new Set()
for (const block of manifest.blocks ?? []) {
  if (blockTypes.has(block.type)) {
    errors.push(`agent-ui block type is duplicated: ${block.type}`)
  }
  blockTypes.add(block.type)

  for (const key of ["type", "sourceType", "slot", "purpose", "requiredFields", "optionalFields"]) {
    if (!block[key] || (Array.isArray(block[key]) && block[key].length === 0)) {
      errors.push(`agent-ui block "${block.type}" is missing ${key}`)
    }
  }

  assertIncludes(source, `type: "${block.type}"`, `AgentSurface source block ${block.type}`, errors)
  assertIncludes(source, block.sourceType, `AgentSurface source type ${block.sourceType}`, errors)
  assertIncludes(source, block.slot, `AgentSurface source slot ${block.type}`, errors)
  assertIncludes(humanDoc, `\`${block.type}\``, `Agent UI human doc block ${block.type}`, errors)
  assertIncludes(componentDoc, `\`${block.type}\``, `AgentSurface component doc block ${block.type}`, errors)

  for (const field of block.requiredFields ?? []) {
    assertIncludes(humanDoc, field, `Agent UI human doc required field ${block.type}.${field}`, errors)
  }
}

for (const forbidden of manifest.safety?.forbiddenFields ?? []) {
  assertIncludes(humanDoc, `\`${forbidden}\``, `Agent UI human doc forbidden field ${forbidden}`, errors)
}

for (const forbiddenRuntime of manifest.safety?.forbiddenRuntime ?? []) {
  assertIncludes(humanDoc, forbiddenRuntime, `Agent UI human doc forbidden runtime ${forbiddenRuntime}`, errors)
}

for (const variant of manifest.action?.allowedValues?.variant ?? []) {
  assertIncludes(source, `"${variant}"`, `AgentSurface source action variant ${variant}`, errors)
  assertIncludes(humanDoc, `\`${variant}\``, `Agent UI human doc action variant ${variant}`, errors)
}

for (const field of manifest.action?.requiredFields ?? []) {
  assertIncludes(source, `${field}: string`, `AgentAction source required field ${field}`, errors)
  assertIncludes(humanDoc, `\`${field}\``, `Agent UI human doc action required field ${field}`, errors)
}

assertIncludes(humanDoc, "Action 只是事件，不是代码", "Agent UI human doc action rule", errors)
assertIncludes(humanDoc, "先做轻协议，后看是否接重协议", "Agent UI protocol strategy", errors)
assertIncludes(humanDoc, "#agent-surface-playground", "Agent UI human doc playground anchor", errors)
assertIncludes(componentDoc, "Agent 只能生成 JSON 意图", "AgentSurface component doc JSON intent rule", errors)
assertIncludes(componentDoc, "#agent-surface-playground", "AgentSurface component doc playground anchor", errors)
assertIncludes(source, "不支持的 Agent UI 块", "AgentSurface unsupported behavior", errors)
assertIncludes(agentPageSource, "agent-surface-playground", "AgentSurface page playground section", errors)
assertIncludes(agentPageSource, "setMockJson", "AgentSurface page playground input state", errors)

if (!manifest.playground?.pageAnchor || !manifest.playground?.purpose || !Array.isArray(manifest.playground?.rules)) {
  errors.push("agent-ui manifest must include playground pageAnchor, purpose, and rules")
}

for (const key of ["principle", "lightProtocol", "heavyProtocolRisk", "upgradeWhen"]) {
  if (!manifest.strategy?.[key] || (Array.isArray(manifest.strategy[key]) && manifest.strategy[key].length === 0)) {
    errors.push(`agent-ui manifest strategy is missing ${key}`)
  }
}

for (const reference of manifest.references ?? []) {
  for (const key of ["name", "url", "borrow", "defer"]) {
    if (!reference[key]) {
      errors.push(`agent-ui manifest reference is missing ${key}`)
    }
  }
  assertIncludes(humanDoc, reference.name, `Agent UI human doc reference ${reference.name}`, errors)
}

if (!Array.isArray(manifest.scenarioMap) || manifest.scenarioMap.length < 4) {
  errors.push("agent-ui manifest must include scenarioMap with high-frequency scenarios")
}

for (const scenario of manifest.scenarioMap ?? []) {
  for (const key of ["scenario", "description", "block", "phase"]) {
    if (!scenario[key]) {
      errors.push(`agent-ui manifest scenario is missing ${key}`)
    }
  }

  assertIncludes(humanDoc, scenario.scenario, `Agent UI human doc scenario ${scenario.scenario}`, errors)

  if (scenario.phase === "phase-1" && !blockTypes.has(scenario.block)) {
    errors.push(`agent-ui phase-1 scenario "${scenario.scenario}" points to a block that is not implemented: ${scenario.block}`)
  }
}

assertIncludes(visualDoc, "视觉气质参考 C 端", "Agent UI visual doc C-end principle", errors)
assertIncludes(visualDoc, "底层能力仍用 fx-ui", "Agent UI visual doc fx-ui foundation", errors)
assertIncludes(appSource, "agent-surface-visual", "AgentSurface page visual section", errors)

for (const key of ["principle", "isSubsystemOf", "mustUse", "mustNotCreate"]) {
  if (!visualManifest.positioning?.[key] || (Array.isArray(visualManifest.positioning[key]) && visualManifest.positioning[key].length === 0)) {
    errors.push(`agent-ui visual manifest positioning is missing ${key}`)
  }
}

for (const reference of visualManifest.references ?? []) {
  for (const key of ["name", "borrow", "avoid"]) {
    if (!reference[key]) {
      errors.push(`agent-ui visual manifest reference is missing ${key}`)
    }
  }
  assertIncludes(visualDoc, reference.name, `Agent UI visual doc reference ${reference.name}`, errors)
}

for (const principle of visualManifest.principles ?? []) {
  assertIncludes(visualDoc, principle, `Agent UI visual doc principle ${principle}`, errors)
}

for (const block of visualManifest.blockVisualRules ?? []) {
  if (!blockTypes.has(block.block)) {
    errors.push(`agent-ui visual rule points to a block that is not implemented: ${block.block}`)
  }
  assertIncludes(visualDoc, `\`${block.block}\``, `Agent UI visual doc block ${block.block}`, errors)
}

if (errors.length > 0) {
  console.error("agent-ui contract check failed:\n")
  for (const error of errors) {
    console.error(`- ${error}`)
  }
  process.exit(1)
}

console.log(`agent-ui contract check passed: ${blockTypes.size} block types, ${manifest.action?.allowedValues?.variant?.length ?? 0} action variants.`)

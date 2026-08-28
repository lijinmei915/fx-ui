#!/usr/bin/env node
// 从 design-tokens manifest 派生 Agent 可查询的 token contract；不创建第二份视觉真相源。
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const sourcePath = path.join(root, "docs/data/design-tokens.json")
const outputPath = path.join(root, "docs/data/agent-tokens.manifest.json")
const presetPath = path.join(root, "docs/data/theme-presets.manifest.json")
const source = JSON.parse(fs.readFileSync(sourcePath, "utf8"))
const presets = JSON.parse(fs.readFileSync(presetPath, "utf8"))

const variablePattern = /var\((--[\w-]+)/g
const tokenByName = new Map(
  [...(source.primitive ?? []), ...(source.semantic ?? [])].map((token) => [token.name, token])
)
const semanticNames = new Set((source.semantic ?? []).map((token) => token.name))

function tokenId(name) {
  return `semantic.${name.replace(/^--/, "")}`
}

function references(value) {
  return [...String(value ?? "").matchAll(variablePattern)].map((match) => match[1])
}

function resolveLineage(name, seen = new Set()) {
  if (seen.has(name)) return []
  seen.add(name)
  const token = tokenByName.get(name)
  if (!token) return []
  const direct = references(token.value)
  return [...direct, ...direct.flatMap((reference) => resolveLineage(reference, seen))]
}

function unique(values) {
  return [...new Set(values)]
}

function buildContract() {
  const usage = source.componentUsage ?? []
  const consumersByToken = new Map()
  for (const component of usage) {
    for (const name of component.tokens ?? []) {
      if (!semanticNames.has(name)) continue
      const consumers = consumersByToken.get(name) ?? []
      consumers.push(component.component)
      consumersByToken.set(name, consumers)
    }
  }

  const semanticTokens = (source.semantic ?? []).map((token) => ({
    id: tokenId(token.name),
    cssVar: token.name,
    tailwind: token.tailwind,
    category: token.category,
    usage: token.usage,
    resolvesTo: unique(resolveLineage(token.name)),
    consumers: unique(consumersByToken.get(token.name) ?? []).sort(),
  }))

  const byName = new Map(semanticTokens.map((token) => [token.cssVar, token]))
  const interactionStates = (source.interactionLadder?.colors ?? []).map((color) => ({
    role: color.name,
    semanticRoleTokenId: byName.get(color.default)?.id,
    states: Object.fromEntries(
      ["default", "hover", "active", "disabled"]
        .filter((state) => color[state])
        .map((state) => {
          return [state, {
            paletteStep: color.steps?.[state] ?? source.interactionLadder?.solid?.[state],
          }]
        })
    ),
  }))

  const protectedTokens = semanticTokens.filter((token) =>
    token.category === "radius-source" || token.category === "font-source" || token.cssVar.startsWith("--radius") || token.cssVar === "--overlay-blur"
  ).map((token) => ({ id: token.id, cssVar: token.cssVar, reason: "Structural geometry, typography, or effect behavior is not a theme override surface." }))
  const protectedIds = new Set(protectedTokens.map((token) => token.id))
  const replaceableTokens = semanticTokens.filter((token) => !protectedIds.has(token.id)).map((token) => ({
    id: token.id, cssVar: token.cssVar, category: token.category, usage: token.usage,
  }))

  return {
    schemaVersion: 1,
    format: "fx-ui/agent-token-contract",
    derivedFrom: {
      tokenManifest: "docs/data/design-tokens.json",
      truthSource: source.truthSource,
      humanDoc: source.humanDoc,
    },
    policy: {
      primitiveAccess: "internal-only",
      componentTokenLayer: "Component Hooks are admission-only. Default to Global Semantic; create --fds-c-* only with the governed owner, semantic-gap, contract-test, and visual-test evidence.",
      callingRule: "Agents select semantic tokens or declared component state mappings; they do not select primitive palette values.",
    },
    componentHooks: source.componentHooks,
    semanticTokens,
    componentMappings: usage.map((component) => ({
      component: component.component,
      source: component.source,
      tokenIds: (component.tokens ?? [])
        .filter((name) => semanticNames.has(name))
        .map(tokenId),
      stateMappings: (component.stateMappings ?? []).map((mapping) => ({
        ...mapping,
        tokenId: tokenId(mapping.token),
      })),
      typographyMappings: component.typographyMappings ?? [],
      rules: component.rules ?? [],
    })),
    typography: source.typography,
    shape: source.shape,
    interactionStates,
    themeContract: {
      status: presets.publication.publishedModes.length > 1 ? "published-multi-mode" : "single-mode",
      truthSource: presets.truthSource,
      humanDoc: source.humanDoc,
      supportedModes: presets.publication.publishedModes,
      unsupportedModes: [...presets.publication.runtimePreviewModes.filter((mode) => !presets.publication.publishedModes.includes(mode)), "custom-theme-build"],
      applyPolicy: "A theme may replace declared semantic visual tokens only. It must not use primitive palette values, add page-level visual overrides, or change protected structural tokens.",
      replaceableTokens,
      protectedTokens,
      protectedStructuralSources: [
        { source: "docs/data/design-tokens.json#spacing", reason: "Layout spacing is a structural scale, not a theme override surface." },
        { source: "docs/data/design-tokens.json#shape", reason: "Shape roles and concentric-radius rules are structural, not a theme override surface." },
      ],
      requiredInteractionGroups: interactionStates,
      qualityEvidence: presets.publication.qualityEvidence,
      buildBoundary: "npm run fx -- theme build regenerates governed CSS/JSON artifacts and audits them; it does not change component APIs.",
    },
    commands: {
      search: "npm run tokens -- search <query> [--json]",
      resolve: "npm run tokens -- resolve <semantic.id|--css-var> [--json]",
      component: "npm run tokens -- component <name> [--json]",
    },
  }
}

const output = JSON.stringify(buildContract(), null, 2) + "\n"
if (process.argv.includes("--check")) {
  const current = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, "utf8") : ""
  if (current !== output) {
    console.error("agent token contract is stale. Run: npm run build:tokens")
    process.exit(1)
  }
  console.log("agent token contract check passed")
} else {
  fs.writeFileSync(outputPath, output)
  console.log(`built docs/data/agent-tokens.manifest.json: ${source.semantic?.length ?? 0} semantic tokens, ${source.componentUsage?.length ?? 0} component mappings`)
}

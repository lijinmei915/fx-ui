#!/usr/bin/env node
// Unified, read-only Agent interface for components, tokens, page kits and diagnostics.
import fs from "node:fs"
import path from "node:path"
import { execFileSync } from "node:child_process"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), "utf8"))
const [command, ...rawArgs] = process.argv.slice(2)
const json = rawArgs.includes("--json")
const args = rawArgs.filter((arg) => arg !== "--json")
const components = read("docs/data/agent-components.manifest.json")
const tokens = read("docs/data/agent-tokens.manifest.json")
const themePresets = read("docs/data/theme-presets.manifest.json")
const buildKit = read("docs/data/page-build-kit.manifest.json")
const recipes = read("docs/data/agent-recipes.manifest.json")
const layered = read("docs/data/layered-assets.manifest.json")
const quality = read("docs/data/component-quality.manifest.json")
const qualityByName = new Map((quality.components ?? []).map((item) => [item.name.toLowerCase(), item]))

const intentAliases = {
  邮箱: ["email", "mail", "邮箱地址"],
  输入框: ["input", "输入", "录入", "表单"],
  校验: ["invalid", "error", "错误", "验证", "校验", "FieldError"],
  搜索: ["search", "查询", "检索", "关键词"],
  清除: ["clear", "清除", "reset"],
  密码: ["password", "密码", "显隐"],
  分页: ["pagination", "分页", "页码"],
  列表: ["list", "table", "列表", "表格"],
  日期: ["date", "datepicker", "日历", "日期"],
  按钮: ["button", "操作", "动作"],
}

const fieldWeights = [
  ["name", 8], ["role", 6], ["category", 4], ["intent", 5],
  ["usageRules", 4], ["nativeStates", 3], ["variants", 3],
  ["sizes", 2], ["tokenRefs", 2], ["doc", 1], ["source", 1],
]
const lowSignalTerms = new Set(["input", "输入", "录入", "表单"])

function print(value) { console.log(JSON.stringify(value, null, 2)) }
function fail(message) { console.error(message); process.exit(1) }
function parseOptions(input) {
  const values = [...input]
  let detail = "full"
  const index = values.indexOf("--detail")
  if (index >= 0) {
    detail = values[index + 1] || "full"
    values.splice(index, 2)
  }
  if (!["brief", "full", "source"].includes(detail)) fail(`Unknown detail: ${detail}. Use brief, full, or source.`)
  return { values, detail }
}

function readOption(input, name) {
  const index = input.indexOf(name)
  return index >= 0 ? input[index + 1] : undefined
}

function expandTerms(query) {
  const normalized = query.trim().toLowerCase()
  const terms = new Set(normalized.split(/\s+/).filter(Boolean))
  const matchedIntents = []
  for (const [intent, aliases] of Object.entries(intentAliases)) {
    const candidates = [intent, ...aliases].map((value) => value.toLowerCase())
    if (candidates.some((value) => normalized.includes(value))) {
      matchedIntents.push(intent)
      candidates.forEach((value) => terms.add(value))
    }
  }
  return { terms: [...terms], matchedIntents }
}

function weightedScore(item, terms) {
  let total = 0
  const matchedBy = []
  for (const [field, weight] of fieldWeights) {
    const value = item[field]
    const text = JSON.stringify(value ?? "").toLowerCase()
    const hits = terms.filter((term) => {
      if (lowSignalTerms.has(term) && ["tokenRefs", "source", "doc"].includes(field)) return false
      return text.includes(term)
    })
    if (hits.length) {
      total += weight * Math.min(hits.length, 3)
      matchedBy.push({ field, terms: hits })
    }
  }
  return { score: total, matchedBy }
}

function projectComponent(item, detail) {
  const qualityEvidence = qualityByName.get(item.name?.toLowerCase())
  if (detail === "full") return qualityEvidence ? { ...item, quality: qualityEvidence } : item
  const brief = {
    name: item.name, role: item.role, category: item.category, layer: item.layer,
    source: item.source, doc: item.doc, capabilities: [
      ...(item.nativeStates ?? []).map((state) => `state:${state}`),
      ...(item.variants ?? []).map((variant) => `variant:${variant}`),
      ...(item.sizes ?? []).map((size) => `size:${size}`),
    ],
    usageRules: item.usageRules?.slice(0, 3),
    examples: item.examples,
    quality: qualityEvidence ? {
      status: qualityEvidence.status,
      gaps: qualityEvidence.gaps,
      playground: qualityEvidence.playground,
      visual: qualityEvidence.visual,
    } : undefined,
  }
  if (detail === "source") return { ...item, apiSource: item.apiSource, sourceReadRequired: true, quality: qualityEvidence }
  return brief
}

function project(item, detail) {
  if (detail === "full") return item
  if (item.name) return projectComponent(item, detail)
  return item
}

function search(query, detail) {
  const { terms, matchedIntents } = expandTerms(query)
  if (!terms.length) fail("Usage: npm run fx -- search <intent> [--json]")
  const rank = (items) => items.map((item) => ({ item, ...weightedScore(item, terms) }))
    .filter((entry) => entry.score > 0).sort((a, b) => b.score - a.score)
    .map(({ item, score: resultScore, matchedBy }) => ({ ...project(item, detail), score: resultScore, matchedBy }))
  print({ query, normalizedQuery: terms.join(" "), matchedIntents, detail, components: rank(components.components), tokens: rank(tokens.semanticTokens), pageArchetypes: rank(buildKit.archetypes) })
}

function init(agent) {
  const targets = {
    codex: "AGENTS.md",
    claude: "CLAUDE.md",
    cursor: ".cursor/rules/fx-ui.mdc",
  }
  if (!agent || !targets[agent]) fail("Usage: npm run fx -- init --agent codex|claude|cursor [--json]")
  const readyPages = buildKit.archetypes.filter((item) => item.status === "ready").map((item) => item.id)
  print({
    agent,
    instructionFile: targets[agent],
    mode: "copy-snippet-only",
    boundary: "Do not overwrite existing agent configuration. The repository AGENTS.md remains authoritative.",
    snippet: [
      "This is the fx-ui component repository. Read AGENTS.md before editing.",
      "Query first: npm run fx -- search <intent> --json; then inspect the returned apiSource before writing component code.",
      "Use only declared component APIs, semantic tokens, and ready page build paths. Do not handwrite components, page composition, or visual overrides.",
      "For a component example, use the returned source pointer; do not copy it into a second source of truth.",
      "Before handoff run: npm run check. For visual/page changes also run: npm run test:visual.",
    ],
    currentFacts: { components: components.components.length, semanticTokens: tokens.semanticTokens.length, readyPageArchetypes: readyPages },
  })
}

function plan(query, options) {
  if (!query.trim()) fail("Usage: npm run fx -- plan <intent> [--name <实体名称> --slug <slug>] [--json]")
  const { terms, matchedIntents } = expandTerms(query)
  const candidates = buildKit.archetypes.map((archetype) => {
    const text = JSON.stringify([archetype.name, archetype.intent]).toLowerCase()
    return { archetype, score: terms.filter((term) => text.includes(term)).length }
  }).filter((candidate) => candidate.score > 0)
    .sort((a, b) => b.score - a.score || (a.archetype.status === "ready" ? -1 : 1))

  const selected = candidates[0]?.archetype
  if (!selected) {
    print({
      query, matchedIntents, status: "no-verified-path",
      boundary: "No verified page archetype matches this intent. Do not compose a page ad hoc.",
      next: "Propose the missing block through governance, then register it in docs/data/page-build-kit.manifest.json.",
    })
    return
  }

  if (selected.status !== "ready") {
    print({
      query, matchedIntents, status: "blocked",
      archetype: { id: selected.id, name: selected.name, status: selected.status },
      boundary: selected.constraint,
      next: "Stop page implementation. First create and validate the required block through governance.",
    })
    return
  }

  const name = readOption(options, "--name")
  const slug = readOption(options, "--slug")
  const layeredTemplate = (layered.pageTemplates ?? []).find((item) => item.id === selected.id)
  if ((name && !slug) || (!name && slug)) fail("Plan requires --name and --slug together.")
  const generator = name && slug
    ? selected.generator.replace("<实体名称>", name).replace("<slug>", slug)
    : selected.generator
  print({
    query, matchedIntents, status: "ready",
    archetype: {
      id: selected.id, name: selected.name, generator, source: selected.source,
      frame: selected.frame, dataContract: selected.dataContract,
      layer: layeredTemplate ? { id: layeredTemplate.id, status: layeredTemplate.status, source: layeredTemplate.source, reusable: layeredTemplate.status === "ready" } : undefined,
    },
    sourcePointers: [
      { file: selected.source, purpose: "The generator owns the proven page composition." },
      { file: "docs/PAGES.md", purpose: "Assembly process, block boundaries, and route-registration steps." },
      { file: selected.id === "detail" ? "src/pages/templates/detail-page-block-page.tsx" : selected.id === "form" ? "src/pages/templates/edit-form-block-page.tsx" : "src/pages/templates/customer-list-template.tsx", purpose: "Existing complete page-template reference." },
    ],
    workflow: [
      "Run the generator; do not recreate the frame manually.",
      "Only fill the declared data contract and controlled configuration.",
      "Register the generated route in pageRegistry and docsNav as printed by the generator.",
      "Run npm run check:all and npm run test:visual before handoff.",
    ],
    constraints: selected.constraints,
    forbidden: [
      "Do not replace the generated frame with ad-hoc JSX.",
      "Do not introduce a page type that is marked needs-block.",
      "Do not override component visuals at the page call site.",
    ],
  })
}

function impact(kind, query) {
  if (!["component", "token"].includes(kind) || !query) {
    fail("Usage: npm run fx -- impact component <Name> --json | npm run fx -- impact token <id|cssVar> --json")
  }
  if (kind === "component") {
    const component = components.components.find((item) => item.name.toLowerCase() === query.toLowerCase())
    if (!component) fail(`Unknown component: ${query}`)
    const tokenLinks = component.tokenRefs.map((cssVar) => tokens.semanticTokens.find((token) => token.cssVar === cssVar))
      .filter(Boolean).map((token) => ({ id: token.id, cssVar: token.cssVar, usage: token.usage }))
    const buildPaths = buildKit.archetypes.filter((archetype) => archetype.frame?.includes(component.name))
      .map((archetype) => ({ id: archetype.id, name: archetype.name, status: archetype.status, source: archetype.source }))
    print({
      target: { kind, name: component.name },
      quality: qualityByName.get(component.name.toLowerCase()) ?? null,
      truthSource: { file: component.apiSource, action: "Read this source before changing the component API or visual behavior." },
      declaredReferences: {
        componentManifest: "docs/data/components.manifest.json",
        qualityMatrix: "docs/data/component-quality.manifest.json",
        documentation: component.doc,
        examples: component.examples ? [component.examples] : [],
        playground: component.playgroundControls ? "docs/data/component-playgrounds.manifest.json" : undefined,
        semanticTokens: tokenLinks,
        pageBuildPaths: buildPaths,
        derivedContracts: ["docs/data/agent-components.manifest.json", "docs/data/agent-context.md"],
      },
      requiredChecks: ["npm run check:components", "npm run build:agent", "npm run check:agent-examples", "npm run check"],
      conditionalChecks: [{ when: "The change affects rendered UI, examples, or page composition", command: "npm run test:visual" }],
      boundary: "This report contains only declared contract references. Inspect the listed sources; do not infer a new API or rebuild page composition manually.",
    })
    return
  }

  const token = tokens.semanticTokens.find((item) => item.id.toLowerCase() === query.toLowerCase() || item.cssVar.toLowerCase() === query.toLowerCase())
  if (!token) fail(`Unknown semantic token: ${query}`)
  const componentLinks = components.components.filter((component) => component.tokenRefs.includes(token.cssVar))
    .map((component) => ({ name: component.name, apiSource: component.apiSource, doc: component.doc, examples: component.examples }))
  print({
    target: { kind, id: token.id, cssVar: token.cssVar },
    truthSource: { file: "tokens/source/semantic.tokens.json", action: "Change the governed Semantic source first, then rebuild runtime and token contracts before changing consumers." },
    declaredReferences: {
      tokenMapping: "docs/data/design-tokens.json",
      tokenDocumentation: "docs/TOKENS.md",
      declaredConsumers: token.consumers,
      componentContracts: componentLinks,
      derivedContracts: ["docs/data/agent-tokens.manifest.json", "docs/data/agent-context.md"],
    },
    requiredChecks: ["npm run build:tokens", "npm run check:tokens", "npm run build:agent", "npm run check:agent-examples", "npm run check"],
    conditionalChecks: [{ when: "The token changes rendered UI", command: "npm run test:visual" }],
    boundary: "This report only includes semantic-token consumers declared by the contracts. Do not replace the token with primitive palette values or page-level overrides.",
  })
}

function recipe(query) {
  if (!query.trim()) fail("Usage: npm run fx -- recipe <intent> [--json]")
  const { terms, matchedIntents } = expandTerms(query)
  const candidates = recipes.recipes.map((item) => {
    const text = JSON.stringify([item.name, item.intent]).toLowerCase()
    return { item, score: terms.filter((term) => text.includes(term)).length }
  }).filter((candidate) => candidate.score > 0).sort((a, b) => b.score - a.score)
  const selected = candidates[0]?.item
  if (!selected) {
    print({
      query, matchedIntents, status: "no-proven-recipe",
      boundary: "No proven recipe matches this intent. Do not invent a composition from component names alone.",
      next: "Propose and validate the scenario, then add its composition, acceptance criteria, and evidence to docs/data/agent-recipes.manifest.json.",
    })
    return
  }
  print({
    query, matchedIntents, status: selected.status,
    recipe: selected,
    componentSources: selected.components.map((name) => {
      const component = components.components.find((item) => item.name === name)
      return { name, apiSource: component.apiSource, doc: component.doc, examples: component.examples }
    }),
    requiredChecks: ["npm run check:agent-recipes", "npm run check"],
    conditionalChecks: [{ when: "The recipe changes rendered UI or its documentation example", command: "npm run test:visual" }],
    boundary: "Use the declared composition and acceptance criteria. Read the returned apiSource before implementation; do not turn recipe parts into invented component props.",
  })
}

function qualityQuery(query) {
  if (query.trim() === "--summary" || query.trim() === "summary") {
    const entries = quality.components ?? []
    const statusCounts = (selector) => entries.reduce((counts, item) => {
      const status = selector(item) ?? "unknown"
      counts[status] = (counts[status] ?? 0) + 1
      return counts
    }, {})
    print({
      target: { kind: "component-quality-summary" },
      total: entries.length,
      overall: statusCounts((item) => item.status),
      coverage: {
        api: statusCounts((item) => item.api?.status),
        keyboard: statusCounts((item) => item.keyboard?.status),
        focus: statusCounts((item) => item.focus?.status),
        disabled: statusCounts((item) => item.stateCoverage?.disabled?.status),
        loading: statusCounts((item) => item.stateCoverage?.loading?.status),
        error: statusCounts((item) => item.stateCoverage?.error?.status),
        visual: statusCounts((item) => item.visual?.status),
        playground: statusCounts((item) => item.playground?.status),
        docs: statusCounts((item) => item.docs?.status),
      },
      truthSource: "docs/data/component-quality.manifest.json",
      boundary: "Summary is derived from the quality manifest; inspect fx quality <component> for evidence and gaps.",
    })
    return
  }
  if (!query.trim()) fail("Usage: npm run fx -- quality <component> | quality --summary [--json]")
  const normalized = query.trim().toLowerCase()
  const item = quality.components.find((component) => component.name.toLowerCase() === normalized)
  if (!item) fail(`Unknown quality component: ${query}`)
  print({
    target: { kind: "component-quality", name: item.name },
    status: item.status,
    gaps: item.gaps,
    evidence: {
      api: item.api,
      keyboard: item.keyboard,
      focus: item.focus,
      stateCoverage: item.stateCoverage,
      tokens: item.tokenUsage,
      visual: item.visual,
      playground: item.playground,
      docs: item.docs,
    },
    truthSources: quality.truthSources,
    boundary: "Quality status is derived evidence, not permission to invent missing behavior. Resolve each gap with a real source, manifest entry, or verified test before marking it covered.",
  })
}

function layer(query) {
  const layers = {
    components: layered.components?.sources ?? [],
    hooks: layered.hooks ?? [],
    patterns: layered.patterns ?? [],
    blocks: layered.blocks ?? [],
    "page-templates": layered.pageTemplates ?? [],
  }
  const [requestedLayer, ...queryParts] = query.trim().split(/\s+/)
  const selectedLayer = layers[requestedLayer] ? requestedLayer : "all"
  const textQuery = (selectedLayer === "all" ? [requestedLayer, ...queryParts] : queryParts).join(" ").toLowerCase()
  const source = selectedLayer === "all" ? Object.entries(layers).flatMap(([name, items]) => items.map((item) => ({ ...item, layer: name }))) : layers[selectedLayer].map((item) => ({ ...item, layer: selectedLayer }))
  const matches = source.filter((item) => !textQuery || JSON.stringify(item).toLowerCase().includes(textQuery)).map((item) => {
    const [contractFile, anchor] = (item.source ?? item.contract ?? "").split("#")
    let contract
    if (anchor && contractFile) {
      try {
        const data = read(contractFile)
        const collection = data.recipes ?? data.archetypes ?? []
        contract = anchor ? collection.find((entry) => entry.id === anchor) : data
      } catch {
        contract = undefined
      }
    }
    return {
      ...item,
      reusable: item.status === "ready",
      contract,
    }
  })
  print({
    query,
    layer: selectedLayer,
    matches,
    availableLayers: Object.keys(layers),
    boundary: "Only ready assets are directly reusable. needs-block and needs-review entries require governance evidence before page implementation.",
  })
}

switch (command) {
  case "search": { const options = parseOptions(args); search(options.values.join(" "), options.detail); break }
  case "plan": {
    const planArgs = args.filter((arg, index) => arg !== "--name" && arg !== "--slug" && args[index - 1] !== "--name" && args[index - 1] !== "--slug")
    plan(planArgs.join(" "), args); break
  }
  case "impact": impact(args[0], args.slice(1).join(" ")); break
  case "recipe": recipe(args.join(" ")); break
  case "quality": qualityQuery(args.join(" ")); break
  case "layer": layer(args.join(" ")); break
  case "component": {
    const options = parseOptions(args)
    const item = components.components.find((component) => component.name.toLowerCase() === options.values[0]?.toLowerCase())
    if (!item) fail(`Unknown component: ${options.values[0] ?? ""}`)
    print(project(item, options.detail)); break
  }
  case "build": {
    const archetypeId = args[0]
    const execute = args.includes("--execute")
    const name = readOption(args, "--name")
    const slug = readOption(args, "--slug")
    const force = args.includes("--force")
    const item = buildKit.archetypes.find((archetype) => archetype.id === archetypeId)
    if (!item) fail(`Unknown page archetype: ${args[0] ?? ""}`)
    if (!execute) {
      print({ ...item, execution: { mode: "read-only", command: `npm run fx -- build ${item.id} --execute --name <实体名称> --slug <slug>` } })
      break
    }
    if (item.status !== "ready") fail(`Archetype ${item.id} is ${item.status}; register and validate its block before generation.`)
    const supportedGenerators = new Set(["scripts/gen-list-page.mjs", "scripts/gen-edit-form-page.mjs", "scripts/gen-detail-page.mjs"])
    if (!supportedGenerators.has(item.source)) fail(`No governed executable generator is registered for archetype: ${item.id}`)
    if (!name || !slug) fail("Execution requires --name and --slug.")
    const generatorArgs = [path.join(root, item.source), "--name", name, "--slug", slug]
    if (force) generatorArgs.push("--force")
    const output = execFileSync(process.execPath, generatorArgs, { cwd: root, encoding: "utf8" })
    if (json) print({ status: "generated", archetype: item.id, name, slug, output: output.trim(), source: item.source })
    else process.stdout.write(output)
    break
  }
  case "token": {
    const query = args.join(" ").toLowerCase()
    if (!query) fail("Usage: npm run fx -- token <query> [--json]")
    print(tokens.semanticTokens.filter((token) => JSON.stringify(token).toLowerCase().includes(query))); break
  }
  case "context": console.log(fs.readFileSync(path.join(root, "docs/data/agent-context.md"), "utf8")); break
  case "init": init(readOption(args, "--agent")); break
  case "doctor": execFileSync(process.execPath, [path.join(root, "scripts/doctor.mjs"), ...(json ? ["--json"] : [])], { stdio: "inherit" }); break
  case "theme": {
    const buildTheme = () => {
      const stdio = json ? "pipe" : "inherit"
      execFileSync("npm", ["run", "build:tokens"], { cwd: root, stdio })
      execFileSync("npm", ["run", "build:theme-artifacts"], { cwd: root, stdio })
      execFileSync("npm", ["run", "build:theme-audit"], { cwd: root, stdio })
      execFileSync("npm", ["run", "build:agent"], { cwd: root, stdio })
      execFileSync("npm", ["run", "build:framework-core"], { cwd: root, stdio })
      execFileSync("npm", ["run", "build:theme-release"], { cwd: root, stdio })
    }
    if (args[0] === "build") {
      buildTheme()
      if (json) print({ status: "built", release: read("registry/fx-theme.release.json") })
    }
    else if (!args[0] || args[0] === "show") print({
      status: themePresets.publication.status,
      contractVersion: themePresets.contractVersion,
      semanticContract: tokens.themeContract,
      presetContract: themePresets,
      release: fs.existsSync(path.join(root, "registry/fx-theme.release.json")) ? read("registry/fx-theme.release.json") : null,
    })
    else if (args[0] === "audit") {
      const semantic = JSON.parse(execFileSync(process.execPath, [path.join(root, "scripts/check-theme-contract.mjs"), "--json"], { cwd: root, encoding: "utf8" }))
      const presets = JSON.parse(execFileSync(process.execPath, [path.join(root, "scripts/check-theme-presets.mjs"), "--json"], { cwd: root, encoding: "utf8" }))
      execFileSync(process.execPath, [path.join(root, "scripts/build-theme-audit.mjs"), "--check"], { cwd: root, stdio: "pipe" })
      execFileSync(process.execPath, [path.join(root, "scripts/build-theme-release.mjs"), "--check"], { cwd: root, stdio: "pipe" })
      const quality = read("docs/data/theme-audit.manifest.json")
      const release = read("registry/fx-theme.release.json")
      print({ status: semantic.status === "ready" && presets.status === "ready" && quality.summary.status === "ready" && release.status === "released" ? "ready" : "repair-needed", semantic, presets, quality: quality.summary, release: { version: release.version, status: release.status, publishedModes: release.publishedModes } })
    }
    else if (args[0] === "release") {
      buildTheme()
      print(read("registry/fx-theme.release.json"))
    }
    else fail("Usage: npm run fx -- theme [show|audit|build|release] [--json]")
    break
  }
  case "upgrade": print({ status: "no-migrations", policy: "Add a codemod only for a released breaking API/token rename. No migration is inferred from current source." }); break
  default: console.log("fx Agent CLI\n  npm run fx -- search <intent> --json\n  npm run fx -- recipe <intent> --json\n  npm run fx -- layer [hooks|patterns|blocks|page-templates] [query] --json\n  npm run fx -- quality <component> --json\n  npm run fx -- quality --summary --json\n  npm run fx -- plan <intent> [--name <实体名称> --slug <slug>] --json\n  npm run fx -- impact component <Name> --json\n  npm run fx -- impact token <id|cssVar> --json\n  npm run fx -- component <Name> --detail brief|full|source --json\n  npm run fx -- build <archetype> [--execute --name <实体名称> --slug <slug>] --json\n  npm run fx -- token <query> --json\n  npm run fx -- context\n  npm run fx -- init --agent codex|claude|cursor --json\n  npm run fx -- doctor [--json]\n  npm run fx -- theme [show|audit|build|release]\n  npm run fx -- upgrade")
}

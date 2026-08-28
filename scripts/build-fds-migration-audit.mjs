#!/usr/bin/env node
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const outputPath = "docs/data/fds-migration-audit.manifest.json"
const scriptPath = "scripts/build-fds-migration-audit.mjs"
const read = (file) => fs.readFileSync(path.join(root, file), "utf8")
const json = (file) => JSON.parse(read(file))
const exists = (file) => fs.existsSync(path.join(root, file))

const naming = json("docs/data/token-naming.manifest.json")
const foundation = json("docs/data/fds-foundation.manifest.json")
const semantic = json("docs/data/fds-semantic.manifest.json")
const components = json("docs/data/fds-components.manifest.json")
const release = json("registry/fx-theme.release.json")

const replacementByLegacy = new Map()
const addReplacement = (legacyName, name, layer, sourceId) => {
  if (!legacyName?.startsWith(naming.brand.legacyPrefix)) return
  const current = replacementByLegacy.get(legacyName)
  if (current && current.name !== name) {
    throw new Error(`Conflicting FDS replacements for ${legacyName}: ${current.name} / ${name}`)
  }
  replacementByLegacy.set(legacyName, { legacyName, name, layer, sourceId })
}

for (const token of foundation.tokens) {
  addReplacement(token.legacyName, token.name, token.layer, token.path)
}
for (const token of semantic.tokens) {
  for (const alias of token.aliases ?? []) addReplacement(alias, token.name, "semantic", token.id)
}

const collectFiles = (directory, extensions, excluded = new Set()) => {
  const base = path.join(root, directory)
  if (!fs.existsSync(base)) return []
  const files = []
  const walk = (current) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const absolute = path.join(current, entry.name)
      if (entry.isDirectory()) walk(absolute)
      else {
        const relative = path.relative(root, absolute).split(path.sep).join("/")
        if (extensions.has(path.extname(entry.name)) && !excluded.has(relative)) files.push(relative)
      }
    }
  }
  walk(base)
  return files.sort()
}

const scopeDefinitions = [
  {
    id: "runtime-source",
    purpose: "React runtime, component, block, adapter, and documentation-site source",
    files: collectFiles("src", new Set([".ts", ".tsx", ".css"])),
    nextPhasePolicy: "must-have-zero-legacy-occurrences",
  },
  {
    id: "public-assembly",
    purpose: "The single public CSS assembly entry",
    files: ["theme/fx-theme.css"],
    nextPhasePolicy: "legacy-names-only-as-direct-fds-alias-declarations",
  },
  {
    id: "generated-compatibility-runtime",
    purpose: "Generated FDS truth plus compatibility aliases",
    files: ["theme/foundation.css", "theme/fds-semantic.css", "theme/fds-components.css"],
    nextPhasePolicy: "legacy-aliases-allowed-until-legacy-removal",
  },
  {
    id: "published-artifacts",
    purpose: "Published framework-neutral theme artifacts",
    files: ["registry/fx-theme.css", "registry/fx-theme.contract.json", "registry/fx-theme.json"],
    nextPhasePolicy: "legacy-aliases-allowed-until-legacy-removal",
  },
  {
    id: "documentation",
    purpose: "Human governance and component documentation",
    files: collectFiles("docs", new Set([".md"])),
    nextPhasePolicy: "measured-not-blocking",
  },
  {
    id: "governance-scripts",
    purpose: "Build and enforcement implementation",
    files: collectFiles("scripts", new Set([".mjs", ".js", ".sh"]), new Set([scriptPath])),
    nextPhasePolicy: "measured-not-blocking",
  },
  {
    id: "token-source-compatibility",
    purpose: "DTCG sources that intentionally declare legacy compatibility names",
    files: collectFiles("tokens/source", new Set([".json"])),
    nextPhasePolicy: "legacy-contract-data-allowed-until-legacy-removal",
  },
]

for (const scope of scopeDefinitions) {
  for (const file of scope.files) {
    if (!exists(file)) throw new Error(`Migration audit scope references missing file: ${file}`)
  }
}

const legacyLexeme = /--fx-[A-Za-z0-9${}_-]*/g
const exactLegacyName = /^--fx-[a-z0-9]+(?:-[a-z0-9]+)*(?:--[a-z0-9]+(?:-[a-z0-9]+)*)?$/
const lineNumberAt = (content, index) => content.slice(0, index).split("\n").length
const globToRegExp = (glob) => new RegExp(`^${glob.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replaceAll("*", ".*")}$`)
const legacyDispositions = (naming.migration.legacyDispositions ?? []).map((disposition) => ({
  ...disposition,
  matchers: disposition.selectors.map(globToRegExp),
}))
const findDisposition = (name, file) => legacyDispositions.find((disposition) =>
  disposition.consumerPrefixes.some((prefix) => file.startsWith(prefix)) && disposition.matchers.some((matcher) => matcher.test(name))
) ?? null

const scanFile = (file) => {
  const content = read(file)
  const occurrences = []
  let match
  while ((match = legacyLexeme.exec(content))) {
    const raw = match[0]
    const isExact = exactLegacyName.test(raw)
    const tail = content.slice(match.index + raw.length, match.index + raw.length + 160)
    const directAlias = isExact ? tail.match(/^\s*:\s*var\((--fds-[a-z0-9-]+)\)\s*;/) : null
    const replacement = isExact ? replacementByLegacy.get(raw) ?? null : null
    occurrences.push({
      raw,
      kind: isExact ? "exact" : "dynamic",
      line: lineNumberAt(content, match.index),
      declaration: isExact && /^\s*:/.test(tail),
      directFdsAlias: directAlias?.[1] ?? null,
      replacement: replacement?.name ?? null,
    })
  }

  const grouped = new Map()
  for (const occurrence of occurrences) {
    const key = occurrence.kind === "exact" ? occurrence.raw : occurrence.raw.replace(/\$\{[^}]+\}/g, "{dynamic}").replace(/-+$/, "-*")
    const item = grouped.get(key) ?? {
      name: key,
      kind: occurrence.kind,
      occurrences: 0,
      lines: [],
      replacement: occurrence.replacement,
    }
    item.occurrences += 1
    if (item.lines.length < 8 && !item.lines.includes(occurrence.line)) item.lines.push(occurrence.line)
    grouped.set(key, item)
  }

  return {
    path: file,
    occurrences: occurrences.length,
    exactOccurrences: occurrences.filter((item) => item.kind === "exact").length,
    mappedOccurrences: occurrences.filter((item) => item.replacement).length,
    unmappedExactOccurrences: occurrences.filter((item) => item.kind === "exact" && !item.replacement).length,
    dynamicOccurrences: occurrences.filter((item) => item.kind === "dynamic").length,
    directFdsAliasDeclarations: occurrences.filter((item) => item.directFdsAlias).length,
    names: [...grouped.values()].sort((a, b) => a.name.localeCompare(b.name)),
  }
}

const scanScope = (definition) => {
  const files = definition.files.map(scanFile).filter((file) => file.occurrences > 0)
  const sum = (key) => files.reduce((total, file) => total + file[key], 0)
  const exactNames = new Set(files.flatMap((file) => file.names.filter((item) => item.kind === "exact").map((item) => item.name)))
  const mappedNames = new Set([...exactNames].filter((name) => replacementByLegacy.has(name)))
  return {
    id: definition.id,
    purpose: definition.purpose,
    nextPhasePolicy: definition.nextPhasePolicy,
    scannedFiles: definition.files.length,
    filesWithLegacy: files.length,
    occurrences: sum("occurrences"),
    exactOccurrences: sum("exactOccurrences"),
    mappedOccurrences: sum("mappedOccurrences"),
    unmappedExactOccurrences: sum("unmappedExactOccurrences"),
    dynamicOccurrences: sum("dynamicOccurrences"),
    directFdsAliasDeclarations: sum("directFdsAliasDeclarations"),
    uniqueExactNames: exactNames.size,
    mappedUniqueNames: mappedNames.size,
    replacementCoverage: exactNames.size === 0 ? 1 : Number((mappedNames.size / exactNames.size).toFixed(4)),
    files,
  }
}

const scopes = scopeDefinitions.map(scanScope)
const byId = Object.fromEntries(scopes.map((scope) => [scope.id, scope]))
const runtime = byId["runtime-source"]
const assembly = byId["public-assembly"]
const generated = byId["generated-compatibility-runtime"]
const published = byId["published-artifacts"]

const collectActionItems = (scope) => {
  const items = new Map()
  for (const file of scope.files) {
    for (const name of file.names) {
      if (name.kind === "exact" && name.replacement) continue
      const key = `${name.kind}:${name.name}`
      const item = items.get(key) ?? {
        name: name.name,
        kind: name.kind,
        occurrences: 0,
        reason: name.kind === "dynamic" ? "dynamic-legacy-name-construction" : "missing-authoritative-fds-replacement",
        disposition: findDisposition(name.name, file.path)?.id ?? null,
        consumers: [],
      }
      item.occurrences += name.occurrences
      item.consumers.push({ path: file.path, occurrences: name.occurrences, lines: name.lines })
      items.set(key, item)
    }
  }
  return [...items.values()].sort((a, b) => b.occurrences - a.occurrences || a.name.localeCompare(b.name))
}

const publicScopes = scopes.map((scope) => ({
  ...scope,
  files: scope.files.map(({ names: _names, ...file }) => file),
}))

const baseCurrentCriteria = [
  {
    id: "phase-contracts-agree",
    pass: naming.migration.phases.includes(naming.migration.phase) && foundation.migrationPhase === naming.migration.phase,
    expected: "token naming and generated Foundation contracts declare the same registered phase",
    actual: `naming=${naming.migration.phase}; foundation=${foundation.migrationPhase}`,
  },
  {
    id: "release-carries-fds-truth",
    pass: read("registry/fx-theme.css").includes("--fds-g-") && components.tokens.every((token) => read("registry/fx-theme.css").includes(token.name)),
    expected: "published CSS contains Global FDS truth and every admitted Component Hook",
    actual: `${components.tokens.filter((token) => read("registry/fx-theme.css").includes(token.name)).length}/${components.tokens.length} Component Hooks published`,
  },
  {
    id: "authoritative-replacement-catalog-exists",
    pass: replacementByLegacy.size > 0,
    expected: "Foundation and Semantic contracts expose legacy-to-FDS replacements",
    actual: `${replacementByLegacy.size} replacements`,
  },
]

const fdsPrimaryCriteria = [
  {
    id: "runtime-source-uses-fds-only",
    pass: runtime.occurrences === 0,
    expected: 0,
    actual: runtime.occurrences,
    remediation: "Migrate coherent runtime domains from --fx-* to authoritative --fds-* replacements; do not bulk replace unmapped names.",
  },
  {
    id: "runtime-replacements-are-complete",
    pass: runtime.unmappedExactOccurrences === 0 && runtime.dynamicOccurrences === 0,
    expected: "0 unmapped exact and 0 dynamic occurrences",
    actual: `${runtime.unmappedExactOccurrences} unmapped exact; ${runtime.dynamicOccurrences} dynamic`,
    remediation: "Resolve unmapped structural intent through Primitive references or admitted Component Hooks, and remove dynamic legacy-name construction.",
  },
  {
    id: "public-assembly-keeps-only-direct-fds-aliases",
    pass: assembly.occurrences === assembly.directFdsAliasDeclarations,
    expected: "every --fx-* occurrence is a direct var(--fds-*) alias declaration",
    actual: `${assembly.directFdsAliasDeclarations}/${assembly.occurrences} direct aliases`,
    remediation: "Move remaining structural compatibility declarations to generated contracts and make the public assembly consume FDS truth.",
  },
  {
    id: "runtime-and-assembly-have-full-replacement-coverage",
    pass: runtime.unmappedExactOccurrences + assembly.unmappedExactOccurrences === 0,
    expected: 0,
    actual: runtime.unmappedExactOccurrences + assembly.unmappedExactOccurrences,
    remediation: "Add an authoritative replacement in a governed Token layer before changing any unresolved legacy name.",
  },
  {
    id: "runtime-action-items-have-governed-dispositions",
    pass: collectActionItems(runtime).every((item) => item.disposition),
    expected: "every unmapped or dynamic runtime item has a governed disposition",
    actual: `${collectActionItems(runtime).filter((item) => item.disposition).length}/${collectActionItems(runtime).length} classified`,
    remediation: "Classify the item in token-naming.manifest.json before creating a replacement or Hook.",
  },
  {
    id: "published-artifacts-contain-fds-contract",
    pass: read("registry/fx-theme.css").includes("--fds-g-") && components.tokens.every((token) => read("registry/fx-theme.css").includes(token.name)),
    expected: "published CSS contains Global FDS truth and every admitted Component Hook",
    actual: `${components.tokens.filter((token) => read("registry/fx-theme.css").includes(token.name)).length}/${components.tokens.length} Component Hooks published`,
    remediation: "Rebuild theme artifacts from the four-layer Token sources.",
  },
]

const parseMajor = (version) => Number.parseInt(String(version).split(".")[0], 10)
const removalCriteria = [
  {
    id: "major-deprecation-window-satisfied",
    pass: parseMajor(release.version) >= parseMajor(naming.migration.earliestRemovalVersion),
    expected: `release >= ${naming.migration.earliestRemovalVersion}`,
    actual: release.version,
  },
  {
    id: "contract-declares-legacy-removal",
    pass: naming.migration.phase === "legacy-removal",
    expected: "legacy-removal",
    actual: naming.migration.phase,
  },
  {
    id: "runtime-and-published-artifacts-have-no-legacy-prefix",
    pass: runtime.occurrences + assembly.occurrences + generated.occurrences + published.occurrences === 0,
    expected: 0,
    actual: runtime.occurrences + assembly.occurrences + generated.occurrences + published.occurrences,
  },
]

const compatibilityWindowCriteria = [{
  id: "generated-compatibility-window-is-preserved",
  pass: generated.occurrences > 0 && published.occurrences > 0,
  expected: `generated and published compatibility aliases remain available until at least ${naming.migration.earliestRemovalVersion}`,
  actual: `release=${release.version}; generatedLegacy=${generated.occurrences}; publishedLegacy=${published.occurrences}`,
}]

const phaseCriteria = {
  "contract-only": baseCurrentCriteria,
  "dual-write": [...baseCurrentCriteria, ...compatibilityWindowCriteria],
  "fds-primary": [...baseCurrentCriteria, ...fdsPrimaryCriteria, ...compatibilityWindowCriteria],
  "legacy-removal": [...baseCurrentCriteria, ...removalCriteria],
}
const currentCriteria = phaseCriteria[naming.migration.phase] ?? baseCurrentCriteria
const nextPhaseByCurrent = {
  "contract-only": "dual-write",
  "dual-write": "fds-primary",
  "fds-primary": "legacy-removal",
  "legacy-removal": null,
}
const nextPhase = nextPhaseByCurrent[naming.migration.phase]
const nextCriteria = nextPhase === "fds-primary" ? fdsPrimaryCriteria : nextPhase === "legacy-removal" ? removalCriteria : []

const gate = (phase, criteria) => ({
  phase,
  status: criteria.every((criterion) => criterion.pass) ? "ready" : "not-ready",
  criteria,
  blockers: criteria.filter((criterion) => !criterion.pass).map((criterion) => criterion.id),
})

const audit = {
  schemaVersion: 1,
  format: "fds/migration-readiness-audit",
  contractVersion: naming.contractVersion,
  truthSources: [
    "docs/data/token-naming.manifest.json",
    "docs/data/fds-foundation.manifest.json",
    "docs/data/fds-semantic.manifest.json",
    "docs/data/fds-components.manifest.json",
    "registry/fx-theme.release.json",
  ],
  generatedBy: scriptPath,
  currentPhase: naming.migration.phase,
  release: {
    version: release.version,
    aliasIntroducedVersion: naming.migration.aliasIntroducedVersion,
    earliestRemovalVersion: naming.migration.earliestRemovalVersion,
  },
  replacementCatalog: {
    count: replacementByLegacy.size,
    mappings: [...replacementByLegacy.values()].sort((a, b) => a.legacyName.localeCompare(b.legacyName)),
  },
  scopes: publicScopes,
  actionItems: {
    runtimeSource: collectActionItems(runtime),
    publicAssembly: collectActionItems(assembly),
  },
  gates: {
    currentPhase: gate(naming.migration.phase, currentCriteria),
    nextPhase: gate(nextPhase ?? naming.migration.phase, nextCriteria),
    legacyRemoval: gate("legacy-removal", removalCriteria),
  },
  summary: {
    currentPhaseCompliant: currentCriteria.every((criterion) => criterion.pass),
    nextPhase,
    nextPhaseReady: nextCriteria.every((criterion) => criterion.pass),
    nextPhaseBlockers: nextCriteria.filter((criterion) => !criterion.pass).map((criterion) => criterion.id),
    runtimeLegacyFiles: runtime.filesWithLegacy,
    runtimeLegacyOccurrences: runtime.occurrences,
    runtimeUnmappedExactOccurrences: runtime.unmappedExactOccurrences,
    runtimeDynamicOccurrences: runtime.dynamicOccurrences,
  },
}

if (!audit.summary.currentPhaseCompliant) {
  throw new Error(`Current ${audit.currentPhase} phase is not compliant: ${audit.gates.currentPhase.blockers.join(", ")}`)
}

const output = `${JSON.stringify(audit, null, 2)}\n`
if (process.argv.includes("--check")) {
  const current = exists(outputPath) ? read(outputPath) : ""
  if (current !== output) {
    console.error("FDS migration audit is stale; run npm run build:fds-migration-audit")
    process.exit(1)
  }
  console.log(`FDS migration audit passed: phase=${audit.currentPhase}, runtime=${runtime.filesWithLegacy} files/${runtime.occurrences} refs, next=${audit.gates.nextPhase.status}`)
} else {
  fs.writeFileSync(path.join(root, outputPath), output)
  console.log(`built ${outputPath}: phase=${audit.currentPhase}, runtime=${runtime.filesWithLegacy} files/${runtime.occurrences} refs, next=${audit.gates.nextPhase.status}`)
}

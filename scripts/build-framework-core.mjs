#!/usr/bin/env node
// Derive a portable design-system contract from existing fx-ui truth sources.
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { buildPublicStylingHooks } from "./lib/fds-public-hooks.mjs"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), "utf8"))
const exists = (file) => fs.existsSync(path.join(root, file))
const registryPath = "docs/data/framework-adapters.manifest.json"
const outputFile = "docs/data/framework-core.manifest.json"

const registry = read(registryPath)
const sourceData = Object.fromEntries(
  registry.portableCore.sources.map((file) => [file, read(file)]),
)

const forbiddenPortableFragments = [
  ".tsx",
  "src/components/",
  "@base-ui/react",
  "@tabler/icons-react",
]
const implementationSpecificUsageFragments = ["className", "React", "JSX", "Base UI", "Radix"]

const omittedKeys = new Set([
  "apiSource",
  "checks",
  "command",
  "componentDoc",
  "evidence",
  "foundationSource",
  "generator",
  "globalSemanticSource",
  "humanDoc",
  "pageSymbol",
  "playground",
  "playgroundComponent",
  "references",
  "route",
  "screenshot",
  "selector",
  "source",
  "sourceFile",
  "truthSource",
  "updatedAt",
  "visual",
  "visualEvidence",
])

function isPortableString(value) {
  return !forbiddenPortableFragments.some((fragment) => value.includes(fragment))
}

function projectPortable(value) {
  if (Array.isArray(value)) {
    return value.map(projectPortable).filter((entry) => entry !== undefined)
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !omittedKeys.has(key))
        .map(([key, entry]) => [key, projectPortable(entry)])
        .filter(([, entry]) => entry !== undefined),
    )
  }
  if (typeof value === "string" && !isPortableString(value)) return undefined
  return value
}

function normalizeId(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "")
}

function canonicalIconId(name) {
  return name
    .replace(/Icon$/, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase()
}

function assertUnique(values, label) {
  const duplicates = values.filter((value, index) => values.indexOf(value) !== index)
  if (duplicates.length) {
    throw new Error(`${label} contains duplicate identifiers: ${[...new Set(duplicates)].join(", ")}`)
  }
}

function validateRegistry() {
  if (registry.format !== "fx-ui/framework-adapters") {
    throw new Error("framework adapter registry has an unexpected format")
  }

  const adapterIds = registry.adapters.map((adapter) => adapter.id)
  assertUnique(adapterIds, "adapter registry")
  const canonicalIds = (registry.canonicalComponents ?? []).map((component) => component.id)
  assertUnique(canonicalIds, "canonical component registry")

  const declaredComponents = [
    ...(sourceData["docs/data/components.manifest.json"].uiComponents ?? []),
    ...(sourceData["docs/data/components.manifest.json"].fxComponents ?? []),
  ]
  const declaredComponentById = new Map(
    declaredComponents.map((component) => [component.name, component]),
  )
  const declaredComponentIds = new Set(declaredComponentById.keys())
  const unknownCanonicalIds = canonicalIds.filter((id) => !declaredComponentIds.has(id))
  if (unknownCanonicalIds.length) {
    throw new Error(`canonical contracts reference unknown components: ${unknownCanonicalIds.join(", ")}`)
  }

  for (const canonical of registry.canonicalComponents ?? []) {
    if (canonical.status !== "adapter-ready") continue
    if (!canonical.semanticRole || !canonical.properties?.length || !canonical.events?.length || !canonical.accessibility) {
      throw new Error(`${canonical.id} adapter-ready contract lacks semantic role, properties, events, or accessibility rules`)
    }
    for (const property of canonical.properties) {
      if (property.type !== "enum") continue
      if (!property.values?.length) throw new Error(`${canonical.id}.${property.id} enum has no values`)
      assertUnique(property.values, `${canonical.id}.${property.id} enum`)
      if (property.defaultValue !== undefined && !property.values.includes(property.defaultValue)) {
        throw new Error(`${canonical.id}.${property.id} default is outside its enum`)
      }
    }
    const component = declaredComponentById.get(canonical.id)
    const manifestAxes = canonical.manifestAxes ?? { variant: "variants", size: "sizes" }
    for (const [propertyId, componentKey] of Object.entries(manifestAxes)) {
      const declaredValues = component?.[componentKey]
      if (!declaredValues?.length) continue
      const canonicalValues = canonical.properties.find((property) => property.id === propertyId)?.values ?? []
      const missing = declaredValues.filter((value) => !canonicalValues.includes(value))
      const extra = canonicalValues.filter((value) => !declaredValues.includes(value))
      if (missing.length || extra.length) {
        throw new Error(`${canonical.id}.${propertyId} drifts from component manifest: missing [${missing.join(", ")}], extra [${extra.join(", ")}]`)
      }
    }
  }

  const ready = registry.adapters.filter((adapter) => adapter.status === "ready")
  if (ready.length !== 1 || ready[0].id !== "react" || !ready[0].reference) {
    throw new Error("React must remain the single ready reference adapter")
  }

  const vue2 = registry.adapters.find((adapter) => adapter.id === "vue2")
  if (!vue2 || vue2.status !== "planned") {
    throw new Error("Vue 2 must be registered as planned")
  }
  if (vue2.sourceRoots.length || vue2.primitiveDependencies.length || vue2.capabilities.length || vue2.componentMappings.length) {
    throw new Error("planned Vue 2 adapter must not declare implementation roots, dependencies, capabilities, or mappings")
  }
  if (!Array.isArray(vue2.entryCriteria) || vue2.entryCriteria.length === 0) {
    throw new Error("planned Vue 2 adapter must declare entry criteria")
  }

  const declaredPaths = [
    registry.humanDoc,
    ...registry.portableCore.sources,
    ...ready.flatMap((adapter) => adapter.sourceRoots),
  ]
  const missing = declaredPaths.filter((file) => !exists(file))
  if (missing.length) throw new Error(`framework registry references missing paths: ${missing.join(", ")}`)

  const readyMappings = ready.flatMap((adapter) => adapter.componentMappings ?? [])
  assertUnique(readyMappings.map((mapping) => mapping.canonicalId), "ready adapter mappings")
  const componentHookContract = sourceData["docs/data/fds-components.manifest.json"]
  const publicComponentHooks = componentHookContract.tokens.filter((token) => token.visibility === "public-component")
  const publicComponentHookNames = new Set(publicComponentHooks.map((token) => token.name))
  const boundHookNames = readyMappings.flatMap((mapping) => mapping.stylingHooks ?? [])
  assertUnique(boundHookNames, "ready adapter Styling Hook bindings")
  const missingHookBindings = publicComponentHooks
    .filter((token) => !readyMappings.some((mapping) => normalizeId(mapping.canonicalId) === normalizeId(token.component) && (mapping.stylingHooks ?? []).includes(token.name)))
    .map((token) => token.name)
  const unknownHookBindings = boundHookNames.filter((name) => !publicComponentHookNames.has(name))
  if (missingHookBindings.length || unknownHookBindings.length) {
    throw new Error(`ready adapter Styling Hook bindings drift: missing [${missingHookBindings.join(", ")}], unknown [${unknownHookBindings.join(", ")}]`)
  }
  const unknownMappings = readyMappings
    .map((mapping) => mapping.canonicalId)
    .filter((id) => !canonicalIds.includes(id))
  if (unknownMappings.length) {
    throw new Error(`adapter mappings reference missing canonical contracts: ${unknownMappings.join(", ")}`)
  }

  const unmappedReadyContracts = (registry.canonicalComponents ?? [])
    .filter((component) => component.status === "adapter-ready")
    .map((component) => component.id)
    .filter((id) => !readyMappings.some((mapping) => mapping.canonicalId === id && mapping.status === "ready"))
  if (unmappedReadyContracts.length) {
    throw new Error(`adapter-ready contracts lack a ready reference mapping: ${unmappedReadyContracts.join(", ")}`)
  }

  for (const mapping of readyMappings) {
    if (!exists(mapping.source)) throw new Error(`adapter mapping references missing source: ${mapping.source}`)
    const source = fs.readFileSync(path.join(root, mapping.source), "utf8")
    const missingExports = mapping.exports.filter((exportName) => !source.includes(exportName))
    if (missingExports.length) {
      throw new Error(`${mapping.canonicalId} mapping references missing exports: ${missingExports.join(", ")}`)
    }
    const missingStylingHookConsumers = (mapping.stylingHooks ?? []).filter((name) => !source.includes(name))
    if (missingStylingHookConsumers.length) {
      throw new Error(`${mapping.canonicalId} source does not consume declared Styling Hooks: ${missingStylingHookConsumers.join(", ")}`)
    }
    const canonical = registry.canonicalComponents.find((component) => component.id === mapping.canonicalId)
    const propertyIds = canonical.properties.map((property) => property.id)
    const eventIds = canonical.events.map((event) => event.id)
    const compositionIds = (canonical.composition ?? []).map((composition) => composition.id)
    assertUnique(propertyIds, `${mapping.canonicalId} canonical properties`)
    assertUnique(eventIds, `${mapping.canonicalId} canonical events`)
    assertUnique(compositionIds, `${mapping.canonicalId} canonical compositions`)
    const missingProperties = propertyIds.filter((id) => !(id in mapping.properties))
    const missingEvents = eventIds.filter((id) => !(id in mapping.events))
    const missingCompositions = compositionIds.filter((id) => !(id in (mapping.composition ?? {})))
    if (missingProperties.length || missingEvents.length || missingCompositions.length) {
      throw new Error(`${mapping.canonicalId} mapping is incomplete: properties [${missingProperties.join(", ")}], events [${missingEvents.join(", ")}], compositions [${missingCompositions.join(", ")}]`)
    }
    const [primitiveModule, primitiveName] = mapping.primitive.split("#")
    const usesPrimitive = primitiveModule === "native-html"
      ? Boolean(primitiveName && source.includes(`<${primitiveName}`))
      : source.includes(primitiveModule)
    if (!usesPrimitive) {
      throw new Error(`${mapping.canonicalId} source does not use declared primitive: ${mapping.primitive}`)
    }
  }
}

validateRegistry()

const tokens = sourceData["docs/data/design-tokens.json"]
const tokenNaming = sourceData["docs/data/token-naming.manifest.json"]
const foundation = sourceData["docs/data/fds-foundation.manifest.json"]
const semanticContract = sourceData["docs/data/fds-semantic.manifest.json"]
const componentTokenContract = sourceData["docs/data/fds-components.manifest.json"]
const migrationAudit = sourceData["docs/data/fds-migration-audit.manifest.json"]
const themePresets = sourceData["docs/data/theme-presets.manifest.json"]
const components = sourceData["docs/data/components.manifest.json"]
const playgrounds = sourceData["docs/data/component-playgrounds.manifest.json"]
const icons = sourceData["docs/data/icons.manifest.json"]
const pageSemantics = sourceData["docs/data/page-semantics.manifest.json"]
const pageBuildKit = sourceData["docs/data/page-build-kit.manifest.json"]
const pageBuilder = sourceData["docs/data/page-builder.manifest.json"]
const agentUi = sourceData["docs/data/agent-ui.manifest.json"]
const publicStylingHooks = buildPublicStylingHooks({
  naming: tokenNaming,
  semantic: semanticContract,
  components: componentTokenContract,
})
const canonicalById = new Map(
  (registry.canonicalComponents ?? []).map((component) => [component.id, component]),
)

const playgroundIndex = new Map()
for (const [key, playground] of Object.entries(playgrounds.components ?? {})) {
  playgroundIndex.set(normalizeId(key), playground)
  if (playground.componentName) playgroundIndex.set(normalizeId(playground.componentName), playground)
}

const componentEntries = [
  ...(components.uiComponents ?? []).map((component) => ({ ...component, layer: "ui" })),
  ...(components.fxComponents ?? []).map((component) => ({ ...component, layer: "fx" })),
].map((component) => {
  const playground = playgroundIndex.get(normalizeId(component.name))
  const canonicalContract = canonicalById.get(component.name)
  const properties = (playground?.props ?? []).map((property) => ({
    id: property.key,
    type: property.type,
    defaultValue: playground.initial?.[property.key],
    options: property.options?.map((option) => projectPortable({
      value: option.value,
      label: option.label,
      labelEn: option.labelEn,
      intent: option.intent,
      intentEn: option.intentEn,
      constraint: option.constraint,
      constraintEn: option.constraintEn,
    })),
  }))

  const portableRules = (component.usageRules ?? []).filter((rule) =>
    isPortableString(rule)
      && !implementationSpecificUsageFragments.some((fragment) => rule.includes(fragment)),
  )
  return projectPortable({
    id: component.name,
    layer: component.layer,
    category: component.category,
    role: component.role,
    contractStatus: canonicalContract?.status ?? (properties.length ? "governed-options" : "identity-only"),
    contractNote: canonicalContract
      ? "Canonical semantics and a ready reference-adapter mapping are both verified."
      : properties.length
        ? "Structured options describe governed choices, not the framework implementation's complete API."
        : "Only semantic identity is portable until structured governed options are available.",
    canonicalContract,
    variants: component.variants ?? [],
    sizes: component.sizes ?? [],
    states: component.nativeStates ?? [],
    semanticDom: component.semanticDom ?? [],
    tokenRefs: component.tokenRefs ?? [],
    usageRules: portableRules,
    properties,
  })
}).sort((a, b) => a.id.localeCompare(b.id))

const iconEntries = icons.icons.map((icon) => ({
  id: canonicalIconId(icon.name),
  category: icon.category,
  style: icon.style,
  keywords: icon.keywords,
})).sort((a, b) => a.id.localeCompare(b.id))

assertUnique(componentEntries.map((component) => component.id), "portable components")
assertUnique(iconEntries.map((icon) => icon.id), "portable icons")

const outputObject = {
  schemaVersion: 1,
  format: "fx-ui/framework-core",
  generatedFrom: [registryPath, ...registry.portableCore.sources],
  policy: {
    scope: "Framework-neutral semantic contracts only; runtime implementations belong to adapters.",
    componentCoverage: "governed-options is a partial governed surface; identity-only is not a complete API contract.",
    tokenLayers: ["primitive", "map", "semantic", "component"],
    componentTokenNamespace: "admission-only",
    migrationPhase: tokenNaming.migration.phase,
  },
  adapterAvailability: registry.adapters.map((adapter) => ({
    id: adapter.id,
    framework: adapter.framework,
    status: adapter.status,
    reference: adapter.reference,
    supported: adapter.status === "ready",
    stylingHooks: adapter.status === "ready"
      ? {
          contract: tokenNaming.publication.publicContractArtifact,
          boundComponents: adapter.componentMappings.filter((mapping) => mapping.stylingHooks?.length).length,
          boundComponentHooks: adapter.componentMappings.flatMap((mapping) => mapping.stylingHooks ?? []).length,
        }
      : null,
  })),
  tokens: projectPortable({
    naming: tokenNaming,
    foundation,
    globalSemantic: semanticContract,
    componentHooks: componentTokenContract,
    publicStylingHooks,
    primitive: tokens.primitive,
    semantic: tokens.semantic,
    interactionLadder: tokens.interactionLadder,
    typography: tokens.typography,
    spacing: tokens.spacing,
    radius: tokens.radius,
    shape: tokens.shape,
    shadow: tokens.shadow,
    componentUsage: tokens.componentUsage,
  }),
  migration: projectPortable({
    currentPhase: migrationAudit.currentPhase,
    release: migrationAudit.release,
    summary: migrationAudit.summary,
    gates: migrationAudit.gates,
  }),
  theme: projectPortable(themePresets),
  components: componentEntries,
  icons: {
    policy: "Consumers use canonical icon IDs; each adapter owns its package binding.",
    entries: iconEntries,
  },
  pages: {
    semantics: projectPortable({
      roleContract: pageSemantics.roleContract,
      globalSemantics: pageSemantics.globalSemantics,
      pageTypes: pageSemantics.pageTypes,
    }),
    archetypes: projectPortable(pageBuildKit.archetypes),
    builder: projectPortable({
      policy: pageBuilder.policy,
      operationContract: pageBuilder.operationContract,
      componentCompositionOperationContract: pageBuilder.componentCompositionOperationContract,
      templates: pageBuilder.templates,
      businessComponents: pageBuilder.businessComponents,
    }),
  },
  agentUi: projectPortable({
    blocks: agentUi.blocks,
    action: agentUi.action,
    scenarioMap: agentUi.scenarioMap,
    security: {
      executableMarkupAllowed: false,
      arbitraryStylesAllowed: false,
      unknownBlockBehavior: agentUi.safety?.unknownTypeBehavior,
    },
  }),
}

const output = `${JSON.stringify(outputObject, null, 2)}\n`
const portableViolations = forbiddenPortableFragments.filter((fragment) => output.includes(fragment))
if (portableViolations.length) {
  throw new Error(`portable core leaked implementation fragments: ${portableViolations.join(", ")}`)
}
if (/<[A-Z][A-Za-z0-9.]*(?:\s|>|\/)/.test(output)) {
  throw new Error("portable core contains a JSX-like fragment")
}

const outputPath = path.join(root, outputFile)
if (process.argv.includes("--check")) {
  if (!fs.existsSync(outputPath) || fs.readFileSync(outputPath, "utf8") !== output) {
    console.error("framework core contract is stale. Run: npm run build:framework-core")
    process.exit(1)
  }
  console.log(`framework core contract check passed: ${componentEntries.length} components, ${iconEntries.length} icons`)
} else {
  fs.writeFileSync(outputPath, output)
  console.log(`built ${outputFile}: ${componentEntries.length} components, ${iconEntries.length} icons`)
}

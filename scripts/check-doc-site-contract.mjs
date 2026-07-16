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

function relationPathCandidates(value) {
  return String(value)
    .split(/\s+(?:\+|->|→|\/)\s+|\s+里的\s+|\s+and\s+/)
    .map((part) => part.replace(/\?raw$/, "").trim())
    .filter(Boolean)
    .filter((part) => !part.includes("*"))
    .filter((part) => !part.includes(" "))
    .filter((part) => /^(src|docs|theme|scripts|registry|skills|\.ai|\.agents|\.project-os|package\.json|components\.json|vite\.config\.ts|AGENTS\.md|CLAUDE\.md)/.test(part))
}

const errors = []

const packageJson = await readJson("package.json")
const packageScripts = packageJson.scripts ?? {}
const governanceIndex = await readJson("docs/data/governance-index.json")
if (governanceIndex.format !== "fx-ui/governance-index") {
  errors.push("governance index format must be fx-ui/governance-index")
}

if (!Array.isArray(governanceIndex.datasets) || governanceIndex.datasets.length === 0) {
  errors.push("governance index must contain at least one dataset")
}

for (const [index, dataset] of (governanceIndex.datasets ?? []).entries()) {
  for (const key of ["id", "path", "format", "purpose", "ownerRole", "checkCommand"]) {
    if (typeof dataset[key] !== "string" || dataset[key].trim().length === 0) {
      errors.push(`governance index dataset row ${index + 1} is missing ${key}`)
    }
  }

  if (!Array.isArray(dataset.consumedBy) || dataset.consumedBy.length === 0) {
    errors.push(`governance index dataset "${dataset.id}" must declare consumedBy`)
  }

  if (dataset.path && !(await fileExists(dataset.path))) {
    errors.push(`governance index dataset "${dataset.id}" references missing path: ${dataset.path}`)
  }

  if (dataset.path && dataset.path.endsWith(".json") && (await fileExists(dataset.path))) {
    const data = await readJson(dataset.path)
    const actualFormat = data.format ?? data.schemaVersion
    if (dataset.format && actualFormat !== dataset.format) {
      errors.push(`governance index dataset "${dataset.id}" format mismatch: expected ${dataset.format}, got ${actualFormat}`)
    }
  }

  for (const consumer of dataset.consumedBy ?? []) {
    if (consumer.includes("*")) continue
    if (!(await fileExists(consumer))) {
      errors.push(`governance index dataset "${dataset.id}" references missing consumer: ${consumer}`)
    }
  }

  const command = dataset.checkCommand ?? ""
  const npmScript = command.match(/^npm run ([\w:-]+)/)?.[1]
  const scriptPath = command.match(/(?:bash|node) (scripts\/[^\s]+)/)?.[1]
  if (npmScript && !(npmScript in packageScripts)) {
    errors.push(`governance index dataset "${dataset.id}" references missing npm script: ${npmScript}`)
  }
  if (scriptPath && !(await fileExists(scriptPath))) {
    errors.push(`governance index dataset "${dataset.id}" references missing check script: ${scriptPath}`)
  }
}

const docSiteManifest = await readJson("docs/data/doc-site.manifest.json")
const governancePagesManifest = await readJson("docs/data/governance-pages.manifest.json")
const governanceTodoManifest = await readJson("docs/data/governance-todo.json")
const websiteStandardsManifest = await readJson("docs/data/website-standards.manifest.json")
const appSource = await readText(docSiteManifest.truthSource)
const docSurfaceSource = await readText("src/components/fx/doc-surface.tsx")

if (governanceTodoManifest.format !== "fx-ui/governance-todo") {
  errors.push("governance-todo manifest format must be fx-ui/governance-todo")
}

for (const path of [governanceTodoManifest.truthSource, governanceTodoManifest.humanDoc]) {
  if (typeof path !== "string" || path.trim().length === 0) {
    errors.push("governance-todo manifest must declare truthSource and humanDoc")
  } else if (!(await fileExists(path))) {
    errors.push(`governance-todo manifest references missing path: ${path}`)
  }
}

if (!Array.isArray(governanceTodoManifest.items) || governanceTodoManifest.items.length < 3) {
  errors.push("governance-todo manifest must include items")
}
for (const item of governanceTodoManifest.items ?? []) {
  if (!["pending", "in_progress", "done"].includes(item.status)) {
    errors.push(`governance-todo item "${item.id}" has invalid status: ${item.status}`)
  }
}

if (governancePagesManifest.format !== "fx-ui/governance-pages-manifest") {
  errors.push("governance-pages manifest format must be fx-ui/governance-pages-manifest")
}

for (const path of [governancePagesManifest.truthSource, governancePagesManifest.humanDoc]) {
  if (typeof path !== "string" || path.trim().length === 0) {
    errors.push("governance-pages manifest must declare truthSource and humanDoc")
  } else if (!(await fileExists(path))) {
    errors.push(`governance-pages manifest references missing path: ${path}`)
  }
}

if (!Array.isArray(governancePagesManifest.documentation?.ssotRoutes) || governancePagesManifest.documentation.ssotRoutes.length < 5) {
  errors.push("governance-pages manifest must include documentation.ssotRoutes")
}
if (!Array.isArray(governancePagesManifest.documentation?.antiDriftLoop) || governancePagesManifest.documentation.antiDriftLoop.length < 3) {
  errors.push("governance-pages manifest must include documentation.antiDriftLoop")
}
if (!Array.isArray(governancePagesManifest.documentation?.writeRules) || governancePagesManifest.documentation.writeRules.length < 5) {
  errors.push("governance-pages manifest must include documentation.writeRules")
}
if (!Array.isArray(governancePagesManifest.checks?.commands) || governancePagesManifest.checks.commands.length < 5) {
  errors.push("governance-pages manifest must include checks.commands")
}
if (!Array.isArray(governancePagesManifest.checks?.layers) || governancePagesManifest.checks.layers.length < 6) {
  errors.push("governance-pages manifest must include checks.layers")
}
if (!Array.isArray(governancePagesManifest.checks?.finishChecklist) || governancePagesManifest.checks.finishChecklist.length < 5) {
  errors.push("governance-pages manifest must include checks.finishChecklist")
}
if (!Array.isArray(governancePagesManifest.overview?.positioning) || governancePagesManifest.overview.positioning.length < 3) {
  errors.push("governance-pages manifest must include overview.positioning")
}
if (!Array.isArray(governancePagesManifest.overview?.layers) || governancePagesManifest.overview.layers.length < 3) {
  errors.push("governance-pages manifest must include overview.layers")
}
if (!Array.isArray(governancePagesManifest.overview?.audience) || governancePagesManifest.overview.audience.length < 3) {
  errors.push("governance-pages manifest must include overview.audience")
}
if (!Array.isArray(governancePagesManifest.install?.prerequisites) || governancePagesManifest.install.prerequisites.length < 3) {
  errors.push("governance-pages manifest must include install.prerequisites")
}
if (!Array.isArray(governancePagesManifest.install?.structure) || governancePagesManifest.install.structure.length < 4) {
  errors.push("governance-pages manifest must include install.structure")
}
if (!Array.isArray(governancePagesManifest.install?.verify) || governancePagesManifest.install.verify.length < 3) {
  errors.push("governance-pages manifest must include install.verify")
}
if (!Array.isArray(governancePagesManifest.theme?.semanticSlots) || governancePagesManifest.theme.semanticSlots.length < 3) {
  errors.push("governance-pages manifest must include theme.semanticSlots")
}
if (!Array.isArray(governancePagesManifest.theme?.changeFlow) || governancePagesManifest.theme.changeFlow.length < 3) {
  errors.push("governance-pages manifest must include theme.changeFlow")
}
if (!Array.isArray(governancePagesManifest.aiRules?.guardrails) || governancePagesManifest.aiRules.guardrails.length < 4) {
  errors.push("governance-pages manifest must include aiRules.guardrails")
}
if (!Array.isArray(governancePagesManifest.aiRules?.styleFlow) || governancePagesManifest.aiRules.styleFlow.length < 4) {
  errors.push("governance-pages manifest must include aiRules.styleFlow")
}

if (websiteStandardsManifest.format !== "fx-ui/website-standards-manifest") {
  errors.push("website-standards manifest format must be fx-ui/website-standards-manifest")
}

for (const path of [websiteStandardsManifest.truthSource, websiteStandardsManifest.humanDoc]) {
  if (typeof path !== "string" || path.trim().length === 0) {
    errors.push("website-standards manifest must declare truthSource and humanDoc")
  } else if (!(await fileExists(path))) {
    errors.push(`website-standards manifest references missing path: ${path}`)
  }
}

if (!Array.isArray(websiteStandardsManifest.pageLead?.visualBaseline) || websiteStandardsManifest.pageLead.visualBaseline.length < 4) {
  errors.push("website-standards manifest must include pageLead.visualBaseline with at least 4 items")
}

if (!Array.isArray(websiteStandardsManifest.pageLead?.contentRules) || websiteStandardsManifest.pageLead.contentRules.length < 5) {
  errors.push("website-standards manifest must include pageLead.contentRules with at least 5 items")
}

if (!Array.isArray(websiteStandardsManifest.pageLead?.rulePanel?.sections) || !websiteStandardsManifest.pageLead.rulePanel.sections.includes("values")) {
  errors.push("website-standards manifest must include pageLead.rulePanel.sections with values")
}

if (!Array.isArray(websiteStandardsManifest.sectionLead?.usageBullets) || websiteStandardsManifest.sectionLead.usageBullets.length < 3) {
  errors.push("website-standards manifest must include sectionLead.usageBullets with at least 3 items")
}

if (!Array.isArray(websiteStandardsManifest.componentPlayground?.rules) || websiteStandardsManifest.componentPlayground.rules.length < 4) {
  errors.push("website-standards manifest must include componentPlayground.rules with at least 4 items")
}

if (!Array.isArray(websiteStandardsManifest.componentPlayground?.rulePanel?.sections) || !websiteStandardsManifest.componentPlayground.rulePanel.sections.includes("values")) {
  errors.push("website-standards manifest must include componentPlayground.rulePanel.sections with values")
}

if (!Array.isArray(websiteStandardsManifest.spacingRhythm?.items) || websiteStandardsManifest.spacingRhythm.items.length !== 3) {
  errors.push("website-standards manifest must include exactly 3 spacingRhythm.items")
}

if (!Array.isArray(websiteStandardsManifest.spacingRhythm?.rulePanel?.sections) || !websiteStandardsManifest.spacingRhythm.rulePanel.sections.includes("values")) {
  errors.push("website-standards manifest must include spacingRhythm.rulePanel.sections with values")
}

if (!Array.isArray(websiteStandardsManifest.spacingRhythm?.visualBaseline) || websiteStandardsManifest.spacingRhythm.visualBaseline.length < 5) {
  errors.push("website-standards manifest must include spacingRhythm.visualBaseline with at least 5 items")
}

if (!Array.isArray(websiteStandardsManifest.websiteCardContainer?.rules) || websiteStandardsManifest.websiteCardContainer.rules.length < 3) {
  errors.push("website-standards manifest must include websiteCardContainer.rules with at least 3 items")
}

if (!Array.isArray(websiteStandardsManifest.websiteCardContainer?.rulePanel?.sections) || !websiteStandardsManifest.websiteCardContainer.rulePanel.sections.includes("values")) {
  errors.push("website-standards manifest must include websiteCardContainer.rulePanel.sections with values")
}

if (!Array.isArray(websiteStandardsManifest.websiteCardContainer?.visualBaseline) || websiteStandardsManifest.websiteCardContainer.visualBaseline.length < 5) {
  errors.push("website-standards manifest must include websiteCardContainer.visualBaseline with at least 5 items")
}

if (appSource.includes("docsSpacing.sectionHeader")) {
  errors.push("doc-site section headings must use SectionLead instead of docsSpacing.sectionHeader")
}

if (!appSource.includes("from \"@/components/fx/section-lead\"") || !appSource.includes("<SectionLead")) {
  errors.push("doc-site must use the fx SectionLead component for content section headings")
}

const standardDocPageSource = appSource.match(/function StandardDocPage\([\s\S]*?\nfunction AvatarPage/)?.[0] ?? ""
if (!standardDocPageSource.includes("<FxPageLead")) {
  errors.push("StandardDocPage must use the fx PageLead component")
}
if (!standardDocPageSource.includes("<SectionLead")) {
  errors.push("StandardDocPage overview and content headings must use SectionLead")
}
if (standardDocPageSource.includes("<h1 className=\"text-3xl") || standardDocPageSource.includes("<h2 className=\"text-xl")) {
  errors.push("StandardDocPage must not hand-roll page or section headings")
}

if (!appSource.includes("websiteStandardsManifest.pageLead.visualBaseline.map")) {
  errors.push("website-standards page must render PageLead baseline cards from websiteStandardsManifest")
}
if (!appSource.includes("websiteStandardsManifest.pageLead.rulePanel.sections.includes(\"values\")")) {
  errors.push("website-standards page must use rulePanel.sections to control PageLead rule panel display")
}
if (!appSource.includes("websiteStandardsManifest.sectionLead.usageBullets.map")) {
  errors.push("website-standards page must render SectionLead usage bullets from websiteStandardsManifest")
}
if (!appSource.includes("websiteStandardsManifest.componentPlayground.rules.map")) {
  errors.push("website-standards page must render ComponentPlayground rules from websiteStandardsManifest")
}
if (!appSource.includes("websiteStandardsManifest.componentPlayground.rulePanel.sections.includes(\"values\")")) {
  errors.push("website-standards page must use rulePanel.sections to control ComponentPlayground rule panel display")
}
if (!appSource.includes("websiteStandardsManifest.websiteCardContainer.rules.map")) {
  errors.push("website-standards page must render WebsiteCardContainer rules from websiteStandardsManifest")
}
if (!appSource.includes("<WebsiteCardContainerPreview label={lang === \"en\" ? \"Internal area\" : \"内部区域\"} />")) {
  errors.push("website-standards page must render WebsiteCardContainerPreview")
}
if (!docSurfaceSource.includes('from "@/components/fx/website-card-container"') || !docSurfaceSource.includes("<WebsiteCardContainer")) {
  errors.push("doc-site independent surfaces must compose WebsiteCardContainer")
}
if (!appSource.includes("governancePagesManifest.documentation.ssotRoutes.map")) {
  errors.push("documentation page must render SSOT routes from governancePagesManifest")
}
if (!appSource.includes("governancePagesManifest.documentation.antiDriftLoop.map")) {
  errors.push("documentation page must render anti-drift loop cards from governancePagesManifest")
}
if (!appSource.includes("governancePagesManifest.documentation.writeRules.map")) {
  errors.push("documentation page must render write rules from governancePagesManifest")
}
if (!appSource.includes("governancePagesManifest.overview.positioning.map")) {
  errors.push("overview page must render positioning cards from governancePagesManifest")
}
if (!appSource.includes("governancePagesManifest.overview.layers.map")) {
  errors.push("overview page must render layer table from governancePagesManifest")
}
if (!appSource.includes("governancePagesManifest.overview.audience.map")) {
  errors.push("overview page must render audience cards from governancePagesManifest")
}
if (!appSource.includes("governancePagesManifest.install.prerequisites.map")) {
  errors.push("install page must render prerequisites from governancePagesManifest")
}
if (!appSource.includes("governancePagesManifest.install.structure.map")) {
  errors.push("install page must render structure list from governancePagesManifest")
}
if (!appSource.includes("governancePagesManifest.install.verify.map")) {
  errors.push("install page must render verify list from governancePagesManifest")
}
if (!appSource.includes("governancePagesManifest.theme.semanticSlots.map")) {
  errors.push("theme page must render semantic slots from governancePagesManifest")
}
if (!appSource.includes("governancePagesManifest.theme.changeFlow.map")) {
  errors.push("theme page must render change flow from governancePagesManifest")
}
if (!appSource.includes("governancePagesManifest.aiRules.guardrails.map")) {
  errors.push("ai-rules page must render guardrails from governancePagesManifest")
}
if (!appSource.includes("governancePagesManifest.aiRules.styleFlow.map")) {
  errors.push("ai-rules page must render style flow from governancePagesManifest")
}
if (!appSource.includes("governanceTodo.items.map")) {
  errors.push("governance-map page must render TODO cards from governanceTodo")
}
if (!appSource.includes("governancePagesManifest.checks.commands.map")) {
  errors.push("checks page must render commands from governancePagesManifest")
}
if (!appSource.includes("governancePagesManifest.checks.layers.map")) {
  errors.push("checks page must render check layers from governancePagesManifest")
}
if (!appSource.includes("governancePagesManifest.checks.finishChecklist.map")) {
  errors.push("checks page must render finish checklist from governancePagesManifest")
}

if (docSiteManifest.governance?.method !== "text-spec + machine-manifest + executable-check") {
  errors.push("doc-site governance method must be text-spec + machine-manifest + executable-check")
}

for (const item of docSiteManifest.supportingData ?? []) {
  if (item.required && !(await fileExists(item.path))) {
    errors.push(`required supporting data is missing: ${item.path}`)
  }
}

for (const region of docSiteManifest.regions ?? []) {
  for (const snippet of region.requiredSourceIncludes ?? []) {
    if (!appSource.includes(snippet)) {
      errors.push(`doc-site region "${region.id}" is missing source snippet: ${snippet}`)
    }
  }
}

const layoutContractIds = new Set()
for (const contract of docSiteManifest.layoutContracts ?? []) {
  if (!contract.id) {
    errors.push("doc-site layout contract is missing id")
  } else if (layoutContractIds.has(contract.id)) {
    errors.push(`doc-site layout contract id is duplicated: ${contract.id}`)
  } else {
    layoutContractIds.add(contract.id)
  }

  for (const key of ["label", "source", "intent"]) {
    if (typeof contract[key] !== "string" || contract[key].trim().length === 0) {
      errors.push(`doc-site layout contract "${contract.id ?? "(unknown)"}" is missing ${key}`)
    }
  }

  if (contract.source && !(await fileExists(contract.source))) {
    errors.push(`doc-site layout contract "${contract.id}" references missing source: ${contract.source}`)
    continue
  }

  const source = contract.source === docSiteManifest.truthSource
    ? appSource
    : contract.source
      ? await readText(contract.source)
      : ""

  if (!Array.isArray(contract.requiredSourceIncludes) || contract.requiredSourceIncludes.length === 0) {
    errors.push(`doc-site layout contract "${contract.id}" must declare requiredSourceIncludes`)
  }

  for (const snippet of contract.requiredSourceIncludes ?? []) {
    if (!source.includes(snippet)) {
      errors.push(`doc-site layout contract "${contract.id}" is missing source snippet: ${snippet}`)
    }
  }

  for (const snippet of contract.forbiddenSourceIncludes ?? []) {
    if (source.includes(snippet)) {
      errors.push(`doc-site layout contract "${contract.id}" contains forbidden source snippet: ${snippet}`)
    }
  }
}

const demoContractIds = new Set()
for (const contract of docSiteManifest.demoContracts ?? []) {
  if (!contract.id) {
    errors.push("doc-site demo contract is missing id")
  } else if (demoContractIds.has(contract.id)) {
    errors.push(`doc-site demo contract id is duplicated: ${contract.id}`)
  } else {
    demoContractIds.add(contract.id)
  }

  for (const key of ["label", "source", "intent", "scopeStart", "scopeEnd"]) {
    if (typeof contract[key] !== "string" || contract[key].trim().length === 0) {
      errors.push(`doc-site demo contract "${contract.id ?? "(unknown)"}" is missing ${key}`)
    }
  }

  if (contract.source && !(await fileExists(contract.source))) {
    errors.push(`doc-site demo contract "${contract.id}" references missing source: ${contract.source}`)
    continue
  }

  const source = contract.source === docSiteManifest.truthSource
    ? appSource
    : contract.source
      ? await readText(contract.source)
      : ""

  const startIndex = source.indexOf(contract.scopeStart ?? "")
  if (startIndex === -1) {
    errors.push(`doc-site demo contract "${contract.id}" is missing scopeStart snippet`)
    continue
  }

  const endIndex = source.indexOf(contract.scopeEnd ?? "", startIndex)
  if (endIndex === -1) {
    errors.push(`doc-site demo contract "${contract.id}" is missing scopeEnd snippet`)
    continue
  }

  const scopedSource = source.slice(startIndex, endIndex + contract.scopeEnd.length)

  if (!Array.isArray(contract.requiredSourceIncludes) || contract.requiredSourceIncludes.length === 0) {
    errors.push(`doc-site demo contract "${contract.id}" must declare requiredSourceIncludes`)
  }

  for (const snippet of contract.requiredSourceIncludes ?? []) {
    if (!scopedSource.includes(snippet)) {
      errors.push(`doc-site demo contract "${contract.id}" is missing scoped source snippet: ${snippet}`)
    }
  }

  for (const snippet of contract.forbiddenSourceIncludes ?? []) {
    if (scopedSource.includes(snippet)) {
      errors.push(`doc-site demo contract "${contract.id}" contains forbidden scoped source snippet: ${snippet}`)
    }
  }
}

if (!Array.isArray(docSiteManifest.layoutContracts) || docSiteManifest.layoutContracts.length < 4) {
  errors.push("doc-site manifest must include layout contracts for reading width, page actions, right rail, and components index")
}

const deprecatedGettingStartedLabels = ["项目定位", "安装接入", "主题注入", "主题配置", "AI 使用规则", "AI 接入规则"]
for (const label of deprecatedGettingStartedLabels) {
  if (appSource.includes(label)) {
    errors.push(`doc-site getting started nav uses deprecated internal label: ${label}`)
  }
}

const componentsManifest = await readJson("docs/data/components.manifest.json")
for (const component of componentsManifest.uiComponents ?? []) {
  if (!(await fileExists(component.source))) {
    errors.push(`component source is missing: ${component.name} -> ${component.source}`)
  }
  if (component.doc && !(await fileExists(component.doc))) {
    errors.push(`component doc is missing: ${component.name} -> ${component.doc}`)
  }
}

for (const component of componentsManifest.fxComponents ?? []) {
  if (!(await fileExists(component.source))) {
    errors.push(`fx component source is missing: ${component.name} -> ${component.source}`)
  }
}

const designTokens = await readJson("docs/data/design-tokens.json")
for (const semanticToken of designTokens.semantic ?? []) {
  if (!appSource.includes(semanticToken.name.replace(/^--/, "")) && !appSource.includes(semanticToken.tailwind ?? "")) {
    // This is a weak signal only; semantic tokens are primarily validated by check-tokens-sync.
    continue
  }
}

const projectGraph = await readJson("docs/data/project-graph.json")
if (projectGraph.schemaVersion !== "project-graph.v0.3") {
  errors.push(`project graph schemaVersion must be project-graph.v0.3, got ${projectGraph.schemaVersion}`)
}
if (!projectGraph.systemRelations || projectGraph.systemRelations.source !== "docs/data/system-relations.json") {
  errors.push("project graph must include systemRelations sourced from docs/data/system-relations.json")
}
if (!Array.isArray(projectGraph.systemRelationEdges) || projectGraph.systemRelationEdges.length === 0) {
  errors.push("project graph must include systemRelationEdges")
}

const systemRelations = await readJson("docs/data/system-relations.json")
if (systemRelations.format !== "fx-ui/system-relations") {
  errors.push("system relations format must be fx-ui/system-relations")
}

for (const scope of ["site", "project"]) {
  const relations = systemRelations[scope]
  if (!Array.isArray(relations) || relations.length === 0) {
    errors.push(`system relations "${scope}" must contain at least one relation`)
    continue
  }

  for (const [index, relation] of relations.entries()) {
    for (const key of ["group", "source", "action", "target", "result"]) {
      if (typeof relation[key] !== "string" || relation[key].trim().length === 0) {
        errors.push(`system relations "${scope}" row ${index + 1} is missing ${key}`)
      }
    }

    const candidates = [
      ...relationPathCandidates(relation.source),
      ...relationPathCandidates(relation.target),
    ]

    for (const candidate of candidates) {
      if (!(await fileExists(candidate))) {
        errors.push(`system relations "${scope}" references missing path: ${candidate}`)
      }
    }
  }
}

const governanceStatus = await readJson("docs/data/governance-status.json")
if (governanceStatus.format !== "fx-ui/governance-status") {
  errors.push("governance status format must be fx-ui/governance-status")
}

for (const key of ["statusCards", "freshness", "assets", "loop", "references", "actionFlows", "taskRoutes", "next"]) {
  if (!Array.isArray(governanceStatus[key]) || governanceStatus[key].length === 0) {
    errors.push(`governance status "${key}" must contain at least one item`)
  }
}

const allowedStatusCardValueKeys = new Set([
  "componentContracts",
  "docSiteRegions",
  "tokenFacts",
  "projectGraph",
  "defaultGate",
  "staleNodes",
])
for (const [index, card] of (governanceStatus.statusCards ?? []).entries()) {
  for (const key of ["title", "valueKey", "desc"]) {
    if (typeof card[key] !== "string" || card[key].trim().length === 0) {
      errors.push(`governance status card row ${index + 1} is missing ${key}`)
    }
  }
  if (card.valueKey && !allowedStatusCardValueKeys.has(card.valueKey)) {
    errors.push(`governance status card row ${index + 1} has unknown valueKey: ${card.valueKey}`)
  }
}

const allowedFreshnessKeys = new Set([
  "componentsManifest",
  "designTokens",
  "docSite",
  "governanceStatus",
  "projectGraph",
  "systemRelations",
])
for (const [index, row] of (governanceStatus.freshness ?? []).entries()) {
  for (const key of ["name", "source", "updatedAtKey", "maintenance"]) {
    if (typeof row[key] !== "string" || row[key].trim().length === 0) {
      errors.push(`governance status freshness row ${index + 1} is missing ${key}`)
    }
  }
  if (row.source && !(await fileExists(row.source))) {
    errors.push(`governance status freshness row ${index + 1} references missing source: ${row.source}`)
  }
  if (row.updatedAtKey && !allowedFreshnessKeys.has(row.updatedAtKey)) {
    errors.push(`governance status freshness row ${index + 1} has unknown updatedAtKey: ${row.updatedAtKey}`)
  }
}

for (const [index, asset] of (governanceStatus.assets ?? []).entries()) {
  for (const key of ["rule", "textSpec", "machineData", "check", "status"]) {
    if (typeof asset[key] !== "string" || asset[key].trim().length === 0) {
      errors.push(`governance status asset row ${index + 1} is missing ${key}`)
    }
  }
}

for (const [index, item] of (governanceStatus.loop ?? []).entries()) {
  for (const key of ["title", "titleEn", "file", "desc", "descEn"]) {
    if (typeof item[key] !== "string" || item[key].trim().length === 0) {
      errors.push(`governance status loop row ${index + 1} is missing ${key}`)
    }
  }
}

for (const [index, reference] of (governanceStatus.references ?? []).entries()) {
  for (const key of ["title", "desc", "href"]) {
    if (typeof reference[key] !== "string" || reference[key].trim().length === 0) {
      errors.push(`governance status reference row ${index + 1} is missing ${key}`)
    }
  }
}

const allowedActionFlowIds = new Set(["style", "component", "site", "impact"])
for (const [index, flow] of (governanceStatus.actionFlows ?? []).entries()) {
  for (const key of ["id", "title", "titleEn", "desc", "descEn", "href", "linkLabel", "linkLabelEn", "checkCommand", "done", "doneEn"]) {
    if (typeof flow[key] !== "string" || flow[key].trim().length === 0) {
      errors.push(`governance status actionFlow row ${index + 1} is missing ${key}`)
    }
  }

  if (flow.linkLabel === "打开对应页面" || flow.linkLabelEn === "Open view") {
    errors.push(`governance status actionFlow "${flow.id}" must use a specific linkLabel, not a generic one`)
  }

  if (flow.id && !allowedActionFlowIds.has(flow.id)) {
    errors.push(`governance status actionFlow row ${index + 1} has unknown id: ${flow.id}`)
  }

  if (!Array.isArray(flow.steps) || flow.steps.length === 0) {
    errors.push(`governance status actionFlow "${flow.id}" must declare steps`)
  }

  for (const [stepIndex, step] of (flow.steps ?? []).entries()) {
    for (const key of ["file", "action", "actionEn", "note", "noteEn"]) {
      if (typeof step[key] !== "string" || step[key].trim().length === 0) {
        errors.push(`governance status actionFlow "${flow.id}" step ${stepIndex + 1} is missing ${key}`)
      }
    }

    const file = step.file ?? ""
    const isAnchor = file.startsWith("#")
    const isTemplatePath = file.includes("<") && file.includes(">")
    if (file && !isAnchor && !isTemplatePath && !(await fileExists(file))) {
      errors.push(`governance status actionFlow "${flow.id}" step ${stepIndex + 1} references missing file: ${file}`)
    }
  }

  const command = flow.checkCommand ?? ""
  const npmScript = command.match(/^npm run ([\w:-]+)/)?.[1]
  const scriptPath = command.match(/(?:bash|node) (scripts\/[^\s]+)/)?.[1]
  if (npmScript && !(npmScript in packageScripts)) {
    errors.push(`governance status actionFlow "${flow.id}" references missing npm script: ${npmScript}`)
  }
  if (scriptPath && !(await fileExists(scriptPath))) {
    errors.push(`governance status actionFlow "${flow.id}" references missing check script: ${scriptPath}`)
  }
}

for (const [index, route] of (governanceStatus.taskRoutes ?? []).entries()) {
  for (const key of ["id", "label", "labelEn", "flowId", "firstDecision", "firstDecisionEn", "outputCheck"]) {
    if (typeof route[key] !== "string" || route[key].trim().length === 0) {
      errors.push(`governance status taskRoute row ${index + 1} is missing ${key}`)
    }
  }

  if (!Array.isArray(route.match) || route.match.length === 0) {
    errors.push(`governance status taskRoute "${route.id}" must declare match keywords`)
  }

  if (route.flowId && !allowedActionFlowIds.has(route.flowId)) {
    errors.push(`governance status taskRoute "${route.id}" references unknown flowId: ${route.flowId}`)
  }

  const command = route.outputCheck ?? ""
  const npmScript = command.match(/^npm run ([\w:-]+)/)?.[1]
  const scriptPath = command.match(/(?:bash|node) (scripts\/[^\s]+)/)?.[1]
  if (npmScript && !(npmScript in packageScripts)) {
    errors.push(`governance status taskRoute "${route.id}" references missing npm script: ${npmScript}`)
  }
  if (scriptPath && !(await fileExists(scriptPath))) {
    errors.push(`governance status taskRoute "${route.id}" references missing check script: ${scriptPath}`)
  }
}

for (const [index, item] of (governanceStatus.next ?? []).entries()) {
  for (const key of ["id", "title", "desc", "priority", "status", "ownerRole", "checkCommand", "definitionOfDone"]) {
    if (typeof item[key] !== "string" || item[key].trim().length === 0) {
      errors.push(`governance status next row ${index + 1} is missing ${key}`)
    }
  }
  if (!Array.isArray(item.targetFiles) || item.targetFiles.length === 0) {
    errors.push(`governance status next row ${index + 1} must declare targetFiles`)
  }
  for (const targetFile of item.targetFiles ?? []) {
    if (targetFile.includes("*")) continue
    if (!(await fileExists(targetFile))) {
      errors.push(`governance status next row ${index + 1} references missing target file: ${targetFile}`)
    }
  }

  const command = item.checkCommand ?? ""
  const npmScript = command.match(/^npm run ([\w:-]+)/)?.[1]
  const scriptPath = command.match(/(?:bash|node) (scripts\/[^\s]+)/)?.[1]
  if (npmScript && !(npmScript in packageScripts)) {
    errors.push(`governance status next row ${index + 1} references missing npm script: ${npmScript}`)
  }
  if (scriptPath && !(await fileExists(scriptPath))) {
    errors.push(`governance status next row ${index + 1} references missing check script: ${scriptPath}`)
  }
}

if (errors.length > 0) {
  console.error("doc-site contract check failed:\n")
  for (const error of errors) {
    console.error(`- ${error}`)
  }
  process.exitCode = 1
} else {
  console.log(
    `doc-site contract check passed: ${docSiteManifest.regions.length} regions, ${(componentsManifest.uiComponents ?? []).length} ui components, ${(componentsManifest.fxComponents ?? []).length} fx components.`
  )
}

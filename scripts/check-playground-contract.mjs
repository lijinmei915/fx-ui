import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const manifest = JSON.parse(fs.readFileSync(path.join(root, "docs/data/component-playgrounds.manifest.json"), "utf8"))
const componentsManifest = JSON.parse(fs.readFileSync(path.join(root, "docs/data/components.manifest.json"), "utf8"))
const testPath = path.join(root, "tests/visual.spec.ts")
const testSource = fs.readFileSync(testPath, "utf8")
const errors = []

if (manifest.format !== "fx-ui/component-playgrounds") errors.push("invalid playground manifest format")
if (manifest.schemaVersion !== 2 || manifest.storyFormat !== "storybook-lite") errors.push("playground manifest must use schemaVersion 2 and storyFormat storybook-lite")
if (manifest.autoScenarios !== undefined) errors.push("autoScenarios is deprecated; use autoStories")
const controlPanelContract = manifest.controlPanelContract
const expectedControlGroupOrder = ["content", "semantics", "structure", "appearance", "behavior"]
if (!controlPanelContract || controlPanelContract.appliesWhen !== "new-or-touched-playground") {
  errors.push("controlPanelContract must declare new-or-touched-playground scope")
} else {
  if (JSON.stringify(controlPanelContract.realTimeGroupOrder) !== JSON.stringify(expectedControlGroupOrder)) {
    errors.push("controlPanelContract must use the fixed realtime group order")
  }
  for (const group of expectedControlGroupOrder) {
    if (!controlPanelContract.realTimeGroups?.[group]) errors.push(`controlPanelContract is missing ${group} group guidance`)
  }
  const scenarios = controlPanelContract.scenarioPresets
  if (scenarios?.placement !== "after-realtime-props" || scenarios?.order !== "explicit-order-ascending") {
    errors.push("controlPanelContract must constrain scenario placement and explicit ordering")
  }
  for (const rule of ["changes-structure", "requires-linked-real-props-or-states", "has-verified-intent-and-constraint"]) {
    if (!scenarios?.showOnlyWhen?.includes(rule)) errors.push(`controlPanelContract scenario admission is missing ${rule}`)
  }
  for (const rule of ["single-prop-duplicate", "independently-configurable-props", "layout-only-override"]) {
    if (!scenarios?.hideWhen?.includes(rule)) errors.push(`controlPanelContract scenario exclusion is missing ${rule}`)
  }
}

const inputControlGroups = {
  placeholder: "content",
  size: "appearance",
  state: "behavior",
  disabled: "behavior",
  invalid: "behavior",
  leading: "structure",
  trailing: "structure",
  field: "structure",
  leadingText: "structure",
  trailingText: "structure",
  actionLabel: "structure",
  type: "semantics",
}
for (const [key, group] of Object.entries(inputControlGroups)) {
  const prop = manifest.components?.input?.props?.find((item) => item.key === key)
  if (prop?.controlGroup !== group) errors.push(`input prop ${key} must declare controlGroup ${group}`)
}
const components = manifest.components ?? {}
const customPlaygrounds = manifest.customPlaygrounds ?? {}
const playgroundEntries = {
  ...Object.fromEntries(Object.entries(components).map(([id, component]) => [id, { ...component, pointer: `components.${id}` }])),
  ...Object.fromEntries(Object.entries(customPlaygrounds).map(([id, component]) => [id, { ...component, pointer: `customPlaygrounds.${id}` }])),
}
for (const [id, component] of Object.entries(playgroundEntries)) {
  if (component.scenarios !== undefined) errors.push(`${id} scenarios is deprecated; use stories`)
  if (!component.source || !fs.existsSync(path.join(root, component.source))) errors.push(`${id} source is missing: ${component.source ?? ""}`)
  if (!component.playgroundComponent || !fs.existsSync(path.join(root, component.playgroundComponent))) errors.push(`${id} playground renderer is missing`)
  if (!component.initial || typeof component.initial !== "object") errors.push(`${id} must declare initial values`)
  if (!Array.isArray(component.props) && !component.workbench) errors.push(`${id} must declare props or workbench`)
  if (component.stories !== undefined) {
    if (component.storyPresentation !== undefined && !["presets", "examples"].includes(component.storyPresentation)) {
      errors.push(`${id} storyPresentation must be presets or examples`)
    }
    if (!Array.isArray(component.stories) || component.stories.length === 0) errors.push(`${id} stories must be a non-empty array when declared`)
    if (!Array.isArray(component.stories)) continue
    const declaredStoryKeys = new Set([
      ...Object.keys(component.initial ?? {}),
      ...(component.props ?? []).map((prop) => prop.key),
    ])
    const scenarioIds = new Set()
    for (const story of component.stories) {
      if (!story.id || scenarioIds.has(story.id)) errors.push(`${id} stories must have unique ids`)
      scenarioIds.add(story.id)
      if (!story.args || typeof story.args !== "object") errors.push(`${id} story ${story.id ?? "?"} must declare args`)
      for (const key of Object.keys(story.args ?? {})) {
        if (!declaredStoryKeys.has(key)) errors.push(`${id} story ${story.id ?? "?"} uses undeclared arg: ${key}`)
      }
      if (!story.name || !story.nameEn) errors.push(`${id} story ${story.id ?? "?"} must declare bilingual names`)
      if (!story.parameters?.intent || !story.parameters?.intentEn) errors.push(`${id} story ${story.id ?? "?"} must declare bilingual intent`)
    }
    for (const prop of (component.props ?? []).filter((item) => item.type === "segment")) {
      const storyValues = component.stories.map((story) => story.args?.[prop.key])
      if (storyValues.some((value) => value === undefined) || new Set(storyValues).size !== component.stories.length) continue
      const remainingArgs = component.stories.map((story) => JSON.stringify(Object.fromEntries(
        Object.entries(story.args ?? {}).filter(([key]) => key !== prop.key).sort(([left], [right]) => left.localeCompare(right)),
      )))
      if (new Set(remainingArgs).size === 1) {
        errors.push(`${id} stories duplicate realtime prop ${prop.key}; keep the dimension in stories only`)
      }
    }
  }
  for (const testName of component.visualTests ?? []) {
    if (!component.visual?.route || !component.visual.selector) {
      errors.push(`${id} visualTests require visual.route and visual.selector in the manifest`)
    }
    if (!testSource.includes(`test("${testName}"`)) errors.push(`${id} visual test is missing: ${testName}`)
    const storySource = `docs/data/component-playgrounds.manifest.json#${component.pointer}`
    if (!testSource.includes(`data-story-source="${storySource}"`)) errors.push(`${id} visual test must assert ${storySource}`)
    if (Array.isArray(component.stories) && component.storyPresentation !== "examples") {
      const storyCountCall = `storyCount("${component.pointer}")`
      if (!testSource.includes(storyCountCall)) errors.push(`${id} visual test must derive story count from ${storyCountCall}`)
    }
  }
}

const componentSlugs = new Set([
  ...(componentsManifest.uiComponents ?? []),
  ...(componentsManifest.fxComponents ?? []),
].map((item) => item.name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()))
for (const [slug, visual] of Object.entries(manifest.autoVisuals ?? {})) {
  if (!visual.route || !visual.selector || !visual.test) errors.push(`autoVisuals.${slug} must declare route, selector, and test`)
  if (visual.test && !testSource.includes(`test("${visual.test}"`)) errors.push(`autoVisuals.${slug} visual test is missing: ${visual.test}`)
  if (!manifest.autoStories?.[slug] && !components[slug]) errors.push(`autoVisuals.${slug} has no matching story entry`)
}
for (const [slug, visual] of Object.entries(manifest.pageVisuals ?? {})) {
  if (!visual.route || !visual.selector || !visual.test) errors.push(`pageVisuals.${slug} must declare route, selector, and test`)
  if (visual.test && !testSource.includes(`test("${visual.test}"`)) errors.push(`pageVisuals.${slug} visual test is missing: ${visual.test}`)
}
for (const [slug, visual] of Object.entries(manifest.baselineVisuals ?? {})) {
  if (!visual.route || !visual.selector || !visual.test) errors.push(`baselineVisuals.${slug} must declare route, selector, and test`)
  if (visual.test && !testSource.includes(`test("${visual.test}"`)) errors.push(`baselineVisuals.${slug} visual test is missing: ${visual.test}`)
}

const manifestVisualTests = new Set([
  ...Object.values(manifest.autoVisuals ?? {}).map((visual) => visual.test),
  ...Object.values(manifest.pageVisuals ?? {}).map((visual) => visual.test),
  ...Object.values(manifest.baselineVisuals ?? {}).map((visual) => visual.test),
  ...Object.values(playgroundEntries).flatMap((entry) => entry.visualTests ?? []),
  ...(manifest.additionalVisualTests ?? []),
])
for (const match of testSource.matchAll(/^test\("([^"]+)"/gm)) {
  if (!manifestVisualTests.has(match[1])) errors.push(`visual test is not mapped in component-playgrounds manifest: ${match[1]}`)
}
for (const id of manifest.autoScenarioComponents ?? []) {
  if (!components[id] && !componentSlugs.has(id)) errors.push(`auto scenario component is missing from component manifest: ${id}`)
}
const autoScenarioComponents = manifest.autoScenarioComponents ?? []
if (new Set(autoScenarioComponents).size !== autoScenarioComponents.length) {
  errors.push("autoScenarioComponents must contain unique component slugs")
}

for (const [slug, stories] of Object.entries(manifest.autoStories ?? {})) {
  if (!Array.isArray(stories) || stories.length === 0) {
    errors.push(`${slug} autoStories must be a non-empty array`)
    continue
  }
  const ids = new Set()
  for (const story of stories) {
    if (!story.id || ids.has(story.id)) errors.push(`${slug} autoStories must have unique ids`)
    ids.add(story.id)
    if (!story.args || typeof story.args !== "object") errors.push(`${slug} auto story ${story.id ?? "?"} must declare args`)
    if (!story.name || !story.nameEn || !story.parameters?.intent || !story.parameters?.intentEn || !story.parameters?.constraint || !story.parameters?.constraintEn) {
      errors.push(`${slug} auto story ${story.id ?? "?"} must declare bilingual intent and constraint`)
    }
    if (!story.parameters?.code) errors.push(`${slug} auto story ${story.id ?? "?"} must declare code`)
  }
}

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name)
    return entry.isDirectory() ? walk(file) : file.endsWith(".tsx") ? [file] : []
  })
}

for (const file of walk(path.join(root, "src"))) {
  const source = fs.readFileSync(file, "utf8")
  for (const match of source.matchAll(/storySource:\s*["`]([^"`]+)["`]/g)) {
    const pointer = match[1]
    if (pointer === "docs/data/component-playgrounds.manifest.json#autoStories.${slug}") continue
    const prefix = "docs/data/component-playgrounds.manifest.json#"
    const anchor = pointer.startsWith(prefix) ? pointer.slice(prefix.length) : ""
    const isAutoStoryPointer = anchor.startsWith("autoStories.") && Object.hasOwn(manifest.autoStories ?? {}, anchor.slice("autoStories.".length))
    if (!pointer.startsWith(prefix) || (!isAutoStoryPointer && !Object.values(playgroundEntries).some((entry) => entry.pointer === anchor))) {
      errors.push(`invalid storySource in ${path.relative(root, file)}: ${pointer}`)
    }
  }
}

if (errors.length) {
  console.error("playground contract check failed:")
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}
console.log(`playground contract check passed: ${Object.keys(playgroundEntries).length} manifest playgrounds and ${manifest.autoScenarioComponents?.length ?? 0} auto story components`)

import { access, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)))
const outputPath = path.join(root, "docs/data/component-quality.manifest.json")

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(root, relativePath), "utf8"))
}

async function exists(relativePath) {
  try {
    await access(path.join(root, relativePath))
    return true
  } catch {
    return false
  }
}

function slugFromSource(source) {
  return path.basename(source, path.extname(source))
}

function camelCaseKey(slug) {
  return slug.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}

function kebabCaseKey(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .toLowerCase()
}

function hasExportedComponentSymbol(sourceText, componentName, slug) {
  const exportAliases = {
    Chart: ["ChartContainer"],
    Command: ["CommandPalette"],
    Toast: ["Toaster", "Sonner"],
  }
  const candidates = [componentName, ...(exportAliases[componentName] ?? []), slug, slug.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())]
  return candidates.some((name) => {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    return new RegExp(`export\\s+(?:const|function|class)\\s+${escaped}\\b`).test(sourceText)
      || new RegExp(`export\\s*\\{[^}]*\\b${escaped}\\b[^}]*\\}`).test(sourceText)
  })
}

function firstExistingKey(collection, candidates) {
  return candidates.find((key) => Object.hasOwn(collection ?? {}, key)) ?? null
}

function hasFocusEvidence(states) {
  return states.some((state) => /focus|keyboard/i.test(state))
}

function focusEvidence(sourceText, docText, states) {
  if (hasFocusEvidence(states)) return "declared-focus-state"
  if (/(?:不创建|不进入|不接管|不是)[^\n]{0,80}(?:焦点|tab stop|tab 顺序)|(?:no|not)[^\n]{0,80}(?:focus|tab stop)/i.test(`${sourceText}\n${docText}`)) {
    return "not-applicable-declared"
  }
  if (/focus-visible|focus-within|tabIndex|aria-expanded|aria-selected|aria-activedescendant|data-active/i.test(`${sourceText}\n${docText}`)) {
    return "source-or-doc-focus-semantics"
  }
  if (/from ["']@base-ui\/react\/(?!merge-props|use-render)[^"']+["']/.test(sourceText)) {
    return "base-ui-primitive-focus-contract"
  }
  if (/<(button|a|input|textarea|select)\b/i.test(sourceText)) {
    return "native-control-focus-contract"
  }
  return null
}

function isInteractiveSource(sourceText, states) {
  return /<(button|input|textarea|select|a)\b|onClick|onKeyDown|tabIndex|aria-(checked|expanded|haspopup|selected)|role=\"(button|checkbox|combobox|dialog|menu|tab)\"/i.test(sourceText)
    || states.some((state) => /disabled|loading|checked|selected|expanded|active|open|focus|keyboard/i.test(state))
}

function keyboardEvidence(sourceText, docText) {
  if (/(?:不创建|不进入|不接管|不是)[^\n]{0,80}(?:键盘|tab stop|tab 顺序)|(?:no|not)[^\n]{0,80}(?:keyboard|tab stop)/i.test(`${sourceText}\n${docText}`)) {
    return "not-applicable-declared"
  }
  if (/keyboard|keydown|keyup|tabindex|roving focus/i.test(`${sourceText}\n${docText}`)) {
    return "source-or-doc-keyboard-reference"
  }
  if (/<(button|a|input|textarea|select)\b/i.test(sourceText)) {
    return "native-control-keyboard-contract"
  }
  if (/from ["']@base-ui\/react\/(?!merge-props|use-render)[^"']+["']/.test(sourceText)) {
    return "base-ui-primitive-keyboard-contract"
  }
  return null
}

function testHasScreenshot(visualSource, testName) {
  const marker = `test("${testName}"`
  const start = visualSource.indexOf(marker)
  if (start === -1) return false
  const next = visualSource.indexOf("\ntest(", start + marker.length)
  const testSource = visualSource.slice(start, next === -1 ? undefined : next)
  return testSource.includes("toHaveScreenshot(")
}

function visualEvidence(slug, componentName, visualSource, playground, playgroundManifest, autoVisual) {
  const aliases = [slug, componentName, componentName.toLowerCase()]
  const referenced = aliases.some((alias) => visualSource.toLowerCase().includes(alias.toLowerCase()))
  const hasManifestVisual = Boolean(
    playground?.visual?.route && playground.visual?.selector
    || autoVisual?.route && autoVisual?.selector,
  )
  const hasManifestVisualTest = Array.isArray(playground?.visualTests)
    && playground.visualTests.some((testName) => testHasScreenshot(visualSource, testName))
  const hasAutoVisualTest = Boolean(autoVisual?.test && testHasScreenshot(visualSource, autoVisual.test))
  return {
    spec: "tests/visual.spec.ts",
    manifest: hasManifestVisual
      ? `docs/data/component-playgrounds.manifest.json#${autoVisual?.kind === "page" ? `pageVisuals.${slug}` : autoVisual?.kind === "baseline" ? `baselineVisuals.${slug}` : autoVisual ? `autoVisuals.${slug}` : playgroundManifest ?? "visual"}`
      : null,
    referenced: referenced && (hasManifestVisualTest || hasAutoVisualTest || (!playground?.visualTests && !autoVisual)),
    status: referenced && (hasManifestVisualTest || hasAutoVisualTest || (!playground?.visualTests && !autoVisual)) ? "covered" : "needs-review",
  }
}

async function build() {
  const [components, playgrounds, visualSource] = await Promise.all([
    readJson("docs/data/components.manifest.json"),
    readJson("docs/data/component-playgrounds.manifest.json"),
    readFile(path.join(root, "tests/visual.spec.ts"), "utf8"),
  ])
  const behaviorSource = await readFile(path.join(root, "tests/component-behavior.spec.ts"), "utf8")

  const entries = []
  for (const layer of ["uiComponents", "fxComponents"]) {
    for (const component of components[layer] ?? []) {
      const slug = slugFromSource(component.source)
      const componentNameKey = kebabCaseKey(component.name)
      const playgroundKey = firstExistingKey(playgrounds.components, [slug, componentNameKey, camelCaseKey(slug), camelCaseKey(componentNameKey)])
      const customPlaygroundKey = firstExistingKey(playgrounds.customPlaygrounds, [slug, componentNameKey, camelCaseKey(slug), camelCaseKey(componentNameKey)])
      const playground = playgroundKey
        ? playgrounds.components[playgroundKey]
        : customPlaygroundKey
          ? playgrounds.customPlaygrounds[customPlaygroundKey]
          : undefined
      const playgroundManifest = playgroundKey
        ? `components.${playgroundKey}`
        : customPlaygroundKey
          ? `customPlaygrounds.${customPlaygroundKey}`
          : null
      const autoStoryKey = firstExistingKey(playgrounds.autoStories, [slug, componentNameKey, camelCaseKey(slug), camelCaseKey(componentNameKey)])
      const stories = [
        ...(autoStoryKey ? playgrounds.autoStories[autoStoryKey] : []),
        ...(playground?.stories ?? []),
      ]
      const sourceText = await readFile(path.join(root, component.source), "utf8")
      const docText = component.doc && await exists(component.doc)
        ? await readFile(path.join(root, component.doc), "utf8")
        : ""
      const storyText = JSON.stringify(stories)
      const states = [...new Set([
        ...(component.nativeStates ?? []),
        ...(component.composedStates ?? []).map((state) => state.name),
      ])]
      const interaction = isInteractiveSource(sourceText, states) ? "interactive" : "non-interactive"
      const gaps = []
      const behaviorTestName = `behavior: ${component.name} keyboard focus`
      const hasBehaviorHarness = behaviorSource.includes("for (const component of qualityManifest.components.filter")
      const hasExplicitBehaviorTest = behaviorSource.includes(`state: ${component.name} `)
      const behaviorVisualAvailable = Boolean(
        playground?.visual?.route && playground.visual.selector
        || playgrounds.autoVisuals?.[slug]?.route && playgrounds.autoVisuals[slug]?.selector
        || playgrounds.pageVisuals?.[slug]?.route && playgrounds.pageVisuals[slug]?.selector
        || playgrounds.baselineVisuals?.[slug]?.route && playgrounds.baselineVisuals[slug]?.selector,
      )
      const hasBehaviorTest = hasExplicitBehaviorTest || hasBehaviorHarness && behaviorVisualAvailable
      const keyboardEvidenceSource = keyboardEvidence(sourceText, docText)
      const keyboard = {
        status: interaction === "non-interactive" || keyboardEvidenceSource === "not-applicable-declared" ? "not-applicable" : hasBehaviorTest ? "evidenced" : keyboardEvidenceSource ? "evidenced" : "needs-review",
        evidence: interaction === "non-interactive" ? "no-keyboard-surface" : hasBehaviorTest ? "playwright-behavior-test" : keyboardEvidenceSource
          ? keyboardEvidenceSource
          : "no-keyboard-evidence-declared",
      }
      const focusEvidenceSource = focusEvidence(sourceText, docText, states)
      const focus = {
        status: interaction === "non-interactive" || focusEvidenceSource === "not-applicable-declared" ? "not-applicable" : hasBehaviorTest ? "evidenced" : focusEvidenceSource ? "evidenced" : "needs-review",
        evidence: interaction === "non-interactive" ? "no-focus-surface" : hasBehaviorTest ? "playwright-behavior-test" : focusEvidenceSource ?? "no-focus-evidence-declared",
        states: states.filter((state) => /focus/i.test(state)),
      }
      const stateApplicability = components.stateApplicability ?? {}
      const stateCoverage = Object.fromEntries(["disabled", "loading", "error"].map((state) => {
        const explicitlyNotApplicable = (stateApplicability[state] ?? []).includes(component.name)
        const sourceEvidence = states.some((item) => item.toLowerCase().includes(state))
          || new RegExp(`\\b${state}\\b`, "i").test(sourceText)
          || state === "error" && /aria-invalid|data-invalid|field-error/i.test(`${sourceText}\n${docText}`)
        const docEvidence = new RegExp(`\\b${state}\\b`, "i").test(docText)
        const storyEvidence = new RegExp(`\\b${state}\\b`, "i").test(storyText)
        const stateBehaviorTests = {
          Button: { test: "state: Button disabled loading", states: ["disabled", "loading"] },
          Input: { test: "state: Input disabled error", states: ["disabled", "error"] },
          Link: { test: "state: Link real, disabled, and icon semantics", states: ["disabled"] },
          Select: { test: "state: Select loading error disabled", states: ["disabled", "loading", "error"] },
          Field: { test: "state: Field invalid disabled", states: ["disabled", "error"] },
        }
        const stateBehavior = stateBehaviorTests[component.name]
        const behaviorEvidence = Boolean(stateBehavior && stateBehavior.states.includes(state) && behaviorSource.includes(stateBehavior.test))
        const evidenceSources = [
          sourceEvidence ? "source" : null,
          docEvidence ? "doc" : null,
          storyEvidence ? "story" : null,
          behaviorEvidence ? "behavior" : null,
        ].filter(Boolean)
        const notApplicable = explicitlyNotApplicable || interaction === "non-interactive" && evidenceSources.length === 0
        return [state, {
          status: explicitlyNotApplicable ? "not-applicable" : evidenceSources.length > 0 ? "evidenced" : notApplicable ? "not-applicable" : "not-declared",
          evidence: explicitlyNotApplicable ? "manifest-state-not-applicable" : evidenceSources.length > 0 ? evidenceSources.join("+") : notApplicable ? "non-interactive-component" : "no-state-evidence-declared",
          sources: {
            source: sourceEvidence,
            doc: docEvidence,
            story: storyEvidence,
            behavior: behaviorEvidence,
          },
        }]
      }))
      if (interaction === "interactive") {
        for (const state of ["disabled", "loading", "error"]) {
          if (stateCoverage[state].status === "not-declared") gaps.push(`state:${state}`)
        }
      }
      const docs = {
        path: component.doc ?? null,
        status: component.docStatus === "internal"
          ? "internal"
          : component.doc && await exists(component.doc) && component.docStatus === "complete"
            ? "complete"
            : "needs-review",
      }
      const tokenUsage = {
        status: (component.tokenRefs ?? []).length > 0 ? "declared" : "needs-review",
        evidence: (component.tokenRefs ?? []).length > 0
          ? "components-manifest-tokenRefs"
          : "no-token-refs-declared",
        refs: component.tokenRefs ?? [],
      }
      const autoScenarioKey = (playgrounds.autoScenarioComponents ?? []).find((key) => [slug, componentNameKey, camelCaseKey(slug), camelCaseKey(componentNameKey)].includes(key))
      const pageVisualKey = firstExistingKey(playgrounds.pageVisuals, [slug, componentNameKey, camelCaseKey(slug), camelCaseKey(componentNameKey)])
      const baselineVisualKey = firstExistingKey(playgrounds.baselineVisuals, [slug, componentNameKey, camelCaseKey(slug), camelCaseKey(componentNameKey)])
      const playgroundCoverage = playground
        ? { manifest: playgroundManifest, status: "interactive" }
        : pageVisualKey
          ? { manifest: `pageVisuals.${pageVisualKey}`, status: "page" }
        : baselineVisualKey
          ? { manifest: `baselineVisuals.${baselineVisualKey}`, status: "page" }
        : (playgrounds.autoStories?.[autoStoryKey]?.length ?? 0) > 0
          ? { manifest: `autoStories.${autoStoryKey}`, status: "stories" }
          : autoScenarioKey
            ? { manifest: "autoScenarioComponents", status: "scenario" }
          : { manifest: null, status: "needs-review" }
      const manifestVisual = playgrounds.autoVisuals?.[slug]
        ? { ...playgrounds.autoVisuals[slug], kind: "auto" }
        : playgrounds.pageVisuals?.[slug]
        ? { ...playgrounds.pageVisuals[slug], kind: "page" }
        : playgrounds.baselineVisuals?.[slug]
          ? { ...playgrounds.baselineVisuals[slug], kind: "baseline" }
        : undefined
      const visual = visualEvidence(
        slug,
        component.name,
        visualSource,
        playground,
        playgroundManifest,
        manifestVisual,
      )
      if (keyboard.status === "needs-review") gaps.push("keyboard")
      if (focus.status === "needs-review") gaps.push("focus")
      if (interaction === "interactive" && !hasBehaviorTest) gaps.push("behavior")
      if (tokenUsage.status === "needs-review") gaps.push("tokens")
      if (playgroundCoverage.status === "needs-review") gaps.push("playground")
      if (visual.status === "needs-review") gaps.push("visual")
      if (!(["complete", "internal"].includes(docs.status))) gaps.push("docs")

      const apiSymbolExported = hasExportedComponentSymbol(sourceText, component.name, slug)
      const api = {
        source: component.source,
        status: apiSymbolExported ? "verified" : "needs-review",
        evidence: apiSymbolExported ? "source-export-symbol" : sourceText ? "source-file-readable-no-matching-export" : "source-file-empty",
      }
      if (api.status === "needs-review") gaps.push("api")

      const hasInteractionState = states.some((state) =>
        /hover|active|focus|disabled|checked|selected|expanded|open|starting|ending/i.test(state)
      )
      const hasRealScenarios = stories.length >= 3
        && stories.every((story) => story.parameters?.intent && story.parameters?.source)
      const capabilityCoverage = {
        structure: {
          status: (component.semanticDom ?? []).length > 0 ? "covered" : "needs-review",
          evidence: (component.semanticDom ?? []).length > 0 ? "components-manifest-semanticDom" : "no-structured-parts-declared",
          values: component.semanticDom ?? [],
        },
        sizes: {
          status: (component.sizes ?? []).length > 0
            ? "covered"
            : component.sizesNotApplicable
              ? "not-applicable"
              : "needs-review",
          evidence: (component.sizes ?? []).length > 0
            ? "components-manifest-sizes"
            : component.sizesNotApplicable
              ? "component-size-not-applicable"
              : "size-capability-not-audited",
          values: component.sizes ?? [],
        },
        visualVariants: {
          status: (component.variants ?? []).length > 0
            ? "covered"
            : component.variantsNotApplicable
              ? "not-applicable"
              : "needs-review",
          evidence: (component.variants ?? []).length > 0
            ? "components-manifest-variants"
            : component.variantsNotApplicable
              ? "component-visual-variant-not-applicable"
              : "variant-capability-not-audited",
          values: component.variants ?? [],
        },
        interactionStates: {
          status: interaction === "non-interactive" ? "not-applicable" : hasInteractionState ? "covered" : "needs-review",
          evidence: interaction === "non-interactive"
            ? "non-interactive-component"
            : hasInteractionState
              ? "components-manifest-nativeStates"
              : "interaction-state-capability-not-audited",
          values: states,
        },
        businessCompositions: {
          status: component.businessCompositionsNotApplicable ? "not-applicable" : stories.length >= 3 ? "covered" : "needs-review",
          evidence: component.businessCompositionsNotApplicable ? "component-business-compositions-not-applicable" : stories.length >= 3 ? "playground-stories" : "fewer-than-three-composition-stories",
          values: stories.map((story) => story.id),
        },
        accessibility: {
          status: interaction === "non-interactive"
            ? "not-applicable"
            : keyboard.status === "evidenced" && focus.status === "evidenced" && hasBehaviorTest
              ? "covered"
              : "needs-review",
          evidence: interaction === "non-interactive"
            ? "non-interactive-component"
            : keyboard.status === "evidenced" && focus.status === "evidenced" && hasBehaviorTest
              ? "keyboard-focus-behavior-evidence"
              : "accessibility-capability-not-fully-evidenced",
        },
        realScenarios: {
          status: component.realScenariosComplete || hasRealScenarios ? "covered" : "needs-review",
          evidence: component.realScenariosComplete ? "components-manifest-real-scenarios-complete" : hasRealScenarios ? "playground-story-intent-and-source" : "real-scenario-evidence-incomplete",
          values: stories.map((story) => story.id),
        },
      }
      for (const [capability, evidence] of Object.entries(capabilityCoverage)) {
        if (evidence.status === "needs-review") gaps.push(`capability:${capability}`)
      }

      entries.push({
        name: component.name,
        layer: layer === "uiComponents" ? "ui" : "fx",
        source: component.source,
        api,
        behavior: {
          spec: "tests/component-behavior.spec.ts",
          test: behaviorTestName,
          status: interaction === "non-interactive" ? "not-applicable" : hasBehaviorTest ? "covered" : "needs-review",
        },
        keyboard,
        focus,
        interaction,
        states,
        capabilityCoverage,
        stateCoverage,
        tokens: component.tokenRefs ?? [],
        tokenUsage,
        visual,
        playground: playgroundCoverage,
        docs,
        status: gaps.length === 0 ? "covered" : "needs-review",
        gaps,
      })
    }
  }

  return {
    schemaVersion: 1,
    format: "fx-ui/component-quality",
    updatedAt: new Date().toISOString().slice(0, 10),
    truthSources: [
      "docs/data/components.manifest.json",
      "docs/data/component-playgrounds.manifest.json",
      "tests/visual.spec.ts",
    ],
    note: "派生质量矩阵：同时检查 API 证据与结构、尺寸、视觉变体、交互态、业务组合、可访问性、真实场景七个成熟度维度；缺少证据明确标为 needs-review。",
    components: entries,
  }
}

const manifest = await build()
const expected = `${JSON.stringify(manifest, null, 2)}\n`
if (process.argv.includes("--check")) {
  const actual = await readFile(outputPath, "utf8")
  if (actual !== expected) {
    console.error("component quality manifest is stale; run npm run build:quality")
    process.exit(1)
  }
  console.log(`component quality check passed: ${manifest.components.length} components tracked`)
} else {
  await writeFile(outputPath, expected)
  console.log(`built ${path.relative(root, outputPath)}: ${manifest.components.length} components tracked`)
}

#!/usr/bin/env node
// 从组件 manifest 和调试台事实派生 Agent 组件查询 contract。
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), "utf8"))
const components = read("docs/data/components.manifest.json")
const playgrounds = read("docs/data/component-playgrounds.manifest.json")
const outputPath = path.join(root, "docs/data/agent-components.manifest.json")

// 示例事实仍由组件文档页 / 调试台维护；这里仅输出可定位的来源指针，避免复制 JSX 形成第二真相源。
const exampleSources = {
  Input: {
    sourceFile: "src/App.tsx",
    pageSymbol: "InputPage",
    playground: "inputPlaygroundConfig",
    importCode: "inputImportCodeForPlayground",
    anchors: ["#input-usage", "#input-props", "#input-do-dont"],
  },
  Select: {
    sourceFile: "src/App.tsx",
    pageSymbol: "SelectPage",
    playground: "selectPlaygroundConfig",
    anchors: ["#select-usage", "#select-props", "#select-do-dont"],
  },
  Button: {
    sourceFile: "src/App.tsx",
    pageSymbol: "ButtonPage",
    anchors: ["#playground", "#usage", "#props"],
  },
  DatePicker: {
    sourceFile: "src/App.tsx",
    pageSymbol: "DatePickerPage",
    pageSlug: "date-picker",
    scenarios: "datePickerScenarioExamples",
    usageCode: "<DatePicker defaultValue={new Date(2026, 6, 15)} clearable />",
    anchors: ["#date-picker-preview", "#date-picker-usage", "#date-picker-props"],
  },
  TopBar: {
    sourceFile: "src/App.tsx",
    pageSymbol: "TopBarPage",
    pageSlug: "top-bar",
    scenarios: "topBarScenarioExamples",
    anchors: ["#top-bar-preview", "#top-bar-usage", "#top-bar-props"],
  },
}

const entries = [...(components.uiComponents ?? []), ...(components.fxComponents ?? [])]
  .map((component) => {
    const playground = playgrounds.components?.[component.name.toLowerCase()]
    return {
      name: component.name,
      layer: components.uiComponents?.includes(component) ? "ui" : "fx",
      category: component.category,
      role: component.role,
      source: component.source,
      doc: component.doc,
      apiSource: component.source,
      nativeStates: component.nativeStates ?? [],
      semanticDom: component.semanticDom ?? [],
      tokenRefs: component.tokenRefs ?? [],
      usageRules: component.usageRules ?? [],
      variants: component.variants ?? [],
      sizes: component.sizes ?? [],
      examples: exampleSources[component.name],
      playgroundControls: playground ? {
        notComponentApi: true,
        props: (playground.props ?? []).map((prop) => ({ key: prop.key, propName: prop.propName, type: prop.type })),
      } : undefined,
    }
  })
  .sort((a, b) => a.name.localeCompare(b.name))

const output = JSON.stringify({
  schemaVersion: 1,
  format: "fx-ui/agent-components-contract",
  derivedFrom: ["docs/data/components.manifest.json", "docs/data/component-playgrounds.manifest.json"],
  policy: "Read apiSource before writing component code. Use declared props and composition only; do not invent APIs or override component visual styles at call sites.",
  queryPolicy: {
    explainMatches: true,
    componentBeforeToken: true,
    apiSourceRequiredBeforeImplementation: true,
    playgroundControlsAreNotComponentApi: true,
    examplesAreSourcePointersOnly: true,
    plansUseVerifiedPathsOnly: true,
    impactUsesDeclaredReferencesOnly: true,
    examplesAreVerifiable: true,
    recipesUseProvenCompositionsOnly: true,
    mutableSearchStrategy: "Synonyms and ranking weights evolve in the CLI; they are not component or design rules.",
  },
  components: entries,
}, null, 2) + "\n"

if (process.argv.includes("--check")) {
  if (!fs.existsSync(outputPath) || fs.readFileSync(outputPath, "utf8") !== output) {
    console.error("agent component contract is stale. Run: npm run build:agent")
    process.exit(1)
  }
  console.log("agent component contract check passed")
} else {
  fs.writeFileSync(outputPath, output)
  console.log(`built docs/data/agent-components.manifest.json: ${entries.length} components`)
}

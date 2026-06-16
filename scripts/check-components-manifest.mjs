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

function extractVariantKeys(source, groupName) {
  const groupStart = source.indexOf(`${groupName}: {`)
  if (groupStart === -1) {
    return []
  }

  const nextGroup = source.indexOf("\n      },", groupStart)
  const groupSource = source.slice(groupStart, nextGroup)

  return [...groupSource.matchAll(/^\s{8}(?:"([^"]+)"|([a-z][\w-]*)):\s/mg)].map(
    (match) => match[1] ?? match[2]
  )
}

function sameMembers(actual, expected) {
  return actual.length === expected.length && actual.every((item) => expected.includes(item))
}

function assertIncludes(source, values, label, errors) {
  for (const value of values) {
    if (value === "root") continue
    if (!source.includes(value)) {
      errors.push(`${label} is missing "${value}"`)
    }
  }
}

const manifest = await readJson("docs/data/components.manifest.json")
const designTokens = await readJson("docs/data/design-tokens.json")
const errors = []
const knownTokenRefs = new Set([
  ...(designTokens.primitive ?? []),
  ...(designTokens.semantic ?? []),
].map((token) => token.name))

if (manifest.format !== "fx-ui/components-manifest") {
  errors.push("components manifest format must be fx-ui/components-manifest")
}

for (const component of manifest.uiComponents ?? []) {
  if (!(await fileExists(component.source))) {
    errors.push(`component source is missing: ${component.name} -> ${component.source}`)
  }
  if (component.doc && !(await fileExists(component.doc))) {
    errors.push(`component doc is missing: ${component.name} -> ${component.doc}`)
  }
  if (component.devInspector && !(await fileExists(component.devInspector))) {
    errors.push(`component devInspector config is missing: ${component.name} -> ${component.devInspector}`)
  }

  for (const tokenRef of component.tokenRefs ?? []) {
    if (!knownTokenRefs.has(tokenRef)) {
      errors.push(`${component.name} tokenRef is not declared in docs/data/design-tokens.json: ${tokenRef}`)
    }
  }
}

for (const component of manifest.fxComponents ?? []) {
  if (!(await fileExists(component.source))) {
    errors.push(`fx component source is missing: ${component.name} -> ${component.source}`)
  }

  for (const tokenRef of component.tokenRefs ?? []) {
    if (!knownTokenRefs.has(tokenRef)) {
      errors.push(`${component.name} tokenRef is not declared in docs/data/design-tokens.json: ${tokenRef}`)
    }
  }
}

for (const component of manifest.uiComponents ?? []) {
  if (component.docStatus !== "complete") continue

  const missingCompleteFields = [
    "doc",
    "category",
    "nativeStates",
    "semanticDom",
    "tokenRefs",
    "usageRules",
  ].filter((field) => !component[field] || (Array.isArray(component[field]) && component[field].length === 0))

  if (missingCompleteFields.length > 0) {
    errors.push(`${component.name} is marked complete but missing fields: ${missingCompleteFields.join(", ")}`)
  }

  const componentSource = await readText(component.source)
  const componentDoc = await readText(component.doc)

  assertIncludes(componentSource, component.semanticDom ?? [], `${component.name} source semantic DOM`, errors)
  assertIncludes(componentDoc, component.nativeStates ?? [], `${component.name} doc native states`, errors)
  assertIncludes(componentDoc, component.semanticDom ?? [], `${component.name} doc semantic DOM`, errors)
  assertIncludes(componentDoc, component.tokenRefs ?? [], `${component.name} doc token refs`, errors)

  const forbiddenDocPhrases = [
    "fx-ui 的shadcn",
    "具体 JSX 组合以当前源码和页面示例为准",
    "Component props",
    "className=\"border-[#FF8000]\"",
    "文档资产，记录真实源码能力",
    "当前源码未暴露 data-slot",
    "源码中存在的状态或交互标记",
    "源码消费的语义 token",
    "该导入只展示主入口",
    "borderColor: \"#FF8000\"",
    "@/components/ui/",
    "@/components/fx/",
  ]

  for (const phrase of forbiddenDocPhrases) {
    const allowedImportPath =
      (phrase === "@/components/ui/" || phrase === "@/components/fx/") &&
      !componentDoc.includes(".tsx\"")
    if (!allowedImportPath && componentDoc.includes(phrase)) {
      errors.push(`${component.name} doc still contains generated placeholder phrase: ${phrase}`)
    }
  }
}

const button = (manifest.uiComponents ?? []).find((component) => component.name === "Button")
if (!button) {
  errors.push("Button must be present in components manifest")
} else {
  const [buttonSource, buttonDoc, inspectorSource] = await Promise.all([
    readText(button.source),
    readText(button.doc),
    button.devInspector ? readText(button.devInspector) : "",
  ])

  const sourceVariants = extractVariantKeys(buttonSource, "variant")
  const sourceSizes = extractVariantKeys(buttonSource, "size")

  if (!sameMembers(sourceVariants, button.variants ?? [])) {
    errors.push(`Button variants drift: source=[${sourceVariants.join(", ")}], manifest=[${(button.variants ?? []).join(", ")}]`)
  }

  if (!sameMembers(sourceSizes, button.sizes ?? [])) {
    errors.push(`Button sizes drift: source=[${sourceSizes.join(", ")}], manifest=[${(button.sizes ?? []).join(", ")}]`)
  }

  assertIncludes(buttonDoc, button.variants ?? [], "Button doc variants", errors)
  assertIncludes(buttonDoc, button.sizes ?? [], "Button doc sizes", errors)
  assertIncludes(buttonDoc, button.nativeStates ?? [], "Button doc native states", errors)
  assertIncludes(buttonSource, button.semanticDom ?? [], "Button source semantic DOM", errors)
  assertIncludes(inspectorSource, button.variants ?? [], "Button DevInspector variants", errors)
  assertIncludes(buttonDoc, ["render", "ButtonGroup"], "Button doc composition and render API", errors)
  assertIncludes(buttonSource, ["ButtonPrimitive.Props"], "Button source Base UI props", errors)

  for (const state of button.composedStates ?? []) {
    assertIncludes(buttonDoc, [state.name, state.composition], `Button composed state "${state.name}" doc`, errors)
    assertIncludes(inspectorSource, [state.name, state.composition], `Button composed state "${state.name}" DevInspector`, errors)
  }

  const forbiddenButtonDocs = ["loading prop", "<Button loading>"]
  for (const forbidden of forbiddenButtonDocs) {
    if (buttonDoc.includes(forbidden) && !buttonDoc.includes("没有 `loading` prop")) {
      errors.push(`Button doc may imply unsupported API: ${forbidden}`)
    }
  }
}

const input = (manifest.uiComponents ?? []).find((component) => component.name === "Input")
if (!input) {
  errors.push("Input must be present in components manifest")
} else {
  const inputDoc = await readText(input.doc)
  assertIncludes(
    inputDoc,
    ["FieldGroup", "Field", "FieldLabel", "FieldError", "data-invalid", "aria-invalid"],
    "Input doc field composition",
    errors
  )

  const forbiddenInputDocs = [
    '<div className="grid gap-2">',
    'import { Label } from "@/components/ui/label"',
  ]
  for (const forbidden of forbiddenInputDocs) {
    if (inputDoc.includes(forbidden)) {
      errors.push(`Input doc may imply deprecated field composition: ${forbidden}`)
    }
  }
}

const badge = (manifest.uiComponents ?? []).find((component) => component.name === "Badge")
if (!badge) {
  errors.push("Badge must be present in components manifest")
} else {
  const [badgeSource, badgeDoc, appSource] = await Promise.all([
    readText(badge.source),
    readText(badge.doc),
    readText("src/App.tsx"),
  ])
  const sourceVariants = extractVariantKeys(badgeSource, "variant")

  if (!sameMembers(sourceVariants, badge.variants ?? [])) {
    errors.push(`Badge variants drift: source=[${sourceVariants.join(", ")}], manifest=[${(badge.variants ?? []).join(", ")}]`)
  }

  assertIncludes(badgeDoc, badge.variants ?? [], "Badge doc variants", errors)
  assertIncludes(appSource, badge.variants ?? [], "Badge page variants", errors)
  assertIncludes(badgeDoc, ["render", "data-icon", "slot: \"badge\"", "Badge 不是 Button"], "Badge doc render and semantic rules", errors)
  assertIncludes(badgeSource, ["useRender", "slot: \"badge\"", "render"], "Badge source Base UI render", errors)

  const forbiddenBadgeDocs = [
    "Badge 提供 6 种 variant",
    "当前源码未暴露 data-slot",
    "<Badge>\n  <a",
  ]
  for (const forbidden of forbiddenBadgeDocs) {
    if (badgeDoc.includes(forbidden) || appSource.includes(forbidden)) {
      errors.push(`Badge docs may imply outdated or invalid usage: ${forbidden}`)
    }
  }
}

if (errors.length > 0) {
  console.error("components manifest check failed:\n")
  for (const error of errors) {
    console.error(`- ${error}`)
  }
  process.exitCode = 1
} else {
  const completeCount = (manifest.uiComponents ?? []).filter((component) => component.docStatus === "complete").length
  console.log(
    `components manifest check passed: ${(manifest.uiComponents ?? []).length} ui components, ${(manifest.fxComponents ?? []).length} fx components, ${completeCount} complete contracts.`
  )
}

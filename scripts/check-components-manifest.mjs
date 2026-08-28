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
    const slotMatch = value.match(/^data-slot="([^"]+)"$/)
    const hasSemanticSlot = slotMatch
      ? source.includes(value)
        || source.includes(`"data-slot": "${slotMatch[1]}"`)
        || source.includes(`slot: "${slotMatch[1]}"`)
      : false
    if (!source.includes(value) && !hasSemanticSlot) {
      errors.push(`${label} is missing "${value}"`)
    }
  }
}

async function validateRuleSync(component, errors) {
  for (const rule of component.ruleSync ?? []) {
    if (!rule.path || !Array.isArray(rule.includes) || rule.includes.length === 0) {
      errors.push(`${component.name} ruleSync entry is incomplete: ${JSON.stringify(rule)}`)
      continue
    }

    if (!(await fileExists(rule.path))) {
      errors.push(`${component.name} ruleSync target is missing: ${rule.path}`)
      continue
    }

    const targetSource = await readText(rule.path)
    assertIncludes(
      targetSource,
      rule.includes,
      `${component.name} ruleSync${rule.label ? ` (${rule.label})` : ""}`,
      errors
    )
  }
}

const manifest = await readJson("docs/data/components.manifest.json")
const designTokens = await readJson("docs/data/design-tokens.json")
const errors = []
const knownTokenRefs = new Set([
  ...(designTokens.primitive ?? []),
  ...(designTokens.semantic ?? []),
  ...(designTokens.componentHooks?.tokens ?? []),
].flatMap((token) => [token.name, token.fdsName].filter(Boolean)))

if (manifest.format !== "fx-ui/components-manifest") {
  errors.push("components manifest format must be fx-ui/components-manifest")
}

const componentNames = new Set([
  ...(manifest.uiComponents ?? []),
  ...(manifest.fxComponents ?? []),
].map((component) => component.name))
const nativeSemanticComponents = manifest.nativeSemanticComponents ?? []
const nativeSemanticNames = new Set(nativeSemanticComponents.map((component) => component.name))
const decisionsSource = await readText("docs/DECISIONS.md")

for (const exception of nativeSemanticComponents) {
  if (!exception.name || !exception.primitive || !exception.decision || !exception.reason) {
    errors.push(`native semantic component whitelist entry is incomplete: ${JSON.stringify(exception)}`)
    continue
  }
  const component = (manifest.uiComponents ?? []).find((entry) => entry.name === exception.name)
  if (!component) {
    errors.push(`native semantic component whitelist references unknown component: ${exception.name}`)
    continue
  }
  if (component.origin !== "native-semantic") {
    errors.push(`${exception.name} is whitelisted as native semantic but origin is not native-semantic`)
  }
  if (!(await fileExists(component.source))) {
    errors.push(`native semantic component source is missing: ${exception.name} -> ${component.source}`)
  } else {
    const source = await readText(component.source)
    if (!source.includes(`<${exception.primitive}`)) {
      errors.push(`${exception.name} does not render declared native primitive <${exception.primitive}>`)
    }
  }
  if (!decisionsSource.includes(`### ${exception.decision}:`)) {
    errors.push(`${exception.name} references missing decision: ${exception.decision}`)
  }
}

for (const component of manifest.uiComponents ?? []) {
  if (component.origin === "native-semantic" && !nativeSemanticNames.has(component.name)) {
    errors.push(`${component.name} declares native-semantic origin without whitelist registration`)
  }
  if (component.origin === "shadcn-extended") {
    if (!component.upstream || !component.decision || !Array.isArray(component.extensions) || component.extensions.length === 0) {
      errors.push(`${component.name} shadcn-extended origin requires upstream, decision, and extensions`)
    }
    if (component.decision && !decisionsSource.includes(`### ${component.decision}:`)) {
      errors.push(`${component.name} references missing extension decision: ${component.decision}`)
    }
  }
}
for (const state of ["disabled", "loading", "error"]) {
  const names = manifest.stateApplicability?.[state] ?? []
  if (!Array.isArray(names)) {
    errors.push(`stateApplicability.${state} must be an array`)
    continue
  }
  for (const name of names) {
    if (!componentNames.has(name)) errors.push(`stateApplicability.${state} references unknown component: ${name}`)
  }
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

for (const component of [...(manifest.uiComponents ?? []), ...(manifest.fxComponents ?? [])]) {
  await validateRuleSync(component, errors)
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

  const inheritedSemanticDom = component.inheritedSemanticDom ?? []
  const localSemanticDom = (component.semanticDom ?? []).filter((part) => !inheritedSemanticDom.includes(part))
  const undeclaredInheritedSemanticDom = inheritedSemanticDom.filter((part) => !(component.semanticDom ?? []).includes(part))
  if (undeclaredInheritedSemanticDom.length > 0) {
    errors.push(`${component.name} inherited semantic DOM is missing from semanticDom: ${undeclaredInheritedSemanticDom.join(", ")}`)
  }
  if (inheritedSemanticDom.length > 0 && !componentSource.includes("@base-ui/react/")) {
    errors.push(`${component.name} declares inherited semantic DOM without a Base UI primitive source`)
  }
  assertIncludes(componentSource, localSemanticDom, `${component.name} source semantic DOM`, errors)
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

const card = (manifest.uiComponents ?? []).find((component) => component.name === "Card")
if (!card) {
  errors.push("Card must be present in components manifest")
} else {
  const [cardSource, cardDoc, cardPageSource, websiteCardSource] = await Promise.all([
    readText(card.source),
    readText(card.doc),
    readText("src/pages/docs/components/card-page.tsx"),
    readText("src/components/fx/website-card-container.tsx"),
  ])
  const sourceVariants = extractVariantKeys(cardSource, "variant")
  const sourceSizes = extractVariantKeys(cardSource, "size")

  if (!sameMembers(sourceVariants, card.variants ?? [])) {
    errors.push(`Card variants drift: source=[${sourceVariants.join(", ")}], manifest=[${(card.variants ?? []).join(", ")}]`)
  }

  if (!sameMembers(sourceSizes, card.sizes ?? [])) {
    errors.push(`Card sizes drift: source=[${sourceSizes.join(", ")}], manifest=[${(card.sizes ?? []).join(", ")}]`)
  }

  assertIncludes(cardSource, ["useRender", "render", "cardVariants"], "Card source governed API", errors)
  assertIncludes(cardDoc, [...(card.variants ?? []), ...(card.sizes ?? []), "render", "Skeleton", "Empty"], "Card doc capability contract", errors)
  assertIncludes(cardPageSource, [...(card.variants ?? []), ...(card.sizes ?? []), "interactive"], "Card Playground capability coverage", errors)
  assertIncludes(websiteCardSource, ['variant="elevated"'], "WebsiteCardContainer Card delegation", errors)

  for (const forbidden of ["elevated?: boolean", "data-elevated", "<Card elevated"]) {
    if (`${cardSource}\n${cardPageSource}\n${websiteCardSource}`.includes(forbidden)) {
      errors.push(`Card still exposes deprecated elevated boolean API: ${forbidden}`)
    }
  }
}

const avatar = (manifest.uiComponents ?? []).find((component) => component.name === "Avatar")
if (!avatar) {
  errors.push("Avatar must be present in components manifest")
} else {
  const [avatarSource, avatarDoc, avatarPageSource, playgroundManifestSource] = await Promise.all([
    readText(avatar.source),
    readText(avatar.doc),
    readText("src/pages/docs/components/avatar-page.tsx"),
    readText("docs/data/component-playgrounds.manifest.json"),
  ])

  assertIncludes(avatarSource, [
    ...avatar.sizes,
    "AvatarPrimitive.Fallback",
    "AvatarCompositeSize",
    "useRender",
    "avatarInitials",
  ], "Avatar governed source API", errors)
  assertIncludes(avatarDoc, [
    ...avatar.sizes,
    ...avatar.variants,
    "imageLoadingStatus",
    "onLoadingStatusChange",
    "delay",
    "AvatarGroupCount.render",
    "AvatarComposite.size",
    "default/lg/xl",
    "avatarInitials",
  ], "Avatar doc capability contract", errors)
  assertIncludes(avatarPageSource, [
    ...avatar.sizes,
    "onLoadingStatusChange",
    "delay",
    "AvatarGroupCount.render",
    "AvatarComposite.size",
    "avatarInitials",
  ], "Avatar page API coverage", errors)
  assertIncludes(playgroundManifestSource, [
    '"avatar"',
    '"storyPresentation": "examples"',
    '"single"',
    '"group"',
    '"composite"',
  ], "Avatar Playground structural examples", errors)

  if (avatarSource.includes("AvatarHasImageContext") || avatarSource.includes("hasAvatarImage")) {
    errors.push("AvatarFallback must delegate to Base UI instead of bypassing image loading context")
  }
  if (!/type AvatarCompositeSize = Extract<AvatarSize, "default" \| "lg" \| "xl">/.test(avatarSource)) {
    errors.push("AvatarComposite sizes must remain restricted to default/lg/xl")
  }
  if (await fileExists("src/components/fx/avatar-composite.tsx")) {
    errors.push("AvatarComposite must remain in src/components/ui/avatar.tsx as an approved base capability extension")
  }
}

const table = (manifest.uiComponents ?? []).find((component) => component.name === "Table")
if (!table) {
  errors.push("Table must be present in components manifest")
} else {
  const [tableSource, tableDoc, tablePageSource, tablePlaygroundSource, playgroundManifestSource] = await Promise.all([
    readText(table.source),
    readText(table.doc),
    readText("src/pages/docs/components/table-page.tsx"),
    readText("src/pages/docs/components/table-playground.tsx"),
    readText("docs/data/component-playgrounds.manifest.json"),
  ])
  const sourceVariants = extractVariantKeys(tableSource, "variant")

  if (!sameMembers(sourceVariants, table.variants ?? [])) {
    errors.push(`Table variants drift: source=[${sourceVariants.join(", ")}], manifest=[${(table.variants ?? []).join(", ")}]`)
  }

  assertIncludes(tableSource, table.sizes ?? [], "Table source densities", errors)
  assertIncludes(tableSource, table.rowVariants ?? [], "Table source row variants", errors)
  assertIncludes(tableDoc, [...(table.variants ?? []), ...(table.rowVariants ?? []), ...(table.sizes ?? []), "aria-sort", "Skeleton", "Pagination"], "Table doc capability contract", errors)
  assertIncludes(tablePageSource, [...(table.variants ?? []), ...(table.rowVariants ?? []), ...(table.sizes ?? [])], "Table page API coverage", errors)
  assertIncludes(tablePlaygroundSource, ["TableBusinessDemo", "TableLoadingDemo", "TableEmptyDemo", "components.table"], "Table Playground composition coverage", errors)
  assertIncludes(playgroundManifestSource, ['"table"', '"business"', '"summary"', '"loading"', '"empty"'], "Table Playground manifest stories", errors)

  for (const forbidden of ["bordered?: boolean", "bordered &&", "<Table bordered"]) {
    if (`${tableSource}\n${tablePageSource}\n${tablePlaygroundSource}`.includes(forbidden)) {
      errors.push(`Table still exposes deprecated bordered boolean API: ${forbidden}`)
    }
  }
}

const tabs = (manifest.uiComponents ?? []).find((component) => component.name === "Tabs")
if (!tabs) {
  errors.push("Tabs must be present in components manifest")
} else {
  const [tabsSource, tabsDoc, tabsPageSource, playgroundManifestSource] = await Promise.all([
    readText(tabs.source),
    readText(tabs.doc),
    readText("src/pages/docs/components/tabs-page.tsx"),
    readText("docs/data/component-playgrounds.manifest.json"),
  ])
  const sourceVariants = extractVariantKeys(tabsSource, "variant")
  const sourceSizes = extractVariantKeys(tabsSource, "size")

  if (!sameMembers(sourceVariants, tabs.variants ?? [])) {
    errors.push(`Tabs variants drift: source=[${sourceVariants.join(", ")}], manifest=[${(tabs.variants ?? []).join(", ")}]`)
  }
  if (!sameMembers(sourceSizes, tabs.sizes ?? [])) {
    errors.push(`Tabs sizes drift: source=[${sourceSizes.join(", ")}], manifest=[${(tabs.sizes ?? []).join(", ")}]`)
  }

  assertIncludes(tabsDoc, [...(tabs.variants ?? []), ...(tabs.sizes ?? []), "orientation", "activateOnFocus", "loopFocus", "disabled"], "Tabs doc capability contract", errors)
  assertIncludes(tabsPageSource, [...(tabs.variants ?? []), ...(tabs.sizes ?? []), "vertical", "activateOnFocus", "disabled"], "Tabs page scenario coverage", errors)
  assertIncludes(playgroundManifestSource, ['"tabs"', '"default"', '"line"', '"vertical"'], "Tabs Playground stories", errors)
}

for (const componentName of ["Dialog", "Sheet"]) {
  const component = (manifest.uiComponents ?? []).find((entry) => entry.name === componentName)
  if (!component) {
    errors.push(`${componentName} must be present in components manifest`)
    continue
  }

  const [source, doc, pageSource, playgroundManifestSource] = await Promise.all([
    readText(component.source),
    readText(component.doc),
    readText(`src/pages/docs/components/${componentName.toLowerCase()}-page.tsx`),
    readText("docs/data/component-playgrounds.manifest.json"),
  ])
  const sourceSizes = extractVariantKeys(source, "size")

  if (!sameMembers(sourceSizes, component.sizes ?? [])) {
    errors.push(`${componentName} sizes drift: source=[${sourceSizes.join(",")}], manifest=[${(component.sizes ?? []).join(",")}]`)
  }

  assertIncludes(doc, [...(component.sizes ?? []), "showCloseButton", "render"], `${componentName} doc capability contract`, errors)
  assertIncludes(pageSource, [...(component.sizes ?? []), "showCloseButton"], `${componentName} page API coverage`, errors)
  if (componentName === "Dialog") {
    assertIncludes(playgroundManifestSource, ['"dialog"', '"form"', '"confirm"', '"review"'], "Dialog Playground stories", errors)
  } else {
    assertIncludes(playgroundManifestSource, ['"sheet"', '"right-form"', '"right-detail"', '"bottom-actions"', '"side"'], "Sheet Playground stories", errors)
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

// Tag 标签（行内 pill：状态 variant + 分类 color），承接原 Badge 的 pill 职责
const tag = (manifest.uiComponents ?? []).find((component) => component.name === "Tag")
if (!tag) {
  errors.push("Tag must be present in components manifest")
} else {
  const [tagSource, tagDoc, tagPageSource] = await Promise.all([
    readText(tag.source),
    readText(tag.doc),
    readText("src/pages/docs/components/tag-page.tsx"),
  ])
  const sourceVariants = extractVariantKeys(tagSource, "variant")

  if (!sameMembers(sourceVariants, tag.variants ?? [])) {
    errors.push(`Tag variants drift: source=[${sourceVariants.join(", ")}], manifest=[${(tag.variants ?? []).join(", ")}]`)
  }

  assertIncludes(tagDoc, tag.variants ?? [], "Tag doc variants", errors)
  assertIncludes(tagPageSource, tag.variants ?? [], "Tag page variants", errors)
  assertIncludes(tagSource, ["useRender", "slot: \"tag\"", "render"], "Tag source Base UI render", errors)
}

// Badge 角标（dot/count），纯组件、无 variant
const badge = (manifest.uiComponents ?? []).find((component) => component.name === "Badge")
if (!badge) {
  errors.push("Badge must be present in components manifest")
} else {
  const badgeSource = await readText(badge.source)
  assertIncludes(badgeSource, ["data-slot=\"badge\"", "dot", "count"], "Badge 角标 source", errors)
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

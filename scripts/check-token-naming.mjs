#!/usr/bin/env node
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const contractPath = path.join(root, "docs/data/token-naming.manifest.json")
const componentsPath = path.join(root, "docs/data/components.manifest.json")
const primitiveSourcePath = path.join(root, "tokens/source/primitive.tokens.json")
const foundationContractPath = path.join(root, "docs/data/fds-foundation.manifest.json")
const semanticContractPath = path.join(root, "docs/data/fds-semantic.manifest.json")
const componentContractPath = path.join(root, "docs/data/fds-components.manifest.json")
const frameworkAdaptersPath = path.join(root, "docs/data/framework-adapters.manifest.json")
const migrationAuditPath = path.join(root, "docs/data/fds-migration-audit.manifest.json")
const themePresetPath = path.join(root, "docs/data/theme-presets.manifest.json")
const themeAuditPath = path.join(root, "docs/data/theme-audit.manifest.json")
const publicThemeContractPath = path.join(root, "registry/fx-theme.contract.json")
const semanticRuntimePath = path.join(root, "theme/fds-semantic.css")
const avatarSourcePath = path.join(root, "src/components/ui/avatar.tsx")
const errors = []

const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8")
const normalizeComponentId = (value) => value.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()
const markdownHasAnchor = (file, anchor) => [...read(file).matchAll(/^#{1,6}\s+(.+)$/gm)]
  .some((match) => {
    const explicit = match[1].match(/\{#([^}]+)\}\s*$/)?.[1]
    if (explicit === anchor) return true
    const generated = match[1]
      .replace(/\{#[^}]+\}\s*$/, "")
      .replace(/`/g, "")
      .trim()
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
    return generated === anchor
  })
const contract = JSON.parse(fs.readFileSync(contractPath, "utf8"))
const components = JSON.parse(fs.readFileSync(componentsPath, "utf8"))
const componentIds = new Set(
  [...(components.uiComponents ?? []), ...(components.fxComponents ?? [])]
    .map((component) => component.name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase())
)

const requiredLayers = ["primitive", "map", "semantic", "component"]
const layerIds = (contract.layers ?? []).map((layer) => layer.id)
if (JSON.stringify(layerIds) !== JSON.stringify(requiredLayers)) {
  errors.push(`layers 必须严格按 ${requiredLayers.join(" -> ")} 排列`)
}
for (const [index, layer] of (contract.layers ?? []).entries()) {
  if (layer.order !== index + 1) errors.push(`${layer.id}.order 应为 ${index + 1}`)
  const allowed = new Set(requiredLayers.slice(0, index))
  for (const reference of layer.allowedReferences ?? []) {
    if (!allowed.has(reference)) errors.push(`${layer.id} 反向或跨越引用非法层 ${reference}`)
  }
}
if (contract.layers?.find((layer) => layer.id === "map")?.authoring !== "generated-only") {
  errors.push("Map 层必须是 generated-only")
}

if (contract.format !== "fds/token-naming-contract" || contract.schemaVersion !== 1) {
  errors.push("Token Naming contract format/schemaVersion 不正确")
}
if (contract.truthSource !== "docs/data/token-naming.manifest.json") {
  errors.push("Token Naming contract 必须自声明唯一 truthSource")
}
if (contract.brand?.displayName !== "FDS" || contract.brand?.globalPrefix !== "--fds-g-" || contract.brand?.componentPrefix !== "--fds-c-") {
  errors.push("FDS 名称或 Global/Component 前缀漂移")
}

const expectedGrammarIds = [
  "primitive-color-seed",
  "primitive-dimension-seed",
  "primitive-scale",
  "color-map",
  "color-map-anchor",
  "dimension-map",
  "semantic-intent",
  "semantic-profile",
  "component-visual",
  "component-structural",
]
const grammarDefinitions = contract.grammar?.definitions ?? []
const grammarIds = grammarDefinitions.map((definition) => definition.id)
if (JSON.stringify(grammarIds) !== JSON.stringify(expectedGrammarIds)) {
  errors.push(`命名子语法必须严格按 ${expectedGrammarIds.join(" -> ")} 登记`)
}

const externalFieldSources = new Set([
  "category-specific-primitive-property",
  "primitive-source-range-id",
  "docs/data/components.manifest.json#canonical-id",
  "component-source-public-variant",
])
const resolveContractPath = (source) => source.split(".").reduce((value, key) => value?.[key], contract)
const displayedGrammar = new Set([
  ...Object.values(contract.grammar?.global ?? {}),
  ...Object.values(contract.grammar?.component ?? {}),
])
for (const definition of grammarDefinitions) {
  if (!requiredLayers.includes(definition.layer)) errors.push(`${definition.id} 使用未知层级 ${definition.layer}`)
  const expectedNamespace = definition.layer === "component" ? "component" : "global"
  if (definition.namespace !== expectedNamespace) errors.push(`${definition.id} namespace 应为 ${expectedNamespace}`)
  if (!displayedGrammar.has(definition.template)) errors.push(`${definition.id} template 未进入网页展示 grammar`)

  const placeholders = [...(definition.template ?? "").matchAll(/\{([a-z][a-z0-9-]*)(\?)?\}/g)]
    .map((match) => ({ name: match[1], required: !match[2] }))
  const placeholderNames = placeholders.map((placeholder) => placeholder.name)
  if (JSON.stringify(definition.fieldOrder) !== JSON.stringify(placeholderNames)) {
    errors.push(`${definition.id} fieldOrder 与 template 占位符顺序不一致`)
  }
  const fields = definition.fields ?? []
  if (new Set(fields.map((field) => field.name)).size !== fields.length || JSON.stringify(fields.map((field) => field.name)) !== JSON.stringify(placeholderNames)) {
    errors.push(`${definition.id} fields 必须与 template 占位符一一对应且顺序一致`)
  }
  for (const placeholder of placeholders) {
    const field = fields.find((candidate) => candidate.name === placeholder.name)
    if (field?.required !== placeholder.required) errors.push(`${definition.id}.${placeholder.name} required 与 ? 标记不一致`)
  }
  for (const field of fields) {
    if (!field.source) {
      errors.push(`${definition.id}.${field.name} 缺少词典或权威来源`)
    } else if (!externalFieldSources.has(field.source)) {
      const source = resolveContractPath(field.source)
      if (!Array.isArray(source) || source.length === 0) errors.push(`${definition.id}.${field.name} 来源无效：${field.source}`)
    }
  }
  if (!placeholderNames.includes(definition.terminalField)) errors.push(`${definition.id} terminalField 未出现在字段中`)
}

for (const [dictionary, values] of Object.entries(contract.dictionaries ?? {})) {
  if (!Array.isArray(values) || values.length === 0) errors.push(`词典 ${dictionary} 不能为空`)
  else if (new Set(values).size !== values.length) errors.push(`词典 ${dictionary} 存在重复项`)
}

const categories = new Set(contract.dictionaries?.categories ?? [])
const states = new Set(contract.dictionaries?.states ?? [])
const sizes = new Set(contract.dictionaries?.sizes ?? [])
const families = new Set(contract.dictionaries?.colorFamilies ?? [])
const colorMapScales = new Set(contract.dictionaries?.colorMapScales ?? [])
if (JSON.stringify([...colorMapScales]) !== JSON.stringify(["base", "dark"])) {
  errors.push("Color Map scale 必须严格为 base / dark；实心交互只能映射 Base 90/80/100/50")
}
const colorMapAnchors = new Set(contract.dictionaries?.colorMapAnchors ?? [])
const dimensionSeedCategories = new Set(contract.dictionaries?.dimensionSeedCategories ?? [])
const dimensionSeedRoles = new Set(contract.dictionaries?.dimensionSeedRoles ?? [])
const visualCategories = new Set(contract.dictionaries?.visualCategories ?? [])
const structuralCategories = new Set(contract.dictionaries?.structuralCategories ?? [])
const semanticWords = new Set([
  ...(contract.dictionaries?.colorProperties ?? []),
  ...(contract.dictionaries?.intentRoles ?? []),
  ...(contract.dictionaries?.semanticModifiers ?? []),
  ...(contract.dictionaries?.semanticProfileRoles ?? []),
  ...(contract.dictionaries?.states ?? []),
])
const forbiddenAbbreviations = new Set(contract.dictionaries?.forbiddenAbbreviations ?? [])
const forbiddenImplementationTerms = new Set(contract.dictionaries?.forbiddenImplementationTerms ?? [])
const mapRanges = new Set((contract.ranges?.colorMap ?? []).map(String))
const radiusMapRanges = new Set((contract.ranges?.radiusMap ?? []).map(String))
const grammarByLayer = new Map(requiredLayers.map((layer) => [layer, grammarDefinitions.filter((definition) => definition.layer === layer)]))
const orderedComponentIds = [...componentIds].sort((a, b) => b.length - a.length)
const orderedCategories = [...categories].sort((a, b) => b.length - a.length)

function resolveLeadingCategory(body) {
  return orderedCategories.find((category) => body === category || body.startsWith(`${category}-`))
}

function resolveEmbeddedCategory(body) {
  return orderedCategories.find((category) => body === category || body.startsWith(`${category}-`) || body.includes(`-${category}-`))
}

function resolveComponentName(name) {
  const body = name.startsWith(contract.brand.componentPrefix)
    ? name.slice(contract.brand.componentPrefix.length)
    : ""
  const component = orderedComponentIds.find((candidate) => body === candidate || body.startsWith(`${candidate}-`))
  return component ? { component, remainder: body.slice(component.length + 1) } : null
}

function syntaxMatches(name, definition) {
  if (definition.id === "primitive-color-seed") {
    const family = name.slice("--fds-g-color-seed-".length)
    return name.startsWith("--fds-g-color-seed-") && families.has(family)
  }
  if (definition.id === "primitive-dimension-seed") {
    const match = name.match(/^--fds-g-([a-z0-9-]+)-seed-([a-z0-9-]+)$/)
    return Boolean(match && dimensionSeedCategories.has(match[1]) && dimensionSeedRoles.has(match[2]))
  }
  if (definition.id === "primitive-scale") {
    const body = name.slice(contract.brand.globalPrefix.length)
    const category = resolveLeadingCategory(body)
    return Boolean(category && category !== "color" && !body.includes("-seed-") && body.length > category.length + 1)
  }
  if (definition.id === "color-map") {
    const match = name.match(/^--fds-g-color-(.+)-(base|dark)-(\d+)$/)
    return Boolean(match && families.has(match[1]) && colorMapScales.has(match[2]) && mapRanges.has(match[3]))
  }
  if (definition.id === "color-map-anchor") {
    return [...colorMapAnchors].some((anchor) => name === `--fds-g-color-${anchor}`)
  }
  if (definition.id === "dimension-map") {
    const match = name.match(/^--fds-g-([a-z0-9-]+)-(\d+)$/)
    return Boolean(match && dimensionSeedCategories.has(match[1]) && radiusMapRanges.has(match[2]))
  }
  if (definition.id === "semantic-intent") {
    const category = resolveLeadingCategory(name.slice(contract.brand.globalPrefix.length))
    return ["color", "blur", "shadow"].includes(category)
  }
  if (definition.id === "semantic-profile") {
    const category = resolveLeadingCategory(name.slice(contract.brand.globalPrefix.length))
    return ["font", "sizing", "spacing", "motion"].includes(category)
  }
  const resolved = resolveComponentName(name)
  if (!resolved) return false
  const category = resolveEmbeddedCategory(resolved.remainder)
  if (definition.id === "component-visual") return visualCategories.has(category)
  if (definition.id === "component-structural") return structuralCategories.has(category)
  return false
}

function validateName(name, layer) {
  const failures = []
  if (!/^--fds-[gc]-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) failures.push("必须是 FDS lower-kebab CSS variable")
  const prefix = layer === "component" ? contract.brand.componentPrefix : contract.brand.globalPrefix
  if (!name.startsWith(prefix)) failures.push(`${layer} 必须使用 ${prefix}`)
  const segments = name.slice(prefix.length).split("-")
  for (const segment of segments) {
    if (forbiddenAbbreviations.has(segment)) failures.push(`含禁用缩写 ${segment}`)
    if (forbiddenImplementationTerms.has(segment)) failures.push(`含实现词 ${segment}`)
  }

  const matchedSyntaxes = (grammarByLayer.get(layer) ?? []).filter((definition) => syntaxMatches(name, definition))
  if (matchedSyntaxes.length !== 1) {
    failures.push(matchedSyntaxes.length === 0 ? "未命中任何受控子语法" : `同时命中多个子语法：${matchedSyntaxes.map((definition) => definition.id).join(", ")}`)
  }

  if (layer === "component") {
    const resolved = resolveComponentName(name)
    if (!resolved) failures.push(`组件 canonical ID 不存在：${segments[0]}`)
    const componentSegments = resolved?.remainder.split("-") ?? []
    if (componentSegments[0] === "default") failures.push("默认 variant 必须省略")
    if (![...categories].some((category) => name.includes(`-${category}-`))) failures.push("组件 Hook 缺少合法 category")
    const body = name.slice(prefix.length)
    const matchedStates = [...states].filter((state) => body.includes(`-${state}-`) || body.endsWith(`-${state}`))
    if (matchedStates.some((state) => !body.endsWith(`-${state}`))) failures.push("Visual Hook 的 state 必须位于末尾")
    const hasState = matchedStates.length > 0
    const hasTerminalSize = sizes.has(segments.at(-1))
    if (hasState && hasTerminalSize) failures.push("同一 Hook 不得同时携带 state 和 size")
  } else {
    if (![...categories].some((category) => name.startsWith(`${prefix}${category}-`))) failures.push(`Global Hook 缺少合法 category：${segments[0]}`)
    if (segments.some((segment) => componentIds.has(segment) && !semanticWords.has(segment))) failures.push("Global Hook 混入组件名称")
    const body = name.slice(prefix.length)
    const matchedStates = [...states].filter((state) => body.includes(`-${state}-`) || body.endsWith(`-${state}`))
    if (matchedStates.some((state) => !body.endsWith(`-${state}`))) failures.push("Global Hook 的 state 必须位于末尾")
  }

  if (layer === "map") {
    const match = name.match(/^--fds-g-color-(.+)-(base|dark)-(\d+)$/)
    const isAnchor = [...colorMapAnchors].some((anchor) => name === `--fds-g-color-${anchor}`)
    const dimensionMatch = name.match(/^--fds-g-([a-z0-9-]+)-(\d+)$/)
    const isDimensionMap = Boolean(dimensionMatch && dimensionSeedCategories.has(dimensionMatch[1]) && radiusMapRanges.has(dimensionMatch[2]))
    if (!match && !isAnchor && !isDimensionMap) failures.push("Map 必须是受控颜色阶、生成 anchor 或已登记的维度刻度")
    else if (match) {
      if (!families.has(match[1])) failures.push(`Color Map family 未登记：${match[1]}`)
      if (!colorMapScales.has(match[2])) failures.push(`Color Map scale 未登记：${match[2]}`)
      if (!mapRanges.has(match[3])) failures.push(`Color Map range 未登记：${match[3]}`)
    }
  }
  if (layer === "primitive" && name.startsWith("--fds-g-color-seed-")) {
    const family = name.slice("--fds-g-color-seed-".length)
    if (!families.has(family)) failures.push(`Seed family 未登记：${family}`)
  }
  if (layer === "primitive" && name.includes("-seed-") && !name.startsWith("--fds-g-color-seed-")) {
    const match = name.match(/^--fds-g-([a-z0-9-]+)-seed-([a-z0-9-]+)$/)
    if (!match || !dimensionSeedCategories.has(match[1]) || !dimensionSeedRoles.has(match[2])) failures.push("Dimension Seed category/role 未登记")
  }
  return failures
}

for (const example of contract.examples?.valid ?? []) {
  const failures = validateName(example.name, example.layer)
  if (failures.length) errors.push(`合法示例 ${example.name} 无法通过合同：${failures.join("；")}`)
}
for (const example of contract.examples?.invalid ?? []) {
  const inferredLayer = example.layer ?? (example.name.startsWith(contract.brand.componentPrefix) ? "component" :
    example.name.includes("-base-") ? "map" : "primitive"
  )
  if (validateName(example.name, inferredLayer).length === 0) {
    errors.push(`错误示例 ${example.name} 未被命名合同拒绝`)
  }
}

for (const component of contract.componentAdmission?.pilotComponents ?? []) {
  if (!componentIds.has(component)) errors.push(`组件 Hook 试点不存在于 components manifest：${component}`)
}

if (!fs.existsSync(primitiveSourcePath) || !fs.existsSync(foundationContractPath)) {
  errors.push("FDS Primitive source 或 Foundation portable contract 缺失")
} else {
  const primitiveSource = JSON.parse(fs.readFileSync(primitiveSourcePath, "utf8"))
  const foundationContract = JSON.parse(fs.readFileSync(foundationContractPath, "utf8"))
  if (primitiveSource.$extensions?.fds?.format !== "fds/dtcg-primitive-tokens") errors.push("Primitive source 不是 FDS DTCG 格式")
  if (foundationContract.format !== "fds/foundation-contract") errors.push("Foundation portable contract format 不正确")
  const expectedCounts = { primitive: 143, map: 425, total: 568 }
  for (const [key, value] of Object.entries(expectedCounts)) {
    if (foundationContract.counts?.[key] !== value) errors.push(`Foundation ${key} 数量应为 ${value}`)
  }
  const names = new Set()
  const legacyNames = new Set()
  for (const token of foundationContract.tokens ?? []) {
    if (names.has(token.name)) errors.push(`Foundation 重复 FDS 名称：${token.name}`)
    if (token.legacyName && legacyNames.has(token.legacyName)) errors.push(`Foundation 重复 legacy 名称：${token.legacyName}`)
    names.add(token.name)
    if (token.legacyName) legacyNames.add(token.legacyName)
    const failures = validateName(token.name, token.layer)
    if (failures.length) errors.push(`Foundation ${token.name} 命名非法：${failures.join("；")}`)
    if (token.legacyName && !token.legacyName.startsWith("--fx-")) errors.push(`${token.name} 的迁移期映射必须使用 --fx-*`)
    if (!token.legacyName && !(token.profile === "dark" && /--fds-g-color-[a-z0-9-]+-dark-\d+$/.test(token.name))) {
      errors.push(`${token.name} 缺少迁移期 --fx-* 映射，且不是新增的 FDS-only Dark Map`)
    }
  }
}
if (!fs.existsSync(semanticContractPath)) {
  errors.push("FDS Semantic portable contract 缺失")
} else {
  const semanticContract = JSON.parse(fs.readFileSync(semanticContractPath, "utf8"))
  if (semanticContract.format !== "fds/semantic-contract") errors.push("Semantic portable contract format 不正确")
  const semanticByName = new Map((semanticContract.tokens ?? []).map((token) => [token.name, token]))
  for (const token of semanticContract.tokens ?? []) {
    const failures = validateName(token.name, "semantic")
    if (failures.length) errors.push(`Semantic ${token.name} 命名非法：${failures.join("；")}`)
  }
  const themePreset = JSON.parse(fs.readFileSync(themePresetPath, "utf8"))
  const themeAudit = JSON.parse(fs.readFileSync(themeAuditPath, "utf8"))
  const publicThemeContract = JSON.parse(fs.readFileSync(publicThemeContractPath, "utf8"))
  const semanticRuntime = fs.readFileSync(semanticRuntimePath, "utf8")
  const auditedGlobalNames = new Set(themeAudit.coverage?.stableEligibleHooks ?? [])
  const publishedHookNames = new Set(publicThemeContract.stylingHooks?.hooks?.map((hook) => hook.name) ?? [])
  const primaryForegroundName = "--fds-g-color-foreground-primary"
  for (const token of semanticContract.tokens ?? []) {
    if (token.stability !== "stable") continue
    if (token.visibility !== "public-global") errors.push(`${token.name} stable Global Hook 必须是 public-global`)
    if (!semanticContract.owner) errors.push(`${token.name} stable Global Hook 缺少 Semantic owner`)
    if (!semanticRuntime.includes(`${token.name}:`)) errors.push(`${token.name} stable Global Hook 缺少生成 runtime`)
    if (token.derivation === "alias-primary-foreground") {
      if (token.value !== `var(${primaryForegroundName})`) {
        errors.push(`${token.name} 必须直接引用 ${primaryForegroundName}`)
      }
      if (!auditedGlobalNames.has(primaryForegroundName)) {
        errors.push(`${token.name} 继承的 ${primaryForegroundName} 未进入 Theme audit 的实际合格 Hook 清单`)
      }
    } else if (!auditedGlobalNames.has(token.name)) {
      errors.push(`${token.name} stable Global Hook 未进入 Theme audit 的实际合格 Hook 清单`)
    }
    if (themeAudit.summary?.status !== "ready") errors.push(`${token.name} stable Global Hook 缺少 ready Theme audit`)
    if (!publishedHookNames.has(token.name)) errors.push(`${token.name} stable Global Hook 未进入公开 Theme contract`)
  }
  const profileOutputs = new Set([
    ...Object.values(themePreset.profiles?.textScale ?? {}).flatMap((profile) => Object.keys(profile)),
    ...Object.values(themePreset.dimensions ?? {}).map((dimension) => dimension.output).filter(Boolean),
  ])
  for (const output of profileOutputs) {
    const token = semanticByName.get(output)
    if (!token) {
      errors.push(`Theme profile 输出未登记 Semantic Token：${output}`)
      continue
    }
    if (token.visibility !== "internal") errors.push(`Theme profile 输出必须是 internal Semantic：${output}`)
    if (states.has(output.split("-").at(-1))) errors.push(`Theme profile 输出不得伪装为交互状态：${output}`)
  }
  if (profileOutputs.size !== 41) errors.push(`Theme profile Semantic 输出应为 41 个，实际 ${profileOutputs.size}`)
  for (const output of ["--fds-g-color-surface-subtle", "--fds-g-color-text-subtle"]) {
    const token = semanticByName.get(output)
    if (!token) errors.push(`运行时用途未登记 internal Semantic：${output}`)
    else if (token.visibility !== "internal") errors.push(`迁移期运行时用途必须保持 internal：${output}`)
  }
}
if (!fs.existsSync(componentContractPath)) {
  errors.push("FDS Component portable contract 缺失")
} else {
  const componentContract = JSON.parse(fs.readFileSync(componentContractPath, "utf8"))
  const frameworkAdapters = JSON.parse(fs.readFileSync(frameworkAdaptersPath, "utf8"))
  const readyMappings = frameworkAdapters.adapters
    .filter((adapter) => adapter.status === "ready")
    .flatMap((adapter) => adapter.componentMappings ?? [])
  if (componentContract.format !== "fds/component-contract") errors.push("Component portable contract format 不正确")
  const admissions = new Map((componentContract.admissions ?? []).map((admission) => [admission.component, admission]))
  const requiredEvidence = contract.componentAdmission?.requiredEvidence ?? []
  for (const token of componentContract.tokens ?? []) {
    const failures = validateName(token.name, "component")
    if (failures.length) errors.push(`Component ${token.name} 命名非法：${failures.join("；")}`)
    if (token.visibility !== "public-component") errors.push(`${token.name} 必须声明 public-component`)
    const admission = admissions.get(token.component)
    if (!admission) errors.push(`${token.name} 缺少组件准入记录`)
    for (const evidence of requiredEvidence) {
      const sourceKey = evidence.replaceAll("-", "").replace(/^./, (letter) => letter.toLowerCase())
      const aliases = {
        independentthemingneed: "independentThemingNeed",
        semanticgap: "semanticGap",
        crosscontextreuse: "crossContextReuse",
        contracttest: "contractTest",
        visualtest: "visualTest",
      }
      const key = aliases[sourceKey] ?? evidence
      if (!admission?.[key] || (Array.isArray(admission[key]) && admission[key].length === 0)) {
        errors.push(`${token.component} 准入缺少 ${evidence}`)
      }
    }
    if (token.stability === "stable" && admission) {
      const [documentationFile, documentationAnchor] = admission.documentation.split("#")
      if (!documentationFile || !documentationAnchor || !fs.existsSync(path.join(root, documentationFile)) || !markdownHasAnchor(documentationFile, documentationAnchor)) {
        errors.push(`${token.name} stable 准入的 documentation target 无效`)
      }
      if (!admission.contractTest || !fs.existsSync(path.join(root, admission.contractTest))) {
        errors.push(`${token.name} stable 准入的 contract test target 无效`)
      }
      const [visualFile, visualNeedle] = admission.visualTest.split("#")
      if (!visualFile || !visualNeedle || !fs.existsSync(path.join(root, visualFile)) || !read(visualFile).includes(visualNeedle)) {
        errors.push(`${token.name} stable 准入的 visual test target 无效`)
      }
      const readyMapping = readyMappings.find((mapping) => normalizeComponentId(mapping.canonicalId) === token.component && (mapping.stylingHooks ?? []).includes(token.name))
      if (!readyMapping) {
        errors.push(`${token.name} stable 准入缺少 ready reference adapter binding`)
      } else if (!fs.existsSync(path.join(root, readyMapping.source)) || !read(readyMapping.source).includes(token.name)) {
        errors.push(`${token.name} stable 准入缺少 reference adapter runtime consumer`)
      }
    }
  }
}
if (contract.publication?.instanceOverride !== "forbidden") errors.push("单实例 Styling Hook 覆盖必须保持 forbidden")
const publishedSemanticTokens = fs.existsSync(semanticContractPath)
  ? JSON.parse(fs.readFileSync(semanticContractPath, "utf8")).tokens.filter((token) => token.visibility === "public-global")
  : []
const publishedComponentTokens = fs.existsSync(componentContractPath)
  ? JSON.parse(fs.readFileSync(componentContractPath, "utf8")).tokens.filter((token) => token.visibility === "public-component")
  : []
const expectedPublicStatus = [...publishedSemanticTokens, ...publishedComponentTokens].some((token) => token.stability === "experimental")
  ? "experimental"
  : "stable"
if (contract.publication?.contractStatus !== expectedPublicStatus) {
  errors.push(`Public Styling Hook 合同状态应为 ${expectedPublicStatus}`)
}
if (contract.publication?.publicContractArtifact !== "registry/fx-theme.contract.json#stylingHooks") errors.push("公开 Styling Hook 合同必须绑定统一主题 contract")
const stableEvidence = new Set(contract.componentAdmission?.stableRequiredEvidence ?? [])
for (const evidence of ["documentation-target", "contract-test-target", "visual-test-target", "ready-reference-adapter-binding", "runtime-consumer"]) {
  if (!stableEvidence.has(evidence)) errors.push(`Component Hook stable 准入缺少机器门：${evidence}`)
}
const globalStableEvidence = new Set(contract.globalStability?.stableRequiredEvidence ?? [])
for (const evidence of ["public-global-visibility", "semantic-owner", "generated-runtime", "fds-primary-theme-audit", "published-contract"]) {
  if (!globalStableEvidence.has(evidence)) errors.push(`Global Hook stable 准入缺少机器门：${evidence}`)
}
if (contract.globalStability?.auditContract !== "docs/data/theme-presets.manifest.json#qualityGates" || contract.globalStability?.auditEvidence !== "docs/data/theme-audit.manifest.json") {
  errors.push("Global Hook stable 审计合同或证据路径漂移")
}
if (contract.publication?.stablePromotionRequirement !== "all-published-hooks-reviewed-and-no-experimental-hooks") errors.push("公开 Styling Hook stable 晋级门漂移")
if (!(contract.enforcement?.activeScopes ?? []).includes("public-release") || (contract.enforcement?.futureScopes ?? []).includes("public-release")) {
  errors.push("Public Styling Hook release 必须进入当前机器检查范围")
}
if (!(contract.migration?.phases ?? []).includes(contract.migration?.phase)) {
  errors.push(`Semantic 迁移阶段未登记：${contract.migration?.phase}`)
}
if (contract.migration?.aliasPolicy !== "generated-reference-only-no-duplicated-physical-values") {
  errors.push("--fx-* 兼容别名必须只生成引用，不得复制物理值")
}
if (contract.migration?.aliasIntroducedVersion !== "1.3.0" || contract.migration?.earliestRemovalVersion !== "2.0.0") {
  errors.push("--fx-* 兼容窗口必须记录引入版本与最早 Major 删除版本")
}
if (contract.migration?.readinessAudit !== "docs/data/fds-migration-audit.manifest.json") {
  errors.push("FDS 前缀迁移必须绑定唯一的就绪审计产物")
}
const dispositions = contract.migration?.legacyDispositions ?? []
if (dispositions.length < 4 || new Set(dispositions.map((item) => item.id)).size !== dispositions.length) {
  errors.push("旧变量去向必须登记唯一、完整的 legacyDispositions")
}
for (const disposition of dispositions) {
  if (!disposition.selectors?.length || !disposition.consumerPrefixes?.length || !disposition.classification || !disposition.targetLayer || !disposition.nextStep) {
    errors.push(`旧变量去向 ${disposition.id} 缺少 selector / consumer / classification / targetLayer / nextStep`)
  }
  if (disposition.targetLayer === "component" && disposition.nextStep !== "component-owner-must-review-semantic-gap-and-hook-admission") {
    errors.push(`组件候选 ${disposition.id} 不得绕过 Hook 准入`)
  }
}

const avatarSource = fs.readFileSync(avatarSourcePath, "utf8")
const avatarMapTokens = ["brand", "green", "amber", "red", "blue", "purple"]
  .map((family) => `--fds-g-color-${family}-base-80`)
for (const token of avatarMapTokens) {
  if (!avatarSource.includes(token)) errors.push(`Avatar 静态分类色查表缺少 ${token}`)
}
if (!avatarSource.includes("--fds-g-color-text-inverse")) {
  errors.push("Avatar 彩色 fallback 必须使用 text.inverse Semantic 前景")
}
if (/--fx-\$\{|--fds-[gc]-\$\{/.test(avatarSource)) {
  errors.push("Avatar 不得动态拼接 legacy 或 FDS Token 名称")
}

const requiredReferences = {
  "docs/MAP.md": ["FDS Token 命名合同", "check:token-naming"],
  "docs/DOCUMENTATION.md": ["docs/TOKEN_NAMING.md"],
  "docs/TOKENS.md": ["docs/TOKEN_NAMING.md"],
  "docs/DECISIONS.md": ["FDS", "--fds-g-*", "--fds-c-*"],
  "AGENTS.md": ["docs/TOKEN_NAMING.md"],
}
for (const [file, needles] of Object.entries(requiredReferences)) {
  const content = read(file)
  for (const needle of needles) {
    if (!content.includes(needle)) errors.push(`${file} 缺少命名合同引用：${needle}`)
  }
}

if (["dual-write", "fds-primary"].includes(contract.migration?.phase)) {
  const foundationCss = read("theme/foundation.css")
  const semanticCss = read("theme/fds-semantic.css")
  const componentCss = read("theme/fds-components.css")
  if (!foundationCss.includes("--fds-g-color-seed-brand:")) errors.push("Foundation runtime 缺少 FDS truth")
  if (!foundationCss.includes("--fx-brand: var(--fds-g-color-seed-brand);")) errors.push("Foundation runtime 缺少 --fx-* 兼容别名")
  if (!semanticCss.includes("--fds-g-color-surface-page:")) errors.push("Semantic runtime 缺少 FDS truth")
  if (!semanticCss.includes("--background: var(--fds-g-color-surface-page);")) errors.push("Semantic runtime 缺少 shadcn 兼容别名")
  if (!componentCss.includes("--fds-c-button-color-background:")) errors.push("Component runtime 缺少已准入 Hook")
}
if (contract.migration?.phase === "fds-primary") {
  if (!fs.existsSync(migrationAuditPath)) errors.push("fds-primary 缺少迁移就绪审计")
  else {
    const audit = JSON.parse(fs.readFileSync(migrationAuditPath, "utf8"))
    if (audit.currentPhase !== "fds-primary" || audit.gates?.currentPhase?.status !== "ready") {
      errors.push("fds-primary 必须由当前阶段审计证明 ready；请重建迁移审计")
    }
    const publicAssembly = audit.scopes?.find((scope) => scope.id === "public-assembly")
    if (audit.summary?.runtimeLegacyOccurrences !== 0 || publicAssembly?.occurrences !== 0) {
      errors.push("fds-primary 要求 runtime source 与公开装配入口均不再消费 --fx-*")
    }
  }
}

if (errors.length) {
  console.error(`Token naming contract 发现 ${errors.length} 处问题：`)
  for (const error of errors) console.error(`ERROR: ${error}`)
  process.exit(1)
}

console.log(`token naming contract check passed: ${contract.layers.length} layers, ${contract.examples.valid.length} valid examples, migration=${contract.migration.phase}`)

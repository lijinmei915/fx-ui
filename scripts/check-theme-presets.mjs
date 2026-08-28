#!/usr/bin/env node
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const manifestPath = path.join(root, "docs/data/theme-presets.manifest.json")
const foundationPath = path.join(root, "theme/foundation.css")
const foundationContractPath = path.join(root, "docs/data/fds-foundation.manifest.json")
const semanticPath = path.join(root, "theme/fds-semantic.css")
const semanticContractPath = path.join(root, "docs/data/fds-semantic.manifest.json")
const entryPath = path.join(root, "theme/fx-theme.css")
const runtimePath = path.join(root, "src/lib/theme-runtime.ts")
const derivationPath = path.join(root, "src/lib/theme-derivation.ts")
const frameworkAdaptersPath = path.join(root, "docs/data/framework-adapters.manifest.json")
const errors = []
const json = process.argv.includes("--json")

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"))
const foundation = fs.readFileSync(foundationPath, "utf8")
const foundationContract = JSON.parse(fs.readFileSync(foundationContractPath, "utf8"))
const semantic = `${fs.readFileSync(semanticPath, "utf8")}\n${fs.readFileSync(entryPath, "utf8")}`
const semanticContract = JSON.parse(fs.readFileSync(semanticContractPath, "utf8"))
const runtime = fs.readFileSync(runtimePath, "utf8")
const derivation = fs.readFileSync(derivationPath, "utf8")
const frameworkAdapters = JSON.parse(fs.readFileSync(frameworkAdaptersPath, "utf8"))
const foundationNames = new Set((foundationContract.tokens ?? []).map((token) => token.name))
const semanticTokenByName = new Map((semanticContract.tokens ?? []).map((token) => [token.name, token]))

if (manifest.format !== "fx-ui/theme-preset-contract" || manifest.schemaVersion !== 1) {
  errors.push("Theme Preset contract format/schemaVersion 不正确")
}
if (manifest.truthSource !== "docs/data/theme-presets.manifest.json") {
  errors.push("Theme Preset contract 必须自声明唯一 truthSource")
}

const previewModes = new Set(manifest.publication?.runtimePreviewModes ?? [])
for (const mode of manifest.publication?.publishedModes ?? []) {
  if (!previewModes.has(mode)) errors.push(`发布模式 ${mode} 未包含在 runtimePreviewModes`)
}

const qualityGates = manifest.qualityGates
const semanticVariables = new Set([...semantic.matchAll(/^\s*(--[\w-]+):/gm)].map((match) => match[1]))
const publicGlobalNames = new Set(semanticContract.tokens.filter((token) => token.visibility === "public-global").map((token) => token.name))
if (qualityGates?.colorResolution !== "chromium-computed-style" || qualityGates?.contrastMethod !== "wcag2-relative-luminance") {
  errors.push("Theme qualityGates 必须声明真实浏览器颜色解析与 WCAG2 对比度算法")
}
if (qualityGates?.normalTextMinimum !== 4.5 || qualityGates?.nonTextMinimum !== 3 || qualityGates?.stateDeltaEOklabMinimum !== 0.015 || qualityGates?.disabledStateDeltaEOklabMinimum !== 0.03 || qualityGates?.disabledAdjacentContrastMinimum !== 1.5) {
  errors.push("Theme qualityGates 阈值漂移；不得通过降低阈值隐藏可访问性问题")
}
const solidForeground = qualityGates?.solidForeground
const requiredSolidForegroundIds = ["primary"]
if (solidForeground?.strategy !== "prefer-light-for-entire-state-group-with-dark-fallback" || solidForeground?.minimumContrast !== 2) {
  errors.push("实心色前景必须使用整组三态优先浅色、2.0:1 保护线与深色回退策略")
}
if (!foundationNames.has(solidForeground?.preferred) || !foundationNames.has(solidForeground?.fallback)) {
  errors.push("实心色前景的 preferred/fallback 必须直接引用 Foundation token")
}
const solidForegroundIds = (solidForeground?.groups ?? []).map((group) => group.id)
if (JSON.stringify(solidForegroundIds) !== JSON.stringify(requiredSolidForegroundIds)) {
  errors.push("实心色前景解析器只允许登记 Primary；其余实心角色必须跟随 Primary 前景")
}
const solidForegroundHooks = []
for (const group of solidForeground?.groups ?? []) {
  solidForegroundHooks.push(group.foreground)
  if (group.policy && group.policy !== "auto-contrast") {
    errors.push(`实心色前景组 ${group.id} 不得声明未批准的固定前景策略`)
  }
  if (!publicGlobalNames.has(group.foreground)) {
    errors.push(`实心色前景组 ${group.id} 的输出必须是 public-global Semantic Hook`)
  }
  if ((group.backgrounds ?? []).length !== 3 || new Set(group.backgrounds).size !== 3) {
    errors.push(`实心色前景组 ${group.id} 必须登记唯一的 Default/Hover/Active 三态背景`)
  }
  for (const background of group.backgrounds ?? []) {
    if (!publicGlobalNames.has(background)) errors.push(`实心色前景组 ${group.id} 的背景必须是 public-global Semantic Hook: ${background}`)
  }
}
if (new Set(solidForegroundHooks).size !== requiredSolidForegroundIds.length) {
  errors.push("Theme Resolver 只能写入唯一的 Primary 实心前景 Semantic 输出")
}
for (const mode of qualityGates?.auditedModes ?? []) {
  if (!previewModes.has(mode)) errors.push(`审计模式 ${mode} 未包含在 runtimePreviewModes`)
}
for (const seed of qualityGates?.customSeedSamples ?? []) {
  if (!/^#[0-9A-F]{6}$/.test(seed)) errors.push(`自定义主题审计样本不是标准大写 hex6: ${seed}`)
}
for (const pair of qualityGates?.semanticPairs ?? []) {
  if (!semanticVariables.has(pair.background) || !semanticVariables.has(pair.foreground)) {
    errors.push(`Theme 对比度语义对 ${pair.id} 引用了不存在的变量`)
  }
  if (!publicGlobalNames.has(pair.background) || !publicGlobalNames.has(pair.foreground)) {
    errors.push(`Theme 对比度语义对 ${pair.id} 必须直接审计 public-global FDS Hooks`)
  }
}
for (const pair of qualityGates?.nonTextPairs ?? []) {
  if (!semanticVariables.has(pair.background) || !semanticVariables.has(pair.foreground)) {
    errors.push(`Theme 非文字强制对 ${pair.id} 引用了不存在的变量`)
  }
  if (!publicGlobalNames.has(pair.background) || !publicGlobalNames.has(pair.foreground)) {
    errors.push(`Theme 非文字强制对 ${pair.id} 必须直接审计 public-global FDS Hooks`)
  }
  if (pair.minimum !== qualityGates.nonTextMinimum || !pair.purpose) {
    errors.push(`Theme 非文字强制对 ${pair.id} 必须使用统一 3:1 门槛并声明用途`)
  }
}
for (const pair of qualityGates?.candidateNonTextPairs ?? []) {
  if (!semanticVariables.has(pair.background) || !semanticVariables.has(pair.foreground)) {
    errors.push(`Theme 非文字候选对 ${pair.id} 引用了不存在的变量`)
  }
  if (!publicGlobalNames.has(pair.background) || !publicGlobalNames.has(pair.foreground)) {
    errors.push(`Theme 非文字候选对 ${pair.id} 必须直接审计 public-global FDS Hooks`)
  }
  if (pair.minimum !== qualityGates.nonTextMinimum || !pair.purpose) {
    errors.push(`Theme 非文字候选对 ${pair.id} 必须使用统一 3:1 门槛并声明用途`)
  }
}
for (const group of qualityGates?.candidateTextStateGroups ?? []) {
  if (!semanticVariables.has(group.background) || (group.states ?? []).length < 2 || group.states.some((name) => !semanticVariables.has(name))) {
    errors.push(`Theme 文字状态候选组 ${group.id} 缺少背景/状态或引用了不存在的变量`)
  }
  if (!publicGlobalNames.has(group.background) || group.states.some((name) => !publicGlobalNames.has(name))) {
    errors.push(`Theme 文字状态候选组 ${group.id} 必须直接审计 public-global FDS Hooks`)
  }
  if (group.minimum !== qualityGates.normalTextMinimum || !group.purpose) {
    errors.push(`Theme 文字状态候选组 ${group.id} 必须使用统一 4.5:1 门槛并声明用途`)
  }
}
const disabledEvidenceById = new Map()
for (const evidence of qualityGates?.disabledBehaviorEvidence ?? []) {
  if (!evidence.id || disabledEvidenceById.has(evidence.id)) {
    errors.push(`Theme disabled 行为证据 id 缺失或重复: ${evidence.id ?? "missing"}`)
    continue
  }
  disabledEvidenceById.set(evidence.id, evidence)
  const sourcePath = path.join(root, evidence.source ?? "")
  if (!evidence.source || !fs.existsSync(sourcePath) || !evidence.testTitle || (evidence.requiredAssertions ?? []).length === 0) {
    errors.push(`Theme disabled 行为证据 ${evidence.id} 缺少真实 source、testTitle 或 requiredAssertions`)
    continue
  }
  const source = fs.readFileSync(sourcePath, "utf8")
  const titleIndex = source.indexOf(`test(\"${evidence.testTitle}\"`)
  if (titleIndex < 0) {
    errors.push(`Theme disabled 行为证据 ${evidence.id} 未找到测试标题: ${evidence.testTitle}`)
    continue
  }
  const nextTestIndex = source.indexOf("\ntest(\"", titleIndex + evidence.testTitle.length)
  const testBlock = source.slice(titleIndex, nextTestIndex < 0 ? source.length : nextTestIndex)
  for (const assertion of evidence.requiredAssertions) {
    if (!testBlock.includes(assertion)) errors.push(`Theme disabled 行为证据 ${evidence.id} 的测试块缺少断言: ${assertion}`)
  }
}
for (const group of qualityGates?.candidateDisabledGroups ?? []) {
  const hooks = [group.enabled, group.disabled, group.background]
  if (!group.id || !group.purpose || hooks.some((name) => !semanticVariables.has(name))) {
    errors.push(`Theme disabled 候选组 ${group.id ?? "missing"} 缺少用途或引用了不存在的 Hook`)
  }
  if (hooks.some((name) => !publicGlobalNames.has(name))) {
    errors.push(`Theme disabled 候选组 ${group.id ?? "missing"} 必须直接审计 public-global FDS Hooks`)
  }
  if (!Array.isArray(group.behaviorEvidenceRefs) || !Array.isArray(group.runtimeConsumerEvidence)) {
    errors.push(`Theme disabled 候选组 ${group.id ?? "missing"} 必须显式登记行为与 runtime 消费证据数组`)
    continue
  }
  for (const evidenceRef of group.behaviorEvidenceRefs) {
    if (!disabledEvidenceById.has(evidenceRef)) errors.push(`Theme disabled 候选组 ${group.id} 引用了不存在的行为证据: ${evidenceRef}`)
  }
  for (const evidence of group.runtimeConsumerEvidence) {
    const sourcePath = path.join(root, evidence.source ?? "")
    if (!evidence.source || !fs.existsSync(sourcePath) || !evidence.contains || !fs.readFileSync(sourcePath, "utf8").includes(evidence.contains)) {
      errors.push(`Theme disabled 候选组 ${group.id} 的 runtime 消费证据无效: ${evidence.source ?? "missing"}#${evidence.contains ?? "missing"}`)
    }
  }
}
const shadowVisualEvidenceById = new Map()
const snapshotDirectory = path.join(root, "tests/visual.spec.ts-snapshots")
const snapshotFiles = fs.existsSync(snapshotDirectory) ? fs.readdirSync(snapshotDirectory) : []
for (const evidence of qualityGates?.shadowVisualEvidence ?? []) {
  if (!evidence.id || shadowVisualEvidenceById.has(evidence.id)) {
    errors.push(`Theme shadow 视觉证据 id 缺失或重复: ${evidence.id ?? "missing"}`)
    continue
  }
  shadowVisualEvidenceById.set(evidence.id, evidence)
  const sourcePath = path.join(root, evidence.source ?? "")
  if (!evidence.source || !fs.existsSync(sourcePath) || !evidence.testTitle || (evidence.requiredAssertions ?? []).length === 0 || !evidence.screenshot) {
    errors.push(`Theme shadow 视觉证据 ${evidence.id} 缺少真实 source、testTitle、requiredAssertions 或 screenshot`)
    continue
  }
  const source = fs.readFileSync(sourcePath, "utf8")
  const titleIndex = source.indexOf(`test(\"${evidence.testTitle}\"`)
  const nextTestIndex = titleIndex < 0 ? -1 : source.indexOf("\ntest(\"", titleIndex + evidence.testTitle.length)
  const testBlock = titleIndex < 0 ? "" : source.slice(titleIndex, nextTestIndex < 0 ? source.length : nextTestIndex)
  if (titleIndex < 0) errors.push(`Theme shadow 视觉证据 ${evidence.id} 未找到测试标题: ${evidence.testTitle}`)
  for (const assertion of evidence.requiredAssertions) {
    if (!testBlock.includes(assertion)) errors.push(`Theme shadow 视觉证据 ${evidence.id} 的测试块缺少断言: ${assertion}`)
  }
  const snapshotStem = evidence.screenshot.replace(/\.png$/, "")
  if (!snapshotFiles.some((file) => file.startsWith(`${snapshotStem}-`) && file.endsWith(".png"))) {
    errors.push(`Theme shadow 视觉证据 ${evidence.id} 缺少已提交基线: ${evidence.screenshot}`)
  }
}
const shadowSystem = qualityGates?.candidateShadowSystem
if (shadowSystem) {
  const profileLevels = Object.keys(manifest.profiles?.shadowLevel ?? {})
  const optionLevels = (manifest.dimensions?.shadowLevel?.options ?? []).map((option) => option.id)
  if (JSON.stringify(shadowSystem.levels) !== JSON.stringify(profileLevels) || JSON.stringify(shadowSystem.levels) !== JSON.stringify(optionLevels)) {
    errors.push("Theme shadow 候选层级必须与 shadowLevel options/profiles 顺序完全一致")
  }
  if (!shadowSystem.purpose || (shadowSystem.colorHooks ?? []).length !== 3 || JSON.stringify(shadowSystem.colorAlphaOrder) !== JSON.stringify(shadowSystem.colorHooks)) {
    errors.push("Theme shadow 候选必须声明用途、三种颜色 Hook 与同序 alpha 层级")
  }
  for (const hook of shadowSystem.colorHooks ?? []) {
    const token = semanticTokenByName.get(hook)
    if (!token || token.visibility !== "public-global" || token.type !== "color") errors.push(`Theme shadow 颜色必须是 public-global color Hook: ${hook}`)
  }
  const elevationIds = new Set()
  const elevationHooks = new Set()
  for (const elevation of shadowSystem.elevations ?? []) {
    const token = semanticTokenByName.get(elevation.hook)
    if (!elevation.id || elevationIds.has(elevation.id) || elevationHooks.has(elevation.hook)) errors.push(`Theme shadow elevation id/Hook 缺失或重复: ${elevation.id ?? "missing"}`)
    elevationIds.add(elevation.id)
    elevationHooks.add(elevation.hook)
    if (!token || token.visibility !== "public-global" || token.type !== "shadow") errors.push(`Theme shadow elevation 必须是 public-global shadow Hook: ${elevation.hook}`)
    if (!Number.isInteger(elevation.layerCount) || elevation.layerCount < 1 || !["up", "down"].includes(elevation.direction)) errors.push(`Theme shadow elevation ${elevation.id} 缺少合法层数或方向`)
    if (!Array.isArray(elevation.runtimeConsumerEvidence) || !Array.isArray(elevation.visualEvidenceRefs)) errors.push(`Theme shadow elevation ${elevation.id} 必须显式登记 runtime/visual 证据数组`)
    for (const colorHook of (shadowSystem.colorHooks ?? []).slice(0, elevation.layerCount)) {
      if (!String(token?.value ?? "").includes(`var(${colorHook})`)) errors.push(`Theme shadow elevation ${elevation.id} 未引用所需颜色 Hook: ${colorHook}`)
    }
    for (const evidence of elevation.runtimeConsumerEvidence ?? []) {
      const sourcePath = path.join(root, evidence.source ?? "")
      if (!evidence.source || !fs.existsSync(sourcePath) || !evidence.contains || !fs.readFileSync(sourcePath, "utf8").includes(evidence.contains)) {
        errors.push(`Theme shadow elevation ${elevation.id} 的 runtime 消费证据无效: ${evidence.source ?? "missing"}#${evidence.contains ?? "missing"}`)
      }
    }
    for (const evidenceRef of elevation.visualEvidenceRefs ?? []) {
      if (!shadowVisualEvidenceById.has(evidenceRef)) errors.push(`Theme shadow elevation ${elevation.id} 引用了不存在的视觉证据: ${evidenceRef}`)
    }
    if (elevation.mirrorOf && !shadowSystem.elevations.some((candidate) => candidate.id === elevation.mirrorOf)) errors.push(`Theme shadow elevation ${elevation.id} 的 mirrorOf 不存在: ${elevation.mirrorOf}`)
  }
  if ((shadowSystem.downwardOrder ?? []).length < 2 || shadowSystem.downwardOrder.some((id) => !elevationIds.has(id))) {
    errors.push("Theme shadow downwardOrder 缺少已登记 elevation")
  }
}
for (const group of qualityGates?.interactionGroups ?? []) {
  if ((group.states ?? []).length < 2 || group.states.some((name) => !semanticVariables.has(name))) {
    errors.push(`Theme 交互态组 ${group.id} 缺少状态或引用了不存在的变量`)
  }
  if (group.states.some((name) => !publicGlobalNames.has(name))) {
    errors.push(`Theme 交互态组 ${group.id} 必须直接审计 public-global FDS Hooks`)
  }
}

for (const [dimension, contract] of Object.entries(manifest.dimensions ?? {})) {
  const options = contract.options ?? []
  const ids = options.map((option) => option.id)
  if (!contract.owner) errors.push(`${dimension} 缺少 owner`)
  if (ids.length === 0 || new Set(ids).size !== ids.length) errors.push(`${dimension} options 为空或 id 重复`)
  const defaultValue = manifest.defaults?.[dimension]
  if (defaultValue !== undefined && !ids.includes(defaultValue)) {
    errors.push(`${dimension} 默认值 ${defaultValue} 不在 options 中`)
  }
  if (contract.output && !semanticVariables.has(contract.output)) {
    errors.push(`${dimension} 输出未登记为 FDS Semantic token: ${contract.output}`)
  }
}

for (const option of manifest.dimensions?.primaryColor?.options ?? []) {
  if (!option.foundationRef || !foundation.includes(`${option.foundationRef}:`)) {
    errors.push(`主题色预设 ${option.id} 未引用真实 Foundation token: ${option.foundationRef ?? "missing"}`)
  }
}
for (const [dimension, contract] of Object.entries(manifest.dimensions ?? {})) {
  if (contract.owner !== "foundation-reference") errors.push(`${dimension} 尚未迁移到 Foundation reference`)
  for (const option of contract.options ?? []) {
    if (option.foundationRef && !foundationNames.has(option.foundationRef)) {
      errors.push(`${dimension}.${option.id} 引用了不存在的 Foundation token: ${option.foundationRef}`)
    }
  }
}
for (const [scale, profile] of Object.entries(manifest.profiles?.textScale ?? {})) {
  for (const [output, reference] of Object.entries(profile)) {
    if (!semanticVariables.has(output)) errors.push(`textScale.${scale} 输出未登记为 FDS Semantic token: ${output}`)
    if (!foundationNames.has(reference)) errors.push(`textScale.${scale}.${output} 引用了不存在的 Foundation token: ${reference}`)
  }
}
for (const [level, profile] of Object.entries(manifest.profiles?.shadowLevel ?? {})) {
  for (const value of Object.values(profile)) {
    for (const match of String(value).matchAll(/var\((--fds-g-[\w-]+)/g)) {
      if (!foundationNames.has(match[1]) && !semantic.includes(`${match[1]}:`)) errors.push(`shadowLevel.${level} 引用了不存在的 token: ${match[1]}`)
    }
  }
}

const requiredBrandSteps = ["01", "02", "03", "04", "05", "08", "09", "10"]
for (const step of requiredBrandSteps) {
  if (!manifest.algorithm?.brandScale?.[step]) errors.push(`派生算法缺少品牌色阶 ${step}`)
}
if (manifest.algorithm?.version !== 5 || manifest.algorithm?.solidActionScale || !manifest.algorithm?.darkPalette) {
  errors.push("Theme 派生算法必须使用 Base 90/80/100 交互阶梯、Dark Map 与实心色前景解析器的 v5，禁止另造 Solid 色阶")
}

const adapterWrites = manifest.runtimeOutputs?.adapterWrites ?? []
if (JSON.stringify(adapterWrites) !== JSON.stringify(["--fds-g-color-seed-brand"])) {
  errors.push("框架适配器只允许写入 FDS brand seed；Brand Map 必须由 Foundation 统一派生")
}
if (JSON.stringify(manifest.runtimeOutputs?.resolverWrites ?? []) !== JSON.stringify(solidForegroundHooks)) {
  errors.push("Theme resolverWrites 必须只包含 Primary 实心前景 Semantic 输出")
}
for (const cssVar of manifest.runtimeOutputs?.cssDerivedOutputs ?? []) {
  if (!foundation.includes(`${cssVar}:`)) errors.push(`CSS 派生输出未在 Foundation 声明: ${cssVar}`)
}
for (const cssVar of manifest.runtimeOutputs?.semanticConsumers ?? []) {
  if (!semantic.includes(`${cssVar}:`)) errors.push(`语义消费者未在 fx-theme.css 声明: ${cssVar}`)
}

if (!runtime.includes("theme-presets.manifest.json") || !runtime.includes("deriveThemeSeedVariables") || !runtime.includes("deriveSolidForegroundVariables") || !runtime.includes("getThemeSolidForegroundStyle")) {
  errors.push("React theme runtime 未消费 Theme Preset contract、纯 seed 派生器与实心色前景解析器")
}
if (!runtime.includes("themeAnimationContract.output")) {
  errors.push("React theme runtime 必须从 Theme Preset contract 读取动效 Semantic 输出名")
}
if (/legacy-runtime-pending-foundation-migration/.test(JSON.stringify(manifest)) || /["`]\d+(?:\.\d+)?(?:px|rem|ms)["`]/.test(runtime) || runtime.includes("oklch(from")) {
  errors.push("Theme runtime 仍含旧迁移标记或手写物理值/颜色公式")
}
if (!frameworkAdapters.portableCore?.sources?.includes("docs/data/theme-presets.manifest.json")) {
  errors.push("跨框架核心来源未包含 Theme Preset contract")
}
if (!derivation.includes('"--fds-g-color-seed-brand": brand') || derivation.includes('"--fds-g-color-brand-vivid": brand')) {
  errors.push("框架无关派生器必须只输出 FDS brand seed，不得绕过 Foundation 写入 vivid Map")
}
if (!derivation.includes("prefer-light-for-entire-state-group-with-dark-fallback") || !derivation.includes('group.policy === "fixed-preferred"') || !derivation.includes("group.backgrounds.every") || !derivation.includes("contract.minimumContrast")) {
  errors.push("框架无关派生器缺少整组三态前景选择与最低对比度判断")
}

if (errors.length > 0) {
  if (json) console.log(JSON.stringify({ status: "repair-needed", errors }, null, 2))
  else {
    console.error(`Theme Preset contract 发现 ${errors.length} 处问题：`)
    for (const error of errors) console.error(`ERROR: ${error}`)
  }
  process.exit(1)
}

const result = {
  status: "ready",
  contractVersion: manifest.contractVersion,
  dimensions: Object.keys(manifest.dimensions).length,
  colorPresets: manifest.dimensions.primaryColor.options.length,
  publishedModes: manifest.publication.publishedModes,
  runtimePreviewModes: manifest.publication.runtimePreviewModes
}
if (json) console.log(JSON.stringify(result, null, 2))
else console.log(`Theme Preset contract check passed: ${result.dimensions} dimensions, ${result.colorPresets} governed color presets`)

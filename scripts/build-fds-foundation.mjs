#!/usr/bin/env node
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const primitivePath = path.join(root, "tokens/source/primitive.tokens.json")
const mapPath = path.join(root, "tokens/source/map.tokens.json")
const namingPath = path.join(root, "docs/data/token-naming.manifest.json")
const cssPath = path.join(root, "theme/foundation.css")
const contractPath = path.join(root, "docs/data/fds-foundation.manifest.json")
const bootstrap = process.argv.includes("--bootstrap")
const check = process.argv.includes("--check")

const normalize = (value) => String(value).trim().replace(/\s+/g, " ")

function parseCssVariables(css) {
  return [...css.matchAll(/^\s*(--fx-[\w-]+):\s*([^;]+);/gm)]
    .map((match) => ({ name: match[1], value: normalize(match[2]) }))
}

function setToken(rootObject, tokenPath, token) {
  const parts = tokenPath.split(".")
  const leaf = parts.pop()
  let cursor = rootObject
  for (const part of parts) cursor = cursor[part] ??= {}
  cursor[leaf] = token
}

function parseFontFamily(value) {
  return value.split(",").map((family) => family.trim().replace(/^(?:"([^"]+)"|'([^']+)')$/, "$1$2"))
}

function primitiveDescriptor(legacyName, cssValue) {
  let tokenPath
  let cssName
  let type
  let value
  if (legacyName === "--fx-brand") {
    tokenPath = "color.seed.brand"
    cssName = "--fds-g-color-seed-brand"
    type = "color"
  } else if (legacyName.startsWith("--fx-seed-")) {
    const family = legacyName.slice("--fx-seed-".length)
    tokenPath = `color.seed.${family}`
    cssName = `--fds-g-color-seed-${family}`
    type = "color"
  } else {
    const rules = [
      [/^--fx-space-(.+)$/, "spacing", "--fds-g-spacing-", "dimension"],
      [/^--fx-size-(.+)$/, "sizing", "--fds-g-sizing-", "dimension"],
      [/^--fx-font-family-(.+)$/, "font.family", "--fds-g-font-family-", "fontFamily"],
      [/^--fx-font-size-(.+)$/, "font.size", "--fds-g-font-size-", "dimension"],
      [/^--fx-line-height-(.+)$/, "font.line-height", "--fds-g-font-line-height-", "dimension"],
      [/^--fx-font-weight-(.+)$/, "font.weight", "--fds-g-font-weight-", "fontWeight"],
      [/^--fx-radius-(.+)$/, "radius", "--fds-g-radius-", "dimension"],
      [/^--fx-border-width-(.+)$/, "border.width", "--fds-g-border-width-", "dimension"],
      [/^--fx-icon-stroke-(.+)$/, "icon.stroke", "--fds-g-icon-stroke-", "number"],
      [/^--fx-opacity-(.+)$/, "opacity", "--fds-g-opacity-", "number"],
      [/^--fx-blur-(.+)$/, "blur", "--fds-g-blur-", "dimension"],
      [/^--fx-duration-(.+)$/, "motion.duration", "--fds-g-motion-duration-", "duration"],
      [/^--fx-ease-(.+)$/, "motion.easing", "--fds-g-motion-easing-", "cubicBezier"],
      [/^--fx-z-(.+)$/, "z-index", "--fds-g-z-index-", "number"],
    ]
    const rule = rules.find(([pattern]) => pattern.test(legacyName))
    if (!rule) throw new Error(`无法将 legacy Primitive 映射到 FDS：${legacyName}`)
    const match = legacyName.match(rule[0])
    tokenPath = `${rule[1]}.${match[1]}`
    cssName = `${rule[2]}${match[1]}`
    type = rule[3]
  }

  if (type === "color") {
    const hex = cssValue.match(/^#([0-9a-f]{6})$/i)
    const oklch = cssValue.match(/^oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)$/i)
    if (hex) {
      const int = Number.parseInt(hex[1], 16)
      value = {
        colorSpace: "srgb",
        components: [((int >> 16) & 255) / 255, ((int >> 8) & 255) / 255, (int & 255) / 255],
        alpha: 1,
      }
    } else if (oklch) {
      value = { colorSpace: "oklch", components: oklch.slice(1).map(Number), alpha: 1 }
    } else throw new Error(`不支持的 Primitive color：${legacyName}=${cssValue}`)
  } else if (type === "dimension") {
    const match = cssValue.match(/^([\d.]+)(px|rem)$/)
    if (!match) throw new Error(`不支持的 dimension：${legacyName}=${cssValue}`)
    value = { value: Number(match[1]), unit: match[2] }
  } else if (type === "duration") {
    const match = cssValue.match(/^([\d.]+)ms$/)
    if (!match) throw new Error(`不支持的 duration：${legacyName}=${cssValue}`)
    value = { value: Number(match[1]), unit: "ms" }
  } else if (type === "fontFamily") value = parseFontFamily(cssValue)
  else if (type === "fontWeight") value = Number(cssValue)
  else if (type === "cubicBezier") {
    if (cssValue === "linear") value = [0, 0, 1, 1]
    else {
      const match = cssValue.match(/^cubic-bezier\(([^)]+)\)$/)
      if (!match) throw new Error(`不支持的 easing：${legacyName}=${cssValue}`)
      value = match[1].split(",").map((item) => Number(item.trim()))
    }
  } else if (legacyName.startsWith("--fx-opacity-")) value = Number.parseFloat(cssValue) / 100
  else value = Number(cssValue)

  return {
    tokenPath,
    token: {
      $type: type,
      $value: value,
      $extensions: {
        fds: {
          layer: "primitive",
          cssName,
          legacyName,
          visibility: legacyName === "--fx-brand" ? "public-global" : "internal",
          stability: "experimental",
        },
      },
    },
  }
}

function bootstrapPrimitiveSource() {
  if (fs.existsSync(primitivePath)) throw new Error("Primitive source 已存在，禁止再次从派生 CSS bootstrap")
  const mapContract = JSON.parse(fs.readFileSync(mapPath, "utf8"))
  const mapLegacyNames = new Set(expandMapTokens(mapContract).map((token) => token.legacyName))
  const variables = parseCssVariables(fs.readFileSync(cssPath, "utf8"))
  const source = {
    $extensions: {
      fds: {
        schemaVersion: 1,
        format: "fds/dtcg-primitive-tokens",
        contractVersion: "1.0.0-draft.1",
        truthSource: "tokens/source/primitive.tokens.json",
        layer: "primitive",
      },
    },
  }
  for (const { name, value } of variables) {
    if (mapLegacyNames.has(name)) continue
    const descriptor = primitiveDescriptor(name, value)
    setToken(source, descriptor.tokenPath, descriptor.token)
  }
  fs.mkdirSync(path.dirname(primitivePath), { recursive: true })
  fs.writeFileSync(primitivePath, `${JSON.stringify(source, null, 2)}\n`)
  console.log(`✅ 已从现有 Foundation bootstrap ${variables.length - mapLegacyNames.size} 个 Primitive Token`)
}

function flattenPrimitive(node, prefix = [], result = []) {
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith("$")) continue
    if (value && typeof value === "object" && "$value" in value) {
      result.push({ path: [...prefix, key].join("."), ...value.$extensions.fds, type: value.$type, value: value.$value })
    } else flattenPrimitive(value, [...prefix, key], result)
  }
  return result
}

function expandMapTokens(contract) {
  const tokens = []
  const add = (path, cssName, legacyName, formula, profile = "base", type = "color", derivation) => tokens.push({
    path, cssName, legacyName, formula, layer: "map", visibility: "internal", stability: "experimental", profile, type, derivation,
  })

  add("color.brand.vivid", "--fds-g-color-brand-vivid", "--fx-brand-vivid", contract.brand.vivid, "normalization")
  for (const family of contract.palette.families) {
    for (const step of contract.palette.steps) {
      const formula = contract.palette.exceptions[`${family}.${step.range}`] ?? step.formula.replaceAll("{seed}", `{color.seed.${family}}`)
      add(`color.${family}.base.${step.range}`, `--fds-g-color-${family}-base-${step.range}`, `--fx-${family}-${step.legacy}`, formula)
    }
  }
  for (const family of contract.palette.families) {
    for (const step of contract.darkPalette.steps) {
      add(
        `color.${family}.dark.${step.range}`,
        `--fds-g-color-${family}-dark-${step.range}`,
        null,
        step.formula.replaceAll("{seed}", `{color.seed.${family}}`),
        "dark",
      )
    }
  }
  if (contract.brand.base.stepsSource !== "palette.steps") {
    throw new Error(`Brand Base stepsSource 无效：${contract.brand.base.stepsSource}`)
  }
  for (const step of contract.palette.steps) {
    add(
      `color.brand.base.${step.range}`,
      `--fds-g-color-brand-base-${step.range}`,
      `--fx-brand-${step.legacy}`,
      step.formula.replaceAll("{seed}", `{${contract.brand.base.seed}}`),
    )
  }
  add("color.neutral.anchor.dark", "--fds-g-color-neutral-anchor-dark", "--fx-neutral-dark", contract.neutral.anchor, "anchor")
  for (const step of contract.neutral.steps) {
    const formula = step.formula ?? `color-mix(in oklch, white, {color.neutral.anchor.dark} ${String(step.mix).padStart(2, " ")}%)`
    add(`color.neutral.base.${step.range}`, `--fds-g-color-neutral-base-${step.range}`, `--fx-neutrals-${step.legacy}`, formula)
  }
  const radiusSeed = flattenPrimitive(JSON.parse(fs.readFileSync(primitivePath, "utf8")))
    .find((token) => token.path === contract.radius.seed)
  if (!radiusSeed || radiusSeed.type !== "dimension") throw new Error(`Radius Map Seed 无效：${contract.radius.seed}`)
  for (const step of contract.radius.steps) {
    if (!Number.isInteger(step.numerator) || !Number.isInteger(step.denominator) || step.denominator <= 0) {
      throw new Error(`Radius Map 比例无效：${JSON.stringify(step)}`)
    }
    const value = radiusSeed.value.value * step.numerator / step.denominator
    if (!Number.isInteger(value)) throw new Error(`Radius Map 必须生成整数 px：${step.range}=${value}`)
    add(
      `radius.${step.range}`,
      `--fds-g-radius-${step.range}`,
      `--fx-radius-${step.range}`,
      `${value}${radiusSeed.value.unit}`,
      "scale",
      "dimension",
      {
        seed: contract.radius.seed,
        formula: `seed * ${step.numerator} / ${step.denominator}`,
        factor: { numerator: step.numerator, denominator: step.denominator },
      },
    )
  }
  return tokens
}

function renderDtcgValue(token) {
  const value = token.value
  if (token.type === "color") {
    if (value.colorSpace === "srgb") {
      const channels = value.components.map((component) => Math.round(component * 255).toString(16).padStart(2, "0"))
      return `#${channels.join("").toUpperCase()}`
    }
    if (value.colorSpace === "oklch") return `oklch(${value.components.join(" ")})`
  }
  if (token.type === "dimension" || token.type === "duration") return `${value.value}${value.unit}`
  if (token.type === "fontFamily") {
    const unquoted = new Set(["Arial", "sans-serif", "serif", "monospace", "STSong", "Georgia", "SimSun", "Consolas"])
    return value.map((family) => unquoted.has(family) ? family : `"${family}"`).join(", ")
  }
  if (token.type === "cubicBezier") return token.path.endsWith(".linear") ? "linear" : `cubic-bezier(${value.join(", ")})`
  if (token.path.startsWith("opacity.")) return `${Math.round(value * 100)}%`
  return String(value)
}

function renderFormula(formula, tokenByPath, nameField) {
  return formula.replace(/\{([\w.-]+)\}/g, (_, reference) => {
    const token = tokenByPath.get(reference)
    if (!token) throw new Error(`Map formula 引用了不存在的 Token：${reference}`)
    return `var(${token[nameField]})`
  })
}

function build() {
  const primitiveSource = JSON.parse(fs.readFileSync(primitivePath, "utf8"))
  const mapContract = JSON.parse(fs.readFileSync(mapPath, "utf8"))
  const namingContract = JSON.parse(fs.readFileSync(namingPath, "utf8"))
  const primitives = flattenPrimitive(primitiveSource)
  const maps = expandMapTokens(mapContract)
  const all = [...primitives, ...maps]
  const tokenByPath = new Map(all.map((token) => [token.path, token]))
  if (tokenByPath.size !== all.length) throw new Error("Primitive/Map 存在重复 token path")
  if (new Set(all.map((token) => token.cssName)).size !== all.length) throw new Error("FDS CSS 名称不唯一")
  const legacyTokens = all.filter((token) => token.legacyName)
  if (new Set(legacyTokens.map((token) => token.legacyName)).size !== legacyTokens.length) throw new Error("Legacy CSS 名称不唯一")

  const seeds = primitives.filter((token) => token.path.includes(".seed."))
  const physical = primitives.filter((token) => !token.path.includes(".seed."))
  const lines = [
    "/* Generated from tokens/source/primitive.tokens.json + map.tokens.json.",
    " * Do not edit this file directly. Run npm run build:fds-foundation.",
    " * FDS names are runtime truth; --fx-* declarations are compatibility aliases.",
    " */",
    "",
    ":root {",
    "  /* Primitive / Seed */",
    ...seeds.map((token) => `  ${token.cssName}: ${renderDtcgValue(token)};`),
    "",
    "  /* Map / generated scales */",
    ...maps.map((token) => `  ${token.cssName}: ${renderFormula(token.formula, tokenByPath, "cssName")};`),
    "",
    "  /* Primitive / physical scales */",
    ...physical.map((token) => `  ${token.cssName}: ${renderDtcgValue(token)};`),
    "",
    "  /* Legacy --fx-* compatibility aliases. */",
    ...legacyTokens.map((token) => `  ${token.legacyName}: var(${token.cssName});`),
    "}",
    "",
  ]
  const css = lines.join("\n")
  const portable = {
    schemaVersion: 1,
    format: "fds/foundation-contract",
    contractVersion: primitiveSource.$extensions.fds.contractVersion,
    truthSources: ["tokens/source/primitive.tokens.json", "tokens/source/map.tokens.json"],
    generatedFiles: ["theme/foundation.css", "docs/data/fds-foundation.manifest.json"],
    migrationPhase: namingContract.migration.phase,
    counts: { primitive: primitives.length, map: maps.length, total: all.length },
    tokens: all.map((token) => ({
      path: token.path,
      layer: token.layer,
      type: token.type ?? "color",
      name: token.cssName,
      ...(token.legacyName ? { legacyName: token.legacyName } : {}),
      value: token.formula ? renderFormula(token.formula, tokenByPath, "cssName") : renderDtcgValue(token),
      ...(token.legacyName ? { legacyValue: token.formula ? renderFormula(token.formula, tokenByPath, "legacyName") : renderDtcgValue(token) } : {}),
      visibility: token.visibility,
      stability: token.stability,
      profile: token.profile,
      ...(token.derivation ? { derivation: token.derivation } : {}),
    })),
  }
  const contractJson = `${JSON.stringify(portable, null, 2)}\n`
  if (check) {
    const errors = []
    if (!fs.existsSync(cssPath) || fs.readFileSync(cssPath, "utf8") !== css) errors.push("theme/foundation.css 不是最新生成结果")
    if (!fs.existsSync(contractPath) || fs.readFileSync(contractPath, "utf8") !== contractJson) errors.push("docs/data/fds-foundation.manifest.json 不是最新生成结果")
    if (errors.length) throw new Error(errors.join("；请运行 npm run build:fds-foundation；"))
    console.log(`FDS Foundation check passed: ${primitives.length} Primitive + ${maps.length} Map = ${all.length}`)
    return
  }
  fs.writeFileSync(cssPath, css)
  fs.writeFileSync(contractPath, contractJson)
  console.log(`✅ 已生成 Foundation：${primitives.length} Primitive + ${maps.length} Map = ${all.length}`)
}

try {
  if (bootstrap) bootstrapPrimitiveSource()
  else build()
} catch (error) {
  console.error(`ERROR: ${error.message}`)
  process.exit(1)
}

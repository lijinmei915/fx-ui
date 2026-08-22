import { readFile } from "node:fs/promises"

const root = new URL("../", import.meta.url)

async function read(path) {
  return readFile(new URL(path, root), "utf8")
}

async function readJson(path) {
  return JSON.parse(await read(path))
}

function extractVariantKeys(source, groupName) {
  const groupStart = source.indexOf(`${groupName}: {`)
  if (groupStart === -1) {
    throw new Error(`Cannot find ${groupName} variants`)
  }

  const nextGroup = source.indexOf("\n      },", groupStart)
  const groupSource = source.slice(groupStart, nextGroup)

  return [...groupSource.matchAll(/^\s{8}(?:"([^"]+)"|([a-z][\w-]*)):\s/mg)].map(
    (match) => match[1] ?? match[2]
  )
}

function assertIncludes(source, values, label, errors) {
  for (const value of values) {
    if (!source.includes(value)) {
      errors.push(`${label} is missing "${value}"`)
    }
  }
}

function extractConstArray(source, constName) {
  const start = source.indexOf(`const ${constName}`)
  if (start === -1) return ""
  const arrStart = source.indexOf("[", start)
  let depth = 0
  let inString = null
  let escaped = false

  for (let index = arrStart; index < source.length; index += 1) {
    const char = source[index]

    if (inString) {
      if (escaped) {
        escaped = false
      } else if (char === "\\") {
        escaped = true
      } else if (char === inString) {
        inString = null
      }
      continue
    }

    if (char === "\"" || char === "'" || char === "`") {
      inString = char
      continue
    }

    if (char === "[") depth += 1
    if (char === "]") {
      depth -= 1
      if (depth === 0) return source.slice(arrStart, index + 1)
    }
  }

  return source.slice(arrStart)
}

function extractObjectBlocks(arraySource) {
  return arraySource
    .split(/\n\s*\},\n\s*\{/)
    .map((block, index, list) => {
      let next = block
      if (index > 0) next = `{${next}`
      if (index < list.length - 1) next = `${next}}`
      return next
    })
}

function extractStringProp(block, prop) {
  return block.match(new RegExp(`${prop}:\\s*"([^"]*)"`))?.[1] ?? ""
}

const [buttonSource, appSource, buttonPlaygroundModuleSource, buttonDocs, playgroundManifest] = await Promise.all([
  read("src/components/ui/button.tsx"),
  read("src/App.tsx"),
  read("src/pages/docs/components/button-playground.tsx"),
  read("docs/components/button.md"),
  readJson("docs/data/component-playgrounds.manifest.json"),
])

const errors = []
if (buttonSource.includes("bg-clip-padding text-sm font-normal")) {
  errors.push("Button base class must not pin text-sm; typography belongs to each size variant")
}
const variants = extractVariantKeys(buttonSource, "variant")
const sizes = extractVariantKeys(buttonSource, "size")
const buttonPlaygroundSource = `${appSource}\n${buttonPlaygroundModuleSource}\n${JSON.stringify(playgroundManifest.customPlaygrounds?.button ?? {})}`
const normalizedButtonPlaygroundSource = buttonPlaygroundSource.replace(/\s/g, "")

for (const variant of variants) {
  const jsxUsage = variant === "default" ? 'variant: "default"' : `variant="${variant}"`
  const manifestOption = `"value":"${variant}"`
  // destructive is a semantic danger treatment, not a visual-type option in the
  // playground. Its real API remains documented and exercised by the component.
  if (variant === "destructive" && buttonDocs.includes('variant="destructive"') && normalizedButtonPlaygroundSource.includes('"value":"danger"')) continue
  if (!buttonPlaygroundSource.includes(jsxUsage) && !normalizedButtonPlaygroundSource.includes(manifestOption)) {
    errors.push(`Button playground is missing "${jsxUsage}"`)
  }
}
// 常规文字尺寸档必须在调试台里可切换；工具栏 / 图标专用尺寸属于 API 表和 Markdown 契约，不强制塞进调试台。
assertIncludes(
  normalizedButtonPlaygroundSource,
  sizes
    .filter((size) => !size.startsWith("icon") && !size.startsWith("toolbar") && size !== "default")
    .map((size) => `"value":"${size}"`),
  "Button playground",
  errors
)
assertIncludes(buttonDocs, variants, "Button Markdown variants", errors)
assertIncludes(
  buttonSource,
  [
    'xs: "h-(--fx-control-xs-height) rounded-sm px-(--fx-control-px-xs) text-xs',
    'sm: "h-(--fx-control-sm-height) rounded-sm px-(--fx-control-px-sm) text-[length:var(--fx-text-control-sm)] leading-[var(--fx-text-control-sm--line-height)]',
    'md: "h-(--fx-control-md-height) rounded-md px-(--fx-control-px-md) text-sm',
    'lg: "h-(--fx-control-lg-height) gap-(--fx-control-gap) rounded-md px-(--fx-control-px-lg) text-base',
  ],
  "Button size typography/radius contract",
  errors
)
assertIncludes(buttonDocs, sizes, "Button Markdown sizes", errors)

const requiredStateContracts = [
  ["Button source", buttonSource, "focus-visible"],
  ["Button source", buttonSource, "active:"],
  ["Button source", buttonSource, "aria-expanded"],
  ["Button source", buttonSource, "disabled:"],
  ["Button source", buttonSource, "aria-invalid"],
  ["Button playground", buttonPlaygroundSource, "disabledWhen"],
  ["Button playground", buttonPlaygroundSource, "<Spinner"],
  ["Button playground", buttonPlaygroundSource, "禁用"],
  ["Button Markdown", buttonDocs, "disabled"],
  ["Button Markdown", buttonDocs, "Spinner"],
  ["Button Markdown", buttonDocs, "aria-invalid"],
]

for (const [label, source, value] of requiredStateContracts) {
  if (!source.includes(value)) {
    errors.push(`${label} is missing "${value}"`)
  }
}

{
  const variantSource = extractConstArray(appSource, "PG_VARIANTS")
  const variantBlocks = extractObjectBlocks(variantSource)
  const seenTexts = new Map()
  const requiredProps = ["value", "intent", "intentEn", "constraint", "constraintEn"]

  for (const block of variantBlocks) {
    const value = extractStringProp(block, "value")
    if (!value) continue

    for (const prop of requiredProps) {
      const text = extractStringProp(block, prop).trim()
      if (!text) {
        errors.push(`Button PG_VARIANTS.${value} is missing ${prop}`)
      }
      if ((prop === "intent" || prop === "constraint") && text.length < 20) {
        errors.push(`Button PG_VARIANTS.${value}.${prop} is too vague for AI selection`)
      }
      const key = `${prop}:${text}`
      if (text && seenTexts.has(key)) {
        errors.push(`Button PG_VARIANTS.${value}.${prop} duplicates ${seenTexts.get(key)}`)
      } else if (text) {
        seenTexts.set(key, `${value}.${prop}`)
      }
    }
  }
}

if (errors.length > 0) {
  console.error("shadcn contract check failed:\n")
  for (const error of errors) {
    console.error(`- ${error}`)
  }
  process.exitCode = 1
} else {
  console.log(
    `shadcn contract check passed: Button has ${variants.length} variants, ${sizes.length} sizes, source interaction feedback, and documented interaction states.`
  )
}

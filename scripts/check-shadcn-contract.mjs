import { readFile } from "node:fs/promises"

const root = new URL("../", import.meta.url)

async function read(path) {
  return readFile(new URL(path, root), "utf8")
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

const [buttonSource, appSource, buttonDocs] = await Promise.all([
  read("src/components/ui/button.tsx"),
  read("src/App.tsx"),
  read("docs/components/button.md"),
])

const errors = []
const variants = extractVariantKeys(buttonSource, "variant")
const sizes = extractVariantKeys(buttonSource, "size")

assertIncludes(
  appSource,
  variants.map((variant) => (variant === "default" ? 'variant: "default"' : `variant="${variant}"`)),
  "Button playground",
  errors
)
// 文字尺寸档必须在调试台里可切换；图标尺寸属于 API 表和 Markdown 契约，不强制塞进调试台。
assertIncludes(
  appSource,
  sizes.filter((size) => !size.startsWith("icon") && size !== "default").map((size) => `value: "${size}"`),
  "Button playground",
  errors
)
assertIncludes(buttonDocs, variants, "Button Markdown variants", errors)
assertIncludes(buttonDocs, sizes, "Button Markdown sizes", errors)

const requiredStateContracts = [
  ["Button source", buttonSource, "focus-visible"],
  ["Button source", buttonSource, "active:"],
  ["Button source", buttonSource, "aria-expanded"],
  ["Button source", buttonSource, "disabled:"],
  ["Button source", buttonSource, "aria-invalid"],
  ["Button playground", appSource, "disabledWhen"],
  ["Button playground", appSource, "<Spinner"],
  ["Button playground", appSource, "禁用"],
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

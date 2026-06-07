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
  variants.map((variant) => (variant === "default" ? "<Button>Default</Button>" : `variant="${variant}"`)),
  "Button overview",
  errors
)
assertIncludes(
  appSource,
  sizes.filter((size) => size !== "default").map((size) => `size="${size}"`),
  "Button overview",
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
  ["Button overview", appSource, "交互状态"],
  ["Button overview", appSource, "正常"],
  ["Button overview", appSource, "<Spinner"],
  ["Button overview", appSource, "禁用"],
  ["Button Markdown", buttonDocs, "disabled"],
  ["Button Markdown", buttonDocs, "Spinner"],
  ["Button Markdown", buttonDocs, "aria-invalid"],
]

for (const [label, source, value] of requiredStateContracts) {
  if (!source.includes(value)) {
    errors.push(`${label} is missing "${value}"`)
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

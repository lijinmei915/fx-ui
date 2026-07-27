import { ComponentPlayground } from "@/components/fx/component-playground"

export type StandardScenarioExample = {
  id: string
  title: string
  titleEn?: string
  intent: string
  intentEn?: string
  rule: string
  ruleEn?: string
  code: string
  group?: string
  spec?: string
}

export function StandardScenarioPlayground({
  slug,
  examples,
  renderScenarioPreview,
  importCode,
  lang,
  storyPresentation,
}: {
  slug: string
  examples: StandardScenarioExample[]
  renderScenarioPreview: (id: string) => React.ReactNode
  importCode: string
  lang: "zh" | "en"
  storyPresentation?: "presets" | "examples"
}) {
  const first = examples[0]
  if (!first) return null

  return (
    <ComponentPlayground
      lang={lang}
      config={{
        storySource: `docs/data/component-playgrounds.manifest.json#autoStories.${slug}`,
        storyPresentation,
        props: [],
        stories: examples.map((example) => ({
          id: example.id,
          title: example.spec ? `${example.title} ${example.spec}` : example.title,
          titleEn: example.titleEn ?? example.title,
          intent: example.intent,
          intentEn: example.intentEn ?? example.intent,
          constraint: example.rule,
          constraintEn: example.ruleEn ?? example.rule,
          values: { scenario: example.id },
        })),
        initial: { scenario: first.id },
        renderOne: (values) => renderScenarioPreview(values.scenario),
        genCode: (values) => {
          const selected = examples.find((example) => example.id === values.scenario) ?? first
          return `${importCode}\n\n${selected.code}`
        },
      }}
    />
  )
}

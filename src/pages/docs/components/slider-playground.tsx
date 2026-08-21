import { useState } from "react"

import { ComponentPlayground, type ComponentPlaygroundConfig } from "@/components/fx/component-playground"
import { Field, FieldLabel } from "@/components/ui/field"
import { Slider } from "@/components/ui/slider"
import componentPlaygroundsManifestRaw from "../../../../docs/data/component-playgrounds.manifest.json?raw"
import { componentPlaygroundPropsFromManifest, componentPlaygroundStoriesFromManifest, type ComponentPlaygroundsManifest } from "@/pages/docs/components/component-playground-manifest"

const manifest = JSON.parse(componentPlaygroundsManifestRaw) as ComponentPlaygroundsManifest
const sliderManifest = manifest.customPlaygrounds?.slider

if (!sliderManifest) throw new Error("Missing customPlaygrounds.slider manifest entry")

function numberValue(value: string, fallback: number) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function sliderValue(values: Record<string, string>) {
  const min = numberValue(values.min, 0)
  const max = numberValue(values.max, 100)
  const parsed = values.value.split(",").map((item) => numberValue(item.trim(), min))

  if (values.type === "range") {
    return [parsed[0] ?? min, parsed[1] ?? max]
  }

  return parsed[0] ?? min
}

function SliderPlaygroundPreview({ values }: { values: Record<string, string> }) {
  const initialValue = sliderValue(values)
  const [value, setValue] = useState<number | readonly number[]>(initialValue)
  const orientation = values.orientation === "vertical" ? "vertical" : "horizontal"
  const disabled = values.disabled === "true"
  const min = numberValue(values.min, 0)
  const max = Math.max(numberValue(values.max, 100), min + Number.EPSILON)
  const step = Math.max(numberValue(values.step, 1), Number.EPSILON)
  const labelId = "slider-playground-label"

  return (
    <Field className={orientation === "vertical" ? "w-fit" : "w-full max-w-[400px]"} data-disabled={disabled || undefined}>
      <div className="flex items-center justify-between gap-4">
        <FieldLabel id={labelId}>完成度</FieldLabel>
        <output className="text-body text-foreground-secondary">{Array.isArray(value) ? value.join(" - ") : value}</output>
      </div>
      <Slider
        aria-labelledby={labelId}
        className={orientation === "vertical" ? "h-40" : undefined}
        disabled={disabled}
        max={max}
        min={min}
        onValueChange={setValue}
        orientation={orientation}
        step={step}
        value={value}
      />
    </Field>
  )
}

function buildSliderCode(values: Record<string, string>) {
  const initialValue = sliderValue(values)
  const props = [
    `defaultValue={${JSON.stringify(initialValue)}}`,
    values.min !== "0" ? `min={${numberValue(values.min, 0)}}` : "",
    values.max !== "100" ? `max={${numberValue(values.max, 100)}}` : "",
    values.step !== "1" ? `step={${Math.max(numberValue(values.step, 1), Number.EPSILON)}}` : "",
    values.orientation === "vertical" ? 'orientation="vertical" className="h-40"' : 'className="max-w-[400px]"',
    values.disabled === "true" ? "disabled" : "",
  ].filter(Boolean).join(" ")

  return `import { Field, FieldLabel } from "@/components/ui/field"\nimport { Slider } from "@/components/ui/slider"\n\n<Field>\n  <FieldLabel id="completion-label">完成度</FieldLabel>\n  <Slider aria-labelledby="completion-label" ${props} />\n</Field>`
}

export const sliderPlaygroundConfig: ComponentPlaygroundConfig = {
  storySource: "docs/data/component-playgrounds.manifest.json#customPlaygrounds.slider",
  props: componentPlaygroundPropsFromManifest(sliderManifest),
  initial: sliderManifest.initial,
  stories: componentPlaygroundStoriesFromManifest(sliderManifest),
  storyPresentation: sliderManifest.storyPresentation,
  guidanceKey: sliderManifest.guidanceKey,
  previewItemsClassName: "flex min-h-48 w-full items-center justify-center",
  renderOne: (values) => <SliderPlaygroundPreview key={JSON.stringify(values)} values={values} />,
  genCode: buildSliderCode,
}

export function SliderPlayground({ lang }: { lang: "zh" | "en" }) {
  return <ComponentPlayground config={sliderPlaygroundConfig} lang={lang} />
}

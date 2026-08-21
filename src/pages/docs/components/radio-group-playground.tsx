import { useState } from "react"

import type { ComponentPlaygroundConfig } from "@/components/fx/component-playground"
import { Field, FieldContent, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field"
import { RadioGroup, RadioGroupItem, type RadioGroupItemSize } from "@/components/ui/radio-group"
import componentPlaygroundsManifestRaw from "../../../../docs/data/component-playgrounds.manifest.json?raw"
import { componentPlaygroundPropsFromManifest, type ComponentPlaygroundsManifest } from "@/pages/docs/components/component-playground-manifest"

const componentPlaygroundsManifest = JSON.parse(componentPlaygroundsManifestRaw) as ComponentPlaygroundsManifest
const radioGroupManifest = componentPlaygroundsManifest.customPlaygrounds?.radioGroup

if (!radioGroupManifest) throw new Error("Missing customPlaygrounds.radioGroup manifest entry")

const options = [
  { value: "crm", label: "客户资料" },
  { value: "orders", label: "订单权限" },
  { value: "messages", label: "消息通知" },
]

function RadioGroupPlaygroundPreview({ values }: { values: Record<string, string> }) {
  const disabled = values.state === "disabled" || values.state === "disabled-checked"
  const initialValue = values.state === "checked" || values.state === "disabled-checked" ? "crm" : ""
  const [selectedValue, setSelectedValue] = useState(initialValue)
  const size = values.size as RadioGroupItemSize
  const orientation = values.layout === "horizontal" ? "horizontal" : "vertical"

  return (
    <div className="flex justify-center">
      <FieldSet className={orientation === "horizontal" ? "w-80" : "w-fit"} data-disabled={disabled || undefined}>
        <FieldLegend className="sr-only">选择默认工作台</FieldLegend>
        <RadioGroup value={selectedValue} onValueChange={setSelectedValue}>
          <FieldGroup orientation={orientation}>
            {options.map((option) => {
              const id = `radio-group-playground-${option.value}`
              return (
                <Field key={option.value} orientation="horizontal">
                  <RadioGroupItem id={id} value={option.value} size={size} disabled={disabled} />
                  <FieldContent><FieldLabel htmlFor={id}>{option.label}</FieldLabel></FieldContent>
                </Field>
              )
            })}
          </FieldGroup>
        </RadioGroup>
      </FieldSet>
    </div>
  )
}

function buildRadioGroupCode(values: Record<string, string>) {
  const disabled = values.state === "disabled" || values.state === "disabled-checked" ? " disabled" : ""
  const size = values.size === "default" ? "" : ` size="${values.size}"`
  const orientation = values.layout === "horizontal" ? ' orientation="horizontal"' : ' orientation="vertical"'
  return `<FieldSet>\n  <FieldLegend className="sr-only">选择默认工作台</FieldLegend>\n  <RadioGroup value={value} onValueChange={setValue}>\n    <FieldGroup${orientation}>\n      {options.map((option) => <Field key={option.value} orientation="horizontal"><RadioGroupItem id={option.value} value={option.value}${size}${disabled} /><FieldContent><FieldLabel htmlFor={option.value}>{option.label}</FieldLabel></FieldContent></Field>)}\n    </FieldGroup>\n  </RadioGroup>\n</FieldSet>`
}

export const radioGroupPlaygroundConfig: ComponentPlaygroundConfig = {
  storySource: "docs/data/component-playgrounds.manifest.json#customPlaygrounds.radioGroup",
  props: componentPlaygroundPropsFromManifest(radioGroupManifest),
  initial: radioGroupManifest.initial,
  guidanceKey: radioGroupManifest.guidanceKey,
  previewItemsClassName: "flex w-full items-center justify-center",
  renderOne: (values) => <RadioGroupPlaygroundPreview key={`${values.size}-${values.layout}-${values.state}`} values={values} />,
  genCode: (values) => `import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"\nimport { Field, FieldContent, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field"\n\n${buildRadioGroupCode(values)}`,
}

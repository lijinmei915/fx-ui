import { useState } from "react"

import type { ComponentPlaygroundConfig } from "@/components/fx/component-playground"
import { Checkbox, type CheckboxSize } from "@/components/ui/checkbox"
import { Field, FieldContent, FieldGroup, FieldLabel } from "@/components/ui/field"
import componentPlaygroundsManifestRaw from "../../../../docs/data/component-playgrounds.manifest.json?raw"
import { componentPlaygroundPropsFromManifest, type ComponentPlaygroundsManifest } from "@/pages/docs/components/component-playground-manifest"

const componentPlaygroundsManifest = JSON.parse(componentPlaygroundsManifestRaw) as ComponentPlaygroundsManifest
const checkboxManifest = componentPlaygroundsManifest.customPlaygrounds?.checkbox

if (!checkboxManifest) throw new Error("Missing customPlaygrounds.checkbox manifest entry")

const optionLabels = ["客户资料", "订单权限", "消息通知"]

function CheckboxPlaygroundPreview({ values }: { values: Record<string, string> }) {
  const initiallyChecked = values.state === "checked" || values.state === "disabled-checked"
  const [singleChecked, setSingleChecked] = useState(initiallyChecked)
  const [groupValues, setGroupValues] = useState(() => new Set(initiallyChecked ? optionLabels : [optionLabels[0]]))
  const disabled = values.state === "disabled" || values.state === "disabled-checked"
  const size = values.size as CheckboxSize
  const groupOrientation = values.layout === "horizontal" ? "horizontal" : "vertical"
  const allGroupChecked = groupValues.size === optionLabels.length
  const groupIndeterminate = groupValues.size > 0 && !allGroupChecked

  const toggleGroup = (label: string) => setGroupValues((current) => {
    const next = new Set(current)
    next.has(label) ? next.delete(label) : next.add(label)
    return next
  })
  if (values.type === "single") {
    const indeterminate = values.state === "indeterminate"
    return (
      <Field className="w-fit" data-disabled={disabled || undefined} orientation="horizontal">
        <Checkbox
          id="checkbox-playground-single"
          checked={singleChecked}
          indeterminate={indeterminate}
          size={size}
          disabled={disabled}
          onCheckedChange={(checked) => setSingleChecked(checked === true)}
        />
        <FieldContent>
          <FieldLabel htmlFor="checkbox-playground-single">我已阅读并同意服务条款</FieldLabel>
        </FieldContent>
      </Field>
    )
  }

  if (values.type === "group") {
    return (
      <div className="flex w-full flex-col items-center gap-2">
        <FieldGroup className={groupOrientation === "horizontal" ? "w-80" : "!w-fit"} orientation={groupOrientation} data-disabled={disabled || undefined}>
          {optionLabels.map((label) => {
            const id = `checkbox-playground-group-${label}`
            return (
              <Field key={label} orientation="horizontal">
                <Checkbox id={id} checked={groupValues.has(label)} size={size} disabled={disabled} onCheckedChange={() => toggleGroup(label)} />
                <FieldContent><FieldLabel htmlFor={id}>{label}</FieldLabel></FieldContent>
              </Field>
            )
          })}
        </FieldGroup>
      </div>
    )
  }

  if (values.type === "check-all") {
    const parentId = "checkbox-playground-check-all"
    return (
      <div className="flex w-full flex-col items-center gap-2">
        <FieldGroup className={groupOrientation === "horizontal" ? "w-80" : "!w-fit"} data-disabled={disabled || undefined}>
          <Field orientation="horizontal">
            <Checkbox id={parentId} checked={allGroupChecked} indeterminate={groupIndeterminate} size={size} disabled={disabled} onCheckedChange={() => setGroupValues(allGroupChecked ? new Set() : new Set(optionLabels))} />
            <FieldContent><FieldLabel htmlFor={parentId}>全选</FieldLabel></FieldContent>
          </Field>
          <FieldGroup orientation={groupOrientation}>
            {optionLabels.map((label) => {
              const id = `checkbox-playground-check-all-${label}`
              return <Field key={label} orientation="horizontal"><Checkbox id={id} checked={groupValues.has(label)} size={size} disabled={disabled} onCheckedChange={() => toggleGroup(label)} /><FieldContent><FieldLabel htmlFor={id}>{label}</FieldLabel></FieldContent></Field>
            })}
          </FieldGroup>
        </FieldGroup>
      </div>
    )
  }

  return null
}

function buildCheckboxCode(values: Record<string, string>) {
  const disabled = values.state === "disabled" || values.state === "disabled-checked" ? " disabled" : ""
  const size = values.size === "default" ? "" : ` size="${values.size}"`
  const orientation = values.layout === "horizontal" ? ' orientation="horizontal"' : ' orientation="vertical"'
  if (values.type === "single") return `<Field>\n  <Checkbox id="agree" checked={checked} onCheckedChange={setChecked}${size}${values.state === "indeterminate" ? " indeterminate" : ""}${disabled} />\n  <FieldContent>\n    <FieldLabel htmlFor="agree">我已阅读并同意服务条款</FieldLabel>\n  </FieldContent>\n</Field>`
  if (values.type === "group") return `<FieldGroup${orientation}>\n  {options.map((option) => <Field key={option.value} orientation="horizontal"><Checkbox id={option.value} checked={values.includes(option.value)} onCheckedChange={() => toggle(option.value)}${size}${disabled} /><FieldContent><FieldLabel htmlFor={option.value}>{option.label}</FieldLabel></FieldContent></Field>)}\n</FieldGroup>`
  if (values.type === "check-all") return `<FieldGroup>\n  <Field orientation="horizontal"><Checkbox checked={allChecked} indeterminate={someChecked && !allChecked} onCheckedChange={toggleAll}${size}${disabled} /><FieldContent><FieldLabel>全选</FieldLabel></FieldContent></Field>\n  <FieldGroup${orientation}>{options.map((option) => <Field key={option.value} orientation="horizontal"><Checkbox checked={values.includes(option.value)} onCheckedChange={() => toggle(option.value)}${size}${disabled} /><FieldContent><FieldLabel>{option.label}</FieldLabel></FieldContent></Field>)}</FieldGroup>\n</FieldGroup>`
  return ""
}

export const checkboxPlaygroundConfig: ComponentPlaygroundConfig = {
  storySource: "docs/data/component-playgrounds.manifest.json#customPlaygrounds.checkbox",
  props: componentPlaygroundPropsFromManifest(checkboxManifest),
  initial: checkboxManifest.initial,
  guidanceKey: checkboxManifest.guidanceKey,
  previewItemsClassName: "flex w-full items-center justify-center",
  renderOne: (values) => <CheckboxPlaygroundPreview key={`${values.type}-${values.state}`} values={values} />,
  genCode: (values) => `import { Checkbox } from "@/components/ui/checkbox"\nimport { Field, FieldContent, FieldGroup, FieldLabel } from "@/components/ui/field"\n\n${buildCheckboxCode(values)}`,
}

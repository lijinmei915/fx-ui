import { useEffect, useState } from "react"

import type { ComponentPlaygroundConfig } from "@/components/fx/component-playground"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"
import type { SwitchSize } from "@/components/ui/switch"
import { CheckIcon, XIcon } from "@/lib/icons"
import componentPlaygroundsManifestRaw from "../../../../docs/data/component-playgrounds.manifest.json?raw"
import { componentPlaygroundPropsFromManifest, type ComponentPlaygroundsManifest } from "@/pages/docs/components/component-playground-manifest"

const manifest = JSON.parse(componentPlaygroundsManifestRaw) as ComponentPlaygroundsManifest
const switchManifest = manifest.customPlaygrounds?.switch

if (!switchManifest) throw new Error("Missing customPlaygrounds.switch manifest entry")

function SwitchPlaygroundPreview({ values }: { values: Record<string, string> }) {
  const [checked, setChecked] = useState(values.checked === "on")
  const loading = values.state === "loading"
  const disabled = values.state === "disabled"
  const size = values.size as SwitchSize
  const contentType = values.type === "icon" && size === "micro" ? "default" : values.type

  useEffect(() => {
    setChecked(values.checked === "on")
  }, [values.checked])

  const checkedChildren = contentType === "text" ? "开" : contentType === "icon" ? <CheckIcon /> : undefined
  const unCheckedChildren = contentType === "text" ? "关" : contentType === "icon" ? <XIcon /> : undefined

  return (
    <Field orientation="horizontal" data-disabled={disabled || undefined}>
      <Switch
        id="switch-playground-control"
        size={size}
        checked={checked}
        onCheckedChange={setChecked}
        disabled={disabled}
        loading={loading}
        checkedChildren={checkedChildren}
        unCheckedChildren={unCheckedChildren}
      />
      <FieldContent>
        <FieldLabel htmlFor="switch-playground-control">接收消息通知</FieldLabel>
      </FieldContent>
    </Field>
  )
}

function buildSwitchCode(values: Record<string, string>) {
  const props = [
    values.size !== "small" ? `size="${values.size}"` : "",
    "checked={enabled}",
    values.state === "disabled" ? "disabled" : "",
    values.state === "loading" ? "loading" : "",
    values.type === "text" ? 'checkedChildren="开" unCheckedChildren="关"' : "",
    values.type === "icon" ? "checkedChildren={<CheckIcon />} unCheckedChildren={<XIcon />}" : "",
  ].filter(Boolean).join(" ")

  return `<Field orientation="horizontal">\n  <Switch id="notify" onCheckedChange={setEnabled}${props ? ` ${props}` : ""} />\n  <FieldContent><FieldLabel htmlFor="notify">接收消息通知</FieldLabel></FieldContent>\n</Field>`
}

export const switchPlaygroundConfig: ComponentPlaygroundConfig = {
  storySource: "docs/data/component-playgrounds.manifest.json#customPlaygrounds.switch",
  props: componentPlaygroundPropsFromManifest(switchManifest),
  initial: switchManifest.initial,
  guidanceKey: switchManifest.guidanceKey,
  previewItemsClassName: "flex w-full items-center justify-center",
  renderOne: (values) => <SwitchPlaygroundPreview values={values} />,
  genCode: (values) => `${values.type === "icon" ? 'import { CheckIcon, XIcon } from "@/lib/icons"\n' : ""}import { Switch } from "@/components/ui/switch"\nimport { Field, FieldContent, FieldLabel } from "@/components/ui/field"\n\n${buildSwitchCode(values)}`,
}

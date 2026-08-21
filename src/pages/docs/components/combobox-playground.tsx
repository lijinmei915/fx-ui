import { useEffect, useState } from "react"

import { type ComponentPlaygroundConfig } from "@/components/fx/component-playground"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import {
  componentPlaygroundPropsFromManifest,
  type ComponentPlaygroundsManifest,
} from "@/pages/docs/components/component-playground-manifest"
import componentPlaygroundsManifestRaw from "../../../../docs/data/component-playgrounds.manifest.json?raw"

const frameworks = ["React", "Vue", "Svelte", "Angular", "Solid"]
const manifest = JSON.parse(componentPlaygroundsManifestRaw) as ComponentPlaygroundsManifest
const comboboxManifest = manifest.components.combobox

function ComboboxPlaygroundPreview({ values }: { values: Record<string, string> }) {
  const multiple = values.selection === "multiple"
  const disabled = values.semanticState === "disabled"
  const items = values.dataState === "empty" ? [] : frameworks
  const [singleValue, setSingleValue] = useState<string | null>("React")
  const [multipleValue, setMultipleValue] = useState<string[]>(["React", "Vue"])
  const anchor = useComboboxAnchor()

  useEffect(() => {
    setSingleValue(values.dataState === "empty" ? null : "React")
    setMultipleValue(values.dataState === "empty" ? [] : ["React", "Vue"])
  }, [values.dataState, values.selection])

  if (multiple) {
    return (
      <Combobox key={`multiple-${values.dataState}`} multiple items={items} value={multipleValue} onValueChange={setMultipleValue} disabled={disabled}>
        <ComboboxChips ref={anchor} className="w-[360px]">
          {multipleValue.map((item) => <ComboboxChip key={item}>{item}</ComboboxChip>)}
          <ComboboxChipsInput placeholder="搜索并选择框架" disabled={disabled} />
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty>无匹配结果</ComboboxEmpty>
          <ComboboxList>{(item: string) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}</ComboboxList>
        </ComboboxContent>
      </Combobox>
    )
  }

  return (
    <Combobox key={`single-${values.dataState}`} items={items} value={singleValue} onValueChange={setSingleValue} disabled={disabled}>
      <ComboboxInput className="w-[320px]" placeholder="搜索框架" showClear={values.clearable === "true"} disabled={disabled} />
      <ComboboxContent>
        <ComboboxEmpty>无匹配结果</ComboboxEmpty>
        <ComboboxList>{(item: string) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}</ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

function buildComboboxCode(values: Record<string, string>) {
  const multiple = values.selection === "multiple"
  const disabled = values.semanticState === "disabled" ? " disabled" : ""
  const clearable = values.clearable === "true" && !multiple ? " showClear" : ""
  if (multiple) {
    return `import { Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxContent, ComboboxEmpty, ComboboxItem, ComboboxList, useComboboxAnchor } from "@/components/ui/combobox"\n\nconst anchor = useComboboxAnchor()\n\n<Combobox multiple items={items} value={value} onValueChange={setValue}${disabled}>\n  <ComboboxChips ref={anchor}>\n    {value.map((item) => <ComboboxChip key={item}>{item}</ComboboxChip>)}\n    <ComboboxChipsInput placeholder="搜索并选择" />\n  </ComboboxChips>\n  <ComboboxContent anchor={anchor}>\n    <ComboboxEmpty>无匹配结果</ComboboxEmpty>\n    <ComboboxList>{(item) => <ComboboxItem value={item}>{item}</ComboboxItem>}</ComboboxList>\n  </ComboboxContent>\n</Combobox>`
  }
  return `import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox"\n\n<Combobox items={items} value={value} onValueChange={setValue}${disabled}>\n  <ComboboxInput placeholder="搜索"${clearable} />\n  <ComboboxContent>\n    <ComboboxEmpty>无匹配结果</ComboboxEmpty>\n    <ComboboxList>{(item) => <ComboboxItem value={item}>{item}</ComboboxItem>}</ComboboxList>\n  </ComboboxContent>\n</Combobox>`
}

export const comboboxPlaygroundConfig: ComponentPlaygroundConfig = {
  storySource: "docs/data/component-playgrounds.manifest.json#components.combobox",
  props: componentPlaygroundPropsFromManifest(comboboxManifest),
  initial: comboboxManifest.initial,
  guidanceKey: comboboxManifest.guidanceKey,
  previewItemsClassName: "flex w-full items-center justify-center",
  onValueChange: (next, key) => key === "selection" && next.selection === "multiple" ? { ...next, clearable: "false" } : next,
  renderOne: (values) => <ComboboxPlaygroundPreview values={values} />,
  genCode: buildComboboxCode,
}

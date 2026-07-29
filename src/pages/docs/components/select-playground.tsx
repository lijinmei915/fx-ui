import { SelectPlaygroundPreview } from "@/pages/docs/components/select-playground-preview"
import componentPlaygroundsManifestRaw from "../../../../docs/data/component-playgrounds.manifest.json?raw"
import {
  componentPlaygroundStoriesFromManifest,
  componentPlaygroundPropsFromManifest,
  type ComponentPlaygroundsManifest,
} from "@/pages/docs/components/component-playground-manifest"
import type { ComponentPlaygroundConfig } from "@/components/fx/component-playground"

const manifest = JSON.parse(componentPlaygroundsManifestRaw) as ComponentPlaygroundsManifest
const selectManifest = manifest.components.select

const selectImportCode = `import {
  Select,
  SelectClear,
  SelectControl,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemIndicator,
  SelectLabel,
  SelectMultiValue,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"`

function buildSelectPlaygroundCode(values: Record<string, string>) {
  const isMultiple = values.selection === "multiple"
  const hasOtherInput = values.structure === "other" && values.otherInput !== "none"
  const isOtherRequired = values.otherInput === "required"
  const sizeProp = values.size === "sm" ? "" : ` size="${values.size}"`
  const variantProp = values.variant === "borderless" ? ' variant="borderless"' : ""
  const multipleProp = isMultiple ? " multiple" : ""
  const disabledProp = values.semanticState === "disabled" ? " disabled" : ""
  const invalidProp = values.semanticState === "invalid" ? " aria-invalid" : ""
  const placeholder = values.variant === "borderless" ? "全部角色" : "请选择角色"
  const extraImports = values.search === "local" || hasOtherInput ? `\nimport { Input } from "@/components/ui/input"\nimport { Field, FieldError } from "@/components/ui/field"` : ""
  const valueType = isMultiple ? "string[]" : "string | null"
  const emptyValue = isMultiple ? "[]" : "null"
  const valueNode = isMultiple
    ? `    <SelectValue placeholder="${placeholder}">
      {(current: string[]) => current.length ? <SelectMultiValue items={current.map((item) => ({ value: item, label: roleLabels[item] }))} onRemove={(item) => setValue(current.filter((value) => value !== item))} /> : "${placeholder}"}
    </SelectValue>`
    : `    <SelectValue placeholder="${placeholder}" />`
  const searchNode = values.search === "local" ? `    <div className="p-1"><Input size="xs" placeholder="搜索选项" value={query} onChange={(event) => setQuery(event.target.value)} /></div>
    {!['管理员', '成员'${isMultiple ? ", '审计员', '访客'" : ""}].some(matches) ? <div className="px-2 py-6 text-center text-sm text-muted-foreground">无匹配结果</div> : null}
` : ""
  const match = (label: string, content: string) => values.search === "local" ? `{matches("${label}") ? ${content} : null}` : content
  const indicator = isMultiple ? "<SelectItemIndicator />" : ""
  const options = values.structure === "description"
    ? `${match("管理员 拥有全部管理权限", `<SelectItem value="admin">${indicator}<span className="flex flex-col"><span>管理员</span><span className="text-xs text-muted-foreground">拥有全部管理权限</span></span></SelectItem>`)}
    ${match("成员 拥有基础使用权限", `<SelectItem value="member">${indicator}<span className="flex flex-col"><span>成员</span><span className="text-xs text-muted-foreground">拥有基础使用权限</span></span></SelectItem>`)}`
    : `${match("管理员", `<SelectItem value="admin">${indicator}管理员</SelectItem>`)}
    ${match("成员", `<SelectItem value="member"${values.structure === "disabled" ? " disabled" : ""}>${indicator}成员</SelectItem>`)}${isMultiple ? `
    ${match("审计员", `<SelectItem value="auditor"><SelectItemIndicator />审计员</SelectItem>`)}
    ${match("访客", `<SelectItem value="guest"><SelectItemIndicator />访客</SelectItem>`)}` : ""}${hasOtherInput ? `
    <SelectItem value="other">其他</SelectItem>` : ""}`
  const wrappedOptions = values.structure === "grouped" ? `    <SelectGroup>\n      <SelectLabel>常用</SelectLabel>\n      ${options}\n    </SelectGroup>` : `    ${options}`
  const otherNode = hasOtherInput ? `\n    {value === "other" ? <Field data-invalid={${isOtherRequired} || undefined} className="gap-1 px-2 pt-1 pb-2"><Input size="${values.size}" placeholder="${isOtherRequired ? "请输入（必填）" : "请输入（选填）"}" aria-invalid={${isOtherRequired} || undefined} />${isOtherRequired ? "<FieldError>请输入具体内容</FieldError>" : ""}</Field> : null}` : ""
  const clearable = values.clearable === "true"
  const controlStart = clearable ? `  <SelectControl className="w-[280px]">\n` : ""
  const controlEnd = clearable ? `\n    {value${isMultiple ? ".length" : ""} ? <SelectClear aria-label="清除选择" onClick={() => setValue(${emptyValue})} /> : null}\n  </SelectControl>` : ""
  const triggerClass = clearable ? ' className="w-full"' : ' className="w-[280px]"'

  return `${selectImportCode}${extraImports}\nimport { useState } from "react"\n\n${values.search === "local" ? `const [query, setQuery] = useState("")\nconst matches = (label: string) => label.includes(query.trim())\n` : ""}const [value, setValue] = useState<${valueType}>(${emptyValue})
${isMultiple ? 'const roleLabels: Record<string, string> = { admin: "管理员", member: "成员", auditor: "审计员", guest: "访客" }\n' : ""}
<Select${multipleProp} value={value} onValueChange={setValue}${disabledProp}>
${controlStart}  <SelectTrigger${sizeProp}${variantProp}${invalidProp}${isMultiple ? " render={<div />} nativeButton={false}" : ""}${clearable ? " clearable" : ""}${triggerClass}>
${valueNode}
  </SelectTrigger>${controlEnd}
  <SelectContent${sizeProp}>
${searchNode}${wrappedOptions}${otherNode}
  </SelectContent>
</Select>`
}

export const selectPlaygroundConfig: ComponentPlaygroundConfig = {
  storySource: "docs/data/component-playgrounds.manifest.json#components.select",
  props: componentPlaygroundPropsFromManifest(selectManifest),
  initial: selectManifest.initial,
  stories: componentPlaygroundStoriesFromManifest(selectManifest),
  guidanceKey: selectManifest.guidanceKey,
  onValueChange: (next: Record<string, string>, key: string) => {
    if (key === "structure" && next.structure !== "other") return { ...next, otherInput: "none" }
    if (key === "structure" && next.structure === "other") return { ...next, selection: "single", otherInput: next.otherInput === "none" ? "optional" : next.otherInput }
    if (key === "otherInput" && next.otherInput !== "none") return { ...next, structure: "other", selection: "single" }
    if (key === "otherInput" && next.otherInput === "none") return { ...next, structure: next.structure === "other" ? "plain" : next.structure }
    if (key === "selection" && next.selection === "multiple") return { ...next, structure: next.structure === "other" ? "plain" : next.structure, variant: "outline", otherInput: "none" }
    return next
  },
  renderOne: (values: Record<string, string>) => <SelectPlaygroundPreview values={values} />,
  genCode: buildSelectPlaygroundCode,
}

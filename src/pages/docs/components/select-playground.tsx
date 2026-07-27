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
const selectExtraImportCode = `import { Input } from "@/components/ui/input"
import { Field, FieldError } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { useState } from "react"`

function buildSelectPlaygroundCode(values: Record<string, string>) {
  const sizeProp = values.size === "sm" ? "" : ` size="${values.size}"`
  const contentSizeProp = values.size === "sm" ? "" : ` size="${values.size}"`
  const variantProp = values.variant === "borderless" ? ` variant="borderless"` : ""
  const placeholder = values.variant === "borderless" ? "全部角色" : "请选择角色"
  const isMultiple = values.selection === "multiple"
  const hasOtherInput = values.structure === "other" && values.otherInput !== "none"
  const isOtherRequired = values.otherInput === "required"
  const selectedValue = "admin"
  const secondValue = "member"
  const defaultValueProp = values.valueState === "selected"
    ? isMultiple
      ? ` defaultValue={["${selectedValue}", "${secondValue}", "auditor", "guest"]}`
      : ` defaultValue="${selectedValue}"`
    : ""
  const multipleProp = isMultiple ? " multiple" : ""
  const controlled = isMultiple || (values.clearable === "true" && values.valueState === "selected")
  const valueSetup = controlled
    ? `const [value, setValue] = useState${isMultiple ? `<string[]>(${values.valueState === "selected" ? `["${selectedValue}", "${secondValue}", "auditor", "guest"]` : "[]"})` : `<string | null>("${selectedValue}")`}\n\n`
    : ""
  const valueProps = controlled ? " value={value} onValueChange={setValue}" : defaultValueProp
  const disabledProp = values.semanticState === "disabled" ? " disabled" : ""
  const invalidProp = values.semanticState === "invalid" ? " aria-invalid" : ""
  const initialQuery = values.feedbackState === "empty" ? "不存在" : values.feedbackState === "searching" ? "管理" : ""
  const searchSetup = values.search === "local" ? `const [query, setQuery] = useState("${initialQuery}")
const matches = (label: string) => label.includes(query.trim())

` : ""
  const searchLine = values.search === "local" ? `    <div className="p-1">
      <Input
        size="xs"
        placeholder="搜索选项"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => event.stopPropagation()}
      />
    </div>
` : ""
  const emptyLine = values.search === "local" ? `    {!['管理员', '成员'${isMultiple ? ", '审计员', '访客'" : ""}].some(matches) ? (
      <div className="px-2 py-6 text-center text-sm text-muted-foreground">无匹配结果</div>
    ) : null}
` : ""
  const loadingLine = values.feedbackState === "loading" ? `    <div className="flex items-center gap-2 px-2 py-3 text-sm text-muted-foreground">
      <Spinner className="size-4" />
      正在加载
    </div>
` : ""
  const clearLine = values.clearable === "true" && values.valueState === "selected"
    ? `
    <SelectClear aria-label="清除选择" onClick={() => setValue(${isMultiple ? "[]" : "null"})} />`
    : ""
  const triggerWrapStart = values.clearable === "true" && values.valueState === "selected"
    ? `  <SelectControl${values.variant === "borderless" ? "" : ` className="w-[200px]"`}>
`
    : ""
  const triggerWrapEnd = values.clearable === "true" && values.valueState === "selected"
    ? `
${clearLine}
  </SelectControl>`
    : ""
  const indicator = isMultiple ? "<SelectItemIndicator />" : ""
  const itemA = `${values.search === "local" ? `{matches("管理员") ? ` : ""}<SelectItem value="${selectedValue}">${indicator}管理员</SelectItem>${values.search === "local" ? " : null}" : ""}`
  const itemB = `${values.search === "local" ? `{matches("成员") ? ` : ""}<SelectItem value="${secondValue}"${values.structure === "disabled" ? " disabled" : ""}>${indicator}成员</SelectItem>${values.search === "local" ? " : null}" : ""}`
  const extraItems = isMultiple ? `
    ${values.search === "local" ? `{matches("审计员") ? ` : ""}<SelectItem value="auditor"><SelectItemIndicator />审计员</SelectItem>${values.search === "local" ? " : null}" : ""}
    ${values.search === "local" ? `{matches("访客") ? ` : ""}<SelectItem value="guest"><SelectItemIndicator />访客</SelectItem>${values.search === "local" ? " : null}" : ""}` : ""
  const itemDescriptionA = `<SelectItem value="${selectedValue}">
      ${isMultiple ? "<SelectItemIndicator />\n      " : ""}<span className="flex flex-col">
        <span>管理员</span>
        <span className="text-xs text-muted-foreground">拥有全部管理权限</span>
      </span>
    </SelectItem>`
  const itemDescriptionB = `<SelectItem value="${secondValue}">
      ${isMultiple ? "<SelectItemIndicator />\n      " : ""}<span className="flex flex-col">
        <span>成员</span>
        <span className="text-xs text-muted-foreground">拥有基础使用权限</span>
      </span>
    </SelectItem>`
  const itemLines = values.feedbackState === "loading"
    ? ""
    : values.structure === "description"
      ? `    ${itemDescriptionA}
    ${itemDescriptionB}`
      : `    ${itemA}
    ${itemB}${extraItems}`
  const valueLine = isMultiple
    ? `    <SelectValue placeholder="${placeholder}">
      {(value: string[]) => value?.length ? (
        <SelectMultiValue
          items={value.map((item) => ({ value: item, label: roleLabels[item] }))}
          maxVisible={2}
          onRemove={(item) => setValue(value.filter((current) => current !== item))}
        />
      ) : "${placeholder}"}
    </SelectValue>`
    : `    <SelectValue placeholder="${placeholder}" />`

  if (hasOtherInput) {
    return `${searchSetup}const [value, setValue] = useState<string | null>(${values.valueState === "selected" ? `"other"` : "null"})
const [otherValue, setOtherValue] = useState(${values.valueState === "selected" && !isOtherRequired ? `"选项n"` : `""`})
const [open, setOpen] = useState(false)
const otherInvalid = value === "other" && ${isOtherRequired ? "!otherValue.trim()" : "false"}

<Select
  value={value}
  onValueChange={(next) => {
    setValue(next)
    if (next === "other") setOpen(true)
  }}
  open={open}
  onOpenChange={setOpen}
>
  <SelectTrigger${sizeProp}${variantProp} aria-invalid={otherInvalid || undefined}${values.variant === "borderless" ? "" : ` className="w-[200px]"`}>
    <SelectValue placeholder="${placeholder}">
      {(current) =>
        current === "other" && otherValue ? otherValue :
        current === "other" ? "其他" :
        current === "${selectedValue}" ? "管理员" :
        current === "${secondValue}" ? "成员" :
        undefined}
    </SelectValue>
  </SelectTrigger>
  <SelectContent${contentSizeProp}>
    <SelectItem value="${selectedValue}">管理员</SelectItem>
    <SelectItem value="${secondValue}">成员</SelectItem>
    <SelectItem value="other">其他</SelectItem>
    {value === "other" ? (
      <Field data-invalid={otherInvalid || undefined} className="gap-1 px-2 pt-1 pb-2">
        <Input
          size="${values.size === "sm" ? "sm" : values.size}"
          value={otherValue}
          onChange={(event) => setOtherValue(event.target.value)}
          placeholder="${isOtherRequired ? "请输入（必填）" : "请输入（选填）"}"
          aria-invalid={otherInvalid || undefined}
          onKeyDown={(event) => event.stopPropagation()}
        />
        {otherInvalid ? <FieldError>请输入具体内容</FieldError> : null}
      </Field>
    ) : null}
  </SelectContent>
</Select>`
  }

  if (values.structure === "grouped") {
    return `${searchSetup}${isMultiple ? `const roleLabels: Record<string, string> = { admin: "管理员", member: "成员", auditor: "审计员", guest: "访客" }\n\n` : ""}${valueSetup}<Select${multipleProp}${valueProps}${disabledProp}>
${triggerWrapStart}  <SelectTrigger${sizeProp}${variantProp}${invalidProp}${isMultiple ? ` render={<div />} nativeButton={false}` : ""}${values.clearable === "true" && values.valueState === "selected" ? " clearable" : ""}${values.clearable === "true" && values.valueState === "selected" && values.variant !== "borderless" ? ` className="w-full"` : ""}>
${valueLine}
  </SelectTrigger>${triggerWrapEnd}
  <SelectContent${contentSizeProp}>
${searchLine}${emptyLine}${loadingLine}
    <SelectGroup>
      <SelectLabel>常用</SelectLabel>
      ${values.feedbackState === "loading" ? "" : `${itemA}
      ${itemB}${extraItems}`}
    </SelectGroup>
  </SelectContent>
</Select>`
  }

  return `${searchSetup}${isMultiple ? `const roleLabels: Record<string, string> = { admin: "管理员", member: "成员", auditor: "审计员", guest: "访客" }\n\n` : ""}${valueSetup}<Select${multipleProp}${valueProps}${disabledProp}>
${triggerWrapStart}  <SelectTrigger${sizeProp}${variantProp}${invalidProp}${isMultiple ? ` render={<div />} nativeButton={false}` : ""}${values.clearable === "true" && values.valueState === "selected" ? " clearable" : ""}${values.clearable === "true" && values.valueState === "selected" && values.variant !== "borderless" ? ` className="w-full"` : ""}>
${valueLine}
  </SelectTrigger>${triggerWrapEnd}
  <SelectContent${contentSizeProp}>
${searchLine}${emptyLine}${loadingLine}${itemLines}
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
    if (key === "semanticState" && next.semanticState === "invalid") return { ...next, valueState: "placeholder" }
    if (key === "feedbackState" && (next.feedbackState === "searching" || next.feedbackState === "empty")) return { ...next, search: "local", interactionState: "open" }
    if (key === "interactionState" && next.interactionState === "open") return { ...next, valueState: "selected" }
    if (key === "clearable" && next.clearable === "true") return { ...next, valueState: "selected" }
    if (key === "structure" && next.structure !== "other") return { ...next, otherInput: "none" }
    if (key === "structure" && next.structure === "other") return { ...next, selection: "single", otherInput: next.otherInput === "none" ? "optional" : next.otherInput, valueState: "selected", interactionState: "open" }
    if (key === "otherInput" && next.otherInput !== "none") return { ...next, structure: "other", selection: "single", valueState: "selected", interactionState: "open" }
    if (key === "otherInput" && next.otherInput === "none") return { ...next, structure: next.structure === "other" ? "plain" : next.structure }
    if (key === "selection" && next.selection === "multiple") return { ...next, structure: next.structure === "other" ? "plain" : next.structure, otherInput: "none" }
    return next
  },
  renderOne: (values: Record<string, string>) => <SelectPlaygroundPreview values={values} />,
  genCode: (values: Record<string, string>) => {
    const needsExtraImports = values.selection === "multiple" || values.search === "local" || values.clearable === "true" || values.feedbackState === "loading" || values.otherInput !== "none"
    return `${selectImportCode}${needsExtraImports ? `\n${selectExtraImportCode}` : ""}\n\n${buildSelectPlaygroundCode(values)}`
  },
}

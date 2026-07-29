import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Field, FieldError } from "@/components/ui/field"
import { Select, SelectClear, SelectContent, SelectControl, SelectGroup, SelectItem, SelectItemIndicator, SelectLabel, SelectMultiValue, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SelectPlaygroundPreview({ values }: { values: Record<string, string> }) {
  const size = values.size as "xs" | "sm" | "md"
  const variant = values.variant === "borderless" ? "borderless" : "outline"
  const isMultiple = values.selection === "multiple"
  const hasOtherInput = values.structure === "other" && values.otherInput !== "none"
  const isOtherRequired = values.otherInput === "required"
  const disabled = values.semanticState === "disabled"
  const invalid = values.semanticState === "invalid"
  const placeholder = variant === "borderless" ? "全部角色" : "请选择角色"
  const [previewValue, setPreviewValue] = useState<string | string[] | null>(null)
  const [otherValue, setOtherValue] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    setPreviewValue(isMultiple ? [] : null)
    setOtherValue("")
    setSearchQuery("")
  }, [isMultiple, hasOtherInput, values.structure])

  const normalizedQuery = searchQuery.trim().toLocaleLowerCase()
  const matchesQuery = (label: string) => !normalizedQuery || label.toLocaleLowerCase().includes(normalizedQuery)
  const hasVisibleOption = values.structure === "description"
    ? matchesQuery("管理员 拥有全部管理权限") || matchesQuery("成员 拥有基础使用权限")
    : matchesQuery("管理员") || matchesQuery("成员") || (isMultiple && (matchesQuery("审计员") || matchesQuery("访客"))) || (hasOtherInput && matchesQuery("其他"))
  const hasPreviewValue = Array.isArray(previewValue) ? previewValue.length > 0 : previewValue != null
  const otherInputInvalid = hasOtherInput && isOtherRequired && previewValue === "other" && !otherValue.trim()
  const labelByValue: Record<string, string> = {
    admin: "管理员",
    member: "成员",
    auditor: "审计员",
    guest: "访客",
    other: otherValue || "其他",
  }
  const indicator = isMultiple ? <SelectItemIndicator /> : null
  const optionItems = values.structure === "description" ? (
    <>
      {matchesQuery("管理员 拥有全部管理权限") ? <SelectItem value="admin">{indicator}<span className="flex flex-col"><span>管理员</span><span className="text-xs text-muted-foreground">拥有全部管理权限</span></span></SelectItem> : null}
      {matchesQuery("成员 拥有基础使用权限") ? <SelectItem value="member">{indicator}<span className="flex flex-col"><span>成员</span><span className="text-xs text-muted-foreground">拥有基础使用权限</span></span></SelectItem> : null}
    </>
  ) : (
    <>
      {matchesQuery("管理员") ? <SelectItem value="admin">{indicator}管理员</SelectItem> : null}
      {matchesQuery("成员") ? <SelectItem value="member" disabled={values.structure === "disabled"}>{indicator}成员</SelectItem> : null}
      {isMultiple && matchesQuery("审计员") ? <SelectItem value="auditor">{indicator}审计员</SelectItem> : null}
      {isMultiple && matchesQuery("访客") ? <SelectItem value="guest">{indicator}访客</SelectItem> : null}
      {hasOtherInput && matchesQuery("其他") ? <SelectItem value="other">其他</SelectItem> : null}
    </>
  )
  const valueNode = isMultiple ? (
    <SelectValue placeholder={placeholder}>
      {(value: string[]) => value?.length ? <SelectMultiValue items={value.map((item) => ({ value: item, label: labelByValue[item] ?? item }))} onRemove={(item) => setPreviewValue(value.filter((current) => current !== item))} /> : placeholder}
    </SelectValue>
  ) : (
    <SelectValue placeholder={placeholder}>
      {(value: string | null) => value ? labelByValue[value] ?? value : placeholder}
    </SelectValue>
  )
  const selectChildren = (
    <>
      <SelectControl className="w-[280px]">
        <SelectTrigger size={size} variant={variant} render={isMultiple ? <div /> : undefined} nativeButton={isMultiple ? false : undefined} clearable={values.clearable === "true" && hasPreviewValue} aria-invalid={invalid || otherInputInvalid ? true : undefined} className="w-full">
          {valueNode}
        </SelectTrigger>
        {values.clearable === "true" && hasPreviewValue ? <SelectClear aria-label="清除选择" onClick={(event) => { event.stopPropagation(); setPreviewValue(isMultiple ? [] : null) }} /> : null}
      </SelectControl>
      <SelectContent size={size}>
        {values.search === "local" ? <div className="p-1"><Input size="xs" placeholder="搜索选项" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} onKeyDown={(event) => event.stopPropagation()} /></div> : null}
        {values.search === "local" && !hasVisibleOption ? <div className="px-2 py-6 text-center text-sm text-muted-foreground">无匹配结果</div> : null}
        {values.structure === "grouped" ? <SelectGroup><SelectLabel>常用</SelectLabel>{optionItems}</SelectGroup> : optionItems}
        {hasOtherInput && previewValue === "other" ? <Field data-invalid={otherInputInvalid || undefined} className="gap-1 px-2 pt-1 pb-2"><Input size={size} value={otherValue} onChange={(event) => setOtherValue(event.target.value)} placeholder={isOtherRequired ? "请输入（必填）" : "请输入（选填）"} aria-invalid={otherInputInvalid || undefined} onKeyDown={(event) => event.stopPropagation()} />{otherInputInvalid ? <FieldError>请输入具体内容</FieldError> : null}</Field> : null}
      </SelectContent>
    </>
  )
  const select = isMultiple ? <Select multiple value={Array.isArray(previewValue) ? previewValue : []} onValueChange={setPreviewValue} disabled={disabled}>{selectChildren}</Select> : <Select value={typeof previewValue === "string" ? previewValue : null} onValueChange={setPreviewValue} disabled={disabled}>{selectChildren}</Select>

  if (!invalid) return <div className="w-[280px]">{select}</div>
  return <Field data-invalid className={cn("w-[280px]")}><div>{select}</div><FieldError>请选择一个选项</FieldError></Field>
}

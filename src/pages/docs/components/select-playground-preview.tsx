import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Field, FieldError } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { Select, SelectClear, SelectContent, SelectControl, SelectGroup, SelectItem, SelectItemIndicator, SelectLabel, SelectMultiValue, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SelectPlaygroundPreview({ values }: { values: Record<string, string> }) {
  const size = values.size as "xs" | "sm" | "md";
  const variant = values.variant === "borderless" ? "borderless" : "outline";
  const selectedValue = "admin";
  const secondValue = "member";
  const placeholder = variant === "borderless" ? "全部角色" : "请选择角色";
  const isMultiple = values.selection === "multiple";
  const hasOtherInput = values.structure === "other" && values.otherInput !== "none";
  const isOtherRequired = values.otherInput === "required";
  const hasValue = values.valueState === "selected";
  const [previewValue, setPreviewValue] = useState<string | string[] | null>(null);
  const [otherValue, setOtherValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const disabled = values.semanticState === "disabled";
  const invalid = values.semanticState === "invalid";
  const open = values.interactionState === "open" || values.feedbackState === "searching" || values.feedbackState === "empty" || values.feedbackState === "loading" || hasOtherInput;
  const visualState = (values.interactionState === "hover" || values.interactionState === "focus" || values.interactionState === "open" ? values.interactionState : undefined) as "hover" | "focus" | "open" | undefined;
  const showSearch = values.search === "local";
  const showLoading = values.feedbackState === "loading";
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase();
  const matchesQuery = (label: string) => !normalizedQuery || label.toLocaleLowerCase().includes(normalizedQuery);
  const multipleIndicator = () => isMultiple ? <SelectItemIndicator /> : null;
  const itemA = matchesQuery("管理员") ? <SelectItem value={selectedValue}>{multipleIndicator()}管理员</SelectItem> : null;
  const itemB = matchesQuery("成员") ? <SelectItem value={secondValue} disabled={values.structure === "disabled"}>{multipleIndicator()}成员</SelectItem> : null;
  const extraItems = isMultiple ? (
    <>
      {matchesQuery("审计员") ? <SelectItem value="auditor">{multipleIndicator()}审计员</SelectItem> : null}
      {matchesQuery("访客") ? <SelectItem value="guest">{multipleIndicator()}访客</SelectItem> : null}
    </>) : null;
  const labelByValue: Record<string, string> = {
    [selectedValue]: "管理员",
    [secondValue]: "成员",
    auditor: "审计员",
    guest: "访客",
    other: otherValue || "其他"
  };
  const selectValueNode = isMultiple ? (
    <SelectValue placeholder={placeholder}>
      {(value: string[]) =>
      value?.length ? (
        <SelectMultiValue
          items={value.map((item) => ({ value: item, label: labelByValue[item] ?? item }))}
          maxVisible={2}
          onRemove={(item) => setPreviewValue(value.filter((current) => current !== item))} />) :
      placeholder
      }
    </SelectValue>) : (
    <SelectValue placeholder={placeholder}>
      {(value: string | null) =>
      value === "other" && otherValue ? otherValue :
        value === "other" ? "其他" :
        value ? labelByValue[value] ?? value :
        placeholder
      }
    </SelectValue>);
  const descriptionItems = (
    <>
      {matchesQuery("管理员 拥有全部管理权限") ? <SelectItem value={selectedValue}>
        {multipleIndicator()}
        <span className="flex flex-col">
          <span>管理员</span>
          <span className="text-xs text-muted-foreground">拥有全部管理权限</span>
        </span>
      </SelectItem> : null}
      {matchesQuery("成员 拥有基础使用权限") ? <SelectItem value={secondValue}>
        {multipleIndicator()}
        <span className="flex flex-col">
          <span>成员</span>
          <span className="text-xs text-muted-foreground">拥有基础使用权限</span>
        </span>
      </SelectItem> : null}
    </>);
  const hasVisibleOption = values.structure === "description"
    ? matchesQuery("管理员 拥有全部管理权限") || matchesQuery("成员 拥有基础使用权限")
    : matchesQuery("管理员") || matchesQuery("成员") || (isMultiple && (matchesQuery("审计员") || matchesQuery("访客"))) || (hasOtherInput && matchesQuery("其他"));
  const showEmpty = !showLoading && showSearch && !hasVisibleOption;
  const contentLead = (
    <>
      {showSearch ? (
        <div className="p-1">
          <Input
            size="xs"
            placeholder="搜索选项"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            onKeyDown={(event) => event.stopPropagation()}
          />
        </div>) : null}
      {showEmpty ? <div className="px-2 py-6 text-center text-sm text-muted-foreground">无匹配结果</div> : null}
      {showLoading ? (
        <div className="flex items-center gap-2 px-2 py-3 text-sm text-muted-foreground">
          <Spinner className="size-4" />
          正在加载
        </div>) : null}
    </>);
  const selectKey = [
    values.structure,
    values.variant,
    values.selection,
    values.search,
    values.otherInput,
    values.valueState,
    values.semanticState,
    values.interactionState,
    values.feedbackState,
    values.size
  ].join("-");
  useEffect(() => {
    setPreviewValue(hasValue ? isMultiple ? [selectedValue, secondValue, "auditor", "guest"] : hasOtherInput ? "other" : selectedValue : isMultiple ? [] : null);
    setOtherValue(hasOtherInput && hasValue && !isOtherRequired ? "选项n" : "");
    setSearchQuery(values.feedbackState === "empty" ? "不存在" : values.feedbackState === "searching" ? "管理" : "");
  }, [hasOtherInput, hasValue, isMultiple, isOtherRequired, selectedValue, secondValue, selectKey]);
  const hasPreviewValue = Array.isArray(previewValue) ? previewValue.length > 0 : previewValue != null;
  const otherInputInvalid = hasOtherInput && isOtherRequired && previewValue === "other" && !otherValue.trim();
  const otherInputNode = hasOtherInput ? (
    <Field data-invalid={otherInputInvalid ? true : undefined} className="gap-1 px-2 pt-1 pb-2">
      <Input
        size={size}
        value={otherValue}
        onChange={(event) => setOtherValue(event.target.value)}
        placeholder={isOtherRequired ? "请输入（必填）" : "请输入（选填）"}
        aria-invalid={otherInputInvalid ? true : undefined}
        onKeyDown={(event) => event.stopPropagation()} />
      {otherInputInvalid ? <FieldError>请输入具体内容</FieldError> : null}
    </Field>) : null;
  const selectChildren = (
    <>
      {values.clearable === "true" && hasPreviewValue ? (
        <SelectControl className={variant === "borderless" ? undefined : "w-[200px]"}>
          <SelectTrigger
            size={size}
            variant={variant}
            render={isMultiple ? <div /> : undefined}
            nativeButton={isMultiple ? false : undefined}
            clearable
            data-state={visualState}
            aria-invalid={invalid || otherInputInvalid ? true : undefined}
            className={variant === "borderless" ? undefined : "w-full"}>
            {selectValueNode}
          </SelectTrigger>
          <SelectClear
            aria-label="清除选择"
            onClick={(event) => {
              event.stopPropagation();
              setPreviewValue(isMultiple ? [] : null);
            }} />
        </SelectControl>) : (
        <SelectTrigger
          size={size}
          variant={variant}
          render={isMultiple ? <div /> : undefined}
          nativeButton={isMultiple ? false : undefined}
          data-state={visualState}
          aria-invalid={invalid || otherInputInvalid ? true : undefined}
          className={variant === "borderless" ? undefined : "w-[200px]"}>
          {selectValueNode}
        </SelectTrigger>)}
      <SelectContent size={size} collisionAvoidance={open ? { side: "none", align: "none" } : undefined}>
        {contentLead}
        {values.structure === "grouped" ? (
          <SelectGroup>
            <SelectLabel>常用</SelectLabel>
            {showEmpty || showLoading ? null : (
              <>
                {itemA}
                {itemB}
                {extraItems}
                {hasOtherInput && matchesQuery("其他") ? <SelectItem value="other">其他</SelectItem> : null}
                {otherInputNode}
              </>)}
          </SelectGroup>) : (
          <>
            {showEmpty || showLoading ? null : values.structure === "description" ? descriptionItems : (
              <>
                {itemA}
                {itemB}
                {extraItems}
                {hasOtherInput && matchesQuery("其他") ? <SelectItem value="other">其他</SelectItem> : null}
                {otherInputNode}
              </>)}
          </>)}
      </SelectContent>
    </>);
  const select = isMultiple ? (
    <Select
      key={selectKey}
      multiple
      value={Array.isArray(previewValue) ? previewValue : []}
      onValueChange={setPreviewValue}
      disabled={disabled}
      modal={open ? false : undefined}
      open={open ? true : undefined}>
      {selectChildren}
    </Select>) : (
    <Select
      key={selectKey}
      value={typeof previewValue === "string" ? previewValue : null}
      onValueChange={(next) => setPreviewValue(next)}
      disabled={disabled}
      modal={open ? false : undefined}
      open={open ? true : undefined}>
      {selectChildren}
    </Select>);

  const preview = (
    <div className="inline-flex items-center">
      {select}
    </div>);

  if (!invalid) return <div className={cn("w-[320px]", open && "min-h-[220px]")}>{preview}</div>;

  return (
    <Field data-invalid className={cn("w-[320px]", open && "min-h-[220px]")}>
      {preview}
      <FieldError>请选择一个选项</FieldError>
    </Field>);
}

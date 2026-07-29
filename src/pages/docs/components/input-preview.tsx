import { useEffect, useState } from "react"
import type { ChangeEvent, CSSProperties } from "react"
import { EyeIcon, EyeOffIcon, MailIcon, SearchIcon, XIcon } from "@/lib/icons"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input, InputAction, InputAddon, InputAffix, InputGroup } from "@/components/ui/input"

type InputPreviewValues = Record<string, string>

export function InputPreview({ values }: { values: InputPreviewValues }) {
  const [showPassword, setShowPassword] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [emailInvalid, setEmailInvalid] = useState(false);
  useEffect(() => {
    if (values.trailing !== "password-toggle") setShowPassword(false);
  }, [values.trailing]);
  useEffect(() => {
    if (values.type !== "search") setSearchQuery("");
  }, [values.type]);
  useEffect(() => {
    if (values.type !== "email") {
      setEmailValue("");
      setEmailTouched(false);
      setEmailInvalid(false);
    }
  }, [values.type]);
  const size = values.size as "xs" | "sm" | "md";
  const disabled = values.state === "disabled";
  const invalid = values.state === "invalid";
  const nativeEmailValidation = values.type === "email";
  const visualState = values.state === "hover" || values.state === "focus" ? values.state : undefined;
  const previewStateProps = visualState ? { "data-input-state": visualState } : {};
  const tokenStyle = {
    ...(values.surfaceToken !== "surface" ? { "--surface": `var(--${values.surfaceToken})` } : {}),
    ...(values.borderToken !== "input" ? { "--input": `var(--${values.borderToken})` } : {}),
    ...(values.placeholderToken !== "foreground-disabled" ? { "--foreground-disabled": `var(--${values.placeholderToken})` } : {})
  } as CSSProperties;
  const inputType = values.trailing === "password-toggle" && showPassword ? "text" : values.type;
  const inputValue = values.type === "search" ? searchQuery : nativeEmailValidation ? emailValue : undefined;
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (values.type === "search") {
      setSearchQuery(event.target.value);
    } else if (nativeEmailValidation) {
      setEmailValue(event.target.value);
      if (emailTouched) setEmailInvalid(event.currentTarget.validity.typeMismatch);
    }
  };
  const input = (
    <Input
      id={values.field === "true" ? "input-workbench-preview" : undefined}
      size={size}
      type={inputType}
      value={inputValue}
      onChange={values.type === "search" || nativeEmailValidation ? handleChange : undefined}
      {...previewStateProps}
      disabled={disabled}
      onBlur={nativeEmailValidation ? (event) => {
        setEmailTouched(true);
        setEmailInvalid(event.currentTarget.validity.typeMismatch);
      } : undefined}
      aria-invalid={invalid || emailInvalid ? true : undefined}
      placeholder={values.placeholder}
    />);
  const groupStateProps = visualState ? { "data-input-state": visualState } : {};
  const leading = values.leading === "search-icon" ? <InputAffix side="start"><SearchIcon /></InputAffix> :
    values.leading === "email-icon" ? <InputAffix side="start"><MailIcon /></InputAffix> :
    values.leading === "text" ? <InputAffix side="start">{values.leadingText}</InputAffix> :
    values.leading === "addon" ? <InputAddon side="start">{values.leadingText}</InputAddon> : null;
  const clearAction = values.type === "search" && searchQuery ? <InputAction data-clear aria-label="清除搜索" disabled={disabled} onClick={() => setSearchQuery("")}><XIcon /></InputAction> : null;
  const trailing = values.trailing === "search-icon" ? <><InputAffix side="end"><SearchIcon /></InputAffix>{clearAction}</> :
    values.trailing === "text" ? <InputAffix side="end">{values.trailingText}</InputAffix> :
    values.trailing === "password-toggle" ? <InputAction aria-label={showPassword ? "隐藏密码" : "显示密码"} disabled={disabled} onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? <EyeOffIcon /> : <EyeIcon />}</InputAction> :
    values.trailing === "primary" ? <>{clearAction}<InputAction variant="primary" disabled={disabled}>{values.actionLabel}</InputAction></> : clearAction;
  const control = leading || trailing ? (
    <InputGroup size={size} {...groupStateProps}>
      {leading}
      {input}
      {trailing}
    </InputGroup>
  ) : input;

  return (
    <div
      data-slot="input-workbench-preview"
      data-surface-token={values.surfaceToken}
      data-border-token={values.borderToken}
      data-placeholder-token={values.placeholderToken}
      className="w-[280px]"
      style={tokenStyle}
    >
      {values.field === "true" ? (
        <Field data-invalid={invalid || emailInvalid || undefined} data-disabled={disabled || undefined}>
          <FieldLabel htmlFor="input-workbench-preview">字段名称</FieldLabel>
          {control}
          {invalid ? <FieldError>该项不能为空</FieldError> : emailInvalid ? <FieldError>请输入有效的邮箱地址。</FieldError> : <FieldDescription>字段辅助说明</FieldDescription>}
        </Field>
      ) : control}
    </div>);
}

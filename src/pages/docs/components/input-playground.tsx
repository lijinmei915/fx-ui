import { type ComponentPlaygroundConfig } from "@/components/fx/component-playground"
import { componentPlaygroundCondition, componentPlaygroundPropsFromManifest, type ComponentPlaygroundsManifest } from "@/pages/docs/components/component-playground-manifest"
import componentPlaygroundsManifestRaw from "../../../../docs/data/component-playgrounds.manifest.json?raw"
import designTokensManifestRaw from "../../../../docs/data/design-tokens.json?raw"
import { InputPreview } from "@/pages/docs/components/input-preview"

const componentPlaygroundsManifest = JSON.parse(componentPlaygroundsManifestRaw) as ComponentPlaygroundsManifest
const designTokensManifest = JSON.parse(designTokensManifestRaw) as { semantic: { name: string; value: string }[] }
const semanticTokenPaletteNames = new Map(designTokensManifest.semantic.map((token) => {
  const paletteReference = token.value.match(/var\(--fx-([^)]+)\)/)?.[1] ?? token.name.replace(/^--/, "")
  return [token.name.replace(/^--/, ""), paletteReference]
}))

const inputImportCodeForPlayground = `import { Input, InputAction, InputAddon, InputAffix, InputGroup } from "@/components/ui/input"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"`;

function buildInputPlaygroundCode(values: Record<string, string>) {
  const sizeProp = values.size === "sm" ? "" : ` size="${values.size}"`;
  const passwordToggle = values.trailing === "password-toggle";
  const searchClear = values.type === "search";
  const nativeEmailValidation = values.type === "email";
  const usesState = passwordToggle || searchClear || nativeEmailValidation;
  const typeProp = passwordToggle ? ' type={showPassword ? "text" : "password"}' : values.type === "text" ? "" : ` type="${values.type}"`;
  const disabledProp = values.state === "disabled" ? " disabled" : "";
  const invalidProp = nativeEmailValidation ? ` aria-invalid={emailInvalid${values.state === "invalid" ? " || true" : ""} || undefined}` : values.state === "invalid" ? " aria-invalid" : "";
  const idProp = values.field === "true" ? " id=\"input-recipe\"" : "";
  const emailValidationProps = nativeEmailValidation ? " value={email} onChange={(event) => { setEmail(event.target.value); if (emailTouched) setEmailInvalid(event.currentTarget.validity.typeMismatch) }} onBlur={(event) => { setEmailTouched(true); setEmailInvalid(event.currentTarget.validity.typeMismatch) }}" : "";
  const inputLine = `<Input${idProp}${sizeProp}${typeProp}${searchClear ? " value={query} onChange={(event) => setQuery(event.target.value)}" : ""}${emailValidationProps}${disabledProp}${invalidProp} placeholder="${values.placeholder}" />`;
  const leading = values.leading === "search-icon" ? `  <InputAffix side="start"><SearchIcon /></InputAffix>\n` :
    values.leading === "email-icon" ? `  <InputAffix side="start"><MailIcon /></InputAffix>\n` :
    values.leading === "text" ? `  <InputAffix side="start">${values.leadingText}</InputAffix>\n` :
    values.leading === "addon" ? `  <InputAddon side="start">${values.leadingText}</InputAddon>\n` : "";
  const clearAction = searchClear ? `\n  {query ? <InputAction aria-label="清除搜索" onClick={() => setQuery("")}><XIcon /></InputAction> : null}` : "";
  const trailing = values.trailing === "search-icon" ? `\n  <InputAffix side="end"><SearchIcon /></InputAffix>${clearAction}` :
    values.trailing === "text" ? `\n  <InputAffix side="end">${values.trailingText}</InputAffix>` :
    passwordToggle ? `\n  <InputAction aria-label={showPassword ? "隐藏密码" : "显示密码"} onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? <EyeOffIcon /> : <EyeIcon />}</InputAction>` :
    values.trailing === "primary" ? `${clearAction}\n  <InputAction variant="primary">${values.actionLabel}</InputAction>` : clearAction;
  const control = values.leading === "none" && values.trailing === "none" && !searchClear ? inputLine : `<InputGroup${sizeProp}>
${leading}  ${inputLine}${trailing}
</InputGroup>`;
  const usesField = values.field === "true";
  const fieldInvalid = values.state === "invalid" ? " data-invalid" : nativeEmailValidation ? " data-invalid={emailInvalid || undefined}" : "";
  const fieldFeedback = values.state === "invalid" ? "<FieldError>该项不能为空</FieldError>" : nativeEmailValidation ? "{emailInvalid ? <FieldError>请输入有效的邮箱地址。</FieldError> : <FieldDescription>字段辅助说明</FieldDescription>}" : "<FieldDescription>字段辅助说明</FieldDescription>";
  const field = usesField ? `<Field${fieldInvalid}>
  <FieldLabel htmlFor="input-recipe">字段名称</FieldLabel>
  ${control}
  ${fieldFeedback}
</Field>` : control;
  const tokenOverrides = [
    values.surfaceToken !== "surface" ? `  "--surface": "var(--${values.surfaceToken})",` : "",
    values.borderToken !== "input" ? `  "--input": "var(--${values.borderToken})",` : "",
    values.placeholderToken !== "foreground-disabled" ? `  "--foreground-disabled": "var(--${values.placeholderToken})",` : "",
  ].filter(Boolean);

  const iconImports = [
    values.leading === "search-icon" || values.trailing === "search-icon" ? "SearchIcon" : "",
    values.leading === "email-icon" ? "MailIcon" : "",
    passwordToggle ? "EyeIcon, EyeOffIcon" : "",
    searchClear ? "XIcon" : "",
  ].filter(Boolean).join(", ");
  return `import${usesState ? " { useState }" : " type { CSSProperties }"} from "react"
${usesState ? 'import type { CSSProperties } from "react"\n' : ""}${inputImportCodeForPlayground}
${iconImports ? `import { ${iconImports} } from "@/lib/icons"` : ""}

const inputRecipeTokens = {
${tokenOverrides.join("\n")}
} as CSSProperties

export function InputRecipe() {
${passwordToggle ? "  const [showPassword, setShowPassword] = useState(false)\n" : ""}${searchClear ? "  const [query, setQuery] = useState(\"\")\n" : ""}${nativeEmailValidation ? "  const [email, setEmail] = useState(\"\")\n  const [emailTouched, setEmailTouched] = useState(false)\n  const [emailInvalid, setEmailInvalid] = useState(false)\n" : ""}  return <div style={inputRecipeTokens}>${field.includes("\n") ? `\n${field.split("\n").map((line) => `    ${line}`).join("\n")}\n  ` : field}</div>
}`;
}

const inputPlaygroundManifest = componentPlaygroundsManifest.components.input;
export const inputPlaygroundConfig: ComponentPlaygroundConfig = {
  storySource: "docs/data/component-playgrounds.manifest.json#components.input",
  props: componentPlaygroundPropsFromManifest(inputPlaygroundManifest),
  initial: inputPlaygroundManifest.initial,
  guidanceKey: inputPlaygroundManifest.guidanceKey,
  workbench: {
    inspectSlot: inputPlaygroundManifest.workbench!.inspectSlot,
    nodes: inputPlaygroundManifest.workbench!.nodes.map((node) => ({
      ...node,
      hiddenWhen: componentPlaygroundCondition(node.hiddenWhen),
    })),
    stateAssignments: inputPlaygroundManifest.workbench!.stateAssignments?.map((assignment) => ({
      ...assignment,
      palette: semanticTokenPaletteNames.get(assignment.token) ?? assignment.token,
    })),
    checks: inputPlaygroundManifest.workbench!.checks,
    validate: (values: Record<string, string>) => {
      const semanticTokens = new Set(["surface", "background", "muted", "card", "input", "border", "border-strong", "primary", "destructive", "foreground-disabled", "muted-foreground", "foreground-secondary"]);
      const stateAssignments = inputPlaygroundManifest.workbench!.stateAssignments ?? [];
      return {
        realDom: { passed: true, detail: "预览直接渲染仓库内 Input 组件。", detailEn: "The preview renders the repository Input directly." },
        structure: { passed: true, detail: `前置 ${values.leading} / 后置 ${values.trailing}`, detailEn: `Leading ${values.leading} / trailing ${values.trailing}` },
        tokens: { passed: [values.surfaceToken, values.borderToken, values.placeholderToken].every((token) => semanticTokens.has(token)), detail: "三个槽位均映射到语义 Token。", detailEn: "All three slots map to semantic tokens." },
        stateSemantics: { passed: stateAssignments.every((assignment) => semanticTokens.has(assignment.token)), detail: `${stateAssignments.length} 条状态映射来自 Input 源码契约。`, detailEn: `${stateAssignments.length} state mappings come from the Input source contract.` },
        accessibility: { passed: true, detail: values.type === "search" ? "搜索输入在存在关键词时自动显示清除按钮，并带有 aria-label。" : values.trailing === "password-toggle" ? "密码显隐按钮会同步更新 aria-label。" : "当前没有图标动作节点。", detailEn: values.type === "search" ? "Search inputs automatically render a labelled clear action when a query exists." : values.trailing === "password-toggle" ? "The password visibility action updates its aria-label with state." : "No icon action node." },
        code: { passed: true, detail: "结构 JSON 同时驱动预览和组件草稿。", detailEn: "The same structure state drives preview and component draft." },
      };
    },
  },
  onValueChange: (next: Record<string, string>, key: string, value: string) => {
    if (key === "type") {
      if (value === "number") {
        next.leading = ["search-icon", "email-icon"].includes(next.leading) ? "none" : next.leading;
        next.trailing = ["search-icon", "primary", "password-toggle"].includes(next.trailing) ? "none" : next.trailing;
      } else if (value === "email") {
        next.leading = "email-icon";
        next.trailing = "none";
      } else if (value === "password") {
        next.leading = "none";
        next.trailing = "password-toggle";
      } else if (value === "search") {
        next.leading = "search-icon";
        next.trailing = ["search-icon", "primary"].includes(next.trailing) ? next.trailing : "none";
      } else {
        next.leading = ["email-icon", "search-icon"].includes(next.leading) ? "none" : next.leading;
        next.trailing = ["search-icon", "primary", "password-toggle"].includes(next.trailing) ? "none" : next.trailing;
      }
    } else if (key === "leading" && value === "search-icon" && next.trailing === "search-icon") {
      next.trailing = "none";
    } else if (key === "trailing" && value === "search-icon") {
      next.leading = "none";
    } else if (key === "disabled") {
      next.invalid = value === "true" ? "false" : next.invalid;
      next.state = value === "true" ? "disabled" : next.state === "disabled" ? "normal" : next.state;
    } else if (key === "invalid") {
      next.disabled = value === "true" ? "false" : next.disabled;
      next.state = value === "true" ? "invalid" : next.state === "invalid" ? "normal" : next.state;
    } else if (key === "state") {
      next.disabled = value === "disabled" ? "true" : "false";
      next.invalid = value === "invalid" ? "true" : "false";
    }
    return next;
  },
  renderOne: (values: Record<string, string>) => <InputPreview values={values} />,
  genCode: (values: Record<string, string>) => {
    return buildInputPlaygroundCode(values);
  }
};

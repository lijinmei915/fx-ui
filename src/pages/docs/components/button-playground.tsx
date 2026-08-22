import { ComponentPlayground, type ComponentPlaygroundConfig } from "@/components/fx/component-playground"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { ChevronDownIcon, PackageIcon, SearchIcon } from "@/lib/icons"
import componentPlaygroundsManifestRaw from "../../../../docs/data/component-playgrounds.manifest.json?raw"
import { componentPlaygroundPropsFromManifest, componentPlaygroundStoriesFromManifest, type ComponentPlaygroundsManifest } from "@/pages/docs/components/component-playground-manifest"

type ButtonVariant = "default" | "secondary" | "outline" | "ghost" | "plain" | "destructive"
type ButtonTone = "default" | "primary" | "info" | "danger"
type ButtonSize = "xs" | "sm" | "md" | "lg"
type ButtonIcon = "none" | "start" | "end" | "only"
const iconSizes: Record<ButtonSize, "icon-xs" | "icon-sm" | "icon-md" | "icon-lg"> = {
  xs: "icon-xs", sm: "icon-sm", md: "icon-md", lg: "icon-lg",
}

function renderButton(values: Record<string, string>, lang: "zh" | "en") {
  const variant = values.variant as ButtonVariant
  const tone = values.tone as ButtonTone
  const size = values.size as ButtonSize
  const icon = values.icon as ButtonIcon
  const disabled = values.disabled === "true"
  const loading = values.loading === "true"
  const label = (lang === "en" ? values.textEn : values.text) || (lang === "en" ? "Button" : "按钮")

  if (icon === "only") {
    return <Button variant={variant} tone={tone} size={iconSizes[size]} disabled={disabled || loading} aria-label={label}>{loading ? <Spinner /> : <PackageIcon />}</Button>
  }

  return <Button variant={variant} tone={tone} size={size} disabled={disabled || loading}>
    {loading ? <Spinner data-icon="inline-start" /> : icon === "start" ? <SearchIcon data-icon="inline-start" /> : null}
    {label}
    {!loading && icon === "end" ? <ChevronDownIcon data-icon="inline-end" /> : null}
  </Button>
}

function genButtonCode(values: Record<string, string>, lang: "zh" | "en") {
  const attrs: string[] = []
  const variant = values.variant as ButtonVariant
  const size = values.size as ButtonSize
  const icon = values.icon as ButtonIcon
  if (variant !== "default") attrs.push(`variant=\"${variant}\"`)
  if (values.tone !== "default") attrs.push(`tone=\"${values.tone}\"`)
  if (icon === "only") attrs.push(`size=\"${iconSizes[size]}\"`)
  else if (size !== "sm") attrs.push(`size=\"${size}\"`)
  if (values.disabled === "true" || values.loading === "true") attrs.push("disabled")
  const label = (lang === "en" ? values.textEn : values.text) || (lang === "en" ? "Button" : "按钮")
  if (icon === "only") attrs.push(`aria-label=\"${label}\"`)
  const inner = values.loading === "true" ? `<Spinner data-icon=\"inline-start\" />${label}` : icon === "only" ? "<PackageIcon />" : icon === "start" ? `<SearchIcon data-icon=\"inline-start\" />${label}` : icon === "end" ? `${label}<ChevronDownIcon data-icon=\"inline-end\" />` : label
  return `<Button${attrs.length ? ` ${attrs.join(" ")}` : ""}>${inner}</Button>`
}

const manifest = JSON.parse(componentPlaygroundsManifestRaw) as ComponentPlaygroundsManifest
const buttonManifest = manifest.customPlaygrounds!.button

export const buttonPlaygroundConfig: ComponentPlaygroundConfig = {
  storySource: "docs/data/component-playgrounds.manifest.json#customPlaygrounds.button",
  props: componentPlaygroundPropsFromManifest(buttonManifest),
  initial: buttonManifest.initial,
  stories: componentPlaygroundStoriesFromManifest(buttonManifest),
  guidanceKey: buttonManifest.guidanceKey,
  onValueChange: (next, key, value) => {
    if (key === "loading" && value === "true") return { ...next, disabled: "true" }
    if (key !== "variant") return next
    const tone = value === "default" ? "primary" : value === "plain" ? "default" : "default"
    return { ...next, tone }
  },
  renderOne: renderButton,
  genCode: genButtonCode,
}

export function ButtonPlayground({ lang }: { lang: "zh" | "en" }) {
  return <ComponentPlayground key="button-playground" config={buttonPlaygroundConfig} lang={lang} />
}

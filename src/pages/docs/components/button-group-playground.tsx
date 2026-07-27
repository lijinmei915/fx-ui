import { ComponentPlayground, type ComponentPlaygroundConfig } from "@/components/fx/component-playground"
import { ButtonGroup } from "@/components/ui/button-group"
import { Button } from "@/components/ui/button"
import { ChevronDownIcon } from "@/lib/icons"
import componentPlaygroundsManifestRaw from "../../../../docs/data/component-playgrounds.manifest.json?raw"
import { componentPlaygroundPropsFromManifest, componentPlaygroundStoriesFromManifest, type ComponentPlaygroundsManifest } from "@/pages/docs/components/component-playground-manifest"

type Pattern = "actions" | "split"
type Orientation = "horizontal" | "vertical"
type ButtonSize = "xs" | "sm" | "md" | "lg"
type ButtonVariant = "outline" | "secondary" | "default"

function iconSize(size: ButtonSize) {
  return size === "xs" ? "icon-xs" : size === "sm" ? "icon-sm" : size === "md" ? "icon-md" : "icon-lg"
}

function renderButtonGroup(values: Record<string, string>, lang: "zh" | "en") {
  const pattern = values.pattern as Pattern
  const orientation = values.orientation as Orientation
  const size = values.size as ButtonSize
  const variant = values.variant as ButtonVariant
  const effectiveOrientation = pattern === "actions" ? orientation : "horizontal"
  const labels = lang === "en" ? ["Copy", "Share", "Archive"] : ["复制", "分享", "归档"]
  const vertical = lang === "en" ? ["Move up", "Center", "Move down"] : ["上移", "居中", "下移"]

  if (pattern === "split") return <ButtonGroup><Button size={size} variant={variant}>{lang === "en" ? "Save" : "保存"}</Button><Button size={iconSize(size)} variant={variant} aria-label={lang === "en" ? "More actions" : "更多操作"}><ChevronDownIcon /></Button></ButtonGroup>
  return <ButtonGroup orientation={effectiveOrientation}>{[0, 1, 2].map((index) => <Button key={index} size={size} variant={variant}>{(effectiveOrientation === "vertical" ? vertical : labels)[index]}</Button>)}</ButtonGroup>
}

function genButtonGroupCode(values: Record<string, string>, lang: "zh" | "en") {
  const pattern = values.pattern as Pattern
  const orientation = values.orientation as Orientation
  const size = values.size as ButtonSize
  const variant = values.variant as ButtonVariant
  const effectiveOrientation = pattern === "actions" ? orientation : "horizontal"
  const groupAttrs = effectiveOrientation === "horizontal" ? "" : ` orientation="${effectiveOrientation}"`
  const buttonAttrs = `${size !== "md" ? ` size="${size}"` : ""} variant="${variant}"`
  const icon = iconSize(size)
  const labels = lang === "en" ? ["Copy", "Share", "Archive"] : ["复制", "分享", "归档"]
  if (pattern === "split") return `<ButtonGroup>\n  <Button${buttonAttrs}>${lang === "en" ? "Save" : "保存"}</Button>\n  <Button size="${icon}" variant="${variant}" aria-label="${lang === "en" ? "More actions" : "更多操作"}"><ChevronDownIcon /></Button>\n</ButtonGroup>`
  return `<ButtonGroup${groupAttrs}>\n${labels.map((label) => `  <Button${buttonAttrs}>${label}</Button>`).join("\n")}\n</ButtonGroup>`
}

const manifest = JSON.parse(componentPlaygroundsManifestRaw) as ComponentPlaygroundsManifest
const buttonGroupManifest = manifest.components.buttonGroup

export const buttonGroupPlaygroundConfig: ComponentPlaygroundConfig = {
  storySource: "docs/data/component-playgrounds.manifest.json#components.buttonGroup",
  props: componentPlaygroundPropsFromManifest(buttonGroupManifest),
  initial: buttonGroupManifest.initial,
  stories: componentPlaygroundStoriesFromManifest(buttonGroupManifest),
  storyPresentation: buttonGroupManifest.storyPresentation,
  renderOne: renderButtonGroup,
  genCode: genButtonGroupCode,
}

export function ButtonGroupPlayground({ lang }: { lang: "zh" | "en" }) {
  return <ComponentPlayground config={buttonGroupPlaygroundConfig} lang={lang} />
}

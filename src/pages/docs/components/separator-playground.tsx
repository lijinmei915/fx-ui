import { ComponentPlayground, type ComponentPlaygroundConfig } from "@/components/fx/component-playground"
import { Separator } from "@/components/ui/separator"
import componentPlaygroundsManifestRaw from "../../../../docs/data/component-playgrounds.manifest.json?raw"
import { componentPlaygroundPropsFromManifest, type ComponentPlaygroundsManifest } from "@/pages/docs/components/component-playground-manifest"

const manifest = JSON.parse(componentPlaygroundsManifestRaw) as ComponentPlaygroundsManifest
const separatorManifest = manifest.components.separator

function renderSeparator(values: Record<string, string>, lang: "zh" | "en") {
  if (values.orientation === "vertical") {
    return <div className="flex h-5 items-center gap-3 text-sm"><span>{lang === "en" ? "Edit" : "编辑"}</span><Separator orientation="vertical" /><span>{lang === "en" ? "Share" : "分享"}</span><Separator orientation="vertical" /><span>{lang === "en" ? "Delete" : "删除"}</span></div>
  }

  return <div className="flex w-fit flex-col gap-3"><p className="text-sm">{lang === "en" ? "First section" : "第一段内容"}</p><Separator /><p className="text-sm">{lang === "en" ? "Second section" : "第二段内容"}</p></div>
}

function genSeparatorCode(values: Record<string, string>) {
  return values.orientation === "vertical"
    ? '<Separator orientation="vertical" />'
    : "<Separator />"
}

export const separatorPlaygroundConfig: ComponentPlaygroundConfig = {
  storySource: "docs/data/component-playgrounds.manifest.json#components.separator",
  props: componentPlaygroundPropsFromManifest(separatorManifest),
  initial: separatorManifest.initial,
  guidanceKey: separatorManifest.guidanceKey,
  renderOne: renderSeparator,
  genCode: genSeparatorCode,
}

export function SeparatorPlayground({ lang }: { lang: "zh" | "en" }) {
  return <ComponentPlayground config={separatorPlaygroundConfig} lang={lang} />
}

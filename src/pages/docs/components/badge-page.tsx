import { ComponentPlayground, type ComponentPlaygroundConfig } from "@/components/fx/component-playground"
import { Badge } from "@/components/ui/badge"
import { CardContent } from "@/components/ui/card"
import { BellIcon } from "@/lib/icons"
import { DocSurfaceCard } from "@/components/fx/doc-surface"
import { StandardDocPage, type StandardDocLang } from "@/pages/docs/components/standard-doc-page"
import componentPlaygroundsManifestRaw from "../../../../docs/data/component-playgrounds.manifest.json?raw"
import { componentPlaygroundPropsFromManifest, componentPlaygroundStoriesFromManifest, type ComponentPlaygroundsManifest } from "@/pages/docs/components/component-playground-manifest"

type PropRow = { prop: string; type: string; defaultValue: string; desc: string; descEn?: string }
type SemanticDomRow = { part: string; desc: string; descEn?: string }
type DoDontRow = { do: string; doEn?: string; dont: string; dontEn?: string }

export const badgeAnchors = [
  { label: "调试台", labelEn: "Playground", href: "#badge-playground" },
  { label: "API", href: "#badge-props" },
  { label: "语义 DOM", href: "#badge-semantic-dom" },
  { label: "正误示例", href: "#badge-do-dont" },
]

export const badgePropRows = [
  { prop: "dot", type: "boolean", defaultValue: "false", desc: "红点（不显示数字）" },
  { prop: "count", type: "number", defaultValue: "—", desc: "未读数；超过 max 显示「max+」" },
  { prop: "max", type: "number", defaultValue: "99", desc: "数字溢出阈值" },
  { prop: "showZero", type: "boolean", defaultValue: "false", desc: "count<=0 时是否仍显示 0" },
  { prop: "tone", type: "\"destructive\" | \"primary\"", defaultValue: "destructive", desc: "角标配色" },
]

export const badgeSemanticDomRows = [
  { part: "data-slot=\"badge\"", desc: "角标本体（红点/数字），承载圆角、底色与反白文字" },
  { part: "data-slot=\"badge-root\"", desc: "传 children 时包裹载体的相对定位容器" },
]

export const badgeDoDontRows = [
  { do: "角标 dot 表示有更新、count 表示未读数。", dont: "用角标承载行内状态/分类标签（那是 Tag）。" },
  { do: "数字溢出用 max（显示「max+」）。", dont: "把长文本塞进角标。" },
  { do: "用 children 包裹载体自动定位右上角。", dont: "用 className 硬改定位/配色。" },
]

const componentPlaygroundsManifest = JSON.parse(componentPlaygroundsManifestRaw) as ComponentPlaygroundsManifest
const badgePlaygroundManifest = componentPlaygroundsManifest.components.badge

const badgePlaygroundConfig: ComponentPlaygroundConfig = {
  storySource: "docs/data/component-playgrounds.manifest.json#components.badge",
  props: componentPlaygroundPropsFromManifest(badgePlaygroundManifest),
  initial: badgePlaygroundManifest.initial,
  stories: componentPlaygroundStoriesFromManifest(badgePlaygroundManifest),
  guidanceKey: badgePlaygroundManifest.guidanceKey,
  renderOne: (values: Record<string, string>) => {
    const count = values.scenario === "count" ? 5 : values.scenario === "overflow" ? 120 : undefined
    return values.scenario === "dot"
      ? <Badge dot><BellIcon className="size-6 text-foreground" /></Badge>
      : <Badge count={count} max={99}><BellIcon className="size-6 text-foreground" /></Badge>
  },
  genCode: (values: Record<string, string>) => values.scenario === "dot"
    ? `<Badge dot>\n  <BellIcon />\n</Badge>`
    : `<Badge count={${values.scenario === "overflow" ? 120 : 5}}${values.scenario === "overflow" ? " max={99}" : ""}>\n  <BellIcon />\n</Badge>`,
}

function BadgePreview({ id }: { id: string }) {
  const count = id === "count" ? 5 : id === "overflow" ? 120 : undefined
  if (id === "dot") return <Badge dot><BellIcon className="size-6 text-foreground" /></Badge>
  return <Badge count={count} max={99}><BellIcon className="size-6 text-foreground" /></Badge>
}

function BadgeOverview() {
  return (
    <DocSurfaceCard>
      <CardContent className="flex flex-wrap items-center gap-8 p-6">
        <Badge dot><BellIcon className="size-6 text-foreground" /></Badge>
        <Badge count={5}><BellIcon className="size-6 text-foreground" /></Badge>
        <Badge count={120} max={99}><BellIcon className="size-6 text-foreground" /></Badge>
        <Badge count={8} tone="primary"><BellIcon className="size-6 text-foreground" /></Badge>
      </CardContent>
    </DocSurfaceCard>
  )
}

export function BadgePage({
  actions,
  lang,
  propRows,
  semanticDomRows,
  doDontRows,
}: {
  actions: React.ReactNode
  lang: StandardDocLang
  propRows: PropRow[]
  semanticDomRows: SemanticDomRow[]
  doDontRows: DoDontRow[]
}) {
  return (
    <StandardDocPage
      slug="badge"
      title="Badge 角标"
      lead="贴在头像、图标、按钮右上角的通知红点 / 未读数字。行内状态/分类标签请用 Tag。"
      playground={<ComponentPlayground config={badgePlaygroundConfig} lang={lang} />}
      overview={null}
      overviewMatrix={<BadgeOverview />}
      hideOverview
      hideScenarioExamples
      hideUsage
      scenarioExamples={[]}
      renderScenarioPreview={(id) => <BadgePreview id={id} />}
      importCode={`import { Badge } from "@/components/ui/badge"`}
      usageCode={`<Badge dot>\n  <BellIcon />\n</Badge>\n<Badge count={5}>…</Badge>`}
      propRows={propRows}
      semanticDomRows={semanticDomRows}
      doDontRows={doDontRows}
      actions={actions}
      lang={lang}
    />
  )
}

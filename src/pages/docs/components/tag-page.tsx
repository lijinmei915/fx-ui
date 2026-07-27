import { ComponentPlayground, type ComponentPlaygroundConfig } from "@/components/fx/component-playground"
import { WebsiteCardContainer } from "@/components/fx/website-card-container"
import { CardContent } from "@/components/ui/card"
import { Tag } from "@/components/ui/tag"
import { CheckCircleIcon } from "@/lib/icons"
import { StandardDocPage, type StandardDocLang } from "@/pages/docs/components/standard-doc-page"
import componentPlaygroundsManifestRaw from "../../../../docs/data/component-playgrounds.manifest.json?raw"
import { componentPlaygroundPropsFromManifest, componentPlaygroundStoriesFromManifest, type ComponentPlaygroundsManifest } from "@/pages/docs/components/component-playground-manifest"

type PropRow = { prop: string; type: string; defaultValue: string; desc: string; descEn?: string }
type SemanticDomRow = { part: string; desc: string; descEn?: string }
type DoDontRow = { do: string; doEn?: string; dont: string; dontEn?: string }
type TagVariant = "default" | "secondary" | "soft" | "success" | "warning" | "destructive" | "outline"
type TagColor = "none" | "gray" | "red" | "amber" | "yellow" | "lime" | "green" | "teal" | "cyan" | "blue" | "purple" | "pink"

export const tagAnchors = [
  { label: "调试台", labelEn: "Playground", href: "#tag-playground" },
  { label: "API", href: "#tag-props" },
  { label: "语义 DOM", href: "#tag-semantic-dom" },
  { label: "正误示例", href: "#tag-do-dont" },
]

export const tagVariantRows = [
  { variant: "default", usage: "品牌强调，主要标记（如当前版本、推荐）" },
  { variant: "success", usage: "成功/完成态（如已支付、已完成、校验通过）" },
  { variant: "warning", usage: "提醒/警告态（如待审核、即将到期、VIP 标记）" },
  { variant: "secondary", usage: "中性态，次要或过程态信息（如处理中、草稿）" },
  { variant: "soft", usage: "紧凑中性标签，用于选择器已选项或筛选条件" },
  { variant: "destructive", usage: "错误/警示态（如已失败、已过期）" },
  { variant: "outline", usage: "弱化态，适合密集列表中的轻量标签" },
]

export const tagColorList = ["red", "amber", "yellow", "lime", "green", "teal", "cyan", "blue", "purple", "pink"] as const

export const tagPropRows = [
  { prop: "variant", type: "\"default\" | \"secondary\" | \"soft\" | \"destructive\" | \"success\" | \"warning\" | \"outline\"", defaultValue: "default", desc: "状态语义配色；soft 是紧凑中性标签" },
  { prop: "color", type: "\"none\" | \"red\" | \"amber\" | … | \"purple\" | \"pink\"", defaultValue: "none", desc: "分类打标多彩软色（设置后覆盖 variant 配色），颜色=类别" },
  { prop: "render", type: "ReactElement | (props, state) => ReactElement", defaultValue: "—", desc: "自定义根节点渲染（Base UI render）" },
  { prop: "className", type: "string", defaultValue: "—", desc: "在保留基础样式的前提下追加布局/间距类名" },
]

export const tagSemanticDomRows = [
  { part: "slot: \"tag\"", desc: "源码传给 Base UI useRender 的状态，标记标签根节点" },
  { part: "data-icon=\"inline-start\" / \"inline-end\"", desc: "标记图标在文字前/后的位置，驱动间距样式" },
]

export const tagDoDontRows = [
  { do: "状态用 variant（成功/中性/错误），分类打标用 color。", dont: "用自定义颜色 className 硬造标签。" },
  { do: "内容保持简短（状态词、分类词、图标+短词）。", dont: "把长句子塞进 Tag。" },
  { do: "图标用 data-icon 标记位置。", dont: "手写图标尺寸覆盖默认布局。" },
  { do: "需要跳转用链接或 Button。", dont: "给 Tag 加 onClick 当按钮用。" },
]

const componentPlaygroundsManifest = JSON.parse(componentPlaygroundsManifestRaw) as ComponentPlaygroundsManifest
const tagPlaygroundManifest = componentPlaygroundsManifest.components.tag

function genTagCode(variant: TagVariant, color: TagColor, label: string): string {
  const attrs: string[] = []
  if (variant !== "default") attrs.push(`variant="${variant}"`)
  if (color !== "none") attrs.push(`color="${color}"`)
  return `<Tag${attrs.length ? ` ${attrs.join(" ")}` : ""}>${label}</Tag>`
}

const tagPlaygroundConfig: ComponentPlaygroundConfig = {
  storySource: "docs/data/component-playgrounds.manifest.json#components.tag",
  props: componentPlaygroundPropsFromManifest(tagPlaygroundManifest),
  initial: tagPlaygroundManifest.initial,
  stories: componentPlaygroundStoriesFromManifest(tagPlaygroundManifest),
  guidanceKey: tagPlaygroundManifest.guidanceKey,
  renderOne: (values: Record<string, string>, lang: StandardDocLang) => <Tag variant={values.variant as TagVariant} color={values.color as TagColor}>{(lang === "en" ? values.textEn : values.text) || "Tag"}</Tag>,
  genCode: (values: Record<string, string>, lang: StandardDocLang) => genTagCode(values.variant as TagVariant, values.color as TagColor, (lang === "en" ? values.textEn : values.text) || "Tag"),
}

function TagPreview({ id }: { id: string }) {
  if (id === "status") {
    return (
      <div className="flex flex-wrap gap-2">
        <Tag variant="success">已支付</Tag>
        <Tag variant="secondary">处理中</Tag>
        <Tag variant="destructive">已失败</Tag>
      </div>
    )
  }

  if (id === "color") {
    return (
      <div className="flex flex-wrap gap-2">
        <Tag color="purple">高意向</Tag>
        <Tag color="blue">华东区</Tag>
        <Tag color="green">已签约</Tag>
      </div>
    )
  }

  return (
    <Tag variant="secondary">
      <CheckCircleIcon data-icon="inline-start" />
      已校验
    </Tag>
  )
}

function TagOverview({ variantRows, colorList }: {
  variantRows: Array<{ variant: string; usage: string }>
  colorList: readonly TagColor[]
}) {
  return (
    <WebsiteCardContainer>
      <CardContent className="grid gap-4 p-6">
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-muted-foreground">状态 variant</span>
          <div className="flex flex-wrap items-center gap-2">
            {variantRows.map((row) => (
              <Tag key={row.variant} variant={row.variant as TagVariant}>{row.variant}</Tag>
            ))}
          </div>
        </div>
        <div className="border-t border-dashed border-border" />
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-muted-foreground">分类打标 color（软色 = 浅底 + 彩字 + 描边）</span>
          <div className="flex flex-wrap items-center gap-2">
            {colorList.map((color) => <Tag key={color} color={color}>{color}</Tag>)}
          </div>
        </div>
      </CardContent>
    </WebsiteCardContainer>
  )
}

export function TagPage({
  actions,
  lang,
  variantRows,
  colorList,
  propRows,
  semanticDomRows,
  doDontRows,
}: {
  actions: React.ReactNode
  lang: StandardDocLang
  variantRows: Array<{ variant: string; usage: string }>
  colorList: readonly TagColor[]
  propRows: PropRow[]
  semanticDomRows: SemanticDomRow[]
  doDontRows: DoDontRow[]
}) {
  return (
    <StandardDocPage
      slug="tag"
      title="Tag 标签"
      lead="行内的状态/分类小标签：状态用 variant，分类打标用多彩 color。角标红点/数字请用 Badge。"
      playground={<ComponentPlayground key="tag-playground" config={tagPlaygroundConfig} lang={lang} />}
      hideOverview
      hideScenarioExamples
      hideUsage
      overview={null}
      overviewMatrix={<TagOverview variantRows={variantRows} colorList={colorList} />}
      scenarioExamples={[]}
      renderScenarioPreview={(id) => <TagPreview id={id} />}
      importCode={`import { Tag } from "@/components/ui/tag"`}
      usageCode={`<Tag variant="success">已支付</Tag>\n<Tag color="purple">高意向</Tag>`}
      propRows={propRows}
      semanticDomRows={semanticDomRows}
      doDontRows={doDontRows}
      actions={actions}
      lang={lang}
    />
  )
}

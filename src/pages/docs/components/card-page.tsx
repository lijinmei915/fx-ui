import { ComponentPlayground, type ComponentPlaygroundConfig } from "@/components/fx/component-playground"
import { DocSurfaceTableCard } from "@/components/fx/doc-surface"
import { WebsiteCardContainer } from "@/components/fx/website-card-container"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardMedia, CardTitle } from "@/components/ui/card"
import { Tag } from "@/components/ui/tag"
import componentPlaygroundsManifestRaw from "../../../../docs/data/component-playgrounds.manifest.json?raw"
import { componentPlaygroundPropsFromManifest, componentPlaygroundStoriesFromManifest, type ComponentPlaygroundsManifest } from "@/pages/docs/components/component-playground-manifest"
import { type StandardDocLang } from "@/pages/docs/components/standard-doc-page"
import { docsSpacing } from "@/lib/docs-spacing"
import { SectionLead } from "@/components/fx/section-lead"
import { PageLead } from "@/components/fx/page-lead"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type PropRow = { prop: string; type: string; defaultValue: string; desc: string }
type SemanticDomRow = { part: string; desc: string }
type DoDontRow = { do: string; dont: string }

export const cardAnchors = [
  { label: "调试台", labelEn: "Playground", href: "#card-playground" },
  { label: "API", href: "#card-props" },
  { label: "语义 DOM", href: "#card-semantic-dom" },
  { label: "正误示例", href: "#card-do-dont" },
]

export const cardPropRows = [
  { prop: "variant", type: '"outline" | "subtle" | "elevated"', defaultValue: '"outline"', desc: "卡片表面层级：描边、弱底色或带全局 L1 阴影" },
  { prop: "size", type: '"sm" | "md" | "lg"', defaultValue: '"md"', desc: "统一控制卡片内间距与标题密度" },
  { prop: "render", type: "ReactElement", defaultValue: "—", desc: "通过 Base UI 将根节点渲染为 a/button，获得原生链接或按钮语义" },
  { prop: "CardMedia", type: "组件", defaultValue: "—", desc: "首个结构子节点的媒体容器；图片、视频等内容自行决定比例与裁切策略" },
  { prop: "CardHeader", type: "组件", defaultValue: "—", desc: "头部分组，包含标题、描述与右上角操作区的网格布局" },
  { prop: "CardTitle / CardDescription", type: "组件", defaultValue: "—", desc: "标题与说明文字，分别承载强调和次要语义" },
  { prop: "CardAction", type: "组件", defaultValue: "—", desc: "头部右上角的操作区（按钮、菜单触发器等），自动定位到网格右侧" },
  { prop: "CardContent / CardFooter", type: "组件", defaultValue: "—", desc: "主体内容区 / 底部操作区，按需选用" },
]

export const cardSemanticDomRows = [
  { part: "data-slot=\"card\"", desc: "卡片根节点，承载边框、圆角、阴影、背景" },
  { part: "data-slot=\"card-media\"", desc: "顶部媒体区；作为首个子节点时与卡片顶部贴齐，根节点负责裁切" },
  { part: "data-slot=\"card-header\"", desc: "头部分组容器，用网格布局自动安排标题/描述/操作区位置" },
  { part: "data-slot=\"card-title\" / \"card-description\"", desc: "标题与说明文字节点，承载字重和颜色语义" },
  { part: "data-slot=\"card-action\"", desc: "头部右上角操作区，依据网格定位规则自动靠右对齐" },
  { part: "data-slot=\"card-content\" / \"card-footer\"", desc: "主体内容区 / 底部区域，承载内边距规范" },
]

export const cardDoDontRows = [
  { do: "用 CardHeader/CardTitle/CardContent 等子组件搭骨架。", dont: "在 Card 里直接堆 div + 手写间距类名。" },
  { do: "媒体作为首个子节点放进 CardMedia，图片提供有意义的 alt。", dont: "给 Card 发明 cover/image 根属性，或绕过 CardMedia 手写裁切容器。" },
  { do: "头部右上角操作放进 CardAction，让布局自动对齐。", dont: "用绝对定位把按钮怼到卡片右上角。" },
  { do: "次要说明文字用 CardDescription。", dont: "在 CardTitle 里塞一段长说明文字。" },
  { do: "整卡跳转用 render 渲染为 a，整卡操作用 render 渲染为 button。", dont: "给 div 加 onClick 模仿链接或按钮。" },
  { do: "加载、空态和状态信息用 Skeleton、Empty、Tag/Alert 组合。", dont: "给 Card 发明 loading、empty 或 status 布尔属性。" },
]

type CardPlaygroundScenario = "metric" | "info" | "media" | "action" | "interactive-link" | "interactive-button"
type CardPlaygroundVariant = "outline" | "subtle" | "elevated"
type CardPlaygroundSize = "sm" | "md" | "lg"

const componentPlaygroundsManifest = JSON.parse(componentPlaygroundsManifestRaw) as ComponentPlaygroundsManifest
const cardPlaygroundManifest = componentPlaygroundsManifest.components.card

function renderCardPlayground(values: Record<string, string>) {
  const scenario = values.scenario as CardPlaygroundScenario
  const variant = values.variant as CardPlaygroundVariant
  const size = values.size as CardPlaygroundSize

  if (scenario === "interactive-link") {
    return (
      <Card
        variant={variant}
        size={size}
        render={<a href="#card-props" aria-label="查看订单详情" data-card-interactive="link" />}
        className="w-full max-w-sm"
      >
        <CardHeader>
          <CardTitle>订单 #FX-2048</CardTitle>
          <CardDescription>点击整张卡片查看订单详情</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          使用原生链接语义，可通过 Tab 聚焦并按 Enter 打开。
        </CardContent>
      </Card>
    )
  }

  if (scenario === "interactive-button") {
    return (
      <Card
        variant={variant}
        size={size}
        render={
          <button
            type="button"
            data-card-interactive="button"
            onClick={(event) => { event.currentTarget.dataset.activated = "true" }}
          />
        }
        className="w-full max-w-sm"
      >
        <CardHeader>
          <CardTitle>重新同步数据</CardTitle>
          <CardDescription>点击整张卡片执行一次明确动作</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          使用原生按钮语义，可通过 Space 或 Enter 触发。
        </CardContent>
      </Card>
    )
  }

  if (scenario === "info") {
    return (
      <Card variant={variant} size={size} className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>信息说明</CardTitle>
          <CardDescription>仅展示静态内容，不含操作</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          用于展示帮助说明、配置摘要等只读信息，不需要 Footer 和 Action。
        </CardContent>
      </Card>
    )
  }

  if (scenario === "media") {
    return (
      <Card variant={variant} size={size} className="w-full max-w-sm">
        <CardMedia>
          <img src="/avatars/01.jpg" alt="客户会话预览" />
        </CardMedia>
        <CardHeader>
          <CardTitle>客户会话预览</CardTitle>
          <CardDescription>媒体区作为卡片第一个结构节点，贴齐顶部并由 Card 裁切。</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          媒体自身决定比例与 object-fit；CardMedia 不增加 cover 或 image 根属性。
        </CardContent>
      </Card>
    )
  }

  if (scenario === "action") {
    return (
      <Card variant={variant} size={size} className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>可操作列表项</CardTitle>
          <CardAction><Button variant="outline" size="sm">编辑</Button></CardAction>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          头部右上角放置操作入口，交给 CardAction 自动布局对齐。
        </CardContent>
        <CardFooter><Tag variant="outline">已启用</Tag></CardFooter>
      </Card>
    )
  }

  return (
    <Card variant={variant} size={size} className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>数据概览</CardTitle>
        <CardDescription>关键指标 + 同比说明</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-xl font-bold tracking-tight">1,204</p>
        <p className="mt-1 text-sm text-muted-foreground">较上周 +8.2%</p>
      </CardContent>
    </Card>
  )
}

function genCardPlaygroundCode(values: Record<string, string>) {
  const scenario = values.scenario as CardPlaygroundScenario
  const cardProps = ` variant="${values.variant}" size="${values.size}"`
  const importCode = `import {\n  Card,\n  CardAction,\n  CardContent,\n  CardDescription,\n  CardFooter,\n  CardHeader,\n  CardMedia,\n  CardTitle,\n} from "@/components/ui/card"`

  if (scenario === "interactive-link") {
    return `${importCode}\n\n<Card${cardProps} render={<a href="/orders/FX-2048" />}>\n  <CardHeader>\n    <CardTitle>订单 #FX-2048</CardTitle>\n    <CardDescription>点击整张卡片查看订单详情</CardDescription>\n  </CardHeader>\n  <CardContent>使用原生链接语义，可通过键盘访问。</CardContent>\n</Card>`
  }

  if (scenario === "interactive-button") {
    return `${importCode}\n\n<Card${cardProps} render={<button type="button" onClick={syncData} />}>\n  <CardHeader>\n    <CardTitle>重新同步数据</CardTitle>\n    <CardDescription>点击整张卡片执行一次明确动作</CardDescription>\n  </CardHeader>\n  <CardContent>使用原生按钮语义，可通过 Space 或 Enter 触发。</CardContent>\n</Card>`
  }

  if (scenario === "info") {
    return `${importCode}\n\n<Card${cardProps}>\n  <CardHeader>\n    <CardTitle>信息说明</CardTitle>\n    <CardDescription>仅展示静态内容，不含操作</CardDescription>\n  </CardHeader>\n  <CardContent>用于展示帮助说明、配置摘要等只读信息。</CardContent>\n</Card>`
  }

  if (scenario === "media") {
    return `${importCode}\n\n<Card${cardProps}>\n  <CardMedia>\n    <img src="/customer.jpg" alt="客户会话预览" />\n  </CardMedia>\n  <CardHeader>\n    <CardTitle>客户会话预览</CardTitle>\n    <CardDescription>媒体区放在 Card 的首个结构位置。</CardDescription>\n  </CardHeader>\n  <CardContent>媒体自身决定比例与裁切策略。</CardContent>\n</Card>`
  }

  if (scenario === "action") {
    return `${importCode}\n\n<Card${cardProps}>\n  <CardHeader>\n    <CardTitle>可操作列表项</CardTitle>\n    <CardAction>\n      <Button variant="outline" size="sm">编辑</Button>\n    </CardAction>\n  </CardHeader>\n  <CardContent>头部右上角放置操作入口。</CardContent>\n  <CardFooter>\n    <Tag variant="outline">已启用</Tag>\n  </CardFooter>\n</Card>`
  }

  return `${importCode}\n\n<Card${cardProps}>\n  <CardHeader>\n    <CardTitle>数据概览</CardTitle>\n    <CardDescription>关键指标 + 同比说明</CardDescription>\n  </CardHeader>\n  <CardContent>\n    <p>1,204</p>\n    <p>较上周 +8.2%</p>\n  </CardContent>\n</Card>`
}

export const cardPlaygroundConfig: ComponentPlaygroundConfig = {
  storySource: "docs/data/component-playgrounds.manifest.json#components.card",
  previewItemsClassName: "w-full max-w-sm",
  props: componentPlaygroundPropsFromManifest(cardPlaygroundManifest),
  initial: cardPlaygroundManifest.initial,
  stories: componentPlaygroundStoriesFromManifest(cardPlaygroundManifest),
  guidanceKey: cardPlaygroundManifest.guidanceKey,
  renderOne: renderCardPlayground,
  genCode: genCardPlaygroundCode,
}

export function CardPage({
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
    <div className={docsSpacing.pageStack}>
      <section id="card" className="flex flex-col gap-2">
        <PageLead crumb={lang === "en" ? "Components / Card" : "组件 / 卡片"} title="Card 卡片" lead="通用内容容器，用 Header / Content / Footer 等子组件搭出统一的卡片骨架。" actions={actions} />
      </section>
      <section id="card-playground" className={docsSpacing.sectionStack}>
        <SectionLead title={lang === "en" ? "Playground" : "调试台"} description={lang === "en" ? "Switch Card composition scenarios while keeping the source Card parts as the only API." : "切换 Card 组合场景，保持源码 Card 子组件为唯一 API。"} />
        <ComponentPlayground config={cardPlaygroundConfig} lang={lang} />
      </section>
      <section id="card-props" className={docsSpacing.sectionStack}>
        <h2 className="text-xl font-bold tracking-tight">API 属性</h2>
        <DocSurfaceTableCard><Table className="min-w-[640px]"><TableHeader><TableRow><TableHead className="pl-4">属性 / 子组件</TableHead><TableHead>类型</TableHead><TableHead>默认值</TableHead><TableHead className="pr-4">描述</TableHead></TableRow></TableHeader><TableBody>{propRows.map((row) => <TableRow key={row.prop}><TableCell className="pl-4 font-medium">{row.prop}</TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.type}</code></TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.defaultValue}</code></TableCell><TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell></TableRow>)}</TableBody></Table></DocSurfaceTableCard>
      </section>
      <section id="card-semantic-dom" className={docsSpacing.sectionStack}>
        <SectionLead title="语义 DOM" description="Card 源码来自 shadcn/ui，保持 open-code。这里记录 AI 和工程师应该理解的语义部位。" />
        <DocSurfaceTableCard><Table className="min-w-[640px]"><TableHeader><TableRow><TableHead className="pl-4">部位</TableHead><TableHead className="pr-4">说明</TableHead></TableRow></TableHeader><TableBody>{semanticDomRows.map((row) => <TableRow key={row.part}><TableCell className="pl-4 font-medium"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.part}</code></TableCell><TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell></TableRow>)}</TableBody></Table></DocSurfaceTableCard>
      </section>
      <section id="card-do-dont" className={docsSpacing.sectionStack}>
        <SectionLead title="正误示例" description="工程师和 AI 生成代码最容易犯的错误，照着做即可。" />
        <div className="grid gap-4 md:grid-cols-2">{["do", "dont"].map((kind) => <WebsiteCardContainer key={kind}><CardHeader><CardTitle className="text-base text-foreground">{kind === "do" ? "推荐 Do" : "避免 Don't"}</CardTitle></CardHeader><CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">{doDontRows.map((row) => <div key={`${kind}-${kind === "do" ? row.do : row.dont}`} className="flex gap-2"><span className={`mt-2 size-1.5 shrink-0 rounded-full ${kind === "do" ? "bg-success" : "bg-destructive"}`} /><span>{kind === "do" ? row.do : row.dont}</span></div>)}</CardContent></WebsiteCardContainer>)}</div>
      </section>
    </div>
  )
}

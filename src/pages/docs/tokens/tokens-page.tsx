import { useMemo, useState, type ComponentType, type ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tag } from "@/components/ui/tag"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WebsiteCardContainer } from "@/components/fx/website-card-container"
import { PageLead } from "@/components/fx/page-lead"
import { ArrowRightIcon, ComponentsIcon, ContractIcon, DatabaseIcon, LockIcon, RefreshIcon } from "@/lib/icons"
import { docsSpacing } from "@/lib/docs-spacing"

export type TokensPageLang = "zh" | "en"

export type FoundationGroup = {
  id: string
  label: string
  count: number
  tokens: string[]
}

export type FoundationTokenView = {
  path: string
  layer: "primitive" | "map"
  viewLayer: "seed" | "primitive" | "map"
  type: string
  name: string
  legacyName: string
  value: string
  legacyValue: string
  visibility: string
  stability: string
  profile?: string
  categoryId: string
  semanticReferences: string[]
}

export type TokenLayerView = {
  id: "primitive" | "map" | "semantic" | "component"
  order: number
  title: string
  titleEn: string
  description: string
  descriptionEn: string
  owner: string
  permission: string
  permissionEn: string
  example: string
  count: number
}

export type TokenNamingView = {
  globalPrefix: string
  componentPrefix: string
  globalGrammar: string[]
  componentGrammar: string[]
  globalExample: string
  componentExample: string
  forbiddenAbbreviations: string[]
}

export type TokenAdmissionView = {
  component: string
  owner: string
  hookCount: number
  reason: string
}

export type TokenMigrationView = {
  phase: string
  phases: string[]
  legacyPrefix: string
}

export type TokensPageModel = {
  layers: TokenLayerView[]
  naming: TokenNamingView
  admissions: TokenAdmissionView[]
  migration: TokenMigrationView
}

const foundationGroupLabels: Record<string, string> = {
  color: "色彩",
  spacing: "间距",
  size: "尺寸",
  "font-family": "字族",
  "font-size": "字号",
  "line-height": "行高",
  "font-weight": "字重",
  radius: "圆角",
  "border-width": "边框粗细",
  "icon-stroke": "图标线宽",
  opacity: "透明度",
  blur: "模糊",
  duration: "时长",
  easing: "缓动",
  "z-index": "层级",
}

const foundationTypeLabels: Record<string, string> = {
  color: "颜色",
  dimension: "尺寸",
  fontFamily: "字族",
  fontWeight: "字重",
  number: "数值",
  duration: "时长",
  cubicBezier: "缓动",
}

const foundationLayerLabels = {
  seed: { zh: "Seed", en: "Seed" },
  primitive: { zh: "Primitive", en: "Primitive" },
  map: { zh: "Map", en: "Map" },
} as const

const layerIcons: Record<TokenLayerView["id"], ComponentType> = {
  primitive: DatabaseIcon,
  map: RefreshIcon,
  semantic: ContractIcon,
  component: ComponentsIcon,
}

const migrationLabels: Record<string, { zh: string; en: string; desc: string; descEn: string }> = {
  "contract-only": { zh: "冻结合同", en: "Contract only", desc: "先确定分层、语法和公开边界。", descEn: "Freeze layers, grammar, and publication boundaries." },
  "dual-write": { zh: "双轨兼容", en: "Dual write", desc: "FDS 是真相，旧前缀只保留引用别名。", descEn: "FDS is the truth; legacy prefixes remain aliases only." },
  "fds-primary": { zh: "FDS 主用", en: "FDS primary", desc: "源码和发布物都以 FDS 名称为主。", descEn: "Source and releases use FDS names as primary." },
  "legacy-removal": { zh: "移除旧名", en: "Legacy removal", desc: "下一个 Major 删除完成废弃期的别名。", descEn: "A future major removes aliases after deprecation." },
}

export const tokenAnchors = [
  { label: "四层架构", labelEn: "Four layers", href: "#tokens-architecture" },
  { label: "命名规范", labelEn: "Naming", href: "#tokens-naming" },
  { label: "权限边界", labelEn: "Ownership", href: "#tokens-ownership" },
  { label: "组件准入", labelEn: "Component admission", href: "#tokens-admission" },
  { label: "兼容迁移", labelEn: "Migration", href: "#tokens-migration" },
  { label: "基础层清单", labelEn: "Foundation inventory", href: "#tokens-foundation" },
  { label: "分类浏览", labelEn: "Categories", href: "#tokens-categories" },
]

function SectionHeading({ title, titleEn, description, descriptionEn, lang }: {
  title: string
  titleEn: string
  description: string
  descriptionEn: string
  lang: TokensPageLang
}) {
  return <div className="flex flex-col gap-1">
    <h2 className="text-section-title">{lang === "en" ? titleEn : title}</h2>
    <p className="text-body text-muted-foreground">{lang === "en" ? descriptionEn : description}</p>
  </div>
}

export function TokensPage({ actions, lang, model, foundationGroups, foundationTokens }: {
  actions: ReactNode
  lang: TokensPageLang
  model: TokensPageModel
  foundationGroups: FoundationGroup[]
  foundationTokens: FoundationTokenView[]
}) {
  const hasComponentLayer = model.layers.some((layer) => layer.id === "component")
  const [foundationLayer, setFoundationLayer] = useState<"all" | FoundationTokenView["viewLayer"]>("all")
  const [foundationQuery, setFoundationQuery] = useState("")
  const [selectedToken, setSelectedToken] = useState<FoundationTokenView | null>(null)
  const foundationLayerCounts = useMemo(() => ({
    all: foundationTokens.length,
    seed: foundationTokens.filter((token) => token.viewLayer === "seed").length,
    primitive: foundationTokens.filter((token) => token.viewLayer === "primitive").length,
    map: foundationTokens.filter((token) => token.viewLayer === "map").length,
  }), [foundationTokens])
  const visibleFoundationTokens = useMemo(() => {
    const query = foundationQuery.trim().toLowerCase()
    return foundationTokens.filter((token) => {
      if (foundationLayer !== "all" && token.viewLayer !== foundationLayer) return false
      if (!query) return true
      return [token.name, token.path, token.value, token.categoryId, ...token.semanticReferences].some((value) => value.toLowerCase().includes(query))
    })
  }, [foundationLayer, foundationQuery, foundationTokens])

  return (
    <div className={docsSpacing.pageStack}>
      <section id="tokens" className="flex flex-col gap-2">
        <PageLead
          crumb={lang === "en" ? "Design Tokens / Overview" : "设计令牌 / 概览"}
          title={lang === "en" ? "FDS Design Tokens" : "FDS 设计令牌"}
          lead={hasComponentLayer
            ? (lang === "en" ? "A governed four-layer contract turns foundational values into cross-framework semantics and admitted component hooks." : "一套受治理的四层合同，把基础物理值变成跨框架语义和经过准入的组件 Hook。")
            : (lang === "en" ? "A governed Foundation contract presents physical values, generated maps, and their stable semantic references." : "一套受治理的 Foundation 合同，展示基础物理值、生成式 Map 与稳定语义引用。")}
          actions={actions}
        />
      </section>

      <section id="tokens-architecture" className={`${docsSpacing.sectionStack} scroll-mt-24`}>
        <SectionHeading title={hasComponentLayer ? "四层架构" : "基础分层"} titleEn={hasComponentLayer ? "Four-layer architecture" : "Foundation layers"} description={hasComponentLayer ? "从物理事实到组件公开接口，越往上使用意图越明确。不是每个 Token 都必须机械经过四层。" : "Primitive 是物理事实，Map 是生成刻度，Semantic 只作为基础值的使用去向展示。"} descriptionEn={hasComponentLayer ? "Intent becomes more explicit from physical facts to public component hooks. Not every token must mechanically traverse all four layers." : "Primitive holds physical facts, Map holds generated scales, and Semantic is shown only as a governed destination."} lang={lang} />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {model.layers.map((layer, index) => {
            const Icon = layerIcons[layer.id]
            return <div key={layer.id} className="relative min-w-0">
              <WebsiteCardContainer className="h-full">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3"><Icon aria-hidden="true" /><CardDescription>{String(layer.order).padStart(2, "0")}</CardDescription></div>
                    <Tag variant="secondary">{layer.count}</Tag>
                  </div>
                  <CardTitle>{lang === "en" ? layer.titleEn : layer.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <p className="text-body text-muted-foreground">{lang === "en" ? layer.descriptionEn : layer.description}</p>
                  <code className="block overflow-hidden rounded-lg bg-muted px-3 py-2 text-caption text-foreground">{layer.example}</code>
                </CardContent>
              </WebsiteCardContainer>
              {index < model.layers.length - 1 ? <ArrowRightIcon aria-hidden="true" className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 bg-background xl:block" /> : null}
            </div>
          })}
        </div>
      </section>

      <section id="tokens-naming" className={`${docsSpacing.sectionStack} scroll-mt-24`}>
        <SectionHeading title="命名怎么读" titleEn="How to read a token name" description={hasComponentLayer ? "全局 Token 和组件 Hook 使用不同前缀与语法；字段从稳定范围逐步走向具体意图。" : "Foundation 使用全局 Token 前缀与受控语法，字段从稳定范围逐步走向具体意图。"} descriptionEn={hasComponentLayer ? "Global tokens and component hooks use separate prefixes and grammars, moving from stable scope toward specific intent." : "Foundation uses the global token prefix and governed grammar, moving from stable scope toward specific intent."} lang={lang} />
        <div className={hasComponentLayer ? "grid gap-4 lg:grid-cols-2" : "grid gap-4"}>
          <WebsiteCardContainer>
            <CardHeader><CardDescription>{model.naming.globalPrefix}</CardDescription><CardTitle>{lang === "en" ? "Global Hooks" : "全局 Token"}</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-4">
              <code className="rounded-lg bg-muted px-3 py-3 text-caption text-foreground">{model.naming.globalExample}</code>
              <div className="flex flex-col gap-2">{model.naming.globalGrammar.map((grammar) => <code key={grammar} className="text-caption text-muted-foreground">{grammar}</code>)}</div>
            </CardContent>
          </WebsiteCardContainer>
          {hasComponentLayer ? <WebsiteCardContainer>
            <CardHeader><CardDescription>{model.naming.componentPrefix}</CardDescription><CardTitle>{lang === "en" ? "Component Styling Hooks" : "组件 Styling Hooks"}</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-4">
              <code className="rounded-lg bg-muted px-3 py-3 text-caption text-foreground">{model.naming.componentExample}</code>
              <div className="flex flex-col gap-2">{model.naming.componentGrammar.map((grammar) => <code key={grammar} className="text-caption text-muted-foreground">{grammar}</code>)}</div>
            </CardContent>
          </WebsiteCardContainer> : null}
        </div>
        <p className="text-caption text-muted-foreground">{lang === "en" ? "Default state and default variant are omitted. Forbidden abbreviations: " : "默认状态和默认变体省略。禁用缩写："}{model.naming.forbiddenAbbreviations.join(" / ")}</p>
      </section>

      <section id="tokens-ownership" className={`${docsSpacing.sectionStack} scroll-mt-24`}>
        <SectionHeading title="谁能改什么" titleEn="Ownership and authoring" description="四层不是文件分类，而是权限和责任边界。" descriptionEn="The layers are ownership and permission boundaries, not merely file categories." lang={lang} />
        <WebsiteCardContainer padding="none">
          <Table>
            <TableHeader><TableRow><TableHead className="pl-4">{lang === "en" ? "Layer" : "层级"}</TableHead><TableHead>{lang === "en" ? "Owner" : "负责人"}</TableHead><TableHead className="pr-4">{lang === "en" ? "Authoring rule" : "修改规则"}</TableHead></TableRow></TableHeader>
            <TableBody>{model.layers.map((layer) => <TableRow key={layer.id}><TableCell className="pl-4"><div className="flex items-center gap-2"><LockIcon aria-hidden="true" /><span>{lang === "en" ? layer.titleEn : layer.title}</span></div></TableCell><TableCell>{layer.owner}</TableCell><TableCell className="pr-4 text-muted-foreground">{lang === "en" ? layer.permissionEn : layer.permission}</TableCell></TableRow>)}</TableBody>
          </Table>
        </WebsiteCardContainer>
      </section>

      {hasComponentLayer ? <section id="tokens-admission" className={`${docsSpacing.sectionStack} scroll-mt-24`}>
        <SectionHeading title="组件 Hook 不是批量生成" titleEn="Component hooks are admitted, not mass-generated" description="只有存在独立换肤需求、全局语义缺口、跨场景复用和完整测试证据，组件才进入这一层。" descriptionEn="A component enters this layer only with independent theming need, a semantic gap, cross-context reuse, and complete test evidence." lang={lang} />
        <div className="grid gap-4 md:grid-cols-3">
          {model.admissions.map((admission) => <WebsiteCardContainer key={admission.component}>
            <CardHeader><div className="flex items-center justify-between gap-3"><CardTitle>{admission.component}</CardTitle><Tag variant="secondary">{admission.hookCount} Hooks</Tag></div><CardDescription>{admission.owner}</CardDescription></CardHeader>
            <CardContent><p className="text-body text-muted-foreground">{admission.reason}</p></CardContent>
          </WebsiteCardContainer>)}
        </div>
      </section> : null}

      <section id="tokens-migration" className={`${docsSpacing.sectionStack} scroll-mt-24`}>
        <SectionHeading title="兼容迁移" titleEn="Compatibility migration" description={`当前阶段：${model.migration.phase}。旧 ${model.migration.legacyPrefix} 不再是第二真相源。`} descriptionEn={`Current phase: ${model.migration.phase}. Legacy ${model.migration.legacyPrefix} is no longer a second source of truth.`} lang={lang} />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {model.migration.phases.map((phase, index) => {
            const copy = migrationLabels[phase]
            const active = phase === model.migration.phase
            return <WebsiteCardContainer key={phase} tone={active ? "accent" : "default"}>
              <CardHeader><div className="flex items-center justify-between gap-3"><CardDescription>{String(index + 1).padStart(2, "0")}</CardDescription>{active ? <Tag variant="default">{lang === "en" ? "Current" : "当前"}</Tag> : null}</div><CardTitle>{lang === "en" ? copy.en : copy.zh}</CardTitle></CardHeader>
              <CardContent><p className="text-body text-muted-foreground">{lang === "en" ? copy.descEn : copy.desc}</p></CardContent>
            </WebsiteCardContainer>
          })}
        </div>
      </section>

      <section id="tokens-foundation" className={`${docsSpacing.sectionStack} scroll-mt-24`}>
        <SectionHeading title="无语义基础层清单" titleEn="Foundation inventory" description="按设计类别浏览，按 Seed / Primitive / Map 筛选；协作者和 AI 只读，不得新增、上传或直接修改。" descriptionEn="Browse by design category and filter by Seed, Primitive, or Map. Collaborators and agents have read-only access." lang={lang} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {foundationGroups.map((group) => <WebsiteCardContainer key={group.id}><CardContent className="flex items-center justify-between gap-4 p-4"><div className="min-w-0"><div className="text-label">{lang === "en" ? group.label : foundationGroupLabels[group.id] ?? group.label}</div><div className="mt-1 truncate text-caption text-muted-foreground">{group.tokens[0]}{group.tokens.length > 1 ? ` … ${group.tokens[group.tokens.length - 1]}` : ""}</div></div><span className="shrink-0 text-caption tabular-nums text-muted-foreground">{group.count}</span></CardContent></WebsiteCardContainer>)}
        </div>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Tabs value={foundationLayer} onValueChange={(value) => setFoundationLayer(value as typeof foundationLayer)}>
            <TabsList variant="line" size="sm">
              <TabsTrigger value="all">{lang === "en" ? "All" : "全部"} {foundationLayerCounts.all}</TabsTrigger>
              <TabsTrigger value="seed">Seed {foundationLayerCounts.seed}</TabsTrigger>
              <TabsTrigger value="primitive">Primitive {foundationLayerCounts.primitive}</TabsTrigger>
              <TabsTrigger value="map">Map {foundationLayerCounts.map}</TabsTrigger>
            </TabsList>
          </Tabs>
          <Input type="search" value={foundationQuery} onChange={(event) => setFoundationQuery(event.target.value)} placeholder={lang === "en" ? "Search token, value, or semantic reference" : "搜索 Token、值或语义引用"} aria-label={lang === "en" ? "Search Foundation tokens" : "搜索 Foundation Token"} className="lg:max-w-sm" />
        </div>
        {visibleFoundationTokens.length ? <WebsiteCardContainer padding="none">
          <Table density="compact" maxHeight="34rem" className="min-w-[920px]">
            <TableHeader sticky><TableRow><TableHead className="pl-4">Token</TableHead><TableHead>{lang === "en" ? "Value" : "值"}</TableHead><TableHead>{lang === "en" ? "Category" : "分类"}</TableHead><TableHead>{lang === "en" ? "Layer" : "层级"}</TableHead><TableHead className="pr-4 text-right">Semantic</TableHead></TableRow></TableHeader>
            <TableBody>{visibleFoundationTokens.map((token) => <TableRow key={token.name}>
              <TableCell className="pl-4"><div className="flex items-center gap-2">{token.type === "color" ? <span aria-hidden="true" className="size-4 shrink-0 rounded-sm border border-border" style={{ backgroundColor: `var(${token.name})` }} /> : null}<Button variant="plain" size="sm" onClick={() => setSelectedToken(token)}>{token.name}</Button></div></TableCell>
              <TableCell><code className="block max-w-72 truncate text-caption text-muted-foreground">{token.value}</code></TableCell>
              <TableCell>{lang === "en" ? foundationGroups.find((group) => group.id === token.categoryId)?.label ?? token.categoryId : foundationGroupLabels[token.categoryId] ?? token.categoryId}</TableCell>
              <TableCell><Tag variant="secondary">{foundationLayerLabels[token.viewLayer][lang]}</Tag></TableCell>
              <TableCell className="pr-4 text-right tabular-nums text-muted-foreground">{token.semanticReferences.length}</TableCell>
            </TableRow>)}</TableBody>
          </Table>
        </WebsiteCardContainer> : <Empty className="border border-border"><EmptyHeader><EmptyTitle>{lang === "en" ? "No matching tokens" : "没有匹配的 Token"}</EmptyTitle><EmptyDescription>{lang === "en" ? "Try another layer or search term." : "换一个层级或搜索词试试。"}</EmptyDescription></EmptyHeader></Empty>}
        <p className="text-caption text-muted-foreground">{lang === "en" ? `${visibleFoundationTokens.length} of ${foundationTokens.length} tokens. Select a token to inspect its governed source and semantic references.` : `当前显示 ${visibleFoundationTokens.length} / ${foundationTokens.length} 个 Token。点击名称查看受治理来源和 Semantic 引用。`}</p>
      </section>

      <section id="tokens-categories" className={`${docsSpacing.sectionStack} scroll-mt-24`}>
        <SectionHeading title="按分类浏览" titleEn="Browse by category" description="查看各基础刻度与当前语义映射。" descriptionEn="Inspect each foundational scale and its current semantic mappings." lang={lang} />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            { label: "颜色", labelEn: "Colors", desc: "品牌色、色板、语义色", descEn: "Brand, palettes, semantics", href: "#tokens-colors" },
            { label: "排版", labelEn: "Typography", desc: "字号、字重、字族", descEn: "Size, weight, family", href: "#tokens-typography" },
            { label: "圆角", labelEn: "Radius", desc: "控件、卡片、浮层圆角", descEn: "Controls, cards, overlays", href: "#tokens-radius" },
            { label: "阴影", labelEn: "Shadow", desc: "L1/L2/L3 投影", descEn: "L1/L2/L3 elevation", href: "#tokens-shadow" },
            { label: "间距", labelEn: "Spacing", desc: "页面节奏与组件密度", descEn: "Page rhythm and density", href: "#tokens-spacing" },
            { label: "层级", labelEn: "Layer", desc: "z-index 约定", descEn: "z-index conventions", href: "#tokens-layer" },
            { label: "动效", labelEn: "Motion", desc: "时长、缓动、进出场", descEn: "Duration, easing, transitions", href: "#tokens-motion" },
          ].map((item) => <a key={item.href} href={item.href} className="block h-full"><WebsiteCardContainer className="h-full"><CardContent className="flex flex-col gap-1 p-4"><div className="text-label">{lang === "en" ? item.labelEn : item.label}</div><div className="text-body text-muted-foreground">{lang === "en" ? item.descEn : item.desc}</div></CardContent></WebsiteCardContainer></a>)}
        </div>
      </section>

      <Sheet open={selectedToken !== null} onOpenChange={(open) => { if (!open) setSelectedToken(null) }}>
        <SheetContent side="right" size="lg">
          {selectedToken ? <>
            <SheetHeader>
              <div className="flex items-center gap-2"><Tag variant="secondary">{foundationLayerLabels[selectedToken.viewLayer][lang]}</Tag><span className="text-caption text-muted-foreground">{lang === "en" ? "Read only" : "只读"}</span></div>
              <SheetTitle>{selectedToken.name}</SheetTitle>
              <SheetDescription>{lang === "en" ? "Foundation token details and governed references." : "Foundation Token 详情与受治理引用关系。"}</SheetDescription>
            </SheetHeader>
            <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-(--fds-g-spacing-panel-padding) pb-(--fds-g-spacing-panel-padding)">
              {selectedToken.type === "color" ? <div className="aspect-[3/1] w-full rounded-lg border border-border" style={{ backgroundColor: `var(${selectedToken.name})` }} /> : null}
              <dl className="grid grid-cols-[minmax(7rem,auto)_1fr] gap-x-4 gap-y-3 text-body">
                <dt className="text-muted-foreground">{lang === "en" ? "Category" : "分类"}</dt><dd>{lang === "en" ? foundationGroups.find((group) => group.id === selectedToken.categoryId)?.label ?? selectedToken.categoryId : foundationGroupLabels[selectedToken.categoryId] ?? selectedToken.categoryId}</dd>
                <dt className="text-muted-foreground">{lang === "en" ? "Type" : "类型"}</dt><dd>{lang === "en" ? selectedToken.type : foundationTypeLabels[selectedToken.type] ?? selectedToken.type}</dd>
                <dt className="text-muted-foreground">{lang === "en" ? "Value" : "实际值"}</dt><dd><code className="break-all text-caption">{selectedToken.value}</code></dd>
                <dt className="text-muted-foreground">{lang === "en" ? "Source" : "真相源"}</dt><dd><code className="break-all text-caption">{selectedToken.viewLayer === "map" ? "tokens/source/map.tokens.json" : "tokens/source/primitive.tokens.json"}</code></dd>
                <dt className="text-muted-foreground">{lang === "en" ? "Path" : "结构路径"}</dt><dd><code className="break-all text-caption">{selectedToken.path}</code></dd>
                <dt className="text-muted-foreground">{lang === "en" ? "Authoring" : "修改权限"}</dt><dd>{selectedToken.viewLayer === "map" ? (lang === "en" ? "Generator output only" : "只允许生成器产出") : (lang === "en" ? "Foundation maintainers only" : "仅 Foundation 维护者可修改")}</dd>
                <dt className="text-muted-foreground">{lang === "en" ? "Visibility" : "公开性"}</dt><dd>{selectedToken.visibility}</dd>
                <dt className="text-muted-foreground">{lang === "en" ? "Stability" : "稳定性"}</dt><dd>{selectedToken.stability}</dd>
                {selectedToken.profile ? <><dt className="text-muted-foreground">Profile</dt><dd>{selectedToken.profile}</dd></> : null}
              </dl>
              <Separator />
              <div className="flex flex-col gap-3">
                <div><h3 className="text-label">{lang === "en" ? "Semantic references" : "Semantic 引用"}</h3><p className="mt-1 text-caption text-muted-foreground">{lang === "en" ? "Global Semantic tokens that directly or transitively depend on this Foundation token." : "直接或间接依赖这个 Foundation Token 的 Global Semantic Token。"}</p></div>
                {selectedToken.semanticReferences.length ? <div className="flex flex-col gap-2">{selectedToken.semanticReferences.map((reference) => <code key={reference} className="rounded-md bg-muted px-3 py-2 text-caption text-foreground">{reference}</code>)}</div> : <p className="text-body text-muted-foreground">{lang === "en" ? "No current Semantic reference." : "目前没有 Semantic 引用。"}</p>}
              </div>
            </div>
          </> : null}
        </SheetContent>
      </Sheet>
    </div>
  )
}

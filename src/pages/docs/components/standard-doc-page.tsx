import { useContext, useState, type ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CopyIcon } from "@/lib/icons"
import { DocDoDont } from "@/components/fx/doc-do-dont"
import { DocSurfaceCard, DocSurfaceTableCard } from "@/components/fx/doc-surface"
import { WebsiteCardContainer } from "@/components/fx/website-card-container"
import { PageLead as FxPageLead } from "@/components/fx/page-lead"
import { SectionLead } from "@/components/fx/section-lead"
import { docsSpacing } from "@/lib/docs-spacing"
import { getDisplayTitle, PageTitleMetaContext } from "@/lib/page-title-meta"
import { StandardScenarioPlayground, type StandardScenarioExample } from "@/pages/docs/components/standard-scenario-playground"

export type StandardDocLang = "zh" | "en"
export type ScenarioRow = {
  key: string
  group?: string
  title: string
  preview: ReactNode
  spec?: string
  intent: string
  constraint: string
  code: string
}

function copyTextFallback(text: string) {
  const textarea = document.createElement("textarea")
  textarea.value = text
  textarea.setAttribute("readonly", "")
  textarea.style.position = "fixed"
  textarea.style.top = "-9999px"
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand("copy")
  document.body.removeChild(textarea)
}

function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).catch(() => copyTextFallback(text))
    return
  }
  copyTextFallback(text)
}

export function CopyCodeBlock({ code, label, lang }: { code: string; label: string; lang: StandardDocLang }) {
  return (
    <div className="relative rounded-lg bg-muted">
      <pre className="max-w-full overflow-x-auto p-4 pr-14 text-sm"><code>{code}</code></pre>
      <div className="absolute right-3 top-3">
        <Button type="button" variant="ghost" size="icon-sm" aria-label={lang === "en" ? `Copy ${label}` : `复制${label}`} onClick={() => copyText(code)}>
          <CopyIcon data-icon="inline-start" />
        </Button>
      </div>
    </div>
  )
}

export function ScenarioTable({
  rows,
  filters,
  lang,
  layout = "table",
}: {
  rows: ScenarioRow[]
  filters?: { value: string; label: string; labelEn?: string }[]
  lang: StandardDocLang
  layout?: "table" | "stack"
  elevated?: boolean
}) {
  const [filter, setFilter] = useState(filters?.[0]?.value ?? "all")
  const shown = filters ? rows.filter((row) => row.group === filter) : rows
  const hasSpec = shown.some((row) => row.spec)
  const filterTabs = filters ? (
    <Tabs value={filter} onValueChange={setFilter} aria-label={lang === "en" ? "Filter examples" : "筛选场景"}>
      <TabsList className="flex h-auto flex-wrap justify-start">
        {filters.map((item) => <TabsTrigger key={item.value} value={item.value}>{lang === "en" ? item.labelEn ?? item.label : item.label}</TabsTrigger>)}
      </TabsList>
    </Tabs>
  ) : null

  if (layout === "stack") {
    return <>
      {filterTabs}
      <div className="flex flex-col gap-5">
        {shown.map((row) => <WebsiteCardContainer key={row.key} padding="none">
          <div className="flex items-center justify-between gap-3 border-b border-border-subtle px-4 py-2.5"><span className="font-medium">{row.title}</span>{row.spec ? <span className="text-sm text-muted-foreground">{row.spec}</span> : null}</div>
          <div className="overflow-x-auto p-5">{row.preview}</div>
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(320px,1.2fr)] gap-4 border-t border-border-subtle p-4">
            <div className="grid gap-3"><div className="flex flex-col gap-1"><div className="text-sm font-medium text-muted-foreground">{lang === "en" ? "Intent" : "使用意图"}</div><div className="leading-6 text-muted-foreground">{row.intent}</div></div><div className="flex flex-col gap-1"><div className="text-sm font-medium text-muted-foreground">{lang === "en" ? "Constraint" : "约束"}</div><div className="leading-6 text-muted-foreground">{row.constraint}</div></div></div>
            <div className="flex min-w-0 flex-col gap-1"><div className="text-sm font-medium text-muted-foreground">{lang === "en" ? "Recommended API" : "推荐写法"}</div><div className="rounded-lg bg-muted"><pre className="break-words whitespace-pre-wrap px-3 py-2 text-sm"><code>{row.code}</code></pre></div></div>
          </div>
        </WebsiteCardContainer>)}
      </div>
    </>
  }

  return <>
    {filterTabs}
    <DocSurfaceTableCard className="max-w-full">
      <Table className="w-auto"><TableHeader><TableRow><TableHead className="pl-4">{lang === "en" ? "Usage" : "用法"}</TableHead><TableHead>{lang === "en" ? "Example" : "示例"}</TableHead>{hasSpec ? <TableHead>{lang === "en" ? "Spec" : "规格"}</TableHead> : null}<TableHead>{lang === "en" ? "Intent" : "使用意图"}</TableHead><TableHead>{lang === "en" ? "Constraint" : "约束"}</TableHead><TableHead className="pr-4">{lang === "en" ? "Recommended API" : "推荐写法"}</TableHead></TableRow></TableHeader><TableBody>
        {shown.map((row) => <TableRow key={row.key} className="hover:bg-transparent has-aria-expanded:bg-transparent"><TableCell className="h-auto py-3 pl-4 align-top"><span className="font-medium">{row.title}</span></TableCell><TableCell className="h-auto py-3 align-top"><div className="max-w-[400px]">{row.preview}</div></TableCell>{hasSpec ? <TableCell className="h-auto py-3 align-top text-foreground"><div className="w-max text-sm">{row.spec ?? "—"}</div></TableCell> : null}<TableCell className="h-auto whitespace-normal py-3 align-top text-muted-foreground"><div className="max-w-[240px] break-words leading-6">{row.intent}</div></TableCell><TableCell className="h-auto whitespace-normal py-3 align-top text-muted-foreground"><div className="max-w-[260px] break-words leading-6">{row.constraint}</div></TableCell><TableCell className="h-auto py-3 pr-4 align-top"><div className="max-w-[360px] rounded-lg bg-muted"><pre className="break-words whitespace-pre-wrap px-3 py-2 text-sm"><code>{row.code}</code></pre></div></TableCell></TableRow>)}
      </TableBody></Table>
    </DocSurfaceTableCard>
  </>
}

export function StandardDocPage({
  slug,
  title,
  lead,
  playground,
  overview,
  overviewMatrix,
  hideOverview,
  hideScenarioExamples,
  hideUsage,
  scenarioExamples,
  scenarioFilters,
  scenarioLayout,
  renderScenarioPreview,
  importCode,
  usageCode,
  propRows,
  semanticDomRows,
  doDontRows,
  actions,
  lang,
  autoScenarioSlugs = [],
  storyPresentation,
  playgroundDescription,
}: {
  slug: string
  title: string
  lead: ReactNode
  playground?: ReactNode
  overview: ReactNode
  overviewMatrix?: ReactNode
  hideOverview?: boolean
  hideScenarioExamples?: boolean
  hideUsage?: boolean
  scenarioExamples: StandardScenarioExample[]
  scenarioFilters?: { value: string; label: string; labelEn?: string }[]
  scenarioLayout?: "table" | "stack"
  renderScenarioPreview: (id: string) => ReactNode
  importCode: string
  usageCode: string
  propRows: { prop: string; type: string; defaultValue: string; desc: string }[]
  semanticDomRows: { part: string; desc: string }[]
  doDontRows: { do: string; dont: string }[]
  actions: ReactNode
  lang: StandardDocLang
  autoScenarioSlugs?: string[]
  storyPresentation?: "presets" | "examples"
  playgroundDescription?: ReactNode
}) {
  const titleMeta = useContext(PageTitleMetaContext)
  const displayTitle = getDisplayTitle(title, lang === "en" ? undefined : titleMeta)
  // An explicit Playground is already the executable overview. Keep the
  // manifest route for pages whose Playground is generated automatically.
  const playgroundPrimary = Boolean(playground) || autoScenarioSlugs.includes(slug)
  const resolvedPlayground = playground ?? (playgroundPrimary ? <StandardScenarioPlayground slug={slug} examples={scenarioExamples} renderScenarioPreview={renderScenarioPreview} importCode={importCode} lang={lang} storyPresentation={storyPresentation} /> : null)
  const structureExamples = storyPresentation === "examples"
  const showOverview = !hideOverview && !playgroundPrimary
  const showScenarioExamples = !hideScenarioExamples && !playgroundPrimary
  const showUsage = !hideUsage && !playgroundPrimary

  return <div className={docsSpacing.pageStack}>
    <section id={slug} className="flex flex-col gap-2"><FxPageLead crumb={lang === "en" ? `Components / ${title}` : `组件 / ${displayTitle}`} title={displayTitle} titleMeta={lang === "en" ? undefined : titleMeta} lead={lead} actions={actions} /></section>
    {resolvedPlayground ? <section id={`${slug}-playground`} className={docsSpacing.sectionStack}><SectionLead title={structureExamples ? (lang === "en" ? "Composition examples" : "结构示例") : (lang === "en" ? "Playground" : "调试台")} description={playgroundDescription ?? (structureExamples ? (lang === "en" ? "Switch between verified composition examples and copy the recommended code." : "切换已验证的结构用法并复制推荐代码。") : (lang === "en" ? "Pick a scenario or tweak props live, then copy the generated code." : "选场景或实时调属性，预览随之变化，写法可一键复制。"))} />{resolvedPlayground}</section> : null}
    {showOverview ? <section id={`${slug}-overview`} className={docsSpacing.sectionStack}><SectionLead title={lang === "en" ? "Overview" : "组件总览"} description={lang === "en" ? "A compact look at the component to quickly see what it looks like." : "紧凑展示该组件的样子，用来快速查看长什么样。"} />{overviewMatrix ?? <DocSurfaceCard><div className="flex items-center gap-3 p-5">{overview}</div></DocSurfaceCard>}</section> : null}
    {showScenarioExamples ? <section id={`${slug}-preview`} className={docsSpacing.sectionStack}><SectionLead title="场景示例" description="常见用法与适用场景。" /><ScenarioTable lang={lang} layout={scenarioLayout} filters={scenarioFilters} rows={scenarioExamples.map((example) => ({ key: example.id, group: example.group, title: example.title, preview: renderScenarioPreview(example.id), spec: example.spec, intent: example.intent, constraint: example.rule, code: example.code }))} elevated /></section> : null}
    {showUsage ? <section id={`${slug}-usage`} className={docsSpacing.sectionStack}><SectionLead title="使用方式" description={usageCode ? "把 import 和完整组装写法复制到业务页面里使用。" : "复制 import 即可；更多组合写法见上方「调试台」的代码 Tab。"} /><DocSurfaceCard><div className="grid gap-4 p-5"><CopyCodeBlock code={importCode} label="Import" lang={lang} />{usageCode ? <CopyCodeBlock code={usageCode} label="调用" lang={lang} /> : null}</div></DocSurfaceCard></section> : null}
    <section id={`${slug}-props`} className={docsSpacing.sectionStack}><SectionLead title="API 属性" /><DocSurfaceTableCard><Table className="min-w-[640px]"><TableHeader><TableRow><TableHead className="pl-4">属性 / 子组件</TableHead><TableHead>类型</TableHead><TableHead>默认值</TableHead><TableHead className="pr-4">描述</TableHead></TableRow></TableHeader><TableBody>{propRows.map((row) => <TableRow key={row.prop}><TableCell className="pl-4 font-medium">{row.prop}</TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.type}</code></TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.defaultValue}</code></TableCell><TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell></TableRow>)}</TableBody></Table></DocSurfaceTableCard></section>
    <section id={`${slug}-semantic-dom`} className={docsSpacing.sectionStack}><SectionLead title="语义 DOM" description="源码来自 shadcn/ui，保持 open-code。这里记录 AI 和工程师应该理解的语义部位。" /><DocSurfaceTableCard><Table className="min-w-[640px]"><TableHeader><TableRow><TableHead className="pl-4">部位</TableHead><TableHead className="pr-4">说明</TableHead></TableRow></TableHeader><TableBody>{semanticDomRows.map((row) => <TableRow key={row.part}><TableCell className="pl-4 font-medium"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.part}</code></TableCell><TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell></TableRow>)}</TableBody></Table></DocSurfaceTableCard></section>
    <section id={`${slug}-do-dont`} className={docsSpacing.sectionStack}><SectionLead title="正误示例" description="工程师和 AI 生成代码最容易犯的错误，照着做即可。" /><DocDoDont rows={doDontRows} /></section>
  </div>
}

import { Tag } from "@/components/ui/tag"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WebsiteCardContainer } from "@/components/fx/website-card-container"
import { CountBadge, StepBadge } from "@/pages/docs/governance/governance-graph-primitives"

export type GraphCockpitLang = "zh" | "en"

export type GraphCockpitActionFlow = {
  id: string
  title: string
  titleEn: string
  desc: string
  descEn: string
  href: string
  linkLabel: string
  linkLabelEn: string
  checkCommand: string
  done: string
  doneEn: string
  steps: {
    file: string
    action: string
    actionEn: string
    note: string
    noteEn: string
  }[]
}

export type GraphCockpitTaskRoute = {
  id: string
  label: string
  labelEn: string
  match: string[]
  flowId: string
  firstDecision: string
  firstDecisionEn: string
  outputCheck: string
}

export type GraphCockpitMetrics = {
  nodeCount: number
  edgeCount: number
  staleCount: number
  relationCount: number
  relationGroupCount: number
  siteRelationCount: number
  projectRelationCount: number
  groups: { scope: "site" | "project"; group: string; count: number }[]
}

type LocalizedActionFlow = GraphCockpitActionFlow & {
  title: string
  desc: string
  linkLabel: string
  done: string
  check: string
  steps: { file: string; action: string; note: string }[]
}

type LocalizedTaskRoute = GraphCockpitTaskRoute & {
  label: string
  firstDecision: string
  flowTitle: string
}

export function GraphCockpit({
  lang,
  actionFlows,
  taskRoutes: routes,
  metrics,
}: {
  lang: GraphCockpitLang
  actionFlows: GraphCockpitActionFlow[]
  taskRoutes: GraphCockpitTaskRoute[]
  metrics: GraphCockpitMetrics
}) {
  const actionCards: LocalizedActionFlow[] = actionFlows.map((flow) => ({
    ...flow,
    title: lang === "en" ? flow.titleEn : flow.title,
    desc: lang === "en" ? flow.descEn : flow.desc,
    linkLabel: lang === "en" ? flow.linkLabelEn : flow.linkLabel,
    done: lang === "en" ? flow.doneEn : flow.done,
    check: flow.checkCommand,
    steps: flow.steps.map((step) => ({
      ...step,
      action: lang === "en" ? step.actionEn : step.action,
      note: lang === "en" ? step.noteEn : step.note,
    })),
  }))

  const taskRoutes: LocalizedTaskRoute[] = routes.map((route) => {
    const flow = actionFlows.find((item) => item.id === route.flowId)
    return {
      ...route,
      label: lang === "en" ? route.labelEn : route.label,
      firstDecision: lang === "en" ? route.firstDecisionEn : route.firstDecision,
      flowTitle: flow ? (lang === "en" ? flow.titleEn : flow.title) : route.flowId,
    }
  })

  const metricCards = [
    {
      label: lang === "en" ? "Files / facts" : "文件节点",
      value: metrics.nodeCount,
      desc: lang === "en" ? "This tells you the governed surface is not only src files." : "说明治理范围不只是 src，还包括 docs、scripts、rules、skills、data。",
    },
    {
      label: lang === "en" ? "Reference edges" : "自动引用边",
      value: metrics.edgeCount,
      desc: lang === "en" ? "Use this when you need raw file-level references." : "要追真实文件引用时看它，不用靠猜。",
    },
    {
      label: lang === "en" ? "System relations" : "工程关系",
      value: metrics.relationCount,
      desc: lang === "en" ? "Use this first when deciding what a change may affect." : "判断改动影响范围时先看它。",
    },
    {
      label: lang === "en" ? "Stale nodes" : "过期节点",
      value: metrics.staleCount,
      desc: lang === "en" ? "Zero means the current rule docs have no stale markers." : "为 0 说明当前规则文档没有过期标记。",
    },
  ]

  return (
    <WebsiteCardContainer className="overflow-hidden">
      <CardHeader>
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <CardTitle>{lang === "en" ? "Project Cockpit" : "工程驾驶舱"}</CardTitle>
            <CardDescription>
              {lang === "en" ? "A compact view of the generated graph plus curated engineering relations." : "把自动扫描的项目图谱和人工整理的工程关系放在一起看。"}
            </CardDescription>
          </div>
          <Tag variant="outline">project-graph.v0.3</Tag>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="rounded-2xl border border-primary/25 bg-primary/5 p-4">
          <div className="text-sm font-semibold text-foreground">{lang === "en" ? "What this is useful for" : "这个面板真正用来干嘛"}</div>
          <p className="mt-2 text-sm text-muted-foreground">
            {lang === "en" ? "The numbers are only evidence. The useful part is choosing the right source file, relation view, and check command before changing code." : "数字只是证据，不是结论。真正有用的是：你要改东西时，它告诉你先看哪份事实表、哪张关系图、最后跑哪个检查。"}
          </p>
          <Tabs defaultValue="style" className="mt-4 flex flex-col gap-5">
            <TabsList className="grid !h-auto w-full grid-cols-1 items-stretch justify-stretch gap-3 bg-transparent p-0 md:grid-cols-2 xl:grid-cols-4">
              {actionCards.map((action) => (
                <TabsTrigger key={action.id} value={action.id} className="h-full min-h-24 w-full items-start justify-start whitespace-normal rounded-xl border border-border bg-background px-3 py-3 text-left data-active:border-primary data-active:bg-background">
                  <span className="flex min-w-0 flex-col items-start gap-1">
                    <span className="text-sm font-semibold">{action.title}</span>
                    <span className="line-clamp-3 whitespace-normal break-words text-xs font-normal leading-5 text-muted-foreground">{action.desc}</span>
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
            {actionCards.map((action) => (
              <TabsContent key={action.id} value={action.id} className="mt-0">
                <div className="rounded-2xl border border-border bg-background p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="text-sm font-semibold text-foreground">{action.title}</div>
                      <p className="mt-1 text-sm text-muted-foreground">{action.desc}</p>
                    </div>
                    <a href={action.href} className="text-sm font-medium text-primary hover:underline">{action.linkLabel}</a>
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-4">
                    {action.steps.map((step, index) => (
                      <div key={`${action.id}-${step.file}`} className="relative rounded-xl border border-border bg-muted p-3">
                        <StepBadge index={index} />
                        <div className="mt-3 text-sm font-semibold text-foreground">{step.action}</div>
                        <code className="mt-2 block break-words rounded bg-muted px-2 py-1.5 text-xs text-foreground">{step.file}</code>
                        <p className="mt-2 text-xs leading-5 text-muted-foreground">{step.note}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
                    <div className="rounded-xl bg-muted p-3">
                      <div className="text-xs font-medium text-muted-foreground">{lang === "en" ? "Check" : "检查命令"}</div>
                      <code className="mt-2 block w-fit rounded bg-background px-2 py-1 text-xs text-foreground">{action.check}</code>
                    </div>
                    <div className="rounded-xl bg-muted p-3">
                      <div className="text-xs font-medium text-muted-foreground">{lang === "en" ? "Done means" : "完成标准"}</div>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{action.done}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <div className="rounded-2xl border border-border bg-background p-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="text-sm font-semibold text-foreground">{lang === "en" ? "Task Routing" : "任务路由"}</div>
              <p className="mt-1 text-sm text-muted-foreground">{lang === "en" ? "When a user or DevInspector request arrives, AI should route it here first, then follow the matching action flow." : "用户或 DevInspector 任务进来时，AI 先在这里判断走哪条工作流，再按对应行动链路执行。"}</p>
            </div>
            <Tag variant="outline">{taskRoutes.length}</Tag>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {taskRoutes.map((route) => (
              <div key={route.id} className="rounded-xl border border-border bg-muted p-3">
                <div className="flex flex-wrap items-center gap-2"><div className="text-sm font-semibold text-foreground">{route.label}</div><Tag variant="outline">{route.flowTitle}</Tag></div>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{route.firstDecision}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">{route.match.slice(0, 6).map((keyword) => <code key={keyword} className="rounded bg-muted px-1.5 py-0.5 text-xs text-foreground">{keyword}</code>)}</div>
                <code className="mt-3 block w-fit rounded bg-muted px-1.5 py-0.5 text-xs text-foreground">{route.outputCheck}</code>
              </div>
            ))}
          </div>
        </div>

        <Collapsible>
          <div className="rounded-2xl border border-border bg-background p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-sm font-semibold text-foreground">{lang === "en" ? "Evidence Details" : "证据详情"}</div>
                <p className="mt-1 text-sm text-muted-foreground">{lang === "en" ? "Open this when you need the graph numbers, relation split, and group evidence behind the cockpit." : "需要看驾驶舱背后的图谱数字、关系分布和分组证据时再展开。"}</p>
              </div>
              <CollapsibleTrigger render={<Button variant="outline" size="sm" />}>{lang === "en" ? "Show evidence" : "展开证据"}</CollapsibleTrigger>
            </div>
            <CollapsibleContent className="mt-4 flex flex-col gap-4">
              <div className="grid gap-3 md:grid-cols-4">
                {metricCards.map((metric) => (
                  <div key={metric.label} className="rounded-xl border border-border bg-muted p-4">
                    <div className="text-xs font-medium text-muted-foreground">{metric.label}</div>
                    <div className="mt-2 text-xl font-bold tracking-tight text-foreground">{metric.value}</div>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">{metric.desc}</p>
                  </div>
                ))}
              </div>
              <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                <div className="rounded-xl border border-border bg-muted p-4">
                  <div className="text-sm font-semibold text-foreground">{lang === "en" ? "Relation Split" : "关系分布"}</div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <RelationMetric label={lang === "en" ? "Site relations" : "网站关系"} value={metrics.siteRelationCount} desc={lang === "en" ? "How this docs site runs and reads data." : "解释这个文档站怎么运行、读数据、渲染页面。"} />
                    <RelationMetric label={lang === "en" ? "Project relations" : "项目关系"} value={metrics.projectRelationCount} desc={lang === "en" ? "How fx-ui files support real project delivery." : "解释 fx-ui 工程文件如何支撑真实项目交付。"} />
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">{lang === "en" ? "Use generated edges to find raw references; use system relations to understand responsibility and impact." : "自动边用来找真实引用；工程关系用来看职责和影响。两者合起来，才不会只剩一堆文件名。"}</p>
                </div>
                <div className="rounded-xl border border-border bg-muted p-4">
                  <div className="flex items-center justify-between gap-3"><div className="text-sm font-semibold text-foreground">{lang === "en" ? "Relation Groups" : "关系分组"}</div><CountBadge>{metrics.relationGroupCount}</CountBadge></div>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {metrics.groups.map((group) => <div key={`${group.scope}-${group.group}`} className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2"><div><div className="text-sm font-medium text-foreground">{group.group}</div><div className="text-xs text-muted-foreground">{group.scope === "site" ? "网站" : "项目"}</div></div><CountBadge>{group.count}</CountBadge></div>)}
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </CardContent>
    </WebsiteCardContainer>
  )
}

function RelationMetric({ label, value, desc }: { label: string; value: number; desc: string }) {
  return <div className="rounded-lg bg-muted p-3"><div className="text-xs text-muted-foreground">{label}</div><div className="mt-1 text-xl font-semibold">{value}</div><p className="mt-1 text-xs leading-5 text-muted-foreground">{desc}</p></div>
}

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StandardDocPage, type StandardDocLang } from "@/pages/docs/components/standard-doc-page"

type ScenarioExample = { id: string; title: string; intent: string; rule: string; code: string; group?: string; spec?: string }
type PropRow = { prop: string; type: string; defaultValue: string; desc: string }
type SemanticDomRow = { part: string; desc: string }
type DoDontRow = { do: string; dont: string }

export const tabsAnchors = [
  { label: "组件总览", href: "#tabs-overview" },
  { label: "场景示例", href: "#tabs-preview" },
  { label: "使用方式", href: "#tabs-usage" },
  { label: "API", href: "#tabs-props" },
  { label: "语义 DOM", href: "#tabs-semantic-dom" },
  { label: "正误示例", href: "#tabs-do-dont" },
]

export const tabsPropRows = [
  { prop: "Tabs", type: "defaultValue? / value? / onValueChange? / orientation?", defaultValue: 'orientation="horizontal"', desc: "根节点，可受控或非受控管理当前标签；orientation 控制水平/垂直方向。" },
  { prop: "TabsList.variant", type: '"default" | "line"', defaultValue: '"default"', desc: "default 为分段式表面，line 为轻量指示线。" },
  { prop: "TabsList.size", type: '"sm" | "md" | "lg"', defaultValue: '"md"', desc: "统一控制标签栏高度、触发器字号和水平内边距。" },
  { prop: "TabsList.activateOnFocus", type: "boolean", defaultValue: "false", desc: "焦点通过方向键移动时是否同时激活对应面板；默认保留 Enter/Space 确认。" },
  { prop: "TabsList.loopFocus", type: "boolean", defaultValue: "true", desc: "Base UI 键盘漫游是否首尾循环。" },
  { prop: "TabsTrigger", type: "value: string / disabled?: boolean", defaultValue: "—", desc: "标签触发器；value 与 TabsContent 一一对应，disabled 保留原生禁用语义。" },
  { prop: "TabsContent", type: "value: string", defaultValue: "—", desc: "对应标签的内容面板。" },
]

export const tabsSemanticDomRows = [
  { part: '[data-slot="tabs"][data-orientation]', desc: "根容器，data-orientation 标记水平/垂直布局。" },
  { part: '[data-slot="tabs-list"][data-variant][data-size]', desc: "标签栏，data-variant 与 data-size 承载受治理的视觉和尺寸轴。" },
  { part: '[data-slot="tabs-trigger"][data-active]', desc: "标签触发器，data-active 标记当前激活项。" },
  { part: '[data-slot="tabs-content"]', desc: "内容面板，仅显示当前激活标签对应的内容。" },
]

export const tabsDoDontRows = [
  { do: "标签数量保持在 2-5 个，文案简短并列。", dont: "塞入七八个标签，挤压每个标签的可点击区域。" },
  { do: "用 value 与路由参数或业务状态同步。", dont: "标签切换后 URL/状态不变，刷新回到默认页。" },
  { do: "line 用于卡片内或高密度区域的轻量切换。", dont: "把 line 当页面级主导航，弱化当前位置。" },
  { do: "设置侧栏使用 orientation=vertical，并保留方向键漫游。", dont: "用按钮列表手写选中态和键盘逻辑。" },
]

function renderTabsScenario(id: string) {
  if (id === "vertical") {
    return (
      <Tabs defaultValue="profile" orientation="vertical" className="min-h-32">
        <TabsList variant="line" size="lg" activateOnFocus>
          <TabsTrigger value="profile">个人资料</TabsTrigger>
          <TabsTrigger value="security">安全设置</TabsTrigger>
          <TabsTrigger value="notifications" disabled>通知</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">资料内容...</TabsContent>
        <TabsContent value="security">安全内容...</TabsContent>
      </Tabs>
    )
  }

  if (id === "line") {
    return (
      <Tabs defaultValue="all">
        <TabsList variant="line" size="sm">
          <TabsTrigger value="all">全部</TabsTrigger>
          <TabsTrigger value="active">进行中</TabsTrigger>
          <TabsTrigger value="done">已完成</TabsTrigger>
        </TabsList>
      </Tabs>
    )
  }

  return (
    <Tabs defaultValue="overview">
      <TabsList size="md">
        <TabsTrigger value="overview">概览</TabsTrigger>
        <TabsTrigger value="detail">详情</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

export function TabsPage({
  actions,
  lang,
  scenarioExamples,
  propRows,
  semanticDomRows,
  doDontRows,
  autoScenarioSlugs,
}: {
  actions: React.ReactNode
  lang: StandardDocLang
  scenarioExamples: ScenarioExample[]
  propRows: PropRow[]
  semanticDomRows: SemanticDomRow[]
  doDontRows: DoDontRow[]
  autoScenarioSlugs: string[]
}) {
  return (
    <StandardDocPage
      slug="tabs"
      title="Tabs 标签页"
      lead="在同一区域内切换并列内容，支持两种视觉、三档尺寸与水平/垂直方向。"
      overview={renderTabsScenario("default")}
      scenarioExamples={scenarioExamples}
      renderScenarioPreview={renderTabsScenario}
      importCode={'import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"'}
      usageCode={`<Tabs defaultValue="overview">
  <TabsList size="md">
    <TabsTrigger value="overview">概览</TabsTrigger>
    <TabsTrigger value="detail">详情</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">概览内容...</TabsContent>
  <TabsContent value="detail">详情内容...</TabsContent>
</Tabs>`}
      propRows={propRows}
      semanticDomRows={semanticDomRows}
      doDontRows={doDontRows}
      actions={actions}
      lang={lang}
      autoScenarioSlugs={autoScenarioSlugs}
    />
  )
}

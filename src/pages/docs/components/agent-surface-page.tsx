import { useState, type ReactNode } from "react"

import { AgentSurface, type AgentSurfaceEvent, type AgentSurfaceSchema } from "@/components/fx/agent-surface"
import { PageLead } from "@/components/fx/page-lead"
import { SectionLead } from "@/components/fx/section-lead"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Tag } from "@/components/ui/tag"
import { Textarea } from "@/components/ui/textarea"
import { WebsiteCardContainer } from "@/components/fx/website-card-container"
import { CopyCodeBlock } from "@/pages/docs/components/standard-doc-page"
import { docsSpacing } from "@/lib/docs-spacing"

export type AgentSurfacePageLang = "zh" | "en"

export const agentSurfaceAnchors = [
  { label: "组件总览", labelEn: "Overview", href: "#agent-surface-overview" },
  { label: "高频场景", labelEn: "Scenarios", href: "#agent-surface-scenarios" },
  { label: "视觉规范", labelEn: "Visual", href: "#agent-surface-visual" },
  { label: "Mock 预览", labelEn: "Mock preview", href: "#agent-surface-playground" },
  { label: "实时示例", labelEn: "Live example", href: "#agent-surface-demo" },
  { label: "JSON 协议", labelEn: "JSON protocol", href: "#agent-surface-schema" },
  { label: "协议取舍", labelEn: "Protocol strategy", href: "#agent-surface-strategy" },
  { label: "安全边界", labelEn: "Safety", href: "#agent-surface-safety" },
]

const agentSurfaceNavLabel = { zh: "Agent 界面", en: "Agent Surface" } as const

export function AgentSurfacePage({ actions, lang }: { actions: ReactNode; lang: AgentSurfacePageLang }) {
  const sampleSurface: AgentSurfaceSchema = {
    id: "customer-followup",
    title: lang === "en" ? "Customer follow-up suggestion" : "客户跟进建议",
    description:
    lang === "en" ?
    "This surface is generated from controlled JSON, then rendered by local fx-ui React components." :
    "这块界面来自受控 JSON，再由本地 fx-ui React 组件渲染。",
    blocks: [
    {
      type: "text",
      text:
      lang === "en" ?
      "Agent found one customer object and one related file. The following cards are not static HTML." :
      "Agent 识别到一个客户对象和一个相关文件。下面这些卡片不是静态 HTML。"
    },
    {
      type: "object-card",
      title: lang === "en" ? "Customer object" : "客户对象",
      description: lang === "en" ? "Generated from Agent context." : "由 Agent 上下文生成。",
      fields: [
      { label: lang === "en" ? "Customer" : "客户", value: lang === "en" ? "Stellar Tech" : "星河科技" },
      { label: lang === "en" ? "Status" : "状态", value: lang === "en" ? "Needs follow-up" : "待跟进" },
      { label: lang === "en" ? "Risk" : "风险", value: lang === "en" ? "Contract delay" : "合同延期" },
      { label: lang === "en" ? "Owner" : "负责人", value: lang === "en" ? "Sales team" : "销售团队" }],

      actions: [
      { label: lang === "en" ? "Generate plan" : "生成跟进计划", event: "generate_followup", payload: { customerId: "cus_001" } },
      { label: lang === "en" ? "Mark reviewed" : "标记已读", event: "mark_reviewed", variant: "outline" }]

    },
    {
      type: "file-card",
      title: lang === "en" ? "Related file" : "相关文件",
      filename: "采购合同.pdf",
      meta: "PDF",
      summary:
      lang === "en" ?
      "The Agent can ask the host system to summarize this file, but the button only emits an event." :
      "Agent 可以请求宿主系统总结这个文件，但按钮本身只发事件。",
      actions: [
      { label: lang === "en" ? "Summarize file" : "总结文件", event: "summarize_file", payload: { fileId: "file_001" }, variant: "outline" }]

    },
    {
      type: "insight-card",
      title: lang === "en" ? "Prioritize follow-up" : "建议优先跟进",
      summary:
      lang === "en" ?
      "The contract is already delayed, and the last two conversations did not confirm a next step." :
      "合同已经延期，且最近两次沟通都没有确认下一步。",
      tone: "warning",
      evidence:
      lang === "en" ?
      ["Contract status: delayed", "Recent conversations: no confirmed next date"] :
      ["合同状态：延期", "最近沟通：未确认新时间"],
      actions: [
      { label: lang === "en" ? "Draft follow-up" : "生成跟进话术", event: "draft_followup", payload: { customerId: "cus_001" }, variant: "outline" }]

    },
    {
      type: "action-row",
      actions: [
      { label: lang === "en" ? "Continue analysis" : "继续分析", event: "continue_analysis" },
      { label: lang === "en" ? "Cancel" : "取消", event: "cancel", variant: "ghost" }]

    }]

  };
  const unsupportedSurface: AgentSurfaceSchema = {
    id: "unsupported-demo",
    blocks: [
    {
      id: "unknown-1",
      type: "custom-html-widget"
    }]

  };
  const [events, setEvents] = useState<AgentSurfaceEvent[]>([]);
  const sampleJson = JSON.stringify(sampleSurface, null, 2);
  const [mockJson, setMockJson] = useState(sampleJson);
  let mockSurface: AgentSurfaceSchema | null = null;
  let mockError = "";

  try {
    const parsed = JSON.parse(mockJson) as Partial<AgentSurfaceSchema>;

    if (typeof parsed.id !== "string") {
      mockError = lang === "en" ? "surface.id must be a string." : "surface.id 必须是字符串。";
    } else if (!Array.isArray(parsed.blocks)) {
      mockError = lang === "en" ? "surface.blocks must be an array." : "surface.blocks 必须是数组。";
    } else {
      mockSurface = parsed as AgentSurfaceSchema;
    }
  } catch (error) {
    mockError = error instanceof Error ? error.message : lang === "en" ? "Invalid JSON." : "JSON 格式不正确。";
  }

  const handleAction = (event: AgentSurfaceEvent) => {
    setEvents((current) => [event, ...current].slice(0, 4));
  };

  return (
    <div className={docsSpacing.pageStack}>
      <section id="agent-surface" className="flex flex-col gap-3">
        <PageLead
          crumb={lang === "en" ? `Business Compositions / ${agentSurfaceNavLabel.en}` : `业务组合组件 / ${agentSurfaceNavLabel.zh}`}
          title={lang === "en" ? "AgentSurface" : agentSurfaceNavLabel.zh}
          lead={lang === "en" ?
          "A controlled generative UI surface: Agent returns JSON intent, fx-ui renders trusted React components, and user actions become events." :
          "受控生成式 UI 渲染面：Agent 返回 JSON 意图，fx-ui 渲染可信 React 组件，用户操作变成事件。"}
          actions={actions} />
      </section>

      <section id="agent-surface-overview" className={docsSpacing.sectionStack}>
        <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Overview" : "组件总览"}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
          [lang === "en" ? "Agent sends JSON" : "Agent 发 JSON", lang === "en" ? "Not React, HTML, CSS, or JS." : "不是 React、HTML、CSS 或 JS。"],
          [lang === "en" ? "Frontend renders React" : "前端渲染 React", lang === "en" ? "Only local fx-ui components are used." : "只使用本地 fx-ui 组件。"],
          [lang === "en" ? "Actions are events" : "Action 只是事件", lang === "en" ? "Buttons call onAction with event payloads." : "按钮只把事件交给 onAction。"]].
          map(([title, desc]) =>
          <WebsiteCardContainer key={title}>
              <CardHeader>
                <CardTitle className="text-base">{title}</CardTitle>
                <CardDescription>{desc}</CardDescription>
              </CardHeader>
            </WebsiteCardContainer>
          )}
        </div>
      </section>

      <section id="agent-surface-scenarios" className={docsSpacing.sectionStack}>
        <SectionLead title={
        lang === "en" ? "High-frequency Scenarios" : "高频场景"} description={

        lang === "en" ?
        "Start from what company Agents actually return, then decide which blocks deserve to become stable components." :
        "先从公司 Agent 真实回复里最高频的内容出发，再决定哪些 block 值得沉淀成稳定组件。"} />

        
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <WebsiteCardContainer>
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <Tag variant="outline">phase-1</Tag>
                <CardTitle className="text-base">{lang === "en" ? "Implemented blocks" : "已落地能力"}</CardTitle>
              </div>
              <CardDescription>
                {lang === "en" ?
                "These are already supported by AgentSurface and can be tested in the mock preview." :
                "这些已经进入 AgentSurface 白名单，可以在 Mock 预览里直接测试。"}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {[
              [
              lang === "en" ? "Object information" : "对象信息",
              "object-card",
              lang === "en" ? "User sees a compact business object summary." : "用户看到一个业务对象摘要。",
              lang === "en" ? "Use when the Agent found a customer, order, project, or approval." : "Agent 找到客户、订单、项目、审批单时使用。"],

              [
              lang === "en" ? "File information" : "文件信息",
              "file-card",
              lang === "en" ? "User sees the file name, type, summary, and safe actions." : "用户看到文件名、类型、摘要和安全操作。",
              lang === "en" ? "Use when the Agent references contracts, reports, attachments, or docs." : "Agent 引用合同、报告、附件或知识库文档时使用。"],

              [
              lang === "en" ? "Insight / recommendation" : "建议/结论",
              "insight-card",
              lang === "en" ? "User sees the conclusion first, then evidence and next action." : "用户先看结论，再看依据和下一步。",
              lang === "en" ? "Use when the Agent has a judgment, risk hint, or recommendation." : "Agent 给出判断、风险提示或推荐动作时使用。"],

              [
              lang === "en" ? "Action area" : "操作区",
              "action-row",
              lang === "en" ? "User chooses the next step; the UI only emits events." : "用户选择下一步；UI 只发事件。",
              lang === "en" ? "Use for continue, generate, open details, or cancel." : "用于继续分析、生成、查看详情或取消。"]].

              map(([title, block, userSees, rule]) =>
              <div key={block} className="flex flex-col gap-3 rounded-xl border border-border bg-background p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <CardTitle className="text-base">{title}</CardTitle>
                    <Tag variant="secondary">{block}</Tag>
                  </div>
                  <p className="text-sm leading-6 text-foreground">{userSees}</p>
                  <p className="text-sm leading-6 text-muted-foreground">{rule}</p>
                </div>
              )}
            </CardContent>
          </WebsiteCardContainer>
          <WebsiteCardContainer>
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <Tag variant="secondary">phase-2</Tag>
                <CardTitle className="text-base">{lang === "en" ? "To validate" : "待验证场景"}</CardTitle>
              </div>
              <CardDescription>
                {lang === "en" ?
                "These should not become components until real Agent responses repeat the same shape." :
                "这些先不要急着做组件，等真实 Agent 回复稳定复用后再沉淀。"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {[
              [lang === "en" ? "Tasks / todos" : "任务/待办", "task-card", lang === "en" ? "Follow-up, approval, missing data, confirmation." : "待跟进、待审批、待补充资料、待确认。"],
              [lang === "en" ? "Result list" : "多对象列表", "result-list", lang === "en" ? "Multiple customers, files, records, or candidates." : "多个客户、文件、记录或候选项。"],
              [lang === "en" ? "Risk / warning" : "风险/警告", "risk-card", lang === "en" ? "Missing permission, incomplete data, irreversible action." : "权限不足、数据缺失、高风险操作、不可逆动作。"],
              [lang === "en" ? "Progress state" : "进度状态", "agent-status", lang === "en" ? "Analyzing, completed, partially failed, waiting." : "正在分析、已完成、部分失败、等待用户选择。"]].
              map(([title, block, desc]) =>
              <div key={block} className="flex items-start justify-between gap-4 rounded-xl border border-border bg-muted/30 p-4">
                  <div className="flex flex-col gap-1">
                    <div className="font-medium text-foreground">{title}</div>
                    <p className="text-sm leading-6 text-muted-foreground">{desc}</p>
                  </div>
                  <Tag variant="outline">{block}</Tag>
                </div>
              )}
            </CardContent>
          </WebsiteCardContainer>
        </div>
      </section>

      <section id="agent-surface-visual" className={docsSpacing.sectionStack}>
        <SectionLead title={
        lang === "en" ? "Visual Direction" : "视觉规范"} description={

        lang === "en" ?
        "Agent UI can borrow the lightness of consumer AI cards, but it remains a subsystem of fx-ui." :
        "Agent UI 可以借用消费级 AI 卡片的轻盈感，但它仍然是 fx-ui 的子系统。"} />

        
        <WebsiteCardContainer tone="accent">
          <CardHeader>
            <CardTitle className="text-base">
              {lang === "en" ? "Visual principle" : "视觉原则"}
            </CardTitle>
            <CardDescription>
              {lang === "en" ?
              "Consumer-grade feeling, fx-ui-grade foundation: tokens, shadcn base components, and local trusted React." :
              "视觉气质参考 C 端，底层能力仍用 fx-ui：token、shadcn 基础组件和本地可信 React。"}
            </CardDescription>
          </CardHeader>
        </WebsiteCardContainer>
        <div className="grid gap-4 md:grid-cols-2">
          {[
          [
          lang === "en" ? "Borrow" : "可以借鉴",
          lang === "en" ?
          "Light cards, clear hierarchy, concise copy, calmer actions, fewer fields, and more breathing room." :
          "轻量卡片、清楚层级、短文案、克制操作、更少字段和更有呼吸感的留白。"],

          [
          lang === "en" ? "Avoid" : "不要照搬",
          lang === "en" ?
          "Brand skins, decorative gradients, marketing motion, nested cards, or a separate Agent-only component library." :
          "品牌皮肤、装饰渐变、营销动效、卡片套卡片，或给 Agent 另起一套组件库。"]].

          map(([title, desc]) =>
          <WebsiteCardContainer key={title}>
              <CardHeader>
                <CardTitle className="text-base">{title}</CardTitle>
                <CardDescription>{desc}</CardDescription>
              </CardHeader>
            </WebsiteCardContainer>
          )}
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[
          [lang === "en" ? "One subject" : "一张卡一件事", lang === "en" ? "Object, file, insight, or action group." : "对象、文件、结论或操作组。"],
          [lang === "en" ? "Conclusion first" : "先结论", lang === "en" ? "Then evidence, then action." : "再依据，最后行动。"],
          [lang === "en" ? "One primary" : "一个主操作", lang === "en" ? "At most two secondary actions." : "次操作最多两个。"],
          [lang === "en" ? "No nested cards" : "不套卡片", lang === "en" ? "Keep one visual level in the chat flow." : "保持对话流里的单一层级。"]].
          map(([title, desc]) =>
          <WebsiteCardContainer key={title}>
              <CardHeader>
                <CardTitle className="text-base">{title}</CardTitle>
                <CardDescription>{desc}</CardDescription>
              </CardHeader>
            </WebsiteCardContainer>
          )}
        </div>
      </section>

      <section id="agent-surface-playground" className={docsSpacing.sectionStack}>
        <SectionLead title={
        lang === "en" ? "Mock Preview" : "Mock 预览"} description={

        lang === "en" ?
        "Paste or edit the Agent JSON on the left. The right side renders the real AgentSurface component." :
        "在左侧粘贴或编辑 Agent JSON，右侧会用真实 AgentSurface 组件实时渲染。"} />

        
        <div className="grid gap-4 xl:grid-cols-2">
          <WebsiteCardContainer>
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle className="text-base">{lang === "en" ? "Mock JSON input" : "Mock JSON 输入"}</CardTitle>
                  <CardDescription>
                    {lang === "en" ?
                    "Use the AgentSurfaceSchema shape: id, optional title/description, and blocks." :
                    "使用 AgentSurfaceSchema 结构：id、可选 title/description，以及 blocks。"}
                  </CardDescription>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => setMockJson(sampleJson)}>
                  {lang === "en" ? "Reset" : "重置示例"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Field data-invalid={mockError ? true : undefined}>
                <FieldLabel htmlFor="agent-surface-mock-json">
                  {lang === "en" ? "Agent JSON" : "Agent JSON"}
                </FieldLabel>
                <Textarea
                  id="agent-surface-mock-json"
                  aria-invalid={mockError ? true : undefined}
                  value={mockJson}
                  onChange={(event) => setMockJson(event.target.value)}
                  className="min-h-[420px] resize-y font-mono text-xs leading-5"
                  spellCheck={false} />
                
                {mockError ?
                <FieldError>{mockError}</FieldError> :

                <FieldDescription>
                    {lang === "en" ?
                  "Unknown block types will render as the safe unsupported state." :
                  "未知 block type 会渲染成安全兜底态，不会执行未知代码。"}
                  </FieldDescription>
                }
              </Field>
            </CardContent>
          </WebsiteCardContainer>
          <WebsiteCardContainer>
            <CardHeader>
              <CardTitle className="text-base">{lang === "en" ? "Real component output" : "真实组件输出"}</CardTitle>
              <CardDescription>
                {lang === "en" ?
                "This is not an image or static HTML. It is the same React component used by AgentSurface." :
                "这里不是图片，也不是静态 HTML，而是 AgentSurface 真实 React 组件渲染结果。"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {mockSurface ?
              <AgentSurface surface={mockSurface} onAction={handleAction} /> :

              <WebsiteCardContainer data-slot="agent-surface-playground-error" tone="muted">
                  <CardContent className="text-sm text-muted-foreground">
                    {lang === "en" ? "Fix the JSON input to preview the component." : "修正左侧 JSON 后，这里会显示组件预览。"}
                  </CardContent>
                </WebsiteCardContainer>
              }
            </CardContent>
          </WebsiteCardContainer>
        </div>
      </section>

      <section id="agent-surface-demo" className={docsSpacing.sectionStack}>
        <SectionLead title={
        lang === "en" ? "Live Example" : "实时示例"} description={

        lang === "en" ?
        "Click a button below. The UI does not execute Agent code; it only emits an event." :
        "点击下面的按钮。UI 不会执行 Agent 代码，只会发出事件。"} />

        
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <AgentSurface surface={sampleSurface} onAction={handleAction} />
          <WebsiteCardContainer>
            <CardHeader>
              <CardTitle className="text-base">{lang === "en" ? "Event log" : "事件日志"}</CardTitle>
              <CardDescription>
                {lang === "en" ? "What the host app receives from AgentSurface." : "宿主应用从 AgentSurface 收到的内容。"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {events.length > 0 ?
              events.map((event, index) =>
              <code key={`${event.event}-${index}`} className="block rounded bg-muted px-2 py-1.5 text-xs text-foreground">
                    {JSON.stringify(event)}
                  </code>
              ) :

              <p className="text-sm text-muted-foreground">{lang === "en" ? "No event yet." : "还没有事件。"}</p>
              }
            </CardContent>
          </WebsiteCardContainer>
        </div>
      </section>

      <section id="agent-surface-schema" className={docsSpacing.sectionStack}>
        <SectionLead title={
        lang === "en" ? "JSON Protocol" : "JSON 协议"} description={

        lang === "en" ?
        "The first version supports text, object-card, file-card, and action-row." :
        "第一版支持 text、object-card、file-card 和 action-row。"} />

        
        <CopyCodeBlock code={sampleJson} label="AgentSurface JSON" lang={lang} />
      </section>

      <section id="agent-surface-strategy" className={docsSpacing.sectionStack}>
        <SectionLead title={
        lang === "en" ? "Protocol Strategy" : "协议取舍"} description={

        lang === "en" ?
        "fx-ui references mature generative UI ideas, but the first phase stays lightweight so real Agent cards can ship first." :
        "fx-ui 会参考成熟生成式 UI 思路，但第一阶段先保持轻协议，让真实 Agent 卡片先跑起来。"} />

        
        <div className="grid gap-4 md:grid-cols-2">
          {[
          [
          lang === "en" ? "Borrow" : "借鉴",
          lang === "en" ?
          "A2UI catalog/surface/action ideas, AG-UI event thinking, Vercel-style local React rendering, and MCP-style structured tool results." :
          "借鉴 A2UI 的 catalog/surface/action、AG-UI 的事件思路、Vercel 的本地 React 渲染、MCP 的结构化工具结果。"],

          [
          lang === "en" ? "Defer" : "暂缓",
          lang === "en" ?
          "Do not start with a full cross-client protocol, remote component registry, complex event bus, or long-term compatibility layer." :
          "暂时不做完整跨端协议、远程组件注册、复杂事件总线和长期兼容层。"]].

          map(([title, desc]) =>
          <WebsiteCardContainer key={title}>
              <CardHeader>
                <CardTitle className="text-base">{title}</CardTitle>
                <CardDescription>{desc}</CardDescription>
              </CardHeader>
            </WebsiteCardContainer>
          )}
        </div>
        <WebsiteCardContainer tone="accent">
          <CardHeader>
            <CardTitle className="text-base">
              {lang === "en" ? "First phase rule" : "第一阶段规则"}
            </CardTitle>
            <CardDescription>
              {lang === "en" ?
              "Light protocol first, then evaluate heavier protocols when scenarios and clients become stable." :
              "先做轻协议，后看是否接重协议；等场景稳定、多端复用或必须互通时，再评估 A2UI / AG-UI。"}
            </CardDescription>
          </CardHeader>
        </WebsiteCardContainer>
      </section>

      <section id="agent-surface-safety" className={docsSpacing.sectionStack}>
        <SectionLead title={
        lang === "en" ? "Safety" : "安全边界"} description={

        lang === "en" ?
        "Unknown blocks are shown as unsupported. The renderer does not eval, import, or inject HTML." :
        "未知 block 会显示为不支持。渲染器不会 eval、动态 import 或注入 HTML。"} />

        
        <AgentSurface surface={unsupportedSurface} />
      </section>
    </div>);

}

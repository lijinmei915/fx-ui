import { StandardDocPage, type StandardDocLang } from "@/pages/docs/components/standard-doc-page"

type ScenarioExample = { id: string; title: string; intent: string; rule: string; code: string; group?: string; spec?: string }
type PropRow = { prop: string; type: string; defaultValue: string; desc: string }
type SemanticDomRow = { part: string; desc: string }
type DoDontRow = { do: string; dont: string }

export const commandAnchors = [
  { label: "组件总览", href: "#command-overview" },
  { label: "场景示例", href: "#command-preview" },
  { label: "使用方式", href: "#command-usage" },
  { label: "API", href: "#command-props" },
  { label: "语义 DOM", href: "#command-semantic-dom" },
  { label: "正误示例", href: "#command-do-dont" },
]

export const commandPropRows = [
  { prop: "open", type: "boolean", defaultValue: "—", desc: "是否打开（受控）" },
  { prop: "onOpenChange", type: "(open: boolean) => void", defaultValue: "—", desc: "开关回调" },
  { prop: "items", type: "CommandItem[]", defaultValue: "—", desc: "可搜索项：{ id, label, group?, keywords?, onSelect }" },
  { prop: "placeholder", type: "string", defaultValue: "\"搜索…\"", desc: "搜索框占位文案" },
  { prop: "emptyText", type: "string", defaultValue: "\"无匹配结果\"", desc: "无结果时显示的文案" },
]

export const commandSemanticDomRows = [
  { part: "[data-slot=\"dialog-content\"]", desc: "复用 Dialog 弹层容器，命令面板挂载其中。" },
  { part: "[data-active=\"true\"]", desc: "当前高亮项，键盘 ↑↓ 移动、回车触发。" },
]

export const commandDoDontRows = [
  { do: "受控：自己持有 open，⌘K 监听由调用方加。", dont: "在业务层手搓输入框+过滤+键盘导航。" },
  { do: "items 的 onSelect 负责跳转/执行，keywords 提升命中。", dont: "把动作逻辑塞进组件内部。" },
  { do: "项很多时用命令面板。", dont: "几个选项也套面板，普通菜单即可。" },
]

export function CommandPage({ actions, lang, overview, scenarioExamples, renderScenarioPreview, propRows, semanticDomRows, doDontRows, autoScenarioSlugs }: {
  actions: React.ReactNode
  lang: StandardDocLang
  overview: React.ReactNode
  scenarioExamples: ScenarioExample[]
  renderScenarioPreview: (id: string) => React.ReactNode
  propRows: PropRow[]
  semanticDomRows: SemanticDomRow[]
  doDontRows: DoDontRow[]
  autoScenarioSlugs: string[]
}) {
  return (
    <StandardDocPage
      slug="command"
      title="Command 命令面板"
      lead="⌘K 命令面板：模糊搜索 + 键盘导航，用于全站快速跳转或执行命令。自建轻量实现，不引 cmdk/Radix。"
      overview={null}
      overviewMatrix={overview}
      scenarioExamples={scenarioExamples}
      renderScenarioPreview={renderScenarioPreview}
      importCode={`import { CommandPalette, type CommandItem } from "@/components/ui/command"`}
      usageCode={`const [open, setOpen] = useState(false)\n\nconst items: CommandItem[] = pages.map((p) => ({\n  id: p.href, label: p.label, group: p.group,\n  onSelect: () => { window.location.hash = p.href },\n}))\n\n<CommandPalette open={open} onOpenChange={setOpen} items={items} />`}
      propRows={propRows}
      semanticDomRows={semanticDomRows}
      doDontRows={doDontRows}
      actions={actions}
      lang={lang}
      autoScenarioSlugs={autoScenarioSlugs}
    />
  )
}

import { PageLead } from "@/components/fx/page-lead"
import { SectionLead } from "@/components/fx/section-lead"
import { DocDoDont } from "@/components/fx/doc-do-dont"
import { DocSurfaceTableCard } from "@/components/fx/doc-surface"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { docsSpacing } from "@/lib/docs-spacing"
import type { StandardDocLang } from "@/pages/docs/components/standard-doc-page"

export const inputAnchors = [
  { label: "调试台", href: "#input-playground" },
  { label: "API", href: "#input-props" },
  { label: "语义 DOM", href: "#input-semantic-dom" },
  { label: "正误示例", href: "#input-do-dont" },
]

type PropRow = { prop: string; type: string; defaultValue: string; desc: string }
type SemanticDomRow = { part: string; desc: string }
type DoDontRow = { do: string; dont: string }

export const inputPropRows: PropRow[] = [
  { prop: "size", type: "\"xs\" | \"sm\" | \"md\"", defaultValue: "sm", desc: "输入框尺寸：xs=24px、sm=28px（默认）、md=32px" },
  { prop: "type", type: "string", defaultValue: "text", desc: "原生 input 类型（text / number / email / password / search …）" },
  { prop: "disabled", type: "boolean", defaultValue: "false", desc: "禁用输入，触发禁用态样式" },
  { prop: "aria-invalid", type: "boolean", defaultValue: "false", desc: "标记当前值未通过校验，触发错误态样式" },
  { prop: "placeholder", type: "string", defaultValue: "—", desc: "占位提示文字" },
  { prop: "className", type: "string", defaultValue: "—", desc: "在保留基础样式的前提下追加 Tailwind 类名" },
  { prop: "InputGroup", type: "组件", defaultValue: "—", desc: "输入组合容器，承载前后缀、搜索按钮、固定标签等" },
  { prop: "InputAddon", type: "组件", defaultValue: "side=start", desc: "前后置固定标签块，例如 http://、PX、全部" },
  { prop: "InputAffix", type: "组件", defaultValue: "side=end", desc: "轻量前后缀内容，例如图标、¥、清除提示" },
  { prop: "InputAction", type: "button + variant=icon | primary", defaultValue: "type=button, variant=icon", desc: "输入框内动作按钮；icon 用于图标搜索/清除，primary 用于紧贴输入框的主搜索按钮" },
  { prop: "...props", type: "Omit<React.ComponentProps<\"input\">, \"size\">", defaultValue: "—", desc: "透传所有原生 input 属性（value / onChange / name / required 等），size 由组件尺寸接管" },
]

export const inputSemanticDomRows: SemanticDomRow[] = [
  { part: "data-slot=\"input\"", desc: "标记输入框根节点，供样式选择器和测试定位使用" },
  { part: "data-slot=\"input-group\"", desc: "输入组合容器，统一持有边框、焦点、禁用和错误态" },
  { part: "data-slot=\"input-addon\"", desc: "前后置固定标签块，带分隔线" },
  { part: "data-slot=\"input-affix\"", desc: "轻量前后缀区域，常用于图标或单位" },
  { part: "data-slot=\"input-action\"", desc: "输入框内动作按钮；icon 必须提供 aria-label，primary 用可见按钮文本表达动作" },
  { part: "data-slot=\"field\"", desc: "Field 字段容器，承载 label、control、description 和 error 的语义分组" },
  { part: "data-slot=\"field-label\"", desc: "字段标签，通常通过 htmlFor 与 Input 的 id 关联" },
  { part: "data-slot=\"field-error\"", desc: "字段错误文案，使用 role=\"alert\" 向辅助技术宣布错误" },
  { part: "aria-invalid", desc: "校验失败态的语义标记，同时驱动错误态样式" },
  { part: "disabled", desc: "原生禁用属性，驱动禁用态样式并阻止交互" },
]

export const inputDoDontRows: DoDontRow[] = [
  { do: "真实表单字段使用 FieldGroup + Field + FieldLabel + Input。", dont: "用 div/grid 临时拼一个字段结构。" },
  { do: "校验失败时 Field 设置 data-invalid，Input 设置 aria-invalid，并展示 FieldError。", dont: "手写红色边框 className 来表示错误态。" },
  { do: "用 data-disabled + disabled 表达不可编辑。", dont: "用样式伪装禁用（如降低透明度但仍可输入）。" },
  { do: "通过 className 追加间距、宽度等布局类。", dont: "覆盖输入框自身的边框、圆角、内边距等基础视觉。" },
]

export function InputPage({ actions, lang, playground, propRows, semanticDomRows, doDontRows }: {
  actions: React.ReactNode
  lang: StandardDocLang
  playground: React.ReactNode
  propRows: PropRow[]
  semanticDomRows: SemanticDomRow[]
  doDontRows: DoDontRow[]
}) {
  return (
    <div className={docsSpacing.pageStack}>
      <section id="input" className="flex flex-col gap-2"><PageLead crumb={lang === "en" ? "Components / Input" : "组件 / 输入框"} title="Input 输入框" lead="单行文本录入控件，用于表单字段、搜索、内联编辑等场景。" actions={actions} /></section>
      <section id="input-playground" className={docsSpacing.sectionStack}><SectionLead title={lang === "en" ? "Playground" : "调试台"} description={lang === "en" ? "Tune common Input props by default, then choose Edit component to compose parts and semantic token slots." : "默认调试常用 Input 属性；点击“编辑组件”后进入结构拼接、节点属性与语义 Token 制作模式。"} />{playground}</section>
      <section id="input-props" className={docsSpacing.sectionStack}><h2 className="text-xl font-bold tracking-tight">API 属性</h2><DocSurfaceTableCard><Table className="min-w-[640px]"><TableHeader><TableRow><TableHead className="pl-4">属性</TableHead><TableHead>类型</TableHead><TableHead>默认值</TableHead><TableHead className="pr-4">描述</TableHead></TableRow></TableHeader><TableBody>{propRows.map((row) => <TableRow key={row.prop}><TableCell className="pl-4 font-medium">{row.prop}</TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.type}</code></TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.defaultValue}</code></TableCell><TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell></TableRow>)}</TableBody></Table></DocSurfaceTableCard></section>
      <section id="input-semantic-dom" className={docsSpacing.sectionStack}><SectionLead title="语义 DOM" description="Input 源码来自 shadcn/ui，保持 open-code。这里记录 AI 和工程师应该理解的语义部位。" /><DocSurfaceTableCard><Table className="min-w-[560px]"><TableHeader><TableRow><TableHead className="pl-4">部位</TableHead><TableHead className="pr-4">说明</TableHead></TableRow></TableHeader><TableBody>{semanticDomRows.map((row) => <TableRow key={row.part}><TableCell className="pl-4 font-medium"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.part}</code></TableCell><TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell></TableRow>)}</TableBody></Table></DocSurfaceTableCard></section>
      <section id="input-do-dont" className={docsSpacing.sectionStack}><SectionLead title="正误示例" description="工程师和 AI 生成代码最容易犯的错误，照着做即可。" /><DocDoDont rows={doDontRows} /></section>
    </div>
  )
}

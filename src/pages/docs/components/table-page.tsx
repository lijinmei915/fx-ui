import { PageLead } from "@/components/fx/page-lead"
import { SectionLead } from "@/components/fx/section-lead"
import { DocDoDont } from "@/components/fx/doc-do-dont"
import { DocSurfaceTableCard } from "@/components/fx/doc-surface"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CopyCodeBlock } from "@/pages/docs/components/standard-doc-page"
import { docsSpacing } from "@/lib/docs-spacing"
import type { StandardDocLang } from "@/pages/docs/components/standard-doc-page"

type PropRow = { prop: string; type: string; defaultValue: string; desc: string }
type SemanticDomRow = { part: string; desc: string }
type DoDontRow = { do: string; dont: string }

export const tableAnchors = [
  { label: "调试台", href: "#table-playground" },
  { label: "使用方式", href: "#table-usage" },
  { label: "API", href: "#table-props" },
  { label: "语义 DOM", href: "#table-semantic-dom" },
  { label: "正误示例", href: "#table-do-dont" },
]

export const tablePropRows = [
  { prop: "Table.variant", type: '"plain" | "bordered" | "striped"', defaultValue: '"plain"', desc: "只控制表格表面：无外框、圆角描边或斑马纹；不承载 loading/empty 等业务状态" },
  { prop: "Table.density", type: '"compact" | "default" | "comfortable"', defaultValue: '"default"', desc: "尺寸轴：紧凑 28px、默认 36px、宽松 42px 行高" },
  { prop: "Table.maxHeight", type: "number | string", defaultValue: "—", desc: "给滚动容器设置最大高度，和 TableHeader sticky 组合使用" },
  { prop: "TableHeader", type: "sticky?: boolean", defaultValue: "false", desc: "表头容器；sticky 时滚动吸顶（需外层固定高度 + overflow-auto）" },
  { prop: "TableBody / TableFooter", type: "组件", defaultValue: "—", desc: "表体 / 表尾分组容器，对应 tbody / tfoot" },
  { prop: "TableRow", type: 'variant?: "default" | "static" / data-state?: "selected"', defaultValue: 'variant="default"', desc: "数据行默认带扫读 hover；Skeleton/空态占位行用 static；data-state=selected 高亮选中行" },
  { prop: "TableHead", type: "align? / pinned? / frozenLeft? / frozenEdge? / sortable? / sorted? / onSort? / filterContent? / filtered? / menuActions?", defaultValue: "—", desc: "表头单元格：对齐、冻结、排序、筛选和列操作；sortable 时同步 aria-sort。" },
  { prop: "TableCell", type: "align?: \"left\"|\"center\"|\"right\" / pinned?: \"left\"|\"right\"", defaultValue: "—", desc: "数据单元格：对齐及横向滚动时贴边固定。" },
  { prop: "TableCaption", type: "组件", defaultValue: "—", desc: "表格的整体说明文字，渲染在表格下方" },
]

export const tableSemanticDomRows = [
  { part: "data-slot=\"table-container\"", desc: "表格最外层滚动容器，承载横向滚动和容器能力。" },
  { part: "data-slot=\"table\"", desc: "真正的 <table> 根节点，承载密度 data-density 和表格内容。" },
  { part: "data-slot=\"table-header\"", desc: "表头分组容器；sticky 时吸顶。" },
  { part: "data-slot=\"table-row\"", desc: "数据行节点，承载 hover、选中态背景。" },
  { part: "data-slot=\"table-head\" / \"table-cell\"", desc: "表头单元格 / 数据单元格，承载内边距和对齐方式。" },
]

export const tableDoDontRows = [
  { do: "用 TableHeader/TableBody/TableRow 等语义子组件搭表格。", dont: "用一堆 div + Tailwind grid 手搓表格布局。" },
  { do: "需要整体说明时用 TableCaption。", dont: "在表格上方再写一段独立的 <p> 当说明文字。" },
  { do: "状态类内容用 Badge 包裹展示。", dont: "用纯文字加颜色 className 表达状态。" },
  { do: "宽表格让 Table 的外层容器自己处理横向滚动。", dont: "给每个单元格分别设置 overflow 和宽度。" },
  { do: "loading 用 Table + Skeleton，empty 用跨列空态组合。", dont: "给 Table 增加 loading 或 empty 布尔属性。" },
  { do: "分页、筛选、选择和批量操作复用既有业务列表场景。", dont: "把业务能力塞进 variant 或在页面重写一套表格。" },
]

export function TablePage({ actions, lang, playground, propRows, semanticDomRows, doDontRows }: {
  actions: React.ReactNode
  lang: StandardDocLang
  playground: React.ReactNode
  propRows: PropRow[]
  semanticDomRows: SemanticDomRow[]
  doDontRows: DoDontRow[]
}) {
  const tableImportCode = `import {\n  Table,\n  TableBody,\n  TableCaption,\n  TableCell,\n  TableHead,\n  TableHeader,\n  TableRow,\n} from "@/components/ui/table"`
  const tableUsageCode = `<Table>\n  <TableCaption>最近的客户记录</TableCaption>\n  <TableHeader>\n    <TableRow>\n      <TableHead>客户名称</TableHead>\n      <TableHead>负责人</TableHead>\n      <TableHead>客户级别</TableHead>\n      <TableHead align="right">金额(元)</TableHead>\n    </TableRow>\n  </TableHeader>\n  <TableBody>\n    {customers.map((customer) => (\n      <TableRow key={customer.id}>\n        <TableCell><a href={customer.href}>{customer.name}</a></TableCell>\n        <TableCell>{customer.owner}</TableCell>\n        <TableCell><Tag variant="outline">{customer.level}</Tag></TableCell>\n        <TableCell align="right">{customer.amount}</TableCell>\n      </TableRow>\n    ))}\n  </TableBody>\n</Table>`

  return (
    <div className={docsSpacing.pageStack}>
      <section id="table" className="flex flex-col gap-2">
        <PageLead crumb={lang === "en" ? "Components / Table" : "组件 / 表格"} title="Table 表格" lead="展示结构化的多行数据，常用于订单列表、用户管理、数据看板等场景。" actions={actions} />
      </section>
      <section id="table-playground" className={docsSpacing.sectionStack}>
        <SectionLead title={lang === "en" ? "Playground" : "调试台"} description={lang === "en" ? "Variants describe structure only; sorting, filtering, frozen columns, selection, summary, and state are composable capabilities. Comparable columns sort by default, and tables include pagination." : "变体只描述结构；排序、筛选、固定列、选择、汇总、状态都是可叠加能力。金额、数量、日期等可比较列默认支持排序，表格默认带分页。"} />
        {playground}
      </section>
      <section id="table-usage" className={docsSpacing.sectionStack}>
        <SectionLead title="使用方式" description="把 import 和 JSX 调用复制到业务页面里使用。" />
        <div className="grid gap-4"><CopyCodeBlock code={tableImportCode} label="Import" lang={lang} /><CopyCodeBlock code={tableUsageCode} label="调用" lang={lang} /></div>
      </section>
      <section id="table-props" className={docsSpacing.sectionStack}>
        <h2 className="text-xl font-bold tracking-tight">API 属性</h2>
        <DocSurfaceTableCard><Table className="min-w-[640px]"><TableHeader><TableRow><TableHead className="pl-4">子组件</TableHead><TableHead>类型</TableHead><TableHead>默认值</TableHead><TableHead className="pr-4">描述</TableHead></TableRow></TableHeader><TableBody>{propRows.map((row) => <TableRow key={row.prop}><TableCell className="pl-4 font-medium">{row.prop}</TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.type}</code></TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.defaultValue}</code></TableCell><TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell></TableRow>)}</TableBody></Table></DocSurfaceTableCard>
      </section>
      <section id="table-semantic-dom" className={docsSpacing.sectionStack}>
        <SectionLead title="语义 DOM" description="Table 源码来自 shadcn/ui，保持 open-code。这里记录 AI 和工程师应该理解的语义部位。" />
        <DocSurfaceTableCard><Table className="min-w-[560px]"><TableHeader><TableRow><TableHead className="pl-4">部位</TableHead><TableHead className="pr-4">说明</TableHead></TableRow></TableHeader><TableBody>{semanticDomRows.map((row) => <TableRow key={row.part}><TableCell className="pl-4 font-medium"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.part}</code></TableCell><TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell></TableRow>)}</TableBody></Table></DocSurfaceTableCard>
      </section>
      <section id="table-do-dont" className={docsSpacing.sectionStack}><SectionLead title="正误示例" description="工程师和 AI 生成代码最容易犯的错误，照着做即可。" /><DocDoDont rows={doDontRows} /></section>
    </div>
  )
}

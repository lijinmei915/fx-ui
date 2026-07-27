import { useState } from "react"
import { Pagination } from "@/components/ui/pagination"
import { StandardDocPage, type StandardDocLang } from "@/pages/docs/components/standard-doc-page"
import componentPlaygroundsManifestRaw from "../../../../docs/data/component-playgrounds.manifest.json?raw"
import { standardScenarioExamplesFromManifest, type ComponentPlaygroundsManifest } from "@/pages/docs/components/component-playground-manifest"

export const paginationAnchors = [
  { label: "组件总览", href: "#pagination-overview" },
  { label: "场景示例", href: "#pagination-preview" },
  { label: "使用方式", href: "#pagination-usage" },
  { label: "API", href: "#pagination-props" },
  { label: "语义 DOM", href: "#pagination-semantic-dom" },
  { label: "正误示例", href: "#pagination-do-dont" },
]

function PaginationPreview({ total, pageSize = 10, siblingCount, showTotal, initial = 1 }: { total: number; pageSize?: number; siblingCount?: number; showTotal?: boolean; initial?: number }) {
  const [page, setPage] = useState(initial)
  return <Pagination page={page} total={total} pageSize={pageSize} siblingCount={siblingCount} showTotal={showTotal} onPageChange={setPage} className="justify-start" />
}

const componentPlaygroundsManifest = JSON.parse(componentPlaygroundsManifestRaw) as ComponentPlaygroundsManifest
const paginationScenarioExamples = standardScenarioExamplesFromManifest(componentPlaygroundsManifest, "pagination")

const paginationPropRows = [
  { prop: "page", type: "number", defaultValue: "—", desc: "当前页（从 1 开始，受控）" },
  { prop: "total", type: "number", defaultValue: "—", desc: "数据总条数，用于推导总页数" },
  { prop: "pageSize", type: "number", defaultValue: "10", desc: "每页条数" },
  { prop: "siblingCount", type: "number", defaultValue: "1", desc: "当前页两侧各保留的页码数，超出用省略号" },
  { prop: "showTotal", type: "boolean", defaultValue: "true", desc: "是否显示「共 N 条」总数" },
  { prop: "onPageChange", type: "(page: number) => void", defaultValue: "—", desc: "翻页回调，外部更新 page 状态" },
]

const paginationSemanticDomRows = [
  { part: "[data-slot=\"pagination\"]", desc: "分页器根节点（nav），role=navigation、aria-label=分页。" },
  { part: "[data-slot=\"pagination-ellipsis\"]", desc: "省略号占位，页码过多时收起中间页。" },
]

const paginationDoDontRows = [
  { do: "受控用法：自己持有 page 状态，在 onPageChange 更新。", dont: "把页码列表和省略号逻辑在业务页里手搓一遍。" },
  { do: "用 total + pageSize 推导页数。", dont: "手算 totalPages 再传一堆零散 props。" },
  { do: "页码很多时依赖内置省略号收起。", dont: "一次平铺几十个页码按钮。" },
]

export function PaginationPage({ actions, lang, autoScenarioSlugs }: { actions: React.ReactNode; lang: StandardDocLang; autoScenarioSlugs: string[] }) {
  return (
    <StandardDocPage
      slug="pagination"
      title="Pagination 分页器"
      lead="分页浏览大量数据，提供页码、上一页/下一页与省略号；页码过多自动收起。"
      overview={<PaginationPreview total={48} />}
      scenarioExamples={paginationScenarioExamples}
      renderScenarioPreview={(id) => id === "ellipsis" ? <PaginationPreview total={1930} siblingCount={1} initial={6} /> : id === "no-total" ? <PaginationPreview total={48} showTotal={false} /> : <PaginationPreview total={48} />}
      importCode={`import { Pagination } from "@/components/ui/pagination"`}
      usageCode={`const [page, setPage] = useState(1)\n\n<Pagination\n  page={page}\n  total={193}\n  pageSize={10}\n  onPageChange={setPage}\n/>`}
      propRows={paginationPropRows}
      semanticDomRows={paginationSemanticDomRows}
      doDontRows={paginationDoDontRows}
      autoScenarioSlugs={autoScenarioSlugs}
      actions={actions}
      lang={lang}
    />
  )
}

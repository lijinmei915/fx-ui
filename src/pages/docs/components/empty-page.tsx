import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { InboxIcon } from "@/lib/icons"
import { StandardDocPage, type StandardDocLang } from "@/pages/docs/components/standard-doc-page"

export const emptyAnchors = [
  { label: "组件总览", labelEn: "Overview", href: "#empty-overview" },
  { label: "API", href: "#empty-props" },
  { label: "语义 DOM", labelEn: "Semantic DOM", href: "#empty-semantic-dom" },
  { label: "正误示例", labelEn: "Do / Don’t", href: "#empty-do-dont" },
]

const propRows = [
  { prop: "EmptyMedia.variant", type: "default | icon", defaultValue: "default", desc: "普通媒体区或带语义底色的图标容器。" },
  { prop: "className", type: "string", defaultValue: "—", desc: "只用于根节点宽度、高度和外部布局。" },
]

const semanticDomRows = [
  { part: 'data-slot="empty"', desc: "空状态根节点。" },
  { part: 'data-slot="empty-header"', desc: "图标、标题和说明区域。" },
  { part: 'data-slot="empty-icon"', desc: "媒体或图标区域。" },
  { part: 'data-slot="empty-title"', desc: "空状态标题。" },
  { part: 'data-slot="empty-description"', desc: "原因或下一步说明。" },
  { part: 'data-slot="empty-content"', desc: "可选操作区域。" },
]

const doDontRows = [
  { do: "成功返回但无数据时使用 Empty。", dont: "用 Skeleton 表示无数据。" },
  { do: "只提供一个清晰的恢复或创建动作。", dont: "堆叠多个同权重主按钮。" },
]

export function EmptyPage({ actions, lang }: { actions: React.ReactNode; lang: StandardDocLang }) {
  return (
    <StandardDocPage
      slug="empty"
      title="Empty 空状态"
      lead="在数据为空、搜索无结果或尚未创建内容时给出下一步。"
      overview={<Empty><EmptyHeader><EmptyMedia variant="icon"><InboxIcon /></EmptyMedia><EmptyTitle>暂无数据</EmptyTitle><EmptyDescription>创建第一条记录后会显示在这里。</EmptyDescription></EmptyHeader><EmptyContent><Button>新建记录</Button></EmptyContent></Empty>}
      scenarioExamples={[]}
      renderScenarioPreview={() => null}
      importCode={'import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"'}
      usageCode={'<Empty><EmptyHeader><EmptyTitle>暂无数据</EmptyTitle><EmptyDescription>请先创建内容。</EmptyDescription></EmptyHeader></Empty>'}
      propRows={propRows}
      semanticDomRows={semanticDomRows}
      doDontRows={doDontRows}
      actions={actions}
      lang={lang}
    />
  )
}

import { Transfer, type TransferItem } from "@/components/fx/transfer"
import { ComponentPlayground, type ComponentPlaygroundConfig } from "@/components/fx/component-playground"
import { componentPlaygroundPropsFromManifest, type ComponentPlaygroundsManifest } from "@/pages/docs/components/component-playground-manifest"
import { StandardDocPage, type StandardDocLang } from "@/pages/docs/components/standard-doc-page"
import componentPlaygroundsManifestRaw from "../../../../docs/data/component-playgrounds.manifest.json?raw"

type PropRow = { prop: string; type: string; defaultValue: string; desc: string }
type SemanticDomRow = { part: string; desc: string }
type DoDontRow = { do: string; dont: string }

const manifest = JSON.parse(componentPlaygroundsManifestRaw) as ComponentPlaygroundsManifest
const transferManifest = manifest.customPlaygrounds!.transfer

export const transferItems: TransferItem[] = [
  { key: "product", title: "产品中心", description: "负责产品规划与业务增长" },
  { key: "design", title: "体验设计部", description: "负责交互与视觉体验" },
  { key: "engineering", title: "研发中心", description: "负责平台与工程交付" },
  { key: "sales", title: "销售部", description: "负责客户与商业拓展" },
  { key: "finance", title: "财务部", description: "负责预算与经营分析" },
  { key: "hr", title: "人力资源部", description: "负责组织与人才发展" },
  { key: "legal", title: "法务部", description: "负责合规与风险管理", disabled: true },
  { key: "operations", title: "运营中心", description: "负责流程与服务支持" },
]

function renderTransfer(values: Record<string, string>) {
  return (
    <Transfer
      key={JSON.stringify(values)}
      dataSource={transferItems}
      defaultTargetKeys={["sales", "finance"]}
      showSearch={values.showSearch === "true"}
      oneWay={values.oneWay === "true"}
      disabled={values.disabled === "true"}
      loading={values.loading === "true"}
      status={values.status === "none" ? undefined : values.status as "error" | "warning"}
      titles={["可选部门", "已选部门"]}
    />
  )
}

export const transferPlaygroundConfig: ComponentPlaygroundConfig = {
  storySource: "docs/data/component-playgrounds.manifest.json#customPlaygrounds.transfer",
  props: componentPlaygroundPropsFromManifest(transferManifest),
  initial: transferManifest.initial,
  guidanceKey: transferManifest.guidanceKey,
  previewItemsClassName: "w-full",
  renderOne: renderTransfer,
  genCode: (values) => {
    const attrs = [
      values.showSearch === "true" ? "showSearch" : "",
      values.oneWay === "true" ? "oneWay" : "",
      values.disabled === "true" ? "disabled" : "",
    ].filter(Boolean).join(" ")
    return `import { Transfer } from "@/components/fx/transfer"\n\n<Transfer dataSource={departments} targetKeys={selectedKeys} onChange={setSelectedKeys} ${attrs} />`
  },
}

export const transferAnchors = [
  { label: "调试台", labelEn: "Playground", href: "#transfer-playground" },
  { label: "API", href: "#transfer-props" },
  { label: "语义 DOM", labelEn: "Semantic DOM", href: "#transfer-semantic-dom" },
  { label: "正误示例", labelEn: "Do / Don’t", href: "#transfer-do-dont" },
]

const propRows: PropRow[] = [
  { prop: "dataSource", type: "TransferItem[]", defaultValue: "—", desc: "全量数据，key 必须稳定且唯一；disabled 项不能移动。" },
  { prop: "targetKeys / defaultTargetKeys", type: "TransferKey[]", defaultValue: "[]", desc: "右侧目标列表的受控或非受控键集合。" },
  { prop: "selectedKeys / defaultSelectedKeys", type: "[TransferKey[], TransferKey[]]", defaultValue: "[[], []]", desc: "左右列表的受控或非受控暂选项。" },
  { prop: "onChange", type: "(targetKeys, direction, moveKeys) => void", defaultValue: "—", desc: "项移动后返回目标键、方向和本次移动键。" },
  { prop: "onSelectChange", type: "(sourceKeys, targetKeys) => void", defaultValue: "—", desc: "任一列表选择变化时回调。" },
  { prop: "showSearch / onSearch", type: "boolean / callback", defaultValue: "false", desc: "显示两侧检索框，并回传方向与检索词。" },
  { prop: "oneWay", type: "boolean", defaultValue: "false", desc: "只保留向右移动命令。" },
  { prop: "disabled / loading", type: "boolean", defaultValue: "false", desc: "禁用全部操作或显示两侧加载态。" },
  { prop: "status", type: "error | warning", defaultValue: "—", desc: "表单校验状态，不是视觉覆盖。" },
  { prop: "titles", type: "[ReactNode, ReactNode]", defaultValue: "[源列表, 目标列表]", desc: "左右面板标题。" },
]

const semanticDomRows: SemanticDomRow[] = [
  { part: 'data-slot="transfer"', desc: "根节点；暴露 one-way、disabled、loading、status 运行态。" },
  { part: 'data-slot="transfer-list"', desc: "左右列表面板，data-direction 为 left 或 right。" },
  { part: 'data-slot="transfer-actions"', desc: "两侧移动命令区。" },
  { part: 'data-slot="transfer-item"', desc: "可选择的列表条目。" },
  { part: 'data-slot="transfer-loading" / "transfer-empty"', desc: "加载或无匹配数据的内容态。" },
]

const doDontRows: DoDontRow[] = [
  { do: "用 targetKeys + onChange 保存最终选择，用 selectedKeys 管理暂选。", dont: "从 DOM 或列表序号推断已选项。" },
  { do: "用 showSearch、oneWay、loading、status 等真实 API 表达状态。", dont: "暴露截图专用的 mode 或手写面板颜色。" },
  { do: "复杂表格或树形数据另沉淀为验证过的组合能力。", dont: "把表格列或树节点临时塞进基础 Transfer。" },
]

export function TransferPage({ actions, lang }: { actions: React.ReactNode; lang: StandardDocLang }) {
  return (
    <StandardDocPage
      slug="transfer"
      title="Transfer 穿梭框"
      lead="在源列表与目标列表之间批量移动数据，支持检索、全选、单向和受控选择。"
      playground={<ComponentPlayground config={transferPlaygroundConfig} lang={lang} />}
      hideOverview
      hideScenarioExamples
      hideUsage
      overview={null}
      scenarioExamples={[]}
      renderScenarioPreview={() => null}
      importCode={'import { Transfer } from "@/components/fx/transfer"'}
      usageCode={'<Transfer dataSource={items} targetKeys={keys} onChange={setKeys} />'}
      propRows={propRows}
      semanticDomRows={semanticDomRows}
      doDontRows={doDontRows}
      actions={actions}
      lang={lang}
    />
  )
}

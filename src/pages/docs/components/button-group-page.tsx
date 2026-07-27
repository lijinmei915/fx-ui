import { ButtonGroupPlayground } from "@/pages/docs/components/button-group-playground"
import { ButtonGroup } from "@/components/ui/button-group"
import { Button } from "@/components/ui/button"
import { ChevronDownIcon } from "@/lib/icons"
import { StandardDocPage, type StandardDocLang } from "@/pages/docs/components/standard-doc-page"

type PropRow = { prop: string; type: string; defaultValue: string; desc: string; descEn?: string }
type SemanticDomRow = { part: string; desc: string; descEn?: string }
type DoDontRow = { do: string; doEn?: string; dont: string; dontEn?: string }

export const buttonGroupAnchors = [
  { label: "调试台", labelEn: "Playground", href: "#button-group-playground" },
  { label: "API", href: "#button-group-props" },
  { label: "语义 DOM", href: "#button-group-semantic-dom" },
  { label: "正误示例", href: "#button-group-do-dont" },
]

export const buttonGroupPropRows = [
  { prop: "ButtonGroup", type: "orientation?: \"horizontal\" | \"vertical\"", defaultValue: "\"horizontal\"", desc: "按钮组容器，自动合并相邻按钮的圆角与边框。" },
  { prop: "ButtonGroupText", type: "render?: ReactElement", defaultValue: "—", desc: "插入说明性文案/图标的占位块，非交互元素。" },
  { prop: "ButtonGroupSeparator", type: "orientation?: \"horizontal\" | \"vertical\"", defaultValue: "\"vertical\"", desc: "组内分隔线，复用 Separator 并自适应方向。" },
]

export const buttonGroupSemanticDomRows = [
  { part: "[data-slot=\"button-group\"][data-orientation]", desc: "按钮组容器，data-orientation 标记排列方向。" },
  { part: "[data-slot=\"button-group-text\"]", desc: "组内说明性文案/图标占位块。" },
  { part: "[data-slot=\"button-group-separator\"]", desc: "组内分隔线。" },
]

export const buttonGroupDoDontRows = [
  { do: "把强相关、同级的操作放进同一组。", dont: "把主操作和危险操作（如删除）合并到一组里。" },
  { do: "组内按钮统一用 outline 或 ghost 弱化样式。", dont: "组内混用 default/destructive 等强对比样式。" },
  { do: "组合超过 4 个按钮时考虑改用下拉菜单。", dont: "把工具栏所有按钮塞进一个组，造成视觉拥挤。" },
]

export function ButtonGroupPage({
  actions,
  lang,
  propRows,
  semanticDomRows,
  doDontRows,
}: {
  actions: React.ReactNode
  lang: StandardDocLang
  propRows: PropRow[]
  semanticDomRows: SemanticDomRow[]
  doDontRows: DoDontRow[]
}) {
  return (
    <StandardDocPage
      slug="button-group"
      title={lang === "en" ? "Button Group" : "按钮组"}
      lead="把强相关的多个操作按钮合并为一组，自动合并相邻边框与圆角，弱化彼此边界。"
      playground={<ButtonGroupPlayground lang={lang} />}
      hideOverview
      hideScenarioExamples
      hideUsage
      overview={
        <div className="flex w-full flex-col gap-6">
          <div className="grid gap-3">
            <h3 className="text-sm font-medium text-muted-foreground">{lang === "en" ? "Types" : "类型"}</h3>
            <div className="flex flex-wrap items-center gap-4">
              <ButtonGroup><Button variant="outline">复制</Button><Button variant="outline">分享</Button><Button variant="outline">归档</Button></ButtonGroup>
              <ButtonGroup><Button variant="outline">保存</Button><Button size="icon-md" variant="outline" aria-label="更多"><ChevronDownIcon /></Button></ButtonGroup>
            </div>
          </div>
          <div className="border-t border-dashed border-border" />
          <div className="grid gap-3">
            <h3 className="text-sm font-medium text-muted-foreground">{lang === "en" ? "Orientation" : "方向"}</h3>
            <div className="flex flex-wrap items-start gap-4"><ButtonGroup><Button variant="outline">上一步</Button><Button variant="outline">下一步</Button></ButtonGroup><ButtonGroup orientation="vertical"><Button variant="outline">上移</Button><Button variant="outline">居中</Button><Button variant="outline">下移</Button></ButtonGroup></div>
          </div>
          <div className="border-t border-dashed border-border" />
          <div className="grid gap-3">
            <h3 className="text-sm font-medium text-muted-foreground">{lang === "en" ? "Inner Button size" : "尺寸"}</h3>
            <div className="flex flex-wrap items-center gap-4">{([{ size: "xs", zh: "超小", en: "XS" }, { size: "sm", zh: "默认", en: "Default" }, { size: "md", zh: "标准", en: "Standard" }, { size: "lg", zh: "大", en: "Large" }] as const).map((item) => <ButtonGroup key={item.size}><Button size={item.size} variant="outline">{lang === "en" ? item.en : item.zh}</Button><Button size={item.size} variant="outline">{lang === "en" ? item.en : item.zh}</Button></ButtonGroup>)}</div>
          </div>
        </div>
      }
      scenarioExamples={[]}
      renderScenarioPreview={(id) => id === "split" ? <ButtonGroup><Button size="sm" variant="outline">保存</Button><Button size="icon-sm" variant="outline" aria-label="更多"><ChevronDownIcon /></Button></ButtonGroup> : id === "vertical" ? <ButtonGroup orientation="vertical"><Button size="sm" variant="outline">上移</Button><Button size="sm" variant="outline">居中</Button><Button size="sm" variant="outline">下移</Button></ButtonGroup> : id.startsWith("size-") ? <ButtonGroup><Button size={(id.replace("size-", "") === "default" ? "md" : id.replace("size-", "")) as "xs" | "sm" | "md" | "lg"} variant="outline">复制</Button><Button size={(id.replace("size-", "") === "default" ? "md" : id.replace("size-", "")) as "xs" | "sm" | "md" | "lg"} variant="outline">粘贴</Button></ButtonGroup> : <ButtonGroup><Button size="sm" variant="outline">复制</Button><Button size="sm" variant="outline">分享</Button><Button size="sm" variant="outline">归档</Button></ButtonGroup>}
      importCode={`import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "@/components/ui/button-group"`}
      usageCode=""
      propRows={propRows}
      semanticDomRows={semanticDomRows}
      doDontRows={doDontRows}
      actions={actions}
      lang={lang}
    />
  )
}

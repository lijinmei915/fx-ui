import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import componentPlaygroundsManifestRaw from "../../../../docs/data/component-playgrounds.manifest.json?raw"
import { standardScenarioExamplesFromManifest, type ComponentPlaygroundsManifest } from "@/pages/docs/components/component-playground-manifest"
import { StandardDocPage, type StandardDocLang } from "@/pages/docs/components/standard-doc-page"

export const sheetAnchors = [
  { label: "组件总览", href: "#sheet-overview" },
  { label: "场景示例", href: "#sheet-preview" },
  { label: "使用方式", href: "#sheet-usage" },
  { label: "API", href: "#sheet-props" },
  { label: "语义 DOM", href: "#sheet-semantic-dom" },
  { label: "正误示例", href: "#sheet-do-dont" },
]

const sheetImportCode = `import {\n  Sheet,\n  SheetClose,\n  SheetContent,\n  SheetDescription,\n  SheetFooter,\n  SheetHeader,\n  SheetTitle,\n  SheetTrigger,\n} from "@/components/ui/sheet"`

const sheetUsageCode = `<Sheet>\n  <SheetTrigger render={<Button variant="outline">编辑</Button>} />\n  <SheetContent side="right" size="md">\n    <SheetHeader>\n      <SheetTitle>编辑成员</SheetTitle>\n      <SheetDescription>修改信息后点击保存生效</SheetDescription>\n    </SheetHeader>\n    <SheetFooter>\n      <Button>保存</Button>\n      <SheetClose render={<Button variant="outline">取消</Button>} />\n    </SheetFooter>\n  </SheetContent>\n</Sheet>`

const componentPlaygroundsManifest = JSON.parse(componentPlaygroundsManifestRaw) as ComponentPlaygroundsManifest
const sheetScenarioExamples = standardScenarioExamplesFromManifest(componentPlaygroundsManifest, "sheet")

function SheetPreview({ id }: { id: string }) {
  if (id === "right-detail") {
    return (
      <Sheet>
        <SheetTrigger render={<Button size="sm" variant="outline">高级配置</Button>} />
        <SheetContent side="right" size="lg">
          <SheetHeader>
            <SheetTitle>高级配置</SheetTitle>
            <SheetDescription>为复杂配置保留更宽的右侧工作区。</SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 px-4">
            <Input placeholder="回调地址" />
            <Input placeholder="访问令牌" />
          </div>
          <SheetFooter>
            <Button>保存配置</Button>
            <SheetClose render={<Button variant="outline">取消</Button>} />
          </SheetFooter>
        </SheetContent>
      </Sheet>
    )
  }

  if (id === "right-form") {
    return (
      <Sheet>
        <SheetTrigger render={<Button size="sm" variant="outline">编辑成员</Button>} />
        <SheetContent side="right" size="md">
          <SheetHeader>
            <SheetTitle>编辑成员</SheetTitle>
            <SheetDescription>修改信息后点击保存生效。</SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 px-4">
            <Input placeholder="姓名" />
          </div>
          <SheetFooter>
            <Button>保存</Button>
            <SheetClose render={<Button variant="outline">取消</Button>} />
          </SheetFooter>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Sheet>
      <SheetTrigger render={<Button size="sm" variant="outline">更多操作</Button>} />
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>更多操作</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-2 px-4 pb-4">
          <Button variant="outline">分享</Button>
          <Button variant="outline">归档</Button>
          <Button variant="destructive">删除</Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

const sheetPropRows = [
  { prop: "Sheet", type: "组件", defaultValue: "—", desc: "根节点，管理面板开关状态" },
  { prop: "SheetTrigger", type: "组件", defaultValue: "—", desc: "触发器，常用 render 把 Button 作为触发元素" },
  { prop: "SheetContent.side", type: "\"top\" | \"right\" | \"bottom\" | \"left\"", defaultValue: "right", desc: "面板从屏幕哪一侧滑出" },
  { prop: "SheetContent.size", type: "\"sm\" | \"md\" | \"lg\"", defaultValue: "md", desc: "控制左右侧栏最大宽度；顶部和底部面板保持满宽" },
  { prop: "SheetContent.showCloseButton", type: "boolean", defaultValue: "true", desc: "是否渲染右上角关闭按钮；标题语义仍必须保留" },
  { prop: "SheetContent", type: "组件", defaultValue: "—", desc: "面板主体容器，自带遮罩与滑入/滑出动效" },
  { prop: "SheetHeader / SheetFooter", type: "组件", defaultValue: "—", desc: "头部（标题+描述）/ 底部操作区的布局分组" },
  { prop: "SheetClose", type: "组件", defaultValue: "—", desc: "关闭触发器，常用 render 包裹「取消」按钮" },
]

const sheetSemanticDomRows = [
  { part: "data-slot=\"sheet-overlay\"", desc: "遮罩层，承载半透明背景与淡入淡出动效" },
  { part: "data-slot=\"sheet-content\"", desc: "面板主体容器，依据 side 承载对应方向的滑入动效" },
  { part: "data-slot=\"sheet-title\" / \"sheet-description\"", desc: "标题与说明，通过 aria 属性与面板根节点关联" },
  { part: "data-slot=\"sheet-close\"", desc: "关闭触发器，点击后关闭面板并恢复焦点" },
]

const sheetDoDontRows = [
  { do: "用于不离开当前上下文的查看/编辑/操作场景。", dont: "把它当成独立页面使用，塞入与列表无关的大量内容。" },
  { do: "依据使用习惯选择 side（详情用 right，操作用 bottom）。", dont: "随意选择滑出方向，造成跨页面体验不一致。" },
  { do: "用 SheetClose 包裹取消/关闭按钮。", dont: "手写 onClick 调用 setOpen(false) 来关闭。" },
  { do: "内容较多时让 SheetContent 内部自行滚动。", dont: "把面板撑到超出可视区域导致整页滚动错位。" },
]

export function SheetPage({ actions, lang, autoScenarioSlugs }: {
  actions: React.ReactNode
  lang: StandardDocLang
  autoScenarioSlugs: string[]
}) {
  return (
    <StandardDocPage
      slug="sheet"
      title="Sheet 抽屉"
      lead="从屏幕边缘滑出的浮层面板，用于在不离开当前上下文的情况下查看详情或执行操作。"
      overview={null}
      scenarioExamples={sheetScenarioExamples}
      renderScenarioPreview={(id) => <SheetPreview id={id} />}
      importCode={sheetImportCode}
      usageCode={sheetUsageCode}
      propRows={sheetPropRows}
      semanticDomRows={sheetSemanticDomRows}
      doDontRows={sheetDoDontRows}
      autoScenarioSlugs={autoScenarioSlugs}
      actions={actions}
      lang={lang}
    />
  )
}

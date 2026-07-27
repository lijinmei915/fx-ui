import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import componentPlaygroundsManifestRaw from "../../../../docs/data/component-playgrounds.manifest.json?raw"
import { standardScenarioExamplesFromManifest, type ComponentPlaygroundsManifest } from "@/pages/docs/components/component-playground-manifest"
import { StandardDocPage, type StandardDocLang } from "@/pages/docs/components/standard-doc-page"

export const dialogAnchors = [
  { label: "组件总览", href: "#dialog-overview" },
  { label: "场景示例", href: "#dialog-preview" },
  { label: "使用方式", href: "#dialog-usage" },
  { label: "API", href: "#dialog-props" },
  { label: "语义 DOM", href: "#dialog-semantic-dom" },
  { label: "正误示例", href: "#dialog-do-dont" },
]

const dialogImportCode = `import {\n  Dialog,\n  DialogClose,\n  DialogContent,\n  DialogDescription,\n  DialogFooter,\n  DialogHeader,\n  DialogTitle,\n  DialogTrigger,\n} from "@/components/ui/dialog"`

const dialogUsageCode = `<Dialog>\n  <DialogTrigger render={<Button>新建项目</Button>} />\n  <DialogContent size="md">\n    <DialogHeader>\n      <DialogTitle>新建项目</DialogTitle>\n      <DialogDescription>填写基本信息后即可创建</DialogDescription>\n    </DialogHeader>\n    <DialogFooter>\n      <DialogClose render={<Button variant="outline">取消</Button>} />\n      <Button>创建</Button>\n    </DialogFooter>\n  </DialogContent>\n</Dialog>`

const componentPlaygroundsManifest = JSON.parse(componentPlaygroundsManifestRaw) as ComponentPlaygroundsManifest
const dialogScenarioExamples = standardScenarioExamplesFromManifest(componentPlaygroundsManifest, "dialog")

function DialogPreview({ id }: { id: string }) {
  if (id === "review") {
    return (
      <Dialog>
        <DialogTrigger render={<Button size="sm" variant="outline">审阅发布内容</Button>} />
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle>审阅发布内容</DialogTitle>
            <DialogDescription>确认发布说明和变更链接后提交审核。</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <Input placeholder="发布说明" />
            <Input placeholder="变更链接" />
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">返回修改</Button>} />
            <Button>提交审核</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  if (id === "form") {
    return (
      <Dialog>
        <DialogTrigger render={<Button size="sm">新建项目</Button>} />
        <DialogContent size="md">
          <DialogHeader>
            <DialogTitle>新建项目</DialogTitle>
            <DialogDescription>填写基本信息后即可创建。</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <Input placeholder="项目名称" />
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">取消</Button>} />
            <Button>创建</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog>
      <DialogTrigger render={<Button size="sm" variant="outline">发布版本</Button>} />
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>确认发布该版本？</DialogTitle>
          <DialogDescription>发布后用户将立即看到最新内容。</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">再想想</Button>} />
          <Button>确认</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const dialogPropRows = [
  { prop: "Dialog", type: "组件", defaultValue: "—", desc: "根节点，管理弹窗开关状态（受控用 open / onOpenChange）" },
  { prop: "DialogTrigger", type: "组件", defaultValue: "—", desc: "触发器，常用 render 把 Button 作为触发元素" },
  { prop: "DialogContent.size", type: "\"sm\" | \"md\" | \"lg\"", defaultValue: "md", desc: "控制弹窗主体最大宽度；由组件承载，不在调用处覆盖宽度样式" },
  { prop: "DialogContent.showCloseButton", type: "boolean", defaultValue: "true", desc: "是否渲染右上角关闭按钮；标题语义仍必须保留" },
  { prop: "DialogContent", type: "组件", defaultValue: "—", desc: "弹窗主体容器，自带遮罩、动效、关闭按钮" },
  { prop: "DialogHeader / DialogFooter", type: "组件", defaultValue: "—", desc: "头部（标题+描述）/ 底部操作区的布局分组" },
  { prop: "DialogTitle / DialogDescription", type: "组件", defaultValue: "—", desc: "标题与说明文字，提供无障碍语义关联" },
  { prop: "DialogClose", type: "组件", defaultValue: "—", desc: "关闭触发器，常用 render 包裹「取消」按钮" },
]

const dialogSemanticDomRows = [
  { part: "data-slot=\"dialog-overlay\"", desc: "遮罩层，承载半透明背景与淡入淡出动效" },
  { part: "data-slot=\"dialog-content\"", desc: "弹窗主体容器，承载圆角、阴影、缩放动效" },
  { part: "data-slot=\"dialog-title\" / \"dialog-description\"", desc: "标题与说明，通过 aria 属性与弹窗根节点关联" },
  { part: "data-slot=\"dialog-close\"", desc: "关闭触发器，点击后关闭弹窗并恢复焦点" },
]

const dialogDoDontRows = [
  { do: "用 DialogTitle / DialogDescription 提供无障碍语义。", dont: "在 DialogContent 里直接写 <h2>/<p> 替代它们。" },
  { do: "Footer 按钮「取消在左、主操作在右」。", dont: "把多个同等重要的操作平铺排列不分主次。" },
  { do: "只承载需要聚焦完成的单一任务。", dont: "在弹窗里嵌套另一个弹窗或塞入整页面的内容。" },
  { do: "用 DialogClose 包裹取消/关闭按钮。", dont: "手写 onClick 调用 setOpen(false) 来关闭。" },
]

export function DialogPage({ actions, lang, autoScenarioSlugs }: {
  actions: React.ReactNode
  lang: StandardDocLang
  autoScenarioSlugs: string[]
}) {
  return (
    <StandardDocPage
      slug="dialog"
      title="Dialog 对话框"
      lead="以模态浮层承载需要用户聚焦完成的单一任务，如表单录入、操作确认。"
      overview={null}
      scenarioExamples={dialogScenarioExamples}
      renderScenarioPreview={(id) => <DialogPreview id={id} />}
      importCode={dialogImportCode}
      usageCode={dialogUsageCode}
      propRows={dialogPropRows}
      semanticDomRows={dialogSemanticDomRows}
      doDontRows={dialogDoDontRows}
      autoScenarioSlugs={autoScenarioSlugs}
      actions={actions}
      lang={lang}
    />
  )
}

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import componentPlaygroundsManifestRaw from "../../../../docs/data/component-playgrounds.manifest.json?raw"
import { standardScenarioExamplesFromManifest, type ComponentPlaygroundsManifest } from "@/pages/docs/components/component-playground-manifest"
import { StandardScenarioPlayground } from "@/pages/docs/components/standard-scenario-playground"
import { StandardDocPage, type StandardDocLang } from "@/pages/docs/components/standard-doc-page"
import { SettingsIcon } from "@/lib/icons"

export const tooltipAnchors = [
  { label: "组件总览", href: "#tooltip-overview" },
  { label: "场景示例", href: "#tooltip-preview" },
  { label: "使用方式", href: "#tooltip-usage" },
  { label: "API", href: "#tooltip-props" },
  { label: "语义 DOM", href: "#tooltip-semantic-dom" },
  { label: "正误示例", href: "#tooltip-do-dont" },
]

const componentPlaygroundsManifest = JSON.parse(componentPlaygroundsManifestRaw) as ComponentPlaygroundsManifest
const tooltipScenarioExamples = standardScenarioExamplesFromManifest(componentPlaygroundsManifest, "tooltip")
const tooltipImportCode = `import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"`

function TooltipPreview({ id }: { id: string }) {
  if (id === "icon-button") {
    return (
      <Tooltip>
        <TooltipTrigger render={<Button variant="ghost" size="icon-sm" aria-label="设置"><SettingsIcon /></Button>} />
        <TooltipContent>设置</TooltipContent>
      </Tooltip>
    )
  }

  if (id === "truncated-text") {
    return (
      <Tooltip>
        <TooltipTrigger render={<span className="block w-[120px] truncate text-sm">这是一个很长的客户全称示例文本</span>} />
        <TooltipContent>这是一个很长的客户全称示例文本</TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline" size="sm">悬浮查看</Button>} />
      <TooltipContent side="right">提示从右侧弹出</TooltipContent>
    </Tooltip>
  )
}

const tooltipPropRows = [
  { prop: "TooltipProvider", type: "组件", defaultValue: "delay=0", desc: "全局提供者，统一控制一组 Tooltip 的延迟时间，通常包一层在应用根部" },
  { prop: "Tooltip", type: "组件", defaultValue: "—", desc: "根节点，管理开关状态" },
  { prop: "TooltipTrigger", type: "组件", defaultValue: "—", desc: "触发元素，常用 render 把已有元素（如 Button）作为触发器" },
  { prop: "side", type: "\"top\" | \"right\" | \"bottom\" | \"left\"", defaultValue: "top", desc: "提示内容相对触发元素的弹出方向" },
  { prop: "sideOffset", type: "number", defaultValue: "4", desc: "提示内容与触发元素之间的间距（像素）" },
]

const tooltipSemanticDomRows = [
  { part: "data-slot=\"tooltip-trigger\"", desc: "触发元素节点，悬浮/聚焦时唤起提示" },
  { part: "data-slot=\"tooltip-content\"", desc: "提示气泡内容容器，承载背景、圆角、动效" },
  { part: "data-slot=\"tooltip-provider\"", desc: "提供者节点，统一管理一组 Tooltip 的显隐延迟" },
]

const tooltipDoDontRows = [
  { do: "为纯图标按钮、截断文本等缺信息场景补充说明。", dont: "给已经有完整可见文字的元素也套 Tooltip。" },
  { do: "内容保持简短的一句话说明。", dont: "把操作说明文档、长段落塞进 Tooltip。" },
  { do: "用 side / sideOffset 控制弹出方向避免遮挡。", dont: "手写绝对定位坐标来调整提示位置。" },
]

export function TooltipPage({ actions, lang, autoScenarioSlugs }: {
  actions: React.ReactNode
  lang: StandardDocLang
  autoScenarioSlugs: string[]
}) {
  return (
    <StandardDocPage
      slug="tooltip"
      title="Tooltip 提示"
      lead="鼠标悬浮或聚焦时弹出的简短说明，用于补充说明、可访问性兜底，不承载关键信息。"
      playground={
        <TooltipProvider>
          <StandardScenarioPlayground
            slug="tooltip"
            examples={tooltipScenarioExamples}
            renderScenarioPreview={(id) => <TooltipPreview id={id} />}
            importCode={tooltipImportCode}
            lang={lang}
          />
        </TooltipProvider>
      }
      overview={null}
      scenarioExamples={tooltipScenarioExamples}
      renderScenarioPreview={(id) => <TooltipPreview id={id} />}
      importCode={tooltipImportCode}
      usageCode=""
      propRows={tooltipPropRows}
      semanticDomRows={tooltipSemanticDomRows}
      doDontRows={tooltipDoDontRows}
      autoScenarioSlugs={autoScenarioSlugs}
      actions={actions}
      lang={lang}
    />
  )
}

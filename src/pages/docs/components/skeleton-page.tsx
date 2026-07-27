import { Skeleton } from "@/components/ui/skeleton"
import { StandardDocPage, type StandardDocLang } from "@/pages/docs/components/standard-doc-page"
import componentPlaygroundsManifestRaw from "../../../../docs/data/component-playgrounds.manifest.json?raw"
import { standardScenarioExamplesFromManifest, type ComponentPlaygroundsManifest } from "@/pages/docs/components/component-playground-manifest"

export const skeletonAnchors = [
  { label: "组件总览", href: "#skeleton-overview" },
  { label: "场景示例", href: "#skeleton-preview" },
  { label: "使用方式", href: "#skeleton-usage" },
  { label: "API", href: "#skeleton-props" },
  { label: "语义 DOM", href: "#skeleton-semantic-dom" },
  { label: "正误示例", href: "#skeleton-do-dont" },
]

const skeletonImportCode = `import { Skeleton } from "@/components/ui/skeleton"`

const skeletonUsageCode = `<div className="flex items-center gap-4">\n  <Skeleton className="size-12 rounded-full" />\n  <div className="flex flex-col gap-2">\n    <Skeleton className="h-4 w-[160px]" />\n    <Skeleton className="h-4 w-[120px]" />\n  </div>\n</div>`

const componentPlaygroundsManifest = JSON.parse(componentPlaygroundsManifestRaw) as ComponentPlaygroundsManifest
const skeletonScenarioExamples = standardScenarioExamplesFromManifest(componentPlaygroundsManifest, "skeleton")

function SkeletonPreview({ id }: { id: string }) {
  if (id === "text-lines") {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-[240px]" />
        <Skeleton className="h-4 w-[180px]" />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <Skeleton className="size-12 rounded-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-[160px]" />
        <Skeleton className="h-4 w-[120px]" />
      </div>
    </div>
  )
}

const skeletonPropRows = [
  { prop: "Skeleton", type: "React.ComponentProps<\"div\">", defaultValue: "—", desc: "本质是一个带 animate-pulse 动效的 div，通过 className 控制宽高、形状。" },
  { prop: "className", type: "string", defaultValue: "—", desc: "用于设置宽度、高度、圆角（如 rounded-full 做头像占位）。" },
]

const skeletonSemanticDomRows = [
  { part: "[data-slot=\"skeleton\"]", desc: "占位元素本体，自带 animate-pulse 呼吸动画与 bg-muted 底色。" },
]

const skeletonDoDontRows = [
  { do: "按真实内容的结构和比例摆放占位块。", dont: "用一整块大灰条糊弄所有内容类型。" },
  { do: "加载完成后立刻替换为真实内容，避免占位停留过久。", dont: "让骨架屏长时间展示，给用户「卡住了」的错觉。" },
  { do: "圆形头像用 rounded-full，文本行用矩形条。", dont: "所有占位形状一致，无法预期真实布局。" },
]

export function SkeletonPage({ actions, lang, autoScenarioSlugs }: {
  actions: React.ReactNode
  lang: StandardDocLang
  autoScenarioSlugs: string[]
}) {
  return (
    <StandardDocPage
      slug="skeleton"
      title="Skeleton 骨架屏"
      lead="内容加载完成前展示的占位块，用呼吸动画提示正在加载，并提前还原真实内容的大致结构。"
      overview={null}
      scenarioExamples={skeletonScenarioExamples}
      renderScenarioPreview={(id) => <SkeletonPreview id={id} />}
      importCode={skeletonImportCode}
      usageCode={skeletonUsageCode}
      propRows={skeletonPropRows}
      semanticDomRows={skeletonSemanticDomRows}
      doDontRows={skeletonDoDontRows}
      autoScenarioSlugs={autoScenarioSlugs}
      actions={actions}
      lang={lang}
    />
  )
}

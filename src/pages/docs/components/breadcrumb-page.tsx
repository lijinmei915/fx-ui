import { Fragment, useState } from "react"

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage as BreadcrumbCurrentPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import componentPlaygroundsManifestRaw from "../../../../docs/data/component-playgrounds.manifest.json?raw"
import { standardScenarioExamplesFromManifest, type ComponentPlaygroundsManifest } from "@/pages/docs/components/component-playground-manifest"
import { StandardDocPage, type StandardDocLang } from "@/pages/docs/components/standard-doc-page"
import type { StandardScenarioExample } from "@/pages/docs/components/standard-scenario-playground"
import { FileTextIcon, FolderIcon, HomeIcon } from "@/lib/icons"

export const breadcrumbAnchors = [
  { label: "组件总览", href: "#breadcrumb-overview" },
  { label: "场景示例", href: "#breadcrumb-preview" },
  { label: "使用方式", href: "#breadcrumb-usage" },
  { label: "API", href: "#breadcrumb-props" },
  { label: "语义 DOM", href: "#breadcrumb-semantic-dom" },
  { label: "正误示例", href: "#breadcrumb-do-dont" },
]

const componentPlaygroundsManifest = JSON.parse(componentPlaygroundsManifestRaw) as ComponentPlaygroundsManifest
const breadcrumbScenarioExamples = standardScenarioExamplesFromManifest(componentPlaygroundsManifest, "breadcrumb")

function BreadcrumbPreview({ id }: { id: string }) {
  const crumbPath = ["首页", "活动管理", "2024 春季", "线下活动", "活动列表", "详情"]
  const [crumbEnd, setCrumbEnd] = useState(crumbPath.length - 1)
  const go = (index: number) => (event: React.MouseEvent) => {
    event.preventDefault()
    setCrumbEnd(index)
  }
  const visible = crumbPath.slice(0, crumbEnd + 1)

  if (id === "basic") {
    return <Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbLink href="#">首页</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbCurrentPage>详情</BreadcrumbCurrentPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>
  }

  if (id === "icon") {
    return <Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbLink href="#"><HomeIcon />首页</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbLink href="#"><FolderIcon />项目</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbCurrentPage><FileTextIcon />详情</BreadcrumbCurrentPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>
  }

  if (id === "collapsed") {
    return visible.length <= 4 ? (
      <Breadcrumb><BreadcrumbList>{visible.map((label, index) => <Fragment key={label}>{index > 0 ? <BreadcrumbSeparator /> : null}<BreadcrumbItem>{index === visible.length - 1 ? <BreadcrumbCurrentPage>{label}</BreadcrumbCurrentPage> : <BreadcrumbLink href="#" onClick={go(index)}>{label}</BreadcrumbLink>}</BreadcrumbItem></Fragment>)}</BreadcrumbList></Breadcrumb>
    ) : (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="#" onClick={go(0)}>{visible[0]}</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <DropdownMenu>
              <DropdownMenuTrigger render={<button type="button" aria-label="展开折叠的层级" className="flex cursor-pointer items-center outline-none"><BreadcrumbEllipsis /></button>} />
              <DropdownMenuContent align="start">
                {visible.slice(1, visible.length - 2).map((label, index) => <DropdownMenuItem key={label} onClick={() => setCrumbEnd(index + 1)}>{label}</DropdownMenuItem>)}
              </DropdownMenuContent>
            </DropdownMenu>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href="#" onClick={go(visible.length - 2)}>{visible[visible.length - 2]}</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbCurrentPage>{visible[visible.length - 1]}</BreadcrumbCurrentPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  return <Breadcrumb><BreadcrumbList size={id.replace("size-", "") as "sm" | "default" | "lg"}><BreadcrumbItem><BreadcrumbLink href="#">首页</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbLink href="#">活动管理</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbCurrentPage>活动列表</BreadcrumbCurrentPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>
}

const breadcrumbPropRows = [
  { prop: "Breadcrumb", type: "React.ComponentProps<\"nav\">", defaultValue: "—", desc: "根容器，自带 aria-label=\"breadcrumb\"。" },
  { prop: "BreadcrumbList / BreadcrumbItem", type: "React.ComponentProps<\"ol\"> / <\"li\">", defaultValue: "—", desc: "列表与列表项，负责排版与间距。" },
  { prop: "BreadcrumbList.size", type: "\"sm\" | \"default\" | \"lg\"", defaultValue: "\"default\"", desc: "尺寸档（12 / 14 / 16px），字号驱动整条面包屑，图标随字号缩放。" },
  { prop: "图标（icon）", type: "ReactNode（放进 Link/Page children）", defaultValue: "—", desc: "默认不带；需要时把图标放进 BreadcrumbLink/BreadcrumbPage 的 children，图标在前、随字号缩放。" },
  { prop: "BreadcrumbLink", type: "render?: ReactElement", defaultValue: "—", desc: "可点击的层级链接，支持 render 自定义底层标签。" },
  { prop: "BreadcrumbPage", type: "React.ComponentProps<\"span\">", defaultValue: "—", desc: "当前页标记，自动加 aria-current=\"page\"，不可点击。" },
  { prop: "BreadcrumbSeparator / BreadcrumbEllipsis", type: "React.ComponentProps<\"li\"> / <\"span\">", defaultValue: "—", desc: "分隔符（默认箭头图标）与省略号折叠占位。" },
]

const breadcrumbSemanticDomRows = [
  { part: "[data-slot=\"breadcrumb\"]", desc: "根 nav，带 aria-label=\"breadcrumb\" 供屏幕阅读器识别。" },
  { part: "[data-slot=\"breadcrumb-link\"] / [data-slot=\"breadcrumb-page\"]", desc: "可点击链接与当前页标记，后者带 aria-current。" },
  { part: "[data-slot=\"breadcrumb-separator\"] / [data-slot=\"breadcrumb-ellipsis\"]", desc: "分隔符与折叠占位，均带 aria-hidden。" },
]

const breadcrumbDoDontRows = [
  { do: "最后一级用 BreadcrumbPage，标记为当前页且不可点击。", dont: "把当前页也做成可点击链接，造成无意义跳转。" },
  { do: "层级超过 4 级时折叠中间项。", dont: "把所有层级平铺，导致面包屑换行挤占页头。" },
  { do: "链接文案用页面真实名称。", dont: "用 ID 或英文 slug 当文案，用户看不懂。" },
]

export function BreadcrumbPage({ actions, lang, autoScenarioSlugs }: {
  actions: React.ReactNode
  lang: StandardDocLang
  autoScenarioSlugs: string[]
}) {
  return (
    <StandardDocPage
      slug="breadcrumb"
      title="Breadcrumb 面包屑"
      lead="展示当前页面在层级结构中的位置，帮助用户理解所处位置并快速返回上级。"
      overview={null}
      scenarioExamples={breadcrumbScenarioExamples as StandardScenarioExample[]}
      renderScenarioPreview={(id) => <BreadcrumbPreview id={id} />}
      importCode={`import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"`}
      usageCode={`<Breadcrumb>\n  <BreadcrumbList>\n    <BreadcrumbItem><BreadcrumbLink href="#">首页</BreadcrumbLink></BreadcrumbItem>\n    <BreadcrumbSeparator />\n    <BreadcrumbItem><BreadcrumbPage>详情</BreadcrumbPage></BreadcrumbItem>\n  </BreadcrumbList>\n</Breadcrumb>`}
      propRows={breadcrumbPropRows}
      semanticDomRows={breadcrumbSemanticDomRows}
      doDontRows={breadcrumbDoDontRows}
      autoScenarioSlugs={autoScenarioSlugs}
      actions={actions}
      lang={lang}
    />
  )
}

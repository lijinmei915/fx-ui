import type { ReactNode } from "react"

import { CardContent } from "@/components/ui/card"
import { PageLead } from "@/components/fx/page-lead"
import { WebsiteCardContainer } from "@/components/fx/website-card-container"
import { docsSpacing } from "@/lib/docs-spacing"

export type LayoutPageLang = "zh" | "en"

export const layoutAnchors = [
  { label: "页面容器", labelEn: "Containers", href: "#layout-containers" },
]

export function LayoutPage({ actions, lang }: { actions: ReactNode; lang: LayoutPageLang }) {
  const t = (zh: string, en: string) => lang === "en" ? en : zh
  const hd = t("头部", "Header"), mn = t("主体", "Main"), ft = t("底部", "Footer"), nv = t("导航", "Menu"), lf = t("左", "Left"), rt = t("右", "Right")
  const B = ({ label, className = "" }: { label: string; className?: string }) => <div className={`flex items-center justify-center rounded bg-muted text-xs text-muted-foreground ${className}`}>{label}</div>
  const containers = [
    { n: "一", en: "1", desc: "最常见基础页", descEn: "Most common", wire: <div className="flex h-36 flex-col gap-1"><B label={hd} className="h-6" /><B label={mn} className="flex-1" /></div> },
    { n: "二", en: "2", desc: "带固定底部", descEn: "With footer", wire: <div className="flex h-36 flex-col gap-1"><B label={hd} className="h-6" /><B label={mn} className="flex-1" /><B label={ft} className="h-6" /></div> },
    { n: "三", en: "3", desc: "二级左侧导航", descEn: "Left menu", wire: <div className="flex h-36 flex-col gap-1"><B label={hd} className="h-6" /><div className="flex flex-1 gap-1"><B label={nv} className="w-1/4" /><B label={mn} className="flex-1" /></div><B label={ft} className="h-6" /></div> },
    { n: "四", en: "4", desc: "二级顶部导航", descEn: "Top menu", wire: <div className="flex h-36 flex-col gap-1"><B label={hd} className="h-6" /><B label={nv} className="h-5" /><B label={mn} className="flex-1" /><B label={ft} className="h-6" /></div> },
    { n: "五", en: "5", desc: "三栏·画布操作区", descEn: "3-column canvas", wire: <div className="flex h-36 flex-col gap-1"><B label={hd} className="h-6" /><div className="flex flex-1 gap-1"><B label={lf} className="w-1/5" /><B label={mn} className="flex-1" /><B label={rt} className="w-1/5" /></div></div> },
    { n: "六", en: "6", desc: "左侧一级导航 · 新版趋势", descEn: "Left primary nav · trend", wire: <div className="flex h-36 gap-1"><B label={nv} className="w-1/5" /><div className="flex flex-1 flex-col gap-1"><B label={hd} className="h-6" /><B label={mn} className="flex-1" /><B label={ft} className="h-6" /></div></div> },
  ]

  return (
    <div className={docsSpacing.pageStack}>
      <section id="layout-containers" className="flex flex-col gap-2">
        <PageLead crumb={lang === "en" ? "Foundations / Layout" : "基础 / 布局"} title={lang === "en" ? "Layout" : "布局"} lead={lang === "en" ? "Page frame patterns (header / sider / content / footer) and their default sizes. The grid system lives on its own Grid page." : "页面骨架样式（头/侧/内容/底）与默认尺寸。栅格系统单独在「栅格」页。"} actions={actions} />
      </section>
      <section className={docsSpacing.sectionStack}>
        <div><h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Page containers 页面容器" : "页面布局容器（6 种样式）"}</h2><p className="mt-2 text-base text-muted-foreground">{lang === "en" ? "From simple to complex. Style 6 (left primary nav) is the recommended trend." : "从简到繁；样式六（左侧一级导航）是新版趋势，新建后台优先。"}</p></div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {containers.map((c) => <WebsiteCardContainer key={c.n}><CardContent className="p-4"><div className="mb-3 flex items-baseline gap-2"><span className="text-lg font-semibold">{lang === "en" ? `Style ${c.en}` : `样式${c.n}`}</span><span className="text-sm text-muted-foreground">{lang === "en" ? c.descEn : c.desc}</span></div>{c.wire}</CardContent></WebsiteCardContainer>)}
        </div>
        <WebsiteCardContainer><CardContent className="p-5 text-base leading-7 text-muted-foreground"><p className="mb-1 text-base font-medium text-foreground">{lang === "en" ? "Default container sizes" : "容器默认尺寸"}</p><p>{lang === "en" ? "Frame (header/sider/content/footer) uses flex; the 24-col grid only governs content inside." : "框架（头/侧/内容/底）用 flex 拼；24 列栅格只管内容区内部的分栏。"}</p><p className="mt-1"><span className="font-medium text-foreground">{lang === "en" ? "Header" : "顶栏"}</span> 56px · <span className="font-medium text-foreground">{lang === "en" ? "Sider" : "侧栏"}</span> {lang === "en" ? "240 / collapsed 64" : "展开 240 / 收起 64"} · <span className="font-medium text-foreground">{lang === "en" ? "Footer" : "底栏"}</span> 48px · <span className="font-medium text-foreground">{lang === "en" ? "Content padding" : "内容内边距"}</span> {lang === "en" ? "16 (mobile) / 24 (desktop)" : "移动 16 / 桌面 24"}</p><p className="mt-1">{lang === "en" ? "Sider auto-collapses to the 64px icon rail below lg (1024px)." : "视口 < lg(1024px) 时侧栏自动收起为 64px 图标栏（或转抽屉）。"}</p></CardContent></WebsiteCardContainer>
      </section>
    </div>
  )
}

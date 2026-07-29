import type { ReactNode } from "react"

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageLead } from "@/components/fx/page-lead"
import { WebsiteCardContainer } from "@/components/fx/website-card-container"
import { docsSpacing } from "@/lib/docs-spacing"

export type UtilityPageLang = "zh" | "en"

export type MarkdownDoc = {
  path: string
  title: string
  markdown: string
}

export function MarkdownPage({
  doc,
  actions,
  lead,
}: {
  doc: MarkdownDoc
  actions: ReactNode
  lead: string
}) {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="mb-3 text-sm text-muted-foreground">Markdown / {doc.path}</p>
          <h1 className="text-3xl font-bold leading-tight tracking-tight">{doc.title} Markdown</h1>
        </div>
        {actions}
      </div>
      <p className={docsSpacing.leadText}>{lead}</p>
      <WebsiteCardContainer className="min-w-0 max-w-full">
        <CardHeader><CardTitle className="text-base">{doc.path}</CardTitle></CardHeader>
        <CardContent>
          <pre className="max-h-[70dvh] max-w-full overflow-auto rounded-lg bg-muted p-5 text-sm"><code>{doc.markdown}</code></pre>
        </CardContent>
      </WebsiteCardContainer>
    </section>
  )
}

export type PlaceholderNavItem = { label: string; labelEn?: string; href: string }

export function PlaceholderPage({
  actions,
  hash,
  item,
  lang,
}: {
  actions: ReactNode
  hash: string
  item?: PlaceholderNavItem
  lang: UtilityPageLang
}) {
  const title = item ? lang === "en" ? item.labelEn ?? item.label : item.label : hash.replace("#", "") || "Page"

  return (
    <section className="flex flex-col gap-10">
      <PageLead
        crumb={`${lang === "en" ? "Placeholder" : "空页面占位"} / ${hash || "#components"}`}
        title={title}
        lead={lang === "en" ? "This route is registered, but its component documentation has not been added yet." : "这个路由已登记，但对应的组件文档尚未补充。"}
        actions={actions}
      />
      <WebsiteCardContainer>
        <CardHeader><CardTitle className="text-base">{lang === "en" ? "Content not filled yet" : "内容暂未填充"}</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
          <p>{lang === "en" ? "This menu item can later be filled from shadcn Blocks, component docs, or internal layout guidelines." : "这个菜单项后续可以从 shadcn Blocks、组件文档或公司内部布局规范里补充。"}</p>
          <code className="w-fit rounded-lg bg-muted px-3 py-2 text-xs text-foreground">{hash}</code>
        </CardContent>
      </WebsiteCardContainer>
    </section>
  )
}

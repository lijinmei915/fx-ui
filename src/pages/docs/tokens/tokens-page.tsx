import type { ReactNode } from "react"

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tag } from "@/components/ui/tag"
import { WebsiteCardContainer } from "@/components/fx/website-card-container"
import { PageLead } from "@/components/fx/page-lead"
import { docsSpacing } from "@/lib/docs-spacing"

export type TokensPageLang = "zh" | "en"

export type TokenLayer = {
  title: string
  desc: string
  descEn: string
  example: string
}

export const tokenLayers = [
{ title: "Primitive", desc: "公司原始视觉值，只在 token 真相源里维护。", descEn: "Raw company visual values maintained only in the token source of truth.", example: "--fx-primary: #FF8000" },
{ title: "Semantic", desc: "shadcn/ui 和页面真正消费的语义槽。", descEn: "Semantic slots consumed by shadcn/ui and product pages.", example: "bg-primary text-primary-foreground" }];
export const tokenAnchors = [
  { label: "基础架构", labelEn: "Architecture", href: "#tokens-architecture" },
  { label: "颜色", labelEn: "Colors", href: "#tokens-colors" },
  { label: "排版", labelEn: "Typography", href: "#tokens-typography" },
  { label: "圆角", labelEn: "Radius", href: "#tokens-radius" },
  { label: "阴影", labelEn: "Shadow", href: "#tokens-shadow" },
  { label: "间距", labelEn: "Spacing", href: "#tokens-spacing" },
  { label: "层级", labelEn: "Layer", href: "#tokens-layer" },
  { label: "动效", labelEn: "Motion", href: "#tokens-motion" },
]

export function TokensPage({ actions, lang, tokenLayers }: { actions: ReactNode; lang: TokensPageLang; tokenLayers: TokenLayer[] }) {
  return (
    <div className={docsSpacing.pageStack}>
      <section id="tokens" className="flex flex-col gap-2">
        <PageLead
          crumb={lang === "en" ? "Design Tokens / Overview" : "设计令牌 / 概览"}
          title={lang === "en" ? "Design Tokens" : "设计令牌"}
          lead={lang === "en" ? "Tokens are the visual source of truth for fx-ui — consumed by both engineers (real values and usage) and AI (generation constraints and component rules)." : "Tokens 是 fx-ui 的公司视觉真相，给工程师（真实值和用法）和 AI（生成约束、组件级规则）同时消费。"}
          actions={actions}
        />
      </section>

      <section id="tokens-architecture" className={docsSpacing.sectionStack}>
        <div className="flex flex-col gap-2">
          <Tag variant="secondary" className="w-fit">{lang === "en" ? "Token System" : "Token 系统"}</Tag>
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Token architecture" : "基础架构"}</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {tokenLayers.map((layer) => (
            <WebsiteCardContainer key={layer.title}>
              <CardHeader><CardTitle className="text-base">{layer.title}</CardTitle></CardHeader>
              <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
                <p>{lang === "en" ? layer.descEn : layer.desc}</p>
                <code className="rounded-lg bg-muted px-3 py-2 text-xs text-foreground">{layer.example}</code>
              </CardContent>
            </WebsiteCardContainer>
          ))}
        </div>
      </section>

      <section className={docsSpacing.sectionStack}>
        <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Browse by Category" : "按分类浏览"}</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            { label: "颜色", labelEn: "Colors", desc: "品牌色、色板、语义色", href: "#tokens-colors" },
            { label: "排版", labelEn: "Typography", desc: "字号、字重、字族", href: "#tokens-typography" },
            { label: "圆角", labelEn: "Radius", desc: "控件、卡片、浮层圆角", href: "#tokens-radius" },
            { label: "阴影", labelEn: "Shadow", desc: "L1/L2/L3 四档投影", href: "#tokens-shadow" },
            { label: "间距", labelEn: "Spacing", desc: "页面节奏与组件密度", href: "#tokens-spacing" },
            { label: "层级", labelEn: "Layer", desc: "z-index 约定", href: "#tokens-layer" },
            { label: "动效", labelEn: "Motion", desc: "时长、缓动、进出场", href: "#tokens-motion" },
          ].map((item) => (
            <a key={item.href} href={item.href} className="block h-full">
              <WebsiteCardContainer className="h-full">
                <CardContent className="flex flex-col gap-1 p-4">
                  <div className="font-medium">{lang === "en" ? item.labelEn : item.label}</div>
                  <div className="text-sm text-muted-foreground">{item.desc}</div>
                </CardContent>
              </WebsiteCardContainer>
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}

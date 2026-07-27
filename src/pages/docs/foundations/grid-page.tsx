import type { ReactNode } from "react"

import { CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DocSurfaceTableCard } from "@/components/fx/doc-surface"
import { PageLead } from "@/components/fx/page-lead"
import { WebsiteCardContainer } from "@/components/fx/website-card-container"
import { docsSpacing } from "@/lib/docs-spacing"

export type GridPageLang = "zh" | "en"

export const gridAnchors = [
  { label: "栅格系统", labelEn: "Grid", href: "#grid-system" },
  { label: "响应式断点", labelEn: "Breakpoints", href: "#grid-breakpoints" },
]

export function GridPage({ actions, lang }: { actions: ReactNode; lang: GridPageLang }) {
  return (
    <div className={docsSpacing.pageStack}>
      <section id="grid-system" className="flex flex-col gap-2">
        <PageLead
          crumb={lang === "en" ? "Foundations / Grid" : "基础 / 栅格"}
          title={lang === "en" ? "Grid" : "栅格"}
          lead={lang === "en" ? "24-column grid with 16px gutter — split content by /24, freely combined. Aligns with Semi / Ant grid conventions." : "24 列栅格、16px 列间距——内容按 /24 自由组合。对齐 Semi / Ant 栅格惯例。"}
          actions={actions}
        />
      </section>

      <section className={docsSpacing.sectionStack}>
        <div>
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Grid 栅格系统" : "栅格系统"}</h2>
          <p className="mt-2 text-base text-muted-foreground">{lang === "en" ? "24 columns, column gap = 16px (gap-4). Span by /24 with col-span-[n]." : "24 列基准，列间距 = 16px（gap-4）。分栏用 col-span-[n]（按 24 计），可 1/24 自由组合。"}</p>
        </div>
        <div>
          <p className="mb-2 text-base font-medium">{lang === "en" ? "24 columns (16px gap)" : "24 列栅格（列间距 16px）"}</p>
          <WebsiteCardContainer><CardContent className="p-5"><div className="grid grid-cols-[repeat(24,minmax(0,1fr))] gap-1">{Array.from({ length: 24 }).map((_, i) => <div key={i} className="flex h-9 items-center justify-center rounded bg-muted text-xs text-muted-foreground">{i + 1}</div>)}</div></CardContent></WebsiteCardContainer>
        </div>

        <div>
          <p className="mb-2 text-base font-medium">{lang === "en" ? "Equal columns" : "等分栅格"}</p>
          <WebsiteCardContainer><CardContent className="flex flex-col gap-2 p-5">{[1, 2, 3, 4, 6].map((n) => <div key={n} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>{Array.from({ length: n }).map((_, i) => <div key={i} className="flex h-9 items-center justify-center rounded bg-muted text-sm text-muted-foreground">{`1/${n}`}</div>)}</div>)}</CardContent></WebsiteCardContainer>
        </div>

        <div>
          <p className="mb-2 text-base font-medium">{lang === "en" ? "Mixed (by /24)" : "混合布局（按 24 分）"}</p>
          <WebsiteCardContainer><CardContent className="flex flex-col gap-2 p-5">{[[6, 18], [8, 16], [6, 12, 6], [18, 6]].map((row, ri) => <div key={ri} className="grid grid-cols-[repeat(24,minmax(0,1fr))] gap-4">{row.map((span, ci) => <div key={ci} className="flex h-9 items-center justify-center rounded bg-muted text-sm text-muted-foreground" style={{ gridColumn: `span ${span} / span ${span}` }}>{span}/24</div>)}</div>)}</CardContent></WebsiteCardContainer>
        </div>

        <div>
          <p className="mb-2 text-base font-medium">{lang === "en" ? "Alignment" : "对齐方式"}</p>
          <WebsiteCardContainer><CardContent className="flex flex-col gap-2 p-5">{([{ just: "justify-start", zh: "整体左对齐", en: "Left" }, { just: "justify-center", zh: "居中", en: "Center" }, { just: "justify-end", zh: "右对齐", en: "Right" }, { just: "justify-between", zh: "左右齐飞（两端）", en: "Justify" }] as const).map((a) => <div key={a.just} className="flex items-center gap-3 rounded bg-muted/40 p-2"><span className="w-28 shrink-0 text-sm text-muted-foreground">{lang === "en" ? a.en : a.zh}</span><div className={`flex flex-1 ${a.just} gap-2`}>{[0, 1, 2].map((i) => <div key={i} className="h-7 w-60 rounded bg-muted" />)}</div></div>)}</CardContent></WebsiteCardContainer>
        </div>

        <WebsiteCardContainer><CardContent className="p-5 text-base text-muted-foreground"><p><span className="font-medium text-foreground">{lang === "en" ? "Offset" : "偏移"}</span>：{lang === "en" ? "leave columns before content with " : "内容前留空用 "}<code className="rounded bg-muted px-1 text-sm">col-start-[n]</code></p><p className="mt-1"><span className="font-medium text-foreground">{lang === "en" ? "Container" : "容器/版心"}</span>：{lang === "en" ? "max-width + page padding — " : "内容最大宽度 + 页面外边距 — "}<code className="rounded bg-muted px-1 text-sm">max-w-7xl</code> + <code className="rounded bg-muted px-1 text-sm">px-4 lg:px-8</code></p><p className="mt-1"><span className="font-medium text-foreground">{lang === "en" ? "Nesting" : "嵌套"}</span>：{lang === "en" ? "a grid can nest another grid; child re-splits by /24." : "栅格内可再嵌栅格，子栅格按 1/24 重新划分。"}</p><p className="mt-3 border-t border-border pt-3"><span className="font-medium text-foreground">{lang === "en" ? "Advanced (Semi/Ant)" : "进阶（对齐 Semi/Ant）"}</span>：{lang === "en" ? "gutter accepts [horizontal, vertical] and responsive {sm,md,lg…}; recommended gutter = 16+8n. Reorder via order; offset/push/pull for fine positioning." : "列间距 gutter 支持 [水平, 垂直] 与响应式对象 {sm,md,lg…}；推荐取值 16+8n。需要改顺序用 order；offset/push/pull 做精细位移。"}</p></CardContent></WebsiteCardContainer>
      </section>

      <section id="grid-breakpoints" className={docsSpacing.sectionStack}>
        <div><h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Breakpoints 响应式断点" : "响应式断点"}</h2><p className="mt-2 text-base text-muted-foreground">{lang === "en" ? "Tailwind is mobile-first: base styles apply at every width; a prefix like lg: means \"apply only when the viewport ≥ this width\"." : "Tailwind 是移动优先：不带前缀的样式对所有宽度生效；加前缀（如 lg:）表示\"屏幕宽度 ≥ 该值时才生效\"。"}</p></div>
        <DocSurfaceTableCard><Table className="min-w-[520px]"><TableHeader><TableRow><TableHead className="pl-4">{lang === "en" ? "Prefix" : "前缀"}</TableHead><TableHead>{lang === "en" ? "Triggers at width ≥" : "宽度 ≥ 时生效"}</TableHead><TableHead className="pr-4">{lang === "en" ? "Typical" : "典型设备"}</TableHead></TableRow></TableHeader><TableBody>{[["sm", "640px", "大手机/小平板"], ["md", "768px", "平板"], ["lg", "1024px", "笔记本（后台默认）"], ["xl", "1280px", "桌面"], ["2xl", "1536px", "大屏"]].map(([p, w, d]) => <TableRow key={p}><TableCell className="pl-4"><code className="rounded bg-muted px-1.5 py-0.5 text-sm">{p}:</code></TableCell><TableCell className="text-base text-muted-foreground">{w}</TableCell><TableCell className="pr-4 text-base text-muted-foreground">{lang === "en" ? "" : d}</TableCell></TableRow>)}</TableBody></Table></DocSurfaceTableCard>
        <WebsiteCardContainer><CardContent className="p-5"><p className="mb-3 text-base text-muted-foreground">{lang === "en" ? <>Example: <code className="rounded bg-muted px-1 text-sm">grid-cols-1 lg:grid-cols-3</code> — 1 column below 1024px, 3 columns at ≥1024px.</> : <>例子：<code className="rounded bg-muted px-1 text-sm">grid-cols-1 lg:grid-cols-3</code> —— 窗口 &lt; 1024px 时一列，≥ 1024px 自动变三列。拖动窗口可看到它"断"。</>}</p><div className="grid grid-cols-1 gap-2 lg:grid-cols-3">{[0, 1, 2].map((i) => <div key={i} className="flex h-12 items-center justify-center rounded bg-muted text-sm text-muted-foreground">{i + 1}</div>)}</div></CardContent></WebsiteCardContainer>
      </section>
    </div>
  )
}

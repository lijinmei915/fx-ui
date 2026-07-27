import { CardContent } from "@/components/ui/card"
import { Tag } from "@/components/ui/tag"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { WebsiteCardContainer } from "@/components/fx/website-card-container"
import { PageLead } from "@/components/fx/page-lead"
import { DocSurfaceTableCard } from "@/components/fx/doc-surface"
import { CopyCodeBlock } from "@/pages/docs/components/standard-doc-page"
import { docsSpacing } from "@/lib/docs-spacing"

type ThemeManifest = {
  semanticSlots: { layer: string; example: string; purpose: string }[]
  changeFlow: string[]
}

export function GettingStartedThemePage({ actions, lang, theme, themeImportCode }: {
  actions: React.ReactNode
  lang: "zh" | "en"
  theme: ThemeManifest
  themeImportCode: string
}) {
  return (
    <div className={docsSpacing.pageStack}>
      <section id="theme" className="flex flex-col gap-2"><PageLead crumb={lang === "en" ? "Getting Started / Theme Setup" : "开始使用 / 主题"} title={lang === "en" ? "Theme" : "主题"} lead={lang === "en" ? "fx-ui does not restyle every component by hand. Company visuals are injected through shadcn semantic tokens." : "fx-ui 不逐个重写组件样式。公司视觉通过 shadcn 语义 token 注入。"} actions={actions} /></section>
      <section id="theme-source" className={docsSpacing.sectionStack}>
        <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Token Source" : "token 真相源"}</h2>
        <WebsiteCardContainer><CardContent className="grid gap-4 p-5 md:grid-cols-2"><div><Tag variant="secondary">SSOT</Tag><h3 className="mt-3 font-medium">theme/fx-theme.css</h3><p className="mt-2 text-sm text-muted-foreground">{lang === "en" ? "Changing this file changes the whole system." : "改这里等于全局换肤，必须先说明影响范围。"}</p></div><CopyCodeBlock code={themeImportCode} label="src/main.tsx" lang={lang} /></CardContent></WebsiteCardContainer>
      </section>
      <section id="theme-slots" className={docsSpacing.sectionStack}>
        <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Semantic Slots" : "shadcn 语义槽"}</h2>
        <DocSurfaceTableCard><Table className="min-w-[720px]"><TableHeader><TableRow><TableHead className="pl-4">Layer</TableHead><TableHead>{lang === "en" ? "Example" : "例子"}</TableHead><TableHead className="pr-4">{lang === "en" ? "Purpose" : "用途"}</TableHead></TableRow></TableHeader><TableBody>{theme.semanticSlots.map((item) => <TableRow key={item.layer}><TableCell className="pl-4 font-medium">{item.layer}</TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{item.example}</code></TableCell><TableCell className="pr-4 text-muted-foreground">{item.purpose}</TableCell></TableRow>)}</TableBody></Table></DocSurfaceTableCard>
      </section>
      <section id="theme-flow" className={docsSpacing.sectionStack}>
        <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Change Flow" : "修改流程"}</h2>
        <WebsiteCardContainer><CardContent className="flex flex-col gap-3 p-5 text-sm text-muted-foreground">{theme.changeFlow.map((item, index) => <p key={item}>{index + 1}. {item}</p>)}</CardContent></WebsiteCardContainer>
      </section>
    </div>
  )
}

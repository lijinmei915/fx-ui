import { CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tag } from "@/components/ui/tag"
import { WebsiteCardContainer } from "@/components/fx/website-card-container"
import { PageLead } from "@/components/fx/page-lead"
import { DocSurfaceTableCard } from "@/components/fx/doc-surface"
import { GovernanceQuickLinks } from "@/pages/docs/governance/governance-quick-links"
import { CheckCircleIcon } from "@/lib/icons"
import { CopyCodeBlock } from "@/pages/docs/components/standard-doc-page"
import { docsSpacing } from "@/lib/docs-spacing"

type DocumentationManifest = {
  ssotRoutes: { question: string; source: string; usage: string }[]
  antiDriftLoop: { title: string; file: string; desc: string }[]
  writeRules: string[]
}

export function GettingStartedDocumentationPage({ actions, lang, documentation, quickLinks }: {
  actions: React.ReactNode
  lang: "zh" | "en"
  documentation: DocumentationManifest
  quickLinks: { label: string; labelEn?: string; href: string; page?: string }[]
}) {
  return (
    <div className={docsSpacing.pageStack}>
      <section id="documentation" className="flex flex-col gap-2">
        <PageLead crumb={lang === "en" ? "Governance / Documentation" : "治理中心 / 文档规范"} title={lang === "en" ? "Documentation" : "文档规范"} lead={lang === "en" ? "This page explains where information belongs, how to avoid orphan documents, and when text rules need machine checks." : "这页解决一件事：一条信息该写去哪，怎么避免孤岛文档，以及哪些文字规则必须升级成机器检查。"} actions={actions} />
        <GovernanceQuickLinks currentPage="documentation" lang={lang} items={quickLinks} />
      </section>
      <section id="documentation-ssot" className={docsSpacing.sectionStack}>
        <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "SSOT Routes" : "SSOT 路由"}</h2>
        <p className="text-base text-muted-foreground">{lang === "en" ? "One kind of information has one truth source, and every referenced surface must stay linked to it instead of drifting into separate copies." : "同一类信息只维护一个真相源；所有引用到它的地方都必须和它联动，不能各自漂成副本。"}</p>
        <DocSurfaceTableCard><Table className="min-w-[760px]"><TableHeader><TableRow><TableHead className="pl-4">{lang === "en" ? "Question" : "问题"}</TableHead><TableHead>{lang === "en" ? "Truth Source" : "真相源"}</TableHead><TableHead className="pr-4">{lang === "en" ? "Use It For" : "使用场景"}</TableHead></TableRow></TableHeader><TableBody>{documentation.ssotRoutes.map((item) => <TableRow key={item.question}><TableCell className="pl-4 font-medium">{item.question}</TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{item.source}</code></TableCell><TableCell className="pr-4 text-muted-foreground">{item.usage}</TableCell></TableRow>)}</TableBody></Table></DocSurfaceTableCard>
      </section>
      <section id="documentation-anti-drift" className={docsSpacing.sectionStack}>
        <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Anti-Drift Loop" : "防漂三件套"}</h2>
        <div className="grid gap-4 md:grid-cols-3">{documentation.antiDriftLoop.map((item) => <WebsiteCardContainer key={item.title} size="sm"><CardContent className="p-4"><Tag variant="secondary">{item.title}</Tag><p className="mt-3 font-medium"><code>{item.file}</code></p><p className="mt-2 text-sm text-muted-foreground">{item.desc}</p></CardContent></WebsiteCardContainer>)}</div>
        <WebsiteCardContainer><CardContent><CopyCodeBlock code="文字规范 -> 机器事实表 -> 可执行检查" label="governance loop" lang={lang} /></CardContent></WebsiteCardContainer>
      </section>
      <section id="documentation-write-rules" className={docsSpacing.sectionStack}>
        <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Write Rules" : "写入规则"}</h2>
        <WebsiteCardContainer><CardContent className="flex flex-col gap-3 p-5 text-sm text-muted-foreground">{documentation.writeRules.map((rule) => <div key={rule} className="flex gap-2"><CheckCircleIcon className="mt-1 size-4 text-primary" /> <span>{rule}</span></div>)}</CardContent></WebsiteCardContainer>
      </section>
    </div>
  )
}

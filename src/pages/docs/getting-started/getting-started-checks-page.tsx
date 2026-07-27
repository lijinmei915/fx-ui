import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { WebsiteCardContainer } from "@/components/fx/website-card-container"
import { PageLead } from "@/components/fx/page-lead"
import { DocSurfaceTableCard } from "@/components/fx/doc-surface"
import { GovernanceQuickLinks } from "@/pages/docs/governance/governance-quick-links"
import { CheckCircleIcon } from "@/lib/icons"
import { docsSpacing } from "@/lib/docs-spacing"

type ChecksManifest = {
  commands: { command: string; usage: string }[]
  layers: { title: string; script: string; desc: string }[]
  finishChecklist: string[]
}

export function GettingStartedChecksPage({ actions, lang, checks, quickLinks }: {
  actions: React.ReactNode
  lang: "zh" | "en"
  checks: ChecksManifest
  quickLinks: { label: string; labelEn?: string; href: string; page?: string }[]
}) {
  return (
    <div className={docsSpacing.pageStack}>
      <section id="checks" className="flex flex-col gap-2">
        <PageLead
          crumb={lang === "en" ? "Governance / Checks" : "维护 / 检查命令"}
          title={lang === "en" ? "Checks" : "检查命令"}
          lead={lang === "en" ? "Use these commands to verify component contracts, token sync, documentation structure, and production build health." : "这里列出一次改动完成前该跑什么检查：组件契约、token 同步、文档站骨架、组件 manifest 和生产构建。"}
          actions={actions}
        />
        <GovernanceQuickLinks currentPage="checks" lang={lang} items={quickLinks} />
      </section>

      <section id="checks-commands" className={docsSpacing.sectionStack}>
        <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Commands" : "常用命令"}</h2>
        <DocSurfaceTableCard>
          <Table className="min-w-[760px]"><TableHeader><TableRow><TableHead className="pl-4">{lang === "en" ? "Command" : "命令"}</TableHead><TableHead className="pr-4">{lang === "en" ? "When To Use" : "什么时候用"}</TableHead></TableRow></TableHeader><TableBody>{checks.commands.map((item) => <TableRow key={item.command}><TableCell className="pl-4"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{item.command}</code></TableCell><TableCell className="pr-4 text-muted-foreground">{item.usage}</TableCell></TableRow>)}</TableBody></Table>
        </DocSurfaceTableCard>
      </section>

      <section id="checks-layers" className={docsSpacing.sectionStack}>
        <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Check Layers" : "检查分层"}</h2>
        <div className="grid gap-4 md:grid-cols-2">{checks.layers.map((item) => <WebsiteCardContainer key={item.title}><CardHeader><CardTitle className="text-base">{item.title}</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground"><p><code>{item.script}</code></p><p className="mt-2">{item.desc}</p></CardContent></WebsiteCardContainer>)}</div>
      </section>

      <section id="checks-checklist" className={docsSpacing.sectionStack}>
        <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Finish Checklist" : "收尾清单"}</h2>
        <WebsiteCardContainer><CardContent className="flex flex-col gap-3 p-5 text-sm text-muted-foreground">{checks.finishChecklist.map((item) => <div key={item} className="flex gap-2"><CheckCircleIcon className="mt-1 size-4 text-primary" /> <span>{item}</span></div>)}</CardContent></WebsiteCardContainer>
      </section>
    </div>
  )
}

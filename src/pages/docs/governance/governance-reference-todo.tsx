import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tag } from "@/components/ui/tag"
import { WebsiteCardContainer } from "@/components/fx/website-card-container"
import { SectionLead } from "@/components/fx/section-lead"
import { StatusBadge } from "@/pages/docs/governance/governance-graph-primitives"

type GovernanceReference = { title: string; desc: string; href: string }
type GovernanceTodo = { id: string; title: string; priority: string; status: string; definitionOfDone: string }

export function GovernanceReferenceTodo({ lang, references, items }: { lang: "zh" | "en"; references: GovernanceReference[]; items: GovernanceTodo[] }) {
  return (
    <>
      <section id="governance-map-references" className="flex flex-col gap-4">
        <SectionLead title={lang === "en" ? "References" : "参考案例"} description={lang === "en" ? "These are not copied directly. They point to mainstream patterns that match our direction." : "这些不是照搬，而是说明我们的方向和主流做法接近：关系图、检查项、Policy as Code。"} />
        <div className="grid gap-4 md:grid-cols-3">{references.map((reference) => <WebsiteCardContainer key={reference.title}><CardHeader><CardTitle className="text-base">{reference.title}</CardTitle><CardDescription>{reference.desc}</CardDescription></CardHeader><CardContent><a className="text-sm font-medium text-primary hover:underline" href={reference.href} target="_blank" rel="noreferrer">{lang === "en" ? "Open reference" : "查看参考"}</a></CardContent></WebsiteCardContainer>)}</div>
      </section>
      <section id="governance-map-todo" className="flex flex-col gap-4">
        <SectionLead title={lang === "en" ? "Governance TODO" : "治理待办"} description={lang === "en" ? "The next automation and anti-drift steps tracked as machine data, so follow-up work does not live only in chat history." : "后续自动化和防漂工作直接登记成机器事实，避免待办只存在聊天记录里。"} />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{items.map((item) => <WebsiteCardContainer key={item.id}><CardHeader><div className="flex items-center justify-between gap-3"><CardTitle className="text-base">{item.title}</CardTitle><div className="flex items-center gap-2"><Tag variant="secondary">{item.priority}</Tag><StatusBadge status={item.status} /></div></div></CardHeader><CardContent className="text-sm text-muted-foreground"><p>{item.definitionOfDone}</p></CardContent></WebsiteCardContainer>)}</div>
      </section>
    </>
  )
}

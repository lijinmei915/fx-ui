import { CardContent } from "@/components/ui/card"
import { WebsiteCardContainer } from "@/components/fx/website-card-container"
import { SectionLead } from "@/components/fx/section-lead"
import { StepBadge } from "@/pages/docs/governance/governance-graph-primitives"
import { docsSpacing } from "@/lib/docs-spacing"

type GovernanceLoopItem = { file: string; title: string; titleEn: string; desc: string; descEn: string }

export function GovernanceLoop({ lang, items }: { lang: "zh" | "en"; items: GovernanceLoopItem[] }) {
  return <section id="governance-map-loop" className={docsSpacing.sectionStack}><SectionLead title={lang === "en" ? "Governance Loop" : "治理闭环"} description={lang === "en" ? "This is the rule model behind the status board." : "这是现状看板背后的规则模型，平时不用先看它。"} /><div className="grid gap-4 md:grid-cols-4">{items.map((item, index) => <WebsiteCardContainer key={item.file}><CardContent className="relative p-4"><StepBadge index={index} /><h3 className="mt-4 text-base font-semibold">{lang === "en" ? item.titleEn : item.title}</h3><code className="mt-2 block rounded bg-muted px-2 py-1 text-xs">{item.file}</code><p className="mt-3 text-sm text-muted-foreground">{lang === "en" ? item.descEn : item.desc}</p></CardContent></WebsiteCardContainer>)}</div></section>
}

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WebsiteCardContainer } from "@/components/fx/website-card-container"
import { PageLead } from "@/components/fx/page-lead"
import { CopyCodeBlock } from "@/pages/docs/components/standard-doc-page"
import { docsSpacing } from "@/lib/docs-spacing"

type AiRulesManifest = {
  guardrails: { title: string; desc: string }[]
  styleFlow: string[]
}

export function GettingStartedAiRulesPage({ actions, lang, aiRules }: { actions: React.ReactNode; lang: "zh" | "en"; aiRules: AiRulesManifest }) {
  return (
    <div className={docsSpacing.pageStack}>
      <section id="ai-rules" className="flex flex-col gap-3"><PageLead crumb={lang === "en" ? "Governance / Rules" : "治理中心 / 规则库"} title={lang === "en" ? "Rules" : "规则库"} lead={lang === "en" ? "These rules keep AI-generated pages aligned with shadcn open-code, company tokens, and executable checks." : "这些规则用来保证 AI 生成页面时对齐 shadcn open-code、公司 token 和可执行检查。"} actions={actions} /></section>
      <section id="ai-guardrails" className={docsSpacing.sectionStack}><h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Guardrails" : "行为红线"}</h2><div className="grid gap-4 md:grid-cols-2">{aiRules.guardrails.map((item) => <WebsiteCardContainer key={item.title}><CardHeader><CardTitle className="text-base">{item.title}</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">{item.desc}</CardContent></WebsiteCardContainer>)}</div></section>
      <section id="ai-style-flow" className={docsSpacing.sectionStack}><h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Style Flow" : "改样式流程"}</h2><WebsiteCardContainer><CardContent className="flex flex-col gap-3 p-5 text-sm text-muted-foreground">{aiRules.styleFlow.map((item, index) => <p key={item}>{index + 1}. {item}</p>)}</CardContent></WebsiteCardContainer></section>
      <section id="ai-checks" className={docsSpacing.sectionStack}><h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Checks" : "交付检查"}</h2><WebsiteCardContainer><CardContent><CopyCodeBlock code="npm run check" label="check" lang={lang} /></CardContent></WebsiteCardContainer><p className="text-base text-muted-foreground">{lang === "en" ? "This runs shadcn contract checks, token drift checks, doc-site contract checks, component manifest checks, and the production build." : "这会同时跑 shadcn 契约、token 漂移、文档站契约、组件 manifest 和生产构建。"}</p></section>
    </div>
  )
}

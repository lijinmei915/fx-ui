import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WebsiteCardContainer } from "@/components/fx/website-card-container"

type MaintenanceModel = { title: string; desc: string; layers: { name: string; source: string; role: string; update: string }[]; rules: string[] }

export function GovernanceMaintenanceModel({ lang, model }: { lang: "zh" | "en"; model: MaintenanceModel }) {
  return <WebsiteCardContainer><CardHeader><CardTitle className="text-base">{model.title}</CardTitle><CardDescription>{model.desc}</CardDescription></CardHeader><CardContent className="flex flex-col gap-4"><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">{model.layers.map((layer) => <div key={layer.source} className="rounded-xl border border-border bg-muted p-3"><div className="text-sm font-semibold text-foreground">{layer.name}</div><code className="mt-2 block w-fit rounded bg-muted px-1.5 py-0.5 text-xs text-foreground">{layer.source}</code><p className="mt-2 text-xs leading-5 text-muted-foreground">{layer.role}</p><p className="mt-2 text-xs leading-5 text-muted-foreground">{layer.update}</p></div>)}</div><div className="rounded-xl bg-muted p-4"><div className="text-sm font-semibold text-foreground">{lang === "en" ? "Change Rules" : "改动规则"}</div><ul className="mt-3 grid gap-2 text-sm text-muted-foreground">{model.rules.map((rule) => <li key={rule} className="flex gap-2"><span className="mt-3 size-1.5 shrink-0 rounded-full bg-success" /><span>{rule}</span></li>)}</ul></div></CardContent></WebsiteCardContainer>
}

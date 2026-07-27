import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DocSurfaceTableCard } from "@/components/fx/doc-surface"
import { SectionLead } from "@/components/fx/section-lead"
import { StatusBadge } from "@/pages/docs/governance/governance-graph-primitives"
import { docsSpacing } from "@/lib/docs-spacing"

type FreshnessRow = { name: string; source: string; updatedAtKey: string; maintenance: string }
type AssetRow = { rule: string; textSpec: string; machineData: string; check: string; status: string }

export function GovernanceFreshnessAssets({ lang, freshness, assets, values }: { lang: "zh" | "en"; freshness: FreshnessRow[]; assets: AssetRow[]; values: Record<string, string> }) {
  return (
    <>
      <section id="governance-map-freshness" className={docsSpacing.sectionStack}><SectionLead title={lang === "en" ? "Freshness" : "数据新鲜度"} description={lang === "en" ? "The board updates when these source files update." : "这个看板的“实时”来自这些源文件，源文件变了，看板刷新后就变。"} /><DocSurfaceTableCard><Table className="min-w-[860px]"><TableHeader><TableRow><TableHead className="pl-4">数据</TableHead><TableHead>来源</TableHead><TableHead>更新时间</TableHead><TableHead className="pr-4">怎么维护</TableHead></TableRow></TableHeader><TableBody>{freshness.map((row) => <TableRow key={row.source}><TableCell className="pl-4 font-medium">{row.name}</TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.source}</code></TableCell><TableCell className="text-muted-foreground">{values[row.updatedAtKey] ?? row.updatedAtKey}</TableCell><TableCell className="pr-4 text-muted-foreground">{row.maintenance}</TableCell></TableRow>)}</TableBody></Table></DocSurfaceTableCard></section>
      <section id="governance-map-assets" className={docsSpacing.sectionStack}><SectionLead title={lang === "en" ? "Governance Assets" : "规则资产"} description={lang === "en" ? "This table shows which rules already have the full anti-drift loop and which ones still need structure." : "这张表看一眼就知道：哪些规则已经形成防漂闭环，哪些还只是半结构化。"} /><DocSurfaceTableCard><Table className="min-w-[900px]"><TableHeader><TableRow><TableHead className="pl-4">{lang === "en" ? "Rule" : "规则"}</TableHead><TableHead>{lang === "en" ? "Text Spec" : "文字规范"}</TableHead><TableHead>{lang === "en" ? "Machine Data" : "机器事实"}</TableHead><TableHead>{lang === "en" ? "Check" : "检查"}</TableHead><TableHead className="pr-4">{lang === "en" ? "Status" : "状态"}</TableHead></TableRow></TableHeader><TableBody>{assets.map((asset) => <TableRow key={asset.rule}><TableCell className="pl-4 font-medium">{asset.rule}</TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{asset.textSpec}</code></TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{asset.machineData}</code></TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{asset.check}</code></TableCell><TableCell className="pr-4"><StatusBadge status={asset.status} /></TableCell></TableRow>)}</TableBody></Table></DocSurfaceTableCard></section>
    </>
  )
}

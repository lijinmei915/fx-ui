import type { ReactNode } from "react";
import { DocSurfaceCard, DocSurfaceTableCard } from "@/components/fx/doc-surface";
import { PageLead } from "@/components/fx/page-lead";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { docsSpacing } from "@/lib/docs-spacing";

export const layerTokens = [
{ name: "--fds-g-z-index-0", value: 0, usage: "默认 stacking context 起点", usageEn: "Default stacking-context origin" },
{ name: "--fds-g-z-index-10", value: 10, usage: "当前 React 映射：局部控件内部层级", usageEn: "Current React mapping: local component layers" },
{ name: "--fds-g-z-index-20", value: 20, usage: "当前 React 映射：局部交互热区", usageEn: "Current React mapping: local interaction hit areas" },
{ name: "--fds-g-z-index-30", value: 30, usage: "保留数值档，由运行时契约决定用途", usageEn: "Reserved numeric step; runtime contracts decide its role" },
{ name: "--fds-g-z-index-40", value: 40, usage: "当前 React 映射：固定 Header、文档顶部导航", usageEn: "Current React mapping: fixed headers and document navigation" },
{ name: "--fds-g-z-index-50", value: 50, usage: "当前 React 映射：Dialog、Dropdown、Popover 等浮层", usageEn: "Current React mapping: Dialog, Dropdown, Popover, and other overlays" }];
export type LayerToken = { name: string; value: number; usage: string; usageEn: string };
type Props = { actions: ReactNode; lang: "zh" | "en"; layerTokens: LayerToken[] };

export const tokenLayerAnchors = [
  { label: "层级档位", labelEn: "Layer levels", href: "#tokens-layer-scale" },
  { label: "分层逻辑", labelEn: "Layering logic", href: "#tokens-layer-logic" },
]

export function TokensLayerPage({ actions, lang, layerTokens }: Props) {
  return <div className={docsSpacing.pageStack}>
    <section id="tokens-layer" className="flex flex-col gap-2"><PageLead crumb={lang === "en" ? "Design Tokens / Layer" : "设计令牌 / 层级"} title={lang === "en" ? "Layer" : "层级"} lead={lang === "en" ? "The foundation owns numeric z-index steps. Each product runtime maps roles inside its own stacking contexts without inventing new values." : "基础层只维护 z-index 数值档；各产品运行时在自己的 stacking context 中映射角色，不新增随意值。"} actions={actions} /></section>
    <section id="tokens-layer-scale" className={`${docsSpacing.sectionStack} scroll-mt-24`}><div><h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Layer levels 层级档位" : "层级档位"}</h2><p className="mt-2 text-base text-muted-foreground">{lang === "en" ? "Fixed numeric steps; semantic roles are assigned later by each runtime contract." : "这里只定义固定数字，具体语义由各运行时契约在上层分配。"}</p></div><DocSurfaceCard className="overflow-x-auto p-5"><p className="mb-3 text-sm text-muted-foreground">{lang === "en" ? "Higher values stack above lower values inside the same context." : "在同一个 stacking context 中，数字越大越靠上。"}</p><div className="relative h-28 min-w-[720px]">{layerTokens.map((row, i) => <div key={row.name} className="absolute flex h-10 w-32 items-center rounded-lg border border-border bg-card px-3 text-sm font-medium shadow-l1" style={{ top: `${i * 12}px`, left: `${i * 112}px`, zIndex: row.value }}>{row.name}</div>)}</div></DocSurfaceCard><DocSurfaceTableCard><Table className="min-w-[760px]"><TableHeader><TableRow><TableHead className="pl-4">Token</TableHead><TableHead>{lang === "en" ? "Value" : "值"}</TableHead><TableHead className="pr-4">{lang === "en" ? "Current mapping" : "当前映射"}</TableHead></TableRow></TableHeader><TableBody>{layerTokens.map((row) => <TableRow key={row.name} className="hover:bg-transparent"><TableCell className="pl-4 font-medium"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.name}</code></TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.value}</code></TableCell><TableCell className="pr-4 text-foreground">{lang === "en" ? row.usageEn : row.usage}</TableCell></TableRow>)}</TableBody></Table></DocSurfaceTableCard></section>
    <section id="tokens-layer-logic" className={`${docsSpacing.sectionStack} scroll-mt-24`}><div><h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Layering logic 分层逻辑" : "分层逻辑"}</h2><p className="mt-2 text-base text-muted-foreground">{lang === "en" ? "Numeric consistency without forcing runtimes to share a stacking architecture." : "统一数值，但不强迫不同运行时共享同一种层级架构。"}</p></div><DocSurfaceCard className="p-5 text-base leading-relaxed text-muted-foreground"><p><span className="font-medium text-foreground">{lang === "en" ? "Runtime boundary" : "运行时边界"}</span>：{lang === "en" ? "Dashboard, Report, and Workbench define their own stacking contexts and semantic roles." : "Dashboard、Report、工作台分别定义自己的 stacking context 和语义角色。"}</p><p className="mt-2"><span className="font-medium text-foreground">{lang === "en" ? "Shared foundation" : "共享底座"}</span>：{lang === "en" ? "all runtimes select from 0/10/20/30/40/50 instead of escalating arbitrary values." : "所有运行时只从 0/10/20/30/40/50 取值，不通过不断加大数字解决冲突。"}</p><p className="mt-3 border-t border-border pt-3"><span className="font-medium text-foreground">{lang === "en" ? "Governance" : "治理"}</span>：{lang === "en" ? "collaborators and agents cannot add new foundation levels; collisions are solved in the runtime contract first." : "协作者和 AI 不得新增基础档；遮挡冲突先在运行时契约中解决。"}</p></DocSurfaceCard></section>
  </div>;
}

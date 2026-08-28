import type { ReactNode } from "react";
import { DocSurfaceCard, DocSurfaceTableCard } from "@/components/fx/doc-surface";
import { PageLead } from "@/components/fx/page-lead";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { docsSpacing } from "@/lib/docs-spacing";

export const spacingTokens = [
{ name: "--fds-g-spacing-0", px: 0, value: "0px", usage: "零值", usageEn: "Zero value" },
{ name: "--fds-g-spacing-2", px: 2, value: "2px", usage: "物理补档：极紧凑间隔", usageEn: "Physical exception: ultra-tight spacing" },
{ name: "--fds-g-spacing-4", px: 4, value: "4px", usage: "4 点主网格起点", usageEn: "Start of the 4-point grid" },
{ name: "--fds-g-spacing-6", px: 6, value: "6px", usage: "物理补档：紧凑组件内部", usageEn: "Physical exception: compact component internals" },
{ name: "--fds-g-spacing-8", px: 8, value: "8px", usage: "2 × 4px", usageEn: "2 × 4px" },
{ name: "--fds-g-spacing-10", px: 10, value: "10px", usage: "物理补档：紧凑水平内距", usageEn: "Physical exception: compact horizontal inset" },
{ name: "--fds-g-spacing-12", px: 12, value: "12px", usage: "3 × 4px", usageEn: "3 × 4px" },
{ name: "--fds-g-spacing-16", px: 16, value: "16px", usage: "4 × 4px", usageEn: "4 × 4px" },
{ name: "--fds-g-spacing-20", px: 20, value: "20px", usage: "5 × 4px", usageEn: "5 × 4px" },
{ name: "--fds-g-spacing-24", px: 24, value: "24px", usage: "6 × 4px", usageEn: "6 × 4px" },
{ name: "--fds-g-spacing-28", px: 28, value: "28px", usage: "7 × 4px", usageEn: "7 × 4px" },
{ name: "--fds-g-spacing-32", px: 32, value: "32px", usage: "8 × 4px", usageEn: "8 × 4px" },
{ name: "--fds-g-spacing-36", px: 36, value: "36px", usage: "9 × 4px", usageEn: "9 × 4px" },
{ name: "--fds-g-spacing-40", px: 40, value: "40px", usage: "10 × 4px", usageEn: "10 × 4px" },
{ name: "--fds-g-spacing-48", px: 48, value: "48px", usage: "12 × 4px", usageEn: "12 × 4px" },
{ name: "--fds-g-spacing-56", px: 56, value: "56px", usage: "14 × 4px", usageEn: "14 × 4px" },
{ name: "--fds-g-spacing-64", px: 64, value: "64px", usage: "16 × 4px", usageEn: "16 × 4px" },
{ name: "--fds-g-spacing-80", px: 80, value: "80px", usage: "20 × 4px", usageEn: "20 × 4px" },
{ name: "--fds-g-spacing-96", px: 96, value: "96px", usage: "24 × 4px", usageEn: "24 × 4px" }];
export type SpacingToken = { name: string; value: string; px: number; usage: string; usageEn: string };
type Props = { actions: ReactNode; lang: "zh" | "en"; spacingTokens: SpacingToken[] };

export const tokenSpacingAnchors = [
  { label: "间距档位", labelEn: "Spacing scale", href: "#tokens-spacing-scale" },
  { label: "计算方式", labelEn: "How computed", href: "#tokens-spacing-compute" },
]

export function TokensSpacingPage({ actions, lang, spacingTokens }: Props) {
  return <div className={docsSpacing.pageStack}>
    <section id="tokens-spacing" className="flex flex-col gap-2"><PageLead crumb={lang === "en" ? "Design Tokens / Spacing" : "设计令牌 / 间距"} title={lang === "en" ? "Spacing" : "间距"} lead={lang === "en" ? "The foundation owns a complete numeric spacing scale. Product code still calls governed Tailwind utilities rather than selecting raw values directly." : "基础层维护完整的数值间距刻度；产品代码仍调用受治理的 Tailwind 工具类，不直接选择原始值。"} actions={actions} /></section>
    <section id="tokens-spacing-scale" className={`${docsSpacing.sectionStack} scroll-mt-24`}><div><h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Spacing scale 间距档位" : "间距档位"}</h2><p className="mt-2 text-base text-muted-foreground">{lang === "en" ? "Common steps off the 4px base. Example bar shows the real size; per-step usage is in the Usage column." : "基于 4px 基准的常用档位。示例长条是真实大小，逐档场景见右侧。"}</p></div><DocSurfaceTableCard><Table className="min-w-[720px]"><TableHeader><TableRow><TableHead className="pl-4">Token</TableHead><TableHead>{lang === "en" ? "Value" : "值"}</TableHead><TableHead>{lang === "en" ? "Example" : "示例"}</TableHead><TableHead className="pr-4">{lang === "en" ? "Usage" : "用法"}</TableHead></TableRow></TableHeader><TableBody>{spacingTokens.map((row) => <TableRow key={row.name} className="hover:bg-transparent"><TableCell className="pl-4 font-medium"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.name}</code></TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.value}</code></TableCell><TableCell><div className="h-4 rounded bg-primary/70" style={{ width: `${row.px}px` }} /></TableCell><TableCell className="pr-4 text-foreground">{lang === "en" ? row.usageEn : row.usage}</TableCell></TableRow>)}</TableBody></Table></DocSurfaceTableCard></section>
    <section id="tokens-spacing-compute" className={`${docsSpacing.sectionStack} scroll-mt-24`}><div><h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "How it's computed 计算方式" : "计算方式"}</h2><p className="mt-2 text-base text-muted-foreground">{lang === "en" ? "The scale uses a 4-point main grid with a few governed physical exceptions." : "以 4 点网格为主，只保留少量受治理的物理补档。"}</p></div><DocSurfaceCard className="p-5 text-base text-muted-foreground"><p><span className="font-medium text-foreground">{lang === "en" ? "Main grid" : "主网格"}</span>：<code className="rounded bg-muted px-1 text-sm">4px</code>{lang === "en" ? "; 8/12/16/20/24px continue the rhythm." : "；8/12/16/20/24px 等按此递进。"}</p><p className="mt-1"><span className="font-medium text-foreground">{lang === "en" ? "Physical exceptions" : "物理补档"}</span>：<code className="rounded bg-muted px-1 text-sm">2 / 6 / 10px</code>{lang === "en" ? " exist for icon gaps and compact control insets, not arbitrary page spacing." : " 只服务图标间隔和紧凑控件内距，不用于页面随意破格。"}</p><p className="mt-3 border-t border-border pt-3"><span className="font-medium text-foreground">{lang === "en" ? "Rule" : "用法"}</span>：{lang === "en" ? "foundation values are maintainer-only; pages use mapped Tailwind spacing utilities." : "基础值仅维护者可改；页面使用已映射的 Tailwind 间距工具类。"}</p></DocSurfaceCard></section>
  </div>;
}

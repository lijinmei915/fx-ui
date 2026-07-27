import type { ReactNode } from "react";
import { DocSurfaceCard, DocSurfaceTableCard } from "@/components/fx/doc-surface";
import { PageLead } from "@/components/fx/page-lead";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { docsSpacing } from "@/lib/docs-spacing";

export const spacingTokens = [
{ name: "gap-0", step: 0, px: 0, value: "0 / 0px", usage: "无间距 — 紧贴、去掉默认间隙", usageEn: "No gap — flush, remove default spacing" },
{ name: "gap-0.5", step: 0.5, px: 2, value: "0.125rem / 2px", usage: "极紧凑 — 图标与文字、徽标内部", usageEn: "Ultra-tight — icon-text, badge internals" },
{ name: "gap-1", step: 1, px: 4, value: "0.25rem / 4px", usage: "紧凑图标、微小内部间隔", usageEn: "Tight icon gaps and tiny internal spacing" },
{ name: "gap-2", step: 2, px: 8, value: "0.5rem / 8px", usage: "按钮图标、表单项内部间隔", usageEn: "Button icons and internal form item spacing" },
{ name: "gap-3", step: 3, px: 12, value: "0.75rem / 12px", usage: "章节标题与说明之间", usageEn: "Between a section title and its description" },
{ name: "gap-4", step: 4, px: 16, value: "1rem / 16px", usage: "卡片内容、表单字段之间", usageEn: "Card content and gaps between form fields" },
{ name: "gap-5", step: 5, px: 20, value: "1.25rem / 20px", usage: "章节标题组与主体内容之间", usageEn: "Between a section heading group and body content" },
{ name: "gap-6", step: 6, px: 24, value: "1.5rem / 24px", usage: "页面区块、小型章节之间", usageEn: "Page blocks and small sections" },
{ name: "gap-10", step: 10, px: 40, value: "2.5rem / 40px", usage: "文档章节、主内容分组之间", usageEn: "Documentation sections and major content groups" }];
export type SpacingToken = { name: string; value: string; px: number; usage: string; usageEn: string };
type Props = { actions: ReactNode; lang: "zh" | "en"; spacingTokens: SpacingToken[] };

export const tokenSpacingAnchors = [
  { label: "间距档位", labelEn: "Spacing scale", href: "#tokens-spacing-scale" },
  { label: "计算方式", labelEn: "How computed", href: "#tokens-spacing-compute" },
]

export function TokensSpacingPage({ actions, lang, spacingTokens }: Props) {
  return <div className={docsSpacing.pageStack}>
    <section id="tokens-spacing" className="flex flex-col gap-2"><PageLead crumb={lang === "en" ? "Design Tokens / Spacing" : "设计令牌 / 间距"} title={lang === "en" ? "Spacing" : "间距"} lead={lang === "en" ? "Spacing tokens keep page rhythm, component density, and documentation layout consistent. Prefer Tailwind spacing utilities instead of one-off pixel values." : "间距 token 用来统一页面节奏、组件密度和文档排版。优先使用 Tailwind 间距工具类，不临时手写像素值。"} actions={actions} /></section>
    <section id="tokens-spacing-scale" className={`${docsSpacing.sectionStack} scroll-mt-24`}><div><h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Spacing scale 间距档位" : "间距档位"}</h2><p className="mt-2 text-base text-muted-foreground">{lang === "en" ? "Common steps off the 4px base. Example bar shows the real size; per-step usage is in the Usage column." : "基于 4px 基准的常用档位。示例长条是真实大小，逐档场景见右侧。"}</p></div><DocSurfaceTableCard><Table className="min-w-[720px]"><TableHeader><TableRow><TableHead className="pl-4">Token</TableHead><TableHead>{lang === "en" ? "Value" : "值"}</TableHead><TableHead>{lang === "en" ? "Example" : "示例"}</TableHead><TableHead className="pr-4">{lang === "en" ? "Usage" : "用法"}</TableHead></TableRow></TableHeader><TableBody>{spacingTokens.map((row) => <TableRow key={row.name} className="hover:bg-transparent"><TableCell className="pl-4 font-medium"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.name}</code></TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.value}</code></TableCell><TableCell><div className="h-4 rounded bg-primary/70" style={{ width: `${row.px}px` }} /></TableCell><TableCell className="pr-4 text-foreground">{lang === "en" ? row.usageEn : row.usage}</TableCell></TableRow>)}</TableBody></Table></DocSurfaceTableCard></section>
    <section id="tokens-spacing-compute" className={`${docsSpacing.sectionStack} scroll-mt-24`}><div><h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "How it's computed 计算方式" : "计算方式"}</h2><p className="mt-2 text-base text-muted-foreground">{lang === "en" ? "Every spacing utility is the 4px base unit times the step number — a 4-point grid." : "每个间距 = 4px 基准单位 × 档位数字，构成 4 点网格。"}</p></div><DocSurfaceCard className="p-5 text-base text-muted-foreground"><p><span className="font-medium text-foreground">{lang === "en" ? "Base unit" : "基准单位"}</span>：<code className="rounded bg-muted px-1 text-sm">--spacing = 0.25rem（4px）</code>{lang === "en" ? " (Tailwind default)." : "（Tailwind 默认）。"}</p><p className="mt-1"><span className="font-medium text-foreground">{lang === "en" ? "Formula" : "公式"}</span>：<code className="rounded bg-muted px-1 text-sm">gap-n = calc(var(--spacing) * n)</code>{lang === "en" ? "，e.g. gap-4 = 4×4 = 16px, gap-6 = 4×6 = 24px." : "，如 gap-4 = 4×4 = 16px、gap-6 = 4×6 = 24px。"}</p><p className="mt-1"><span className="font-medium text-foreground">{lang === "en" ? "4-point grid" : "4 点网格"}</span>：{lang === "en" ? "all spacing snaps to multiples of 4px, so rhythm stays even and predictable across pages." : "所有间距都落在 4px 的倍数上，页面节奏统一、可预测，不出现 5/7/13 这种随手值。"}</p><p className="mt-3 border-t border-border pt-3"><span className="font-medium text-foreground">{lang === "en" ? "Rule" : "用法"}</span>：{lang === "en" ? "use Tailwind spacing utilities (gap/p/m/space) — never hand-write arbitrary px." : "一律用 Tailwind 间距工具类（gap / p / m / space），不手写任意 px。"}</p></DocSurfaceCard></section>
  </div>;
}

import type { ReactNode } from "react";
import { DocSurfaceCard, DocSurfaceTableCard } from "@/components/fx/doc-surface";
import { PageLead } from "@/components/fx/page-lead";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { docsSpacing } from "@/lib/docs-spacing";

export const radiusTokens = [
{ name: "--radius", value: "0.625rem（10px）", usage: "基础圆角真相源（= rounded-lg）", usageEn: "Base radius source of truth (= rounded-lg)" },
{ name: "rounded-none", value: "0", usage: "表格、紧贴边缘容器、需要直角的分割块", usageEn: "Tables, flush containers, square dividers" },
{ name: "rounded-xs", value: "calc(var(--radius) - 6px) ≈ 4px", usage: "极小元素：复选框、缩略图角、内联 code", usageEn: "Tiny elements: checkbox, thumbnail, inline code" },
{ name: "rounded-sm", value: "calc(var(--radius) - 4px) ≈ 6px", usage: "小标签、小 chip", usageEn: "Small tags and chips" },
{ name: "rounded-md", value: "calc(var(--radius) - 2px) ≈ 8px", usage: "按钮、输入框、小控件", usageEn: "Buttons, inputs, and compact controls" },
{ name: "rounded-lg", value: "var(--radius) = 10px", usage: "卡片、下拉、浮层容器", usageEn: "Cards, dropdowns, and overlay containers" },
{ name: "rounded-xl", value: "calc(var(--radius) + 4px) ≈ 14px", usage: "Dialog、Sheet、较大区域容器", usageEn: "Dialogs, Sheets, and larger surface containers" },
{ name: "rounded-full", value: "9999px", usage: "胶囊按钮、Badge、头像、开关", usageEn: "Pills, badges, avatars, and switches" }];
export type RadiusToken = { name: string; value: string; usage: string; usageEn: string };
type Props = { actions: ReactNode; lang: "zh" | "en"; radiusTokens: RadiusToken[] };

export const tokenRadiusAnchors = [
  { label: "圆角档位", labelEn: "Radius scale", href: "#tokens-radius-scale" },
  { label: "计算方式", labelEn: "How computed", href: "#tokens-radius-compute" },
]

export function TokensRadiusPage({ actions, lang, radiusTokens }: Props) {
  return <div className={docsSpacing.pageStack}>
    <section id="tokens-radius" className="flex flex-col gap-2"><PageLead crumb={lang === "en" ? "Design Tokens / Radius" : "设计令牌 / 圆角"} title={lang === "en" ? "Radius" : "圆角"} lead={lang === "en" ? "Radius tokens keep shadcn controls, cards, and overlays visually consistent." : "圆角 token 用来统一 shadcn 控件、卡片和浮层容器的视觉性格。"} actions={actions} /></section>
    <section id="tokens-radius-scale" className={`${docsSpacing.sectionStack} scroll-mt-24`}><div><h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Radius scale 圆角档位" : "圆角档位"}</h2><p className="mt-2 text-base text-muted-foreground">{lang === "en" ? "All radius steps, from square to pill — chosen by component TYPE, not size. Per-step usage is in the Usage column." : "全部圆角档位，从直角到胶囊——按组件「类型」选，不是按大小选。逐档对应组件见右侧场景列。"}</p></div><DocSurfaceTableCard><Table className="min-w-[720px]"><TableHeader><TableRow><TableHead className="pl-4">Token</TableHead><TableHead>{lang === "en" ? "Value" : "值"}</TableHead><TableHead>{lang === "en" ? "Example" : "示例"}</TableHead><TableHead className="pr-4">{lang === "en" ? "Usage" : "用法"}</TableHead></TableRow></TableHeader><TableBody>{radiusTokens.map((row) => <TableRow key={row.name}><TableCell className="pl-4 font-medium"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.name}</code></TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.value}</code></TableCell><TableCell><div className={`size-10 bg-primary/15 ring-1 ring-inset ring-primary/30 ${row.name === "--radius" ? "rounded-lg" : row.name}`} /></TableCell><TableCell className="pr-4 text-foreground">{lang === "en" ? row.usageEn : row.usage}</TableCell></TableRow>)}</TableBody></Table></DocSurfaceTableCard></section>
    <section id="tokens-radius-compute" className={`${docsSpacing.sectionStack} scroll-mt-24`}><div><h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "How it's computed 计算方式" : "计算方式"}</h2><p className="mt-2 text-base text-muted-foreground">{lang === "en" ? "Core steps derive from a single base via fixed ±2px steps (the shadcn convention); large steps use Tailwind defaults." : "核心档由唯一基准值按固定 ±2px 步进派生（shadcn 标准做法）；大容器档用 Tailwind 默认值。"}</p></div><DocSurfaceCard className="p-5 text-base text-muted-foreground"><p><span className="font-medium text-foreground">{lang === "en" ? "Base" : "基准"}</span>：<code className="rounded bg-muted px-1 text-sm">--radius = 0.625rem（10px）</code>{lang === "en" ? "，equals rounded-lg." : "，即 rounded-lg。"}</p><p className="mt-1"><span className="font-medium text-foreground">{lang === "en" ? "Core ±2px step" : "核心档 ±2px 步进"}</span>：sm = <code className="rounded bg-muted px-1 text-sm">base − 4px</code>，md = <code className="rounded bg-muted px-1 text-sm">base − 2px</code>，lg = <code className="rounded bg-muted px-1 text-sm">base</code>，xl = <code className="rounded bg-muted px-1 text-sm">base + 4px</code>{lang === "en" ? ". Changing the base shifts the whole scale together." : "。改基准值整套等量平移，差值恒定可预测。"}</p><p className="mt-1"><span className="font-medium text-foreground">{lang === "en" ? "Large steps" : "大容器档"}</span>：2xl = 16px，3xl = 24px，4xl = 32px（Tailwind 默认固定值）。</p><p className="mt-1"><span className="font-medium text-foreground">full</span>：<code className="rounded bg-muted px-1 text-sm">9999px</code>，胶囊/圆形，不参与基准派生。</p><p className="mt-3 border-t border-border pt-3 font-medium text-foreground">{lang === "en" ? "Why derive instead of hard-coded values?" : "为什么用 calc 派生，不直接写固定值？"}</p><p className="mt-1">{lang === "en" ? "A single radius knob shifts the whole scale together, keeps neighboring steps predictable, and remains theme-able." : "单一基准让整套圆角同步变化，相邻档位步进稳定，并保留主题调整能力。"}</p></DocSurfaceCard></section>
  </div>;
}

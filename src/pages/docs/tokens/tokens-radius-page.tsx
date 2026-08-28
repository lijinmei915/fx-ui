import type { ReactNode } from "react";
import { DocSurfaceCard, DocSurfaceTableCard } from "@/components/fx/doc-surface";
import { PageLead } from "@/components/fx/page-lead";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { docsSpacing } from "@/lib/docs-spacing";

export const radiusTokens = [
{ name: "rounded-none", value: "0", usage: "表格、紧贴边缘容器、需要直角的分割块", usageEn: "Tables, flush containers, square dividers" },
{ name: "rounded-xs", value: "2px", usage: "极小图形、紧凑结构", usageEn: "Tiny graphics and compact structures" },
{ name: "rounded-sm", value: "4px", usage: "小标签、嵌套内层", usageEn: "Small tags and nested surfaces" },
{ name: "rounded-md", value: "6px", usage: "24/28 控件、输入框", usageEn: "24/28px controls and inputs" },
{ name: "rounded-lg", value: "8px（Seed）", usage: "32/36 控件、常规表面", usageEn: "32/36px controls and regular surfaces" },
{ name: "rounded-xl", value: "12px", usage: "下拉、浮层、较大容器", usageEn: "Dropdowns, overlays, and larger containers" },
{ name: "rounded-2xl", value: "16px", usage: "Dialog、Sheet、页面级容器", usageEn: "Dialogs, Sheets, and page-level containers" },
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
    <section id="tokens-radius-scale" className={`${docsSpacing.sectionStack} scroll-mt-24`}><div><h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Radius scale 圆角档位" : "圆角档位"}</h2><p className="mt-2 text-base text-muted-foreground">{lang === "en" ? "All radius steps, from square to pill — chosen by component TYPE, not size. Per-step usage is in the Usage column." : "全部圆角档位，从直角到胶囊——按组件「类型」选，不是按大小选。逐档对应组件见右侧场景列。"}</p></div><DocSurfaceTableCard><Table className="min-w-[820px]"><TableHeader><TableRow><TableHead className="pl-4">Token</TableHead><TableHead>{lang === "en" ? "Value" : "值"}</TableHead><TableHead className="w-28">{lang === "en" ? "Example" : "示例"}</TableHead><TableHead className="pr-4">{lang === "en" ? "Usage" : "用法"}</TableHead></TableRow></TableHeader><TableBody>{radiusTokens.map((row) => <TableRow key={row.name}><TableCell className="pl-4 font-medium"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.name}</code></TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.value}</code></TableCell><TableCell className="w-28 py-3"><div className={`size-12 bg-primary/15 ring-1 ring-inset ring-primary/30 ${row.name}`} /></TableCell><TableCell className="pr-4 text-foreground">{lang === "en" ? row.usageEn : row.usage}</TableCell></TableRow>)}</TableBody></Table></DocSurfaceTableCard></section>
    <section id="tokens-radius-compute" className={`${docsSpacing.sectionStack} scroll-mt-24`}><div><h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "How it's generated 生成方式" : "生成方式"}</h2><p className="mt-2 text-base text-muted-foreground">{lang === "en" ? "A governed 8px Seed generates the numeric Map at build time; full remains a fixed Primitive." : "由受治理的 8px Seed 在构建时生成数值 Map；full 仍是固定 Primitive。"}</p></div><DocSurfaceCard className="p-5 text-base text-muted-foreground"><p><span className="font-medium text-foreground">Seed</span>：<code className="rounded bg-muted px-1 text-sm">--fds-g-radius-seed-base = 8px</code>。</p><p className="mt-1"><span className="font-medium text-foreground">Map</span>：0/2/4/6/8/12/16px 分别由 Seed × 0、1/4、1/2、3/4、1、3/2、2 生成；构建结果固定输出 px，不在浏览器里做乘除。</p><p className="mt-1"><span className="font-medium text-foreground">--radius</span>：<code className="rounded bg-muted px-1 text-sm">0.5rem（8px）</code>{lang === "en" ? "，maps to the generated 8px step." : "，映射到生成后的 8px 档。"}</p><p className="mt-1"><span className="font-medium text-foreground">full</span>：<code className="rounded bg-muted px-1 text-sm">9999px</code>，{lang === "en" ? "a fixed Primitive for pills and circles." : "作为胶囊和圆形使用的固定 Primitive。"}</p><p className="mt-3 border-t border-border pt-3 font-medium text-foreground">{lang === "en" ? "Selection stays semantic" : "使用仍按语义选择"}</p><p className="mt-1">{lang === "en" ? "24/28px controls use 6px, 32/36px controls use 8px, overlays use 12px, and page-level containers use 16px. Components and visuals are unchanged." : "24/28px 控件用 6px，32/36px 控件用 8px，浮层用 12px，页面级容器用 16px；组件映射和现有视觉都不变。"}</p></DocSurfaceCard></section>
  </div>;
}

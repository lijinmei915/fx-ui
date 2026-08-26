import type { ReactNode } from "react";
import { DocSurfaceCard, DocSurfaceTableCard } from "@/components/fx/doc-surface";
import { PageLead } from "@/components/fx/page-lead";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { docsSpacing } from "@/lib/docs-spacing";

export const radiusTokens = [
{ name: "--radius", value: "0.5rem（8px）", usage: "基础圆角真相源（= rounded-lg）", usageEn: "Base radius source of truth (= rounded-lg)" },
{ name: "rounded-none", value: "0", usage: "表格、紧贴边缘容器、需要直角的分割块", usageEn: "Tables, flush containers, square dividers" },
{ name: "rounded-xs", value: "2px", usage: "极小图形、紧凑结构", usageEn: "Tiny graphics and compact structures" },
{ name: "rounded-sm", value: "4px", usage: "小标签、嵌套内层", usageEn: "Small tags and nested surfaces" },
{ name: "rounded-md", value: "6px", usage: "24/28 控件、输入框", usageEn: "24/28px controls and inputs" },
{ name: "rounded-lg", value: "8px", usage: "32/36 控件、常规表面", usageEn: "32/36px controls and regular surfaces" },
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
    <section id="tokens-radius-scale" className={`${docsSpacing.sectionStack} scroll-mt-24`}><div><h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Radius scale 圆角档位" : "圆角档位"}</h2><p className="mt-2 text-base text-muted-foreground">{lang === "en" ? "All radius steps, from square to pill — chosen by component TYPE, not size. Per-step usage is in the Usage column." : "全部圆角档位，从直角到胶囊——按组件「类型」选，不是按大小选。逐档对应组件见右侧场景列。"}</p></div><DocSurfaceTableCard><Table className="min-w-[820px]"><TableHeader><TableRow><TableHead className="pl-4">Token</TableHead><TableHead>{lang === "en" ? "Value" : "值"}</TableHead><TableHead className="w-28">{lang === "en" ? "Example" : "示例"}</TableHead><TableHead className="pr-4">{lang === "en" ? "Usage" : "用法"}</TableHead></TableRow></TableHeader><TableBody>{radiusTokens.map((row) => <TableRow key={row.name}><TableCell className="pl-4 font-medium"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.name}</code></TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.value}</code></TableCell><TableCell className="w-28 py-3"><div className={`size-12 bg-primary/15 ring-1 ring-inset ring-primary/30 ${row.name === "--radius" ? "rounded-lg" : row.name}`} /></TableCell><TableCell className="pr-4 text-foreground">{lang === "en" ? row.usageEn : row.usage}</TableCell></TableRow>)}</TableBody></Table></DocSurfaceTableCard></section>
    <section id="tokens-radius-compute" className={`${docsSpacing.sectionStack} scroll-mt-24`}><div><h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "How it's chosen 选择方式" : "选择方式"}</h2><p className="mt-2 text-base text-muted-foreground">{lang === "en" ? "The scale uses fixed 2/4/6/8/12/16px steps plus full; choose by component role, with a size mapping for buttons." : "圆角采用 2/4/6/8/12/16px 固定档位加 full，按组件角色选择，按钮再按尺寸映射。"}</p></div><DocSurfaceCard className="p-5 text-base text-muted-foreground"><p><span className="font-medium text-foreground">{lang === "en" ? "Base" : "基准"}</span>：<code className="rounded bg-muted px-1 text-sm">--radius = 0.5rem（8px）</code>{lang === "en" ? "，equals rounded-lg." : "，即 rounded-lg。"}</p><p className="mt-1"><span className="font-medium text-foreground">{lang === "en" ? "Button mapping" : "按钮映射"}</span>：24/28px → <code className="rounded bg-muted px-1 text-sm">6px</code>，32/36px → <code className="rounded bg-muted px-1 text-sm">8px</code>。</p><p className="mt-1"><span className="font-medium text-foreground">{lang === "en" ? "Container mapping" : "容器映射"}</span>：下拉、浮层用 12px，Dialog、Sheet 和页面级容器用 16px。</p><p className="mt-1"><span className="font-medium text-foreground">full</span>：<code className="rounded bg-muted px-1 text-sm">9999px</code>，胶囊/圆形。</p><p className="mt-3 border-t border-border pt-3 font-medium text-foreground">{lang === "en" ? "Why fixed steps?" : "为什么采用固定档位？"}</p><p className="mt-1">{lang === "en" ? "Fixed values are easy to remember, audit, and keep consistent across components; semantic aliases prevent page-level ad hoc values." : "固定值更容易记忆、验收和跨组件保持一致；语义别名可以阻止页面临时造值。"}</p></DocSurfaceCard></section>
  </div>;
}

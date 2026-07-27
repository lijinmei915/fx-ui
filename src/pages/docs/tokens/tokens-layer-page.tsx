import type { ReactNode } from "react";
import { DocSurfaceCard, DocSurfaceTableCard } from "@/components/fx/doc-surface";
import { PageLead } from "@/components/fx/page-lead";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { docsSpacing } from "@/lib/docs-spacing";

export const layerTokens = [
{ name: "z-10", usage: "局部控件内部层级，例如 Avatar 状态点、Calendar 范围态", usageEn: "Local component layering, such as Avatar status dots or Calendar range states" },
{ name: "z-20", usage: "Sidebar 拖拽手柄等局部交互热区", usageEn: "Local interaction hit areas such as the Sidebar rail" },
{ name: "z-40", usage: "固定 Header、文档顶部导航", usageEn: "Fixed headers and document top navigation" },
{ name: "z-50", usage: "Dialog、Dropdown、Popover、Sheet、Tooltip 等浮层", usageEn: "Overlays such as Dialog, Dropdown, Popover, Sheet, and Tooltip" }];
export type LayerToken = { name: string; usage: string; usageEn: string };
type Props = { actions: ReactNode; lang: "zh" | "en"; layerTokens: LayerToken[] };

export const tokenLayerAnchors = [
  { label: "层级档位", labelEn: "Layer levels", href: "#tokens-layer-scale" },
  { label: "分层逻辑", labelEn: "Layering logic", href: "#tokens-layer-logic" },
]

export function TokensLayerPage({ actions, lang, layerTokens }: Props) {
  return <div className={docsSpacing.pageStack}>
    <section id="tokens-layer" className="flex flex-col gap-2"><PageLead crumb={lang === "en" ? "Design Tokens / Layer" : "设计令牌 / 层级"} title={lang === "en" ? "Layer" : "层级"} lead={lang === "en" ? "Layer rules document the z-index scale already used by shadcn overlays. Avoid inventing new z-index values unless a real collision appears." : "层级规则记录 shadcn 浮层已经在用的 z-index 习惯。除非真的出现遮挡冲突，不要临时发明新的 z-index。"} actions={actions} /></section>
    <section id="tokens-layer-scale" className={`${docsSpacing.sectionStack} scroll-mt-24`}><div><h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Layer levels 层级档位" : "层级档位"}</h2><p className="mt-2 text-base text-muted-foreground">{lang === "en" ? "A few fixed z-index tiers — the bigger the number, the closer to the user. Pick by what the element is, not by guessing a number." : "几个固定的层级档位，数字越大越靠近用户。按元素用途选档，别凭感觉写数字。"}</p></div><DocSurfaceCard className="p-5"><p className="mb-3 text-sm text-muted-foreground">{lang === "en" ? "Higher value stacks on top (closer to you)." : "数字越大，越压在上面（越靠近你）。"}</p><div className="relative h-32">{layerTokens.map((row, i) => <div key={row.name} className="absolute flex h-12 w-48 items-center rounded-lg border border-border bg-card px-3 text-sm font-medium shadow-l1" style={{ top: `${i * 18}px`, left: `${i * 48}px`, zIndex: 10 + i * 10 }}>{row.name}</div>)}</div></DocSurfaceCard><DocSurfaceTableCard><Table className="min-w-[720px]"><TableHeader><TableRow><TableHead className="pl-4">Token</TableHead><TableHead className="pr-4">{lang === "en" ? "Usage" : "用法"}</TableHead></TableRow></TableHeader><TableBody>{layerTokens.map((row) => <TableRow key={row.name} className="hover:bg-transparent"><TableCell className="pl-4 font-medium"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.name}</code></TableCell><TableCell className="pr-4 text-foreground">{lang === "en" ? row.usageEn : row.usage}</TableCell></TableRow>)}</TableBody></Table></DocSurfaceTableCard></section>
    <section id="tokens-layer-logic" className={`${docsSpacing.sectionStack} scroll-mt-24`}><div><h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Layering logic 分层逻辑" : "分层逻辑"}</h2><p className="mt-2 text-base text-muted-foreground">{lang === "en" ? "Why a few fixed tiers instead of arbitrary numbers." : "为什么用几个固定档位，而不是随手写数字。"}</p></div><DocSurfaceCard className="p-5 text-base leading-relaxed text-muted-foreground"><p><span className="font-medium text-foreground">{lang === "en" ? "From low to high" : "从低到高"}</span>：{lang === "en" ? "page content → local controls → fixed/stuck headers → overlays. The bigger the number, the closer to you (on top)." : "页面内容 → 局部控件 → 固定/吸顶的头部 → 弹层。数字越大，离你越近、压在越上面。"}</p><p className="mt-2"><span className="font-medium text-foreground">{lang === "en" ? "Overlays all use the top tier" : "弹层都用最高一档"}</span>：{lang === "en" ? "dialogs, dropdowns, popovers, sheets and tooltips all sit at the top tier; which one shows on top depends on who opens later, not on a bigger number." : "对话框、下拉、气泡、抽屉、提示框都用最高一档（z-50）；谁后打开谁在上，不靠更大的数字。"}</p><p className="mt-3 border-t border-border pt-3"><span className="font-medium text-foreground">{lang === "en" ? "Rule" : "怎么用"}</span>：{lang === "en" ? "stick to these few tiers; if something gets covered, fit it into an existing tier — don't invent a bigger number." : "只用这几档；万一被挡住，把它归到现有的某一档，别去编一个更大的数字。"}</p></DocSurfaceCard></section>
  </div>;
}

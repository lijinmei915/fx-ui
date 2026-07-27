import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { DocSurfaceCard, DocSurfaceTableCard } from "@/components/fx/doc-surface";
import { PageLead } from "@/components/fx/page-lead";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { docsSpacing } from "@/lib/docs-spacing";

export const motionTokens = [
{ name: "duration-100", usage: "Dialog、Dropdown、Popover、Tooltip 的进入退出", usageEn: "Enter and exit transitions for Dialog, Dropdown, Popover, and Tooltip" },
{ name: "duration-150", usage: "Sheet 遮罩淡入淡出", usageEn: "Sheet overlay fade transitions" },
{ name: "duration-200", usage: "Sidebar、Sheet 内容位移和宽度变化", usageEn: "Sidebar and Sheet content movement or width transitions" },
{ name: "animate-in / animate-out", usage: "基于 data-open / data-closed 的浮层显隐", usageEn: "Overlay visibility driven by data-open and data-closed states" },
{ name: "fade / zoom / slide", usage: "浮层常用组合，不为单页临时发明动画", usageEn: "Common overlay motion primitives; avoid one-off page animations" }];
export type MotionToken = { name: string; usage: string; usageEn: string };
type Props = { actions: ReactNode; lang: "zh" | "en"; motionTokens: MotionToken[] };

export const tokenMotionAnchors = [
  { label: "时长档位", labelEn: "Duration scale", href: "#tokens-motion-duration" },
  { label: "原语与规则", labelEn: "Primitives & rules", href: "#tokens-motion-primitives" },
]

export function TokensMotionPage({ actions, lang, motionTokens }: Props) {
  const [replayKey, setReplayKey] = useState(0);
  const durationRows = motionTokens.filter((row) => row.name.startsWith("duration-"));
  const primitiveRows = motionTokens.filter((row) => !row.name.startsWith("duration-"));
  return <div className={docsSpacing.pageStack}>
    <section id="tokens-motion" className="flex flex-col gap-2"><PageLead crumb={lang === "en" ? "Design Tokens / Motion" : "设计令牌 / 动效"} title={lang === "en" ? "Motion" : "动效"} lead={lang === "en" ? "Motion follows the shadcn components already in the project: tw-animate-css utilities, short durations, and data-state driven enter/exit transitions." : "动效沿用项目里 shadcn 组件已经在使用的模式：tw-animate-css 工具类、短时长、以及由 data-state 驱动的进入退出。"} actions={actions} /></section>
    <section id="tokens-motion-duration" className={`${docsSpacing.sectionStack} scroll-mt-24`}><div><h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Duration scale 时长档位" : "时长档位"}</h2><p className="mt-2 text-base text-muted-foreground">{lang === "en" ? "Short, tiered durations — small overlays snap fast, larger movement eases a bit longer. Click to replay." : "短促、分档：小浮层快、位移大的稍慢。点按钮可重播示例。"}</p></div><DocSurfaceTableCard><Table className="min-w-[720px]"><TableHeader><TableRow><TableHead className="pl-4">Token</TableHead><TableHead><span className="inline-flex items-center gap-2">{lang === "en" ? "Example" : "示例"}<Button size="xs" variant="outline" onClick={() => setReplayKey((key) => key + 1)}>{lang === "en" ? "Play" : "播放"}</Button></span></TableHead><TableHead className="pr-4">{lang === "en" ? "Usage" : "用法"}</TableHead></TableRow></TableHeader><TableBody>{durationRows.map((row) => <TableRow key={row.name} className="hover:bg-transparent"><TableCell className="pl-4 font-medium"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.name}</code></TableCell><TableCell><div className="w-40 overflow-hidden rounded bg-muted/40 p-1"><div key={replayKey} className={`h-6 w-16 rounded bg-primary/70 ${row.name} animate-in fade-in-0 slide-in-from-left-24 ease-out`} /></div></TableCell><TableCell className="pr-4 text-foreground">{lang === "en" ? row.usageEn : row.usage}</TableCell></TableRow>)}</TableBody></Table></DocSurfaceTableCard></section>
    <section id="tokens-motion-primitives" className={`${docsSpacing.sectionStack} scroll-mt-24`}><div><h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Primitives & rules 原语与规则" : "原语与规则"}</h2><p className="mt-2 text-base text-muted-foreground">{lang === "en" ? "Composed from a few primitives, driven by state — not hand-written keyframes." : "由几个原语组合、靠状态驱动，不手写关键帧。"}</p></div><DocSurfaceTableCard><Table className="min-w-[720px]"><TableHeader><TableRow><TableHead className="pl-4">Token / Utility</TableHead><TableHead className="pr-4">{lang === "en" ? "Usage" : "用法"}</TableHead></TableRow></TableHeader><TableBody>{primitiveRows.map((row) => <TableRow key={row.name} className="hover:bg-transparent"><TableCell className="pl-4 font-medium"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.name}</code></TableCell><TableCell className="pr-4 text-foreground">{lang === "en" ? row.usageEn : row.usage}</TableCell></TableRow>)}</TableBody></Table></DocSurfaceTableCard><DocSurfaceCard className="p-5 text-base text-muted-foreground"><p><span className="font-medium text-foreground">{lang === "en" ? "Short" : "短促"}</span>：{lang === "en" ? "100–200ms; UI motion is feedback, not spectacle." : "100–200ms 区间；界面动效是反馈，不是表演。"}</p><p className="mt-1"><span className="font-medium text-foreground">{lang === "en" ? "State driven" : "状态驱动"}</span>：{lang === "en" ? "enter/exit triggered by data-open / data-closed / data-state, not manual timers." : "进入/退出由 data-open / data-closed / data-state 触发，不手动计时。"}</p><p className="mt-3 border-t border-border pt-3"><span className="font-medium text-foreground">{lang === "en" ? "Rule" : "用法"}</span>：{lang === "en" ? "compose fade / zoom / slide via tw-animate-css utilities; don't invent one-off keyframes per page." : "用 tw-animate-css 工具类组合 fade / zoom / slide，不为单页临时写关键帧动画。"}</p></DocSurfaceCard></section>
  </div>;
}

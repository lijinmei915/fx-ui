import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { DocSurfaceCard, DocSurfaceTableCard } from "@/components/fx/doc-surface";
import { PageLead } from "@/components/fx/page-lead";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { docsSpacing } from "@/lib/docs-spacing";

export const motionTokens = [
{ name: "--fds-g-motion-duration-0", value: "0ms", className: "duration-0", usage: "关闭动效", usageEn: "Disable motion" },
{ name: "--fds-g-motion-duration-75", value: "75ms", className: "duration-75", usage: "即时反馈的最短档", usageEn: "Shortest instant-feedback step" },
{ name: "--fds-g-motion-duration-100", value: "100ms", className: "duration-100", usage: "小范围状态切换", usageEn: "Small state changes" },
{ name: "--fds-g-motion-duration-150", value: "150ms", className: "duration-150", usage: "常规淡入淡出", usageEn: "Regular fades" },
{ name: "--fds-g-motion-duration-200", value: "200ms", className: "duration-200", usage: "常规位移和尺寸变化", usageEn: "Regular movement and resizing" },
{ name: "--fds-g-motion-duration-300", value: "300ms", className: "duration-300", usage: "较大范围过渡", usageEn: "Larger transitions" },
{ name: "--fds-g-motion-duration-500", value: "500ms", className: "duration-500", usage: "慢速演示或复杂过渡上限", usageEn: "Upper bound for slow demos or complex transitions" },
{ name: "--fds-g-motion-duration-700", value: "700ms", className: "duration-700", usage: "数据可视化等低频长过渡", usageEn: "Infrequent long transitions such as data visualization" },
{ name: "--fds-g-motion-duration-1000", value: "1000ms", className: "duration-1000", usage: "基础刻度上限，不用于常规控件", usageEn: "Scale ceiling; not for regular controls" },
{ name: "--fds-g-motion-easing-linear", value: "linear", usage: "恒定速度", usageEn: "Constant speed" },
{ name: "--fds-g-motion-easing-in", value: "cubic-bezier(0.4, 0, 1, 1)", usage: "数学加速曲线", usageEn: "Mathematical acceleration curve" },
{ name: "--fds-g-motion-easing-out", value: "cubic-bezier(0, 0, 0.2, 1)", usage: "数学减速曲线", usageEn: "Mathematical deceleration curve" },
{ name: "--fds-g-motion-easing-in-out", value: "cubic-bezier(0.4, 0, 0.2, 1)", usage: "数学加减速曲线", usageEn: "Mathematical acceleration/deceleration curve" }];
export type MotionToken = { name: string; value: string; className?: string; usage: string; usageEn: string };
type Props = { actions: ReactNode; lang: "zh" | "en"; motionTokens: MotionToken[] };

export const tokenMotionAnchors = [
  { label: "时长档位", labelEn: "Duration scale", href: "#tokens-motion-duration" },
  { label: "原语与规则", labelEn: "Primitives & rules", href: "#tokens-motion-primitives" },
]

export function TokensMotionPage({ actions, lang, motionTokens }: Props) {
  const [replayKey, setReplayKey] = useState(0);
  const durationRows = motionTokens.filter((row) => row.name.startsWith("--fds-g-motion-duration-"));
  const primitiveRows = motionTokens.filter((row) => !row.name.startsWith("--fds-g-motion-duration-"));
  return <div className={docsSpacing.pageStack}>
    <section id="tokens-motion" className="flex flex-col gap-2"><PageLead crumb={lang === "en" ? "Design Tokens / Motion" : "设计令牌 / 动效"} title={lang === "en" ? "Motion" : "动效"} lead={lang === "en" ? "Motion follows the shadcn components already in the project: tw-animate-css utilities, short durations, and data-state driven enter/exit transitions." : "动效沿用项目里 shadcn 组件已经在使用的模式：tw-animate-css 工具类、短时长、以及由 data-state 驱动的进入退出。"} actions={actions} /></section>
    <section id="tokens-motion-duration" className={`${docsSpacing.sectionStack} scroll-mt-24`}><div><h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Duration scale 时长档位" : "时长档位"}</h2><p className="mt-2 text-base text-muted-foreground">{lang === "en" ? "A complete numeric scale; component contracts decide which steps they consume. Click to replay." : "完整数值刻度；具体组件使用哪一档由组件契约决定。点按钮可重播示例。"}</p></div><DocSurfaceTableCard><Table className="min-w-[760px]"><TableHeader><TableRow><TableHead className="pl-4">Token</TableHead><TableHead>{lang === "en" ? "Value" : "值"}</TableHead><TableHead><span className="inline-flex items-center gap-2">{lang === "en" ? "Example" : "示例"}<Button size="xs" variant="outline" onClick={() => setReplayKey((key) => key + 1)}>{lang === "en" ? "Play" : "播放"}</Button></span></TableHead><TableHead className="pr-4">{lang === "en" ? "Usage" : "用法"}</TableHead></TableRow></TableHeader><TableBody>{durationRows.map((row) => <TableRow key={row.name} className="hover:bg-transparent"><TableCell className="pl-4 font-medium"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.name}</code></TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.value}</code></TableCell><TableCell><div className="w-40 overflow-hidden rounded bg-muted/40 p-1"><div key={replayKey} className={`h-6 w-16 rounded bg-primary/70 ${row.className ?? ""} animate-in fade-in-0 slide-in-from-left-24 ease-out`} /></div></TableCell><TableCell className="pr-4 text-foreground">{lang === "en" ? row.usageEn : row.usage}</TableCell></TableRow>)}</TableBody></Table></DocSurfaceTableCard></section>
    <section id="tokens-motion-primitives" className={`${docsSpacing.sectionStack} scroll-mt-24`}><div><h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Easing scale 缓动档位" : "缓动档位"}</h2><p className="mt-2 text-base text-muted-foreground">{lang === "en" ? "Mathematical curves only; entrance, exit, and component intent belong to higher-level contracts." : "这里只记录数学曲线；进入、退出和组件意图属于上层契约。"}</p></div><DocSurfaceTableCard><Table className="min-w-[720px]"><TableHeader><TableRow><TableHead className="pl-4">Token</TableHead><TableHead>{lang === "en" ? "Value" : "值"}</TableHead><TableHead className="pr-4">{lang === "en" ? "Description" : "说明"}</TableHead></TableRow></TableHeader><TableBody>{primitiveRows.map((row) => <TableRow key={row.name} className="hover:bg-transparent"><TableCell className="pl-4 font-medium"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.name}</code></TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.value}</code></TableCell><TableCell className="pr-4 text-foreground">{lang === "en" ? row.usageEn : row.usage}</TableCell></TableRow>)}</TableBody></Table></DocSurfaceTableCard><DocSurfaceCard className="p-5 text-base text-muted-foreground"><p><span className="font-medium text-foreground">{lang === "en" ? "Governance" : "治理"}</span>：{lang === "en" ? "agents and collaborators may read these primitives but cannot add or change values; runtimes map them through reviewed contracts." : "AI 和协作者可以读取但不能新增或改值；运行时通过经过评审的契约完成映射。"}</p></DocSurfaceCard></section>
  </div>;
}

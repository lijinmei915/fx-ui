import type { ReactNode } from "react";
import { DocSurfaceCard, DocSurfaceTableCard } from "@/components/fx/doc-surface";
import { PageLead } from "@/components/fx/page-lead";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { docsSpacing } from "@/lib/docs-spacing";

export const shadowTokens = [
{ name: "shadow-l1", value: "0 2px 6px -2px, 0 4px 10px -4px", usage: "浮层菜单、Dropdown — 最近层", usageEn: "Dropdown menus and nearest-layer overlays" },
{ name: "shadow-l2", value: "0 4px 12px -4px, 0 8px 20px -2px, 0 12px 28px 0", usage: "Sheet、侧边滑出面板 — 中层", usageEn: "Sheet panels and mid-layer surfaces" },
{ name: "shadow-l3", value: "0 6px 16px -8px, 0 9px 28px 0, 0 12px 48px 16px", usage: "Dialog、Modal — 最高层遮罩", usageEn: "Dialogs and top-layer modal surfaces" },
{ name: "shadow-l1-up", value: "0 -2px 6px -2px, 0 -4px 10px -4px", usage: "向上弹出的浮层（如底部工具栏菜单）", usageEn: "Upward overlays such as bottom toolbar menus" }];
export type ShadowToken = {
  name: string;
  value: string;
  usage: string;
  usageEn: string;
};

type Props = { actions: ReactNode; lang: "zh" | "en"; shadowTokens: ShadowToken[] };

export const tokenShadowAnchors = [
  { label: "阴影档位", labelEn: "Elevation levels", href: "#tokens-shadow-scale" },
  { label: "计算方式", labelEn: "How computed", href: "#tokens-shadow-compute" },
]

export function TokensShadowPage({ actions, lang, shadowTokens }: Props) {
  return (
    <div className={docsSpacing.pageStack}>
      <section id="tokens-shadow" className="flex flex-col gap-2">
        <PageLead
          crumb={lang === "en" ? "Design Tokens / Shadow" : "设计令牌 / 阴影"}
          title={lang === "en" ? "Shadow" : "阴影"}
          lead={lang === "en" ? "Shadow tokens come from Figma's Layer Style spec — four levels cover every overlay. Only use shadow-l1/l2/l3/l1-up; avoid Tailwind's built-in shadow-sm/md/lg (a separate set of values that won't follow our shadow variables)." : "阴影 token 来自 Figma「图层样式」，四档覆盖所有浮层场景。只用 shadow-l1/l2/l3/l1-up，别用 Tailwind 自带的 shadow-sm/md/lg（那是另一套数值，不跟随公司变量）。"}
          actions={actions}
        />
      </section>

      <section id="tokens-shadow-scale" className={`${docsSpacing.sectionStack} scroll-mt-24`}>
        <div>
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Elevation levels 阴影档位" : "阴影档位"}</h2>
          <p className="mt-2 text-base text-muted-foreground">{lang === "en" ? "Shadow encodes how high an element floats above the page — higher = lower & more diffuse. Pick by overlay layer; per-level usage is in the Usage column." : "阴影表达元素「离页面多高」——越高、投影越往下、越散。按浮层层级选档，逐档对应组件见右侧场景列。"}</p>
        </div>
        <DocSurfaceTableCard>
          <Table className="min-w-[720px]">
            <TableHeader><TableRow><TableHead className="pl-4">Token</TableHead><TableHead>{lang === "en" ? "Value" : "值"}</TableHead><TableHead>{lang === "en" ? "Example" : "示例"}</TableHead><TableHead className="pr-4">{lang === "en" ? "Usage" : "用法"}</TableHead></TableRow></TableHeader>
            <TableBody>
              {shadowTokens.map((row) => <TableRow key={row.name} className="hover:bg-transparent">
                <TableCell className="pl-4 font-medium align-middle"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.name}</code></TableCell>
                <TableCell className="align-middle"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.value}</code></TableCell>
                <TableCell className="align-middle"><div className="py-8"><div className={`h-10 w-24 rounded-lg bg-card ${row.name}`} /></div></TableCell>
                <TableCell className="pr-4 align-middle text-foreground">{lang === "en" ? row.usageEn : row.usage}</TableCell>
              </TableRow>)}
            </TableBody>
          </Table>
        </DocSurfaceTableCard>
      </section>

      <section id="tokens-shadow-compute" className={`${docsSpacing.sectionStack} scroll-mt-24`}>
        <div>
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "How it's computed 计算方式" : "计算方式"}</h2>
          <p className="mt-2 text-base text-muted-foreground">{lang === "en" ? "Each elevation token combines two or three shadows: a defined near edge plus softer, wider falloff." : "每个 elevation token 由两到三层阴影组成：近层保留落点，远层负责更柔、更宽的扩散。"}</p>
        </div>
        <DocSurfaceCard className="p-5 text-base text-muted-foreground">
          <p><span className="font-medium text-foreground">{lang === "en" ? "Color knobs" : "颜色总开关"}</span>：<code className="rounded bg-muted px-1 text-sm">--fx-shadow-color / soft / faint = 8% / 5% / 3%</code>{lang === "en" ? "，all derived from the darkest brand-tinted neutral rather than hard-coded black." : "，均从最深中性灰（带品牌色相）派生，不写死纯黑。"}</p>
          <p className="mt-1"><span className="font-medium text-foreground">{lang === "en" ? "Y-offset" : "y 偏移"}</span>：{lang === "en" ? "near to far, L1 is 2 / 4px; L2 is 4 / 8 / 12px; L3 is 6 / 9 / 12px." : "从近到远，L1 为 2 / 4px；L2 为 4 / 8 / 12px；L3 为 6 / 9 / 12px。"}</p>
          <p className="mt-1"><span className="font-medium text-foreground">Blur</span>：{lang === "en" ? "L1 6 / 10px; L2 12 / 20 / 28px; L3 16 / 28 / 48px. Higher layers stay more diffuse." : "L1 为 6 / 10px；L2 为 12 / 20 / 28px；L3 为 16 / 28 / 48px。层级越高，扩散越明显。"}</p>
          <p className="mt-1"><span className="font-medium text-foreground">Spread</span>：{lang === "en" ? "near layers use negative spread to keep edges clean; L3's outer layer expands to 16px so its falloff remains visible." : "近层用负 spread 收住边缘；L3 最外层扩至 16px，让高层浮起后的扩散仍可见。"}</p>
          <p className="mt-1"><span className="font-medium text-foreground">{lang === "en" ? "Direction variant" : "方向变体"}</span>：{lang === "en" ? "shadow-l1-up = L1 with negative y, for overlays that pop upward (bottom toolbar menus)." : "shadow-l1-up = L1 的 y 取负，用于从下往上弹的浮层（底部工具栏菜单）。"}</p>
          <p className="mt-3 border-t border-border pt-3"><span className="font-medium text-foreground">{lang === "en" ? "Why this way" : "为什么这样做"}</span>：{lang === "en" ? "one elevation token owns its layered shadow; consumers never stack L1/L2/L3. This keeps overlays light, readable, and predictable. Built-in Tailwind shadow-sm/md/lg remain banned because they are not mapped to company tokens." : "一个 elevation token 自己拥有多层投影；调用方不叠加 L1/L2/L3。这样既保留层次，也不会发脏或失控。Tailwind 内置 shadow-sm/md/lg 仍禁用，因为它们不跟随公司 Token。"}</p>
        </DocSurfaceCard>
      </section>
    </div>
  );
}

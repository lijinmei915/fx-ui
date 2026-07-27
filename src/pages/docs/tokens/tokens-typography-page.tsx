import type { ReactNode } from "react";
import { DocSurfaceCard, DocSurfaceTableCard } from "@/components/fx/doc-surface";
import { PageLead } from "@/components/fx/page-lead";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { docsSpacing } from "@/lib/docs-spacing";

export const typeFamilyTokens = [
{ name: "--font-sans", value: "Inter Variable → Noto Sans SC → 系统兜底", cls: "", usage: "自托管开源字体（OFL）：西文 Inter，中文 Noto Sans SC（思源黑体简体），跨平台一致", usageEn: "Self-hosted OFL fonts: Inter for Latin, Noto Sans SC for CJK" }];
export const typeWeightTokens = [
{ name: "font-normal", value: "400", cls: "font-normal", usage: "Regular 常规 — 正文默认", usageEn: "Regular — default body" },
{ name: "font-medium", value: "500", cls: "font-medium", usage: "Medium 中等 — 标签、按钮、菜单、轻强调", usageEn: "Medium — labels, buttons, menus" },
{ name: "font-semibold", value: "600", cls: "font-semibold", usage: "Semibold 次强调 — 小标题、卡片标题", usageEn: "Semibold — section and card titles" },
{ name: "font-bold", value: "700", cls: "font-bold", usage: "Bold 加粗 — 标题、强调", usageEn: "Bold — headings, emphasis" }];
export const typeSizeTokens = [
{ name: "text-xl", value: "20px / 30px", cls: "text-xl", usage: "详情页标题（配 bold）", usageEn: "Detail page title (with bold)" },
{ name: "text-lg", value: "18px / 28px", cls: "text-lg", usage: "模块/卡片/组件标题（regular 或 bold 区分）", usageEn: "Module / card / component title" },
{ name: "text-base", value: "16px / 24px", cls: "text-base", usage: "默认正文 — 菜单、列表、表单、大面积文案", usageEn: "Default body — menus, lists, forms" },
{ name: "text-sm", value: "14px / 20px", cls: "text-sm", usage: "字段标签、按钮、菜单项、辅助信息", usageEn: "Labels, buttons, menus, helper text" },
{ name: "text-xs", value: "12px / 18px", cls: "text-xs", usage: "最小辅助信息、紧凑场景", usageEn: "Small helper text and compact contexts" }];
export type TypographyRole = { id: string; tailwind: string[]; utility: string; usage: string };
export type TypographyConvention = { id: string; rule: string; tailwind?: string[]; prohibited?: string[]; examples?: string[]; usage: string };
export type TypographyTokenRow = { name: string; value: string; cls: string; usage: string; usageEn: string };

type Props = {
  actions: ReactNode;
  lang: "zh" | "en";
  roles: TypographyRole[];
  conventions: TypographyConvention[];
  sizeTokens: TypographyTokenRow[];
  weightTokens: TypographyTokenRow[];
  familyTokens: TypographyTokenRow[];
};

export const tokenTypographyAnchors = [
  { label: "文本角色", labelEn: "Text Roles", href: "#tokens-typography-roles" },
  { label: "字号", labelEn: "Size", href: "#tokens-typography-size" },
  { label: "字重", labelEn: "Weight", href: "#tokens-typography-weight" },
  { label: "字体", labelEn: "Family", href: "#tokens-typography-family" },
]

export function TokensTypographyPage({ actions, lang, roles, conventions, sizeTokens, weightTokens, familyTokens }: Props) {
  const groups = [
    { id: "tokens-typography-size", title: lang === "en" ? "Size 字号" : "字号", desc: lang === "en" ? "Text size by hierarchy (H1–H6 / body / small). Value = font-size / line-height." : "决定不同层级文本的大小（H1–H6 / 正文 / 小字）。值 = 字号 / 行高。", rows: sizeTokens },
    { id: "tokens-typography-weight", title: lang === "en" ? "Weight 字重" : "字重", desc: lang === "en" ? "Text thickness." : "决定不同层级文本的粗细。", rows: weightTokens },
    { id: "tokens-typography-family", title: lang === "en" ? "Family 字体" : "字体", desc: lang === "en" ? "Global font family." : "全局字族。", rows: familyTokens },
  ];
  return (
    <div className={docsSpacing.pageStack}>
      <section id="tokens-typography" className="flex flex-col gap-2"><PageLead crumb={lang === "en" ? "Design Tokens / Typography" : "设计令牌 / 排版"} title={lang === "en" ? "Typography" : "排版"} lead={lang === "en" ? "Typography defines text roles first, then size, weight, and family." : "排版先定义文本角色，再看字号、字重与字体。"} actions={actions} /></section>
      <section id="tokens-typography-roles" className={`${docsSpacing.sectionStack} scroll-mt-24`}>
        <div><h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Text roles 文本角色" : "文本角色"}</h2><p className="mt-1 text-sm text-muted-foreground">{lang === "en" ? "Choose by purpose first. Call the role utility; its size and weight remain traceable base tokens." : "先按用途选择角色；调用角色工具类，字号和字重仍可追溯到基础 Token。"}</p></div>
        <DocSurfaceTableCard><Table className="min-w-[920px]"><TableHeader><TableRow><TableHead className="pl-4">{lang === "en" ? "Role" : "角色"}</TableHead><TableHead>{lang === "en" ? "Size" : "字号 Token"}</TableHead><TableHead>{lang === "en" ? "Weight" : "字重 Token"}</TableHead><TableHead>{lang === "en" ? "Call" : "调用"}</TableHead><TableHead>{lang === "en" ? "Example" : "示例"}</TableHead><TableHead className="pr-4">{lang === "en" ? "Usage" : "用法"}</TableHead></TableRow></TableHeader><TableBody>{roles.map((role) => <TableRow key={role.id}><TableCell className="pl-4 font-medium"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{role.id}</code></TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{role.tailwind[0]}</code></TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{role.tailwind[1]}</code></TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{role.utility}</code></TableCell><TableCell><span className={`leading-none text-foreground ${role.utility}`}>示例文字 Aa</span></TableCell><TableCell className="pr-4 text-foreground">{role.usage}</TableCell></TableRow>)}</TableBody></Table></DocSurfaceTableCard>
      </section>
      {groups.map((group) => <section key={group.id} id={group.id} className={`${docsSpacing.sectionStack} scroll-mt-24`}><div><h2 className="text-xl font-bold tracking-tight">{group.title}</h2><p className="mt-1 text-sm text-muted-foreground">{group.desc}</p></div><DocSurfaceTableCard><Table className="min-w-[680px]"><TableHeader><TableRow><TableHead className="pl-4">Token</TableHead><TableHead>{lang === "en" ? "Value" : "值"}</TableHead><TableHead>{lang === "en" ? "Example" : "示例"}</TableHead><TableHead className="pr-4">{lang === "en" ? "Usage" : "用法"}</TableHead></TableRow></TableHeader><TableBody>{group.rows.map((row) => <TableRow key={row.name}><TableCell className="pl-4 font-medium"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.name}</code></TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.value}</code></TableCell><TableCell><span className={`leading-none text-foreground ${row.cls}`}>示例文字 Aa</span></TableCell><TableCell className="pr-4 text-foreground">{lang === "en" ? row.usageEn : row.usage}</TableCell></TableRow>)}</TableBody></Table></DocSurfaceTableCard></section>)}
      <section id="tokens-typography-conventions" className={`${docsSpacing.sectionStack} scroll-mt-24`}><div><h2 className="text-xl font-bold">{lang === "en" ? "Text conventions" : "混排、代码与编号"}</h2><p className="mt-1 text-sm text-muted-foreground">{lang === "en" ? "Use these conventions for new or adjusted user-facing text. The source is the typography token manifest." : "新增或调整面向用户的文本时遵循这些约定；内容直接来自排版 Token manifest。"}</p></div><DocSurfaceTableCard><Table className="min-w-[680px]"><TableHeader><TableRow><TableHead className="pl-4">{lang === "en" ? "Rule" : "规则"}</TableHead><TableHead>{lang === "en" ? "Convention" : "约定"}</TableHead><TableHead className="pr-4">{lang === "en" ? "Use" : "使用场景"}</TableHead></TableRow></TableHeader><TableBody>{conventions.map((convention) => <TableRow key={convention.id}><TableCell className="pl-4 font-medium"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{convention.id}</code></TableCell><TableCell className="text-foreground"><p>{convention.rule}</p>{convention.tailwind?.length ? <p className="mt-1 font-mono text-xs text-muted-foreground">{convention.tailwind.join(" ")}</p> : null}{convention.prohibited?.length ? <p className="mt-1 font-mono text-xs text-muted-foreground">{convention.prohibited.join(" · ")}</p> : null}{convention.examples?.length ? <p className="mt-1 font-mono text-xs text-muted-foreground">{convention.examples.join(" · ")}</p> : null}</TableCell><TableCell className="pr-4 text-muted-foreground">{convention.usage}</TableCell></TableRow>)}</TableBody></Table></DocSurfaceTableCard></section>
      <section className={docsSpacing.sectionStack}><DocSurfaceCard className="bg-muted/40 p-5 text-sm text-muted-foreground"><p className="font-medium text-foreground">{lang === "en" ? "Font family" : "字族说明"}</p><p className="mt-1">{lang === "en" ? "Self-hosted open-source fonts (OFL, no licensing worry): Inter for Latin/digits, Noto Sans SC (= Source Han Sans Simplified) for CJK — consistent across platforms. Inter has no CJK, so Chinese falls to Noto Sans SC; system fonts only as last resort. Defined once at " : "自托管开源字体（OFL，无版权困扰）：西文/数字用 Inter，中文用 Noto Sans SC（即思源黑体简体），跨平台一致。Inter 不含中文，中文自动落到 Noto Sans SC；系统字体只作最后兜底。一处定义在 "}<code className="rounded bg-muted px-1.5 py-0.5 text-xs">--font-sans</code>{lang === "en" ? " (theme/fx-theme.css), imported in src/main.tsx via @fontsource." : "（theme/fx-theme.css），在 src/main.tsx 用 @fontsource 引入。"}</p><pre className="mt-3 overflow-x-auto rounded-md bg-card p-3 text-xs leading-6"><code>{'--font-sans: "Inter Variable", "Noto Sans SC", "Helvetica Neue", "PingFang SC", "Microsoft Yahei", "微软雅黑", Arial, sans-serif;'}</code></pre></DocSurfaceCard></section>
    </div>
  );
}

import type { ReactNode, ComponentType } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DocSurfaceTableCard } from "@/components/fx/doc-surface";
import { PageLead as FxPageLead } from "@/components/fx/page-lead";
import { docsSpacing } from "@/lib/docs-spacing";
import { StarIcon } from "@/lib/icons";

export type TokenColorsLang = "zh" | "en";

export type SemanticTokenRow = {
  name: string;
  sourceToken: string;
  tailwind?: string;
  usage: string;
  usageEn: string;
};

export type SemanticTokenGroup = {
  role: string;
  label: string;
  labelEn: string;
  desc: string;
  descEn: string;
  tokens: SemanticTokenRow[];
};

export function renderTokenExample(name: string): ReactNode {
  const btn = (style: React.CSSProperties, label: string, textStyle?: React.CSSProperties) =>
    <span className="inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium" style={{ ...style }}>
      <span style={textStyle}>{label}</span>
    </span>;

  const statusMap: Record<string, { scale: string; label: string }> = {
    destructive: { scale: "red", label: "删除" },
    success: { scale: "green", label: "成功" },
    warning: { scale: "amber", label: "警告" },
    info: { scale: "blue", label: "信息" },
  };
  const statusBase = name.replace(/-(light(-hover|-active)?|hover|active|disabled)$/, "");
  if (statusMap[statusBase]) {
    const { scale, label } = statusMap[statusBase];
    if (!name.includes("-light")) {
      const step = name.endsWith("-hover") ? "08" : name.endsWith("-active") ? "10" : name.endsWith("-disabled") ? "05" : "09";
      return btn({ backgroundColor: `var(--fx-${scale}-${step})`, color: "var(--fx-neutrals-01)" }, label);
    }
    const step = name.endsWith("-active") ? "03" : name.endsWith("-hover") ? "02" : "01";
    return btn(
      { backgroundColor: `var(--fx-${scale}-${step})`, color: `var(--fx-${scale}-09)`, border: `1px solid var(--fx-${scale}-03)` },
      label,
    );
  }

  switch (name) {
    case "primary": return btn({ backgroundColor: "var(--fx-brand-09)", color: "#fff" }, "主按钮");
    case "primary-hover": return btn({ backgroundColor: "var(--fx-primary-hover)", color: "#fff" }, "悬浮");
    case "primary-active": return btn({ backgroundColor: "var(--fx-primary-active)", color: "#fff" }, "按下");
    case "primary-disabled": return btn({ backgroundColor: "var(--fx-primary-disabled)", color: "#fff" }, "禁用");
    case "primary-light": return btn({ backgroundColor: "var(--fx-primary-light)", color: "var(--fx-brand-09)", border: "1px solid var(--fx-primary-light-hover)" }, "标签");
    case "primary-light-hover": return btn({ backgroundColor: "var(--fx-primary-light-hover)", color: "var(--fx-brand-09)", border: "1px solid var(--fx-primary-light-hover)" }, "悬浮");
    case "primary-light-active": return btn({ backgroundColor: "var(--fx-primary-light-active)", color: "var(--fx-brand-09)", border: "1px solid var(--fx-primary-light-active)" }, "按下");
    case "ring": return <span className="inline-flex items-center rounded border-2 px-2 py-0.5 text-xs" style={{ borderColor: "oklch(from var(--fx-brand-09) l c h / 0.4)" }}>焦点</span>;
    case "foreground": return <span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: "var(--fx-neutrals-20)" }}>主文字 Aa <StarIcon className="size-3.5" /></span>;
    case "foreground-secondary": return <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: "var(--fx-neutrals-15)" }}>次要文字 Aa <StarIcon className="size-3.5" /></span>;
    case "muted-foreground": return <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: "var(--fx-neutrals-11)" }}>弱信息 Aa <StarIcon className="size-3.5" /></span>;
    case "foreground-disabled": return <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: "var(--fx-neutrals-07)" }}>占位/禁用 Aa <StarIcon className="size-3.5" /></span>;
    case "primary-foreground": return <span className="inline-flex items-center gap-1.5 rounded px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: "var(--fx-brand-09)", color: "var(--fx-neutrals-01)" }}>按钮文字 <StarIcon className="size-3.5" /></span>;
    case "text-brand": return <span className="text-xs font-medium" style={{ color: "var(--fx-brand-09)" }}>品牌强调 Aa</span>;
    case "text-brand-hover": return <span className="text-xs font-medium" style={{ color: "var(--fx-brand-08)" }}>品牌强调 Aa</span>;
    case "text-brand-active": return <span className="text-xs font-medium" style={{ color: "var(--fx-brand-10)" }}>品牌强调 Aa</span>;
    case "link": return <a className="text-xs underline underline-offset-4" style={{ color: "var(--fx-blue-09)" }}>查看详情</a>;
    case "link-hover": return <a className="text-xs underline underline-offset-4" style={{ color: "var(--fx-blue-08)" }}>查看详情</a>;
    case "link-active": return <a className="text-xs underline underline-offset-4" style={{ color: "var(--fx-blue-10)" }}>查看详情</a>;
    case "icon": return <StarIcon className="size-4" style={{ color: "var(--fx-neutrals-20)" }} />;
    case "icon-muted": return <StarIcon className="size-4" style={{ color: "var(--fx-neutrals-11)" }} />;
    case "background": return <span className="inline-flex h-5 w-12 rounded border border-border" style={{ backgroundColor: "var(--fx-neutrals-02)" }} />;
    case "card": return <span className="inline-flex h-5 w-12 rounded border border-border shadow-sm" style={{ backgroundColor: "var(--fx-neutrals-01)" }} />;
    case "muted": return <span className="inline-flex h-5 w-12 rounded" style={{ backgroundColor: "var(--fx-neutrals-03)" }} />;
    case "accent": return <span className="inline-flex h-5 w-12 rounded" style={{ backgroundColor: "var(--fx-orange-01)" }} />;
    case "secondary": return btn({ backgroundColor: "var(--fx-neutrals-03)", color: "var(--fx-neutrals-20)" }, "次级按钮");
    case "border-subtle": return <span className="inline-flex h-5 w-12 items-center justify-center"><span className="w-full border-t" style={{ borderColor: "var(--fx-neutrals-04)" }} /></span>;
    case "border": return <span className="inline-flex h-5 w-12 items-center justify-center"><span className="w-full border-t" style={{ borderColor: "var(--fx-neutrals-05)" }} /></span>;
    case "border-strong": return <span className="inline-flex h-5 w-12 items-center justify-center"><span className="w-full border-t-2" style={{ borderColor: "var(--fx-neutrals-08)" }} /></span>;
    case "input": return <span className="inline-flex h-5 w-16 items-center rounded border px-1.5 text-xs text-muted-foreground" style={{ borderColor: "var(--fx-neutrals-07)" }}>输入框</span>;
    default: return <span className="text-muted-foreground/30">—</span>;
  }
}

export const semanticTokenGroups = [
{
  role: "brand",
  label: "品牌色", labelEn: "Brand",
  desc: "来自 Orange 色系，品牌橙驱动所有主操作和激活态",
  descEn: "Derived from the Orange scale. Brand orange drives all primary actions and active states.",
  tokens: [
  { name: "primary", value: "#FF8000", sourceToken: "--fx-brand-09", tailwind: "bg-primary", usage: "主色默认态 — 主按钮、品牌强调", usageEn: "Primary default — main buttons, brand emphasis" },
  { name: "primary-hover", value: "", sourceToken: "--fx-brand-08", tailwind: "bg-primary-hover", usage: "主色悬浮态", usageEn: "Primary hover state" },
  { name: "primary-active", value: "", sourceToken: "--fx-brand-10", tailwind: "bg-primary-active", usage: "主色激活 / 按下态（click）", usageEn: "Primary active / pressed (click) state" },
  { name: "primary-disabled", value: "", sourceToken: "--fx-brand-05", tailwind: "bg-primary-disabled", usage: "主色禁用态", usageEn: "Primary disabled state" },
  { name: "primary-light", value: "", sourceToken: "--fx-brand-01", tailwind: "bg-primary-light", usage: "浅色主色背景（Tag / Badge / Alert）", usageEn: "Light primary bg (Tag / Badge / Alert)" },
  { name: "primary-light-hover", value: "", sourceToken: "--fx-brand-02", tailwind: "bg-primary-light-hover", usage: "浅色主色悬浮态", usageEn: "Light primary hover state" },
  { name: "primary-light-active", value: "", sourceToken: "--fx-brand-03", tailwind: "bg-primary-light-active", usage: "浅色主色激活 / 按下态", usageEn: "Light primary active / pressed state" },
  { name: "ring", value: "", sourceToken: "--fx-brand-09", tailwind: "ring-ring", usage: "键盘焦点环（品牌色 40% 透明）", usageEn: "Keyboard focus ring (brand color at 40% opacity)" }]

},
{
  role: "surface",
  label: "背景色", labelEn: "Background",
  desc: "页面与组件背景。background/card 定义页面层级，更高层（弹窗 → Popover）靠 shadow-l1/l2/l3 区分；muted/accent/secondary 用于组件内部状态；fill-* 是半透明填充，用于透明容器上的控件",
  descEn: "Page and component backgrounds. background/card define elevation; higher layers use shadow-l1/l2/l3. muted/accent/secondary cover component-level states.",
  tokens: [
  { name: "background", value: "", sourceToken: "--fx-neutrals-02", tailwind: "bg-background", usage: "页面底色 — 应用外壳、Layout 背景", usageEn: "App shell / page canvas" },
  { name: "card", value: "#FFFFFF", sourceToken: "--fx-neutrals-01", tailwind: "bg-card", usage: "容器层 — 卡片、面板（含 popover）", usageEn: "Container layer — card / panel / popover" },
  { name: "muted", value: "", sourceToken: "--fx-neutrals-03", tailwind: "bg-muted", usage: "次级背景 — 代码块、表格斑马纹、输入框底色；ghost/outline 悬浮底", usageEn: "Subtle background — code blocks, table stripes, input fill; ghost/outline hover" },
  { name: "accent", value: "", sourceToken: "--fx-orange-01", tailwind: "bg-accent", usage: "交互高亮背景 — 列表/菜单项悬浮态", usageEn: "Hover highlight background — list / menu item hover" },
  { name: "secondary", value: "", sourceToken: "--fx-neutrals-03", tailwind: "bg-secondary", usage: "弱操作背景 — secondary 按钮默认底", usageEn: "Low-emphasis action background — secondary button base" },
  { name: "overlay", value: "", sourceToken: "--overlay", tailwind: "bg-overlay", usage: "遮罩蒙层 — 弹窗/抽屉背后的半透明压暗（透明度内置，直接用）", usageEn: "Scrim — semi-transparent dim behind dialogs / sheets (alpha built in)" },
  { name: "fill-subtle", value: "", sourceToken: "--fill-subtle", tailwind: "bg-fill-subtle", usage: "半透明填充 — 透明容器/未知底色上的填充控件待命态（如顶栏搜索框），自适应背景", usageEn: "Translucent fill — filled control on a transparent/unknown surface (e.g. top-bar search)" },
  { name: "fill-hover", value: "", sourceToken: "--fill-hover", tailwind: "bg-fill-hover", usage: "半透明填充 — 上述控件 hover 加深 / 无底色图标按钮 hover", usageEn: "Translucent fill — hover state of the above / ghost icon-button hover" }]

},
{
  role: "text",
  label: "文字色 · 中性层级", labelEn: "Text · Neutral hierarchy",
  desc: "文字与图标共用同一套四级层级（主/次/占位/禁用），全部取自中性轴；外加反色文字",
  descEn: "Text and icons share one four-level hierarchy (primary / secondary / placeholder / disabled), all from the neutral axis, plus reversed text.",
  tokens: [
  { name: "foreground", value: "", sourceToken: "--fx-neutrals-20", tailwind: "text-foreground", usage: "① 主文字/图标 — 标题、正文、表单标签、默认图标", usageEn: "① Primary text/icon — headings, body, labels, default icons" },
  { name: "foreground-secondary", value: "", sourceToken: "--fx-neutrals-15", tailwind: "text-foreground-secondary", usage: "② 次要文字/图标 — 次要正文、说明", usageEn: "② Secondary text/icon — secondary copy, descriptions" },
  { name: "muted-foreground", value: "", sourceToken: "--fx-neutrals-11", tailwind: "text-muted-foreground", usage: "③ 弱信息/caption — 描述、辅助说明、次要图标", usageEn: "③ Low-emphasis / caption — descriptions, helper text, muted icons" },
  { name: "foreground-disabled", value: "", sourceToken: "--fx-neutrals-07", tailwind: "text-foreground-disabled", usage: "④ 占位 + 禁用 — 表单 placeholder、禁用文字与图标（≈25%）", usageEn: "④ Placeholder + disabled — form placeholder, disabled text/icons (≈25%)" },
  { name: "primary-foreground", value: "", sourceToken: "--fx-neutrals-01", tailwind: "text-primary-foreground", usage: "反色文字 — 主色按钮、品牌背景上的文字图标", usageEn: "Reversed text — on primary / brand-color backgrounds" }]

},
{
  role: "text-colored",
  label: "文字色 · 彩色（品牌 / 链接）", labelEn: "Text · Colored (brand / link)",
  desc: "彩色交互文字：品牌色（橙）用于强调，链接色（蓝）用于超链接。统一交互阶梯 09 / hover 08 / active 10（浅色模式）。",
  descEn: "Colored interactive text: brand (orange) for emphasis, link (blue) for hyperlinks. Unified ladder 09 / hover 08 / active 10 (light mode).",
  tokens: [
  { name: "text-brand", value: "", sourceToken: "--fx-brand-09", tailwind: "text-primary", usage: "品牌色文字 — 默认（强调、品牌色链接）", usageEn: "Brand text — default (emphasis, brand link)" },
  { name: "text-brand-hover", value: "", sourceToken: "--fx-brand-08", tailwind: "hover:text-[var(--fx-brand-08)]", usage: "品牌色文字 — 悬浮", usageEn: "Brand text — hover" },
  { name: "text-brand-active", value: "", sourceToken: "--fx-brand-10", tailwind: "active:text-[var(--fx-brand-10)]", usage: "品牌色文字 — 激活 / 按下", usageEn: "Brand text — active / pressed" },
  { name: "link", value: "", sourceToken: "--fx-blue-09", tailwind: "text-link", usage: "链接 — 默认（超链接、Button/Badge link 变体）", usageEn: "Link — default (hyperlinks, link variants)" },
  { name: "link-hover", value: "", sourceToken: "--fx-blue-08", tailwind: "hover:text-link-hover", usage: "链接 — 悬浮", usageEn: "Link — hover" },
  { name: "link-active", value: "", sourceToken: "--fx-blue-10", tailwind: "active:text-link-active", usage: "链接 — 激活 / 按下", usageEn: "Link — active / pressed" }]

},
{
  role: "status-danger",
  label: "状态色 · 危险", labelEn: "Status · Danger",
  desc: "危险/删除语义（红）。Solid 取 09，浅色组取 01/02/03。",
  descEn: "Danger / delete semantics (red). Solid = 09, light group = 01/02/03.",
  tokens: [
  { name: "destructive", value: "", sourceToken: "--fx-red-09", tailwind: "bg-destructive", usage: "实心默认 — 删除、危险、不可逆操作", usageEn: "Solid default — delete, dangerous, irreversible" },
  { name: "destructive-hover", value: "", sourceToken: "--fx-red-08", tailwind: "bg-destructive-hover", usage: "实心悬浮", usageEn: "Solid hover" },
  { name: "destructive-active", value: "", sourceToken: "--fx-red-10", tailwind: "bg-destructive-active", usage: "实心激活 / 按下", usageEn: "Solid active / pressed" },
  { name: "destructive-disabled", value: "", sourceToken: "--fx-red-05", tailwind: "bg-destructive-disabled", usage: "实心禁用", usageEn: "Solid disabled" },
  { name: "destructive-light", value: "", sourceToken: "--fx-red-01", tailwind: "bg-destructive-light", usage: "浅色默认 — 危险 Tag / Alert 背景", usageEn: "Light default — danger tag / alert bg" },
  { name: "destructive-light-hover", value: "", sourceToken: "--fx-red-02", tailwind: "bg-destructive-light-hover", usage: "浅色悬浮", usageEn: "Light hover" },
  { name: "destructive-light-active", value: "", sourceToken: "--fx-red-03", tailwind: "bg-destructive-light-active", usage: "浅色激活 / 按下", usageEn: "Light active / pressed" }]

},
{
  role: "status-success",
  label: "状态色 · 成功", labelEn: "Status · Success",
  desc: "成功语义（绿）。Solid 取 09，浅色组取 01/02/03。",
  descEn: "Success semantics (green). Solid = 09, light group = 01/02/03.",
  tokens: [
  { name: "success", value: "", sourceToken: "--fx-green-09", tailwind: "bg-success", usage: "实心默认 — 成功状态", usageEn: "Solid default — success state" },
  { name: "success-hover", value: "", sourceToken: "--fx-green-08", tailwind: "bg-success-hover", usage: "实心悬浮", usageEn: "Solid hover" },
  { name: "success-active", value: "", sourceToken: "--fx-green-10", tailwind: "bg-success-active", usage: "实心激活 / 按下", usageEn: "Solid active / pressed" },
  { name: "success-disabled", value: "", sourceToken: "--fx-green-05", tailwind: "bg-success-disabled", usage: "实心禁用", usageEn: "Solid disabled" },
  { name: "success-light", value: "", sourceToken: "--fx-green-01", tailwind: "bg-success-light", usage: "浅色默认 — 成功 Tag / Alert 背景", usageEn: "Light default — success tag / alert bg" },
  { name: "success-light-hover", value: "", sourceToken: "--fx-green-02", tailwind: "bg-success-light-hover", usage: "浅色悬浮", usageEn: "Light hover" },
  { name: "success-light-active", value: "", sourceToken: "--fx-green-03", tailwind: "bg-success-light-active", usage: "浅色激活 / 按下", usageEn: "Light active / pressed" }]

},
{
  role: "status-warning",
  label: "状态色 · 警告", labelEn: "Status · Warning",
  desc: "警告语义（琥珀）。Solid 取 09，浅色组取 01/02/03。",
  descEn: "Warning semantics (amber). Solid = 09, light group = 01/02/03.",
  tokens: [
  { name: "warning", value: "", sourceToken: "--fx-amber-09", tailwind: "bg-warning", usage: "实心默认 — 警告状态", usageEn: "Solid default — warning state" },
  { name: "warning-hover", value: "", sourceToken: "--fx-amber-08", tailwind: "bg-warning-hover", usage: "实心悬浮", usageEn: "Solid hover" },
  { name: "warning-active", value: "", sourceToken: "--fx-amber-10", tailwind: "bg-warning-active", usage: "实心激活 / 按下", usageEn: "Solid active / pressed" },
  { name: "warning-disabled", value: "", sourceToken: "--fx-amber-05", tailwind: "bg-warning-disabled", usage: "实心禁用", usageEn: "Solid disabled" },
  { name: "warning-light", value: "", sourceToken: "--fx-amber-01", tailwind: "bg-warning-light", usage: "浅色默认 — 警告 Tag / Alert 背景", usageEn: "Light default — warning tag / alert bg" },
  { name: "warning-light-hover", value: "", sourceToken: "--fx-amber-02", tailwind: "bg-warning-light-hover", usage: "浅色悬浮", usageEn: "Light hover" },
  { name: "warning-light-active", value: "", sourceToken: "--fx-amber-03", tailwind: "bg-warning-light-active", usage: "浅色激活 / 按下", usageEn: "Light active / pressed" }]

},
{
  role: "status-info",
  label: "状态色 · 信息", labelEn: "Status · Info",
  desc: "信息语义（蓝）。Solid 取 09，浅色组取 01/02/03。（中性/默认标签请用 secondary，不用 info）",
  descEn: "Info semantics (blue). Solid = 09, light = 01/02/03. (For neutral/default tags use secondary, not info.)",
  tokens: [
  { name: "info", value: "", sourceToken: "--fx-blue-09", tailwind: "bg-info", usage: "实心默认 — 信息状态", usageEn: "Solid default — info state" },
  { name: "info-hover", value: "", sourceToken: "--fx-blue-08", tailwind: "bg-info-hover", usage: "实心悬浮", usageEn: "Solid hover" },
  { name: "info-active", value: "", sourceToken: "--fx-blue-10", tailwind: "bg-info-active", usage: "实心激活 / 按下", usageEn: "Solid active / pressed" },
  { name: "info-disabled", value: "", sourceToken: "--fx-blue-05", tailwind: "bg-info-disabled", usage: "实心禁用", usageEn: "Solid disabled" },
  { name: "info-light", value: "", sourceToken: "--fx-blue-01", tailwind: "bg-info-light", usage: "浅色默认 — 信息 Tag / Alert 背景", usageEn: "Light default — info tag / alert bg" },
  { name: "info-light-hover", value: "", sourceToken: "--fx-blue-02", tailwind: "bg-info-light-hover", usage: "浅色悬浮", usageEn: "Light hover" },
  { name: "info-light-active", value: "", sourceToken: "--fx-blue-03", tailwind: "bg-info-light-active", usage: "浅色激活 / 按下", usageEn: "Light active / pressed" }]

},
{
  role: "border",
  label: "边框色", labelEn: "Border",
  desc: "来自 Neutrals 中浅阶，三档：弱（分割线）/ 默认 / 强（hover/强调）+ 表单输入边框",
  descEn: "From mid-light Neutrals — three levels: subtle (dividers) / default / strong (hover) + form input border.",
  tokens: [
  { name: "border-subtle", value: "", sourceToken: "--fx-neutrals-04", tailwind: "border-border-subtle", usage: "弱边框 — 分割线、表格内线、列表分隔", usageEn: "Subtle — dividers, table inner lines, list separators" },
  { name: "border", value: "", sourceToken: "--fx-neutrals-05", tailwind: "border-border", usage: "默认边框 — 卡片、按钮等组件壳体", usageEn: "Default — cards, buttons, and component shells" },
  { name: "border-strong", value: "", sourceToken: "--fx-neutrals-08", tailwind: "border-border-strong", usage: "强边框 — hover 边框、选中态、需强调的边界", usageEn: "Strong — hover border, selected, emphasis" },
  { name: "input", value: "", sourceToken: "--fx-neutrals-07", tailwind: "border-input", usage: "表单可交互边框（比默认略重）", usageEn: "Interactive form input border" }]

}];
export const tokenColorsAnchors = [
  { label: "主题色", labelEn: "Brand Color", href: "#tokens-colors-seeds" },
  { label: "彩色色板", labelEn: "Chromatic Palette", href: "#tokens-colors-palette" },
  { label: "语义颜色", labelEn: "Semantic Colors", href: "#tokens-colors-semantic" },
]

type Props = {
  actions: ReactNode;
  lang: TokenColorsLang;
  SeedPreview: ComponentType<{ lang: TokenColorsLang }>;
  ColorPaletteWithTabs: ComponentType<{ lang: TokenColorsLang }>;
  semanticTokenGroups: SemanticTokenGroup[];
  getTokenExample: (name: string) => ReactNode;
};

export function TokensColorsPage({
  actions,
  lang,
  SeedPreview,
  ColorPaletteWithTabs,
  semanticTokenGroups,
  getTokenExample,
}: Props) {
  return (
    <div className={docsSpacing.pageStack}>
      <section id="tokens-colors" className="flex flex-col gap-2">
        <FxPageLead
          crumb={lang === "en" ? "Design Tokens / Colors" : "设计令牌 / 颜色"}
          title={lang === "en" ? "Colors" : "颜色"}
          lead={lang === "en" ? "Brand seed, 12-step palettes, the neutral gray axis, and semantic colors — the single source of truth for all color." : "品牌种子色、12 阶色板、中性灰轴与语义色——全站颜色的唯一真相源。"}
          actions={actions}
        />
      </section>

      <section id="tokens-colors-seeds" className={docsSpacing.sectionStack}>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Brand Color" : "主题色"}</h2>
          <p className="text-sm text-muted-foreground">
            {lang === "en" ? "Input any color to preview its 12-step palette. Default is --fx-brand. The derivation uses CSS oklch relative color syntax." : "输入任意色值，实时预览 12 阶推导色板。默认为 --fx-brand，推导算法使用 CSS oklch 相对颜色语法。"}
          </p>
        </div>
        <SeedPreview lang={lang} />
      </section>

      <section id="tokens-colors-palette" className={docsSpacing.sectionStack}>
        <ColorPaletteWithTabs lang={lang} />
      </section>

      <section id="tokens-colors-semantic" className={docsSpacing.sectionStack}>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Semantic Colors" : "语义颜色"}</h2>
          <p className="text-base text-muted-foreground">
            {lang === "en" ? "Each semantic token is derived from a primitive (--fx-*) variable. The source shows which palette step it maps to." : "每个语义 token 都从对应的 primitive（--fx-*）推导而来。「来源」列显示它映射的色系阶值。"}
          </p>
        </div>
        {semanticTokenGroups.map((group) => (
          <div key={group.role} className="flex flex-col gap-3">
            <div className="flex flex-col gap-0.5">
              <h3 className="text-base font-semibold">{lang === "en" ? group.labelEn : group.label}</h3>
              <p className="text-sm text-muted-foreground">{lang === "en" ? group.descEn : group.desc}</p>
            </div>
            <DocSurfaceTableCard>
              <Table className="min-w-[860px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-4">Token</TableHead>
                    <TableHead>{lang === "en" ? "Value" : "值"}</TableHead>
                    <TableHead>Tailwind</TableHead>
                    <TableHead>{lang === "en" ? "Example" : "示例"}</TableHead>
                    <TableHead className="pr-4">{lang === "en" ? "Usage" : "用法"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.tokens.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell className="pl-4 font-medium"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.name}</code></TableCell>
                      <TableCell><div className="flex items-center gap-2"><span className="size-4 rounded-full border border-border" style={{ backgroundColor: `var(${row.sourceToken})` }} /><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{`var(${row.sourceToken})`}</code></div></TableCell>
                      <TableCell>{row.tailwind ? <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.tailwind}</code> : <span className="text-muted-foreground/30">—</span>}</TableCell>
                      <TableCell>{getTokenExample(row.name)}</TableCell>
                      <TableCell className="pr-4 text-foreground">{lang === "en" ? row.usageEn : row.usage}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </DocSurfaceTableCard>
          </div>
        ))}
      </section>
    </div>
  );
}

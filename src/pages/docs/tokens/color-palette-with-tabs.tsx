import { useRef, useState } from "react"
import { WebsiteCardContainer } from "@/components/fx/website-card-container"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckIcon } from "@/lib/icons"
import { ColorSwatch, NEUTRAL_STEPS, PALETTE_STEPS } from "./color-seed-preview"

type Lang = "zh" | "en"

export const seedColors = [
{ name: "Orange", nameZh: "橙", tag: "", tagZh: "", cssVar: "--fds-g-color-seed-orange", hueOffset: "#FF8000", prefix: "--fds-g-color-orange-base" },
{ name: "Amber", nameZh: "琥珀", tag: "Warning", tagZh: "警告", cssVar: "--fds-g-color-seed-amber", hueOffset: "#F59E0B", prefix: "--fds-g-color-amber-base" },
{ name: "Yellow", nameZh: "黄", tag: "", tagZh: "", cssVar: "--fds-g-color-seed-yellow", hueOffset: "#EAB308", prefix: "--fds-g-color-yellow-base" },
{ name: "Lime", nameZh: "嫩绿", tag: "", tagZh: "", cssVar: "--fds-g-color-seed-lime", hueOffset: "#84CC16", prefix: "--fds-g-color-lime-base" },
{ name: "Chartreuse", nameZh: "黄绿", tag: "", tagZh: "", cssVar: "--fds-g-color-seed-yellow-green", hueOffset: "custom", prefix: "--fds-g-color-yellow-green-base" },
{ name: "Green", nameZh: "绿", tag: "Success", tagZh: "成功", cssVar: "--fds-g-color-seed-green", hueOffset: "#22C55E", prefix: "--fds-g-color-green-base" },
{ name: "Teal", nameZh: "青", tag: "", tagZh: "", cssVar: "--fds-g-color-seed-teal", hueOffset: "#14B8A6", prefix: "--fds-g-color-teal-base" },
{ name: "Cyan", nameZh: "青蓝", tag: "", tagZh: "", cssVar: "--fds-g-color-seed-cyan", hueOffset: "#06B6D4", prefix: "--fds-g-color-cyan-base" },
{ name: "Light Blue", nameZh: "亮蓝", tag: "", tagZh: "", cssVar: "--fds-g-color-seed-light-blue", hueOffset: "#38BDF8", prefix: "--fds-g-color-light-blue-base" },
{ name: "Blue", nameZh: "蓝", tag: "Link/Info", tagZh: "链接/信息", cssVar: "--fds-g-color-seed-blue", hueOffset: "#3B73E8", prefix: "--fds-g-color-blue-base" },
{ name: "Indigo", nameZh: "靛蓝", tag: "", tagZh: "", cssVar: "--fds-g-color-seed-indigo", hueOffset: "#6366F1", prefix: "--fds-g-color-indigo-base" },
{ name: "Purple", nameZh: "紫", tag: "", tagZh: "", cssVar: "--fds-g-color-seed-purple", hueOffset: "#8B5CF6", prefix: "--fds-g-color-purple-base" },
{ name: "Magenta", nameZh: "洋红", tag: "", tagZh: "", cssVar: "--fds-g-color-seed-magenta", hueOffset: "#D946EF", prefix: "--fds-g-color-magenta-base" },
{ name: "Pink", nameZh: "粉", tag: "", tagZh: "", cssVar: "--fds-g-color-seed-pink", hueOffset: "#EC4899", prefix: "--fds-g-color-pink-base" },
{ name: "Red", nameZh: "红", tag: "Error", tagZh: "错误", cssVar: "--fds-g-color-seed-red", hueOffset: "#EF4444", prefix: "--fds-g-color-red-base" }];
export function ColorPaletteWithTabs({ lang }: {lang: Lang;}) {
  const customPrefix = null;
  const [paletteProfile, setPaletteProfile] = useState<"base" | "dark">("base");
  const darkBg = paletteProfile === "dark";
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopy = (varName: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(varName);
    toastTimer.current = setTimeout(() => setToast(null), 2000);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Toast */}
      {toast &&
      <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2 flex items-center gap-2.5 rounded-lg border border-border bg-popover px-4 py-2.5 shadow-l1">
          <CheckIcon aria-hidden="true" className="size-4 shrink-0 text-success" />
          <span className="text-sm text-foreground">
            已复制 <code className="ml-1 rounded bg-muted px-1.5 py-0.5 text-xs font-mono">{toast}</code>
          </span>
        </div>
      }

      {/* Keep the description with its heading so the mode control cannot stretch the text rhythm. */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Color Palettes" : "色板"}</h2>
          <p className="text-sm text-muted-foreground">
            {lang === "en" ?
            paletteProfile === "base"
              ? "Light: 16 chromatic families × 12 steps. 10–80 move toward white, 90 is the seed, and 100–120 move toward black."
              : "Dark: the same 16 seeds produce a separate 12-step profile. 10 starts near the dark-surface anchor, 90 preserves the seed, and 100–120 provide brighter accents."
            : paletteProfile === "base"
              ? "浅色：16 个有色色系 × 12 阶。10–80 向白，90 为种子色，100–120 向黑。"
              : "暗色：同一组 16 个 Seed 生成独立暗色色阶。10 从暗色表面锚点起步，90 保留 Seed，100–120 提供高亮色。"}
          </p>
        </div>
        <Tabs value={paletteProfile} onValueChange={(value) => setPaletteProfile(value as "base" | "dark")} className="shrink-0">
          <TabsList size="sm">
            <TabsTrigger value="base">{lang === "en" ? "Light" : "浅色"}</TabsTrigger>
            <TabsTrigger value="dark">{lang === "en" ? "Dark" : "暗色"}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* 色板 */}
      <WebsiteCardContainer padding="none">
        <div className={["overflow-hidden transition-colors", darkBg ? "bg-zinc-900" : "bg-card"].join(" ")}>
        {/* 用途分组行 */}
        <div className={["flex items-center text-xs", darkBg ? "text-white/50" : "text-foreground/55"].join(" ")}>
          <div className={["w-24 shrink-0 self-stretch border-r", darkBg ? "border-white/10" : "border-border-subtle"].join(" ")} />
          {([
          { label: lang === "en" ? "Backgrounds" : "背景", cols: 2 },
          { label: lang === "en" ? "Interactive" : "交互", cols: 3 },
          { label: lang === "en" ? "Borders" : "边框", cols: 3 },
          { label: lang === "en" ? "Solid" : "实心", cols: 2 },
          { label: lang === "en" ? "Text" : "文字", cols: 2 }] as
          const).map((g, i, arr) =>
          <div
            key={g.label}
            className={[
            "flex items-center justify-center py-1",
            i < arr.length - 1 ? darkBg ? "border-r border-white/10" : "border-r border-border-subtle" : ""].
            join(" ")}
            style={{ flex: g.cols }}>
            
              {g.label}
            </div>
          )}
        </div>
        {/* 阶编号行 */}
        <div className={["flex items-center border-b text-xs", darkBg ? "border-white/10" : "border-border-subtle"].join(" ")}>
          <div className={["w-24 shrink-0 self-stretch border-r", darkBg ? "border-white/10" : "border-border-subtle"].join(" ")} />
          {PALETTE_STEPS.map((s) =>
          <div key={s} className={[
          "flex-1 flex items-center justify-center py-1.5",
          darkBg ? "text-white/35" : "text-muted-foreground",
          ["30", "60", "90", "110"].includes(s) ? darkBg ? "border-l border-white/20" : "border-l border-border-subtle" : ""].
          join(" ")}>
              {s === "90" ? "90 · Seed" : s}
            </div>
          )}
        </div>

        {/* 色板行 */}
        <div className="flex flex-col gap-[2px]">
        {seedColors.map((seed) =>
          {
          const palettePrefix = seed.prefix.replace("-base", `-${paletteProfile}`);
          return (
          <div
            key={seed.name}
            className="flex items-stretch">
            
            <div className={["w-24 shrink-0 flex flex-col justify-center px-3 py-2 border-r", darkBg ? "border-white/10" : "border-border-subtle", seed.prefix === customPrefix ? darkBg ? "bg-white/5" : "bg-primary/5" : ""].join(" ")}>
              <span className={`text-xs font-semibold leading-tight ${darkBg ? "text-white" : "text-foreground"}`}>
                {lang === "en" ? seed.name : seed.nameZh}
              </span>
              {seed.prefix === customPrefix ?
              <span className="mt-0.5 text-xs font-medium text-primary">
                  {lang === "en" ? "custom" : "自定义"}
                </span> :
              seed.tagZh ?
              <span className={`mt-0.5 text-xs ${darkBg ? "text-white/45" : "text-muted-foreground"}`}>
                  {lang === "en" ? seed.tag : seed.tagZh}
                </span> :
              null}
            </div>
            <div className="flex flex-1 gap-[2px]">
              {PALETTE_STEPS.map((step) =>
              <ColorSwatch
                key={step}
                varName={`${palettePrefix}-${step}`}
                step={step}
                label={seed.name}
                semanticTag={step === "90" && seed.tag ? seed.tag : undefined}
                onCopy={handleCopy}
                fixedTextDark={paletteProfile === "base" ? Number(step) <= 60 : Number(step) >= 110}
                className="" />

              )}
            </div>
          </div>)
          }
          )}
        </div>
        </div>
      </WebsiteCardContainer>

      {/* 中性色色板 */}
      <div className="mt-10">
        <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Neutral Palette" : "中性色色板"}</h2>
        <p className="mt-1 mb-4 text-sm text-muted-foreground">
          {lang === "en" ?
          "The single neutral gray axis — 20 steps via color-mix(white, neutral-dark N%), N = [0 2 5 9 14 19 25 31 37 43 49 55 61 67 73 79 85 90 95 100]. neutral-dark = oklch(L 0.12, C 0.008, brand hue) — faintly tinted, near-neutral. Source for page/card/text/border and neutral interactive surfaces (secondary / muted / ghost). Click to copy." :
          "全站唯一中性灰轴 — 20 阶，由 color-mix(white, neutral-dark N%) 推导，N = [0 2 5 9 14 19 25 31 37 43 49 55 61 67 73 79 85 90 95 100]。neutral-dark = oklch(L 0.12, C 0.008, 品牌色相)，极淡染色、肉眼近中性。页面底/卡片/文字/边框，以及中性交互面（secondary / muted / ghost）都取自这里。点击色块复制变量名。"}
        </p>
        <WebsiteCardContainer padding="none">
          <div className="overflow-hidden bg-card">
          {/* 阶编号行 */}
          <div className="flex items-center border-b border-border-subtle text-xs">
            <div className="w-24 shrink-0 self-stretch border-r border-border-subtle" />
            {NEUTRAL_STEPS.map((s) =>
            <div key={s} className={["flex-1 flex items-center justify-center py-1.5", darkBg ? "text-white/35" : "text-muted-foreground"].join(" ")}>
                {s}
              </div>
            )}
          </div>
          {/* 色板行 */}
          <div className="flex items-stretch">
            <div className="flex w-24 shrink-0 flex-col justify-center border-r border-border-subtle px-3 py-2">
              <span className="text-xs font-semibold leading-tight text-foreground">
                {lang === "en" ? "Neutral" : "中性灰"}
              </span>
            </div>
            <div className="flex flex-1 gap-[2px]">
              {NEUTRAL_STEPS.map((step) =>
              <ColorSwatch
                key={step}
                varName={`--fds-g-color-neutral-base-${step}`}
                step={step}
                label="N"
                onCopy={handleCopy}
                className="" />

              )}
            </div>
          </div>
          </div>
        </WebsiteCardContainer>
      </div>
    </div>);

}

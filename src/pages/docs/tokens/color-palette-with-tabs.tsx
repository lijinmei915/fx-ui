import { useRef, useState } from "react"
import { WebsiteCardContainer } from "@/components/fx/website-card-container"
import { ColorSwatch, NEUTRAL_STEPS, PALETTE_STEPS } from "./color-seed-preview"

type Lang = "zh" | "en"

export const seedColors = [
{ name: "Orange", nameZh: "橙", tag: "", tagZh: "", cssVar: "--fx-seed-orange", hueOffset: "#FF8000", prefix: "--fx-orange" },
{ name: "Amber", nameZh: "琥珀", tag: "Warning", tagZh: "警告", cssVar: "--fx-seed-amber", hueOffset: "#F59E0B", prefix: "--fx-amber" },
{ name: "Yellow", nameZh: "黄", tag: "", tagZh: "", cssVar: "--fx-seed-yellow", hueOffset: "#EAB308", prefix: "--fx-yellow" },
{ name: "Lime", nameZh: "嫩绿", tag: "", tagZh: "", cssVar: "--fx-seed-lime", hueOffset: "#84CC16", prefix: "--fx-lime" },
{ name: "Chartreuse", nameZh: "黄绿", tag: "", tagZh: "", cssVar: "--fx-seed-yellow-green", hueOffset: "custom", prefix: "--fx-yellow-green" },
{ name: "Green", nameZh: "绿", tag: "Success", tagZh: "成功", cssVar: "--fx-seed-green", hueOffset: "#22C55E", prefix: "--fx-green" },
{ name: "Teal", nameZh: "青", tag: "", tagZh: "", cssVar: "--fx-seed-teal", hueOffset: "#14B8A6", prefix: "--fx-teal" },
{ name: "Cyan", nameZh: "青蓝", tag: "", tagZh: "", cssVar: "--fx-seed-cyan", hueOffset: "#06B6D4", prefix: "--fx-cyan" },
{ name: "Blue", nameZh: "蓝", tag: "Link/Info", tagZh: "链接/信息", cssVar: "--fx-seed-blue", hueOffset: "#3B82F6", prefix: "--fx-blue" },
{ name: "Purple", nameZh: "紫", tag: "", tagZh: "", cssVar: "--fx-seed-purple", hueOffset: "#8B5CF6", prefix: "--fx-purple" },
{ name: "Pink", nameZh: "粉", tag: "", tagZh: "", cssVar: "--fx-seed-pink", hueOffset: "#EC4899", prefix: "--fx-pink" },
{ name: "Red", nameZh: "红", tag: "Error", tagZh: "错误", cssVar: "--fx-seed-red", hueOffset: "#EF4444", prefix: "--fx-red" }];
export function ColorPaletteWithTabs({ lang }: {lang: Lang;}) {
  const customPrefix = null;
  const [darkBg, setDarkBg] = useState(false);
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
          <span className="text-green-500">✓</span>
          <span className="text-sm text-foreground">
            已复制 <code className="ml-1 rounded bg-muted px-1.5 py-0.5 text-xs font-mono">{toast}</code>
          </span>
        </div>
      }

      {/* Keep the description with its heading so the mode control cannot stretch the text rhythm. */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Chromatic Palette" : "彩色色板"}</h2>
          <p className="text-sm text-muted-foreground">
            {lang === "en" ?
            "13 chromatic families × 12 steps, derived from a seed in oklch. 01–08 toward white: L += (1−L)×[.93 .84 .72 .58 .43 .28 .14 .12], C ×= [.04 .10 .18 .30 .45 .62 .80 .94]. 09 = seed. 10–12 toward black: L ×= [.87 .72 .35], C ×= [.95 .82 .65]. Steps 01–07 dark text, 08–12 white. Click a swatch to copy its variable." :
            "13 个有色色系 × 12 阶（中性灰见下方中性色色板），由种子色在 oklch 空间推导。01–08 向白：L += (1−L)×[.93 .84 .72 .58 .43 .28 .14 .12]、C ×= [.04 .10 .18 .30 .45 .62 .80 .94]；09 = 种子色；10–12 向黑：L ×= [.87 .72 .35]、C ×= [.95 .82 .65]。01–07 深色字，08–12 白色字。点击色块复制变量名。"}
          </p>
        </div>
        <div className="flex shrink-0 items-center rounded-md border border-border bg-muted/50 p-0.5 text-xs">
          <button
            onClick={() => setDarkBg(false)}
            className={[
            "rounded px-3 py-1 transition-colors",
            !darkBg ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"].
            join(" ")}>
            
            {lang === "en" ? "Light" : "浅色"}
          </button>
          <button
            onClick={() => setDarkBg(true)}
            className={[
            "rounded px-3 py-1 transition-colors",
            darkBg ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"].
            join(" ")}>
            
            {lang === "en" ? "Dark" : "深色"}
          </button>
        </div>
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
          ["03", "06", "09", "11"].includes(s) ? darkBg ? "border-l border-white/20" : "border-l border-border-subtle" : ""].
          join(" ")}>
              {s}
            </div>
          )}
        </div>

        {/* 色板行 */}
        <div className="flex flex-col gap-[2px]">
        {seedColors.map((seed) =>
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
                varName={`${seed.prefix}-${step}`}
                step={step}
                label={seed.name}
                semanticTag={step === "09" && seed.tag ? seed.tag : undefined}
                onCopy={handleCopy}
                className="" />

              )}
            </div>
          </div>
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
          <div className={["overflow-hidden transition-colors", darkBg ? "bg-zinc-900" : "bg-card"].join(" ")}>
          {/* 阶编号行 */}
          <div className={["flex items-center border-b text-xs", darkBg ? "border-white/10" : "border-border-subtle"].join(" ")}>
            <div className={["w-24 shrink-0 self-stretch border-r", darkBg ? "border-white/10" : "border-border-subtle"].join(" ")} />
            {NEUTRAL_STEPS.map((s) =>
            <div key={s} className={["flex-1 flex items-center justify-center py-1.5", darkBg ? "text-white/35" : "text-muted-foreground"].join(" ")}>
                {s}
              </div>
            )}
          </div>
          {/* 色板行 */}
          <div className="flex items-stretch">
            <div className={["w-24 shrink-0 flex flex-col justify-center px-3 py-2 border-r", darkBg ? "border-white/10" : "border-border-subtle"].join(" ")}>
              <span className={`text-xs font-semibold leading-tight ${darkBg ? "text-white" : "text-foreground"}`}>
                {lang === "en" ? "Neutral" : "中性灰"}
              </span>
            </div>
            <div className="flex flex-1 gap-[2px]">
              {NEUTRAL_STEPS.map((step) =>
              <ColorSwatch
                key={step}
                varName={`--fx-neutrals-${step}`}
                step={step}
                label="N"
                onCopy={handleCopy}
                darkTextMax={11}
                className="" />

              )}
            </div>
          </div>
          </div>
        </WebsiteCardContainer>
      </div>
    </div>);

}

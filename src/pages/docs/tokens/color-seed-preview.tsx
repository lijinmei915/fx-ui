import { useEffect, useRef, useState } from "react"
import { DocSurfaceCard } from "@/components/fx/doc-surface"

export const PALETTE_STEPS = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"] as const;
export const NEUTRAL_STEPS = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"] as const;

export const PREVIEW_FORMULAS = [
(s: string) => `oklch(from ${s} calc(l + (1 - l) * 0.93) calc(c * 0.04) h)`,
(s: string) => `oklch(from ${s} calc(l + (1 - l) * 0.84) calc(c * 0.10) h)`,
(s: string) => `oklch(from ${s} calc(l + (1 - l) * 0.72) calc(c * 0.18) h)`,
(s: string) => `oklch(from ${s} calc(l + (1 - l) * 0.58) calc(c * 0.30) h)`,
(s: string) => `oklch(from ${s} calc(l + (1 - l) * 0.43) calc(c * 0.45) h)`,
(s: string) => `oklch(from ${s} calc(l + (1 - l) * 0.28) calc(c * 0.62) h)`,
(s: string) => `oklch(from ${s} calc(l + (1 - l) * 0.14) calc(c * 0.80) h)`,
(s: string) => `oklch(from ${s} calc(l + (1 - l) * 0.12) calc(c * 0.94) h)`,
(s: string) => s,
(s: string) => `oklch(from ${s} calc(l * 0.92) calc(c * 0.95) h)`,
(s: string) => `oklch(from ${s} calc(l * 0.72) calc(c * 0.82) h)`,
(s: string) => `oklch(from ${s} calc(l * 0.35) calc(c * 0.65) h)`];


export function SeedPreview({ lang: _lang }: { lang: "zh" | "en" }) {
  const [input, setInput] = useState("var(--fx-brand)");
  const [copied, setCopied] = useState<string | null>(null);
  const styleRef = useRef<HTMLStyleElement | null>(null);
  const swatchRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [hexMap, setHexMap] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!styleRef.current) {
      styleRef.current = document.createElement("style");
      document.head.appendChild(styleRef.current);
    }
    const seed = input.trim() || "var(--fx-brand)";
    styleRef.current.textContent = PALETTE_STEPS.map((step, i) =>
    `.fx-preview-${step}{background-color:${PREVIEW_FORMULAS[i](seed)}}`
    ).join("\n");
    return () => {if (styleRef.current) styleRef.current.textContent = "";};
  }, [input]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const map: Record<string, string> = {};
      swatchRefs.current.forEach((el, i) => {
        if (!el) return;
        const info = computeSwatchInfo(el, i + 1);
        if (info.hex) map[PALETTE_STEPS[i]] = info.hex;
      });
      setHexMap(map);
    }, 50);
    return () => clearTimeout(timer);
  }, [input]);

  const handleCopy = (val: string) => {
    navigator.clipboard.writeText(val).then(() => {
      setCopied(val);
      setTimeout(() => setCopied(null), 1200);
    });
  };

  return (
    <DocSurfaceCard className="flex flex-col gap-3 p-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 shrink-0 rounded-md border border-black/10 shadow-sm"
        style={{ backgroundColor: input.trim() || "var(--fx-brand)" }} />
        <input
          className="h-9 flex-1 rounded-md border border-border bg-background px-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="#FF8000"
          spellCheck={false} />
        
      </div>
      <div className="flex overflow-hidden rounded-md gap-[2px]">
        {PALETTE_STEPS.map((step, i) => {
          const textDark = i + 1 <= 7;
          const base = textDark ? "text-black" : "text-white";
          const muted = textDark ? "text-black/50" : "text-white/55";
          const hex = hexMap[step];
          const varName = `--fx-brand-${step}`;
          return (
            <div
              key={step}
              ref={(el) => {swatchRefs.current[i] = el;}}
              className={`fx-preview-${step} group relative flex-1 cursor-pointer`}
              style={{ minHeight: 72 }}
              onClick={() => handleCopy(hex || varName)}
              title={copied === (hex || varName) ? "已复制" : hex || ""}>
              
              <div className={`pointer-events-none absolute inset-0 flex flex-col justify-between p-1.5 ${base}`}>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold leading-tight whitespace-nowrap overflow-hidden">Brand {step}</span>
                  {step === "09" &&
                  <span className="self-start rounded bg-black/25 px-1 py-px text-[7px] font-semibold text-white leading-tight whitespace-nowrap">Brand</span>
                  }
                </div>
                {hexMap[step] &&
                <span className={`self-end text-[8px] font-semibold leading-tight tabular-nums ${muted}`}>
                    {(() => {
                    const info = computeSwatchInfo(swatchRefs.current[i]!, i + 1);
                    return info.ratio;
                  })()}
                  </span>
                }
              </div>
              {hex &&
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-start gap-px bg-black/60 px-1.5 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  <span className="text-[8px] font-semibold text-white leading-tight tabular-nums">{hex.toUpperCase()}</span>
                  <span className={`text-[7px] text-white/70 leading-tight truncate w-full ${muted}`}>{varName}</span>
                </div>
              }
            </div>);

        })}
      </div>
      {copied && <p className="text-xs text-muted-foreground text-center">已复制 {copied}</p>}
    </DocSurfaceCard>);

}

export function computeSwatchInfo(bgEl: HTMLElement, stepNum: number): {ratio: string;hex: string;} {
  const colorStr = getComputedStyle(bgEl).backgroundColor;
  if (!colorStr || colorStr === "rgba(0, 0, 0, 0)") return { ratio: "", hex: "" };
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext("2d");
  if (!ctx) return { ratio: "", hex: "" };
  ctx.fillStyle = colorStr;
  ctx.fillRect(0, 0, 1, 1);
  const [rv, gv, bv] = ctx.getImageData(0, 0, 1, 1).data;
  const lin = (v: number) => {const s = v / 255;return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);};
  const L = 0.2126 * lin(rv) + 0.7152 * lin(gv) + 0.0722 * lin(bv);
  const textDark = stepNum <= 7;
  const ratio = textDark ? (L + 0.05) / 0.05 : 1.05 / (L + 0.05);
  const h = (v: number) => v.toString(16).padStart(2, "0");
  return { ratio: `${ratio.toFixed(1)}:1`, hex: `#${h(rv)}${h(gv)}${h(bv)}` };
}

export function ColorSwatch({ varName, step, label, semanticTag, onCopy, className, darkTextMax = 7 }: {varName: string;step: string;label: string;semanticTag?: string;onCopy: (v: string) => void;className?: string;darkTextMax?: number;}) {
  const bgRef = useRef<HTMLDivElement>(null);
  const [info, setInfo] = useState<{ratio: string;hex: string;}>({ ratio: "", hex: "" });
  const stepNum = parseInt(step);
  useEffect(() => {
    if (!bgRef.current) return;
    requestAnimationFrame(() => {
      if (bgRef.current) setInfo(computeSwatchInfo(bgRef.current, stepNum));
    });
  }, [varName, stepNum]);

  const textDark = parseInt(step) <= darkTextMax;
  const base = textDark ? "text-black" : "text-white";
  const muted = textDark ? "text-black/50" : "text-white/55";

  return (
    <div
      className={["group relative flex-1 cursor-pointer", className ?? ""].join(" ")}
      onClick={() => navigator.clipboard.writeText(varName).then(() => onCopy(varName))}>
      
      <div
        ref={bgRef}
        className="h-16 w-full"
        style={{ backgroundColor: `var(${varName})` }} />
      
      {/* 常显：色系名 + 语义标签 + 对比度 */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-1.5">
        <div className="flex flex-col gap-0.5">
          <span className={`text-[8px] font-bold leading-tight ${base} whitespace-nowrap overflow-hidden`}>{label} {step}</span>
          {semanticTag &&
          <span className="self-start rounded bg-black/25 px-1 py-px text-[7px] font-semibold text-white leading-tight whitespace-nowrap">
              {semanticTag}
            </span>
          }
        </div>
        {info.ratio &&
        <span className={`self-end text-[7px] font-semibold leading-tight tabular-nums ${muted}`}>{info.ratio}</span>
        }
      </div>
      {/* Hover：HEX + CSS 变量名 */}
      {info.hex &&
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-start gap-px bg-black/60 px-1.5 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <span className="text-[8px] font-semibold text-white leading-tight tabular-nums">{info.hex.toUpperCase()}</span>
          <span className="text-[7px] text-white/70 leading-tight truncate w-full">{varName}</span>
        </div>
      }
    </div>);

}

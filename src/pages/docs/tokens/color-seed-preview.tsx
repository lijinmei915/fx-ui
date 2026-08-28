import { useEffect, useRef, useState, type CSSProperties } from "react"
import { DocSurfaceCard } from "@/components/fx/doc-surface"
import { Input, InputAffix, InputGroup } from "@/components/ui/input"
import { solidForegroundContract } from "@/lib/theme-runtime"

export const PALETTE_STEPS = ["10", "20", "30", "40", "50", "60", "70", "80", "90", "100", "110", "120"] as const;
export const NEUTRAL_STEPS = ["10", "20", "30", "40", "50", "60", "70", "80", "90", "100", "110", "120", "130", "140", "150", "160", "170", "180", "190", "200"] as const;
type SwatchInfo = { ratio: string; hex: string; textDark: boolean };

const HEX_COLOR_PATTERN = /^(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i

function resolveColorToHex(color: string) {
  const probe = document.createElement("span")
  probe.style.backgroundColor = color
  document.body.appendChild(probe)
  const computed = getComputedStyle(probe).backgroundColor
  probe.remove()

  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = 1
  const ctx = canvas.getContext("2d")
  if (!ctx || !computed) return ""
  ctx.fillStyle = computed
  ctx.fillRect(0, 0, 1, 1)
  const [red, green, blue] = ctx.getImageData(0, 0, 1, 1).data
  const toHex = (value: number) => value.toString(16).padStart(2, "0")
  return `#${toHex(red)}${toHex(green)}${toHex(blue)}`.toUpperCase()
}

function toPickerHex(value: string) {
  const hex = value.replace(/^#/, "")
  if (!HEX_COLOR_PATTERN.test(hex)) return "#000000"
  if (hex.length === 3 || hex.length === 4) {
    return `#${hex.slice(0, 3).split("").map((part) => part + part).join("")}`.toUpperCase()
  }
  return `#${hex.slice(0, 6)}`.toUpperCase()
}

export function SeedPreview({ lang }: { lang: "zh" | "en" }) {
  const [input, setInput] = useState("");
  const [previewSeed, setPreviewSeed] = useState("var(--fds-g-color-seed-brand)");
  const [copied, setCopied] = useState<string | null>(null);
  const swatchRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [swatchInfoMap, setSwatchInfoMap] = useState<Record<string, SwatchInfo>>({});

  useEffect(() => {
    const initialHex = resolveColorToHex("var(--fds-g-color-seed-brand)")
    if (!initialHex) return
    setInput(initialHex.slice(1))
    setPreviewSeed(initialHex)
  }, [])

  const trimmedInput = input.trim()
  const inputIsValid = HEX_COLOR_PATTERN.test(trimmedInput)

  useEffect(() => {
    if (inputIsValid) setPreviewSeed(`#${trimmedInput}`)
  }, [inputIsValid, trimmedInput])

  useEffect(() => {
    const timer = setTimeout(() => {
      const map: Record<string, SwatchInfo> = {};
      swatchRefs.current.forEach((el, i) => {
        if (!el) return;
        const step = PALETTE_STEPS[i];
        const info = computeSwatchInfo(el, undefined, Number(step) <= 60);
        if (info.hex) map[step] = info;
      });
      setSwatchInfoMap(map);
    }, 50);
    return () => clearTimeout(timer);
  }, [previewSeed]);

  const handleCopy = (val: string) => {
    navigator.clipboard.writeText(val).then(() => {
      setCopied(val);
      setTimeout(() => setCopied(null), 1200);
    });
  };

  return (
    <DocSurfaceCard
      className="flex flex-col gap-3 p-4"
      style={{ "--fds-g-color-seed-brand": previewSeed } as CSSProperties}>
      <div className="flex items-center gap-3">
        <label className="relative flex h-8 aspect-[6/5] shrink-0 cursor-pointer items-center justify-center rounded-md outline-none focus-within:ring-3 focus-within:ring-ring/50">
          <span className="size-full rounded-sm" style={{ backgroundColor: previewSeed }} aria-hidden="true" />
          <input
            type="color"
            className="absolute inset-0 size-full cursor-pointer opacity-0"
            value={inputIsValid ? toPickerHex(trimmedInput) : toPickerHex(previewSeed)}
            onChange={(event) => setInput(event.target.value.slice(1).toUpperCase())}
            aria-label={lang === "en" ? "Choose brand seed color" : "选择主题种子色"}
          />
        </label>
        <InputGroup size="md" className="flex-1">
          <InputAffix side="start" className="font-mono text-foreground">#</InputAffix>
          <Input
            size="md"
            className="font-mono uppercase"
            value={input}
            onChange={(e) => setInput(e.target.value.replace(/^#/, ""))}
            placeholder="FF8000"
            spellCheck={false}
            aria-invalid={input.length > 0 && !inputIsValid ? true : undefined}
            aria-describedby={input.length > 0 && !inputIsValid ? "brand-seed-format" : undefined}
            aria-label={lang === "en" ? "Brand seed hexadecimal value" : "主题种子色十六进制值"}
          />
        </InputGroup>
      </div>
      {input.length > 0 && !inputIsValid ?
      <p id="brand-seed-format" className="text-xs text-destructive">
          {lang === "en" ? "Enter a valid hexadecimal color." : "请输入有效的十六进制色值。"}
        </p> : null}
      <div className="flex overflow-hidden rounded-md gap-[2px]">
        {PALETTE_STEPS.map((step, i) => {
          const info = swatchInfoMap[step];
          const textDark = info?.textDark ?? i + 1 <= 6;
          const base = textDark ? "text-[color:var(--fds-g-color-neutral-base-200)]" : "text-[color:var(--fds-g-color-neutral-base-10)]";
          const muted = textDark ? "text-[color:var(--fds-g-color-neutral-base-200)]/50" : "text-[color:var(--fds-g-color-neutral-base-10)]/55";
          const hex = info?.hex;
          const varName = `--fds-g-color-brand-base-${step}`;
          return (
            <div
              key={step}
              data-token-step={step}
              ref={(el) => {swatchRefs.current[i] = el;}}
              className="group relative flex-1 cursor-pointer"
              style={{ minHeight: 72, backgroundColor: `var(--fds-g-color-brand-base-${step})` }}
              onClick={() => handleCopy(hex || varName)}
              title={copied === (hex || varName) ? "已复制" : hex || ""}>
              
              <div className={`pointer-events-none absolute inset-0 flex flex-col justify-between p-1.5 ${base}`}>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold leading-tight whitespace-nowrap overflow-hidden">Brand {step}</span>
                </div>
                {info &&
                <span className={`self-end text-[8px] font-semibold leading-tight tabular-nums ${muted}`}>
                    {info.ratio}
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

function readElementColor(bgEl: HTMLElement) {
  const colorStr = getComputedStyle(bgEl).backgroundColor;
  if (!colorStr || colorStr === "rgba(0, 0, 0, 0)") return null;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = colorStr;
  ctx.fillRect(0, 0, 1, 1);
  return [...ctx.getImageData(0, 0, 1, 1).data];
}

function readVariableColor(referenceEl: HTMLElement, variable: string) {
  const probe = referenceEl.ownerDocument.createElement("i");
  probe.style.cssText = `position:absolute;visibility:hidden;pointer-events:none;background:var(${variable})`;
  referenceEl.ownerDocument.body.appendChild(probe);
  const color = readElementColor(probe);
  probe.remove();
  return color;
}

function contrastRatio([rv, gv, bv]: number[], [tr, tg, tb]: number[]) {
  const lin = (v: number) => {const s = v / 255;return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);};
  const luminance = (red: number, green: number, blue: number) => 0.2126 * lin(red) + 0.7152 * lin(green) + 0.0722 * lin(blue);
  const first = luminance(rv, gv, bv);
  const second = luminance(tr, tg, tb);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

export function computeSwatchInfo(bgEl: HTMLElement, foregroundGroup?: HTMLElement[], fixedTextDark?: boolean): SwatchInfo {
  const background = readElementColor(bgEl);
  const preferred = readVariableColor(bgEl, solidForegroundContract.preferred);
  const fallback = readVariableColor(bgEl, solidForegroundContract.fallback);
  if (!background || !preferred || !fallback) return { ratio: "", hex: "", textDark: false };

  const candidates = foregroundGroup?.length ? foregroundGroup : [bgEl];
  const usePreferred = fixedTextDark === undefined
    ? candidates.every((element) => {
        const candidate = readElementColor(element);
        return candidate && candidate[3] === 255 && contrastRatio(preferred, candidate) >= solidForegroundContract.minimumContrast;
      })
    : !fixedTextDark;
  const foreground = usePreferred ? preferred : fallback;
  const ratio = contrastRatio(foreground, background);
  const [rv, gv, bv] = background;
  const h = (v: number) => v.toString(16).padStart(2, "0");
  return { ratio: `${ratio.toFixed(1)}:1`, hex: `#${h(rv)}${h(gv)}${h(bv)}`, textDark: !usePreferred };
}

export function ColorSwatch({ varName, step, label, semanticTag, onCopy, className, foregroundGroup, fixedTextDark }: {varName: string;step: string;label: string;semanticTag?: string;onCopy: (v: string) => void;className?: string;foregroundGroup?: string[];fixedTextDark?: boolean;}) {
  const bgRef = useRef<HTMLDivElement>(null);
  const [info, setInfo] = useState<SwatchInfo>({ ratio: "", hex: "", textDark: false });
  const foregroundGroupKey = foregroundGroup?.join("|");
  useEffect(() => {
    if (!bgRef.current) return;
    requestAnimationFrame(() => {
      if (!bgRef.current) return;
      const groupElements = foregroundGroup?.map((variable) => {
        const probe = bgRef.current!.ownerDocument.createElement("i");
        probe.style.cssText = `position:absolute;visibility:hidden;pointer-events:none;background:var(${variable})`;
        bgRef.current!.ownerDocument.body.appendChild(probe);
        return probe;
      });
      setInfo(computeSwatchInfo(bgRef.current, groupElements, fixedTextDark));
      groupElements?.forEach((element) => element.remove());
    });
  }, [fixedTextDark, foregroundGroupKey, varName]);

  const textDark = fixedTextDark ?? (info.hex ? info.textDark : parseInt(step) <= 60);
  const base = textDark ? "text-[color:var(--fds-g-color-neutral-base-200)]" : "text-[color:var(--fds-g-color-neutral-base-10)]";
  const muted = textDark ? "text-[color:var(--fds-g-color-neutral-base-200)]/50" : "text-[color:var(--fds-g-color-neutral-base-10)]/55";

  return (
    <div
      data-swatch-foreground={info.hex ? (textDark ? "fallback" : "preferred") : undefined}
      data-token-color={varName}
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

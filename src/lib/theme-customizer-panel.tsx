import { useRef, useState, type Dispatch, type SetStateAction } from "react"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { ThemePanelHeading, ThemeChoiceButton, ThemeChoiceSection } from "@/lib/theme-choice-controls"
import { PlusIcon, PaletteIcon, RadiusIcon, SettingsIcon, ShadowIcon, SunIcon, TextSizeIcon, TypographyIcon, BoltIcon, MoonIcon, XIcon } from "@/lib/icons"

export type ThemeMode = "light" | "dark"
export type ThemeColor = "indigo" | "violet" | "emerald" | "rose" | "amber" | "sky" | "slate" | "custom"
export type ThemeFont = "sans" | "serif" | "mono" | "geometric"
export type ThemeTextScale = "compact" | "standard" | "spacious"
export type ThemeRadius = "none" | "sm" | "md" | "lg" | "full"
export type ThemeShadowLevel = "none" | "low" | "medium" | "high"
export type ThemeAnimationStyle = "none" | "fast" | "smooth" | "playful"

export type ThemeCustomizerConfig = {
  mode: ThemeMode
  primaryColor: ThemeColor
  customColorHex: string
  customColorIndex: number
  customColors: string[]
  fontFamily: ThemeFont
  textScale: ThemeTextScale
  borderRadius: ThemeRadius
  shadowLevel: ThemeShadowLevel
  animationStyle: ThemeAnimationStyle
}

type ThemeChoice<T extends string> = { id: T; label: string; desc: string }
type ThemeColorChoice = { id: ThemeColor; label: string; value: string }
type ThemeFontChoice = { id: ThemeFont; label: string }

export type ThemeCustomizerPanelProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  config: ThemeCustomizerConfig
  onConfigChange: Dispatch<SetStateAction<ThemeCustomizerConfig>>
  lang: "zh" | "en"
  defaultCustomColorHex: string
  themeColorOptions: ThemeColorChoice[]
  themeFontOptions: ThemeFontChoice[]
  themeFontPreviewText: Record<"zh" | "en", string>
  themeTextScaleOptions: ThemeChoice<ThemeTextScale>[]
  themeRadiusOptions: { id: ThemeRadius; label: string }[]
  themeShadowOptions: ThemeChoice<ThemeShadowLevel>[]
  themeAnimationOptions: ThemeChoice<ThemeAnimationStyle>[]
  getThemeFontValue: (fontFamily: ThemeFont, lang: "zh" | "en") => string
  getActiveCustomColor: (config: ThemeCustomizerConfig) => string
}

function isHexColor(value: string) {
  return /^#[0-9a-fA-F]{6}$/.test(value)
}

function updateThemeConfig<K extends keyof ThemeCustomizerConfig>(config: ThemeCustomizerConfig, key: K, value: ThemeCustomizerConfig[K]) {
  return { ...config, [key]: value }
}

export function ThemeCustomizerPanel({
  open,
  onOpenChange,
  config,
  onConfigChange,
  lang,
  defaultCustomColorHex,
  themeColorOptions,
  themeFontOptions,
  themeFontPreviewText,
  themeTextScaleOptions,
  themeRadiusOptions,
  themeShadowOptions,
  themeAnimationOptions,
  getThemeFontValue,
  getActiveCustomColor,

}: ThemeCustomizerPanelProps) {
  const colorInputRef = useRef<HTMLInputElement>(null);
  const lastColorPickRef = useRef<string | null>(null);
  const pendingColorPickRef = useRef<string | null>(null);
  const pickerInitialColorRef = useRef<string | null>(null);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const activeCustomColor = getActiveCustomColor(config);
  const isPickingCustomColor = isColorPickerOpen;

  const setConfigValue = <K extends keyof ThemeCustomizerConfig,>(key: K, value: ThemeCustomizerConfig[K]) => {
    onConfigChange((current) => updateThemeConfig(current, key, value));
  };

  const commitCustomColor = (value: string) => {
    if (!isHexColor(value)) return;

    onConfigChange((current) => {
      const existingIndex = current.customColors.findIndex((color) => color.toLowerCase() === value.toLowerCase());

      if (existingIndex >= 0) {
        return {
          ...current,
          primaryColor: "custom",
          customColorHex: current.customColors[existingIndex] ?? value,
          customColorIndex: existingIndex
        };
      }

      const customColors = [...current.customColors, value];
      return {
        ...current,
        primaryColor: "custom",
        customColorHex: value,
        customColorIndex: customColors.length - 1,
        customColors
      };
    });
  };

  const selectCustomColor = (value: string, index: number) => {
    onConfigChange((current) => ({
      ...current,
      primaryColor: "custom",
      customColorHex: value,
      customColorIndex: index
    }));
  };

  const removeCustomColor = (index: number) => {
    onConfigChange((current) => {
      const customColors = current.customColors.filter((_, colorIndex) => colorIndex !== index);
      const wasSelected = current.primaryColor === "custom" && current.customColorIndex === index;
      const nextIndex = Math.min(current.customColorIndex > index ? current.customColorIndex - 1 : current.customColorIndex, Math.max(customColors.length - 1, 0));
      const nextCustom = customColors[nextIndex] ?? defaultCustomColorHex;
      return {
        ...current,
        primaryColor: wasSelected && customColors.length === 0 ? "amber" : current.primaryColor,
        customColorHex: nextCustom,
        customColorIndex: nextIndex,
        customColors
      };
    });
  };

  const handleCustomColorInput = (value: string) => {
    if (!isHexColor(value)) return;

    const isInitialEcho =
      isColorPickerOpen &&
      pendingColorPickRef.current === null &&
      value.toLowerCase() === (pickerInitialColorRef.current ?? "").toLowerCase();

    if (isInitialEcho || lastColorPickRef.current === value) return;

    pendingColorPickRef.current = value;
    lastColorPickRef.current = value;
    onConfigChange((current) => ({
      ...current,
      primaryColor: "custom",
      customColorHex: value
    }));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal={false}>
      <SheetContent
        side="right"
        className="fx-theme-panel-static w-80 gap-0 sm:max-w-80"
        overlayClassName="pointer-events-none bg-transparent backdrop-blur-none supports-backdrop-filter:backdrop-blur-none">
        
        <SheetHeader className="p-[calc(var(--fds-g-spacing-panel-padding)*2)] pb-0">
          <div className="flex items-center gap-(--fds-g-spacing-control-gap)">
            <SettingsIcon className="size-5 text-muted-foreground" />
            <SheetTitle className="text-lg font-medium">{lang === "en" ? "Theme Customizer" : "主题定制"}</SheetTitle>
          </div>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-[calc(var(--fds-g-spacing-panel-gap)*2)] overflow-y-auto p-[calc(var(--fds-g-spacing-panel-padding)*2)] pb-12">
          <section className="flex flex-col gap-(--fds-g-spacing-control-gap)">
            <ThemePanelHeading icon={<SunIcon />} title={lang === "en" ? "Appearance" : "外观模式"} />
            <div className="flex h-8 gap-0.5 rounded-lg bg-muted p-0.5">
              <button
                type="button"
                aria-pressed={config.mode === "light"}
                onClick={() => setConfigValue("mode", "light")}
                className={cn(
                  "flex h-full flex-1 items-center justify-center gap-(--fds-g-spacing-control-gap-tight) rounded-md px-(--fds-g-spacing-control-inline-xs) text-sm font-medium outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                  config.mode === "light" ? "bg-card text-foreground shadow-l1" : "text-muted-foreground hover:text-foreground dark:text-foreground/70 dark:hover:text-foreground"
                )}>
                
                <SunIcon className="size-3.5" />
                {lang === "en" ? "Light" : "浅色"}
              </button>
              <button
                type="button"
                aria-pressed={config.mode === "dark"}
                onClick={() => setConfigValue("mode", "dark")}
                className={cn(
                  "flex h-full flex-1 items-center justify-center gap-(--fds-g-spacing-control-gap-tight) rounded-md px-(--fds-g-spacing-control-inline-xs) text-sm font-medium outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                  config.mode === "dark" ? "bg-card text-foreground shadow-l1" : "text-muted-foreground hover:text-foreground dark:text-foreground/70 dark:hover:text-foreground"
                )}>
                
                <MoonIcon className="size-3.5" />
                {lang === "en" ? "Dark" : "深色"}
              </button>
            </div>
          </section>

          <section className="flex flex-col gap-(--fds-g-spacing-control-gap)">
            <ThemePanelHeading icon={<PaletteIcon />} title={lang === "en" ? "Brand Color" : "主色调"} />
            <div className="flex flex-wrap items-center gap-(--fds-g-spacing-control-gap)">
              {themeColorOptions.map((item) =>
              <button
                key={item.id}
                type="button"
                aria-label={item.label}
                aria-pressed={config.primaryColor === item.id}
                onClick={() => setConfigValue("primaryColor", item.id)}
                className={cn(
                  "flex size-(--fds-g-sizing-control-icon-sm) items-center justify-center rounded-full border border-border-subtle outline-none transition-all hover:scale-105 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                  config.primaryColor === item.id && "scale-110 ring-2 ring-foreground ring-offset-2 ring-offset-background"
                )}
                style={{ backgroundColor: item.value }}>
                
                  {config.primaryColor === item.id ? <span className="size-2 rounded-full bg-primary-foreground" /> : null}
                </button>
              )}
              <Separator orientation="vertical" className="mx-1 h-(--fds-g-sizing-control-icon-sm)" />
              {config.customColors.map((color, index) => {
                const selected =
                !isPickingCustomColor &&
                config.primaryColor === "custom" &&
                config.customColorIndex === index;

                return (
                  <div key={`${color}-${index}`} className="group relative size-(--fds-g-sizing-control-icon-sm) shrink-0">
                    <button
                      type="button"
                      aria-label={lang === "en" ? `Use custom color ${color}` : `使用自定义颜色 ${color}`}
                      aria-pressed={selected}
                      onClick={() => selectCustomColor(color, index)}
                      className={cn(
                        "flex size-(--fds-g-sizing-control-icon-sm) items-center justify-center rounded-full border border-border-subtle outline-none transition-all hover:scale-105 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                        selected && "scale-110 ring-2 ring-foreground ring-offset-2 ring-offset-background"
                      )}
                      style={{ backgroundColor: color }}>
                      
                      {selected ? <span className="size-2 rounded-full bg-primary-foreground" /> : null}
                    </button>
                    <button
                      type="button"
                      aria-label={lang === "en" ? `Remove custom color ${color}` : `删除自定义颜色 ${color}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        removeCustomColor(index);
                      }}
                      className="absolute -right-1 -top-1 hidden size-4 items-center justify-center rounded-full bg-foreground text-background shadow-l1 outline-none transition-colors hover:bg-destructive hover:text-destructive-foreground focus-visible:flex group-hover:flex">
                      
                      <XIcon className="size-3" />
                    </button>
                  </div>);

              })}
              <label
                className={cn(
                  "relative flex size-(--fds-g-sizing-control-icon-sm) shrink-0 cursor-pointer items-center justify-center rounded-full border border-border/55 bg-muted/18 text-muted-foreground/60 outline-none transition-[border-color,background-color,color,box-shadow,transform,opacity] duration-220 ease-out hover:border-border-strong hover:bg-muted/28 hover:text-foreground/80 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
                  isPickingCustomColor && "border-border-strong bg-muted/28 text-foreground/80"
                )}>
                
                <span
                  className={cn(
                    "absolute inset-0 rounded-full transition-[box-shadow,transform,opacity] duration-200 ease-out",
                    isPickingCustomColor && "opacity-0"
                  )} />
                <PlusIcon
                  className={cn(
                    "relative z-10 size-3.5 transition-[opacity,transform,color] duration-200 ease-out",
                    isPickingCustomColor ? "scale-100 opacity-100" : "scale-95 opacity-100"
                  )} />
                <input
                  ref={colorInputRef}
                  type="color"
                  value={isHexColor(activeCustomColor) ? activeCustomColor : defaultCustomColorHex}
                  onClick={() => {
                    setIsColorPickerOpen(true);
                    lastColorPickRef.current = null;
                    pendingColorPickRef.current = null;
                    pickerInitialColorRef.current = activeCustomColor;
                  }}
                  onInput={(event) => handleCustomColorInput(event.currentTarget.value)}
                  onChange={(event) => handleCustomColorInput(event.currentTarget.value)}
                  onBlur={() => {
                    const nextColor = pendingColorPickRef.current;
                    setIsColorPickerOpen(false);
                    pendingColorPickRef.current = null;
                    pickerInitialColorRef.current = null;
                    if (nextColor && isHexColor(nextColor)) {
                      commitCustomColor(nextColor);
                    }
                  }}
                  className="absolute inset-0 size-(--fds-g-sizing-control-icon-sm) cursor-pointer rounded-full opacity-0"
                  aria-label={lang === "en" ? "Add custom color" : "添加自定义颜色"} />
                
              </label>
            </div>
          </section>

          <section className="flex flex-col gap-(--fds-g-spacing-control-gap)">
            <ThemePanelHeading icon={<TypographyIcon />} title={lang === "en" ? "Typography" : "字体主题"} />
            <div className="grid grid-cols-2 gap-(--fds-g-spacing-control-gap)">
              {themeFontOptions.map((item) =>
              <ThemeChoiceButton
                key={item.id}
                selected={config.fontFamily === item.id}
                label={item.label}
                desc={themeFontPreviewText[lang]}
                optionId={item.id}
                style={{ fontFamily: getThemeFontValue(item.id, lang) }}
                onClick={() => setConfigValue("fontFamily", item.id)} />

              )}
            </div>
          </section>

          <ThemeChoiceSection
            icon={<TextSizeIcon />}
            title={lang === "en" ? "Text Scale" : "文字比例"}
            options={themeTextScaleOptions}
            value={config.textScale}
            columns={3}
            onChange={(value) => setConfigValue("textScale", value)} />
          

          <ThemeChoiceSection
            icon={<BoltIcon />}
            title={lang === "en" ? "Animation Style" : "动效风格"}
            options={themeAnimationOptions}
            value={config.animationStyle}
            columns={4}
            onChange={(value) => setConfigValue("animationStyle", value)} />
          

          <section className="flex flex-col gap-3">
            <ThemePanelHeading icon={<RadiusIcon />} title={lang === "en" ? "Border Radius" : "圆角大小"} />
            <div className="grid grid-cols-5 gap-2">
              {themeRadiusOptions.map((item) =>
              <button
                key={item.id}
                type="button"
                aria-pressed={config.borderRadius === item.id}
                onClick={() => setConfigValue("borderRadius", item.id)}
                className={cn(
                  "flex h-(--fds-g-sizing-control-block-sm) items-center justify-center rounded-lg border px-(--fds-g-spacing-control-inline-xs) text-xs font-medium outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                  config.borderRadius === item.id ? "border-foreground bg-muted text-foreground" : "border-border bg-surface text-muted-foreground hover:border-border-strong hover:text-foreground"
                )}>
                
                  {item.label}
                </button>
              )}
            </div>
          </section>

          <ThemeChoiceSection
            icon={<ShadowIcon />}
            title={lang === "en" ? "Shadow Level" : "阴影强度"}
            options={themeShadowOptions}
            value={config.shadowLevel}
            columns={4}
            onChange={(value) => setConfigValue("shadowLevel", value)} />
          
        </div>
      </SheetContent>
    </Sheet>);

}

import type { CSSProperties } from "react"

type Lang = "zh" | "en";
type ThemeMode = "light" | "dark";
type ThemeColor = "indigo" | "violet" | "emerald" | "rose" | "amber" | "sky" | "slate" | "custom";
type ThemeFont = "sans" | "serif" | "mono" | "geometric";
type ThemeTextScale = "compact" | "standard" | "spacious";
type ThemeRadius = "none" | "sm" | "md" | "lg" | "full";
type ThemeShadowLevel = "none" | "low" | "medium" | "high";
type ThemeAnimationStyle = "none" | "fast" | "smooth" | "playful";

export type ThemeConfig = {
  mode: ThemeMode;
  primaryColor: ThemeColor;
  customColorHex: string;
  customColorIndex: number;
  customColors: string[];
  fontFamily: ThemeFont;
  textScale: ThemeTextScale;
  borderRadius: ThemeRadius;
  shadowLevel: ThemeShadowLevel;
  animationStyle: ThemeAnimationStyle;
};

type StoredThemeConfig = Partial<Omit<ThemeConfig, "shadowLevel">> & {
  shadowLevel?: ThemeShadowLevel | "retro" | string;
};

export const defaultThemeConfig: ThemeConfig = {
  mode: "light",
  primaryColor: "amber",
  customColorHex: "#3b82f6",
  customColorIndex: 0,
  customColors: ["#3b82f6"],
  fontFamily: "sans",
  textScale: "standard",
  borderRadius: "md",
  shadowLevel: "medium",
  animationStyle: "smooth"
};

export const themeColorOptions: {id: ThemeColor;label: string;value: string;}[] = [
{ id: "indigo", label: "Indigo", value: "#4f46e5" },
{ id: "violet", label: "Violet", value: "#7c3aed" },
{ id: "emerald", label: "Emerald", value: "#059669" },
{ id: "rose", label: "Rose", value: "#e11d48" },
{ id: "amber", label: "Amber", value: "#FF8000" },
{ id: "sky", label: "Sky", value: "#0284c7" },
{ id: "slate", label: "Slate", value: "#1f2937" }];


const themeColorValues: Record<ThemeColor, string> = {
  indigo: "#4f46e5",
  violet: "#7c3aed",
  emerald: "#059669",
  rose: "#e11d48",
  amber: "#FF8000",
  sky: "#0284c7",
  slate: "#1f2937",
  custom: defaultThemeConfig.customColorHex
};

const themeRadiusValues: Record<ThemeRadius, string> = {
  none: "0rem",
  sm: "0.375rem",
  md: "0.625rem",
  lg: "0.875rem",
  full: "1.5rem"
};

const themeEnglishFontValues: Record<ThemeFont, string> = {
  sans: "\"Inter Variable\", \"Helvetica Neue\", Arial, sans-serif",
  serif: "Georgia, \"Times New Roman\", serif",
  mono: "\"SFMono-Regular\", Consolas, \"Liberation Mono\", monospace",
  geometric: "\"Geist Variable\", \"Inter Variable\", \"Helvetica Neue\", Arial, sans-serif"
};

const themeChineseFontValues: Record<ThemeFont, string> = {
  sans: "\"Inter Variable\", \"PingFang SC\", \"苹方\", \"Microsoft YaHei\", \"微软雅黑\", \"Noto Sans SC\", Arial, sans-serif",
  serif: "\"Noto Serif SC\", \"Songti SC\", STSong, SimSun, serif",
  mono: "\"SFMono-Regular\", \"Cascadia Mono\", Consolas, \"Noto Sans SC\", monospace",
  geometric: "\"Geist Variable\", \"HarmonyOS Sans SC\", \"MiSans\", \"PingFang SC\", \"Microsoft YaHei\", \"Noto Sans SC\", sans-serif"
};

const themeTextScaleValues: Record<ThemeTextScale, Record<string, string>> = {
  compact: {
    "--fx-text-xs": "12px",
    "--fx-text-xs--line-height": "18px",
    "--fx-text-sm": "12px",
    "--fx-text-sm--line-height": "18px",
    "--fx-text-base": "14px",
    "--fx-text-base--line-height": "20px",
    "--fx-text-lg": "16px",
    "--fx-text-lg--line-height": "24px",
    "--fx-text-xl": "18px",
    "--fx-text-xl--line-height": "28px",
    "--fx-text-2xl": "20px",
    "--fx-text-2xl--line-height": "28px",
    "--fx-text-3xl": "24px",
    "--fx-text-3xl--line-height": "32px",
    "--fx-text-4xl": "30px",
    "--fx-text-4xl--line-height": "36px",
    "--fx-control-xs-height": "22px",
    "--fx-control-sm-height": "26px",
    "--fx-control-md-height": "30px",
    "--fx-control-lg-height": "34px",
    "--fx-control-icon-xs": "22px",
    "--fx-control-icon-sm": "26px",
    "--fx-control-icon-md": "30px",
    "--fx-control-icon-lg": "34px",
    "--fx-control-px-xs": "0.4375rem",
    "--fx-control-px-sm": "0.5625rem",
    "--fx-control-px-md": "0.6875rem",
    "--fx-control-px-lg": "0.875rem",
    "--fx-control-gap-tight": "0.1875rem",
    "--fx-control-gap": "0.3125rem",
    "--fx-panel-gap": "0.625rem",
    "--fx-panel-padding": "0.625rem",
    "--fx-menu-text": "14px",
    "--fx-menu-text--line-height": "20px",
    "--fx-sidebar-item-height": "28px",
    "--fx-sidebar-item-height-sm": "24px",
    "--fx-topbar-height": "48px",
    "--fx-topbar-search-height": "30px"
  },
  standard: {
    "--fx-text-xs": "12px",
    "--fx-text-xs--line-height": "18px",
    "--fx-text-sm": "14px",
    "--fx-text-sm--line-height": "20px",
    "--fx-text-base": "16px",
    "--fx-text-base--line-height": "24px",
    "--fx-text-lg": "18px",
    "--fx-text-lg--line-height": "28px",
    "--fx-text-xl": "20px",
    "--fx-text-xl--line-height": "30px",
    "--fx-text-2xl": "24px",
    "--fx-text-2xl--line-height": "32px",
    "--fx-text-3xl": "30px",
    "--fx-text-3xl--line-height": "38px",
    "--fx-text-4xl": "36px",
    "--fx-text-4xl--line-height": "44px",
    "--fx-control-xs-height": "24px",
    "--fx-control-sm-height": "28px",
    "--fx-control-md-height": "32px",
    "--fx-control-lg-height": "36px",
    "--fx-control-icon-xs": "24px",
    "--fx-control-icon-sm": "28px",
    "--fx-control-icon-md": "32px",
    "--fx-control-icon-lg": "36px",
    "--fx-control-px-xs": "0.5rem",
    "--fx-control-px-sm": "0.625rem",
    "--fx-control-px-md": "0.75rem",
    "--fx-control-px-lg": "1rem",
    "--fx-control-gap-tight": "0.25rem",
    "--fx-control-gap": "0.375rem",
    "--fx-panel-gap": "0.75rem",
    "--fx-panel-padding": "0.75rem",
    "--fx-menu-text": "14px",
    "--fx-menu-text--line-height": "20px",
    "--fx-sidebar-item-height": "32px",
    "--fx-sidebar-item-height-sm": "28px",
    "--fx-topbar-height": "56px",
    "--fx-topbar-search-height": "32px"
  },
  spacious: {
    "--fx-text-xs": "14px",
    "--fx-text-xs--line-height": "20px",
    "--fx-text-sm": "16px",
    "--fx-text-sm--line-height": "24px",
    "--fx-text-base": "18px",
    "--fx-text-base--line-height": "28px",
    "--fx-text-lg": "20px",
    "--fx-text-lg--line-height": "30px",
    "--fx-text-xl": "22px",
    "--fx-text-xl--line-height": "32px",
    "--fx-text-2xl": "28px",
    "--fx-text-2xl--line-height": "36px",
    "--fx-text-3xl": "36px",
    "--fx-text-3xl--line-height": "44px",
    "--fx-text-4xl": "44px",
    "--fx-text-4xl--line-height": "52px",
    "--fx-control-xs-height": "26px",
    "--fx-control-sm-height": "30px",
    "--fx-control-md-height": "36px",
    "--fx-control-lg-height": "40px",
    "--fx-control-icon-xs": "26px",
    "--fx-control-icon-sm": "30px",
    "--fx-control-icon-md": "36px",
    "--fx-control-icon-lg": "40px",
    "--fx-control-px-xs": "0.625rem",
    "--fx-control-px-sm": "0.75rem",
    "--fx-control-px-md": "0.875rem",
    "--fx-control-px-lg": "1.125rem",
    "--fx-control-gap-tight": "0.3125rem",
    "--fx-control-gap": "0.5rem",
    "--fx-panel-gap": "0.875rem",
    "--fx-panel-padding": "0.875rem",
    "--fx-menu-text": "16px",
    "--fx-menu-text--line-height": "24px",
    "--fx-sidebar-item-height": "36px",
    "--fx-sidebar-item-height-sm": "32px",
    "--fx-topbar-height": "64px",
    "--fx-topbar-search-height": "36px"
  }
};

const themeShadowValues: Record<ThemeShadowLevel, Record<string, string>> = {
  none: {
    "--fx-shadow-color": "transparent",
    "--fx-shadow-color-soft": "transparent",
    "--fx-shadow-color-faint": "transparent",
    "--fx-shadow-l1": "none",
    "--fx-shadow-l2": "none",
    "--fx-shadow-l3": "none",
    "--fx-shadow-l1-up": "none"
  },
  low: {
    "--fx-shadow-color": "oklch(from var(--fx-neutrals-20) l c h / 0.08)",
    "--fx-shadow-color-soft": "oklch(from var(--fx-neutrals-20) l c h / 0.05)",
    "--fx-shadow-color-faint": "oklch(from var(--fx-neutrals-20) l c h / 0.03)",
    "--fx-shadow-l1": "0px 2px 6px -2px var(--fx-shadow-color), 0px 4px 10px -4px var(--fx-shadow-color-soft)",
    "--fx-shadow-l2": "0px 4px 12px -4px var(--fx-shadow-color), 0px 8px 20px -2px var(--fx-shadow-color-soft), 0px 12px 28px 0px var(--fx-shadow-color-faint)",
    "--fx-shadow-l3": "0px 6px 16px -8px var(--fx-shadow-color), 0px 9px 28px 0px var(--fx-shadow-color-soft), 0px 12px 48px 16px var(--fx-shadow-color-faint)",
    "--fx-shadow-l1-up": "0px -2px 6px -2px var(--fx-shadow-color), 0px -4px 10px -4px var(--fx-shadow-color-soft)"
  },
  medium: {
    "--fx-shadow-color": "oklch(from var(--fx-neutrals-20) l c h / 0.18)",
    "--fx-shadow-color-soft": "oklch(from var(--fx-neutrals-20) l c h / 0.10)",
    "--fx-shadow-color-faint": "oklch(from var(--fx-neutrals-20) l c h / 0.05)",
    "--fx-shadow-l1": "0px 2px 6px -2px var(--fx-shadow-color), 0px 4px 10px -4px var(--fx-shadow-color-soft)",
    "--fx-shadow-l2": "0px 4px 12px -4px var(--fx-shadow-color), 0px 8px 20px -2px var(--fx-shadow-color-soft), 0px 12px 28px 0px var(--fx-shadow-color-faint)",
    "--fx-shadow-l3": "0px 6px 16px -8px var(--fx-shadow-color), 0px 9px 28px 0px var(--fx-shadow-color-soft), 0px 12px 48px 16px var(--fx-shadow-color-faint)",
    "--fx-shadow-l1-up": "0px -2px 6px -2px var(--fx-shadow-color), 0px -4px 10px -4px var(--fx-shadow-color-soft)"
  },
  high: {
    "--fx-shadow-color": "oklch(from var(--fx-neutrals-20) l c h / 0.22)",
    "--fx-shadow-color-soft": "oklch(from var(--fx-neutrals-20) l c h / 0.12)",
    "--fx-shadow-color-faint": "oklch(from var(--fx-neutrals-20) l c h / 0.06)",
    "--fx-shadow-l1": "0px 2px 6px -2px var(--fx-shadow-color), 0px 4px 10px -4px var(--fx-shadow-color-soft)",
    "--fx-shadow-l2": "0px 4px 12px -4px var(--fx-shadow-color), 0px 8px 20px -2px var(--fx-shadow-color-soft), 0px 12px 28px 0px var(--fx-shadow-color-faint)",
    "--fx-shadow-l3": "0px 6px 16px -8px var(--fx-shadow-color), 0px 9px 28px 0px var(--fx-shadow-color-soft), 0px 12px 48px 16px var(--fx-shadow-color-faint)",
    "--fx-shadow-l1-up": "0px -2px 6px -2px var(--fx-shadow-color), 0px -4px 10px -4px var(--fx-shadow-color-soft)"
  }
};

const themeAnimationDurations: Record<ThemeAnimationStyle, string> = {
  none: "0ms",
  fast: "100ms",
  smooth: "200ms",
  playful: "320ms"
};

export const themeFontOptions: {id: ThemeFont;label: string;}[] = [
{ id: "sans", label: "系统默认" },
{ id: "serif", label: "书面雅致" },
{ id: "mono", label: "代码极客" },
{ id: "geometric", label: "现代几何" }];

export const themeFontPreviewText: Record<Lang, string> = {
  zh: "中文 Aa 123",
  en: "Abc 123"
};


export const themeTextScaleOptions: {id: ThemeTextScale;label: string;desc: string;}[] = [
{ id: "compact", label: "紧凑", desc: "12px 基准" },
{ id: "standard", label: "标准", desc: "14px 基准" },
{ id: "spacious", label: "宽松", desc: "16px 基准" }];


export const themeRadiusOptions: {id: ThemeRadius;label: string;}[] = [
{ id: "none", label: "无" },
{ id: "sm", label: "小" },
{ id: "md", label: "中" },
{ id: "lg", label: "大" },
{ id: "full", label: "全圆" }];


export const themeShadowOptions: {id: ThemeShadowLevel;label: string;desc: string;}[] = [
{ id: "none", label: "无", desc: "平面" },
{ id: "low", label: "低", desc: "贴面" },
{ id: "medium", label: "中", desc: "浮起" },
{ id: "high", label: "高", desc: "悬浮" }];


export const themeAnimationOptions: {id: ThemeAnimationStyle;label: string;desc: string;}[] = [
{ id: "none", label: "无动效", desc: "极速" },
{ id: "fast", label: "快速", desc: "利落" },
{ id: "smooth", label: "平滑", desc: "经典" },
{ id: "playful", label: "弹性", desc: "灵动" }];


export const uiText = {
  zh: {
    languageZh: "中文",
    languageEn: "英文",
    search: "搜索文档",
    copyPage: "复制当前页",
    moreActions: "更多页面操作",
    viewMarkdown: "Markdown",
    viewPage: "页面",
    markdownLead: "这是当前页面对应的 Markdown 真相源，后续可以直接给前端工程师、v0 或其他 AI 作为上下文消费。",
    toc: "本页目录"
  },
  en: {
    languageZh: "Chinese",
    languageEn: "English",
    search: "Search components, Blocks, Tokens...",
    copyPage: "Copy page",
    moreActions: "More page actions",
    viewMarkdown: "Markdown",
    viewPage: "Page",
    markdownLead: "This is the Markdown source for the current page. It can be used as context by frontend engineers, v0, or other AI tools.",
    toc: "On this page"
  }
};

export function getLabel(item: {label: string;labelEn?: string;}, lang: Lang) {
  return lang === "en" && item.labelEn ? item.labelEn : item.label;
}

function isHexColor(value: string) {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

export function normalizeThemeConfig(value: string | null): ThemeConfig {
  if (!value) return defaultThemeConfig;

  try {
    const parsed = JSON.parse(value) as StoredThemeConfig;
    const { borderWidth: _legacyBorderWidth, ...stored } = parsed as StoredThemeConfig & { borderWidth?: unknown };
    const customColors = Array.isArray(parsed.customColors) ?
    parsed.customColors.filter(isHexColor) :
    [];
    const legacyCustomColor = isHexColor(parsed.customColorHex ?? "") ? parsed.customColorHex! : defaultThemeConfig.customColorHex;
    const normalizedCustomColors = customColors.length > 0 ? customColors : [legacyCustomColor];
    const customColorIndex = Math.min(Math.max(parsed.customColorIndex ?? 0, 0), Math.max(normalizedCustomColors.length - 1, 0));
    const selectedCustomColor = normalizedCustomColors[customColorIndex] ?? legacyCustomColor;

    return {
      ...defaultThemeConfig,
      ...stored,
      customColorHex: selectedCustomColor,
      customColorIndex,
      customColors: normalizedCustomColors,
      shadowLevel: parsed.shadowLevel === "retro" ? "high" : (parsed.shadowLevel as ThemeShadowLevel | undefined) ?? defaultThemeConfig.shadowLevel
    };
  } catch {
    return defaultThemeConfig;
  }
}

export function getThemeFontValue(fontFamily: ThemeFont, lang: Lang) {
  return lang === "zh" ? themeChineseFontValues[fontFamily] : themeEnglishFontValues[fontFamily];
}

export function getActiveCustomColor(config: ThemeConfig) {
  return isHexColor(config.customColorHex) ?
  config.customColorHex :
  config.customColors[config.customColorIndex] ?? defaultThemeConfig.customColorHex;
}

export function getThemeRuntimeStyle(config: ThemeConfig, lang: Lang): CSSProperties {
  const customColor = getActiveCustomColor(config);
  const isCustomBrand = config.primaryColor === "custom" && isHexColor(customColor);
  const brand = isCustomBrand ?
  customColor :
  themeColorValues[config.primaryColor];
  const brandVivid = brand;

  return {
    "--fx-brand": brand,
    "--fx-brand-vivid": brandVivid,
    "--fx-brand-01": `oklch(from var(--fx-brand-vivid) calc(l + (1 - l) * 0.90) calc(c * 0.06) h)`,
    "--fx-brand-02": `oklch(from var(--fx-brand-vivid) calc(l + (1 - l) * 0.84) calc(c * 0.10) h)`,
    "--fx-brand-03": `oklch(from var(--fx-brand-vivid) calc(l + (1 - l) * 0.72) calc(c * 0.18) h)`,
    "--fx-brand-04": `oklch(from var(--fx-brand-vivid) calc(l + (1 - l) * 0.58) calc(c * 0.30) h)`,
    "--fx-brand-05": `oklch(from var(--fx-brand-vivid) calc(l + (1 - l) * 0.43) calc(c * 0.45) h)`,
    "--fx-brand-08": `oklch(from var(--fx-brand-vivid) calc(l + (1 - l) * 0.12) calc(c * 0.94) h)`,
    "--fx-brand-09": "var(--fx-brand-vivid)",
    "--fx-brand-10": `oklch(from var(--fx-brand-vivid) calc(l * 0.92) calc(c * 0.95) h)`,
    "--primary": "var(--fx-brand-09)",
    "--color-primary": "var(--fx-brand-09)",
    "--primary-hover": "var(--fx-primary-hover)",
    "--color-primary-hover": "var(--fx-primary-hover)",
    "--primary-active": "var(--fx-primary-active)",
    "--color-primary-active": "var(--fx-primary-active)",
    "--primary-disabled": "var(--fx-primary-disabled)",
    "--color-primary-disabled": "var(--fx-primary-disabled)",
    "--primary-light": `oklch(from ${brand} 0.97 0.03 h)`,
    "--color-primary-light": `oklch(from ${brand} 0.97 0.03 h)`,
    "--primary-light-hover": `oklch(from ${brand} 0.94 0.05 h)`,
    "--color-primary-light-hover": `oklch(from ${brand} 0.94 0.05 h)`,
    "--primary-light-active": `oklch(from ${brand} 0.9 0.07 h)`,
    "--color-primary-light-active": `oklch(from ${brand} 0.9 0.07 h)`,
    "--ring": `oklch(from ${brand} l c h / 0.4)`,
    "--radius": themeRadiusValues[config.borderRadius],
    "--font-sans": getThemeFontValue(config.fontFamily, lang),
    "--fx-theme-duration": themeAnimationDurations[config.animationStyle],
    ...themeTextScaleValues[config.textScale],
    ...themeShadowValues[config.shadowLevel]
  } as CSSProperties;
}

import type { CSSProperties } from "react"
import themePresetContract from "../../docs/data/theme-presets.manifest.json"
import { deriveSolidForegroundVariables, deriveThemeSeedVariables, type SolidForegroundContract } from "@/lib/theme-derivation"

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

const contractDefaults = themePresetContract.defaults
export const themeContractVersion = themePresetContract.contractVersion
export const solidForegroundContract = themePresetContract.qualityGates.solidForeground as SolidForegroundContract

export const defaultThemeConfig: ThemeConfig = {
  mode: contractDefaults.mode as ThemeMode,
  primaryColor: contractDefaults.primaryColor as ThemeColor,
  customColorHex: contractDefaults.customColorHex,
  customColorIndex: 0,
  customColors: [contractDefaults.customColorHex],
  fontFamily: contractDefaults.fontFamily as ThemeFont,
  textScale: contractDefaults.textScale as ThemeTextScale,
  borderRadius: contractDefaults.borderRadius as ThemeRadius,
  shadowLevel: contractDefaults.shadowLevel as ThemeShadowLevel,
  animationStyle: contractDefaults.animationStyle as ThemeAnimationStyle
};

export const themeColorOptions: {id: ThemeColor;label: string;value: string;}[] =
  themePresetContract.dimensions.primaryColor.options.map((option) => ({
    id: option.id as ThemeColor,
    label: option.label,
    value: `var(${option.foundationRef})`
  }))

const themeColorValues = Object.fromEntries(
  themeColorOptions.map((option) => [option.id, option.value])
) as Record<Exclude<ThemeColor, "custom">, string>

const themeFontOptionsContract = themePresetContract.dimensions.fontFamily.options
const themeRadiusOptionsContract = themePresetContract.dimensions.borderRadius.options
const themeAnimationContract = themePresetContract.dimensions.animationStyle
const themeAnimationOptionsContract = themeAnimationContract.options

function toFoundationValue(reference: string) {
  return `var(${reference})`
}

function findFoundationRef(options: readonly { id: string; foundationRef: string }[], id: string) {
  const option = options.find((item) => item.id === id)
  if (!option) throw new Error(`Unknown governed theme option: ${id}`)
  return toFoundationValue(option.foundationRef)
}

function resolveFoundationProfile(profile: Record<string, string>) {
  return Object.fromEntries(Object.entries(profile).map(([name, reference]) => [name, reference.startsWith("--fds-g-") ? toFoundationValue(reference) : reference]))
}

const themeTextScaleValues = Object.fromEntries(
  Object.entries(themePresetContract.profiles.textScale).map(([id, profile]) => [id, resolveFoundationProfile(profile)])
) as Record<ThemeTextScale, Record<string, string>>

const themeShadowValues = themePresetContract.profiles.shadowLevel as Record<ThemeShadowLevel, Record<string, string>>

export const themeFontOptions: {id: ThemeFont;label: string;}[] =
  themePresetContract.dimensions.fontFamily.options.map((option) => ({ ...option, id: option.id as ThemeFont }))

export const themeFontPreviewText: Record<Lang, string> = {
  zh: "中文 Aa 123",
  en: "Abc 123"
};


export const themeTextScaleOptions: {id: ThemeTextScale;label: string;desc: string;}[] =
  themePresetContract.dimensions.textScale.options.map((option) => ({ ...option, id: option.id as ThemeTextScale }))


export const themeRadiusOptions: {id: ThemeRadius;label: string;}[] =
  themePresetContract.dimensions.borderRadius.options.map((option) => ({ ...option, id: option.id as ThemeRadius }))


export const themeShadowOptions: {id: ThemeShadowLevel;label: string;desc: string;}[] =
  themePresetContract.dimensions.shadowLevel.options.map((option) => ({ ...option, id: option.id as ThemeShadowLevel }))


export const themeAnimationOptions: {id: ThemeAnimationStyle;label: string;desc: string;}[] =
  themePresetContract.dimensions.animationStyle.options.map((option) => ({ ...option, id: option.id as ThemeAnimationStyle }))


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
  void lang
  return findFoundationRef(themeFontOptionsContract, fontFamily)
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
  themeColorValues[config.primaryColor as Exclude<ThemeColor, "custom">];

  return {
    ...deriveThemeSeedVariables(brand),
    "--radius": findFoundationRef(themeRadiusOptionsContract, config.borderRadius),
    "--font-sans": getThemeFontValue(config.fontFamily, lang),
    [themeAnimationContract.output]: findFoundationRef(themeAnimationOptionsContract, config.animationStyle),
    ...themeTextScaleValues[config.textScale],
    ...themeShadowValues[config.shadowLevel]
  } as CSSProperties;
}

export function getThemeSolidForegroundStyle(root: HTMLElement) {
  return deriveSolidForegroundVariables(
    root,
    solidForegroundContract,
  )
}

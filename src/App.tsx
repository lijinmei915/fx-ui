import { Fragment, createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { CommandPalette, type CommandItem } from "@/components/ui/command";
import { PageLead as FxPageLead, pageLeadSlots } from "@/components/fx/page-lead";
import { SectionLead, sectionLeadSlots } from "@/components/fx/section-lead";
import { DocDoDont } from "@/components/fx/doc-do-dont";
import { DocSurfaceCard, DocSurfaceTableCard } from "@/components/fx/doc-surface";
import { ComponentPlayground } from "@/components/fx/component-playground";
import {
  WebsiteRulePanel,
  WebsiteRulePopover,
  WebsiteRuleValueList,
  websiteRulePanelSlots,
  websiteRulePopoverSlots,
  websiteRuleValueListSlots
} from "@/components/fx/website-rule-panel";
import { WebsiteCardContainer, websiteCardContainerSlots } from "@/components/fx/website-card-container";
import { WebsiteSpacingRhythm, websiteSpacingRhythmSlots } from "@/components/fx/website-spacing-rhythm";
import { ActionRow as FxActionRow } from "@/components/fx/page-actions";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  LinkIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  Trash2Icon,
  LockIcon,
  ListIcon,
  LayoutColumnsIcon,
  RefreshIcon,
  MoonIcon,
  SunIcon,
  SlidersIcon,
  MoreHorizontalIcon,
  InboxIcon,
  HelpIcon,
  BellIcon,
  BellFilledIcon,
  BoltIcon,
  BoldIcon,
  BorderStyleIcon,
  BuildingIcon,
  BoxIcon,
  BriefcaseIcon,
  BriefcaseFilledIcon,
  CalendarIcon,
  CalendarFilledIcon,
  HeadsetIcon,
  HeadsetFilledIcon,
  MessageCircleIcon,
  MessageCircleFilledIcon,
  SchoolIcon,
  SchoolFilledIcon,
  LayoutGridIcon,
  LayoutGridFilledIcon,
  ChartLineIcon,
  ChartPieIcon,
  ChartPieFilledIcon,
  MapPinIcon,
  ReportMoneyIcon,
  TargetIcon,
  SitemapIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CheckIcon,
  CheckCircleFilledIcon,
  HomeFilledIcon,
  DatabaseFilledIcon,
  UserFilledIcon,
  FolderFilledIcon,
  StarFilledIcon,
  CopyIcon,
  CreditCardIcon,
  DatabaseIcon,
  FileCodeIcon,
  FolderIcon,
  FileTextIcon,
  HomeIcon,
  ItalicIcon,
  LogOutIcon,
  PackageIcon,
  PaletteIcon,
  RadiusIcon,
  SearchIcon,
  SettingsIcon,
  ShadowIcon,
  SparklesIcon,
  StarIcon,
  TextSizeIcon,
  TypographyIcon,
  UnderlineIcon,
  UserIcon,
  XIcon } from
"@/lib/icons";

import { Badge } from "@/components/ui/badge";
import { Tag } from "@/components/ui/tag";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig } from
"@/components/ui/chart";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  ScatterChart,
  Scatter,
  ZAxis,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  RadialBarChart,
  RadialBar,
  FunnelChart,
  Funnel,
  LabelList,
  Treemap,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell } from
"recharts";
import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle } from
"@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent } from
"@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel } from
"@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { AgentSurface, type AgentSurfaceEvent, type AgentSurfaceSchema } from "@/components/fx/agent-surface";
import { NavRail, NavRailItem, NavMenu, NavMenuHeader, NavMenuSearch, NavMenuList, NavMenuGroupLabel, NavMenuItem, NavMenuFooter } from "@/components/fx/nav-menu";
import { TopBar, TopBarBrand, TopBarDivider, TopBarApps, TopBarSearch, TopBarActions, TopBarIconButton } from "@/components/fx/top-bar";
import { Progress } from "@/components/ui/progress";
import { CrmAppShell } from "@/components/recipes/crm-app-shell";
import { DataTable, type Column } from "@/components/recipes/data-table";
import { ListToolbar } from "@/components/recipes/list-toolbar";
import { ListPageHeader } from "@/components/recipes/list-page-header";
import componentsManifestRaw from "../docs/data/components.manifest.json?raw";
import designTokensManifestRaw from "../docs/data/design-tokens.json?raw";
import docSiteManifestRaw from "../docs/data/doc-site.manifest.json?raw";
import componentPlaygroundsManifestRaw from "../docs/data/component-playgrounds.manifest.json?raw";
import governanceStatusRaw from "../docs/data/governance-status.json?raw";
import governanceTodoRaw from "../docs/data/governance-todo.json?raw";
import projectGraphRaw from "../docs/data/project-graph.json?raw";
import systemRelationsRaw from "../docs/data/system-relations.json?raw";
import governancePagesManifestRaw from "../docs/data/governance-pages.manifest.json?raw";
import websiteStandardsManifestRaw from "../docs/data/website-standards.manifest.json?raw";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger } from
"@/components/ui/alert-dialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger } from
"@/components/ui/dialog";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger } from
"@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import { Avatar, AvatarBadge, AvatarComposite, AvatarFallback, AvatarImage, AvatarGroup, AvatarGroupCount, avatarInitials } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator } from
"@/components/ui/breadcrumb";
import { Calendar } from "@/components/ui/calendar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger } from
"@/components/ui/popover";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider } from
"@/components/ui/sidebar";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue } from
"@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/components/ui/link";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow } from
"@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger } from
"@/components/ui/tooltip";
import { toast } from "sonner";
import buttonMarkdown from "../docs/components/button.md?raw";
import iconMarkdown from "../docs/components/icon.md?raw";
import tokensMarkdown from "../docs/TOKENS.md?raw";
import siteDesignMarkdown from "../docs/DOC_SITE_DESIGN.md?raw";

type Lang = "zh" | "en";
type ThemeMode = "light" | "dark";
type ThemeColor = "indigo" | "violet" | "emerald" | "rose" | "amber" | "sky" | "slate" | "custom";
type ThemeFont = "sans" | "serif" | "mono" | "geometric";
type ThemeTextScale = "compact" | "standard" | "spacious";
type ThemeRadius = "none" | "sm" | "md" | "lg" | "full";
type ThemeBorderWidth = "none" | "thin" | "medium" | "thick";
type ThemeShadowLevel = "none" | "low" | "medium" | "high";
type ThemeAnimationStyle = "none" | "fast" | "smooth" | "playful";

type ThemeConfig = {
  mode: ThemeMode;
  primaryColor: ThemeColor;
  customColorHex: string;
  customColorIndex: number;
  customColors: string[];
  fontFamily: ThemeFont;
  textScale: ThemeTextScale;
  borderRadius: ThemeRadius;
  borderWidth: ThemeBorderWidth;
  shadowLevel: ThemeShadowLevel;
  animationStyle: ThemeAnimationStyle;
};

type StoredThemeConfig = Partial<Omit<ThemeConfig, "shadowLevel">> & {
  shadowLevel?: ThemeShadowLevel | "retro" | string;
};

const defaultThemeConfig: ThemeConfig = {
  mode: "light",
  primaryColor: "amber",
  customColorHex: "#3b82f6",
  customColorIndex: 0,
  customColors: ["#3b82f6"],
  fontFamily: "sans",
  textScale: "standard",
  borderRadius: "md",
  borderWidth: "thin",
  shadowLevel: "low",
  animationStyle: "smooth"
};

const themeColorOptions: {id: ThemeColor;label: string;value: string;}[] = [
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
    "--fx-shadow-l1": "none",
    "--fx-shadow-l2": "none",
    "--fx-shadow-l3": "none",
    "--fx-shadow-l1-up": "none"
  },
  low: {
    "--fx-shadow-color": "oklch(from var(--fx-neutrals-20) l c h / 0.08)",
    "--fx-shadow-l1": "0px 6px 18px -8px var(--fx-shadow-color)",
    "--fx-shadow-l2": "0px 10px 30px -12px var(--fx-shadow-color)",
    "--fx-shadow-l3": "0px 18px 48px -16px var(--fx-shadow-color)",
    "--fx-shadow-l1-up": "0px -6px 18px -8px var(--fx-shadow-color)"
  },
  medium: {
    "--fx-shadow-color": "oklch(from var(--fx-neutrals-20) l c h / 0.18)",
    "--fx-shadow-l1": "0px 4px 10px -2px var(--fx-shadow-color)",
    "--fx-shadow-l2": "0px 8px 20px -6px var(--fx-shadow-color)",
    "--fx-shadow-l3": "0px 14px 36px -10px var(--fx-shadow-color)",
    "--fx-shadow-l1-up": "0px -4px 12px -4px var(--fx-shadow-color)"
  },
  high: {
    "--fx-shadow-color": "oklch(from var(--fx-neutrals-20) l c h / 0.22)",
    "--fx-shadow-l1": "0px 6px 18px -8px var(--fx-shadow-color)",
    "--fx-shadow-l2": "0px 14px 36px -14px var(--fx-shadow-color)",
    "--fx-shadow-l3": "0px 24px 64px -20px var(--fx-shadow-color)",
    "--fx-shadow-l1-up": "0px -8px 22px -12px var(--fx-shadow-color)"
  }
};

const themeAnimationDurations: Record<ThemeAnimationStyle, string> = {
  none: "0ms",
  fast: "100ms",
  smooth: "200ms",
  playful: "320ms"
};

const themeFontOptions: {id: ThemeFont;label: string;}[] = [
{ id: "sans", label: "系统默认" },
{ id: "serif", label: "书面雅致" },
{ id: "mono", label: "代码极客" },
{ id: "geometric", label: "现代几何" }];

const themeFontPreviewText: Record<Lang, string> = {
  zh: "中文 Aa 123",
  en: "Abc 123"
};


const themeTextScaleOptions: {id: ThemeTextScale;label: string;desc: string;}[] = [
{ id: "compact", label: "紧凑", desc: "12px 基准" },
{ id: "standard", label: "标准", desc: "14px 基准" },
{ id: "spacious", label: "宽松", desc: "16px 基准" }];


const themeRadiusOptions: {id: ThemeRadius;label: string;}[] = [
{ id: "none", label: "无" },
{ id: "sm", label: "小" },
{ id: "md", label: "中" },
{ id: "lg", label: "大" },
{ id: "full", label: "全圆" }];


const themeBorderWidthOptions: {id: ThemeBorderWidth;label: string;desc: string;}[] = [
{ id: "none", label: "无边框", desc: "0px" },
{ id: "thin", label: "细", desc: "1px" },
{ id: "medium", label: "中等", desc: "2px" },
{ id: "thick", label: "粗", desc: "3px" }];


const themeShadowOptions: {id: ThemeShadowLevel;label: string;desc: string;}[] = [
{ id: "none", label: "无", desc: "平面" },
{ id: "low", label: "低", desc: "贴面" },
{ id: "medium", label: "中", desc: "浮起" },
{ id: "high", label: "高", desc: "悬浮" }];


const themeAnimationOptions: {id: ThemeAnimationStyle;label: string;desc: string;}[] = [
{ id: "none", label: "无动效", desc: "极速" },
{ id: "fast", label: "快速", desc: "利落" },
{ id: "smooth", label: "平滑", desc: "经典" },
{ id: "playful", label: "弹性", desc: "灵动" }];


const uiText = {
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

function getLabel(item: {label: string;labelEn?: string;}, lang: Lang) {
  return lang === "en" && item.labelEn ? item.labelEn : item.label;
}

function isHexColor(value: string) {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

function normalizeThemeConfig(value: string | null): ThemeConfig {
  if (!value) return defaultThemeConfig;

  try {
    const parsed = JSON.parse(value) as StoredThemeConfig;
    const customColors = Array.isArray(parsed.customColors) ?
    parsed.customColors.filter(isHexColor) :
    [];
    const legacyCustomColor = isHexColor(parsed.customColorHex ?? "") ? parsed.customColorHex! : defaultThemeConfig.customColorHex;
    const normalizedCustomColors = customColors.length > 0 ? customColors : [legacyCustomColor];
    const customColorIndex = Math.min(Math.max(parsed.customColorIndex ?? 0, 0), Math.max(normalizedCustomColors.length - 1, 0));
    const selectedCustomColor = normalizedCustomColors[customColorIndex] ?? legacyCustomColor;

    return {
      ...defaultThemeConfig,
      ...parsed,
      customColorHex: selectedCustomColor,
      customColorIndex,
      customColors: normalizedCustomColors,
      shadowLevel: parsed.shadowLevel === "retro" ? "high" : (parsed.shadowLevel as ThemeShadowLevel | undefined) ?? defaultThemeConfig.shadowLevel
    };
  } catch {
    return defaultThemeConfig;
  }
}

function updateThemeConfig<K extends keyof ThemeConfig>(
config: ThemeConfig,
key: K,
value: ThemeConfig[K])
{
  return { ...config, [key]: value };
}

function getThemeFontValue(fontFamily: ThemeFont, lang: Lang) {
  return lang === "zh" ? themeChineseFontValues[fontFamily] : themeEnglishFontValues[fontFamily];
}

function getActiveCustomColor(config: ThemeConfig) {
  return isHexColor(config.customColorHex) ?
  config.customColorHex :
  config.customColors[config.customColorIndex] ?? defaultThemeConfig.customColorHex;
}

function getThemeRuntimeStyle(config: ThemeConfig, lang: Lang): React.CSSProperties {
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
  } as React.CSSProperties;
}

// Keep documentation page rhythm aligned with docs/TOKENS.md spacing tokens.
const docsSpacing = {
  pageStack: "flex flex-col gap-10",
  sectionStack: "flex flex-col gap-5",
  sectionHeader: "flex flex-col gap-3",
  sectionDesc: "text-base text-muted-foreground",
  sectionStackCompact: "flex flex-col gap-4",
  contentGap: "flex flex-col gap-3",
  leadText: "max-w-5xl text-lg text-muted-foreground",
  componentLead: "max-w-5xl break-words text-lg"
};

const docsSidebarSpacing = {
  shell: "h-full overflow-y-auto px-6 py-6",
  searchTrigger: "mb-6",
  nav: "flex flex-col gap-4",
  group: "flex flex-col gap-1",
  groupLabel: "text-xs font-medium tracking-widest text-[var(--fx-neutrals-10)] uppercase",
  itemList: "flex flex-col gap-2"
};

type ComponentsManifest = {
  updatedAt: string;
  uiComponents: {
    name?: string;
    docStatus?: string;
    usageRules?: string[];
  }[];
  fxComponents: {
    name?: string;
    docStatus?: string;
    usageRules?: string[];
  }[];
};

type DesignTokensManifest = {
  updatedAt: string;
  primitive: unknown[];
  semantic: unknown[];
  componentUsage: unknown[];
};

type DocSiteManifest = {
  updatedAt: string;
  regions: unknown[];
  supportingData: unknown[];
};

type ProjectGraph = {
  generatedAt: string;
  summary: {
    nodeCount: number;
    edgeCount: number;
    staleCount: number;
    systemRelationCount?: number;
    systemRelationGroupCount?: number;
  };
  systemRelations?: {
    source: string;
    updatedAt: string;
    summary: {
      siteRelationCount: number;
      projectRelationCount: number;
      relationCount: number;
      groupCount: number;
    };
    groups: {
      scope: "site" | "project";
      group: string;
      count: number;
    }[];
  };
  systemRelationEdges?: {
    id: string;
    scope: "site" | "project";
    group: string;
    source: string;
    action: string;
    target: string;
    result: string;
    emphasis?: boolean;
  }[];
};

type FileRelation = {
  group: string;
  source: string;
  action: string;
  target: string;
  result: string;
  emphasis?: boolean;
};

type SystemRelationsManifest = {
  updatedAt: string;
  site: FileRelation[];
  project: FileRelation[];
};

type GovernanceStatusManifest = {
  updatedAt: string;
  statusCards: {
    title: string;
    valueKey: string;
    desc: string;
  }[];
  maintenanceModel: {
    title: string;
    desc: string;
    layers: {
      name: string;
      source: string;
      role: string;
      update: string;
    }[];
    rules: string[];
  };
  freshness: {
    name: string;
    source: string;
    updatedAtKey: string;
    maintenance: string;
  }[];
  assets: {
    rule: string;
    textSpec: string;
    machineData: string;
    check: string;
    status: string;
  }[];
  loop: {
    title: string;
    titleEn: string;
    file: string;
    desc: string;
    descEn: string;
  }[];
  references: {
    title: string;
    desc: string;
    href: string;
  }[];
  actionFlows: {
    id: string;
    title: string;
    titleEn: string;
    desc: string;
    descEn: string;
    href: string;
    linkLabel: string;
    linkLabelEn: string;
    checkCommand: string;
    done: string;
    doneEn: string;
    steps: {
      file: string;
      action: string;
      actionEn: string;
      note: string;
      noteEn: string;
    }[];
  }[];
  taskRoutes: {
    id: string;
    label: string;
    labelEn: string;
    match: string[];
    flowId: string;
    firstDecision: string;
    firstDecisionEn: string;
    outputCheck: string;
  }[];
  next: {
    id: string;
    title: string;
    desc: string;
    priority: string;
    status: string;
    ownerRole: string;
    targetFiles: string[];
    checkCommand: string;
    definitionOfDone: string;
  }[];
};

type WebsiteStandardsManifest = {
  schemaVersion: number;
  format: string;
  updatedAt: string;
  truthSource: string;
  humanDoc: string;
  note: string;
  pageLead: {
    componentName: string;
    rulePanel: {
      sections: ("usage" | "values" | "sources")[];
      sources: { label: string; value: string }[];
    };
    visualBaseline: { title: string; slot: PageLeadWebsiteSlot }[];
    contentRules: { title: string; ruleKey: string }[];
  };
  sectionLead: {
    componentName: string;
    rulePanel: {
      sections: ("usage" | "values" | "sources")[];
      sources: { label: string; value: string }[];
    };
    visualBaseline: { title: string; slot: SectionLeadWebsiteSlot }[];
    usageBullets: string[];
  };
  websiteRulePopover: {
    componentName: string;
    rulePanel: {
      sections: ("usage" | "values" | "sources")[];
      sources: { label: string; value: string }[];
    };
    visualBaseline: { title: string; slot: WebsiteRulePopoverSlot }[];
  };
  componentPlayground: {
    componentKey: "button";
    componentName: string;
    route: string;
    source: string;
    truthSource: string;
    rulePanel: {
      sections: ("usage" | "values" | "sources")[];
      sources: { label: string; value: string }[];
    };
    rules: { title: string; value: string; logic: string }[];
  };
  websiteCardContainer: {
    componentName: string;
    rulePanel: {
      sections: ("usage" | "values" | "sources")[];
      sources: { label: string; value: string }[];
    };
    rules: { title: string; value: string; logic: string }[];
    visualBaseline: { title: string; slot: WebsiteCardContainerSlot }[];
  };
  spacingRhythm: {
    componentName: string;
    rulePanel: {
      sections: ("usage" | "values" | "sources")[];
      sources: { label: string; value: string }[];
    };
    items: { label: string; value: string; logic: string }[];
    visualBaseline: { title: string; slot: WebsiteSpacingRhythmSlot }[];
  };
  linkageRules: string[];
};

type ComponentPlaygroundManifestProp = {
  key: string;
  zh: string;
  en: string;
  propName: string;
  type: "segment";
  options: {
    value: string;
    label: string;
    labelEn?: string;
    title?: string;
    titleEn?: string;
    intent?: string;
    intentEn?: string;
    constraint?: string;
    constraintEn?: string;
    hiddenWhen?: Record<string, string | string[]>;
  }[];
  hasAll?: boolean;
  disabledWhen?: Record<string, string | string[]>;
  hiddenWhen?: Record<string, string | string[]>;
} | {
  key: string;
  zh: string;
  en: string;
  propName: string;
  type: "text";
  bilingual?: boolean;
  disabledWhen?: Record<string, string | string[]>;
  hiddenWhen?: Record<string, string | string[]>;
};

type ComponentPlaygroundManifestComponent = {
  componentName: string;
  source: string;
  playgroundComponent: string;
  initial: Record<string, string>;
  guidanceKey?: string;
  scenarios?: {
    id: string;
    zh: string;
    en: string;
    intent: string;
    intentEn: string;
    values: Record<string, string>;
  }[];
  props: ComponentPlaygroundManifestProp[];
};

type ComponentPlaygroundsManifest = {
  schemaVersion: number;
  format: string;
  updatedAt: string;
  truthSource: string;
  humanDoc: string;
  note: string;
  autoScenarioComponents?: string[];
  components: {
    [key: string]: ComponentPlaygroundManifestComponent;
    icon: ComponentPlaygroundManifestComponent;
    buttonGroup: ComponentPlaygroundManifestComponent;
  };
};

type GovernancePagesManifest = {
  schemaVersion: number;
  format: string;
  updatedAt: string;
  truthSource: string;
  humanDoc: string;
  note: string;
  documentation: {
    ssotRoutes: { question: string; source: string; usage: string }[];
    antiDriftLoop: { title: string; file: string; desc: string }[];
    writeRules: string[];
  };
  checks: {
    commands: { command: string; usage: string }[];
    layers: { title: string; script: string; desc: string }[];
    finishChecklist: string[];
  };
  overview: {
    positioning: { title: string; desc: string }[];
    layers: { layer: string; directory: string; responsibility: string }[];
    audience: string[];
  };
  install: {
    prerequisites: string[];
    structure: string[];
    verify: string[];
  };
  theme: {
    semanticSlots: { layer: string; example: string; purpose: string }[];
    changeFlow: string[];
  };
  aiRules: {
    guardrails: { title: string; desc: string }[];
    styleFlow: string[];
  };
};

type GovernanceTodoManifest = {
  schemaVersion: number;
  format: string;
  updatedAt: string;
  truthSource: string;
  humanDoc: string;
  note: string;
  items: {
    id: string;
    title: string;
    priority: string;
    status: string;
    definitionOfDone: string;
  }[];
};

const componentsManifest = JSON.parse(componentsManifestRaw) as ComponentsManifest;
const designTokensManifest = JSON.parse(designTokensManifestRaw) as DesignTokensManifest;
const docSiteManifest = JSON.parse(docSiteManifestRaw) as DocSiteManifest;
const componentPlaygroundsManifest = JSON.parse(componentPlaygroundsManifestRaw) as ComponentPlaygroundsManifest;
const governanceStatus = JSON.parse(governanceStatusRaw) as GovernanceStatusManifest;
const governanceTodo = JSON.parse(governanceTodoRaw) as GovernanceTodoManifest;
const projectGraph = JSON.parse(projectGraphRaw) as ProjectGraph;
const systemRelations = JSON.parse(systemRelationsRaw) as SystemRelationsManifest;
const governancePagesManifest = JSON.parse(governancePagesManifestRaw) as GovernancePagesManifest;
const websiteStandardsManifest = JSON.parse(websiteStandardsManifestRaw) as WebsiteStandardsManifest;

function componentPlaygroundCondition(condition?: Record<string, string | string[]>) {
  return condition ? (v: Record<string, string>) => Object.entries(condition).every(([key, value]) => Array.isArray(value) ? value.includes(v[key]) : v[key] === value) : undefined;
}

function componentPlaygroundPropsFromManifest(component: ComponentPlaygroundManifestComponent) {
  return component.props.map((prop) => {
    const disabledWhen = componentPlaygroundCondition(prop.disabledWhen)
    const hiddenWhen = componentPlaygroundCondition(prop.hiddenWhen)

    if (prop.type === "segment") {
      return {
        ...prop,
        options: prop.options.map((option) => ({
          ...option,
          hiddenWhen: componentPlaygroundCondition(option.hiddenWhen),
        })),
        disabledWhen,
        hiddenWhen,
      }
    }

    return {
      ...prop,
      disabledWhen,
      hiddenWhen,
    }
  });
}

const allManifestComponents = [
...componentsManifest.uiComponents,
...componentsManifest.fxComponents];

const completeManifestComponents = allManifestComponents.filter((component) => component.docStatus === "complete");
const governanceSnapshot = {
  componentContracts: `${completeManifestComponents.length}/${allManifestComponents.length}`,
  docSiteRegions: `${docSiteManifest.regions.length} 区`,
  tokenFacts: `${
  designTokensManifest.primitive.length +
  designTokensManifest.semantic.length +
  designTokensManifest.componentUsage.length} 条`,

  projectGraph: `${projectGraph.summary.nodeCount} 点 / ${projectGraph.summary.edgeCount} 边`,
  defaultGate: "npm run check",
  staleNodes: `${projectGraph.summary.staleCount}`
};
const projectGraphCockpit = {
  nodeCount: projectGraph.summary.nodeCount,
  edgeCount: projectGraph.summary.edgeCount,
  staleCount: projectGraph.summary.staleCount,
  relationCount: projectGraph.systemRelations?.summary.relationCount ?? projectGraph.summary.systemRelationCount ?? 0,
  relationGroupCount: projectGraph.systemRelations?.summary.groupCount ?? projectGraph.summary.systemRelationGroupCount ?? 0,
  siteRelationCount: projectGraph.systemRelations?.summary.siteRelationCount ?? 0,
  projectRelationCount: projectGraph.systemRelations?.summary.projectRelationCount ?? 0,
  groups: projectGraph.systemRelations?.groups ?? []
};
const governanceFreshness = {
  componentsManifest: componentsManifest.updatedAt,
  designTokens: designTokensManifest.updatedAt,
  docSite: docSiteManifest.updatedAt,
  governanceStatus: governanceStatus.updatedAt,
  projectGraph: projectGraph.generatedAt,
  systemRelations: systemRelations.updatedAt
};

type PageLeadWebsiteSlot = "root" | "crumb" | "title" | "titleMeta" | "lead" | "actions";
type SectionLeadWebsiteSlot = "root" | "title" | "description";
type WebsiteRulePopoverSlot =
  | "popoverRoot"
  | "trigger"
  | "content"
  | "defaultWidth"
  | "panelRoot"
  | "panelSources"
  | "valueList";
type WebsiteSpacingRhythmSlot =
  | "root"
  | "viewport"
  | "page"
  | "pagePaddingMeasure"
  | "titleToSectionMeasure"
  | "sectionGapMeasure"
  | "label";
type WebsiteCardContainerSlot =
  | "root"
  | "innerPanel"
  | "divider"
  | "controlShell"
  | "elevatedPanel"
  | "label";

const pageLeadSlotGuideMap = {
  root: "负责把标题区和右侧动作排成同一行，桌面端顶部对齐。",
  crumb: "显示页面层级路径，弱化呈现，最后一段自动作为当前页强调。",
  title: "承载页面唯一主标题，是这一页最强的视觉焦点。",
  titleMeta: "用于标题旁的补充英文或副标题，弱于主标题但保持同一基线。",
  lead: "只放一两句页面说明，解释这一页是做什么的，不重复标题。",
  actions: "放页面级动作，比如复制、更多、上一页、下一页，固定在右侧。"
} satisfies Record<PageLeadWebsiteSlot, string>;

const sectionLeadSlotGuideMap = {
  root: "负责标题与说明的纵向堆叠，只表达节标题，不承载业务内容。",
  title: "承载内容区小标题，层级低于页面标题但高于正文。",
  description: "承载一句说明文案；没有说明时整个说明行不渲染。"
} satisfies Record<SectionLeadWebsiteSlot, string>;

const websiteRulePopoverSlotGuideMap = {
  popoverRoot: "承载查看规则的展开状态和定位上下文，本身不写规则内容。",
  trigger: "统一查看规则按钮，使用 secondary / sm，并在展开时旋转右侧箭头。",
  content: "弹窗固定从按钮右下方展开，层级高于内容卡片。",
  defaultWidth: "默认用于视觉取值类规则；宽度上限是 44rem，同时会避开视口左右边距，窄规则可以通过 widthClassName 覆盖。",
  panelRoot: "弹窗里的规则面板外壳，统一边框、底色和内边距。",
  panelSources: "展示源码、规则和映射来源，作为轻量来源标签行。",
  valueList: "展示具体取值逻辑，默认两列排列，移动端自然单列。"
} satisfies Record<WebsiteRulePopoverSlot, string>;

const websiteSpacingRhythmSlotGuideMap = {
  root: "承载间距节奏示意图，统一卡片边框、底色和外层内边距。",
  viewport: "模拟文档页内容视口，用来表达页面内容与容器边界的距离。",
  page: "把页面截面拆成三段：页面内边距、标题到首节、小标题之间。",
  pagePaddingMeasure: "用短色条标记页面左右内边距的基准值。",
  titleToSectionMeasure: "用虚线块标记页面标题组到第一个内容小标题的距离。",
  sectionGapMeasure: "用弱虚线块标记两个内容小标题模块之间的距离。",
  label: "显示对应数值名称，字重和正文说明保持可读但不抢主标题。"
} satisfies Record<WebsiteSpacingRhythmSlot, string>;

const websiteCardContainerSlotGuideMap = {
  root: "承载文档站独立信息块、示例预览或说明区域，是网站卡片容器的外层表面。",
  innerPanel: "用于卡片内部的辅助区域或分组区域，边框比外层更弱。",
  divider: "用于卡片内部内容分隔，不另起一套外层卡片边框。",
  controlShell: "用于卡片内部的控件壳、筛选壳或浅辅助区域。",
  elevatedPanel: "只在需要浮层感或强调调试容器时使用阴影层级。",
  label: "用于说明容器内部区域，不抢页面标题层级。"
} satisfies Record<WebsiteCardContainerSlot, string>;

function describeTailwindTokenValue(classes: string) {
  const parts: string[] = [];
  const sizeMap: Record<string, string> = {
    "text-sm": "14px",
    "text-base": "16px",
    "text-lg": "18px",
    "text-xl": "20px / 28px",
    "text-3xl": "30px / 36px"
  };
  const weightMap: Record<string, string> = {
    "font-normal": "400",
    "font-medium": "500",
    "font-semibold": "600",
    "font-bold": "700"
  };
  const colorMap: Record<string, string> = {
    "text-foreground": "主文字色",
    "text-muted-foreground": "弱文字色"
  };

  Object.entries(sizeMap).find(([token]) => classes.includes(token))?.[1] && parts.push(`字号 ${Object.entries(sizeMap).find(([token]) => classes.includes(token))?.[1]}`);
  Object.entries(weightMap).find(([token]) => classes.includes(token))?.[1] && parts.push(`字重 ${Object.entries(weightMap).find(([token]) => classes.includes(token))?.[1]}`);
  Object.entries(colorMap).find(([token]) => classes.includes(token))?.[1] && parts.push(`颜色 ${Object.entries(colorMap).find(([token]) => classes.includes(token))?.[1]}`);

  if (classes.includes("grid")) parts.push("布局 grid");
  if (classes.includes("flex")) parts.push("布局 flex");
  if (classes.includes("flex-col")) parts.push("纵向排列");
  if (classes.includes("gap-1")) parts.push("间距 4px");
  if (classes.includes("gap-2.5")) parts.push("间距 10px");
  if (classes.includes("gap-3")) parts.push("间距 12px");
  if (classes.includes("right-0")) parts.push("右侧对齐");
  if (classes.includes("top-full")) parts.push("位于触发器下方");
  if (classes.includes("z-20")) parts.push("层级 z-20");
  if (classes.includes("mt-2")) parts.push("顶部偏移 8px");
  if (classes.includes("rounded-2xl")) parts.push("圆角 16px");
  if (classes.includes("border-border-subtle")) parts.push("边框 弱分隔色");else
  if (classes.includes("border-border")) parts.push("边框 标准边框色");
  if (classes.includes("bg-card")) parts.push("底色 卡片色");
  if (classes.includes("bg-background")) parts.push("底色 页面底色");
  if (classes.includes("bg-muted/30")) parts.push("底色 弱辅助填充");
  if (classes.includes("shadow-l1")) parts.push("阴影 L1");
  if (classes.includes("p-4")) parts.push("内边距 16px");
  if (classes.includes("p-5")) parts.push("内边距 20px");
  if (classes.includes("md:p-6")) parts.push("桌面端内边距 24px");
  if (classes.includes("gap-6")) parts.push("间距 24px");
  if (classes.includes("md:grid-cols-[0.95fr_1.05fr_1fr]")) parts.push("桌面端三列页面截面");
  if (classes.includes("h-3")) parts.push("标尺高度 12px");
  if (classes.includes("h-10")) parts.push("标尺高度 40px");
  if (classes.includes("bg-primary/15")) parts.push("标尺色 主题色浅层");
  if (classes.includes("border-primary/55")) parts.push("虚线边框 主题色");
  if (classes.includes("border-dashed")) parts.push("边框 虚线");
  const responsiveWidth = classes.match(/w-\[min\(([^,]+),calc\(100vw-([^)]+)\)\)\]/);
  if (responsiveWidth) parts.push(`宽度 最大 ${responsiveWidth[1]}，且不超过视口宽度减 ${responsiveWidth[2]}`);
  if (classes.includes("md:grid-cols-2")) parts.push("桌面端两列");
  if (classes.includes("md:grid-cols-[minmax(0,1fr)_auto]")) parts.push("桌面端左内容 / 右动作双列");
  if (classes.includes("md:items-start")) parts.push("桌面端顶部对齐");
  if (classes.includes("md:col-span-2")) parts.push("桌面端横跨整行");
  if (classes.includes("shrink-0")) parts.push("在横向布局中保持自身宽度，不被挤窄");
  if (classes.includes("md:justify-self-end")) parts.push("桌面端右对齐");

  return parts.join("；");
}

function getPageLeadSlotValue(slot: PageLeadWebsiteSlot) {
  const value = describeTailwindTokenValue(pageLeadSlots[slot]);
  return value || "由 PageLead 源码插槽控制。";
}

function getSectionLeadSlotValue(slot: SectionLeadWebsiteSlot) {
  const value = describeTailwindTokenValue(sectionLeadSlots[slot]);
  return value || "由 SectionLead 源码插槽控制。";
}

function getWebsiteRulePopoverSlotValue(slot: WebsiteRulePopoverSlot) {
  const classBySlot: Record<WebsiteRulePopoverSlot, string> = {
    popoverRoot: websiteRulePopoverSlots.root,
    trigger: websiteRulePopoverSlots.trigger,
    content: websiteRulePopoverSlots.content,
    defaultWidth: websiteRulePopoverSlots.defaultWidth,
    panelRoot: websiteRulePanelSlots.root,
    panelSources: websiteRulePanelSlots.sources,
    valueList: websiteRuleValueListSlots.root
  };
  const value = describeTailwindTokenValue(classBySlot[slot]);
  return value || "由 WebsiteRulePopover 源码插槽控制。";
}

function getWebsiteSpacingRhythmSlotValue(slot: WebsiteSpacingRhythmSlot) {
  const value = describeTailwindTokenValue(websiteSpacingRhythmSlots[slot]);
  return value || "由 WebsiteSpacingRhythm 源码插槽控制。";
}

function getWebsiteCardContainerSlotValue(slot: WebsiteCardContainerSlot) {
  const value = describeTailwindTokenValue(websiteCardContainerSlots[slot]);
  return value || "由 WebsiteCardContainer 源码插槽控制。";
}

type SiteNavItem = {
  label: string;
  labelEn?: string;
  href: string;
  page: string;
  items?: SiteNavItem[];
};

const gettingStartedNavItems: SiteNavItem[] = [
{ label: "开始使用", labelEn: "Getting Started", href: "#intro", page: "intro" }];

const governanceQuickLinks: SiteNavItem[] = [
{ label: "现状", labelEn: "Status", href: "#governance-map", page: "governance-map" },
{ label: "AI 规则", labelEn: "AI Rules", href: "#ai-rules", page: "ai-rules" },
{ label: "文档规范", labelEn: "Documentation", href: "#documentation", page: "documentation" },
{ label: "网站规范", labelEn: "Website Standards", href: "#website-standards", page: "website-standards" },
{ label: "检查命令", labelEn: "Checks", href: "#checks", page: "checks" }];

const topNav: SiteNavItem[] = [
{ label: "开始使用", labelEn: "Getting Started", href: "#intro", page: "intro" },
{ label: "组件", labelEn: "Components", href: "#components", page: "components" },
{ label: "基础", labelEn: "Foundations", href: "#tokens", page: "tokens" },
{ label: "页面", labelEn: "Pages", href: "#template-customer-list", page: "template-customer-list" },
{ label: "维护", labelEn: "Maintain", href: "#governance-map", page: "governance-map" }];


const docsNav = [
{
  title: "设计令牌",
  titleEn: "Design Tokens",
  items: [
  { label: "概览", labelEn: "Overview", href: "#tokens" },
  { label: "颜色", labelEn: "Colors", href: "#tokens-colors" },
  { label: "排版", labelEn: "Typography", href: "#tokens-typography" },
  { label: "圆角", labelEn: "Radius", href: "#tokens-radius" },
  { label: "阴影", labelEn: "Shadow", href: "#tokens-shadow" },
  { label: "间距", labelEn: "Spacing", href: "#tokens-spacing" },
  { label: "层级", labelEn: "Layer", href: "#tokens-layer" },
  { label: "动效", labelEn: "Motion", href: "#tokens-motion" }]

},
{
  title: "布局系统",
  titleEn: "Layout",
  items: [
  { label: "栅格", labelEn: "Grid", href: "#grid" },
  { label: "布局", labelEn: "Layout", href: "#layout" },
  { label: "顶栏", labelEn: "TopBar", href: "#top-bar" }]

},
{
  title: "通用",
  titleEn: "General",
  items: [
  { label: "按钮", labelEn: "Button", href: "#button" },
  { label: "按钮组", labelEn: "Button Group", href: "#button-group" },
  { label: "图标", labelEn: "Icon", href: "#icon" },
  { label: "分隔线", labelEn: "Separator", href: "#separator" },
  { label: "链接", labelEn: "Link", href: "#link" },
  { label: "头像", labelEn: "Avatar", href: "#avatar" }]

},
{
  title: "数据录入",
  titleEn: "Data Entry",
  items: [
  { label: "输入框", labelEn: "Input", href: "#input" },
  { label: "选择器", labelEn: "Select", href: "#select" },
  { label: "复选框", labelEn: "Checkbox", href: "#checkbox" },
  { label: "单选组", labelEn: "Radio Group", href: "#radio-group" },
  { label: "开关", labelEn: "Switch", href: "#switch" },
  { label: "多行输入", labelEn: "Textarea", href: "#textarea" },
  { label: "日历", labelEn: "Calendar", href: "#calendar" },
  { label: "切换按钮", labelEn: "Toggle", href: "#toggle" },
  { label: "切换按钮组", labelEn: "Toggle Group", href: "#toggle-group" }]

},
{
  title: "数据展示",
  titleEn: "Data Display",
  items: [
  { label: "表格", labelEn: "Table", href: "#table" },
  { label: "卡片", labelEn: "Card", href: "#card" },
  { label: "图表", labelEn: "Chart", href: "#chart" },
  { label: "标签", labelEn: "Tag", href: "#tag" },
  { label: "徽标", labelEn: "Badge", href: "#badge" },
  { label: "提示", labelEn: "Tooltip", href: "#tooltip" },
  { label: "折叠面板", labelEn: "Collapsible", href: "#collapsible" }]

},
{
  title: "导航",
  titleEn: "Navigation",
  items: [
  { label: "面包屑", labelEn: "Breadcrumb", href: "#breadcrumb" },
  { label: "标签页", labelEn: "Tabs", href: "#tabs" },
  { label: "下拉菜单", labelEn: "Dropdown Menu", href: "#dropdown-menu" },
  { label: "侧边栏", labelEn: "Sidebar", href: "#sidebar" },
  { label: "导航菜单", labelEn: "Nav Menu", href: "#nav-menu" },
  { label: "分页器", labelEn: "Pagination", href: "#pagination" },
  { label: "命令面板", labelEn: "Command", href: "#command" }]

},
{
  title: "反馈",
  titleEn: "Feedback",
  items: [
  { label: "对话框", labelEn: "Dialog", href: "#dialog" },
  { label: "警告对话框", labelEn: "Alert Dialog", href: "#alert-dialog" },
  { label: "抽屉", labelEn: "Sheet", href: "#sheet" },
  { label: "骨架屏", labelEn: "Skeleton", href: "#skeleton" },
  { label: "弹出层", labelEn: "Popover", href: "#popover" },
  { label: "加载指示器", labelEn: "Spinner", href: "#spinner" },
  { label: "轻提示", labelEn: "Toast", href: "#toast" }]

},
{
  title: "业务组合组件",
  titleEn: "Business Compositions",
  items: [
  { label: "页面头部", labelEn: "PageHeader", href: "#page-header" },
  { label: "搜索工具栏", labelEn: "SearchToolbar", href: "#search-toolbar" },
  { label: "实体表格", labelEn: "EntityTable", href: "#entity-table" },
  { label: "表单分组", labelEn: "FormSection", href: "#form-section" },
  { label: "危险确认框", labelEn: "ConfirmDangerDialog", href: "#confirm-danger-dialog" }]

},
  {
  title: "Agent 界面",
  titleEn: "Agent UI",
  items: [
  { label: "生成式UI组件", labelEn: "Generative UI", href: "#agent-surface" }]

},
{
  title: "页面",
  titleEn: "Pages",
  items: [
  { label: "列表页", labelEn: "List Page", href: "#template-customer-list" }]

},
{
  title: "维护",
  titleEn: "Maintain",
  items: [
  { label: "现状", labelEn: "Status", href: "#governance-map" },
  { label: "AI 规则", labelEn: "AI Rules", href: "#ai-rules" },
  { label: "文档规范", labelEn: "Documentation", href: "#documentation" },
  { label: "网站规范", labelEn: "Website Standards", href: "#website-standards" },
  { label: "检查命令", labelEn: "Checks", href: "#checks" }]

}];


type GettingStartedPage = "intro" | "install" | "theme" | "governance-map" | "ai-rules" | "documentation" | "website-standards" | "checks";

const gettingStartedAnchors: Record<GettingStartedPage, {label: string;labelEn: string;href: string;}[]> = {
  intro: [
  { label: "定位", labelEn: "Positioning", href: "#intro-positioning" },
  { label: "安装和引入", labelEn: "Install", href: "#intro-install" },
  { label: "主题接入", labelEn: "Theme Setup", href: "#theme-source" },
  { label: "语义槽", labelEn: "Semantic Slots", href: "#theme-slots" },
  { label: "修改流程", labelEn: "Change Flow", href: "#theme-flow" },
  { label: "内部维护", labelEn: "Maintenance", href: "#intro-layers" },
  { label: "团队协同", labelEn: "Workflow", href: "#intro-audience" }],

  install: [
  { label: "接入前提", labelEn: "Prerequisites", href: "#install-prerequisites" },
  { label: "安装组件", labelEn: "Components", href: "#install-components" },
  { label: "接入主题", labelEn: "Theme", href: "#install-theme" },
  { label: "目录约定", labelEn: "Structure", href: "#install-structure" },
  { label: "启动检查", labelEn: "Verify", href: "#install-verify" }],

  theme: [
  { label: "token 真相源", labelEn: "Token Source", href: "#theme-source" },
  { label: "shadcn 语义槽", labelEn: "Semantic Slots", href: "#theme-slots" },
  { label: "修改流程", labelEn: "Change Flow", href: "#theme-flow" }],

  "governance-map": [
  { label: "当前状态", labelEn: "Status", href: "#governance-map-status" },
  { label: "工程运行图", labelEn: "System Map", href: "#governance-map-system" },
  { label: "数据新鲜度", labelEn: "Freshness", href: "#governance-map-freshness" },
  { label: "规则资产", labelEn: "Assets", href: "#governance-map-assets" },
  { label: "治理闭环", labelEn: "Loop", href: "#governance-map-loop" },
  { label: "参考案例", labelEn: "References", href: "#governance-map-references" }],

  "ai-rules": [
  { label: "行为红线", labelEn: "Guardrails", href: "#ai-guardrails" },
  { label: "改样式流程", labelEn: "Style Flow", href: "#ai-style-flow" },
  { label: "交付检查", labelEn: "Checks", href: "#ai-checks" }],

  documentation: [
  { label: "SSOT 路由", labelEn: "SSOT", href: "#documentation-ssot" },
  { label: "防漂三件套", labelEn: "Anti-Drift", href: "#documentation-anti-drift" },
  { label: "写入规则", labelEn: "Write Rules", href: "#documentation-write-rules" }],

  "website-standards": [
  { label: "页面组件", labelEn: "Page Components", href: "#website-standards-components" },
  { label: "间距节奏", labelEn: "Spacing Rhythm", href: "#website-standards-spacing" },
  { label: "卡片容器", labelEn: "Card Container", href: "#website-standards-boundaries" }],

  checks: [
  { label: "常用命令", labelEn: "Commands", href: "#checks-commands" },
  { label: "检查分层", labelEn: "Layers", href: "#checks-layers" },
  { label: "收尾清单", labelEn: "Checklist", href: "#checks-checklist" }]

};

const componentsIndexAnchors = [
{ label: "基础组件", labelEn: "UI Components", href: "#components-ui" },
{ label: "业务组合", labelEn: "Compositions", href: "#components-fx" },
  { label: "生成式UI组件", labelEn: "Generative UI", href: "#components-agent-ui" }];

const agentSurfaceNavLabel = {
  zh: "生成式UI组件",
  en: "Generative UI"
} as const;

const componentIndexSections = docsNav.filter((section) =>
["通用", "数据录入", "数据展示", "导航", "反馈", "业务组合组件", "Agent 界面"].includes(section.title)
);

function ComponentIndexGrid({ sections, lang }: {sections: typeof componentIndexSections;lang: Lang;}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {sections.map((section) =>
      <Card key={section.title} size="sm" elevated>
        <CardHeader>
          <div>
            <CardTitle>{lang === "en" ? section.titleEn : section.title}</CardTitle>
          </div>
          <CardAction>
            <Tag variant="outline">{section.items.length}</Tag>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2">
            {section.items.map((item) =>
            <Button
              key={item.href}
              variant="secondary"
              size="md"
              render={<a href={item.href} />}
              className="w-full justify-start">
              <span className="truncate text-sm font-medium">{item.label}</span>
              <span className="truncate text-xs font-normal text-muted-foreground">{item.labelEn}</span>
            </Button>
            )}
          </div>
        </CardContent>
      </Card>
      )}
    </div>);

}
const tokenNavSections = docsNav.filter((section) => section.title === "设计令牌");
const layoutNavSections = docsNav.filter((section) => section.title === "布局系统");
const foundationNavSections = [...tokenNavSections, ...layoutNavSections];
const pageNavSections = docsNav.filter((section) => section.title === "页面");
const governanceNavSections = docsNav.filter((section) => section.title === "维护");

const footerNavItems = [
...gettingStartedNavItems.map((item) => ({
  ...item,
  group: "开始使用",
  groupEn: "Getting Started"
})),
{
  label: "组件",
  labelEn: "Components",
  href: "#components",
  group: "组件",
  groupEn: "Components"
},
...componentIndexSections.flatMap((section) =>
section.items.map((item) => ({
  ...item,
  group: section.title,
  groupEn: section.titleEn
}))
),
...[...foundationNavSections, ...pageNavSections].
flatMap((section) =>
section.items.map((item) => ({
  ...item,
  group: section.title,
  groupEn: section.titleEn
}))
),
...governanceQuickLinks.map((item) => ({
  ...item,
  group: "维护",
  groupEn: "Maintain"
}))];


const installCommandsCode = `npx shadcn@latest add button input select checkbox switch table dialog alert-dialog sheet badge card tabs`;

const initShadcnCode = `npx shadcn@latest init`;

const themeSetupCode = `// src/main.tsx
import "../theme/fx-theme.css"`;

const themeDistributionCode = `// 对外分发主题时，使用 shadcn registry:theme
registry/fx-theme.json`;

const themeImportCode = `import "../theme/fx-theme.css"`;

const propRows = [
{ prop: "variant", type: "'default' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'plain'", defaultValue: "'default'", desc: "来自 Button 源码的样式变体", descEn: "Style variant from the Button source" },
{ prop: "tone", type: "'default' | 'primary' | 'info' | 'danger'", defaultValue: "'default'", desc: "仅 plain 使用的语义色调", descEn: "Semantic tone for the plain variant only" },
{ prop: "size", type: "'xs' | 'sm' | 'md' | 'lg' | 'icon-xs' | 'icon-sm' | 'icon-md' | 'icon-lg'", defaultValue: "'sm'", desc: "来自 Button 源码的尺寸变体；不写 size 即 28px", descEn: "Size variant from the Button source; omitted size renders 28px" },
{ prop: "disabled", type: "boolean", defaultValue: "false", desc: "是否禁用", descEn: "Whether the button is disabled" },
{ prop: "aria-invalid", type: "boolean", defaultValue: "false", desc: "错误态样式，继承 shadcn 语义 token", descEn: "Invalid state styling based on semantic tokens" },
{ prop: "render", type: "ReactElement | (props, state) => ReactElement", defaultValue: "undefined", desc: "把按钮样式渲染到自定义元素上（如 <a>），相当于 Base UI 版本的 asChild", descEn: "Render the button styling onto a custom element (e.g. <a>); Base UI's equivalent of asChild" }];


const buttonImportCode = `import { Button } from "@/components/ui/button"`;


const semanticDomRows = [
{ part: "root", desc: "按钮根节点，承载 variant、size、disabled、aria-invalid 和焦点态样式。", descEn: "Button root node for variant, size, disabled, aria-invalid, and focus styles." },
{ part: "icon", desc: "图标区域，用 data-icon=\"inline-start\"（前置）或 \"inline-end\"（后置）标记位置，不手写尺寸覆盖。", descEn: "Icon region. Mark placement with data-icon=\"inline-start\" (leading) or \"inline-end\" (trailing); do not override sizing manually." },
{ part: "content", desc: "按钮文本内容，保持单行动作短语，避免塞入说明文案。", descEn: "Button text content. Keep it as a concise action phrase." }];


const buttonDoDontRows = [
{ do: "用默认样式与语义 token，颜色交给主题。", doEn: "Use default styles and semantic tokens; leave color to the theme.", dont: "手写 bg-[#FF8000] 等品牌色硬编码。", dontEn: "Hard-code brand colors like bg-[#FF8000]." },
{ do: "危险操作用 variant=\"destructive\"。", doEn: "Use variant=\"destructive\" for dangerous actions.", dont: "用默认按钮承载删除等危险操作。", dontEn: "Use a default button for destructive actions like delete." },
{ do: "加载态用 disabled + Spinner 组合。", doEn: "Compose loading with disabled + Spinner.", dont: "发明 loading prop（<Button loading>）。", dontEn: "Invent a loading prop (<Button loading>)." },
{ do: "按钮内图标用 data-icon 标位，尺寸交给 Button。", doEn: "Mark icons with data-icon; let Button own the size.", dont: "给按钮内图标手写 size-4 等尺寸。", dontEn: "Hard-code icon size like size-4 inside Button." },
{ do: "一组操作只突出一个主按钮，其余用次按钮。", doEn: "Keep a single primary button per group; make the rest secondary.", dont: "同时摆多个主按钮，主次不分。", dontEn: "Stack multiple primary buttons with no clear hierarchy." },
{ do: "操作无明显主次时，整组用次按钮最稳妥。", doEn: "When actions are equal in weight, an all-secondary group is safest.", dont: "无主次却全用主按钮抢视觉。", dontEn: "Make every button primary when none truly leads." },
{ do: "多个按钮之间留出间隔。", doEn: "Leave spacing between adjacent buttons.", dont: "按钮连在一起，易和 Radio / 分段控件混淆。", dontEn: "Glue buttons together so they look like a radio / segmented control." },
{ do: "删除等高风险操作用 destructive 红色按钮，搭配“取消”。", doEn: "Use a destructive (red) button for risky actions like delete, paired with “Cancel”.", dont: "把主按钮“保存”和红色“删除”并排，误导用户。", dontEn: "Place a primary “Save” next to a red “Delete”, misleading users." },
{ do: "文案用明确动词传达操作结果（发布 / 删除 / 登录）。", doEn: "Use clear verbs that convey the outcome (Publish / Delete / Sign in).", dont: "用含糊文案（保存 / 保存并新建）说不清后果。", dontEn: "Use vague labels that don’t spell out the consequence." }];


const buttonAnchors = [
{ label: "调试台", labelEn: "Playground", href: "#playground" },
{ label: "使用方式", labelEn: "Usage", href: "#usage" },
{ label: "API", href: "#props" },
{ label: "语义 DOM", labelEn: "Semantic DOM", href: "#semantic-dom" },
{ label: "正误示例", labelEn: "Do / Don’t", href: "#do-dont" }];


const tokenAnchors = [
{ label: "基础架构", labelEn: "Architecture", href: "#tokens-architecture" },
{ label: "颜色", labelEn: "Colors", href: "#tokens-colors" },
{ label: "排版", labelEn: "Typography", href: "#tokens-typography" },
{ label: "圆角", labelEn: "Radius", href: "#tokens-radius" },
{ label: "阴影", labelEn: "Shadow", href: "#tokens-shadow" },
{ label: "间距", labelEn: "Spacing", href: "#tokens-spacing" },
{ label: "层级", labelEn: "Layer", href: "#tokens-layer" },
{ label: "动效", labelEn: "Motion", href: "#tokens-motion" }];


const tokenColorsAnchors = [
{ label: "主题色", labelEn: "Brand Color", href: "#tokens-colors-seeds" },
{ label: "彩色色板", labelEn: "Chromatic Palette", href: "#tokens-colors-palette" },
{ label: "语义颜色", labelEn: "Semantic Colors", href: "#tokens-colors-semantic" }];

const tokenTypographyAnchors = [
{ label: "字号", labelEn: "Size", href: "#tokens-typography-size" },
{ label: "字重", labelEn: "Weight", href: "#tokens-typography-weight" },
{ label: "字体", labelEn: "Family", href: "#tokens-typography-family" }];

const tokenRadiusAnchors = [
{ label: "圆角档位", labelEn: "Radius scale", href: "#tokens-radius-scale" },
{ label: "计算方式", labelEn: "How computed", href: "#tokens-radius-compute" }];

const tokenSpacingAnchors = [
{ label: "间距档位", labelEn: "Spacing scale", href: "#tokens-spacing-scale" },
{ label: "计算方式", labelEn: "How computed", href: "#tokens-spacing-compute" }];

const tokenShadowAnchors = [
{ label: "阴影档位", labelEn: "Elevation levels", href: "#tokens-shadow-scale" },
{ label: "计算方式", labelEn: "How computed", href: "#tokens-shadow-compute" }];

const tokenMotionAnchors = [
{ label: "时长档位", labelEn: "Duration scale", href: "#tokens-motion-duration" },
{ label: "原语与规则", labelEn: "Primitives & rules", href: "#tokens-motion-primitives" }];

const tokenLayerAnchors = [
{ label: "层级档位", labelEn: "Layer levels", href: "#tokens-layer-scale" },
{ label: "分层逻辑", labelEn: "Layering logic", href: "#tokens-layer-logic" }];

const gridAnchors = [
{ label: "栅格系统", labelEn: "Grid", href: "#grid-system" },
{ label: "响应式断点", labelEn: "Breakpoints", href: "#grid-breakpoints" }];

const layoutAnchors = [
{ label: "页面容器", labelEn: "Containers", href: "#layout-containers" }];


const navMenuAnchors = [
{ label: "调试台", labelEn: "Playground", href: "#nav-menu-playground" },
{ label: "组件总览", labelEn: "Overview", href: "#nav-menu-overview" },
{ label: "场景示例", labelEn: "Scenario examples", href: "#nav-menu-preview" },
{ label: "使用方式", labelEn: "Usage", href: "#nav-menu-usage" },
{ label: "API", href: "#nav-menu-props" },
{ label: "语义 DOM", labelEn: "Semantic DOM", href: "#nav-menu-semantic-dom" },
{ label: "正误示例", labelEn: "Do / Don’t", href: "#nav-menu-do-dont" }];

const navMenuPropRows = [
{ prop: "NavRail / NavRailItem", type: "icon, activeIcon?, label?, active?, boxed?", defaultValue: "—", desc: "一级应用栏（64px）与项；boxed=页面入口形态（白底方块、无白底左圆角选中）。", descEn: "64px app rail and items; boxed = page-entry style." },
{ prop: "NavMenu.collapsed", type: "boolean", defaultValue: "false", desc: "二级面板收起为 48px 图标栏。", descEn: "Collapse the panel to a 48px rail." },
{ prop: "NavMenuItem", type: "icon?, label, active?, indent?, expandable?, expanded?, collapsed?", defaultValue: "—", desc: "菜单项；active 选中、indent 嵌套缩进、expandable 可折叠分组。", descEn: "Menu item; active/indent/expandable group." },
{ prop: "NavMenuHeader / NavMenuSearch / NavMenuFooter", type: "title, viewName? / placeholder, onAdd? / onToggle?", defaultValue: "—", desc: "头部（标题+视图）、搜索行（搜索框+新增）、底部（收起双箭头 + 气泡）。", descEn: "Header / search row / footer (collapse toggle)." }];

const navMenuSemanticDomRows = [
{ part: "[data-slot=\"nav-rail\"] / [data-slot=\"nav-rail-item\"][data-active]", desc: "一级应用栏与项，data-active 标记选中。", descEn: "App rail and items; data-active marks selection." },
{ part: "[data-slot=\"nav-menu\"][data-collapsed]", desc: "二级面板根，data-collapsed 标记收起态。", descEn: "Second-level panel; data-collapsed marks collapsed." },
{ part: "[data-slot=\"nav-menu-item\"][data-active]", desc: "菜单项，data-active 标记选中（浅品牌底）。", descEn: "Menu item; data-active marks selection." },
{ part: "[data-slot=\"nav-menu-header\"] / -search / -list / -footer", desc: "头部 / 搜索 / 列表 / 底部分区。", descEn: "Header / search / list / footer regions." }];

const navMenuDoDontRows = [
{ do: "一级用 NavRail、二级用 NavMenu，可单用也可组合。", doEn: "Use NavRail for level-1, NavMenu for level-2; standalone or combined.", dont: "把整套导航重写成裸 div + 手写样式。", dontEn: "Rewrite the whole nav as raw divs with hand-written styles." },
{ do: "选中态用 active（二级浅品牌底 / 一级白底左圆角 + 主色）。", doEn: "Use active for selection (level-2 tint / level-1 white tab + primary).", dont: "手写 bg-[#xxx] 表达选中。", dontEn: "Hand-code bg-[#xxx] for the selected state." },
{ do: "收起用 collapsed；信息不全处靠气泡补全文案。", doEn: "Use collapsed; rely on tooltip to complete labels.", dont: "收起后直接截断文案不给气泡。", dontEn: "Clip labels on collapse without a tooltip." },
{ do: "图标走 @/lib/icons；选中用面型 activeIcon。", doEn: "Icons from @/lib/icons; use filled activeIcon when selected.", dont: "塞裸 <svg> 或写死图标尺寸/颜色。", dontEn: "Inline raw <svg> or hard-code icon size/color." }];


const iconAnchors = [
{ label: "图标库", labelEn: "Icon Library", href: "#icon-library" },
{ label: "调试台", labelEn: "Playground", href: "#icon-playground" },
{ label: "组件总览", labelEn: "Overview", href: "#icon-overview" },
{ label: "场景示例", labelEn: "Scenario examples", href: "#icon-preview" },
{ label: "使用方式", labelEn: "Usage", href: "#icon-usage" },
{ label: "API", href: "#icon-props" },
{ label: "语义 DOM", labelEn: "Semantic DOM", href: "#icon-semantic-dom" },
{ label: "正误示例", labelEn: "Do / Don’t", href: "#icon-do-dont" }];


const agentSurfaceAnchors = [
{ label: "组件总览", labelEn: "Overview", href: "#agent-surface-overview" },
{ label: "高频场景", labelEn: "Scenarios", href: "#agent-surface-scenarios" },
{ label: "视觉规范", labelEn: "Visual", href: "#agent-surface-visual" },
{ label: "Mock 预览", labelEn: "Mock preview", href: "#agent-surface-playground" },
{ label: "实时示例", labelEn: "Live example", href: "#agent-surface-demo" },
{ label: "JSON 协议", labelEn: "JSON protocol", href: "#agent-surface-schema" },
{ label: "协议取舍", labelEn: "Protocol strategy", href: "#agent-surface-strategy" },
{ label: "安全边界", labelEn: "Safety", href: "#agent-surface-safety" }];


const inputAnchors = [
{ label: "组件总览", href: "#input-overview" },
{ label: "场景示例", href: "#input-preview" },
{ label: "使用方式", href: "#input-usage" },
{ label: "API", href: "#input-props" },
{ label: "语义 DOM", href: "#input-semantic-dom" },
{ label: "正误示例", href: "#input-do-dont" }];


const inputScenarioExamples = [
{
  id: "default",
  title: "默认输入框",
  intent: "最基础的单行文本录入，搭配 placeholder 提示输入内容。",
  rule: "单独展示控件能力时可以直接用 Input；进入真实表单后放进 Field。",
  code: `<Input placeholder="请输入姓名" />`
},
{
  id: "field",
  title: "标准字段",
  intent: "真实表单里的标准写法，承载 label、输入控件和辅助说明。",
  rule: "使用 FieldGroup + Field + FieldLabel，不用 div/grid 临时拼字段结构。",
  code: `<FieldGroup>\n  <Field>\n    <FieldLabel htmlFor="name">姓名</FieldLabel>\n    <Input id="name" placeholder="请输入姓名" />\n    <FieldDescription>请填写真实姓名。</FieldDescription>\n  </Field>\n</FieldGroup>`
},
{
  id: "disabled",
  title: "禁用状态",
  intent: "字段当前不可编辑（如只读详情、依赖未满足）。",
  rule: "Field 标记 data-disabled，Input 使用 disabled，不要用样式假装禁用。",
  code: `<Field data-disabled>\n  <FieldLabel htmlFor="readonly-name">姓名</FieldLabel>\n  <Input id="readonly-name" disabled placeholder="不可编辑" />\n</Field>`
},
{
  id: "invalid",
  title: "校验失败",
  intent: "提交校验未通过时，提示用户当前字段有误。",
  rule: "Field 标记 data-invalid，Input 使用 aria-invalid，并通过 FieldError 输出错误文案。",
  code: `<Field data-invalid>\n  <FieldLabel htmlFor="email">邮箱</FieldLabel>\n  <Input id="email" aria-invalid placeholder="请输入邮箱" />\n  <FieldError>请输入有效邮箱。</FieldError>\n</Field>`
}];


const inputPropRows = [
{ prop: "type", type: "string", defaultValue: "text", desc: "原生 input 类型（text / number / password / email …）" },
{ prop: "disabled", type: "boolean", defaultValue: "false", desc: "禁用输入，触发禁用态样式" },
{ prop: "aria-invalid", type: "boolean", defaultValue: "false", desc: "标记当前值未通过校验，触发错误态样式" },
{ prop: "placeholder", type: "string", defaultValue: "—", desc: "占位提示文字" },
{ prop: "className", type: "string", defaultValue: "—", desc: "在保留基础样式的前提下追加 Tailwind 类名" },
{ prop: "...props", type: "React.ComponentProps<\"input\">", defaultValue: "—", desc: "透传所有原生 input 属性（value / onChange / name / required 等）" }];


const inputSemanticDomRows = [
{ part: "data-slot=\"input\"", desc: "标记输入框根节点，供样式选择器和测试定位使用" },
{ part: "data-slot=\"field\"", desc: "Field 字段容器，承载 label、control、description 和 error 的语义分组" },
{ part: "data-slot=\"field-label\"", desc: "字段标签，通常通过 htmlFor 与 Input 的 id 关联" },
{ part: "data-slot=\"field-error\"", desc: "字段错误文案，使用 role=\"alert\" 向辅助技术宣布错误" },
{ part: "aria-invalid", desc: "校验失败态的语义标记，同时驱动错误态样式" },
{ part: "disabled", desc: "原生禁用属性，驱动禁用态样式并阻止交互" }];


const inputDoDontRows = [
{ do: "真实表单字段使用 FieldGroup + Field + FieldLabel + Input。", dont: "用 div/grid 临时拼一个字段结构。" },
{ do: "校验失败时 Field 设置 data-invalid，Input 设置 aria-invalid，并展示 FieldError。", dont: "手写红色边框 className 来表示错误态。" },
{ do: "用 data-disabled + disabled 表达不可编辑。", dont: "用样式伪装禁用（如降低透明度但仍可输入）。" },
{ do: "通过 className 追加间距、宽度等布局类。", dont: "覆盖输入框自身的边框、圆角、内边距等基础视觉。" }];


const selectAnchors = [
{ label: "组件总览", href: "#select-overview" },
{ label: "场景示例", href: "#select-preview" },
{ label: "使用方式", href: "#select-usage" },
{ label: "API", href: "#select-props" },
{ label: "语义 DOM", href: "#select-semantic-dom" },
{ label: "正误示例", href: "#select-do-dont" }];


const selectScenarioExamples = [
{
  id: "default",
  title: "默认选择器",
  intent: "从一组互斥选项中选择一个值，触发器宽度自适应。",
  rule: "用 SelectValue 的 placeholder 表达未选择态，不手写空字符串占位。",
  code: `<Select>\n  <SelectTrigger className="w-[180px]">\n    <SelectValue placeholder="请选择角色" />\n  </SelectTrigger>\n  <SelectContent>\n    <SelectItem value="admin">管理员</SelectItem>\n    <SelectItem value="member">成员</SelectItem>\n  </SelectContent>\n</Select>`
},
{
  id: "grouped",
  title: "分组选项",
  intent: "选项较多需要按类别归组时，用 SelectGroup + SelectLabel 标记分组标题。",
  rule: "分组标题用 SelectLabel，不要用普通文本伪造分组标题。",
  code: `<SelectContent>\n  <SelectGroup>\n    <SelectLabel>常用</SelectLabel>\n    <SelectItem value="cn">中国</SelectItem>\n    <SelectItem value="us">美国</SelectItem>\n  </SelectGroup>\n</SelectContent>`
},
{
  id: "small",
  title: "紧凑尺寸",
  intent: "用于工具栏、表格筛选等空间紧张的场景。",
  rule: "用 size=\"sm\" 切换尺寸，不手写高度类覆盖。",
  code: `<SelectTrigger size="sm" className="w-[140px]">\n  <SelectValue placeholder="筛选状态" />\n</SelectTrigger>`
},
{
  id: "disabled",
  title: "禁用状态",
  intent: "选择器当前不可操作（如依赖项未满足）。",
  rule: "用原生 disabled，不要用样式假装禁用。",
  code: `<Select disabled>\n  <SelectTrigger className="w-[180px]">\n    <SelectValue placeholder="暂不可选择" />\n  </SelectTrigger>\n</Select>`
}];


const selectPropRows = [
{ prop: "value / defaultValue", type: "string", defaultValue: "—", desc: "受控 / 非受控的当前选中值" },
{ prop: "onValueChange", type: "(value: string) => void", defaultValue: "—", desc: "选中值变化时的回调" },
{ prop: "disabled", type: "boolean", defaultValue: "false", desc: "禁用整个选择器" },
{ prop: "size", type: "\"sm\" | \"default\"", defaultValue: "default", desc: "SelectTrigger 的尺寸（影响高度和圆角）" },
{ prop: "value（SelectItem）", type: "string", defaultValue: "—", desc: "选项的取值，需要在选项集合内唯一" }];


const selectSemanticDomRows = [
{ part: "data-slot=\"select-trigger\"", desc: "选择器触发按钮，承载边框、圆角、尺寸样式" },
{ part: "data-slot=\"select-value\"", desc: "展示当前选中值或 placeholder 的文本节点" },
{ part: "data-slot=\"select-content\"", desc: "下拉浮层容器，承载阴影、动效、滚动" },
{ part: "data-slot=\"select-item\"", desc: "单个选项节点，包含选中态指示图标" },
{ part: "data-slot=\"select-group\" / \"select-label\"", desc: "选项分组容器与分组标题" }];


const selectDoDontRows = [
{ do: "用 SelectValue 的 placeholder 表达未选择态。", dont: "手写一个空字符串选项当作占位符。" },
{ do: "选项较多时用 SelectGroup + SelectLabel 分组。", dont: "把分组标题写成普通禁用选项。" },
{ do: "用 size 属性切换紧凑/默认尺寸。", dont: "用 className 覆盖高度、内边距来改尺寸。" },
{ do: "用 disabled 表达不可操作。", dont: "靠样式降低透明度但仍可点击触发。" }];


const checkboxAnchors = [
{ label: "组件总览", href: "#checkbox-overview" },
{ label: "场景示例", href: "#checkbox-preview" },
{ label: "使用方式", href: "#checkbox-usage" },
{ label: "API", href: "#checkbox-props" },
{ label: "语义 DOM", href: "#checkbox-semantic-dom" },
{ label: "正误示例", href: "#checkbox-do-dont" }];


const checkboxScenarioExamples = [
{
  id: "default",
  title: "默认复选框",
  intent: "单个布尔选项的勾选，常见于条款确认、设置开关项。",
  rule: "必须搭配 Label 并通过 id / htmlFor 关联，不能只靠相邻摆放。",
  code: `<div className="flex items-center gap-2">\n  <Checkbox id="agree" />\n  <Label htmlFor="agree">我已阅读并同意服务条款</Label>\n</div>`
},
{
  id: "checked",
  title: "受控选中态",
  intent: "需要在外部状态中读取/控制选中值（如批量选择列表项）。",
  rule: "用 checked + onCheckedChange 受控，不直接操作 DOM。",
  code: `<Checkbox checked={checked} onCheckedChange={setChecked} />`
},
{
  id: "disabled",
  title: "禁用状态",
  intent: "选项当前不可更改（如权限不足、依赖条件未满足）。",
  rule: "用原生 disabled，不要用样式假装禁用。",
  code: `<div className="flex items-center gap-2">\n  <Checkbox id="readonly" disabled />\n  <Label htmlFor="readonly">该选项不可编辑</Label>\n</div>`
},
{
  id: "list",
  title: "列表内勾选",
  intent: "表格、列表里的批量选择项，通常配合表头的全选复选框。",
  rule: "列表项的勾选状态要和表头全选状态联动，避免出现状态不一致。",
  code: `<TableCell>\n  <Checkbox aria-label="选择该行" />\n</TableCell>`
}];


const checkboxPropRows = [
{ prop: "checked / defaultChecked", type: "boolean", defaultValue: "false", desc: "受控 / 非受控的选中状态" },
{ prop: "onCheckedChange", type: "(checked: boolean) => void", defaultValue: "—", desc: "选中状态变化时的回调" },
{ prop: "disabled", type: "boolean", defaultValue: "false", desc: "禁用复选框，阻止交互并触发禁用态样式" },
{ prop: "aria-invalid", type: "boolean", defaultValue: "false", desc: "标记当前选项未通过校验，触发错误态样式" },
{ prop: "id", type: "string", defaultValue: "—", desc: "与 Label 的 htmlFor 关联，建立可访问性映射" }];

const radioGroupAnchors = [
{ label: "组件总览", href: "#radio-group-overview" },
{ label: "使用方式", href: "#radio-group-usage" },
{ label: "API", href: "#radio-group-props" },
{ label: "语义 DOM", href: "#radio-group-semantic-dom" },
{ label: "正误示例", href: "#radio-group-do-dont" }];

const radioGroupPropRows = [
{ prop: "RadioGroup", type: "value? / defaultValue? / onValueChange?", defaultValue: "—", desc: "单选组容器，负责管理同组单选项的互斥选择。" },
{ prop: "RadioGroupItem", type: "value / disabled / aria-invalid", defaultValue: "—", desc: "单个单选项，value 必须能唯一标识该选项。" }];

const radioGroupSemanticDomRows = [
{ part: "data-slot=\"radio-group\"", desc: "单选组根节点，承载分组布局和选择状态管理。" },
{ part: "data-slot=\"radio-group-item\"", desc: "单个单选项根节点，承载 focus-visible、disabled、data-checked 等状态。" },
{ part: "data-slot=\"radio-group-indicator\"", desc: "选中态指示圆点。" }];

const radioGroupDoDontRows = [
{ do: "表单单选或表格单选列使用 RadioGroup / RadioGroupItem。", dont: "在业务代码里手写 input[type=radio] 并覆盖样式。" },
{ do: "每个 RadioGroupItem 提供唯一 value，并用 Label 或 aria-label 说明含义。", dont: "只展示一个无语义的圆点，让读屏器无法理解选项。" },
{ do: "禁用态使用 disabled。", dont: "靠 opacity 伪装禁用但仍允许交互。" }];


const checkboxSemanticDomRows = [
{ part: "data-slot=\"checkbox\"", desc: "复选框根节点，承载边框、圆角、选中态背景" },
{ part: "data-slot=\"checkbox-indicator\"", desc: "选中态的对勾图标容器，仅在选中时渲染内容" },
{ part: "data-checked", desc: "选中态的语义标记，驱动选中态背景和边框颜色" }];


const checkboxDoDontRows = [
{ do: "搭配 Label 并用 id / htmlFor 关联。", dont: "只让文字在视觉上挨着复选框。" },
{ do: "用 checked + onCheckedChange 做受控状态管理。", dont: "用 ref 直接读写 DOM 节点状态。" },
{ do: "列表批量选择时让行选中态和表头全选状态联动。", dont: "让全选复选框和行复选框各自维护独立状态。" },
{ do: "用 disabled 表达不可更改。", dont: "用样式降低透明度但仍可点击切换。" }];


const switchAnchors = [
{ label: "组件总览", href: "#switch-overview" },
{ label: "场景示例", href: "#switch-preview" },
{ label: "使用方式", href: "#switch-usage" },
{ label: "API", href: "#switch-props" },
{ label: "语义 DOM", href: "#switch-semantic-dom" },
{ label: "正误示例", href: "#switch-do-dont" }];


const switchScenarioExamples = [
{
  id: "default",
  title: "默认开关",
  intent: "立即生效的二元设置项，如通知开关、功能开关。",
  rule: "切换后立即生效，不需要额外的提交按钮；必须搭配 Label。",
  code: `<div className="flex items-center gap-2">\n  <Switch id="notify" />\n  <Label htmlFor="notify">接收消息通知</Label>\n</div>`
},
{
  id: "checked",
  title: "受控状态",
  intent: "需要在外部状态中读取/控制开关值。",
  rule: "用 checked + onCheckedChange 受控，不直接操作 DOM。",
  code: `<Switch checked={enabled} onCheckedChange={setEnabled} />`
},
{
  id: "small",
  title: "紧凑尺寸",
  intent: "用于表格行内、紧凑表单等空间有限的场景。",
  rule: "用 size=\"sm\" 切换尺寸，不手写宽高覆盖。",
  code: `<Switch size="sm" />`
},
{
  id: "disabled",
  title: "禁用状态",
  intent: "开关当前不可操作（如权限不足）。",
  rule: "用原生 disabled，不要用样式假装禁用。",
  code: `<div className="flex items-center gap-2">\n  <Switch id="locked" disabled />\n  <Label htmlFor="locked">该选项不可更改</Label>\n</div>`
}];


const switchPropRows = [
{ prop: "checked / defaultChecked", type: "boolean", defaultValue: "false", desc: "受控 / 非受控的开关状态" },
{ prop: "onCheckedChange", type: "(checked: boolean) => void", defaultValue: "—", desc: "状态变化时的回调，切换后立即触发" },
{ prop: "disabled", type: "boolean", defaultValue: "false", desc: "禁用开关，阻止交互并触发禁用态样式" },
{ prop: "size", type: "\"sm\" | \"default\"", defaultValue: "default", desc: "开关的尺寸（影响轨道和滑块大小）" },
{ prop: "id", type: "string", defaultValue: "—", desc: "与 Label 的 htmlFor 关联，建立可访问性映射" }];


const switchSemanticDomRows = [
{ part: "data-slot=\"switch\"", desc: "开关轨道根节点，承载圆角、开/关态背景色" },
{ part: "data-slot=\"switch-thumb\"", desc: "可滑动的圆形滑块，位移表达开/关状态" },
{ part: "data-checked / data-unchecked", desc: "开关状态的语义标记，驱动轨道颜色和滑块位移" }];


const switchDoDontRows = [
{ do: "用于立即生效的设置项，搭配 Label 说明用途。", dont: "把 Switch 当复选框用在需要批量提交的表单里。" },
{ do: "用 checked + onCheckedChange 做受控状态管理。", dont: "用 ref 直接读写 DOM 节点状态。" },
{ do: "用 size 属性切换紧凑/默认尺寸。", dont: "用 className 覆盖宽高、位移来改尺寸。" },
{ do: "用 disabled 表达不可更改。", dont: "用样式降低透明度但仍可点击切换。" }];


const textareaAnchors = [
{ label: "组件总览", href: "#textarea-overview" },
{ label: "场景示例", href: "#textarea-preview" },
{ label: "使用方式", href: "#textarea-usage" },
{ label: "API", href: "#textarea-props" },
{ label: "语义 DOM", href: "#textarea-semantic-dom" },
{ label: "正误示例", href: "#textarea-do-dont" }];


const textareaScenarioExamples = [
{
  id: "default",
  title: "默认多行输入",
  intent: "录入较长文本，如备注、描述、反馈内容。",
  rule: "高度随内容自适应（field-sizing-content），不要手写固定 rows 撑死高度。",
  code: `<div className="grid gap-2">\n  <Label htmlFor="bio">个人简介</Label>\n  <Textarea id="bio" placeholder="简单介绍一下自己" />\n</div>`
},
{
  id: "disabled",
  title: "禁用状态",
  intent: "字段当前不可编辑（如只读详情）。",
  rule: "用原生 disabled，不要用样式假装禁用。",
  code: `<Textarea disabled placeholder="不可编辑" />`
},
{
  id: "invalid",
  title: "校验失败",
  intent: "提交校验未通过时，提示用户当前字段有误。",
  rule: "用 aria-invalid 触发态，不手写红色边框 className。",
  code: `<Textarea aria-invalid placeholder="请输入至少 10 个字" />`
}];


const textareaPropRows = [
{ prop: "disabled", type: "boolean", defaultValue: "false", desc: "禁用输入，触发禁用态样式" },
{ prop: "aria-invalid", type: "boolean", defaultValue: "false", desc: "标记当前值未通过校验，触发错误态样式" },
{ prop: "placeholder", type: "string", defaultValue: "—", desc: "占位提示文字" },
{ prop: "className", type: "string", defaultValue: "—", desc: "在保留基础样式的前提下追加 Tailwind 类名" },
{ prop: "...props", type: "React.ComponentProps<\"textarea\">", defaultValue: "—", desc: "透传所有原生 textarea 属性（value / onChange / rows / required 等）" }];


const textareaSemanticDomRows = [
{ part: "data-slot=\"textarea\"", desc: "标记多行输入框根节点，供样式选择器和测试定位使用" },
{ part: "aria-invalid", desc: "校验失败态的语义标记，同时驱动错误态样式" },
{ part: "disabled", desc: "原生禁用属性，驱动禁用态样式并阻止交互" }];


const textareaDoDontRows = [
{ do: "搭配 Label 并用 id / htmlFor 关联。", dont: "只让 Label 在视觉上挨着 Textarea。" },
{ do: "让高度跟随内容自适应（默认行为）。", dont: "手写固定 rows 或 height 撑死/限死高度。" },
{ do: "校验失败时设置 aria-invalid。", dont: "手写红色边框 className 来表示错误态。" },
{ do: "用 disabled 表达不可编辑。", dont: "用样式伪装禁用（如降低透明度但仍可输入）。" }];


const tableAnchors = [
{ label: "调试台", href: "#table-playground" },
{ label: "使用方式", href: "#table-usage" },
{ label: "API", href: "#table-props" },
{ label: "语义 DOM", href: "#table-semantic-dom" },
{ label: "正误示例", href: "#table-do-dont" }];


const tablePropRows = [
{ prop: "Table", type: "density? / bordered? / maxHeight?: number | string", defaultValue: "density=\"default\" bordered=false", desc: "外层容器，自带横向滚动；默认表格字级 text-sm；density 用来切换行高（紧凑28 / 默认36 / 宽松42）；maxHeight 配合 TableHeader sticky 启用稳定纵向滚动（自带 overscroll-contain 防回弹）；bordered 套圆角描边卡片" },
{ prop: "TableHeader", type: "sticky?: boolean", defaultValue: "false", desc: "表头容器；sticky 时滚动吸顶（需外层固定高度 + overflow-auto）" },
{ prop: "TableBody / TableFooter", type: "组件", defaultValue: "—", desc: "表体 / 表尾分组容器，对应 tbody / tfoot" },
{ prop: "TableRow", type: "data-state?: \"selected\"", defaultValue: "—", desc: "表格行，自带 hover 态；data-state=selected 高亮选中行" },
{ prop: "TableHead", type: "align? / pinned? / frozenLeft? / frozenEdge? / sortable? / filterContent? / filtered? / menuActions?", defaultValue: "—", desc: "表头单元格：align 对齐、pinned 单列贴边、frozenLeft 冻结到此列(传累加 left 偏移)+frozenEdge 标记冻结区末列加阴影、sortable 排序、filterContent 列筛选弹层、filtered 筛选高亮、menuActions 列操作 ⋮ 菜单；默认字重比正文略高，但不做夸张强调" },
{ prop: "TableCell", type: "align?: \"left\"|\"center\"|\"right\" / pinned?: \"left\"|\"right\"", defaultValue: "—", desc: "数据单元格：align 对齐（数字常用 right），pinned 横向滚动时贴边固定" },
{ prop: "TableCaption", type: "组件", defaultValue: "—", desc: "表格的整体说明文字，渲染在表格下方" }];


const tableSemanticDomRows = [
{ part: "data-slot=\"table-container\"", desc: "表格最外层滚动容器，承载横向滚动，以及 bordered / maxHeight 等容器能力；横向滚动后带 data-scrolled-x=true，用于固定列阴影。" },
{ part: "data-slot=\"table\"", desc: "真正的 <table> 根节点，承载密度 data-density 和表格内容。" },
{ part: "data-slot=\"table-header\"", desc: "表头分组容器；sticky 时吸顶，靠底边线与表体区分。" },
{ part: "data-slot=\"table-row\"", desc: "数据行节点，承载 hover、选中态背景" },
{ part: "data-slot=\"table-head\" / \"table-cell\"", desc: "表头单元格 / 数据单元格，承载内边距和对齐方式" }];


const tableDoDontRows = [
{ do: "用 TableHeader/TableBody/TableRow 等语义子组件搭表格。", dont: "用一堆 div + Tailwind grid 手搓表格布局。" },
{ do: "需要整体说明时用 TableCaption。", dont: "在表格上方再写一段独立的 <p> 当说明文字。" },
{ do: "状态类内容用 Badge 包裹展示。", dont: "用纯文字加颜色 className 表达状态。" },
{ do: "宽表格让 Table 的外层容器自己处理横向滚动。", dont: "给每个单元格分别设置 overflow 和宽度。" }];


const cardAnchors = [
{ label: "调试台", labelEn: "Playground", href: "#card-playground" },
{ label: "组件总览", href: "#card-overview" },
{ label: "场景示例", href: "#card-preview" },
{ label: "使用方式", href: "#card-usage" },
{ label: "API", href: "#card-props" },
{ label: "语义 DOM", href: "#card-semantic-dom" },
{ label: "正误示例", href: "#card-do-dont" }];


const cardPropRows = [
{ prop: "Card", type: "组件", defaultValue: "—", desc: "卡片根容器，提供边框、圆角、背景与内部纵向间距" },
{ prop: "CardHeader", type: "组件", defaultValue: "—", desc: "头部分组，包含标题、描述与右上角操作区的网格布局" },
{ prop: "CardTitle / CardDescription", type: "组件", defaultValue: "—", desc: "标题与说明文字，分别承载强调和次要语义" },
{ prop: "CardAction", type: "组件", defaultValue: "—", desc: "头部右上角的操作区（按钮、菜单触发器等），自动定位到网格右侧" },
{ prop: "CardContent / CardFooter", type: "组件", defaultValue: "—", desc: "主体内容区 / 底部操作区，按需选用" }];


const cardSemanticDomRows = [
{ part: "data-slot=\"card\"", desc: "卡片根节点，承载边框、圆角、阴影、背景" },
{ part: "data-slot=\"card-header\"", desc: "头部分组容器，用网格布局自动安排标题/描述/操作区位置" },
{ part: "data-slot=\"card-title\" / \"card-description\"", desc: "标题与说明文字节点，承载字重和颜色语义" },
{ part: "data-slot=\"card-action\"", desc: "头部右上角操作区，依据网格定位规则自动靠右对齐" },
{ part: "data-slot=\"card-content\" / \"card-footer\"", desc: "主体内容区 / 底部区域，承载内边距规范" }];


const cardDoDontRows = [
{ do: "用 CardHeader/CardTitle/CardContent 等子组件搭骨架。", dont: "在 Card 里直接堆 div + 手写间距类名。" },
{ do: "头部右上角操作放进 CardAction，让布局自动对齐。", dont: "用绝对定位把按钮怼到卡片右上角。" },
{ do: "次要说明文字用 CardDescription。", dont: "在 CardTitle 里塞一段长说明文字。" },
{ do: "卡片只承载内容容器职责，交互逻辑放在业务组件里。", dont: "把 Card 包装成带状态管理的黑盒业务组件。" }];


const tagAnchors = [
{ label: "调试台", labelEn: "Playground", href: "#tag-playground" },
{ label: "组件总览", href: "#tag-overview" },
{ label: "场景示例", href: "#tag-preview" },
{ label: "使用方式", href: "#tag-usage" },
{ label: "API", href: "#tag-props" },
{ label: "语义 DOM", href: "#tag-semantic-dom" },
{ label: "正误示例", href: "#tag-do-dont" }];

const badgeAnchors = [
{ label: "组件总览", href: "#badge-overview" },
{ label: "场景示例", href: "#badge-preview" },
{ label: "使用方式", href: "#badge-usage" },
{ label: "API", href: "#badge-props" },
{ label: "语义 DOM", href: "#badge-semantic-dom" },
{ label: "正误示例", href: "#badge-do-dont" }];


const tagScenarioExamples = [
{
  id: "status",
  title: "状态标记",
  intent: "在表格、列表里标记数据的当前状态。",
  rule: "成功态用 success，中性态用 secondary 或 outline，错误态用 destructive。",
  code: `<Tag variant="success">已支付</Tag>\n<Tag variant="secondary">处理中</Tag>\n<Tag variant="destructive">已失败</Tag>`
},
{
  id: "color",
  title: "分类打标（多彩）",
  intent: "给客户/对象贴分类标签，颜色代表类别而非状态（如 高意向、华东区）。",
  rule: "用 color（red/amber/.../purple/pink）软色打标；颜色=类别，不要和状态 variant 混用语义。",
  code: `<Tag color="purple">高意向</Tag>\n<Tag color="blue">华东区</Tag>\n<Tag color="green">已签约</Tag>`
},
{
  id: "icon",
  title: "搭配图标",
  intent: "用图标强化语义，如校验通过、AI 生成标记。",
  rule: "图标放进 Tag 时用 data-icon 标记位置，不手写尺寸覆盖。",
  code: `<Tag variant="secondary">\n  <CheckCircleIcon data-icon="inline-start" />\n  已校验\n</Tag>`
}];


const tagVariantRows = [
{ variant: "default", usage: "品牌强调，主要标记（如当前版本、推荐）" },
{ variant: "success", usage: "成功/完成态（如已支付、已完成、校验通过）" },
{ variant: "warning", usage: "提醒/警告态（如待审核、即将到期、VIP 标记）" },
{ variant: "secondary", usage: "中性态，次要或过程态信息（如处理中、草稿）" },
{ variant: "destructive", usage: "错误/警示态（如已失败、已过期）" },
{ variant: "outline", usage: "弱化态，适合密集列表中的轻量标签" }];

const tagColorList = ["red", "amber", "yellow", "lime", "green", "teal", "cyan", "blue", "purple", "pink"] as const;

const tagPropRows = [
{ prop: "variant", type: "\"default\" | \"secondary\" | \"destructive\" | \"success\" | \"warning\" | \"outline\"", defaultValue: "default", desc: "状态语义配色" },
{ prop: "color", type: "\"none\" | \"red\" | \"amber\" | … | \"purple\" | \"pink\"", defaultValue: "none", desc: "分类打标多彩软色（设置后覆盖 variant 配色），颜色=类别" },
{ prop: "render", type: "ReactElement | (props, state) => ReactElement", defaultValue: "—", desc: "自定义根节点渲染（Base UI render）" },
{ prop: "className", type: "string", defaultValue: "—", desc: "在保留基础样式的前提下追加布局/间距类名" }];


const badgePropRows = [
{ prop: "dot", type: "boolean", defaultValue: "false", desc: "红点（不显示数字）" },
{ prop: "count", type: "number", defaultValue: "—", desc: "未读数；超过 max 显示「max+」" },
{ prop: "max", type: "number", defaultValue: "99", desc: "数字溢出阈值" },
{ prop: "showZero", type: "boolean", defaultValue: "false", desc: "count<=0 时是否仍显示 0" },
{ prop: "tone", type: "\"destructive\" | \"primary\"", defaultValue: "destructive", desc: "角标配色" }];

const badgeScenarioExamples = [
{ id: "dot", title: "红点", intent: "图标/导航上的「有更新」提示，无需具体数量。", rule: "dot 包裹载体，自动定位右上角。", code: `<Badge dot>\n  <BellIcon />\n</Badge>` },
{ id: "count", title: "未读数", intent: "通知/消息的未读条数。", rule: "用 count；count<=0 默认不渲染（showZero 强制 0）。", code: `<Badge count={5}>\n  <BellIcon />\n</Badge>` },
{ id: "overflow", title: "溢出 99+", intent: "数量很大时收口，避免撑宽。", rule: "用 max 设阈值，超出显示「max+」。", code: `<Badge count={120} max={99}>\n  <BellIcon />\n</Badge>` }];


const tagSemanticDomRows = [
{ part: "slot: \"tag\"", desc: "源码传给 Base UI useRender 的状态，标记标签根节点" },
{ part: "data-icon=\"inline-start\" / \"inline-end\"", desc: "标记图标在文字前/后的位置，驱动间距样式" }];


const tagDoDontRows = [
{ do: "状态用 variant（成功/中性/错误），分类打标用 color。", dont: "用自定义颜色 className 硬造标签。" },
{ do: "内容保持简短（状态词、分类词、图标+短词）。", dont: "把长句子塞进 Tag。" },
{ do: "图标用 data-icon 标记位置。", dont: "手写图标尺寸覆盖默认布局。" },
{ do: "需要跳转用链接或 Button。", dont: "给 Tag 加 onClick 当按钮用。" }];


const badgeSemanticDomRows = [
{ part: "data-slot=\"badge\"", desc: "角标本体（红点/数字），承载圆角、底色与反白文字" },
{ part: "data-slot=\"badge-root\"", desc: "传 children 时包裹载体的相对定位容器" }];


const badgeDoDontRows = [
{ do: "角标 dot 表示有更新、count 表示未读数。", dont: "用角标承载行内状态/分类标签（那是 Tag）。" },
{ do: "数字溢出用 max（显示「max+」）。", dont: "把长文本塞进角标。" },
{ do: "用 children 包裹载体自动定位右上角。", dont: "用 className 硬改定位/配色。" }];


const tooltipAnchors = [
{ label: "组件总览", href: "#tooltip-overview" },
{ label: "场景示例", href: "#tooltip-preview" },
{ label: "使用方式", href: "#tooltip-usage" },
{ label: "API", href: "#tooltip-props" },
{ label: "语义 DOM", href: "#tooltip-semantic-dom" },
{ label: "正误示例", href: "#tooltip-do-dont" }];


const tooltipScenarioExamples = [
{
  id: "icon-button",
  title: "纯图标按钮说明",
  intent: "为没有文字标签的图标按钮补充说明，弥补可访问性缺口。",
  rule: "纯图标按钮必须同时提供 aria-label 和 Tooltip，二者互补不互相替代。",
  code: `<Tooltip>\n  <TooltipTrigger render={<Button variant="ghost" size="icon-sm" aria-label="设置" />}>\n    <SettingsIcon />\n  </TooltipTrigger>\n  <TooltipContent>设置</TooltipContent>\n</Tooltip>`
},
{
  id: "truncated-text",
  title: "截断文本补全",
  intent: "表格、列表里文字被截断时，悬浮展示完整内容。",
  rule: "只在内容确实被截断时使用，不要给完整可见的文本套 Tooltip。",
  code: `<Tooltip>\n  <TooltipTrigger render={<span className="truncate">{fullName}</span>} />\n  <TooltipContent>{fullName}</TooltipContent>\n</Tooltip>`
},
{
  id: "side",
  title: "自定义弹出方向",
  intent: "根据触发元素在页面中的位置调整提示弹出方向，避免被遮挡。",
  rule: "用 side 属性控制方向，不手写定位偏移。",
  code: `<TooltipContent side="right">更多说明</TooltipContent>`
}];


const tooltipPropRows = [
{ prop: "TooltipProvider", type: "组件", defaultValue: "delay=0", desc: "全局提供者，统一控制一组 Tooltip 的延迟时间，通常包一层在应用根部" },
{ prop: "Tooltip", type: "组件", defaultValue: "—", desc: "根节点，管理开关状态" },
{ prop: "TooltipTrigger", type: "组件", defaultValue: "—", desc: "触发元素，常用 render 把已有元素（如 Button）作为触发器" },
{ prop: "side", type: "\"top\" | \"right\" | \"bottom\" | \"left\"", defaultValue: "top", desc: "提示内容相对触发元素的弹出方向" },
{ prop: "sideOffset", type: "number", defaultValue: "4", desc: "提示内容与触发元素之间的间距（像素）" }];


const tooltipSemanticDomRows = [
{ part: "data-slot=\"tooltip-trigger\"", desc: "触发元素节点，悬浮/聚焦时唤起提示" },
{ part: "data-slot=\"tooltip-content\"", desc: "提示气泡内容容器，承载背景、圆角、动效" },
{ part: "data-slot=\"tooltip-provider\"", desc: "提供者节点，统一管理一组 Tooltip 的显隐延迟" }];


const tooltipDoDontRows = [
{ do: "为纯图标按钮、截断文本等缺信息场景补充说明。", dont: "给已经有完整可见文字的元素也套 Tooltip。" },
{ do: "内容保持简短的一句话说明。", dont: "把操作说明文档、长段落塞进 Tooltip。" },
{ do: "用 side / sideOffset 控制弹出方向避免遮挡。", dont: "手写绝对定位坐标来调整提示位置。" }];


const dialogAnchors = [
{ label: "组件总览", href: "#dialog-overview" },
{ label: "场景示例", href: "#dialog-preview" },
{ label: "使用方式", href: "#dialog-usage" },
{ label: "API", href: "#dialog-props" },
{ label: "语义 DOM", href: "#dialog-semantic-dom" },
{ label: "正误示例", href: "#dialog-do-dont" }];


const dialogScenarioExamples = [
{
  id: "form",
  title: "表单弹窗",
  intent: "在不离开当前页面的情况下完成新建/编辑等结构化录入。",
  rule: "Footer 操作按钮顺序为「取消在左、主操作在右」，主操作用 default variant。",
  code: `<Dialog>\n  <DialogTrigger render={<Button>新建项目</Button>} />\n  <DialogContent>\n    <DialogHeader>\n      <DialogTitle>新建项目</DialogTitle>\n      <DialogDescription>填写基本信息后即可创建</DialogDescription>\n    </DialogHeader>\n    <div className="grid gap-4 py-2">\n      <Input placeholder="项目名称" />\n    </div>\n    <DialogFooter>\n      <DialogClose render={<Button variant="outline">取消</Button>} />\n      <Button>创建</Button>\n    </DialogFooter>\n  </DialogContent>\n</Dialog>`
},
{
  id: "confirm",
  title: "确认弹窗",
  intent: "对有一定影响但非破坏性的操作进行二次确认。",
  rule: "标题用一句话讲清后果，避免堆砌长段说明。",
  code: `<DialogContent>\n  <DialogHeader>\n    <DialogTitle>确认发布该版本？</DialogTitle>\n    <DialogDescription>发布后用户将立即看到最新内容。</DialogDescription>\n  </DialogHeader>\n  <DialogFooter>\n    <DialogClose render={<Button variant="outline">再想想</Button>} />\n    <Button>确认发布</Button>\n  </DialogFooter>\n</DialogContent>`
}];


const dialogPropRows = [
{ prop: "Dialog", type: "组件", defaultValue: "—", desc: "根节点，管理弹窗开关状态（受控用 open / onOpenChange）" },
{ prop: "DialogTrigger", type: "组件", defaultValue: "—", desc: "触发器，常用 render 把 Button 作为触发元素" },
{ prop: "DialogContent", type: "组件", defaultValue: "—", desc: "弹窗主体容器，自带遮罩、动效、关闭按钮" },
{ prop: "DialogHeader / DialogFooter", type: "组件", defaultValue: "—", desc: "头部（标题+描述）/ 底部操作区的布局分组" },
{ prop: "DialogTitle / DialogDescription", type: "组件", defaultValue: "—", desc: "标题与说明文字，提供无障碍语义关联" },
{ prop: "DialogClose", type: "组件", defaultValue: "—", desc: "关闭触发器，常用 render 包裹「取消」按钮" }];


const dialogSemanticDomRows = [
{ part: "data-slot=\"dialog-overlay\"", desc: "遮罩层，承载半透明背景与淡入淡出动效" },
{ part: "data-slot=\"dialog-content\"", desc: "弹窗主体容器，承载圆角、阴影、缩放动效" },
{ part: "data-slot=\"dialog-title\" / \"dialog-description\"", desc: "标题与说明，通过 aria 属性与弹窗根节点关联" },
{ part: "data-slot=\"dialog-close\"", desc: "关闭触发器，点击后关闭弹窗并恢复焦点" }];


const dialogDoDontRows = [
{ do: "用 DialogTitle / DialogDescription 提供无障碍语义。", dont: "在 DialogContent 里直接写 <h2>/<p> 替代它们。" },
{ do: "Footer 按钮「取消在左、主操作在右」。", dont: "把多个同等重要的操作平铺排列不分主次。" },
{ do: "只承载需要聚焦完成的单一任务。", dont: "在弹窗里嵌套另一个弹窗或塞入整页面的内容。" },
{ do: "用 DialogClose 包裹取消/关闭按钮。", dont: "手写 onClick 调用 setOpen(false) 来关闭。" }];


const alertDialogAnchors = [
{ label: "组件总览", href: "#alert-dialog-overview" },
{ label: "场景示例", href: "#alert-dialog-preview" },
{ label: "使用方式", href: "#alert-dialog-usage" },
{ label: "API", href: "#alert-dialog-props" },
{ label: "语义 DOM", href: "#alert-dialog-semantic-dom" },
{ label: "正误示例", href: "#alert-dialog-do-dont" }];


const alertDialogScenarioExamples = [
{
  id: "destructive",
  title: "破坏性操作确认",
  intent: "删除、清空等不可逆操作前，强制用户二次确认。",
  rule: "必须由用户主动选择，不能点击遮罩或按 Esc 关闭；主操作用 destructive variant。",
  code: `<AlertDialog>\n  <AlertDialogTrigger render={<Button variant="destructive">删除项目</Button>} />\n  <AlertDialogContent>\n    <AlertDialogHeader>\n      <AlertDialogTitle>确认删除该项目？</AlertDialogTitle>\n      <AlertDialogDescription>删除后数据无法恢复，请谨慎操作。</AlertDialogDescription>\n    </AlertDialogHeader>\n    <AlertDialogFooter>\n      <AlertDialogCancel render={<Button variant="outline">取消</Button>} />\n      <AlertDialogAction render={<Button variant="destructive">确认删除</Button>} />\n    </AlertDialogFooter>\n  </AlertDialogContent>\n</AlertDialog>`
},
{
  id: "leave",
  title: "离开未保存提示",
  intent: "用户在有未保存改动时尝试离开页面/关闭弹窗，提醒可能丢失数据。",
  rule: "标题直接说明后果（“未保存的修改将丢失”），不绕弯子。",
  code: `<AlertDialogContent>\n  <AlertDialogHeader>\n    <AlertDialogTitle>放弃当前修改？</AlertDialogTitle>\n    <AlertDialogDescription>未保存的修改将会丢失。</AlertDialogDescription>\n  </AlertDialogHeader>\n  <AlertDialogFooter>\n    <AlertDialogCancel render={<Button variant="outline">继续编辑</Button>} />\n    <AlertDialogAction render={<Button variant="destructive">放弃修改</Button>} />\n  </AlertDialogFooter>\n</AlertDialogContent>`
}];


const alertDialogPropRows = [
{ prop: "AlertDialog", type: "组件", defaultValue: "—", desc: "根节点，管理弹窗开关状态，默认不可通过遮罩/Esc 关闭" },
{ prop: "AlertDialogTrigger", type: "组件", defaultValue: "—", desc: "触发器，常用 render 把 Button 作为触发元素" },
{ prop: "AlertDialogContent", type: "组件", defaultValue: "—", desc: "弹窗主体容器，自带遮罩与动效，语义上标记为 alertdialog" },
{ prop: "AlertDialogAction", type: "组件", defaultValue: "—", desc: "确认/继续操作的触发器，通常搭配 destructive 或 default Button" },
{ prop: "AlertDialogCancel", type: "组件", defaultValue: "—", desc: "取消操作的触发器，点击后关闭弹窗且不执行后续动作" }];


const alertDialogSemanticDomRows = [
{ part: "role=\"alertdialog\"", desc: "弹窗主体的无障碍角色，区别于普通 dialog，强调需要立即关注" },
{ part: "data-slot=\"alert-dialog-action\"", desc: "确认/继续操作触发器，承载主操作语义" },
{ part: "data-slot=\"alert-dialog-cancel\"", desc: "取消触发器，承载次要操作语义" },
{ part: "data-slot=\"alert-dialog-title\" / \"...-description\"", desc: "标题与说明，通过 aria 属性与弹窗根节点关联" }];


const alertDialogDoDontRows = [
{ do: "只用于不可逆或有重大影响的操作确认。", dont: "把它当成普通信息提示弹窗滥用。" },
{ do: "标题一句话讲清后果，Description 补充细节。", dont: "把警示信息和操作步骤混写在标题里。" },
{ do: "破坏性主操作用 AlertDialogAction + destructive Button。", dont: "把取消和确认按钮做成视觉同等强调，让用户难以分辨主次。" },
{ do: "保持默认的强制确认行为（不可点遮罩关闭）。", dont: "额外加逻辑让用户能绕过确认直接关闭。" }];


const sheetAnchors = [
{ label: "组件总览", href: "#sheet-overview" },
{ label: "场景示例", href: "#sheet-preview" },
{ label: "使用方式", href: "#sheet-usage" },
{ label: "API", href: "#sheet-props" },
{ label: "语义 DOM", href: "#sheet-semantic-dom" },
{ label: "正误示例", href: "#sheet-do-dont" }];


const sheetScenarioExamples = [
{
  id: "right-form",
  title: "右侧编辑面板",
  intent: "在不离开当前列表上下文的情况下查看/编辑一条记录的详情。",
  rule: "默认从右侧滑出（side=\"right\"），保持和列表的空间关系。",
  code: `<Sheet>\n  <SheetTrigger render={<Button variant="outline">编辑</Button>} />\n  <SheetContent side="right">\n    <SheetHeader>\n      <SheetTitle>编辑成员</SheetTitle>\n      <SheetDescription>修改信息后点击保存生效</SheetDescription>\n    </SheetHeader>\n    <div className="grid gap-4 px-4">\n      <Input placeholder="姓名" />\n    </div>\n    <SheetFooter>\n      <Button>保存</Button>\n      <SheetClose render={<Button variant="outline">取消</Button>} />\n    </SheetFooter>\n  </SheetContent>\n</Sheet>`
},
{
  id: "bottom-actions",
  title: "底部操作面板",
  intent: "移动端常见的底部弹出操作列表，承载一组相关操作。",
  rule: "用 side=\"bottom\"，操作项保持简短并按重要性排序。",
  code: `<SheetContent side="bottom">\n  <SheetHeader>\n    <SheetTitle>更多操作</SheetTitle>\n  </SheetHeader>\n  <div className="flex flex-col gap-2 px-4 pb-4">\n    <Button variant="outline">分享</Button>\n    <Button variant="outline">归档</Button>\n    <Button variant="destructive">删除</Button>\n  </div>\n</SheetContent>`
}];


const sheetPropRows = [
{ prop: "Sheet", type: "组件", defaultValue: "—", desc: "根节点，管理面板开关状态" },
{ prop: "SheetTrigger", type: "组件", defaultValue: "—", desc: "触发器，常用 render 把 Button 作为触发元素" },
{ prop: "SheetContent", type: "组件", defaultValue: "—", desc: "面板主体容器，自带遮罩与滑入/滑出动效" },
{ prop: "side", type: "\"top\" | \"right\" | \"bottom\" | \"left\"", defaultValue: "right", desc: "面板从屏幕哪一侧滑出" },
{ prop: "SheetHeader / SheetFooter", type: "组件", defaultValue: "—", desc: "头部（标题+描述）/ 底部操作区的布局分组" },
{ prop: "SheetClose", type: "组件", defaultValue: "—", desc: "关闭触发器，常用 render 包裹「取消」按钮" }];


const sheetSemanticDomRows = [
{ part: "data-slot=\"sheet-overlay\"", desc: "遮罩层，承载半透明背景与淡入淡出动效" },
{ part: "data-slot=\"sheet-content\"", desc: "面板主体容器，依据 side 承载对应方向的滑入动效" },
{ part: "data-slot=\"sheet-title\" / \"sheet-description\"", desc: "标题与说明，通过 aria 属性与面板根节点关联" },
{ part: "data-slot=\"sheet-close\"", desc: "关闭触发器，点击后关闭面板并恢复焦点" }];


const sheetDoDontRows = [
{ do: "用于不离开当前上下文的查看/编辑/操作场景。", dont: "把它当成独立页面使用，塞入与列表无关的大量内容。" },
{ do: "依据使用习惯选择 side（详情用 right，操作用 bottom）。", dont: "随意选择滑出方向，造成跨页面体验不一致。" },
{ do: "用 SheetClose 包裹取消/关闭按钮。", dont: "手写 onClick 调用 setOpen(false) 来关闭。" },
{ do: "内容较多时让 SheetContent 内部自行滚动。", dont: "把面板撑到超出可视区域导致整页滚动错位。" }];


const skeletonAnchors = [
{ label: "组件总览", href: "#skeleton-overview" },
{ label: "场景示例", href: "#skeleton-preview" },
{ label: "使用方式", href: "#skeleton-usage" },
{ label: "API", href: "#skeleton-props" },
{ label: "语义 DOM", href: "#skeleton-semantic-dom" },
{ label: "正误示例", href: "#skeleton-do-dont" }];


const skeletonScenarioExamples = [
{
  id: "text-lines",
  title: "文本占位",
  intent: "在文本内容加载完成前，用占位条提示用户内容即将出现。",
  rule: "宽度参差体现真实文本的不规则感，行间距与正文一致。",
  code: `<div className="flex flex-col gap-2">\n  <Skeleton className="h-4 w-[240px]" />\n  <Skeleton className="h-4 w-[180px]" />\n</div>`
},
{
  id: "card-media",
  title: "卡片占位",
  intent: "在头像、图片等媒体型卡片加载前，组合圆形与矩形占位还原结构。",
  rule: "圆形用于头像，矩形用于文本行，整体比例尽量贴近真实内容。",
  code: `<div className="flex items-center gap-4">\n  <Skeleton className="size-12 rounded-full" />\n  <div className="flex flex-col gap-2">\n    <Skeleton className="h-4 w-[160px]" />\n    <Skeleton className="h-4 w-[120px]" />\n  </div>\n</div>`
}];


const skeletonPropRows = [
{ prop: "Skeleton", type: "React.ComponentProps<\"div\">", defaultValue: "—", desc: "本质是一个带 animate-pulse 动效的 div，通过 className 控制宽高、形状。" },
{ prop: "className", type: "string", defaultValue: "—", desc: "用于设置宽度、高度、圆角（如 rounded-full 做头像占位）。" }];


const skeletonSemanticDomRows = [
{ part: "[data-slot=\"skeleton\"]", desc: "占位元素本体，自带 animate-pulse 呼吸动画与 bg-muted 底色。" }];


const skeletonDoDontRows = [
{ do: "按真实内容的结构和比例摆放占位块。", dont: "用一整块大灰条糊弄所有内容类型。" },
{ do: "加载完成后立刻替换为真实内容，避免占位停留过久。", dont: "让骨架屏长时间展示，给用户「卡住了」的错觉。" },
{ do: "圆形头像用 rounded-full，文本行用矩形条。", dont: "所有占位形状一致，无法预期真实布局。" }];


const avatarAnchors = [
{ label: "组件总览", href: "#avatar-overview" },
{ label: "场景示例", href: "#avatar-preview" },
{ label: "使用方式", href: "#avatar-usage" },
{ label: "API", href: "#avatar-props" },
{ label: "语义 DOM", href: "#avatar-semantic-dom" },
{ label: "正误示例", href: "#avatar-do-dont" }];

const avatarScenarioExamples = [
{
  id: "single",
  title: "单头像",
  group: "type",
  intent: "展示单个用户身份，图片加载失败回退到文字缩写；作入口时可点击跳转。",
  rule: "AvatarFallback 用首字母/图标兜底；作入口时用 render 渲染成 <a>/<button> + cursor-pointer + focus-visible 焦点环，不绑裸 onClick。",
  code: `<Avatar>\n  <AvatarImage src="/avatars/01.jpg" alt="陈昊" />\n  <AvatarFallback>陈</AvatarFallback>\n</Avatar>\n\n// 作入口时\n<Avatar render={<a href="/u/chen" />} className="cursor-pointer hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring">…</Avatar>`
},
{
  id: "shape",
  title: "形状",
  group: "type",
  intent: "用户头像用圆形；企业、项目、群组、应用图标用方形。",
  rule: "shape=\"square\" 切方形，圆角走 token（rounded-lg）。有 logo 放 AvatarImage（配色随 logo）；无 logo 按实体类型用类型图标兜底（彩底白图标反白）：企业 Building / 项目 Folder / 群组 Users / 应用 Apps；也可用名称前缀简称（企业取前 1-2 字，区别于人名取末字）。",
  code: `<Avatar shape="square">\n  <AvatarImage src="/logo.png" alt="项目 A" />\n  <AvatarFallback colorful><FolderFilledIcon /></AvatarFallback>  {/* 项目用 Folder；企业 Building、群组 Users、应用 Apps */}\n</Avatar>`
},
{
  id: "icon",
  title: "图标兜底",
  group: "type",
  intent: "匿名 / 无名用户，连姓名缩写都没有时用通用图标兜底。",
  rule: "AvatarFallback colorful 放面型图标（UserFilledIcon），彩底 + 白图标反白；无姓名 seed 统一取首色。",
  code: `<Avatar>\n  <AvatarFallback colorful><UserFilledIcon /></AvatarFallback>\n</Avatar>`
},
{
  id: "initials",
  title: "文字兜底",
  group: "type",
  intent: "无头像图时，从姓名取缩写 + 按姓名上色区分用户。",
  rule: "缩写用 avatarInitials（中文≤2全取/≥3取末2字、英文单名首字母/全名首末两词首字母，统一大写）；colorful 在 6 色系按 hash 轮循取色（实底 08 + 白字反白）。",
  code: `import { avatarInitials } from "@/components/ui/avatar"\n\n<AvatarFallback colorful>{avatarInitials("欧阳娜娜")}</AvatarFallback> // 娜娜\n<AvatarFallback colorful>{avatarInitials("John Doe")}</AvatarFallback> // JD`
},
{
  id: "style-image",
  title: "图片头像",
  group: "style",
  intent: "优先展示真实头像图。",
  rule: "渲染 AvatarImage，同时保留 AvatarFallback 兜底。",
  code: `<Avatar>\n  <AvatarImage src="/avatars/01.jpg" alt="陈昊" />\n  <AvatarFallback>{avatarInitials("陈昊")}</AvatarFallback>\n</Avatar>`
},
{
  id: "style-neutral",
  title: "中性色兜底",
  group: "color",
  intent: "默认中性兜底，不用彩底区分用户。",
  rule: "不传 colorful，沿用 AvatarFallback 默认 muted 背景与弱化文字。",
  code: `<Avatar>\n  <AvatarFallback>{avatarInitials("陈昊")}</AvatarFallback>\n</Avatar>`
},
{
  id: "style-colorful",
  title: "彩色兜底",
  group: "color",
  intent: "列表里需要更快区分不同用户时使用。",
  rule: "传 colorful，让组件按内容 hash 自动取色；不要手写背景色。",
  code: `<Avatar>\n  <AvatarFallback colorful>{avatarInitials("陈昊")}</AvatarFallback>\n</Avatar>`
},
{
  id: "group",
  title: "头像组",
  group: "type",
  intent: "在评论区、协作者列表等场景堆叠展示多个用户；折叠的 +N 可悬停看全部。",
  rule: "群组默认展示前 3 个头像，第 4 个起折叠为 +N；用 Tooltip 包住 AvatarGroupCount，在 hover/focus 时展示剩余成员。",
  code: `<AvatarGroup>\n  {members.slice(0, 3).map((member) => (\n    <Avatar key={member.name}>\n      <AvatarImage src={member.avatar} alt={member.name} />\n      <AvatarFallback>{avatarInitials(member.name)}</AvatarFallback>\n    </Avatar>\n  ))}\n  <Tooltip>\n    <TooltipTrigger render={<AvatarGroupCount>+3</AvatarGroupCount>} />\n    <TooltipContent>王五、赵六、孙七</TooltipContent>\n  </Tooltip>\n</AvatarGroup>`
},
{
  id: "composite",
  title: "群组拼接",
  group: "type",
  intent: "群聊 / 多人会话头像：把成员头像按人数拼进一个方形宫格。",
  rule: "成员有头像图就拼真实图（AvatarImage），无图才 colorful 文字兜底。每格按 1:1 正方形填满，头像图片撑满格子；单个头像不加圆角。按人数自适应：2 人中线左右两块、3 人上中一块 + 下方两块、4 人田字 2×2、≥5 取前 4。和「堆叠 AvatarGroup」是两种群组模式——群聊用拼接、协作列表用堆叠。",
  code: `<AvatarComposite max={3}>\n  {members.map((member) => (\n    <Avatar key={member.name}>\n      <AvatarImage src={member.avatar} alt={member.name} />\n      <AvatarFallback colorful>{avatarInitials(member.name)}</AvatarFallback>\n    </Avatar>\n  ))}\n</AvatarComposite>`
},
{
  id: "size-xs",
  title: "超小 xs",
  group: "size",
  spec: "20px",
  intent: "表格行内、紧凑列表里的身份标识。",
  rule: "最小档，只放缩写或小图，不塞状态点。",
  code: `<Avatar size="xs"><AvatarFallback>张</AvatarFallback></Avatar>`
},
{
  id: "size-sm",
  title: "小 sm",
  group: "size",
  spec: "24px",
  intent: "列表项、评论区的用户头像。",
  rule: "高密度区域用，配 text-sm 缩写。",
  code: `<Avatar size="sm"><AvatarFallback>张</AvatarFallback></Avatar>`
},
{
  id: "size-default",
  title: "默认 default",
  group: "size",
  spec: "32px",
  intent: "常规身份展示，业务首选档。",
  rule: "大多数场景用这一档。",
  code: `<Avatar><AvatarFallback>张</AvatarFallback></Avatar>`
},
{
  id: "size-lg",
  title: "大 lg",
  group: "size",
  spec: "40px",
  intent: "卡片头部、详情区的强调身份。",
  rule: "需要更强存在感时用。",
  code: `<Avatar size="lg"><AvatarFallback>张</AvatarFallback></Avatar>`
},
{
  id: "size-xl",
  title: "超大 xl",
  group: "size",
  spec: "48px",
  intent: "个人主页、页面级身份展示。",
  rule: "页面级用，不在密集列表里用。",
  code: `<Avatar size="xl"><AvatarFallback>张</AvatarFallback></Avatar>`
}];

const avatarScenarioFilters = [
{ value: "type", label: "类型", labelEn: "Type" },
{ value: "style", label: "样式", labelEn: "Style" },
{ value: "color", label: "颜色", labelEn: "Color" },
{ value: "size", label: "尺寸", labelEn: "Size" }];

const avatarPropRows = [
{ prop: "Avatar.size", type: "\"xs\" | \"sm\" | \"default\" | \"lg\" | \"xl\"", defaultValue: "\"default\"", desc: "尺寸档（20/24/32/40/48），子元素随档联动缩放。" },
{ prop: "Avatar.shape", type: "\"circle\" | \"square\"", defaultValue: "\"circle\"", desc: "形状；square 用 rounded-lg token 圆角，常用于企业/项目/群组。" },
{ prop: "AvatarImage", type: "AvatarPrimitive.Image.Props", defaultValue: "—", desc: "实际图片，加载失败时自动让出位置给 AvatarFallback。" },
{ prop: "AvatarFallback.colorful", type: "boolean", defaultValue: "false", desc: "兜底文字按内容 hash 自动取色板背景色 + 反白文字，便于区分用户。" },
{ prop: "AvatarBadge.status", type: "\"online\" | \"away\" | \"busy\" | \"offline\"", defaultValue: "—", desc: "右下角状态点的 presence 语义色：在线绿 / 离开黄 / 忙红 / 离线灰；随 size 自动缩放。" },
{ prop: "AvatarGroup.max", type: "number", defaultValue: "—", desc: "最多展示几个头像，超出自动折叠为“+N”（AvatarGroupCount）；需要 hover/focus 展示剩余成员时手动渲染 AvatarGroupCount + Tooltip。" }];

const avatarSemanticDomRows = [
{ part: "[data-slot=\"avatar\"][data-size]", desc: "头像容器，data-size 标记当前尺寸档位（default/sm/lg）。" },
{ part: "[data-slot=\"avatar-image\"] / [data-slot=\"avatar-fallback\"]", desc: "图片与兜底内容，二者互斥展示。" },
{ part: "[data-slot=\"avatar-badge\"]", desc: "右下角状态徽标，常用于标记在线/离线。" },
{ part: "[data-slot=\"avatar-group\"] / [data-slot=\"avatar-group-count\"]", desc: "头像组容器与折叠计数占位。" }];

const avatarDoDontRows = [
{ do: "始终提供 AvatarFallback 兜底内容。", dont: "只放 AvatarImage，图裂时显示空白圆圈。" },
{ do: "用首字母缩写（1-2 个字）做兜底文案。", dont: "塞入完整姓名导致文字溢出容器。" },
{ do: "人物用 circle、企业/项目/群组用 square。", dont: "给用户头像用方形、给应用图标用圆形，语义混乱。" },
{ do: "彩色文字头像用 colorful 自动上色。", dont: "给每个头像手写 bg-[#xxx] 背景色。" },
{ do: "头像组用 max 自动折叠 +N。", dont: "无限堆叠头像，挤占横向空间。" }];


const breadcrumbAnchors = [
{ label: "组件总览", href: "#breadcrumb-overview" },
{ label: "场景示例", href: "#breadcrumb-preview" },
{ label: "使用方式", href: "#breadcrumb-usage" },
{ label: "API", href: "#breadcrumb-props" },
{ label: "语义 DOM", href: "#breadcrumb-semantic-dom" },
{ label: "正误示例", href: "#breadcrumb-do-dont" }];

const breadcrumbScenarioFilters = [
{ value: "type", label: "类型", labelEn: "Type" },
{ value: "size", label: "尺寸", labelEn: "Size" }];

const breadcrumbScenarioExamples = [
{
  id: "basic",
  title: "基础路径",
  group: "type",
  intent: "展示当前页面在层级结构中的位置，支持逐级返回。",
  rule: "最后一级用 BreadcrumbPage 标记当前页，不可点击。",
  code: `<Breadcrumb>\n  <BreadcrumbList>\n    <BreadcrumbItem><BreadcrumbLink href="#">首页</BreadcrumbLink></BreadcrumbItem>\n    <BreadcrumbSeparator />\n    <BreadcrumbItem><BreadcrumbPage>详情</BreadcrumbPage></BreadcrumbItem>\n  </BreadcrumbList>\n</Breadcrumb>`
},
{
  id: "icon",
  title: "带图标",
  group: "type",
  intent: "每级前面带图标增强识别，默认不带；图标随字号缩放。",
  rule: "把图标放进 BreadcrumbLink / BreadcrumbPage 的 children（图标在前、文字在后），不手写尺寸。",
  code: `<BreadcrumbItem>\n  <BreadcrumbLink href="#"><HomeIcon />首页</BreadcrumbLink>\n</BreadcrumbItem>`
},
{
  id: "collapsed",
  title: "折叠中间层级",
  group: "type",
  intent: "层级超过 4 级时收起中间项，保留首尾关键节点；点「…」下拉列出被折叠的层级、可跳转。",
  rule: "仅超过 4 级才折叠；BreadcrumbEllipsis 包进 DropdownMenu 做成可点；下拉项是真链接（render 成 <a>），点了跳到该祖先页、面包屑随路由重渲染（纯导航，无选中态）。",
  code: `<BreadcrumbItem>\n  <DropdownMenu>\n    <DropdownMenuTrigger render={<button aria-label="展开折叠的层级"><BreadcrumbEllipsis /></button>} />\n    <DropdownMenuContent align="start">\n      <DropdownMenuItem render={<a href="/activity" />}>活动管理</DropdownMenuItem>\n      <DropdownMenuItem render={<a href="/activity/2024" />}>2024 春季</DropdownMenuItem>\n    </DropdownMenuContent>\n  </DropdownMenu>\n</BreadcrumbItem>`
},
{
  id: "size-lg",
  title: "大 lg",
  group: "size",
  spec: "15px",
  intent: "标题区、详情页头部等强调路径的场景。",
  rule: "BreadcrumbList size=\"lg\"，字号 15。",
  code: `<BreadcrumbList size="lg">…</BreadcrumbList>`
},
{
  id: "size-default",
  title: "默认 default",
  group: "size",
  spec: "13px",
  intent: "常规页面头部路径，业务首选档。",
  rule: "默认档，字号 13（size 可省略，默认即 default）。",
  code: `<BreadcrumbList size="default">…</BreadcrumbList>`
},
{
  id: "size-sm",
  title: "小 sm",
  group: "size",
  spec: "12px",
  intent: "弹窗、卡片内等空间紧凑的路径。",
  rule: "BreadcrumbList size=\"sm\"，字号 12。",
  code: `<BreadcrumbList size="sm">…</BreadcrumbList>`
}];

const breadcrumbPropRows = [
{ prop: "Breadcrumb", type: "React.ComponentProps<\"nav\">", defaultValue: "—", desc: "根容器，自带 aria-label=\"breadcrumb\"。" },
{ prop: "BreadcrumbList / BreadcrumbItem", type: "React.ComponentProps<\"ol\"> / <\"li\">", defaultValue: "—", desc: "列表与列表项，负责排版与间距。" },
{ prop: "BreadcrumbList.size", type: "\"sm\" | \"default\" | \"lg\"", defaultValue: "\"default\"", desc: "尺寸档（12 / 13 / 15px），字号驱动整条面包屑，图标随字号缩放。" },
{ prop: "图标（icon）", type: "ReactNode（放进 Link/Page children）", defaultValue: "—", desc: "默认不带；需要时把图标放进 BreadcrumbLink/BreadcrumbPage 的 children，图标在前、随字号缩放。" },
{ prop: "BreadcrumbLink", type: "render?: ReactElement", defaultValue: "—", desc: "可点击的层级链接，支持 render 自定义底层标签。" },
{ prop: "BreadcrumbPage", type: "React.ComponentProps<\"span\">", defaultValue: "—", desc: "当前页标记，自动加 aria-current=\"page\"，不可点击。" },
{ prop: "BreadcrumbSeparator / BreadcrumbEllipsis", type: "React.ComponentProps<\"li\"> / <\"span\">", defaultValue: "—", desc: "分隔符（默认箭头图标）与省略号折叠占位。" }];

const breadcrumbSemanticDomRows = [
{ part: "[data-slot=\"breadcrumb\"]", desc: "根 nav，带 aria-label=\"breadcrumb\" 供屏幕阅读器识别。" },
{ part: "[data-slot=\"breadcrumb-link\"] / [data-slot=\"breadcrumb-page\"]", desc: "可点击链接与当前页标记，后者带 aria-current。" },
{ part: "[data-slot=\"breadcrumb-separator\"] / [data-slot=\"breadcrumb-ellipsis\"]", desc: "分隔符与折叠占位，均带 aria-hidden。" }];

const breadcrumbDoDontRows = [
{ do: "最后一级用 BreadcrumbPage，标记为当前页且不可点击。", dont: "把当前页也做成可点击链接，造成无意义跳转。" },
{ do: "层级超过 4 级时折叠中间项。", dont: "把所有层级平铺，导致面包屑换行挤占页头。" },
{ do: "链接文案用页面真实名称。", dont: "用 ID 或英文 slug 当文案，用户看不懂。" }];


const buttonGroupAnchors = [
{ label: "API", href: "#button-group-props" },
{ label: "语义 DOM", href: "#button-group-semantic-dom" },
{ label: "正误示例", href: "#button-group-do-dont" }];

const buttonGroupScenarioExamples = [
{
  id: "basic",
  title: "操作组合",
  group: "type",
  intent: "把强相关、同层级的多个操作按钮合并为一组，弱化彼此边界。",
  rule: "只用 ButtonGroup + Button；组内 Button variant 保持一致，不混入互斥选择或危险操作。",
  code: `<ButtonGroup>\n  <Button variant="outline">复制</Button>\n  <Button variant="outline">分享</Button>\n  <Button variant="outline">归档</Button>\n</ButtonGroup>`
},
{
  id: "split",
  title: "拆分按钮",
  group: "type",
  intent: "保留一个主操作，把更多动作收进右侧图标按钮。",
  rule: "主操作在前，右侧图标按钮仍然是 Button；更多动作配 DropdownMenu，不发明 split 专属 API。",
  code: `<ButtonGroup>\n  <Button variant="outline">保存</Button>\n  <Button variant="outline" size="icon-md" aria-label="更多">\n    <ChevronDownIcon />\n  </Button>\n</ButtonGroup>`
},
{
  id: "vertical",
  title: "垂直方向",
  group: "type",
  intent: "用于侧边工具栏、排序控制等需要纵向排列的按钮组。",
  rule: "使用 orientation=\"vertical\"，让组件自动合并上下边框；如有分隔线，切换为 horizontal。",
  code: `<ButtonGroup orientation="vertical">\n  <Button variant="outline">上移</Button>\n  <Button variant="outline">居中</Button>\n  <Button variant="outline">下移</Button>\n</ButtonGroup>`
},
{
  id: "size-xs",
  title: "超小尺寸",
  group: "size",
  spec: "高24 · 字号12 · 圆角6",
  intent: "极紧凑的工具栏、表格内联里的分段操作。",
  rule: "只用于密度很高的局部操作；整组统一 xs，不与其它尺寸混排。",
  code: `<ButtonGroup>\n  <Button variant="outline" size="xs">复制</Button>\n  <Button variant="outline" size="xs">粘贴</Button>\n</ButtonGroup>`
},
{
  id: "size-sm",
  title: "小尺寸",
  group: "size",
  spec: "高28 · 字号13 · 圆角6",
  intent: "筛选栏、表格行、紧凑表单里的分段按钮组。",
  rule: "空间受限时用；整组统一 sm，不用于页面主行动区。",
  code: `<ButtonGroup>\n  <Button variant="outline" size="sm">复制</Button>\n  <Button variant="outline" size="sm">粘贴</Button>\n</ButtonGroup>`
},
{
  id: "size-default",
  title: "默认尺寸",
  group: "size",
  spec: "高32 · 字号14 · 圆角8",
  intent: "页面正文、常规工具栏的操作组合。",
  rule: "按钮组的首选尺寸；整组统一 default。",
  code: `<ButtonGroup>\n  <Button variant="outline">复制</Button>\n  <Button variant="outline">粘贴</Button>\n</ButtonGroup>`
},
{
  id: "size-lg",
  title: "大尺寸",
  group: "size",
  spec: "高36 · 字号16 · 圆角8",
  intent: "需要更强触达的分段操作，如营销页、空状态。",
  rule: "谨慎使用，不在密集列表里用；整组统一 lg。",
  code: `<ButtonGroup>\n  <Button variant="outline" size="lg">复制</Button>\n  <Button variant="outline" size="lg">粘贴</Button>\n</ButtonGroup>`
}];

const buttonGroupScenarioFilters = [
{ value: "type", label: "类型", labelEn: "Type" },
{ value: "size", label: "尺寸", labelEn: "Size" }];

const buttonGroupPropRows = [
{ prop: "ButtonGroup", type: "orientation?: \"horizontal\" | \"vertical\"", defaultValue: "\"horizontal\"", desc: "按钮组容器，自动合并相邻按钮的圆角与边框。" },
{ prop: "ButtonGroupText", type: "render?: ReactElement", defaultValue: "—", desc: "插入说明性文案/图标的占位块，非交互元素。" },
{ prop: "ButtonGroupSeparator", type: "orientation?: \"horizontal\" | \"vertical\"", defaultValue: "\"vertical\"", desc: "组内分隔线，复用 Separator 并自适应方向。" }];

const buttonGroupSemanticDomRows = [
{ part: "[data-slot=\"button-group\"][data-orientation]", desc: "按钮组容器，data-orientation 标记排列方向。" },
{ part: "[data-slot=\"button-group-text\"]", desc: "组内说明性文案/图标占位块。" },
{ part: "[data-slot=\"button-group-separator\"]", desc: "组内分隔线。" }];

const buttonGroupDoDontRows = [
{ do: "把强相关、同级的操作放进同一组。", dont: "把主操作和危险操作（如删除）合并到一组里。" },
{ do: "组内按钮统一用 outline 或 ghost 弱化样式。", dont: "组内混用 default/destructive 等强对比样式。" },
{ do: "组合超过 4 个按钮时考虑改用下拉菜单。", dont: "把工具栏所有按钮塞进一个组，造成视觉拥挤。" }];


const calendarAnchors = [
{ label: "组件总览", href: "#calendar-overview" },
{ label: "场景示例", href: "#calendar-preview" },
{ label: "使用方式", href: "#calendar-usage" },
{ label: "API", href: "#calendar-props" },
{ label: "语义 DOM", href: "#calendar-semantic-dom" },
{ label: "正误示例", href: "#calendar-do-dont" }];

const calendarScenarioExamples = [
{
  id: "single",
  title: "单日选择",
  intent: "用于筛选、表单中选择某一天的场景。",
  rule: "selected 受控时务必同步提供 onSelect 回调。",
  code: `const [date, setDate] = useState<Date>()\n\n<Calendar mode="single" selected={date} onSelect={setDate} />`
},
{
  id: "in-popover",
  title: "嵌入弹层中使用",
  intent: "把日历放进 Popover，搭配输入框做日期选择器。",
  rule: "弹层宽度需容纳完整日历，避免月份切换时跳动。",
  code: `<Popover>\n  <PopoverTrigger render={<Button variant="outline">选择日期</Button>} />\n  <PopoverContent className="w-auto p-0">\n    <Calendar mode="single" selected={date} onSelect={setDate} />\n  </PopoverContent>\n</Popover>`
}];

const calendarPropRows = [
{ prop: "mode", type: "\"single\" | \"multiple\" | \"range\"", defaultValue: "—", desc: "选择模式：单日 / 多日 / 区间，决定 selected 的数据形状。" },
{ prop: "selected / onSelect", type: "Date | Date[] | DateRange", defaultValue: "—", desc: "受控选中值与变更回调，需配合 mode 使用。" },
{ prop: "captionLayout", type: "\"label\" | \"dropdown\"", defaultValue: "\"label\"", desc: "月份标题展示方式：纯文本或可切换的下拉选择。" },
{ prop: "buttonVariant", type: "ButtonProps[\"variant\"]", defaultValue: "\"ghost\"", desc: "上一月/下一月导航按钮的视觉样式。" },
{ prop: "showOutsideDays", type: "boolean", defaultValue: "true", desc: "是否显示当月之外的相邻月份日期。" }];

const calendarSemanticDomRows = [
{ part: "[data-slot=\"calendar\"]", desc: "日历根容器（基于 react-day-picker 渲染）。" },
{ part: "[data-selected-single] / [data-range-start] / [data-range-end] / [data-range-middle]", desc: "日期格子上的选中状态标记，驱动高亮样式。" },
{ part: "[data-day]", desc: "日期按钮，携带本地化后的日期字符串，便于测试定位。" }];

const calendarDoDontRows = [
{ do: "明确告知用户当前选择模式（单日/区间）。", dont: "默认进入区间模式却不给出任何视觉提示。" },
{ do: "嵌入 Popover 时用 className=\"w-auto p-0\" 让日历撑满弹层。", dont: "保留 Popover 默认的内边距和固定宽度，导致日历被裁切。" },
{ do: "搭配输入框展示已选日期的格式化文本。", dont: "选完日期后界面没有任何反馈，用户不确定是否选中。" }];


const collapsibleAnchors = [
{ label: "组件总览", href: "#collapsible-overview" },
{ label: "场景示例", href: "#collapsible-preview" },
{ label: "使用方式", href: "#collapsible-usage" },
{ label: "API", href: "#collapsible-props" },
{ label: "语义 DOM", href: "#collapsible-semantic-dom" },
{ label: "正误示例", href: "#collapsible-do-dont" }];

const collapsibleScenarioExamples = [
{
  id: "panel",
  title: "折叠面板",
  intent: "默认收起次要信息，点击触发器展开查看详情。",
  rule: "触发器要有明确的展开/收起视觉反馈（如箭头旋转）。",
  code: `<Collapsible>\n  <CollapsibleTrigger render={<Button variant="ghost">查看更多 <ChevronDownIcon /></Button>} />\n  <CollapsibleContent>\n    <p className="text-sm text-muted-foreground">这里是展开后的详细内容。</p>\n  </CollapsibleContent>\n</Collapsible>`
},
{
  id: "list-group",
  title: "分组列表收纳",
  intent: "在长列表中按分组折叠，减少初始信息量。",
  rule: "分组标题本身即触发器，避免额外增加按钮造成歧义。",
  code: `<Collapsible defaultOpen>\n  <CollapsibleTrigger render={<button className="text-sm font-medium">基础组件（12）</button>} />\n  <CollapsibleContent className="flex flex-col gap-1 pt-2 text-sm text-muted-foreground">\n    <span>Button</span>\n    <span>Input</span>\n  </CollapsibleContent>\n</Collapsible>`
}];

const collapsiblePropRows = [
{ prop: "Collapsible", type: "open? / defaultOpen? / onOpenChange?", defaultValue: "—", desc: "根节点，可受控也可非受控管理展开状态。" },
{ prop: "CollapsibleTrigger", type: "render?: ReactElement", defaultValue: "—", desc: "触发展开/收起的元素，常用 render 包裹按钮或自定义标签。" },
{ prop: "CollapsibleContent", type: "React.ComponentProps<\"div\">", defaultValue: "—", desc: "可折叠的内容面板，收起时通过动画收起高度。" }];

const collapsibleSemanticDomRows = [
{ part: "[data-slot=\"collapsible\"]", desc: "根容器，承载展开/收起状态。" },
{ part: "[data-slot=\"collapsible-trigger\"]", desc: "触发器，自动同步 aria-expanded。" },
{ part: "[data-slot=\"collapsible-content\"]", desc: "内容面板，收起时高度收起为 0 并隐藏。" }];

const collapsibleDoDontRows = [
{ do: "用箭头旋转或文案变化提示当前展开状态。", dont: "收起和展开时触发器外观完全一致，用户分不清状态。" },
{ do: "默认收起非核心信息，保持页面简洁。", dont: "把关键操作或必读信息也藏进折叠面板里。" },
{ do: "折叠内容较长时允许内部滚动。", dont: "展开后内容把页面撑得很长，找不到收起按钮。" }];


const dropdownMenuAnchors = [
{ label: "组件总览", href: "#dropdown-menu-overview" },
{ label: "场景示例", href: "#dropdown-menu-preview" },
{ label: "使用方式", href: "#dropdown-menu-usage" },
{ label: "API", href: "#dropdown-menu-props" },
{ label: "语义 DOM", href: "#dropdown-menu-semantic-dom" },
{ label: "正误示例", href: "#dropdown-menu-do-dont" }];

const paginationAnchors = [
{ label: "组件总览", href: "#pagination-overview" },
{ label: "场景示例", href: "#pagination-preview" },
{ label: "使用方式", href: "#pagination-usage" },
{ label: "API", href: "#pagination-props" },
{ label: "语义 DOM", href: "#pagination-semantic-dom" },
{ label: "正误示例", href: "#pagination-do-dont" }];

const paginationPropRows = [
{ prop: "page", type: "number", defaultValue: "—", desc: "当前页（从 1 开始，受控）" },
{ prop: "total", type: "number", defaultValue: "—", desc: "数据总条数，用于推导总页数" },
{ prop: "pageSize", type: "number", defaultValue: "10", desc: "每页条数" },
{ prop: "siblingCount", type: "number", defaultValue: "1", desc: "当前页两侧各保留的页码数，超出用省略号" },
{ prop: "showTotal", type: "boolean", defaultValue: "true", desc: "是否显示「共 N 条」总数" },
{ prop: "onPageChange", type: "(page: number) => void", defaultValue: "—", desc: "翻页回调，外部更新 page 状态" }];

const paginationSemanticDomRows = [
{ part: "[data-slot=\"pagination\"]", desc: "分页器根节点（nav），role=navigation、aria-label=分页。" },
{ part: "[data-slot=\"pagination-ellipsis\"]", desc: "省略号占位，页码过多时收起中间页。" }];

const paginationDoDontRows = [
{ do: "受控用法：自己持有 page 状态，在 onPageChange 更新。", dont: "把页码列表和省略号逻辑在业务页里手搓一遍。" },
{ do: "用 total + pageSize 推导页数。", dont: "手算 totalPages 再传一堆零散 props。" },
{ do: "页码很多时依赖内置省略号收起。", dont: "一次平铺几十个页码按钮。" }];

const paginationScenarioExamples = [
{
  id: "basic",
  title: "基础分页",
  intent: "列表/表格底部翻页，页码不多时全部平铺。",
  rule: "受控：page + onPageChange；total + pageSize 推导页数。",
  code: `<Pagination page={page} total={48} pageSize={10} onPageChange={setPage} />`
},
{
  id: "ellipsis",
  title: "大量页码（省略号）",
  intent: "页数很多时，首尾页常驻、当前页两侧各留 siblingCount 个，其余收省略号。",
  rule: "用 siblingCount 控制两侧页码数；不要手动拼省略号。",
  code: `<Pagination page={page} total={1930} pageSize={10} siblingCount={1} onPageChange={setPage} />`
},
{
  id: "no-total",
  title: "不显示总数",
  intent: "空间紧凑或总数无意义时，隐藏「共 N 条」。",
  rule: "showTotal={false} 只留页码与翻页箭头。",
  code: `<Pagination page={page} total={48} pageSize={10} showTotal={false} onPageChange={setPage} />`
}];

const commandAnchors = [
{ label: "组件总览", href: "#command-overview" },
{ label: "场景示例", href: "#command-preview" },
{ label: "使用方式", href: "#command-usage" },
{ label: "API", href: "#command-props" },
{ label: "语义 DOM", href: "#command-semantic-dom" },
{ label: "正误示例", href: "#command-do-dont" }];

const commandPropRows = [
{ prop: "open", type: "boolean", defaultValue: "—", desc: "是否打开（受控）" },
{ prop: "onOpenChange", type: "(open: boolean) => void", defaultValue: "—", desc: "开关回调" },
{ prop: "items", type: "CommandItem[]", defaultValue: "—", desc: "可搜索项：{ id, label, group?, keywords?, onSelect }" },
{ prop: "placeholder", type: "string", defaultValue: "\"搜索…\"", desc: "搜索框占位文案" },
{ prop: "emptyText", type: "string", defaultValue: "\"无匹配结果\"", desc: "无结果时显示的文案" }];

const commandSemanticDomRows = [
{ part: "[data-slot=\"dialog-content\"]", desc: "复用 Dialog 弹层容器，命令面板挂载其中。" },
{ part: "[data-active=\"true\"]", desc: "当前高亮项，键盘 ↑↓ 移动、回车触发。" }];

const commandDoDontRows = [
{ do: "受控：自己持有 open，⌘K 监听由调用方加。", dont: "在业务层手搓输入框+过滤+键盘导航。" },
{ do: "items 的 onSelect 负责跳转/执行，keywords 提升命中。", dont: "把动作逻辑塞进组件内部。" },
{ do: "项很多时用命令面板。", dont: "几个选项也套面板，普通菜单即可。" }];

const commandScenarioExamples = [
{
  id: "search",
  title: "全站搜索跳转",
  intent: "文档站/后台的全局搜索（⌘K），输入即模糊过滤，回车跳转。",
  rule: "items 提供 id/label/onSelect，可选 group/keywords。",
  code: `<CommandPalette open={open} onOpenChange={setOpen} items={items} />`
}];

const topBarAnchors = [
{ label: "组件总览", labelEn: "Overview", href: "#top-bar-overview" },
{ label: "场景示例", labelEn: "Scenario examples", href: "#top-bar-preview" },
{ label: "使用方式", labelEn: "Usage", href: "#top-bar-usage" },
{ label: "API", href: "#top-bar-props" },
{ label: "语义 DOM", labelEn: "Semantic DOM", href: "#top-bar-semantic-dom" },
{ label: "正误示例", labelEn: "Do / Don’t", href: "#top-bar-do-dont" }];

const topBarPropRows = [
{ prop: "TopBar", type: "header 容器", defaultValue: "—", desc: "全局应用顶栏外壳（48px，自身不设底色/分割线，由宿主决定），两端对齐布局子件。", descEn: "Global app top bar shell (48px, no own bg/divider)." },
{ prop: "TopBarBrand", type: "logo?, name", defaultValue: "—", desc: "左侧品牌：logo + 公司/产品名（超长截断）。", descEn: "Brand: logo + product name." },
{ prop: "TopBarApps", type: "current, apps, onSelect?", defaultValue: "—", desc: "应用切换：当前应用名 + 下拉选择（受控）。", descEn: "App switcher dropdown (controlled)." },
{ prop: "TopBarSearch", type: "value, onValueChange, scope?, scopes?, onScopeChange?, placeholder?", defaultValue: "—", desc: "中部全局搜索：范围下拉 + 输入框（受控）。", descEn: "Global search: scope dropdown + input (controlled)." },
{ prop: "TopBarActions / TopBarIconButton", type: "icon, label, dot?, count?, onClick?", defaultValue: "—", desc: "右侧工具区与图标按钮：无底色 + Tooltip + aria-label，可选角标。", descEn: "Right tools: icon buttons + tooltip + optional badge." }];

const topBarSemanticDomRows = [
{ part: "[data-slot=\"top-bar\"]", desc: "顶栏根节点（header），48px，自身不设底色/分割线。", descEn: "Top bar root (header), 48px." },
{ part: "[data-slot=\"top-bar-brand\"] / -divider", desc: "品牌区与竖向分隔线。", descEn: "Brand region and vertical divider." },
{ part: "[data-slot=\"top-bar-search\"]", desc: "搜索容器，focus-within 高亮边框。", descEn: "Search container; focus-within ring." },
{ part: "[data-slot=\"top-bar-actions\"]", desc: "右侧工具按钮区。", descEn: "Right-side tool actions." }];

const topBarDoDontRows = [
{ do: "用子件组合：Brand / Apps / Search / Actions 各司其职。", doEn: "Compose with Brand / Apps / Search / Actions.", dont: "把整条顶栏写成一坨裸 div + 手写样式。", dontEn: "Hand-roll the whole bar as raw divs." },
{ do: "应用切换、搜索、范围都受控，状态由页面持有。", doEn: "Keep app/search/scope controlled by the page.", dont: "把跳转/搜索逻辑塞进顶栏组件内部。", dontEn: "Bury navigation/search logic inside the bar." },
{ do: "工具图标必带 aria-label + Tooltip，未读用角标。", doEn: "Icon buttons need aria-label + tooltip; badge for unread.", dont: "纯图标无说明、未读数硬塞文字里。", dontEn: "Unlabeled icons; counts crammed into text." }];

const topBarScenarioExamples = [
{
  id: "full",
  title: "完整顶栏",
  intent: "登录后的全局应用顶栏：品牌 + 应用切换 + 全局搜索 + 工具图标 + 头像。",
  rule: "TopBar 包裹各子件，状态（当前应用 / 搜索词 / 范围）由页面受控持有。",
  code: `<TopBar>\n  <TopBarBrand logo={<Logo />} name="纷享销客 CRM" />\n  <TopBarDivider />\n  <TopBarApps current="CRM" apps={apps} onSelect={setApp} />\n  <TopBarSearch value={q} onValueChange={setQ} scope={scope} scopes={scopes} onScopeChange={setScope} />\n  <TopBarActions>\n    <TopBarIconButton icon={<MessageCircleIcon />} label="消息" count={3} />\n    <TopBarIconButton icon={<BellIcon />} label="通知" dot />\n  </TopBarActions>\n  <Avatar>…</Avatar>\n</TopBar>`
},
{
  id: "search-scope",
  title: "带范围的搜索",
  intent: "全局搜索框前置范围下拉（全部 / 客户 / 联系人…），缩小搜索域。",
  rule: "scopes + scope + onScopeChange 受控；不提供 scopes 时退化为纯搜索框。",
  code: `<TopBarSearch value={q} onValueChange={setQ} scope={scope} scopes={[{key:"all",label:"全部"},{key:"cust",label:"客户"}]} onScopeChange={setScope} />`
}];

const dropdownMenuScenarioFilters = [
{ value: "type", label: "类型" },
{ value: "state", label: "选项状态" }];

const dropdownMenuScenarioExamples = [
{
  id: "normal",
  title: "普通",
  group: "type",
  intent: "最常见的一组动作：编辑、复制、删除等。",
  rule: "危险操作（如删除）用 variant=\"destructive\" 放末尾；需要分区时再用「分割线」场景。",
  code: `<DropdownMenu>\n  <DropdownMenuTrigger render={<Button variant="ghost" size="icon-md">⋯</Button>} />\n  <DropdownMenuContent>\n    <DropdownMenuItem>编辑</DropdownMenuItem>\n    <DropdownMenuItem>复制</DropdownMenuItem>\n    <DropdownMenuItem>重命名</DropdownMenuItem>\n    <DropdownMenuItem variant="destructive">删除</DropdownMenuItem>\n  </DropdownMenuContent>\n</DropdownMenu>`
},
{
  id: "icon",
  title: "有图标",
  group: "type",
  intent: "每项左侧带图标，强化识别（如设置、账单、退出）。",
  rule: "图标统一 16px、放文字前；同一菜单要么都带图标、要么都不带。",
  code: `<DropdownMenuItem><UserIcon /> 个人资料</DropdownMenuItem>\n<DropdownMenuItem><CreditCardIcon /> 账单与订阅</DropdownMenuItem>`
},
{
  id: "group",
  title: "文字分组",
  group: "type",
  intent: "用小标题文字（Label）按类别组织菜单（如账户信息 / 操作）；要用线分组见「线分组」场景。",
  rule: "DropdownMenuLabel 必须放在 DropdownMenuGroup 内；快捷键用 DropdownMenuShortcut。",
  code: `<DropdownMenuGroup>\n  <DropdownMenuLabel>账户</DropdownMenuLabel>  {/* Label 必须在 Group 内 */}\n  <DropdownMenuItem>个人资料</DropdownMenuItem>\n  <DropdownMenuItem>账单与订阅</DropdownMenuItem>\n</DropdownMenuGroup>\n<DropdownMenuGroup>\n  <DropdownMenuLabel>偏好</DropdownMenuLabel>\n  <DropdownMenuItem>通知</DropdownMenuItem>\n  <DropdownMenuItem>外观</DropdownMenuItem>\n</DropdownMenuGroup>`
},
{
  id: "divider",
  title: "线分组",
  group: "type",
  intent: "用分割线把不同类别的操作分区（线分组），默认无分割线。",
  rule: "用 DropdownMenuSeparator 分区；不要每项之间都加，只在类别切换处加。",
  code: `<DropdownMenuItem>编辑</DropdownMenuItem>\n<DropdownMenuSeparator />\n<DropdownMenuItem variant="destructive">删除</DropdownMenuItem>`
},
{
  id: "submenu",
  title: "有子级",
  group: "type",
  intent: "操作有下级选项时（如「移动到 →」某个项目），用子菜单收纳；最多 3 级。",
  rule: "用 DropdownMenuSub / SubTrigger / SubContent；含子级的项都带 ► 箭头，最末级（无子级）不带；最多 3 级，再深改用 Dialog。",
  code: `<DropdownMenuSub>\n  <DropdownMenuSubTrigger>移动到</DropdownMenuSubTrigger>\n  <DropdownMenuSubContent>\n    <DropdownMenuItem>我的文档</DropdownMenuItem>\n    <DropdownMenuItem>共享空间</DropdownMenuItem>\n  </DropdownMenuSubContent>\n</DropdownMenuSub>`
},
{
  id: "search",
  title: "有搜索",
  group: "type",
  intent: "选项很多时，顶部放搜索框边输入边过滤（如选负责人、选对象）。",
  rule: "选项多且需过滤时优先用 Combobox；搜索无结果时显示居中 muted「无匹配结果」（上下留白 24px）。",
  code: `<DropdownMenuContent>\n  <Input placeholder="搜索" value={q} onChange={...} />\n  {items.filter(i => i.includes(q)).map(i => (\n    <DropdownMenuItem key={i}>{i}</DropdownMenuItem>\n  ))}\n</DropdownMenuContent>`
},
{
  id: "sticky",
  title: "有吸底",
  group: "type",
  intent: "列表可滚动，但底部固定一个常驻操作（如「+ 新建」）。",
  rule: "选项区独立滚动（max-h + overflow），吸底操作放在滚动区外、分割线之下。",
  code: `<DropdownMenuContent>\n  <div className="max-h-48 overflow-y-auto">…选项…</div>\n  <DropdownMenuSeparator />\n  <DropdownMenuItem>＋ 新建</DropdownMenuItem>\n</DropdownMenuContent>`
},
{
  id: "checkbox",
  title: "多选",
  group: "state",
  intent: "菜单内切换多个开关，如表格「显示哪些列」。",
  rule: "用 DropdownMenuCheckboxItem（checked + onCheckedChange）；菜单不自动关闭，可连续勾选。",
  code: `<DropdownMenuCheckboxItem checked={cols.name} onCheckedChange={...}>\n  姓名\n</DropdownMenuCheckboxItem>`
},
{
  id: "radio",
  title: "单选",
  group: "state",
  intent: "菜单内单选一个值，如排序方式、视图密度；当前值用主色橙字 + 对勾标记（通用选中态）。",
  rule: "用 DropdownMenuRadioGroup（value + onValueChange）；选中项即「选中态」，全菜单通用。",
  code: `<DropdownMenuRadioGroup value={sort} onValueChange={setSort}>\n  <DropdownMenuRadioItem value="new">最新优先</DropdownMenuRadioItem>\n  <DropdownMenuRadioItem value="old">最早优先</DropdownMenuRadioItem>\n</DropdownMenuRadioGroup>`
},
{
  id: "disabled",
  title: "禁用",
  group: "state",
  intent: "某个选项当前不可用（无权限、条件不满足）时禁用它。",
  rule: "用 DropdownMenuItem disabled；禁用项变灰、不可点击、不响应 hover——灰显即禁用标识，不额外加图标（主流做法）。",
  code: `<DropdownMenuItem disabled>归档</DropdownMenuItem>`
}];

const dropdownMenuPropRows = [
{ prop: "DropdownMenu / DropdownMenuTrigger", type: "MenuPrimitive.Root.Props / Trigger.Props", defaultValue: "—", desc: "根节点与触发器，常用 render 包裹 Button 自定义外观。" },
{ prop: "DropdownMenuContent", type: "side? / align? / sideOffset?", defaultValue: "side=\"bottom\" align=\"start\"", desc: "菜单弹层，定位 props 决定弹出方向与对齐方式。尺寸规范：默认宽度按内容自适应（内容窄时即最小宽 160px，最宽 320px、超长截断），最大高 320px（约 10 项，超出滚动）；选择型可加 w-(--anchor-width) 跟随触发器。" },
{ prop: "DropdownMenuItem", type: "variant?: \"default\" | \"destructive\" / inset?", defaultValue: "\"default\"", desc: "菜单项，destructive 用于危险操作的视觉强调。" },
{ prop: "DropdownMenuLabel / DropdownMenuSeparator", type: "—", defaultValue: "—", desc: "分组标题与分隔线，用于组织菜单结构。" },
{ prop: "DropdownMenuShortcut", type: "React.ComponentProps<\"span\">", defaultValue: "—", desc: "靠右展示的快捷键提示文案。" },
{ prop: "DropdownMenuCheckboxItem", type: "checked? / onCheckedChange?", defaultValue: "—", desc: "复选型菜单项（菜单内多选开关，勾选不自动关闭）。" },
{ prop: "DropdownMenuRadioGroup / RadioItem", type: "value? / onValueChange? / value", defaultValue: "—", desc: "单选组与单选项，菜单内单选一个值（排序、密度等）。" },
{ prop: "DropdownMenuSub / SubTrigger / SubContent", type: "—", defaultValue: "—", desc: "子菜单（二级展开），用于「移动到→」这类有下一级的操作。" }];

const dropdownMenuSemanticDomRows = [
{ part: "[data-slot=\"dropdown-menu-trigger\"]", desc: "触发器，自动同步 aria-expanded / aria-haspopup。" },
{ part: "[data-slot=\"dropdown-menu-content\"]", desc: "菜单弹层容器，定位与动画都挂载在此。" },
{ part: "[data-slot=\"dropdown-menu-item\"][data-variant]", desc: "菜单项，data-variant 区分默认与危险操作样式。" },
{ part: "[data-slot=\"dropdown-menu-separator\"] / [data-slot=\"dropdown-menu-label\"]", desc: "分隔线与分组标题，组织菜单内部结构。" }];

const dropdownMenuDoDontRows = [
{ do: "把危险操作放在末尾并用 destructive 变体区分。", dont: "把删除按钮和普通操作并排放置，容易误触。" },
{ do: "用 Separator 和 Label 给菜单项分组。", dont: "把十几个操作平铺成一长串列表，找不到重点。" },
{ do: "为常用操作标注快捷键（DropdownMenuShortcut）。", dont: "重要的快捷键信息只放在帮助文档里，菜单上不可见。" }];


const popoverAnchors = [
{ label: "组件总览", href: "#popover-overview" },
{ label: "场景示例", href: "#popover-preview" },
{ label: "使用方式", href: "#popover-usage" },
{ label: "API", href: "#popover-props" },
{ label: "语义 DOM", href: "#popover-semantic-dom" },
{ label: "正误示例", href: "#popover-do-dont" }];

const popoverScenarioExamples = [
{
  id: "info",
  title: "信息说明卡",
  intent: "点击图标展示一段补充说明，不打断当前操作流程。",
  rule: "内容应简短聚焦，复杂表单类交互优先考虑 Dialog/Sheet。",
  code: `<Popover>\n  <PopoverTrigger render={<Button variant="ghost" size="icon-md">?</Button>} />\n  <PopoverContent>\n    <PopoverHeader>\n      <PopoverTitle>什么是工作区？</PopoverTitle>\n      <PopoverDescription>工作区是团队协作的基本单位，可包含多个项目。</PopoverDescription>\n    </PopoverHeader>\n  </PopoverContent>\n</Popover>`
},
{
  id: "quick-edit",
  title: "快捷编辑",
  intent: "在不离开当前页面的情况下，快速修改某一项设置。",
  rule: "弹层内表单要短小，操作完成后应自动关闭或给出反馈。",
  code: `<Popover>\n  <PopoverTrigger render={<Button variant="outline" size="sm">设置别名</Button>} />\n  <PopoverContent className="flex flex-col gap-2.5">\n    <Input placeholder="输入别名" />\n    <Button size="sm">保存</Button>\n  </PopoverContent>\n</Popover>`
}];

const popoverPropRows = [
{ prop: "Popover / PopoverTrigger", type: "PopoverPrimitive.Root.Props / Trigger.Props", defaultValue: "—", desc: "根节点与触发器，常用 render 包裹按钮自定义外观。" },
{ prop: "PopoverContent", type: "side? / align? / sideOffset?", defaultValue: "side=\"bottom\" align=\"center\"", desc: "弹层容器，定位 props 决定弹出方向与对齐方式。" },
{ prop: "PopoverHeader / PopoverTitle / PopoverDescription", type: "—", defaultValue: "—", desc: "弹层内的标题区结构，统一信息层级。" }];

const popoverSemanticDomRows = [
{ part: "[data-slot=\"popover-trigger\"]", desc: "触发器，自动同步 aria-expanded。" },
{ part: "[data-slot=\"popover-content\"]", desc: "弹层容器，宽度默认 18rem（w-72）。" },
{ part: "[data-slot=\"popover-title\"] / [data-slot=\"popover-description\"]", desc: "标题与描述，构成弹层内的信息层级。" }];

const popoverDoDontRows = [
{ do: "用于轻量的信息说明或单字段快捷编辑。", dont: "把多步骤表单塞进 Popover，应该用 Dialog 或 Sheet。" },
{ do: "保持内容简短，一屏可读完。", dont: "弹层内容超长导致需要内部滚动甚至遮挡触发元素。" },
{ do: "信息类用途搭配 PopoverTitle/Description 统一结构。", dont: "随意堆砌文本，没有标题和描述的层级区分。" }];


const separatorAnchors = [
{ label: "组件总览", href: "#separator-overview" },
{ label: "场景示例", href: "#separator-preview" },
{ label: "使用方式", href: "#separator-usage" },
{ label: "API", href: "#separator-props" },
{ label: "语义 DOM", href: "#separator-semantic-dom" },
{ label: "正误示例", href: "#separator-do-dont" }];

const separatorScenarioExamples = [
{
  id: "horizontal",
  title: "水平分隔",
  intent: "区隔上下两块内容，常见于列表项之间、卡片分区。",
  rule: "搭配上下间距使用，避免分隔线紧贴内容造成拥挤。",
  code: `<div className="flex flex-col gap-4">\n  <p className="text-sm">第一段内容</p>\n  <Separator />\n  <p className="text-sm">第二段内容</p>\n</div>`
},
{
  id: "vertical",
  title: "垂直分隔",
  intent: "在工具栏、面包屑等横向排列的元素之间做轻量分隔。",
  rule: "需要给父容器一个明确的高度，分隔线才能正确撑开。",
  code: `<div className="flex h-5 items-center gap-3 text-sm">\n  <span>编辑</span>\n  <Separator orientation="vertical" />\n  <span>分享</span>\n  <Separator orientation="vertical" />\n  <span>删除</span>\n</div>`
}];

const separatorPropRows = [
{ prop: "orientation", type: "\"horizontal\" | \"vertical\"", defaultValue: "\"horizontal\"", desc: "分隔方向；垂直方向需要父容器提供明确高度。" },
{ prop: "decorative", type: "boolean", defaultValue: "true", desc: "是否仅作装饰（不参与无障碍语义），纯视觉分隔保持默认值即可。" }];

const separatorSemanticDomRows = [
{ part: "[data-slot=\"separator\"][data-orientation]", desc: "分隔线本体，data-orientation 标记当前方向并驱动尺寸样式。" }];

const separatorDoDontRows = [
{ do: "用它分隔弱关联的内容区块。", dont: "在每一行文字之间都加分隔线，制造视觉噪音。" },
{ do: "垂直分隔时确保父容器有固定高度（如 h-5）。", dont: "不设置高度直接使用，导致分隔线塌陷不可见。" },
{ do: "分隔线与内容之间留出呼吸间距。", dont: "让分隔线紧贴文字，看起来像下划线。" }];


const linkAnchors = [
{ label: "组件总览", labelEn: "Overview", href: "#link-overview" },
{ label: "场景示例", labelEn: "Scenario examples", href: "#link-preview" },
{ label: "使用方式", labelEn: "Usage", href: "#link-usage" },
{ label: "API", href: "#link-props" },
{ label: "语义 DOM", labelEn: "Semantic DOM", href: "#link-semantic-dom" },
{ label: "正误示例", labelEn: "Do / Don’t", href: "#link-do-dont" }];

const linkScenarioFilters = [
{ value: "type", label: "类型", labelEn: "Type" },
{ value: "state", label: "状态", labelEn: "State" },
{ value: "icon", label: "图标", labelEn: "Icon" },
{ value: "size", label: "尺寸", labelEn: "Size" }];

const linkTones = [
{ tone: "standard", label: "标准" },
{ tone: "default", label: "默认" },
{ tone: "primary", label: "主要" },
{ tone: "success", label: "成功" },
{ tone: "warning", label: "警告" },
{ tone: "danger", label: "危险" }] as
const;
const linkScenarioExamples = [
{
  id: "basic",
  title: "基础文字链接",
  group: "type",
  intent: "默认类型，悬停时才出现下划线，适合大多数跳转场景。",
  rule: "underline 默认 hover；作真实跳转给 href，不要用裸 onClick 伪装链接。",
  code: `<Link href="/docs">基础文字链接</Link>`
},
{
  id: "underline",
  title: "下划线文字链接",
  group: "type",
  intent: "常驻下划线，强调“这是可点链接”，常用于正文内联。",
  rule: "underline=\"always\" 常驻下划线；语义靠 tone，不手写 text-decoration。",
  code: `<Link href="/docs" underline="always">下划线文字链接</Link>`
},
{
  id: "icon",
  title: "带图标",
  group: "icon",
  intent: "前置图标增强识别，后置复制/外链图标提示动作。",
  rule: "图标用 data-icon 标位，size-[1em] 随字号缩放，不手写图标尺寸。",
  code: `<Link href="/repo"><LinkIcon data-icon="inline-start" />仓库</Link>\n<Link href="/copy">复制链接<CopyIcon data-icon="inline-end" /></Link>`
},
{
  id: "tones",
  title: "语义色",
  group: "type",
  intent: "用 tone 表达语境：标准、默认、主要、成功、警告、危险。",
  rule: "tone 在 6 档间取；颜色全走 token，不手写色值。",
  code: `<Link tone="primary" href="/x">主要链接</Link>\n<Link tone="danger" href="/x">危险链接</Link>`
},
{
  id: "disabled",
  title: "禁用态",
  group: "state",
  intent: "无权限或暂不可用的链接，悬停显示禁止光标。",
  rule: "用 disabled 降透明 + cursor-not-allowed 并去掉 href 阻止跳转；不要只改颜色假装禁用。",
  code: `<Link href="/locked" disabled>暂不可用</Link>`
},
{
  id: "size-sm",
  title: "小 sm",
  group: "size",
  spec: "12px",
  intent: "辅助说明、表格内的紧凑链接。",
  rule: "高密度区域用，配 text-sm。",
  code: `<Link size="sm" href="/x">小链接</Link>`
},
{
  id: "size-default",
  title: "默认 default",
  group: "size",
  spec: "14px",
  intent: "正文与常规场景的首选档。",
  rule: "大多数场景用这一档。",
  code: `<Link href="/x">默认链接</Link>`
},
{
  id: "size-lg",
  title: "大 lg",
  group: "size",
  spec: "16px",
  intent: "卡片头部、强调区的链接。",
  rule: "需要更强存在感时用。",
  code: `<Link size="lg" href="/x">大链接</Link>`
}];

const linkPropRows = [
{ prop: "tone", type: "\"standard\" | \"default\" | \"primary\" | \"success\" | \"warning\" | \"danger\"", defaultValue: "\"standard\"", desc: "语义色档，对应链接的语义场景。" },
{ prop: "underline", type: "\"hover\" | \"always\"", defaultValue: "\"hover\"", desc: "类型：基础链接（悬停出下划线）或下划线链接（常驻）。" },
{ prop: "size", type: "\"sm\" | \"default\" | \"lg\"", defaultValue: "\"default\"", desc: "尺寸档（12 / 14 / 16px），图标随字号缩放。" },
{ prop: "disabled", type: "boolean", defaultValue: "false", desc: "禁用态，去除指针事件并降透明度。" },
{ prop: "...props", type: "React.ComponentProps<\"a\">", defaultValue: "—", desc: "原生 a 属性，如 href、target、rel。" }];

const linkSemanticDomRows = [
{ part: "[data-slot=\"link\"][data-tone][data-underline][data-size]", desc: "链接本体，data-tone/underline/size 标记语义色、类型与档位并驱动样式。" }];

const linkDoDontRows = [
{ do: "导航类文字跳转用 Link，并提供真实 href。", dont: "手写 <a> 再贴一堆颜色类伪装链接。" },
{ do: "用 tone 表达语义色（如 danger 表示风险操作说明）。", dont: "给链接手写 text-[#xxx] 硬编码颜色。" },
{ do: "强操作（提交、删除按钮）改用 Button。", dont: "把 Link 当按钮，用 onClick 触发表单提交。" },
{ do: "图标用 data-icon 标位，尺寸交给 Link。", dont: "给链接内图标手写 size-4 等尺寸。" }];

type LinkTone = "standard" | "default" | "primary" | "success" | "warning" | "danger";
type LinkUnderline = "hover" | "always";
type LinkSize = "sm" | "default" | "lg";
type LinkIconMode = "none" | "start" | "end";

function getLinkLabel(tone: LinkTone, lang: Lang) {
  const labels: Record<LinkTone, { zh: string; en: string }> = {
    standard: { zh: "标准链接", en: "Standard link" },
    default: { zh: "默认链接", en: "Default link" },
    primary: { zh: "主要链接", en: "Primary link" },
    success: { zh: "成功链接", en: "Success link" },
    warning: { zh: "警告链接", en: "Warning link" },
    danger: { zh: "危险链接", en: "Danger link" },
  };
  return lang === "en" ? labels[tone].en : labels[tone].zh;
}

function renderLinkPlayground(
underline: LinkUnderline,
tone: LinkTone,
size: LinkSize,
icon: LinkIconMode,
disabled: boolean,
lang: Lang)
{
  const label = getLinkLabel(tone, lang);
  return (
    <Link
      href="#link"
      underline={underline}
      tone={tone}
      size={size}
      disabled={disabled}
    >
      {icon === "start" ? <LinkIcon data-icon="inline-start" /> : null}
      {label}
      {icon === "end" ? <CopyIcon data-icon="inline-end" /> : null}
    </Link>);
}

function genLinkPlaygroundCode(
underline: LinkUnderline,
tone: LinkTone,
size: LinkSize,
icon: LinkIconMode,
disabled: boolean,
lang: Lang)
{
  const attrs = disabled ? ["disabled"] : [`href="/docs"`];
  if (underline !== "hover") attrs.push(`underline="${underline}"`);
  if (tone !== "standard") attrs.push(`tone="${tone}"`);
  if (size !== "default") attrs.push(`size="${size}"`);

  const label = getLinkLabel(tone, lang);
  const content = icon === "start" ?
  `<LinkIcon data-icon="inline-start" />${label}` :
  icon === "end" ?
  `${label}<CopyIcon data-icon="inline-end" />` :
  label;

  return `import { Link } from "@/components/ui/link"\n${icon !== "none" ? `import { ${icon === "start" ? "LinkIcon" : "CopyIcon"} } from "@/lib/icons"\n` : ""}\n<Link ${attrs.join(" ")}>${content}</Link>`;
}

const linkPlaygroundConfig = {
  props: componentPlaygroundPropsFromManifest(componentPlaygroundsManifest.components.link),
  initial: componentPlaygroundsManifest.components.link.initial,
  guidanceKey: componentPlaygroundsManifest.components.link.guidanceKey,
  renderOne: (c: Record<string, string>, lang: Lang) => renderLinkPlayground(c.underline as LinkUnderline, c.tone as LinkTone, c.size as LinkSize, c.icon as LinkIconMode, c.disabled === "true", lang),
  genCode: (c: Record<string, string>, lang: Lang) => genLinkPlaygroundCode(c.underline as LinkUnderline, c.tone as LinkTone, c.size as LinkSize, c.icon as LinkIconMode, c.disabled === "true", lang)
};


const sidebarAnchors = [
{ label: "组件总览", href: "#sidebar-overview" },
{ label: "场景示例", href: "#sidebar-preview" },
{ label: "使用方式", href: "#sidebar-usage" },
{ label: "API", href: "#sidebar-props" },
{ label: "语义 DOM", href: "#sidebar-semantic-dom" },
{ label: "正误示例", href: "#sidebar-do-dont" }];

const sidebarScenarioExamples = [
{
  id: "nav-groups",
  title: "分组导航",
  intent: "把功能模块按分组组织，是后台类产品最常见的主导航形态。",
  rule: "分组标题简短明确，单个分组内菜单项不宜过多（建议 ≤ 6 项）。",
  code: `<SidebarGroup>\n  <SidebarGroupLabel>工作台</SidebarGroupLabel>\n  <SidebarGroupContent>\n    <SidebarMenu>\n      <SidebarMenuItem>\n        <SidebarMenuButton><HomeIcon /> 概览</SidebarMenuButton>\n      </SidebarMenuItem>\n    </SidebarMenu>\n  </SidebarGroupContent>\n</SidebarGroup>`
},
{
  id: "active-item",
  title: "当前项高亮",
  intent: "明确标记用户当前所在的菜单项，辅助定位。",
  rule: "isActive 应与路由状态保持同步，避免出现“高亮但内容不对应”。",
  code: `<SidebarMenuButton isActive>\n  <FolderIcon />\n  项目列表\n</SidebarMenuButton>`
}];

const sidebarPropRows = [
{ prop: "SidebarProvider", type: "open? / onOpenChange? / defaultOpen?", defaultValue: "defaultOpen=true", desc: "提供折叠状态上下文，必须包裹在 Sidebar 外层（含移动端逻辑）。" },
{ prop: "Sidebar", type: "side? / variant? / collapsible?", defaultValue: "side=\"left\" variant=\"sidebar\" collapsible=\"offcanvas\"", desc: "侧边栏根容器，collapsible=\"none\" 时退化为普通固定面板。" },
{ prop: "SidebarHeader / SidebarContent / SidebarFooter", type: "React.ComponentProps<\"div\">", defaultValue: "—", desc: "侧边栏的头部、主体、底部分区。" },
{ prop: "SidebarGroup / SidebarGroupLabel / SidebarGroupContent", type: "—", defaultValue: "—", desc: "菜单分组容器、分组标题与分组内容区。" },
{ prop: "SidebarMenu / SidebarMenuItem / SidebarMenuButton", type: "isActive? / size?", defaultValue: "—", desc: "菜单列表、菜单项与可点击按钮，isActive 标记当前选中项。" },
{ prop: "SidebarTrigger", type: "React.ComponentProps<\"button\">", defaultValue: "—", desc: "折叠/展开侧边栏的触发按钮，通常放在页面头部。" }];

const sidebarSemanticDomRows = [
{ part: "[data-slot=\"sidebar\"][data-state][data-collapsible]", desc: "侧边栏根节点，data-state 标记展开/折叠，驱动布局动画。" },
{ part: "[data-slot=\"sidebar-menu-button\"][data-active]", desc: "菜单按钮，data-active 标记当前选中项。" },
{ part: "[data-slot=\"sidebar-group-label\"] / [data-slot=\"sidebar-group-content\"]", desc: "分组标题与分组内容区，组织菜单层级结构。" },
{ part: "[data-slot=\"sidebar-trigger\"]", desc: "折叠触发按钮，绑定快捷键 Cmd/Ctrl+B。" }];

const sidebarDoDontRows = [
{ do: "用 SidebarProvider 统一管理展开/折叠状态，并持久化用户偏好。", dont: "在多个地方各自维护一份折叠状态，导致刷新后状态不一致。" },
{ do: "用 isActive 与当前路由强绑定来高亮菜单项。", dont: "高亮状态和实际页面内容对不上，用户会怀疑导航是否生效。" },
{ do: "分组数量和每组菜单项数量保持克制。", dont: "把所有功能塞进一个侧边栏，造成超长滚动列表。" }];


const spinnerAnchors = [
{ label: "组件总览", href: "#spinner-overview" },
{ label: "场景示例", href: "#spinner-preview" },
{ label: "使用方式", href: "#spinner-usage" },
{ label: "API", href: "#spinner-props" },
{ label: "语义 DOM", href: "#spinner-semantic-dom" },
{ label: "正误示例", href: "#spinner-do-dont" }];

const spinnerScenarioExamples = [
{
  id: "inline",
  title: "按钮内联loading",
  intent: "提交表单等待响应期间，在按钮内提示正在处理。",
  rule: "loading 时应同步禁用按钮，避免重复提交。",
  code: `<Button disabled>\n  <Spinner className="mr-1.5" />\n  提交中…\n</Button>`
},
{
  id: "block",
  title: "区块级加载",
  intent: "整块内容尚未就绪时，在容器中央显示加载状态。",
  rule: "搭配简短文案说明正在加载什么，避免用户长时间等待时焦虑。",
  code: `<div className="flex flex-col items-center justify-center gap-2 py-10 text-sm text-muted-foreground">\n  <Spinner className="size-6" />\n  正在加载数据…\n</div>`
}];

const spinnerPropRows = [
{ prop: "Spinner", type: "React.ComponentProps<\"svg\">", defaultValue: "—", desc: "本质是一个带 animate-spin 的图标（Loader2Icon），通过 className 控制大小颜色。" },
{ prop: "className", type: "string", defaultValue: "size-4", desc: "控制图标尺寸；放进按钮或文本行内时常配合 mr-1.5 等间距类。" }];

const spinnerSemanticDomRows = [
{ part: "svg[role=\"status\"][aria-label=\"Loading\"]", desc: "Spinner 本体即一个带无障碍语义的旋转图标，无需额外包裹容器。" }];

const spinnerDoDontRows = [
{ do: "loading 期间禁用触发按钮，防止重复提交。", dont: "按钮可继续点击，导致同一请求被触发多次。" },
{ do: "区块级加载搭配简短说明文案。", dont: "页面中央孤零零转一个圈，用户不知道在等什么。" },
{ do: "用 className 调整尺寸以匹配上下文（按钮内用小尺寸）。", dont: "所有场景都用同一个尺寸，按钮里显得过大或过小。" }];

const toastAnchors = [
{ label: "组件总览", href: "#toast-overview" },
{ label: "场景示例", href: "#toast-preview" },
{ label: "使用方式", href: "#toast-usage" },
{ label: "API", href: "#toast-props" },
{ label: "语义 DOM", href: "#toast-semantic-dom" },
{ label: "正误示例", href: "#toast-do-dont" }];

const toastScenarioExamples = [
{
  id: "success",
  title: "操作成功反馈",
  intent: "保存、提交、复制等操作完成后给一条轻量、会自动消失的确认。",
  rule: "成功提示用 toast.success；文案说清「做成了什么」，不堆套话。",
  code: `toast.success("已保存")`
},
{
  id: "error",
  title: "操作失败提示",
  intent: "请求失败、校验不通过时提示原因，不打断当前操作。",
  rule: "失败用 toast.error；能给出原因或下一步，避免只说「出错了」。",
  code: `toast.error("保存失败", { description: "网络异常，请重试" })`
},
{
  id: "action",
  title: "带撤销操作",
  intent: "删除等可逆操作后，给一个限时「撤销」入口。",
  rule: "可逆操作优先给 action 撤销，而不是先弹确认框打断。",
  code: `toast("已删除 1 项", {\n  action: { label: "撤销", onClick: () => restore() },\n})`
}];

const toastPropRows = [
{ prop: "<Toaster />", type: "组件", defaultValue: "—", desc: "全局只挂一次（已在 main.tsx 根节点）；承载所有 toast 的容器与样式。" },
{ prop: "toast(message, options?)", type: "function", defaultValue: "—", desc: "命令式调用弹出提示；从 \"sonner\" 导入，无需放进 JSX。" },
{ prop: "toast.success / error / warning / info / loading", type: "function", defaultValue: "—", desc: "语义化变体，自动套对应图标（走 @/lib/icons 的图标（Tabler））。" },
{ prop: "options.description", type: "string", defaultValue: "—", desc: "主文案下方的次要说明。" },
{ prop: "options.action", type: "{ label, onClick }", defaultValue: "—", desc: "右侧操作按钮，常用于「撤销」。" }];

const toastSemanticDomRows = [
{ part: "section.toaster.group", desc: "Toaster 根容器，挂在页面根节点，定位所有 toast。" },
{ part: ".cn-toast", desc: "单条 toast 的根类，套公司浮层阴影 shadow-l1、圆角 --radius-lg。" }];

const toastDoDontRows = [
{ do: "用语义变体（success/error）让图标和含义对应。", dont: "全用默认 toast()，成功失败长一个样。" },
{ do: "可逆操作给 action「撤销」，让用户能反悔。", dont: "删除前弹一堆确认框打断操作。" },
{ do: "文案简短、说清结果。", dont: "把长段落塞进 toast，超时消失没人看完。" },
{ do: "全局只挂一个 <Toaster />。", dont: "在多个页面重复挂 Toaster，导致提示重复弹。" }];


const tabsAnchors = [
{ label: "组件总览", href: "#tabs-overview" },
{ label: "场景示例", href: "#tabs-preview" },
{ label: "使用方式", href: "#tabs-usage" },
{ label: "API", href: "#tabs-props" },
{ label: "语义 DOM", href: "#tabs-semantic-dom" },
{ label: "正误示例", href: "#tabs-do-dont" }];

const tabsScenarioExamples = [
{
  id: "default",
  title: "默认样式切页",
  intent: "在同一区域内切换并列的内容分组，如“概览 / 详情”。",
  rule: "标签文案要简短并列，数量建议控制在 2-5 个。",
  code: `<Tabs defaultValue="overview">\n  <TabsList>\n    <TabsTrigger value="overview">概览</TabsTrigger>\n    <TabsTrigger value="detail">详情</TabsTrigger>\n  </TabsList>\n  <TabsContent value="overview">概览内容…</TabsContent>\n  <TabsContent value="detail">详情内容…</TabsContent>\n</Tabs>`
},
{
  id: "line",
  title: "下划线样式",
  intent: "在信息密度较高的页面里用更轻量的下划线样式区分标签。",
  rule: "variant=\"line\" 适合嵌入卡片或工具栏，不适合作为页面级主导航。",
  code: `<Tabs defaultValue="all">\n  <TabsList variant="line">\n    <TabsTrigger value="all">全部</TabsTrigger>\n    <TabsTrigger value="active">进行中</TabsTrigger>\n    <TabsTrigger value="done">已完成</TabsTrigger>\n  </TabsList>\n</Tabs>`
}];

const tabsPropRows = [
{ prop: "Tabs", type: "defaultValue? / value? / onValueChange? / orientation?", defaultValue: "orientation=\"horizontal\"", desc: "根节点，可受控也可非受控管理当前激活标签。" },
{ prop: "TabsList", type: "variant?: \"default\" | \"line\"", defaultValue: "\"default\"", desc: "标签栏容器，default 为分段式底色，line 为下划线样式。" },
{ prop: "TabsTrigger", type: "value: string", defaultValue: "—", desc: "单个标签触发器，value 与 TabsContent 一一对应。" },
{ prop: "TabsContent", type: "value: string", defaultValue: "—", desc: "对应标签下的内容面板。" }];

const tabsSemanticDomRows = [
{ part: "[data-slot=\"tabs\"][data-orientation]", desc: "根容器，data-orientation 标记水平/垂直布局。" },
{ part: "[data-slot=\"tabs-list\"][data-variant]", desc: "标签栏，data-variant 区分 default/line 样式。" },
{ part: "[data-slot=\"tabs-trigger\"][data-active]", desc: "标签触发器，data-active 标记当前激活项。" },
{ part: "[data-slot=\"tabs-content\"]", desc: "内容面板，仅渲染当前激活标签对应的内容。" }];

const tabsDoDontRows = [
{ do: "标签数量保持在 2-5 个，文案简短并列。", dont: "塞入七八个标签，挤压每个标签的可点击区域。" },
{ do: "用 value 与业务状态（如路由参数）保持同步。", dont: "标签切换了但 URL/状态没变化，刷新后回到默认页。" },
{ do: "line 样式用于卡片内的轻量切换。", dont: "把 line 样式用作页面级主导航，弱化了导航的存在感。" }];


const toggleAnchors = [
{ label: "组件总览", href: "#toggle-overview" },
{ label: "场景示例", href: "#toggle-preview" },
{ label: "使用方式", href: "#toggle-usage" },
{ label: "API", href: "#toggle-props" },
{ label: "语义 DOM", href: "#toggle-semantic-dom" },
{ label: "正误示例", href: "#toggle-do-dont" }];

const toggleScenarioExamples = [
{
  id: "icon",
  title: "图标开关",
  intent: "切换某个独立的二元状态，如收藏、静音、加粗。",
  rule: "图标含义要清晰直观，必要时搭配 aria-label 说明。",
  code: `<Toggle aria-label="加粗">\n  <BoldIcon />\n</Toggle>`
},
{
  id: "outline",
  title: "描边样式",
  intent: "在工具栏等需要明确边界的场景中使用描边变体。",
  rule: "同一工具栏内的 Toggle 应保持统一的 variant 与 size。",
  code: `<Toggle variant="outline" size="sm">\n  <ItalicIcon />\n  斜体\n</Toggle>`
}];

const togglePropRows = [
{ prop: "pressed / onPressedChange", type: "boolean / (pressed) => void", defaultValue: "—", desc: "受控的按下状态与变更回调；非受控时用 defaultPressed。" },
{ prop: "variant", type: "\"default\" | \"outline\"", defaultValue: "\"default\"", desc: "视觉样式：透明背景或带描边。" },
{ prop: "size", type: "\"default\" | \"sm\" | \"lg\"", defaultValue: "\"default\"", desc: "尺寸档位，影响高度、内边距与图标大小。" }];

const toggleSemanticDomRows = [
{ part: "[data-slot=\"toggle\"][data-state]", desc: "切换按钮本体，data-state=\"on\"/\"off\" 反映当前按下状态。" }];

const toggleDoDontRows = [
{ do: "用于二元状态切换（开/关、选中/未选中）。", dont: "用它触发会跳转或产生副作用的一次性操作。" },
{ do: "图标含义不明确时搭配文字或 aria-label。", dont: "只放一个生僻图标，用户猜不出按下后会发生什么。" },
{ do: "同一工具栏内统一 variant 与 size。", dont: "工具栏里一半描边一半透明，视觉风格不统一。" }];


const toggleGroupAnchors = [
{ label: "组件总览", href: "#toggle-group-overview" },
{ label: "场景示例", href: "#toggle-group-preview" },
{ label: "使用方式", href: "#toggle-group-usage" },
{ label: "API", href: "#toggle-group-props" },
{ label: "语义 DOM", href: "#toggle-group-semantic-dom" },
{ label: "正误示例", href: "#toggle-group-do-dont" }];

const toggleGroupScenarioExamples = [
{
  id: "single",
  title: "单选模式",
  intent: "在多个互斥选项中选择一个，如对齐方式、视图切换。",
  rule: "type=\"single\" 时建议提供默认选中项，避免初始状态为空。",
  code: `<ToggleGroup defaultValue={["left"]}>\n  <ToggleGroupItem value="left">左对齐</ToggleGroupItem>\n  <ToggleGroupItem value="center">居中</ToggleGroupItem>\n  <ToggleGroupItem value="right">右对齐</ToggleGroupItem>\n</ToggleGroup>`
},
{
  id: "multiple",
  title: "多选模式",
  intent: "允许同时启用多个互不冲突的格式选项，如加粗+斜体+下划线。",
  rule: "type=\"multiple\" 适合并行生效的选项，互斥选项请用 single。",
  code: `<ToggleGroup multiple variant="outline">\n  <ToggleGroupItem value="bold"><BoldIcon /></ToggleGroupItem>\n  <ToggleGroupItem value="italic"><ItalicIcon /></ToggleGroupItem>\n  <ToggleGroupItem value="underline"><UnderlineIcon /></ToggleGroupItem>\n</ToggleGroup>`
}];

const toggleGroupPropRows = [
{ prop: "multiple", type: "boolean", defaultValue: "false", desc: "false 时仅一项可按下（互斥单选），true 时可同时按下多项。" },
{ prop: "value / onValueChange", type: "string | string[]", defaultValue: "—", desc: "受控的选中值；single 为字符串，multiple 为字符串数组。" },
{ prop: "variant / size", type: "\"default\" | \"outline\" / \"default\" | \"sm\" | \"lg\"", defaultValue: "\"default\"", desc: "统一下发给组内所有 ToggleGroupItem 的样式与尺寸。" },
{ prop: "orientation / spacing", type: "\"horizontal\" | \"vertical\" / number", defaultValue: "\"horizontal\" / 2", desc: "排列方向与组内间距；spacing=0 时相邻项会合并边框。" }];

const toggleGroupSemanticDomRows = [
{ part: "[data-slot=\"toggle-group\"][data-orientation][data-spacing]", desc: "组容器，记录排列方向与间距，驱动相邻项的圆角合并样式。" },
{ part: "[data-slot=\"toggle-group-item\"][data-state][data-variant][data-size]", desc: "组内选项，data-state 标记选中状态，并继承组级 variant/size。" }];

const toggleGroupDoDontRows = [
{ do: "互斥选项用 type=\"single\"，并行选项用 type=\"multiple\"。", dont: "用 multiple 实现互斥选择，靠业务逻辑硬控制只能选一个。" },
{ do: "single 模式下提供合理的默认选中值。", dont: "初始状态什么都没选中，用户不知道当前是什么视图。" },
{ do: "组内选项数量保持在 2-5 个。", dont: "塞入十几个选项，每个选项窄到看不清图标。" }];


const tokenLayers = [
{ title: "Primitive", desc: "公司原始视觉值，只在 token 真相源里维护。", descEn: "Raw company visual values maintained only in the token source of truth.", example: "--fx-primary: #FF8000" },
{ title: "Semantic", desc: "shadcn/ui 和页面真正消费的语义槽。", descEn: "Semantic slots consumed by shadcn/ui and product pages.", example: "bg-primary text-primary-foreground" }];


const semanticTokenGroups = [
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


const seedColors = [
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



// 企业 web 字号（Figma web 字体规范）：字号 + 行高，默认正文 13
const typeSizeTokens = [
{ name: "text-xl", value: "18px / 28px", cls: "text-xl", usage: "详情页标题（配 bold）", usageEn: "Detail page title (with bold)" },
{ name: "text-lg", value: "15px / 22px", cls: "text-lg", usage: "模块/卡片/组件标题（regular 或 bold 区分）", usageEn: "Module / card / component title" },
{ name: "text-base", value: "13px / 18px", cls: "text-base", usage: "默认正文 — 菜单、列表、表单、大面积文案", usageEn: "Default body — menus, lists, forms" },
{ name: "text-sm", value: "12px / 18px", cls: "text-sm", usage: "提示信息、说明文字", usageEn: "Hints, helper text" }];


// 字重（企业规范：Regular 400 / Medium 500 / Bold 700）
const typeWeightTokens = [
{ name: "font-normal", value: "400", cls: "font-normal", usage: "Regular 常规 — 正文默认", usageEn: "Regular — default body" },
{ name: "font-medium", value: "500", cls: "font-medium", usage: "Medium 中等 — 标签、按钮、菜单、轻强调", usageEn: "Medium — labels, buttons, menus" },
{ name: "font-bold", value: "700", cls: "font-bold", usage: "Bold 加粗 — 标题、强调", usageEn: "Bold — headings, emphasis" }];


// 字族（企业真实栈）
const typeFamilyTokens = [
{ name: "--font-sans", value: "Inter Variable → Noto Sans SC → 系统兜底", cls: "", usage: "自托管开源字体（OFL）：西文 Inter，中文 Noto Sans SC（思源黑体简体），跨平台一致", usageEn: "Self-hosted OFL fonts: Inter for Latin, Noto Sans SC for CJK" }];



const radiusTokens = [
{ name: "--radius", value: "0.625rem（10px）", usage: "基础圆角真相源（= rounded-lg）", usageEn: "Base radius source of truth (= rounded-lg)" },
{ name: "rounded-none", value: "0", usage: "表格、紧贴边缘容器、需要直角的分割块", usageEn: "Tables, flush containers, square dividers" },
{ name: "rounded-xs", value: "calc(var(--radius) - 6px) ≈ 4px", usage: "极小元素：复选框、缩略图角、内联 code", usageEn: "Tiny elements: checkbox, thumbnail, inline code" },
{ name: "rounded-sm", value: "calc(var(--radius) - 4px) ≈ 6px", usage: "小标签、小 chip", usageEn: "Small tags and chips" },
{ name: "rounded-md", value: "calc(var(--radius) - 2px) ≈ 8px", usage: "按钮、输入框、小控件", usageEn: "Buttons, inputs, and compact controls" },
{ name: "rounded-lg", value: "var(--radius) = 10px", usage: "卡片、下拉、浮层容器", usageEn: "Cards, dropdowns, and overlay containers" },
{ name: "rounded-xl", value: "calc(var(--radius) + 4px) ≈ 14px", usage: "Dialog、Sheet、较大区域容器", usageEn: "Dialogs, Sheets, and larger surface containers" },
{ name: "rounded-full", value: "9999px", usage: "胶囊按钮、Badge、头像、开关", usageEn: "Pills, badges, avatars, and switches" }];


const spacingTokens = [
{ name: "gap-0", step: 0, px: 0, value: "0 / 0px", usage: "无间距 — 紧贴、去掉默认间隙", usageEn: "No gap — flush, remove default spacing" },
{ name: "gap-0.5", step: 0.5, px: 2, value: "0.125rem / 2px", usage: "极紧凑 — 图标与文字、徽标内部", usageEn: "Ultra-tight — icon-text, badge internals" },
{ name: "gap-1", step: 1, px: 4, value: "0.25rem / 4px", usage: "紧凑图标、微小内部间隔", usageEn: "Tight icon gaps and tiny internal spacing" },
{ name: "gap-2", step: 2, px: 8, value: "0.5rem / 8px", usage: "按钮图标、表单项内部间隔", usageEn: "Button icons and internal form item spacing" },
{ name: "gap-3", step: 3, px: 12, value: "0.75rem / 12px", usage: "章节标题与说明之间", usageEn: "Between a section title and its description" },
{ name: "gap-4", step: 4, px: 16, value: "1rem / 16px", usage: "卡片内容、表单字段之间", usageEn: "Card content and gaps between form fields" },
{ name: "gap-5", step: 5, px: 20, value: "1.25rem / 20px", usage: "章节标题组与主体内容之间", usageEn: "Between a section heading group and body content" },
{ name: "gap-6", step: 6, px: 24, value: "1.5rem / 24px", usage: "页面区块、小型章节之间", usageEn: "Page blocks and small sections" },
{ name: "gap-10", step: 10, px: 40, value: "2.5rem / 40px", usage: "文档章节、主内容分组之间", usageEn: "Documentation sections and major content groups" }];


const shadowTokens = [
{ name: "shadow-l1", value: "0 6px 18px -8px var(--fx-shadow-color)", usage: "浮层菜单、Dropdown — 最近层", usageEn: "Dropdown menus and nearest-layer overlays" },
{ name: "shadow-l2", value: "0 10px 30px -12px var(--fx-shadow-color)", usage: "Sheet、侧边滑出面板 — 中层", usageEn: "Sheet panels and mid-layer surfaces" },
{ name: "shadow-l3", value: "0 18px 48px -16px var(--fx-shadow-color)", usage: "Dialog、Modal — 最高层遮罩", usageEn: "Dialogs and top-layer modal surfaces" },
{ name: "shadow-l1-up", value: "0 -6px 18px -8px var(--fx-shadow-color)", usage: "向上弹出的浮层（如底部工具栏菜单）", usageEn: "Upward overlays such as bottom toolbar menus" }];

// 浮层阴影一律用公司档 shadow-l1/l2/l3/l1-up；Tailwind 的 md/lg/xl 浮层档禁用（见 scripts/check-shadow-tokens.mjs）。shadow-sm 仅限非浮层的微抬升

const motionTokens = [
{ name: "duration-100", usage: "Dialog、Dropdown、Popover、Tooltip 的进入退出", usageEn: "Enter and exit transitions for Dialog, Dropdown, Popover, and Tooltip" },
{ name: "duration-150", usage: "Sheet 遮罩淡入淡出", usageEn: "Sheet overlay fade transitions" },
{ name: "duration-200", usage: "Sidebar、Sheet 内容位移和宽度变化", usageEn: "Sidebar and Sheet content movement or width transitions" },
{ name: "animate-in / animate-out", usage: "基于 data-open / data-closed 的浮层显隐", usageEn: "Overlay visibility driven by data-open and data-closed states" },
{ name: "fade / zoom / slide", usage: "浮层常用组合，不为单页临时发明动画", usageEn: "Common overlay motion primitives; avoid one-off page animations" }];


const layerTokens = [
{ name: "z-10", usage: "局部控件内部层级，例如 Avatar 状态点、Calendar 范围态", usageEn: "Local component layering, such as Avatar status dots or Calendar range states" },
{ name: "z-20", usage: "Sidebar 拖拽手柄等局部交互热区", usageEn: "Local interaction hit areas such as the Sidebar rail" },
{ name: "z-40", usage: "固定 Header、文档顶部导航", usageEn: "Fixed headers and document top navigation" },
{ name: "z-50", usage: "Dialog、Dropdown、Popover、Sheet、Tooltip 等浮层", usageEn: "Overlays such as Dialog, Dropdown, Popover, Sheet, and Tooltip" }];


const docsByPage = {
  button: {
    title: "Button",
    path: "docs/components/button.md",
    markdown: buttonMarkdown
  },
  icon: {
    title: "Icon",
    path: "docs/components/icon.md",
    markdown: iconMarkdown
  },
  tokens: {
    title: "Tokens",
    path: "docs/TOKENS.md",
    markdown: tokensMarkdown
  }
};

const websiteStandardsDoc = {
  title: "Website Standards",
  path: "docs/DOC_SITE_DESIGN.md",
  markdown: siteDesignMarkdown
} as const;

type DocPage = keyof typeof docsByPage;
type ViewMode = "page" | "markdown";
const PageTitleMetaContext = createContext<string | undefined>(undefined);

function isDocPage(page: string): page is DocPage {
  return page === "button" || page === "icon" || page === "tokens";
}

function getPageFromHash(hash: string) {
  // ai-rules 的锚点用 #ai-* 前缀（与 slug 不同名），单独兜一下；其余全部走 registry 派生
  if (hash === "#ai-rules" || hash.startsWith("#ai-")) return "ai-rules";
  return resolvePageSlug(hash);
}

function getNavItemFromHash(hash: string) {
  const normalizedHash = hash || "#intro";
  const navItems = [
  ...topNav,
  ...topNav.flatMap((item) => item.items ?? []),
  ...docsNav.flatMap((section) => section.items)];


  return navItems.find((item) => item.href === normalizedHash);
}

function getNavItemFromPage(page: string) {
  const navItems = [
  ...topNav,
  ...topNav.flatMap((item) => item.items ?? []),
  ...docsNav.flatMap((section) => section.items)];

  return navItems.find((item) => getPageFromHash(item.href) === page);
}

function getFooterNavIndex(page: string) {
  const currentIndex = footerNavItems.findIndex((item) => getPageFromHash(item.href) === page);
  return currentIndex >= 0 ? currentIndex : footerNavItems.findIndex((item) => item.href === "#intro");
}

function getFooterNavPair(page: string) {
  const currentIndex = getFooterNavIndex(page);

  return {
    previous: currentIndex > 0 ? footerNavItems[currentIndex - 1] : null,
    next: currentIndex >= 0 && currentIndex < footerNavItems.length - 1 ? footerNavItems[currentIndex + 1] : null
  };
}

function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).catch(() => copyTextFallback(text));
    return;
  }

  copyTextFallback(text);
}

function copyTextFallback(text: string) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

function CopyCodeBlock({ code, label, lang }: {code: string;label: string;lang: Lang;}) {
  return (
    <div className="relative rounded-lg bg-muted">
      <pre className="max-w-full overflow-x-auto p-4 pr-14 text-sm">
        <code>{code}</code>
      </pre>
      <div className="absolute right-3 top-3">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={lang === "en" ? `Copy ${label}` : `复制${label}`}
          onClick={() => copyText(code)}>
          
          <CopyIcon data-icon="inline-start" />
        </Button>
      </div>
    </div>);

}

// 页面唯一真相源：slug → { 锚点, 渲染 }。
// 路由判定(getPageFromHash 折叠)、右栏锚点、主区渲染分发都从这里派生，
// 不再各写一套 if/三元链。新增页面只在这里加一行（+ docsNav 导航项）。
type PageEntry = {
  anchors: {label: string;labelEn?: string;href: string;}[];
  render: (actions: React.ReactNode, lang: Lang, page: string, titleMeta?: string) => React.ReactNode;
  // 满宽页（如整页 app 外壳模板）：去掉右侧锚点栏、收窄留白，让内容用足主区宽度
  fullBleed?: boolean;
};
const gettingStartedSlugs: GettingStartedPage[] = ["intro", "install", "theme", "governance-map", "ai-rules", "documentation", "website-standards", "checks"];
const pageRegistry: Record<string, PageEntry> = {
  components: { anchors: componentsIndexAnchors, render: (a, l) => <ComponentsIndexPage actions={a} lang={l} /> },
  tokens: { anchors: tokenAnchors, render: (a, l) => <TokensPage actions={a} lang={l} /> },
  "tokens-colors": { anchors: tokenColorsAnchors, render: (a, l) => <TokensColorsPage actions={a} lang={l} /> },
  "tokens-typography": { anchors: tokenTypographyAnchors, render: (a, l) => <TokensTypographyPage actions={a} lang={l} /> },
  "tokens-radius": { anchors: tokenRadiusAnchors, render: (a, l) => <TokensRadiusPage actions={a} lang={l} /> },
  "tokens-spacing": { anchors: tokenSpacingAnchors, render: (a, l) => <TokensSpacingPage actions={a} lang={l} /> },
  "tokens-shadow": { anchors: tokenShadowAnchors, render: (a, l) => <TokensShadowPage actions={a} lang={l} /> },
  "tokens-motion": { anchors: tokenMotionAnchors, render: (a, l) => <TokensMotionPage actions={a} lang={l} /> },
  "tokens-layer": { anchors: tokenLayerAnchors, render: (a, l) => <TokensLayerPage actions={a} lang={l} /> },
  icon: { anchors: iconAnchors, render: (a, l) => <IconPage actions={a} lang={l} /> },
  grid: { anchors: gridAnchors, render: (a, l) => <GridPage actions={a} lang={l} /> },
  layout: { anchors: layoutAnchors, render: (a, l) => <LayoutPage actions={a} lang={l} /> },
  "top-bar": { anchors: topBarAnchors, render: (a, l) => <TopBarPage actions={a} lang={l} /> },
  "nav-menu": { anchors: navMenuAnchors, render: (a, l) => <NavMenuPage actions={a} lang={l} /> },
  button: { anchors: buttonAnchors, render: (a, l) => <ButtonPage actions={a} lang={l} /> },
  input: { anchors: inputAnchors, render: (a, l) => <InputPage actions={a} lang={l} /> },
  select: { anchors: selectAnchors, render: (a, l) => <SelectPage actions={a} lang={l} /> },
  checkbox: { anchors: checkboxAnchors, render: (a, l) => <CheckboxPage actions={a} lang={l} /> },
  "radio-group": { anchors: radioGroupAnchors, render: (a, l) => <RadioGroupPage actions={a} lang={l} /> },
  switch: { anchors: switchAnchors, render: (a, l) => <SwitchPage actions={a} lang={l} /> },
  textarea: { anchors: textareaAnchors, render: (a, l) => <TextareaPage actions={a} lang={l} /> },
  table: { anchors: tableAnchors, render: (a, l) => <TablePage actions={a} lang={l} /> },
  card: { anchors: cardAnchors, render: (a, l) => <CardPage actions={a} lang={l} /> },
  badge: { anchors: badgeAnchors, render: (a, l) => <BadgePage actions={a} lang={l} /> },
  tag: { anchors: tagAnchors, render: (a, l) => <TagPage actions={a} lang={l} /> },
  tooltip: { anchors: tooltipAnchors, render: (a, l) => <TooltipPage actions={a} lang={l} /> },
  dialog: { anchors: dialogAnchors, render: (a, l) => <DialogPage actions={a} lang={l} /> },
  "alert-dialog": { anchors: alertDialogAnchors, render: (a, l) => <AlertDialogPage actions={a} lang={l} /> },
  sheet: { anchors: sheetAnchors, render: (a, l) => <SheetPage actions={a} lang={l} /> },
  skeleton: { anchors: skeletonAnchors, render: (a, l) => <SkeletonPage actions={a} lang={l} /> },
  avatar: { anchors: avatarAnchors, render: (a, l) => <AvatarPage actions={a} lang={l} /> },
  breadcrumb: { anchors: breadcrumbAnchors, render: (a, l) => <BreadcrumbDocPage actions={a} lang={l} /> },
  "button-group": { anchors: buttonGroupAnchors, render: (a, l) => <ButtonGroupPage actions={a} lang={l} /> },
  calendar: { anchors: calendarAnchors, render: (a, l) => <CalendarPage actions={a} lang={l} /> },
  collapsible: { anchors: collapsibleAnchors, render: (a, l) => <CollapsiblePage actions={a} lang={l} /> },
  "dropdown-menu": { anchors: dropdownMenuAnchors, render: (a, l) => <DropdownMenuPage actions={a} lang={l} /> },
  pagination: { anchors: paginationAnchors, render: (a, l) => <PaginationPage actions={a} lang={l} /> },
  command: { anchors: commandAnchors, render: (a, l) => <CommandPage actions={a} lang={l} /> },
  popover: { anchors: popoverAnchors, render: (a, l) => <PopoverPage actions={a} lang={l} /> },
  separator: { anchors: separatorAnchors, render: (a, l) => <SeparatorPage actions={a} lang={l} /> },
  link: { anchors: linkAnchors, render: (a, l) => <LinkPage actions={a} lang={l} /> },
  sidebar: { anchors: sidebarAnchors, render: (a, l) => <SidebarPage actions={a} lang={l} /> },
  spinner: { anchors: spinnerAnchors, render: (a, l) => <SpinnerPage actions={a} lang={l} /> },
  toast: { anchors: toastAnchors, render: (a, l) => <ToastPage actions={a} lang={l} /> },
  tabs: { anchors: tabsAnchors, render: (a, l) => <TabsPage actions={a} lang={l} /> },
  toggle: { anchors: toggleAnchors, render: (a, l) => <TogglePage actions={a} lang={l} /> },
  "toggle-group": { anchors: toggleGroupAnchors, render: (a, l) => <ToggleGroupPage actions={a} lang={l} /> },
  "agent-surface": { anchors: agentSurfaceAnchors, render: (a, l) => <AgentSurfacePage actions={a} lang={l} /> },
  chart: { anchors: [], render: (a, l) => <ChartPage actions={a} lang={l} /> },
  "list-page": { anchors: [], fullBleed: true, render: (a, l) => <CustomerListTemplate actions={a} lang={l} /> },
  "template-customer-list": { anchors: [], fullBleed: true, render: (a, l) => <CustomerListTemplate actions={a} lang={l} /> },
  ...Object.fromEntries(
    gettingStartedSlugs.map((slug) => [
    slug,
    {
      anchors: gettingStartedAnchors[slug],
      render: (a: React.ReactNode, l: Lang, p: string) =>
      <GettingStartedPage actions={a} page={p as GettingStartedPage} lang={l} />

    } satisfies PageEntry]
    )
  )
};
// 折叠 #slug-anchor → slug：优先精确命中，否则取最长前缀匹配（保证 tokens-colors 不被 tokens 抢）
function resolvePageSlug(hash: string): string {
  if (hash === "" || hash === "#") return "intro";
  const raw = hash.replace("#", "");
  if (pageRegistry[raw]) return raw;
  const base = Object.keys(pageRegistry).
  filter((slug) => hash === `#${slug}` || hash.startsWith(`#${slug}-`)).
  sort((x, y) => y.length - x.length)[0];
  return base ?? raw ?? "components";
}

function ThemeCustomizerPanel({
  open,
  onOpenChange,
  config,
  onConfigChange,
  lang






}: {open: boolean;onOpenChange: (open: boolean) => void;config: ThemeConfig;onConfigChange: React.Dispatch<React.SetStateAction<ThemeConfig>>;lang: Lang;}) {
  const colorInputRef = useRef<HTMLInputElement>(null);
  const lastColorPickRef = useRef<string | null>(null);
  const pendingColorPickRef = useRef<string | null>(null);
  const pickerInitialColorRef = useRef<string | null>(null);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const activeCustomColor = getActiveCustomColor(config);
  const isPickingCustomColor = isColorPickerOpen;

  const setConfigValue = <K extends keyof ThemeConfig,>(key: K, value: ThemeConfig[K]) => {
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
      const nextCustom = customColors[nextIndex] ?? defaultThemeConfig.customColorHex;
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
        
        <SheetHeader className="p-[calc(var(--fx-panel-padding)*2)] pb-0">
          <div className="flex items-center gap-(--fx-control-gap)">
            <SettingsIcon className="size-5 text-muted-foreground" />
            <SheetTitle className="text-lg font-medium">{lang === "en" ? "Theme Customizer" : "主题定制"}</SheetTitle>
          </div>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-[calc(var(--fx-panel-gap)*2)] overflow-y-auto p-[calc(var(--fx-panel-padding)*2)] pb-12">
          <section className="flex flex-col gap-(--fx-control-gap)">
            <ThemePanelHeading icon={<SunIcon />} title={lang === "en" ? "Appearance" : "外观模式"} />
            <div className="flex h-8 gap-0.5 rounded-lg bg-muted p-0.5">
              <button
                type="button"
                aria-pressed={config.mode === "light"}
                onClick={() => setConfigValue("mode", "light")}
                className={cn(
                  "flex h-full flex-1 items-center justify-center gap-(--fx-control-gap-tight) rounded-md px-(--fx-control-px-xs) text-sm font-medium outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
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
                  "flex h-full flex-1 items-center justify-center gap-(--fx-control-gap-tight) rounded-md px-(--fx-control-px-xs) text-sm font-medium outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                  config.mode === "dark" ? "bg-card text-foreground shadow-l1" : "text-muted-foreground hover:text-foreground dark:text-foreground/70 dark:hover:text-foreground"
                )}>
                
                <MoonIcon className="size-3.5" />
                {lang === "en" ? "Dark" : "深色"}
              </button>
            </div>
          </section>

          <section className="flex flex-col gap-(--fx-control-gap)">
            <ThemePanelHeading icon={<PaletteIcon />} title={lang === "en" ? "Brand Color" : "主色调"} />
            <div className="flex flex-wrap items-center gap-(--fx-control-gap)">
              {themeColorOptions.map((item) =>
              <button
                key={item.id}
                type="button"
                aria-label={item.label}
                aria-pressed={config.primaryColor === item.id}
                onClick={() => setConfigValue("primaryColor", item.id)}
                className={cn(
                  "flex size-(--fx-control-icon-sm) items-center justify-center rounded-full border border-border-subtle outline-none transition-all hover:scale-105 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                  config.primaryColor === item.id && "scale-110 ring-2 ring-foreground ring-offset-2 ring-offset-background"
                )}
                style={{ backgroundColor: item.value }}>
                
                  {config.primaryColor === item.id ? <span className="size-2 rounded-full bg-primary-foreground" /> : null}
                </button>
              )}
              <Separator orientation="vertical" className="mx-1 h-(--fx-control-icon-sm)" />
              {config.customColors.map((color, index) => {
                const selected =
                !isPickingCustomColor &&
                config.primaryColor === "custom" &&
                config.customColorIndex === index;

                return (
                  <div key={`${color}-${index}`} className="group relative size-(--fx-control-icon-sm) shrink-0">
                    <button
                      type="button"
                      aria-label={lang === "en" ? `Use custom color ${color}` : `使用自定义颜色 ${color}`}
                      aria-pressed={selected}
                      onClick={() => selectCustomColor(color, index)}
                      className={cn(
                        "flex size-(--fx-control-icon-sm) items-center justify-center rounded-full border border-border-subtle outline-none transition-all hover:scale-105 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
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
                  "relative flex size-(--fx-control-icon-sm) shrink-0 cursor-pointer items-center justify-center rounded-full border border-border/55 bg-muted/18 text-muted-foreground/60 outline-none transition-[border-color,background-color,color,box-shadow,transform,opacity] duration-220 ease-out hover:border-border-strong hover:bg-muted/28 hover:text-foreground/80 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
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
                  value={isHexColor(activeCustomColor) ? activeCustomColor : defaultThemeConfig.customColorHex}
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
                  className="absolute inset-0 size-(--fx-control-icon-sm) cursor-pointer rounded-full opacity-0"
                  aria-label={lang === "en" ? "Add custom color" : "添加自定义颜色"} />
                
              </label>
            </div>
          </section>

          <section className="flex flex-col gap-(--fx-control-gap)">
            <ThemePanelHeading icon={<TypographyIcon />} title={lang === "en" ? "Typography" : "字体主题"} />
            <div className="grid grid-cols-2 gap-(--fx-control-gap)">
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
                  "flex h-(--fx-control-sm-height) items-center justify-center rounded-lg border px-(--fx-control-px-xs) text-xs font-medium outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                  config.borderRadius === item.id ? "border-foreground bg-muted text-foreground" : "border-border bg-surface text-muted-foreground hover:border-border-strong hover:text-foreground"
                )}>
                
                  {item.label}
                </button>
              )}
            </div>
          </section>

          <ThemeChoiceSection
            icon={<BorderStyleIcon />}
            title={lang === "en" ? "Border Width" : "边框粗细"}
            options={themeBorderWidthOptions}
            value={config.borderWidth}
            columns={4}
            onChange={(value) => setConfigValue("borderWidth", value)} />
          

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

function ThemePanelHeading({ icon, title }: {icon: React.ReactNode;title: string;}) {
  return (
    <h3 className="flex items-center gap-(--fx-control-gap) text-sm font-medium text-foreground">
      <span className="flex size-4 items-center justify-center text-muted-foreground [&_svg]:size-4">{icon}</span>
      {title}
    </h3>);

}

function ThemeChoiceButton({
  selected,
  label,
  desc,
  optionId,
  style,
  onClick







}: {selected: boolean;label: string;desc: React.ReactNode;optionId?: string;style?: React.CSSProperties;onClick: () => void;}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      data-theme-option={optionId}
      onClick={onClick}
      style={style}
      className={cn(
        "flex min-h-[calc(var(--fx-control-lg-height)+8px)] flex-col justify-center rounded-lg border px-(--fx-control-px-sm) py-(--fx-control-px-xs) text-left outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        selected ? "border-foreground bg-muted text-foreground" : "border-border bg-surface text-muted-foreground hover:border-border-strong hover:text-foreground"
      )}>
      
      <span className="text-xs font-bold">{label}</span>
      <span className="mt-0.5 text-[11px] text-muted-foreground">{desc}</span>
    </button>);

}

function ThemeChoiceSection<T extends string>({
  icon,
  title,
  options,
  value,
  onChange,
  columns = 2







}: {icon: React.ReactNode;title: string;options: {id: T;label: string;desc: string;}[];value: T;onChange: (value: T) => void;columns?: 2 | 3 | 4;}) {
  return (
    <section className="flex flex-col gap-(--fx-control-gap)">
      <ThemePanelHeading icon={icon} title={title} />
      <div
        className={cn(
          "grid gap-(--fx-control-gap)",
          columns === 2 && "grid-cols-2",
          columns === 3 && "grid-cols-3",
          columns === 4 && "grid-cols-4"
        )}>
        
        {options.map((item) =>
        <ThemeChoiceButton
          key={item.id}
          selected={value === item.id}
          label={item.label}
          desc={item.desc}
          optionId={item.id}
          onClick={() => onChange(item.id)} />

        )}
      </div>
    </section>);

}

function App() {
  const [page, setPage] = useState(() => getPageFromHash(window.location.hash));
  const [activeHash, setActiveHash] = useState(() => window.location.hash || "#intro");
  const [activeAnchor, setActiveAnchor] = useState("#overview");
  const [viewMode, setViewMode] = useState<ViewMode>("page");
  const [searchOpen, setSearchOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [lang, setLang] = useState<Lang>(() => {
    const saved = window.localStorage.getItem("fx-ui-lang");
    return saved === "en" ? "en" : "zh";
  });
  const [dark, setDark] = useState<boolean>(() => window.localStorage.getItem("fx-ui-theme") === "dark");
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(() => {
    const saved = normalizeThemeConfig(window.localStorage.getItem("fx-ui-theme-config"));
    const savedMode = window.localStorage.getItem("fx-ui-theme") === "dark" ? "dark" : "light";
    return { ...saved, mode: savedMode };
  });
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    window.localStorage.setItem("fx-ui-theme", dark ? "dark" : "light");
  }, [dark]);
  useEffect(() => {
    setDark(themeConfig.mode === "dark");
    window.localStorage.setItem("fx-ui-theme-config", JSON.stringify(themeConfig));
  }, [themeConfig]);
  useEffect(() => {
    const root = document.documentElement;
    const runtimeStyle = getThemeRuntimeStyle(themeConfig, lang) as Record<string, string>;

    Object.entries(runtimeStyle).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    return () => {
      Object.keys(runtimeStyle).forEach((key) => {
        root.style.removeProperty(key);
      });
    };
  }, [themeConfig, lang]);
  const mainRef = useRef<HTMLElement>(null);

  // 全站可搜索项：所有导航页面（顶部入口 + 左侧分组），模糊搜索 + Enter 跳 hash
  const searchItems = useMemo<CommandItem[]>(() => {
    const fromNav = docsNav.flatMap((section) =>
    section.items.map((it) => ({
      id: it.href,
      label: lang === "en" ? it.labelEn ?? it.label : it.label,
      meta: lang === "en" ? undefined : it.labelEn && it.labelEn !== it.label ? it.labelEn : undefined,
      group: lang === "en" ? section.titleEn ?? section.title : section.title,
      keywords: `${it.label} ${it.labelEn ?? ""} ${it.href}`,
      onSelect: () => {window.location.hash = it.href;}
    }))
    );
    const fromTop = topNav.flatMap((it) => [it, ...(it.items ?? [])].map((item) => ({
      id: item.href,
      label: lang === "en" ? item.labelEn ?? item.label : item.label,
      meta: lang === "en" ? undefined : item.labelEn && item.labelEn !== item.label ? item.labelEn : undefined,
      group: lang === "en" ? "Navigation" : "导航",
      keywords: `${item.label} ${item.labelEn ?? ""} ${item.href}`,
      onSelect: () => {window.location.hash = item.href;}
    })));
    return [...fromTop, ...fromNav];
  }, [lang]);

  // ⌘K / Ctrl+K 打开命令面板
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const scrollTargetIntoMain = (target: HTMLElement, behavior: ScrollBehavior = "smooth") => {
    const main = mainRef.current;
    if (!main) return;

    const scrollOnce = (nextBehavior: ScrollBehavior) => {
      const mainTop = main.getBoundingClientRect().top;
      const targetTop = target.getBoundingClientRect().top;

      main.scrollTo({
        top: main.scrollTop + targetTop - mainTop - 28,
        behavior: nextBehavior
      });
    };

    scrollOnce(behavior);
    window.setTimeout(() => scrollOnce("auto"), 180);
  };

  useEffect(() => {
    const onHashChange = () => {
      const nextHash = window.location.hash || "#intro";

      setActiveHash(nextHash);
      setPage(getPageFromHash(nextHash));
      setViewMode("page");
    };

    onHashChange();
    window.addEventListener("hashchange", onHashChange);

    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("fx-ui-lang", lang);
    document.documentElement.lang = lang === "en" ? "en" : "zh-CN";
  }, [lang]);

  useEffect(() => {
    const viewMarkdown = () => setViewMode("markdown");

    window.addEventListener("fx-ui:view-markdown", viewMarkdown);
    return () => window.removeEventListener("fx-ui:view-markdown", viewMarkdown);
  }, []);

  // 分组判定（用于顶栏高亮、footer 等），不是逐页重复，保留
  const isComponentsIndexPage = page === "components";
  const isGettingStartedPage = page === "intro" || page === "install" || page === "theme";
  const isGovernancePage = page === "governance-map" || page === "ai-rules" || page === "documentation" || page === "website-standards" || page === "checks";
  const isTokenArea = page === "tokens" || tokenNavSections.some((section) =>
  section.items.some((item) => getPageFromHash(item.href) === page)
  );
  const isLayoutArea = layoutNavSections.some((section) =>
  section.items.some((item) => getPageFromHash(item.href) === page)
  );
  const isFoundationArea = isTokenArea || isLayoutArea;
  const isPageArea = pageNavSections.some((section) =>
  section.items.some((item) => getPageFromHash(item.href) === page)
  );
  const isComponentArea =
  isComponentsIndexPage ||
  componentIndexSections.some((section) =>
  section.items.some((item) => getPageFromHash(item.href) === page)
  );
  const sidebarSections = isFoundationArea ? foundationNavSections : isComponentArea ? componentIndexSections : isPageArea ? pageNavSections : isGovernancePage ? governanceNavSections : docsNav;
  // 当前页条目 = 唯一真相源 pageRegistry 查表
  const pageEntry = pageRegistry[page];
  const anchors = pageEntry?.anchors ?? [];
  const docKey: DocPage | null = isDocPage(page) ? page : null;
  const currentDoc = docKey ? docsByPage[docKey] : null;
  const placeholderItem = getNavItemFromHash(activeHash);
  const currentNavItem = getNavItemFromPage(page);
  const footerNav = getFooterNavPair(page);
  const navActions = <PageStepActions previous={footerNav.previous} next={footerNav.next} lang={lang} />;

  useEffect(() => {
    const main = mainRef.current;
    if (!main || viewMode === "markdown") return undefined;

    const syncActiveAnchor = () => {
      const mainTop = main.getBoundingClientRect().top;
      let nextActive = anchors[0]?.href ?? "#components";

      for (const item of anchors) {
        const target = document.getElementById(item.href.slice(1));
        if (!target) continue;

        const offset = target.getBoundingClientRect().top - mainTop;
        if (offset <= 160) {
          nextActive = item.href;
        }
      }

      const isScrollable = main.scrollHeight > main.clientHeight + 2;
      const isAtBottom = main.scrollTop + main.clientHeight >= main.scrollHeight - 2;
      if (isScrollable && isAtBottom) {
        const lastExistingAnchor = [...anchors].reverse().find((item) => document.getElementById(item.href.slice(1)));
        if (lastExistingAnchor) {
          nextActive = lastExistingAnchor.href;
        }
      }

      setActiveAnchor(nextActive);
    };

    syncActiveAnchor();
    main.addEventListener("scroll", syncActiveAnchor, { passive: true });

    return () => main.removeEventListener("scroll", syncActiveAnchor);
  }, [anchors, viewMode]);

  useEffect(() => {
    const main = mainRef.current;
    if (!main || viewMode === "markdown") return;

    const id = activeHash.slice(1);
    const isPageRootHash = activeHash === `#${page}`;
    const isPageAnchor = anchors.some((item) => item.href === activeHash);
    if (!id) return;

    requestAnimationFrame(() => {
      const target = document.getElementById(id);
      if (!target) {
        if (!isPageAnchor) {
          main.scrollTo({ top: 0, behavior: "smooth" });
          setActiveAnchor(anchors[0]?.href ?? "#components");
        }
        return;
      }

      if (isPageRootHash) {
        main.scrollTo({ top: 0, behavior: "smooth" });
        setActiveAnchor(anchors[0]?.href ?? activeHash);
        return;
      }

      if (anchors[0]?.href === activeHash) {
        main.scrollTo({ top: 0, behavior: "smooth" });
        setActiveAnchor(activeHash);
        return;
      }

      scrollTargetIntoMain(target);
      setActiveAnchor(isPageAnchor ? activeHash : anchors[0]?.href ?? activeHash);
    });
  }, [activeHash, anchors, viewMode]);

  const scrollToAnchor = (href: string) => {
    const main = mainRef.current;
    const target = document.getElementById(href.slice(1));
    if (!main || !target) return;

    window.history.pushState(null, "", href);
    setActiveHash(href);
    setActiveAnchor(href);
    if (anchors[0]?.href === href) {
      main.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    scrollTargetIntoMain(target);
  };

  const pageActions = currentDoc ?
  <PageActions
    doc={currentDoc}
    lang={lang}
    navActions={navActions}
    viewMode={viewMode}
    onViewModeChange={setViewMode} /> :


  <PageActionsShell navActions={navActions}>
      <CopyPageAction lang={lang} />
    </PageActionsShell>;


  return (
    <div
      className="h-dvh overflow-hidden bg-background text-foreground"
      data-theme-border={themeConfig.borderWidth}
      data-theme-motion={themeConfig.animationStyle}
      style={getThemeRuntimeStyle(themeConfig, lang)}>
      
      <header className="relative z-40 h-(--fx-topbar-height) shrink-0 border-b border-border-subtle bg-card">
        <div className="grid h-(--fx-topbar-height) grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-(--fx-panel-gap) px-(--fx-panel-padding) md:px-[calc(var(--fx-panel-padding)+0.5rem)] xl:gap-[calc(var(--fx-panel-gap)*2)] xl:px-[calc(var(--fx-panel-padding)+1rem)]">
          <div className="flex min-w-0 shrink-0 items-center gap-(--fx-control-gap)">
            <div className="flex size-8 items-center justify-center rounded-sm bg-primary text-primary-foreground">
              <span className="size-4 bg-primary-foreground" aria-hidden="true" />
            </div>
            <div className="hidden text-[18px] font-bold leading-[22px] text-foreground sm:block">
              FX<span className="text-primary">.UI</span>
            </div>
            <Tag variant="outline" className="ml-1 hidden opacity-70 2xl:inline-flex">
              v1.2.0
            </Tag>
          </div>

          <nav className="hidden h-(--fx-topbar-height) items-center justify-center gap-[calc(var(--fx-panel-gap)*3)] text-[length:var(--fx-menu-text)] leading-(--fx-menu-text--line-height) font-medium lg:flex xl:gap-[calc(var(--fx-panel-gap)*4)]">
            {topNav.map((item) => {
              const childItems = "items" in item ? item.items : undefined;
              const isActive =
              page === item.page ||
              childItems?.some((child) => child.page === page) ||
              item.page === "intro" && isGettingStartedPage ||
              item.page === "tokens" && isFoundationArea ||
              item.page === "components" && isComponentArea ||
              item.page === "template-customer-list" && isPageArea ||
              item.page === "governance-map" && isGovernancePage ||
              item.page === "theme" && page === "theme";
              const topNavClass = isActive ?
              "flex h-(--fx-topbar-height) items-center border-b-2 border-primary text-primary" :
              "flex h-(--fx-topbar-height) items-center border-b-2 border-transparent text-muted-foreground transition-colors hover:text-foreground";

              if (childItems) {
                return (
                  <DropdownMenu key={item.label}>
                    <DropdownMenuTrigger
                      render={
                      <button type="button" className={`${topNavClass} gap-(--fx-control-gap-tight)`} />
                      }>
                      
                      {getLabel(item, lang)}
                      <ChevronDownIcon className="size-3.5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-40">
                      {childItems.map((child) => (
                        <DropdownMenuItem key={child.href} render={<a href={child.href} />}>
                          {getLabel(child, lang)}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>);
              }

              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={topNavClass}>
                  
                  {getLabel(item, lang)}
                </a>);

            })}
          </nav>

          <div className="flex min-w-0 items-center justify-end gap-(--fx-control-gap) overflow-hidden">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="hidden h-(--fx-control-sm-height) w-48 max-w-full shrink items-center gap-(--fx-control-gap-tight) rounded-md border border-border bg-muted/40 px-(--fx-control-px-xs) text-left outline-none transition-colors hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 lg:flex xl:w-64 2xl:w-[22rem]">
              
              <SearchIcon className="size-3.5 text-muted-foreground" />
              <span className="h-(--fx-control-sm-height) min-w-0 flex-1 content-center truncate text-sm font-normal text-muted-foreground">{uiText[lang].search}</span>
              <kbd className="inline-flex h-5 items-center gap-(--fx-control-gap-tight) rounded-sm border border-border-subtle bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground">⌘ K</kbd>
            </button>

            <Button
              variant="outline"
              size="icon-sm"
              aria-label={uiText[lang].search}
              className="md:ml-auto lg:hidden"
              onClick={() => setSearchOpen(true)}>
              
              <SearchIcon />
            </Button>

            <Button
              variant="plain"
              size="toolbar-icon"
              aria-label={lang === "zh" ? "Switch to English" : "切换到中文"}
              className="hidden md:inline-flex"
              onClick={() => setLang(lang === "zh" ? "en" : "zh")}>
              
              <span className="text-sm font-normal leading-none">{lang === "zh" ? "EN" : "中"}</span>
            </Button>

            <Button
              variant="plain"
              size="toolbar-icon"
              aria-label={dark ? lang === "en" ? "Light mode" : "浅色模式" : lang === "en" ? "Dark mode" : "暗色模式"}
              className="hidden md:inline-flex"
              onClick={() => setThemeConfig((config) => ({
                ...config,
                mode: config.mode === "dark" ? "light" : "dark"
              }))}>
              
              {dark ? <SunIcon /> : <MoonIcon />}
            </Button>

            <Button
              variant="plain"
              size="toolbar-icon"
              aria-label={lang === "en" ? "Display settings" : "显示设置"}
              className="hidden md:inline-flex"
              onClick={() => setThemeOpen(true)}>
              
              <SlidersIcon />
            </Button>
          </div>
        </div>
      </header>

      <CommandPalette
        open={searchOpen}
        onOpenChange={setSearchOpen}
        items={searchItems}
        placeholder={uiText[lang].search}
        emptyText={lang === "en" ? "No results" : "无匹配结果"} />
      

      <ThemeCustomizerPanel
        open={themeOpen}
        onOpenChange={setThemeOpen}
        config={themeConfig}
        onConfigChange={setThemeConfig}
        lang={lang} />
      

      <div className={isGettingStartedPage ? "grid h-[calc(100dvh-var(--fx-topbar-height))] min-h-0 grid-cols-1 overflow-hidden bg-background" : "grid h-[calc(100dvh-var(--fx-topbar-height))] min-h-0 overflow-hidden bg-background lg:grid-cols-[240px_minmax(0,1fr)]"}>
        <aside className={isGettingStartedPage ? "hidden" : "hidden min-h-0 border-r border-border-subtle bg-card lg:block"}>
          <div className={docsSidebarSpacing.shell}>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className={`${docsSidebarSpacing.searchTrigger} flex w-full items-center gap-(--fx-control-gap) rounded-lg border border-input bg-card px-(--fx-control-px-md) text-left outline-none hover:bg-muted lg:hidden`}>
              
              <SearchIcon className="size-4 text-muted-foreground" />
              <span className="h-(--fx-control-md-height) flex-1 content-center text-sm text-muted-foreground">{uiText[lang].search}</span>
            </button>
            <nav className={docsSidebarSpacing.nav}>
              {sidebarSections.map((section) =>
              <section key={section.title} className={docsSidebarSpacing.group}>
                  <div className={docsSidebarSpacing.groupLabel}>{lang === "en" && section.titleEn ? section.titleEn : section.title}</div>
                  <div className={docsSidebarSpacing.itemList}>
                    {section.items.map((item) => {
                    const isActive =
                    item.href === activeHash ||
                    activeHash === "#" && item.href === "#components";

                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        className={
                        isActive ?
                        "flex h-(--fx-control-md-height) items-center justify-between gap-(--fx-control-gap) rounded-md bg-primary/10 px-(--fx-control-px-md) text-[length:var(--fx-menu-text)] leading-(--fx-menu-text--line-height) font-medium text-primary" :
                        "flex h-(--fx-control-md-height) items-center justify-between gap-(--fx-control-gap) rounded-md px-(--fx-control-px-md) text-[length:var(--fx-menu-text)] leading-(--fx-menu-text--line-height) font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                        }>
                        
                          <span className="truncate">{getLabel(item, lang)}</span>
                          {lang === "en" && item.labelEn && getLabel(item, lang) !== item.labelEn ?
                        <span className={isActive ? "shrink-0 text-[length:max(12px,var(--fx-text-xs))] font-medium text-primary/70" : "shrink-0 text-[length:max(12px,var(--fx-text-xs))] font-normal text-muted-foreground/70"}>{item.labelEn}</span> :
                        null}
                        </a>);

                  })}
                  </div>
                </section>
              )}
            </nav>
          </div>
        </aside>

        <main ref={mainRef} className="fx-doc-static h-full w-full min-w-0 max-w-full overflow-y-auto overflow-x-hidden">
          <div
            className={
            pageEntry?.fullBleed ?
            "mx-auto grid w-full max-w-screen-2xl grid-cols-1 gap-10 px-6 py-8 xl:px-8" :
            "mx-auto grid w-full max-w-screen-2xl grid-cols-1 gap-10 px-6 py-10 2xl:grid-cols-[minmax(0,1080px)_220px] 2xl:justify-center 2xl:gap-16 2xl:px-8"
            }>
            
            <article
              className="w-full min-w-0 break-words"
              style={{ maxWidth: "calc(100vw - 3rem)" }}>
              
              {viewMode === "markdown" && currentDoc ?
              <MarkdownPage doc={currentDoc} actions={pageActions} lang={lang} /> :
              pageEntry ?
              <PageTitleMetaContext.Provider value={lang === "en" ? undefined : currentNavItem?.labelEn}>
                {pageEntry.render(pageActions, lang, page, currentNavItem?.labelEn)}
              </PageTitleMetaContext.Provider> :

              <PlaceholderPage
                actions={pageActions}
                hash={activeHash}
                item={placeholderItem}
                lang={lang} />

              }
            </article>

            {pageEntry?.fullBleed ? null :
            <RightRail
              activeAnchor={activeAnchor}
              anchors={anchors}
              lang={lang}
              onAnchorSelect={scrollToAnchor} />

            }
          </div>
        </main>
      </div>
    </div>);

}

function PageActions({
  doc,
  demo = false,
  lang,
  navActions,
  viewMode,
  onViewModeChange






}: {doc: (typeof docsByPage)[DocPage];demo?: boolean;lang: Lang;navActions: React.ReactNode;viewMode: ViewMode;onViewModeChange: (mode: ViewMode) => void;}) {
  const copyCurrentPage = () => {
    if (demo) return;
    copyText(doc.markdown);
  };

  return (
    <PageActionsShell navActions={navActions}>
      <DropdownMenu>
        <ButtonGroup>
          <Button variant="secondary" size="toolbar" onClick={copyCurrentPage}>
            <CopyIcon data-icon="inline-start" />
            {uiText[lang].copyPage}
          </Button>
          <ButtonGroupSeparator className="bg-white" />
          <DropdownMenuTrigger
            render={
            <Button
              variant="secondary"
              size="toolbar-icon"
              aria-label={uiText[lang].moreActions} />

            }>
            
            <ChevronDownIcon />
          </DropdownMenuTrigger>
        </ButtonGroup>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-1.5 py-1 text-xs font-medium text-muted-foreground">
            {doc.path}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => {
            if (demo) return;
            onViewModeChange(viewMode === "markdown" ? "page" : "markdown");
          }}>
            {viewMode === "markdown" ? <FileTextIcon /> : <FileCodeIcon />}
            {viewMode === "markdown" ? uiText[lang].viewPage : uiText[lang].viewMarkdown}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </PageActionsShell>);

}

function PageActionsShell({
  children,
  navActions



}: {children: React.ReactNode;navActions: React.ReactNode;}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {children}
      {navActions}
    </div>);

}

function PageStepActions({
  demo = false,
  lang,
  next,
  previous




}: {demo?: boolean;lang: Lang;next: (typeof footerNavItems)[number] | null;previous: (typeof footerNavItems)[number] | null;}) {
  const preventDemoNavigation = (event: React.MouseEvent) => {
    if (demo) event.preventDefault();
  };

  return (
    <div className="flex items-center gap-2" aria-label={lang === "en" ? "Page navigation" : "页面导航"}>
      <Button
        variant="secondary"
        size="toolbar-icon"
        onClick={preventDemoNavigation}
        disabled={!previous}
        render={previous ? <a href={previous.href} aria-label={lang === "en" ? `Previous: ${getLabel(previous, lang)}` : `上一篇：${getLabel(previous, lang)}`} /> : undefined}>
        
        <ArrowLeftIcon />
      </Button>
      <Button
        variant="secondary"
        size="toolbar-icon"
        onClick={preventDemoNavigation}
        disabled={!next}
        render={next ? <a href={next.href} aria-label={lang === "en" ? `Next: ${getLabel(next, lang)}` : `下一篇：${getLabel(next, lang)}`} /> : undefined}>
        
        <ArrowRightIcon />
      </Button>
    </div>);

}

function CopyPageAction({ lang }: {lang: Lang;}) {
  const copyCurrentPage = () => {
    const pageText = document.querySelector("article")?.textContent?.trim() || window.location.href;
    copyText(pageText);
  };

  return (
    <Button variant="secondary" size="toolbar" onClick={copyCurrentPage}>
      <CopyIcon data-icon="inline-start" />
      {uiText[lang].copyPage}
    </Button>);

}

function MarkdownPage({
  doc,
  actions,
  lang




}: {doc: (typeof docsByPage)[DocPage];actions: React.ReactNode;lang: Lang;}) {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="mb-3 text-sm text-muted-foreground">Markdown / {doc.path}</p>
          <h1 className="text-3xl font-bold leading-tight tracking-tight">{doc.title} Markdown</h1>
        </div>
        {actions}
      </div>

      <p className={docsSpacing.leadText}>
        {uiText[lang].markdownLead}
      </p>

      <Card className="min-w-0 max-w-full">
        <CardHeader>
          <CardTitle className="text-base">{doc.path}</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="max-h-[70dvh] max-w-full overflow-auto rounded-lg bg-muted p-5 text-sm">
            <code>{doc.markdown}</code>
          </pre>
        </CardContent>
      </Card>
    </section>);

}

function PlaceholderPage({
  actions,
  hash,
  item,
  lang





}: {actions: React.ReactNode;hash: string;item?: {label: string;labelEn?: string;href: string;};lang: Lang;}) {
  const title = item ? getLabel(item, lang) : hash.replace("#", "") || "Page";

  return (
    <section className="flex flex-col gap-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="mb-3 text-sm text-muted-foreground">
            {lang === "en" ? "Placeholder" : "空页面占位"} / {hash || "#components"}
          </p>
          <h1 className="text-3xl font-bold leading-tight tracking-tight">{title}</h1>
        </div>
        {actions}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {lang === "en" ? "Content not filled yet" : "内容暂未填充"}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
          <p>
            {lang === "en" ?
            "This menu item already has its own route. The page can later be filled from shadcn Blocks, component docs, or internal layout guidelines." :
            "这个菜单项已经有独立路由。后续可以从 shadcn Blocks、组件文档或公司内部布局规范里补内容。"}
          </p>
          <code className="w-fit rounded-lg bg-muted px-3 py-2 text-xs text-foreground">{hash}</code>
        </CardContent>
      </Card>
    </section>);

}

function GovernanceQuickLinks({
  currentPage,
  lang



}: {currentPage: GettingStartedPage;lang: Lang;}) {
  return (
    <div className="flex flex-wrap gap-2 pt-2">
      {governanceQuickLinks.map((item) => {
        const isActive = currentPage === item.page;

        return (
          <a
            key={item.href}
            href={item.href}
            className={
            isActive ?
            "rounded-full bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground" :
            "rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
            }>
            
            {getLabel(item, lang)}
          </a>);

      })}
    </div>);

}

function LayerCard({ title, desc, emphasis = false }: {title: string;desc: string;emphasis?: boolean;}) {
  return (
    <div className={`rounded-xl border px-4 py-3 ${emphasis ? "border-primary bg-primary/10" : "border-border bg-card"}`}>
      <div className="text-sm font-semibold text-foreground">{title}</div>
      <div className="mt-1 text-xs leading-5 text-muted-foreground">{desc}</div>
    </div>);

}

function LayerRow({
  label,
  note,
  children




}: {label: string;note?: string;children: React.ReactNode;}) {
  return (
    <div className="grid gap-3 rounded-2xl border border-border bg-background/70 p-4 md:grid-cols-[120px_minmax(0,1fr)]">
      <div>
        <div className="text-sm font-medium text-muted-foreground">{label}</div>
        {note ? <div className="mt-2 text-xs leading-5 text-muted-foreground">{note}</div> : null}
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">{children}</div>
    </div>);

}

function FileRelationRow({ relation }: {relation: FileRelation;}) {
  return (
    <div className="grid gap-3 rounded-xl border border-border bg-background p-3 xl:grid-cols-[minmax(0,1fr)_132px_minmax(0,1fr)_minmax(0,1.2fr)]">
      <div>
        <div className="text-xs font-medium text-muted-foreground">来源文件</div>
        <code className="mt-1 block break-words rounded-lg bg-muted px-2 py-1.5 text-xs text-foreground">{relation.source}</code>
      </div>
      <div className="flex items-center xl:justify-center">
        <Tag variant={relation.emphasis ? "default" : "secondary"}>{relation.action}</Tag>
      </div>
      <div>
        <div className="text-xs font-medium text-muted-foreground">作用对象</div>
        <code className="mt-1 block break-words rounded-lg bg-muted px-2 py-1.5 text-xs text-foreground">{relation.target}</code>
      </div>
      <div>
        <div className="text-xs font-medium text-muted-foreground">运行结果</div>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{relation.result}</p>
      </div>
    </div>);

}

function StepBadge({ index }: {index: number;}) {
  return <Tag variant="outline">{String(index + 1).padStart(2, "0")}</Tag>;
}

function CountBadge({ children }: {children: React.ReactNode;}) {
  return <Tag variant="outline">{children}</Tag>;
}

function StatusBadge({ status }: {status: string;}) {
  return <Tag variant="outline">{status}</Tag>;
}

function FileRelationMap({ relations }: {relations: FileRelation[];}) {
  const groups = relations.reduce<Record<string, FileRelation[]>>((acc, relation) => {
    acc[relation.group] = [...(acc[relation.group] ?? []), relation];
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4">
      <div className="rounded-2xl border border-border bg-background/70 p-4">
        <div className="text-sm font-medium text-foreground">怎么看这张图</div>
        <p className="mt-2 text-sm text-muted-foreground">
          这里不表达时间顺序，而是表达文件之间的作用关系：谁被 import、谁被读取、谁负责检查、谁产出页面或分发包。
        </p>
      </div>
      {Object.entries(groups).map(([group, items]) =>
      <div key={group} className="flex flex-col gap-3">
          <h3 className="text-base font-semibold text-foreground">{group}</h3>
          <div className="flex flex-col gap-3">
            {items.map((relation) =>
          <FileRelationRow key={`${relation.source}-${relation.action}-${relation.target}`} relation={relation} />
          )}
          </div>
        </div>
      )}
    </div>);

}

function GraphCockpit({ lang }: {lang: Lang;}) {
  const actionCards = governanceStatus.actionFlows.map((flow) => ({
    ...flow,
    title: lang === "en" ? flow.titleEn : flow.title,
    desc: lang === "en" ? flow.descEn : flow.desc,
    linkLabel: lang === "en" ? flow.linkLabelEn : flow.linkLabel,
    done: lang === "en" ? flow.doneEn : flow.done,
    check: flow.checkCommand,
    steps: flow.steps.map((step) => ({
      ...step,
      action: lang === "en" ? step.actionEn : step.action,
      note: lang === "en" ? step.noteEn : step.note
    }))
  }));
  const taskRoutes = governanceStatus.taskRoutes.map((route) => {
    const flow = governanceStatus.actionFlows.find((item) => item.id === route.flowId);

    return {
      ...route,
      label: lang === "en" ? route.labelEn : route.label,
      firstDecision: lang === "en" ? route.firstDecisionEn : route.firstDecision,
      flowTitle: flow ? lang === "en" ? flow.titleEn : flow.title : route.flowId
    };
  });

  const metricCards = [
  {
    label: lang === "en" ? "Files / facts" : "文件节点",
    value: projectGraphCockpit.nodeCount,
    desc: lang === "en" ? "This tells you the governed surface is not only src files." : "说明治理范围不只是 src，还包括 docs、scripts、rules、skills、data。"
  },
  {
    label: lang === "en" ? "Reference edges" : "自动引用边",
    value: projectGraphCockpit.edgeCount,
    desc: lang === "en" ? "Use this when you need raw file-level references." : "要追真实文件引用时看它，不用靠猜。"
  },
  {
    label: lang === "en" ? "System relations" : "工程关系",
    value: projectGraphCockpit.relationCount,
    desc: lang === "en" ? "Use this first when deciding what a change may affect." : "判断改动影响范围时先看它。"
  },
  {
    label: lang === "en" ? "Stale nodes" : "过期节点",
    value: projectGraphCockpit.staleCount,
    desc: lang === "en" ? "Zero means the current rule docs have no stale markers." : "为 0 说明当前规则文档没有过期标记。"
  }];


  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <CardTitle>{lang === "en" ? "Project Cockpit" : "工程驾驶舱"}</CardTitle>
            <CardDescription>
              {lang === "en" ?
              "A compact view of the generated graph plus curated engineering relations." :
              "把自动扫描的项目图谱和人工整理的工程关系放在一起看。"}
            </CardDescription>
          </div>
          <Tag variant="outline">project-graph.v0.3</Tag>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="rounded-2xl border border-primary/25 bg-primary/5 p-4">
          <div className="text-sm font-semibold text-foreground">
            {lang === "en" ? "What this is useful for" : "这个面板真正用来干嘛"}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {lang === "en" ?
            "The numbers are only evidence. The useful part is choosing the right source file, relation view, and check command before changing code." :
            "数字只是证据，不是结论。真正有用的是：你要改东西时，它告诉你先看哪份事实表、哪张关系图、最后跑哪个检查。"}
          </p>
          <Tabs defaultValue="style" className="mt-4 flex flex-col gap-5">
            <TabsList className="grid !h-auto w-full grid-cols-1 items-stretch justify-stretch gap-3 bg-transparent p-0 md:grid-cols-2 xl:grid-cols-4">
              {actionCards.map((action) =>
              <TabsTrigger
                key={action.id}
                value={action.id}
                className="h-full min-h-24 w-full items-start justify-start whitespace-normal rounded-xl border border-border bg-background px-3 py-3 text-left data-active:border-primary data-active:bg-background">
                
                  <span className="flex min-w-0 flex-col items-start gap-1">
                    <span className="text-sm font-semibold">{action.title}</span>
                    <span className="line-clamp-3 whitespace-normal break-words text-xs font-normal leading-5 text-muted-foreground">{action.desc}</span>
                  </span>
                </TabsTrigger>
              )}
            </TabsList>

            {actionCards.map((action) =>
            <TabsContent key={action.id} value={action.id} className="mt-0">
                <div className="rounded-2xl border border-border bg-background p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="text-sm font-semibold text-foreground">{action.title}</div>
                      <p className="mt-1 text-sm text-muted-foreground">{action.desc}</p>
                    </div>
                    <a href={action.href} className="text-sm font-medium text-primary hover:underline">
                      {action.linkLabel}
                    </a>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-4">
                    {action.steps.map((step, index) =>
                  <div key={`${action.id}-${step.file}`} className="relative rounded-xl border border-border bg-card p-3">
                        <StepBadge index={index} />
                        <div className="mt-3 text-sm font-semibold text-foreground">{step.action}</div>
                        <code className="mt-2 block break-words rounded bg-muted px-2 py-1.5 text-xs text-foreground">{step.file}</code>
                        <p className="mt-2 text-xs leading-5 text-muted-foreground">{step.note}</p>
                      </div>
                  )}
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
                    <div className="rounded-xl bg-muted p-3">
                      <div className="text-xs font-medium text-muted-foreground">{lang === "en" ? "Check" : "检查命令"}</div>
                      <code className="mt-2 block w-fit rounded bg-background px-2 py-1 text-xs text-foreground">{action.check}</code>
                    </div>
                    <div className="rounded-xl bg-muted p-3">
                      <div className="text-xs font-medium text-muted-foreground">{lang === "en" ? "Done means" : "完成标准"}</div>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{action.done}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>

        <div className="rounded-2xl border border-border bg-background p-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="text-sm font-semibold text-foreground">{lang === "en" ? "Task Routing" : "任务路由"}</div>
              <p className="mt-1 text-sm text-muted-foreground">
                {lang === "en" ?
                "When a user or DevInspector request arrives, AI should route it here first, then follow the matching action flow." :
                "用户或 DevInspector 任务进来时，AI 先在这里判断走哪条工作流，再按对应行动链路执行。"}
              </p>
            </div>
            <Tag variant="outline">{taskRoutes.length}</Tag>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {taskRoutes.map((route) =>
            <div key={route.id} className="rounded-xl border border-border bg-card p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-sm font-semibold text-foreground">{route.label}</div>
                  <Tag variant="outline">{route.flowTitle}</Tag>
                </div>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{route.firstDecision}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {route.match.slice(0, 6).map((keyword) =>
                <code key={keyword} className="rounded bg-muted px-1.5 py-0.5 text-xs text-foreground">{keyword}</code>
                )}
                </div>
                <code className="mt-3 block w-fit rounded bg-muted px-1.5 py-0.5 text-xs text-foreground">{route.outputCheck}</code>
              </div>
            )}
          </div>
        </div>

        <Collapsible>
          <div className="rounded-2xl border border-border bg-background p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-sm font-semibold text-foreground">{lang === "en" ? "Evidence Details" : "证据详情"}</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {lang === "en" ?
                  "Open this when you need the graph numbers, relation split, and group evidence behind the cockpit." :
                  "需要看驾驶舱背后的图谱数字、关系分布和分组证据时再展开。"}
                </p>
              </div>
              <CollapsibleTrigger render={<Button variant="outline" size="sm" />}>
                {lang === "en" ? "Show evidence" : "展开证据"}
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent className="mt-4 flex flex-col gap-4">
              <div className="grid gap-3 md:grid-cols-4">
                {metricCards.map((metric) =>
                <div key={metric.label} className="rounded-xl border border-border bg-card p-4">
                    <div className="text-xs font-medium text-muted-foreground">{metric.label}</div>
                    <div className="mt-2 text-xl font-bold tracking-tight text-foreground">{metric.value}</div>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">{metric.desc}</p>
                  </div>
                )}
              </div>

              <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                <div className="rounded-xl border border-border bg-card p-4">
                  <div className="text-sm font-semibold text-foreground">{lang === "en" ? "Relation Split" : "关系分布"}</div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg bg-muted p-3">
                      <div className="text-xs text-muted-foreground">{lang === "en" ? "Site relations" : "网站关系"}</div>
                      <div className="mt-1 text-xl font-semibold">{projectGraphCockpit.siteRelationCount}</div>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        {lang === "en" ? "How this docs site runs and reads data." : "解释这个文档站怎么运行、读数据、渲染页面。"}
                      </p>
                    </div>
                    <div className="rounded-lg bg-muted p-3">
                      <div className="text-xs text-muted-foreground">{lang === "en" ? "Project relations" : "项目关系"}</div>
                      <div className="mt-1 text-xl font-semibold">{projectGraphCockpit.projectRelationCount}</div>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        {lang === "en" ? "How fx-ui files support real project delivery." : "解释 fx-ui 工程文件如何支撑真实项目交付。"}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    {lang === "en" ?
                    "Use generated edges to find raw references; use system relations to understand responsibility and impact." :
                    "自动边用来找真实引用；工程关系用来看职责和影响。两者合起来，才不会只剩一堆文件名。"}
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-foreground">{lang === "en" ? "Relation Groups" : "关系分组"}</div>
                    <CountBadge>{projectGraphCockpit.relationGroupCount}</CountBadge>
                  </div>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {projectGraphCockpit.groups.map((group) =>
                    <div key={`${group.scope}-${group.group}`} className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2">
                        <div>
                          <div className="text-sm font-medium text-foreground">{group.group}</div>
                          <div className="text-xs text-muted-foreground">{group.scope === "site" ? "网站" : "项目"}</div>
                        </div>
                        <CountBadge>{group.count}</CountBadge>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </CardContent>
    </Card>);

}

function FxUiSystemDiagram({ scope }: {scope: "site" | "project";}) {
  if (scope === "project") {
    return (
      <Tabs defaultValue="category" className="flex flex-col gap-4">
        <TabsList className="w-fit">
          <TabsTrigger value="category">分类视图</TabsTrigger>
          <TabsTrigger value="relations">文件关系</TabsTrigger>
        </TabsList>
        <TabsContent value="category" className="mt-0">
          <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
            <LayerRow label="最终产物" note="项目能力最终不是 dist，而是能支撑真实业务页面。">
              <LayerCard title="真实业务项目页面" desc="后台列表、详情、编辑、设置、报表等完整页面" emphasis />
            </LayerRow>
            <LayerRow label="页面" note="把常见业务结构沉淀为可复用页面。">
              <LayerCard title="页面 Blocks / layouts" desc="常见页面骨架和组合方式" />
              <LayerCard title="src/components/fx" desc="公司组合组件，承接高频业务结构" />
              <LayerCard title="docs/LAYOUTS.md" desc="业务后台页面布局规范" />
            </LayerRow>
            <LayerRow label="基础能力" note="组件、token、规则数据共同支撑页面。">
              <LayerCard title="src/components/ui" desc="shadcn open-code 基础组件" />
              <LayerCard title="theme/fx-theme.css" desc="公司视觉 token 真相源" />
              <LayerCard title="docs + docs/data" desc="给人和 AI 共同消费的规范与事实" />
            </LayerRow>
            <LayerRow label="工程工具" note="这些不是页面本身，但决定项目怎么被检查、分发和复用。">
              <LayerCard title="scripts/check-*" desc="契约、token、文档站、组件 manifest 检查" />
              <LayerCard title=".ai/rules + .agents/skills" desc="AI 工作规则和项目 skill" />
              <LayerCard title="registry/fx-theme.json" desc="主题分发包" />
              <LayerCard title="package.json" desc="依赖、脚本和检查命令" />
            </LayerRow>
            <LayerRow label="底座" note="本地开发和构建运行的基础。">
              <LayerCard title="shadcn/ui" desc="基础组件来源" />
              <LayerCard title="Vite / React / Tailwind" desc="开发、渲染和样式技术栈" />
              <LayerCard title="dist/" desc="构建产物，不手改" />
            </LayerRow>
          </div>
        </TabsContent>
        <TabsContent value="relations" className="mt-0">
          <FileRelationMap relations={systemRelations.project} />
        </TabsContent>
      </Tabs>);

  }

  return (
    <Tabs defaultValue="category" className="flex flex-col gap-4">
      <TabsList className="w-fit">
        <TabsTrigger value="category">分类视图</TabsTrigger>
        <TabsTrigger value="relations">文件关系</TabsTrigger>
      </TabsList>
      <TabsContent value="category" className="mt-0">
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
          <LayerRow label="最终产物">
            <LayerCard title="fx-ui 文档站页面" desc="开发者查看组件、token、规范和现状的完整网站" emphasis />
          </LayerRow>
          <LayerRow label="运行层">
            <LayerCard title="src/main.tsx" desc="React 应用入口" />
            <LayerCard title="src/App.tsx" desc="页面路由、导航、示例和现状页渲染" />
            <LayerCard title="npm run check" desc="交付前质量门禁" />
          </LayerRow>
          <LayerRow label="内容层">
            <LayerCard title="组件体系" desc="src/components/ui + src/components/fx" />
            <LayerCard title="文档与机器事实" desc="docs/**/*.md + docs/data/*.json" />
            <LayerCard title="src/reports" desc="报告/简报渲染层" />
          </LayerRow>
          <LayerRow label="底座">
            <LayerCard title="theme/fx-theme.css" desc="公司 token 和 shadcn 语义槽" />
            <LayerCard title="package.json" desc="依赖、脚本和构建命令" />
            <LayerCard title="Vite + React + Tailwind" desc="本网站的运行与构建技术栈" />
          </LayerRow>
        </div>
      </TabsContent>
      <TabsContent value="relations" className="mt-0">
        <FileRelationMap relations={systemRelations.site} />
      </TabsContent>
    </Tabs>);

}

function GettingStartedPage({
  actions,
  page,
  lang




}: {actions: React.ReactNode;page: GettingStartedPage;lang: Lang;}) {
  if (page === "website-standards") {
    return (
      <div className={docsSpacing.pageStack}>
        <section id="website-standards" className="flex flex-col gap-3">
          <FxPageLead
            crumb={lang === "en" ? "Maintain / Website Standards" : "维护 / 网站规范"}
            title={lang === "en" ? "Website Standards" : "网站规范"}
            titleMeta={lang === "en" ? undefined : "Website Standards"}
            lead={lang === "en" ? "Reusable page components for this docs website. Keep page chrome here, and keep business admin patterns in compositions." : "本站文档页的页面组件规范。文档站外壳放这里，业务后台模式仍放业务组合。"}
            actions={actions} />
        </section>

        <section id="website-standards-components" className={docsSpacing.sectionStack}>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-4">
                <SectionLead title="PageLead" description="用于文档页顶部，固定承载面包屑、标题、说明和右侧页面动作。" />
                <WebsiteRulePopover>
                    {websiteStandardsManifest.pageLead.rulePanel.sections.includes("values") ? (
                      <WebsiteRulePanel
                        title="视觉取值"
                        badge="PageLead 插槽"
                        sources={websiteStandardsManifest.pageLead.rulePanel.sections.includes("sources") ? websiteStandardsManifest.pageLead.rulePanel.sources : []}
                      >
                        <WebsiteRuleValueList
                          items={websiteStandardsManifest.pageLead.visualBaseline.map((item) => ({
                            title: item.title,
                            meta: item.slot,
                            description: pageLeadSlotGuideMap[item.slot],
                            value: getPageLeadSlotValue(item.slot)
                          }))}
                        />
                      </WebsiteRulePanel>
                    ) : null}
                </WebsiteRulePopover>
              </div>
              <div className="flex flex-col gap-5 rounded-lg border border-border bg-card p-5">
                <FxPageLead
                  crumb="维护 / 网站规范"
                  title="页面标题区"
                  titleMeta="PageLead"
                  lead="这里展示页面标题区的真实组件形态。标题下只保留一句说明，不再额外加线。"
                  actions={
                    <PageActions
                      doc={websiteStandardsDoc}
                      demo
                      lang={lang}
                      navActions={<PageStepActions demo previous={null} next={null} lang={lang} />}
                      viewMode="page"
                      onViewModeChange={() => {}}
                    />
                  } />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-4">
                <SectionLead
                  title={lang === "en" ? "Component Playground" : "组件调试台"}
                  description={lang === "en" ? "Website standards display the shared playground truth source. Component pages read the same source and render real components." : "网站规范这里只展示统一调试台真相源；组件页读取同一份数据，再渲染对应真实组件。"}
                />
                <WebsiteRulePopover>
                  {websiteStandardsManifest.componentPlayground.rulePanel.sections.includes("values") ? (
                    <WebsiteRulePanel
                      title="视觉取值"
                      badge="ComponentPlayground"
                      sources={websiteStandardsManifest.componentPlayground.rulePanel.sections.includes("sources") ? websiteStandardsManifest.componentPlayground.rulePanel.sources : []}
                    >
                      <WebsiteRuleValueList
                        items={websiteStandardsManifest.componentPlayground.rules.map((item) => ({
                          title: item.title,
                          meta: item.value,
                          description: item.logic,
                          value: "从 docs/data/website-standards.manifest.json 读取；真实调试内容从 docs/data/component-playgrounds.manifest.json 渲染。"
                        }))}
                      />
                    </WebsiteRulePanel>
                  ) : null}
                </WebsiteRulePopover>
              </div>
              <WebsiteStandardsPlayground lang={lang} />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-4">
                <SectionLead title="SectionLead" description="用于内容区小标题；标题和说明固定 4px 间距。" />
                <WebsiteRulePopover>
                    {websiteStandardsManifest.sectionLead.rulePanel.sections.includes("values") ? (
                      <WebsiteRulePanel
                        title="视觉取值"
                        badge="SectionLead 插槽"
                        sources={websiteStandardsManifest.sectionLead.rulePanel.sections.includes("sources") ? websiteStandardsManifest.sectionLead.rulePanel.sources : []}
                      >
                        <WebsiteRuleValueList
                          items={websiteStandardsManifest.sectionLead.visualBaseline.map((item) => ({
                            title: item.title,
                            meta: item.slot,
                            description: sectionLeadSlotGuideMap[item.slot],
                            value: getSectionLeadSlotValue(item.slot)
                          }))}
                        />
                        {websiteStandardsManifest.sectionLead.rulePanel.sections.includes("usage") ? (
                          <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
                            {websiteStandardsManifest.sectionLead.usageBullets.map((item) => (
                              <p key={item}>{item}</p>
                            ))}
                          </div>
                        ) : null}
                      </WebsiteRulePanel>
                    ) : null}
                </WebsiteRulePopover>
              </div>
              <div className="rounded-lg border border-border bg-card p-5">
                <SectionLead title="小标题" description="说明固定 14px，内容紧跟说明下方。" />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-4">
                <SectionLead title="WebsiteRulePopover" description="用于网站规范页的查看规则入口；按钮、箭头、弹窗定位和规则面板统一维护。" />
                <WebsiteRulePopover>
                    {websiteStandardsManifest.websiteRulePopover.rulePanel.sections.includes("values") ? (
                      <WebsiteRulePanel
                        title="视觉取值"
                        badge="WebsiteRulePopover 插槽"
                        sources={websiteStandardsManifest.websiteRulePopover.rulePanel.sections.includes("sources") ? websiteStandardsManifest.websiteRulePopover.rulePanel.sources : []}
                      >
                        <WebsiteRuleValueList
                          items={websiteStandardsManifest.websiteRulePopover.visualBaseline.map((item) => ({
                            title: item.title,
                            meta: item.slot,
                            description: websiteRulePopoverSlotGuideMap[item.slot],
                            value: getWebsiteRulePopoverSlotValue(item.slot)
                          }))}
                        />
                      </WebsiteRulePanel>
                    ) : null}
                </WebsiteRulePopover>
              </div>
              <div className="rounded-lg border border-border bg-card p-5">
                <WebsiteRulePopover>
                  <WebsiteRulePanel title="视觉取值" badge="示例">
                    <WebsiteRuleValueList
                      items={[
                        {
                          title: "查看规则",
                          meta: "trigger",
                          description: "点击后展开规则弹窗；再次点击收起。",
                          value: "按钮、箭头和弹窗定位均由 WebsiteRulePopover 统一控制。"
                        }
                      ]}
                    />
                  </WebsiteRulePanel>
                </WebsiteRulePopover>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <SectionLead title="PageActions" description="页面级动作只放在标题右侧：复制、更多、上一页、下一页。" />
              <div className="flex rounded-lg border border-border bg-card p-5">
                <PageActions
                  doc={websiteStandardsDoc}
                  demo
                  lang={lang}
                  navActions={<PageStepActions demo previous={{ label: "文档规范", labelEn: "Documentation", href: "#documentation", group: "维护", groupEn: "Maintain" }} next={{ label: "检查命令", labelEn: "Checks", href: "#checks", group: "维护", groupEn: "Maintain" }} lang={lang} />}
                  viewMode="page"
                  onViewModeChange={() => {}}
                />
              </div>
            </div>
          </div>
        </section>

        <section id="website-standards-spacing" className={docsSpacing.sectionStack}>
          <div className="flex items-start justify-between gap-4">
            <SectionLead
              title={lang === "en" ? "Spacing Rhythm" : "间距节奏"}
              description={lang === "en" ? "Use a page-section diagram to show page padding, page lead to first section, and section-to-section rhythm." : "用页面截面示意页面边距、标题组到首个小标题、小标题之间的节奏。"} />
            <WebsiteRulePopover>
              {websiteStandardsManifest.spacingRhythm.rulePanel.sections.includes("values") ? (
                <WebsiteRulePanel
                  title="视觉取值"
                  badge="WebsiteSpacingRhythm"
                  sources={websiteStandardsManifest.spacingRhythm.rulePanel.sections.includes("sources") ? websiteStandardsManifest.spacingRhythm.rulePanel.sources : []}
                >
                  <WebsiteRuleValueList
                    items={[
                      ...websiteStandardsManifest.spacingRhythm.items.map((item) => ({
                        title: item.label,
                        meta: item.value,
                        description: item.logic,
                        value: "从 docs/data/website-standards.manifest.json 读取；页面示意只渲染组件。"
                      })),
                      ...websiteStandardsManifest.spacingRhythm.visualBaseline.map((item) => ({
                        title: item.title,
                        meta: item.slot,
                        description: websiteSpacingRhythmSlotGuideMap[item.slot],
                        value: getWebsiteSpacingRhythmSlotValue(item.slot)
                      }))
                    ]}
                  />
                </WebsiteRulePanel>
              ) : null}
            </WebsiteRulePopover>
          </div>
          <WebsiteSpacingRhythm items={websiteStandardsManifest.spacingRhythm.items} />
        </section>

        <section id="website-standards-boundaries" className={docsSpacing.sectionStack}>
          <div className="flex items-start justify-between gap-4">
            <SectionLead
              title={lang === "en" ? "Website Card Container" : "网站卡片容器"}
              description={lang === "en" ? "The docs site card surface for standalone information blocks, previews, internal areas, and elevated containers." : "文档站承载独立信息块、示例预览、内部区域和浮层容器的卡片表面。"} />
            <WebsiteRulePopover>
              {websiteStandardsManifest.websiteCardContainer.rulePanel.sections.includes("values") ? (
                <WebsiteRulePanel
                  title="视觉取值"
                  badge="WebsiteCardContainer"
                  sources={websiteStandardsManifest.websiteCardContainer.rulePanel.sections.includes("sources") ? websiteStandardsManifest.websiteCardContainer.rulePanel.sources : []}
                >
                  <WebsiteRuleValueList
                    items={[
                      ...websiteStandardsManifest.websiteCardContainer.rules.map((item) => ({
                        title: item.title,
                        meta: item.value,
                        description: item.logic,
                        value: "从 docs/data/website-standards.manifest.json 读取；页面预览只渲染组件。"
                      })),
                      ...websiteStandardsManifest.websiteCardContainer.visualBaseline.map((item) => ({
                        title: item.title,
                        meta: item.slot,
                        description: websiteCardContainerSlotGuideMap[item.slot],
                        value: getWebsiteCardContainerSlotValue(item.slot)
                      }))
                    ]}
                  />
                </WebsiteRulePanel>
              ) : null}
            </WebsiteRulePopover>
          </div>
          <WebsiteCardContainer label={lang === "en" ? "Internal area" : "内部区域"} />
        </section>
      </div>);

  }

  if (page === "governance-map") {
    return (
      <div className={docsSpacing.pageStack}>
        <section id="governance-map" className="flex flex-col gap-3">
          <PageLead
            crumb="维护 / 现状"
            title={lang === "en" ? "Status" : "现状看板"}
            lead={lang === "en" ?
            "A developer-facing snapshot of fx-ui governance: what is already protected, what is still being structured, and which checks are the current gate." :
            "给开发者看的仓库现状快照：哪些规则已经被检查保护，哪些还在结构化，当前交付门禁是什么。"}
            actions={actions} />
          <GovernanceQuickLinks currentPage={page} lang={lang} />
        </section>

        <section id="governance-map-status" className={docsSpacing.sectionStack}>
          <SectionLead title={
          lang === "en" ? "Current Status" : "当前状态"} description={

          lang === "en" ?
          "Start here when you only want to know whether the project is protected enough to keep changing." :
          "如果你只是想知道“现在能不能继续改、风险在哪”，先看这里。"} />

          
          <div className="grid gap-4 md:grid-cols-3">
            {governanceStatus.statusCards.map((card) =>
            <Card key={card.title}>
                <CardHeader>
                  <CardDescription>{card.title}</CardDescription>
                  <CardTitle className="text-2xl">{governanceSnapshot[card.valueKey as keyof typeof governanceSnapshot]}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{card.desc}</CardContent>
              </Card>
            )}
          </div>
          <GraphCockpit lang={lang} />
          <Card elevated>
            <CardHeader>
              <CardTitle className="text-base">{governanceStatus.maintenanceModel.title}</CardTitle>
              <CardDescription>{governanceStatus.maintenanceModel.desc}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {governanceStatus.maintenanceModel.layers.map((layer) =>
                <div key={layer.source} className="rounded-xl border border-border bg-card p-3">
                    <div className="text-sm font-semibold text-foreground">{layer.name}</div>
                    <code className="mt-2 block w-fit rounded bg-muted px-1.5 py-0.5 text-xs text-foreground">{layer.source}</code>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">{layer.role}</p>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">{layer.update}</p>
                  </div>
                )}
              </div>
              <div className="rounded-xl bg-muted p-4">
                <div className="text-sm font-semibold text-foreground">{lang === "en" ? "Change Rules" : "改动规则"}</div>
                <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
                  {governanceStatus.maintenanceModel.rules.map((rule) =>
                  <li key={rule} className="flex gap-2">
                      <span className="mt-3 size-1.5 shrink-0 rounded-full bg-success" />
                      <span>{rule}</span>
                    </li>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="governance-map-system" className={docsSpacing.sectionStack}>
          <SectionLead title={
          lang === "en" ? "System Map" : "工程运行图"} description={

          lang === "en" ?
          "Use the category view to see responsibility layers, and the file relation view to see which files import, read, check, constrain, or produce each other." :
          "分类视图看模块职责；文件关系看真实文件之间如何 import、读取、检查、约束和产出。这里关注工程文件怎么互相作用，不是时间顺序。"} />

          
          <Tabs defaultValue="site" className="flex flex-col gap-4">
            <TabsList className="w-fit">
              <TabsTrigger value="site">网站</TabsTrigger>
              <TabsTrigger value="project">项目</TabsTrigger>
            </TabsList>
            <TabsContent value="site" className="mt-0">
              <FxUiSystemDiagram scope="site" />
            </TabsContent>
            <TabsContent value="project" className="mt-0">
              <FxUiSystemDiagram scope="project" />
            </TabsContent>
          </Tabs>
        </section>

        <section id="governance-map-freshness" className={docsSpacing.sectionStack}>
          <SectionLead title={
          lang === "en" ? "Freshness" : "数据新鲜度"} description={

          lang === "en" ?
          "The board updates when these source files update." :
          "这个看板的“实时”来自这些源文件，源文件变了，看板刷新后就变。"} />

          
          <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
            <Table className="min-w-[860px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-4">数据</TableHead>
                  <TableHead>来源</TableHead>
                  <TableHead>更新时间</TableHead>
                  <TableHead className="pr-4">怎么维护</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {governanceStatus.freshness.map((row) =>
                <TableRow key={row.source}>
                    <TableCell className="pl-4 font-medium">{row.name}</TableCell>
                    <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.source}</code></TableCell>
                    <TableCell className="text-muted-foreground">{governanceFreshness[row.updatedAtKey as keyof typeof governanceFreshness]}</TableCell>
                    <TableCell className="pr-4 text-muted-foreground">{row.maintenance}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </section>

        <section id="governance-map-assets" className={docsSpacing.sectionStack}>
          <SectionLead title={
          lang === "en" ? "Governance Assets" : "规则资产"} description={

          lang === "en" ?
          "This table shows which rules already have the full anti-drift loop and which ones still need structure." :
          "这张表看一眼就知道：哪些规则已经形成防漂闭环，哪些还只是半结构化。"} />

          
          <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
            <Table className="min-w-[900px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-4">{lang === "en" ? "Rule" : "规则"}</TableHead>
                  <TableHead>{lang === "en" ? "Text Spec" : "文字规范"}</TableHead>
                  <TableHead>{lang === "en" ? "Machine Data" : "机器事实"}</TableHead>
                  <TableHead>{lang === "en" ? "Check" : "检查"}</TableHead>
                  <TableHead className="pr-4">{lang === "en" ? "Status" : "状态"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {governanceStatus.assets.map((asset) =>
                <TableRow key={asset.rule}>
                    <TableCell className="pl-4 font-medium">{asset.rule}</TableCell>
                    <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{asset.textSpec}</code></TableCell>
                    <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{asset.machineData}</code></TableCell>
                    <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{asset.check}</code></TableCell>
                    <TableCell className="pr-4">
                      <StatusBadge status={asset.status} />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </section>

        <section id="governance-map-loop" className={docsSpacing.sectionStack}>
          <SectionLead title={
          lang === "en" ? "Governance Loop" : "治理闭环"} description={

          lang === "en" ?
          "This is the rule model behind the status board." :
          "这是现状看板背后的规则模型，平时不用先看它。"} />

          
          <Card elevated>
            <CardContent className="grid gap-4 p-5 md:grid-cols-4">
              {governanceStatus.loop.map((item, index) =>
              <div key={item.file} className="relative rounded-xl border border-border bg-background p-4">
                  <StepBadge index={index} />
                  <h3 className="mt-4 text-base font-semibold">{lang === "en" ? item.titleEn : item.title}</h3>
                  <code className="mt-2 block rounded bg-muted px-2 py-1 text-xs">{item.file}</code>
                  <p className="mt-3 text-sm text-muted-foreground">{lang === "en" ? item.descEn : item.desc}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        <section id="governance-map-references" className={docsSpacing.sectionStack}>
          <SectionLead title={
          lang === "en" ? "References" : "参考案例"} description={

          lang === "en" ?
          "These are not copied directly. They point to mainstream patterns that match our direction." :
          "这些不是照搬，而是说明我们的方向和主流做法接近：关系图、检查项、Policy as Code。"} />

          
          <div className="grid gap-4 md:grid-cols-3">
            {governanceStatus.references.map((reference) =>
            <Card key={reference.title}>
                <CardHeader>
                  <CardTitle className="text-base">{reference.title}</CardTitle>
                  <CardDescription>{reference.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <a className="text-sm font-medium text-primary hover:underline" href={reference.href} target="_blank" rel="noreferrer">
                    {lang === "en" ? "Open reference" : "查看参考"}
                  </a>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        <section id="governance-map-todo" className={docsSpacing.sectionStack}>
          <SectionLead title={
          lang === "en" ? "Governance TODO" : "治理待办"} description={

          lang === "en" ?
          "The next automation and anti-drift steps tracked as machine data, so follow-up work does not live only in chat history." :
          "后续自动化和防漂工作直接登记成机器事实，避免待办只存在聊天记录里。"} />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {governanceTodo.items.map((item) =>
            <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-base">{item.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Tag variant="secondary">{item.priority}</Tag>
                      <StatusBadge status={item.status} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>{item.definitionOfDone}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

      </div>);

  }

  if (page === "install") {
    return (
      <div className={docsSpacing.pageStack}>
        <section id="install" className="flex flex-col gap-2">
          <PageLead
            crumb={lang === "en" ? "Getting Started / Installation" : "开始使用 / 安装"}
            title={lang === "en" ? "Installation" : "安装"}
            lead={lang === "en" ?
            "Start from a shadcn project, add the fx-ui component set, then import the company theme tokens." :
            "从 shadcn 项目起步，安装 fx-ui 所需基础组件，再接入公司主题 token。"}
            actions={actions} />
        </section>

        <section id="install-prerequisites" className={docsSpacing.sectionStack}>
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Prerequisites" : "接入前提"}</h2>
          <Card elevated>
            <CardContent className="flex flex-col gap-3 p-5 text-sm text-muted-foreground">
              {governancePagesManifest.install.prerequisites.map((item) =>
              <div key={item} className="flex gap-2"><CheckCircleIcon className="mt-1 size-4 text-primary" /> <span>{item}</span></div>
              )}
            </CardContent>
          </Card>
          <CopyCodeBlock code={initShadcnCode} label="shadcn" lang={lang} />
        </section>

        <section id="install-components" className={docsSpacing.sectionStack}>
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Install Components" : "安装组件"}</h2>
          <p className="text-base text-muted-foreground">
            {lang === "en" ?
            "fx-ui uses shadcn open-code components. Add components through the CLI instead of hand-writing base controls." :
            "fx-ui 使用 shadcn open-code 组件。基础控件通过 CLI 拉取，不手写 Button/Input/Dialog 这类组件。"}
          </p>
          <CopyCodeBlock code={installCommandsCode} label="shadcn" lang={lang} />
        </section>

        <section id="install-theme" className={docsSpacing.sectionStack}>
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Install Theme" : "接入主题"}</h2>
          <p className="text-base text-muted-foreground">
            {lang === "en" ?
            "Use theme/fx-theme.css as the runtime token source. For distribution, publish registry/fx-theme.json as a shadcn registry theme." :
            "运行时使用 theme/fx-theme.css 作为 token 真相源；对外分发时使用 registry/fx-theme.json 作为 shadcn registry:theme。"}
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <CopyCodeBlock code={themeSetupCode} label="runtime theme" lang={lang} />
            <CopyCodeBlock code={themeDistributionCode} label="registry theme" lang={lang} />
          </div>
        </section>

        <section id="install-structure" className={docsSpacing.sectionStack}>
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Structure" : "目录约定"}</h2>
          <Card elevated>
            <CardContent className="flex flex-col gap-3 p-5 text-sm text-muted-foreground">
              {governancePagesManifest.install.structure.map((item) =>
              <p key={item}>{item}</p>
              )}
            </CardContent>
          </Card>
        </section>

        <section id="install-verify" className={docsSpacing.sectionStack}>
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Verify" : "启动检查"}</h2>
          <Card elevated>
            <CardContent className="flex flex-col gap-3 p-5 text-sm text-muted-foreground">
              {governancePagesManifest.install.verify.map((item) =>
              <div key={item} className="flex gap-2"><CheckCircleIcon className="mt-1 size-4 text-primary" /> <span>{item}</span></div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>);

  }

  if (page === "theme") {
    return (
      <div className={docsSpacing.pageStack}>
        <section id="theme" className="flex flex-col gap-2">
          <PageLead
            crumb={lang === "en" ? "Getting Started / Theme Setup" : "开始使用 / 主题"}
            title={lang === "en" ? "Theme" : "主题"}
            lead={lang === "en" ?
            "fx-ui does not restyle every component by hand. Company visuals are injected through shadcn semantic tokens." :
            "fx-ui 不逐个重写组件样式。公司视觉通过 shadcn 语义 token 注入。"}
            actions={actions} />
        </section>

        <section id="theme-source" className={docsSpacing.sectionStack}>
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Token Source" : "token 真相源"}</h2>
          <Card elevated>
            <CardContent className="grid gap-4 p-5 md:grid-cols-2">
              <div>
                <Tag variant="secondary">SSOT</Tag>
                <h3 className="mt-3 font-medium">theme/fx-theme.css</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {lang === "en" ? "Changing this file changes the whole system." : "改这里等于全局换肤，必须先说明影响范围。"}
                </p>
              </div>
              <CopyCodeBlock code={themeImportCode} label="src/main.tsx" lang={lang} />
            </CardContent>
          </Card>
        </section>

        <section id="theme-slots" className={docsSpacing.sectionStack}>
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Semantic Slots" : "shadcn 语义槽"}</h2>
          <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
            <Table className="min-w-[720px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-4">Layer</TableHead>
                  <TableHead>{lang === "en" ? "Example" : "例子"}</TableHead>
                  <TableHead className="pr-4">{lang === "en" ? "Purpose" : "用途"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {governancePagesManifest.theme.semanticSlots.map((item) =>
                <TableRow key={item.layer}>
                    <TableCell className="pl-4 font-medium">{item.layer}</TableCell>
                    <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{item.example}</code></TableCell>
                    <TableCell className="pr-4 text-muted-foreground">{item.purpose}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </section>

        <section id="theme-flow" className={docsSpacing.sectionStack}>
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Change Flow" : "修改流程"}</h2>
          <Card>
            <CardContent className="flex flex-col gap-3 p-5 text-sm text-muted-foreground">
              {governancePagesManifest.theme.changeFlow.map((item, index) =>
              <p key={item}>{index + 1}. {item}</p>
              )}
            </CardContent>
          </Card>
        </section>
      </div>);

  }

  if (page === "ai-rules") {
    return (
      <div className={docsSpacing.pageStack}>
        <section id="ai-rules" className="flex flex-col gap-3">
          <PageLead
            crumb={lang === "en" ? "Maintain / AI Rules" : "维护 / AI 规则"}
            title={lang === "en" ? "AI Rules" : "AI 规则"}
            lead={lang === "en" ?
            "These rules keep AI-generated pages aligned with shadcn open-code, company tokens, and executable checks." :
            "这些规则用来保证 AI 生成页面时对齐 shadcn open-code、公司 token 和可执行检查。"}
            actions={actions} />
        </section>

        <section id="ai-guardrails" className={docsSpacing.sectionStack}>
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Guardrails" : "行为红线"}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {governancePagesManifest.aiRules.guardrails.map((item) =>
            <Card key={item.title}>
                <CardHeader><CardTitle className="text-base">{item.title}</CardTitle></CardHeader>
                <CardContent className="text-sm text-muted-foreground">{item.desc}</CardContent>
              </Card>
            )}
          </div>
        </section>

        <section id="ai-style-flow" className={docsSpacing.sectionStack}>
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Style Flow" : "改样式流程"}</h2>
          <Card>
            <CardContent className="flex flex-col gap-3 p-5 text-sm text-muted-foreground">
              {governancePagesManifest.aiRules.styleFlow.map((item, index) =>
              <p key={item}>{index + 1}. {item}</p>
              )}
            </CardContent>
          </Card>
        </section>

        <section id="ai-checks" className={docsSpacing.sectionStack}>
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Checks" : "交付检查"}</h2>
          <CopyCodeBlock code="npm run check" label="check" lang={lang} />
          <p className="text-base text-muted-foreground">
            {lang === "en" ?
            "This runs shadcn contract checks, token drift checks, doc-site contract checks, component manifest checks, and the production build." :
            "这会同时跑 shadcn 契约、token 漂移、文档站契约、组件 manifest 和生产构建。"}
          </p>
        </section>
      </div>);

  }

  if (page === "documentation") {
    return (
      <div className={docsSpacing.pageStack}>
        <section id="documentation" className="flex flex-col gap-2">
          <PageLead
            crumb={lang === "en" ? "Governance / Documentation" : "维护 / 文档规范"}
            title={lang === "en" ? "Documentation" : "文档规范"}
            lead={lang === "en" ?
            "This page explains where information belongs, how to avoid orphan documents, and when text rules need machine checks." :
            "这页解决一件事：一条信息该写去哪，怎么避免孤岛文档，以及哪些文字规则必须升级成机器检查。"}
            actions={actions} />
          <GovernanceQuickLinks currentPage={page} lang={lang} />
        </section>

        <section id="documentation-ssot" className={docsSpacing.sectionStack}>
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "SSOT Routes" : "SSOT 路由"}</h2>
          <p className="text-base text-muted-foreground">
            {lang === "en" ?
            "One kind of information has one truth source, and every referenced surface must stay linked to it instead of drifting into separate copies." :
            "同一类信息只维护一个真相源；所有引用到它的地方都必须和它联动，不能各自漂成副本。"}
          </p>
          <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
            <Table className="min-w-[760px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-4">{lang === "en" ? "Question" : "问题"}</TableHead>
                  <TableHead>{lang === "en" ? "Truth Source" : "真相源"}</TableHead>
                  <TableHead className="pr-4">{lang === "en" ? "Use It For" : "使用场景"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {governancePagesManifest.documentation.ssotRoutes.map((item) =>
                <TableRow key={item.question}>
                    <TableCell className="pl-4 font-medium">{item.question}</TableCell>
                    <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{item.source}</code></TableCell>
                    <TableCell className="pr-4 text-muted-foreground">{item.usage}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </section>

        <section id="documentation-anti-drift" className={docsSpacing.sectionStack}>
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Anti-Drift Loop" : "防漂三件套"}</h2>
          <Card>
            <CardContent className="grid gap-4 p-5 md:grid-cols-3">
              {governancePagesManifest.documentation.antiDriftLoop.map((item) =>
              <div key={item.title} className="rounded-lg border border-border bg-background p-4">
                  <Tag variant="secondary">{item.title}</Tag>
                  <p className="mt-3 font-medium"><code>{item.file}</code></p>
                  <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
                </div>
              )}
            </CardContent>
          </Card>
          <CopyCodeBlock
            code={`文字规范 text spec
  -> 机器事实表 machine manifest
  -> 可执行检查 executable check`}
            label="governance loop"
            lang={lang} />
          
        </section>

        <section id="documentation-write-rules" className={docsSpacing.sectionStack}>
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Write Rules" : "写入规则"}</h2>
          <Card>
            <CardContent className="flex flex-col gap-3 p-5 text-sm text-muted-foreground">
              {governancePagesManifest.documentation.writeRules.map((rule) =>
              <div key={rule} className="flex gap-2"><CheckCircleIcon className="mt-1 size-4 text-primary" /> <span>{rule}</span></div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>);

  }

  if (page === "checks") {
    return (
      <div className={docsSpacing.pageStack}>
        <section id="checks" className="flex flex-col gap-2">
          <PageLead
            crumb={lang === "en" ? "Governance / Checks" : "维护 / 检查命令"}
            title={lang === "en" ? "Checks" : "检查命令"}
            lead={lang === "en" ?
            "Use these commands to verify component contracts, token sync, documentation structure, and production build health." :
            "这里列出一次改动完成前该跑什么检查：组件契约、token 同步、文档站骨架、组件 manifest 和生产构建。"}
            actions={actions} />
          <GovernanceQuickLinks currentPage={page} lang={lang} />
        </section>

        <section id="checks-commands" className={docsSpacing.sectionStack}>
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Commands" : "常用命令"}</h2>
          <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
            <Table className="min-w-[760px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-4">{lang === "en" ? "Command" : "命令"}</TableHead>
                  <TableHead className="pr-4">{lang === "en" ? "When To Use" : "什么时候用"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {governancePagesManifest.checks.commands.map((item) =>
                <TableRow key={item.command}>
                    <TableCell className="pl-4"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{item.command}</code></TableCell>
                    <TableCell className="pr-4 text-muted-foreground">{item.usage}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </section>

        <section id="checks-layers" className={docsSpacing.sectionStack}>
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Check Layers" : "检查分层"}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {governancePagesManifest.checks.layers.map((item) =>
            <Card key={item.title}>
                <CardHeader>
                  <CardTitle className="text-base">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p><code>{item.script}</code></p>
                  <p className="mt-2">{item.desc}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        <section id="checks-checklist" className={docsSpacing.sectionStack}>
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Finish Checklist" : "收尾清单"}</h2>
          <Card>
            <CardContent className="flex flex-col gap-3 p-5 text-sm text-muted-foreground">
              {governancePagesManifest.checks.finishChecklist.map((item) =>
              <div key={item} className="flex gap-2"><CheckCircleIcon className="mt-1 size-4 text-primary" /> <span>{item}</span></div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>);

  }

  return (
    <div className={docsSpacing.pageStack}>
      <section id="intro" className="flex flex-col gap-8">
        <PageLead
          crumb={lang === "en" ? "Getting Started / Overview" : "开始使用 / 概览"}
          title={lang === "en" ? "FX.UI Getting Started" : "FX.UI 开始使用"}
          lead={lang === "en" ?
          "fx-ui is a shadcn open-code design system powered by company tokens, reusable business compositions, documentation contracts, and AI-readable rules." :
          "欢迎使用 FX.UI。这是一套基于 shadcn open-code、公司 token、业务组合组件、文档契约和 AI 可读规则的前端生产体系。"}
          actions={actions} />

        <div className="grid gap-4 md:grid-cols-3">
          <Card elevated>
            <CardHeader>
              <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary-light text-primary">
                <PackageIcon className="size-5" />
              </div>
              <CardTitle className="text-base">{lang === "en" ? "Open-code components" : "组件开箱可改"}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-6 text-muted-foreground">
              {lang === "en" ?
              "Base controls live in src/components/ui as shadcn source code. We use existing components first, not hand-written lookalikes." :
              "基础组件进入 src/components/ui，源码可见可改。优先使用现成 shadcn 组件，不手写一个“看起来像”的控件。"}
            </CardContent>
          </Card>
          <Card elevated>
            <CardHeader>
              <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary-light text-primary">
                <PaletteIcon className="size-5" />
              </div>
              <CardTitle className="text-base">{lang === "en" ? "Token-driven theme" : "公司视觉靠 token 注入"}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-6 text-muted-foreground">
              {lang === "en" ?
              "theme/fx-theme.css is the visual truth source. Components consume semantic slots instead of hard-coded colors." :
              "theme/fx-theme.css 是视觉真相源。组件吃语义 token，不在调用处硬编码颜色、圆角、边框或阴影。"}
            </CardContent>
          </Card>
          <Card elevated>
            <CardHeader>
              <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary-light text-primary">
                <BoltIcon className="size-5" />
              </div>
              <CardTitle className="text-base">{lang === "en" ? "Governed delivery" : "规则和检查兜底"}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-6 text-muted-foreground">
              {lang === "en" ?
              "Docs, manifests, and checks move together, so UI changes are reviewable and AI agents have a stable contract." :
              "文档、manifest 和检查联动，保证组件能力、token、页面路由和 AI 规则不会各自漂移。"}
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="intro-positioning" className={docsSpacing.sectionStack}>
        <SectionLead
          title={lang === "en" ? "Positioning" : "定位"}
          description={lang === "en" ? "fx-ui is not a theme skin or a black-box ProTable. It is a governed open-code system for real product pages." : "fx-ui 不是一套皮肤，也不是黑盒 ProTable，而是服务真实业务页面的 open-code 生产体系。"} />
        <div className="grid gap-4 md:grid-cols-3">
          {governancePagesManifest.overview.positioning.map((item) =>
          <Card key={item.title} elevated>
              <CardHeader><CardTitle className="text-base">{item.title}</CardTitle></CardHeader>
              <CardContent className="text-sm leading-6 text-muted-foreground">{item.desc}</CardContent>
            </Card>
          )}
        </div>
      </section>

      <section id="intro-install" className={docsSpacing.sectionStack}>
        <SectionLead
          title={lang === "en" ? "How to Install and Use" : "如何安装和引入"}
          description={lang === "en" ? "Start from shadcn, add only the components you need, then import the fx-ui theme tokens." : "从 shadcn 项目起步，按需拉取组件，再引入 fx-ui 公司主题 token。"} />

        <Card elevated>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="text-base">{lang === "en" ? "Method 1: shadcn CLI" : "方法一：使用 shadcn CLI（推荐）"}</CardTitle>
                <CardDescription>
                  {lang === "en" ? "Initialize shadcn, add components, and keep components open-code in your repository." : "初始化 shadcn，按需添加组件，并保持组件源码进入项目。"}
                </CardDescription>
              </div>
              <Tag color="amber">Recommended</Tag>
            </div>
          </CardHeader>
          <CardContent>
            <CopyCodeBlock
              code={`# 1. 初始化 shadcn 配置
npx shadcn@latest init

# 2. 按需添加 fx-ui 当前使用的基础组件
${installCommandsCode}`}
              label="install commands"
              lang={lang} />
          </CardContent>
        </Card>

        <Card elevated>
          <CardHeader>
            <CardTitle className="text-base">{lang === "en" ? "Method 2: Copy & Paste" : "方法二：手动 Copy & Paste"}</CardTitle>
            <CardDescription>
              {lang === "en" ? "Use this when you are moving selected pieces into an existing project." : "如果不想走 CLI，也可以把所需源码和 token 手动搬进现有项目。"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
            <p><span className="font-medium text-foreground">1. 依赖安装：</span><code className="rounded bg-muted px-1.5 py-0.5 text-xs">npm install @base-ui/react class-variance-authority clsx tailwind-merge</code></p>
            <p><span className="font-medium text-foreground">2. 复制组件：</span>从 <code className="rounded bg-muted px-1.5 py-0.5 text-xs">src/components/ui</code> 和 <code className="rounded bg-muted px-1.5 py-0.5 text-xs">src/components/fx</code> 复制需要的组件源码。</p>
            <p><span className="font-medium text-foreground">3. 接入主题：</span>复制 <code className="rounded bg-muted px-1.5 py-0.5 text-xs">theme/fx-theme.css</code>，并在入口文件引入。</p>
            <p><span className="font-medium text-foreground">4. 保留契约：</span>不要在业务调用处覆盖组件视觉；需要新外观时在组件层沉淀 variant。</p>
          </CardContent>
        </Card>
      </section>

      <section id="theme-source" className={docsSpacing.sectionStack}>
        <SectionLead
          title={lang === "en" ? "Theme Setup" : "主题接入"}
          description={lang === "en" ? "fx-ui does not restyle every component by hand. Company visuals are injected through shadcn semantic tokens." : "fx-ui 不逐个重写组件样式。公司视觉通过 shadcn 语义 token 注入。"} />
        <Card elevated>
          <CardContent className="grid gap-4 p-5 md:grid-cols-2">
            <div>
              <Tag variant="secondary">SSOT</Tag>
              <h3 className="mt-3 font-medium">theme/fx-theme.css</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {lang === "en" ? "Changing this file changes the whole system." : "改这里等于全局换肤，必须先说明影响范围。"}
              </p>
            </div>
            <CopyCodeBlock code={themeImportCode} label="src/main.tsx" lang={lang} />
          </CardContent>
        </Card>
      </section>

      <section id="theme-slots" className={docsSpacing.sectionStack}>
        <SectionLead
          title={lang === "en" ? "Semantic Slots" : "shadcn 语义槽"}
          description={lang === "en" ? "Components consume semantic token names, so product code does not need page-level visual overrides." : "组件消费语义 token，业务调用处不需要再覆盖颜色、边框、圆角和阴影。"} />
        <Card elevated className="p-0">
          <CardContent className="p-0">
            <Table className="min-w-[720px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-4">Layer</TableHead>
                  <TableHead>{lang === "en" ? "Example" : "例子"}</TableHead>
                  <TableHead className="pr-4">{lang === "en" ? "Purpose" : "用途"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {governancePagesManifest.theme.semanticSlots.map((item) =>
                <TableRow key={item.layer}>
                    <TableCell className="pl-4 font-medium">{item.layer}</TableCell>
                    <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{item.example}</code></TableCell>
                    <TableCell className="pr-4 text-muted-foreground">{item.purpose}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      <section id="theme-flow" className={docsSpacing.sectionStack}>
        <SectionLead
          title={lang === "en" ? "Change Flow" : "修改流程"}
          description={lang === "en" ? "Token changes start from the visual truth source, then flow into docs, manifests, and component mappings." : "token 改动从视觉真相源开始，再同步文档、manifest 和组件映射。"} />
        <Card elevated>
          <CardContent className="flex flex-col gap-3 p-5 text-sm text-muted-foreground">
            {governancePagesManifest.theme.changeFlow.map((item, index) =>
            <p key={item}>{index + 1}. {item}</p>
            )}
          </CardContent>
        </Card>
      </section>

      <section id="intro-layers" className={docsSpacing.sectionStack}>
        <SectionLead
          title={lang === "en" ? "Internal Maintenance Guide" : "内部维护指南"}
          description={lang === "en" ? "When you change fx-ui itself, follow the source-routing and verification chain instead of editing only the visible page." : "如果你是在维护 fx-ui 本身，先看真相源和联动链，不只改眼前页面。"} />

        <div className="grid gap-4 md:grid-cols-2">
          <Card elevated>
            <CardHeader>
              <CardTitle className="text-base">{lang === "en" ? "Add or change components" : "如何新增或修改组件？"}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
              <p>1. 先查 <code className="rounded bg-muted px-1.5 py-0.5 text-xs">docs/MAP.md</code>，确认产物归属和检查方式。</p>
              <p>2. 基础组件先用 <code className="rounded bg-muted px-1.5 py-0.5 text-xs">npx shadcn@latest add</code> 拉取，不从零手写。</p>
              <p>3. 同步源码、组件文档、manifest、文档页示例和导航入口。</p>
              <p>4. 收尾运行 <code className="rounded bg-muted px-1.5 py-0.5 text-xs">npm run check</code>；视觉改动补跑 <code className="rounded bg-muted px-1.5 py-0.5 text-xs">npm run test:visual</code>。</p>
            </CardContent>
          </Card>
          <Card elevated>
            <CardHeader>
              <CardTitle className="text-base">{lang === "en" ? "Change theme tokens" : "如何更新主题 token？"}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
              <p>1. 视觉真相源只在 <code className="rounded bg-muted px-1.5 py-0.5 text-xs">theme/fx-theme.css</code>。</p>
              <p>2. 改 token 后同步 <code className="rounded bg-muted px-1.5 py-0.5 text-xs">docs/TOKENS.md</code> 和 <code className="rounded bg-muted px-1.5 py-0.5 text-xs">docs/data/design-tokens.json</code>。</p>
              <p>3. 运行 <code className="rounded bg-muted px-1.5 py-0.5 text-xs">npm run build:tokens</code> 重建 token manifest。</p>
              <p>4. 最后才改组件映射，避免组件和 token 真相源漂移。</p>
            </CardContent>
          </Card>
        </div>

        <h3 className="text-lg font-bold tracking-tight">{lang === "en" ? "Three Layers" : "三层体系"}</h3>
        <Card elevated className="p-0">
          <CardContent className="p-0">
            <Table className="min-w-[760px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-4">Layer</TableHead>
                  <TableHead>{lang === "en" ? "Directory" : "目录"}</TableHead>
                  <TableHead className="pr-4">{lang === "en" ? "Responsibility" : "职责"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {governancePagesManifest.overview.layers.map((item) =>
                <TableRow key={item.layer}>
                    <TableCell className="pl-4 font-medium">{item.layer}</TableCell>
                    <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{item.directory}</code></TableCell>
                    <TableCell className="pr-4 text-muted-foreground">{item.responsibility}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

        <section id="intro-audience" className={docsSpacing.sectionStack}>
          <SectionLead
            title={lang === "en" ? "Team Workflow and Deployment" : "团队协同和项目部署"}
            description={lang === "en" ? "A small checklist for keeping the project reviewable and deployable." : "维护时保持可审查、可回滚、可部署的一组最小规则。"} />
          <Card elevated>
            <CardContent className="flex flex-col gap-5 p-5 text-sm leading-6 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground">1. 分支与代码审查</h3>
                <p className="mt-2">功能变更走独立分支；涉及组件 API、token、页面结构的改动，需要说明影响范围和验证结果。</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">2. 代码风格与契约</h3>
                <p className="mt-2">使用 TypeScript、Tailwind token 和现有组件 API；不要绕开组件在页面里临时覆盖视觉。</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">3. 变更记录</h3>
                <p className="mt-2">结构性变化记录到 <code className="rounded bg-muted px-1.5 py-0.5 text-xs">docs/CHANGELOG.md</code>；长期决策记录到 <code className="rounded bg-muted px-1.5 py-0.5 text-xs">docs/DECISIONS.md</code>。</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">4. 项目部署</h3>
                <p className="mt-2">在项目根目录运行构建命令，生成的 <code className="rounded bg-muted px-1.5 py-0.5 text-xs">dist</code> 可托管到 Vercel、Netlify 或内部 Nginx。</p>
                <div className="mt-3">
                  <CopyCodeBlock code="npm run build" label="build" lang={lang} />
                </div>
              </div>
              <div className="grid gap-3 border-t border-border-subtle pt-5 md:grid-cols-3">
                {governancePagesManifest.overview.audience.map((item) =>
                <p key={item} className="rounded-lg bg-muted p-3">{item}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </section>
    </div>);

}

function ComponentsIndexPage({ actions, lang }: {actions: React.ReactNode;lang: Lang;}) {
const uiSections = componentIndexSections.filter((section) => !["业务组合组件", "Agent 界面"].includes(section.title));
const fxSections = componentIndexSections.filter((section) => section.title === "业务组合组件");
const agentSections = componentIndexSections.filter((section) => section.title === "Agent 界面");

  return (
    <div className={docsSpacing.pageStack}>
      <section id="components" className="flex flex-col gap-2">
        <PageLead
          crumb={lang === "en" ? "Components / Index" : "组件 / 概览"}
          title={lang === "en" ? "Components" : "组件"}
          lead={lang === "en" ?
          "Find every component currently available in fx-ui. Base controls come from shadcn open-code; company compositions are listed separately." :
          "这里可以找到 fx-ui 当前可用的组件。基础控件来自 shadcn open-code，公司组合组件单独列出。"}
          actions={actions} />
      </section>

      <section id="components-ui" className={docsSpacing.sectionStack}>
        <SectionLead title={
        lang === "en" ? "UI Components" : "基础组件"} description={

        lang === "en" ?
        "Installed shadcn/ui components and local documentation pages." :
        "已安装并在本站沉淀文档的 shadcn/ui 基础组件。"} />

        <ComponentIndexGrid sections={uiSections} lang={lang} />
      </section>

      <section id="components-fx" className={docsSpacing.sectionStack}>
        <SectionLead title={
        lang === "en" ? "Compositions" : "业务组合"} description={

        lang === "en" ?
        "Company-level patterns composed from shadcn primitives." :
        "由 shadcn 基础组件组合出来的公司级模式。"} />

        <ComponentIndexGrid sections={fxSections} lang={lang} />
      </section>

      <section id="components-agent-ui" className={docsSpacing.sectionStack}>
        <SectionLead title={"Agent 界面"} description={


        lang === "en" ?
        "Controlled generative UI surfaces for Agent responses. Agents send JSON intent; fx-ui renders trusted React components." :
        "承载 Agent 回复里的受控生成式 UI。Agent 发 JSON 意图，fx-ui 渲染可信 React 组件。"} />

        <ComponentIndexGrid sections={agentSections} lang={lang} />
      </section>

    </div>);

}

// 全站统一的「场景示例」表：场景 / 示例 / [规格] / 使用意图 / 约束 / 推荐写法。
// 列宽与换行规范见 docs/DOC_SITE_DESIGN.md「表格」。调用方传入已按 lang 本地化的 rows + preview 节点。
type ScenarioRow = {key: string;group?: string;title: string;preview: React.ReactNode;spec?: string;intent: string;constraint: string;code: string;};
function ScenarioTable({ rows, filters, lang, layout = "table", elevated = false }: {rows: ScenarioRow[];filters?: {value: string;label: string;labelEn?: string;}[];lang: Lang;layout?: "table" | "stack";elevated?: boolean;}) {
  const cardShell = elevated ? "rounded-xl shadow-l1" : "rounded-lg";
  const [filter, setFilter] = useState(filters?.[0]?.value ?? "all");
  const shown = filters ? rows.filter((r) => r.group === filter) : rows;
  // 规格列只在当前显示的行真的有规格时才出现（≈只在「尺寸」分组出现），避免类型/用法 tab 显示一列重复规格
  const hasSpec = shown.some((r) => r.spec);
  const filterTabs = filters ?
  <Tabs value={filter} onValueChange={setFilter} aria-label={lang === "en" ? "Filter examples" : "筛选场景"}>
      <TabsList className="flex h-auto flex-wrap justify-start">
        {filters.map((f) =>
      <TabsTrigger key={f.value} value={f.value}>{lang === "en" ? f.labelEn ?? f.label : f.label}</TabsTrigger>
      )}
      </TabsList>
    </Tabs> :
  null;
  // 整宽布局：预览铺满一行在上、意图/约束/写法排在下方。用于 TopBar 这类全宽组件，窄「示例」列放不下。
  if (layout === "stack") {
    return (
      <>
        {filterTabs}
        <div className="flex flex-col gap-5">
          {shown.map((r) =>
          <div key={r.key} className={`overflow-hidden border border-border bg-card ${cardShell}`}>
              <div className="flex items-center justify-between gap-3 border-b border-border-subtle px-4 py-2.5">
                <span className="font-medium">{r.title}</span>
                {r.spec ? <span className="text-sm text-muted-foreground">{r.spec}</span> : null}
              </div>
              <div className="overflow-x-auto p-5">{r.preview}</div>
              <div className="grid grid-cols-[minmax(0,1fr)_minmax(320px,1.2fr)] gap-4 border-t border-border-subtle p-4">
                <div className="grid gap-3">
                  <div className="flex flex-col gap-1">
                    <div className="text-sm font-medium text-muted-foreground">{lang === "en" ? "Intent" : "使用意图"}</div>
                    <div className="leading-6 text-muted-foreground">{r.intent}</div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="text-sm font-medium text-muted-foreground">{lang === "en" ? "Constraint" : "约束"}</div>
                    <div className="leading-6 text-muted-foreground">{r.constraint}</div>
                  </div>
                </div>
                <div className="flex min-w-0 flex-col gap-1">
                  <div className="text-sm font-medium text-muted-foreground">{lang === "en" ? "Recommended API" : "推荐写法"}</div>
                  <div className="rounded-lg bg-muted">
                    <pre className="px-3 py-2 text-sm break-words whitespace-pre-wrap"><code>{r.code}</code></pre>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </>);

  }
  return (
    <>
      {filterTabs}
      <div className={`max-w-full overflow-x-auto border border-border bg-card ${cardShell}`}>
        <Table className="w-auto">
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">{lang === "en" ? "Usage" : "用法"}</TableHead>
              <TableHead>{lang === "en" ? "Example" : "示例"}</TableHead>
              {hasSpec ? <TableHead>{lang === "en" ? "Spec" : "规格"}</TableHead> : null}
              <TableHead>{lang === "en" ? "Intent" : "使用意图"}</TableHead>
              <TableHead>{lang === "en" ? "Constraint" : "约束"}</TableHead>
              <TableHead className="pr-4">{lang === "en" ? "Recommended API" : "推荐写法"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shown.map((r) =>
            <TableRow key={r.key} className="hover:bg-transparent has-aria-expanded:bg-transparent">

                <TableCell className="h-auto py-3 pl-4 align-top"><span className="font-medium">{r.title}</span></TableCell>
                <TableCell className="h-auto py-3 align-top"><div className="max-w-[400px]">{r.preview}</div></TableCell>
                {hasSpec ? <TableCell className="h-auto py-3 align-top text-foreground"><div className="w-max text-sm">{r.spec ?? "—"}</div></TableCell> : null}
                <TableCell className="h-auto py-3 align-top whitespace-normal text-muted-foreground"><div className="max-w-[240px] break-words leading-6">{r.intent}</div></TableCell>
                <TableCell className="h-auto py-3 align-top whitespace-normal text-muted-foreground"><div className="max-w-[260px] break-words leading-6">{r.constraint}</div></TableCell>
                <TableCell className="h-auto py-3 pr-4 align-top">
                  <div className="max-w-[360px] rounded-lg bg-muted">
                    <pre className="px-3 py-2 text-sm whitespace-pre-wrap break-words"><code>{r.code}</code></pre>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>);

}

type PgVariant = "default" | "secondary" | "outline" | "ghost" | "plain" | "destructive";
type PgTone = "default" | "primary" | "info" | "danger";
type PgSize = "xs" | "sm" | "md" | "lg";
type PgIcon = "none" | "start" | "end" | "only";
type PgButtonScenario = "single" | "action-row";
type PgActionRowCount = "2" | "3" | "4";
const PG_BUTTON_SCENARIOS: {value: PgButtonScenario;label: string;labelEn: string;intent: string;intentEn: string;constraint: string;constraintEn: string;}[] = [
{ value: "single", label: "单按钮", labelEn: "Single", intent: "用于一个独立 Button 的类型、尺寸、图标、禁用和加载状态调试。", intentEn: "Use to tune one Button's variant, size, icon, disabled, and loading states.", constraint: "只表达 Button 自身 API；按钮之间的页面布局另选“按钮排列”。", constraintEn: "Only represents Button's own API; choose Action layout for page-level button layout." },
{ value: "action-row", label: "按钮排列", labelEn: "ActionRow", intent: "用于页面头部、列表工具栏、操作区的按钮排布组件：一个主操作带领，其余操作作为次级补充。", intentEn: "Use the ActionRow component for page headers, list toolbars, and action areas where one primary action leads and the rest are secondary.", constraint: "ActionRow 只管理独立按钮的排列关系，不改变 Button 视觉；只有需要视觉连续贴合成一个控件时，才使用 ButtonGroup。", constraintEn: "ActionRow only manages independent button layout and does not change Button visuals. Use ButtonGroup only when actions should visually attach as one continuous control." }];
const PG_ACTION_ROW_COUNTS: {value: PgActionRowCount;label: string;labelEn: string;intent: string;intentEn: string;constraint: string;constraintEn: string;}[] = [
{ value: "2", label: "2个", labelEn: "2 actions", intent: "用于最轻量的操作区：一个主操作加一个次级操作。", intentEn: "Use for the lightest action area: one primary action plus one secondary action.", constraint: "不需要更多入口；保持两个按钮直接可见。", constraintEn: "No more menu is needed; keep both actions visible." },
{ value: "3", label: "3个", labelEn: "3 actions", intent: "用于常规操作区：一个主操作加两个次级操作。", intentEn: "Use for a common action area: one primary action plus two secondary actions.", constraint: "三个操作仍可直接平铺；不要过早收进更多。", constraintEn: "Three actions can remain visible; do not collapse them too early." },
{ value: "4", label: "4个", labelEn: "4 actions", intent: "用于动作开始变多的操作区：主操作和两个次级操作可见，低频动作收进更多。", intentEn: "Use when actions start to grow: keep the primary and two secondary actions visible, then collapse low-frequency actions into more.", constraint: "第四个入口用 outline 图标按钮承载更多操作，不再继续横向堆按钮。", constraintEn: "Use an outline icon button as the fourth more entry instead of continuing to add visible buttons." }];
const PG_VARIANTS: {value: PgVariant;label: string;labelEn: string;intent: string;intentEn: string;constraint: string;constraintEn: string;}[] = [
{ value: "default", label: "实心", labelEn: "Solid", intent: "承载页面或区块内最主要的推进动作，视觉权重最高。", intentEn: "Use for the single most important forward action in a page or region.", constraint: "同一操作区只放一个 default，危险操作必须改用 destructive。", constraintEn: "Keep one default button per action area; destructive actions must use destructive." },
{ value: "secondary", label: "次级", labelEn: "Secondary", intent: "承载与主操作并列但优先级更低的辅助动作。", intentEn: "Use for supporting actions that sit beside the primary action.", constraint: "不要和 outline 在同一组里表达同一级别，避免层级重复。", constraintEn: "Avoid using secondary and outline for the same hierarchy in one group." },
{ value: "outline", label: "描边", labelEn: "Outline", intent: "承载需要边界感但不需要填充强调的轻量操作。", intentEn: "Use for lightweight actions that need a visible boundary without strong fill.", constraint: "适合工具栏和次级动作，不用于页面唯一主行动点。", constraintEn: "Good for toolbars and secondary actions, not the page's primary action." },
{ value: "ghost", label: "幽灵", labelEn: "Ghost", intent: "承载卡片、工具栏中的最低强调操作，默认不占视觉面积。", intentEn: "Use for the quietest actions inside cards or toolbars.", constraint: "hover 才出现底色，不用于提交、保存等强推进动作。", constraintEn: "Background appears on hover only; do not use for submit/save actions." },
{ value: "plain", label: "纯文字", labelEn: "Plain", intent: "承载表格操作列或行内文字操作，无底色、无边框。", intentEn: "Use for table action columns or inline text actions with no fill or border.", constraint: "需要颜色差异时用 tone，不在调用处手写颜色类覆盖。", constraintEn: "Use tone for color semantics; do not override colors ad hoc at call sites." },
{ value: "destructive", label: "危险", labelEn: "Danger", intent: "承载删除、移除权限等危险或不可逆操作。", intentEn: "Use for dangerous or irreversible actions such as delete or remove access.", constraint: "通常配合二次确认，不要用 default 或红色自定义类替代。", constraintEn: "Usually pair with confirmation; do not replace with default or custom red classes." }];

const PG_TONES: {value: PgTone;label: string;labelEn: string;title: string;titleEn: string;intent: string;intentEn: string;constraint: string;constraintEn: string;}[] = [
{ value: "default", label: "默认", labelEn: "Default", title: "中性文字操作", titleEn: "Neutral text action", intent: "用于普通纯文字按钮，不额外表达语义色。", intentEn: "Use for neutral plain text buttons without extra semantic color.", constraint: "仅在 variant=\"plain\" 时生效；其他类型忽略 tone。", constraintEn: "Only applies when variant=\"plain\"; other variants ignore tone." },
{ value: "primary", label: "主色", labelEn: "Primary", title: "品牌主色文字操作", titleEn: "Brand-primary text action", intent: "用于纯文字按钮中需要品牌主色强调的动作。", intentEn: "Use for plain text actions that need brand-primary emphasis.", constraint: "只通过 tone=\"primary\" 表达，不在调用处手写颜色类。", constraintEn: "Use tone=\"primary\" only; do not add ad hoc color classes." },
{ value: "info", label: "信息", labelEn: "Info", title: "蓝色信息 / 详情类文字操作，不等同链接", titleEn: "Blue info/detail text action, not a link", intent: "用于查看、详情等信息类纯文字操作。", intentEn: "Use for informational plain actions like view or details.", constraint: "它仍然是按钮语义，不等同链接；跳转用 Link。", constraintEn: "It remains button semantics, not a link; use Link for navigation." },
{ value: "danger", label: "危险", labelEn: "Danger", title: "删除等危险文字操作", titleEn: "Dangerous text action such as delete", intent: "用于删除、移除等危险纯文字操作。", intentEn: "Use for dangerous plain text actions such as delete or remove.", constraint: "仅表达文字色风险；高风险确认仍应配合弹窗。", constraintEn: "Only signals risk through text color; high-risk actions still need confirmation." }];

const PG_SIZES: {value: PgSize;label: string;intent: string;intentEn: string;constraint: string;constraintEn: string;}[] = [
{ value: "xs", label: "超小24", intent: "用于极紧凑区域里的低频操作。", intentEn: "Use for low-frequency actions in very compact areas.", constraint: "只传 size=\"xs\"；不要额外改内部 padding 或字号。", constraintEn: "Pass size=\"xs\" only; do not override inner padding or font size." },
{ value: "sm", label: "默认28", intent: "用于表格行、筛选栏等紧凑操作，也是按钮源码默认尺寸。", intentEn: "Use for compact actions in table rows or filter bars; this is Button's source default size.", constraint: "这是按钮源码的默认视觉档；不需要时可省略 size。", constraintEn: "This is the source default visual size; omit size when no override is needed." },
{ value: "md", label: "中32", intent: "用于常规表单、卡片和工具栏操作。", intentEn: "Use for normal forms, cards, and toolbar actions.", constraint: "只传 size=\"md\"；同一操作区尺寸保持一致。", constraintEn: "Pass size=\"md\" only; keep sizes consistent in one action area." },
{ value: "lg", label: "大36", intent: "用于页面头部或需要更大点击目标的主操作。", intentEn: "Use for page headers or primary actions that need larger targets.", constraint: "避免在密集表格、窄列或行内文本里使用。", constraintEn: "Avoid in dense tables, narrow columns, or inline text." }];

const PG_ICONS: {value: PgIcon;label: string;intent: string;intentEn: string;constraint: string;constraintEn: string;}[] = [
{ value: "none", label: "无", intent: "用于文案已经足够清楚的普通按钮。", intentEn: "Use when the label is clear enough on its own.", constraint: "不要为了装饰强行加图标。", constraintEn: "Do not add decorative icons without meaning." },
{ value: "start", label: "左侧", intent: "用于搜索、新建等图标能帮助识别动作的按钮。", intentEn: "Use when an icon helps identify actions like search or create.", constraint: "图标使用 data-icon=\"inline-start\"，尺寸交给按钮控制。", constraintEn: "Use data-icon=\"inline-start\" and let Button control icon sizing." },
{ value: "end", label: "右侧", intent: "用于下拉、继续等图标补充动作方向的按钮。", intentEn: "Use when the icon supplements direction, such as dropdown or continue.", constraint: "图标使用 data-icon=\"inline-end\"，不要手写间距类。", constraintEn: "Use data-icon=\"inline-end\" and do not hand-code spacing classes." },
{ value: "only", label: "仅图标", intent: "用于工具栏或表格操作列中的紧凑图标按钮。", intentEn: "Use for compact icon buttons in toolbars or table action columns.", constraint: "必须提供 aria-label；尺寸使用 icon-* 档。", constraintEn: "Must provide aria-label; use icon-* sizes." }];

const PG_ICON_SIZE: Record<PgSize, "icon-xs" | "icon-sm" | "icon-md" | "icon-lg"> = { xs: "icon-xs", sm: "icon-sm", md: "icon-md", lg: "icon-lg" };
type PgState = {variant: PgVariant | "all";tone: PgTone | "all";size: PgSize | "all";icon: PgIcon | "all";text: string;textEn: string;disabled: boolean | "all";loading: boolean | "all";};
type PgScenario = {id: string;zh: string;en: string;intent: string;intentEn: string;s: PgState;};
// 单个具体组合 → 一个 Button（icon-only 走 icon-* 尺寸）
function pgButton(variant: PgVariant, tone: PgTone, size: PgSize, icon: PgIcon, disabled: boolean, loading: boolean, label: string, key?: string) {
  const toneProp = variant === "plain" ? tone : "default";
  if (icon === "only")
  return <Button key={key} variant={variant} tone={toneProp} size={PG_ICON_SIZE[size]} disabled={disabled || loading} aria-label={label || "按钮"}>{loading ? <Spinner /> : <PackageIcon />}</Button>;
  return (
    <Button key={key} variant={variant} tone={toneProp} size={size} disabled={disabled || loading}>
      {loading ? <Spinner data-icon="inline-start" /> : icon === "start" ? <SearchIcon data-icon="inline-start" /> : null}
      {label}
      {!loading && icon === "end" ? <ChevronDownIcon data-icon="inline-end" /> : null}
    </Button>);

}
const PG_SCENARIOS: PgScenario[] = [
{ id: "primary", zh: "主操作", en: "Primary", intent: "页面或区域的主要行动点，一个操作区域建议只出现一个。", intentEn: "The primary action of a page or region; keep only one per area.", s: { variant: "default", tone: "default", size: "md", icon: "none", text: "保存", textEn: "Save", disabled: false, loading: false } },
{ id: "secondary", zh: "次操作", en: "Secondary", intent: "与主操作并列的次要操作，不抢焦点。", intentEn: "A secondary action beside the primary one, without stealing focus.", s: { variant: "secondary", tone: "default", size: "md", icon: "none", text: "取消", textEn: "Cancel", disabled: false, loading: false } },
{ id: "danger", zh: "危险操作", en: "Danger", intent: "删除等不可逆操作，用 destructive 变体提示风险。", intentEn: "Irreversible actions like delete; use the destructive variant to signal risk.", s: { variant: "destructive", tone: "default", size: "md", icon: "none", text: "删除项目", textEn: "Delete project", disabled: false, loading: false } },
{ id: "outline", zh: "描边操作", en: "Outline", intent: "中性次级操作，描边弱化存在感。", intentEn: "A neutral secondary action; the outline keeps it low-key.", s: { variant: "outline", tone: "default", size: "md", icon: "none", text: "导出", textEn: "Export", disabled: false, loading: false } },
{ id: "ghost", zh: "幽灵操作", en: "Ghost", intent: "最弱的操作，常用于工具栏 / 紧凑区域。", intentEn: "The lightest action, often used in toolbars or compact areas.", s: { variant: "ghost", tone: "default", size: "md", icon: "none", text: "查看详情", textEn: "View details", disabled: false, loading: false } },
{ id: "icon-text", zh: "带有图标", en: "With icon", intent: "图标 + 文案，用 data-icon 控制图标在前 / 后。", intentEn: "Icon + text; use data-icon to place the icon before or after.", s: { variant: "default", tone: "default", size: "md", icon: "start", text: "搜索", textEn: "Search", disabled: false, loading: false } },
{ id: "icon-only", zh: "纯图标", en: "Icon only", intent: "纯图标按钮必须配 aria-label，保证可访问性。", intentEn: "Icon-only buttons must carry an aria-label for accessibility.", s: { variant: "default", tone: "default", size: "md", icon: "only", text: "打开组件包", textEn: "Open package", disabled: false, loading: false } },
{ id: "plain-text", zh: "纯文字", en: "Plain text", intent: "表格操作列、行内弱化操作，无边框无底色，hover 只变文字色。", intentEn: "Inline or table-row actions with no border or fill; hover changes text color only.", s: { variant: "plain", tone: "info", size: "md", icon: "none", text: "详情", textEn: "Details", disabled: false, loading: false } },
{ id: "loading", zh: "加载状态", en: "Loading", intent: "提交中、保存中等需要阻止重复点击的场景。", intentEn: "Pending submit or save actions that should prevent repeated clicks.", s: { variant: "default", tone: "default", size: "md", icon: "none", text: "提交中", textEn: "Submitting", disabled: true, loading: true } }];

function genButtonCode(variant: PgVariant, tone: PgTone, size: PgSize, icon: PgIcon, disabled: boolean, loading: boolean, label: string): string {
  const attrs: string[] = [];
  if (variant !== "default") attrs.push(`variant="${variant}"`);
  if (variant === "plain" && tone !== "default") attrs.push(`tone="${tone}"`);
  if (icon === "only") attrs.push(`size="${PG_ICON_SIZE[size]}"`);else
  if (size !== "sm") attrs.push(`size="${size}"`);
  if (disabled || loading) attrs.push("disabled");
  if (icon === "only") attrs.push(`aria-label="${label}"`);
  const open = `<Button${attrs.length ? " " + attrs.join(" ") : ""}>`;
  let inner: string;
  if (loading) inner = `<Spinner data-icon="inline-start" />${label}`;else
  if (icon === "only") inner = `<PackageIcon />`;else if (icon === "start") inner = `<SearchIcon data-icon="inline-start" />${label}`;else
  if (icon === "end") inner = `${label}<ChevronDownIcon data-icon="inline-end" />`;else
  inner = label;
  return `${open}${inner}</Button>`;
}

function renderButtonActionRow(lang: Lang, count: PgActionRowCount) {
  const secondary = [
  <Button key="smart-form" variant="outline">{lang === "en" ? "Smart form" : "智能表单"}</Button>];

  if (count === "3" || count === "4") {
    secondary.push(<Button key="import" variant="outline">{lang === "en" ? "Import" : "导入"}</Button>);
  }

  return (
    <FxActionRow
      primary={
      <Button>
          <PlusIcon data-icon="inline-start" />
          {lang === "en" ? "Create" : "新建"}
        </Button>
      }
      secondary={secondary}
      more={count === "4" ?
      <Button variant="outline" size="icon-sm" aria-label={lang === "en" ? "More actions" : "更多操作"}>
          <MoreHorizontalIcon />
        </Button>
      : undefined} />);
}

function genButtonActionRowCode(lang: Lang, count: PgActionRowCount) {
  const secondaryLines = lang === "en" ?
  count === "2" ? `    <Button key="smart-form" variant="outline">Smart form</Button>,` : `    <Button key="smart-form" variant="outline">Smart form</Button>,
    <Button key="import" variant="outline">Import</Button>,` :
  count === "2" ? `    <Button key="smart-form" variant="outline">智能表单</Button>,` : `    <Button key="smart-form" variant="outline">智能表单</Button>,
    <Button key="import" variant="outline">导入</Button>,`;
  const moreBlock = lang === "en" ? `
  more={
    <Button variant="outline" size="icon-sm" aria-label="More actions">
      <MoreHorizontalIcon />
    </Button>
  }` : `
  more={
    <Button variant="outline" size="icon-sm" aria-label="更多操作">
      <MoreHorizontalIcon />
    </Button>
  }`;

  return lang === "en" ? `import { ActionRow } from "@/components/fx/page-actions"

<ActionRow
  primary={
    <Button>
      <PlusIcon data-icon="inline-start" />
      Create
    </Button>
  }
  secondary={[
${secondaryLines}
  ]}${count === "4" ? moreBlock : ""}
/>` : `import { ActionRow } from "@/components/fx/page-actions"

<ActionRow
  primary={
    <Button>
      <PlusIcon data-icon="inline-start" />
      新建
    </Button>
  }
  secondary={[
${secondaryLines}
  ]}${count === "4" ? moreBlock : ""}
/>`;
}

// Button 的 playground 配置（把原 Button 专用逻辑收成 config，行为不变）
const buttonPlaygroundConfig = {
  props: [
  { key: "scenario", zh: "模式", en: "Mode", propName: "usageMode", type: "segment" as const, options: PG_BUTTON_SCENARIOS },
  { key: "actionCount", zh: "数量", en: "Count", propName: "actionCount", type: "segment" as const, options: PG_ACTION_ROW_COUNTS, hiddenWhen: (v: Record<string, string>) => v.scenario !== "action-row" },
  { key: "text", zh: "内容", en: "Text", propName: "children", type: "text" as const, bilingual: true, disabledWhen: (v: Record<string, string>) => v.icon === "only", hiddenWhen: (v: Record<string, string>) => v.scenario === "action-row" },
  { key: "variant", zh: "类型", en: "Variant", propName: "variant", type: "segment" as const, options: PG_VARIANTS, hasAll: true, hiddenWhen: (v: Record<string, string>) => v.scenario === "action-row" },
  { key: "tone", zh: "语义色", en: "Tone", propName: "tone", type: "segment" as const, options: PG_TONES, hasAll: true, disabledWhen: (v: Record<string, string>) => v.variant !== "plain", hiddenWhen: (v: Record<string, string>) => v.scenario === "action-row" },
  { key: "size", zh: "尺寸", en: "Size", propName: "size", type: "segment" as const, options: PG_SIZES, hasAll: true, hiddenWhen: (v: Record<string, string>) => v.scenario === "action-row" },
  { key: "icon", zh: "图标位置", en: "Icon", propName: "iconLayout", type: "segment" as const, options: PG_ICONS, hasAll: true, hiddenWhen: (v: Record<string, string>) => v.scenario === "action-row" },
  { key: "loading", zh: "加载", en: "Loading", propName: "loading", type: "segment" as const, options: [{ value: "true", label: "是", intent: "用于提交中、保存中等需要阻止重复点击的状态。", intentEn: "Use for submit/save pending states that should prevent repeated clicks.", constraint: "源码没有 loading prop；用 disabled + Spinner 组合。", constraintEn: "Button has no loading prop; compose disabled + Spinner." }, { value: "false", label: "否", intent: "用于普通可交互按钮。", intentEn: "Use for normal interactive buttons.", constraint: "不渲染 Spinner，也不要传不存在的 loading 属性。", constraintEn: "Do not render Spinner or pass a non-existent loading prop." }], hiddenWhen: (v: Record<string, string>) => v.scenario === "action-row" },
  { key: "disabled", zh: "禁用", en: "Disabled", propName: "disabled", type: "segment" as const, options: [{ value: "true", label: "是", intent: "用于当前不可操作或条件未满足的按钮。", intentEn: "Use when the action is unavailable or prerequisites are unmet.", constraint: "直接使用 disabled；不要只靠样式伪装禁用。", constraintEn: "Use disabled directly; do not fake disabled with styling only." }, { value: "false", label: "否", intent: "用于当前可执行的操作。", intentEn: "Use when the action is currently available.", constraint: "保持真实可聚焦和可点击状态。", constraintEn: "Keep the button genuinely focusable and clickable." }], hasAll: true, disabledWhen: (v: Record<string, string>) => v.loading === "true", hiddenWhen: (v: Record<string, string>) => v.scenario === "action-row" }],

  initial: { scenario: "single", actionCount: "4", variant: "default", tone: "default", size: "sm", icon: "none", disabled: "false", loading: "false", text: PG_SCENARIOS[0].s.text, textEn: PG_SCENARIOS[0].s.textEn },
  guidanceKey: "scenario",
  onValueChange: (next: Record<string, string>, key: string, value: string) => {
    if (key === "loading" && value === "true") return { ...next, disabled: "true" };
    if (key === "variant" && value !== "plain") return { ...next, tone: "default" };
    return next;
  },
  renderOne: (c: Record<string, string>, lang: Lang) => c.scenario === "action-row" ? renderButtonActionRow(lang, c.actionCount as PgActionRowCount) : pgButton(c.variant as PgVariant, c.tone as PgTone, c.size as PgSize, c.icon as PgIcon, c.disabled === "true", c.loading === "true", (lang === "en" ? c.textEn : c.text) || (lang === "en" ? "Button" : "按钮")),
  genCode: (c: Record<string, string>, lang: Lang) => c.scenario === "action-row" ? genButtonActionRowCode(lang, c.actionCount as PgActionRowCount) : genButtonCode(c.variant as PgVariant, c.tone as PgTone, c.size as PgSize, c.icon as PgIcon, c.disabled === "true", c.loading === "true", (lang === "en" ? c.textEn : c.text) || (lang === "en" ? "Button" : "按钮"))
};

function ButtonPlayground({ lang }: {lang: Lang;}) {
  return <ComponentPlayground key="button-playground" config={buttonPlaygroundConfig} lang={lang} />;
}

function WebsiteStandardsPlayground({ lang }: {lang: Lang;}) {
  const playground = websiteStandardsManifest.componentPlayground;

  return (
    <div className="grid gap-3">
      {playground.componentKey === "button" ? <ButtonPlayground lang={lang} /> : null}
    </div>);

}

type ButtonGroupPattern = "actions" | "split" | "toolbar-icons";
type ButtonGroupOrientation = "horizontal" | "vertical";
type ButtonGroupButtonSize = "xs" | "sm" | "md" | "lg";
type ButtonGroupButtonVariant = "outline" | "secondary" | "default";

function renderButtonGroupPlayground(
pattern: ButtonGroupPattern,
orientation: ButtonGroupOrientation,
size: ButtonGroupButtonSize,
variant: ButtonGroupButtonVariant,
lang: Lang)
{
  const effectiveOrientation = pattern === "actions" ? orientation : "horizontal";
  const firstAction = lang === "en" ? "Copy" : "复制";
  const secondAction = lang === "en" ? "Share" : "分享";
  const thirdAction = lang === "en" ? "Archive" : "归档";
  const mainAction = lang === "en" ? "Save" : "保存";
  const moveUp = lang === "en" ? "Move up" : "上移";
  const center = lang === "en" ? "Center" : "居中";
  const moveDown = lang === "en" ? "Move down" : "下移";
  const iconSize = size === "xs" ? "icon-xs" : size === "sm" ? "icon-sm" : size === "md" ? "icon-md" : "icon-lg";

  if (pattern === "split") {
    return (
      <ButtonGroup orientation={effectiveOrientation}>
        <Button size={size} variant={variant}>{mainAction}</Button>
        <Button size={iconSize} variant={variant} aria-label={lang === "en" ? "More actions" : "更多操作"}>
          <ChevronDownIcon />
        </Button>
      </ButtonGroup>);

  }

  if (pattern === "toolbar-icons") {
    return (
      <ButtonGroup>
        <Button size={iconSize} variant={variant} aria-label="列表视图">
          <ListIcon />
        </Button>
        <Button size={iconSize} variant={variant} aria-label="看板视图">
          <LayoutGridIcon />
        </Button>
        <Button size={iconSize} variant={variant} aria-label="地图视图">
          <MapPinIcon />
        </Button>
        <Button size={iconSize} variant={variant} aria-label="分栏视图">
          <LayoutColumnsIcon />
        </Button>
      </ButtonGroup>);

  }

  return (
    <ButtonGroup orientation={effectiveOrientation}>
      <Button size={size} variant={variant}>{effectiveOrientation === "vertical" ? moveUp : firstAction}</Button>
      <Button size={size} variant={variant}>{effectiveOrientation === "vertical" ? center : secondAction}</Button>
      <Button size={size} variant={variant}>{effectiveOrientation === "vertical" ? moveDown : thirdAction}</Button>
    </ButtonGroup>);
}

function genButtonGroupPlaygroundCode(
pattern: ButtonGroupPattern,
orientation: ButtonGroupOrientation,
size: ButtonGroupButtonSize,
variant: ButtonGroupButtonVariant,
lang: Lang)
{
  const effectiveOrientation = pattern === "actions" ? orientation : "horizontal";
  const groupAttrs = effectiveOrientation === "horizontal" ? "" : ` orientation="${effectiveOrientation}"`;
  const buttonAttrs = [
  size !== "md" ? `size="${size}"` : null,
  variant !== "outline" ? `variant="${variant}"` : `variant="${variant}"`].filter(Boolean).join(" ");
  const buttonOpen = buttonAttrs ? `<Button ${buttonAttrs}>` : "<Button>";
  const firstAction = lang === "en" ? "Copy" : "复制";
  const secondAction = lang === "en" ? "Share" : "分享";
  const thirdAction = lang === "en" ? "Archive" : "归档";
  const mainAction = lang === "en" ? "Save" : "保存";
  const moveUp = lang === "en" ? "Move up" : "上移";
  const center = lang === "en" ? "Center" : "居中";
  const moveDown = lang === "en" ? "Move down" : "下移";
  const iconSize = size === "xs" ? "icon-xs" : size === "sm" ? "icon-sm" : size === "md" ? "icon-md" : "icon-lg";
  const iconAttrs = [`size="${iconSize}"`, `variant="${variant}"`].join(" ");

  if (pattern === "split") {
    return `<ButtonGroup${groupAttrs}>\n  ${buttonOpen}${mainAction}</Button>\n  <Button ${iconAttrs} aria-label="${lang === "en" ? "More actions" : "更多操作"}">\n    <ChevronDownIcon />\n  </Button>\n</ButtonGroup>`;
  }

  if (pattern === "toolbar-icons") {
    return `<ButtonGroup>\n  <Button ${iconAttrs} aria-label="${lang === "en" ? "List view" : "列表视图"}">\n    <ListIcon />\n  </Button>\n  <Button ${iconAttrs} aria-label="${lang === "en" ? "Grid view" : "看板视图"}">\n    <LayoutGridIcon />\n  </Button>\n  <Button ${iconAttrs} aria-label="${lang === "en" ? "Map view" : "地图视图"}">\n    <MapPinIcon />\n  </Button>\n  <Button ${iconAttrs} aria-label="${lang === "en" ? "Split view" : "分栏视图"}">\n    <LayoutColumnsIcon />\n  </Button>\n</ButtonGroup>`;
  }

  return `<ButtonGroup${groupAttrs}>\n  ${buttonOpen}${effectiveOrientation === "vertical" ? moveUp : firstAction}</Button>\n  ${buttonOpen}${effectiveOrientation === "vertical" ? center : secondAction}</Button>\n  ${buttonOpen}${effectiveOrientation === "vertical" ? moveDown : thirdAction}</Button>\n</ButtonGroup>`;
}

const buttonGroupPlaygroundConfig = {
  props: componentPlaygroundPropsFromManifest(componentPlaygroundsManifest.components.buttonGroup),
  initial: componentPlaygroundsManifest.components.buttonGroup.initial,
  guidanceKey: componentPlaygroundsManifest.components.buttonGroup.guidanceKey,
  onValueChange: (next: Record<string, string>, key: string, value: string) => {
    if (key === "pattern" && value !== "actions") {
      const variant = value === "toolbar-icons" && next.variant === "default" ? "outline" : next.variant
      return { ...next, orientation: "horizontal", variant }
    }
    return next
  },
  renderOne: (c: Record<string, string>, lang: Lang) => renderButtonGroupPlayground(c.pattern as ButtonGroupPattern, c.orientation as ButtonGroupOrientation, c.size as ButtonGroupButtonSize, c.variant as ButtonGroupButtonVariant, lang),
  genCode: (c: Record<string, string>, lang: Lang) => genButtonGroupPlaygroundCode(c.pattern as ButtonGroupPattern, c.orientation as ButtonGroupOrientation, c.size as ButtonGroupButtonSize, c.variant as ButtonGroupButtonVariant, lang)
};

function ButtonPage({ actions, lang }: {actions: React.ReactNode;lang: Lang;}) {
  return (
    <div className={docsSpacing.pageStack}>
      <section id="button" className="flex flex-col gap-2">
        <PageLead
          crumb={lang === "en" ? "Components / Button" : "组件 / 按钮"}
          title={lang === "en" ? "Button" : "按钮"}
          lead={lang === "en" ? "Trigger immediate actions such as submit, save, create, or delete." : "用于触发提交、保存、新建、删除等即时操作。"}
          actions={actions} />
        
      </section>

      <section id="playground" className={docsSpacing.sectionStack}>
        <SectionLead
          title={lang === "en" ? "Playground" : "调试台"}
          description={lang === "en" ? "Pick a usage mode or tweak props live, then copy the generated code." : "选模式或实时调属性，预览随之变化，写法可一键复制。"}
        />
        <ButtonPlayground lang={lang} />
      </section>

      <section id="usage" className={docsSpacing.sectionStack}>
        <SectionLead title={
        lang === "en" ? "Usage" : "使用方式"} description={

        lang === "en" ?
        "Copy the import; JSX usage is in the recommended code panel in Playground above." :
        "复制 import 即可；具体 JSX 写法见上方「调试台」右侧的推荐写法。"} />

        
        <DocSurfaceCard elevated>
          <CardContent className="px-5">
            <CopyCodeBlock code={buttonImportCode} label="Import" lang={lang} />
          </CardContent>
        </DocSurfaceCard>
      </section>

      <section id="props" className={docsSpacing.sectionStack}>
        <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "API Props" : "API 属性"}</h2>
        <DocSurfaceTableCard elevated>
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">{lang === "en" ? "Prop" : "属性"}</TableHead>
                <TableHead>{lang === "en" ? "Type" : "类型"}</TableHead>
                <TableHead>{lang === "en" ? "Default" : "默认值"}</TableHead>
                <TableHead className="pr-4">{lang === "en" ? "Description" : "描述"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {propRows.map((row) =>
              <TableRow key={row.prop}>
                  <TableCell className="pl-4 font-medium">{row.prop}</TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.type}</code>
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.defaultValue}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{lang === "en" ? row.descEn : row.desc}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DocSurfaceTableCard>
      </section>

      <section id="semantic-dom" className={docsSpacing.sectionStack}>
        <SectionLead title={
        lang === "en" ? "Semantic DOM" : "语义 DOM"} description={

        lang === "en" ?
        "Button source comes from shadcn/ui and remains open-code. This section records the semantic parts AI and engineers should understand." :
        "Button 源码来自 shadcn/ui，保持 open-code。这里记录 AI 和工程师应该理解的语义部位。"} />

        
        <DocSurfaceTableCard elevated>
          <Table className="min-w-[560px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">{lang === "en" ? "Part" : "部位"}</TableHead>
                <TableHead className="pr-4">{lang === "en" ? "Description" : "说明"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {semanticDomRows.map((row) =>
              <TableRow key={row.part}>
                  <TableCell className="pl-4 font-medium">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.part}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{lang === "en" ? row.descEn : row.desc}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DocSurfaceTableCard>
      </section>

      <section id="do-dont" className={docsSpacing.sectionStack}>
        <SectionLead title={
        lang === "en" ? "Do / Don’t" : "正误示例"} description={

        lang === "en" ?
        "These examples capture the most common mistakes for engineers and AI-generated code." :
        "这些例子记录工程师和 AI 生成代码最容易犯的错误。"} />

        
        <DocDoDont lang={lang} rows={buttonDoDontRows} elevated />
      </section>
    </div>);

}

function getDisplayTitle(title: string, titleMeta?: string) {
  if (!titleMeta) return title;
  return title === titleMeta ? title : title.replace(new RegExp(`^${titleMeta.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s+`), "");
}

function PageLead({ crumb, title, titleMeta, lead, actions }: {crumb: string;title: string;titleMeta?: string;lead: React.ReactNode;actions: React.ReactNode;}) {
  const contextTitleMeta = useContext(PageTitleMetaContext);
  const resolvedTitleMeta = titleMeta ?? contextTitleMeta;
  return <FxPageLead crumb={crumb} title={getDisplayTitle(title, resolvedTitleMeta)} titleMeta={resolvedTitleMeta} lead={lead} actions={actions} />;
}

function TokensPage({ actions, lang }: {actions: React.ReactNode;lang: Lang;}) {
  return (
    <div className={docsSpacing.pageStack}>
      <section id="tokens" className="flex flex-col gap-2">
        <PageLead
          crumb={lang === "en" ? "Design Tokens / Overview" : "设计令牌 / 概览"}
          title={lang === "en" ? "Design Tokens" : "设计令牌"}
          lead={lang === "en" ?
          "Tokens are the visual source of truth for fx-ui — consumed by both engineers (real values and usage) and AI (generation constraints and component rules)." :
          "Tokens 是 fx-ui 的公司视觉真相，给工程师（真实值和用法）和 AI（生成约束、组件级规则）同时消费。"}
          actions={actions} />
        
      </section>

      <section id="tokens-architecture" className={docsSpacing.sectionStack}>
        <div className="flex flex-col gap-2">
          <Tag variant="secondary" className="w-fit">{lang === "en" ? "Token System" : "Token 系统"}</Tag>
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Token architecture" : "基础架构"}</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {tokenLayers.map((layer) =>
          <Card key={layer.title}>
              <CardHeader>
                <CardTitle className="text-base">{layer.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
                <p>{lang === "en" ? layer.descEn : layer.desc}</p>
                <code className="rounded-lg bg-muted px-3 py-2 text-xs text-foreground">{layer.example}</code>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <section className={docsSpacing.sectionStack}>
        <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Browse by Category" : "按分类浏览"}</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
          { label: "颜色", labelEn: "Colors", desc: "品牌色、色板、语义色", href: "#tokens-colors" },
          { label: "排版", labelEn: "Typography", desc: "字号、字重、字族", href: "#tokens-typography" },
          { label: "圆角", labelEn: "Radius", desc: "控件、卡片、浮层圆角", href: "#tokens-radius" },
          { label: "阴影", labelEn: "Shadow", desc: "L1/L2/L3 四档投影", href: "#tokens-shadow" },
          { label: "间距", labelEn: "Spacing", desc: "页面节奏与组件密度", href: "#tokens-spacing" },
          { label: "层级", labelEn: "Layer", desc: "z-index 约定", href: "#tokens-layer" },
          { label: "动效", labelEn: "Motion", desc: "时长、缓动、进出场", href: "#tokens-motion" }].
          map((item) =>
          <a key={item.href} href={item.href} className="flex flex-col gap-1 rounded-lg border border-border bg-card p-4 hover:border-primary/50 transition-colors">
              <div className="font-medium">{lang === "en" ? item.labelEn : item.label}</div>
              <div className="text-sm text-muted-foreground">{item.desc}</div>
            </a>
          )}
        </div>
      </section>
    </div>);

}

const PALETTE_STEPS = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"] as const;
const NEUTRAL_STEPS = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"] as const;

const PREVIEW_FORMULAS = [
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


function SeedPreview({ lang: _lang }: {lang: Lang;}) {
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
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
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
    </div>);

}

function computeSwatchInfo(bgEl: HTMLElement, stepNum: number): {ratio: string;hex: string;} {
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

function ColorSwatch({ varName, step, label, semanticTag, onCopy, className, darkTextMax = 7 }: {varName: string;step: string;label: string;semanticTag?: string;onCopy: (v: string) => void;className?: string;darkTextMax?: number;}) {
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

function ColorPaletteWithTabs({ lang }: {lang: Lang;}) {
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

      {/* 标题行 + 深浅 tab（说明独占整行，见下方）*/}
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Chromatic Palette" : "彩色色板"}</h2>
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
      <p className="mt-1 text-sm text-muted-foreground">
        {lang === "en" ?
        "13 chromatic families × 12 steps, derived from a seed in oklch. 01–08 toward white: L += (1−L)×[.93 .84 .72 .58 .43 .28 .14 .12], C ×= [.04 .10 .18 .30 .45 .62 .80 .94]. 09 = seed. 10–12 toward black: L ×= [.87 .72 .35], C ×= [.95 .82 .65]. Steps 01–07 dark text, 08–12 white. Click a swatch to copy its variable." :
        "13 个有色色系 × 12 阶（中性灰见下方中性色色板），由种子色在 oklch 空间推导。01–08 向白：L += (1−L)×[.93 .84 .72 .58 .43 .28 .14 .12]、C ×= [.04 .10 .18 .30 .45 .62 .80 .94]；09 = 种子色；10–12 向黑：L ×= [.87 .72 .35]、C ×= [.95 .82 .65]。01–07 深色字，08–12 白色字。点击色块复制变量名。"}
      </p>

      {/* 色板 */}
      <div className={["overflow-hidden rounded-xl border border-border transition-colors", darkBg ? "bg-zinc-900" : "bg-card"].join(" ")}>
        {/* 用途分组行 */}
        <div className={["flex items-center text-xs", darkBg ? "text-white/50" : "text-foreground/55"].join(" ")}>
          <div className={["w-24 shrink-0 self-stretch border-r", darkBg ? "border-white/10" : "border-border"].join(" ")} />
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
            i < arr.length - 1 ? darkBg ? "border-r border-white/10" : "border-r border-border" : ""].
            join(" ")}
            style={{ flex: g.cols }}>
            
              {g.label}
            </div>
          )}
        </div>
        {/* 阶编号行 */}
        <div className={["flex items-center border-b text-xs", darkBg ? "border-white/10" : "border-border"].join(" ")}>
          <div className={["w-24 shrink-0 self-stretch border-r", darkBg ? "border-white/10" : "border-border"].join(" ")} />
          {PALETTE_STEPS.map((s) =>
          <div key={s} className={[
          "flex-1 flex items-center justify-center py-1.5",
          darkBg ? "text-white/35" : "text-muted-foreground",
          ["03", "06", "09", "11"].includes(s) ? darkBg ? "border-l border-white/20" : "border-l border-border" : ""].
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
            
            <div className={["w-24 shrink-0 flex flex-col justify-center px-3 py-2 border-r", darkBg ? "border-white/10" : "border-border", seed.prefix === customPrefix ? darkBg ? "bg-white/5" : "bg-primary/5" : ""].join(" ")}>
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

      {/* 中性色色板 */}
      <div className="mt-10">
        <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Neutral Palette" : "中性色色板"}</h2>
        <p className="mt-1 mb-4 text-sm text-muted-foreground">
          {lang === "en" ?
          "The single neutral gray axis — 20 steps via color-mix(white, neutral-dark N%), N = [0 2 5 9 14 19 25 31 37 43 49 55 61 67 73 79 85 90 95 100]. neutral-dark = oklch(L 0.12, C 0.008, brand hue) — faintly tinted, near-neutral. Source for page/card/text/border and neutral interactive surfaces (secondary / muted / ghost). Click to copy." :
          "全站唯一中性灰轴 — 20 阶，由 color-mix(white, neutral-dark N%) 推导，N = [0 2 5 9 14 19 25 31 37 43 49 55 61 67 73 79 85 90 95 100]。neutral-dark = oklch(L 0.12, C 0.008, 品牌色相)，极淡染色、肉眼近中性。页面底/卡片/文字/边框，以及中性交互面（secondary / muted / ghost）都取自这里。点击色块复制变量名。"}
        </p>
        <div className={["overflow-hidden rounded-xl border border-border transition-colors", darkBg ? "bg-zinc-900" : "bg-card"].join(" ")}>
          {/* 阶编号行 */}
          <div className={["flex items-center border-b text-xs", darkBg ? "border-white/10" : "border-border"].join(" ")}>
            <div className={["w-24 shrink-0 self-stretch border-r", darkBg ? "border-white/10" : "border-border"].join(" ")} />
            {NEUTRAL_STEPS.map((s) =>
            <div key={s} className={["flex-1 flex items-center justify-center py-1.5", darkBg ? "text-white/35" : "text-muted-foreground"].join(" ")}>
                {s}
              </div>
            )}
          </div>
          {/* 色板行 */}
          <div className="flex items-stretch">
            <div className={["w-24 shrink-0 flex flex-col justify-center px-3 py-2 border-r", darkBg ? "border-white/10" : "border-border"].join(" ")}>
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
      </div>
    </div>);

}

function getTokenExample(name: string): React.ReactNode {
  const btn = (style: React.CSSProperties, label: string, textStyle?: React.CSSProperties) =>
  <span className="inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium" style={{ ...style }}>
      <span style={textStyle}>{label}</span>
    </span>;


  // 状态色统一示例：solid（实心白字）+ 浅色 默认/hover/active（浅底彩字）
  const statusMap: Record<string, {scale: string;label: string;}> = {
    destructive: { scale: "red", label: "删除" },
    success: { scale: "green", label: "成功" },
    warning: { scale: "amber", label: "警告" },
    info: { scale: "blue", label: "信息" }
  };
  const statusBase = name.replace(/-(light(-hover|-active)?|hover|active|disabled)$/, "");
  if (statusMap[statusBase]) {
    const { scale, label } = statusMap[statusBase];
    if (!name.includes("-light")) {
      // 实心组：默认09 / hover08 / active10 / disabled05，白字
      const step = name.endsWith("-hover") ? "08" : name.endsWith("-active") ? "10" : name.endsWith("-disabled") ? "05" : "09";
      return btn({ backgroundColor: `var(--fx-${scale}-${step})`, color: "var(--fx-neutrals-01)" }, label);
    }
    // 浅色组：默认01 / hover02 / active03，浅底彩字
    const step = name.endsWith("-active") ? "03" : name.endsWith("-hover") ? "02" : "01";
    return btn(
      { backgroundColor: `var(--fx-${scale}-${step})`, color: `var(--fx-${scale}-09)`, border: `1px solid var(--fx-${scale}-03)` },
      label
    );
  }

  switch (name) {
    case "primary":return btn({ backgroundColor: "var(--fx-brand-09)", color: "#fff" }, "主按钮");
    case "primary-hover":return btn({ backgroundColor: "var(--fx-primary-hover)", color: "#fff" }, "悬浮");
    case "primary-active":return btn({ backgroundColor: "var(--fx-primary-active)", color: "#fff" }, "按下");
    case "primary-disabled":return btn({ backgroundColor: "var(--fx-primary-disabled)", color: "#fff" }, "禁用");
    case "primary-light":return btn({ backgroundColor: "var(--fx-primary-light)", color: "var(--fx-brand-09)", border: "1px solid var(--fx-primary-light-hover)" }, "标签");
    case "primary-light-hover":return btn({ backgroundColor: "var(--fx-primary-light-hover)", color: "var(--fx-brand-09)", border: "1px solid var(--fx-primary-light-hover)" }, "悬浮");
    case "primary-light-active":return btn({ backgroundColor: "var(--fx-primary-light-active)", color: "var(--fx-brand-09)", border: "1px solid var(--fx-primary-light-active)" }, "按下");
    case "ring":return <span className="inline-flex items-center rounded border-2 px-2 py-0.5 text-xs" style={{ borderColor: "oklch(from var(--fx-brand-09) l c h / 0.4)" }}>焦点</span>;
    case "foreground":return <span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: "var(--fx-neutrals-20)" }}>主文字 Aa <StarIcon className="size-3.5" /></span>;
    case "foreground-secondary":return <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: "var(--fx-neutrals-15)" }}>次要文字 Aa <StarIcon className="size-3.5" /></span>;
    case "muted-foreground":return <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: "var(--fx-neutrals-11)" }}>弱信息 Aa <StarIcon className="size-3.5" /></span>;
    case "foreground-disabled":return <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: "var(--fx-neutrals-07)" }}>占位/禁用 Aa <StarIcon className="size-3.5" /></span>;
    case "primary-foreground":return (
        <span className="inline-flex items-center gap-1.5 rounded px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: "var(--fx-brand-09)", color: "var(--fx-neutrals-01)" }}>
        按钮文字 <StarIcon className="size-3.5" />
      </span>);

    case "text-brand":return <span className="text-xs font-medium" style={{ color: "var(--fx-brand-09)" }}>品牌强调 Aa</span>;
    case "text-brand-hover":return <span className="text-xs font-medium" style={{ color: "var(--fx-brand-08)" }}>品牌强调 Aa</span>;
    case "text-brand-active":return <span className="text-xs font-medium" style={{ color: "var(--fx-brand-10)" }}>品牌强调 Aa</span>;
    case "link":return <a className="text-xs underline underline-offset-4" style={{ color: "var(--fx-blue-09)" }}>查看详情</a>;
    case "link-hover":return <a className="text-xs underline underline-offset-4" style={{ color: "var(--fx-blue-08)" }}>查看详情</a>;
    case "link-active":return <a className="text-xs underline underline-offset-4" style={{ color: "var(--fx-blue-10)" }}>查看详情</a>;
    case "icon":return <StarIcon className="size-4" style={{ color: "var(--fx-neutrals-20)" }} />;
    case "icon-muted":return <StarIcon className="size-4" style={{ color: "var(--fx-neutrals-11)" }} />;
    case "background":return <span className="inline-flex h-5 w-12 rounded border border-border" style={{ backgroundColor: "var(--fx-neutrals-02)" }} />;
    case "card":return <span className="inline-flex h-5 w-12 rounded border border-border shadow-sm" style={{ backgroundColor: "var(--fx-neutrals-01)" }} />;
    case "muted":return <span className="inline-flex h-5 w-12 rounded" style={{ backgroundColor: "var(--fx-neutrals-03)" }} />;
    case "accent":return <span className="inline-flex h-5 w-12 rounded" style={{ backgroundColor: "var(--fx-orange-01)" }} />;
    case "secondary":return btn({ backgroundColor: "var(--fx-neutrals-03)", color: "var(--fx-neutrals-20)" }, "次级按钮");
    case "border-subtle":return <span className="inline-flex h-5 w-12 items-center justify-center"><span className="w-full border-t" style={{ borderColor: "var(--fx-neutrals-04)" }} /></span>;
    case "border":return <span className="inline-flex h-5 w-12 items-center justify-center"><span className="w-full border-t" style={{ borderColor: "var(--fx-neutrals-05)" }} /></span>;
    case "border-strong":return <span className="inline-flex h-5 w-12 items-center justify-center"><span className="w-full border-t-2" style={{ borderColor: "var(--fx-neutrals-08)" }} /></span>;
    case "input":return <span className="inline-flex h-5 w-16 items-center rounded border px-1.5 text-xs text-muted-foreground" style={{ borderColor: "var(--fx-neutrals-07)" }}>输入框</span>;
    default:return <span className="text-muted-foreground/30">—</span>;
  }
}

function TokensColorsPage({ actions, lang }: {actions: React.ReactNode;lang: Lang;}) {
  return (
    <div className={docsSpacing.pageStack}>
      <section id="tokens-colors" className="flex flex-col gap-2">
        <PageLead
          crumb={lang === "en" ? "Design Tokens / Colors" : "设计令牌 / 颜色"}
          title={lang === "en" ? "Colors" : "颜色"}
          lead={lang === "en" ? "Brand seed, 12-step palettes, the neutral gray axis, and semantic colors — the single source of truth for all color." : "品牌种子色、12 阶色板、中性灰轴与语义色——全站颜色的唯一真相源。"}
          actions={actions} />
        
      </section>

      <section id="tokens-colors-seeds" className={docsSpacing.sectionStack}>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Brand Color" : "主题色"}</h2>
          <p className="text-sm text-muted-foreground">
            {lang === "en" ?
            "Input any color to preview its 12-step palette. Default is --fx-brand. The derivation uses CSS oklch relative color syntax." :
            "输入任意色值，实时预览 12 阶推导色板。默认为 --fx-brand，推导算法使用 CSS oklch 相对颜色语法。"}
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
            {lang === "en" ?
            "Each semantic token is derived from a primitive (--fx-*) variable. The source shows which palette step it maps to." :
            "每个语义 token 都从对应的 primitive（--fx-*）推导而来。「来源」列显示它映射的色系阶值。"}
          </p>
        </div>
        {semanticTokenGroups.map((group) =>
        <div key={group.role} className="flex flex-col gap-3">
            <div className="flex flex-col gap-0.5">
              <h3 className="text-base font-semibold">{lang === "en" ? group.labelEn : group.label}</h3>
              <p className="text-sm text-muted-foreground">{lang === "en" ? group.descEn : group.desc}</p>
            </div>
            <div className="max-w-full overflow-x-auto rounded-lg border border-border-container bg-card">
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
                  {group.tokens.map((row) =>
                <TableRow key={row.name}>
                      <TableCell className="pl-4 font-medium">
                        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.name}</code>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="size-4 rounded-full border border-border" style={{ backgroundColor: `var(${row.sourceToken})` }} />
                          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{`var(${row.sourceToken})`}</code>
                        </div>
                      </TableCell>
                      <TableCell>
                        {row.tailwind ? <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.tailwind}</code> : <span className="text-muted-foreground/30">—</span>}
                      </TableCell>
                      <TableCell>{getTokenExample(row.name)}</TableCell>
                      <TableCell className="pr-4 text-foreground">{lang === "en" ? row.usageEn : row.usage}</TableCell>
                    </TableRow>
                )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </section>
    </div>);

}

function GridPage({ actions, lang }: {actions: React.ReactNode;lang: Lang;}) {
  return (
    <div className={docsSpacing.pageStack}>
      <section id="grid-system" className="flex flex-col gap-2">
        <PageLead
          crumb={lang === "en" ? "Foundations / Grid" : "基础 / 栅格"}
          title={lang === "en" ? "Grid" : "栅格"}
          lead={lang === "en" ? "24-column grid with 16px gutter — split content by /24, freely combined. Aligns with Semi / Ant grid conventions." : "24 列栅格、16px 列间距——内容按 /24 自由组合。对齐 Semi / Ant 栅格惯例。"}
          actions={actions} />
      </section>

      <section className={docsSpacing.sectionStack}>
        <div>
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Grid 栅格系统" : "栅格系统"}</h2>
          <p className="mt-2 text-base text-muted-foreground">{lang === "en" ? "24 columns, column gap = 16px (gap-4). Span by /24 with col-span-[n]." : "24 列基准，列间距 = 16px（gap-4）。分栏用 col-span-[n]（按 24 计），可 1/24 自由组合。"}</p>
        </div>
        <div>
          <p className="mb-2 text-base font-medium">{lang === "en" ? "24 columns (16px gap)" : "24 列栅格（列间距 16px）"}</p>
          <div className="rounded-lg border border-border-container bg-card p-5">
            <div className="grid grid-cols-[repeat(24,minmax(0,1fr))] gap-1">
              {Array.from({ length: 24 }).map((_, i) =>
              <div key={i} className="flex h-9 items-center justify-center rounded bg-muted text-xs text-muted-foreground">{i + 1}</div>
              )}
            </div>
          </div>
        </div>

        {/* 等分栅格 */}
        <div>
          <p className="mb-2 text-base font-medium">{lang === "en" ? "Equal columns" : "等分栅格"}</p>
          <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-5">
            {[1, 2, 3, 4, 6].map((n) =>
            <div key={n} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
                {Array.from({ length: n }).map((_, i) =>
              <div key={i} className="flex h-9 items-center justify-center rounded bg-muted text-sm text-muted-foreground">{`1/${n}`}</div>
              )}
              </div>
            )}
          </div>
        </div>

        {/* 混合布局 */}
        <div>
          <p className="mb-2 text-base font-medium">{lang === "en" ? "Mixed (by /24)" : "混合布局（按 24 分）"}</p>
          <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-5">
            {[[6, 18], [8, 16], [6, 12, 6], [18, 6]].map((row, ri) =>
            <div key={ri} className="grid grid-cols-[repeat(24,minmax(0,1fr))] gap-4">
                {row.map((span, ci) =>
              <div key={ci} className="flex h-9 items-center justify-center rounded bg-muted text-sm text-muted-foreground" style={{ gridColumn: `span ${span} / span ${span}` }}>{span}/24</div>
              )}
              </div>
            )}
          </div>
        </div>

        {/* 对齐方式 */}
        <div>
          <p className="mb-2 text-base font-medium">{lang === "en" ? "Alignment" : "对齐方式"}</p>
          <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-5">
            {([
            { just: "justify-start", zh: "整体左对齐", en: "Left" },
            { just: "justify-center", zh: "居中", en: "Center" },
            { just: "justify-end", zh: "右对齐", en: "Right" },
            { just: "justify-between", zh: "左右齐飞（两端）", en: "Justify" }] as
            const).map((a) =>
            <div key={a.just} className="flex items-center gap-3 rounded bg-muted/40 p-2">
                <span className="w-28 shrink-0 text-sm text-muted-foreground">{lang === "en" ? a.en : a.zh}</span>
                <div className={`flex flex-1 ${a.just} gap-2`}>
                  {[0, 1, 2].map((i) => <div key={i} className="h-7 w-60 rounded bg-muted" />)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 偏移 / 容器 / 嵌套 / 进阶 */}
        <div className="rounded-lg border border-border bg-card p-5 text-base text-muted-foreground">
          <p><span className="font-medium text-foreground">{lang === "en" ? "Offset" : "偏移"}</span>：{lang === "en" ? "leave columns before content with " : "内容前留空用 "}<code className="rounded bg-muted px-1 text-sm">col-start-[n]</code></p>
          <p className="mt-1"><span className="font-medium text-foreground">{lang === "en" ? "Container" : "容器/版心"}</span>：{lang === "en" ? "max-width + page padding — " : "内容最大宽度 + 页面外边距 — "}<code className="rounded bg-muted px-1 text-sm">max-w-7xl</code> + <code className="rounded bg-muted px-1 text-sm">px-4 lg:px-8</code></p>
          <p className="mt-1"><span className="font-medium text-foreground">{lang === "en" ? "Nesting" : "嵌套"}</span>：{lang === "en" ? "a grid can nest another grid; child re-splits by /24." : "栅格内可再嵌栅格，子栅格按 1/24 重新划分。"}</p>
          <p className="mt-3 border-t border-border pt-3"><span className="font-medium text-foreground">{lang === "en" ? "Advanced (Semi/Ant)" : "进阶（对齐 Semi/Ant）"}</span>：{lang === "en" ? "gutter accepts [horizontal, vertical] and responsive {sm,md,lg…}; recommended gutter = 16+8n. Reorder via order; offset/push/pull for fine positioning." : "列间距 gutter 支持 [水平, 垂直] 与响应式对象 {sm,md,lg…}；推荐取值 16+8n。需要改顺序用 order；offset/push/pull 做精细位移。"}</p>
        </div>
      </section>

      <section id="grid-breakpoints" className={docsSpacing.sectionStack}>
        <div>
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Breakpoints 响应式断点" : "响应式断点"}</h2>
          <p className="mt-2 text-base text-muted-foreground">
            {lang === "en" ?
            "Tailwind is mobile-first: base styles apply at every width; a prefix like lg: means \"apply only when the viewport ≥ this width\"." :
            "Tailwind 是移动优先：不带前缀的样式对所有宽度生效；加前缀（如 lg:）表示\"屏幕宽度 ≥ 该值时才生效\"。"}
          </p>
        </div>
        <div className="max-w-full overflow-x-auto rounded-lg border border-border-container bg-card">
          <Table className="min-w-[520px]">
            <TableHeader><TableRow>
              <TableHead className="pl-4">{lang === "en" ? "Prefix" : "前缀"}</TableHead>
              <TableHead>{lang === "en" ? "Triggers at width ≥" : "宽度 ≥ 时生效"}</TableHead>
              <TableHead className="pr-4">{lang === "en" ? "Typical" : "典型设备"}</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {[["sm", "640px", "大手机/小平板"], ["md", "768px", "平板"], ["lg", "1024px", "笔记本（后台默认）"], ["xl", "1280px", "桌面"], ["2xl", "1536px", "大屏"]].map(([p, w, d]) =>
              <TableRow key={p}>
                  <TableCell className="pl-4"><code className="rounded bg-muted px-1.5 py-0.5 text-sm">{p}:</code></TableCell>
                  <TableCell className="text-base text-muted-foreground">{w}</TableCell>
                  <TableCell className="pr-4 text-base text-muted-foreground">{lang === "en" ? "" : d}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="rounded-lg border border-border-container bg-card p-5">
          <p className="mb-3 text-base text-muted-foreground">
            {lang === "en" ?
            <>Example: <code className="rounded bg-muted px-1 text-sm">grid-cols-1 lg:grid-cols-3</code> — 1 column below 1024px, 3 columns at ≥1024px.</> :
            <>例子：<code className="rounded bg-muted px-1 text-sm">grid-cols-1 lg:grid-cols-3</code> —— 窗口 &lt; 1024px 时一列，≥ 1024px 自动变三列。拖动窗口可看到它"断"。</>}
          </p>
          <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => <div key={i} className="flex h-12 items-center justify-center rounded bg-muted text-sm text-muted-foreground">{i + 1}</div>)}
          </div>
        </div>
      </section>
    </div>);

}

function NavMenuPage({ actions, lang }: {actions: React.ReactNode;lang: Lang;}) {
  const [selected, setSelected] = useState("home");
  const [open, setOpen] = useState<Record<string, boolean>>({ cust: true });
  const [pinned, setPinned] = useState(true);
  const [hovered, setHovered] = useState(false);
  const toggle = (id: string) => setOpen((o) => ({ ...o, [id]: !o[id] }));
  // 固定导航：pinned 固定展开；未固定时折叠成 48px 图标栏，hover 临时展开（flyout）
  const c = !pinned && !hovered;
  const custChildren = [
  { label: "客户", icon: <BuildingIcon /> },
  { label: "销售记录", icon: <ChartLineIcon /> },
  { label: "客户地址", icon: <MapPinIcon /> },
  { label: "客户财务信息", icon: <ReportMoneyIcon /> },
  { label: "联系人", icon: <UserIcon /> },
  { label: "商机2.0", icon: <TargetIcon /> },
  { label: "商机评审", icon: <SitemapIcon /> }];

  const demo =
  <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
    <NavMenu collapsed={c}>
      <NavMenuHeader title="CRM" viewName={lang === "en" ? "View" : "视图名称"} collapsed={c} />
      <NavMenuSearch placeholder={lang === "en" ? "Search" : "搜索"} onAdd={() => {}} collapsed={c} />
      <NavMenuList>
        <NavMenuItem icon={<HomeIcon />} label={lang === "en" ? "Home" : "首页"} active={selected === "home"} collapsed={c} onClick={() => setSelected("home")} />
        <NavMenuItem icon={<StarIcon />} label={lang === "en" ? "Recent" : "最近使用"} active={selected === "recent"} collapsed={c} onClick={() => setSelected("recent")} />
        <NavMenuItem icon={<BellIcon />} label="CRM提醒" active={selected === "remind"} collapsed={c} onClick={() => setSelected("remind")} />
        <NavMenuItem icon={<CheckCircleIcon />} label="CRM待办" active={selected === "todo"} collapsed={c} onClick={() => setSelected("todo")} />
        {/* 对象分组：展开=折叠分类标题（无图标）；收起=分类退化为短横线 + 对象图标平铺（CRM 厂商式） */}
        {c ?
        <>
            <NavMenuGroupLabel collapsed>{lang === "en" ? "Customers & deals" : "客户及商机管理"}</NavMenuGroupLabel>
            {custChildren.map((cc) =>
          <NavMenuItem key={cc.label} icon={cc.icon} label={cc.label} active={selected === cc.label} collapsed onClick={() => setSelected(cc.label)} />
          )}
          </> :

        <>
            <NavMenuItem expandable expanded={open.cust} label={lang === "en" ? "Customers & deals" : "客户及商机管理"} onClick={() => toggle("cust")} />
            {open.cust && custChildren.map((cc) =>
          <NavMenuItem key={cc.label} indent icon={cc.icon} label={cc.label} active={selected === cc.label} onClick={() => setSelected(cc.label)} />
          )}
          </>
        }
        <NavMenuItem icon={<ReportMoneyIcon />} label={lang === "en" ? "Orders & payments" : "订单及回款管理"} active={selected === "order"} collapsed={c} onClick={() => setSelected("order")} />
        <NavMenuItem icon={<DatabaseIcon />} label={lang === "en" ? "Dashboard" : "数据驾驶舱"} active={selected === "dash"} collapsed={c} onClick={() => setSelected("dash")} />
        <NavMenuItem icon={<UserIcon />} label={lang === "en" ? "People" : "人员"} active={selected === "people"} collapsed={c} onClick={() => setSelected("people")} />
      </NavMenuList>
      <NavMenuFooter collapsed={c} pinned={pinned} onToggle={() => setPinned(false)} onPin={() => setPinned(true)} />
    </NavMenu>
    </div>;

  // 无图标版：菜单项不带图标；收起态(48px)显示居中文案而非图标。折叠/固定交互与前台统一。
  const [niSel, setNiSel] = useState("首页");
  const [niPinned, setNiPinned] = useState(true);
  const [niHovered, setNiHovered] = useState(false);
  const nc = !niPinned && !niHovered;
  const niItems = ["首页", "最近使用", "CRM提醒", "CRM待办", "客户及商机管理", "订单及回款管理", "售前项目管理", "交付实施项目", "项目损失管理", "数据驾驶舱", "人员"];
  const noIconDemo =
  <div onMouseEnter={() => setNiHovered(true)} onMouseLeave={() => setNiHovered(false)}>
    <NavMenu collapsed={nc}>
      <NavMenuHeader title="CRM" viewName={lang === "en" ? "View" : "视图名称"} collapsed={nc} />
      <NavMenuSearch placeholder={lang === "en" ? "Search" : "搜索"} onAdd={() => {}} collapsed={nc} />
      <NavMenuList>
        {niItems.map((n) =>
        <NavMenuItem key={n} label={n} active={niSel === n} collapsed={nc} onClick={() => setNiSel(n)} />
        )}
      </NavMenuList>
      <NavMenuFooter collapsed={nc} pinned={niPinned} onToggle={() => setNiPinned(false)} onPin={() => setNiPinned(true)} />
    </NavMenu>
    </div>;

  // 一级导航 + 二级菜单组合（左 64px 应用栏紧贴右侧菜单面板）。
  const [railApp, setRailApp] = useState("crm");
  const railApps = [
  { id: "qx", icon: <MessageCircleIcon />, activeIcon: <MessageCircleFilledIcon />, label: "企信" },
  { id: "crm", icon: <ChartPieIcon />, activeIcon: <ChartPieFilledIcon />, label: "CRM" },
  { id: "work", icon: <BriefcaseIcon />, activeIcon: <BriefcaseFilledIcon />, label: "工作" },
  { id: "todo", icon: <CheckCircleIcon />, activeIcon: <CheckCircleFilledIcon />, label: "待办" },
  { id: "cal", icon: <CalendarIcon />, activeIcon: <CalendarFilledIcon />, label: "日程" },
  { id: "train", icon: <SchoolIcon />, activeIcon: <SchoolFilledIcon />, label: "培训助手" },
  { id: "agent", icon: <HeadsetIcon />, activeIcon: <HeadsetFilledIcon />, label: "代理通" },
  { id: "more", icon: <LayoutGridIcon />, activeIcon: <LayoutGridFilledIcon />, label: "更多" }];

  const comboDemo =
  <div className="flex h-full">
      <NavRail footer={<NavRailItem boxed icon={<SettingsIcon />} aria-label="设置" />}>
        {railApps.map((a) =>
      <NavRailItem key={a.id} icon={a.icon} activeIcon={a.activeIcon} label={a.label} active={railApp === a.id} onClick={() => setRailApp(a.id)} />
      )}
      </NavRail>
      {demo}
    </div>;

  const railDemo =
  <NavRail footer={<NavRailItem boxed icon={<SettingsIcon />} aria-label="设置" />}>
      {railApps.map((a) =>
    <NavRailItem key={a.id} icon={a.icon} activeIcon={a.activeIcon} label={a.label} active={railApp === a.id} onClick={() => setRailApp(a.id)} />
    )}
    </NavRail>;

  // 后台菜单：顶部仅搜索；不可选灰色分组标题（折叠成短横线）；可折叠成 48px 图标栏、hover 悬浮展开、底部锁固定。
  // 支持一级展开（分组下的功能项）与二级展开（expandable 项内联展开子项）。
  const [backPinned, setBackPinned] = useState(true);
  const [backHovered, setBackHovered] = useState(false);
  const [backOpen, setBackOpen] = useState<Record<string, boolean>>({ "b-ent": true });
  const bc = !backPinned && !backHovered;
  const backToggle = (id: string) => setBackOpen((o) => ({ ...o, [id]: !o[id] }));
  const backDemo =
  <div onMouseEnter={() => setBackHovered(true)} onMouseLeave={() => setBackHovered(false)}>
    <NavMenu collapsed={bc}>
      <NavMenuSearch placeholder="搜索" collapsed={bc} />
      <NavMenuList>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <NavMenuGroupLabel collapsed={bc}>系统管理</NavMenuGroupLabel>
            <div className="flex flex-col gap-2">
              <NavMenuItem icon={<HomeIcon />} label="管理首页" collapsed={bc} active={selected === "b-home"} onClick={() => setSelected("b-home")} />
              <NavMenuItem icon={<BuildingIcon />} label="企业设置" expandable expanded={backOpen["b-ent"]} collapsed={bc} onClick={() => backToggle("b-ent")} />
              {!bc && backOpen["b-ent"] &&
              <>
                  {["许可信息", "企业信息设置", "多组织设置", "员工功能设置", "工作时间", "假期", "手机号隐私设置", "个性化推荐设置", "域名管理", "强制通知设置"].map((l) =>
                <NavMenuItem key={l} indent label={l} active={selected === l} onClick={() => setSelected(l)} />
                )}
                  {/* 二级展开：企业安全设置 → 子项再缩进一级 */}
                  <NavMenuItem indent label="企业安全设置" expandable expanded={backOpen["b-ent-sec"]} onClick={() => backToggle("b-ent-sec")} />
                  {backOpen["b-ent-sec"] && ["分管小组", "账号安全设置", "通讯录安全设置", "设备绑定", "单点登录"].map((l) =>
                <NavMenuItem key={l} indent={2} label={l} active={selected === l} onClick={() => setSelected(l)} />
                )}
                </>
              }
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <NavMenuItem icon={<SitemapIcon />} label="组织架构管理" arrow collapsed={bc} active={selected === "b-org"} onClick={() => setSelected("b-org")} />
            <NavMenuItem icon={<UserIcon />} label="角色权限管理" arrow collapsed={bc} active={selected === "b-role"} onClick={() => setSelected("b-role")} />
          </div>

          <div className="flex flex-col gap-1">
            <NavMenuGroupLabel collapsed={bc}>CRM平台管理</NavMenuGroupLabel>
            <div className="flex flex-col gap-2">
              <NavMenuItem icon={<BoxIcon />} label="对象管理" expandable expanded={backOpen["b-obj"]} collapsed={bc} onClick={() => backToggle("b-obj")} />
              {!bc && backOpen["b-obj"] &&
              <>
                  <NavMenuItem indent label="预设对象" active={selected === "b-obj-1"} onClick={() => setSelected("b-obj-1")} />
                  <NavMenuItem indent label="自定义对象" active={selected === "b-obj-2"} onClick={() => setSelected("b-obj-2")} />
                </>
              }
              <NavMenuItem icon={<SitemapIcon />} label="流程管理" arrow collapsed={bc} active={selected === "b-flow"} onClick={() => setSelected("b-flow")} />
              <NavMenuItem icon={<ReportMoneyIcon />} label="数据权限管理" arrow collapsed={bc} active={selected === "b-data"} onClick={() => setSelected("b-data")} />
            </div>
          </div>
        </div>
      </NavMenuList>
      <NavMenuFooter collapsed={bc} pinned={backPinned} onToggle={() => setBackPinned(false)} onPin={() => setBackPinned(true)} />
    </NavMenu>
    </div>;

  const box = (node: React.ReactNode) => <div className="flex h-[420px] overflow-auto rounded-lg bg-muted/40 p-3">{node}</div>;
  const navMenuScenarioRows = [
  { key: "rail", title: lang === "en" ? "App rail" : "一级导航", preview: box(railDemo), intent: "在多应用/多模块间切换的最外层入口（企信、CRM、工作…）。", constraint: "选中=白底左圆角 + 主色加粗 + 面型 activeIcon；底部 boxed 页面入口。", code: `<NavRail footer={<NavRailItem boxed icon={<SettingsIcon />} />}>\n  <NavRailItem icon={<FolderIcon />} activeIcon={<FolderFilledIcon />} label="CRM" active />\n</NavRail>` },
  { key: "second", title: lang === "en" ? "Second-level menu" : "二级菜单", preview: box(demo), intent: "进入某应用后的页面级导航，承载该应用的功能树。", constraint: "默认固定展开；点收起后变 48px 图标栏，hover 临时展开（flyout），底部锁=固定导航。选中用 active、分组用 expandable；图标走 @/lib/icons。", code: `<NavMenu collapsed={collapsed}>\n  <NavMenuHeader title="CRM" viewName="视图名称" collapsed={collapsed} />\n  <NavMenuSearch onAdd={...} collapsed={collapsed} />\n  <NavMenuList>…</NavMenuList>\n  <NavMenuFooter collapsed={collapsed} onToggle={...} />\n</NavMenu>` },
  { key: "no-icon", title: lang === "en" ? "No-icon variant" : "无图标版", preview: box(noIconDemo), intent: "功能项没有合适图标、或想更克制时，用纯文字导航（图标可配置：传不传 icon）。", constraint: "菜单项不传 icon 即无图标；同样可折叠，收起时取首部短标识（英文整段≤3 / 中文前 2 字）居中。", code: `<NavMenuItem label="首页" active />  // 不传 icon 即无图标版` },
  { key: "back", title: lang === "en" ? "Back-office menu" : "后台菜单", preview: box(backDemo), intent: "管理后台/设置中心的导航：纯搜索 + 分节标题 + 跳转入口。", constraint: "顶层项带图标、二级子项纯文字（DEC-015：功能型子项不带图标）；顶部仅 NavMenuSearch；分节用 NavMenuGroupLabel；arrow 项「>」进下级页面、expandable 项内联展开二级；收起为 48px 图标栏 + hover 悬浮展开、底部锁固定（与二级菜单同一套交互）。", code: `<NavMenu>\n  <NavMenuSearch placeholder="搜索" />\n  <NavMenuList>\n    <NavMenuGroupLabel>系统管理</NavMenuGroupLabel>\n    <NavMenuItem icon={<BuildingIcon />} label="企业设置" arrow />\n  </NavMenuList>\n  <NavMenuFooter />\n</NavMenu>` }];

  const importCode = `import {\n  NavRail, NavRailItem,\n  NavMenu, NavMenuHeader, NavMenuSearch, NavMenuList, NavMenuItem, NavMenuFooter,\n} from "@/components/fx/nav-menu"`;
  const usageCode = `<NavMenu>\n  <NavMenuHeader title="CRM" viewName="视图名称" />\n  <NavMenuSearch placeholder="搜索" onAdd={() => {}} />\n  <NavMenuList>\n    <NavMenuItem icon={<HomeIcon />} label="首页" active />\n    <NavMenuItem expandable expanded label="客户及商机管理" />\n    <NavMenuItem indent icon={<BuildingIcon />} label="客户" />\n  </NavMenuList>\n  <NavMenuFooter onToggle={...} />\n</NavMenu>`;
  return (
    <div className={docsSpacing.pageStack}>
      <section id="nav-menu" className="flex flex-col gap-2">
        <PageLead
          crumb={lang === "en" ? "Components / Nav Menu" : "组件 / 导航菜单"}
          title={lang === "en" ? "Nav Menu 导航菜单" : "导航菜单"}
          lead={lang === "en" ? "Company two-tier navigation: 64px app rail + single-panel menu (200/48px). 1:1 with the design spec, fx-ui tokens." : "公司双层导航：64px 一级应用栏 + 单面板二级菜单（展开 200 / 收起 48px）。1:1 还原设计稿，token 用 fx-ui。"}
          actions={actions} />
        
      </section>

      <section id="nav-menu-playground" className={docsSpacing.sectionStack}>
        <SectionLead
          title={lang === "en" ? "Playground" : "调试台"}
          description={lang === "en" ? "Switch between the existing Nav Menu scenarios and copy the matching composition." : "切换现有导航菜单场景，复制对应真实组合写法。"}
        />
        <StandardScenarioPlayground
          slug="nav-menu"
          examples={navMenuScenarioRows.map((row) => ({
            id: row.key,
            title: row.title,
            intent: row.intent,
            rule: row.constraint,
            code: row.code
          }))}
          renderScenarioPreview={(id) => navMenuScenarioRows.find((row) => row.key === id)?.preview ?? navMenuScenarioRows[0].preview}
          importCode={importCode}
          lang={lang}
        />
      </section>

      <section id="nav-menu-overview" className={docsSpacing.sectionStack}>
        <SectionLead title={
        lang === "en" ? "Overview" : "组件总览"} description={
        lang === "en" ? "App rail + second-level menu working together; click apps / items to switch, the footer arrow collapses the panel." : "一级应用栏 + 二级菜单的组合形态；点应用 / 菜单项切换，底部箭头收起面板。"} />
        
        <DocSurfaceCard elevated className="w-fit">
          <CardContent className="flex h-[560px] bg-muted/40 p-5">{comboDemo}</CardContent>
        </DocSurfaceCard>
      </section>

      <section id="nav-menu-preview" className={docsSpacing.sectionStack}>
        <SectionLead title={
        lang === "en" ? "Scenario examples" : "场景示例"} description={
        lang === "en" ? "Forms and states; all from the same building blocks." : "各形态与状态；均由同一套零件组合。"} />
        
        <ScenarioTable lang={lang} rows={navMenuScenarioRows} elevated />
      </section>

      <section id="nav-menu-usage" className={docsSpacing.sectionStack}>
        <SectionLead title={
        lang === "en" ? "Usage" : "使用方式"} description={
        lang === "en" ? "Import the parts and compose; rail and menu are independent." : "按需导入零件组合；一级栏与二级菜单相互独立。"} />
        
        <DocSurfaceCard elevated>
          <CardContent className="flex flex-col gap-4 p-5">
          <CopyCodeBlock code={importCode} label="Import" lang={lang} />
          <CopyCodeBlock code={usageCode} label="Usage" lang={lang} />
          </CardContent>
        </DocSurfaceCard>
      </section>

      <section id="nav-menu-props" className={docsSpacing.sectionStack}>
        <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "API Props" : "API 属性"}</h2>
        <DocSurfaceTableCard elevated>
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">{lang === "en" ? "Prop" : "属性"}</TableHead>
                <TableHead>{lang === "en" ? "Type" : "类型"}</TableHead>
                <TableHead>{lang === "en" ? "Default" : "默认值"}</TableHead>
                <TableHead className="pr-4">{lang === "en" ? "Description" : "描述"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {navMenuPropRows.map((row) =>
              <TableRow key={row.prop}>
                  <TableCell className="pl-4 font-medium">{row.prop}</TableCell>
                  <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.type}</code></TableCell>
                  <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.defaultValue}</code></TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{lang === "en" ? row.descEn : row.desc}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DocSurfaceTableCard>
      </section>

      <section id="nav-menu-semantic-dom" className={docsSpacing.sectionStack}>
        <SectionLead title={
        lang === "en" ? "Semantic DOM" : "语义 DOM"} description={
        lang === "en" ? "Semantic parts AI and engineers should target." : "AI 和工程师应该理解的语义部位。"} />
        
        <DocSurfaceTableCard elevated>
          <Table className="min-w-[560px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">{lang === "en" ? "Part" : "部位"}</TableHead>
                <TableHead className="pr-4">{lang === "en" ? "Description" : "说明"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {navMenuSemanticDomRows.map((row) =>
              <TableRow key={row.part}>
                  <TableCell className="pl-4 font-medium"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.part}</code></TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{lang === "en" ? row.descEn : row.desc}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DocSurfaceTableCard>
      </section>

      <section id="nav-menu-do-dont" className={docsSpacing.sectionStack}>
        <SectionLead title={lang === "en" ? "Do / Don’t" : "正误示例"} />
        <DocDoDont lang={lang} rows={navMenuDoDontRows} elevated />
      </section>
    </div>);

}

function LayoutPage({ actions, lang }: {actions: React.ReactNode;lang: Lang;}) {
  // 线框区域块（区域名按语言显示）
  const t = (zh: string, en: string) => lang === "en" ? en : zh;
  const hd = t("头部", "Header"),mn = t("主体", "Main"),ft = t("底部", "Footer"),nv = t("导航", "Menu"),lf = t("左", "Left"),rt = t("右", "Right");
  const B = ({ label, className = "" }: {label: string;className?: string;}) =>
  <div className={`flex items-center justify-center rounded bg-muted text-xs text-muted-foreground ${className}`}>{label}</div>;

  const containers = [
  { n: "一", en: "1", desc: "最常见基础页", descEn: "Most common",
    wire: <div className="flex h-36 flex-col gap-1"><B label={hd} className="h-6" /><B label={mn} className="flex-1" /></div> },
  { n: "二", en: "2", desc: "带固定底部", descEn: "With footer",
    wire: <div className="flex h-36 flex-col gap-1"><B label={hd} className="h-6" /><B label={mn} className="flex-1" /><B label={ft} className="h-6" /></div> },
  { n: "三", en: "3", desc: "二级左侧导航", descEn: "Left menu",
    wire: <div className="flex h-36 flex-col gap-1"><B label={hd} className="h-6" /><div className="flex flex-1 gap-1"><B label={nv} className="w-1/4" /><B label={mn} className="flex-1" /></div><B label={ft} className="h-6" /></div> },
  { n: "四", en: "4", desc: "二级顶部导航", descEn: "Top menu",
    wire: <div className="flex h-36 flex-col gap-1"><B label={hd} className="h-6" /><B label={nv} className="h-5" /><B label={mn} className="flex-1" /><B label={ft} className="h-6" /></div> },
  { n: "五", en: "5", desc: "三栏·画布操作区", descEn: "3-column canvas",
    wire: <div className="flex h-36 flex-col gap-1"><B label={hd} className="h-6" /><div className="flex flex-1 gap-1"><B label={lf} className="w-1/5" /><B label={mn} className="flex-1" /><B label={rt} className="w-1/5" /></div></div> },
  { n: "六", en: "6", desc: "左侧一级导航 · 新版趋势", descEn: "Left primary nav · trend",
    wire: <div className="flex h-36 gap-1"><B label={nv} className="w-1/5" /><div className="flex flex-1 flex-col gap-1"><B label={hd} className="h-6" /><B label={mn} className="flex-1" /><B label={ft} className="h-6" /></div></div> }];

  return (
    <div className={docsSpacing.pageStack}>
      <section id="layout-containers" className="flex flex-col gap-2">
        <PageLead
          crumb={lang === "en" ? "Foundations / Layout" : "基础 / 布局"}
          title={lang === "en" ? "Layout" : "布局"}
          lead={lang === "en" ? "Page frame patterns (header / sider / content / footer) and their default sizes. The grid system lives on its own Grid page." : "页面骨架样式（头/侧/内容/底）与默认尺寸。栅格系统单独在「栅格」页。"}
          actions={actions} />
      </section>

      <section className={docsSpacing.sectionStack}>
        <div>
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Page containers 页面容器" : "页面布局容器（6 种样式）"}</h2>
          <p className="mt-2 text-base text-muted-foreground">{lang === "en" ? "From simple to complex. Style 6 (left primary nav) is the recommended trend." : "从简到繁；样式六（左侧一级导航）是新版趋势，新建后台优先。"}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {containers.map((c) =>
          <div key={c.n} className="rounded-lg border border-border bg-card p-4">
              <div className="mb-3 flex items-baseline gap-2">
                <span className="text-lg font-semibold">{lang === "en" ? `Style ${c.en}` : `样式${c.n}`}</span>
                <span className="text-sm text-muted-foreground">{lang === "en" ? c.descEn : c.desc}</span>
              </div>
              {c.wire}
            </div>
          )}
        </div>
        {/* 容器默认尺寸 */}
        <div className="rounded-lg border border-border bg-card p-5 text-base leading-7 text-muted-foreground">
          <p className="mb-1 text-base font-medium text-foreground">{lang === "en" ? "Default container sizes" : "容器默认尺寸"}</p>
          <p>{lang === "en" ? "Frame (header/sider/content/footer) uses flex; the 24-col grid only governs content inside." : "框架（头/侧/内容/底）用 flex 拼；24 列栅格只管内容区内部的分栏。"}</p>
          <p className="mt-1"><span className="font-medium text-foreground">{lang === "en" ? "Header" : "顶栏"}</span> 56px · <span className="font-medium text-foreground">{lang === "en" ? "Sider" : "侧栏"}</span> {lang === "en" ? "240 / collapsed 64" : "展开 240 / 收起 64"} · <span className="font-medium text-foreground">{lang === "en" ? "Footer" : "底栏"}</span> 48px · <span className="font-medium text-foreground">{lang === "en" ? "Content padding" : "内容内边距"}</span> {lang === "en" ? "16 (mobile) / 24 (desktop)" : "移动 16 / 桌面 24"}</p>
          <p className="mt-1">{lang === "en" ? "Sider auto-collapses to the 64px icon rail below lg (1024px)." : "视口 < lg(1024px) 时侧栏自动收起为 64px 图标栏（或转抽屉）。"}</p>
        </div>
      </section>
    </div>);

}

function TokensTypographyPage({ actions, lang }: {actions: React.ReactNode;lang: Lang;}) {
  return (
    <div className={docsSpacing.pageStack}>
      <section id="tokens-typography" className="flex flex-col gap-2">
        <PageLead
          crumb={lang === "en" ? "Design Tokens / Typography" : "设计令牌 / 排版"}
          title={lang === "en" ? "Typography" : "排版"}
          lead={lang === "en" ? "Typography is split into three parts: size (with heading levels), weight, and family." : "排版分三部分：字号（含标题层级）、字重、字体。"}
          actions={actions} />
      </section>

      {([
      { id: "tokens-typography-size", title: lang === "en" ? "Size 字号" : "字号", desc: lang === "en" ? "Text size by hierarchy (H1–H6 / body / small). Value = font-size / line-height." : "决定不同层级文本的大小（H1–H6 / 正文 / 小字）。值 = 字号 / 行高。", rows: typeSizeTokens },
      { id: "tokens-typography-weight", title: lang === "en" ? "Weight 字重" : "字重", desc: lang === "en" ? "Text thickness." : "决定不同层级文本的粗细。", rows: typeWeightTokens },
      { id: "tokens-typography-family", title: lang === "en" ? "Family 字体" : "字体", desc: lang === "en" ? "Global font family." : "全局字族。", rows: typeFamilyTokens }] as
      const).map((group) =>
      <section key={group.title} id={group.id} className={`${docsSpacing.sectionStack} scroll-mt-24`}>
          <div>
            <h2 className="text-xl font-bold tracking-tight">{group.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{group.desc}</p>
          </div>
          <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
            <Table className="min-w-[680px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-4">Token</TableHead>
                  <TableHead>{lang === "en" ? "Value" : "值"}</TableHead>
                  <TableHead>{lang === "en" ? "Example" : "示例"}</TableHead>
                  <TableHead className="pr-4">{lang === "en" ? "Usage" : "用法"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {group.rows.map((row) =>
              <TableRow key={row.name}>
                    <TableCell className="pl-4 font-medium">
                      <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.name}</code>
                    </TableCell>
                    <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.value}</code></TableCell>
                    <TableCell><span className={`leading-none text-foreground ${row.cls}`}>示例文字 Aa</span></TableCell>
                    <TableCell className="pr-4 text-foreground">{lang === "en" ? row.usageEn : row.usage}</TableCell>
                  </TableRow>
              )}
              </TableBody>
            </Table>
          </div>
        </section>
      )}

      <section className={docsSpacing.sectionStack}>
        <div className="rounded-lg border border-border bg-muted/40 p-5 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">{lang === "en" ? "Font family" : "字族说明"}</p>
          <p className="mt-1">
            {lang === "en" ?
            "Self-hosted open-source fonts (OFL, no licensing worry): Inter for Latin/digits, Noto Sans SC (= Source Han Sans Simplified) for CJK — consistent across platforms. Inter has no CJK, so Chinese falls to Noto Sans SC; system fonts only as last resort. Defined once at " :
            "自托管开源字体（OFL，无版权困扰）：西文/数字用 Inter，中文用 Noto Sans SC（即思源黑体简体），跨平台一致。Inter 不含中文，中文自动落到 Noto Sans SC；系统字体只作最后兜底。一处定义在 "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">--font-sans</code>
            {lang === "en" ? " (theme/fx-theme.css), imported in src/main.tsx via @fontsource." : "（theme/fx-theme.css），在 src/main.tsx 用 @fontsource 引入。"}
          </p>
          <pre className="mt-3 overflow-x-auto rounded-md bg-card p-3 text-xs leading-6"><code>{`--font-sans: "Inter Variable", "Noto Sans SC",
  "Helvetica Neue", "PingFang SC", "Microsoft Yahei", "微软雅黑", Arial, sans-serif;`}</code></pre>
        </div>
      </section>
    </div>);

}

function TokensRadiusPage({ actions, lang }: {actions: React.ReactNode;lang: Lang;}) {
  return (
    <div className={docsSpacing.pageStack}>
      <section id="tokens-radius" className="flex flex-col gap-2">
        <PageLead
          crumb={lang === "en" ? "Design Tokens / Radius" : "设计令牌 / 圆角"}
          title={lang === "en" ? "Radius" : "圆角"}
          lead={lang === "en" ? "Radius tokens keep shadcn controls, cards, and overlays visually consistent." : "圆角 token 用来统一 shadcn 控件、卡片和浮层容器的视觉性格。"}
          actions={actions} />
      </section>

      <section id="tokens-radius-scale" className={`${docsSpacing.sectionStack} scroll-mt-24`}>
          <div>
            <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Radius scale 圆角档位" : "圆角档位"}</h2>
            <p className="mt-2 text-base text-muted-foreground">
              {lang === "en" ?
              "All radius steps, from square to pill — chosen by component TYPE, not size. Per-step usage is in the Usage column." :
              "全部圆角档位，从直角到胶囊——按组件「类型」选，不是按大小选。逐档对应组件见右侧场景列。"}
            </p>
          </div>
          <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
            <Table className="min-w-[720px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-4">Token</TableHead>
                  <TableHead>{lang === "en" ? "Value" : "值"}</TableHead>
                  <TableHead>{lang === "en" ? "Example" : "示例"}</TableHead>
                  <TableHead className="pr-4">{lang === "en" ? "Usage" : "用法"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {radiusTokens.map((row) =>
                <TableRow key={row.name}>
                    <TableCell className="pl-4 font-medium">
                      <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.name}</code>
                    </TableCell>
                    <TableCell>
                      <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.value}</code>
                    </TableCell>
                    <TableCell>
                      <div className={`size-10 bg-primary/15 ring-1 ring-inset ring-primary/30 ${row.name === "--radius" ? "rounded-lg" : row.name}`} />
                    </TableCell>
                    <TableCell className="pr-4 text-foreground">{lang === "en" ? row.usageEn : row.usage}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
      </section>

      <section id="tokens-radius-compute" className={`${docsSpacing.sectionStack} scroll-mt-24`}>
          <div>
            <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "How it's computed 计算方式" : "计算方式"}</h2>
            <p className="mt-2 text-base text-muted-foreground">
              {lang === "en" ?
              "Core steps derive from a single base via fixed ±2px steps (the shadcn convention); large steps use Tailwind defaults." :
              "核心档由唯一基准值按固定 ±2px 步进派生（shadcn 标准做法）；大容器档用 Tailwind 默认值。"}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-5 text-base text-muted-foreground">
            <p><span className="font-medium text-foreground">{lang === "en" ? "Base" : "基准"}</span>：<code className="rounded bg-muted px-1 text-sm">--radius = 0.625rem（10px）</code>{lang === "en" ? "，equals rounded-lg." : "，即 rounded-lg。"}</p>
            <p className="mt-1"><span className="font-medium text-foreground">{lang === "en" ? "Core ±2px step" : "核心档 ±2px 步进"}</span>：sm = <code className="rounded bg-muted px-1 text-sm">base − 4px</code>，md = <code className="rounded bg-muted px-1 text-sm">base − 2px</code>，lg = <code className="rounded bg-muted px-1 text-sm">base</code>，xl = <code className="rounded bg-muted px-1 text-sm">base + 4px</code>{lang === "en" ? "。Changing the base shifts the whole scale together." : "。改基准值整套等量平移，差值恒定可预测。"}</p>
            <p className="mt-1"><span className="font-medium text-foreground">{lang === "en" ? "Large steps" : "大容器档"}</span>：2xl = 16px，3xl = 24px，4xl = 32px{lang === "en" ? " (Tailwind defaults)." : "（Tailwind 默认固定值）。"}</p>
            <p className="mt-1"><span className="font-medium text-foreground">full</span>：<code className="rounded bg-muted px-1 text-sm">9999px</code>{lang === "en" ? "，a pill/circle, not derived from the base." : "，胶囊/圆形，不参与基准派生。"}</p>
            <p className="mt-3 border-t border-border pt-3 font-medium text-foreground">{lang === "en" ? "Why derive instead of hard-coded values?" : "为什么用 calc 派生，不直接写固定值？"}</p>
            <p className="mt-1">{lang === "en" ?
              "① Single knob — change --radius and the whole scale shifts together, so a rounder/squarer brand is one edit. ② Constant step — fixed ±2px keeps neighboring steps evenly spaced, no drift like someone writing 7 and someone 9. ③ Theme-able. Hard-coded values read more directly but lose the master knob, so the doc shows the computed px too." :
              "① 单一总开关——改 --radius 整套等量平移，想更圆/更方一处生效；② 步进恒定——固定 ±2px 让相邻档差值一致，不会有人写 7、有人写 9 漂移；③ 品牌可调。固定值更直观但失去这把总开关，所以表格里同时标了换算后的 px。"}</p>
            <p className="mt-3 border-t border-border pt-3 font-medium text-foreground">{lang === "en" ? "Size vs radius — the 0.15–0.35 ratio band" : "尺寸与圆角——0.15~0.35 比值带"}</p>
            <p className="mt-1">{lang === "en" ?
              "Pick one step by component type, then apply it to all size variants and check radius ÷ height. As long as every size stays within 0.15–0.35 it shares one radius (e.g. an 8px button at 28/32/36px → 0.29/0.25/0.22, all in band). A size that falls out steps to a neighboring step automatically — > 0.4 (too round) steps down, < 0.15 (too sharp) steps up — reusing the existing scale, never a new value." :
              "先按组件类型选一档，套到该组件所有尺寸上算「圆角 ÷ 高度」：只要每个尺寸都落在 0.15~0.35 就共用一档（如 8px 按钮在 28/32/36px → 0.29/0.25/0.22，全在带内）。掉出带的尺寸自动换到相邻档——> 0.4（太圆）下调、< 0.15（太尖）上调——复用现有阶梯，不造新值。判定靠比值算，不靠拍脑袋，也不用逐组件预先指定。"}</p>
          </div>
      </section>
    </div>);

}

function TokensSpacingPage({ actions, lang }: {actions: React.ReactNode;lang: Lang;}) {
  return (
    <div className={docsSpacing.pageStack}>
      <section id="tokens-spacing" className="flex flex-col gap-2">
        <PageLead
          crumb={lang === "en" ? "Design Tokens / Spacing" : "设计令牌 / 间距"}
          title={lang === "en" ? "Spacing" : "间距"}
          lead={lang === "en" ? "Spacing tokens keep page rhythm, component density, and documentation layout consistent. Prefer Tailwind spacing utilities instead of one-off pixel values." : "间距 token 用来统一页面节奏、组件密度和文档排版。优先使用 Tailwind 间距工具类，不临时手写像素值。"}
          actions={actions} />
      </section>

      <section id="tokens-spacing-scale" className={`${docsSpacing.sectionStack} scroll-mt-24`}>
          <div>
            <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Spacing scale 间距档位" : "间距档位"}</h2>
            <p className="mt-2 text-base text-muted-foreground">
              {lang === "en" ?
              "Common steps off the 4px base. Example bar shows the real size; per-step usage is in the Usage column." :
              "基于 4px 基准的常用档位。示例长条是真实大小，逐档场景见右侧。"}
            </p>
          </div>
          <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
            <Table className="min-w-[720px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-4">Token</TableHead>
                  <TableHead>{lang === "en" ? "Value" : "值"}</TableHead>
                  <TableHead>{lang === "en" ? "Example" : "示例"}</TableHead>
                  <TableHead className="pr-4">{lang === "en" ? "Usage" : "用法"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {spacingTokens.map((row) =>
                <TableRow key={row.name} className="hover:bg-transparent">
                    <TableCell className="pl-4 font-medium">
                      <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.name}</code>
                    </TableCell>
                    <TableCell>
                      <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.value}</code>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 rounded bg-primary/70" style={{ width: `${row.px}px` }} />
                    </TableCell>
                    <TableCell className="pr-4 text-foreground">{lang === "en" ? row.usageEn : row.usage}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
      </section>

      <section id="tokens-spacing-compute" className={`${docsSpacing.sectionStack} scroll-mt-24`}>
          <div>
            <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "How it's computed 计算方式" : "计算方式"}</h2>
            <p className="mt-2 text-base text-muted-foreground">
              {lang === "en" ?
              "Every spacing utility is the 4px base unit times the step number — a 4-point grid." :
              "每个间距 = 4px 基准单位 × 档位数字，构成 4 点网格。"}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-5 text-base text-muted-foreground">
            <p><span className="font-medium text-foreground">{lang === "en" ? "Base unit" : "基准单位"}</span>：<code className="rounded bg-muted px-1 text-sm">--spacing = 0.25rem（4px）</code>{lang === "en" ? " (Tailwind default)." : "（Tailwind 默认）。"}</p>
            <p className="mt-1"><span className="font-medium text-foreground">{lang === "en" ? "Formula" : "公式"}</span>：<code className="rounded bg-muted px-1 text-sm">gap-n = calc(var(--spacing) * n)</code>{lang === "en" ? "，e.g. gap-4 = 4×4 = 16px, gap-6 = 4×6 = 24px." : "，如 gap-4 = 4×4 = 16px、gap-6 = 4×6 = 24px。"}</p>
            <p className="mt-1"><span className="font-medium text-foreground">{lang === "en" ? "4-point grid" : "4 点网格"}</span>：{lang === "en" ? "all spacing snaps to multiples of 4px, so rhythm stays even and predictable across pages." : "所有间距都落在 4px 的倍数上，页面节奏统一、可预测，不出现 5/7/13 这种随手值。"}</p>
            <p className="mt-3 border-t border-border pt-3"><span className="font-medium text-foreground">{lang === "en" ? "Rule" : "用法"}</span>：{lang === "en" ? "use Tailwind spacing utilities (gap/p/m/space) — never hand-write arbitrary px. Same knob as padding/margin/gap." : "一律用 Tailwind 间距工具类（gap / p / m / space），不手写任意 px；padding、margin、gap 共用这一套刻度。"}</p>
          </div>
      </section>
    </div>);

}

function TokensShadowPage({ actions, lang }: {actions: React.ReactNode;lang: Lang;}) {
  return (
    <div className={docsSpacing.pageStack}>
      <section id="tokens-shadow" className="flex flex-col gap-2">
        <PageLead
          crumb={lang === "en" ? "Design Tokens / Shadow" : "设计令牌 / 阴影"}
          title={lang === "en" ? "Shadow" : "阴影"}
          lead={lang === "en" ? "Shadow tokens come from Figma's Layer Style spec — four levels cover every overlay. Only use shadow-l1/l2/l3/l1-up; avoid Tailwind's built-in shadow-sm/md/lg (a separate set of values that won't follow our shadow variables)." : "阴影 token 来自 Figma「图层样式」，四档覆盖所有浮层场景。只用 shadow-l1/l2/l3/l1-up，别用 Tailwind 自带的 shadow-sm/md/lg（那是另一套数值，不跟随公司变量）。"}
          actions={actions} />
      </section>

      <section id="tokens-shadow-scale" className={`${docsSpacing.sectionStack} scroll-mt-24`}>
          <div>
            <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Elevation levels 阴影档位" : "阴影档位"}</h2>
            <p className="mt-2 text-base text-muted-foreground">
              {lang === "en" ?
              "Shadow encodes how high an element floats above the page — higher = lower & more diffuse. Pick by overlay layer; per-level usage is in the Usage column." :
              "阴影表达元素「离页面多高」——越高、投影越往下、越散。按浮层层级选档，逐档对应组件见右侧场景列。"}
            </p>
          </div>
          <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
            <Table className="min-w-[720px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-4">Token</TableHead>
                  <TableHead>{lang === "en" ? "Value" : "值"}</TableHead>
                  <TableHead>{lang === "en" ? "Example" : "示例"}</TableHead>
                  <TableHead className="pr-4">{lang === "en" ? "Usage" : "用法"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shadowTokens.map((row) =>
                <TableRow key={row.name} className="hover:bg-transparent">
                    <TableCell className="pl-4 font-medium align-middle">
                      <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.name}</code>
                    </TableCell>
                    <TableCell className="align-middle">
                      <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.value}</code>
                    </TableCell>
                    <TableCell className="align-middle">
                      <div className="py-8">
                        <div className={`h-10 w-24 rounded-lg bg-card ${row.name}`} />
                      </div>
                    </TableCell>
                    <TableCell className="pr-4 align-middle text-foreground">{lang === "en" ? row.usageEn : row.usage}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
      </section>

      <section id="tokens-shadow-compute" className={`${docsSpacing.sectionStack} scroll-mt-24`}>
          <div>
            <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "How it's computed 计算方式" : "计算方式"}</h2>
            <p className="mt-2 text-base text-muted-foreground">
              {lang === "en" ?
              "Each level is 0 {y}px {blur}px {spread}px var(--fx-shadow-color). Low elevation uses negative spread so the edge stays soft and shallow." :
              "每档 = 0 {y}px {blur}px {spread}px var(--fx-shadow-color)。低档使用负 spread，让边缘更柔、更浅。"}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-5 text-base text-muted-foreground">
            <p><span className="font-medium text-foreground">{lang === "en" ? "Color knob" : "颜色总开关"}</span>：<code className="rounded bg-muted px-1 text-sm">--fx-shadow-color = oklch(from --fx-neutrals-20 l c h / .08)</code>{lang === "en" ? "，derived from the darkest neutral (brand-tinted) at 8% alpha — follows the palette, not hard-coded black; one place to adjust." : "，从最深中性灰（带品牌色相）派生 + 8% 透明，跟随色板而非写死纯黑；四档共用、一处调深浅。"}</p>
            <p className="mt-1"><span className="font-medium text-foreground">{lang === "en" ? "Y-offset" : "y 偏移"}</span>：{lang === "en" ? "drop distance, +2px per level — 2 / 4 / 6 (light from top, higher floats drop further)." : "投影下移距离，每升一层 +2px——2 / 4 / 6（光从上方来，越高落得越远）。"}</p>
            <p className="mt-1"><span className="font-medium text-foreground">Blur</span>：{lang === "en" ? "softness, roughly doubles per level — 6 / 12 / 24 (higher = softer, more diffuse)." : "模糊半径，约每层翻倍——6 / 12 / 24（越高越柔、越散）。"}</p>
            <p className="mt-1"><span className="font-medium text-foreground">Spread</span>：0{lang === "en" ? " — never expand, keeps shadows clean." : "——不外扩，避免脏重。"}</p>
            <p className="mt-1"><span className="font-medium text-foreground">{lang === "en" ? "Direction variant" : "方向变体"}</span>：{lang === "en" ? "shadow-l1-up = L1 with negative y, for overlays that pop upward (bottom toolbar menus)." : "shadow-l1-up = L1 的 y 取负，用于从下往上弹的浮层（底部工具栏菜单）。"}</p>
            <p className="mt-3 border-t border-border pt-3"><span className="font-medium text-foreground">{lang === "en" ? "Why this way" : "为什么这样做"}</span>：{lang === "en" ? "layers are separated by geometry (y + blur), not by darkening color — so overlays stay light and neutral instead of muddy. Built-in Tailwind shadow-sm/md/lg are banned: they aren't mapped to company tokens and would drift." : "靠几何（y + blur）拉开层级，不靠加深颜色——浮层保持淡而中性，不发脏。只用 shadow-l1/l2/l3/l1-up，别用 Tailwind 自带的 shadow-sm/md/lg：那是另一套独立数值、不跟随公司阴影变量，混用会让全站阴影深浅对不上、以后也调不动。"}</p>
          </div>
      </section>
    </div>);

}

function TokensMotionPage({ actions, lang }: {actions: React.ReactNode;lang: Lang;}) {
  const [replayKey, setReplayKey] = useState(0);
  const durationRows = motionTokens.filter((r) => r.name.startsWith("duration-"));
  const primitiveRows = motionTokens.filter((r) => !r.name.startsWith("duration-"));
  return (
    <div className={docsSpacing.pageStack}>
      <section id="tokens-motion" className="flex flex-col gap-2">
        <PageLead
          crumb={lang === "en" ? "Design Tokens / Motion" : "设计令牌 / 动效"}
          title={lang === "en" ? "Motion" : "动效"}
          lead={lang === "en" ? "Motion follows the shadcn components already in the project: tw-animate-css utilities, short durations, and data-state driven enter/exit transitions." : "动效沿用项目里 shadcn 组件已经在使用的模式：tw-animate-css 工具类、短时长、以及由 data-state 驱动的进入退出。"}
          actions={actions} />
      </section>

      <section id="tokens-motion-duration" className={`${docsSpacing.sectionStack} scroll-mt-24`}>
          <div>
            <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Duration scale 时长档位" : "时长档位"}</h2>
            <p className="mt-2 text-base text-muted-foreground">
              {lang === "en" ? "Short, tiered durations — small overlays snap fast, larger movement eases a bit longer. Click to replay." : "短促、分档：小浮层快、位移大的稍慢。点按钮可重播示例。"}
            </p>
          </div>
          <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
            <Table className="min-w-[720px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-4">Token</TableHead>
                  <TableHead>
                    <span className="inline-flex items-center gap-2">
                      {lang === "en" ? "Example" : "示例"}
                      <Button size="xs" variant="outline" onClick={() => setReplayKey((k) => k + 1)}>{lang === "en" ? "Play" : "播放"}</Button>
                    </span>
                  </TableHead>
                  <TableHead className="pr-4">{lang === "en" ? "Usage" : "用法"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {durationRows.map((row) =>
                <TableRow key={row.name} className="hover:bg-transparent">
                    <TableCell className="pl-4 font-medium">
                      <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.name}</code>
                    </TableCell>
                    <TableCell>
                      <div className="w-40 overflow-hidden rounded bg-muted/40 p-1">
                        <div key={replayKey} className={`h-6 w-16 rounded bg-primary/70 ${row.name} animate-in fade-in-0 slide-in-from-left-24 ease-out`} />
                      </div>
                    </TableCell>
                    <TableCell className="pr-4 text-foreground">{lang === "en" ? row.usageEn : row.usage}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
      </section>

      <section id="tokens-motion-primitives" className={`${docsSpacing.sectionStack} scroll-mt-24`}>
          <div>
            <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Primitives & rules 原语与规则" : "原语与规则"}</h2>
            <p className="mt-2 text-base text-muted-foreground">
              {lang === "en" ? "Composed from a few primitives, driven by state — not hand-written keyframes." : "由几个原语组合、靠状态驱动，不手写关键帧。"}
            </p>
          </div>
          <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
            <Table className="min-w-[720px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-4">Token / Utility</TableHead>
                  <TableHead className="pr-4">{lang === "en" ? "Usage" : "用法"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {primitiveRows.map((row) =>
                <TableRow key={row.name} className="hover:bg-transparent">
                    <TableCell className="pl-4 font-medium">
                      <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.name}</code>
                    </TableCell>
                    <TableCell className="pr-4 text-foreground">{lang === "en" ? row.usageEn : row.usage}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="rounded-lg border border-border bg-card p-5 text-base text-muted-foreground">
            <p><span className="font-medium text-foreground">{lang === "en" ? "Short" : "短促"}</span>：{lang === "en" ? "100–200ms; UI motion is feedback, not spectacle." : "100–200ms 区间；界面动效是反馈，不是表演。"}</p>
            <p className="mt-1"><span className="font-medium text-foreground">{lang === "en" ? "State driven" : "状态驱动"}</span>：{lang === "en" ? "enter/exit triggered by data-open / data-closed / data-state, not manual timers." : "进入/退出由 data-open / data-closed / data-state 触发，不手动计时。"}</p>
            <p className="mt-3 border-t border-border pt-3"><span className="font-medium text-foreground">{lang === "en" ? "Rule" : "用法"}</span>：{lang === "en" ? "compose fade / zoom / slide via tw-animate-css utilities; don't invent one-off keyframes per page." : "用 tw-animate-css 工具类组合 fade / zoom / slide，不为单页临时写关键帧动画。"}</p>
          </div>
      </section>
    </div>);

}

function TokensLayerPage({ actions, lang }: {actions: React.ReactNode;lang: Lang;}) {
  return (
    <div className={docsSpacing.pageStack}>
      <section id="tokens-layer" className="flex flex-col gap-2">
        <PageLead
          crumb={lang === "en" ? "Design Tokens / Layer" : "设计令牌 / 层级"}
          title={lang === "en" ? "Layer" : "层级"}
          lead={lang === "en" ? "Layer rules document the z-index scale already used by shadcn overlays. Avoid inventing new z-index values unless a real collision appears." : "层级规则记录 shadcn 浮层已经在用的 z-index 习惯。除非真的出现遮挡冲突，不要临时发明新的 z-index。"}
          actions={actions} />
      </section>

      <section id="tokens-layer-scale" className={`${docsSpacing.sectionStack} scroll-mt-24`}>
          <div>
            <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Layer levels 层级档位" : "层级档位"}</h2>
            <p className="mt-2 text-base text-muted-foreground">
              {lang === "en" ?
              "A few fixed z-index tiers — the bigger the number, the closer to the user. Pick by what the element is, not by guessing a number." :
              "几个固定的层级档位，数字越大越靠近用户。按元素用途选档，别凭感觉写数字。"}
            </p>
          </div>
          {/* 堆叠示例：档位越高越压在上面 */}
          <div className="rounded-lg border border-border bg-card p-5">
            <p className="mb-3 text-sm text-muted-foreground">{lang === "en" ? "Higher value stacks on top (closer to you)." : "数字越大，越压在上面（越靠近你）。"}</p>
            <div className="relative h-32">
              {layerTokens.map((row, i) =>
              <div
                key={row.name}
                className="absolute flex h-12 w-48 items-center rounded-lg border border-border bg-card px-3 text-sm font-medium shadow-l1"
                style={{ top: `${i * 18}px`, left: `${i * 48}px`, zIndex: 10 + i * 10 }}>
                
                  {row.name}
                </div>
              )}
            </div>
          </div>
          <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
            <Table className="min-w-[720px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-4">Token</TableHead>
                  <TableHead className="pr-4">{lang === "en" ? "Usage" : "用法"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {layerTokens.map((row) =>
                <TableRow key={row.name} className="hover:bg-transparent">
                    <TableCell className="pl-4 font-medium">
                      <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.name}</code>
                    </TableCell>
                    <TableCell className="pr-4 text-foreground">{lang === "en" ? row.usageEn : row.usage}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
      </section>

      <section id="tokens-layer-logic" className={`${docsSpacing.sectionStack} scroll-mt-24`}>
          <div>
            <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Layering logic 分层逻辑" : "分层逻辑"}</h2>
            <p className="mt-2 text-base text-muted-foreground">
              {lang === "en" ? "Why a few fixed tiers instead of arbitrary numbers." : "为什么用几个固定档位，而不是随手写数字。"}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-5 text-base leading-relaxed text-muted-foreground">
            <p><span className="font-medium text-foreground">{lang === "en" ? "From low to high" : "从低到高"}</span>：{lang === "en" ? "page content → local controls → fixed/stuck headers → overlays. The bigger the number, the closer to you (on top)." : "页面内容 → 局部控件 → 固定/吸顶的头部 → 弹层。数字越大，离你越近、压在越上面。"}</p>
            <p className="mt-2"><span className="font-medium text-foreground">{lang === "en" ? "Overlays all use the top tier" : "弹层都用最高一档"}</span>：{lang === "en" ? "dialogs, dropdowns, popovers, sheets and tooltips all sit at the top tier; which one shows on top depends on who opens later, not on a bigger number." : "对话框、下拉、气泡、抽屉、提示框都用最高一档（z-50）；谁后打开谁在上，不靠更大的数字。"}</p>
            <p className="mt-3 border-t border-border pt-3"><span className="font-medium text-foreground">{lang === "en" ? "Rule" : "怎么用"}</span>：{lang === "en" ? "stick to these few tiers; if something gets covered, fit it into an existing tier — don't invent a bigger number." : "只用这几档；万一被挡住，把它归到现有的某一档，别去编一个更大的数字（不然以后谁都往上加，越堆越乱）。"}</p>
          </div>
      </section>
    </div>);

}

const iconPropRows = [
{ prop: "size", type: "number", defaultValue: "24", desc: "图标边长（px），等价于同时设置 width/height；项目内更推荐用 className 的 size-* 控制", descEn: "Icon edge length in px (sets width/height). Prefer size-* via className in this project" },
{ prop: "stroke", type: "number", defaultValue: "2", desc: "线宽；项目用全局 .tabler-icon = 1.75 统一覆盖，一般不单独传", descEn: "Stroke width; globally overridden to 1.75 via .tabler-icon, rarely set per-icon" },
{ prop: "color", type: "string", defaultValue: "'currentColor'", desc: "描边/填充色；默认跟随父级文字色，优先用 text-* 语义类而非写死颜色", descEn: "Stroke/fill color; defaults to currentColor. Prefer text-* over hard-coded values" },
{ prop: "className", type: "string", defaultValue: "—", desc: "追加 Tailwind 类，常用 size-* 控制尺寸、text-* 控制颜色", descEn: "Extra Tailwind classes; commonly size-* for sizing and text-* for color" },
{ prop: "data-icon", type: "'inline-start' | 'inline-end'", defaultValue: "—", desc: "放进 Button 时标记图标位置，尺寸交给 Button 接管，不再手写 size-*", descEn: "Marks icon placement inside Button; Button then controls sizing" }];


const iconScenarioFilters = [
{ value: "type", label: "类型", labelEn: "Type" },
{ value: "size", label: "尺寸", labelEn: "Size" }];

type IconPlaygroundMode = "line" | "filled" | "button" | "chip";
type IconPlaygroundColor = "foreground" | "muted" | "primary" | "success" | "warning" | "destructive" | "info";

const iconPlaygroundSizeClass: Record<string, string> = {
  "12": "size-3",
  "16": "size-4",
  "20": "size-5",
  "24": "size-6",
  "32": "size-8"
};

const iconPlaygroundCircleSizeClass: Record<string, string> = {
  "12": "size-7",
  "16": "size-8",
  "20": "size-9",
  "24": "size-10",
  "32": "size-12"
};

const iconPlaygroundDemoIcon = {
  label: "首页",
  labelEn: "Home",
  importName: "HomeIcon, HomeFilledIcon",
  line: HomeIcon,
  lineName: "HomeIcon",
  filled: HomeFilledIcon,
  filledName: "HomeFilledIcon"
};

const iconPlaygroundColors: {value: IconPlaygroundColor;label: string;labelEn: string;className: string;}[] = [
{ value: "foreground", label: "正文", labelEn: "Foreground", className: "text-foreground" },
{ value: "muted", label: "次要", labelEn: "Muted", className: "text-muted-foreground" },
{ value: "primary", label: "主题", labelEn: "Primary", className: "text-primary" },
{ value: "success", label: "成功", labelEn: "Success", className: "text-success" },
{ value: "warning", label: "警告", labelEn: "Warning", className: "text-warning" },
{ value: "destructive", label: "危险", labelEn: "Danger", className: "text-destructive" },
{ value: "info", label: "信息", labelEn: "Info", className: "text-info" }];

function getIconPlaygroundColor(value: string) {
  return iconPlaygroundColors.find((item) => item.value === value) ?? iconPlaygroundColors[0];
}

function getIconPlaygroundComponent(icon: typeof iconPlaygroundDemoIcon, mode: IconPlaygroundMode) {
  return mode === "filled" || mode === "chip" ? icon.filled ?? icon.line : icon.line;
}

function getIconPlaygroundComponentName(icon: typeof iconPlaygroundDemoIcon, mode: IconPlaygroundMode) {
  return mode === "filled" || mode === "chip" ? icon.filledName ?? icon.lineName : icon.lineName;
}

function renderIconPlayground(c: Record<string, string>, lang: Lang) {
  const icon = iconPlaygroundDemoIcon;
  const mode = c.mode as IconPlaygroundMode;
  const Icon = getIconPlaygroundComponent(icon, mode);
  const LineIcon = icon.line;
  const sizeKey = c.size || "20";
  const size = Number(sizeKey) || 20;
  const color = getIconPlaygroundColor(c.color);
  const label = lang === "en" ? icon.labelEn : icon.label;
  const style = { width: size, height: size } as React.CSSProperties;
  const circleSizeClass = iconPlaygroundCircleSizeClass[sizeKey] ?? iconPlaygroundCircleSizeClass["20"];

  if (mode === "button") {
    return (
      <Button>
        <LineIcon data-icon="inline-start" />
        {label}
      </Button>);
  }

  if (mode === "chip") {
    return (
      <span className={`flex ${circleSizeClass} items-center justify-center rounded-full bg-primary text-primary-foreground`}>
        <Icon style={style} />
      </span>);
  }

  return <Icon className={color.className} style={style} />;
}

function genIconPlaygroundCode(c: Record<string, string>, lang: Lang) {
  const icon = iconPlaygroundDemoIcon;
  const mode = c.mode as IconPlaygroundMode;
  const sizeKey = c.size || "20";
  const color = getIconPlaygroundColor(c.color);
  const label = lang === "en" ? icon.labelEn : icon.label;
  const componentName = getIconPlaygroundComponentName(icon, mode);
  const importCode = `import { ${icon.importName} } from "@/lib/icons"`;
  const iconSizeClass = iconPlaygroundSizeClass[sizeKey] ?? iconPlaygroundSizeClass["20"];
  const circleSizeClass = iconPlaygroundCircleSizeClass[sizeKey] ?? iconPlaygroundCircleSizeClass["20"];

  if (mode === "button") {
    return `${importCode}\n\n<Button>\n  <${icon.lineName} data-icon="inline-start" />\n  ${label}\n</Button>`;
  }

  if (mode === "chip") {
    return `${importCode}\n\n<span className="flex ${circleSizeClass} items-center justify-center rounded-full bg-primary text-primary-foreground">\n  <${componentName} className="${iconSizeClass}" />\n</span>`;
  }

  return `${importCode}\n\n<${componentName} className="${iconSizeClass} ${color.className}" />`;
}

const iconPlaygroundConfig = {
  props: componentPlaygroundPropsFromManifest(componentPlaygroundsManifest.components.icon),
  initial: componentPlaygroundsManifest.components.icon.initial,
  guidanceKey: componentPlaygroundsManifest.components.icon.guidanceKey,
  renderOne: renderIconPlayground,
  genCode: genIconPlaygroundCode
};

function IconPage({ actions, lang }: {actions: React.ReactNode;lang: Lang;}) {
  const iconImportCode = `import { SearchIcon, HomeFilledIcon } from "@/lib/icons"`;

  const iconSemanticRows = [
  { part: "svg.tabler-icon", desc: "每个图标渲染为带 .tabler-icon 类的 <svg>，全局在此类上统一 stroke-width，不要逐个图标改线宽。", descEn: "Each icon renders as <svg class=\"tabler-icon\">; stroke-width is set globally on this class." },
  { part: "currentColor", desc: "描边/填充默认取 currentColor，跟随父级 text-* 语义色；改色改父级文字色即可。", descEn: "Stroke/fill default to currentColor and follow the parent text color." },
  { part: "data-icon", desc: "图标放进 Button 时用 data-icon=\"inline-start | inline-end\" 标位，由 Button 决定尺寸与间距。", descEn: "Inside Button, data-icon marks placement; Button owns size and spacing." }];


  const iconDoDontRows = [
  { do: "颜色用 currentColor / text-* 跟随语义色。", doEn: "Use currentColor / text-* to follow semantic color.", dont: "给图标写死 color=\"#FF8000\" 等颜色。", dontEn: "Hard-code icon color like color=\"#FF8000\"." },
  { do: "按钮内图标用 data-icon 标位，尺寸交给 Button。", doEn: "Mark icons in Button with data-icon; Button owns size.", dont: "给按钮内图标手写 size-4 等尺寸。", dontEn: "Hard-code icon size like size-4 inside Button." },
  { do: "纯图标按钮加 aria-label。", doEn: "Give icon-only buttons an aria-label.", dont: "纯图标按钮不给可访问名称。", dontEn: "Omit accessible names on icon-only buttons." },
  { do: "统一从 @/lib/icons 导入。", doEn: "Import from @/lib/icons.", dont: "引入第二个图标库（如 lucide-react）。", dontEn: "Add a second icon library like lucide-react." }];


  const iconScenarios = [
  {
    title: "单色图标", titleEn: "Monochrome", group: "type",
    preview:
    <span className="flex items-center gap-3">
          <HomeIcon className="size-5 text-foreground" />
          <HomeIcon className="size-5 text-muted-foreground" />
          <HomeIcon className="size-5 text-foreground-disabled" />
        </span>,

    intent: "绝大多数场景，跟随文字层级。", intentEn: "Most cases; follows the text hierarchy.",
    constraint: "默认 text-foreground；次要降到 text-muted-foreground、禁用 text-foreground-disabled。", constraintEn: "Default text-foreground; muted for secondary, foreground-disabled for disabled.",
    code: '<HomeIcon className="size-5 text-foreground" />'
  },
  {
    title: "彩色语义图标", titleEn: "Colored semantic", group: "type",
    preview:
    <span className="flex items-center gap-2">
          <CheckCircleIcon className="size-5 text-success" />
          <BellIcon className="size-5 text-warning" />
          <PackageIcon className="size-5 text-destructive" />
        </span>,

    intent: "表达状态或品牌强调。", intentEn: "Convey status or brand emphasis.",
    constraint: "只用 success / warning / destructive 等语义色 token。", constraintEn: "Use only semantic color tokens.",
    code: '<CheckCircleIcon className="size-5 text-success" />'
  },
  {
    title: "面型", titleEn: "Solid", group: "type",
    preview: <HomeFilledIcon className="size-5 text-primary" />,
    intent: "选中、激活或需要强调时，由线性切换为面型。", intentEn: "Switch from line to solid for selected/active/emphasis.",
    constraint: "用 Tabler 的 *Filled 变体，不手写填充路径。", constraintEn: "Use Tabler *Filled variants, not hand-drawn fills.",
    code: '<HomeFilledIcon className="size-5 text-primary" />'
  },
  {
    title: "反白圆底", titleEn: "Filled-reverse", group: "type",
    preview:
    <span className="flex size-9 items-center justify-center rounded-full bg-primary">
          <HomeFilledIcon className="size-5 text-primary-foreground" />
        </span>,

    intent: "头像、入口或状态徽标等需要色块承托的场景。", intentEn: "Avatars, entries, and status badges that need a color chip.",
    constraint: "圆底用 bg-primary 主题色，图标用 text-primary-foreground 反白。", constraintEn: "Circle uses bg-primary; icon uses text-primary-foreground.",
    code: '<span className="rounded-full bg-primary">\n  <HomeFilledIcon className="text-primary-foreground" />\n</span>'
  },
  {
    title: "按钮内图标", titleEn: "Icon in Button", group: "type",
    preview:
    <Button>
          <SearchIcon data-icon="inline-start" />
          {lang === "en" ? "Search" : "搜索"}
        </Button>,

    intent: "操作按钮带前/后置图标。", intentEn: "Action buttons with a leading/trailing icon.",
    constraint: "用 data-icon 标位，尺寸交给 Button，不写 size-*。", constraintEn: "Mark with data-icon; Button controls size, no size-*.",
    code: '<Button><SearchIcon data-icon="inline-start" />搜索</Button>'
  },
  {
    title: "纯图标按钮", titleEn: "Icon-only Button", group: "type",
    preview:
    <Button size="icon-md" aria-label={lang === "en" ? "Notifications" : "通知"}>
          <BellIcon data-icon="inline-start" />
        </Button>,

    intent: "工具栏等空间紧凑、含义明确的操作。", intentEn: "Compact toolbar actions with clear meaning.",
    constraint: "必须提供 aria-label。", constraintEn: "Must provide an aria-label.",
    code: '<Button size="icon-md" aria-label="通知"><BellIcon data-icon="inline-start" /></Button>'
  },
  {
    title: "行内说明图标", titleEn: "Inline supporting", group: "type",
    preview:
    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <SparklesIcon className="size-4" />
          {lang === "en" ? "AI generated" : "AI 生成"}
        </span>,

    intent: "正文、提示中的辅助说明图标。", intentEn: "Supporting icons inside body text or hints.",
    constraint: "用 text-muted-foreground，尺寸跟随文字。", constraintEn: "Use text-muted-foreground; size follows text.",
    code: '<span className="text-muted-foreground"><SparklesIcon className="size-4" /> AI 生成</span>'
  },
  {
    title: "size-3 · 12px", titleEn: "size-3 · 12px", group: "size",
    preview: <SettingsIcon className="size-3" />,
    intent: "内联、徽标等极小空间。", intentEn: "Inline and badges in very tight space.",
    constraint: "跟随 12/13 小字号，不再放大。", constraintEn: "Pairs with 12/13 text; don't scale up.",
    code: '<SettingsIcon className="size-3" />'
  },
  {
    title: "size-4 · 16px", titleEn: "size-4 · 16px", group: "size",
    preview: <SettingsIcon className="size-4" />,
    intent: "默认尺寸，正文与按钮内的首选。", intentEn: "Default size; preferred in body text and buttons.",
    constraint: "大多数场景用这一档；按钮内交给 data-icon。", constraintEn: "Use for most cases; inside Button use data-icon.",
    code: '<SettingsIcon className="size-4" />'
  },
  {
    title: "size-5 · 20px", titleEn: "size-5 · 20px", group: "size",
    preview: <SettingsIcon className="size-5" />,
    intent: "列表项、卡片标题旁的强调图标。", intentEn: "Emphasis icons next to list items or card titles.",
    constraint: "用于需要稍强存在感的场景，不滥用。", constraintEn: "For slightly stronger presence; don't overuse.",
    code: '<SettingsIcon className="size-5" />'
  },
  {
    title: "size-6 · 24px", titleEn: "size-6 · 24px", group: "size",
    preview: <SettingsIcon className="size-6" />,
    intent: "页面级、空状态的大图标。", intentEn: "Page-level and empty-state large icons.",
    constraint: "谨慎使用，不在密集文本里塞大图标。", constraintEn: "Use sparingly; avoid large icons in dense text.",
    code: '<SettingsIcon className="size-6" />'
  }];


  return (
    <div className={docsSpacing.pageStack}>
      <section id="icon-library" className="flex flex-col gap-2">
        <PageLead
          crumb={lang === "en" ? "General / Icon" : "通用 / Icon"}
          title={lang === "en" ? "Icon" : "Icon 图标"}
          lead={lang === "en" ?
          "Icons convey actions, status, and objects. fx-ui uses Tabler line icons, imported from @/lib/icons." :
          "图标用于传达动作、状态与对象。fx-ui 统一使用 Tabler 线性图标，从 @/lib/icons 导入。"}
          actions={actions} />
        
      </section>

      <section id="icon-playground" className={docsSpacing.sectionStack}>
        <SectionLead
          title={lang === "en" ? "Playground" : "调试台"}
          description={lang === "en" ?
          "Options, intent, and constraints are read from the component playground manifest. Source rendering still uses @/lib/icons." :
          "选项、意图和约束来自组件调试台 manifest；源码侧只负责用 @/lib/icons 渲染真实图标。"} />
        <ComponentPlayground config={iconPlaygroundConfig} lang={lang} />
      </section>

      <section id="icon-overview" className={docsSpacing.sectionStack}>
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Overview" : "组件总览"}</h2>
          <p className={docsSpacing.sectionDesc}>
            {lang === "en" ?
            "A compact look at icon types and sizes, to quickly scan what icons look like." :
            "紧凑展示图标的类型与尺寸，用来快速查看图标长什么样。"}
          </p>
        </div>
        <DocSurfaceCard elevated>
          <CardContent className="grid gap-6 p-6">
            <div className="grid gap-3">
              <h3 className="text-sm font-medium text-muted-foreground">{lang === "en" ? "Monochrome line" : "单色线性"}</h3>
              <div className="flex flex-wrap items-center gap-6 text-foreground">
                <HomeIcon className="size-6" />
                <CheckCircleIcon className="size-6" />
                <BellIcon className="size-6" />
                <StarIcon className="size-6" />
                <DatabaseIcon className="size-6" />
              </div>
            </div>
            <div className="border-t border-dashed border-border" />
            <div className="grid gap-3">
              <h3 className="text-sm font-medium text-muted-foreground">{lang === "en" ? "Colored line" : "彩色线性"}</h3>
              <div className="flex flex-wrap items-center gap-6">
                <HomeIcon className="size-6 text-primary" />
                <CheckCircleIcon className="size-6 text-success" />
                <BellIcon className="size-6 text-warning" />
                <StarIcon className="size-6 text-destructive" />
                <DatabaseIcon className="size-6 text-info" />
              </div>
            </div>
            <div className="border-t border-dashed border-border" />
            <div className="grid gap-3">
              <h3 className="text-sm font-medium text-muted-foreground">{lang === "en" ? "Solid" : "面型"}</h3>
              <div className="flex flex-wrap items-center gap-6 text-primary">
                <HomeFilledIcon className="size-6" />
                <CheckCircleFilledIcon className="size-6" />
                <BellFilledIcon className="size-6" />
                <StarFilledIcon className="size-6" />
                <DatabaseFilledIcon className="size-6" />
              </div>
            </div>
            <div className="border-t border-dashed border-border" />
            <div className="grid gap-3">
              <h3 className="text-sm font-medium text-muted-foreground">{lang === "en" ? "Reverse" : "反白"}</h3>
              <div className="flex flex-wrap items-center gap-6">
                <span className="flex size-9 items-center justify-center rounded-md bg-primary"><HomeIcon className="size-5 text-primary-foreground" /></span>
                <span className="flex size-9 items-center justify-center rounded-md bg-primary"><HomeFilledIcon className="size-5 text-primary-foreground" /></span>
                <span className="flex size-9 items-center justify-center rounded-full bg-primary"><HomeIcon className="size-5 text-primary-foreground" /></span>
                <span className="flex size-9 items-center justify-center rounded-full bg-primary"><HomeFilledIcon className="size-5 text-primary-foreground" /></span>
              </div>
            </div>
            <div className="border-t border-dashed border-border" />
            <div className="grid gap-3">
              <h3 className="text-sm font-medium text-muted-foreground">{lang === "en" ? "Size" : "尺寸"}</h3>
              <div className="flex flex-wrap items-end gap-6 text-foreground">
                <SettingsIcon className="size-3" />
                <SettingsIcon className="size-3.5" />
                <SettingsIcon className="size-4" />
                <SettingsIcon className="size-5" />
                <SettingsIcon className="size-6" />
              </div>
            </div>
          </CardContent>
        </DocSurfaceCard>
      </section>

      <section id="icon-preview" className={docsSpacing.sectionStack}>
        <SectionLead title={
        lang === "en" ? "Scenario examples" : "场景示例"} description={

        lang === "en" ? "Common usages and where each fits." : "常见用法与适用场景。"} />

        
        <ScenarioTable
          lang={lang}
          elevated
          filters={iconScenarioFilters}
          rows={iconScenarios.map((s) => ({
            key: s.title,
            group: s.group,
            title: lang === "en" ? s.titleEn : s.title,
            preview: s.preview,
            intent: lang === "en" ? s.intentEn : s.intent,
            constraint: lang === "en" ? s.constraintEn : s.constraint,
            code: s.code
          }))} />
        
      </section>

      <section id="icon-usage" className={docsSpacing.sectionStack}>
        <SectionLead title={
        lang === "en" ? "Usage" : "使用方式"} description={

        lang === "en" ?
        "Already installed; import from @/lib/icons. JSX patterns are in the recommended API column above." :
        "图标库已装好，无需单独安装；统一从 @/lib/icons 导入。具体 JSX 写法见上方「场景示例」的推荐写法列。"} />

        
        <DocSurfaceCard elevated>
          <CardContent className="p-5">
          <CopyCodeBlock code={iconImportCode} label="Import" lang={lang} />
          </CardContent>
        </DocSurfaceCard>
      </section>

      <section id="icon-props" className={docsSpacing.sectionStack}>
        <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "API Props" : "API 属性"}</h2>
        <DocSurfaceTableCard elevated>
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">{lang === "en" ? "Prop" : "属性"}</TableHead>
                <TableHead>{lang === "en" ? "Type" : "类型"}</TableHead>
                <TableHead>{lang === "en" ? "Default" : "默认值"}</TableHead>
                <TableHead className="pr-4">{lang === "en" ? "Description" : "描述"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {iconPropRows.map((row) =>
              <TableRow key={row.prop}>
                  <TableCell className="pl-4 font-medium">{row.prop}</TableCell>
                  <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.type}</code></TableCell>
                  <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.defaultValue}</code></TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{lang === "en" ? row.descEn : row.desc}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DocSurfaceTableCard>
      </section>

      <section id="icon-semantic-dom" className={docsSpacing.sectionStack}>
        <SectionLead title={
        lang === "en" ? "Semantic DOM" : "语义 DOM"} description={

        lang === "en" ?
        "Icons come from Tabler. These are the semantic parts AI and engineers should understand." :
        "图标来自 Tabler。这里记录 AI 和工程师应该理解的语义部位。"} />

        
        <DocSurfaceTableCard elevated>
          <Table className="min-w-[560px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">{lang === "en" ? "Part" : "部位"}</TableHead>
                <TableHead className="pr-4">{lang === "en" ? "Description" : "说明"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {iconSemanticRows.map((row) =>
              <TableRow key={row.part}>
                  <TableCell className="pl-4 font-medium">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.part}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{lang === "en" ? row.descEn : row.desc}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DocSurfaceTableCard>
      </section>

      <section id="icon-do-dont" className={docsSpacing.sectionStack}>
        <SectionLead title={
        lang === "en" ? "Do / Don’t" : "正误示例"} description={

        lang === "en" ?
        "The most common icon mistakes for engineers and AI-generated code." :
        "工程师和 AI 生成代码最容易犯的图标错误。"} />

        
        <DocDoDont lang={lang} rows={iconDoDontRows} elevated />
      </section>
    </div>);

}

function InputPreview({ id }: {id: string;}) {
  if (id === "field") {
    return (
      <Field className="w-[220px]">
        <FieldLabel htmlFor={`input-playground-${id}`}>姓名</FieldLabel>
        <Input id={`input-playground-${id}`} placeholder="请输入姓名" />
        <FieldDescription>请填写真实姓名。</FieldDescription>
      </Field>);
  }

  if (id === "disabled") {
    return (
      <Field data-disabled className="w-[220px]">
        <FieldLabel htmlFor={`input-playground-${id}`}>姓名</FieldLabel>
        <Input id={`input-playground-${id}`} disabled placeholder="不可编辑" />
      </Field>);
  }

  if (id === "invalid") {
    return (
      <Field data-invalid className="w-[220px]">
        <FieldLabel htmlFor={`input-playground-${id}`}>邮箱</FieldLabel>
        <Input id={`input-playground-${id}`} aria-invalid placeholder="请输入邮箱" />
        <FieldError>请输入有效邮箱。</FieldError>
      </Field>);
  }

  return <Input placeholder="请输入姓名" className="max-w-[220px]" />;
}

function InputPage({ actions, lang }: {actions: React.ReactNode;lang: Lang;}) {
  const inputImportCode = `import { Input } from "@/components/ui/input"\nimport { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"`;
  const inputUsageCode = `<FieldGroup>\n  <Field>\n    <FieldLabel htmlFor="name">姓名</FieldLabel>\n    <Input id="name" placeholder="请输入姓名" />\n    <FieldDescription>请填写真实姓名。</FieldDescription>\n  </Field>\n</FieldGroup>`;

  return (
    <div className={docsSpacing.pageStack}>
      <section id="input" className="flex flex-col gap-2">
        <PageLead crumb={lang === "en" ? "Components / Input" : "组件 / 输入框"} title="Input 输入框" lead="单行文本录入控件，用于表单字段、搜索框、内联编辑等场景。" actions={actions} />
      </section>

      <section id="input-playground" className={docsSpacing.sectionStack}>
        <SectionLead title={lang === "en" ? "Playground" : "调试台"} description={lang === "en" ? "Switch existing Input scenarios and copy the matching composition." : "切换现有输入框场景，复制对应真实组合写法。"} />
        <StandardScenarioPlayground slug="input" examples={inputScenarioExamples} renderScenarioPreview={(id) => <InputPreview id={id} />} importCode={inputImportCode} lang={lang} />
      </section>

      <section id="input-overview" className={docsSpacing.sectionStack}>
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold tracking-tight">组件总览</h2>
          <p className="text-base text-muted-foreground">
            Input 是基础 shadcn 组件，统一用 <code className="rounded bg-muted px-1.5 py-0.5">data-slot="input"</code> 标记根节点，
            视觉由公司 token 注入，不需要也不应该手写覆盖样式。
          </p>
        </div>
        <DocSurfaceCard elevated>
          <CardContent className="flex flex-col gap-3 p-5">
            <FieldGroup className="max-w-sm">
              <Field>
                <FieldLabel htmlFor="input-overview-demo">姓名</FieldLabel>
                <Input id="input-overview-demo" placeholder="请输入姓名" />
                <FieldDescription>标准字段由 Field 承载结构，Input 只负责输入控件。</FieldDescription>
              </Field>
            </FieldGroup>
          </CardContent>
        </DocSurfaceCard>
      </section>

      <section id="input-preview" className={docsSpacing.sectionStack}>
        <SectionLead title={"场景示例"} description={"常见的四类用法：默认、搭配 Label、禁用、校验失败。"} />




        
        <DocSurfaceTableCard elevated>
          <Table className="min-w-[960px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[160px] pl-4">用法</TableHead>
                <TableHead className="w-[220px]">示例</TableHead>
                <TableHead className="w-[260px]">使用意图</TableHead>
                <TableHead>约束</TableHead>
                <TableHead className="w-[320px] pr-4">推荐写法</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inputScenarioExamples.map((example) =>
              <TableRow key={example.id}>
                  <TableCell className="pl-4 align-top whitespace-normal">
                    <span className="font-medium">{example.title}</span>
                  </TableCell>
                  <TableCell className="align-top">
                    {example.id === "default" ?
                  <Input placeholder="请输入姓名" className="max-w-[200px]" /> :
                  example.id === "field" ?
                  <Field className="w-[220px]">
                        <FieldLabel htmlFor={`input-demo-${example.id}`}>姓名</FieldLabel>
                        <Input id={`input-demo-${example.id}`} placeholder="请输入姓名" />
                        <FieldDescription>请填写真实姓名。</FieldDescription>
                      </Field> :
                  example.id === "disabled" ?
                  <Field data-disabled className="w-[220px]">
                        <FieldLabel htmlFor={`input-demo-${example.id}`}>姓名</FieldLabel>
                        <Input id={`input-demo-${example.id}`} disabled placeholder="不可编辑" />
                      </Field> :

                  <Field data-invalid className="w-[220px]">
                        <FieldLabel htmlFor={`input-demo-${example.id}`}>邮箱</FieldLabel>
                        <Input id={`input-demo-${example.id}`} aria-invalid placeholder="请输入邮箱" />
                        <FieldError>请输入有效邮箱。</FieldError>
                      </Field>
                  }
                  </TableCell>
                  <TableCell className="align-top whitespace-normal text-muted-foreground">
                    <p className="min-w-[180px] max-w-[260px] leading-6">{example.intent}</p>
                  </TableCell>
                  <TableCell className="align-top whitespace-normal text-muted-foreground">
                    <p className="min-w-[200px] max-w-[280px] leading-6">{example.rule}</p>
                  </TableCell>
                  <TableCell className="w-[360px] pr-4 align-top">
                    <code className="block max-w-[360px] overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-muted px-3 py-2 text-xs leading-6">
                      {example.code}
                    </code>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DocSurfaceTableCard>
      </section>

      <section id="input-usage" className={docsSpacing.sectionStack}>
        <SectionLead title={"使用方式"} description={"把 import 和 JSX 调用复制到业务页面里使用。"} />


        
        <DocSurfaceCard elevated>
          <CardContent className="p-5">
          <div className="grid gap-4">
            <CopyCodeBlock code={inputImportCode} label="Import" lang={lang} />
            <CopyCodeBlock code={inputUsageCode} label="调用" lang={lang} />
          </div>
          </CardContent>
        </DocSurfaceCard>
      </section>

      <section id="input-props" className={docsSpacing.sectionStack}>
        <h2 className="text-xl font-bold tracking-tight">API 属性</h2>
        <DocSurfaceTableCard elevated>
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">属性</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>默认值</TableHead>
                <TableHead className="pr-4">描述</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inputPropRows.map((row) =>
              <TableRow key={row.prop}>
                  <TableCell className="pl-4 font-medium">{row.prop}</TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.type}</code>
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.defaultValue}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DocSurfaceTableCard>
      </section>

      <section id="input-semantic-dom" className={docsSpacing.sectionStack}>
        <SectionLead title={"语义 DOM"} description={"Input 源码来自 shadcn/ui，保持 open-code。这里记录 AI 和工程师应该理解的语义部位。"} />




        
        <DocSurfaceTableCard elevated>
          <Table className="min-w-[560px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">部位</TableHead>
                <TableHead className="pr-4">说明</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inputSemanticDomRows.map((row) =>
              <TableRow key={row.part}>
                  <TableCell className="pl-4 font-medium">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.part}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DocSurfaceTableCard>
      </section>

      <section id="input-do-dont" className={docsSpacing.sectionStack}>
        <SectionLead title={"正误示例"} description={"工程师和 AI 生成代码最容易犯的错误，照着做即可。"} />


        
        <DocDoDont rows={inputDoDontRows} elevated />
      </section>
    </div>);

}

function SelectPreview({ id }: {id: string;}) {
  if (id === "default") {
    return (
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="请选择角色" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">管理员</SelectItem>
          <SelectItem value="member">成员</SelectItem>
        </SelectContent>
      </Select>);

  }

  if (id === "grouped") {
    return (
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="请选择国家" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>常用</SelectLabel>
            <SelectItem value="cn">中国</SelectItem>
            <SelectItem value="us">美国</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>);

  }

  if (id === "small") {
    return (
      <Select>
        <SelectTrigger size="sm" className="w-[140px]">
          <SelectValue placeholder="筛选状态" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">进行中</SelectItem>
          <SelectItem value="done">已完成</SelectItem>
        </SelectContent>
      </Select>);

  }

  return (
    <Select disabled>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="暂不可选择" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="x">选项</SelectItem>
      </SelectContent>
    </Select>);

}

function SelectPage({ actions, lang }: {actions: React.ReactNode;lang: Lang;}) {
  const selectImportCode = `import {\n  Select,\n  SelectContent,\n  SelectGroup,\n  SelectItem,\n  SelectLabel,\n  SelectTrigger,\n  SelectValue,\n} from "@/components/ui/select"`;
  const selectUsageCode = `<Select>\n  <SelectTrigger className="w-[180px]">\n    <SelectValue placeholder="请选择角色" />\n  </SelectTrigger>\n  <SelectContent>\n    <SelectItem value="admin">管理员</SelectItem>\n    <SelectItem value="member">成员</SelectItem>\n  </SelectContent>\n</Select>`;

  return (
    <div className={docsSpacing.pageStack}>
      <section id="select" className="flex flex-col gap-2">
        <PageLead crumb={lang === "en" ? "Components / Select" : "组件 / 选择器"} title="Select 选择器" lead="从一组互斥选项中选择一个值，用于表单字段、筛选条件等场景。" actions={actions} />
      </section>

      <section id="select-playground" className={docsSpacing.sectionStack}>
        <SectionLead title={lang === "en" ? "Playground" : "调试台"} description={lang === "en" ? "Switch existing Select scenarios and copy the matching composition." : "切换现有选择器场景，复制对应真实组合写法。"} />
        <StandardScenarioPlayground slug="select" examples={selectScenarioExamples} renderScenarioPreview={(id) => <SelectPreview id={id} />} importCode={selectImportCode} lang={lang} />
      </section>

      <section id="select-overview" className={docsSpacing.sectionStack}>
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold tracking-tight">组件总览</h2>
          <p className="text-base text-muted-foreground">
            Select 由 Trigger（触发器）、Content（下拉浮层）、Item（选项）等部位组合而成，
            统一用 <code className="rounded bg-muted px-1.5 py-0.5">data-slot</code> 标记各部位，视觉由公司 token 注入。
          </p>
        </div>
        <DocSurfaceCard elevated>
          <CardContent className="flex flex-col gap-3 p-5">
            <Label htmlFor="select-overview-demo">角色</Label>
            <Select>
              <SelectTrigger id="select-overview-demo" className="w-[200px]">
                <SelectValue placeholder="请选择角色" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">管理员</SelectItem>
                <SelectItem value="member">成员</SelectItem>
                <SelectItem value="guest">访客</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </DocSurfaceCard>
      </section>

      <section id="select-preview" className={docsSpacing.sectionStack}>
        <SectionLead title={"场景示例"} description={"常见的四类用法：默认、分组选项、紧凑尺寸、禁用。"} />




        
        <DocSurfaceTableCard elevated>
          <Table className="min-w-[1040px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[160px] pl-4">用法</TableHead>
                <TableHead className="w-[220px]">示例</TableHead>
                <TableHead className="w-[260px]">使用意图</TableHead>
                <TableHead>约束</TableHead>
                <TableHead className="w-[340px] pr-4">推荐写法</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectScenarioExamples.map((example) =>
              <TableRow key={example.id}>
                  <TableCell className="pl-4 align-top whitespace-normal">
                    <span className="font-medium">{example.title}</span>
                  </TableCell>
                  <TableCell className="align-top">
                    <SelectPreview id={example.id} />
                  </TableCell>
                  <TableCell className="align-top whitespace-normal text-muted-foreground">
                    <p className="min-w-[180px] max-w-[260px] leading-6">{example.intent}</p>
                  </TableCell>
                  <TableCell className="align-top whitespace-normal text-muted-foreground">
                    <p className="min-w-[200px] max-w-[280px] leading-6">{example.rule}</p>
                  </TableCell>
                  <TableCell className="w-[360px] pr-4 align-top">
                    <code className="block max-w-[360px] overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-muted px-3 py-2 text-xs leading-6">
                      {example.code}
                    </code>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DocSurfaceTableCard>
      </section>

      <section id="select-usage" className={docsSpacing.sectionStack}>
        <SectionLead title={"使用方式"} description={"把 import 和 JSX 调用复制到业务页面里使用。"} />


        
        <DocSurfaceCard elevated>
          <CardContent className="p-5">
          <div className="grid gap-4">
            <CopyCodeBlock code={selectImportCode} label="Import" lang={lang} />
            <CopyCodeBlock code={selectUsageCode} label="调用" lang={lang} />
          </div>
          </CardContent>
        </DocSurfaceCard>
      </section>

      <section id="select-props" className={docsSpacing.sectionStack}>
        <h2 className="text-xl font-bold tracking-tight">API 属性</h2>
        <DocSurfaceTableCard elevated>
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">属性</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>默认值</TableHead>
                <TableHead className="pr-4">描述</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectPropRows.map((row) =>
              <TableRow key={row.prop}>
                  <TableCell className="pl-4 font-medium">{row.prop}</TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.type}</code>
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.defaultValue}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DocSurfaceTableCard>
      </section>

      <section id="select-semantic-dom" className={docsSpacing.sectionStack}>
        <SectionLead title={"语义 DOM"} description={"Select 源码来自 shadcn/ui，保持 open-code。这里记录 AI 和工程师应该理解的语义部位。"} />




        
        <DocSurfaceTableCard elevated>
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">部位</TableHead>
                <TableHead className="pr-4">说明</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectSemanticDomRows.map((row) =>
              <TableRow key={row.part}>
                  <TableCell className="pl-4 font-medium">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.part}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DocSurfaceTableCard>
      </section>

      <section id="select-do-dont" className={docsSpacing.sectionStack}>
        <SectionLead title={"正误示例"} description={"工程师和 AI 生成代码最容易犯的错误，照着做即可。"} />


        
        <DocDoDont rows={selectDoDontRows} elevated />
      </section>
    </div>);

}

function CheckboxPreview({ id }: {id: string;}) {
  const [checked, setChecked] = useState(false);

  if (id === "default") {
    return (
      <div className="flex items-center gap-2">
        <Checkbox id="checkbox-demo-default" />
        <Label htmlFor="checkbox-demo-default">同意条款</Label>
      </div>);

  }

  if (id === "checked") {
    return (
      <div className="flex items-center gap-2">
        <Checkbox id="checkbox-demo-checked" checked={checked} onCheckedChange={(value) => setChecked(value === true)} />
        <Label htmlFor="checkbox-demo-checked">{checked ? "已选中" : "未选中"}</Label>
      </div>);

  }

  if (id === "disabled") {
    return (
      <div className="flex items-center gap-2">
        <Checkbox id="checkbox-demo-disabled" disabled />
        <Label htmlFor="checkbox-demo-disabled">不可编辑</Label>
      </div>);

  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Checkbox aria-label="选择第 1 行" />
        <span className="text-sm text-muted-foreground">订单 #10231</span>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox aria-label="选择第 2 行" />
        <span className="text-sm text-muted-foreground">订单 #10232</span>
      </div>
    </div>);

}

function CheckboxPage({ actions, lang }: {actions: React.ReactNode;lang: Lang;}) {
  const checkboxImportCode = `import { Checkbox } from "@/components/ui/checkbox"\nimport { Label } from "@/components/ui/label"`;
  const checkboxUsageCode = `<div className="flex items-center gap-2">\n  <Checkbox id="agree" />\n  <Label htmlFor="agree">我已阅读并同意服务条款</Label>\n</div>`;

  return (
    <div className={docsSpacing.pageStack}>
      <section id="checkbox" className="flex flex-col gap-2">
        <PageLead crumb={lang === "en" ? "Components / Checkbox" : "组件 / 复选框"} title="Checkbox 复选框" lead="表达单个布尔选项的勾选，常用于条款确认、设置项、列表批量选择。" actions={actions} />
      </section>

      <section id="checkbox-playground" className={docsSpacing.sectionStack}>
        <SectionLead title={lang === "en" ? "Playground" : "调试台"} description={lang === "en" ? "Switch existing Checkbox scenarios and copy the matching composition." : "切换现有复选框场景，复制对应真实组合写法。"} />
        <StandardScenarioPlayground slug="checkbox" examples={checkboxScenarioExamples} renderScenarioPreview={(id) => <CheckboxPreview id={id} />} importCode={checkboxImportCode} lang={lang} />
      </section>

      <section id="checkbox-overview" className={docsSpacing.sectionStack}>
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold tracking-tight">组件总览</h2>
          <p className="text-base text-muted-foreground">
            Checkbox 由根节点和选中态指示图标组成，统一用 <code className="rounded bg-muted px-1.5 py-0.5">data-slot</code> 标记，
            视觉由公司 token 注入，选中态颜色取自 primary。
          </p>
        </div>
        <DocSurfaceCard elevated>
          <CardContent className="flex flex-col gap-3 p-5">
            <div className="flex items-center gap-2">
              <Checkbox id="checkbox-overview-demo" />
              <Label htmlFor="checkbox-overview-demo">我已阅读并同意服务条款</Label>
            </div>
          </CardContent>
        </DocSurfaceCard>
      </section>

      <section id="checkbox-preview" className={docsSpacing.sectionStack}>
        <SectionLead title={"场景示例"} description={"常见的四类用法：默认、受控选中态、禁用、列表内勾选。"} />




        
        <DocSurfaceTableCard elevated>
          <Table className="min-w-[1040px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[160px] pl-4">用法</TableHead>
                <TableHead className="w-[220px]">示例</TableHead>
                <TableHead className="w-[260px]">使用意图</TableHead>
                <TableHead>约束</TableHead>
                <TableHead className="w-[340px] pr-4">推荐写法</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {checkboxScenarioExamples.map((example) =>
              <TableRow key={example.id}>
                  <TableCell className="pl-4 align-top whitespace-normal">
                    <span className="font-medium">{example.title}</span>
                  </TableCell>
                  <TableCell className="align-top">
                    <CheckboxPreview id={example.id} />
                  </TableCell>
                  <TableCell className="align-top whitespace-normal text-muted-foreground">
                    <p className="min-w-[180px] max-w-[260px] leading-6">{example.intent}</p>
                  </TableCell>
                  <TableCell className="align-top whitespace-normal text-muted-foreground">
                    <p className="min-w-[200px] max-w-[280px] leading-6">{example.rule}</p>
                  </TableCell>
                  <TableCell className="w-[360px] pr-4 align-top">
                    <code className="block max-w-[360px] overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-muted px-3 py-2 text-xs leading-6">
                      {example.code}
                    </code>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DocSurfaceTableCard>
      </section>

      <section id="checkbox-usage" className={docsSpacing.sectionStack}>
        <SectionLead title={"使用方式"} description={"把 import 和 JSX 调用复制到业务页面里使用。"} />


        
        <DocSurfaceCard elevated>
          <CardContent className="p-5">
          <div className="grid gap-4">
            <CopyCodeBlock code={checkboxImportCode} label="Import" lang={lang} />
            <CopyCodeBlock code={checkboxUsageCode} label="调用" lang={lang} />
          </div>
          </CardContent>
        </DocSurfaceCard>
      </section>

      <section id="checkbox-props" className={docsSpacing.sectionStack}>
        <h2 className="text-xl font-bold tracking-tight">API 属性</h2>
        <DocSurfaceTableCard elevated>
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">属性</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>默认值</TableHead>
                <TableHead className="pr-4">描述</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {checkboxPropRows.map((row) =>
              <TableRow key={row.prop}>
                  <TableCell className="pl-4 font-medium">{row.prop}</TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.type}</code>
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.defaultValue}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DocSurfaceTableCard>
      </section>

      <section id="checkbox-semantic-dom" className={docsSpacing.sectionStack}>
        <SectionLead title={"语义 DOM"} description={"Checkbox 源码来自 shadcn/ui，保持 open-code。这里记录 AI 和工程师应该理解的语义部位。"} />




        
        <DocSurfaceTableCard elevated>
          <Table className="min-w-[560px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">部位</TableHead>
                <TableHead className="pr-4">说明</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {checkboxSemanticDomRows.map((row) =>
              <TableRow key={row.part}>
                  <TableCell className="pl-4 font-medium">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.part}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DocSurfaceTableCard>
      </section>

      <section id="checkbox-do-dont" className={docsSpacing.sectionStack}>
        <SectionLead title={"正误示例"} description={"工程师和 AI 生成代码最容易犯的错误，照着做即可。"} />


        
        <DocDoDont rows={checkboxDoDontRows} elevated />
      </section>
    </div>);

}

function RadioGroupPage({ actions, lang }: {actions: React.ReactNode;lang: Lang;}) {
  const [value, setValue] = useState("crm");
  const radioGroupImportCode = `import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"\nimport { Label } from "@/components/ui/label"`;
  const radioGroupUsageCode = `<RadioGroup value={value} onValueChange={setValue}>\n  <div className="flex items-center gap-2">\n    <RadioGroupItem id="crm" value="crm" />\n    <Label htmlFor="crm">CRM</Label>\n  </div>\n  <div className="flex items-center gap-2">\n    <RadioGroupItem id="bi" value="bi" />\n    <Label htmlFor="bi">BI</Label>\n  </div>\n</RadioGroup>`;
  const radioGroupScenarioExamples = [
    {
      id: "default",
      title: "基础单选",
      intent: "用于一组选项中只能选择一个的表单字段。",
      rule: "RadioGroup 负责 value / onValueChange，RadioGroupItem 必须有稳定 value。",
      code: radioGroupUsageCode
    },
    {
      id: "disabled",
      title: "含禁用项",
      intent: "用于某些选项当前不可选但仍需展示的场景。",
      rule: "禁用写在 RadioGroupItem 上，不在调用处手写透明度或禁用样式。",
      code: `<RadioGroup defaultValue="crm">\n  <RadioGroupItem id="crm" value="crm" />\n  <RadioGroupItem id="disabled" value="disabled" disabled />\n</RadioGroup>`
    }
  ];

  return (
    <div className={docsSpacing.pageStack}>
      <section id="radio-group" className="flex flex-col gap-2">
        <PageLead crumb={lang === "en" ? "Components / Radio Group" : "组件 / 单选组"} title="RadioGroup 单选组" lead="表达一组选项中只能选择一个，适用于表单单选、设置项和表格单选列。" actions={actions} />
      </section>

      <section id="radio-group-playground" className={docsSpacing.sectionStack}>
        <SectionLead title={lang === "en" ? "Playground" : "调试台"} description={lang === "en" ? "Switch existing RadioGroup scenarios and copy the matching composition." : "切换现有单选组场景，复制对应真实组合写法。"} />
        <StandardScenarioPlayground
          slug="radio-group"
          examples={radioGroupScenarioExamples}
          renderScenarioPreview={(id) =>
            id === "disabled" ?
            <RadioGroup defaultValue="crm">
              <div className="flex items-center gap-2">
                <RadioGroupItem id="radio-playground-crm" value="crm" />
                <Label htmlFor="radio-playground-crm">CRM</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem id="radio-playground-disabled" value="disabled" disabled />
                <Label htmlFor="radio-playground-disabled" className="text-muted-foreground">不可选择</Label>
              </div>
            </RadioGroup> :
            <RadioGroup defaultValue="crm">
              <div className="flex items-center gap-2">
                <RadioGroupItem id="radio-playground-basic-crm" value="crm" />
                <Label htmlFor="radio-playground-basic-crm">CRM</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem id="radio-playground-basic-bi" value="bi" />
                <Label htmlFor="radio-playground-basic-bi">BI</Label>
              </div>
            </RadioGroup>
          }
          importCode={radioGroupImportCode}
          lang={lang}
        />
      </section>

      <section id="radio-group-overview" className={docsSpacing.sectionStack}>
        <SectionLead title="组件总览" description="RadioGroup 负责互斥选择状态，RadioGroupItem 负责单个选项的交互和选中态。" />
        <DocSurfaceCard elevated>
          <CardContent className="p-5">
            <RadioGroup value={value} onValueChange={setValue}>
              <div className="flex items-center gap-2">
                <RadioGroupItem id="radio-crm" value="crm" />
                <Label htmlFor="radio-crm">CRM</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem id="radio-bi" value="bi" />
                <Label htmlFor="radio-bi">BI</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem id="radio-disabled" value="disabled" disabled />
                <Label htmlFor="radio-disabled" className="text-muted-foreground">不可选择</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </DocSurfaceCard>
      </section>

      <section id="radio-group-usage" className={docsSpacing.sectionStack}>
        <SectionLead title="使用方式" description="把 import 和完整组装写法复制到业务页面里使用。" />
        <DocSurfaceCard elevated>
          <CardContent className="grid gap-4 p-5">
            <CopyCodeBlock code={radioGroupImportCode} label="Import" lang={lang} />
            <CopyCodeBlock code={radioGroupUsageCode} label="调用" lang={lang} />
          </CardContent>
        </DocSurfaceCard>
      </section>

      <section id="radio-group-props" className={docsSpacing.sectionStack}>
        <SectionLead title="API 属性" />
        <DocSurfaceTableCard elevated>
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">属性</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>默认值</TableHead>
                <TableHead className="pr-4">描述</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {radioGroupPropRows.map((row) =>
              <TableRow key={row.prop}>
                  <TableCell className="pl-4 font-medium">{row.prop}</TableCell>
                  <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.type}</code></TableCell>
                  <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.defaultValue}</code></TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DocSurfaceTableCard>
      </section>

      <section id="radio-group-semantic-dom" className={docsSpacing.sectionStack}>
        <SectionLead title="语义 DOM" description="RadioGroup 源码来自 shadcn/ui，保持 open-code。这里记录 AI 和工程师应该理解的语义部位。" />
        <DocSurfaceTableCard elevated>
          <Table className="min-w-[560px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">部位</TableHead>
                <TableHead className="pr-4">说明</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {radioGroupSemanticDomRows.map((row) =>
              <TableRow key={row.part}>
                  <TableCell className="pl-4 font-medium"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.part}</code></TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DocSurfaceTableCard>
      </section>

      <section id="radio-group-do-dont" className={docsSpacing.sectionStack}>
        <SectionLead title="正误示例" description="单选控件必须使用组件能力，不在业务处手写原生 radio 外观。" />
        <DocDoDont rows={radioGroupDoDontRows} elevated />
      </section>
    </div>);

}

function SwitchPreview({ id }: {id: string;}) {
  const [enabled, setEnabled] = useState(false);

  if (id === "default") {
    return (
      <div className="flex items-center gap-2">
        <Switch id="switch-demo-default" />
        <Label htmlFor="switch-demo-default">接收消息通知</Label>
      </div>);

  }

  if (id === "checked") {
    return (
      <div className="flex items-center gap-2">
        <Switch id="switch-demo-checked" checked={enabled} onCheckedChange={setEnabled} />
        <Label htmlFor="switch-demo-checked">{enabled ? "已开启" : "已关闭"}</Label>
      </div>);

  }

  if (id === "small") {
    return (
      <div className="flex items-center gap-2">
        <Switch id="switch-demo-small" size="sm" />
        <Label htmlFor="switch-demo-small">紧凑尺寸</Label>
      </div>);

  }

  return (
    <div className="flex items-center gap-2">
      <Switch id="switch-demo-disabled" disabled />
      <Label htmlFor="switch-demo-disabled">该选项不可更改</Label>
    </div>);

}

function SwitchPage({ actions, lang }: {actions: React.ReactNode;lang: Lang;}) {
  const switchImportCode = `import { Switch } from "@/components/ui/switch"\nimport { Label } from "@/components/ui/label"`;
  const switchUsageCode = `<div className="flex items-center gap-2">\n  <Switch id="notify" />\n  <Label htmlFor="notify">接收消息通知</Label>\n</div>`;

  return (
    <div className={docsSpacing.pageStack}>
      <section id="switch" className="flex flex-col gap-2">
        <PageLead crumb={lang === "en" ? "Components / Switch" : "组件 / 开关"} title="Switch 开关" lead="表达立即生效的二元设置项，切换后无需额外提交，常用于偏好设置、功能开关。" actions={actions} />
      </section>

      <section id="switch-playground" className={docsSpacing.sectionStack}>
        <SectionLead title={lang === "en" ? "Playground" : "调试台"} description={lang === "en" ? "Switch existing Switch scenarios and copy the matching composition." : "切换现有开关场景，复制对应真实组合写法。"} />
        <StandardScenarioPlayground slug="switch" examples={switchScenarioExamples} renderScenarioPreview={(id) => <SwitchPreview id={id} />} importCode={switchImportCode} lang={lang} />
      </section>

      <section id="switch-overview" className={docsSpacing.sectionStack}>
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold tracking-tight">组件总览</h2>
          <p className="text-base text-muted-foreground">
            Switch 由轨道根节点和可滑动滑块组成，统一用 <code className="rounded bg-muted px-1.5 py-0.5">data-slot</code> 标记，
            开启态轨道颜色取自 primary。
          </p>
        </div>
        <DocSurfaceCard elevated>
          <CardContent className="flex flex-col gap-3 p-5">
            <div className="flex items-center gap-2">
              <Switch id="switch-overview-demo" />
              <Label htmlFor="switch-overview-demo">接收消息通知</Label>
            </div>
          </CardContent>
        </DocSurfaceCard>
      </section>

      <section id="switch-preview" className={docsSpacing.sectionStack}>
        <SectionLead title={"场景示例"} description={"常见的四类用法：默认、受控状态、紧凑尺寸、禁用。"} />




        
        <DocSurfaceTableCard elevated>
          <Table className="min-w-[1040px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[160px] pl-4">用法</TableHead>
                <TableHead className="w-[220px]">示例</TableHead>
                <TableHead className="w-[260px]">使用意图</TableHead>
                <TableHead>约束</TableHead>
                <TableHead className="w-[340px] pr-4">推荐写法</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {switchScenarioExamples.map((example) =>
              <TableRow key={example.id}>
                  <TableCell className="pl-4 align-top whitespace-normal">
                    <span className="font-medium">{example.title}</span>
                  </TableCell>
                  <TableCell className="align-top">
                    <SwitchPreview id={example.id} />
                  </TableCell>
                  <TableCell className="align-top whitespace-normal text-muted-foreground">
                    <p className="min-w-[180px] max-w-[260px] leading-6">{example.intent}</p>
                  </TableCell>
                  <TableCell className="align-top whitespace-normal text-muted-foreground">
                    <p className="min-w-[200px] max-w-[280px] leading-6">{example.rule}</p>
                  </TableCell>
                  <TableCell className="w-[360px] pr-4 align-top">
                    <code className="block max-w-[360px] overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-muted px-3 py-2 text-xs leading-6">
                      {example.code}
                    </code>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DocSurfaceTableCard>
      </section>

      <section id="switch-usage" className={docsSpacing.sectionStack}>
        <SectionLead title={"使用方式"} description={"把 import 和 JSX 调用复制到业务页面里使用。"} />


        
        <DocSurfaceCard elevated>
          <CardContent className="p-5">
          <div className="grid gap-4">
            <CopyCodeBlock code={switchImportCode} label="Import" lang={lang} />
            <CopyCodeBlock code={switchUsageCode} label="调用" lang={lang} />
          </div>
          </CardContent>
        </DocSurfaceCard>
      </section>

      <section id="switch-props" className={docsSpacing.sectionStack}>
        <h2 className="text-xl font-bold tracking-tight">API 属性</h2>
        <DocSurfaceTableCard elevated>
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">属性</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>默认值</TableHead>
                <TableHead className="pr-4">描述</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {switchPropRows.map((row) =>
              <TableRow key={row.prop}>
                  <TableCell className="pl-4 font-medium">{row.prop}</TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.type}</code>
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.defaultValue}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DocSurfaceTableCard>
      </section>

      <section id="switch-semantic-dom" className={docsSpacing.sectionStack}>
        <SectionLead title={"语义 DOM"} description={"Switch 源码来自 shadcn/ui，保持 open-code。这里记录 AI 和工程师应该理解的语义部位。"} />




        
        <DocSurfaceTableCard elevated>
          <Table className="min-w-[560px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">部位</TableHead>
                <TableHead className="pr-4">说明</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {switchSemanticDomRows.map((row) =>
              <TableRow key={row.part}>
                  <TableCell className="pl-4 font-medium">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.part}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DocSurfaceTableCard>
      </section>

      <section id="switch-do-dont" className={docsSpacing.sectionStack}>
        <SectionLead title={"正误示例"} description={"工程师和 AI 生成代码最容易犯的错误，照着做即可。"} />


        
        <DocDoDont rows={switchDoDontRows} elevated />
      </section>
    </div>);

}

function TextareaPreview({ id }: {id: string;}) {
  if (id === "default") {
    return (
      <div className="grid w-[220px] gap-2">
        <Label htmlFor={`textarea-demo-${id}`}>个人简介</Label>
        <Textarea id={`textarea-demo-${id}`} placeholder="简单介绍一下自己" />
      </div>);

  }

  if (id === "disabled") {
    return <Textarea disabled placeholder="不可编辑" className="w-[220px]" />;
  }

  return <Textarea aria-invalid placeholder="请输入至少 10 个字" className="w-[220px]" />;
}

function TextareaPage({ actions, lang }: {actions: React.ReactNode;lang: Lang;}) {
  const textareaImportCode = `import { Textarea } from "@/components/ui/textarea"\nimport { Label } from "@/components/ui/label"`;
  const textareaUsageCode = `<div className="grid gap-2">\n  <Label htmlFor="bio">个人简介</Label>\n  <Textarea id="bio" placeholder="简单介绍一下自己" />\n</div>`;

  return (
    <div className={docsSpacing.pageStack}>
      <section id="textarea" className="flex flex-col gap-2">
        <PageLead crumb={lang === "en" ? "Components / Textarea" : "组件 / 多行输入"} title="Textarea 多行输入" lead="录入较长文本，如备注、描述、反馈内容，高度随内容自适应。" actions={actions} />
      </section>

      <section id="textarea-playground" className={docsSpacing.sectionStack}>
        <SectionLead title={lang === "en" ? "Playground" : "调试台"} description={lang === "en" ? "Switch existing Textarea scenarios and copy the matching composition." : "切换现有多行输入场景，复制对应真实组合写法。"} />
        <StandardScenarioPlayground slug="textarea" examples={textareaScenarioExamples} renderScenarioPreview={(id) => <TextareaPreview id={id} />} importCode={textareaImportCode} lang={lang} />
      </section>

      <section id="textarea-overview" className={docsSpacing.sectionStack}>
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold tracking-tight">组件总览</h2>
          <p className="text-base text-muted-foreground">
            Textarea 是基础 shadcn 组件，统一用 <code className="rounded bg-muted px-1.5 py-0.5">data-slot="textarea"</code> 标记根节点，
            高度通过 field-sizing-content 自适应内容，不需要手写 rows 撑高度。
          </p>
        </div>
        <DocSurfaceCard elevated>
          <CardContent className="flex flex-col gap-3 p-5">
            <Label htmlFor="textarea-overview-demo">个人简介</Label>
            <Textarea id="textarea-overview-demo" placeholder="简单介绍一下自己" className="max-w-sm" />
          </CardContent>
        </DocSurfaceCard>
      </section>

      <section id="textarea-preview" className={docsSpacing.sectionStack}>
        <SectionLead title={"场景示例"} description={"常见的三类用法：默认、禁用、校验失败。"} />


        
        <DocSurfaceTableCard elevated>
          <Table className="min-w-[960px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[160px] pl-4">用法</TableHead>
                <TableHead className="w-[240px]">示例</TableHead>
                <TableHead className="w-[260px]">使用意图</TableHead>
                <TableHead>约束</TableHead>
                <TableHead className="w-[320px] pr-4">推荐写法</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {textareaScenarioExamples.map((example) =>
              <TableRow key={example.id}>
                  <TableCell className="pl-4 align-top whitespace-normal">
                    <span className="font-medium">{example.title}</span>
                  </TableCell>
                  <TableCell className="align-top">
                    <TextareaPreview id={example.id} />
                  </TableCell>
                  <TableCell className="align-top whitespace-normal text-muted-foreground">
                    <p className="min-w-[180px] max-w-[260px] leading-6">{example.intent}</p>
                  </TableCell>
                  <TableCell className="align-top whitespace-normal text-muted-foreground">
                    <p className="min-w-[200px] max-w-[280px] leading-6">{example.rule}</p>
                  </TableCell>
                  <TableCell className="w-[360px] pr-4 align-top">
                    <code className="block max-w-[360px] overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-muted px-3 py-2 text-xs leading-6">
                      {example.code}
                    </code>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DocSurfaceTableCard>
      </section>

      <section id="textarea-usage" className={docsSpacing.sectionStack}>
        <SectionLead title={"使用方式"} description={"把 import 和 JSX 调用复制到业务页面里使用。"} />


        
        <DocSurfaceCard elevated>
          <CardContent className="p-5">
          <div className="grid gap-4">
            <CopyCodeBlock code={textareaImportCode} label="Import" lang={lang} />
            <CopyCodeBlock code={textareaUsageCode} label="调用" lang={lang} />
          </div>
          </CardContent>
        </DocSurfaceCard>
      </section>

      <section id="textarea-props" className={docsSpacing.sectionStack}>
        <h2 className="text-xl font-bold tracking-tight">API 属性</h2>
        <DocSurfaceTableCard elevated>
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">属性</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>默认值</TableHead>
                <TableHead className="pr-4">描述</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {textareaPropRows.map((row) =>
              <TableRow key={row.prop}>
                  <TableCell className="pl-4 font-medium">{row.prop}</TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.type}</code>
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.defaultValue}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DocSurfaceTableCard>
      </section>

      <section id="textarea-semantic-dom" className={docsSpacing.sectionStack}>
        <SectionLead title={"语义 DOM"} description={"Textarea 源码来自 shadcn/ui，保持 open-code。这里记录 AI 和工程师应该理解的语义部位。"} />




        
        <DocSurfaceTableCard elevated>
          <Table className="min-w-[560px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">部位</TableHead>
                <TableHead className="pr-4">说明</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {textareaSemanticDomRows.map((row) =>
              <TableRow key={row.part}>
                  <TableCell className="pl-4 font-medium">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.part}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DocSurfaceTableCard>
      </section>

      <section id="textarea-do-dont" className={docsSpacing.sectionStack}>
        <SectionLead title={"正误示例"} description={"工程师和 AI 生成代码最容易犯的错误，照着做即可。"} />


        
        <DocDoDont rows={textareaDoDontRows} elevated />
      </section>
    </div>);

}

function CommandDemo() {
  const [open, setOpen] = useState(false);
  const items: CommandItem[] = [
  { id: "1", label: "新建项目", group: "操作", onSelect: () => {} },
  { id: "2", label: "导入数据", group: "操作", onSelect: () => {} },
  { id: "3", label: "客户列表", group: "页面", onSelect: () => {} },
  { id: "4", label: "数据看板", group: "页面", onSelect: () => {} },
  { id: "5", label: "账号设置", group: "页面", keywords: "setting profile", onSelect: () => {} }];

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <SearchIcon data-icon="inline-start" /> 打开命令面板（或 ⌘K）
      </Button>
      <CommandPalette open={open} onOpenChange={setOpen} items={items} placeholder="搜索操作或页面…" />
    </>);

}
function CommandPage({ actions, lang }: {actions: React.ReactNode;lang: Lang;}) {
  return (
    <StandardDocPage
      slug="command"
      title="Command 命令面板"
      lead="⌘K 命令面板：模糊搜索 + 键盘导航，用于全站快速跳转或执行命令。自建轻量实现，不引 cmdk/Radix。"
      overview={null}
      overviewMatrix={<div className="flex items-center gap-3 rounded-xl bg-card p-6 ring-1 ring-border-subtle shadow-l1"><CommandDemo /></div>}
      scenarioExamples={commandScenarioExamples}
      renderScenarioPreview={() => <CommandDemo />}
      importCode={`import { CommandPalette, type CommandItem } from "@/components/ui/command"`}
      usageCode={`const [open, setOpen] = useState(false)\n\nconst items: CommandItem[] = pages.map((p) => ({\n  id: p.href, label: p.label, group: p.group,\n  onSelect: () => { window.location.hash = p.href },\n}))\n\n<CommandPalette open={open} onOpenChange={setOpen} items={items} />`}
      propRows={commandPropRows}
      semanticDomRows={commandSemanticDomRows}
      doDontRows={commandDoDontRows}
      actions={actions}
      lang={lang} />);


}

function PaginationPreview({ total, pageSize = 10, siblingCount, showTotal, initial = 1 }: {total: number;pageSize?: number;siblingCount?: number;showTotal?: boolean;initial?: number;}) {
  const [page, setPage] = useState(initial);
  return <Pagination page={page} total={total} pageSize={pageSize} siblingCount={siblingCount} showTotal={showTotal} onPageChange={setPage} className="justify-start" />;
}

function PaginationPage({ actions, lang }: {actions: React.ReactNode;lang: Lang;}) {
  return (
    <StandardDocPage
      slug="pagination"
      title="Pagination 分页器"
      lead="分页浏览大量数据，提供页码、上一页/下一页与省略号；页码过多自动收起。"
      overview={<PaginationPreview total={48} />}
      scenarioExamples={paginationScenarioExamples}
      renderScenarioPreview={(id) =>
      id === "ellipsis" ?
      <PaginationPreview total={1930} siblingCount={1} initial={6} /> :
      id === "no-total" ?
      <PaginationPreview total={48} showTotal={false} /> :

      <PaginationPreview total={48} />

      }
      importCode={`import { Pagination } from "@/components/ui/pagination"`}
      usageCode={`const [page, setPage] = useState(1)\n\n<Pagination\n  page={page}\n  total={193}\n  pageSize={10}\n  onPageChange={setPage}\n/>`}
      propRows={paginationPropRows}
      semanticDomRows={paginationSemanticDomRows}
      doDontRows={paginationDoDontRows}
      actions={actions}
      lang={lang} />);


}

// 顶栏演示：受控持有当前应用 / 搜索词 / 搜索范围，工具图标带角标与 Tooltip
const topBarApps = [
{ key: "crm", label: "CRM" },
{ key: "marketing", label: "营销通" },
{ key: "service", label: "服务通" },
{ key: "bi", label: "BI 智能分析" }];

const topBarScopes = [
{ key: "all", label: "全部" },
{ key: "cust", label: "客户" },
{ key: "contact", label: "联系人" },
{ key: "opp", label: "商机" }];

function TopBarPreview({ showScope = true }: {showScope?: boolean;}) {
  const [app, setApp] = useState("crm");
  const [q, setQ] = useState("");
  const [scope, setScope] = useState("all");
  // 品牌 logo：放在 public/fx-logo.(svg|png)，换成自己的图标即可（这里用 Figma 导出的吉祥物）
  const logo =
  <img src="/LOGO.svg" alt="纷享销客" className="size-5 shrink-0 object-contain" />;

  return (
    <TooltipProvider>
      <div className="w-full bg-background">
        <TopBar>
          <TopBarBrand logo={logo} name="北京易动纷享科技有限责任公司" />
          <TopBarDivider />
          <TopBarApps current={topBarApps.find((a) => a.key === app)!.label} apps={topBarApps} onSelect={setApp} />
          <TopBarSearch
            value={q}
            onValueChange={setQ}
            scope={showScope ? scope : undefined}
            scopes={showScope ? topBarScopes : undefined}
            onScopeChange={setScope}
            placeholder="搜索" />
          
          <TopBarActions>
            <TopBarIconButton icon={<MessageCircleIcon />} label="企信" count={3} />
            <TopBarIconButton icon={<BellIcon />} label="CRM提醒" dot />
            <TopBarIconButton icon={<CheckCircleIcon />} label="待办" />
            <TopBarIconButton icon={<InboxIcon />} label="草稿箱" />
            <TopBarIconButton icon={<HelpIcon />} label="帮助" />
          </TopBarActions>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
              <Avatar className="size-8 cursor-pointer outline-none transition-opacity hover:opacity-90 focus-visible:ring-3 focus-visible:ring-ring/50">
                  <AvatarImage src="/avatars/01.jpg" alt="李明" />
                  <AvatarFallback colorful>李</AvatarFallback>
                </Avatar>
              } />
            
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem>个人中心</DropdownMenuItem>
              <DropdownMenuItem>账号设置</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">退出登录</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TopBar>
      </div>
    </TooltipProvider>);

}
function TopBarPage({ actions, lang }: {actions: React.ReactNode;lang: Lang;}) {
  return (
    <StandardDocPage
      slug="top-bar"
      title="顶栏"
      lead="全局应用顶栏：品牌、应用切换、全局搜索、工具图标与头像，48px 白底两端对齐。"
      overview={<TopBarPreview />}
      scenarioExamples={topBarScenarioExamples}
      scenarioLayout="stack"
      renderScenarioPreview={(id) => id === "search-scope" ? <TopBarPreview /> : <TopBarPreview showScope={false} />}
      importCode={`import {\n  TopBar, TopBarBrand, TopBarDivider,\n  TopBarApps, TopBarSearch,\n  TopBarActions, TopBarIconButton,\n} from "@/components/fx/top-bar"`}
      usageCode={`const [app, setApp] = useState("crm")\nconst [q, setQ] = useState("")\nconst [scope, setScope] = useState("all")\n\n<TopBar>\n  <TopBarBrand logo={<Logo />} name="纷享销客" />\n  <TopBarDivider />\n  <TopBarApps current="CRM" apps={apps} onSelect={setApp} />\n  <TopBarSearch value={q} onValueChange={setQ} scope={scope} scopes={scopes} onScopeChange={setScope} />\n  <TopBarActions>\n    <TopBarIconButton icon={<MessageCircleIcon />} label="消息" count={3} />\n    <TopBarIconButton icon={<BellIcon />} label="通知" dot />\n  </TopBarActions>\n  <Avatar>…</Avatar>\n</TopBar>`}
      propRows={topBarPropRows}
      semanticDomRows={topBarSemanticDomRows}
      doDontRows={topBarDoDontRows}
      actions={actions}
      lang={lang} />);


}

// 表格操作列纯图标按钮：无底色（variant=plain）、按语义分色（tone）、hover 只变色 + Tooltip + aria-label
function IconAction({ icon, label, tone = "default" }: {icon: React.ReactNode;label: string;tone?: "default" | "primary" | "danger";}) {
  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="plain" tone={tone} size="icon-sm" aria-label={label}>{icon}</Button>} />
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>);

}

function TablePreviewWithPagination({
  children,
  page = 1,
  total = tableBizRows.length,
  pageSize = TABLE_PAGE_SIZE,
  status = "default",
  onPageChange
}: {
  children: React.ReactNode
  page?: number
  total?: number
  pageSize?: number
  status?: "default" | "loading" | "empty"
  onPageChange?: (page: number) => void
}) {
  const showPagination = status === "loading" || total > 0;

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        {children}
      </div>
      {showPagination ? (
        <div className="border-t border-border-subtle">
          <Pagination page={page} total={total} pageSize={pageSize} showTotal={false} onPageChange={onPageChange} className="px-2 py-3" />
        </div>
      ) : null}
    </div>);
}

// 客户级别 Tag：统一走 color 这条分类标签轴，中性客户也用灰色软标签，避免和 secondary 状态标签混用。
function LevelTag({ level, color }: {level: string;color: "amber" | "green" | "gray";}) {
  return <Tag color={color}>{level}</Tag>;
}

// 业务表演示数据（对齐公司 Figma：链接首列 / 头像 / 级别 Tag / 金额右对齐 / 操作）
const tableBizRows = [
{ id: 1, name: "三川德众血浆采集有限公司", owner: "陈昊", avatar: "/avatars/01.jpg", level: "VIP客户", levelColor: "amber" as const, tags: [{ label: "高意向", color: "purple" as const }, { label: "华东区", color: "blue" as const }], dept: "销售部", product: "罗技 G604 LIGHTSPEED 无线游戏鼠…", amount: 1530.17, date: "2023-12-17" },
{ id: 2, name: "邱特云顶生态环境技术有限公司", owner: "林夕", avatar: "/avatars/02.jpg", level: "重要客户", levelColor: "green" as const, tags: [{ label: "待续约", color: "green" as const }], dept: "市场部", product: "Razer DeathAdder V2 无线游戏鼠标…", amount: 1634.25, date: "2023-12-18" },
{ id: 3, name: "洛阳金升玄经贸有限公司", owner: "周婷", avatar: "/avatars/03.jpg", level: "一般客户", levelColor: "gray" as const, tags: [{ label: "待跟进", color: "amber" as const }], dept: "研发部", product: "Corsair Dark Core RGB SE 无线游戏…", amount: 1745.09, date: "2023-12-19" },
{ id: 4, name: "绵阳中诚祥财鑫管理有限公司", owner: "吴桐", avatar: "/avatars/04.jpg", level: "一般客户", levelColor: "gray" as const, tags: [{ label: "新客", color: "cyan" as const }], dept: "人事部", product: "华硕 ROG Gladius II 烈焰战刃竞技版…", amount: 1862.47, date: "2023-12-20" },
{ id: 5, name: "鹤庆华聚顺科技有限公司", owner: "陈昊", avatar: "/avatars/01.jpg", level: "VIP客户", levelColor: "amber" as const, tags: [{ label: "高意向", color: "purple" as const }, { label: "大客户", color: "red" as const }], dept: "财务部", product: "HyperX Pulsefire Haste 无线轻量竞技…", amount: 1960.68, date: "2023-12-21" },
{ id: 6, name: "平顶山泽大壵贸科技公司", owner: "林夕", avatar: "/avatars/02.jpg", level: "重要客户", levelColor: "green" as const, tags: [{ label: "待续约", color: "green" as const }], dept: "客服部", product: "SteelSeries Rival 3 无线雷神游戏…", amount: 2101.58, date: "2023-12-22" },
{ id: 7, name: "新乡市佳谷投资有限公司", owner: "周婷", avatar: "/avatars/03.jpg", level: "VIP客户", levelColor: "amber" as const, tags: [{ label: "高意向", color: "purple" as const }], dept: "IT部", product: "Cooler Master MM821 无线竞技游戏…", amount: 2224.13, date: "2023-12-23" },
{ id: 8, name: "信阳瑞丰文化传播有限公司", owner: "吴桐", avatar: "/avatars/04.jpg", level: "一般客户", levelColor: "gray" as const, tags: [{ label: "待跟进", color: "amber" as const }], dept: "法务部", product: "Logitech G Pro X Superlight 无线游…", amount: 2345.99, date: "2023-12-24" }];

const TABLE_PAGE_SIZE = 5;

function TableSelectionHeader({
  checked,
  indeterminate,
  selectedIds,
  pageIds,
  allIds,
  onCheckedChange,
  onSelectionChange,
}: {
  checked: boolean;
  indeterminate: boolean;
  selectedIds: Set<number>;
  pageIds: number[];
  allIds: number[];
  onCheckedChange: () => void;
  onSelectionChange: React.Dispatch<React.SetStateAction<Set<number>>>;
}) {
  const hasSelected = selectedIds.size > 0;
  const hasPageRows = pageIds.length > 0;

  const selectPage = () =>
  onSelectionChange((s) => {
    const next = new Set(s);
    pageIds.forEach((id) => next.add(id));
    return next;
  });

  const invertPage = () =>
  onSelectionChange((s) => {
    const next = new Set(s);
    pageIds.forEach((id) => next.has(id) ? next.delete(id) : next.add(id));
    return next;
  });

  return (
    <div className="-mx-2 flex h-full w-8 items-center justify-center">
      <Checkbox checked={checked} indeterminate={indeterminate} onCheckedChange={onCheckedChange} aria-label="全选" />
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="批量选择菜单"
          className="relative z-10 inline-flex size-3.5 shrink-0 items-center justify-center rounded text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:bg-muted focus-visible:text-foreground data-popup-open:bg-muted data-popup-open:text-foreground [&_svg]:size-3"
        >
          <ChevronDownIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem disabled={!hasPageRows} onClick={selectPage}>选择当前页</DropdownMenuItem>
          <DropdownMenuItem disabled={allIds.length === 0} onClick={() => onSelectionChange(new Set(allIds))}>选择全部数据</DropdownMenuItem>
          <DropdownMenuItem disabled={!hasPageRows} onClick={invertPage}>反选当前页</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled={!hasSelected} onClick={() => onSelectionChange(new Set())}>清空选择</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>);
}


function TableBusinessDemo({
  density,
  selection,
  filter,
  fixed,
}: {
  density: "compact" | "default" | "comfortable";
  selection: "off" | "multiple" | "multiple-menu" | "single";
  filter: "off" | "on";
  fixed: "off" | "on";
}) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [selectedOne, setSelectedOne] = useState<number | null>(null);
  const [sort, setSort] = useState<{key: "amount" | "date";dir: "asc" | "desc";} | null>(null);
  const [page, setPage] = useState(1);
  const [levelFilter, setLevelFilter] = useState<string[]>([]);
  const [draftLevelFilter, setDraftLevelFilter] = useState<string[]>([]);
  const [levelFilterQuery, setLevelFilterQuery] = useState("");
  const [frozenCount, setFrozenCount] = useState(0);

  const filterEnabled = filter === "on";
  const freezeCapabilityEnabled = fixed === "on";
  const sortedFor = (key: "amount" | "date") => sort?.key === key ? sort.dir : false;
  const toggleSort = (key: "amount" | "date") =>
  setSort((s) => s?.key !== key ? { key, dir: "asc" } : s.dir === "asc" ? { key, dir: "desc" } : null);

  const levelFilterGroups = [
  { label: "重点客户", options: ["VIP客户", "重要客户"] },
  { label: "普通客户", options: ["一般客户"] }];
  const levelFilterOptions = levelFilterGroups.flatMap((g) => g.options);
  const visibleLevelFilterGroups = levelFilterGroups.
  map((group) => ({ ...group, options: group.options.filter((option) => option.includes(levelFilterQuery.trim())) })).
  filter((group) => group.options.length > 0);
  const allDraftLevelsChecked = levelFilterOptions.every((option) => draftLevelFilter.includes(option));
  const someDraftLevelsChecked = levelFilterOptions.some((option) => draftLevelFilter.includes(option));
  const toggleDraftLevel = (level: string) =>
  setDraftLevelFilter((current) => current.includes(level) ? current.filter((item) => item !== level) : [...current, level]);
  const levelFilterPanel = (
    <div className="flex flex-col">
      <div className="border-b border-border-subtle p-2">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input value={levelFilterQuery} onChange={(event) => setLevelFilterQuery(event.currentTarget.value)} placeholder="在筛选项中搜索" className="h-(--fx-control-sm-height) rounded-md pl-7" />
        </div>
      </div>
      <div className="max-h-60 overflow-y-auto p-2">
        <label className="flex h-8 items-center gap-2 rounded px-1.5 text-base hover:bg-muted">
          <Checkbox checked={allDraftLevelsChecked} indeterminate={!allDraftLevelsChecked && someDraftLevelsChecked} onCheckedChange={() => setDraftLevelFilter(allDraftLevelsChecked ? [] : levelFilterOptions)} aria-label="全选客户级别" />
          <span>全选</span>
        </label>
        {visibleLevelFilterGroups.map((group) =>
        <div key={group.label} className="mt-1">
            <div className="flex h-8 items-center gap-2 px-1.5 text-base font-medium">
              <ChevronDownIcon className="size-3.5 text-muted-foreground" />
              <span>{group.label}</span>
            </div>
            <div className="ml-7">
              {group.options.map((option) =>
            <label key={option} className="flex h-8 items-center gap-2 rounded px-1.5 text-base hover:bg-muted">
                  <Checkbox checked={draftLevelFilter.includes(option)} onCheckedChange={() => toggleDraftLevel(option)} aria-label={`筛选 ${option}`} />
                  <span>{option}</span>
                </label>
            )}
            </div>
          </div>
        )}
        {visibleLevelFilterGroups.length === 0 ? <div className="px-1.5 py-6 text-center text-base text-muted-foreground">无匹配筛选项</div> : null}
      </div>
      <div className="flex items-center justify-between border-t border-border-subtle p-2">
        <Button variant="plain" disabled={draftLevelFilter.length === 0 && levelFilter.length === 0} onClick={() => {
          setDraftLevelFilter([]);
          setLevelFilter([]);
        }}>重置</Button>
        <Button size="sm" onClick={() => {
          setLevelFilter(draftLevelFilter);
          setPage(1);
        }}>确定</Button>
      </div>
    </div>);

  let sorted = filterEnabled && levelFilter.length > 0 ? tableBizRows.filter((r) => levelFilter.includes(r.level)) : [...tableBizRows];
  if (sort) {
    sorted = [...sorted].sort((a, b) => {
      const v = sort.key === "amount" ? a.amount - b.amount : a.date.localeCompare(b.date);
      return sort.dir === "asc" ? v : -v;
    });
  }
  const pageRows = sorted.slice((page - 1) * TABLE_PAGE_SIZE, page * TABLE_PAGE_SIZE);
  const pageIds = pageRows.map((r) => r.id);
  const allIds = sorted.map((r) => r.id);
  const allChecked = pageIds.every((id) => selected.has(id));
  const someChecked = pageIds.some((id) => selected.has(id));
  const isFrozen = (i: number) => i < frozenCount;
  const frozenLeftOf = (i: number) => isFrozen(i) ? FROZEN_W.slice(0, i).reduce((a, b) => a + b, 0) : undefined;
  const freezeMenu = (i: number) => [
  ...(frozenCount !== i + 1 ? [{ label: `冻结到第 ${i + 1} 列`, icon: <LockIcon />, onClick: () => setFrozenCount(i + 1) }] : []),
  ...(frozenCount > 0 ? [{ label: "取消冻结", onClick: () => setFrozenCount(0) }] : [])];

  const toggleAll = () =>
  setSelected((s) => {
    const next = new Set(s);
    if (allChecked) pageIds.forEach((id) => next.delete(id));else
    pageIds.forEach((id) => next.add(id));
    return next;
  });
  const toggleOne = (id: number) =>
  setSelected((s) => {
    const next = new Set(s);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
  const isMultipleSelection = selection === "multiple" || selection === "multiple-menu";
  const showSelection = isMultipleSelection || selection === "single";
  const frozenStyle = (width: number) => freezeCapabilityEnabled ? { width, minWidth: width, maxWidth: width } : undefined;
  const actionStyle = { width: 128, minWidth: 128, maxWidth: 128 };

  return (
    <div className="overflow-hidden">
      {isMultipleSelection && selected.size > 0 &&
      <div className="flex items-center gap-3 border-b border-border-subtle bg-muted px-3 py-2 text-base">
          <span className="text-muted-foreground">已选 <span className="font-medium text-foreground">{selected.size}</span> 项</span>
          <Button size="sm" variant="outline">批量导出</Button>
          <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>取消选择</Button>
        </div>
      }
      <RadioGroup value={selectedOne == null ? "" : String(selectedOne)} onValueChange={(value) => setSelectedOne(Number(value))} className="block">
          <Table
            density={density}
            className="min-w-[920px]"
            maxHeight={freezeCapabilityEnabled ? 288 : undefined}
          >
            <TableHeader sticky={freezeCapabilityEnabled}>
              <TableRow className="hover:bg-transparent">
                {showSelection ? (
                  <TableHead data-selection-cell>
                    {selection === "multiple-menu" ? (
                      <TableSelectionHeader checked={allChecked} indeterminate={!allChecked && someChecked} selectedIds={selected} pageIds={pageIds} allIds={allIds} onCheckedChange={toggleAll} onSelectionChange={setSelected} />
                    ) : isMultipleSelection ? (
                      <Checkbox checked={allChecked} indeterminate={!allChecked && someChecked} onCheckedChange={toggleAll} aria-label="全选" />
                    ) : null}
                  </TableHead>
                ) : null}
                <TableHead style={frozenStyle(FROZEN_W[0])} frozenLeft={frozenLeftOf(0)} frozenEdge={frozenCount > 0 && frozenCount - 1 === 0} menuActions={freezeCapabilityEnabled ? freezeMenu(0) : undefined}>客户名称</TableHead>
                <TableHead style={frozenStyle(FROZEN_W[1])} frozenLeft={frozenLeftOf(1)} frozenEdge={frozenCount > 0 && frozenCount - 1 === 1} menuActions={freezeCapabilityEnabled ? freezeMenu(1) : undefined}>负责人</TableHead>
                <TableHead filterContent={filterEnabled ? levelFilterPanel : undefined} filtered={filterEnabled && levelFilter.length > 0}>客户级别{filterEnabled && levelFilter.length > 0 ? `（${levelFilter.length}）` : ""}</TableHead>
                <TableHead>标签</TableHead>
                <TableHead>负责人部门</TableHead>
                <TableHead>产品名称</TableHead>
                <TableHead align="right" sortable sorted={sortedFor("amount")} onSort={() => toggleSort("amount")}>金额(元)</TableHead>
                <TableHead sortable sorted={sortedFor("date")} onSort={() => toggleSort("date")}>最后修改时间</TableHead>
                <TableHead pinned="right" style={actionStyle}>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.map((row) =>
              <TableRow key={row.id} data-state={(isMultipleSelection && selected.has(row.id)) || (selection === "single" && selectedOne === row.id) ? "selected" : undefined}>
                  {showSelection ? (
                    <TableCell data-selection-cell>
                      {isMultipleSelection ? (
                        <Checkbox checked={selected.has(row.id)} onCheckedChange={() => toggleOne(row.id)} aria-label={`选择 ${row.name}`} />
                      ) : (
                        <RadioGroupItem value={String(row.id)} aria-label={`选择 ${row.name}`} />
                      )}
                    </TableCell>
                  ) : null}
                <TableCell frozenLeft={frozenLeftOf(0)} frozenEdge={frozenCount > 0 && frozenCount - 1 === 0}><a href="#table" className="text-link hover:text-link-hover active:text-link-active hover:underline">{row.name}</a></TableCell>
                <TableCell frozenLeft={frozenLeftOf(1)} frozenEdge={frozenCount > 0 && frozenCount - 1 === 1}>
                  <span className="inline-flex items-center gap-1.5">
                    <Avatar className="size-5"><AvatarImage src={row.avatar} alt={row.owner} /><AvatarFallback colorful>{avatarInitials(row.owner)}</AvatarFallback></Avatar>
                    {row.owner}
                  </span>
                </TableCell>
                <TableCell><LevelTag level={row.level} color={row.levelColor} /></TableCell>
                <TableCell>
                  <span className="inline-flex gap-1">
                    {row.tags.map((t) => <Tag key={t.label} color={t.color}>{t.label}</Tag>)}
                  </span>
                </TableCell>
                <TableCell>{row.dept}</TableCell>
                <TableCell className="max-w-[200px] truncate">{row.product}</TableCell>
                <TableCell align="right" className="tabular-nums">{row.amount.toLocaleString("zh-CN", { minimumFractionDigits: 2 })}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell pinned="right" style={actionStyle}>
                  <TooltipProvider delay={100}>
                    <span className="inline-flex items-center gap-1">
                      <IconAction icon={<EyeIcon />} label="查看" />
                      <IconAction icon={<PencilIcon />} label="编辑" />
                      <IconAction icon={<Trash2Icon />} label="删除" tone="danger" />
                    </span>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
              )}
            </TableBody>
          </Table>
        </RadioGroup>
      <div className="border-t border-border-subtle">
        <Pagination page={page} total={sorted.length} pageSize={TABLE_PAGE_SIZE} showTotal={false} onPageChange={setPage} className="px-2 py-3" />
      </div>
    </div>);

}

// 冻结到此列（Excel 模型）：前两列定宽，便于算累加 left 偏移
const FROZEN_W = [240, 140]; // 客户名称 / 负责人 列宽

function TableLoadingDemo() {
  return (
    <TablePreviewWithPagination pageSize={5} status="loading">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>客户名称</TableHead>
            <TableHead>负责人</TableHead>
            <TableHead>客户级别</TableHead>
            <TableHead align="right">金额(元)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) =>
          <TableRow key={i} className="hover:bg-transparent">
              <TableCell><Skeleton className="h-4 w-44" /></TableCell>
              <TableCell><Skeleton className="h-4 w-16" /></TableCell>
              <TableCell><Skeleton className="h-5 w-14 rounded-full" /></TableCell>
              <TableCell align="right"><Skeleton className="ml-auto h-4 w-16" /></TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TablePreviewWithPagination>);

}

function TableEmptyDemo() {
  return (
    <TablePreviewWithPagination total={0} pageSize={5} status="empty">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>客户名称</TableHead>
            <TableHead>负责人</TableHead>
            <TableHead>客户级别</TableHead>
            <TableHead align="right">金额(元)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={4}>
              <div className="flex flex-col items-center justify-center gap-1 py-12 text-muted-foreground">
                <DatabaseIcon className="size-7 opacity-40" />
                <span className="text-base">暂无数据</span>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TablePreviewWithPagination>);

}

function TableBasicDemo({
  density,
  summary,
  selection,
}: {
  density: "compact" | "default" | "comfortable";
  summary: "off" | "on";
  selection: "off" | "multiple" | "multiple-menu" | "single";
}) {
  const rows = tableBizRows.slice(0, 3);
  const total = rows.reduce((sum, row) => sum + row.amount, 0);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [selectedOne, setSelectedOne] = useState<number | null>(null);
  const isMultipleSelection = selection === "multiple" || selection === "multiple-menu";
  const showSelection = isMultipleSelection || selection === "single";
  const pageIds = rows.map((row) => row.id);
  const allIds = rows.map((row) => row.id);
  const allChecked = pageIds.every((id) => selected.has(id));
  const someChecked = pageIds.some((id) => selected.has(id));

  const toggleAll = () =>
  setSelected((s) => {
    const next = new Set(s);
    if (allChecked) pageIds.forEach((id) => next.delete(id));else
    pageIds.forEach((id) => next.add(id));
    return next;
  });
  const toggleOne = (id: number) =>
  setSelected((s) => {
    const next = new Set(s);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  return (
    <TablePreviewWithPagination pageSize={3}>
      <RadioGroup value={selectedOne == null ? "" : String(selectedOne)} onValueChange={(value) => setSelectedOne(Number(value))} className="block">
        <Table density={density}>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {showSelection ? (
                <TableHead data-selection-cell>
                  {selection === "multiple-menu" ? (
                    <TableSelectionHeader checked={allChecked} indeterminate={!allChecked && someChecked} selectedIds={selected} pageIds={pageIds} allIds={allIds} onCheckedChange={toggleAll} onSelectionChange={setSelected} />
                  ) : isMultipleSelection ? (
                    <Checkbox checked={allChecked} indeterminate={!allChecked && someChecked} onCheckedChange={toggleAll} aria-label="全选" />
                  ) : null}
                </TableHead>
              ) : null}
              <TableHead>客户名称</TableHead>
              <TableHead>负责人</TableHead>
              <TableHead>客户级别</TableHead>
              <TableHead align="right">金额(元)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} data-state={(isMultipleSelection && selected.has(row.id)) || (selection === "single" && selectedOne === row.id) ? "selected" : undefined}>
                {showSelection ? (
                  <TableCell data-selection-cell>
                    {isMultipleSelection ? (
                      <Checkbox checked={selected.has(row.id)} onCheckedChange={() => toggleOne(row.id)} aria-label={`选择 ${row.name}`} />
                    ) : (
                      <RadioGroupItem value={String(row.id)} aria-label={`选择 ${row.name}`} />
                    )}
                  </TableCell>
                ) : null}
                <TableCell><a href="#table" className="text-link hover:text-link-hover active:text-link-active hover:underline">{row.name}</a></TableCell>
                <TableCell>{row.owner}</TableCell>
                <TableCell><LevelTag level={row.level} color={row.levelColor} /></TableCell>
                <TableCell align="right" className="tabular-nums">{row.amount.toLocaleString("zh-CN", { minimumFractionDigits: 2 })}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          {summary === "on" ? (
            <TableFooter>
            <TableRow>
              {showSelection ? <TableCell data-selection-cell /> : null}
              <TableCell colSpan={3}>合计</TableCell>
              <TableCell align="right">{total.toLocaleString("zh-CN", { minimumFractionDigits: 2 })}</TableCell>
            </TableRow>
          </TableFooter>
          ) : null}
        </Table>
      </RadioGroup>
    </TablePreviewWithPagination>);
}

type TableVariant = "basic" | "business";
type TableDensity = "compact" | "default" | "comfortable";
type TableSummary = "off" | "on";
type TableStatus = "default" | "loading" | "empty";
type TableSelection = "off" | "multiple" | "multiple-menu" | "single";
type TableFilter = "off" | "on";
type TableFixed = "off" | "on";
function genTableCode(variant: TableVariant, density: TableDensity, summary: TableSummary, status: TableStatus, selection: TableSelection, filter: TableFilter, fixed: TableFixed): string {
  if (status === "loading") {
    return `<Table density="${density}">\n  <TableHeader>\n    <TableRow>\n      <TableHead>客户名称</TableHead>\n      <TableHead>负责人</TableHead>\n      <TableHead>客户级别</TableHead>\n      <TableHead align="right">金额(元)</TableHead>\n    </TableRow>\n  </TableHeader>\n  <TableBody>\n    {Array.from({ length: 5 }).map((_, i) => (\n      <TableRow key={i} className="hover:bg-transparent">\n        <TableCell><Skeleton className="h-4 w-44" /></TableCell>\n        <TableCell><Skeleton className="h-4 w-16" /></TableCell>\n        <TableCell><Skeleton className="h-5 w-14 rounded-full" /></TableCell>\n        <TableCell align="right"><Skeleton className="ml-auto h-4 w-16" /></TableCell>\n      </TableRow>\n    ))}\n  </TableBody>\n</Table>\n<Pagination page={1} total={48} pageSize={5} showTotal={false} onPageChange={() => {}} />`;
  }
  if (status === "empty") {
    return `<Table density="${density}">\n  <TableHeader>\n    <TableRow>\n      <TableHead>客户名称</TableHead>\n      <TableHead>负责人</TableHead>\n      <TableHead>客户级别</TableHead>\n      <TableHead align="right">金额(元)</TableHead>\n    </TableRow>\n  </TableHeader>\n  <TableBody>\n    <TableRow className="hover:bg-transparent">\n      <TableCell colSpan={4}>\n        <EmptyState title="暂无数据" />\n      </TableCell>\n    </TableRow>\n  </TableBody>\n</Table>`;
  }
  if (variant === "business") {
    const multipleSelectionHead = selection === "multiple-menu" ? "<TableHead><TableSelectionHeader /></TableHead>\\n      " : "<TableHead><Checkbox aria-label=\"全选\" /></TableHead>\\n      ";
    const isMultipleSelection = selection === "multiple" || selection === "multiple-menu";
    const selectionHead = isMultipleSelection ? multipleSelectionHead : selection === "single" ? "<TableHead />\\n      " : "";
    const rowState = isMultipleSelection ? " data-state={selected.has(customer.id) ? \"selected\" : undefined}" : selection === "single" ? " data-state={selectedId === customer.id ? \"selected\" : undefined}" : "";
    const selectionCell = isMultipleSelection ? "<TableCell><Checkbox disabled={customer.disabled} aria-label={`选择 ${customer.name}`} /></TableCell>\\n        " : selection === "single" ? "<TableCell><RadioGroupItem value={String(customer.id)} disabled={customer.disabled} aria-label={`选择 ${customer.name}`} /></TableCell>\\n        " : "";
    const fixedTableAttrs = fixed === "on" ? ` maxHeight={288} className="min-w-[920px]"` : ` className="min-w-[920px]"`;
    const stickyHeader = fixed === "on" ? " sticky" : "";
    const customerHead = fixed === "on" ? `<TableHead frozenLeft={0} frozenEdge menuActions={freezeMenu(0)}>客户名称</TableHead>` : `<TableHead>客户名称</TableHead>`;
    const ownerHead = fixed === "on" ? `<TableHead frozenLeft={240} frozenEdge menuActions={freezeMenu(1)}>负责人</TableHead>` : `<TableHead>负责人</TableHead>`;
    const levelHead = filter === "on" ? `<TableHead filterContent={levelFilterPanel} filtered={levelFilter.length > 0}>客户级别</TableHead>` : `<TableHead>客户级别</TableHead>`;
    return `<Table density="${density}"${fixedTableAttrs}>\n  <TableHeader${stickyHeader}>\n    <TableRow>\n      ${selectionHead}${customerHead}\n      ${ownerHead}\n      ${levelHead}\n      <TableHead align="right" sortable sorted={sortedFor("amount")} onSort={() => toggleSort("amount")}>金额(元)</TableHead>\n      <TableHead sortable sorted={sortedFor("date")} onSort={() => toggleSort("date")}>最后修改时间</TableHead>\n      <TableHead pinned="right">操作</TableHead>\n    </TableRow>\n  </TableHeader>\n  <TableBody>\n    {pageRows.map((customer) => (\n      <TableRow key={customer.id}${rowState}>\n        ${selectionCell}<TableCell><a href={customer.href}>{customer.name}</a></TableCell>\n        <TableCell>{customer.owner}</TableCell>\n        <TableCell>{customer.level}</TableCell>\n        <TableCell align="right">{customer.amount}</TableCell>\n        <TableCell>{customer.date}</TableCell>\n        <TableCell pinned="right">...</TableCell>\n      </TableRow>\n    ))}\n  </TableBody>\n</Table>\n<Pagination page={page} total={total} pageSize={pageSize} onPageChange={setPage} />`;
  }
  if (summary === "on") {
    const multipleSelectionHead = selection === "multiple-menu" ? "<TableHead><TableSelectionHeader /></TableHead>\\n      " : "<TableHead><Checkbox aria-label=\"全选\" /></TableHead>\\n      ";
    const isMultipleSelection = selection === "multiple" || selection === "multiple-menu";
    const selectionHead = isMultipleSelection ? multipleSelectionHead : selection === "single" ? "<TableHead />\\n      " : "";
    const rowState = isMultipleSelection ? " data-state={selected.has(customer.id) ? \"selected\" : undefined}" : selection === "single" ? " data-state={selectedId === customer.id ? \"selected\" : undefined}" : "";
    const selectionCell = isMultipleSelection ? "<TableCell><Checkbox aria-label={`选择 ${customer.name}`} /></TableCell>\\n        " : selection === "single" ? "<TableCell><RadioGroupItem value={String(customer.id)} aria-label={`选择 ${customer.name}`} /></TableCell>\\n        " : "";
    const footerSelectionCell = selection === "off" ? "" : "<TableCell />\\n      ";
    return `<Table density="${density}">\n  <TableHeader>\n    <TableRow>\n      ${selectionHead}<TableHead>客户名称</TableHead>\n      <TableHead>负责人</TableHead>\n      <TableHead>客户级别</TableHead>\n      <TableHead align="right">金额(元)</TableHead>\n    </TableRow>\n  </TableHeader>\n  <TableBody>\n    {customers.map((customer) => (\n      <TableRow key={customer.id}${rowState}>\n        ${selectionCell}<TableCell><a href={customer.href}>{customer.name}</a></TableCell>\n        <TableCell>{customer.owner}</TableCell>\n        <TableCell>{customer.level}</TableCell>\n        <TableCell align="right">{customer.amount}</TableCell>\n      </TableRow>\n    ))}\n  </TableBody>\n  <TableFooter>\n    <TableRow>\n      ${footerSelectionCell}<TableCell colSpan={3}>合计</TableCell>\n      <TableCell align="right">{totalAmount}</TableCell>\n    </TableRow>\n  </TableFooter>\n</Table>`;
  }
  return `<Table density="${density}">\n  <TableHeader>\n    <TableRow>\n      <TableHead>客户名称</TableHead>\n      <TableHead>负责人</TableHead>\n      <TableHead>客户级别</TableHead>\n      <TableHead align="right">金额(元)</TableHead>\n    </TableRow>\n  </TableHeader>\n  <TableBody>\n    {customers.map((customer) => (\n      <TableRow key={customer.id}>\n        <TableCell><a href={customer.href}>{customer.name}</a></TableCell>\n        <TableCell>{customer.owner}</TableCell>\n        <TableCell>{customer.level}</TableCell>\n        <TableCell align="right">{customer.amount}</TableCell>\n      </TableRow>\n    ))}\n  </TableBody>\n</Table>`;
}

const tablePlaygroundConfig = {
  previewItemsClassName: "w-full",
  props: [
    {
      key: "variant",
      zh: "变体",
      en: "Variant",
      propName: "variant",
      type: "segment" as const,
      options: [
        {
          value: "basic",
          label: "基础",
          labelEn: "Basic",
          intent: "最常见的默认表格，用于稳定展示结构化数据。",
          intentEn: "The default table form for stable, structured data display.",
          constraint: "先用默认表格；只有出现真实业务需求时，再加分页、排序、冻结列等能力。",
          constraintEn: "Start with the default table and only add paging, sorting, or frozen columns when the use case truly needs them.",
        },
        {
          value: "business",
          label: "业务列表",
          labelEn: "Business list",
          intent: "用于后台最常见的资源列表；排序、筛选、固定列、选择等能力可以叠加出现。",
          intentEn: "Use for common resource lists. Sorting, filtering, frozen columns, and selection can be combined.",
          constraint: "业务列表不是把交互切成多个变体；金额、日期等可比较列默认支持排序，分页默认跟随表格外层结构。",
          constraintEn: "Business list does not split interactions into variants; comparable columns such as amount or date sort by default, and pagination belongs to the table shell.",
        },
      ],
    },
    {
      key: "density",
      zh: "行高",
      en: "Row height",
      propName: "density",
      type: "segment" as const,
      hasAll: true,
      options: [
        {
          value: "compact",
          label: "紧凑28",
          labelEn: "Compact 28",
          intent: "用于信息密度更高的列表，一屏能看到更多行。",
          intentEn: "Use for dense lists where more rows should fit on one screen.",
          constraint: "只用于可扫读的数据；如果单元格内容较长或有复杂控件，不要压到 28px。",
          constraintEn: "Use only for scannable data; avoid 28px rows when cells contain long text or complex controls.",
        },
        {
          value: "default",
          label: "舒适36",
          labelEn: "Default 36",
          intent: "默认表格行高，兼顾信息密度和可读性。",
          intentEn: "The default row height, balancing density and readability.",
          constraint: "没有明确业务理由时保持默认 36px，避免每张表都重新定义节奏。",
          constraintEn: "Keep 36px unless the use case clearly needs a denser or looser rhythm.",
        },
        {
          value: "comfortable",
          label: "宽松42",
          labelEn: "Comfortable 42",
          intent: "用于需要更强可读性、点击余量或内容更复杂的表格。",
          intentEn: "Use for tables that need stronger readability, larger hit areas, or richer cell content.",
          constraint: "宽松行高会降低一屏信息量，只在阅读优先或操作优先的表格里使用。",
          constraintEn: "Comfortable rows reduce visible density, so reserve them for read-heavy or action-heavy tables.",
        },
      ],
    },
    {
      key: "summary",
      zh: "汇总",
      en: "Summary",
      propName: "summary",
      type: "segment" as const,
      options: [
        {
          value: "off",
          label: "无",
          labelEn: "Off",
          intent: "基础表格默认不带汇总，专注展示明细行。",
          intentEn: "The basic table omits summaries by default and focuses on row-level details.",
          constraint: "如果没有合计、均值或小计等明确计算结果，不要为了占位加表尾。",
          constraintEn: "Do not add a footer unless there is a real total, average, or subtotal to show.",
        },
        {
          value: "on",
          label: "表尾汇总",
          labelEn: "Footer summary",
          intent: "用于金额、数量等需要合计或小计的表格。",
          intentEn: "Use for tables with totals or subtotals such as amount and quantity.",
          constraint: "汇总属于另一个属性，不改变基础表格本身；只在数据口径稳定时展示。",
          constraintEn: "Summary is a separate property, not a new base variant; show it only when the calculation is stable.",
        },
      ],
    },
    {
      key: "selection",
      zh: "选择",
      en: "Selection",
      propName: "selection",
      type: "segment" as const,
      hasAll: true,
      options: [
        {
          value: "off",
          label: "无",
          labelEn: "Off",
          intent: "默认不提供批量选择，表格只承担阅读和单行操作。",
          intentEn: "By default, the table supports reading and row actions without batch selection.",
          constraint: "没有批量动作时不要加复选框列，避免误导用户以为可以批处理。",
          constraintEn: "Do not add a checkbox column unless batch actions actually exist.",
        },
        {
          value: "multiple",
          label: "多选",
          labelEn: "Multiple",
          intent: "用于批量导出、批量删除、批量分配等资源列表操作。",
          intentEn: "Use for bulk export, delete, assignment, and similar resource-list actions.",
          constraint: "选择态要有明确的选中反馈和批量操作区；只靠行高亮不够。",
          constraintEn: "Selection needs clear selected feedback and a batch action area; row highlight alone is not enough.",
        },
        {
          value: "multiple-menu",
          label: "多选+菜单",
          labelEn: "Multiple + menu",
          intent: "用于需要选择当前页、选择全部、反选、清空等快捷项的批量选择表格。",
          intentEn: "Use for multiple selection with shortcuts such as page, all, invert, or clear.",
          constraint: "这是多选的增强能力，不是另一套选择模型；简单多选优先用“多选”。",
          constraintEn: "This enhances multiple selection, not a separate selection model; prefer plain multiple selection for simple cases.",
        },
        {
          value: "single",
          label: "单选",
          labelEn: "Single",
          intent: "用于只能选择一条记录继续下一步的列表，例如选择主联系人、默认地址或归属对象。",
          intentEn: "Use when the next step can accept exactly one row, such as choosing a primary contact, default address, or owner object.",
          constraint: "单选列不提供表头全选；禁用行的 radio 和行内容要同步禁用反馈。",
          constraintEn: "Single selection has no select-all header; disabled rows need disabled radio and matching row feedback.",
        },
      ],
    },
    {
      key: "filter",
      zh: "筛选",
      en: "Filter",
      propName: "filter",
      type: "segment" as const,
      options: [
        {
          value: "off",
          label: "无",
          labelEn: "Off",
          intent: "不展示列筛选入口，适合字段少、条件简单的表格。",
          intentEn: "Hide column filters for small tables or simple conditions.",
          constraint: "筛选是列能力，不应被做成一个新的表格变体。",
          constraintEn: "Filtering is a column capability, not a separate table variant.",
        },
        {
          value: "on",
          label: "列筛选",
          labelEn: "Column filter",
          intent: "在客户级别等枚举列提供搜索、多选、确认和重置。",
          intentEn: "Adds search, multi-select, confirm, and reset to enum-like columns.",
          constraint: "适合枚举、状态、负责人等可筛选列；金额/日期更多使用排序或范围筛选。",
          constraintEn: "Best for enum, status, or owner columns; amount/date usually use sorting or range filters.",
        },
      ],
      hiddenWhen: (v: Record<string, string>) => v.variant !== "business",
    },
    {
      key: "fixed",
      zh: "固定列",
      en: "Frozen columns",
      propName: "fixed",
      type: "segment" as const,
      options: [
        {
          value: "off",
          label: "无",
          labelEn: "Off",
          intent: "不提供冻结列能力，按普通业务表展示。",
          intentEn: "No frozen-column capability; show the table as a standard business list.",
          constraint: "字段不多或无需局部冻结时，保持普通滚动即可。",
          constraintEn: "Keep standard scrolling when the table is not wide enough to need frozen controls.",
        },
        {
          value: "on",
          label: "开启冻结能力",
          labelEn: "Enable freeze",
          intent: "开启表头 hover 冻结能力，由用户自行冻结首列或前两列。",
          intentEn: "Expose hover-based freeze actions so users can choose the first column or first two columns.",
          constraint: "冻结列是布局增强，可以和排序、筛选、选择同时存在，但不应默认替用户冻好。",
          constraintEn: "Frozen columns are a layout enhancement and can coexist with sorting, filtering, and selection, but should not be pre-frozen by default.",
        },
      ],
      hiddenWhen: (v: Record<string, string>) => v.variant !== "business",
    },
    {
      key: "status",
      zh: "状态",
      en: "State",
      propName: "status",
      type: "segment" as const,
      hasAll: true,
      options: [
        {
          value: "default",
          label: "正常",
          labelEn: "Default",
          intent: "默认数据态，展示真实表格行。",
          intentEn: "The default data state, showing real table rows.",
          constraint: "状态是业务组合，不是 Table 原生 prop；页面根据数据请求结果决定渲染哪种内容。",
          constraintEn: "State is a business composition, not a native Table prop; render it from request/data state.",
        },
        {
          value: "loading",
          label: "加载",
          labelEn: "Loading",
          intent: "用于数据请求中，保持表头结构稳定，同时用骨架行提示正在加载。",
          intentEn: "Use while data is loading, keeping headers stable and showing skeleton rows.",
          constraint: "加载态不要放进高级变体；它是所有表格都可能出现的状态。",
          constraintEn: "Loading is not an advanced variant; every table may need it.",
        },
        {
          value: "empty",
          label: "空",
          labelEn: "Empty",
          intent: "用于请求成功但没有数据，保留表头并在表体展示空状态。",
          intentEn: "Use after a successful request returns no rows, keeping headers and showing an empty state in the body.",
          constraint: "空状态要明确占满列数，避免只在某个单元格里挤一行文字。",
          constraintEn: "Empty state should span the table columns instead of being squeezed into one cell.",
        },
      ],
    },
  ],
  initial: { variant: "basic", density: "default", summary: "off", selection: "off", filter: "off", fixed: "off", status: "default" },
  guidanceKey: "variant",
  renderOne: (v: Record<string, string>) => {
    const variant = (v.variant as TableVariant) || "basic";
    const density = (v.density as TableDensity) || "default";
    const summary = (v.summary as TableSummary) || "off";
    const status = (v.status as TableStatus) || "default";
    const selection = (v.selection as TableSelection) || "off";
    const filter = (v.filter as TableFilter) || "off";
    const fixed = (v.fixed as TableFixed) || "off";
    if (status === "loading") {
      return <TableLoadingDemo />;
    }
    if (status === "empty") {
      return <TableEmptyDemo />;
    }
    if (variant === "business") {
      return <TableBusinessDemo density={density} selection={selection} filter={filter} fixed={fixed} />;
    }
    return <TableBasicDemo density={density} summary={summary} selection={selection} />;
  },
  genCode: (v: Record<string, string>) => genTableCode((v.variant as TableVariant) || "basic", (v.density as TableDensity) || "default", (v.summary as TableSummary) || "off", (v.status as TableStatus) || "default", (v.selection as TableSelection) || "off", (v.filter as TableFilter) || "off", (v.fixed as TableFixed) || "off"),
};

function TablePage({ actions, lang }: {actions: React.ReactNode;lang: Lang;}) {
  const tableImportCode = `import {\n  Table,\n  TableBody,\n  TableCaption,\n  TableCell,\n  TableHead,\n  TableHeader,\n  TableRow,\n} from "@/components/ui/table"`;
  const tableUsageCode = `<Table>\n  <TableCaption>最近的客户记录</TableCaption>\n  <TableHeader>\n    <TableRow>\n      <TableHead>客户名称</TableHead>\n      <TableHead>负责人</TableHead>\n      <TableHead>客户级别</TableHead>\n      <TableHead align="right">金额(元)</TableHead>\n    </TableRow>\n  </TableHeader>\n  <TableBody>\n    {customers.map((customer) => (\n      <TableRow key={customer.id}>\n        <TableCell><a href={customer.href}>{customer.name}</a></TableCell>\n        <TableCell>{customer.owner}</TableCell>\n        <TableCell><Tag variant="outline">{customer.level}</Tag></TableCell>\n        <TableCell align="right">{customer.amount}</TableCell>\n      </TableRow>\n    ))}\n  </TableBody>\n</Table>`;

  return (
    <div className={docsSpacing.pageStack}>
      <section id="table" className="flex flex-col gap-2">
        <PageLead
          crumb={lang === "en" ? "Components / Table" : "组件 / 表格"}
          title="Table 表格"
          lead="展示结构化的多行数据，常用于订单列表、用户管理、数据看板等场景。"
          actions={actions} />
        
      </section>

      <section id="table-playground" className={docsSpacing.sectionStack}>
        <SectionLead
          title={lang === "en" ? "Playground" : "调试台"}
          description={lang === "en" ? "Variants describe structure only; sorting, filtering, frozen columns, selection, summary, and state are composable capabilities. Comparable columns sort by default, and tables include pagination." : "变体只描述结构；排序、筛选、固定列、选择、汇总、状态都是可叠加能力。金额、数量、日期等可比较列默认支持排序，表格默认带分页。"}
        />
        <ComponentPlayground config={tablePlaygroundConfig} lang={lang} />
      </section>

      <section id="table-usage" className={docsSpacing.sectionStack}>
        <SectionLead title={"使用方式"} description={"把 import 和 JSX 调用复制到业务页面里使用。"} />


        
        <DocSurfaceCard elevated>
          <CardContent className="grid gap-4 p-5">
            <CopyCodeBlock code={tableImportCode} label="Import" lang={lang} />
            <CopyCodeBlock code={tableUsageCode} label="调用" lang={lang} />
          </CardContent>
        </DocSurfaceCard>
      </section>

      <section id="table-props" className={docsSpacing.sectionStack}>
        <h2 className="text-xl font-bold tracking-tight">API 属性</h2>
        <DocSurfaceTableCard elevated>
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">子组件</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>默认值</TableHead>
                <TableHead className="pr-4">描述</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tablePropRows.map((row) =>
              <TableRow key={row.prop}>
                  <TableCell className="pl-4 font-medium">{row.prop}</TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.type}</code>
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.defaultValue}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DocSurfaceTableCard>
      </section>

      <section id="table-semantic-dom" className={docsSpacing.sectionStack}>
        <SectionLead title={"语义 DOM"} description={"Table 源码来自 shadcn/ui，保持 open-code。这里记录 AI 和工程师应该理解的语义部位。"} />




        
        <DocSurfaceTableCard elevated>
          <Table className="min-w-[560px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">部位</TableHead>
                <TableHead className="pr-4">说明</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableSemanticDomRows.map((row) =>
              <TableRow key={row.part}>
                  <TableCell className="pl-4 font-medium">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.part}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DocSurfaceTableCard>
      </section>

      <section id="table-do-dont" className={docsSpacing.sectionStack}>
        <SectionLead title={"正误示例"} description={"工程师和 AI 生成代码最容易犯的错误，照着做即可。"} />


        
        <DocDoDont rows={tableDoDontRows} elevated />
      </section>
    </div>);

}

type CardPlaygroundScenario = "metric" | "info" | "action";

const cardPlaygroundOptions = [
{
  value: "metric",
  label: "数据概览",
  labelEn: "Metric",
  intent: "用于承载一个关键指标、说明和趋势变化。",
  intentEn: "Use for one key metric, its description, and trend.",
  constraint: "用 CardHeader + CardContent；不要在调用处覆盖 Card 的边框、圆角或阴影。",
  constraintEn: "Use CardHeader + CardContent; do not override Card border, radius, or shadow at call sites."
},
{
  value: "info",
  label: "信息说明",
  labelEn: "Info",
  intent: "用于展示配置摘要、帮助说明等只读内容。",
  intentEn: "Use for read-only content such as configuration summaries or help text.",
  constraint: "静态内容不需要 CardAction 和 CardFooter，保持结构简单。",
  constraintEn: "Static content does not need CardAction or CardFooter; keep the structure simple."
},
{
  value: "action",
  label: "可操作项",
  labelEn: "Action",
  intent: "用于卡片头部带主要局部操作的内容块。",
  intentEn: "Use for content blocks with a local action in the header.",
  constraint: "右上角操作放 CardAction；状态信息放 CardFooter。",
  constraintEn: "Place the top-right action in CardAction and status content in CardFooter."
}];

function renderCardPlayground(values: Record<string, string>) {
  const scenario = values.scenario as CardPlaygroundScenario;

  if (scenario === "info") {
    return (
      <Card elevated className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-base">信息说明</CardTitle>
          <CardDescription>仅展示静态内容，不含操作</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          用于展示帮助说明、配置摘要等只读信息，不需要 Footer 和 Action。
        </CardContent>
      </Card>);
  }

  if (scenario === "action") {
    return (
      <Card elevated className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-base">可操作列表项</CardTitle>
          <CardAction>
            <Button variant="outline" size="sm">编辑</Button>
          </CardAction>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          头部右上角放置操作入口，交给 CardAction 自动布局对齐。
        </CardContent>
        <CardFooter>
          <Tag variant="outline">已启用</Tag>
        </CardFooter>
      </Card>);
  }

  return (
    <Card elevated className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-base">数据概览</CardTitle>
        <CardDescription>关键指标 + 同比说明</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-xl font-bold tracking-tight">1,204</p>
        <p className="mt-1 text-sm text-muted-foreground">较上周 +8.2%</p>
      </CardContent>
    </Card>);
}

function genCardPlaygroundCode(values: Record<string, string>) {
  const scenario = values.scenario as CardPlaygroundScenario;
  const importCode = `import {\n  Card,\n  CardAction,\n  CardContent,\n  CardDescription,\n  CardFooter,\n  CardHeader,\n  CardTitle,\n} from "@/components/ui/card"`;

  if (scenario === "info") {
    return `${importCode}\n\n<Card>\n  <CardHeader>\n    <CardTitle>信息说明</CardTitle>\n    <CardDescription>仅展示静态内容，不含操作</CardDescription>\n  </CardHeader>\n  <CardContent>用于展示帮助说明、配置摘要等只读信息。</CardContent>\n</Card>`;
  }

  if (scenario === "action") {
    return `${importCode}\n\n<Card>\n  <CardHeader>\n    <CardTitle>可操作列表项</CardTitle>\n    <CardAction>\n      <Button variant="outline" size="sm">编辑</Button>\n    </CardAction>\n  </CardHeader>\n  <CardContent>头部右上角放置操作入口。</CardContent>\n  <CardFooter>\n    <Tag variant="outline">已启用</Tag>\n  </CardFooter>\n</Card>`;
  }

  return `${importCode}\n\n<Card>\n  <CardHeader>\n    <CardTitle>数据概览</CardTitle>\n    <CardDescription>关键指标 + 同比说明</CardDescription>\n  </CardHeader>\n  <CardContent>\n    <p>1,204</p>\n    <p>较上周 +8.2%</p>\n  </CardContent>\n</Card>`;
}

const cardPlaygroundConfig = {
  props: [
    {
      key: "scenario",
      zh: "场景",
      en: "Scenario",
      propName: "composition",
      type: "segment" as const,
      options: cardPlaygroundOptions
    }
  ],
  initial: { scenario: "metric" },
  guidanceKey: "scenario",
  renderOne: renderCardPlayground,
  genCode: genCardPlaygroundCode
};

function CardPage({ actions, lang }: {actions: React.ReactNode;lang: Lang;}) {
  const cardImportCode = `import {\n  Card,\n  CardAction,\n  CardContent,\n  CardDescription,\n  CardFooter,\n  CardHeader,\n  CardTitle,\n} from "@/components/ui/card"`;
  const cardUsageCode = `<Card className="w-[320px]">\n  <CardHeader>\n    <CardTitle>本月营收</CardTitle>\n    <CardDescription>对比上月同期</CardDescription>\n    <CardAction>\n      <Button variant="ghost" size="sm">查看详情</Button>\n    </CardAction>\n  </CardHeader>\n  <CardContent>\n    <p className="text-xl font-bold tracking-tight">¥128,400</p>\n  </CardContent>\n  <CardFooter>\n    <p className="text-sm text-muted-foreground">较上月增长 12.4%</p>\n  </CardFooter>\n</Card>`;

  return (
    <div className={docsSpacing.pageStack}>
      <section id="card" className="flex flex-col gap-2">
        <PageLead crumb={lang === "en" ? "Components / Card" : "组件 / 卡片"} title="Card 卡片" lead="通用内容容器，用 Header / Content / Footer 等子组件搭出统一的卡片骨架。" actions={actions} />
      </section>

      <section id="card-playground" className={docsSpacing.sectionStack}>
        <SectionLead
          title={lang === "en" ? "Playground" : "调试台"}
          description={lang === "en" ? "Switch Card composition scenarios while keeping the source Card parts as the only API." : "切换 Card 组合场景，保持源码 Card 子组件为唯一 API。"}
        />
        <ComponentPlayground config={cardPlaygroundConfig} lang={lang} />
      </section>

      <section id="card-overview" className={docsSpacing.sectionStack}>
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold tracking-tight">组件总览</h2>
          <p className="text-base text-muted-foreground">
            Card 由 Header（标题/描述/操作区）、Content（主体）、Footer（底部）等部位组成，
            统一用 <code className="rounded bg-muted px-1.5 py-0.5">data-slot</code> 标记，视觉由公司 token 注入。
          </p>
        </div>
        <Card elevated className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>本月营收</CardTitle>
            <CardDescription>对比上月同期</CardDescription>
            <CardAction>
              <Button variant="ghost" size="sm">查看详情</Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold tracking-tight">¥128,400</p>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">较上月增长 12.4%</p>
          </CardFooter>
        </Card>
      </section>

      <section id="card-preview" className={docsSpacing.sectionStack}>
        <SectionLead title={"场景示例"} description={"常见的三类用法：数据概览卡、信息说明卡、可操作的列表项卡片。"} />




        
        <div className="grid gap-4 md:grid-cols-3">
          <Card elevated>
            <CardHeader>
              <CardTitle className="text-base">数据概览</CardTitle>
              <CardDescription>关键指标 + 同比说明</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold tracking-tight">1,204</p>
              <p className="mt-1 text-sm text-muted-foreground">较上周 +8.2%</p>
            </CardContent>
          </Card>
          <Card elevated>
            <CardHeader>
              <CardTitle className="text-base">信息说明</CardTitle>
              <CardDescription>仅展示静态内容，不含操作</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              用于展示帮助说明、配置摘要等只读信息，不需要 Footer 和 Action。
            </CardContent>
          </Card>
          <Card elevated>
            <CardHeader>
              <CardTitle className="text-base">可操作列表项</CardTitle>
              <CardAction>
                <Button variant="outline" size="sm">编辑</Button>
              </CardAction>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              头部右上角放置操作入口，交给 CardAction 自动布局对齐。
            </CardContent>
            <CardFooter>
              <Tag variant="outline">已启用</Tag>
            </CardFooter>
          </Card>
        </div>
      </section>

      <section id="card-usage" className={docsSpacing.sectionStack}>
        <SectionLead title={"使用方式"} description={"把 import 和 JSX 调用复制到业务页面里使用。"} />


        
        <DocSurfaceCard elevated>
          <CardContent className="grid gap-4 p-5">
            <CopyCodeBlock code={cardImportCode} label="Import" lang={lang} />
            <CopyCodeBlock code={cardUsageCode} label="调用" lang={lang} />
          </CardContent>
        </DocSurfaceCard>
      </section>

      <section id="card-props" className={docsSpacing.sectionStack}>
        <h2 className="text-xl font-bold tracking-tight">API 属性</h2>
        <DocSurfaceTableCard elevated>
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">子组件</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>默认值</TableHead>
                <TableHead className="pr-4">描述</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cardPropRows.map((row) =>
              <TableRow key={row.prop}>
                  <TableCell className="pl-4 font-medium">{row.prop}</TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.type}</code>
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.defaultValue}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DocSurfaceTableCard>
      </section>

      <section id="card-semantic-dom" className={docsSpacing.sectionStack}>
        <SectionLead title={"语义 DOM"} description={"Card 源码来自 shadcn/ui，保持 open-code。这里记录 AI 和工程师应该理解的语义部位。"} />




        
        <DocSurfaceTableCard elevated>
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">部位</TableHead>
                <TableHead className="pr-4">说明</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cardSemanticDomRows.map((row) =>
              <TableRow key={row.part}>
                  <TableCell className="pl-4 font-medium">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.part}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DocSurfaceTableCard>
      </section>

      <section id="card-do-dont" className={docsSpacing.sectionStack}>
        <SectionLead title={"正误示例"} description={"工程师和 AI 生成代码最容易犯的错误，照着做即可。"} />


        
        <div className="grid gap-4 md:grid-cols-2">
          <Card elevated>
            <CardHeader>
              <CardTitle className="text-base text-foreground">推荐 Do</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
              {cardDoDontRows.map((row) =>
              <div key={`do-${row.do}`} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-success" />
                  <span>{row.do}</span>
                </div>
              )}
            </CardContent>
          </Card>
          <Card elevated>
            <CardHeader>
              <CardTitle className="text-base text-foreground">避免 Don't</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
              {cardDoDontRows.map((row) =>
              <div key={`dont-${row.dont}`} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-destructive" />
                  <span>{row.dont}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>);

}

function TagPreview({ id }: {id: string;}) {
  if (id === "status")
  return (
    <div className="flex flex-wrap gap-2">
        <Tag variant="success">已支付</Tag>
        <Tag variant="secondary">处理中</Tag>
        <Tag variant="destructive">已失败</Tag>
      </div>);

  if (id === "color")
  return (
    <div className="flex flex-wrap gap-2">
        <Tag color="purple">高意向</Tag>
        <Tag color="blue">华东区</Tag>
        <Tag color="green">已签约</Tag>
      </div>);

  return (
    <Tag variant="secondary">
      <CheckCircleIcon data-icon="inline-start" />
      已校验
    </Tag>);

}

function TagOverview() {
  return (
    <div className="grid gap-4 rounded-xl bg-card p-6 ring-1 ring-border-subtle shadow-l1">
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-muted-foreground">状态 variant</span>
        <div className="flex flex-wrap items-center gap-2">
          {tagVariantRows.map((row) =>
          <Tag key={row.variant} variant={row.variant as React.ComponentProps<typeof Tag>["variant"]}>{row.variant}</Tag>
          )}
        </div>
      </div>
      <div className="border-t border-dashed border-border" />
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-muted-foreground">分类打标 color（软色 = 浅底 + 彩字 + 描边）</span>
        <div className="flex flex-wrap items-center gap-2">
          {tagColorList.map((c) =>
          <Tag key={c} color={c}>{c}</Tag>
          )}
        </div>
      </div>
    </div>);

}

type TagVariant = "default" | "secondary" | "success" | "warning" | "destructive" | "outline";
type TagColor = "none" | "gray" | "red" | "amber" | "yellow" | "lime" | "green" | "teal" | "cyan" | "blue" | "purple" | "pink";
function genTagCode(variant: TagVariant, color: TagColor, label: string): string {
  const attrs: string[] = [];
  if (variant !== "default") attrs.push(`variant="${variant}"`);
  if (color !== "none") attrs.push(`color="${color}"`);
  return `<Tag${attrs.length ? " " + attrs.join(" ") : ""}>${label}</Tag>`;
}
const tagPlaygroundConfig = {
  props: componentPlaygroundPropsFromManifest(componentPlaygroundsManifest.components.tag),
  initial: componentPlaygroundsManifest.components.tag.initial,
  guidanceKey: componentPlaygroundsManifest.components.tag.guidanceKey,
  renderOne: (c: Record<string, string>, lang: Lang) => <Tag variant={c.variant as TagVariant} color={c.color as TagColor}>{(lang === "en" ? c.textEn : c.text) || "Tag"}</Tag>,
  genCode: (c: Record<string, string>, lang: Lang) => genTagCode(c.variant as TagVariant, c.color as TagColor, (lang === "en" ? c.textEn : c.text) || "Tag")
};

function TagPage({ actions, lang }: {actions: React.ReactNode;lang: Lang;}) {
  return (
    <StandardDocPage
      slug="tag"
      title="Tag 标签"
      lead="行内的状态/分类小标签：状态用 variant，分类打标用多彩 color。角标红点/数字请用 Badge。"
      playground={<ComponentPlayground key="tag-playground" config={tagPlaygroundConfig} lang={lang} />}
      overview={null}
      overviewMatrix={<TagOverview />}
      scenarioExamples={tagScenarioExamples}
      renderScenarioPreview={(id) => <TagPreview id={id} />}
      importCode={`import { Tag } from "@/components/ui/tag"`}
      usageCode={`<Tag variant="success">已支付</Tag>\n<Tag color="purple">高意向</Tag>`}
      propRows={tagPropRows}
      semanticDomRows={tagSemanticDomRows}
      doDontRows={tagDoDontRows}
      actions={actions}
      lang={lang} />);


}

function BadgePreview({ id }: {id: string;}) {
  const count = id === "count" ? 5 : id === "overflow" ? 120 : undefined;
  if (id === "dot") return <Badge dot><BellIcon className="size-6 text-foreground" /></Badge>;
  return <Badge count={count} max={99}><BellIcon className="size-6 text-foreground" /></Badge>;
}

function BadgeOverview() {
  return (
    <DocSurfaceCard elevated>
      <CardContent className="flex flex-wrap items-center gap-8 p-6">
        <Badge dot><BellIcon className="size-6 text-foreground" /></Badge>
        <Badge count={5}><BellIcon className="size-6 text-foreground" /></Badge>
        <Badge count={120} max={99}><BellIcon className="size-6 text-foreground" /></Badge>
        <Badge count={8} tone="primary"><BellIcon className="size-6 text-foreground" /></Badge>
      </CardContent>
    </DocSurfaceCard>);

}

function BadgePage({ actions, lang }: {actions: React.ReactNode;lang: Lang;}) {
  return (
    <StandardDocPage
      slug="badge"
      title="Badge 角标"
      lead="贴在头像、图标、按钮右上角的通知红点 / 未读数字。行内状态/分类标签请用 Tag。"
      overview={null}
      overviewMatrix={<BadgeOverview />}
      scenarioExamples={badgeScenarioExamples}
      renderScenarioPreview={(id) => <BadgePreview id={id} />}
      importCode={`import { Badge } from "@/components/ui/badge"`}
      usageCode={`<Badge dot>\n  <BellIcon />\n</Badge>\n<Badge count={5}>…</Badge>`}
      propRows={badgePropRows}
      semanticDomRows={badgeSemanticDomRows}
      doDontRows={badgeDoDontRows}
      actions={actions}
      lang={lang} />);


}

function TooltipPreview({ id }: {id: string;}) {
  if (id === "icon-button") {
    return (
      <Tooltip>
        <TooltipTrigger
          render={
          <Button variant="ghost" size="icon-sm" aria-label="设置">
              <SettingsIcon />
            </Button>
          } />
        
        <TooltipContent>设置</TooltipContent>
      </Tooltip>);

  }

  if (id === "truncated-text") {
    return (
      <Tooltip>
        <TooltipTrigger render={<span className="block w-[120px] truncate text-sm">这是一个很长的客户全称示例文本</span>} />
        <TooltipContent>这是一个很长的客户全称示例文本</TooltipContent>
      </Tooltip>);

  }

  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline" size="sm">悬浮查看</Button>} />
      <TooltipContent side="right">提示从右侧弹出</TooltipContent>
    </Tooltip>);

}

function TooltipPage({ actions, lang }: {actions: React.ReactNode;lang: Lang;}) {
  const tooltipImportCode = `import {\n  Tooltip,\n  TooltipContent,\n  TooltipProvider,\n  TooltipTrigger,\n} from "@/components/ui/tooltip"`;
  const tooltipUsageCode = `<Tooltip>\n  <TooltipTrigger\n    render={\n      <Button variant="ghost" size="icon-sm" aria-label="设置">\n        <SettingsIcon />\n      </Button>\n    }\n  />\n  <TooltipContent>设置</TooltipContent>\n</Tooltip>`;

  return (
    <div className={docsSpacing.pageStack}>
      <section id="tooltip" className="flex flex-col gap-2">
        <PageLead crumb={lang === "en" ? "Components / Tooltip" : "组件 / 提示"} title="Tooltip 提示" lead="鼠标悬浮或聚焦时弹出的简短说明，用于补充说明、可访问性兜底，不承载关键信息。" actions={actions} />
      </section>

      <section id="tooltip-playground" className={docsSpacing.sectionStack}>
        <SectionLead title={lang === "en" ? "Playground" : "调试台"} description={lang === "en" ? "Switch existing Tooltip scenarios and copy the matching composition." : "切换现有提示场景，复制对应真实组合写法。"} />
        <TooltipProvider>
          <StandardScenarioPlayground slug="tooltip" examples={tooltipScenarioExamples} renderScenarioPreview={(id) => <TooltipPreview id={id} />} importCode={tooltipImportCode} lang={lang} />
        </TooltipProvider>
      </section>

      <section id="tooltip-overview" className={docsSpacing.sectionStack}>
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold tracking-tight">组件总览</h2>
          <p className="text-base text-muted-foreground">
            Tooltip 由 Provider（统一延迟）、Trigger（触发元素）、Content（提示气泡）组成，
            页面级建议只包一层 <code className="rounded bg-muted px-1.5 py-0.5">TooltipProvider</code>，
            视觉由公司 token 注入。
          </p>
        </div>
        <DocSurfaceCard elevated>
          <CardContent className="flex items-center gap-3 p-5">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  render={
                  <Button variant="ghost" size="icon-sm" aria-label="设置">
                      <SettingsIcon />
                    </Button>
                  } />
                
                <TooltipContent>设置</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span className="text-sm text-muted-foreground">悬浮左侧图标按钮查看提示</span>
          </CardContent>
        </DocSurfaceCard>
      </section>

      <section id="tooltip-preview" className={docsSpacing.sectionStack}>
        <SectionLead title={"场景示例"} description={"常见的三类用法：纯图标按钮说明、截断文本补全、自定义弹出方向。"} />




        
        <TooltipProvider>
          <DocSurfaceTableCard elevated>
            <Table className="min-w-[1000px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px] pl-4">用法</TableHead>
                  <TableHead className="w-[200px]">示例</TableHead>
                  <TableHead className="w-[260px]">使用意图</TableHead>
                  <TableHead>约束</TableHead>
                  <TableHead className="w-[340px] pr-4">推荐写法</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tooltipScenarioExamples.map((example) =>
                <TableRow key={example.id}>
                    <TableCell className="pl-4 align-top whitespace-normal">
                      <span className="font-medium">{example.title}</span>
                    </TableCell>
                    <TableCell className="align-top">
                      <TooltipPreview id={example.id} />
                    </TableCell>
                    <TableCell className="align-top whitespace-normal text-muted-foreground">
                      <p className="max-w-[260px] leading-6">{example.intent}</p>
                    </TableCell>
                    <TableCell className="align-top whitespace-normal text-muted-foreground">
                      <p className="min-w-[220px] leading-6">{example.rule}</p>
                    </TableCell>
                    <TableCell className="pr-4 align-top whitespace-normal">
                      <code className="overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-muted px-3 py-2 text-xs leading-6">
                        {example.code}
                      </code>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DocSurfaceTableCard>
        </TooltipProvider>
      </section>

      <section id="tooltip-usage" className={docsSpacing.sectionStack}>
        <SectionLead title={"使用方式"} description={"把 import 和 JSX 调用复制到业务页面里使用。"} />


        
        <DocSurfaceCard elevated>
          <CardContent className="p-5">
          <div className="grid gap-4">
            <CopyCodeBlock code={tooltipImportCode} label="Import" lang={lang} />
            <CopyCodeBlock code={tooltipUsageCode} label="调用" lang={lang} />
          </div>
          </CardContent>
        </DocSurfaceCard>
      </section>

      <section id="tooltip-props" className={docsSpacing.sectionStack}>
        <h2 className="text-xl font-bold tracking-tight">API 属性</h2>
        <DocSurfaceTableCard elevated>
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">属性 / 子组件</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>默认值</TableHead>
                <TableHead className="pr-4">描述</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tooltipPropRows.map((row) =>
              <TableRow key={row.prop}>
                  <TableCell className="pl-4 font-medium">{row.prop}</TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.type}</code>
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.defaultValue}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DocSurfaceTableCard>
      </section>

      <section id="tooltip-semantic-dom" className={docsSpacing.sectionStack}>
        <SectionLead title={"语义 DOM"} description={"Tooltip 源码来自 shadcn/ui，保持 open-code。这里记录 AI 和工程师应该理解的语义部位。"} />




        
        <DocSurfaceTableCard elevated>
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">部位</TableHead>
                <TableHead className="pr-4">说明</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tooltipSemanticDomRows.map((row) =>
              <TableRow key={row.part}>
                  <TableCell className="pl-4 font-medium">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.part}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DocSurfaceTableCard>
      </section>

      <section id="tooltip-do-dont" className={docsSpacing.sectionStack}>
        <SectionLead title={"正误示例"} description={"工程师和 AI 生成代码最容易犯的错误，照着做即可。"} />


        
        <DocDoDont rows={tooltipDoDontRows} elevated />
      </section>
    </div>);

}

function DialogPreview({ id }: {id: string;}) {
  if (id === "form") {
    return (
      <Dialog>
        <DialogTrigger render={<Button size="sm">新建项目</Button>} />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新建项目</DialogTitle>
            <DialogDescription>填写基本信息后即可创建。</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <Input placeholder="项目名称" />
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">取消</Button>} />
            <Button>创建</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>);

  }

  return (
    <Dialog>
      <DialogTrigger render={<Button size="sm" variant="outline">发布版本</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>确认发布该版本？</DialogTitle>
          <DialogDescription>发布后用户将立即看到最新内容。</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">再想想</Button>} />
          <Button>确认发布</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>);

}

function DialogPage({ actions, lang }: {actions: React.ReactNode;lang: Lang;}) {
  const dialogImportCode = `import {\n  Dialog,\n  DialogClose,\n  DialogContent,\n  DialogDescription,\n  DialogFooter,\n  DialogHeader,\n  DialogTitle,\n  DialogTrigger,\n} from "@/components/ui/dialog"`;
  const dialogUsageCode = `<Dialog>\n  <DialogTrigger render={<Button>新建项目</Button>} />\n  <DialogContent>\n    <DialogHeader>\n      <DialogTitle>新建项目</DialogTitle>\n      <DialogDescription>填写基本信息后即可创建</DialogDescription>\n    </DialogHeader>\n    <DialogFooter>\n      <DialogClose render={<Button variant="outline">取消</Button>} />\n      <Button>创建</Button>\n    </DialogFooter>\n  </DialogContent>\n</Dialog>`;

  return (
    <div className={docsSpacing.pageStack}>
      <section id="dialog" className="flex flex-col gap-2">
        <PageLead crumb={lang === "en" ? "Components / Dialog" : "组件 / 对话框"} title="Dialog 对话框" lead="以模态浮层承载需要用户聚焦完成的单一任务，如表单录入、操作确认。" actions={actions} />
      </section>

      <section id="dialog-playground" className={docsSpacing.sectionStack}>
        <SectionLead title={lang === "en" ? "Playground" : "调试台"} description={lang === "en" ? "Switch existing Dialog scenarios and copy the matching composition." : "切换现有对话框场景，复制对应真实组合写法。"} />
        <StandardScenarioPlayground slug="dialog" examples={dialogScenarioExamples} renderScenarioPreview={(id) => <DialogPreview id={id} />} importCode={dialogImportCode} lang={lang} />
      </section>

      <section id="dialog-overview" className={docsSpacing.sectionStack}>
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold tracking-tight">组件总览</h2>
          <p className="text-base text-muted-foreground">
            Dialog 由 Trigger（触发）、Content（主体，含遮罩）、Header/Footer（布局分组）、
            Title/Description（语义标题与说明）组成，统一用 <code className="rounded bg-muted px-1.5 py-0.5">data-slot</code> 标记。
          </p>
        </div>
        <DocSurfaceCard elevated>
          <CardContent className="flex items-center gap-3 p-5">
            <Dialog>
              <DialogTrigger render={<Button>打开示例对话框</Button>} />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>新建项目</DialogTitle>
                  <DialogDescription>填写基本信息后即可创建。</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-2">
                  <Input placeholder="项目名称" />
                </div>
                <DialogFooter>
                  <DialogClose render={<Button variant="outline">取消</Button>} />
                  <Button>创建</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <span className="text-sm text-muted-foreground">点击按钮查看弹窗结构</span>
          </CardContent>
        </DocSurfaceCard>
      </section>

      <section id="dialog-preview" className={docsSpacing.sectionStack}>
        <SectionLead title={"场景示例"} description={"常见的两类用法：表单弹窗、确认弹窗。"} />


        
          <DocSurfaceTableCard elevated>
          <Table className="min-w-[1000px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[160px] pl-4">用法</TableHead>
                <TableHead className="w-[200px]">示例</TableHead>
                <TableHead className="w-[260px]">使用意图</TableHead>
                <TableHead>约束</TableHead>
                <TableHead className="w-[360px] pr-4">推荐写法</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dialogScenarioExamples.map((example) =>
              <TableRow key={example.id}>
                  <TableCell className="pl-4 align-top whitespace-normal">
                    <span className="font-medium">{example.title}</span>
                  </TableCell>
                  <TableCell className="align-top">
                    <DialogPreview id={example.id} />
                  </TableCell>
                  <TableCell className="align-top whitespace-normal text-muted-foreground">
                    <p className="min-w-[180px] max-w-[260px] leading-6">{example.intent}</p>
                  </TableCell>
                  <TableCell className="align-top whitespace-normal text-muted-foreground">
                    <p className="min-w-[200px] max-w-[280px] leading-6">{example.rule}</p>
                  </TableCell>
                  <TableCell className="w-[360px] pr-4 align-top">
                    <code className="block max-w-[360px] overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-muted px-3 py-2 text-xs leading-6">
                      {example.code}
                    </code>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DocSurfaceTableCard>
      </section>

      <section id="dialog-usage" className={docsSpacing.sectionStack}>
        <SectionLead title={"使用方式"} description={"把 import 和 JSX 调用复制到业务页面里使用。"} />


        
        <DocSurfaceCard elevated>
          <CardContent className="p-5">
          <div className="grid gap-4">
            <CopyCodeBlock code={dialogImportCode} label="Import" lang={lang} />
            <CopyCodeBlock code={dialogUsageCode} label="调用" lang={lang} />
          </div>
          </CardContent>
        </DocSurfaceCard>
      </section>

      <section id="dialog-props" className={docsSpacing.sectionStack}>
        <h2 className="text-xl font-bold tracking-tight">API 属性</h2>
        <DocSurfaceTableCard elevated>
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">子组件</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>默认值</TableHead>
                <TableHead className="pr-4">描述</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dialogPropRows.map((row) =>
              <TableRow key={row.prop}>
                  <TableCell className="pl-4 font-medium">{row.prop}</TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.type}</code>
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.defaultValue}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DocSurfaceTableCard>
      </section>

      <section id="dialog-semantic-dom" className={docsSpacing.sectionStack}>
        <SectionLead title={"语义 DOM"} description={"Dialog 源码来自 shadcn/ui，保持 open-code。这里记录 AI 和工程师应该理解的语义部位。"} />




        
        <DocSurfaceTableCard elevated>
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">部位</TableHead>
                <TableHead className="pr-4">说明</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dialogSemanticDomRows.map((row) =>
              <TableRow key={row.part}>
                  <TableCell className="pl-4 font-medium">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.part}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DocSurfaceTableCard>
      </section>

      <section id="dialog-do-dont" className={docsSpacing.sectionStack}>
        <SectionLead title={"正误示例"} description={"工程师和 AI 生成代码最容易犯的错误，照着做即可。"} />


        
        <DocDoDont rows={dialogDoDontRows} elevated />
      </section>
    </div>);

}

function AlertDialogPreview({ id }: {id: string;}) {
  if (id === "destructive") {
    return (
      <AlertDialog>
        <AlertDialogTrigger render={<Button size="sm" variant="destructive">删除项目</Button>} />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除该项目？</AlertDialogTitle>
            <AlertDialogDescription>删除后数据无法恢复，请谨慎操作。</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel render={<Button variant="outline">取消</Button>} />
            <AlertDialogAction render={<Button variant="destructive">确认删除</Button>} />
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>);

  }

  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button size="sm" variant="outline">关闭编辑窗口</Button>} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>放弃当前修改？</AlertDialogTitle>
          <AlertDialogDescription>未保存的修改将会丢失。</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel render={<Button variant="outline">继续编辑</Button>} />
          <AlertDialogAction render={<Button variant="destructive">放弃修改</Button>} />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>);

}

function AlertDialogPage({ actions, lang }: {actions: React.ReactNode;lang: Lang;}) {
  const alertDialogImportCode = `import {\n  AlertDialog,\n  AlertDialogAction,\n  AlertDialogCancel,\n  AlertDialogContent,\n  AlertDialogDescription,\n  AlertDialogFooter,\n  AlertDialogHeader,\n  AlertDialogTitle,\n  AlertDialogTrigger,\n} from "@/components/ui/alert-dialog"`;
  const alertDialogUsageCode = `<AlertDialog>\n  <AlertDialogTrigger render={<Button variant="destructive">删除项目</Button>} />\n  <AlertDialogContent>\n    <AlertDialogHeader>\n      <AlertDialogTitle>确认删除该项目？</AlertDialogTitle>\n      <AlertDialogDescription>删除后数据无法恢复，请谨慎操作。</AlertDialogDescription>\n    </AlertDialogHeader>\n    <AlertDialogFooter>\n      <AlertDialogCancel render={<Button variant="outline">取消</Button>} />\n      <AlertDialogAction render={<Button variant="destructive">确认删除</Button>} />\n    </AlertDialogFooter>\n  </AlertDialogContent>\n</AlertDialog>`;

  return (
    <div className={docsSpacing.pageStack}>
      <section id="alert-dialog" className="flex flex-col gap-2">
        <PageLead crumb={lang === "en" ? "Components / Alert Dialog" : "组件 / 警告对话框"} title="Alert Dialog 警告对话框" lead="强制用户对不可逆或有重大影响的操作做出明确选择，不可通过点击遮罩或 Esc 关闭。" actions={actions} />
      </section>

      <section id="alert-dialog-playground" className={docsSpacing.sectionStack}>
        <SectionLead title={lang === "en" ? "Playground" : "调试台"} description={lang === "en" ? "Switch existing Alert Dialog scenarios and copy the matching composition." : "切换现有警告对话框场景，复制对应真实组合写法。"} />
        <StandardScenarioPlayground slug="alert-dialog" examples={alertDialogScenarioExamples} renderScenarioPreview={(id) => <AlertDialogPreview id={id} />} importCode={alertDialogImportCode} lang={lang} />
      </section>

      <section id="alert-dialog-overview" className={docsSpacing.sectionStack}>
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold tracking-tight">组件总览</h2>
          <p className="text-base text-muted-foreground">
            Alert Dialog 与 Dialog 结构相似，但语义角色是 <code className="rounded bg-muted px-1.5 py-0.5">alertdialog</code>，
            并且默认强制用户通过 Action / Cancel 明确做出选择，不能随意关闭。
          </p>
        </div>
        <DocSurfaceCard elevated>
          <CardContent className="flex items-center gap-3 p-5">
            <AlertDialog>
              <AlertDialogTrigger render={<Button variant="destructive">删除项目</Button>} />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>确认删除该项目？</AlertDialogTitle>
                  <AlertDialogDescription>删除后数据无法恢复，请谨慎操作。</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel render={<Button variant="outline">取消</Button>} />
                  <AlertDialogAction render={<Button variant="destructive">确认删除</Button>} />
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <span className="text-sm text-muted-foreground">点击按钮查看强制确认结构</span>
          </CardContent>
        </DocSurfaceCard>
      </section>

      <section id="alert-dialog-preview" className={docsSpacing.sectionStack}>
        <SectionLead title={"场景示例"} description={"常见的两类用法：破坏性操作确认、离开未保存提示。"} />


        
          <DocSurfaceTableCard elevated>
          <Table className="min-w-[1000px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px] pl-4">用法</TableHead>
                <TableHead className="w-[200px]">示例</TableHead>
                <TableHead className="w-[260px]">使用意图</TableHead>
                <TableHead>约束</TableHead>
                <TableHead className="w-[360px] pr-4">推荐写法</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alertDialogScenarioExamples.map((example) =>
              <TableRow key={example.id}>
                  <TableCell className="pl-4 align-top whitespace-normal">
                    <span className="font-medium">{example.title}</span>
                  </TableCell>
                  <TableCell className="align-top">
                    <AlertDialogPreview id={example.id} />
                  </TableCell>
                  <TableCell className="align-top whitespace-normal text-muted-foreground">
                    <p className="min-w-[180px] max-w-[260px] leading-6">{example.intent}</p>
                  </TableCell>
                  <TableCell className="align-top whitespace-normal text-muted-foreground">
                    <p className="min-w-[200px] max-w-[280px] leading-6">{example.rule}</p>
                  </TableCell>
                  <TableCell className="w-[360px] pr-4 align-top">
                    <code className="block max-w-[360px] overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-muted px-3 py-2 text-xs leading-6">
                      {example.code}
                    </code>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DocSurfaceTableCard>
      </section>

      <section id="alert-dialog-usage" className={docsSpacing.sectionStack}>
        <SectionLead title={"使用方式"} description={"把 import 和 JSX 调用复制到业务页面里使用。"} />


        
        <DocSurfaceCard elevated>
          <CardContent className="p-5">
          <div className="grid gap-4">
            <CopyCodeBlock code={alertDialogImportCode} label="Import" lang={lang} />
            <CopyCodeBlock code={alertDialogUsageCode} label="调用" lang={lang} />
          </div>
          </CardContent>
        </DocSurfaceCard>
      </section>

      <section id="alert-dialog-props" className={docsSpacing.sectionStack}>
        <h2 className="text-xl font-bold tracking-tight">API 属性</h2>
        <DocSurfaceTableCard elevated>
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">子组件</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>默认值</TableHead>
                <TableHead className="pr-4">描述</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alertDialogPropRows.map((row) =>
              <TableRow key={row.prop}>
                  <TableCell className="pl-4 font-medium">{row.prop}</TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.type}</code>
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.defaultValue}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DocSurfaceTableCard>
      </section>

      <section id="alert-dialog-semantic-dom" className={docsSpacing.sectionStack}>
        <SectionLead title={"语义 DOM"} description={"Alert Dialog 源码来自 shadcn/ui，保持 open-code。这里记录 AI 和工程师应该理解的语义部位。"} />




        
        <DocSurfaceTableCard elevated>
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">部位</TableHead>
                <TableHead className="pr-4">说明</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alertDialogSemanticDomRows.map((row) =>
              <TableRow key={row.part}>
                  <TableCell className="pl-4 font-medium">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.part}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DocSurfaceTableCard>
      </section>

      <section id="alert-dialog-do-dont" className={docsSpacing.sectionStack}>
        <SectionLead title={"正误示例"} description={"工程师和 AI 生成代码最容易犯的错误，照着做即可。"} />


        
        <DocDoDont rows={alertDialogDoDontRows} elevated />
      </section>
    </div>);

}

function SheetPreview({ id }: {id: string;}) {
  if (id === "right-form") {
    return (
      <Sheet>
        <SheetTrigger render={<Button size="sm" variant="outline">编辑成员</Button>} />
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>编辑成员</SheetTitle>
            <SheetDescription>修改信息后点击保存生效。</SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 px-4">
            <Input placeholder="姓名" />
          </div>
          <SheetFooter>
            <Button>保存</Button>
            <SheetClose render={<Button variant="outline">取消</Button>} />
          </SheetFooter>
        </SheetContent>
      </Sheet>);

  }

  return (
    <Sheet>
      <SheetTrigger render={<Button size="sm" variant="outline">更多操作</Button>} />
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>更多操作</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-2 px-4 pb-4">
          <Button variant="outline">分享</Button>
          <Button variant="outline">归档</Button>
          <Button variant="destructive">删除</Button>
        </div>
      </SheetContent>
    </Sheet>);

}

function SheetPage({ actions, lang }: {actions: React.ReactNode;lang: Lang;}) {
  const sheetImportCode = `import {\n  Sheet,\n  SheetClose,\n  SheetContent,\n  SheetDescription,\n  SheetFooter,\n  SheetHeader,\n  SheetTitle,\n  SheetTrigger,\n} from "@/components/ui/sheet"`;
  const sheetUsageCode = `<Sheet>\n  <SheetTrigger render={<Button variant="outline">编辑</Button>} />\n  <SheetContent side="right">\n    <SheetHeader>\n      <SheetTitle>编辑成员</SheetTitle>\n      <SheetDescription>修改信息后点击保存生效</SheetDescription>\n    </SheetHeader>\n    <SheetFooter>\n      <Button>保存</Button>\n      <SheetClose render={<Button variant="outline">取消</Button>} />\n    </SheetFooter>\n  </SheetContent>\n</Sheet>`;

  return (
    <div className={docsSpacing.pageStack}>
      <section id="sheet" className="flex flex-col gap-2">
        <PageLead crumb={lang === "en" ? "Components / Sheet" : "组件 / 抽屉"} title="Sheet 抽屉" lead="从屏幕边缘滑出的浮层面板，用于在不离开当前上下文的情况下查看详情或执行操作。" actions={actions} />
      </section>

      <section id="sheet-playground" className={docsSpacing.sectionStack}>
        <SectionLead title={lang === "en" ? "Playground" : "调试台"} description={lang === "en" ? "Switch existing Sheet scenarios and copy the matching composition." : "切换现有抽屉场景，复制对应真实组合写法。"} />
        <StandardScenarioPlayground slug="sheet" examples={sheetScenarioExamples} renderScenarioPreview={(id) => <SheetPreview id={id} />} importCode={sheetImportCode} lang={lang} />
      </section>

      <section id="sheet-overview" className={docsSpacing.sectionStack}>
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold tracking-tight">组件总览</h2>
          <p className="text-base text-muted-foreground">
            Sheet 与 Dialog 结构相似，区别在于以 <code className="rounded bg-muted px-1.5 py-0.5">side</code> 控制从屏幕哪一侧滑出，
            适合承载和当前页面强相关的详情或操作。
          </p>
        </div>
        <DocSurfaceCard elevated>
          <CardContent className="flex items-center gap-3 p-5">
            <Sheet>
              <SheetTrigger render={<Button>打开示例抽屉</Button>} />
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>编辑成员</SheetTitle>
                  <SheetDescription>修改信息后点击保存生效。</SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 px-4">
                  <Input placeholder="姓名" />
                </div>
                <SheetFooter>
                  <Button>保存</Button>
                  <SheetClose render={<Button variant="outline">取消</Button>} />
                </SheetFooter>
              </SheetContent>
            </Sheet>
            <span className="text-sm text-muted-foreground">点击按钮查看从右侧滑出的面板</span>
          </CardContent>
        </DocSurfaceCard>
      </section>

      <section id="sheet-preview" className={docsSpacing.sectionStack}>
        <SectionLead title={"场景示例"} description={"常见的两类用法：右侧编辑面板、底部操作面板。"} />


        
        <DocSurfaceTableCard elevated>
          <Table className="min-w-[1000px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[160px] pl-4">用法</TableHead>
                <TableHead className="w-[200px]">示例</TableHead>
                <TableHead className="w-[260px]">使用意图</TableHead>
                <TableHead>约束</TableHead>
                <TableHead className="w-[360px] pr-4">推荐写法</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sheetScenarioExamples.map((example) =>
              <TableRow key={example.id}>
                  <TableCell className="pl-4 align-top whitespace-normal">
                    <span className="font-medium">{example.title}</span>
                  </TableCell>
                  <TableCell className="align-top">
                    <SheetPreview id={example.id} />
                  </TableCell>
                  <TableCell className="align-top whitespace-normal text-muted-foreground">
                    <p className="min-w-[180px] max-w-[260px] leading-6">{example.intent}</p>
                  </TableCell>
                  <TableCell className="align-top whitespace-normal text-muted-foreground">
                    <p className="min-w-[200px] max-w-[280px] leading-6">{example.rule}</p>
                  </TableCell>
                  <TableCell className="w-[360px] pr-4 align-top">
                    <code className="block max-w-[360px] overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-muted px-3 py-2 text-xs leading-6">
                      {example.code}
                    </code>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DocSurfaceTableCard>
      </section>

      <section id="sheet-usage" className={docsSpacing.sectionStack}>
        <SectionLead title={"使用方式"} description={"把 import 和 JSX 调用复制到业务页面里使用。"} />


        
        <DocSurfaceCard elevated>
          <CardContent className="p-5">
          <div className="grid gap-4">
            <CopyCodeBlock code={sheetImportCode} label="Import" lang={lang} />
            <CopyCodeBlock code={sheetUsageCode} label="调用" lang={lang} />
          </div>
          </CardContent>
        </DocSurfaceCard>
      </section>

      <section id="sheet-props" className={docsSpacing.sectionStack}>
        <h2 className="text-xl font-bold tracking-tight">API 属性</h2>
        <DocSurfaceTableCard elevated>
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">属性 / 子组件</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>默认值</TableHead>
                <TableHead className="pr-4">描述</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sheetPropRows.map((row) =>
              <TableRow key={row.prop}>
                  <TableCell className="pl-4 font-medium">{row.prop}</TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.type}</code>
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.defaultValue}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DocSurfaceTableCard>
      </section>

      <section id="sheet-semantic-dom" className={docsSpacing.sectionStack}>
        <SectionLead title={"语义 DOM"} description={"Sheet 源码来自 shadcn/ui，保持 open-code。这里记录 AI 和工程师应该理解的语义部位。"} />




        
        <DocSurfaceTableCard elevated>
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">部位</TableHead>
                <TableHead className="pr-4">说明</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sheetSemanticDomRows.map((row) =>
              <TableRow key={row.part}>
                  <TableCell className="pl-4 font-medium">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.part}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DocSurfaceTableCard>
      </section>

      <section id="sheet-do-dont" className={docsSpacing.sectionStack}>
        <SectionLead title={"正误示例"} description={"工程师和 AI 生成代码最容易犯的错误，照着做即可。"} />


        
        <DocDoDont rows={sheetDoDontRows} elevated />
      </section>
    </div>);

}

function SkeletonPreview({ id }: {id: string;}) {
  if (id === "text-lines") {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-[240px]" />
        <Skeleton className="h-4 w-[180px]" />
      </div>);

  }

  return (
    <div className="flex items-center gap-4">
      <Skeleton className="size-12 rounded-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-[160px]" />
        <Skeleton className="h-4 w-[120px]" />
      </div>
    </div>);

}

function SkeletonPage({ actions, lang }: {actions: React.ReactNode;lang: Lang;}) {
  const skeletonImportCode = `import { Skeleton } from "@/components/ui/skeleton"`;
  const skeletonUsageCode = `<div className="flex items-center gap-4">\n  <Skeleton className="size-12 rounded-full" />\n  <div className="flex flex-col gap-2">\n    <Skeleton className="h-4 w-[160px]" />\n    <Skeleton className="h-4 w-[120px]" />\n  </div>\n</div>`;

  return (
    <div className={docsSpacing.pageStack}>
      <section id="skeleton" className="flex flex-col gap-2">
        <PageLead crumb={lang === "en" ? "Components / Skeleton" : "组件 / 骨架屏"} title="Skeleton 骨架屏" lead="内容加载完成前展示的占位块，用呼吸动画提示正在加载，并提前还原真实内容的大致结构。" actions={actions} />
      </section>

      <section id="skeleton-playground" className={docsSpacing.sectionStack}>
        <SectionLead title={lang === "en" ? "Playground" : "调试台"} description={lang === "en" ? "Switch existing Skeleton scenarios and copy the matching composition." : "切换现有骨架屏场景，复制对应真实组合写法。"} />
        <StandardScenarioPlayground slug="skeleton" examples={skeletonScenarioExamples} renderScenarioPreview={(id) => <SkeletonPreview id={id} />} importCode={skeletonImportCode} lang={lang} />
      </section>

      <section id="skeleton-overview" className={docsSpacing.sectionStack}>
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold tracking-tight">组件总览</h2>
          <p className="text-base text-muted-foreground">
            Skeleton 本质是一个带 <code className="rounded bg-muted px-1.5 py-0.5">animate-pulse</code> 动效的占位块，
            通过 className 控制宽高与形状来还原真实内容结构。
          </p>
        </div>
        <DocSurfaceCard elevated>
          <CardContent className="flex items-center gap-4 p-5">
            <Skeleton className="size-12 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-[160px]" />
              <Skeleton className="h-4 w-[120px]" />
            </div>
          </CardContent>
        </DocSurfaceCard>
      </section>

      <section id="skeleton-preview" className={docsSpacing.sectionStack}>
        <SectionLead title={"场景示例"} description={"常见的两类用法：文本占位、卡片媒体占位。"} />


        
        <DocSurfaceTableCard elevated>
          <Table className="min-w-[1000px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[160px] pl-4">用法</TableHead>
                <TableHead className="w-[200px]">示例</TableHead>
                <TableHead className="w-[260px]">使用意图</TableHead>
                <TableHead>约束</TableHead>
                <TableHead className="w-[360px] pr-4">推荐写法</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skeletonScenarioExamples.map((example) =>
              <TableRow key={example.id}>
                  <TableCell className="pl-4 align-top whitespace-normal">
                    <span className="font-medium">{example.title}</span>
                  </TableCell>
                  <TableCell className="align-top">
                    <SkeletonPreview id={example.id} />
                  </TableCell>
                  <TableCell className="align-top whitespace-normal text-muted-foreground">
                    <p className="min-w-[180px] max-w-[260px] leading-6">{example.intent}</p>
                  </TableCell>
                  <TableCell className="align-top whitespace-normal text-muted-foreground">
                    <p className="min-w-[200px] max-w-[280px] leading-6">{example.rule}</p>
                  </TableCell>
                  <TableCell className="w-[360px] pr-4 align-top">
                    <code className="block max-w-[360px] overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-muted px-3 py-2 text-xs leading-6">
                      {example.code}
                    </code>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DocSurfaceTableCard>
      </section>

      <section id="skeleton-usage" className={docsSpacing.sectionStack}>
        <SectionLead title={"使用方式"} description={"把 import 和 JSX 调用复制到业务页面里使用。"} />


        
        <DocSurfaceCard elevated>
          <CardContent className="p-5">
          <div className="grid gap-4">
            <CopyCodeBlock code={skeletonImportCode} label="Import" lang={lang} />
            <CopyCodeBlock code={skeletonUsageCode} label="调用" lang={lang} />
          </div>
          </CardContent>
        </DocSurfaceCard>
      </section>

      <section id="skeleton-props" className={docsSpacing.sectionStack}>
        <h2 className="text-xl font-bold tracking-tight">API 属性</h2>
        <DocSurfaceTableCard elevated>
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">属性 / 子组件</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>默认值</TableHead>
                <TableHead className="pr-4">描述</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skeletonPropRows.map((row) =>
              <TableRow key={row.prop}>
                  <TableCell className="pl-4 font-medium">{row.prop}</TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.type}</code>
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.defaultValue}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DocSurfaceTableCard>
      </section>

      <section id="skeleton-semantic-dom" className={docsSpacing.sectionStack}>
        <SectionLead title={"语义 DOM"} description={"Skeleton 源码来自 shadcn/ui，保持 open-code。这里记录 AI 和工程师应该理解的语义部位。"} />




        
        <DocSurfaceTableCard elevated>
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">部位</TableHead>
                <TableHead className="pr-4">说明</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skeletonSemanticDomRows.map((row) =>
              <TableRow key={row.part}>
                  <TableCell className="pl-4 font-medium">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.part}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DocSurfaceTableCard>
      </section>

      <section id="skeleton-do-dont" className={docsSpacing.sectionStack}>
        <SectionLead title={"正误示例"} description={"工程师和 AI 生成代码最容易犯的错误，照着做即可。"} />


        
        <DocDoDont rows={skeletonDoDontRows} elevated />
      </section>
    </div>);

}

function AvatarOverview({ lang }: {lang: Lang;}) {
  return (
    <DocSurfaceCard elevated>
      <CardContent className="grid gap-6 p-6">
      <div className="grid gap-3">
        <h3 className="text-sm font-medium text-muted-foreground">{lang === "en" ? "Types" : "类型"}</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Avatar><AvatarImage src="/avatars/01.jpg" alt="陈昊" /><AvatarFallback>陈</AvatarFallback></Avatar>
          <Avatar shape="square"><AvatarFallback colorful><FolderFilledIcon /></AvatarFallback></Avatar>
          <Avatar><AvatarFallback colorful><UserFilledIcon /></AvatarFallback></Avatar>
          <Avatar><AvatarFallback colorful>{avatarInitials("欧阳娜娜")}</AvatarFallback></Avatar>
          <AvatarGroup>
            {["张三", "王五", "赵六"].map((n) =>
            <Avatar key={n}><AvatarFallback colorful>{avatarInitials(n)}</AvatarFallback></Avatar>
            )}
            <AvatarGroupCount>+3</AvatarGroupCount>
          </AvatarGroup>
          <AvatarComposite>
            {["陈昊", "林舟", "苏婷", "周也"].map((name, index) =>
            <Avatar key={name}>
              <AvatarImage src={`/avatars/0${index + 1}.jpg`} alt={name} />
              <AvatarFallback colorful>{avatarInitials(name)}</AvatarFallback>
            </Avatar>
            )}
          </AvatarComposite>
        </div>
      </div>
      <div className="border-t border-dashed border-border" />
      <div className="grid gap-3">
        <h3 className="text-sm font-medium text-muted-foreground">{lang === "en" ? "Sizes" : "尺寸"}</h3>
        <div className="flex flex-wrap items-end gap-3">
          {(["xs", "sm", "default", "lg", "xl"] as const).map((s) =>
          <Avatar key={s} size={s}><AvatarImage src="/avatars/01.jpg" alt="陈昊" /><AvatarFallback>陈</AvatarFallback></Avatar>
          )}
        </div>
      </div>
      </CardContent>
    </DocSurfaceCard>);

}

function SeparatorOverview({ lang }: {lang: Lang;}) {
  return (
    <DocSurfaceCard elevated>
      <CardContent className="grid gap-6 p-6">
      <div className="grid gap-3">
        <h3 className="text-sm font-medium text-muted-foreground">{lang === "en" ? "Types" : "类型"}</h3>
        <div className="flex flex-wrap items-center gap-8">
          <div className="flex max-w-[200px] flex-col gap-3">
            <p className="text-sm">{lang === "en" ? "First block" : "第一段内容"}</p>
            <Separator />
            <p className="text-sm">{lang === "en" ? "Second block" : "第二段内容"}</p>
          </div>
          <div className="flex h-5 items-center gap-3 text-sm">
            <span>{lang === "en" ? "Edit" : "编辑"}</span>
            <Separator orientation="vertical" />
            <span>{lang === "en" ? "Share" : "分享"}</span>
            <Separator orientation="vertical" />
            <span>{lang === "en" ? "Delete" : "删除"}</span>
          </div>
        </div>
      </div>
      </CardContent>
    </DocSurfaceCard>);

}

function LinkOverview({ lang }: {lang: Lang;}) {
  return (
    <DocSurfaceCard elevated>
      <CardContent className="grid gap-6 p-6">
      <div className="grid gap-3">
        <h3 className="text-sm font-medium text-muted-foreground">{lang === "en" ? "Types" : "类型"}</h3>
        <div className="flex flex-wrap items-center gap-5">
          <Link href="#link">{lang === "en" ? "Basic link" : "基础文字链接"}</Link>
          <Link href="#link" underline="always">{lang === "en" ? "Underlined link" : "下划线文字链接"}</Link>
          {linkTones.filter((t) => t.tone !== "standard").map((t) =>
          <Link key={t.tone} href="#link" tone={t.tone}>{t.label}链接</Link>
          )}
        </div>
      </div>
      <div className="border-t border-dashed border-border" />
      <div className="grid gap-3">
        <h3 className="text-sm font-medium text-muted-foreground">{lang === "en" ? "State" : "状态"}</h3>
        <div className="flex flex-wrap items-center gap-5">
          <Link href="#link" disabled>{lang === "en" ? "Disabled" : "禁用"}</Link>
        </div>
      </div>
      <div className="border-t border-dashed border-border" />
      <div className="grid gap-3">
        <h3 className="text-sm font-medium text-muted-foreground">{lang === "en" ? "Icon" : "图标"}</h3>
        <div className="flex flex-wrap items-center gap-5">
          <Link href="#link"><LinkIcon data-icon="inline-start" />{lang === "en" ? "With icon" : "带图标"}</Link>
          <Link href="#link">{lang === "en" ? "Copy link" : "复制链接"}<CopyIcon data-icon="inline-end" /></Link>
        </div>
      </div>
      <div className="border-t border-dashed border-border" />
      <div className="grid gap-3">
        <h3 className="text-sm font-medium text-muted-foreground">{lang === "en" ? "Sizes" : "尺寸"}</h3>
        <div className="flex flex-wrap items-baseline gap-5">
          <Link href="#link" size="sm">{lang === "en" ? "Small" : "小 sm"}</Link>
          <Link href="#link">{lang === "en" ? "Default" : "默认 default"}</Link>
          <Link href="#link" size="lg">{lang === "en" ? "Large" : "大 lg"}</Link>
        </div>
      </div>
      </CardContent>
    </DocSurfaceCard>);

}

type AvatarPlaygroundQuantity = "single" | "group" | "chat";
type AvatarPlaygroundShape = "circle" | "square";
type AvatarPlaygroundStyle = "image" | "text" | "icon";
type AvatarPlaygroundColor = "neutral" | "colorful";
type AvatarPlaygroundSize = "xs" | "sm" | "default" | "lg" | "xl";
type AvatarPlaygroundStatus = "none" | "online" | "away" | "busy" | "offline";
type AvatarPlaygroundCount = "2" | "3" | "4";

const avatarPlaygroundMembers = ["陈昊", "林舟", "苏婷", "周也", "王五", "赵六"];
const avatarGroupVisibleCount = 3;

function renderAvatarStatus(status: AvatarPlaygroundStatus) {
  return status === "none" ? null : <AvatarBadge status={status} />;
}

function renderAvatarPlayground(c: Record<string, string>) {
  const quantity = c.quantity as AvatarPlaygroundQuantity;
  const shape = c.shape as AvatarPlaygroundShape;
  const style = c.style as AvatarPlaygroundStyle;
  const color = c.color as AvatarPlaygroundColor;
  const size = c.size as AvatarPlaygroundSize;
  const status = c.status as AvatarPlaygroundStatus;
  const count = c.count as AvatarPlaygroundCount;
  const colorful = color === "colorful";

  if (quantity === "chat") {
    return (
      <AvatarComposite max={Number(count) as 2 | 3 | 4} size={size}>
        {avatarPlaygroundMembers.map((name, index) => (
          <Avatar key={name}>
            {style === "image" ? <AvatarImage src={`/avatars/0${index + 1}.jpg`} alt={name} /> : null}
            <AvatarFallback colorful={colorful}>
              {style === "icon" ? <UserFilledIcon /> : avatarInitials(name)}
            </AvatarFallback>
          </Avatar>
        ))}
      </AvatarComposite>);
  }

  if (quantity === "group") {
    const visibleMembers = avatarPlaygroundMembers.slice(0, avatarGroupVisibleCount);
    const restMembers = avatarPlaygroundMembers.slice(avatarGroupVisibleCount);
    return (
      <TooltipProvider>
        <AvatarGroup>
          {visibleMembers.map((name, index) => (
            <Avatar key={name} size={size}>
              {style === "image" ? <AvatarImage src={`/avatars/0${index + 1}.jpg`} alt={name} /> : null}
              <AvatarFallback colorful={colorful}>
                {style === "icon" ? <UserFilledIcon /> : avatarInitials(name)}
              </AvatarFallback>
            </Avatar>
          ))}
          {restMembers.length > 0 ? (
            <Tooltip>
              <TooltipTrigger render={<AvatarGroupCount tabIndex={0} aria-label={`剩余成员：${restMembers.join("、")}`} className="cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring">+{restMembers.length}</AvatarGroupCount>} />
              <TooltipContent>{restMembers.join("、")}</TooltipContent>
            </Tooltip>
          ) : null}
        </AvatarGroup>
      </TooltipProvider>);
  }

  const content = style === "icon"
    ? <UserFilledIcon />
    : avatarInitials("陈昊");

  return (
    <Avatar size={size} shape={shape}>
      {style === "image" ? <AvatarImage src="/avatars/01.jpg" alt="陈昊" /> : null}
      <AvatarFallback colorful={colorful}>{content}</AvatarFallback>
      {renderAvatarStatus(status)}
    </Avatar>);
}

function genAvatarPlaygroundCode(c: Record<string, string>) {
  const quantity = c.quantity as AvatarPlaygroundQuantity;
  const shape = c.shape as AvatarPlaygroundShape;
  const style = c.style as AvatarPlaygroundStyle;
  const color = c.color as AvatarPlaygroundColor;
  const size = c.size as AvatarPlaygroundSize;
  const status = c.status as AvatarPlaygroundStatus;
  const count = c.count as AvatarPlaygroundCount;
  const sizeAttr = size === "default" ? "" : ` size="${size}"`;
  const shapeAttr = shape === "circle" ? "" : ` shape="${shape}"`;
  const colorAttr = color === "colorful" ? " colorful" : "";
  const imageLine = style === "image" ? `\n  <AvatarImage src="/avatars/01.jpg" alt="陈昊" />` : "";
  const fallbackContent = style === "icon" ? "\n    <UserFilledIcon />\n  " : `陈`;
  const statusLine = status === "none" ? "" : `\n  <AvatarBadge status="${status}" />`;

  if (quantity === "chat") {
    const imageCompositeLine = style === "image" ? `\n      <AvatarImage src={member.avatar} alt={member.name} />` : "";
    const compositeFallbackContent = style === "icon" ? "\n        <UserFilledIcon />\n      " : "{avatarInitials(member.name)}";
    const iconImport = style === "icon" ? `\nimport { UserFilledIcon } from "@/lib/icons"` : "";
    return `import { Avatar, AvatarComposite, AvatarFallback, AvatarImage, avatarInitials } from "@/components/ui/avatar"${iconImport}

<AvatarComposite max={${count}}${sizeAttr}>
  {members.map((member) => (
    <Avatar key={member.name}>${imageCompositeLine}
      <AvatarFallback${colorAttr}>${compositeFallbackContent}</AvatarFallback>
    </Avatar>
  ))}
</AvatarComposite>`;
  }

  if (quantity === "group") {
    const imageGroupLine = style === "image" ? `\n      <AvatarImage src={member.avatar} alt={member.name} />` : "";
    const groupFallbackContent = style === "icon" ? "\n        <UserFilledIcon />\n      " : "{avatarInitials(member.name)}";
    const iconImport = style === "icon" ? `\nimport { UserFilledIcon } from "@/lib/icons"` : "";
    return `import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage, avatarInitials } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"${iconImport}

const visibleMembers = members.slice(0, 3)
const restMembers = members.slice(3)

<TooltipProvider>
  <AvatarGroup>
    {visibleMembers.map((member) => (
      <Avatar key={member.name}${sizeAttr}>${imageGroupLine}
        <AvatarFallback${colorAttr}>${groupFallbackContent}</AvatarFallback>
      </Avatar>
    ))}
    {restMembers.length > 0 ? (
      <Tooltip>
        <TooltipTrigger render={<AvatarGroupCount tabIndex={0} aria-label={\`剩余成员：\${restMembers.map((member) => member.name).join("、")}\`}>+{restMembers.length}</AvatarGroupCount>} />
        <TooltipContent>{restMembers.map((member) => member.name).join("、")}</TooltipContent>
      </Tooltip>
    ) : null}
  </AvatarGroup>
</TooltipProvider>`;
  }

  if (style === "icon") {
    return `import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserFilledIcon } from "@/lib/icons"

<Avatar${sizeAttr}${shapeAttr}>${imageLine}
  <AvatarFallback${colorAttr}>${fallbackContent}</AvatarFallback>${statusLine}
</Avatar>`;
  }

  return `import { Avatar, AvatarBadge, AvatarFallback, AvatarImage, avatarInitials } from "@/components/ui/avatar"

<Avatar${sizeAttr}${shapeAttr}>${imageLine}
  <AvatarFallback${colorAttr}>{avatarInitials("陈昊")}</AvatarFallback>${statusLine}
</Avatar>`;
}

const avatarPlaygroundConfig = {
  props: componentPlaygroundPropsFromManifest(componentPlaygroundsManifest.components.avatar),
  initial: componentPlaygroundsManifest.components.avatar.initial,
  guidanceKey: componentPlaygroundsManifest.components.avatar.guidanceKey,
  renderOne: renderAvatarPlayground,
  genCode: genAvatarPlaygroundCode
};

type StandardScenarioExample = {
  id: string;
  title: string;
  intent: string;
  rule: string;
  code: string;
  group?: string;
  spec?: string;
};

function StandardScenarioPlayground({
  slug: _slug,
  examples,
  renderScenarioPreview,
  importCode,
  lang
}: {
  slug: string;
  examples: StandardScenarioExample[];
  renderScenarioPreview: (id: string) => React.ReactNode;
  importCode: string;
  lang: Lang;
}) {
  const first = examples[0];
  if (!first) return null;

  return (
    <ComponentPlayground
      lang={lang}
      config={{
        props: [
          {
            key: "scenario",
            zh: "场景",
            en: "Scenario",
            propName: "composition",
            type: "segment",
            options: examples.map((example) => ({
              value: example.id,
              label: example.spec ? `${example.title} ${example.spec}` : example.title,
              labelEn: example.spec ? `${example.title} ${example.spec}` : example.title,
              intent: example.intent,
              intentEn: example.intent,
              constraint: example.rule,
              constraintEn: example.rule
            }))
          }
        ],
        initial: { scenario: first.id },
        guidanceKey: "scenario",
        renderOne: (values) => renderScenarioPreview(values.scenario),
        genCode: (values) => {
          const selected = examples.find((example) => example.id === values.scenario) ?? first;
          return `${importCode}\n\n${selected.code}`;
        }
      }}
    />);
}

function StandardDocPage({
  slug,
  title,
  lead,
  playground,
  overview,
  overviewMatrix,
  hideOverview,
  hideScenarioExamples,
  hideUsage,
  scenarioExamples,
  scenarioFilters,
  scenarioLayout,
  renderScenarioPreview,
  importCode,
  usageCode,
  propRows,
  semanticDomRows,
  doDontRows,
  actions,
  lang


















}: {slug: string;title: string;lead: string;playground?: React.ReactNode;overview: React.ReactNode;overviewMatrix?: React.ReactNode;hideOverview?: boolean;hideScenarioExamples?: boolean;hideUsage?: boolean;scenarioExamples: {id: string;title: string;intent: string;rule: string;code: string;group?: string;spec?: string;}[];scenarioFilters?: {value: string;label: string;labelEn?: string;}[];scenarioLayout?: "table" | "stack";renderScenarioPreview: (id: string) => React.ReactNode;importCode: string;usageCode: string;propRows: {prop: string;type: string;defaultValue: string;desc: string;}[];semanticDomRows: {part: string;desc: string;}[];doDontRows: {do: string;dont: string;}[];actions: React.ReactNode;lang: Lang;}) {
  const titleMeta = useContext(PageTitleMetaContext);
  const displayTitle = getDisplayTitle(title, lang === "en" ? undefined : titleMeta);
  const resolvedPlayground = playground ?? (
    componentPlaygroundsManifest.autoScenarioComponents?.includes(slug) ?
    <StandardScenarioPlayground
      slug={slug}
      examples={scenarioExamples}
      renderScenarioPreview={renderScenarioPreview}
      importCode={importCode}
      lang={lang}
    /> :
    null
  );

  return (
    <div className={docsSpacing.pageStack}>
      <section id={slug} className="flex flex-col gap-2">
        <FxPageLead
          crumb={lang === "en" ? `Components / ${title}` : `组件 / ${displayTitle}`}
          title={displayTitle}
          titleMeta={lang === "en" ? undefined : titleMeta}
          lead={lead}
          actions={actions} />
        
      </section>

      {resolvedPlayground ?
      <section id={`${slug}-playground`} className={docsSpacing.sectionStack}>
          <SectionLead
            title={lang === "en" ? "Playground" : "调试台"}
            description={lang === "en" ? "Pick a scenario or tweak props live, then copy the generated code." : "选场景或实时调属性，预览随之变化，写法可一键复制。"}
          />
          {resolvedPlayground}
        </section> :
      null}

      {!hideOverview ? <section id={`${slug}-overview`} className={docsSpacing.sectionStack}>
        <SectionLead
          title={lang === "en" ? "Overview" : "组件总览"}
          description={lang === "en" ? "A compact look at the component to quickly see what it looks like." : "紧凑展示该组件的样子，用来快速查看长什么样。"}
        />
        {overviewMatrix ?
        overviewMatrix :

        <DocSurfaceCard elevated>
            <CardContent className="flex items-center gap-3 p-5">{overview}</CardContent>
          </DocSurfaceCard>
        }
      </section> : null}

      {!hideScenarioExamples ? <section id={`${slug}-preview`} className={docsSpacing.sectionStack}>
        <SectionLead title={"场景示例"} description={"常见用法与适用场景。"} />


        
        <ScenarioTable
          lang={lang}
          layout={scenarioLayout}
          filters={scenarioFilters}
          rows={scenarioExamples.map((example) => ({
            key: example.id,
            group: example.group,
            title: example.title,
            preview: renderScenarioPreview(example.id),
            spec: example.spec,
            intent: example.intent,
            constraint: example.rule,
            code: example.code
          }))}
          elevated />
        
      </section> : null}

      {!hideUsage ? <section id={`${slug}-usage`} className={docsSpacing.sectionStack}>
        <SectionLead title={"使用方式"} description={

        usageCode ? "把 import 和完整组装写法复制到业务页面里使用。" : "复制 import 即可；具体 JSX 写法见上方「场景示例」的推荐写法列。"} />
        
        <DocSurfaceCard elevated>
          <CardContent className="grid gap-4 p-5">
            <CopyCodeBlock code={importCode} label="Import" lang={lang} />
            {usageCode ? <CopyCodeBlock code={usageCode} label="调用" lang={lang} /> : null}
          </CardContent>
        </DocSurfaceCard>
      </section> : null}

      <section id={`${slug}-props`} className={docsSpacing.sectionStack}>
        <SectionLead title="API 属性" />
        <DocSurfaceTableCard elevated>
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">属性 / 子组件</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>默认值</TableHead>
                <TableHead className="pr-4">描述</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {propRows.map((row) =>
              <TableRow key={row.prop}>
                  <TableCell className="pl-4 font-medium">{row.prop}</TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.type}</code>
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.defaultValue}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DocSurfaceTableCard>
      </section>

      <section id={`${slug}-semantic-dom`} className={docsSpacing.sectionStack}>
        <SectionLead title={"语义 DOM"} description={"源码来自 shadcn/ui，保持 open-code。这里记录 AI 和工程师应该理解的语义部位。"} />




        
        <DocSurfaceTableCard elevated>
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">部位</TableHead>
                <TableHead className="pr-4">说明</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {semanticDomRows.map((row) =>
              <TableRow key={row.part}>
                  <TableCell className="pl-4 font-medium">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.part}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DocSurfaceTableCard>
      </section>

      <section id={`${slug}-do-dont`} className={docsSpacing.sectionStack}>
        <SectionLead title={"正误示例"} description={"工程师和 AI 生成代码最容易犯的错误，照着做即可。"} />


        
        <DocDoDont rows={doDontRows} elevated />
      </section>
    </div>);

}

function AvatarPage({ actions, lang }: {actions: React.ReactNode;lang: Lang;}) {
  return (
    <StandardDocPage
      slug="avatar"
      title="Avatar 头像"
      lead="展示用户或实体身份的图像，支持图片加载失败回退、圆/方形、彩色文字头像与头像组。"
      playground={<ComponentPlayground config={avatarPlaygroundConfig} lang={lang} />}
      overview={null}
      overviewMatrix={<AvatarOverview lang={lang} />}
      scenarioExamples={avatarScenarioExamples}
      scenarioFilters={avatarScenarioFilters}
      renderScenarioPreview={(id) =>
      id === "single" ?
      <Avatar>
            <AvatarImage src="/avatars/01.jpg" alt="陈昊" />
            <AvatarFallback>陈</AvatarFallback>
          </Avatar> :
      id === "shape" ?
      <div className="flex items-center gap-3">
            <Avatar><AvatarImage src="/avatars/03.jpg" alt="苏婷" /><AvatarFallback colorful>苏</AvatarFallback></Avatar>
            <Avatar shape="square"><AvatarFallback colorful><FolderFilledIcon /></AvatarFallback></Avatar>
          </div> :
      id === "initials" ?
      <div className="flex items-center gap-3">
            {["欧阳娜娜", "王小明", "John Doe"].map((n) =>
        <Avatar key={n}><AvatarFallback colorful>{avatarInitials(n)}</AvatarFallback></Avatar>
        )}
          </div> :
      id === "style-image" ?
      <Avatar><AvatarImage src="/avatars/01.jpg" alt="陈昊" /><AvatarFallback>{avatarInitials("陈昊")}</AvatarFallback></Avatar> :
      id === "style-neutral" ?
      <Avatar><AvatarFallback>{avatarInitials("陈昊")}</AvatarFallback></Avatar> :
      id === "style-colorful" ?
      <Avatar><AvatarFallback colorful>{avatarInitials("陈昊")}</AvatarFallback></Avatar> :
      id === "icon" ?
      <Avatar><AvatarFallback colorful><UserFilledIcon /></AvatarFallback></Avatar> :
      id === "group" ?
      <AvatarGroup>
            {["张三", "王五", "赵六"].map((n) =>
        <Avatar key={n}><AvatarFallback colorful>{avatarInitials(n)}</AvatarFallback></Avatar>
        )}
            <Tooltip>
              <TooltipTrigger render={<AvatarGroupCount className="cursor-pointer">+3</AvatarGroupCount>} />
              <TooltipContent>李四、孙七、周八</TooltipContent>
            </Tooltip>
          </AvatarGroup> :
      id === "composite" ?
      <div className="flex items-center gap-3">
            {[2, 3, 4].map((count) =>
        <AvatarComposite key={count} max={count as 2 | 3 | 4} size="lg">
                {avatarPlaygroundMembers.slice(0, count).map((name, index) =>
          <Avatar key={name}>
                    <AvatarImage src={`/avatars/0${index + 1}.jpg`} alt={name} />
                    <AvatarFallback colorful>{avatarInitials(name)}</AvatarFallback>
                  </Avatar>
          )}
              </AvatarComposite>
        )}
          </div> :

      <Avatar size={id.replace("size-", "") as "xs" | "sm" | "default" | "lg" | "xl"}>
            <AvatarFallback>张</AvatarFallback>
          </Avatar>

      }
      importCode={`import { Avatar, AvatarComposite, AvatarFallback, AvatarImage } from "@/components/ui/avatar"`}
      usageCode={`<Avatar>\n  <AvatarImage src="/avatars/01.jpg" alt="陈昊" />\n  <AvatarFallback>陈</AvatarFallback>\n</Avatar>`}
      propRows={avatarPropRows}
      semanticDomRows={avatarSemanticDomRows}
      doDontRows={avatarDoDontRows}
      actions={actions}
      lang={lang} />);


}

function BreadcrumbDocPage({ actions, lang }: {actions: React.ReactNode;lang: Lang;}) {
  // 折叠示例：有状态，点祖先项（含下拉里折叠的中间层级）把"当前页"挪到那一级，面包屑随之变短——演示导航后的变化，不真跳转。
  const crumbPath = ["首页", "活动管理", "2024 春季", "线下活动", "活动列表", "详情"];
  const [crumbEnd, setCrumbEnd] = useState(crumbPath.length - 1);
  const go = (i: number) => (e: React.MouseEvent) => {e.preventDefault();setCrumbEnd(i);};
  const visible = crumbPath.slice(0, crumbEnd + 1);
  const collapsedDemo =
  visible.length <= 4 ?
  <Breadcrumb>
        <BreadcrumbList>
          {visible.map((label, i) =>
      <Fragment key={label}>
              {i > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {i === visible.length - 1 ?
          <BreadcrumbPage>{label}</BreadcrumbPage> :

          <BreadcrumbLink href="#" onClick={go(i)}>{label}</BreadcrumbLink>
          }
              </BreadcrumbItem>
            </Fragment>
      )}
        </BreadcrumbList>
      </Breadcrumb> :

  <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="#" onClick={go(0)}>{visible[0]}</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <DropdownMenu>
              <DropdownMenuTrigger render={<button type="button" aria-label="展开折叠的层级" className="flex items-center outline-none cursor-pointer"><BreadcrumbEllipsis /></button>} />
              <DropdownMenuContent align="start">
                {visible.slice(1, visible.length - 2).map((label, idx) =>
            <DropdownMenuItem key={label} onClick={() => setCrumbEnd(idx + 1)}>{label}</DropdownMenuItem>
            )}
              </DropdownMenuContent>
            </DropdownMenu>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href="#" onClick={go(visible.length - 2)}>{visible[visible.length - 2]}</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>{visible[visible.length - 1]}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>;

  return (
    <StandardDocPage
      slug="breadcrumb"
      title="Breadcrumb 面包屑"
      lead="展示当前页面在层级结构中的位置，帮助用户理解所处位置并快速返回上级。"
      overview={null}
      overviewMatrix={
      <DocSurfaceCard elevated>
        <CardContent className="grid gap-6 p-6">
          <div className="grid gap-3">
            <h3 className="text-sm font-medium text-muted-foreground">{lang === "en" ? "Types" : "类型"}</h3>
            <div className="flex flex-col gap-3">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem><BreadcrumbLink href="#">首页</BreadcrumbLink></BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem><BreadcrumbLink href="#">项目</BreadcrumbLink></BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem><BreadcrumbPage>详情</BreadcrumbPage></BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem><BreadcrumbLink href="#"><HomeIcon />首页</BreadcrumbLink></BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem><BreadcrumbLink href="#"><FolderIcon />项目</BreadcrumbLink></BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem><BreadcrumbPage><FileTextIcon />详情</BreadcrumbPage></BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem><BreadcrumbLink href="#">首页</BreadcrumbLink></BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem><BreadcrumbEllipsis /></BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem><BreadcrumbPage>详情</BreadcrumbPage></BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
          <div className="border-t border-dashed border-border" />
          <div className="grid gap-3">
            <h3 className="text-sm font-medium text-muted-foreground">{lang === "en" ? "Sizes" : "尺寸"}</h3>
            <div className="flex flex-col gap-3">
              {(["lg", "default", "sm"] as const).map((s) =>
            <Breadcrumb key={s}>
                  <BreadcrumbList size={s}>
                    <BreadcrumbItem><BreadcrumbLink href="#">首页</BreadcrumbLink></BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem><BreadcrumbLink href="#">活动管理</BreadcrumbLink></BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem><BreadcrumbPage>活动列表</BreadcrumbPage></BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
            )}
            </div>
          </div>
        </CardContent>
      </DocSurfaceCard>
      }
      scenarioExamples={breadcrumbScenarioExamples}
      scenarioFilters={breadcrumbScenarioFilters}
      renderScenarioPreview={(id) =>
      id === "basic" ?
      <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink href="#">首页</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>详情</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb> :
      id === "icon" ?
      <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink href="#"><HomeIcon />首页</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbLink href="#"><FolderIcon />项目</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage><FileTextIcon />详情</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb> :
      id === "collapsed" ?
      collapsedDemo :

      <Breadcrumb>
            <BreadcrumbList size={id.replace("size-", "") as "sm" | "default" | "lg"}>
              <BreadcrumbItem><BreadcrumbLink href="#">首页</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbLink href="#">活动管理</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>活动列表</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

      }
      importCode={`import {\n  Breadcrumb,\n  BreadcrumbEllipsis,\n  BreadcrumbItem,\n  BreadcrumbLink,\n  BreadcrumbList,\n  BreadcrumbPage,\n  BreadcrumbSeparator,\n} from "@/components/ui/breadcrumb"`}
      usageCode={`<Breadcrumb>\n  <BreadcrumbList>\n    <BreadcrumbItem><BreadcrumbLink href="#">首页</BreadcrumbLink></BreadcrumbItem>\n    <BreadcrumbSeparator />\n    <BreadcrumbItem><BreadcrumbPage>详情</BreadcrumbPage></BreadcrumbItem>\n  </BreadcrumbList>\n</Breadcrumb>`}
      propRows={breadcrumbPropRows}
      semanticDomRows={breadcrumbSemanticDomRows}
      doDontRows={breadcrumbDoDontRows}
      actions={actions}
      lang={lang} />);


}

function ButtonGroupPage({ actions, lang }: {actions: React.ReactNode;lang: Lang;}) {
  return (
    <StandardDocPage
      slug="button-group"
      title={lang === "en" ? "Button Group" : "按钮组"}
      lead="把强相关的多个操作按钮合并为一组，自动合并相邻边框与圆角，弱化彼此边界。"
      playground={<ComponentPlayground config={buttonGroupPlaygroundConfig} lang={lang} />}
      hideOverview
      hideScenarioExamples
      hideUsage
      overview={
      <div className="flex w-full flex-col gap-6">
          <div className="grid gap-3">
            <h3 className="text-sm font-medium text-muted-foreground">{lang === "en" ? "Types" : "类型"}</h3>
            <div className="flex flex-wrap items-center gap-4">
              <ButtonGroup>
                <Button variant="outline">复制</Button>
                <Button variant="outline">分享</Button>
                <Button variant="outline">归档</Button>
              </ButtonGroup>
              <ButtonGroup>
                <Button variant="outline">保存</Button>
                <Button size="icon-md" variant="outline" aria-label="更多"><ChevronDownIcon /></Button>
              </ButtonGroup>
            </div>
          </div>
          <div className="border-t border-dashed border-border" />
          <div className="grid gap-3">
            <h3 className="text-sm font-medium text-muted-foreground">{lang === "en" ? "Orientation" : "方向"}</h3>
            <div className="flex flex-wrap items-start gap-4">
              <ButtonGroup>
                <Button variant="outline">上一步</Button>
                <Button variant="outline">下一步</Button>
              </ButtonGroup>
              <ButtonGroup orientation="vertical">
                <Button variant="outline">上移</Button>
                <Button variant="outline">居中</Button>
                <Button variant="outline">下移</Button>
              </ButtonGroup>
            </div>
          </div>
          <div className="border-t border-dashed border-border" />
          <div className="grid gap-3">
            <h3 className="text-sm font-medium text-muted-foreground">{lang === "en" ? "Inner Button size" : "尺寸"}</h3>
            <div className="flex flex-wrap items-center gap-4">
              {([
            { size: "xs", zh: "超小", en: "XS" },
            { size: "sm", zh: "默认", en: "Default" },
            { size: "md", zh: "标准", en: "Standard" },
            { size: "lg", zh: "大", en: "Large" }] as
            const).map((s) =>
            <ButtonGroup key={s.size}>
                  <Button size={s.size} variant="outline">{lang === "en" ? s.en : s.zh}</Button>
                  <Button size={s.size} variant="outline">{lang === "en" ? s.en : s.zh}</Button>
                </ButtonGroup>
            )}
            </div>
          </div>
        </div>
      }
      scenarioExamples={buttonGroupScenarioExamples}
      scenarioFilters={buttonGroupScenarioFilters}
      renderScenarioPreview={(id) =>
      id === "split" ?
      <ButtonGroup>
            <Button size="sm" variant="outline">保存</Button>
            <Button size="icon-sm" variant="outline" aria-label="更多"><ChevronDownIcon /></Button>
          </ButtonGroup> :
      id === "vertical" ?
      <ButtonGroup orientation="vertical">
            <Button size="sm" variant="outline">上移</Button>
            <Button size="sm" variant="outline">居中</Button>
            <Button size="sm" variant="outline">下移</Button>
          </ButtonGroup> :
      id.startsWith("size-") ?
      (() => {
        const s = (id.replace("size-", "") === "default" ? "md" : id.replace("size-", "")) as "xs" | "sm" | "md" | "lg";
        return (
          <ButtonGroup>
                <Button size={s} variant="outline">复制</Button>
                <Button size={s} variant="outline">粘贴</Button>
              </ButtonGroup>);

      })() :

      <ButtonGroup>
            <Button size="sm" variant="outline">复制</Button>
            <Button size="sm" variant="outline">分享</Button>
            <Button size="sm" variant="outline">归档</Button>
          </ButtonGroup>

      }
      importCode={`import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "@/components/ui/button-group"`}
      usageCode=""
      propRows={buttonGroupPropRows}
      semanticDomRows={buttonGroupSemanticDomRows}
      doDontRows={buttonGroupDoDontRows}
      actions={actions}
      lang={lang} />);


}

function CalendarPage({ actions, lang }: {actions: React.ReactNode;lang: Lang;}) {
  return (
    <StandardDocPage
      slug="calendar"
      title="Calendar 日历"
      lead="基于 react-day-picker 的日期选择器，支持单日 / 多日 / 区间模式，常嵌入 Popover 组成日期选择控件。"
      overview={<Calendar mode="single" className="rounded-lg border p-2" />}
      scenarioExamples={calendarScenarioExamples}
      renderScenarioPreview={(id) =>
      id === "single" ?
      <Calendar mode="single" className="scale-90 rounded-lg border p-1 [--cell-size:1.6rem]" /> :

      <Popover>
            <PopoverTrigger render={<Button size="sm" variant="outline">选择日期</Button>} />
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" />
            </PopoverContent>
          </Popover>

      }
      importCode={`import { Calendar } from "@/components/ui/calendar"`}
      usageCode={`const [date, setDate] = useState<Date>()\n\n<Calendar mode="single" selected={date} onSelect={setDate} />`}
      propRows={calendarPropRows}
      semanticDomRows={calendarSemanticDomRows}
      doDontRows={calendarDoDontRows}
      actions={actions}
      lang={lang} />);


}

function CollapsiblePage({ actions, lang }: {actions: React.ReactNode;lang: Lang;}) {
  return (
    <StandardDocPage
      slug="collapsible"
      title="Collapsible 折叠面板"
      lead="默认收起次要信息，点击触发器后展开查看详情，用于减少页面初始信息量。"
      overview={
      <Collapsible className="w-full">
          <CollapsibleTrigger
          render={
          <Button variant="ghost" className="gap-1.5">
                查看更多 <ChevronDownIcon className="size-4" />
              </Button>
          } />
        
          <CollapsibleContent className="pt-2 text-sm text-muted-foreground">
            这里是展开后的详细内容，可以承载补充说明或次要信息。
          </CollapsibleContent>
        </Collapsible>
      }
      scenarioExamples={collapsibleScenarioExamples}
      renderScenarioPreview={(id) =>
      id === "panel" ?
      <Collapsible>
            <CollapsibleTrigger
          render={
          <Button size="sm" variant="ghost" className="gap-1.5">
                  查看更多 <ChevronDownIcon className="size-4" />
                </Button>
          } />
        
            <CollapsibleContent className="pt-2 text-sm text-muted-foreground">
              这里是展开后的详细内容。
            </CollapsibleContent>
          </Collapsible> :

      <Collapsible defaultOpen className="w-[180px]">
            <CollapsibleTrigger render={<button className="text-sm font-medium">基础组件（12）</button>} />
            <CollapsibleContent className="flex flex-col gap-1 pt-2 text-sm text-muted-foreground">
              <span>Button</span>
              <span>Input</span>
            </CollapsibleContent>
          </Collapsible>

      }
      importCode={`import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"`}
      usageCode={`<Collapsible>\n  <CollapsibleTrigger render={<Button variant="ghost">查看更多</Button>} />\n  <CollapsibleContent>\n    <p className="text-sm text-muted-foreground">这里是展开后的详细内容。</p>\n  </CollapsibleContent>\n</Collapsible>`}
      propRows={collapsiblePropRows}
      semanticDomRows={collapsibleSemanticDomRows}
      doDontRows={collapsibleDoDontRows}
      actions={actions}
      lang={lang} />);


}

// 文档用常开菜单面板：各类型默认全摊开（设计稿一样平铺），但项可悬浮高亮、可点击。
// 复用与真实 DropdownMenuContent 一致的视觉（bg-popover / shadow-l1 / 圆角 / 32px 项 / 选中橙字+对勾）。
function StaticMenu({ children, className }: {children: React.ReactNode;className?: string;}) {
  return <div className={cn("flex w-max min-w-[160px] max-w-[320px] flex-col rounded-lg bg-popover p-1 text-popover-foreground shadow-l1", className)}>{children}</div>;
}
function MItem({ icon, label, selected, checked, arrow, danger, disabled, onClick }: {icon?: React.ReactNode;label: string;selected?: boolean;checked?: boolean;arrow?: boolean;danger?: boolean;disabled?: boolean;onClick?: () => void;}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex min-h-8 w-full items-center gap-1.5 rounded-md px-1.5 text-left text-base outline-none select-none [&>svg]:size-4 [&>svg]:shrink-0",
        disabled ?
        "cursor-not-allowed text-foreground-disabled" :
        danger ?
        "text-destructive hover:bg-destructive-light" :
        "hover:bg-muted",
        selected && !disabled && "font-medium text-primary"
      )}>
      
      {icon}
      <span className="flex-1 truncate">{label}</span>
      {!disabled && (selected || checked) && <CheckIcon className={cn("size-4", selected ? "text-primary" : "text-foreground")} />}
      {arrow && <ChevronRightIcon className="size-3 text-muted-foreground" />}
    </button>);

}
function MGroup({ children }: {children: React.ReactNode;}) {
  return <div className="px-1.5 pt-3 pb-0.5 text-xs text-[var(--fx-neutrals-10)] select-none first:pt-1.5">{children}</div>;
}
function MLine({ full }: {full?: boolean;}) {
  return <div className={cn("my-1 h-px bg-border-faint", full ? "-mx-1" : "mx-1.5")} />;
}
// 多选：点击切换勾选
function CheckboxMenuDemo() {
  const [on, setOn] = useState<Record<string, boolean>>({ 姓名: true, 状态: true, 创建时间: false });
  return (
    <StaticMenu>
      <MGroup>显示列</MGroup>
      {["姓名", "状态", "创建时间"].map((k) =>
      <MItem key={k} label={k} selected={on[k]} onClick={() => setOn((s) => ({ ...s, [k]: !s[k] }))} />
      )}
    </StaticMenu>);

}
// 单选 / 选中态：点击切换唯一选中项；mode=check 用普通对勾，mode=selected 用橙字+对勾
function ChoiceMenuDemo({ label, options, initial, mode, className }: {label?: string;options: string[];initial: string;mode: "check" | "selected";className?: string;}) {
  const [val, setVal] = useState(initial);
  return (
    <StaticMenu className={className}>
      {label && <MGroup>{label}</MGroup>}
      {options.map((o) =>
      <MItem
        key={o}
        label={o}
        onClick={() => setVal(o)}
        {...mode === "selected" ? { selected: val === o } : { checked: val === o }} />

      )}
    </StaticMenu>);

}
// 有搜索：输入实时过滤 + 可点选
function SearchMenuDemo() {
  const all = ["张三", "李四", "王五", "赵六"];
  const [q, setQ] = useState("");
  const list = all.filter((n) => n.includes(q));
  return (
    <StaticMenu>
      <div className="p-1">
        <div className="flex h-7 items-center gap-1.5 rounded-lg border border-input px-2 text-base">
          <SearchIcon className="size-3.5 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜索"
            className="w-full bg-transparent outline-none placeholder:text-foreground-disabled" />
          
        </div>
      </div>
      {list.length ?
      list.map((n) => <MItem key={n} label={n} />) :

      <div className="px-1.5 py-6 text-center text-base text-muted-foreground">无匹配结果</div>
      }
    </StaticMenu>);

}

function DropdownMenuOverview({ lang }: {lang: Lang;}) {
  return (
    <DocSurfaceCard elevated>
      <CardContent className="grid gap-6 p-6">
      <div className="grid gap-3">
        <h3 className="text-sm font-medium text-muted-foreground">{lang === "en" ? "Types" : "类型"}</h3>
        <div className="flex flex-wrap items-start gap-4">
          {/* 普通 */}
          <StaticMenu>
            <MItem label="编辑" />
            <MItem label="复制" />
            <MItem label="删除" danger />
          </StaticMenu>
          {/* 有图标 */}
          <StaticMenu>
            <MItem icon={<UserIcon />} label="个人资料" />
            <MItem icon={<CreditCardIcon />} label="账单与订阅" />
            <MItem icon={<LogOutIcon />} label="退出登录" danger />
          </StaticMenu>
          {/* 文字分组 */}
          <StaticMenu>
            <MGroup>账户</MGroup>
            <MItem label="个人资料" />
            <MGroup>偏好</MGroup>
            <MItem label="通知" />
          </StaticMenu>
          {/* 线分组 */}
          <StaticMenu>
            <MItem label="编辑" />
            <MItem label="复制" />
            <MLine />
            <MItem label="删除" danger />
          </StaticMenu>
          {/* 有子级 */}
          <StaticMenu>
            <MItem label="重命名" />
            <MItem label="移动到" arrow />
            <MItem label="删除" danger />
          </StaticMenu>
          {/* 有搜索 */}
          <StaticMenu>
            <div className="p-1">
              <div className="flex h-7 items-center gap-1.5 rounded-lg border border-input px-2 text-base text-foreground-disabled">
                <SearchIcon className="size-3.5" /> 搜索
              </div>
            </div>
            <MItem label="张三" />
            <MItem label="李四" />
          </StaticMenu>
          {/* 有吸底 */}
          <StaticMenu>
            <MItem label="项目 A" />
            <MItem label="项目 B" />
            <MLine full />
            <MItem icon={<PlusIcon />} label="新建项目" />
          </StaticMenu>
        </div>
      </div>
      <div className="border-t border-dashed border-border" />
      <div className="grid gap-3">
        <h3 className="text-sm font-medium text-muted-foreground">{lang === "en" ? "Option states" : "选项状态"}</h3>
        <div className="flex flex-wrap items-start gap-4">
          {/* 多选 */}
          <StaticMenu>
            <MGroup>多选</MGroup>
            <MItem label="姓名" selected />
            <MItem label="状态" selected />
            <MItem label="创建时间" />
          </StaticMenu>
          {/* 单选 */}
          <StaticMenu>
            <MGroup>单选</MGroup>
            <MItem label="最新优先" selected />
            <MItem label="最早优先" />
          </StaticMenu>
          {/* 禁用 */}
          <StaticMenu>
            <MItem label="编辑" />
            <MItem label="归档" disabled />
            <MItem label="删除" danger />
          </StaticMenu>
        </div>
      </div>
      </CardContent>
    </DocSurfaceCard>);

}

function DropdownMenuPage({ actions, lang }: {actions: React.ReactNode;lang: Lang;}) {
  return (
    <StandardDocPage
      slug="dropdown-menu"
      title="Dropdown Menu 下拉菜单"
      lead="点击触发器后弹出的操作菜单，用于在有限空间里收纳多个次级操作。"
      overview={null}
      overviewMatrix={<DropdownMenuOverview lang={lang} />}
      scenarioExamples={dropdownMenuScenarioExamples}
      scenarioFilters={dropdownMenuScenarioFilters}
      renderScenarioPreview={(id) =>
      id === "normal" ?
      <StaticMenu>
            <MItem label="编辑" />
            <MItem label="复制" />
            <MItem label="重命名" />
            <MItem label="删除" danger />
          </StaticMenu> :
      id === "icon" ?
      <StaticMenu>
            <MItem icon={<UserIcon />} label="个人资料" />
            <MItem icon={<CreditCardIcon />} label="账单与订阅" />
            <MItem icon={<SettingsIcon />} label="设置" />
            <MItem icon={<LogOutIcon />} label="退出登录" danger />
          </StaticMenu> :
      id === "submenu" ?
      <DropdownMenu>
            <DropdownMenuTrigger render={<Button size="sm" variant="outline">操作 <ChevronDownIcon data-icon="inline-end" /></Button>} />
            <DropdownMenuContent>
              <DropdownMenuItem>重命名</DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>移动到</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>我的文档</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem>工作</DropdownMenuItem>
                      <DropdownMenuItem>个人</DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  <DropdownMenuItem>共享空间</DropdownMenuItem>
                  <DropdownMenuItem>收藏夹</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuItem variant="destructive">删除</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> :
      id === "checkbox" ?
      <CheckboxMenuDemo /> :
      id === "radio" ?
      <ChoiceMenuDemo label="排序方式" options={["最新优先", "最早优先", "按名称"]} initial="最新优先" mode="selected" /> :
      id === "disabled" ?
      <StaticMenu>
            <MItem label="编辑" />
            <MItem label="复制" />
            <MItem label="归档" disabled />
            <MItem label="删除" danger />
          </StaticMenu> :
      id === "search" ?
      <SearchMenuDemo /> :
      id === "sticky" ?
      <StaticMenu>
            <div className="scrollbar-thin -mx-1 -mt-1 max-h-40 overflow-y-auto px-1 pt-1">
              {["项目 A", "项目 B", "项目 C", "项目 D", "项目 E", "项目 F", "项目 G"].map((i) =>
          <MItem key={i} label={i} />
          )}
            </div>
            <MLine full />
            <MItem icon={<PlusIcon />} label="新建项目" />
          </StaticMenu> :
      id === "divider" ?
      <StaticMenu>
            <MItem label="编辑" />
            <MItem label="复制" />
            <MLine />
            <MItem label="归档" />
            <MLine />
            <MItem label="删除" danger />
          </StaticMenu> :

      <StaticMenu>
            <MGroup>账户</MGroup>
            <MItem label="个人资料" />
            <MItem label="账单与订阅" />
            <MGroup>偏好</MGroup>
            <MItem label="通知" />
            <MItem label="外观" />
          </StaticMenu>

      }
      importCode={`import {\n  DropdownMenu,\n  DropdownMenuContent,\n  DropdownMenuItem,\n  DropdownMenuLabel,\n  DropdownMenuSeparator,\n  DropdownMenuTrigger,\n} from "@/components/ui/dropdown-menu"`}
      usageCode={`<DropdownMenu>\n  <DropdownMenuTrigger render={<Button variant="ghost" size="icon-md">⋯</Button>} />\n  <DropdownMenuContent>\n    <DropdownMenuItem>编辑</DropdownMenuItem>\n    <DropdownMenuSeparator />\n    <DropdownMenuItem variant="destructive">删除</DropdownMenuItem>\n  </DropdownMenuContent>\n</DropdownMenu>`}
      propRows={dropdownMenuPropRows}
      semanticDomRows={dropdownMenuSemanticDomRows}
      doDontRows={dropdownMenuDoDontRows}
      actions={actions}
      lang={lang} />);


}

function PopoverPage({ actions, lang }: {actions: React.ReactNode;lang: Lang;}) {
  return (
    <StandardDocPage
      slug="popover"
      title="Popover 弹出层"
      lead="点击触发后弹出的轻量浮层，用于展示简短的补充信息或快捷操作，不打断当前流程。"
      overview={
      <Popover>
          <PopoverTrigger render={<Button variant="outline">打开弹层</Button>} />
          <PopoverContent>
            <PopoverHeader>
              <PopoverTitle>什么是工作区？</PopoverTitle>
              <PopoverDescription>工作区是团队协作的基本单位，可包含多个项目。</PopoverDescription>
            </PopoverHeader>
          </PopoverContent>
        </Popover>
      }
      scenarioExamples={popoverScenarioExamples}
      renderScenarioPreview={(id) =>
      id === "info" ?
      <Popover>
            <PopoverTrigger render={<Button size="sm" variant="ghost">说明</Button>} />
            <PopoverContent>
              <PopoverHeader>
                <PopoverTitle>什么是工作区？</PopoverTitle>
                <PopoverDescription>工作区是团队协作的基本单位。</PopoverDescription>
              </PopoverHeader>
            </PopoverContent>
          </Popover> :

      <Popover>
            <PopoverTrigger render={<Button size="sm" variant="outline">设置别名</Button>} />
            <PopoverContent className="flex flex-col gap-2.5">
              <Input placeholder="输入别名" />
              <Button size="sm">保存</Button>
            </PopoverContent>
          </Popover>

      }
      importCode={`import {\n  Popover,\n  PopoverContent,\n  PopoverDescription,\n  PopoverHeader,\n  PopoverTitle,\n  PopoverTrigger,\n} from "@/components/ui/popover"`}
      usageCode={`<Popover>\n  <PopoverTrigger render={<Button variant="outline">打开弹层</Button>} />\n  <PopoverContent>\n    <PopoverHeader>\n      <PopoverTitle>标题</PopoverTitle>\n      <PopoverDescription>补充说明文字。</PopoverDescription>\n    </PopoverHeader>\n  </PopoverContent>\n</Popover>`}
      propRows={popoverPropRows}
      semanticDomRows={popoverSemanticDomRows}
      doDontRows={popoverDoDontRows}
      actions={actions}
      lang={lang} />);


}

function SeparatorPage({ actions, lang }: {actions: React.ReactNode;lang: Lang;}) {
  return (
    <StandardDocPage
      slug="separator"
      title="Separator 分隔线"
      lead="用于区隔弱关联的内容区块，支持水平与垂直两种方向。"
      overview={null}
      overviewMatrix={<SeparatorOverview lang={lang} />}
      scenarioExamples={separatorScenarioExamples}
      renderScenarioPreview={(id) =>
      id === "horizontal" ?
      <div className="flex w-fit flex-col gap-3">
            <p className="text-sm">第一段内容</p>
            <Separator />
            <p className="text-sm">第二段内容</p>
          </div> :

      <div className="flex h-5 items-center gap-3 text-sm">
            <span>编辑</span>
            <Separator orientation="vertical" />
            <span>分享</span>
            <Separator orientation="vertical" />
            <span>删除</span>
          </div>

      }
      importCode={`import { Separator } from "@/components/ui/separator"`}
      usageCode={`<div className="flex flex-col gap-4">\n  <p className="text-sm">第一段内容</p>\n  <Separator />\n  <p className="text-sm">第二段内容</p>\n</div>`}
      propRows={separatorPropRows}
      semanticDomRows={separatorSemanticDomRows}
      doDontRows={separatorDoDontRows}
      actions={actions}
      lang={lang} />);


}

function LinkPage({ actions, lang }: {actions: React.ReactNode;lang: Lang;}) {
  return (
    <StandardDocPage
      slug="link"
      title="Link 链接"
      lead="用于页面内跳转或外部导航的文字链接，支持语义色与三档尺寸。"
      playground={<ComponentPlayground config={linkPlaygroundConfig} lang={lang} />}
      overview={null}
      overviewMatrix={<LinkOverview lang={lang} />}
      scenarioExamples={linkScenarioExamples}
      scenarioFilters={linkScenarioFilters}
      renderScenarioPreview={(id) =>
      id === "basic" ?
      <Link href="#link">基础文字链接</Link> :
      id === "underline" ?
      <Link href="#link" underline="always">下划线文字链接</Link> :
      id === "icon" ?
      <div className="flex items-center gap-4">
            <Link href="#link"><LinkIcon data-icon="inline-start" />仓库</Link>
            <Link href="#link">复制链接<CopyIcon data-icon="inline-end" /></Link>
          </div> :
      id === "tones" ?
      <div className="flex flex-wrap items-center gap-4">
            {linkTones.map((t) =>
        <Link key={t.tone} href="#link" tone={t.tone}>{t.label}链接</Link>
        )}
          </div> :
      id === "disabled" ?
      <Link href="#link" disabled>暂不可用</Link> :

      <Link href="#link" size={id.replace("size-", "") as "sm" | "default" | "lg"}>
            {id === "size-sm" ? "小链接" : id === "size-lg" ? "大链接" : "默认链接"}
          </Link>

      }
      importCode={`import { Link } from "@/components/ui/link"`}
      usageCode={`<Link href="/docs">打开文档</Link>`}
      propRows={linkPropRows}
      semanticDomRows={linkSemanticDomRows}
      doDontRows={linkDoDontRows}
      actions={actions}
      lang={lang} />);


}

function SidebarPage({ actions, lang }: {actions: React.ReactNode;lang: Lang;}) {
  const sidebarPreview =
  <div className="relative h-[260px] w-[200px] overflow-hidden rounded-lg border">
      <SidebarProvider style={{ "--sidebar-width": "200px" } as React.CSSProperties}>
        <Sidebar collapsible="none" className="h-[260px] border-r">
          <SidebarHeader>
            <span className="px-2 text-sm font-semibold">fx-ui</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>工作台</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive>
                      <HomeIcon /> 概览
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <FolderIcon /> 项目列表
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    </div>;


  return (
    <StandardDocPage
      slug="sidebar"
      title="Sidebar 侧边栏"
      lead="后台类产品最常见的主导航容器，提供分组菜单、折叠状态管理与移动端适配，需配合 SidebarProvider 使用。"
      overview={sidebarPreview}
      scenarioExamples={sidebarScenarioExamples}
      renderScenarioPreview={() => sidebarPreview}
      importCode={`import {\n  Sidebar,\n  SidebarContent,\n  SidebarGroup,\n  SidebarGroupContent,\n  SidebarGroupLabel,\n  SidebarHeader,\n  SidebarMenu,\n  SidebarMenuButton,\n  SidebarMenuItem,\n  SidebarProvider,\n} from "@/components/ui/sidebar"`}
      usageCode={`<SidebarProvider>\n  <Sidebar>\n    <SidebarHeader>fx-ui</SidebarHeader>\n    <SidebarContent>\n      <SidebarGroup>\n        <SidebarGroupLabel>工作台</SidebarGroupLabel>\n        <SidebarGroupContent>\n          <SidebarMenu>\n            <SidebarMenuItem>\n              <SidebarMenuButton isActive>概览</SidebarMenuButton>\n            </SidebarMenuItem>\n          </SidebarMenu>\n        </SidebarGroupContent>\n      </SidebarGroup>\n    </SidebarContent>\n  </Sidebar>\n  <SidebarInset>{/* 页面主体 */}</SidebarInset>\n</SidebarProvider>`}
      propRows={sidebarPropRows}
      semanticDomRows={sidebarSemanticDomRows}
      doDontRows={sidebarDoDontRows}
      actions={actions}
      lang={lang} />);


}

function SpinnerPage({ actions, lang }: {actions: React.ReactNode;lang: Lang;}) {
  return (
    <StandardDocPage
      slug="spinner"
      title="Spinner 加载指示器"
      lead="用旋转图标提示用户当前正在加载或处理中，常嵌入按钮或区块中央。"
      overview={
      <>
          <Spinner className="size-6" />
          <span className="text-sm text-muted-foreground">本质是带 animate-spin 的图标，可自由控制大小</span>
        </>
      }
      scenarioExamples={spinnerScenarioExamples}
      renderScenarioPreview={(id) =>
      id === "inline" ?
      <Button size="sm" disabled>
            <Spinner className="mr-1.5" />
            提交中…
          </Button> :

      <div className="flex flex-col items-center justify-center gap-2 py-2 text-xs text-muted-foreground">
            <Spinner className="size-5" />
            正在加载…
          </div>

      }
      importCode={`import { Spinner } from "@/components/ui/spinner"`}
      usageCode={`<Button disabled>\n  <Spinner className="mr-1.5" />\n  提交中…\n</Button>`}
      propRows={spinnerPropRows}
      semanticDomRows={spinnerSemanticDomRows}
      doDontRows={spinnerDoDontRows}
      actions={actions}
      lang={lang} />);


}

function ToastPage({ actions, lang }: {actions: React.ReactNode;lang: Lang;}) {
  return (
    <StandardDocPage
      slug="toast"
      title="Toast 轻提示"
      lead="操作完成后弹出的轻量、自动消失的反馈，不打断当前流程。基于 sonner，命令式调用 toast()。"
      overview={
      <>
          <Button size="sm" variant="outline" onClick={() => toast.success("已保存")}>触发一条 toast</Button>
          <span className="text-sm text-muted-foreground">全局只挂一个 &lt;Toaster /&gt;，到处 toast() 即可</span>
        </>
      }
      scenarioExamples={toastScenarioExamples}
      renderScenarioPreview={(id) =>
      id === "success" ?
      <Button size="sm" variant="outline" onClick={() => toast.success("已保存")}>成功提示</Button> :
      id === "error" ?
      <Button size="sm" variant="outline" onClick={() => toast.error("保存失败", { description: "网络异常，请重试" })}>失败提示</Button> :

      <Button size="sm" variant="outline" onClick={() => toast("已删除 1 项", { action: { label: "撤销", onClick: () => toast("已撤销") } })}>带撤销</Button>

      }
      importCode={`import { toast } from "sonner"`}
      usageCode={`toast.success("已保存")\ntoast.error("保存失败", { description: "网络异常，请重试" })\ntoast("已删除 1 项", {\n  action: { label: "撤销", onClick: () => restore() },\n})`}
      propRows={toastPropRows}
      semanticDomRows={toastSemanticDomRows}
      doDontRows={toastDoDontRows}
      actions={actions}
      lang={lang} />);


}

function TabsPage({ actions, lang }: {actions: React.ReactNode;lang: Lang;}) {
  return (
    <StandardDocPage
      slug="tabs"
      title="Tabs 标签页"
      lead="在同一区域内切换并列的内容分组，支持默认分段样式与轻量下划线样式。"
      overview={
      <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">概览</TabsTrigger>
            <TabsTrigger value="detail">详情</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="pt-2 text-sm text-muted-foreground">概览内容…</TabsContent>
          <TabsContent value="detail" className="pt-2 text-sm text-muted-foreground">详情内容…</TabsContent>
        </Tabs>
      }
      scenarioExamples={tabsScenarioExamples}
      renderScenarioPreview={(id) =>
      id === "default" ?
      <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">概览</TabsTrigger>
              <TabsTrigger value="detail">详情</TabsTrigger>
            </TabsList>
          </Tabs> :

      <Tabs defaultValue="all">
            <TabsList variant="line">
              <TabsTrigger value="all">全部</TabsTrigger>
              <TabsTrigger value="active">进行中</TabsTrigger>
              <TabsTrigger value="done">已完成</TabsTrigger>
            </TabsList>
          </Tabs>

      }
      importCode={`import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"`}
      usageCode={`<Tabs defaultValue="overview">\n  <TabsList>\n    <TabsTrigger value="overview">概览</TabsTrigger>\n    <TabsTrigger value="detail">详情</TabsTrigger>\n  </TabsList>\n  <TabsContent value="overview">概览内容…</TabsContent>\n  <TabsContent value="detail">详情内容…</TabsContent>\n</Tabs>`}
      propRows={tabsPropRows}
      semanticDomRows={tabsSemanticDomRows}
      doDontRows={tabsDoDontRows}
      actions={actions}
      lang={lang} />);


}

function TogglePage({ actions, lang }: {actions: React.ReactNode;lang: Lang;}) {
  return (
    <StandardDocPage
      slug="toggle"
      title="Toggle 切换按钮"
      lead="用于切换某个独立的二元状态，如收藏、静音、文本加粗。"
      overview={
      <>
          <Toggle aria-label="加粗"><BoldIcon /></Toggle>
          <Toggle aria-label="斜体" variant="outline"><ItalicIcon /></Toggle>
        </>
      }
      scenarioExamples={toggleScenarioExamples}
      renderScenarioPreview={(id) =>
      id === "icon" ?
      <Toggle aria-label="加粗"><BoldIcon /></Toggle> :

      <Toggle variant="outline" size="sm" className="gap-1.5">
            <ItalicIcon /> 斜体
          </Toggle>

      }
      importCode={`import { Toggle } from "@/components/ui/toggle"`}
      usageCode={`<Toggle aria-label="加粗">\n  <BoldIcon />\n</Toggle>`}
      propRows={togglePropRows}
      semanticDomRows={toggleSemanticDomRows}
      doDontRows={toggleDoDontRows}
      actions={actions}
      lang={lang} />);


}

function ToggleGroupPage({ actions, lang }: {actions: React.ReactNode;lang: Lang;}) {
  return (
    <StandardDocPage
      slug="toggle-group"
      title="Toggle Group 切换按钮组"
      lead="把多个 Toggle 组合成一组，支持互斥单选与并行多选两种模式。"
      overview={
      <ToggleGroup defaultValue={["left"]}>
          <ToggleGroupItem value="left">左对齐</ToggleGroupItem>
          <ToggleGroupItem value="center">居中</ToggleGroupItem>
          <ToggleGroupItem value="right">右对齐</ToggleGroupItem>
        </ToggleGroup>
      }
      scenarioExamples={toggleGroupScenarioExamples}
      renderScenarioPreview={(id) =>
      id === "single" ?
      <ToggleGroup defaultValue={["left"]} className="scale-90">
            <ToggleGroupItem value="left">左</ToggleGroupItem>
            <ToggleGroupItem value="center">中</ToggleGroupItem>
            <ToggleGroupItem value="right">右</ToggleGroupItem>
          </ToggleGroup> :

      <ToggleGroup multiple variant="outline">
            <ToggleGroupItem value="bold"><BoldIcon /></ToggleGroupItem>
            <ToggleGroupItem value="italic"><ItalicIcon /></ToggleGroupItem>
            <ToggleGroupItem value="underline"><UnderlineIcon /></ToggleGroupItem>
          </ToggleGroup>

      }
      importCode={`import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"`}
      usageCode={`<ToggleGroup defaultValue={["left"]}>\n  <ToggleGroupItem value="left">左对齐</ToggleGroupItem>\n  <ToggleGroupItem value="center">居中</ToggleGroupItem>\n  <ToggleGroupItem value="right">右对齐</ToggleGroupItem>\n</ToggleGroup>`}
      propRows={toggleGroupPropRows}
      semanticDomRows={toggleGroupSemanticDomRows}
      doDontRows={toggleGroupDoDontRows}
      actions={actions}
      lang={lang} />);


}

function AgentSurfacePage({ actions, lang }: {actions: React.ReactNode;lang: Lang;}) {
  const sampleSurface: AgentSurfaceSchema = {
    id: "customer-followup",
    title: lang === "en" ? "Customer follow-up suggestion" : "客户跟进建议",
    description:
    lang === "en" ?
    "This surface is generated from controlled JSON, then rendered by local fx-ui React components." :
    "这块界面来自受控 JSON，再由本地 fx-ui React 组件渲染。",
    blocks: [
    {
      type: "text",
      text:
      lang === "en" ?
      "Agent found one customer object and one related file. The following cards are not static HTML." :
      "Agent 识别到一个客户对象和一个相关文件。下面这些卡片不是静态 HTML。"
    },
    {
      type: "object-card",
      title: lang === "en" ? "Customer object" : "客户对象",
      description: lang === "en" ? "Generated from Agent context." : "由 Agent 上下文生成。",
      fields: [
      { label: lang === "en" ? "Customer" : "客户", value: lang === "en" ? "Stellar Tech" : "星河科技" },
      { label: lang === "en" ? "Status" : "状态", value: lang === "en" ? "Needs follow-up" : "待跟进" },
      { label: lang === "en" ? "Risk" : "风险", value: lang === "en" ? "Contract delay" : "合同延期" },
      { label: lang === "en" ? "Owner" : "负责人", value: lang === "en" ? "Sales team" : "销售团队" }],

      actions: [
      { label: lang === "en" ? "Generate plan" : "生成跟进计划", event: "generate_followup", payload: { customerId: "cus_001" } },
      { label: lang === "en" ? "Mark reviewed" : "标记已读", event: "mark_reviewed", variant: "outline" }]

    },
    {
      type: "file-card",
      title: lang === "en" ? "Related file" : "相关文件",
      filename: "采购合同.pdf",
      meta: "PDF",
      summary:
      lang === "en" ?
      "The Agent can ask the host system to summarize this file, but the button only emits an event." :
      "Agent 可以请求宿主系统总结这个文件，但按钮本身只发事件。",
      actions: [
      { label: lang === "en" ? "Summarize file" : "总结文件", event: "summarize_file", payload: { fileId: "file_001" }, variant: "outline" }]

    },
    {
      type: "insight-card",
      title: lang === "en" ? "Prioritize follow-up" : "建议优先跟进",
      summary:
      lang === "en" ?
      "The contract is already delayed, and the last two conversations did not confirm a next step." :
      "合同已经延期，且最近两次沟通都没有确认下一步。",
      tone: "warning",
      evidence:
      lang === "en" ?
      ["Contract status: delayed", "Recent conversations: no confirmed next date"] :
      ["合同状态：延期", "最近沟通：未确认新时间"],
      actions: [
      { label: lang === "en" ? "Draft follow-up" : "生成跟进话术", event: "draft_followup", payload: { customerId: "cus_001" }, variant: "outline" }]

    },
    {
      type: "action-row",
      actions: [
      { label: lang === "en" ? "Continue analysis" : "继续分析", event: "continue_analysis" },
      { label: lang === "en" ? "Cancel" : "取消", event: "cancel", variant: "ghost" }]

    }]

  };
  const unsupportedSurface: AgentSurfaceSchema = {
    id: "unsupported-demo",
    blocks: [
    {
      id: "unknown-1",
      type: "custom-html-widget"
    }]

  };
  const [events, setEvents] = useState<AgentSurfaceEvent[]>([]);
  const sampleJson = JSON.stringify(sampleSurface, null, 2);
  const [mockJson, setMockJson] = useState(sampleJson);
  let mockSurface: AgentSurfaceSchema | null = null;
  let mockError = "";

  try {
    const parsed = JSON.parse(mockJson) as Partial<AgentSurfaceSchema>;

    if (typeof parsed.id !== "string") {
      mockError = lang === "en" ? "surface.id must be a string." : "surface.id 必须是字符串。";
    } else if (!Array.isArray(parsed.blocks)) {
      mockError = lang === "en" ? "surface.blocks must be an array." : "surface.blocks 必须是数组。";
    } else {
      mockSurface = parsed as AgentSurfaceSchema;
    }
  } catch (error) {
    mockError = error instanceof Error ? error.message : lang === "en" ? "Invalid JSON." : "JSON 格式不正确。";
  }

  const handleAction = (event: AgentSurfaceEvent) => {
    setEvents((current) => [event, ...current].slice(0, 4));
  };

  return (
    <div className={docsSpacing.pageStack}>
      <section id="agent-surface" className="flex flex-col gap-3">
        <PageLead
          crumb={lang === "en" ? `Business Compositions / ${agentSurfaceNavLabel.en}` : `业务组合组件 / ${agentSurfaceNavLabel.zh}`}
          title={lang === "en" ? "AgentSurface" : agentSurfaceNavLabel.zh}
          lead={lang === "en" ?
          "A controlled generative UI surface: Agent returns JSON intent, fx-ui renders trusted React components, and user actions become events." :
          "受控生成式 UI 渲染面：Agent 返回 JSON 意图，fx-ui 渲染可信 React 组件，用户操作变成事件。"}
          actions={actions} />
      </section>

      <section id="agent-surface-overview" className={docsSpacing.sectionStack}>
        <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Overview" : "组件总览"}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
          [lang === "en" ? "Agent sends JSON" : "Agent 发 JSON", lang === "en" ? "Not React, HTML, CSS, or JS." : "不是 React、HTML、CSS 或 JS。"],
          [lang === "en" ? "Frontend renders React" : "前端渲染 React", lang === "en" ? "Only local fx-ui components are used." : "只使用本地 fx-ui 组件。"],
          [lang === "en" ? "Actions are events" : "Action 只是事件", lang === "en" ? "Buttons call onAction with event payloads." : "按钮只把事件交给 onAction。"]].
          map(([title, desc]) =>
          <Card key={title}>
              <CardHeader>
                <CardTitle className="text-base">{title}</CardTitle>
                <CardDescription>{desc}</CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </section>

      <section id="agent-surface-scenarios" className={docsSpacing.sectionStack}>
        <SectionLead title={
        lang === "en" ? "High-frequency Scenarios" : "高频场景"} description={

        lang === "en" ?
        "Start from what company Agents actually return, then decide which blocks deserve to become stable components." :
        "先从公司 Agent 真实回复里最高频的内容出发，再决定哪些 block 值得沉淀成稳定组件。"} />

        
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <Tag variant="outline">phase-1</Tag>
                <CardTitle className="text-base">{lang === "en" ? "Implemented blocks" : "已落地能力"}</CardTitle>
              </div>
              <CardDescription>
                {lang === "en" ?
                "These are already supported by AgentSurface and can be tested in the mock preview." :
                "这些已经进入 AgentSurface 白名单，可以在 Mock 预览里直接测试。"}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {[
              [
              lang === "en" ? "Object information" : "对象信息",
              "object-card",
              lang === "en" ? "User sees a compact business object summary." : "用户看到一个业务对象摘要。",
              lang === "en" ? "Use when the Agent found a customer, order, project, or approval." : "Agent 找到客户、订单、项目、审批单时使用。"],

              [
              lang === "en" ? "File information" : "文件信息",
              "file-card",
              lang === "en" ? "User sees the file name, type, summary, and safe actions." : "用户看到文件名、类型、摘要和安全操作。",
              lang === "en" ? "Use when the Agent references contracts, reports, attachments, or docs." : "Agent 引用合同、报告、附件或知识库文档时使用。"],

              [
              lang === "en" ? "Insight / recommendation" : "建议/结论",
              "insight-card",
              lang === "en" ? "User sees the conclusion first, then evidence and next action." : "用户先看结论，再看依据和下一步。",
              lang === "en" ? "Use when the Agent has a judgment, risk hint, or recommendation." : "Agent 给出判断、风险提示或推荐动作时使用。"],

              [
              lang === "en" ? "Action area" : "操作区",
              "action-row",
              lang === "en" ? "User chooses the next step; the UI only emits events." : "用户选择下一步；UI 只发事件。",
              lang === "en" ? "Use for continue, generate, open details, or cancel." : "用于继续分析、生成、查看详情或取消。"]].

              map(([title, block, userSees, rule]) =>
              <div key={block} className="flex flex-col gap-3 rounded-xl border border-border bg-background p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <CardTitle className="text-base">{title}</CardTitle>
                    <Tag variant="secondary">{block}</Tag>
                  </div>
                  <p className="text-sm leading-6 text-foreground">{userSees}</p>
                  <p className="text-sm leading-6 text-muted-foreground">{rule}</p>
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <Tag variant="secondary">phase-2</Tag>
                <CardTitle className="text-base">{lang === "en" ? "To validate" : "待验证场景"}</CardTitle>
              </div>
              <CardDescription>
                {lang === "en" ?
                "These should not become components until real Agent responses repeat the same shape." :
                "这些先不要急着做组件，等真实 Agent 回复稳定复用后再沉淀。"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {[
              [lang === "en" ? "Tasks / todos" : "任务/待办", "task-card", lang === "en" ? "Follow-up, approval, missing data, confirmation." : "待跟进、待审批、待补充资料、待确认。"],
              [lang === "en" ? "Result list" : "多对象列表", "result-list", lang === "en" ? "Multiple customers, files, records, or candidates." : "多个客户、文件、记录或候选项。"],
              [lang === "en" ? "Risk / warning" : "风险/警告", "risk-card", lang === "en" ? "Missing permission, incomplete data, irreversible action." : "权限不足、数据缺失、高风险操作、不可逆动作。"],
              [lang === "en" ? "Progress state" : "进度状态", "agent-status", lang === "en" ? "Analyzing, completed, partially failed, waiting." : "正在分析、已完成、部分失败、等待用户选择。"]].
              map(([title, block, desc]) =>
              <div key={block} className="flex items-start justify-between gap-4 rounded-xl border border-border bg-muted/30 p-4">
                  <div className="flex flex-col gap-1">
                    <div className="font-medium text-foreground">{title}</div>
                    <p className="text-sm leading-6 text-muted-foreground">{desc}</p>
                  </div>
                  <Tag variant="outline">{block}</Tag>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="agent-surface-visual" className={docsSpacing.sectionStack}>
        <SectionLead title={
        lang === "en" ? "Visual Direction" : "视觉规范"} description={

        lang === "en" ?
        "Agent UI can borrow the lightness of consumer AI cards, but it remains a subsystem of fx-ui." :
        "Agent UI 可以借用消费级 AI 卡片的轻盈感，但它仍然是 fx-ui 的子系统。"} />

        
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base">
              {lang === "en" ? "Visual principle" : "视觉原则"}
            </CardTitle>
            <CardDescription>
              {lang === "en" ?
              "Consumer-grade feeling, fx-ui-grade foundation: tokens, shadcn base components, and local trusted React." :
              "视觉气质参考 C 端，底层能力仍用 fx-ui：token、shadcn 基础组件和本地可信 React。"}
            </CardDescription>
          </CardHeader>
        </Card>
        <div className="grid gap-4 md:grid-cols-2">
          {[
          [
          lang === "en" ? "Borrow" : "可以借鉴",
          lang === "en" ?
          "Light cards, clear hierarchy, concise copy, calmer actions, fewer fields, and more breathing room." :
          "轻量卡片、清楚层级、短文案、克制操作、更少字段和更有呼吸感的留白。"],

          [
          lang === "en" ? "Avoid" : "不要照搬",
          lang === "en" ?
          "Brand skins, decorative gradients, marketing motion, nested cards, or a separate Agent-only component library." :
          "品牌皮肤、装饰渐变、营销动效、卡片套卡片，或给 Agent 另起一套组件库。"]].

          map(([title, desc]) =>
          <Card key={title}>
              <CardHeader>
                <CardTitle className="text-base">{title}</CardTitle>
                <CardDescription>{desc}</CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[
          [lang === "en" ? "One subject" : "一张卡一件事", lang === "en" ? "Object, file, insight, or action group." : "对象、文件、结论或操作组。"],
          [lang === "en" ? "Conclusion first" : "先结论", lang === "en" ? "Then evidence, then action." : "再依据，最后行动。"],
          [lang === "en" ? "One primary" : "一个主操作", lang === "en" ? "At most two secondary actions." : "次操作最多两个。"],
          [lang === "en" ? "No nested cards" : "不套卡片", lang === "en" ? "Keep one visual level in the chat flow." : "保持对话流里的单一层级。"]].
          map(([title, desc]) =>
          <Card key={title}>
              <CardHeader>
                <CardTitle className="text-base">{title}</CardTitle>
                <CardDescription>{desc}</CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </section>

      <section id="agent-surface-playground" className={docsSpacing.sectionStack}>
        <SectionLead title={
        lang === "en" ? "Mock Preview" : "Mock 预览"} description={

        lang === "en" ?
        "Paste or edit the Agent JSON on the left. The right side renders the real AgentSurface component." :
        "在左侧粘贴或编辑 Agent JSON，右侧会用真实 AgentSurface 组件实时渲染。"} />

        
        <div className="grid gap-4 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle className="text-base">{lang === "en" ? "Mock JSON input" : "Mock JSON 输入"}</CardTitle>
                  <CardDescription>
                    {lang === "en" ?
                    "Use the AgentSurfaceSchema shape: id, optional title/description, and blocks." :
                    "使用 AgentSurfaceSchema 结构：id、可选 title/description，以及 blocks。"}
                  </CardDescription>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => setMockJson(sampleJson)}>
                  {lang === "en" ? "Reset" : "重置示例"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Field data-invalid={mockError ? true : undefined}>
                <FieldLabel htmlFor="agent-surface-mock-json">
                  {lang === "en" ? "Agent JSON" : "Agent JSON"}
                </FieldLabel>
                <Textarea
                  id="agent-surface-mock-json"
                  aria-invalid={mockError ? true : undefined}
                  value={mockJson}
                  onChange={(event) => setMockJson(event.target.value)}
                  className="min-h-[420px] resize-y font-mono text-xs leading-5"
                  spellCheck={false} />
                
                {mockError ?
                <FieldError>{mockError}</FieldError> :

                <FieldDescription>
                    {lang === "en" ?
                  "Unknown block types will render as the safe unsupported state." :
                  "未知 block type 会渲染成安全兜底态，不会执行未知代码。"}
                  </FieldDescription>
                }
              </Field>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{lang === "en" ? "Real component output" : "真实组件输出"}</CardTitle>
              <CardDescription>
                {lang === "en" ?
                "This is not an image or static HTML. It is the same React component used by AgentSurface." :
                "这里不是图片，也不是静态 HTML，而是 AgentSurface 真实 React 组件渲染结果。"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {mockSurface ?
              <AgentSurface surface={mockSurface} onAction={handleAction} /> :

              <Card data-slot="agent-surface-playground-error" className="bg-muted/40">
                  <CardContent className="text-sm text-muted-foreground">
                    {lang === "en" ? "Fix the JSON input to preview the component." : "修正左侧 JSON 后，这里会显示组件预览。"}
                  </CardContent>
                </Card>
              }
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="agent-surface-demo" className={docsSpacing.sectionStack}>
        <SectionLead title={
        lang === "en" ? "Live Example" : "实时示例"} description={

        lang === "en" ?
        "Click a button below. The UI does not execute Agent code; it only emits an event." :
        "点击下面的按钮。UI 不会执行 Agent 代码，只会发出事件。"} />

        
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <AgentSurface surface={sampleSurface} onAction={handleAction} />
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{lang === "en" ? "Event log" : "事件日志"}</CardTitle>
              <CardDescription>
                {lang === "en" ? "What the host app receives from AgentSurface." : "宿主应用从 AgentSurface 收到的内容。"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {events.length > 0 ?
              events.map((event, index) =>
              <code key={`${event.event}-${index}`} className="block rounded bg-muted px-2 py-1.5 text-xs text-foreground">
                    {JSON.stringify(event)}
                  </code>
              ) :

              <p className="text-sm text-muted-foreground">{lang === "en" ? "No event yet." : "还没有事件。"}</p>
              }
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="agent-surface-schema" className={docsSpacing.sectionStack}>
        <SectionLead title={
        lang === "en" ? "JSON Protocol" : "JSON 协议"} description={

        lang === "en" ?
        "The first version supports text, object-card, file-card, and action-row." :
        "第一版支持 text、object-card、file-card 和 action-row。"} />

        
        <CopyCodeBlock code={sampleJson} label="AgentSurface JSON" lang={lang} />
      </section>

      <section id="agent-surface-strategy" className={docsSpacing.sectionStack}>
        <SectionLead title={
        lang === "en" ? "Protocol Strategy" : "协议取舍"} description={

        lang === "en" ?
        "fx-ui references mature generative UI ideas, but the first phase stays lightweight so real Agent cards can ship first." :
        "fx-ui 会参考成熟生成式 UI 思路，但第一阶段先保持轻协议，让真实 Agent 卡片先跑起来。"} />

        
        <div className="grid gap-4 md:grid-cols-2">
          {[
          [
          lang === "en" ? "Borrow" : "借鉴",
          lang === "en" ?
          "A2UI catalog/surface/action ideas, AG-UI event thinking, Vercel-style local React rendering, and MCP-style structured tool results." :
          "借鉴 A2UI 的 catalog/surface/action、AG-UI 的事件思路、Vercel 的本地 React 渲染、MCP 的结构化工具结果。"],

          [
          lang === "en" ? "Defer" : "暂缓",
          lang === "en" ?
          "Do not start with a full cross-client protocol, remote component registry, complex event bus, or long-term compatibility layer." :
          "暂时不做完整跨端协议、远程组件注册、复杂事件总线和长期兼容层。"]].

          map(([title, desc]) =>
          <Card key={title}>
              <CardHeader>
                <CardTitle className="text-base">{title}</CardTitle>
                <CardDescription>{desc}</CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base">
              {lang === "en" ? "First phase rule" : "第一阶段规则"}
            </CardTitle>
            <CardDescription>
              {lang === "en" ?
              "Light protocol first, then evaluate heavier protocols when scenarios and clients become stable." :
              "先做轻协议，后看是否接重协议；等场景稳定、多端复用或必须互通时，再评估 A2UI / AG-UI。"}
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      <section id="agent-surface-safety" className={docsSpacing.sectionStack}>
        <SectionLead title={
        lang === "en" ? "Safety" : "安全边界"} description={

        lang === "en" ?
        "Unknown blocks are shown as unsupported. The renderer does not eval, import, or inject HTML." :
        "未知 block 会显示为不支持。渲染器不会 eval、动态 import 或注入 HTML。"} />

        
        <AgentSurface surface={unsupportedSurface} />
      </section>
    </div>);

}

function RightRail({
  activeAnchor,
  anchors,
  lang,
  onAnchorSelect





}: {activeAnchor: string;anchors: typeof buttonAnchors;lang: Lang;onAnchorSelect: (href: string) => void;}) {
  if (anchors.length === 0) return null;

  return (
    <aside className="hidden 2xl:block">
      <div className="sticky top-8">
        <nav className="border-l border-border pl-6">
          <div className="mb-4 text-sm font-medium text-foreground">{uiText[lang].toc}</div>
          <div className="flex flex-col gap-2 text-sm">
            {anchors.map((item) => {
              const isActive = activeAnchor === item.href;

              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(event) => {
                    event.preventDefault();
                    onAnchorSelect(item.href);
                  }}
                  className={
                  isActive ?
                  "relative flex items-center font-medium text-foreground" :
                  "relative flex items-center text-muted-foreground transition-colors hover:text-foreground"
                  }>
                  
                  {getLabel(item, lang)}
                </a>);

            })}
          </div>
        </nav>
      </div>
    </aside>);

}

// ─── Chart Page ───────────────────────────────────────────────────────────────

const chartLineData = [
{ month: "1月", 成交额: 420, 目标: 500 },
{ month: "2月", 成交额: 380, 目标: 500 },
{ month: "3月", 成交额: 610, 目标: 550 },
{ month: "4月", 成交额: 730, 目标: 600 },
{ month: "5月", 成交额: 690, 目标: 650 },
{ month: "6月", 成交额: 870, 目标: 700 }];


const chartBarData = [
{ stage: "线索", count: 240 },
{ stage: "意向", count: 180 },
{ stage: "报价", count: 120 },
{ stage: "谈判", count: 72 },
{ stage: "成交", count: 38 }];


const chartPieData = [
{ name: "直销", value: 48 },
{ name: "渠道", value: 28 },
{ name: "合作", value: 14 },
{ name: "其他", value: 10 }];


const lineChartConfig: ChartConfig = {
  成交额: { label: "成交额（万）", color: "var(--chart-1)" },
  目标: { label: "目标（万）", color: "var(--chart-2)" }
};

const barChartConfig: ChartConfig = {
  count: { label: "商机数", color: "var(--chart-1)" }
};

const pieColors = [
"var(--chart-1)",
"var(--chart-2)",
"var(--chart-3)",
"var(--chart-4)"];


const pieChartConfig: ChartConfig = {
  直销: { label: "直销", color: "var(--chart-1)" },
  渠道: { label: "渠道", color: "var(--chart-2)" },
  合作: { label: "合作", color: "var(--chart-3)" },
  其他: { label: "其他", color: "var(--chart-4)" }
};

// 面积图
const areaChartConfig: ChartConfig = {
  成交额: { label: "成交额（万）", color: "var(--chart-6)" },
  目标: { label: "目标（万）", color: "var(--chart-8)" }
};

// 组合图（柱+折线）
const chartComposedData = [
{ month: "1月", 成交额: 420, 赢单率: 32 },
{ month: "2月", 成交额: 380, 赢单率: 28 },
{ month: "3月", 成交额: 610, 赢单率: 41 },
{ month: "4月", 成交额: 730, 赢单率: 45 },
{ month: "5月", 成交额: 690, 赢单率: 38 },
{ month: "6月", 成交额: 870, 赢单率: 52 }];

const composedChartConfig: ChartConfig = {
  成交额: { label: "成交额（万）", color: "var(--chart-3)" },
  赢单率: { label: "赢单率（%）", color: "var(--chart-9)" }
};

// 散点图
const chartScatterData = [
{ 金额: 120, 概率: 80 },
{ 金额: 350, 概率: 60 },
{ 金额: 80, 概率: 90 },
{ 金额: 520, 概率: 40 },
{ 金额: 200, 概率: 70 },
{ 金额: 95, 概率: 85 },
{ 金额: 680, 概率: 35 },
{ 金额: 310, 概率: 55 }];

const scatterChartConfig: ChartConfig = {
  商机: { label: "商机", color: "var(--chart-9)" }
};

// 雷达图
const chartRadarData = [
{ dimension: "新客开拓", A: 85, B: 65 },
{ dimension: "客户维系", A: 72, B: 88 },
{ dimension: "成交转化", A: 90, B: 75 },
{ dimension: "客单价", A: 68, B: 82 },
{ dimension: "跟进速度", A: 78, B: 60 },
{ dimension: "赢单率", A: 82, B: 70 }];

const radarChartConfig: ChartConfig = {
  A: { label: "张三", color: "var(--chart-3)" },
  B: { label: "李四", color: "var(--chart-9)" }
};

// 径向柱图
const chartRadialData = [
{ name: "张三", value: 112, fill: "var(--chart-1)" },
{ name: "李四", value: 89, fill: "var(--chart-8)" },
{ name: "王五", value: 134, fill: "var(--chart-3)" },
{ name: "赵六", value: 76, fill: "var(--chart-4)" },
{ name: "陈七", value: 98, fill: "var(--chart-6)" }];

const radialChartConfig: ChartConfig = {
  value: { label: "配额完成率（%）" }
};

const chartStackedBarData = [
{ month: "1月", 新客: 180, 老客: 120, 渠道: 80 },
{ month: "2月", 新客: 160, 老客: 140, 渠道: 72 },
{ month: "3月", 新客: 220, 老客: 180, 渠道: 96 },
{ month: "4月", 新客: 260, 老客: 210, 渠道: 110 },
{ month: "5月", 新客: 240, 老客: 230, 渠道: 128 },
{ month: "6月", 新客: 300, 老客: 260, 渠道: 150 }];

const stackedBarChartConfig: ChartConfig = {
  新客: { label: "新客", color: "var(--chart-8)" },
  老客: { label: "老客", color: "var(--chart-6)" },
  渠道: { label: "渠道", color: "var(--chart-3)" }
};

const chartHorizontalBarData = [
{ product: "CRM", value: 860 },
{ product: "BI", value: 620 },
{ product: "协同", value: 480 },
{ product: "营销", value: 360 },
{ product: "服务", value: 280 }];

const horizontalBarChartConfig: ChartConfig = {
  value: { label: "活跃客户", color: "var(--chart-9)" }
};

const chartFunnelData = [
{ name: "访问", value: 2400, fill: "var(--chart-8)" },
{ name: "注册", value: 1680, fill: "var(--chart-7)" },
{ name: "试用", value: 980, fill: "var(--chart-6)" },
{ name: "报价", value: 420, fill: "var(--chart-3)" },
{ name: "成交", value: 160, fill: "var(--chart-1)" }];

const funnelChartConfig: ChartConfig = {
  value: { label: "数量" }
};

const chartTreemapData = [
{ name: "企业微信", size: 420, fill: "var(--chart-8)" },
{ name: "CRM", size: 360, fill: "var(--chart-9)" },
{ name: "BI", size: 260, fill: "var(--chart-6)" },
{ name: "审批", size: 180, fill: "var(--chart-3)" },
{ name: "营销", size: 150, fill: "var(--chart-1)" },
{ name: "服务", size: 120, fill: "var(--chart-10)" }];

const treemapChartConfig: ChartConfig = {
  size: { label: "使用量" }
};

function ChartPage({ actions, lang }: {actions: React.ReactNode;lang: Lang;}) {
  return (
    <div className={docsSpacing.pageStack}>
      <section id="chart" className="flex flex-col gap-2">
        <PageLead
          crumb={lang === "en" ? "Components / Chart" : "组件 / 图表"}
          title="Chart 图表"
          lead={lang === "en" ?
          "Built on Recharts via shadcn chart. Colors inherit from --chart-1~10 tokens." :
          "基于 shadcn chart（Recharts 封装）。颜色继承 --chart-1~10 token，跟随主题自动切换。"}
          actions={actions} />
      </section>

      <Separator className="my-2" />

      {/* 折线图 */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Line Chart" : "折线图"}</h2>
          <p className="text-sm text-muted-foreground mt-1">{lang === "en" ? "Trend comparison over time." : "适合趋势对比，时间轴在 X 轴。"}</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{lang === "en" ? "Monthly Revenue vs Target" : "月度成交额 vs 目标"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={lineChartConfig} className="h-[260px] w-full">
              <LineChart data={chartLineData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line type="monotone" dataKey="成交额" stroke="var(--chart-1)" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="目标" stroke="var(--chart-2)" strokeWidth={2} strokeDasharray="4 2" dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>

      <Separator className="my-2" />

      {/* 柱状图 */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Bar Chart" : "柱状图"}</h2>
          <p className="text-sm text-muted-foreground mt-1">{lang === "en" ? "Category comparison or funnel stages." : "适合分类对比，也常用于漏斗各阶段数量。"}</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{lang === "en" ? "Pipeline Funnel" : "商机漏斗各阶段"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={barChartConfig} className="h-[260px] w-full">
              <BarChart data={chartBarData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="stage" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>

      <Separator className="my-2" />

      {/* 饼图 */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Pie Chart" : "饼图"}</h2>
          <p className="text-sm text-muted-foreground mt-1">{lang === "en" ? "Part-to-whole proportion." : "适合展示占比关系，类别不超过 5 个。"}</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{lang === "en" ? "Revenue by Channel" : "成交额来源分布"}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ChartContainer config={pieChartConfig} className="h-[260px] w-full max-w-sm">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                <Pie data={chartPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100}>
                  {chartPieData.map((_, i) =>
                  <Cell key={i} fill={pieColors[i % pieColors.length]} />
                  )}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>

      <Separator className="my-2" />

      {/* 面积图 */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Area Chart" : "面积图"}</h2>
          <p className="text-sm text-muted-foreground mt-1">{lang === "en" ? "Trend with volume emphasis via fill." : "趋势+量感，填充区域强调累积量级。"}</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{lang === "en" ? "Monthly Revenue vs Target" : "月度成交额 vs 目标"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={areaChartConfig} className="h-[260px] w-full">
              <AreaChart data={chartLineData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-6)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--chart-6)" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="fillTarget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-8)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--chart-8)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Area type="monotone" dataKey="成交额" stroke="var(--chart-6)" fill="url(#fillRevenue)" strokeWidth={2} dot={{ r: 3 }} />
                <Area type="monotone" dataKey="目标" stroke="var(--chart-8)" fill="url(#fillTarget)" strokeWidth={2} strokeDasharray="4 2" dot={false} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>

      <Separator className="my-2" />

      {/* 组合图 */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Composed Chart" : "组合图（柱 + 折线）"}</h2>
          <p className="text-sm text-muted-foreground mt-1">{lang === "en" ? "Quantity and rate on the same canvas." : "量和率共屏，双 Y 轴分别承载。"}</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{lang === "en" ? "Revenue & Win Rate" : "成交额与赢单率"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={composedChartConfig} className="h-[260px] w-full">
              <ComposedChart data={chartComposedData} margin={{ top: 4, right: 24, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar yAxisId="left" dataKey="成交额" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" dataKey="赢单率" stroke="var(--chart-9)" strokeWidth={2} dot={{ r: 3 }} />
              </ComposedChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>

      <Separator className="my-2" />

      {/* 散点图 */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Scatter Chart" : "散点图"}</h2>
          <p className="text-sm text-muted-foreground mt-1">{lang === "en" ? "Distribution and correlation between two metrics." : "展示两个指标的分布和相关性。"}</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{lang === "en" ? "Deal Size vs Win Probability" : "商机金额 vs 赢单概率"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={scatterChartConfig} className="h-[260px] w-full">
              <ScatterChart margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="金额" name="金额（万）" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} label={{ value: "金额（万）", position: "insideBottom", offset: -2, fontSize: 11 }} />
                <YAxis dataKey="概率" name="赢单概率（%）" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <ZAxis range={[48, 48]} />
                <ChartTooltip cursor={{ strokeDasharray: "3 3" }} content={<ChartTooltipContent nameKey="name" />} />
                <Scatter data={chartScatterData} fill="var(--chart-9)" fillOpacity={0.75} />
              </ScatterChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>

      <Separator className="my-2" />

      {/* 雷达图 */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Radar Chart" : "雷达图"}</h2>
          <p className="text-sm text-muted-foreground mt-1">{lang === "en" ? "Multi-dimensional comparison across categories." : "多维度能力对比，适合人员 / 产品综合评估。"}</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{lang === "en" ? "Sales Rep Performance" : "销售能力雷达"}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ChartContainer config={radarChartConfig} className="h-[300px] w-full max-w-md">
              <RadarChart data={chartRadarData} cx="50%" cy="50%" outerRadius="75%">
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Radar dataKey="A" stroke="var(--chart-3)" fill="var(--chart-3)" fillOpacity={0.25} strokeWidth={2} />
                <Radar dataKey="B" stroke="var(--chart-9)" fill="var(--chart-9)" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>

      <Separator className="my-2" />

      {/* 径向柱图 */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Radial Bar Chart" : "径向柱图"}</h2>
          <p className="text-sm text-muted-foreground mt-1">{lang === "en" ? "Circular progress bars for ranking or quota attainment." : "环形进度条，适合配额达成率 / 排行榜。"}</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{lang === "en" ? "Quota Attainment by Rep" : "各销售配额完成率（%）"}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ChartContainer config={radialChartConfig} className="h-[300px] w-full max-w-sm">
              <RadialBarChart
                data={chartRadialData}
                cx="50%" cy="50%"
                innerRadius="20%" outerRadius="90%"
                startAngle={90} endAngle={-270}>
                
                <PolarAngleAxis type="number" domain={[0, 150]} tick={false} />
                <RadialBar dataKey="value" background={{ fill: "var(--muted)" }} cornerRadius={4} label={{ position: "insideStart", fill: "var(--foreground)", fontSize: 11, formatter: (v: unknown) => `${v}%` }} />
                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                <ChartLegend
                  iconSize={10}
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  content={({ payload }) =>
                  <div className="flex flex-col gap-1.5 text-xs">
                      {(payload ?? []).map((p, i) =>
                    <div key={i} className="flex items-center gap-1.5">
                          <span className="inline-block size-2 rounded-sm" style={{ backgroundColor: (p.payload as {fill: string;}).fill }} />
                          <span className="text-foreground">{(p.payload as {name: string;}).name}</span>
                          <span className="text-muted-foreground">{(p.payload as {value: number;}).value}%</span>
                        </div>
                    )}
                    </div>
                  } />
                
              </RadialBarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>

      <Separator className="my-2" />

      {/* 堆叠柱状图 */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Stacked Bar Chart" : "堆叠柱状图"}</h2>
          <p className="text-sm text-muted-foreground mt-1">{lang === "en" ? "Compare total volume while preserving category composition." : "同时看总量和组成，适合渠道 / 客群拆分。"}</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{lang === "en" ? "Revenue Mix by Customer Type" : "成交额客群构成"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={stackedBarChartConfig} className="h-[280px] w-full">
              <BarChart data={chartStackedBarData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="新客" stackId="total" fill="var(--chart-8)" radius={[0, 0, 4, 4]} />
                <Bar dataKey="老客" stackId="total" fill="var(--chart-6)" />
                <Bar dataKey="渠道" stackId="total" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>

      <Separator className="my-2" />

      {/* 横向条形图 */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Horizontal Bar Chart" : "横向条形图"}</h2>
          <p className="text-sm text-muted-foreground mt-1">{lang === "en" ? "Rank categories with longer labels." : "适合排行和长分类名称，标签更好读。"}</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{lang === "en" ? "Active Customers by Product" : "各产品活跃客户排行"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={horizontalBarChartConfig} className="h-[280px] w-full">
              <BarChart data={chartHorizontalBarData} layout="vertical" margin={{ top: 4, right: 24, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="product" width={56} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="var(--chart-9)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>

      <Separator className="my-2" />

      {/* 漏斗图 */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Funnel Chart" : "漏斗图"}</h2>
          <p className="text-sm text-muted-foreground mt-1">{lang === "en" ? "Show conversion across ordered stages." : "展示有顺序的转化过程，适合增长 / 销售漏斗。"}</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{lang === "en" ? "Acquisition Conversion" : "获客转化漏斗"}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ChartContainer config={funnelChartConfig} className="h-[300px] w-full max-w-lg">
              <FunnelChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                <Funnel dataKey="value" nameKey="name" data={chartFunnelData} isAnimationActive>
                  <LabelList dataKey="name" position="right" fill="var(--foreground)" stroke="none" fontSize={12} />
                </Funnel>
              </FunnelChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>

      <Separator className="my-2" />

      {/* 树图 */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Treemap" : "树图"}</h2>
          <p className="text-sm text-muted-foreground mt-1">{lang === "en" ? "Part-to-whole view for many categories." : "多分类占比总览，适合模块使用量 / 成本拆分。"}</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{lang === "en" ? "Module Usage Share" : "模块使用量占比"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={treemapChartConfig} className="h-[300px] w-full">
              <Treemap
                data={chartTreemapData}
                dataKey="size"
                nameKey="name"
                stroke="var(--background)"
                fill="var(--chart-8)"
                aspectRatio={4 / 3}
              />
            </ChartContainer>
          </CardContent>
        </Card>
      </section>

      <Separator className="my-2" />

      {/* 图表色板 */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Chart Tokens" : "图表色板"}</h2>
        <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">{lang === "en" ? "Token" : "Token"}</TableHead>
                <TableHead>{lang === "en" ? "Value" : "值"}</TableHead>
                <TableHead className="pr-4">{lang === "en" ? "Usage" : "用途"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
              { token: "--chart-1", value: "#FF7383", usage: "Pink 05" },
              { token: "--chart-2", value: "#FF7752", usage: "Red 05" },
              { token: "--chart-3", value: "#FF9B29", usage: "Orange 05" },
              { token: "--chart-4", value: "#FFDA54", usage: "Yellow 04" },
              { token: "--chart-5", value: "#DDF2BB", usage: "Yellow Green 03" },
              { token: "--chart-6", value: "#55D48C", usage: "Green 05" },
              { token: "--chart-7", value: "#5BCFC1", usage: "Teal 04" },
              { token: "--chart-8", value: "#40B6FF", usage: "Blue 05" },
              { token: "--chart-9", value: "#368DFF", usage: "Blue 05 deep" },
              { token: "--chart-10", value: "#976AEB", usage: "Purple 05" }].
              map((r) =>
              <TableRow key={r.token}>
                  <TableCell className="pl-4 font-medium">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{r.token}</code>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="inline-block size-4 rounded-full border border-border" style={{ backgroundColor: r.value }} />
                      <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{r.value}</code>
                    </div>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{r.usage}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>);

}

// ============ 页面模板：CRM 列表页（全部用现有组件拼装，1:1 参照公司 Figma 18906-9135） ============
type TplCustomer = {
  id: number;name: string;level: string;levelColor: "amber" | "red" | "blue";
  progress: number;progressTone: "success" | "warning" | "default";
  flag: string;phone: string;owner: string;avatar: string;
};
const tplCustomers: TplCustomer[] = [
{ id: 1, name: "三门峡嘉浩咨询有限公司", level: "VIP客户", levelColor: "amber", progress: 100, progressTone: "success", flag: "🇨🇳", phone: "+86 15201123044", owner: "孙婉茹", avatar: "/avatars/01.jpg" },
{ id: 2, name: "广西思锐建筑工作室", level: "VIP客户", levelColor: "amber", progress: 0, progressTone: "default", flag: "🇨🇳", phone: "+86 15001171032", owner: "吴彦琛", avatar: "/avatars/02.jpg" },
{ id: 3, name: "芜湖磊昇传播科技有限公司", level: "重要客户", levelColor: "red", progress: 0, progressTone: "default", flag: "🇨🇳", phone: "+86 13071032601", owner: "李婉婷", avatar: "/avatars/03.jpg" },
{ id: 4, name: "商丘运昭可哲食品有限公司", level: "一般客户", levelColor: "blue", progress: 100, progressTone: "success", flag: "🇨🇳", phone: "+86 13071032601", owner: "冯远海", avatar: "/avatars/04.jpg" },
{ id: 5, name: "台州众悦贸易有限公司", level: "一般客户", levelColor: "blue", progress: 60, progressTone: "warning", flag: "🇺🇸", phone: "+27 5001171032", owner: "周琳", avatar: "/avatars/05.jpg" },
{ id: 6, name: "佳木斯晶森科技有限公司", level: "重要客户", levelColor: "red", progress: 100, progressTone: "success", flag: "🇫🇷", phone: "+86 15001171032", owner: "冯远海", avatar: "/avatars/06.jpg" },
{ id: 7, name: "乌兰察布旭图互动科技有限公司", level: "一般客户", levelColor: "blue", progress: 40, progressTone: "warning", flag: "🇨🇳", phone: "+86 13071032601", owner: "周南", avatar: "/avatars/01.jpg" },
{ id: 8, name: "济宁金源网络科技有限公司", level: "一般客户", levelColor: "blue", progress: 0, progressTone: "default", flag: "🇩🇪", phone: "+86 15001171032", owner: "李婉婷", avatar: "/avatars/02.jpg" }];

const tplViews = [
{ value: "list", label: "列表", icon: <ListIcon /> },
{ value: "grid", label: "看板", icon: <LayoutGridIcon /> },
{ value: "map", label: "地图", icon: <MapPinIcon /> },
{ value: "split", label: "分栏", icon: <LayoutColumnsIcon /> }];

const tplScopes = [
{ key: "name", label: "客户名称" },
{ key: "owner", label: "负责人" },
{ key: "phone", label: "电话" }];


// 列定义（页面侧，只换数据/列；DataTable 只负责渲染 + 勾选）
const tplColMenu = [
{ label: "冻结此列" },
{ label: "筛选" }];

const customerColumns: Column<TplCustomer>[] = [
{ key: "name", header: "客户名称", sortable: true, sortValue: (c) => c.name, menuActions: tplColMenu, cell: (c) => <a href="#template-customer-list" className="text-foreground hover:text-link hover:underline">{c.name}</a> },
{ key: "level", header: "客户级别", sortable: true, sortValue: (c) => c.level, menuActions: tplColMenu, cell: (c) => <Tag color={c.levelColor}>{c.level}</Tag> },
{ key: "progress", header: "跟进进度", headClassName: "w-40", sortable: true, sortValue: (c) => c.progress, menuActions: tplColMenu, cell: (c) =>
  <span className="flex items-center gap-2">
      <Progress value={c.progress} tone={c.progressTone} className="w-[60px]" trackClassName="h-1" />
      <span className="w-9 shrink-0 text-sm tabular-nums text-muted-foreground">{c.progress}%</span>
    </span>
},
{ key: "phone", header: "电话", menuActions: tplColMenu, cell: (c) => <span className="inline-flex items-center gap-1.5 tabular-nums"><span>{c.flag}</span>{c.phone}</span> },
{ key: "owner", header: "负责人", menuActions: tplColMenu, cell: (c) =>
  <span className="inline-flex items-center gap-1.5">
      <Avatar className="size-5"><AvatarImage src={c.avatar} alt={c.owner} /><AvatarFallback colorful>{avatarInitials(c.owner)}</AvatarFallback></Avatar>
      {c.owner}
    </span>
}];


function CustomerListTemplate({ actions, lang }: {actions: React.ReactNode;lang: Lang;}) {
  const [q, setQ] = useState("");
  const [scope, setScope] = useState("name");
  const [view, setView] = useState("list");
  const [headerView, setHeaderView] = useState("all");
  const [selected, setSelected] = useState<Set<string | number>>(new Set());

  return (
    <div className={docsSpacing.pageStack}>
      <section id="template-customer-list" className="flex flex-col gap-2">
        <PageLead
          crumb={lang === "en" ? "Pages / List page" : "页面 / 列表页"}
          title={lang === "en" ? "List page" : "列表页"}
          lead={lang === "en" ?
          "A full CRM list page assembled entirely from existing components — top bar, nav, page header, toolbar, table and pagination." :
          "完全用现有组件拼出的 CRM 列表页：顶栏 + 导航 + 页头 + 工具栏 + 表格 + 分页，演示组件如何组装成真实页面。"}
          actions={actions} />
        
      </section>

      {/* 外壳走 CrmAppShell recipe（TopBar + 双层导航 + 内容卡槽）；本页只提供内容 children */}
      <CrmAppShell>
              {/* 页头：标题 + 可选视图下拉 + 操作插槽（三轴变体由 props/slot 决定）*/}
              <ListPageHeader
          title="客户"
          views={[
          { key: "all", label: "全部客户" },
          { key: "mine", label: "我负责的" },
          { key: "sub", label: "下属负责的" }]
          }
          view={headerView}
          onViewChange={setHeaderView}
          actions={
          <>
                    <Button size="sm"><PlusIcon data-icon="inline-start" />新建</Button>
                    <Button variant="outline" size="sm">智能表单</Button>
                    <Button variant="outline" size="sm">导入</Button>
                    <Button variant="outline" size="icon-sm" aria-label="更多"><MoreHorizontalIcon /></Button>
                  </>
          } />
        

              {/* 工具栏 */}
              <ListToolbar
          search={q}
          onSearchChange={setQ}
          scope={scope}
          scopes={tplScopes}
          onScopeChange={setScope}
          view={view}
          views={tplViews}
          onViewChange={setView}
          onFilter={() => {}}
          actions={
          <>
                    <Button variant="ghost" size="icon-sm" aria-label="显示设置" className="[&_svg]:size-3.5"><SettingsIcon /></Button>
                    <Button variant="ghost" size="icon-sm" aria-label="刷新" className="[&_svg]:size-3.5"><RefreshIcon /></Button>
                  </>
          } />
        

              {/* 表格 */}
              <div className="min-h-0 flex-1 overflow-auto px-3">
                <DataTable
            columns={customerColumns}
            data={tplCustomers}
            rowKey={(c) => c.id}
            selectable
            selected={selected}
            onSelectedChange={setSelected}
            rowActions={() =>
            <span className="flex items-center gap-3">
                      <Button variant="plain" tone="info" size="sm">查看</Button>
                      <Button variant="plain" tone="info" size="sm">编辑</Button>
                    </span>
            } />
          
              </div>

              {/* 分页：底栏整体内缩 12（分割线与内容不顶卡片边，对齐左侧 gutter）*/}
              <div className="mx-3 flex shrink-0 items-center justify-between border-t border-border-subtle py-2.5">
                <span className="text-sm text-muted-foreground">已选 {selected.size} 项</span>
                <Pagination page={1} total={193} pageSize={20} onPageChange={() => {}} />
              </div>
      </CrmAppShell>
    </div>);

}

export default App;

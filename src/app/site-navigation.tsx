import type { Dispatch, SetStateAction } from "react";
import { CommandPalette, type CommandItem } from "@/components/ui/command";
import { Tag } from "@/components/ui/tag";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeCustomizerPanel } from "@/lib/theme-customizer-panel";
import {
  defaultThemeConfig,
  getActiveCustomColor,
  getLabel,
  getThemeFontValue,
  themeAnimationOptions,
  themeColorOptions,
  themeFontOptions,
  themeFontPreviewText,
  themeRadiusOptions,
  themeShadowOptions,
  themeTextScaleOptions,
  type ThemeConfig,
  uiText,
} from "@/lib/theme-runtime";
import { ChevronDownIcon, MoonIcon, SearchIcon, SlidersIcon, SunIcon } from "@/lib/icons";
import { topNav } from "@/lib/site-navigation";

type Lang = "zh" | "en";

type SiteNavigationProps = {
  page: string;
  lang: Lang;
  dark: boolean;
  themeConfig: ThemeConfig;
  setLang: Dispatch<SetStateAction<Lang>>;
  setThemeConfig: Dispatch<SetStateAction<ThemeConfig>>;
  searchOpen: boolean;
  setSearchOpen: Dispatch<SetStateAction<boolean>>;
  themeOpen: boolean;
  setThemeOpen: Dispatch<SetStateAction<boolean>>;
  searchItems: CommandItem[];
  isGettingStartedPage: boolean;
  isFoundationArea: boolean;
  isComponentArea: boolean;
  isPageArea: boolean;
  isGovernancePage: boolean;
};

export function SiteNavigation({
  page,
  lang,
  dark,
  themeConfig,
  setLang,
  setThemeConfig,
  searchOpen,
  setSearchOpen,
  themeOpen,
  setThemeOpen,
  searchItems,
  isGettingStartedPage,
  isFoundationArea,
  isComponentArea,
  isPageArea,
  isGovernancePage,
}: SiteNavigationProps) {
  return <>
    <header className="relative z-40 h-(--fx-topbar-height) shrink-0 border-b border-border-faint bg-card">
      <div className="grid h-(--fx-topbar-height) grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-(--fx-panel-gap) px-(--fx-panel-padding) md:px-[calc(var(--fx-panel-padding)+0.5rem)] xl:gap-[calc(var(--fx-panel-gap)*2)] xl:px-[calc(var(--fx-panel-padding)+1rem)]">
        <div className="flex min-w-0 shrink-0 items-center gap-(--fx-control-gap)">
          <div className="flex size-7 items-center justify-center rounded-sm bg-primary text-primary-foreground">
            <span className="size-3.5 bg-primary-foreground" aria-hidden="true" />
          </div>
          <div className="hidden text-[18px] font-bold leading-[22px] text-foreground sm:block">
            FX<span className="text-primary">.UI</span>
          </div>
          <Tag variant="outline" className="ml-1 hidden opacity-70 2xl:inline-flex">v1.2.0</Tag>
        </div>

        <nav className="hidden h-(--fx-topbar-height) items-center justify-center gap-[calc(var(--fx-panel-gap)*3)] text-[length:var(--fx-menu-text)] leading-(--fx-menu-text--line-height) font-medium lg:flex xl:gap-[calc(var(--fx-panel-gap)*4)]">
          {topNav.map((item) => {
            const childItems = "items" in item ? item.items : undefined;
            const isActive =
              page === item.page ||
              childItems?.some((child) => child.page === page) ||
              (item.page === "intro" && isGettingStartedPage) ||
              (item.page === "tokens" && isFoundationArea) ||
              (item.page === "components" && isComponentArea) ||
              (item.page === "template-customer-list" && isPageArea) ||
              (item.page === "governance-map" && isGovernancePage) ||
              (item.page === "theme" && page === "theme");
            const topNavClass = isActive
              ? "flex h-(--fx-topbar-height) items-center border-b-2 border-primary text-primary"
              : "flex h-(--fx-topbar-height) items-center border-b-2 border-transparent text-muted-foreground transition-colors hover:text-foreground";

            if (childItems) {
              return <DropdownMenu key={item.label}>
                <DropdownMenuTrigger render={<button type="button" className={`${topNavClass} gap-(--fx-control-gap-tight)`} />}>
                  {getLabel(item, lang)}
                  <ChevronDownIcon className="size-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-40">
                  {childItems.map((child) => <DropdownMenuItem key={child.href} render={<a href={child.href} />}>
                    {getLabel(child, lang)}
                  </DropdownMenuItem>)}
                </DropdownMenuContent>
              </DropdownMenu>;
            }

            return <a key={item.label} href={item.href} className={topNavClass}>{getLabel(item, lang)}</a>;
          })}
        </nav>

        <div className="flex min-w-0 items-center justify-end gap-(--fx-control-gap) overflow-hidden">
          <button type="button" onClick={() => setSearchOpen(true)} className="hidden h-(--fx-control-sm-height) w-[180px] shrink-0 items-center gap-(--fx-control-gap-tight) rounded-md border border-border bg-muted/40 px-(--fx-control-px-xs) text-left outline-none transition-colors hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 lg:flex">
            <SearchIcon className="size-3.5 text-muted-foreground" />
            <span className="h-(--fx-control-sm-height) min-w-0 flex-1 content-center truncate text-[12px] font-normal text-muted-foreground">{uiText[lang].search}</span>
            <kbd className="inline-flex h-[18px] items-center gap-(--fx-control-gap-tight) rounded-xs border border-border-subtle bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground"><span className="text-[13px] leading-none">⌘</span><span className="text-[11px]">K</span></kbd>
          </button>
          <Button variant="outline" size="icon-sm" aria-label={uiText[lang].search} className="md:ml-auto lg:hidden" onClick={() => setSearchOpen(true)}><SearchIcon /></Button>
          <Button variant="plain" size="toolbar-icon" aria-label={lang === "zh" ? "Switch to English" : "切换到中文"} className="hidden md:inline-flex" onClick={() => setLang(lang === "zh" ? "en" : "zh")}><span className="text-[13px] font-normal leading-none">{lang === "zh" ? "EN" : "中"}</span></Button>
          <Button variant="plain" size="toolbar-icon" aria-label={dark ? lang === "en" ? "Light mode" : "浅色模式" : lang === "en" ? "Dark mode" : "暗色模式"} className="hidden md:inline-flex" onClick={() => setThemeConfig((config) => ({ ...config, mode: config.mode === "dark" ? "light" : "dark" }))}>{dark ? <SunIcon /> : <MoonIcon />}</Button>
          <Button variant="plain" size="toolbar-icon" aria-label={lang === "en" ? "Display settings" : "显示设置"} className="hidden md:inline-flex" onClick={() => setThemeOpen(true)}><SlidersIcon /></Button>
        </div>
      </div>
    </header>

    <CommandPalette open={searchOpen} onOpenChange={setSearchOpen} items={searchItems} placeholder={uiText[lang].search} emptyText={lang === "en" ? "No results" : "无匹配结果"} />
    <ThemeCustomizerPanel open={themeOpen} onOpenChange={setThemeOpen} config={themeConfig} onConfigChange={setThemeConfig} lang={lang} defaultCustomColorHex={defaultThemeConfig.customColorHex} themeColorOptions={themeColorOptions} themeFontOptions={themeFontOptions} themeFontPreviewText={themeFontPreviewText} themeTextScaleOptions={themeTextScaleOptions} themeRadiusOptions={themeRadiusOptions} themeShadowOptions={themeShadowOptions} themeAnimationOptions={themeAnimationOptions} getThemeFontValue={getThemeFontValue} getActiveCustomColor={getActiveCustomColor} />
  </>;
}

import { SearchIcon } from "@/lib/icons";
import { getLabel } from "@/lib/theme-runtime";
import type { SiteNavSection } from "@/lib/site-navigation";

type Lang = "zh" | "en";

const docsSidebarSpacing = {
  shell: "h-full overflow-y-auto px-6 py-6",
  searchTrigger: "mb-6",
  nav: "flex flex-col gap-4",
  group: "flex flex-col gap-1",
  groupLabel: "text-xs font-medium tracking-widest text-[var(--fx-neutrals-10)] uppercase",
  itemList: "flex flex-col gap-2",
};

export function DocsSidebar({ isHidden, sections, activeHash, lang, onOpenSearch }: { isHidden: boolean; sections: SiteNavSection[]; activeHash: string; lang: Lang; onOpenSearch: () => void }) {
  return <aside data-slot="docs-sidebar" className={isHidden ? "hidden" : "hidden min-h-0 border-r border-border-faint bg-card lg:block"}>
    <div className={docsSidebarSpacing.shell}>
      <button type="button" onClick={onOpenSearch} className={`${docsSidebarSpacing.searchTrigger} flex w-full items-center gap-(--fx-control-gap) rounded-lg border border-input bg-card px-(--fx-control-px-md) text-left outline-none hover:bg-muted lg:hidden`}>
        <SearchIcon className="size-4 text-muted-foreground" />
        <span className="h-(--fx-control-md-height) flex-1 content-center text-sm text-muted-foreground">{lang === "en" ? "Search" : "搜索"}</span>
      </button>
      <nav className={docsSidebarSpacing.nav}>
        {sections.map((section) => <section key={section.title} className={docsSidebarSpacing.group}>
          <div className={docsSidebarSpacing.groupLabel}>{lang === "en" && section.titleEn ? section.titleEn : section.title}</div>
          <div className={docsSidebarSpacing.itemList}>
            {section.items.map((item) => {
              const isActive = item.href === activeHash || (activeHash === "#" && item.href === "#components");
              return <a key={item.label} href={item.href} className={isActive ? "flex h-(--fx-control-md-height) items-center justify-between gap-(--fx-control-gap) rounded-md bg-primary/10 px-(--fx-control-px-md) text-[length:var(--fx-menu-text)] leading-(--fx-menu-text--line-height) font-medium text-primary" : "flex h-(--fx-control-md-height) items-center justify-between gap-(--fx-control-gap) rounded-md px-(--fx-control-px-md) text-[length:var(--fx-menu-text)] leading-(--fx-menu-text--line-height) font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"}>
                <span className="truncate">{getLabel(item, lang)}</span>
                {lang === "en" && item.labelEn && getLabel(item, lang) !== item.labelEn ? <span className={isActive ? "shrink-0 text-[length:max(12px,var(--fx-text-xs))] font-medium text-primary/70" : "shrink-0 text-[length:max(12px,var(--fx-text-xs))] font-normal text-muted-foreground/70"}>{item.labelEn}</span> : null}
              </a>;
            })}
          </div>
        </section>)}
      </nav>
    </div>
  </aside>;
}

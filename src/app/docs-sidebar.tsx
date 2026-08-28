import { SearchIcon } from "@/lib/icons";
import { getLabel } from "@/lib/theme-runtime";
import type { SiteNavSection } from "@/lib/site-navigation";

type Lang = "zh" | "en";

const docsSidebarSpacing = {
  shell: "h-full overflow-y-auto px-6 py-6",
  searchTrigger: "mb-6",
  nav: "flex flex-col gap-4",
  group: "flex flex-col gap-1",
  groupLabel: "text-xs font-medium tracking-widest text-[var(--fds-g-color-text-subtle)] uppercase",
  itemList: "flex flex-col gap-2",
};

export function DocsSidebar({ isHidden, sections, activeHash, lang, onOpenSearch }: { isHidden: boolean; sections: SiteNavSection[]; activeHash: string; lang: Lang; onOpenSearch: () => void }) {
  return <aside data-slot="docs-sidebar" className={isHidden ? "hidden" : "hidden min-h-0 border-r border-border-faint bg-card lg:block"}>
    <div className={docsSidebarSpacing.shell}>
      <button type="button" onClick={onOpenSearch} className={`${docsSidebarSpacing.searchTrigger} flex w-full items-center gap-(--fds-g-spacing-control-gap) rounded-lg border border-input bg-card px-(--fds-g-spacing-control-inline-md) text-left outline-none hover:bg-muted lg:hidden`}>
        <SearchIcon className="size-4 text-muted-foreground" />
        <span className="h-(--fds-g-sizing-control-block-md) flex-1 content-center text-sm text-muted-foreground">{lang === "en" ? "Search" : "搜索"}</span>
      </button>
      <nav className={docsSidebarSpacing.nav}>
        {sections.map((section) => <section key={section.title} className={docsSidebarSpacing.group}>
          <div className={docsSidebarSpacing.groupLabel}>{lang === "en" && section.titleEn ? section.titleEn : section.title}</div>
          <div className={docsSidebarSpacing.itemList}>
            {section.items.map((item) => {
              const isActive = item.href === activeHash || (activeHash === "#" && item.href === "#components");
              return <a key={item.label} href={item.href} className={isActive ? "flex h-(--fds-g-sizing-control-block-md) items-center justify-between gap-(--fds-g-spacing-control-gap) rounded-md bg-(--fds-g-color-action-primary-subtle) px-(--fds-g-spacing-control-inline-md) text-[length:var(--fds-g-font-size-menu)] leading-(--fds-g-font-line-height-menu) font-medium text-(--fds-g-color-brand-identity)" : "flex h-(--fds-g-sizing-control-block-md) items-center justify-between gap-(--fds-g-spacing-control-gap) rounded-md px-(--fds-g-spacing-control-inline-md) text-[length:var(--fds-g-font-size-menu)] leading-(--fds-g-font-line-height-menu) font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"}>
                <span className="truncate">{getLabel(item, lang)}</span>
                {lang === "en" && item.labelEn && getLabel(item, lang) !== item.labelEn ? <span className={isActive ? "shrink-0 text-[length:max(12px,var(--fds-g-font-size-xs))] font-medium text-(--fds-g-color-brand-identity) opacity-70" : "shrink-0 text-[length:max(12px,var(--fds-g-font-size-xs))] font-normal text-muted-foreground/70"}>{item.labelEn}</span> : null}
              </a>;
            })}
          </div>
        </section>)}
      </nav>
    </div>
  </aside>;
}

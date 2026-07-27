import type { CommandItem } from "@/components/ui/command"
import type { SiteNavItem, SiteNavSection } from "@/lib/site-navigation"
import { getLabel } from "@/lib/theme-runtime"

import type { PageSlugResolver } from "./hash-routing"

type Lang = "zh" | "en"

function allNavigationItems(topNav: SiteNavItem[], docsNav: SiteNavSection[]) {
  return [
    ...topNav,
    ...topNav.flatMap((item) => item.items ?? []),
    ...docsNav.flatMap((section) => section.items),
  ]
}

export function getNavigationItemFromHash(hash: string, topNav: SiteNavItem[], docsNav: SiteNavSection[]) {
  return allNavigationItems(topNav, docsNav).find((item) => item.href === (hash || "#intro"))
}

export function getNavigationItemFromPage(page: string, topNav: SiteNavItem[], docsNav: SiteNavSection[], resolvePageSlug: PageSlugResolver) {
  return allNavigationItems(topNav, docsNav).find((item) => resolvePageSlug(item.href) === page)
}

export function getFooterNavigationPair<T extends { href: string }>(page: string, footerNavItems: T[], resolvePageSlug: PageSlugResolver) {
  const currentIndex = footerNavItems.findIndex((item) => resolvePageSlug(item.href) === page)
  const fallbackIndex = footerNavItems.findIndex((item) => item.href === "#intro")
  const index = currentIndex >= 0 ? currentIndex : fallbackIndex

  return {
    previous: index > 0 ? footerNavItems[index - 1] : null,
    next: index >= 0 && index < footerNavItems.length - 1 ? footerNavItems[index + 1] : null,
  }
}

export function createSearchItems(topNav: SiteNavItem[], docsNav: SiteNavSection[], lang: Lang, onSelect: (href: string) => void): CommandItem[] {
  const fromNav = docsNav.flatMap((section) => section.items.map((item) => ({
    id: item.href,
    label: getLabel(item, lang),
    meta: lang === "en" ? undefined : item.labelEn && item.labelEn !== item.label ? item.labelEn : undefined,
    group: lang === "en" ? section.titleEn : section.title,
    keywords: `${item.label} ${item.labelEn ?? ""} ${item.href}`,
    onSelect: () => onSelect(item.href),
  })))
  const fromTop = topNav.flatMap((item) => [item, ...(item.items ?? [])].map((entry) => ({
    id: entry.href,
    label: getLabel(entry, lang),
    meta: lang === "en" ? undefined : entry.labelEn && entry.labelEn !== entry.label ? entry.labelEn : undefined,
    group: lang === "en" ? "Navigation" : "导航",
    keywords: `${entry.label} ${entry.labelEn ?? ""} ${entry.href}`,
    onSelect: () => onSelect(entry.href),
  })))

  return [...fromTop, ...fromNav]
}

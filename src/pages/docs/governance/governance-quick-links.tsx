import type { ReactNode } from "react"

export type GovernanceQuickLink = {
  label: string
  labelEn?: string
  href: string
  page?: string
}

export function GovernanceQuickLinks({
  currentPage,
  lang,
  items,
}: {
  currentPage: string
  lang: "zh" | "en"
  items: GovernanceQuickLink[]
}) {
  const getLabel = (item: GovernanceQuickLink): ReactNode => lang === "en" ? item.labelEn ?? item.label : item.label

  return (
    <div className="flex flex-wrap gap-2 pt-2">
      {items.map((item) => {
        const isActive = currentPage === item.page
        return (
          <a
            key={item.href}
            href={item.href}
            className={isActive
              ? "rounded-full bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
              : "rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"}
          >
            {getLabel(item)}
          </a>
        )
      })}
    </div>
  )
}

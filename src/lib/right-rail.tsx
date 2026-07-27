import type { ReactNode } from "react"

export type RightRailAnchor = {
  href: string
  label: string
  labelEn?: string
}

export type RightRailLang = "zh" | "en"

export function RightRail({
  activeAnchor,
  anchors,
  lang,
  tocLabel,
  getLabel,
  onAnchorSelect,
}: {
  activeAnchor: string
  anchors: RightRailAnchor[]
  lang: RightRailLang
  tocLabel: ReactNode
  getLabel: (item: RightRailAnchor, lang: RightRailLang) => ReactNode
  onAnchorSelect: (href: string) => void
}) {
  if (anchors.length === 0) return null

  return (
    <aside className="hidden 2xl:block">
      <div className="sticky top-8">
        <nav className="border-l border-border pl-6">
          <div className="mb-4 text-sm font-medium text-foreground">{tocLabel}</div>
          <div className="flex flex-col gap-2 text-sm">
            {anchors.map((item) => {
              const isActive = activeAnchor === item.href

              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(event) => {
                    event.preventDefault()
                    onAnchorSelect(item.href)
                  }}
                  className={
                    isActive ?
                      "relative flex items-center font-medium text-foreground" :
                      "relative flex items-center text-muted-foreground transition-colors hover:text-foreground"
                  }
                >
                  {getLabel(item, lang)}
                </a>
              )
            })}
          </div>
        </nav>
      </div>
    </aside>
  )
}

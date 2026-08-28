export type SiteNavItem = {
  label: string
  labelEn: string
  href: string
  page?: string
  items?: SiteNavItem[]
}

export type SiteNavSection = {
  title: string
  titleEn: string
  items: SiteNavItem[]
}

export const topNav: SiteNavItem[] = [
  { label: "基础", labelEn: "Foundations", href: "#tokens", page: "tokens" },
]

export const docsNav: SiteNavSection[] = [
  {
    title: "设计令牌",
    titleEn: "Design Tokens",
    items: [
      { label: "概览", labelEn: "Overview", href: "#tokens" },
      { label: "颜色", labelEn: "Colors", href: "#tokens-colors" },
      { label: "排版", labelEn: "Typography", href: "#tokens-typography" },
      { label: "图标", labelEn: "Icons", href: "#tokens-icons" },
      { label: "圆角", labelEn: "Radius", href: "#tokens-radius" },
      { label: "阴影", labelEn: "Shadow", href: "#tokens-shadow" },
      { label: "间距", labelEn: "Spacing", href: "#tokens-spacing" },
      { label: "层级", labelEn: "Layer", href: "#tokens-layer" },
      { label: "动效", labelEn: "Motion", href: "#tokens-motion" },
    ],
  },
  {
    title: "布局系统",
    titleEn: "Layout",
    items: [
      { label: "栅格", labelEn: "Grid", href: "#grid" },
      { label: "布局", labelEn: "Layout", href: "#layout" },
    ],
  },
]

export const componentIndexSections: SiteNavSection[] = []
export const tokenNavSections = docsNav.filter((section) => section.title === "设计令牌")
export const layoutNavSections = docsNav.filter((section) => section.title === "布局系统")
export const foundationNavSections = docsNav
export const pageNavSections: SiteNavSection[] = []
export const governanceNavSections: SiteNavSection[] = []

export const footerNavItems = docsNav.flatMap((section) =>
  section.items.map((item) => ({ ...item, group: section.title, groupEn: section.titleEn })),
)

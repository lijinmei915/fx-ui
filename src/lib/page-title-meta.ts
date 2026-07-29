import { createContext } from "react"

export type PageTitleMeta = {
  titleZh: string
  titleEn: string
  lang: "zh" | "en"
}

export const PageTitleMetaContext = createContext<PageTitleMeta | undefined>(undefined)

export function getDisplayTitle(title: string, titleMeta?: PageTitleMeta) {
  if (!titleMeta) return title
  return titleMeta.lang === "zh" ? titleMeta.titleZh : titleMeta.titleEn
}

export function getTitleMeta(titleMeta?: PageTitleMeta) {
  return titleMeta?.lang === "zh" ? titleMeta.titleEn : undefined
}

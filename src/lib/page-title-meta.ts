import { createContext } from "react"

export const PageTitleMetaContext = createContext<string | undefined>(undefined)

export function getDisplayTitle(title: string, titleMeta?: string) {
  if (!titleMeta) return title
  return title === titleMeta ? title : title.replace(new RegExp(`^${titleMeta.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s+`), "")
}

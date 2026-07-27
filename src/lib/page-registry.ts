import type { ReactNode } from "react"

export type PageAnchor = {
  label: string
  labelEn?: string
  href: string
}

export type PageEntry = {
  anchors: PageAnchor[]
  render: (actions: ReactNode, lang: "zh" | "en", page: string, titleMeta?: string) => ReactNode
  fullBleed?: boolean
}

const playgroundPrimaryAnchorPattern = /-(overview|preview|usage)$/

/** Apply manifest-driven Playground-first directory rules to a page registry. */
export function finalizePageRegistry(
  registry: Record<string, PageEntry>,
  playgroundPrimarySlugs: Iterable<string>,
): Record<string, PageEntry> {
  const finalized = { ...registry }
  for (const slug of playgroundPrimarySlugs) {
    const entry = finalized[slug]
    if (!entry) continue
    finalized[slug] = {
      ...entry,
      anchors: entry.anchors.filter((anchor) => !playgroundPrimaryAnchorPattern.test(anchor.href.replace(/^#/, ""))),
    }
  }
  return finalized
}

/** Resolve a hash to the longest matching registered page slug. */
export function resolvePageSlug(hash: string, registry: Record<string, PageEntry>): string {
  if (hash === "" || hash === "#") return "intro"
  const raw = hash.replace("#", "")
  if (registry[raw]) return raw
  const base = Object.keys(registry)
    .filter((slug) => hash === `#${slug}` || hash.startsWith(`#${slug}-`))
    .sort((left, right) => right.length - left.length)[0]
  return base ?? raw ?? "components"
}

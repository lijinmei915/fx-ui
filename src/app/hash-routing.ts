export type PageSlugResolver = (hash: string) => string

export function getPageFromHash(hash: string, resolvePageSlug: PageSlugResolver) {
  if (hash === "#ai-rules" || hash.startsWith("#ai-")) return "ai-rules"
  return resolvePageSlug(hash)
}

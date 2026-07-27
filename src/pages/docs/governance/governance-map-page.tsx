import type { ReactNode } from "react"
import { docsSpacing } from "@/lib/docs-spacing"

export function GovernanceMapPage({
  header,
  status,
  systemMap,
  freshness,
  loop,
  references,
}: {
  header: ReactNode
  status: ReactNode
  systemMap: ReactNode
  freshness: ReactNode
  loop: ReactNode
  references: ReactNode
}) {
  return (
    <div className={docsSpacing.pageStack}>
      <section id="governance-map" className="flex flex-col gap-3">{header}</section>
      <section id="governance-map-status" className={docsSpacing.sectionStack}>{status}</section>
      {systemMap}
      {freshness}
      {loop}
      {references}
    </div>
  )
}

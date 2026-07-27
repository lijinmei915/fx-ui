import type { ReactNode } from "react"

import { Tag } from "@/components/ui/tag"

export type FileRelation = {
  group: string
  source: string
  action: string
  target: string
  result: string
  emphasis?: boolean
}

export function StepBadge({ index }: { index: number }) {
  return <Tag variant="outline">{String(index + 1).padStart(2, "0")}</Tag>
}

export function CountBadge({ children }: { children: ReactNode }) {
  return <Tag variant="outline">{children}</Tag>
}

export function StatusBadge({ status }: { status: string }) {
  return <Tag variant="outline">{status}</Tag>
}

function FileRelationRow({ relation }: { relation: FileRelation }) {
  return (
    <div className="grid gap-3 rounded-xl border border-border bg-background p-3 xl:grid-cols-[minmax(0,1fr)_132px_minmax(0,1fr)_minmax(0,1.2fr)]">
      <div>
        <div className="text-xs font-medium text-muted-foreground">来源文件</div>
        <code className="mt-1 block break-words rounded-lg bg-muted px-2 py-1.5 text-xs text-foreground">{relation.source}</code>
      </div>
      <div className="flex items-center xl:justify-center"><Tag variant={relation.emphasis ? "default" : "secondary"}>{relation.action}</Tag></div>
      <div>
        <div className="text-xs font-medium text-muted-foreground">作用对象</div>
        <code className="mt-1 block break-words rounded-lg bg-muted px-2 py-1.5 text-xs text-foreground">{relation.target}</code>
      </div>
      <div>
        <div className="text-xs font-medium text-muted-foreground">运行结果</div>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{relation.result}</p>
      </div>
    </div>
  )
}

export function FileRelationMap({ relations }: { relations: FileRelation[] }) {
  const groups = relations.reduce<Record<string, FileRelation[]>>((acc, relation) => {
    acc[relation.group] = [...(acc[relation.group] ?? []), relation]
    return acc
  }, {})

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-muted p-4">
      <div className="rounded-2xl border border-border bg-background/70 p-4">
        <div className="text-sm font-medium text-foreground">怎么看这张图</div>
        <p className="mt-2 text-sm text-muted-foreground">这里不表达时间顺序，而是表达文件之间的作用关系：谁被 import、谁被读取、谁负责检查、谁产出页面或分发包。</p>
      </div>
      {Object.entries(groups).map(([group, items]) => (
        <div key={group} className="flex flex-col gap-3">
          <h3 className="text-base font-semibold text-foreground">{group}</h3>
          <div className="flex flex-col gap-3">{items.map((relation) => <FileRelationRow key={`${relation.source}-${relation.action}-${relation.target}`} relation={relation} />)}</div>
        </div>
      ))}
    </div>
  )
}

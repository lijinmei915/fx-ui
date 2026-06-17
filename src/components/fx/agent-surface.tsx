import { AlertCircleIcon, FileTextIcon, LightbulbIcon } from "@/lib/icons"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type AgentAction = {
  label: string
  event: string
  payload?: Record<string, unknown>
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive"
}

type AgentTextBlock = {
  id?: string
  type: "text"
  text: string
  tone?: "default" | "muted"
}

type AgentObjectCardBlock = {
  id?: string
  type: "object-card"
  title: string
  description?: string
  fields: {
    label: string
    value: string
  }[]
  actions?: AgentAction[]
}

type AgentFileCardBlock = {
  id?: string
  type: "file-card"
  title: string
  filename: string
  summary?: string
  meta?: string
  actions?: AgentAction[]
}

type AgentInsightCardBlock = {
  id?: string
  type: "insight-card"
  title: string
  summary: string
  tone?: "info" | "success" | "warning" | "danger"
  evidence?: string[]
  actions?: AgentAction[]
}

type AgentActionRowBlock = {
  id?: string
  type: "action-row"
  actions: AgentAction[]
}

type AgentSurfaceBlock =
  | AgentTextBlock
  | AgentObjectCardBlock
  | AgentFileCardBlock
  | AgentInsightCardBlock
  | AgentActionRowBlock
  | {
      id?: string
      type: string
    }

type AgentSurfaceSchema = {
  id: string
  title?: string
  description?: string
  blocks: AgentSurfaceBlock[]
}

type AgentSurfaceEvent = {
  surfaceId: string
  event: string
  payload?: Record<string, unknown>
}

type AgentSurfaceProps = {
  surface: AgentSurfaceSchema
  onAction?: (event: AgentSurfaceEvent) => void
  emptyText?: string
}

function AgentSurface({
  surface,
  onAction,
  emptyText = "Agent 暂未生成可展示内容。",
}: AgentSurfaceProps) {
  return (
    <section data-slot="agent-surface" className="flex flex-col gap-4">
      {surface.title || surface.description ? (
        <div data-slot="agent-surface-header" className="flex flex-col gap-1">
          {surface.title ? <h3 className="text-base font-semibold text-foreground">{surface.title}</h3> : null}
          {surface.description ? (
            <p className="text-sm leading-6 text-muted-foreground">{surface.description}</p>
          ) : null}
        </div>
      ) : null}

      {surface.blocks.length > 0 ? (
        <div data-slot="agent-surface-blocks" className="flex flex-col gap-3">
          {surface.blocks.map((block, index) => (
            <AgentSurfaceBlockView
              key={block.id ?? `${block.type}-${index}`}
              block={block}
              surfaceId={surface.id}
              onAction={onAction}
            />
          ))}
        </div>
      ) : (
        <Card data-slot="agent-surface-empty">
          <CardContent className="text-sm text-muted-foreground">{emptyText}</CardContent>
        </Card>
      )}
    </section>
  )
}

function AgentSurfaceBlockView({
  block,
  surfaceId,
  onAction,
}: {
  block: AgentSurfaceBlock
  surfaceId: string
  onAction?: (event: AgentSurfaceEvent) => void
}) {
  if (isAgentTextBlock(block)) {
    return (
      <p
        data-slot="agent-surface-text"
        className={block.tone === "muted" ? "text-sm leading-7 text-muted-foreground" : "text-sm leading-7 text-foreground"}
      >
        {block.text}
      </p>
    )
  }

  if (isAgentObjectCardBlock(block)) {
    const [primary, ...metas] = block.fields
    const primaryInitial = primary?.value?.trim().charAt(0) ?? ""
    return (
      <Card
        data-slot="agent-surface-object-card"
        className="gap-4 rounded-2xl ring-1 ring-[#EAEBEE] shadow-none [--card-spacing:--spacing(5)]"
      >
        {primary ? (
          <CardContent className="pt-(--card-spacing)">
            <div className="flex items-start gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-[#FFF7E6] text-[18px] font-semibold text-primary">
                {primaryInitial}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] text-muted-foreground">{primary.label}</div>
                <div className="truncate text-[16px] font-semibold text-foreground">{primary.value}</div>
              </div>
            </div>
            {metas.length ? (
              <dl className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[13px]">
                {metas.map((field, i) => (
                  <div key={field.label} className="flex items-center gap-1.5">
                    {i > 0 ? <span className="size-0.5 rounded-full bg-[#C1C5CE]" aria-hidden /> : null}
                    <dt className="text-muted-foreground">{field.label}</dt>
                    <dd className="font-medium text-foreground">{field.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </CardContent>
        ) : null}
        {block.actions?.length ? (
          <CardFooter className="justify-end border-t-0 bg-transparent pt-0">
            <AgentActionButtons actions={block.actions} surfaceId={surfaceId} onAction={onAction} />
          </CardFooter>
        ) : null}
      </Card>
    )
  }

  if (isAgentFileCardBlock(block)) {
    return (
      <Card data-slot="agent-surface-file-card" className="gap-3 shadow-sm">
        <CardHeader>
          <AgentCardEyebrow label="文件" dotClassName="bg-[--fx-primary]" />
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF7E6] text-[--fx-primary]">
              <FileTextIcon className="size-[18px]" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-[15px] font-semibold">{block.title}</CardTitle>
              <CardDescription className="break-words">{block.filename}</CardDescription>
            </div>
            {block.meta ? <Badge variant="outline" className="rounded-full font-normal">{block.meta}</Badge> : null}
          </div>
        </CardHeader>
        {block.summary || block.actions?.length ? (
          <>
            {block.summary ? (
              <CardContent className="text-[13px] leading-6 text-muted-foreground">{block.summary}</CardContent>
            ) : null}
            {block.actions?.length ? (
              <CardFooter className="border-t-0 bg-transparent pt-0">
                <AgentActionButtons actions={block.actions} surfaceId={surfaceId} onAction={onAction} />
              </CardFooter>
            ) : null}
          </>
        ) : null}
      </Card>
    )
  }

  if (isAgentInsightCardBlock(block)) {
    const toneLabel = getInsightToneLabel(block.tone) ?? "结论"
    const toneStyle = getInsightToneStyle(block.tone)

    return (
      <Card data-slot="agent-surface-insight-card" className="gap-3 shadow-sm">
        <CardHeader>
          <AgentCardEyebrow label={toneLabel} dotClassName={toneStyle.dot} labelClassName={toneStyle.label} />
          <div className="flex items-start gap-3">
            <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${toneStyle.iconBg} ${toneStyle.iconColor}`}>
              <LightbulbIcon className="size-[18px]" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-[15px] font-semibold">{block.title}</CardTitle>
              <CardDescription className="leading-6">{block.summary}</CardDescription>
            </div>
          </div>
        </CardHeader>
        {block.evidence?.length || block.actions?.length ? (
          <>
            {block.evidence?.length ? (
              <CardContent>
                <ul className="flex flex-col gap-1.5 text-[13px] leading-6 text-muted-foreground">
                  {block.evidence.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className={`mt-2 size-1 shrink-0 rounded-full ${toneStyle.dot}`} aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            ) : null}
            {block.actions?.length ? (
              <CardFooter className="border-t-0 bg-transparent pt-0">
                <AgentActionButtons actions={block.actions} surfaceId={surfaceId} onAction={onAction} />
              </CardFooter>
            ) : null}
          </>
        ) : null}
      </Card>
    )
  }

  if (isAgentActionRowBlock(block)) {
    return (
      <div data-slot="agent-surface-action-row" className="flex flex-wrap items-center gap-2">
        <AgentActionButtons actions={block.actions} surfaceId={surfaceId} onAction={onAction} />
      </div>
    )
  }

  return (
    <Card data-slot="agent-surface-unsupported">
      <CardContent className="flex items-start gap-3 text-sm text-muted-foreground">
        <AlertCircleIcon className="mt-0.5 shrink-0" />
        <div>
          <div className="font-medium text-foreground">不支持的 Agent UI 块</div>
          <p className="mt-1">type="{block.type}" 不在 fx-ui AgentSurface 白名单里，前端不会执行或渲染未知代码。</p>
        </div>
      </CardContent>
    </Card>
  )
}

function isAgentTextBlock(block: AgentSurfaceBlock): block is AgentTextBlock {
  return block.type === "text" && "text" in block
}

function isAgentObjectCardBlock(block: AgentSurfaceBlock): block is AgentObjectCardBlock {
  return block.type === "object-card" && "title" in block && "fields" in block
}

function isAgentFileCardBlock(block: AgentSurfaceBlock): block is AgentFileCardBlock {
  return block.type === "file-card" && "title" in block && "filename" in block
}

function isAgentInsightCardBlock(block: AgentSurfaceBlock): block is AgentInsightCardBlock {
  return block.type === "insight-card" && "title" in block && "summary" in block
}

function isAgentActionRowBlock(block: AgentSurfaceBlock): block is AgentActionRowBlock {
  return block.type === "action-row" && "actions" in block
}

function getInsightToneLabel(tone: AgentInsightCardBlock["tone"]) {
  if (tone === "success") return "建议"
  if (tone === "warning") return "注意"
  if (tone === "danger") return "风险"
  if (tone === "info") return "结论"
  return null
}

function getInsightToneStyle(tone: AgentInsightCardBlock["tone"]) {
  if (tone === "info") return {
    dot: "bg-[#0C6CFF]",
    label: "text-[#0C6CFF]",
    iconBg: "bg-[#E6F4FF]",
    iconColor: "text-[#0C6CFF]",
  }
  if (tone === "success") return {
    dot: "bg-[#30C776]",
    label: "text-[#1FA160]",
    iconBg: "bg-[#F0FFF4]",
    iconColor: "text-[#1FA160]",
  }
  if (tone === "warning") return {
    dot: "bg-[#FF7C19]",
    label: "text-[#D95D0B]",
    iconBg: "bg-[#FFF5E6]",
    iconColor: "text-[#D95D0B]",
  }
  if (tone === "danger") return {
    dot: "bg-[#FF522A]",
    label: "text-[#D93518]",
    iconBg: "bg-[#FFF5F0]",
    iconColor: "text-[#D93518]",
  }
  return {
    dot: "bg-[--fx-primary]",
    label: "text-muted-foreground",
    iconBg: "bg-muted",
    iconColor: "text-muted-foreground",
  }
}

function AgentCardEyebrow({
  label,
  dotClassName,
  labelClassName = "text-muted-foreground",
}: {
  label: string
  dotClassName: string
  labelClassName?: string
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`size-1.5 shrink-0 rounded-full ${dotClassName}`} aria-hidden />
      <span className={`text-[11px] font-medium tracking-[0.06em] ${labelClassName}`}>{label}</span>
    </div>
  )
}

function AgentActionButtons({
  actions,
  surfaceId,
  onAction,
}: {
  actions: AgentAction[]
  surfaceId: string
  onAction?: (event: AgentSurfaceEvent) => void
}) {
  return (
    <div data-slot="agent-surface-actions" className="flex flex-wrap items-center gap-2">
      {actions.map((action, index) => (
        <Button
          key={`${action.event}-${index}`}
          type="button"
          variant={action.variant ?? (index === 0 ? "default" : "outline")}
          onClick={() => onAction?.({ surfaceId, event: action.event, payload: action.payload })}
        >
          {action.label}
        </Button>
      ))}
    </div>
  )
}

export type {
  AgentAction,
  AgentActionRowBlock,
  AgentFileCardBlock,
  AgentInsightCardBlock,
  AgentObjectCardBlock,
  AgentSurfaceBlock,
  AgentSurfaceEvent,
  AgentSurfaceProps,
  AgentSurfaceSchema,
  AgentTextBlock,
}
export { AgentSurface }

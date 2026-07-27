import { AlertCircleIcon, AlertTriangleIcon, FileTextIcon, LightbulbIcon } from "@/lib/icons"

import { Tag } from "@/components/ui/tag"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { WebsiteCardContainer } from "@/components/fx/website-card-container"

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
  const actionableBlocks = surface.blocks.filter(isAgentActionRowBlock)
  const contentBlocks = surface.blocks.filter((block) => !isAgentActionRowBlock(block))

  return (
    <section data-slot="agent-surface" className="flex flex-col gap-3">
      {surface.title || surface.description ? (
        <div data-slot="agent-surface-header" className="flex flex-col gap-1">
          {surface.title ? <h3 className="text-base font-semibold text-foreground">{surface.title}</h3> : null}
          {surface.description ? (
            <p className="text-sm leading-6 text-muted-foreground">{surface.description}</p>
          ) : null}
        </div>
      ) : null}

      {surface.blocks.length > 0 ? (
        <WebsiteCardContainer data-slot="agent-surface-blocks" padding="none">
          <div className="flex flex-col">
            {contentBlocks.map((block, index) => (
              <AgentSurfaceBlockView
                key={block.id ?? `${block.type}-${index}`}
                block={block}
                surfaceId={surface.id}
                onAction={onAction}
                compact={index > 0}
              />
            ))}
          </div>
          {actionableBlocks.length ? (
            <div data-slot="agent-surface-action-row" className="border-t border-border-subtle bg-muted px-4 py-3">
              <AgentActionButtons
                actions={actionableBlocks.flatMap((block) => block.actions)}
                surfaceId={surface.id}
                onAction={onAction}
              />
            </div>
          ) : null}
        </WebsiteCardContainer>
      ) : (
        <WebsiteCardContainer data-slot="agent-surface-empty">
          <CardContent className="text-sm text-muted-foreground">{emptyText}</CardContent>
        </WebsiteCardContainer>
      )}
    </section>
  )
}

function AgentSurfaceBlockView({
  block,
  surfaceId,
  onAction,
  compact = false,
}: {
  block: AgentSurfaceBlock
  surfaceId: string
  onAction?: (event: AgentSurfaceEvent) => void
  compact?: boolean
}) {
  if (isAgentTextBlock(block)) {
    return (
      <p
        data-slot="agent-surface-text"
        className={block.tone === "muted" ? "px-4 py-3 text-sm leading-6 text-muted-foreground" : "px-4 py-3 text-sm leading-6 text-foreground"}
      >
        {block.text}
      </p>
    )
  }

  if (isAgentObjectCardBlock(block)) {
    const [primary, ...metas] = block.fields
    const primaryInitial = primary?.value?.trim().charAt(0) ?? ""
    return (
      <div
        data-slot="agent-surface-object-card"
        className={compact ? "border-t border-border-subtle px-4 py-4" : "px-4 py-4"}
      >
        {primary ? (
          <>
            <div className="flex items-start gap-3.5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-light text-base font-semibold text-primary">
                {primaryInitial}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
                  <div className="text-sm text-muted-foreground">{primary.label}</div>
                  <div className="truncate text-lg font-semibold text-foreground">{primary.value}</div>
                </div>
                {block.description ? (
                  <div className="mt-1 text-sm leading-6 text-muted-foreground">{block.description}</div>
                ) : null}
              </div>
            </div>
            {metas.length ? (
              <dl className="mt-3 grid gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
                {metas.map((field, i) => (
                  <div key={`${field.label}-${i}`} className="min-w-0 rounded-md bg-muted px-3 py-2">
                    <dt className="text-xs text-muted-foreground">{field.label}</dt>
                    <dd className="mt-0.5 truncate font-medium text-foreground">{field.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </>
        ) : null}
        {block.actions?.length ? (
          <div className="mt-3">
            <AgentActionButtons actions={block.actions} surfaceId={surfaceId} onAction={onAction} />
          </div>
        ) : null}
      </div>
    )
  }

  if (isAgentFileCardBlock(block)) {
    return (
      <div data-slot="agent-surface-file-card" className={compact ? "border-t border-border-subtle px-4 py-3" : "px-4 py-3"}>
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <FileTextIcon />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
              <div className="text-sm font-medium text-muted-foreground">{block.title}</div>
              {block.meta ? <Tag variant="outline" className="h-5 rounded-full px-2 text-xs font-normal">{block.meta}</Tag> : null}
            </div>
            <div className="mt-0.5 truncate text-base font-semibold text-foreground">{block.filename}</div>
            {block.summary ? (
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{block.summary}</p>
            ) : null}
          </div>
        </div>
        {block.actions?.length ? (
          <div className="mt-3">
            <AgentActionButtons actions={block.actions} surfaceId={surfaceId} onAction={onAction} />
          </div>
        ) : null}
      </div>
    )
  }

  if (isAgentInsightCardBlock(block)) {
    const toneLabel = getInsightToneLabel(block.tone) ?? "结论"
    const toneStyle = getInsightToneStyle(block.tone)

    return (
      <div data-slot="agent-surface-insight-card" className={compact ? "border-t border-border-subtle px-4 py-4" : "px-4 py-4"}>
        <div className={`rounded-lg border px-3 py-3 ${toneStyle.panel}`}>
          <div className="flex items-start gap-3">
            <div className={`flex size-8 shrink-0 items-center justify-center rounded-md ${toneStyle.iconBg} ${toneStyle.iconColor}`}>
              {block.tone === "warning" || block.tone === "danger" ? <AlertTriangleIcon /> : <LightbulbIcon />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <AgentCardEyebrow label={toneLabel} dotClassName={toneStyle.dot} labelClassName={toneStyle.label} />
                <div className="font-semibold text-foreground">{block.title}</div>
              </div>
              <p className="mt-1 text-sm leading-6 text-foreground-secondary">{block.summary}</p>
              {block.evidence?.length ? (
                <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                  {block.evidence.map((item, index) => {
                    const [label, value] = splitEvidence(item)
                    return (
                      <div key={item} className="min-w-0">
                        <dt className="text-xs text-muted-foreground">{label ?? `依据 ${index + 1}`}</dt>
                        <dd className="mt-0.5 truncate font-medium text-foreground">{value ?? item}</dd>
                      </div>
                    )
                  })}
                </dl>
              ) : null}
              {block.actions?.length ? (
                <div className="mt-3">
                  <AgentActionButtons actions={block.actions} surfaceId={surfaceId} onAction={onAction} />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isAgentActionRowBlock(block)) {
    return (
      <div data-slot="agent-surface-action-row" className={compact ? "border-t border-border-subtle px-4 py-3" : "px-4 py-3"}>
        <AgentActionButtons actions={block.actions} surfaceId={surfaceId} onAction={onAction} />
      </div>
    )
  }

  return (
    <WebsiteCardContainer data-slot="agent-surface-unsupported">
      <CardContent className="flex items-start gap-3 text-base text-muted-foreground">
        <AlertCircleIcon className="mt-0.5 shrink-0" />
        <div>
          <div className="font-medium text-foreground">不支持的 Agent UI 块</div>
          <p className="mt-1">type="{block.type}" 不在 fx-ui AgentSurface 白名单里，前端不会执行或渲染未知代码。</p>
        </div>
      </CardContent>
    </WebsiteCardContainer>
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
    dot: "bg-info",
    label: "text-info",
    iconBg: "bg-info-light",
    iconColor: "text-info",
    panel: "border-info-light-active bg-info-light",
  }
  if (tone === "success") return {
    dot: "bg-success",
    label: "text-success",
    iconBg: "bg-success-light",
    iconColor: "text-success",
    panel: "border-success-light-active bg-success-light",
  }
  if (tone === "warning") return {
    dot: "bg-warning",
    label: "text-warning",
    iconBg: "bg-warning-light",
    iconColor: "text-warning",
    panel: "border-warning-light-active bg-warning-light",
  }
  if (tone === "danger") return {
    dot: "bg-destructive",
    label: "text-destructive",
    iconBg: "bg-destructive-light",
    iconColor: "text-destructive",
    panel: "border-destructive-light-active bg-destructive-light",
  }
  return {
    dot: "bg-primary",
    label: "text-muted-foreground",
    iconBg: "bg-muted",
    iconColor: "text-muted-foreground",
    panel: "border-border-subtle bg-muted",
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
      <span className={`text-xs font-medium ${labelClassName}`}>{label}</span>
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
    <div data-slot="agent-surface-actions" className="flex flex-wrap items-center justify-end gap-2">
      {actions.map((action, index) => (
        <Button
          key={`${action.event}-${index}`}
          type="button"
          size="sm"
          variant={action.variant ?? (index === 0 ? "default" : "outline")}
          onClick={() => onAction?.({ surfaceId, event: action.event, payload: action.payload })}
        >
          {action.label}
        </Button>
      ))}
    </div>
  )
}

function splitEvidence(item: string) {
  const separatorIndex = item.search(/[：:]/)
  if (separatorIndex < 0) return [null, item] as const

  const label = item.slice(0, separatorIndex).trim()
  const value = item.slice(separatorIndex + 1).trim()
  if (!label || !value) return [null, item] as const

  return [label, value] as const
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

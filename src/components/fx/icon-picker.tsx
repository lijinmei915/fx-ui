"use client"

import * as React from "react"

import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input, InputAffix, InputGroup } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Spinner } from "@/components/ui/spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  AlertCircleIcon,
  RefreshIcon,
  SearchIcon,
  ShuffleIcon,
  UploadIcon,
} from "@/lib/icons"
import { cn } from "@/lib/utils"

type IconPickerIcon = React.ComponentType<React.ComponentProps<"svg">>

type IconPickerOption = {
  id: string
  label: string
  icon: IconPickerIcon
  keywords?: string[]
  disabled?: boolean
}

type IconPickerProps = Omit<React.ComponentProps<"div">, "defaultValue" | "onChange"> & {
  icons: IconPickerOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string, option: IconPickerOption) => void
  query?: string
  defaultQuery?: string
  onQueryChange?: (query: string) => void
  allowUpload?: boolean
  defaultTab?: "library" | "upload"
  accept?: string
  onUpload?: (file: File) => void
  loading?: boolean
  error?: string
  onRetry?: () => void
  disabled?: boolean
  searchPlaceholder?: string
  emptyText?: string
  loadingText?: string
  randomLabel?: string
  libraryLabel?: string
  uploadLabel?: string
}

function IconPicker({
  className,
  icons,
  value,
  defaultValue,
  onValueChange,
  query: controlledQuery,
  defaultQuery = "",
  onQueryChange,
  allowUpload = false,
  defaultTab = "library",
  accept = "image/svg+xml,image/png,image/jpeg,image/webp",
  onUpload,
  loading = false,
  error,
  onRetry,
  disabled = false,
  searchPlaceholder = "搜索图标名称或 ID",
  emptyText = "暂无匹配内容",
  loadingText = "图标加载中",
  randomLabel = "随机分配",
  libraryLabel = "图标库选择",
  uploadLabel = "自定义上传",
  ...props
}: IconPickerProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
  const [uncontrolledQuery, setUncontrolledQuery] = React.useState(defaultQuery)
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [tab, setTab] = React.useState(allowUpload ? defaultTab : "library")
  const gridRef = React.useRef<HTMLDivElement>(null)
  const selectedValue = value ?? uncontrolledValue
  const query = controlledQuery ?? uncontrolledQuery

  const setQuery = (next: string) => {
    if (controlledQuery === undefined) setUncontrolledQuery(next)
    onQueryChange?.(next)
  }

  const filteredIcons = React.useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    if (!normalizedQuery) return icons
    return icons.filter((option) =>
      [option.id, option.label, ...(option.keywords ?? [])]
        .some((term) => term.toLocaleLowerCase().includes(normalizedQuery))
    )
  }, [icons, query])

  const enabledIcons = React.useMemo(
    () => filteredIcons.filter((option) => !option.disabled),
    [filteredIcons]
  )

  React.useEffect(() => {
    setActiveIndex(0)
  }, [query])

  React.useEffect(() => {
    if (!allowUpload && tab !== "library") setTab("library")
  }, [allowUpload, tab])

  React.useEffect(() => {
    setActiveIndex((current) => Math.min(current, Math.max(0, filteredIcons.length - 1)))
  }, [filteredIcons.length])

  const selectOption = (option?: IconPickerOption) => {
    if (!option || option.disabled || disabled) return
    if (value === undefined) setUncontrolledValue(option.id)
    onValueChange?.(option.id, option)
  }

  const focusItem = (index: number) => {
    setActiveIndex(index)
    requestAnimationFrame(() => {
      gridRef.current
        ?.querySelector<HTMLButtonElement>(`[data-icon-index="${index}"]`)
        ?.focus()
    })
  }

  const moveActive = (offset: number) => {
    if (!filteredIcons.length) return
    let next = activeIndex
    for (let attempt = 0; attempt < filteredIcons.length; attempt += 1) {
      next = (next + offset + filteredIcons.length) % filteredIcons.length
      if (!filteredIcons[next]?.disabled) {
        focusItem(next)
        return
      }
    }
  }

  const handleGridKeyDown = (event: React.KeyboardEvent) => {
    const columnCount = Math.max(
      1,
      Math.floor(((gridRef.current?.clientWidth ?? 32) + 4) / 36)
    )
    const offset = event.key === "ArrowRight" ? 1
      : event.key === "ArrowLeft" ? -1
      : event.key === "ArrowDown" ? columnCount
      : event.key === "ArrowUp" ? -columnCount
      : 0

    if (offset) {
      event.preventDefault()
      moveActive(offset)
    } else if (event.key === "Enter") {
      event.preventDefault()
      selectOption(filteredIcons[activeIndex])
    }
  }

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault()
      selectOption(enabledIcons[0])
    } else if (event.key.startsWith("Arrow")) {
      event.preventDefault()
      const firstEnabledIndex = filteredIcons.findIndex((option) => !option.disabled)
      if (firstEnabledIndex >= 0) focusItem(firstEnabledIndex)
    }
  }

  const libraryMode = loading
    ? "loading"
    : error
      ? "error"
      : filteredIcons.length === 0
        ? "search-empty"
        : query
          ? "search"
          : "select"

  return (
    <div
      data-slot="icon-picker"
      data-mode={tab === "upload" ? "upload" : libraryMode}
      data-disabled={disabled || undefined}
      className={cn(
        "flex h-[400px] w-full max-w-[500px] flex-col overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-l1",
        className
      )}
      {...props}
    >
      <Tabs value={tab} onValueChange={setTab} className="min-h-0 flex-1 gap-0">
        {allowUpload ? (
          <div className="border-b border-border-subtle px-2">
            <TabsList variant="line" size="sm" className="w-full">
              <TabsTrigger value="library">{libraryLabel}</TabsTrigger>
              <TabsTrigger value="upload">{uploadLabel}</TabsTrigger>
            </TabsList>
          </div>
        ) : null}

        <TabsContent value="library" className="min-h-0 flex-1 p-4">
          <div className="flex h-full min-h-0 flex-col gap-3">
            <div className="flex items-center gap-2">
              <InputGroup>
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder={searchPlaceholder}
                  disabled={disabled || loading}
                  aria-label={searchPlaceholder}
                />
                <InputAffix side="end">
                  <SearchIcon aria-hidden="true" />
                </InputAffix>
              </InputGroup>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      aria-label={randomLabel}
                      disabled={disabled || loading || enabledIcons.length === 0}
                      onClick={() => {
                        const option = enabledIcons[Math.floor(Math.random() * enabledIcons.length)]
                        selectOption(option)
                      }}
                    >
                      <ShuffleIcon aria-hidden="true" />
                    </Button>
                  }
                />
                <TooltipContent>{randomLabel}</TooltipContent>
              </Tooltip>
            </div>

            {loading ? (
              <div data-slot="icon-picker-loading" className="flex min-h-0 flex-1 items-center justify-center gap-2 text-body text-muted-foreground">
                <Spinner />
                <span>{loadingText}</span>
              </div>
            ) : error ? (
              <div data-slot="icon-picker-error" className="flex min-h-0 flex-1 items-center">
                <Alert variant="destructive">
                  <AlertCircleIcon aria-hidden="true" />
                  <AlertTitle>加载失败</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                  {onRetry ? (
                    <AlertAction>
                      <Button type="button" variant="plain" tone="danger" size="xs" onClick={onRetry}>
                        <RefreshIcon data-icon="inline-start" />
                        刷新
                      </Button>
                    </AlertAction>
                  ) : null}
                </Alert>
              </div>
            ) : filteredIcons.length === 0 ? (
              <Empty data-slot="icon-picker-empty">
                <EmptyHeader>
                  <EmptyMedia variant="icon"><SearchIcon /></EmptyMedia>
                  <EmptyTitle>{emptyText}</EmptyTitle>
                  <EmptyDescription>请尝试其他图标名称、ID 或关键词。</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <ScrollArea className="min-h-0 flex-1">
                <div
                  ref={gridRef}
                  data-slot="icon-picker-grid"
                  role="grid"
                  aria-label="图标列表"
                  className="grid grid-cols-[repeat(auto-fill,minmax(32px,1fr))] gap-1 pr-2"
                  onKeyDown={handleGridKeyDown}
                >
                  {filteredIcons.map((option, index) => {
                    const Icon = option.icon
                    return (
                      <Tooltip key={option.id}>
                        <TooltipTrigger
                          render={
                            <Button
                              type="button"
                              role="gridcell"
                              variant={selectedValue === option.id ? "outline" : "ghost"}
                              size="icon-md"
                              aria-label={option.label}
                              aria-pressed={selectedValue === option.id}
                              disabled={disabled || option.disabled}
                              data-icon-index={index}
                              data-icon-value={option.id}
                              tabIndex={index === activeIndex ? 0 : -1}
                              onFocus={() => setActiveIndex(index)}
                              onClick={() => selectOption(option)}
                            >
                              <Icon aria-hidden="true" />
                            </Button>
                          }
                        />
                        <TooltipContent>{option.label}</TooltipContent>
                      </Tooltip>
                    )
                  })}
                </div>
              </ScrollArea>
            )}
          </div>
        </TabsContent>

        {allowUpload ? (
          <TabsContent value="upload" className="min-h-0 flex-1 p-4">
            <Field data-disabled={disabled || undefined}>
              <FieldLabel htmlFor="icon-picker-upload">{uploadLabel}</FieldLabel>
              <InputGroup>
                <InputAffix side="start"><UploadIcon aria-hidden="true" /></InputAffix>
                <Input
                  id="icon-picker-upload"
                  type="file"
                  accept={accept}
                  disabled={disabled}
                  onChange={(event) => {
                    const file = event.currentTarget.files?.[0]
                    if (file) onUpload?.(file)
                    event.currentTarget.value = ""
                  }}
                />
              </InputGroup>
              <FieldDescription>支持 SVG、PNG、JPEG 或 WebP；上传后由业务侧保存并生成图标 ID。</FieldDescription>
            </Field>
          </TabsContent>
        ) : null}
      </Tabs>
    </div>
  )
}

export { IconPicker }
export type { IconPickerIcon, IconPickerOption, IconPickerProps }

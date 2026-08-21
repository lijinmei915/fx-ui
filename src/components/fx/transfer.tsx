"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Input, InputAffix, InputGroup } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Spinner } from "@/components/ui/spinner"
import { ArrowLeftIcon, ArrowRightIcon, SearchIcon } from "@/lib/icons"
import { cn } from "@/lib/utils"

type TransferKey = string | number

type TransferItem = {
  key: TransferKey
  title: string
  description?: string
  disabled?: boolean
}

type TransferDirection = "left" | "right"

type TransferProps = Omit<React.ComponentProps<"div">, "defaultValue" | "onChange"> & {
  dataSource: TransferItem[]
  targetKeys?: TransferKey[]
  defaultTargetKeys?: TransferKey[]
  selectedKeys?: [TransferKey[], TransferKey[]]
  defaultSelectedKeys?: [TransferKey[], TransferKey[]]
  onChange?: (targetKeys: TransferKey[], direction: TransferDirection, moveKeys: TransferKey[]) => void
  onSelectChange?: (sourceSelectedKeys: TransferKey[], targetSelectedKeys: TransferKey[]) => void
  onSearch?: (direction: TransferDirection, value: string) => void
  titles?: [React.ReactNode, React.ReactNode]
  showSearch?: boolean
  oneWay?: boolean
  disabled?: boolean
  loading?: boolean
  status?: "error" | "warning"
  searchPlaceholder?: string
  emptyText?: string
}

type TransferListProps = {
  direction: TransferDirection
  items: TransferItem[]
  selectedKeys: TransferKey[]
  title: React.ReactNode
  disabled: boolean
  loading: boolean
  showSearch: boolean
  searchPlaceholder: string
  emptyText: string
  query: string
  onQueryChange: (value: string) => void
  onToggleAll: () => void
  onToggleItem: (key: TransferKey) => void
}

function TransferList({
  direction,
  items,
  selectedKeys,
  title,
  disabled,
  loading,
  showSearch,
  searchPlaceholder,
  emptyText,
  query,
  onQueryChange,
  onToggleAll,
  onToggleItem,
}: TransferListProps) {
  const enabledItems = items.filter((item) => !item.disabled)
  const selectedSet = new Set(selectedKeys)
  const selectedCount = enabledItems.filter((item) => selectedSet.has(item.key)).length
  const allSelected = enabledItems.length > 0 && selectedCount === enabledItems.length

  return (
    <section
      data-slot="transfer-list"
      data-direction={direction}
      data-disabled={disabled || undefined}
      className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-lg border border-border bg-surface"
    >
      <header data-slot="transfer-list-header" className="flex h-10 shrink-0 items-center gap-2 border-b border-border-subtle px-3">
        <Checkbox
          checked={allSelected}
          indeterminate={selectedCount > 0 && !allSelected}
          disabled={disabled || loading || enabledItems.length === 0}
          aria-label={`全选${String(title)}`}
          onCheckedChange={onToggleAll}
        />
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">{title}</span>
        <span className="text-xs text-muted-foreground">{selectedCount}/{enabledItems.length}</span>
      </header>
      {showSearch ? (
        <div className="shrink-0 border-b border-border-subtle p-2">
          <InputGroup size="sm">
            <Input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              disabled={disabled || loading}
              placeholder={searchPlaceholder}
              aria-label={`${String(title)}搜索`}
            />
            <InputAffix side="end"><SearchIcon aria-hidden="true" /></InputAffix>
          </InputGroup>
        </div>
      ) : null}
      <ScrollArea className="min-h-0 flex-1">
        {loading ? (
          <div data-slot="transfer-loading" className="flex min-h-40 items-center justify-center gap-2 text-sm text-muted-foreground">
            <Spinner />
            <span>加载中</span>
          </div>
        ) : items.length === 0 ? (
          <Empty data-slot="transfer-empty" className="min-h-40 border-0 p-4">
            <EmptyHeader>
              <EmptyMedia variant="icon"><SearchIcon aria-hidden="true" /></EmptyMedia>
              <EmptyTitle>{emptyText}</EmptyTitle>
            </EmptyHeader>
          </Empty>
        ) : (
          <div role="listbox" aria-label={String(title)} data-slot="transfer-listbox" className="p-1">
            {items.map((item) => {
              const selected = selectedSet.has(item.key)
              return (
                <Button
                  key={String(item.key)}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  variant="ghost"
                  size="sm"
                  disabled={disabled || item.disabled}
                  data-slot="transfer-item"
                  data-key={String(item.key)}
                  className="h-auto w-full justify-start gap-2 rounded-md px-2 py-1.5 text-left data-[selected=true]:bg-accent"
                  data-selected={selected || undefined}
                  onClick={() => onToggleItem(item.key)}
                >
                  <Checkbox checked={selected} disabled={disabled || item.disabled} tabIndex={-1} className="pointer-events-none" aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-foreground">{item.title}</span>
                    {item.description ? <span className="block truncate text-xs text-muted-foreground">{item.description}</span> : null}
                  </span>
                </Button>
              )
            })}
          </div>
        )}
      </ScrollArea>
    </section>
  )
}

function Transfer({
  className,
  dataSource,
  targetKeys: controlledTargetKeys,
  defaultTargetKeys = [],
  selectedKeys: controlledSelectedKeys,
  defaultSelectedKeys = [[], []],
  onChange,
  onSelectChange,
  onSearch,
  titles = ["源列表", "目标列表"],
  showSearch = false,
  oneWay = false,
  disabled = false,
  loading = false,
  status,
  searchPlaceholder = "搜索",
  emptyText = "暂无数据",
  ...props
}: TransferProps) {
  const [uncontrolledTargetKeys, setUncontrolledTargetKeys] = React.useState(defaultTargetKeys)
  const [uncontrolledSelectedKeys, setUncontrolledSelectedKeys] = React.useState(defaultSelectedKeys)
  const [queries, setQueries] = React.useState<Record<TransferDirection, string>>({ left: "", right: "" })
  const targetKeys = controlledTargetKeys ?? uncontrolledTargetKeys
  const selectedKeys = controlledSelectedKeys ?? uncontrolledSelectedKeys
  const targetSet = new Set(targetKeys)

  const sourceItems = dataSource.filter((item) => !targetSet.has(item.key))
  const targetItems = targetKeys
    .map((key) => dataSource.find((item) => item.key === key))
    .filter((item): item is TransferItem => Boolean(item))
  const filterItems = (items: TransferItem[], direction: TransferDirection) => {
    const query = queries[direction].trim().toLocaleLowerCase()
    return query ? items.filter((item) => [item.title, item.description ?? "", String(item.key)].some((text) => text.toLocaleLowerCase().includes(query))) : items
  }
  const filteredSourceItems = filterItems(sourceItems, "left")
  const filteredTargetItems = filterItems(targetItems, "right")

  const setSelection = (next: [TransferKey[], TransferKey[]]) => {
    if (controlledSelectedKeys === undefined) setUncontrolledSelectedKeys(next)
    onSelectChange?.(next[0], next[1])
  }
  const setTargetKeys = (next: TransferKey[], direction: TransferDirection, moveKeys: TransferKey[]) => {
    if (controlledTargetKeys === undefined) setUncontrolledTargetKeys(next)
    onChange?.(next, direction, moveKeys)
  }
  const toggleItem = (direction: TransferDirection, key: TransferKey) => {
    if (disabled || loading) return
    const index = direction === "left" ? 0 : 1
    const current = selectedKeys[index]
    const next = current.includes(key) ? current.filter((value) => value !== key) : [...current, key]
    setSelection(index === 0 ? [next, selectedKeys[1]] : [selectedKeys[0], next])
  }
  const toggleAll = (direction: TransferDirection) => {
    if (disabled || loading) return
    const index = direction === "left" ? 0 : 1
    const items = direction === "left" ? filteredSourceItems : filteredTargetItems
    const keys = items.filter((item) => !item.disabled).map((item) => item.key)
    const everySelected = keys.length > 0 && keys.every((key) => selectedKeys[index].includes(key))
    const next = everySelected ? selectedKeys[index].filter((key) => !keys.includes(key)) : [...new Set([...selectedKeys[index], ...keys])]
    setSelection(index === 0 ? [next, selectedKeys[1]] : [selectedKeys[0], next])
  }
  const move = (direction: TransferDirection) => {
    if (disabled || loading) return
    const index = direction === "right" ? 0 : 1
    const movable = selectedKeys[index].filter((key) => !dataSource.find((item) => item.key === key)?.disabled)
    if (movable.length === 0) return
    const next = direction === "right"
      ? [...targetKeys, ...movable.filter((key) => !targetSet.has(key))]
      : targetKeys.filter((key) => !movable.includes(key))
    setTargetKeys(next, direction, movable)
    setSelection(direction === "right" ? [[], selectedKeys[1]] : [selectedKeys[0], []])
  }
  const setQuery = (direction: TransferDirection, value: string) => {
    setQueries((current) => ({ ...current, [direction]: value }))
    onSearch?.(direction, value)
  }

  return (
    <div
      data-slot="transfer"
      data-one-way={oneWay || undefined}
      data-disabled={disabled || undefined}
      data-loading={loading || undefined}
      data-status={status}
      aria-invalid={status === "error" || undefined}
      className={cn(
        "flex min-h-[260px] w-full min-w-0 items-stretch gap-3 data-[status=warning]:[&_[data-slot=transfer-list]]:border-warning data-[status=error]:[&_[data-slot=transfer-list]]:border-destructive",
        className,
      )}
      {...props}
    >
      <TransferList
        direction="left"
        items={filteredSourceItems}
        selectedKeys={selectedKeys[0]}
        title={titles[0]}
        disabled={disabled}
        loading={loading}
        showSearch={showSearch}
        searchPlaceholder={searchPlaceholder}
        emptyText={emptyText}
        query={queries.left}
        onQueryChange={(value) => setQuery("left", value)}
        onToggleAll={() => toggleAll("left")}
        onToggleItem={(key) => toggleItem("left", key)}
      />
      <div data-slot="transfer-actions" className="flex w-8 shrink-0 flex-col justify-center gap-2">
        <Button type="button" variant="outline" size="icon-sm" aria-label="移至目标列表" disabled={disabled || loading || selectedKeys[0].length === 0} onClick={() => move("right")}>
          <ArrowRightIcon aria-hidden="true" />
        </Button>
        {!oneWay ? (
          <Button type="button" variant="outline" size="icon-sm" aria-label="移回源列表" disabled={disabled || loading || selectedKeys[1].length === 0} onClick={() => move("left")}>
            <ArrowLeftIcon aria-hidden="true" />
          </Button>
        ) : null}
      </div>
      <TransferList
        direction="right"
        items={filteredTargetItems}
        selectedKeys={selectedKeys[1]}
        title={titles[1]}
        disabled={disabled}
        loading={loading}
        showSearch={showSearch}
        searchPlaceholder={searchPlaceholder}
        emptyText={emptyText}
        query={queries.right}
        onQueryChange={(value) => setQuery("right", value)}
        onToggleAll={() => toggleAll("right")}
        onToggleItem={(key) => toggleItem("right", key)}
      />
    </div>
  )
}

export { Transfer, type TransferDirection, type TransferItem, type TransferKey, type TransferProps }

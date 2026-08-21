"use client"

import * as React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BuildingIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
  SitemapIcon,
  StarFilledIcon,
  StarIcon,
  UserIcon,
} from "@/lib/icons"
import { cn } from "@/lib/utils"

type PeoplePickerSize = "normal" | "medium"
type PeoplePickerTab = "recent" | "people" | "departments" | "partners" | "groups"
type PeoplePickerItemType = "person" | "department" | "organization" | "partner" | "group"

type PeoplePickerItem = {
  id: string
  label: string
  type: PeoplePickerItemType
  subtitle?: string
  avatarUrl?: string
  initials?: string
  parentId?: string | null
  favorite?: boolean
  recent?: boolean
  keywords?: string
  letter?: string
  drillable?: boolean
  disabled?: boolean
}

type PeoplePickerProps = Omit<React.ComponentProps<"div">, "defaultValue" | "onChange"> & {
  items: PeoplePickerItem[]
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[], items: PeoplePickerItem[]) => void
  query?: string
  defaultQuery?: string
  onQueryChange?: (query: string) => void
  activeTab?: PeoplePickerTab
  defaultTab?: PeoplePickerTab
  onActiveTabChange?: (tab: PeoplePickerTab) => void
  size?: PeoplePickerSize
  disabled?: boolean
  includeDescendants?: boolean
  defaultIncludeDescendants?: boolean
  onIncludeDescendantsChange?: (checked: boolean) => void
  onFavoriteChange?: (item: PeoplePickerItem, favorite: boolean) => void
  onDrillDown?: (item: PeoplePickerItem) => void
  searchPlaceholder?: string
  emptyText?: string
}

const TAB_LABELS: Array<{ value: PeoplePickerTab; label: string }> = [
  { value: "recent", label: "最近" },
  { value: "people", label: "同事" },
  { value: "departments", label: "部门" },
  { value: "partners", label: "合伙人" },
  { value: "groups", label: "用户组" },
]

function itemMatchesTab(item: PeoplePickerItem, tab: PeoplePickerTab) {
  if (tab === "recent") return item.recent
  if (tab === "people") return item.type === "person"
  if (tab === "departments") return item.type === "department" || item.type === "organization"
  if (tab === "partners") return item.type === "partner"
  return item.type === "group"
}

function PeoplePicker({
  className,
  items,
  value,
  defaultValue = [],
  onValueChange,
  query: controlledQuery,
  defaultQuery = "",
  onQueryChange,
  activeTab: controlledTab,
  defaultTab = "recent",
  onActiveTabChange,
  size = "normal",
  disabled = false,
  includeDescendants: controlledIncludeDescendants,
  defaultIncludeDescendants = false,
  onIncludeDescendantsChange,
  onFavoriteChange,
  onDrillDown,
  searchPlaceholder = "搜索人员、部门或用户组",
  emptyText = "暂无匹配结果",
  ...props
}: PeoplePickerProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
  const [uncontrolledQuery, setUncontrolledQuery] = React.useState(defaultQuery)
  const [uncontrolledTab, setUncontrolledTab] = React.useState(defaultTab)
  const [uncontrolledIncludeDescendants, setUncontrolledIncludeDescendants] = React.useState(defaultIncludeDescendants)
  const [departmentPath, setDepartmentPath] = React.useState<string[]>([])
  const [favoriteOverrides, setFavoriteOverrides] = React.useState<Record<string, boolean>>({})

  const selectedIds = value ?? uncontrolledValue
  const query = controlledQuery ?? uncontrolledQuery
  const activeTab = controlledTab ?? uncontrolledTab
  const includeDescendants = controlledIncludeDescendants ?? uncontrolledIncludeDescendants
  const selectedItems = React.useMemo(
    () => items.filter((item) => selectedIds.includes(item.id)),
    [items, selectedIds]
  )
  const currentDepartmentId = departmentPath[departmentPath.length - 1] ?? null
  const currentDepartment = items.find((item) => item.id === currentDepartmentId)

  const visibleItems = React.useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    return items.filter((item) => {
      if (!itemMatchesTab(item, activeTab)) return false
      if (!normalizedQuery && activeTab === "departments" && (item.parentId ?? null) !== currentDepartmentId) return false
      if (!normalizedQuery) return true
      return [item.label, item.subtitle, item.keywords, item.letter]
        .filter(Boolean)
        .some((term) => term!.toLocaleLowerCase().includes(normalizedQuery))
    })
  }, [activeTab, currentDepartmentId, items, query])

  const setQuery = (next: string) => {
    if (controlledQuery === undefined) setUncontrolledQuery(next)
    onQueryChange?.(next)
  }

  const setActiveTab = (next: PeoplePickerTab) => {
    if (controlledTab === undefined) setUncontrolledTab(next)
    setDepartmentPath([])
    onActiveTabChange?.(next)
  }

  const commitValue = (nextItems: PeoplePickerItem[]) => {
    const nextIds = nextItems.map((item) => item.id)
    if (value === undefined) setUncontrolledValue(nextIds)
    onValueChange?.(nextIds, nextItems)
  }

  const selectableItems = visibleItems.filter((item) => !item.disabled)
  const selectedVisibleCount = selectableItems.filter((item) => selectedIds.includes(item.id)).length
  const allVisibleSelected = selectableItems.length > 0 && selectedVisibleCount === selectableItems.length

  const toggleAll = () => {
    if (disabled || selectableItems.length === 0) return
    const visibleIds = new Set(selectableItems.map((item) => item.id))
    const next = allVisibleSelected
      ? selectedItems.filter((item) => !visibleIds.has(item.id))
      : [...selectedItems, ...selectableItems.filter((item) => !selectedIds.includes(item.id))]
    commitValue(next)
  }

  const setIncludeDescendants = (next: boolean) => {
    if (controlledIncludeDescendants === undefined) setUncontrolledIncludeDescendants(next)
    onIncludeDescendantsChange?.(next)
  }

  return (
    <div
      data-slot="people-picker"
      data-size={size}
      data-tab={activeTab}
      data-disabled={disabled || undefined}
      className={cn(
        "flex h-[488px] flex-col overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-l1",
        size === "medium" ? "w-[618px]" : "w-[342px]",
        disabled && "text-foreground-disabled",
        className
      )}
      {...props}
    >
      <Combobox
        inline
        multiple
        items={visibleItems}
        filteredItems={visibleItems}
        value={selectedItems}
        inputValue={query}
        onInputValueChange={setQuery}
        onValueChange={commitValue}
        itemToStringLabel={(item: PeoplePickerItem) => item.label}
        isItemEqualToValue={(item: PeoplePickerItem, selected: PeoplePickerItem) => item.id === selected.id}
        disabled={disabled}
      >
        <div data-slot="people-picker-search" className="border-b border-border-subtle p-3">
          <ComboboxInput showTrigger={false} showClear className="w-full" placeholder={searchPlaceholder} aria-label={searchPlaceholder}>
            <SearchIcon aria-hidden="true" />
          </ComboboxInput>
        </div>

        <Tabs value={activeTab} onValueChange={(next) => setActiveTab(next as PeoplePickerTab)} className="min-h-0 flex-1 gap-0">
          <div className="border-b border-border-subtle px-2">
            <TabsList variant="line" size="sm" className="w-full">
              {TAB_LABELS.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value} disabled={disabled}>{tab.label}</TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div data-slot="people-picker-toolbar" className="flex h-10 shrink-0 items-center justify-between border-b border-border-subtle px-3 text-body">
            {currentDepartment ? (
              <Button type="button" variant="ghost" size="sm" onClick={() => setDepartmentPath((path) => path.slice(0, -1))}>
                <ChevronLeftIcon aria-hidden="true" />
                {currentDepartment.label}
              </Button>
            ) : (
              <span className="flex items-center gap-2">
                <Checkbox
                  checked={allVisibleSelected}
                  indeterminate={selectedVisibleCount > 0 && !allVisibleSelected}
                  onCheckedChange={toggleAll}
                  disabled={disabled || selectableItems.length === 0}
                  aria-label="全选当前列表"
                />
                <span>全选</span>
              </span>
            )}
            <span className="text-muted-foreground">已选 {selectedIds.length}</span>
          </div>

          <ScrollArea className="min-h-0 flex-1">
            <ComboboxList variant="panel">
              {(item: PeoplePickerItem) => {
                const selected = selectedIds.includes(item.id)
                const favorite = favoriteOverrides[item.id] ?? item.favorite ?? false
                const drillable = item.drillable || item.type === "department" || item.type === "organization"
                return (
                  <ComboboxItem key={item.id} value={item} density="list" indicator="none">
                    <Checkbox checked={selected} disabled={item.disabled} tabIndex={-1} className="pointer-events-none" aria-hidden="true" />
                    {item.type === "person" || item.type === "partner" ? (
                      <Avatar>
                        {item.avatarUrl ? <AvatarImage src={item.avatarUrl} alt="" /> : null}
                        <AvatarFallback colorful>{item.initials ?? item.label}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                        {item.type === "organization" ? <SitemapIcon aria-hidden="true" /> : item.type === "group" ? <UserIcon aria-hidden="true" /> : <BuildingIcon aria-hidden="true" />}
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate">{item.label}</span>
                      {item.subtitle ? <span className="block truncate text-xs text-muted-foreground">{item.subtitle}</span> : null}
                    </span>
                    {item.type === "person" ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        aria-label={favorite ? `取消收藏${item.label}` : `收藏${item.label}`}
                        onClick={(event) => {
                          event.preventDefault()
                          event.stopPropagation()
                          const next = !favorite
                          setFavoriteOverrides((current) => ({ ...current, [item.id]: next }))
                          onFavoriteChange?.(item, next)
                        }}
                      >
                        {favorite ? <StarFilledIcon aria-hidden="true" /> : <StarIcon aria-hidden="true" />}
                      </Button>
                    ) : null}
                    {drillable ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        aria-label={`进入${item.label}`}
                        onClick={(event) => {
                          event.preventDefault()
                          event.stopPropagation()
                          setDepartmentPath((path) => [...path, item.id])
                          onDrillDown?.(item)
                        }}
                      >
                        <ChevronRightIcon aria-hidden="true" />
                      </Button>
                    ) : null}
                  </ComboboxItem>
                )
              }}
            </ComboboxList>
            <ComboboxEmpty>{emptyText}</ComboboxEmpty>
          </ScrollArea>
        </Tabs>
      </Combobox>

      {activeTab === "departments" ? (
        <label data-slot="people-picker-footer" className="flex h-11 shrink-0 items-center gap-2 border-t border-border-subtle px-3 text-body">
          <Checkbox checked={includeDescendants} onCheckedChange={setIncludeDescendants} disabled={disabled} />
          包含子部门
        </label>
      ) : null}
    </div>
  )
}

export {
  PeoplePicker,
  type PeoplePickerItem,
  type PeoplePickerItemType,
  type PeoplePickerProps,
  type PeoplePickerSize,
  type PeoplePickerTab,
}

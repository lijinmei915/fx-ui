import * as React from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectMultiValue,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { MinusIcon, PlusIcon } from "@/lib/icons"
import { cn } from "@/lib/utils"

type ConditionValue = string | string[]

type ConditionOption = {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

type ConditionOperator = {
  value: string
  label: React.ReactNode
}

type ConditionField = {
  value: string
  label: React.ReactNode
  valueType?: "text" | "number" | "select" | "multi-select"
  operators: ConditionOperator[]
  options?: ConditionOption[]
  placeholder?: string
}

type ConditionRule = {
  id: string
  field: string
  operator: string
  value: ConditionValue
  exposed?: boolean
}

type ConditionGroup = {
  id: string
  rules: ConditionRule[]
}

type ConditionBuilderValue = {
  groups: ConditionGroup[]
}

type ConditionBuilderProps = {
  fields: ConditionField[]
  value?: ConditionBuilderValue
  defaultValue?: ConditionBuilderValue
  onValueChange?: (value: ConditionBuilderValue) => void
  disabled?: boolean
  readOnly?: boolean
  maxGroups?: number
  maxRulesPerGroup?: number
  fieldPlaceholder?: string
  operatorPlaceholder?: string
  valuePlaceholder?: string
  addConditionLabel?: string
  addGroupLabel?: string
  exposedLabel?: string
  emptyText?: string
  className?: string
}

function useControllableValue<T>({
  value,
  defaultValue,
  onValueChange,
}: {
  value?: T
  defaultValue: T
  onValueChange?: (value: T) => void
}) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const currentValue = value === undefined ? internalValue : value

  const setValue = React.useCallback((nextValue: T) => {
    if (value === undefined) setInternalValue(nextValue)
    onValueChange?.(nextValue)
  }, [onValueChange, value])

  return [currentValue, setValue] as const
}

function ConditionBuilder({
  fields,
  value,
  defaultValue = { groups: [] },
  onValueChange,
  disabled = false,
  readOnly = false,
  maxGroups,
  maxRulesPerGroup,
  fieldPlaceholder = "选择字段",
  operatorPlaceholder = "选择条件",
  valuePlaceholder = "请选择或输入",
  addConditionLabel = "添加条件",
  addGroupLabel = "添加条件组",
  exposedLabel = "外露",
  emptyText = "暂无条件",
  className,
}: ConditionBuilderProps) {
  const [currentValue, setCurrentValue] = useControllableValue({ value, defaultValue, onValueChange })
  const nextIdRef = React.useRef(0)
  const interactionDisabled = disabled || readOnly

  const createId = React.useCallback((prefix: "group" | "rule") => {
    nextIdRef.current += 1
    return `${prefix}-${Date.now()}-${nextIdRef.current}`
  }, [])

  const createRule = React.useCallback((): ConditionRule => {
    const field = fields[0]
    return {
      id: createId("rule"),
      field: field?.value ?? "",
      operator: field?.operators[0]?.value ?? "",
      value: field?.valueType === "multi-select" ? [] : "",
      exposed: false,
    }
  }, [createId, fields])

  const updateGroups = (groups: ConditionGroup[]) => setCurrentValue({ groups })

  const updateRule = (groupId: string, ruleId: string, update: (rule: ConditionRule) => ConditionRule) => {
    updateGroups(currentValue.groups.map((group) => group.id === groupId
      ? { ...group, rules: group.rules.map((rule) => rule.id === ruleId ? update(rule) : rule) }
      : group))
  }

  const addRule = (groupId?: string) => {
    if (!fields.length) return
    if (!groupId) {
      const group: ConditionGroup = { id: createId("group"), rules: [createRule()] }
      updateGroups([...currentValue.groups, group])
      return
    }
    updateGroups(currentValue.groups.map((group) => group.id === groupId
      ? { ...group, rules: [...group.rules, createRule()] }
      : group))
  }

  const removeRule = (groupId: string, ruleId: string) => {
    const groups = currentValue.groups.flatMap((group) => {
      if (group.id !== groupId) return [group]
      const rules = group.rules.filter((rule) => rule.id !== ruleId)
      return rules.length ? [{ ...group, rules }] : []
    })
    updateGroups(groups)
  }

  const removeGroup = (groupId: string) => {
    updateGroups(currentValue.groups.filter((group) => group.id !== groupId))
  }

  const canAddGroup = !maxGroups || currentValue.groups.length < maxGroups

  return (
    <div
      data-slot="condition-builder"
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      className={cn("flex w-full flex-col gap-4 text-sm text-foreground", className)}
    >
      {currentValue.groups.length ? currentValue.groups.map((group, groupIndex) => {
        const canAddRule = !maxRulesPerGroup || group.rules.length < maxRulesPerGroup
        return (
          <React.Fragment key={group.id}>
            {groupIndex > 0 ? (
              <div data-slot="condition-builder-or" className="flex items-center gap-3 text-xs text-muted-foreground">
                <Separator className="flex-1" />
                <span>或 (or)</span>
                <Separator className="flex-1" />
              </div>
            ) : null}
            <section data-slot="condition-group" className="relative flex min-w-0 gap-2" aria-label={`条件组 ${groupIndex + 1}`}>
              <div className="flex w-6 shrink-0 flex-col items-center">
                <span className="mt-1.5 text-xs text-muted-foreground">且</span>
                <span aria-hidden="true" className="mt-1 min-h-4 w-px flex-1 bg-border" />
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                {group.rules.map((rule) => {
                  const field = fields.find((item) => item.value === rule.field)
                  const options = field?.options ?? []
                  const valueType = field?.valueType ?? "text"
                  return (
                    <div key={rule.id} data-slot="condition-rule" className="flex min-w-0 flex-wrap items-center gap-1">
                      <Select value={rule.field || null} onValueChange={(nextField) => {
                        const selectedField = fields.find((item) => item.value === nextField)
                        updateRule(group.id, rule.id, (current) => ({
                          ...current,
                          field: nextField ?? "",
                          operator: selectedField?.operators[0]?.value ?? "",
                          value: selectedField?.valueType === "multi-select" ? [] : "",
                        }))
                      }} disabled={interactionDisabled}>
                        <SelectTrigger size="sm" className="w-36" aria-label="字段">
                          <SelectValue>{field?.label ?? fieldPlaceholder}</SelectValue>
                        </SelectTrigger>
                        <SelectContent align="start">
                          {fields.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}
                        </SelectContent>
                      </Select>

                      <Select value={rule.operator || null} onValueChange={(operator) => updateRule(group.id, rule.id, (current) => ({ ...current, operator: operator ?? "" }))} disabled={interactionDisabled || !field}>
                        <SelectTrigger size="sm" className="w-28" aria-label="操作符">
                          <SelectValue>{field?.operators.find((item) => item.value === rule.operator)?.label ?? operatorPlaceholder}</SelectValue>
                        </SelectTrigger>
                        <SelectContent align="start">
                          {field?.operators.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}
                        </SelectContent>
                      </Select>

                      {valueType === "select" ? (
                        <Select value={typeof rule.value === "string" && rule.value ? rule.value : null} onValueChange={(nextValue) => updateRule(group.id, rule.id, (current) => ({ ...current, value: nextValue ?? "" }))} disabled={interactionDisabled}>
                          <SelectTrigger size="sm" className="min-w-44 flex-1" aria-label="条件值">
                            <SelectValue>{options.find((item) => item.value === rule.value)?.label ?? field?.placeholder ?? valuePlaceholder}</SelectValue>
                          </SelectTrigger>
                          <SelectContent align="start">
                            {options.map((item) => <SelectItem key={item.value} value={item.value} disabled={item.disabled}>{item.label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      ) : valueType === "multi-select" ? (
                        <Select multiple value={Array.isArray(rule.value) ? rule.value : []} onValueChange={(nextValue) => updateRule(group.id, rule.id, (current) => ({ ...current, value: nextValue }))} disabled={interactionDisabled}>
                          <SelectTrigger size="sm" className="min-w-56 flex-1" aria-label="条件值">
                            <SelectValue>
                              {(selected: string[]) => selected.length ? (
                                <SelectMultiValue
                                  items={selected.map((item) => options.find((option) => option.value === item) ?? { value: item, label: item })}
                                  maxVisible={2}
                                  onRemove={interactionDisabled ? undefined : (item) => updateRule(group.id, rule.id, (current) => ({ ...current, value: selected.filter((valueItem) => valueItem !== item) }))}
                                />
                              ) : field?.placeholder ?? valuePlaceholder}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent align="start">
                            {options.map((item) => <SelectItem key={item.value} value={item.value} disabled={item.disabled}><SelectItemIndicator />{item.label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          type={valueType === "number" ? "number" : "text"}
                          size="sm"
                          className="min-w-44 flex-1"
                          value={typeof rule.value === "string" ? rule.value : ""}
                          placeholder={field?.placeholder ?? valuePlaceholder}
                          disabled={disabled}
                          readOnly={readOnly}
                          aria-label="条件值"
                          onChange={(event) => updateRule(group.id, rule.id, (current) => ({ ...current, value: event.target.value }))}
                        />
                      )}

                      <Button type="button" variant="plain" size="icon-sm" aria-label="删除条件" disabled={interactionDisabled} onClick={() => removeRule(group.id, rule.id)}>
                        <MinusIcon aria-hidden="true" />
                      </Button>
                      <label className="flex h-7 cursor-pointer items-center gap-1.5 whitespace-nowrap text-xs text-muted-foreground has-data-disabled:cursor-not-allowed">
                        <Checkbox size="sm" checked={Boolean(rule.exposed)} disabled={interactionDisabled} onCheckedChange={(checked) => updateRule(group.id, rule.id, (current) => ({ ...current, exposed: checked }))} />
                        {exposedLabel}
                      </label>
                    </div>
                  )
                })}
                <div data-slot="condition-group-actions" className="flex items-center gap-3">
                  <Button type="button" variant="plain" tone="info" size="sm" disabled={interactionDisabled || !canAddRule || !fields.length} onClick={() => addRule(group.id)}>
                    <PlusIcon data-icon="inline-start" aria-hidden="true" />
                    {addConditionLabel}
                  </Button>
                  {currentValue.groups.length > 1 ? (
                    <Button type="button" variant="plain" tone="danger" size="sm" disabled={interactionDisabled} onClick={() => removeGroup(group.id)}>删除条件组</Button>
                  ) : null}
                </div>
              </div>
            </section>
          </React.Fragment>
        )
      }) : (
        <div data-slot="condition-builder-empty" className="py-3 text-center text-sm text-muted-foreground">{emptyText}</div>
      )}

      <div data-slot="condition-builder-actions" className="flex items-center gap-3">
        {currentValue.groups.length === 0 ? (
          <Button type="button" variant="plain" tone="info" size="sm" disabled={interactionDisabled || !canAddGroup || !fields.length} onClick={() => addRule()}>
            <PlusIcon data-icon="inline-start" aria-hidden="true" />
            {addConditionLabel}
          </Button>
        ) : null}
        {currentValue.groups.length > 0 ? (
          <Button type="button" variant="plain" tone="info" size="sm" disabled={interactionDisabled || !canAddGroup || !fields.length} onClick={() => addRule()}>
            <PlusIcon data-icon="inline-start" aria-hidden="true" />
            {addGroupLabel}
          </Button>
        ) : null}
      </div>
    </div>
  )
}

export {
  ConditionBuilder,
  type ConditionBuilderProps,
  type ConditionBuilderValue,
  type ConditionField,
  type ConditionGroup,
  type ConditionOperator,
  type ConditionOption,
  type ConditionRule,
  type ConditionValue,
}

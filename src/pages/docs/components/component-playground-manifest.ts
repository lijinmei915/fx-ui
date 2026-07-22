import type {
  ComponentPlaygroundPropDef,
  ComponentPlaygroundStory,
  ComponentPlaygroundValues,
} from "@/components/fx/component-playground"

export type ComponentPlaygroundManifestProp = {
  key: string
  zh: string
  en: string
  propName: string
  type: "segment"
  options: {
    value: string
    label: string
    labelEn?: string
    title?: string
    titleEn?: string
    intent?: string
    intentEn?: string
    constraint?: string
    constraintEn?: string
    hiddenWhen?: Record<string, string | string[]>
  }[]
  hasAll?: boolean
  owner?: string | string[]
  group?: "props" | "tokens"
  controlGroup?: "content" | "appearance" | "behavior" | "structure" | "semantics"
  defaultVisible?: boolean
  defaultOrder?: number
  disabledWhen?: Record<string, string | string[]>
  hiddenWhen?: Record<string, string | string[]>
} | {
  key: string
  zh: string
  en: string
  propName: string
  type: "text"
  bilingual?: boolean
  owner?: string | string[]
  group?: "props" | "tokens"
  controlGroup?: "content" | "appearance" | "behavior" | "structure" | "semantics"
  defaultVisible?: boolean
  defaultOrder?: number
  disabledWhen?: Record<string, string | string[]>
  hiddenWhen?: Record<string, string | string[]>
}

export type ComponentPlaygroundManifestComponent = {
  componentName: string
  source: string
  playgroundComponent: string
  initial: Record<string, string>
  guidanceKey?: string
  storyPresentation?: "presets" | "examples"
  workbench?: {
    inspectSlot: string
    nodes: {
      key: string
      zh: string
      en: string
      component: string
      kind?: "component" | "tokens" | "states"
      hiddenWhen?: Record<string, string | string[]>
    }[]
    stateAssignments?: {
      key: string
      zh: string
      en: string
      propertyZh: string
      propertyEn: string
      token: string
      cssVar: string
      preview: { key: string; value: string }
    }[]
    checks: { key: string; zh: string; en: string }[]
  }
  stories?: ComponentPlaygroundManifestStory[]
  visual?: {
    route: string
    selector: string
    screenshot?: string
  }
  visualTests?: string[]
  props: ComponentPlaygroundManifestProp[]
}

export type ComponentPlaygroundManifestVisual = {
  route: string
  selector: string
  test: string
}

export type ComponentPlaygroundManifestStory = {
  id: string
  name: string
  nameEn: string
  args: Record<string, string>
  parameters: {
    intent: string
    intentEn: string
    constraint?: string
    constraintEn?: string
    source?: string
  }
}

export type ComponentPlaygroundAutoStory = ComponentPlaygroundManifestStory & {
  group?: string
  spec?: string
  parameters: Omit<ComponentPlaygroundManifestStory["parameters"], "constraint" | "constraintEn"> & {
    constraint: string
    constraintEn: string
    code: string
  }
}

export type ComponentPlaygroundsManifest = {
  schemaVersion: 2
  storyFormat: "storybook-lite"
  format: string
  updatedAt: string
  truthSource: string
  humanDoc: string
  note: string
  autoScenarioComponents?: string[]
  autoStories?: Record<string, ComponentPlaygroundAutoStory[]>
  autoVisuals?: Record<string, ComponentPlaygroundManifestVisual>
  pageVisuals?: Record<string, ComponentPlaygroundManifestVisual>
  baselineVisuals?: Record<string, ComponentPlaygroundManifestVisual>
  customPlaygrounds?: Record<string, ComponentPlaygroundManifestComponent & { customConfigSource?: string; mode?: string; visualTests?: string[] }>
  components: {
    [key: string]: ComponentPlaygroundManifestComponent
    icon: ComponentPlaygroundManifestComponent
    buttonGroup: ComponentPlaygroundManifestComponent
  }
}

export function componentPlaygroundCondition(condition?: Record<string, string | string[]>) {
  return condition
    ? (values: ComponentPlaygroundValues) => Object.entries(condition).every(([key, value]) =>
      Array.isArray(value) ? value.includes(values[key]) : values[key] === value)
    : undefined
}

export function componentPlaygroundPropsFromManifest(
  component: ComponentPlaygroundManifestComponent,
): ComponentPlaygroundPropDef[] {
  return component.props.map((prop) => {
    const disabledWhen = componentPlaygroundCondition(prop.disabledWhen)
    const hiddenWhen = componentPlaygroundCondition(prop.hiddenWhen)

    if (prop.type === "segment") {
      return {
        ...prop,
        options: prop.options.map((option) => ({
          ...option,
          hiddenWhen: componentPlaygroundCondition(option.hiddenWhen),
        })),
        disabledWhen,
        hiddenWhen,
      }
    }

    return { ...prop, disabledWhen, hiddenWhen }
  })
}

export function componentPlaygroundStoriesFromManifest(
  component: ComponentPlaygroundManifestComponent,
): ComponentPlaygroundStory[] {
  return (component.stories ?? []).map((story) => ({
    id: story.id,
    title: story.name,
    titleEn: story.nameEn,
    intent: story.parameters.intent,
    intentEn: story.parameters.intentEn,
    constraint: story.parameters.constraint,
    constraintEn: story.parameters.constraintEn,
    values: story.args,
  }))
}

export function standardScenarioExamplesFromManifest(
  manifest: ComponentPlaygroundsManifest,
  slug: string,
) {
  return (manifest.autoStories?.[slug] ?? []).map((story) => ({
    id: story.id,
    title: story.name,
    titleEn: story.nameEn,
    intent: story.parameters.intent,
    intentEn: story.parameters.intentEn,
    rule: story.parameters.constraint,
    ruleEn: story.parameters.constraintEn,
    code: story.parameters.code,
    group: story.group,
    spec: story.spec,
  }))
}

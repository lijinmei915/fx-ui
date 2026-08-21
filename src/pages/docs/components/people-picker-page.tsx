import { PeoplePicker, type PeoplePickerItem, type PeoplePickerTab } from "@/components/fx/people-picker"
import { ComponentPlayground, type ComponentPlaygroundConfig } from "@/components/fx/component-playground"
import { componentPlaygroundPropsFromManifest, type ComponentPlaygroundsManifest } from "@/pages/docs/components/component-playground-manifest"
import { StandardDocPage, type StandardDocLang } from "@/pages/docs/components/standard-doc-page"
import componentPlaygroundsManifestRaw from "../../../../docs/data/component-playgrounds.manifest.json?raw"

const manifest = JSON.parse(componentPlaygroundsManifestRaw) as ComponentPlaygroundsManifest
const peoplePickerManifest = manifest.customPlaygrounds!.peoplePicker

export const peoplePickerItems: PeoplePickerItem[] = [
  { id: "org", label: "飞书科技有限公司", type: "organization", parentId: null, drillable: true, recent: true, keywords: "公司 根组织" },
  { id: "product", label: "产品与设计中心", type: "department", parentId: null, drillable: true, recent: true, keywords: "产品 设计" },
  { id: "rd", label: "研发中心", type: "department", parentId: null, drillable: true, keywords: "研发 技术" },
  { id: "design", label: "体验设计部", type: "department", parentId: "product", drillable: true, keywords: "UX UI" },
  { id: "pm", label: "产品管理部", type: "department", parentId: "product", keywords: "产品经理" },
  { id: "alice", label: "林晓曦", type: "person", subtitle: "产品设计师", avatarUrl: "/assets/people-picker/avatar-01.jpeg", recent: true, favorite: true, letter: "L" },
  { id: "bob", label: "陈嘉明", type: "person", subtitle: "前端工程师", avatarUrl: "/assets/people-picker/avatar-02.png", recent: true, letter: "C" },
  { id: "carol", label: "周雨晴", type: "person", subtitle: "产品经理", avatarUrl: "/assets/people-picker/avatar-03.png", recent: true, letter: "Z" },
  { id: "david", label: "王一鸣", type: "person", subtitle: "研发负责人", avatarUrl: "/assets/people-picker/avatar-04.png", letter: "W" },
  { id: "partner", label: "云杉咨询", type: "partner", subtitle: "外部合伙人", avatarUrl: "/assets/people-picker/avatar-05.jpeg", recent: true },
  { id: "group", label: "项目核心成员", type: "group", subtitle: "12 人", recent: true },
]

function renderPeoplePicker(values: Record<string, string>) {
  return (
    <PeoplePicker
      key={JSON.stringify(values)}
      items={peoplePickerItems}
      defaultValue={["alice"]}
      defaultTab={(values.scene ?? "recent") as PeoplePickerTab}
      size={values.size === "medium" ? "medium" : "normal"}
      defaultIncludeDescendants={values.includeDescendants === "true"}
    />
  )
}

export const peoplePickerPlaygroundConfig: ComponentPlaygroundConfig = {
  storySource: "docs/data/component-playgrounds.manifest.json#customPlaygrounds.peoplePicker",
  props: componentPlaygroundPropsFromManifest(peoplePickerManifest),
  initial: peoplePickerManifest.initial,
  guidanceKey: peoplePickerManifest.guidanceKey,
  previewItemsClassName: "w-full overflow-auto",
  renderOne: renderPeoplePicker,
  genCode: (values) => `import { PeoplePicker } from "@/components/fx/people-picker"\n\n<PeoplePicker items={items} defaultTab="${values.scene ?? "recent"}" size="${values.size ?? "normal"}" />`,
}

export const peoplePickerAnchors = [
  { label: "调试台", labelEn: "Playground", href: "#people-picker-playground" },
  { label: "API", href: "#people-picker-props" },
  { label: "语义 DOM", labelEn: "Semantic DOM", href: "#people-picker-semantic-dom" },
  { label: "正误示例", labelEn: "Do / Don’t", href: "#people-picker-do-dont" },
]

const propRows = [
  { prop: "items", type: "PeoplePickerItem[]", defaultValue: "—", desc: "人员、部门、组织、合伙人与用户组数据。" },
  { prop: "value / defaultValue", type: "string[]", defaultValue: "[]", desc: "受控或非受控的已选 ID。" },
  { prop: "onValueChange", type: "(ids, items) => void", defaultValue: "—", desc: "选择、取消或全选后的回调。" },
  { prop: "query / defaultQuery", type: "string", defaultValue: '""', desc: "实时搜索人员与组织数据。" },
  { prop: "activeTab / defaultTab", type: "PeoplePickerTab", defaultValue: "recent", desc: "最近、同事、部门、合伙人或用户组。" },
  { prop: "size", type: "normal | medium", defaultValue: "normal", desc: "342px 或 618px 面板宽度，高度均为 488px。" },
  { prop: "includeDescendants", type: "boolean", defaultValue: "false", desc: "部门选择是否包含子部门。" },
  { prop: "onFavoriteChange / onDrillDown", type: "callbacks", defaultValue: "—", desc: "收藏人员与组织下钻回调。" },
  { prop: "disabled", type: "boolean", defaultValue: "false", desc: "禁用全部选择和编辑操作。" },
]

const semanticDomRows = [
  { part: 'data-slot="people-picker"', desc: "根节点；data-size 与 data-tab 反映公开状态。" },
  { part: 'data-slot="people-picker-search"', desc: "Combobox 搜索输入区。" },
  { part: 'data-slot="people-picker-toolbar"', desc: "全选、下钻返回与已选计数。" },
  { part: 'data-slot="people-picker-footer"', desc: "部门场景的包含子部门控制。" },
]

const doDontRows = [
  { do: "由 items、query、activeTab 和 value 驱动实时状态。", dont: "为悬浮、选中或下钻截图新增视觉 mode。" },
  { do: "人员头像使用真实资源或 AvatarFallback。", dont: "用手写圆形和硬编码颜色模拟头像。" },
  { do: "使用 onDrillDown 接入业务组织树加载。", dont: "把远程组织接口和权限逻辑塞进组件。" },
]

export function PeoplePickerPage({ actions, lang }: { actions: React.ReactNode; lang: StandardDocLang }) {
  return (
    <StandardDocPage
      slug="people-picker"
      title="PeoplePicker 选人下拉菜单"
      lead="按最近、同事、部门、合伙人与用户组检索和多选，支持组织下钻、收藏与包含子部门。"
      playground={<ComponentPlayground config={peoplePickerPlaygroundConfig} lang={lang} />}
      hideOverview
      hideScenarioExamples
      hideUsage
      overview={null}
      scenarioExamples={[]}
      renderScenarioPreview={() => null}
      importCode={'import { PeoplePicker } from "@/components/fx/people-picker"'}
      usageCode={'<PeoplePicker items={items} value={ids} onValueChange={setIds} />'}
      propRows={propRows}
      semanticDomRows={semanticDomRows}
      doDontRows={doDontRows}
      actions={actions}
      lang={lang}
    />
  )
}

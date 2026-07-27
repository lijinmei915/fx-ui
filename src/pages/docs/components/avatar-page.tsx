import type { ReactNode } from "react"

import { Avatar, AvatarBadge, AvatarComposite, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage, avatarInitials } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ComponentPlayground } from "@/components/fx/component-playground"
import componentPlaygroundsManifestRaw from "../../../../docs/data/component-playgrounds.manifest.json?raw"
import { componentPlaygroundPropsFromManifest, componentPlaygroundStoriesFromManifest, type ComponentPlaygroundsManifest } from "@/pages/docs/components/component-playground-manifest"
import { StandardDocPage, type StandardDocLang } from "@/pages/docs/components/standard-doc-page"
import { UserFilledIcon } from "@/lib/icons"

export const avatarAnchors = [
  { label: "调试台", labelEn: "Playground", href: "#avatar-playground" },
  { label: "API", href: "#avatar-props" },
  { label: "语义 DOM", href: "#avatar-semantic-dom" },
  { label: "正误示例", href: "#avatar-do-dont" },
]

const componentPlaygroundsManifest = JSON.parse(componentPlaygroundsManifestRaw) as ComponentPlaygroundsManifest
const avatarManifest = componentPlaygroundsManifest.components.avatar

type AvatarPlaygroundQuantity = "single" | "group" | "chat"
type AvatarPlaygroundShape = "circle" | "square"
type AvatarPlaygroundStyle = "image" | "text" | "icon"
type AvatarPlaygroundColor = "neutral" | "colorful"
type AvatarPlaygroundSize = "xs" | "sm" | "default" | "lg" | "xl"
type AvatarCompositeSize = "default" | "lg" | "xl"
type AvatarPlaygroundStatus = "none" | "online" | "away" | "busy" | "offline"
type AvatarPlaygroundCount = "2" | "3" | "4"

const avatarPlaygroundMembers = ["陈昊", "林舟", "苏婷", "周也", "王五", "赵六"]
const avatarGroupVisibleCount = 3

function renderAvatarStatus(status: AvatarPlaygroundStatus) {
  return status === "none" ? null : <AvatarBadge status={status} />
}

function renderAvatarPlayground(values: Record<string, string>) {
  const quantity = values.quantity as AvatarPlaygroundQuantity
  const shape = values.shape as AvatarPlaygroundShape
  const style = values.style as AvatarPlaygroundStyle
  const color = values.color as AvatarPlaygroundColor
  const size = values.size as AvatarPlaygroundSize
  const status = values.status as AvatarPlaygroundStatus
  const count = values.count as AvatarPlaygroundCount
  const colorful = color === "colorful"

  if (quantity === "chat") {
    return (
      <AvatarComposite max={Number(count) as 2 | 3 | 4} size={size as AvatarCompositeSize}>
        {avatarPlaygroundMembers.map((name, index) => (
          <Avatar key={name}>
            {style === "image" ? <AvatarImage src={`/avatars/0${index + 1}.jpg`} alt={name} /> : null}
            <AvatarFallback colorful={colorful}>{style === "icon" ? <UserFilledIcon /> : avatarInitials(name)}</AvatarFallback>
          </Avatar>
        ))}
      </AvatarComposite>
    )
  }

  if (quantity === "group") {
    const visibleMembers = avatarPlaygroundMembers.slice(0, avatarGroupVisibleCount)
    const restMembers = avatarPlaygroundMembers.slice(avatarGroupVisibleCount)
    return (
      <TooltipProvider>
        <AvatarGroup>
          {visibleMembers.map((name, index) => (
            <Avatar key={name} size={size}>
              {style === "image" ? <AvatarImage src={`/avatars/0${index + 1}.jpg`} alt={name} /> : null}
              <AvatarFallback colorful={colorful}>{style === "icon" ? <UserFilledIcon /> : avatarInitials(name)}</AvatarFallback>
            </Avatar>
          ))}
          {restMembers.length > 0 ? (
            <Tooltip>
              <TooltipTrigger render={<AvatarGroupCount render={<button type="button" />} aria-label={`剩余成员：${restMembers.join("、")}`}>+{restMembers.length}</AvatarGroupCount>} />
              <TooltipContent>{restMembers.join("、")}</TooltipContent>
            </Tooltip>
          ) : null}
        </AvatarGroup>
      </TooltipProvider>
    )
  }

  const content = style === "icon" ? <UserFilledIcon /> : avatarInitials("陈昊")
  return (
    <Avatar size={size} shape={shape}>
      {style === "image" ? <AvatarImage src="/avatars/01.jpg" alt="陈昊" /> : null}
      <AvatarFallback colorful={colorful}>{content}</AvatarFallback>
      {renderAvatarStatus(status)}
    </Avatar>
  )
}

function genAvatarPlaygroundCode(values: Record<string, string>) {
  const quantity = values.quantity as AvatarPlaygroundQuantity
  const shape = values.shape as AvatarPlaygroundShape
  const style = values.style as AvatarPlaygroundStyle
  const color = values.color as AvatarPlaygroundColor
  const size = values.size as AvatarPlaygroundSize
  const status = values.status as AvatarPlaygroundStatus
  const count = values.count as AvatarPlaygroundCount
  const sizeAttr = size === "default" ? "" : ` size="${size}"`
  const shapeAttr = shape === "circle" ? "" : ` shape="${shape}"`
  const colorAttr = color === "colorful" ? " colorful" : ""
  const imageLine = style === "image" ? `\n  <AvatarImage src="/avatars/01.jpg" alt="陈昊" />` : ""
  const fallbackContent = style === "icon" ? "\n    <UserFilledIcon />\n  " : "陈"
  const statusLine = status === "none" ? "" : `\n  <AvatarBadge status="${status}" />`

  if (quantity === "chat") {
    const imageLineForMember = style === "image" ? `\n      <AvatarImage src={member.avatar} alt={member.name} />` : ""
    const fallbackForMember = style === "icon" ? "\n        <UserFilledIcon />\n      " : "{avatarInitials(member.name)}"
    const iconImport = style === "icon" ? `\nimport { UserFilledIcon } from "@/lib/icons"` : ""
    return `import { Avatar, AvatarComposite, AvatarFallback, AvatarImage, avatarInitials } from "@/components/ui/avatar"${iconImport}

<AvatarComposite max={${count}}${sizeAttr}>
  {members.map((member) => (
    <Avatar key={member.name}>${imageLineForMember}
      <AvatarFallback${colorAttr}>${fallbackForMember}</AvatarFallback>
    </Avatar>
  ))}
</AvatarComposite>`
  }

  if (quantity === "group") {
    const imageLineForMember = style === "image" ? `\n      <AvatarImage src={member.avatar} alt={member.name} />` : ""
    const fallbackForMember = style === "icon" ? "\n        <UserFilledIcon />\n      " : "{avatarInitials(member.name)}"
    const iconImport = style === "icon" ? `\nimport { UserFilledIcon } from "@/lib/icons"` : ""
    return `import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage, avatarInitials } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"${iconImport}

const visibleMembers = members.slice(0, 3)
const restMembers = members.slice(3)

<TooltipProvider>
  <AvatarGroup>
    {visibleMembers.map((member) => (
      <Avatar key={member.name}${sizeAttr}>${imageLineForMember}
        <AvatarFallback${colorAttr}>${fallbackForMember}</AvatarFallback>
      </Avatar>
    ))}
    {restMembers.length > 0 ? (
      <Tooltip>
        <TooltipTrigger render={<AvatarGroupCount render={<button type="button" />} aria-label={\`剩余成员：\${restMembers.map((member) => member.name).join("、")}\`}>+{restMembers.length}</AvatarGroupCount>} />
        <TooltipContent>{restMembers.map((member) => member.name).join("、")}</TooltipContent>
      </Tooltip>
    ) : null}
  </AvatarGroup>
</TooltipProvider>`
  }

  if (style === "icon") {
    return `import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserFilledIcon } from "@/lib/icons"

<Avatar${sizeAttr}${shapeAttr}>${imageLine}
  <AvatarFallback${colorAttr}>${fallbackContent}</AvatarFallback>${statusLine}
</Avatar>`
  }

  return `import { Avatar, AvatarBadge, AvatarFallback, AvatarImage, avatarInitials } from "@/components/ui/avatar"

<Avatar${sizeAttr}${shapeAttr}>${imageLine}
  <AvatarFallback${colorAttr}>{avatarInitials("陈昊")}</AvatarFallback>${statusLine}
</Avatar>`
}

const avatarPlaygroundConfig = {
  storySource: "docs/data/component-playgrounds.manifest.json#components.avatar",
  props: componentPlaygroundPropsFromManifest(avatarManifest),
  stories: componentPlaygroundStoriesFromManifest(avatarManifest),
  storyPresentation: avatarManifest.storyPresentation,
  initial: avatarManifest.initial,
  guidanceKey: avatarManifest.guidanceKey,
  renderOne: renderAvatarPlayground,
  genCode: genAvatarPlaygroundCode,
}

const avatarPropRows = [
  { prop: "Avatar", type: "AvatarPrimitive.Root.Props", defaultValue: "—", desc: "Base UI 根节点属性，包含 render；可在需要导航或操作语义时渲染为 a / button。" },
  { prop: "Avatar.size", type: "\"xs\" | \"sm\" | \"default\" | \"lg\" | \"xl\"", defaultValue: "\"default\"", desc: "尺寸档（20/24/32/40/48），子元素随档联动缩放。" },
  { prop: "Avatar.shape", type: "\"circle\" | \"square\"", defaultValue: "\"circle\"", desc: "形状；square 按尺寸使用现有 radius token，常用于企业、项目或应用。" },
  { prop: "AvatarImage", type: "AvatarPrimitive.Image.Props", defaultValue: "—", desc: "实际图片；支持 onLoadingStatusChange，失败时自动让出位置给 AvatarFallback。" },
  { prop: "AvatarFallback.delay", type: "number", defaultValue: "—", desc: "Base UI 原生延迟显示时间，避免图片很快加载时兜底闪烁。" },
  { prop: "AvatarFallback.render", type: "AvatarPrimitive.Fallback.Props[\"render\"]", defaultValue: "—", desc: "保留 Base UI fallback 状态语义，并替换默认 span 标签。" },
  { prop: "AvatarFallback.colorful", type: "boolean", defaultValue: "false", desc: "兜底文字按内容 hash 自动取色板背景色 + 反白文字，便于区分用户。" },
  { prop: "AvatarBadge.status", type: "\"online\" | \"away\" | \"busy\" | \"offline\"", defaultValue: "—", desc: "右下角状态点的 presence 语义色：在线绿 / 离开黄 / 忙红 / 离线灰；随 size 自动缩放。" },
  { prop: "AvatarGroup.max", type: "number", defaultValue: "—", desc: "最多展示几个头像，超出自动折叠为“+N”（AvatarGroupCount）；需要 hover/focus 展示剩余成员时手动渲染 AvatarGroupCount + Tooltip。" },
  { prop: "AvatarGroupCount.render", type: "useRender.ComponentProps<\"div\">[\"render\"]", defaultValue: "—", desc: "需要交互时渲染为 button，保留折叠计数视觉并获得正确键盘语义。" },
  { prop: "AvatarComposite.max", type: "2 | 3 | 4", defaultValue: "4", desc: "群聊拼接的成员数量上限，对应 2、3、4 人固定结构。" },
  { prop: "AvatarComposite.size", type: "\"default\" | \"lg\" | \"xl\"", defaultValue: "\"default\"", desc: "群聊拼接整体尺寸 32/40/48；不提供无法可靠辨认的 20/24。" },
  { prop: "avatarInitials(name)", type: "(name: string) => string", defaultValue: "—", desc: "统一生成中文或英文姓名缩写。" },
]

const avatarSemanticDomRows = [
  { part: "[data-slot=\"avatar\"][data-size][data-shape]", desc: "头像容器，标记 xs/sm/default/lg/xl 尺寸与 circle/square 形状。" },
  { part: "[data-slot=\"avatar-image\"] / [data-slot=\"avatar-fallback\"]", desc: "图片与兜底内容，二者互斥展示。" },
  { part: "[data-slot=\"avatar-badge\"]", desc: "右下角状态徽标，常用于标记在线/离线。" },
  { part: "[data-slot=\"avatar-group\"] / [data-slot=\"avatar-group-count\"]", desc: "头像组容器与折叠计数占位。" },
  { part: "[data-slot=\"avatar-composite\"] / [data-slot=\"avatar-composite-cell\"]", desc: "群聊拼接容器与 2 至 4 个成员单元。" },
]

const avatarDoDontRows = [
  { do: "始终提供 AvatarFallback 兜底内容。", dont: "只放 AvatarImage，图裂时显示空白圆圈。" },
  { do: "用首字母缩写（1-2 个字）做兜底文案。", dont: "塞入完整姓名导致文字溢出容器。" },
  { do: "人物用 circle、企业/项目/群组用 square。", dont: "给用户头像用方形、给应用图标用圆形，语义混乱。" },
  { do: "彩色文字头像用 colorful 自动上色。", dont: "给每个头像手写 bg-[#xxx] 背景色。" },
  { do: "头像组用 max 自动折叠 +N。", dont: "无限堆叠头像，挤占横向空间。" },
  { do: "群聊拼接使用 32/40/48，并让 AvatarComposite 管理结构。", dont: "在 20/24 尺寸里塞多人头像，或在调用处重写宫格。" },
]

export function AvatarPage({ actions, lang, autoScenarioSlugs }: {
  actions: ReactNode
  lang: StandardDocLang
  autoScenarioSlugs: string[]
}) {
  return (
    <StandardDocPage
      slug="avatar"
      title="Avatar 头像"
      lead="展示用户或实体身份，支持 Base UI 图片失败回退、圆/方形、彩色文字、在线状态、头像组与群聊拼接。"
      playground={<ComponentPlayground config={avatarPlaygroundConfig} lang={lang} />}
      hideOverview
      hideScenarioExamples
      hideUsage
      overview={null}
      scenarioExamples={[]}
      renderScenarioPreview={() => null}
      importCode={`import { Avatar, AvatarComposite, AvatarFallback, AvatarImage } from "@/components/ui/avatar"`}
      usageCode={`<Avatar>\n  <AvatarImage src="/avatars/01.jpg" alt="陈昊" />\n  <AvatarFallback>陈</AvatarFallback>\n</Avatar>`}
      propRows={avatarPropRows}
      semanticDomRows={avatarSemanticDomRows}
      doDontRows={avatarDoDontRows}
      autoScenarioSlugs={autoScenarioSlugs}
      actions={actions}
      lang={lang}
    />
  )
}

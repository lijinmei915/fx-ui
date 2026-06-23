// 自定义/上传图标：放这里，统一从 @/lib/icons 出口（不要在页面里塞裸 <svg>/<img>）。
// 规则（详见 docs/DECISIONS.md DEC-013、docs/TOKENS.md 图标小节）：
//   1. 必须用 currentColor 描边/填充（line 用 stroke、fill 用 fill），颜色才跟随 token / text-* 类。
//   2. viewBox 统一 "0 0 24 24"，尺寸交给外层（size-4 等），组件不写死宽高数值。
//   3. 上传的第三方 SVG 必须先消毒：删 <script>、on* 事件、外链 href/xlink、内联 style 里的写死色值。
//   4. 命名 PascalCase + Icon 结尾；同步登记进 docs/data/icons.manifest.json（否则 check:icons 不通过）。
//   5. 线型默认 stroke-width 跟随全局 .tabler-icon 视觉（这里手动写 1.75 对齐）。

import type { SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement>

// 线型自定义图标模板：stroke=currentColor。
function lineIcon(path: React.ReactNode) {
  return function CustomLineIcon({ className, ...props }: IconProps) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
        {...props}
      >
        {path}
      </svg>
    )
  }
}

// 面型自定义图标模板：fill=currentColor。
function fillIcon(path: React.ReactNode) {
  return function CustomFillIcon({ className, ...props }: IconProps) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true" {...props}>
        {path}
      </svg>
    )
  }
}

// ── 示例自定义图标（演示完整接入路径；真实上传图标按此追加） ──

// 业务自定义：合同（line）
export const ContractIcon = lineIcon(
  <>
    <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
    <path d="M14 3v6h6" />
    <path d="M8 13h8M8 17h5" />
  </>
)

// 业务自定义：合同（fill）
export const ContractFilledIcon = fillIcon(
  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 7V3.5L18.5 9H13zM8 14h8v1.5H8V14zm0 3.5h5V19H8v-1.5z" />
)

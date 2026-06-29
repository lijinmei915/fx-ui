import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// 自定义字号 token（旧 text-fx-* + 新语义字号类）是 font-size，不是颜色。
// 不登记的话 tailwind-merge 会把它们当成文字颜色，和 text-primary-foreground 冲突、
// 把颜色覆盖掉（导致按钮等出现意外黑字）。这里统一归到 font-size 组。
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["fx-11", "fx-12", "fx-13", "fx-15", "fx-18", "caption", "body", "section-title", "page-title"] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

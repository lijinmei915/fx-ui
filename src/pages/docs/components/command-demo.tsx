import { useState } from "react"

import { CommandPalette, type CommandItem } from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { SearchIcon } from "@/lib/icons"

export function CommandDemo() {
  const [open, setOpen] = useState(false)
  const items: CommandItem[] = [
    { id: "1", label: "新建项目", group: "操作", onSelect: () => {} },
    { id: "2", label: "导入数据", group: "操作", onSelect: () => {} },
    { id: "3", label: "客户列表", group: "页面", onSelect: () => {} },
    { id: "4", label: "数据看板", group: "页面", onSelect: () => {} },
    { id: "5", label: "账号设置", group: "页面", keywords: "setting profile", onSelect: () => {} },
  ]

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <SearchIcon data-icon="inline-start" /> 打开命令面板（或 ⌘K）
      </Button>
      <CommandPalette open={open} onOpenChange={setOpen} items={items} placeholder="搜索操作或页面…" />
    </>
  )
}

#!/usr/bin/env node
// 列表页脚手架：按固定模板生成一个列表页骨架（拼好 CrmAppShell + ListPageHeader + ListToolbar + DataTable + Pagination）。
// 结构由模板锁死，使用者只填 columns/数据 → 结构层零跑偏。用法见 docs/PAGES.md。
//   node scripts/gen-list-page.mjs --name 订单 --slug order [--force]
import { writeFile, mkdir, access } from "node:fs/promises"
import { join } from "node:path"

const args = process.argv.slice(2)
const get = (k) => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : undefined }
const force = args.includes("--force")

const entity = get("name")
const slug = get("slug")
if (!entity || !slug) {
  console.error("用法：node scripts/gen-list-page.mjs --name <中文实体名> --slug <英文slug> [--force]")
  console.error("例： node scripts/gen-list-page.mjs --name 订单 --slug order")
  process.exit(1)
}
if (!/^[a-z][a-z0-9-]*$/.test(slug)) {
  console.error(`slug 只能小写字母/数字/连字符：${slug}`)
  process.exit(1)
}

const pascal = slug.split("-").map((s) => s[0].toUpperCase() + s.slice(1)).join("")
const componentName = `${pascal}ListPage`
const typeName = `${pascal}Row`
const relPath = `src/pages/${slug}-list.tsx`

const content = `"use client"
// @generated fx-ui:list-page —— 由 \`npm run gen:list-page\` 产出，结构勿手改，只填 columns/数据（见 docs/PAGES.md）。

import { useState } from "react"

import { CrmAppShell } from "@/components/recipes/crm-app-shell"
import { ListPageHeader } from "@/components/recipes/list-page-header"
import { ListToolbar } from "@/components/recipes/list-toolbar"
import { DataTable, type Column } from "@/components/recipes/data-table"
import { Pagination } from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import { PlusIcon, SettingsIcon, RefreshIcon, MoreVerticalIcon, ListIcon, LayoutGridIcon } from "@/lib/icons"

// ${entity}列表页 —— 由 \`npm run gen:list-page\` 生成（模板见 scripts/gen-list-page.mjs）。
// 只改 columns / rows / 配置；结构勿动（拼装规则见 docs/PAGES.md）。

// TODO: 换成你的行数据类型
type ${typeName} = { id: number; name: string }

// TODO: 换成真实数据 / 接口
const rows: ${typeName}[] = [
  { id: 1, name: "示例一" },
  { id: 2, name: "示例二" },
]

// TODO: 在这里加你的列（Tag / Progress / 头像等都在 cell 里渲染）
const columns: Column<${typeName}>[] = [
  { key: "name", header: "名称", cell: (r) => <a href="#" className="text-foreground hover:text-link hover:underline">{r.name}</a> },
]

const headerViews = [{ key: "all", label: "全部${entity}" }]
const searchScopes = [{ key: "name", label: "名称" }]
const toolbarViews = [
  { value: "list", label: "列表", icon: <ListIcon /> },
  { value: "grid", label: "看板", icon: <LayoutGridIcon /> },
]

function ${componentName}() {
  const [q, setQ] = useState("")
  const [scope, setScope] = useState("name")
  const [view, setView] = useState("list")
  const [headerView, setHeaderView] = useState("all")
  const [selected, setSelected] = useState<Set<string | number>>(new Set())

  return (
    <CrmAppShell>
      <ListPageHeader
        title="${entity}"
        views={headerViews}
        view={headerView}
        onViewChange={setHeaderView}
        actions={
          <>
            <Button size="sm"><PlusIcon data-icon="inline-start" />新建</Button>
            <Button variant="outline" size="icon-sm" aria-label="更多"><MoreVerticalIcon /></Button>
          </>
        }
      />
      <ListToolbar
        search={q}
        onSearchChange={setQ}
        scope={scope}
        scopes={searchScopes}
        onScopeChange={setScope}
        view={view}
        views={toolbarViews}
        onViewChange={setView}
        onFilter={() => {}}
        actions={
          <>
            <Button variant="ghost" size="icon-sm" aria-label="显示设置"><SettingsIcon /></Button>
            <Button variant="ghost" size="icon-sm" aria-label="刷新"><RefreshIcon /></Button>
          </>
        }
      />
      <div className="min-h-0 flex-1 overflow-auto">
        <DataTable
          columns={columns}
          data={rows}
          rowKey={(r) => r.id}
          selectable
          selected={selected}
          onSelectedChange={setSelected}
          rowActions={() => (
            <span className="flex items-center gap-3">
              <Button variant="plain" tone="info" size="sm">查看</Button>
              <Button variant="plain" tone="info" size="sm">编辑</Button>
            </span>
          )}
        />
      </div>
      <div className="flex shrink-0 items-center justify-between border-t border-border-subtle px-4 py-2.5">
        <span className="text-fx-12 text-muted-foreground">已选 {selected.size} 项</span>
        <Pagination page={1} total={rows.length} pageSize={20} onPageChange={() => {}} />
      </div>
    </CrmAppShell>
  )
}

export { ${componentName} }
`

const outPath = join(process.cwd(), relPath)
try {
  await access(outPath)
  if (!force) {
    console.error(`已存在：${relPath}（加 --force 覆盖）`)
    process.exit(1)
  }
} catch {
  // 不存在，正常
}
await mkdir(join(process.cwd(), "src/pages"), { recursive: true })
await writeFile(outPath, content, "utf8")

console.log(`✅ 已生成 ${relPath}`)
console.log(`\n下一步：在 src/App.tsx 接 3 处（结构已拼好，你只改 columns/数据）：\n`)
console.log(`1) 顶部 import：`)
console.log(`   import { ${componentName} } from "@/pages/${slug}-list"`)
console.log(`\n2) pageRegistry 加一行（满宽页）：`)
console.log(`   "${slug}-list": { anchors: [], fullBleed: true, render: () => <${componentName} /> },`)
console.log(`\n3) docsNav「页面模板」组加导航项：`)
console.log(`   { label: "${entity}列表页", labelEn: "${pascal} list", href: "#${slug}-list" },`)
console.log(`\n然后只填 columns/rows，跑 \`npm run check:all\` + \`npm run test:visual\`。`)

#!/usr/bin/env node
// 编辑表单页脚手架：固定使用 EditFormBlock，只填字段 schema 和保存逻辑。
import { access, mkdir, writeFile } from "node:fs/promises"
import { join } from "node:path"

const args = process.argv.slice(2)
const get = (key) => {
  const index = args.indexOf(`--${key}`)
  return index >= 0 ? args[index + 1] : undefined
}
const force = args.includes("--force")
const entity = get("name")
const slug = get("slug")

if (!entity || !slug) {
  console.error("用法：node scripts/gen-edit-form-page.mjs --name <中文实体名> --slug <slug> [--force]")
  process.exit(1)
}
if (!/^[a-z][a-z0-9-]*$/.test(slug)) {
  console.error(`slug 只能小写字母/数字/连字符：${slug}`)
  process.exit(1)
}

const pascal = slug.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join("")
const componentName = `${pascal}EditPage`
const relPath = `src/pages/${slug}-edit.tsx`
const content = `"use client"
// @generated fx-ui:edit-form-page —— 由 \`npm run gen:edit-form-page\` 产出，结构勿手改，只填 fields 和 onSubmit。

import { useState } from "react"

import { CrmAppShell } from "@/components/recipes/crm-app-shell"
import { EditFormBlock, type EditFormValues } from "@/components/recipes/edit-form-block"

const fields = [
  { name: "name", label: "${entity}名称", required: true },
  { name: "owner", label: "负责人", required: true },
  { name: "notes", label: "备注", type: "textarea" as const },
]

function ${componentName}() {
  const [saved, setSaved] = useState<EditFormValues | null>(null)

  return (
    <CrmAppShell>
      <EditFormBlock
        fields={fields}
        onSubmit={(values) => setSaved(values)}
        onCancel={() => setSaved(null)}
      />
      {saved ? <output className="sr-only">已保存 {saved.name}</output> : null}
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
  // 文件不存在，继续生成。
}

await mkdir(join(process.cwd(), "src/pages"), { recursive: true })
await writeFile(outPath, content, "utf8")
console.log(`✅ 已生成 ${relPath}`)
console.log("\n下一步：")
console.log(`1) import { ${componentName} } from "@/pages/${slug}-edit"`)
console.log(`2) 在 pageRegistry 接入 "${slug}-edit"，并登记 docsNav 导航项。`)
console.log("3) 只修改 fields 和 onSubmit，不复制 EditFormBlock 结构。")

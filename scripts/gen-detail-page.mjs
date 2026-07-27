#!/usr/bin/env node
// 详情页脚手架：固定使用 DetailPageBlock，只填对象数据和动作回调。
import { access, mkdir, writeFile } from "node:fs/promises"
import { join } from "node:path"

const args = process.argv.slice(2)
const get = (key) => { const index = args.indexOf(`--${key}`); return index >= 0 ? args[index + 1] : undefined }
const force = args.includes("--force")
const entity = get("name")
const slug = get("slug")
if (!entity || !slug) {
  console.error("用法：node scripts/gen-detail-page.mjs --name <中文实体名> --slug <slug> [--force]")
  process.exit(1)
}
if (!/^[a-z][a-z0-9-]*$/.test(slug)) {
  console.error(`slug 只能小写字母/数字/连字符：${slug}`)
  process.exit(1)
}

const pascal = slug.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join("")
const componentName = `${pascal}DetailPage`
const relPath = `src/pages/${slug}-detail.tsx`
const content = `"use client"
// @generated fx-ui:detail-page —— 由 \`npm run gen:detail-page\` 产出，结构勿手改，只填对象数据和动作回调。

import { CrmAppShell } from "@/components/recipes/crm-app-shell"
import { DetailPageBlock } from "@/components/recipes/detail-page-block"

function ${componentName}() {
  return (
    <CrmAppShell>
      <DetailPageBlock
        breadcrumbs={[{ label: "${entity}", href: "#template-${slug}-list" }, { label: "示例详情" }]}
        title="示例${entity}"
        fields={[
          { label: "编号", value: "DEMO-001" },
          { label: "负责人", value: "待填" },
        ]}
        onEdit={() => {}}
      />
    </CrmAppShell>
  )
}

export { ${componentName} }
`

const outPath = join(process.cwd(), relPath)
try {
  await access(outPath)
  if (!force) { console.error(`已存在：${relPath}（加 --force 覆盖）`); process.exit(1) }
} catch {
  // 文件不存在，继续生成。
}
await mkdir(join(process.cwd(), "src/pages"), { recursive: true })
await writeFile(outPath, content, "utf8")
console.log(`✅ 已生成 ${relPath}`)
console.log("\n下一步：")
console.log(`1) import { ${componentName} } from "@/pages/${slug}-detail"`)
console.log(`2) 在 pageRegistry 接入 "${slug}-detail"，并登记 docsNav 导航项。`)
console.log("3) 只修改对象数据和动作回调，不复制 DetailPageBlock 结构。")

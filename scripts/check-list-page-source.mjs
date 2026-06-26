// 列表页来源检查：src/pages/ 下"用了 ListToolbar + DataTable"（列表页特征）的文件，
// 必须带 `npm run gen:list-page` 盖的 @generated fx-ui:list-page 标记。
// 目的：列表页只能由生成器产出（结构模板化、零跑偏），手写一个会被这条拦下。
import { readdir, readFile } from "node:fs/promises"
import { join } from "node:path"

const DIR = "src/pages"
const MARKER = "@generated fx-ui:list-page"

let files = []
try {
  files = (await readdir(DIR)).filter((f) => f.endsWith(".tsx"))
} catch {
  console.log("list-page-source check passed: src/pages/ 不存在或为空，无列表页。")
  process.exit(0)
}

const errors = []
for (const file of files) {
  const text = await readFile(join(DIR, file), "utf8")
  const isListPage = text.includes("ListToolbar") && text.includes("DataTable")
  if (isListPage && !text.includes(MARKER)) {
    errors.push(file)
  }
}

if (errors.length > 0) {
  console.error("list-page-source check failed：下列文件像列表页（用了 ListToolbar + DataTable）但不是生成器产出：\n")
  for (const f of errors) console.error(`- src/pages/${f}`)
  console.error(`\n列表页请用 \`npm run gen:list-page -- --name <实体> --slug <slug>\` 生成，不要手写结构。`)
  console.error(`确属合法例外（如手工特例）→ 在文件顶部加一行 \`// ${MARKER}\` 并说明原因。`)
  process.exitCode = 1
} else {
  console.log(`list-page-source check passed：${files.length} 个 page 文件，列表页均由生成器产出。`)
}

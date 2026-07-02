#!/usr/bin/env node
// 从 package.json scripts / governance-index 重建 docs/data/governance-pages.manifest.json 里的 checks.commands / checks.layers。
// 分工：本脚本负责产出；check-doc-site-contract.mjs 负责校验页面是否真的消费 manifest。
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const packageJsonPath = path.join(root, "package.json")
const manifestPath = path.join(root, "docs/data/governance-pages.manifest.json")
const governanceIndexPath = path.join(root, "docs/data/governance-index.json")
const checkAllPath = path.join(root, "scripts/check-all.sh")

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"))
const governanceIndex = JSON.parse(fs.readFileSync(governanceIndexPath, "utf8"))
const checkAll = fs.readFileSync(checkAllPath, "utf8")
const scripts = packageJson.scripts ?? {}

const commandMeta = new Map(
  (manifest.checks?.commands ?? []).map((item) => [item.command, { usage: item.usage }]),
)

const orderedCommands = [
  "npm run check",
  "npm run check:components",
  "npm run check:doc-site",
  "npm run check:tokens",
  "npm run check:all",
]

const nextCommands = orderedCommands
  .filter((command) => {
    const scriptName = command.replace(/^npm run /, "")
    return scriptName in scripts
  })
  .map((command) => {
    const existing = commandMeta.get(command)
    return {
      command,
      usage: existing?.usage ?? "",
    }
  })

const layerMeta = new Map(
  (manifest.checks?.layers ?? []).map((item) => [item.script, { title: item.title, desc: item.desc }]),
)

const governanceDatasets = new Map(
  (governanceIndex.datasets ?? []).map((dataset) => [dataset.checkCommand, dataset]),
)

const toDisplayScript = (command) => {
  if (command.startsWith("node ")) return command.slice("node ".length)
  if (command.startsWith("bash ")) return command.slice("bash ".length)
  return command
}

const hasCommand = (command) => {
  if (command === "npm run build") return "build" in scripts
  if (command.startsWith("node ") || command.startsWith("bash ")) {
    const file = command.replace(/^(node|bash)\s+/, "")
    return fs.existsSync(path.join(root, file))
  }
  return false
}

const orderedLayers = Array.from(
  checkAll.matchAll(/run_check\s+"([^"]+)"\s+(.+)$/gm),
  (match) => ({
    title: match[1].trim(),
    command: match[2].trim(),
  }),
)

const nextLayers = orderedLayers
  .filter(({ command }) => hasCommand(command))
  .map(({ title, command }) => {
    const displayScript = toDisplayScript(command)
    const existing = layerMeta.get(displayScript) ?? layerMeta.get(command)
    const dataset = governanceDatasets.get(command.replace(/^node /, "npm run ").replace(/^bash /, "npm run "))
      ?? governanceDatasets.get(command)
    return {
      title: existing?.title ?? title ?? dataset?.id ?? displayScript,
      script: displayScript,
      desc: existing?.desc ?? dataset?.purpose ?? "",
    }
  })

manifest.checks = {
  ...manifest.checks,
  commands: nextCommands,
  layers: nextLayers,
}
manifest.updatedAt = new Date().toISOString().slice(0, 10)

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n")
console.log(`✅ 已重建 docs/data/governance-pages.manifest.json：checks.commands ${nextCommands.length} 条，checks.layers ${nextLayers.length} 条`)

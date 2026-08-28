#!/usr/bin/env node
import crypto from "node:crypto"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const outputPath = "registry/fx-theme.release.json"
const read = (file) => fs.readFileSync(path.join(root, file), "utf8")
const json = (file) => JSON.parse(read(file))
const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex")
const presets = json("docs/data/theme-presets.manifest.json")
const audit = json("docs/data/theme-audit.manifest.json")
const adapters = json("docs/data/framework-adapters.manifest.json")
const migrationAudit = json("docs/data/fds-migration-audit.manifest.json")
const themeContract = json("registry/fx-theme.contract.json")
const frameworkCore = json("docs/data/framework-core.manifest.json")
const artifactPaths = [
  "docs/data/fds-foundation.manifest.json",
  "docs/data/fds-semantic.manifest.json",
  "docs/data/fds-components.manifest.json",
  "docs/data/fds-migration-audit.manifest.json",
  "registry/fx-theme.css",
  "registry/fx-theme.contract.json",
  "registry/fx-theme.json",
  "docs/data/theme-audit.manifest.json",
  "docs/data/framework-core.manifest.json",
]
const sourceContractPaths = [
  "docs/data/theme-presets.manifest.json",
  "docs/data/token-naming.manifest.json",
  "tokens/source/primitive.tokens.json",
  "tokens/source/map.tokens.json",
  "tokens/source/semantic.tokens.json",
  "tokens/source/component.tokens.json",
]

if (presets.publication.status !== "published") throw new Error("Theme Preset contract is not published")
if (audit.summary.status !== "ready") throw new Error("Theme audit is not ready")
if (JSON.stringify(audit.summary.eligibleModes) !== JSON.stringify(presets.publication.publishedModes)) {
  throw new Error("Published modes do not match audited eligible modes")
}
for (const file of artifactPaths) {
  if (!fs.existsSync(path.join(root, file))) throw new Error(`Missing release artifact: ${file}`)
}
for (const file of sourceContractPaths) {
  if (!fs.existsSync(path.join(root, file))) throw new Error(`Missing release source contract: ${file}`)
}
if (JSON.stringify(themeContract.stylingHooks) !== JSON.stringify(frameworkCore.tokens?.publicStylingHooks)) {
  throw new Error("Theme and framework-core public Styling Hook contracts have drifted")
}

const release = {
  schemaVersion: 1,
  format: "fx-ui/theme-release",
  name: "fx-theme",
  version: presets.contractVersion,
  channel: presets.publication.releaseChannel,
  status: "released",
  publishedModes: presets.publication.publishedModes,
  algorithm: { id: presets.algorithm.id, version: presets.algorithm.version },
  sourceContract: {
    path: "docs/data/theme-presets.manifest.json",
    sha256: sha256(read("docs/data/theme-presets.manifest.json")),
  },
  sourceContracts: Object.fromEntries(sourceContractPaths.map((file) => [file, { sha256: sha256(read(file)) }])),
  artifacts: Object.fromEntries(artifactPaths.map((file) => [file, { sha256: sha256(read(file)) }])),
  qualityEvidence: {
    path: presets.publication.qualityEvidence,
    status: audit.summary.status,
    inputs: audit.summary.governedPresetCount + audit.summary.customSampleCount,
    modes: audit.summary.auditedModes,
    failures: audit.summary.failedPairCount + audit.summary.failedNonTextPairCount + audit.summary.failedTransitionCount + audit.summary.invalidColorCount,
  },
  adapterStatus: Object.fromEntries(adapters.adapters.map((adapter) => [adapter.id, adapter.status])),
  adapterStylingHooks: Object.fromEntries(frameworkCore.adapterAvailability.map((adapter) => [adapter.id, adapter.stylingHooks])),
  stylingHooks: {
    contractVersion: themeContract.stylingHooks.contractVersion,
    status: themeContract.stylingHooks.status,
    counts: themeContract.stylingHooks.counts,
    artifact: "registry/fx-theme.contract.json#stylingHooks",
  },
  migration: {
    phase: migrationAudit.currentPhase,
    currentPhaseCompliant: migrationAudit.summary.currentPhaseCompliant,
    nextPhase: migrationAudit.summary.nextPhase,
    nextPhaseReady: migrationAudit.summary.nextPhaseReady,
  },
}
const output = `${JSON.stringify(release, null, 2)}\n`

if (process.argv.includes("--check")) {
  const current = fs.existsSync(path.join(root, outputPath)) ? read(outputPath) : ""
  if (current !== output) {
    console.error("Theme release manifest is stale; run npm run build:theme-release")
    process.exit(1)
  }
  console.log(`theme release check passed: v${release.version}, ${release.publishedModes.join("+")}`)
} else {
  fs.writeFileSync(path.join(root, outputPath), output)
  console.log(`built ${outputPath}: v${release.version}, ${release.publishedModes.join("+")}`)
}

#!/usr/bin/env node
import crypto from "node:crypto"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { chromium } from "@playwright/test"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const contractPath = path.join(root, "docs/data/theme-presets.manifest.json")
const cssPath = path.join(root, "registry/fx-theme.css")
const outputPath = path.join(root, "docs/data/theme-audit.manifest.json")
const checkOnly = process.argv.includes("--check")
const contract = JSON.parse(fs.readFileSync(contractPath, "utf8"))
const css = fs.readFileSync(cssPath, "utf8")
const gates = contract.qualityGates
const behaviorEvidenceById = new Map((gates.disabledBehaviorEvidence ?? []).map((evidence) => [evidence.id, evidence]))
const shadowSystem = gates.candidateShadowSystem
const solidForeground = gates.solidForeground
const shadowVisualEvidenceById = new Map((gates.shadowVisualEvidence ?? []).map((evidence) => [evidence.id, evidence]))

if (!gates || gates.colorResolution !== "chromium-computed-style") {
  throw new Error("Theme Preset contract is missing the Chromium quality-gate contract")
}

const round = (value, digits = 3) => Number(value.toFixed(digits))
const hash = (value) => crypto.createHash("sha256").update(value).digest("hex")
const linear = (channel) => {
  const value = channel / 255
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
}
const luminance = ([red, green, blue]) =>
  0.2126 * linear(red) + 0.7152 * linear(green) + 0.0722 * linear(blue)
const contrast = (first, second) => {
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a)
  return (values[0] + 0.05) / (values[1] + 0.05)
}
const composite = (foreground, background) => {
  const alpha = foreground[3] / 255
  return [0, 1, 2].map((index) => foreground[index] * alpha + background[index] * (1 - alpha))
}
const toOklab = ([red, green, blue]) => {
  const r = linear(red)
  const g = linear(green)
  const b = linear(blue)
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ]
}
const deltaE = (first, second) => {
  const a = toOklab(first)
  const b = toOklab(second)
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])
}
const verifyBehaviorEvidence = (evidence) => {
  if (!evidence) return false
  const sourcePath = path.join(root, evidence.source ?? "")
  if (!fs.existsSync(sourcePath)) return false
  const source = fs.readFileSync(sourcePath, "utf8")
  const titleIndex = source.indexOf(`test(\"${evidence.testTitle}\"`)
  if (titleIndex < 0) return false
  const nextTestIndex = source.indexOf("\ntest(\"", titleIndex + evidence.testTitle.length)
  const testBlock = source.slice(titleIndex, nextTestIndex < 0 ? source.length : nextTestIndex)
  return (evidence.requiredAssertions ?? []).length > 0
    && evidence.requiredAssertions.every((assertion) => testBlock.includes(assertion))
}
const verifyRuntimeConsumer = (evidence) => {
  const sourcePath = path.join(root, evidence.source ?? "")
  return Boolean(evidence.source && evidence.contains && fs.existsSync(sourcePath)
    && fs.readFileSync(sourcePath, "utf8").includes(evidence.contains))
}
const verifyShadowVisualEvidence = (evidence) => {
  if (!verifyBehaviorEvidence(evidence) || !evidence.screenshot) return false
  const snapshotDirectory = path.join(root, "tests/visual.spec.ts-snapshots")
  if (!fs.existsSync(snapshotDirectory)) return false
  const stem = evidence.screenshot.replace(/\.png$/, "")
  return fs.readdirSync(snapshotDirectory).some((file) => file.startsWith(`${stem}-`) && file.endsWith(".png"))
}

const inputs = [
  ...contract.dimensions.primaryColor.options.map((option) => ({
    id: option.id,
    kind: "preset",
    seed: `var(${option.foundationRef})`,
    foundationRef: option.foundationRef,
  })),
  ...gates.customSeedSamples.map((seed, index) => ({
    id: `custom-${String(index + 1).padStart(2, "0")}`,
    kind: "custom-sample",
    seed,
  })),
]

const requiredVariables = [...new Set([
  ...gates.semanticPairs.flatMap((pair) => [pair.background, pair.foreground]),
  ...(gates.nonTextPairs ?? []).flatMap((pair) => [pair.background, pair.foreground]),
  ...(gates.candidateNonTextPairs ?? []).flatMap((pair) => [pair.background, pair.foreground]),
  ...(gates.candidateTextStateGroups ?? []).flatMap((group) => [group.background, ...group.states]),
  ...(gates.candidateDisabledGroups ?? []).flatMap((group) => [group.enabled, group.disabled, group.background]),
  ...(shadowSystem?.colorHooks ?? []),
  ...(solidForeground ? [
    solidForeground.preferred,
    solidForeground.fallback,
    ...solidForeground.groups.flatMap((group) => [group.foreground, ...group.backgrounds]),
  ] : []),
  ...gates.interactionGroups.flatMap((group) => group.states),
])]
const alphaAllowedVariables = new Set([
  ...(gates.nonTextPairs ?? []).map((pair) => pair.foreground),
  ...(gates.candidateNonTextPairs ?? []).map((pair) => pair.foreground),
  ...(gates.candidateDisabledGroups ?? []).flatMap((group) => [group.enabled, group.disabled]),
  ...(shadowSystem?.colorHooks ?? []),
])

const browser = await chromium.launch()
const page = await browser.newPage()
await page.setContent(`<style>${css}</style>`)
const results = []
const darkPaletteResults = []

try {
  for (const input of inputs) {
    for (const mode of gates.auditedModes) {
      const resolvedTheme = await page.evaluate(({ input, mode, requiredVariables, solidForeground }) => {
        document.documentElement.className = mode === "dark" ? "dark" : ""
        document.documentElement.style.setProperty("--fds-g-color-seed-brand", input.seed)
        document.documentElement.style.removeProperty("--fds-g-color-brand-vivid")

        for (const group of solidForeground?.groups ?? []) {
          document.documentElement.style.removeProperty(group.foreground)
        }

        const resolveColor = (variable) => {
          const probe = document.createElement("i")
          probe.style.backgroundColor = `var(${variable})`
          document.body.append(probe)
          const cssValue = getComputedStyle(probe).backgroundColor
          const canvas = document.createElement("canvas")
          canvas.width = 1
          canvas.height = 1
          const context = canvas.getContext("2d", { willReadFrequently: true })
          context.clearRect(0, 0, 1, 1)
          context.fillStyle = cssValue
          context.fillRect(0, 0, 1, 1)
          const rgba = [...context.getImageData(0, 0, 1, 1).data]
          probe.remove()
          return { css: cssValue, rgba }
        }

        const linearize = (channel) => {
          const value = channel / 255
          return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
        }
        const luminance = ([red, green, blue]) =>
          0.2126 * linearize(red) + 0.7152 * linearize(green) + 0.0722 * linearize(blue)
        const contrastRatio = (first, second) => {
          const values = [luminance(first), luminance(second)].sort((a, b) => b - a)
          return (values[0] + 0.05) / (values[1] + 0.05)
        }
        const selections = {}
        if (solidForeground) {
          const preferred = resolveColor(solidForeground.preferred)
          for (const group of solidForeground.groups) {
            const usePreferred = group.policy === "fixed-preferred" || group.backgrounds.every((background) => {
              const resolved = resolveColor(background)
              return resolved.rgba[3] === 255
                && contrastRatio(preferred.rgba, resolved.rgba) >= solidForeground.minimumContrast
            })
            const chosen = usePreferred ? solidForeground.preferred : solidForeground.fallback
            document.documentElement.style.setProperty(group.foreground, `var(${chosen})`)
            selections[group.id] = { chosen, usedPreferred: usePreferred }
          }
        }

        return {
          colors: Object.fromEntries(requiredVariables.map((variable) => [variable, resolveColor(variable)])),
          solidForegroundSelections: selections,
        }
      }, { input, mode, requiredVariables, solidForeground })
      const { colors, solidForegroundSelections } = resolvedTheme

      const invalidVariables = Object.entries(colors)
        .filter(([variable, color]) => color.rgba[3] !== 255 && !alphaAllowedVariables.has(variable))
        .map(([variable]) => variable)
      const pairs = gates.semanticPairs.map((pair) => {
        const ratio = invalidVariables.includes(pair.background) || invalidVariables.includes(pair.foreground)
          ? 0
          : contrast(colors[pair.background].rgba, colors[pair.foreground].rgba)
        return { id: pair.id, ratio: round(ratio, 2), status: ratio >= gates.normalTextMinimum ? "pass" : "fail" }
      })
      const solidForegroundGroups = (solidForeground?.groups ?? []).map((group) => {
        const states = group.backgrounds.map((background) => {
          const ratio = invalidVariables.includes(group.foreground) || invalidVariables.includes(background)
            ? 0
            : contrast(colors[group.foreground].rgba, colors[background].rgba)
          return {
            background,
            ratio: round(ratio, 2),
            status: ratio >= solidForeground.minimumContrast ? "pass" : "fail",
          }
        })
        return {
          id: group.id,
          foreground: group.foreground,
          chosen: solidForegroundSelections[group.id]?.chosen,
          usedPreferred: solidForegroundSelections[group.id]?.usedPreferred ?? false,
          minimumRatio: round(Math.min(...states.map((state) => state.ratio)), 2),
          minimum: solidForeground.minimumContrast,
          status: states.every((state) => state.status === "pass") ? "pass" : "fail",
          states,
        }
      })
      const interactions = gates.interactionGroups.map((group) => {
        const transitions = group.states.slice(1).map((state, index) => {
          const from = group.states[index]
          const value = invalidVariables.includes(from) || invalidVariables.includes(state)
            ? 0
            : deltaE(colors[from].rgba, colors[state].rgba)
          return {
            from,
            to: state,
            deltaE: round(value),
            status: value >= gates.stateDeltaEOklabMinimum ? "pass" : "fail",
          }
        })
        return {
          id: group.id,
          status: transitions.every((transition) => transition.status === "pass") ? "pass" : "fail",
          transitions,
        }
      })
      const evaluateNonTextPair = (pair) => {
        const foreground = colors[pair.foreground].rgba
        const background = colors[pair.background].rgba
        const ratio = invalidVariables.includes(pair.background)
          ? 0
          : contrast(composite(foreground, background), background)
        return {
          id: pair.id,
          foreground: pair.foreground,
          background: pair.background,
          ratio: round(ratio, 2),
          minimum: pair.minimum,
          status: ratio >= pair.minimum ? "pass" : "fail",
        }
      }
      const nonTextPairs = (gates.nonTextPairs ?? []).map(evaluateNonTextPair)
      const nonTextCandidates = (gates.candidateNonTextPairs ?? []).map((pair) => {
        return evaluateNonTextPair(pair)
      })
      const textStateCandidates = (gates.candidateTextStateGroups ?? []).map((group) => {
        const stateContrasts = group.states.map((state) => {
          const ratio = invalidVariables.includes(group.background) || invalidVariables.includes(state)
            ? 0
            : contrast(colors[state].rgba, colors[group.background].rgba)
          return { state, ratio: round(ratio, 2), status: ratio >= group.minimum ? "pass" : "fail" }
        })
        const transitions = group.states.slice(1).map((state, index) => {
          const from = group.states[index]
          const value = invalidVariables.includes(from) || invalidVariables.includes(state)
            ? 0
            : deltaE(colors[from].rgba, colors[state].rgba)
          return { from, to: state, deltaE: round(value), status: value >= gates.stateDeltaEOklabMinimum ? "pass" : "fail" }
        })
        return {
          id: group.id,
          status: stateContrasts.every((item) => item.status === "pass") && transitions.every((item) => item.status === "pass") ? "pass" : "fail",
          stateContrasts,
          transitions,
        }
      })
      const disabledCandidates = (gates.candidateDisabledGroups ?? []).map((group) => {
        const background = colors[group.background].rgba
        const enabled = composite(colors[group.enabled].rgba, background)
        const disabled = composite(colors[group.disabled].rgba, background)
        const adjacentContrast = invalidVariables.includes(group.background)
          ? 0
          : contrast(disabled, background)
        const stateDeltaE = invalidVariables.includes(group.background)
          ? 0
          : deltaE(enabled, disabled)
        return {
          id: group.id,
          enabled: group.enabled,
          disabled: group.disabled,
          background: group.background,
          adjacentContrast: round(adjacentContrast, 2),
          stateDeltaE: round(stateDeltaE),
          visualStatus: adjacentContrast >= gates.disabledAdjacentContrastMinimum
            && stateDeltaE >= gates.disabledStateDeltaEOklabMinimum ? "pass" : "fail",
        }
      })
      const shadowProfiles = shadowSystem ? await page.evaluate(({ profiles, system }) => {
        const allHooks = [...system.colorHooks, ...system.elevations.map((elevation) => elevation.hook)]
        const resolveColor = (variable) => {
          const probe = document.createElement("i")
          probe.style.backgroundColor = `var(${variable})`
          document.body.append(probe)
          const cssValue = getComputedStyle(probe).backgroundColor
          const canvas = document.createElement("canvas")
          canvas.width = 1
          canvas.height = 1
          const context = canvas.getContext("2d", { willReadFrequently: true })
          context.clearRect(0, 0, 1, 1)
          context.fillStyle = cssValue
          context.fillRect(0, 0, 1, 1)
          const rgba = [...context.getImageData(0, 0, 1, 1).data]
          probe.remove()
          return { css: cssValue, rgba }
        }
        const resolveShadow = (variable) => {
          const probe = document.createElement("i")
          probe.style.boxShadow = `var(${variable})`
          document.body.append(probe)
          const cssValue = getComputedStyle(probe).boxShadow
          const layers = [...cssValue.matchAll(/(-?\d+(?:\.\d+)?)px\s+(-?\d+(?:\.\d+)?)px\s+(-?\d+(?:\.\d+)?)px\s+(-?\d+(?:\.\d+)?)px/g)]
            .map((match) => ({ x: Number(match[1]), y: Number(match[2]), blur: Number(match[3]), spread: Number(match[4]) }))
          probe.remove()
          return { css: cssValue, layers }
        }
        const output = []
        for (const level of system.levels) {
          for (const hook of allHooks) document.documentElement.style.removeProperty(hook)
          for (const [hook, value] of Object.entries(profiles[level] ?? {})) document.documentElement.style.setProperty(hook, value)
          output.push({
            level,
            colors: Object.fromEntries(system.colorHooks.map((hook) => [hook, resolveColor(hook)])),
            elevations: Object.fromEntries(system.elevations.map((elevation) => [elevation.id, resolveShadow(elevation.hook)])),
          })
        }
        for (const hook of allHooks) document.documentElement.style.removeProperty(hook)
        return output
      }, { profiles: contract.profiles.shadowLevel, system: shadowSystem }) : []
      const evaluatedShadowProfiles = shadowProfiles.map((profile) => {
        const alphaValues = shadowSystem.colorAlphaOrder.map((hook) => profile.colors[hook].rgba[3] / 255)
        const alphaOrderStatus = profile.level === "none"
          ? alphaValues.every((alpha) => alpha === 0)
          : alphaValues.every((alpha, index) => index === alphaValues.length - 1 || alpha > alphaValues[index + 1])
        const elevationResults = shadowSystem.elevations.map((elevation) => {
          const resolved = profile.elevations[elevation.id]
          const directionStatus = profile.level === "none"
            ? resolved.css === "none"
            : resolved.layers.every((layer) => elevation.direction === "up" ? layer.y < 0 : layer.y > 0)
          return {
            id: elevation.id,
            css: resolved.css,
            layerCount: resolved.layers.length,
            extent: round(Math.max(0, ...resolved.layers.map((layer) => Math.abs(layer.y) + layer.blur + layer.spread))),
            status: profile.level === "none"
              ? resolved.css === "none" ? "pass" : "fail"
              : resolved.layers.length === elevation.layerCount && directionStatus ? "pass" : "fail",
            layers: resolved.layers,
          }
        })
        const downward = shadowSystem.downwardOrder.map((id) => elevationResults.find((elevation) => elevation.id === id))
        const downwardOrderStatus = profile.level === "none" || downward.every((elevation, index) => index === downward.length - 1 || elevation.extent < downward[index + 1].extent)
        const mirrorStatus = profile.level === "none" || shadowSystem.elevations.filter((elevation) => elevation.mirrorOf).every((elevation) => {
          const candidate = elevationResults.find((item) => item.id === elevation.id)
          const source = elevationResults.find((item) => item.id === elevation.mirrorOf)
          return candidate.layers.length === source.layers.length && candidate.layers.every((layer, index) => {
            const sourceLayer = source.layers[index]
            return layer.x === sourceLayer.x && Math.abs(layer.y) === Math.abs(sourceLayer.y) && layer.blur === sourceLayer.blur && layer.spread === sourceLayer.spread
          })
        })
        return {
          level: profile.level,
          status: alphaOrderStatus && downwardOrderStatus && mirrorStatus && elevationResults.every((elevation) => elevation.status === "pass") ? "pass" : "fail",
          alphaOrderStatus: alphaOrderStatus ? "pass" : "fail",
          downwardOrderStatus: downwardOrderStatus ? "pass" : "fail",
          mirrorStatus: mirrorStatus ? "pass" : "fail",
          alphas: Object.fromEntries(shadowSystem.colorHooks.map((hook) => [hook, round(profile.colors[hook].rgba[3] / 255)])),
          elevations: elevationResults,
        }
      })
      const nonNoneProfiles = evaluatedShadowProfiles.filter((profile) => profile.level !== "none")
      const shadowIntensityStatus = !shadowSystem || shadowSystem.colorHooks.every((hook) =>
        nonNoneProfiles.every((profile, index) => index === nonNoneProfiles.length - 1 || profile.alphas[hook] < nonNoneProfiles[index + 1].alphas[hook])
      )
      const status = invalidVariables.length === 0
        && pairs.every((pair) => pair.status === "pass")
        && nonTextPairs.every((pair) => pair.status === "pass")
        && solidForegroundGroups.every((group) => group.status === "pass")
        && interactions.every((group) => group.status === "pass")
        ? "pass"
        : "fail"
      results.push({ input: input.id, kind: input.kind, mode, status, invalidVariables, pairs, nonTextPairs, solidForegroundGroups, interactions, nonTextCandidates, textStateCandidates, disabledCandidates, shadowProfiles: evaluatedShadowProfiles, shadowIntensityStatus: shadowIntensityStatus ? "pass" : "fail" })
    }
  }

  if (gates.darkPalette) {
    const paletteVariables = gates.darkPalette.families.flatMap((family) => [
      `--fds-g-color-seed-${family}`,
      ...gates.darkPalette.steps.map((step) => `--fds-g-color-${family}-dark-${step}`),
    ])
    const resolved = await page.evaluate((variables) => {
      const resolveColor = (variable) => {
        const probe = document.createElement("i")
        probe.style.backgroundColor = `var(${variable})`
        document.body.append(probe)
        const cssValue = getComputedStyle(probe).backgroundColor
        const canvas = document.createElement("canvas")
        canvas.width = 1
        canvas.height = 1
        const context = canvas.getContext("2d", { willReadFrequently: true })
        context.clearRect(0, 0, 1, 1)
        context.fillStyle = cssValue
        context.fillRect(0, 0, 1, 1)
        const rgba = [...context.getImageData(0, 0, 1, 1).data]
        probe.remove()
        return { css: cssValue, rgba }
      }
      return Object.fromEntries(variables.map((variable) => [variable, resolveColor(variable)]))
    }, paletteVariables)

    for (const family of gates.darkPalette.families) {
      const colors = gates.darkPalette.steps.map((step) => resolved[`--fds-g-color-${family}-dark-${step}`])
      const luminances = colors.map((color) => luminance(color.rgba))
      const adjacentDeltaE = colors.slice(1).map((color, index) => deltaE(colors[index].rgba, color.rgba))
      const seed = resolved[`--fds-g-color-seed-${family}`]
      const seedIndex = gates.darkPalette.steps.indexOf(gates.darkPalette.seedStep)
      const invalidColorCount = colors.filter((color) => color.rgba[3] !== 255).length
      const seedFidelity = seedIndex >= 0 && colors[seedIndex].rgba.every((channel, index) => channel === seed.rgba[index])
      const increasingLuminance = luminances.every((value, index) => index === 0 || value > luminances[index - 1])
      const minimumAdjacentDeltaE = Math.min(...adjacentDeltaE)
      const status = invalidColorCount === 0
        && seedFidelity
        && (!gates.darkPalette.requireIncreasingLuminance || increasingLuminance)
        && minimumAdjacentDeltaE >= gates.darkPalette.minimumAdjacentDeltaEOklab
        ? "pass"
        : "fail"
      darkPaletteResults.push({
        family,
        profile: gates.darkPalette.profile,
        status,
        invalidColorCount,
        seedFidelity: seedFidelity ? "pass" : "fail",
        increasingLuminance: increasingLuminance ? "pass" : "fail",
        minimumAdjacentDeltaE: round(minimumAdjacentDeltaE),
        luminanceRange: { start: round(luminances[0]), end: round(luminances.at(-1)) },
      })
    }
  }
} finally {
  await browser.close()
}

const eligibleModes = gates.auditedModes.filter((mode) =>
  results.filter((result) => result.mode === mode).every((result) => result.status === "pass")
)
const failedPairs = results.flatMap((result) =>
  result.pairs.filter((pair) => pair.status === "fail").map((pair) => `${result.input}/${result.mode}/${pair.id}`)
)
const failedTransitions = results.flatMap((result) =>
  result.interactions.flatMap((group) =>
    group.transitions.filter((transition) => transition.status === "fail")
      .map((transition) => `${result.input}/${result.mode}/${group.id}/${transition.from}->${transition.to}`)
  )
)
const failedNonTextPairs = results.flatMap((result) =>
  result.nonTextPairs.filter((pair) => pair.status === "fail").map((pair) => `${result.input}/${result.mode}/${pair.id}`)
)
const failedSolidForegroundGroups = results.flatMap((result) =>
  result.solidForegroundGroups.filter((group) => group.status === "fail")
    .map((group) => `${result.input}/${result.mode}/${group.id}`)
)
const invalidColors = results.flatMap((result) =>
  result.invalidVariables.map((variable) => `${result.input}/${result.mode}/${variable}`)
)
const failedDarkPalettes = darkPaletteResults.filter((result) => result.status === "fail").map((result) => result.family)
const failedCandidatePairs = results.flatMap((result) =>
  result.nonTextCandidates.filter((pair) => pair.status === "fail")
    .map((pair) => `${result.input}/${result.mode}/${pair.id}`)
)
const stableEligibleHooks = new Set()
for (const pair of gates.semanticPairs) {
  if (results.every((result) => result.pairs.find((candidate) => candidate.id === pair.id)?.status === "pass")) {
    stableEligibleHooks.add(pair.background)
    stableEligibleHooks.add(pair.foreground)
  }
}
for (const group of gates.interactionGroups) {
  if (results.every((result) => result.interactions.find((candidate) => candidate.id === group.id)?.status === "pass")) {
    for (const state of group.states) stableEligibleHooks.add(state)
  }
}
for (const pair of gates.nonTextPairs ?? []) {
  if (results.every((result) => result.nonTextPairs.find((candidate) => candidate.id === pair.id)?.status === "pass")) {
    stableEligibleHooks.add(pair.foreground)
  }
}
for (const group of solidForeground?.groups ?? []) {
  if (results.every((result) => result.solidForegroundGroups.find((candidate) => candidate.id === group.id)?.status === "pass")) {
    stableEligibleHooks.add(group.foreground)
  }
}
const solidForegroundCoverage = (solidForeground?.groups ?? []).map((group) => {
  const samples = results.map((result) => result.solidForegroundGroups.find((candidate) => candidate.id === group.id))
  const passedSamples = samples.filter((sample) => sample?.status === "pass").length
  return {
    id: group.id,
    hook: group.foreground,
    status: passedSamples === samples.length ? "pass" : "fail",
    passedSamples,
    totalSamples: samples.length,
    preferredSampleCount: samples.filter((sample) => sample?.usedPreferred).length,
    fallbackSampleCount: samples.filter((sample) => sample && !sample.usedPreferred).length,
    minimumRatio: round(Math.min(...samples.map((sample) => sample?.minimumRatio ?? 0)), 2),
  }
})
const nonTextCandidateCoverage = (gates.candidateNonTextPairs ?? []).map((pair) => {
  const samples = results.map((result) => result.nonTextCandidates.find((candidate) => candidate.id === pair.id))
  const passedSamples = samples.filter((sample) => sample?.status === "pass").length
  const status = passedSamples === samples.length ? "pass" : "fail"
  if (status === "pass") stableEligibleHooks.add(pair.foreground)
  return {
    id: pair.id,
    hook: pair.foreground,
    status,
    passedSamples,
    totalSamples: samples.length,
    minimumRatio: round(Math.min(...samples.map((sample) => sample?.ratio ?? 0)), 2),
  }
})
const textStateCandidateCoverage = (gates.candidateTextStateGroups ?? []).map((group) => {
  const samples = results.map((result) => result.textStateCandidates.find((candidate) => candidate.id === group.id))
  const passedSamples = samples.filter((sample) => sample?.status === "pass").length
  const status = passedSamples === samples.length ? "pass" : "fail"
  if (status === "pass") for (const state of group.states) stableEligibleHooks.add(state)
  return {
    id: group.id,
    hooks: group.states,
    status,
    passedSamples,
    totalSamples: samples.length,
    minimumContrast: round(Math.min(...samples.flatMap((sample) => sample?.stateContrasts.map((item) => item.ratio) ?? [0])), 2),
    minimumDeltaE: round(Math.min(...samples.flatMap((sample) => sample?.transitions.map((item) => item.deltaE) ?? [0]))),
  }
})
const disabledCandidateCoverage = (gates.candidateDisabledGroups ?? []).map((group) => {
  const samples = results.map((result) => result.disabledCandidates.find((candidate) => candidate.id === group.id))
  const passedSamples = samples.filter((sample) => sample?.visualStatus === "pass").length
  const behaviorEvidence = group.behaviorEvidenceRefs.map((id) => ({
    id,
    status: verifyBehaviorEvidence(behaviorEvidenceById.get(id)) ? "pass" : "fail",
  }))
  const runtimeConsumerEvidence = group.runtimeConsumerEvidence.map((evidence) => ({
    source: evidence.source,
    contains: evidence.contains,
    status: verifyRuntimeConsumer(evidence) ? "pass" : "fail",
  }))
  const visualStatus = passedSamples === samples.length ? "pass" : "fail"
  const behaviorStatus = behaviorEvidence.length > 0 && behaviorEvidence.every((evidence) => evidence.status === "pass") ? "pass" : "missing"
  const runtimeConsumerStatus = runtimeConsumerEvidence.length > 0 && runtimeConsumerEvidence.every((evidence) => evidence.status === "pass") ? "pass" : "missing"
  const status = visualStatus === "pass" && behaviorStatus === "pass" && runtimeConsumerStatus === "pass" ? "pass" : "fail"
  if (status === "pass") stableEligibleHooks.add(group.disabled)
  return {
    id: group.id,
    hook: group.disabled,
    status,
    visualStatus,
    behaviorStatus,
    runtimeConsumerStatus,
    passedSamples,
    totalSamples: samples.length,
    minimumAdjacentContrast: round(Math.min(...samples.map((sample) => sample?.adjacentContrast ?? 0)), 2),
    minimumStateDeltaE: round(Math.min(...samples.map((sample) => sample?.stateDeltaE ?? 0))),
    behaviorEvidence,
    runtimeConsumerEvidence,
  }
})
const shadowCandidateCoverage = shadowSystem ? (() => {
  const allProfileSamples = results.flatMap((result) => result.shadowProfiles)
  const profileStatus = allProfileSamples.every((profile) => profile.status === "pass") ? "pass" : "fail"
  const intensityStatus = results.every((result) => result.shadowIntensityStatus === "pass") ? "pass" : "fail"
  const elevations = shadowSystem.elevations.map((elevation) => {
    const runtimeConsumerEvidence = elevation.runtimeConsumerEvidence.map((evidence) => ({
      source: evidence.source,
      contains: evidence.contains,
      status: verifyRuntimeConsumer(evidence) ? "pass" : "fail",
    }))
    const visualEvidence = elevation.visualEvidenceRefs.map((id) => ({
      id,
      status: verifyShadowVisualEvidence(shadowVisualEvidenceById.get(id)) ? "pass" : "fail",
    }))
    const geometryStatus = allProfileSamples.every((profile) => profile.elevations.find((candidate) => candidate.id === elevation.id)?.status === "pass") ? "pass" : "fail"
    const runtimeConsumerStatus = runtimeConsumerEvidence.length > 0 && runtimeConsumerEvidence.every((evidence) => evidence.status === "pass") ? "pass" : "missing"
    const visualEvidenceStatus = visualEvidence.length > 0 && visualEvidence.every((evidence) => evidence.status === "pass") ? "pass" : "missing"
    const status = geometryStatus === "pass" && runtimeConsumerStatus === "pass" && visualEvidenceStatus === "pass" ? "pass" : "fail"
    if (status === "pass") stableEligibleHooks.add(elevation.hook)
    return { id: elevation.id, hook: elevation.hook, status, geometryStatus, runtimeConsumerStatus, visualEvidenceStatus, runtimeConsumerEvidence, visualEvidence }
  })
  const eligibleElevations = elevations.filter((elevation) => elevation.status === "pass")
  const colorsStatus = profileStatus === "pass" && intensityStatus === "pass" && eligibleElevations.length > 0 ? "pass" : "fail"
  if (colorsStatus === "pass") for (const hook of shadowSystem.colorHooks) stableEligibleHooks.add(hook)
  return {
    status: profileStatus === "pass" && intensityStatus === "pass" && elevations.every((elevation) => elevation.status === "pass") ? "pass" : "partial",
    profileStatus,
    intensityStatus,
    colors: shadowSystem.colorHooks.map((hook) => ({ hook, status: colorsStatus })),
    elevations,
    sampleCount: allProfileSamples.length,
  }
})() : null
const candidatePassedCount = nonTextCandidateCoverage.filter((candidate) => candidate.status === "pass").length
  + textStateCandidateCoverage.filter((candidate) => candidate.status === "pass").length
  + disabledCandidateCoverage.filter((candidate) => candidate.status === "pass").length
  + (shadowCandidateCoverage?.colors.filter((candidate) => candidate.status === "pass").length ?? 0)
  + (shadowCandidateCoverage?.elevations.filter((candidate) => candidate.status === "pass").length ?? 0)
const candidateTotalCount = nonTextCandidateCoverage.length + textStateCandidateCoverage.length + disabledCandidateCoverage.length
  + (shadowCandidateCoverage?.colors.length ?? 0) + (shadowCandidateCoverage?.elevations.length ?? 0)
const report = {
  schemaVersion: 1,
  format: "fx-ui/theme-audit-report",
  contractVersion: contract.contractVersion,
  truthSource: "docs/data/theme-presets.manifest.json#qualityGates",
  generatedFrom: ["docs/data/theme-presets.manifest.json", "registry/fx-theme.css"],
  sourceHashes: {
    presetContractSha256: hash(fs.readFileSync(contractPath, "utf8")),
    themeCssSha256: hash(css),
  },
  thresholds: {
    normalTextMinimum: gates.normalTextMinimum,
    nonTextMinimum: gates.nonTextMinimum,
    solidForegroundMinimum: solidForeground?.minimumContrast,
    stateDeltaEOklabMinimum: gates.stateDeltaEOklabMinimum,
    disabledStateDeltaEOklabMinimum: gates.disabledStateDeltaEOklabMinimum,
    disabledAdjacentContrastMinimum: gates.disabledAdjacentContrastMinimum,
    darkPaletteMinimumAdjacentDeltaEOklab: gates.darkPalette?.minimumAdjacentDeltaEOklab,
  },
  summary: {
    status: eligibleModes.length === gates.auditedModes.length && failedDarkPalettes.length === 0 ? "ready" : "repair-needed",
    governedPresetCount: contract.dimensions.primaryColor.options.length,
    customSampleCount: gates.customSeedSamples.length,
    auditedModes: gates.auditedModes,
    eligibleModes,
    failedPairCount: failedPairs.length,
    failedNonTextPairCount: failedNonTextPairs.length,
    failedSolidForegroundGroupCount: failedSolidForegroundGroups.length,
    failedTransitionCount: failedTransitions.length,
    invalidColorCount: invalidColors.length,
    failedCandidatePairCount: failedCandidatePairs.length,
    darkPaletteFamilyCount: darkPaletteResults.length,
    failedDarkPaletteCount: failedDarkPalettes.length,
  },
  failures: { pairs: failedPairs, nonTextPairs: failedNonTextPairs, solidForegroundGroups: failedSolidForegroundGroups, transitions: failedTransitions, invalidColors, candidatePairs: failedCandidatePairs, darkPalettes: failedDarkPalettes },
  coverage: {
    stableEligibleHooks: [...stableEligibleHooks].sort(),
    solidForeground: solidForegroundCoverage,
    nonTextCandidates: nonTextCandidateCoverage,
    textStateCandidates: textStateCandidateCoverage,
    disabledCandidates: disabledCandidateCoverage,
    shadowSystem: shadowCandidateCoverage,
    darkPalette: darkPaletteResults,
  },
  results,
}
const output = `${JSON.stringify(report, null, 2)}\n`

if (checkOnly) {
  const current = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, "utf8") : ""
  if (current !== output) {
    console.error("Theme audit artifact is stale; run npm run build:theme-audit")
    process.exit(1)
  }
  if (report.summary.status !== "ready") {
    console.error(`Theme audit failed: ${failedPairs.length} text pairs, ${failedNonTextPairs.length} non-text pairs, ${failedSolidForegroundGroups.length} solid foreground groups, ${failedTransitions.length} state transitions, ${invalidColors.length} invalid colors`)
    process.exit(1)
  }
  console.log(`Theme audit check passed: ${inputs.length} inputs × ${gates.auditedModes.length} modes; candidates=${candidatePassedCount}/${candidateTotalCount}`)
} else {
  fs.writeFileSync(outputPath, output)
  console.log(`built docs/data/theme-audit.manifest.json: ${report.summary.status}, ${inputs.length} inputs × ${gates.auditedModes.length} modes, candidates=${candidatePassedCount}/${candidateTotalCount}`)
}

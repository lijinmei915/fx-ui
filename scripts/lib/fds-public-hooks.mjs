const allowedStabilities = new Set(["experimental", "stable", "deprecated"])

function assertUnique(values, label) {
  const duplicates = values.filter((value, index) => values.indexOf(value) !== index)
  if (duplicates.length) {
    throw new Error(`${label} contains duplicates: ${[...new Set(duplicates)].join(", ")}`)
  }
}

export function buildPublicStylingHooks({ naming, semantic, components }) {
  const publicVisibility = new Set(naming.publication?.publicVisibility ?? [])
  if (!publicVisibility.has("public-global") || !publicVisibility.has("public-component")) {
    throw new Error("Token naming contract must publish public-global and public-component visibility")
  }

  const admissions = new Map((components.admissions ?? []).map((item) => [item.component, item]))
  const globalHooks = (semantic.tokens ?? [])
    .filter((token) => token.visibility === "public-global")
    .map((token) => ({
      id: token.id,
      name: token.name,
      layer: "semantic",
      type: token.type,
      visibility: token.visibility,
      stability: token.stability,
      owner: semantic.owner,
    }))
  const componentHooks = (components.tokens ?? [])
    .filter((token) => token.visibility === "public-component")
    .map((token) => {
      const admission = admissions.get(token.component)
      if (!admission) throw new Error(`Public Component Hook lacks admission: ${token.name}`)
      return {
        id: token.id,
        name: token.name,
        layer: "component",
        type: token.type,
        visibility: token.visibility,
        stability: token.stability,
        component: token.component,
        owner: admission.owner,
        documentation: admission.documentation,
      }
    })
  const hooks = [...globalHooks, ...componentHooks].sort((a, b) => a.name.localeCompare(b.name))

  assertUnique(hooks.map((hook) => hook.id), "Public Styling Hook IDs")
  assertUnique(hooks.map((hook) => hook.name), "Public Styling Hook names")
  for (const hook of hooks) {
    const expectedPrefix = hook.layer === "component" ? "--fds-c-" : "--fds-g-"
    if (!hook.name.startsWith(expectedPrefix)) throw new Error(`${hook.name} has the wrong public prefix`)
    if (!publicVisibility.has(hook.visibility)) throw new Error(`${hook.name} has non-public visibility`)
    if (!allowedStabilities.has(hook.stability)) throw new Error(`${hook.name} has invalid stability: ${hook.stability}`)
  }

  const counts = {
    total: hooks.length,
    publicGlobal: globalHooks.length,
    publicComponent: componentHooks.length,
    experimental: hooks.filter((hook) => hook.stability === "experimental").length,
    stable: hooks.filter((hook) => hook.stability === "stable").length,
    deprecated: hooks.filter((hook) => hook.stability === "deprecated").length,
  }
  const computedStatus = counts.experimental > 0 ? "experimental" : "stable"
  if (naming.publication?.contractStatus !== computedStatus) {
    throw new Error(`Public Styling Hook status must be ${computedStatus}, got ${naming.publication?.contractStatus ?? "missing"}`)
  }

  return {
    schemaVersion: 1,
    format: "fds/styling-hooks-public-contract",
    contractVersion: naming.contractVersion,
    status: computedStatus,
    defaultValues: "registry/fx-theme.css",
    prefixes: {
      global: naming.brand.globalPrefix,
      component: naming.brand.componentPrefix,
    },
    overridePolicy: {
      scope: naming.publication.overrideScope,
      instanceOverride: naming.publication.instanceOverride,
    },
    versioning: naming.publication.versioning,
    counts,
    hooks,
  }
}

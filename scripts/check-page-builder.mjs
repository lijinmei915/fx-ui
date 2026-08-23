#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = path.join(root, "docs/data/page-builder.manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const playgroundManifest = JSON.parse(
  fs.readFileSync(
    path.join(root, "docs/data/component-playgrounds.manifest.json"),
    "utf8",
  ),
);
const componentsManifest = JSON.parse(
  fs.readFileSync(
    path.join(root, "docs/data/components.manifest.json"),
    "utf8",
  ),
);
const errors = [];

if (manifest.format !== "fx-ui/page-builder")
  errors.push("page builder format is invalid");
if (manifest.schemaVersion < 9)
  errors.push(
    "page builder schema must include the single-entry foundation candidate flow",
  );
const builderModes = new Set(manifest.builderModes?.map((mode) => mode.id));
for (const mode of ["page", "component", "business-component"])
  if (!builderModes.has(mode))
    errors.push(`page builder mode is missing: ${mode}`);
const componentMode = manifest.builderModes?.find(
  (mode) => mode.id === "component",
);
if (!componentMode?.contractSource || !componentMode?.reviewWorkbench)
  errors.push(
    "component builder mode must declare its review workbench contract",
  );
const reviewWorkbench = componentMode?.reviewWorkbench;
if (
  !reviewWorkbench?.candidateSources?.includes("external-agent-mcp") ||
  !reviewWorkbench?.candidateSources?.includes("external-agent-cli")
)
  errors.push("component review must declare MCP and CLI candidate sources");
const previewAdapterIds = new Set(
  reviewWorkbench?.previewAdapters?.map((adapter) => adapter.id),
);
if (!previewAdapterIds.has("button"))
  errors.push(
    "component review must declare the governed Button preview adapter",
  );
const buttonContract = componentsManifest.uiComponents?.find(
  (component) => component.name === "Button",
);
for (const control of reviewWorkbench?.controls ?? []) {
  const allowedValues =
    control.id === "variant"
      ? buttonContract?.variants
      : control.id === "size"
        ? buttonContract?.sizes
        : undefined;
  if (
    !control.id ||
    !control.name ||
    !control.values?.length ||
    !allowedValues ||
    control.values.some((value) => !allowedValues.includes(value))
  )
    errors.push(
      `component review has an invalid Button control: ${control.id}`,
    );
}
const reviewPropertyIds = new Set();
for (const property of reviewWorkbench?.runtimeProperties ?? []) {
  if (
    !property.id ||
    !property.name ||
    !["string", "enum", "boolean"].includes(property.type) ||
    typeof property.recommended !== "boolean" ||
    reviewPropertyIds.has(property.id)
  )
    errors.push(
      `component review has an invalid or duplicate runtime property: ${property.id ?? "unknown"}`,
    );
  reviewPropertyIds.add(property.id);
}
if (reviewPropertyIds.size === 0)
  errors.push("component review must declare runtime property candidates");
const checkIds = new Set(reviewWorkbench?.checks?.map((check) => check.id));
for (const check of ["contract", "tokens", "interaction", "visual"])
  if (!checkIds.has(check))
    errors.push(`component review governance check is missing: ${check}`);
const candidateIds = new Set();
for (const candidate of reviewWorkbench?.candidates ?? []) {
  if (
    !candidate.id ||
    !candidate.name ||
    !candidate.version ||
    !reviewWorkbench.candidateSources.includes(candidate.source) ||
    !previewAdapterIds.has(candidate.previewAdapter) ||
    !candidate.expectedOutputs?.length ||
    candidateIds.has(candidate.id)
  )
    errors.push(
      `component review has an invalid or duplicate candidate: ${candidate.id ?? "unknown"}`,
    );
  candidateIds.add(candidate.id);
}
const initialReview = reviewWorkbench?.initial;
const variantControl = reviewWorkbench?.controls?.find(
  (control) => control.id === "variant",
);
const sizeControl = reviewWorkbench?.controls?.find(
  (control) => control.id === "size",
);
if (
  !candidateIds.has(initialReview?.candidateId) ||
  !initialReview?.label ||
  !variantControl?.values?.includes(initialReview.variant) ||
  !sizeControl?.values?.includes(initialReview.size) ||
  !Array.isArray(initialReview.selectedProperties) ||
  initialReview.selectedProperties.some((id) => !reviewPropertyIds.has(id))
)
  errors.push("component review must declare a valid initial candidate draft");
for (const operation of [
  "selectCandidate",
  "setPreviewProp",
  "toggleRuntimeProperty",
  "createRevisionTask",
  "runGovernanceChecks",
  "approveCandidate",
])
  if (!reviewWorkbench?.operations?.includes(operation))
    errors.push(`component review operation is missing: ${operation}`);
const businessComponentMode = manifest.builderModes?.find(
  (mode) => mode.id === "business-component",
);
const foundationComponentMode = manifest.builderModes?.find(
  (mode) => mode.id === "component-create",
);
const foundationGroups =
  foundationComponentMode?.candidateGate?.foundationAssets;
const foundationDeliveryTargets = new Set(
  foundationComponentMode?.candidateGate?.deliveryTargets?.map(
    (target) => target.id,
  ),
);
if (
  foundationComponentMode?.candidateGate?.instructionEntry !== false ||
  !foundationDeliveryTargets.has("new") ||
  !foundationDeliveryTargets.has("existing") ||
  foundationComponentMode?.candidateGate?.deliveryTargets?.some(
    (target) => !target.name || !target.outcome || !target.storageKey,
  ) ||
  foundationComponentMode?.candidateGate?.existingComponentSource !==
    "docs/data/components.manifest.json#uiComponents"
)
  errors.push(
    "foundation builder must disable the duplicate instruction entry and declare governed delivery targets",
  );
const requiredFoundationKinds = [
  "layout",
  "container",
  "color",
  "spacing",
  "typography",
  "icon",
  "separator",
  "interaction",
];
for (const kind of requiredFoundationKinds) {
  const group = foundationGroups?.find((item) => item.id === kind);
  if (
    !group ||
    group.items?.length !== 1 ||
    group.items[0]?.kind !== kind ||
    group.items[0]?.name !== (kind === "typography" ? "文字" : group.name)
  )
    errors.push(
      `foundation builder must expose one generic ${kind} primitive configured through properties`,
    );
}
if (
  !businessComponentMode?.registry?.length ||
  !businessComponentMode.catalogSources?.length ||
  !businessComponentMode.contractSource
)
  errors.push(
    "business component builder mode must declare its governed registry and contract source",
  );
for (const source of businessComponentMode?.catalogSources ?? []) {
  const [file, pointer] = source.split("#");
  const catalog = pointer
    ?.split(".")
    .reduce((value, key) => value?.[key], componentsManifest);
  if (file !== "docs/data/components.manifest.json" || !Array.isArray(catalog))
    errors.push(`business component search catalog is invalid: ${source}`);
}
for (const mode of manifest.builderModes ?? []) {
  const [source] = mode.source?.split("#") ?? [];
  if (!source || !fs.existsSync(path.join(root, source)))
    errors.push(`builder mode source is missing: ${mode.id}`);
}
const operationNames = new Set(
  manifest.operationContract?.operations?.map((operation) => operation.op),
);
for (const operation of [
  "insertBlock",
  "removeBlock",
  "moveBlock",
  "setProp",
]) {
  if (!operationNames.has(operation))
    errors.push(`page builder operation contract is missing: ${operation}`);
}
const compositionOperationNames = new Set(
  manifest.componentCompositionOperationContract?.operations?.map(
    (operation) => operation.op,
  ),
);
for (const operation of [
  "addComponent",
  "addFoundation",
  "removeComponent",
  "moveComponent",
  "groupComponents",
  "ungroupComponents",
  "setCompositionLayout",
  "setComponentName",
  "setComponentProp",
  "exposeComponentProp",
  "renamePublicProp",
  "removePublicProp",
]) {
  if (!compositionOperationNames.has(operation))
    errors.push(
      `component composition operation contract is missing: ${operation}`,
    );
}
if (
  !Array.isArray(manifest.businessComponents) ||
  manifest.businessComponents.length === 0
)
  errors.push("business component builder must declare templates");
for (const component of manifest.businessComponents ?? []) {
  if (
    !component.id ||
    !component.name ||
    !component.source ||
    !component.layout?.id ||
    !component.layout?.slots?.length
  )
    errors.push(
      `invalid business component template: ${component.id ?? "unknown"}`,
    );
  const [source] = component.source?.split("#") ?? [];
  if (!source || !fs.existsSync(path.join(root, source)))
    errors.push(`business component source is missing: ${component.id}`);
  const componentIds = new Set(component.components?.map((item) => item.id));
  const componentNames = new Set(
    component.components?.map((item) =>
      item.id
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(""),
    ),
  );
  for (const registered of businessComponentMode?.registry ?? [])
    if (!componentNames.has(registered))
      errors.push(
        `${component.id} insertion registry has no reviewed component: ${registered}`,
      );
  const slotIds = new Set();
  for (const item of component.components ?? []) {
    const [itemSource] = item.source?.split("#") ?? [];
    if (
      !item.id ||
      !item.name ||
      !item.category ||
      !itemSource ||
      !fs.existsSync(path.join(root, itemSource))
    )
      errors.push(
        `${component.id} has an invalid component: ${item.id ?? "unknown"}`,
      );
    if (item.instance?.preset !== "default")
      errors.push(
        `${component.id}.${item.id} has no governed default instance`,
      );
    if (item.contract) {
      const [, pointer] = item.contract.source?.split("#") ?? [];
      const contract = pointer
        ?.split(".")
        .reduce((value, key) => value?.[key], playgroundManifest);
      if (!contract || !Array.isArray(contract.props) || !contract.initial)
        errors.push(
          `${component.id}.${item.id} has an invalid playground contract source`,
        );
      const contractKeys = new Set(
        contract?.props?.map((property) => property.key),
      );
      if (
        !item.contract.editableProps?.length ||
        item.contract.editableProps.some((key) => !contractKeys.has(key))
      )
        errors.push(
          `${component.id}.${item.id} exposes an undeclared playground property`,
        );
    }
  }
  for (const slot of component.layout?.slots ?? []) {
    if (!slot.id || !slot.name || !slot.accepts?.length || slotIds.has(slot.id))
      errors.push(
        `${component.id} has an invalid or duplicate slot: ${slot.id ?? "unknown"}`,
      );
    slotIds.add(slot.id);
    for (const accepted of slot.accepts ?? [])
      if (!componentIds.has(accepted))
        errors.push(
          `${component.id}.${slot.id} accepts undeclared component: ${accepted}`,
        );
  }
  const spacingValues = new Set(component.layout?.spacingValues);
  const directions = new Set(component.layout?.directions);
  const interactionModel = new Set(component.layout?.interactionModel);
  if (
    !["none", "xs", "sm", "md", "lg"].every((value) => spacingValues.has(value))
  )
    errors.push(`${component.id} must declare the governed spacing scale`);
  if (!["horizontal", "vertical"].every((value) => directions.has(value)))
    errors.push(
      `${component.id} must declare horizontal and vertical directions`,
    );
  for (const interaction of [
    "dragInsert",
    "canvasSelection",
    "layerTree",
    "autoLayout",
  ])
    if (!interactionModel.has(interaction))
      errors.push(
        `${component.id} interaction model is missing: ${interaction}`,
      );
  if (
    !Array.isArray(component.initial?.nodes) ||
    component.initial.nodes.length !== 0 ||
    !Array.isArray(component.initial?.publicProps) ||
    !component.initial.name ||
    !spacingValues.has(component.initial.margin) ||
    !spacingValues.has(component.initial.gap) ||
    !directions.has(component.initial.direction)
  )
    errors.push(`${component.id} must declare a valid blank initial draft`);
  const publishTargets = new Set(
    component.publishTargets?.map((target) => target.id),
  );
  if (
    !publishTargets.has("personal") ||
    !publishTargets.has("business") ||
    component.publishTargets?.some((target) => !target.name || !target.outcome)
  )
    errors.push(
      `${component.id} must declare personal and business publish targets`,
    );
  if (!Array.isArray(component.constraints) || component.constraints.length < 3)
    errors.push(`${component.id} must declare composition constraints`);
}
if (!Array.isArray(manifest.templates) || manifest.templates.length === 0)
  errors.push("page builder must declare templates");

for (const template of manifest.templates ?? []) {
  if (
    !template.id ||
    !template.name ||
    !template.status ||
    !template.source ||
    !template.archetype
  ) {
    errors.push(`incomplete template: ${JSON.stringify(template)}`);
    continue;
  }
  const [source] = template.source.split("#");
  if (!fs.existsSync(path.join(root, source)))
    errors.push(`${template.id} source is missing: ${source}`);
  if (!Array.isArray(template.frame) || template.frame.length === 0)
    errors.push(`${template.id} must declare a frame`);
  if (!Array.isArray(template.slots) || template.slots.length === 0)
    errors.push(`${template.id} must declare slots`);
  if (template.archetype === "blank") {
    const layoutIds = new Set(
      template.builder?.layouts?.map((layout) => layout.id),
    );
    const zoneIds = new Set(template.builder?.zones?.map((zone) => zone.id));
    const groupIds = new Set(
      template.builder?.libraryGroups?.map((group) => group.id),
    );
    if (!layoutIds.size || !zoneIds.size || !groupIds.size)
      errors.push(
        `${template.id} must declare layouts, zones and library groups`,
      );
    for (const layout of template.builder?.layouts ?? []) {
      if (!layout.name || !layout.frame || !layout.zones?.length)
        errors.push(`${template.id} has an invalid layout`);
      for (const zone of layout.zones ?? [])
        if (!zoneIds.has(zone))
          errors.push(
            `${template.id}.${layout.id} references undeclared zone: ${zone}`,
          );
    }
  }
  const slotIds = new Set();
  for (const slot of template.slots ?? []) {
    if (!slot.id || !slot.block || !Number.isInteger(slot.max) || slot.max < 1)
      errors.push(`${template.id} has an invalid slot`);
    if (slotIds.has(slot.id))
      errors.push(`${template.id} has duplicate slot id: ${slot.id}`);
    slotIds.add(slot.id);
    if (template.archetype === "blank") {
      const zoneIds = new Set(template.builder?.zones?.map((zone) => zone.id));
      const groupIds = new Set(
        template.builder?.libraryGroups?.map((group) => group.id),
      );
      if (!groupIds.has(slot.category))
        errors.push(
          `${template.id}.${slot.id} has an invalid library category`,
        );
      if (!slot.zones?.length || slot.zones.some((zone) => !zoneIds.has(zone)))
        errors.push(`${template.id}.${slot.id} has invalid zones`);
    }
  }
  const propertyIds = new Set();
  for (const property of template.properties ?? []) {
    if (!property.id || !property.type || !("default" in property))
      errors.push(`${template.id} has an invalid property`);
    if (propertyIds.has(property.id))
      errors.push(`${template.id} has duplicate property id: ${property.id}`);
    propertyIds.add(property.id);
    if (
      property.type === "enum" &&
      (!Array.isArray(property.values) ||
        property.values.length === 0 ||
        !property.values.includes(property.default))
    ) {
      errors.push(
        `${template.id}.${property.id} enum values/default are invalid`,
      );
    }
  }
  for (const preset of template.presets ?? []) {
    if (
      !preset.id ||
      !preset.name ||
      !Array.isArray(preset.blocks) ||
      !preset.properties
    )
      errors.push(`${template.id} has an invalid preset`);
    for (const block of preset.blocks ?? [])
      if (!slotIds.has(block))
        errors.push(
          `${template.id}.${preset.id} references undeclared slot: ${block}`,
        );
    for (const property of Object.keys(preset.properties ?? {}))
      if (!propertyIds.has(property))
        errors.push(
          `${template.id}.${preset.id} references undeclared property: ${property}`,
        );
    for (const slot of template.slots ?? [])
      if (slot.required && !preset.blocks?.includes(slot.id))
        errors.push(
          `${template.id}.${preset.id} omits required slot: ${slot.id}`,
        );
  }
  if (!Array.isArray(template.constraints) || template.constraints.length < 3)
    errors.push(`${template.id} must declare builder constraints`);
  if (!template.visualEvidence?.file || !template.visualEvidence?.testName)
    errors.push(`${template.id} must declare visual evidence`);
}

if (errors.length) {
  console.error("page builder check failed");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(
  `page builder check passed: ${manifest.templates.length} templates`,
);

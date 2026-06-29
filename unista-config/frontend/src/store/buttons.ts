import { computed, ref } from "vue";
import type { ButtonEntity } from "../types";
import { generateId, makeParam } from "../utils/helpers";
import { modules } from "./modules";

/**
 * Helper to generate a standardized list of parameters acting as buttons.
 */
const createParams = (prefix: string, count: number) => {
  return Array.from({ length: count }, (_, i) => {
    // Buttons visibility is typically toggled off by default, matching existing logic
    const param = makeParam(`${prefix} ${i + 1}`, i + 1);
    return param;
  });
};

/**
 * Factory to create a unified ButtonEntity linked either to 'UM' or a specific module.
 */
const createButtonEntity = (linkedTo: string, name: string): ButtonEntity => ({
  id: generateId(),
  linkedTo,
  name,
  ui: { showToggles: true, showMomentaries: true },
  toggleButtons: createParams("Toggle Button", 15),
  momentaryButtons: createParams("Momentary Button", 15),
});

/**
 * Persistent Master List.
 * We keep disabled configurations here to avoid data loss if a user temporarily disables a module.
 */
export const allButtons = ref<ButtonEntity[]>([createButtonEntity("UM", "UM")]);

/**
 * Reactive computed list formatted for the UI.
 * Automatically mirrors the Module Architecture.
 */
export const activeProcessButtons = computed(() => {
  const activeModIds = new Set(
    modules.value.filter((m) => m.enable).map((m) => m.id),
  );

  // 1. Check and generate missing configurations for newly enabled modules
  modules.value.forEach((m) => {
    if (m.enable && !allButtons.value.some((b) => b.linkedTo === m.id)) {
      allButtons.value.push(createButtonEntity(m.id, `EM${m.index}`));
    }
  });

  // 2. Synchronize names in case a module index was shifted up/down
  allButtons.value.forEach((b) => {
    if (b.linkedTo !== "UM") {
      const mod = modules.value.find((m) => m.id === b.linkedTo);
      if (mod) b.name = `EM${mod.index}`;
    }
  });

  // 3. Filter down strictly to the Base Unit (UM) and currently active modules
  const visible = allButtons.value.filter(
    (b) => b.linkedTo === "UM" || activeModIds.has(b.linkedTo),
  );

  // 4. Return sorted array: 'UM' consistently first, followed by EM configurations ordered by index
  return visible.sort((a, b) => {
    if (a.linkedTo === "UM") return -1;
    if (b.linkedTo === "UM") return 1;
    const modA = modules.value.find((m) => m.id === a.linkedTo);
    const modB = modules.value.find((m) => m.id === b.linkedTo);
    return (modA?.index || 0) - (modB?.index || 0);
  });
});

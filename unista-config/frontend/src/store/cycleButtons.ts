import { computed, ref } from "vue";
import type { CycleButtonEntity, Parameter } from "../types";
import { generateStepsFor } from "../utils/defaultEtapes";
import { generateId, makeParam } from "../utils/helpers";
import { modules } from "./modules";

/**
 * Creates 15 Cycle parameters. Injects the steps based on module index.
 */
const createCycleParams = (emIndex: number): Parameter[] => {
  return Array.from({ length: 15 }, (_, i) => {
    const num = i + 1;
    const param = makeParam(`Cycle ${num}`, num);

    // Explicitly set defaults to false
    param.actif = false;
    param.resetVisible = false;

    // Attach dynamic generated steps
    param.steps = generateStepsFor(emIndex, num);

    return param;
  });
};

const createCycleButtonEntity = (
  linkedTo: string,
  name: string,
  emIndex: number,
): CycleButtonEntity => ({
  id: generateId(),
  linkedTo,
  name,
  ui: { showCycles: true },
  cycles: createCycleParams(emIndex),
});

export const allCycleButtons = ref<CycleButtonEntity[]>([]);

export const activeCycleButtons = computed(() => {
  const activeModIds = new Set(
    modules.value.filter((m) => m.enable).map((m) => m.id),
  );

  // 1. Generate missing configurations
  modules.value.forEach((m) => {
    if (m.enable && !allCycleButtons.value.some((b) => b.linkedTo === m.id)) {
      allCycleButtons.value.push(
        createCycleButtonEntity(m.id, `EM${m.index}`, m.index),
      );
    }
  });

  // 2. Synchronize names
  allCycleButtons.value.forEach((b) => {
    const mod = modules.value.find((m) => m.id === b.linkedTo);
    if (mod) b.name = `EM${mod.index}`;
  });

  // 3. Filter down to active modules
  const visible = allCycleButtons.value.filter((b) =>
    activeModIds.has(b.linkedTo),
  );

  // 4. Return sorted
  return visible.sort((a, b) => {
    const modA = modules.value.find((m) => m.id === a.linkedTo);
    const modB = modules.value.find((m) => m.id === b.linkedTo);
    return (modA?.index || 0) - (modB?.index || 0);
  });
});

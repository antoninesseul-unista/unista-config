// filepath: src/core/stores.ts
import { computed, ref, toRef, watch } from "vue";
import { models } from "../../wailsjs/go/models";
import { toast } from "../composables/useToast";
import type {
  ConfigField,
  EquipmentDefinition,
  EquipmentInstance,
  PageDefinition,
} from "../config/equipment";
import { createCycleParams } from "./defaults";
import {
  generateId,
  makeCleanParams,
  makeModule,
  makeParam,
  reindex,
} from "./helpers";
import { appState } from "./state";
import { buildValidationCaches, listHasErrors } from "./validation";
import { equipmentRegistry, pageRegistry } from "./registry";

export type { ConfigField } from "../config/equipment";

// --- Modules ---

export const modules = toRef(appState, "modules");

export const addModuleAction = () => {
  if (modules.value.length >= 8) return;
  modules.value.push(makeModule(modules.value.length + 1, true));
  reindex(modules.value);
};

export const removeModule = (index: number) => {
  try {
    const name = modules.value[index]?.name;
    modules.value.splice(index, 1);
    reindex(modules.value);
    toast.success("Module deleted", {
      description: name ? `"${name}"` : undefined,
    });
  } catch (err) {
    console.error("Module removal failed:", err);
    toast.error("Failed to delete module.");
  }
};

export const syncModuleIndexes = () => reindex(modules.value);

export const getModuleErrors = computed(() => {
  const active = modules.value.filter((m) => m.enable);
  return modules.value.reduce(
    (acc, m) => {
      if (!m.enable) {
        acc[m.id] = false;
        return acc;
      }
      const isDup = active.some(
        (other) => other.id !== m.id && other.name === m.name,
      );
      acc[m.id] = !m.name || m.name.trim() === "" || isDup;
      return acc;
    },
    {} as Record<string, boolean>,
  );
});

export const getModuleErrorMessage = (m: models.MachineModule) => {
  if (!m.name || m.name.trim() === "") return "Name required";
  return "Name must be unique";
};

// --- Process buttons ---

const createButtonParams = (
  prefix: string,
  count: number,
): models.Parameter[] =>
  Array.from(
    { length: count },
    (_, i) => makeParam(`${prefix} ${i + 1}`, i + 1) as models.Parameter,
  );

const createButtonEntity = (
  linkedTo: string,
  name: string,
): models.ButtonEntity =>
  ({
    id: generateId(),
    linkedTo,
    name,
    ui: { showToggles: true, showMomentaries: true },
    toggleButtons: createButtonParams("Toggle Button", 15),
    momentaryButtons: createButtonParams("Momentary Button", 15),
  }) as models.ButtonEntity;

export const allButtons = toRef(appState, "buttons");

const syncProcessButtons = () => {
  modules.value.forEach((m) => {
    if (m.enable && !allButtons.value.some((b) => b.linkedTo === m.id)) {
      allButtons.value.push(createButtonEntity(m.id, `EM${m.index}`));
    }
  });

  allButtons.value.forEach((b) => {
    if (b.linkedTo !== "UM") {
      const mod = modules.value.find((m) => m.id === b.linkedTo);
      if (mod) b.name = `EM${mod.index}`;
    }
  });
};

watch(modules, syncProcessButtons, { deep: true, immediate: true });

export const activeProcessButtons = computed(() => {
  const activeModIds = new Set(
    modules.value.filter((m) => m.enable).map((m) => m.id),
  );
  const visible = allButtons.value.filter(
    (b) => b.linkedTo === "UM" || activeModIds.has(b.linkedTo),
  );

  return visible.sort((a, b) => {
    if (a.linkedTo === "UM") return -1;
    if (b.linkedTo === "UM") return 1;
    const modA = modules.value.find((m) => m.id === a.linkedTo);
    const modB = modules.value.find((m) => m.id === b.linkedTo);
    return (modA?.index || 0) - (modB?.index || 0);
  });
});

// --- Cycle buttons ---

const createCycleButtonEntity = (
  linkedTo: string,
  name: string,
  emIndex: number,
): models.CycleButtonEntity =>
  ({
    id: generateId(),
    linkedTo,
    name,
    ui: { showCycles: true },
    cycles: createCycleParams(emIndex),
  }) as models.CycleButtonEntity;

export const allCycleButtons = toRef(appState, "cycleButtons");

const syncCycleButtons = () => {
  modules.value.forEach((m) => {
    if (m.enable && !allCycleButtons.value.some((b) => b.linkedTo === m.id)) {
      allCycleButtons.value.push(
        createCycleButtonEntity(m.id, `EM${m.index}`, m.index),
      );
    }
  });

  allCycleButtons.value.forEach((b) => {
    const mod = modules.value.find((m) => m.id === b.linkedTo);
    if (mod) b.name = `EM${mod.index}`;
  });
};

watch(modules, syncCycleButtons, { deep: true, immediate: true });

export const activeCycleButtons = computed(() => {
  const activeModIds = new Set(
    modules.value.filter((m) => m.enable).map((m) => m.id),
  );
  const visible = allCycleButtons.value.filter((b) =>
    activeModIds.has(b.linkedTo),
  );

  return visible.sort((a, b) => {
    const modA = modules.value.find((m) => m.id === a.linkedTo);
    const modB = modules.value.find((m) => m.id === b.linkedTo);
    return (modA?.index || 0) - (modB?.index || 0);
  });
});

// --- Faults ---

export const safetyCategories = computed({
  get: () => appState.faultCategories.safety,
  set: (val) => {
    appState.faultCategories.safety = val;
  },
});

export const processCategories = computed({
  get: () => appState.faultCategories.process,
  set: (val) => {
    appState.faultCategories.process = val;
  },
});

export const equipmentCategories = computed({
  get: () => appState.faultCategories.equipment,
  set: (val) => {
    appState.faultCategories.equipment = val;
  },
});

export const faultGroups = computed<models.FaultGroup[]>(() => {
  const activeModIndexes = new Set(
    modules.value.filter((m) => m.enable).map((m) => m.index),
  );

  const activeProcessCats = appState.faultCategories.process.filter((cat) => {
    if (cat.name.startsWith("UM")) return true;
    const match = cat.name.match(/EM(\d+)/);
    if (match) return activeModIndexes.has(parseInt(match[1], 10));
    return false;
  });

  return [
    {
      id: "safety",
      name: "Global Safety & Security",
      categories: appState.faultCategories.safety,
    },
    {
      id: "process",
      name: "Machine & Process Faults",
      categories: activeProcessCats,
    },
    {
      id: "equipment",
      name: "Equipment Base Templates",
      categories: appState.faultCategories.equipment,
    },
  ] as models.FaultGroup[];
});

// --- Equipment stores ---

type EquipmentStore = ReturnType<typeof createEquipmentStore>;
type EquipmentStoresMap = Record<string, EquipmentStore>;

const equipmentStoreMap: EquipmentStoresMap = {};
const errorsByType = ref<Record<string, boolean>>({});

let refreshScheduled = false;

const refreshAllEquipmentErrors = async () => {
  const allEquipment = Object.values(
    appState.equipment,
  ).flat() as EquipmentInstance[];
  const robots = (appState.equipment.robot ?? []) as EquipmentInstance[];
  const workplaces = (appState.equipment.workplace ??
    []) as EquipmentInstance[];
  const next: Record<string, boolean> = {};

  for (const type of Object.keys(equipmentRegistry.value)) {
    const def = equipmentRegistry.value[type] as
      | EquipmentDefinition
      | undefined;
    const list = (appState.equipment[type] ?? []) as EquipmentInstance[];
    if (!def) {
      next[type] = false;
      continue;
    }
    const caches = await buildValidationCaches(list, def);
    next[type] = listHasErrors(
      list,
      def,
      caches,
      modules.value,
      robots,
      allEquipment,
      workplaces,
    );
  }

  errorsByType.value = next;
};

const scheduleRefreshAllEquipmentErrors = () => {
  if (refreshScheduled) return;
  refreshScheduled = true;
  queueMicrotask(() => {
    refreshScheduled = false;
    void refreshAllEquipmentErrors();
  });
};

watch(
  [() => appState.equipment, modules, equipmentRegistry],
  scheduleRefreshAllEquipmentErrors,
  {
    deep: true,
    immediate: true,
  },
);

const resolveDefaultValue = (field: ConfigField): any => {
  if (field.defaultValue !== undefined) return field.defaultValue;
  if (field.type === "boolean") return false;
  if (field.type === "number") return null;
  if (field.type === "text") return "";
  if (field.type === "select") return null;
  return null;
};

export function createEquipmentStore(type: string) {
  const getDefinition = () =>
    equipmentRegistry.value[type] as EquipmentDefinition;

  const createInstance = (index: number): EquipmentInstance => {
    const def = getDefinition();
    const instance = {
      id: generateId(),
      type,
      index,
      enable: true,
      emId: null,
      robotId: type === "workplace" ? null : undefined,
      name: `${def.prefix}${index}`,
      commentFr: "",
      commentEn: "",
      commentDe: "",
      commentEs: "",
      detail: "",
      reserve1: "",
      reserve2: "",
      cycleTime: def.allowsFastCycle ? 2 : 10,
      ui: {
        showProps: true,
        showConfiguration: true,
        showController: false,
        showProcess: false,
        showParams: false,
      },
      parameters: (def.parameterFields || []).map(
        (field: ConfigField, i: number) => {
          const defaultValue = resolveDefaultValue(field);
          return {
            id: i + 1,
            name: field.label,
            actif: field.type === "boolean" ? (defaultValue as boolean) : true,
            commentFr: "",
            commentEn: "",
            commentDe: "",
            commentEs: "",
            detail: "",
            reserve1: "",
            reserve2: "",
            robotMask: "",
            robotVarIndex: {},
            value: defaultValue,
          } as models.Parameter;
        },
      ),
      ...Object.fromEntries(
        [
          ...(def.configFields || []),
          ...(def.controllerFields || []),
          ...(def.processFields || []),
        ].map((field: ConfigField) => [
          field.field,
          resolveDefaultValue(field),
        ]),
      ),
    } as unknown as EquipmentInstance;

    return instance;
  };

  const list = computed({
    get: () => appState.equipment[type] ?? [],
    set: (val) => {
      appState.equipment[type] = val;
    },
  });

  const addAction = (): void => {
    if (!appState.equipment[type]) appState.equipment[type] = [];
    appState.equipment[type].push(
      createInstance(appState.equipment[type].length + 1),
    );
    reindex(appState.equipment[type]);
  };

  const removeAction = (index: number): void => {
    try {
      const item = appState.equipment[type][index];
      const label = item?.name ?? getDefinition().label;
      appState.equipment[type].splice(index, 1);
      reindex(appState.equipment[type]);
      toast.success("Item deleted", { description: `"${label}"` });
    } catch (err) {
      console.error("Equipment removal failed:", err);
      toast.error("Failed to delete item.");
    }
  };

  const syncIndexes = (): void => reindex(appState.equipment[type]);

  const hasErrors = computed(() => errorsByType.value[type] ?? false);

  return {
    get definition(): EquipmentDefinition {
      return getDefinition();
    },
    list,
    addAction,
    removeAction,
    syncIndexes,
    hasErrors,
  };
}

export function initEquipmentStores(): void {
  for (const key of Object.keys(equipmentStoreMap)) {
    delete equipmentStoreMap[key];
  }
  for (const key of Object.keys(equipmentRegistry.value)) {
    equipmentStoreMap[key] = createEquipmentStore(key);
  }
}

export const equipmentStores = new Proxy({} as EquipmentStoresMap, {
  get(_target, prop: string) {
    return equipmentStoreMap[prop];
  },
});

// --- Page stores ---

type PageStore = ReturnType<typeof createPageStore>;
type PageStoresMap = Record<string, PageStore>;

const pageStoreMap: PageStoresMap = {};

export function createPageStore(type: string) {
  const getDefinition = () => pageRegistry.value[type] as PageDefinition;

  // Les pages singletons récupèrent directement leur label au lieu de l'index dynamique
  const isSingleton = ["process", "setting", "info"].includes(type);

  const createInstance = (index: number, open = false): models.MachinePage =>
    ({
      id: generateId(),
      index,
      enable: true,
      isEM: false,
      name: isSingleton
        ? getDefinition().label
        : `${getDefinition().prefix}${index}`,
      commentFr: "",
      commentEn: "",
      commentDe: "",
      commentEs: "",
      detail: "",
      reserve1: "",
      reserve2: "",
      ui: {
        showProps: open,
        showBools: false,
        showInts: false,
        showReals: false,
        showStrings: false,
      },
      paramBools: makeCleanParams("Bool", 16),
      paramInts: makeCleanParams("Int", 16),
      paramReals: makeCleanParams("Real", 16),
      paramStrings: makeCleanParams("String", 16),
    }) as models.MachinePage;

  const list = computed({
    get: () => appState.pages[type] ?? [],
    set: (val) => {
      appState.pages[type] = val;
    },
  });

  const addAction = () => {
    const def = getDefinition();
    if (!appState.pages[type]) appState.pages[type] = [];
    if (appState.pages[type].length >= def.maxSlots) return;
    appState.pages[type].push(
      createInstance(appState.pages[type].length + 1, true),
    );
    reindex(appState.pages[type]);
  };

  const removeAction = (index: number) => {
    try {
      const item = appState.pages[type][index];
      const label = item?.name ?? getDefinition().label;
      appState.pages[type].splice(index, 1);
      reindex(appState.pages[type]);
      toast.success("Item deleted", { description: `"${label}"` });
    } catch (err) {
      console.error("Page removal failed:", err);
      toast.error("Failed to delete item.");
    }
  };

  const syncIndexes = () => reindex(appState.pages[type]);

  const getErrors = computed(() => {
    const items = appState.pages[type] ?? [];
    const activeItems = items.filter((p) => p.enable);
    return items.reduce(
      (acc, item) => {
        if (!item.enable) {
          acc[item.id] = false;
          return acc;
        }
        const isEmpty = !item.name || item.name.trim() === "";
        const isDuplicate = activeItems.some(
          (p) => p.id !== item.id && p.name === item.name,
        );
        acc[item.id] = isEmpty || isDuplicate;
        return acc;
      },
      {} as Record<string, boolean>,
    );
  });

  const getErrorMessage = (item: models.MachinePage): string => {
    if (!item.name || item.name.trim() === "") return "Name required";
    return "Name must be unique";
  };

  const hasErrors = computed(() =>
    Object.values(getErrors.value).some((v) => v),
  );

  return {
    get definition(): PageDefinition {
      return getDefinition();
    },
    list,
    addAction,
    removeAction,
    syncIndexes,
    getErrors,
    getErrorMessage,
    hasErrors,
  };
}

export function initPageStores(): void {
  for (const key of Object.keys(pageStoreMap)) {
    delete pageStoreMap[key];
  }
  for (const key of Object.keys(pageRegistry.value)) {
    pageStoreMap[key] = createPageStore(key);
  }

  // Force automatic and silent creation of the single instance if the array is empty
  const singletons = ["process", "setting", "info"];
  for (const key of singletons) {
    if (pageRegistry.value[key]) {
      if (!appState.pages[key]) {
        appState.pages[key] = [];
      }

      if (appState.pages[key].length === 0) {
        // If empty, create the page with the correct name
        pageStoreMap[key].addAction();
      } else {
        // If an old page already exists (e.g., PRC1), force its renaming
        // with the official label (e.g., Process, Setting, Info) to fix legacy data
        appState.pages[key][0].name = pageRegistry.value[key].label;
      }
    }
  }
}

export const pageStores = new Proxy({} as PageStoresMap, {
  get(_target, prop: string) {
    return pageStoreMap[prop];
  },
});

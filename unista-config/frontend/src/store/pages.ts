import { computed, reactive } from "vue";
import { PAGE_REGISTRY } from "../config/pages";
import type { MachinePage } from "../types";
import { generateId, makeParams, reindex } from "../utils/helpers";

/**
 * Global state for all dynamic pages.
 */
const pagesState = reactive<Record<string, MachinePage[]>>({
  product: [],
  process: [],
  setting: [],
  info: [],
});

/**
 * Internal helper to create parameters with clean default names.
 */
const makeCleanParams = (prefix: string, count = 16) => {
  return makeParams(prefix, count).map((p, i) => ({
    ...p,
    name: `${prefix} ${i + 1}`,
  }));
};

/**
 * Factory function to create a store for a specific page type.
 */
export function createPageStore(type: keyof typeof PAGE_REGISTRY) {
  const definition = PAGE_REGISTRY[type];

  const createInstance = (index: number, open = false): MachinePage => ({
    id: generateId(),
    index,
    enable: true,
    isEM: false, // Added to satisfy MachinePage interface
    name: `${definition.prefix}${index}`,
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
    // Added the missing parameter arrays using your helper function
    paramBools: makeCleanParams("Bool", 16),
    paramInts: makeCleanParams("Int", 16),
    paramReals: makeCleanParams("Real", 16),
    paramStrings: makeCleanParams("String", 16),
  });

  const list = computed({
    get: () => pagesState[type],
    set: (val) => {
      pagesState[type] = val;
    },
  });

  const addAction = () => {
    if (pagesState[type].length >= definition.maxSlots) return;
    pagesState[type].push(createInstance(pagesState[type].length + 1, true));
    reindex(pagesState[type]);
  };

  const removeAction = (index: number) => {
    if (!confirm(`Remove this ${definition.label}?`)) return;
    pagesState[type].splice(index, 1);
    reindex(pagesState[type]);
  };

  const syncIndexes = () => reindex(pagesState[type]);

  /**
   * Validation logic for the entire list.
   */
  const getErrors = computed(() => {
    const items = pagesState[type];
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

  /**
   * Returns a specific error message based on the item state.
   */
  const getErrorMessage = (item: MachinePage): string => {
    if (!item.name || item.name.trim() === "") return "Name required";
    return "Name must be unique";
  };

  const hasErrors = computed(() =>
    Object.values(getErrors.value).some((v) => v),
  );

  return {
    definition,
    list,
    addAction,
    removeAction,
    syncIndexes,
    getErrors,
    getErrorMessage,
    hasErrors,
  };
}

export const pageStores = {
  product: createPageStore("product"),
  process: createPageStore("process"),
  setting: createPageStore("setting"),
  info: createPageStore("info"),
};

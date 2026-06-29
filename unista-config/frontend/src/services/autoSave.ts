import { watch } from "vue";
import { PersistenceService } from "./persistenceService";

// 1. Core Stores
import { modules } from "../store/modules";
import { equipmentStores } from "../store/equipment";
import { allButtons } from "../store/buttons";
import { allCycleButtons } from "../store/cycleButtons";
import { counterGroups } from "../store/counters";
import { messageBoxes } from "../store/messageBox";
import { pageStores } from "../store/pages";

// 2. Newly added stores
import { faultTypes, architectureLimits } from "../store/systemConstants";
import { generalConfigState } from "../store/generalConfig";
import { translationsState } from "../store/translations";
import { cfr21SettingsState } from "../store/cfr21";
import { rolesState, permissionMatrixState } from "../store/roles";

/**
 * Simple debounce utility to prevent function spamming.
 * Delays the execution of the function until 'delay' ms have passed.
 */
const debounce = (fn: Function, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Initializes the global watcher for auto-saving.
 * It listens to all stores deeply but only triggers the backend save
 * after 1.5 seconds of user inactivity.
 */
export const initAutoSave = () => {
  // 1. Create a debounced save function (1500ms delay)
  const debouncedSave = debounce(async () => {
    try {
      await PersistenceService.saveAll();
      console.log("[AutoSave] State successfully persisted to disk.");
    } catch (error) {
      console.error("[AutoSave] Failed to persist state:", error);
    }
  }, 1500);

  // 2. Extract reactive targets from complex store structures
  const equipmentTargets = Object.values(equipmentStores).map(
    (store) => store.list,
  );
  const pageTargets = Object.values(pageStores).map((store) => store.list);

  // 3. Setup the global deep watcher covering EVERY store
  watch(
    [
      // Core
      modules,
      allButtons,
      allCycleButtons,
      counterGroups,
      messageBoxes,
      ...equipmentTargets,
      ...pageTargets,

      // New Configs
      faultTypes,
      architectureLimits,
      generalConfigState,
      translationsState,
      cfr21SettingsState,
      rolesState,
      permissionMatrixState,
    ],
    () => {
      // This triggers on every reactivity change, but disk write
      // is debounced to only happen when the user stops interacting.
      debouncedSave();
    },
    { deep: true },
  );
};

import { appState, hydrateAppState, serializeAppState } from "./state";
import { equipmentStores, pageStores } from "./stores";

export {
  appState,
  hydrateAppState,
  replaceAppState,
  serializeAppState,
  cfr21SettingsState,
  counterGroups,
  generalConfigState,
  messageBoxes,
  rolesState,
  permissionMatrixState,
  faultTypes,
  architectureLimits,
  translationsState,
  type TranslationRow,
  type FaultType,
  type ArchitectureLimit,
} from "./state";
export {
  modules,
  addModuleAction,
  removeModule,
  syncModuleIndexes,
  getModuleErrors,
  getModuleErrorMessage,
  activeProcessButtons,
  activeCycleButtons,
  faultGroups,
  safetyCategories,
  processCategories,
  equipmentCategories,
  equipmentStores,
  createEquipmentStore,
  pageStores,
  initEquipmentStores,
  initPageStores,
} from "./stores";
export {
  equipmentRegistry,
  pageRegistry,
  equipmentFieldSections,
  initRegistries,
} from "./registry";
export { CalculationService, ExportService, GenerationService, PersistenceService } from "./wails";
export { toast } from "../composables/useToast";
export { initAutoSave, initCloseHandler } from "./bootstrap";
export { countActive } from "./helpers";

export function useConfigStore() {
  return {
    state: appState,
    equipment: equipmentStores,
    pages: pageStores,
    serialize: serializeAppState,
    hydrate: hydrateAppState,
  };
}

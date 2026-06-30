/**
 * Single source of truth for all application state.
 * Mirrors models.AppData from the Go backend.
 */
import { reactive, toRef } from "vue";
import { models } from "../../wailsjs/go/models";
import type { EquipmentInstance } from "../config/equipment";
import {
  createDefaultArchitectureLimits,
  createDefaultButtons,
  createDefaultCfr21,
  createDefaultCounters,
  createDefaultCycleButtons,
  createDefaultEquipment,
  createDefaultEquipmentCategories,
  createDefaultFaultTypes,
  createDefaultGeneralConfig,
  createDefaultMessageBoxes,
  createDefaultModules,
  createDefaultPages,
  createDefaultPermissionMatrix,
  createDefaultProcessCategories,
  createDefaultRolesList,
  createDefaultSafetyCategories,
  createDefaultTranslations,
  type ArchitectureLimitSeed,
  type FaultTypeSeed,
  type TranslationRow,
} from "./defaults";
import { equipmentRegistry, pageRegistry } from "./registry";

export type { FaultTypeSeed as FaultType, ArchitectureLimitSeed as ArchitectureLimit } from "./defaults";
export type { TranslationRow };

export const CONFIG_SCHEMA_VERSION = 1;

export interface AppState {
  modules: models.MachineModule[];
  equipment: Record<string, EquipmentInstance[]>;
  pages: Record<string, models.MachinePage[]>;
  buttons: models.ButtonEntity[];
  cycleButtons: models.CycleButtonEntity[];
  counters: models.CounterGroup[];
  messageBoxes: models.MessageBoxEntity[];
  faultCategories: {
    safety: models.FaultCategory[];
    process: models.FaultCategory[];
    equipment: models.FaultCategory[];
  };
  systemConstants: {
    faultTypes: FaultTypeSeed[];
    architectureLimits: ArchitectureLimitSeed[];
  };
  generalConfig: ReturnType<typeof createDefaultGeneralConfig>;
  translations: TranslationRow[];
  cfr21: ReturnType<typeof createDefaultCfr21>;
  roles: {
    rolesList: ReturnType<typeof createDefaultRolesList>;
    permissionMatrix: ReturnType<typeof createDefaultPermissionMatrix>;
  };
}

export function createDefaultAppState(): AppState {
  return {
    modules: createDefaultModules(),
    equipment: createDefaultEquipment(),
    pages: createDefaultPages(),
    buttons: createDefaultButtons(),
    cycleButtons: createDefaultCycleButtons(),
    counters: createDefaultCounters(),
    messageBoxes: createDefaultMessageBoxes(),
    faultCategories: {
      safety: createDefaultSafetyCategories(),
      process: createDefaultProcessCategories(),
      equipment: createDefaultEquipmentCategories(),
    },
    systemConstants: {
      faultTypes: createDefaultFaultTypes(),
      architectureLimits: createDefaultArchitectureLimits(),
    },
    generalConfig: createDefaultGeneralConfig(),
    translations: createDefaultTranslations(),
    cfr21: createDefaultCfr21(),
    roles: {
      rolesList: createDefaultRolesList(),
      permissionMatrix: createDefaultPermissionMatrix(),
    },
  };
}

export const appState = reactive<AppState>(createDefaultAppState());

export const cfr21SettingsState = toRef(appState, "cfr21");
export const counterGroups = toRef(appState, "counters");
export const generalConfigState = toRef(appState, "generalConfig");
export const messageBoxes = toRef(appState, "messageBoxes");
export const rolesState = toRef(appState.roles, "rolesList");
export const permissionMatrixState = toRef(appState.roles, "permissionMatrix");
export const faultTypes = toRef(appState.systemConstants, "faultTypes");
export const architectureLimits = toRef(appState.systemConstants, "architectureLimits");
export const translationsState = toRef(appState, "translations");

export function serializeAppState(): models.AppData {
  return {
    schemaVersion: CONFIG_SCHEMA_VERSION,
    modules: appState.modules,
    equipment: appState.equipment as Record<string, Array<Record<string, unknown>>>,
    pages: appState.pages,
    buttons: appState.buttons,
    cycleButtons: appState.cycleButtons,
    counters: appState.counters,
    messageBoxes: appState.messageBoxes,
    faults: {
      safety: {
        id: "safety",
        name: "Global Safety & Security",
        categories: appState.faultCategories.safety,
      },
      process: {
        id: "process",
        name: "Machine & Process Faults",
        categories: appState.faultCategories.process,
      },
      equipment: {
        id: "equipment",
        name: "Equipment Base Templates",
        categories: appState.faultCategories.equipment,
      },
    },
    systemConstants: {
      faultTypes: appState.systemConstants.faultTypes,
      architectureLimits: appState.systemConstants.architectureLimits,
    },
    generalConfig: appState.generalConfig,
    translations: appState.translations,
    cfr21: appState.cfr21,
    roles: {
      rolesList: appState.roles.rolesList,
      permissionMatrix: appState.roles.permissionMatrix,
    },
  } as unknown as models.AppData;
}

function migrateEquipmentData(
  equipment: Record<string, EquipmentInstance[]>,
): Record<string, EquipmentInstance[]> {
  const rawEquipment = { ...equipment };
  if (rawEquipment.robotJob) {
    const legacy = rawEquipment.robotJob.map((eq) => ({ ...eq, type: "workplace" }));
    rawEquipment.workplace = rawEquipment.workplace
      ? [...rawEquipment.workplace, ...legacy]
      : legacy;
    delete rawEquipment.robotJob;
  }
  for (const key of Object.keys(rawEquipment)) {
    rawEquipment[key] = rawEquipment[key].map((eq) =>
      eq.type === "robotJob" ? ({ ...eq, type: "workplace" } as EquipmentInstance) : eq,
    );
  }
  return rawEquipment;
}

function replaceRecordInPlace<T>(
  target: Record<string, T>,
  source: Record<string, T>,
  registryKeys: string[],
  emptyValue: T,
): void {
  for (const key of registryKeys) {
    target[key] = source[key] ?? emptyValue;
  }
  for (const key of Object.keys(source)) {
    if (!(key in target)) {
      target[key] = source[key];
    }
  }
  for (const key of Object.keys(target)) {
    if (!registryKeys.includes(key) && !(key in source)) {
      delete target[key];
    }
  }
}

function replaceObjectInPlace<T extends Record<string, unknown>>(
  target: T,
  defaults: T,
  source: Partial<T>,
): void {
  for (const key of Object.keys(target)) {
    delete target[key];
  }
  Object.assign(target, defaults, source);
}

function applyAppData(data: models.AppData, mode: "merge" | "replace"): void {
  const replace = mode === "replace";

  if (replace || data.modules?.length) {
    appState.modules = (data.modules ?? []) as models.MachineModule[];
  }

  if (data.equipment) {
    const migrated = migrateEquipmentData(data.equipment as Record<string, EquipmentInstance[]>);
    if (replace) {
      replaceRecordInPlace(
        appState.equipment,
        migrated,
        Object.keys(equipmentRegistry.value),
        [],
      );
    } else {
      const equipmentKeys = new Set([
        ...Object.keys(equipmentRegistry.value),
        ...Object.keys(migrated),
      ]);
      for (const key of equipmentKeys) {
        if (migrated[key]) {
          appState.equipment[key] = migrated[key];
        }
      }
    }
  } else if (replace) {
    replaceRecordInPlace(appState.equipment, {}, Object.keys(equipmentRegistry.value), []);
  }

  if (data.pages) {
    if (replace) {
      replaceRecordInPlace(
        appState.pages,
        data.pages,
        Object.keys(pageRegistry.value),
        [],
      );
    } else {
      const pageKeys = new Set([...Object.keys(pageRegistry.value), ...Object.keys(data.pages)]);
      for (const key of pageKeys) {
        if (data.pages[key]) {
          appState.pages[key] = data.pages[key];
        }
      }
    }
  } else if (replace) {
    replaceRecordInPlace(appState.pages, {}, Object.keys(pageRegistry.value), []);
  }

  if (replace || data.buttons?.length) {
    appState.buttons = data.buttons ?? [];
  }
  if (replace || data.cycleButtons?.length) {
    appState.cycleButtons = data.cycleButtons ?? [];
  }
  if (replace || data.counters?.length) {
    appState.counters = data.counters ?? [];
  }
  if (replace || data.messageBoxes?.length) {
    appState.messageBoxes = data.messageBoxes ?? [];
  }

  if (data.faults) {
    if (replace) {
      appState.faultCategories.safety = data.faults.safety?.categories ?? [];
      appState.faultCategories.process = data.faults.process?.categories ?? [];
      appState.faultCategories.equipment = data.faults.equipment?.categories ?? [];
    } else {
      if (data.faults.safety?.categories) {
        appState.faultCategories.safety = data.faults.safety.categories;
      }
      if (data.faults.process?.categories) {
        appState.faultCategories.process = data.faults.process.categories;
      }
      if (data.faults.equipment?.categories) {
        appState.faultCategories.equipment = data.faults.equipment.categories;
      }
    }
  } else if (replace) {
    appState.faultCategories.safety = [];
    appState.faultCategories.process = [];
    appState.faultCategories.equipment = [];
  }

  if (data.systemConstants) {
    if (replace || data.systemConstants.faultTypes) {
      appState.systemConstants.faultTypes =
        (data.systemConstants.faultTypes as FaultTypeSeed[]) ?? [];
    }
    if (replace || data.systemConstants.architectureLimits) {
      appState.systemConstants.architectureLimits =
        (data.systemConstants.architectureLimits as ArchitectureLimitSeed[]) ?? [];
    }
  }

  if (data.generalConfig) {
    if (replace) {
      replaceObjectInPlace(
        appState.generalConfig as Record<string, unknown>,
        createDefaultGeneralConfig() as Record<string, unknown>,
        data.generalConfig as Record<string, unknown>,
      );
    } else {
      Object.assign(appState.generalConfig, data.generalConfig);
    }
  }

  if (replace || data.translations?.length) {
    appState.translations = (data.translations ?? []) as TranslationRow[];
  }

  if (data.cfr21) {
    if (replace) {
      replaceObjectInPlace(
        appState.cfr21 as Record<string, unknown>,
        createDefaultCfr21() as Record<string, unknown>,
        data.cfr21 as Record<string, unknown>,
      );
    } else {
      Object.assign(appState.cfr21, data.cfr21);
    }
  }

  if (data.roles) {
    if (replace || data.roles.rolesList) {
      appState.roles.rolesList = data.roles.rolesList ?? [];
    }
    if (replace || data.roles.permissionMatrix) {
      appState.roles.permissionMatrix = data.roles.permissionMatrix ?? [];
    }
  }
}

export function hydrateAppState(data: models.AppData): void {
  applyAppData(data, "merge");
}

/** Full state replacement for configuration import. */
export function replaceAppState(data: models.AppData): void {
  applyAppData(data, "replace");
}

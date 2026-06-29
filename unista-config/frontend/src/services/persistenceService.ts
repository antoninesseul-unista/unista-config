import { LoadData, SaveData } from "../../wailsjs/go/backend/App";

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

export const PersistenceService = {
  /**
   * Loads data from the Go backend and safely hydrates the Vue stores.
   * It strictly checks if data exists before overriding the default states.
   */
  async init() {
    try {
      const data = await LoadData();
      if (!data) return;

      // Hydrate flat arrays/objects
      if (data.modules && data.modules.length > 0)
        modules.value = data.modules as any;
      if (data.buttons && data.buttons.length > 0)
        allButtons.value = data.buttons as any;
      if (data.cycleButtons && data.cycleButtons.length > 0)
        allCycleButtons.value = data.cycleButtons as any;
      if (data.counters && data.counters.length > 0)
        counterGroups.value = data.counters as any;
      if (data.messageBoxes && data.messageBoxes.length > 0)
        messageBoxes.value = data.messageBoxes as any;

      // Hydrate dynamic reactive maps (Equipment & Pages)
      if (data.equipment) {
        Object.entries(data.equipment).forEach(([k, v]) => {
          if (equipmentStores[k as keyof typeof equipmentStores]) {
            equipmentStores[k as keyof typeof equipmentStores].list.value =
              v as any;
          }
        });
      }

      if (data.pages) {
        Object.entries(data.pages).forEach(([k, v]) => {
          if (pageStores[k as keyof typeof pageStores]) {
            pageStores[k as keyof typeof pageStores].list.value = v as any;
          }
        });
      }

      // Hydrate System Constants (Safely preventing undefined overrides)
      if (data.systemConstants) {
        if (
          data.systemConstants.faultTypes &&
          data.systemConstants.faultTypes.length > 0
        ) {
          faultTypes.value = data.systemConstants.faultTypes as any;
        }
        if (
          data.systemConstants.architectureLimits &&
          data.systemConstants.architectureLimits.length > 0
        ) {
          architectureLimits.value = data.systemConstants
            .architectureLimits as any;
        }
      }

      // Hydrate General Config & Translations
      if (data.generalConfig) {
        Object.assign(generalConfigState, data.generalConfig);
      }
      if (data.translations && data.translations.length > 0) {
        translationsState.value = data.translations as any;
      }

      // Hydrate CFR21 & Roles
      if (data.cfr21) {
        Object.assign(cfr21SettingsState, data.cfr21);
      }
      if (data.roles) {
        if (data.roles.rolesList && data.roles.rolesList.length > 0) {
          rolesState.value = data.roles.rolesList as any;
        }
        if (
          data.roles.permissionMatrix &&
          data.roles.permissionMatrix.length > 0
        ) {
          permissionMatrixState.value = data.roles.permissionMatrix as any;
        }
      }

      console.log("[Persistence] App data hydrated successfully.");
    } catch (e) {
      console.error("[Persistence] Failed to load app data:", e);
    }
  },

  /**
   * Collects all reactive states and sends them to the Go backend for disk writing.
   */
  async saveAll() {
    const dataToSave = {
      // Core
      modules: modules.value,
      equipment: Object.fromEntries(
        Object.entries(equipmentStores).map(([k, s]) => [k, s.list.value]),
      ),
      buttons: allButtons.value,
      cycleButtons: allCycleButtons.value,
      counters: counterGroups.value,
      messageBoxes: messageBoxes.value,
      pages: Object.fromEntries(
        Object.entries(pageStores).map(([k, s]) => [k, s.list.value]),
      ),

      // New configurations
      systemConstants: {
        faultTypes: faultTypes.value,
        architectureLimits: architectureLimits.value,
      },
      generalConfig: generalConfigState,
      translations: translationsState.value,
      cfr21: cfr21SettingsState,
      roles: {
        rolesList: rolesState.value,
        permissionMatrix: permissionMatrixState.value,
      },
    };

    try {
      await SaveData(dataToSave as any);
    } catch (e) {
      console.error("[Persistence] Failed to save app data:", e);
    }
  },
};

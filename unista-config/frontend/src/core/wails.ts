import * as GoStorage from "../../wailsjs/go/services/StorageService";
import { LoadData, SaveData } from "../../wailsjs/go/services/StorageService";
import { models } from "../../wailsjs/go/models";
import { hydrateAppState, replaceAppState, serializeAppState } from "./state";
import {
  GenerateSTFiles,
  AutoLoadHardware,
} from "../../wailsjs/go/backend/App";

/**
 * GenerationService handles the ST file generation payload.
 */
export const GenerationService = {
  async generate(): Promise<"generated" | "cancelled"> {
    try {
      const data = serializeAppState();
      await GenerateSTFiles(data);

      return "generated";
    } catch (e) {
      console.error("[Generation] Failed:", e);
      throw e;
    }
  },
};

/**
 * PersistenceService handles disk operations safely.
 */
export const PersistenceService = {
  /**
   * Initializes the application state from disk.
   * @returns true if initialization succeeded (or file didn't exist yet), false if the file is corrupted.
   */
  async init(): Promise<boolean> {
    try {
      const data = await LoadData();

      // If data is null, the file doesn't exist yet. We can safely start with defaults.
      if (!data) {
        console.log("[Persistence] No existing data found. Starting fresh.");
        return true;
      }

      hydrateAppState(data);
      console.log("[Persistence] App data hydrated successfully.");
      return true;
    } catch (e) {
      console.error("[Persistence] Failed to load app data:", e);
      return false; // Critical failure (corrupted JSON)
    }
  },

  async saveAll() {
    try {
      await SaveData(serializeAppState());
    } catch (e) {
      console.error("[Persistence] Failed to save app data:", e);
    }
  },

  async exportConfig(): Promise<"exported" | "cancelled"> {
    await this.saveAll();
    const json = JSON.stringify(serializeAppState(), null, 2);
    const path = await GoStorage.ExportConfigToFile(json);
    return path ? "exported" : "cancelled";
  },

  async importConfig(): Promise<"imported" | "cancelled"> {
    const json = await GoStorage.ImportConfigFromFile();
    if (!json) return "cancelled";

    const data = JSON.parse(json) as models.AppData;
    replaceAppState(data);
    await this.saveAll();
    return "imported";
  },
};

/**
 * HardwareService handles auto-loading of the B&R physical hardware tree.
 */
export const HardwareService = {
  async autoLoadHardware(): Promise<models.HardwareModule[] | null> {
    try {
      const modules = await AutoLoadHardware();
      return modules || null;
    } catch (e) {
      console.error("[HardwareService] Auto-load hardware failed:", e);
      return null;
    }
  },
};

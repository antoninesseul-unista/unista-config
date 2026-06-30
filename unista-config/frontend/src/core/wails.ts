import * as GoCalc from "../../wailsjs/go/services/CalculationService";
import * as GoExport from "../../wailsjs/go/services/ExportService";
import * as GoStorage from "../../wailsjs/go/services/StorageService";
import { LoadData, SaveData } from "../../wailsjs/go/services/StorageService";
import { models } from "../../wailsjs/go/models";
import { hydrateAppState, replaceAppState, serializeAppState } from "./state";

export const CalculationService = {
  parseRobotMask: (mask: string | undefined | null) => GoCalc.ParseRobotMask(mask || "0"),
  isRobotSelected: (mask: number, robotIndex: number) => GoCalc.IsRobotSelected(mask, robotIndex),
  toggleRobotMask: (mask: number, robotIndex: number) => GoCalc.ToggleRobotMask(mask, robotIndex),
  sanitizeVariableName: (raw: string) => GoCalc.SanitizeVariableName(raw),
  isValidIPAddress: (ip: string) => GoCalc.IsValidIPAddress(ip),
  hasRobotVarIndexError: (param: models.Parameter, allParameters: models.Parameter[]) =>
    GoCalc.HasRobotVarIndexError(param, allParameters),
  validateRobotVarIndexForRobot: (
    param: models.Parameter,
    robotIndex: number,
    siblings: models.Parameter[],
  ) => GoCalc.ValidateRobotVarIndexForRobot(param, robotIndex, siblings),
  isConfigFieldVisible: (
    equipmentType: string,
    equipment: Record<string, unknown>,
    field: string,
  ) => GoCalc.IsConfigFieldVisible(equipmentType, equipment, field),
};

export const ExportService = {
  exportEVToST: (targetPath: string, evs: models.Electrovalve[]) =>
    GoExport.ExportEVToST(targetPath, evs),
};

/** ST file generation — implementation to be added later. */
export const GenerationService = {
  async generate(): Promise<"generated" | "cancelled"> {
    // TODO: generate ST files from current configuration
    return "generated";
  },
};

export const PersistenceService = {
  async init() {
    try {
      const data = await LoadData();
      if (!data) return;
      hydrateAppState(data);
      console.log("[Persistence] App data hydrated successfully.");
    } catch (e) {
      console.error("[Persistence] Failed to load app data:", e);
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

    // Plain JSON parse — AppData.createFrom() wraps page arrays with `new Array(...)`
    // which nests them ([[...]]) and breaks SaveData on the Go side.
    const data = JSON.parse(json) as models.AppData;
    replaceAppState(data);
    await this.saveAll();
    return "imported";
  },
};

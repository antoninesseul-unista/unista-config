// frontend/src/services/exportService.ts
import { equipmentStores } from "../store/equipment";
import { PersistenceService } from "./persistenceService";
// Ensure this path matches the Wails generated directory structure
import { ExportEVToST } from "../../wailsjs/go/backend/App";

export const ExportService = {
  /**
   * Executes the backend Go function to export the .st configuration file.
   * Forces a state save to disk prior to export to guarantee data consistency.
   * * @returns {Promise<boolean>} True if the export was successful, false otherwise.
   */
  async exportElectrovalves(): Promise<boolean> {
    try {
      console.log("[ExportService] Flushing state to disk before export...");

      // 1. Force a synchronous save of all reactive states to ensure
      // the backend has the latest data (bypassing the auto-save delay)
      await PersistenceService.saveAll();
      console.log("[ExportService] State successfully saved.");

      // 2. Retrieve the equipment data
      const evData = equipmentStores.electrovalve.list.value;

      console.log("[ExportService] Triggering backend export...");

      // 3. Direct call to the bound Go method. No HTTP routing required.
      await ExportEVToST(evData as any);

      console.log(
        "[ExportService] Export successfully completed by the backend.",
      );
      return true;
    } catch (error) {
      console.error("[ExportService] Export process failed:", error);
      return false;
    }
  },
};

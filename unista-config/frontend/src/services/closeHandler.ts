// frontend/src/services/closeHandler.ts
import { EventsOn } from "../../wailsjs/runtime/runtime";
import { ConfirmClose } from "../../wailsjs/go/backend/App";
import { PersistenceService } from "./persistenceService";

/**
 * Listens for the backend close request, saves the application state synchronously,
 * and then explicitly tells the backend to terminate.
 */
export const initCloseHandler = () => {
  EventsOn("request-save-and-close", async () => {
    try {
      console.log("[CloseHandler] Intercepted close request. Saving data...");
      await PersistenceService.saveAll();
      console.log("[CloseHandler] Save complete. Closing application.");
    } catch (error) {
      console.error("[CloseHandler] Failed to save before closing:", error);
    } finally {
      // Always confirm close in the finally block to avoid being
      // permanently trapped in the app if the save process fails.
      await ConfirmClose();
    }
  });
};

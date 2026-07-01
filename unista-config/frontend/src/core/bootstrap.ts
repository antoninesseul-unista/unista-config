import { watch } from "vue";
import { EventsOn } from "../../wailsjs/runtime/runtime";
import { ConfirmClose } from "../../wailsjs/go/backend/App";
import { appState } from "./state";
import { PersistenceService } from "./wails";

const debounce = <T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number,
) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

export const initAutoSave = () => {
  const debouncedSave = debounce(async () => {
    try {
      await PersistenceService.saveAll();
      console.log("[AutoSave] State successfully persisted to disk.");
    } catch (error) {
      console.error("[AutoSave] Failed to persist state:", error);
    }
  }, 1500);

  // Watch the reactive object directly instead of a getter for reliable deep mutations tracking
  watch(appState, debouncedSave, { deep: true });
};

export const initCloseHandler = () => {
  EventsOn("request-save-and-close", async () => {
    try {
      console.log("[CloseHandler] Intercepted close request. Saving data...");
      await PersistenceService.saveAll();
      console.log("[CloseHandler] Save complete. Closing application.");
    } catch (error) {
      console.error("[CloseHandler] Failed to save before closing:", error);
    } finally {
      await ConfirmClose();
    }
  });
};

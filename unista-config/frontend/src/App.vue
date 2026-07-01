<template>
  <div class="flex h-screen w-full bg-gray-50 overflow-hidden">
    <Sidebar />
    <main class="flex-1 overflow-y-auto">
      <RouterView />
    </main>
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { PersistenceService, initCloseHandler, appState } from "./core";
import { initAutoSave } from "./core/bootstrap";
import { toast } from "./composables/useToast";
import Sidebar from "./components/Sidebar.vue";
import ToastContainer from "./components/ToastContainer.vue";
import { HardwareService } from "./core/wails";

onMounted(async () => {
  // 1. Wait for disk data to be fully loaded first to prevent race conditions
  const loadSuccess = await PersistenceService.init();

  // 2. Lock mechanism: ONLY enable AutoSave if the configuration file is healthy.
  // If the file is corrupted, we prevent auto-save from overwriting it with default values.
  if (loadSuccess) {
    initAutoSave();
    initCloseHandler();
  } else {
    toast.error("Data Load Failure", {
      description:
        "Configuration file is corrupted. Auto-save has been disabled for safety.",
    });
  }

  // 3. Background transparent loading for hardware context
  try {
    const modules = await HardwareService.autoLoadHardware();
    if (modules && modules.length > 0) {
      appState.detectedHardware = modules;
      console.log(`[Hardware] ${modules.length} modules loaded automatically.`);
    }
  } catch (err) {
    console.error(
      "[Hardware] Background automatic load failed at startup:",
      err,
    );
  }
});
</script>

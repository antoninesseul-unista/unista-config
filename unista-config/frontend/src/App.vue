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
import Sidebar from "./components/Sidebar.vue";
import ToastContainer from "./components/ToastContainer.vue";
import { HardwareService } from "./core/wails";

onMounted(async () => {
  // 1. Initialisation des services existants
  await PersistenceService.init();
  initCloseHandler();

  // 2. Chargement 100% transparent du Hardware en arrière-plan
  try {
    const modules = await HardwareService.autoLoadHardware();
    if (modules && modules.length > 0) {
      appState.detectedHardware = modules;
      console.log(
        `[Hardware] ${modules.length} modules chargés automatiquement.`,
      );
    }
  } catch (err) {
    console.error(
      "[Hardware] Échec du chargement automatique au démarrage:",
      err,
    );
  }
});
</script>

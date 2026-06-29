<template>
  <div class="flex h-screen w-full bg-gray-50 overflow-hidden">
    <Sidebar />
    <main class="flex-1 overflow-y-auto">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { PersistenceService } from "./services/persistenceService";
import { initAutoSave } from "./services/autoSave";
import { initCloseHandler } from "./services/closeHandler";
import Sidebar from "./components/Sidebar.vue";

onMounted(async () => {
  await PersistenceService.init(); // 1. Load initial data
  initAutoSave(); // 2. Start background debounce saving
  initCloseHandler(); // 3. Listen for window close event
});
</script>

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
import { PersistenceService, initCloseHandler } from "./core";
import Sidebar from "./components/Sidebar.vue";
import ToastContainer from "./components/ToastContainer.vue";

onMounted(async () => {
  await PersistenceService.init();
  initCloseHandler();
});
</script>

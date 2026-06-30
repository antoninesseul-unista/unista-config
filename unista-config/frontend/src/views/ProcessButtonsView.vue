<template>
  <DashboardParameterEditor
    :entities="activeProcessButtons"
    context-label="Process Buttons"
    header-subtitle="Process Unit"
    badge-label="Buttons"
    badge-class="bg-blue-100 text-blue-700"
    width-class="w-[260px]"
    body-class="p-4 flex flex-col gap-4 overflow-y-auto"
    :sections="[
      {
        key: 'toggleButtons',
        label: 'Toggle Buttons',
        toggleKey: 'showToggles',
        icon: 'panel-left',
        iconClass: 'text-blue-500',
      },
      {
        key: 'momentaryButtons',
        label: 'Momentary Buttons',
        toggleKey: 'showMomentaries',
        icon: 'mouse-pointer-click',
        iconClass: 'text-orange-500',
      },
    ]"
    :sidebar-capabilities="{
      showName: true,
      showTranslations: true,
      showReserves: true,
      showRobot: false,
      showRobotVarName: false,
    }"
  />
</template>

<script setup lang="ts">
import DashboardParameterEditor from "../components/DashboardParameterEditor.vue";
import { activeProcessButtons } from "../core";
</script>

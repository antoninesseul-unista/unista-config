<template>
  <DashboardParameterEditor
    :entities="counterGroups"
    context-label="Counters"
    badge-label="Counters"
    :sections="[
      {
        key: 'parameters',
        label: 'Counters',
        labelField: 'name',
        toggleKey: 'show',
        cols: 1,
        icon: 'calculator',
        iconClass: 'text-indigo-500',
      },
    ]"
    :sidebar-capabilities="{
      showName: true,
      showTranslations: true,
      showReserves: true,
      showRobot: false,
      showRobotVarName: false,
      showResetVisible: false,
    }"
  />
</template>

<script setup lang="ts">
import DashboardParameterEditor from "../components/DashboardParameterEditor.vue";
import { counterGroups } from "../core";
</script>

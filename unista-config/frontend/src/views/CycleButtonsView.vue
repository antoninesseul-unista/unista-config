<template>
  <DashboardParameterEditor
    :entities="activeCycleButtons"
    context-label="Cycle Buttons"
    header-subtitle="Process Unit"
    badge-label="Cycles"
    badge-class="bg-teal-100 text-teal-700"
    width-class="w-[260px]"
    body-class="p-4 flex flex-col gap-4 overflow-y-auto"
    :sidebar-locked="showStepsModal"
    :sections="[
      {
        key: 'cycles',
        label: 'Cycle Buttons',
        toggleKey: 'showCycles',
        icon: 'refresh-cw',
        iconClass: 'text-teal-500',
      },
    ]"
    :sidebar-capabilities="{
      showName: true,
      showTranslations: true,
      showReserves: true,
      showRobot: false,
      showRobotVarName: false,
      showResetVisible: true,
      showStepsConfig: true,
    }"
    @edit-steps="showStepsModal = true"
  >
    <template #footer="{ activeParam, context }">
      <StepsEditorModal
        v-if="showStepsModal && activeParam?.steps"
        :steps="activeParam.steps"
        :contextName="`${context} > ${activeParam.name}`"
        @close="showStepsModal = false"
      />
    </template>
  </DashboardParameterEditor>
</template>

<script setup lang="ts">
import { ref } from "vue";
import DashboardParameterEditor from "../components/DashboardParameterEditor.vue";
import StepsEditorModal from "../components/StepsEditorModal.vue";
import { activeCycleButtons } from "../core";

const showStepsModal = ref(false);
</script>

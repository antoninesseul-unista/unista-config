<template>
  <div
    class="pt-4 pb-8 h-full flex flex-col w-full overflow-hidden relative bg-gray-50/50"
  >
    <div
      class="flex flex-row gap-5 overflow-x-auto pb-8 pt-2 px-5 flex-1 items-start"
    >
      <DashboardCard
        v-for="(entity, idx) in activeCycleButtons"
        :key="entity.id"
        widthClass="w-[260px]"
        bodyClass="p-4 flex flex-col gap-4 overflow-y-auto"
      >
        <template #header>
          <div class="flex flex-col pointer-events-none">
            <span
              class="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1"
              >Process Unit</span
            >
            <div class="h-5 flex items-center">
              <span
                class="text-base font-bold text-gray-900 font-mono leading-none"
                >{{ entity.name }}</span
              >
            </div>
          </div>
        </template>
        <template #headerRight>
          <span
            class="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-700"
            >Cycles</span
          >
        </template>
        <div>
          <CollapsibleSection
            label="Cycle Buttons"
            v-model="entity.ui.showCycles"
          >
            <template #icon>
              <svg
                class="w-3.5 h-3.5 text-teal-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </template>
            <template #badge>
              <span
                v-if="getActiveCount(entity.cycles) > 0"
                class="ml-1.5 px-1.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-200 text-gray-600"
              >
                {{ getActiveCount(entity.cycles) }} active
              </span>
            </template>
            <ParameterGrid
              :params="entity.cycles"
              :cols="1"
              @open="openSidebar(idx, $event)"
            />
          </CollapsibleSection>
        </div>
      </DashboardCard>
    </div>

    <!-- Advanced Parameter Sidebar -->
    <ParameterSidebar
      :activeParam="activeParam"
      :parentContext="activeContext"
      :capabilities="{
        showName: true,
        showTranslations: true,
        showReserves: true,
        showRobot: false,
        showRobotVarName: false,
        showResetVisible: true,
        showStepsConfig: true, // Enables the Step Config Button
      }"
      @close="closeSidebar"
      @edit-steps="showStepsModal = true"
    />

    <!-- The Full-Screen Steps Editor Modal -->
    <StepsEditorModal
      v-if="showStepsModal && activeParam && activeParam.steps"
      :steps="activeParam.steps"
      :contextName="`${activeContext} > ${activeParam.name}`"
      @close="showStepsModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import CollapsibleSection from "../components/CollapsibleSection.vue";
import DashboardCard from "../components/DashboardCard.vue";
import ParameterGrid from "../components/ParameterGrid.vue";
import ParameterSidebar from "../components/ParameterSidebar.vue";
import StepsEditorModal from "../components/StepsEditorModal.vue";
import { useParamSelection2D } from "../composables/useParamSelection2D";
import { activeCycleButtons } from "../store/cycleButtons";
import { countActive } from "../utils/params";

const showStepsModal = ref(false);

const {
  idx1: selectedEntityIdx,
  activeParam,
  open: openSidebar,
  close: closeSidebar,
} = useParamSelection2D(
  (entityIdx, paramIdx) =>
    activeCycleButtons.value[entityIdx]?.cycles?.[paramIdx] ?? null,
  {
    canOpen: () => !showStepsModal.value,
    canClose: () => !showStepsModal.value,
  },
);

const activeContext = computed(() => {
  if (selectedEntityIdx.value === null) return "";
  return `Cycle Buttons: ${activeCycleButtons.value[selectedEntityIdx.value].name}`;
});

const getActiveCount = countActive;
</script>

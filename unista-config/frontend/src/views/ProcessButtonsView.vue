<template>
  <div
    class="pt-4 pb-8 h-full flex flex-col w-full overflow-hidden relative bg-gray-50/50"
  >
    <div
      class="flex flex-row gap-5 overflow-x-auto pb-8 pt-2 px-5 flex-1 items-start"
    >
      <DashboardCard
        v-for="(entity, idx) in activeProcessButtons"
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
            class="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700"
            >Buttons</span
          >
        </template>
        <div>
          <CollapsibleSection
            label="Toggle Buttons"
            v-model="entity.ui.showToggles"
          >
            <template #icon>
              <svg
                class="w-3.5 h-3.5 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 11h8M8 15h8M4 6h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z"
                />
              </svg>
            </template>
            <template #badge>
              <span
                v-if="getActiveCount(entity.toggleButtons) > 0"
                class="ml-1.5 px-1.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-200 text-gray-600"
              >
                {{ getActiveCount(entity.toggleButtons) }} active
              </span>
            </template>
            <ParameterGrid
              :params="entity.toggleButtons"
              :cols="1"
              @open="openSidebar(idx, 'toggleButtons', $event)"
            />
          </CollapsibleSection>

          <CollapsibleSection
            label="Momentary Buttons"
            v-model="entity.ui.showMomentaries"
          >
            <template #icon>
              <svg
                class="w-3.5 h-3.5 text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                />
              </svg>
            </template>
            <template #badge>
              <span
                v-if="getActiveCount(entity.momentaryButtons) > 0"
                class="ml-1.5 px-1.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-200 text-gray-600"
              >
                {{ getActiveCount(entity.momentaryButtons) }} active
              </span>
            </template>
            <ParameterGrid
              :params="entity.momentaryButtons"
              :cols="1"
              @open="openSidebar(idx, 'momentaryButtons', $event)"
            />
          </CollapsibleSection>
        </div>
      </DashboardCard>
    </div>

    <!-- Advanced Parameter Sidebar -->
    <ParameterSidebar
      :activeParam="activeParam"
      :parentContext="
        activeParam && selectedEntityIdx !== null
          ? `Process Buttons: ${activeProcessButtons[selectedEntityIdx].name}`
          : ''
      "
      :capabilities="{
        showName: true,
        showTranslations: true,
        showReserves: true,
        showRobot: false,
        showRobotVarName: false,
      }"
      @close="closeSidebar"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import CollapsibleSection from "../components/CollapsibleSection.vue";
import DashboardCard from "../components/DashboardCard.vue";
import ParameterGrid from "../components/ParameterGrid.vue";
import ParameterSidebar from "../components/ParameterSidebar.vue";
import { activeProcessButtons } from "../store/buttons";
import { useParamSelection2D } from "../composables/useParamSelection2D";
import { countActive } from "../utils/params";

/** State management for the Sidebar editor */
const selectedList = ref<"toggleButtons" | "momentaryButtons">("toggleButtons");
const {
  idx1: selectedEntityIdx,
  activeParam,
  open: openBase,
  close: closeBase,
} = useParamSelection2D((entityIdx, paramIdx) => {
  const entity = activeProcessButtons.value[entityIdx];
  if (!entity) return null;
  const list = selectedList.value;
  return entity[list]?.[paramIdx] ?? null;
});

/** Handlers */
const openSidebar = (
  entityIdx: number,
  listType: "toggleButtons" | "momentaryButtons",
  paramIdx: number,
) => {
  selectedList.value = listType;
  openBase(entityIdx, paramIdx);
};

const closeSidebar = () => {
  closeBase();
};

/** Calculate active parameters count for badges */
const getActiveCount = countActive;
</script>

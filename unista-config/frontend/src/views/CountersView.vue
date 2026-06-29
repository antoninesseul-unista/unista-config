<template>
  <div
    class="pt-4 pb-8 h-full flex flex-col w-full overflow-hidden relative bg-gray-50/50"
  >
    <!-- Remplacement de overflow-x-auto par overflow-auto -->
    <div
      class="flex flex-row gap-5 overflow-auto pb-8 pt-2 px-5 flex-1 items-start"
    >
      <DashboardCard
        v-for="(group, idx) in counterGroups"
        :key="group.id"
        widthClass="w-[280px]"
        bodyClass="p-4 flex flex-col gap-4"
      >
        <template #header>
          <div class="flex flex-col pointer-events-none">
            <span
              class="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1"
              >Configuration</span
            >
            <div class="h-5 flex items-center">
              <span
                class="text-base font-bold text-gray-900 font-mono leading-none"
                >{{ group.name }}</span
              >
            </div>
          </div>
        </template>
        <template #headerRight>
          <span
            class="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700"
          >
            Max {{ group.parameters.length }}
          </span>
        </template>
        <div>
          <CollapsibleSection
            class="shrink-0"
            :label="group.name"
            v-model="group.ui.show"
          >
            <template #icon>
              <svg
                class="w-3.5 h-3.5 text-indigo-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </template>
            <template #badge>
              <span
                v-if="getActiveCount(group.parameters) > 0"
                class="ml-1.5 px-1.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-200 text-gray-600"
              >
                {{ getActiveCount(group.parameters) }} active
              </span>
            </template>
            <ParameterGrid
              :params="group.parameters"
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
      :parentContext="
        activeParam && selectedGroupIdx !== null
          ? `Counters: ${counterGroups[selectedGroupIdx].name}`
          : ''
      "
      :capabilities="{
        showName: true,
        showTranslations: true,
        showReserves: true,
        showRobot: false,
        showRobotVarName: false,
        showResetVisible: false,
      }"
      @close="closeSidebar"
    />
  </div>
</template>

<script setup lang="ts">
import CollapsibleSection from "../components/CollapsibleSection.vue";
import DashboardCard from "../components/DashboardCard.vue";
import ParameterGrid from "../components/ParameterGrid.vue";
import ParameterSidebar from "../components/ParameterSidebar.vue";
import { useParamSelection2D } from "../composables/useParamSelection2D";
import { counterGroups } from "../store/counters";
import { countActive } from "../utils/params";

const {
  idx1: selectedGroupIdx,
  activeParam,
  open: openSidebar,
  close: closeSidebar,
} = useParamSelection2D(
  (groupIdx, paramIdx) =>
    counterGroups.value[groupIdx]?.parameters?.[paramIdx] ?? null,
);

const getActiveCount = countActive;
</script>

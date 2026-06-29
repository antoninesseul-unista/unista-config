<template>
  <div
    class="pt-4 pb-8 h-full flex flex-col w-full overflow-hidden relative bg-gray-50/50"
  >
    <div
      class="flex flex-row gap-5 overflow-auto pb-8 pt-2 px-5 flex-1 items-start"
    >
      <div
        v-for="(group, groupIdx) in faultGroups"
        :key="group.id"
        class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden shrink-0 w-[300px] flex flex-col transition-all duration-300 relative z-10 hover:shadow-md"
      >
        <div
          class="px-5 py-3.5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between shrink-0"
        >
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
        </div>

        <div class="p-4 flex flex-col gap-3">
          <CollapsibleSection
            v-for="(cat, catIdx) in group.categories"
            :key="cat.name"
            class="shrink-0"
            :label="cat.name"
            v-model="cat.ui.show"
          >
            <template #icon>
              <svg
                class="w-3.5 h-3.5 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </template>

            <template #badge>
              <span
                v-if="getActiveCount(cat.items) > 0"
                class="ml-1.5 px-1.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-200 text-gray-600"
              >
                {{ getActiveCount(cat.items) }} active
              </span>
            </template>

            <ParameterGrid
              :params="cat.items"
              :cols="1"
              @open="openSidebar(groupIdx, catIdx, $event)"
            />
          </CollapsibleSection>
        </div>
      </div>
    </div>

    <ParameterSidebar
      :activeParam="activeParam"
      :parentContext="activeContext"
      :capabilities="{
        showName: true,
        showTranslations: true,
        showReserves: true,
        showRobot: false,
        showRobotVarName: false,
        showResetVisible: false,
        showFaultInfo: true,
      }"
      @close="closeSidebar"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import CollapsibleSection from "../components/CollapsibleSection.vue";
import ParameterGrid from "../components/ParameterGrid.vue";
import ParameterSidebar from "../components/ParameterSidebar.vue";
import { useParamSelection3D } from "../composables/useParamSelection3D";
import { faultGroups } from "../store/faults";
import { countActive } from "../utils/params";

/**
 * Helper function to retrieve the number of active parameters.
 */
const getActiveCount = countActive;

/**
 * Destructure 3D selection composable methods and state.
 */
const {
  idx1: selectedGroupIdx,
  idx2: selectedCatIdx,
  activeParam,
  open: openSidebar,
  close: closeSidebar,
} = useParamSelection3D((gIdx, cIdx, pIdx) => {
  const group = faultGroups.value[gIdx];
  const cat = group?.categories?.[cIdx];
  return cat?.items?.[pIdx] ?? null;
});

/**
 * Computes the breadcrumb trail for the sidebar header based on active selection.
 */
const activeContext = computed(() => {
  if (selectedGroupIdx.value === null || selectedCatIdx.value === null)
    return "";
  const group = faultGroups.value[selectedGroupIdx.value];
  if (!group) return "";
  const cat = group.categories[selectedCatIdx.value];
  if (!cat) return "";
  return `${group.name} > ${cat.name}`;
});
</script>

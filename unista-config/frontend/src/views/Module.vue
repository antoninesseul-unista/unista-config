<template>
  <div
    class="pt-4 pb-8 h-full flex flex-col w-full overflow-hidden relative bg-gray-50/50"
  >
    <div
      class="flex flex-row gap-5 overflow-x-auto pb-8 pt-2 px-5 flex-1 items-start font-sans"
    >
      <draggable
        v-model="modules"
        item-key="id"
        class="flex flex-row gap-5 items-start shrink-0"
        animation="250"
        handle=".drag-handle"
        ghost-class="opacity-0"
        @end="syncModuleIndexes"
      >
        <template #item="{ element: module, index: mIndex }">
          <BaseConfigCard
            prefix="EM"
            label="Module"
            :itemIndex="module.index"
            v-model:enable="module.enable"
            @delete="removeModule(mIndex)"
            :error="getModuleErrors[module.id]"
            :errorMessage="getModuleErrorMessage(module)"
          >
            <!-- Single flex column with uniform gap — same pattern as GenericEquipmentView -->
            <div class="flex flex-col gap-2">
              <!-- Name -->
              <div>
                <label
                  :class="[
                    'block text-[11px] font-bold uppercase tracking-wider mb-1.5',
                    getModuleErrors[module.id]
                      ? 'text-red-600'
                      : 'text-gray-500',
                  ]"
                >
                  Name
                </label>
                <input
                  type="text"
                  v-model="module.name"
                  @input="
                    module.name = sanitizeVariableName(
                      ($event.target as HTMLInputElement).value,
                    )
                  "
                  :class="[
                    'w-full px-2 py-1.5 border rounded-md text-sm focus:outline-none bg-white transition-colors',
                    getModuleErrors[module.id]
                      ? 'border-red-400 bg-red-50 text-red-900 focus:ring-red-500'
                      : 'border-gray-200 focus:ring-1 focus:ring-blue-500',
                  ]"
                />
              </div>

              <!-- Translations & Info -->
              <div>
                <CollapsibleSection
                  label="Translations & Info"
                  v-model="module.ui.showModuleProps"
                >
                  <template #icon>
                    <svg
                      class="w-3.5 h-3.5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 6h16M4 12h16M4 18h7"
                      />
                    </svg>
                  </template>
                  <TranslationsFields :item="module" />
                </CollapsibleSection>
              </div>

              <!-- Settings -->
              <div>
                <label
                  class="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5"
                  >Settings</label
                >
                <div
                  @click="module.isEM = !module.isEM"
                  :class="[
                    'flex items-center justify-between px-2 py-1.5 rounded-md border text-sm font-medium transition-all cursor-pointer',
                    module.isEM
                      ? 'bg-green-50 border-green-200 text-green-800'
                      : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100',
                  ]"
                >
                  <span
                    class="truncate flex-1 py-0.5 select-none"
                    title="Independent EM"
                  >
                    Independent EM
                  </span>
                  <label
                    class="relative inline-flex items-center cursor-pointer ml-2 shrink-0"
                    @click.stop
                  >
                    <input
                      type="checkbox"
                      v-model="module.isEM"
                      class="sr-only peer"
                    />
                    <div
                      class="w-7 h-4 bg-gray-300 rounded-full peer peer-focus:outline-none peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-full"
                    />
                  </label>
                </div>
              </div>

              <!-- Parameters -->
              <div>
                <label
                  class="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5"
                  >Parameters</label
                >
                <div class="flex flex-col gap-2">
                  <CollapsibleSection
                    v-for="cat in PARAM_CATEGORIES"
                    :key="cat.key"
                    :label="cat.label"
                    v-model="(module.ui as any)[cat.toggleKey]"
                  >
                    <template #icon>
                      <span :class="['w-2 h-2 rounded-full', cat.color]" />
                    </template>
                    <template #badge>
                      <span
                        v-if="getActiveCount(module, cat.key) > 0"
                        class="ml-1.5 px-1.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-200 text-gray-600"
                      >
                        {{ getActiveCount(module, cat.key) }} active
                      </span>
                    </template>
                    <ParameterGrid
                      :params="(module as any)[cat.key]"
                      :cols="2"
                      @open="openSidebar(mIndex, cat.key, $event)"
                    />
                  </CollapsibleSection>
                </div>
              </div>
            </div>
          </BaseConfigCard>
        </template>
      </draggable>

      <GhostCard
        v-if="modules.length < 8"
        class="shrink-0"
        title="Add New Module"
        :remaining="8 - modules.length"
        @add="addModuleAction"
      />
    </div>

    <ParameterSidebar
      :activeParam="activeParam"
      :parentContext="
        activeParam ? `Module: EM${modules[selectedModuleIndex!].index}` : ''
      "
      @close="closeSidebar"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import draggable from "vuedraggable";
import BaseConfigCard from "../components/BaseConfigCard.vue";
import CollapsibleSection from "../components/CollapsibleSection.vue";
import GhostCard from "../components/GhostCard.vue";
import ParameterGrid from "../components/ParameterGrid.vue";
import ParameterSidebar from "../components/ParameterSidebar.vue";
import TranslationsFields from "../components/TranslationsFields.vue";
import { useParamSelection2D } from "../composables/useParamSelection2D";
import {
  addModuleAction,
  getModuleErrorMessage,
  getModuleErrors,
  modules,
  removeModule,
  syncModuleIndexes,
} from "../store/modules";
import type { MachineModule } from "../types";
import { sanitizeVariableName } from "../utils/helpers";
import { countActive } from "../utils/params";

const PARAM_CATEGORIES = [
  {
    key: "paramBools",
    label: "BOOL",
    toggleKey: "showBools",
    color: "bg-blue-400",
  },
  {
    key: "paramInts",
    label: "INT",
    toggleKey: "showInts",
    color: "bg-purple-400",
  },
  {
    key: "paramReals",
    label: "REAL",
    toggleKey: "showReals",
    color: "bg-orange-400",
  },
  {
    key: "paramStrings",
    label: "STRING",
    toggleKey: "showStrings",
    color: "bg-teal-400",
  },
] as const;

const selectedCategoryKey = ref<string>("paramBools");
const {
  idx1: selectedModuleIndex,
  activeParam,
  open: openBase,
  close: closeSidebar,
} = useParamSelection2D((moduleIdx, paramIdx) => {
  const module = modules.value[moduleIdx] as any;
  const key = selectedCategoryKey.value;
  return module?.[key]?.[paramIdx] ?? null;
});

const getActiveCount = (module: MachineModule, key: string) =>
  countActive((module as any)[key]);

const openSidebar = (mi: number, ck: string, pi: number) => {
  selectedCategoryKey.value = ck;
  openBase(mi, pi);
};
</script>

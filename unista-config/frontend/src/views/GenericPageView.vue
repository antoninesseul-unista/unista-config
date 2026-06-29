<template>
  <div
    v-if="store"
    class="pt-4 pb-8 h-full flex flex-col w-full overflow-hidden relative bg-gray-50/50"
  >
    <div
      class="flex flex-row gap-5 overflow-x-auto pb-8 pt-2 px-5 flex-1 items-start"
    >
      <draggable
        v-model="list"
        item-key="id"
        class="flex flex-row gap-5 items-start shrink-0"
        animation="250"
        handle=".drag-handle"
        ghost-class="opacity-0"
        @end="store.syncIndexes"
      >
        <template #item="{ element: item, index: idx }">
          <BaseConfigCard
            :prefix="store.definition.prefix"
            :itemIndex="item.index"
            v-model:enable="item.enable"
            @delete="store.removeAction(idx)"
            :error="store.getErrors.value[item.id]"
            :errorMessage="store.getErrorMessage(item)"
          >
            <!-- Name Field -->
            <div>
              <label
                :class="[
                  'block text-[11px] font-bold uppercase tracking-wider mb-1.5 mb-1',
                  store.getErrors.value[item.id]
                    ? 'text-red-600'
                    : 'text-gray-500',
                ]"
              >
                Name
              </label>
              <input
                type="text"
                v-model="item.name"
                @input="
                  item.name = sanitizeVariableName(
                    ($event.target as HTMLInputElement).value,
                  )
                "
                :class="[
                  'w-full px-2 py-1.5 border rounded-md text-sm focus:outline-none bg-white transition-colors',
                  store.getErrors.value[item.id]
                    ? 'border-red-400 bg-red-50 text-red-900 focus:ring-red-500'
                    : 'border-gray-200 focus:ring-1 focus:ring-blue-500',
                ]"
              />
            </div>

            <!-- Translations Section -->
            <CollapsibleSection
              label="Translations & Info"
              v-model="item.ui.showProps"
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
              <TranslationsFields :item="item" />
            </CollapsibleSection>

            <!-- Parameters Sections -->
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
                  v-model="(item.ui as any)[cat.toggleKey]"
                >
                  <template #icon>
                    <span :class="['w-2 h-2 rounded-full', cat.color]" />
                  </template>
                  <template #badge>
                    <span
                      v-if="getActiveCount(item, cat.key) > 0"
                      class="ml-1.5 px-1.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-200 text-gray-600"
                    >
                      {{ getActiveCount(item, cat.key) }} active
                    </span>
                  </template>
                  <ParameterGrid
                    :params="(item as any)[cat.key]"
                    :cols="2"
                    @open="openSidebar(idx, cat.key, $event)"
                  />
                </CollapsibleSection>
              </div>
            </div>
          </BaseConfigCard>
        </template>
      </draggable>

      <!-- Add Button -->
      <GhostCard
        v-if="list.length < store.definition.maxSlots"
        class="shrink-0"
        :title="`Add New ${store.definition.label}`"
        :remaining="store.definition.maxSlots - list.length"
        @add="store.addAction"
      />
    </div>

    <!-- Parameter Sidebar -->
    <ParameterSidebar
      :activeParam="activeParam"
      :parentContext="
        activeParam && selectedItemIdx !== null
          ? `${store.definition.label}: ${store.definition.prefix}${list[selectedItemIdx].index}`
          : ''
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
import { pageStores } from "../store/pages";
import type { MachinePage } from "../types";
import { sanitizeVariableName } from "../utils/helpers";
import { countActive } from "../utils/params";

const props = defineProps<{ type: string }>();

/** Reactive Store reference */
const store = computed(() => pageStores[props.type as keyof typeof pageStores]);

/** Helper for vuedraggable to access the list safely */
const list = computed({
  get: () => store.value?.list.value || [],
  set: (val) => {
    if (store.value) store.value.list.value = val;
  },
});

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

/** Selection indices for sidebar logic */
const selectedItemIdx = ref<number | null>(null);
const selectedCatKey = ref<string | null>(null);
const selectedParamIdx = ref<number | null>(null);

/** Active parameter computed for the sidebar */
const activeParam = computed(() => {
  if (
    selectedItemIdx.value === null ||
    !selectedCatKey.value ||
    selectedParamIdx.value === null
  )
    return null;
  const item = list.value[selectedItemIdx.value];
  return (item as any)[selectedCatKey.value][selectedParamIdx.value];
});

const openSidebar = (idx: number, catKey: string, pIdx: number) => {
  selectedItemIdx.value = idx;
  selectedCatKey.value = catKey;
  selectedParamIdx.value = pIdx;
};

const closeSidebar = () => {
  selectedItemIdx.value = null;
  selectedCatKey.value = null;
  selectedParamIdx.value = null;
};

/** Calculate active parameters count for badges */
const getActiveCount = (item: MachinePage, key: string) => {
  return countActive((item as any)[key]);
};
</script>

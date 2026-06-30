<template>
  <div class="pt-4 pb-8 h-full flex flex-col w-full overflow-hidden relative bg-gray-50/50">
    <div class="flex flex-row gap-5 overflow-x-auto pb-8 pt-2 px-5 flex-1 items-start font-sans">
      <draggable
        v-model="items"
        item-key="id"
        class="flex flex-row gap-5 items-start shrink-0"
        animation="250"
        handle=".drag-handle"
        ghost-class="opacity-0"
        @end="onSyncIndexes"
      >
        <template #item="{ element: item, index: idx }">
          <BaseConfigCard
            :prefix="prefix"
            :label="cardLabel"
            :itemIndex="item.index"
            v-model:enable="item.enable"
            @delete="onRemove(idx)"
            :error="errors[item.id]"
            :errorMessage="getErrorMessage(item)"
          >
            <div class="flex flex-col gap-2">
              <!-- Name -->
              <div>
                <label
                  :class="[
                    'block text-[11px] font-bold uppercase tracking-wider mb-1.5',
                    errors[item.id] ? 'text-red-600' : 'text-gray-500',
                  ]"
                >
                  Name
                </label>
                <input
                  type="text"
                  v-model="item.name"
                  @input="onNameInput(item, $event)"
                  :class="[
                    'w-full px-2 py-1.5 border rounded-md text-sm focus:outline-none bg-white transition-colors',
                    errors[item.id]
                      ? 'border-red-400 bg-red-50 text-red-900 focus:ring-red-500'
                      : 'border-gray-200 focus:ring-1 focus:ring-blue-500',
                  ]"
                />
              </div>

              <!-- Optional slot: settings between name and translations -->
              <slot name="settings" :item="item" :index="idx" />

              <!-- Translations -->
              <div v-if="showTranslations">
                <CollapsibleSection
                  label="Translations & Info"
                  v-model="(item.ui as any)[translationsToggleKey]"
                >
                  <template #icon>
                    <AppIcon name="align-left" :size="14" class="text-gray-500" />
                  </template>
                  <TranslationsFields :item="item" />
                </CollapsibleSection>
              </div>

              <!-- Parameters -->
              <div v-if="showParameters">
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
                      :cols="paramCols"
                      @open="openSidebar(idx, cat.key, $event)"
                    />
                  </CollapsibleSection>
                </div>
              </div>
            </div>
          </BaseConfigCard>
        </template>
      </draggable>

      <GhostCard
        v-if="items.length < maxSlots"
        class="shrink-0"
        :title="addTitle"
        :remaining="maxSlots - items.length"
        @add="onAdd"
      />
    </div>

    <ParameterSidebar
      :activeParam="activeParam"
      :parentContext="sidebarContext"
      :capabilities="sidebarCapabilities"
      @close="closeSidebar"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import draggable from "vuedraggable";
import BaseConfigCard from "./BaseConfigCard.vue";
import CollapsibleSection from "./CollapsibleSection.vue";
import GhostCard from "./GhostCard.vue";
import ParameterGrid from "./ParameterGrid.vue";
import ParameterSidebar from "./ParameterSidebar.vue";
import TranslationsFields from "./TranslationsFields.vue";
import { PARAM_CATEGORIES } from "../config/paramCategories";
import AppIcon from "./AppIcon.vue";
import type { SidebarCapabilities } from "../config/equipment";
import { useParamSelection2D } from "../composables/useParamSelection2D";
import { CalculationService, countActive } from "../core";

const items = defineModel<any[]>("items", { required: true });

const props = withDefaults(
  defineProps<{
    prefix: string;
    cardLabel?: string;
    maxSlots: number;
    addTitle: string;
    entityLabel: string;
    errors: Record<string, boolean>;
    getErrorMessage: (item: any) => string;
    onAdd: () => void;
    onRemove: (index: number) => void;
    onSyncIndexes: () => void;
    translationsToggleKey?: string;
    showTranslations?: boolean;
    showParameters?: boolean;
    paramCols?: 1 | 2;
    sidebarCapabilities?: SidebarCapabilities;
  }>(),
  {
    translationsToggleKey: "showProps",
    showTranslations: true,
    showParameters: true,
    paramCols: 2,
  },
);

const selectedCategoryKey = ref<string>("paramBools");
const {
  idx1: selectedItemIndex,
  activeParam,
  open: openBase,
  close: closeSidebar,
} = useParamSelection2D((itemIdx, paramIdx) => {
  const item = items.value[itemIdx] as any;
  return item?.[selectedCategoryKey.value]?.[paramIdx] ?? null;
});

const sidebarContext = computed(() => {
  if (!activeParam.value || selectedItemIndex.value === null) return "";
  const item = items.value[selectedItemIndex.value];
  return `${props.entityLabel}: ${props.prefix}${item.index}`;
});

const getActiveCount = (item: any, key: string) => countActive(item[key] ?? []);

const openSidebar = (itemIdx: number, catKey: string, paramIdx: number) => {
  selectedCategoryKey.value = catKey;
  openBase(itemIdx, paramIdx);
};

const onNameInput = async (item: { name: string }, event: Event) => {
  const raw = (event.target as HTMLInputElement).value;
  item.name = await CalculationService.sanitizeVariableName(raw);
};
</script>

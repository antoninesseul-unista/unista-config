<template>
  <div
    class="pt-4 pb-8 h-full flex flex-col w-full overflow-hidden relative bg-gray-50/50"
  >
    <div
      class="flex flex-row gap-5 overflow-x-auto pb-8 pt-2 px-5 flex-1 items-start font-sans"
    >
      <draggable
        v-model="products"
        item-key="id"
        class="flex flex-row gap-5 items-start shrink-0"
        animation="250"
        handle=".drag-handle"
        ghost-class="opacity-0"
        @end="syncProductIndexes"
      >
        <template #item="{ element: product, index: pIndex }">
          <BaseConfigCard
            prefix="PRD"
            :itemIndex="product.index"
            v-model:enable="product.enable"
            @delete="removeProduct(pIndex)"
            :error="getProductErrors[product.id]"
            :errorMessage="getProductErrorMessage(product)"
          >
            <!-- Product Name -->
            <div>
              <label
                :class="[
                  'block text-[11px] font-bold uppercase tracking-wider mb-1.5 mb-1',
                  getProductErrors[product.id]
                    ? 'text-red-600'
                    : 'text-gray-500',
                ]"
              >
                Name
              </label>
              <input
                type="text"
                v-model="product.name"
                @input="
                  product.name = sanitizeVariableName(
                    ($event.target as HTMLInputElement).value,
                  )
                "
                :class="[
                  'w-full px-2 py-1.5 border rounded-md text-sm focus:outline-none bg-white transition-colors',
                  getProductErrors[product.id]
                    ? 'border-red-400 bg-red-50 text-red-900 focus:ring-red-500'
                    : 'border-gray-200 focus:ring-1 focus:ring-blue-500',
                ]"
              />
            </div>

            <!-- Properties -->
            <div>
              <CollapsibleSection
                label="Translations & Info"
                v-model="product.ui.showProps"
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
                <TranslationsFields :item="product" />
              </CollapsibleSection>
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
                  v-model="(product.ui as any)[cat.toggleKey]"
                >
                  <template #icon>
                    <span :class="['w-2 h-2 rounded-full', cat.color]" />
                  </template>
                  <template #badge>
                    <span
                      v-if="getActiveCount(product, cat.key) > 0"
                      class="ml-1.5 px-1.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-200 text-gray-600"
                    >
                      {{ getActiveCount(product, cat.key) }} active
                    </span>
                  </template>
                  <ParameterGrid
                    :params="(product as any)[cat.key]"
                    :cols="2"
                    @open="openSidebar(pIndex, cat.key, $event)"
                  />
                </CollapsibleSection>
              </div>
            </div>
          </BaseConfigCard>
        </template>
      </draggable>

      <GhostCard
        v-if="products.length < 8"
        class="shrink-0"
        title="Add New Product"
        :remaining="8 - products.length"
        @add="addProductAction"
      />
    </div>

    <!-- Parameter Sidebar Editor -->
    <ParameterSidebar
      :activeParam="activeParam"
      :parentContext="
        activeParam
          ? `Product: PRD${products[selectedProductIndex!].index}`
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
import { useParamSelection2D } from "../composables/useParamSelection2D";
import {
  addProductAction,
  getProductErrorMessage,
  getProductErrors,
  products,
  removeProduct,
  syncProductIndexes,
} from "../store/products";
import type { MachineProduct } from "../types";
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
  idx1: selectedProductIndex,
  activeParam,
  open: openBase,
  close: closeSidebar,
} = useParamSelection2D((productIdx, paramIdx) => {
  const product = products.value[productIdx] as any;
  const key = selectedCategoryKey.value;
  return product?.[key]?.[paramIdx] ?? null;
});

const getActiveCount = (product: MachineProduct, key: string) =>
  countActive((product as any)[key]);

const openSidebar = (mi: number, ck: string, pi: number) => {
  selectedCategoryKey.value = ck;
  openBase(mi, pi);
};
</script>

<template>
  <div class="border border-gray-200 rounded-xl bg-white overflow-hidden">
    <button
      @click="open = !open"
      class="flex items-center justify-between w-full py-2 px-3 text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
    >
      <div class="flex items-center gap-1.5 min-w-0 flex-1 mr-2">
        <div class="shrink-0 flex items-center">
          <slot name="icon" />
        </div>

        <span class="truncate select-none">{{ label }}</span>

        <div class="shrink-0 flex items-center">
          <slot name="badge" />
        </div>
      </div>

      <svg
        class="w-3.5 h-3.5 text-gray-400 transition-transform duration-200 shrink-0"
        :class="open ? 'rotate-180' : ''"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>

    <transition
      enter-active-class="transition-all duration-300 ease-in-out"
      leave-active-class="transition-all duration-200 ease-in-out"
      enter-from-class="max-h-0 opacity-0"
      enter-to-class="max-h-[800px] opacity-100"
      leave-from-class="max-h-[800px] opacity-100"
      leave-to-class="max-h-0 opacity-0"
    >
      <div
        v-show="open"
        class="p-3 bg-white border-t border-gray-100 space-y-2.5 overflow-hidden"
      >
        <slot />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

/**
 * CollapsibleSection
 * A reusable UI component for collapsible content areas.
 */
const props = defineProps<{
  label: string;
  modelValue: boolean;
}>();

const emit = defineEmits<{ "update:modelValue": [value: boolean] }>();

// Define slots for strict type checking
defineSlots<{
  icon?: () => any;
  badge?: () => any;
  default?: () => any;
}>();

/**
 * Two-way binding wrapper for the v-model state.
 */
const open = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});
</script>

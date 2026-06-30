<template>
  <div
    class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden shrink-0 w-[260px] flex flex-col transition-all duration-300 relative"
    :class="[
      !enable ? 'bg-gray-50 opacity-75' : '',
      error ? 'ring-1 ring-red-500 z-20' : 'z-10 hover:shadow-md',
    ]"
  >
    <!-- Card Header -->
    <div
      class="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between"
      :class="error ? 'border-b-red-200 bg-red-50/50' : ''"
    >
      <div class="flex items-center gap-3">
        <!-- Drag Handle: Used by vuedraggable to grab the card -->
        <div
          class="drag-handle text-gray-300 hover:text-gray-500 p-1 -ml-2 transition-colors cursor-grab active:cursor-grabbing"
        >
          <AppIcon name="grip-vertical" :size="16" />
        </div>

        <!-- Column 1: INDEX -->
        <div class="flex flex-col pointer-events-none">
          <span
            class="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1"
            >Index</span
          >
          <div class="h-5 flex items-center">
            <span
              class="text-base font-bold text-gray-900 font-mono leading-none"
              >{{ prefix }}{{ itemIndex }}</span
            >
          </div>
        </div>

        <!-- Column 2: ENABLE -->
        <div class="flex flex-col">
          <span
            class="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1"
            >Enable</span
          >
          <div class="h-5 flex items-center">
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                :checked="enable"
                @change="
                  $emit(
                    'update:enable',
                    ($event.target as HTMLInputElement).checked,
                  )
                "
                class="sr-only peer"
              />
              <div
                class="w-9 h-5 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-200 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"
              />
            </label>
          </div>
        </div>
      </div>

      <!-- Delete Button -->
      <button
        @click.stop="showConfirm = true"
        class="text-gray-400 hover:text-red-500 transition-colors p-1"
      >
        <AppIcon name="trash-2" :size="16" />
      </button>
    </div>

    <!-- Error Banner -->
    <div
      v-if="error"
      class="bg-red-50 border border-red-200 text-red-800 px-4 py-2 flex items-center gap-2 pointer-events-none border-x-0 rounded-none"
    >
      <AppIcon name="triangle-alert" :size="16" class="text-red-600 shrink-0" />
      <span class="text-xs font-bold uppercase tracking-wide">{{
        errorMessage || "Invalid Config"
      }}</span>
    </div>

    <!-- Card Body -->
    <div
      class="p-4 flex flex-col gap-4 transition-all duration-300 overflow-y-auto"
      :class="!enable ? 'grayscale-50 pointer-events-none' : ''"
    >
      <slot />
    </div>
  </div>

  <!-- Confirm Delete Dialog -->
  <ConfirmDialog
    v-model="showConfirm"
    :label="label"
    :itemName="`${prefix}${itemIndex}`"
    @confirm="$emit('delete')"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import AppIcon from "./AppIcon.vue";
import ConfirmDialog from "./ConfirmDialog.vue";

/**
 * BaseConfigCard
 * A purely presentational component.
 * Drag events are now fully delegated to the parent vuedraggable wrapper.
 */
defineProps<{
  prefix: string;
  itemIndex: number;
  enable: boolean;
  label?: string;
  error?: boolean;
  errorMessage?: string;
}>();

defineEmits<{
  "update:enable": [value: boolean];
  delete: [];
}>();

const showConfirm = ref(false);
</script>

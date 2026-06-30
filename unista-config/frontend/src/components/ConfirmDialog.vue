<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center"
        @mousedown.self="$emit('update:modelValue', false)"
      >
        <!-- Overlay -->
        <div class="absolute inset-0 bg-gray-900/30 backdrop-blur-[2px]" />

        <!-- Dialog -->
        <div
          class="relative bg-white rounded-xl shadow-xl border border-gray-200 w-[340px] overflow-hidden"
        >
          <!-- Header -->
          <div
            class="bg-red-50 border-b border-red-200 px-5 py-4 flex items-center gap-3"
          >
            <div
              class="w-8 h-8 rounded-lg bg-red-100 border border-red-200 flex items-center justify-center shrink-0"
            >
              <AppIcon name="trash-2" :size="16" class="text-red-600" />
            </div>
            <div>
              <p class="text-sm font-bold text-red-900 uppercase tracking-wide">
                Delete {{ label ?? "Item" }}
              </p>
              <p class="text-[11px] text-red-500 font-medium mt-0.5">
                This action cannot be undone
              </p>
            </div>
          </div>

          <!-- Body -->
          <div class="px-5 py-4">
            <p class="text-sm text-gray-600">
              Are you sure you want to remove
              <span class="font-bold text-gray-900 font-mono">{{
                itemName
              }}</span>
              from the configuration?
            </p>
          </div>

          <!-- Footer -->
          <div class="px-5 pb-4 flex items-center justify-end gap-2">
            <button
              @click="$emit('update:modelValue', false)"
              class="px-3 py-1.5 rounded-md text-xs font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="onConfirm"
              class="px-3 py-1.5 rounded-md text-xs font-bold text-white bg-red-500 hover:bg-red-600 transition-colors flex items-center gap-1.5"
            >
              <AppIcon name="trash-2" :size="14" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import AppIcon from "./AppIcon.vue";

defineProps<{
  modelValue: boolean;
  label?: string;
  itemName: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  confirm: [];
}>();

const onConfirm = () => {
  emit("confirm");
  emit("update:modelValue", false);
};
</script>

<style scoped>
.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.15s ease;
}
.dialog-enter-active .relative,
.dialog-leave-active .relative {
  transition:
    transform 0.15s ease,
    opacity 0.15s ease;
}
.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}
.dialog-enter-from .relative,
.dialog-leave-to .relative {
  transform: scale(0.95);
  opacity: 0;
}
</style>

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
              <svg
                class="w-4 h-4 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
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
              <svg
                class="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
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

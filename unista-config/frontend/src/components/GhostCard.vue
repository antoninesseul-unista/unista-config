<template>
  <div
    @click="$emit('add')"
    class="shrink-0 w-[260px] h-[430px] border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer bg-white/50 hover:bg-white hover:border-blue-400 transition-all group"
  >
    <div
      class="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center border border-gray-200 group-hover:shadow-md group-hover:border-blue-200 transition-all"
    >
      <AppIcon
        name="plus"
        :size="20"
        class="text-gray-400 group-hover:text-blue-500 transition-colors"
      />
    </div>
    <span
      class="mt-3 text-xs font-semibold text-gray-500 group-hover:text-blue-600 transition-colors"
      >{{ title }}</span
    >
    <span v-if="remaining !== undefined" class="text-xs text-gray-400 mt-1"
      >{{ remaining }} slot(s) remaining</span
    >
  </div>
</template>

<script setup lang="ts">
import AppIcon from "./AppIcon.vue";

defineProps({
  title: { type: String, required: true },
  remaining: { type: Number, required: false },
});

defineEmits(["add"]);
</script>

<template>
  <div
    :class="[
      'bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden shrink-0 flex flex-col transition-all duration-300 relative z-10 hover:shadow-md',
      widthClass,
    ]"
  >
    <div
      class="px-5 py-3.5 border-b border-gray-100 bg-gray-50/50 px-4 py-3 flex items-center justify-between shrink-0"
    >
      <slot name="header" />
      <div class="flex items-center gap-2">
        <slot name="headerRight" />
      </div>
    </div>
    <div :class="bodyClass">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    widthClass?: string;
    bodyClass?: string;
  }>(),
  {
    widthClass: "w-[260px]",
    bodyClass: "p-4 flex flex-col gap-4",
  },
);
</script>

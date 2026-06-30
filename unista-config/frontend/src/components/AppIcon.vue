<script setup lang="ts">
import { computed } from "vue";
import { resolveLucideIcon } from "../utils/lucide";

const props = withDefaults(
  defineProps<{
    name: string;
    size?: number;
    strokeWidth?: number;
    class?: string;
  }>(),
  {
    size: 16,
    strokeWidth: 2,
  },
);

const icon = computed(() => resolveLucideIcon(props.name));
</script>

<template>
  <component :is="icon" :size="size" :stroke-width="strokeWidth" :class="class" />
</template>

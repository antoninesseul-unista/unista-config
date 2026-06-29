<template>
  <div :class="['grid gap-1.5', cols === 2 ? 'grid-cols-2' : 'grid-cols-1']">
    <div
      v-for="(p, i) in params"
      :key="i"
      :class="[
        'flex items-center justify-between px-2 py-1.5 rounded-md border font-medium transition-all duration-200 text-sm',
        cols === 2 ? 'px-1.5 py-1' : '',
        p.actif
          ? 'bg-green-50 border-green-200 text-green-800 shadow-sm'
          : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100',
      ]"
    >
      <!-- Clickable Name: Opens the sidebar for advanced editing -->
      <span
        class="truncate flex-1 cursor-pointer py-0.5 select-none"
        :title="p.name"
        @click="$emit('open', i)"
      >
        {{ p.name }}
      </span>

      <!-- Interactive Dot: Direct Toggle without opening sidebar -->
      <div
        @click.stop="p.actif = !p.actif"
        :class="[
          'w-2 h-2 rounded-full cursor-pointer transition-all duration-300 shrink-0 ml-2',
          p.actif
            ? 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.8)] scale-110'
            : 'bg-gray-300 hover:bg-gray-400',
        ]"
        title="Toggle Active"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Parameter } from "../types";

/**
 * ParameterGrid
 * Restored the "Dot" style for a cleaner look while keeping direct toggle functionality.
 * Props:
 *   params    List of parameters
 *   cols      Grid layout (1 or 2 columns)
 * Emits:
 *   open      Triggered when the name is clicked to open settings
 */
withDefaults(
  defineProps<{
    params: Parameter[];
    cols?: 1 | 2;
  }>(),
  { cols: 1 },
);

defineEmits<{ open: [index: number] }>();
</script>

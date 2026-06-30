<template>
  <div>
    <label
      :class="[
        'block text-[11px] font-bold uppercase tracking-wider mb-1.5',
        hasError ? 'text-red-600' : 'text-gray-500',
      ]"
    >
      {{ field.label }}
    </label>

    <select v-if="field.type === 'select'" v-model="model" :class="inputClass">
      <option :value="null" disabled hidden>-- Select --</option>
      <option v-for="opt in field.options" :key="opt" :value="opt">
        {{ opt }}
      </option>
    </select>

    <input
      v-else-if="field.type === 'number'"
      type="number"
      :value="model === null || model === undefined ? '' : model"
      @input="onNumberInput"
      :placeholder="'Enter ' + field.label"
      :class="[inputClass, 'font-mono']"
    />

    <input
      v-else-if="field.type === 'text'"
      type="text"
      v-model="model"
      :class="inputClass"
    />

    <div
      v-else-if="field.type === 'boolean'"
      class="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-200"
    >
      <span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
        {{ model ? "ON" : "OFF" }}
      </span>
      <label class="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" v-model="model" class="sr-only peer" />
        <div
          class="w-9 h-5 bg-gray-300 rounded-full peer peer-focus:outline-none peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"
        />
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ConfigField } from "../config/equipment";

const props = defineProps<{
  field: ConfigField;
  hasError?: boolean;
}>();

const model = defineModel<unknown>({ required: true });

const inputClass = computed(() => [
  "w-full px-2 py-1.5 border rounded-md text-sm bg-white focus:outline-none transition-colors",
  props.hasError
    ? "border-red-400 bg-red-50 text-red-900 focus:ring-red-500"
    : "border-gray-200 focus:ring-1 focus:ring-blue-500",
]);

const onNumberInput = (e: Event) => {
  const raw = (e.target as HTMLInputElement).value;
  model.value = raw === "" ? null : Number(raw);
};
</script>

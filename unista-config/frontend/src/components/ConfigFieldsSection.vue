<template>
  <CollapsibleSection :label="label" v-model="expanded">
    <template #icon v-if="icon">
      <AppIcon :name="icon" :size="14" class="text-gray-500" />
    </template>

    <template #badge v-if="hasBadgeError">
      <span class="relative flex h-2 w-2 ml-1 shrink-0" title="Missing required field">
        <span
          class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
        />
        <span class="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
      </span>
    </template>

    <template v-for="field in fields" :key="field.field">
      <div
        v-if="!isFieldVisible || isFieldVisible(field)"
        class="mb-3 last:mb-0"
      >
        <ConfigFieldRenderer
          :field="field"
          v-model="item[field.field]"
          :has-error="isFieldError(field.field)"
        />
      </div>
    </template>
  </CollapsibleSection>
</template>

<script setup lang="ts">
import { computed } from "vue";
import CollapsibleSection from "./CollapsibleSection.vue";
import AppIcon from "./AppIcon.vue";
import ConfigFieldRenderer from "./ConfigFieldRenderer.vue";
import type { ConfigField } from "../config/equipment";

const props = defineProps<{
  label: string;
  fields: ConfigField[];
  item: Record<string, unknown>;
  icon?: string;
  isFieldError: (field: string) => boolean;
  isFieldVisible?: (field: ConfigField) => boolean;
}>();

const expanded = defineModel<boolean>({ required: true });

const hasBadgeError = computed(() =>
  props.fields.some(
    (f) => (!props.isFieldVisible || props.isFieldVisible(f)) && props.isFieldError(f.field),
  ),
);
</script>

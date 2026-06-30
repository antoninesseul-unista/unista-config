<template>
  <DomainListEditor
    v-if="store"
    v-model:items="list"
    :prefix="store.definition.prefix"
    :max-slots="store.definition.maxSlots"
    :add-title="`Add New ${store.definition.label}`"
    :entity-label="store.definition.label"
    :errors="store.getErrors.value"
    :get-error-message="store.getErrorMessage"
    :on-add="store.addAction"
    :on-remove="store.removeAction"
    :on-sync-indexes="store.syncIndexes"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";
import DomainListEditor from "../components/DomainListEditor.vue";
import { pageStores } from "../core";

const props = defineProps<{ type: string }>();

const store = computed(() => pageStores[props.type as keyof typeof pageStores]);

const list = computed({
  get: () => store.value?.list.value ?? [],
  set: (val) => {
    if (store.value) store.value.list.value = val;
  },
});
</script>

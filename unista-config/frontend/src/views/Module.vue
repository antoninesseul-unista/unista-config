<template>
  <DomainListEditor
    v-model:items="modules"
    prefix="EM"
    card-label="Module"
    :max-slots="8"
    add-title="Add New Module"
    entity-label="Module"
    translations-toggle-key="showModuleProps"
    :errors="getModuleErrors"
    :get-error-message="getModuleErrorMessage"
    :on-add="addModuleAction"
    :on-remove="removeModule"
    :on-sync-indexes="syncModuleIndexes"
  >
    <template #settings="{ item: module }">
      <div>
        <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5"
          >Settings</label
        >
        <div
          @click="module.isEM = !module.isEM"
          :class="[
            'flex items-center justify-between px-2 py-1.5 rounded-md border text-sm font-medium transition-all cursor-pointer',
            module.isEM
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100',
          ]"
        >
          <span class="truncate flex-1 py-0.5 select-none" title="Independent EM">Independent EM</span>
          <label class="relative inline-flex items-center cursor-pointer ml-2 shrink-0" @click.stop>
            <input type="checkbox" v-model="module.isEM" class="sr-only peer" />
            <div
              class="w-7 h-4 bg-gray-300 rounded-full peer peer-focus:outline-none peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-full"
            />
          </label>
        </div>
      </div>
    </template>
  </DomainListEditor>
</template>

<script setup lang="ts">
import DomainListEditor from "../components/DomainListEditor.vue";
import {
  addModuleAction,
  getModuleErrorMessage,
  getModuleErrors,
  modules,
  removeModule,
  syncModuleIndexes,
} from "../core";
</script>

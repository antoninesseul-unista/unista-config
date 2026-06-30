<template>
  <div
    class="pt-4 pb-8 h-full flex flex-col w-full overflow-hidden relative bg-gray-50/50"
  >
    <!-- Remplacement de overflow-x-auto par overflow-auto pour autoriser le scroll vertical global -->
    <div
      class="flex flex-row gap-5 overflow-auto pb-8 pt-2 px-5 flex-1 items-start"
    >
      <!-- Generated Cards based on the 20 Message Boxes -->
      <div
        v-for="msgBox in messageBoxes"
        :key="msgBox.id"
        class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden shrink-0 w-[300px] flex flex-col transition-all duration-300 relative z-10 hover:shadow-md"
      >
        <!-- Card Header -->
        <div
          class="px-5 py-3.5 border-b border-gray-100 bg-gray-50/50 px-4 py-3 flex items-center justify-between shrink-0"
        >
          <div class="flex flex-col pointer-events-none">
            <span
              class="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1"
              >Configuration</span
            >
            <div class="h-5 flex items-center">
              <span
                class="text-base font-bold text-gray-900 font-mono leading-none"
                >{{ msgBox.name }}</span
              >
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span
              class="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700"
              >UI</span
            >
          </div>
        </div>

        <!-- Card Body -->
        <!-- Suppression du overflow-y-auto et max-h pour que la carte s'allonge -->
        <div class="p-4 flex flex-col gap-3">
          <CollapsibleSection
            v-for="sec in SECTIONS"
            :key="sec.key"
            class="shrink-0"
            :label="sec.label"
            v-model="(msgBox.ui as any)[sec.uiKey]"
          >
            <template #icon>
              <AppIcon :name="sec.icon" :size="14" :class="sec.color" />
            </template>
            <!-- Direct integration of the Translations & Info component -->
            <TranslationsFields :item="(msgBox as any)[sec.key]" />
          </CollapsibleSection>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CollapsibleSection from "../components/CollapsibleSection.vue";
import AppIcon from "../components/AppIcon.vue";
import TranslationsFields from "../components/TranslationsFields.vue";
import { messageBoxes } from "../core";

/**
 * Configuration array to loop through the 5 fields dynamically.
 * Keeps the template DRY (Don't Repeat Yourself).
 */
const SECTIONS = [
  {
    label: "Title",
    key: "title",
    uiKey: "showTitle",
    color: "text-purple-600",
    icon: "type",
  },
  { label: "Line 1", key: "line1", uiKey: "showLine1", color: "text-blue-500", icon: "align-left" },
  { label: "Line 2", key: "line2", uiKey: "showLine2", color: "text-blue-500", icon: "align-left" },
  {
    label: "Button Left",
    key: "btnLeft",
    uiKey: "showBtnLeft",
    color: "text-teal-500",
    icon: "square",
  },
  {
    label: "Button Right",
    key: "btnRight",
    uiKey: "showBtnRight",
    color: "text-teal-500",
    icon: "square",
  },
] as const;
</script>

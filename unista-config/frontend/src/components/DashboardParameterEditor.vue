<template>
  <div class="pt-4 pb-8 h-full flex flex-col w-full overflow-hidden relative bg-gray-50/50">
    <div class="flex flex-row gap-5 overflow-x-auto pb-8 pt-2 px-5 flex-1 items-start">
      <DashboardCard
        v-for="(entity, idx) in entities"
        :key="entity.id"
        :widthClass="widthClass"
        :bodyClass="bodyClass"
      >
        <template #header>
          <div class="flex flex-col pointer-events-none">
            <span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">{{
              headerSubtitle
            }}</span>
            <div class="h-5 flex items-center">
              <span class="text-base font-bold text-gray-900 font-mono leading-none">{{
                entity.name
              }}</span>
            </div>
          </div>
        </template>
        <template #headerRight>
          <span :class="['text-xs font-bold px-2 py-0.5 rounded-full', badgeClass]">{{
            badgeLabel
          }}</span>
        </template>
        <div>
          <CollapsibleSection
            v-for="section in sections"
            :key="section.key"
            :label="sectionLabel(entity, section)"
            v-model="(entity.ui as any)[section.toggleKey]"
          >
            <template #icon>
              <span v-if="section.colorDot" :class="['w-2 h-2 rounded-full', section.colorDot]" />
              <AppIcon
                v-else-if="section.icon ?? section.iconSvg"
                :name="section.icon ?? section.iconSvg!"
                :size="14"
                :class="section.iconClass ?? 'text-gray-500'"
              />
            </template>
            <template #badge>
              <span
                v-if="getActiveCount((entity as any)[section.key]) > 0"
                class="ml-1.5 px-1.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-200 text-gray-600"
              >
                {{ getActiveCount((entity as any)[section.key]) }} active
              </span>
            </template>
            <ParameterGrid
              :params="(entity as any)[section.key]"
              :cols="section.cols ?? 1"
              @open="openSidebar(idx, section.key, $event)"
            />
          </CollapsibleSection>
        </div>
      </DashboardCard>
    </div>

    <ParameterSidebar
      :activeParam="activeParam"
      :parentContext="sidebarContext"
      :capabilities="sidebarCapabilities"
      @close="closeSidebar"
      @edit-steps="emit('edit-steps')"
    />

    <slot name="footer" :activeParam="activeParam" :context="sidebarContext" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import CollapsibleSection from "./CollapsibleSection.vue";
import AppIcon from "./AppIcon.vue";
import DashboardCard from "./DashboardCard.vue";
import ParameterGrid from "./ParameterGrid.vue";
import ParameterSidebar from "./ParameterSidebar.vue";
import type { SidebarCapabilities } from "../config/equipment";
import { useParamSelection2D } from "../composables/useParamSelection2D";
import { models } from "../../wailsjs/go/models";
import { countActive } from "../core";

export interface DashboardParamSection {
  key: string;
  label: string;
  labelField?: string;
  toggleKey: string;
  cols?: 1 | 2;
  colorDot?: string;
  iconSvg?: string;
  icon?: string;
  iconClass?: string;
}

const props = withDefaults(
  defineProps<{
    entities: Array<{ id: string; name: string; ui: Record<string, boolean> } & Record<string, unknown>>;
    sections: DashboardParamSection[];
    contextLabel: string;
    headerSubtitle?: string;
    badgeLabel?: string;
    badgeClass?: string;
    widthClass?: string;
    bodyClass?: string;
    sidebarCapabilities?: SidebarCapabilities;
    sidebarLocked?: boolean;
  }>(),
  {
    headerSubtitle: "Configuration",
    badgeLabel: "Parameters",
    badgeClass: "bg-indigo-100 text-indigo-700",
    widthClass: "w-[280px]",
    bodyClass: "p-4 flex flex-col gap-4",
  },
);

const emit = defineEmits<{ "edit-steps": [] }>();

const selectedSectionKey = ref(props.sections[0]?.key ?? "");
const {
  idx1: selectedEntityIdx,
  activeParam,
  open: openBase,
  close: closeSidebar,
} = useParamSelection2D(
  (entityIdx, paramIdx) => {
    const entity = props.entities[entityIdx] as any;
    return entity?.[selectedSectionKey.value]?.[paramIdx] ?? null;
  },
  {
    canOpen: () => !props.sidebarLocked,
    canClose: () => !props.sidebarLocked,
  },
);

const sectionLabel = (entity: Record<string, unknown>, section: DashboardParamSection) =>
  section.labelField ? String(entity[section.labelField] ?? section.label) : section.label;

const sidebarContext = computed(() => {
  if (!activeParam.value || selectedEntityIdx.value === null) return "";
  return `${props.contextLabel}: ${props.entities[selectedEntityIdx.value]?.name ?? ""}`;
});

const getActiveCount = (params: models.Parameter[]) => countActive(params ?? []);

const openSidebar = (entityIdx: number, sectionKey: string, paramIdx: number) => {
  selectedSectionKey.value = sectionKey;
  openBase(entityIdx, paramIdx);
};
</script>

<template>
  <div
    class="pt-4 pb-8 h-full flex flex-col w-full overflow-hidden relative bg-gray-50/50"
  >
    <div
      class="flex flex-row gap-5 overflow-x-auto pb-8 pt-2 px-5 flex-1 items-start"
    >
      <draggable
        v-model="store.list.value"
        item-key="id"
        class="flex flex-row gap-5 items-start shrink-0"
        animation="250"
        handle=".drag-handle"
        ghost-class="opacity-0"
        @end="store.syncIndexes"
      >
        <template #item="{ element: eq, index: eqIndex }">
          <BaseConfigCard
            :prefix="store.definition.prefix"
            :itemIndex="eq.index"
            :label="store.definition.label ?? 'Item'"
            v-model:enable="eq.enable"
            @delete="store.removeAction(eqIndex)"
            :error="hasLocalError(eq)"
            :errorMessage="getErrorMessage(eq)"
          >
            <div class="flex flex-col gap-2">
              <div v-if="store.definition.hasEmLink">
                <div>
                  <label
                    :class="[
                      'block text-[11px] font-bold uppercase tracking-wider mb-1.5',
                      isParentLinkBroken(eq) ? 'text-red-600' : 'text-gray-500',
                    ]"
                  >
                    Linked Module
                  </label>
                  <select
                    v-model="eq.emId"
                    :class="[
                      'w-full px-2 py-1.5 border rounded-md text-sm focus:ring-1 focus:outline-none bg-white transition-colors',
                      isParentLinkBroken(eq)
                        ? 'border-red-400 bg-red-50 text-red-900 focus:ring-red-500'
                        : 'border-gray-200 focus:ring-blue-500',
                    ]"
                  >
                    <option :value="null">None</option>
                    <option
                      v-for="mod in modules"
                      :key="mod.id"
                      :value="mod.id"
                    >
                      EM{{ mod.index }}
                    </option>
                  </select>
                </div>
              </div>

              <div v-if="store.definition.type === 'workplace'">
                <div>
                  <label
                    :class="[
                      'block text-[11px] font-bold uppercase tracking-wider mb-1.5',
                      isParentLinkBroken(eq) ? 'text-red-600' : 'text-gray-500',
                    ]"
                  >
                    Linked Robot
                  </label>
                  <select
                    v-model="eq.robotId"
                    :class="[
                      'w-full px-2 py-1.5 border rounded-md text-sm focus:ring-1 focus:outline-none bg-white transition-colors',
                      isParentLinkBroken(eq)
                        ? 'border-red-400 bg-red-50 text-red-900 focus:ring-red-500'
                        : 'border-gray-200 focus:ring-blue-500',
                    ]"
                  >
                    <option :value="null">None</option>
                    <option
                      v-for="robot in robotsList"
                      :key="robot.id"
                      :value="robot.id"
                    >
                      R{{ robot.index }}
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  :class="[
                    'block text-[11px] font-bold uppercase tracking-wider mb-1.5',
                    isNameError(eq) ? 'text-red-600' : 'text-gray-500',
                  ]"
                >
                  Name
                </label>
                <input
                  type="text"
                  v-model="eq.name"
                  maxlength="32"
                  placeholder="e.g. CAM_01"
                  @input="onNameInput(eq, $event)"
                  :class="[
                    'w-full px-2 py-1.5 border rounded-md text-sm focus:outline-none bg-white transition-colors',
                    isNameError(eq)
                      ? 'border-red-400 bg-red-50 text-red-900 focus:ring-red-500'
                      : 'border-gray-200 focus:ring-1 focus:ring-blue-500',
                  ]"
                />
                <p
                  :class="[
                    'text-[10px] mt-1 text-right',
                    eq.name.length >= 32 ? 'text-red-400' : 'text-gray-400',
                  ]"
                >
                  {{ eq.name.length }} / 32
                </p>
              </div>

              <div>
                <CollapsibleSection
                  label="Translations & Info"
                  v-model="eq.ui.showProps"
                >
                  <template #icon>
                    <AppIcon name="align-left" :size="14" class="text-gray-500" />
                  </template>
                  <TranslationsFields :item="eq" />
                </CollapsibleSection>
              </div>

              <div>
                <label
                  class="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5"
                >
                  Cycle Time
                </label>
                <select
                  v-model.number="eq.cycleTime"
                  class="w-full px-2 py-1.5 border border-gray-200 rounded-md text-sm bg-white focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                >
                  <option :value="2" :disabled="!store.definition.allowsFastCycle">
                    2 ms
                    {{ !store.definition.allowsFastCycle ? "(Axes & Mechatro Only)" : "" }}
                  </option>
                  <option :value="4">4 ms</option>
                  <option :value="10">10 ms</option>
                  <option :value="20">20 ms</option>
                </select>
              </div>

              <AxisConfigurationPanel
                v-if="store.definition.customPanel === 'axis'"
                :axis="eq"
                :hasError="(field) => isFieldError(eq, field)"
              />

              <ConfigFieldsSection
                v-for="section in fieldSections"
                :key="section.label"
                :label="section.label"
                :fields="section.fields"
                :item="eq"
                :icon="section.icon"
                v-model="eq.ui[section.uiKey]"
                :is-field-error="(f) => isFieldError(eq, f)"
                :is-field-visible="section.filterVisible ? (f) => isFieldVisible(eq, f) : undefined"
              />

              <div
                v-if="
                  store.definition.parameterFields &&
                  store.definition.parameterFields.length > 0
                "
              >
                <CollapsibleSection
                  label="Parameters"
                  v-model="eq.ui.showParams"
                >
                  <template #icon>
                    <AppIcon name="sliders-horizontal" :size="14" class="text-gray-500" />
                  </template>

                  <template #badge v-if="hasParamsError(eq)">
                    <span
                      class="relative flex h-2 w-2 ml-1 shrink-0"
                      title="Error in parameters"
                    >
                      <span
                        class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
                      ></span>
                      <span
                        class="relative inline-flex rounded-full h-2 w-2 bg-red-500"
                      ></span>
                    </span>
                  </template>

                  <div class="flex flex-col gap-1.5 mt-1">
                    <div
                      v-for="p in getFilteredParameters(eq)"
                      :key="p.id"
                      :class="[
                        'flex items-center justify-between px-2 py-1.5 rounded-md border text-sm font-medium transition-all',
                        getParamErrorMessage(p) !== null
                          ? 'bg-red-50 border-red-300 text-red-700'
                          : p.actif
                            ? 'bg-green-50 border-green-200 text-green-800'
                            : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100',
                      ]"
                    >
                      <span
                        class="truncate flex-1 cursor-pointer py-0.5 flex items-center gap-1.5"
                        :title="getParamErrorMessage(p) || p.name"
                        @click="openSidebar(eqIndex, findOriginalIndex(eq, p))"
                      >
                        <span
                          v-if="getParamErrorMessage(p) !== null"
                          class="inline-flex shrink-0 w-1.5 h-1.5 rounded-full bg-red-500"
                        />
                        {{ p.name }}
                      </span>
                      <label
                        class="relative inline-flex items-center cursor-pointer ml-2 shrink-0"
                        @click.stop
                      >
                        <input
                          type="checkbox"
                          v-model="p.actif"
                          class="sr-only peer"
                        />
                        <div
                          class="w-7 h-4 bg-gray-300 rounded-full peer peer-focus:outline-none peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-full"
                        />
                      </label>
                    </div>
                  </div>
                </CollapsibleSection>
              </div>
            </div>
          </BaseConfigCard>
        </template>
      </draggable>

      <GhostCard
        class="shrink-0"
        :title="`Add New ${store.definition.label}`"
        @add="store.addAction"
      />
    </div>

    <ParameterSidebar
      :activeParam="activeParam"
      :parentContext="
        activeParam
          ? `${store.definition.label}: ${store.definition.prefix}${store.list.value[selectedEqIndex!].index}`
          : ''
      "
      :capabilities="store.definition.sidebarCapabilities"
      @close="closeSidebar"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, watchEffect } from "vue";
import draggable from "vuedraggable";
import AxisConfigurationPanel from "../components/axis/AxisConfigurationPanel.vue";
import AppIcon from "../components/AppIcon.vue";
import BaseConfigCard from "../components/BaseConfigCard.vue";
import CollapsibleSection from "../components/CollapsibleSection.vue";
import ConfigFieldsSection from "../components/ConfigFieldsSection.vue";
import GhostCard from "../components/GhostCard.vue";
import ParameterSidebar from "../components/ParameterSidebar.vue";
import TranslationsFields from "../components/TranslationsFields.vue";
import { useEquipmentValidation } from "../composables/useEquipmentValidation";
import { useParamSelection2D } from "../composables/useParamSelection2D";
import type { ConfigField, EquipmentInstance } from "../config/equipment";
import { CalculationService, equipmentStores, equipmentFieldSections, modules } from "../core";

const props = defineProps<{ type: string }>();

const store = computed(
  () => equipmentStores[props.type as keyof typeof equipmentStores],
);

const robotsList = computed(() => equipmentStores.robot?.list.value ?? []);

const {
  isFieldVisible,
  isParentLinkBroken,
  isNameError,
  isFieldError,
  getParamErrorMessage,
  hasParamsError,
  hasLocalError,
  getErrorMessage,
} = useEquipmentValidation(store);

const fieldSections = computed(() => {
  const def = store.value?.definition;
  if (!def || def.customPanel === "axis") return [];

  return equipmentFieldSections.value
    .map((spec) => ({
      label: spec.label,
      fields: (def[spec.fieldsKey] || []) as ConfigField[],
      icon: spec.iconKey ? (def[spec.iconKey] as string | undefined) : undefined,
      uiKey: spec.uiKey,
      filterVisible: spec.filterVisible ?? false,
    }))
    .filter((s) => s.fields.length > 0);
});

const onNameInput = async (eq: EquipmentInstance, event: Event) => {
  eq.name = await CalculationService.sanitizeVariableName(
    (event.target as HTMLInputElement).value,
  );
};

const TRACKING_PARAM_LABELS = [
  "Tracking Start 1",
  "Conveyor Tracking Start 1",
  "Tracking Stop 1",
  "Conveyor Tracking Stop 1",
  "Tracking Start 2",
  "Conveyor Tracking Start 2",
  "Tracking Stop 2",
  "Conveyor Tracking Stop 2",
];

const getFilteredParameters = (eq: EquipmentInstance) => {
  let params = eq.parameters ?? [];

  if (eq.type === "vacuum" && eq.cmdType === "VacuumOnly") {
    params = params.filter((p) => !p.name.toLowerCase().includes("blow"));
  }

  if (eq.type === "robot" && !eq.trackingActive) {
    params = params.filter((p) => !TRACKING_PARAM_LABELS.includes(p.name));
  }

  if (eq.type === "robot") {
    const hasPalettization =
      eq.palettizationId !== null &&
      eq.palettizationId !== undefined &&
      eq.palettizationId !== 0;

    if (!hasPalettization) {
      params = params.filter((p) => p.name !== "Palletizing Recipe");
    }
  }

  return params;
};

const findOriginalIndex = (eq: EquipmentInstance, param: { id: number }): number =>
  eq.parameters.findIndex((p) => p.id === param.id);

watchEffect(() => {
  for (const eq of store.value.list.value) {
    if (eq.type !== "robot") continue;

    const palletizingRecipe = eq.parameters?.find((p) => p.name === "Palletizing Recipe");
    if (!palletizingRecipe) continue;

    const isActive =
      eq.palettizationId !== null &&
      eq.palettizationId !== undefined &&
      eq.palettizationId !== 0;

    if (isActive && !palletizingRecipe.actif) {
      palletizingRecipe.actif = true;
    }
  }
});

const {
  idx1: selectedEqIndex,
  activeParam,
  open: openSidebar,
  close: closeSidebar,
} = useParamSelection2D(
  (eqIdx, paramIdx) => store.value.list.value[eqIdx]?.parameters?.[paramIdx] ?? null,
);
</script>

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

              <div v-if="store.definition.type === 'robotJob'">
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
                  @input="
                    eq.name = sanitizeVariableName(
                      ($event.target as HTMLInputElement).value,
                    )
                  "
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
                    <svg
                      class="w-3.5 h-3.5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 6h16M4 12h16M4 18h7"
                      />
                    </svg>
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
                  <option
                    :value="2"
                    :disabled="
                      store.definition.type !== 'axis' &&
                      store.definition.type !== 'advAxis'
                    "
                  >
                    2 ms
                    {{
                      store.definition.type !== "axis" &&
                      store.definition.type !== "advAxis"
                        ? "(Axes Only)"
                        : ""
                    }}
                  </option>
                  <option :value="4">4 ms</option>
                  <option :value="10">10 ms</option>
                  <option :value="20">20 ms</option>
                </select>
              </div>

              <div
                v-if="
                  store.definition.configFields &&
                  store.definition.configFields.length > 0
                "
              >
                <CollapsibleSection
                  label="Configuration"
                  v-model="eq.ui.showConfiguration"
                >
                  <template #icon v-if="store.definition.configIcon">
                    <div
                      v-html="store.definition.configIcon"
                      class="flex items-center justify-center"
                    />
                  </template>
                  <template
                    #badge
                    v-if="hasSectionError(eq, store.definition.configFields)"
                  >
                    <span class="relative flex h-2 w-2 ml-1 shrink-0">
                      <span
                        class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
                      ></span>
                      <span
                        class="relative inline-flex rounded-full h-2 w-2 bg-red-500"
                      ></span>
                    </span>
                  </template>

                  <template
                    v-for="cfg in store.definition.configFields"
                    :key="cfg.field"
                  >
                    <div
                      v-if="getFilteredConfiguration(eq, cfg)"
                      class="mb-3 last:mb-0"
                    >
                      <label
                        :class="[
                          'block text-[11px] font-bold uppercase tracking-wider mb-1.5',
                          isFieldError(eq, cfg.field)
                            ? 'text-red-600'
                            : 'text-gray-500',
                        ]"
                      >
                        {{ cfg.label }}
                      </label>

                      <select
                        v-if="cfg.type === 'select'"
                        v-model="eq[cfg.field]"
                        :class="[
                          'w-full px-2 py-1.5 border rounded-md text-sm focus:outline-none transition-colors',
                          isFieldError(eq, cfg.field)
                            ? 'border-red-400 bg-red-50 text-red-900 focus:ring-red-500'
                            : 'border-gray-200 bg-white focus:ring-1 focus:ring-blue-500',
                        ]"
                      >
                        <option :value="null" disabled hidden>
                          -- Select --
                        </option>
                        <option
                          v-for="opt in cfg.options"
                          :key="opt"
                          :value="opt"
                        >
                          {{ opt }}
                        </option>
                      </select>

                      <input
                        v-else-if="cfg.type === 'number'"
                        type="number"
                        :value="eq[cfg.field] === null ? '' : eq[cfg.field]"
                        @input="
                          eq[cfg.field] =
                            ($event.target as HTMLInputElement).value === ''
                              ? null
                              : Number(
                                  ($event.target as HTMLInputElement).value,
                                )
                        "
                        :placeholder="'Enter ' + cfg.label"
                        :class="[
                          'w-full px-2 py-1.5 border rounded-md text-sm bg-white focus:outline-none font-mono transition-colors',
                          isFieldError(eq, cfg.field)
                            ? 'border-red-400 bg-red-50 text-red-900 focus:ring-red-500'
                            : 'border-gray-200 focus:ring-1 focus:ring-blue-500',
                        ]"
                      />

                      <input
                        v-else-if="cfg.type === 'text'"
                        type="text"
                        v-model="eq[cfg.field]"
                        :class="[
                          'w-full px-2 py-1.5 border rounded-md text-sm bg-white focus:outline-none transition-colors',
                          isFieldError(eq, cfg.field)
                            ? 'border-red-400 bg-red-50 text-red-900 focus:ring-red-500'
                            : 'border-gray-200 focus:ring-1 focus:ring-blue-500',
                        ]"
                      />

                      <div
                        v-else-if="cfg.type === 'boolean'"
                        class="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-200"
                      >
                        <span
                          class="text-[11px] font-bold text-gray-400 uppercase tracking-wider"
                        >
                          {{ eq[cfg.field] ? "ON" : "OFF" }}
                        </span>
                        <label
                          class="relative inline-flex items-center cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            v-model="eq[cfg.field]"
                            class="sr-only peer"
                          />
                          <div
                            class="w-9 h-5 bg-gray-300 rounded-full peer peer-focus:outline-none peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"
                          />
                        </label>
                      </div>
                    </div>
                  </template>
                </CollapsibleSection>
              </div>

              <div
                v-if="
                  store.definition.controllerFields &&
                  store.definition.controllerFields.length > 0
                "
              >
                <CollapsibleSection
                  label="Controller"
                  v-model="eq.ui.showController"
                >
                  <template #icon v-if="store.definition.controllerIcon">
                    <div
                      v-html="store.definition.controllerIcon"
                      class="flex items-center justify-center"
                    />
                  </template>
                  <template
                    #badge
                    v-if="
                      hasSectionError(eq, store.definition.controllerFields)
                    "
                  >
                    <span class="relative flex h-2 w-2 ml-1 shrink-0">
                      <span
                        class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
                      ></span>
                      <span
                        class="relative inline-flex rounded-full h-2 w-2 bg-red-500"
                      ></span>
                    </span>
                  </template>

                  <template
                    v-for="cfg in store.definition.controllerFields"
                    :key="cfg.field"
                  >
                    <div
                      v-if="getFilteredConfiguration(eq, cfg)"
                      class="mb-3 last:mb-0"
                    >
                      <label
                        :class="[
                          'block text-[11px] font-bold uppercase tracking-wider mb-1.5',
                          isFieldError(eq, cfg.field)
                            ? 'text-red-600'
                            : 'text-gray-500',
                        ]"
                      >
                        {{ cfg.label }}
                      </label>

                      <select
                        v-if="cfg.type === 'select'"
                        v-model="eq[cfg.field]"
                        :class="[
                          'w-full px-2 py-1.5 border rounded-md text-sm focus:outline-none transition-colors',
                          isFieldError(eq, cfg.field)
                            ? 'border-red-400 bg-red-50 text-red-900 focus:ring-red-500'
                            : 'border-gray-200 bg-white focus:ring-1 focus:ring-blue-500',
                        ]"
                      >
                        <option :value="null" disabled hidden>
                          -- Select --
                        </option>
                        <option
                          v-for="opt in cfg.options"
                          :key="opt"
                          :value="opt"
                        >
                          {{ opt }}
                        </option>
                      </select>

                      <input
                        v-else-if="cfg.type === 'number'"
                        type="number"
                        :value="eq[cfg.field] === null ? '' : eq[cfg.field]"
                        @input="
                          eq[cfg.field] =
                            ($event.target as HTMLInputElement).value === ''
                              ? null
                              : Number(
                                  ($event.target as HTMLInputElement).value,
                                )
                        "
                        :placeholder="'Enter ' + cfg.label"
                        :class="[
                          'w-full px-2 py-1.5 border rounded-md text-sm bg-white focus:outline-none font-mono transition-colors',
                          isFieldError(eq, cfg.field)
                            ? 'border-red-400 bg-red-50 text-red-900 focus:ring-red-500'
                            : 'border-gray-200 focus:ring-1 focus:ring-blue-500',
                        ]"
                      />

                      <input
                        v-else-if="cfg.type === 'text'"
                        type="text"
                        v-model="eq[cfg.field]"
                        :class="[
                          'w-full px-2 py-1.5 border rounded-md text-sm bg-white focus:outline-none transition-colors',
                          isFieldError(eq, cfg.field)
                            ? 'border-red-400 bg-red-50 text-red-900 focus:ring-red-500'
                            : 'border-gray-200 focus:ring-1 focus:ring-blue-500',
                        ]"
                      />

                      <div
                        v-else-if="cfg.type === 'boolean'"
                        class="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-200"
                      >
                        <span
                          class="text-[11px] font-bold text-gray-400 uppercase tracking-wider"
                        >
                          {{ eq[cfg.field] ? "ON" : "OFF" }}
                        </span>
                        <label
                          class="relative inline-flex items-center cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            v-model="eq[cfg.field]"
                            class="sr-only peer"
                          />
                          <div
                            class="w-9 h-5 bg-gray-300 rounded-full peer peer-focus:outline-none peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"
                          />
                        </label>
                      </div>
                    </div>
                  </template>
                </CollapsibleSection>
              </div>

              <div
                v-if="
                  store.definition.processFields &&
                  store.definition.processFields.length > 0
                "
              >
                <CollapsibleSection label="Process" v-model="eq.ui.showProcess">
                  <template #icon v-if="store.definition.processIcon">
                    <div
                      v-html="store.definition.processIcon"
                      class="flex items-center justify-center"
                    />
                  </template>
                  <template
                    #badge
                    v-if="hasSectionError(eq, store.definition.processFields)"
                  >
                    <span class="relative flex h-2 w-2 ml-1 shrink-0">
                      <span
                        class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
                      ></span>
                      <span
                        class="relative inline-flex rounded-full h-2 w-2 bg-red-500"
                      ></span>
                    </span>
                  </template>

                  <div
                    v-for="cfg in store.definition.processFields"
                    :key="cfg.field"
                    class="mb-3 last:mb-0"
                  >
                    <label
                      :class="[
                        'block text-[11px] font-bold uppercase tracking-wider mb-1.5',
                        isFieldError(eq, cfg.field)
                          ? 'text-red-600'
                          : 'text-gray-500',
                      ]"
                    >
                      {{ cfg.label }}
                    </label>

                    <select
                      v-if="cfg.type === 'select'"
                      v-model="eq[cfg.field]"
                      :class="[
                        'w-full px-2 py-1.5 border rounded-md text-sm focus:outline-none transition-colors',
                        isFieldError(eq, cfg.field)
                          ? 'border-red-400 bg-red-50 text-red-900 focus:ring-red-500'
                          : 'border-gray-200 bg-white focus:ring-1 focus:ring-blue-500',
                      ]"
                    >
                      <option :value="null" disabled>-- Select --</option>
                      <option
                        v-for="opt in cfg.options"
                        :key="opt"
                        :value="opt"
                      >
                        {{ opt }}
                      </option>
                    </select>

                    <input
                      v-else-if="cfg.type === 'number'"
                      type="number"
                      :value="eq[cfg.field] === null ? '' : eq[cfg.field]"
                      @input="
                        eq[cfg.field] =
                          ($event.target as HTMLInputElement).value === ''
                            ? null
                            : Number(($event.target as HTMLInputElement).value)
                      "
                      :placeholder="'Enter ' + cfg.label"
                      :class="[
                        'w-full px-2 py-1.5 border rounded-md text-sm bg-white focus:outline-none font-mono transition-colors',
                        isFieldError(eq, cfg.field)
                          ? 'border-red-400 bg-red-50 text-red-900 focus:ring-red-500'
                          : 'border-gray-200 focus:ring-1 focus:ring-blue-500',
                      ]"
                    />

                    <input
                      v-else-if="cfg.type === 'text'"
                      type="text"
                      v-model="eq[cfg.field]"
                      :class="[
                        'w-full px-2 py-1.5 border rounded-md text-sm bg-white focus:outline-none transition-colors',
                        isFieldError(eq, cfg.field)
                          ? 'border-red-400 bg-red-50 text-red-900 focus:ring-red-500'
                          : 'border-gray-200 focus:ring-1 focus:ring-blue-500',
                      ]"
                    />

                    <div
                      v-else-if="cfg.type === 'boolean'"
                      class="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-200"
                    >
                      <span
                        class="text-[11px] font-bold text-gray-400 uppercase tracking-wider"
                      >
                        {{ eq[cfg.field] ? "ON" : "OFF" }}
                      </span>
                      <label
                        class="relative inline-flex items-center cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          v-model="eq[cfg.field]"
                          class="sr-only peer"
                        />
                        <div
                          class="w-9 h-5 bg-gray-300 rounded-full peer peer-focus:outline-none peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"
                        />
                      </label>
                    </div>
                  </div>
                </CollapsibleSection>
              </div>

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
                    <svg
                      class="w-3.5 h-3.5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5"
                      />
                    </svg>
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
                      v-for="(p, pi) in getFilteredParameters(eq)"
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
import BaseConfigCard from "../components/BaseConfigCard.vue";
import CollapsibleSection from "../components/CollapsibleSection.vue";
import GhostCard from "../components/GhostCard.vue";
import ParameterSidebar from "../components/ParameterSidebar.vue";
import TranslationsFields from "../components/TranslationsFields.vue";
import { useParamSelection2D } from "../composables/useParamSelection2D";
import { equipmentStores } from "../store/equipment";
import { modules } from "../store/modules";
import type { BaseEquipment, ConfigField } from "../types";
import { sanitizeVariableName } from "../utils/helpers";

const props = defineProps<{ type: string }>();

const store = computed(
  () => equipmentStores[props.type as keyof typeof equipmentStores],
);

const robotsList = computed(() => equipmentStores.robot.list.value);

const allEquipmentList = computed(() =>
  Object.values(equipmentStores)
    .map((s) => s.list.value)
    .flat(),
);

const isValidIP = (ip: string | undefined | null): boolean => {
  if (!ip) return false;
  const regex =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return regex.test(ip);
};

const getRobotId = (eq: BaseEquipment): string | null => {
  if (eq.type === "robotJob") return eq.robotId || null;
  return null;
};

const isCameraControllerBrandCompatible = (eq: BaseEquipment): boolean => {
  const brand = eq.brand as string | undefined;
  return brand === "CAMERA_UNDEFINED" || !!(brand && brand.includes("Keyence"));
};

const getFilteredConfiguration = (
  eq: BaseEquipment,
  cfg: ConfigField,
): boolean => {
  if (store.value.definition.type !== "camera") return true;

  const brandCompatible = isCameraControllerBrandCompatible(eq);

  if (cfg.field === "managedByController") return brandCompatible;

  const isControllerField = (
    store.value.definition.controllerFields || []
  ).some((f) => f.field === cfg.field);
  if (isControllerField)
    return brandCompatible && eq.managedByController === true;

  return true;
};

const isParentLinkBroken = (eq: BaseEquipment): boolean => {
  if (!eq.enable) return false;

  if (store.value.definition.hasEmLink) {
    if (!eq.emId) return true;
    const mod = modules.value.find((m) => m.id === eq.emId);
    return !mod || !mod.enable;
  }

  if (store.value.definition.type === "robotJob") {
    if (!eq.robotId) return true;
    const parentRobot = robotsList.value.find((r) => r.id === eq.robotId);
    return !parentRobot || !parentRobot.enable;
  }

  return false;
};

const isNameError = (eq: BaseEquipment): boolean => {
  if (!eq.enable) return false;
  if (!eq.name || eq.name.trim() === "") return true;

  const thisRobotId = getRobotId(eq);
  return allEquipmentList.value.some((e) => {
    if (!e.enable || e.id === eq.id || e.name !== eq.name) return false;
    const otherRobotId = getRobotId(e);
    if (!thisRobotId && !otherRobotId) return true;
    if (thisRobotId && otherRobotId && thisRobotId === otherRobotId)
      return true;
    return false;
  });
};

const isFieldError = (eq: BaseEquipment, field: string): boolean => {
  if (!eq.enable) return false;

  const allFields = [
    ...(store.value.definition.configFields || []),
    ...(store.value.definition.controllerFields || []),
    ...(store.value.definition.processFields || []),
  ];
  const cfg = allFields.find((f) => f.field === field);

  if (
    cfg &&
    (cfg.type === "select" || cfg.type === "number") &&
    eq[field] === null
  ) {
    if (!getFilteredConfiguration(eq, cfg)) return false;
    return true;
  }

  if (field === "jobId" && store.value.definition.type === "robotJob") {
    if (!eq.jobId || eq.jobId === 0) return true;
    if (eq.robotId) {
      const duplicate = equipmentStores.robotJob.list.value.find(
        (j) =>
          j.id !== eq.id && j.robotId === eq.robotId && j.jobId === eq.jobId,
      );
      if (duplicate) return true;
    }
  }

  if (field === "ipAddress") {
    if (!eq.ipAddress || eq.ipAddress.trim() === "") return true;
    if (!isValidIP(eq.ipAddress)) return true;
    return allEquipmentList.value.some(
      (e) =>
        e.enable &&
        e.id !== eq.id &&
        e.ipAddress !== undefined &&
        e.ipAddress === eq.ipAddress,
    );
  }

  if (
    store.value.definition.type === "camera" &&
    eq.managedByController === true &&
    isCameraControllerBrandCompatible(eq)
  ) {
    const requiredControllerFields = [
      "controllerName",
      "controllerId",
      "channel",
      "startAreaExchanges",
      "nbInfos",
      "exchangesSize",
    ];
    if (requiredControllerFields.includes(field)) {
      return eq[field] === null || eq[field] === undefined || eq[field] === "";
    }
  }

  return false;
};

const hasSectionError = (
  eq: BaseEquipment,
  fields?: ConfigField[],
): boolean => {
  if (!eq.enable || !fields) return false;
  return fields.some((f) => isFieldError(eq, f.field));
};

const getParamErrorMessage = (param: any): string | null => {
  const mask = parseInt(param.robotMask || "0", 10) || 0;
  if (mask === 0) return null;

  const indexes = param.robotVarIndex || {};
  const allStoreParams = store.value.list.value.flatMap(
    (eq) => eq.parameters ?? [],
  );

  for (let rIdx = 0; rIdx < 32; rIdx++) {
    const bit = 1 << rIdx;
    if ((mask & bit) === 0) continue;

    const val = indexes[rIdx];

    if (
      val === null ||
      val === undefined ||
      val <= 0 ||
      Number.isNaN(Number(val))
    ) {
      return `Missing index on R${rIdx} (${param.name})`;
    }

    for (const sibling of allStoreParams) {
      if (sibling === param) continue;
      const siblingMask = parseInt(sibling.robotMask || "0", 10) || 0;
      if ((siblingMask & bit) === 0) continue;

      if (sibling.robotVarIndex?.[rIdx] === val) {
        return `Duplicate index ${val} on R${rIdx}`;
      }
    }
  }

  return null;
};

const hasParamsError = (eq: BaseEquipment): boolean => {
  if (!eq.enable) return false;
  return (eq.parameters ?? []).some((p) => getParamErrorMessage(p) !== null);
};

const hasLocalError = (eq: BaseEquipment): boolean => {
  if (!eq.enable) return false;
  if (isParentLinkBroken(eq) || isNameError(eq)) return true;

  const allFields = [
    ...(store.value.definition.configFields || []),
    ...(store.value.definition.controllerFields || []),
    ...(store.value.definition.processFields || []),
  ];
  if (allFields.some((f) => isFieldError(eq, f.field))) return true;

  return hasParamsError(eq);
};

const getErrorMessage = (eq: BaseEquipment): string => {
  if (isParentLinkBroken(eq)) {
    return store.value.definition.type === "robotJob"
      ? "Robot Disabled or Missing"
      : "Module Disabled or Missing";
  }

  if (!eq.name || eq.name.trim() === "") return "Name cannot be empty";
  if (isNameError(eq)) return "Name must be unique";

  if (eq.ipAddress !== undefined) {
    if (!eq.ipAddress || eq.ipAddress.trim() === "")
      return "IP Address required";
    if (!isValidIP(eq.ipAddress)) return "Invalid IP Format";
    if (isFieldError(eq, "ipAddress")) return "IP Address must be unique";
  }

  if (store.value.definition.type === "robotJob") {
    if (!eq.jobId || eq.jobId === 0) return "Invalid Job ID (cannot be 0)";
    if (isFieldError(eq, "jobId")) return "Duplicate Job ID for this Robot";
  }

  if (
    store.value.definition.type === "camera" &&
    eq.managedByController === true &&
    isCameraControllerBrandCompatible(eq)
  ) {
    if (
      isFieldError(eq, "controllerName") ||
      isFieldError(eq, "controllerId") ||
      isFieldError(eq, "channel")
    ) {
      return "Missing Controller Config";
    }
  }

  const allFields = [
    ...(store.value.definition.configFields || []),
    ...(store.value.definition.controllerFields || []),
    ...(store.value.definition.processFields || []),
  ];
  const missingField = allFields.find(
    (f) =>
      (f.type === "select" || f.type === "number") &&
      eq[f.field] === null &&
      getFilteredConfiguration(eq, f),
  );
  if (missingField) return `Please select a value for "${missingField.label}"`;

  const badParam = (eq.parameters ?? []).find(
    (p) => getParamErrorMessage(p) !== null,
  );
  if (badParam) {
    return getParamErrorMessage(badParam)!;
  }

  return "Configuration Error";
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

const getFilteredParameters = (eq: BaseEquipment) => {
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

const findOriginalIndex = (eq: BaseEquipment, param: any): number => {
  return eq.parameters.findIndex((p) => p.id === param.id);
};

watchEffect(() => {
  for (const eq of store.value.list.value) {
    if (eq.type !== "robot") continue;

    const palletizingRecipe = eq.parameters?.find(
      (p) => p.name === "Palletizing Recipe",
    );
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
  (eqIdx, paramIdx) =>
    store.value.list.value[eqIdx]?.parameters?.[paramIdx] ?? null,
);
</script>

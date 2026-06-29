<template>
  <div>
    <div
      v-if="activeParam"
      class="fixed inset-0 bg-gray-900/20 z-40"
      @click="$emit('close')"
    />

    <div
      class="fixed inset-y-0 right-0 w-[350px] bg-white shadow-2xl z-50 transform transition-transform duration-300 flex flex-col border-l border-gray-200"
      :class="activeParam ? 'translate-x-0' : 'translate-x-full'"
    >
      <div v-if="activeParam" class="flex flex-col h-full">
        <div
          class="px-5 py-4 border-b flex justify-between items-center"
          :class="
            activeParam.actif
              ? 'bg-green-50 border-green-100'
              : 'bg-gray-50 border-gray-200'
          "
        >
          <div class="min-w-0 pr-4">
            <h2
              class="text-base font-bold truncate mt-1"
              :class="activeParam.actif ? 'text-green-900' : 'text-gray-700'"
            >
              {{ activeParam.name }}
            </h2>
            <p
              class="text-[11px] font-bold text-gray-500 uppercase tracking-wider"
            >
              {{ parentContext }}
            </p>
          </div>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-700 p-1 rounded-md hover:bg-black/5 transition-colors shrink-0"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-5 space-y-5">
          <div
            v-if="capabilities.showFaultInfo && activeParam.faultCode"
            class="bg-red-50 border border-red-200 p-3.5 rounded-xl shadow-sm space-y-3"
          >
            <div class="flex items-center justify-between mb-2">
              <span
                class="text-xs font-bold text-red-800 uppercase tracking-wider"
                >System Identifiers (Read-Only)</span
              >
              <svg
                class="w-4 h-4 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div>
              <label
                class="text-[11px] font-bold text-red-500 uppercase tracking-wider mb-1 block"
                >Fault Code (Automate)</label
              >
              <input
                type="text"
                :value="activeParam.faultCode"
                disabled
                class="w-full px-2 py-1.5 border border-red-200 bg-red-100/50 rounded-md text-sm font-mono text-red-900 cursor-not-allowed"
              />
            </div>
            <div>
              <label
                class="block mb-1 text-[11px] font-bold tracking-wider text-red-500 uppercase"
                >Severity Level</label
              >
              <select
                v-model.number="activeParam.severity"
                class="w-full px-2 py-1.5 text-sm font-mono text-red-900 bg-white border border-red-200 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                <option
                  v-for="fault in faultTypes"
                  :key="fault.index"
                  :value="fault.index"
                >
                  {{ fault.index }} - {{ fault.name }}
                </option>
              </select>
            </div>
          </div>

          <div
            class="bg-white border border-gray-200 p-3.5 rounded-xl shadow-sm space-y-3"
          >
            <div class="flex items-center justify-between">
              <span
                class="text-xs font-bold text-gray-700 uppercase tracking-wider"
                >Visible (Active)</span
              >
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  v-model="activeParam.actif"
                  class="sr-only peer"
                />
                <div
                  class="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"
                />
              </label>
            </div>
            <div
              class="flex items-center justify-between"
              v-if="capabilities.showResetVisible"
            >
              <span
                class="text-xs font-bold text-gray-700 uppercase tracking-wider"
                >Reset Visible</span
              >
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  v-model="activeParam.resetVisible"
                  class="sr-only peer"
                />
                <div
                  class="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-orange-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"
                />
              </label>
            </div>
            <div v-if="capabilities.showName">
              <label
                class="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5"
                >Parameter Name</label
              >
              <input
                type="text"
                v-model="activeParam.name"
                class="w-full px-2 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div
            v-if="capabilities.showStepsConfig && activeParam.steps"
            class="bg-teal-50 border border-teal-200 p-3.5 rounded-xl shadow-sm"
          >
            <div class="flex items-center justify-between mb-3">
              <span
                class="text-xs font-bold text-teal-800 uppercase tracking-wider"
                >Cycle Steps</span
              >
              <span
                class="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-200 text-teal-800"
                >{{ activeParam.steps.length }} steps</span
              >
            </div>
            <button
              @click="$emit('edit-steps', activeParam)"
              class="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2 px-4 rounded transition-colors shadow-sm"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Configure Steps Table
            </button>
          </div>

          <div
            v-if="capabilities.showRobot && robotsList.length > 0"
            class="bg-purple-50 border border-purple-200 p-3.5 rounded-xl shadow-sm space-y-3"
          >
            <h3
              class="text-xs font-bold text-purple-800 uppercase tracking-wider"
            >
              Robot Assignment
            </h3>

            <div class="space-y-2">
              <div
                v-for="robot in robotsList"
                :key="robot.id"
                class="p-2.5 rounded-lg border transition-all"
                :class="
                  isRobotSelected(robot.index)
                    ? 'bg-purple-100/60 border-purple-300'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                "
              >
                <label
                  class="flex items-center justify-between cursor-pointer select-none"
                >
                  <span
                    class="text-sm font-medium"
                    :class="
                      isRobotSelected(robot.index)
                        ? 'text-purple-950 font-bold'
                        : 'text-gray-600'
                    "
                  >
                    R{{ robot.index }}
                    <span
                      v-if="robot.name"
                      class="text-xs font-normal text-gray-500 ml-1"
                      >({{ robot.name }})</span
                    >
                  </span>
                  <input
                    type="checkbox"
                    :checked="isRobotSelected(robot.index)"
                    @change="toggleRobot(robot.index)"
                    class="w-4 h-4 accent-purple-600 cursor-pointer rounded"
                  />
                </label>

                <div
                  v-if="isRobotSelected(robot.index)"
                  class="mt-2.5 pt-2.5 border-t border-purple-200/80 flex flex-col gap-1"
                >
                  <div class="flex items-center justify-between gap-2">
                    <label
                      class="text-[11px] font-bold text-purple-800 uppercase tracking-wider"
                    >
                      Variable Index R{{ robot.index }}
                    </label>
                    <input
                      type="number"
                      :value="getRobotVarIndex(robot.index)"
                      @input="setRobotVarIndex(robot.index, $event)"
                      placeholder="e.g. 1"
                      :class="[
                        'w-28 px-2 py-1 text-xs border rounded font-mono bg-white focus:outline-none focus:ring-1',
                        getRobotError(robot.index)
                          ? 'border-red-400 text-red-900 bg-red-50 focus:ring-red-400'
                          : 'border-purple-300 text-purple-950 focus:ring-purple-500',
                      ]"
                    />
                  </div>

                  <p
                    v-if="getRobotError(robot.index)"
                    class="text-[11px] text-red-600 font-medium text-right leading-tight"
                  >
                    {{ getRobotError(robot.index) }}
                  </p>
                </div>
              </div>
            </div>

            <div v-if="capabilities.showRobotVarName" class="pt-1">
              <label
                class="block text-[11px] font-bold text-purple-700 uppercase tracking-wider mb-1.5"
              >
                Variable Name
              </label>
              <input
                type="text"
                v-model="activeParam.robotVarName"
                placeholder="e.g. speed_pick"
                class="w-full px-2 py-1.5 border border-purple-200 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-purple-400"
              />
            </div>
          </div>

          <div
            v-else-if="capabilities.showRobot && robotsList.length === 0"
            class="bg-gray-50 border border-dashed border-gray-300 p-3.5 rounded-xl text-center"
          >
            <p class="text-xs text-gray-400 font-medium">
              No robots configured yet.
            </p>
          </div>

          <div
            v-if="
              capabilities.showTranslations &&
              activeParam.commentFr !== undefined
            "
          >
            <h3
              class="text-xs font-bold text-gray-400 uppercase border-b pb-1.5 mb-2.5"
            >
              Translations & Infos
            </h3>
            <div class="space-y-2.5">
              <div v-for="lang in LANGUAGE_FIELDS" :key="lang.code">
                <label
                  class="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1"
                >
                  <span
                    :class="[
                      'text-[11px] px-1 py-0.5 rounded',
                      lang.bg,
                      lang.text,
                    ]"
                    >{{ lang.code }}</span
                  >
                  Comment
                </label>
                <input
                  type="text"
                  v-model="activeParam[lang.field]"
                  class="w-full px-2 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  class="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5"
                  >Reserve 1</label
                >
                <input
                  type="text"
                  v-model="activeParam.reserve1"
                  class="w-full px-2 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  class="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5"
                  >Reserve 2</label
                >
                <input
                  type="text"
                  v-model="activeParam.reserve2"
                  class="w-full px-2 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from "vue";
import { equipmentStores } from "../store/equipment";
import { faultTypes } from "../store/systemConstants";
import type { Parameter, SidebarCapabilities } from "../types";

const props = withDefaults(
  defineProps<{
    activeParam: Parameter | null;
    parentContext: string;
    capabilities?: SidebarCapabilities;
  }>(),
  {
    capabilities: () => ({
      showName: true,
      showTranslations: true,
      showReserves: true,
      showRobot: true,
      showRobotVarName: false,
      showResetVisible: false,
      showStepsConfig: false,
      showFaultInfo: false,
    }),
  },
);

const emit = defineEmits(["close", "edit-steps"]);

const robotsList = computed(() =>
  equipmentStores.robot.list.value.filter((r) => r.enable),
);

const robotMask = computed(
  (): number => parseInt(props.activeParam?.robotMask || "0", 10) || 0,
);

const isRobotSelected = (robotIndex: number): boolean =>
  (robotMask.value & (1 << robotIndex)) !== 0;

const toggleRobot = (robotIndex: number): void => {
  if (!props.activeParam) return;
  const newMask = robotMask.value ^ (1 << robotIndex);
  props.activeParam.robotMask = String(newMask);

  if ((newMask & (1 << robotIndex)) === 0 && props.activeParam.robotVarIndex) {
    delete props.activeParam.robotVarIndex[robotIndex];
  }
};

const getRobotVarIndex = (robotIndex: number): number | string => {
  return props.activeParam?.robotVarIndex?.[robotIndex] ?? "";
};

const setRobotVarIndex = (robotIndex: number, event: Event): void => {
  if (!props.activeParam) return;
  if (
    !props.activeParam.robotVarIndex ||
    typeof props.activeParam.robotVarIndex !== "object"
  ) {
    props.activeParam.robotVarIndex = {};
  }
  const raw = (event.target as HTMLInputElement).value;
  props.activeParam.robotVarIndex[robotIndex] = raw === "" ? null : Number(raw);
};

const siblingParameters = computed((): Parameter[] => {
  if (!props.activeParam) return [];

  for (const store of Object.values(equipmentStores)) {
    const owningEquipment = store.list.value.find((eq) =>
      eq.parameters?.some((p) => p === props.activeParam),
    );
    if (owningEquipment) {
      return store.list.value.flatMap((eq) =>
        (eq.parameters ?? []).filter((p) => p !== props.activeParam),
      );
    }
  }
  return [];
});

const getRobotError = (robotIndex: number): string | null => {
  const param = props.activeParam;
  if (!param || !isRobotSelected(robotIndex)) return null;

  const val = param.robotVarIndex?.[robotIndex];

  if (
    val === null ||
    val === undefined ||
    val <= 0 ||
    Number.isNaN(Number(val))
  ) {
    return "Index required (> 0)";
  }

  for (const sibling of siblingParameters.value) {
    const siblingMask = parseInt(sibling.robotMask || "0", 10) || 0;

    if ((siblingMask & (1 << robotIndex)) !== 0) {
      if (sibling.robotVarIndex?.[robotIndex] === val) {
        return `Index ${val} already used by "${sibling.name || "sibling"}"`;
      }
    }
  }

  return null;
};

const LANGUAGE_FIELDS = [
  {
    code: "FR",
    field: "commentFr" as const,
    bg: "bg-blue-100",
    text: "text-blue-800",
  },
  {
    code: "EN",
    field: "commentEn" as const,
    bg: "bg-red-100",
    text: "text-red-800",
  },
  {
    code: "DE",
    field: "commentDe" as const,
    bg: "bg-yellow-100",
    text: "text-yellow-800",
  },
  {
    code: "ES",
    field: "commentEs" as const,
    bg: "bg-orange-100",
    text: "text-orange-800",
  },
];

const handleKeydown = (event: KeyboardEvent): void => {
  if (event.key === "Escape" && props.activeParam) emit("close");
};

onMounted(() => document.addEventListener("keydown", handleKeydown));
onUnmounted(() => document.removeEventListener("keydown", handleKeydown));
</script>

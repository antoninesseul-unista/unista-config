<template>
  <div
    class="fixed inset-0 z-100 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-8 font-sans"
  >
    <div
      class="bg-white rounded-xl shadow-2xl w-full max-w-7xl h-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-200"
    >
      <!-- Header -->
      <div
        class="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between shrink-0"
      >
        <div>
          <h2 class="text-lg font-bold text-gray-800 flex items-center gap-2">
            <svg
              class="w-5 h-5 text-teal-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
            Steps Configuration
          </h2>
          <p
            class="text-xs text-gray-500 mt-1 uppercase tracking-wider font-bold"
          >
            {{ contextName }}
          </p>
        </div>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-red-500 p-2 rounded-md hover:bg-red-50 transition-colors"
          title="Close (Esc)"
        >
          <svg
            class="w-6 h-6"
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

      <!-- Table Body -->
      <div class="flex-1 overflow-auto bg-gray-50/50 p-6">
        <div
          class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
        >
          <table class="w-full text-left border-collapse">
            <thead>
              <tr>
                <!-- Increased width from w-16 to w-24 to fix the hidden numbers issue -->
                <th
                  class="px-3 py-3 bg-gray-100 border-b border-gray-200 font-bold text-[11px] text-gray-500 uppercase tracking-wider w-24 text-center"
                >
                  Step ID
                </th>
                <th
                  class="px-3 py-3 bg-gray-100 border-b border-gray-200 font-bold text-[11px] text-gray-500 uppercase tracking-wider w-48"
                >
                  <span class="text-blue-600">FR</span> Comment
                </th>
                <th
                  class="px-3 py-3 bg-gray-100 border-b border-gray-200 font-bold text-[11px] text-gray-500 uppercase tracking-wider w-48"
                >
                  <span class="text-red-600">EN</span> Comment
                </th>
                <th
                  class="px-3 py-3 bg-gray-100 border-b border-gray-200 font-bold text-[11px] text-gray-500 uppercase tracking-wider w-48"
                >
                  <span class="text-yellow-600">DE</span> Comment
                </th>
                <th
                  class="px-3 py-3 bg-gray-100 border-b border-gray-200 font-bold text-[11px] text-gray-500 uppercase tracking-wider w-48"
                >
                  <span class="text-orange-600">ES</span> Comment
                </th>
                <th
                  class="px-3 py-3 bg-gray-100 border-b border-gray-200 font-bold text-[11px] text-gray-500 uppercase tracking-wider w-32"
                >
                  Reserve 1
                </th>
                <th
                  class="px-3 py-3 bg-gray-100 border-b border-gray-200 font-bold text-[11px] text-gray-500 uppercase tracking-wider w-32"
                >
                  Reserve 2
                </th>
                <th
                  class="px-3 py-3 bg-gray-100 border-b border-gray-200 w-10"
                ></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(step, i) in steps"
                :key="i"
                class="border-b border-gray-100 hover:bg-blue-50/30 transition-colors group"
              >
                <td class="px-2 py-1.5">
                  <!-- Added @change="sortSteps" to auto-sort when the user finishes typing -->
                  <input
                    type="number"
                    v-model.number="step.stepId"
                    @change="sortSteps"
                    class="w-full px-2 py-1.5 border border-gray-200 rounded-md text-sm font-mono text-center focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </td>
                <td class="px-2 py-1.5">
                  <input
                    type="text"
                    v-model="step.commentFr"
                    class="w-full px-2 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </td>
                <td class="px-2 py-1.5">
                  <input
                    type="text"
                    v-model="step.commentEn"
                    class="w-full px-2 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </td>
                <td class="px-2 py-1.5">
                  <input
                    type="text"
                    v-model="step.commentDe"
                    class="w-full px-2 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </td>
                <td class="px-2 py-1.5">
                  <input
                    type="text"
                    v-model="step.commentEs"
                    class="w-full px-2 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </td>
                <td class="px-2 py-1.5">
                  <input
                    type="text"
                    v-model="step.reserve1"
                    class="w-full px-2 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </td>
                <td class="px-2 py-1.5">
                  <input
                    type="text"
                    v-model="step.reserve2"
                    class="w-full px-2 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </td>
                <td class="px-2 py-1.5 text-center">
                  <button
                    @click="removeStep(i)"
                    class="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    title="Remove Step"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Add Row Button -->
        <button
          @click="addStep"
          class="mt-4 flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-md text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors shadow-sm"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Custom Step
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import type { CycleStep } from "../types";

const props = defineProps<{
  steps: CycleStep[];
  contextName: string;
}>();

const emit = defineEmits(["close"]);

/**
 * Sorts the steps array in place by stepId in ascending order.
 * Called automatically when a user finishes typing an ID or adds a new step.
 */
const sortSteps = () => {
  props.steps.sort((a, b) => a.stepId - b.stepId);
};

const addStep = () => {
  const nextId =
    props.steps.length > 0
      ? Math.max(...props.steps.map((s) => s.stepId)) + 10
      : 10;
  props.steps.push({
    stepId: nextId,
    commentFr: "",
    commentEn: "",
    commentDe: "",
    commentEs: "",
    reserve1: "",
    reserve2: "",
  });
  sortSteps();
};

const removeStep = (index: number) => {
  props.steps.splice(index, 1);
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    // Prevent sidebar from catching it at the same time
    event.stopPropagation();
    emit("close");
  }
};

onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
  sortSteps(); // Ensure it's sorted when initially opened
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
});
</script>

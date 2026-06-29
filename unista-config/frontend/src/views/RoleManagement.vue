<template>
  <div
    class="pt-4 pb-8 h-full flex flex-col w-full overflow-hidden relative bg-gray-50/50"
  >
    <div
      class="flex flex-row gap-5 overflow-auto pb-8 pt-2 px-5 flex-1 items-start justify-center"
    >
      <!-- Main Matrix Card -->
      <div
        class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden w-full max-w-7xl flex flex-col transition-all duration-300 relative z-10 overflow-hidden"
      >
        <!-- Global Card Header -->
        <div
          class="border-b border-gray-100 bg-gray-50/50 px-4 py-3 flex items-center justify-between shrink-0"
        >
          <div class="flex flex-col pointer-events-none">
            <span
              class="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1"
              >Security & Access</span
            >
            <div class="h-5 flex items-center">
              <span
                class="text-base font-bold text-gray-900 font-mono leading-none"
                >Role Management Matrix</span
              >
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span
              class="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700"
              >8 Roles</span
            >
          </div>
        </div>

        <div class="overflow-auto flex-1">
          <div class="min-w-[1000px] p-4 flex flex-col gap-4">
            <!-- Sticky Roles Header Row (CSS Grid alignment) -->
            <div
              class="grid grid-cols-[minmax(250px,1fr)_repeat(8,minmax(80px,1fr))] gap-2 px-4 py-2 bg-white sticky top-0 z-20 border-b border-gray-200 shadow-sm rounded-t-md"
            >
              <div
                class="font-bold text-[11px] text-gray-400 uppercase tracking-wider flex items-center"
              >
                Permission Actions
              </div>
              <div v-for="role in roles" :key="role.name" class="text-center">
                <div
                  class="font-bold text-sm text-gray-700 uppercase tracking-wider"
                >
                  {{ role.name }}
                </div>
                <div class="mt-1">
                  <span
                    class="inline-block bg-white text-blue-600 border border-gray-200 rounded px-1.5 py-0.5 text-[11px] font-black tracking-widest shadow-sm"
                  >
                    BIT {{ role.bitIndex }} ({{ role.bitValue }})
                  </span>
                </div>
              </div>
            </div>

            <!-- Categories as Dropdowns -->
            <CollapsibleSection
              v-for="category in permissionMatrix"
              :key="category.name"
              class="shrink-0 shadow-sm"
              :label="category.name"
              v-model="category.isOpen"
            >
              <template #icon>
                <svg
                  :class="['w-3.5 h-3.5', category.color]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <g v-html="category.icon"></g>
                </svg>
              </template>

              <template #badge>
                <span
                  class="ml-1.5 px-1.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-200 text-gray-600"
                >
                  {{ category.items.length }} actions
                </span>
              </template>

              <!-- Actions inside Dropdown -->
              <div class="flex flex-col mt-1">
                <div
                  v-for="item in category.items"
                  :key="item.action"
                  class="grid grid-cols-[minmax(250px,1fr)_repeat(8,minmax(80px,1fr))] gap-2 px-2 py-2.5 border-b border-gray-100 hover:bg-blue-50/30 transition-colors items-center group last:border-b-0"
                >
                  <!-- Action Name -->
                  <div
                    class="text-sm text-gray-600 font-medium truncate pr-4"
                    :title="item.action"
                  >
                    {{ item.action }}
                  </div>

                  <!-- Toggles for each role -->
                  <div
                    v-for="(role, roleIdx) in roles"
                    :key="role.name"
                    class="flex justify-center"
                  >
                    <label
                      class="relative inline-flex items-center cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        v-model="item.values[roleIdx]"
                        class="sr-only peer"
                      />
                      <div
                        class="w-7 h-4 bg-gray-200 rounded-full peer peer-focus:outline-none peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-full shadow-inner opacity-60 group-hover:opacity-100 transition-opacity"
                      ></div>
                    </label>
                  </div>
                </div>
              </div>
            </CollapsibleSection>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CollapsibleSection from "../components/CollapsibleSection.vue";
import {
  rolesState as roles,
  permissionMatrixState as permissionMatrix,
} from "../store/roles";
</script>

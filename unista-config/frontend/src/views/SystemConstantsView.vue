<template>
  <div class="p-8 h-full flex flex-col w-full overflow-hidden bg-gray-50/50">
    <div class="mb-8 shrink-0">
      <h1 class="text-2xl font-bold text-gray-900 tracking-tight">
        System Limits
      </h1>
      <p class="text-sm text-gray-500 mt-1">
        Global machine constraints and operational safety boundaries.
      </p>
    </div>

    <div class="flex flex-row gap-6 overflow-auto flex-1 items-start pb-4 pr-4">
      <div
        class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden shrink-0 w-[400px] flex flex-col transition-all duration-300 relative z-10 hover:shadow-md"
      >
        <div
          class="px-5 py-3.5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between shrink-0"
        >
          <div class="flex flex-col pointer-events-none">
            <span
              class="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1"
              >Configuration</span
            >
            <div class="h-5 flex items-center">
              <span
                class="text-base font-bold text-gray-900 font-mono leading-none"
                >Fault Types</span
              >
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span
              class="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700"
              >4 Items</span
            >
          </div>
        </div>

        <div class="p-4 flex flex-col gap-3">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr>
                <th
                  class="pb-2 font-bold text-[11px] text-gray-500 uppercase tracking-wider w-12 text-center"
                >
                  Index
                </th>
                <th
                  class="pb-2 font-bold text-[11px] text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  class="pb-2 font-bold text-[11px] text-gray-500 uppercase tracking-wider"
                >
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="fault in faultTypes"
                :key="fault.index"
                class="border-t border-gray-100 group hover:bg-gray-50/50 transition-colors"
              >
                <td class="py-2 text-xs font-mono text-center text-gray-500">
                  {{ fault.index }}
                </td>
                <td class="py-2 pr-2">
                  <input
                    type="text"
                    v-model="fault.name"
                    class="w-full px-2 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </td>
                <td class="py-2">
                  <input
                    type="text"
                    v-model="fault.details"
                    class="w-full px-2 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div
        class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden shrink-0 w-[450px] flex flex-col transition-all duration-300 relative z-10 hover:shadow-md"
      >
        <div
          class="px-5 py-3.5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between shrink-0"
        >
          <div class="flex flex-col pointer-events-none">
            <span
              class="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1"
              >Configuration</span
            >
            <div class="h-5 flex items-center">
              <span
                class="text-base font-bold text-gray-900 font-mono leading-none"
                >Architecture Limits</span
              >
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span
              class="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700"
              >99 Items</span
            >
          </div>
        </div>

        <div class="p-4 flex flex-col gap-3">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr>
                <th
                  class="pb-2 font-bold text-[11px] text-gray-500 uppercase tracking-wider w-12 text-center"
                >
                  Index
                </th>
                <th
                  class="pb-2 font-bold text-[11px] text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  class="pb-2 font-bold text-[11px] text-gray-500 uppercase tracking-wider w-24"
                >
                  Max
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="limit in architectureLimits"
                :key="limit.index"
                class="border-t border-gray-100 group hover:bg-gray-50/50 transition-colors"
              >
                <td class="py-1 text-xs font-mono text-center text-gray-500">
                  {{ limit.index }}
                </td>
                <td class="py-1 pr-2">
                  <input
                    type="text"
                    v-model="limit.name"
                    class="w-full px-2 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </td>
                <td class="py-1">
                  <input
                    type="number"
                    v-model.number="limit.max"
                    class="w-full px-2 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-blue-500 outline-none font-mono"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Core imports for system constants management
import { architectureLimits, faultTypes } from "../core";
</script>

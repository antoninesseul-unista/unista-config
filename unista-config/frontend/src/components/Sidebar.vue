<template>
  <aside
    class="w-64 h-screen bg-[#fbfbfa] border-r border-gray-200 flex flex-col"
  >
    <div class="px-6 py-8 shrink-0">
      <div class="flex items-center gap-3">
        <div
          class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200 shrink-0"
        >
          <span class="text-white font-black text-sm">U</span>
        </div>
        <span class="font-bold text-gray-900 tracking-tight whitespace-nowrap"
          >Unista Config</span
        >

        <RouterLink
          to="/updates"
          class="ml-auto text-gray-400 hover:text-gray-900 transition-colors"
          title="System Updates"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
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
        </RouterLink>
      </div>
    </div>

    <nav class="px-3 space-y-0.5 flex-1 overflow-y-auto pb-10">
      <div class="mb-5 px-1 flex gap-2">
        <button
          @click="handleImport"
          class="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 bg-white border border-gray-200 rounded-md text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
          title="Import Configuration"
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
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
          IMPORT
        </button>
        <button
          @click="handleExport"
          class="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 bg-blue-600 border border-transparent rounded-md text-xs font-bold text-white hover:bg-blue-700 transition-all shadow-sm"
          title="Export Configuration"
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
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          EXPORT
        </button>
      </div>

      <div class="mb-1 px-3">
        <span
          class="text-[11px] font-bold text-gray-400 uppercase tracking-widest"
          >Setup</span
        >
      </div>
      <RouterLink
        v-for="item in setupItems"
        :key="item.to.name"
        :to="item.to"
        custom
        v-slot="{ href, navigate, isActive }"
      >
        <a
          :href="href"
          @click="navigate"
          :class="[
            'flex items-center gap-3 px-3 py-1.5 rounded-md text-sm transition-colors cursor-pointer',
            linkClass(isActive),
          ]"
        >
          <svg
            class="w-4 h-4 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <g v-html="item.icon"></g>
          </svg>
          {{ item.label }}
        </a>
      </RouterLink>

      <div class="py-4"><div class="w-full h-px bg-gray-200"></div></div>

      <div class="mb-1 px-3">
        <span
          class="text-[11px] font-bold text-gray-400 uppercase tracking-widest"
          >Security</span
        >
      </div>
      <RouterLink
        v-for="item in securityItems"
        :key="item.to.name"
        :to="item.to"
        custom
        v-slot="{ href, navigate, isActive }"
      >
        <a
          :href="href"
          @click="navigate"
          :class="[
            'flex items-center gap-3 px-3 py-1.5 rounded-md text-sm transition-colors cursor-pointer',
            linkClass(isActive),
          ]"
        >
          <svg
            class="w-4 h-4 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <g v-html="item.icon"></g>
          </svg>
          {{ item.label }}
        </a>
      </RouterLink>

      <div class="py-4"><div class="w-full h-px bg-gray-200"></div></div>

      <div class="mb-1 px-3">
        <span
          class="text-[11px] font-bold text-gray-400 uppercase tracking-widest"
          >Machine</span
        >
      </div>
      <RouterLink
        v-for="item in machineItems"
        :key="item.to.name"
        :to="item.to"
        custom
        v-slot="{ href, navigate, isActive }"
      >
        <a
          :href="href"
          @click="navigate"
          :class="[
            'flex items-center gap-3 px-3 py-1.5 rounded-md text-sm transition-colors cursor-pointer',
            linkClass(isActive),
          ]"
        >
          <svg
            class="w-4 h-4 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <g v-html="item.icon"></g>
          </svg>
          {{ item.label }}
          <span
            v-if="item.showsModuleError && hasModuleErrors"
            class="error-dot"
          ></span>
        </a>
      </RouterLink>
      <RouterLink
        v-for="(def, key) in EQUIPMENT_REGISTRY"
        :key="key"
        :to="{ name: 'equipment', params: { type: key as string } }"
        custom
        v-slot="{ href, navigate, isActive }"
      >
        <a
          :href="href"
          @click="navigate"
          :class="[
            'flex items-center gap-3 px-3 py-1.5 rounded-md text-sm transition-colors cursor-pointer',
            linkClass(isActive),
          ]"
        >
          <svg
            class="w-4 h-4 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <g v-html="def.menuIcon"></g>
          </svg>
          {{ def.label }}
          <span
            v-if="
              equipmentStores[key as keyof typeof equipmentStores]?.hasErrors
                .value
            "
            class="error-dot"
          ></span>
        </a>
      </RouterLink>

      <div class="py-4"><div class="w-full h-px bg-gray-200"></div></div>

      <div class="mb-1 px-3">
        <span
          class="text-[11px] font-bold text-gray-400 uppercase tracking-widest"
          >Production Logic</span
        >
      </div>
      <RouterLink
        v-for="(def, key) in PAGE_REGISTRY"
        :key="key"
        :to="{ name: 'page', params: { type: key as string } }"
        custom
        v-slot="{ href, navigate, isActive }"
      >
        <a
          :href="href"
          @click="navigate"
          :class="[
            'flex items-center gap-3 px-3 py-1.5 rounded-md text-sm transition-colors cursor-pointer',
            linkClass(isActive),
          ]"
        >
          <svg
            class="w-4 h-4 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <g v-html="def.menuIcon"></g>
          </svg>
          {{ def.label }}
          <span
            v-if="pageStores[key as keyof typeof pageStores]?.hasErrors.value"
            class="error-dot"
          ></span>
        </a>
      </RouterLink>

      <div class="py-4"><div class="w-full h-px bg-gray-200"></div></div>

      <div class="mb-1 px-3">
        <span
          class="text-[11px] font-bold text-gray-400 uppercase tracking-widest"
          >Runtime Controls</span
        >
      </div>
      <RouterLink
        v-for="item in runtimeItems"
        :key="item.to.name"
        :to="item.to"
        custom
        v-slot="{ href, navigate, isActive }"
      >
        <a
          :href="href"
          @click="navigate"
          :class="[
            'flex items-center gap-3 px-3 py-1.5 rounded-md text-sm transition-colors cursor-pointer',
            linkClass(isActive),
          ]"
        >
          <svg
            class="w-4 h-4 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <g v-html="item.icon"></g>
          </svg>
          {{ item.label }}
        </a>
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { EQUIPMENT_REGISTRY } from "../config/equipment";
import { NAV_SECTIONS } from "../config/navigation";
import { PAGE_REGISTRY } from "../config/pages";
import { equipmentStores } from "../store/equipment";
import { getModuleErrors } from "../store/modules";
import { pageStores } from "../store/pages";
import { ExportEVToST } from "../../wailsjs/go/backend/App";

/**
 * Type definitions for internal navigation structures.
 */
type NavItem = {
  label: string;
  to: { name: string };
  icon: string;
  showsModuleError?: boolean;
};

/**
 * Handles the logic for importing configuration data.
 */
const handleImport = () => {
  // TODO: Implement the connection to the Wails backend import service
  console.log("Import button clicked");
};

/**
 * Handles the logic for exporting configuration data.
 */
const handleExport = async () => {
  try {
    // 1. Récupère les données depuis ton store
    const evData = equipmentStores.electrovalve.list.value;

    // 2. Appel de la fonction Go via le pont Wails
    // On convertit en 'any' pour éviter les conflits de types entre Vue et Go
    await ExportEVToST(evData as any);

    alert("Configuration successfully exported to machine_parameters.st !");
  } catch (err) {
    console.error("Export failed:", err);
    alert("An error occurred while exporting the file.");
  }
};

// Compute navigation items mappings
const byRouteName = computed(() => {
  const all = [
    ...NAV_SECTIONS.global,
    ...NAV_SECTIONS.architecture,
  ] as NavItem[];
  return Object.fromEntries(all.map((item) => [item.to.name, item]));
});

// Fallback navigation generator to prevent missing routes from crashing the UI
const mustItem = (name: string) => {
  const item = byRouteName.value[name];
  if (!item) {
    return {
      label: name,
      to: { name },
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />`,
    };
  }
  return item;
};

// Map items to specific categories
const setupItems = computed<NavItem[]>(() => [
  mustItem("general"),
  mustItem("systemConstants"),
  mustItem("translations"),
]);

const securityItems = computed<NavItem[]>(() => [
  mustItem("cfr21"),
  mustItem("roles"),
]);

const machineItems = computed<NavItem[]>(() => [mustItem("module")]);

const runtimeItems = computed<NavItem[]>(() => [
  mustItem("faults"),
  mustItem("processButtons"),
  mustItem("cycleButtons"),
  mustItem("counters"),
  mustItem("messageBox"),
]);

// Error checking across modules
const hasModuleErrors = computed(() =>
  Object.values(getModuleErrors.value).some((v) => v),
);

// Dynamic styling logic for active links
const linkClass = (isActive: boolean) =>
  isActive
    ? "bg-blue-50 text-blue-700 font-semibold"
    : "text-gray-600 hover:bg-gray-100";
</script>

<style scoped>
.error-dot {
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  background-color: #ef4444;
  margin-left: auto;
  box-shadow: 0 0 5px rgba(239, 68, 68, 0.5);
}
</style>

// filepath: src/components/Sidebar.vue
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
          <AppIcon name="settings" :size="20" />
        </RouterLink>
      </div>
    </div>

    <nav class="px-3 space-y-0.5 flex-1 overflow-y-auto pb-10">
      <div class="mb-5 px-1 flex flex-col gap-2">
        <div class="flex gap-2">
          <button
            @click="handleImport"
            class="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 bg-white border border-gray-200 rounded-md text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
            title="Import Configuration"
          >
            <AppIcon name="upload" :size="16" />
            IMPORT
          </button>
          <button
            @click="handleExport"
            class="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 bg-blue-600 border border-transparent rounded-md text-xs font-bold text-white hover:bg-blue-700 transition-all shadow-sm"
            title="Export Configuration"
          >
            <AppIcon name="download" :size="16" />
            EXPORT
          </button>
        </div>
        <button
          @click="handleGenerate"
          :disabled="hasGlobalErrors"
          :class="[
            'w-full flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-bold transition-all shadow-sm border',
            hasGlobalErrors
              ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-70'
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-emerald-600 hover:border-emerald-200 cursor-pointer',
          ]"
          :title="
            hasGlobalErrors
              ? 'Please fix the errors before generating'
              : 'Generate files'
          "
        >
          <AppIcon name="file-code" :size="16" />
          GENERATE
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
          <AppIcon :name="item.icon" :size="16" class="shrink-0" />
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
          <AppIcon :name="item.icon" :size="16" class="shrink-0" />
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
          <AppIcon :name="item.icon" :size="16" class="shrink-0" />
          {{ item.label }}
          <span
            v-if="item.showsModuleError && hasModuleErrors"
            class="error-dot"
          ></span>
        </a>
      </RouterLink>

      <RouterLink
        v-for="(def, key) in equipmentRegistry"
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
          <AppIcon :name="def.menuIcon ?? 'box'" :size="16" class="shrink-0" />
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
        v-if="pageRegistry['product']"
        :to="{ name: 'page', params: { type: 'product' } }"
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
          <AppIcon
            :name="pageRegistry['product'].menuIcon ?? 'file'"
            :size="16"
            class="shrink-0"
          />
          {{ pageRegistry["product"].label }}
          <span
            v-if="pageStores['product']?.hasErrors.value"
            class="error-dot"
          ></span>
        </a>
      </RouterLink>

      <RouterLink
        :to="{ name: 'machineLogic' }"
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
          <AppIcon name="cpu" :size="16" class="shrink-0" />
          Machine Logic
          <span v-if="hasMachineLogicErrors" class="error-dot"></span>
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
          <AppIcon :name="item.icon" :size="16" class="shrink-0" />
          {{ item.label }}
        </a>
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { NAV_SECTIONS } from "../config/navigation";
import { toast } from "../composables/useToast";
import AppIcon from "./AppIcon.vue";
import {
  useConfigStore,
  equipmentRegistry,
  pageRegistry,
  getModuleErrors,
  PersistenceService,
  GenerationService,
} from "../core";

const { equipment: equipmentStores, pages: pageStores } = useConfigStore();

type NavItem = {
  label: string;
  to: { name: string };
  icon: string;
  showsModuleError?: boolean;
};

const handleImport = async () => {
  try {
    const result = await PersistenceService.importConfig();
    if (result === "cancelled") return;
    toast.success("Configuration imported", {
      description: "Application state has been restored.",
    });
  } catch (err) {
    console.error("Import failed:", err);
    const message = err instanceof Error ? err.message : String(err);
    toast.error("Import failed", { description: message });
  }
};

const handleExport = async () => {
  try {
    const result = await PersistenceService.exportConfig();
    if (result === "exported") {
      toast.success("Configuration exported", {
        description: "JSON file has been saved.",
      });
    }
  } catch (err) {
    console.error("Export failed:", err);
    const message = err instanceof Error ? err.message : String(err);
    toast.error("Export failed", { description: message });
  }
};

const handleGenerate = async () => {
  if (hasGlobalErrors.value) {
    toast.error("Generation blocked", {
      description: "Please fix configuration errors before generating.",
    });
    return;
  }

  try {
    const result = await GenerationService.generate();
    if (result === "cancelled") return;
    toast.success("Generation complete", {
      description: "Files have been generated successfully.",
    });
  } catch (err) {
    console.error("ST generation failed:", err);
    const message = err instanceof Error ? err.message : String(err);
    toast.error("Generation failed", { description: message });
  }
};

const byRouteName = computed(() => {
  const all = [
    ...NAV_SECTIONS.global,
    ...NAV_SECTIONS.architecture,
  ] as NavItem[];
  return Object.fromEntries(all.map((item) => [item.to.name, item]));
});

const mustItem = (name: string) => {
  const item = byRouteName.value[name];
  if (!item) {
    return { label: name, to: { name }, icon: "plus" };
  }
  return item;
};

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

const hasModuleErrors = computed(() =>
  Object.values(getModuleErrors.value).some((v) => v),
);

// Specifically tracks errors strictly within our grouped Logic page
const hasMachineLogicErrors = computed(() => {
  return (
    pageStores["process"]?.hasErrors.value ||
    pageStores["setting"]?.hasErrors.value ||
    pageStores["info"]?.hasErrors.value
  );
});

const hasGlobalErrors = computed((): boolean => {
  if (hasModuleErrors.value) return true;

  for (const key of Object.keys(equipmentRegistry.value)) {
    if (equipmentStores[key as keyof typeof equipmentStores]?.hasErrors.value) {
      return true;
    }
  }

  for (const key of Object.keys(pageRegistry.value)) {
    if (pageStores[key as keyof typeof pageStores]?.hasErrors.value) {
      return true;
    }
  }

  return false;
});

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

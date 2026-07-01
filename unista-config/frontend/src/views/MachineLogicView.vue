<script setup lang="ts">
import { computed, watchEffect } from "vue";
import DashboardParameterEditor from "../components/DashboardParameterEditor.vue";
import { appState } from "../core";
import { PARAM_CATEGORIES } from "../config/paramCategories";
import { SINGLETON_PAGES } from "../config/navigation";

const SINGLETON_DESCRIPTIONS: Record<string, string> = {
  Process:
    "Defines machine operating modes such as emptying, and other production modes.",
  Setting:
    "Defines recipe checklist parameters that can be enabled or disabled.",
  Info: "Displays read-only HMI data such as power consumption and measurements.",
};

const PARAM_SECTIONS = PARAM_CATEGORIES.map((cat) => ({
    key: cat.key,
  label: cat.label,
  toggleKey: cat.toggleKey,
  colorDot: cat.color,
  cols: 2 as const,
}));

// Safely isolates the single instances based on DRY constants
const machineLogicEntities = computed(() => {
  return SINGLETON_PAGES.map((type) => appState.pages[type]?.[0]).filter(
    Boolean,
  );
});

watchEffect(() => {
  machineLogicEntities.value.forEach((entity) => {
    if (entity && SINGLETON_DESCRIPTIONS[entity.name]) {
      entity.detail = SINGLETON_DESCRIPTIONS[entity.name];
    }
  });
});
</script>

import { shallowRef } from "vue";
import type {
  EquipmentDefinition,
  EquipmentFieldSection,
  PageDefinition,
} from "../config/equipment";
import * as GoRegistry from "../../wailsjs/go/registry/Service";
import { appState } from "./state";

export const equipmentRegistry = shallowRef<Record<string, EquipmentDefinition>>({});
export const pageRegistry = shallowRef<Record<string, PageDefinition>>({});
export const equipmentFieldSections = shallowRef<EquipmentFieldSection[]>([]);

export async function initRegistries(): Promise<void> {
  const [equipment, pages, sections] = await Promise.all([
    GoRegistry.GetEquipmentRegistry(),
    GoRegistry.GetPageRegistry(),
    GoRegistry.GetEquipmentFieldSections(),
  ]);

  equipmentRegistry.value = equipment as Record<string, EquipmentDefinition>;
  pageRegistry.value = pages as Record<string, PageDefinition>;
  equipmentFieldSections.value = sections as EquipmentFieldSection[];

  for (const key of Object.keys(equipmentRegistry.value)) {
    if (!appState.equipment[key]) {
      appState.equipment[key] = [];
    }
  }

  for (const key of Object.keys(pageRegistry.value)) {
    if (!appState.pages[key]) {
      appState.pages[key] = [];
    }
  }

  const { initEquipmentStores, initPageStores } = await import("./stores");
  initEquipmentStores();
  initPageStores();
}

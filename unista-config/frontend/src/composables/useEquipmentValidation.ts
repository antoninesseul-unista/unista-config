import { computed, ref, watch, type ComputedRef } from "vue";
import type { ConfigField, EquipmentDefinition, EquipmentInstance } from "../config/equipment";
import { equipmentStores, createEquipmentStore, modules } from "../core/stores";
import type { models } from "../../wailsjs/go/models";
import {
  buildValidationCaches,
  getErrorMessage,
  getParamErrorMessage,
  hasLocalError,
  hasParamsError,
  isFieldError,
  isFieldVisible as isFieldVisibleFromCache,
  isNameError,
  isParentLinkBroken,
  type ValidationCaches,
} from "../core/validation";

type EquipmentStore = ReturnType<typeof createEquipmentStore>;

const emptyCaches = (): ValidationCaches => ({
  ipValidity: {},
  paramErrorMessages: {},
  fieldVisibility: {},
});

export function useEquipmentValidation(store: ComputedRef<EquipmentStore>) {
  const robotsList = computed(() => equipmentStores.robot?.list.value ?? []);
  const workplaceList = computed(() => equipmentStores.workplace?.list.value ?? []);

  const allEquipmentList = computed(() =>
    Object.values(equipmentStores)
      .map((s) => s?.list.value ?? [])
      .flat(),
  );

  const caches = ref<ValidationCaches>(emptyCaches());

  watch(
    () => store.value.list.value,
    async (list) => {
      caches.value = await buildValidationCaches(list, store.value?.definition);
    },
    { deep: true, immediate: true },
  );

  const definition = computed(() => store.value?.definition);

  const isFieldVisible = (eq: EquipmentInstance, cfg: ConfigField) =>
    isFieldVisibleFromCache(eq, cfg, caches.value);

  const checkParentLinkBroken = (eq: EquipmentInstance) =>
    isParentLinkBroken(eq, definition.value, modules.value, robotsList.value);

  const checkNameError = (eq: EquipmentInstance) =>
    isNameError(eq, allEquipmentList.value);

  const checkFieldError = (eq: EquipmentInstance, field: string) => {
    const def = definition.value;
    if (!def) return false;
    return isFieldError(
      eq,
      field,
      def,
      caches.value,
      allEquipmentList.value,
      workplaceList.value,
    );
  };

  const checkParamErrorMessage = (param: models.Parameter) =>
    getParamErrorMessage(param, caches.value);

  const checkParamsError = (eq: EquipmentInstance) => hasParamsError(eq, caches.value);

  const checkLocalError = (eq: EquipmentInstance) => {
    const def = definition.value;
    if (!def) return false;
    return hasLocalError(
      eq,
      def,
      caches.value,
      modules.value,
      robotsList.value,
      allEquipmentList.value,
      workplaceList.value,
    );
  };

  const checkErrorMessage = (eq: EquipmentInstance) => {
    const def = definition.value;
    if (!def) return "Configuration Error";
    return getErrorMessage(
      eq,
      def,
      caches.value,
      modules.value,
      robotsList.value,
      allEquipmentList.value,
      workplaceList.value,
    );
  };

  return {
    isFieldVisible,
    isParentLinkBroken: checkParentLinkBroken,
    isNameError: checkNameError,
    isFieldError: checkFieldError,
    getParamErrorMessage: checkParamErrorMessage,
    hasParamsError: checkParamsError,
    hasLocalError: checkLocalError,
    getErrorMessage: checkErrorMessage,
  };
}

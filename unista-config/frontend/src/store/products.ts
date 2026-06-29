import { ref } from "vue";
import type { MachineProduct } from "../types";

export const products = ref<MachineProduct[]>([]);

export const getProductErrors: Record<string, boolean> = {};

export function getProductErrorMessage(_product: MachineProduct) {
  return "";
}

export function addProductAction() {
  return;
}

export function removeProduct(_index: number) {
  return;
}

export function syncProductIndexes() {
  return;
}

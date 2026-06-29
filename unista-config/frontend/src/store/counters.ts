import { ref } from "vue";
import type { CounterGroup, Parameter } from "../types";
import { generateId, makeParam } from "../utils/helpers";

/**
 * Generates the single Machine Rate counter.
 */
const createMachineRate = (): CounterGroup => {
  const p = makeParam("Machine Rate", 1);
  p.actif = false;
  p.commentFr = "Cadence machine";
  p.commentEn = "Machine rate";
  p.commentDe = "Maschinenrate";
  p.commentEs = "Rendimiento de la máquina";

  return {
    id: generateId(),
    name: "Machine Rate",
    ui: { show: true },
    parameters: [p],
  };
};

/**
 * Generates the 100 Product Counters.
 */
const createProductCounters = (): CounterGroup => {
  const params: Parameter[] = Array.from({ length: 100 }, (_, i) => {
    const p = makeParam(`Counter ${i + 1}`, i + 1);
    p.actif = false;
    return p;
  });

  // Adding the global group name translations to the first item as requested,
  // though the UI separates the group conceptually.
  params[0].commentFr = "Compteurs produits";
  params[0].commentEn = "Products counters";
  params[0].commentDe = "Produktzähler";
  params[0].commentEs = "Contadores de productos";

  return {
    id: generateId(),
    name: "Product Counters",
    ui: { show: true },
    parameters: params,
  };
};

/**
 * Generates the 5 General Cadences with specific defaults for the first 3.
 */
const createGeneralCadences = (): CounterGroup => {
  const params: Parameter[] = Array.from({ length: 5 }, (_, i) => {
    const p = makeParam(`Cadence ${i + 1}`, i + 1);
    p.actif = false;

    if (i === 0) {
      p.commentFr = "Cadence entrée machine";
      p.commentEn = "Infeed rate";
      p.commentDe = "Zuführungsrate";
      p.commentEs = "Velocidad de alimentación";
    } else if (i === 1) {
      p.commentFr = "Cadence magasins carton";
      p.commentEn = "Box magazines rate";
      p.commentDe = "Kastenmagazinrate";
      p.commentEs = "Velocidad de los cargadores de cajas";
    } else if (i === 2) {
      p.commentFr = "Cadence sortie cartons";
      p.commentEn = "Outfeed rate";
      p.commentDe = "Auslaufgeschwindigkeit";
      p.commentEs = "Velocidad de salida";
    }

    return p;
  });

  return {
    id: generateId(),
    name: "General Cadences",
    ui: { show: true },
    parameters: params,
  };
};

/**
 * Persistent Master List of all counter groups.
 */
export const counterGroups = ref<CounterGroup[]>([
  createMachineRate(),
  createProductCounters(),
  createGeneralCadences(),
]);

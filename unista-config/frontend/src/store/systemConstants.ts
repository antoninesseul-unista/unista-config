import { ref } from "vue";
import type { ArchitectureLimit, FaultType } from "../types";

export const faultTypes = ref<FaultType[]>([
  { index: 1, name: "FAULT_IMMEDIAT", details: "Bloquant Immediat" },
  { index: 2, name: "FAULT_ENDCYCLE", details: "Bloquant Fin de cycle" },
  { index: 3, name: "ALARM", details: "Non Bloquant" },
  { index: 4, name: "MESSAGE", details: "Message Opérateur" },
]);

/**
 * Initialize architecture limits with the specified default values.
 */
const initialArchitectureLimits: ArchitectureLimit[] = [
  { index: 1, name: "ELECTROVALVES", max: 120 },
  { index: 2, name: "VACUUMS", max: 48 },
  { index: 3, name: "DIG_INPUTS", max: 200 },
  { index: 4, name: "ANA_INPUTS", max: 24 },
  { index: 5, name: "ANA_OUTPUTS", max: 24 },
  { index: 6, name: "DIRECT_MOTORS", max: 80 },
  { index: 7, name: "AXIS", max: 60 },
  { index: 8, name: "AXIS_POINTS", max: 200 },
  { index: 9, name: "CAMERAS", max: 20 },
  { index: 10, name: "ROBOTS", max: 8 },
  { index: 11, name: "WORKPLACES", max: 192 },
  { index: 12, name: "ROBOT_POINTS", max: 255 },
  { index: 13, name: "MECHATRO", max: 1 },
  { index: 14, name: "AXIS_ADV", max: 1 },
  { index: 15, name: "MECHATRO_POINTS", max: 30 },
  { index: 16, name: "", max: 0 },
  { index: 17, name: "", max: 0 },
  { index: 18, name: "", max: 0 },
  { index: 19, name: "PROCESS", max: 1 },
  { index: 20, name: "PRODUCTS", max: 8 },
  { index: 21, name: "SETTINGS", max: 1 },
  { index: 22, name: "FUNCTION", max: 6 },
  { index: 23, name: "CHECKLIST", max: 1 },
  { index: 24, name: "SAFETY", max: 5 },
  { index: 25, name: "", max: 0 },
  { index: 26, name: "", max: 0 },
  { index: 27, name: "", max: 0 },
  { index: 28, name: "", max: 0 },
  { index: 29, name: "HWD_SAF", max: 1 },
  { index: 30, name: "HWD_STD", max: 1 },
  { index: 31, name: "HWD_COM", max: 1 },
  { index: 32, name: "IHM", max: 1 },
];

// Automatically generate up to index 99
for (let i = 33; i <= 99; i++) {
  initialArchitectureLimits.push({ index: i, name: "", max: 0 });
}

export const architectureLimits = ref<ArchitectureLimit[]>(initialArchitectureLimits);

import type { CycleStep } from "../types";

/**
 * Helper factory to create a single step quickly.
 * Automatically injects the default translations based on the stepId if omitted.
 */
const s = (
  stepId: number,
  commentFr: string,
  commentEn: string = `Step ${stepId}`,
  commentDe: string = `Schritt ${stepId}`,
  commentEs: string = `Paso ${stepId}`,
): CycleStep => ({
  stepId,
  commentFr,
  commentEn,
  commentDe,
  commentEs,
  reserve1: "",
  reserve2: "",
});

/**
 * Generates the default steps requested:
 * 0, 1, 10, 20 through 100 (by increments of 10), and 999.
 */
export const generateStepsFor = (
  emIndex: number,
  cycleIndex: number,
): CycleStep[] => {
  // 1. Initialize with the required base steps
  const steps: CycleStep[] = [
    s(0, "Pas renseigné", "Not informed", "Nicht angegeben", "No informado"),
    s(1, "Init", "Init", "Init", "Inicializar"),
    s(10, "Démarrage", "Starting", "Starten", "Iniciando"),
  ];

  // 2. Automatically generate generic steps from 20 to 100
  for (let i = 20; i <= 100; i += 10) {
    // Relying on the 's' function defaults for English, German, and Spanish
    steps.push(s(i, `Etape ${i}`));
  }

  // 3. Add the final undefined step
  steps.push(s(999, "Indéfini", "Undefined", "Undefiniert", "Indefinido"));

  return steps;
};

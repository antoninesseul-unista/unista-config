import { appState } from "../../core/state";

export interface IHardwareReferenceProvider {
  getReferences(controllerType?: string, driveReference?: string): string[];
  getHardwareDetails(
    reference: string,
  ): { nodeNumber: number; axesCount: number } | null;
}

export class StateHardwareProvider implements IHardwareReferenceProvider {
  public getReferences(
    controllerType?: string,
    driveReference?: string,
  ): string[] {
    const detected = appState.detectedHardware || [];
    if (detected.length === 0) return [];

    let targetCategory = "";
    if (controllerType === "ACOPOS") {
      if (driveReference === "P3") targetCategory = "ACOPOS_P3";
      else if (driveReference === "MICRO") targetCategory = "ACOPOS_MICRO";
      else if (driveReference === "MULTI") targetCategory = "ACOPOS_MULTI";
    } else if (controllerType === "INVERTER") {
      targetCategory = "ACOPOS_INVERTER";
    } else if (controllerType === "PSE") {
      targetCategory = "PSE";
    } else if (controllerType === "STEPPER") {
      targetCategory = "STEPPER";
    }

    const results: string[] = [];
    for (const hw of detected) {
      if (!targetCategory || hw.category === targetCategory) {
        results.push(hw.name); // Affiche uniquement le nom du module
      }
    }
    return results;
  }

  // Renvoie les détails pour populer le Node et la liste déroulante des Canaux
  public getHardwareDetails(
    reference: string,
  ): { nodeNumber: number; axesCount: number } | null {
    const detected = appState.detectedHardware || [];
    const hw = detected.find((h) => h.name === reference);
    if (hw) {
      return { nodeNumber: hw.nodeNumber, axesCount: hw.axesCount };
    }
    return null;
  }
}

export const hardwareProvider = new StateHardwareProvider();

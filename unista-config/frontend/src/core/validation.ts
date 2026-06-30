import type { ConfigField, EquipmentDefinition, EquipmentInstance } from "../config/equipment";
import { CalculationService } from "./wails";
import type { models } from "../../wailsjs/go/models";

export interface ValidationCaches {
  ipValidity: Record<string, boolean>;
  paramErrorMessages: Record<number, string>;
  fieldVisibility: Record<string, Record<string, boolean>>;
}

export const getRobotId = (eq: EquipmentInstance): string | null => {
  if (eq.type === "workplace") return eq.robotId || null;
  return null;
};

export const allFieldDefs = (definition: EquipmentDefinition): ConfigField[] => [
  ...(definition.configFields || []),
  ...(definition.controllerFields || []),
  ...(definition.processFields || []),
];

export async function buildValidationCaches(
  list: EquipmentInstance[],
  definition: EquipmentDefinition | undefined,
): Promise<ValidationCaches> {
  const ipValidity: Record<string, boolean> = {};
  const paramErrorMessages: Record<number, string> = {};
  const fieldVisibility: Record<string, Record<string, boolean>> = {};
  const allParams = list.flatMap((eq) => eq.parameters ?? []);
  const allFields = definition ? allFieldDefs(definition) : [];

  for (const eq of list) {
    const ip = eq.ipAddress as string | undefined;
    if (ip) ipValidity[eq.id] = await CalculationService.isValidIPAddress(ip);

    fieldVisibility[eq.id] = {};
    for (const field of allFields) {
      fieldVisibility[eq.id][field.field] = await CalculationService.isConfigFieldVisible(
        eq.type,
        eq as Record<string, unknown>,
        field.field,
      );
    }
  }

  for (const param of allParams) {
    if (await CalculationService.hasRobotVarIndexError(param, allParams)) {
      const mask = await CalculationService.parseRobotMask(param.robotMask);
      for (let r = 0; r < 32; r++) {
        if (!(await CalculationService.isRobotSelected(mask, r))) continue;
        const result = await CalculationService.validateRobotVarIndexForRobot(param, r, allParams);
        if (result.hasError) {
          paramErrorMessages[param.id] = result.message;
          break;
        }
      }
    }
  }

  return { ipValidity, paramErrorMessages, fieldVisibility };
}

export const isFieldVisible = (
  eq: EquipmentInstance,
  cfg: ConfigField,
  caches: ValidationCaches,
): boolean => caches.fieldVisibility[eq.id]?.[cfg.field] ?? true;

export const isParentLinkBroken = (
  eq: EquipmentInstance,
  definition: EquipmentDefinition | undefined,
  moduleList: models.MachineModule[],
  robots: EquipmentInstance[],
): boolean => {
  if (!eq.enable) return false;

  if (definition?.hasEmLink) {
    if (!eq.emId) return true;
    const mod = moduleList.find((m) => m.id === eq.emId);
    return !mod || !mod.enable;
  }

  if (definition?.type === "workplace") {
    if (!eq.robotId) return true;
    const parentRobot = robots.find((r) => r.id === eq.robotId);
    return !parentRobot || !parentRobot.enable;
  }

  return false;
};

export const isNameError = (
  eq: EquipmentInstance,
  allEquipment: EquipmentInstance[],
): boolean => {
  if (!eq.enable) return false;
  if (!eq.name || eq.name.trim() === "") return true;

  const thisRobotId = getRobotId(eq);
  return allEquipment.some((e) => {
    if (!e.enable || e.id === eq.id || e.name !== eq.name) return false;
    const otherRobotId = getRobotId(e);
    if (!thisRobotId && !otherRobotId) return true;
    if (thisRobotId && otherRobotId && thisRobotId === otherRobotId) return true;
    return false;
  });
};

export const isFieldError = (
  eq: EquipmentInstance,
  field: string,
  definition: EquipmentDefinition,
  caches: ValidationCaches,
  allEquipment: EquipmentInstance[],
  workplaceList: EquipmentInstance[],
): boolean => {
  if (!eq.enable) return false;

  const cfg = allFieldDefs(definition).find((f) => f.field === field);

  if (cfg && (cfg.type === "select" || cfg.type === "number") && eq[field] === null) {
    if (!isFieldVisible(eq, cfg, caches)) return false;
    return true;
  }

  if (field === "jobId" && definition.type === "workplace") {
    if (!eq.jobId || eq.jobId === 0) return true;
    if (eq.robotId) {
      const duplicate = workplaceList.find(
        (j) => j.id !== eq.id && j.robotId === eq.robotId && j.jobId === eq.jobId,
      );
      if (duplicate) return true;
    }
  }

  if (field === "ipAddress") {
    const ip = eq.ipAddress as string | undefined;
    if (!ip || ip.trim() === "") return true;
    if (caches.ipValidity[eq.id] === false) return true;
    return allEquipment.some(
      (e) =>
        e.enable &&
        e.id !== eq.id &&
        e.ipAddress !== undefined &&
        e.ipAddress === eq.ipAddress,
    );
  }

  if (
    definition.type === "camera" &&
    eq.managedByController === true &&
    isFieldVisible(eq, { field: "managedByController", label: "", type: "boolean" }, caches)
  ) {
    const requiredControllerFields = [
      "controllerName",
      "controllerId",
      "channel",
      "startAreaExchanges",
      "nbInfos",
      "exchangesSize",
    ];
    if (requiredControllerFields.includes(field)) {
      return eq[field] === null || eq[field] === undefined || eq[field] === "";
    }
  }

  return false;
};

export const getParamErrorMessage = (
  param: models.Parameter,
  caches: ValidationCaches,
): string | null => caches.paramErrorMessages[param.id] ?? null;

export const hasParamsError = (eq: EquipmentInstance, caches: ValidationCaches): boolean => {
  if (!eq.enable) return false;
  return (eq.parameters ?? []).some((p) => getParamErrorMessage(p, caches) !== null);
};

export const hasLocalError = (
  eq: EquipmentInstance,
  definition: EquipmentDefinition,
  caches: ValidationCaches,
  moduleList: models.MachineModule[],
  robots: EquipmentInstance[],
  allEquipment: EquipmentInstance[],
  workplaceList: EquipmentInstance[],
): boolean => {
  if (!eq.enable) return false;
  if (isParentLinkBroken(eq, definition, moduleList, robots) || isNameError(eq, allEquipment)) {
    return true;
  }

  if (allFieldDefs(definition).some((f) => isFieldError(eq, f.field, definition, caches, allEquipment, workplaceList))) {
    return true;
  }

  return hasParamsError(eq, caches);
};

export const getErrorMessage = (
  eq: EquipmentInstance,
  definition: EquipmentDefinition,
  caches: ValidationCaches,
  moduleList: models.MachineModule[],
  robots: EquipmentInstance[],
  allEquipment: EquipmentInstance[],
  workplaceList: EquipmentInstance[],
): string => {
  if (isParentLinkBroken(eq, definition, moduleList, robots)) {
    return definition.type === "workplace"
      ? "Robot Disabled or Missing"
      : "Module Disabled or Missing";
  }

  if (!eq.name || eq.name.trim() === "") return "Name cannot be empty";
  if (isNameError(eq, allEquipment)) return "Name must be unique";

  const ipAddress = eq.ipAddress as string | undefined;
  if (ipAddress !== undefined) {
    if (!ipAddress || ipAddress.trim() === "") return "IP Address required";
    if (caches.ipValidity[eq.id] === false) return "Invalid IP Format";
    if (isFieldError(eq, "ipAddress", definition, caches, allEquipment, workplaceList)) {
      return "IP Address must be unique";
    }
  }

  if (definition.type === "workplace") {
    if (!eq.jobId || eq.jobId === 0) return "Invalid Job ID (cannot be 0)";
    if (isFieldError(eq, "jobId", definition, caches, allEquipment, workplaceList)) {
      return "Duplicate Job ID for this Robot";
    }
  }

  if (
    definition.type === "camera" &&
    eq.managedByController === true &&
    isFieldVisible(eq, { field: "managedByController", label: "", type: "boolean" }, caches)
  ) {
    if (
      isFieldError(eq, "controllerName", definition, caches, allEquipment, workplaceList) ||
      isFieldError(eq, "controllerId", definition, caches, allEquipment, workplaceList) ||
      isFieldError(eq, "channel", definition, caches, allEquipment, workplaceList)
    ) {
      return "Missing Controller Config";
    }
  }

  const missingField = allFieldDefs(definition).find(
    (f) =>
      (f.type === "select" || f.type === "number") &&
      eq[f.field] === null &&
      isFieldVisible(eq, f, caches),
  );
  if (missingField) return `Please select a value for "${missingField.label}"`;

  const badParam = (eq.parameters ?? []).find((p) => getParamErrorMessage(p, caches) !== null);
  if (badParam) return getParamErrorMessage(badParam, caches)!;

  return "Configuration Error";
};

export const listHasErrors = (
  list: EquipmentInstance[],
  definition: EquipmentDefinition,
  caches: ValidationCaches,
  moduleList: models.MachineModule[],
  robots: EquipmentInstance[],
  allEquipment: EquipmentInstance[],
  workplaceList: EquipmentInstance[],
): boolean =>
  list.some((eq) =>
    hasLocalError(eq, definition, caches, moduleList, robots, allEquipment, workplaceList),
  );

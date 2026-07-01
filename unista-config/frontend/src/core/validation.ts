import type {
  ConfigField,
  EquipmentDefinition,
  EquipmentInstance,
} from "../config/equipment";
import type { models } from "../../wailsjs/go/models";
import { hardwareProvider } from "../services/hardware/hardwareProvider";
import { isValidIPAddress } from "../utils/validators";

export interface ValidationCaches {
  ipValidity: Record<string, boolean>;
  paramErrorMessages: Record<number, string>;
  fieldVisibility: Record<string, Record<string, boolean>>;
}

// --- ROBOT BITMASK HELPERS ---

export const parseRobotMask = (mask?: string | null): number => {
  if (!mask || mask.trim() === "") return 0;
  const val = parseInt(mask.trim(), 10);
  return isNaN(val) || val < 0 ? 0 : val;
};

export const isRobotSelected = (mask: number, robotIndex: number): boolean => {
  if (robotIndex < 0 || robotIndex >= 32) return false;
  return (mask & (1 << robotIndex)) !== 0;
};

export const toggleRobotMask = (mask: number, robotIndex: number): number => {
  if (robotIndex < 0 || robotIndex >= 32) return mask;
  return mask ^ (1 << robotIndex);
};

export const validateRobotVarIndexForRobot = (
  param: models.Parameter,
  robotIndex: number,
  allParameters: models.Parameter[],
): { hasError: boolean; message: string } => {
  const mask = parseRobotMask(param.robotMask);
  if (!isRobotSelected(mask, robotIndex))
    return { hasError: false, message: "" };

  const val = param.robotVarIndex?.[robotIndex];
  if (val == null || val <= 0)
    return { hasError: true, message: "Index required (> 0)" };

  for (const sibling of allParameters) {
    if (sibling.id === param.id && sibling.name === param.name) continue;

    const siblingMask = parseRobotMask(sibling.robotMask);
    if (!isRobotSelected(siblingMask, robotIndex)) continue;

    const siblingVal = sibling.robotVarIndex?.[robotIndex];
    if (siblingVal != null && val != null && siblingVal === val) {
      const name = sibling.name || "sibling parameter";
      return {
        hasError: true,
        message: `Index ${val} is already used by component "${name}"`,
      };
    }
  }
  return { hasError: false, message: "" };
};

export const hasRobotVarIndexError = (
  param: models.Parameter,
  allParameters: models.Parameter[],
): boolean => {
  const mask = parseRobotMask(param.robotMask);
  if (mask === 0) return false;

  for (let r = 0; r < 32; r++) {
    if (!isRobotSelected(mask, r)) continue;
    if (validateRobotVarIndexForRobot(param, r, allParameters).hasError)
      return true;
  }
  return false;
};

// --- DYNAMIC VISIBILITY HELPER (Migrated from Go) ---

export const isConfigFieldVisibleCore = (
  equipmentType: string,
  equipment: Record<string, any>,
  field: string,
): boolean => {
  if (!equipment.enable) return false;

  switch (equipmentType) {
    case "camera": {
      const brand = equipment.brand as string | undefined;
      const managedByController = equipment.managedByController as boolean;

      // STRICT BOOLEAN FIX: Use Optional Chaining and Nullish Coalescing
      const isBrandCompatible =
        brand === "CAMERA_UNDEFINED" || (brand?.includes("Keyence") ?? false);

      if (field === "managedByController") return isBrandCompatible;

      const ctrlFields = [
        "controllerName",
        "controllerId",
        "channel",
        "startAreaExchanges",
        "nbInfos",
        "exchangesSize",
      ];
      if (ctrlFields.includes(field)) {
        return isBrandCompatible && managedByController;
      }
      return true;
    }
    case "axis": {
      const controllerType = equipment.controllerType as string;
      const driveReference = equipment.driveReference as string;
      const motionType = equipment.motionType as string;
      const homingType = equipment.homingType as string;
      const autoTuneMode = equipment.autoTuneMode as string;

      switch (field) {
        case "driveReference":
          return controllerType === "ACOPOS" || controllerType === "INVERTER";
        case "motorReference":
          return (
            (controllerType === "ACOPOS" && driveReference === "P3") ||
            controllerType === "PSE"
          );
        case "units":
          return controllerType !== "INVERTER";
        case "resolution":
          return controllerType === "ACOPOS";
        case "lowerPosition":
        case "upperPosition":
          return (
            motionType === "LIMITED_ROTARY" || motionType === "LIMITED_LINEAR"
          );
        case "maxTorque":
          return controllerType === "ACOPOS" || controllerType === "PSE";
        case "stopTorque":
        case "followingError":
          return controllerType === "ACOPOS";
        case "period":
          return (
            motionType === "PERIODIC_ROTARY" || motionType === "PERIODIC_LINEAR"
          );
        case "transformation":
          return (
            motionType === "PERIODIC_LINEAR" ||
            motionType === "LINEAR" ||
            motionType === "LIMITED_LINEAR"
          );
        case "homingType":
        case "homingPosition":
          return driveReference !== "P76";
        case "homingDirection":
        case "homingVelocity":
        case "homingStartVelocity":
        case "homingAcceleration":
        case "homingBackoffDistance":
          return (
            driveReference !== "P76" &&
            (homingType === "ABSOLUTE_SWITCH" ||
              homingType === "BLOCK_TORQUE" ||
              homingType === "BLOCK_LAG_ERROR")
          );
        case "homingTorqueLimit":
          return (
            driveReference !== "P76" &&
            (homingType === "BLOCK_TORQUE" || homingType === "BLOCK_LAG_ERROR")
          );
        case "homingFollowingError":
          return driveReference !== "P76" && homingType === "BLOCK_LAG_ERROR";
        case "autoTuneMode":
        case "autoTuneOrientation":
          return controllerType === "ACOPOS";
        case "autoTuneMaxCurrentPercentage":
          if (controllerType !== "ACOPOS") return false;
          return (
            autoTuneMode === "AXIS_TUNE_AUTOMATIC" ||
            autoTuneMode === "AXIS_TUNE_SPEED" ||
            autoTuneMode === "AXIS_TUNE_POSITION"
          );
        case "inverterEnable60Hz":
        case "inverterPowerW":
        case "inverterCosPhi":
        case "inverterVoltageV":
        case "inverterCurrentA":
        case "inverterMotorSpeedRpm":
        case "inverterMaxFrequencyHz":
          return controllerType === "INVERTER";
        default:
          return true;
      }
    }
  }
  return true;
};

// --- GENERAL VALIDATION HELPERS ---

export const getRobotId = (eq: EquipmentInstance): string | null => {
  if (eq.type === "workplace") return eq.robotId || null;
  return null;
};

export const allFieldDefs = (
  definition: EquipmentDefinition,
): ConfigField[] => [
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
    if (ip) ipValidity[eq.id] = isValidIPAddress(ip);

    fieldVisibility[eq.id] = {};
    for (const field of allFields) {
      fieldVisibility[eq.id][field.field] = isConfigFieldVisibleCore(
        eq.type,
        eq,
        field.field,
      );
    }
  }

  for (const param of allParams) {
    if (hasRobotVarIndexError(param, allParams)) {
      const mask = parseRobotMask(param.robotMask);
      for (let r = 0; r < 32; r++) {
        if (!isRobotSelected(mask, r)) continue;
        const result = validateRobotVarIndexForRobot(param, r, allParams);
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
): boolean => {
  return caches.fieldVisibility[eq.id]?.[cfg.field] ?? true;
};

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
    if (thisRobotId && otherRobotId && thisRobotId === otherRobotId)
      return true;
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
  const val = eq[field];

  if (
    cfg &&
    (cfg.type === "select" || cfg.type === "number") &&
    (val === null || val === undefined || val === "")
  ) {
    if (!isFieldVisible(eq, cfg, caches)) return false;
    return true;
  }

  if (field === "jobId" && definition.type === "workplace") {
    if (!eq.jobId || eq.jobId === 0) return true;
    if (eq.robotId) {
      const duplicate = workplaceList.find(
        (j) =>
          j.id !== eq.id && j.robotId === eq.robotId && j.jobId === eq.jobId,
      );
      if (duplicate) return true;
    }
  }

  if (definition.type === "axis") {
    if (field === "hardwareReference") {
      const refs = hardwareProvider.getReferences(
        (eq.controllerType as string) || "",
        (eq.driveReference as string) || "",
      );
      if (refs.length === 0) return true;
    }
    if (field === "channel") {
      if (val === null || val === undefined || val === "") return true;
      if (eq.hardwareReference) {
        const duplicate = allEquipment.find(
          (e) =>
            e.enable &&
            e.type === "axis" &&
            e.id !== eq.id &&
            e.hardwareReference === eq.hardwareReference &&
            String(e.channel) === String(eq.channel),
        );
        if (duplicate) return true;
      }
    }
    if (field === "nodeNumber") {
      if (val === null || val === undefined || val === "") return true;
      if (eq.hardwareReference) {
        const duplicateNode = allEquipment.find(
          (e) =>
            e.enable &&
            e.type === "axis" &&
            e.id !== eq.id &&
            e.nodeNumber === eq.nodeNumber &&
            e.hardwareReference !== eq.hardwareReference,
        );
        if (duplicateNode) return true;
      }
    }
    if (
      field === "defaultVelocity" ||
      field === "defaultAcceleration" ||
      field === "defaultDeceleration"
    ) {
      if (val === 0) return true;
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
  return false;
};

export const getParamErrorMessage = (
  param: models.Parameter,
  caches: ValidationCaches,
): string | null => caches.paramErrorMessages[param.id] ?? null;

export const hasParamsError = (
  eq: EquipmentInstance,
  caches: ValidationCaches,
): boolean => {
  if (!eq.enable) return false;
  const params = (eq.parameters as models.Parameter[]) ?? [];
  return params.some(
    (p: models.Parameter) => getParamErrorMessage(p, caches) !== null,
  );
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
  if (
    isParentLinkBroken(eq, definition, moduleList, robots) ||
    isNameError(eq, allEquipment)
  )
    return true;
  if (
    allFieldDefs(definition).some((f) =>
      isFieldError(
        eq,
        f.field,
        definition,
        caches,
        allEquipment,
        workplaceList,
      ),
    )
  )
    return true;
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
    if (
      isFieldError(
        eq,
        "ipAddress",
        definition,
        caches,
        allEquipment,
        workplaceList,
      )
    )
      return "IP Address must be unique";
  }

  if (definition.type === "workplace") {
    if (!eq.jobId || eq.jobId === 0) return "Invalid Job ID (cannot be 0)";
    if (
      isFieldError(eq, "jobId", definition, caches, allEquipment, workplaceList)
    )
      return "Duplicate Job ID for this Robot";
  }

  if (
    definition.type === "camera" &&
    eq.managedByController === true &&
    isFieldVisible(
      eq,
      { field: "managedByController", label: "", type: "boolean" },
      caches,
    )
  ) {
    if (
      isFieldError(
        eq,
        "controllerName",
        definition,
        caches,
        allEquipment,
        workplaceList,
      ) ||
      isFieldError(
        eq,
        "controllerId",
        definition,
        caches,
        allEquipment,
        workplaceList,
      ) ||
      isFieldError(
        eq,
        "channel",
        definition,
        caches,
        allEquipment,
        workplaceList,
      )
    ) {
      return "Missing Controller Config";
    }
  }

  if (definition.type === "axis") {
    const refs = hardwareProvider.getReferences(
      (eq.controllerType as string) || "",
      (eq.driveReference as string) || "",
    );
    if (refs.length === 0)
      return "No compatible hardware found in the configuration.";
    if (!eq.hardwareReference || eq.hardwareReference === "")
      return 'Please select a value for "Hardware Reference"';

    if (
      eq.nodeNumber !== null &&
      eq.nodeNumber !== undefined &&
      eq.nodeNumber !== "" &&
      isFieldError(
        eq,
        "nodeNumber",
        definition,
        caches,
        allEquipment,
        workplaceList,
      )
    ) {
      return "Duplicate Node Number across different Hardware References";
    }

    if (
      eq.channel !== null &&
      eq.channel !== undefined &&
      eq.channel !== "" &&
      isFieldError(
        eq,
        "channel",
        definition,
        caches,
        allEquipment,
        workplaceList,
      )
    ) {
      return "Channel conflict on this Drive";
    }

    if (eq.defaultVelocity === 0) return "Default Velocity cannot be 0";
    if (eq.defaultAcceleration === 0) return "Default Acceleration cannot be 0";
    if (eq.defaultDeceleration === 0) return "Default Deceleration cannot be 0";
  }

  const missingField = allFieldDefs(definition).find(
    (f) =>
      (f.type === "select" || f.type === "number") &&
      (eq[f.field] === null ||
        eq[f.field] === undefined ||
        eq[f.field] === "") &&
      isFieldVisible(eq, f, caches),
  );
  if (missingField) return `Please select a value for "${missingField.label}"`;

  const params = (eq.parameters as models.Parameter[]) ?? [];
  const badParam = params.find(
    (p: models.Parameter) => getParamErrorMessage(p, caches) !== null,
  );
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
    hasLocalError(
      eq,
      definition,
      caches,
      moduleList,
      robots,
      allEquipment,
      workplaceList,
    ),
  );

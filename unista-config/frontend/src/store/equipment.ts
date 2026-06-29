import { computed, reactive } from "vue";
import { EQUIPMENT_REGISTRY } from "../config/equipment";
import type { BaseEquipment, ConfigField, Parameter } from "../types";
import { generateId, isConfigFieldVisible, reindex } from "../utils/helpers";
import { modules } from "./modules";

// ─── State ────────────────────────────────────────────────────────────────────

const equipmentState = reactive<Record<string, BaseEquipment[]>>({
  electrovalve: [],
  vacuum: [],
  digitalInput: [],
  analogInput: [],
  analogOutput: [],
  directMotor: [],
  axis: [],
  mechatro: [],
  camera: [],
  robot: [],
  robotJob: [],
  led: [],
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns true when the given string is a valid IPv4 address. */
const isValidIpAddress = (ip: string | undefined | null): boolean => {
  if (!ip) return false;
  const ipv4Pattern =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipv4Pattern.test(ip);
};

/** Returns the resolved initial value for a config field. */
const resolveDefaultValue = (field: ConfigField): any => {
  if (field.defaultValue !== undefined) return field.defaultValue;
  if (field.type === "boolean") return false;
  if (field.type === "number") return null;
  if (field.type === "text") return "";
  if (field.type === "select") return null;
  return null;
};

/**
 * Parses a robotMask string into a number.
 */
const parseMask = (mask: string | undefined | null): number =>
  parseInt(mask || "0", 10) || 0;

/**
 * Returns the robotId for scoped validations.
 */
const getRobotId = (equipment: BaseEquipment): string | null => {
  if (equipment.type === "robotJob") return equipment.robotId || null;
  return null;
};

// ─── Robot Variable Index Validation ─────────────────────────────────────────

/**
 * Returns true if any assigned robot violates variable index rules.
 */
const hasRobotVarIndexError = (
  allParameters: Parameter[],
  param: Parameter,
): boolean => {
  const mask = parseMask(param.robotMask);
  if (mask === 0) return false;

  const indexes = param.robotVarIndex || {};

  for (let robotIndex = 0; robotIndex < 32; robotIndex++) {
    const bit = 1 << robotIndex;
    if ((mask & bit) === 0) continue;

    const currentIdx = indexes[robotIndex];

    if (
      currentIdx === null ||
      currentIdx === undefined ||
      currentIdx <= 0 ||
      Number.isNaN(Number(currentIdx))
    ) {
      return true;
    }

    for (const sibling of allParameters) {
      if (sibling === param) continue;

      const siblingMask = parseMask(sibling.robotMask);
      if ((siblingMask & bit) === 0) continue;

      if (sibling.robotVarIndex?.[robotIndex] === currentIdx) {
        return true;
      }
    }
  }

  return false;
};

// ─── Factory ──────────────────────────────────────────────────────────────────

export function createEquipmentStore(type: keyof typeof EQUIPMENT_REGISTRY) {
  const definition = EQUIPMENT_REGISTRY[type];

  const createInstance = (index: number): BaseEquipment => ({
    id: generateId(),
    type,
    index,
    enable: true,
    emId: null,
    robotId: type === "robotJob" ? null : undefined,
    name: `${definition.prefix}${index}`,
    commentFr: "",
    commentEn: "",
    commentDe: "",
    commentEs: "",
    detail: "",
    reserve1: "",
    reserve2: "",
    cycleTime: type === "axis" || type === "mechatro" ? 2 : 10,
    ui: {
      showProps: true,
      showConfiguration: true,
      showController: false,
      showProcess: false,
      showParams: false,
    },

    parameters: (definition.parameterFields || []).map((field, i) => {
      const defaultValue = resolveDefaultValue(field);
      return {
        id: i + 1,
        name: field.label,
        actif: field.type === "boolean" ? (defaultValue as boolean) : true,
        commentFr: "",
        commentEn: "",
        commentDe: "",
        commentEs: "",
        detail: "",
        reserve1: "",
        reserve2: "",
        robotMask: "",
        robotVarIndex: {},
        value: defaultValue,
      } as Parameter;
    }),

    ...Object.fromEntries(
      [
        ...(definition.configFields || []),
        ...(definition.controllerFields || []),
        ...(definition.processFields || []),
      ].map((field) => [field.field, resolveDefaultValue(field)]),
    ),
  });

  // ─── Computed List ───────────────────────────────────────────────────────

  const list = computed({
    get: () => equipmentState[type],
    set: (val) => {
      equipmentState[type] = val;
    },
  });

  // ─── Actions ─────────────────────────────────────────────────────────────

  const addAction = (): void => {
    equipmentState[type].push(createInstance(equipmentState[type].length + 1));
    reindex(equipmentState[type]);
  };

  const removeAction = (index: number): void => {
    equipmentState[type].splice(index, 1);
    reindex(equipmentState[type]);
  };

  const syncIndexes = (): void => reindex(equipmentState[type]);

  // ─── Validation ──────────────────────────────────────────────────────────

  const hasErrors = computed((): boolean => {
    const enabledItems = list.value.filter((eq) => eq.enable);
    const allActiveEquipment = Object.values(equipmentState)
      .flat()
      .filter((e) => e.enable);
    const allStoreParameters = enabledItems.flatMap(
      (eq) => eq.parameters ?? [],
    );

    const allConfigFields = [
      ...(definition.configFields || []),
      ...(definition.controllerFields || []),
      ...(definition.processFields || []),
    ];

    return enabledItems.some((eq) => {
      if (definition.hasEmLink) {
        if (!eq.emId) return true;
        const linkedModule = modules.value.find((m) => m.id === eq.emId);
        if (!linkedModule || !linkedModule.enable) return true;
      }
      if (type === "robotJob") {
        if (!eq.robotId) return true;
        const parentRobot = equipmentState["robot"].find(
          (r) => r.id === eq.robotId,
        );
        if (!parentRobot || !parentRobot.enable) return true;
      }

      if (!eq.name || eq.name.trim() === "") return true;
      const thisRobotId = getRobotId(eq);
      const isNameDuplicate = allActiveEquipment.some((other) => {
        if (other.id === eq.id || other.name !== eq.name) return false;
        const otherRobotId = getRobotId(other);
        const sameScope =
          (!thisRobotId && !otherRobotId) ||
          (!!thisRobotId && thisRobotId === otherRobotId);
        return sameScope;
      });
      if (isNameDuplicate) return true;

      if (eq.ipAddress !== undefined) {
        if (!eq.ipAddress || eq.ipAddress.trim() === "") return true;
        if (!isValidIpAddress(eq.ipAddress)) return true;
        const isIpDuplicate = allActiveEquipment.some(
          (other) =>
            other.id !== eq.id &&
            other.ipAddress !== undefined &&
            other.ipAddress === eq.ipAddress,
        );
        if (isIpDuplicate) return true;
      }

      if (type === "robotJob") {
        if (!eq.jobId) return true;
        if (eq.robotId) {
          const hasDuplicateJob = equipmentState["robotJob"].some(
            (other) =>
              other.id !== eq.id &&
              other.robotId === eq.robotId &&
              other.jobId === eq.jobId,
          );
          if (hasDuplicateJob) return true;
        }
      }

      const hasMissingSelectOrNumber = allConfigFields.some(
        (field) =>
          (field.type === "select" || field.type === "number") &&
          eq[field.field] === null &&
          isConfigFieldVisible(eq, field),
      );
      if (hasMissingSelectOrNumber) return true;

      const hasParamError = (eq.parameters ?? []).some((param) =>
        hasRobotVarIndexError(allStoreParameters, param),
      );
      if (hasParamError) return true;

      return false;
    });
  });

  return { definition, list, addAction, removeAction, syncIndexes, hasErrors };
}

// ─── Store Instances ──────────────────────────────────────────────────────────

export const equipmentStores = {
  electrovalve: createEquipmentStore("electrovalve"),
  vacuum: createEquipmentStore("vacuum"),
  digitalInput: createEquipmentStore("digitalInput"),
  analogInput: createEquipmentStore("analogInput"),
  analogOutput: createEquipmentStore("analogOutput"),
  directMotor: createEquipmentStore("directMotor"),
  axis: createEquipmentStore("axis"),
  mechatro: createEquipmentStore("mechatro"),
  camera: createEquipmentStore("camera"),
  robot: createEquipmentStore("robot"),
  robotJob: createEquipmentStore("robotJob"),
  led: createEquipmentStore("led"),
};

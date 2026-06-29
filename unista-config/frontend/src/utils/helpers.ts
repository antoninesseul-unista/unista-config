import type { Parameter } from "../types";

/**
 * Generates a unique short string ID.
 */
export const generateId = (): string =>
  Math.random().toString(36).substring(2, 11);

/**
 * Reindexes an array of items, ensuring the visual index matches the array order.
 */
export const reindex = (list: { index: number }[]) =>
  list.forEach((item, i) => (item.index = i + 1));

/**
 * Sanitizes a string to be compliant with PLC variables.
 * Ensures the name starts with a letter or underscore, and contains no special characters.
 */
export const sanitizeVariableName = (rawName: string): string => {
  let cleanName = rawName.replace(/[^a-zA-Z0-9_]/g, "");
  if (/^[0-9]/.test(cleanName)) {
    cleanName = "_" + cleanName;
  }
  return cleanName;
};

/**
 * Single Source of Truth (SOT) visibility evaluator.
 * Determines whether a field is actively applicable to the current equipment state.
 */
export const isConfigFieldVisible = (
  eq: any,
  cfg: { field: string },
): boolean => {
  if (!eq || !eq.enable) return false;
  const field = cfg.field;

  if (eq.type === "camera") {
    const brand = eq.brand as string | undefined;
    const isBrandCompatible =
      brand === "CAMERA_UNDEFINED" || !!(brand && brand.includes("Keyence"));
    if (field === "managedByController") return isBrandCompatible;
    const controllerFields = [
      "controllerName",
      "controllerId",
      "channel",
      "startAreaExchanges",
      "nbInfos",
      "exchangesSize",
    ];
    if (controllerFields.includes(field))
      return isBrandCompatible && eq.managedByController === true;
    return true;
  }

  if (eq.type === "axis") {
    const ctrl = eq.controllerType || "";
    const drive = eq.driveReference || "";
    const motion = eq.motionType || "";
    const homing = eq.homingType || "";

    switch (field) {
      // Controller
      case "driveReference":
        return ctrl === "ACOPOS" || ctrl === "INVERTER";
      case "motorReference":
        return (ctrl === "ACOPOS" && drive === "P3") || ctrl === "PSE";

      // Configuration
      case "units":
        return ctrl !== "INVERTER";
      case "resolution":
        return ctrl === "ACOPOS";

      // Limits
      case "lowerPosition":
      case "upperPosition":
        return motion === "LIMITED_ROTARY" || motion === "LIMITED_LINEAR";
      case "maxTorque":
        return ctrl === "ACOPOS" || ctrl === "PSE";
      case "stopTorque":
      case "followingError":
        return ctrl === "ACOPOS";
      case "period":
        return motion === "PERIODIC_ROTARY" || motion === "PERIODIC_LINEAR";

      // Reduction
      case "transformation":
        return (
          motion === "PERIODIC_LINEAR" ||
          motion === "LINEAR" ||
          motion === "LIMITED_LINEAR"
        );

      // Homing
      case "homingType":
      case "homingPosition":
        return drive !== "P76";
      case "homingDirection":
      case "homingVelocity":
      case "homingStartVelocity":
      case "homingAcceleration":
      case "homingBackoffDistance":
        return (
          drive !== "P76" &&
          (homing === "ABSOLUTE_SWITCH" ||
            homing === "BLOCK_TORQUE" ||
            homing === "BLOCK_LAG_ERROR")
        );
      case "homingTorqueLimit":
        return (
          drive !== "P76" &&
          (homing === "BLOCK_TORQUE" || homing === "BLOCK_LAG_ERROR")
        );
      case "homingFollowingError":
        return drive !== "P76" && homing === "BLOCK_LAG_ERROR";

      // Auto Tune
      case "autoTuneMode":
      case "autoTuneOrientation":
        return ctrl === "ACOPOS";
      case "autoTuneMaxCurrentPercentage": {
        if (ctrl !== "ACOPOS") return false;
        const mode = eq.autoTuneMode || "";
        return (
          mode === "AXIS_TUNE_AUTOMATIC" ||
          mode === "AXIS_TUNE_SPEED" ||
          mode === "AXIS_TUNE_POSITION"
        );
      }

      // Inverter
      case "inverterEnable60Hz":
      case "inverterPowerW":
      case "inverterCosPhi":
      case "inverterVoltageV":
      case "inverterCurrentA":
      case "inverterMotorSpeedRpm":
      case "inverterMaxFrequencyHz":
        return ctrl === "INVERTER";

      default:
        return true;
    }
  }

  return true;
};

/**
 * Factory function to create a new parameter object.
 */
export const makeParam = (name: string, id: number): Parameter => ({
  id,
  name,
  actif: false,
  resetVisible: false,
  commentFr: "",
  commentEn: "",
  commentDe: "",
  commentEs: "",
  reserve1: "",
  reserve2: "",
  detail: "",
  robotMask: "",
  robotVarIndex: {},
  robotVarName: "",
});

/**
 * Generates N numbered parameters with a given prefix.
 */
export const makeParams = (prefix: string, count = 16): Parameter[] =>
  Array.from({ length: count }, (_, i) =>
    makeParam(`${prefix}${i + 1} (${i + 1})`, i + 1),
  );

import { hardwareProvider } from "../../services/hardware/hardwareProvider";
import { AxisRuleProvider } from "./axisRuleProvider";

/**
 * Pure state sanitizer service.
 * Intercepts property mutations and enforces the KISS rule:
 * "All initial values are null, unless strictly 1 available choice exists."
 */
export class AxisSanitizer {
  /**
   * Hydrates a newly created axis entity with null defaults,
   * triggering cascading evaluations to auto-select any single choices.
   */
  public static hydrateDefaults(axis: any): void {
    if (!axis) return;

    const allProperties = [
      "controllerType",
      "driveReference",
      "hardwareReference",
      "nodeNumber",
      "channel",
      "motorReference",
      "motionType",
      "units",
      "resolution",
      "encoderRotationDirection",
      "lowerPosition",
      "upperPosition",
      "maxNegativeVelocity",
      "maxPositiveVelocity",
      "maxAcceleration",
      "maxDeceleration",
      "maxTorque",
      "stopTorque",
      "period",
      "followingError",
      "defaultVelocity",
      "defaultAcceleration",
      "defaultDeceleration",
      "defaultDirection",
      "gearboxInput",
      "gearboxOutput",
      "transformation",
      "homingType",
      "homingPosition",
      "homingDirection",
      "homingVelocity",
      "homingStartVelocity",
      "homingAcceleration",
      "homingTorqueLimit",
      "homingFollowingError",
      "homingBackoffDistance",
      "autoTuneMode",
      "autoTuneOrientation",
      "autoTuneMaxCurrentPercentage",
      "inverterEnable60Hz",
      "inverterPowerW",
      "inverterCosPhi",
      "inverterVoltageV",
      "inverterCurrentA",
      "inverterMotorSpeedRpm",
      "inverterMaxFrequencyHz",
    ];

    allProperties.forEach((prop) => {
      if (axis[prop] === undefined) {
        axis[prop] = prop === "inverterEnable60Hz" ? false : null;
      }
    });

    // Run initial evaluation
    this.onControllerChange(axis);
  }

  /**
   * Core business rule enforcer:
   * - Exactly 1 available option -> Auto-select it
   * - Multiple options -> Keep current value if valid, otherwise reset to null
   * - Zero options -> Reset to null
   */
  private static sanitizeChoice(
    axis: any,
    prop: string,
    availableOptions: string[],
  ): void {
    if (availableOptions.length === 1) {
      axis[prop] = availableOptions[0];
    } else if (availableOptions.length > 1) {
      if (
        axis[prop] !== null &&
        axis[prop] !== undefined &&
        !availableOptions.includes(axis[prop])
      ) {
        axis[prop] = null;
      }
    } else {
      axis[prop] = null;
    }
  }

  public static onControllerChange(axis: any): void {
    if (!axis) return;

    const controllers = AxisRuleProvider.getAvailableControllers();
    this.sanitizeChoice(axis, "controllerType", controllers);

    const drives = AxisRuleProvider.getAvailableDrives(
      axis.controllerType || "",
    );
    this.sanitizeChoice(axis, "driveReference", drives);

    const motions = AxisRuleProvider.getAvailableMotionTypes(
      axis.controllerType || "",
    );
    this.sanitizeChoice(axis, "motionType", motions);

    this.onDriveChange(axis);
    this.onMotionChange(axis);
  }

  public static onDriveChange(axis: any): void {
    if (!axis) return;

    // Update compatible motors based on the selected drive
    const motors = AxisRuleProvider.getAvailableMotors(
      axis.controllerType || "",
      axis.driveReference || "",
    );
    this.sanitizeChoice(axis, "motorReference", motors);

    // Update compatible homing types based on the selected drive
    const homings = AxisRuleProvider.getAvailableHomingTypes(
      axis.controllerType || "",
      axis.driveReference || "",
    );
    this.sanitizeChoice(axis, "homingType", homings);

    // Fetch and validate compatible hardware references for the new drive
    const hardwares = hardwareProvider.getReferences(
      axis.controllerType || "",
      axis.driveReference || "",
    );
    this.sanitizeChoice(axis, "hardwareReference", hardwares);

    // Clear dependent hardware fields if the current hardware is no longer compatible
    if (!axis.hardwareReference) {
      axis.nodeNumber = null;
      axis.channel = null;
    } else {
      // Refresh hardware details (like auto-assigning the node number) if a valid hardware remains
      this.onHardwareChange(axis);
    }
  }

  public static onMotionChange(axis: any): void {
    if (!axis) return;

    if (axis.controllerType === "INVERTER") {
      axis.units = null;
    } else {
      const units = AxisRuleProvider.getAvailableUnits(axis.motionType || "");
      this.sanitizeChoice(axis, "units", units);
    }
  }
  public static onHardwareChange(axis: any): void {
    if (!axis || !axis.hardwareReference) return;

    const details = hardwareProvider.getHardwareDetails(axis.hardwareReference);

    if (details) {
      axis.nodeNumber = details.nodeNumber;
      // Si aucun canal n'est défini ou s'il dépasse la capacité, on force à 1
      if (!axis.channel || axis.channel > details.axesCount) {
        axis.channel = 1;
      }
    }
  }
}

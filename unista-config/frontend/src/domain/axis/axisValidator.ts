import { AxisRuleProvider } from "./axisRuleProvider";

/**
 * Pure validation service encapsulating mandatory Axis configuration rules.
 */
export class AxisValidator {
  public static getFirstError(axis: any): string | null {
    if (!axis.controllerType) return "Controller Type required";

    const drives = AxisRuleProvider.getAvailableDrives(axis.controllerType);
    if (drives.length > 0 && !axis.driveReference)
      return "Drive Reference required";

    if (!axis.hardwareReference) return "Hardware Reference required";

    const motors = AxisRuleProvider.getAvailableMotors(
      axis.controllerType,
      axis.driveReference,
    );
    if (motors.length > 0 && !axis.motorReference)
      return "Motor Reference required";

    if (!axis.motionType) return "Motion Type required";

    if (axis.controllerType !== "INVERTER" && !axis.units)
      return "Units required";

    if (AxisRuleProvider.isSectionVisible("homing", axis) && !axis.homingType) {
      return "Homing Type required";
    }

    return null;
  }

  public static hasErrors(axis: any): boolean {
    return this.getFirstError(axis) !== null;
  }
}

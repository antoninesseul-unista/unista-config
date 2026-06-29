/**
 * Single Source of Truth (SOT) for Axis business rules, available dropdown options,
 * and section/field visibility gating.
 */
export class AxisRuleProvider {
  public static getAvailableControllers(): string[] {
    return ["ACOPOS", "INVERTER", "VIRTUAL", "PSE", "INTERROLL"];
  }

  public static getAvailableDrives(controllerType: string): string[] {
    switch (controllerType) {
      case "ACOPOS":
        return ["P3", "MICRO", "MULTI"];
      case "INVERTER":
        return ["P74", "P76"];
      default:
        return [];
    }
  }

  public static getAvailableMotors(
    controllerType: string,
    driveReference: string,
  ): string[] {
    if (controllerType === "ACOPOS" && driveReference === "P3") {
      return ["8LVA", "8LSA", "STOBBER"];
    }
    if (controllerType === "PSE") {
      return [
        "AXE_PSE_301_311",
        "AXE_PSE_302_312",
        "AXE_PSE_305_315",
        "AXE_PSE_322_332",
        "AXE_PSE_325_335",
        "AXE_PSE_328",
      ];
    }
    return [];
  }

  public static getAvailableMotionTypes(controllerType: string): string[] {
    if (controllerType === "INVERTER") {
      return ["LINEAR", "ROTARY"];
    }
    return [
      "PERIODIC_ROTARY",
      "ROTARY",
      "LIMITED_ROTARY",
      "PERIODIC_LINEAR",
      "LINEAR",
      "LIMITED_LINEAR",
    ];
  }

  /**
   * Enforces strict industrial KISS units:
   * Rotary motions are locked to DEGREES.
   * Linear motions are locked to MILLIMETERS.
   */
  public static getAvailableUnits(motionType: string): string[] {
    if (!motionType) return [];
    if (motionType.includes("ROTARY")) {
      return ["DEGREES"];
    }
    if (motionType.includes("LINEAR")) {
      return ["MILLIMETERS"];
    }
    return [];
  }

  public static getAvailableHomingTypes(
    controllerType: string,
    driveReference: string,
  ): string[] {
    if (driveReference === "P76") return [];
    switch (controllerType) {
      case "ACOPOS":
        return ["DIRECT", "ABSOLUTE_SWITCH", "BLOCK_TORQUE", "BLOCK_LAG_ERROR"];
      case "INVERTER":
      case "VIRTUAL":
      case "INTERROLL":
        return ["DIRECT"];
      case "PSE":
        return ["DIRECT", "BLOCK_TORQUE"];
      default:
        return ["DIRECT"];
    }
  }

  public static isSectionVisible(sectionKey: string, axis: any): boolean {
    if (!axis) return false;
    switch (sectionKey) {
      case "controller":
      case "configuration":
      case "limits":
      case "defaults":
      case "reduction":
        return true;
      case "homing":
        return axis.driveReference !== "P76";
      case "autoTune":
        return axis.controllerType === "ACOPOS";
      case "inverter":
        return axis.controllerType === "INVERTER";
      default:
        return false;
    }
  }

  public static isLimitFieldVisible(fieldKey: string, axis: any): boolean {
    const motion = axis.motionType || "";
    switch (fieldKey) {
      case "position":
        return motion === "LIMITED_ROTARY" || motion === "LIMITED_LINEAR";
      case "maxTorque":
        return (
          axis.controllerType === "ACOPOS" || axis.controllerType === "PSE"
        );
      case "stopTorque":
      case "followingError":
        return axis.controllerType === "ACOPOS";
      case "period":
        return motion === "PERIODIC_ROTARY" || motion === "PERIODIC_LINEAR";
      default:
        return true;
    }
  }

  public static isTransformationVisible(axis: any): boolean {
    const motion = axis.motionType || "";
    return (
      motion === "PERIODIC_LINEAR" ||
      motion === "LINEAR" ||
      motion === "LIMITED_LINEAR"
    );
  }

  public static isHomingFieldVisible(fieldKey: string, axis: any): boolean {
    const homing = axis.homingType || "";
    switch (fieldKey) {
      case "direction":
      case "velocity":
      case "startVelocity":
      case "acceleration":
      case "backoff":
        return (
          homing === "ABSOLUTE_SWITCH" ||
          homing === "BLOCK_TORQUE" ||
          homing === "BLOCK_LAG_ERROR"
        );
      case "torqueLimit":
        return homing === "BLOCK_TORQUE" || homing === "BLOCK_LAG_ERROR";
      case "followingError":
        return homing === "BLOCK_LAG_ERROR";
      default:
        return true;
    }
  }

  public static isAutoTuneMaxCurrentVisible(axis: any): boolean {
    const mode = axis.autoTuneMode || "";
    return (
      mode === "AXIS_TUNE_AUTOMATIC" ||
      mode === "AXIS_TUNE_SPEED" ||
      mode === "AXIS_TUNE_POSITION"
    );
  }
}

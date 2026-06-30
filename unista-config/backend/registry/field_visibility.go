package registry

import "strings"

func strField(equipment map[string]any, key string) string {
	if equipment == nil {
		return ""
	}
	v, ok := equipment[key]
	if !ok || v == nil {
		return ""
	}
	if s, ok := v.(string); ok {
		return s
	}
	return ""
}

func boolField(equipment map[string]any, key string) bool {
	if equipment == nil {
		return false
	}
	v, ok := equipment[key]
	if !ok || v == nil {
		return false
	}
	if b, ok := v.(bool); ok {
		return b
	}
	return false
}

func isEnabled(equipment map[string]any) bool {
	if equipment == nil {
		return false
	}
	v, ok := equipment["enable"]
	if !ok {
		return false
	}
	if b, ok := v.(bool); ok {
		return b
	}
	return false
}

// IsConfigFieldVisible determines whether a field applies to the current equipment state.
func IsConfigFieldVisible(equipmentType string, equipment map[string]any, field string) bool {
	if !isEnabled(equipment) {
		return false
	}

	switch equipmentType {
	case "camera":
		brand := strField(equipment, "brand")
		isBrandCompatible := brand == "CAMERA_UNDEFINED" || strings.Contains(brand, "Keyence")
		if field == "managedByController" {
			return isBrandCompatible
		}
		controllerFields := []string{
			"controllerName", "controllerId", "channel",
			"startAreaExchanges", "nbInfos", "exchangesSize",
		}
		for _, f := range controllerFields {
			if f == field {
				return isBrandCompatible && boolField(equipment, "managedByController")
			}
		}
		return true

	case "axis":
		ctrl := strField(equipment, "controllerType")
		drive := strField(equipment, "driveReference")
		motion := strField(equipment, "motionType")
		homing := strField(equipment, "homingType")

		switch field {
		case "driveReference":
			return ctrl == "ACOPOS" || ctrl == "INVERTER"
		case "motorReference":
			return (ctrl == "ACOPOS" && drive == "P3") || ctrl == "PSE"
		case "units":
			return ctrl != "INVERTER"
		case "resolution":
			return ctrl == "ACOPOS"
		case "lowerPosition", "upperPosition":
			return motion == "LIMITED_ROTARY" || motion == "LIMITED_LINEAR"
		case "maxTorque":
			return ctrl == "ACOPOS" || ctrl == "PSE"
		case "stopTorque", "followingError":
			return ctrl == "ACOPOS"
		case "period":
			return motion == "PERIODIC_ROTARY" || motion == "PERIODIC_LINEAR"
		case "transformation":
			return motion == "PERIODIC_LINEAR" || motion == "LINEAR" || motion == "LIMITED_LINEAR"
		case "homingType", "homingPosition":
			return drive != "P76"
		case "homingDirection", "homingVelocity", "homingStartVelocity",
			"homingAcceleration", "homingBackoffDistance":
			return drive != "P76" && (homing == "ABSOLUTE_SWITCH" || homing == "BLOCK_TORQUE" || homing == "BLOCK_LAG_ERROR")
		case "homingTorqueLimit":
			return drive != "P76" && (homing == "BLOCK_TORQUE" || homing == "BLOCK_LAG_ERROR")
		case "homingFollowingError":
			return drive != "P76" && homing == "BLOCK_LAG_ERROR"
		case "autoTuneMode", "autoTuneOrientation":
			return ctrl == "ACOPOS"
		case "autoTuneMaxCurrentPercentage":
			if ctrl != "ACOPOS" {
				return false
			}
			mode := strField(equipment, "autoTuneMode")
			return mode == "AXIS_TUNE_AUTOMATIC" || mode == "AXIS_TUNE_SPEED" || mode == "AXIS_TUNE_POSITION"
		case "inverterEnable60Hz", "inverterPowerW", "inverterCosPhi",
			"inverterVoltageV", "inverterCurrentA", "inverterMotorSpeedRpm", "inverterMaxFrequencyHz":
			return ctrl == "INVERTER"
		default:
			return true
		}
	}

	return true
}

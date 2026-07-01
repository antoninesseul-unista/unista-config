// backend/registry/field_visibility.go
package registry

import (
	"strings"

	"my-machine-app/backend/models"
)

// IsConfigFieldVisible determines if a configuration field should be displayed
// based on the dynamic state of the equipment.
func IsConfigFieldVisible(equipmentType models.EquipmentType, equipment map[string]any, field string) bool {
	// 1. If the equipment is not enabled, no fields are visible
	enabled, ok := equipment["enable"].(bool)
	if !ok || !enabled {
		return false
	}

	// 2. Safely extract dynamic configuration values based on equipment type
	// We use direct type assertions instead of costly JSON conversions.
	switch equipmentType {
	case models.TypeCamera:
		brand, _ := equipment["brand"].(string)
		managedByController, _ := equipment["managedByController"].(bool)

		isBrandCompatible := brand == "CAMERA_UNDEFINED" || strings.Contains(brand, "Keyence")

		if field == "managedByController" {
			return isBrandCompatible
		}

		switch field {
		case "controllerName", "controllerId", "channel", "startAreaExchanges", "nbInfos", "exchangesSize":
			return isBrandCompatible && managedByController
		}
		return true

	case models.TypeAxis:
		controllerType, _ := equipment["controllerType"].(string)
		driveReference, _ := equipment["driveReference"].(string)
		motionType, _ := equipment["motionType"].(string)
		homingType, _ := equipment["homingType"].(string)
		autoTuneMode, _ := equipment["autoTuneMode"].(string)

		switch field {
		case "driveReference":
			return controllerType == "ACOPOS" || controllerType == "INVERTER"
		case "motorReference":
			return (controllerType == "ACOPOS" && driveReference == "P3") || controllerType == "PSE"
		case "units":
			return controllerType != "INVERTER"
		case "resolution":
			return controllerType == "ACOPOS"
		case "lowerPosition", "upperPosition":
			return motionType == "LIMITED_ROTARY" || motionType == "LIMITED_LINEAR"
		case "maxTorque":
			return controllerType == "ACOPOS" || controllerType == "PSE"
		case "stopTorque", "followingError":
			return controllerType == "ACOPOS"
		case "period":
			return motionType == "PERIODIC_ROTARY" || motionType == "PERIODIC_LINEAR"
		case "transformation":
			return motionType == "PERIODIC_LINEAR" || motionType == "LINEAR" || motionType == "LIMITED_LINEAR"
		case "homingType", "homingPosition":
			return driveReference != "P76"
		case "homingDirection", "homingVelocity", "homingStartVelocity", "homingAcceleration", "homingBackoffDistance":
			return driveReference != "P76" && (homingType == "ABSOLUTE_SWITCH" || homingType == "BLOCK_TORQUE" || homingType == "BLOCK_LAG_ERROR")
		case "homingTorqueLimit":
			return driveReference != "P76" && (homingType == "BLOCK_TORQUE" || homingType == "BLOCK_LAG_ERROR")
		case "homingFollowingError":
			return driveReference != "P76" && homingType == "BLOCK_LAG_ERROR"
		case "autoTuneMode", "autoTuneOrientation":
			return controllerType == "ACOPOS"
		case "autoTuneMaxCurrentPercentage":
			if controllerType != "ACOPOS" {
				return false
			}
			return autoTuneMode == "AXIS_TUNE_AUTOMATIC" || autoTuneMode == "AXIS_TUNE_SPEED" || autoTuneMode == "AXIS_TUNE_POSITION"
		case "inverterEnable60Hz", "inverterPowerW", "inverterCosPhi", "inverterVoltageV", "inverterCurrentA", "inverterMotorSpeedRpm", "inverterMaxFrequencyHz":
			return controllerType == "INVERTER"
		default:
			return true
		}
	}

	return true
}
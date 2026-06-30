// backend/services/calculation_service.go
package services

import (
	"regexp"
	"strconv"
	"strings"
	"unicode"

	"my-machine-app/backend/models"
	"my-machine-app/backend/registry"
)

const maxRobotSlots = 32

// CalculationService exposes domain calculations to the Vue frontend.
type CalculationService struct{}

// RobotVarIndexValidation holds the result of a robot variable index check.
type RobotVarIndexValidation struct {
	HasError bool   `json:"hasError"`
	Message  string `json:"message"`
}

// NewCalculationService creates a new CalculationService.
func NewCalculationService() *CalculationService {
	return &CalculationService{}
}

// ParseRobotMask converts a mask string to an integer (0 on failure).
func (s *CalculationService) ParseRobotMask(mask string) int {
	v, err := strconv.Atoi(strings.TrimSpace(mask))
	if err != nil || v < 0 {
		return 0
	}
	return v
}

// IsRobotSelected returns true when the given robot bit is set in the mask.
func (s *CalculationService) IsRobotSelected(mask int, robotIndex int) bool {
	if robotIndex < 0 || robotIndex >= maxRobotSlots {
		return false
	}
	return mask&(1<<robotIndex) != 0
}

// ToggleRobotMask flips the bit for the given robot index.
func (s *CalculationService) ToggleRobotMask(mask int, robotIndex int) int {
	if robotIndex < 0 || robotIndex >= maxRobotSlots {
		return mask
	}
	return mask ^ (1 << robotIndex)
}

// SanitizeVariableName enforces PLC-compatible variable names.
func (s *CalculationService) SanitizeVariableName(rawName string) string {
	var b strings.Builder
	for _, r := range rawName {
		if unicode.IsLetter(r) || unicode.IsDigit(r) || r == '_' {
			b.WriteRune(r)
		}
	}
	clean := b.String()
	if len(clean) > 0 && unicode.IsDigit(rune(clean[0])) {
		clean = "_" + clean
	}
	return clean
}

var ipv4Pattern = regexp.MustCompile(
	`^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$`,
)

// IsValidIPAddress returns true for a valid IPv4 address.
func (s *CalculationService) IsValidIPAddress(ip string) bool {
	ip = strings.TrimSpace(ip)
	if ip == "" {
		return false
	}
	return ipv4Pattern.MatchString(ip)
}

func robotVarIndexValue(indexes map[string]*int, robotIndex int) *int {
	if indexes == nil {
		return nil
	}
	if v, ok := indexes[strconv.Itoa(robotIndex)]; ok {
		return v
	}
	return nil
}

func isValidRobotVarIndexValue(v *int) bool {
	if v == nil {
		return false
	}
	return *v > 0
}

// ValidateRobotVarIndexForRobot checks index rules for one robot on one parameter.
func (s *CalculationService) ValidateRobotVarIndexForRobot(
	param models.Parameter,
	robotIndex int,
	siblings []models.Parameter,
) RobotVarIndexValidation {
	mask := s.ParseRobotMask(param.RobotMask)
	if !s.IsRobotSelected(mask, robotIndex) {
		return RobotVarIndexValidation{}
	}

	val := robotVarIndexValue(param.RobotVarIndex, robotIndex)
	if !isValidRobotVarIndexValue(val) {
		return RobotVarIndexValidation{HasError: true, Message: "Index required (> 0)"}
	}

	for _, sibling := range siblings {
		siblingMask := s.ParseRobotMask(sibling.RobotMask)
		if !s.IsRobotSelected(siblingMask, robotIndex) {
			continue
		}
		siblingVal := robotVarIndexValue(sibling.RobotVarIndex, robotIndex)
		if siblingVal != nil && val != nil && *siblingVal == *val {
			name := sibling.Name
			if name == "" {
				name = "sibling"
			}
			return RobotVarIndexValidation{
				HasError: true,
				Message:  "Index " + strconv.Itoa(*val) + " already used by \"" + name + "\"",
			}
		}
	}

	return RobotVarIndexValidation{}
}

// HasRobotVarIndexError returns true when any robot assignment on the parameter is invalid.
func (s *CalculationService) HasRobotVarIndexError(param models.Parameter, allParameters []models.Parameter) bool {
	mask := s.ParseRobotMask(param.RobotMask)
	if mask == 0 {
		return false
	}

	siblings := make([]models.Parameter, 0, len(allParameters))
	for _, p := range allParameters {
		if p.ID == param.ID && p.Name == param.Name {
			continue
		}
		siblings = append(siblings, p)
	}

	for robotIndex := 0; robotIndex < maxRobotSlots; robotIndex++ {
		if !s.IsRobotSelected(mask, robotIndex) {
			continue
		}
		if result := s.ValidateRobotVarIndexForRobot(param, robotIndex, siblings); result.HasError {
			return true
		}
	}

	return false
}

// IsConfigFieldVisible returns true when a config field applies to the equipment state.
func (s *CalculationService) IsConfigFieldVisible(
	equipmentType string,
	equipment map[string]any,
	field string,
) bool {
	return registry.IsConfigFieldVisible(equipmentType, equipment, field)
}

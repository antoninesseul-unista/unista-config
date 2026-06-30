package services

import (
	"testing"

	"my-machine-app/backend/models"
)

func intPtr(v int) *int { return &v }

func TestParseRobotMask(t *testing.T) {
	s := NewCalculationService()
	if got := s.ParseRobotMask(""); got != 0 {
		t.Fatalf("expected 0, got %d", got)
	}
	if got := s.ParseRobotMask("5"); got != 5 {
		t.Fatalf("expected 5, got %d", got)
	}
}

func TestIsRobotSelected(t *testing.T) {
	s := NewCalculationService()
	if !s.IsRobotSelected(0b101, 0) {
		t.Fatal("robot 0 should be selected")
	}
	if s.IsRobotSelected(0b101, 1) {
		t.Fatal("robot 1 should not be selected")
	}
}

func TestToggleRobotMask(t *testing.T) {
	s := NewCalculationService()
	if got := s.ToggleRobotMask(0b100, 0); got != 0b101 {
		t.Fatalf("expected 0b101, got %b", got)
	}
}

func TestSanitizeVariableName(t *testing.T) {
	s := NewCalculationService()
	if got := s.SanitizeVariableName("12abc!"); got != "_12abc" {
		t.Fatalf("expected _12abc, got %q", got)
	}
}

func TestIsValidIPAddress(t *testing.T) {
	s := NewCalculationService()
	if !s.IsValidIPAddress("192.168.1.1") {
		t.Fatal("expected valid IP")
	}
	if s.IsValidIPAddress("999.1.1.1") {
		t.Fatal("expected invalid IP")
	}
}

func TestHasRobotVarIndexError(t *testing.T) {
	s := NewCalculationService()
	param := models.Parameter{
		DescribedEntity: models.DescribedEntity{NamedEntity: models.NamedEntity{Name: "P1"}},
		ID:              1,
		RobotMask:       "1",
		RobotVarIndex:   map[string]*int{"0": intPtr(5)},
	}
	sibling := models.Parameter{
		DescribedEntity: models.DescribedEntity{NamedEntity: models.NamedEntity{Name: "P2"}},
		ID:              2,
		RobotMask:       "1",
		RobotVarIndex:   map[string]*int{"0": intPtr(5)},
	}
	if !s.HasRobotVarIndexError(param, []models.Parameter{param, sibling}) {
		t.Fatal("expected duplicate index error")
	}
}

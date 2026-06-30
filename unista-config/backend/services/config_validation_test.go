package services

import (
	"encoding/json"
	"testing"
)

func minimalValidConfig() map[string]any {
	return map[string]any{
		"schemaVersion": 1,
		"modules":       []any{},
		"equipment":     map[string]any{},
		"pages":         map[string]any{},
		"buttons":       []any{},
		"cycleButtons":  []any{},
		"counters":      []any{},
		"messageBoxes":  []any{},
		"faults":        map[string]any{},
		"systemConstants": map[string]any{},
		"generalConfig": map[string]any{},
		"translations":  []any{},
		"cfr21":         map[string]any{},
		"roles":         map[string]any{},
	}
}

func TestValidateConfigJSON_valid(t *testing.T) {
	raw, err := json.Marshal(minimalValidConfig())
	if err != nil {
		t.Fatal(err)
	}
	if err := ValidateConfigJSON(raw); err != nil {
		t.Fatalf("expected valid config, got %v", err)
	}
}

func TestValidateConfigJSON_preservesEquipmentDynamicFields(t *testing.T) {
	cfg := minimalValidConfig()
	cfg["equipment"] = map[string]any{
		"electrovalve": []any{
			map[string]any{
				"id": "ev-1", "type": "electrovalve", "name": "EV1",
				"cmdType": "Monostable", "centerType": "Open",
			},
		},
	}
	raw, _ := json.Marshal(cfg)
	if err := ValidateConfigJSON(raw); err != nil {
		t.Fatal(err)
	}
}

func TestValidateConfigJSON_missingKey(t *testing.T) {
	cfg := minimalValidConfig()
	delete(cfg, "modules")
	raw, _ := json.Marshal(cfg)
	if err := ValidateConfigJSON(raw); err == nil {
		t.Fatal("expected error for missing modules")
	}
}

func TestValidateConfigJSON_invalidJSON(t *testing.T) {
	if err := ValidateConfigJSON([]byte("{not json")); err == nil {
		t.Fatal("expected JSON error")
	}
}

func TestValidateConfigJSON_futureSchema(t *testing.T) {
	cfg := minimalValidConfig()
	cfg["schemaVersion"] = 99
	raw, _ := json.Marshal(cfg)
	if err := ValidateConfigJSON(raw); err == nil {
		t.Fatal("expected incompatible schema error")
	}
}

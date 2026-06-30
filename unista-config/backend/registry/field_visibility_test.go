package registry

import "testing"

func TestIsConfigFieldVisible_axisDriveReference(t *testing.T) {
	eq := map[string]any{
		"enable":         true,
		"controllerType": "ACOPOS",
	}
	if !IsConfigFieldVisible("axis", eq, "driveReference") {
		t.Fatal("expected driveReference visible for ACOPOS")
	}

	eq["controllerType"] = "VIRTUAL"
	if IsConfigFieldVisible("axis", eq, "driveReference") {
		t.Fatal("expected driveReference hidden for VIRTUAL")
	}
}

func TestIsConfigFieldVisible_cameraController(t *testing.T) {
	eq := map[string]any{
		"enable":              true,
		"brand":               "KeyenceCVX",
		"managedByController": true,
	}
	if !IsConfigFieldVisible("camera", eq, "controllerName") {
		t.Fatal("expected controllerName visible for Keyence + managedByController")
	}

	eq["managedByController"] = false
	if IsConfigFieldVisible("camera", eq, "controllerName") {
		t.Fatal("expected controllerName hidden when not managedByController")
	}
}

func TestEquipmentRegistryLoads(t *testing.T) {
	reg, err := EquipmentRegistry()
	if err != nil {
		t.Fatal(err)
	}
	if len(reg) < 12 {
		t.Fatalf("expected at least 12 equipment types, got %d", len(reg))
	}
	if _, ok := reg["axis"]; !ok {
		t.Fatal("expected axis in registry")
	}
}

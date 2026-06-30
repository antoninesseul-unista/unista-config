package services

import (
	"encoding/json"
	"testing"

	"my-machine-app/backend/models"
)

func TestAppDataRoundTrip_preservesEquipmentDynamicFields(t *testing.T) {
	original := models.AppData{
		SchemaVersion: 1,
		Modules:       []models.MachineModule{},
		Equipment: map[string][]map[string]any{
			"electrovalve": {
				{
					"id":         "ev-1",
					"type":       "electrovalve",
					"name":       "EV1",
					"cmdType":    "Monostable",
					"centerType": "Open",
				},
			},
			"axis": {
				{
					"id":             "ax-1",
					"type":           "axis",
					"controllerType": "ACOPOS",
					"motionType":     "Linear",
				},
			},
		},
		Pages:         map[string][]models.MachinePage{},
		Buttons:       []models.ButtonEntity{},
		CycleButtons:  []models.CycleButtonEntity{},
		Counters:      []models.CounterGroup{},
		MessageBoxes:  []models.MessageBoxEntity{},
		Faults:        map[string]models.FaultGroup{},
		SystemConstants: map[string]any{},
		GeneralConfig: map[string]any{},
		Translations:  []any{},
		Cfr21:         map[string]any{},
		Roles:         map[string]any{},
	}

	raw, err := json.MarshalIndent(original, "", "  ")
	if err != nil {
		t.Fatal(err)
	}

	var loaded models.AppData
	if err := json.Unmarshal(raw, &loaded); err != nil {
		t.Fatal(err)
	}

	ev := loaded.Equipment["electrovalve"][0]
	if ev["cmdType"] != "Monostable" {
		t.Fatalf("cmdType lost: %#v", ev)
	}
	ax := loaded.Equipment["axis"][0]
	if ax["controllerType"] != "ACOPOS" {
		t.Fatalf("controllerType lost: %#v", ax)
	}
}

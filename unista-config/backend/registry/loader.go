package registry

import (
	_ "embed"
	"encoding/json"
	"sync"
)

//go:embed data/equipment.json
var equipmentJSON []byte

//go:embed data/equipment_field_sections.json
var fieldSectionsJSON []byte

//go:embed data/pages.json
var pagesJSON []byte

var (
	loadOnce       sync.Once
	equipment      map[string]EquipmentDefinition
	fieldSections  []EquipmentFieldSection
	pages          map[string]PageDefinition
	loadErr        error
)

func load() {
	loadOnce.Do(func() {
		if err := json.Unmarshal(equipmentJSON, &equipment); err != nil {
			loadErr = err
			return
		}
		if err := json.Unmarshal(fieldSectionsJSON, &fieldSections); err != nil {
			loadErr = err
			return
		}
		if err := json.Unmarshal(pagesJSON, &pages); err != nil {
			loadErr = err
		}
	})
}

// EquipmentRegistry returns all equipment definitions keyed by registry id.
func EquipmentRegistry() (map[string]EquipmentDefinition, error) {
	load()
	return equipment, loadErr
}

// EquipmentFieldSections returns UI section metadata for generic equipment forms.
func EquipmentFieldSections() ([]EquipmentFieldSection, error) {
	load()
	return fieldSections, loadErr
}

// PageRegistry returns all page definitions keyed by registry id.
func PageRegistry() (map[string]PageDefinition, error) {
	load()
	return pages, loadErr
}

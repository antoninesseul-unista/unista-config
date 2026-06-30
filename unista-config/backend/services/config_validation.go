package services

import (
	"encoding/json"
	"fmt"
)

const ConfigSchemaVersion = 1

var requiredConfigKeys = []string{
	"modules",
	"equipment",
	"pages",
	"buttons",
	"cycleButtons",
	"counters",
	"messageBoxes",
	"faults",
	"systemConstants",
	"generalConfig",
	"translations",
	"cfr21",
	"roles",
}

// ValidateConfigJSON checks that raw bytes are a valid application configuration file.
func ValidateConfigJSON(raw []byte) error {
	if len(raw) == 0 {
		return fmt.Errorf("le fichier est vide")
	}

	var root map[string]json.RawMessage
	if err := json.Unmarshal(raw, &root); err != nil {
		return fmt.Errorf("JSON invalide: %w", err)
	}

	for _, key := range requiredConfigKeys {
		if _, ok := root[key]; !ok {
			return fmt.Errorf("champ requis manquant: %s", key)
		}
	}

	if versionRaw, ok := root["schemaVersion"]; ok {
		var version int
		if err := json.Unmarshal(versionRaw, &version); err != nil {
			return fmt.Errorf("schemaVersion invalide")
		}
		if version > ConfigSchemaVersion {
			return fmt.Errorf("version de schéma incompatible (fichier: %d, application: %d)", version, ConfigSchemaVersion)
		}
	}

	return nil
}

// backend/services/config_validation.go
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

// ValidateConfigJSON checks that raw bytes represent a valid application configuration file.
func ValidateConfigJSON(raw []byte) error {
	if len(raw) == 0 {
		return fmt.Errorf("the file is empty")
	}

	var root map[string]json.RawMessage
	if err := json.Unmarshal(raw, &root); err != nil {
		return fmt.Errorf("invalid JSON format: %w", err)
	}

	// Verify all structural required keys are present
	for _, key := range requiredConfigKeys {
		if _, ok := root[key]; !ok {
			// %q ensures the key is properly quoted for readable logs
			return fmt.Errorf("missing required field: %q", key)
		}
	}

	// Validate configuration schema version compatibility if present
	if versionRaw, ok := root["schemaVersion"]; ok {
		var version int
		if err := json.Unmarshal(versionRaw, &version); err != nil {
			return fmt.Errorf("invalid schemaVersion format")
		}
		if version > ConfigSchemaVersion {
			return fmt.Errorf("incompatible schema version (file: %d, application: %d)", version, ConfigSchemaVersion)
		}
	}

	return nil
}
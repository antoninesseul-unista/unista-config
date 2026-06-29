package backend

import (
	"fmt"
	"os"
	"strings"
)

// Parameter matches the Vue frontend structure
type Parameter struct {
	Name  string `json:"name"`
	Actif bool   `json:"actif"`
}

// Electrovalve matches the Vue frontend structure
type Electrovalve struct {
	Name       string      `json:"name"`
	Enable     bool        `json:"enable"`
	CycleTime  int         `json:"cycleTime"`
	CmdType    string      `json:"cmdType"`
	CenterType string      `json:"centerType"`
	SensorType string      `json:"sensorType"`
	Parameters []Parameter `json:"parameters"`
}

// ExportEVToST is automatically bound to the Vue frontend by Wails.
// It receives the JSON, parses it to structs, and writes the .st file.
func (a *App) ExportEVToST(evs []Electrovalve) error {
	const stFilePath = "./test/machine_parameters.st"

	var stBuilder strings.Builder
	stBuilder.WriteString("(* ========================================== *)\n")
	stBuilder.WriteString("(* AUTO-GENERATED ELECTROVALVE CONFIGURATION *)\n")
	stBuilder.WriteString("(* ========================================== *)\n\n")

	for _, ev := range evs {
		if !ev.Enable {
			continue // Skip disabled equipment
		}

		// Base configuration
		stBuilder.WriteString(fmt.Sprintf("(* Equipment: %s *)\n", ev.Name))
		stBuilder.WriteString(fmt.Sprintf("%s.CycleTime := %d;\n", ev.Name, ev.CycleTime))
		stBuilder.WriteString(fmt.Sprintf("%s.CmdType := '%s';\n", ev.Name, ev.CmdType))
		stBuilder.WriteString(fmt.Sprintf("%s.CenterType := '%s';\n", ev.Name, ev.CenterType))
		stBuilder.WriteString(fmt.Sprintf("%s.SensorType := '%s';\n", ev.Name, ev.SensorType))

		// Active Parameters
		for _, param := range ev.Parameters {
			// Extract actual parameter name (remove " (1)", etc.)
			cleanName := strings.Split(param.Name, " (")[0]
			cleanName = strings.ReplaceAll(cleanName, " ", "_")

			state := "FALSE"
			if param.Actif {
				state = "TRUE"
			}
			stBuilder.WriteString(fmt.Sprintf("%s.%s := %s;\n", ev.Name, cleanName, state))
		}
		stBuilder.WriteString("\n")
	}

	err := os.WriteFile(stFilePath, []byte(stBuilder.String()), 0644)
	if err != nil {
		return fmt.Errorf("failed to write ST file: %w", err)
	}

	return nil
}

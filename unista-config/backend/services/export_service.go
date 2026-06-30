// backend/services/export_service.go
package services

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/wailsapp/wails/v2/pkg/runtime"
	"my-machine-app/backend/models"
)

// ExportService handles the generation of PLC files.
type ExportService struct {
	ctx context.Context
}

// NewExportService creates a new instance of ExportService.
func NewExportService() *ExportService {
	return &ExportService{}
}

// Startup saves the Wails context for logging and system dialogs.
func (s *ExportService) Startup(ctx context.Context) {
	s.ctx = ctx
}

// ExportEVToST generates a structured text file for the given electrovalves at the specified path.
func (s *ExportService) ExportEVToST(targetPath string, evs []models.Electrovalve) error {
	if targetPath == "" {
		return fmt.Errorf("target path cannot be empty")
	}

	// Safely create all missing parent directories.
	dir := filepath.Dir(targetPath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		runtime.LogErrorf(s.ctx, "Failed to create export directory: %v", err)
		return fmt.Errorf("failed to create export directory: %w", err)
	}

	var stBuilder strings.Builder
	stBuilder.WriteString("(* ========================================== *)\n")
	stBuilder.WriteString("(* AUTO-GENERATED ELECTROVALVE CONFIGURATION *)\n")
	stBuilder.WriteString("(* ========================================== *)\n\n")

	for _, ev := range evs {
		if !ev.Enable {
			continue // Skip disabled equipment
		}

		stBuilder.WriteString(fmt.Sprintf("(* Equipment: %s *)\n", ev.Name))
		stBuilder.WriteString(fmt.Sprintf("%s.CycleTime := %d;\n", ev.Name, ev.CycleTime))
		stBuilder.WriteString(fmt.Sprintf("%s.CmdType := '%s';\n", ev.Name, ev.CmdType))
		stBuilder.WriteString(fmt.Sprintf("%s.CenterType := '%s';\n", ev.Name, ev.CenterType))
		stBuilder.WriteString(fmt.Sprintf("%s.SensorType := '%s';\n", ev.Name, ev.SensorType))

		for _, param := range ev.Parameters {
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

	if err := os.WriteFile(targetPath, []byte(stBuilder.String()), 0644); err != nil {
		runtime.LogErrorf(s.ctx, "Failed to write ST file: %v", err)
		return fmt.Errorf("failed to write ST file: %w", err)
	}

	runtime.LogInfof(s.ctx, "Successfully exported ST file to: %s", targetPath)
	return nil
}
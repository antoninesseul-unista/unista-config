// backend/generator/generator.go
package generator

import (
	"bytes"
	"embed"
	"fmt"
	"os"
	"path/filepath"
	"text/template"
	"time"

	"my-machine-app/backend/models"
)

//go:embed templates/*.tmpl
var templatesFS embed.FS

// TemplateData encapsulates the root data required by the templates.
// TemplateData encapsulates the root data required by the templates.
type TemplateData struct {
	Date      string
	AppData   models.AppData
	ModuleMap map[models.ModuleID]int
}

// GetEquipment is a helper method for templates to safely fetch equipment lists 
// using a standard string literal, converting it implicitly to models.EquipmentType.
func (t TemplateData) GetEquipment(eqType string) []models.BaseEquipment {
	return t.AppData.Equipment[models.EquipmentType(eqType)]
}

func GenerateFiles(data models.AppData, outputDir string) error {
	// 1. Build the lookup map for modules
	// This translates an ID like "ju06zdi7u" into the integer 1, 2, etc.
	modMap := make(map[models.ModuleID]int) // Modifié : models.ModuleID
	for _, mod := range data.Modules {
		modMap[mod.ID] = mod.Index
	}

	// 2. Create context data
	ctx := TemplateData{
		Date:      time.Now().Format("02/01/2006 15:04:05"),
		AppData:   data,
		ModuleMap: modMap, // Inject the map into the template context
	}

	tmpl, err := template.ParseFS(templatesFS, "templates/*.tmpl")
	if err != nil {
		return fmt.Errorf("failed to parse embedded templates: %w", err)
	}

	if err := os.MkdirAll(outputDir, 0755); err != nil {
		return fmt.Errorf("failed to create output directory: %w", err)
	}

	fileManifest := map[string]string{
		"A20_Modules.tmpl":       "A20_Modules.st",
		"A40_Electrovalves.tmpl": "A40_Electrovalves.st",
		"A50_Vacuums.tmpl":       "A50_Vacuums.st",
		"A60_DigInputs.tmpl":     "A60_DigInputs.st",
		"A70_AnaInputs.tmpl":     "A70_AnaInputs.st",
		"A80_AnaOutputs.tmpl":    "A80_AnaOutputs.st",
		"A90_DirectMotors.tmpl":  "A90_DirectMotors.st",
	}

	for tmplName, outName := range fileManifest {
		var buf bytes.Buffer
		if err := tmpl.ExecuteTemplate(&buf, tmplName, ctx); err != nil {
			return fmt.Errorf("failed to execute template %s: %w", tmplName, err)
		}

		outputPath := filepath.Join(outputDir, outName)
		if err := os.WriteFile(outputPath, buf.Bytes(), 0644); err != nil {
			return fmt.Errorf("failed to write file %s: %w", outName, err)
		}
	}

	return nil
}
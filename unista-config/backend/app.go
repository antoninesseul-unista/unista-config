// backend/app.go
package backend

import (
	"context"
	"fmt"
	"my-machine-app/backend/generator"
	"my-machine-app/backend/models"
	"my-machine-app/backend/services"
	"os"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App manages the application lifecycle and Wails context.
type App struct {
	ctx      context.Context
	canClose bool
}

// NewApp creates a new App struct.
func NewApp() *App {
	return &App{
		canClose: false,
	}
}

// Startup is called at application startup.
func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx
}

// GenerateSTFiles generates ST files based on the provided AppData.
// Exported method called by the Vue frontend
func (a *App) GenerateSTFiles(data models.AppData) string {
	// Define output path (can be made dynamic via a folder dialog later if needed)
	outputDir := "./Generated_ST"
	
	err := generator.GenerateFiles(data, outputDir)
	if err != nil {
		// Log the error and return it to the frontend
		fmt.Printf("[Error] Generation failed: %v\n", err)
		return fmt.Sprintf("Generation failed: %v", err)
	}
	
	return "success"
}

func (a *App) ImportHardwareConfig() ([]models.HardwareModule, error) {
	path, err := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Sélectionner le fichier Hardware.hw",
		Filters: []runtime.FileFilter{
			{DisplayName: "Fichier Hardware (*.hw)", Pattern: "*.hw"},
		},
	})
	
	if err != nil {
		return nil, err
	}
	if path == "" {
		return nil, nil // L'utilisateur a annulé
	}

	parser := services.NewHardwareParserService()
	modules, err := parser.ParseHardwareFile(path)
	if err != nil {
		runtime.LogErrorf(a.ctx, "Erreur de parsing Hardware: %v", err)
		return nil, fmt.Errorf("impossible d'analyser le fichier : %w", err)
	}

	runtime.LogInfof(a.ctx, "%d modules matériels détectés", len(modules))
	return modules, nil
}

// AutoLoadHardware charge et parse automatiquement le fichier Hardware.hw depuis le chemin en dur
func (a *App) AutoLoadHardware() ([]models.HardwareModule, error) {
	// Chemin en dur défini selon la structure standard de ton projet B&R
	hardcodedPath := "./Physical/Standard/Hardware.hw"

	// On vérifie d'abord si le fichier existe pour éviter de lever une erreur bloquante au démarrage
	if _, err := os.Stat(hardcodedPath); os.IsNotExist(err) {
		runtime.LogWarningf(a.ctx, "[Hardware] Fichier introuvable au chemin automatique : %s", hardcodedPath)
		return nil, nil
	}

	parser := services.NewHardwareParserService()
	modules, err := parser.ParseHardwareFile(hardcodedPath)
	if err != nil {
		runtime.LogErrorf(a.ctx, "[Hardware] Erreur lors du chargement automatique : %v", err)
		return nil, err
	}

	runtime.LogInfof(a.ctx, "[Hardware] Chargement automatique réussi : %d modules détectés", len(modules))
	return modules, nil
}
// BeforeClose intercepts the close event to ensure data is saved.
func (a *App) BeforeClose(ctx context.Context) bool {
	if a.canClose {
		return false
	}

	runtime.EventsEmit(ctx, "request-save-and-close")
	return true
}

// ConfirmClose allows the application to exit safely.
func (a *App) ConfirmClose() {
	a.canClose = true
	runtime.Quit(a.ctx)
}
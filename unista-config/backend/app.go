// backend/app.go
package backend

import (
	"context"
	"fmt"
	"my-machine-app/backend/generator"
	"my-machine-app/backend/models"

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
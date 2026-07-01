// backend/app.go
package backend

import (
	"context"
	"fmt"
	"os"

	"my-machine-app/backend/generator"
	"my-machine-app/backend/models"
	"my-machine-app/backend/services"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App manages the application lifecycle, Wails context, and core service dependencies.
type App struct {
	ctx            context.Context
	canClose       bool
	hardwareParser *services.HardwareParserService // Injected dependency
}

// NewApp creates a new App struct instance with pre-initialized service dependencies.
func NewApp() *App {
	return &App{
		canClose:       false,
		hardwareParser: services.NewHardwareParserService(), // Initialized once
	}
}

// Startup is called at application startup by Wails to inject the runtime context.
func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx
}

// GenerateSTFiles handles Structured Text (.st) code generation based on AppData configuration.
// It returns a native Go error which automatically maps to a JavaScript Promise rejection in Vue.
func (a *App) GenerateSTFiles(data models.AppData) error {
	outputDir := "./Generated_ST"
	
	err := generator.GenerateFiles(data, outputDir)
	if err != nil {
		runtime.LogErrorf(a.ctx, "[Generator] Code generation failed: %v", err)
		return fmt.Errorf("generation failed: %w", err)
	}
	
	runtime.LogInfo(a.ctx, "[Generator] Structured Text files successfully generated")
	return nil
}

// AutoLoadHardware automatically scans and parses the Hardware.hw file from a standard project location at startup.
func (a *App) AutoLoadHardware() ([]models.HardwareModule, error) {
	hardcodedPath := "./Physical/Standard/Hardware.hw"

	// Check if the file exists first to avoid interrupting startup sequence with benign warning logs
	if _, err := os.Stat(hardcodedPath); os.IsNotExist(err) {
		runtime.LogWarningf(a.ctx, "[Hardware] Automatic load file not found at default path: %s", hardcodedPath)
		return nil, nil
	}

	// Use the injected service
	modules, err := a.hardwareParser.ParseHardwareFile(hardcodedPath)
	if err != nil {
		runtime.LogErrorf(a.ctx, "[Hardware] Automatic hardware loading sequence failed: %v", err)
		return nil, err
	}

	runtime.LogInfof(a.ctx, "[Hardware] Automatic hardware loading sequence succeeded: %d modules detected", len(modules))
	return modules, nil
}

// BeforeClose intercepts the Wails application close event to guarantee data conservation.
func (a *App) BeforeClose(ctx context.Context) bool {
	if a.canClose {
		return false // Permit application termination
	}

	// Emit an event instructing the Vue frontend to perform auto-save operations before exiting
	runtime.EventsEmit(ctx, "request-save-and-close")
	return true // Cancel current closing process until confirmation is received
}

// ConfirmClose sets the safe closing flag and exits the application runtime.
func (a *App) ConfirmClose() {
	a.canClose = true
	runtime.Quit(a.ctx)
}
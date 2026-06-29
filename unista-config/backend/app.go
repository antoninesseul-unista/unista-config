// backend/app.go
package backend

import (
	"context"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct containing the Wails context and close state flag
type App struct {
	ctx      context.Context
	canClose bool // Flag to allow closing only after frontend confirms
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{
		canClose: false,
	}
}

// Startup is called when the app starts. The context is saved.
func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx
}

// BeforeClose is a Wails hook triggered when the user tries to close the window.
// Returning true prevents the application from closing immediately.
func (a *App) BeforeClose(ctx context.Context) bool {
	// If the frontend has already confirmed the save, allow normal closing
	if a.canClose {
		return false
	}

	// Prevent immediate closing and ask the frontend to save its state
	runtime.EventsEmit(ctx, "request-save-and-close")
	return true
}

// ConfirmClose is bound to the frontend. It is called once the save is complete.
func (a *App) ConfirmClose() {
	a.canClose = true
	runtime.Quit(a.ctx)
}

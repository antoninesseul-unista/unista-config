// backend/app.go
package backend

import (
	"context"

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
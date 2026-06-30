// main.go
package main

import (
	"context"
	"embed"
	"log"

	"my-machine-app/backend"
	"my-machine-app/backend/registry"
	"my-machine-app/backend/services"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	app := backend.NewApp()
	storageService := services.NewStorageService()
	exportService := services.NewExportService()

	calculationService := services.NewCalculationService()
	registryService := registry.NewService()

	err := wails.Run(&options.App{
		Title:  "my-machine-app",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		// Dependency injection of the Wails context into all services
		OnStartup: func(ctx context.Context) {
			app.Startup(ctx)
			storageService.Startup(ctx)
			exportService.Startup(ctx)
		},
		OnBeforeClose: app.BeforeClose,
		Bind: []interface{}{
			app,
			storageService,
			exportService,
			calculationService,
			registryService,
		},
	})

	if err != nil {
		log.Fatalf("Fatal Wails startup error: %v", err)
	}
}
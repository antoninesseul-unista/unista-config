package main

import (
	"context"
	"embed"
	"log"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"

	// Remplace "my-machine-app" par le vrai nom de ton module (voir ton go.mod)
	"my-machine-app/backend"
	"my-machine-app/backend/registry"
	"my-machine-app/backend/services"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// 1. Initialisation des services restants (KISS)
	app := backend.NewApp()
	storageService := services.NewStorageService()
	registryService := registry.NewService()

	// Les services CalculationService et ExportService ont été supprimés
	// Toute cette logique est désormais gérée instantanément par le Frontend (TypeScript).

	// 2. Configuration et lancement de l'application Wails
	err := wails.Run(&options.App{
		Title:  "Unista Config", // Nom de la fenêtre de ton application
		Width:  1280,
		Height: 800,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 250, G: 250, B: 250, A: 1},
		
		// Injection du contexte Wails dans tes services au démarrage
		OnStartup: func(ctx context.Context) {
			app.Startup(ctx)
			storageService.Startup(ctx)
		},
		
		// Interception de la fermeture pour forcer la sauvegarde automatique
		OnBeforeClose: app.BeforeClose,
		
		// 3. Bindings exposés au Frontend (JavaScript/TypeScript)
		Bind: []interface{}{
			app,
			storageService,
			registryService,
		},
	})

	// Gestion d'erreur critique au lancement
	if err != nil {
		log.Fatalf("Fatal error during application startup: %v", err)
	}
}
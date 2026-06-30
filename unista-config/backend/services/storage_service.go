// backend/services/storage_service.go
package services

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/wailsapp/wails/v2/pkg/runtime"
	"my-machine-app/backend/models"
)

// StorageService handles application data persistence.
type StorageService struct {
	ctx context.Context
}

// NewStorageService creates a new instance of StorageService.
func NewStorageService() *StorageService {
	return &StorageService{}
}

// Startup saves the Wails context for logging and events.
func (s *StorageService) Startup(ctx context.Context) {
	s.ctx = ctx
}

// getDataPath resolves the absolute path to the data.json file.
func (s *StorageService) getDataPath() (string, error) {
	configDir, err := os.UserConfigDir()
	if err != nil {
		return "", err
	}

	appDir := filepath.Join(configDir, "my-machine-app")
	if err := os.MkdirAll(appDir, 0755); err != nil {
		return "", err
	}

	return filepath.Join(appDir, "data.json"), nil
}

// LoadData reads the state from disk and parses it into AppData.
func (s *StorageService) LoadData() (models.AppData, error) {
	var data models.AppData
	path, err := s.getDataPath()
	if err != nil {
		return data, err
	}

	file, err := os.ReadFile(path)
	if err != nil {
		if os.IsNotExist(err) {
			return data, nil
		}
		runtime.LogErrorf(s.ctx, "Error reading data file: %v", err)
		return data, err
	}

	if err := json.Unmarshal(file, &data); err != nil {
		runtime.LogErrorf(s.ctx, "JSON parse error: %v", err)
		return data, err
	}

	return data, nil
}

// SaveData serializes the AppData and writes it to disk.
func (s *StorageService) SaveData(data models.AppData) error {
	path, err := s.getDataPath()
	if err != nil {
		return err
	}

	file, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		runtime.LogErrorf(s.ctx, "JSON marshal error: %v", err)
		return err
	}

	if err := os.WriteFile(path, file, 0644); err != nil {
		runtime.LogErrorf(s.ctx, "Error writing data file: %v", err)
		return err
	}

	return nil
}

// ExportConfigToFile opens a native save dialog and writes the JSON configuration.
// Returns the chosen path, or an empty string if the user cancelled.
func (s *StorageService) ExportConfigToFile(jsonContent string) (string, error) {
	if err := ValidateConfigJSON([]byte(jsonContent)); err != nil {
		return "", fmt.Errorf("configuration invalide: %w", err)
	}

	path, err := runtime.SaveFileDialog(s.ctx, runtime.SaveDialogOptions{
		Title:           "Exporter la configuration",
		DefaultFilename: fmt.Sprintf("unista-config-%s.json", time.Now().Format("2006-01-02")),
		Filters: []runtime.FileFilter{
			{DisplayName: "JSON (*.json)", Pattern: "*.json"},
		},
	})
	if err != nil {
		return "", err
	}
	if path == "" {
		return "", nil
	}
	if strings.ToLower(filepath.Ext(path)) != ".json" {
		path += ".json"
	}

	if err := os.WriteFile(path, []byte(jsonContent), 0644); err != nil {
		runtime.LogErrorf(s.ctx, "Error writing config export: %v", err)
		return "", fmt.Errorf("impossible d'écrire le fichier: %w", err)
	}

	runtime.LogInfof(s.ctx, "Configuration exported to: %s", path)
	return path, nil
}

// ImportConfigFromFile opens a native file picker and returns the JSON configuration.
func (s *StorageService) ImportConfigFromFile() (string, error) {
	path, err := runtime.OpenFileDialog(s.ctx, runtime.OpenDialogOptions{
		Title: "Importer une configuration",
		Filters: []runtime.FileFilter{
			{DisplayName: "JSON (*.json)", Pattern: "*.json"},
		},
	})
	if err != nil {
		return "", err
	}
	if path == "" {
		return "", nil
	}
	if strings.ToLower(filepath.Ext(path)) != ".json" {
		return "", fmt.Errorf("extension invalide: sélectionnez un fichier .json")
	}

	raw, err := os.ReadFile(path)
	if err != nil {
		runtime.LogErrorf(s.ctx, "Error reading config import: %v", err)
		return "", fmt.Errorf("impossible de lire le fichier: %w", err)
	}
	if err := ValidateConfigJSON(raw); err != nil {
		return "", err
	}

	runtime.LogInfof(s.ctx, "Configuration imported from: %s", path)
	return string(raw), nil
}
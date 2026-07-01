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

	"my-machine-app/backend/models"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// StorageService handles application data persistence safely.
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
// Returns a pointer so Wails translates an absent file into a true JavaScript 'null'.
func (s *StorageService) LoadData() (*models.AppData, error) {
	path, err := s.getDataPath()
	if err != nil {
		return nil, err
	}

	file, err := os.ReadFile(path)
	if err != nil {
		if os.IsNotExist(err) {
			// File doesn't exist yet: perfectly normal on first launch.
			// Returning nil, nil translates to 'null' in JS without throwing an error.
			return nil, nil
		}
		runtime.LogErrorf(s.ctx, "Error reading data file: %v", err)
		return nil, err
	}

	var data models.AppData
	if err := json.Unmarshal(file, &data); err != nil {
		runtime.LogErrorf(s.ctx, "JSON parse error: %v", err)
		return nil, err
	}

	return &data, nil
}

// SaveData serializes the AppData and writes it to disk using atomic operations.
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

	// ATOMIC WRITE: Write to a temporary file first to prevent corruption
	// in case the application crashes or power fails during the write process.
	tmpPath := path + ".tmp"
	if err := os.WriteFile(tmpPath, file, 0644); err != nil {
		runtime.LogErrorf(s.ctx, "Error writing temp data file: %v", err)
		return err
	}

	// Atomically rename the temp file to the final target file.
	if err := os.Rename(tmpPath, path); err != nil {
		runtime.LogErrorf(s.ctx, "Error renaming temp file to data file: %v", err)
		return err
	}

	return nil
}

// ExportConfigToFile opens a native save dialog and writes the JSON configuration.
// Returns the chosen path, or an empty string if the user cancelled.
func (s *StorageService) ExportConfigToFile(jsonContent string) (string, error) {
	if err := ValidateConfigJSON([]byte(jsonContent)); err != nil {
		return "", fmt.Errorf("invalid configuration: %w", err)
	}

	path, err := runtime.SaveFileDialog(s.ctx, runtime.SaveDialogOptions{
		Title:           "Export Configuration",
		DefaultFilename: fmt.Sprintf("unista-config-%s.json", time.Now().Format("2006-01-02")),
		Filters: []runtime.FileFilter{
			{DisplayName: "JSON (*.json)", Pattern: "*.json"},
		},
	})
	
	if err != nil || path == "" {
		return "", err
	}
	
	if strings.ToLower(filepath.Ext(path)) != ".json" {
		path += ".json"
	}

	if err := os.WriteFile(path, []byte(jsonContent), 0644); err != nil {
		runtime.LogErrorf(s.ctx, "Error writing config export: %v", err)
		return "", fmt.Errorf("could not write file: %w", err)
	}

	runtime.LogInfof(s.ctx, "Configuration exported to: %s", path)
	return path, nil
}

// ImportConfigFromFile opens a native file picker and returns the JSON configuration.
func (s *StorageService) ImportConfigFromFile() (string, error) {
	path, err := runtime.OpenFileDialog(s.ctx, runtime.OpenDialogOptions{
		Title: "Import Configuration",
		Filters: []runtime.FileFilter{
			{DisplayName: "JSON (*.json)", Pattern: "*.json"},
		},
	})
	
	if err != nil || path == "" {
		return "", err
	}
	
	if strings.ToLower(filepath.Ext(path)) != ".json" {
		return "", fmt.Errorf("invalid extension: please select a .json file")
	}

	raw, err := os.ReadFile(path)
	if err != nil {
		runtime.LogErrorf(s.ctx, "Error reading config import: %v", err)
		return "", fmt.Errorf("could not read file: %w", err)
	}
	
	if err := ValidateConfigJSON(raw); err != nil {
		return "", err
	}

	runtime.LogInfof(s.ctx, "Configuration imported from: %s", path)
	return string(raw), nil
}
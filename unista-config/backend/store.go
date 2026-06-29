package backend

import (
	"encoding/json"
	"os"
	"path/filepath"
)

// AppData structure containing all application states.
// It maps directly to the JSON payload sent by the Vue frontend.
type AppData struct {
	SystemConstants map[string]interface{}   `json:"systemConstants"` // <-- THIS WAS MISSING
	GeneralConfig   map[string]interface{}   `json:"generalConfig"`
	Translations    []interface{}            `json:"translations"`
	Cfr21           map[string]interface{}   `json:"cfr21"`
	Roles           map[string]interface{}   `json:"roles"`
	Modules         []interface{}            `json:"modules"`
	Equipment       map[string][]interface{} `json:"equipment"`
	Buttons         []interface{}            `json:"buttons"`
	CycleButtons    []interface{}            `json:"cycleButtons"`
	Counters        []interface{}            `json:"counters"`
	Faults          map[string]interface{}   `json:"faults"` // safety, process, equipment
	MessageBoxes    []interface{}            `json:"messageBoxes"`
	Pages           map[string][]interface{} `json:"pages"`
}

// getDataPath resolves the absolute path to the data.json file.
// It automatically creates the application directory in the OS user config folder if it doesn't exist.
func (a *App) getDataPath() (string, error) {
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

// LoadData reads the data.json file from the disk and parses it into the AppData struct.
// If the file does not exist (first launch), it returns an empty struct without error.
func (a *App) LoadData() (AppData, error) {
	var data AppData
	path, err := a.getDataPath()
	if err != nil {
		return data, err
	}

	file, err := os.ReadFile(path)
	if err != nil {
		if os.IsNotExist(err) {
			return data, nil
		}
		return data, err
	}

	err = json.Unmarshal(file, &data)
	return data, err
}

// SaveData serializes the AppData struct into JSON and writes it to the disk.
func (a *App) SaveData(data AppData) error {
	path, err := a.getDataPath()
	if err != nil {
		return err
	}

	// Using MarshalIndent for better readability if the user opens the JSON file manually
	file, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return err
	}

	// Write file with standard read/write permissions
	return os.WriteFile(path, file, 0644)
}

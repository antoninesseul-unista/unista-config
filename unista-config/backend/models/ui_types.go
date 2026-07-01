// backend/models/ui_types.go
package models

// MachinePageUI configure la visibilité des listes de variables dans les formulaires d'une page.
type MachinePageUI struct {
	ShowProps   bool `json:"showProps"`
	ShowBools   bool `json:"showBools"`
	ShowInts    bool `json:"showInts"`
	ShowReals   bool `json:"showReals"`
	ShowStrings bool `json:"showStrings"`
}

// MachineModuleUI gère l'affichage des sections de configuration propres à un module machine.
type MachineModuleUI struct {
	ShowModuleProps bool `json:"showModuleProps"`
	ShowBools       bool `json:"showBools"`
	ShowInts        bool `json:"showInts"`
	ShowReals       bool `json:"showReals"`
	ShowStrings     bool `json:"showStrings"`
}

// BaseEquipmentUI contrôle le repliement des sections dans les formulaires d'équipements génériques.
type BaseEquipmentUI struct {
	ShowProps         bool `json:"showProps"`
	ShowConfiguration bool `json:"showConfiguration"`
	ShowParams        bool `json:"showParams"`
	ShowController    bool `json:"showController"` // Nettoyé : bool simple à la place de *bool
	ShowProcess       bool `json:"showProcess"`    // Nettoyé : bool simple à la place de *bool
}

// ButtonEntityUI régit l'affichage sélectif des blocs de boutons à impulsions ou bistables.
type ButtonEntityUI struct {
	ShowToggles     bool `json:"showToggles"`
	ShowMomentaries bool `json:"showMomentaries"`
}

// CycleButtonEntityUI détermine l'affichage des listes de boutons liées aux cycles machine.
type CycleButtonEntityUI struct {
	ShowCycles bool `json:"showCycles"`
}

// CounterGroupUI gère la visibilité globale d'un groupe de compteurs ou de lignes de pannes.
type CounterGroupUI struct {
	Show bool `json:"show"`
}

// MessageBoxEntityUI contrôle finement la structure visuelle d'une boîte de message dynamique.
type MessageBoxEntityUI struct {
	ShowTitle    bool `json:"showTitle"`
	ShowLine1    bool `json:"showLine1"`
	ShowLine2    bool `json:"showLine2"`
	ShowBtnLeft  bool `json:"showBtnLeft"`
	ShowBtnRight bool `json:"showBtnRight"`
}
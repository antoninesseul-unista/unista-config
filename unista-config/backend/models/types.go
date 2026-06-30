// backend/models/types.go
package models

// ---------------------------------------------------------
// CORE INTERFACES (Mapped from src/types/index.ts)
// ---------------------------------------------------------

// Translations holds multi-language comments.
type Translations struct {
	CommentFr string `json:"commentFr"`
	CommentEn string `json:"commentEn"`
	CommentDe string `json:"commentDe"`
	CommentEs string `json:"commentEs"`
}

// Reserves holds reserved fields for future use.
type Reserves struct {
	Reserve1 string `json:"reserve1"`
	Reserve2 string `json:"reserve2"`
}

// NamedEntity represents an entity with a name.
type NamedEntity struct {
	Name string `json:"name"`
}

// DescribedEntity combines name, translations, reserves, and details.
// By embedding structs without JSON tags, their fields are flattened in the JSON output (mimicking TS extends).
type DescribedEntity struct {
	NamedEntity
	Translations
	Reserves
	Detail string `json:"detail"`
}

// CycleStep represents a specific step in a cycle.
type CycleStep struct {
	Translations
	Reserves
	StepID int `json:"stepId"`
}

// Parameter represents a single configurable item.
// Optional fields in TS (?) are represented as pointers in Go with omitempty.
type Parameter struct {
	DescribedEntity
	ID            int          `json:"id"`
	Actif         bool         `json:"actif"`
	ResetVisible  *bool        `json:"resetVisible,omitempty"`
	RobotMask     string       `json:"robotMask"`
	RobotVarIndex map[string]*int `json:"robotVarIndex"` // Record<number, number | null>
	RobotVarName  *string      `json:"robotVarName,omitempty"`
	Steps         []CycleStep  `json:"steps,omitempty"`
	FaultCode     *string      `json:"faultCode,omitempty"`
	Severity      *int         `json:"severity,omitempty"`
	Value         any          `json:"value,omitempty"` // 'any' is the modern alias for 'interface{}'
}

// ---------------------------------------------------------
// DOMAIN ENTITIES
// ---------------------------------------------------------

// MachinePageUI represents the UI configuration for a MachinePage.
type MachinePageUI struct {
	ShowProps   bool `json:"showProps"`
	ShowBools   bool `json:"showBools"`
	ShowInts    bool `json:"showInts"`
	ShowReals   bool `json:"showReals"`
	ShowStrings bool `json:"showStrings"`
}

// MachinePage represents a configuration page.
type MachinePage struct {
	DescribedEntity
	ID           string        `json:"id"`
	Index        int           `json:"index"`
	Enable       bool          `json:"enable"`
	IsEM         bool          `json:"isEM"`
	UI           MachinePageUI `json:"ui"`
	ParamBools   []Parameter   `json:"paramBools"`
	ParamInts    []Parameter   `json:"paramInts"`
	ParamReals   []Parameter   `json:"paramReals"`
	ParamStrings []Parameter   `json:"paramStrings"`
}

// BaseEquipmentUI represents the UI configuration for equipment.
type BaseEquipmentUI struct {
	ShowProps         bool  `json:"showProps"`
	ShowConfiguration bool  `json:"showConfiguration"`
	ShowParams        bool  `json:"showParams"`
	ShowController    *bool `json:"showController,omitempty"`
	ShowProcess       *bool `json:"showProcess,omitempty"`
}

// BaseEquipment represents a machine component.
type BaseEquipment struct {
	DescribedEntity
	ID         string          `json:"id"`
	Type       string          `json:"type"`
	Index      int             `json:"index"`
	Enable     bool            `json:"enable"`
	EmID       *string         `json:"emId"`
	RobotID    *string         `json:"robotId,omitempty"`
	CycleTime  int             `json:"cycleTime"`
	UI         BaseEquipmentUI `json:"ui"`
	Parameters []Parameter     `json:"parameters"`
	// Note: Go does not natively support [key: string]: any dynamically alongside typed fields in a struct.
	// For KISS, avoid dynamic root fields unless absolutely necessary.
}

// MachineModuleUI represents the UI configuration for a module.
type MachineModuleUI struct {
	ShowModuleProps bool `json:"showModuleProps"`
	ShowBools       bool `json:"showBools"`
	ShowInts        bool `json:"showInts"`
	ShowReals       bool `json:"showReals"`
	ShowStrings     bool `json:"showStrings"`
}

// MachineModule represents a machine module.
type MachineModule struct {
	DescribedEntity
	ID           string          `json:"id"`
	Index        int             `json:"index"`
	Enable       bool            `json:"enable"`
	IsEM         bool            `json:"isEM"`
	UI           MachineModuleUI `json:"ui"`
	ParamBools   []Parameter     `json:"paramBools"`
	ParamInts    []Parameter     `json:"paramInts"`
	ParamReals   []Parameter     `json:"paramReals"`
	ParamStrings []Parameter     `json:"paramStrings"`
}

// ButtonEntityUI handles button display logic.
type ButtonEntityUI struct {
	ShowToggles     bool `json:"showToggles"`
	ShowMomentaries bool `json:"showMomentaries"`
}

// ButtonEntity maps to frontend button structures.
type ButtonEntity struct {
	NamedEntity
	ID               string         `json:"id"`
	LinkedTo         string         `json:"linkedTo"`
	UI               ButtonEntityUI `json:"ui"`
	ToggleButtons    []Parameter    `json:"toggleButtons"`
	MomentaryButtons []Parameter    `json:"momentaryButtons"`
}

// CycleButtonEntityUI handles cycle button display logic.
type CycleButtonEntityUI struct {
	ShowCycles bool `json:"showCycles"`
}

// CycleButtonEntity maps to cycle buttons.
type CycleButtonEntity struct {
	NamedEntity
	ID       string              `json:"id"`
	LinkedTo string              `json:"linkedTo"`
	UI       CycleButtonEntityUI `json:"ui"`
	Cycles   []Parameter         `json:"cycles"`
}

// CounterGroupUI handles counter display.
type CounterGroupUI struct {
	Show bool `json:"show"`
}

// CounterGroup maps to frontend counters.
type CounterGroup struct {
	NamedEntity
	ID         string         `json:"id"`
	UI         CounterGroupUI `json:"ui"`
	Parameters []Parameter    `json:"parameters"`
}

// MessageBoxEntityUI handles messagebox display logic.
type MessageBoxEntityUI struct {
	ShowTitle    bool `json:"showTitle"`
	ShowLine1    bool `json:"showLine1"`
	ShowLine2    bool `json:"showLine2"`
	ShowBtnLeft  bool `json:"showBtnLeft"`
	ShowBtnRight bool `json:"showBtnRight"`
}

// MessageBoxEntity maps to frontend message boxes.
type MessageBoxEntity struct {
	NamedEntity
	ID       string             `json:"id"`
	Index    int                `json:"index"`
	UI       MessageBoxEntityUI `json:"ui"`
	Title    Parameter          `json:"title"`
	Line1    Parameter          `json:"line1"`
	Line2    Parameter          `json:"line2"`
	BtnLeft  Parameter          `json:"btnLeft"`
	BtnRight Parameter          `json:"btnRight"`
}

// FaultCategory maps to fault groupings.
type FaultCategory struct {
	NamedEntity
	UI    CounterGroupUI `json:"ui"` // Reuse UI struct with just 'show'
	Items []Parameter    `json:"items"`
}

// FaultGroup maps to root fault structures.
type FaultGroup struct {
	NamedEntity
	ID         string          `json:"id"`
	Categories []FaultCategory `json:"categories"`
}

// ---------------------------------------------------------
// ROOT APPLICATION STATE
// ---------------------------------------------------------

// AppData contains all application states strongly typed.
// It maps directly to the JSON payload sent by the Vue frontend.
type AppData struct {
	SchemaVersion   int                        `json:"schemaVersion,omitempty"`
	SystemConstants map[string]any             `json:"systemConstants"`
	GeneralConfig   map[string]any             `json:"generalConfig"`
	Translations    []any                      `json:"translations"`
	Cfr21           map[string]any             `json:"cfr21"`
	Roles           map[string]any             `json:"roles"`

	// Strongly typed sections
	Modules      []MachineModule            `json:"modules"`
	Equipment    map[string][]map[string]any `json:"equipment"`
	Buttons      []ButtonEntity             `json:"buttons"`
	CycleButtons []CycleButtonEntity        `json:"cycleButtons"`
	Counters     []CounterGroup             `json:"counters"`
	Faults       map[string]FaultGroup      `json:"faults"`
	MessageBoxes []MessageBoxEntity         `json:"messageBoxes"`
	Pages        map[string][]MachinePage   `json:"pages"`
}

// ---------------------------------------------------------
// EXPORT ENTITIES
// ---------------------------------------------------------

// Electrovalve represents a specific component used for ST file generation.
// This structure is explicitly bound to the Vue frontend for export purposes.
type Electrovalve struct {
	Name       string      `json:"name"`
	Enable     bool        `json:"enable"`
	CycleTime  int         `json:"cycleTime"`
	CmdType    string      `json:"cmdType"`
	CenterType string      `json:"centerType"`
	SensorType string      `json:"sensorType"`
	Parameters []Parameter `json:"parameters"`
}
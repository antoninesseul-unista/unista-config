// backend/models/types.go
package models

// ---------------------------------------------------------
// ALIAS DE TYPES (SÉCURITÉ DES IDENTIFIANTS)
// ---------------------------------------------------------

// Création d'alias stricts pour éviter de mélanger les différents IDs
type EntityID string
type ModuleID string
type RobotID  string

// ---------------------------------------------------------
// ÉNUMÉRATIONS (SÉCURITÉ DES TYPES FIXES)
// ---------------------------------------------------------

// EquipmentType restreint les valeurs possibles pour les types d'équipements
type EquipmentType string

const (
	TypeElectrovalve EquipmentType = "electrovalve"
	TypeVacuum       EquipmentType = "vacuum"
	TypeDigitalInput EquipmentType = "digitalInput"
	TypeAnalogInput  EquipmentType = "analogInput"
	TypeAnalogOutput EquipmentType = "analogOutput"
	TypeDirectMotor  EquipmentType = "directMotor"
	TypeAxis         EquipmentType = "axis"
	TypeMechatro     EquipmentType = "mechatro"
	TypeCamera       EquipmentType = "camera"
	TypeRobot        EquipmentType = "robot"
	TypeWorkplace    EquipmentType = "workplace"
	TypeLed          EquipmentType = "led"
)

// ---------------------------------------------------------
// STRUCTURES DE BASE & TEXTES (MÉTADONNÉES)
// ---------------------------------------------------------

type Translations struct {
	CommentFr string `json:"commentFr"`
	CommentEn string `json:"commentEn"`
	CommentDe string `json:"commentDe"`
	CommentEs string `json:"commentEs"`
}

type Reserves struct {
	Reserve1 string `json:"reserve1"`
	Reserve2 string `json:"reserve2"`
}

type Metadata struct {
	Translations
	Reserves
	Detail string `json:"detail"`
}

type DescribedEntity struct {
	Name string `json:"name"`
	Metadata
}

type CycleStep struct {
	Translations
	Reserves
	StepID int `json:"stepId"`
}

// ---------------------------------------------------------
// PARAMÈTRES AUTOMATE (PLC)
// ---------------------------------------------------------

type Parameter struct {
	DescribedEntity
	ID            int             `json:"id"`
	Actif         bool            `json:"actif"`
	ResetVisible  bool            `json:"resetVisible"`
	RobotMask     string          `json:"robotMask"`
	RobotVarIndex map[string]*int `json:"robotVarIndex"`
	RobotVarName  string          `json:"robotVarName"`
	Steps         []CycleStep     `json:"steps,omitempty"`
	FaultCode     string          `json:"faultCode,omitempty"`
	Severity      int             `json:"severity,omitempty"`
	Value         any             `json:"value,omitempty"`
}

type ParameterCollection struct {
	ParamBools   []Parameter `json:"paramBools"`
	ParamInts    []Parameter `json:"paramInts"`
	ParamReals   []Parameter `json:"paramReals"`
	ParamStrings []Parameter `json:"paramStrings"`
}

// ---------------------------------------------------------
// ENTITÉS STRUCTURELLES (PAGES & MODULES)
// ---------------------------------------------------------

type MachinePage struct {
	DescribedEntity
	ID     EntityID      `json:"id"` // Typé avec EntityID
	Index  int           `json:"index"`
	Enable bool          `json:"enable"`
	IsEM   bool          `json:"isEM"`
	UI     MachinePageUI `json:"ui"`
	
	ParameterCollection
}

type MachineModule struct {
	DescribedEntity
	ID     ModuleID        `json:"id"` // Typé spécifiquement avec ModuleID !
	Index  int             `json:"index"`
	Enable bool            `json:"enable"`
	IsEM   bool            `json:"isEM"`
	UI     MachineModuleUI `json:"ui"`
	
	ParameterCollection
}

type BaseEquipment struct {
	ID            EntityID       `json:"id"`
	Type          EquipmentType  `json:"type"`       // Sécurisé par l'Enum
	Index         int            `json:"index"`
	Enable        bool           `json:"enable"`
	Name          string         `json:"name"`
	EmID          ModuleID       `json:"emId"`       // Ne peut accepter qu'un ModuleID
	RobotID       RobotID        `json:"robotId,omitempty"` // Ne peut accepter qu'un RobotID
	CycleTime     int            `json:"cycleTime"`
	Translations  Metadata       `json:"translations"`
	Configuration map[string]any `json:"configuration"`
	Parameters    []Parameter    `json:"parameters"`
	UI            BaseEquipmentUI `json:"ui"`
}

// ---------------------------------------------------------
// ACTIONS & COMPTEURS IHM
// ---------------------------------------------------------

type ButtonEntity struct {
	Name             string         `json:"name"`
	ID               EntityID       `json:"id"`
	LinkedTo         string         `json:"linkedTo"`
	UI               ButtonEntityUI `json:"ui"`
	ToggleButtons    []Parameter    `json:"toggleButtons"`
	MomentaryButtons []Parameter    `json:"momentaryButtons"`
}

type CycleButtonEntity struct {
	Name     string              `json:"name"`
	ID       EntityID            `json:"id"`
	LinkedTo string              `json:"linkedTo"`
	UI       CycleButtonEntityUI `json:"ui"`
	Cycles   []Parameter         `json:"cycles"`
}

type CounterGroup struct {
	Name       string         `json:"name"`
	ID         EntityID       `json:"id"`
	UI         CounterGroupUI `json:"ui"`
	Parameters []Parameter    `json:"parameters"`
}

type MessageBoxEntity struct {
	Name     string             `json:"name"`
	ID       EntityID           `json:"id"`
	Index    int                `json:"index"`
	UI       MessageBoxEntityUI `json:"ui"`
	Title    Parameter          `json:"title"`
	Line1    Parameter          `json:"line1"`
	Line2    Parameter          `json:"line2"`
	BtnLeft  Parameter          `json:"btnLeft"`
	BtnRight Parameter          `json:"btnRight"`
}

// ---------------------------------------------------------
// ALARMES & FAULTS
// ---------------------------------------------------------

type FaultCategory struct {
	Name  string         `json:"name"`
	UI    CounterGroupUI `json:"ui"`
	Items []Parameter    `json:"items"`
}

type FaultGroup struct {
	Name       string          `json:"name"`
	ID         EntityID        `json:"id"`
	Categories []FaultCategory `json:"categories"`
}

// ---------------------------------------------------------
// EXPORTS & CONTEXTE MATÉRIEL
// ---------------------------------------------------------
type HardwareChannel struct {
	ChannelNumber int `json:"channelNumber"`
}

type HardwareModule struct {
	Name        string            `json:"name"`
	ModuleType  string            `json:"moduleType"`
	Category    string            `json:"category"`
	NodeNumber  int               `json:"nodeNumber"`
	AxesCount   int               `json:"axesCount"`
	Channels    []HardwareChannel `json:"channels"`
	Description string            `json:"description"`
}

// ---------------------------------------------------------
// RACINE DE L'APPLICATION (PAYLOAD GLOBAL)
// ---------------------------------------------------------

type AppData struct {
	SchemaVersion    int                               `json:"schemaVersion,omitempty"`
	SystemConstants  map[string]any                    `json:"systemConstants"`
	GeneralConfig    map[string]any                    `json:"generalConfig"`
	Translations     []any                             `json:"translations"`
	Cfr21            map[string]any                    `json:"cfr21"`
	Roles            map[string]any                    `json:"roles"`
	DetectedHardware []HardwareModule                  `json:"detectedHardware"`
	
	Modules          []MachineModule                   `json:"modules"`
	
	// Dictionnaire ultra-sécurisé : les clés NE PEUVENT ETRE que des EquipmentType valides
	Equipment        map[EquipmentType][]BaseEquipment `json:"equipment"` 
	
	Buttons          []ButtonEntity                    `json:"buttons"`
	CycleButtons     []CycleButtonEntity               `json:"cycleButtons"`
	Counters         []CounterGroup                    `json:"counters"`
	Faults           map[string]FaultGroup             `json:"faults"`
	MessageBoxes     []MessageBoxEntity                `json:"messageBoxes"`
	Pages            map[string][]MachinePage          `json:"pages"`
}
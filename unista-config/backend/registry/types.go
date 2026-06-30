package registry

// ConfigField describes a single form field in the equipment UI.
type ConfigField struct {
	Label        string   `json:"label"`
	Field        string   `json:"field"`
	Type         string   `json:"type"`
	Options      []string `json:"options,omitempty"`
	DefaultValue any      `json:"defaultValue,omitempty"`
}

// SidebarCapabilities controls ParameterSidebar visibility.
type SidebarCapabilities struct {
	ShowName           bool `json:"showName"`
	ShowTranslations   bool `json:"showTranslations"`
	ShowReserves       bool `json:"showReserves"`
	ShowRobot          bool `json:"showRobot"`
	ShowRobotVarName   bool `json:"showRobotVarName,omitempty"`
	ShowResetVisible   bool `json:"showResetVisible,omitempty"`
	ShowStepsConfig    bool `json:"showStepsConfig,omitempty"`
	ShowFaultInfo      bool `json:"showFaultInfo,omitempty"`
}

// EquipmentDefinition is the UI schema for one equipment type.
type EquipmentDefinition struct {
	Type                string              `json:"type"`
	Label               string              `json:"label"`
	Prefix              string              `json:"prefix"`
	HasEmLink           bool                `json:"hasEmLink"`
	HasParameters       bool                `json:"hasParameters,omitempty"`
	AllowsFastCycle     bool                `json:"allowsFastCycle,omitempty"`
	CustomPanel         string              `json:"customPanel,omitempty"`
	MenuIcon            string              `json:"menuIcon,omitempty"`
	ConfigIcon          string              `json:"configIcon,omitempty"`
	ConfigFields        []ConfigField       `json:"configFields"`
	ControllerIcon      string              `json:"controllerIcon,omitempty"`
	ControllerFields    []ConfigField       `json:"controllerFields,omitempty"`
	ProcessIcon         string              `json:"processIcon,omitempty"`
	ProcessFields       []ConfigField       `json:"processFields,omitempty"`
	ParameterFields     []ConfigField       `json:"parameterFields,omitempty"`
	SidebarCapabilities SidebarCapabilities `json:"sidebarCapabilities"`
}

// EquipmentFieldSection groups fields into a collapsible UI section.
type EquipmentFieldSection struct {
	Label          string `json:"label"`
	FieldsKey      string `json:"fieldsKey"`
	IconKey        string `json:"iconKey,omitempty"`
	UIKey          string `json:"uiKey"`
	FilterVisible  bool   `json:"filterVisible,omitempty"`
}

// PageDefinition is the UI schema for machine pages.
type PageDefinition struct {
	Type     string `json:"type"`
	Label    string `json:"label"`
	Prefix   string `json:"prefix"`
	MaxSlots int    `json:"maxSlots"`
	MenuIcon string `json:"menuIcon"`
}

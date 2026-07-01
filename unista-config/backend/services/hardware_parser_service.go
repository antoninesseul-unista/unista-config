package services

import (
	"encoding/xml"
	"io"
	"os"
	"regexp"
	"strconv"
	"strings"

	"my-machine-app/backend/models"
)

type HardwareParserService struct{}

func NewHardwareParserService() *HardwareParserService {
	return &HardwareParserService{}
}

// xmlParameter représente la balise <Parameter> de B&R
type xmlParameter struct {
	ID       string `xml:"ID,attr"`
	Location string `xml:"Location,attr"`
	Value    string `xml:"Value,attr"`
}

// xmlModule représente la balise <Module> et ses attributs
type xmlModule struct {
	Name        string         `xml:"Name,attr"`
	Type        string         `xml:"Type,attr"`
	Description string         `xml:"Description,attr"`
	NodeNumber  int            `xml:"NodeNumber,attr"`
	Parameters  []xmlParameter `xml:"Parameter"` // Parse automatiquement les enfants directs
}

func (s *HardwareParserService) ParseHardwareFile(filePath string) ([]models.HardwareModule, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	var detectedModules []models.HardwareModule
	decoder := xml.NewDecoder(file)

	for {
		t, err := decoder.Token()
		if err == io.EOF {
			break
		}
		if err != nil {
			return nil, err
		}

		switch se := t.(type) {
		case xml.StartElement:
			if se.Name.Local == "Module" {
				var mod xmlModule
				if err := decoder.DecodeElement(&mod, &se); err == nil {
					if hwMod, ok := s.classifyModule(mod); ok {
						detectedModules = append(detectedModules, hwMod)
					}
				}
			}
		}
	}

	return detectedModules, nil
}

func (s *HardwareParserService) classifyModule(mod xmlModule) (models.HardwareModule, bool) {
	hw := models.HardwareModule{
		Name:        mod.Name,
		ModuleType:  mod.Type,
		Description: mod.Description,
		NodeNumber:  mod.NodeNumber, // Récupération directe du NodeNumber
		AxesCount:   1,
	}

	// Regex pour extraire le channel : Channel[2]
	channelRegex := regexp.MustCompile(`Channel\[(\d+)\]`)

	// Récupération précise des canaux depuis les paramètres B&R
	for _, p := range mod.Parameters {
		if p.ID == "AxisReference" {
			matches := channelRegex.FindStringSubmatch(p.Location)
			if len(matches) > 1 {
				if ch, err := strconv.Atoi(matches[1]); err == nil {
					hw.Channels = append(hw.Channels, models.HardwareChannel{ChannelNumber: ch})
				}
			}
		}
	}

	upperType := strings.ToUpper(mod.Type)
	upperName := strings.ToUpper(mod.Name)
	upperDesc := strings.ToUpper(mod.Description)

	// 1. ACOPOS P3
	if strings.HasPrefix(upperType, "8E1") || strings.HasPrefix(upperType, "E1") ||
		strings.HasPrefix(upperType, "8EI") || strings.HasPrefix(upperType, "EI") {
		hw.Category = "ACOPOS_P3"
		if strings.Contains(upperType, "HWS") {
			hw.AxesCount = 1
		} else if strings.Contains(upperType, "HWD") {
			hw.AxesCount = 2
		} else if strings.Contains(upperType, "HWT") {
			hw.AxesCount = 3
		} else if strings.Contains(upperType, "HWQ") {
			hw.AxesCount = 4
		}
		return hw, true
	}

	// 2. ACOPOSmicro
	if strings.HasPrefix(upperType, "80VD") {
		hw.Category = "ACOPOS_MICRO"
		if strings.Contains(upperType, "80VD100PD") {
			hw.AxesCount = 2
		} else {
			hw.AxesCount = 1 // Valeur par défaut
		}
		return hw, true
	}

	if strings.HasPrefix(upperType, "8B0") || strings.HasPrefix(upperType, "8BVI") ||
		strings.HasPrefix(upperType, "8BVP") || strings.HasPrefix(upperType, "BVI") {
		hw.Category = "ACOPOS_MULTI"
		return hw, true
	}

	inverterPrefixes := []string{"P74", "8I74", "P76", "8I76", "P66", "8I66", "P77", "8I77", "P86", "8I86", "P96", "8I96"}
	for _, prefix := range inverterPrefixes {
		if strings.HasPrefix(upperType, prefix) {
			hw.Category = "ACOPOS_INVERTER"
			return hw, true
		}
	}

	if strings.HasPrefix(upperType, "X20SM") {
		hw.Category = "STEPPER"
		return hw, true
	}

	if strings.Contains(upperName, "PSE") || strings.Contains(upperDesc, "HALSTRUP") {
		hw.Category = "PSE"
		return hw, true
	}

	return hw, false
}
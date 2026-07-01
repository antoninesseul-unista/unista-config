// backend/registry/api.go
package registry

import "my-machine-app/backend/models" // Importation nécessaire pour la signature de GetEquipmentRegistry

// Service exposes UI registry definitions to the Vue frontend via Wails.
type Service struct{}

// NewService creates a registry Service for Wails binding.
func NewService() *Service {
	return &Service{}
}

// GetEquipmentRegistry returns all equipment UI definitions.
// Modifié : la signature renvoie désormais un dictionnaire indexé par models.EquipmentType
func (s *Service) GetEquipmentRegistry() (map[models.EquipmentType]EquipmentDefinition, error) {
	return EquipmentRegistry()
}

// GetEquipmentFieldSections returns collapsible section metadata for equipment forms.
func (s *Service) GetEquipmentFieldSections() ([]EquipmentFieldSection, error) {
	return EquipmentFieldSections()
}

// GetPageRegistry returns all page UI definitions.
func (s *Service) GetPageRegistry() (map[string]PageDefinition, error) {
	return PageRegistry()
}
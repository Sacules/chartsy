package main

import (
	"gitlab.com/sacules/chartsy/internal/models"
)

type templateData struct {
	Chart *models.Chart
}

type InputSlider struct {
	ID           string
	Label        string
	Name         string
	DefaultValue uint8
	Min          uint8
	Max          uint8
}

func newInputSlider(id, label, name string, defaultValue, min, max uint8) *InputSlider {
	return &InputSlider{
		ID:           id,
		Label:        label,
		Name:         name,
		DefaultValue: defaultValue,
		Min:          min,
		Max:          max,
	}
}

type InputText struct {
	Label        string
	Name         string
	DefaultValue string
}

func newInputText(label, name, defaultValue string) *InputText {
	return &InputText{
		Label:        label,
		Name:         name,
		DefaultValue: defaultValue,
	}
}

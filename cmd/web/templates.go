package main

import (
	"gitlab.com/sacules/chartsy/internal/models"
)

type templateData struct {
	Chart *models.Chart
}

type InputSlider struct {
	ID           string
	Class        string
	Label        string
	Name         string
	DefaultValue uint8
	Min          uint8
	Max          uint8
}

func newInputSlider(id, class, label, name string, defaultValue, min, max uint8) *InputSlider {
	return &InputSlider{
		ID:           id,
		Class:        class,
		Label:        label,
		Name:         name,
		DefaultValue: defaultValue,
		Min:          min,
		Max:          max,
	}
}

type InputText struct {
	Class        string
	Label        string
	Name         string
	DefaultValue string
}

func newInputText(class, label, name, defaultValue string) *InputText {
	return &InputText{
		Class:        class,
		Label:        label,
		Name:         name,
		DefaultValue: defaultValue,
	}
}

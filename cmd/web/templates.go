package main

import (
	"gitlab.com/sacules/chartsy/internal/models"
)

type templateData struct {
	Chart *models.Chart
}

type Slider struct {
	ID           string
	Label        string
	Name         string
	DefaultValue uint8
	Min          uint8
	Max          uint8
}

func chartSlider(id, label, name string, defaultValue, min, max uint8) *Slider {
	return &Slider{
		ID:           id,
		Label:        label,
		Name:         name,
		DefaultValue: defaultValue,
		Min:          min,
		Max:          max,
	}
}

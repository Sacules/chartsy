package main

import (
	"gitlab.com/sacules/chartsy/internal/models"
)

type templateData struct {
	Chart *models.Chart
	Form  any
}

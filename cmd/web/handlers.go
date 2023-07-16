package main

import (
	"errors"
	"html/template"
	"net/http"

	"gitlab.com/sacules/chartsy/internal/models"
)

var functions = template.FuncMap{
	"chartSlider": chartSlider,
}

func (app *application) home(w http.ResponseWriter, r *http.Request) {
	c, err := app.charts.Get(1)
	if err != nil {
		if errors.Is(err, models.ErrNoRecord) {
			app.notFound(w)
		} else {
			app.serverError(w, err)
		}

		return
	}

	files := []string{
		"./ui/html/base.html",
		"./ui/html/pages/home.html",
		"./ui/html/partials/sidenav.html",
		"./ui/html/partials/flyout.html",
		"./ui/html/partials/slider.html",
	}

	ts, err := template.New("master").Funcs(functions).ParseFiles(files...)
	if err != nil {
		app.errorLog.Println(err.Error())
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	data := &templateData{
		Chart: c,
	}

	err = ts.ExecuteTemplate(w, "base", data)
	if err != nil {
		app.errorLog.Println(err.Error())
		http.Error(w, "Internal server error", http.StatusInternalServerError)
	}
}

package main

import (
	"errors"
	"fmt"
	"html/template"
	"net/http"
	"strconv"

	"github.com/Masterminds/sprig"
	"github.com/frustra/bbcode"

	"gitlab.com/sacules/chartsy/internal/models"
)

var functions = template.FuncMap{
	"newInputText":   newInputText,
	"newInputSlider": newInputSlider,
	"html": func(val any) template.HTML {
		return template.HTML(fmt.Sprint(val))
	},
	"bbcode": func(val any) string {
		c := bbcode.NewCompiler(true, true)

		return c.Compile(fmt.Sprint(val))
	},
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
		"./ui/html/partials/input/slider.html",
		"./ui/html/partials/input/text.html",
	}

	ts, err := template.New("master").Funcs(functions).Funcs(sprig.FuncMap()).ParseFiles(files...)
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

func (app *application) chartsSettings(w http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		app.errorLog.Println(err)
		app.clientError(w, http.StatusBadRequest)
		return
	}

	title := r.PostForm.Get("title")
	id, _ := strconv.Atoi(r.PostForm.Get("id"))
	columns, _ := strconv.Atoi(r.PostForm.Get("columns"))
	rows, _ := strconv.Atoi(r.PostForm.Get("rows"))
	spacing, _ := strconv.Atoi(r.PostForm.Get("spacing"))
	padding, _ := strconv.Atoi(r.PostForm.Get("padding"))
	imgsHeight, _ := strconv.Atoi(r.PostForm.Get("imgs-height"))

	err = app.charts.Update(id, title, uint8(columns), uint8(rows), uint8(spacing), uint8(padding), uint8(imgsHeight))
	if err != nil {
		app.serverError(w, err)
		return
	}

	c, err := app.charts.Get(id)
	if err != nil {
		if errors.Is(err, models.ErrNoRecord) {
			app.notFound(w)
		} else {
			app.serverError(w, err)
		}

		return
	}

	files := []string{
		"./ui/html/pages/home.html",
	}

	ts, err := template.New("master").Funcs(functions).Funcs(sprig.FuncMap()).ParseFiles(files...)
	if err != nil {
		app.errorLog.Println(err.Error())
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	data := &templateData{
		Chart: c,
	}

	err = ts.ExecuteTemplate(w, "main", data)
	if err != nil {
		app.errorLog.Println(err.Error())
		http.Error(w, "Internal server error", http.StatusInternalServerError)
	}
}

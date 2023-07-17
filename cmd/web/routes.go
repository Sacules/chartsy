package main

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func (app *application) routes() *chi.Mux {
	fileServer := http.FileServer(http.Dir("./ui/static/"))

	r := chi.NewRouter()
	r.Use(middleware.Recoverer)

	r.Handle("/static/*", http.StripPrefix("/static", fileServer))
	r.Get("/", app.home)
	r.Route("/charts", func(r chi.Router) {
		r.Patch("/settings", func(w http.ResponseWriter, r *http.Request) {
			err := r.ParseForm()
			if err != nil {
				app.errorLog.Println(err)
				app.clientError(w, http.StatusBadRequest)
				return
			}

			title := r.Form.Get("title")
			id, _ := strconv.Atoi(r.Form.Get("id"))
			columns, _ := strconv.Atoi(r.Form.Get("columns"))
			rows, _ := strconv.Atoi(r.Form.Get("rows"))
			spacing, _ := strconv.Atoi(r.Form.Get("spacing"))
			margins, _ := strconv.Atoi(r.Form.Get("margins"))
			imgsHeight, _ := strconv.Atoi(r.Form.Get("imgs-height"))

			fmt.Fprintln(w, "received something!")
			fmt.Fprintln(w, "title", title, "id", id, "columns", columns, "rows", rows, "spacing", spacing, "margins", margins, "imgs-height", imgsHeight)
		})
	})

	r.NotFound(func(w http.ResponseWriter, r *http.Request) {
		app.notFound(w)
	})

	return r
}

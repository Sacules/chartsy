package main

import (
	"net/http"

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
		r.Patch("/settings", app.chartsSettings)
	})

	r.NotFound(func(w http.ResponseWriter, r *http.Request) {
		app.notFound(w)
	})

	return r
}

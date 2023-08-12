package main

import (
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/httprate"
)

func (app *application) routes() *chi.Mux {
	fileServer := http.FileServer(http.Dir("./public"))

	r := chi.NewRouter()

	r.Group(func(r chi.Router) {
		r.Use(middleware.Recoverer, middleware.RedirectSlashes, middleware.Compress(5, "text/javascript", "text/css"))
		r.Handle("/public/*", http.StripPrefix("/public", fileServer))
	})

	r.Group(func(r chi.Router) {
		r.Use(middleware.Recoverer, app.sessionManager.LoadAndSave)

		r.Get("/", app.index)
		r.Route("/search", func(r chi.Router) {
			// Rate limit the last.fm API by now
			r.Use(httprate.LimitAll(3, 1*time.Second))

			r.Post("/", app.search)
		})
		r.Route("/charts", func(r chi.Router) {
			r.Patch("/settings", app.chartsSettings)
		})

		r.NotFound(func(w http.ResponseWriter, r *http.Request) {
			app.notFound(w)
		})

	})
	return r
}

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
		r.Use(middleware.Recoverer, middleware.RedirectSlashes, middleware.Compress(5, "text/javascript", "text/css", "text/plain"))
		r.Handle("/assets/*", http.StripPrefix("/assets", fileServer))
	})

	r.Group(func(r chi.Router) {
		r.Use(app.sessionManager.LoadAndSave, middleware.Recoverer, middleware.Compress(5, "text/html"))

		r.Route("/search", func(r chi.Router) {
			// Rate limit the last.fm API by now
			r.Use(httprate.LimitAll(2, 1*time.Second))

			r.Post("/", app.search)
		})

		r.Route("/", func(r chi.Router) {
			r.Get("/", app.chart)
			r.Post("/new", app.chartNew)
			r.Patch("/settings", app.chartSettings)
			r.Patch("/images", app.chartImages)
		})
		r.Post("/signup", app.userSignupPost)
		r.Post("/login", app.userLogin)
		r.Post("/logout", app.userLogout)

		r.Get("/verify", app.emailVerify)

		r.NotFound(func(w http.ResponseWriter, r *http.Request) {
			http.Redirect(w, r, "/", http.StatusFound)
		})
	})

	return r
}

package main

import (
	"net/http"
	"net/url"
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
		r.Use(middleware.Recoverer, middleware.Compress(5, "text/html"))

		r.Route("/search", func(r chi.Router) {
			// Rate limit the last.fm API by now
			r.Use(httprate.LimitAll(2, 1*time.Second))

			r.Post("/", app.search)
		})

		r.Get("/", func(w http.ResponseWriter, r *http.Request) {
			data := app.newTemplateData(r)
			data.Form = userSignupForm{}
			app.render(w, http.StatusOK, "home", data)
		})
		r.Get("/chart", app.chart)
		r.Post("/signup", app.userSignupPost)
		r.Post("/login", app.userLogin)
		r.Post("/logout", app.userLogout)
		r.Patch("/settings", app.chartSettings)

		r.Get("/email", func(w http.ResponseWriter, r *http.Request) {
			params := url.Values{}
			params.Add("email", "leociancalucas@gmail.com")
			params.Add("code", randomString(8))
			data := &templateData{
				UserVerificationURL: "http://localhost:4000/verify?" + params.Encode(),
			}
			app.renderFragment(w, http.StatusOK, "home", "confirmation-mail", data)
		})

		r.Get("/verify", app.emailVerify)

		r.NotFound(func(w http.ResponseWriter, r *http.Request) {
			http.Redirect(w, r, "/", http.StatusFound)
		})
	})

	return r
}

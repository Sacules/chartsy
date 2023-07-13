package main

import (
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func main()  {
	fileServer := http.FileServer(http.Dir("./ui/static/"))

	r := chi.NewRouter()
	r.Use(middleware.Logger, middleware.Recoverer)

	r.Handle("/static/*", http.StripPrefix("/static", fileServer))
	r.Get("/", home)

	log.Println("starting server on :4000")
	log.Fatal(http.ListenAndServe(":4000", r))
}

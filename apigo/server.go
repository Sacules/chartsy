package main

import (
	"net/http"

	"github.com/asdine/storm"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/render"
	"gitlab.com/sacules/log"
)

type server struct {
	router    *chi.Mux
	imdbCache *storm.DB
}

func newServer() *server {
	db, err := storm.Open("imdbCache.db")
	if err != nil {
		log.Error(err)
		return nil
	}

	return &server{router: setupRouter(), imdbCache: db}
}

func (s *server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	s.router.ServeHTTP(w, r)
}

func setupRouter() *chi.Mux {
	r := chi.NewRouter()

	r.Use(
		render.SetContentType(render.ContentTypeJSON),
		middleware.Recoverer,
		Logger,
	)

	return r
}

func (s *server) dbFind(searchterm string) imdbCachedResult {
	var result imdbCachedResult

	err := s.imdbCache.One("Searchterm", searchterm, &result)
	if err != nil && err != storm.ErrNotFound {
		log.Error(err)
	}

	return result
}

func (s *server) dbSave(res *imdbCachedResult) error {
	return s.imdbCache.Save(res)
}

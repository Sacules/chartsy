package main

import (
	"net/http"
	"net/url"
	"os"

	"github.com/go-chi/chi"
	"github.com/go-chi/render"
	"gitlab.com/sacules/log"
)

const (
	userAgent = "topsters"
)

func (s *server) routes() {
	log.EnableDebug = true

	s.router.Route("/api", func(r chi.Router) {
		r.Get("/albums", s.handleGetMusic())
		r.Get("/games", s.handleGetGames())
	})

	log.Info("installed the following routes:")
	walkFunc := func(method, route string, handler http.Handler, middlewares ...func(http.Handler) http.Handler) error {
		log.Info(method, "\t", route)
		return nil
	}

	chi.Walk(s.router, walkFunc)
}

func (s *server) handleGetMusic() http.HandlerFunc {
	type album struct {
		Title  string `json:"title"`
		Author string `json:"author"`
		Url    string `json:"url"`
	}

	type response struct {
		Albums []album `json:"albums"`
	}

	apiUrl := "http://ws.audioscrobbler.com/2.0/"
	apiKey, ok := os.LookupEnv("LASTFM_KEY")
	if !ok {
		log.Warning("missing LASTFM_KEY")
		return nil
	}

	return func(w http.ResponseWriter, r *http.Request) {
		err := r.ParseForm()
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		search := r.Form.Get("album")

		query := &url.Values{}
		query.Set("method", "album.search")
		query.Set("album", search)
		query.Set("api_key", apiKey)
		query.Set("format", "json")

		req, err := http.NewRequest("GET", apiUrl+"?"+query.Encode(), nil)
		if err != nil {
			internalError(w, err)
			return
		}
		req.Header.Set("user-agent", userAgent)

		resp, err := http.DefaultClient.Do(req)
		if err != nil {
			internalError(w, err)
			return
		}
		defer resp.Body.Close()

		var results LastfmAlbumsResults
		err = render.DecodeJSON(resp.Body, &results)
		if err != nil {
			internalError(w, err)
			return
		}

		apiResponse := response{Albums: make([]album, 0, len(results.Results.Albummatches.Album))}
		for _, al := range results.Results.Albummatches.Album {
			cover := al.Image[2].Text
			if cover == "" {
				continue
			}

			record := album{Author: al.Artist, Title: al.Name, Url: cover}
			apiResponse.Albums = append(apiResponse.Albums, record)
		}

		render.JSON(w, r, &apiResponse)
	}
}

func (s *server) handleGetGames() http.HandlerFunc {
	type game struct {
		Title string `json:"title"`
		Url   string `json:"url"`
	}

	type response struct {
		Games []game `json:"games"`
	}

	apiUrl := "https://api.rawg.io/api/games"

	return func(w http.ResponseWriter, r *http.Request) {
		err := r.ParseForm()
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		search := r.Form.Get("search")
		query := &url.Values{}
		query.Set("search", search) // need to properly escape the query

		req, err := http.NewRequest("GET", apiUrl+"?"+query.Encode(), nil)
		if err != nil {
			internalError(w, err)
			return
		}
		req.Header.Set("user-agent", userAgent)

		resp, err := new(http.Client).Do(req)
		if err != nil {
			internalError(w, err)
			return
		}
		defer resp.Body.Close()

		var results RawgGamesResults
		err = render.DecodeJSON(resp.Body, &results)
		if err != nil {
			internalError(w, err)
			return
		}

		apiResponse := response{Games: make([]game, len(results.Results))}
		for i, res := range results.Results {
			apiResponse.Games[i].Title = res.Name
			apiResponse.Games[i].Url = res.BackgroundImage
		}

		render.JSON(w, r, &apiResponse)
	}
}

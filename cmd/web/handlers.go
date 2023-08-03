package main

import (
	"errors"
	"net/http"
	"net/url"
	"os"
	"strconv"

	"github.com/CloudyKit/jet/v6"
	"github.com/go-chi/render"

	"gitlab.com/sacules/chartsy/internal/models"
)

const (
	lastFmApi = "http://ws.audioscrobbler.com/2.0/"
	userAgent = "chartsy"
)

func (app *application) index(w http.ResponseWriter, r *http.Request) {
	c, err := app.charts.Get(1)
	if err != nil {
		if errors.Is(err, models.ErrNoRecord) {
			app.notFound(w)
		} else {
			app.serverError(w, err)
		}

		return
	}

	ts, err := app.templateSet.GetTemplate("base.jet.html")
	if err != nil {
		app.errorLog.Println(err.Error())
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	//data := &templateData{
	//Chart: c,
	//}

	err = ts.Execute(w, jet.VarMap{}, c)
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
}

type LastfmAlbumsResults struct {
	Results struct {
		Attr struct {
			For string `json:"for"`
		} `json:"@attr"`
		Albummatches struct {
			Album []struct {
				Artist string `json:"artist"`
				Image  []struct {
					Text string `json:"#text"`
					Size string `json:"size"`
				} `json:"image"`
				Mbid       string `json:"mbid"`
				Name       string `json:"name"`
				Streamable string `json:"streamable"`
				URL        string `json:"url"`
			} `json:"album"`
		} `json:"albummatches"`
		Opensearch_Query struct {
			Text        string `json:"#text"`
			Role        string `json:"role"`
			SearchTerms string `json:"searchTerms"`
			StartPage   string `json:"startPage"`
		} `json:"opensearch:Query"`
		Opensearch_itemsPerPage string `json:"opensearch:itemsPerPage"`
		Opensearch_startIndex   string `json:"opensearch:startIndex"`
		Opensearch_totalResults string `json:"opensearch:totalResults"`
	} `json:"results"`
}

type record struct {
	Title  string
	Author string
	Url    string
}

func (app *application) search(w http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		app.errorLog.Println(err)
		app.clientError(w, http.StatusBadRequest)
		return
	}

	s := r.PostForm.Get("search")
	apiKey, ok := os.LookupEnv("LASTFM_KEY")
	if !ok {
		app.errorLog.Println("missing LASTFM_KEY")
		return
	}
	query := &url.Values{}
	query.Set("method", "album.search")
	query.Set("album", s)
	query.Set("api_key", apiKey)
	query.Set("format", "json")

	req, err := http.NewRequest("GET", lastFmApi+"?"+query.Encode(), nil)
	if err != nil {
		app.serverError(w, err)
		return
	}
	req.Header.Set("user-agent", userAgent)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		app.serverError(w, err)
		return
	}
	defer resp.Body.Close()

	var results LastfmAlbumsResults
	err = render.DecodeJSON(resp.Body, &results)
	if err != nil {
		app.serverError(w, err)
		return
	}

	records := make([]record, 0, len(results.Results.Albummatches.Album))
	for _, al := range results.Results.Albummatches.Album {
		cover := al.Image[2].Text
		if cover == "" {
			continue
		}

		record := record{Author: al.Artist, Title: al.Name, Url: cover}
		records = append(records, record)
	}

	ts, err := app.templateSet.GetTemplate("search-results.jet.html")
	if err != nil {
		app.serverError(w, err)
		return
	}

	err = ts.Execute(w, nil, records)
	if err != nil {
		app.serverError(w, err)
		return
	}
}

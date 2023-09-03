package main

import (
	"errors"
	"net/http"
	"net/url"
	"os"
	"strconv"

	"github.com/go-chi/render"

	"gitlab.com/sacules/chartsy/internal/models"
	"gitlab.com/sacules/chartsy/internal/validator"
)

const (
	lastFmApi = "http://ws.audioscrobbler.com/2.0/"
	userAgent = "chartsy"
)

func (app *application) chart(w http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		app.serverError(w, err)
		return
	}

	var c *models.Chart

	id, err := strconv.Atoi(r.FormValue("id"))
	if err != nil {
		app.clientError(w, http.StatusBadRequest)
		return
	}

	c, err = app.charts.Get(id)
	if err != nil {
		if errors.Is(err, models.ErrNoRecord) {
			app.infoLog.Println(err)
			app.notFound(w)
		} else {
			app.serverError(w, err)
		}

		return
	}

	data := app.newTemplateData(r)
	data.Chart = c

	app.render(w, http.StatusOK, "chart", data)
}

type userSignupForm struct {
	Name                string `form:"name"`
	Email               string `form:"email"`
	Password            string `form:"password"`
	validator.Validator `form:"-"`
}

func (app *application) userSignup(w http.ResponseWriter, r *http.Request) {
	app.render(w, http.StatusOK, "signup", nil)
}

func (app *application) userSignupPost(w http.ResponseWriter, r *http.Request) {
	var form userSignupForm

	err := app.decodePostForm(r, &form)
	if err != nil {
		app.clientError(w, http.StatusBadRequest)
		return
	}

	form.CheckField(validator.NotBlank(form.Name), "name", "This field cannot be blank")
	form.CheckField(validator.NotBlank(form.Email), "email", "This field cannot be blank")
	form.CheckField(validator.Email(form.Email), "email", "This field must be a valid email address")
	form.CheckField(validator.NotBlank(form.Password), "password", "This field cannot be blank")
	form.CheckField(validator.MinChars(form.Password, 8), "password", "This field must be at least 8 characters long")

	if !form.Valid() {
		data := app.newTemplateData(r)
		data.Form = form

		app.render(w, http.StatusBadRequest, "signup", nil)
		return
	}

	err = app.users.Insert(form.Name, form.Email, form.Password)
	if err != nil {
		if errors.Is(err, models.ErrDuplicateEmail) {
			form.AddFieldError("email", "Email address is already in use")

			data := app.newTemplateData(r)
			data.Form = form

			app.render(w, http.StatusBadRequest, "signup", nil)
		} else {
			app.serverError(w, err)
		}

		return
	}

	app.sessionManager.Put(r.Context(), "flash", "Your signup was successful, please log in.")

	http.Redirect(w, r, "/login", http.StatusSeeOther)
}

func (app *application) userLogin(w http.ResponseWriter, r *http.Request) {
}

func (app *application) userLoginPost(w http.ResponseWriter, r *http.Request) {
}

func (app *application) userLogoutPost(w http.ResponseWriter, r *http.Request) {
}

func (app *application) chartSettings(w http.ResponseWriter, r *http.Request) {
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

type SearchResult struct {
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

	records := make([]SearchResult, 0, len(results.Results.Albummatches.Album))
	for _, al := range results.Results.Albummatches.Album {
		cover := al.Image[2].Text
		if cover == "" {
			continue
		}

		record := SearchResult{Author: al.Artist, Title: al.Name, Url: cover}
		records = append(records, record)
	}

	data := app.newTemplateData(r)
	data.SearchResults = records

	app.renderFragment(w, http.StatusOK, "chart", "search-results", data)
}

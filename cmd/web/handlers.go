package main

import (
	"errors"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"time"

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

	userID := 1

	id := r.FormValue("id")
	if id != "" {
		chartID, err := strconv.Atoi(id)
		if err != nil {
			app.errorLog.Println(err)
			app.clientError(w, http.StatusBadRequest)
			return
		}

		c, err := app.charts.Get(chartID, userID)
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
		data.CurrentChart = c

		app.render(w, http.StatusOK, "chart", data)
		return
	}

	// TODO: verificar que traiga solo las del usuario!!!
	charts, err := app.charts.Latest(userID, 100)
	if err != nil {
		if errors.Is(err, models.ErrNoRecord) {
			app.infoLog.Println(err)
			app.notFound(w)
		} else {
			app.serverError(w, err)
		}

		return
	}

	app.infoLog.Println("charts:", charts)
	c, err := app.charts.Get(charts[0].ID, userID)
	if err != nil {
		app.serverError(w, err)
		return
	}

	data := app.newTemplateData(r)
	data.CurrentChart = c

	app.render(w, http.StatusOK, "chart", data)
}

type userSignupForm struct {
	Email               string `form:"email"`
	Password            string `form:"password"`
	validator.Validator `form:"-"`
}

func (app *application) userSignupPost(w http.ResponseWriter, r *http.Request) {
	var form userSignupForm

	err := app.decodePostForm(r, &form)
	if err != nil {
		app.clientError(w, http.StatusBadRequest)
		return
	}

	form.CheckField(validator.NotBlank(form.Email), "email", "This field cannot be blank")
	form.CheckField(validator.Email(form.Email), "email", "This field must be a valid email address")
	form.CheckField(validator.NotBlank(form.Password), "password", "This field cannot be blank")
	form.CheckField(validator.MinChars(form.Password, 8), "password", "This field must be at least 8 characters long")

	if !form.Valid() {
		data := app.newTemplateData(r)
		data.Form = form

		app.renderFragment(w, http.StatusOK, "home", "signup", data)
		app.infoLog.Println("form invalid:", form)
		return
	}

	err = app.users.Insert(form.Email, form.Password)
	if err != nil {
		if errors.Is(err, models.ErrDuplicateEmail) {
			form.AddFieldError("email", "Email address is already in use")

			data := app.newTemplateData(r)
			data.Form = form

			app.renderFragment(w, http.StatusOK, "home", "signup", data)
		} else {
			app.serverError(w, err)
		}

		return
	}

	data := app.newTemplateData(r)
	data.Form = form

	app.renderFragment(w, http.StatusOK, "home", "signup-ok", data)

	verificationCode := randomString(8)
	err = app.verifications.Insert(form.Email, verificationCode)
	if err != nil {
		app.serverError(w, err)
		return
	}

	err = app.sendConfirmationEmail(form.Email, verificationCode)
	if err != nil {
		app.serverError(w, err)
		return
	}
}

func (app *application) userLogin(w http.ResponseWriter, r *http.Request) {
}

func (app *application) userLogout(w http.ResponseWriter, r *http.Request) {
}

func (app *application) emailVerify(w http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		app.errorLog.Println(err)
		app.clientError(w, http.StatusBadRequest)
		return
	}

	code := r.Form.Get("code")
	email := r.Form.Get("email")

	ver, err := app.verifications.Get(email)
	if err != nil {
		app.serverError(w, err)
		return
	}

	if ver.Code != code {
		app.clientError(w, http.StatusBadRequest)
		return
	}

	if ver.ExpiresAt.Before(time.Now()) {
		app.infoLog.Println("now:", time.Now())
		app.infoLog.Println("expires at:", ver.ExpiresAt)
		app.renderFragment(w, http.StatusUnauthorized, "base", "error/expired-code", nil)
		return
	}

	//TODO: mark user as verified, and delete the email from the verifications table

	http.Redirect(w, r, "/chart", http.StatusSeeOther)
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

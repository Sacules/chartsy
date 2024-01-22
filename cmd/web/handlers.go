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
	"gitlab.com/sacules/chartsy/ui/html"
)

const (
	lastFmApi = "http://ws.audioscrobbler.com/2.0/"
	userAgent = "chartsy"
)

func (app *application) index(w http.ResponseWriter, r *http.Request) {
	err := app.sessionManager.RenewToken(r.Context())
	if err != nil {
		app.serverError(w, err)
		return
	}

	data := app.newTemplateData(r)
	data.Form = html.UserSignupForm{}

	userID := app.sessionManager.GetInt(r.Context(), "authenticatedUserID")
	if userID == 0 {
		data.CurrentChart = models.NewChart()
	} else {
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

		data.Charts = charts
	}

	err = r.ParseForm()
	if err != nil {
		app.serverError(w, err)
		return
	}

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
				data.Charts = make([]models.Chart, 0)
			} else {
				app.serverError(w, err)
			}

			return
		}

		data.CurrentChart = c
	}

	app.renderTempl(w, r, http.StatusOK, html.Index(data.URL, data.IsDev, data.IsAuthenticated, data.CurrentChart, data.Charts))
}

func (app *application) chartNew(w http.ResponseWriter, r *http.Request) {
	err := app.sessionManager.RenewToken(r.Context())
	if err != nil {
		app.serverError(w, err)
		return
	}

	userID := app.sessionManager.GetInt(r.Context(), "authenticatedUserID")
	if userID == 0 {
		http.Redirect(w, r, "/", http.StatusSeeOther)
		return
	}

	id, err := app.charts.Insert(userID)
	if err != nil {
		app.serverError(w, err)
		return
	}

	c, err := app.charts.Get(id, userID)
	if err != nil {
		app.serverError(w, err)

		return
	}

	charts, err := app.charts.Latest(userID, 100)
	if err != nil {
		app.serverError(w, err)

		return
	}

	app.renderTempl(w, r, http.StatusOK, html.Body(true, c, charts))
}

type chartImagesForm struct {
	ID                  int            `form:"id"`
	Image               []models.Image `form:"image"`
	validator.Validator `form:"-"`
}

func (app *application) chartImages(w http.ResponseWriter, r *http.Request) {
	var form chartImagesForm

	err := app.decodePostForm(r, &form)
	if err != nil {
		app.clientError(w, http.StatusBadRequest)
		return
	}

	form.CheckField(validator.Positive(form.ID), "id", "ID invalid")

	if !form.Valid() {
		app.clientError(w, http.StatusBadRequest)
		return
	}

	err = app.sessionManager.RenewToken(r.Context())
	if err != nil {
		app.serverError(w, err)
		return
	}

	userID := app.sessionManager.GetInt(r.Context(), "authenticatedUserID")
	if userID == 0 {
		http.Redirect(w, r, "/", http.StatusSeeOther)
		return
	}

	c, err := app.charts.Get(form.ID, userID)
	if err != nil {
		if errors.Is(err, models.ErrNoRecord) {
			app.notFound(w)
			return
		}

		app.clientError(w, http.StatusBadRequest)
		return
	}

	if len(form.Image) != int(c.ColumnCount*c.RowCount) {
		app.clientError(w, http.StatusBadRequest)
		return
	}

	err = app.charts.UpdateImages(form.ID, form.Image)
	if err != nil {
		app.serverError(w, err)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (app *application) userSignupPost(w http.ResponseWriter, r *http.Request) {
	var form html.UserSignupForm

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

		app.renderTempl(w, r, http.StatusOK, html.Signup(form, nil))
		return
	}

	err = app.users.Insert(form.Email, form.Password)
	if err != nil {
		if errors.Is(err, models.ErrDuplicateEmail) {
			form.AddFieldError("email", "Email address is already in use")

			app.renderTempl(w, r, http.StatusOK, html.Signup(form, nil))
		} else {
			app.renderTempl(w, r, http.StatusOK, html.Signup(form, err))
			app.serverError(w, err)
		}

		return
	}

	//app.renderFragment(w, http.StatusOK, "home", "signup-ok", data)

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
	var form html.UserLoginForm

	err := app.decodePostForm(r, &form)
	if err != nil {
		app.clientError(w, http.StatusBadRequest)
		return
	}

	form.CheckField(validator.NotBlank(form.Email), "email", "This field cannot be blank")
	form.CheckField(validator.Email(form.Email), "email", "This field must be a valid email address")
	form.CheckField(validator.NotBlank(form.Password), "password", "This field cannot be blank")

	if !form.Valid() {
		data := app.newTemplateData(r)
		data.Form = form
		app.renderFragment(w, http.StatusOK, "chart", "login", data)

		return
	}

	id, err := app.users.Authenticate(form.Email, form.Password)
	if err != nil {
		if errors.Is(err, models.ErrInvalidCredentials) {
			form.AddFieldError("general", "Invalid username or password")

			data := app.newTemplateData(r)
			data.Form = form

			app.renderFragment(w, http.StatusOK, "chart", "login", data)
			return
		}

		app.serverError(w, err)

		return
	}

	err = app.sessionManager.RenewToken(r.Context())
	if err != nil {
		app.serverError(w, err)
		return
	}

	app.sessionManager.Put(r.Context(), "authenticatedUserID", id)

	http.Redirect(w, r, "/", http.StatusNoContent)
}

func (app *application) userLogout(w http.ResponseWriter, r *http.Request) {
	err := app.sessionManager.RenewToken(r.Context())
	if err != nil {
		app.serverError(w, err)
		return
	}

	app.sessionManager.Remove(r.Context(), "authenticatedUserID")

	http.Redirect(w, r, "/", http.StatusSeeOther)
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

	id, err := app.users.Verify(email)
	if err != nil {
		app.serverError(w, err)
		return
	}

	err = app.sessionManager.RenewToken(r.Context())
	if err != nil {
		app.serverError(w, err)
		return
	}

	app.sessionManager.Put(r.Context(), "authenticatedUserID", id)

	http.Redirect(w, r, "/", http.StatusSeeOther)
}

type chartSettingsForm struct {
	ID    int    `form:"id"`
	Title string `form:"title"`

	BackgroundColor        string `form:"bg-color"`
	BackgroundGradientFrom string `form:"bg-gradient-from"`
	BackgroundGradientTo   string `form:"bg-gradient-to"`
	BackgroundImageUrl     string `form:"bg-image-url"`

	Columns uint8 `form:"cols"`
	Rows    uint8 `form:"rows"`
	Spacing uint8 `form:"spacing"`
	Padding uint8 `form:"padding"`

	ImagesSize         uint8  `form:"images-size"`
	ImagesShape        string `form:"images-shape"`
	ImagesTextPosition string `form:"images-text-position"`

	validator.Validator `form:"-"`
}

func (app *application) chartSettings(w http.ResponseWriter, r *http.Request) {
	var form chartSettingsForm

	err := app.decodePostForm(r, &form)
	if err != nil {
		app.clientError(w, http.StatusBadRequest)
		return
	}

	form.CheckField(validator.NotZero(form.ID), "id", "ID can't be zero")
	form.CheckField(validator.MaxChars(form.Title, 128), "title", "Title too long")
	form.CheckField(validator.Matches(form.BackgroundColor, validator.RGBColorRegex), "bgColor", "Not a valid color")
	form.CheckField(validator.Matches(form.BackgroundGradientFrom, validator.RGBColorRegex), "bgGradientFrom", "Not a valid color")
	form.CheckField(validator.Matches(form.BackgroundGradientTo, validator.RGBColorRegex), "bgGradientTo", "Not a valid color")
	form.CheckField(validator.URL(form.BackgroundImageUrl), "bgImage", "Not a valid image URL")
	form.CheckField(validator.PermittedInt(int(form.Columns), 1, 2, 3, 4, 5, 6, 7, 8, 9, 10), "columns", "Not a valid number")
	form.CheckField(validator.PermittedInt(int(form.Rows), 1, 2, 3, 4, 5, 6, 7, 8, 9, 10), "rows", "Not a valid number")
	form.CheckField(validator.PermittedInt(int(form.Spacing), 0, 1, 2, 3, 4, 5), "spacing", "Not a valid number")
	form.CheckField(validator.PermittedInt(int(form.Padding), 0, 1, 2, 3, 4, 5), "padding", "Not a valid number")
	form.CheckField(validator.PermittedInt(int(form.ImagesSize), 150, 200), "imagesSize", "Not a valid number")

	if !form.Valid() {
		app.errorLog.Println("error validating form:", form.FieldErrors)
		return
	}

	err = app.charts.UpdateSettings(form.ID, form.Title, form.Columns, form.Rows, form.Spacing, form.Padding, form.ImagesSize)
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

	records := make([]html.SearchResult, 0, len(results.Results.Albummatches.Album))
	for _, al := range results.Results.Albummatches.Album {
		cover := al.Image[2].Text
		if cover == "" {
			continue
		}

		record := html.SearchResult{Author: al.Artist, Title: al.Name, Url: cover}
		records = append(records, record)
	}

	//app.renderFragment(w, http.StatusOK, "chart", "search/results", data)
	app.renderTempl(w, r, http.StatusOK, html.SearchResults(records))
}

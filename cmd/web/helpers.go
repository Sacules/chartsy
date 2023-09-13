package main

import (
	"bytes"
	"errors"
	"fmt"
	"math/rand"
	"net/http"
	"net/url"
	"os"
	"time"

	"github.com/go-playground/form/v4"
	mail "github.com/xhit/go-simple-mail/v2"

	"gitlab.com/sacules/chartsy/internal/models"
)

var (
	ErrMissingMailFrom = errors.New("email: missing EMAIL_FROM")
	ErrMissingMailPass = errors.New("email: missing EMAIL_PASS")
)

func (app *application) serverError(w http.ResponseWriter, err error) {
	app.errorLog.Println(err)

	http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
}

func (app *application) clientError(w http.ResponseWriter, status int) {
	http.Error(w, http.StatusText(status), status)
}

func (app *application) notFound(w http.ResponseWriter) {
	app.clientError(w, http.StatusNotFound)
}

type templateData struct {
	Env                 string
	CurrentChart        *models.Chart
	Charts              []models.Chart
	SearchResults       []SearchResult
	User                *models.User
	Form                any
	UserVerificationURL string
}

func (app *application) newTemplateData(r *http.Request) *templateData {
	return &templateData{
		Env: app.env,
	}
}

func (app *application) render(w http.ResponseWriter, status int, page string, data *templateData) {
	app.renderFragment(w, status, page, "base", data)
}

func (app *application) renderFragment(w http.ResponseWriter, status int, page, fragment string, data *templateData) {
	ts, ok := app.templateCache[page]
	if !ok {
		err := fmt.Errorf("the template %s doesn't exist", page)
		app.serverError(w, err)

		return
	}

	var buf bytes.Buffer
	err := ts.ExecuteTemplate(&buf, fragment, data)
	if err != nil {
		app.serverError(w, err)
		return
	}

	w.WriteHeader(status)
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Write(buf.Bytes())
}

func (app *application) decodePostForm(r *http.Request, dst any) error {
	err := r.ParseForm()
	if err != nil {
		return err
	}

	err = app.formDecoder.Decode(dst, r.PostForm)
	if err != nil {
		var invalidDecoderError *form.InvalidDecoderError

		if errors.As(err, &invalidDecoderError) {
			panic(err)
		}

		return err
	}

	return nil
}

func (app *application) sendConfirmationEmail(to, verificationCode string) error {
	from, ok := os.LookupEnv("EMAIL_FROM")
	if !ok {
		return ErrMissingMailFrom
	}
	password, ok := os.LookupEnv("EMAIL_PASS")
	if !ok {
		return ErrMissingMailPass
	}

	server := mail.NewSMTPClient()
	server.Host = "mail.privateemail.com"
	server.Port = 587
	server.Username = from
	server.Password = password
	server.Encryption = mail.EncryptionSTARTTLS
	server.ConnectTimeout = 20 * time.Second
	server.SendTimeout = 20 * time.Second

	client, err := server.Connect()
	if err != nil {
		return err
	}

	ts := app.templateCache["home"]

	params := url.Values{}
	params.Add("email", to)
	params.Add("code", verificationCode)
	data := &templateData{
		UserVerificationURL: "http://localhost:4000/verify?" + params.Encode(),
	}

	var buf bytes.Buffer
	err = ts.ExecuteTemplate(&buf, "confirmation-mail", data)
	if err != nil {
		return err
	}

	email := mail.NewMSG().
		SetFrom(from).
		AddTo(to).
		SetSubject("Confirm your e-mail address").
		SetBody(mail.TextHTML, buf.String())

	return email.Send(client)
}

func randomString(n int) string {
	letters := []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")
	r := rand.New(rand.NewSource(time.Now().UnixNano()))

	b := make([]rune, n)
	for i := range b {
		b[i] = letters[r.Intn(len(letters))]
	}

	return string(b)
}

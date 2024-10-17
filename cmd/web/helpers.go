package main

import (
	"bytes"
	"context"
	"errors"
	"math/rand"
	"net/http"
	"net/url"
	"os"
	"time"

	"github.com/a-h/templ"
	"github.com/go-playground/form/v4"
	mail "github.com/xhit/go-simple-mail/v2"

	"gitlab.com/sacules/chartsy/internal/models"
	"gitlab.com/sacules/chartsy/ui/html"
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

type TemplateData struct {
	IsDev           bool
	URL             string
	IsAuthenticated bool

	CurrentChart        *models.Chart
	Charts              []models.Chart
	SearchResults       []html.SearchResult
	User                *models.User
	Form                any
	UserVerificationURL string
}

func (app *application) newTemplateData(r *http.Request) *TemplateData {
	return &TemplateData{
		IsDev:           app.isDev,
		URL:             app.url,
		IsAuthenticated: app.isAuthenticated(r),
	}
}

func (app *application) renderTempl(w http.ResponseWriter, r *http.Request, status int, c templ.Component) {
	var buf bytes.Buffer
	err := c.Render(r.Context(), &buf)
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

	params := url.Values{}
	params.Add("email", to)
	params.Add("code", verificationCode)

	var buf bytes.Buffer
	c := html.EmailConfirm(app.url + "/verify?" + params.Encode())
	err = c.Render(context.Background(), &buf)
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

func (app *application) isAuthenticated(r *http.Request) bool {
	return app.sessionManager.Exists(r.Context(), "authenticatedUserID")

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

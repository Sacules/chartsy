package main

import (
	"bytes"
	"errors"
	"fmt"
	"net/http"

	"github.com/go-playground/form/v4"

	"gitlab.com/sacules/chartsy/internal/models"
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
	Env   string
	Chart *models.Chart
	Form  any
}

func (app *application) newTemplateData(r *http.Request) *templateData {
	return &templateData{
		Env: app.env,
	}
}

func (app *application) render(w http.ResponseWriter, status int, page string, data *templateData) {
	ts, ok := app.templateCache[page]
	if !ok {
		err := fmt.Errorf("the template %s doesn't exist", page)
		app.serverError(w, err)

		return
	}

	var buf bytes.Buffer
	err := ts.ExecuteTemplate(&buf, "base", data)
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

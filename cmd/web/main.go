package main

import (
	"flag"
	"html/template"
	"log"
	"net/http"
	"os"

	"github.com/Sacules/lrserver"
	"github.com/fsnotify/fsnotify"
	"github.com/go-playground/form/v4"
	"github.com/jmoiron/sqlx"
	_ "github.com/mattn/go-sqlite3"

	"gitlab.com/sacules/chartsy/internal/models"
)

func openDB(filename string) (*sqlx.DB, error) {
	db, err := sqlx.Open("sqlite3", filename)
	if err != nil {
		return nil, err
	}

	if err = db.Ping(); err != nil {
		return nil, err
	}

	return db, nil
}

type application struct {
	infoLog  *log.Logger
	errorLog *log.Logger
	env      string

	templateCache map[string]*template.Template
	formDecoder   *form.Decoder

	charts        *models.ChartModel
	users         *models.UserModel
	verifications *models.VerificationModel
}

func main() {
	addr := flag.String("addr", ":4000", "HTTP network address")
	dsn := flag.String("dsn", "chartsy.db", "SQLite3 db name")
	env := flag.String("env", "dev", "Whether this is a 'dev' or 'prod' environment")
	flag.Parse()

	infoLog := log.New(os.Stdout, "\033[1;32mINFO\033[0m\t", log.Ldate|log.Ltime)
	errorLog := log.New(os.Stderr, "\033[1;31mERROR\033[0m\t", log.Ldate|log.Ltime|log.Lshortfile)

	db, err := openDB(*dsn)
	if err != nil {
		errorLog.Fatal(err)
	}

	defer db.Close()

	templateCache, err := newTemplateCache()
	if err != nil {
		errorLog.Fatal(err)
	}

	formDecoder := form.NewDecoder()

	app := &application{
		infoLog:       infoLog,
		errorLog:      errorLog,
		templateCache: templateCache,
		formDecoder:   formDecoder,
		charts:        &models.ChartModel{DB: db},
		users:         &models.UserModel{DB: db},
		verifications: &models.VerificationModel{DB: db},
		env:           *env,
	}

	srv := &http.Server{
		Addr:     *addr,
		ErrorLog: errorLog,
		Handler:  app.routes(),
	}

	if *env == "dev" {
		watcher, err := fsnotify.NewWatcher()
		if err != nil {
			errorLog.Fatal(err)
		}

		defer watcher.Close()

		err = watcher.Add(".reloader")
		if err != nil {
			errorLog.Fatal(err)
		}

		lr := lrserver.New(lrserver.DefaultName, lrserver.DefaultPort)
		lr.SetStatusLog(infoLog)
		lr.SetErrorLog(errorLog)

		go lr.ListenAndServe()

		go func() {
			for {
				select {
				case event := <-watcher.Events:
					tc, err := newTemplateCache()
					if err != nil {
						errorLog.Fatal(err)
					}

					app.templateCache = tc

					lr.Reload(event.Name)

				case err := <-watcher.Errors:
					errorLog.Println(err)
				}
			}
		}()
	}

	infoLog.Printf("starting server on %s\n", *addr)
	errorLog.Fatal(srv.ListenAndServe())
}

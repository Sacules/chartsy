package main

import (
	"database/sql"
	"flag"
	"html/template"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/Sacules/lrserver"
	"github.com/alexedwards/scs/sqlite3store"
	"github.com/alexedwards/scs/v2"
	"github.com/fsnotify/fsnotify"
	"github.com/go-playground/form/v4"
	"github.com/jmoiron/sqlx"
	"github.com/joho/godotenv"
	_ "github.com/mattn/go-sqlite3"

	"gitlab.com/sacules/chartsy/internal/models"
)

func openDB(filename string) (*sql.DB, error) {
	db, err := sql.Open("sqlite3", filename)
	if err != nil {
		return nil, err
	}

	if err = db.Ping(); err != nil {
		return nil, err
	}

	return db, nil
}

type application struct {
	url      string
	isServer bool

	infoLog  *log.Logger
	errorLog *log.Logger

	templateCache  map[string]*template.Template
	formDecoder    *form.Decoder
	sessionManager *scs.SessionManager

	charts        *models.ChartModel
	users         *models.UserModel
	verifications *models.VerificationModel
}

func main() {
	addr := flag.String("addr", ":4000", "HTTP network address")
	dbName := flag.String("dbName", "chartsy.db", "SQLite3 db name")
	flag.Parse()

	infoLog := log.New(os.Stdout, "\033[1;32mINFO\033[0m\t", log.Ldate|log.Ltime)
	errorLog := log.New(os.Stderr, "\033[1;31mERROR\033[0m\t", log.Ldate|log.Ltime|log.Lshortfile)

	err := godotenv.Load()
	if err != nil {
		errorLog.Fatal(err)
	}

	env := os.Getenv("ENV")
	serverURL := os.Getenv("URL")

	db, err := openDB(*dbName)
	if err != nil {
		errorLog.Fatal(err)
	}

	defer db.Close()

	templateCache, err := newTemplateCache()
	if err != nil {
		errorLog.Fatal(err)
	}

	formDecoder := form.NewDecoder()

	sessionManager := scs.New()
	sessionManager.Store = sqlite3store.New(db)
	sessionManager.Lifetime = 12 * time.Hour

	sqlxDB := sqlx.NewDb(db, "sqlite3")

	app := &application{
		url:            serverURL,
		isServer:       env == "dev",
		infoLog:        infoLog,
		errorLog:       errorLog,
		sessionManager: sessionManager,
		templateCache:  templateCache,
		formDecoder:    formDecoder,
		charts:         &models.ChartModel{DB: sqlxDB},
		users:          &models.UserModel{DB: sqlxDB},
		verifications:  &models.VerificationModel{DB: sqlxDB},
	}

	srv := &http.Server{
		Addr:     *addr,
		ErrorLog: errorLog,
		Handler:  app.routes(),
	}

	if env == "dev" {
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

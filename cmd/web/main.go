package main

import (
	"database/sql"
	"flag"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/CloudyKit/jet/v6"
	"github.com/Sacules/lrserver"
	"github.com/alexedwards/scs/sqlite3store"
	"github.com/alexedwards/scs/v2"
	"github.com/fsnotify/fsnotify"
	"github.com/go-playground/form/v4"
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
	infoLog  *log.Logger
	errorLog *log.Logger
	env      string

	templateSet    *jet.Set
	sessionManager *scs.SessionManager
	formDecoder    *form.Decoder

	charts *models.ChartModel
	users  *models.UserModel
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

	// TODO: add some logic later
	if *env == "dev" {
		watcher, err := fsnotify.NewWatcher()
		if err != nil {
			errorLog.Fatal(err)
		}

		defer watcher.Close()

		// TODO: Automate this to auto detect all templates
		err = watcher.Add("ui/html")
		if err != nil {
			errorLog.Fatal(err)
		}

		err = watcher.Add("ui/html/components")
		if err != nil {
			errorLog.Fatal(err)
		}

		err = watcher.Add("ui/html/components/input")
		if err != nil {
			errorLog.Fatal(err)
		}

		err = watcher.Add("public/js")
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
					lr.Reload(event.Name)
				case err := <-watcher.Errors:
					errorLog.Println(err)
				}
			}
		}()
	}

	set := jet.NewSet(jet.NewOSFileSystemLoader("./ui/html"), jet.InDevelopmentMode())

	sessionManager := scs.New()
	sessionManager.Store = sqlite3store.New(db)
	sessionManager.Lifetime = 12 * time.Hour
	sessionManager.Cookie.Secure = true

	formDecoder := form.NewDecoder()

	app := &application{
		infoLog:        infoLog,
		errorLog:       errorLog,
		templateSet:    set,
		sessionManager: sessionManager,
		formDecoder:    formDecoder,
		charts:         &models.ChartModel{DB: db},
		users:          &models.UserModel{DB: db},
		env:            *env,
	}

	srv := &http.Server{
		Addr:     *addr,
		ErrorLog: errorLog,
		Handler:  app.routes(),
	}

	infoLog.Printf("starting server on %s\n", *addr)
	errorLog.Fatal(srv.ListenAndServe())
}

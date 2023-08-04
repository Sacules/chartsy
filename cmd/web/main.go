package main

import (
	"database/sql"
	"flag"
	"log"
	"net/http"
	"os"

	"github.com/CloudyKit/jet/v6"
	"github.com/Sacules/lrserver"
	"github.com/fsnotify/fsnotify"
	_ "github.com/go-sql-driver/mysql"

	"gitlab.com/sacules/chartsy/internal/models"
)

func openDB(dsn string) (*sql.DB, error) {
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return nil, err
	}

	if err = db.Ping(); err != nil {
		return nil, err
	}

	return db, nil
}

type application struct {
	infoLog     *log.Logger
	errorLog    *log.Logger
	templateSet *jet.Set

	charts *models.ChartModel
}

func main() {
	addr := flag.String("addr", ":4000", "HTTP network address")
	dsn := flag.String("dsn", "web:secret@/chartsy?parseTime=true", "MySQL data source name")
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
		watcher.Add("ui/html")
		if err != nil {
			errorLog.Fatal(err)
		}

		watcher.Add("ui/html/partials")
		if err != nil {
			errorLog.Fatal(err)
		}

		watcher.Add("ui/html/partials/input")
		if err != nil {
			errorLog.Fatal(err)
		}

		watcher.Add("ui/html/partials/icon")
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

	app := &application{
		infoLog:     infoLog,
		errorLog:    errorLog,
		charts:      &models.ChartModel{DB: db},
		templateSet: set,
	}

	srv := &http.Server{
		Addr:     *addr,
		ErrorLog: errorLog,
		Handler:  app.routes(),
	}

	infoLog.Printf("starting server on %s\n", *addr)
	errorLog.Fatal(srv.ListenAndServe())
}

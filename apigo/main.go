package main

import (
	"net/http"
	"os"

	"gitlab.com/sacules/log"
)

func run() error {
	s := newServer()

	s.routes()

	log.Info("listening on port 5000...")
	return http.ListenAndServe(":5000", s)
}

func main() {
	log.Info("start server...")
	if err := run(); err != nil {
		log.Info("error:", err)
		os.Exit(1)
	}
}

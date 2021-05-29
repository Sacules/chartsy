package main

import (
	"net/http"

	"gitlab.com/sacules/log"
)

func internalError(w http.ResponseWriter, err error) {
	log.Error(err)
	http.Error(w, err.Error(), http.StatusInternalServerError)
}

func Logger(next http.Handler) http.Handler {
	fn := func(w http.ResponseWriter, r *http.Request) {
		log.Info(r.Method, r.RequestURI)
		next.ServeHTTP(w, r)
	}

	return http.HandlerFunc(fn)
}

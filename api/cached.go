package main

type imdbCachedResult struct {
	Searchterm string `storm:"id"`
	Results    []imdbResponse
}

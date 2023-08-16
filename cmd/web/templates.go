package main

import (
	"html/template"
	"path/filepath"
)

func newTemplateCache() (map[string]*template.Template, error) {
	cache := map[string]*template.Template{}

	// file-based routing
	pagesDirs, err := filepath.Glob("ui/html/pages/*")
	if err != nil {
		return nil, err
	}

	pages := make(map[string][]string, 0)
	for _, dir := range pagesDirs {
		page := filepath.Base(dir)

		files, err := filepath.Glob(dir + "/*.html")
		if err != nil {
			return nil, err
		}

		pages[page] = files
	}

	base, err := filepath.Glob("ui/html/*.html")
	if err != nil {
		return nil, err
	}

	partials, err := filepath.Glob("ui/html/partials/*.html")
	if err != nil {
		return nil, err
	}

	for page, files := range pages {
		f := append(files, base...)
		f = append(f, partials...)

		ts, err := template.ParseFiles(f...)
		if err != nil {
			return nil, err
		}

		cache[page] = ts
	}

	return cache, nil
}

package models

import "net/url"

// Image represents the core of a chart, whether
// it is an Album, or a Movie, a Game, etc.
type Image struct {
	Title   string
	Caption string
	URL     url.URL
}

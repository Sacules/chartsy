package main

type LastfmAlbumsResults struct {
	Results struct {
		Attr struct {
			For string `json:"for"`
		} `json:"@attr"`
		Albummatches struct {
			Album []struct {
				Artist string `json:"artist"`
				Image  []struct {
					Text string `json:"#text"`
					Size string `json:"size"`
				} `json:"image"`
				Mbid       string `json:"mbid"`
				Name       string `json:"name"`
				Streamable string `json:"streamable"`
				URL        string `json:"url"`
			} `json:"album"`
		} `json:"albummatches"`
		Opensearch_Query struct {
			Text        string `json:"#text"`
			Role        string `json:"role"`
			SearchTerms string `json:"searchTerms"`
			StartPage   string `json:"startPage"`
		} `json:"opensearch:Query"`
		Opensearch_itemsPerPage string `json:"opensearch:itemsPerPage"`
		Opensearch_startIndex   string `json:"opensearch:startIndex"`
		Opensearch_totalResults string `json:"opensearch:totalResults"`
	} `json:"results"`
}

type RawgGamesResults struct {
	Count    int64       `json:"count"`
	Next     string      `json:"next"`
	Previous interface{} `json:"previous"`
	Results  []struct {
		Added         int64 `json:"added"`
		AddedByStatus struct {
			Beaten  int64 `json:"beaten"`
			Dropped int64 `json:"dropped"`
			Owned   int64 `json:"owned"`
			Playing int64 `json:"playing"`
			Toplay  int64 `json:"toplay"`
			Yet     int64 `json:"yet"`
		} `json:"added_by_status"`
		BackgroundImage string      `json:"background_image"`
		Clip            interface{} `json:"clip"`
		CommunityRating int64       `json:"community_rating"`
		DominantColor   string      `json:"dominant_color"`
		Genres          []struct {
			ID   int64  `json:"id"`
			Name string `json:"name"`
			Slug string `json:"slug"`
		} `json:"genres"`
		ID              int64  `json:"id"`
		Metacritic      int64  `json:"metacritic"`
		Name            string `json:"name"`
		ParentPlatforms []struct {
			Platform struct {
				ID   int64  `json:"id"`
				Name string `json:"name"`
				Slug string `json:"slug"`
			} `json:"platform"`
		} `json:"parent_platforms"`
		Platforms []struct {
			Platform struct {
				ID   int64  `json:"id"`
				Name string `json:"name"`
				Slug string `json:"slug"`
			} `json:"platform"`
		} `json:"platforms"`
		Playtime  int64   `json:"playtime"`
		Rating    float64 `json:"rating"`
		RatingTop int64   `json:"rating_top"`
		Ratings   []struct {
			Count   int64   `json:"count"`
			ID      int64   `json:"id"`
			Percent float64 `json:"percent"`
			Title   string  `json:"title"`
		} `json:"ratings"`
		RatingsCount     int64  `json:"ratings_count"`
		Released         string `json:"released"`
		ReviewsCount     int64  `json:"reviews_count"`
		ReviewsTextCount int64  `json:"reviews_text_count"`
		SaturatedColor   string `json:"saturated_color"`
		Score            string `json:"score"`
		ShortScreenshots []struct {
			ID    int64  `json:"id"`
			Image string `json:"image"`
		} `json:"short_screenshots"`
		Slug   string `json:"slug"`
		Stores []struct {
			Store struct {
				ID   int64  `json:"id"`
				Name string `json:"name"`
				Slug string `json:"slug"`
			} `json:"store"`
		} `json:"stores"`
		SuggestionsCount int64 `json:"suggestions_count"`
		Tags             []struct {
			GamesCount      int64  `json:"games_count"`
			ID              int64  `json:"id"`
			ImageBackground string `json:"image_background"`
			Language        string `json:"language"`
			Name            string `json:"name"`
			Slug            string `json:"slug"`
		} `json:"tags"`
		Tba      bool        `json:"tba"`
		UserGame interface{} `json:"user_game"`
	} `json:"results"`
	UserPlatforms bool `json:"user_platforms"`
}

type ImdbResults struct {
	ErrorMessage string `json:"errorMessage"`
	Expression   string `json:"expression"`
	Results      []struct {
		Description string `json:"description"`
		ID          string `json:"id"`
		Image       string `json:"image"`
		ResultType  string `json:"resultType"`
		Title       string `json:"title"`
	} `json:"results"`
	SearchType string `json:"searchType"`
}

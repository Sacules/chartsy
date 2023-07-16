USE chartsy;

INSERT INTO images (url, title, caption)
	VALUES (
		"https://lastfm.freetls.fastly.net/i/u/174s/b2021a88c4e80cc289e00c352252774a.png",
		"Deftones",
		"Deftones"
	),
	(
		"https://lastfm.freetls.fastly.net/i/u/174s/dc0bb5f042ff176493dac2223156f779.png",
		"Around the fur",
		"Deftones"
	);

INSERT INTO charts (updated, created) VALUES (
	UTC_TIMESTAMP(),
	UTC_TIMESTAMP()
);


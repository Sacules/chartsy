USE chartsy;

INSERT INTO charts (updated, created) VALUES (
	UTC_TIMESTAMP(),
	UTC_TIMESTAMP()
);

INSERT INTO images (url, title, caption)
	VALUES (
		"https://i.imgur.com/w4toMiR.jpg",
		"",
		""
	),
	(
		"https://lastfm.freetls.fastly.net/i/u/174s/b2021a88c4e80cc289e00c352252774a.png",
		"Deftones",
		"Deftones"
	),
	(
		"https://lastfm.freetls.fastly.net/i/u/174s/dc0bb5f042ff176493dac2223156f779.png",
		"Around the fur",
		"Deftones"
	);

INSERT INTO charts_images (chart_id, image_position, image_url)
	VALUES (
		1,
		0,
		"https://lastfm.freetls.fastly.net/i/u/174s/b2021a88c4e80cc289e00c352252774a.png"
	),
	(
		1,
		1,
		"https://lastfm.freetls.fastly.net/i/u/174s/dc0bb5f042ff176493dac2223156f779.png"
	),
	(
		1,
		2,
		"https://lastfm.freetls.fastly.net/i/u/174s/dc0bb5f042ff176493dac2223156f779.png"
	),
	(
		1,
		3,
		"https://lastfm.freetls.fastly.net/i/u/174s/dc0bb5f042ff176493dac2223156f779.png"
	),
	(
		1,
		4,
		"https://lastfm.freetls.fastly.net/i/u/174s/dc0bb5f042ff176493dac2223156f779.png"
	),
	(
		1,
		5,
		"https://lastfm.freetls.fastly.net/i/u/174s/dc0bb5f042ff176493dac2223156f779.png"
	);
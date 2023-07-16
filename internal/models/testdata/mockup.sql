USE chartsy;

INSERT INTO charts (updated, created) VALUES (
	UTC_TIMESTAMP(),
	UTC_TIMESTAMP()
);

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

INSERT INTO charts_images (chart_id, image_url)
	VALUES (
		1,
		"https://lastfm.freetls.fastly.net/i/u/174s/b2021a88c4e80cc289e00c352252774a.png"
	),
	(
		1,
		"https://lastfm.freetls.fastly.net/i/u/174s/dc0bb5f042ff176493dac2223156f779.png"
	),
	(
		1,
		"https://lastfm.freetls.fastly.net/i/u/174s/dc0bb5f042ff176493dac2223156f779.png"
	),
	(
		1,
		"https://lastfm.freetls.fastly.net/i/u/174s/dc0bb5f042ff176493dac2223156f779.png"
	),
	(
		1,
		"https://lastfm.freetls.fastly.net/i/u/174s/dc0bb5f042ff176493dac2223156f779.png"
	),
	(
		1,
		"https://lastfm.freetls.fastly.net/i/u/174s/dc0bb5f042ff176493dac2223156f779.png"
	);

INSERT INTO chart_settings (chart_id, title, column_count, row_count, spacing, margin, image_width, image_height, bg_color, text_color, images_text_placement)
	VALUES (1, "[b][color=red]Welcome to the internet[/color][/b]", 3, 2, 2, 4, 100, 100, "#069420", "#420690", "inline");

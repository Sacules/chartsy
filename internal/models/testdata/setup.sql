CREATE TABLE IF NOT EXISTS charts (
	created				   TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated				   TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	title				   VARCHAR(128) DEFAULT 'Untitled chart' NOT NULL,
	column_count		   TINYINT(8) DEFAULT 3 NOT NULL,
	row_count			   TINYINT(8) DEFAULT 3 NOT NULL,
	spacing				   TINYINT(8) DEFAULT 4 NOT NULL,
	padding				   TINYINT(8) DEFAULT 4 NOT NULL,
	images_shape		   TEXT CHECK(images_shape IN ('square', 'portrait')) DEFAULT 'square' NOT NULL,
	images_height		   TINYINT(8) DEFAULT 150 NOT NULL,
	images_rounded_corners BOOLEAN DEFAULT false NOT NULL,
	bg_color			   CHAR(7) DEFAULT "#f1f5f9" NOT NULL, -- dark:slate-100
	text_color			   CHAR(7) DEFAULT "#020617" NOT NULL, -- dark:slate-950
	images_text_placement  TEXT CHECK(images_text_placement IN ('hide', 'inline', 'left', 'right', 'below', 'overlay')) DEFAULT 'hide' NOT NULL
);

CREATE TABLE IF NOT EXISTS images (
	url		VARCHAR(255) DEFAULT 'https://i.imgur.com/w4toMiR.jpg' NOT NULL PRIMARY KEY,
	title	VARCHAR(255) DEFAULT '' NOT NULL,
	caption VARCHAR(255) DEFAULT '' NOT NULL
);

CREATE TABLE IF NOT EXISTS charts_images (
	chart_id	   INTEGER NOT NULL,
	image_url	   VARCHAR(255) DEFAULT 'https://i.imgur.com/w4toMiR.jpg' NOT NULL,
	image_position TINYINT(8) NOT NULL,
	FOREIGN KEY (chart_id)
		REFERENCES charts(id)
		ON DELETE CASCADE,
	FOREIGN KEY (image_url)
		REFERENCES images(url)
);

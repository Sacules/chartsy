CREATE TABLE IF NOT EXISTS charts (
	user_id INTEGER NOT NULL,
	name    VARCHAR(128) DEFAULT 'Unnamed chart' NOT NULL,
	created	TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated	TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

	title		 VARCHAR(128) DEFAULT "" NOT NULL,
	column_count TINYINT(8) DEFAULT 3 NOT NULL,
	row_count	 TINYINT(8) DEFAULT 3 NOT NULL,
	spacing		 TINYINT(8) DEFAULT 4 NOT NULL,
	padding		 TINYINT(8) DEFAULT 4 NOT NULL,

	images_shape		 TEXT CHECK(images_shape IN ('square', 'portrait')) DEFAULT 'square' NOT NULL,
	images_text_position TEXT CHECK(images_text_position IN ('hide', 'inline', 'left', 'right', 'below', 'overlay')) DEFAULT 'hide' NOT NULL,
	images_size		     TINYINT(8) CHECK(images_size IN (150, 200)) DEFAULT 150 NOT NULL,

	bg_color		 CHAR(7) DEFAULT "#f1f5f9" NOT NULL, -- dark:slate-100
	bg_gradient_from CHAR(7) DEFAULT "#f1f5f9" NOT NULL, -- dark:slate-100
	bg_gradient_to   CHAR(7) DEFAULT "#020617" NOT NULL, -- dark:slate-950
	text_color		 CHAR(7) DEFAULT "#020617" NOT NULL, -- dark:slate-950

	FOREIGN KEY (user_id)
		REFERENCES users(id)
		ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS images (
	url		VARCHAR(255) NOT NULL UNIQUE,
	title	VARCHAR(255) DEFAULT '' NOT NULL,
	caption VARCHAR(255) DEFAULT '' NOT NULL
);

CREATE TABLE IF NOT EXISTS charts_images (
	chart_id	   INTEGER NOT NULL,
	image_id	   INTEGER NOT NULL,
	image_position TINYINT(8) NOT NULL,
	FOREIGN KEY (chart_id)
		REFERENCES charts(id)
		ON DELETE CASCADE,
	FOREIGN KEY (image_id)
		REFERENCES images(id)
);

CREATE TABLE IF NOT EXISTS sessions (
	token  TEXT PRIMARY KEY,
	data   BLOB NOT NULL,
	expiry REAL NOT NULL
);

CREATE INDEX IF NOT EXISTS sessions_expiry_idx ON sessions(expiry);

CREATE TABLE IF NOT EXISTS users (
	email			VARCHAR(255) NOT NULL UNIQUE,
	hashed_password CHAR(60) NOT NULL,
	is_verified     BOOLEAN DEFAULT FALSE NOT NULL,
	created			TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS verifications (
	email		VARCHAR(255) NOT NULL UNIQUE PRIMARY KEY,
	code		CHAR(8) NOT NULL,
	expires_at	TIMESTAMP NOT NULL
);

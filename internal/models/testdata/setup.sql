DROP DATABASE IF EXISTS chartsy;

CREATE DATABASE IF NOT EXISTS chartsy
	CHARACTER SET utf8mb4
	COLLATE utf8mb4_unicode_ci;

USE chartsy;

CREATE TABLE IF NOT EXISTS charts (
	id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
	created DATETIME NOT NULL,
	updated DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS images (
	url VARCHAR(128) NOT NULL PRIMARY KEY,
	title VARCHAR(255) NOT NULL,
	caption VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS charts_images (
	id SERIAL PRIMARY KEY,
	chart_id INTEGER NOT NULL,
	image_url VARCHAR(128) NOT NULL,
	image_position TINYINT(8) UNSIGNED NOT NULL,
	FOREIGN KEY (chart_id)
		REFERENCES charts(id)
		ON DELETE CASCADE,
	FOREIGN KEY (image_url)
		REFERENCES images(url)
);

CREATE TABLE IF NOT EXISTS chart_settings (
	chart_id INTEGER NOT NULL PRIMARY KEY,
	title VARCHAR(128) NOT NULL,
	column_count TINYINT(8) UNSIGNED NOT NULL,
	row_count TINYINT(8) UNSIGNED NOT NULL,
	spacing TINYINT(8) UNSIGNED NOT NULL,
	margin TINYINT(8) UNSIGNED NOT NULL,
	image_shape ENUM('square', 'portrait') NOT NULL,
	image_height TINYINT(8) UNSIGNED NOT NULL,
	bg_color CHAR(7) NOT NULL,
	text_color CHAR(7) NOT NULL,
	images_text_placement ENUM('hide', 'inline', 'left', 'right', 'below') NOT NULL,
	FOREIGN KEY (chart_id)
		REFERENCES charts(id)
		ON DELETE CASCADE
);

-- Triggers
DELIMITER #

CREATE PROCEDURE default_chart_images(IN chart_id INTEGER)
	BEGIN
		DECLARE i INT DEFAULT 0;
		DECLARE n INT DEFAULT 0;

		SELECT cs.row_count * cs.column_count
			INTO n
			FROM chart_settings cs
			WHERE cs.chart_id = chart_id;

		WHILE (i < n) DO
			INSERT INTO charts_images (
				chart_id,
				image_url,
				image_position
			)
			VALUES (
				chart_id,
				"https://i.imgur.com/w4toMiR.jpg",
				i
			);

			SET i = i + 1;
		END WHILE;
	END#


CREATE TRIGGER default_chart_settings
	AFTER INSERT ON charts
	FOR EACH ROW
	BEGIN
		INSERT INTO chart_settings (
			chart_id,
			title,
			column_count,
			row_count,
			spacing,
			margin,
			image_shape,
			image_height,
			bg_color,
			text_color,
			images_text_placement
		)
		VALUES (
			NEW.id,
			"Untitled chart",
			3,
			3,
			2,
			4,
			"square",
			100,
			"#069420",
			"#420690",
			"hide"
		);

		CALL default_chart_images(NEW.id);
	END#

DELIMITER ;

-- Default values
INSERT INTO images (url, title, caption)
	VALUES (
		"https://i.imgur.com/w4toMiR.jpg",
		"",
		""
	);

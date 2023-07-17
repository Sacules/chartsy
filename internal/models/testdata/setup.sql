DROP DATABASE IF EXISTS chartsy;

CREATE DATABASE IF NOT EXISTS chartsy
	CHARACTER SET utf8mb4
	COLLATE utf8mb4_unicode_ci;

USE chartsy;

CREATE TABLE IF NOT EXISTS charts (
	id					  INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
	created				  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
	updated				  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
	title				  VARCHAR(128) DEFAULT 'Untitled chart' NOT NULL,
	column_count		  TINYINT(8) UNSIGNED DEFAULT 3 NOT NULL,
	row_count			  TINYINT(8) UNSIGNED DEFAULT 3 NOT NULL,
	spacing				  TINYINT(8) UNSIGNED DEFAULT 2 NOT NULL,
	padding				  TINYINT(8) UNSIGNED DEFAULT 8 NOT NULL,
	image_shape			  ENUM('square', 'portrait') DEFAULT 'square' NOT NULL,
	image_height		  TINYINT(8) UNSIGNED DEFAULT 96 NOT NULL,
	bg_color			  CHAR(7) DEFAULT "#475569" NOT NULL,
	text_color			  CHAR(7) DEFAULT "#f8fafc" NOT NULL,
	images_text_placement ENUM('hide', 'inline', 'left', 'right', 'below', 'overlay') DEFAULT 'hide' NOT NULL
);

CREATE TABLE IF NOT EXISTS images (
	url		VARCHAR(128) DEFAULT 'https://i.imgur.com/w4toMiR.jpg' NOT NULL PRIMARY KEY,
	title	VARCHAR(255) DEFAULT '' NOT NULL,
	caption VARCHAR(255) DEFAULT '' NOT NULL
);

CREATE TABLE IF NOT EXISTS charts_images (
	id			   SERIAL PRIMARY KEY,
	chart_id	   INTEGER NOT NULL,
	image_url	   VARCHAR(128) NOT NULL,
	image_position TINYINT(8) UNSIGNED NOT NULL,
	FOREIGN KEY (chart_id)
		REFERENCES charts(id)
		ON DELETE CASCADE,
	FOREIGN KEY (image_url)
		REFERENCES images(url)
);

-- Triggers
DELIMITER #

CREATE PROCEDURE default_chart_images(IN chart_id INTEGER)
	BEGIN
		DECLARE i INT DEFAULT 0;
		DECLARE n INT DEFAULT 0;

		SELECT charts.row_count * charts.column_count
			INTO n
			FROM charts
			WHERE charts.id = chart_id;

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
		CALL default_chart_images(NEW.id);
	END#

DELIMITER ;

DROP DATABASE IF EXISTS chartsy;

CREATE DATABASE IF NOT EXISTS chartsy
	CHARACTER SET utf8mb4
	COLLATE utf8mb4_unicode_ci;

USE chartsy;

CREATE TABLE IF NOT EXISTS charts (
	id					   INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
	created				   DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated				   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
	title				   VARCHAR(128) DEFAULT 'Untitled chart' NOT NULL,
	column_count		   TINYINT(8) UNSIGNED DEFAULT 3 NOT NULL,
	row_count			   TINYINT(8) UNSIGNED DEFAULT 3 NOT NULL,
	spacing				   TINYINT(8) UNSIGNED DEFAULT 4 NOT NULL,
	padding				   TINYINT(8) UNSIGNED DEFAULT 8 NOT NULL,
	images_shape		   ENUM('square', 'portrait') DEFAULT 'square' NOT NULL,
	images_height		   TINYINT(8) UNSIGNED DEFAULT 150 NOT NULL,
	images_rounded_corners BOOLEAN DEFAULT false NOT NULL,
	bg_color			   CHAR(7) DEFAULT "#475569" NOT NULL,
	text_color			   CHAR(7) DEFAULT "#f8fafc" NOT NULL,
	images_text_placement  ENUM('hide', 'inline', 'left', 'right', 'below', 'overlay') DEFAULT 'hide' NOT NULL
);

CREATE TABLE IF NOT EXISTS images (
	url		VARCHAR(255) DEFAULT 'https://i.imgur.com/w4toMiR.jpg' NOT NULL PRIMARY KEY,
	title	VARCHAR(255) DEFAULT '' NOT NULL,
	caption VARCHAR(255) DEFAULT '' NOT NULL
);

CREATE TABLE IF NOT EXISTS charts_images (
	id			   SERIAL PRIMARY KEY,
	chart_id	   INTEGER NOT NULL,
	image_url	   VARCHAR(255) DEFAULT 'https://i.imgur.com/w4toMiR.jpg' NOT NULL,
	image_position TINYINT(8) UNSIGNED NOT NULL,
	FOREIGN KEY (chart_id)
		REFERENCES charts(id)
		ON DELETE CASCADE,
	FOREIGN KEY (image_url)
		REFERENCES images(url)
);

-- Triggers
DELIMITER #

CREATE TRIGGER default_chart_settings
	AFTER INSERT ON charts
	FOR EACH ROW
	BEGIN
		DECLARE total_imgs INT;
		DECLARE i INT DEFAULT 0;

		SET total_imgs = NEW.row_count * NEW.column_count;

		WHILE i < total_imgs DO
			INSERT INTO charts_images (
				chart_id,
				image_url,
				image_position
			)
			VALUES (
				NEW.id,
				DEFAULT,
				i
			);

			SET i = i + 1;
		END WHILE;
	END#

CREATE TRIGGER update_chart_settings
	AFTER UPDATE ON charts
	FOR EACH ROW
	sp: BEGIN
		DECLARE prev_total_imgs INT; -- The previous setting
		DECLARE curr_total_imgs INT; -- The previous setting
		DECLARE generated_total_imgs INT; -- How many we have actually *generated*
		DECLARE i INT; -- Some dumb counter

		SET prev_total_imgs = OLD.row_count * OLD.column_count;
		SET curr_total_imgs = NEW.row_count * NEW.column_count;

		IF prev_total_imgs >= curr_total_imgs THEN
			LEAVE sp;
		END IF;

		SELECT COUNT(ci.image_url)
			INTO generated_total_imgs
			FROM charts_images ci
			WHERE ci.chart_id = NEW.id;

		IF curr_total_imgs <= generated_total_imgs THEN
			LEAVE sp;
		END IF;

		SET i = generated_total_imgs;
		WHILE i < curr_total_imgs DO
			INSERT INTO charts_images (
				chart_id,
				image_url,
				image_position
			)
			VALUES (
				NEW.id,
				DEFAULT,
				i
			);

			SET i = i + 1;
		END WHILE;
	END#

DELIMITER ;

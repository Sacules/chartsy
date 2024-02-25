package models

import (
	"database/sql"
	"errors"
	"strconv"
	"strings"
	"time"

	"github.com/jmoiron/sqlx"
)

const ImageBlankURI = "data:image/gif;base64,R0lGODlhAQABAIAAAP7//wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=="

// Image represents the core of a chart, whether
// it is an Album, a Movie, a Game, etc.
type Image struct {
	ID      int    `db:"rowid"`
	Title   string `db:"title" form:"title"`
	Caption string `db:"caption" form:"caption"`
	URL     string `db:"url" form:"url"`
}

type ImagesTextPosition string

const (
	ImagesTextHide    ImagesTextPosition = "hide"
	ImagesTextInline  ImagesTextPosition = "inline"
	ImagesTextLeft    ImagesTextPosition = "left"
	ImagesTextRight   ImagesTextPosition = "right"
	ImagesTextBelow   ImagesTextPosition = "below"
	ImagesTextOverlay ImagesTextPosition = "overlay"
)

type ImagesShape string

const (
	ImageShapeSquare   = "square"
	ImageShapePortrait = "portrait"
)

type Chart struct {
	ID      int       `db:"rowid"`
	UserID  int       `db:"user_id"`
	Name    string    `db:"name"`
	Created time.Time `db:"created"`
	Updated time.Time `db:"updated"`

	Images      []Image `db:"-"`
	Title       string  `db:"title"`
	ColumnCount uint8   `db:"column_count"`
	RowCount    uint8   `db:"row_count"`
	Spacing     uint8   `db:"spacing"`
	Padding     uint8   `db:"padding"`

	ImagesSize         uint8              `db:"images_size"`
	ImagesShape        ImagesShape        `db:"images_shape"`
	ImagesTextPosition ImagesTextPosition `db:"images_text_position"`

	BgColor        string `db:"bg_color"`
	BgGradientFrom string `db:"bg_gradient_from"`
	BgGradientTo   string `db:"bg_gradient_to"`
	BgImageURL     string `db:"bg_image_url"`

	TextColor string `db:"text_color"`
}

type ChartModel struct {
	DB *sqlx.DB
}

func NewChart() *Chart {
	imgs := make([]Image, 100)
	for i := range imgs {
		imgs[i] = Image{URL: ImageBlankURI}
	}

	return &Chart{
		Images:             imgs,
		ColumnCount:        3,
		RowCount:           3,
		Spacing:            4,
		Padding:            4,
		ImagesSize:         150,
		ImagesShape:        ImageShapeSquare,
		ImagesTextPosition: ImagesTextHide,
		TextColor:          "#020617",
		BgColor:            "#ffffff",
		BgGradientFrom:     "#000000",
		BgGradientTo:       "#ffffff",
		BgImageURL:         ImageBlankURI,
	}
}

func (m *ChartModel) Insert(userID int) (int, error) {
	query := `INSERT INTO charts (user_id)
				VALUES (?)`

	result, err := m.DB.Exec(query, userID)
	if err != nil {
		return 0, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	stmt := `INSERT INTO
				charts_images (image_id, chart_id, image_position)
				VALUES (1, ?, !);`

	b := strings.Builder{}

	// Generate 100 images for each new chart
	ids := make([]any, 100)
	for i := range ids {
		ids[i] = id
		line := strings.Replace(stmt, "!", strconv.Itoa(i), 1)

		b.WriteString(line)
	}

	tx, err := m.DB.Begin()
	if err != nil {
		return 0, err
	}
	_, err = tx.Exec(b.String(), ids...)
	if err != nil {
		return 0, err
	}

	err = tx.Commit()
	if err != nil {
		return 0, err
	}

	return int(id), nil
}

func (m *ChartModel) Get(id, userID int) (*Chart, error) {
	query := `SELECT rowid, *
			  FROM charts
			  WHERE rowid = ?
			  AND user_id = ?`

	c := &Chart{}
	err := m.DB.Get(c, query, id, userID)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrNoRecord
		}

		return nil, err
	}

	query = `SELECT images.rowid, title, caption, url
		FROM images
		JOIN charts_images ci
		ON images.rowid = ci.image_id
		WHERE ci.chart_id = ?
		ORDER BY ci.image_position ASC`

	images := []Image{}

	err = m.DB.Select(&images, query, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrNoRecord
		}

		return nil, err
	}

	c.Images = images

	return c, nil
}

func (m *ChartModel) Latest(userID, n int) ([]Chart, error) {
	cs := []Chart{}
	query := `SELECT rowid, name, updated
				FROM charts
				WHERE user_id = ?
				ORDER BY updated ASC
				LIMIT ?`

	err := m.DB.Select(&cs, query, userID, n)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrNoRecord
		}

		return nil, err
	}

	return cs, nil
}

func (m *ChartModel) UpdateSettings(id int, title string, columns, rows, spacing, padding, imgsSize uint8) error {
	query := `UPDATE charts
				SET title = ?, column_count = ?, row_count = ?,
					spacing = ?, padding = ?, images_size = ?
				WHERE rowid = ?`

	_, err := m.DB.Exec(query, title, columns, rows, spacing, padding, imgsSize, id)

	return err
}

func (m *ChartModel) UpdateImages(id int, imgs []Image) error {
	for i, img := range imgs {
		stmt := `INSERT INTO images (title, caption, url)
					VALUES (?, ?, ?)
					ON CONFLICT DO NOTHING`

		_, err := m.DB.Exec(stmt, img.Title, img.Caption, img.URL)
		if err != nil {
			return err
		}

		imgID := 0

		query := `SELECT rowid
					FROM images
					WHERE url = ?`
		err = m.DB.Get(&imgID, query, img.URL)
		if err != nil {
			return err
		}

		stmt = `UPDATE charts_images
					SET image_id = ?
					WHERE chart_id = ? AND image_position = ?`

		_, err = m.DB.Exec(stmt, imgID, id, i)
		if err != nil {
			return err
		}
	}

	return nil
}
